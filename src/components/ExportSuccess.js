import React, { memo, useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';

const ExportSuccess = memo(({ 
  isVisible, 
  onClose, 
  exportType, 
  fileName = null,
  duration = 3000 
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getExportMessage = () => {
    switch (exportType) {
      case 'json':
        return fileName ? `JSON file "${fileName}" downloaded successfully` : 'JSON data exported successfully';
      case 'csv':
        return fileName ? `CSV file "${fileName}" downloaded successfully` : 'CSV data exported successfully';
      case 'raw':
        return fileName ? `Raw EXIF file "${fileName}" downloaded successfully` : 'Raw EXIF data exported successfully';
      case 'clipboard':
        return 'EXIF data copied to clipboard successfully';
      default:
        return 'Data exported successfully';
    }
  };

  const getIcon = () => {
    switch (exportType) {
      case 'json':
        return LucideIcons.FileText;
      case 'csv':
        return LucideIcons.Table;
      case 'raw':
        return LucideIcons.Code;
      case 'clipboard':
        return LucideIcons.Clipboard;
      default:
        return LucideIcons.Download;
    }
  };

  const Icon = getIcon();

  return (
    <div className="export-success-toast">
      <div className="toast-content">
        <div className="toast-icon success">
          <Icon size={20} />
        </div>
        <div className="toast-message">
          <h4>Export Successful</h4>
          <p>{getExportMessage()}</p>
        </div>
        <button 
          onClick={onClose}
          className="toast-close"
          aria-label="Close notification"
        >
          <LucideIcons.X size={16} />
        </button>
      </div>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});

ExportSuccess.displayName = 'ExportSuccess';
export default ExportSuccess;