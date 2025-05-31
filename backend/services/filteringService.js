const db = require('../config/database');
const { logger } = require('../config/database');
const { auditLog } = require('./auditService');

class FilteringService {
  constructor() {
    this.supportedOperators = {
      // String operators
      'equals': (field, value) => `${field} = $`,
      'not_equals': (field, value) => `${field} != $`,
      'contains': (field, value) => `${field} ILIKE $`,
      'not_contains': (field, value) => `${field} NOT ILIKE $`,
      'starts_with': (field, value) => `${field} ILIKE $`,
      'ends_with': (field, value) => `${field} ILIKE $`,
      'regex': (field, value) => `${field} ~ $`,
      'is_empty': (field, value) => `(${field} IS NULL OR ${field} = '')`,
      'is_not_empty': (field, value) => `(${field} IS NOT NULL AND ${field} != '')`,
      
      // Number operators
      'greater_than': (field, value) => `${field} > $`,
      'greater_than_equal': (field, value) => `${field} >= $`,
      'less_than': (field, value) => `${field} < $`,
      'less_than_equal': (field, value) => `${field} <= $`,
      'between': (field, value) => `${field} BETWEEN $ AND $`,
      'not_between': (field, value) => `${field} NOT BETWEEN $ AND $`,
      
      // Date operators
      'date_equals': (field, value) => `DATE(${field}) = $`,
      'date_before': (field, value) => `DATE(${field}) < $`,
      'date_after': (field, value) => `DATE(${field}) > $`,
      'date_between': (field, value) => `DATE(${field}) BETWEEN $ AND $`,
      'date_in_last': (field, value) => `${field} >= NOW() - INTERVAL '$'`,
      'date_in_next': (field, value) => `${field} <= NOW() + INTERVAL '$'`,
      
      // Array operators
      'in': (field, value) => `${field} = ANY($)`,
      'not_in': (field, value) => `${field} != ALL($)`,
      'array_contains': (field, value) => `$ = ANY(${field})`,
      'array_not_contains': (field, value) => `$ != ALL(${field})`,
      'array_length': (field, value) => `array_length(${field}, 1) = $`,
      
      // Boolean operators
      'is_true': (field, value) => `${field} = true`,
      'is_false': (field, value) => `${field} = false`,
      'is_null': (field, value) => `${field} IS NULL`,
      'is_not_null': (field, value) => `${field} IS NOT NULL`
    };

    this.fieldMappings = {
      // Files table
      'file_name': 'f.file_name',
      'file_size': 'f.file_size',
      'mime_type': 'f.mime_type',
      'upload_date': 'f.upload_date',
      'processing_status': 'f.processing_status',
      'user_id': 'f.user_id',
      'file_hash': 'f.file_hash',
      
      // Users table
      'user_email': 'u.email',
      'user_first_name': 'u.first_name',
      'user_last_name': 'u.last_name',
      'user_plan': 'u.plan_type',
      'user_created': 'u.created_at',
      
      // API Usage table
      'api_endpoint': 'au.endpoint',
      'api_method': 'au.method',
      'api_status_code': 'au.status_code',
      'api_response_time': 'au.response_time',
      'api_created_at': 'au.created_at',
      
      // Webhooks table
      'webhook_name': 'w.webhook_name',
      'webhook_url': 'w.url',
      'webhook_events': 'w.events',
      'webhook_active': 'w.is_active'
    };
  }

  // Apply Filters

  async applyFilters(filterConfig, baseTable = 'files', userId = null) {
    try {
      const { conditions, logic, pagination, sorting } = filterConfig;
      
      // Validate filter configuration
      this.validateFilterConfig(filterConfig);
      
      // Build the SQL query
      const queryResult = this.buildFilterQuery(conditions, logic, baseTable, userId);
      
      // Add sorting
      if (sorting && sorting.length > 0) {
        queryResult.query += this.buildSortingClause(sorting);
      }
      
      // Add pagination
      if (pagination) {
        const { page = 1, limit = 50 } = pagination;
        const offset = (page - 1) * limit;
        queryResult.query += ` LIMIT ${limit} OFFSET ${offset}`;
      }
      
      // Execute the query
      const result = await db.query(queryResult.query, queryResult.params);
      
      // Get total count for pagination
      let totalCount = 0;
      if (pagination) {
        const countQuery = queryResult.query.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) as total FROM').replace(/ORDER BY.*$/, '').replace(/LIMIT.*$/, '');
        const countResult = await db.query(countQuery, queryResult.params);
        totalCount = parseInt(countResult.rows[0].total);
      }
      
      // Log filter usage
      await this.logFilterUsage(userId, filterConfig, result.rows.length);
      
      return {
        success: true,
        data: result.rows,
        totalCount,
        appliedFilters: conditions.length,
        executionTime: Date.now() - queryResult.startTime
      };
    } catch (error) {
      logger.error('Failed to apply filters:', error);
      throw error;
    }
  }

  buildFilterQuery(conditions, logic = 'AND', baseTable = 'files', userId = null) {
    const startTime = Date.now();
    let query = this.getBaseQuery(baseTable);
    let params = [];
    let paramIndex = 1;
    
    if (conditions && conditions.length > 0) {
      const whereClause = this.buildWhereClause(conditions, logic, params, paramIndex);
      query += ` WHERE ${whereClause.clause}`;
      params = whereClause.params;
      paramIndex = whereClause.paramIndex;
    }
    
    // Add user filter if specified
    if (userId) {
      const userClause = conditions && conditions.length > 0 ? ' AND ' : ' WHERE ';
      if (baseTable === 'files') {
        query += `${userClause}f.user_id = $${paramIndex}`;
      } else if (baseTable === 'api_usage') {
        query += `${userClause}ak.user_id = $${paramIndex}`;
      }
      params.push(userId);
    }
    
    return { query, params, startTime };
  }

  getBaseQuery(baseTable) {
    switch (baseTable) {
      case 'files':
        return `
          SELECT f.*, u.email as user_email, u.first_name, u.last_name
          FROM files f
          LEFT JOIN users u ON f.user_id = u.id
        `;
      case 'api_usage':
        return `
          SELECT au.*, ak.key_name, u.email as user_email
          FROM api_usage au
          LEFT JOIN api_keys ak ON au.api_key_id = ak.id
          LEFT JOIN users u ON ak.user_id = u.id
        `;
      case 'webhooks':
        return `
          SELECT w.*, u.email as user_email
          FROM webhooks w
          LEFT JOIN users u ON w.user_id = u.id
        `;
      case 'users':
        return `
          SELECT u.*, s.plan_type, s.status as subscription_status
          FROM users u
          LEFT JOIN subscriptions s ON u.id = s.user_id
        `;
      default:
        throw new Error(`Unsupported base table: ${baseTable}`);
    }
  }

  buildWhereClause(conditions, logic, params, paramIndex) {
    if (!conditions || conditions.length === 0) {
      return { clause: '1=1', params, paramIndex };
    }

    const clauses = [];
    
    for (const condition of conditions) {
      if (condition.type === 'group') {
        // Handle nested groups
        const groupResult = this.buildWhereClause(condition.conditions, condition.logic, params, paramIndex);
        clauses.push(`(${groupResult.clause})`);
        params = groupResult.params;
        paramIndex = groupResult.paramIndex;
      } else {
        // Handle individual conditions
        const conditionResult = this.buildConditionClause(condition, params, paramIndex);
        clauses.push(conditionResult.clause);
        params = conditionResult.params;
        paramIndex = conditionResult.paramIndex;
      }
    }
    
    const operator = logic === 'OR' ? ' OR ' : ' AND ';
    const clause = clauses.join(operator);
    
    return { clause, params, paramIndex };
  }

  buildConditionClause(condition, params, paramIndex) {
    const { field, operator, value, dataType } = condition;
    
    // Validate field
    const mappedField = this.fieldMappings[field] || field;
    if (!mappedField) {
      throw new Error(`Invalid field: ${field}`);
    }
    
    // Validate operator
    if (!this.supportedOperators[operator]) {
      throw new Error(`Unsupported operator: ${operator}`);
    }
    
    // Get the operator function
    const operatorFunc = this.supportedOperators[operator];
    let clause = operatorFunc(mappedField, value);
    
    // Handle parameter substitution based on operator
    const processedValue = this.processValue(value, dataType, operator);
    
    if (operator === 'is_empty' || operator === 'is_not_empty' || 
        operator === 'is_true' || operator === 'is_false' || 
        operator === 'is_null' || operator === 'is_not_null') {
      // No parameters needed for these operators
      return { clause, params, paramIndex };
    }
    
    if (operator === 'between' || operator === 'not_between' || operator === 'date_between') {
      // Handle range operators
      if (!Array.isArray(processedValue) || processedValue.length !== 2) {
        throw new Error(`Between operator requires array of 2 values`);
      }
      clause = clause.replace('$', `$${paramIndex}`).replace('$', `$${paramIndex + 1}`);
      params.push(processedValue[0], processedValue[1]);
      paramIndex += 2;
    } else if (operator === 'contains' || operator === 'not_contains') {
      // Handle LIKE operators
      clause = clause.replace('$', `$${paramIndex}`);
      params.push(`%${processedValue}%`);
      paramIndex++;
    } else if (operator === 'starts_with') {
      clause = clause.replace('$', `$${paramIndex}`);
      params.push(`${processedValue}%`);
      paramIndex++;
    } else if (operator === 'ends_with') {
      clause = clause.replace('$', `$${paramIndex}`);
      params.push(`%${processedValue}`);
      paramIndex++;
    } else if (operator === 'date_in_last' || operator === 'date_in_next') {
      // Handle relative date operators
      clause = clause.replace('$', processedValue); // Direct substitution for intervals
    } else {
      // Handle single value operators
      clause = clause.replace('$', `$${paramIndex}`);
      params.push(processedValue);
      paramIndex++;
    }
    
    return { clause, params, paramIndex };
  }

  processValue(value, dataType, operator) {
    switch (dataType) {
      case 'string':
        return String(value);
      case 'number':
        if (Array.isArray(value)) {
          return value.map(v => parseFloat(v));
        }
        return parseFloat(value);
      case 'integer':
        if (Array.isArray(value)) {
          return value.map(v => parseInt(v));
        }
        return parseInt(value);
      case 'boolean':
        return Boolean(value);
      case 'date':
        if (Array.isArray(value)) {
          return value.map(v => new Date(v));
        }
        if (operator === 'date_in_last' || operator === 'date_in_next') {
          return `${value} days`; // For interval operations
        }
        return new Date(value);
      case 'array':
        return Array.isArray(value) ? value : [value];
      default:
        return value;
    }
  }

  buildSortingClause(sorting) {
    const sortClauses = sorting.map(sort => {
      const { field, direction = 'ASC' } = sort;
      const mappedField = this.fieldMappings[field] || field;
      const dir = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      return `${mappedField} ${dir}`;
    });
    
    return ` ORDER BY ${sortClauses.join(', ')}`;
  }

  validateFilterConfig(filterConfig) {
    const { conditions, logic, pagination, sorting } = filterConfig;
    
    // Validate logic
    if (logic && !['AND', 'OR'].includes(logic.toUpperCase())) {
      throw new Error('Logic must be AND or OR');
    }
    
    // Validate conditions
    if (conditions && Array.isArray(conditions)) {
      for (const condition of conditions) {
        this.validateCondition(condition);
      }
    }
    
    // Validate pagination
    if (pagination) {
      const { page, limit } = pagination;
      if (page && (!Number.isInteger(page) || page < 1)) {
        throw new Error('Page must be a positive integer');
      }
      if (limit && (!Number.isInteger(limit) || limit < 1 || limit > 1000)) {
        throw new Error('Limit must be between 1 and 1000');
      }
    }
    
    // Validate sorting
    if (sorting && Array.isArray(sorting)) {
      for (const sort of sorting) {
        if (!sort.field) {
          throw new Error('Sort field is required');
        }
        if (sort.direction && !['ASC', 'DESC'].includes(sort.direction.toUpperCase())) {
          throw new Error('Sort direction must be ASC or DESC');
        }
      }
    }
  }

  validateCondition(condition) {
    if (condition.type === 'group') {
      // Validate group conditions
      if (!condition.conditions || !Array.isArray(condition.conditions)) {
        throw new Error('Group conditions must be an array');
      }
      for (const subCondition of condition.conditions) {
        this.validateCondition(subCondition);
      }
    } else {
      // Validate individual condition
      if (!condition.field) {
        throw new Error('Condition field is required');
      }
      if (!condition.operator) {
        throw new Error('Condition operator is required');
      }
      if (!this.supportedOperators[condition.operator]) {
        throw new Error(`Unsupported operator: ${condition.operator}`);
      }
    }
  }

  // Saved Filters

  async saveFilter(userId, filterData) {
    try {
      const { name, description, filterConfig, isPublic = false, tags = [] } = filterData;
      
      // Validate filter configuration
      this.validateFilterConfig(filterConfig);
      
      const result = await db.query(`
        INSERT INTO saved_filters (
          user_id, filter_name, description, filter_config, 
          is_public, tags, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, filter_name, description, is_public, tags, created_at
      `, [
        userId, name, description, JSON.stringify(filterConfig), 
        isPublic, JSON.stringify(tags)
      ]);
      
      const savedFilter = result.rows[0];
      
      // Audit log
      await auditLog(userId, 'filter_saved', {
        filterId: savedFilter.id,
        filterName: name,
        isPublic
      });
      
      logger.info(`Filter saved: ${name} by user ${userId}`);
      
      return {
        success: true,
        filter: {
          ...savedFilter,
          tags: JSON.parse(savedFilter.tags)
        }
      };
    } catch (error) {
      logger.error('Failed to save filter:', error);
      throw error;
    }
  }

  async getSavedFilters(userId, isPublic = null) {
    try {
      let whereClause = 'WHERE (user_id = $1';
      const params = [userId];
      
      if (isPublic !== null) {
        if (isPublic) {
          whereClause += ' OR is_public = true)';
        } else {
          whereClause += ') AND is_public = false';
        }
      } else {
        whereClause += ' OR is_public = true)';
      }
      
      const result = await db.query(`
        SELECT 
          sf.*,
          u.email as creator_email,
          u.first_name as creator_first_name,
          u.last_name as creator_last_name
        FROM saved_filters sf
        LEFT JOIN users u ON sf.user_id = u.id
        ${whereClause}
        ORDER BY sf.created_at DESC
      `, params);
      
      return result.rows.map(filter => ({
        ...filter,
        filter_config: JSON.parse(filter.filter_config),
        tags: JSON.parse(filter.tags || '[]'),
        isOwner: filter.user_id === userId
      }));
    } catch (error) {
      logger.error('Failed to get saved filters:', error);
      throw error;
    }
  }

  async updateSavedFilter(filterId, userId, updates) {
    try {
      const allowedUpdates = ['filter_name', 'description', 'filter_config', 'is_public', 'tags'];
      const updateFields = [];
      const updateValues = [];
      let paramCount = 0;
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key)) {
          updateFields.push(`${key} = $${++paramCount}`);
          
          if (key === 'filter_config') {
            this.validateFilterConfig(value);
            updateValues.push(JSON.stringify(value));
          } else if (key === 'tags') {
            updateValues.push(JSON.stringify(value));
          } else {
            updateValues.push(value);
          }
        }
      }
      
      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }
      
      updateFields.push(`updated_at = $${++paramCount}`);
      updateValues.push(new Date());
      
      updateValues.push(filterId, userId);
      
      const result = await db.query(`
        UPDATE saved_filters 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
        RETURNING *
      `, updateValues);
      
      if (result.rows.length === 0) {
        throw new Error('Filter not found or access denied');
      }
      
      const updatedFilter = result.rows[0];
      
      // Audit log
      await auditLog(userId, 'filter_updated', {
        filterId,
        updates: Object.keys(updates)
      });
      
      return {
        ...updatedFilter,
        filter_config: JSON.parse(updatedFilter.filter_config),
        tags: JSON.parse(updatedFilter.tags || '[]')
      };
    } catch (error) {
      logger.error('Failed to update saved filter:', error);
      throw error;
    }
  }

  async deleteSavedFilter(filterId, userId) {
    try {
      const result = await db.query(`
        DELETE FROM saved_filters
        WHERE id = $1 AND user_id = $2
        RETURNING filter_name
      `, [filterId, userId]);
      
      if (result.rows.length === 0) {
        throw new Error('Filter not found or access denied');
      }
      
      const deletedFilter = result.rows[0];
      
      // Audit log
      await auditLog(userId, 'filter_deleted', {
        filterId,
        filterName: deletedFilter.filter_name
      });
      
      logger.info(`Filter deleted: ${deletedFilter.filter_name} by user ${userId}`);
      
      return {
        success: true,
        message: 'Filter deleted successfully'
      };
    } catch (error) {
      logger.error('Failed to delete saved filter:', error);
      throw error;
    }
  }

  // Field Information

  async getFilterFields(dataType = null) {
    try {
      const fields = {
        files: [
          { name: 'file_name', type: 'string', label: 'File Name' },
          { name: 'file_size', type: 'number', label: 'File Size (bytes)' },
          { name: 'mime_type', type: 'string', label: 'MIME Type' },
          { name: 'upload_date', type: 'date', label: 'Upload Date' },
          { name: 'processing_status', type: 'string', label: 'Processing Status' },
          { name: 'user_id', type: 'integer', label: 'User ID' },
          { name: 'file_hash', type: 'string', label: 'File Hash' }
        ],
        users: [
          { name: 'user_email', type: 'string', label: 'Email' },
          { name: 'user_first_name', type: 'string', label: 'First Name' },
          { name: 'user_last_name', type: 'string', label: 'Last Name' },
          { name: 'user_plan', type: 'string', label: 'Plan Type' },
          { name: 'user_created', type: 'date', label: 'Created Date' }
        ],
        api_usage: [
          { name: 'api_endpoint', type: 'string', label: 'API Endpoint' },
          { name: 'api_method', type: 'string', label: 'HTTP Method' },
          { name: 'api_status_code', type: 'integer', label: 'Status Code' },
          { name: 'api_response_time', type: 'number', label: 'Response Time (ms)' },
          { name: 'api_created_at', type: 'date', label: 'Request Time' }
        ],
        webhooks: [
          { name: 'webhook_name', type: 'string', label: 'Webhook Name' },
          { name: 'webhook_url', type: 'string', label: 'Webhook URL' },
          { name: 'webhook_events', type: 'array', label: 'Events' },
          { name: 'webhook_active', type: 'boolean', label: 'Is Active' }
        ]
      };
      
      if (dataType) {
        return fields[dataType] || [];
      }
      
      return fields;
    } catch (error) {
      logger.error('Failed to get filter fields:', error);
      throw error;
    }
  }

  getSupportedOperators() {
    return {
      string: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'regex', 'is_empty', 'is_not_empty', 'in', 'not_in'],
      number: ['equals', 'not_equals', 'greater_than', 'greater_than_equal', 'less_than', 'less_than_equal', 'between', 'not_between', 'is_null', 'is_not_null'],
      integer: ['equals', 'not_equals', 'greater_than', 'greater_than_equal', 'less_than', 'less_than_equal', 'between', 'not_between', 'is_null', 'is_not_null'],
      date: ['date_equals', 'date_before', 'date_after', 'date_between', 'date_in_last', 'date_in_next', 'is_null', 'is_not_null'],
      boolean: ['is_true', 'is_false', 'is_null', 'is_not_null'],
      array: ['array_contains', 'array_not_contains', 'array_length', 'is_null', 'is_not_null']
    };
  }

  // Filter Usage Analytics

  async logFilterUsage(userId, filterConfig, resultCount) {
    try {
      if (userId) {
        await db.query(`
          INSERT INTO filter_usage_logs (
            user_id, filter_config, result_count, created_at
          ) VALUES ($1, $2, $3, NOW())
        `, [userId, JSON.stringify(filterConfig), resultCount]);
      }
    } catch (error) {
      logger.error('Failed to log filter usage:', error);
    }
  }

  async getFilterAnalytics(userId, startDate, endDate) {
    try {
      const userFilter = userId ? 'AND user_id = $3' : '';
      const params = [startDate, endDate];
      if (userId) params.push(userId);
      
      // Most used filters
      const mostUsedFilters = await db.query(`
        SELECT 
          filter_config,
          COUNT(*) as usage_count,
          AVG(result_count) as avg_results
        FROM filter_usage_logs
        WHERE created_at >= $1 AND created_at <= $2 ${userFilter}
        GROUP BY filter_config
        ORDER BY usage_count DESC
        LIMIT 10
      `, params);
      
      // Filter usage over time
      const usageOverTime = await db.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as filter_count,
          COUNT(DISTINCT user_id) as unique_users
        FROM filter_usage_logs
        WHERE created_at >= $1 AND created_at <= $2 ${userFilter}
        GROUP BY DATE(created_at)
        ORDER BY date
      `, params);
      
      return {
        mostUsedFilters: mostUsedFilters.rows,
        usageOverTime: usageOverTime.rows
      };
    } catch (error) {
      logger.error('Failed to get filter analytics:', error);
      throw error;
    }
  }
}

const filteringService = new FilteringService();

module.exports = filteringService; 