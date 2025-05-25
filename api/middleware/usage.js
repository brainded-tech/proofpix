// Middleware to validate API usage limits
const validateApiUsage = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please authenticate first'
      });
    }
    
    const usage = await req.getApiUsage();
    
    // Check if user has exceeded request limits
    if (usage.requests.remaining <= 0) {
      return res.status(429).json({
        error: 'Request limit exceeded',
        message: `You have exceeded your ${req.user.plan} plan limit of ${usage.requests.limit} requests per day`,
        data: {
          plan: req.user.plan,
          usage: usage.requests,
          resetDate: usage.resetDate,
          upgradeUrl: 'https://upload.proofpixapp.com/pricing'
        }
      });
    }
    
    // Check if user has exceeded file processing limits
    if (usage.files.remaining <= 0) {
      return res.status(429).json({
        error: 'File processing limit exceeded',
        message: `You have exceeded your ${req.user.plan} plan limit of ${usage.files.limit} files per day`,
        data: {
          plan: req.user.plan,
          usage: usage.files,
          resetDate: usage.resetDate,
          upgradeUrl: 'https://upload.proofpixapp.com/pricing'
        }
      });
    }
    
    // Add usage info to response headers
    res.set({
      'X-RateLimit-Limit-Requests': usage.requests.limit.toString(),
      'X-RateLimit-Remaining-Requests': usage.requests.remaining.toString(),
      'X-RateLimit-Limit-Files': usage.files.limit.toString(),
      'X-RateLimit-Remaining-Files': usage.files.remaining.toString(),
      'X-RateLimit-Reset': usage.resetDate
    });
    
    next();
    
  } catch (error) {
    console.error('Usage validation error:', error);
    res.status(500).json({
      error: 'Usage validation failed',
      message: 'Internal server error during usage validation'
    });
  }
};

// Middleware to reset daily usage (called by cron job)
const resetDailyUsage = async () => {
  try {
    const { users } = require('./auth');
    
    for (const [userId, user] of users) {
      user.usage.requests = 0;
      user.usage.files = 0;
      user.usage.lastReset = new Date().toISOString();
    }
    
    console.log('✅ Daily usage reset completed for all users');
    
  } catch (error) {
    console.error('❌ Daily usage reset failed:', error);
  }
};

// Helper function to get usage statistics
const getUsageStats = () => {
  const { users } = require('./auth');
  const stats = {
    totalUsers: users.size,
    planDistribution: {},
    totalRequests: 0,
    totalFiles: 0
  };
  
  for (const [userId, user] of users) {
    stats.planDistribution[user.plan] = (stats.planDistribution[user.plan] || 0) + 1;
    stats.totalRequests += user.usage.requests;
    stats.totalFiles += user.usage.files;
  }
  
  return stats;
};

module.exports = {
  validateApiUsage,
  resetDailyUsage,
  getUsageStats
}; 