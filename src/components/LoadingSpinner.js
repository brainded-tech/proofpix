// components/LoadingSpinner.js - Reusable loading component
import React, { memo } from 'react';
import * as LucideIcons from 'lucide-react';

const LoadingSpinner = memo(({ 
  size = 40, 
  message = 'Processing...', 
  showProgress = false, 
  progress = 0,
  className = '',
  icon: Icon = null 
}) => {
  return (
    <div className={`loading-spinner ${className}`} role="status" aria-live="polite">
      <div className="loading-content">
        {Icon ? (
          <Icon size={size} className="loading-icon animate-pulse" aria-hidden="true" />
        ) : (
          <div 
            className="spinner-animation"
            style={{ width: size, height: size }}
            aria-hidden="true"
          />
        )}
        
        <p className="loading-message" aria-live="polite">
          {message}
        </p>
        
        {showProgress && (
          <div className="progress-container" aria-label="Progress indicator">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                aria-hidden="true"
              />
            </div>
            <span className="progress-text" aria-live="polite">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;