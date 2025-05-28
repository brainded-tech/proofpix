const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    },
    api: {
      version: '2.0',
      endpoints: ['/api/analytics/*', '/api/auth/*', '/api/exif/*']
    }
  });
});

// Dashboard analytics endpoint
router.get('/dashboard', (req, res) => {
  res.json({
    today: {
      totalRequests: 1250,
      apiCalls: 980,
      imageProcessing: 450,
      uniqueUsers: 35
    },
    growth: {
      totalRequests: 15,
      apiCalls: 12,
      imageProcessing: 18,
      uniqueUsers: 8
    }
  });
});

// Event tracking endpoint
router.post('/events', (req, res) => {
  const { event, properties } = req.body;
  
  // In production, this would save to database
  console.log('Analytics event:', event, properties);
  
  res.json({
    success: true,
    message: 'Event tracked successfully'
  });
});

// Launch metrics endpoint (for Product Hunt)
router.get('/launch-metrics', (req, res) => {
  res.json({
    signups: {
      total: 1250,
      today: 45,
      source: {
        product_hunt: 380,
        direct: 420,
        social: 280,
        referral: 170
      }
    },
    conversions: {
      free_to_pro: 125,
      free_to_enterprise: 15,
      conversion_rate: 11.2
    },
    revenue: {
      mrr: 5970,
      arr: 71640,
      average_plan_value: 199
    }
  });
});

module.exports = router;
