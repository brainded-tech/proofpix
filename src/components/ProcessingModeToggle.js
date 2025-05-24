// components/ProcessingModeToggle.js - Updated with "Coming Soon" state
import React, { memo } from 'react';
import * as LucideIcons from 'lucide-react';

const ProcessingModeToggle = memo(({ isBulkMode, onToggle, disabled = false }) => {
  const isComingSoon = true; // Set to false when you want to enable bulk processing

  const handleToggle = () => {
    if (isComingSoon) {
      // Don't actually toggle, just show coming soon message
      return;
    }
    onToggle();
  };

  return (
    <div className="bulk-mode-toggle">
      <div className="mode-option">
        <LucideIcons.Image size={20} className={!isBulkMode ? 'active' : ''} />
        <span>Single File</span>
      </div>
      
      <label className="bulk-toggle-switch">
        <input
          type="checkbox"
          checked={false} // Always false for coming soon
          onChange={handleToggle}
          disabled={disabled || isComingSoon}
        />
        <span className={`bulk-toggle-slider ${isComingSoon ? 'coming-soon' : ''}`}></span>
      </label>
      
      <div className="mode-option">
        <LucideIcons.Layers size={20} className={isComingSoon ? 'coming-soon-icon' : ''} />
        <span>Bulk Processing</span>
        {isComingSoon && (
          <span className="coming-soon-badge">Coming Soon</span>
        )}
      </div>
      
      {isComingSoon && (
        <div className="mode-description coming-soon-description">
          <LucideIcons.Star size={16} />
          <span>Process multiple images simultaneously - Available with Premium</span>
        </div>
      )}
    </div>
  );
});

ProcessingModeToggle.displayName = 'ProcessingModeToggle';
export default ProcessingModeToggle;