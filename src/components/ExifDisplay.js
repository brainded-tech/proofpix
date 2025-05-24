import React, { memo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import ExportDropdown from './ExportDropdown';
import ExportSuccess from './ExportSuccess';
import { useDataExport } from '../hooks/useDataExport';
import { getRemainingUses } from '../utils/usageUtils';

const ExifDisplay = memo(({ 
  image,
  exifData,
  isProcessing,
  showExifStrippedWarning,
  exifStrippedReason,
  setShowExifStrippedWarning,
  showFullExif,
  setShowFullExif,
  gpsCoordinates,
  onCopyGps,
  showCopiedTooltip,
  formatExifValue
}) => {
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [lastExportType, setLastExportType] = useState('');
  const [lastExportFile, setLastExportFile] = useState('');
  
  const { exportData, canExport } = useDataExport();
  const remainingExports = getRemainingUses('dataExports');

  const handleExport = async (format) => {
    if (!image || !canExport) return;
    
    try {
      const result = await exportData(format, image, exifData, {
        includeGPS: !!gpsCoordinates,
        includeMetadata: !!exifData
      });
      
      setLastExportType(format);
      setLastExportFile(result);
      setShowExportSuccess(true);
    } catch (error) {
      console.error('Export failed:', error);
      // You could show an error toast here
    }
  };

  if (!image) {
    return (
      <div className="exif-data">
        <h2>EXIF Metadata</h2>
        <div className="no-exif">
          <LucideIcons.Image size={48} />
          <p>Upload an image to view its EXIF metadata</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exif-data">
      <h2>EXIF Metadata</h2>
      
      {showExifStrippedWarning && (
        <div className="exif-warning">
          <div className="warning-content">
            <LucideIcons.AlertTriangle size={20} className="warning-icon" />
            <div className="warning-text">
              <h4>Limited Metadata Detected</h4>
              <p>{exifStrippedReason}</p>
            </div>
            <button 
              className="close-warning" 
              onClick={() => setShowExifStrippedWarning(false)}
            >
              <LucideIcons.X size={16} />
            </button>
          </div>
        </div>
      )}
      
      {isProcessing ? (
        <div className="processing">
          <div className="processing-animation"></div>
          <p>Extracting EXIF data...</p>
        </div>
      ) : exifData ? (
        <div className="exif-content">
          {/* File Info */}
          <div className="exif-section">
            <h3>File Information</h3>
            <div className="exif-row">
              <span className="exif-label">Name:</span>
              <span className="exif-value">{image.name}</span>
            </div>
            <div className="exif-row">
              <span className="exif-label">Size:</span>
              <span className="exif-value">{(image.size / 1024).toFixed(2)} KB</span>
            </div>
            <div className="exif-row">
              <span className="exif-label">Type:</span>
              <span className="exif-value">{image.type}</span>
            </div>
          </div>
          
          {/* Camera Info */}
          {(exifData.make || exifData.model) && (
            <div className="exif-section">
              <h3>Camera Information</h3>
              {exifData.make && (
                <div className="exif-row">
                  <span className="exif-label">Make:</span>
                  <span className="exif-value">{exifData.make}</span>
                </div>
              )}
              {exifData.model && (
                <div className="exif-row">
                  <span className="exif-label">Model:</span>
                  <span className="exif-value">{exifData.model}</span>
                </div>
              )}
            </div>
          )}
          
          {/* GPS Information */}
          {gpsCoordinates && (
            <div className="exif-section">
              <h3>GPS Information</h3>
              <div className="exif-row">
                <span className="exif-label">Coordinates:</span>
                <span className="exif-value">
                  {gpsCoordinates.coordsText}
                  <button onClick={onCopyGps} className="copy-btn">
                    <LucideIcons.Copy size={14} />
                  </button>
                  {showCopiedTooltip && (
                    <span className="copy-tooltip visible">Copied!</span>
                  )}
                </span>
              </div>
            </div>
          )}
          
          {/* NEW: Data Export Section */}
          <div className="exif-export-section">
            <h3>
              <LucideIcons.Download size={16} />
              Export Data
            </h3>
            <p>Export your EXIF metadata in different formats for analysis or documentation.</p>
            
            <div className="export-actions">
              <ExportDropdown
                onExport={handleExport}
                canExport={canExport}
                disabled={isProcessing}
                remainingExports={remainingExports}
              />
              
              <div className="export-usage">
                <LucideIcons.BarChart3 size={14} />
                <span>{remainingExports} exports remaining today</span>
              </div>
            </div>
          </div>
          
          {/* Raw EXIF Toggle */}
          <div className="exif-section">
            <div className="toggle-option">
              <span>Show Raw EXIF Data</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={showFullExif}
                  onChange={() => setShowFullExif(!showFullExif)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            {showFullExif && (
              <pre className="raw-exif">
                {JSON.stringify(exifData, null, 2)}
              </pre>
            )}
          </div>
          
          {/* Error Display */}
          {exifData.error && (
            <div className="exif-error">
              <LucideIcons.AlertTriangle size={18} />
              <span>{exifData.error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="no-exif">
          <LucideIcons.AlertCircle size={48} />
          <p>No EXIF data could be extracted from this image</p>
        </div>
      )}
      
      {/* Export Success Toast */}
      <ExportSuccess
        isVisible={showExportSuccess}
        onClose={() => setShowExportSuccess(false)}
        exportType={lastExportType}
        fileName={lastExportFile}
      />
    </div>
  );
});

ExifDisplay.displayName = 'ExifDisplay';
export default ExifDisplay;