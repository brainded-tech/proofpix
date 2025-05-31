// Bundle Optimization Utilities
import React, { lazy, Suspense } from 'react';

// Dynamic import utilities for code splitting
export class BundleOptimizer {
  constructor() {
    this.loadedChunks = new Set();
    this.preloadQueue = [];
    this.criticalResources = new Set();
    this.performanceObserver = null;
    this.initializePerformanceMonitoring();
  }

  // Initialize performance monitoring
  initializePerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.analyzeNavigationTiming(entry);
          } else if (entry.entryType === 'resource') {
            this.analyzeResourceTiming(entry);
          }
        }
      });

      try {
        this.performanceObserver.observe({ entryTypes: ['navigation', 'resource'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }

  // Analyze navigation timing for optimization opportunities
  analyzeNavigationTiming(entry) {
    const metrics = {
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      firstPaint: entry.responseEnd - entry.requestStart,
      domInteractive: entry.domInteractive - entry.navigationStart
    };

    // Log slow page loads
    if (metrics.domContentLoaded > 3000) {
      console.warn('Slow DOM content loaded:', metrics.domContentLoaded + 'ms');
      this.suggestOptimizations('dom-content-loaded', metrics);
    }

    if (metrics.loadComplete > 5000) {
      console.warn('Slow page load complete:', metrics.loadComplete + 'ms');
      this.suggestOptimizations('load-complete', metrics);
    }
  }

  // Analyze resource timing for bundle optimization
  analyzeResourceTiming(entry) {
    if (entry.name.includes('.js') && entry.transferSize > 500000) { // 500KB+
      console.warn('Large JavaScript bundle detected:', {
        name: entry.name,
        size: this.formatBytes(entry.transferSize),
        loadTime: entry.responseEnd - entry.requestStart
      });
      
      this.suggestOptimizations('large-bundle', {
        name: entry.name,
        size: entry.transferSize
      });
    }
  }

  // Suggest optimization strategies
  suggestOptimizations(type, data) {
    const suggestions = {
      'dom-content-loaded': [
        'Consider code splitting for non-critical components',
        'Implement lazy loading for below-the-fold content',
        'Optimize critical CSS delivery'
      ],
      'load-complete': [
        'Implement resource preloading for critical assets',
        'Consider service worker for caching',
        'Optimize image loading with lazy loading'
      ],
      'large-bundle': [
        'Split large bundles using dynamic imports',
        'Remove unused dependencies',
        'Implement tree shaking for dead code elimination'
      ]
    };

    console.group(`🚀 Performance Optimization Suggestions - ${type}`);
    suggestions[type]?.forEach(suggestion => console.log(`• ${suggestion}`));
    console.groupEnd();
  }

  // Format bytes for human-readable output
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Preload critical resources
  preloadResource(href, as = 'script', crossorigin = null) {
    if (this.criticalResources.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = crossorigin;

    link.onload = () => {
      this.criticalResources.add(href);
      console.log(`✅ Preloaded: ${href}`);
    };

    link.onerror = () => {
      console.warn(`❌ Failed to preload: ${href}`);
    };

    document.head.appendChild(link);
  }

  // Intelligent chunk preloading based on user behavior
  preloadChunk(chunkName, priority = 'low') {
    if (this.loadedChunks.has(chunkName)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `/static/js/${chunkName}.chunk.js`;
      script.async = true;

      if (priority === 'high') {
        script.setAttribute('importance', 'high');
      }

      script.onload = () => {
        this.loadedChunks.add(chunkName);
        console.log(`📦 Chunk loaded: ${chunkName}`);
        resolve();
      };

      script.onerror = () => {
        console.error(`❌ Failed to load chunk: ${chunkName}`);
        reject(new Error(`Failed to load chunk: ${chunkName}`));
      };

      document.head.appendChild(script);
    });
  }

  // Prefetch resources based on user interaction patterns
  prefetchOnHover(element, resourceUrl) {
    let prefetchTimeout;

    const handleMouseEnter = () => {
      prefetchTimeout = setTimeout(() => {
        this.preloadResource(resourceUrl);
      }, 100); // 100ms delay to avoid unnecessary prefetching
    };

    const handleMouseLeave = () => {
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout);
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout);
      }
    };
  }

  // Intersection Observer for lazy loading
  createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observerOptions = { ...defaultOptions, ...options };

    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
        }
      });
    }, observerOptions);
  }

  // Cleanup resources
  cleanup() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    this.loadedChunks.clear();
    this.preloadQueue.length = 0;
    this.criticalResources.clear();
  }
}

// Lazy loading utilities with error boundaries
export const createLazyComponent = (importFunc, fallback = null) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback || <div className="loading-spinner">Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Route-based code splitting
export const createLazyRoute = (importFunc) => {
  return createLazyComponent(
    importFunc,
    <div className="route-loading">
      <div className="loading-spinner"></div>
      <p>Loading page...</p>
    </div>
  );
};

// Component-based code splitting with error handling
export const createLazyComponentWithErrorBoundary = (importFunc, ErrorComponent = null) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <ErrorBoundary fallback={ErrorComponent}>
      <Suspense fallback={<div className="loading-spinner">Loading component...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h3>Something went wrong loading this component</h3>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Webpack chunk optimization utilities
export const optimizeChunks = {
  // Split vendor libraries
  splitVendors: () => ({
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
        priority: 10
      },
      common: {
        name: 'common',
        minChunks: 2,
        chunks: 'all',
        priority: 5,
        reuseExistingChunk: true
      }
    }
  }),

  // Split by feature
  splitByFeature: () => ({
    cacheGroups: {
      analytics: {
        test: /[\\/]src[\\/]components[\\/]analytics[\\/]/,
        name: 'analytics',
        chunks: 'all'
      },
      enterprise: {
        test: /[\\/]src[\\/]components[\\/]enterprise[\\/]/,
        name: 'enterprise',
        chunks: 'all'
      },
      docs: {
        test: /[\\/]src[\\/]pages[\\/]docs[\\/]/,
        name: 'docs',
        chunks: 'all'
      }
    }
  }),

  // Split large libraries
  splitLargeLibraries: () => ({
    cacheGroups: {
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react',
        chunks: 'all'
      },
      charts: {
        test: /[\\/]node_modules[\\/](chart\.js|recharts)[\\/]/,
        name: 'charts',
        chunks: 'all'
      },
      icons: {
        test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
        name: 'icons',
        chunks: 'all'
      }
    }
  })
};

// Resource hints for better loading performance
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'api.stripe.com'
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const preconnectOrigins = [
    'https://fonts.googleapis.com',
    'https://api.stripe.com'
  ];

  preconnectOrigins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Critical CSS inlining utility
export const inlineCriticalCSS = (criticalCSS) => {
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  style.setAttribute('data-critical', 'true');
  document.head.insertBefore(style, document.head.firstChild);
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Update available
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available, prompt user to refresh
            if (confirm('New version available! Refresh to update?')) {
              window.location.reload();
            }
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Bundle analysis utilities
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    // Simulate bundle analysis in development
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const totalSize = scripts.reduce((total, script) => {
      // Estimate size based on script length (rough approximation)
      return total + (script.src.length * 100);
    }, 0);

    console.group('📊 Bundle Analysis');
    console.log(`Estimated total bundle size: ${bundleOptimizer.formatBytes(totalSize)}`);
    console.log(`Number of script files: ${scripts.length}`);
    
    if (totalSize > 1000000) { // 1MB
      console.warn('⚠️ Large bundle detected. Consider code splitting.');
    }
    
    console.groupEnd();
  }
};

// Performance budget monitoring
export const monitorPerformanceBudget = () => {
  const budget = {
    maxBundleSize: 1000000, // 1MB
    maxLoadTime: 3000, // 3 seconds
    maxFCP: 1500, // First Contentful Paint
    maxLCP: 2500 // Largest Contentful Paint
  };

  // Monitor bundle size
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const estimatedSize = scripts.length * 200000; // Rough estimate

  if (estimatedSize > budget.maxBundleSize) {
    console.warn(`🚨 Bundle size budget exceeded: ${bundleOptimizer.formatBytes(estimatedSize)}`);
  }

  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint' && entry.startTime > budget.maxFCP) {
          console.warn(`🚨 FCP budget exceeded: ${entry.startTime}ms`);
        }
        if (entry.entryType === 'largest-contentful-paint' && entry.startTime > budget.maxLCP) {
          console.warn(`🚨 LCP budget exceeded: ${entry.startTime}ms`);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }
};

// Initialize bundle optimizer
export const bundleOptimizer = new BundleOptimizer();

// Auto-initialize optimizations
if (typeof window !== 'undefined') {
  // Add resource hints
  document.addEventListener('DOMContentLoaded', () => {
    addResourceHints();
    analyzeBundleSize();
    monitorPerformanceBudget();
  });

  // Register service worker
  window.addEventListener('load', () => {
    registerServiceWorker();
  });
}

export default BundleOptimizer; 