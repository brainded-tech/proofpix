// components/EnhancedLoadingSpinner.js

import React, { memo, useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';

const EnhancedLoadingSpinner = memo(({ 
  size = 40, 
  message = 'Processing...', 
  submessage = '',
  showProgress = false, 
  progress = 0,
  showElapsedTime = false,
  className = '',
  icon: Icon = null,
  variant = 'spinner' // 'spinner', 'dots', 'pulse', 'bars'
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (!showElapsedTime) return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [showElapsedTime]);
  
  const formatElapsedTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };
  
  const renderLoadingAnimation = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="loading-dots" style={{ fontSize: size / 2 }}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div 
            className="loading-pulse"
            style={{ width: size, height: size }}
          />
        );
      
      case 'bars':
        return (
          <div className="loading-bars" style={{ height: size }}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        );
      
      case 'spinner':
      default:
        return Icon ? (
          <Icon size={size} className="loading-icon animate-spin" />
        ) : (
          <div 
            className="spinner-animation"
            style={{ width: size, height: size }}
          />
        );
    }
  };

  return (
    <div className={`enhanced-loading-spinner ${className}`} role="status" aria-live="polite">
      <div className="loading-content">
        {renderLoadingAnimation()}
        
        <div className="loading-text">
          <p className="loading-message" aria-live="polite">
            {message}
          </p>
          
          {submessage && (
            <p className="loading-submessage">
              {submessage}
            </p>
          )}
          
          {showElapsedTime && elapsedTime > 0 && (
            <p className="elapsed-time">
              {formatElapsedTime(elapsedTime)}
            </p>
          )}
        </div>
        
        {showProgress && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
            <span className="progress-text">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

EnhancedLoadingSpinner.displayName = 'EnhancedLoadingSpinner';

// 3. Loading Overlay Component for full-screen loading
const LoadingOverlay = memo(({ 
  isVisible, 
  message = 'Processing...', 
  canCancel = false, 
  onCancel,
  progress = 0,
  showProgress = false 
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="loading-overlay">
      <div className="loading-overlay-content">
        <EnhancedLoadingSpinner
          size={60}
          message={message}
          showProgress={showProgress}
          progress={progress}
          variant="spinner"
        />
        
        {canCancel && onCancel && (
          <button 
            className="cancel-loading-btn"
            onClick={onCancel}
            aria-label="Cancel operation"
          >
            <LucideIcons.X size={16} />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';