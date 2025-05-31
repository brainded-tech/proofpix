/**
 * Cache Service - Advanced Caching & Performance Optimization
 * Provides multi-level caching with Redis and in-memory caching
 */

const Redis = require('ioredis');
const { logger } = require('../config/database');
const performanceService = require('./performanceService');

class CacheService {
  constructor() {
    // Redis client for distributed caching
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
    // In-memory cache for frequently accessed data
    this.memoryCache = new Map();
    
    // Cache configuration
    this.config = {
      defaultTTL: 3600, // 1 hour default TTL
      maxMemoryCacheSize: 1000, // Maximum items in memory cache
      compressionThreshold: 1024, // Compress data larger than 1KB
      enableCompression: true,
      enableMetrics: true
    };
    
    // Cache statistics
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0
    };
    
    // Initialize cache monitoring
    this.initializeMonitoring();
  }

  /**
   * Initialize cache monitoring and cleanup
   */
  initializeMonitoring() {
    // Clean up expired memory cache entries every 5 minutes
    setInterval(() => {
      this.cleanupMemoryCache();
    }, 5 * 60 * 1000);

    // Report cache statistics every minute
    setInterval(() => {
      this.reportCacheStatistics();
    }, 60 * 1000);

    // Monitor memory cache size
    setInterval(() => {
      this.monitorMemoryCacheSize();
    }, 30 * 1000);
  }

  /**
   * Get data from cache (checks memory cache first, then Redis)
   */
  async get(key, options = {}) {
    try {
      const startTime = Date.now();
      
      // Check memory cache first
      const memoryResult = this.getFromMemoryCache(key);
      if (memoryResult !== null) {
        this.stats.hits++;
        this.recordCacheMetrics('get', 'memory', 'hit', Date.now() - startTime);
        return memoryResult;
      }

      // Check Redis cache
      const redisResult = await this.getFromRedisCache(key, options);
      if (redisResult !== null) {
        this.stats.hits++;
        
        // Store in memory cache for faster future access
        if (options.storeInMemory !== false) {
          this.setInMemoryCache(key, redisResult, options.ttl);
        }
        
        this.recordCacheMetrics('get', 'redis', 'hit', Date.now() - startTime);
        return redisResult;
      }

      this.stats.misses++;
      this.recordCacheMetrics('get', 'both', 'miss', Date.now() - startTime);
      return null;

    } catch (error) {
      this.stats.errors++;
      logger.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set data in cache (stores in both memory and Redis)
   */
  async set(key, value, options = {}) {
    try {
      const startTime = Date.now();
      const ttl = options.ttl || this.config.defaultTTL;
      
      // Store in memory cache
      if (options.skipMemory !== true) {
        this.setInMemoryCache(key, value, ttl);
      }

      // Store in Redis cache
      if (options.skipRedis !== true) {
        await this.setInRedisCache(key, value, ttl, options);
      }

      this.stats.sets++;
      this.recordCacheMetrics('set', 'both', 'success', Date.now() - startTime);
      return true;

    } catch (error) {
      this.stats.errors++;
      logger.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete data from cache
   */
  async delete(key) {
    try {
      const startTime = Date.now();
      
      // Delete from memory cache
      this.memoryCache.delete(key);

      // Delete from Redis cache
      await this.redis.del(key);

      this.stats.deletes++;
      this.recordCacheMetrics('delete', 'both', 'success', Date.now() - startTime);
      return true;

    } catch (error) {
      this.stats.errors++;
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Get multiple keys from cache
   */
  async getMultiple(keys, options = {}) {
    try {
      const results = {};
      const redisKeys = [];
      
      // Check memory cache first
      for (const key of keys) {
        const memoryResult = this.getFromMemoryCache(key);
        if (memoryResult !== null) {
          results[key] = memoryResult;
        } else {
          redisKeys.push(key);
        }
      }

      // Get remaining keys from Redis
      if (redisKeys.length > 0) {
        const redisResults = await this.redis.mget(redisKeys);
        
        for (let i = 0; i < redisKeys.length; i++) {
          const key = redisKeys[i];
          const value = redisResults[i];
          
          if (value !== null) {
            const parsed = this.parseRedisValue(value);
            results[key] = parsed;
            
            // Store in memory cache
            if (options.storeInMemory !== false) {
              this.setInMemoryCache(key, parsed, options.ttl);
            }
          }
        }
      }

      return results;

    } catch (error) {
      this.stats.errors++;
      logger.error('Cache getMultiple error:', error);
      return {};
    }
  }

  /**
   * Set multiple keys in cache
   */
  async setMultiple(keyValuePairs, options = {}) {
    try {
      const ttl = options.ttl || this.config.defaultTTL;
      const pipeline = this.redis.pipeline();
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        // Store in memory cache
        if (options.skipMemory !== true) {
          this.setInMemoryCache(key, value, ttl);
        }

        // Prepare Redis pipeline
        if (options.skipRedis !== true) {
          const serialized = this.serializeValue(value);
          pipeline.setex(key, ttl, serialized);
        }
      }

      // Execute Redis pipeline
      if (options.skipRedis !== true) {
        await pipeline.exec();
      }

      return true;

    } catch (error) {
      this.stats.errors++;
      logger.error('Cache setMultiple error:', error);
      return false;
    }
  }

  /**
   * Increment a numeric value in cache
   */
  async increment(key, amount = 1, options = {}) {
    try {
      const ttl = options.ttl || this.config.defaultTTL;
      
      // Increment in Redis
      const newValue = await this.redis.incrby(key, amount);
      
      // Set TTL if this is a new key
      if (newValue === amount) {
        await this.redis.expire(key, ttl);
      }

      // Update memory cache
      this.setInMemoryCache(key, newValue, ttl);

      return newValue;

    } catch (error) {
      this.stats.errors++;
      logger.error('Cache increment error:', error);
      return null;
    }
  }

  /**
   * Get cache statistics
   */
  getStatistics() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    
    return {
      ...this.stats,
      hitRate: hitRate.toFixed(2),
      memoryCacheSize: this.memoryCache.size,
      timestamp: Date.now()
    };
  }

  /**
   * Clear all cache data
   */
  async clear(pattern = '*') {
    try {
      // Clear memory cache
      if (pattern === '*') {
        this.memoryCache.clear();
      } else {
        // Clear matching keys from memory cache
        for (const key of this.memoryCache.keys()) {
          if (this.matchesPattern(key, pattern)) {
            this.memoryCache.delete(key);
          }
        }
      }

      // Clear Redis cache
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }

      return true;

    } catch (error) {
      this.stats.errors++;
      logger.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Get data from memory cache
   */
  getFromMemoryCache(key) {
    const item = this.memoryCache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (item.expiry && Date.now() > item.expiry) {
      this.memoryCache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set data in memory cache
   */
  setInMemoryCache(key, value, ttl) {
    // Check memory cache size limit
    if (this.memoryCache.size >= this.config.maxMemoryCacheSize) {
      this.evictOldestMemoryCacheEntry();
    }

    const expiry = ttl ? Date.now() + (ttl * 1000) : null;
    
    this.memoryCache.set(key, {
      value,
      expiry,
      timestamp: Date.now()
    });
  }

  /**
   * Get data from Redis cache
   */
  async getFromRedisCache(key, options = {}) {
    const value = await this.redis.get(key);
    
    if (value === null) {
      return null;
    }

    return this.parseRedisValue(value);
  }

  /**
   * Set data in Redis cache
   */
  async setInRedisCache(key, value, ttl, options = {}) {
    const serialized = this.serializeValue(value);
    
    if (ttl) {
      await this.redis.setex(key, ttl, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  /**
   * Serialize value for Redis storage
   */
  serializeValue(value) {
    try {
      const serialized = JSON.stringify(value);
      
      // Compress large values if enabled
      if (this.config.enableCompression && serialized.length > this.config.compressionThreshold) {
        // In a real implementation, you would use a compression library like zlib
        // For now, we'll just store as-is
        return serialized;
      }
      
      return serialized;

    } catch (error) {
      logger.error('Value serialization error:', error);
      return JSON.stringify(null);
    }
  }

  /**
   * Parse value from Redis storage
   */
  parseRedisValue(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      logger.error('Value parsing error:', error);
      return null;
    }
  }

  /**
   * Clean up expired memory cache entries
   */
  cleanupMemoryCache() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.expiry && now > item.expiry) {
        this.memoryCache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.debug(`Cleaned up ${cleanedCount} expired memory cache entries`);
    }
  }

  /**
   * Evict oldest memory cache entry
   */
  evictOldestMemoryCacheEntry() {
    let oldestKey = null;
    let oldestTimestamp = Date.now();
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
    }
  }

  /**
   * Monitor memory cache size
   */
  monitorMemoryCacheSize() {
    const size = this.memoryCache.size;
    const maxSize = this.config.maxMemoryCacheSize;
    const usage = (size / maxSize) * 100;
    
    if (usage > 90) {
      logger.warn(`Memory cache usage high: ${usage.toFixed(1)}% (${size}/${maxSize})`);
    }
  }

  /**
   * Report cache statistics
   */
  reportCacheStatistics() {
    if (this.config.enableMetrics) {
      const stats = this.getStatistics();
      
      // Record metrics with performance service
      if (performanceService && performanceService.recordCacheOperation) {
        performanceService.recordCacheOperation('hit', 'combined', this.stats.hits);
        performanceService.recordCacheOperation('miss', 'combined', this.stats.misses);
      }

      // Log statistics periodically
      if (stats.hitRate < 70) {
        logger.warn(`Cache hit rate low: ${stats.hitRate}%`);
      }
    }
  }

  /**
   * Record cache metrics
   */
  recordCacheMetrics(operation, cacheType, result, duration) {
    if (this.config.enableMetrics && performanceService && performanceService.recordCacheOperation) {
      performanceService.recordCacheOperation(operation, cacheType, result);
    }
  }

  /**
   * Check if key matches pattern
   */
  matchesPattern(key, pattern) {
    if (pattern === '*') return true;
    
    // Simple pattern matching (could be enhanced with proper glob matching)
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(key);
  }

  /**
   * Warm up cache with frequently accessed data
   */
  async warmUp(dataLoader, keys, options = {}) {
    try {
      logger.info(`Warming up cache with ${keys.length} keys`);
      
      const batchSize = options.batchSize || 10;
      const ttl = options.ttl || this.config.defaultTTL;
      
      for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        const promises = batch.map(async (key) => {
          try {
            const data = await dataLoader(key);
            if (data !== null && data !== undefined) {
              await this.set(key, data, { ttl });
            }
          } catch (error) {
            logger.error(`Failed to warm up cache for key ${key}:`, error);
          }
        });
        
        await Promise.all(promises);
        
        // Small delay between batches to avoid overwhelming the system
        if (i + batchSize < keys.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      logger.info('Cache warm-up completed');
      return true;

    } catch (error) {
      logger.error('Cache warm-up error:', error);
      return false;
    }
  }

  /**
   * Get cache health status
   */
  async getHealthStatus() {
    try {
      const stats = this.getStatistics();
      const redisInfo = await this.redis.info('memory');
      
      return {
        status: 'healthy',
        statistics: stats,
        memoryCache: {
          size: this.memoryCache.size,
          maxSize: this.config.maxMemoryCacheSize,
          usage: (this.memoryCache.size / this.config.maxMemoryCacheSize) * 100
        },
        redis: {
          connected: this.redis.status === 'ready',
          info: redisInfo
        },
        timestamp: Date.now()
      };

    } catch (error) {
      logger.error('Cache health check error:', error);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Create cache key with namespace
   */
  createKey(namespace, ...parts) {
    return `${namespace}:${parts.join(':')}`;
  }

  /**
   * Cache wrapper for functions
   */
  wrap(key, fn, options = {}) {
    return async (...args) => {
      const cacheKey = typeof key === 'function' ? key(...args) : key;
      
      // Try to get from cache first
      let result = await this.get(cacheKey, options);
      
      if (result === null) {
        // Execute function and cache result
        result = await fn(...args);
        
        if (result !== null && result !== undefined) {
          await this.set(cacheKey, result, options);
        }
      }
      
      return result;
    };
  }
}

module.exports = new CacheService(); 