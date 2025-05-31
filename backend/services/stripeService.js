const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auditLog } = require('./auditService');
const db = require('../config/database');

class StripeService {
  constructor() {
    this.stripe = stripe;
  }

  // Customer Management
  async createCustomer(userData) {
    try {
      const customer = await this.stripe.customers.create({
        email: userData.email,
        name: userData.name,
        metadata: {
          userId: userData.id.toString(),
          registrationDate: new Date().toISOString()
        }
      });

      // Update user with Stripe customer ID
      await db.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customer.id, userData.id]
      );

      await auditLog(userData.id, 'stripe_customer_created', {
        customerId: customer.id,
        email: userData.email
      });

      return customer;
    } catch (error) {
      await auditLog(userData.id, 'stripe_customer_creation_failed', {
        error: error.message,
        email: userData.email
      });
      throw new Error(`Failed to create Stripe customer: ${error.message}`);
    }
  }

  async getCustomer(customerId) {
    try {
      return await this.stripe.customers.retrieve(customerId);
    } catch (error) {
      throw new Error(`Failed to retrieve customer: ${error.message}`);
    }
  }

  async updateCustomer(customerId, updateData) {
    try {
      const customer = await this.stripe.customers.update(customerId, updateData);
      
      await auditLog(null, 'stripe_customer_updated', {
        customerId,
        updateData
      });

      return customer;
    } catch (error) {
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  }

  // Subscription Management
  async createSubscription(customerId, priceId, userId, options = {}) {
    try {
      const subscriptionData = {
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId: userId.toString()
        },
        ...options
      };

      // Add trial period if specified
      if (options.trialDays) {
        subscriptionData.trial_period_days = options.trialDays;
      }

      // Add proration behavior for upgrades/downgrades
      if (options.prorate !== undefined) {
        subscriptionData.proration_behavior = options.prorate ? 'create_prorations' : 'none';
      }

      const subscription = await this.stripe.subscriptions.create(subscriptionData);

      // Store subscription in database
      await db.query(`
        INSERT INTO subscriptions (
          user_id, stripe_subscription_id, stripe_customer_id, 
          plan_name, status, current_period_start, current_period_end,
          trial_end, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          stripe_subscription_id = $2,
          plan_name = $4,
          status = $5,
          current_period_start = $6,
          current_period_end = $7,
          trial_end = $8,
          updated_at = NOW()
      `, [
        userId,
        subscription.id,
        customerId,
        options.planName || 'unknown',
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
      ]);

      await auditLog(userId, 'subscription_created', {
        subscriptionId: subscription.id,
        planName: options.planName,
        priceId
      });

      return subscription;
    } catch (error) {
      await auditLog(userId, 'subscription_creation_failed', {
        error: error.message,
        priceId,
        customerId
      });
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  async cancelSubscription(subscriptionId, userId, options = {}) {
    try {
      const cancelData = {
        cancellation_details: {
          comment: options.reason || 'User requested cancellation'
        }
      };

      // Immediate cancellation vs end of period
      if (options.immediate) {
        cancelData.prorate = true;
      } else {
        cancelData.cancel_at_period_end = true;
      }

      const subscription = await this.stripe.subscriptions.update(subscriptionId, cancelData);

      // Update database
      await db.query(`
        UPDATE subscriptions 
        SET status = $1, cancel_at_period_end = $2, canceled_at = $3, updated_at = NOW()
        WHERE stripe_subscription_id = $4
      `, [
        subscription.status,
        subscription.cancel_at_period_end,
        options.immediate ? new Date() : null,
        subscriptionId
      ]);

      await auditLog(userId, 'subscription_canceled', {
        subscriptionId,
        immediate: options.immediate,
        reason: options.reason
      });

      return subscription;
    } catch (error) {
      await auditLog(userId, 'subscription_cancellation_failed', {
        error: error.message,
        subscriptionId
      });
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  async updateSubscription(subscriptionId, userId, updateData) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, updateData);

      // Update database
      await db.query(`
        UPDATE subscriptions 
        SET status = $1, current_period_start = $2, current_period_end = $3, updated_at = NOW()
        WHERE stripe_subscription_id = $4
      `, [
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000),
        subscriptionId
      ]);

      await auditLog(userId, 'subscription_updated', {
        subscriptionId,
        updateData
      });

      return subscription;
    } catch (error) {
      throw new Error(`Failed to update subscription: ${error.message}`);
    }
  }

  // Payment Methods
  async attachPaymentMethod(paymentMethodId, customerId) {
    try {
      return await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
    } catch (error) {
      throw new Error(`Failed to attach payment method: ${error.message}`);
    }
  }

  async setDefaultPaymentMethod(customerId, paymentMethodId) {
    try {
      return await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
    } catch (error) {
      throw new Error(`Failed to set default payment method: ${error.message}`);
    }
  }

  async getPaymentMethods(customerId) {
    try {
      return await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });
    } catch (error) {
      throw new Error(`Failed to retrieve payment methods: ${error.message}`);
    }
  }

  // Invoice Management
  async createInvoice(customerId, items, options = {}) {
    try {
      const invoiceData = {
        customer: customerId,
        auto_advance: options.autoAdvance !== false,
        collection_method: options.collectionMethod || 'charge_automatically',
        metadata: options.metadata || {}
      };

      const invoice = await this.stripe.invoices.create(invoiceData);

      // Add invoice items
      for (const item of items) {
        await this.stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          amount: item.amount,
          currency: item.currency || 'usd',
          description: item.description,
          metadata: item.metadata || {}
        });
      }

      return invoice;
    } catch (error) {
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
  }

  async finalizeInvoice(invoiceId) {
    try {
      return await this.stripe.invoices.finalizeInvoice(invoiceId);
    } catch (error) {
      throw new Error(`Failed to finalize invoice: ${error.message}`);
    }
  }

  async payInvoice(invoiceId) {
    try {
      return await this.stripe.invoices.pay(invoiceId);
    } catch (error) {
      throw new Error(`Failed to pay invoice: ${error.message}`);
    }
  }

  // Usage-based Billing
  async recordUsage(subscriptionItemId, quantity, timestamp = null) {
    try {
      return await this.stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
        quantity,
        timestamp: timestamp || Math.floor(Date.now() / 1000),
        action: 'increment'
      });
    } catch (error) {
      throw new Error(`Failed to record usage: ${error.message}`);
    }
  }

  async getUsageSummary(subscriptionItemId, options = {}) {
    try {
      return await this.stripe.subscriptionItems.listUsageRecordSummaries(subscriptionItemId, {
        limit: options.limit || 100,
        starting_after: options.startingAfter,
        ending_before: options.endingBefore
      });
    } catch (error) {
      throw new Error(`Failed to get usage summary: ${error.message}`);
    }
  }

  // Billing Portal
  async createBillingPortalSession(customerId, returnUrl) {
    try {
      return await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      });
    } catch (error) {
      throw new Error(`Failed to create billing portal session: ${error.message}`);
    }
  }

  // Webhook Handling
  async handleWebhook(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      await auditLog(null, 'stripe_webhook_received', {
        eventType: event.type,
        eventId: event.id
      });

      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'customer.subscription.trial_will_end':
          await this.handleTrialWillEnd(event.data.object);
          break;
        case 'payment_method.attached':
          await this.handlePaymentMethodAttached(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      await auditLog(null, 'stripe_webhook_error', {
        error: error.message,
        signature
      });
      throw new Error(`Webhook error: ${error.message}`);
    }
  }

  async handleSubscriptionCreated(subscription) {
    const userId = subscription.metadata.userId;
    
    await db.query(`
      INSERT INTO subscriptions (
        user_id, stripe_subscription_id, stripe_customer_id,
        status, current_period_start, current_period_end,
        trial_end, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        stripe_subscription_id = $2,
        status = $4,
        current_period_start = $5,
        current_period_end = $6,
        trial_end = $7,
        updated_at = NOW()
    `, [
      userId,
      subscription.id,
      subscription.customer,
      subscription.status,
      new Date(subscription.current_period_start * 1000),
      new Date(subscription.current_period_end * 1000),
      subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
    ]);

    await auditLog(userId, 'subscription_webhook_created', {
      subscriptionId: subscription.id
    });
  }

  async handleSubscriptionUpdated(subscription) {
    const userId = subscription.metadata.userId;
    
    await db.query(`
      UPDATE subscriptions 
      SET status = $1, current_period_start = $2, current_period_end = $3,
          trial_end = $4, cancel_at_period_end = $5, updated_at = NOW()
      WHERE stripe_subscription_id = $6
    `, [
      subscription.status,
      new Date(subscription.current_period_start * 1000),
      new Date(subscription.current_period_end * 1000),
      subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      subscription.cancel_at_period_end,
      subscription.id
    ]);

    await auditLog(userId, 'subscription_webhook_updated', {
      subscriptionId: subscription.id,
      status: subscription.status
    });
  }

  async handleSubscriptionDeleted(subscription) {
    const userId = subscription.metadata.userId;
    
    await db.query(`
      UPDATE subscriptions 
      SET status = 'canceled', canceled_at = NOW(), updated_at = NOW()
      WHERE stripe_subscription_id = $1
    `, [subscription.id]);

    await auditLog(userId, 'subscription_webhook_deleted', {
      subscriptionId: subscription.id
    });
  }

  async handlePaymentSucceeded(invoice) {
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;
    
    // Record successful payment
    await db.query(`
      INSERT INTO billing (
        stripe_customer_id, stripe_subscription_id, stripe_invoice_id,
        amount, currency, status, paid_at, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    `, [
      customerId,
      subscriptionId,
      invoice.id,
      invoice.amount_paid,
      invoice.currency,
      'paid',
      new Date(invoice.status_transitions.paid_at * 1000)
    ]);

    await auditLog(null, 'payment_succeeded_webhook', {
      invoiceId: invoice.id,
      amount: invoice.amount_paid,
      customerId
    });
  }

  async handlePaymentFailed(invoice) {
    const customerId = invoice.customer;
    
    await db.query(`
      INSERT INTO billing (
        stripe_customer_id, stripe_subscription_id, stripe_invoice_id,
        amount, currency, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [
      customerId,
      invoice.subscription,
      invoice.id,
      invoice.amount_due,
      invoice.currency,
      'failed'
    ]);

    await auditLog(null, 'payment_failed_webhook', {
      invoiceId: invoice.id,
      amount: invoice.amount_due,
      customerId
    });
  }

  async handleTrialWillEnd(subscription) {
    const userId = subscription.metadata.userId;
    
    await auditLog(userId, 'trial_will_end_webhook', {
      subscriptionId: subscription.id,
      trialEnd: new Date(subscription.trial_end * 1000)
    });

    // TODO: Send trial ending notification email
  }

  async handlePaymentMethodAttached(paymentMethod) {
    await auditLog(null, 'payment_method_attached_webhook', {
      paymentMethodId: paymentMethod.id,
      customerId: paymentMethod.customer
    });
  }

  // Analytics and Reporting
  async getRevenueAnalytics(startDate, endDate) {
    try {
      const charges = await this.stripe.charges.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000)
        },
        limit: 100
      });

      const revenue = charges.data.reduce((total, charge) => {
        return total + (charge.paid ? charge.amount : 0);
      }, 0);

      return {
        totalRevenue: revenue,
        totalCharges: charges.data.length,
        successfulCharges: charges.data.filter(c => c.paid).length,
        failedCharges: charges.data.filter(c => !c.paid).length
      };
    } catch (error) {
      throw new Error(`Failed to get revenue analytics: ${error.message}`);
    }
  }

  async getSubscriptionAnalytics() {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        status: 'all',
        limit: 100
      });

      const analytics = {
        total: subscriptions.data.length,
        active: subscriptions.data.filter(s => s.status === 'active').length,
        trialing: subscriptions.data.filter(s => s.status === 'trialing').length,
        canceled: subscriptions.data.filter(s => s.status === 'canceled').length,
        pastDue: subscriptions.data.filter(s => s.status === 'past_due').length
      };

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get subscription analytics: ${error.message}`);
    }
  }

  // Price and Product Management
  async createProduct(productData) {
    try {
      return await this.stripe.products.create(productData);
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async createPrice(priceData) {
    try {
      return await this.stripe.prices.create(priceData);
    } catch (error) {
      throw new Error(`Failed to create price: ${error.message}`);
    }
  }

  async listPrices(productId = null) {
    try {
      const params = { limit: 100 };
      if (productId) params.product = productId;
      
      return await this.stripe.prices.list(params);
    } catch (error) {
      throw new Error(`Failed to list prices: ${error.message}`);
    }
  }
}

module.exports = new StripeService(); 