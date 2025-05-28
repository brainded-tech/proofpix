const express = require('express');
const router = express.Router();

// Validate session endpoint
router.post('/validate-session', (req, res) => {
  res.json({
    valid: true,
    user: {
      id: 'demo',
      email: 'demo@proofpixapp.com',
      plan: 'professional'
    }
  });
});

// Login endpoint
router.post('/login', (req, res) => {
  res.json({
    success: true,
    sessionToken: 'demo_token',
    user: {
      id: 'demo',
      email: 'demo@proofpixapp.com',
      plan: 'professional'
    }
  });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get current user endpoint
router.get('/me', (req, res) => {
  res.json({
    user: {
      id: 'demo',
      email: 'demo@proofpixapp.com',
      plan: 'professional',
      permissions: ['api_access', 'custom_fields', 'team_management']
    }
  });
});

module.exports = router;
