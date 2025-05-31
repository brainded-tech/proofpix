/**
 * Analytics Service - Production Optimization
 * Comprehensive analytics and performance tracking service
 */

interface AnalyticsEvent {
  id: string;
  timestamp: Date;
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  category: 'performance' | 'user' | 'business' | 'technical';
  metadata?: Record<string, any>;
}

interface AnalyticsConfig {
  enableTracking: boolean;
  enablePerformanceMonitoring: boolean;
  enableErrorTracking: boolean;
  enableUserBehavior: boolean;
  sampleRate: number;
  batchSize: number;
  flushInterval: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private metrics: PerformanceMetric[] = [];
  private config: AnalyticsConfig;
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = {
      enableTracking: true,
      enablePerformanceMonitoring: true,
      enableErrorTracking: true,
      enableUserBehavior: true,
      sampleRate: 1.0,
      batchSize: 50,
      flushInterval: 30000 // 30 seconds
    };

    this.startPerformanceMonitoring();
    this.setupFlushTimer();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Event Tracking
  trackEvent(category: string, action: string, label?: string, value?: number, metadata?: Record<string, any>): void {
    if (!this.config.enableTracking) return;

    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      category,
      action,
      label,
      value,
      metadata,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    };

    this.events.push(event);
    this.checkFlush();
  }

  // Feature Usage Tracking
  trackFeatureUsage(feature: string, action: string, metadata?: Record<string, any>): void {
    this.trackEvent('Feature', `${feature}_${action}`, feature, 1, metadata);
  }

  // Performance Metrics
  trackPerformanceMetric(name: string, value: number, category: 'performance' | 'user' | 'business' | 'technical' = 'performance', metadata?: Record<string, any>): void {
    if (!this.config.enablePerformanceMonitoring) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      category,
      metadata
    };

    this.metrics.push(metric);
  }

  // Page View Tracking
  trackPageView(page: string, metadata?: Record<string, any>): void {
    this.trackEvent('Navigation', 'Page View', page, 1, {
      ...metadata,
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });
  }

  // User Interaction Tracking
  trackUserInteraction(element: string, action: string, metadata?: Record<string, any>): void {
    if (!this.config.enableUserBehavior) return;
    
    this.trackEvent('User Interaction', action, element, 1, metadata);
  }

  // Error Tracking
  trackError(error: Error | string, context?: Record<string, any>): void {
    if (!this.config.enableErrorTracking) return;

    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    this.trackEvent('Error', 'Application Error', errorMessage, 1, {
      ...context,
      stack: errorStack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }

  // Business Metrics
  trackBusinessMetric(metric: string, value: number, metadata?: Record<string, any>): void {
    this.trackPerformanceMetric(metric, value, 'business', metadata);
  }

  // Performance Monitoring
  private startPerformanceMonitoring(): void {
    if (!this.config.enablePerformanceMonitoring) return;

    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          this.trackPerformanceMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
          this.trackPerformanceMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
          this.trackPerformanceMetric('first_byte_time', navigation.responseStart - navigation.fetchStart);
        }
      }, 0);
    });

    // Track resource performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.trackPerformanceMetric('resource_load_time', resourceEntry.duration, 'performance', {
            resource: resourceEntry.name,
            type: this.getResourceType(resourceEntry.name)
          });
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });

    // Track Core Web Vitals
    this.trackCoreWebVitals();
  }

  private trackCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.trackPerformanceMetric('largest_contentful_paint', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as any;
        this.trackPerformanceMetric('first_input_delay', fidEntry.processingStart - fidEntry.startTime);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
      this.trackPerformanceMetric('cumulative_layout_shift', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif') || url.includes('.webp')) return 'image';
    if (url.includes('.woff') || url.includes('.woff2') || url.includes('.ttf')) return 'font';
    return 'other';
  }

  // Data Retrieval
  getEvents(filter?: Partial<AnalyticsEvent>): AnalyticsEvent[] {
    if (!filter) return [...this.events];

    return this.events.filter(event => {
      return Object.entries(filter).every(([key, value]) => {
        return event[key as keyof AnalyticsEvent] === value;
      });
    });
  }

  getMetrics(filter?: Partial<PerformanceMetric>): PerformanceMetric[] {
    if (!filter) return [...this.metrics];

    return this.metrics.filter(metric => {
      return Object.entries(filter).every(([key, value]) => {
        return metric[key as keyof PerformanceMetric] === value;
      });
    });
  }

  // Analytics Aggregation
  getEventSummary(timeRange?: { start: Date; end: Date }): Record<string, any> {
    const filteredEvents = timeRange 
      ? this.events.filter(e => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end)
      : this.events;

    const summary = {
      totalEvents: filteredEvents.length,
      categories: {} as Record<string, number>,
      actions: {} as Record<string, number>,
      uniqueUsers: new Set(filteredEvents.map(e => e.userId).filter(Boolean)).size,
      uniqueSessions: new Set(filteredEvents.map(e => e.sessionId).filter(Boolean)).size
    };

    filteredEvents.forEach(event => {
      summary.categories[event.category] = (summary.categories[event.category] || 0) + 1;
      summary.actions[event.action] = (summary.actions[event.action] || 0) + 1;
    });

    return summary;
  }

  getPerformanceSummary(timeRange?: { start: Date; end: Date }): Record<string, any> {
    const filteredMetrics = timeRange 
      ? this.metrics.filter(m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end)
      : this.metrics;

    const summary = {
      totalMetrics: filteredMetrics.length,
      averages: {} as Record<string, number>,
      categories: {} as Record<string, number>
    };

    const metricGroups = filteredMetrics.reduce((groups, metric) => {
      if (!groups[metric.name]) groups[metric.name] = [];
      groups[metric.name].push(metric.value);
      return groups;
    }, {} as Record<string, number[]>);

    Object.entries(metricGroups).forEach(([name, values]) => {
      summary.averages[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    filteredMetrics.forEach(metric => {
      summary.categories[metric.category] = (summary.categories[metric.category] || 0) + 1;
    });

    return summary;
  }

  // Configuration
  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.setupFlushTimer();
    }
  }

  // Data Management
  private setupFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private checkFlush(): void {
    if (this.events.length >= this.config.batchSize) {
      this.flush();
    }
  }

  private flush(): void {
    if (this.events.length === 0 && this.metrics.length === 0) return;

    // In a real implementation, this would send data to analytics backend
    console.log('Analytics flush:', {
      events: this.events.length,
      metrics: this.metrics.length,
      timestamp: new Date().toISOString()
    });

    // Clear local storage
    this.events = [];
    this.metrics = [];
  }

  // Utility Methods
  private getCurrentUserId(): string | undefined {
    // In a real implementation, this would get the current user ID
    return localStorage.getItem('userId') || undefined;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  // Export Data
  exportData(format: 'json' | 'csv' = 'json'): string {
    const data = {
      events: this.events,
      metrics: this.metrics,
      summary: this.getEventSummary(),
      performance: this.getPerformanceSummary(),
      exportedAt: new Date().toISOString()
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else {
      // Simple CSV export for events
      const csvHeaders = 'timestamp,category,action,label,value,userId,sessionId\n';
      const csvRows = this.events.map(event => 
        `${event.timestamp.toISOString()},${event.category},${event.action},${event.label || ''},${event.value || ''},${event.userId || ''},${event.sessionId}`
      ).join('\n');
      return csvHeaders + csvRows;
    }
  }

  // Cleanup
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush(); // Final flush before cleanup
  }
}

export const analyticsService = AnalyticsService.getInstance(); 