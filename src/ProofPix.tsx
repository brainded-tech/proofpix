import React, { useState, useCallback } from 'react';
import { extractMetadata } from './utils/metadata';
import { HomePage } from './components/HomePage';
import { ProcessingInterface } from './components/ProcessingInterface';
import { ProcessedImage } from './types';
import { errorLogger, logAsyncError } from './utils/errorLogger';
import { analytics } from './utils/analytics';

export const ProofPix: React.FC = () => {
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    // Define supported formats
    const supportedFormats = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/tiff',
      'image/heic',
      'image/heif'
    ];
    
    // Validate file type
    if (!supportedFormats.includes(file.type)) {
      const errorMessage = `Unsupported file format: ${file.type}. Please select JPEG, PNG, TIFF, or HEIC images.`;
      setError(errorMessage);
      
      // Track error (anonymized)
      analytics.trackError('File Validation', 'Unsupported Format');
      errorLogger.logMedium('File validation error', {
        fileType: file.type,
        fileName: file.name,
        supportedFormats
      });
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      const errorMessage = 'File too large. Please select an image smaller than 50MB.';
      setError(errorMessage);
      
      // Track error (anonymized)
      analytics.trackError('File Validation', 'File Too Large');
      errorLogger.logMedium('File size validation error', {
        fileSize: file.size,
        fileName: file.name,
        maxSize: 50 * 1024 * 1024
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      // Extract metadata
      const metadata = await extractMetadata(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      const newProcessedImage: ProcessedImage = {
        file,
        metadata,
        previewUrl
      };

      setProcessedImage(newProcessedImage);
      
      // Track successful processing (privacy-friendly)
      const hasGPS = !!(metadata.gpsLatitude && metadata.gpsLongitude);
      const metadataKeys = Object.keys(metadata).length;
      
      analytics.trackFileProcessing(file.type, hasGPS, metadataKeys);
      analytics.trackFeatureUsage('Metadata Extraction', 'Successful');
      
      // Log successful processing
      console.log('✅ Image processed successfully:', {
        fileName: file.name,
        hasGPS,
        metadataKeys
      });
    } catch (err) {
      console.error('Error processing image:', err);
      const errorMessage = 'Failed to process image. The image may not contain EXIF data or may be corrupted.';
      setError(errorMessage);
      
      // Track error (anonymized)
      analytics.trackError('Image Processing', 'Metadata Extraction Failed');
      
      // Log the error for analysis
      logAsyncError('Image Processing', err as Error, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        operation: 'extractMetadata'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBackToHome = useCallback(() => {
    setProcessedImage(null);
    setError(null);
    
    // Track navigation (privacy-friendly)
    analytics.trackFeatureUsage('Navigation', 'Back to Home');
  }, []);

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-300">Processing your image...</p>
          <p className="text-sm text-gray-400">Extracting EXIF metadata locally</p>
        </div>
      </div>
    );
  }

  // Show error screen if there's an error but no processed image
  if (error && !processedImage) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2 text-red-200">Processing Error</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                analytics.trackFeatureUsage('Error Recovery', 'Try Again');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render processing interface if image is processed
  if (processedImage) {
    return (
      <ProcessingInterface 
        processedImage={processedImage}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Render homepage by default
  return (
    <HomePage 
      onFileSelect={handleFileSelect}
      onBatchComplete={(images) => {
        // For now, just process the first image in batch mode
        // In the future, we could create a batch results view
        if (images.length > 0) {
          setProcessedImage(images[0]);
          analytics.trackFeatureUsage('Batch Processing', `Selected first of ${images.length} images`);
        }
      }}
    />
  );
}; 