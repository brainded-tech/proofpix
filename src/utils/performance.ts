// Performance optimization utilities for ProofPix pricing page
import { pricingAnalytics } from './analytics';

export interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  interactionToNextPaint?: number;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  size?: number;
  type: 'script' | 'stylesheet' | 'image' | 'font' | 'other';
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private resourceTimings: ResourceTiming[] = [];
  private observer: PerformanceObserver | null = null;
  private startTime: number;

  constructor() {
    this.startTime = performance.now();
    this.initializeObservers();
    this.trackPageLoad();
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Core Web Vitals observer
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      // Observe different types of performance entries
      this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });

      // Resource timing observer
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handleResourceEntry(entry as PerformanceResourceTiming);
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'navigation':
        this.handleNavigationEntry(entry as PerformanceNavigationTiming);
        break;
      case 'paint':
        this.handlePaintEntry(entry as PerformancePaintTiming);
        break;
      case 'largest-contentful-paint':
        this.handleLCPEntry(entry as any);
        break;
      case 'layout-shift':
        this.handleLayoutShiftEntry(entry as any);
        break;
      case 'first-input':
        this.handleFirstInputEntry(entry as any);
        break;
    }
  }

  private handleNavigationEntry(entry: PerformanceNavigationTiming): void {
    this.metrics.pageLoadTime = entry.loadEventEnd - entry.startTime;
    this.metrics.timeToFirstByte = entry.responseStart - entry.startTime;
  }

  private handlePaintEntry(entry: PerformancePaintTiming): void {
    if (entry.name === 'first-contentful-paint') {
      this.metrics.firstContentfulPaint = entry.startTime;
    }
  }

  private handleLCPEntry(entry: any): void {
    this.metrics.largestContentfulPaint = entry.startTime;
  }

  private handleLayoutShiftEntry(entry: any): void {
    if (!entry.hadRecentInput) {
      this.metrics.cumulativeLayoutShift = (this.metrics.cumulativeLayoutShift || 0) + entry.value;
    }
  }

  private handleFirstInputEntry(entry: any): void {
    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
  }

  private handleResourceEntry(entry: PerformanceResourceTiming): void {
    const resourceType = this.getResourceType(entry.name);
    const size = this.getResourceSize(entry);
    
    this.resourceTimings.push({
      name: entry.name,
      duration: entry.duration,
      size,
      type: resourceType
    });
  }

  private getResourceType(url: string): ResourceTiming['type'] {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
    return 'other';
  }

  private getResourceSize(entry: PerformanceResourceTiming): number | undefined {
    return entry.transferSize || entry.encodedBodySize || undefined;
  }

  private trackPageLoad(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      // Wait a bit for all metrics to be collected
      setTimeout(() => {
        this.reportMetrics();
      }, 1000);
    });
  }

  public reportMetrics(): void {
    const metrics = this.getMetrics();
    
    // Track in analytics
    pricingAnalytics.track({
      event: 'performance_metrics',
      category: 'performance',
      properties: {
        ...metrics,
        userAgent: navigator.userAgent,
        connection: this.getConnectionInfo(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    });

    // Log performance issues
    this.checkPerformanceIssues(metrics);
  }

  private checkPerformanceIssues(metrics: PerformanceMetrics): void {
    const issues: string[] = [];

    if (metrics.pageLoadTime > 3000) {
      issues.push('Slow page load time');
    }

    if (metrics.firstContentfulPaint > 1800) {
      issues.push('Slow first contentful paint');
    }

    if (metrics.largestContentfulPaint > 2500) {
      issues.push('Poor LCP score');
    }

    if (metrics.cumulativeLayoutShift > 0.1) {
      issues.push('High layout shift');
    }

    if (metrics.firstInputDelay > 100) {
      issues.push('Poor input responsiveness');
    }

    if (issues.length > 0) {
      pricingAnalytics.track({
        event: 'performance_issues',
        category: 'performance',
        label: issues.join(', '),
        properties: {
          issues,
          metrics
        }
      });
    }
  }

  private getConnectionInfo(): any {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };
    }
    return null;
  }

  public getMetrics(): PerformanceMetrics {
    return {
      pageLoadTime: this.metrics.pageLoadTime || 0,
      timeToFirstByte: this.metrics.timeToFirstByte || 0,
      firstContentfulPaint: this.metrics.firstContentfulPaint || 0,
      largestContentfulPaint: this.metrics.largestContentfulPaint || 0,
      cumulativeLayoutShift: this.metrics.cumulativeLayoutShift || 0,
      firstInputDelay: this.metrics.firstInputDelay || 0,
      interactionToNextPaint: this.metrics.interactionToNextPaint
    };
  }

  public getResourceTimings(): ResourceTiming[] {
    return [...this.resourceTimings];
  }

  public getPerformanceScore(): number {
    const metrics = this.getMetrics();
    let score = 100;

    // Deduct points for poor metrics
    if (metrics.firstContentfulPaint > 1800) score -= 20;
    if (metrics.largestContentfulPaint > 2500) score -= 25;
    if (metrics.cumulativeLayoutShift > 0.1) score -= 15;
    if (metrics.firstInputDelay > 100) score -= 20;
    if (metrics.pageLoadTime > 3000) score -= 20;

    return Math.max(0, score);
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Image optimization utilities
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private loadedImages: Set<string> = new Set();
  private imageCache: Map<string, HTMLImageElement> = new Map();

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }

  public preloadImage(src: string): Promise<HTMLImageElement> {
    if (this.imageCache.has(src)) {
      return Promise.resolve(this.imageCache.get(src)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(src, img);
        this.loadedImages.add(src);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  public preloadCriticalImages(images: string[]): Promise<void> {
    const promises = images.map(src => this.preloadImage(src));
    return Promise.all(promises).then(() => {});
  }

  public lazyLoadImage(img: HTMLImageElement, src: string): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;
            target.src = src;
            target.classList.remove('lazy');
            observer.unobserve(target);
          }
        });
      });
      observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      img.src = src;
    }
  }

  public optimizeImageFormat(src: string): string {
    // Check for WebP support
    if (this.supportsWebP()) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return src;
  }

  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
}

// Code splitting and lazy loading utilities
export class LazyLoader {
  private static loadedModules: Set<string> = new Set();

  static async loadComponent<T>(
    importFn: () => Promise<{ default: T }>,
    componentName: string
  ): Promise<T> {
    if (this.loadedModules.has(componentName)) {
      return importFn().then(module => module.default);
    }

    const startTime = performance.now();
    
    try {
      const module = await importFn();
      const loadTime = performance.now() - startTime;
      
      this.loadedModules.add(componentName);
      
      // Track component load time
      pricingAnalytics.track({
        event: 'component_loaded',
        category: 'performance',
        label: componentName,
        value: Math.round(loadTime),
        properties: {
          componentName,
          loadTime,
          cacheHit: false
        }
      });

      return module.default;
    } catch (error) {
      pricingAnalytics.track({
        event: 'component_load_error',
        category: 'performance',
        label: componentName,
        properties: {
          componentName,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }

  static preloadComponent(importFn: () => Promise<any>, componentName: string): void {
    // Preload during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.loadComponent(importFn, componentName);
      });
    } else {
      setTimeout(() => {
        this.loadComponent(importFn, componentName);
      }, 100);
    }
  }
}

// Bundle size analyzer
export class BundleAnalyzer {
  static analyzeBundle(): void {
    if (typeof window === 'undefined') return;

    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    let totalScriptSize = 0;
    let totalStyleSize = 0;

    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src;
      if (src) {
        fetch(src, { method: 'HEAD' })
          .then(response => {
            const size = parseInt(response.headers.get('content-length') || '0');
            totalScriptSize += size;
          })
          .catch(() => {});
      }
    });

    stylesheets.forEach(link => {
      const href = (link as HTMLLinkElement).href;
      if (href) {
        fetch(href, { method: 'HEAD' })
          .then(response => {
            const size = parseInt(response.headers.get('content-length') || '0');
            totalStyleSize += size;
          })
          .catch(() => {});
      }
    });

    // Report bundle sizes
    setTimeout(() => {
      pricingAnalytics.track({
        event: 'bundle_analysis',
        category: 'performance',
        properties: {
          scriptCount: scripts.length,
          stylesheetCount: stylesheets.length,
          totalScriptSize,
          totalStyleSize,
          totalSize: totalScriptSize + totalStyleSize
        }
      });
    }, 2000);
  }
}

// Critical CSS inliner
export class CriticalCSS {
  static inlineCriticalCSS(): void {
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      .pricing-hero { display: block; }
      .trust-signals { display: flex; }
      .pricing-cards { display: grid; }
      
      /* Loading states */
      .loading { opacity: 0.7; }
      .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }
}

// Performance budget monitor
export class PerformanceBudget {
  private static budgets = {
    pageLoadTime: 3000,
    firstContentfulPaint: 1800,
    largestContentfulPaint: 2500,
    cumulativeLayoutShift: 0.1,
    firstInputDelay: 100,
    totalBundleSize: 500000 // 500KB
  };

  static checkBudget(metrics: PerformanceMetrics, bundleSize?: number): void {
    const violations: string[] = [];

    Object.entries(this.budgets).forEach(([metric, budget]) => {
      const value = metrics[metric as keyof PerformanceMetrics];
      if (typeof value === 'number' && value > budget) {
        violations.push(`${metric}: ${value} > ${budget}`);
      }
    });

    if (bundleSize && bundleSize > this.budgets.totalBundleSize) {
      violations.push(`Bundle size: ${bundleSize} > ${this.budgets.totalBundleSize}`);
    }

    if (violations.length > 0) {
      pricingAnalytics.track({
        event: 'performance_budget_violation',
        category: 'performance',
        label: violations.join(', '),
        properties: {
          violations,
          metrics,
          bundleSize
        }
      });
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Inline critical CSS
  CriticalCSS.inlineCriticalCSS();
  
  // Analyze bundle on load
  window.addEventListener('load', () => {
    BundleAnalyzer.analyzeBundle();
  });
}

export default performanceMonitor; 