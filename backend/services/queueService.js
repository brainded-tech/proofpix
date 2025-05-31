const Queue = require('bull');
const redisConfig = require('../config/redis');
const { logger } = require('../config/database');
const { auditLog } = require('./auditService');

class QueueService {
  constructor() {
    this.queues = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Ensure Redis is connected
      if (!redisConfig.isConnected) {
        await redisConfig.connect();
      }

      const redisClient = redisConfig.getClient();
      
      // Create queues
      this.queues.set('file-processing', new Queue('file processing', {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          db: process.env.REDIS_DB || 0
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000
          }
        }
      }));

      this.queues.set('webhook-delivery', new Queue('webhook delivery', {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          db: process.env.REDIS_DB || 0
        },
        defaultJobOptions: {
          removeOnComplete: 50,
          removeOnFail: 25,
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 1000
          }
        }
      }));

      this.queues.set('email-notifications', new Queue('email notifications', {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          db: process.env.REDIS_DB || 0
        },
        defaultJobOptions: {
          removeOnComplete: 25,
          removeOnFail: 10,
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 5000
          }
        }
      }));

      this.queues.set('batch-processing', new Queue('batch processing', {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          db: process.env.REDIS_DB || 0
        },
        defaultJobOptions: {
          removeOnComplete: 10,
          removeOnFail: 5,
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 5000
          }
        }
      }));

      this.queues.set('cleanup', new Queue('cleanup', {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
          db: process.env.REDIS_DB || 0
        },
        defaultJobOptions: {
          removeOnComplete: 5,
          removeOnFail: 5,
          attempts: 1
        }
      }));

      // Set up queue event listeners
      this.setupQueueEventListeners();

      this.isInitialized = true;
      logger.info('Queue service initialized successfully');
      
      return true;
    } catch (error) {
      logger.error('Failed to initialize queue service:', error);
      return false;
    }
  }

  setupQueueEventListeners() {
    for (const [queueName, queue] of this.queues) {
      queue.on('completed', (job, result) => {
        logger.info(`Job completed in ${queueName}:`, {
          jobId: job.id,
          jobType: job.data.type,
          duration: Date.now() - job.timestamp,
          result: typeof result === 'object' ? JSON.stringify(result) : result
        });
      });

      queue.on('failed', (job, error) => {
        logger.error(`Job failed in ${queueName}:`, {
          jobId: job.id,
          jobType: job.data.type,
          error: error.message,
          attempts: job.attemptsMade,
          data: job.data
        });
      });

      queue.on('stalled', (job) => {
        logger.warn(`Job stalled in ${queueName}:`, {
          jobId: job.id,
          jobType: job.data.type
        });
      });

      queue.on('progress', (job, progress) => {
        logger.debug(`Job progress in ${queueName}:`, {
          jobId: job.id,
          progress: `${progress}%`
        });
      });
    }
  }

  getQueue(queueName) {
    if (!this.isInitialized) {
      throw new Error('Queue service not initialized');
    }
    
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue '${queueName}' not found`);
    }
    
    return queue;
  }

  // File Processing Jobs
  async addFileProcessingJob(jobData, options = {}) {
    try {
      const queue = this.getQueue('file-processing');
      
      const job = await queue.add(jobData.type, jobData, {
        priority: options.priority || 0,
        delay: options.delay || 0,
        attempts: options.attempts || 3,
        ...options
      });

      await auditLog(jobData.userId, 'file_processing_job_queued', {
        jobId: job.id,
        jobType: jobData.type,
        fileId: jobData.fileId
      });

      return job;
    } catch (error) {
      logger.error('Failed to add file processing job:', error);
      throw error;
    }
  }

  // Webhook Delivery Jobs
  async addWebhookDeliveryJob(webhookData, options = {}) {
    try {
      const queue = this.getQueue('webhook-delivery');
      
      const job = await queue.add('webhook-delivery', webhookData, {
        priority: options.priority || 0,
        delay: options.delay || 0,
        attempts: options.attempts || 5,
        ...options
      });

      await auditLog(webhookData.userId, 'webhook_delivery_job_queued', {
        jobId: job.id,
        webhookId: webhookData.webhookId,
        eventType: webhookData.eventType
      });

      return job;
    } catch (error) {
      logger.error('Failed to add webhook delivery job:', error);
      throw error;
    }
  }

  // Email Notification Jobs
  async addEmailNotificationJob(emailData, options = {}) {
    try {
      const queue = this.getQueue('email-notifications');
      
      const job = await queue.add('email-notification', emailData, {
        priority: options.priority || 0,
        delay: options.delay || 0,
        attempts: options.attempts || 3,
        ...options
      });

      await auditLog(emailData.userId, 'email_notification_job_queued', {
        jobId: job.id,
        emailType: emailData.type,
        recipient: emailData.to
      });

      return job;
    } catch (error) {
      logger.error('Failed to add email notification job:', error);
      throw error;
    }
  }

  // Batch Processing Jobs
  async addBatchProcessingJob(batchData, options = {}) {
    try {
      const queue = this.getQueue('batch-processing');
      
      const job = await queue.add('batch-processing', batchData, {
        priority: options.priority || 0,
        delay: options.delay || 0,
        attempts: options.attempts || 2,
        timeout: options.timeout || 300000, // 5 minutes default
        ...options
      });

      await auditLog(batchData.userId, 'batch_processing_job_queued', {
        jobId: job.id,
        batchType: batchData.type,
        itemCount: batchData.items?.length || 0
      });

      return job;
    } catch (error) {
      logger.error('Failed to add batch processing job:', error);
      throw error;
    }
  }

  // Cleanup Jobs
  async addCleanupJob(cleanupData, options = {}) {
    try {
      const queue = this.getQueue('cleanup');
      
      const job = await queue.add('cleanup', cleanupData, {
        priority: options.priority || -10, // Low priority
        delay: options.delay || 0,
        attempts: options.attempts || 1,
        ...options
      });

      logger.info('Cleanup job queued:', {
        jobId: job.id,
        cleanupType: cleanupData.type
      });

      return job;
    } catch (error) {
      logger.error('Failed to add cleanup job:', error);
      throw error;
    }
  }

  // Job Management
  async getJob(queueName, jobId) {
    try {
      const queue = this.getQueue(queueName);
      return await queue.getJob(jobId);
    } catch (error) {
      logger.error('Failed to get job:', error);
      throw error;
    }
  }

  async removeJob(queueName, jobId) {
    try {
      const queue = this.getQueue(queueName);
      const job = await queue.getJob(jobId);
      
      if (job) {
        await job.remove();
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Failed to remove job:', error);
      throw error;
    }
  }

  async retryJob(queueName, jobId) {
    try {
      const queue = this.getQueue(queueName);
      const job = await queue.getJob(jobId);
      
      if (job) {
        await job.retry();
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Failed to retry job:', error);
      throw error;
    }
  }

  // Queue Statistics
  async getQueueStats(queueName) {
    try {
      const queue = this.getQueue(queueName);
      
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(),
        queue.getFailed(),
        queue.getDelayed()
      ]);

      return {
        name: queueName,
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
        total: waiting.length + active.length + completed.length + failed.length + delayed.length
      };
    } catch (error) {
      logger.error('Failed to get queue stats:', error);
      throw error;
    }
  }

  async getAllQueueStats() {
    try {
      const stats = {};
      
      for (const queueName of this.queues.keys()) {
        stats[queueName] = await this.getQueueStats(queueName);
      }
      
      return stats;
    } catch (error) {
      logger.error('Failed to get all queue stats:', error);
      throw error;
    }
  }

  // Queue Management
  async pauseQueue(queueName) {
    try {
      const queue = this.getQueue(queueName);
      await queue.pause();
      logger.info(`Queue '${queueName}' paused`);
      return true;
    } catch (error) {
      logger.error('Failed to pause queue:', error);
      throw error;
    }
  }

  async resumeQueue(queueName) {
    try {
      const queue = this.getQueue(queueName);
      await queue.resume();
      logger.info(`Queue '${queueName}' resumed`);
      return true;
    } catch (error) {
      logger.error('Failed to resume queue:', error);
      throw error;
    }
  }

  async cleanQueue(queueName, grace = 5000) {
    try {
      const queue = this.getQueue(queueName);
      await queue.clean(grace, 'completed');
      await queue.clean(grace, 'failed');
      logger.info(`Queue '${queueName}' cleaned`);
      return true;
    } catch (error) {
      logger.error('Failed to clean queue:', error);
      throw error;
    }
  }

  async emptyQueue(queueName) {
    try {
      const queue = this.getQueue(queueName);
      await queue.empty();
      logger.info(`Queue '${queueName}' emptied`);
      return true;
    } catch (error) {
      logger.error('Failed to empty queue:', error);
      throw error;
    }
  }

  // Scheduled Jobs
  async addRecurringJob(queueName, jobName, jobData, cronExpression, options = {}) {
    try {
      const queue = this.getQueue(queueName);
      
      const job = await queue.add(jobName, jobData, {
        repeat: { cron: cronExpression },
        removeOnComplete: 5,
        removeOnFail: 3,
        ...options
      });

      logger.info(`Recurring job '${jobName}' added to queue '${queueName}'`, {
        cron: cronExpression,
        jobId: job.id
      });

      return job;
    } catch (error) {
      logger.error('Failed to add recurring job:', error);
      throw error;
    }
  }

  // Health Check
  async healthCheck() {
    try {
      const health = {
        status: 'healthy',
        queues: {},
        redis: await redisConfig.healthCheck()
      };

      for (const queueName of this.queues.keys()) {
        try {
          const stats = await this.getQueueStats(queueName);
          health.queues[queueName] = {
            status: 'healthy',
            ...stats
          };
        } catch (error) {
          health.queues[queueName] = {
            status: 'unhealthy',
            error: error.message
          };
          health.status = 'degraded';
        }
      }

      return health;
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Graceful Shutdown
  async shutdown() {
    try {
      logger.info('Shutting down queue service...');
      
      for (const [queueName, queue] of this.queues) {
        await queue.close();
        logger.info(`Queue '${queueName}' closed`);
      }
      
      this.queues.clear();
      this.isInitialized = false;
      
      logger.info('Queue service shutdown complete');
    } catch (error) {
      logger.error('Error during queue service shutdown:', error);
      throw error;
    }
  }
}

const queueService = new QueueService();

module.exports = queueService; 