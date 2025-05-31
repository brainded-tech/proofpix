const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { requireAuth, requireSubscription } = require('../middleware/auth');
const { trackUsage, recordRevenue } = require('../services/billing');
const { processDocument, analyzeDocument } = require('../services/documentProcessor');
const { getIndustryTemplates } = require('../services/templates');

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff'];
    cb(null, allowedTypes.includes(file.mimetype));
  }
});

/**
 * POST /api/document-intelligence/process
 * Revenue Critical - Core Processing Endpoint
 */
router.post('/process', requireAuth, requireSubscription('professional'), upload.single('document'), async (req, res) => {
  try {
    const { userId, subscriptionTier: planType } = req.user;
    const { documentType, options } = req.body;
    const processId = uuidv4();

    // Validate plan permissions
    const planLimits = {
      free: { monthlyQuota: 5, aiAnalysis: false, industryTemplates: false },
      professional: { monthlyQuota: 100, aiAnalysis: true, industryTemplates: true },
      enterprise: { monthlyQuota: 1000, aiAnalysis: true, industryTemplates: true }
    };

    const userLimits = planLimits[planType];
    if (!userLimits) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    // Check if AI analysis is requested but not available in plan
    if (options?.aiAnalysis && !userLimits.aiAnalysis) {
      return res.status(403).json({ 
        error: 'AI analysis requires Professional or Enterprise plan',
        upgradeRequired: true 
      });
    }

    // Process the document
    const startTime = Date.now();
    const results = await processDocument({
      file: req.file,
      documentType,
      options,
      planType,
      processId
    });
    const processingTime = (Date.now() - startTime) / 1000;

    // Calculate billing
    let billableAmount = 0;
    const baseCost = { free: 0.99, professional: 2.99, enterprise: 4.99 };
    billableAmount += baseCost[planType];

    if (options?.aiAnalysis && userLimits.aiAnalysis) {
      billableAmount += 0.50; // AI analysis surcharge
    }

    // Track usage in database
    await trackUsage({
      userId,
      documentId: processId,
      planType,
      documentsProcessed: 1,
      templateUsed: options?.industryTemplate,
      processingTimeSeconds: processingTime,
      confidenceScore: results.confidence,
      billableAmount,
      metadata: { documentType, options }
    });

    // Record revenue event
    await recordRevenue({
      userId,
      amount: billableAmount,
      planType,
      eventType: 'document_processing',
      source: 'document_intelligence',
      transactionId: processId,
      metadata: { documentType, processingTime }
    });

    // Get current usage for response
    const currentUsage = await getCurrentUsage(userId);

    res.json({
      success: true,
      processId,
      results: {
        metadata: results.metadata,
        aiInsights: results.aiInsights,
        confidence: results.confidence,
        processingTime
      },
      usage: {
        documentsProcessed: currentUsage.documentsThisMonth,
        remainingQuota: userLimits.monthlyQuota - currentUsage.documentsThisMonth
      },
      billing: {
        cost: billableAmount,
        planType
      }
    });

  } catch (error) {
    console.error('Document processing error:', error);
    res.status(500).json({ 
      error: 'Processing failed', 
      message: error.message 
    });
  }
});

/**
 * GET /api/document-intelligence/templates
 * Industry Templates Endpoint
 */
router.get('/templates', requireAuth, requireSubscription('professional'), async (req, res) => {
  try {
    const { subscriptionTier: planType } = req.user;
    
    const templates = await getIndustryTemplates(planType);
    
    res.json({
      templates,
      planType,
      upgradeRequired: planType === 'free'
    });

  } catch (error) {
    console.error('Templates fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

/**
 * POST /api/document-intelligence/analyze
 * AI Analysis Endpoint
 */
router.post('/analyze', requireAuth, requireSubscription('professional'), async (req, res) => {
  try {
    const { userId, subscriptionTier: planType } = req.user;
    const { processId, analysisType } = req.body;

    // Verify plan supports AI analysis
    if (planType === 'free') {
      return res.status(403).json({
        error: 'AI analysis requires Professional or Enterprise plan',
        upgradeRequired: true
      });
    }

    // Perform AI analysis
    const analysis = await analyzeDocument({
      processId,
      analysisType,
      planType
    });

    // Calculate billing for AI analysis
    const analysisCost = 0.50;
    
    // Track usage
    await trackUsage({
      userId,
      documentId: processId,
      planType,
      aiAnalysisType: analysisType,
      billableAmount: analysisCost,
      metadata: { analysisType }
    });

    // Record revenue
    await recordRevenue({
      userId,
      amount: analysisCost,
      planType,
      eventType: 'ai_analysis',
      source: 'document_intelligence',
      transactionId: `${processId}_analysis`,
      metadata: { analysisType, processId }
    });

    res.json({
      analysis,
      billableEvent: {
        type: 'ai_analysis',
        cost: analysisCost,
        planType
      }
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

/**
 * GET /api/document-intelligence/usage/:userId
 * Billing Metrics Endpoint
 */
router.get('/usage/:userId', requireAuth, requireSubscription('professional'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { subscriptionTier: planType } = req.user;

    // Verify user can access this data
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const usage = await getDetailedUsage(userId);
    const revenue = await getRevenueMetrics(userId);

    res.json({
      userId,
      currentPlan: planType,
      billingPeriod: getCurrentBillingPeriod(),
      usage,
      revenue
    });

  } catch (error) {
    console.error('Usage fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

// Helper functions
async function getCurrentUsage(userId) {
  const { getUserUsage } = require('../services/billing');
  
  try {
    const usage = await getUserUsage(userId);
    if (!usage) {
      return {
        documentsThisMonth: 0,
        totalSpent: 0
      };
    }
    
    return {
      documentsThisMonth: usage.quotas.documents.used,
      totalSpent: usage.billing.totalSpent
    };
  } catch (error) {
    console.error('Error getting current usage:', error);
    return {
      documentsThisMonth: 0,
      totalSpent: 0
    };
  }
}

async function getDetailedUsage(userId) {
  const { getUserUsage } = require('../services/billing');
  
  try {
    const usage = await getUserUsage(userId);
    if (!usage) {
      return {
        documentsProcessed: 0,
        quotaLimit: 5,
        aiAnalysisCount: 0,
        templateUsage: {}
      };
    }
    
    return {
      documentsProcessed: usage.quotas.documents.used,
      quotaLimit: usage.quotas.documents.limit,
      aiAnalysisCount: usage.quotas.aiAnalysis.used,
      templateUsage: {} // TODO: Implement template usage tracking
    };
  } catch (error) {
    console.error('Error getting detailed usage:', error);
    return {
      documentsProcessed: 0,
      quotaLimit: 5,
      aiAnalysisCount: 0,
      templateUsage: {}
    };
  }
}

async function getRevenueMetrics(userId) {
  const { getRevenueAnalytics } = require('../services/billing');
  
  try {
    const analytics = await getRevenueAnalytics(userId, '30d');
    
    return {
      monthlyRevenue: analytics.summary.total_revenue || 0,
      overage: 0.00, // TODO: Calculate based on plan limits
      nextBillingDate: getNextBillingDate()
    };
  } catch (error) {
    console.error('Error getting revenue metrics:', error);
    return {
      monthlyRevenue: 0,
      overage: 0.00,
      nextBillingDate: getNextBillingDate()
    };
  }
}

function getCurrentBillingPeriod() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  
  return `${year}-${month}-01_to_${year}-${month}-${lastDay}`;
}

function getNextBillingDate() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString().split('T')[0];
}

module.exports = router; 