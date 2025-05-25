// Enhanced Error Handler with better UX
import React from 'react';

export class ErrorHandler {
  constructor() {
    this.errors = new Map();
    this.listeners = new Set();
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'UNHANDLED_PROMISE',
        message: 'An unexpected error occurred',
        originalError: event.reason,
        recoverable: true,
        userMessage: 'Something went wrong. Please try again.'
      });
      event.preventDefault();
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'JAVASCRIPT_ERROR',
        message: event.message,
        originalError: event.error,
        recoverable: false,
        userMessage: 'A technical error occurred. Please refresh the page.'
      });
    });
  }

  handleError(errorConfig) {
    const error = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: errorConfig.type,
      message: errorConfig.message,
      userMessage: errorConfig.userMessage || this.getDefaultUserMessage(errorConfig.type),
      originalError: errorConfig.originalError,
      recoverable: errorConfig.recoverable !== false,
      context: errorConfig.context || {},
      retryCount: 0,
      maxRetries: errorConfig.maxRetries || 3
    };

    this.errors.set(error.id, error);
    this.notifyListeners(error);
    
    // Log for debugging
    console.error('ProofPix Error:', error);
    
    return error.id;
  }

  getDefaultUserMessage(type) {
    const messages = {
      'FILE_TOO_LARGE': 'The selected file is too large. Please choose a file smaller than 50MB.',
      'INVALID_FILE_TYPE': 'This file type is not supported. Please select a JPEG, PNG, HEIC, or TIFF image.',
      'EXIF_EXTRACTION_FAILED': 'Unable to read metadata from this image. The file may be corrupted or have no metadata.',
      'NETWORK_ERROR': 'Network connection issue. Please check your internet connection and try again.',
      'STORAGE_ERROR': 'Unable to save data locally. Please check your browser storage settings.',
      'PROCESSING_TIMEOUT': 'Image processing is taking longer than expected. Please try with a smaller image.',
      'BROWSER_NOT_SUPPORTED': 'Your browser doesn\'t support this feature. Please try using a modern browser.',
      'QUOTA_EXCEEDED': 'You\'ve reached your daily limit. Please try again tomorrow or upgrade your plan.'
    };
    
    return messages[type] || 'An unexpected error occurred. Please try again.';
  }

  retryError(errorId, retryFunction) {
    const error = this.errors.get(errorId);
    if (!error || !error.recoverable) return false;

    if (error.retryCount >= error.maxRetries) {
      error.userMessage = 'Maximum retry attempts reached. Please refresh the page or contact support.';
      error.recoverable = false;
      this.notifyListeners(error);
      return false;
    }

    error.retryCount++;
    this.notifyListeners(error);

    try {
      retryFunction();
      this.clearError(errorId);
      return true;
    } catch (retryError) {
      error.userMessage = `Retry failed: ${this.getDefaultUserMessage(error.type)}`;
      this.notifyListeners(error);
      return false;
    }
  }

  clearError(errorId) {
    this.errors.delete(errorId);
    this.notifyListeners({ type: 'CLEAR', errorId });
  }

  clearAllErrors() {
    this.errors.clear();
    this.notifyListeners({ type: 'CLEAR_ALL' });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners(error) {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });
  }

  getActiveErrors() {
    return Array.from(this.errors.values());
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// React hook for using error handler
export const useErrorHandler = () => {
  const [errors, setErrors] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = errorHandler.subscribe((error) => {
      if (error.type === 'CLEAR') {
        setErrors(prev => prev.filter(e => e.id !== error.errorId));
      } else if (error.type === 'CLEAR_ALL') {
        setErrors([]);
      } else {
        setErrors(prev => {
          const existing = prev.find(e => e.id === error.id);
          if (existing) {
            return prev.map(e => e.id === error.id ? error : e);
          }
          return [...prev, error];
        });
      }
    });

    // Load initial errors
    setErrors(errorHandler.getActiveErrors());

    return unsubscribe;
  }, []);

  const handleError = React.useCallback((errorConfig) => {
    return errorHandler.handleError(errorConfig);
  }, []);

  const retryError = React.useCallback((errorId, retryFunction) => {
    return errorHandler.retryError(errorId, retryFunction);
  }, []);

  const clearError = React.useCallback((errorId) => {
    errorHandler.clearError(errorId);
  }, []);

  const clearAllErrors = React.useCallback(() => {
    errorHandler.clearAllErrors();
  }, []);

  return {
    errors,
    handleError,
    retryError,
    clearError,
    clearAllErrors
  };
}; 