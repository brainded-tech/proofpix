// components/BulkUploadArea.js - Enhanced upload for multiple files
import React, { memo, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as LucideIcons from 'lucide-react';
import { USAGE_LIMITS } from '../constants/limits';
import { validateImageFile } from '../utils/fileUtils';

const BulkUploadArea = memo(({ 
  onFilesSelected, 
  canUpload, 
  remainingUploads,
  maxFiles = USAGE_LIMITS.file.maxBulkFiles,
  isProcessing = false 
}) => {
  const [dragCounter, setDragCounter] = useState(0);

  const handleDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const validFiles = [];
    const errors = [];

    // Validate each file
    acceptedFiles.forEach(file => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push({
          id: `${file.name}-${file.lastModified}-${Date.now()}`,
          file,
          status: 'pending', // pending, processing, completed, error
          progress: 0,
          error: null,
          exifData: null,
          previewUrl: null
        });
      } else {
        errors.push({ file, error: validation.error });
      }
    });

    // Handle rejected files
    rejectedFiles.forEach(rejection => {
      errors.push({ 
        file: rejection.file, 
        error: rejection.errors.map(e => e.message).join(', ') 
      });
    });

    onFilesSelected({ validFiles, errors });
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': USAGE_LIMITS.file.supportedFormats,
    },
    onDrop: handleDrop,
    maxFiles,
    disabled: !canUpload || isProcessing,
    onDragEnter: () => setDragCounter(prev => prev + 1),
    onDragLeave: () => setDragCounter(prev => Math.max(0, prev - 1))
  });

  const getUploadText = () => {
    if (!canUpload) return 'Upload limit reached';
    if (isProcessing) return 'Processing files...';
    return `Drop up to ${maxFiles} images here`;
  };

  const getSubText = () => {
    if (!canUpload) return 'Try again tomorrow or upgrade';
    if (isProcessing) return 'Please wait while files are processed';
    return 'or click to select multiple files';
  };

  return (
    <div className="bulk-upload-area-container">
      <div 
        className={`bulk-upload-area ${isDragActive ? 'drag-active' : ''} ${!canUpload || isProcessing ? 'disabled' : ''}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="upload-content">
          <div className="upload-icon-group">
            <LucideIcons.Upload className="upload-icon primary" size={48} />
            <LucideIcons.Layers className="upload-icon secondary" size={24} />
          </div>
          
          <div className="upload-text">
            <p className="drag-text">{getUploadText()}</p>
            <p className="or-text">{getSubText()}</p>
            
            {canUpload && (
              <>
                <p className="formats">JPG, PNG, HEIC, TIFF + more formats</p>
                <div className="upload-limits">
                  <span>Max {maxFiles} files</span>
                  <span>•</span>
                  <span>Up to {Math.round(USAGE_LIMITS.file.maxSize / (1024 * 1024))}MB each</span>
                </div>
                
                {remainingUploads <= 5 && (
                  <p className="remaining-text">
                    {remainingUploads} bulk operations remaining today
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

BulkUploadArea.displayName = 'BulkUploadArea';
export default BulkUploadArea;