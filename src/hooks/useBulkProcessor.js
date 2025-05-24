// hooks/useBulkProcessor.js - Main bulk processing logic
import { useState, useCallback, useRef, useEffect } from 'react';
import { USAGE_LIMITS } from '../constants/limits';
import { Logger } from '../utils/logger';
import { useExifExtraction } from './useExifExtraction';
import { updateUsage, checkLimit } from '../utils/usageUtils';

const logger = new Logger('BulkProcessor');

export const useBulkProcessor = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentlyProcessing, setCurrentlyProcessing] = useState(0);
  
  const processingQueue = useRef([]);
  const { extractExif } = useExifExtraction();
  
  // Add files to the queue
  const addFiles = useCallback((newFiles) => {
    if (!checkLimit('bulkOperations')) {
      throw new Error('Bulk operation limit reached for today');
    }

    const maxFiles = USAGE_LIMITS.file.maxBulkFiles;
    const totalFiles = files.length + newFiles.length;
    
    if (totalFiles > maxFiles) {
      throw new Error(`Cannot add more than ${maxFiles} files to queue`);
    }

    setFiles(prev => [...prev, ...newFiles]);
    logger.info(`Added ${newFiles.length} files to queue`);
    
    // Update usage for bulk operation
    updateUsage('bulkOperations');
    
    return true;
  }, [files.length]);

  // Remove file from queue
  const removeFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    processingQueue.current = processingQueue.current.filter(id => id !== fileId);
    logger.info(`Removed file ${fileId} from queue`);
  }, []);

  // Update file status
  const updateFileStatus = useCallback((fileId, updates) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, ...updates } : file
    ));
  }, []);

  // Process a single file
  const processFile = useCallback(async (fileItem) => {
    const { id, file } = fileItem;
    
    try {
      logger.info(`Starting processing for ${file.name}`);
      
      // Update status to processing
      updateFileStatus(id, { 
        status: 'processing', 
        progress: 0,
        error: null 
      });

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      updateFileStatus(id, { 
        previewUrl,
        progress: 25 
      });

      // Extract EXIF data
      updateFileStatus(id, { progress: 50 });
      const exifData = await extractExif(file);
      
      updateFileStatus(id, { 
        exifData,
        progress: 75 
      });

      // Complete processing
      updateFileStatus(id, { 
        status: 'completed',
        progress: 100
      });

      logger.info(`Completed processing for ${file.name}`);
      return { success: true, fileId: id };
      
    } catch (error) {
      logger.error(`Failed to process ${file.name}`, error);
      
      updateFileStatus(id, {
        status: 'error',
        error: error.message || 'Processing failed',
        progress: 0
      });
      
      return { success: false, fileId: id, error };
    }
  }, [updateFileStatus, extractExif]);

  // Process queue with concurrency control
  const processQueue = useCallback(async () => {
    if (isProcessing || isPaused) return;
    
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    const maxConcurrent = USAGE_LIMITS.processing.maxConcurrentUploads;
    
    logger.info(`Starting queue processing with ${pendingFiles.length} files`);

    // Process files in batches
    for (let i = 0; i < pendingFiles.length; i += maxConcurrent) {
      if (isPaused) break;
      
      const batch = pendingFiles.slice(i, i + maxConcurrent);
      setCurrentlyProcessing(batch.length);
      
      // Process batch concurrently
      const promises = batch.map(processFile);
      await Promise.allSettled(promises);
      
      setCurrentlyProcessing(0);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsProcessing(false);
    logger.info('Queue processing completed');
  }, [files, isProcessing, isPaused, processFile]);

  // Auto-start processing when files are added
  useEffect(() => {
    if (!isProcessing && !isPaused && files.some(f => f.status === 'pending')) {
      const timer = setTimeout(processQueue, 500);
      return () => clearTimeout(timer);
    }
  }, [files, isProcessing, isPaused, processQueue]);

  // Pause processing
  const pauseProcessing = useCallback(() => {
    setIsPaused(true);
    logger.info('Processing paused');
  }, []);

  // Resume processing
  const resumeProcessing = useCallback(() => {
    setIsPaused(false);
    logger.info('Processing resumed');
  }, []);

  // Retry failed file
  const retryFile = useCallback((fileItem) => {
    updateFileStatus(fileItem.id, {
      status: 'pending',
      progress: 0,
      error: null
    });
    logger.info(`Retrying file ${fileItem.file.name}`);
  }, [updateFileStatus]);

  // Clear completed files
  const clearCompleted = useCallback(() => {
    const completedFiles = files.filter(f => f.status === 'completed');
    
    // Clean up preview URLs
    completedFiles.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
    logger.info(`Cleared ${completedFiles.length} completed files`);
  }, [files]);

  // Clear all files
  const clearAll = useCallback(() => {
    // Clean up all preview URLs
    files.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    
    setFiles([]);
    setIsProcessing(false);
    setIsPaused(false);
    processingQueue.current = [];
    logger.info('Cleared all files');
  }, [files]);

  // Get statistics
  const getStats = useCallback(() => {
    const total = files.length;
    const completed = files.filter(f => f.status === 'completed').length;
    const processing = files.filter(f => f.status === 'processing').length;
    const errors = files.filter(f => f.status === 'error').length;
    const pending = files.filter(f => f.status === 'pending').length;
    
    return {
      total,
      completed,
      processing,
      errors,
      pending,
      progress: total > 0 ? (completed / total) * 100 : 0
    };
  }, [files]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, []);

  return {
    // State
    files,
    isProcessing,
    isPaused,
    currentlyProcessing,
    
    // Actions
    addFiles,
    removeFile,
    pauseProcessing,
    resumeProcessing,
    retryFile,
    clearCompleted,
    clearAll,
    
    // Data
    stats: getStats(),
    
    // Utilities
    canAddFiles: files.length < USAGE_LIMITS.file.maxBulkFiles,
    remainingSlots: Math.max(0, USAGE_LIMITS.file.maxBulkFiles - files.length)
  };
};