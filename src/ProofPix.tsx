import React, { useState, useCallback } from 'react';
import { extractMetadata } from './utils/metadata';
import { EnterpriseHomePage } from './components/EnterpriseHomePage';
import { ProcessingInterface } from './components/ProcessingInterface';
import { ProcessedImage } from './types';
import { errorLogger, logAsyncError } from './utils/errorLogger';
import { getLoadingMessage } from './utils/loadingMessages';
import { AlertTriangle } from 'lucide-react';

export const ProofPix: React.FC = () => {
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromBatchResults, setIsFromBatchResults] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

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
    setLoadingProgress(0);

    try {
      // Simulate progress updates for better UX
      setLoadingProgress(20);
      
      // Extract metadata
      const metadata = await extractMetadata(file);
      setLoadingProgress(80);
      
      // Create processed image object
      const processedImg: ProcessedImage = {
        file,
        metadata,
        previewUrl: URL.createObjectURL(file)
      };

      setLoadingProgress(100);
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
      setLoadingProgress(0);
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

  const handleError = (error: string) => {
    let userFriendlyMessage = '';
    
    if (error.includes('file type') || error.includes('format')) {
      userFriendlyMessage = "We couldn't analyze this file type. ProofPix works best with photos from cameras and phones (JPEG, PNG, TIFF, or RAW files).";
    } else if (error.includes('size') || error.includes('large')) {
      userFriendlyMessage = "This photo is too large for us to analyze quickly. Please try a smaller file (under 50MB) or compress the image.";
    } else if (error.includes('corrupted') || error.includes('invalid')) {
      userFriendlyMessage = "This file appears to be damaged or corrupted. Try opening it in your photo app first, then save a new copy to analyze.";
    } else if (error.includes('network') || error.includes('connection')) {
      userFriendlyMessage = "Having trouble connecting. Check your internet connection and try again—your photos are still processed privately on your device.";
    } else if (error.includes('processing') || error.includes('failed')) {
      userFriendlyMessage = "We ran into an issue analyzing this photo. This sometimes happens with unusual file formats—try a different photo or contact support if this keeps happening.";
    } else {
      userFriendlyMessage = "Something unexpected happened. Please try again, and if the problem continues, our support team is here to help.";
    }
    
    setError(userFriendlyMessage);
    setIsLoading(false);
    setLoadingProgress(0);
  };

  const getLoadingMessage = () => {
    const messages = [
      "Discovering your photo's hidden story...",
      "Extracting location and timestamp data...",
      "Analyzing camera settings and technical details...",
      "Checking for editing history and modifications...",
      "Generating your comprehensive photo report...",
      "Almost done—preparing your results..."
    ];
    
    const progressMessages = [
      "Reading photo information...",
      "Processing metadata...", 
      "Analyzing technical details...",
      "Finalizing your report..."
    ];
    
    if (loadingProgress < 25) return messages[0];
    if (loadingProgress < 50) return messages[1];
    if (loadingProgress < 75) return messages[2];
    if (loadingProgress < 90) return messages[3];
    return messages[4];
  };

  // Show loading screen with enterprise styling
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Analyzing Your Photo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {getLoadingMessage()}
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Everything happens in your browser—completely private
          </p>
        </div>
      </div>
    );
  }

  // Show error screen with enterprise styling
  if (error && !processedImage) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 shadow-2xl">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Let's Try That Again
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {error}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setError(null)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Another Photo
            </button>
            <button
              onClick={() => {
                setError(null);
                // Could add support contact functionality here
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Get Help
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
