// components/ErrorToast.js
import React, { memo, useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';

const ErrorToast = memo(({ error, onClose, onRetry }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleRetry = () => {
    onRetry();
    handleClose();
  };

  if (!error) return null;

  const getIcon = () => {
    switch (error.type) {
      case 'FILE_TOO_LARGE':
      case 'INVALID_FILE_TYPE':
        return <LucideIcons.FileX size={20} />;
      case 'NETWORK_ERROR':
        return <LucideIcons.WifiOff size={20} />;
      case 'STORAGE_ERROR':
        return <LucideIcons.HardDrive size={20} />;
      case 'CLIPBOARD_ERROR':
        return <LucideIcons.Clipboard size={20} />;
      case 'BROWSER_NOT_SUPPORTED':
        return <LucideIcons.Globe size={20} />;
      default:
        return <LucideIcons.AlertTriangle size={20} />;
    }
  };

  const getColorClass = () => {
    if (!error.recoverable) return 'error-toast-critical';
    if (error.type.includes('NETWORK') || error.type.includes('STORAGE')) return 'error-toast-warning';
    return 'error-toast-error';
  };

  return (
    <div className={`error-toast ${getColorClass()} ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}>
      <div className="error-toast-content">
        <div className="error-toast-icon">
          {getIcon()}
        </div>
        
        <div className="error-toast-text">
          <h4>{error.title}</h4>
          <p>{error.message}</p>
          {error.suggestion && (
            <p className="error-toast-suggestion">
              <LucideIcons.Lightbulb size={14} />
              {error.suggestion}
            </p>
          )}
        </div>
        
        <div className="error-toast-actions">
          {error.recoverable && onRetry && (
            <button 
              onClick={handleRetry}
              className="error-toast-retry"
              aria-label="Retry action"
            >
              <LucideIcons.RefreshCw size={16} />
              Retry
            </button>
          )}
          
          <button 
            onClick={handleClose}
            className="error-toast-close"
            aria-label="Close error message"
          >
            <LucideIcons.X size={16} />
          </button>
        </div>
      </div>
      
      {/* Auto-dismiss progress bar */}
      <div className="error-toast-progress">
        <div className="error-toast-progress-bar"></div>
      </div>
    </div>
  );
});

ErrorToast.displayName = 'ErrorToast';

export default ErrorToast;