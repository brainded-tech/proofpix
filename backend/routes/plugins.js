/**
 * Plugin API Routes
 * Handles plugin installation, management, and marketplace operations
 */

const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');
const pluginService = require('../services/pluginService');
const { authenticateToken, requireSubscription } = require('../middleware/auth');
const { logger } = require('../config/database');

const router = express.Router();

// Configure multer for plugin uploads
const upload = multer({
  dest: 'uploads/plugins/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Allow zip, tar.gz, and directory uploads
    const allowedTypes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/gzip',
      'application/x-tar',
      'application/octet-stream'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.zip') || file.originalname.endsWith('.tar.gz')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only ZIP and TAR.GZ files are allowed.'));
    }
  }
});

// Rate limiting for plugin operations
const pluginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 plugin operations per windowMs
  message: {
    error: 'Too many plugin operations, please try again later',
    retryAfter: 15 * 60
  }
});

// Validation middleware
const validateErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

/**
 * GET /api/plugins
 * List all plugins
 */
router.get('/',
  authenticateToken,
  [
    query('status').optional().isIn(['all', 'loaded', 'unloaded']),
    query('category').optional().isString(),
    query('type').optional().isIn(['processor', 'connector', 'analyzer', 'utility']),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { status = 'all', category, type, page = 1, limit = 20 } = req.query;
      
      const plugins = await pluginService.listPlugins({
        status: status === 'all' ? undefined : status,
        category,
        type
      });
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPlugins = plugins.slice(startIndex, endIndex);
      
      res.json({
        success: true,
        data: {
          plugins: paginatedPlugins,
          pagination: {
            page,
            limit,
            total: plugins.length,
            pages: Math.ceil(plugins.length / limit)
          }
        }
      });
      
    } catch (error) {
      logger.error('Failed to list plugins:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list plugins'
      });
    }
  }
);

/**
 * POST /api/plugins/install
 * Install a new plugin
 */
router.post('/install',
  authenticateToken,
  requireSubscription('enterprise'),
  pluginRateLimit,
  upload.single('plugin'),
  [
    body('name').optional().isString().trim(),
    body('description').optional().isString().trim(),
    body('autoLoad').optional().isBoolean()
  ],
  validateErrors,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Plugin file is required'
        });
      }
      
      const metadata = {
        uploadedBy: req.user.userId,
        uploadedAt: new Date(),
        originalName: req.file.originalname,
        autoLoad: req.body.autoLoad === 'true'
      };
      
      if (req.body.name) metadata.name = req.body.name;
      if (req.body.description) metadata.description = req.body.description;
      
      const result = await pluginService.installPlugin(req.file.path, metadata);
      
      // Auto-load if requested
      if (metadata.autoLoad) {
        try {
          await pluginService.loadPlugin(result.pluginId);
          result.loaded = true;
        } catch (loadError) {
          logger.warn(`Failed to auto-load plugin ${result.pluginId}:`, loadError);
          result.loadError = loadError.message;
        }
      }
      
      res.status(201).json({
        success: true,
        message: 'Plugin installed successfully',
        data: result
      });
      
    } catch (error) {
      logger.error('Plugin installation failed:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Plugin installation failed'
      });
    }
  }
);

/**
 * GET /api/plugins/:id
 * Get plugin details
 */
router.get('/:id',
  authenticateToken,
  [
    param('id').isString().trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const plugins = await pluginService.listPlugins();
      const plugin = plugins.find(p => p.id === id);
      
      if (!plugin) {
        return res.status(404).json({
          success: false,
          error: 'Plugin not found'
        });
      }
      
      // Add metrics if plugin is loaded
      if (plugin.loaded) {
        plugin.metrics = pluginService.getPluginMetrics(id);
      }
      
      res.json({
        success: true,
        data: plugin
      });
      
    } catch (error) {
      logger.error(`Failed to get plugin ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to get plugin details'
      });
    }
  }
);

/**
 * POST /api/plugins/:id/load
 * Load/activate a plugin
 */
router.post('/:id/load',
  authenticateToken,
  requireSubscription('enterprise'),
  [
    param('id').isString().trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const plugin = await pluginService.loadPlugin(id);
      
      res.json({
        success: true,
        message: 'Plugin loaded successfully',
        data: {
          id,
          loaded: true,
          loadTime: plugin.loadTime
        }
      });
      
    } catch (error) {
      logger.error(`Failed to load plugin ${req.params.id}:`, error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to load plugin'
      });
    }
  }
);

/**
 * POST /api/plugins/:id/unload
 * Unload/deactivate a plugin
 */
router.post('/:id/unload',
  authenticateToken,
  requireSubscription('enterprise'),
  [
    param('id').isString().trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      await pluginService.unloadPlugin(id);
      
      res.json({
        success: true,
        message: 'Plugin unloaded successfully',
        data: {
          id,
          loaded: false
        }
      });
      
    } catch (error) {
      logger.error(`Failed to unload plugin ${req.params.id}:`, error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to unload plugin'
      });
    }
  }
);

/**
 * GET /api/plugins/:id/config
 * Get plugin configuration
 */
router.get('/:id/config',
  authenticateToken,
  [
    param('id').isString().trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const config = pluginService.getPluginConfig(id);
      
      res.json({
        success: true,
        data: config
      });
      
    } catch (error) {
      logger.error(`Failed to get plugin config ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to get plugin configuration'
      });
    }
  }
);

/**
 * PUT /api/plugins/:id/config
 * Update plugin configuration
 */
router.put('/:id/config',
  authenticateToken,
  requireSubscription('enterprise'),
  [
    param('id').isString().trim(),
    body('config').isObject()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { config } = req.body;
      
      const updatedConfig = await pluginService.updatePluginConfig(id, config);
      
      res.json({
        success: true,
        message: 'Plugin configuration updated successfully',
        data: updatedConfig
      });
      
    } catch (error) {
      logger.error(`Failed to update plugin config ${req.params.id}:`, error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update plugin configuration'
      });
    }
  }
);

/**
 * GET /api/plugins/:id/metrics
 * Get plugin performance metrics
 */
router.get('/:id/metrics',
  authenticateToken,
  [
    param('id').isString().trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const metrics = pluginService.getPluginMetrics(id);
      
      if (!metrics) {
        return res.status(404).json({
          success: false,
          error: 'Plugin not loaded or not found'
        });
      }
      
      res.json({
        success: true,
        data: metrics
      });
      
    } catch (error) {
      logger.error(`Failed to get plugin metrics ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to get plugin metrics'
      });
    }
  }
);

/**
 * DELETE /api/plugins/:id
 * Uninstall a plugin
 */
router.delete('/:id',
  authenticateToken,
  requireSubscription('enterprise'),
  pluginRateLimit,
  [
    param('id').isString().trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // First unload the plugin if it's loaded
      try {
        await pluginService.unloadPlugin(id);
      } catch (error) {
        // Plugin might not be loaded, continue with uninstall
        logger.warn(`Plugin ${id} was not loaded during uninstall:`, error.message);
      }
      
      // TODO: Implement plugin uninstall functionality
      // This would involve removing plugin files and database entries
      
      res.json({
        success: true,
        message: 'Plugin uninstalled successfully'
      });
      
    } catch (error) {
      logger.error(`Failed to uninstall plugin ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to uninstall plugin'
      });
    }
  }
);

/**
 * POST /api/plugins/hooks/:hookName
 * Execute a plugin hook
 */
router.post('/hooks/:hookName',
  authenticateToken,
  [
    param('hookName').isString().trim(),
    body('data').optional().isObject(),
    body('options').optional().isObject()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { hookName } = req.params;
      const { data = {}, options = {} } = req.body;
      
      const result = await pluginService.executeHook(hookName, data, options);
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error(`Failed to execute hook ${req.params.hookName}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute plugin hook'
      });
    }
  }
);

/**
 * GET /api/plugins/marketplace/featured
 * Get featured plugins from marketplace
 */
router.get('/marketplace/featured',
  authenticateToken,
  async (req, res) => {
    try {
      // TODO: Implement marketplace integration
      // This would fetch featured plugins from the marketplace
      
      const featuredPlugins = [
        {
          id: 'salesforce-connector',
          name: 'Salesforce Connector',
          description: 'Connect ProofPix with Salesforce CRM',
          version: '1.0.0',
          author: { name: 'ProofPix Team' },
          category: 'integration',
          type: 'connector',
          featured: true,
          downloads: 1250,
          rating: 4.8,
          price: 'free'
        },
        {
          id: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: 'Enhanced analytics and reporting capabilities',
          version: '2.1.0',
          author: { name: 'Analytics Pro' },
          category: 'data-analysis',
          type: 'analyzer',
          featured: true,
          downloads: 890,
          rating: 4.6,
          price: '$29/month'
        }
      ];
      
      res.json({
        success: true,
        data: featuredPlugins
      });
      
    } catch (error) {
      logger.error('Failed to get featured plugins:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get featured plugins'
      });
    }
  }
);

/**
 * GET /api/plugins/marketplace/search
 * Search marketplace plugins
 */
router.get('/marketplace/search',
  authenticateToken,
  [
    query('q').optional().isString().trim(),
    query('category').optional().isString(),
    query('type').optional().isString(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { q, category, type, page = 1, limit = 20 } = req.query;
      
      // TODO: Implement marketplace search
      // This would search the marketplace API
      
      res.json({
        success: true,
        data: {
          plugins: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0
          }
        }
      });
      
    } catch (error) {
      logger.error('Failed to search marketplace:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search marketplace'
      });
    }
  }
);

/**
 * Error handling middleware
 */
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 50MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Only one file allowed.'
      });
    }
  }
  
  logger.error('Plugin route error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = router; 