// Update your constants/limits.js to include data exports

// Usage limits from environment variables with fallbacks
export const USAGE_LIMITS = {
  daily: {
    freeUploads: parseInt(process.env.REACT_APP_DAILY_UPLOADS) || 10,
    freePdfDownloads: parseInt(process.env.REACT_APP_DAILY_PDF_DOWNLOADS) || 3,
    freeImageDownloads: parseInt(process.env.REACT_APP_DAILY_IMAGE_DOWNLOADS) || 15,
    freeDataExports: parseInt(process.env.REACT_APP_DAILY_BULK_OPS) || 2
  },
  files: {
    maxFileSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 52428800,
    maxBulkFiles: parseInt(process.env.REACT_APP_MAX_BULK_FILES) || 10,
    maxConcurrent: parseInt(process.env.REACT_APP_MAX_CONCURRENT) || 1,
    processingTimeout: parseInt(process.env.REACT_APP_PROCESSING_TIMEOUT) || 30000
  },
  
  // File limits
  file: {
    maxSize: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || (50 * 1024 * 1024), // 50MB
    maxBulkFiles: parseInt(process.env.REACT_APP_MAX_BULK_FILES) || 10,
    supportedFormats: [
      'image/jpeg', 'image/jpg', 'image/png', 'image/heic', 
      'image/heif', 'image/tiff', 'image/webp'
    ]
  },
  
  // Processing limits
  processing: {
    maxConcurrentUploads: parseInt(process.env.REACT_APP_MAX_CONCURRENT) || 1,
    timeoutMs: parseInt(process.env.REACT_APP_PROCESSING_TIMEOUT) || 30000,
    retryAttempts: parseInt(process.env.REACT_APP_RETRY_ATTEMPTS) || 3,
    progressUpdateInterval: parseInt(process.env.REACT_APP_PROGRESS_INTERVAL) || 100
  },
  
  // Premium limits (for future use)
  premium: {
    uploads: parseInt(process.env.REACT_APP_PREMIUM_UPLOADS) || 100,
    pdfDownloads: parseInt(process.env.REACT_APP_PREMIUM_PDF_DOWNLOADS) || 50,
    imageDownloads: parseInt(process.env.REACT_APP_PREMIUM_IMAGE_DOWNLOADS) || 200,
    bulkOperations: parseInt(process.env.REACT_APP_PREMIUM_BULK_OPS) || 20,
    dataExports: parseInt(process.env.REACT_APP_PREMIUM_DATA_EXPORTS) || 200, // NEW: Premium data export limit
    maxFileSize: parseInt(process.env.REACT_APP_PREMIUM_MAX_FILE_SIZE) || (200 * 1024 * 1024) // 200MB
  }
};