const db = require('../config/database');
const { logger } = require('../config/database');
const { auditLog } = require('./auditService');
const crypto = require('crypto');

class ComplianceService {
  constructor() {
    this.supportedRegulations = ['gdpr', 'ccpa', 'pipeda', 'lgpd'];
    this.dataSubjectRights = {
      gdpr: [
        'access', 'rectification', 'erasure', 'restrict_processing',
        'data_portability', 'object_processing', 'withdraw_consent'
      ],
      ccpa: [
        'know', 'delete', 'opt_out_sale', 'non_discrimination'
      ]
    };
  }

  // GDPR Compliance Methods

  // Article 15 - Right of Access
  async handleDataSubjectAccessRequest(userId, requestDetails) {
    try {
      const requestId = crypto.randomUUID();
      
      // Log the request
      await this.logComplianceAction('gdpr', 'data_access_request', userId, {
        requestId,
        requestDetails,
        status: 'received'
      });

      // Gather all user data
      const userData = await this.gatherUserData(userId);
      
      // Create data export
      const dataExport = {
        requestId,
        userId,
        exportDate: new Date(),
        personalData: userData,
        processingActivities: await this.getUserProcessingActivities(userId),
        consents: await this.getUserConsents(userId),
        dataRetention: await this.getDataRetentionInfo(userId)
      };

      // Store the request and response
      await db.query(`
        INSERT INTO data_subject_requests (
          request_id, user_id, request_type, regulation, status,
          request_details, response_data, created_at
        ) VALUES ($1, $2, 'access', 'gdpr', 'completed', $3, $4, NOW())
      `, [requestId, userId, JSON.stringify(requestDetails), JSON.stringify(dataExport)]);

      await this.logComplianceAction('gdpr', 'data_access_completed', userId, {
        requestId,
        dataCategories: Object.keys(userData)
      });

      return {
        success: true,
        requestId,
        dataExport,
        message: 'Data access request completed successfully'
      };
    } catch (error) {
      logger.error('Data access request failed:', error);
      throw new Error('Failed to process data access request');
    }
  }

  // Article 16 - Right to Rectification
  async handleDataRectificationRequest(userId, corrections, requestDetails) {
    try {
      const requestId = crypto.randomUUID();
      
      await this.logComplianceAction('gdpr', 'data_rectification_request', userId, {
        requestId,
        corrections,
        requestDetails
      });

      // Validate and apply corrections
      const validatedCorrections = await this.validateDataCorrections(corrections);
      const updateResults = [];

      for (const correction of validatedCorrections) {
        try {
          const result = await this.applyDataCorrection(userId, correction);
          updateResults.push(result);
        } catch (error) {
          logger.error(`Failed to apply correction: ${correction.field}`, error);
          updateResults.push({
            field: correction.field,
            success: false,
            error: error.message
          });
        }
      }

      // Store the request
      await db.query(`
        INSERT INTO data_subject_requests (
          request_id, user_id, request_type, regulation, status,
          request_details, response_data, created_at
        ) VALUES ($1, $2, 'rectification', 'gdpr', 'completed', $3, $4, NOW())
      `, [requestId, userId, JSON.stringify({ corrections, requestDetails }), JSON.stringify(updateResults)]);

      await this.logComplianceAction('gdpr', 'data_rectification_completed', userId, {
        requestId,
        updatedFields: updateResults.filter(r => r.success).map(r => r.field)
      });

      return {
        success: true,
        requestId,
        updateResults,
        message: 'Data rectification request processed'
      };
    } catch (error) {
      logger.error('Data rectification request failed:', error);
      throw new Error('Failed to process data rectification request');
    }
  }

  // Article 17 - Right to Erasure (Right to be Forgotten)
  async handleDataErasureRequest(userId, requestDetails) {
    try {
      const requestId = crypto.randomUUID();
      
      await this.logComplianceAction('gdpr', 'data_erasure_request', userId, {
        requestId,
        requestDetails
      });

      // Check if erasure is legally possible
      const erasureCheck = await this.checkErasureLegality(userId);
      
      if (!erasureCheck.allowed) {
        await db.query(`
          INSERT INTO data_subject_requests (
            request_id, user_id, request_type, regulation, status,
            request_details, response_data, created_at
          ) VALUES ($1, $2, 'erasure', 'gdpr', 'rejected', $3, $4, NOW())
        `, [requestId, userId, JSON.stringify(requestDetails), JSON.stringify(erasureCheck)]);

        return {
          success: false,
          requestId,
          reason: erasureCheck.reason,
          legalBasis: erasureCheck.legalBasis,
          message: 'Data erasure request cannot be fulfilled'
        };
      }

      // Perform data erasure
      const erasureResults = await this.performDataErasure(userId);

      await db.query(`
        INSERT INTO data_subject_requests (
          request_id, user_id, request_type, regulation, status,
          request_details, response_data, created_at
        ) VALUES ($1, $2, 'erasure', 'gdpr', 'completed', $3, $4, NOW())
      `, [requestId, userId, JSON.stringify(requestDetails), JSON.stringify(erasureResults)]);

      await this.logComplianceAction('gdpr', 'data_erasure_completed', userId, {
        requestId,
        erasedData: erasureResults.erasedTables
      });

      return {
        success: true,
        requestId,
        erasureResults,
        message: 'Data erasure request completed successfully'
      };
    } catch (error) {
      logger.error('Data erasure request failed:', error);
      throw new Error('Failed to process data erasure request');
    }
  }

  // Article 20 - Right to Data Portability
  async handleDataPortabilityRequest(userId, format = 'json', requestDetails) {
    try {
      const requestId = crypto.randomUUID();
      
      await this.logComplianceAction('gdpr', 'data_portability_request', userId, {
        requestId,
        format,
        requestDetails
      });

      // Gather portable data (only data provided by user and processed automatically)
      const portableData = await this.gatherPortableData(userId);
      
      // Format data according to request
      const formattedData = await this.formatPortableData(portableData, format);

      await db.query(`
        INSERT INTO data_subject_requests (
          request_id, user_id, request_type, regulation, status,
          request_details, response_data, created_at
        ) VALUES ($1, $2, 'portability', 'gdpr', 'completed', $3, $4, NOW())
      `, [requestId, userId, JSON.stringify({ format, requestDetails }), JSON.stringify({ format, dataSize: formattedData.length })]);

      await this.logComplianceAction('gdpr', 'data_portability_completed', userId, {
        requestId,
        format,
        dataSize: formattedData.length
      });

      return {
        success: true,
        requestId,
        data: formattedData,
        format,
        message: 'Data portability request completed successfully'
      };
    } catch (error) {
      logger.error('Data portability request failed:', error);
      throw new Error('Failed to process data portability request');
    }
  }

  // Consent Management (Article 7)
  async recordConsent(userId, consentType, consentGiven, method, details = {}) {
    try {
      await db.query(`
        INSERT INTO user_consents (
          user_id, consent_type, consent_given, consent_method,
          consent_details, ip_address, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        userId,
        consentType,
        consentGiven,
        method,
        JSON.stringify(details),
        details.ipAddress || null,
        details.userAgent || null
      ]);

      await this.logComplianceAction('gdpr', 'consent_recorded', userId, {
        consentType,
        consentGiven,
        method
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to record consent:', error);
      throw new Error('Failed to record consent');
    }
  }

  async withdrawConsent(userId, consentType, details = {}) {
    try {
      // Record consent withdrawal
      await db.query(`
        UPDATE user_consents 
        SET consent_given = FALSE, withdrawn_date = NOW()
        WHERE user_id = $1 AND consent_type = $2 AND consent_given = TRUE
      `, [userId, consentType]);

      // Log the withdrawal
      await this.logComplianceAction('gdpr', 'consent_withdrawn', userId, {
        consentType,
        details
      });

      // Take action based on consent type
      await this.handleConsentWithdrawal(userId, consentType);

      return { success: true };
    } catch (error) {
      logger.error('Failed to withdraw consent:', error);
      throw new Error('Failed to withdraw consent');
    }
  }

  async getUserConsents(userId) {
    try {
      const result = await db.query(`
        SELECT consent_type, consent_given, consent_date, consent_method,
               withdrawn_date, consent_details
        FROM user_consents
        WHERE user_id = $1
        ORDER BY consent_date DESC
      `, [userId]);

      return result.rows;
    } catch (error) {
      logger.error('Failed to get user consents:', error);
      throw new Error('Failed to retrieve user consents');
    }
  }

  // Data Retention Management
  async enforceDataRetention() {
    try {
      const policies = await db.query(`
        SELECT * FROM data_retention_policies WHERE auto_delete = TRUE
      `);

      const deletionResults = [];

      for (const policy of policies.rows) {
        try {
          const result = await this.applyRetentionPolicy(policy);
          deletionResults.push(result);
        } catch (error) {
          logger.error(`Failed to apply retention policy for ${policy.data_type}:`, error);
          deletionResults.push({
            dataType: policy.data_type,
            success: false,
            error: error.message
          });
        }
      }

      await this.logComplianceAction('system', 'data_retention_enforced', null, {
        deletionResults
      });

      return deletionResults;
    } catch (error) {
      logger.error('Data retention enforcement failed:', error);
      throw new Error('Failed to enforce data retention policies');
    }
  }

  async applyRetentionPolicy(policy) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retention_period_days);

    let deletedCount = 0;

    switch (policy.data_type) {
      case 'audit_logs':
        const auditResult = await db.query(`
          DELETE FROM audit_logs WHERE created_at < $1
        `, [cutoffDate]);
        deletedCount = auditResult.rowCount;
        break;

      case 'session_data':
        const sessionResult = await db.query(`
          DELETE FROM sessions WHERE created_at < $1
        `, [cutoffDate]);
        deletedCount = sessionResult.rowCount;
        break;

      case 'usage_tracking':
        const usageResult = await db.query(`
          DELETE FROM usage_tracking WHERE created_at < $1
        `, [cutoffDate]);
        deletedCount = usageResult.rowCount;
        break;

      default:
        throw new Error(`Unknown data type: ${policy.data_type}`);
    }

    return {
      dataType: policy.data_type,
      success: true,
      deletedCount,
      cutoffDate
    };
  }

  // CCPA Compliance Methods
  async handleCCPARequest(userId, requestType, requestDetails) {
    try {
      const requestId = crypto.randomUUID();

      switch (requestType) {
        case 'know':
          return await this.handleCCPAKnowRequest(userId, requestId, requestDetails);
        case 'delete':
          return await this.handleCCPADeleteRequest(userId, requestId, requestDetails);
        case 'opt_out_sale':
          return await this.handleCCPAOptOutRequest(userId, requestId, requestDetails);
        default:
          throw new Error(`Unsupported CCPA request type: ${requestType}`);
      }
    } catch (error) {
      logger.error('CCPA request failed:', error);
      throw new Error('Failed to process CCPA request');
    }
  }

  // Helper Methods
  async gatherUserData(userId) {
    try {
      const userData = {};

      // User profile data
      const userResult = await db.query(`
        SELECT id, email, name, created_at, updated_at, last_login,
               email_verified, two_factor_enabled
        FROM users WHERE id = $1
      `, [userId]);
      userData.profile = userResult.rows[0];

      // Subscription data
      const subscriptionResult = await db.query(`
        SELECT * FROM subscriptions WHERE user_id = $1
      `, [userId]);
      userData.subscription = subscriptionResult.rows;

      // Usage data
      const usageResult = await db.query(`
        SELECT usage_type, SUM(quantity) as total_usage, COUNT(*) as usage_count
        FROM usage_tracking WHERE user_id = $1
        GROUP BY usage_type
      `, [userId]);
      userData.usage = usageResult.rows;

      // Billing data
      const billingResult = await db.query(`
        SELECT amount, currency, status, created_at
        FROM billing b
        JOIN users u ON b.stripe_customer_id = u.stripe_customer_id
        WHERE u.id = $1
      `, [userId]);
      userData.billing = billingResult.rows;

      // Files data
      const filesResult = await db.query(`
        SELECT file_name, file_size, upload_date, processing_status
        FROM files WHERE user_id = $1
      `, [userId]);
      userData.files = filesResult.rows;

      return userData;
    } catch (error) {
      logger.error('Failed to gather user data:', error);
      throw new Error('Failed to gather user data');
    }
  }

  async gatherPortableData(userId) {
    // Only data provided by user and processed automatically (GDPR Article 20)
    try {
      const portableData = {};

      // User-provided profile data
      const userResult = await db.query(`
        SELECT email, name, created_at
        FROM users WHERE id = $1
      `, [userId]);
      portableData.profile = userResult.rows[0];

      // User-uploaded files metadata
      const filesResult = await db.query(`
        SELECT file_name, upload_date, file_size
        FROM files WHERE user_id = $1
      `, [userId]);
      portableData.files = filesResult.rows;

      // User preferences/settings
      const preferencesResult = await db.query(`
        SELECT preference_key, preference_value
        FROM user_preferences WHERE user_id = $1
      `, [userId]);
      portableData.preferences = preferencesResult.rows;

      return portableData;
    } catch (error) {
      logger.error('Failed to gather portable data:', error);
      throw new Error('Failed to gather portable data');
    }
  }

  async checkErasureLegality(userId) {
    try {
      // Check for legal obligations to retain data
      const activeSubscription = await db.query(`
        SELECT * FROM subscriptions 
        WHERE user_id = $1 AND status = 'active'
      `, [userId]);

      if (activeSubscription.rows.length > 0) {
        return {
          allowed: false,
          reason: 'Active subscription requires data retention for contract performance',
          legalBasis: 'Contract performance (GDPR Article 6(1)(b))'
        };
      }

      // Check for outstanding billing obligations
      const unpaidBills = await db.query(`
        SELECT COUNT(*) as count FROM billing b
        JOIN users u ON b.stripe_customer_id = u.stripe_customer_id
        WHERE u.id = $1 AND b.status = 'unpaid'
      `, [userId]);

      if (parseInt(unpaidBills.rows[0].count) > 0) {
        return {
          allowed: false,
          reason: 'Outstanding billing obligations require data retention',
          legalBasis: 'Legal obligation (GDPR Article 6(1)(c))'
        };
      }

      // Check for legal retention requirements (e.g., tax records)
      const recentBilling = await db.query(`
        SELECT COUNT(*) as count FROM billing b
        JOIN users u ON b.stripe_customer_id = u.stripe_customer_id
        WHERE u.id = $1 AND b.created_at > NOW() - INTERVAL '7 years'
      `, [userId]);

      if (parseInt(recentBilling.rows[0].count) > 0) {
        return {
          allowed: false,
          reason: 'Tax and accounting records must be retained for 7 years',
          legalBasis: 'Legal obligation (GDPR Article 6(1)(c))'
        };
      }

      return { allowed: true };
    } catch (error) {
      logger.error('Failed to check erasure legality:', error);
      throw new Error('Failed to check erasure legality');
    }
  }

  async performDataErasure(userId) {
    try {
      const erasureResults = {
        erasedTables: [],
        retainedTables: [],
        errors: []
      };

      // Tables that can be safely erased
      const erasableTables = [
        'user_preferences',
        'user_consents',
        'sessions',
        'files'
      ];

      for (const table of erasableTables) {
        try {
          const result = await db.query(`DELETE FROM ${table} WHERE user_id = $1`, [userId]);
          erasureResults.erasedTables.push({
            table,
            deletedRows: result.rowCount
          });
        } catch (error) {
          erasureResults.errors.push({
            table,
            error: error.message
          });
        }
      }

      // Anonymize user record instead of deleting (for audit trail)
      await db.query(`
        UPDATE users SET
          email = 'deleted-user-' || id || '@example.com',
          name = 'Deleted User',
          password_hash = 'DELETED',
          two_factor_secret = NULL,
          backup_codes = NULL,
          deleted_at = NOW()
        WHERE id = $1
      `, [userId]);

      erasureResults.erasedTables.push({
        table: 'users',
        action: 'anonymized'
      });

      return erasureResults;
    } catch (error) {
      logger.error('Failed to perform data erasure:', error);
      throw new Error('Failed to perform data erasure');
    }
  }

  async logComplianceAction(regulation, action, userId, details) {
    try {
      await db.query(`
        INSERT INTO compliance_logs (
          compliance_type, action, user_id, details, created_at
        ) VALUES ($1, $2, $3, $4, NOW())
      `, [regulation, action, userId, JSON.stringify(details)]);
    } catch (error) {
      logger.error('Failed to log compliance action:', error);
    }
  }

  // Compliance Reporting
  async generateComplianceReport(startDate, endDate, regulation = 'gdpr') {
    try {
      const requests = await db.query(`
        SELECT request_type, status, COUNT(*) as count
        FROM data_subject_requests
        WHERE regulation = $1 AND created_at BETWEEN $2 AND $3
        GROUP BY request_type, status
      `, [regulation, startDate, endDate]);

      const consents = await db.query(`
        SELECT consent_type, consent_given, COUNT(*) as count
        FROM user_consents
        WHERE consent_date BETWEEN $1 AND $2
        GROUP BY consent_type, consent_given
      `, [startDate, endDate]);

      const breaches = await db.query(`
        SELECT COUNT(*) as count
        FROM security_incidents
        WHERE severity IN ('high', 'critical') 
        AND created_at BETWEEN $1 AND $2
      `, [startDate, endDate]);

      return {
        period: { startDate, endDate },
        regulation,
        dataSubjectRequests: requests.rows,
        consentMetrics: consents.rows,
        securityBreaches: parseInt(breaches.rows[0].count),
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('Failed to generate compliance report:', error);
      throw new Error('Failed to generate compliance report');
    }
  }
}

module.exports = new ComplianceService(); 