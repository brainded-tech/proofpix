const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { logger } = require('../config/database');

/**
 * Billing Service - Usage Tracking and Revenue Recording
 * Handles billing operations for document intelligence and other features
 */

/**
 * Track usage for billing purposes
 */
async function trackUsage({
  userId,
  documentId,
  planType,
  documentsProcessed = 1,
  templateUsed = null,
  aiAnalysisType = null,
  processingTimeSeconds = 0,
  confidenceScore = 0,
  billableAmount = 0,
  metadata = {}
}) {
  try {
    // Insert usage record
    const result = await db.query(`
      INSERT INTO document_intelligence_usage (
        user_id,
        document_id,
        plan_type,
        documents_processed,
        template_used,
        ai_analysis_type,
        processing_time_seconds,
        confidence_score,
        billable_amount,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [
      userId,
      documentId,
      planType,
      documentsProcessed,
      templateUsed,
      aiAnalysisType,
      processingTimeSeconds,
      confidenceScore,
      billableAmount,
      JSON.stringify(metadata)
    ]);

    // Update user quotas
    await updateUserQuotas(userId, planType, documentsProcessed, aiAnalysisType ? 1 : 0);

    logger.info('Usage tracked successfully', {
      userId,
      documentId,
      planType,
      billableAmount,
      usageId: result.rows[0].id
    });
    
    return result.rows[0].id;

  } catch (error) {
    logger.error('Failed to track usage:', error);
    throw new Error('Usage tracking failed');
  }
}

/**
 * Record revenue event
 */
async function recordRevenue({
  userId,
  amount,
  planType,
  eventType,
  source = 'document_intelligence',
  transactionId,
  metadata = {}
}) {
  try {
    const result = await db.query(`
      INSERT INTO document_intelligence_revenue (
        user_id,
        transaction_id,
        amount,
        plan_type,
        event_type,
        source,
        process_id,
        document_type,
        analysis_type,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [
      userId,
      transactionId,
      amount,
      planType,
      eventType,
      source,
      metadata.processId || null,
      metadata.documentType || null,
      metadata.analysisType || null,
      JSON.stringify(metadata)
    ]);

    logger.info('Revenue recorded successfully', {
      userId,
      amount,
      eventType,
      transactionId,
      revenueId: result.rows[0].id
    });
    
    return result.rows[0].id;

  } catch (error) {
    logger.error('Failed to record revenue:', error);
    throw new Error('Revenue recording failed');
  }
}

/**
 * Update user quotas and track overages
 */
async function updateUserQuotas(userId, planType, documentsUsed = 0, aiAnalysisUsed = 0) {
  try {
    // Get or create user quota record
    let quotaResult = await db.query(`
      SELECT * FROM document_intelligence_quotas 
      WHERE user_id = $1
    `, [userId]);

    if (quotaResult.rows.length === 0) {
      // Create quota record for new user
      const limits = getQuotaLimits(planType);
      await db.query(`
        INSERT INTO document_intelligence_quotas (
          user_id,
          plan_type,
          monthly_document_limit,
          monthly_ai_analysis_limit,
          billing_period_start,
          billing_period_end,
          next_reset
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        userId,
        planType,
        limits.documents,
        limits.aiAnalysis,
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      ]);

      quotaResult = await db.query(`
        SELECT * FROM document_intelligence_quotas 
        WHERE user_id = $1
      `, [userId]);
    }

    const quota = quotaResult.rows[0];

    // Check if we need to reset monthly quotas
    if (new Date() >= new Date(quota.next_reset)) {
      await resetUserQuotas(userId);
      quotaResult = await db.query(`
        SELECT * FROM document_intelligence_quotas 
        WHERE user_id = $1
      `, [userId]);
    }

    // Update usage
    const newDocumentsUsed = quota.monthly_documents_used + documentsUsed;
    const newAiAnalysisUsed = quota.monthly_ai_analysis_used + aiAnalysisUsed;

    // Calculate overages
    const documentOverage = Math.max(0, newDocumentsUsed - quota.monthly_document_limit);
    const aiOverage = Math.max(0, newAiAnalysisUsed - (quota.monthly_ai_analysis_limit || 0));

    await db.query(`
      UPDATE document_intelligence_quotas 
      SET 
        monthly_documents_used = $2,
        monthly_ai_analysis_used = $3,
        overage_documents = $4,
        overage_ai_analysis = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [
      userId,
      newDocumentsUsed,
      newAiAnalysisUsed,
      documentOverage,
      aiOverage
    ]);
    
    return {
      documentsUsed: newDocumentsUsed,
      aiAnalysisUsed: newAiAnalysisUsed,
      documentOverage,
      aiOverage
    };

  } catch (error) {
    logger.error('Failed to update user quotas:', error);
    throw new Error('Quota update failed');
  }
}

/**
 * Reset user quotas for new billing period
 */
async function resetUserQuotas(userId) {
  try {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);

    const endOfMonth = new Date(nextMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);

    await db.query(`
      UPDATE document_intelligence_quotas 
      SET 
        monthly_documents_used = 0,
        monthly_ai_analysis_used = 0,
        overage_documents = 0,
        overage_ai_analysis = 0,
        overage_charges = 0.00,
        last_reset = CURRENT_TIMESTAMP,
        billing_period_start = $2,
        billing_period_end = $3,
        next_reset = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [
      userId,
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endOfMonth,
      nextMonth
    ]);

    logger.info('User quotas reset successfully', { userId });

  } catch (error) {
    logger.error('Failed to reset user quotas:', error);
    throw new Error('Quota reset failed');
  }
}

/**
 * Get quota limits based on plan type
 */
function getQuotaLimits(planType) {
  const limits = {
    free: { documents: 5, aiAnalysis: 0 },
    professional: { documents: 100, aiAnalysis: 50 },
    enterprise: { documents: 1000, aiAnalysis: 500 }
  };

  return limits[planType] || limits.free;
}

/**
 * Get user's current usage and quotas
 */
async function getUserUsage(userId) {
  try {
    const result = await db.query(`
        SELECT 
        q.*,
        COALESCE(SUM(u.documents_processed), 0) as total_documents_processed,
        COALESCE(SUM(CASE WHEN u.ai_analysis_type IS NOT NULL THEN 1 ELSE 0 END), 0) as total_ai_analysis,
        COALESCE(SUM(u.billable_amount), 0) as total_spent_this_month
      FROM document_intelligence_quotas q
      LEFT JOIN document_intelligence_usage u ON q.user_id = u.user_id 
        AND DATE_TRUNC('month', u.timestamp) = DATE_TRUNC('month', CURRENT_TIMESTAMP)
      WHERE q.user_id = $1
      GROUP BY q.id
    `, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const usage = result.rows[0];

    return {
      userId,
      planType: usage.plan_type,
      quotas: {
        documents: {
          limit: usage.monthly_document_limit,
          used: usage.monthly_documents_used,
          remaining: Math.max(0, usage.monthly_document_limit - usage.monthly_documents_used),
          overage: usage.overage_documents
        },
        aiAnalysis: {
          limit: usage.monthly_ai_analysis_limit || 0,
          used: usage.monthly_ai_analysis_used,
          remaining: Math.max(0, (usage.monthly_ai_analysis_limit || 0) - usage.monthly_ai_analysis_used),
          overage: usage.overage_ai_analysis
        }
      },
      billing: {
        periodStart: usage.billing_period_start,
        periodEnd: usage.billing_period_end,
        nextReset: usage.next_reset,
        totalSpent: parseFloat(usage.total_spent_this_month) || 0,
        overageCharges: parseFloat(usage.overage_charges) || 0
      }
    };

  } catch (error) {
    logger.error('Failed to get user usage:', error);
    throw new Error('Usage retrieval failed');
  }
}

/**
 * Calculate overage charges
 */
async function calculateOverageCharges(userId) {
  try {
    const usage = await getUserUsage(userId);
    if (!usage) return 0;

    let overageCharges = 0;

    // Document overage: $1 per document over limit
    if (usage.quotas.documents.overage > 0) {
      overageCharges += usage.quotas.documents.overage * 1.00;
    }

    // AI analysis overage: $0.75 per analysis over limit
    if (usage.quotas.aiAnalysis.overage > 0) {
      overageCharges += usage.quotas.aiAnalysis.overage * 0.75;
    }

    // Update overage charges in database
    if (overageCharges > 0) {
      await db.query(`
        UPDATE document_intelligence_quotas 
        SET overage_charges = $2
        WHERE user_id = $1
      `, [userId, overageCharges]);
    }

    return overageCharges;

  } catch (error) {
    logger.error('Failed to calculate overage charges:', error);
    throw new Error('Overage calculation failed');
  }
}

/**
 * Get revenue analytics
 */
async function getRevenueAnalytics(userId, timeRange = '30d') {
  try {
    let dateFilter = '';
    switch (timeRange) {
      case '7d':
        dateFilter = "AND created_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'";
        break;
      case '30d':
        dateFilter = "AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'";
        break;
      case '90d':
        dateFilter = "AND created_at >= CURRENT_TIMESTAMP - INTERVAL '90 days'";
        break;
      default:
        dateFilter = "AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'";
    }

    const result = await db.query(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(amount) as total_revenue,
        AVG(amount) as average_transaction,
        event_type,
        COUNT(*) as event_count
      FROM document_intelligence_revenue 
      WHERE user_id = $1 ${dateFilter}
      GROUP BY event_type
      ORDER BY total_revenue DESC
    `, [userId]);

    const summary = await db.query(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(amount) as total_revenue,
        MIN(amount) as min_transaction,
        MAX(amount) as max_transaction,
        AVG(amount) as average_transaction
      FROM document_intelligence_revenue 
      WHERE user_id = $1 ${dateFilter}
    `, [userId]);
    
    return {
      summary: summary.rows[0] || {
        total_transactions: 0,
        total_revenue: 0,
        min_transaction: 0,
        max_transaction: 0,
        average_transaction: 0
      },
      byEventType: result.rows,
      timeRange
    };

  } catch (error) {
    logger.error('Failed to get revenue analytics:', error);
    throw new Error('Revenue analytics failed');
  }
}

module.exports = {
  trackUsage,
  recordRevenue,
  updateUserQuotas,
  resetUserQuotas,
  getUserUsage,
  calculateOverageCharges,
  getRevenueAnalytics,
  getQuotaLimits
}; 