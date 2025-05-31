/**
 * Security Routes - Enterprise Security & Compliance
 * Provides API endpoints for security management and compliance reporting
 */

const express = require('express');
const router = express.Router();
const { authenticateToken, requireAuth, requireSubscription } = require('../middleware/auth');
const securityService = require('../services/securityService');
const complianceService = require('../services/complianceService');
const { auditLog } = require('../services/auditService');
const db = require('../config/database');
const rateLimit = require('express-rate-limit');

// Rate limiting for security endpoints
const securityRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many security requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all security routes
router.use(securityRateLimit);

// Simple admin check middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Security Monitoring Routes

// Get security metrics
router.get('/metrics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const metrics = await securityService.getSecurityMetrics(timeRange);
    
    await auditLog(req.user.userId, 'security_metrics_accessed', {
      timeRange,
      metricsCount: Object.keys(metrics).length
    });

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get security incidents
router.get('/incidents', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      severity, 
      status, 
      startDate, 
      endDate 
    } = req.query;

    const filters = {};
    if (severity) filters.severity = severity;
    if (status) filters.status = status;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const incidents = await securityService.getSecurityIncidents({
      page: parseInt(page),
      limit: parseInt(limit),
      filters
    });

    await auditLog(req.user.userId, 'security_incidents_accessed', {
      page,
      limit,
      filters,
      incidentCount: incidents.data.length
    });

    res.json({
      success: true,
      data: incidents.data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: incidents.total,
        pages: Math.ceil(incidents.total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific security incident (admin only)
router.get('/incidents/:incidentId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { incidentId } = req.params;

    const incident = await db.query(`
      SELECT * FROM security_incidents WHERE incident_id = $1
    `, [incidentId]);

    if (incident.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Security incident not found'
      });
    }

    res.json({
      success: true,
      incident: incident.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update security incident status (admin only)
router.put('/incidents/:incidentId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { status, resolutionNotes } = req.body;

    if (!['investigating', 'resolved', 'false_positive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    await db.query(`
      UPDATE security_incidents 
      SET status = $1, resolved_at = $2, resolved_by = $3, resolution_notes = $4, updated_at = NOW()
      WHERE incident_id = $5
    `, [
      status,
      status === 'resolved' || status === 'false_positive' ? new Date() : null,
      req.user.id,
      resolutionNotes || null,
      incidentId
    ]);

    await auditLog(req.user.id, 'security_incident_updated', {
      incidentId,
      status,
      resolutionNotes
    });

    res.json({
      success: true,
      message: 'Security incident updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate security report (admin only)
router.get('/reports', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const report = await securityService.generateSecurityReport(
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Perform security health check (admin only)
router.get('/health-check', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const healthCheck = await securityService.performSecurityHealthCheck();

    res.json({
      success: true,
      healthCheck
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// IP Management Routes

// Get blocked IPs (admin only)
router.get('/blocked-ips', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const blockedIPs = await db.query(`
      SELECT ip_address, reason, blocked_at, expires_at, created_by
      FROM blocked_ips
      WHERE expires_at > NOW()
      ORDER BY blocked_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const totalCount = await db.query(`
      SELECT COUNT(*) as count FROM blocked_ips WHERE expires_at > NOW()
    `);

    res.json({
      success: true,
      blockedIPs: blockedIPs.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(parseInt(totalCount.rows[0].count) / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Block IP address (admin only)
router.post('/block-ip', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { ipAddress, reason, duration = 24 } = req.body;

    if (!ipAddress || !reason) {
      return res.status(400).json({
        success: false,
        error: 'IP address and reason are required'
      });
    }

    await securityService.blockIP(ipAddress, reason);

    await auditLog(req.user.id, 'ip_blocked_manually', {
      ipAddress,
      reason,
      duration
    });

    res.json({
      success: true,
      message: 'IP address blocked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Unblock IP address (admin only)
router.delete('/block-ip/:ipAddress', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { ipAddress } = req.params;
    const { reason } = req.body;

    await securityService.unblockIP(ipAddress, reason || 'Manually unblocked by admin');

    await auditLog(req.user.id, 'ip_unblocked_manually', {
      ipAddress,
      reason
    });

    res.json({
      success: true,
      message: 'IP address unblocked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GDPR Compliance Routes

// Submit data access request
router.post('/gdpr/access-request', authenticateToken, securityRateLimit, async (req, res) => {
  try {
    const { requestDetails } = req.body;

    const result = await complianceService.handleDataSubjectAccessRequest(
      req.user.id,
      requestDetails
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Submit data rectification request
router.post('/gdpr/rectification-request', authenticateToken, securityRateLimit, async (req, res) => {
  try {
    const { corrections, requestDetails } = req.body;

    if (!corrections || !Array.isArray(corrections)) {
      return res.status(400).json({
        success: false,
        error: 'Corrections array is required'
      });
    }

    const result = await complianceService.handleDataRectificationRequest(
      req.user.id,
      corrections,
      requestDetails
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Submit data erasure request (right to be forgotten)
router.post('/gdpr/erasure-request', authenticateToken, securityRateLimit, async (req, res) => {
  try {
    const { requestDetails } = req.body;

    const result = await complianceService.handleDataErasureRequest(
      req.user.id,
      requestDetails
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Submit data portability request
router.post('/gdpr/portability-request', authenticateToken, securityRateLimit, async (req, res) => {
  try {
    const { format = 'json', requestDetails } = req.body;

    const result = await complianceService.handleDataPortabilityRequest(
      req.user.id,
      format,
      requestDetails
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Consent Management Routes

// Get user consents
router.get('/consents', authenticateToken, async (req, res) => {
  try {
    const consents = await complianceService.getUserConsents(req.user.id);

    res.json({
      success: true,
      consents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Record consent
router.post('/consents', authenticateToken, async (req, res) => {
  try {
    const { consentType, consentGiven, method, details = {} } = req.body;

    if (!consentType || typeof consentGiven !== 'boolean' || !method) {
      return res.status(400).json({
        success: false,
        error: 'Consent type, consent given (boolean), and method are required'
      });
    }

    // Add request context to details
    details.ipAddress = req.ip;
    details.userAgent = req.get('User-Agent');

    const result = await complianceService.recordConsent(
      req.user.id,
      consentType,
      consentGiven,
      method,
      details
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Withdraw consent
router.delete('/consents/:consentType', authenticateToken, async (req, res) => {
  try {
    const { consentType } = req.params;
    const details = {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      withdrawalReason: req.body.reason
    };

    const result = await complianceService.withdrawConsent(
      req.user.id,
      consentType,
      details
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Compliance Reporting Routes (Admin only)

// Generate compliance report
router.get('/compliance/reports', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, regulation = 'gdpr' } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const report = await complianceService.generateComplianceReport(
      new Date(startDate),
      new Date(endDate),
      regulation
    );

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get data subject requests (admin only)
router.get('/compliance/requests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, regulation, requestType, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [limit, offset];
    let paramCount = 2;

    if (regulation) {
      whereClause += ` WHERE regulation = $${++paramCount}`;
      params.push(regulation);
    }

    if (requestType) {
      whereClause += regulation ? ` AND request_type = $${++paramCount}` : ` WHERE request_type = $${++paramCount}`;
      params.push(requestType);
    }

    if (status) {
      whereClause += (regulation || requestType) ? ` AND status = $${++paramCount}` : ` WHERE status = $${++paramCount}`;
      params.push(status);
    }

    const requests = await db.query(`
      SELECT request_id, user_id, request_type, regulation, status, created_at
      FROM data_subject_requests
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, params);

    const totalCount = await db.query(`
      SELECT COUNT(*) as count FROM data_subject_requests ${whereClause}
    `, params.slice(2));

    res.json({
      success: true,
      requests: requests.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.rows[0].count),
        pages: Math.ceil(parseInt(totalCount.rows[0].count) / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Data Retention Routes (Admin only)

// Enforce data retention policies
router.post('/compliance/enforce-retention', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const results = await complianceService.enforceDataRetention();

    await auditLog(req.user.id, 'data_retention_enforced_manually', {
      results
    });

    res.json({
      success: true,
      results,
      message: 'Data retention policies enforced successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get data retention policies
router.get('/compliance/retention-policies', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const policies = await db.query(`
      SELECT * FROM data_retention_policies ORDER BY data_type
    `);

    res.json({
      success: true,
      policies: policies.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update data retention policy
router.put('/compliance/retention-policies/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { retentionPeriodDays, autoDelete, legalBasis } = req.body;

    await db.query(`
      UPDATE data_retention_policies 
      SET retention_period_days = $1, auto_delete = $2, legal_basis = $3, updated_at = NOW()
      WHERE id = $4
    `, [retentionPeriodDays, autoDelete, legalBasis, id]);

    await auditLog(req.user.id, 'retention_policy_updated', {
      policyId: id,
      retentionPeriodDays,
      autoDelete,
      legalBasis
    });

    res.json({
      success: true,
      message: 'Data retention policy updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Security Middleware Test Route (Development only)
if (process.env.NODE_ENV === 'development') {
  router.post('/test/threat-detection', async (req, res) => {
    try {
      const threats = await securityService.detectThreats(req);
      
      res.json({
        success: true,
        threats,
        message: 'Threat detection test completed'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}

/**
 * POST /api/security/validate-password
 * Validate password against security policy
 */
router.post('/validate-password', requireAuth, async (req, res) => {
  try {
    const { password, userHistory = [] } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    const validation = securityService.validatePassword(password, userHistory);
    
    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    console.error('Failed to validate password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate password'
    });
  }
});

/**
 * POST /api/security/encrypt
 * Encrypt sensitive data
 */
router.post('/encrypt', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Data to encrypt is required'
      });
    }

    const encrypted = securityService.encryptData(data);
    
    res.json({
      success: true,
      data: encrypted
    });
  } catch (error) {
    console.error('Failed to encrypt data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to encrypt data'
    });
  }
});

/**
 * POST /api/security/decrypt
 * Decrypt sensitive data
 */
router.post('/decrypt', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { encryptedData } = req.body;
    
    if (!encryptedData) {
      return res.status(400).json({
        success: false,
        message: 'Encrypted data is required'
      });
    }

    const decrypted = securityService.decryptData(encryptedData);
    
    res.json({
      success: true,
      data: decrypted
    });
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to decrypt data'
    });
  }
});

/**
 * POST /api/security/events
 * Record security event
 */
router.post('/events', requireAuth, async (req, res) => {
  try {
    const { type, severity, details } = req.body;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Event type is required'
      });
    }

    const eventId = await securityService.recordSecurityEvent({
      type,
      severity,
      userId: req.user.userId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details
    });
    
    res.json({
      success: true,
      data: { eventId }
    });
  } catch (error) {
    console.error('Failed to record security event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record security event'
    });
  }
});

/**
 * GET /api/security/compliance/report
 * Generate compliance report
 */
router.get('/compliance/report', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate).getTime() : Date.now() - (30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate).getTime() : Date.now();
    
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    const report = await securityService.generateComplianceReport(start, end);
    
    if (!report) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate compliance report'
      });
    }
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Failed to generate compliance report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate compliance report'
    });
  }
});

/**
 * GET /api/security/policy
 * Get current security policy
 */
router.get('/policy', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const policy = {
      passwordPolicy: securityService.config.passwordPolicy,
      sessionSecurity: securityService.config.sessionSecurity,
      compliance: securityService.config.compliance,
      threatDetection: securityService.config.threatDetection
    };
    
    res.json({
      success: true,
      data: policy
    });
  } catch (error) {
    console.error('Failed to get security policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve security policy'
    });
  }
});

/**
 * PUT /api/security/policy
 * Update security policy
 */
router.put('/policy', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { passwordPolicy, sessionSecurity, compliance, threatDetection } = req.body;
    
    // Validate and update password policy
    if (passwordPolicy) {
      if (passwordPolicy.minLength && (passwordPolicy.minLength < 8 || passwordPolicy.minLength > 128)) {
        return res.status(400).json({
          success: false,
          message: 'Password minimum length must be between 8 and 128 characters'
        });
      }
      
      Object.assign(securityService.config.passwordPolicy, passwordPolicy);
    }

    // Validate and update session security
    if (sessionSecurity) {
      if (sessionSecurity.maxConcurrentSessions && sessionSecurity.maxConcurrentSessions < 1) {
        return res.status(400).json({
          success: false,
          message: 'Maximum concurrent sessions must be at least 1'
        });
      }
      
      Object.assign(securityService.config.sessionSecurity, sessionSecurity);
    }

    // Update compliance settings
    if (compliance) {
      Object.assign(securityService.config.compliance, compliance);
    }

    // Update threat detection settings
    if (threatDetection) {
      Object.assign(securityService.config.threatDetection, threatDetection);
    }

    // Record security event
    await securityService.recordSecurityEvent({
      type: 'security_policy_updated',
      severity: 'medium',
      userId: req.user.userId,
      ipAddress: req.ip,
      details: { updatedFields: Object.keys(req.body) }
    });
    
    res.json({
      success: true,
      message: 'Security policy updated successfully',
      data: {
        passwordPolicy: securityService.config.passwordPolicy,
        sessionSecurity: securityService.config.sessionSecurity,
        compliance: securityService.config.compliance,
        threatDetection: securityService.config.threatDetection
      }
    });
  } catch (error) {
    console.error('Failed to update security policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update security policy'
    });
  }
});

/**
 * GET /api/security/metrics
 * Get security metrics
 */
router.get('/metrics', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const metrics = {
      ...securityService.metrics,
      blockedIPs: securityService.metrics.blockedIPs.size,
      timestamp: Date.now()
    };
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Failed to get security metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve security metrics'
    });
  }
});

/**
 * POST /api/security/check-brute-force
 * Check for brute force attacks
 */
router.post('/check-brute-force', requireAuth, async (req, res) => {
  try {
    const { identifier, type = 'login' } = req.body;
    
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier is required'
      });
    }

    const result = await securityService.checkBruteForce(identifier, type);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Failed to check brute force:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check brute force protection'
    });
  }
});

/**
 * POST /api/security/record-failed-attempt
 * Record failed authentication attempt
 */
router.post('/record-failed-attempt', requireAuth, async (req, res) => {
  try {
    const { identifier, type = 'login', details = {} } = req.body;
    
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier is required'
      });
    }

    const attemptCount = await securityService.recordFailedAttempt(identifier, type, details);
    
    // Record security event
    await securityService.recordSecurityEvent({
      type: 'failed_authentication_attempt',
      severity: 'medium',
      userId: req.user.userId,
      ipAddress: req.ip,
      details: { identifier, type, attemptCount, ...details }
    });
    
    res.json({
      success: true,
      data: { attemptCount }
    });
  } catch (error) {
    console.error('Failed to record failed attempt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record failed attempt'
    });
  }
});

/**
 * POST /api/security/validate-session
 * Validate session security
 */
router.post('/validate-session', requireAuth, async (req, res) => {
  try {
    const { sessionToken } = req.body;
    
    if (!sessionToken) {
      return res.status(400).json({
        success: false,
        message: 'Session token is required'
      });
    }

    const validation = await securityService.validateSession(sessionToken, req);
    
    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    console.error('Failed to validate session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate session'
    });
  }
});

/**
 * GET /api/security/audit-trail
 * Get security audit trail
 */
router.get('/audit-trail', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const { startDate, endDate, eventType, severity, limit = 100 } = req.query;
    
    // This would typically query a database or audit log system
    // For now, return a placeholder response
    const auditTrail = {
      events: [],
      total: 0,
      filters: {
        startDate,
        endDate,
        eventType,
        severity,
        limit: parseInt(limit)
      },
      timestamp: Date.now()
    };
    
    res.json({
      success: true,
      data: auditTrail
    });
  } catch (error) {
    console.error('Failed to get audit trail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve audit trail'
    });
  }
});

/**
 * GET /api/security/health
 * Get security health status
 */
router.get('/health', requireAuth, requireSubscription('enterprise'), async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      checks: {
        passwordPolicy: {
          status: 'healthy',
          enabled: true
        },
        sessionSecurity: {
          status: 'healthy',
          enabled: true
        },
        threatDetection: {
          status: 'healthy',
          enabled: securityService.config.threatDetection.enableBruteForceProtection
        },
        compliance: {
          status: 'healthy',
          gdpr: securityService.config.compliance.enableGDPR,
          hipaa: securityService.config.compliance.enableHIPAA,
          sox: securityService.config.compliance.enableSOX
        },
        encryption: {
          status: 'healthy',
          algorithm: securityService.config.encryption.algorithm
        }
      },
      metrics: {
        ...securityService.metrics,
        blockedIPs: securityService.metrics.blockedIPs.size
      }
    };

    // Check for any issues
    if (securityService.metrics.securityAlerts > 10) {
      health.status = 'warning';
      health.checks.threatDetection.status = 'warning';
    }

    if (securityService.metrics.failedLogins > 100) {
      health.status = 'warning';
      health.checks.passwordPolicy.status = 'warning';
    }
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Failed to get security health:', error);
    res.status(503).json({
      success: false,
      message: 'Failed to retrieve security health status',
      data: {
        status: 'unhealthy',
        timestamp: Date.now(),
        error: 'Health check failed'
      }
    });
  }
});

/**
 * POST /api/security/generate-token
 * Generate secure random token
 */
router.post('/generate-token', requireAuth, async (req, res) => {
  try {
    const { length = 32 } = req.body;
    
    if (length < 8 || length > 128) {
      return res.status(400).json({
        success: false,
        message: 'Token length must be between 8 and 128 characters'
      });
    }

    const token = securityService.generateSecureToken(length);
    
    res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    console.error('Failed to generate token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate secure token'
    });
  }
});

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Security route error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = router; 