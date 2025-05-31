/**
 * Subscription Management Routes
 * Provides API endpoints for subscription plans, billing, and enterprise features
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireSubscription } = require('../middleware/auth');
const { auditLog } = require('../services/auditService');
const billingService = require('../services/billingService');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');

// Rate limiting for subscription endpoints
const subscriptionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many subscription requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all subscription routes
router.use(subscriptionRateLimit);

// Validation middleware
const validateErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * GET /api/subscriptions/plans
 * Get available subscription plans
 */
router.get('/plans', async (req, res) => {
  try {
    const plans = {
      free: {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'USD',
        interval: 'month',
        features: {
          proofs: 10,
          storage: '1 GB',
          templates: 'Basic',
          watermarks: true,
          compression: 'Standard',
          support: 'Community',
          api: false,
          integrations: false,
          customBranding: false,
          analytics: 'Basic',
          teamMembers: 1,
          projects: 3
        },
        limits: {
          proofs_per_month: 10,
          storage_gb: 1,
          api_calls_per_month: 0,
          team_members: 1,
          projects: 3,
          templates: 5
        },
        popular: false
      },
      professional: {
        id: 'professional',
        name: 'Professional',
        price: 29,
        currency: 'USD',
        interval: 'month',
        features: {
          proofs: 'Unlimited',
          storage: '50 GB',
          templates: 'Premium',
          watermarks: 'Customizable',
          compression: 'Advanced',
          support: 'Email',
          api: 'Basic',
          integrations: 'Standard',
          customBranding: true,
          analytics: 'Advanced',
          teamMembers: 5,
          projects: 'Unlimited'
        },
        limits: {
          proofs_per_month: -1, // Unlimited
          storage_gb: 50,
          api_calls_per_month: 10000,
          team_members: 5,
          projects: -1, // Unlimited
          templates: -1 // Unlimited
        },
        popular: true
      },
      enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        currency: 'USD',
        interval: 'month',
        features: {
          proofs: 'Unlimited',
          storage: '500 GB',
          templates: 'Premium + Custom',
          watermarks: 'Full Control',
          compression: 'Lossless',
          support: 'Priority',
          api: 'Full Access',
          integrations: 'All Integrations',
          customBranding: 'White Label',
          analytics: 'Enterprise',
          teamMembers: 'Unlimited',
          projects: 'Unlimited'
        },
        limits: {
          proofs_per_month: -1, // Unlimited
          storage_gb: 500,
          api_calls_per_month: 100000,
          team_members: -1, // Unlimited
          projects: -1, // Unlimited
          templates: -1 // Unlimited
        },
        popular: false,
        enterprise_features: {
          sso: true,
          audit_logs: true,
          compliance: ['GDPR', 'HIPAA', 'SOX'],
          deployment: 'On-premise available',
          sla: '99.9% uptime',
          dedicated_support: true
        }
      }
    };

    res.json({
      success: true,
      data: { plans: Object.values(plans) }
    });
  } catch (error) {
    console.error('Failed to get subscription plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscription plans'
    });
  }
});

/**
 * GET /api/subscriptions/current
 * Get current user subscription
 */
router.get('/current', requireAuth, async (req, res) => {
  try {
    // Mock subscription data (would typically come from database/billing service)
    const subscription = {
      id: 'sub_123456',
      userId: req.user.userId,
      planId: req.user.subscriptionTier || 'free',
      status: 'active',
      currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      cancelAtPeriodEnd: false,
      trialEnd: null,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: new Date(),
      usage: {
        proofs_this_month: 45,
        storage_used_gb: 2.3,
        api_calls_this_month: 1250,
        team_members: 3,
        projects: 8
      },
      billing: {
        nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        amount: req.user.subscriptionTier === 'professional' ? 29 : req.user.subscriptionTier === 'enterprise' ? 99 : 0,
        currency: 'USD',
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025
        }
      }
    };

    res.json({
      success: true,
      data: { subscription }
    });
  } catch (error) {
    console.error('Failed to get current subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve current subscription'
    });
  }
});

/**
 * POST /api/subscriptions/subscribe
 * Subscribe to a plan
 */
router.post('/subscribe',
  requireAuth,
  [
    body('planId').isIn(['free', 'professional', 'enterprise']).withMessage('Valid plan ID is required'),
    body('paymentMethodId').optional().isString().withMessage('Valid payment method ID required for paid plans'),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { planId, paymentMethodId } = req.body;
      
      // Validate payment method for paid plans
      if (planId !== 'free' && !paymentMethodId) {
        return res.status(400).json({
          success: false,
          message: 'Payment method is required for paid plans'
        });
      }

      // Create subscription (would typically use billing service)
      const subscription = {
        id: `sub_${Date.now()}`,
        userId: req.user.userId,
        planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false,
        trialEnd: planId !== 'free' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null, // 14-day trial
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await auditLog(req.user.userId, 'subscription_created', {
        subscriptionId: subscription.id,
        planId,
        hasPaymentMethod: !!paymentMethodId
      });

      res.status(201).json({
        success: true,
        data: { subscription },
        message: `Successfully subscribed to ${planId} plan`
      });
    } catch (error) {
      console.error('Failed to create subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create subscription'
      });
    }
  }
);

/**
 * PUT /api/subscriptions/change-plan
 * Change subscription plan
 */
router.put('/change-plan',
  requireAuth,
  [
    body('planId').isIn(['free', 'professional', 'enterprise']).withMessage('Valid plan ID is required'),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { planId } = req.body;
      const currentPlan = req.user.subscriptionTier || 'free';
      
      if (currentPlan === planId) {
        return res.status(400).json({
          success: false,
          message: 'You are already on this plan'
        });
      }

      // Calculate proration and effective date
      const isUpgrade = ['free', 'professional', 'enterprise'].indexOf(planId) > 
                       ['free', 'professional', 'enterprise'].indexOf(currentPlan);
      
      const changeResult = {
        oldPlan: currentPlan,
        newPlan: planId,
        effectiveDate: new Date(),
        proration: isUpgrade ? 0 : null, // Simplified proration logic
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      await auditLog(req.user.userId, 'subscription_plan_changed', {
        oldPlan: currentPlan,
        newPlan: planId,
        isUpgrade
      });

      res.json({
        success: true,
        data: changeResult,
        message: `Plan changed from ${currentPlan} to ${planId}`
      });
    } catch (error) {
      console.error('Failed to change plan:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change subscription plan'
      });
    }
  }
);

/**
 * POST /api/subscriptions/cancel
 * Cancel subscription
 */
router.post('/cancel',
  requireAuth,
  [
    body('reason').optional().isLength({ max: 500 }).trim().withMessage('Cancellation reason too long'),
    body('feedback').optional().isLength({ max: 1000 }).trim().withMessage('Feedback too long'),
    body('cancelImmediately').optional().isBoolean().withMessage('Cancel immediately must be boolean'),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { reason, feedback, cancelImmediately = false } = req.body;
      
      const cancellation = {
        canceledAt: new Date(),
        reason,
        feedback,
        cancelImmediately,
        effectiveDate: cancelImmediately ? new Date() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // End of current period
        refundAmount: cancelImmediately ? 0 : null // Simplified refund logic
      };

      await auditLog(req.user.userId, 'subscription_canceled', {
        reason,
        cancelImmediately,
        hasFeedback: !!feedback
      });

      res.json({
        success: true,
        data: { cancellation },
        message: cancelImmediately ? 
          'Subscription canceled immediately' : 
          'Subscription will be canceled at the end of the current billing period'
      });
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel subscription'
      });
    }
  }
);

/**
 * POST /api/subscriptions/reactivate
 * Reactivate canceled subscription
 */
router.post('/reactivate', requireAuth, async (req, res) => {
  try {
    const reactivation = {
      reactivatedAt: new Date(),
      effectiveDate: new Date(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    await auditLog(req.user.userId, 'subscription_reactivated', {
      reactivatedAt: reactivation.reactivatedAt
    });

    res.json({
      success: true,
      data: { reactivation },
      message: 'Subscription reactivated successfully'
    });
  } catch (error) {
    console.error('Failed to reactivate subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate subscription'
    });
  }
});

/**
 * GET /api/subscriptions/usage
 * Get subscription usage statistics
 */
router.get('/usage', requireAuth, async (req, res) => {
  try {
    const { period = 'current' } = req.query;
    
    // Mock usage data (would typically come from analytics service)
    const usage = {
      period,
      subscription: {
        planId: req.user.subscriptionTier || 'free',
        status: 'active'
      },
      current: {
        proofs: {
          used: 45,
          limit: req.user.subscriptionTier === 'free' ? 10 : -1, // -1 = unlimited
          percentage: req.user.subscriptionTier === 'free' ? 450 : null
        },
        storage: {
          used_gb: 2.3,
          limit_gb: req.user.subscriptionTier === 'free' ? 1 : 
                   req.user.subscriptionTier === 'professional' ? 50 : 500,
          percentage: req.user.subscriptionTier === 'free' ? 230 : 
                     req.user.subscriptionTier === 'professional' ? 4.6 : 0.46
        },
        api_calls: {
          used: 1250,
          limit: req.user.subscriptionTier === 'free' ? 0 : 
                req.user.subscriptionTier === 'professional' ? 10000 : 100000,
          percentage: req.user.subscriptionTier === 'professional' ? 12.5 : 1.25
        },
        team_members: {
          used: 3,
          limit: req.user.subscriptionTier === 'free' ? 1 : 
                req.user.subscriptionTier === 'professional' ? 5 : -1
        },
        projects: {
          used: 8,
          limit: req.user.subscriptionTier === 'free' ? 3 : -1
        }
      },
      history: [
        {
          month: '2024-11',
          proofs: 38,
          storage_gb: 2.1,
          api_calls: 980
        },
        {
          month: '2024-10',
          proofs: 42,
          storage_gb: 1.9,
          api_calls: 1150
        }
      ],
      alerts: []
    };

    // Add usage alerts
    if (usage.current.proofs.percentage > 80) {
      usage.alerts.push({
        type: 'warning',
        resource: 'proofs',
        message: 'You have used 80% of your monthly proof limit'
      });
    }

    if (usage.current.storage.percentage > 90) {
      usage.alerts.push({
        type: 'critical',
        resource: 'storage',
        message: 'You have used 90% of your storage limit'
      });
    }

    res.json({
      success: true,
      data: { usage }
    });
  } catch (error) {
    console.error('Failed to get usage statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve usage statistics'
    });
  }
});

/**
 * GET /api/subscriptions/billing-history
 * Get billing history
 */
router.get('/billing-history', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // Mock billing history (would typically come from billing service)
    const billingHistory = [
      {
        id: 'inv_123456',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        amount: 29.00,
        currency: 'USD',
        status: 'paid',
        description: 'Professional Plan - Monthly',
        downloadUrl: '/api/subscriptions/invoices/inv_123456'
      },
      {
        id: 'inv_123455',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        amount: 29.00,
        currency: 'USD',
        status: 'paid',
        description: 'Professional Plan - Monthly',
        downloadUrl: '/api/subscriptions/invoices/inv_123455'
      }
    ];

    res.json({
      success: true,
      data: {
        invoices: billingHistory,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: billingHistory.length,
          pages: Math.ceil(billingHistory.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Failed to get billing history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve billing history'
    });
  }
});

/**
 * GET /api/subscriptions/invoices/:invoiceId
 * Download invoice
 */
router.get('/invoices/:invoiceId',
  requireAuth,
  [param('invoiceId').notEmpty().withMessage('Invoice ID is required')],
  validateErrors,
  async (req, res) => {
    try {
      const { invoiceId } = req.params;
      
      // Generate invoice download URL or stream PDF
      const invoice = {
        id: invoiceId,
        downloadUrl: `/files/invoices/${invoiceId}.pdf`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      };

      await auditLog(req.user.userId, 'invoice_downloaded', {
        invoiceId
      });

      res.json({
        success: true,
        data: { invoice },
        message: 'Invoice ready for download'
      });
    } catch (error) {
      console.error('Failed to download invoice:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download invoice'
      });
    }
  }
);

/**
 * Enterprise Routes
 */

/**
 * GET /api/subscriptions/enterprise/features
 * Get enterprise features (Enterprise only)
 */
router.get('/enterprise/features', 
  requireAuth, 
  requireSubscription('enterprise'),
  async (req, res) => {
    try {
      const enterpriseFeatures = {
        sso: {
          enabled: true,
          providers: ['SAML', 'OIDC', 'Active Directory'],
          status: 'configured'
        },
        audit_logs: {
          enabled: true,
          retention_days: 365,
          export_formats: ['CSV', 'JSON', 'PDF']
        },
        compliance: {
          certifications: ['GDPR', 'HIPAA', 'SOX', 'ISO 27001'],
          data_residency: ['US', 'EU', 'APAC'],
          encryption: 'AES-256'
        },
        deployment: {
          options: ['Cloud', 'On-premise', 'Hybrid'],
          current: 'Cloud',
          sla: '99.9% uptime'
        },
        support: {
          level: 'Priority',
          channels: ['Phone', 'Email', 'Slack', 'Dedicated CSM'],
          response_time: '< 4 hours'
        },
        customization: {
          white_label: true,
          custom_domain: true,
          api_access: 'Full',
          webhooks: 'Unlimited'
        }
      };

      res.json({
        success: true,
        data: { features: enterpriseFeatures }
      });
    } catch (error) {
      console.error('Failed to get enterprise features:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve enterprise features'
      });
    }
  }
);

/**
 * POST /api/subscriptions/enterprise/contact-sales
 * Contact sales for enterprise inquiries
 */
router.post('/enterprise/contact-sales',
  [
    body('name').isLength({ min: 1, max: 100 }).trim().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('company').isLength({ min: 1, max: 100 }).trim().withMessage('Company is required'),
    body('message').isLength({ min: 1, max: 1000 }).trim().withMessage('Message is required'),
    body('phone').optional().isMobilePhone(),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { name, email, company, message, phone } = req.body;
      
      const inquiry = {
        id: Date.now().toString(),
        name,
        email,
        company,
        message,
        phone,
        source: 'subscription_page',
        createdAt: new Date(),
        status: 'new'
      };

      // Would typically send to CRM or sales team
      await auditLog(req.user?.userId || 'anonymous', 'enterprise_inquiry_submitted', {
        inquiryId: inquiry.id,
        company,
        email
      });

      res.status(201).json({
        success: true,
        data: { inquiry },
        message: 'Enterprise inquiry submitted successfully. Our sales team will contact you within 24 hours.'
      });
    } catch (error) {
      console.error('Failed to submit enterprise inquiry:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit enterprise inquiry'
      });
    }
  }
);

module.exports = router; 