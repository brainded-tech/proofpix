// components/BulkExportModal.js - Export options for bulk operations
import React, { memo, useState } from 'react';
import * as LucideIcons from 'lucide-react';

const BulkExportModal = memo(({ 
  isOpen, 
  onClose, 
  files, 
  onExport 
}) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [includeImages, setIncludeImages] = useState(false);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeGPS, setIncludeGPS] = useState(true);

  if (!isOpen) return null;

  const completedFiles = files.filter(f => f.status === 'completed');

  const handleExport = () => {
    onExport({
      format: exportFormat,
      includeImages,
      includeMetadata,
      includeGPS,
      files: completedFiles
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bulk-export-modal">
        <div className="modal-header">
          <h3>Export Bulk Data</h3>
          <button onClick={onClose} className="close-modal">
            <LucideIcons.X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="export-stats">
            <p>{completedFiles.length} files ready for export</p>
          </div>

          <div className="export-options">
            <div className="option-group">
              <label>Export Format</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <span>JSON - Structured data</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <span>CSV - Spreadsheet format</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="pdf"
                    checked={exportFormat === 'pdf'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <span>PDF - Combined report</span>
                </label>
              </div>
            </div>

            <div className="option-group">
              <label>Include Data</label>
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={includeMetadata}
                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                  />
                  <span>EXIF Metadata</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={includeGPS}
                    onChange={(e) => setIncludeGPS(e.target.checked)}
                  />
                  <span>GPS Coordinates</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                  />
                  <span>Image Thumbnails (PDF only)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleExport} className="btn-primary">
            <LucideIcons.Download size={16} />
            Export {completedFiles.length} Files
          </button>
        </div>
      </div>
    </div>
  );
});

BulkExportModal.displayName = 'BulkExportModal';
export default BulkExportModal;