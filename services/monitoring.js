const axios = require('axios');
const { MONITORING_CONFIG, validateHealthCheck } = require('../config/monitoring');

class MonitoringService {
  constructor() {
    this.healthCheckInterval = null;
    this.metricsCollectionInterval = null;
    this.alertHistory = new Map();
    this.healthStatus = {
      isHealthy: true,
      lastCheck: null,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0
    };
  }

  async start() {
    try {
      // Start health checks
      this.startHealthChecks();

      // Start metrics collection if enabled
      if (MONITORING_CONFIG.metrics.enabled) {
        this.startMetricsCollection();
      }

      console.log('✅ Monitoring service started successfully');
    } catch (error) {
      console.error('❌ Failed to start monitoring service:', error);
      throw error;
    }
  }

  stop() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.metricsCollectionInterval) {
      clearInterval(this.metricsCollectionInterval);
    }
    console.log('Monitoring service stopped');
  }

  startHealthChecks() {
    this.healthCheckInterval = setInterval(
      async () => {
        try {
          const response = await axios.get(MONITORING_CONFIG.health.path, {
            timeout: MONITORING_CONFIG.health.timeout
          });

          const validation = validateHealthCheck(response.data);

          if (response.status === MONITORING_CONFIG.health.expectedStatus && validation.valid) {
            this.handleHealthyResponse();
          } else {
            this.handleUnhealthyResponse(
              `Health check failed: ${validation.valid ? 'Unexpected status code' : validation.reason}`
            );
          }
        } catch (error) {
          this.handleUnhealthyResponse(`Health check error: ${error.message}`);
        }
      },
      MONITORING_CONFIG.health.interval
    );
  }

  startMetricsCollection() {
    this.metricsCollectionInterval = setInterval(
      async () => {
        try {
          const metrics = await this.collectMetrics();
          await this.storeMetrics(metrics);
        } catch (error) {
          console.error('Failed to collect metrics:', error);
        }
      },
      MONITORING_CONFIG.metrics.interval
    );
  }

  async collectMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      process: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      health: this.healthStatus
    };

    return metrics;
  }

  async storeMetrics(metrics) {
    // TODO: Implement metrics storage (e.g., to a time-series database)
    console.log('Collected metrics:', metrics);
  }

  handleHealthyResponse() {
    this.healthStatus.consecutiveSuccesses++;
    this.healthStatus.consecutiveFailures = 0;
    this.healthStatus.lastCheck = new Date().toISOString();

    if (
      !this.healthStatus.isHealthy &&
      this.healthStatus.consecutiveSuccesses >= MONITORING_CONFIG.health.healthyThreshold
    ) {
      this.healthStatus.isHealthy = true;
      this.sendAlert('recovery', 'Service has recovered and is healthy');
    }
  }

  handleUnhealthyResponse(reason) {
    this.healthStatus.consecutiveFailures++;
    this.healthStatus.consecutiveSuccesses = 0;
    this.healthStatus.lastCheck = new Date().toISOString();

    if (
      this.healthStatus.isHealthy &&
      this.healthStatus.consecutiveFailures >= MONITORING_CONFIG.health.unhealthyThreshold
    ) {
      this.healthStatus.isHealthy = false;
      this.sendAlert('critical', `Service is unhealthy: ${reason}`);
    }
  }

  async sendAlert(level, message) {
    if (!MONITORING_CONFIG.alerts.enabled) return;

    const now = Date.now();
    const alertKey = `${level}:${message}`;
    const lastAlert = this.alertHistory.get(alertKey);

    // Check alert throttling
    if (
      lastAlert &&
      now - lastAlert < MONITORING_CONFIG.alerts.throttling.minInterval
    ) {
      return;
    }

    // Update alert history
    this.alertHistory.set(alertKey, now);

    // Clean up old alert history
    this.cleanupAlertHistory();

    // Send alerts through configured channels
    try {
      if (MONITORING_CONFIG.alerts.channels.email.enabled) {
        await this.sendEmailAlert(level, message);
      }
      if (MONITORING_CONFIG.alerts.channels.slack.enabled) {
        await this.sendSlackAlert(level, message);
      }
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  async sendEmailAlert(level, message) {
    // TODO: Implement email alerts
    console.log('Email alert:', { level, message });
  }

  async sendSlackAlert(level, message) {
    if (!MONITORING_CONFIG.alerts.channels.slack.webhook) {
      return;
    }

    try {
      await axios.post(MONITORING_CONFIG.alerts.channels.slack.webhook, {
        text: `[${level.toUpperCase()}] ${message}`,
        attachments: [
          {
            color: level === 'critical' ? '#ff0000' : '#00ff00',
            fields: [
              {
                title: 'Status',
                value: this.healthStatus.isHealthy ? 'Healthy' : 'Unhealthy',
                short: true
              },
              {
                title: 'Last Check',
                value: this.healthStatus.lastCheck,
                short: true
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }

  cleanupAlertHistory() {
    const now = Date.now();
    const maxAge = MONITORING_CONFIG.alerts.throttling.minInterval * 2;

    for (const [key, timestamp] of this.alertHistory.entries()) {
      if (now - timestamp > maxAge) {
        this.alertHistory.delete(key);
      }
    }
  }
}

module.exports = new MonitoringService(); 