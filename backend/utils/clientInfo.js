const UAParser = require('ua-parser-js');

/**
 * Extract client information from request for security logging
 * @param {Object} req - Express request object
 * @returns {Object} Client information
 */
const getClientInfo = (req) => {
  const userAgent = req.get('User-Agent') || '';
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Get IP address (handle proxy headers)
  const ipAddress = req.ip || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                   req.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
                   req.get('X-Real-IP') ||
                   req.get('X-Client-IP') ||
                   'unknown';

  return {
    ipAddress,
    userAgent,
    deviceType: result.device.type || 'desktop',
    browser: result.browser.name || 'unknown',
    browserVersion: result.browser.version || 'unknown',
    os: result.os.name || 'unknown',
    osVersion: result.os.version || 'unknown',
    cpu: result.cpu.architecture || 'unknown',
    acceptLanguage: req.get('Accept-Language') || '',
    referer: req.get('Referer') || '',
    origin: req.get('Origin') || '',
    timestamp: new Date().toISOString()
  };
};

/**
 * Get geolocation info from IP address (placeholder for future implementation)
 * @param {string} ipAddress - IP address
 * @returns {Object} Location information
 */
const getLocationInfo = async (ipAddress) => {
  // TODO: Implement IP geolocation service integration
  // For now, return placeholder data
  return {
    country: 'Unknown',
    region: 'Unknown',
    city: 'Unknown',
    timezone: 'Unknown',
    isp: 'Unknown'
  };
};

/**
 * Detect suspicious patterns in client info
 * @param {Object} clientInfo - Client information
 * @param {Object} previousInfo - Previous client information for comparison
 * @returns {Object} Suspicion analysis
 */
const detectSuspiciousActivity = (clientInfo, previousInfo = null) => {
  const suspiciousFlags = [];
  let riskLevel = 'low';

  // Check for missing or suspicious user agent
  if (!clientInfo.userAgent || clientInfo.userAgent.length < 10) {
    suspiciousFlags.push('missing_or_short_user_agent');
    riskLevel = 'medium';
  }

  // Check for common bot patterns
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i, /python/i
  ];
  
  if (botPatterns.some(pattern => pattern.test(clientInfo.userAgent))) {
    suspiciousFlags.push('bot_user_agent');
    riskLevel = 'medium';
  }

  // Check for IP address changes (if previous info available)
  if (previousInfo && previousInfo.ipAddress !== clientInfo.ipAddress) {
    suspiciousFlags.push('ip_address_change');
    if (riskLevel === 'low') riskLevel = 'medium';
  }

  // Check for device/browser changes
  if (previousInfo) {
    if (previousInfo.browser !== clientInfo.browser) {
      suspiciousFlags.push('browser_change');
    }
    if (previousInfo.os !== clientInfo.os) {
      suspiciousFlags.push('os_change');
    }
  }

  // Check for private/local IP addresses in production
  if (process.env.NODE_ENV === 'production') {
    const privateIPPatterns = [
      /^10\./, /^172\.(1[6-9]|2[0-9]|3[01])\./, /^192\.168\./,
      /^127\./, /^169\.254\./, /^::1$/, /^fc00:/, /^fe80:/
    ];
    
    if (privateIPPatterns.some(pattern => pattern.test(clientInfo.ipAddress))) {
      suspiciousFlags.push('private_ip_address');
    }
  }

  // Determine final risk level
  if (suspiciousFlags.length >= 3) {
    riskLevel = 'high';
  } else if (suspiciousFlags.length >= 2) {
    riskLevel = 'medium';
  }

  return {
    isSuspicious: suspiciousFlags.length > 0,
    riskLevel,
    flags: suspiciousFlags,
    score: suspiciousFlags.length
  };
};

/**
 * Generate device fingerprint for tracking
 * @param {Object} clientInfo - Client information
 * @returns {string} Device fingerprint hash
 */
const generateDeviceFingerprint = (clientInfo) => {
  const crypto = require('crypto');
  
  const fingerprintData = [
    clientInfo.browser,
    clientInfo.browserVersion,
    clientInfo.os,
    clientInfo.osVersion,
    clientInfo.cpu,
    clientInfo.acceptLanguage
  ].join('|');

  return crypto.createHash('sha256').update(fingerprintData).digest('hex').substring(0, 16);
};

module.exports = {
  getClientInfo,
  getLocationInfo,
  detectSuspiciousActivity,
  generateDeviceFingerprint
}; 