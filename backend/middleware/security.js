const rateLimit = require('express-rate-limit');
const { logger } = require('../config/database');
const redisConfig = require('../config/redis');

/**
 * Input sanitization middleware
 */
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    logger.error('Input sanitization error:', error);
    next();
  }
};

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return sanitizeValue(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeValue(key);
    sanitized[sanitizedKey] = sanitizeObject(value);
  }

  return sanitized;
}

/**
 * Sanitize individual values
 */
function sanitizeValue(value) {
  if (typeof value !== 'string') {
    return value;
  }

  // Remove potentially dangerous characters and patterns
  return value
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/expression\s*\(/gi, '') // Remove CSS expressions
    .replace(/url\s*\(/gi, '') // Remove CSS url()
    .replace(/import\s+/gi, '') // Remove CSS @import
    .trim();
}

/**
 * Additional security headers middleware
 */
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Expect-CT header for certificate transparency
  res.setHeader('Expect-CT', 'max-age=86400, enforce');
  
  next();
};

/**
 * Suspicious activity detection middleware
 */
const detectSuspiciousActivity = async (req, res, next) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';
    const suspiciousPatterns = [
      /sqlmap/i,
      /nmap/i,
      /nikto/i,
      /burp/i,
      /acunetix/i,
      /nessus/i,
      /openvas/i,
      /w3af/i,
      /havij/i,
      /pangolin/i
    ];

    // Check for suspicious user agents
    const isSuspiciousUA = suspiciousPatterns.some(pattern => pattern.test(userAgent));
    
    // Check for suspicious request patterns
    const suspiciousURLPatterns = [
      /\.\.\//,  // Directory traversal
      /\/etc\/passwd/,  // System file access
      /\/proc\//,  // Process information
      /union.*select/i,  // SQL injection
      /<script/i,  // XSS attempts
      /javascript:/i,  // JavaScript injection
      /vbscript:/i,  // VBScript injection
      /eval\(/i,  // Code evaluation
      /base64_decode/i,  // Base64 decoding
      /system\(/i,  // System command execution
      /exec\(/i,  // Command execution
      /shell_exec/i,  // Shell execution
      /passthru/i,  // Command passthrough
      /file_get_contents/i,  // File reading
      /fopen/i,  // File opening
      /fwrite/i,  // File writing
      /include/i,  // File inclusion
      /require/i  // File requirement
    ];

    const isSuspiciousURL = suspiciousURLPatterns.some(pattern => 
      pattern.test(req.originalUrl) || pattern.test(req.body ? JSON.stringify(req.body) : '')
    );

    if (isSuspiciousUA || isSuspiciousURL) {
      logger.warn('Suspicious activity detected', {
        ip: clientIP,
        userAgent,
        url: req.originalUrl,
        method: req.method,
        suspiciousUA: isSuspiciousUA,
        suspiciousURL: isSuspiciousURL,
        timestamp: new Date().toISOString()
      });

      // Track suspicious activity in Redis
      if (redisConfig.isConnected()) {
        const key = `suspicious:${clientIP}`;
        await redisConfig.incr(key);
        await redisConfig.expire(key, 3600); // Expire after 1 hour
        
        const count = await redisConfig.get(key);
        if (parseInt(count) > 10) {
          logger.error('High suspicious activity from IP', {
            ip: clientIP,
            count: parseInt(count)
          });
          
          return res.status(429).json({
            success: false,
            message: 'Too many suspicious requests',
            code: 'SUSPICIOUS_ACTIVITY'
          });
        }
      }
    }

    next();
  } catch (error) {
    logger.error('Suspicious activity detection error:', error);
    next();
  }
};

/**
 * Progressive delay middleware for suspicious IPs
 */
const speedLimiter = async (req, res, next) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (redisConfig.isConnected()) {
      const suspiciousKey = `suspicious:${clientIP}`;
      const suspiciousCount = await redisConfig.get(suspiciousKey);
      
      if (suspiciousCount && parseInt(suspiciousCount) > 5) {
        // Progressive delay based on suspicious activity
        const delay = Math.min(parseInt(suspiciousCount) * 1000, 10000); // Max 10 seconds
        
        logger.info('Applying progressive delay', {
          ip: clientIP,
          delay,
          suspiciousCount: parseInt(suspiciousCount)
        });
        
        setTimeout(() => {
          next();
        }, delay);
        
        return;
      }
    }

    next();
  } catch (error) {
    logger.error('Speed limiter error:', error);
    next();
  }
};

/**
 * GDPR compliance middleware
 */
const gdprCompliance = (req, res, next) => {
  try {
    // Track data processing activities
    const processingActivity = {
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      endpoint: req.originalUrl,
      method: req.method,
      hasPersonalData: checkForPersonalData(req)
    };

    // Log GDPR-relevant activities
    if (processingActivity.hasPersonalData) {
      logger.info('Personal data processing detected', {
        endpoint: req.originalUrl,
        method: req.method,
        ip: processingActivity.ip,
        timestamp: processingActivity.timestamp
      });
    }

    // Add GDPR headers
    res.setHeader('X-Data-Processing', 'GDPR-Compliant');
    res.setHeader('X-Privacy-Policy', 'https://proofpix.com/privacy');
    
    next();
  } catch (error) {
    logger.error('GDPR compliance middleware error:', error);
    next();
  }
};

/**
 * Check if request contains personal data
 */
function checkForPersonalData(req) {
  const personalDataFields = [
    'email', 'firstName', 'lastName', 'name', 'phone', 'address',
    'ssn', 'passport', 'license', 'birthday', 'birthdate', 'dob'
  ];

  const checkObject = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    
    for (const key of Object.keys(obj)) {
      if (personalDataFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        return true;
      }
      
      if (typeof obj[key] === 'object' && checkObject(obj[key])) {
        return true;
      }
    }
    
    return false;
  };

  return checkObject(req.body) || checkObject(req.query) || checkObject(req.params);
}

/**
 * API rate limiting with Redis
 */
const createApiRateLimit = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl
      });
      
      res.status(429).json(options.message || defaultOptions.message);
    }
  };

  return rateLimit({ ...defaultOptions, ...options });
};

/**
 * File upload security middleware
 */
const fileUploadSecurity = (req, res, next) => {
  if (req.file || req.files) {
    const files = req.files || [req.file];
    
    for (const file of files) {
      if (!file) continue;
      
      // Check file size
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        return res.status(400).json({
          success: false,
          message: 'File size exceeds maximum limit',
          code: 'FILE_TOO_LARGE'
        });
      }
      
      // Check file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/json'
      ];
      
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'File type not allowed',
          code: 'INVALID_FILE_TYPE'
        });
      }
      
      // Check filename for suspicious patterns
      const suspiciousFilenames = [
        /\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i, /\.pif$/i,
        /\.com$/i, /\.vbs$/i, /\.js$/i, /\.jar$/i, /\.php$/i
      ];
      
      if (suspiciousFilenames.some(pattern => pattern.test(file.originalname))) {
        return res.status(400).json({
          success: false,
          message: 'Suspicious file detected',
          code: 'SUSPICIOUS_FILE'
        });
      }
    }
  }
  
  next();
};

module.exports = {
  sanitizeInput,
  securityHeaders,
  detectSuspiciousActivity,
  speedLimiter,
  gdprCompliance,
  createApiRateLimit,
  fileUploadSecurity
}; 