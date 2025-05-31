/**
 * Performance Monitoring Routes - Priority 17
 * Provides API endpoints for performance metrics and monitoring
 */

const express = require('express');
const router = express.Router();
const performanceService = require('../services/performanceService');
const { requireAuth, requireSubscription } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for performance endpoints
const performanceRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many performance requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all performance routes
router.use(performanceRateLimit);

/**
 * GET /api/performance/metrics
 * Get current performance metrics
 */
router.get('/metrics', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const metrics = await performanceService.getCurrentPerformanceMetrics();
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Failed to get performance metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve performance metrics'
    });
  }
});

/**
 * GET /api/performance/metrics/historical
 * Get historical performance metrics for a time range
 */
router.get('/metrics/historical', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'startTime and endTime parameters are required'
      });
    }

    const start = parseInt(startTime);
    const end = parseInt(endTime);
    
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: 'startTime and endTime must be valid timestamps'
      });
    }

    const metrics = await performanceService.getPerformanceMetrics(start, end);
    
    res.json({
      success: true,
      data: metrics,
      timeRange: {
        start: start,
        end: end,
        duration: end - start
      }
    });
  } catch (error) {
    console.error('Failed to get historical performance metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve historical performance metrics'
    });
  }
});

/**
 * GET /api/performance/prometheus
 * Get Prometheus-formatted metrics
 */
router.get('/prometheus', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const metrics = await performanceService.getPrometheusMetrics();
    
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    console.error('Failed to get Prometheus metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Prometheus metrics'
    });
  }
});

/**
 * POST /api/performance/optimize
 * Trigger performance optimization
 */
router.post('/optimize', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const optimizations = await performanceService.optimizePerformance();
    
    res.json({
      success: true,
      message: 'Performance optimization completed',
      data: {
        optimizations,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Failed to optimize performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize performance'
    });
  }
});

/**
 * GET /api/performance/alerts
 * Get recent performance alerts
 */
router.get('/alerts', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { limit = 50, severity } = req.query;
    
    // Get alerts from Redis
    const alertsData = await performanceService.redis.lrange('performance:alerts', 0, parseInt(limit) - 1);
    const alerts = alertsData.map(data => JSON.parse(data));
    
    // Filter by severity if specified
    let filteredAlerts = alerts;
    if (severity) {
      filteredAlerts = alerts.filter(alert => alert.severity === severity);
    }
    
    res.json({
      success: true,
      data: {
        alerts: filteredAlerts,
        total: filteredAlerts.length,
        filters: { severity, limit: parseInt(limit) }
      }
    });
  } catch (error) {
    console.error('Failed to get performance alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve performance alerts'
    });
  }
});

/**
 * GET /api/performance/health
 * Get system health status
 */
router.get('/health', requireAuth, async (req, res) => {
  try {
    const metrics = await performanceService.getCurrentPerformanceMetrics();
    
    // Determine health status based on metrics
    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      checks: {
        memory: {
          status: 'healthy',
          usage: metrics.memoryUsed,
          total: metrics.memoryTotal,
          percentage: (metrics.memoryUsed / metrics.memoryTotal) * 100
        },
        cpu: {
          status: 'healthy',
          usage: metrics.cpuUsage
        },
        cache: {
          status: 'healthy',
          hitRate: metrics.cacheHitRate
        },
        responseTime: {
          status: 'healthy',
          average: metrics.avgResponseTime
        },
        errorRate: {
          status: 'healthy',
          rate: metrics.errorRate
        }
      }
    };

    // Check thresholds and update status
    const thresholds = performanceService.performanceThresholds;
    
    if (health.checks.memory.percentage > thresholds.memoryUsage) {
      health.checks.memory.status = 'warning';
      health.status = 'degraded';
    }
    
    if (health.checks.cpu.usage > thresholds.cpuUsage) {
      health.checks.cpu.status = 'warning';
      health.status = 'degraded';
    }
    
    if (health.checks.responseTime.average > thresholds.responseTime) {
      health.checks.responseTime.status = 'warning';
      health.status = 'degraded';
    }
    
    if (health.checks.errorRate.rate > thresholds.errorRate) {
      health.checks.errorRate.status = 'critical';
      health.status = 'unhealthy';
    }

    // Set appropriate HTTP status code
    let statusCode = 200;
    if (health.status === 'degraded') statusCode = 200;
    if (health.status === 'unhealthy') statusCode = 503;
    
    res.status(statusCode).json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Failed to get health status:', error);
    res.status(503).json({
      success: false,
      message: 'Failed to retrieve health status',
      data: {
        status: 'unhealthy',
        timestamp: Date.now(),
        error: 'Health check failed'
      }
    });
  }
});

/**
 * GET /api/performance/dashboard
 * Get comprehensive dashboard data
 */
router.get('/dashboard', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { timeRange = '1h' } = req.query;
    
    // Calculate time range
    const now = Date.now();
    let startTime;
    
    switch (timeRange) {
      case '1h':
        startTime = now - (60 * 60 * 1000);
        break;
      case '6h':
        startTime = now - (6 * 60 * 60 * 1000);
        break;
      case '24h':
        startTime = now - (24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = now - (60 * 60 * 1000);
    }

    // Get current metrics
    const currentMetrics = await performanceService.getCurrentPerformanceMetrics();
    
    // Get historical metrics
    const historicalMetrics = await performanceService.getPerformanceMetrics(startTime, now);
    
    // Get recent alerts
    const alertsData = await performanceService.redis.lrange('performance:alerts', 0, 9);
    const recentAlerts = alertsData.map(data => JSON.parse(data));
    
    // Calculate summary statistics
    const summary = {
      totalRequests: historicalMetrics.memory.length, // Placeholder
      averageResponseTime: currentMetrics.avgResponseTime,
      errorRate: currentMetrics.errorRate,
      uptime: process.uptime(),
      memoryUsage: (currentMetrics.memoryUsed / currentMetrics.memoryTotal) * 100,
      cacheHitRate: currentMetrics.cacheHitRate,
      activeConnections: currentMetrics.activeConnections
    };

    res.json({
      success: true,
      data: {
        summary,
        currentMetrics,
        historicalMetrics,
        recentAlerts,
        timeRange: {
          start: startTime,
          end: now,
          duration: now - startTime,
          label: timeRange
        }
      }
    });
  } catch (error) {
    console.error('Failed to get dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data'
    });
  }
});

/**
 * POST /api/performance/record/http
 * Record HTTP request metrics (internal use)
 */
router.post('/record/http', requireAuth, async (req, res) => {
  try {
    const { method, route, statusCode, duration } = req.body;
    
    if (!method || !route || !statusCode || duration === undefined) {
      return res.status(400).json({
        success: false,
        message: 'method, route, statusCode, and duration are required'
      });
    }

    performanceService.recordHttpRequest(method, route, statusCode, duration);
    
    res.json({
      success: true,
      message: 'HTTP request metrics recorded'
    });
  } catch (error) {
    console.error('Failed to record HTTP metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record HTTP metrics'
    });
  }
});

/**
 * POST /api/performance/record/db
 * Record database query metrics (internal use)
 */
router.post('/record/db', requireAuth, async (req, res) => {
  try {
    const { queryType, table, duration } = req.body;
    
    if (!queryType || !table || duration === undefined) {
      return res.status(400).json({
        success: false,
        message: 'queryType, table, and duration are required'
      });
    }

    performanceService.recordDbQuery(queryType, table, duration);
    
    res.json({
      success: true,
      message: 'Database query metrics recorded'
    });
  } catch (error) {
    console.error('Failed to record database metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record database metrics'
    });
  }
});

/**
 * GET /api/performance/thresholds
 * Get current performance thresholds
 */
router.get('/thresholds', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    res.json({
      success: true,
      data: performanceService.performanceThresholds
    });
  } catch (error) {
    console.error('Failed to get performance thresholds:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve performance thresholds'
    });
  }
});

/**
 * PUT /api/performance/thresholds
 * Update performance thresholds
 */
router.put('/thresholds', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { responseTime, memoryUsage, cpuUsage, errorRate } = req.body;
    
    // Validate thresholds
    if (responseTime !== undefined && (responseTime < 100 || responseTime > 10000)) {
      return res.status(400).json({
        success: false,
        message: 'responseTime must be between 100 and 10000 milliseconds'
      });
    }
    
    if (memoryUsage !== undefined && (memoryUsage < 50 || memoryUsage > 95)) {
      return res.status(400).json({
        success: false,
        message: 'memoryUsage must be between 50 and 95 percent'
      });
    }
    
    if (cpuUsage !== undefined && (cpuUsage < 50 || cpuUsage > 95)) {
      return res.status(400).json({
        success: false,
        message: 'cpuUsage must be between 50 and 95 percent'
      });
    }
    
    if (errorRate !== undefined && (errorRate < 1 || errorRate > 20)) {
      return res.status(400).json({
        success: false,
        message: 'errorRate must be between 1 and 20 percent'
      });
    }

    // Update thresholds
    if (responseTime !== undefined) performanceService.performanceThresholds.responseTime = responseTime;
    if (memoryUsage !== undefined) performanceService.performanceThresholds.memoryUsage = memoryUsage;
    if (cpuUsage !== undefined) performanceService.performanceThresholds.cpuUsage = cpuUsage;
    if (errorRate !== undefined) performanceService.performanceThresholds.errorRate = errorRate;
    
    res.json({
      success: true,
      message: 'Performance thresholds updated',
      data: performanceService.performanceThresholds
    });
  } catch (error) {
    console.error('Failed to update performance thresholds:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update performance thresholds'
    });
  }
});

module.exports = router; 