/**
 * Plugin Service - Core Plugin Architecture System
 * Handles plugin loading, management, security sandbox, and lifecycle
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const vm = require('vm');
const { logger } = require('../config/database');
const { validatePluginManifest, validatePluginCode } = require('../utils/pluginValidation');
const { createSecuritySandbox } = require('../utils/pluginSandbox');

class PluginService {
  constructor() {
    this.loadedPlugins = new Map();
    this.pluginHooks = new Map();
    this.pluginConfigs = new Map();
    this.pluginMetrics = new Map();
    this.securityPolicies = new Map();
    this.pluginDirectory = path.join(__dirname, '../plugins');
    this.tempDirectory = path.join(__dirname, '../temp/plugins');
    
    // Initialize plugin directories
    this.initializeDirectories();
    
    // Plugin lifecycle events
    this.events = {
      PLUGIN_LOADED: 'plugin:loaded',
      PLUGIN_UNLOADED: 'plugin:unloaded',
      PLUGIN_ERROR: 'plugin:error',
      PLUGIN_SECURITY_VIOLATION: 'plugin:security_violation'
    };
  }

  /**
   * Initialize plugin directories
   */
  async initializeDirectories() {
    try {
      await fs.mkdir(this.pluginDirectory, { recursive: true });
      await fs.mkdir(this.tempDirectory, { recursive: true });
      logger.info('Plugin directories initialized');
    } catch (error) {
      logger.error('Failed to initialize plugin directories:', error);
    }
  }

  /**
   * Install a new plugin from uploaded file
   */
  async installPlugin(pluginFile, metadata = {}) {
    const installId = uuidv4();
    
    try {
      logger.info(`Starting plugin installation: ${installId}`);
      
      // 1. Security scan
      const securityScan = await this.performSecurityScan(pluginFile);
      if (!securityScan.passed) {
        throw new Error(`Security scan failed: ${securityScan.issues.join(', ')}`);
      }
      
      // 2. Extract and validate plugin
      const extractedPath = await this.extractPlugin(pluginFile, installId);
      const manifest = await this.validatePluginStructure(extractedPath);
      
      // 3. Code validation
      const codeValidation = await this.validatePluginCode(extractedPath);
      if (!codeValidation.valid) {
        throw new Error(`Code validation failed: ${codeValidation.errors.join(', ')}`);
      }
      
      // 4. Install plugin
      const pluginId = manifest.id || uuidv4();
      const finalPath = path.join(this.pluginDirectory, pluginId);
      
      await fs.rename(extractedPath, finalPath);
      
      // 5. Register plugin
      const plugin = {
        id: pluginId,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        author: manifest.author,
        permissions: manifest.permissions || [],
        hooks: manifest.hooks || [],
        path: finalPath,
        manifest,
        metadata,
        installDate: new Date(),
        status: 'installed',
        securityHash: securityScan.hash
      };
      
      await this.registerPlugin(plugin);
      
      logger.info(`Plugin installed successfully: ${pluginId}`);
      return { success: true, pluginId, plugin };
      
    } catch (error) {
      logger.error(`Plugin installation failed: ${installId}`, error);
      
      // Cleanup on failure
      try {
        const extractedPath = path.join(this.tempDirectory, installId);
        await fs.rmdir(extractedPath, { recursive: true });
      } catch (cleanupError) {
        logger.error('Cleanup failed:', cleanupError);
      }
      
      throw error;
    }
  }

  /**
   * Load and activate a plugin
   */
  async loadPlugin(pluginId) {
    try {
      const pluginData = await this.getPluginData(pluginId);
      if (!pluginData) {
        throw new Error(`Plugin not found: ${pluginId}`);
      }
      
      if (this.loadedPlugins.has(pluginId)) {
        logger.warn(`Plugin already loaded: ${pluginId}`);
        return this.loadedPlugins.get(pluginId);
      }
      
      // Create security sandbox
      const sandbox = await createSecuritySandbox(pluginData);
      
      // Load plugin code
      const mainFile = path.join(pluginData.path, pluginData.manifest.main || 'index.js');
      const pluginCode = await fs.readFile(mainFile, 'utf8');
      
      // Execute plugin in sandbox
      const context = vm.createContext(sandbox);
      const script = new vm.Script(pluginCode, {
        filename: mainFile,
        timeout: 5000 // 5 second timeout
      });
      
      const pluginExports = script.runInContext(context);
      
      // Initialize plugin
      const pluginInstance = {
        id: pluginId,
        exports: pluginExports,
        context: context,
        sandbox: sandbox,
        data: pluginData,
        loadTime: new Date(),
        metrics: {
          calls: 0,
          errors: 0,
          lastCall: null,
          avgResponseTime: 0
        }
      };
      
      // Register plugin hooks
      await this.registerPluginHooks(pluginInstance);
      
      // Call plugin initialization
      if (pluginExports.initialize && typeof pluginExports.initialize === 'function') {
        await pluginExports.initialize(this.createPluginAPI(pluginId));
      }
      
      this.loadedPlugins.set(pluginId, pluginInstance);
      
      logger.info(`Plugin loaded successfully: ${pluginId}`);
      this.emitEvent(this.events.PLUGIN_LOADED, { pluginId, plugin: pluginInstance });
      
      return pluginInstance;
      
    } catch (error) {
      logger.error(`Failed to load plugin: ${pluginId}`, error);
      this.emitEvent(this.events.PLUGIN_ERROR, { pluginId, error: error.message });
      throw error;
    }
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(pluginId) {
    try {
      const plugin = this.loadedPlugins.get(pluginId);
      if (!plugin) {
        logger.warn(`Plugin not loaded: ${pluginId}`);
        return;
      }
      
      // Call plugin cleanup
      if (plugin.exports.cleanup && typeof plugin.exports.cleanup === 'function') {
        await plugin.exports.cleanup();
      }
      
      // Unregister hooks
      await this.unregisterPluginHooks(pluginId);
      
      // Remove from loaded plugins
      this.loadedPlugins.delete(pluginId);
      this.pluginHooks.delete(pluginId);
      
      logger.info(`Plugin unloaded: ${pluginId}`);
      this.emitEvent(this.events.PLUGIN_UNLOADED, { pluginId });
      
    } catch (error) {
      logger.error(`Failed to unload plugin: ${pluginId}`, error);
      throw error;
    }
  }

  /**
   * Execute plugin hook
   */
  async executeHook(hookName, data = {}, options = {}) {
    const startTime = Date.now();
    const results = [];
    
    try {
      const hooks = this.pluginHooks.get(hookName) || [];
      
      for (const hook of hooks) {
        try {
          const plugin = this.loadedPlugins.get(hook.pluginId);
          if (!plugin) continue;
          
          // Check permissions
          if (!this.checkHookPermissions(plugin, hookName)) {
            logger.warn(`Permission denied for hook: ${hookName} in plugin: ${hook.pluginId}`);
            continue;
          }
          
          // Execute hook with timeout
          const hookStartTime = Date.now();
          const result = await Promise.race([
            hook.handler(data, this.createPluginAPI(hook.pluginId)),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Hook timeout')), options.timeout || 10000)
            )
          ]);
          
          const hookDuration = Date.now() - hookStartTime;
          
          // Update metrics
          plugin.metrics.calls++;
          plugin.metrics.lastCall = new Date();
          plugin.metrics.avgResponseTime = 
            (plugin.metrics.avgResponseTime + hookDuration) / plugin.metrics.calls;
          
          results.push({
            pluginId: hook.pluginId,
            result,
            duration: hookDuration,
            success: true
          });
          
        } catch (error) {
          logger.error(`Hook execution failed: ${hookName} in plugin: ${hook.pluginId}`, error);
          
          const plugin = this.loadedPlugins.get(hook.pluginId);
          if (plugin) {
            plugin.metrics.errors++;
          }
          
          results.push({
            pluginId: hook.pluginId,
            error: error.message,
            success: false
          });
        }
      }
      
      const totalDuration = Date.now() - startTime;
      logger.debug(`Hook execution completed: ${hookName} (${totalDuration}ms)`);
      
      return {
        hookName,
        results,
        duration: totalDuration,
        success: results.some(r => r.success)
      };
      
    } catch (error) {
      logger.error(`Hook execution error: ${hookName}`, error);
      throw error;
    }
  }

  /**
   * Get plugin configuration
   */
  getPluginConfig(pluginId) {
    return this.pluginConfigs.get(pluginId) || {};
  }

  /**
   * Update plugin configuration
   */
  async updatePluginConfig(pluginId, config) {
    try {
      // Validate configuration
      const plugin = await this.getPluginData(pluginId);
      if (!plugin) {
        throw new Error(`Plugin not found: ${pluginId}`);
      }
      
      // Merge with existing config
      const currentConfig = this.getPluginConfig(pluginId);
      const newConfig = { ...currentConfig, ...config };
      
      this.pluginConfigs.set(pluginId, newConfig);
      
      // Notify plugin of config change
      const loadedPlugin = this.loadedPlugins.get(pluginId);
      if (loadedPlugin && loadedPlugin.exports.onConfigUpdate) {
        await loadedPlugin.exports.onConfigUpdate(newConfig);
      }
      
      logger.info(`Plugin configuration updated: ${pluginId}`);
      return newConfig;
      
    } catch (error) {
      logger.error(`Failed to update plugin config: ${pluginId}`, error);
      throw error;
    }
  }

  /**
   * Get plugin metrics
   */
  getPluginMetrics(pluginId) {
    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      return null;
    }
    
    return {
      ...plugin.metrics,
      memoryUsage: process.memoryUsage(),
      uptime: Date.now() - plugin.loadTime.getTime(),
      status: 'active'
    };
  }

  /**
   * List all plugins
   */
  async listPlugins(options = {}) {
    try {
      const plugins = [];
      const pluginDirs = await fs.readdir(this.pluginDirectory);
      
      for (const dir of pluginDirs) {
        try {
          const pluginPath = path.join(this.pluginDirectory, dir);
          const manifestPath = path.join(pluginPath, 'manifest.json');
          
          const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
          const isLoaded = this.loadedPlugins.has(dir);
          
          plugins.push({
            id: dir,
            ...manifest,
            path: pluginPath,
            loaded: isLoaded,
            metrics: isLoaded ? this.getPluginMetrics(dir) : null
          });
          
        } catch (error) {
          logger.warn(`Failed to read plugin: ${dir}`, error);
        }
      }
      
      // Apply filters
      if (options.status) {
        return plugins.filter(p => 
          options.status === 'loaded' ? p.loaded : !p.loaded
        );
      }
      
      return plugins;
      
    } catch (error) {
      logger.error('Failed to list plugins:', error);
      throw error;
    }
  }

  /**
   * Perform security scan on plugin file
   */
  async performSecurityScan(pluginFile) {
    try {
      // Calculate file hash
      const fileBuffer = await fs.readFile(pluginFile);
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      
      // Basic security checks
      const issues = [];
      
      // Check file size (max 50MB)
      if (fileBuffer.length > 50 * 1024 * 1024) {
        issues.push('File size exceeds maximum limit');
      }
      
      // Check for suspicious patterns
      const content = fileBuffer.toString();
      const suspiciousPatterns = [
        /eval\s*\(/g,
        /Function\s*\(/g,
        /require\s*\(\s*['"]child_process['"]\s*\)/g,
        /require\s*\(\s*['"]fs['"]\s*\)/g,
        /process\.exit/g,
        /process\.kill/g
      ];
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
          issues.push(`Suspicious code pattern detected: ${pattern.source}`);
        }
      }
      
      return {
        passed: issues.length === 0,
        issues,
        hash,
        scanDate: new Date()
      };
      
    } catch (error) {
      logger.error('Security scan failed:', error);
      return {
        passed: false,
        issues: ['Security scan failed'],
        hash: null,
        scanDate: new Date()
      };
    }
  }

  /**
   * Create plugin API for sandbox
   */
  createPluginAPI(pluginId) {
    return {
      log: (message) => logger.info(`[Plugin:${pluginId}] ${message}`),
      config: this.getPluginConfig(pluginId),
      emit: (event, data) => this.emitEvent(`plugin:${pluginId}:${event}`, data),
      http: {
        // Restricted HTTP client
        get: async (url, options = {}) => {
          // Implement restricted HTTP client
          return this.makeSecureHttpRequest('GET', url, options, pluginId);
        },
        post: async (url, data, options = {}) => {
          return this.makeSecureHttpRequest('POST', url, { ...options, data }, pluginId);
        }
      },
      storage: {
        // Plugin-specific storage
        get: (key) => this.getPluginStorage(pluginId, key),
        set: (key, value) => this.setPluginStorage(pluginId, key, value),
        delete: (key) => this.deletePluginStorage(pluginId, key)
      }
    };
  }

  /**
   * Helper methods (implementation details)
   */
  async extractPlugin(pluginFile, installId) {
    // Implementation for extracting plugin archive
    // This would handle ZIP files, tar.gz, etc.
    const extractPath = path.join(this.tempDirectory, installId);
    await fs.mkdir(extractPath, { recursive: true });
    
    // For now, assume it's a directory copy
    // In production, implement proper archive extraction
    return extractPath;
  }

  async validatePluginStructure(pluginPath) {
    const manifestPath = path.join(pluginPath, 'manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Validate manifest structure
    if (!manifest.name || !manifest.version) {
      throw new Error('Invalid manifest: missing required fields');
    }
    
    return manifest;
  }

  async validatePluginCode(pluginPath) {
    // Implement code validation logic
    return { valid: true, errors: [] };
  }

  async registerPlugin(plugin) {
    // Store plugin metadata in database
    // For now, store in memory
    this.pluginConfigs.set(plugin.id, {});
  }

  async getPluginData(pluginId) {
    // Retrieve plugin data from storage
    const pluginPath = path.join(this.pluginDirectory, pluginId);
    try {
      const manifestPath = path.join(pluginPath, 'manifest.json');
      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
      return {
        id: pluginId,
        path: pluginPath,
        manifest
      };
    } catch (error) {
      return null;
    }
  }

  async registerPluginHooks(pluginInstance) {
    const hooks = pluginInstance.data.manifest.hooks || [];
    
    for (const hookName of hooks) {
      if (!this.pluginHooks.has(hookName)) {
        this.pluginHooks.set(hookName, []);
      }
      
      this.pluginHooks.get(hookName).push({
        pluginId: pluginInstance.id,
        handler: pluginInstance.exports[hookName] || (() => {})
      });
    }
  }

  async unregisterPluginHooks(pluginId) {
    for (const [hookName, hooks] of this.pluginHooks.entries()) {
      const filtered = hooks.filter(h => h.pluginId !== pluginId);
      this.pluginHooks.set(hookName, filtered);
    }
  }

  checkHookPermissions(plugin, hookName) {
    const permissions = plugin.data.manifest.permissions || [];
    return permissions.includes('*') || permissions.includes(hookName);
  }

  emitEvent(eventName, data) {
    // Implement event emission
    logger.debug(`Plugin event: ${eventName}`, data);
  }

  async makeSecureHttpRequest(method, url, options, pluginId) {
    // Implement secure HTTP client with restrictions
    // Check allowed domains, rate limiting, etc.
    throw new Error('HTTP requests not implemented yet');
  }

  getPluginStorage(pluginId, key) {
    // Implement plugin-specific storage
    return null;
  }

  setPluginStorage(pluginId, key, value) {
    // Implement plugin-specific storage
  }

  deletePluginStorage(pluginId, key) {
    // Implement plugin-specific storage
  }
}

module.exports = new PluginService(); 