/**
 * Enhanced Bundle Optimizer for ProofPix Enterprise
 * Handles code splitting, lazy loading, asset optimization, and bundle analysis
 */

import React from 'react';

interface BundleMetrics {
  totalSize: number;
  gzippedSize: number;
  chunkCount: number;
  loadTime: number;
  cacheHitRate: number;
  compressionRatio: number;
}

interface AssetOptimizationConfig {
  enableImageOptimization: boolean;
  enableCodeSplitting: boolean;
  enableLazyLoading: boolean;
  enablePreloading: boolean;
  compressionLevel: 'low' | 'medium' | 'high';
  cacheStrategy: 'aggressive' | 'moderate' | 'conservative';
}

interface LazyLoadableComponent {
  name: string;
  loader: () => Promise<any>;
  priority: 'high' | 'medium' | 'low';
  preload?: boolean;
}

export class BundleOptimizer {
  private static instance: BundleOptimizer;
  private loadedChunks = new Set<string>();
  private preloadedAssets = new Set<string>();
  private lazyComponents = new Map<string, LazyLoadableComponent>();
  private bundleMetrics: BundleMetrics = {
    totalSize: 0,
    gzippedSize: 0,
    chunkCount: 0,
    loadTime: 0,
    cacheHitRate: 0,
    compressionRatio: 0
  };
  private config: AssetOptimizationConfig;

  private constructor() {
    this.config = {
      enableImageOptimization: true,
      enableCodeSplitting: true,
      enableLazyLoading: true,
      enablePreloading: true,
      compressionLevel: 'high',
      cacheStrategy: 'aggressive'
    };
    this.initializeBundleOptimization();
  }

  static getInstance(): BundleOptimizer {
    if (!BundleOptimizer.instance) {
      BundleOptimizer.instance = new BundleOptimizer();
    }
    return BundleOptimizer.instance;
  }

  private initializeBundleOptimization(): void {
    if (typeof window !== 'undefined') {
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      // Initialize lazy loading
      this.initializeLazyLoading();
      
      // Setup resource hints
      this.setupResourceHints();
      
      // Analyze current bundle
      this.analyzeBundleSize();
      
      // Setup service worker for caching
      this.setupServiceWorker();
    }
  }

  // Performance monitoring
  private setupPerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordPerformanceEntry(entry);
        }
      });
      
      observer.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
    }

    // Monitor bundle load times
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.calculateBundleMetrics();
      }, 1000);
    });
  }

  private recordPerformanceEntry(entry: PerformanceEntry): void {
    if (entry.entryType === 'navigation') {
      const navEntry = entry as PerformanceNavigationTiming;
      this.bundleMetrics.loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
    }
    
    if (entry.entryType === 'resource') {
      const resourceEntry = entry as PerformanceResourceTiming;
      if (resourceEntry.name.includes('.js') || resourceEntry.name.includes('.css')) {
        this.bundleMetrics.totalSize += resourceEntry.transferSize || 0;
      }
    }
  }

  // Code splitting and lazy loading
  registerLazyComponent(component: LazyLoadableComponent): void {
    this.lazyComponents.set(component.name, component);
    
    // Preload high priority components
    if (component.priority === 'high' && component.preload) {
      this.preloadComponent(component.name);
    }
  }

  async loadComponent(name: string): Promise<any> {
    const component = this.lazyComponents.get(name);
    if (!component) {
      throw new Error(`Component ${name} not registered`);
    }

    const startTime = performance.now();
    
    try {
      const loadedComponent = await component.loader();
      const loadTime = performance.now() - startTime;
      
      this.loadedChunks.add(name);
      
      console.log(`📦 Lazy loaded component: ${name} (${loadTime.toFixed(2)}ms)`);
      
      return loadedComponent;
    } catch (error) {
      console.error(`❌ Failed to load component: ${name}`, error);
      throw error;
    }
  }

  private async preloadComponent(name: string): Promise<void> {
    if (this.preloadedAssets.has(name)) return;
    
    const component = this.lazyComponents.get(name);
    if (!component) return;

    try {
      // Preload without executing
      const modulePromise = component.loader();
      this.preloadedAssets.add(name);
      
      // Store the promise for later use
      (window as any).__preloadedModules = (window as any).__preloadedModules || {};
      (window as any).__preloadedModules[name] = modulePromise;
      
      console.log(`🚀 Preloaded component: ${name}`);
    } catch (error) {
      console.warn(`⚠️ Failed to preload component: ${name}`, error);
    }
  }

  // Lazy loading initialization
  private initializeLazyLoading(): void {
    if (!this.config.enableLazyLoading) return;

    // Setup intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.handleLazyLoad(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px'
      });

      // Observe elements with lazy loading attributes
      document.addEventListener('DOMContentLoaded', () => {
        const lazyElements = document.querySelectorAll('[data-lazy-load]');
        lazyElements.forEach(element => observer.observe(element));
      });
    }
  }

  private async handleLazyLoad(element: HTMLElement): Promise<void> {
    const componentName = element.getAttribute('data-lazy-load');
    if (!componentName) return;

    try {
      const component = await this.loadComponent(componentName);
      
      // Replace placeholder with actual component
      if (component.default) {
        // Handle React components or similar
        element.innerHTML = ''; // Clear placeholder
        // Component rendering would be handled by the framework
      }
    } catch (error) {
      console.error('Failed to lazy load component:', error);
      element.innerHTML = '<div class="error">Failed to load component</div>';
    }
  }

  // Resource hints and preloading
  private setupResourceHints(): void {
    if (!this.config.enablePreloading) return;

    // Critical resources to preload
    const criticalResources = [
      '/static/css/main.css',
      '/static/js/vendor.js',
      '/static/js/main.js'
    ];

    criticalResources.forEach(resource => {
      this.preloadResource(resource);
    });

    // DNS prefetch for external domains
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdn.jsdelivr.net'
    ];

    externalDomains.forEach(domain => {
      this.dnsPrefetch(domain);
    });
  }

  preloadResource(href: string, as?: string): void {
    if (this.preloadedAssets.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    
    if (as) {
      link.as = as;
    } else {
      // Auto-detect resource type
      if (href.endsWith('.css')) {
        link.as = 'style';
      } else if (href.endsWith('.js')) {
        link.as = 'script';
      } else if (href.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
        link.as = 'image';
      } else if (href.match(/\.(woff|woff2|ttf|otf)$/)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }
    }
    
    link.onload = () => {
      console.log(`✅ Preloaded: ${href}`);
    };
    
    link.onerror = () => {
      console.warn(`❌ Failed to preload: ${href}`);
    };
    
    document.head.appendChild(link);
    this.preloadedAssets.add(href);
  }

  private dnsPrefetch(domain: string): void {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  }

  // Image optimization
  optimizeImage(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
    lazy?: boolean;
  } = {}): string {
    if (!this.config.enableImageOptimization) return src;

    const params = new URLSearchParams();
    
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('f', options.format);
    
    // In a real implementation, this would use an image optimization service
    const optimizedSrc = `${src}?${params.toString()}`;
    
    // Add to preload if not lazy
    if (!options.lazy) {
      this.preloadResource(optimizedSrc, 'image');
    }
    
    return optimizedSrc;
  }

  // Service Worker setup for caching
  private setupServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('🔧 Service Worker registered:', registration);
          this.setupCacheStrategy(registration);
        })
        .catch(error => {
          console.warn('Service Worker registration failed:', error);
        });
    }
  }

  private setupCacheStrategy(registration: ServiceWorkerRegistration): void {
    // Send cache strategy to service worker
    if (registration.active) {
      registration.active.postMessage({
        type: 'CACHE_STRATEGY',
        strategy: this.config.cacheStrategy
      });
    }
  }

  // Bundle analysis
  private analyzeBundleSize(): void {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    let totalSize = 0;
    let loadedResources = 0;
    const totalResources = scripts.length + stylesheets.length;

    const checkComplete = () => {
      loadedResources++;
      if (loadedResources === totalResources) {
        this.bundleMetrics.totalSize = totalSize;
        this.bundleMetrics.chunkCount = scripts.length;
        this.calculateCompressionRatio();
        this.reportBundleAnalysis();
      }
    };

    // Analyze script sizes
    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src;
      if (src && !src.startsWith('data:')) {
        fetch(src, { method: 'HEAD' })
          .then(response => {
            const size = parseInt(response.headers.get('content-length') || '0');
            totalSize += size;
          })
          .catch(() => {})
          .finally(checkComplete);
      } else {
        checkComplete();
      }
    });

    // Analyze stylesheet sizes
    stylesheets.forEach(link => {
      const href = (link as HTMLLinkElement).href;
      if (href && !href.startsWith('data:')) {
        fetch(href, { method: 'HEAD' })
          .then(response => {
            const size = parseInt(response.headers.get('content-length') || '0');
            totalSize += size;
          })
          .catch(() => {})
          .finally(checkComplete);
      } else {
        checkComplete();
      }
    });
  }

  private calculateCompressionRatio(): void {
    // Estimate compression ratio based on content type
    this.bundleMetrics.compressionRatio = 0.7; // Typical gzip ratio
    this.bundleMetrics.gzippedSize = Math.floor(this.bundleMetrics.totalSize * this.bundleMetrics.compressionRatio);
  }

  private reportBundleAnalysis(): void {
    const analysis = {
      totalSize: `${(this.bundleMetrics.totalSize / 1024).toFixed(2)} KB`,
      gzippedSize: `${(this.bundleMetrics.gzippedSize / 1024).toFixed(2)} KB`,
      chunkCount: this.bundleMetrics.chunkCount,
      loadTime: `${this.bundleMetrics.loadTime.toFixed(2)}ms`,
      compressionRatio: `${(this.bundleMetrics.compressionRatio * 100).toFixed(1)}%`,
      recommendations: this.generateOptimizationRecommendations()
    };

    console.log('📊 Bundle Analysis:', analysis);

    // Report performance issues
    if (this.bundleMetrics.totalSize > 500000) { // 500KB
      this.reportPerformanceIssue('Large bundle size', {
        currentSize: this.bundleMetrics.totalSize,
        recommendation: 'Consider code splitting and lazy loading'
      });
    }

    if (this.bundleMetrics.loadTime > 3000) { // 3 seconds
      this.reportPerformanceIssue('Slow bundle load time', {
        currentTime: this.bundleMetrics.loadTime,
        recommendation: 'Optimize critical rendering path'
      });
    }
  }

  private generateOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.bundleMetrics.totalSize > 500000) {
      recommendations.push('Implement code splitting for large bundles');
    }

    if (this.bundleMetrics.chunkCount < 3) {
      recommendations.push('Consider splitting vendor and app code');
    }

    if (this.bundleMetrics.loadTime > 2000) {
      recommendations.push('Preload critical resources');
      recommendations.push('Implement resource hints (dns-prefetch, preconnect)');
    }

    if (this.loadedChunks.size < this.lazyComponents.size * 0.5) {
      recommendations.push('More components can be lazy loaded');
    }

    return recommendations;
  }

  // Tree shaking analysis
  analyzeUnusedCode(): {
    unusedModules: string[];
    unusedExports: string[];
    potentialSavings: number;
  } {
    // This would require build-time analysis in a real implementation
    // For demo purposes, we'll simulate the analysis
    
    const unusedModules = [
      'lodash/debounce', // If using native debounce
      'moment', // If using date-fns instead
      'jquery' // If using vanilla JS
    ];

    const unusedExports = [
      'utils.formatDate', // If not used
      'components.OldButton', // If deprecated
      'helpers.legacyFunction' // If replaced
    ];

    const potentialSavings = unusedModules.length * 15000 + unusedExports.length * 5000; // Estimated bytes

    return {
      unusedModules,
      unusedExports,
      potentialSavings
    };
  }

  // Dynamic imports helper
  async dynamicImport<T>(
    moduleFactory: () => Promise<T>,
    options: {
      retries?: number;
      timeout?: number;
      fallback?: () => T;
    } = {}
  ): Promise<T> {
    const { retries = 3, timeout = 10000, fallback } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Import timeout')), timeout);
        });

        const module = await Promise.race([
          moduleFactory(),
          timeoutPromise
        ]);

        return module;
      } catch (error) {
        console.warn(`Import attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          if (fallback) {
            console.log('Using fallback module');
            return fallback();
          }
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new Error('All import attempts failed');
  }

  // Critical CSS extraction
  extractCriticalCSS(): string {
    const criticalStyles: string[] = [];
    
    // Get styles for above-the-fold content
    const viewportHeight = window.innerHeight;
    const aboveFoldElements = document.elementsFromPoint(
      window.innerWidth / 2,
      viewportHeight / 2
    );

    aboveFoldElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      // Extract critical styles (simplified)
      const criticalProps = [
        'display', 'position', 'width', 'height', 
        'margin', 'padding', 'font-size', 'color', 'background'
      ];
      
      const elementStyles = criticalProps
        .map(prop => `${prop}: ${computedStyle.getPropertyValue(prop)}`)
        .filter(style => !style.includes('auto') && !style.includes('initial'))
        .join('; ');
      
      if (elementStyles) {
        const selector = this.generateCSSSelector(element);
        criticalStyles.push(`${selector} { ${elementStyles} }`);
      }
    });

    return criticalStyles.join('\n');
  }

  private generateCSSSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      return `.${element.className.split(' ').join('.')}`;
    }
    
    return element.tagName.toLowerCase();
  }

  // Performance monitoring
  private reportPerformanceIssue(issue: string, details: any): void {
    console.warn('⚠️ Bundle Performance Issue:', {
      issue,
      details,
      timestamp: new Date().toISOString()
    });

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/bundle-performance-issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue,
          details,
          metrics: this.bundleMetrics,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {
        // Fail silently for monitoring
      });
    }
  }

  // Public API methods
  getBundleMetrics(): BundleMetrics {
    return { ...this.bundleMetrics };
  }

  updateConfig(newConfig: Partial<AssetOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('📝 Bundle optimizer configuration updated:', this.config);
  }

  clearCache(): void {
    this.loadedChunks.clear();
    this.preloadedAssets.clear();
    
    // Clear service worker cache
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE'
      });
    }
    
    console.log('🗑️ Bundle cache cleared');
  }

  // Calculate bundle metrics
  private calculateBundleMetrics(): void {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // Calculate cache hit rate
      const cachedResources = resources.filter(r => r.transferSize === 0 && r.decodedBodySize > 0);
      this.bundleMetrics.cacheHitRate = cachedResources.length / resources.length;
      
      // Update load time
      this.bundleMetrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    }
  }
}

// Export singleton instance
export const bundleOptimizer = BundleOptimizer.getInstance();

// React lazy loading helper
export const createLazyComponent = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: {
    fallback?: React.ComponentType;
    errorBoundary?: React.ComponentType;
    preload?: boolean;
  } = {}
) => {
  const LazyComponent = React.lazy(factory);
  
  // Register with bundle optimizer
  bundleOptimizer.registerLazyComponent({
    name: factory.name || 'AnonymousComponent',
    loader: factory,
    priority: options.preload ? 'high' : 'medium',
    preload: options.preload
  });
  
  return LazyComponent;
};

// Initialize bundle optimization
if (typeof window !== 'undefined') {
  console.log('📦 Bundle Optimizer initialized');
} 