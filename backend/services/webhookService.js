const crypto = require('crypto');
const axios = require('axios');
const { logger } = require('../config/database');
const { auditLog } = require('./auditService');
const queueService = require('./queueService');
const db = require('../config/database');

class WebhookService {
  constructor() {
    this.supportedEvents = [
      'file.uploaded',
      'file.processed',
      'file.failed',
      'exif.extracted',
      'thumbnail.generated',
      'virus.detected',
      'batch.completed',
      'batch.failed',
      'user.created',
      'subscription.created',
      'subscription.updated',
      'subscription.canceled',
      'payment.succeeded',
      'payment.failed'
    ];

    this.maxRetries = 5;
    this.retryDelays = [1000, 5000, 15000, 60000, 300000]; // 1s, 5s, 15s, 1m, 5m
    this.timeout = 30000; // 30 seconds
  }

  // Webhook Registration
  async createWebhook(userId, webhookData) {
    try {
      const { name, url, events, secret } = webhookData;

      // Validate events
      this.validateEvents(events);

      // Generate secret if not provided
      const webhookSecret = secret || this.generateWebhookSecret();

      // Create webhook record
      const result = await db.query(`
        INSERT INTO webhooks (
          user_id, webhook_name, url, secret, events, is_active,
          retry_count, timeout_seconds
        ) VALUES ($1, $2, $3, $4, $5, true, $6, $7)
        RETURNING *
      `, [
        userId,
        name,
        url,
        webhookSecret,
        events,
        this.maxRetries,
        this.timeout / 1000
      ]);

      await auditLog(userId, 'webhook_created', {
        webhookId: result.rows[0].id,
        name,
        url,
        events
      });

      return {
        success: true,
        webhook: {
          ...result.rows[0],
          secret: webhookSecret // Only returned once
        }
      };
    } catch (error) {
      logger.error('Webhook creation failed:', error);
      throw error;
    }
  }

  validateEvents(events) {
    if (!Array.isArray(events) || events.length === 0) {
      throw new Error('Events must be a non-empty array');
    }

    for (const event of events) {
      if (!this.supportedEvents.includes(event)) {
        throw new Error(`Unsupported event: ${event}`);
      }
    }
  }

  generateWebhookSecret() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Webhook Management
  async getUserWebhooks(userId) {
    try {
      const result = await db.query(`
        SELECT id, webhook_name, url, events, is_active, last_triggered_at,
               success_count, failure_count, created_at, updated_at
        FROM webhooks
        WHERE user_id = $1
        ORDER BY created_at DESC
      `, [userId]);

      return result.rows;
    } catch (error) {
      logger.error('Failed to get user webhooks:', error);
      throw error;
    }
  }

  async updateWebhook(webhookId, userId, updates) {
    try {
      const allowedUpdates = ['webhook_name', 'url', 'events', 'is_active', 'retry_count', 'timeout_seconds'];
      
      const updateFields = [];
      const updateValues = [];
      let paramCount = 0;

      for (const [field, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(field)) {
          if (field === 'events') {
            this.validateEvents(value);
          }
          updateFields.push(`${field} = $${++paramCount}`);
          updateValues.push(field === 'events' ? value : value);
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(webhookId, userId);

      const query = `
        UPDATE webhooks 
        SET ${updateFields.join(', ')}
        WHERE id = $${++paramCount} AND user_id = $${++paramCount}
        RETURNING *
      `;

      const result = await db.query(query, updateValues);

      if (result.rows.length === 0) {
        throw new Error('Webhook not found or access denied');
      }

      await auditLog(userId, 'webhook_updated', {
        webhookId,
        updates: Object.keys(updates)
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Failed to update webhook:', error);
      throw error;
    }
  }

  async deleteWebhook(webhookId, userId) {
    try {
      const result = await db.query(`
        DELETE FROM webhooks 
        WHERE id = $1 AND user_id = $2
        RETURNING webhook_name
      `, [webhookId, userId]);

      if (result.rows.length === 0) {
        throw new Error('Webhook not found or access denied');
      }

      await auditLog(userId, 'webhook_deleted', {
        webhookId,
        webhookName: result.rows[0].webhook_name
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to delete webhook:', error);
      throw error;
    }
  }

  // Event Triggering
  async triggerEvent(eventType, eventData, userId = null) {
    try {
      // Get all active webhooks that listen for this event
      let webhooks;
      
      if (userId) {
        // User-specific webhooks
        webhooks = await db.query(`
          SELECT * FROM webhooks
          WHERE user_id = $1 AND is_active = true AND $2 = ANY(events)
        `, [userId, eventType]);
      } else {
        // Global webhooks (for system events)
        webhooks = await db.query(`
          SELECT * FROM webhooks
          WHERE is_active = true AND $1 = ANY(events)
        `, [eventType]);
      }

      if (webhooks.rows.length === 0) {
        logger.debug(`No webhooks found for event: ${eventType}`);
        return { success: true, webhooksTriggered: 0 };
      }

      // Queue webhook deliveries
      const deliveryPromises = webhooks.rows.map(webhook => 
        this.queueWebhookDelivery(webhook, eventType, eventData)
      );

      await Promise.all(deliveryPromises);

      logger.info(`Triggered ${webhooks.rows.length} webhooks for event: ${eventType}`);

      return {
        success: true,
        webhooksTriggered: webhooks.rows.length
      };
    } catch (error) {
      logger.error('Failed to trigger webhook event:', error);
      throw error;
    }
  }

  async queueWebhookDelivery(webhook, eventType, eventData) {
    try {
      // Create webhook delivery record
      const deliveryResult = await db.query(`
        INSERT INTO webhook_deliveries (
          webhook_id, event_type, payload, status, max_attempts
        ) VALUES ($1, $2, $3, 'pending', $4)
        RETURNING id
      `, [
        webhook.id,
        eventType,
        JSON.stringify({
          event: eventType,
          data: eventData,
          timestamp: new Date().toISOString(),
          webhook_id: webhook.id
        }),
        webhook.retry_count
      ]);

      // Queue the delivery job
      await queueService.addWebhookDeliveryJob({
        deliveryId: deliveryResult.rows[0].id,
        webhookId: webhook.id,
        userId: webhook.user_id,
        eventType,
        url: webhook.url,
        secret: webhook.secret,
        payload: {
          event: eventType,
          data: eventData,
          timestamp: new Date().toISOString(),
          webhook_id: webhook.id
        },
        timeout: webhook.timeout_seconds * 1000
      });

      return deliveryResult.rows[0].id;
    } catch (error) {
      logger.error('Failed to queue webhook delivery:', error);
      throw error;
    }
  }

  // Webhook Delivery
  async deliverWebhook(deliveryData) {
    try {
      const { deliveryId, webhookId, url, secret, payload, timeout } = deliveryData;

      // Update delivery status to active
      await this.updateDeliveryStatus(deliveryId, 'delivering');

      // Generate signature
      const signature = this.generateSignature(payload, secret);

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'ProofPix-Webhooks/1.0',
        'X-ProofPix-Event': payload.event,
        'X-ProofPix-Signature': signature,
        'X-ProofPix-Delivery': deliveryId,
        'X-ProofPix-Timestamp': payload.timestamp
      };

      // Make HTTP request
      const startTime = Date.now();
      const response = await axios.post(url, payload, {
        headers,
        timeout: timeout || this.timeout,
        validateStatus: (status) => status < 500 // Don't throw on 4xx errors
      });

      const responseTime = Date.now() - startTime;

      // Check if delivery was successful
      const isSuccess = response.status >= 200 && response.status < 300;

      if (isSuccess) {
        await this.handleSuccessfulDelivery(deliveryId, webhookId, response, responseTime);
        return {
          success: true,
          statusCode: response.status,
          responseTime
        };
      } else {
        await this.handleFailedDelivery(deliveryId, webhookId, response, responseTime);
        return {
          success: false,
          statusCode: response.status,
          responseTime,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      logger.error('Webhook delivery failed:', error);
      await this.handleDeliveryError(deliveryData.deliveryId, deliveryData.webhookId, error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateSignature(payload, secret) {
    const payloadString = JSON.stringify(payload);
    return crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');
  }

  async handleSuccessfulDelivery(deliveryId, webhookId, response, responseTime) {
    try {
      // Update delivery record
      await db.query(`
        UPDATE webhook_deliveries 
        SET status = 'delivered', http_status_code = $1, response_body = $2,
            response_headers = $3, delivered_at = NOW()
        WHERE id = $4
      `, [
        response.status,
        response.data ? JSON.stringify(response.data).substring(0, 1000) : null,
        JSON.stringify(response.headers),
        deliveryId
      ]);

      // Update webhook success count
      await db.query(`
        UPDATE webhooks 
        SET success_count = success_count + 1, last_triggered_at = NOW()
        WHERE id = $1
      `, [webhookId]);

      logger.info(`Webhook delivered successfully: ${deliveryId}`);
    } catch (error) {
      logger.error('Failed to handle successful delivery:', error);
    }
  }

  async handleFailedDelivery(deliveryId, webhookId, response, responseTime) {
    try {
      // Update delivery record
      await db.query(`
        UPDATE webhook_deliveries 
        SET status = 'failed', http_status_code = $1, response_body = $2,
            response_headers = $3, attempt_count = attempt_count + 1
        WHERE id = $4
      `, [
        response.status,
        response.data ? JSON.stringify(response.data).substring(0, 1000) : null,
        JSON.stringify(response.headers),
        deliveryId
      ]);

      // Check if we should retry
      await this.scheduleRetryIfNeeded(deliveryId, webhookId);

      logger.warn(`Webhook delivery failed: ${deliveryId}, Status: ${response.status}`);
    } catch (error) {
      logger.error('Failed to handle failed delivery:', error);
    }
  }

  async handleDeliveryError(deliveryId, webhookId, error) {
    try {
      // Update delivery record
      await db.query(`
        UPDATE webhook_deliveries 
        SET status = 'failed', response_body = $1, attempt_count = attempt_count + 1
        WHERE id = $2
      `, [
        error.message.substring(0, 1000),
        deliveryId
      ]);

      // Check if we should retry
      await this.scheduleRetryIfNeeded(deliveryId, webhookId);

      logger.error(`Webhook delivery error: ${deliveryId}, Error: ${error.message}`);
    } catch (dbError) {
      logger.error('Failed to handle delivery error:', dbError);
    }
  }

  async scheduleRetryIfNeeded(deliveryId, webhookId) {
    try {
      // Get current delivery info
      const deliveryResult = await db.query(`
        SELECT wd.*, w.retry_count as max_retries
        FROM webhook_deliveries wd
        JOIN webhooks w ON wd.webhook_id = w.id
        WHERE wd.id = $1
      `, [deliveryId]);

      if (deliveryResult.rows.length === 0) {
        return;
      }

      const delivery = deliveryResult.rows[0];

      if (delivery.attempt_count < delivery.max_retries) {
        // Calculate retry delay
        const retryDelay = this.retryDelays[delivery.attempt_count - 1] || this.retryDelays[this.retryDelays.length - 1];
        const nextRetryAt = new Date(Date.now() + retryDelay);

        // Update delivery for retry
        await db.query(`
          UPDATE webhook_deliveries 
          SET status = 'retrying', next_retry_at = $1
          WHERE id = $2
        `, [nextRetryAt, deliveryId]);

        // Queue retry job
        await queueService.addWebhookDeliveryJob({
          deliveryId,
          webhookId,
          retry: true
        }, { delay: retryDelay });

        logger.info(`Scheduled webhook retry: ${deliveryId}, Attempt: ${delivery.attempt_count + 1}, Delay: ${retryDelay}ms`);
      } else {
        // Max retries reached, update webhook failure count
        await db.query(`
          UPDATE webhooks 
          SET failure_count = failure_count + 1
          WHERE id = $1
        `, [webhookId]);

        logger.warn(`Webhook delivery failed permanently: ${deliveryId}, Max retries reached`);
      }
    } catch (error) {
      logger.error('Failed to schedule webhook retry:', error);
    }
  }

  async updateDeliveryStatus(deliveryId, status) {
    try {
      await db.query(`
        UPDATE webhook_deliveries 
        SET status = $1
        WHERE id = $2
      `, [status, deliveryId]);
    } catch (error) {
      logger.error('Failed to update delivery status:', error);
    }
  }

  // Webhook Testing
  async testWebhook(webhookId, userId) {
    try {
      // Get webhook details
      const webhookResult = await db.query(`
        SELECT * FROM webhooks
        WHERE id = $1 AND user_id = $2
      `, [webhookId, userId]);

      if (webhookResult.rows.length === 0) {
        throw new Error('Webhook not found or access denied');
      }

      const webhook = webhookResult.rows[0];

      // Send test event
      const testPayload = {
        event: 'webhook.test',
        data: {
          message: 'This is a test webhook delivery',
          webhook_id: webhookId,
          test: true
        },
        timestamp: new Date().toISOString(),
        webhook_id: webhookId
      };

      const result = await this.deliverWebhook({
        deliveryId: `test-${Date.now()}`,
        webhookId,
        url: webhook.url,
        secret: webhook.secret,
        payload: testPayload,
        timeout: webhook.timeout_seconds * 1000
      });

      await auditLog(userId, 'webhook_tested', {
        webhookId,
        success: result.success,
        statusCode: result.statusCode
      });

      return result;
    } catch (error) {
      logger.error('Webhook test failed:', error);
      throw error;
    }
  }

  // Webhook Analytics
  async getWebhookAnalytics(webhookId, userId, startDate, endDate) {
    try {
      const deliveryStats = await db.query(`
        SELECT 
          status,
          COUNT(*) as count,
          AVG(CASE WHEN http_status_code IS NOT NULL THEN http_status_code END) as avg_status_code
        FROM webhook_deliveries wd
        JOIN webhooks w ON wd.webhook_id = w.id
        WHERE w.id = $1 AND w.user_id = $2 
        AND wd.created_at BETWEEN $3 AND $4
        GROUP BY status
      `, [webhookId, userId, startDate, endDate]);

      const eventStats = await db.query(`
        SELECT 
          event_type,
          COUNT(*) as count,
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
        FROM webhook_deliveries wd
        JOIN webhooks w ON wd.webhook_id = w.id
        WHERE w.id = $1 AND w.user_id = $2 
        AND wd.created_at BETWEEN $3 AND $4
        GROUP BY event_type
        ORDER BY count DESC
      `, [webhookId, userId, startDate, endDate]);

      const dailyStats = await db.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as total_deliveries,
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as successful_deliveries,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_deliveries
        FROM webhook_deliveries wd
        JOIN webhooks w ON wd.webhook_id = w.id
        WHERE w.id = $1 AND w.user_id = $2 
        AND wd.created_at BETWEEN $3 AND $4
        GROUP BY DATE(created_at)
        ORDER BY date
      `, [webhookId, userId, startDate, endDate]);

      return {
        deliveryStats: deliveryStats.rows,
        eventStats: eventStats.rows,
        dailyStats: dailyStats.rows,
        period: { startDate, endDate }
      };
    } catch (error) {
      logger.error('Failed to get webhook analytics:', error);
      throw error;
    }
  }

  async getGlobalWebhookAnalytics(startDate, endDate) {
    try {
      const totalDeliveries = await db.query(`
        SELECT COUNT(*) as total_deliveries
        FROM webhook_deliveries
        WHERE created_at BETWEEN $1 AND $2
      `, [startDate, endDate]);

      const successRate = await db.query(`
        SELECT 
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as successful,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
          COUNT(*) as total
        FROM webhook_deliveries
        WHERE created_at BETWEEN $1 AND $2
      `, [startDate, endDate]);

      const topEvents = await db.query(`
        SELECT 
          event_type,
          COUNT(*) as delivery_count
        FROM webhook_deliveries
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY event_type
        ORDER BY delivery_count DESC
        LIMIT 10
      `, [startDate, endDate]);

      const activeWebhooks = await db.query(`
        SELECT COUNT(*) as active_webhooks
        FROM webhooks
        WHERE is_active = true
      `);

      return {
        totalDeliveries: parseInt(totalDeliveries.rows[0].total_deliveries),
        successRate: successRate.rows[0],
        topEvents: topEvents.rows,
        activeWebhooks: parseInt(activeWebhooks.rows[0].active_webhooks),
        period: { startDate, endDate }
      };
    } catch (error) {
      logger.error('Failed to get global webhook analytics:', error);
      throw error;
    }
  }

  // Webhook Signature Verification (for incoming webhooks)
  verifyWebhookSignature(payload, signature, secret) {
    const expectedSignature = this.generateSignature(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Cleanup old webhook deliveries
  async cleanupOldDeliveries(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await db.query(`
        DELETE FROM webhook_deliveries
        WHERE created_at < $1 AND status IN ('delivered', 'failed')
      `, [cutoffDate]);

      logger.info(`Cleaned up ${result.rowCount} old webhook deliveries`);
      return result.rowCount;
    } catch (error) {
      logger.error('Failed to cleanup old webhook deliveries:', error);
      throw error;
    }
  }
}

const webhookService = new WebhookService();

module.exports = webhookService; 