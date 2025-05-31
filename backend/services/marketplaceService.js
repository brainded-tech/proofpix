/**
 * Marketplace Service - Plugin Marketplace & Developer Portal
 * Handles plugin marketplace operations, developer management, and distribution
 */

const axios = require('axios');
const crypto = require('crypto');
const { logger } = require('../config/database');
const { validatePluginManifest } = require('../utils/pluginValidation');

class MarketplaceService {
  constructor() {
    this.marketplaceUrl = process.env.MARKETPLACE_URL || 'https://marketplace.proofpix.com/api';
    this.apiKey = process.env.MARKETPLACE_API_KEY;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Developer portal configuration
    this.developerPortal = {
      enabled: process.env.DEVELOPER_PORTAL_ENABLED === 'true',
      registrationOpen: process.env.DEVELOPER_REGISTRATION_OPEN === 'true',
      approvalRequired: process.env.DEVELOPER_APPROVAL_REQUIRED === 'true'
    };
  }

  /**
   * Search marketplace plugins
   */
  async searchPlugins(query = {}) {
    try {
      const cacheKey = `search:${JSON.stringify(query)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await this.makeMarketplaceRequest('GET', '/plugins/search', {
        params: query
      });

      const result = {
        plugins: response.data.plugins || [],
        pagination: response.data.pagination || {},
        filters: response.data.filters || {}
      };

      this.setCache(cacheKey, result);
      return result;

    } catch (error) {
      logger.error('Marketplace search failed:', error);
      
      // Return fallback data if marketplace is unavailable
      return this.getFallbackPlugins(query);
    }
  }

  /**
   * Get featured plugins
   */
  async getFeaturedPlugins() {
    try {
      const cacheKey = 'featured:plugins';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await this.makeMarketplaceRequest('GET', '/plugins/featured');
      const plugins = response.data.plugins || [];

      this.setCache(cacheKey, plugins);
      return plugins;

    } catch (error) {
      logger.error('Failed to get featured plugins:', error);
      return this.getFallbackFeaturedPlugins();
    }
  }

  /**
   * Get plugin details from marketplace
   */
  async getPluginDetails(pluginId) {
    try {
      const cacheKey = `plugin:${pluginId}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await this.makeMarketplaceRequest('GET', `/plugins/${pluginId}`);
      const plugin = response.data;

      this.setCache(cacheKey, plugin);
      return plugin;

    } catch (error) {
      logger.error(`Failed to get plugin details for ${pluginId}:`, error);
      throw new Error('Plugin not found in marketplace');
    }
  }

  /**
   * Download plugin from marketplace
   */
  async downloadPlugin(pluginId, version = 'latest') {
    try {
      const response = await this.makeMarketplaceRequest('GET', `/plugins/${pluginId}/download`, {
        params: { version },
        responseType: 'stream'
      });

      return {
        stream: response.data,
        filename: response.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] || `${pluginId}.zip`,
        size: parseInt(response.headers['content-length']) || 0
      };

    } catch (error) {
      logger.error(`Failed to download plugin ${pluginId}:`, error);
      throw new Error('Plugin download failed');
    }
  }

  /**
   * Register as a developer
   */
  async registerDeveloper(developerData) {
    try {
      if (!this.developerPortal.enabled) {
        throw new Error('Developer portal is not enabled');
      }

      if (!this.developerPortal.registrationOpen) {
        throw new Error('Developer registration is currently closed');
      }

      // Validate developer data
      const validatedData = this.validateDeveloperData(developerData);

      const response = await this.makeMarketplaceRequest('POST', '/developers/register', {
        data: validatedData
      });

      return {
        success: true,
        developerId: response.data.developerId,
        apiKey: response.data.apiKey,
        status: response.data.status,
        message: this.developerPortal.approvalRequired 
          ? 'Registration submitted for approval' 
          : 'Developer account created successfully'
      };

    } catch (error) {
      logger.error('Developer registration failed:', error);
      throw error;
    }
  }

  /**
   * Submit plugin to marketplace
   */
  async submitPlugin(pluginData, developerApiKey) {
    try {
      // Validate plugin submission
      const validation = await this.validatePluginSubmission(pluginData);
      if (!validation.valid) {
        throw new Error(`Plugin validation failed: ${validation.errors.join(', ')}`);
      }

      const response = await this.makeMarketplaceRequest('POST', '/plugins/submit', {
        data: pluginData,
        headers: {
          'X-Developer-API-Key': developerApiKey
        }
      });

      return {
        success: true,
        submissionId: response.data.submissionId,
        status: response.data.status,
        reviewUrl: response.data.reviewUrl
      };

    } catch (error) {
      logger.error('Plugin submission failed:', error);
      throw error;
    }
  }

  /**
   * Get developer dashboard data
   */
  async getDeveloperDashboard(developerApiKey) {
    try {
      const response = await this.makeMarketplaceRequest('GET', '/developers/dashboard', {
        headers: {
          'X-Developer-API-Key': developerApiKey
        }
      });

      return response.data;

    } catch (error) {
      logger.error('Failed to get developer dashboard:', error);
      throw error;
    }
  }

  /**
   * Get plugin analytics for developer
   */
  async getPluginAnalytics(pluginId, developerApiKey, timeRange = '30d') {
    try {
      const response = await this.makeMarketplaceRequest('GET', `/plugins/${pluginId}/analytics`, {
        params: { timeRange },
        headers: {
          'X-Developer-API-Key': developerApiKey
        }
      });

      return response.data;

    } catch (error) {
      logger.error(`Failed to get analytics for plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Update plugin in marketplace
   */
  async updatePlugin(pluginId, updateData, developerApiKey) {
    try {
      const response = await this.makeMarketplaceRequest('PUT', `/plugins/${pluginId}`, {
        data: updateData,
        headers: {
          'X-Developer-API-Key': developerApiKey
        }
      });

      // Clear cache for this plugin
      this.clearCache(`plugin:${pluginId}`);

      return response.data;

    } catch (error) {
      logger.error(`Failed to update plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Generate SDK for plugin development
   */
  async generateSDK(language = 'javascript', version = 'latest') {
    try {
      const response = await this.makeMarketplaceRequest('GET', '/sdk/generate', {
        params: { language, version },
        responseType: 'stream'
      });

      return {
        stream: response.data,
        filename: `proofpix-plugin-sdk-${language}-${version}.zip`,
        size: parseInt(response.headers['content-length']) || 0
      };

    } catch (error) {
      logger.error(`Failed to generate SDK for ${language}:`, error);
      throw error;
    }
  }

  /**
   * Get marketplace statistics
   */
  async getMarketplaceStats() {
    try {
      const cacheKey = 'marketplace:stats';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await this.makeMarketplaceRequest('GET', '/stats');
      const stats = response.data;

      this.setCache(cacheKey, stats, 10 * 60 * 1000); // Cache for 10 minutes
      return stats;

    } catch (error) {
      logger.error('Failed to get marketplace stats:', error);
      return {
        totalPlugins: 0,
        totalDevelopers: 0,
        totalDownloads: 0,
        categories: []
      };
    }
  }

  /**
   * Validate plugin submission
   */
  async validatePluginSubmission(pluginData) {
    const errors = [];

    // Required fields
    const requiredFields = ['name', 'version', 'description', 'author', 'type', 'category'];
    for (const field of requiredFields) {
      if (!pluginData[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate manifest if provided
    if (pluginData.manifest) {
      try {
        const manifestValidation = await validatePluginManifest(pluginData.manifest);
        if (!manifestValidation.valid) {
          errors.push(...manifestValidation.errors);
        }
      } catch (error) {
        errors.push('Invalid plugin manifest');
      }
    }

    // Validate plugin file if provided
    if (pluginData.file) {
      if (pluginData.file.size > 50 * 1024 * 1024) { // 50MB limit
        errors.push('Plugin file size exceeds 50MB limit');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate developer registration data
   */
  validateDeveloperData(data) {
    const required = ['name', 'email', 'company'];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    return {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      company: data.company.trim(),
      website: data.website?.trim(),
      description: data.description?.trim(),
      github: data.github?.trim(),
      linkedin: data.linkedin?.trim()
    };
  }

  /**
   * Make authenticated request to marketplace API
   */
  async makeMarketplaceRequest(method, endpoint, options = {}) {
    const config = {
      method,
      url: `${this.marketplaceUrl}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'User-Agent': 'ProofPix-Enterprise/1.0.0',
        ...options.headers
      },
      timeout: 30000,
      ...options
    };

    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      if (error.response) {
        throw new Error(`Marketplace API error: ${error.response.status} - ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        throw new Error('Marketplace API unavailable');
      } else {
        throw error;
      }
    }
  }

  /**
   * Cache management
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data, timeout = this.cacheTimeout) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      timeout
    });
  }

  clearCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Fallback data when marketplace is unavailable
   */
  getFallbackPlugins(query) {
    const fallbackPlugins = [
      {
        id: 'salesforce-connector',
        name: 'Salesforce Connector',
        description: 'Connect ProofPix with Salesforce CRM for seamless data integration',
        version: '1.0.0',
        author: { name: 'ProofPix Team', email: 'plugins@proofpix.com' },
        category: 'integration',
        type: 'connector',
        downloads: 1250,
        rating: 4.8,
        price: 'free',
        verified: true,
        featured: true
      },
      {
        id: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'Enhanced analytics and reporting capabilities with custom dashboards',
        version: '2.1.0',
        author: { name: 'Analytics Pro', email: 'support@analyticspro.com' },
        category: 'data-analysis',
        type: 'analyzer',
        downloads: 890,
        rating: 4.6,
        price: '$29/month',
        verified: true,
        featured: true
      },
      {
        id: 'security-scanner',
        name: 'Security Scanner',
        description: 'Advanced security scanning and threat detection for uploaded files',
        version: '1.5.2',
        author: { name: 'SecureFiles Inc', email: 'info@securefiles.com' },
        category: 'security',
        type: 'analyzer',
        downloads: 567,
        rating: 4.9,
        price: '$49/month',
        verified: true,
        featured: false
      }
    ];

    // Apply basic filtering
    let filtered = fallbackPlugins;
    
    if (query.category) {
      filtered = filtered.filter(p => p.category === query.category);
    }
    
    if (query.type) {
      filtered = filtered.filter(p => p.type === query.type);
    }
    
    if (query.q) {
      const searchTerm = query.q.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    return {
      plugins: filtered,
      pagination: {
        page: 1,
        limit: 20,
        total: filtered.length,
        pages: 1
      },
      filters: {
        categories: ['integration', 'data-analysis', 'security'],
        types: ['connector', 'analyzer']
      }
    };
  }

  getFallbackFeaturedPlugins() {
    return this.getFallbackPlugins({ featured: true }).plugins.filter(p => p.featured);
  }
}

module.exports = new MarketplaceService(); 