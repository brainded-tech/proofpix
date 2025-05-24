// constants/validation.js - Validation rules and messages
export const VALIDATION_RULES = {
  file: {
    required: true,
    maxSize: USAGE_LIMITS.file.maxSize,
    allowedTypes: USAGE_LIMITS.file.supportedFormats,
    messages: {
      required: 'Please select a file to upload',
      tooLarge: 'File size exceeds the maximum limit of {maxSize}MB',
      invalidType: 'File type not supported. Please use JPG, PNG, HEIC, or TIFF',
      corrupted: 'File appears to be corrupted or unreadable'
    }
  },
  
  exif: {
    timeoutMs: 10000,
    requiredFields: [],
    messages: {
      extractionFailed: 'Unable to extract EXIF data from this image',
      timeout: 'EXIF extraction timed out - file may be too large',
      noData: 'No EXIF metadata found in this image',
      stripped: 'EXIF data appears to have been stripped from this image'
    }
  }
};