// Enhanced Loading States with Better UX
import React, { memo, useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import './LoadingStates.css';

// Main loading spinner with customizable size and message
export const LoadingSpinner = memo(({ 
  size = 'medium', 
  message = 'Loading...', 
  showMessage = true,
  color = 'primary' 
}) => {
  return (
    <div className={`loading-spinner loading-spinner-${size}`}>
      <div className={`spinner spinner-${color}`}>
        <div className="spinner-circle"></div>
      </div>
      {showMessage && (
        <div className="loading-message">{message}</div>
      )}
    </div>
  );
});

// Progress bar with percentage and custom messages
export const ProgressBar = memo(({ 
  progress = 0, 
  message = 'Processing...', 
  showPercentage = true,
  animated = true,
  color = 'primary'
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-message">{message}</span>
        {showPercentage && (
          <span className="progress-percentage">{Math.round(displayProgress)}%</span>
        )}
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-fill progress-fill-${color} ${animated ? 'progress-animated' : ''}`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
});

// Step-by-step progress indicator
export const StepProgress = memo(({ 
  steps, 
  currentStep = 0, 
  completedSteps = [],
  errorSteps = [] 
}) => {
  return (
    <div className="step-progress">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isError = errorSteps.includes(index);
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div 
            key={index}
            className={`step-item ${
              isCompleted ? 'step-completed' : 
              isError ? 'step-error' : 
              isCurrent ? 'step-current' : 
              isUpcoming ? 'step-upcoming' : ''
            }`}
          >
            <div className="step-indicator">
              {isCompleted ? (
                <LucideIcons.Check size={16} />
              ) : isError ? (
                <LucideIcons.X size={16} />
              ) : isCurrent ? (
                <div className="step-spinner">
                  <div className="mini-spinner"></div>
                </div>
              ) : (
                <span className="step-number">{index + 1}</span>
              )}
            </div>
            <div className="step-content">
              <div className="step-title">{step.title}</div>
              {step.description && (
                <div className="step-description">{step.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

// File processing indicator
export const FileProcessingIndicator = memo(({ 
  fileName, 
  progress = 0, 
  status = 'processing',
  stage = 'Reading file...',
  onCancel 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <div className="mini-spinner" />;
      case 'completed':
        return <LucideIcons.CheckCircle size={20} className="status-icon success" />;
      case 'error':
        return <LucideIcons.AlertCircle size={20} className="status-icon error" />;
      case 'cancelled':
        return <LucideIcons.XCircle size={20} className="status-icon cancelled" />;
      default:
        return <LucideIcons.File size={20} className="status-icon" />;
    }
  };

  return (
    <div className={`file-processing-indicator status-${status}`}>
      <div className="file-info">
        <div className="file-icon">
          <LucideIcons.Image size={24} />
        </div>
        <div className="file-details">
          <div className="file-name">{fileName}</div>
          <div className="file-stage">{stage}</div>
        </div>
        <div className="file-status">
          {getStatusIcon()}
        </div>
        {onCancel && status === 'processing' && (
          <button 
            className="cancel-button"
            onClick={onCancel}
            aria-label="Cancel processing"
          >
            <LucideIcons.X size={16} />
          </button>
        )}
      </div>
      {status === 'processing' && (
        <div className="file-progress">
          <div 
            className="file-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
});

// Skeleton loader for content
export const SkeletonLoader = memo(({ 
  type = 'text', 
  lines = 3, 
  width = '100%',
  height = '20px' 
}) => {
  if (type === 'text') {
    return (
      <div className="skeleton-container">
        {Array.from({ length: lines }, (_, index) => (
          <div 
            key={index}
            className="skeleton-line"
            style={{ 
              width: index === lines - 1 ? '70%' : width,
              height 
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div 
        className="skeleton-image"
        style={{ width, height }}
      />
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-card">
        <div className="skeleton-image" style={{ height: '200px' }} />
        <div className="skeleton-content">
          <div className="skeleton-line" style={{ width: '80%', height: '20px' }} />
          <div className="skeleton-line" style={{ width: '60%', height: '16px' }} />
          <div className="skeleton-line" style={{ width: '90%', height: '14px' }} />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="skeleton-block"
      style={{ width, height }}
    />
  );
});

// Pulsing dot indicator
export const PulsingDots = memo(({ 
  count = 3, 
  size = 'small',
  color = 'primary' 
}) => {
  return (
    <div className={`pulsing-dots pulsing-dots-${size}`}>
      {Array.from({ length: count }, (_, index) => (
        <div 
          key={index}
          className={`dot dot-${color}`}
          style={{ animationDelay: `${index * 0.2}s` }}
        />
      ))}
    </div>
  );
});

// Loading overlay for full-screen loading
export const LoadingOverlay = memo(({ 
  isVisible = false, 
  message = 'Loading...', 
  progress = null,
  onCancel = null,
  blur = true 
}) => {
  if (!isVisible) return null;

  return (
    <div className={`loading-overlay ${blur ? 'loading-overlay-blur' : ''}`}>
      <div className="loading-overlay-content">
        <LoadingSpinner size="large" message={message} />
        {progress !== null && (
          <ProgressBar 
            progress={progress} 
            message="" 
            showPercentage={true}
          />
        )}
        {onCancel && (
          <button 
            className="loading-cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
});

// Hook for managing loading states
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const startLoading = (loadingMessage = 'Loading...') => {
    setIsLoading(true);
    setProgress(0);
    setMessage(loadingMessage);
    setError(null);
  };

  const updateProgress = (newProgress, newMessage = null) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
    if (newMessage) setMessage(newMessage);
  };

  const finishLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
      setMessage('');
    }, 500);
  };

  const setLoadingError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  return {
    isLoading,
    progress,
    message,
    error,
    startLoading,
    updateProgress,
    finishLoading,
    setLoadingError
  };
}; 