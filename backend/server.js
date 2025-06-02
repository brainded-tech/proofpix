require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Simple health check that ALWAYS works
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    message: 'Server is running!'
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

// Load routes with error handling
try {
  // Stripe webhook endpoint (essential for payments)
  app.use('/api/stripe', require('./routes/stripe'));
  console.log('✅ Stripe routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Stripe routes:', error.message);
  // Create a fallback route
  app.use('/api/stripe', (req, res) => {
    res.status(503).json({
      error: 'Stripe service temporarily unavailable',
      message: 'Please try again later'
    });
  });
}

try {
  // Basic auth routes
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Auth routes:', error.message);
  // Create a fallback route
  app.use('/api/auth', (req, res) => {
    res.status(503).json({
      error: 'Auth service temporarily unavailable',
      message: 'Please try again later'
    });
  });
}

// Catch all
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /health',
      'GET /test-db',
      'POST /api/stripe/create-checkout-session',
      'POST /api/stripe/webhook'
    ]
  });
});

// Start server - NO COMPLEX INITIALIZATION
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
