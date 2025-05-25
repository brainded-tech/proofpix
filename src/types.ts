export interface ImageMetadata {
  // Basic file info
  fileName: string;
  fileSize: string;
  fileType: string;
  lastModified: string;

  // EXIF data
  make?: string;
  model?: string;
  software?: string;
  dateTime?: string;
  
  // GPS data
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitude?: number;
  gpsLatitudeRef?: 'N' | 'S';
  gpsLongitudeRef?: 'E' | 'W';
  gpsAltitudeRef?: number;
  gpsTimeStamp?: string;
  gpsDateStamp?: string;
  gpsAccuracy?: number;
  
  // Camera settings
  exposureTime?: string;
  fNumber?: number;
  iso?: number;
  focalLength?: string;
  lens?: string;
  
  // Image details
  imageWidth?: number;
  imageHeight?: number;
  orientation?: number;
  colorSpace?: string;
  
  // Camera settings
  flash?: string;
  whiteBalance?: string;
  exposureProgram?: string;
  meteringMode?: string;
}

export interface ProcessedImage {
  file: File;
  metadata: ImageMetadata;
  previewUrl: string;
  timestampedUrl?: string;
}

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
  supportedFormats: string[];
}

export interface ExifData extends ImageMetadata {
  // Additional EXIF-specific fields can be added here if needed
}

export type OutputSize = 'original' | 'large' | 'medium' | 'small';
export type ImageFormat = 'jpeg' | 'png';

export interface ImageOutputOptions {
  size: OutputSize;
  format: ImageFormat;
  quality: number; // 0-1
}

export interface ImagePreviewProps {
  image: ProcessedImage;
  showTimestamp: boolean;
  onToggleTimestamp: () => void;
  onDownload: () => void;
  onExportPDF: () => void;
  onExportJSON: () => void;
  onEnhancedExport?: () => void;
  outputOptions: ImageOutputOptions;
  onOutputOptionsChange: (options: Partial<ImageOutputOptions>) => void;
}

export interface MetadataPanelProps {
  metadata: ImageMetadata;
} 