const { query, transaction, buildSelectQuery, buildInsertQuery, buildUpdateQuery, logger } = require('../config/database');

/**
 * Base Repository class providing common database operations
 * All specific repositories should extend this class
 */
class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.logger = logger;
  }

  /**
   * Find a single record by ID
   * @param {string} id - Record ID
   * @param {Array} columns - Columns to select (default: all)
   * @returns {Object|null} Record or null if not found
   */
  async findById(id, columns = ['*']) {
    try {
      const { query: sql, params } = buildSelectQuery(
        this.tableName,
        { id },
        { columns: columns.join(', ') }
      );
      
      const result = await query(sql, params);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error(`Error finding ${this.tableName} by ID`, { id, error: error.message });
      throw error;
    }
  }

  /**
   * Find multiple records by conditions
   * @param {Object} conditions - WHERE conditions
   * @param {Object} options - Query options (columns, orderBy, limit, offset)
   * @returns {Array} Array of records
   */
  async findBy(conditions = {}, options = {}) {
    try {
      const { query: sql, params } = buildSelectQuery(this.tableName, conditions, options);
      const result = await query(sql, params);
      return result.rows;
    } catch (error) {
      this.logger.error(`Error finding ${this.tableName} records`, { conditions, error: error.message });
      throw error;
    }
  }

  /**
   * Find a single record by conditions
   * @param {Object} conditions - WHERE conditions
   * @param {Array} columns - Columns to select
   * @returns {Object|null} Record or null if not found
   */
  async findOne(conditions, columns = ['*']) {
    try {
      const records = await this.findBy(conditions, { 
        columns: columns.join(', '), 
        limit: 1 
      });
      return records[0] || null;
    } catch (error) {
      this.logger.error(`Error finding one ${this.tableName} record`, { conditions, error: error.message });
      throw error;
    }
  }

  /**
   * Get all records with optional pagination
   * @param {Object} options - Query options
   * @returns {Array} Array of records
   */
  async findAll(options = {}) {
    try {
      return await this.findBy({}, options);
    } catch (error) {
      this.logger.error(`Error finding all ${this.tableName} records`, { error: error.message });
      throw error;
    }
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Object} Created record
   */
  async create(data) {
    try {
      // Add timestamps if not present
      const recordData = {
        ...data,
        created_at: data.created_at || new Date(),
        updated_at: data.updated_at || new Date()
      };

      const { query: sql, params } = buildInsertQuery(this.tableName, recordData);
      const result = await query(sql, params);
      
      this.logger.info(`Created ${this.tableName} record`, { id: result.rows[0].id });
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error creating ${this.tableName} record`, { data, error: error.message });
      throw error;
    }
  }

  /**
   * Update a record by ID
   * @param {string} id - Record ID
   * @param {Object} data - Update data
   * @returns {Object|null} Updated record or null if not found
   */
  async update(id, data) {
    try {
      // Add updated timestamp
      const updateData = {
        ...data,
        updated_at: new Date()
      };

      const { query: sql, params } = buildUpdateQuery(this.tableName, updateData, { id });
      const result = await query(sql, params);
      
      if (result.rows.length === 0) {
        this.logger.warn(`${this.tableName} record not found for update`, { id });
        return null;
      }

      this.logger.info(`Updated ${this.tableName} record`, { id });
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error updating ${this.tableName} record`, { id, data, error: error.message });
      throw error;
    }
  }

  /**
   * Update records by conditions
   * @param {Object} conditions - WHERE conditions
   * @param {Object} data - Update data
   * @returns {Array} Updated records
   */
  async updateBy(conditions, data) {
    try {
      const updateData = {
        ...data,
        updated_at: new Date()
      };

      const { query: sql, params } = buildUpdateQuery(this.tableName, updateData, conditions);
      const result = await query(sql, params);
      
      this.logger.info(`Updated ${result.rowCount} ${this.tableName} records`, { conditions });
      return result.rows;
    } catch (error) {
      this.logger.error(`Error updating ${this.tableName} records`, { conditions, data, error: error.message });
      throw error;
    }
  }

  /**
   * Delete a record by ID (hard delete)
   * @param {string} id - Record ID
   * @returns {boolean} True if deleted, false if not found
   */
  async delete(id) {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id = $1`;
      const result = await query(sql, [id]);
      
      const deleted = result.rowCount > 0;
      if (deleted) {
        this.logger.info(`Deleted ${this.tableName} record`, { id });
      } else {
        this.logger.warn(`${this.tableName} record not found for deletion`, { id });
      }
      
      return deleted;
    } catch (error) {
      this.logger.error(`Error deleting ${this.tableName} record`, { id, error: error.message });
      throw error;
    }
  }

  /**
   * Soft delete a record by ID (if table supports it)
   * @param {string} id - Record ID
   * @returns {Object|null} Updated record or null if not found
   */
  async softDelete(id) {
    try {
      const updateData = {
        is_deleted: true,
        deleted_at: new Date()
      };

      return await this.update(id, updateData);
    } catch (error) {
      this.logger.error(`Error soft deleting ${this.tableName} record`, { id, error: error.message });
      throw error;
    }
  }

  /**
   * Count records by conditions
   * @param {Object} conditions - WHERE conditions
   * @returns {number} Count of records
   */
  async count(conditions = {}) {
    try {
      let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
      const params = [];
      
      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions).map((key, index) => {
          params.push(conditions[key]);
          return `${key} = $${index + 1}`;
        }).join(' AND ');
        sql += ` WHERE ${whereClause}`;
      }

      const result = await query(sql, params);
      return parseInt(result.rows[0].count);
    } catch (error) {
      this.logger.error(`Error counting ${this.tableName} records`, { conditions, error: error.message });
      throw error;
    }
  }

  /**
   * Check if a record exists
   * @param {Object} conditions - WHERE conditions
   * @returns {boolean} True if exists, false otherwise
   */
  async exists(conditions) {
    try {
      const count = await this.count(conditions);
      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking ${this.tableName} existence`, { conditions, error: error.message });
      throw error;
    }
  }

  /**
   * Execute a custom query
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Object} Query result
   */
  async executeQuery(sql, params = []) {
    try {
      return await query(sql, params);
    } catch (error) {
      this.logger.error(`Error executing custom query on ${this.tableName}`, { 
        sql: sql.substring(0, 100) + '...', 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Execute multiple operations in a transaction
   * @param {Function} callback - Transaction callback function
   * @returns {*} Transaction result
   */
  async executeTransaction(callback) {
    try {
      return await transaction(callback);
    } catch (error) {
      this.logger.error(`Error executing transaction on ${this.tableName}`, { error: error.message });
      throw error;
    }
  }

  /**
   * Paginate records
   * @param {Object} conditions - WHERE conditions
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Records per page
   * @param {Object} options - Additional query options
   * @returns {Object} Pagination result with data and metadata
   */
  async paginate(conditions = {}, page = 1, limit = 10, options = {}) {
    try {
      const offset = (page - 1) * limit;
      const totalCount = await this.count(conditions);
      const totalPages = Math.ceil(totalCount / limit);
      
      const records = await this.findBy(conditions, {
        ...options,
        limit,
        offset
      });

      return {
        data: records,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      this.logger.error(`Error paginating ${this.tableName} records`, { 
        conditions, page, limit, error: error.message 
      });
      throw error;
    }
  }

  /**
   * Bulk insert records
   * @param {Array} records - Array of record data
   * @returns {Array} Created records
   */
  async bulkCreate(records) {
    try {
      if (!Array.isArray(records) || records.length === 0) {
        return [];
      }

      return await this.executeTransaction(async (client) => {
        const results = [];
        
        for (const record of records) {
          const recordData = {
            ...record,
            created_at: record.created_at || new Date(),
            updated_at: record.updated_at || new Date()
          };

          const { query: sql, params } = buildInsertQuery(this.tableName, recordData);
          const result = await client.query(sql, params);
          results.push(result.rows[0]);
        }

        this.logger.info(`Bulk created ${results.length} ${this.tableName} records`);
        return results;
      });
    } catch (error) {
      this.logger.error(`Error bulk creating ${this.tableName} records`, { 
        count: records.length, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Get distinct values for a column
   * @param {string} column - Column name
   * @param {Object} conditions - WHERE conditions
   * @returns {Array} Array of distinct values
   */
  async distinct(column, conditions = {}) {
    try {
      let sql = `SELECT DISTINCT ${column} FROM ${this.tableName}`;
      const params = [];
      
      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions).map((key, index) => {
          params.push(conditions[key]);
          return `${key} = $${index + 1}`;
        }).join(' AND ');
        sql += ` WHERE ${whereClause}`;
      }

      sql += ` ORDER BY ${column}`;

      const result = await query(sql, params);
      return result.rows.map(row => row[column]);
    } catch (error) {
      this.logger.error(`Error getting distinct ${column} from ${this.tableName}`, { 
        conditions, error: error.message 
      });
      throw error;
    }
  }
}

module.exports = BaseRepository; 