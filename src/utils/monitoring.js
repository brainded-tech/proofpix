// API Monitoring and Health Check Utilities
import { API_CONFIG, buildApiUrl } from '../config/api.config';

export class APIMonitor {
  constructor() {
    this.healthCheckInterval = null;
    this.metrics = {
      uptime: 0,
      responseTime: 0,
      errorRate: 0,
      lastCheck: null,
      status: 'unknown',
      version: 'Unknown',
      environment: 'Unknown'
    };
    this.listeners = [];
  }

  // Start monitoring
  startMonitoring(intervalMs = 30000) { // Check every 30 seconds
    this.stopMonitoring(); // Clear any existing interval
    
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);
    
    // Perform initial check
    this.performHealthCheck();
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  // Perform health check
  async performHealthCheck() {
    const startTime = Date.now();
    
    try {
      const response = await fetch(buildApiUrl('health'), {
        method: 'GET',
        timeout: 5000
      });
      
      const responseTime = Date.now() - startTime;
      const data = await response.json();
      
      this.metrics = {
        uptime: data.uptime || 0,
        responseTime,
        errorRate: 0,
        lastCheck: new Date().toISOString(),
        status: response.ok ? 'healthy' : 'unhealthy',
        version: data.version,
        environment: data.environment
      };
      
      this.notifyListeners('health_check_success', this.metrics);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.metrics = {
        ...this.metrics,
        responseTime,
        errorRate: this.metrics.errorRate + 1,
        lastCheck: new Date().toISOString(),
        status: 'error',
        error: error.message,
        version: this.metrics.version || 'Unknown',
        environment: this.metrics.environment || 'Unknown'
      };
      
      this.notifyListeners('health_check_error', this.metrics);
    }
  }

  // Add event listener
  addEventListener(callback) {
    this.listeners.push(callback);
  }

  // Remove event listener
  removeEventListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in monitoring listener:', error);
      }
    });
  }

  // Get current metrics
  getMetrics() {
    return { ...this.metrics };
  }

  // Test API endpoints
  async testEndpoints() {
    const endpoints = [
      { name: 'Health', url: buildApiUrl('health') },
      { name: 'Docs', url: buildApiUrl('docs') },
      { name: 'Analytics', url: buildApiUrl('analyticsHealth') },
      { name: 'Auth', url: buildApiUrl('auth') }
    ];

    const results = [];

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      
      try {
        const response = await fetch(endpoint.url, {
          method: 'GET',
          timeout: 5000
        });
        
        const responseTime = Date.now() - startTime;
        
        results.push({
          name: endpoint.name,
          url: endpoint.url,
          status: response.ok ? 'success' : 'error',
          responseTime,
          statusCode: response.status
        });
        
      } catch (error) {
        const responseTime = Date.now() - startTime;
        
        results.push({
          name: endpoint.name,
          url: endpoint.url,
          status: 'error',
          responseTime,
          error: error.message
        });
      }
    }

    return results;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.maxMetrics = 100; // Keep last 100 measurements
  }

  // Track API call performance
  trackApiCall(endpoint, method, responseTime, success) {
    const metric = {
      endpoint,
      method,
      responseTime,
      success,
      timestamp: Date.now()
    };

    this.metrics.push(metric);

    // Keep only the last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  // Get performance statistics
  getStats() {
    if (this.metrics.length === 0) {
      return null;
    }

    const responseTimes = this.metrics.map(m => m.responseTime);
    const successCount = this.metrics.filter(m => m.success).length;

    return {
      totalCalls: this.metrics.length,
      successRate: (successCount / this.metrics.length) * 100,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      last24Hours: this.metrics.filter(m => Date.now() - m.timestamp < 24 * 60 * 60 * 1000).length
    };
  }

  // Get metrics for specific endpoint
  getEndpointStats(endpoint) {
    const endpointMetrics = this.metrics.filter(m => m.endpoint === endpoint);
    
    if (endpointMetrics.length === 0) {
      return null;
    }

    const responseTimes = endpointMetrics.map(m => m.responseTime);
    const successCount = endpointMetrics.filter(m => m.success).length;

    return {
      endpoint,
      totalCalls: endpointMetrics.length,
      successRate: (successCount / endpointMetrics.length) * 100,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    };
  }
}

// Error tracking
export class ErrorTracker {
  constructor() {
    this.errors = [];
    this.maxErrors = 50; // Keep last 50 errors
  }

  // Track an error
  trackError(error, context = {}) {
    const errorRecord = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    };

    this.errors.push(errorRecord);

    // Keep only the last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error tracked:', errorRecord);
    }
  }

  // Get recent errors
  getRecentErrors(limit = 10) {
    return this.errors
      .slice(-limit)
      .reverse(); // Most recent first
  }

  // Get error statistics
  getErrorStats() {
    if (this.errors.length === 0) {
      return null;
    }

    const last24Hours = this.errors.filter(e => Date.now() - e.timestamp < 24 * 60 * 60 * 1000);
    const lastHour = this.errors.filter(e => Date.now() - e.timestamp < 60 * 60 * 1000);

    return {
      totalErrors: this.errors.length,
      last24Hours: last24Hours.length,
      lastHour: lastHour.length,
      errorRate: (this.errors.length / 100) * 100 // Assuming 100 total operations
    };
  }
}

// Create singleton instances
export const apiMonitor = new APIMonitor();
export const performanceMonitor = new PerformanceMonitor();
export const errorTracker = new ErrorTracker();

// Enhanced API client with monitoring
export const monitoredApiClient = {
  async request(endpoint, options = {}) {
    const startTime = Date.now();
    const method = options.method || 'GET';
    
    try {
      const response = await fetch(buildApiUrl(endpoint), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      const responseTime = Date.now() - startTime;
      const success = response.ok;

      // Track performance
      performanceMonitor.trackApiCall(endpoint, method, responseTime, success);

      if (!success) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Track performance (failed)
      performanceMonitor.trackApiCall(endpoint, method, responseTime, false);
      
      // Track error
      errorTracker.trackError(error, { endpoint, method, options });
      
      throw error;
    }
  },

  get: (endpoint, options = {}) => 
    monitoredApiClient.request(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => 
    monitoredApiClient.request(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  upload: async (endpoint, formData, options = {}) => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(buildApiUrl(endpoint), {
        method: 'POST',
        body: formData,
        ...options
      });

      const responseTime = Date.now() - startTime;
      const success = response.ok;

      performanceMonitor.trackApiCall(endpoint, 'POST', responseTime, success);

      if (!success) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      return response.json();

    } catch (error) {
      const responseTime = Date.now() - startTime;
      performanceMonitor.trackApiCall(endpoint, 'POST', responseTime, false);
      errorTracker.trackError(error, { endpoint, type: 'upload' });
      throw error;
    }
  }
};

export default {
  apiMonitor,
  performanceMonitor,
  errorTracker,
  monitoredApiClient
}; 