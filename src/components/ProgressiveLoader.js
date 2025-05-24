// components/ProgressiveLoader.js - Simple version
import React, { memo } from 'react';
import * as LucideIcons from 'lucide-react';

const ProgressiveLoader = memo(({ stages = [], currentStage = 0, className = '' }) => {
  if (currentStage >= stages.length) return null;

  const current = stages[currentStage] || {};
  const progress = ((currentStage + 1) / stages.length) * 100;

  return (
    <div className={`progressive-loader ${className}`}>
      <div className="loader-header">
        <h3 className="loader-title">{current.title || 'Processing...'}</h3>
      </div>
      
      <div className="loading-spinner">
        <div className="spinner-animation" style={{ width: 32, height: 32 }} />
        <p className="loading-message">{current.message || 'Please wait...'}</p>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
});

ProgressiveLoader.displayName = 'ProgressiveLoader';
export default ProgressiveLoader;