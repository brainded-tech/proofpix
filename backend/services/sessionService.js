const { query } = require('../config/database');
const redis = require('redis');
const { auditLog } = require('./auditService');
const winston = require('winston');

// Configure session logger
const sessionLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/sessions.log' })
  ]
});

// Redis client for session caching
let redisClient = null;

const initializeRedis = async () => {
  try {
    if (process.env.REDIS_URL) {
      redisClient = redis.createClient({
        url: process.env.REDIS_URL
      });

      redisClient.on('error', (err) => {
        sessionLogger.error('Redis Client Error', err);
      });

      redisClient.on('connect', () => {
        sessionLogger.info('Redis Client Connected');
      });

      await redisClient.connect();
    } else {
      sessionLogger.warn('Redis URL not configured, sessions will only be stored in database');
    }
  } catch (error) {
    sessionLogger.error('Failed to initialize Redis', error);
  }
};

// Initialize Redis on module load
initializeRedis();

/**
 * Create a new session
 * @param {Object} sessionData - Session data
 */
const createSession = async (sessionData) => {
  try {
    const {
      userId,
      sessionToken,
      refreshToken,
      ipAddress,
      userAgent,
      deviceType,
      browser,
      os,
      locationCountry,
      locationCity,
      expiresAt
    } = sessionData;

    // Store session in database
    const result = await query(`
      INSERT INTO sessions (
        user_id, session_token, refresh_token, ip_address, user_agent,
        device_type, browser, os, location_country, location_city, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      userId,
      sessionToken,
      refreshToken,
      ipAddress,
      userAgent,
      deviceType,
      browser,
      os,
      locationCountry,
      locationCity,
      expiresAt
    ]);

    const session = result.rows[0];

    // Cache session in Redis if available
    if (redisClient) {
      const sessionKey = `session:${sessionToken}`;
      const sessionValue = JSON.stringify({
        sessionId: session.id,
        userId: session.user_id,
        expiresAt: session.expires_at,
        ipAddress: session.ip_address,
        userAgent: session.user_agent
      });

      const ttl = Math.floor((new Date(expiresAt) - new Date()) / 1000);
      await redisClient.setEx(sessionKey, ttl, sessionValue);
    }

    sessionLogger.info('Session created', {
      sessionId: session.id,
      userId,
      ipAddress,
      deviceType,
      browser
    });

    return session;

  } catch (error) {
    sessionLogger.error('Failed to create session', error);
    throw error;
  }
};

/**
 * Get session by token
 * @param {string} sessionToken - Session token
 */
const getSession = async (sessionToken) => {
  try {
    // Try Redis first if available
    if (redisClient) {
      const sessionKey = `session:${sessionToken}`;
      const cachedSession = await redisClient.get(sessionKey);
      
      if (cachedSession) {
        const sessionData = JSON.parse(cachedSession);
        
        // Verify session is not expired
        if (new Date(sessionData.expiresAt) > new Date()) {
          return sessionData;
        } else {
          // Remove expired session from cache
          await redisClient.del(sessionKey);
        }
      }
    }

    // Fallback to database
    const result = await query(`
      SELECT * FROM sessions 
      WHERE session_token = $1 
        AND is_active = TRUE 
        AND expires_at > CURRENT_TIMESTAMP
    `, [sessionToken]);

    if (result.rows.length === 0) {
      return null;
    }

    const session = result.rows[0];

    // Update last activity
    await updateSessionActivity(session.id);

    return session;

  } catch (error) {
    sessionLogger.error('Failed to get session', error);
    throw error;
  }
};

/**
 * Update session activity
 * @param {string} sessionId - Session ID
 */
const updateSessionActivity = async (sessionId) => {
  try {
    await query(`
      UPDATE sessions 
      SET last_activity = CURRENT_TIMESTAMP 
      WHERE id = $1
    `, [sessionId]);

  } catch (error) {
    sessionLogger.error('Failed to update session activity', error);
  }
};

/**
 * Invalidate session
 * @param {string} sessionToken - Session token
 * @param {string} reason - Reason for invalidation
 */
const invalidateSession = async (sessionToken, reason = 'logout') => {
  try {
    // Remove from Redis if available
    if (redisClient) {
      const sessionKey = `session:${sessionToken}`;
      await redisClient.del(sessionKey);
    }

    // Mark as inactive in database
    const result = await query(`
      UPDATE sessions 
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE session_token = $1
      RETURNING user_id, id
    `, [sessionToken]);

    if (result.rows.length > 0) {
      const session = result.rows[0];
      
      await auditLog({
        userId: session.user_id,
        sessionId: session.id,
        eventType: 'session_invalidated',
        eventCategory: 'auth',
        eventDescription: `Session invalidated: ${reason}`,
        resourceType: 'session',
        resourceId: session.id,
        metadata: { reason }
      });

      sessionLogger.info('Session invalidated', {
        sessionId: session.id,
        userId: session.user_id,
        reason
      });
    }

    return true;

  } catch (error) {
    sessionLogger.error('Failed to invalidate session', error);
    throw error;
  }
};

/**
 * Invalidate all user sessions
 * @param {string} userId - User ID
 * @param {string} reason - Reason for invalidation
 */
const invalidateAllUserSessions = async (userId, reason = 'security') => {
  try {
    // Get all active sessions for user
    const result = await query(`
      SELECT session_token, id FROM sessions 
      WHERE user_id = $1 AND is_active = TRUE
    `, [userId]);

    // Remove from Redis if available
    if (redisClient && result.rows.length > 0) {
      const sessionKeys = result.rows.map(session => `session:${session.session_token}`);
      await redisClient.del(sessionKeys);
    }

    // Mark all as inactive in database
    await query(`
      UPDATE sessions 
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND is_active = TRUE
    `, [userId]);

    await auditLog({
      userId,
      eventType: 'all_sessions_invalidated',
      eventCategory: 'security',
      eventDescription: `All user sessions invalidated: ${reason}`,
      resourceType: 'user',
      resourceId: userId,
      metadata: { 
        reason,
        sessionCount: result.rows.length
      }
    });

    sessionLogger.info('All user sessions invalidated', {
      userId,
      sessionCount: result.rows.length,
      reason
    });

    return result.rows.length;

  } catch (error) {
    sessionLogger.error('Failed to invalidate all user sessions', error);
    throw error;
  }
};

/**
 * Clean up expired sessions
 */
const cleanupExpiredSessions = async () => {
  try {
    const result = await query(`
      DELETE FROM sessions 
      WHERE expires_at < CURRENT_TIMESTAMP 
        OR (is_active = FALSE AND updated_at < CURRENT_TIMESTAMP - INTERVAL '7 days')
    `);

    sessionLogger.info('Expired sessions cleaned up', {
      deletedCount: result.rowCount
    });

    return result.rowCount;

  } catch (error) {
    sessionLogger.error('Failed to cleanup expired sessions', error);
    throw error;
  }
};

/**
 * Get user sessions
 * @param {string} userId - User ID
 * @param {boolean} activeOnly - Only return active sessions
 */
const getUserSessions = async (userId, activeOnly = true) => {
  try {
    const whereClause = activeOnly 
      ? 'WHERE user_id = $1 AND is_active = TRUE AND expires_at > CURRENT_TIMESTAMP'
      : 'WHERE user_id = $1';

    const result = await query(`
      SELECT id, ip_address, user_agent, device_type, browser, os,
             location_country, location_city, created_at, last_activity,
             expires_at, is_active
      FROM sessions 
      ${whereClause}
      ORDER BY last_activity DESC
    `, [userId]);

    return result.rows;

  } catch (error) {
    sessionLogger.error('Failed to get user sessions', error);
    throw error;
  }
};

/**
 * Detect suspicious session activity
 * @param {string} userId - User ID
 */
const detectSuspiciousActivity = async (userId) => {
  try {
    // Multiple active sessions from different locations
    const locationResult = await query(`
      SELECT DISTINCT location_country, location_city, COUNT(*) as session_count
      FROM sessions 
      WHERE user_id = $1 
        AND is_active = TRUE 
        AND expires_at > CURRENT_TIMESTAMP
        AND location_country IS NOT NULL
      GROUP BY location_country, location_city
      HAVING COUNT(*) > 1
    `, [userId]);

    // Sessions from different devices/browsers
    const deviceResult = await query(`
      SELECT DISTINCT device_type, browser, os, COUNT(*) as session_count
      FROM sessions 
      WHERE user_id = $1 
        AND is_active = TRUE 
        AND expires_at > CURRENT_TIMESTAMP
      GROUP BY device_type, browser, os
    `, [userId]);

    const suspiciousFlags = [];

    if (locationResult.rows.length > 2) {
      suspiciousFlags.push('multiple_locations');
    }

    if (deviceResult.rows.length > 3) {
      suspiciousFlags.push('multiple_devices');
    }

    return {
      isSuspicious: suspiciousFlags.length > 0,
      flags: suspiciousFlags,
      locations: locationResult.rows,
      devices: deviceResult.rows
    };

  } catch (error) {
    sessionLogger.error('Failed to detect suspicious activity', error);
    return { isSuspicious: false, flags: [] };
  }
};

// Schedule cleanup of expired sessions every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

module.exports = {
  createSession,
  getSession,
  updateSessionActivity,
  invalidateSession,
  invalidateAllUserSessions,
  cleanupExpiredSessions,
  getUserSessions,
  detectSuspiciousActivity
}; 