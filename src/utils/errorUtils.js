export const ERROR_TYPES = {
  EXIF_EXTRACTION_FAILED: 'EXIF_EXTRACTION_FAILED',
  FILE_LOAD_ERROR: 'FILE_LOAD_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export const createError = (type, originalError, context = {}) => {
  return {
    type,
    message: originalError?.message || 'An unknown error occurred',
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      originalError: originalError?.toString()
    }
  };
};

export const logError = (error, analytics) => {
  console.error('ProofPix Error:', error);
  
  if (analytics) {
    analytics.event({
      category: 'Error',
      action: error.type,
      label: error.message
    });
  }
};
