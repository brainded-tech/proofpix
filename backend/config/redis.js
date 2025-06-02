const Redis = require('ioredis');
const { logger } = require('./database');

class RedisConfig {
  constructor() {
    this.redis = null;
    this.subscriber = null;
    this.publisher = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Use REDIS_URL if available, otherwise fall back to individual variables
      const redisConfig = process.env.REDIS_URL || {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0,
        retryDelayOnFailover: 100,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
        retryDelayOnClusterDown: 300,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3
      };

      // Main Redis connection
      this.redis = new Redis(redisConfig);
      
      // Separate connections for pub/sub
      this.subscriber = new Redis(redisConfig);
      this.publisher = new Redis(redisConfig);

      // Event handlers
      this.redis.on('connect', () => {
        logger.info('Redis connected successfully');
        this.isConnected = true;
      });

      this.redis.on('error', (error) => {
        logger.error('Redis connection error:', error);
        this.isConnected = false;
      });

      this.redis.on('close', () => {
        logger.warn('Redis connection closed');
        this.isConnected = false;
      });

      this.redis.on('reconnecting', () => {
        logger.info('Redis reconnecting...');
      });

      // Connect to Redis
      await this.redis.connect();
      await this.subscriber.connect();
      await this.publisher.connect();

      // Test connection
      await this.redis.ping();
      logger.info('Redis connection established and tested');

      return true;
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      return false;
    }
  }

  async disconnect() {
    try {
      if (this.redis) {
        await this.redis.quit();
      }
      if (this.subscriber) {
        await this.subscriber.quit();
      }
      if (this.publisher) {
        await this.publisher.quit();
      }
      this.isConnected = false;
      logger.info('Redis connections closed');
    } catch (error) {
      logger.error('Error closing Redis connections:', error);
    }
  }

  getClient() {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }
    return this.redis;
  }

  getSubscriber() {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }
    return this.subscriber;
  }

  getPublisher() {
    if (!this.isConnected) {
      throw new Error('Redis not connected');
    }
    return this.publisher;
  }

  // Cache methods
  async set(key, value, ttl = 3600) {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        return await this.redis.setex(key, ttl, serializedValue);
      } else {
        return await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      logger.error('Redis SET error:', error);
      throw error;
    }
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis GET error:', error);
      throw error;
    }
  }

  async del(key) {
    try {
      return await this.redis.del(key);
    } catch (error) {
      logger.error('Redis DEL error:', error);
      throw error;
    }
  }

  async exists(key) {
    try {
      return await this.redis.exists(key);
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      throw error;
    }
  }

  async incr(key) {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      logger.error('Redis INCR error:', error);
      throw error;
    }
  }

  async expire(key, ttl) {
    try {
      return await this.redis.expire(key, ttl);
    } catch (error) {
      logger.error('Redis EXPIRE error:', error);
      throw error;
    }
  }

  // Rate limiting methods
  async checkRateLimit(key, limit, window) {
    try {
      const current = await this.redis.incr(key);
      if (current === 1) {
        await this.redis.expire(key, window);
      }
      return {
        count: current,
        remaining: Math.max(0, limit - current),
        resetTime: await this.redis.ttl(key)
      };
    } catch (error) {
      logger.error('Redis rate limit check error:', error);
      throw error;
    }
  }

  // Pub/Sub methods
  async publish(channel, message) {
    try {
      return await this.publisher.publish(channel, JSON.stringify(message));
    } catch (error) {
      logger.error('Redis PUBLISH error:', error);
      throw error;
    }
  }

  async subscribe(channel, callback) {
    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on('message', (receivedChannel, message) => {
        if (receivedChannel === channel) {
          try {
            const parsedMessage = JSON.parse(message);
            callback(parsedMessage);
          } catch (error) {
            logger.error('Error parsing Redis message:', error);
          }
        }
      });
    } catch (error) {
      logger.error('Redis SUBSCRIBE error:', error);
      throw error;
    }
  }

  // Hash methods
  async hset(key, field, value) {
    try {
      return await this.redis.hset(key, field, JSON.stringify(value));
    } catch (error) {
      logger.error('Redis HSET error:', error);
      throw error;
    }
  }

  async hget(key, field) {
    try {
      const value = await this.redis.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis HGET error:', error);
      throw error;
    }
  }

  async hgetall(key) {
    try {
      const hash = await this.redis.hgetall(key);
      const result = {};
      for (const [field, value] of Object.entries(hash)) {
        try {
          result[field] = JSON.parse(value);
        } catch {
          result[field] = value;
        }
      }
      return result;
    } catch (error) {
      logger.error('Redis HGETALL error:', error);
      throw error;
    }
  }

  // List methods
  async lpush(key, value) {
    try {
      return await this.redis.lpush(key, JSON.stringify(value));
    } catch (error) {
      logger.error('Redis LPUSH error:', error);
      throw error;
    }
  }

  async rpop(key) {
    try {
      const value = await this.redis.rpop(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis RPOP error:', error);
      throw error;
    }
  }

  async llen(key) {
    try {
      return await this.redis.llen(key);
    } catch (error) {
      logger.error('Redis LLEN error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const start = Date.now();
      await this.redis.ping();
      const latency = Date.now() - start;
      
      return {
        status: 'healthy',
        latency: `${latency}ms`,
        connected: this.isConnected,
        memory: await this.redis.memory('usage'),
        info: await this.redis.info('server')
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        connected: false
      };
    }
  }
}

const redisConfig = new RedisConfig();

module.exports = redisConfig; 