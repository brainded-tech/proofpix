# ProofPix Architecture Documentation

## 🏗️ System Overview

ProofPix is a privacy-first, client-side web application built with React 18 and TypeScript. The architecture prioritizes local processing, zero data collection, and maximum user privacy.

## 🎯 Core Architectural Principles

### 1. **Privacy by Design**
- All image processing occurs in the browser
- No server uploads or external API calls with user data
- Zero tracking or analytics collection
- Local storage only for user preferences

### 2. **Client-Side Processing**
- EXIF extraction using browser-native APIs
- In-memory image manipulation
- Local PDF generation
- Browser-based file operations

### 3. **Progressive Enhancement**
- Core functionality works without JavaScript
- Enhanced features require modern browser APIs
- Graceful degradation for older browsers
- Mobile-first responsive design

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Environment                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   React App     │  │  Service Worker │  │  Local Storage  │ │
│  │                 │  │                 │  │                 │ │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │ │
│  │ │ Components  │ │  │ │   Caching   │ │  │ │ Preferences │ │ │
│  │ │             │ │  │ │             │ │  │ │             │ │ │
│  │ ├─────────────┤ │  │ ├─────────────┤ │  │ ├─────────────┤ │ │
│  │ │   Utils     │ │  │ │ Offline     │ │  │ │   Session   │ │ │
│  │ │             │ │  │ │ Support     │ │  │ │    Data     │ │ │
│  │ └─────────────┘ │  │ └─────────────┘ │  │ └─────────────┘ │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Browser APIs                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   File API      │  │   Canvas API    │  │   Web Workers   │ │
│  │                 │  │                 │  │                 │ │
│  │ • FileReader    │  │ • Image         │  │ • Background    │ │
│  │ • Blob          │  │   Processing    │  │   Processing    │ │
│  │ • URL.create    │  │ • PDF Gen       │  │ • EXIF Extract  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Architecture

### 1. **Image Upload Flow**
```
User Selects File
       ↓
File Validation (size, format)
       ↓
FileReader API → ArrayBuffer
       ↓
EXIF Extraction (exifr library)
       ↓
Metadata Processing & Analysis
       ↓
Privacy Risk Assessment
       ↓
UI State Update (React)
```

### 2. **Processing Pipeline**
```
Raw Image Data
       ↓
┌─────────────────┐
│ Metadata Parser │ → EXIF, IPTC, XMP extraction
└─────────────────┘
       ↓
┌─────────────────┐
│ Privacy Analyzer│ → Risk assessment & flagging
└─────────────────┘
       ↓
┌─────────────────┐
│ Data Formatter  │ → Human-readable formatting
└─────────────────┘
       ↓
┌─────────────────┐
│ Export Generator│ → PDF, JSON, cleaned images
└─────────────────┘
```

## 🧩 Component Architecture

### **Component Hierarchy**
```
App.tsx
├── ProofPix.tsx (Main Application)
│   ├── HomePage.tsx (Landing Page)
│   ├── ProcessingInterface.tsx (Core Functionality)
│   │   ├── ImageUpload.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── MetadataPanel.tsx
│   │   │   ├── ExifDisplay.tsx
│   │   │   ├── GpsDisplay.tsx
│   │   │   └── PrivacyWarnings.tsx
│   │   └── ExportOptions.tsx
│   ├── BatchManagement.tsx (Bulk Processing)
│   ├── AnalyticsDashboard.tsx (Usage Stats)
│   └── PricingPage.tsx (Subscriptions)
├── Support Pages
│   ├── AboutUs.tsx
│   ├── PrivacyPolicy.tsx
│   ├── FAQ.tsx
│   └── Support.tsx
└── Documentation Pages
    ├── GettingStarted.tsx
    ├── PrivacyGuide.tsx
    ├── MetadataGuide.tsx
    └── ApiDocs.tsx
```

### **Component Communication Patterns**

#### **1. Props Down, Events Up**
```typescript
// Parent passes data down
<MetadataPanel 
  metadata={imageMetadata} 
  onExport={handleExport}
  privacyLevel={userPrivacyLevel}
/>

// Child emits events up
const handleExportClick = (format: ExportFormat) => {
  onExport({ format, metadata: processedData });
};
```

#### **2. Context for Global State**
```typescript
// Theme and user preferences
const ThemeContext = createContext<ThemeContextType>();
const UserPreferencesContext = createContext<UserPrefsType>();

// Error handling and notifications
const ErrorContext = createContext<ErrorContextType>();
const NotificationContext = createContext<NotificationContextType>();
```

#### **3. Custom Hooks for Logic**
```typescript
// Metadata processing
const useMetadataExtraction = (file: File) => {
  // Returns: { metadata, loading, error, extract }
};

// File handling
const useFileUpload = () => {
  // Returns: { files, upload, validate, clear }
};

// Export functionality
const useExport = () => {
  // Returns: { exportPDF, exportJSON, exportCleanImage }
};
```

## 🛠️ Utility Architecture

### **Core Utilities Structure**
```
src/utils/
├── metadata.ts          # EXIF extraction & processing
├── imageUtils.ts        # Image manipulation & validation
├── pdfUtils.ts          # PDF generation & formatting
├── errorLogger.ts       # Error tracking & reporting
├── analytics.ts         # Privacy-safe usage analytics
├── stripe.js           # Payment processing
├── sessionManager.js   # Session & subscription management
├── exifUtils.js        # Advanced EXIF operations
├── enhancedPdfGenerator.js  # Professional PDF exports
├── enhancedDataExporter.js  # Multiple export formats
├── errorHandler.js     # Global error handling
├── performanceOptimizer.js  # Performance monitoring
└── formatters.ts       # Data formatting utilities
```

### **Utility Design Patterns**

#### **1. Pure Functions**
```typescript
// No side effects, predictable outputs
export const formatGpsCoordinates = (
  lat: number, 
  lng: number
): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};
```

#### **2. Factory Pattern**
```typescript
// PDF generator factory
export const createPdfGenerator = (options: PdfOptions) => {
  return {
    generateReport: (metadata: ImageMetadata) => Promise<Blob>,
    addWatermark: (text: string) => void,
    setTemplate: (template: PdfTemplate) => void
  };
};
```

#### **3. Observer Pattern**
```typescript
// Error logging with subscribers
class ErrorLogger {
  private subscribers: ErrorSubscriber[] = [];
  
  subscribe(callback: ErrorSubscriber) {
    this.subscribers.push(callback);
  }
  
  logError(error: AppError) {
    this.subscribers.forEach(sub => sub(error));
  }
}
```

## 🔒 Security Architecture

### **Client-Side Security Measures**

#### **1. Input Validation**
```typescript
// File validation pipeline
const validateFile = (file: File): ValidationResult => {
  // Size limits (50MB max)
  // Format whitelist (JPEG, PNG, HEIC, TIFF)
  // MIME type verification
  // Magic number checking
};
```

#### **2. Memory Management**
```typescript
// Automatic cleanup
const processImage = async (file: File) => {
  const buffer = await file.arrayBuffer();
  try {
    const metadata = await extractMetadata(buffer);
    return metadata;
  } finally {
    // Explicit cleanup
    buffer = null;
    URL.revokeObjectURL(imageUrl);
  }
};
```

#### **3. Content Security Policy**
```html
<!-- Strict CSP headers -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://js.stripe.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: blob:;
               connect-src 'self' https://api.stripe.com;">
```

### **Privacy Protection Mechanisms**

#### **1. No Network Requests with User Data**
```typescript
// All processing is local
const extractMetadata = (file: File): Promise<Metadata> => {
  // Uses exifr library locally
  // No external API calls
  // No data transmission
};
```

#### **2. Temporary Data Handling**
```typescript
// Automatic cleanup of temporary data
class TemporaryDataManager {
  private cleanup = new Set<() => void>();
  
  addCleanup(fn: () => void) {
    this.cleanup.add(fn);
  }
  
  cleanupAll() {
    this.cleanup.forEach(fn => fn());
    this.cleanup.clear();
  }
}
```

## ⚡ Performance Architecture

### **Optimization Strategies**

#### **1. Lazy Loading**
```typescript
// Component lazy loading
const BatchManagement = lazy(() => import('./BatchManagement'));
const AnalyticsDashboard = lazy(() => import('./AnalyticsDashboard'));

// Route-based code splitting
const DocumentationRoutes = lazy(() => import('./pages/docs'));
```

#### **2. Web Workers for Heavy Processing**
```typescript
// Background EXIF extraction
const worker = new Worker('/workers/exif-worker.js');
worker.postMessage({ file: fileBuffer });
worker.onmessage = (event) => {
  const { metadata } = event.data;
  updateUI(metadata);
};
```

#### **3. Memory Optimization**
```typescript
// Streaming file processing
const processLargeFile = async (file: File) => {
  const chunkSize = 1024 * 1024; // 1MB chunks
  for (let offset = 0; offset < file.size; offset += chunkSize) {
    const chunk = file.slice(offset, offset + chunkSize);
    await processChunk(chunk);
  }
};
```

### **Performance Monitoring**
```typescript
// Built-in performance tracking
class PerformanceMonitor {
  trackOperation(name: string, operation: () => Promise<any>) {
    const start = performance.now();
    return operation().finally(() => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    });
  }
}
```

## 🔄 State Management

### **State Architecture Pattern**
```typescript
// Centralized state with React Context
interface AppState {
  // UI State
  theme: 'dark' | 'light';
  loading: boolean;
  errors: AppError[];
  
  // Processing State
  currentFile: File | null;
  metadata: ImageMetadata | null;
  processingProgress: number;
  
  // User State
  subscription: SubscriptionStatus;
  preferences: UserPreferences;
  sessionData: SessionData;
}
```

### **State Update Patterns**
```typescript
// Immutable updates with reducers
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_METADATA':
      return {
        ...state,
        metadata: action.payload,
        loading: false
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload],
        loading: false
      };
  }
};
```

## 🚀 Deployment Architecture

### **Build Process**
```bash
# Production build pipeline
npm run build
├── Static asset optimization
├── Code splitting and bundling
├── CSS purging and minification
├── Image optimization
└── Service worker generation
```

### **Hosting Strategy**
```
CDN Distribution
├── Static Assets (images, fonts)
├── JavaScript bundles
├── CSS files
└── Service worker

Edge Locations
├── Global content delivery
├── Automatic HTTPS
├── Compression (gzip/brotli)
└── Caching strategies
```

## 📈 Scalability Considerations

### **Client-Side Scaling**
- **Memory Management**: Automatic cleanup and garbage collection
- **Processing Limits**: File size and batch processing limits
- **Browser Compatibility**: Progressive enhancement strategy
- **Mobile Optimization**: Reduced processing for mobile devices

### **Infrastructure Scaling**
- **Static Hosting**: Infinitely scalable static assets
- **CDN Distribution**: Global edge caching
- **Serverless Functions**: Auto-scaling payment processing
- **Database**: Minimal server-side data storage

## 🔧 Development Workflow

### **Local Development**
```bash
# Development server with hot reload
npm start  # Port 3001

# Testing environment
npm test   # Jest + React Testing Library

# Build verification
npm run build && npm run serve
```

### **Code Quality Pipeline**
```bash
# Pre-commit hooks
├── TypeScript compilation
├── ESLint code quality
├── Prettier formatting
├── Unit test execution
└── Build verification
```

## 📚 Technology Decisions

### **Core Technology Stack**
| Technology | Version | Justification |
|------------|---------|---------------|
| React | 18.x | Modern hooks, concurrent features |
| TypeScript | 5.x | Type safety, developer experience |
| Tailwind CSS | 3.x | Utility-first, consistent design |
| exifr | 7.x | Comprehensive EXIF extraction |
| jsPDF | 2.x | Client-side PDF generation |
| Stripe | Latest | Secure payment processing |

### **Architecture Trade-offs**

#### **Client-Side Processing**
**Pros:**
- Maximum privacy protection
- No server infrastructure costs
- Instant processing feedback
- Offline capability

**Cons:**
- Limited by browser capabilities
- Memory constraints for large files
- Processing speed varies by device
- No server-side optimizations

#### **Static Hosting**
**Pros:**
- Infinite scalability
- Low hosting costs
- Global CDN distribution
- High availability

**Cons:**
- Limited dynamic functionality
- No server-side processing
- Dependency on client capabilities
- Complex state management

---

*This architecture documentation is maintained by the Technical Analysis Lead and updated with each major release.* 