const express = require('express');
const router = express.Router();
const os = require('os');

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const startTime = process.hrtime();
    
    // Basic system metrics
    const systemMetrics = {
      cpuUsage: process.cpuUsage(),
      memoryUsage: process.memoryUsage(),
      systemMemory: {
        total: os.totalmem(),
        free: os.freemem()
      },
      loadAverage: os.loadavg(),
      uptime: process.uptime()
    };

    // Application metrics
    const appMetrics = {
      version: process.env.REACT_APP_VERSION || '2.0.0',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      platform: process.platform,
      arch: process.arch
    };

    // Feature flags
    const features = {
      documentAI: process.env.REACT_APP_DOCUMENT_AI_ENABLED === 'true',
      batchProcessing: process.env.REACT_APP_BATCH_PROCESSING === 'true',
      enterpriseMode: process.env.REACT_APP_ENTERPRISE_MODE === 'true',
      whiteLabel: process.env.REACT_APP_WHITE_LABEL === 'true'
    };

    // Calculate response time
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const responseTime = seconds * 1000 + nanoseconds / 1000000;

    // Construct health check response
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime.toFixed(2)}ms`,
      system: {
        cpu: {
          user: systemMetrics.cpuUsage.user,
          system: systemMetrics.cpuUsage.system
        },
        memory: {
          heapUsed: Math.round(systemMetrics.memoryUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(systemMetrics.memoryUsage.heapTotal / 1024 / 1024),
          external: Math.round(systemMetrics.memoryUsage.external / 1024 / 1024),
          systemTotal: Math.round(systemMetrics.systemMemory.total / 1024 / 1024),
          systemFree: Math.round(systemMetrics.systemMemory.free / 1024 / 1024)
        },
        load: systemMetrics.loadAverage,
        uptime: Math.floor(systemMetrics.uptime)
      },
      application: appMetrics,
      features: features,
      endpoints: {
        api: [
          '/api/analytics',
          '/api/auth',
          '/api/exif',
          '/api/whitelabel',
          '/api/custom-fields',
          '/api/team'
        ]
      }
    };

    res.json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router; 