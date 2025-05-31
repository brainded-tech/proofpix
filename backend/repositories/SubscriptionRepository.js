const BaseRepository = require('./BaseRepository');

/**
 * Subscription Repository for subscription management operations
 */
class SubscriptionRepository extends BaseRepository {
  constructor() {
    super('subscriptions');
  }

  /**
   * Find active subscription for user
   * @param {string} userId - User ID
   * @returns {Object|null} Active subscription or null
   */
  async findActiveByUserId(userId) {
    try {
      return await this.findOne({ 
        user_id: userId, 
        status: 'active' 
      });
    } catch (error) {
      this.logger.error('Error finding active subscription', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Find subscription by Stripe subscription ID
   * @param {string} stripeSubscriptionId - Stripe subscription ID
   * @returns {Object|null} Subscription or null
   */
  async findByStripeId(stripeSubscriptionId) {
    try {
      return await this.findOne({ stripe_subscription_id: stripeSubscriptionId });
    } catch (error) {
      this.logger.error('Error finding subscription by Stripe ID', { stripeSubscriptionId, error: error.message });
      throw error;
    }
  }

  /**
   * Get subscriptions expiring soon
   * @param {number} days - Days until expiration
   * @returns {Array} Expiring subscriptions
   */
  async getExpiringSubscriptions(days = 7) {
    try {
      const sql = `
        SELECT s.*, u.email, u.first_name, u.last_name
        FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        WHERE s.status IN ('active', 'trialing')
        AND s.current_period_end BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '${days} days'
        ORDER BY s.current_period_end ASC
      `;
      
      const result = await this.executeQuery(sql);
      return result.rows;
    } catch (error) {
      this.logger.error('Error getting expiring subscriptions', { days, error: error.message });
      throw error;
    }
  }

  /**
   * Update subscription status
   * @param {string} subscriptionId - Subscription ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional update data
   * @returns {Object|null} Updated subscription
   */
  async updateStatus(subscriptionId, status, additionalData = {}) {
    try {
      return await this.update(subscriptionId, {
        status,
        ...additionalData
      });
    } catch (error) {
      this.logger.error('Error updating subscription status', { subscriptionId, status, error: error.message });
      throw error;
    }
  }

  /**
   * Get subscription analytics
   * @returns {Object} Subscription analytics
   */
  async getSubscriptionAnalytics() {
    try {
      const sql = `
        SELECT 
          COUNT(*) as total_subscriptions,
          COUNT(*) FILTER (WHERE status = 'active') as active_subscriptions,
          COUNT(*) FILTER (WHERE status = 'trialing') as trial_subscriptions,
          COUNT(*) FILTER (WHERE status = 'canceled') as canceled_subscriptions,
          COUNT(*) FILTER (WHERE plan_type = 'free') as free_plans,
          COUNT(*) FILTER (WHERE plan_type = 'pro') as pro_plans,
          COUNT(*) FILTER (WHERE plan_type = 'enterprise') as enterprise_plans,
          AVG(price_amount) FILTER (WHERE status = 'active' AND price_amount > 0) as avg_revenue_per_user,
          SUM(price_amount) FILTER (WHERE status = 'active') as monthly_recurring_revenue
        FROM subscriptions
      `;
      
      const result = await this.executeQuery(sql);
      return result.rows[0];
    } catch (error) {
      this.logger.error('Error getting subscription analytics', { error: error.message });
      throw error;
    }
  }
}

module.exports = SubscriptionRepository; 