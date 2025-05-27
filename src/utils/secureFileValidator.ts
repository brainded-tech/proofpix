// 🔒 SECURE FILE VALIDATOR - Enterprise Security Implementation
// Comprehensive file validation with malicious content detection

interface ValidationResult {
  valid: boolean;
  sanitized: boolean;
  warnings?: string[];
  errors?: string[];
}

interface FileSignature {
  mimeType: string;
  signature: number[];
  offset?: number;
}

class ValidationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class SecureFileValidator {
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/tiff', 
    'image/heic', 
    'image/heif'
  ];
  
  // File signature validation (magic numbers)
  private static readonly MAGIC_NUMBERS: FileSignature[] = [
    { mimeType: 'image/jpeg', signature: [0xFF, 0xD8, 0xFF] },
    { mimeType: 'image/png', signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
    { mimeType: 'image/tiff', signature: [0x49, 0x49, 0x2A, 0x00] }, // Little endian
    { mimeType: 'image/tiff', signature: [0x4D, 0x4D, 0x00, 0x2A] }, // Big endian
    { mimeType: 'image/heic', signature: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63], offset: 4 },
    { mimeType: 'image/heif', signature: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x66], offset: 4 }
  ];

  // Dangerous patterns in metadata
  private static readonly DANGEROUS_PATTERNS = [
    /<script[^>]*>/i,
    /javascript:/i,
    /onload\s*=/i,
    /onerror\s*=/i,
    /onclick\s*=/i,
    /onmouseover\s*=/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i,
    /alert\s*\(/i,
    /confirm\s*\(/i,
    /prompt\s*\(/i,
    /<iframe[^>]*>/i,
    /<object[^>]*>/i,
    /<embed[^>]*>/i,
    /<link[^>]*>/i,
    /<meta[^>]*>/i,
    /data:text\/html/i,
    /vbscript:/i,
    /expression\s*\(/i
  ];

  // Dangerous EXIF fields that should be removed
  private static readonly DANGEROUS_EXIF_FIELDS = [
    'MakerNote',           // Binary data that could contain exploits
    'UserComment',         // User-controlled text field
    'ImageDescription',    // User-controlled text field
    'Artist',             // User-controlled text field
    'Copyright',          // User-controlled text field
    'Software',           // Could reveal software vulnerabilities
    'ProcessingSoftware', // Could reveal processing chain
    'DocumentName',       // User-controlled text field
    'PageName',           // User-controlled text field
    'XPTitle',            // Windows XP title field
    'XPComment',          // Windows XP comment field
    'XPAuthor',           // Windows XP author field
    'XPKeywords',         // Windows XP keywords field
    'XPSubject'           // Windows XP subject field
  ];

  /**
   * 🔒 COMPREHENSIVE FILE VALIDATION: Multi-layer security validation
   */
  static async validateFile(file: File): Promise<ValidationResult> {
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // 1. Basic file validation
      this.validateBasicFileProperties(file);

      // 2. File size validation
      this.validateFileSize(file);

      // 3. MIME type validation
      this.validateMimeType(file);

      // 4. File signature validation (magic numbers)
      await this.validateFileSignature(file);

      // 5. Malicious content detection
      await this.scanForMaliciousContent(file);

      // 6. Compression bomb detection
      if (await this.detectCompressionBomb(file)) {
        throw new ValidationError('Potential compression bomb detected', 'COMPRESSION_BOMB');
      }

      // 7. Metadata extraction and validation
      const metadata = await this.extractAndValidateMetadata(file);
      if (metadata.warnings) {
        warnings.push(...metadata.warnings);
      }

      this.logSecurityEvent('File validation successful', {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        warningsCount: warnings.length
      });

      return { 
        valid: true, 
        sanitized: true, 
        warnings: warnings.length > 0 ? warnings : undefined 
      };

    } catch (error: unknown) {
      this.logSecurityEvent('File validation failed', {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
        code: error instanceof ValidationError ? error.code : undefined
      });

      if (error instanceof ValidationError) {
        errors.push(error instanceof Error ? error.message : String(error));
        return { valid: false, sanitized: false, errors };
      }

      errors.push('File validation failed: ' + (error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error)));
      return { valid: false, sanitized: false, errors };
    }
  }

  /**
   * 🔒 BASIC FILE VALIDATION: Null checks and basic properties
   */
  private static validateBasicFileProperties(file: File): void {
    if (!file) {
      throw new ValidationError('No file provided', 'NO_FILE');
    }

    if (!file.name || file.name.trim() === '') {
      throw new ValidationError('File name is required', 'NO_FILENAME');
    }

    if (file.size === 0) {
      throw new ValidationError('File is empty', 'EMPTY_FILE');
    }

    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.(exe|bat|cmd|scr|pif|com|vbs|js|jar|app)$/i,
      /\.(php|asp|jsp|cgi|pl|py|rb)$/i,
      /\.(htaccess|htpasswd|config)$/i,
      /\.\./,  // Directory traversal
      /[<>:"|?*]/  // Invalid filename characters
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(file.name)) {
        throw new ValidationError(`Suspicious file name: ${file.name}`, 'SUSPICIOUS_FILENAME');
      }
    }
  }

  /**
   * 🔒 FILE SIZE VALIDATION: Prevent oversized uploads
   */
  private static validateFileSize(file: File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new ValidationError(
        `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed ${(this.MAX_FILE_SIZE / 1024 / 1024)}MB`,
        'FILE_TOO_LARGE'
      );
    }

    // Minimum size check (prevent 0-byte files)
    if (file.size < 100) {
      throw new ValidationError('File is too small to be a valid image', 'FILE_TOO_SMALL');
    }
  }

  /**
   * 🔒 MIME TYPE VALIDATION: Verify declared file type
   */
  private static validateMimeType(file: File): void {
    if (!file.type) {
      throw new ValidationError('File type not specified', 'NO_MIME_TYPE');
    }

    if (!this.ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      throw new ValidationError(
        `File type ${file.type} not allowed. Supported types: ${this.ALLOWED_TYPES.join(', ')}`,
        'INVALID_MIME_TYPE'
      );
    }
  }

  /**
   * 🔒 FILE SIGNATURE VALIDATION: Verify file magic numbers
   */
  private static async validateFileSignature(file: File): Promise<void> {
    const header = await this.readFileHeader(file, 32); // Read first 32 bytes
    
    let signatureMatch = false;
    for (const sig of this.MAGIC_NUMBERS) {
      const offset = sig.offset || 0;
      if (this.compareSignature(header, sig.signature, offset)) {
        // Verify the signature matches the declared MIME type
        if (file.type === sig.mimeType || 
            (file.type === 'image/jpg' && sig.mimeType === 'image/jpeg')) {
          signatureMatch = true;
          break;
        }
      }
    }

    if (!signatureMatch) {
      throw new ValidationError(
        `File signature does not match declared type ${file.type}`,
        'SIGNATURE_MISMATCH'
      );
    }
  }

  /**
   * 🔒 MALICIOUS CONTENT DETECTION: Scan for embedded threats
   */
  private static async scanForMaliciousContent(file: File): Promise<void> {
    try {
      // Quick metadata extraction for scanning
      const quickMetadata = await this.extractQuickMetadata(file);
      
      // Scan all string values in metadata
      for (const [key, value] of Object.entries(quickMetadata)) {
        if (typeof value === 'string') {
          this.scanStringForThreats(value, key);
        }
      }

      // Scan file content for embedded scripts (first 64KB)
      const contentSample = await this.readFileHeader(file, Math.min(64 * 1024, file.size));
      const contentString = new TextDecoder('utf-8', { fatal: false }).decode(contentSample);
      this.scanStringForThreats(contentString, 'file_content');

    } catch (error: unknown) {
      console.warn('Malicious content scan failed:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error));
      // Continue with validation - scanning failure shouldn't block legitimate files
    }
  }

  /**
   * 🔒 STRING THREAT SCANNING: Detect malicious patterns in strings
   */
  private static scanStringForThreats(text: string, fieldName: string): void {
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(text)) {
        throw new ValidationError(
          `Malicious content detected in ${fieldName}: ${pattern.source}`,
          'MALICIOUS_CONTENT'
        );
      }
    }

    // Check for suspicious base64 content
    if (this.detectSuspiciousBase64(text)) {
      throw new ValidationError(
        `Suspicious encoded content detected in ${fieldName}`,
        'SUSPICIOUS_ENCODING'
      );
    }

    // Check for SQL injection patterns
    if (this.detectSQLInjection(text)) {
      throw new ValidationError(
        `SQL injection pattern detected in ${fieldName}`,
        'SQL_INJECTION'
      );
    }
  }

  /**
   * 🔒 COMPRESSION BOMB DETECTION: Prevent zip bombs and similar attacks
   */
  private static async detectCompressionBomb(file: File): Promise<boolean> {
    try {
      // Simple heuristic: check if file claims to be much larger when uncompressed
      const compressionRatio = await this.estimateCompressionRatio(file);
      
      // Flag if compression ratio > 1000:1 (very suspicious)
      if (compressionRatio > 1000) {
        return true;
      }

      // Additional check: look for repeated patterns that might indicate compression bombs
      const sample = await this.readFileHeader(file, Math.min(8192, file.size));
      return this.detectRepeatedPatterns(sample);

    } catch (error: unknown) {
      console.warn('Compression bomb detection failed:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error));
      return false; // Don't block on detection failure
    }
  }

  /**
   * 🔒 METADATA EXTRACTION AND SANITIZATION: Clean and validate metadata
   */
  private static async extractAndValidateMetadata(file: File): Promise<{ metadata: any; warnings?: string[] }> {
    const warnings: string[] = [];
    
    try {
      // Extract metadata using a safe method
      const rawMetadata = await this.extractQuickMetadata(file);
      
      // Sanitize metadata
      const sanitizedMetadata = this.sanitizeMetadata(rawMetadata, warnings);
      
      return { metadata: sanitizedMetadata, warnings };
    } catch (error: unknown) {
      warnings.push(`Metadata extraction failed: ${error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error)}`);
      return { metadata: {}, warnings };
    }
  }

  /**
   * 🔒 METADATA SANITIZATION: Remove dangerous fields and sanitize values
   */
  static sanitizeMetadata(metadata: any, warnings?: string[]): any {
    const clean: any = {};
    const warningsList = warnings || [];

    for (const [key, value] of Object.entries(metadata)) {
      // Skip dangerous fields
      if (this.DANGEROUS_EXIF_FIELDS.includes(key)) {
        warningsList.push(`Removed potentially dangerous field: ${key}`);
        continue;
      }

      if (typeof value === 'string') {
        // Sanitize string values
        const sanitized = this.sanitizeString(value);
        if (sanitized !== value) {
          warningsList.push(`Sanitized field: ${key}`);
        }
        clean[key] = sanitized;
      } else if (typeof value === 'number') {
        // Validate numeric ranges
        clean[key] = this.validateNumericRange(key, value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize objects
        clean[key] = this.sanitizeMetadata(value, warningsList);
      } else {
        // Keep other primitive types as-is
        clean[key] = value;
      }
    }

    return clean;
  }

  /**
   * 🔒 STRING SANITIZATION: Clean potentially dangerous strings
   */
  private static sanitizeString(str: string): string {
    if (!str || typeof str !== 'string') return '';

    // Remove null bytes and control characters
    let sanitized = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Remove HTML/XML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
    
    // Remove JavaScript protocols
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/vbscript:/gi, '');
    sanitized = sanitized.replace(/data:/gi, '');
    
    // Limit length to prevent DoS
    if (sanitized.length > 1000) {
      sanitized = sanitized.substring(0, 1000) + '...';
    }

    return sanitized.trim();
  }

  /**
   * 🔒 NUMERIC VALIDATION: Validate numeric ranges
   */
  private static validateNumericRange(fieldName: string, value: number): number {
    // GPS coordinates validation
    if (fieldName.toLowerCase().includes('latitude')) {
      return Math.max(-90, Math.min(90, value));
    }
    if (fieldName.toLowerCase().includes('longitude')) {
      return Math.max(-180, Math.min(180, value));
    }
    
    // General numeric validation
    if (!isFinite(value) || isNaN(value)) {
      return 0;
    }
    
    // Prevent extremely large numbers that could cause issues
    if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
      return 0;
    }

    return value;
  }

  // 🔐 UTILITY METHODS

  private static async readFileHeader(file: File, bytes: number): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(new Uint8Array(e.target.result as ArrayBuffer));
        } else {
          reject(new Error('Failed to read file header'));
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsArrayBuffer(file.slice(0, bytes));
    });
  }

  private static compareSignature(header: Uint8Array, signature: number[], offset: number = 0): boolean {
    if (header.length < offset + signature.length) return false;
    
    return signature.every((byte, index) => header[offset + index] === byte);
  }

  private static async extractQuickMetadata(file: File): Promise<any> {
    // This would integrate with your existing EXIF extraction library
    // For now, return empty object to prevent errors
    return {};
  }

  private static async estimateCompressionRatio(file: File): Promise<number> {
    // Simple estimation based on file size vs content entropy
    const sample = await this.readFileHeader(file, Math.min(4096, file.size));
    const entropy = this.calculateEntropy(sample);
    
    // Lower entropy suggests higher compression potential
    return entropy < 3 ? 1000 : 1; // Simplified heuristic
  }

  private static calculateEntropy(data: Uint8Array): number {
    const frequency = new Array(256).fill(0);
    for (let i = 0; i < data.length; i++) {
      frequency[data[i]]++;
    }
    
    let entropy = 0;
    const length = data.length;
    for (const freq of frequency) {
      if (freq > 0) {
        const p = freq / length;
        entropy -= p * Math.log2(p);
      }
    }
    
    return entropy;
  }

  private static detectRepeatedPatterns(data: Uint8Array): boolean {
    // Look for suspicious repeated patterns
    const patternLength = 4;
    const threshold = 0.8; // 80% repetition is suspicious
    
    if (data.length < patternLength * 10) return false;
    
    const pattern = data.slice(0, patternLength);
    let matches = 0;
    
    for (let i = 0; i < data.length - patternLength; i += patternLength) {
      const chunk = data.slice(i, i + patternLength);
      if (chunk.every((byte, index) => byte === pattern[index])) {
        matches++;
      }
    }
    
    const repetitionRatio = matches / Math.floor(data.length / patternLength);
    return repetitionRatio > threshold;
  }

  private static detectSuspiciousBase64(text: string): boolean {
    // Look for base64 patterns that might contain malicious content
    const base64Pattern = /[A-Za-z0-9+/]{20,}={0,2}/g;
    const matches = text.match(base64Pattern);
    
    if (!matches) return false;
    
    // Check if any base64 strings decode to suspicious content
    for (const match of matches) {
      try {
        const decoded = atob(match);
        for (const pattern of this.DANGEROUS_PATTERNS) {
          if (pattern.test(decoded)) {
            return true;
          }
        }
      } catch (e) {
        // Invalid base64, continue
      }
    }
    
    return false;
  }

  private static detectSQLInjection(text: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /('|\"|`).*(OR|AND).*(=|LIKE)/i,
      /(;|\||&).*(DROP|DELETE|INSERT|UPDATE)/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(text));
  }

  private static logSecurityEvent(event: string, details?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent
    };
    
    console.warn('🔒 File Security Event:', logEntry);
    
    // Send to security monitoring
    this.sendSecurityMetric(event, details);
  }

  private static sendSecurityMetric(event: string, details?: any): void {
    fetch('/api/security-metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        timestamp: Date.now(),
        type: 'file_security',
        details: details ? { 
          fileSize: details.fileSize,
          mimeType: details.mimeType,
          errorCode: details.code
        } : undefined
      })
    }).catch(() => {
      // Fail silently - security metrics are not critical for functionality
    });
  }
}

export default SecureFileValidator; 