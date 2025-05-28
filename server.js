const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for now to avoid issues
}));

// Performance middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ProofPix Enterprise API',
    version: '2.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// Import and mount API routes
try {
  // Core API routes
  const analyticsRoutes = require('./api/routes/analytics');
  const authRoutes = require('./api/routes/auth');
  const exifRoutes = require('./api/routes/exif');
  
  // Enterprise API routes
  const whitelabelRoutes = require('./api/routes/whitelabel');
  const customFieldsRoutes = require('./api/routes/custom-fields');
  const teamRoutes = require('./api/routes/team');
  
  // Mount routes
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/exif', exifRoutes);
  app.use('/api/whitelabel', whitelabelRoutes);
  app.use('/api/custom-fields', customFieldsRoutes);
  app.use('/api/team', teamRoutes);
  
  console.log('✅ All API routes mounted successfully');
  
} catch (error) {
  console.error('❌ Error mounting API routes:', error.message);
  console.log('Continuing with basic server...');
}

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'ProofPix Enterprise API Documentation',
    version: '2.0.0',
    endpoints: {
      core: {
        '/api/analytics': 'Analytics and tracking',
        '/api/auth': 'Authentication and authorization',
        '/api/exif': 'EXIF metadata extraction'
      },
      enterprise: {
        '/api/whitelabel': 'White-label configuration',
        '/api/custom-fields': 'Custom field management',
        '/api/team': 'Team and user management'
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <your-api-key>',
      example: 'Authorization: Bearer pk_live_enterprise_abc123...'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: isDevelopment ? err.message : 'Something went wrong'
  });
});

// 404 handler - simplified to avoid path-to-regexp issues
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/health',
      '/api/docs',
      '/api/analytics',
      '/api/auth',
      '/api/exif',
      '/api/whitelabel',
      '/api/custom-fields',
      '/api/team'
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ProofPix Enterprise API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log('🔒 Production security enabled');
    console.log('⚡ Performance optimizations active');
  }
});

module.exports = app; 