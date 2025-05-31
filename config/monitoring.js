const MONITORING_CONFIG = {
  // Health check settings
  health: {
    interval: 60000, // Check every minute
    timeout: 5000, // 5 second timeout
    unhealthyThreshold: 3, // Number of failed checks before marking as unhealthy
    healthyThreshold: 2, // Number of successful checks before marking as healthy
    path: '/health',
    expectedStatus: 200,
    requiredKeys: ['status', 'timestamp', 'system', 'application']
  },

  // Performance thresholds
  thresholds: {
    cpu: {
      warning: 70, // Percentage
      critical: 85
    },
    memory: {
      warning: 75, // Percentage
      critical: 90
    },
    responseTime: {
      warning: 1000, // Milliseconds
      critical: 3000
    },
    errorRate: {
      warning: 1, // Percentage
      critical: 5
    }
  },

  // Metrics collection
  metrics: {
    enabled: true,
    interval: 15000, // Collect every 15 seconds
    retention: {
      raw: '2h', // Keep raw metrics for 2 hours
      minute: '24h', // 1-minute aggregates for 24 hours
      hour: '7d', // 1-hour aggregates for 7 days
      day: '30d' // 1-day aggregates for 30 days
    }
  },

  // Alerting configuration
  alerts: {
    enabled: true,
    channels: {
      email: {
        enabled: true,
        recipients: ['alerts@proofpixapp.com']
      },
      slack: {
        enabled: true,
        webhook: process.env.SLACK_WEBHOOK_URL
      }
    },
    throttling: {
      minInterval: 300000, // Minimum 5 minutes between similar alerts
      maxAlerts: 10 // Maximum alerts per hour
    }
  },

  // Logging configuration
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: 'json',
    destination: process.env.LOG_DESTINATION || 'stdout',
    retention: '7d'
  },

  // Tracing configuration
  tracing: {
    enabled: true,
    sampleRate: 0.1, // Sample 10% of requests
    excludePaths: [
      '/health',
      '/metrics',
      '/_next/static/',
      '/static/',
      '/favicon.ico'
    ]
  }
};

// Health check validation function
const validateHealthCheck = (data) => {
  // Check required keys
  for (const key of MONITORING_CONFIG.health.requiredKeys) {
    if (!(key in data)) {
      return {
        valid: false,
        reason: `Missing required key: ${key}`
      };
    }
  }

  // Validate system metrics
  if (data.system) {
    const { cpu, memory } = data.system;
    
    // Check CPU usage
    if (cpu.user + cpu.system > MONITORING_CONFIG.thresholds.cpu.critical) {
      return {
        valid: false,
        reason: 'CPU usage above critical threshold'
      };
    }

    // Check memory usage
    const memoryUsagePercent = (memory.heapUsed / memory.heapTotal) * 100;
    if (memoryUsagePercent > MONITORING_CONFIG.thresholds.memory.critical) {
      return {
        valid: false,
        reason: 'Memory usage above critical threshold'
      };
    }
  }

  return { valid: true };
};

module.exports = {
  MONITORING_CONFIG,
  validateHealthCheck
}; 