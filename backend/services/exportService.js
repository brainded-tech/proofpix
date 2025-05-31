const fs = require('fs');
const path = require('path');
const csv = require('csv-writer');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const db = require('../config/database');
const { logger } = require('../config/database');
const queueService = require('./queueService');
const analyticsService = require('./analyticsService');
const { auditLog } = require('./auditService');

class ExportService {
  constructor() {
    this.exportDirectory = process.env.EXPORT_DIRECTORY || path.join(__dirname, '../exports');
    this.maxFileAge = 24 * 60 * 60 * 1000; // 24 hours
    
    // Ensure export directory exists
    this.ensureExportDirectory();
    
    // Start cleanup job
    this.startCleanupJob();
  }

  ensureExportDirectory() {
    if (!fs.existsSync(this.exportDirectory)) {
      fs.mkdirSync(this.exportDirectory, { recursive: true });
    }
  }

  // Export Job Management

  async createExportJob(exportConfig) {
    try {
      const { userId, exportType, format, timeRange, filters, requestedBy } = exportConfig;
      
      // Validate export configuration
      this.validateExportConfig(exportConfig);
      
      // Create export job record
      const result = await db.query(`
        INSERT INTO export_jobs (
          user_id, export_type, format, time_range, filters, 
          status, requested_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, 'pending', $6, NOW(), NOW())
        RETURNING id, created_at
      `, [
        userId, exportType, format, timeRange, 
        JSON.stringify(filters), requestedBy
      ]);
      
      const exportJob = result.rows[0];
      
      // Estimate processing time based on export type and data size
      const estimatedTime = await this.estimateProcessingTime(exportType, filters);
      
      // Queue the export job
      await queueService.addJob('export-processing', 'processExport', {
        jobId: exportJob.id,
        exportConfig
      }, {
        priority: this.getJobPriority(exportType),
        delay: 0,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      });
      
      // Audit log
      await auditLog(userId, 'export_job_created', {
        jobId: exportJob.id,
        exportType,
        format,
        timeRange
      });
      
      logger.info(`Export job created: ${exportJob.id} for user ${userId}`);
      
      return {
        id: exportJob.id,
        status: 'pending',
        estimatedTime,
        createdAt: exportJob.created_at
      };
    } catch (error) {
      logger.error('Failed to create export job:', error);
      throw error;
    }
  }

  async getExportJobStatus(jobId, userId) {
    try {
      const result = await db.query(`
        SELECT 
          ej.*,
          CASE 
            WHEN ej.status = 'completed' AND ej.file_path IS NOT NULL 
            THEN true 
            ELSE false 
          END as download_ready
        FROM export_jobs ej
        WHERE ej.id = $1 AND ej.user_id = $2
      `, [jobId, userId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const job = result.rows[0];
      
      return {
        id: job.id,
        status: job.status,
        progress: job.progress || 0,
        exportType: job.export_type,
        format: job.format,
        timeRange: job.time_range,
        filters: JSON.parse(job.filters || '{}'),
        downloadReady: job.download_ready,
        fileName: job.file_name,
        fileSize: job.file_size,
        error: job.error_message,
        createdAt: job.created_at,
        completedAt: job.completed_at
      };
    } catch (error) {
      logger.error('Failed to get export job status:', error);
      throw error;
    }
  }

  async getExportFile(jobId, userId) {
    try {
      const result = await db.query(`
        SELECT file_path, file_name, file_size, mime_type
        FROM export_jobs
        WHERE id = $1 AND user_id = $2 AND status = 'completed' AND file_path IS NOT NULL
      `, [jobId, userId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const job = result.rows[0];
      const filePath = path.join(this.exportDirectory, job.file_path);
      
      if (!fs.existsSync(filePath)) {
        logger.error(`Export file not found: ${filePath}`);
        return null;
      }
      
      // Update download count
      await db.query(`
        UPDATE export_jobs 
        SET download_count = COALESCE(download_count, 0) + 1,
            last_downloaded_at = NOW()
        WHERE id = $1
      `, [jobId]);
      
      // Audit log
      await auditLog(userId, 'export_file_downloaded', {
        jobId,
        fileName: job.file_name
      });
      
      return {
        stream: fs.createReadStream(filePath),
        filename: job.file_name,
        size: job.file_size,
        mimeType: job.mime_type
      };
    } catch (error) {
      logger.error('Failed to get export file:', error);
      throw error;
    }
  }

  // Export Processing

  async processExport(job) {
    const { jobId, exportConfig } = job.data;
    
    try {
      // Update job status to processing
      await this.updateJobStatus(jobId, 'processing', 0);
      
      // Get data based on export type
      const data = await this.collectExportData(exportConfig);
      
      // Update progress
      await this.updateJobStatus(jobId, 'processing', 50);
      
      // Generate file based on format
      const fileInfo = await this.generateExportFile(data, exportConfig, jobId);
      
      // Update job with file information
      await this.updateJobWithFile(jobId, fileInfo);
      
      // Update job status to completed
      await this.updateJobStatus(jobId, 'completed', 100);
      
      logger.info(`Export job completed: ${jobId}`);
      
      return { success: true, fileInfo };
    } catch (error) {
      logger.error(`Export job failed: ${jobId}`, error);
      
      // Update job status to failed
      await this.updateJobStatus(jobId, 'failed', 0, error.message);
      
      throw error;
    }
  }

  async collectExportData(exportConfig) {
    const { exportType, timeRange, filters, userId } = exportConfig;
    
    switch (exportType) {
      case 'metrics':
        return await analyticsService.getSystemMetrics(timeRange, userId);
      
      case 'usage':
        return await analyticsService.getUsageData(timeRange, 'hour', userId);
      
      case 'queue':
        return await analyticsService.getProcessingQueueStatus();
      
      case 'all':
        return {
          metrics: await analyticsService.getSystemMetrics(timeRange, userId),
          usage: await analyticsService.getUsageData(timeRange, 'hour', userId),
          queue: await analyticsService.getProcessingQueueStatus()
        };
      
      default:
        throw new Error(`Unknown export type: ${exportType}`);
    }
  }

  async generateExportFile(data, exportConfig, jobId) {
    const { format, exportType } = exportConfig;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${exportType}_export_${timestamp}.${format}`;
    const filePath = path.join(this.exportDirectory, fileName);
    
    let mimeType;
    let fileSize;
    
    switch (format) {
      case 'csv':
        await this.generateCSV(data, filePath, exportType);
        mimeType = 'text/csv';
        break;
      
      case 'excel':
        await this.generateExcel(data, filePath, exportType);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      
      case 'json':
        await this.generateJSON(data, filePath);
        mimeType = 'application/json';
        break;
      
      case 'pdf':
        await this.generatePDF(data, filePath, exportType);
        mimeType = 'application/pdf';
        break;
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    // Get file size
    const stats = fs.statSync(filePath);
    fileSize = stats.size;
    
    return {
      fileName,
      filePath: fileName, // Store relative path
      fileSize,
      mimeType
    };
  }

  async generateCSV(data, filePath, exportType) {
    if (exportType === 'all') {
      // For 'all' exports, create multiple CSV files in a zip
      throw new Error('CSV format not supported for "all" export type. Use Excel or JSON instead.');
    }
    
    const records = this.flattenDataForCSV(data, exportType);
    
    if (records.length === 0) {
      throw new Error('No data available for export');
    }
    
    const headers = Object.keys(records[0]).map(key => ({
      id: key,
      title: this.formatHeaderName(key)
    }));
    
    const csvWriter = csv.createObjectCsvWriter({
      path: filePath,
      header: headers
    });
    
    await csvWriter.writeRecords(records);
  }

  async generateExcel(data, filePath, exportType) {
    const workbook = new ExcelJS.Workbook();
    
    if (exportType === 'all') {
      // Create multiple worksheets
      this.addMetricsWorksheet(workbook, data.metrics);
      this.addUsageWorksheet(workbook, data.usage);
      this.addQueueWorksheet(workbook, data.queue);
    } else {
      // Create single worksheet
      const worksheet = workbook.addWorksheet(this.formatHeaderName(exportType));
      this.populateWorksheet(worksheet, data, exportType);
    }
    
    await workbook.xlsx.writeFile(filePath);
  }

  async generateJSON(data, filePath) {
    const jsonData = {
      exportedAt: new Date().toISOString(),
      data: data
    };
    
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  }

  async generatePDF(data, filePath, exportType) {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    
    // Add title
    doc.fontSize(20).text(`${this.formatHeaderName(exportType)} Export Report`, 50, 50);
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, 50, 80);
    
    let yPosition = 120;
    
    if (exportType === 'all') {
      yPosition = this.addPDFSection(doc, 'Metrics', data.metrics, yPosition);
      yPosition = this.addPDFSection(doc, 'Usage Data', data.usage, yPosition);
      yPosition = this.addPDFSection(doc, 'Queue Status', data.queue, yPosition);
    } else {
      this.addPDFSection(doc, this.formatHeaderName(exportType), data, yPosition);
    }
    
    doc.end();
    
    return new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }

  // Helper Methods for File Generation

  flattenDataForCSV(data, exportType) {
    const records = [];
    
    switch (exportType) {
      case 'metrics':
        if (data.metrics) {
          // Flatten metrics data
          Object.entries(data.metrics).forEach(([category, categoryData]) => {
            if (typeof categoryData === 'object' && categoryData.timeSeries) {
              categoryData.timeSeries.forEach(point => {
                records.push({
                  category,
                  timestamp: point.timestamp,
                  value: point.value,
                  ...this.flattenObject(categoryData, ['timeSeries'])
                });
              });
            }
          });
        }
        break;
      
      case 'usage':
        if (data.data) {
          Object.entries(data.data).forEach(([type, typeData]) => {
            if (Array.isArray(typeData)) {
              typeData.forEach(point => {
                records.push({
                  type,
                  timestamp: point.timestamp,
                  value: point.value
                });
              });
            }
          });
        }
        break;
      
      case 'queue':
        if (data.jobs) {
          data.jobs.forEach(job => {
            records.push(this.flattenObject(job));
          });
        }
        break;
    }
    
    return records;
  }

  addMetricsWorksheet(workbook, metrics) {
    const worksheet = workbook.addWorksheet('Metrics');
    
    // Add headers
    worksheet.addRow(['Category', 'Metric', 'Value', 'Timestamp']);
    
    // Add data
    if (metrics && metrics.metrics) {
      Object.entries(metrics.metrics).forEach(([category, categoryData]) => {
        if (typeof categoryData === 'object') {
          Object.entries(categoryData).forEach(([metric, value]) => {
            if (metric !== 'timeSeries') {
              worksheet.addRow([category, metric, value, new Date().toISOString()]);
            }
          });
          
          // Add time series data
          if (categoryData.timeSeries) {
            categoryData.timeSeries.forEach(point => {
              worksheet.addRow([category, 'timeSeries', point.value, point.timestamp]);
            });
          }
        }
      });
    }
    
    // Style the worksheet
    this.styleWorksheet(worksheet);
  }

  addUsageWorksheet(workbook, usage) {
    const worksheet = workbook.addWorksheet('Usage Data');
    
    // Add headers
    worksheet.addRow(['Type', 'Timestamp', 'Value']);
    
    // Add data
    if (usage && usage.data) {
      Object.entries(usage.data).forEach(([type, typeData]) => {
        if (Array.isArray(typeData)) {
          typeData.forEach(point => {
            worksheet.addRow([type, point.timestamp, point.value]);
          });
        }
      });
    }
    
    this.styleWorksheet(worksheet);
  }

  addQueueWorksheet(workbook, queue) {
    const worksheet = workbook.addWorksheet('Queue Status');
    
    if (queue && queue.jobs && queue.jobs.length > 0) {
      // Add headers based on first job
      const headers = Object.keys(queue.jobs[0]);
      worksheet.addRow(headers);
      
      // Add data
      queue.jobs.forEach(job => {
        const row = headers.map(header => job[header]);
        worksheet.addRow(row);
      });
    }
    
    this.styleWorksheet(worksheet);
  }

  populateWorksheet(worksheet, data, exportType) {
    const records = this.flattenDataForCSV(data, exportType);
    
    if (records.length > 0) {
      // Add headers
      const headers = Object.keys(records[0]);
      worksheet.addRow(headers.map(h => this.formatHeaderName(h)));
      
      // Add data
      records.forEach(record => {
        const row = headers.map(header => record[header]);
        worksheet.addRow(row);
      });
    }
    
    this.styleWorksheet(worksheet);
  }

  styleWorksheet(worksheet) {
    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(maxLength + 2, 50);
    });
  }

  addPDFSection(doc, title, data, yPosition) {
    doc.fontSize(16).text(title, 50, yPosition);
    yPosition += 30;
    
    doc.fontSize(10);
    
    if (typeof data === 'object') {
      const text = JSON.stringify(data, null, 2);
      const lines = text.split('\n');
      
      lines.forEach(line => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        doc.text(line, 50, yPosition);
        yPosition += 12;
      });
    }
    
    return yPosition + 20;
  }

  flattenObject(obj, excludeKeys = []) {
    const flattened = {};
    
    Object.entries(obj).forEach(([key, value]) => {
      if (excludeKeys.includes(key)) return;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.entries(this.flattenObject(value)).forEach(([subKey, subValue]) => {
          flattened[`${key}_${subKey}`] = subValue;
        });
      } else {
        flattened[key] = value;
      }
    });
    
    return flattened;
  }

  formatHeaderName(name) {
    return name
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // Job Management

  async updateJobStatus(jobId, status, progress, errorMessage = null) {
    try {
      const updateFields = ['status = $2', 'progress = $3', 'updated_at = NOW()'];
      const values = [jobId, status, progress];
      let paramCount = 3;
      
      if (status === 'completed') {
        updateFields.push(`completed_at = $${++paramCount}`);
        values.push(new Date());
      }
      
      if (errorMessage) {
        updateFields.push(`error_message = $${++paramCount}`);
        values.push(errorMessage);
      }
      
      await db.query(`
        UPDATE export_jobs 
        SET ${updateFields.join(', ')}
        WHERE id = $1
      `, values);
    } catch (error) {
      logger.error('Failed to update job status:', error);
    }
  }

  async updateJobWithFile(jobId, fileInfo) {
    try {
      await db.query(`
        UPDATE export_jobs 
        SET file_name = $2, file_path = $3, file_size = $4, mime_type = $5, updated_at = NOW()
        WHERE id = $1
      `, [jobId, fileInfo.fileName, fileInfo.filePath, fileInfo.fileSize, fileInfo.mimeType]);
    } catch (error) {
      logger.error('Failed to update job with file info:', error);
      throw error;
    }
  }

  // Validation and Utilities

  validateExportConfig(config) {
    const { exportType, format, timeRange } = config;
    
    const validExportTypes = ['metrics', 'usage', 'queue', 'all'];
    const validFormats = ['csv', 'excel', 'json', 'pdf'];
    const validTimeRanges = ['1h', '24h', '7d', '30d', '90d'];
    
    if (!validExportTypes.includes(exportType)) {
      throw new Error(`Invalid export type: ${exportType}`);
    }
    
    if (!validFormats.includes(format)) {
      throw new Error(`Invalid format: ${format}`);
    }
    
    if (timeRange && !validTimeRanges.includes(timeRange)) {
      throw new Error(`Invalid time range: ${timeRange}`);
    }
    
    // CSV doesn't support 'all' export type
    if (format === 'csv' && exportType === 'all') {
      throw new Error('CSV format is not supported for "all" export type');
    }
  }

  async estimateProcessingTime(exportType, filters) {
    // Simple estimation based on export type
    const baseTime = {
      'metrics': 30,
      'usage': 45,
      'queue': 15,
      'all': 90
    };
    
    return baseTime[exportType] || 30; // seconds
  }

  getJobPriority(exportType) {
    const priorities = {
      'queue': 1,      // Highest priority
      'metrics': 2,
      'usage': 3,
      'all': 4         // Lowest priority
    };
    
    return priorities[exportType] || 3;
  }

  // Cleanup

  startCleanupJob() {
    // Run cleanup every hour
    setInterval(() => {
      this.cleanupOldExports();
    }, 60 * 60 * 1000);
  }

  async cleanupOldExports() {
    try {
      const cutoffDate = new Date(Date.now() - this.maxFileAge);
      
      // Get old export jobs
      const result = await db.query(`
        SELECT id, file_path
        FROM export_jobs
        WHERE created_at < $1 AND file_path IS NOT NULL
      `, [cutoffDate]);
      
      // Delete files and update database
      for (const job of result.rows) {
        const filePath = path.join(this.exportDirectory, job.file_path);
        
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          
          await db.query(`
            UPDATE export_jobs 
            SET file_path = NULL, file_name = NULL, file_size = NULL
            WHERE id = $1
          `, [job.id]);
          
        } catch (error) {
          logger.error(`Failed to cleanup export file: ${filePath}`, error);
        }
      }
      
      logger.info(`Cleaned up ${result.rows.length} old export files`);
    } catch (error) {
      logger.error('Failed to cleanup old exports:', error);
    }
  }
}

const exportService = new ExportService();

module.exports = exportService; 