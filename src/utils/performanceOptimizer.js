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
  }

  // Optimized image loading with caching
  async loadImageOptimized(file) {
    const cacheKey = `${file.name}_${file.size}_${file.lastModified}`;
    
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const result = { img, url, width: img.width, height: img.height };
        
        // Cache with size limit
        if (this.imageCache.size >= this.maxCacheSize) {
          const firstKey = this.imageCache.keys().next().value;
          const firstValue = this.imageCache.get(firstKey);
          if (firstValue?.url) {
            URL.revokeObjectURL(firstValue.url);
          }
          this.imageCache.delete(firstKey);
        }
        
        this.imageCache.set(cacheKey, result);
        resolve(result);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }

  // Optimized EXIF extraction with caching
  async extractExifOptimized(file, exifr) {
    const cacheKey = `${file.name}_${file.size}_${file.lastModified}`;
    
    if (this.exifCache.has(cacheKey)) {
      return this.exifCache.get(cacheKey);
    }

    try {
      const exifData = await exifr.parse(file, {
        gps: true,
        tiff: true,
        exif: true,
        icc: false,
        iptc: false,
        xmp: false,
        mergeOutput: true,
        sanitize: true,
        reviveValues: true
      });

      // Cache with size limit
      if (this.exifCache.size >= this.maxCacheSize) {
        const firstKey = this.exifCache.keys().next().value;
        this.exifCache.delete(firstKey);
      }
      
      this.exifCache.set(cacheKey, exifData);
      return exifData;
    } catch (error) {
      console.warn('EXIF extraction failed:', error);
      return null;
    }
  }

  // Debounced file validation
  validateFileDebounced = debounce((file, callback) => {
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/tiff'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    const errors = [];
    
    if (!file) {
      errors.push({ type: 'NO_FILE', message: 'No file selected' });
    } else {
      if (!supportedTypes.includes(file.type)) {
        errors.push({ 
          type: 'INVALID_FILE_TYPE', 
          message: `Unsupported file type: ${file.type}` 
        });
      }
      
      if (file.size > maxSize) {
        errors.push({ 
          type: 'FILE_TOO_LARGE', 
          message: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max: 50MB)` 
        });
      }
    }

    callback(errors.length === 0, errors);
  }, 300);

  // Throttled progress updates
  updateProgressThrottled = throttle((progress, callback) => {
    callback(progress);
  }, 100);

  // Optimized canvas operations
  async processImageOnCanvas(imageData, options = {}) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Use requestAnimationFrame for smooth processing
      requestAnimationFrame(() => {
        try {
          const { img, width, height } = imageData;
          const { maxWidth = 1920, maxHeight = 1080, quality = 0.9 } = options;
          
          // Calculate optimal dimensions
          let newWidth = width;
          let newHeight = height;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            newWidth = Math.round(width * ratio);
            newHeight = Math.round(height * ratio);
          }
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Use high-quality image rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          canvas.toBlob(resolve, 'image/jpeg', quality);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Memory cleanup
  cleanup() {
    // Clear image cache and revoke URLs
    this.imageCache.forEach(value => {
      if (value?.url) {
        URL.revokeObjectURL(value.url);
      }
    });
    this.imageCache.clear();
    this.exifCache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      imageCache: this.imageCache.size,
      exifCache: this.exifCache.size,
      maxCacheSize: this.maxCacheSize
    };
  }
}

// Memoized utility functions
export const memoizedFormatters = {
  fileSize: memoize((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }),

  dateTime: memoize((dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  }),

  gpsCoordinates: memoize((lat, lng) => {
    if (!lat || !lng) return null;
    return {
      decimal: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      dms: convertToDMS(lat, lng)
    };
  })
};

// Convert decimal degrees to DMS format
function convertToDMS(lat, lng) {
  const convertCoordinate = (coord, isLat) => {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2);
    const direction = coord >= 0 ? (isLat ? 'N' : 'E') : (isLat ? 'S' : 'W');
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  return `${convertCoordinate(lat, true)}, ${convertCoordinate(lng, false)}`;
}

// React hook for performance optimization
export const usePerformanceOptimizer = () => {
  const [optimizer] = React.useState(() => new PerformanceOptimizer());

  React.useEffect(() => {
    return () => optimizer.cleanup();
  }, [optimizer]);

  return optimizer;
};

// Create singleton instance
export const performanceOptimizer = new PerformanceOptimizer(); 