/**
 * Enhanced File Upload Component - Priority 5A Integration
 * Supports drag-and-drop, batch uploads, virus scanning, and real-time processing
 */

import React, { useState, useCallback, useRef } from 'react';
import { useFileUpload, useRealTimeUpdates } from '../../hooks/useApiIntegration';

interface FileUploadComponentProps {
  onUploadComplete?: (files: any[]) => void;
  onUploadError?: (error: string) => void;
  acceptedTypes?: string[];
  maxFileSize?: number;
  enableVirusScan?: boolean;
  enableMetadataExtraction?: boolean;
  enableThumbnails?: boolean;
  allowBatch?: boolean;
  className?: string;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  onUploadComplete,
  onUploadError,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  maxFileSize = 50 * 1024 * 1024, // 50MB
  enableVirusScan = true,
  enableMetadataExtraction = true,
  enableThumbnails = true,
  allowBatch = true,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, batchUpload, uploading, progress, error } = useFileUpload();
  const { connected, subscribe, unsubscribe } = useRealTimeUpdates();

  // Subscribe to real-time file processing updates
  React.useEffect(() => {
    const handleFileProcessed = (data: any) => {
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === data.fileId 
            ? { ...file, status: data.status, progress: data.progress }
            : file
        )
      );
    };

    if (connected) {
      subscribe('file:processed', handleFileProcessed);
      subscribe('file:virus-scan-complete', handleFileProcessed);
      subscribe('file:metadata-extracted', handleFileProcessed);
    }

    return () => {
      if (connected) {
        unsubscribe('file:processed', handleFileProcessed);
        unsubscribe('file:virus-scan-complete', handleFileProcessed);
        unsubscribe('file:metadata-extracted', handleFileProcessed);
      }
    };
  }, [connected, subscribe, unsubscribe]);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File size exceeds ${Math.round(maxFileSize / 1024 / 1024)}MB limit`;
    }

    if (acceptedTypes.length > 0) {
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });

      if (!isAccepted) {
        return `File type not accepted. Allowed types: ${acceptedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate files
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      onUploadError?.(errors.join('\n'));
      return;
    }

    try {
      if (allowBatch && validFiles.length > 1) {
        // Batch upload
        const result = await batchUpload(validFiles);
        setUploadedFiles(prev => [...prev, ...result.files]);
        onUploadComplete?.(result.files);
      } else {
        // Individual uploads
        const uploadPromises = validFiles.map(async (file) => {
          const result = await uploadFile(file, {
            generateThumbnail: enableThumbnails,
            extractMetadata: enableMetadataExtraction,
            virusScan: enableVirusScan,
          });
          return result;
        });

        const results = await Promise.all(uploadPromises);
        setUploadedFiles(prev => [...prev, ...results]);
        onUploadComplete?.(results);
      }
    } catch (err: any) {
      onUploadError?.(err.message || 'Upload failed');
    }
  }, [
    uploadFile,
    batchUpload,
    allowBatch,
    enableThumbnails,
    enableMetadataExtraction,
    enableVirusScan,
    onUploadComplete,
    onUploadError,
  ]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return '⏳';
      case 'processing':
        return '🔄';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`file-upload-component ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowBatch}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="text-6xl">
            {uploading ? '⏳' : dragActive ? '📥' : '📁'}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {uploading ? 'Uploading...' : 'Upload Files'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {dragActive 
                ? 'Drop files here to upload'
                : 'Drag and drop files here, or click to select'
              }
            </p>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* File Type Info */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Accepted types: {acceptedTypes.join(', ')}</p>
            <p>Max size: {Math.round(maxFileSize / 1024 / 1024)}MB</p>
            {enableVirusScan && <p>✓ Virus scanning enabled</p>}
            {enableMetadataExtraction && <p>✓ Metadata extraction enabled</p>}
          </div>
        </div>

        {/* Real-time Connection Status */}
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} 
               title={connected ? 'Real-time updates connected' : 'Real-time updates disconnected'} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(file.status)}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {file.filename}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${getStatusColor(file.status)}`}>
                    {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                  </span>
                  
                  {file.status === 'processing' && (
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress || 0}%` }}
                      />
                    </div>
                  )}

                  {file.virusScanResult && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      file.virusScanResult.clean 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {file.virusScanResult.clean ? 'Clean' : 'Threat Detected'}
                    </span>
                  )}

                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent; 