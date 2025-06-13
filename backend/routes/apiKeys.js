const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const apiKeyService = require('../services/apiKeyService');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/apiKeys.log' })
  ]
});


// Rate limiting for API key operations
const apiKeyLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { error: 'Too many API key requests, please try again later' }
});

// Validation middleware
const validateApiKeyCreation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('API key name must be between 1 and 100 characters'),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),
  body('rateLimitPerMinute')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Rate limit per minute must be between 1 and 1000'),
  body('rateLimitPerHour')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Rate limit per hour must be between 1 and 10000'),
  body('rateLimitPerDay')
    .optional()
    .isInt({ min: 1, max: 100000 })
    .withMessage('Rate limit per day must be between 1 and 100000'),
  body('ipWhitelist')
    .optional()
    .isArray()
    .withMessage('IP whitelist must be an array'),
  body('webhookUrl')
    .optional()
    .isURL()
    .withMessage('Webhook URL must be a valid URL'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expires at must be a valid ISO 8601 date')
];

const validateApiKeyUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('API key name must be between 1 and 100 characters'),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),
  body('rateLimitPerMinute')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Rate limit per minute must be between 1 and 1000'),
  body('rateLimitPerHour')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Rate limit per hour must be between 1 and 10000'),
  body('rateLimitPerDay')
    .optional()
    .isInt({ min: 1, max: 100000 })
    .withMessage('Rate limit per day must be between 1 and 100000'),
  body('ipWhitelist')
    .optional()
    .isArray()
    .withMessage('IP whitelist must be an array'),
  body('webhookUrl')
    .optional()
    .isURL()
    .withMessage('Webhook URL must be a valid URL'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Is active must be a boolean'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expires at must be a valid ISO 8601 date')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
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

// API Key Management Routes

// Create new API key
router.post('/',
  authenticateToken,
  apiKeyLimit,
  validateApiKeyCreation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        name,
        permissions,
        rateLimitPerMinute,
        rateLimitPerHour,
        rateLimitPerDay,
        ipWhitelist,
        webhookUrl,
        webhookSecret,
        expiresAt
      } = req.body;

      const options = {
        permissions,
        rateLimitPerMinute,
        rateLimitPerHour,
        rateLimitPerDay,
        ipWhitelist,
        webhookUrl,
        webhookSecret,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      };

      const result = await apiKeyService.generateApiKey(req.user.id, name, options);

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get all user's API keys
router.get('/',
  authenticateToken,
  async (req, res) => {
    try {
      const apiKeys = await apiKeyService.getUserApiKeys(req.user.id);

      res.json({
        success: true,
        apiKeys
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get specific API key details
router.get('/:apiKeyId',
  authenticateToken,
  async (req, res) => {
    try {
      const { apiKeyId } = req.params;
      const apiKeys = await apiKeyService.getUserApiKeys(req.user.id);
      const apiKey = apiKeys.find(key => key.id === parseInt(apiKeyId));

      if (!apiKey) {
        return res.status(404).json({
          success: false,
          error: 'API key not found'
        });
      }

      res.json({
        success: true,
        apiKey
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Update API key
router.put('/:apiKeyId',
  authenticateToken,
  apiKeyLimit,
  validateApiKeyUpdate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { apiKeyId } = req.params;
      const updates = {};

      // Map request body to database fields
      if (req.body.name !== undefined) updates.key_name = req.body.name;
      if (req.body.permissions !== undefined) updates.permissions = req.body.permissions;
      if (req.body.rateLimitPerMinute !== undefined) updates.rate_limit_per_minute = req.body.rateLimitPerMinute;
      if (req.body.rateLimitPerHour !== undefined) updates.rate_limit_per_hour = req.body.rateLimitPerHour;
      if (req.body.rateLimitPerDay !== undefined) updates.rate_limit_per_day = req.body.rateLimitPerDay;
      if (req.body.ipWhitelist !== undefined) updates.ip_whitelist = req.body.ipWhitelist;
      if (req.body.webhookUrl !== undefined) updates.webhook_url = req.body.webhookUrl;
      if (req.body.webhookSecret !== undefined) updates.webhook_secret = req.body.webhookSecret;
      if (req.body.expiresAt !== undefined) updates.expires_at = req.body.expiresAt ? new Date(req.body.expiresAt) : null;

      const result = await apiKeyService.updateApiKey(apiKeyId, req.user.id, updates);

      res.json({
        success: true,
        apiKey: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Deactivate API key
router.post('/:apiKeyId/deactivate',
  authenticateToken,
  apiKeyLimit,
  async (req, res) => {
    try {
      const { apiKeyId } = req.params;
      const result = await apiKeyService.deactivateApiKey(apiKeyId, req.user.id);

      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Reactivate API key
router.post('/:apiKeyId/activate',
  authenticateToken,
  apiKeyLimit,
  async (req, res) => {
    try {
      const { apiKeyId } = req.params;
      const result = await apiKeyService.updateApiKey(apiKeyId, req.user.id, { is_active: true });

      res.json({
        success: true,
        message: 'API key activated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Delete API key
router.delete('/:apiKeyId',
  authenticateToken,
  apiKeyLimit,
  async (req, res) => {
    try {
      const { apiKeyId } = req.params;
      const result = await apiKeyService.deleteApiKey(apiKeyId, req.user.id);

      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// API Key Analytics

// Get API key usage analytics
router.get('/:apiKeyId/analytics',
  authenticateToken,
  async (req, res) => {
    try {
      const { apiKeyId } = req.params;
      const { startDate, endDate } = req.query;

      // Default to last 30 days if no dates provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const analytics = await apiKeyService.getApiKeyAnalytics(apiKeyId, req.user.id, start, end);

      res.json({
        success: true,
        analytics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get API key usage summary
router.get('/:apiKeyId/usage',
  authenticateToken,
  async (req, res) => {
    try {
      const { apiKeyId } = req.params;
      const { period = '24h' } = req.query;

      let startDate;
      const endDate = new Date();

      switch (period) {
        case '1h':
          startDate = new Date(Date.now() - 60 * 60 * 1000);
          break;
        case '24h':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      }

      const analytics = await apiKeyService.getApiKeyAnalytics(apiKeyId, req.user.id, startDate, endDate);

      // Calculate summary metrics
      const totalRequests = analytics.usageByEndpoint.reduce((sum, endpoint) => sum + parseInt(endpoint.request_count), 0);
      const avgResponseTime = analytics.usageByEndpoint.reduce((sum, endpoint) => sum + parseFloat(endpoint.avg_response_time || 0), 0) / analytics.usageByEndpoint.length || 0;
      const successRate = analytics.statusCodes.reduce((rate, status) => {
        const statusCode = parseInt(status.status_code);
        if (statusCode >= 200 && statusCode < 300) {
          return rate + parseInt(status.count);
        }
        return rate;
      }, 0) / totalRequests * 100 || 0;

      res.json({
        success: true,
        usage: {
          period,
          totalRequests,
          avgResponseTime: Math.round(avgResponseTime * 100) / 100,
          successRate: Math.round(successRate * 100) / 100,
          topEndpoints: analytics.usageByEndpoint.slice(0, 5),
          statusCodes: analytics.statusCodes
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// API Key Testing

// Test API key connectivity
router.post('/:apiKeyId/test',
  authenticateToken,
  apiKeyLimit,
  async (req, res) => {
    try {
      const { apiKeyId } = req.params;
      
      // Get API key details
      const apiKeys = await apiKeyService.getUserApiKeys(req.user.id);
      const apiKey = apiKeys.find(key => key.id === parseInt(apiKeyId));

      if (!apiKey) {
        return res.status(404).json({
          success: false,
          error: 'API key not found'
        });
      }

      if (!apiKey.is_active) {
        return res.status(400).json({
          success: false,
          error: 'API key is not active'
        });
      }

      // Simulate a test request
      const testResult = {
        success: true,
        message: 'API key is working correctly',
        keyId: apiKey.id,
        keyName: apiKey.key_name,
        permissions: apiKey.permissions,
        rateLimits: {
          perMinute: apiKey.rate_limit_per_minute,
          perHour: apiKey.rate_limit_per_hour,
          perDay: apiKey.rate_limit_per_day
        },
        lastUsed: apiKey.last_used_at,
        usageCount: apiKey.usage_count,
        testTimestamp: new Date().toISOString()
      };

      res.json(testResult);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// API Key Information

// Get available permissions
router.get('/info/permissions',
  authenticateToken,
  async (req, res) => {
    try {
      const permissions = [
        {
          name: 'files:read',
          description: 'Read file information and metadata'
        },
        {
          name: 'files:write',
          description: 'Update file metadata and settings'
        },
        {
          name: 'files:upload',
          description: 'Upload new files'
        },
        {
          name: 'files:delete',
          description: 'Delete files'
        },
        {
          name: 'exif:extract',
          description: 'Extract EXIF metadata from images'
        },
        {
          name: 'exif:read',
          description: 'Read EXIF metadata'
        },
        {
          name: 'thumbnails:generate',
          description: 'Generate thumbnails for images'
        },
        {
          name: 'thumbnails:read',
          description: 'Access thumbnail images'
        },
        {
          name: 'batch:process',
          description: 'Process multiple files in batch operations'
        },
        {
          name: 'webhooks:manage',
          description: 'Create and manage webhooks'
        },
        {
          name: 'analytics:read',
          description: 'Access usage analytics and statistics'
        },
        {
          name: 'admin:read',
          description: 'Administrative access (full permissions)'
        }
      ];

      res.json({
        success: true,
        permissions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get rate limit recommendations
router.get('/info/rate-limits',
  authenticateToken,
  async (req, res) => {
    try {
      const recommendations = {
        development: {
          perMinute: 60,
          perHour: 1000,
          perDay: 10000,
          description: 'Suitable for development and testing'
        },
        production: {
          perMinute: 300,
          perHour: 5000,
          perDay: 50000,
          description: 'Suitable for production applications'
        },
        enterprise: {
          perMinute: 1000,
          perHour: 20000,
          perDay: 200000,
          description: 'Suitable for high-volume enterprise applications'
        }
      };

      res.json({
        success: true,
        recommendations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Global API Analytics (Admin only)
router.get('/analytics/global',
  authenticateToken,
  async (req, res) => {
    try {
      // Check if user has admin permissions
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }

      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const analytics = await apiKeyService.getGlobalApiAnalytics(start, end);

      res.json({
        success: true,
        analytics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get API key analytics
router.get('/analytics',
  authenticateToken,
  async (req, res) => {
    try {
      const { timeRange = '24h' } = req.query;
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '1h':
          startDate.setHours(startDate.getHours() - 1);
          break;
        case '24h':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate.setDate(startDate.getDate() - 1);
      }

      const analytics = await apiKeyService.getApiKeyAnalytics(req.user.id, startDate, endDate);

      res.json({
        success: true,
        data: {
          usage: analytics,
          timeRange,
          period: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
          }
        }
      });
    } catch (error) {
      logger.error('Failed to get API key analytics:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Error handling middleware
router.use((error, req, res, next) => {
  logger.error('API key route error:', { error: error.message, stack: error.stack });
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = router; 