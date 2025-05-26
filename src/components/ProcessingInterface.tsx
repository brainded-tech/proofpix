import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { overlayTimestamp, processImage, downloadImage } from '../utils/imageUtils';
import { generatePDF, downloadPDF } from '../utils/pdfUtils';
import { formatDateTime } from '../utils/formatters';
import { ImagePreview } from './ImagePreview';
import { MetadataPanel } from './MetadataPanel';
import { Sponsorship } from './Sponsorships';
import SocialShare from './SocialShare';
import EnhancedExportDialog from './EnhancedExportDialog';
import { ProcessedImage, ImageOutputOptions } from '../types';
import { analytics, trackTimestampOverlay, trackPDFExport, trackJSONExport, trackImageExport, usageTracker } from '../utils/analytics';
import SessionManager from '../utils/sessionManager';
import PaymentProtection from './PaymentProtection';

interface ProcessingInterfaceProps {
  processedImage: ProcessedImage;
  onBackToHome: () => void;
}

export const ProcessingInterface: React.FC<ProcessingInterfaceProps> = ({
  processedImage,
  onBackToHome
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [currentImage, setCurrentImage] = useState<ProcessedImage>(processedImage);
  const [outputOptions, setOutputOptions] = useState<ImageOutputOptions>({
    size: 'original',
    format: 'jpeg',
    quality: 0.9
  });
  const [showEnhancedExport, setShowEnhancedExport] = useState(false);
  
  const navigate = useNavigate();

  const handleToggleTimestamp = useCallback(async () => {
    if (!currentImage) return;

    if (!showTimestamp) {
      // Add timestamp overlay
      if (currentImage.metadata.dateTime) {
        try {
          setIsLoading(true);
          const timestamp = formatDateTime(currentImage.metadata.dateTime);
          const timestampedUrl = await overlayTimestamp(currentImage.previewUrl, timestamp);
          
          setCurrentImage({
            ...currentImage,
            timestampedUrl
          });
          setShowTimestamp(true);
          
          // Track timestamp overlay usage (privacy-friendly)
          trackTimestampOverlay();
          analytics.trackFeatureUsage('Timestamp Overlay', 'Added');
        } catch (err) {
          console.error('Error adding timestamp:', err);
          setError('Failed to add timestamp overlay.');
          analytics.trackError('Timestamp Overlay', 'Failed to Add');
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('No timestamp data available in this image.');
        analytics.trackError('Timestamp Overlay', 'No Timestamp Data');
      }
    } else {
      // Remove timestamp overlay
      setShowTimestamp(false);
      analytics.trackFeatureUsage('Timestamp Overlay', 'Removed');
    }
  }, [currentImage, showTimestamp]);

  const handleDownload = useCallback(async () => {
    if (!currentImage) return;

    try {
      setIsLoading(true);
      
      const sourceUrl = showTimestamp && currentImage.timestampedUrl 
        ? currentImage.timestampedUrl 
        : currentImage.previewUrl;

      // Process image with current options
      const processed = await processImage(sourceUrl, outputOptions);
      
      // Generate filename
      const baseName = currentImage.file.name.replace(/\.[^/.]+$/, '');
      const timestamp = showTimestamp ? '_timestamped' : '';
      const filename = `${baseName}${timestamp}_proofpix.${outputOptions.format}`;
      
      downloadImage(processed.url, filename);
      
      // Track download (privacy-friendly)
      trackImageExport(outputOptions.format);
      analytics.trackFeatureUsage('Image Download', showTimestamp ? 'With Timestamp' : 'Original');
      
      // Update usage stats
      usageTracker.incrementImageDownload();
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Failed to download image.');
      analytics.trackError('Image Download', 'Failed');
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, showTimestamp, outputOptions]);

  const handleExportPDF = useCallback(async () => {
    if (!currentImage) return;

    // 🔒 PAYMENT PROTECTION: Check PDF generation limits
    const canUseUnlimitedPDF = SessionManager.canPerformAction('unlimited_pdf');
    const currentPlan = SessionManager.getCurrentPlan();
    
    // For free users, track usage and show upgrade prompt after 3 PDFs
    if (!canUseUnlimitedPDF && currentPlan.usage && currentPlan.usage.pdfDownloads >= 3) {
      analytics.trackFeatureUsage('Payment Protection', 'PDF Limit Reached');
      navigate('/pricing');
      return;
    }

    try {
      setIsLoading(true);
      const pdfBlob = await generatePDF(currentImage, showTimestamp);
      
      // Create custom filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                       new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('-')[0];
      const filename = `ProofPixFieldReport_${timestamp}.pdf`;
      
      downloadPDF(pdfBlob, filename);
      
      // Track PDF export (privacy-friendly)
      trackPDFExport();
      analytics.trackFeatureUsage('PDF Export', showTimestamp ? 'With Timestamp' : 'Standard');
      
      // Update usage stats
      usageTracker.incrementPdfDownload();
      SessionManager.updateUsage('pdf');
      
      // Show upgrade hint for free users approaching limit
      if (!canUseUnlimitedPDF && currentPlan.usage && currentPlan.usage.pdfDownloads >= 2) {
        console.log('💡 Upgrade hint: You have 1 PDF download remaining. Upgrade for unlimited PDFs!');
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF report.');
      analytics.trackError('PDF Export', 'Failed');
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, showTimestamp, navigate]);

  const handleExportJSON = useCallback(() => {
    if (!currentImage) return;

    try {
      const jsonData = {
        fileName: currentImage.metadata.fileName,
        exportTimestamp: new Date().toISOString(),
        metadata: currentImage.metadata,
        processingOptions: {
          timestampOverlay: showTimestamp,
          outputOptions
        }
      };

      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const baseName = currentImage.file.name.replace(/\.[^/.]+$/, '');
      const filename = `${baseName}_metadata.json`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Track JSON export (privacy-friendly)
      trackJSONExport();
      analytics.trackFeatureUsage('JSON Export', 'Metadata');
      
      // Update usage stats
      usageTracker.incrementDataExport();
    } catch (err) {
      console.error('Error exporting JSON:', err);
      setError('Failed to export metadata as JSON.');
      analytics.trackError('JSON Export', 'Failed');
    }
  }, [currentImage, showTimestamp, outputOptions]);

  const handleOutputOptionsChange = useCallback((newOptions: Partial<ImageOutputOptions>) => {
    setOutputOptions(prev => ({ ...prev, ...newOptions }));
    analytics.trackFeatureUsage('Output Options', `${newOptions.format || 'format'}_${newOptions.size || 'size'}`);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAboutClick = () => {
    analytics.trackFeatureUsage('Navigation', 'About Us - Processing Interface');
    navigate('/about');
  };

  const handlePrivacyClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Privacy Policy - Processing Interface');
    navigate('/privacy');
  };

  const handleFAQClick = () => {
    analytics.trackFeatureUsage('Navigation', 'FAQ - Processing Interface');
    navigate('/faq');
  };

  const handleContactClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Contact - Processing Interface Footer');
    window.location.href = 'https://proofpixapp.com/#contact';
  };

  const handleTermsClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Terms - Processing Interface');
    navigate('/terms');
  };

  const handleSupportClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Support - Processing Interface');
    navigate('/support');
  };

  const handlePricingClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Pricing - Processing Interface');
    navigate('/pricing');
  };

  const handleAnalyticsClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Analytics - Processing Interface');
    navigate('/analytics');
  };

  const handleBatchManagementClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Batch Management - Processing Interface');
    navigate('/batch');
  };

  // 🔒 PAYMENT PROTECTION: Check if user can access enhanced export
  const canUseAdvancedExport = SessionManager.canPerformAction('advanced_export');

  const handleEnhancedExport = useCallback(() => {
    if (!canUseAdvancedExport) {
      analytics.trackFeatureUsage('Payment Protection', 'Advanced Export Blocked');
      navigate('/pricing');
      return;
    }
    
    setShowEnhancedExport(true);
    analytics.trackFeatureUsage('Enhanced Export', 'Dialog Opened');
  }, [canUseAdvancedExport, navigate]);

  const handleEnhancedExportComplete = useCallback((filename: string, format: string) => {
    analytics.trackFeatureUsage('Enhanced Export', `${format.toUpperCase()} Generated`);
    usageTracker.incrementDataExport();
    
    // Show success message
    console.log(`✅ Enhanced export completed: ${filename}`);
  }, []);

  const handleEnhancedExportClose = useCallback(() => {
    setShowEnhancedExport(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center cursor-pointer" onClick={onBackToHome}>
              <Camera className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold text-white">ProofPix</h1>
            </div>
            
            {/* Header Sponsorship for Processing Interface */}
            <div className="hidden lg:block">
              <Sponsorship placement="header" className="max-w-md" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-900 bg-opacity-50 border border-red-500 p-4 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
                <button 
                  onClick={clearError}
                  className="mt-2 text-sm text-red-300 underline hover:text-red-100"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-400">Processing image...</p>
          </div>
        )}

        {/* Image Processing Interface */}
        {currentImage && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Image Preview</h2>
              <ImagePreview
                image={currentImage}
                showTimestamp={showTimestamp}
                onToggleTimestamp={handleToggleTimestamp}
                onDownload={handleDownload}
                onExportPDF={handleExportPDF}
                onExportJSON={handleExportJSON}
                onEnhancedExport={canUseAdvancedExport ? handleEnhancedExport : undefined}
                outputOptions={outputOptions}
                onOutputOptionsChange={handleOutputOptionsChange}
              />
            </div>

            {/* Metadata Panel */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Image Metadata</h2>
              <MetadataPanel metadata={currentImage.metadata} />
            </div>
          </div>
        )}

        {/* Content Sponsorship between main interface and footer */}
        <div className="mt-12 mb-8">
          <Sponsorship placement="content" className="max-w-2xl mx-auto" />
        </div>

        {/* Social Share Section - Show after successful processing */}
        {currentImage && !isLoading && (
          <div className="mt-12 mb-12 flex justify-center">
            <div className="w-full max-w-2xl px-4">
              <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
            <SocialShare 
              variant="prominent"
              onShare={(platform) => {
                analytics.trackFeatureUsage('Social Share', `Processing Interface - ${platform}`);
              }}
                  className="mx-auto"
            />
              </div>
            </div>
          </div>
        )}

        {/* New Image Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Upload className="mr-2 h-5 w-5" />
            Process Another Image
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-400">
            <p className="mb-2">
              ProofPix processes images locally in your browser. No personal data is collected.
            </p>
            <p className="mb-4">
              Privacy-respecting analytics • Direct sponsorships • Local EXIF processing
            </p>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <button onClick={onBackToHome} className="text-gray-400 hover:text-white">Home</button>
              <button onClick={handleFAQClick} className="text-gray-400 hover:text-white">F.A.Q.</button>
              <button onClick={handleAboutClick} className="text-gray-400 hover:text-white">About</button>
              <button onClick={handlePrivacyClick} className="text-gray-400 hover:text-white">Privacy</button>
              <button onClick={handleTermsClick} className="text-gray-400 hover:text-white">Terms</button>
              <button onClick={handleSupportClick} className="text-gray-400 hover:text-white">Support</button>
              <button onClick={handleContactClick} className="text-gray-400 hover:text-white">Contact</button>
              <button onClick={handlePricingClick} className="text-gray-400 hover:text-white">Pricing</button>
              <button onClick={handleAnalyticsClick} className="text-gray-400 hover:text-white">Analytics</button>
              <button onClick={handleBatchManagementClick} className="text-gray-400 hover:text-white">Batch Manager</button>
            </nav>
          </div>
        </div>
      </footer>

      {/* Enhanced Export Dialog */}
      {showEnhancedExport && canUseAdvancedExport && (
        <EnhancedExportDialog
          {...{
            isOpen: showEnhancedExport,
            onClose: handleEnhancedExportClose,
            data: currentImage,
            onExportComplete: handleEnhancedExportComplete
          }}
        />
      )}

      {/* Payment Protection for Enhanced Export */}
      {showEnhancedExport && !canUseAdvancedExport && (
        <PaymentProtection
          feature="advanced_export"
          variant="modal"
          onClose={handleEnhancedExportClose}
        />
      )}
    </div>
  );
}; 