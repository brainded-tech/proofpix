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
    } catch (error) {
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

export const trackJSONExport = () => {
  analytics.trackExport('json');
};

export const trackImageExport = (format: string) => {
  analytics.trackExport('image', format);
};

// Usage tracking for displaying stats
export class UsageTracker {
  private storageKey = 'proofpix_usage_stats';

  getUsageStats() {
    const stored = localStorage.getItem(this.storageKey);
    const defaultStats = {
      uploads: 0,
      pdfDownloads: 0,
      imageDownloads: 0,
      dataExports: 0,
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
      
      return stats;
    } catch {
      return defaultStats;
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

  private incrementStat(statName: keyof ReturnType<typeof this.getUsageStats>) {
    const stats = this.getUsageStats();
    if (typeof stats[statName] === 'number') {
      (stats[statName] as number)++;
      localStorage.setItem(this.storageKey, JSON.stringify(stats));
    }
  }
}

export const usageTracker = new UsageTracker(); 