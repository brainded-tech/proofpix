const securityService = require('../services/securityService');
const { logger } = require('../config/database');

// Security monitoring middleware
const securityMonitoring = async (req, res, next) => {
  try {
    // Skip security monitoring for certain endpoints
    const skipPaths = [
      '/health',
      '/api/auth/login', // Already has its own security
      '/api/payments/webhook' // Stripe webhooks need special handling
    ];

    if (skipPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Check if IP is blocked
    const isBlocked = await securityService.isIPBlocked(req.ip);
    if (isBlocked) {
      logger.warn('Blocked IP attempted access', {
        ip: req.ip,
        url: req.originalUrl,
        userAgent: req.get('User-Agent')
      });

      return res.status(403).json({
        success: false,
        error: 'Access denied',
        code: 'IP_BLOCKED'
      });
    }

    // Detect threats (but don't block the request)
    // Threats are handled automatically by the security service
    setImmediate(async () => {
      try {
        await securityService.detectThreats(req);
      } catch (error) {
        logger.error('Threat detection error:', error);
      }
    });

    next();
  } catch (error) {
    logger.error('Security monitoring middleware error:', error);
    // Don't block the request on security middleware errors
    next();
  }
};

// IP blocking middleware (for critical endpoints)
const blockMaliciousIPs = async (req, res, next) => {
  try {
    const isBlocked = await securityService.isIPBlocked(req.ip);
    if (isBlocked) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        code: 'IP_BLOCKED'
      });
    }
    next();
  } catch (error) {
    logger.error('IP blocking middleware error:', error);
    next();
  }
};

module.exports = {
  securityMonitoring,
  blockMaliciousIPs
}; 