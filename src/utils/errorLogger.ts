// Error Logger Utility for ProofPix
// Automatically logs errors to external log files for analysis

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  message: string;
  stack?: string;
  file?: string;
  function?: string;
  context?: any;
  userAgent?: string;
  url?: string;
}

class ErrorLogger {
  private logFileBase = './ProofPixPhoenix_DevLogs';
  private errors: ErrorLogEntry[] = [];

  constructor() {
    // Set up global error handlers
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Capture unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        priority: 'High',
        category: 'JavaScript Error',
        message: event.message,
        stack: event.error?.stack,
        file: event.filename,
        context: {
          lineNumber: event.lineno,
          columnNumber: event.colno
        }
      });
    });

    // Capture unhandled Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        priority: 'High',
        category: 'Promise Rejection',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        context: event.reason
      });
    });

    // Capture React errors via console.error override
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Check if it's a React error
      if (message.includes('React') || message.includes('Warning:')) {
        this.logError({
          priority: 'Medium',
          category: 'React Warning',
          message: message,
          context: args
        });
      } else {
        this.logError({
          priority: 'Medium',
          category: 'Console Error',
          message: message,
          context: args
        });
      }
      
      // Call original console.error
      originalError.apply(console, args);
    };
  }

  public logError(error: Partial<ErrorLogEntry>) {
    const errorEntry: ErrorLogEntry = {
      id: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      priority: error.priority || 'Medium',
      category: error.category || 'Unknown',
      message: error instanceof Error ? error.message : String(error) || 'Unknown error',
      stack: error.stack,
      file: error.file,
      function: error.function,
      context: error.context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errors.push(errorEntry);
    
    // Log to console for immediate debugging
    console.warn('🚨 Error Logged:', errorEntry);
    
    // Attempt to write to log file (will be simulated in browser)
    this.writeToLogFile(errorEntry);
  }

  private writeToLogFile(error: ErrorLogEntry) {
    // Since we can't write files directly from browser,
    // we'll create a downloadable log entry
    
    // Store in localStorage for persistence
    const existingLogs = localStorage.getItem('proofpix_error_log') || '[]';
    const logs = JSON.parse(existingLogs);
    logs.push(error);
    localStorage.setItem('proofpix_error_log', JSON.stringify(logs));

    // In development, you can call downloadErrorLog() to export
    console.info('📝 Error logged to localStorage. Call errorLogger.downloadErrorLog() to export.');
  }

  private formatErrorForLog(error: ErrorLogEntry): string {
    return `
### ${this.getPriorityEmoji(error.priority)} **Error #${error.id.split('-')[1]} - ${error.category}**
**Date:** ${error.timestamp}  
**Priority:** ${error.priority}  
**Status:** 🔍 OPEN  

**Description:**
- ${error instanceof Error ? error.message : String(error)}
- Location: ${error.file || 'Unknown file'}
- Function: ${error.function || 'Unknown function'}

**Stack Trace:**
\`\`\`
${error.stack || 'No stack trace available'}
\`\`\`

**Context:**
\`\`\`json
${JSON.stringify(error.context, null, 2)}
\`\`\`

**Environment:**
- URL: ${error.url}
- User Agent: ${error.userAgent}
- Timestamp: ${error.timestamp}

**Resolution:**
- [ ] Investigate root cause
- [ ] Implement fix
- [ ] Test resolution
- [ ] Update error status

**Files Modified:**
- TBD

---
`;
  }

  private getPriorityEmoji(priority: string): string {
    switch (priority) {
      case 'Critical': return '🚨';
      case 'High': return '⚠️';
      case 'Medium': return '🔧';
      case 'Low': return '📝';
      default: return '❓';
    }
  }

  // Public methods for manual error logging
  public logCritical(message: string, context?: any) {
    this.logError({
      priority: 'Critical',
      category: 'Manual Log',
      message,
      context
    });
  }

  public logHigh(message: string, context?: any) {
    this.logError({
      priority: 'High',
      category: 'Manual Log',
      message,
      context
    });
  }

  public logMedium(message: string, context?: any) {
    this.logError({
      priority: 'Medium',
      category: 'Manual Log',
      message,
      context
    });
  }

  public logLow(message: string, context?: any) {
    this.logError({
      priority: 'Low',
      category: 'Manual Log',
      message,
      context
    });
  }

  // Export functionality
  public downloadErrorLog() {
    const logs = localStorage.getItem('proofpix_error_log') || '[]';
    const errors = JSON.parse(logs);
    
    let logContent = `# ProofPix Runtime Error Log\n\n`;
    logContent += `**Generated:** ${new Date().toISOString()}\n`;
    logContent += `**Total Errors:** ${errors.length}\n\n`;
    logContent += `---\n\n`;

    errors.forEach((error: ErrorLogEntry) => {
      logContent += this.formatErrorForLog(error);
    });

    const blob = new Blob([logContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proofpix_runtime_errors_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public clearLogs() {
    this.errors = [];
    localStorage.removeItem('proofpix_error_log');
    console.info('📝 Error logs cleared');
  }

  public getErrorStats() {
    const logs = localStorage.getItem('proofpix_error_log') || '[]';
    const errors = JSON.parse(logs);
    
    const stats = {
      total: errors.length,
      critical: errors.filter((e: ErrorLogEntry) => e.priority === 'Critical').length,
      high: errors.filter((e: ErrorLogEntry) => e.priority === 'High').length,
      medium: errors.filter((e: ErrorLogEntry) => e.priority === 'Medium').length,
      low: errors.filter((e: ErrorLogEntry) => e.priority === 'Low').length,
      categories: Array.from(new Set(errors.map((e: ErrorLogEntry) => e.category)))
    };

    console.table(stats);
    return stats;
  }
}

// Create and export singleton instance
export const errorLogger = new ErrorLogger();

// Add to window for debugging
declare global {
  interface Window {
    errorLogger: ErrorLogger;
  }
}

window.errorLogger = errorLogger;

// Helper function for component error boundaries
export const logComponentError = (error: Error, errorInfo: any, componentName: string) => {
  errorLogger.logError({
    priority: 'High',
    category: 'React Component Error',
    message: `Error in ${componentName}: ${error instanceof Error ? error.message : String(error)}`,
    stack: error.stack,
    function: componentName,
    context: {
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    }
  });
};

// Helper function for async operation errors
export const logAsyncError = (operation: string, error: Error, context?: any) => {
  errorLogger.logError({
    priority: 'Medium',
    category: 'Async Operation Error',
    message: `Error in ${operation}: ${error instanceof Error ? error.message : String(error)}`,
    stack: error.stack,
    function: operation,
    context
  });
};

export default errorLogger; 