const cron = require('node-cron');
const { logger } = require('../config/database');

class ScheduledJobs {
  constructor() {
    this.jobs = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize all scheduled jobs
   */
  init() {
    if (this.isInitialized) {
      logger.warn('Scheduled jobs already initialized');
      return;
    }

    try {
      // Daily cleanup job at 2 AM
      this.scheduleCleanupJob();
      
      // Hourly analytics aggregation
      this.scheduleAnalyticsAggregation();
      
      // Daily system health check at 6 AM
      this.scheduleSystemHealthCheck();
      
      // Weekly database maintenance on Sunday at 3 AM
      this.scheduleDatabaseMaintenance();
      
      // Daily file processing queue monitoring
      this.scheduleQueueMonitoring();

      this.isInitialized = true;
      logger.info('Scheduled jobs initialized successfully', {
        jobCount: this.jobs.size
      });

    } catch (error) {
      logger.error('Failed to initialize scheduled jobs:', error);
      throw error;
    }
  }

  /**
   * Schedule daily cleanup job
   */
  scheduleCleanupJob() {
    const job = cron.schedule('0 2 * * *', async () => {
      logger.info('Starting daily cleanup job');
      
      try {
        // Import services dynamically to avoid circular dependencies
        const queueService = require('./queueService');
        
        // Add cleanup job to queue
        await queueService.addJob('cleanup', 'daily-cleanup', {
          type: 'daily',
          timestamp: new Date().toISOString()
        });

        logger.info('Daily cleanup job queued successfully');
      } catch (error) {
        logger.error('Daily cleanup job failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.jobs.set('daily-cleanup', job);
    job.start();
  }

  /**
   * Schedule hourly analytics aggregation
   */
  scheduleAnalyticsAggregation() {
    const job = cron.schedule('0 * * * *', async () => {
      logger.info('Starting hourly analytics aggregation');
      
      try {
        const analyticsService = require('./analyticsService');
        
        // Record hourly performance metrics
        await analyticsService.recordPerformanceMetric('system.hourly_aggregation', 1, {
          timestamp: new Date().toISOString(),
          type: 'scheduled'
        });

        logger.info('Hourly analytics aggregation completed');
      } catch (error) {
        logger.error('Analytics aggregation failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.jobs.set('analytics-aggregation', job);
    job.start();
  }

  /**
   * Schedule daily system health check
   */
  scheduleSystemHealthCheck() {
    const job = cron.schedule('0 6 * * *', async () => {
      logger.info('Starting daily system health check');
      
      try {
        const analyticsService = require('./analyticsService');
        
        // Get system health
        const health = await analyticsService.getSystemHealth();
        
        // Log health status
        logger.info('Daily system health check completed', {
          status: health.status,
          checks: Object.keys(health.checks || {}).length
        });

        // Alert if system is unhealthy
        if (health.status !== 'healthy') {
          logger.warn('System health check detected issues', health);
        }

      } catch (error) {
        logger.error('System health check failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.jobs.set('system-health-check', job);
    job.start();
  }

  /**
   * Schedule weekly database maintenance
   */
  scheduleDatabaseMaintenance() {
    const job = cron.schedule('0 3 * * 0', async () => {
      logger.info('Starting weekly database maintenance');
      
      try {
        const queueService = require('./queueService');
        
        // Add database maintenance job to queue
        await queueService.addJob('cleanup', 'database-maintenance', {
          type: 'weekly',
          tasks: [
            'vacuum_analyze',
            'update_statistics',
            'cleanup_old_logs',
            'optimize_indexes'
          ],
          timestamp: new Date().toISOString()
        });

        logger.info('Weekly database maintenance job queued successfully');
      } catch (error) {
        logger.error('Database maintenance scheduling failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.jobs.set('database-maintenance', job);
    job.start();
  }

  /**
   * Schedule queue monitoring
   */
  scheduleQueueMonitoring() {
    const job = cron.schedule('*/15 * * * *', async () => {
      try {
        const queueService = require('./queueService');
        
        // Get queue statistics
        const stats = await queueService.getQueueStats();
        
        // Check for stuck jobs or high failure rates
        for (const [queueName, queueStats] of Object.entries(stats)) {
          if (queueStats.failed > 10) {
            logger.warn('High failure rate detected in queue', {
              queue: queueName,
              failed: queueStats.failed,
              waiting: queueStats.waiting
            });
          }
          
          if (queueStats.waiting > 100) {
            logger.warn('High queue backlog detected', {
              queue: queueName,
              waiting: queueStats.waiting
            });
          }
        }

      } catch (error) {
        logger.error('Queue monitoring failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    this.jobs.set('queue-monitoring', job);
    job.start();
  }

  /**
   * Stop a specific job
   * @param {string} jobName - Name of the job to stop
   */
  stopJob(jobName) {
    const job = this.jobs.get(jobName);
    if (job) {
      job.stop();
      logger.info('Scheduled job stopped', { jobName });
    } else {
      logger.warn('Job not found', { jobName });
    }
  }

  /**
   * Start a specific job
   * @param {string} jobName - Name of the job to start
   */
  startJob(jobName) {
    const job = this.jobs.get(jobName);
    if (job) {
      job.start();
      logger.info('Scheduled job started', { jobName });
    } else {
      logger.warn('Job not found', { jobName });
    }
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll() {
    for (const [jobName, job] of this.jobs) {
      job.stop();
      logger.info('Scheduled job stopped', { jobName });
    }
    
    logger.info('All scheduled jobs stopped');
  }

  /**
   * Get status of all jobs
   * @returns {Object} Job status information
   */
  getStatus() {
    const status = {};
    
    for (const [jobName, job] of this.jobs) {
      status[jobName] = {
        running: job.running || false,
        scheduled: job.scheduled || false
      };
    }

    return {
      initialized: this.isInitialized,
      jobCount: this.jobs.size,
      jobs: status
    };
  }

  /**
   * Add a custom scheduled job
   * @param {string} name - Job name
   * @param {string} schedule - Cron schedule
   * @param {Function} task - Task function to execute
   * @param {Object} options - Cron options
   */
  addCustomJob(name, schedule, task, options = {}) {
    if (this.jobs.has(name)) {
      throw new Error(`Job with name '${name}' already exists`);
    }

    const job = cron.schedule(schedule, async () => {
      logger.info('Starting custom scheduled job', { name });
      
      try {
        await task();
        logger.info('Custom scheduled job completed', { name });
      } catch (error) {
        logger.error('Custom scheduled job failed', { name, error: error.message });
      }
    }, {
      scheduled: false,
      timezone: 'UTC',
      ...options
    });

    this.jobs.set(name, job);
    job.start();
    
    logger.info('Custom scheduled job added', { name, schedule });
  }

  /**
   * Remove a custom job
   * @param {string} name - Job name
   */
  removeJob(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      logger.info('Scheduled job removed', { name });
    } else {
      logger.warn('Job not found for removal', { name });
    }
  }
}

// Create singleton instance
const scheduledJobs = new ScheduledJobs();

module.exports = scheduledJobs; 