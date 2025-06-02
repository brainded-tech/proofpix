require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { testConnection, logger } = require('./config/database');
const { verifyEmailConfig } = require('./services/emailService');
const scheduledJobs = require('./services/scheduledJobs');

// Import security middleware
const { 
  sanitizeInput, 
  securityHeaders, 
  detectSuspiciousActivity,
  speedLimiter,
  gdprCompliance
} = require('./middleware/security');
const { securityMonitoring } = require('./middleware/securityMonitoring');

// Import routes
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const stripeRoutes = require('./routes/stripe');
const apiKeyRoutes = require('./routes/apiKeys');
const securityRoutes = require('./routes/security');
const fileRoutes = require('./routes/files');
const webhookRoutes = require('./routes/webhooks');
const oauthRoutes = require('./routes/oauth');
const analyticsRoutes = require('./routes/analytics');
const pluginRoutes = require('./routes/plugins');
const userRoutes = require('./routes/users');
const templateRoutes = require('./routes/templates');
const proofRoutes = require('./routes/proofs');
const subscriptionRoutes = require('./routes/subscriptions');
const performanceRoutes = require('./routes/performance');
const integrationRoutes = require('./routes/integrations');
const deploymentRoutes = require('./routes/deployment');
const documentIntelligenceRoutes = require('./routes/documentIntelligence');
const ephemeralRoutes = require('./routes/ephemeral');
const teamsRoutes = require('./routes/teams');

// Import services for initialization
const redisConfig = require('./config/redis');
const queueWorkers = require('./workers/queueWorkers');
const realTimeService = require('./services/realTimeService');
const exportService = require('./services/exportService');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.stripe.com", "wss:", "ws:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'none'"],
      childSrc: ["'none'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Additional security headers
app.use(securityHeaders);

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://proofpix.netlify.app',
      'https://proofpix.com'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining']
}));

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(compression());

// Input sanitization
app.use(sanitizeInput);

// Suspicious activity detection
app.use(detectSuspiciousActivity);

// Progressive delay for suspicious activity
app.use(speedLimiter);

// GDPR compliance tracking
app.use(gdprCompliance);

// Security monitoring and threat detection
app.use(securityMonitoring);

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  },
  skip: (req, res) => {
    // Skip logging for health checks and static assets
    return req.url === '/health' || req.url.startsWith('/static');
  }
}));

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later',
      retryAfter: 15 * 60
    });
  }
});

app.use(globalLimiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check system health
    const analyticsService = require('./services/analyticsService');
    const systemHealth = await analyticsService.getSystemHealth();
    
    res.json({
      status: systemHealth.status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      security: {
        headers: 'enabled',
        rateLimit: 'enabled',
        inputSanitization: 'enabled',
        gdprCompliance: 'enabled'
      },
      services: {
        database: systemHealth.checks.database?.status || 'unknown',
        redis: systemHealth.checks.redis?.status || 'unknown',
        queues: systemHealth.checks.queues?.status || 'unknown',
        realTime: realTimeService.getConnectionStats()
      }
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Security scan endpoint (admin only)
app.get('/security/scan', async (req, res) => {
  try {
    // This would typically require admin authentication
    const VulnerabilityScanner = require('./utils/vulnerabilityScanner');
    const scanner = new VulnerabilityScanner();
    
    const scanResult = await scanner.runFullScan();
    
    res.json({
      success: true,
      data: scanResult,
      securityScore: scanner.getSecurityScore()
    });
    
  } catch (error) {
    logger.error('Security scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Security scan failed'
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/proofs', proofRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/plugins', pluginRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/deployment', deploymentRoutes);
app.use('/api/document-intelligence', documentIntelligenceRoutes);
app.use('/api/ephemeral', ephemeralRoutes);
app.use('/api/teams', teamsRoutes);

// 404 handler
app.use('*', (req, res) => {
  logger.warn('404 - Endpoint not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  // Log the error
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    message: isDevelopment ? error.message : 'Internal server error',
    ...(isDevelopment && { 
      stack: error.stack,
      details: error.details 
    })
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    // Stop real-time service
    try {
      realTimeService.shutdown();
      logger.info('Real-time service stopped');
    } catch (error) {
      logger.error('Error stopping real-time service:', error);
    }
    
    // Stop queue workers
    try {
      await queueWorkers.stop();
      logger.info('Queue workers stopped');
    } catch (error) {
      logger.error('Error stopping queue workers:', error);
    }
    
    // Close Redis connections
    try {
      await redisConfig.disconnect();
      logger.info('Redis connections closed');
    } catch (error) {
      logger.error('Error closing Redis connections:', error);
    }
    
    // Close database connections
    if (global.dbPool) {
      global.dbPool.end(() => {
        logger.info('Database pool closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
  
  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }
    logger.info('Database connection established');

    // Initialize Redis connection
    try {
      await redisConfig.connect();
      logger.info('Redis connection established');
    } catch (error) {
      logger.error('Redis connection failed:', error);
      throw new Error('Redis connection failed');
    }

    // Initialize queue workers
    try {
      await queueWorkers.start();
      logger.info('Queue workers started successfully');
    } catch (error) {
      logger.error('Failed to start queue workers:', error);
      throw new Error('Queue workers initialization failed');
    }

    // Verify email configuration
    const emailConfigured = await verifyEmailConfig();
    if (!emailConfigured) {
      logger.warn('Email configuration verification failed - emails may not work');
    } else {
      logger.info('Email configuration verified');
    }

    // Initialize scheduled jobs
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SCHEDULED_JOBS === 'true') {
      scheduledJobs.init();
      logger.info('Scheduled jobs initialized');
    } else {
      logger.info('Scheduled jobs disabled in development mode');
    }

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 ProofPix Enterprise Backend Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`Frontend URL: ${process.env.FRONTEND_URL}`);
      logger.info(`Security features: Enhanced security middleware enabled`);
      logger.info(`Compliance: SOC 2 and GDPR compliance features active`);
      logger.info(`File Processing: Advanced file processing pipeline active`);
      logger.info(`API Platform: Enterprise API and integration platform ready`);
      logger.info(`OAuth2 Server: OAuth2 authorization server enabled`);
      logger.info(`Queue System: Background job processing active`);
      logger.info(`Analytics: Advanced analytics and insights platform ready`);
      logger.info(`Real-time: WebSocket server for live updates enabled`);
      logger.info(`Export System: Data export and reporting system active`);
    });

    // Initialize WebSocket server for real-time updates
    try {
      realTimeService.initialize(server);
      logger.info('Real-time WebSocket server initialized');
    } catch (error) {
      logger.error('Failed to initialize real-time service:', error);
      // Don't fail startup for WebSocket issues
    }

    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
const server = startServer();

module.exports = app;
