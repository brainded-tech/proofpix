/**
 * Integration Routes - Enterprise Integrations Hub
 * Provides API endpoints for third-party integrations and data synchronization
 */

const express = require('express');
const router = express.Router();
const integrationService = require('../services/integrationService');
const { requireAuth, requireSubscription } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for integration endpoints
const integrationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many integration requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all integration routes
router.use(integrationRateLimit);

/**
 * GET /api/integrations/available
 * Get list of available integrations
 */
router.get('/available', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const integrations = integrationService.getAvailableIntegrations();
    
    res.json({
      success: true,
      data: integrations
    });
  } catch (error) {
    console.error('Failed to get available integrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve available integrations'
    });
  }
});

/**
 * POST /api/integrations/connections
 * Create new integration connection
 */
router.post('/connections', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { integrationName, credentials, config = {} } = req.body;
    
    if (!integrationName || !credentials) {
      return res.status(400).json({
        success: false,
        message: 'Integration name and credentials are required'
      });
    }

    const connectionId = await integrationService.createConnection(integrationName, credentials, config);
    
    res.json({
      success: true,
      data: { connectionId },
      message: 'Integration connection created successfully'
    });
  } catch (error) {
    console.error('Failed to create integration connection:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create integration connection'
    });
  }
});

/**
 * GET /api/integrations/connections
 * Get user's integration connections
 */
router.get('/connections', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { page = 1, limit = 20, integrationName } = req.query;
    
    // This would typically query a database for user's connections
    // For now, return a placeholder response
    const connections = {
      connections: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        pages: 0
      },
      filters: { integrationName }
    };
    
    res.json({
      success: true,
      data: connections
    });
  } catch (error) {
    console.error('Failed to get integration connections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve integration connections'
    });
  }
});

/**
 * GET /api/integrations/connections/:connectionId
 * Get specific integration connection
 */
router.get('/connections/:connectionId', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { connectionId } = req.params;
    
    const connection = await integrationService.getConnection(connectionId);
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Integration connection not found'
      });
    }

    // Remove sensitive credentials from response
    const safeConnection = {
      ...connection,
      credentials: '[ENCRYPTED]'
    };
    
    res.json({
      success: true,
      data: safeConnection
    });
  } catch (error) {
    console.error('Failed to get integration connection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve integration connection'
    });
  }
});

/**
 * POST /api/integrations/connections/:connectionId/execute
 * Execute integration action
 */
router.post('/connections/:connectionId/execute', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { action, data = {} } = req.body;
    
    if (!action) {
      return res.status(400).json({
        success: false,
        message: 'Action is required'
      });
    }

    const result = await integrationService.executeAction(connectionId, action, data);
    
    res.json({
      success: true,
      data: result,
      message: 'Integration action executed successfully'
    });
  } catch (error) {
    console.error('Failed to execute integration action:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute integration action'
    });
  }
});

/**
 * POST /api/integrations/sync
 * Sync data between integrations
 */
router.post('/sync', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { sourceConnectionId, targetConnectionId, syncConfig } = req.body;
    
    if (!sourceConnectionId || !targetConnectionId || !syncConfig) {
      return res.status(400).json({
        success: false,
        message: 'Source connection, target connection, and sync config are required'
      });
    }

    const syncResult = await integrationService.syncData(sourceConnectionId, targetConnectionId, syncConfig);
    
    res.json({
      success: true,
      data: syncResult,
      message: 'Data synchronization completed successfully'
    });
  } catch (error) {
    console.error('Failed to sync data:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to synchronize data'
    });
  }
});

/**
 * POST /api/integrations/webhooks/:connectionId
 * Setup webhook for integration
 */
router.post('/webhooks/:connectionId', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { webhookConfig } = req.body;
    
    if (!webhookConfig) {
      return res.status(400).json({
        success: false,
        message: 'Webhook configuration is required'
      });
    }

    const webhook = await integrationService.setupWebhook(connectionId, webhookConfig);
    
    res.json({
      success: true,
      data: webhook,
      message: 'Webhook setup completed successfully'
    });
  } catch (error) {
    console.error('Failed to setup webhook:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to setup webhook'
    });
  }
});

/**
 * POST /api/integrations/webhooks/:webhookId/trigger
 * Process incoming webhook (public endpoint)
 */
router.post('/webhooks/:webhookId/trigger', async (req, res) => {
  try {
    const { webhookId } = req.params;
    const payload = req.body;
    const headers = req.headers;
    
    const result = await integrationService.processWebhook(webhookId, payload, headers);
    
    res.json({
      success: true,
      data: result,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Failed to process webhook:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process webhook'
    });
  }
});

/**
 * GET /api/integrations/metrics
 * Get integration metrics
 */
router.get('/metrics', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const metrics = integrationService.getMetrics();
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Failed to get integration metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve integration metrics'
    });
  }
});

/**
 * GET /api/integrations/sync-history
 * Get data synchronization history
 */
router.get('/sync-history', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, connectionId } = req.query;
    
    // This would typically query a database for sync history
    // For now, return a placeholder response
    const syncHistory = {
      syncs: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        pages: 0
      },
      filters: { status, connectionId }
    };
    
    res.json({
      success: true,
      data: syncHistory
    });
  } catch (error) {
    console.error('Failed to get sync history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve synchronization history'
    });
  }
});

/**
 * POST /api/integrations/test-connection
 * Test integration connection
 */
router.post('/test-connection', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { integrationName, credentials } = req.body;
    
    if (!integrationName || !credentials) {
      return res.status(400).json({
        success: false,
        message: 'Integration name and credentials are required'
      });
    }

    const connector = integrationService.getConnector(integrationName);
    if (!connector) {
      return res.status(400).json({
        success: false,
        message: `Integration connector not found: ${integrationName}`
      });
    }

    const validation = await connector.validateCredentials(credentials);
    
    res.json({
      success: true,
      data: {
        valid: validation.valid,
        error: validation.error || null
      },
      message: validation.valid ? 'Connection test successful' : 'Connection test failed'
    });
  } catch (error) {
    console.error('Failed to test connection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test integration connection'
    });
  }
});

/**
 * DELETE /api/integrations/connections/:connectionId
 * Delete integration connection
 */
router.delete('/connections/:connectionId', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { connectionId } = req.params;
    
    const connection = await integrationService.getConnection(connectionId);
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Integration connection not found'
      });
    }

    // Remove connection from cache and memory
    await integrationService.cacheService.delete(`integration:connection:${connectionId}`);
    integrationService.integrations.delete(connectionId);
    integrationService.metrics.activeConnections--;
    
    res.json({
      success: true,
      message: 'Integration connection deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete integration connection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete integration connection'
    });
  }
});

/**
 * GET /api/integrations/health
 * Get integration health status
 */
router.get('/health', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const metrics = integrationService.getMetrics();
    
    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      metrics,
      checks: {
        connectors: {
          status: 'healthy',
          count: integrationService.connectors.size
        },
        connections: {
          status: 'healthy',
          active: metrics.activeConnections
        },
        webhooks: {
          status: 'healthy',
          active: metrics.activeWebhooks
        },
        performance: {
          status: 'healthy',
          averageResponseTime: metrics.averageResponseTime,
          successRate: metrics.totalRequests > 0 ? 
            (metrics.successfulRequests / metrics.totalRequests) * 100 : 100
        }
      }
    };

    // Check for any issues
    if (metrics.totalRequests > 0) {
      const errorRate = (metrics.failedRequests / metrics.totalRequests) * 100;
      if (errorRate > 10) {
        health.status = 'degraded';
        health.checks.performance.status = 'warning';
      }
    }

    if (metrics.averageResponseTime > 5000) {
      health.status = 'degraded';
      health.checks.performance.status = 'warning';
    }
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Failed to get integration health:', error);
    res.status(503).json({
      success: false,
      message: 'Failed to retrieve integration health status',
      data: {
        status: 'unhealthy',
        timestamp: Date.now(),
        error: 'Health check failed'
      }
    });
  }
});

/**
 * GET /api/integrations/templates
 * Get integration templates and examples
 */
router.get('/templates', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { integrationName, category } = req.query;
    
    // Integration templates for common use cases
    const templates = [
      {
        id: 'salesforce-lead-sync',
        name: 'Salesforce Lead Synchronization',
        description: 'Sync leads between ProofPix and Salesforce',
        integrationName: 'salesforce',
        category: 'crm',
        config: {
          source: {
            action: 'query',
            soql: 'SELECT Id, Name, Email, Company FROM Lead WHERE CreatedDate = TODAY'
          },
          transform: [
            {
              type: 'map',
              mapping: {
                'id': 'Id',
                'name': 'Name',
                'email': 'Email',
                'company': 'Company'
              }
            }
          ],
          target: {
            action: 'create',
            sobject: 'Contact'
          }
        }
      },
      {
        id: 'slack-notification',
        name: 'Slack Notifications',
        description: 'Send ProofPix notifications to Slack channels',
        integrationName: 'slack',
        category: 'communication',
        config: {
          action: 'send-message',
          channel: '#proofpix-notifications',
          template: 'New proof uploaded: {{proof.name}} by {{user.name}}'
        }
      },
      {
        id: 'google-drive-backup',
        name: 'Google Drive Backup',
        description: 'Backup ProofPix files to Google Drive',
        integrationName: 'google-drive',
        category: 'storage',
        config: {
          action: 'upload-file',
          parentId: 'backup-folder-id',
          naming: '{{date}}-{{proof.name}}'
        }
      }
    ];

    let filteredTemplates = templates;
    
    if (integrationName) {
      filteredTemplates = filteredTemplates.filter(t => t.integrationName === integrationName);
    }
    
    if (category) {
      filteredTemplates = filteredTemplates.filter(t => t.category === category);
    }
    
    res.json({
      success: true,
      data: {
        templates: filteredTemplates,
        categories: ['crm', 'communication', 'storage', 'automation', 'analytics'],
        total: filteredTemplates.length
      }
    });
  } catch (error) {
    console.error('Failed to get integration templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve integration templates'
    });
  }
});

module.exports = router; 