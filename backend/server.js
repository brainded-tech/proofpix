require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const loggingService = require('./services/loggingService');

// Import optimization services
const memoryManager = require('./services/memoryManager');
const queryOptimizer = require('./database/queryOptimizer');
const loadBalancer = require('./services/loadBalancer');
const { middleware: cacheMiddleware } = require('./middleware/responseCache');

// Import middleware
const { sanitizeInput, securityHeaders, detectSuspiciousActivity, speedLimiter, gdprCompliance, createApiRateLimit } = require('./middleware/security');
const { authenticateToken, requireAuth, optionalAuth } = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Get centralized main logger
const logger = loggingService.getMainLogger();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Basic security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://proofpix.com', 'https://www.proofpix.com']
    : ['http://localhost:3000', 'http://localhost:8888'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Security middleware
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(detectSuspiciousActivity);
app.use(speedLimiter);
app.use(gdprCompliance);

// Response caching middleware (for GET requests)
app.use(cacheMiddleware());

// Body parsing middleware
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' })); // Raw body for Stripe webhooks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from React build
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Simple health check that ALWAYS works
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || '1.0.0',
    message: 'Server is running!',
    system: {
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version
    }
  });
});

// Test database endpoint
app.get('/test-db', async (req, res) => {
  try {
    const { testConnection } = require('./config/database');
    const connected = await testConnection();
    res.json({
      database: connected ? 'connected' : 'failed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Load routes with comprehensive error handling
const routes = [
  { path: '/health', file: './routes/health', name: 'Health' },
  { path: '/api/stripe', file: './routes/stripe', name: 'Stripe' },
  { path: '/api/auth', file: './routes/auth', name: 'Auth' },
  { path: '/api/users', file: './routes/users', name: 'Users' },
  { path: '/api/documents', file: './routes/documents', name: 'Documents' },
  { path: '/api/files', file: './routes/files', name: 'Files' },
  { path: '/api/exif', file: './routes/exif', name: 'EXIF Extraction' },
  { path: '/api/analytics', file: './routes/analytics', name: 'Analytics' },
  { path: '/api/security', file: './routes/security', name: 'Security' },
  { path: '/api/performance', file: './routes/performance', name: 'Performance' },
  { path: '/api/webhooks', file: './routes/webhooks', name: 'Webhooks' },
  { path: '/api/keys', file: './routes/apiKeys', name: 'API Keys' },
  { path: '/api/teams', file: './routes/teams', name: 'Teams' },
  { path: '/api/subscriptions', file: './routes/subscriptions', name: 'Subscriptions' },
  { path: '/api/payments', file: './routes/payments', name: 'Payments' },
  { path: '/api/integrations', file: './routes/integrations', name: 'Integrations' },
  { path: '/api/deployment', file: './routes/deployment', name: 'Deployment' },
  { path: '/api/plugins', file: './routes/plugins', name: 'Plugins' },
  { path: '/api/oauth', file: './routes/oauth', name: 'OAuth' },
  { path: '/api/templates', file: './routes/templates', name: 'Templates' },
  { path: '/api/proofs', file: './routes/proofs', name: 'Proofs' },
  { path: '/api/document-intelligence', file: './routes/documentIntelligence', name: 'Document Intelligence' },
  { path: '/api/ephemeral', file: './routes/ephemeral', name: 'Ephemeral Processing' },
  { path: '/api/ai', file: './routes/ai', name: 'AI & Machine Learning' },
  { path: '/api/ai-training', file: './routes/ai-training', name: 'AI Training Pipeline' },
  { path: '/api/enterprise', file: './routes/enterprise', name: 'Enterprise Services' },
  { path: '/api/financial', file: './routes/financial', name: 'Financial Analysis' },
  { path: '/api/marketplace', file: './routes/marketplace', name: 'Marketplace Services' },
  { path: '/api/mlops', file: './routes/mlops/dataValidation', name: 'MLOps Data Validation' },
  { path: '/api/monitoring', file: './routes/monitoring', name: 'System Monitoring' },
  { path: '/api/batch', file: './routes/batch', name: 'Batch Processing' },
  { path: '/api/realtime', file: './routes/realtime', name: 'Real-time Services' },
  { path: '/api/system', file: './routes/system', name: 'System Management' },
  { path: '/api/monitoring-dashboard', file: './routes/monitoring-dashboard', name: 'Monitoring Dashboard' },
  { path: '/api/modular-pricing', file: './routes/modularPricing', name: 'Modular Pricing System' },
  { path: '/api/meetings', file: './routes/meetings', name: 'ProofPix MEETINGS' },
  { path: '/api/trials', file: './routes/trials', name: 'Trial Management' },
  { path: '/api/documentation', file: './routes/documentation', name: 'Documentation Hub' }
];

const loadedRoutes = [];
const failedRoutes = [];

routes.forEach(({ path, file, name }) => {
  try {
    const routeModule = require(file);
    app.use(path, routeModule);
    loadedRoutes.push({ path, name, status: 'loaded' });
    logger.info(`✅ ${name} routes loaded successfully at ${path}`);
} catch (error) {
    failedRoutes.push({ path, name, error: error.message });
    logger.error(`❌ Failed to load ${name} routes:`, error.message);
    
    // Create a fallback route for failed modules
    app.use(path, (req, res) => {
    res.status(503).json({
        success: false,
        error: `${name} service temporarily unavailable`,
        message: 'Please try again later',
        code: 'SERVICE_UNAVAILABLE'
      });
    });
  }
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'ProofPix Enterprise API Documentation',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    routes: {
      loaded: loadedRoutes,
      failed: failedRoutes
    },
    endpoints: {
      core: {
        '/api/auth': 'Authentication and authorization',
        '/api/users': 'User management',
        '/api/files': 'File upload and processing',
        '/api/analytics': 'Analytics and tracking'
      },
      payment: {
        '/api/stripe': 'Stripe payment processing',
        '/api/payments': 'Payment management',
        '/api/subscriptions': 'Subscription management'
      },
      enterprise: {
        '/api/teams': 'Team and user management',
        '/api/security': 'Security monitoring',
        '/api/performance': 'Performance monitoring',
        '/api/integrations': 'Third-party integrations',
        '/api/webhooks': 'Webhook management',
        '/api/api-keys': 'API key management'
      },
      infrastructure: {
        '/api/deployment': 'Deployment management',
        '/api/plugins': 'Plugin system',
        '/api/oauth': 'OAuth2 authorization',
        '/health': 'Health check',
        '/test-db': 'Database connectivity test'
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <your-token>',
      example: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    rateLimit: {
      global: '1000 requests per 15 minutes',
      auth: '5 requests per 15 minutes',
      api: '100 requests per 15 minutes'
    }
  });
});

// Metrics endpoint for monitoring
app.get('/metrics', optionalAuth, (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    routes: {
      total: routes.length,
      loaded: loadedRoutes.length,
      failed: failedRoutes.length
    },
    environment: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || '1.0.0'
  };

  res.json({
    success: true,
    data: metrics
  });
});

// Serve React app for all non-API routes (client-side routing)
app.get('*', (req, res) => {
  // Don't serve React app for API routes
  if (req.path.startsWith('/api/') || req.path.startsWith('/health') || req.path.startsWith('/metrics')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use(errorHandler);

// 404 handler for API routes only
app.use('/api/*', notFoundHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  // Stop trial cron service
  try {
    const trialCronService = require('./services/trialCronService');
    trialCronService.stop();
    logger.info('Trial cron service stopped');
  } catch (error) {
    logger.error('Error stopping trial cron service:', error);
  }
  
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  // Stop trial cron service
  try {
    const trialCronService = require('./services/trialCronService');
    trialCronService.stop();
    logger.info('Trial cron service stopped');
  } catch (error) {
    logger.error('Error stopping trial cron service:', error);
  }
  
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, async () => {
  logger.info(`🚀 ProofPix Backend Server started`);
  logger.info(`📍 Port: ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  logger.info(`📚 API docs: http://localhost:${PORT}/api/docs`);
  logger.info(`📊 Metrics: http://localhost:${PORT}/metrics`);
  logger.info(`✅ Routes loaded: ${loadedRoutes.length}/${routes.length}`);
  
  if (failedRoutes.length > 0) {
    logger.warn(`⚠️  Failed routes: ${failedRoutes.length}`);
    failedRoutes.forEach(route => {
      logger.warn(`   - ${route.name}: ${route.error}`);
    });
  }

  // Initialize WebSocket service
  try {
    const websocketService = require('./services/websocketService');
    websocketService.initialize(server);
    logger.info(`🔌 WebSocket service initialized at ws://localhost:${PORT}/ws`);
  } catch (error) {
    logger.error('Failed to initialize WebSocket service:', error);
  }

  // Initialize Real-time Collaboration service for ProofPix MEETINGS
  try {
    const realtimeCollaborationService = require('./services/realtimeCollaborationService');
    realtimeCollaborationService.initialize(server);
    logger.info(`🎥 ProofPix MEETINGS real-time collaboration service initialized`);
  } catch (error) {
    logger.error('Failed to initialize real-time collaboration service:', error);
  }

  // Initialize metrics collection service
  try {
    const metricsCollector = require('./services/metricsCollector');
    await metricsCollector.start();
    logger.info(`📊 Metrics collection service started`);
  } catch (error) {
    logger.error('Failed to initialize metrics collection service:', error);
  }

  // Initialize trial cron service
  try {
    const trialCronService = require('./services/trialCronService');
    trialCronService.start();
    logger.info(`⏰ Trial cron service started`);
  } catch (error) {
    logger.error('Failed to initialize trial cron service:', error);
  }
});

module.exports = app;
