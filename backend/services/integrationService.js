/**
 * Integration Service - Enterprise Integrations Hub
 * Handles third-party integrations, API connectors, and data synchronization
 */

const axios = require('axios');
const crypto = require('crypto');
const { logger } = require('../config/database');
const cacheService = require('./cacheService');
const securityService = require('./securityService');

class IntegrationService {
  constructor() {
    this.integrations = new Map();
    this.connectors = new Map();
    this.webhookEndpoints = new Map();
    
    // Integration configuration
    this.config = {
      // Salesforce integration
      salesforce: {
        enabled: false,
        apiVersion: 'v58.0',
        timeout: 30000,
        retryAttempts: 3,
        rateLimitPerHour: 1000
      },
      
      // SharePoint integration
      sharepoint: {
        enabled: false,
        apiVersion: 'v1.0',
        timeout: 30000,
        retryAttempts: 3,
        rateLimitPerHour: 2000
      },
      
      // Slack integration
      slack: {
        enabled: false,
        timeout: 15000,
        retryAttempts: 2,
        rateLimitPerMinute: 50
      },
      
      // Microsoft Teams integration
      teams: {
        enabled: false,
        timeout: 15000,
        retryAttempts: 2,
        rateLimitPerMinute: 50
      },
      
      // Google Drive integration
      googleDrive: {
        enabled: false,
        apiVersion: 'v3',
        timeout: 30000,
        retryAttempts: 3,
        rateLimitPerHour: 1000
      },
      
      // Dropbox integration
      dropbox: {
        enabled: false,
        apiVersion: '2',
        timeout: 30000,
        retryAttempts: 3,
        rateLimitPerHour: 1000
      },
      
      // Zapier integration
      zapier: {
        enabled: false,
        timeout: 30000,
        retryAttempts: 2
      },
      
      // Make.com (Integromat) integration
      make: {
        enabled: false,
        timeout: 30000,
        retryAttempts: 2
      }
    };
    
    // Integration metrics
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      activeConnections: 0,
      dataTransferred: 0
    };
    
    // Initialize integrations
    this.initializeIntegrations();
  }

  /**
   * Initialize integration connectors
   */
  initializeIntegrations() {
    // Register built-in connectors
    this.registerConnector('salesforce', new SalesforceConnector());
    this.registerConnector('sharepoint', new SharePointConnector());
    this.registerConnector('slack', new SlackConnector());
    this.registerConnector('teams', new TeamsConnector());
    this.registerConnector('google-drive', new GoogleDriveConnector());
    this.registerConnector('dropbox', new DropboxConnector());
    this.registerConnector('zapier', new ZapierConnector());
    this.registerConnector('make', new MakeConnector());
    
    // Start monitoring
    this.startIntegrationMonitoring();
  }

  /**
   * Register a new integration connector
   */
  registerConnector(name, connector) {
    this.connectors.set(name, connector);
    logger.info(`Integration connector registered: ${name}`);
  }

  /**
   * Get integration connector
   */
  getConnector(name) {
    return this.connectors.get(name);
  }

  /**
   * Create integration connection
   */
  async createConnection(integrationName, credentials, config = {}) {
    try {
      const connector = this.getConnector(integrationName);
      if (!connector) {
        throw new Error(`Integration connector not found: ${integrationName}`);
      }

      // Validate credentials
      const validation = await connector.validateCredentials(credentials);
      if (!validation.valid) {
        throw new Error(`Invalid credentials: ${validation.error}`);
      }

      // Encrypt credentials
      const encryptedCredentials = securityService.encryptData(credentials);

      // Create connection
      const connection = {
        id: securityService.generateSecureToken(16),
        integrationName,
        credentials: encryptedCredentials,
        config,
        status: 'active',
        createdAt: Date.now(),
        lastUsed: null,
        metrics: {
          requests: 0,
          errors: 0,
          dataTransferred: 0
        }
      };

      // Store connection
      await cacheService.set(
        `integration:connection:${connection.id}`,
        connection,
        { ttl: 30 * 24 * 60 * 60 } // 30 days
      );

      this.integrations.set(connection.id, connection);
      this.metrics.activeConnections++;

      // Record security event
      await securityService.recordSecurityEvent({
        type: 'integration_connection_created',
        severity: 'info',
        details: { integrationName, connectionId: connection.id }
      });

      logger.info(`Integration connection created: ${integrationName} (${connection.id})`);
      return connection.id;

    } catch (error) {
      logger.error('Failed to create integration connection:', error);
      throw error;
    }
  }

  /**
   * Execute integration action
   */
  async executeAction(connectionId, action, data = {}) {
    try {
      const startTime = Date.now();
      
      // Get connection
      const connection = await this.getConnection(connectionId);
      if (!connection) {
        throw new Error('Integration connection not found');
      }

      // Get connector
      const connector = this.getConnector(connection.integrationName);
      if (!connector) {
        throw new Error(`Integration connector not found: ${connection.integrationName}`);
      }

      // Decrypt credentials
      const credentials = securityService.decryptData(connection.credentials);

      // Check rate limits
      await this.checkRateLimit(connection);

      // Execute action
      const result = await connector.executeAction(action, data, credentials, connection.config);

      // Update metrics
      const duration = Date.now() - startTime;
      this.updateConnectionMetrics(connectionId, true, duration, result.dataSize || 0);
      this.updateGlobalMetrics(true, duration);

      // Update last used timestamp
      connection.lastUsed = Date.now();
      await this.updateConnection(connectionId, connection);

      logger.info(`Integration action executed: ${connection.integrationName}.${action} (${duration}ms)`);
      return result;

    } catch (error) {
      const duration = Date.now() - Date.now();
      this.updateConnectionMetrics(connectionId, false, duration, 0);
      this.updateGlobalMetrics(false, duration);
      
      logger.error('Failed to execute integration action:', error);
      throw error;
    }
  }

  /**
   * Sync data between systems
   */
  async syncData(sourceConnectionId, targetConnectionId, syncConfig) {
    try {
      const syncId = securityService.generateSecureToken(16);
      
      logger.info(`Starting data sync: ${syncId}`);

      // Get connections
      const sourceConnection = await this.getConnection(sourceConnectionId);
      const targetConnection = await this.getConnection(targetConnectionId);

      if (!sourceConnection || !targetConnection) {
        throw new Error('Source or target connection not found');
      }

      // Get connectors
      const sourceConnector = this.getConnector(sourceConnection.integrationName);
      const targetConnector = this.getConnector(targetConnection.integrationName);

      // Extract data from source
      const sourceData = await this.executeAction(sourceConnectionId, 'extract', syncConfig.source);

      // Transform data if needed
      let transformedData = sourceData;
      if (syncConfig.transform) {
        transformedData = await this.transformData(sourceData, syncConfig.transform);
      }

      // Load data to target
      const result = await this.executeAction(targetConnectionId, 'load', {
        data: transformedData,
        ...syncConfig.target
      });

      // Record sync result
      const syncResult = {
        id: syncId,
        sourceConnection: sourceConnectionId,
        targetConnection: targetConnectionId,
        recordsProcessed: result.recordsProcessed || 0,
        recordsSuccessful: result.recordsSuccessful || 0,
        recordsFailed: result.recordsFailed || 0,
        duration: Date.now() - Date.now(),
        status: 'completed',
        timestamp: Date.now()
      };

      await cacheService.set(
        `integration:sync:${syncId}`,
        syncResult,
        { ttl: 7 * 24 * 60 * 60 } // 7 days
      );

      logger.info(`Data sync completed: ${syncId} (${syncResult.recordsProcessed} records)`);
      return syncResult;

    } catch (error) {
      logger.error('Failed to sync data:', error);
      throw error;
    }
  }

  /**
   * Transform data using transformation rules
   */
  async transformData(data, transformRules) {
    try {
      let transformedData = data;

      for (const rule of transformRules) {
        switch (rule.type) {
          case 'map':
            transformedData = this.mapFields(transformedData, rule.mapping);
            break;
          case 'filter':
            transformedData = this.filterData(transformedData, rule.condition);
            break;
          case 'aggregate':
            transformedData = this.aggregateData(transformedData, rule.aggregation);
            break;
          case 'validate':
            transformedData = this.validateData(transformedData, rule.validation);
            break;
          default:
            logger.warn(`Unknown transformation rule type: ${rule.type}`);
        }
      }

      return transformedData;

    } catch (error) {
      logger.error('Failed to transform data:', error);
      throw error;
    }
  }

  /**
   * Map fields according to mapping rules
   */
  mapFields(data, mapping) {
    if (Array.isArray(data)) {
      return data.map(item => this.mapSingleItem(item, mapping));
    } else {
      return this.mapSingleItem(data, mapping);
    }
  }

  /**
   * Map single data item
   */
  mapSingleItem(item, mapping) {
    const mapped = {};
    
    for (const [targetField, sourceField] of Object.entries(mapping)) {
      if (typeof sourceField === 'string') {
        mapped[targetField] = this.getNestedValue(item, sourceField);
      } else if (typeof sourceField === 'function') {
        mapped[targetField] = sourceField(item);
      } else if (sourceField.field) {
        let value = this.getNestedValue(item, sourceField.field);
        
        // Apply transformations
        if (sourceField.transform) {
          value = this.applyFieldTransform(value, sourceField.transform);
        }
        
        mapped[targetField] = value;
      }
    }
    
    return mapped;
  }

  /**
   * Get nested value from object
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  /**
   * Apply field transformation
   */
  applyFieldTransform(value, transform) {
    switch (transform.type) {
      case 'uppercase':
        return typeof value === 'string' ? value.toUpperCase() : value;
      case 'lowercase':
        return typeof value === 'string' ? value.toLowerCase() : value;
      case 'date':
        return new Date(value).toISOString();
      case 'number':
        return Number(value);
      case 'boolean':
        return Boolean(value);
      default:
        return value;
    }
  }

  /**
   * Filter data based on conditions
   */
  filterData(data, condition) {
    if (!Array.isArray(data)) {
      return data;
    }

    return data.filter(item => this.evaluateCondition(item, condition));
  }

  /**
   * Evaluate filter condition
   */
  evaluateCondition(item, condition) {
    const { field, operator, value } = condition;
    const itemValue = this.getNestedValue(item, field);

    switch (operator) {
      case 'equals':
        return itemValue === value;
      case 'not_equals':
        return itemValue !== value;
      case 'greater_than':
        return itemValue > value;
      case 'less_than':
        return itemValue < value;
      case 'contains':
        return typeof itemValue === 'string' && itemValue.includes(value);
      case 'exists':
        return itemValue !== undefined && itemValue !== null;
      default:
        return true;
    }
  }

  /**
   * Aggregate data
   */
  aggregateData(data, aggregation) {
    if (!Array.isArray(data)) {
      return data;
    }

    const { groupBy, aggregates } = aggregation;
    
    if (!groupBy) {
      // Simple aggregation without grouping
      const result = {};
      for (const [field, operation] of Object.entries(aggregates)) {
        result[field] = this.performAggregation(data, field, operation);
      }
      return result;
    }

    // Group by field and aggregate
    const groups = {};
    for (const item of data) {
      const groupKey = this.getNestedValue(item, groupBy);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    }

    const result = {};
    for (const [groupKey, groupData] of Object.entries(groups)) {
      result[groupKey] = {};
      for (const [field, operation] of Object.entries(aggregates)) {
        result[groupKey][field] = this.performAggregation(groupData, field, operation);
      }
    }

    return result;
  }

  /**
   * Perform aggregation operation
   */
  performAggregation(data, field, operation) {
    const values = data.map(item => this.getNestedValue(item, field)).filter(v => v !== undefined);

    switch (operation) {
      case 'count':
        return values.length;
      case 'sum':
        return values.reduce((sum, val) => sum + Number(val), 0);
      case 'avg':
        return values.length > 0 ? values.reduce((sum, val) => sum + Number(val), 0) / values.length : 0;
      case 'min':
        return Math.min(...values.map(Number));
      case 'max':
        return Math.max(...values.map(Number));
      default:
        return values.length;
    }
  }

  /**
   * Validate data
   */
  validateData(data, validation) {
    const errors = [];
    
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const itemErrors = this.validateSingleItem(item, validation);
        if (itemErrors.length > 0) {
          errors.push({ index, errors: itemErrors });
        }
      });
    } else {
      const itemErrors = this.validateSingleItem(data, validation);
      if (itemErrors.length > 0) {
        errors.push({ errors: itemErrors });
      }
    }

    if (errors.length > 0) {
      throw new Error(`Data validation failed: ${JSON.stringify(errors)}`);
    }

    return data;
  }

  /**
   * Validate single data item
   */
  validateSingleItem(item, validation) {
    const errors = [];

    for (const rule of validation.rules) {
      const value = this.getNestedValue(item, rule.field);
      
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`Field ${rule.field} is required`);
        continue;
      }

      if (value !== undefined && rule.type) {
        if (!this.validateFieldType(value, rule.type)) {
          errors.push(`Field ${rule.field} must be of type ${rule.type}`);
        }
      }

      if (value !== undefined && rule.pattern) {
        const regex = new RegExp(rule.pattern);
        if (!regex.test(String(value))) {
          errors.push(`Field ${rule.field} does not match required pattern`);
        }
      }
    }

    return errors;
  }

  /**
   * Validate field type
   */
  validateFieldType(value, type) {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'date':
        return !isNaN(Date.parse(value));
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      default:
        return true;
    }
  }

  /**
   * Setup webhook endpoint
   */
  async setupWebhook(connectionId, webhookConfig) {
    try {
      const connection = await this.getConnection(connectionId);
      if (!connection) {
        throw new Error('Integration connection not found');
      }

      const connector = this.getConnector(connection.integrationName);
      if (!connector) {
        throw new Error(`Integration connector not found: ${connection.integrationName}`);
      }

      // Generate webhook endpoint
      const webhookId = securityService.generateSecureToken(16);
      const webhookUrl = `${process.env.BACKEND_URL}/api/integrations/webhooks/${webhookId}`;

      // Setup webhook with external service
      const credentials = securityService.decryptData(connection.credentials);
      const webhookSetup = await connector.setupWebhook(webhookUrl, webhookConfig, credentials);

      // Store webhook configuration
      const webhook = {
        id: webhookId,
        connectionId,
        integrationName: connection.integrationName,
        url: webhookUrl,
        externalId: webhookSetup.id,
        config: webhookConfig,
        secret: securityService.generateSecureToken(32),
        status: 'active',
        createdAt: Date.now(),
        lastTriggered: null,
        metrics: {
          triggers: 0,
          errors: 0
        }
      };

      await cacheService.set(
        `integration:webhook:${webhookId}`,
        webhook,
        { ttl: 30 * 24 * 60 * 60 } // 30 days
      );

      this.webhookEndpoints.set(webhookId, webhook);

      logger.info(`Webhook setup completed: ${connection.integrationName} (${webhookId})`);
      return webhook;

    } catch (error) {
      logger.error('Failed to setup webhook:', error);
      throw error;
    }
  }

  /**
   * Process incoming webhook
   */
  async processWebhook(webhookId, payload, headers) {
    try {
      const webhook = await this.getWebhook(webhookId);
      if (!webhook) {
        throw new Error('Webhook not found');
      }

      // Verify webhook signature if required
      if (webhook.config.verifySignature) {
        const isValid = await this.verifyWebhookSignature(payload, headers, webhook.secret);
        if (!isValid) {
          throw new Error('Invalid webhook signature');
        }
      }

      // Get connector
      const connector = this.getConnector(webhook.integrationName);
      if (!connector) {
        throw new Error(`Integration connector not found: ${webhook.integrationName}`);
      }

      // Process webhook payload
      const result = await connector.processWebhook(payload, webhook.config);

      // Update webhook metrics
      webhook.metrics.triggers++;
      webhook.lastTriggered = Date.now();
      await this.updateWebhook(webhookId, webhook);

      logger.info(`Webhook processed: ${webhook.integrationName} (${webhookId})`);
      return result;

    } catch (error) {
      // Update error metrics
      const webhook = await this.getWebhook(webhookId);
      if (webhook) {
        webhook.metrics.errors++;
        await this.updateWebhook(webhookId, webhook);
      }

      logger.error('Failed to process webhook:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  async verifyWebhookSignature(payload, headers, secret) {
    try {
      const signature = headers['x-webhook-signature'] || headers['x-hub-signature-256'];
      if (!signature) {
        return false;
      }

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(`sha256=${expectedSignature}`)
      );

    } catch (error) {
      logger.error('Failed to verify webhook signature:', error);
      return false;
    }
  }

  /**
   * Get integration connection
   */
  async getConnection(connectionId) {
    let connection = this.integrations.get(connectionId);
    
    if (!connection) {
      connection = await cacheService.get(`integration:connection:${connectionId}`);
      if (connection) {
        this.integrations.set(connectionId, connection);
      }
    }
    
    return connection;
  }

  /**
   * Update integration connection
   */
  async updateConnection(connectionId, connection) {
    this.integrations.set(connectionId, connection);
    await cacheService.set(
      `integration:connection:${connectionId}`,
      connection,
      { ttl: 30 * 24 * 60 * 60 }
    );
  }

  /**
   * Get webhook configuration
   */
  async getWebhook(webhookId) {
    let webhook = this.webhookEndpoints.get(webhookId);
    
    if (!webhook) {
      webhook = await cacheService.get(`integration:webhook:${webhookId}`);
      if (webhook) {
        this.webhookEndpoints.set(webhookId, webhook);
      }
    }
    
    return webhook;
  }

  /**
   * Update webhook configuration
   */
  async updateWebhook(webhookId, webhook) {
    this.webhookEndpoints.set(webhookId, webhook);
    await cacheService.set(
      `integration:webhook:${webhookId}`,
      webhook,
      { ttl: 30 * 24 * 60 * 60 }
    );
  }

  /**
   * Check rate limits for integration
   */
  async checkRateLimit(connection) {
    const config = this.config[connection.integrationName];
    if (!config || !config.rateLimitPerHour) {
      return true;
    }

    const cacheKey = `integration:ratelimit:${connection.id}:${Math.floor(Date.now() / (60 * 60 * 1000))}`;
    const currentCount = await cacheService.get(cacheKey) || 0;

    if (currentCount >= config.rateLimitPerHour) {
      throw new Error(`Rate limit exceeded for ${connection.integrationName}`);
    }

    await cacheService.increment(cacheKey, 1, { ttl: 60 * 60 }); // 1 hour
    return true;
  }

  /**
   * Update connection metrics
   */
  updateConnectionMetrics(connectionId, success, duration, dataSize) {
    const connection = this.integrations.get(connectionId);
    if (connection) {
      connection.metrics.requests++;
      if (!success) {
        connection.metrics.errors++;
      }
      connection.metrics.dataTransferred += dataSize;
    }
  }

  /**
   * Update global metrics
   */
  updateGlobalMetrics(success, duration) {
    this.metrics.totalRequests++;
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }
    
    // Update average response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + duration) / 
      this.metrics.totalRequests;
  }

  /**
   * Start integration monitoring
   */
  startIntegrationMonitoring() {
    // Monitor integration health every 5 minutes
    setInterval(() => {
      this.monitorIntegrationHealth();
    }, 5 * 60 * 1000);

    // Clean up expired data every hour
    setInterval(() => {
      this.cleanupExpiredData();
    }, 60 * 60 * 1000);
  }

  /**
   * Monitor integration health
   */
  async monitorIntegrationHealth() {
    try {
      for (const [connectionId, connection] of this.integrations) {
        const connector = this.getConnector(connection.integrationName);
        if (connector && connector.healthCheck) {
          try {
            const credentials = securityService.decryptData(connection.credentials);
            const health = await connector.healthCheck(credentials);
            
            if (!health.healthy) {
              logger.warn(`Integration health check failed: ${connection.integrationName} (${connectionId})`);
            }
          } catch (error) {
            logger.error(`Integration health check error: ${connection.integrationName} (${connectionId})`, error);
          }
        }
      }
    } catch (error) {
      logger.error('Failed to monitor integration health:', error);
    }
  }

  /**
   * Clean up expired data
   */
  async cleanupExpiredData() {
    try {
      // Clean up old sync results
      const syncKeys = await cacheService.redis.keys('integration:sync:*');
      for (const key of syncKeys) {
        const sync = await cacheService.get(key);
        if (sync && Date.now() - sync.timestamp > 7 * 24 * 60 * 60 * 1000) {
          await cacheService.delete(key);
        }
      }

      logger.info('Integration data cleanup completed');
    } catch (error) {
      logger.error('Failed to cleanup integration data:', error);
    }
  }

  /**
   * Get integration metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      activeConnections: this.integrations.size,
      activeWebhooks: this.webhookEndpoints.size,
      timestamp: Date.now()
    };
  }

  /**
   * Get available integrations
   */
  getAvailableIntegrations() {
    return Array.from(this.connectors.keys()).map(name => ({
      name,
      enabled: this.config[name]?.enabled || false,
      config: this.config[name] || {}
    }));
  }
}

// Base connector class
class BaseConnector {
  constructor(name) {
    this.name = name;
  }

  async validateCredentials(credentials) {
    throw new Error('validateCredentials method must be implemented');
  }

  async executeAction(action, data, credentials, config) {
    throw new Error('executeAction method must be implemented');
  }

  async setupWebhook(url, config, credentials) {
    throw new Error('setupWebhook method not supported');
  }

  async processWebhook(payload, config) {
    throw new Error('processWebhook method not supported');
  }

  async healthCheck(credentials) {
    return { healthy: true };
  }
}

// Salesforce connector
class SalesforceConnector extends BaseConnector {
  constructor() {
    super('salesforce');
  }

  async validateCredentials(credentials) {
    try {
      // Validate Salesforce credentials
      const response = await axios.post(`${credentials.instanceUrl}/services/oauth2/token`, {
        grant_type: 'password',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        username: credentials.username,
        password: credentials.password + credentials.securityToken
      });

      return { valid: true, accessToken: response.data.access_token };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async executeAction(action, data, credentials, config) {
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error('Invalid Salesforce credentials');
    }

    const baseUrl = `${credentials.instanceUrl}/services/data/v58.0`;
    const headers = {
      'Authorization': `Bearer ${validation.accessToken}`,
      'Content-Type': 'application/json'
    };

    switch (action) {
      case 'query':
        return await this.executeQuery(baseUrl, headers, data.soql);
      case 'create':
        return await this.createRecord(baseUrl, headers, data.sobject, data.record);
      case 'update':
        return await this.updateRecord(baseUrl, headers, data.sobject, data.id, data.record);
      case 'delete':
        return await this.deleteRecord(baseUrl, headers, data.sobject, data.id);
      default:
        throw new Error(`Unsupported Salesforce action: ${action}`);
    }
  }

  async executeQuery(baseUrl, headers, soql) {
    const response = await axios.get(`${baseUrl}/query`, {
      headers,
      params: { q: soql }
    });
    return response.data;
  }

  async createRecord(baseUrl, headers, sobject, record) {
    const response = await axios.post(`${baseUrl}/sobjects/${sobject}`, record, { headers });
    return response.data;
  }

  async updateRecord(baseUrl, headers, sobject, id, record) {
    const response = await axios.patch(`${baseUrl}/sobjects/${sobject}/${id}`, record, { headers });
    return response.data;
  }

  async deleteRecord(baseUrl, headers, sobject, id) {
    await axios.delete(`${baseUrl}/sobjects/${sobject}/${id}`, { headers });
    return { success: true };
  }
}

// SharePoint connector
class SharePointConnector extends BaseConnector {
  constructor() {
    super('sharepoint');
  }

  async validateCredentials(credentials) {
    try {
      // Validate SharePoint credentials using Microsoft Graph API
      const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        grant_type: 'client_credentials',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        scope: 'https://graph.microsoft.com/.default'
      });

      return { valid: true, accessToken: response.data.access_token };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async executeAction(action, data, credentials, config) {
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error('Invalid SharePoint credentials');
    }

    const baseUrl = 'https://graph.microsoft.com/v1.0';
    const headers = {
      'Authorization': `Bearer ${validation.accessToken}`,
      'Content-Type': 'application/json'
    };

    switch (action) {
      case 'list-sites':
        return await this.listSites(baseUrl, headers);
      case 'list-files':
        return await this.listFiles(baseUrl, headers, data.siteId, data.driveId);
      case 'upload-file':
        return await this.uploadFile(baseUrl, headers, data.siteId, data.driveId, data.fileName, data.content);
      case 'download-file':
        return await this.downloadFile(baseUrl, headers, data.siteId, data.driveId, data.fileId);
      default:
        throw new Error(`Unsupported SharePoint action: ${action}`);
    }
  }

  async listSites(baseUrl, headers) {
    const response = await axios.get(`${baseUrl}/sites`, { headers });
    return response.data;
  }

  async listFiles(baseUrl, headers, siteId, driveId) {
    const response = await axios.get(`${baseUrl}/sites/${siteId}/drives/${driveId}/root/children`, { headers });
    return response.data;
  }

  async uploadFile(baseUrl, headers, siteId, driveId, fileName, content) {
    const response = await axios.put(
      `${baseUrl}/sites/${siteId}/drives/${driveId}/root:/${fileName}:/content`,
      content,
      { headers: { ...headers, 'Content-Type': 'application/octet-stream' } }
    );
    return response.data;
  }

  async downloadFile(baseUrl, headers, siteId, driveId, fileId) {
    const response = await axios.get(`${baseUrl}/sites/${siteId}/drives/${driveId}/items/${fileId}/content`, { headers });
    return response.data;
  }
}

// Slack connector
class SlackConnector extends BaseConnector {
  constructor() {
    super('slack');
  }

  async validateCredentials(credentials) {
    try {
      const response = await axios.post('https://slack.com/api/auth.test', {}, {
        headers: { 'Authorization': `Bearer ${credentials.botToken}` }
      });

      return { valid: response.data.ok, error: response.data.error };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async executeAction(action, data, credentials, config) {
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error('Invalid Slack credentials');
    }

    const headers = {
      'Authorization': `Bearer ${credentials.botToken}`,
      'Content-Type': 'application/json'
    };

    switch (action) {
      case 'send-message':
        return await this.sendMessage(headers, data.channel, data.text, data.attachments);
      case 'upload-file':
        return await this.uploadFile(headers, data.channels, data.file, data.filename);
      case 'list-channels':
        return await this.listChannels(headers);
      default:
        throw new Error(`Unsupported Slack action: ${action}`);
    }
  }

  async sendMessage(headers, channel, text, attachments) {
    const response = await axios.post('https://slack.com/api/chat.postMessage', {
      channel,
      text,
      attachments
    }, { headers });
    return response.data;
  }

  async uploadFile(headers, channels, file, filename) {
    const response = await axios.post('https://slack.com/api/files.upload', {
      channels,
      file,
      filename
    }, { headers });
    return response.data;
  }

  async listChannels(headers) {
    const response = await axios.get('https://slack.com/api/conversations.list', { headers });
    return response.data;
  }
}

// Teams connector
class TeamsConnector extends BaseConnector {
  constructor() {
    super('teams');
  }

  async validateCredentials(credentials) {
    try {
      const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        grant_type: 'client_credentials',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        scope: 'https://graph.microsoft.com/.default'
      });

      return { valid: true, accessToken: response.data.access_token };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async executeAction(action, data, credentials, config) {
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error('Invalid Teams credentials');
    }

    const baseUrl = 'https://graph.microsoft.com/v1.0';
    const headers = {
      'Authorization': `Bearer ${validation.accessToken}`,
      'Content-Type': 'application/json'
    };

    switch (action) {
      case 'send-message':
        return await this.sendMessage(baseUrl, headers, data.teamId, data.channelId, data.message);
      case 'list-teams':
        return await this.listTeams(baseUrl, headers);
      case 'list-channels':
        return await this.listChannels(baseUrl, headers, data.teamId);
      default:
        throw new Error(`Unsupported Teams action: ${action}`);
    }
  }

  async sendMessage(baseUrl, headers, teamId, channelId, message) {
    const response = await axios.post(
      `${baseUrl}/teams/${teamId}/channels/${channelId}/messages`,
      { body: { content: message } },
      { headers }
    );
    return response.data;
  }

  async listTeams(baseUrl, headers) {
    const response = await axios.get(`${baseUrl}/me/joinedTeams`, { headers });
    return response.data;
  }

  async listChannels(baseUrl, headers, teamId) {
    const response = await axios.get(`${baseUrl}/teams/${teamId}/channels`, { headers });
    return response.data;
  }
}

// Google Drive connector
class GoogleDriveConnector extends BaseConnector {
  constructor() {
    super('google-drive');
  }

  async validateCredentials(credentials) {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        grant_type: 'refresh_token',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: credentials.refreshToken
      });

      return { valid: true, accessToken: response.data.access_token };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async executeAction(action, data, credentials, config) {
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error('Invalid Google Drive credentials');
    }

    const headers = {
      'Authorization': `Bearer ${validation.accessToken}`,
      'Content-Type': 'application/json'
    };

    switch (action) {
      case 'list-files':
        return await this.listFiles(headers, data.folderId);
      case 'upload-file':
        return await this.uploadFile(headers, data.name, data.content, data.parentId);
      case 'download-file':
        return await this.downloadFile(headers, data.fileId);
      case 'create-folder':
        return await this.createFolder(headers, data.name, data.parentId);
      default:
        throw new Error(`Unsupported Google Drive action: ${action}`);
    }
  }

  async listFiles(headers, folderId) {
    const query = folderId ? `'${folderId}' in parents` : '';
    const response = await axios.get('https://www.googleapis.com/drive/v3/files', {
      headers,
      params: { q: query }
    });
    return response.data;
  }

  async uploadFile(headers, name, content, parentId) {
    const metadata = { name };
    if (parentId) metadata.parents = [parentId];

    const response = await axios.post('https://www.googleapis.com/upload/drive/v3/files', content, {
      headers: { ...headers, 'Content-Type': 'application/octet-stream' },
      params: { uploadType: 'media' }
    });
    return response.data;
  }

  async downloadFile(headers, fileId) {
    const response = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      headers,
      params: { alt: 'media' }
    });
    return response.data;
  }

  async createFolder(headers, name, parentId) {
    const metadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder'
    };
    if (parentId) metadata.parents = [parentId];

    const response = await axios.post('https://www.googleapis.com/drive/v3/files', metadata, { headers });
    return response.data;
  }
}

// Dropbox connector
class DropboxConnector extends BaseConnector {
  constructor() {
    super('dropbox');
  }

  async validateCredentials(credentials) {
    try {
      const response = await axios.post('https://api.dropboxapi.com/2/users/get_current_account', {}, {
        headers: { 'Authorization': `Bearer ${credentials.accessToken}` }
      });

      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async executeAction(action, data, credentials, config) {
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error('Invalid Dropbox credentials');
    }

    const headers = {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json'
    };

    switch (action) {
      case 'list-files':
        return await this.listFiles(headers, data.path);
      case 'upload-file':
        return await this.uploadFile(headers, data.path, data.content);
      case 'download-file':
        return await this.downloadFile(headers, data.path);
      case 'create-folder':
        return await this.createFolder(headers, data.path);
      default:
        throw new Error(`Unsupported Dropbox action: ${action}`);
    }
  }

  async listFiles(headers, path) {
    const response = await axios.post('https://api.dropboxapi.com/2/files/list_folder', {
      path: path || ''
    }, { headers });
    return response.data;
  }

  async uploadFile(headers, path, content) {
    const response = await axios.post('https://content.dropboxapi.com/2/files/upload', content, {
      headers: {
        ...headers,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({ path, mode: 'add', autorename: true })
      }
    });
    return response.data;
  }

  async downloadFile(headers, path) {
    const response = await axios.post('https://content.dropboxapi.com/2/files/download', {}, {
      headers: {
        ...headers,
        'Dropbox-API-Arg': JSON.stringify({ path })
      }
    });
    return response.data;
  }

  async createFolder(headers, path) {
    const response = await axios.post('https://api.dropboxapi.com/2/files/create_folder_v2', {
      path
    }, { headers });
    return response.data;
  }
}

// Zapier connector
class ZapierConnector extends BaseConnector {
  constructor() {
    super('zapier');
  }

  async validateCredentials(credentials) {
    // Zapier uses webhook URLs, so validation is simpler
    return { valid: !!credentials.webhookUrl };
  }

  async executeAction(action, data, credentials, config) {
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error('Invalid Zapier credentials');
    }

    switch (action) {
      case 'trigger':
        return await this.triggerZap(credentials.webhookUrl, data);
      default:
        throw new Error(`Unsupported Zapier action: ${action}`);
    }
  }

  async triggerZap(webhookUrl, data) {
    const response = await axios.post(webhookUrl, data);
    return response.data;
  }
}

// Make.com connector
class MakeConnector extends BaseConnector {
  constructor() {
    super('make');
  }

  async validateCredentials(credentials) {
    // Make.com uses webhook URLs, so validation is simpler
    return { valid: !!credentials.webhookUrl };
  }

  async executeAction(action, data, credentials, config) {
    const validation = await this.validateCredentials(credentials);
    if (!validation.valid) {
      throw new Error('Invalid Make.com credentials');
    }

    switch (action) {
      case 'trigger':
        return await this.triggerScenario(credentials.webhookUrl, data);
      default:
        throw new Error(`Unsupported Make.com action: ${action}`);
    }
  }

  async triggerScenario(webhookUrl, data) {
    const response = await axios.post(webhookUrl, data);
    return response.data;
  }
}

module.exports = new IntegrationService(); 