const db = require('../config/database');
const redisConfig = require('../config/redis');
const { logger } = require('../config/database');

class AnalyticsService {
  constructor() {
    this.redis = redisConfig;
    this.metricsCache = new Map();
    this.realTimeSubscribers = new Set();
  }

  // Analytics Metrics Collection

  async getSystemMetrics(timeRange = '24h', userId = null) {
    try {
      const { startDate, endDate, granularity } = this.parseTimeRange(timeRange);
      
      const metrics = await this.collectSystemMetrics(startDate, endDate, granularity, userId);
      
      // Cache results for 5 minutes
      const cacheKey = `metrics:${timeRange}:${userId || 'global'}`;
      await this.redis.set(cacheKey, JSON.stringify(metrics), 300);
      
      return {
        success: true,
        timeRange,
        granularity,
        startDate,
        endDate,
        metrics
      };
    } catch (error) {
      logger.error('Failed to get system metrics:', error);
      throw error;
    }
  }

  async collectSystemMetrics(startDate, endDate, granularity, userId) {
    // PERFORMANCE OPTIMIZATION: Execute all metrics collection in parallel
    const metricsPromises = [
      this.getFileProcessingMetrics(startDate, endDate, granularity, userId),
      this.getApiUsageMetrics(startDate, endDate, granularity, userId),
      this.getUserActivityMetrics(startDate, endDate, granularity, userId),
      this.getSystemPerformanceMetrics(startDate, endDate, granularity),
      this.getStorageMetrics(startDate, endDate, granularity, userId)
    ];

    // Add revenue metrics for global queries
    if (!userId) {
      metricsPromises.push(this.getRevenueMetrics(startDate, endDate, granularity));
    }

    try {
      const results = await Promise.all(metricsPromises);
      
      const metrics = {
        fileProcessing: results[0],
        apiUsage: results[1],
        userActivity: results[2],
        systemPerformance: results[3],
        storage: results[4]
      };

      if (!userId && results[5]) {
        metrics.revenue = results[5];
      }

      return metrics;
    } catch (error) {
      logger.error('Failed to collect system metrics in parallel:', error);
      throw error;
    }
  }

  async getFileProcessingMetrics(startDate, endDate, granularity, userId) {
    try {
      const userFilter = userId ? 'AND f.user_id = $3' : '';
      const params = [startDate, endDate];
      if (userId) params.push(userId);

      // PERFORMANCE OPTIMIZATION: Execute all file processing queries in parallel
      const timeSeriesQuery = this.buildTimeSeriesQuery('files', 'upload_date', granularity, userFilter);
      
      const [
        totalFiles,
        filesByStatus,
        timeSeries,
        avgProcessingTime,
        fileTypes,
        processingErrors
      ] = await Promise.all([
        db.query(`
          SELECT COUNT(*) as total
          FROM files f
          WHERE f.upload_date >= $1 AND f.upload_date <= $2 ${userFilter}
        `, params),
        
        db.query(`
          SELECT f.processing_status, COUNT(*) as count
          FROM files f
          WHERE f.upload_date >= $1 AND f.upload_date <= $2 ${userFilter}
          GROUP BY f.processing_status
        `, params),
        
        db.query(timeSeriesQuery, params),
        
        db.query(`
          SELECT AVG(EXTRACT(EPOCH FROM (f.updated_at - f.upload_date))) as avg_seconds
          FROM files f
          WHERE f.upload_date >= $1 AND f.upload_date <= $2 
            AND f.processing_status = 'completed' ${userFilter}
        `, params),
        
        db.query(`
          SELECT f.mime_type, COUNT(*) as count
          FROM files f
          WHERE f.upload_date >= $1 AND f.upload_date <= $2 ${userFilter}
          GROUP BY f.mime_type
          ORDER BY count DESC
          LIMIT 10
        `, params),
        
        db.query(`
          SELECT COUNT(*) as error_count
          FROM files f
          WHERE f.upload_date >= $1 AND f.upload_date <= $2 
            AND f.processing_status = 'failed' ${userFilter}
        `, params)
      ]);

      return {
        totalFiles: parseInt(totalFiles.rows[0].total),
        filesByStatus: filesByStatus.rows.reduce((acc, row) => {
          acc[row.processing_status] = parseInt(row.count);
          return acc;
        }, {}),
        timeSeries: timeSeries.rows,
        averageProcessingTime: parseFloat(avgProcessingTime.rows[0].avg_seconds) || 0,
        fileTypes: fileTypes.rows,
        errorRate: parseInt(processingErrors.rows[0].error_count) / parseInt(totalFiles.rows[0].total) || 0
      };
    } catch (error) {
      logger.error('Failed to get file processing metrics:', error);
      return {};
    }
  }

  async getApiUsageMetrics(startDate, endDate, granularity, userId) {
    try {
      const userFilter = userId ? 'AND ak.user_id = $3' : '';
      const params = [startDate, endDate];
      if (userId) params.push(userId);

      // Total API calls
      const totalCalls = await db.query(`
        SELECT COUNT(*) as total
        FROM api_usage au
        JOIN api_keys ak ON au.api_key_id = ak.id
        WHERE au.created_at >= $1 AND au.created_at <= $2 ${userFilter}
      `, params);

      // API calls by endpoint
      const callsByEndpoint = await db.query(`
        SELECT au.endpoint, COUNT(*) as count
        FROM api_usage au
        JOIN api_keys ak ON au.api_key_id = ak.id
        WHERE au.created_at >= $1 AND au.created_at <= $2 ${userFilter}
        GROUP BY au.endpoint
        ORDER BY count DESC
        LIMIT 10
      `, params);

      // API calls by status code
      const callsByStatus = await db.query(`
        SELECT au.status_code, COUNT(*) as count
        FROM api_usage au
        JOIN api_keys ak ON au.api_key_id = ak.id
        WHERE au.created_at >= $1 AND au.created_at <= $2 ${userFilter}
        GROUP BY au.status_code
      `, params);

      // Average response time
      const avgResponseTime = await db.query(`
        SELECT AVG(au.response_time) as avg_ms
        FROM api_usage au
        JOIN api_keys ak ON au.api_key_id = ak.id
        WHERE au.created_at >= $1 AND au.created_at <= $2 ${userFilter}
      `, params);

      // Time series data
      const timeSeriesQuery = this.buildTimeSeriesQuery('api_usage au JOIN api_keys ak ON au.api_key_id = ak.id', 'au.created_at', granularity, userFilter);
      const timeSeries = await db.query(timeSeriesQuery, params);

      // Rate limiting hits
      const rateLimitHits = await db.query(`
        SELECT COUNT(*) as hits
        FROM api_usage au
        JOIN api_keys ak ON au.api_key_id = ak.id
        WHERE au.created_at >= $1 AND au.created_at <= $2 
          AND au.status_code = 429 ${userFilter}
      `, params);

      return {
        totalCalls: parseInt(totalCalls.rows[0].total),
        callsByEndpoint: callsByEndpoint.rows,
        callsByStatus: callsByStatus.rows.reduce((acc, row) => {
          acc[row.status_code] = parseInt(row.count);
          return acc;
        }, {}),
        averageResponseTime: parseFloat(avgResponseTime.rows[0].avg_ms) || 0,
        timeSeries: timeSeries.rows,
        rateLimitHits: parseInt(rateLimitHits.rows[0].hits),
        errorRate: (callsByStatus.rows.find(r => r.status_code >= 400)?.count || 0) / parseInt(totalCalls.rows[0].total) || 0
      };
    } catch (error) {
      logger.error('Failed to get API usage metrics:', error);
      return {};
    }
  }

  async getUserActivityMetrics(startDate, endDate, granularity, userId) {
    try {
      const userFilter = userId ? 'AND user_id = $3' : '';
      const params = [startDate, endDate];
      if (userId) params.push(userId);

      // Active users
      const activeUsers = await db.query(`
        SELECT COUNT(DISTINCT user_id) as count
        FROM audit_logs
        WHERE created_at >= $1 AND created_at <= $2 ${userFilter}
      `, params);

      // User actions
      const userActions = await db.query(`
        SELECT action, COUNT(*) as count
        FROM audit_logs
        WHERE created_at >= $1 AND created_at <= $2 ${userFilter}
        GROUP BY action
        ORDER BY count DESC
        LIMIT 10
      `, params);

      // Session duration (approximate)
      const sessionData = await db.query(`
        SELECT 
          user_id,
          DATE(created_at) as date,
          MAX(created_at) - MIN(created_at) as session_duration
        FROM audit_logs
        WHERE created_at >= $1 AND created_at <= $2 ${userFilter}
        GROUP BY user_id, DATE(created_at)
      `, params);

      const avgSessionDuration = sessionData.rows.reduce((sum, row) => {
        return sum + (row.session_duration ? parseInt(row.session_duration) / 1000 : 0);
      }, 0) / (sessionData.rows.length || 1);

      // Time series data
      const timeSeriesQuery = this.buildTimeSeriesQuery('audit_logs', 'created_at', granularity, userFilter, 'COUNT(DISTINCT user_id)');
      const timeSeries = await db.query(timeSeriesQuery, params);

      return {
        activeUsers: parseInt(activeUsers.rows[0].count),
        userActions: userActions.rows,
        averageSessionDuration: avgSessionDuration,
        timeSeries: timeSeries.rows
      };
    } catch (error) {
      logger.error('Failed to get user activity metrics:', error);
      return {};
    }
  }

  async getSystemPerformanceMetrics(startDate, endDate, granularity) {
    try {
      // Get performance metrics from the performance_metrics table
      const performanceData = await db.query(`
        SELECT 
          metric_name,
          AVG(metric_value) as avg_value,
          MAX(metric_value) as max_value,
          MIN(metric_value) as min_value
        FROM performance_metrics
        WHERE timestamp >= $1 AND timestamp <= $2
        GROUP BY metric_name
      `, [startDate, endDate]);

      // Queue performance
      const queueStats = await this.getQueuePerformanceMetrics();

      // Database performance
      const dbStats = await this.getDatabasePerformanceMetrics();

      return {
        metrics: performanceData.rows.reduce((acc, row) => {
          acc[row.metric_name] = {
            average: parseFloat(row.avg_value),
            maximum: parseFloat(row.max_value),
            minimum: parseFloat(row.min_value)
          };
          return acc;
        }, {}),
        queueStats,
        databaseStats: dbStats
      };
    } catch (error) {
      logger.error('Failed to get system performance metrics:', error);
      return {};
    }
  }

  async getStorageMetrics(startDate, endDate, granularity, userId) {
    try {
      const userFilter = userId ? 'AND user_id = $3' : '';
      const params = [startDate, endDate];
      if (userId) params.push(userId);

      // Total storage used
      const totalStorage = await db.query(`
        SELECT SUM(file_size) as total_bytes
        FROM files
        WHERE upload_date >= $1 AND upload_date <= $2 ${userFilter}
      `, params);

      // Storage by file type
      const storageByType = await db.query(`
        SELECT 
          mime_type,
          SUM(file_size) as total_bytes,
          COUNT(*) as file_count
        FROM files
        WHERE upload_date >= $1 AND upload_date <= $2 ${userFilter}
        GROUP BY mime_type
        ORDER BY total_bytes DESC
      `, params);

      // Storage growth over time
      const timeSeriesQuery = this.buildTimeSeriesQuery('files', 'upload_date', granularity, userFilter, 'SUM(file_size)');
      const storageGrowth = await db.query(timeSeriesQuery, params);

      return {
        totalStorage: parseInt(totalStorage.rows[0].total_bytes) || 0,
        storageByType: storageByType.rows,
        storageGrowth: storageGrowth.rows
      };
    } catch (error) {
      logger.error('Failed to get storage metrics:', error);
      return {};
    }
  }

  async getRevenueMetrics(startDate, endDate, granularity) {
    try {
      // Revenue from subscriptions
      const subscriptionRevenue = await db.query(`
        SELECT 
          SUM(amount) as total_revenue,
          COUNT(*) as transaction_count
        FROM payments
        WHERE created_at >= $1 AND created_at <= $2 
          AND status = 'succeeded'
      `, [startDate, endDate]);

      // Revenue by plan
      const revenueByPlan = await db.query(`
        SELECT 
          s.plan_type,
          SUM(p.amount) as revenue,
          COUNT(p.id) as transactions
        FROM payments p
        JOIN subscriptions s ON p.subscription_id = s.id
        WHERE p.created_at >= $1 AND p.created_at <= $2 
          AND p.status = 'succeeded'
        GROUP BY s.plan_type
      `, [startDate, endDate]);

      // Revenue time series
      const timeSeriesQuery = this.buildTimeSeriesQuery('payments', 'created_at', granularity, "AND status = 'succeeded'", 'SUM(amount)');
      const revenueTimeSeries = await db.query(timeSeriesQuery, [startDate, endDate]);

      return {
        totalRevenue: parseInt(subscriptionRevenue.rows[0].total_revenue) || 0,
        transactionCount: parseInt(subscriptionRevenue.rows[0].transaction_count) || 0,
        revenueByPlan: revenueByPlan.rows,
        revenueTimeSeries: revenueTimeSeries.rows
      };
    } catch (error) {
      logger.error('Failed to get revenue metrics:', error);
      return {};
    }
  }

  // Real-time Metrics

  async getRealTimeMetrics() {
    try {
      const metrics = {};

      // Current processing queue status
      const queueService = require('./queueService');
      metrics.queueStats = await queueService.getAllQueueStats();

      // Active users (last 5 minutes)
      const activeUsers = await db.query(`
        SELECT COUNT(DISTINCT user_id) as count
        FROM audit_logs
        WHERE created_at >= NOW() - INTERVAL '5 minutes'
      `);
      metrics.activeUsers = parseInt(activeUsers.rows[0].count);

      // Recent API calls (last minute)
      const recentApiCalls = await db.query(`
        SELECT COUNT(*) as count
        FROM api_usage
        WHERE created_at >= NOW() - INTERVAL '1 minute'
      `);
      metrics.recentApiCalls = parseInt(recentApiCalls.rows[0].count);

      // Files being processed
      const processingFiles = await db.query(`
        SELECT COUNT(*) as count
        FROM files
        WHERE processing_status = 'processing'
      `);
      metrics.processingFiles = parseInt(processingFiles.rows[0].count);

      // System health
      metrics.systemHealth = await this.getSystemHealth();

      return metrics;
    } catch (error) {
      logger.error('Failed to get real-time metrics:', error);
      return {};
    }
  }

  async getSystemHealth() {
    try {
      const health = {
        status: 'healthy',
        checks: {}
      };

      // Database health
      try {
        await db.query('SELECT 1');
        health.checks.database = { status: 'healthy', responseTime: Date.now() };
      } catch (error) {
        health.checks.database = { status: 'unhealthy', error: error.message };
        health.status = 'degraded';
      }

      // Redis health
      try {
        await this.redis.healthCheck();
        health.checks.redis = { status: 'healthy' };
      } catch (error) {
        health.checks.redis = { status: 'unhealthy', error: error.message };
        health.status = 'degraded';
      }

      // Queue health
      try {
        const queueWorkers = require('../workers/queueWorkers');
        const queueHealth = await queueWorkers.healthCheck();
        health.checks.queues = queueHealth;
        if (queueHealth.status !== 'healthy') {
          health.status = 'degraded';
        }
      } catch (error) {
        health.checks.queues = { status: 'unhealthy', error: error.message };
        health.status = 'degraded';
      }

      return health;
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Usage Data with Granularity

  async getUsageData(timeRange = '24h', granularity = 'hour', userId = null) {
    try {
      const { startDate, endDate } = this.parseTimeRange(timeRange);
      
      const usageData = {
        fileUploads: await this.getFileUploadUsage(startDate, endDate, granularity, userId),
        apiCalls: await this.getApiCallUsage(startDate, endDate, granularity, userId),
        storageUsage: await this.getStorageUsage(startDate, endDate, granularity, userId),
        userActivity: await this.getUserActivityUsage(startDate, endDate, granularity, userId)
      };

      return {
        success: true,
        timeRange,
        granularity,
        startDate,
        endDate,
        data: usageData
      };
    } catch (error) {
      logger.error('Failed to get usage data:', error);
      throw error;
    }
  }

  async getFileUploadUsage(startDate, endDate, granularity, userId) {
    const userFilter = userId ? 'AND user_id = $3' : '';
    const params = [startDate, endDate];
    if (userId) params.push(userId);

    const query = this.buildTimeSeriesQuery('files', 'upload_date', granularity, userFilter);
    const result = await db.query(query, params);
    
    return result.rows;
  }

  async getApiCallUsage(startDate, endDate, granularity, userId) {
    const userFilter = userId ? 'AND ak.user_id = $3' : '';
    const params = [startDate, endDate];
    if (userId) params.push(userId);

    const query = this.buildTimeSeriesQuery('api_usage au JOIN api_keys ak ON au.api_key_id = ak.id', 'au.created_at', granularity, userFilter);
    const result = await db.query(query, params);
    
    return result.rows;
  }

  async getStorageUsage(startDate, endDate, granularity, userId) {
    const userFilter = userId ? 'AND user_id = $3' : '';
    const params = [startDate, endDate];
    if (userId) params.push(userId);

    const query = this.buildTimeSeriesQuery('files', 'upload_date', granularity, userFilter, 'SUM(file_size)');
    const result = await db.query(query, params);
    
    return result.rows;
  }

  async getUserActivityUsage(startDate, endDate, granularity, userId) {
    const userFilter = userId ? 'AND user_id = $3' : '';
    const params = [startDate, endDate];
    if (userId) params.push(userId);

    const query = this.buildTimeSeriesQuery('audit_logs', 'created_at', granularity, userFilter, 'COUNT(DISTINCT user_id)');
    const result = await db.query(query, params);
    
    return result.rows;
  }

  // Processing Queue Status

  async getProcessingQueueStatus(status = null, limit = 100) {
    try {
      let whereClause = '';
      const params = [limit];
      
      if (status) {
        whereClause = 'WHERE fpj.status = $2';
        params.splice(1, 0, status);
      }

      const jobs = await db.query(`
        SELECT 
          fpj.*,
          f.file_name,
          f.file_size,
          f.mime_type,
          u.email as user_email
        FROM file_processing_jobs fpj
        JOIN files f ON fpj.file_id = f.id
        JOIN users u ON f.user_id = u.id
        ${whereClause}
        ORDER BY fpj.created_at DESC
        LIMIT $${params.length}
      `, params);

      // Get queue statistics
      const queueService = require('./queueService');
      const queueStats = await queueService.getAllQueueStats();

      return {
        success: true,
        jobs: jobs.rows,
        queueStats,
        totalJobs: jobs.rows.length
      };
    } catch (error) {
      logger.error('Failed to get processing queue status:', error);
      throw error;
    }
  }

  // Utility Methods

  parseTimeRange(timeRange) {
    const now = new Date();
    let startDate, endDate, granularity;

    endDate = now;

    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        granularity = 'minute';
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        granularity = 'hour';
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        granularity = 'day';
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        granularity = 'day';
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        granularity = 'week';
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        granularity = 'hour';
    }

    return { startDate, endDate, granularity };
  }

  buildTimeSeriesQuery(table, dateColumn, granularity, whereClause = '', aggregateFunction = 'COUNT(*)') {
    let dateFormat;
    
    switch (granularity) {
      case 'minute':
        dateFormat = "DATE_TRUNC('minute', " + dateColumn + ")";
        break;
      case 'hour':
        dateFormat = "DATE_TRUNC('hour', " + dateColumn + ")";
        break;
      case 'day':
        dateFormat = "DATE_TRUNC('day', " + dateColumn + ")";
        break;
      case 'week':
        dateFormat = "DATE_TRUNC('week', " + dateColumn + ")";
        break;
      default:
        dateFormat = "DATE_TRUNC('hour', " + dateColumn + ")";
    }

    return `
      SELECT 
        ${dateFormat} as timestamp,
        ${aggregateFunction} as value
      FROM ${table}
      WHERE ${dateColumn} >= $1 AND ${dateColumn} <= $2 ${whereClause}
      GROUP BY ${dateFormat}
      ORDER BY timestamp
    `;
  }

  async getQueuePerformanceMetrics() {
    try {
      const queueService = require('./queueService');
      return await queueService.getAllQueueStats();
    } catch (error) {
      logger.error('Failed to get queue performance metrics:', error);
      return {};
    }
  }

  async getDatabasePerformanceMetrics() {
    try {
      // Get database connection stats
      const connectionStats = await db.query(`
        SELECT 
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections
        FROM pg_stat_activity
        WHERE datname = current_database()
      `);

      // Get database size
      const dbSize = await db.query(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `);

      return {
        connections: connectionStats.rows[0],
        databaseSize: dbSize.rows[0].size
      };
    } catch (error) {
      logger.error('Failed to get database performance metrics:', error);
      return {};
    }
  }

  // Performance Metrics Recording

  async recordPerformanceMetric(metricName, value, metadata = {}) {
    try {
      await db.query(`
        INSERT INTO performance_metrics (metric_name, metric_value, metadata, timestamp)
        VALUES ($1, $2, $3, NOW())
      `, [metricName, value, JSON.stringify(metadata)]);
    } catch (error) {
      logger.error('Failed to record performance metric:', error);
    }
  }

  // Real-time Broadcasting

  broadcastRealTimeUpdate(data) {
    // Broadcast to all connected WebSocket clients
    for (const subscriber of this.realTimeSubscribers) {
      try {
        subscriber.send(JSON.stringify({
          type: 'analytics_update',
          data,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        // Remove disconnected subscribers
        this.realTimeSubscribers.delete(subscriber);
      }
    }
  }

  addRealTimeSubscriber(ws) {
    this.realTimeSubscribers.add(ws);
    
    ws.on('close', () => {
      this.realTimeSubscribers.delete(ws);
    });
  }

  // Performance Metrics
  async getPerformanceMetrics(timeRange = '24h', metric = null) {
    try {
      const { startDate, endDate } = this.parseTimeRange(timeRange);
      
      const performanceData = {};
      
      if (!metric || metric === 'response_time') {
        performanceData.responseTime = await this.getResponseTimeMetrics(startDate, endDate);
      }
      
      if (!metric || metric === 'throughput') {
        performanceData.throughput = await this.getThroughputMetrics(startDate, endDate);
      }
      
      if (!metric || metric === 'error_rate') {
        performanceData.errorRate = await this.getErrorRateMetrics(startDate, endDate);
      }
      
      if (!metric || metric === 'cpu') {
        performanceData.cpu = await this.getCpuMetrics(startDate, endDate);
      }
      
      if (!metric || metric === 'memory') {
        performanceData.memory = await this.getMemoryMetrics(startDate, endDate);
      }
      
      return performanceData;
    } catch (error) {
      logger.error('Failed to get performance metrics:', error);
      throw error;
    }
  }

  async getResponseTimeMetrics(startDate, endDate) {
    const result = await db.query(`
      SELECT 
        AVG(response_time) as avg_response_time,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY response_time) as median_response_time,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time) as p95_response_time,
        PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time) as p99_response_time,
        MIN(response_time) as min_response_time,
        MAX(response_time) as max_response_time
      FROM api_usage
      WHERE created_at BETWEEN $1 AND $2
    `, [startDate, endDate]);

    return result.rows[0];
  }

  async getThroughputMetrics(startDate, endDate) {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_requests,
        COUNT(*) / EXTRACT(EPOCH FROM ($2 - $1)) * 3600 as requests_per_hour
      FROM api_usage
      WHERE created_at BETWEEN $1 AND $2
    `, [startDate, endDate]);

    return result.rows[0];
  }

  async getErrorRateMetrics(startDate, endDate) {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_requests,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_requests,
        (COUNT(CASE WHEN status_code >= 400 THEN 1 END)::float / COUNT(*) * 100) as error_rate_percent
      FROM api_usage
      WHERE created_at BETWEEN $1 AND $2
    `, [startDate, endDate]);

    return result.rows[0];
  }

  async getCpuMetrics(startDate, endDate) {
    // Mock CPU metrics - in production, this would come from system monitoring
    return {
      average: Math.random() * 50 + 25,
      peak: Math.random() * 30 + 70,
      current: Math.random() * 40 + 30
    };
  }

  async getMemoryMetrics(startDate, endDate) {
    // Mock memory metrics - in production, this would come from system monitoring
    return {
      used: Math.random() * 2048 + 1024,
      total: 4096,
      percentage: Math.random() * 30 + 40
    };
  }

  // Export Job Management
  async createExportJob(jobData) {
    try {
      const result = await db.query(`
        INSERT INTO export_jobs (
          user_id, export_type, format, time_range, filters, 
          status, requested_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id, created_at
      `, [
        jobData.userId,
        jobData.exportType,
        jobData.format,
        jobData.timeRange,
        JSON.stringify(jobData.filters),
        'pending',
        jobData.requestedBy
      ]);

      const job = result.rows[0];
      
      // Estimate completion time based on export type
      const estimatedTime = this.estimateExportTime(jobData.exportType, jobData.format);
      
      // Queue the export job for processing
      await this.queueExportJob(job.id);
      
      return {
        id: job.id,
        status: 'pending',
        createdAt: job.created_at,
        estimatedTime
      };
    } catch (error) {
      logger.error('Failed to create export job:', error);
      throw error;
    }
  }

  async getExportJobs(userId, options = {}) {
    try {
      const { status, limit = 20 } = options;
      
      let whereClause = 'WHERE user_id = $1';
      const params = [userId, limit];
      let paramCount = 1;

      if (status) {
        whereClause += ` AND status = $${++paramCount}`;
        params.splice(paramCount - 1, 0, status);
      }

      const result = await db.query(`
        SELECT 
          id, export_type, format, time_range, status, 
          progress, file_path, error_message, 
          created_at, started_at, completed_at
        FROM export_jobs
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramCount + 1}
      `, params);

      return result.rows.map(job => ({
        id: job.id,
        exportType: job.export_type,
        format: job.format,
        timeRange: job.time_range,
        status: job.status,
        progress: job.progress || 0,
        filePath: job.file_path,
        errorMessage: job.error_message,
        createdAt: job.created_at,
        startedAt: job.started_at,
        completedAt: job.completed_at
      }));
    } catch (error) {
      logger.error('Failed to get export jobs:', error);
      throw error;
    }
  }

  async getExportJobStatus(jobId, userId) {
    try {
      const result = await db.query(`
        SELECT 
          id, export_type, format, status, progress, 
          file_path, error_message, created_at, 
          started_at, completed_at, estimated_completion
        FROM export_jobs
        WHERE id = $1 AND user_id = $2
      `, [jobId, userId]);

      if (result.rows.length === 0) {
        return null;
      }

      const job = result.rows[0];
      
      return {
        id: job.id,
        exportType: job.export_type,
        format: job.format,
        status: job.status,
        progress: job.progress || 0,
        filePath: job.file_path,
        errorMessage: job.error_message,
        createdAt: job.created_at,
        startedAt: job.started_at,
        completedAt: job.completed_at,
        estimatedCompletion: job.estimated_completion
      };
    } catch (error) {
      logger.error('Failed to get export job status:', error);
      throw error;
    }
  }

  estimateExportTime(exportType, format) {
    // Estimate based on export type and format
    const baseTime = {
      'metrics': 30,
      'usage': 60,
      'queue': 15,
      'all': 120
    };
    
    const formatMultiplier = {
      'csv': 1,
      'excel': 1.5,
      'json': 1.2,
      'pdf': 2
    };
    
    return (baseTime[exportType] || 60) * (formatMultiplier[format] || 1);
  }

  async queueExportJob(jobId) {
    // In a real implementation, this would queue the job for background processing
    // For now, we'll just update the status
    await db.query(`
      UPDATE export_jobs 
      SET status = 'queued', started_at = NOW()
      WHERE id = $1
    `, [jobId]);
  }
}

const analyticsService = new AnalyticsService();

module.exports = analyticsService; 