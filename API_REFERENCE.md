# ProofPix API Reference

## 📚 Overview

This document provides comprehensive API reference for ProofPix's internal functions, components, and interfaces. All APIs are designed for client-side processing with privacy-first principles.

## 🔧 Core Utilities

### **metadata.ts**

#### `extractMetadata(file: File): Promise<ImageMetadata>`
Extracts EXIF, IPTC, and XMP metadata from image files.

**Parameters:**
- `file: File` - Image file to process

**Returns:**
- `Promise<ImageMetadata>` - Extracted metadata object

**Example:**
```typescript
const metadata = await extractMetadata(imageFile);
console.log(metadata.exif.camera.make); // "Apple"
console.log(metadata.gps?.latitude);    // 37.7749
```

**Supported Formats:**
- JPEG/JPG (full EXIF support)
- PNG (basic metadata)
- HEIC/HEIF (iOS format)
- TIFF (complete EXIF)
- WebP (limited support)

#### `analyzePrivacyRisks(metadata: ImageMetadata): PrivacyAnalysis`
Analyzes metadata for privacy risks and assigns risk levels.

**Parameters:**
- `metadata: ImageMetadata` - Metadata object to analyze

**Returns:**
- `PrivacyAnalysis` - Risk assessment with recommendations

**Example:**
```typescript
const analysis = analyzePrivacyRisks(metadata);
console.log(analysis.overallRisk);     // "HIGH" | "MEDIUM" | "LOW"
console.log(analysis.risks.gps);       // { level: "HIGH", reason: "Exact location" }
```

---

### **imageUtils.ts**

#### `validateImageFile(file: File): ValidationResult`
Validates image file format, size, and integrity.

**Parameters:**
- `file: File` - File to validate

**Returns:**
- `ValidationResult` - Validation status and errors

**Example:**
```typescript
const validation = validateImageFile(file);
if (!validation.isValid) {
  console.log(validation.errors); // ["File too large", "Unsupported format"]
}
```

#### `createImagePreview(file: File, maxWidth?: number): Promise<string>`
Creates optimized preview URL for image display.

**Parameters:**
- `file: File` - Image file
- `maxWidth?: number` - Maximum width (default: 800)

**Returns:**
- `Promise<string>` - Data URL for preview

**Example:**
```typescript
const previewUrl = await createImagePreview(file, 400);
imageElement.src = previewUrl;
```

#### `overlayTimestamp(imageUrl: string, timestamp: string, options?: OverlayOptions): Promise<string>`
Adds timestamp overlay to image.

**Parameters:**
- `imageUrl: string` - Source image URL
- `timestamp: string` - Timestamp text
- `options?: OverlayOptions` - Styling options

**Returns:**
- `Promise<string>` - Modified image as data URL

**Example:**
```typescript
const overlayedImage = await overlayTimestamp(
  imageUrl, 
  "2024-01-15 14:30:22",
  { position: "bottom-right", fontSize: 16 }
);
```

---

### **pdfUtils.ts**

#### `generateMetadataReport(metadata: ImageMetadata, options?: PdfOptions): Promise<Blob>`
Generates professional PDF report with metadata analysis.

**Parameters:**
- `metadata: ImageMetadata` - Metadata to include
- `options?: PdfOptions` - PDF generation options

**Returns:**
- `Promise<Blob>` - PDF file as blob

**Example:**
```typescript
const pdfBlob = await generateMetadataReport(metadata, {
  includeImage: true,
  template: "professional",
  watermark: "ProofPix Report"
});
```

#### `createBatchReport(metadataArray: ImageMetadata[], options?: BatchPdfOptions): Promise<Blob>`
Creates combined PDF report for multiple images.

**Parameters:**
- `metadataArray: ImageMetadata[]` - Array of metadata objects
- `options?: BatchPdfOptions` - Batch report options

**Returns:**
- `Promise<Blob>` - Combined PDF report

---

### **enhancedDataExporter.js**

#### `exportToJSON(metadata: ImageMetadata, options?: JsonExportOptions): string`
Exports metadata as formatted JSON.

**Parameters:**
- `metadata: ImageMetadata` - Metadata to export
- `options?: JsonExportOptions` - Export formatting options

**Returns:**
- `string` - JSON string

**Example:**
```typescript
const jsonData = exportToJSON(metadata, {
  pretty: true,
  includePrivacyAnalysis: true
});
```

#### `exportToCSV(metadataArray: ImageMetadata[]): string`
Exports multiple metadata objects as CSV.

**Parameters:**
- `metadataArray: ImageMetadata[]` - Array of metadata

**Returns:**
- `string` - CSV formatted string

---

### **errorLogger.ts**

#### `logError(error: AppError, context?: ErrorContext): void`
Logs application errors with context information.

**Parameters:**
- `error: AppError` - Error object
- `context?: ErrorContext` - Additional context

**Example:**
```typescript
try {
  await extractMetadata(file);
} catch (error) {
  errorLogger.logError(error, {
    operation: "metadata_extraction",
    fileSize: file.size,
    fileType: file.type
  });
}
```

#### `getErrorStats(): ErrorStatistics`
Returns error statistics for debugging.

**Returns:**
- `ErrorStatistics` - Error counts and patterns

#### `downloadErrorLog(): void`
Downloads error log as JSON file for debugging.

---

## 🧩 Component APIs

### **ProcessingInterface Component**

#### Props
```typescript
interface ProcessingInterfaceProps {
  onMetadataExtracted?: (metadata: ImageMetadata) => void;
  onError?: (error: AppError) => void;
  maxFileSize?: number;
  supportedFormats?: string[];
  showPrivacyWarnings?: boolean;
}
```

#### Events
- `onMetadataExtracted` - Fired when metadata extraction completes
- `onError` - Fired when processing errors occur
- `onFileSelected` - Fired when user selects file
- `onExportRequested` - Fired when user requests export

---

### **MetadataPanel Component**

#### Props
```typescript
interface MetadataPanelProps {
  metadata: ImageMetadata;
  showPrivacyAnalysis?: boolean;
  expandedSections?: string[];
  onSectionToggle?: (section: string) => void;
  onExport?: (format: ExportFormat) => void;
}
```

#### Methods
- `expandAll()` - Expands all metadata sections
- `collapseAll()` - Collapses all sections
- `highlightRisks()` - Highlights privacy risks

---

### **BatchManagement Component**

#### Props
```typescript
interface BatchManagementProps {
  maxFiles?: number;
  onBatchComplete?: (results: BatchResult[]) => void;
  onProgress?: (progress: BatchProgress) => void;
  allowedFormats?: string[];
}
```

---

## 📊 Type Definitions

### **Core Types**

#### `ImageMetadata`
```typescript
interface ImageMetadata {
  exif: {
    camera: CameraInfo;
    settings: CameraSettings;
    timestamp: TimestampInfo;
    gps?: GpsInfo;
  };
  iptc?: IptcData;
  xmp?: XmpData;
  file: FileInfo;
  privacyAnalysis: PrivacyAnalysis;
}
```

#### `CameraInfo`
```typescript
interface CameraInfo {
  make: string;
  model: string;
  lens?: string;
  software?: string;
  firmware?: string;
}
```

#### `CameraSettings`
```typescript
interface CameraSettings {
  iso: number;
  aperture: number;
  shutterSpeed: string;
  focalLength: number;
  flash: FlashInfo;
  whiteBalance: string;
  exposureMode: string;
}
```

#### `GpsInfo`
```typescript
interface GpsInfo {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp?: Date;
  accuracy?: number;
}
```

#### `PrivacyAnalysis`
```typescript
interface PrivacyAnalysis {
  overallRisk: "HIGH" | "MEDIUM" | "LOW";
  risks: {
    gps?: PrivacyRisk;
    device?: PrivacyRisk;
    timestamp?: PrivacyRisk;
    personal?: PrivacyRisk;
  };
  recommendations: string[];
}
```

#### `PrivacyRisk`
```typescript
interface PrivacyRisk {
  level: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
  impact: string;
  mitigation: string;
}
```

### **Export Types**

#### `ExportFormat`
```typescript
type ExportFormat = "pdf" | "json" | "csv" | "clean-image" | "timestamped-image";
```

#### `PdfOptions`
```typescript
interface PdfOptions {
  template: "basic" | "professional" | "detailed";
  includeImage: boolean;
  includePrivacyAnalysis: boolean;
  watermark?: string;
  pageSize: "A4" | "Letter";
}
```

### **Error Types**

#### `AppError`
```typescript
interface AppError {
  code: string;
  message: string;
  severity: "low" | "medium" | "high";
  timestamp: Date;
  context?: Record<string, any>;
}
```

#### `ValidationResult`
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileInfo?: {
    size: number;
    type: string;
    lastModified: Date;
  };
}
```

---

## 🔌 Custom Hooks

### **useMetadataExtraction**
```typescript
const useMetadataExtraction = (file: File | null) => {
  return {
    metadata: ImageMetadata | null;
    loading: boolean;
    error: AppError | null;
    extract: () => Promise<void>;
    reset: () => void;
  };
};
```

### **useFileUpload**
```typescript
const useFileUpload = (options?: UploadOptions) => {
  return {
    files: File[];
    isDragging: boolean;
    upload: (files: FileList) => void;
    remove: (index: number) => void;
    clear: () => void;
    validate: (file: File) => ValidationResult;
  };
};
```

### **useExport**
```typescript
const useExport = () => {
  return {
    exportPDF: (metadata: ImageMetadata, options?: PdfOptions) => Promise<void>;
    exportJSON: (metadata: ImageMetadata) => void;
    exportCSV: (metadata: ImageMetadata[]) => void;
    exportCleanImage: (file: File, removeGPS?: boolean) => Promise<void>;
    isExporting: boolean;
    exportError: AppError | null;
  };
};
```

### **useBatchProcessing**
```typescript
const useBatchProcessing = () => {
  return {
    processFiles: (files: File[]) => Promise<BatchResult[]>;
    progress: BatchProgress;
    results: BatchResult[];
    isProcessing: boolean;
    cancel: () => void;
    retry: (index: number) => Promise<void>;
  };
};
```

---

## 🛡️ Security APIs

### **Input Validation**

#### `sanitizeFilename(filename: string): string`
Sanitizes filename for safe download.

#### `validateMimeType(file: File): boolean`
Validates file MIME type against whitelist.

#### `checkFileIntegrity(file: File): Promise<boolean>`
Checks file integrity and detects corruption.

### **Privacy Protection**

#### `stripSensitiveMetadata(metadata: ImageMetadata): ImageMetadata`
Removes privacy-sensitive metadata fields.

#### `anonymizeDeviceInfo(metadata: ImageMetadata): ImageMetadata`
Anonymizes device identification data.

#### `removeGpsData(file: File): Promise<File>`
Creates new file with GPS data removed.

---

## ⚡ Performance APIs

### **Memory Management**

#### `cleanupImageData(imageUrl: string): void`
Revokes object URLs and cleans up memory.

#### `optimizeForMobile(): void`
Adjusts processing parameters for mobile devices.

#### `getMemoryUsage(): MemoryInfo`
Returns current memory usage statistics.

### **Processing Optimization**

#### `processInChunks<T>(items: T[], chunkSize: number, processor: (chunk: T[]) => Promise<void>): Promise<void>`
Processes large arrays in chunks to prevent blocking.

#### `debounceFileProcessing(delay: number): (file: File) => Promise<ImageMetadata>`
Debounces file processing to prevent excessive calls.

---

## 🔄 State Management APIs

### **Context Providers**

#### `AppStateProvider`
```typescript
const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Provides global app state
};
```

#### `ErrorProvider`
```typescript
const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Provides error handling context
};
```

### **State Hooks**

#### `useAppState()`
```typescript
const useAppState = () => {
  return {
    state: AppState;
    dispatch: (action: AppAction) => void;
    reset: () => void;
  };
};
```

#### `useErrorHandler()`
```typescript
const useErrorHandler = () => {
  return {
    reportError: (error: AppError) => void;
    clearErrors: () => void;
    errors: AppError[];
  };
};
```

---

## 📱 Mobile-Specific APIs

### **Touch Interactions**

#### `useTouchGestures()`
```typescript
const useTouchGestures = () => {
  return {
    onPinch: (scale: number) => void;
    onSwipe: (direction: SwipeDirection) => void;
    onLongPress: () => void;
  };
};
```

### **Device Detection**

#### `isMobileDevice(): boolean`
Detects if running on mobile device.

#### `getDeviceCapabilities(): DeviceCapabilities`
Returns device processing capabilities.

---

## 🧪 Testing Utilities

### **Test Helpers**

#### `createMockFile(options?: MockFileOptions): File`
Creates mock file for testing.

#### `createMockMetadata(overrides?: Partial<ImageMetadata>): ImageMetadata`
Creates mock metadata object.

#### `waitForMetadataExtraction(timeout?: number): Promise<ImageMetadata>`
Waits for metadata extraction to complete in tests.

---

## 📈 Analytics APIs

### **Privacy-Safe Analytics**

#### `trackFeatureUsage(feature: string, action: string): void`
Tracks feature usage without personal data.

#### `recordPerformanceMetric(metric: string, value: number): void`
Records performance metrics for optimization.

#### `getUsageStatistics(): UsageStats`
Returns aggregated usage statistics.

---

## 🔧 Configuration APIs

### **Settings Management**

#### `getUserPreferences(): UserPreferences`
Gets user preferences from local storage.

#### `updatePreferences(preferences: Partial<UserPreferences>): void`
Updates user preferences.

#### `resetToDefaults(): void`
Resets all preferences to defaults.

### **Feature Flags**

#### `isFeatureEnabled(feature: string): boolean`
Checks if feature is enabled.

#### `getFeatureConfig(feature: string): FeatureConfig`
Gets feature configuration.

---

*This API reference is maintained by the Technical Documentation Lead and updated with each release. For implementation examples and advanced usage, see the Architecture Documentation.* 