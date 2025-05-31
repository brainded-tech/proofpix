const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auditLog } = require('../services/auditService');
const { getClientInfo } = require('../utils/clientInfo');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(401).json({
        success: false,
        message: 'Email verification required'
      });
    }

    // Attach user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      subscriptionTier: user.subscription_tier,
      emailVerified: user.email_verified
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Middleware that requires authentication
 */
const requireAuth = async (req, res, next) => {
  await authenticateToken(req, res, next);
};

/**
 * Middleware to check subscription tier access
 */
const requireSubscription = (requiredTier) => {
  const tierLevels = {
    'free': 0,
    'professional': 1,
    'enterprise': 2
  };

  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userTierLevel = tierLevels[req.user.subscriptionTier] || 0;
    const requiredTierLevel = tierLevels[requiredTier] || 0;

    if (userTierLevel < requiredTierLevel) {
      const clientInfo = getClientInfo(req);
      
      await auditLog({
        userId: req.user.userId,
        eventType: 'access_denied',
        eventCategory: 'security',
        eventDescription: `Access denied - insufficient subscription tier`,
        resourceType: 'feature',
        resourceId: requiredTier,
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        riskLevel: 'low',
        metadata: {
          userTier: req.user.subscriptionTier,
          requiredTier,
          endpoint: req.path
        }
      });

      return res.status(403).json({
        success: false,
        message: `This feature requires ${requiredTier} subscription`,
        data: {
          currentTier: req.user.subscriptionTier,
          requiredTier,
          upgradeUrl: `${process.env.FRONTEND_URL}/pricing`
        }
      });
    }

    next();
  };
};

/**
 * Middleware to check subscription tier access (array version)
 */
const requireSubscriptionTier = (allowedTiers) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userTier = req.user.subscriptionTier || 'free';
    
    if (!allowedTiers.includes(userTier)) {
      const clientInfo = getClientInfo(req);
      
      await auditLog({
        userId: req.user.userId,
        eventType: 'access_denied',
        eventCategory: 'security',
        eventDescription: `Access denied - insufficient subscription tier`,
        resourceType: 'feature',
        resourceId: allowedTiers.join(','),
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        riskLevel: 'low',
        metadata: {
          userTier,
          allowedTiers,
          endpoint: req.path
        }
      });

      return res.status(403).json({
        success: false,
        message: `This feature requires one of the following subscription tiers: ${allowedTiers.join(', ')}`,
        data: {
          currentTier: userTier,
          allowedTiers,
          upgradeUrl: `${process.env.FRONTEND_URL}/pricing`
        }
      });
    }

    next();
  };
};

/**
 * Middleware for optional authentication (doesn't fail if no token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user && user.status === 'active' && user.email_verified) {
        req.user = {
          userId: user.id,
          email: user.email,
          subscriptionTier: user.subscription_tier,
          emailVerified: user.email_verified
        };
      }
    }
  } catch (error) {
    // Ignore authentication errors for optional auth
  }

  next();
};

/**
 * Middleware to verify refresh tokens
 */
const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      subscriptionTier: user.subscription_tier,
      emailVerified: user.email_verified
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has expired',
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Token verification error'
    });
  }
};

module.exports = {
  authenticateToken,
  requireAuth,
  requireSubscription,
  requireSubscriptionTier,
  optionalAuth,
  verifyRefreshToken
}; 