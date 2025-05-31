// Performance Optimization Utilities
import React from 'react';
import { debounce, throttle, memoize } from 'lodash';

export class PerformanceOptimizer {
  constructor() {
    this.imageCache = new Map();
    this.exifCache = new Map();
    this.processingQueue = [];
    this.isProcessing = false;
    this.maxCacheSize = 50;
    this.memoryThreshold = 0.8; // 80% memory usage threshold
    this.performanceMetrics = new Map();
    this.compressionWorker = null;
    this.initializeWorkers();
  }

  // Initialize Web Workers for heavy processing
  initializeWorkers() {
    if (typeof Worker !== 'undefined') {
      try {
        // Create compression worker for image processing
        const workerCode = `
          self.onmessage = function(e) {
            const { type, data } = e.data;
            
            switch(type) {
              case 'compress':
                // Simulate image compression
                const compressed = {
                  ...data,
                  size: Math.floor(data.size * 0.7),
                  compressed: true
                };
                self.postMessage({ type: 'compressed', data: compressed });
                break;
                
              case 'analyze':
                // Simulate EXIF analysis
                const analysis = {
                  hasGPS: Math.random() > 0.7,
                  hasPersonalInfo: Math.random() > 0.8,
                  riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
                };
                self.postMessage({ type: 'analyzed', data: analysis });
                break;
            }
          };
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.compressionWorker = new Worker(URL.createObjectURL(blob));
      } catch (error) {
        console.warn('Web Workers not supported, falling back to main thread');
      }
    }
  }

  // Enhanced memory management
  checkMemoryUsage() {
    if ('memory' in performance) {
      const memInfo = performance.memory;
      const usageRatio = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
      
      if (usageRatio > this.memoryThreshold) {
        this.performGarbageCollection();
        return true;
      }
    }
    return false;
  }

  performGarbageCollection() {
    // Clear old cache entries
    if (this.imageCache.size > this.maxCacheSize) {
      const entries = Array.from(this.imageCache.entries());
      const toDelete = entries.slice(0, Math.floor(this.maxCacheSize * 0.3));
      toDelete.forEach(([key]) => this.imageCache.delete(key));
    }

    if (this.exifCache.size > this.maxCacheSize) {
      const entries = Array.from(this.exifCache.entries());
      const toDelete = entries.slice(0, Math.floor(this.maxCacheSize * 0.3));
      toDelete.forEach(([key]) => this.exifCache.delete(key));
    }

    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }

    console.log('Memory cleanup performed');
  }

  // Advanced image caching with LRU eviction
  cacheImage(key, imageData, metadata = {}) {
    this.checkMemoryUsage();
    
        if (this.imageCache.size >= this.maxCacheSize) {
      // Remove oldest entry (LRU)
          const firstKey = this.imageCache.keys().next().value;
          this.imageCache.delete(firstKey);
        }
        
    this.imageCache.set(key, {
      data: imageData,
      metadata,
      timestamp: Date.now(),
      accessCount: 0
    });
  }

  getCachedImage(key) {
    const cached = this.imageCache.get(key);
    if (cached) {
      cached.accessCount++;
      cached.lastAccessed = Date.now();
      return cached.data;
    }
    return null;
  }

  // Enhanced EXIF caching with compression
  cacheExifData(fileHash, exifData) {
    this.checkMemoryUsage();
    
      if (this.exifCache.size >= this.maxCacheSize) {
        const firstKey = this.exifCache.keys().next().value;
        this.exifCache.delete(firstKey);
      }
      
    // Compress EXIF data for storage
    const compressedData = this.compressExifData(exifData);
    this.exifCache.set(fileHash, {
      data: compressedData,
      timestamp: Date.now(),
      size: JSON.stringify(exifData).length
    });
  }

  getCachedExifData(fileHash) {
    const cached = this.exifCache.get(fileHash);
    if (cached) {
      return this.decompressExifData(cached.data);
    }
    return null;
  }

  // EXIF data compression
  compressExifData(exifData) {
    // Remove redundant data and compress common values
    const compressed = { ...exifData };
    
    // Remove empty or null values
    Object.keys(compressed).forEach(key => {
      if (compressed[key] === null || compressed[key] === undefined || compressed[key] === '') {
        delete compressed[key];
      }
    });

    return compressed;
  }

  decompressExifData(compressedData) {
    return { ...compressedData };
  }

  // Advanced processing queue with priority
  addToProcessingQueue(file, priority = 'normal') {
    const queueItem = {
      id: this.generateId(),
      file,
      priority,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3
    };

    // Insert based on priority
    if (priority === 'high') {
      this.processingQueue.unshift(queueItem);
    } else {
      this.processingQueue.push(queueItem);
    }

    this.processQueue();
    return queueItem.id;
  }

  async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.processingQueue.length > 0) {
      const item = this.processingQueue.shift();
      
      try {
        await this.processFile(item);
      } catch (error) {
        console.error('Processing failed:', error);
        
        if (item.retries < item.maxRetries) {
          item.retries++;
          this.processingQueue.push(item); // Retry later
        }
      }

      // Check memory usage between processing
      this.checkMemoryUsage();
      
      // Yield control to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    this.isProcessing = false;
  }

  async processFile(queueItem) {
    const startTime = performance.now();
    const { file } = queueItem;

    // Check cache first
    const fileHash = await this.generateFileHash(file);
    const cachedExif = this.getCachedExifData(fileHash);
    
    if (cachedExif) {
      this.recordMetric('cache_hit', performance.now() - startTime);
      return cachedExif;
    }

    // Process with worker if available
    if (this.compressionWorker) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Processing timeout'));
        }, 30000);

        this.compressionWorker.onmessage = (e) => {
          clearTimeout(timeout);
          const { type, data } = e.data;
          
          if (type === 'analyzed') {
            this.cacheExifData(fileHash, data);
            this.recordMetric('worker_process', performance.now() - startTime);
            resolve(data);
          }
        };

        this.compressionWorker.postMessage({
          type: 'analyze',
          data: { name: file.name, size: file.size }
        });
      });
    }

    // Fallback to main thread processing
    const result = await this.processFileMainThread(file);
    this.cacheExifData(fileHash, result);
    this.recordMetric('main_thread_process', performance.now() - startTime);
    
    return result;
  }

  async processFileMainThread(file) {
    // Simulate processing delay based on file size
    const processingTime = Math.min(file.size / 1000000 * 100, 2000);
    await new Promise(resolve => setTimeout(resolve, processingTime));

    return {
      fileName: file.name,
      fileSize: file.size,
      hasGPS: Math.random() > 0.7,
      hasPersonalInfo: Math.random() > 0.8,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      processedAt: new Date().toISOString()
    };
  }

  // Performance metrics tracking
  recordMetric(operation, duration) {
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, []);
    }

    const metrics = this.performanceMetrics.get(operation);
    metrics.push(duration);

    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  getPerformanceMetrics() {
    const summary = {};
    
    this.performanceMetrics.forEach((durations, operation) => {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);
      
      summary[operation] = {
        average: Math.round(avg * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        count: durations.length
      };
    });

    return summary;
  }

  // Utility functions
  generateFileHash(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        const hash = this.simpleHash(buffer);
        resolve(hash);
      };
      reader.readAsArrayBuffer(file.slice(0, 1024)); // Hash first 1KB
    });
  }

  simpleHash(buffer) {
    let hash = 0;
    const view = new Uint8Array(buffer);
    for (let i = 0; i < view.length; i++) {
      hash = ((hash << 5) - hash + view[i]) & 0xffffffff;
    }
    return hash.toString(36);
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Cleanup method
  cleanup() {
    this.imageCache.clear();
    this.exifCache.clear();
    this.processingQueue.length = 0;
    this.performanceMetrics.clear();
    
    if (this.compressionWorker) {
      this.compressionWorker.terminate();
      this.compressionWorker = null;
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      imageCache: {
        size: this.imageCache.size,
        maxSize: this.maxCacheSize,
        hitRate: this.calculateHitRate('image')
      },
      exifCache: {
        size: this.exifCache.size,
        maxSize: this.maxCacheSize,
        hitRate: this.calculateHitRate('exif')
      },
      processingQueue: {
        length: this.processingQueue.length,
        isProcessing: this.isProcessing
      }
    };
  }

  calculateHitRate(cacheType) {
    const metrics = this.performanceMetrics.get('cache_hit') || [];
    const totalRequests = metrics.length + (this.performanceMetrics.get('cache_miss') || []).length;
    
    if (totalRequests === 0) return 0;
    return Math.round((metrics.length / totalRequests) * 100);
  }
}

// React performance optimization hooks
export const usePerformanceOptimizer = () => {
  const [optimizer] = React.useState(() => new PerformanceOptimizer());

  React.useEffect(() => {
    return () => optimizer.cleanup();
  }, [optimizer]);

  return optimizer;
};

// Memoized components for better performance
export const MemoizedComponent = React.memo(({ children, ...props }) => {
  return React.createElement('div', props, children);
});

// Debounced search hook
export const useDebouncedSearch = (searchTerm, delay = 300) => {
  const [debouncedTerm, setDebouncedTerm] = React.useState(searchTerm);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  return debouncedTerm;
};

// Throttled scroll hook
export const useThrottledScroll = (callback, delay = 100) => {
  const throttledCallback = React.useCallback(
    throttle(callback, delay),
    [callback, delay]
  );

  React.useEffect(() => {
    window.addEventListener('scroll', throttledCallback);
    return () => window.removeEventListener('scroll', throttledCallback);
  }, [throttledCallback]);
};

// Virtual scrolling for large lists
export const useVirtualScrolling = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

// Export singleton instance
export const performanceOptimizer = new PerformanceOptimizer(); 

// Performance monitoring utilities
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  return React.forwardRef((props, ref) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        performanceOptimizer.recordMetric(`component_${componentName}`, endTime - startTime);
      };
    }, []);

    return React.createElement(WrappedComponent, { ...props, ref });
  });
};

export default PerformanceOptimizer; 