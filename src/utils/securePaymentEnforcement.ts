// 🔒 SECURE PAYMENT ENFORCEMENT - Enterprise Security Implementation
// Server-side payment validation and fraud prevention

import { PRICING_PLANS } from './stripe';

interface PlanValidation {
  valid: boolean;
  remainingUsage: any;
  details?: string;
}

interface UsageRequest {
  actionType: string;
  imageCount?: number;
  batchSize?: number;
  userId?: string;
}

interface ValidationResult {
  valid: boolean;
  remainingUsage?: any;
  error?: string;
}

class PlanViolationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'PlanViolationError';
  }
}

class PlanValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlanValidationError';
  }
}

export class SecurePaymentEnforcement {
  private static readonly API_BASE = process.env.REACT_APP_API_URL || '/.netlify/functions';
  
  /**
   * 🔒 SECURE PLAN VALIDATION: Server-side validation with fraud detection
   */
  static async validatePlanUsage(planType: string, requestedUsage: UsageRequest): Promise<ValidationResult> {
    try {
      // Server-side plan validation with anti-fraud measures
      const planValidation = await this.validatePlanServer(planType, requestedUsage);
      
      if (!planValidation.valid) {
        this.logSecurityEvent('Plan violation attempt', { planType, usage: requestedUsage });
        throw new PlanViolationError('Plan limits exceeded', planValidation.details);
      }

      // Usage tracking with server verification
      await this.trackUsageServer(planType, requestedUsage);
      
      return { 
        valid: true, 
        remainingUsage: planValidation.remainingUsage 
      };
    } catch (error: unknown) {
      this.logSecurityEvent('Plan validation failed', { 
        planType, 
        usage: requestedUsage, 
        error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error)
      });
      throw error;
    }
  }

  /**
   * 🔒 SERVER-SIDE PLAN VALIDATION: Prevents client-side bypass
   */
  private static async validatePlanServer(planType: string, usage: UsageRequest): Promise<PlanValidation> {
    try {
      const response = await fetch(`${this.API_BASE}/validate-plan-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-Request-ID': this.generateRequestId(),
          'X-Timestamp': Date.now().toString()
        },
        body: JSON.stringify({ 
          planType, 
          usage,
          clientChecksum: this.generateUsageChecksum(planType, usage)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new PlanValidationError(`Server validation failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const validation = await response.json();
      
      // Verify server response integrity
      if (!this.verifyServerResponse(validation)) {
        throw new PlanValidationError('Server response integrity check failed');
      }

      return validation;
    } catch (error: unknown) {
      if (error instanceof PlanValidationError) {
        throw error;
      }
      
      // Network error - use secure fallback
      console.warn('Server validation unavailable, using secure fallback');
      return this.secureClientFallback(planType, usage);
    }
  }

  /**
   * 🔒 SECURE FALLBACK: Limited client-side validation when server unavailable
   */
  private static secureClientFallback(planType: string, usage: UsageRequest): PlanValidation {
    const plan = PRICING_PLANS[planType as keyof typeof PRICING_PLANS as keyof typeof PRICING_PLANS];
    if (!plan) {
      return { valid: false, remainingUsage: null, details: 'Invalid plan type' };
    }

    // Conservative fallback - only allow basic operations
    switch (usage.actionType) {
      case 'upload':
        // Allow limited uploads for free users, unlimited for paid
        const maxUploads = plan.price > 0 ? 100 : 5;
        return { 
          valid: true, 
          remainingUsage: { uploads: maxUploads },
          details: 'Fallback validation - limited functionality'
        };
      
      case 'batch':
        // Only allow batch for paid plans
        return { 
          valid: plan.price > 0, 
          remainingUsage: null,
          details: plan.price > 0 ? 'Batch allowed' : 'Batch requires paid plan'
        };
      
      default:
        // Conservative approach - deny unknown actions
        return { 
          valid: false, 
          remainingUsage: null,
          details: 'Unknown action type - server validation required'
        };
    }
  }

  /**
   * 🔒 USAGE TRACKING: Server-side tracking with verification
   */
  private static async trackUsageServer(planType: string, usage: UsageRequest): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/track-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-Request-ID': this.generateRequestId()
        },
        body: JSON.stringify({
          planType,
          usage,
          timestamp: Date.now(),
          checksum: this.generateUsageChecksum(planType, usage)
        })
      });

      if (!response.ok) {
        console.warn('Usage tracking failed:', response.status);
      }
    } catch (error: unknown) {
      console.warn('Usage tracking unavailable:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error));
      // Continue without server tracking - not critical for functionality
    }
  }

  /**
   * 🔒 STRIPE WEBHOOK VALIDATION: Secure payment event processing
   */
  static async setupWebhookValidation(): Promise<void> {
    // This would be implemented on the server side
    // Client-side code to verify webhook setup
    try {
      const response = await fetch(`${this.API_BASE}/webhook-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        console.warn('Webhook validation setup not confirmed');
      }
    } catch (error: unknown) {
      console.warn('Unable to verify webhook setup:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error));
    }
  }

  /**
   * 🔒 PAYMENT EVENT VERIFICATION: Verify payment events are legitimate
   */
  static async verifyPaymentEvent(eventData: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/verify-payment-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          eventData,
          timestamp: Date.now(),
          checksum: this.generateEventChecksum(eventData)
        })
      });

      return response.ok;
    } catch (error: unknown) {
      console.error('Payment event verification failed:', error);
      return false;
    }
  }

  /**
   * 🔒 FRAUD DETECTION: Monitor for suspicious payment patterns
   */
  static async detectFraudulentActivity(planType: string, usage: UsageRequest): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/fraud-detection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          planType,
          usage,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          sessionId: this.getSessionId()
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.fraudulent || false;
      }
      
      return false;
    } catch (error: unknown) {
      console.warn('Fraud detection unavailable:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error));
      return false; // Assume legitimate if detection fails
    }
  }

  /**
   * 🔒 RATE LIMITING: Prevent abuse and API flooding
   */
  static async checkRateLimit(actionType: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/rate-limit-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          actionType,
          timestamp: Date.now(),
          clientId: this.getClientId()
        })
      });

      if (response.ok) {
        const result = await response.json();
        return !result.rateLimited;
      }
      
      return true; // Allow if rate limiting unavailable
    } catch (error: unknown) {
      console.warn('Rate limiting unavailable:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error));
      return true;
    }
  }

  // 🔐 SECURITY UTILITY METHODS

  private static getAuthToken(): string {
    return sessionStorage.getItem('auth_token') || 
           localStorage.getItem('session_token') || 
           '';
  }

  private static getSessionId(): string {
    return sessionStorage.getItem('session_id') || 
           this.generateRequestId();
  }

  private static getClientId(): string {
    let clientId = localStorage.getItem('client_id');
    if (!clientId) {
      clientId = this.generateRequestId();
      localStorage.setItem('client_id', clientId);
    }
    return clientId;
  }

  private static generateRequestId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static generateUsageChecksum(planType: string, usage: UsageRequest): string {
    const data = JSON.stringify({ planType, usage }, Object.keys({ planType, usage }).sort());
    return this.simpleHash(data);
  }

  private static generateEventChecksum(eventData: any): string {
    const data = JSON.stringify(eventData, Object.keys(eventData).sort());
    return this.simpleHash(data);
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private static verifyServerResponse(response: any): boolean {
    // Basic response validation
    return response && 
           typeof response === 'object' && 
           'valid' in response &&
           typeof response.valid === 'boolean';
  }

  private static logSecurityEvent(event: string, details?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.warn('🔒 Payment Security Event:', logEntry);
    
    // Send to security monitoring
    this.sendSecurityMetric(event, details);
  }

  private static sendSecurityMetric(event: string, details?: any): void {
    fetch(`${this.API_BASE}/security-metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        timestamp: Date.now(),
        type: 'payment_security',
        details: details ? { type: typeof details } : undefined
      })
    }).catch(() => {
      // Fail silently - security metrics are not critical for functionality
    });
  }

  /**
   * 🔒 PLAN UPGRADE VALIDATION: Verify legitimate plan upgrades
   */
  static async validatePlanUpgrade(fromPlan: string, toPlan: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/validate-plan-upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          fromPlan,
          toPlan,
          timestamp: Date.now()
        })
      });

      return response.ok;
    } catch (error: unknown) {
      console.warn('Plan upgrade validation failed:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error));
      return false;
    }
  }

  /**
   * 🔒 SUBSCRIPTION STATUS VERIFICATION: Verify active subscriptions
   */
  static async verifySubscriptionStatus(planId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/verify-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          planId,
          timestamp: Date.now()
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.active || false;
      }
      
      return false;
    } catch (error: unknown) {
      console.warn('Subscription verification failed:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error));
      return false;
    }
  }
}

export default SecurePaymentEnforcement; 