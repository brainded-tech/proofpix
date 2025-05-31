const crypto = require('crypto');
const { logger } = require('../config/database');
const { auditLog } = require('./auditService');
const redisConfig = require('../config/redis');
const db = require('../config/database');

class ApiKeyService {
  constructor() {
    this.keyPrefix = 'pk_';
    this.secretPrefix = 'sk_';
    this.defaultPermissions = [
      'files:read',
      'files:upload',
      'exif:extract'
    ];
    this.allPermissions = [
      'files:read',
      'files:write',
      'files:upload',
      'files:delete',
      'exif:extract',
      'exif:read',
      'thumbnails:generate',
      'thumbnails:read',
      'batch:process',
      'webhooks:manage',
      'analytics:read',
      'admin:read'
    ];
  }

  // API Key Generation
  async generateApiKey(userId, keyName, options = {}) {
    try {
      // Generate API key and secret
      const apiKey = this.generateKey(this.keyPrefix);
      const apiSecret = this.generateKey(this.secretPrefix);
      const hashedSecret = this.hashSecret(apiSecret);

      // Set permissions
      const permissions = options.permissions || this.defaultPermissions;
      this.validatePermissions(permissions);

      // Set rate limits
      const rateLimits = {
        perMinute: options.rateLimitPerMinute || 60,
        perHour: options.rateLimitPerHour || 1000,
        perDay: options.rateLimitPerDay || 10000
      };

      // Create API key record
      const result = await db.query(`
        INSERT INTO api_keys (
          user_id, key_name, api_key, api_secret, permissions,
          rate_limit_per_minute, rate_limit_per_hour, rate_limit_per_day,
          ip_whitelist, webhook_url, webhook_secret, expires_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, api_key, created_at
      `, [
        userId,
        keyName,
        apiKey,
        hashedSecret,
        JSON.stringify(permissions),
        rateLimits.perMinute,
        rateLimits.perHour,
        rateLimits.perDay,
        options.ipWhitelist || null,
        options.webhookUrl || null,
        options.webhookSecret || null,
        options.expiresAt || null
      ]);

      await auditLog(userId, 'api_key_created', {
        apiKeyId: result.rows[0].id,
        keyName,
        permissions,
        rateLimits
      });

      return {
        success: true,
        apiKey: {
          id: result.rows[0].id,
          key: apiKey,
          secret: apiSecret, // Only returned once
          name: keyName,
          permissions,
          rateLimits,
          createdAt: result.rows[0].created_at
        }
      };
    } catch (error) {
      logger.error('API key generation failed:', error);
      throw error;
    }
  }

  generateKey(prefix) {
    const randomBytes = crypto.randomBytes(32);
    const key = randomBytes.toString('base64')
      .replace(/[+/=]/g, '')
      .substring(0, 32);
    return `${prefix}${key}`;
  }

  hashSecret(secret) {
    return crypto.createHash('sha256').update(secret).digest('hex');
  }

  validatePermissions(permissions) {
    for (const permission of permissions) {
      if (!this.allPermissions.includes(permission)) {
        throw new Error(`Invalid permission: ${permission}`);
      }
    }
  }

  // API Key Authentication
  async authenticateApiKey(apiKey, apiSecret) {
    try {
      if (!apiKey || !apiSecret) {
        return {
          valid: false,
          error: 'API key and secret are required'
        };
      }

      // Get API key from database
      const result = await db.query(`
        SELECT ak.*, u.id as user_id, u.email, u.name
        FROM api_keys ak
        JOIN users u ON ak.user_id = u.id
        WHERE ak.api_key = $1 AND ak.is_active = true
      `, [apiKey]);

      if (result.rows.length === 0) {
        return {
          valid: false,
          error: 'Invalid API key'
        };
      }

      const keyRecord = result.rows[0];

      // Check if key has expired
      if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
        return {
          valid: false,
          error: 'API key has expired'
        };
      }

      // Verify secret
      const hashedSecret = this.hashSecret(apiSecret);
      if (keyRecord.api_secret !== hashedSecret) {
        await auditLog(keyRecord.user_id, 'api_key_auth_failed', {
          apiKeyId: keyRecord.id,
          reason: 'Invalid secret'
        });

        return {
          valid: false,
          error: 'Invalid API secret'
        };
      }

      // Update last used timestamp
      await this.updateLastUsed(keyRecord.id);

      return {
        valid: true,
        apiKey: {
          id: keyRecord.id,
          userId: keyRecord.user_id,
          keyName: keyRecord.key_name,
          permissions: keyRecord.permissions,
          rateLimits: {
            perMinute: keyRecord.rate_limit_per_minute,
            perHour: keyRecord.rate_limit_per_hour,
            perDay: keyRecord.rate_limit_per_day
          },
          ipWhitelist: keyRecord.ip_whitelist,
          webhookUrl: keyRecord.webhook_url
        },
        user: {
          id: keyRecord.user_id,
          email: keyRecord.email,
          name: keyRecord.name
        }
      };
    } catch (error) {
      logger.error('API key authentication failed:', error);
      return {
        valid: false,
        error: 'Authentication failed'
      };
    }
  }

  async updateLastUsed(apiKeyId) {
    try {
      await db.query(`
        UPDATE api_keys 
        SET last_used_at = NOW(), usage_count = usage_count + 1
        WHERE id = $1
      `, [apiKeyId]);
    } catch (error) {
      logger.error('Failed to update API key last used:', error);
    }
  }

  // Rate Limiting
  async checkRateLimit(apiKeyId, rateLimits, ipAddress) {
    try {
      const now = new Date();
      const checks = [
        {
          key: `rate_limit:${apiKeyId}:minute:${now.getMinutes()}`,
          limit: rateLimits.perMinute,
          window: 60,
          period: 'minute'
        },
        {
          key: `rate_limit:${apiKeyId}:hour:${now.getHours()}`,
          limit: rateLimits.perHour,
          window: 3600,
          period: 'hour'
        },
        {
          key: `rate_limit:${apiKeyId}:day:${now.getDate()}`,
          limit: rateLimits.perDay,
          window: 86400,
          period: 'day'
        }
      ];

      for (const check of checks) {
        const result = await redisConfig.checkRateLimit(check.key, check.limit, check.window);
        
        if (result.count > check.limit) {
          await auditLog(null, 'api_rate_limit_exceeded', {
            apiKeyId,
            period: check.period,
            limit: check.limit,
            count: result.count,
            ipAddress
          });

          return {
            allowed: false,
            period: check.period,
            limit: check.limit,
            remaining: 0,
            resetTime: result.resetTime
          };
        }
      }

      return {
        allowed: true,
        remaining: {
          minute: Math.max(0, rateLimits.perMinute - checks[0].count),
          hour: Math.max(0, rateLimits.perHour - checks[1].count),
          day: Math.max(0, rateLimits.perDay - checks[2].count)
        }
      };
    } catch (error) {
      logger.error('Rate limit check failed:', error);
      // Fail open for rate limiting errors
      return { allowed: true };
    }
  }

  // IP Whitelist Check
  async checkIpWhitelist(apiKeyId, ipAddress, whitelist) {
    try {
      if (!whitelist || whitelist.length === 0) {
        return { allowed: true };
      }

      const isAllowed = whitelist.some(allowedIp => {
        // Support CIDR notation and exact matches
        if (allowedIp.includes('/')) {
          return this.isIpInCidr(ipAddress, allowedIp);
        }
        return ipAddress === allowedIp;
      });

      if (!isAllowed) {
        await auditLog(null, 'api_ip_whitelist_violation', {
          apiKeyId,
          ipAddress,
          whitelist
        });
      }

      return { allowed: isAllowed };
    } catch (error) {
      logger.error('IP whitelist check failed:', error);
      return { allowed: true }; // Fail open
    }
  }

  isIpInCidr(ip, cidr) {
    // Simple CIDR check implementation
    // In production, use a proper CIDR library
    const [network, prefixLength] = cidr.split('/');
    const ipParts = ip.split('.').map(Number);
    const networkParts = network.split('.').map(Number);
    
    const mask = (0xffffffff << (32 - parseInt(prefixLength))) >>> 0;
    const ipInt = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
    const networkInt = (networkParts[0] << 24) + (networkParts[1] << 16) + (networkParts[2] << 8) + networkParts[3];
    
    return (ipInt & mask) === (networkInt & mask);
  }

  // Permission Checking
  hasPermission(apiKeyPermissions, requiredPermission) {
    return apiKeyPermissions.includes(requiredPermission) || 
           apiKeyPermissions.includes('admin:read');
  }

  // Usage Tracking
  async trackApiUsage(apiKeyId, endpoint, method, statusCode, responseTime, requestSize, responseSize, ipAddress, userAgent) {
    try {
      await db.query(`
        INSERT INTO api_usage (
          api_key_id, endpoint, method, status_code, response_time_ms,
          request_size, response_size, ip_address, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        apiKeyId,
        endpoint,
        method,
        statusCode,
        responseTime,
        requestSize,
        responseSize,
        ipAddress,
        userAgent
      ]);
    } catch (error) {
      logger.error('Failed to track API usage:', error);
    }
  }

  // API Key Management
  async getUserApiKeys(userId) {
    try {
      const result = await db.query(`
        SELECT id, key_name, api_key, permissions, rate_limit_per_minute,
               rate_limit_per_hour, rate_limit_per_day, is_active, last_used_at,
               usage_count, created_at, expires_at
        FROM api_keys
        WHERE user_id = $1
        ORDER BY created_at DESC
      `, [userId]);

      return result.rows.map(key => ({
        ...key,
        api_key: key.api_key.substring(0, 8) + '...' // Mask the key
      }));
    } catch (error) {
      logger.error('Failed to get user API keys:', error);
      throw error;
    }
  }

  async updateApiKey(apiKeyId, userId, updates) {
    try {
      const allowedUpdates = ['key_name', 'permissions', 'rate_limit_per_minute', 
                             'rate_limit_per_hour', 'rate_limit_per_day', 'ip_whitelist',
                             'webhook_url', 'webhook_secret', 'expires_at'];
      
      const updateFields = [];
      const updateValues = [];
      let paramCount = 0;

      for (const [field, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(field)) {
          updateFields.push(`${field} = $${++paramCount}`);
          updateValues.push(field === 'permissions' ? JSON.stringify(value) : value);
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(apiKeyId, userId);

      const query = `
        UPDATE api_keys 
        SET ${updateFields.join(', ')}
        WHERE id = $${++paramCount} AND user_id = $${++paramCount}
        RETURNING *
      `;

      const result = await db.query(query, updateValues);

      if (result.rows.length === 0) {
        throw new Error('API key not found or access denied');
      }

      await auditLog(userId, 'api_key_updated', {
        apiKeyId,
        updates: Object.keys(updates)
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Failed to update API key:', error);
      throw error;
    }
  }

  async deactivateApiKey(apiKeyId, userId) {
    try {
      const result = await db.query(`
        UPDATE api_keys 
        SET is_active = false, updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING key_name
      `, [apiKeyId, userId]);

      if (result.rows.length === 0) {
        throw new Error('API key not found or access denied');
      }

      await auditLog(userId, 'api_key_deactivated', {
        apiKeyId,
        keyName: result.rows[0].key_name
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to deactivate API key:', error);
      throw error;
    }
  }

  async deleteApiKey(apiKeyId, userId) {
    try {
      const result = await db.query(`
        DELETE FROM api_keys 
        WHERE id = $1 AND user_id = $2
        RETURNING key_name
      `, [apiKeyId, userId]);

      if (result.rows.length === 0) {
        throw new Error('API key not found or access denied');
      }

      await auditLog(userId, 'api_key_deleted', {
        apiKeyId,
        keyName: result.rows[0].key_name
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to delete API key:', error);
      throw error;
    }
  }

  // Analytics
  async getApiKeyAnalytics(apiKeyId, userId, startDate, endDate) {
    try {
      const usageStats = await db.query(`
        SELECT 
          endpoint,
          method,
          COUNT(*) as request_count,
          AVG(response_time_ms) as avg_response_time,
          COUNT(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 END) as success_count,
          COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count
        FROM api_usage au
        JOIN api_keys ak ON au.api_key_id = ak.id
        WHERE ak.id = $1 AND ak.user_id = $2 
        AND au.created_at BETWEEN $3 AND $4
        GROUP BY endpoint, method
        ORDER BY request_count DESC
      `, [apiKeyId, userId, startDate, endDate]);

      const dailyUsage = await db.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as request_count,
          AVG(response_time_ms) as avg_response_time
        FROM api_usage au
        JOIN api_keys ak ON au.api_key_id = ak.id
        WHERE ak.id = $1 AND ak.user_id = $2 
        AND au.created_at BETWEEN $3 AND $4
        GROUP BY DATE(created_at)
        ORDER BY date
      `, [apiKeyId, userId, startDate, endDate]);

      const statusCodes = await db.query(`
        SELECT 
          status_code,
          COUNT(*) as count
        FROM api_usage au
        JOIN api_keys ak ON au.api_key_id = ak.id
        WHERE ak.id = $1 AND ak.user_id = $2 
        AND au.created_at BETWEEN $3 AND $4
        GROUP BY status_code
        ORDER BY count DESC
      `, [apiKeyId, userId, startDate, endDate]);

      return {
        usageByEndpoint: usageStats.rows,
        dailyUsage: dailyUsage.rows,
        statusCodes: statusCodes.rows,
        period: { startDate, endDate }
      };
    } catch (error) {
      logger.error('Failed to get API key analytics:', error);
      throw error;
    }
  }

  async getGlobalApiAnalytics(startDate, endDate) {
    try {
      const totalRequests = await db.query(`
        SELECT COUNT(*) as total_requests
        FROM api_usage
        WHERE created_at BETWEEN $1 AND $2
      `, [startDate, endDate]);

      const topEndpoints = await db.query(`
        SELECT 
          endpoint,
          COUNT(*) as request_count,
          AVG(response_time_ms) as avg_response_time
        FROM api_usage
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY endpoint
        ORDER BY request_count DESC
        LIMIT 10
      `, [startDate, endDate]);

      const topApiKeys = await db.query(`
        SELECT 
          ak.key_name,
          ak.api_key,
          u.email,
          COUNT(au.*) as request_count
        FROM api_usage au
        JOIN api_keys ak ON au.api_key_id = ak.id
        JOIN users u ON ak.user_id = u.id
        WHERE au.created_at BETWEEN $1 AND $2
        GROUP BY ak.id, ak.key_name, ak.api_key, u.email
        ORDER BY request_count DESC
        LIMIT 10
      `, [startDate, endDate]);

      return {
        totalRequests: parseInt(totalRequests.rows[0].total_requests),
        topEndpoints: topEndpoints.rows,
        topApiKeys: topApiKeys.rows.map(key => ({
          ...key,
          api_key: key.api_key.substring(0, 8) + '...'
        })),
        period: { startDate, endDate }
      };
    } catch (error) {
      logger.error('Failed to get global API analytics:', error);
      throw error;
    }
  }
}

const apiKeyService = new ApiKeyService();

module.exports = apiKeyService; 