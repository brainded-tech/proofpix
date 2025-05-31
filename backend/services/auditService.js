/**
 * Audit Service
 * Handles security logging and compliance tracking for hybrid architecture
 */

const { logger } = require('../config/database');

class AuditService {
  constructor() {
    this.auditLogs = [];
    this.maxLogsInMemory = 1000;
    this.retentionPeriod = 90 * 24 * 60 * 60 * 1000; // 90 days
  }

  /**
   * Log audit event
   */
  async auditLog(userId, action, details = {}) {
    try {
      const auditEntry = {
        id: this.generateAuditId(),
        timestamp: new Date().toISOString(),
        userId,
        action,
        details,
        ipAddress: details.ipAddress || 'unknown',
        userAgent: details.userAgent || 'unknown',
        sessionId: details.sessionId || null,
        ephemeral: details.ephemeral || false
      };

      // Add to memory (for recent access)
      this.auditLogs.unshift(auditEntry);
      
      // Keep only recent logs in memory
      if (this.auditLogs.length > this.maxLogsInMemory) {
        this.auditLogs = this.auditLogs.slice(0, this.maxLogsInMemory);
      }

      // Log to file/external system
      logger.info('AUDIT', auditEntry);

      return auditEntry;
    } catch (error) {
      logger.error('Audit logging failed:', error);
      throw error;
    }
  }

  /**
   * Get audit logs for user
   */
  async getUserAuditLogs(userId, options = {}) {
    try {
      const { limit = 50, offset = 0, action = null } = options;
      
      let logs = this.auditLogs.filter(log => log.userId === userId);
      
      if (action) {
        logs = logs.filter(log => log.action === action);
      }

      return {
        logs: logs.slice(offset, offset + limit),
        total: logs.length,
        hasMore: logs.length > offset + limit
      };
    } catch (error) {
      logger.error('Failed to get user audit logs:', error);
      throw error;
    }
  }

  /**
   * Generate audit ID
   */
  generateAuditId() {
    return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Cleanup old audit logs
   */
  async cleanupOldLogs() {
    try {
      const cutoffTime = Date.now() - this.retentionPeriod;
      const initialCount = this.auditLogs.length;
      
      this.auditLogs = this.auditLogs.filter(log => 
        new Date(log.timestamp).getTime() > cutoffTime
      );

      const cleanedCount = initialCount - this.auditLogs.length;
      if (cleanedCount > 0) {
        logger.info(`Cleaned up ${cleanedCount} old audit logs`);
      }
    } catch (error) {
      logger.error('Audit cleanup failed:', error);
    }
  }
}

// Export singleton instance
const auditService = new AuditService();

// Export the auditLog function directly for convenience
const auditLog = (userId, action, details) => auditService.auditLog(userId, action, details);

module.exports = { auditService, auditLog }; 