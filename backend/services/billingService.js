const stripeService = require('./stripeService');
const { auditLog } = require('./auditService');
const db = require('../config/database');

class BillingService {
  constructor() {
    this.plans = {
      free: {
        name: 'Free',
        priceId: null,
        features: {
          apiCalls: 100,
          fileUploads: 10,
          storageGB: 1,
          watermarkRemoval: false,
          prioritySupport: false,
          apiAccess: false
        },
        price: 0
      },
      starter: {
        name: 'Starter',
        priceId: process.env.STRIPE_STARTER_PRICE_ID,
        features: {
          apiCalls: 1000,
          fileUploads: 100,
          storageGB: 10,
          watermarkRemoval: true,
          prioritySupport: false,
          apiAccess: true
        },
        price: 9.99
      },
      professional: {
        name: 'Professional',
        priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
        features: {
          apiCalls: 10000,
          fileUploads: 1000,
          storageGB: 100,
          watermarkRemoval: true,
          prioritySupport: true,
          apiAccess: true
        },
        price: 29.99
      },
      enterprise: {
        name: 'Enterprise',
        priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
        features: {
          apiCalls: 100000,
          fileUploads: 10000,
          storageGB: 1000,
          watermarkRemoval: true,
          prioritySupport: true,
          apiAccess: true
        },
        price: 99.99
      }
    };
  }

  // Subscription Management
  async createSubscription(userId, planName, paymentMethodId = null) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const plan = this.plans[planName];
      if (!plan) {
        throw new Error('Invalid plan');
      }

      if (planName === 'free') {
        // Handle free plan subscription
        await this.setFreePlan(userId);
        return { success: true, plan: 'free' };
      }

      // Create or get Stripe customer
      let customerId = user.stripe_customer_id;
      if (!customerId) {
        const customer = await stripeService.createCustomer(user);
        customerId = customer.id;
      }

      // Attach payment method if provided
      if (paymentMethodId) {
        await stripeService.attachPaymentMethod(paymentMethodId, customerId);
        await stripeService.setDefaultPaymentMethod(customerId, paymentMethodId);
      }

      // Create subscription
      const subscription = await stripeService.createSubscription(
        customerId,
        plan.priceId,
        userId,
        {
          planName,
          trialDays: 14 // 14-day trial for all paid plans
        }
      );

      await auditLog(userId, 'subscription_created_billing', {
        planName,
        subscriptionId: subscription.id,
        trialDays: 14
      });

      return {
        success: true,
        subscription,
        clientSecret: subscription.latest_invoice.payment_intent?.client_secret
      };
    } catch (error) {
      await auditLog(userId, 'subscription_creation_failed_billing', {
        error: error.message,
        planName
      });
      throw error;
    }
  }

  async cancelSubscription(userId, reason = null) {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      if (subscription.plan_name === 'free') {
        throw new Error('Cannot cancel free plan');
      }

      await stripeService.cancelSubscription(
        subscription.stripe_subscription_id,
        userId,
        { reason, immediate: false } // Cancel at period end
      );

      await auditLog(userId, 'subscription_canceled_billing', {
        planName: subscription.plan_name,
        reason
      });

      return { success: true, message: 'Subscription will be canceled at the end of the billing period' };
    } catch (error) {
      await auditLog(userId, 'subscription_cancellation_failed_billing', {
        error: error.message
      });
      throw error;
    }
  }

  async upgradeSubscription(userId, newPlanName) {
    try {
      const currentSubscription = await this.getUserSubscription(userId);
      if (!currentSubscription) {
        throw new Error('No active subscription found');
      }

      const newPlan = this.plans[newPlanName];
      if (!newPlan) {
        throw new Error('Invalid plan');
      }

      if (newPlanName === 'free') {
        throw new Error('Cannot downgrade to free plan via upgrade');
      }

      // Update subscription with new price
      await stripeService.updateSubscription(
        currentSubscription.stripe_subscription_id,
        userId,
        {
          items: [{
            id: currentSubscription.stripe_subscription_item_id,
            price: newPlan.priceId
          }],
          proration_behavior: 'create_prorations'
        }
      );

      // Update local database
      await db.query(
        'UPDATE subscriptions SET plan_name = $1, updated_at = NOW() WHERE user_id = $2',
        [newPlanName, userId]
      );

      await auditLog(userId, 'subscription_upgraded_billing', {
        fromPlan: currentSubscription.plan_name,
        toPlan: newPlanName
      });

      return { success: true, newPlan: newPlanName };
    } catch (error) {
      await auditLog(userId, 'subscription_upgrade_failed_billing', {
        error: error.message,
        newPlanName
      });
      throw error;
    }
  }

  async setFreePlan(userId) {
    try {
      await db.query(`
        INSERT INTO subscriptions (
          user_id, plan_name, status, created_at, updated_at
        ) VALUES ($1, 'free', 'active', NOW(), NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          plan_name = 'free',
          status = 'active',
          stripe_subscription_id = NULL,
          stripe_customer_id = NULL,
          updated_at = NOW()
      `, [userId]);

      await auditLog(userId, 'free_plan_set_billing', {});
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to set free plan: ${error.message}`);
    }
  }

  // Usage Tracking
  async trackUsage(userId, type, quantity = 1, metadata = {}) {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        throw new Error('No subscription found');
      }

      const plan = this.plans[subscription.plan_name];
      if (!plan) {
        throw new Error('Invalid plan');
      }

      // Check quota
      const currentUsage = await this.getCurrentUsage(userId, type);
      const limit = plan.features[type];
      
      if (limit && currentUsage + quantity > limit) {
        throw new Error(`Usage limit exceeded for ${type}. Current: ${currentUsage}, Limit: ${limit}`);
      }

      // Record usage
      await db.query(`
        INSERT INTO usage_tracking (
          user_id, usage_type, quantity, metadata, created_at
        ) VALUES ($1, $2, $3, $4, NOW())
      `, [userId, type, quantity, JSON.stringify(metadata)]);

      // If it's a metered subscription, record usage in Stripe
      if (subscription.stripe_subscription_id && type === 'apiCalls') {
        await stripeService.recordUsage(
          subscription.stripe_subscription_item_id,
          quantity
        );
      }

      await auditLog(userId, 'usage_tracked_billing', {
        type,
        quantity,
        currentUsage: currentUsage + quantity,
        limit
      });

      return {
        success: true,
        currentUsage: currentUsage + quantity,
        limit,
        remaining: limit ? limit - (currentUsage + quantity) : null
      };
    } catch (error) {
      await auditLog(userId, 'usage_tracking_failed_billing', {
        error: error.message,
        type,
        quantity
      });
      throw error;
    }
  }

  async getCurrentUsage(userId, type, period = 'current_month') {
    try {
      let dateFilter = '';
      const params = [userId, type];

      switch (period) {
        case 'current_month':
          dateFilter = "AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())";
          break;
        case 'current_day':
          dateFilter = "AND DATE_TRUNC('day', created_at) = DATE_TRUNC('day', NOW())";
          break;
        case 'billing_period':
          const subscription = await this.getUserSubscription(userId);
          if (subscription && subscription.current_period_start) {
            dateFilter = 'AND created_at >= $3';
            params.push(subscription.current_period_start);
          }
          break;
      }

      const result = await db.query(`
        SELECT COALESCE(SUM(quantity), 0) as total_usage
        FROM usage_tracking
        WHERE user_id = $1 AND usage_type = $2 ${dateFilter}
      `, params);

      return parseInt(result.rows[0].total_usage);
    } catch (error) {
      throw new Error(`Failed to get current usage: ${error.message}`);
    }
  }

  async getUsageAnalytics(userId, startDate, endDate) {
    try {
      const result = await db.query(`
        SELECT 
          usage_type,
          SUM(quantity) as total_quantity,
          COUNT(*) as total_requests,
          DATE_TRUNC('day', created_at) as usage_date
        FROM usage_tracking
        WHERE user_id = $1 AND created_at BETWEEN $2 AND $3
        GROUP BY usage_type, DATE_TRUNC('day', created_at)
        ORDER BY usage_date DESC
      `, [userId, startDate, endDate]);

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get usage analytics: ${error.message}`);
    }
  }

  // Billing Portal
  async createBillingPortalSession(userId, returnUrl) {
    try {
      const user = await this.getUserById(userId);
      if (!user || !user.stripe_customer_id) {
        throw new Error('No Stripe customer found');
      }

      const session = await stripeService.createBillingPortalSession(
        user.stripe_customer_id,
        returnUrl
      );

      await auditLog(userId, 'billing_portal_session_created', {
        sessionId: session.id
      });

      return session;
    } catch (error) {
      await auditLog(userId, 'billing_portal_session_failed', {
        error: error.message
      });
      throw error;
    }
  }

  // Invoice Management
  async createUsageInvoice(userId, usageItems) {
    try {
      const user = await this.getUserById(userId);
      if (!user || !user.stripe_customer_id) {
        throw new Error('No Stripe customer found');
      }

      const invoice = await stripeService.createInvoice(
        user.stripe_customer_id,
        usageItems,
        {
          autoAdvance: true,
          collectionMethod: 'charge_automatically',
          metadata: { userId: userId.toString() }
        }
      );

      await stripeService.finalizeInvoice(invoice.id);

      await auditLog(userId, 'usage_invoice_created', {
        invoiceId: invoice.id,
        amount: invoice.amount_due
      });

      return invoice;
    } catch (error) {
      await auditLog(userId, 'usage_invoice_failed', {
        error: error.message
      });
      throw error;
    }
  }

  async getInvoiceHistory(userId, limit = 10) {
    try {
      const result = await db.query(`
        SELECT 
          stripe_invoice_id,
          amount,
          currency,
          status,
          paid_at,
          created_at
        FROM billing
        WHERE stripe_customer_id = (
          SELECT stripe_customer_id FROM users WHERE id = $1
        )
        ORDER BY created_at DESC
        LIMIT $2
      `, [userId, limit]);

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get invoice history: ${error.message}`);
    }
  }

  // Plan Management
  async getUserSubscription(userId) {
    try {
      const result = await db.query(`
        SELECT * FROM subscriptions WHERE user_id = $1
      `, [userId]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to get user subscription: ${error.message}`);
    }
  }

  async getUserPlan(userId) {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) {
        return this.plans.free;
      }

      return this.plans[subscription.plan_name] || this.plans.free;
    } catch (error) {
      throw new Error(`Failed to get user plan: ${error.message}`);
    }
  }

  async checkFeatureAccess(userId, feature) {
    try {
      const plan = await this.getUserPlan(userId);
      return plan.features[feature] || false;
    } catch (error) {
      throw new Error(`Failed to check feature access: ${error.message}`);
    }
  }

  async getAllPlans() {
    return this.plans;
  }

  // Revenue Analytics
  async getRevenueAnalytics(startDate, endDate) {
    try {
      // Get Stripe analytics
      const stripeAnalytics = await stripeService.getRevenueAnalytics(startDate, endDate);

      // Get database analytics
      const dbResult = await db.query(`
        SELECT 
          COUNT(*) as total_transactions,
          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_revenue,
          COUNT(CASE WHEN status = 'paid' THEN 1 END) as successful_payments,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
          AVG(CASE WHEN status = 'paid' THEN amount ELSE NULL END) as average_transaction
        FROM billing
        WHERE created_at BETWEEN $1 AND $2
      `, [startDate, endDate]);

      const subscriptionResult = await db.query(`
        SELECT 
          plan_name,
          COUNT(*) as subscriber_count,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscribers
        FROM subscriptions
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY plan_name
      `, [startDate, endDate]);

      return {
        stripe: stripeAnalytics,
        database: dbResult.rows[0],
        subscriptions: subscriptionResult.rows
      };
    } catch (error) {
      throw new Error(`Failed to get revenue analytics: ${error.message}`);
    }
  }

  // Helper Methods
  async getUserById(userId) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async updateUserStripeCustomerId(userId, customerId) {
    try {
      await db.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, userId]
      );
    } catch (error) {
      throw new Error(`Failed to update Stripe customer ID: ${error.message}`);
    }
  }

  // Quota Management
  async checkQuota(userId, type, quantity = 1) {
    try {
      const plan = await this.getUserPlan(userId);
      const currentUsage = await this.getCurrentUsage(userId, type);
      const limit = plan.features[type];

      if (!limit) {
        return { allowed: true, unlimited: true };
      }

      const allowed = currentUsage + quantity <= limit;
      
      return {
        allowed,
        currentUsage,
        limit,
        remaining: limit - currentUsage,
        unlimited: false
      };
    } catch (error) {
      throw new Error(`Failed to check quota: ${error.message}`);
    }
  }

  async resetUsage(userId, type) {
    try {
      await db.query(`
        DELETE FROM usage_tracking
        WHERE user_id = $1 AND usage_type = $2
        AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
      `, [userId, type]);

      await auditLog(userId, 'usage_reset_billing', { type });
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to reset usage: ${error.message}`);
    }
  }
}

module.exports = new BillingService(); 