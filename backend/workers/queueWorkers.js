const queueService = require('../services/queueService');
const fileProcessingService = require('../services/fileProcessingService');
const webhookService = require('../services/webhookService');
const emailService = require('../services/emailService');
const exportService = require('../services/exportService');
const db = require('../config/database');
const { logger } = require('../config/database');
const { auditLog } = require('../services/auditService');

class QueueWorkers {
  constructor() {
    this.workers = new Map();
    this.isRunning = false;
  }

  async start() {
    try {
      logger.info('Starting queue workers...');
      
      await this.startFileProcessingWorker();
      await this.startWebhookDeliveryWorker();
      await this.startEmailNotificationWorker();
      await this.startBatchProcessingWorker();
      await this.startExportProcessingWorker();
      await this.startCleanupWorker();
      
      // Schedule recurring cleanup jobs
      await this.scheduleRecurringCleanupJobs();
      
      this.isRunning = true;
      logger.info('All queue workers started successfully');
    } catch (error) {
      logger.error('Failed to start queue workers:', error);
      throw error;
    }
  }

  async stop() {
    try {
      logger.info('Stopping queue workers...');
      
      for (const [name, worker] of this.workers) {
        await worker.close();
        logger.info(`Stopped ${name} worker`);
      }
      
      this.workers.clear();
      this.isRunning = false;
      logger.info('All queue workers stopped');
    } catch (error) {
      logger.error('Error stopping queue workers:', error);
      throw error;
    }
  }

  // File Processing Worker
  async startFileProcessingWorker() {
    try {
      const queue = queueService.getQueue('file-processing');
      
      // Virus scan processor
      queue.process('virus-scan', 3, async (job) => {
        return await this.processVirusScan(job);
      });
      
      // EXIF extraction processor
      queue.process('exif-extraction', 5, async (job) => {
        return await this.processExifExtraction(job);
      });
      
      // Thumbnail generation processor
      queue.process('thumbnail-generation', 3, async (job) => {
        return await this.processThumbnailGeneration(job);
      });
      
      // S3 upload processor
      queue.process('s3-upload', 2, async (job) => {
        return await this.processS3Upload(job);
      });

      this.workers.set('file-processing', queue);
      logger.info('File processing worker started');
    } catch (error) {
      logger.error('Failed to start file processing worker:', error);
      throw error;
    }
  }

  async processVirusScan(job) {
    try {
      const { fileId, filePath } = job.data;
      
      logger.info(`Processing virus scan for file: ${fileId}`);
      
      // Update file status
      await db.query('UPDATE files SET processing_status = $1 WHERE id = $2', ['scanning', fileId]);
      
      // Perform virus scan
      const scanResult = await fileProcessingService.scanForViruses(filePath);
      
      if (scanResult.isClean) {
        // Update file status to scanned
        await db.query('UPDATE files SET processing_status = $1, virus_scan_result = $2 WHERE id = $3', 
          ['scanned', JSON.stringify(scanResult), fileId]);
        
        // Queue EXIF extraction
        await queueService.addJob('file-processing', 'exif-extraction', { fileId, filePath });
        
        logger.info(`Virus scan completed for file: ${fileId} - Clean`);
      } else {
        // Mark file as infected and quarantine
        await db.query('UPDATE files SET processing_status = $1, virus_scan_result = $2 WHERE id = $3', 
          ['infected', JSON.stringify(scanResult), fileId]);
        
        // Delete infected file
        await fileProcessingService.deleteFile(filePath);
        
        logger.warn(`Virus detected in file: ${fileId} - Quarantined`);
      }
      
      return { success: true, isClean: scanResult.isClean };
    } catch (error) {
      logger.error(`Virus scan failed for file ${job.data.fileId}:`, error);
      
      // Update file status to failed
      await db.query('UPDATE files SET processing_status = $1 WHERE id = $2', ['failed', job.data.fileId]);
      
      throw error;
    }
  }

  async processExifExtraction(job) {
    try {
      const { fileId, filePath } = job.data;
      
      logger.info(`Processing EXIF extraction for file: ${fileId}`);
      
      // Update file status
      await db.query('UPDATE files SET processing_status = $1 WHERE id = $2', ['extracting', fileId]);
      
      // Extract EXIF data
      const exifData = await fileProcessingService.extractExifData(filePath);
      
      // Update file with EXIF data
      await db.query('UPDATE files SET exif_data = $1 WHERE id = $2', [JSON.stringify(exifData), fileId]);
      
      // Queue thumbnail generation for images
      const fileInfo = await db.query('SELECT mime_type FROM files WHERE id = $1', [fileId]);
      if (fileInfo.rows[0]?.mime_type?.startsWith('image/')) {
        await queueService.addJob('file-processing', 'thumbnail-generation', { fileId, filePath });
      } else {
        // For non-images, queue S3 upload directly
        await queueService.addJob('file-processing', 's3-upload', { fileId, filePath });
      }
      
      logger.info(`EXIF extraction completed for file: ${fileId}`);
      
      return { success: true, exifData };
    } catch (error) {
      logger.error(`EXIF extraction failed for file ${job.data.fileId}:`, error);
      
      // Continue processing even if EXIF extraction fails
      const { fileId, filePath } = job.data;
      const fileInfo = await db.query('SELECT mime_type FROM files WHERE id = $1', [fileId]);
      
      if (fileInfo.rows[0]?.mime_type?.startsWith('image/')) {
        await queueService.addJob('file-processing', 'thumbnail-generation', { fileId, filePath });
      } else {
        await queueService.addJob('file-processing', 's3-upload', { fileId, filePath });
      }
      
      return { success: false, error: error.message };
    }
  }

  async processThumbnailGeneration(job) {
    try {
      const { fileId, filePath } = job.data;
      
      logger.info(`Processing thumbnail generation for file: ${fileId}`);
      
      // Update file status
      await db.query('UPDATE files SET processing_status = $1 WHERE id = $2', ['thumbnailing', fileId]);
      
      // Generate thumbnail
      const thumbnailResult = await fileProcessingService.generateThumbnail(filePath, fileId);
      
      // Update file with thumbnail path
      await db.query('UPDATE files SET thumbnail_path = $1 WHERE id = $2', [thumbnailResult.thumbnailPath, fileId]);
      
      // Queue S3 upload
      await queueService.addJob('file-processing', 's3-upload', { 
        fileId, 
        filePath, 
        thumbnailPath: thumbnailResult.thumbnailPath 
      });
      
      logger.info(`Thumbnail generation completed for file: ${fileId}`);
      
      return { success: true, thumbnailPath: thumbnailResult.thumbnailPath };
    } catch (error) {
      logger.error(`Thumbnail generation failed for file ${job.data.fileId}:`, error);
      
      // Continue with S3 upload even if thumbnail generation fails
      const { fileId, filePath } = job.data;
      await queueService.addJob('file-processing', 's3-upload', { fileId, filePath });
      
      return { success: false, error: error.message };
    }
  }

  async processS3Upload(job) {
    try {
      const { fileId, filePath, thumbnailPath } = job.data;
      
      logger.info(`Processing S3 upload for file: ${fileId}`);
      
      // Update file status
      await db.query('UPDATE files SET processing_status = $1 WHERE id = $2', ['uploading', fileId]);
      
      // Upload to S3
      const uploadResult = await fileProcessingService.uploadToS3(filePath, fileId, thumbnailPath);
      
      // Update file with S3 URLs
      await db.query(`
        UPDATE files 
        SET file_path = $1, thumbnail_path = $2, processing_status = $3, metadata = $4
        WHERE id = $5
      `, [
        uploadResult.fileUrl, 
        uploadResult.thumbnailUrl, 
        'completed', 
        JSON.stringify(uploadResult.metadata),
        fileId
      ]);
      
      // Clean up local files
      await fileProcessingService.deleteFile(filePath);
      if (thumbnailPath) {
        await fileProcessingService.deleteFile(thumbnailPath);
      }
      
      // Trigger webhook for file processing completion
      const fileData = await db.query('SELECT * FROM files WHERE id = $1', [fileId]);
      await webhookService.triggerEvent('file.processed', fileData.rows[0], fileData.rows[0].user_id);
      
      logger.info(`S3 upload completed for file: ${fileId}`);
      
      return { success: true, uploadResult };
    } catch (error) {
      logger.error(`S3 upload failed for file ${job.data.fileId}:`, error);
      
      // Update file status to failed
      await db.query('UPDATE files SET processing_status = $1 WHERE id = $2', ['failed', job.data.fileId]);
      
      throw error;
    }
  }

  // Webhook Delivery Worker
  async startWebhookDeliveryWorker() {
    try {
      const queue = queueService.getQueue('webhook-delivery');
      
      queue.process('webhook-delivery', 5, async (job) => {
        return await this.processWebhookDelivery(job);
      });

      this.workers.set('webhook-delivery', queue);
      logger.info('Webhook delivery worker started');
    } catch (error) {
      logger.error('Failed to start webhook delivery worker:', error);
      throw error;
    }
  }

  async processWebhookDelivery(job) {
    try {
      const { webhookId, event, payload, attempt = 1 } = job.data;
      
      logger.info(`Processing webhook delivery: ${webhookId} for event: ${event}`);
      
      const result = await webhookService.deliverWebhook(webhookId, event, payload, attempt);
      
      if (result.success) {
        logger.info(`Webhook delivered successfully: ${webhookId}`);
      } else {
        logger.warn(`Webhook delivery failed: ${webhookId} - ${result.error}`);
        throw new Error(result.error);
      }
      
      return result;
    } catch (error) {
      logger.error(`Webhook delivery failed for ${job.data.webhookId}:`, error);
      throw error;
    }
  }

  // Email Notification Worker
  async startEmailNotificationWorker() {
    try {
      const queue = queueService.getQueue('email-notifications');
      
      queue.process('email-notifications', 3, async (job) => {
        return await this.processEmailNotification(job);
      });

      this.workers.set('email-notifications', queue);
      logger.info('Email notification worker started');
    } catch (error) {
      logger.error('Failed to start email notification worker:', error);
      throw error;
    }
  }

  async processEmailNotification(job) {
    try {
      const { type, recipient, data } = job.data;
      
      logger.info(`Processing email notification: ${type} to ${recipient}`);
      
      let result;
      
      switch (type) {
        case 'file-processed':
          result = await emailService.sendFileProcessedNotification(recipient, data);
          break;
        case 'batch-completed':
          result = await emailService.sendBatchCompletedNotification(recipient, data);
          break;
        case 'export-ready':
          result = await emailService.sendExportReadyNotification(recipient, data);
          break;
        case 'security-alert':
          result = await emailService.sendSecurityAlert(recipient, data);
          break;
        default:
          throw new Error(`Unknown email notification type: ${type}`);
      }
      
      logger.info(`Email notification sent: ${type} to ${recipient}`);
      
      return result;
    } catch (error) {
      logger.error(`Email notification failed for ${job.data.type}:`, error);
      throw error;
    }
  }

  // Batch Processing Worker
  async startBatchProcessingWorker() {
    try {
      const queue = queueService.getQueue('batch-processing');
      
      queue.process('batch-processing', 2, async (job) => {
        return await this.processBatchOperation(job);
      });

      this.workers.set('batch-processing', queue);
      logger.info('Batch processing worker started');
    } catch (error) {
      logger.error('Failed to start batch processing worker:', error);
      throw error;
    }
  }

  // Export Processing Worker
  async startExportProcessingWorker() {
    try {
      const queue = queueService.getQueue('export-processing');
      
      queue.process('export-processing', 2, async (job) => {
        return await this.processExportJob(job);
      });

      this.workers.set('export-processing', queue);
      logger.info('Export processing worker started');
    } catch (error) {
      logger.error('Failed to start export processing worker:', error);
      throw error;
    }
  }

  async processExportJob(job) {
    try {
      const { jobId, exportConfig } = job.data;
      
      logger.info(`Processing export job: ${jobId} (${exportConfig.exportType})`);
      
      // Process the export using the export service
      const result = await exportService.processExport(job);
      
      // Send email notification when export is ready
      if (result.success && exportConfig.requestedBy) {
        await queueService.addJob('email-notifications', 'email-notifications', {
          type: 'export-ready',
          recipient: exportConfig.requestedBy,
          data: {
            jobId,
            exportType: exportConfig.exportType,
            format: exportConfig.format,
            fileName: result.fileInfo.fileName
          }
        });
      }
      
      logger.info(`Export job completed: ${jobId}`);
      
      return result;
    } catch (error) {
      logger.error(`Export job failed: ${job.data.jobId}`, error);
      throw error;
    }
  }

  async processBatchOperation(job) {
    try {
      const { type, items, userId, batchId } = job.data;
      
      logger.info(`Processing batch operation: ${type} with ${items.length} items`);
      
      const results = [];
      let successCount = 0;
      let errorCount = 0;

      // Update batch job status
      await this.updateBatchJobStatus(batchId, 'processing');

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const progress = Math.round(((i + 1) / items.length) * 100);
        job.progress(progress);

        try {
          let result;
          
          switch (type) {
            case 'bulk-exif-extraction':
              result = await fileProcessingService.extractExifData(item.fileId);
              break;
            case 'bulk-thumbnail-generation':
              result = await fileProcessingService.generateThumbnail(item.fileId);
              break;
            case 'bulk-file-deletion':
              result = await this.deleteFile(item.fileId, userId);
              break;
            default:
              throw new Error(`Unknown batch operation type: ${type}`);
          }

          results.push({
            itemId: item.id || item.fileId,
            success: result.success,
            result: result.success ? result : { error: result.error }
          });

          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          results.push({
            itemId: item.id || item.fileId,
            success: false,
            error: error.message
          });
          errorCount++;
        }
      }

      // Update batch job with results
      await this.updateBatchJobResults(batchId, {
        status: 'completed',
        results,
        successCount,
        errorCount,
        totalCount: items.length
      });

      // Trigger webhook for batch completion
      await webhookService.triggerEvent('batch.completed', {
        batchId,
        type,
        totalCount: items.length,
        successCount,
        errorCount,
        results
      }, userId);

      logger.info(`Batch operation completed: ${type} - ${successCount} success, ${errorCount} errors`);
      
      return {
        success: true,
        totalCount: items.length,
        successCount,
        errorCount,
        results
      };
    } catch (error) {
      logger.error(`Batch operation failed for ${job.data.type}:`, error);
      
      // Update batch job status to failed
      if (job.data.batchId) {
        await this.updateBatchJobStatus(job.data.batchId, 'failed', error.message);
        
        // Trigger webhook for batch failure
        await webhookService.triggerEvent('batch.failed', {
          batchId: job.data.batchId,
          type: job.data.type,
          error: error.message
        }, job.data.userId);
      }
      
      throw error;
    }
  }

  async updateBatchJobStatus(batchId, status, error = null) {
    try {
      await db.query(`
        UPDATE batch_jobs 
        SET status = $1, error_message = $2, updated_at = NOW()
        WHERE id = $3
      `, [status, error, batchId]);
    } catch (dbError) {
      logger.error('Failed to update batch job status:', dbError);
    }
  }

  async updateBatchJobResults(batchId, results) {
    try {
      await db.query(`
        UPDATE batch_jobs 
        SET status = $1, results = $2, completed_at = NOW(), updated_at = NOW()
        WHERE id = $3
      `, [results.status, JSON.stringify(results), batchId]);
    } catch (dbError) {
      logger.error('Failed to update batch job results:', dbError);
    }
  }

  async deleteFile(fileId, userId) {
    try {
      // Get file details
      const file = await db.query('SELECT * FROM files WHERE id = $1 AND user_id = $2', [fileId, userId]);
      
      if (file.rows.length === 0) {
        return { success: false, error: 'File not found' };
      }

      const fileRecord = file.rows[0];

      // Delete from storage
      if (fileRecord.file_path) {
        if (fileRecord.file_path.startsWith('http')) {
          // Delete from S3
          const s3Key = fileRecord.metadata?.s3Key;
          if (s3Key && fileProcessingService.useS3) {
            await fileProcessingService.s3.deleteObject({
              Bucket: fileProcessingService.s3Bucket,
              Key: s3Key
            }).promise();
          }
        } else {
          // Delete local file
          await fileProcessingService.deleteFile(fileRecord.file_path);
        }
      }

      // Delete thumbnail
      if (fileRecord.thumbnail_path) {
        await fileProcessingService.deleteFile(fileRecord.thumbnail_path);
      }

      // Delete from database
      await db.query('DELETE FROM files WHERE id = $1', [fileId]);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Cleanup Worker
  async startCleanupWorker() {
    try {
      const queue = queueService.getQueue('cleanup');
      
      queue.process('cleanup', 1, async (job) => {
        return await this.processCleanup(job);
      });

      this.workers.set('cleanup', queue);
      logger.info('Cleanup worker started');
    } catch (error) {
      logger.error('Failed to start cleanup worker:', error);
      throw error;
    }
  }

  async processCleanup(job) {
    try {
      const { type, options = {} } = job.data;
      
      logger.info(`Processing cleanup: ${type}`);
      
      let result;
      
      switch (type) {
        case 'old-files':
          result = await this.cleanupOldFiles(options.daysToKeep || 30);
          break;
        case 'failed-jobs':
          result = await this.cleanupFailedJobs(options.daysToKeep || 7);
          break;
        case 'audit-logs':
          result = await this.cleanupOldAuditLogs(options.daysToKeep || 90);
          break;
        case 'api-usage':
          result = await this.cleanupOldApiUsage(options.daysToKeep || 30);
          break;
        case 'export-files':
          result = await exportService.cleanupOldExports();
          break;
        default:
          throw new Error(`Unknown cleanup type: ${type}`);
      }
      
      logger.info(`Cleanup completed: ${type} - ${result.deletedCount} items removed`);
      
      return result;
    } catch (error) {
      logger.error(`Cleanup failed for ${job.data.type}:`, error);
      throw error;
    }
  }

  async scheduleRecurringCleanupJobs() {
    try {
      // Schedule daily cleanup jobs
      const cleanupJobs = [
        { type: 'old-files', options: { daysToKeep: 30 }, cron: '0 2 * * *' }, // 2 AM daily
        { type: 'failed-jobs', options: { daysToKeep: 7 }, cron: '0 3 * * *' }, // 3 AM daily
        { type: 'audit-logs', options: { daysToKeep: 90 }, cron: '0 4 * * 0' }, // 4 AM weekly
        { type: 'api-usage', options: { daysToKeep: 30 }, cron: '0 5 * * 0' }, // 5 AM weekly
        { type: 'export-files', options: {}, cron: '0 1 * * *' } // 1 AM daily
      ];

      for (const job of cleanupJobs) {
        await queueService.addRecurringJob('cleanup', 'cleanup', job, {
          repeat: { cron: job.cron },
          removeOnComplete: 5,
          removeOnFail: 3
        });
      }

      logger.info('Recurring cleanup jobs scheduled');
    } catch (error) {
      logger.error('Failed to schedule recurring cleanup jobs:', error);
    }
  }

  async cleanupOldAuditLogs(daysToKeep = 90) {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
      
      const result = await db.query(`
        DELETE FROM audit_logs 
        WHERE created_at < $1
      `, [cutoffDate]);
      
      return { deletedCount: result.rowCount };
    } catch (error) {
      logger.error('Failed to cleanup old audit logs:', error);
      throw error;
    }
  }

  async cleanupOldApiUsage(daysToKeep = 30) {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
      
      const result = await db.query(`
        DELETE FROM api_usage 
        WHERE created_at < $1
      `, [cutoffDate]);
      
      return { deletedCount: result.rowCount };
    } catch (error) {
      logger.error('Failed to cleanup old API usage:', error);
      throw error;
    }
  }

  async cleanupFailedJobs(daysToKeep = 7) {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
      
      // Clean up failed jobs from all queues
      let totalDeleted = 0;
      
      for (const [queueName] of this.workers) {
        const queue = queueService.getQueue(queueName);
        const failedJobs = await queue.getFailed();
        
        for (const job of failedJobs) {
          if (job.timestamp < cutoffDate.getTime()) {
            await job.remove();
            totalDeleted++;
          }
        }
      }
      
      return { deletedCount: totalDeleted };
    } catch (error) {
      logger.error('Failed to cleanup failed jobs:', error);
      throw error;
    }
  }

  // Health Check
  async healthCheck() {
    try {
      const health = {
        status: 'healthy',
        workers: {},
        queues: {}
      };

      // Check worker status
      for (const [name, worker] of this.workers) {
        health.workers[name] = {
          status: worker.client.status === 'ready' ? 'healthy' : 'unhealthy',
          isRunning: this.isRunning
        };
      }

      // Check queue statistics
      for (const [name] of this.workers) {
        const stats = await queueService.getQueueStats(name);
        health.queues[name] = stats;
      }

      // Determine overall health
      const unhealthyWorkers = Object.values(health.workers).filter(w => w.status !== 'healthy');
      if (unhealthyWorkers.length > 0) {
        health.status = 'degraded';
      }

      return health;
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

const queueWorkers = new QueueWorkers();

module.exports = queueWorkers; 