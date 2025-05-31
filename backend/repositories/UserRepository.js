const BaseRepository = require('./BaseRepository');
const { query } = require('../config/database');

/**
 * User Repository for user-specific database operations
 */
class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Object|null} User record or null
   */
  async findByEmail(email) {
    try {
      return await this.findOne({ email: email.toLowerCase() });
    } catch (error) {
      this.logger.error('Error finding user by email', { email, error: error.message });
      throw error;
    }
  }

  /**
   * Find user by verification token
   * @param {string} token - Verification token
   * @returns {Object|null} User record or null
   */
  async findByVerificationToken(token) {
    try {
      return await this.findOne({ email_verification_token: token });
    } catch (error) {
      this.logger.error('Error finding user by verification token', { error: error.message });
      throw error;
    }
  }

  /**
   * Find user by password reset token
   * @param {string} token - Password reset token
   * @returns {Object|null} User record or null
   */
  async findByPasswordResetToken(token) {
    try {
      const sql = `
        SELECT * FROM users 
        WHERE password_reset_token = $1 
        AND password_reset_expires > CURRENT_TIMESTAMP
      `;
      const result = await this.executeQuery(sql, [token]);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error('Error finding user by password reset token', { error: error.message });
      throw error;
    }
  }

  /**
   * Create a new user with validation
   * @param {Object} userData - User data
   * @returns {Object} Created user
   */
  async createUser(userData) {
    try {
      // Ensure email is lowercase
      const normalizedData = {
        ...userData,
        email: userData.email.toLowerCase(),
        created_at: new Date(),
        updated_at: new Date()
      };

      return await this.create(normalizedData);
    } catch (error) {
      this.logger.error('Error creating user', { email: userData.email, error: error.message });
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile update data
   * @returns {Object|null} Updated user
   */
  async updateProfile(userId, profileData) {
    try {
      // Remove sensitive fields that shouldn't be updated via profile
      const { password, email_verified, is_active, ...safeData } = profileData;
      
      return await this.update(userId, safeData);
    } catch (error) {
      this.logger.error('Error updating user profile', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Verify user email
   * @param {string} userId - User ID
   * @returns {Object|null} Updated user
   */
  async verifyEmail(userId) {
    try {
      return await this.update(userId, {
        email_verified: true,
        email_verified_at: new Date(),
        email_verification_token: null
      });
    } catch (error) {
      this.logger.error('Error verifying user email', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Update user password
   * @param {string} userId - User ID
   * @param {string} hashedPassword - New hashed password
   * @returns {Object|null} Updated user
   */
  async updatePassword(userId, hashedPassword) {
    try {
      return await this.update(userId, {
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
        password_changed_at: new Date()
      });
    } catch (error) {
      this.logger.error('Error updating user password', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Set password reset token
   * @param {string} userId - User ID
   * @param {string} token - Reset token
   * @param {Date} expiresAt - Token expiration
   * @returns {Object|null} Updated user
   */
  async setPasswordResetToken(userId, token, expiresAt) {
    try {
      return await this.update(userId, {
        password_reset_token: token,
        password_reset_expires: expiresAt
      });
    } catch (error) {
      this.logger.error('Error setting password reset token', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Update login attempt tracking
   * @param {string} userId - User ID
   * @param {boolean} successful - Whether login was successful
   * @param {string} ipAddress - IP address
   * @returns {Object|null} Updated user
   */
  async updateLoginAttempt(userId, successful, ipAddress) {
    try {
      if (successful) {
        return await this.update(userId, {
          last_login_at: new Date(),
          last_login_ip: ipAddress,
          failed_login_attempts: 0,
          account_locked_until: null
        });
      } else {
        const user = await this.findById(userId);
        if (!user) return null;

        const failedAttempts = (user.failed_login_attempts || 0) + 1;
        const maxAttempts = 5;
        
        const updateData = {
          failed_login_attempts: failedAttempts,
          last_failed_login_at: new Date(),
          last_failed_login_ip: ipAddress
        };

        // Lock account if max attempts reached
        if (failedAttempts >= maxAttempts) {
          updateData.account_locked_until = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        }

        return await this.update(userId, updateData);
      }
    } catch (error) {
      this.logger.error('Error updating login attempt', { userId, successful, error: error.message });
      throw error;
    }
  }

  /**
   * Enable 2FA for user
   * @param {string} userId - User ID
   * @param {string} secret - 2FA secret
   * @param {Array} backupCodes - Backup codes
   * @returns {Object|null} Updated user
   */
  async enable2FA(userId, secret, backupCodes) {
    try {
      return await this.update(userId, {
        two_factor_enabled: true,
        two_factor_secret: secret,
        two_factor_backup_codes: backupCodes,
        two_factor_enabled_at: new Date()
      });
    } catch (error) {
      this.logger.error('Error enabling 2FA', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Disable 2FA for user
   * @param {string} userId - User ID
   * @returns {Object|null} Updated user
   */
  async disable2FA(userId) {
    try {
      return await this.update(userId, {
        two_factor_enabled: false,
        two_factor_secret: null,
        two_factor_backup_codes: null,
        two_factor_enabled_at: null
      });
    } catch (error) {
      this.logger.error('Error disabling 2FA', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Use a 2FA backup code
   * @param {string} userId - User ID
   * @param {string} usedCode - Used backup code
   * @returns {Object|null} Updated user
   */
  async use2FABackupCode(userId, usedCode) {
    try {
      const user = await this.findById(userId);
      if (!user || !user.two_factor_backup_codes) return null;

      const backupCodes = user.two_factor_backup_codes.filter(code => code !== usedCode);
      
      return await this.update(userId, {
        two_factor_backup_codes: backupCodes
      });
    } catch (error) {
      this.logger.error('Error using 2FA backup code', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Get users by subscription tier
   * @param {string} tier - Subscription tier
   * @param {Object} options - Query options
   * @returns {Array} Users with specified tier
   */
  async findBySubscriptionTier(tier, options = {}) {
    try {
      return await this.findBy({ subscription_tier: tier }, options);
    } catch (error) {
      this.logger.error('Error finding users by subscription tier', { tier, error: error.message });
      throw error;
    }
  }

  /**
   * Get user statistics
   * @returns {Object} User statistics
   */
  async getUserStats() {
    try {
      const sql = `
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE email_verified = true) as verified_users,
          COUNT(*) FILTER (WHERE is_active = true) as active_users,
          COUNT(*) FILTER (WHERE two_factor_enabled = true) as users_with_2fa,
          COUNT(*) FILTER (WHERE subscription_tier = 'free') as free_users,
          COUNT(*) FILTER (WHERE subscription_tier = 'pro') as pro_users,
          COUNT(*) FILTER (WHERE subscription_tier = 'enterprise') as enterprise_users,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_30d,
          COUNT(*) FILTER (WHERE last_login_at >= CURRENT_DATE - INTERVAL '30 days') as active_users_30d
        FROM users
      `;
      
      const result = await this.executeQuery(sql);
      return result.rows[0];
    } catch (error) {
      this.logger.error('Error getting user statistics', { error: error.message });
      throw error;
    }
  }

  /**
   * Search users by name or email
   * @param {string} searchTerm - Search term
   * @param {Object} options - Query options
   * @returns {Array} Matching users
   */
  async searchUsers(searchTerm, options = {}) {
    try {
      const sql = `
        SELECT id, first_name, last_name, email, subscription_tier, created_at, last_login_at
        FROM users 
        WHERE (
          LOWER(first_name) LIKE LOWER($1) OR 
          LOWER(last_name) LIKE LOWER($1) OR 
          LOWER(email) LIKE LOWER($1) OR
          LOWER(CONCAT(first_name, ' ', last_name)) LIKE LOWER($1)
        )
        AND is_active = true
        ORDER BY 
          CASE WHEN email = LOWER($2) THEN 1 ELSE 2 END,
          last_login_at DESC NULLS LAST,
          created_at DESC
        LIMIT $3 OFFSET $4
      `;
      
      const searchPattern = `%${searchTerm}%`;
      const limit = options.limit || 50;
      const offset = options.offset || 0;
      
      const result = await this.executeQuery(sql, [searchPattern, searchTerm.toLowerCase(), limit, offset]);
      return result.rows;
    } catch (error) {
      this.logger.error('Error searching users', { searchTerm, error: error.message });
      throw error;
    }
  }

  /**
   * Get users with expiring trials
   * @param {number} daysUntilExpiry - Days until trial expires
   * @returns {Array} Users with expiring trials
   */
  async getUsersWithExpiringTrials(daysUntilExpiry = 3) {
    try {
      const sql = `
        SELECT u.*, s.trial_end
        FROM users u
        JOIN subscriptions s ON u.id = s.user_id
        WHERE s.status = 'trialing'
        AND s.trial_end BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '${daysUntilExpiry} days'
        ORDER BY s.trial_end ASC
      `;
      
      const result = await this.executeQuery(sql);
      return result.rows;
    } catch (error) {
      this.logger.error('Error getting users with expiring trials', { daysUntilExpiry, error: error.message });
      throw error;
    }
  }

  /**
   * Get inactive users
   * @param {number} daysSinceLastLogin - Days since last login
   * @returns {Array} Inactive users
   */
  async getInactiveUsers(daysSinceLastLogin = 30) {
    try {
      const sql = `
        SELECT id, first_name, last_name, email, last_login_at, created_at
        FROM users 
        WHERE is_active = true
        AND (
          last_login_at < CURRENT_TIMESTAMP - INTERVAL '${daysSinceLastLogin} days'
          OR last_login_at IS NULL
        )
        ORDER BY last_login_at ASC NULLS FIRST
      `;
      
      const result = await this.executeQuery(sql);
      return result.rows;
    } catch (error) {
      this.logger.error('Error getting inactive users', { daysSinceLastLogin, error: error.message });
      throw error;
    }
  }

  /**
   * Soft delete user account
   * @param {string} userId - User ID
   * @param {string} reason - Deletion reason
   * @returns {Object|null} Updated user
   */
  async deleteAccount(userId, reason = null) {
    try {
      return await this.update(userId, {
        is_active: false,
        deleted_at: new Date(),
        deletion_reason: reason,
        email: `deleted_${userId}@proofpix.com` // Anonymize email
      });
    } catch (error) {
      this.logger.error('Error deleting user account', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Get user activity summary
   * @param {string} userId - User ID
   * @returns {Object} User activity summary
   */
  async getUserActivitySummary(userId) {
    try {
      const sql = `
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.subscription_tier,
          u.created_at,
          u.last_login_at,
          u.email_verified,
          u.two_factor_enabled,
          COUNT(DISTINCT ut.id) FILTER (WHERE ut.created_at >= CURRENT_DATE - INTERVAL '30 days') as usage_last_30d,
          COUNT(DISTINCT f.id) FILTER (WHERE f.created_at >= CURRENT_DATE - INTERVAL '30 days') as files_uploaded_30d,
          COUNT(DISTINCT s.id) as active_sessions
        FROM users u
        LEFT JOIN usage_tracking ut ON u.id = ut.user_id
        LEFT JOIN files f ON u.id = f.user_id AND f.is_deleted = false
        LEFT JOIN sessions s ON u.id = s.user_id AND s.expires_at > CURRENT_TIMESTAMP
        WHERE u.id = $1
        GROUP BY u.id
      `;
      
      const result = await this.executeQuery(sql, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error('Error getting user activity summary', { userId, error: error.message });
      throw error;
    }
  }
}

module.exports = UserRepository; 