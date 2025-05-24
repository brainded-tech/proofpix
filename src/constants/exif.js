// constants/exif.js - EXIF processing constants
export const EXIF_CONSTANTS = {
  // Critical EXIF fields that indicate rich metadata
  criticalFields: [
    'make', 'model', 'dateTime', 'dateTimeOriginal', 
    'fNumber', 'exposureTime', 'iso', 'focalLength',
    'gpsLatitude', 'gpsLongitude'
  ],
  
  // Minimum fields needed to consider EXIF "rich"
  minRichFields: 3,
  
  // GPS precision
  gps: {
    precision: 6, // decimal places
    coordinateFormat: 'decimal' // 'decimal' | 'dms'
  },
  
  // Date formats
  dateFormats: {
    exif: 'YYYY:MM:DD HH:mm:ss',
    display: 'YYYY-MM-DD HH:mm:ss',
    filename: 'YYYYMMDD_HHmmss'
  },
  
  // Camera detection patterns
  cameraPatterns: {
    iphone: /^img_[e]?\d+/i,
    android: /^(img|pic|dcim|dsc|p)_\d+/i,
    screenshot: /(screenshot|screen[\s_-]?shot)/i,
    social: /(fb_|insta|twitter|linkedin)/i,
    copied: /(pasted-|image-|photo-|copy)/i
  }
};