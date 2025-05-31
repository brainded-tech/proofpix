const { Pool } = require('pg');
const winston = require('winston');

// Configure database logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/database.log',
      format: winston.format.json()
    })
  ]
});

// Enhanced connection pool configuration
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'proofpix',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  
  // Advanced pool settings for production
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  max: parseInt(process.env.DB_POOL_MAX) || 20,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000,
  
  // Query timeout
  query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 30000,
  
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  
  // Application name for monitoring
  application_name: 'proofpix-backend'
};

// Create connection pool
const pool = new Pool(poolConfig);

// Pool event handlers for monitoring
pool.on('connect', (client) => {
  logger.debug('New database client connected', {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  });
});

pool.on('acquire', (client) => {
  logger.debug('Client acquired from pool', {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  });
});

pool.on('remove', (client) => {
  logger.debug('Client removed from pool', {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  });
});

pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', err);
});

// Enhanced query function with performance monitoring
const query = async (text, params = []) => {
  const start = Date.now();
  const client = await pool.connect();
  
  try {
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 1 second)
    if (duration > 1000) {
      logger.warn('Slow query detected', {
        query: text.substring(0, 100) + '...',
        duration,
        rowCount: result.rowCount
      });
    }
    
    // Log query performance in debug mode
    logger.debug('Query executed', {
      duration,
      rowCount: result.rowCount,
      command: result.command
    });
    
    return result;
  } catch (error) {
    logger.error('Query execution failed', {
      error: error.message,
      query: text.substring(0, 100) + '...',
      params: params.length > 0 ? '[REDACTED]' : []
    });
    throw error;
  } finally {
    client.release();
  }
};

// Transaction helper with automatic rollback
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    
    logger.debug('Transaction completed successfully');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction rolled back', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
};

// Batch query execution for better performance
const batchQuery = async (queries) => {
  const client = await pool.connect();
  const results = [];
  
  try {
    await client.query('BEGIN');
    
    for (const { text, params } of queries) {
      const result = await client.query(text, params);
      results.push(result);
    }
    
    await client.query('COMMIT');
    logger.debug(`Batch query completed: ${queries.length} queries`);
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Batch query failed', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
};

// Connection health check
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    logger.info('Database connection test successful', {
      currentTime: result.rows[0].current_time,
      version: result.rows[0].pg_version.split(' ')[0]
    });
    return true;
  } catch (error) {
    logger.error('Database connection test failed', error);
    return false;
  }
};

// Get pool statistics for monitoring
const getPoolStats = () => {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
    config: {
      min: poolConfig.min,
      max: poolConfig.max,
      idleTimeoutMillis: poolConfig.idleTimeoutMillis
    }
  };
};

// Database health metrics
const getHealthMetrics = async () => {
  try {
    const connectionResult = await query(`
      SELECT 
        count(*) as total_connections,
        count(*) FILTER (WHERE state = 'active') as active_connections,
        count(*) FILTER (WHERE state = 'idle') as idle_connections
      FROM pg_stat_activity 
      WHERE datname = $1
    `, [poolConfig.database]);

    const sizeResult = await query(`
      SELECT pg_size_pretty(pg_database_size($1)) as database_size
    `, [poolConfig.database]);

    const statsResult = await query(`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples
      FROM pg_stat_user_tables
      ORDER BY n_live_tup DESC
      LIMIT 10
    `);

    return {
      connections: connectionResult.rows[0],
      databaseSize: sizeResult.rows[0].database_size,
      tableStats: statsResult.rows,
      poolStats: getPoolStats()
    };
  } catch (error) {
    logger.error('Failed to get health metrics', error);
    throw error;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database pool closed gracefully');
  } catch (error) {
    logger.error('Error closing database pool', error);
  }
};

// Query builder helpers
const buildSelectQuery = (table, conditions = {}, options = {}) => {
  const { columns = '*', orderBy, limit, offset } = options;
  
  let query = `SELECT ${columns} FROM ${table}`;
  const params = [];
  let paramIndex = 1;
  
  // WHERE conditions
  if (Object.keys(conditions).length > 0) {
    const whereClause = Object.keys(conditions).map(key => {
      params.push(conditions[key]);
      return `${key} = $${paramIndex++}`;
    }).join(' AND ');
    query += ` WHERE ${whereClause}`;
  }
  
  // ORDER BY
  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }
  
  // LIMIT
  if (limit) {
    query += ` LIMIT $${paramIndex++}`;
    params.push(limit);
  }
  
  // OFFSET
  if (offset) {
    query += ` OFFSET $${paramIndex++}`;
    params.push(offset);
  }
  
  return { query, params };
};

const buildInsertQuery = (table, data) => {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
  
  const query = `
    INSERT INTO ${table} (${columns.join(', ')}) 
    VALUES (${placeholders}) 
    RETURNING *
  `;
  
  return { query, params: values };
};

const buildUpdateQuery = (table, data, conditions) => {
  const dataKeys = Object.keys(data);
  const conditionKeys = Object.keys(conditions);
  
  let paramIndex = 1;
  const setClause = dataKeys.map(key => `${key} = $${paramIndex++}`).join(', ');
  const whereClause = conditionKeys.map(key => `${key} = $${paramIndex++}`).join(' AND ');
  
  const query = `
    UPDATE ${table} 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
    WHERE ${whereClause} 
    RETURNING *
  `;
  
  const params = [...Object.values(data), ...Object.values(conditions)];
  return { query, params };
};

// Export enhanced database interface
module.exports = {
  pool,
  query,
  transaction,
  batchQuery,
  testConnection,
  getPoolStats,
  getHealthMetrics,
  closePool,
  buildSelectQuery,
  buildInsertQuery,
  buildUpdateQuery,
  logger
}; 