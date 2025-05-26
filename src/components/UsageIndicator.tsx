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

  const remainingUploads = maxUploads - uploads;
  const isLowOnUploads = remainingUploads <= 1;
  const isOutOfUploads = remainingUploads <= 0;

  return (
    <div className="usage-stats">
      <div className="usage-item" style={{ marginBottom: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderRadius: '8px',
          background: isOutOfUploads ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 
                     isLowOnUploads ? 'linear-gradient(135deg, #ea580c, #dc2626)' : 
                     'linear-gradient(135deg, #1f2937, #374151)',
          border: isLowOnUploads ? '2px solid #fbbf24' : '1px solid #4b5563',
          boxShadow: isLowOnUploads ? '0 4px 12px rgba(251, 191, 36, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <span className="usage-label" style={{ 
            color: 'white', 
            fontWeight: '600',
            fontSize: isLowOnUploads ? '16px' : '14px'
          }}>
            {isOutOfUploads ? '🚫 No uploads remaining' : 
             isLowOnUploads ? '⚠️ Last photo remaining!' : 
             '📸 Photos remaining:'}
          </span>
          <span className="usage-value" style={{ 
            color: isLowOnUploads ? '#fbbf24' : '#10b981',
            fontWeight: 'bold',
            fontSize: isLowOnUploads ? '18px' : '16px',
            textShadow: isLowOnUploads ? '0 0 8px rgba(251, 191, 36, 0.8)' : 'none'
          }}>
            {isOutOfUploads ? '0' : remainingUploads}
          </span>
        </div>
      </div>
      <div className="usage-item">
        <span className="usage-label">Total Uploads:</span>
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