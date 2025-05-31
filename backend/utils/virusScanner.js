const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../config/database');

class VirusScanner {
  constructor() {
    // Known malicious patterns for basic detection
    this.maliciousPatterns = [
      // Script injection patterns
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
      
      // Executable signatures
      /MZ\x90\x00/,  // PE executable
      /\x7fELF/,     // ELF executable
      /\xca\xfe\xba\xbe/, // Mach-O executable
      
      // Suspicious file patterns
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.pif$/i,
      /\.com$/i,
      
      // Macro patterns
      /Auto_Open/gi,
      /Workbook_Open/gi,
      /Document_Open/gi,
      /Shell\(/gi,
      /CreateObject/gi,
      
      // SQL injection patterns
      /union\s+select/gi,
      /drop\s+table/gi,
      /delete\s+from/gi,
      /insert\s+into/gi,
      
      // XSS patterns
      /alert\s*\(/gi,
      /document\.cookie/gi,
      /window\.location/gi,
      /eval\s*\(/gi
    ];
    
    // File size limits (in bytes)
    this.maxFileSize = 100 * 1024 * 1024; // 100MB
    this.maxScanSize = 10 * 1024 * 1024;  // 10MB for content scanning
  }

  /**
   * Scan a file for viruses and malicious content
   * @param {string} filePath - Path to the file to scan
   * @param {Object} options - Scan options
   * @returns {Promise<Object>} Scan result
   */
  async scanFile(filePath, options = {}) {
    try {
      const startTime = Date.now();
      
      // Check if file exists
      const stats = await fs.stat(filePath);
      
      // Check file size
      if (stats.size > this.maxFileSize) {
        return {
          isClean: false,
          threats: ['FILE_TOO_LARGE'],
          scanTime: Date.now() - startTime,
          fileSize: stats.size,
          scanMethod: 'size_check'
        };
      }

      // Perform basic file extension check
      const extCheck = this.checkFileExtension(filePath);
      if (!extCheck.isClean) {
        return {
          isClean: false,
          threats: extCheck.threats,
          scanTime: Date.now() - startTime,
          fileSize: stats.size,
          scanMethod: 'extension_check'
        };
      }

      // Perform content scanning for smaller files
      let contentScanResult = { isClean: true, threats: [] };
      if (stats.size <= this.maxScanSize) {
        contentScanResult = await this.scanFileContent(filePath);
      }

      const scanTime = Date.now() - startTime;
      
      logger.info('Virus scan completed', {
        filePath,
        isClean: contentScanResult.isClean,
        threats: contentScanResult.threats,
        scanTime,
        fileSize: stats.size
      });

      return {
        isClean: contentScanResult.isClean,
        threats: contentScanResult.threats,
        scanTime,
        fileSize: stats.size,
        scanMethod: 'pattern_based',
        metadata: {
          fileName: path.basename(filePath),
          fileExtension: path.extname(filePath),
          lastModified: stats.mtime
        }
      };

    } catch (error) {
      logger.error('Virus scan error:', error);
      
      return {
        isClean: false,
        threats: ['SCAN_ERROR'],
        error: error.message,
        scanTime: 0,
        scanMethod: 'error'
      };
    }
  }

  /**
   * Check file extension for known dangerous types
   * @param {string} filePath - Path to the file
   * @returns {Object} Extension check result
   */
  checkFileExtension(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    
    const dangerousExtensions = [
      '.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar',
      '.app', '.deb', '.pkg', '.dmg', '.msi', '.run', '.bin'
    ];

    if (dangerousExtensions.includes(extension)) {
      return {
        isClean: false,
        threats: [`DANGEROUS_EXTENSION_${extension.toUpperCase()}`]
      };
    }

    return { isClean: true, threats: [] };
  }

  /**
   * Scan file content for malicious patterns
   * @param {string} filePath - Path to the file
   * @returns {Promise<Object>} Content scan result
   */
  async scanFileContent(filePath) {
    try {
      const content = await fs.readFile(filePath);
      const textContent = content.toString('utf8', 0, Math.min(content.length, 1024 * 1024)); // First 1MB as text
      const threats = [];

      // Check for malicious patterns
      for (const pattern of this.maliciousPatterns) {
        if (pattern.test(textContent)) {
          threats.push(`MALICIOUS_PATTERN_${pattern.source.substring(0, 20)}`);
        }
      }

      // Check for suspicious binary signatures
      if (this.hasSuspiciousBinarySignature(content)) {
        threats.push('SUSPICIOUS_BINARY_SIGNATURE');
      }

      // Check for embedded executables
      if (this.hasEmbeddedExecutable(content)) {
        threats.push('EMBEDDED_EXECUTABLE');
      }

      return {
        isClean: threats.length === 0,
        threats
      };

    } catch (error) {
      logger.error('Content scan error:', error);
      return {
        isClean: false,
        threats: ['CONTENT_SCAN_ERROR']
      };
    }
  }

  /**
   * Check for suspicious binary signatures
   * @param {Buffer} content - File content buffer
   * @returns {boolean} True if suspicious signature found
   */
  hasSuspiciousBinarySignature(content) {
    if (content.length < 4) return false;

    // Check for PE executable signature
    if (content[0] === 0x4D && content[1] === 0x5A) { // MZ
      return true;
    }

    // Check for ELF executable signature
    if (content[0] === 0x7F && content[1] === 0x45 && 
        content[2] === 0x4C && content[3] === 0x46) { // ELF
      return true;
    }

    // Check for Mach-O signature
    if (content[0] === 0xCA && content[1] === 0xFE && 
        content[2] === 0xBA && content[3] === 0xBE) {
      return true;
    }

    return false;
  }

  /**
   * Check for embedded executables in files
   * @param {Buffer} content - File content buffer
   * @returns {boolean} True if embedded executable found
   */
  hasEmbeddedExecutable(content) {
    const contentStr = content.toString('hex');
    
    // Look for embedded PE signatures
    if (contentStr.includes('4d5a9000')) { // MZ signature in hex
      return true;
    }

    // Look for embedded ELF signatures
    if (contentStr.includes('7f454c46')) { // ELF signature in hex
      return true;
    }

    return false;
  }

  /**
   * Get scanner information
   * @returns {Object} Scanner info
   */
  getInfo() {
    return {
      name: 'ProofPix Pattern-Based Virus Scanner',
      version: '1.0.0',
      patterns: this.maliciousPatterns.length,
      maxFileSize: this.maxFileSize,
      maxScanSize: this.maxScanSize,
      capabilities: [
        'pattern_detection',
        'extension_checking',
        'binary_signature_detection',
        'embedded_executable_detection'
      ]
    };
  }

  /**
   * Update malicious patterns (for future use)
   * @param {Array} newPatterns - New patterns to add
   */
  updatePatterns(newPatterns) {
    this.maliciousPatterns.push(...newPatterns);
    logger.info('Virus scanner patterns updated', {
      newPatterns: newPatterns.length,
      totalPatterns: this.maliciousPatterns.length
    });
  }
}

module.exports = VirusScanner; 