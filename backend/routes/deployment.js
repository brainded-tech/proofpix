/**
 * Deployment Routes - Priority 20: Enterprise Deployment & Scaling
 * Provides API endpoints for deployment automation, scaling, and infrastructure management
 */

const express = require('express');
const router = express.Router();
const deploymentService = require('../services/deploymentService');
const { requireAuth, requireSubscription } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');

// Rate limiting for deployment endpoints
const deploymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 deployment requests per windowMs
  message: 'Too many deployment requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
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

// Apply rate limiting to all deployment routes
router.use(deploymentRateLimit);

/**
 * GET /api/deployment/environments
 * Get available deployment environments
 */
router.get('/environments', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const environments = deploymentService.config.environments;
    
    res.json({
      success: true,
      data: {
        environments: Object.keys(environments).map(name => ({
          name,
          ...environments[name],
          current: name === deploymentService.state.currentEnvironment
        }))
      }
    });
  } catch (error) {
    console.error('Failed to get deployment environments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve deployment environments'
    });
  }
});

/**
 * POST /api/deployment/deploy
 * Deploy application to specified environment
 */
router.post('/deploy',
  requireAuth,
  requireSubscription('enterprise'),
  [
    body('environment').isIn(['development', 'staging', 'production']),
    body('config').optional().isObject(),
    body('force').optional().isBoolean()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { environment, config = {}, force = false } = req.body;
      
      // Check if deployment is already in progress for this environment
      const activeDeployments = Array.from(deploymentService.state.deployments.values())
        .filter(d => d.environment === environment && d.status === 'in-progress');
      
      if (activeDeployments.length > 0 && !force) {
        return res.status(409).json({
          success: false,
          message: 'Deployment already in progress for this environment',
          data: { activeDeployment: activeDeployments[0].id }
        });
      }

      const deployment = await deploymentService.deployToEnvironment(environment, config);
      
      res.status(201).json({
        success: true,
        message: 'Deployment started successfully',
        data: deployment
      });
    } catch (error) {
      console.error('Failed to start deployment:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to start deployment'
      });
    }
  }
);

/**
 * GET /api/deployment/deployments
 * Get deployment history
 */
router.get('/deployments',
  requireAuth,
  requireSubscription('enterprise'),
  [
    query('environment').optional().isIn(['development', 'staging', 'production']),
    query('status').optional().isIn(['in-progress', 'completed', 'failed']),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { environment, status, limit = 20, offset = 0 } = req.query;
      
      let deployments = Array.from(deploymentService.state.deployments.values());
      
      // Apply filters
      if (environment) {
        deployments = deployments.filter(d => d.environment === environment);
      }
      if (status) {
        deployments = deployments.filter(d => d.status === status);
      }
      
      // Sort by start time (newest first)
      deployments.sort((a, b) => b.startTime - a.startTime);
      
      // Apply pagination
      const total = deployments.length;
      const paginatedDeployments = deployments.slice(offset, offset + limit);
      
      res.json({
        success: true,
        data: {
          deployments: paginatedDeployments,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total
          }
        }
      });
    } catch (error) {
      console.error('Failed to get deployments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve deployments'
      });
    }
  }
);

/**
 * GET /api/deployment/deployments/:deploymentId
 * Get specific deployment details
 */
router.get('/deployments/:deploymentId',
  requireAuth,
  requireSubscription('enterprise'),
  [
    param('deploymentId').isString().trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { deploymentId } = req.params;
      
      const deployment = deploymentService.getDeploymentStatus(deploymentId);
      
      if (!deployment) {
        return res.status(404).json({
          success: false,
          message: 'Deployment not found'
        });
      }
      
      res.json({
        success: true,
        data: deployment
      });
    } catch (error) {
      console.error('Failed to get deployment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve deployment'
      });
    }
  }
);

/**
 * POST /api/deployment/scale
 * Scale application instances
 */
router.post('/scale',
  requireAuth,
  requireSubscription('enterprise'),
  [
    body('environment').isIn(['development', 'staging', 'production']),
    body('instances').isInt({ min: 1, max: 50 }),
    body('reason').optional().isString().trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { environment, instances, reason = 'manual' } = req.body;
      
      const scalingResult = await deploymentService.scaleApplication(environment, instances, reason);
      
      res.json({
        success: true,
        message: 'Scaling operation completed',
        data: scalingResult
      });
    } catch (error) {
      console.error('Failed to scale application:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to scale application'
      });
    }
  }
);

/**
 * GET /api/deployment/scaling/history
 * Get scaling event history
 */
router.get('/scaling/history',
  requireAuth,
  requireSubscription('enterprise'),
  [
    query('environment').optional().isIn(['development', 'staging', 'production']),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { environment, limit = 50 } = req.query;
      
      let scalingHistory = deploymentService.getScalingHistory();
      
      // Filter by environment if specified
      if (environment) {
        scalingHistory = scalingHistory.filter(event => event.environment === environment);
      }
      
      // Apply limit
      scalingHistory = scalingHistory.slice(0, limit);
      
      res.json({
        success: true,
        data: {
          scalingEvents: scalingHistory,
          total: scalingHistory.length
        }
      });
    } catch (error) {
      console.error('Failed to get scaling history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve scaling history'
      });
    }
  }
);

/**
 * GET /api/deployment/health
 * Get deployment health status
 */
router.get('/health', requireAuth, async (req, res) => {
  try {
    const healthChecks = deploymentService.getHealthCheckHistory();
    const metrics = deploymentService.getMetrics();
    
    // Determine overall health status
    const recentChecks = healthChecks.slice(-10); // Last 10 checks
    const healthyChecks = recentChecks.filter(check => check.status === 'healthy').length;
    const healthPercentage = recentChecks.length > 0 ? (healthyChecks / recentChecks.length) * 100 : 100;
    
    const overallStatus = healthPercentage >= 80 ? 'healthy' : 
                         healthPercentage >= 50 ? 'degraded' : 'unhealthy';
    
    res.json({
      success: true,
      data: {
        status: overallStatus,
        healthPercentage,
        metrics,
        recentChecks: recentChecks.slice(-5), // Last 5 checks
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Failed to get deployment health:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve deployment health'
    });
  }
});

/**
 * GET /api/deployment/metrics
 * Get deployment metrics and statistics
 */
router.get('/metrics', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const metrics = deploymentService.getMetrics();
    const scalingHistory = deploymentService.getScalingHistory();
    const healthChecks = deploymentService.getHealthCheckHistory();
    
    // Calculate additional metrics
    const recentScalingEvents = scalingHistory.filter(event => 
      Date.now() - event.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
    );
    
    const recentHealthChecks = healthChecks.filter(check => 
      Date.now() - check.timestamp < 60 * 60 * 1000 // Last hour
    );
    
    const healthyChecks = recentHealthChecks.filter(check => check.status === 'healthy').length;
    const currentHealthRate = recentHealthChecks.length > 0 ? 
      (healthyChecks / recentHealthChecks.length) * 100 : 100;
    
    res.json({
      success: true,
      data: {
        ...metrics,
        scalingEventsLast24h: recentScalingEvents.length,
        currentHealthRate,
        averageDeploymentTime: deploymentService.calculateAverageDeploymentTime(
          Array.from(deploymentService.state.deployments.values())
        ),
        environments: Object.keys(deploymentService.config.environments),
        currentEnvironment: deploymentService.state.currentEnvironment
      }
    });
  } catch (error) {
    console.error('Failed to get deployment metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve deployment metrics'
    });
  }
});

/**
 * GET /api/deployment/reports
 * Generate deployment reports
 */
router.get('/reports',
  requireAuth,
  requireSubscription('enterprise'),
  [
    query('startDate').isISO8601(),
    query('endDate').isISO8601(),
    query('environment').optional().isIn(['development', 'staging', 'production'])
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { startDate, endDate, environment } = req.query;
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'Start date must be before end date'
        });
      }
      
      const report = await deploymentService.generateDeploymentReport(start, end);
      
      // Filter by environment if specified
      if (environment) {
        report.deployments = report.deployments.filter(d => d.environment === environment);
        report.scalingEvents = report.scalingEvents.filter(e => e.environment === environment);
      }
      
      res.json({
        success: true,
        data: {
          ...report,
          period: { startDate, endDate },
          generatedAt: Date.now()
        }
      });
    } catch (error) {
      console.error('Failed to generate deployment report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate deployment report'
      });
    }
  }
);

/**
 * GET /api/deployment/config
 * Get deployment configuration
 */
router.get('/config', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const config = {
      environments: deploymentService.config.environments,
      scaling: deploymentService.config.scaling,
      healthCheck: deploymentService.config.healthCheck,
      loadBalancer: deploymentService.config.loadBalancer,
      monitoring: deploymentService.config.monitoring
    };
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Failed to get deployment config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve deployment configuration'
    });
  }
});

/**
 * PUT /api/deployment/config
 * Update deployment configuration
 */
router.put('/config',
  requireAuth,
  requireSubscription('enterprise'),
  [
    body('scaling').optional().isObject(),
    body('healthCheck').optional().isObject(),
    body('loadBalancer').optional().isObject(),
    body('monitoring').optional().isObject()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { scaling, healthCheck, loadBalancer, monitoring } = req.body;
      
      // Update configuration (in a real implementation, this would persist to database)
      if (scaling) {
        Object.assign(deploymentService.config.scaling, scaling);
      }
      if (healthCheck) {
        Object.assign(deploymentService.config.healthCheck, healthCheck);
      }
      if (loadBalancer) {
        Object.assign(deploymentService.config.loadBalancer, loadBalancer);
      }
      if (monitoring) {
        Object.assign(deploymentService.config.monitoring, monitoring);
      }
      
      res.json({
        success: true,
        message: 'Deployment configuration updated successfully',
        data: {
          scaling: deploymentService.config.scaling,
          healthCheck: deploymentService.config.healthCheck,
          loadBalancer: deploymentService.config.loadBalancer,
          monitoring: deploymentService.config.monitoring
        }
      });
    } catch (error) {
      console.error('Failed to update deployment config:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update deployment configuration'
      });
    }
  }
);

/**
 * POST /api/deployment/rollback
 * Rollback to previous deployment
 */
router.post('/rollback',
  requireAuth,
  requireSubscription('enterprise'),
  [
    body('environment').isIn(['development', 'staging', 'production']),
    body('targetDeploymentId').optional().isString().trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { environment, targetDeploymentId } = req.body;
      
      // Get deployment history for environment
      const deployments = Array.from(deploymentService.state.deployments.values())
        .filter(d => d.environment === environment && d.status === 'completed')
        .sort((a, b) => b.endTime - a.endTime);
      
      if (deployments.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'No previous deployment available for rollback'
        });
      }
      
      // Determine target deployment
      const targetDeployment = targetDeploymentId ? 
        deployments.find(d => d.id === targetDeploymentId) : 
        deployments[1]; // Second most recent (previous)
      
      if (!targetDeployment) {
        return res.status(404).json({
          success: false,
          message: 'Target deployment not found'
        });
      }
      
      // Perform rollback (simulate)
      const rollbackDeployment = await deploymentService.deployToEnvironment(
        environment, 
        { 
          ...targetDeployment.config,
          rollback: true,
          rollbackFrom: deployments[0].id,
          rollbackTo: targetDeployment.id
        }
      );
      
      res.json({
        success: true,
        message: 'Rollback completed successfully',
        data: {
          rollbackDeployment,
          rolledBackFrom: deployments[0].id,
          rolledBackTo: targetDeployment.id
        }
      });
    } catch (error) {
      console.error('Failed to rollback deployment:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to rollback deployment'
      });
    }
  }
);

module.exports = router; 