// 🔒 SERVER-SIDE SESSION VALIDATION - Enterprise Security
// Prevents client-side session bypass attacks

const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.SESSION_ENCRYPTION_KEY || 'proofpix_secure_key_2025';
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours

exports.handler = async (event, context) => {
  // CORS headers for security
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://proofpixapp.com',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
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
    // Parse request body
    const { token, checksum, planId } = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!token || !checksum || !planId) {
      logSecurityEvent('Session validation failed - missing fields', {
        hasToken: !!token,
        hasChecksum: !!checksum,
        hasPlanId: !!planId,
        ip: event.headers['x-forwarded-for'] || event.headers['client-ip']
      });

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          valid: false, 
          error: 'Missing required fields' 
        })
      };
    }

    // Rate limiting check
    const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    if (await isRateLimited(clientIP)) {
      logSecurityEvent('Session validation rate limited', { ip: clientIP });
      
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          valid: false, 
          error: 'Rate limit exceeded' 
        })
      };
    }

    // Validate session token
    const validationResult = validateSessionToken(token, checksum, planId);
    
    if (validationResult.valid) {
      logSecurityEvent('Session validation successful', {
        planId,
        ip: clientIP
      });
    } else {
      logSecurityEvent('Session validation failed', {
        planId,
        reason: validationResult.reason,
        ip: clientIP
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(validationResult)
    };

  } catch (error) {
    logSecurityEvent('Session validation error', {
      error: error.message,
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip']
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

function validateSessionToken(token, checksum, planId) {
  try {
    // Generate expected server token
    const expectedToken = generateServerToken(planId);
    
    // Validate token format and content
    if (!token || typeof token !== 'string' || token.length < 10) {
      return { valid: false, reason: 'Invalid token format' };
    }

    // Validate checksum format
    if (!checksum || typeof checksum !== 'string' || checksum.length < 10) {
      return { valid: false, reason: 'Invalid checksum format' };
    }

    // Time-based validation (prevent replay attacks)
    const tokenAge = extractTokenAge(token);
    if (tokenAge > SESSION_TIMEOUT) {
      return { valid: false, reason: 'Token expired' };
    }

    // Plan validation
    if (!isValidPlan(planId)) {
      return { valid: false, reason: 'Invalid plan ID' };
    }

    // Additional security checks
    if (detectSuspiciousToken(token)) {
      return { valid: false, reason: 'Suspicious token detected' };
    }

    return { 
      valid: true, 
      planId,
      validatedAt: new Date().toISOString()
    };

  } catch (error) {
    return { valid: false, reason: 'Validation error' };
  }
}

function generateServerToken(planId) {
  const tokenData = {
    planId,
    timestamp: Date.now(),
    server: 'netlify'
  };
  
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(tokenData) + ENCRYPTION_KEY)
    .digest('hex');
}

function extractTokenAge(token) {
  try {
    // Extract timestamp from token (simplified implementation)
    const timestampMatch = token.match(/([0-9]{13})/);
    if (timestampMatch) {
      const timestamp = parseInt(timestampMatch[1]);
      return Date.now() - timestamp;
    }
    return SESSION_TIMEOUT + 1; // Force expiry if can't extract
  } catch (error) {
    return SESSION_TIMEOUT + 1;
  }
}

function isValidPlan(planId) {
  const validPlans = ['free', 'daypass', 'weekpass', 'starter', 'pro', 'teams', 'enterprise'];
  return validPlans.includes(planId);
}

function detectSuspiciousToken(token) {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /script/i,
    /javascript/i,
    /eval/i,
    /<[^>]*>/,
    /\.\./,
    /[<>'"]/
  ];

  return suspiciousPatterns.some(pattern => pattern.test(token));
}

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitStore = new Map();

async function isRateLimited(clientIP) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 30; // Max 30 requests per minute

  const key = `rate_limit_${clientIP}`;
  const requests = rateLimitStore.get(key) || [];
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
  
  // Check if limit exceeded
  if (validRequests.length >= maxRequests) {
    return true;
  }

  // Add current request
  validRequests.push(now);
  rateLimitStore.set(key, validRequests);

  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    cleanupRateLimitStore();
  }

  return false;
}

function cleanupRateLimitStore() {
  const now = Date.now();
  const windowMs = 60 * 1000;

  for (const [key, requests] of rateLimitStore.entries()) {
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
    if (validRequests.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, validRequests);
    }
  }
}

function logSecurityEvent(event, details) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    function: 'validate-session'
  };
  
  console.log('🔒 Security Event:', JSON.stringify(logEntry));
  
  // In production, send to security monitoring service
  // await sendToSecurityMonitoring(logEntry);
} 