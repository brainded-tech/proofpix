import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import * as LucideIcons from 'lucide-react';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useExifExtraction } from '../hooks/useExifExtraction';

const BatchProcessor = ({
  onProcessingComplete,
  onError,
  maxFiles = 10,
  processingOptions = {}
}) => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { processImage } = useImageProcessing();
  const { handleAsyncError, addError } = useErrorHandler();
  const { extractExif, normalizeExifData } = useExifExtraction();

  const processedCount = useMemo(() => 
    files.filter(f => f.status === 'completed').length, 
    [files]
  );

  const failedCount = useMemo(() => 
    files.filter(f => f.status === 'error').length, 
    [files]
  );

  const handleMobileFile = useCallback(async (file) => {
    // For iOS devices, try to preserve metadata
    if (file.type === 'image/heic' || file.type === 'image/heif') {
      try {
        // Create a copy of the file to preserve metadata
        const fileClone = new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified
        });

        // Extract EXIF before any conversion
        const { exifData } = await extractExif(fileClone);
        
        // Attach the extracted EXIF as enhanced metadata
        if (exifData) {
          file.enhancedMetadata = exifData;
        }
      } catch (error) {
        console.warn('Failed to preserve HEIC metadata:', error);
      }
    }

    // For photos taken directly with the camera
    if (file.name.startsWith('image-') && !file.name.includes('.')) {
      try {
        const { exifData } = await extractExif(file);
        if (exifData) {
          file.enhancedMetadata = exifData;
        }
      } catch (error) {
        console.warn('Failed to extract camera metadata:', error);
      }
    }

    return file;
  }, [extractExif]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length + files.length > maxFiles) {
      addError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Process each file for mobile compatibility
    const processedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        const processedFile = await handleMobileFile(file);
        return {
          file: processedFile,
          id: Math.random().toString(36).substr(2, 9),
          status: 'pending',
          progress: 0,
          error: null
        };
      })
    );

    setFiles(prev => [...prev, ...processedFiles]);
  }, [files.length, maxFiles, addError, handleMobileFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.heic', '.heif']
    },
    multiple: true,
    useFsAccessApi: false // Disable File System Access API for better mobile compatibility
  });

  const processFiles = useCallback(async () => {
    setProcessing(true);
    let completed = 0;

    try {
      await Promise.all(files.map(async (fileObj) => {
        if (fileObj.status === 'completed') {
          completed++;
          setProgress((completed / files.length) * 100);
          return;
        }

        try {
          const result = await processImage(fileObj.file, {
            ...processingOptions,
            preserveMetadata: true // Always try to preserve metadata
          });

          // Normalize EXIF data if available
          if (result.exifData) {
            result.normalizedExif = normalizeExifData(result.exifData);
          }

          setFiles(prev => prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'completed', result } 
              : f
          ));
        } catch (error) {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, status: 'error', error: error.message } 
              : f
          ));
          handleAsyncError(error);
        }

        completed++;
        setProgress((completed / files.length) * 100);
      }));

      onProcessingComplete?.(
        files.map(f => ({
          id: f.id,
          status: f.status,
          result: f.result,
          error: f.error
        }))
      );
    } catch (error) {
      onError?.(error);
    } finally {
      setProcessing(false);
    }
  }, [files, processImage, processingOptions, handleAsyncError, onProcessingComplete, onError, normalizeExifData]);

  const removeFile = useCallback((id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const retryFile = useCallback((id) => {
    setFiles(prev => prev.map(f => 
      f.id === id 
        ? { ...f, status: 'pending', error: null } 
        : f
    ));
  }, []);

  return (
    <div className="batch-processor">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${processing ? 'disabled' : ''}`}
      >
        <input {...getInputProps()} disabled={processing} />
        <div className="dropzone-content">
          <LucideIcons.Upload className="upload-icon" />
          <p>Drag & drop up to {maxFiles} images, or click to select</p>
          <p className="file-count">
            {files.length} / {maxFiles} files added
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((fileObj) => (
            <div key={fileObj.id} className={`file-item ${fileObj.status}`}>
              <span className="file-name">{fileObj.file.name}</span>
              <span className="file-status">
                {fileObj.status === 'completed' && <LucideIcons.CheckCircle className="status-icon success" />}
                {fileObj.status === 'error' && (
                  <>
                    <LucideIcons.AlertCircle className="status-icon error" />
                    <button onClick={() => retryFile(fileObj.id)} className="retry-btn">
                      <LucideIcons.RefreshCw size={16} />
                      Retry
                    </button>
                  </>
                )}
                {fileObj.status === 'pending' && <LucideIcons.Clock className="status-icon pending" />}
              </span>
              <button 
                onClick={() => removeFile(fileObj.id)}
                className="remove-btn"
                disabled={processing}
                aria-label={`Remove ${fileObj.file.name}`}
              >
                <LucideIcons.X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="batch-controls">
          <div className="batch-stats">
            <span>{processedCount} processed</span>
            {failedCount > 0 && <span>{failedCount} failed</span>}
          </div>
          <button
            onClick={processFiles}
            disabled={processing || files.length === 0}
            className="process-btn"
          >
            {processing ? (
              <>
                <LucideIcons.Loader className="spin" />
                Processing... {Math.round(progress)}%
              </>
            ) : (
              <>
                <LucideIcons.Play />
                Process {files.length} files
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchProcessor; 