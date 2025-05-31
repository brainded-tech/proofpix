/**
 * Enhanced Error Handler for ProofPix Enterprise
 * Provides centralized error handling with logging, reporting, and user feedback
 */

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  fileId?: string;
  operation?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

interface ErrorRecoveryAction {
  type: 'retry' | 'fallback' | 'redirect' | 'notify';
  action: () => Promise<void> | void;
  description: string;
}

class EnhancedErrorHandler {
  private static instance: EnhancedErrorHandler;
  private errorLog: Array<{ error: Error; context: ErrorContext; id: string }> = [];
  private recoveryActions: Map<string, ErrorRecoveryAction[]> = new Map();
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries = 3;
  
  // Private constructor for singleton
  private constructor() {
    this.setupRecoveryActions();
    this.setupGlobalErrorHandlers();
  }
  
  // Get singleton instance
  public static getInstance(): EnhancedErrorHandler {
    if (!EnhancedErrorHandler.instance) {
      EnhancedErrorHandler.instance = new EnhancedErrorHandler();
    }
    return EnhancedErrorHandler.instance;
  }
  
  private setupRecoveryActions() {
    // Chain of custody recovery actions
    this.recoveryActions.set('chain_of_custody_load', [
      {
        type: 'retry',
        action: async () => {
          // Retry loading from localStorage
          const backup = localStorage.getItem('proofpix_custody_backup');
          if (backup) {
            localStorage.setItem('proofpix_custody_logs', backup);
          }
        },
        description: 'Restore from backup'
      },
      {
        type: 'fallback',
        action: () => {
          // Initialize empty custody system
          localStorage.setItem('proofpix_custody_logs', JSON.stringify([]));
        },
        description: 'Initialize empty custody system'
      }
    ]);

    // Multi-signature recovery actions
    this.recoveryActions.set('multi_signature_load', [
      {
        type: 'retry',
        action: async () => {
          // Clear corrupted signature data
          localStorage.removeItem('proofpix_signature_requests');
        },
        description: 'Clear corrupted signature data'
      }
    ]);

    // Compliance monitoring recovery actions
    this.recoveryActions.set('compliance_monitor_load', [
      {
        type: 'fallback',
        action: () => {
          // Use default compliance rules
          console.log('Loading default compliance rules');
        },
        description: 'Load default compliance rules'
      }
    ]);

    // Legal templates recovery actions
    this.recoveryActions.set('legal_templates_load', [
      {
        type: 'retry',
        action: async () => {
          // Retry with cached templates
          const cached = localStorage.getItem('proofpix_templates_cache');
          if (cached) {
            return JSON.parse(cached);
          }
        },
        description: 'Load cached templates'
      }
    ]);
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('unhandled_promise_rejection', new Error(event.reason), {
        metadata: { reason: event.reason }
      });
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError('javascript_error', new Error(event.message), {
        metadata: { 
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });
  }

  async handleError(
    operation: string, 
    error: Error, 
    additionalContext?: Partial<ErrorContext>
  ): Promise<void> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const context: ErrorContext = {
      userId: localStorage.getItem('proofpix_user_id') || 'anonymous',
      sessionId: localStorage.getItem('proofpix_session_id') || 'no_session',
      operation,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      stackTrace: error.stack,
      ...additionalContext
    };

    // Log the error
    this.errorLog.push({ error, context, id: errorId });
    
    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('proofpix_error_log', JSON.stringify(this.errorLog.slice(-10)));
    } catch (e) {
      console.warn('Could not store error log:', e);
    }

    // Console logging with enhanced details
    console.group(`🚨 ProofPix Error: ${operation}`);
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.table(context);
    console.groupEnd();

    // Attempt recovery
    await this.attemptRecovery(operation, errorId);

    // Send to monitoring service (in production)
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(error, context, errorId);
    }
  }

  private async attemptRecovery(operation: string, errorId: string): Promise<void> {
    const recoveryActions = this.recoveryActions.get(operation);
    if (!recoveryActions) return;

    const retryKey = `${operation}_${errorId}`;
    const currentRetries = this.retryAttempts.get(retryKey) || 0;

    if (currentRetries >= this.maxRetries) {
      console.warn(`Max retries exceeded for ${operation}`);
      return;
    }

    for (const action of recoveryActions) {
      try {
        console.log(`Attempting recovery: ${action.description}`);
        await action.action();
        console.log(`Recovery successful: ${action.description}`);
        
        // Reset retry count on successful recovery
        this.retryAttempts.delete(retryKey);
        return;
      } catch (recoveryError) {
        console.error(`Recovery failed: ${action.description}`, recoveryError);
        this.retryAttempts.set(retryKey, currentRetries + 1);
      }
    }
  }

  private sendToMonitoring(error: Error, context: ErrorContext, errorId: string): void {
    // In production, this would send to a monitoring service like Sentry
    const payload = {
      errorId,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: context.timestamp.toISOString(),
      severity: this.determineSeverity(error, context.operation || ''),
      tags: {
        operation: context.operation,
        userId: context.userId,
        browser: this.getBrowserInfo()
      }
    };

    // Mock API call
    console.log('Would send to monitoring service:', payload);
  }

  private determineSeverity(error: Error, operation: string): 'low' | 'medium' | 'high' | 'critical' {
    // Critical operations
    if (operation.includes('custody') || operation.includes('integrity')) {
      return 'critical';
    }
    
    // High priority operations
    if (operation.includes('compliance') || operation.includes('signature')) {
      return 'high';
    }
    
    // Medium priority
    if (operation.includes('template') || operation.includes('export')) {
      return 'medium';
    }
    
    return 'low';
  }

  private getBrowserInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  // Public methods for error reporting and analytics
  getErrorLog(): Array<{ error: Error; context: ErrorContext; id: string }> {
    return [...this.errorLog];
  }

  getErrorStats(): {
    totalErrors: number;
    errorsByOperation: Record<string, number>;
    errorsByHour: Record<string, number>;
    criticalErrors: number;
  } {
    const stats = {
      totalErrors: this.errorLog.length,
      errorsByOperation: {} as Record<string, number>,
      errorsByHour: {} as Record<string, number>,
      criticalErrors: 0
    };

    this.errorLog.forEach(({ error, context }) => {
      // Count by operation
      const op = context.operation || 'unknown';
      stats.errorsByOperation[op] = (stats.errorsByOperation[op] || 0) + 1;
      
      // Count by hour
      const hour = context.timestamp.getHours().toString();
      stats.errorsByHour[hour] = (stats.errorsByHour[hour] || 0) + 1;
      
      // Count critical errors
      if (this.determineSeverity(error, op) === 'critical') {
        stats.criticalErrors++;
      }
    });

    return stats;
  }

  clearErrorLog(): void {
    this.errorLog = [];
    localStorage.removeItem('proofpix_error_log');
  }

  exportErrorLog(): string {
    return JSON.stringify(this.errorLog, null, 2);
  }

  /**
   * Create a user-friendly error message
   */
  public getUserFriendlyMessage(error: any): string {
    // Extract message from error object
    const errorMessage = error?.message || String(error);
    
    // Map known technical errors to user-friendly messages
    if (errorMessage.includes('network') || errorMessage.includes('Network')) {
      return 'There was a problem connecting to the server. Please check your internet connection and try again.';
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      return 'The request took too long to complete. Please try again later.';
    }
    
    if (errorMessage.includes('permission') || errorMessage.includes('Permission')) {
      return 'You do not have permission to perform this action. Please contact your administrator.';
    }
    
    if (errorMessage.includes('authenticate') || errorMessage.includes('Authentication')) {
      return 'Your session has expired. Please log in again.';
    }
    
    // Default generic message
    return 'Something went wrong. Please try again or contact support if the problem persists.';
  }

  // createErrorBoundary(fallbackComponent?: React.ComponentType): React.ComponentType<{ children: React.ReactNode }> {
  //   // Implementation of createErrorBoundary method
  // }
}

// Export singleton instance
export const errorHandler = EnhancedErrorHandler.getInstance();
export default errorHandler; 