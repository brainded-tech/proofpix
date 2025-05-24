// Complete utils/exifUtils.js file with all missing functions

import { useMemo } from 'react';

// ===== BASIC UTILITY FUNCTIONS =====

export const convertDMSToDD = (dms, ref) => {
  if (!dms || !Array.isArray(dms) || dms.length !== 3) return 0;
  
  let dd = dms[0] + dms[1]/60 + dms[2]/3600;
  if (ref === 'S' || ref === 'W') dd = dd * -1;
  return parseFloat(dd.toFixed(6));
};

export const formatExifDate = (dateString) => {
  if (!dateString) return null;
  
  // Convert EXIF date format (YYYY:MM:DD HH:mm:ss) to ISO format
  if (typeof dateString === 'string' && dateString.includes(':')) {
    const cleanDate = dateString.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
    const date = new Date(cleanDate);
    return isNaN(date.getTime()) ? dateString : date.toISOString();
  }
  
  return dateString;
};

export const hasRichExifData = (exifData) => {
  if (!exifData) return false;
  
  // Include more fields in the check
  const importantFields = [
    'make', 'model', 'dateTimeOriginal', 'dateTime',
    'fNumber', 'exposureTime', 'iso', 'focalLength',
    'ImageWidth', 'ImageHeight', // Include resolution info
    'software', 'orientation'     // Include additional technical info
  ];
  
  // Count how many fields are present
  const presentFields = importantFields.filter(field => {
    const value = exifData[field];
    return value !== null && value !== undefined && value !== '';
  });
  
  // More lenient threshold - if we have any 2 fields, consider it valid
  return presentFields.length >= 2;
};

export const detectPossibleExifStripping = (image, exifData) => {
  if (!image || !exifData) {
    return { stripped: true, reason: 'No EXIF data available' };
  }
  
  const fileName = image.name.toLowerCase();
  const hasBasicExif = !!(exifData.make || exifData.model || exifData.dateTimeOriginal);
  
  // Check for signs of stripping
  if (fileName.includes('screenshot')) {
    return { stripped: false, reason: 'Screenshots typically don\'t contain EXIF data' };
  }
  
  if (fileName.includes('edited') || fileName.includes('copy')) {
    return { stripped: true, reason: 'File appears to be edited or copied, which may strip EXIF data' };
  }
  
  if (!hasBasicExif && image.size > 100000) { // Large file with no EXIF
    return { stripped: true, reason: 'Large image file with no camera information suggests EXIF stripping' };
  }
  
  return { stripped: false, reason: 'EXIF data appears intact' };
};

// ===== MEMOIZED HOOKS =====

// Memoized GPS conversion - expensive operation
export const useMemoizedGPSConversion = (gpsLatitude, gpsLongitude, gpsLatitudeRef, gpsLongitudeRef) => {
  return useMemo(() => {
    if (!gpsLatitude || !gpsLongitude) return null;
    
    const lat = convertDMSToDD(gpsLatitude, gpsLatitudeRef);
    const lng = convertDMSToDD(gpsLongitude, gpsLongitudeRef);
    
    return { 
      lat, 
      lng, 
      coordsText: `${lat}, ${lng}`,
      mapUrl: `https://maps.google.com/?q=${lat},${lng}`,
      accuracy: calculateGPSAccuracy(gpsLatitude, gpsLongitude)
    };
  }, [gpsLatitude, gpsLongitude, gpsLatitudeRef, gpsLongitudeRef]);
};

// Memoized EXIF data processing
export const useMemoizedExifProcessing = (exifData, image) => {
  return useMemo(() => {
    if (!exifData) return null;
    
    const processed = {
      // Camera info
      camera: {
        make: exifData.make || 'Unknown',
        model: exifData.model || 'Unknown',
        software: exifData.software || 'Unknown'
      },
      
      // Technical settings
      technical: {
        iso: exifData.iso ? `ISO ${exifData.iso}` : 'Unknown',
        aperture: exifData.fNumber ? `f/${exifData.fNumber}` : 'Unknown',
        shutterSpeed: formatShutterSpeed(exifData.exposureTime),
        focalLength: exifData.focalLength ? `${exifData.focalLength}mm` : 'Unknown'
      },
      
      // Timestamps
      timestamps: {
        taken: formatExifDate(exifData.dateTimeOriginal || exifData.dateTime),
        modified: formatExifDate(exifData.dateTime),
        original: exifData.dateTimeOriginal || exifData.dateTime
      },
      
      // Quality metrics
      quality: {
        hasRichData: hasRichExifData(exifData),
        completeness: calculateDataCompleteness(exifData),
        dataFields: Object.keys(exifData).length
      },
      
      // File analysis
      analysis: {
        possibleStripping: detectPossibleExifStripping(image, exifData),
        cameraType: detectCameraType(image?.name, exifData),
        imageSource: detectImageSource(image?.name, exifData)
      }
    };
    
    return processed;
  }, [exifData, image?.name, image?.lastModified]);
};

// Memoized file analysis
export const useMemoizedFileAnalysis = (file) => {
  return useMemo(() => {
    if (!file) return null;
    
    return {
      sizeFormatted: formatFileSize(file.size),
      sizeCategory: getFileSizeCategory(file.size),
      typeInfo: getFileTypeInfo(file.type),
      nameAnalysis: analyzeFileName(file.name),
      lastModifiedFormatted: new Date(file.lastModified).toLocaleString(),
      uploadedAt: new Date().toISOString()
    };
  }, [file?.name, file?.size, file?.type, file?.lastModified]);
};

// ===== HELPER FUNCTIONS =====

const formatShutterSpeed = (exposureTime) => {
  if (!exposureTime) return 'Unknown';
  if (typeof exposureTime === 'string') return exposureTime;
  if (exposureTime < 1) {
    return `1/${Math.round(1/exposureTime)}s`;
  }
  return `${exposureTime}s`;
};

const calculateDataCompleteness = (exifData) => {
  if (!exifData) return 0;
  
  const importantFields = [
    'make', 'model', 'dateTime', 'dateTimeOriginal',
    'fNumber', 'exposureTime', 'iso', 'focalLength',
    'gpsLatitude', 'gpsLongitude'
  ];
  
  const presentFields = importantFields.filter(field => exifData[field]);
  return Math.round((presentFields.length / importantFields.length) * 100);
};

const calculateGPSAccuracy = (gpsLatitude, gpsLongitude) => {
  // Simple accuracy estimation based on precision of coordinates
  if (!gpsLatitude || !gpsLongitude) return 'Low';
  
  const latPrecision = gpsLatitude.toString().split('.')[1]?.length || 0;
  const lngPrecision = gpsLongitude.toString().split('.')[1]?.length || 0;
  const avgPrecision = (latPrecision + lngPrecision) / 2;
  
  if (avgPrecision >= 6) return 'High';
  if (avgPrecision >= 4) return 'Medium';
  return 'Low';
};

const getFileSizeCategory = (size) => {
  const mb = size / (1024 * 1024);
  if (mb < 1) return 'Small';
  if (mb < 5) return 'Medium';
  if (mb < 20) return 'Large';
  return 'Very Large';
};

const getFileTypeInfo = (type) => {
  const typeMap = {
    'image/jpeg': { name: 'JPEG', supports: 'Full EXIF support' },
    'image/jpg': { name: 'JPG', supports: 'Full EXIF support' },
    'image/png': { name: 'PNG', supports: 'Limited metadata support' },
    'image/heic': { name: 'HEIC', supports: 'Full EXIF support' },
    'image/heif': { name: 'HEIF', supports: 'Full EXIF support' },
    'image/tiff': { name: 'TIFF', supports: 'Full EXIF support' },
    'image/webp': { name: 'WebP', supports: 'Limited EXIF support' }
  };
  
  return typeMap[type] || { name: 'Unknown', supports: 'Unknown support' };
};

const analyzeFileName = (fileName) => {
  if (!fileName) return 'unknown';
  
  const patterns = {
    camera: /^(img|dsc|p|pic)_\d+/i,
    screenshot: /(screenshot|screen)/i,
    edited: /(edited|copy|export)/i,
    social: /(fb_|ig_|twitter)/i,
    phone: /^(img_[e]?\d+|photo_\d+)/i
  };
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(fileName)) {
      return type;
    }
  }
  
  return 'unknown';
};

const detectCameraType = (fileName, exifData) => {
  if (exifData?.make && exifData?.model) {
    const make = exifData.make.toLowerCase();
    if (make.includes('apple')) return 'iPhone/iPad';
    if (make.includes('samsung')) return 'Samsung';
    if (make.includes('google')) return 'Google Pixel';
    if (make.includes('canon')) return 'Canon DSLR/Mirrorless';
    if (make.includes('nikon')) return 'Nikon DSLR/Mirrorless';
    if (make.includes('sony')) return 'Sony Camera';
    return `${exifData.make} ${exifData.model}`;
  }
  
  if (!fileName) return 'Unknown Device';
  
  // Fallback to filename analysis
  const nameType = analyzeFileName(fileName);
  switch (nameType) {
    case 'phone': return 'Mobile Phone';
    case 'camera': return 'Digital Camera';
    case 'screenshot': return 'Screenshot';
    default: return 'Unknown Device';
  }
};

const detectImageSource = (fileName, exifData) => {
  if (!fileName) return 'Unknown Source';
  
  if (analyzeFileName(fileName) === 'screenshot') return 'Screenshot';
  if (analyzeFileName(fileName) === 'social') return 'Social Media';
  if (analyzeFileName(fileName) === 'edited') return 'Edited/Exported';
  if (exifData?.software?.toLowerCase().includes('photoshop')) return 'Adobe Photoshop';
  if (exifData?.software?.toLowerCase().includes('lightroom')) return 'Adobe Lightroom';
  if (exifData?.make && exifData?.model) return 'Original Camera';
  return 'Unknown Source';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ===== VALIDATION FUNCTIONS =====

export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Not a valid image file' };
  }
  
  if (file.size > 50 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }
  
  return { valid: true };
};

// ===== COORDINATE CONVERSION FUNCTIONS =====

export const ddToDMS = (dd) => {
  const degrees = Math.floor(Math.abs(dd));
  const minutes = Math.floor((Math.abs(dd) - degrees) * 60);
  const seconds = ((Math.abs(dd) - degrees) * 60 - minutes) * 60;
  
  return {
    degrees,
    minutes,
    seconds: parseFloat(seconds.toFixed(3))
  };
};

export const formatCoordinates = (lat, lng, format = 'decimal') => {
  if (format === 'dms') {
    const latDMS = ddToDMS(lat);
    const lngDMS = ddToDMS(lng);
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    
    return `${latDMS.degrees}°${latDMS.minutes}'${latDMS.seconds}"${latDir}, ${lngDMS.degrees}°${lngDMS.minutes}'${lngDMS.seconds}"${lngDir}`;
  }
  
  return `${lat}, ${lng}`;
};

// ===== EXIF VALUE FORMATTING =====

export const formatExifValue = (key, value) => {
  if (!value) return 'Unknown';
  
  switch (key.toLowerCase()) {
    case 'fnumber':
    case 'aperture':
      return `f/${value}`;
    
    case 'exposuretime':
    case 'shutterspeed':
      if (typeof value === 'string') return value;
      if (value < 1) return `1/${Math.round(1/value)}s`;
      return `${value}s`;
    
    case 'focallength':
      return `${value}mm`;
    
    case 'iso':
    case 'isospeedratings':
      return `ISO ${value}`;
    
    case 'flash':
      return value === 0 ? 'No Flash' : 'Flash Fired';
    
    case 'whitebalance':
      return value === 0 ? 'Auto' : 'Manual';
    
    case 'meteringmode':
      const meteringModes = {
        0: 'Unknown',
        1: 'Average',
        2: 'Center-weighted average',
        3: 'Spot',
        4: 'Multi-spot',
        5: 'Pattern',
        6: 'Partial'
      };
      return meteringModes[value] || `Mode ${value}`;
    
    case 'orientation':
      const orientations = {
        1: 'Normal',
        2: 'Flip horizontal',
        3: 'Rotate 180°',
        4: 'Flip vertical',
        5: 'Rotate 90° CCW + flip horizontal',
        6: 'Rotate 90° CW',
        7: 'Rotate 90° CW + flip horizontal',
        8: 'Rotate 90° CCW'
      };
      return orientations[value] || `Orientation ${value}`;
    
    default:
      return String(value);
  }
};

// ===== EXPORT FUNCTIONS =====

export const prepareExifForExport = (exifData, options = {}) => {
  if (!exifData) return null;
  
  const exportData = {
    timestamp: new Date().toISOString(),
    ...exifData
  };
  
  // Remove circular references and functions
  const cleanData = JSON.parse(JSON.stringify(exportData));
  
  if (options.includeProcessed) {
    cleanData.processed = {
      camera: `${exifData.make || 'Unknown'} ${exifData.model || ''}`.trim(),
      settings: {
        aperture: formatExifValue('aperture', exifData.fNumber),
        shutterSpeed: formatExifValue('shutterspeed', exifData.exposureTime),
        iso: formatExifValue('iso', exifData.iso),
        focalLength: formatExifValue('focallength', exifData.focalLength)
      }
    };
  }
  
  return cleanData;
};

// ===== COMPARISON FUNCTIONS =====

export const compareExifData = (exif1, exif2) => {
  if (!exif1 || !exif2) return { match: false, differences: [] };
  
  const differences = [];
  const keys = new Set([...Object.keys(exif1), ...Object.keys(exif2)]);
  
  keys.forEach(key => {
    if (exif1[key] !== exif2[key]) {
      differences.push({
        field: key,
        value1: exif1[key],
        value2: exif2[key]
      });
    }
  });
  
  return {
    match: differences.length === 0,
    differences,
    similarity: 1 - (differences.length / keys.size)
  };
};

// ===== ERROR HANDLING =====

export const handleExifError = (error, context = {}) => {
  const errorMap = {
    'No EXIF data': 'This image does not contain EXIF metadata',
    'Invalid file': 'The selected file is not a valid image',
    'File too large': 'The image file is too large to process',
    'Corrupted data': 'The image file appears to be corrupted'
  };
  
  const userMessage = errorMap[error.message] || 'Unable to process image metadata';
  
  return {
    type: 'exif_error',
    message: userMessage,
    originalError: error.message,
    context,
    timestamp: new Date().toISOString()
  };
};

// Export all functions as default object for easier importing
export default {
  convertDMSToDD,
  formatExifDate,
  hasRichExifData,
  detectPossibleExifStripping,
  useMemoizedGPSConversion,
  useMemoizedExifProcessing,
  useMemoizedFileAnalysis,
  validateImageFile,
  ddToDMS,
  formatCoordinates,
  formatExifValue,
  prepareExifForExport,
  compareExifData,
  handleExifError
};