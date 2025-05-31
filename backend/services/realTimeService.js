const WebSocket = require('ws');
const { logger } = require('../config/database');
const analyticsService = require('./analyticsService');
const queueService = require('./queueService');
const redisConfig = require('../config/redis');

class RealTimeService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // Map of client ID to WebSocket connection
    this.subscriptions = new Map(); // Map of subscription type to Set of client IDs
    this.redis = redisConfig;
    this.heartbeatInterval = null;
    this.metricsInterval = null;
    
    // Initialize subscription types
    this.subscriptionTypes = [
      'analytics',
      'processing',
      'notifications',
      'user-activity',
      'system-health',
      'api-usage'
    ];
    
    this.subscriptionTypes.forEach(type => {
      this.subscriptions.set(type, new Set());
    });
  }

  // WebSocket Server Setup

  initialize(server) {
    try {
      this.wss = new WebSocket.Server({ 
        server,
        path: '/api/ws',
        verifyClient: this.verifyClient.bind(this)
      });

      this.wss.on('connection', this.handleConnection.bind(this));
      this.wss.on('error', (error) => {
        logger.error('WebSocket server error:', error);
      });

      // Start periodic updates
      this.startPeriodicUpdates();
      
      // Subscribe to Redis pub/sub for distributed updates
      this.subscribeToRedisUpdates();

      logger.info('Real-time WebSocket server initialized');
    } catch (error) {
      logger.error('Failed to initialize WebSocket server:', error);
      throw error;
    }
  }

  verifyClient(info) {
    // Basic verification - in production, verify JWT token
    const origin = info.origin;
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    return allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development';
  }

  handleConnection(ws, request) {
    const clientId = this.generateClientId();
    const userAgent = request.headers['user-agent'];
    const ip = request.connection.remoteAddress;
    
    // Store client connection
    this.clients.set(clientId, {
      ws,
      subscriptions: new Set(),
      userId: null,
      connectedAt: new Date(),
      lastPing: new Date(),
      userAgent,
      ip
    });

    logger.info(`WebSocket client connected: ${clientId} from ${ip}`);

    // Set up message handlers
    ws.on('message', (message) => {
      this.handleMessage(clientId, message);
    });

    ws.on('close', (code, reason) => {
      this.handleDisconnection(clientId, code, reason);
    });

    ws.on('error', (error) => {
      logger.error(`WebSocket client error (${clientId}):`, error);
      this.handleDisconnection(clientId);
    });

    ws.on('pong', () => {
      const client = this.clients.get(clientId);
      if (client) {
        client.lastPing = new Date();
      }
    });

    // Send welcome message
    this.sendToClient(clientId, {
      type: 'connection',
      status: 'connected',
      clientId,
      timestamp: new Date().toISOString(),
      availableSubscriptions: this.subscriptionTypes
    });
  }

  handleMessage(clientId, message) {
    try {
      const data = JSON.parse(message);
      const client = this.clients.get(clientId);
      
      if (!client) {
        return;
      }

      switch (data.type) {
        case 'authenticate':
          this.handleAuthentication(clientId, data);
          break;
        case 'subscribe':
          this.handleSubscription(clientId, data);
          break;
        case 'unsubscribe':
          this.handleUnsubscription(clientId, data);
          break;
        case 'ping':
          this.handlePing(clientId);
          break;
        case 'request_data':
          this.handleDataRequest(clientId, data);
          break;
        default:
          this.sendToClient(clientId, {
            type: 'error',
            message: 'Unknown message type',
            timestamp: new Date().toISOString()
          });
      }
    } catch (error) {
      logger.error(`Failed to handle WebSocket message from ${clientId}:`, error);
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Invalid message format',
        timestamp: new Date().toISOString()
      });
    }
  }

  handleAuthentication(clientId, data) {
    const { token, userId } = data;
    const client = this.clients.get(clientId);
    
    if (!client) return;

    // TODO: Verify JWT token
    // For now, just store the userId
    client.userId = userId;
    
    this.sendToClient(clientId, {
      type: 'authentication',
      status: 'authenticated',
      userId,
      timestamp: new Date().toISOString()
    });

    logger.info(`WebSocket client authenticated: ${clientId} (user: ${userId})`);
  }

  handleSubscription(clientId, data) {
    const { subscriptions } = data;
    const client = this.clients.get(clientId);
    
    if (!client) return;

    const validSubscriptions = [];
    const invalidSubscriptions = [];

    subscriptions.forEach(subscription => {
      if (this.subscriptionTypes.includes(subscription)) {
        // Add client to subscription
        this.subscriptions.get(subscription).add(clientId);
        client.subscriptions.add(subscription);
        validSubscriptions.push(subscription);
      } else {
        invalidSubscriptions.push(subscription);
      }
    });

    this.sendToClient(clientId, {
      type: 'subscription',
      status: 'updated',
      validSubscriptions,
      invalidSubscriptions,
      timestamp: new Date().toISOString()
    });

    // Send initial data for new subscriptions
    validSubscriptions.forEach(subscription => {
      this.sendInitialData(clientId, subscription);
    });

    logger.info(`WebSocket client subscribed: ${clientId} to ${validSubscriptions.join(', ')}`);
  }

  handleUnsubscription(clientId, data) {
    const { subscriptions } = data;
    const client = this.clients.get(clientId);
    
    if (!client) return;

    subscriptions.forEach(subscription => {
      this.subscriptions.get(subscription)?.delete(clientId);
      client.subscriptions.delete(subscription);
    });

    this.sendToClient(clientId, {
      type: 'unsubscription',
      status: 'updated',
      unsubscribed: subscriptions,
      timestamp: new Date().toISOString()
    });

    logger.info(`WebSocket client unsubscribed: ${clientId} from ${subscriptions.join(', ')}`);
  }

  handlePing(clientId) {
    const client = this.clients.get(clientId);
    if (client) {
      client.lastPing = new Date();
      this.sendToClient(clientId, {
        type: 'pong',
        timestamp: new Date().toISOString()
      });
    }
  }

  async handleDataRequest(clientId, data) {
    const { requestType, params } = data;
    const client = this.clients.get(clientId);
    
    if (!client) return;

    try {
      let responseData;

      switch (requestType) {
        case 'analytics_metrics':
          responseData = await analyticsService.getSystemMetrics(
            params.timeRange, 
            client.userId
          );
          break;
        case 'real_time_metrics':
          responseData = await analyticsService.getRealTimeMetrics();
          break;
        case 'queue_status':
          responseData = await analyticsService.getProcessingQueueStatus(
            params.status, 
            params.limit
          );
          break;
        case 'usage_data':
          responseData = await analyticsService.getUsageData(
            params.timeRange, 
            params.granularity, 
            client.userId
          );
          break;
        default:
          throw new Error(`Unknown request type: ${requestType}`);
      }

      this.sendToClient(clientId, {
        type: 'data_response',
        requestType,
        data: responseData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Failed to handle data request from ${clientId}:`, error);
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Failed to fetch requested data',
        requestType,
        timestamp: new Date().toISOString()
      });
    }
  }

  handleDisconnection(clientId, code, reason) {
    const client = this.clients.get(clientId);
    
    if (client) {
      // Remove from all subscriptions
      client.subscriptions.forEach(subscription => {
        this.subscriptions.get(subscription)?.delete(clientId);
      });
      
      // Remove client
      this.clients.delete(clientId);
      
      logger.info(`WebSocket client disconnected: ${clientId} (code: ${code}, reason: ${reason})`);
    }
  }

  // Data Broadcasting

  async sendInitialData(clientId, subscription) {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      let data;

      switch (subscription) {
        case 'analytics':
          data = await analyticsService.getSystemMetrics('24h', client.userId);
          break;
        case 'processing':
          data = await analyticsService.getProcessingQueueStatus();
          break;
        case 'system-health':
          data = await analyticsService.getSystemHealth();
          break;
        case 'api-usage':
          data = await analyticsService.getApiUsageMetrics(
            new Date(Date.now() - 24 * 60 * 60 * 1000),
            new Date(),
            'hour',
            client.userId
          );
          break;
        default:
          return;
      }

      this.sendToClient(clientId, {
        type: 'initial_data',
        subscription,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Failed to send initial data for ${subscription} to ${clientId}:`, error);
    }
  }

  broadcastToSubscription(subscription, data) {
    const subscribers = this.subscriptions.get(subscription);
    if (!subscribers) return;

    const message = {
      type: 'broadcast',
      subscription,
      data,
      timestamp: new Date().toISOString()
    };

    subscribers.forEach(clientId => {
      this.sendToClient(clientId, message);
    });

    // Also publish to Redis for distributed systems
    this.redis.publish(`ws:${subscription}`, JSON.stringify(message));
  }

  sendToClient(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      client.ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      logger.error(`Failed to send message to client ${clientId}:`, error);
      this.handleDisconnection(clientId);
      return false;
    }
  }

  // Periodic Updates

  startPeriodicUpdates() {
    // Heartbeat to check client connections
    this.heartbeatInterval = setInterval(() => {
      this.performHeartbeat();
    }, 30000); // Every 30 seconds

    // Real-time metrics updates
    this.metricsInterval = setInterval(async () => {
      await this.broadcastRealTimeMetrics();
    }, 5000); // Every 5 seconds

    logger.info('Started periodic WebSocket updates');
  }

  performHeartbeat() {
    const now = new Date();
    const timeout = 60000; // 1 minute timeout

    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        // Check if client is still responsive
        if (now - client.lastPing > timeout) {
          logger.warn(`Client ${clientId} timed out, closing connection`);
          client.ws.terminate();
          this.handleDisconnection(clientId);
        } else {
          // Send ping
          client.ws.ping();
        }
      } else {
        // Clean up dead connections
        this.handleDisconnection(clientId);
      }
    });
  }

  async broadcastRealTimeMetrics() {
    try {
      // Get real-time metrics
      const metrics = await analyticsService.getRealTimeMetrics();
      
      // Broadcast to analytics subscribers
      this.broadcastToSubscription('analytics', {
        type: 'real_time_metrics',
        metrics
      });

      // Get queue status for processing subscribers
      const queueStats = await queueService.getAllQueueStats();
      this.broadcastToSubscription('processing', {
        type: 'queue_status',
        stats: queueStats
      });

      // Get system health
      const systemHealth = await analyticsService.getSystemHealth();
      this.broadcastToSubscription('system-health', {
        type: 'system_health',
        health: systemHealth
      });
    } catch (error) {
      logger.error('Failed to broadcast real-time metrics:', error);
    }
  }

  // Redis Pub/Sub for Distributed Systems

  subscribeToRedisUpdates() {
    try {
      const subscriber = this.redis.createSubscriber();
      
      // Subscribe to all WebSocket channels
      this.subscriptionTypes.forEach(type => {
        subscriber.subscribe(`ws:${type}`);
      });

      subscriber.on('message', (channel, message) => {
        try {
          const data = JSON.parse(message);
          const subscription = channel.replace('ws:', '');
          
          // Re-broadcast to local clients
          const subscribers = this.subscriptions.get(subscription);
          if (subscribers) {
            subscribers.forEach(clientId => {
              this.sendToClient(clientId, data);
            });
          }
        } catch (error) {
          logger.error('Failed to handle Redis pub/sub message:', error);
        }
      });

      logger.info('Subscribed to Redis WebSocket updates');
    } catch (error) {
      logger.error('Failed to subscribe to Redis updates:', error);
    }
  }

  // Event Handlers for External Services

  onFileProcessingUpdate(fileId, status, progress) {
    this.broadcastToSubscription('processing', {
      type: 'file_processing_update',
      fileId,
      status,
      progress,
      timestamp: new Date().toISOString()
    });
  }

  onApiUsageUpdate(usage) {
    this.broadcastToSubscription('api-usage', {
      type: 'api_usage_update',
      usage,
      timestamp: new Date().toISOString()
    });
  }

  onUserActivityUpdate(activity) {
    this.broadcastToSubscription('user-activity', {
      type: 'user_activity_update',
      activity,
      timestamp: new Date().toISOString()
    });
  }

  onSystemNotification(notification) {
    this.broadcastToSubscription('notifications', {
      type: 'system_notification',
      notification,
      timestamp: new Date().toISOString()
    });
  }

  // Utility Methods

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getConnectionStats() {
    const stats = {
      totalConnections: this.clients.size,
      subscriptionStats: {},
      clientsByUser: {}
    };

    // Count subscriptions
    this.subscriptions.forEach((clients, subscription) => {
      stats.subscriptionStats[subscription] = clients.size;
    });

    // Count clients by user
    this.clients.forEach(client => {
      if (client.userId) {
        stats.clientsByUser[client.userId] = (stats.clientsByUser[client.userId] || 0) + 1;
      }
    });

    return stats;
  }

  // Cleanup

  shutdown() {
    try {
      // Clear intervals
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
      }
      if (this.metricsInterval) {
        clearInterval(this.metricsInterval);
      }

      // Close all client connections
      this.clients.forEach((client, clientId) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.close(1001, 'Server shutting down');
        }
      });

      // Close WebSocket server
      if (this.wss) {
        this.wss.close();
      }

      logger.info('Real-time service shut down successfully');
    } catch (error) {
      logger.error('Error during real-time service shutdown:', error);
    }
  }
}

const realTimeService = new RealTimeService();

module.exports = realTimeService; 