/**
 * Performance Service - Advanced Performance & Scalability
 * Handles performance monitoring, optimization, and scalability features
 */

const Redis = require('ioredis');
const { logger } = require('../config/database');
const promClient = require('prom-client');

class PerformanceService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.metrics = new Map();
    this.performanceThresholds = {
      responseTime: 1000, // 1 second
      memoryUsage: 80, // 80% of available memory
      cpuUsage: 70, // 70% CPU usage
      errorRate: 5 // 5% error rate
    };
    
    // Initialize Prometheus metrics
    this.initializeMetrics();
    
    // Start performance monitoring
    this.startPerformanceMonitoring();
  }

  /**
   * Initialize Prometheus metrics
   */
  initializeMetrics() {
    // HTTP request metrics
    this.httpRequestDuration = new promClient.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
    });

    this.httpRequestTotal = new promClient.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code']
    });

    // Database metrics
    this.dbQueryDuration = new promClient.Histogram({
      name: 'db_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['query_type', 'table'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5]
    });

    this.dbConnectionPool = new promClient.Gauge({
      name: 'db_connection_pool_size',
      help: 'Current database connection pool size',
      labelNames: ['pool_type']
    });

    // Cache metrics
    this.cacheHitRate = new promClient.Gauge({
      name: 'cache_hit_rate',
      help: 'Cache hit rate percentage',
      labelNames: ['cache_type']
    });

    this.cacheOperations = new promClient.Counter({
      name: 'cache_operations_total',
      help: 'Total cache operations',
      labelNames: ['operation', 'cache_type', 'result']
    });

    // System metrics
    this.systemMemoryUsage = new promClient.Gauge({
      name: 'system_memory_usage_bytes',
      help: 'System memory usage in bytes',
      labelNames: ['type']
    });

    this.systemCpuUsage = new promClient.Gauge({
      name: 'system_cpu_usage_percent',
      help: 'System CPU usage percentage'
    });

    // File processing metrics
    this.fileProcessingDuration = new promClient.Histogram({
      name: 'file_processing_duration_seconds',
      help: 'Duration of file processing operations',
      labelNames: ['operation', 'file_type'],
      buckets: [1, 5, 10, 30, 60, 120, 300]
    });

    this.fileProcessingQueue = new promClient.Gauge({
      name: 'file_processing_queue_size',
      help: 'Current file processing queue size',
      labelNames: ['queue_type']
    });

    // Plugin metrics
    this.pluginExecutionDuration = new promClient.Histogram({
      name: 'plugin_execution_duration_seconds',
      help: 'Duration of plugin executions',
      labelNames: ['plugin_id', 'hook_name'],
      buckets: [0.1, 0.5, 1, 2, 5, 10]
    });

    // Register all metrics
    promClient.register.registerMetric(this.httpRequestDuration);
    promClient.register.registerMetric(this.httpRequestTotal);
    promClient.register.registerMetric(this.dbQueryDuration);
    promClient.register.registerMetric(this.dbConnectionPool);
    promClient.register.registerMetric(this.cacheHitRate);
    promClient.register.registerMetric(this.cacheOperations);
    promClient.register.registerMetric(this.systemMemoryUsage);
    promClient.register.registerMetric(this.systemCpuUsage);
    promClient.register.registerMetric(this.fileProcessingDuration);
    promClient.register.registerMetric(this.fileProcessingQueue);
    promClient.register.registerMetric(this.pluginExecutionDuration);
  }

  /**
   * Start performance monitoring
   */
  startPerformanceMonitoring() {
    // Monitor system resources every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);

    // Monitor cache performance every minute
    setInterval(() => {
      this.collectCacheMetrics();
    }, 60000);

    // Check performance thresholds every 5 minutes
    setInterval(() => {
      this.checkPerformanceThresholds();
    }, 300000);
  }

  /**
   * Collect system metrics
   */
  async collectSystemMetrics() {
    try {
      const memUsage = process.memoryUsage();
      
      // Memory metrics
      this.systemMemoryUsage.set({ type: 'rss' }, memUsage.rss);
      this.systemMemoryUsage.set({ type: 'heapTotal' }, memUsage.heapTotal);
      this.systemMemoryUsage.set({ type: 'heapUsed' }, memUsage.heapUsed);
      this.systemMemoryUsage.set({ type: 'external' }, memUsage.external);

      // CPU metrics (simplified - in production use proper CPU monitoring)
      const cpuUsage = process.cpuUsage();
      const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
      this.systemCpuUsage.set(cpuPercent);

      // Store in Redis for historical data
      await this.redis.zadd('system:memory', Date.now(), JSON.stringify({
        timestamp: Date.now(),
        rss: memUsage.rss,
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal
      }));

      await this.redis.zadd('system:cpu', Date.now(), JSON.stringify({
        timestamp: Date.now(),
        usage: cpuPercent
      }));

      // Keep only last 24 hours of data
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      await this.redis.zremrangebyscore('system:memory', 0, oneDayAgo);
      await this.redis.zremrangebyscore('system:cpu', 0, oneDayAgo);

    } catch (error) {
      logger.error('Failed to collect system metrics:', error);
    }
  }

  /**
   * Collect cache metrics
   */
  async collectCacheMetrics() {
    try {
      // Redis cache metrics
      const redisInfo = await this.redis.info('stats');
      const lines = redisInfo.split('\r\n');
      
      let keyspaceHits = 0;
      let keyspaceMisses = 0;
      
      for (const line of lines) {
        if (line.startsWith('keyspace_hits:')) {
          keyspaceHits = parseInt(line.split(':')[1]);
        } else if (line.startsWith('keyspace_misses:')) {
          keyspaceMisses = parseInt(line.split(':')[1]);
        }
      }
      
      const totalRequests = keyspaceHits + keyspaceMisses;
      const hitRate = totalRequests > 0 ? (keyspaceHits / totalRequests) * 100 : 0;
      
      this.cacheHitRate.set({ cache_type: 'redis' }, hitRate);

      // Store cache performance data
      await this.redis.zadd('cache:performance', Date.now(), JSON.stringify({
        timestamp: Date.now(),
        hitRate,
        hits: keyspaceHits,
        misses: keyspaceMisses
      }));

    } catch (error) {
      logger.error('Failed to collect cache metrics:', error);
    }
  }

  /**
   * Check performance thresholds and trigger alerts
   */
  async checkPerformanceThresholds() {
    try {
      const currentMetrics = await this.getCurrentPerformanceMetrics();
      
      // Check response time threshold
      if (currentMetrics.avgResponseTime > this.performanceThresholds.responseTime) {
        await this.triggerPerformanceAlert('high_response_time', {
          current: currentMetrics.avgResponseTime,
          threshold: this.performanceThresholds.responseTime
        });
      }

      // Check memory usage threshold
      const memoryUsagePercent = (currentMetrics.memoryUsed / currentMetrics.memoryTotal) * 100;
      if (memoryUsagePercent > this.performanceThresholds.memoryUsage) {
        await this.triggerPerformanceAlert('high_memory_usage', {
          current: memoryUsagePercent,
          threshold: this.performanceThresholds.memoryUsage
        });
      }

      // Check error rate threshold
      if (currentMetrics.errorRate > this.performanceThresholds.errorRate) {
        await this.triggerPerformanceAlert('high_error_rate', {
          current: currentMetrics.errorRate,
          threshold: this.performanceThresholds.errorRate
        });
      }

    } catch (error) {
      logger.error('Failed to check performance thresholds:', error);
    }
  }

  /**
   * Record HTTP request metrics
   */
  recordHttpRequest(method, route, statusCode, duration) {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration / 1000); // Convert to seconds

    this.httpRequestTotal
      .labels(method, route, statusCode.toString())
      .inc();
  }

  /**
   * Record database query metrics
   */
  recordDbQuery(queryType, table, duration) {
    this.dbQueryDuration
      .labels(queryType, table)
      .observe(duration / 1000); // Convert to seconds
  }

  /**
   * Record cache operation
   */
  recordCacheOperation(operation, cacheType, result) {
    this.cacheOperations
      .labels(operation, cacheType, result)
      .inc();
  }

  /**
   * Record file processing metrics
   */
  recordFileProcessing(operation, fileType, duration) {
    this.fileProcessingDuration
      .labels(operation, fileType)
      .observe(duration / 1000); // Convert to seconds
  }

  /**
   * Record plugin execution metrics
   */
  recordPluginExecution(pluginId, hookName, duration) {
    this.pluginExecutionDuration
      .labels(pluginId, hookName)
      .observe(duration / 1000); // Convert to seconds
  }

  /**
   * Update queue size metrics
   */
  updateQueueSize(queueType, size) {
    this.fileProcessingQueue.set({ queue_type: queueType }, size);
  }

  /**
   * Update database connection pool metrics
   */
  updateDbConnectionPool(poolType, size) {
    this.dbConnectionPool.set({ pool_type: poolType }, size);
  }

  /**
   * Get current performance metrics
   */
  async getCurrentPerformanceMetrics() {
    try {
      // Get recent metrics from Redis
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      
      const memoryData = await this.redis.zrangebyscore('system:memory', oneHourAgo, Date.now());
      const cpuData = await this.redis.zrangebyscore('system:cpu', oneHourAgo, Date.now());
      const cacheData = await this.redis.zrangebyscore('cache:performance', oneHourAgo, Date.now());

      // Calculate averages
      let avgMemoryUsed = 0;
      let avgCpuUsage = 0;
      let avgCacheHitRate = 0;

      if (memoryData.length > 0) {
        const memorySum = memoryData.reduce((sum, data) => {
          const parsed = JSON.parse(data);
          return sum + parsed.heapUsed;
        }, 0);
        avgMemoryUsed = memorySum / memoryData.length;
      }

      if (cpuData.length > 0) {
        const cpuSum = cpuData.reduce((sum, data) => {
          const parsed = JSON.parse(data);
          return sum + parsed.usage;
        }, 0);
        avgCpuUsage = cpuSum / cpuData.length;
      }

      if (cacheData.length > 0) {
        const cacheSum = cacheData.reduce((sum, data) => {
          const parsed = JSON.parse(data);
          return sum + parsed.hitRate;
        }, 0);
        avgCacheHitRate = cacheSum / cacheData.length;
      }

      // Get current memory info
      const memUsage = process.memoryUsage();

      return {
        timestamp: Date.now(),
        avgResponseTime: await this.getAverageResponseTime(),
        memoryUsed: avgMemoryUsed || memUsage.heapUsed,
        memoryTotal: memUsage.heapTotal,
        cpuUsage: avgCpuUsage,
        cacheHitRate: avgCacheHitRate,
        errorRate: await this.getErrorRate(),
        activeConnections: await this.getActiveConnections(),
        queueSizes: await this.getQueueSizes()
      };

    } catch (error) {
      logger.error('Failed to get current performance metrics:', error);
      return {};
    }
  }

  /**
   * Get performance metrics for a time range
   */
  async getPerformanceMetrics(startTime, endTime) {
    try {
      const memoryData = await this.redis.zrangebyscore('system:memory', startTime, endTime);
      const cpuData = await this.redis.zrangebyscore('system:cpu', startTime, endTime);
      const cacheData = await this.redis.zrangebyscore('cache:performance', startTime, endTime);

      return {
        memory: memoryData.map(data => JSON.parse(data)),
        cpu: cpuData.map(data => JSON.parse(data)),
        cache: cacheData.map(data => JSON.parse(data))
      };

    } catch (error) {
      logger.error('Failed to get performance metrics:', error);
      return { memory: [], cpu: [], cache: [] };
    }
  }

  /**
   * Get Prometheus metrics
   */
  async getPrometheusMetrics() {
    return promClient.register.metrics();
  }

  /**
   * Trigger performance alert
   */
  async triggerPerformanceAlert(alertType, data) {
    const alert = {
      type: alertType,
      timestamp: Date.now(),
      data,
      severity: this.getAlertSeverity(alertType, data)
    };

    logger.warn(`Performance alert: ${alertType}`, alert);

    // Store alert in Redis
    await this.redis.lpush('performance:alerts', JSON.stringify(alert));
    await this.redis.ltrim('performance:alerts', 0, 999); // Keep last 1000 alerts

    // TODO: Integrate with notification system (email, Slack, etc.)
  }

  /**
   * Get alert severity based on type and data
   */
  getAlertSeverity(alertType, data) {
    const thresholdRatio = data.current / data.threshold;
    
    if (thresholdRatio >= 2) return 'critical';
    if (thresholdRatio >= 1.5) return 'high';
    if (thresholdRatio >= 1.2) return 'medium';
    return 'low';
  }

  /**
   * Helper methods for metrics calculation
   */
  async getAverageResponseTime() {
    // This would integrate with HTTP request tracking
    // For now, return a placeholder
    return 250; // ms
  }

  async getErrorRate() {
    // This would calculate error rate from HTTP metrics
    // For now, return a placeholder
    return 2.5; // %
  }

  async getActiveConnections() {
    // This would get active database/HTTP connections
    // For now, return a placeholder
    return 45;
  }

  async getQueueSizes() {
    // This would get current queue sizes
    // For now, return placeholders
    return {
      fileProcessing: 12,
      emailNotifications: 3,
      webhookDelivery: 8
    };
  }

  /**
   * Optimize performance based on current metrics
   */
  async optimizePerformance() {
    try {
      const metrics = await this.getCurrentPerformanceMetrics();
      const optimizations = [];

      // Memory optimization
      if (metrics.memoryUsed / metrics.memoryTotal > 0.8) {
        // Trigger garbage collection
        if (global.gc) {
          global.gc();
          optimizations.push('garbage_collection');
        }

        // Clear old cache entries
        await this.clearOldCacheEntries();
        optimizations.push('cache_cleanup');
      }

      // Cache optimization
      if (metrics.cacheHitRate < 70) {
        await this.optimizeCacheStrategy();
        optimizations.push('cache_optimization');
      }

      // Queue optimization
      if (metrics.queueSizes.fileProcessing > 50) {
        await this.optimizeQueueProcessing();
        optimizations.push('queue_optimization');
      }

      logger.info('Performance optimizations applied:', optimizations);
      return optimizations;

    } catch (error) {
      logger.error('Failed to optimize performance:', error);
      return [];
    }
  }

  /**
   * Clear old cache entries
   */
  async clearOldCacheEntries() {
    try {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      // Clear old system metrics
      await this.redis.zremrangebyscore('system:memory', 0, oneWeekAgo);
      await this.redis.zremrangebyscore('system:cpu', 0, oneWeekAgo);
      await this.redis.zremrangebyscore('cache:performance', 0, oneWeekAgo);

      // Clear expired cache keys
      const keys = await this.redis.keys('cache:*');
      for (const key of keys) {
        const ttl = await this.redis.ttl(key);
        if (ttl === -1) { // No expiration set
          await this.redis.expire(key, 3600); // Set 1 hour expiration
        }
      }

    } catch (error) {
      logger.error('Failed to clear old cache entries:', error);
    }
  }

  /**
   * Optimize cache strategy
   */
  async optimizeCacheStrategy() {
    try {
      // Analyze cache usage patterns and optimize
      // This is a placeholder for more sophisticated cache optimization
      logger.info('Cache strategy optimization triggered');
    } catch (error) {
      logger.error('Failed to optimize cache strategy:', error);
    }
  }

  /**
   * Optimize queue processing
   */
  async optimizeQueueProcessing() {
    try {
      // Implement queue optimization logic
      // This could involve scaling workers, prioritizing tasks, etc.
      logger.info('Queue processing optimization triggered');
    } catch (error) {
      logger.error('Failed to optimize queue processing:', error);
    }
  }
}

module.exports = new PerformanceService(); 