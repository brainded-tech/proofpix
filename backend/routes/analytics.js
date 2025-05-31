const express = require('express');
const { body, query, validationResult } = require('express-validator');
const analyticsService = require('../services/analyticsService');
const filteringService = require('../services/filteringService');
const { authenticateToken, requireAuth } = require('../middleware/auth');
const { logger } = require('../config/database');
const exportService = require('../services/exportService');
const { auditLog } = require('../services/auditService');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Middleware for handling validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Simple plan check middleware
const requireEnterprise = (req, res, next) => {
  if (!req.user || (req.user.subscriptionTier !== 'enterprise' && req.user.subscriptionTier !== 'professional')) {
    return res.status(403).json({
      success: false,
      message: 'This feature requires Professional or Enterprise subscription',
      upgradeUrl: '/pricing'
    });
  }
  next();
};

// Rate limiting for analytics endpoints
const analyticsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many analytics requests, please try again later' }
});

// GET /api/analytics/metrics - Get system metrics
router.get('/metrics',
  authenticateToken,
  requireEnterprise,
  [
    query('timeRange')
      .optional()
      .isIn(['1h', '24h', '7d', '30d', '90d'])
      .withMessage('Invalid time range'),
    query('userId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { timeRange = '24h', userId } = req.query;
      
      // Only allow users to see their own data unless they're admin
      const targetUserId = req.user.role === 'admin' ? userId : req.user.id;
      
      const metrics = await analyticsService.getSystemMetrics(timeRange, targetUserId);
      
      res.json({
        success: true,
        data: metrics,
        timeRange,
        userId: targetUserId
      });
    } catch (error) {
      logger.error('Failed to get analytics metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analytics metrics'
      });
    }
  }
);

// GET /api/analytics/usage-data - Get usage data with granularity
router.get('/usage-data',
  authenticateToken,
  requireEnterprise,
  [
    query('timeRange')
      .optional()
      .isIn(['1h', '24h', '7d', '30d', '90d'])
      .withMessage('Invalid time range'),
    query('granularity')
      .optional()
      .isIn(['minute', 'hour', 'day', 'week'])
      .withMessage('Invalid granularity'),
    query('userId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { timeRange = '24h', granularity = 'hour', userId } = req.query;
      
      // Only allow users to see their own data unless they're admin
      const targetUserId = req.user.role === 'admin' ? userId : req.user.id;
      
      const usageData = await analyticsService.getUsageData(timeRange, granularity, targetUserId);
      
      res.json({
        success: true,
        data: usageData,
        timeRange,
        granularity,
        userId: targetUserId
      });
      } catch (error) {
      logger.error('Failed to get usage data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve usage data'
        });
      }
    }
);

// GET /api/analytics/processing-queue - Get processing queue status
router.get('/processing-queue',
  authenticateToken,
  requireEnterprise,
  [
    query('status')
      .optional()
      .isIn(['pending', 'processing', 'completed', 'failed'])
      .withMessage('Invalid status'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Limit must be between 1 and 1000')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { status, limit = 100 } = req.query;
      
      const queueStatus = await analyticsService.getProcessingQueueStatus(status, parseInt(limit));
      
      res.json({
        success: true,
        data: queueStatus,
        filters: { status, limit }
      });
    } catch (error) {
      logger.error('Failed to get processing queue status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve processing queue status'
      });
    }
  }
);

// GET /api/analytics/real-time-metrics - Get real-time metrics
router.get('/real-time-metrics',
  authenticateToken,
  requireEnterprise,
  async (req, res) => {
    try {
      const metrics = await analyticsService.getRealTimeMetrics();

    res.json({
      success: true,
        data: metrics,
        timestamp: new Date().toISOString()
    });
  } catch (error) {
      logger.error('Failed to get real-time metrics:', error);
    res.status(500).json({ 
        success: false,
        message: 'Failed to retrieve real-time metrics'
      });
    }
  }
);

// POST /api/analytics/export - Export analytics data
router.post('/export',
  authenticateToken,
  requireEnterprise,
  [
    body('exportType')
      .isIn(['metrics', 'usage', 'queue', 'all'])
      .withMessage('Invalid export type'),
    body('format')
      .isIn(['csv', 'excel', 'json', 'pdf'])
      .withMessage('Invalid export format'),
    body('timeRange')
      .optional()
      .isIn(['1h', '24h', '7d', '30d', '90d'])
      .withMessage('Invalid time range'),
    body('filters')
      .optional()
      .isObject()
      .withMessage('Filters must be an object')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { exportType, format, timeRange = '24h', filters = {} } = req.body;
      const userId = req.user.role === 'admin' ? filters.userId : req.user.id;
      
      // Create export job
      const exportJob = await analyticsService.createExportJob({
        userId: req.user.id,
        exportType,
        format,
      timeRange,
        filters: { ...filters, userId },
        requestedBy: req.user.email
      });
      
      res.json({
        success: true,
        message: 'Export job created successfully',
        jobId: exportJob.id,
        estimatedTime: exportJob.estimatedTime
      });
  } catch (error) {
      logger.error('Failed to create export job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create export job'
      });
    }
  }
);

// GET /api/analytics/export/:jobId/status - Get export job status
router.get('/export/:jobId/status',
  authenticateToken,
  requireEnterprise,
  async (req, res) => {
    try {
      const { jobId } = req.params;
      
      const jobStatus = await analyticsService.getExportJobStatus(jobId, req.user.id);
      
      if (!jobStatus) {
        return res.status(404).json({
          success: false,
          message: 'Export job not found'
        });
      }
      
      res.json({
        success: true,
        data: jobStatus
      });
    } catch (error) {
      logger.error('Failed to get export job status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve export job status'
      });
    }
  }
);

// GET /api/analytics/export/:jobId/download - Download export file
router.get('/export/:jobId/download',
  authenticateToken,
  requireEnterprise,
  async (req, res) => {
    try {
      const { jobId } = req.params;
      
      const exportFile = await analyticsService.getExportFile(jobId, req.user.id);
      
      if (!exportFile) {
        return res.status(404).json({
          success: false,
          message: 'Export file not found or not ready'
        });
      }
      
      // Set appropriate headers for file download
      res.setHeader('Content-Type', exportFile.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${exportFile.filename}"`);
      res.setHeader('Content-Length', exportFile.size);
      
      // Stream the file
      exportFile.stream.pipe(res);
  } catch (error) {
      logger.error('Failed to download export file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download export file'
      });
    }
  }
);

// POST /api/analytics/filters/apply - Apply advanced filters
router.post('/filters/apply',
  authenticateToken,
  requireEnterprise,
  [
    body('filterConfig')
      .isObject()
      .withMessage('Filter configuration is required'),
    body('baseTable')
      .optional()
      .isIn(['files', 'api_usage', 'webhooks', 'users'])
      .withMessage('Invalid base table'),
    body('userId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { filterConfig, baseTable = 'files', userId } = req.body;
      
      // Only allow users to filter their own data unless they're admin
      const targetUserId = req.user.role === 'admin' ? userId : req.user.id;
      
      const results = await filteringService.applyFilters(filterConfig, baseTable, targetUserId);
      
      res.json({
        success: true,
        data: results,
        baseTable,
        userId: targetUserId
      });
    } catch (error) {
      logger.error('Failed to apply filters:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to apply filters',
        error: error.message
      });
    }
  }
);

// POST /api/analytics/filters/save - Save filter configuration
router.post('/filters/save',
  authenticateToken,
  requireEnterprise,
  [
    body('name')
      .isLength({ min: 1, max: 100 })
      .withMessage('Filter name must be between 1 and 100 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('filterConfig')
      .isObject()
      .withMessage('Filter configuration is required'),
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const filterData = req.body;
      
      const savedFilter = await filteringService.saveFilter(req.user.id, filterData);
      
      res.json({
        success: true,
        message: 'Filter saved successfully',
        data: savedFilter
      });
    } catch (error) {
      logger.error('Failed to save filter:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save filter',
        error: error.message
      });
    }
  }
);

// GET /api/analytics/filters/saved - Get saved filters
router.get('/filters/saved',
  authenticateToken,
  requireEnterprise,
  [
    query('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { isPublic } = req.query;
      
      const savedFilters = await filteringService.getSavedFilters(req.user.id, isPublic);
      
      res.json({
        success: true,
        data: savedFilters
      });
    } catch (error) {
      logger.error('Failed to get saved filters:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve saved filters'
      });
    }
  }
);

// PUT /api/analytics/filters/:filterId - Update saved filter
router.put('/filters/:filterId',
  authenticateToken,
  requireEnterprise,
  [
    body('name')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Filter name must be between 1 and 100 characters'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('filterConfig')
      .optional()
      .isObject()
      .withMessage('Filter configuration must be an object'),
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { filterId } = req.params;
      const updates = req.body;
      
      const updatedFilter = await filteringService.updateSavedFilter(
        parseInt(filterId), 
        req.user.id, 
        updates
      );
      
      res.json({
        success: true,
        message: 'Filter updated successfully',
        data: updatedFilter
      });
    } catch (error) {
      logger.error('Failed to update filter:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update filter',
        error: error.message
      });
    }
  }
);

// DELETE /api/analytics/filters/:filterId - Delete saved filter
router.delete('/filters/:filterId',
  authenticateToken,
  requireEnterprise,
  async (req, res) => {
    try {
      const { filterId } = req.params;
      
      await filteringService.deleteSavedFilter(parseInt(filterId), req.user.id);
      
      res.json({
        success: true,
        message: 'Filter deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete filter:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete filter',
        error: error.message
      });
    }
  }
);

// GET /api/analytics/filters/fields - Get available filter fields
router.get('/filters/fields',
  authenticateToken,
  requireEnterprise,
  [
    query('dataType')
      .optional()
      .isIn(['files', 'users', 'api_usage', 'webhooks'])
      .withMessage('Invalid data type')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { dataType } = req.query;
      
      const fields = await filteringService.getFilterFields(dataType);
      const operators = filteringService.getSupportedOperators();
      
      res.json({
        success: true,
        data: {
          fields,
          operators
        }
      });
    } catch (error) {
      logger.error('Failed to get filter fields:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve filter fields'
      });
    }
  }
);

// GET /api/analytics/filters/analytics - Get filter usage analytics
router.get('/filters/analytics',
  authenticateToken,
  requireEnterprise,
  [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid start date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid end date'),
    query('userId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { startDate, endDate, userId } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      // Only allow users to see their own analytics unless they're admin
      const targetUserId = req.user.role === 'admin' ? userId : req.user.id;
      
      const analytics = await filteringService.getFilterAnalytics(targetUserId, start, end);
      
      res.json({
        success: true,
        data: analytics,
        dateRange: { startDate: start, endDate: end },
        userId: targetUserId
      });
    } catch (error) {
      logger.error('Failed to get filter analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve filter analytics'
      });
    }
  }
);

// GET /api/analytics/system-health - Get system health status
router.get('/system-health',
  authenticateToken,
  requireEnterprise,
  async (req, res) => {
    try {
      const systemHealth = await analyticsService.getSystemHealth();
      
      res.json({
        success: true,
        data: systemHealth,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to get system health:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve system health'
      });
    }
  }
);

// POST /api/analytics/performance-metric - Record custom performance metric
router.post('/performance-metric',
  authenticateToken,
  requireEnterprise,
  [
    body('metricName')
      .isLength({ min: 1, max: 100 })
      .withMessage('Metric name must be between 1 and 100 characters'),
    body('value')
      .isNumeric()
      .withMessage('Value must be numeric'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { metricName, value, metadata = {} } = req.body;
      
      await analyticsService.recordPerformanceMetric(
        metricName, 
        parseFloat(value), 
        { ...metadata, userId: req.user.id }
      );
      
      res.json({
        success: true,
        message: 'Performance metric recorded successfully'
      });
    } catch (error) {
      logger.error('Failed to record performance metric:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record performance metric'
      });
    }
  }
);

module.exports = router; 