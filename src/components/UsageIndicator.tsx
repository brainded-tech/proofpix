import React from 'react';

interface UsageIndicatorProps {
  uploads: number;
  pdfDownloads: number;
  imageDownloads: number;
  dataExports: number;
  maxUploads?: number;
  maxPdfDownloads?: number;
  maxImageDownloads?: number;
  maxDataExports?: number;
}

const UsageIndicator: React.FC<UsageIndicatorProps> = ({
  uploads = 0,
  pdfDownloads = 0,
  imageDownloads = 0,
  dataExports = 0,
  maxUploads = 10,
  maxPdfDownloads = 3,
  maxImageDownloads = 15,
  maxDataExports = 20,
}) => {
  const calculatePercentage = (current: number, max: number) => (current / max) * 100;

  return (
    <div className="usage-stats">
      <div className="usage-item">
        <span className="usage-label">Uploads:</span>
        <span className="usage-value">{uploads}/{maxUploads}</span>
        <div className="usage-bar">
          <div 
            className="usage-progress" 
            style={{ width: `${calculatePercentage(uploads, maxUploads)}%` }}
          />
        </div>
      </div>

      <div className="usage-item">
        <span className="usage-label">PDF Downloads:</span>
        <span className="usage-value">{pdfDownloads}/{maxPdfDownloads}</span>
        <div className="usage-bar">
          <div 
            className="usage-progress" 
            style={{ width: `${calculatePercentage(pdfDownloads, maxPdfDownloads)}%` }}
          />
        </div>
      </div>

      <div className="usage-item">
        <span className="usage-label">Image Downloads:</span>
        <span className="usage-value">{imageDownloads}/{maxImageDownloads}</span>
        <div className="usage-bar">
          <div 
            className="usage-progress" 
            style={{ width: `${calculatePercentage(imageDownloads, maxImageDownloads)}%` }}
          />
        </div>
      </div>

      <div className="usage-item">
        <span className="usage-label">Data Exports:</span>
        <span className="usage-value">{dataExports}/{maxDataExports}</span>
        <div className="usage-bar">
          <div 
            className="usage-progress" 
            style={{ width: `${calculatePercentage(dataExports, maxDataExports)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default UsageIndicator;
export { UsageIndicator }; 