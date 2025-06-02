import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Mail, Download } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: localStorage.getItem('user_id') || 'anonymous',
        errorId: this.state.errorId
      };

      // In a real app, send to error reporting service like Sentry
      console.log('Error report:', errorReport);
      
      // Store locally for debugging
      const existingErrors = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingErrors.push(errorReport);
      localStorage.setItem('error_reports', JSON.stringify(existingErrors.slice(-10))); // Keep last 10 errors
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private downloadErrorReport = () => {
    if (!this.state.error || !this.state.errorInfo) return;

    const errorReport = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      message: this.state.error.message,
      stack: this.state.error.stack,
      componentStack: this.state.errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      localStorage: Object.keys(localStorage).reduce((acc, key) => {
        acc[key] = localStorage.getItem(key);
        return acc;
      }, {} as Record<string, string | null>)
    };

    const blob = new Blob([JSON.stringify(errorReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-report-${this.state.errorId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  private sendFeedback = () => {
    const subject = encodeURIComponent(`Error Report - ${this.state.errorId}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Error Message: ${this.state.error?.message || 'Unknown error'}

Please describe what you were doing when this error occurred:
[Your description here]

Additional context:
[Any additional information]
    `);
    
    window.open(`mailto:support@proofpixapp.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              {/* Error Icon and Title */}
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  We're sorry, but an unexpected error occurred. Our team has been notified.
                </p>
                {this.state.errorId && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Error ID: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{this.state.errorId}</code>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </button>
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </button>
              </div>

              {/* Support Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Need Help?
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.sendFeedback}
                    className="flex items-center justify-center px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Report Issue
                  </button>
                  <button
                    onClick={this.downloadErrorReport}
                    className="flex items-center justify-center px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </button>
                </div>
              </div>

              {/* Error Details (Development/Debug Mode) */}
              {(this.props.showDetails || process.env.NODE_ENV === 'development') && this.state.error && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <details className="group">
                    <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                      <Bug className="h-4 w-4 mr-2" />
                      Technical Details
                      <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Error Message:</h4>
                        <pre className="text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 overflow-auto text-red-800 dark:text-red-200">
                          {this.state.error.message}
                        </pre>
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Stack Trace:</h4>
                          <pre className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 overflow-auto text-gray-800 dark:text-gray-200 max-h-40">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Component Stack:</h4>
                          <pre className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 overflow-auto text-gray-800 dark:text-gray-200 max-h-40">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for error reporting in functional components
export const useErrorHandler = () => {
  const reportError = React.useCallback((error: Error, context?: string) => {
    console.error('Manual error report:', error, context);
    
    if (process.env.NODE_ENV === 'production') {
      // Report to monitoring service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        context: context || 'manual_report',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: localStorage.getItem('user_id') || 'anonymous'
      };
      
      console.log('Error report:', errorReport);
    }
  }, []);

  return { reportError };
};

export default ErrorBoundary;
