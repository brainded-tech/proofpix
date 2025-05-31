/**
 * Security Service - Enterprise Security & Compliance
 * Handles advanced security features, compliance monitoring, and threat detection
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { logger } = require('../config/database');
const cacheService = require('./cacheService');

class SecurityService {
  constructor() {
    this.config = {
      // Password policy
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        preventReuse: 5, // Last 5 passwords
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        lockoutThreshold: 5,
        lockoutDuration: 30 * 60 * 1000 // 30 minutes
      },
      
      // Session security
      sessionSecurity: {
        maxConcurrentSessions: 3,
        sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
        requireReauth: 24 * 60 * 60 * 1000, // 24 hours
        ipValidation: true,
        deviceFingerprinting: true
      },
      
      // Encryption settings
      encryption: {
        algorithm: 'aes-256-gcm',
        keyDerivation: 'pbkdf2',
        iterations: 100000,
        saltLength: 32,
        ivLength: 16,
        tagLength: 16
      },
      
      // Compliance settings
      compliance: {
        auditRetention: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
        dataRetention: 5 * 365 * 24 * 60 * 60 * 1000, // 5 years
        enableGDPR: true,
        enableHIPAA: true,
        enableSOX: true,
        enablePCI: false
      },
      
      // Threat detection
      threatDetection: {
        enableBruteForceProtection: true,
        enableAnomalyDetection: true,
        enableGeoBlocking: false,
        suspiciousActivityThreshold: 10,
        alertThreshold: 5
      }
    };
    
    // Security metrics
    this.metrics = {
      loginAttempts: 0,
      failedLogins: 0,
      blockedIPs: new Set(),
      suspiciousActivities: 0,
      securityAlerts: 0
    };
    
    // Initialize security monitoring
    this.initializeSecurityMonitoring();
  }

  /**
   * Initialize security monitoring and cleanup
   */
  initializeSecurityMonitoring() {
    // Clean up expired security data every hour
    setInterval(() => {
      this.cleanupExpiredSecurityData();
    }, 60 * 60 * 1000);

    // Generate security reports every 24 hours
    setInterval(() => {
      this.generateSecurityReport();
    }, 24 * 60 * 60 * 1000);

    // Monitor for suspicious activities every 5 minutes
    setInterval(() => {
      this.monitorSuspiciousActivities();
    }, 5 * 60 * 1000);
  }

  /**
   * Validate password against security policy
   */
  validatePassword(password, userHistory = []) {
    const policy = this.config.passwordPolicy;
    const errors = [];

    // Length check
    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
    }

    // Character requirements
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check against previous passwords
    if (userHistory.length > 0) {
      for (const oldPassword of userHistory.slice(-policy.preventReuse)) {
        if (bcrypt.compareSync(password, oldPassword)) {
          errors.push(`Password cannot be one of your last ${policy.preventReuse} passwords`);
          break;
        }
      }
    }

    // Common password check (simplified)
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890'
    ];
    
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      errors.push('Password cannot contain common words or patterns');
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  /**
   * Calculate password strength score
   */
  calculatePasswordStrength(password) {
    let score = 0;
    
    // Length bonus
    score += Math.min(password.length * 2, 20);
    
    // Character variety
    if (/[a-z]/.test(password)) score += 5;
    if (/[A-Z]/.test(password)) score += 5;
    if (/\d/.test(password)) score += 5;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;
    
    // Patterns (negative points)
    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 10; // Sequential patterns
    
    // Normalize to 0-100 scale
    score = Math.max(0, Math.min(100, score));
    
    if (score >= 80) return 'very-strong';
    if (score >= 60) return 'strong';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'weak';
    return 'very-weak';
  }

  /**
   * Hash password with salt
   */
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Encrypt sensitive data
   */
  encryptData(data, key = null) {
    try {
      const config = this.config.encryption;
      const encryptionKey = key || this.deriveKey(process.env.ENCRYPTION_MASTER_KEY || 'default-key');
      
      const iv = crypto.randomBytes(config.ivLength);
      const cipher = crypto.createCipher(config.algorithm, encryptionKey);
      cipher.setAAD(Buffer.from('ProofPix-Enterprise'));
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: config.algorithm
      };

    } catch (error) {
      logger.error('Data encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData, key = null) {
    try {
      const config = this.config.encryption;
      const encryptionKey = key || this.deriveKey(process.env.ENCRYPTION_MASTER_KEY || 'default-key');
      
      const decipher = crypto.createDecipher(encryptedData.algorithm, encryptionKey);
      decipher.setAAD(Buffer.from('ProofPix-Enterprise'));
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);

    } catch (error) {
      logger.error('Data decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Derive encryption key from master key
   */
  deriveKey(masterKey, salt = null) {
    const config = this.config.encryption;
    const keySalt = salt || crypto.randomBytes(config.saltLength);
    
    return crypto.pbkdf2Sync(
      masterKey,
      keySalt,
      config.iterations,
      32, // 256 bits
      'sha256'
    );
  }

  /**
   * Record security event for audit trail
   */
  async recordSecurityEvent(event) {
    try {
      const securityEvent = {
        id: this.generateSecureToken(16),
        timestamp: Date.now(),
        type: event.type,
        severity: event.severity || 'info',
        userId: event.userId || null,
        ipAddress: event.ipAddress || null,
        userAgent: event.userAgent || null,
        details: event.details || {},
        source: event.source || 'system'
      };

      // Store in cache for quick access
      await cacheService.set(
        `security:event:${securityEvent.id}`,
        securityEvent,
        { ttl: 24 * 60 * 60 } // 24 hours
      );

      // Add to audit trail
      await cacheService.set(
        `audit:${Date.now()}:${securityEvent.id}`,
        securityEvent,
        { ttl: this.config.compliance.auditRetention / 1000 }
      );

      // Check for security alerts
      await this.checkSecurityAlerts(securityEvent);

      logger.info('Security event recorded:', {
        id: securityEvent.id,
        type: securityEvent.type,
        severity: securityEvent.severity
      });

      return securityEvent.id;

    } catch (error) {
      logger.error('Failed to record security event:', error);
      return null;
    }
  }

  /**
   * Check for security alerts based on events
   */
  async checkSecurityAlerts(event) {
    try {
      const alertConditions = [
        {
          type: 'multiple_failed_logins',
          condition: event.type === 'login_failed',
          threshold: 5,
          timeWindow: 15 * 60 * 1000 // 15 minutes
        },
        {
          type: 'suspicious_ip_activity',
          condition: event.type === 'suspicious_activity',
          threshold: 3,
          timeWindow: 60 * 60 * 1000 // 1 hour
        },
        {
          type: 'privilege_escalation',
          condition: event.type === 'permission_change',
          threshold: 1,
          timeWindow: 5 * 60 * 1000 // 5 minutes
        }
      ];

      for (const alertCondition of alertConditions) {
        if (alertCondition.condition) {
          await this.evaluateSecurityAlert(event, alertCondition);
        }
      }

    } catch (error) {
      logger.error('Failed to check security alerts:', error);
    }
  }

  /**
   * Evaluate and trigger security alerts
   */
  async evaluateSecurityAlert(event, condition) {
    try {
      const cacheKey = `security:alert:${condition.type}:${event.ipAddress || event.userId}`;
      const recentEvents = await cacheService.get(cacheKey) || [];
      
      // Add current event
      recentEvents.push({
        timestamp: event.timestamp,
        details: event.details
      });

      // Filter events within time window
      const cutoff = Date.now() - condition.timeWindow;
      const relevantEvents = recentEvents.filter(e => e.timestamp > cutoff);

      // Update cache
      await cacheService.set(cacheKey, relevantEvents, { ttl: condition.timeWindow / 1000 });

      // Check if threshold is exceeded
      if (relevantEvents.length >= condition.threshold) {
        await this.triggerSecurityAlert({
          type: condition.type,
          severity: 'high',
          events: relevantEvents,
          target: event.ipAddress || event.userId,
          details: {
            threshold: condition.threshold,
            eventCount: relevantEvents.length,
            timeWindow: condition.timeWindow
          }
        });
      }

    } catch (error) {
      logger.error('Failed to evaluate security alert:', error);
    }
  }

  /**
   * Trigger security alert
   */
  async triggerSecurityAlert(alert) {
    try {
      const securityAlert = {
        id: this.generateSecureToken(16),
        timestamp: Date.now(),
        type: alert.type,
        severity: alert.severity,
        target: alert.target,
        details: alert.details,
        events: alert.events,
        status: 'active',
        acknowledged: false
      };

      // Store alert
      await cacheService.set(
        `security:alert:${securityAlert.id}`,
        securityAlert,
        { ttl: 7 * 24 * 60 * 60 } // 7 days
      );

      // Update metrics
      this.metrics.securityAlerts++;

      // Log critical alert
      logger.warn('Security alert triggered:', {
        id: securityAlert.id,
        type: securityAlert.type,
        severity: securityAlert.severity,
        target: securityAlert.target
      });

      // TODO: Integrate with notification system (email, Slack, etc.)
      
      return securityAlert.id;

    } catch (error) {
      logger.error('Failed to trigger security alert:', error);
      return null;
    }
  }

  /**
   * Validate session security
   */
  async validateSession(sessionToken, request) {
    try {
      // Decode session token
      const session = jwt.verify(sessionToken, process.env.JWT_SECRET);
      
      // Check session expiry
      if (Date.now() > session.exp * 1000) {
        await this.recordSecurityEvent({
          type: 'session_expired',
          severity: 'info',
          userId: session.userId,
          ipAddress: request.ip,
          details: { sessionId: session.jti }
        });
        return { valid: false, reason: 'session_expired' };
      }

      // IP validation (if enabled)
      if (this.config.sessionSecurity.ipValidation && session.ip !== request.ip) {
        await this.recordSecurityEvent({
          type: 'session_ip_mismatch',
          severity: 'medium',
          userId: session.userId,
          ipAddress: request.ip,
          details: { 
            sessionIp: session.ip,
            requestIp: request.ip,
            sessionId: session.jti
          }
        });
        return { valid: false, reason: 'ip_mismatch' };
      }

      // Check for concurrent sessions
      const activeSessions = await this.getActiveSessions(session.userId);
      if (activeSessions.length > this.config.sessionSecurity.maxConcurrentSessions) {
        await this.recordSecurityEvent({
          type: 'excessive_concurrent_sessions',
          severity: 'medium',
          userId: session.userId,
          ipAddress: request.ip,
          details: { 
            activeSessionCount: activeSessions.length,
            maxAllowed: this.config.sessionSecurity.maxConcurrentSessions
          }
        });
      }

      return { valid: true, session };

    } catch (error) {
      await this.recordSecurityEvent({
        type: 'invalid_session_token',
        severity: 'medium',
        ipAddress: request.ip,
        details: { error: error.message }
      });
      return { valid: false, reason: 'invalid_token' };
    }
  }

  /**
   * Get active sessions for user
   */
  async getActiveSessions(userId) {
    try {
      const sessionKeys = await cacheService.redis.keys(`session:${userId}:*`);
      const sessions = [];
      
      for (const key of sessionKeys) {
        const session = await cacheService.get(key);
        if (session && session.exp * 1000 > Date.now()) {
          sessions.push(session);
        }
      }
      
      return sessions;

    } catch (error) {
      logger.error('Failed to get active sessions:', error);
      return [];
    }
  }

  /**
   * Revoke user session
   */
  async revokeSession(sessionId, reason = 'manual') {
    try {
      await cacheService.delete(`session:${sessionId}`);
      
      await this.recordSecurityEvent({
        type: 'session_revoked',
        severity: 'info',
        details: { sessionId, reason }
      });

      return true;

    } catch (error) {
      logger.error('Failed to revoke session:', error);
      return false;
    }
  }

  /**
   * Check for brute force attacks
   */
  async checkBruteForce(identifier, type = 'login') {
    try {
      if (!this.config.threatDetection.enableBruteForceProtection) {
        return { blocked: false };
      }

      const cacheKey = `bruteforce:${type}:${identifier}`;
      const attempts = await cacheService.get(cacheKey) || [];
      
      // Clean old attempts (older than 1 hour)
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const recentAttempts = attempts.filter(attempt => attempt.timestamp > oneHourAgo);
      
      // Check if blocked
      const policy = this.config.passwordPolicy;
      if (recentAttempts.length >= policy.lockoutThreshold) {
        const lastAttempt = recentAttempts[recentAttempts.length - 1];
        const lockoutEnd = lastAttempt.timestamp + policy.lockoutDuration;
        
        if (Date.now() < lockoutEnd) {
          return {
            blocked: true,
            reason: 'brute_force_protection',
            lockoutEnd,
            attemptCount: recentAttempts.length
          };
        }
      }

      return { blocked: false, attemptCount: recentAttempts.length };

    } catch (error) {
      logger.error('Failed to check brute force:', error);
      return { blocked: false };
    }
  }

  /**
   * Record failed attempt
   */
  async recordFailedAttempt(identifier, type = 'login', details = {}) {
    try {
      const cacheKey = `bruteforce:${type}:${identifier}`;
      const attempts = await cacheService.get(cacheKey) || [];
      
      attempts.push({
        timestamp: Date.now(),
        details
      });

      // Keep only last 24 hours of attempts
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const recentAttempts = attempts.filter(attempt => attempt.timestamp > oneDayAgo);
      
      await cacheService.set(cacheKey, recentAttempts, { ttl: 24 * 60 * 60 });

      // Update metrics
      this.metrics.failedLogins++;

      return recentAttempts.length;

    } catch (error) {
      logger.error('Failed to record failed attempt:', error);
      return 0;
    }
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(startDate, endDate) {
    try {
      const report = {
        id: this.generateSecureToken(16),
        timestamp: Date.now(),
        period: { startDate, endDate },
        compliance: {},
        summary: {},
        recommendations: []
      };

      // GDPR Compliance
      if (this.config.compliance.enableGDPR) {
        report.compliance.gdpr = await this.generateGDPRReport(startDate, endDate);
      }

      // HIPAA Compliance
      if (this.config.compliance.enableHIPAA) {
        report.compliance.hipaa = await this.generateHIPAAReport(startDate, endDate);
      }

      // SOX Compliance
      if (this.config.compliance.enableSOX) {
        report.compliance.sox = await this.generateSOXReport(startDate, endDate);
      }

      // Security metrics summary
      report.summary = {
        totalSecurityEvents: await this.getSecurityEventCount(startDate, endDate),
        securityAlerts: await this.getSecurityAlertCount(startDate, endDate),
        failedLogins: this.metrics.failedLogins,
        blockedIPs: this.metrics.blockedIPs.size,
        passwordPolicyViolations: await this.getPasswordPolicyViolations(startDate, endDate)
      };

      // Generate recommendations
      report.recommendations = await this.generateSecurityRecommendations(report);

      return report;

    } catch (error) {
      logger.error('Failed to generate compliance report:', error);
      return null;
    }
  }

  /**
   * Generate GDPR compliance report
   */
  async generateGDPRReport(startDate, endDate) {
    return {
      dataProcessingActivities: await this.getDataProcessingActivities(startDate, endDate),
      dataSubjectRequests: await this.getDataSubjectRequests(startDate, endDate),
      dataBreaches: await this.getDataBreaches(startDate, endDate),
      consentManagement: await this.getConsentManagement(startDate, endDate),
      dataRetentionCompliance: await this.checkDataRetentionCompliance()
    };
  }

  /**
   * Generate HIPAA compliance report
   */
  async generateHIPAAReport(startDate, endDate) {
    return {
      accessControls: await this.getAccessControlAudit(startDate, endDate),
      auditLogs: await this.getAuditLogCompliance(startDate, endDate),
      encryptionCompliance: await this.getEncryptionCompliance(),
      incidentReports: await this.getSecurityIncidents(startDate, endDate),
      businessAssociateAgreements: await this.getBAAAudit()
    };
  }

  /**
   * Generate SOX compliance report
   */
  async generateSOXReport(startDate, endDate) {
    return {
      accessManagement: await this.getAccessManagementAudit(startDate, endDate),
      changeManagement: await this.getChangeManagementAudit(startDate, endDate),
      dataIntegrity: await this.getDataIntegrityAudit(startDate, endDate),
      systemControls: await this.getSystemControlsAudit(startDate, endDate)
    };
  }

  /**
   * Clean up expired security data
   */
  async cleanupExpiredSecurityData() {
    try {
      const now = Date.now();
      const retentionPeriod = this.config.compliance.auditRetention;
      const cutoff = now - retentionPeriod;

      // Clean up old audit logs
      const auditKeys = await cacheService.redis.keys('audit:*');
      for (const key of auditKeys) {
        const timestamp = parseInt(key.split(':')[1]);
        if (timestamp < cutoff) {
          await cacheService.delete(key);
        }
      }

      // Clean up old security events
      const eventKeys = await cacheService.redis.keys('security:event:*');
      for (const key of eventKeys) {
        const event = await cacheService.get(key);
        if (event && event.timestamp < cutoff) {
          await cacheService.delete(key);
        }
      }

      logger.info('Security data cleanup completed');

    } catch (error) {
      logger.error('Failed to cleanup expired security data:', error);
    }
  }

  /**
   * Monitor suspicious activities
   */
  async monitorSuspiciousActivities() {
    try {
      // Basic monitoring implementation
      const suspiciousPatterns = [
        'multiple_failed_logins',
        'unusual_access_patterns',
        'privilege_escalation_attempts',
        'data_exfiltration_indicators'
      ];

      // Placeholder for pattern detection
      logger.debug('Monitoring suspicious activities');

    } catch (error) {
      logger.error('Failed to monitor suspicious activities:', error);
    }
  }

  /**
   * Generate security report
   */
  async generateSecurityReport() {
    try {
      const report = {
        timestamp: Date.now(),
        metrics: this.metrics,
        alerts: await this.getActiveSecurityAlerts(),
        recommendations: await this.generateSecurityRecommendations()
      };

      logger.info('Daily security report generated:', report);
      return report;

    } catch (error) {
      logger.error('Failed to generate security report:', error);
      return null;
    }
  }

  /**
   * Get active security alerts
   */
  async getActiveSecurityAlerts() {
    try {
      const alertKeys = await cacheService.redis.keys('security:alert:*');
      const alerts = [];
      
      for (const key of alertKeys) {
        const alert = await cacheService.get(key);
        if (alert && alert.status === 'active') {
          alerts.push(alert);
        }
      }
      
      return alerts;

    } catch (error) {
      logger.error('Failed to get active security alerts:', error);
      return [];
    }
  }

  /**
   * Generate security recommendations
   */
  async generateSecurityRecommendations(report = null) {
    const recommendations = [];

    // Password policy recommendations
    if (this.metrics.failedLogins > 100) {
      recommendations.push({
        type: 'password_policy',
        severity: 'medium',
        message: 'Consider strengthening password policy due to high failed login attempts',
        action: 'Review and update password requirements'
      });
    }

    // Session security recommendations
    const activeSessions = await cacheService.redis.keys('session:*');
    if (activeSessions.length > 1000) {
      recommendations.push({
        type: 'session_management',
        severity: 'low',
        message: 'High number of active sessions detected',
        action: 'Consider implementing session cleanup policies'
      });
    }

    // Security monitoring recommendations
    if (this.metrics.securityAlerts > 50) {
      recommendations.push({
        type: 'security_monitoring',
        severity: 'high',
        message: 'High number of security alerts generated',
        action: 'Review security monitoring rules and investigate potential threats'
      });
    }

    return recommendations;
  }

  // Placeholder methods for compliance reporting
  async getDataProcessingActivities(startDate, endDate) { return []; }
  async getDataSubjectRequests(startDate, endDate) { return []; }
  async getDataBreaches(startDate, endDate) { return []; }
  async getConsentManagement(startDate, endDate) { return {}; }
  async checkDataRetentionCompliance() { return { compliant: true }; }
  async getAccessControlAudit(startDate, endDate) { return {}; }
  async getAuditLogCompliance(startDate, endDate) { return { compliant: true }; }
  async getEncryptionCompliance() { return { compliant: true }; }
  async getSecurityIncidents(startDate, endDate) { return []; }
  async getBAAAudit() { return { compliant: true }; }
  async getAccessManagementAudit(startDate, endDate) { return {}; }
  async getChangeManagementAudit(startDate, endDate) { return {}; }
  async getDataIntegrityAudit(startDate, endDate) { return {}; }
  async getSystemControlsAudit(startDate, endDate) { return {}; }
  async getSecurityEventCount(startDate, endDate) { return 0; }
  async getSecurityAlertCount(startDate, endDate) { return 0; }
  async getPasswordPolicyViolations(startDate, endDate) { return 0; }
}

module.exports = new SecurityService(); 