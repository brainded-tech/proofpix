// components/FileQueueItem.js - Individual file in the processing queue
import React, { memo } from 'react';
import * as LucideIcons from 'lucide-react';

const FileQueueItem = memo(({ 
  fileItem, 
  onRemove, 
  onRetry, 
  onPreview,
  showPreview = false 
}) => {
  const { id, file, status, progress, error, exifData } = fileItem;

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <LucideIcons.Clock size={16} className="status-icon pending" />;
      case 'processing':
        return (
          <div className="status-icon processing">
            <div className="mini-spinner" />
          </div>
        );
      case 'completed':
        return <LucideIcons.CheckCircle size={16} className="status-icon completed" />;
      case 'error':
        return <LucideIcons.AlertCircle size={16} className="status-icon error" />;
      default:
        return <LucideIcons.File size={16} className="status-icon" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending': return 'Waiting...';
      case 'processing': return 'Processing...';
      case 'completed': return 'Complete';
      case 'error': return error || 'Error occurred';
      default: return 'Unknown';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={`file-queue-item ${status}`}>
      <div className="file-info">
        <div className="file-icon">
          <LucideIcons.Image size={20} />
        </div>
        
        <div className="file-details">
          <div className="file-name" title={file.name}>
            {file.name}
          </div>
          <div className="file-meta">
            <span>{formatFileSize(file.size)}</span>
            {exifData && (
              <>
                <span>•</span>
                <span>{exifData.make || 'Unknown'} {exifData.model || ''}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="file-status">
        <div className="status-info">
          {getStatusIcon()}
          <span className="status-text">{getStatusText()}</span>
        </div>
        
        {status === 'processing' && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="file-actions">
        {status === 'completed' && onPreview && (
          <button
            onClick={() => onPreview(fileItem)}
            className="action-btn preview"
            title="Preview"
          >
            <LucideIcons.Eye size={14} />
          </button>
        )}
        
        {status === 'error' && onRetry && (
          <button
            onClick={() => onRetry(fileItem)}
            className="action-btn retry"
            title="Retry"
          >
            <LucideIcons.RefreshCw size={14} />
          </button>
        )}
        
        <button
          onClick={() => onRemove(id)}
          className="action-btn remove"
          title="Remove"
        >
          <LucideIcons.X size={14} />
        </button>
      </div>
    </div>
  );
});

FileQueueItem.displayName = 'FileQueueItem';
export default FileQueueItem;