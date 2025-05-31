const express = require('express');
const router = express.Router();
const { authenticateToken, requireAuth } = require('../middleware/auth');
const stripeService = require('../services/stripeService');
const billingService = require('../services/billingService');
const { auditLog } = require('../services/auditService');
const rateLimit = require('express-rate-limit');

// Rate limiting for payment endpoints
const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many payment requests, please try again later' }
});

const webhookRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Allow more webhook requests
  message: { error: 'Webhook rate limit exceeded' }
});

// Subscription Management Routes

// Get available plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await billingService.getAllPlans();
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's current subscription
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const subscription = await billingService.getUserSubscription(req.user.id);
    const plan = await billingService.getUserPlan(req.user.id);
    
    res.json({
      success: true,
      subscription,
      plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create subscription
router.post('/subscription', authenticateToken, requireAuth, paymentRateLimit, async (req, res) => {
  try {
    const { planName, paymentMethodId } = req.body;

    if (!planName) {
      return res.status(400).json({
        success: false,
        error: 'Plan name is required'
      });
    }

    const result = await billingService.createSubscription(
      req.user.id,
      planName,
      paymentMethodId
    );

    await auditLog(req.user.id, 'subscription_created_api', {
      planName,
      hasPaymentMethod: !!paymentMethodId
    });

    res.json(result);
  } catch (error) {
    await auditLog(req.user.id, 'subscription_creation_failed_api', {
      error: error.message
    });
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Cancel subscription
router.delete('/subscription', authenticateToken, paymentRateLimit, async (req, res) => {
  try {
    const { reason } = req.body;

    const result = await billingService.cancelSubscription(req.user.id, reason);

    await auditLog(req.user.id, 'subscription_canceled_api', { reason });

    res.json(result);
  } catch (error) {
    await auditLog(req.user.id, 'subscription_cancellation_failed_api', {
      error: error.message
    });
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Upgrade/downgrade subscription
router.put('/subscription', authenticateToken, paymentRateLimit, async (req, res) => {
  try {
    const { planName } = req.body;

    if (!planName) {
      return res.status(400).json({
        success: false,
        error: 'Plan name is required'
      });
    }

    const result = await billingService.upgradeSubscription(req.user.id, planName);

    await auditLog(req.user.id, 'subscription_upgraded_api', { planName });

    res.json(result);
  } catch (error) {
    await auditLog(req.user.id, 'subscription_upgrade_failed_api', {
      error: error.message,
      planName: req.body.planName
    });
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Usage Tracking Routes

// Get current usage
router.get('/usage', authenticateToken, async (req, res) => {
  try {
    const { type, period } = req.query;
    
    if (type) {
      const usage = await billingService.getCurrentUsage(req.user.id, type, period);
      const quota = await billingService.checkQuota(req.user.id, type);
      
      res.json({
        success: true,
        usage,
        quota
      });
    } else {
      // Get all usage types
      const usageTypes = ['apiCalls', 'fileUploads', 'storageGB'];
      const usage = {};
      
      for (const usageType of usageTypes) {
        usage[usageType] = {
          current: await billingService.getCurrentUsage(req.user.id, usageType, period),
          quota: await billingService.checkQuota(req.user.id, usageType)
        };
      }
      
      res.json({
        success: true,
        usage
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Track usage (internal API)
router.post('/usage', authenticateToken, async (req, res) => {
  try {
    const { type, quantity = 1, metadata = {} } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Usage type is required'
      });
    }

    const result = await billingService.trackUsage(req.user.id, type, quantity, metadata);

    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get usage analytics
router.get('/usage/analytics', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const analytics = await billingService.getUsageAnalytics(
      req.user.id,
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check quota before operation
router.post('/usage/check', authenticateToken, async (req, res) => {
  try {
    const { type, quantity = 1 } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Usage type is required'
      });
    }

    const quota = await billingService.checkQuota(req.user.id, type, quantity);

    res.json({
      success: true,
      quota
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Payment Methods Routes

// Get payment methods
router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    const user = await billingService.getUserById(req.user.id);
    
    if (!user.stripe_customer_id) {
      return res.json({
        success: true,
        paymentMethods: []
      });
    }

    const paymentMethods = await stripeService.getPaymentMethods(user.stripe_customer_id);

    res.json({
      success: true,
      paymentMethods: paymentMethods.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Attach payment method
router.post('/payment-methods', authenticateToken, paymentRateLimit, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        error: 'Payment method ID is required'
      });
    }

    const user = await billingService.getUserById(req.user.id);
    
    if (!user.stripe_customer_id) {
      // Create Stripe customer if doesn't exist
      const customer = await stripeService.createCustomer(user);
      await billingService.updateUserStripeCustomerId(req.user.id, customer.id);
      user.stripe_customer_id = customer.id;
    }

    await stripeService.attachPaymentMethod(paymentMethodId, user.stripe_customer_id);

    await auditLog(req.user.id, 'payment_method_attached_api', {
      paymentMethodId
    });

    res.json({
      success: true,
      message: 'Payment method attached successfully'
    });
  } catch (error) {
    await auditLog(req.user.id, 'payment_method_attach_failed_api', {
      error: error.message
    });
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Set default payment method
router.put('/payment-methods/:paymentMethodId/default', authenticateToken, paymentRateLimit, async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const user = await billingService.getUserById(req.user.id);

    if (!user.stripe_customer_id) {
      return res.status(400).json({
        success: false,
        error: 'No Stripe customer found'
      });
    }

    await stripeService.setDefaultPaymentMethod(user.stripe_customer_id, paymentMethodId);

    await auditLog(req.user.id, 'default_payment_method_set_api', {
      paymentMethodId
    });

    res.json({
      success: true,
      message: 'Default payment method updated'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Billing Portal Routes

// Create billing portal session
router.post('/billing-portal', authenticateToken, paymentRateLimit, async (req, res) => {
  try {
    const { returnUrl } = req.body;
    
    if (!returnUrl) {
      return res.status(400).json({
        success: false,
        error: 'Return URL is required'
      });
    }

    const session = await billingService.createBillingPortalSession(req.user.id, returnUrl);

    res.json({
      success: true,
      url: session.url
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Invoice Routes

// Get invoice history
router.get('/invoices', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const invoices = await billingService.getInvoiceHistory(req.user.id, parseInt(limit));

    res.json({
      success: true,
      invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create usage invoice
router.post('/invoices', authenticateToken, paymentRateLimit, async (req, res) => {
  try {
    const { usageItems } = req.body;

    if (!usageItems || !Array.isArray(usageItems)) {
      return res.status(400).json({
        success: false,
        error: 'Usage items array is required'
      });
    }

    const invoice = await billingService.createUsageInvoice(req.user.id, usageItems);

    res.json({
      success: true,
      invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Feature Access Routes

// Check feature access
router.get('/features/:feature', authenticateToken, async (req, res) => {
  try {
    const { feature } = req.params;
    
    const hasAccess = await billingService.checkFeatureAccess(req.user.id, feature);

    res.json({
      success: true,
      hasAccess,
      feature
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Analytics Routes (Admin only)

// Get revenue analytics
router.get('/analytics/revenue', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const analytics = await billingService.getRevenueAnalytics(
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get subscription analytics
router.get('/analytics/subscriptions', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const analytics = await stripeService.getSubscriptionAnalytics();

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Webhook Routes

// Stripe webhook handler
router.post('/webhooks/stripe', webhookRateLimit, express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing Stripe signature'
      });
    }

    const result = await stripeService.handleWebhook(req.body, signature);

    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error.message);
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Test Routes (Development only)
if (process.env.NODE_ENV === 'development') {
  // Reset user usage (for testing)
  router.post('/test/reset-usage', authenticateToken, async (req, res) => {
    try {
      const { type } = req.body;
      
      if (!type) {
        return res.status(400).json({
          success: false,
          error: 'Usage type is required'
        });
      }

      const result = await billingService.resetUsage(req.user.id, type);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Set free plan (for testing)
  router.post('/test/set-free-plan', authenticateToken, async (req, res) => {
    try {
      const result = await billingService.setFreePlan(req.user.id);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Payment route error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = router; 