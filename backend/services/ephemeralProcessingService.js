/**
 * Ephemeral Processing Service
 * Handles collaboration mode with temporary processing and automatic deletion
 */

const crypto = require('crypto');
const Redis = require('ioredis');
const { logger } = require('../config/database');
const { auditLog } = require('./auditService');

class EphemeralProcessingService {
  constructor() {
    // Redis client for ephemeral storage
    this.redis = new Redis(process.env.REDIS_URL || {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });

    // Configuration
    this.config = {
      maxSessionDuration: 24 * 60 * 60, // 24 hours in seconds
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'application/pdf'],
      encryptionAlgorithm: 'aes-256-gcm',
      compressionLevel: 6
    };

    // Active sessions tracking
    this.activeSessions = new Map();
    this.autoDeleteTimers = new Map();

    // Initialize cleanup scheduler
    this.initializeCleanupScheduler();
  }

  /**
   * Create ephemeral processing session
   */
  async createEphemeralSession(userId, options = {}) {
    try {
      const sessionId = this.generateSecureSessionId();
      const expiresAt = Date.now() + (this.config.maxSessionDuration * 1000);
      
      const session = {
        id: sessionId,
        userId,
        createdAt: Date.now(),
        expiresAt,
        mode: 'collaboration',
        encrypted: true,
        autoDelete: true,
        maxFiles: options.maxFiles || 10,
        processedFiles: 0,
        status: 'active',
        metadata: {
          userAgent: options.userAgent,
          ipAddress: options.ipAddress,
          teamId: options.teamId
        }
      };

      // Store session in Redis with TTL
      await this.redis.setex(
        `session:${sessionId}`,
        this.config.maxSessionDuration,
        JSON.stringify(session)
      );

      // Track in memory for quick access
      this.activeSessions.set(sessionId, session);

      // Schedule automatic deletion
      this.scheduleAutoDelete(sessionId);

      // Audit log
      await auditLog(userId, 'ephemeral_session_created', {
        sessionId,
        expiresAt: new Date(expiresAt),
        mode: 'collaboration'
      });

      logger.info(`Ephemeral session created: ${sessionId} for user ${userId}`);

      return {
        success: true,
        sessionId,
        expiresAt,
        maxFiles: session.maxFiles,
        config: {
          maxFileSize: this.config.maxFileSize,
          allowedFileTypes: this.config.allowedFileTypes,
          maxSessionDuration: this.config.maxSessionDuration
        }
      };
    } catch (error) {
      logger.error('Failed to create ephemeral session:', error);
      throw error;
    }
  }

  /**
   * Process file ephemerally
   */
  async processFileEphemerally(sessionId, file, options = {}) {
    try {
      // Validate session
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Invalid or expired session');
      }

      // Validate file
      this.validateFile(file);

      // Check session limits
      if (session.processedFiles >= session.maxFiles) {
        throw new Error('Session file limit exceeded');
      }

      // Generate file ID
      const fileId = this.generateSecureFileId();
      const encryptionKey = this.generateEncryptionKey();

      // Encrypt file data
      const encryptedData = await this.encryptFileData(file.buffer, encryptionKey);

      // Store encrypted file temporarily
      const fileKey = `file:${sessionId}:${fileId}`;
      await this.redis.setex(
        fileKey,
        this.config.maxSessionDuration,
        JSON.stringify({
          id: fileId,
          sessionId,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          encryptedData,
          encryptionKey: encryptionKey.toString('base64'),
          uploadedAt: Date.now(),
          processed: false
        })
      );

      // Process file (extract metadata, generate thumbnails, etc.)
      const processingResult = await this.performEphemeralProcessing(fileId, file, session);

      // Update session
      session.processedFiles++;
      session.lastActivity = Date.now();
      await this.updateSession(sessionId, session);

      // Store processing result temporarily
      const resultKey = `result:${sessionId}:${fileId}`;
      await this.redis.setex(
        resultKey,
        this.config.maxSessionDuration,
        JSON.stringify(processingResult)
      );

      // Audit log
      await auditLog(session.userId, 'ephemeral_file_processed', {
        sessionId,
        fileId,
        fileName: file.originalname,
        fileSize: file.size,
        ephemeral: true
      });

      logger.info(`File processed ephemerally: ${fileId} in session ${sessionId}`);

      return {
        success: true,
        fileId,
        sessionId,
        result: processingResult,
        expiresAt: session.expiresAt,
        ephemeral: true
      };
    } catch (error) {
      logger.error('Ephemeral file processing failed:', error);
      throw error;
    }
  }

  /**
   * Get ephemeral processing result
   */
  async getEphemeralResult(sessionId, fileId) {
    try {
      // Validate session
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Invalid or expired session');
      }

      // Get result
      const resultKey = `result:${sessionId}:${fileId}`;
      const resultData = await this.redis.get(resultKey);
      
      if (!resultData) {
        throw new Error('Result not found or expired');
      }

      const result = JSON.parse(resultData);

      // Update last access
      session.lastActivity = Date.now();
      await this.updateSession(sessionId, session);

      return {
        success: true,
        result,
        sessionId,
        fileId,
        expiresAt: session.expiresAt,
        ephemeral: true
      };
    } catch (error) {
      logger.error('Failed to get ephemeral result:', error);
      throw error;
    }
  }

  /**
   * Share ephemeral result temporarily
   */
  async createEphemeralShare(sessionId, fileId, options = {}) {
    try {
      // Validate session
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new Error('Invalid or expired session');
      }

      // Generate share token
      const shareToken = this.generateSecureShareToken();
      const shareExpiresAt = Math.min(
        Date.now() + (options.expiresInHours || 1) * 60 * 60 * 1000,
        session.expiresAt
      );

      // Create share record
      const shareData = {
        token: shareToken,
        sessionId,
        fileId,
        createdBy: session.userId,
        createdAt: Date.now(),
        expiresAt: shareExpiresAt,
        accessCount: 0,
        maxAccess: options.maxAccess || 10,
        requiresAuth: options.requiresAuth || false,
        allowedUsers: options.allowedUsers || []
      };

      // Store share temporarily
      const shareKey = `share:${shareToken}`;
      const shareTTL = Math.floor((shareExpiresAt - Date.now()) / 1000);
      await this.redis.setex(shareKey, shareTTL, JSON.stringify(shareData));

      // Audit log
      await auditLog(session.userId, 'ephemeral_share_created', {
        sessionId,
        fileId,
        shareToken,
        expiresAt: new Date(shareExpiresAt)
      });

      return {
        success: true,
        shareToken,
        shareUrl: `${process.env.FRONTEND_URL}/share/${shareToken}`,
        expiresAt: shareExpiresAt,
        ephemeral: true
      };
    } catch (error) {
      logger.error('Failed to create ephemeral share:', error);
      throw error;
    }
  }

  /**
   * Delete ephemeral session and all associated data
   */
  async deleteEphemeralSession(sessionId, userId = null) {
    try {
      // Get session for validation
      const session = await this.getSession(sessionId);
      if (!session) {
        return { success: true, message: 'Session already deleted' };
      }

      // Validate user permission
      if (userId && session.userId !== userId) {
        throw new Error('Unauthorized to delete session');
      }

      // Get all files in session
      const fileKeys = await this.redis.keys(`file:${sessionId}:*`);
      const resultKeys = await this.redis.keys(`result:${sessionId}:*`);
      const shareKeys = await this.redis.keys(`share:*`);

      // Delete all session data
      const keysToDelete = [
        `session:${sessionId}`,
        ...fileKeys,
        ...resultKeys
      ];

      // Delete shares that belong to this session
      for (const shareKey of shareKeys) {
        const shareData = await this.redis.get(shareKey);
        if (shareData) {
          const share = JSON.parse(shareData);
          if (share.sessionId === sessionId) {
            keysToDelete.push(shareKey);
          }
        }
      }

      // Batch delete
      if (keysToDelete.length > 0) {
        await this.redis.del(...keysToDelete);
      }

      // Clear from memory
      this.activeSessions.delete(sessionId);
      
      // Clear auto-delete timer
      const timer = this.autoDeleteTimers.get(sessionId);
      if (timer) {
        clearTimeout(timer);
        this.autoDeleteTimers.delete(sessionId);
      }

      // Audit log
      await auditLog(session.userId, 'ephemeral_session_deleted', {
        sessionId,
        filesDeleted: fileKeys.length,
        resultsDeleted: resultKeys.length,
        manual: userId !== null
      });

      logger.info(`Ephemeral session deleted: ${sessionId} (${keysToDelete.length} keys removed)`);

      return {
        success: true,
        sessionId,
        deletedKeys: keysToDelete.length,
        ephemeral: true
      };
    } catch (error) {
      logger.error('Failed to delete ephemeral session:', error);
      throw error;
    }
  }

  /**
   * Get session information
   */
  async getSession(sessionId) {
    try {
      // Try memory first
      if (this.activeSessions.has(sessionId)) {
        const session = this.activeSessions.get(sessionId);
        if (session.expiresAt > Date.now()) {
          return session;
        } else {
          // Expired, remove from memory
          this.activeSessions.delete(sessionId);
        }
      }

      // Try Redis
      const sessionData = await this.redis.get(`session:${sessionId}`);
      if (!sessionData) {
        return null;
      }

      const session = JSON.parse(sessionData);
      
      // Check if expired
      if (session.expiresAt <= Date.now()) {
        await this.deleteEphemeralSession(sessionId);
        return null;
      }

      // Update memory cache
      this.activeSessions.set(sessionId, session);
      return session;
    } catch (error) {
      logger.error('Failed to get session:', error);
      return null;
    }
  }

  /**
   * Update session data
   */
  async updateSession(sessionId, sessionData) {
    try {
      const ttl = Math.floor((sessionData.expiresAt - Date.now()) / 1000);
      if (ttl > 0) {
        await this.redis.setex(`session:${sessionId}`, ttl, JSON.stringify(sessionData));
        this.activeSessions.set(sessionId, sessionData);
      }
    } catch (error) {
      logger.error('Failed to update session:', error);
    }
  }

  /**
   * Perform ephemeral processing
   */
  async performEphemeralProcessing(fileId, file, session) {
    try {
      // This would integrate with existing processing services
      // but ensure no persistent storage
      
      const result = {
        fileId,
        sessionId: session.id,
        processedAt: Date.now(),
        metadata: {
          filename: file.originalname,
          size: file.size,
          type: file.mimetype,
          // Add EXIF extraction, thumbnail generation, etc.
        },
        ephemeral: true,
        expiresAt: session.expiresAt
      };

      return result;
    } catch (error) {
      logger.error('Ephemeral processing failed:', error);
      throw error;
    }
  }

  /**
   * Validate file for ephemeral processing
   */
  validateFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > this.config.maxFileSize) {
      throw new Error(`File too large. Maximum size: ${this.config.maxFileSize} bytes`);
    }

    if (!this.config.allowedFileTypes.includes(file.mimetype)) {
      throw new Error(`File type not allowed: ${file.mimetype}`);
    }
  }

  /**
   * Encrypt file data
   */
  async encryptFileData(buffer, key) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.config.encryptionAlgorithm, key);
      
      const encrypted = Buffer.concat([
        cipher.update(buffer),
        cipher.final()
      ]);

      return {
        data: encrypted.toString('base64'),
        iv: iv.toString('base64'),
        tag: cipher.getAuthTag().toString('base64')
      };
    } catch (error) {
      logger.error('File encryption failed:', error);
      throw error;
    }
  }

  /**
   * Schedule automatic deletion
   */
  scheduleAutoDelete(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const deleteIn = session.expiresAt - Date.now();
    if (deleteIn > 0) {
      const timer = setTimeout(() => {
        this.deleteEphemeralSession(sessionId);
      }, deleteIn);

      this.autoDeleteTimers.set(sessionId, timer);
    }
  }

  /**
   * Initialize cleanup scheduler
   */
  initializeCleanupScheduler() {
    // Run cleanup every hour
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 60 * 60 * 1000);
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions() {
    try {
      const sessionKeys = await this.redis.keys('session:*');
      let cleanedCount = 0;

      for (const key of sessionKeys) {
        const sessionData = await this.redis.get(key);
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.expiresAt <= Date.now()) {
            await this.deleteEphemeralSession(session.id);
            cleanedCount++;
          }
        }
      }

      if (cleanedCount > 0) {
        logger.info(`Cleaned up ${cleanedCount} expired ephemeral sessions`);
      }
    } catch (error) {
      logger.error('Cleanup failed:', error);
    }
  }

  /**
   * Generate secure session ID
   */
  generateSecureSessionId() {
    return 'eph_' + crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generate secure file ID
   */
  generateSecureFileId() {
    return 'file_' + crypto.randomBytes(12).toString('hex');
  }

  /**
   * Generate encryption key
   */
  generateEncryptionKey() {
    return crypto.randomBytes(32);
  }

  /**
   * Generate secure share token
   */
  generateSecureShareToken() {
    return 'share_' + crypto.randomBytes(20).toString('hex');
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      activeSessions: this.activeSessions.size,
      autoDeleteTimers: this.autoDeleteTimers.size,
      redisConnected: this.redis.status === 'ready',
      config: this.config,
      uptime: process.uptime()
    };
  }
}

// Export singleton instance
const ephemeralProcessingService = new EphemeralProcessingService();
module.exports = ephemeralProcessingService; 