const crypto = require('crypto');

// In-memory storage for demo (replace with database in production)
const apiKeys = new Map();
const users = new Map();

// Initialize some demo API keys for testing
function initializeDemoData() {
  // Enterprise user
  const enterpriseKey = 'pk_live_enterprise_' + crypto.randomBytes(16).toString('hex');
  const enterpriseUser = {
    id: 'user_enterprise_1',
    email: 'enterprise@example.com',
    plan: 'enterprise',
    apiKey: enterpriseKey,
    customFields: [
      {
        name: 'Project Code',
        exifKey: 'UserComment',
        type: 'string',
        description: 'Internal project identifier'
      },
      {
        name: 'Photographer ID',
        exifKey: 'Artist',
        type: 'string',
        description: 'Photographer identification'
      }
    ],
    teamId: 'team_enterprise_1',
    permissions: ['api_access', 'custom_fields', 'team_management', 'white_label'],
    usage: {
      requests: 0,
      files: 0,
      lastReset: new Date().toISOString()
    }
  };
  
  apiKeys.set(enterpriseKey, enterpriseUser);
  users.set(enterpriseUser.id, enterpriseUser);
  
  // Pro user
  const proKey = 'pk_live_pro_' + crypto.randomBytes(16).toString('hex');
  const proUser = {
    id: 'user_pro_1',
    email: 'pro@example.com',
    plan: 'pro',
    apiKey: proKey,
    customFields: [],
    permissions: ['api_access'],
    usage: {
      requests: 0,
      files: 0,
      lastReset: new Date().toISOString()
    }
  };
  
  apiKeys.set(proKey, proUser);
  users.set(proUser.id, proUser);
  
  console.log('🔑 Demo API Keys Generated:');
  console.log(`Enterprise: ${enterpriseKey}`);
  console.log(`Pro: ${proKey}`);
}

// Initialize demo data
initializeDemoData();

// Middleware to authenticate API key
const authenticateApiKey = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Missing authorization header',
        message: 'Please provide an API key in the Authorization header'
      });
    }
    
    // Extract API key from "Bearer <key>" format
    const apiKey = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'Invalid authorization format',
        message: 'Use format: Authorization: Bearer <your-api-key>'
      });
    }
    
    // Look up user by API key
    const user = apiKeys.get(apiKey);
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided API key is not valid'
      });
    }
    
    // Check if user has API access permission
    if (!user.permissions.includes('api_access')) {
      return res.status(403).json({
        error: 'API access denied',
        message: 'Your plan does not include API access. Please upgrade to Pro or Enterprise.'
      });
    }
    
    // Attach user to request
    req.user = user;
    req.startTime = Date.now();
    
    // Add helper methods to request
    req.trackApiUsage = async (operation, count = 1) => {
      user.usage.requests += count;
      if (operation === 'extract' || operation === 'batch_extract') {
        user.usage.files += count;
      }
      // In production, save to database here
    };
    
    req.getApiUsage = async () => {
      return {
        requests: {
          used: user.usage.requests,
          limit: getApiLimits(user.plan).requests,
          remaining: Math.max(0, getApiLimits(user.plan).requests - user.usage.requests)
        },
        files: {
          used: user.usage.files,
          limit: getApiLimits(user.plan).files,
          remaining: Math.max(0, getApiLimits(user.plan).files - user.usage.files)
        },
        resetDate: getNextResetDate()
      };
    };
    
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during authentication'
    });
  }
};

// Middleware to check if user has specific permission
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please authenticate first'
      });
    }
    
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        error: 'Permission denied',
        message: `This operation requires the '${permission}' permission`
      });
    }
    
    next();
  };
};

// Helper functions
function getApiLimits(plan) {
  const limits = {
    free: { requests: 50, files: 100 },
    starter: { requests: 100, files: 500 },
    pro: { requests: 500, files: 2500 },
    enterprise: { requests: 1000, files: 10000 }
  };
  
  return limits[plan] || limits.free;
}

function getNextResetDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

// API key management functions
const generateApiKey = (plan = 'pro') => {
  const prefix = plan === 'enterprise' ? 'pk_live_enterprise_' : 'pk_live_pro_';
  return prefix + crypto.randomBytes(16).toString('hex');
};

const createUser = (userData) => {
  const apiKey = generateApiKey(userData.plan);
  const user = {
    id: 'user_' + crypto.randomBytes(8).toString('hex'),
    apiKey,
    usage: {
      requests: 0,
      files: 0,
      lastReset: new Date().toISOString()
    },
    ...userData
  };
  
  apiKeys.set(apiKey, user);
  users.set(user.id, user);
  
  return user;
};

const revokeApiKey = (apiKey) => {
  const user = apiKeys.get(apiKey);
  if (user) {
    apiKeys.delete(apiKey);
    return true;
  }
  return false;
};

module.exports = {
  authenticateApiKey,
  requirePermission,
  generateApiKey,
  createUser,
  revokeApiKey,
  // Export for testing/demo purposes
  apiKeys,
  users
}; 