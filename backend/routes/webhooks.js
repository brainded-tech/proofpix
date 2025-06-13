const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateApiKey } = require('../middleware/auth');
const { requireFeature } = require('../middleware/quota');
const webhookService = require('../services/webhookService');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { query } = require('express-validator');
const winston = require('winston');

// Rate limiting for webhook operations
const webhookLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: { error: 'Too many webhook requests, please try again later' }
});

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
    new winston.transports.File({ filename: 'logs/webhooks.log' })
  ]
});

// Authentication middleware that supports both JWT and API key
const authenticate = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const apiSecret = req.headers['x-api-secret'];

  if (apiKey && apiSecret) {
    return authenticateApiKey(req, res, next);
  } else {
    return authenticateToken(req, res, next);
  }
};

// Validation middleware
const validateWebhookCreation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Webhook name must be between 1 and 100 characters'),
  body('url')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('URL must be a valid HTTP/HTTPS URL'),
  body('events')
    .isArray({ min: 1 })
    .withMessage('Events must be a non-empty array'),
  body('events.*')
    .isString()
    .withMessage('Each event must be a string'),
  body('secret')
    .optional()
    .isLength({ min: 16, max: 128 })
    .withMessage('Secret must be between 16 and 128 characters')
];

const validateWebhookUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Webhook name must be between 1 and 100 characters'),
  body('url')
    .optional()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('URL must be a valid HTTP/HTTPS URL'),
  body('events')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Events must be a non-empty array'),
  body('events.*')
    .optional()
    .isString()
    .withMessage('Each event must be a string'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Is active must be a boolean'),
  body('retryCount')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Retry count must be between 0 and 10'),
  body('timeoutSeconds')
    .optional()
    .isInt({ min: 5, max: 300 })
    .withMessage('Timeout must be between 5 and 300 seconds')
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

// Webhook Management Routes

// Create new webhook
router.post('/',
  authenticate,
  webhookLimit,
  requireFeature('webhooks:manage'),
  validateWebhookCreation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, url, events, secret } = req.body;

      const webhookData = {
        name,
        url,
        events,
        secret
      };

      const result = await webhookService.createWebhook(req.user.id, webhookData);

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get all user's webhooks
router.get('/',
  authenticate,
  requireFeature('webhooks:manage'),
  async (req, res) => {
    try {
      const webhooks = await webhookService.getUserWebhooks(req.user.id);

      res.json({
        success: true,
        webhooks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get specific webhook details
router.get('/:webhookId',
  authenticate,
  requireFeature('webhooks:manage'),
  async (req, res) => {
    try {
      const { webhookId } = req.params;
      const webhooks = await webhookService.getUserWebhooks(req.user.id);
      const webhook = webhooks.find(w => w.id === parseInt(webhookId));

      if (!webhook) {
        return res.status(404).json({
          success: false,
          error: 'Webhook not found'
        });
      }

      res.json({
        success: true,
        webhook
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Update webhook
router.put('/:webhookId',
  authenticate,
  webhookLimit,
  requireFeature('webhooks:manage'),
  validateWebhookUpdate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { webhookId } = req.params;
      const updates = {};

      // Map request body to database fields
      if (req.body.name !== undefined) updates.webhook_name = req.body.name;
      if (req.body.url !== undefined) updates.url = req.body.url;
      if (req.body.events !== undefined) updates.events = req.body.events;
      if (req.body.isActive !== undefined) updates.is_active = req.body.isActive;
      if (req.body.retryCount !== undefined) updates.retry_count = req.body.retryCount;
      if (req.body.timeoutSeconds !== undefined) updates.timeout_seconds = req.body.timeoutSeconds;

      const result = await webhookService.updateWebhook(webhookId, req.user.id, updates);

      res.json({
        success: true,
        webhook: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Delete webhook
router.delete('/:webhookId',
  authenticate,
  webhookLimit,
  requireFeature('webhooks:manage'),
  async (req, res) => {
    try {
      const { webhookId } = req.params;
      const result = await webhookService.deleteWebhook(webhookId, req.user.id);

      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Webhook Testing

// Test webhook delivery
router.post('/:webhookId/test',
  authenticate,
  webhookLimit,
  requireFeature('webhooks:manage'),
  [
    body('event')
      .isString()
      .withMessage('Event type is required'),
    body('data')
      .optional()
      .isObject()
      .withMessage('Data must be an object')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { webhookId } = req.params;
      const { event, data = {} } = req.body;

      const webhooks = await webhookService.getUserWebhooks(req.user.id);
      const webhook = webhooks.find(w => w.id === parseInt(webhookId));

      if (!webhook) {
        return res.status(404).json({
          success: false,
          error: 'Webhook not found'
        });
      }

      // Send test webhook
      const testResult = await webhookService.sendTestWebhook(webhook, event, data);

      res.json({
        success: true,
        data: {
          webhookId: webhook.id,
          event,
          testResult,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Failed to test webhook:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Webhook Analytics

// Get webhook delivery history
router.get('/:webhookId/deliveries',
  authenticate,
  requireFeature('webhooks:manage'),
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['success', 'failed', 'pending'])
      .withMessage('Invalid status filter')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { webhookId } = req.params;
      const { limit = 50, status } = req.query;

      const webhooks = await webhookService.getUserWebhooks(req.user.id);
      const webhook = webhooks.find(w => w.id === parseInt(webhookId));

      if (!webhook) {
        return res.status(404).json({
          success: false,
          error: 'Webhook not found'
        });
      }

      const deliveries = await webhookService.getWebhookDeliveries(webhookId, {
        limit: parseInt(limit),
        status
      });

      res.json({
        success: true,
        data: {
          deliveries,
          webhookId: webhook.id,
          filters: { limit, status }
        }
      });
    } catch (error) {
      logger.error('Failed to get webhook deliveries:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get webhook analytics
router.get('/:webhookId/analytics',
  authenticate,
  requireFeature('webhooks:manage'),
  [
    query('timeRange')
      .optional()
      .isIn(['1h', '24h', '7d', '30d'])
      .withMessage('Invalid time range')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { webhookId } = req.params;
      const { timeRange = '24h' } = req.query;

      const webhooks = await webhookService.getUserWebhooks(req.user.id);
      const webhook = webhooks.find(w => w.id === parseInt(webhookId));

      if (!webhook) {
        return res.status(404).json({
          success: false,
          error: 'Webhook not found'
        });
      }

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
      }

      const analytics = await webhookService.getWebhookAnalytics(webhookId, startDate, endDate);

      res.json({
        success: true,
        data: {
          webhookId: webhook.id,
          analytics,
          timeRange,
          period: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
          }
        }
      });
    } catch (error) {
      logger.error('Failed to get webhook analytics:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get specific delivery details
router.get('/:webhookId/deliveries/:deliveryId',
  authenticate,
  requireFeature('webhooks:manage'),
  async (req, res) => {
    try {
      const { webhookId, deliveryId } = req.params;

      const db = require('../config/database');
      const delivery = await db.query(`
        SELECT wd.*, w.webhook_name, w.url
        FROM webhook_deliveries wd
        JOIN webhooks w ON wd.webhook_id = w.id
        WHERE wd.id = $1 AND w.id = $2 AND w.user_id = $3
      `, [deliveryId, webhookId, req.user.id]);

      if (delivery.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Delivery not found'
        });
      }

      res.json({
        success: true,
        delivery: delivery.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Retry failed delivery
router.post('/:webhookId/deliveries/:deliveryId/retry',
  authenticate,
  webhookLimit,
  requireFeature('webhooks:manage'),
  async (req, res) => {
    try {
      const { webhookId, deliveryId } = req.params;

      const db = require('../config/database');
      
      // Get delivery details
      const delivery = await db.query(`
        SELECT wd.*, w.url, w.secret
        FROM webhook_deliveries wd
        JOIN webhooks w ON wd.webhook_id = w.id
        WHERE wd.id = $1 AND w.id = $2 AND w.user_id = $3 AND wd.status = 'failed'
      `, [deliveryId, webhookId, req.user.id]);

      if (delivery.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Failed delivery not found'
        });
      }

      const deliveryRecord = delivery.rows[0];

      // Reset delivery for retry
      await db.query(`
        UPDATE webhook_deliveries 
        SET status = 'pending', attempt_count = 0, next_retry_at = NULL
        WHERE id = $1
      `, [deliveryId]);

      // Queue immediate retry
      const queueService = require('../services/queueService');
      await queueService.addWebhookDeliveryJob({
        deliveryId,
        webhookId: parseInt(webhookId),
        userId: req.user.id,
        eventType: deliveryRecord.event_type,
        url: deliveryRecord.url,
        secret: deliveryRecord.secret,
        payload: deliveryRecord.payload,
        retry: true
      });

      res.json({
        success: true,
        message: 'Delivery queued for retry'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Webhook Information

// Get supported events
router.get('/info/events',
  authenticate,
  async (req, res) => {
    try {
      const events = [
        {
          name: 'file.uploaded',
          description: 'Triggered when a file is successfully uploaded'
        },
        {
          name: 'file.processed',
          description: 'Triggered when file processing is completed'
        },
        {
          name: 'file.failed',
          description: 'Triggered when file processing fails'
        },
        {
          name: 'exif.extracted',
          description: 'Triggered when EXIF data is extracted from an image'
        },
        {
          name: 'thumbnail.generated',
          description: 'Triggered when a thumbnail is generated'
        },
        {
          name: 'virus.detected',
          description: 'Triggered when a virus is detected in a file'
        },
        {
          name: 'batch.completed',
          description: 'Triggered when a batch operation is completed'
        },
        {
          name: 'batch.failed',
          description: 'Triggered when a batch operation fails'
        },
        {
          name: 'user.created',
          description: 'Triggered when a new user account is created'
        },
        {
          name: 'subscription.created',
          description: 'Triggered when a subscription is created'
        },
        {
          name: 'subscription.updated',
          description: 'Triggered when a subscription is updated'
        },
        {
          name: 'subscription.canceled',
          description: 'Triggered when a subscription is canceled'
        },
        {
          name: 'payment.succeeded',
          description: 'Triggered when a payment is successful'
        },
        {
          name: 'payment.failed',
          description: 'Triggered when a payment fails'
        }
      ];

      res.json({
        success: true,
        events
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get webhook payload examples
router.get('/info/payload-examples',
  authenticate,
  async (req, res) => {
    try {
      const examples = {
        'file.uploaded': {
          event: 'file.uploaded',
          data: {
            fileId: 123,
            fileName: 'example.jpg',
            fileSize: 1024000,
            mimeType: 'image/jpeg',
            duplicate: false
          },
          timestamp: '2024-01-15T10:30:00.000Z',
          webhook_id: 456
        },
        'exif.extracted': {
          event: 'exif.extracted',
          data: {
            fileId: 123,
            fileName: 'example.jpg',
            exifData: {
              camera: {
                make: 'Canon',
                model: 'EOS R5'
              },
              settings: {
                iso: 100,
                aperture: 2.8,
                exposureTime: '1/125'
              }
            }
          },
          timestamp: '2024-01-15T10:30:00.000Z',
          webhook_id: 456
        },
        'payment.succeeded': {
          event: 'payment.succeeded',
          data: {
            paymentId: 'pi_1234567890',
            amount: 2999,
            currency: 'usd',
            subscriptionId: 'sub_1234567890'
          },
          timestamp: '2024-01-15T10:30:00.000Z',
          webhook_id: 456
        }
      };

      res.json({
        success: true,
        examples
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Webhook Security

// Verify webhook signature (for incoming webhooks)
router.post('/verify-signature',
  authenticate,
  async (req, res) => {
    try {
      const { payload, signature, secret } = req.body;

      if (!payload || !signature || !secret) {
        return res.status(400).json({
          success: false,
          error: 'Payload, signature, and secret are required'
        });
      }

      const isValid = webhookService.verifyWebhookSignature(payload, signature, secret);

      res.json({
        success: true,
        valid: isValid
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Global Webhook Analytics (Admin only)
router.get('/analytics/global',
  authenticate,
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

      const analytics = await webhookService.getGlobalWebhookAnalytics(start, end);

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

// Webhook Management Operations

// Pause webhook (disable temporarily)
router.post('/:webhookId/pause',
  authenticate,
  webhookLimit,
  requireFeature('webhooks:manage'),
  async (req, res) => {
    try {
      const { webhookId } = req.params;
      const result = await webhookService.updateWebhook(webhookId, req.user.id, { is_active: false });

      res.json({
        success: true,
        message: 'Webhook paused successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Resume webhook (enable)
router.post('/:webhookId/resume',
  authenticate,
  webhookLimit,
  requireFeature('webhooks:manage'),
  async (req, res) => {
    try {
      const { webhookId } = req.params;
      const result = await webhookService.updateWebhook(webhookId, req.user.id, { is_active: true });

      res.json({
        success: true,
        message: 'Webhook resumed successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Error handling middleware
router.use((error, req, res, next) => {
  logger.error('Webhook route error:', { error: error.message, stack: error.stack });
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = router; 