/**
 * Plugin Validation Utilities
 * Validates plugin manifests, code, and security compliance
 */

const Joi = require('joi');
const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../config/database');

/**
 * Plugin manifest schema validation
 */
const manifestSchema = Joi.object({
  id: Joi.string().alphanum().min(3).max(50).optional(),
  name: Joi.string().min(3).max(100).required(),
  version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).required(),
  description: Joi.string().min(10).max(500).required(),
  author: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().optional(),
    url: Joi.string().uri().optional()
  }).required(),
  
  // Plugin entry point
  main: Joi.string().default('index.js'),
  
  // Plugin type and category
  type: Joi.string().valid('processor', 'connector', 'analyzer', 'utility').required(),
  category: Joi.string().valid(
    'file-processing', 'data-analysis', 'integration', 
    'security', 'reporting', 'automation', 'other'
  ).required(),
  
  // Permissions required by the plugin
  permissions: Joi.array().items(
    Joi.string().valid(
      'http', 'crypto', 'storage', 'files', 'analytics', 
      'webhooks', 'oauth', 'security', '*'
    )
  ).default([]),
  
  // Hooks that the plugin implements
  hooks: Joi.array().items(Joi.string()).default([]),
  
  // Plugin configuration schema
  configSchema: Joi.object().optional(),
  
  // Dependencies
  dependencies: Joi.object().pattern(
    Joi.string(),
    Joi.string()
  ).optional(),
  
  // Compatibility
  compatibility: Joi.object({
    proofpix: Joi.string().required(),
    node: Joi.string().optional()
  }).required(),
  
  // Plugin metadata
  keywords: Joi.array().items(Joi.string()).optional(),
  license: Joi.string().optional(),
  homepage: Joi.string().uri().optional(),
  repository: Joi.object({
    type: Joi.string().valid('git'),
    url: Joi.string().uri()
  }).optional(),
  
  // Security and trust
  trusted: Joi.boolean().default(false),
  verified: Joi.boolean().default(false),
  
  // Resource limits
  limits: Joi.object({
    memory: Joi.number().min(1).max(100).default(50), // MB
    cpu: Joi.number().min(0.1).max(2).default(1), // CPU cores
    timeout: Joi.number().min(1000).max(60000).default(10000), // ms
    requests: Joi.number().min(1).max(1000).default(100) // per minute
  }).default()
});

/**
 * Validate plugin manifest
 */
async function validatePluginManifest(manifestPath) {
  try {
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    const { error, value } = manifestSchema.validate(manifest, {
      abortEarly: false,
      allowUnknown: false
    });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return {
        valid: false,
        errors,
        manifest: null
      };
    }
    
    // Additional validation
    const additionalErrors = await performAdditionalManifestValidation(value);
    if (additionalErrors.length > 0) {
      return {
        valid: false,
        errors: additionalErrors,
        manifest: null
      };
    }
    
    return {
      valid: true,
      errors: [],
      manifest: value
    };
    
  } catch (error) {
    logger.error('Manifest validation error:', error);
    return {
      valid: false,
      errors: ['Invalid JSON or file read error'],
      manifest: null
    };
  }
}

/**
 * Perform additional manifest validation
 */
async function performAdditionalManifestValidation(manifest) {
  const errors = [];
  
  // Check ProofPix compatibility
  const currentVersion = '1.0.0'; // This should come from package.json
  if (!isVersionCompatible(manifest.compatibility.proofpix, currentVersion)) {
    errors.push(`Plugin requires ProofPix ${manifest.compatibility.proofpix}, current version is ${currentVersion}`);
  }
  
  // Validate hook names
  const validHooks = [
    'file:uploaded', 'file:processed', 'file:analyzed',
    'webhook:received', 'oauth:authorized', 'analytics:generated',
    'security:event', 'user:created', 'user:updated'
  ];
  
  const invalidHooks = manifest.hooks.filter(hook => !validHooks.includes(hook));
  if (invalidHooks.length > 0) {
    errors.push(`Invalid hooks: ${invalidHooks.join(', ')}`);
  }
  
  // Check for dangerous permissions
  if (manifest.permissions.includes('*') && !manifest.trusted) {
    errors.push('Wildcard permissions require trusted plugin status');
  }
  
  return errors;
}

/**
 * Validate plugin code
 */
async function validatePluginCode(pluginPath) {
  try {
    const manifest = JSON.parse(
      await fs.readFile(path.join(pluginPath, 'manifest.json'), 'utf8')
    );
    
    const mainFile = path.join(pluginPath, manifest.main || 'index.js');
    
    // Check if main file exists
    try {
      await fs.access(mainFile);
    } catch (error) {
      return {
        valid: false,
        errors: [`Main file not found: ${manifest.main || 'index.js'}`]
      };
    }
    
    const code = await fs.readFile(mainFile, 'utf8');
    
    // Perform code validation
    const codeErrors = [];
    
    // 1. Syntax validation
    try {
      new Function(code); // Basic syntax check
    } catch (syntaxError) {
      codeErrors.push(`Syntax error: ${syntaxError.message}`);
    }
    
    // 2. Security validation
    const securityIssues = await performSecurityCodeAnalysis(code);
    codeErrors.push(...securityIssues);
    
    // 3. Structure validation
    const structureIssues = await validateCodeStructure(code, manifest);
    codeErrors.push(...structureIssues);
    
    // 4. Dependency validation
    const dependencyIssues = await validateDependencies(pluginPath, manifest);
    codeErrors.push(...dependencyIssues);
    
    return {
      valid: codeErrors.length === 0,
      errors: codeErrors
    };
    
  } catch (error) {
    logger.error('Code validation error:', error);
    return {
      valid: false,
      errors: ['Code validation failed']
    };
  }
}

/**
 * Perform security code analysis
 */
async function performSecurityCodeAnalysis(code) {
  const issues = [];
  
  // Dangerous patterns
  const dangerousPatterns = [
    {
      pattern: /eval\s*\(/g,
      message: 'Use of eval() is prohibited'
    },
    {
      pattern: /Function\s*\(/g,
      message: 'Dynamic function creation is prohibited'
    },
    {
      pattern: /require\s*\(\s*['"]child_process['"]\s*\)/g,
      message: 'Child process execution is prohibited'
    },
    {
      pattern: /require\s*\(\s*['"]fs['"]\s*\)/g,
      message: 'Direct file system access is prohibited'
    },
    {
      pattern: /process\.exit/g,
      message: 'Process termination is prohibited'
    },
    {
      pattern: /process\.kill/g,
      message: 'Process killing is prohibited'
    },
    {
      pattern: /global\./g,
      message: 'Global object modification is prohibited'
    },
    {
      pattern: /__dirname|__filename/g,
      message: 'Direct path access is prohibited'
    },
    {
      pattern: /require\.cache/g,
      message: 'Require cache manipulation is prohibited'
    },
    {
      pattern: /module\.parent/g,
      message: 'Module parent access is prohibited'
    }
  ];
  
  for (const { pattern, message } of dangerousPatterns) {
    if (pattern.test(code)) {
      issues.push(message);
    }
  }
  
  // Check for obfuscated code
  if (isCodeObfuscated(code)) {
    issues.push('Obfuscated code is not allowed');
  }
  
  // Check for excessive complexity
  if (isCodeTooComplex(code)) {
    issues.push('Code complexity exceeds maximum allowed');
  }
  
  return issues;
}

/**
 * Validate code structure
 */
async function validateCodeStructure(code, manifest) {
  const issues = [];
  
  // Check for required exports
  if (!code.includes('module.exports') && !code.includes('exports.')) {
    issues.push('Plugin must export functions or objects');
  }
  
  // Check for hook implementations
  for (const hook of manifest.hooks) {
    const hookFunction = hook.replace(/[:.]/g, '_');
    if (!code.includes(hookFunction) && !code.includes(`'${hook}'`) && !code.includes(`"${hook}"`)) {
      issues.push(`Hook implementation not found: ${hook}`);
    }
  }
  
  // Check for initialization function if required
  if (manifest.type === 'connector' && !code.includes('initialize')) {
    issues.push('Connector plugins must implement initialize() function');
  }
  
  return issues;
}

/**
 * Validate plugin dependencies
 */
async function validateDependencies(pluginPath, manifest) {
  const issues = [];
  
  if (!manifest.dependencies) {
    return issues;
  }
  
  // Check if package.json exists for dependencies
  const packageJsonPath = path.join(pluginPath, 'package.json');
  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    
    // Validate dependencies match
    for (const [dep, version] of Object.entries(manifest.dependencies)) {
      if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
        issues.push(`Dependency ${dep} not found in package.json`);
      } else if (packageJson.dependencies[dep] !== version) {
        issues.push(`Dependency version mismatch: ${dep} (expected ${version}, found ${packageJson.dependencies[dep]})`);
      }
    }
    
  } catch (error) {
    if (Object.keys(manifest.dependencies).length > 0) {
      issues.push('package.json required for plugins with dependencies');
    }
  }
  
  return issues;
}

/**
 * Check if code is obfuscated
 */
function isCodeObfuscated(code) {
  // Simple heuristics for obfuscation detection
  const lines = code.split('\n');
  const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
  
  // Very long lines might indicate obfuscation
  if (avgLineLength > 200) {
    return true;
  }
  
  // High ratio of non-alphanumeric characters
  const alphanumeric = code.match(/[a-zA-Z0-9]/g) || [];
  const total = code.replace(/\s/g, '').length;
  const ratio = alphanumeric.length / total;
  
  if (ratio < 0.6) {
    return true;
  }
  
  // Excessive use of escape sequences
  const escapes = code.match(/\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}/g) || [];
  if (escapes.length > 10) {
    return true;
  }
  
  return false;
}

/**
 * Check if code is too complex
 */
function isCodeTooComplex(code) {
  // Simple complexity metrics
  const lines = code.split('\n').filter(line => line.trim().length > 0);
  
  // Too many lines
  if (lines.length > 1000) {
    return true;
  }
  
  // Too many nested levels
  const maxNesting = getMaxNestingLevel(code);
  if (maxNesting > 10) {
    return true;
  }
  
  return false;
}

/**
 * Get maximum nesting level in code
 */
function getMaxNestingLevel(code) {
  let maxLevel = 0;
  let currentLevel = 0;
  
  for (const char of code) {
    if (char === '{' || char === '(' || char === '[') {
      currentLevel++;
      maxLevel = Math.max(maxLevel, currentLevel);
    } else if (char === '}' || char === ')' || char === ']') {
      currentLevel--;
    }
  }
  
  return maxLevel;
}

/**
 * Check version compatibility
 */
function isVersionCompatible(required, current) {
  // Simple semver compatibility check
  const parseVersion = (version) => {
    const parts = version.replace(/[^\d.]/g, '').split('.');
    return {
      major: parseInt(parts[0]) || 0,
      minor: parseInt(parts[1]) || 0,
      patch: parseInt(parts[2]) || 0
    };
  };
  
  const req = parseVersion(required);
  const cur = parseVersion(current);
  
  // Major version must match
  if (req.major !== cur.major) {
    return false;
  }
  
  // Current minor version must be >= required
  if (cur.minor < req.minor) {
    return false;
  }
  
  // If minor versions match, current patch must be >= required
  if (cur.minor === req.minor && cur.patch < req.patch) {
    return false;
  }
  
  return true;
}

/**
 * Validate plugin file structure
 */
async function validatePluginStructure(pluginPath) {
  const issues = [];
  
  try {
    // Required files
    const requiredFiles = ['manifest.json'];
    
    for (const file of requiredFiles) {
      const filePath = path.join(pluginPath, file);
      try {
        await fs.access(filePath);
      } catch (error) {
        issues.push(`Required file missing: ${file}`);
      }
    }
    
    // Check manifest to determine main file
    try {
      const manifest = JSON.parse(
        await fs.readFile(path.join(pluginPath, 'manifest.json'), 'utf8')
      );
      
      const mainFile = manifest.main || 'index.js';
      try {
        await fs.access(path.join(pluginPath, mainFile));
      } catch (error) {
        issues.push(`Main file missing: ${mainFile}`);
      }
      
    } catch (error) {
      // Manifest validation will catch this
    }
    
    // Check for suspicious files
    const files = await fs.readdir(pluginPath, { withFileTypes: true });
    const suspiciousExtensions = ['.exe', '.bat', '.sh', '.cmd', '.scr'];
    
    for (const file of files) {
      if (file.isFile()) {
        const ext = path.extname(file.name).toLowerCase();
        if (suspiciousExtensions.includes(ext)) {
          issues.push(`Suspicious file type: ${file.name}`);
        }
      }
    }
    
  } catch (error) {
    issues.push('Failed to validate plugin structure');
  }
  
  return {
    valid: issues.length === 0,
    errors: issues
  };
}

module.exports = {
  validatePluginManifest,
  validatePluginCode,
  validatePluginStructure,
  manifestSchema,
  isVersionCompatible,
  performSecurityCodeAnalysis
}; 