/**
 * Enhanced Security Hardening System for ProofPix Enterprise
 * Provides comprehensive security measures, threat detection, and monitoring
 */

interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'input_validation' | 'file_upload' | 'api_access' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: any;
  timestamp: number;
  userAgent?: string;
  ipAddress?: string;
  userId?: string;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  blockedRequests: number;
  suspiciousActivities: number;
  lastThreatDetected: number | null;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export class SecurityHardeningSystem {
  private static instance: SecurityHardeningSystem;
  private securityEvents: SecurityEvent[] = [];
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>();
  private suspiciousIPs = new Set<string>();
  private blockedIPs = new Set<string>();
  private securityMetrics: SecurityMetrics = {
    totalEvents: 0,
    criticalEvents: 0,
    blockedRequests: 0,
    suspiciousActivities: 0,
    lastThreatDetected: null
  };

  private constructor() {
    this.initializeSecurityMonitoring();
    this.setupCSPHeaders();
    this.initializeInputSanitization();
  }

  static getInstance(): SecurityHardeningSystem {
    if (!SecurityHardeningSystem.instance) {
      SecurityHardeningSystem.instance = new SecurityHardeningSystem();
    }
    return SecurityHardeningSystem.instance;
  }

  // Initialize security monitoring
  private initializeSecurityMonitoring(): void {
    // Monitor for suspicious activities
    setInterval(() => {
      this.analyzeSecurityEvents();
    }, 60000); // Every minute

    // Cleanup old events
    setInterval(() => {
      this.cleanupOldEvents();
    }, 300000); // Every 5 minutes

    // Monitor for XSS attempts
    this.setupXSSDetection();
    
    // Monitor for CSRF attempts
    this.setupCSRFProtection();
  }

  // Content Security Policy setup
  private setupCSPHeaders(): void {
    if (typeof document !== 'undefined') {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = [
      "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
        "connect-src 'self' https://api.proofpix.com",
        "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
      ].join('; ');
      
      document.head.appendChild(meta);
    }
  }

  // Advanced input validation and sanitization
  validateAndSanitizeInput(input: any, type: 'string' | 'email' | 'url' | 'filename' | 'json' | 'html'): {
    isValid: boolean;
    sanitized: any;
    threats: string[];
  } {
    const threats: string[] = [];
    let sanitized = input;
    let isValid = true;

    try {
      switch (type) {
        case 'string':
          sanitized = this.sanitizeString(input, threats);
          break;
        case 'email':
          sanitized = this.sanitizeEmail(input, threats);
          isValid = this.isValidEmail(sanitized);
          break;
        case 'url':
          sanitized = this.sanitizeURL(input, threats);
          isValid = this.isValidURL(sanitized);
          break;
        case 'filename':
          sanitized = this.sanitizeFilename(input, threats);
          isValid = this.isValidFilename(sanitized);
          break;
        case 'json':
          sanitized = this.sanitizeJSON(input, threats);
          break;
        case 'html':
          sanitized = this.sanitizeHTML(input, threats);
          break;
      }

      if (threats.length > 0) {
        this.logSecurityEvent({
          type: 'input_validation',
          severity: threats.some(t => t.includes('XSS') || t.includes('injection')) ? 'high' : 'medium',
          message: 'Potentially malicious input detected',
          details: { input, type, threats }
        });
      }

    } catch (error) {
      isValid = false;
      threats.push('Input validation error');
      this.logSecurityEvent({
        type: 'input_validation',
        severity: 'medium',
        message: 'Input validation failed',
        details: { input, type, error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }

    return { isValid, sanitized, threats };
  }

  // String sanitization
  private sanitizeString(input: string, threats: string[]): string {
    if (typeof input !== 'string') {
      threats.push('Invalid input type');
      return '';
    }

    let sanitized = input;

    // Check for XSS patterns
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*>/gi,
      /expression\s*\(/gi,
      /vbscript:/gi
    ];

    xssPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        threats.push('XSS attempt detected');
        sanitized = sanitized.replace(pattern, '');
      }
    });

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
      new RegExp("('|\\\\|;|--|\\||\\*|%|\\+)", 'gi')
    ];

    sqlPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        threats.push('SQL injection attempt detected');
      }
    });

    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>'"&]/g, (match) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    });

    return sanitized;
  }

  // Email sanitization
  private sanitizeEmail(input: string, threats: string[]): string {
    const sanitized = this.sanitizeString(input, threats);
    
    // Additional email-specific checks
    if (sanitized.includes('..')) {
      threats.push('Invalid email format');
    }
    
    return sanitized.toLowerCase().trim();
  }

  // URL sanitization
  private sanitizeURL(input: string, threats: string[]): string {
    const sanitized = input.trim();
    
    // Check for dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    dangerousProtocols.forEach(protocol => {
      if (sanitized.toLowerCase().startsWith(protocol)) {
        threats.push(`Dangerous protocol detected: ${protocol}`);
      }
    });

    return sanitized;
  }

  // Filename sanitization
  private sanitizeFilename(input: string, threats: string[]): string {
    let sanitized = input.trim();
    
    // Remove path traversal attempts
    if (sanitized.includes('../') || sanitized.includes('..\\')) {
      threats.push('Path traversal attempt detected');
      sanitized = sanitized.replace(/\.\.[\/\\]/g, '');
    }

    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>:"|?*]/g, '');
    
    // Check for executable extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.scr', '.vbs', '.js', '.jar'];
    dangerousExtensions.forEach(ext => {
      if (sanitized.toLowerCase().endsWith(ext)) {
        threats.push(`Potentially dangerous file extension: ${ext}`);
      }
    });

    return sanitized;
  }

  // JSON sanitization
  private sanitizeJSON(input: any, threats: string[]): any {
    try {
      const jsonString = typeof input === 'string' ? input : JSON.stringify(input);
      const sanitizedString = this.sanitizeString(jsonString, threats);
      return JSON.parse(sanitizedString);
    } catch (error) {
      threats.push('Invalid JSON format');
      return {};
    }
  }

  // HTML sanitization
  private sanitizeHTML(input: string, threats: string[]): string {
    const sanitized = this.sanitizeString(input, threats);
    
    // Additional HTML-specific sanitization
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const tagPattern = /<(\/?)([\w]+)([^>]*)>/g;
    
    return sanitized.replace(tagPattern, (match, closing, tagName, attributes) => {
      if (!allowedTags.includes(tagName.toLowerCase())) {
        threats.push(`Disallowed HTML tag: ${tagName}`);
        return '';
      }
      
      // Remove all attributes for security
      return `<${closing}${tagName}>`;
    });
  }

  // Validation methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  private isValidURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  private isValidFilename(filename: string): boolean {
    return filename.length > 0 && 
           filename.length <= 255 && 
           !filename.includes('/') && 
           !filename.includes('\\') &&
           filename !== '.' &&
           filename !== '..';
  }

  // Rate limiting
  checkRateLimit(identifier: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const key = `rate_limit_${identifier}`;
    const existing = this.rateLimitStore.get(key);

    if (!existing || now > existing.resetTime) {
      // Reset or create new window
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      };
    }

    if (existing.count >= config.maxRequests) {
      this.logSecurityEvent({
        type: 'api_access',
        severity: 'medium',
        message: 'Rate limit exceeded',
        details: { identifier, config, currentCount: existing.count }
      });

      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.resetTime
      };
    }

    existing.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - existing.count,
      resetTime: existing.resetTime
    };
  }

  // File upload security
  validateFileUpload(file: File): {
    isValid: boolean;
    threats: string[];
    sanitizedName: string;
  } {
    const threats: string[] = [];
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      threats.push('File size exceeds maximum allowed');
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff'
    ];

    if (!allowedTypes.includes(file.type)) {
      threats.push(`Disallowed file type: ${file.type}`);
    }

    // Sanitize filename
    const { sanitized: sanitizedName, threats: nameThreats } = this.validateAndSanitizeInput(
      file.name,
      'filename'
    );
    threats.push(...nameThreats);

    // Check for double extensions
    if (sanitizedName.split('.').length > 2) {
      threats.push('Multiple file extensions detected');
    }

    if (threats.length > 0) {
      this.logSecurityEvent({
        type: 'file_upload',
        severity: 'medium',
        message: 'Potentially malicious file upload attempt',
        details: {
          originalName: file.name,
          sanitizedName,
          fileType: file.type,
          fileSize: file.size,
          threats
        }
      });
    }

    return {
      isValid: threats.length === 0,
      threats,
      sanitizedName
    };
  }

  // XSS Detection
  private setupXSSDetection(): void {
    if (typeof window !== 'undefined') {
      // Monitor for DOM manipulation attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
                this.checkElementForXSS(element);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  }

  private checkElementForXSS(element: Element): void {
    // Check for suspicious attributes
    const suspiciousAttributes = ['onload', 'onerror', 'onclick', 'onmouseover'];
    suspiciousAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          message: 'Suspicious DOM element detected',
          details: {
            tagName: element.tagName,
            attribute: attr,
            value: element.getAttribute(attr)
          }
        });
      }
    });

    // Check for script tags
    if (element.tagName.toLowerCase() === 'script') {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'critical',
        message: 'Script tag injection detected',
        details: {
          innerHTML: element.innerHTML,
          src: element.getAttribute('src')
        }
      });
    }
  }

  // CSRF Protection
  private setupCSRFProtection(): void {
    if (typeof window !== 'undefined') {
      // Generate CSRF token
      const csrfToken = this.generateCSRFToken();
      sessionStorage.setItem('csrf_token', csrfToken);

      // Add token to all forms
      document.addEventListener('DOMContentLoaded', () => {
        this.addCSRFTokenToForms();
      });
    }
  }

  private generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private addCSRFTokenToForms(): void {
    const forms = document.querySelectorAll('form');
    const csrfToken = sessionStorage.getItem('csrf_token');
    
    if (csrfToken) {
      forms.forEach(form => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'csrf_token';
        input.value = csrfToken;
        form.appendChild(input);
      });
    }
  }

  // Security event logging
  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      ipAddress: this.getClientIP()
    };

    this.securityEvents.push(fullEvent);
    this.securityMetrics.totalEvents++;

    if (event.severity === 'critical') {
      this.securityMetrics.criticalEvents++;
      this.securityMetrics.lastThreatDetected = Date.now();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔒 Security Event:', fullEvent);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendSecurityEventToMonitoring(fullEvent);
    }

    // Auto-block on critical events
    if (event.severity === 'critical' && fullEvent.ipAddress) {
      this.blockIP(fullEvent.ipAddress);
    }
  }

  // IP blocking and monitoring
  private blockIP(ipAddress: string): void {
    this.blockedIPs.add(ipAddress);
    this.securityMetrics.blockedRequests++;
    
    console.warn(`🚫 IP Address blocked: ${ipAddress}`);
  }

  private getClientIP(): string | undefined {
    // In a real application, this would be provided by the server
    return 'client_ip_placeholder';
  }

  // Security analysis
  private analyzeSecurityEvents(): void {
    const recentEvents = this.securityEvents.filter(
      event => Date.now() - event.timestamp < 300000 // Last 5 minutes
    );

    if (recentEvents.length === 0) return;

    // Analyze patterns
    const eventsByType = new Map<string, number>();
    const eventsByIP = new Map<string, number>();

    recentEvents.forEach(event => {
      eventsByType.set(event.type, (eventsByType.get(event.type) || 0) + 1);
      if (event.ipAddress) {
        eventsByIP.set(event.ipAddress, (eventsByIP.get(event.ipAddress) || 0) + 1);
      }
    });

    // Check for suspicious patterns
    eventsByIP.forEach((count, ip) => {
      if (count > 10) { // More than 10 events from same IP in 5 minutes
        this.suspiciousIPs.add(ip);
        this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          message: 'Suspicious activity pattern detected',
          details: { ipAddress: ip, eventCount: count, timeWindow: '5 minutes' }
        });
      }
    });

    console.log('🔍 Security Analysis:', {
      recentEvents: recentEvents.length,
      eventsByType: Object.fromEntries(eventsByType),
      suspiciousIPs: Array.from(this.suspiciousIPs),
      blockedIPs: Array.from(this.blockedIPs)
    });
  }

  // Cleanup old events
  private cleanupOldEvents(): void {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours
    this.securityEvents = this.securityEvents.filter(event => event.timestamp > cutoff);
  }

  // Send to monitoring service
  private sendSecurityEventToMonitoring(event: SecurityEvent): void {
    fetch('/api/security-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(() => {
      // Fail silently for monitoring
    });
  }

  // Initialize input sanitization
  private initializeInputSanitization(): void {
    if (typeof window !== 'undefined') {
      // Intercept form submissions
      document.addEventListener('submit', (event) => {
        const form = event.target as HTMLFormElement;
        this.sanitizeFormData(form);
      });

      // Intercept input events
      document.addEventListener('input', (event) => {
        const input = event.target as HTMLInputElement;
        if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
          this.validateInputInRealTime(input);
        }
      });
    }
  }

  private sanitizeFormData(form: HTMLFormElement): void {
    const formData = new FormData(form);
    let hasThreats = false;

    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        const { threats } = this.validateAndSanitizeInput(value, 'string');
        if (threats.length > 0) {
          hasThreats = true;
        }
      }
    });

    if (hasThreats) {
      this.logSecurityEvent({
        type: 'input_validation',
        severity: 'medium',
        message: 'Form submission with potentially malicious data',
        details: { formAction: form.action, formMethod: form.method }
      });
    }
  }

  private validateInputInRealTime(input: HTMLInputElement | HTMLTextAreaElement): void {
    const { threats } = this.validateAndSanitizeInput(input.value, 'string');
    
    if (threats.length > 0) {
      input.style.borderColor = '#ef4444';
      input.title = 'Potentially unsafe input detected';
    } else {
      input.style.borderColor = '';
      input.title = '';
    }
  }

  // Public API methods
  getSecurityMetrics(): SecurityMetrics {
    return { ...this.securityMetrics };
  }

  getRecentSecurityEvents(limit: number = 50): SecurityEvent[] {
    return this.securityEvents
      .slice(-limit)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  isIPBlocked(ipAddress: string): boolean {
    return this.blockedIPs.has(ipAddress);
  }

  unblockIP(ipAddress: string): void {
    this.blockedIPs.delete(ipAddress);
    this.suspiciousIPs.delete(ipAddress);
  }

  clearSecurityEvents(): void {
    this.securityEvents = [];
    this.securityMetrics = {
      totalEvents: 0,
      criticalEvents: 0,
      blockedRequests: 0,
      suspiciousActivities: 0,
      lastThreatDetected: null
    };
  }
}

// Export singleton instance
export const securityHardening = SecurityHardeningSystem.getInstance();

// Security middleware for API requests
export const securityMiddleware = {
  validateRequest: (request: any) => {
    const security = SecurityHardeningSystem.getInstance();
    
    // Rate limiting
    const rateLimitResult = security.checkRateLimit(
      request.ip || 'unknown',
      { windowMs: 60000, maxRequests: 100 } // 100 requests per minute
    );

    if (!rateLimitResult.allowed) {
      throw new Error('Rate limit exceeded');
    }

    // Input validation
    if (request.body) {
      const { isValid, threats } = security.validateAndSanitizeInput(
        request.body,
        'json'
      );

      if (!isValid || threats.length > 0) {
        throw new Error('Invalid or potentially malicious input');
      }
    }

    return true;
  }
};

// Initialize security hardening
if (typeof window !== 'undefined') {
  console.log('🔒 Security Hardening System initialized');
} 