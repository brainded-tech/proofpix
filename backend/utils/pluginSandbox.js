/**
 * Plugin Security Sandbox
 * Creates secure execution environments for plugins with restricted access
 */

const { logger } = require('../config/database');

/**
 * Create a secure sandbox environment for plugin execution
 */
async function createSecuritySandbox(pluginData) {
  const sandbox = {
    // Safe globals
    console: createSafeConsole(pluginData.id),
    Buffer: Buffer,
    setTimeout: setTimeout,
    setInterval: setInterval,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval,
    
    // Restricted require function
    require: createRestrictedRequire(pluginData),
    
    // Plugin metadata
    __plugin: {
      id: pluginData.id,
      name: pluginData.manifest.name,
      version: pluginData.manifest.version,
      permissions: pluginData.manifest.permissions || []
    },
    
    // Safe JSON operations
    JSON: {
      parse: JSON.parse,
      stringify: JSON.stringify
    },
    
    // Safe Math operations
    Math: Math,
    
    // Safe Date operations
    Date: Date,
    
    // Safe RegExp
    RegExp: RegExp,
    
    // Safe Array and Object methods
    Array: Array,
    Object: {
      keys: Object.keys,
      values: Object.values,
      entries: Object.entries,
      assign: Object.assign,
      freeze: Object.freeze,
      seal: Object.seal
    },
    
    // Safe string operations
    String: String,
    Number: Number,
    Boolean: Boolean,
    
    // Promise support (with restrictions)
    Promise: Promise,
    
    // Safe error handling
    Error: Error,
    TypeError: TypeError,
    ReferenceError: ReferenceError,
    SyntaxError: SyntaxError,
    
    // Module exports
    module: { exports: {} },
    exports: {}
  };
  
  // Link module.exports and exports
  sandbox.exports = sandbox.module.exports;
  
  return sandbox;
}

/**
 * Create a safe console object for plugins
 */
function createSafeConsole(pluginId) {
  return {
    log: (...args) => logger.info(`[Plugin:${pluginId}]`, ...args),
    warn: (...args) => logger.warn(`[Plugin:${pluginId}]`, ...args),
    error: (...args) => logger.error(`[Plugin:${pluginId}]`, ...args),
    info: (...args) => logger.info(`[Plugin:${pluginId}]`, ...args),
    debug: (...args) => logger.debug(`[Plugin:${pluginId}]`, ...args)
  };
}

/**
 * Create a restricted require function for plugins
 */
function createRestrictedRequire(pluginData) {
  const allowedModules = new Set([
    // Safe built-in modules
    'crypto',
    'util',
    'url',
    'querystring',
    'path',
    
    // Safe third-party modules (if permissions allow)
    'lodash',
    'moment',
    'uuid',
    'axios' // Only if http permission is granted
  ]);
  
  const permissions = pluginData.manifest.permissions || [];
  
  return function restrictedRequire(moduleName) {
    // Check if module is allowed
    if (!allowedModules.has(moduleName)) {
      throw new Error(`Module '${moduleName}' is not allowed in plugin sandbox`);
    }
    
    // Check specific permissions
    if (moduleName === 'axios' && !permissions.includes('http')) {
      throw new Error(`HTTP permission required to use '${moduleName}'`);
    }
    
    if (moduleName === 'crypto' && !permissions.includes('crypto')) {
      throw new Error(`Crypto permission required to use '${moduleName}'`);
    }
    
    try {
      const module = require(moduleName);
      
      // Return restricted version of some modules
      if (moduleName === 'axios') {
        return createRestrictedAxios(pluginData);
      }
      
      if (moduleName === 'crypto') {
        return createRestrictedCrypto();
      }
      
      return module;
    } catch (error) {
      logger.error(`Plugin ${pluginData.id} failed to require ${moduleName}:`, error);
      throw new Error(`Failed to load module '${moduleName}'`);
    }
  };
}

/**
 * Create a restricted axios instance for plugins
 */
function createRestrictedAxios(pluginData) {
  const axios = require('axios');
  
  // Create restricted axios instance
  const restrictedAxios = axios.create({
    timeout: 10000, // 10 second timeout
    maxRedirects: 3,
    maxContentLength: 10 * 1024 * 1024, // 10MB max response
    validateStatus: (status) => status < 500 // Don't throw on 4xx errors
  });
  
  // Add request interceptor for URL validation
  restrictedAxios.interceptors.request.use((config) => {
    const url = new URL(config.url);
    
    // Block localhost and private IPs
    if (isPrivateIP(url.hostname)) {
      throw new Error('Requests to private IPs are not allowed');
    }
    
    // Block certain protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Only HTTP and HTTPS protocols are allowed');
    }
    
    // Add plugin identification header
    config.headers['X-Plugin-ID'] = pluginData.id;
    config.headers['User-Agent'] = `ProofPix-Plugin/${pluginData.manifest.version}`;
    
    logger.debug(`Plugin ${pluginData.id} making HTTP request to ${config.url}`);
    
    return config;
  });
  
  // Add response interceptor for logging
  restrictedAxios.interceptors.response.use(
    (response) => {
      logger.debug(`Plugin ${pluginData.id} received response from ${response.config.url}: ${response.status}`);
      return response;
    },
    (error) => {
      logger.warn(`Plugin ${pluginData.id} HTTP request failed:`, error.message);
      return Promise.reject(error);
    }
  );
  
  return restrictedAxios;
}

/**
 * Create a restricted crypto module for plugins
 */
function createRestrictedCrypto() {
  const crypto = require('crypto');
  
  return {
    // Safe crypto operations
    randomBytes: crypto.randomBytes,
    randomUUID: crypto.randomUUID,
    createHash: crypto.createHash,
    createHmac: crypto.createHmac,
    
    // Restricted operations (no private key operations)
    pbkdf2: crypto.pbkdf2,
    pbkdf2Sync: crypto.pbkdf2Sync,
    scrypt: crypto.scrypt,
    scryptSync: crypto.scryptSync,
    
    // Constants
    constants: crypto.constants
  };
}

/**
 * Check if an IP address is private/local
 */
function isPrivateIP(hostname) {
  // Check for localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return true;
  }
  
  // Check for private IP ranges
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^169\.254\./, // Link-local
    /^fc00:/, // IPv6 private
    /^fe80:/ // IPv6 link-local
  ];
  
  return privateRanges.some(range => range.test(hostname));
}

/**
 * Validate plugin permissions
 */
function validatePermissions(permissions) {
  const validPermissions = [
    'http', // HTTP requests
    'crypto', // Cryptographic operations
    'storage', // Plugin storage access
    'files', // File processing hooks
    'analytics', // Analytics hooks
    'webhooks', // Webhook hooks
    'oauth', // OAuth hooks
    'security', // Security hooks
    '*' // All permissions (dangerous)
  ];
  
  const invalid = permissions.filter(p => !validPermissions.includes(p));
  if (invalid.length > 0) {
    throw new Error(`Invalid permissions: ${invalid.join(', ')}`);
  }
  
  return true;
}

/**
 * Create a memory-limited execution context
 */
function createMemoryLimitedContext(sandbox, memoryLimit = 50 * 1024 * 1024) { // 50MB default
  // This would require native modules or worker threads for true memory limiting
  // For now, we'll implement basic monitoring
  
  const originalSetTimeout = sandbox.setTimeout;
  const originalSetInterval = sandbox.setInterval;
  
  // Track timers to prevent resource leaks
  const timers = new Set();
  
  sandbox.setTimeout = (callback, delay, ...args) => {
    const timer = originalSetTimeout(() => {
      timers.delete(timer);
      callback(...args);
    }, delay);
    timers.add(timer);
    return timer;
  };
  
  sandbox.setInterval = (callback, delay, ...args) => {
    const timer = originalSetInterval(callback, delay, ...args);
    timers.add(timer);
    return timer;
  };
  
  sandbox.clearTimeout = (timer) => {
    timers.delete(timer);
    clearTimeout(timer);
  };
  
  sandbox.clearInterval = (timer) => {
    timers.delete(timer);
    clearInterval(timer);
  };
  
  // Cleanup function
  sandbox.__cleanup = () => {
    timers.forEach(timer => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    timers.clear();
  };
  
  return sandbox;
}

/**
 * Security policy enforcement
 */
function enforceSecurityPolicy(pluginData, operation, context = {}) {
  const permissions = pluginData.manifest.permissions || [];
  
  // Check if operation is allowed
  switch (operation) {
    case 'http_request':
      if (!permissions.includes('http') && !permissions.includes('*')) {
        throw new Error('HTTP permission required for this operation');
      }
      break;
      
    case 'crypto_operation':
      if (!permissions.includes('crypto') && !permissions.includes('*')) {
        throw new Error('Crypto permission required for this operation');
      }
      break;
      
    case 'storage_access':
      if (!permissions.includes('storage') && !permissions.includes('*')) {
        throw new Error('Storage permission required for this operation');
      }
      break;
      
    default:
      logger.warn(`Unknown operation: ${operation}`);
  }
  
  return true;
}

module.exports = {
  createSecuritySandbox,
  createSafeConsole,
  createRestrictedRequire,
  validatePermissions,
  createMemoryLimitedContext,
  enforceSecurityPolicy,
  isPrivateIP
}; 