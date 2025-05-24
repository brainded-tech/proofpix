// components/ErrorToastContainer.js - Simple version
import React, { memo } from 'react';

const ErrorToastContainer = memo(({ errors = [], onRemoveError, onRetry }) => {
  if (!errors.length) return null;
  
  return (
    <div className="error-toast-container">
      {errors.map((error) => (
        <div key={error.id} className="error-toast visible">
          <div className="error-toast-content">
            <div className="error-toast-text">
              <h4>{error.title || 'Error'}</h4>
              <p>{error.message}</p>
            </div>
            <div className="error-toast-actions">
              {error.recoverable && onRetry && (
                <button onClick={() => onRetry(error.id)} className="error-toast-retry">
                  Retry
                </button>
              )}
              <button onClick={() => onRemoveError(error.id)} className="error-toast-close">
                ×
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

ErrorToastContainer.displayName = 'ErrorToastContainer';
export default ErrorToastContainer;