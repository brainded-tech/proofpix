// 🔒 SERVER-SIDE PLAN USAGE VALIDATION - Enterprise Security
// Prevents payment bypass and plan limit circumvention

const crypto = require('crypto');

// Plan definitions (should match client-side PRICING_PLANS)
const PRICING_PLANS = {
  free: {
    id: 'free',
    price: 0,
    limits: {
      imagesPerSession: 5,
      pdfExports: 2,
      dataExports: 1,
      comparisons: 3,
      batchProcessing: false,
      batchSize: 1
    }
  },
  daypass: {
    id: 'daypass',
    price: 2.99,
    sessionBased: true,
    limits: {
      dailyPhotos: Infinity,
      batchSize: 10,
      priority: false,
      duration: '24h'
    }
  },
  weekpass: {
    id: 'weekpass',
    price: 9.99,
    sessionBased: true,
    limits: {
      dailyPhotos: Infinity,
      batchSize: 25,
      priority: true,
      duration: '7d'
    }
  },
  starter: {
    id: 'starter',
    price: 4.99,
    limits: {
      imagesPerSession: 25,
      pdfExports: 5,
      dataExports: 3,
      comparisons: 10,
      batchProcessing: true,
      batchSize: 25
    }
  },
  pro: {
    id: 'pro',
    price: 9.99,
    limits: {
      imagesPerSession: 50,
      pdfExports: Infinity,
      dataExports: Infinity,
      comparisons: Infinity,
      batchProcessing: true,
      batchSize: 100
    }
  },
  teams: {
    id: 'teams',
    price: 49,
    limits: {
      imagesPerSession: -1, // Unlimited
      batchProcessing: true,
      batchSize: -1, // Unlimited
      apiAccess: true
    }
  },
  enterprise: {
    id: 'enterprise',
    price: 'Custom',
    limits: {
      imagesPerSession: Infinity,
      batchProcessing: true,
      batchSize: Infinity,
      apiAccess: true,
      priority: true
    }
  }
};

exports.handler = async (event, context) => {
  // Security headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://proofpixapp.com',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID, X-Timestamp',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse and validate request
    const { planType, usage, clientChecksum } = JSON.parse(event.body || '{}');
    const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    const requestId = event.headers['x-request-id'] || 'unknown';
    const timestamp = event.headers['x-timestamp'];

    // Basic validation
    if (!planType || !usage) {
      logSecurityEvent('Plan validation failed - missing data', {
        hasPlanType: !!planType,
        hasUsage: !!usage,
        ip: clientIP,
        requestId
      });

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          valid: false, 
          error: 'Missing required fields',
          details: 'planType and usage are required'
        })
      };
    }

    // Rate limiting
    if (await isRateLimited(clientIP)) {
      logSecurityEvent('Plan validation rate limited', { ip: clientIP, requestId });
      
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          valid: false, 
          error: 'Rate limit exceeded' 
        })
      };
    }

    // Timestamp validation (prevent replay attacks)
    if (timestamp && isTimestampStale(timestamp)) {
      logSecurityEvent('Stale timestamp detected', { 
        timestamp, 
        ip: clientIP, 
        requestId 
      });

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          valid: false, 
          error: 'Request timestamp too old' 
        })
      };
    }

    // Validate checksum (prevent tampering)
    if (clientChecksum && !validateChecksum(planType, usage, clientChecksum)) {
      logSecurityEvent('Invalid checksum detected', { 
        planType, 
        usage: usage.actionType,
        ip: clientIP, 
        requestId 
      });

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          valid: false, 
          error: 'Request integrity check failed' 
        })
      };
    }

    // Fraud detection
    if (await detectFraudulentActivity(planType, usage, clientIP)) {
      logSecurityEvent('Fraudulent activity detected', { 
        planType, 
        usage: usage.actionType,
        ip: clientIP, 
        requestId 
      });

      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ 
          valid: false, 
          error: 'Suspicious activity detected' 
        })
      };
    }

    // Validate plan usage
    const validationResult = validatePlanUsage(planType, usage);
    
    // Log the validation result
    if (validationResult.valid) {
      logSecurityEvent('Plan validation successful', {
        planType,
        actionType: usage.actionType,
        ip: clientIP,
        requestId
      });
    } else {
      logSecurityEvent('Plan validation failed', {
        planType,
        actionType: usage.actionType,
        reason: validationResult.details,
        ip: clientIP,
        requestId
      });
    }

    // Add server signature to response
    const responseSignature = generateResponseSignature(validationResult);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...validationResult,
        serverSignature: responseSignature,
        validatedAt: new Date().toISOString(),
        requestId
      })
    };

  } catch (error) {
    logSecurityEvent('Plan validation error', {
      error: error.message,
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
      requestId: event.headers['x-request-id']
    });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        valid: false, 
        error: 'Internal server error' 
      })
    };
  }
};

function validatePlanUsage(planType, usage) {
  try {
    // Get plan configuration
    const plan = PRICING_PLANS[planType];
    if (!plan) {
      return { 
        valid: false, 
        details: 'Invalid plan type',
        remainingUsage: null 
      };
    }

    const { actionType, imageCount, batchSize } = usage;

    // Validate based on action type
    switch (actionType) {
      case 'upload':
        return validateUploadAction(plan, imageCount);
      
      case 'batch':
        return validateBatchAction(plan, batchSize);
      
      case 'priority':
        return validatePriorityAction(plan);
      
      case 'advanced_export':
        return validateAdvancedExportAction(plan);
      
      case 'unlimited_pdf':
        return validateUnlimitedPdfAction(plan);
      
      case 'api_access':
        return validateApiAccessAction(plan);
      
      case 'white_label':
        return validateWhiteLabelAction(plan);
      
      default:
        return { 
          valid: false, 
          details: `Unknown action type: ${actionType}`,
          remainingUsage: null 
        };
    }

  } catch (error) {
    return { 
      valid: false, 
      details: 'Validation error',
      remainingUsage: null 
    };
  }
}

function validateUploadAction(plan, imageCount = 1) {
  const limits = plan.limits;
  
  // Free plan has session limits
  if (plan.id === 'free') {
    const remaining = Math.max(0, limits.imagesPerSession - (imageCount || 0));
    return {
      valid: remaining > 0,
      details: remaining > 0 ? 'Upload allowed' : 'Session limit exceeded',
      remainingUsage: { uploads: remaining }
    };
  }
  
  // Paid plans - check if unlimited or within limits
  if (limits.dailyPhotos === Infinity || limits.imagesPerSession === -1) {
    return {
      valid: true,
      details: 'Unlimited uploads',
      remainingUsage: { uploads: -1 } // Unlimited
    };
  }
  
  const sessionLimit = limits.imagesPerSession || 50;
  const remaining = Math.max(0, sessionLimit - (imageCount || 0));
  
  return {
    valid: remaining > 0,
    details: remaining > 0 ? 'Upload allowed' : 'Session limit exceeded',
    remainingUsage: { uploads: remaining }
  };
}

function validateBatchAction(plan, batchSize = 1) {
  const limits = plan.limits;
  
  // Check if batch processing is allowed
  if (!limits.batchProcessing) {
    return {
      valid: false,
      details: 'Batch processing not available on this plan',
      remainingUsage: null
    };
  }
  
  // Check batch size limits
  const maxBatchSize = limits.batchSize;
  if (maxBatchSize !== -1 && maxBatchSize !== Infinity && batchSize > maxBatchSize) {
    return {
      valid: false,
      details: `Batch size ${batchSize} exceeds limit of ${maxBatchSize}`,
      remainingUsage: { maxBatchSize }
    };
  }
  
  return {
    valid: true,
    details: 'Batch processing allowed',
    remainingUsage: { maxBatchSize }
  };
}

function validatePriorityAction(plan) {
  const hasPriority = plan.limits.priority === true;
  
  return {
    valid: hasPriority,
    details: hasPriority ? 'Priority processing available' : 'Priority processing not available on this plan',
    remainingUsage: null
  };
}

function validateAdvancedExportAction(plan) {
  // Advanced exports typically require paid plans
  const isAllowed = plan.price > 0 || plan.limits.batchProcessing;
  
  return {
    valid: isAllowed,
    details: isAllowed ? 'Advanced exports available' : 'Advanced exports require paid plan',
    remainingUsage: null
  };
}

function validateUnlimitedPdfAction(plan) {
  const hasUnlimitedPdf = plan.limits.pdfExports === Infinity || plan.limits.pdfExports === -1;
  
  return {
    valid: hasUnlimitedPdf,
    details: hasUnlimitedPdf ? 'Unlimited PDF generation available' : 'Unlimited PDF requires higher plan',
    remainingUsage: null
  };
}

function validateApiAccessAction(plan) {
  const hasApiAccess = plan.limits.apiAccess === true;
  
  return {
    valid: hasApiAccess,
    details: hasApiAccess ? 'API access available' : 'API access requires Teams or Enterprise plan',
    remainingUsage: null
  };
}

function validateWhiteLabelAction(plan) {
  const hasWhiteLabel = plan.id === 'enterprise' || plan.limits.apiAccess === true;
  
  return {
    valid: hasWhiteLabel,
    details: hasWhiteLabel ? 'White label available' : 'White label requires Enterprise plan',
    remainingUsage: null
  };
}

// Security utility functions
function validateChecksum(planType, usage, clientChecksum) {
  try {
    const data = JSON.stringify({ planType, usage }, Object.keys({ planType, usage }).sort());
    const expectedChecksum = simpleHash(data);
    return expectedChecksum === clientChecksum;
  } catch (error) {
    return false;
  }
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

function generateResponseSignature(validationResult) {
  const data = JSON.stringify(validationResult, Object.keys(validationResult).sort());
  return crypto.createHash('sha256').update(data + process.env.RESPONSE_SIGNING_KEY || 'default_key').digest('hex').substring(0, 16);
}

function isTimestampStale(timestamp) {
  const now = Date.now();
  const requestTime = parseInt(timestamp);
  const maxAge = 5 * 60 * 1000; // 5 minutes
  
  return (now - requestTime) > maxAge;
}

// Rate limiting (simple in-memory implementation)
const rateLimitStore = new Map();

async function isRateLimited(clientIP) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 60; // Max 60 requests per minute per IP

  const key = `plan_validation_${clientIP}`;
  const requests = rateLimitStore.get(key) || [];
  
  // Remove old requests
  const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return true;
  }

  validRequests.push(now);
  rateLimitStore.set(key, validRequests);

  return false;
}

// Fraud detection
const fraudDetectionStore = new Map();

async function detectFraudulentActivity(planType, usage, clientIP) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minute window
  
  const key = `fraud_${clientIP}`;
  const activities = fraudDetectionStore.get(key) || [];
  
  // Remove old activities
  const recentActivities = activities.filter(activity => now - activity.timestamp < windowMs);
  
  // Add current activity
  recentActivities.push({
    timestamp: now,
    planType,
    actionType: usage.actionType
  });
  
  fraudDetectionStore.set(key, recentActivities);
  
  // Detect suspicious patterns
  
  // 1. Too many different plan types in short time
  const uniquePlans = new Set(recentActivities.map(a => a.planType));
  if (uniquePlans.size > 3) {
    return true;
  }
  
  // 2. Too many batch requests from free plan
  if (planType === 'free') {
    const batchRequests = recentActivities.filter(a => a.actionType === 'batch');
    if (batchRequests.length > 5) {
      return true;
    }
  }
  
  // 3. Rapid-fire requests (more than 30 in 1 minute)
  const oneMinuteAgo = now - 60 * 1000;
  const rapidRequests = recentActivities.filter(a => a.timestamp > oneMinuteAgo);
  if (rapidRequests.length > 30) {
    return true;
  }
  
  return false;
}

function logSecurityEvent(event, details) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    function: 'validate-plan-usage'
  };
  
  console.log('🔒 Security Event:', JSON.stringify(logEntry));
  
  // In production, send to security monitoring service
  // await sendToSecurityMonitoring(logEntry);
} 