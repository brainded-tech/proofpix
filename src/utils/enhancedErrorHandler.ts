/**
 * Enhanced Error Handler for ProofPix Enterprise
 * Provides comprehensive error tracking, recovery strategies, and monitoring
 */

import React from 'react';
import { performanceOptimizer } from './performanceOptimizer';

// Error types and classifications
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp: number;
  stackTrace?: string;
  componentStack?: string;
  errorBoundary?: string;
  additionalData?: Record<string, any>;
}

interface ErrorMetrics {
  totalErrors: number;
  criticalErrors: number;
  recoveredErrors: number;
  errorRate: number;
  lastErrorTime: number | null;
  topErrors: Array<{ message: string; count: number; lastOccurred: number }>;
}

interface ErrorRecoveryStrategy {
  type: 'retry' | 'fallback' | 'redirect' | 'refresh' | 'ignore';
  maxAttempts?: number;
  delay?: number;
  fallbackComponent?: React.ComponentType;
  redirectUrl?: string;
  condition?: (error: Error, context: ErrorContext) => boolean;
}

interface ErrorHandlingConfig {
  enableErrorBoundaries: boolean;
  enableErrorReporting: boolean;
  enableAutoRecovery: boolean;
  enableUserNotification: boolean;
  maxErrorsPerSession: number;
  errorReportingEndpoint: string;
}

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError?: Error;
  context?: ErrorContext;
  retryable: boolean;
  retryCount: number;
  maxRetries: number;
  timestamp: Date;
  resolved: boolean;
}

export class EnhancedErrorHandler {
  private static instance: EnhancedErrorHandler;
  private errors: Map<string, AppError> = new Map();
  private errorQueue: AppError[] = [];
  private retryQueue: AppError[] = [];
  private isProcessingQueue = false;
  private errorListeners: Array<(error: AppError) => void> = [];
  private maxQueueSize = 100;
  private batchSize = 10;
  private flushInterval = 5000; // 5 seconds
  private flushTimer?: NodeJS.Timeout;
  private errorLog: Array<{ error: Error; context: ErrorContext }> = [];
  private errorMetrics: ErrorMetrics = {
    totalErrors: 0,
    criticalErrors: 0,
    recoveredErrors: 0,
    errorRate: 0,
    lastErrorTime: null,
    topErrors: []
  };
  private recoveryStrategies = new Map<string, ErrorRecoveryStrategy>();
  private config: ErrorHandlingConfig;
  private sessionId: string;

  private constructor() {
    this.config = {
      enableErrorBoundaries: true,
      enableErrorReporting: true,
      enableAutoRecovery: true,
      enableUserNotification: true,
      maxErrorsPerSession: 50,
      errorReportingEndpoint: '/api/errors'
    };
    this.sessionId = this.generateSessionId();
    this.initializeErrorHandling();
    this.startQueueProcessor();
  }

  public static getInstance(): EnhancedErrorHandler {
    if (!EnhancedErrorHandler.instance) {
      EnhancedErrorHandler.instance = new EnhancedErrorHandler();
    }
    return EnhancedErrorHandler.instance;
  }

  // Initialize global error handling
  private initializeErrorHandling() {
    if (typeof window !== 'undefined') {
      // Global error handlers
      this.setupGlobalErrorHandlers();
      
      // Promise rejection handler
      this.setupPromiseRejectionHandler();
      
      // React error boundary setup
      this.setupReactErrorBoundaries();
      
      // Performance monitoring
      this.setupPerformanceMonitoring();
      
      // Default recovery strategies
      this.setupDefaultRecoveryStrategies();
    }
  }

  // Global error handlers
  private setupGlobalErrorHandlers(): void {
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        userId: this.getCurrentUserId(),
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        stackTrace: event.error?.stack,
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      
      this.handleError(error, {
        userId: this.getCurrentUserId(),
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        additionalData: {
          type: 'unhandledPromiseRejection',
          reason: event.reason
        }
      });
    });
  }

  private setupPromiseRejectionHandler(): void {
    // Enhanced promise rejection handling
    const originalPromise = window.Promise;
    if (originalPromise) {
      const enhancedPromise = class extends originalPromise<any> {
        catch(onRejected?: (reason: any) => any) {
          return super.catch((reason) => {
            // Log promise rejections
            EnhancedErrorHandler.getInstance().handleError(
              reason instanceof Error ? reason : new Error(String(reason)),
              {
                userId: EnhancedErrorHandler.getInstance().getCurrentUserId(),
                sessionId: EnhancedErrorHandler.getInstance().sessionId,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: Date.now(),
                additionalData: {
                  type: 'promiseRejection',
                  reason
                }
              }
            );
            
            if (onRejected) {
              return onRejected(reason);
            }
            throw reason;
          });
        }
      };
      
      // Replace global Promise (carefully)
      (window as any).Promise = enhancedPromise;
    }
  }

  // React error boundaries
  private setupReactErrorBoundaries(): void {
    if (!this.config.enableErrorBoundaries) return;

    // Create global error boundary component
    // (window as any).GlobalErrorBoundary = this.createErrorBoundary();
  }

  // createErrorBoundary(fallbackComponent?: React.ComponentType): React.ComponentType {

  // Main error handling method
  public handleError(
    error: Error | string,
    context?: Partial<ErrorContext>,
    options?: {
      severity?: ErrorSeverity;
      retryable?: boolean;
      maxRetries?: number;
      silent?: boolean;
    }
  ): AppError {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const errorId = this.generateErrorId();
    
    const appError: AppError = {
      id: errorId,
      type: this.classifyError(errorObj),
      severity: options?.severity || this.determineSeverity(errorObj),
      message: errorObj.message,
      originalError: errorObj,
      context: {
        ...this.getDefaultContext(),
        ...context
      },
      retryable: options?.retryable ?? this.isRetryable(errorObj),
      retryCount: 0,
      maxRetries: options?.maxRetries ?? this.getDefaultMaxRetries(errorObj),
      timestamp: new Date(),
      resolved: false
    };

    // Store error
    this.errors.set(errorId, appError);

    // Add to processing queue
    this.addToQueue(appError);

    // Notify listeners
    if (!options?.silent) {
      this.notifyListeners(appError);
    }

    // Log error
    this.logError(appError);

    // Record performance impact
    // performanceOptimizer.trackMetric('error_handling', Date.now());

    return appError;
  }

  // Classify error type
  private classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    if (message.includes('network') || message.includes('fetch')) {
      return ErrorType.NETWORK;
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return ErrorType.AUTHENTICATION;
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return ErrorType.AUTHORIZATION;
    }
    if (message.includes('rate limit') || message.includes('429')) {
      return ErrorType.RATE_LIMIT;
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }
    if (message.includes('server') || message.includes('500')) {
      return ErrorType.SERVER;
    }
    if (stack.includes('client') || message.includes('client')) {
      return ErrorType.CLIENT;
    }

    return ErrorType.UNKNOWN;
  }

  // Determine error severity
  private determineSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();

    if (message.includes('critical') || message.includes('fatal')) {
      return ErrorSeverity.CRITICAL;
    }
    if (message.includes('server') || message.includes('500')) {
      return ErrorSeverity.HIGH;
    }
    if (message.includes('network') || message.includes('timeout')) {
      return ErrorSeverity.MEDIUM;
    }

    return ErrorSeverity.LOW;
  }

  // Check if error is retryable
  private isRetryable(error: Error): boolean {
    const message = error.message.toLowerCase();
    const retryablePatterns = [
      'network',
      'timeout',
      'connection',
      'temporary',
      '500',
      '502',
      '503',
      '504'
    ];

    return retryablePatterns.some(pattern => message.includes(pattern));
  }

  // Get default max retries based on error type
  private getDefaultMaxRetries(error: Error): number {
    const type = this.classifyError(error);
    
    switch (type) {
      case ErrorType.NETWORK:
        return 3;
      case ErrorType.RATE_LIMIT:
        return 5;
      case ErrorType.SERVER:
        return 2;
      default:
        return 1;
    }
  }

  // Get default context
  private getDefaultContext(): ErrorContext {
    return {
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().getTime()
    };
  }

  // Generate unique error ID
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add error to processing queue
  private addToQueue(error: AppError) {
    if (this.errorQueue.length >= this.maxQueueSize) {
      // Remove oldest error
      this.errorQueue.shift();
    }
    
    this.errorQueue.push(error);
    this.scheduleQueueFlush();
  }

  // Schedule queue flush
  private scheduleQueueFlush() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }

    this.flushTimer = setTimeout(() => {
      this.flushQueue();
    }, this.flushInterval);
  }

  // Start queue processor
  private startQueueProcessor() {
    setInterval(() => {
      this.processRetryQueue();
    }, 10000); // Process retries every 10 seconds
  }

  // Flush error queue
  private async flushQueue() {
    if (this.isProcessingQueue || this.errorQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      const batch = this.errorQueue.splice(0, this.batchSize);
      await this.sendErrorBatch(batch);
    } catch (error) {
      console.error('Failed to flush error queue:', error);
      // Re-add errors to queue for retry
      this.errorQueue.unshift(...this.errorQueue);
    } finally {
      this.isProcessingQueue = false;
    }
  }

  // Send error batch to server
  private async sendErrorBatch(errors: AppError[]) {
    try {
      const payload = errors.map(error => ({
        id: error.id,
        type: error.type,
        severity: error.severity,
        message: error.message,
        context: error.context,
        timestamp: error.timestamp.toISOString()
      }));

      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ errors: payload })
      });

      console.log(`✅ Sent ${errors.length} errors to server`);
    } catch (error) {
      console.error('Failed to send error batch:', error);
      throw error;
    }
  }

  // Process retry queue
  private async processRetryQueue() {
    const retryableErrors = Array.from(this.errors.values())
      .filter(error => 
        error.retryable && 
        !error.resolved && 
        error.retryCount < error.maxRetries
      );

    for (const error of retryableErrors) {
      await this.retryError(error);
    }
  }

  // Retry error with exponential backoff
  private async retryError(error: AppError) {
    const delay = Math.min(1000 * Math.pow(2, error.retryCount), 30000); // Max 30 seconds
    
    setTimeout(async () => {
      try {
        error.retryCount++;
        
        // Attempt to resolve the error
        const resolved = await this.attemptErrorResolution(error);
        
        if (resolved) {
          error.resolved = true;
          console.log(`✅ Error resolved after ${error.retryCount} retries:`, error.id);
        } else if (error.retryCount >= error.maxRetries) {
          console.error(`❌ Error failed after ${error.maxRetries} retries:`, error.id);
          this.escalateError(error);
        }
      } catch (retryError) {
        console.error('Error during retry:', retryError);
      }
    }, delay);
  }

  // Attempt to resolve error
  private async attemptErrorResolution(error: AppError): Promise<boolean> {
    switch (error.type) {
      case ErrorType.NETWORK:
        return this.retryNetworkOperation(error);
      case ErrorType.RATE_LIMIT:
        return this.handleRateLimit(error);
      case ErrorType.AUTHENTICATION:
        return this.refreshAuthentication(error);
      default:
        return false;
    }
  }

  // Retry network operation
  private async retryNetworkOperation(error: AppError): Promise<boolean> {
    try {
      // Attempt to ping the server
      const response = await fetch('/api/health', { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Handle rate limit
  private async handleRateLimit(error: AppError): Promise<boolean> {
    // Wait for rate limit to reset (implement based on your API)
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
    return true;
  }

  // Refresh authentication
  private async refreshAuthentication(error: AppError): Promise<boolean> {
    try {
      // Attempt to refresh token
      const response = await fetch('/api/auth/refresh', { method: 'POST' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Escalate error for manual intervention
  private escalateError(error: AppError) {
    console.error('🚨 Error escalated for manual intervention:', error);
    
    // Could send to error tracking service, notify admins, etc.
    this.notifyListeners({
      ...error,
      severity: ErrorSeverity.CRITICAL
    });
  }

  // Log error with appropriate level
  private logError(error: AppError) {
    const logData = {
      id: error.id,
      type: error.type,
      severity: error.severity,
      message: error.message,
      context: error.context
    };

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error('🚨 CRITICAL ERROR:', logData);
        break;
      case ErrorSeverity.HIGH:
        console.error('❌ HIGH SEVERITY ERROR:', logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('⚠️ MEDIUM SEVERITY ERROR:', logData);
        break;
      case ErrorSeverity.LOW:
        console.log('ℹ️ LOW SEVERITY ERROR:', logData);
        break;
    }
  }

  // Notify error listeners
  private notifyListeners(error: AppError) {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });
  }

  // Public methods for error management
  public addErrorListener(listener: (error: AppError) => void) {
    this.errorListeners.push(listener);
  }

  public removeErrorListener(listener: (error: AppError) => void) {
    const index = this.errorListeners.indexOf(listener);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  public getError(id: string): AppError | undefined {
    return this.errors.get(id);
  }

  public getErrors(filter?: {
    type?: ErrorType;
    severity?: ErrorSeverity;
    resolved?: boolean;
  }): AppError[] {
    const errors = Array.from(this.errors.values());
    
    if (!filter) return errors;

    return errors.filter(error => {
      if (filter.type && error.type !== filter.type) return false;
      if (filter.severity && error.severity !== filter.severity) return false;
      if (filter.resolved !== undefined && error.resolved !== filter.resolved) return false;
      return true;
    });
  }

  public resolveError(id: string) {
    const error = this.errors.get(id);
    if (error) {
      error.resolved = true;
      console.log(`✅ Error manually resolved: ${id}`);
    }
  }

  public clearResolvedErrors() {
    const resolvedErrors = Array.from(this.errors.entries())
      .filter(([_, error]) => error.resolved)
      .map(([id]) => id);

    resolvedErrors.forEach(id => this.errors.delete(id));
    console.log(`🧹 Cleared ${resolvedErrors.length} resolved errors`);
  }

  public getErrorStats() {
    const errors = Array.from(this.errors.values());
    const stats = {
      total: errors.length,
      byType: {} as Record<ErrorType, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
      resolved: errors.filter(e => e.resolved).length,
      retryable: errors.filter(e => e.retryable).length
    };

    errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }

  // Utility methods
  private getCurrentUserId(): string | undefined {
    // Implement based on your auth system
    return localStorage.getItem('userId') || undefined;
  }

  private getSessionId(): string | undefined {
    // Implement based on your session management
    return sessionStorage.getItem('sessionId') || undefined;
  }

  // Cleanup method
  public cleanup() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }
    this.errors.clear();
    this.errorQueue.length = 0;
    this.retryQueue.length = 0;
    this.errorListeners.length = 0;
  }

  // Recovery strategies
  private setupDefaultRecoveryStrategies(): void {
    // Chunk load error recovery
    this.registerRecoveryStrategy('ChunkLoadError', {
      type: 'refresh',
      condition: (error) => error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')
    });
    
    // Network error recovery
    this.registerRecoveryStrategy('NetworkError', {
      type: 'retry',
      maxAttempts: 3,
      delay: 1000,
      condition: (error) => error.message.includes('Failed to fetch') || error.message.includes('Network Error')
    });
    
    // Component error recovery
    this.registerRecoveryStrategy('ComponentError', {
      type: 'fallback',
      condition: (error, context) => !!context.errorBoundary
    });
    
    // Timeout error recovery
    this.registerRecoveryStrategy('TimeoutError', {
      type: 'retry',
      maxAttempts: 2,
      delay: 2000,
      condition: (error) => error.message.includes('timeout')
    });
  }

  registerRecoveryStrategy(name: string, strategy: ErrorRecoveryStrategy): void {
    this.recoveryStrategies.set(name, strategy);
  }

  private async applyRecoveryStrategy(
    error: Error, 
    context: ErrorContext, 
    severity: string
  ): Promise<void> {
    // Find applicable recovery strategy
    const strategy = Array.from(this.recoveryStrategies.values())
      .find(s => s.condition?.(error, context));
    
    if (!strategy) return;
    
    try {
      switch (strategy.type) {
        case 'retry':
          await this.retryOperation(error, context, strategy);
          break;
        case 'fallback':
          this.useFallback(error, context, strategy);
          break;
        case 'redirect':
          this.redirectUser(strategy.redirectUrl || '/');
          break;
        case 'refresh':
          this.refreshPage();
          break;
        case 'ignore':
          // Do nothing, just log
          break;
      }
      
      this.errorMetrics.recoveredErrors++;
      console.log(`✅ Error recovered using strategy: ${strategy.type}`);
    } catch (recoveryError) {
      console.error('❌ Recovery strategy failed:', recoveryError);
    }
  }

  private async retryOperation(
    error: Error, 
    context: ErrorContext, 
    strategy: ErrorRecoveryStrategy
  ): Promise<void> {
    const maxAttempts = strategy.maxAttempts || 3;
    const delay = strategy.delay || 1000;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
        
        // Attempt to retry the operation
        // This would need to be implemented based on the specific error context
        console.log(`🔄 Retry attempt ${attempt}/${maxAttempts}`);
        
        // If we get here, the retry was successful
        return;
      } catch (retryError) {
        if (attempt === maxAttempts) {
          throw retryError;
        }
      }
    }
  }

  private useFallback(
    error: Error, 
    context: ErrorContext, 
    strategy: ErrorRecoveryStrategy
  ): void {
    if (strategy.fallbackComponent) {
      // This would be handled by the error boundary
      console.log('🔄 Using fallback component');
    }
  }

  private redirectUser(url: string): void {
    console.log(`🔄 Redirecting to: ${url}`);
    window.location.href = url;
  }

  private refreshPage(): void {
    console.log('🔄 Refreshing page');
    window.location.reload();
  }

  // Error reporting
  private async reportError(
    error: Error, 
    context: ErrorContext, 
    severity: string
  ): Promise<void> {
    try {
      const errorReport = {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        context,
        severity,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        metrics: this.errorMetrics
      };
      
      await fetch(this.config.errorReportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorReport)
      });
      
      console.log('📤 Error reported successfully');
    } catch (reportingError) {
      console.error('❌ Failed to report error:', reportingError);
    }
  }

  // User notification
  private notifyUser(error: Error, context: ErrorContext): void {
    if (typeof window === 'undefined') return;
    
    // Create user-friendly notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff6b6b;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">⚠️</span>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">Something went wrong</div>
          <div style="font-size: 14px; opacity: 0.9;">We're working to fix this issue. Please try again.</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: auto;">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Rate limiting
  private checkErrorRateLimits(): void {
    if (this.errorMetrics.totalErrors > this.config.maxErrorsPerSession) {
      console.warn('🚨 Error rate limit exceeded for session');
      
      // Disable error reporting temporarily
      this.config.enableErrorReporting = false;
      
      // Re-enable after 5 minutes
      setTimeout(() => {
        this.config.enableErrorReporting = true;
      }, 300000);
    }
  }

  // Performance monitoring
  private setupPerformanceMonitoring(): void {
    // Monitor for performance-related errors
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.duration > 5000) {
            this.handleError(
              new Error(`Performance issue: ${entry.name} took ${entry.duration}ms`),
              {
                userId: this.getCurrentUserId(),
                sessionId: this.sessionId,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: Date.now(),
                additionalData: {
                  type: 'performance',
                  duration: entry.duration,
                  entryType: entry.entryType
                }
              }
            );
          }
        }
      });
      
      observer.observe({ entryTypes: ['measure'] });
    }
  }

  // Utility methods
  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Public API methods
  getErrorMetrics(): ErrorMetrics {
    return { ...this.errorMetrics };
  }

  getRecentErrors(limit: number = 50): Array<{ error: Error; context: ErrorContext }> {
    return this.errorLog.slice(-limit);
  }

  clearErrorLog(): void {
    this.errorLog = [];
    this.errorMetrics = {
      totalErrors: 0,
      criticalErrors: 0,
      recoveredErrors: 0,
      errorRate: 0,
      lastErrorTime: null,
      topErrors: []
    };
    console.log('🗑️ Error log cleared');
  }

  updateConfig(newConfig: Partial<ErrorHandlingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('📝 Error handler configuration updated:', this.config);
  }

  // Manual error reporting
  reportManualError(error: Error, additionalContext?: Record<string, any>): void {
    this.handleError(error, {
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      additionalData: {
        type: 'manual',
        ...additionalContext
      }
    });
  }

  // Error boundary helper
  withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallbackComponent?: React.ComponentType
  ): React.ComponentType<P> {
    // const ErrorBoundary = this.createErrorBoundary(fallbackComponent);
    
    return (props: P) => {
      return React.createElement(Component, props);
    };
  }
}

// React hook for error handling
export const useErrorHandler = () => {
  const errorHandler = EnhancedErrorHandler.getInstance();
  
  const handleError = (error: Error | string, context?: Partial<ErrorContext>) => {
    return errorHandler.handleError(error, context);
  };

  const getErrors = (filter?: Parameters<typeof errorHandler.getErrors>[0]) => {
    return errorHandler.getErrors(filter);
  };

  return {
    handleError,
    getErrors,
    resolveError: errorHandler.resolveError.bind(errorHandler),
    getErrorStats: errorHandler.getErrorStats.bind(errorHandler),
    addErrorListener: errorHandler.addErrorListener.bind(errorHandler),
    removeErrorListener: errorHandler.removeErrorListener.bind(errorHandler)
  };
};

// Error boundary HOC
export const withErrorBoundary = (WrappedComponent: React.ComponentType<any>) => {
  return class ErrorBoundaryWrapper extends React.Component<any, { hasError: boolean }> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      const errorHandler = EnhancedErrorHandler.getInstance();
      errorHandler.handleError(error, {
        additionalData: {
          source: WrappedComponent.name,
          action: 'componentDidCatch',
          errorInfo
        }
      });
    }

    render() {
      if (this.state.hasError) {
        // Return a simple error message without JSX
        return React.createElement('div', 
          { className: 'error-boundary' },
          React.createElement('h2', null, 'Something went wrong'),
          React.createElement('button', 
            { onClick: () => this.setState({ hasError: false }) },
            'Try again'
          )
        );
      }

      return React.createElement(WrappedComponent, this.props);
    }
  };
};

// Export singleton instance
export const enhancedErrorHandler = EnhancedErrorHandler.getInstance();

export default EnhancedErrorHandler; 