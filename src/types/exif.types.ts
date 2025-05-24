// types/exif.types.ts

export interface RawExifData {
  // Camera Information
  make?: string;
  model?: string;
  software?: string;
  
  // Date/Time Information
  dateTime?: string;
  dateTimeOriginal?: string;
  dateTimeDigitized?: string;
  
  // Camera Settings
  fNumber?: number;
  exposureTime?: number | string;
  iso?: number;
  focalLength?: number;
  focalLengthIn35mmFormat?: number;
  
  // GPS Information
  gpsLatitude?: number[];
  gpsLatitudeRef?: 'N' | 'S';
  gpsLongitude?: number[];
  gpsLongitudeRef?: 'E' | 'W';
  gpsAltitude?: number;
  gpsAltitudeRef?: number;
  gpsTimeStamp?: number[];
  gpsDateStamp?: string;
  
  // Image Settings
  whiteBalance?: number;
  meteringMode?: number;
  flash?: number;
  colorSpace?: number;
  contrast?: number;
  saturation?: number;
  sharpness?: number;
  
  // Technical Details
  orientation?: number;
  xResolution?: number;
  yResolution?: number;
  resolutionUnit?: number;
  
  // Error handling
  error?: string;
  
  // Allow for additional unknown fields
  [key: string]: any;
}

export interface ProcessedExifData {
  camera: {
    make: string;
    model: string;
    software: string;
  };
  technical: {
    iso: string;
    aperture: string;
    shutterSpeed: string;
    focalLength: string;
  };
  timestamps: {
    taken: string | null;
    modified: string | null;
    original: string;
  };
  quality: {
    hasRichData: boolean;
    completeness: number;
    dataFields: number;
  };
  analysis: {
    possibleStripping: {
      stripped: boolean;
      reason: string;
    };
    cameraType: string;
    imageSource: string;
  };
}

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  coordsText: string;
}

export interface FileAnalysis {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface ImageProcessingResult {
  image: FileAnalysis | null;
  exif: ProcessedExifData | null;
  gps: GPSCoordinates | null;
  hasRichData: boolean;
  completeness: number;
  warnings: Warning[];
}

export interface Warning {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

// types/app.types.ts - Application-wide types

export interface UsageData {
  date: string;
  uploads: number;
  pdfDownloads: number;
  imageDownloads: number;
  bulkOperations: number;
  dataExports: number;
}

export interface UsageStats {
  canUpload: boolean;
  canDownloadImage: boolean;
  canDownloadPdf: boolean;
  canExportData: boolean;
  remainingUploads: number;
  remainingImages: number;
  remainingPdfs: number;
  remainingExports: number;
}

export interface LimitInfo {
  limit: number;
  used: number;
  remaining: number;
  percentage: number;
  canProceed: boolean;
}

export interface AppConfig {
  name: string;
  version: string;
  description: string;
  analytics: {
    googleAnalyticsId: string;
    enabled: boolean;
  };
  features: {
    bulkProcessing: boolean;
    advancedExif: boolean;
    pdfReports: boolean;
    gpsMapping: boolean;
    socialSharing: boolean;
    premiumFeatures: boolean;
  };
  isDevelopment: boolean;
  isProduction: boolean;
  api: {
    baseUrl: string;
    timeout: number;
  };
}

export interface UsageLimits {
  daily: {
    uploads: number;
    pdfDownloads: number;
    imageDownloads: number;
    bulkOperations: number;
    dataExports: number;
  };
  file: {
    maxSize: number;
    maxBulkFiles: number;
    supportedFormats: string[];
  };
}