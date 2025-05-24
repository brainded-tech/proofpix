#!/bin/bash

echo "Creating ProofPix project directories..."

# Create main project directories
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/constants
mkdir -p src/config
mkdir -p src/types
mkdir -p public

echo "Creating root configuration files..."

# Create package.json
cat > package.json << 'EOF'
{
  "name": "proofpix",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4",
    "react-dropzone": "^14.2.3",
    "react-ga4": "^2.1.0",
    "lucide-react": "^0.263.1",
    "exif-js": "^2.3.0",
    "exifr": "^7.1.3",
    "heic2any": "^0.0.4",
    "jspdf": "^2.5.1",
    "lodash": "^4.17.21"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11"
  }
}
EOF

# Create tailwind.config.js
cat > tailwind.config.js << 'EOF'
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

echo "Creating source files..."

# Create src/index.js
cat > src/index.js << 'EOF'
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Comment out StrictMode temporarily to test
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

reportWebVitals();
EOF

# Create src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Single reset block */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Remove background-color to allow ProofPix.css to control it */
  color: #333;
}

/* Remove the forced light theme */
:root {
  /* Allow the app to use dark theme */
  color-scheme: dark light;
}
EOF

# Create src/App.js
cat > src/App.js << 'EOF'
// UPDATE YOUR App.js to include Error Boundary:

import React from 'react';
import ProofPix from './ProofPix';
import ErrorBoundary from './components/ErrorBoundary';
import ReactGA from 'react-ga4';
import './App.css';

function App() {
  return (
    <div className="App bg-black min-h-screen">
      <ErrorBoundary analytics={ReactGA}>
        <ProofPix />
      </ErrorBoundary>
    </div>
  );
}

export default App;
EOF

# Create src/App.css
cat > src/App.css << 'EOF'
body, html {
  margin: 0;
  padding: 0;
  /* Remove the forced background color and light scheme */
}

#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* Remove the background-color to allow ProofPix.css to control it */
}
EOF

echo "Creating component files..."

# Create src/components/ErrorBoundary.js
cat > src/components/ErrorBoundary.js << 'EOF'
// components/ErrorBoundary.js
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { createError, ERROR_TYPES, logError } from '../utils/errorUtils';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    const proofPixError = createError(
      ERROR_TYPES.EXIF_EXTRACTION_FAILED,
      error,
      { errorInfo, component: 'ErrorBoundary' }
    );

    logError(proofPixError, this.props.analytics);

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">
              <LucideIcons.AlertCircle size={48} />
            </div>
            
            <h2>Something went wrong</h2>
            <p>ProofPix encountered an unexpected error and needs to restart.</p>
            
            <div className="error-boundary-actions">
              <button 
                onClick={this.handleRetry}
                className="error-boundary-retry"
              >
                <LucideIcons.RefreshCw size={16} />
                Try Again
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="error-boundary-reload"
              >
                <LucideIcons.RotateCcw size={16} />
                Refresh Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-boundary-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error?.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
EOF

# Create src/components/FileUpload.tsx
cat > src/components/FileUpload.tsx << 'EOF'
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.heic', '.heif']
    },
    multiple: false
  });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      <div className="dropzone-content">
        <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p>Drag & drop an image here</p>
        <p className="subtitle">or click to select a file</p>
        <p className="subtitle">JPG+PNG+HEIC+TIFF+ more</p>
      </div>
    </div>
  );
}; 
EOF

# Create src/components/MainContent.tsx
cat > src/components/MainContent.tsx << 'EOF'
import React from 'react';
import { FileUpload } from './FileUpload';
import { FileInfo } from './FileInfo';

interface MainContentProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  exifData: any | null;
}

export const MainContent: React.FC<MainContentProps> = ({
  onFileSelect,
  selectedFile,
  exifData
}) => {
  return (
    <main className="proofpix-main">
      <section className="title-section">
        <h1>ProofPix EXIF Data Tool</h1>
        <p className="subtitle">
          Quickly extract and view EXIF metadata from your images
        </p>
      </section>

      {!selectedFile ? (
        <FileUpload onFileSelect={onFileSelect} />
      ) : (
        <FileInfo file={selectedFile} exifData={exifData} />
      )}
    </main>
  );
};
EOF

# Create src/components/Header.tsx
cat > src/components/Header.tsx << 'EOF'
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="proofpix-header">
      <div className="header-content">
        <h1>ProofPix</h1>
      </div>
    </header>
  );
};
EOF

# Create src/components/FileInfo.tsx
cat > src/components/FileInfo.tsx << 'EOF'
import React from 'react';
import { useExifExtraction } from '../hooks/useExifExtraction';

interface FileInfoProps {
  file: File;
  onReset: () => void;
}

export const FileInfo: React.FC<FileInfoProps> = ({ file, onReset }) => {
  const { metadata, loading, error } = useExifExtraction(file);

  if (loading) {
    return (
      <div className="file-info-card">
        <p>Loading metadata...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-info-card">
        <p>Error loading metadata: {error}</p>
        <button onClick={onReset}>Try another file</button>
      </div>
    );
  }

  return (
    <>
      <div className="file-info-card">
        <h2>File Information</h2>
        <div className="file-info-row">
          <span className="file-info-label">Name:</span>
          <span className="file-info-value">{file.name}</span>
        </div>
        <div className="file-info-row">
          <span className="file-info-label">Size:</span>
          <span className="file-info-value">{(file.size / 1024).toFixed(2)} KB</span>
        </div>
        <div className="file-info-row">
          <span className="file-info-label">Type:</span>
          <span className="file-info-value">{file.type || 'Unknown'}</span>
        </div>
      </div>

      {metadata && (
        <div className="export-section">
          <h2>Export Data</h2>
          <p className="export-description">
            Export your EXIF metadata in different formats for analysis or documentation.
          </p>
          <button className="export-button">
            Export as JSON
          </button>
        </div>
      )}
    </>
  );
}; 
EOF

# Create src/hooks/useExifExtraction.ts
cat > src/hooks/useExifExtraction.ts << 'EOF'
import { useState, useEffect } from 'react';
import EXIF from 'exif-js';

export const useExifExtraction = (file: File) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const extractExif = async () => {
      try {
        EXIF.getData(file as any, function(this: any) {
          const exifData = EXIF.getAllTags(this);
          setMetadata(exifData);
          setLoading(false);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to extract EXIF data');
        setLoading(false);
      }
    };

    extractExif();
  }, [file]);

  return { metadata, loading, error };
};
EOF

# Create src/utils/errorUtils.js
cat > src/utils/errorUtils.js << 'EOF'
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
EOF

# Create src/ProofPix.js
cat > src/ProofPix.js << 'EOF'
// COMPLETE FIXED ProofPix.js
import React, { useState, useRef, useCallback, useEffect, useMemo, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import * as LucideIcons from 'lucide-react';
import _ from 'lodash';
import './ProofPix.css';

// Import your hooks and utilities
import { useImageProcessing } from './hooks/useImageProcessing';
import { useExifExtraction } from './hooks/useExifExtraction';
import { usePdfGenerator } from './hooks/usePdfGenerator';
import { useProgressiveUpload } from './hooks/useProgressiveUpload';
import { useErrorHandler } from './hooks/useErrorHandler';
import { Logger } from './utils/logger';

// Import components
import ProcessingModeToggle from './components/ProcessingModeToggle';
import UploadArea from './components/UploadArea';
import ProgressiveLoader from './components/ProgressiveLoader';
import ImagePreview from './components/ImagePreview';
import ExifDisplay from './components/ExifDisplay';
import ErrorToastContainer from './components/ErrorToastContainer';
import ImageComparisonTool from './components/ImageComparisonTool';
import MobileNav from './components/MobileNav';
import { mobileUtils } from './utils/mobileUtils';
import { useEnhancedCapture } from './hooks/useEnhancedCapture';
import LimitModal from './components/modals/LimitModal';
import UsageIndicator from './components/UsageIndicator';
import ImageProcessor from './components/ImageProcessor';

// Import config and environment
import { APP_CONFIG } from './config/app.config';
import { ENV } from './utils/environment';

// Import other utilities
import { 
  getUsageData, 
  updateUsage, 
  checkLimit, 
  getRemainingUses,
  getLimitInfo
} from './utils/usageUtils';

const logger = new Logger('ProofPix');

// Main ProofPix Component with Performance Optimizations
const ProofPix = memo(() => {
  // State management
  const [activeView, setActiveView] = useState('preview');
  const isMobile = mobileUtils.isMobile();
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [exifData, setExifData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [overlayTimestamp, setOverlayTimestamp] = useState(false);
  const [outputSize, setOutputSize] = useState('original');
  const [showFullExif, setShowFullExif] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('image');
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitType, setLimitType] = useState('');
  const [screenReaderMessage, setScreenReaderMessage] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [processingError, setProcessingError] = useState(null);
  const { captureWithMetadata } = useEnhancedCapture();
  
  // ADD MISSING STATE VARIABLES
  const [showExifStrippedWarning, setShowExifStrippedWarning] = useState(false);
  const [exifStrippedReason, setExifStrippedReason] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Refs
  const canvasRef = useRef(null);

  // Add useEffect for mobile setup
  useEffect(() => {
    if (isMobile) {
      mobileUtils.setViewport();
      mobileUtils.preventZoom();
    }
  }, [isMobile]);
  
  // Custom hooks
  const { extractExif } = useExifExtraction();
  const { generatePdfReport } = usePdfGenerator();
  const { 
    errors, 
    addError, 
    removeError, 
    executeRetry, 
    addRetryAction,
    handleAsyncError 
  } = useErrorHandler();
  
  const {
    uploadStage,
    uploadProgress,
    uploadError,
    stages,
    isUploading,
    isComplete,
    startUpload,
    nextStage,
    completeUpload,
    resetUpload,
    setError: setUploadError
  } = useProgressiveUpload();
  
  // PERFORMANCE OPTIMIZATION: Use the new image processing hook
  const processedImageData = useImageProcessing(image, exifData);
  
  // PERFORMANCE OPTIMIZATION: Memoize expensive calculations
  const currentUsage = useMemo(() => getUsageData(), []);
  
  const usageStats = useMemo(() => ({
    canUpload: checkLimit('uploads'),
    canDownloadImage: checkLimit('imageDownloads'),
    canDownloadPdf: checkLimit('pdfDownloads'),
    canExportData: checkLimit('dataExports'),
    remainingUploads: getRemainingUses('uploads'),
    remainingImages: getRemainingUses('imageDownloads'),
    remainingPdfs: getRemainingUses('pdfDownloads'),
    remainingExports: getRemainingUses('dataExports')
  }), [currentUsage]);

  // PERFORMANCE OPTIMIZATION: Memoize GPS coordinates
  const gpsCoordinates = useMemo(() => {
    return processedImageData?.gps || null;
  }, [processedImageData?.gps]);
  
  // ADD THE MISSING formatExifValue FUNCTION
  const formatExifValue = useCallback((type, value) => {
    if (!value) return 'Unknown';
    
    switch (type) {
      case 'aperture':
        return typeof value === 'number' ? `f/${value}` : value;
      case 'shutterSpeed':
        return typeof value === 'number' && value < 1 ? `1/${Math.round(1/value)}s` : `${value}s`;
      case 'focalLength':
        return `${value}mm`;
      case 'iso':
        return `ISO ${value}`;
      default:
        return String(value);
    }
  }, []);
  
  // PERFORMANCE OPTIMIZATION: Memoize file validation
  const validateImageFileEnhanced = useCallback(
    _.memoize((file) => {
      if (!file) {
        addError('INVALID_FILE_TYPE', null, { fileName: 'No file' });
        return { valid: false };
      }
      
      // Basic file validation
      if (!file.type.startsWith('image/')) {
        addError('INVALID_FILE_TYPE', null, { fileName: file.name });
        return { valid: false };
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        addError('FILE_TOO_LARGE', null, { fileName: file.name, fileSize: file.size });
        return { valid: false };
      }
      
      return { valid: true };
    }, (file) => `${file?.name}-${file?.size}-${file?.type}`),
    [addError]
  );
  
  // PERFORMANCE OPTIMIZATION: Debounced screen reader announcements
  const announceToScreenReader = useCallback(
    _.debounce((message, priority = 'polite') => {
      setScreenReaderMessage('');
      setTimeout(() => setScreenReaderMessage(message), 100);
    }, 300),
    []
  );
  
  // PERFORMANCE OPTIMIZATION: Memoized file upload handler
  const onDropHandler = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    if (!usageStats.canUpload) {
      setLimitType('uploads');
      setShowLimitModal(true);
      return;
    }
    
    const file = acceptedFiles[0];
    
    startUpload();
    announceToScreenReader('Upload started, validating file...');
    
    try {
      const validation = validateImageFileEnhanced(file);
      if (!validation.valid) {
        resetUpload();
        return;
      }
      
      nextStage();
      updateUsage('uploads');
      
      // Clean up previous preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setImage(file);
      nextStage();
      
      // First, try to extract EXIF normally
      let extractedExif = await extractExif(file);
      
      // Only use enhanced capture if we got little or no EXIF data AND we're on iOS
      if (mobileUtils.isIOS() && (!extractedExif || Object.keys(extractedExif).length < 3)) {
        logger.info('No EXIF found on iOS, attempting enhanced capture');
        try {
          const enhanced = await captureWithMetadata(file);
          // Create a new file object with enhanced metadata
          const enhancedFile = Object.assign(file, {
            enhancedMetadata: enhanced.metadata
          });
          // Re-extract with enhanced metadata
          extractedExif = await extractExif(enhancedFile);
        } catch (error) {
          logger.warn('Enhanced capture failed, using original EXIF data');
        }
      }
      
      setExifData(extractedExif);
      
      // Update warning messages
      if (extractedExif && extractedExif.source === 'enhanced-only') {
        setShowExifStrippedWarning(true);
        setExifStrippedReason('iOS removed the original EXIF data, but we\'ve captured device information instead.');
      } else if (extractedExif && Object.keys(extractedExif).length < 5) {
        setShowExifStrippedWarning(true);
        if (mobileUtils.isIOS()) {
          setExifStrippedReason('This image has limited metadata. iOS may have removed some data when sharing.');
        } else {
          setExifStrippedReason('This image has limited metadata, possibly from social media or editing software.');
        }
      }
      
      nextStage();
      completeUpload();
      announceToScreenReader('Upload complete! Image and metadata are ready.');
      
    } catch (error) {
      setUploadError(error.message);
      setExifData({ error: "Unable to extract EXIF data from this image." });
      completeUpload();
    }
  }, [
    usageStats.canUpload,
    extractExif,
    previewUrl,
    validateImageFileEnhanced,
    startUpload,
    nextStage,
    completeUpload,
    resetUpload,
    setUploadError,
    announceToScreenReader
  ]);

  // PERFORMANCE OPTIMIZATION: Memoized download handlers
  const downloadImageEnhanced = useCallback(async () => {
    if (!previewUrl || !usageStats.canDownloadImage) {
      if (!usageStats.canDownloadImage) {
        setLimitType('imageDownloads');
        setShowLimitModal(true);
      }
      return;
    }
    
    try {
      setIsDownloading(true);
      updateUsage('imageDownloads');
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = `proofpix-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      announceToScreenReader('Image download started');
      setIsDownloading(false);
    } catch (error) {
      addError('DOWNLOAD_FAILED', error);
      setIsDownloading(false);
    }
  }, [previewUrl, usageStats.canDownloadImage, announceToScreenReader, addError]);
  
  const downloadPdfEnhanced = useCallback(async () => {
    if (!image || !exifData || !usageStats.canDownloadPdf) {
      if (!usageStats.canDownloadPdf) {
        setLimitType('pdfDownloads');
        setShowLimitModal(true);
      }
      return;
    }
    
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      announceToScreenReader('Generating PDF report...');
      updateUsage('pdfDownloads');
      
      await handleAsyncError(
        () => generatePdfReport(image, exifData, previewUrl, showFullExif, canvasRef),
        'PDF_GENERATION_FAILED',
        { hasImage: !!image, hasExifData: !!exifData }
      );
      
      setDownloadProgress(100);
      announceToScreenReader('PDF report generated and download started');
      setIsDownloading(false);
    } catch (error) {
      const errorId = error.errorId;
      if (errorId) {
        addRetryAction(errorId, () => downloadPdfEnhanced());
      }
      setIsDownloading(false);
    }
  }, [
    image, 
    exifData, 
    previewUrl, 
    showFullExif, 
    usageStats.canDownloadPdf, 
    generatePdfReport, 
    handleAsyncError, 
    addRetryAction,
    announceToScreenReader
  ]);

  const handleDownload = useCallback(() => {
    if (downloadFormat === 'pdf') {
      downloadPdfEnhanced();
    } else {
      downloadImageEnhanced();
    }
  }, [downloadFormat, downloadPdfEnhanced, downloadImageEnhanced]);
  
  // PERFORMANCE OPTIMIZATION: Memoized GPS copy handler
  const copyGpsCoordinates = useCallback(async () => {
    if (!gpsCoordinates) return;
    
    try {
      await navigator.clipboard.writeText(gpsCoordinates.coordsText);
      setShowCopiedTooltip(true);
      announceToScreenReader('GPS coordinates copied to clipboard');
      setTimeout(() => setShowCopiedTooltip(false), 2000);
    } catch (error) {
      prompt('Copy these coordinates:', gpsCoordinates.coordsText);
    }
  }, [gpsCoordinates, announceToScreenReader]);
  
  // PERFORMANCE OPTIMIZATION: Memoize can download check
  const canDownload = useMemo(() => {
    return downloadFormat === 'pdf' ? usageStats.canDownloadPdf : usageStats.canDownloadImage;
  }, [downloadFormat, usageStats.canDownloadPdf, usageStats.canDownloadImage]);
  
  // Handle image processing completion
  const handleProcessingComplete = useCallback(({ processedImage, exifData, dimensions }) => {
    setProcessedImage(processedImage);
    setExifData(exifData);
    setProcessingError(null);
  }, []);

  // Handle image processing error
  const handleProcessingError = useCallback((error) => {
    setProcessingError(error);
    addError('Error processing image: ' + error.message);
  }, [addError]);

  return (
    <div className="proofpix-container">
      <header className="proofpix-header">
        <div className="header-content">
          <div className="logo">
            <img 
              src="/proofpixtoplogo.png" 
              alt="ProofPix Logo" 
              className="logo-image"
            />
          </div>
        </div>
      </header>
      <main id="main-content" className="proofpix-main" role="main">
        {/* Title Section */}
        <div className="title-section">
          <h1>Don't Just Send a Photo — Send Proof. <span className="lock-icon" aria-label="Secure">🔒</span></h1>
          <p className="subtitle">Extract and view EXIF metadata from your images, locally.</p>
          <p className="privacy-note">All processing happens in your browser. Your photos never leave your device.</p>
        </div>
        
        {/* Processing Mode Toggle - Coming Soon */}
        <ProcessingModeToggle
          isBulkMode={false}
          onToggle={() => {}} // No-op for coming soon
          disabled={false}
        />
        
        {/* Always show single file processing */}
        <UploadArea 
          onDrop={onDropHandler}
          canUpload={usageStats.canUpload}
          remainingUploads={usageStats.remainingUploads}
        />
        
        {/* Progressive Upload Loader */}
        {isUploading && (
          <ProgressiveLoader 
            stages={stages}
            currentStage={uploadStage}
            className="upload-progress-loader"
          />
        )}
        
        {/* Usage Section */}
        <UsageIndicator />

        {/* Why ProofPix Section */}
        <div className="why-proofpix">
          <h2>Why ProofPix?</h2>
          <hr className="section-divider" />
        </div>

        {/* Features Section */}
        <div className="features-section" role="region" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Key Features</h2>
          
          <div className="feature">
            <div className="feature-icon-container">
              <LucideIcons.Shield className="feature-icon" aria-hidden="true" />
            </div>
            <h3>🔐 Built for Privacy</h3>
            <p>All processing happens directly in your browser. Your photos never leave your device.</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon-container">
              <LucideIcons.Clock className="feature-icon" aria-hidden="true" />
            </div>
            <h3>⚡ Instant Results</h3>
            <p>Upload, inspect, and export your metadata in seconds — no account or signup needed.</p>
          </div>
          
          <div className="feature coming-soon-feature">
            <div className="feature-icon-container">
              <LucideIcons.Layers className="feature-icon" aria-hidden="true" />
            </div>
            <h3>🚀 Bulk Processing <span className="coming-soon-badge">Coming Soon</span></h3>
            <p>Process multiple images simultaneously with advanced export options. Available with Premium.</p>
          </div>

          <div className="feature">
            <div className="feature-icon-container">
              <LucideIcons.GitCompare className="feature-icon" aria-hidden="true" />
            </div>
            <h3>🔍 Compare Images</h3>
            <p>Compare two images side-by-side and analyze their metadata differences.</p>
            <button 
              onClick={() => setShowComparison(true)} 
              className="feature-btn"
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Open Comparison Tool
            </button>
          </div>
        </div>

        {showComparison && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            zIndex: 1000,
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setShowComparison(false)}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                backgroundColor: '#1a202c',
                color: 'white',
                border: '1px solid #4a5568',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                zIndex: 1001
              }}
            >
              <LucideIcons.X size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Close
            </button>
            <ImageComparisonTool />
          </div>
        )}

        {/* Results Section */}
        {image && !isUploading && (
          <div className="results-section" role="region" aria-labelledby="results-heading">
            <h2 id="results-heading" className="sr-only">Processing Results</h2>
            
            <ImageProcessor
              image={image}
              overlayTimestamp={overlayTimestamp}
              outputSize={outputSize}
              onProcessingComplete={handleProcessingComplete}
              onError={handleProcessingError}
            />
            
            {processedImage && !processingError && (
              <>
                <ImagePreview 
                  previewUrl={previewUrl}
                  isProcessing={false}
                  overlayTimestamp={overlayTimestamp}
                  setOverlayTimestamp={setOverlayTimestamp}
                  outputSize={outputSize}
                  setOutputSize={setOutputSize}
                  downloadFormat={downloadFormat}
                  setDownloadFormat={setDownloadFormat}
                  onDownload={handleDownload}
                  canDownload={canDownload}
                  downloadProgress={downloadProgress}
                  isDownloading={isDownloading}
                />
                
                <ExifDisplay 
                  image={image}
                  exifData={exifData}
                  isProcessing={false}
                  showExifStrippedWarning={showExifStrippedWarning}
                  exifStrippedReason={exifStrippedReason}
                  setShowExifStrippedWarning={setShowExifStrippedWarning}
                  showFullExif={showFullExif}
                  setShowFullExif={setShowFullExif}
                  gpsCoordinates={gpsCoordinates}
                  onCopyGps={copyGpsCoordinates}
                  showCopiedTooltip={showCopiedTooltip}
                  formatExifValue={formatExifValue}
                />
              </>
            )}
          </div>
        )}

        {/* Tech Details */}
        <div className="tech-details">
          <p>Built with React, Tailwind CSS, and exif-js.</p>
          <p>All image processing happens locally. No data leaves your browser.</p>
          {ENV.isDevelopment && (
            <p>Development mode - Enhanced logging enabled</p>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="proofpix-footer" role="contentinfo">
        <div className="copyright">
          © 2025 {APP_CONFIG.name}. Built for gig workers, by gig workers.
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="https://proofpixapp.com/#">Home</a>
          <a href="https://proofpixapp.com/#faq">F.A.Q.</a>
          <a href="https://proofpixapp.com/#about">About</a>
          <a href="https://proofpixapp.com/#privacy">Privacy</a>
          <a href="https://proofpixapp.com/#contact">Contact</a>
          <a href="https://blog.proofpixapp.com/">Blog</a>
        </nav>
        <div className="footer-info">
          Privacy-focused EXIF metadata tool - v{APP_CONFIG.version}
        </div>
      </footer>

      {/* Error Toast Container */}
      <ErrorToastContainer 
        errors={errors}
        onRemoveError={removeError}
        onRetry={executeRetry}
      />
      
      {/* Limit Modal */}
      <LimitModal 
        showLimitModal={showLimitModal}
        setShowLimitModal={setShowLimitModal}
        limitType={limitType}
        limitInfo={getLimitInfo(limitType)}
      />
      
      {/* Screen Reader Messages */}
      {screenReaderMessage && (
        <div className="sr-only" aria-live="polite">
          {screenReaderMessage}
        </div>
      )}

      <MobileNav
        activeView={activeView}
        setActiveView={setActiveView}
        hasImage={!!image}
        onOpenComparison={() => setShowComparison(true)}
      />
    </div>
  );
});

// Set display names for better debugging
UsageIndicator.displayName = 'UsageIndicator';
LimitModal.displayName = 'LimitModal';
ProofPix.displayName = 'ProofPix';

export default ProofPix;
EOF

echo "Making script executable..."
chmod +x restore-project.sh

echo "Project structure created successfully!" 