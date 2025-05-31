import React, { useState, useCallback } from 'react';
import { extractMetadata } from './utils/metadata';
import { EnterpriseHomePage } from './components/EnterpriseHomePage';
import { ProcessingInterface } from './components/ProcessingInterface';
import { ProcessedImage } from './types';
import { errorLogger, logAsyncError } from './utils/errorLogger';

export const ProofPix: React.FC = () => {
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromBatchResults, setIsFromBatchResults] = useState(false);

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
      const errorMessage = `This file type isn't supported yet. We work best with photos from cameras and phones (JPEG, PNG, TIFF, or HEIC formats).`;
      setError(errorMessage);
      
      // Track error (anonymized)
      errorLogger.logMedium('File validation error', {
        fileType: file.type,
        fileName: file.name,
        supportedFormats
      });
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      const errorMessage = 'This photo is too large for us to analyze. Please try a photo smaller than 50MB, or compress it first.';
      setError(errorMessage);
      
      // Track error (anonymized)
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
      
      // Create processed image object
      const processedImg: ProcessedImage = {
        file,
        metadata,
        previewUrl: URL.createObjectURL(file)
      };

      setProcessedImage(processedImg);
      
      // Track successful processing (anonymized)
      errorLogger.logLow('File processed successfully', {
        fileType: file.type,
        fileSize: file.size,
        metadataKeys: Object.keys(metadata).length,
        processingTime: Date.now()
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'We couldn\'t analyze this photo. This sometimes happens with unusual file formats or corrupted images. Try a different photo or convert it to JPEG first.';
      setError(errorMessage);
      
      // Track processing error (anonymized)
      logAsyncError('File processing error', err instanceof Error ? err : new Error(String(err)), {
        fileType: file.type,
        fileSize: file.size,
        fileName: file.name
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBackToHome = useCallback(() => {
    setProcessedImage(null);
    setError(null);
    setIsFromBatchResults(false);
  }, []);

  const handleBackToBatch = useCallback(() => {
    setProcessedImage(null);
    setError(null);
    setIsFromBatchResults(false);
    // Additional logic for returning to batch view could go here
  }, []);

  // Show loading screen with enterprise styling
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Processing Your Image</h2>
          <p className="text-slate-400 mb-2">Extracting EXIF metadata securely on your device</p>
          <p className="text-sm text-slate-500">Your data never leaves this browser</p>
        </div>
      </div>
    );
  }

  // Show error screen with enterprise styling
  if (error && !processedImage) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 mb-8 backdrop-blur-sm">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">Processing Error</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">{error}</p>
            <button 
              onClick={() => {
                setError(null);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
        onBackToBatch={isFromBatchResults ? handleBackToBatch : undefined}
        showBatchBackButton={isFromBatchResults}
      />
    );
  }

  // Render homepage by default
  return (
    <EnterpriseHomePage 
      onFileSelect={handleFileSelect}
      onBatchComplete={(images) => {
        // Stay in batch mode and show results - don't auto-navigate to single image view
        // The EnterpriseHomePage will handle showing the batch results
      }}
      onImageSelect={(image) => {
        // Navigate to individual image view from batch results
        setProcessedImage(image);
        setIsFromBatchResults(true);
      }}
    />
  );
}; 
