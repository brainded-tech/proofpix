const billingService = require('../services/billingService');
const { auditLog } = require('../services/auditService');

// Middleware to check quota before operations
const checkQuota = (usageType, quantity = 1) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const quota = await billingService.checkQuota(req.user.id, usageType, quantity);

      if (!quota.allowed) {
        await auditLog(req.user.id, 'quota_exceeded', {
          usageType,
          quantity,
          currentUsage: quota.currentUsage,
          limit: quota.limit
        });

        return res.status(429).json({
          success: false,
          error: `Usage limit exceeded for ${usageType}`,
          quota: {
            current: quota.currentUsage,
            limit: quota.limit,
            remaining: quota.remaining
          },
          upgradeRequired: true
        });
      }

      // Add quota info to request for use in route handlers
      req.quota = quota;
      next();
    } catch (error) {
      console.error('Quota check error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check usage quota'
      });
    }
  };
};

// Middleware to track usage after successful operation
const trackUsage = (usageType, getQuantity = () => 1, getMetadata = () => ({})) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json;

    // Override json method to track usage on successful responses
    res.json = function(data) {
      // Only track usage for successful responses (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Track usage asynchronously to not delay response
        setImmediate(async () => {
          try {
            const quantity = typeof getQuantity === 'function' ? getQuantity(req, res, data) : getQuantity;
            const metadata = typeof getMetadata === 'function' ? getMetadata(req, res, data) : getMetadata;

            await billingService.trackUsage(req.user.id, usageType, quantity, metadata);
          } catch (error) {
            console.error('Usage tracking error:', error);
            await auditLog(req.user.id, 'usage_tracking_error', {
              error: error.message,
              usageType,
              endpoint: req.originalUrl
            });
          }
        });
      }

      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
};

// Middleware to check feature access
const requireFeature = (feature) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const hasAccess = await billingService.checkFeatureAccess(req.user.id, feature);

      if (!hasAccess) {
        await auditLog(req.user.id, 'feature_access_denied', {
          feature,
          endpoint: req.originalUrl
        });

        return res.status(403).json({
          success: false,
          error: `Feature '${feature}' not available in your current plan`,
          feature,
          upgradeRequired: true
        });
      }

      next();
    } catch (error) {
      console.error('Feature access check error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check feature access'
      });
    }
  };
};

// Combined middleware for quota check and usage tracking
const quotaAndTrack = (usageType, quantity = 1, metadata = {}) => {
  return [
    checkQuota(usageType, quantity),
    trackUsage(usageType, quantity, metadata)
  ];
};

// Middleware to get user plan info
const addPlanInfo = async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      req.userPlan = await billingService.getUserPlan(req.user.id);
      req.userSubscription = await billingService.getUserSubscription(req.user.id);
    }
    next();
  } catch (error) {
    console.error('Plan info error:', error);
    // Don't fail the request, just continue without plan info
    next();
  }
};

// Middleware to check if user has active subscription
const requireActiveSubscription = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const subscription = await billingService.getUserSubscription(req.user.id);

    if (!subscription || subscription.status !== 'active') {
      await auditLog(req.user.id, 'inactive_subscription_access_attempt', {
        endpoint: req.originalUrl,
        subscriptionStatus: subscription?.status || 'none'
      });

      return res.status(402).json({
        success: false,
        error: 'Active subscription required',
        subscriptionRequired: true
      });
    }

    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check subscription status'
    });
  }
};

// Middleware for premium features (paid plans only)
const requirePremium = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const plan = await billingService.getUserPlan(req.user.id);

    if (plan.name === 'Free') {
      await auditLog(req.user.id, 'premium_feature_access_denied', {
        endpoint: req.originalUrl,
        currentPlan: plan.name
      });

      return res.status(402).json({
        success: false,
        error: 'Premium subscription required',
        currentPlan: plan.name,
        upgradeRequired: true
      });
    }

    next();
  } catch (error) {
    console.error('Premium check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check premium access'
    });
  }
};

module.exports = {
  checkQuota,
  trackUsage,
  requireFeature,
  quotaAndTrack,
  addPlanInfo,
  requireActiveSubscription,
  requirePremium
}; 