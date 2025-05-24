import React, { memo, useMemo, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';

const limitNames = {
  uploads: 'uploads',
  pdfDownloads: 'PDF reports',
  imageDownloads: 'image downloads',
  dataExports: 'data exports'
};

const LimitModal = memo(({ showLimitModal, setShowLimitModal, limitType, limitInfo }) => {
  const handleClose = useCallback(() => {
    setShowLimitModal(false);
  }, [setShowLimitModal]);

  if (!showLimitModal || !limitInfo) return null;
  
  return (
    <div 
      className="limit-modal-overlay"
      role="dialog"
      aria-labelledby="limit-modal-title"
      aria-describedby="limit-modal-description"
    >
      <div className="limit-modal">
        <div className="limit-modal-header">
          <h3 id="limit-modal-title">Daily Limit Reached</h3>
          <button 
            onClick={handleClose}
            className="close-modal"
            aria-label="Close modal"
          >
            <LucideIcons.X size={20} />
          </button>
        </div>
        
        <div className="limit-modal-content">
          <LucideIcons.AlertCircle size={48} className="limit-icon" />
          <p id="limit-modal-description">
            You've reached your daily limit of <strong>{limitInfo.limit} {limitNames[limitType]}</strong>.
          </p>
          
          <div className="limit-options">
            <div className="option-card">
              <h4>🕐 Wait Until Tomorrow</h4>
              <p>Your limits reset at midnight</p>
            </div>
            
            <div className="option-card premium">
              <h4>⭐ Get More Usage</h4>
              <p>Upgrade for unlimited daily usage</p>
              <button className="upgrade-btn">
                Coming Soon - Unlimited Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

LimitModal.displayName = 'LimitModal';

export default LimitModal; 