// components/BulkProcessingView.js - Fixed JSX structure
import React, { memo, useState, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import BulkUploadArea from './BulkUploadArea';
import FileQueueItem from './FileQueueItem';
import BulkProgressSummary from './BulkProgressSummary';
import BulkExportModal from './BulkExportModal';
import { useBulkProcessor } from '../hooks/useBulkProcessor';
import { useBulkExport } from '../hooks/useBulkExport';
import { checkLimit, getRemainingUses } from '../utils/usageUtils';
import { Logger } from '../utils/logger';

const logger = new Logger('BulkProcessingView');

const BulkProcessingView = memo(() => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);
  
  const {
    files,
    isProcessing,
    isPaused,
    addFiles,
    removeFile,
    pauseProcessing,
    resumeProcessing,
    retryFile,
    clearCompleted,
    clearAll,
    stats,
    canAddFiles,
    remainingSlots
  } = useBulkProcessor();
  
  const { exportFiles } = useBulkExport();
  
  const canUpload = checkLimit('bulkOperations');
  const remainingUploads = getRemainingUses('bulkOperations');

  const handleFilesSelected = useCallback(({ validFiles, errors }) => {
    try {
      if (validFiles.length > 0) {
        addFiles(validFiles);
        logger.info(`Added ${validFiles.length} files to bulk queue`);
      }
      
      if (errors.length > 0) {
        logger.warn(`${errors.length} files were rejected`, errors);
        // You could show error toasts here
      }
    } catch (error) {
      logger.error('Failed to add files to bulk queue', error);
      // Show error message to user
    }
  }, [addFiles]);

  const handlePreview = useCallback((fileItem) => {
    setSelectedPreview(fileItem);
  }, []);

  const handleExport = useCallback(async (exportOptions) => {
    try {
      await exportFiles(exportOptions);
      logger.info('Bulk export completed successfully');
    } catch (error) {
      logger.error('Bulk export failed', error);
      // Show error message to user
    }
  }, [exportFiles]);

  return (
    <div className="bulk-processing-view">
      {/* Upload Area */}
      <BulkUploadArea
        onFilesSelected={handleFilesSelected}
        canUpload={canUpload && canAddFiles}
        remainingUploads={remainingUploads}
        isProcessing={isProcessing}
      />
      
      {/* Progress Summary */}
      {files.length > 0 && (
        <BulkProgressSummary
          files={files}
          onPauseAll={pauseProcessing}
          onResumeAll={resumeProcessing}
          onClearCompleted={clearCompleted}
          onExportAll={() => setShowExportModal(true)}
          isPaused={isPaused}
        />
      )}
      
      {/* File Queue */}
      {files.length > 0 && (
        <div className="file-queue-container">
          <div className="queue-header">
            <h3>Processing Queue ({files.length} files)</h3>
            <div className="queue-actions">
              <button 
                onClick={clearAll}
                className="clear-all-btn"
                title="Clear all files"
              >
                <LucideIcons.Trash2 size={16} />
                Clear All
              </button>
            </div>
          </div>
          
          <div className="file-queue">
            {files.map(fileItem => (
              <FileQueueItem
                key={fileItem.id}
                fileItem={fileItem}
                onRemove={removeFile}
                onRetry={retryFile}
                onPreview={handlePreview}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {files.length === 0 && (
        <div className="bulk-empty-state">
          <LucideIcons.Layers size={48} className="empty-icon" />
          <h3>Ready for Bulk Processing</h3>
          <p>Upload multiple images at once to extract EXIF data from all of them simultaneously.</p>
          <div className="bulk-features">
            <div className="bulk-feature">
              <LucideIcons.Zap size={20} />
              <span>Process up to 10 files at once</span>
            </div>
            <div className="bulk-feature">
              <LucideIcons.Download size={20} />
              <span>Export all metadata as JSON, CSV, or PDF</span>
            </div>
            <div className="bulk-feature">
              <LucideIcons.Eye size={20} />
              <span>Monitor progress for each file</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Export Modal */}
      <BulkExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        files={files.filter(f => f.status === 'completed')}
        onExport={handleExport}
      />
      
      {/* Preview Modal */}
      {selectedPreview && (
        <div className="preview-modal-overlay" onClick={() => setSelectedPreview(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>{selectedPreview.file.name}</h3>
              <button onClick={() => setSelectedPreview(null)} className="close-preview">
                <LucideIcons.X size={20} />
              </button>
            </div>
            <div className="preview-content">
              {selectedPreview.previewUrl && (
                <img 
                  src={selectedPreview.previewUrl} 
                  alt={selectedPreview.file.name}
                  className="preview-image"
                />
              )}
              {selectedPreview.exifData && (
                <div className="preview-exif">
                  <h4>EXIF Data</h4>
                  <pre>{JSON.stringify(selectedPreview.exifData, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

BulkProcessingView.displayName = 'BulkProcessingView';
export default BulkProcessingView;