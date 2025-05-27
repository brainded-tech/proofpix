// Privacy-Focused Analytics using Plausible
// No cookies, no personal data collection, GDPR compliant

declare global {
  interface Window {
    plausible: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

class PrivacyAnalytics {
  private isEnabled: boolean = false;
  
  constructor() {
    // Only enable if Plausible script is loaded
    this.isEnabled = typeof window !== 'undefined' && typeof window.plausible === 'function';
  }

  // Track page views automatically handled by Plausible
  trackPageView(page?: string) {
    if (!this.isEnabled) return;
    
    // Plausible automatically tracks page views, but we can track custom events
    if (page) {
      this.trackEvent('Custom Page View', { page });
    }
  }

  // Track feature usage without personal data
  trackEvent(eventName: string, properties?: Record<string, string | number>) {
    if (!this.isEnabled) return;
    
    try {
      window.plausible(eventName, {
        props: properties
      });
    } catch (error: unknown) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  // Track file processing events
  trackFileProcessing(fileType: string, hasGPS: boolean, metadataKeys: number) {
    this.trackEvent('File Processed', {
      file_type: fileType,
      has_gps: hasGPS ? 'yes' : 'no',
      metadata_fields: metadataKeys
    });
  }

  // Track export actions
  trackExport(exportType: 'pdf' | 'json' | 'image', format?: string) {
    this.trackEvent('Export Used', {
      export_type: exportType,
      format: format || 'unknown'
    });
  }

  // Track feature usage
  trackFeatureUsage(feature: string, context?: string) {
    this.trackEvent('Feature Used', {
      feature,
      context: context || 'general'
    });
  }

  // Track errors (anonymized)
  trackError(errorType: string, errorCategory: string) {
    this.trackEvent('Error Occurred', {
      error_type: errorType,
      category: errorCategory
    });
  }

  // Phase 2: Email capture tracking
  trackEmailCapture(trigger: string, data?: any) {
    this.trackEvent('Email Capture', {
      trigger,
      action: data?.action || 'submitted',
      use_case: data?.useCase || 'not_specified'
    });
  }

  // Phase 2: Batch processing tracking
  trackBatchUpload(fileCount: number) {
    this.trackEvent('Batch Upload', {
      file_count: fileCount
    });
  }

  trackBatchProcessingStart(fileCount: number) {
    this.trackEvent('Batch Processing Started', {
      file_count: fileCount
    });
  }

  trackBatchProcessingComplete(total: number, successful: number, errors: number) {
    this.trackEvent('Batch Processing Complete', {
      total_files: total,
      successful_files: successful,
      error_files: errors,
      success_rate: Math.round((successful / total) * 100)
    });
  }

  trackBatchProcessingError(error: any) {
    this.trackEvent('Batch Processing Error', {
      error_type: error?.name || 'unknown',
      error_message: error?.message?.substring(0, 50) || 'unknown'
    });
  }

  trackBatchProcessingCancelled() {
    this.trackEvent('Batch Processing Cancelled');
  }

  trackBatchExport(fileCount: number) {
    this.trackEvent('Batch Export', {
      file_count: fileCount
    });
  }

  // Phase 2: Enterprise tracking
  trackEnterpriseInquiry(trigger: string, useCase: string) {
    this.trackEvent('Enterprise Inquiry', {
      trigger,
      use_case: useCase
    });
  }

  // Phase 2: Advanced analytics tracking
  trackAnalyticsDashboardView(timeRange: string) {
    this.trackEvent('Analytics Dashboard View', {
      time_range: timeRange
    });
  }

  trackAnalyticsExport(format: string) {
    this.trackEvent('Analytics Export', {
      format
    });
  }

  // Phase 2: Comparison tool tracking
  trackComparisonToolUsage(fileCount: number, hasResults: boolean) {
    this.trackEvent('Comparison Tool Used', {
      file_count: fileCount,
      has_results: hasResults ? 'yes' : 'no'
    });
  }

  // Phase 2: Usage limit tracking
  trackUsageLimitReached(limitType: string, currentUsage: number, limit: number) {
    this.trackEvent('Usage Limit Reached', {
      limit_type: limitType,
      current_usage: currentUsage,
      limit_value: limit,
      usage_percentage: Math.round((currentUsage / limit) * 100)
    });
  }

  // Phase 2: Upgrade prompt tracking
  trackUpgradePrompt(trigger: string, action: 'shown' | 'clicked' | 'dismissed') {
    this.trackEvent('Upgrade Prompt', {
      trigger,
      action
    });
  }
}

// Create singleton instance
export const analytics = new PrivacyAnalytics();

// Helper functions for common tracking events
export const trackFileUpload = (fileType: string, fileSize: number) => {
  analytics.trackEvent('File Upload', {
    file_type: fileType,
    file_size_mb: Math.round(fileSize / (1024 * 1024))
  });
};

export const trackTimestampOverlay = () => {
  analytics.trackFeatureUsage('Timestamp Overlay');
};

export const trackPDFExport = () => {
  analytics.trackExport('pdf');
};

export const trackEnterpriseTrialSignup = (companySize?: string) => {
  analytics.trackEvent('Enterprise Trial Signup', {
    company_size: companySize || 'unknown',
    timestamp: new Date().toISOString()
  });
};

export const trackEnterpriseDemo = (source: string) => {
  analytics.trackEvent('Enterprise Demo Request', {
    source,
    timestamp: new Date().toISOString()
  });
};

export const trackJSONExport = () => {
  analytics.trackExport('json');
};

export const trackImageExport = (format: string) => {
  analytics.trackExport('image', format);
};

// Usage tracking for displaying stats
export class UsageTracker {
  private storageKey = 'proofpix_usage_stats';
  private limitsKey = 'proofpix_usage_limits';

  getUsageStats() {
    const stored = localStorage.getItem(this.storageKey);
    const defaultStats = {
      uploads: 0,
      pdfDownloads: 0,
      imageDownloads: 0,
      dataExports: 0,
      batchProcessing: 0,
      comparisons: 0,
      imagesProcessed: 0,
      lastReset: new Date().toDateString()
    };

    if (!stored) {
      return defaultStats;
    }

    try {
      const stats = JSON.parse(stored);
      
      // Reset daily stats if it's a new day
      if (stats.lastReset !== new Date().toDateString()) {
        return defaultStats;
      }
      
      return { ...defaultStats, ...stats };
    } catch {
      return defaultStats;
    }
  }

  // Phase 2: Get current usage for limit checking
  getCurrentUsage() {
    return this.getUsageStats();
  }

  // Phase 2: Get usage limits based on tier
  getLimits() {
    const stored = localStorage.getItem(this.limitsKey);
    const defaultLimits = {
      imagesPerSession: 5,
      pdfExportsPerDay: 2,
      dataExportsPerDay: 1,
      comparisonsPerDay: 3,
      batchProcessingPerDay: 0, // Free tier doesn't get batch processing
      tier: 'free'
    };

    if (!stored) {
      return defaultLimits;
    }

    try {
      return { ...defaultLimits, ...JSON.parse(stored) };
    } catch {
      return defaultLimits;
    }
  }

  // Phase 2: Set user tier and limits
  setUserTier(tier: 'free' | 'pro' | 'teams' | 'enterprise') {
    const limits = {
      free: {
        imagesPerSession: 5,
        pdfExportsPerDay: 2,
        dataExportsPerDay: 1,
        comparisonsPerDay: 3,
        batchProcessingPerDay: 0,
        tier: 'free'
      },
      pro: {
        imagesPerSession: 50,
        pdfExportsPerDay: -1, // unlimited
        dataExportsPerDay: -1, // unlimited
        comparisonsPerDay: -1, // unlimited
        batchProcessingPerDay: -1, // unlimited
        tier: 'pro'
      },
      teams: {
        imagesPerSession: -1, // unlimited
        pdfExportsPerDay: -1, // unlimited
        dataExportsPerDay: -1, // unlimited
        comparisonsPerDay: -1, // unlimited
        batchProcessingPerDay: -1, // unlimited
        tier: 'teams'
      },
      enterprise: {
        imagesPerSession: -1, // unlimited
        pdfExportsPerDay: -1, // unlimited
        dataExportsPerDay: -1, // unlimited
        comparisonsPerDay: -1, // unlimited
        batchProcessingPerDay: -1, // unlimited
        tier: 'enterprise'
      }
    };

    localStorage.setItem(this.limitsKey, JSON.stringify(limits[tier]));
  }

  // Phase 2: Check if action is allowed
  canPerformAction(action: 'upload' | 'pdf_export' | 'data_export' | 'comparison' | 'batch_processing'): boolean {
    // 🚀 LOCAL DEVELOPMENT BYPASS: Allow all actions in local development
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || 
                         hostname === '127.0.0.1' || 
                         hostname.includes('localhost');
      
      console.log(`🔍 UsageTracker Debug:`, {
        action,
        hostname,
        isLocalhost,
        fullUrl: window.location.href
      });
      
      if (isLocalhost) {
        console.log(`🚀 UsageTracker local development bypass: Allowing ${action}`);
        return true;
      }
    }

    const usage = this.getCurrentUsage();
    const limits = this.getLimits();

    switch (action) {
      case 'upload':
        return limits.imagesPerSession === -1 || usage.uploads < limits.imagesPerSession;
      case 'pdf_export':
        return limits.pdfExportsPerDay === -1 || usage.pdfDownloads < limits.pdfExportsPerDay;
      case 'data_export':
        return limits.dataExportsPerDay === -1 || usage.dataExports < limits.dataExportsPerDay;
      case 'comparison':
        return limits.comparisonsPerDay === -1 || usage.comparisons < limits.comparisonsPerDay;
      case 'batch_processing':
        return limits.batchProcessingPerDay === -1 || usage.batchProcessing < limits.batchProcessingPerDay;
      default:
        return false;
    }
  }

  incrementUpload() {
    this.incrementStat('uploads');
  }

  incrementPdfDownload() {
    this.incrementStat('pdfDownloads');
  }

  incrementImageDownload() {
    this.incrementStat('imageDownloads');
  }

  incrementDataExport() {
    this.incrementStat('dataExports');
  }

  trackDataExport() {
    this.incrementDataExport();
  }

  // Phase 2: New tracking methods
  incrementBatchProcessing() {
    this.incrementStat('batchProcessing');
  }

  incrementComparison() {
    this.incrementStat('comparisons');
  }

  trackImageProcessed() {
    this.incrementStat('imagesProcessed');
  }

  resetStats() {
    localStorage.removeItem(this.storageKey);
  }

  private incrementStat(statName: keyof ReturnType<typeof this.getUsageStats>) {
    const stats = this.getUsageStats();
    if (typeof stats[statName] === 'number') {
      (stats[statName] as number)++;
      localStorage.setItem(this.storageKey, JSON.stringify(stats));
    }
  }
}

export const usageTracker = new UsageTracker(); 