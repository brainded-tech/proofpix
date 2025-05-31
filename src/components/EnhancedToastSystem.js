// Enhanced Toast Notification System
import React, { useState, useEffect, useCallback, memo } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Bell, X } from 'lucide-react';
import { useErrorHandler } from '../utils/errorHandler';
import './EnhancedToastSystem.css';

const ToastContainer = memo(() => {
  const [toasts, setToasts] = useState([]);
  const { errors, retryError } = useErrorHandler();

  // Define functions first
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const newToast = {
      id: toast.id || `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: toast.type || 'info',
      title: toast.title,
      message: toast.message,
      duration: toast.duration || 5000,
      actions: toast.actions || [],
      dismissible: toast.dismissible !== false,
      timestamp: Date.now()
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss if duration is set
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(newToast.id);
      }, newToast.duration);
    }

    return newToast.id;
  }, [removeToast]);

  // Convert errors to toasts
  useEffect(() => {
    errors.forEach(error => {
      if (!toasts.find(t => t.id === error.id)) {
        addToast({
          id: error.id,
          type: error.recoverable ? 'warning' : 'error',
          title: getErrorTitle(error.type),
          message: error.userMessage,
          duration: error.recoverable ? 8000 : 12000,
          actions: error.recoverable ? [
            {
              label: 'Retry',
              action: () => retryError(error.id),
              primary: true
            }
          ] : [],
          dismissible: true
        });
      }
    });
  }, [errors, toasts, addToast, retryError]);

  const getErrorTitle = (errorType) => {
    const titles = {
      'FILE_TOO_LARGE': 'File Too Large',
      'INVALID_FILE_TYPE': 'Invalid File Type',
      'EXIF_EXTRACTION_FAILED': 'Metadata Error',
      'NETWORK_ERROR': 'Connection Issue',
      'STORAGE_ERROR': 'Storage Problem',
      'PROCESSING_TIMEOUT': 'Processing Timeout',
      'BROWSER_NOT_SUPPORTED': 'Browser Compatibility',
      'QUOTA_EXCEEDED': 'Limit Reached'
    };
    return titles[errorType] || 'Error';
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
});

const Toast = memo(({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(onDismiss, 300);
  }, [onDismiss]);

  const getIcon = () => {
    const iconProps = { size: 20 };
    switch (toast.type) {
      case 'success':
        return <CheckCircle {...iconProps} className="toast-icon success" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="toast-icon warning" />;
      case 'error':
        return <XCircle {...iconProps} className="toast-icon error" />;
      case 'info':
        return <Info {...iconProps} className="toast-icon info" />;
      default:
        return <Bell {...iconProps} className="toast-icon" />;
    }
  };

  return (
    <div 
      className={`toast toast-${toast.type} ${isVisible ? 'toast-visible' : ''} ${isExiting ? 'toast-exiting' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-content">
        <div className="toast-header">
          {getIcon()}
          <div className="toast-text">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
          {toast.dismissible && (
            <button 
              className="toast-dismiss"
              onClick={handleDismiss}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {toast.actions && toast.actions.length > 0 && (
          <div className="toast-actions">
            {toast.actions.map((action, index) => (
              <button
                key={index}
                className={`toast-action ${action.primary ? 'primary' : 'secondary'}`}
                onClick={() => {
                  action.action();
                  if (action.dismissOnClick !== false) {
                    handleDismiss();
                  }
                }}
              >
                {action.icon && <action.icon size={14} />}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// Hook for using the toast system
export const useToast = () => {
  const [toastContainer, setToastContainer] = useState(null);

  const showToast = useCallback((toast) => {
    if (toastContainer) {
      return toastContainer.addToast(toast);
    }
  }, [toastContainer]);

  const showSuccess = useCallback((message, options = {}) => {
    return showToast({
      type: 'success',
      message,
      ...options
    });
  }, [showToast]);

  const showError = useCallback((message, options = {}) => {
    return showToast({
      type: 'error',
      message,
      duration: 8000,
      ...options
    });
  }, [showToast]);

  const showWarning = useCallback((message, options = {}) => {
    return showToast({
      type: 'warning',
      message,
      duration: 6000,
      ...options
    });
  }, [showToast]);

  const showInfo = useCallback((message, options = {}) => {
    return showToast({
      type: 'info',
      message,
      ...options
    });
  }, [showToast]);

  const showProgress = useCallback((message, progress = 0) => {
    return showToast({
      type: 'info',
      message: `${message} (${Math.round(progress)}%)`,
      duration: 0, // Don't auto-dismiss
      dismissible: false
    });
  }, [showToast]);

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showProgress,
    ToastContainer: () => <ToastContainer ref={setToastContainer} />
  };
};

export default ToastContainer; 