import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, AlertCircle, ArrowLeft, Download, FileText, Settings, Eye, Share2, Home, ExternalLink } from 'lucide-react';
import { overlayTimestamp, processImage, downloadImage } from '../utils/imageUtils';
import { generatePDF, downloadPDF } from '../utils/pdfUtils';
import { formatDateTime } from '../utils/formatters';
import { ImagePreview } from './ImagePreview';
import { MetadataPanel } from './MetadataPanel';
import SocialShare from './SocialShare';
import EnhancedExportDialog from './EnhancedExportDialog';
import { ProcessedImage, ImageOutputOptions } from '../types';
import { analytics, trackTimestampOverlay, trackPDFExport, trackJSONExport, trackImageExport, usageTracker } from '../utils/analytics';
import SessionManager from '../utils/sessionManager';
import PaymentProtection from './PaymentProtection';

interface ProcessingInterfaceProps {
  processedImage: ProcessedImage;
  onBackToHome: () => void;
  onBackToBatch?: () => void;
  showBatchBackButton?: boolean;
  standalone?: boolean;
}

export const ProcessingInterface: React.FC<ProcessingInterfaceProps> = ({
  processedImage,
  onBackToHome,
  onBackToBatch,
  showBatchBackButton = false,
  standalone = true
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
      const baseName = currentImage.file?.name?.replace(/\.[^/.]+$/, '') || 'image';
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
      
      const baseName = currentImage.file?.name?.replace(/\.[^/.]+$/, '') || 'image';
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
    <div className="min-h-screen bg-[#0f1729] text-slate-100">
      {/* Modern Header */}
      {standalone && (
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo - Clickable to go home */}
              <div className="flex items-center cursor-pointer group" onClick={onBackToHome}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">ProofPix</h1>
                  <p className="text-xs text-slate-400 -mt-0.5">Image Analysis Complete</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Back to Batch Results Button */}
                {showBatchBackButton && onBackToBatch && (
                  <button
                    onClick={onBackToBatch}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Batch</span>
                  </button>
                )}
                
                {/* New Analysis Button */}
                <button
                  onClick={onBackToHome}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium"
                >
                  <Upload className="h-4 w-4" />
                  <span>New Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
                Image Analysis Results
              </h1>
              <p className="text-slate-400">
                {currentImage?.file?.name || 'Uploaded Image'} • {currentImage?.metadata?.fileSize || 'Unknown size'}
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              <button
                onClick={handleDownload}
                disabled={isLoading}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-100 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                <span>PDF Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-500/50 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-200">{error}</p>
                <button 
                  onClick={clearError}
                  className="mt-2 text-sm text-red-300 underline hover:text-red-100 transition-colors"
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-400">Processing image...</p>
          </div>
        )}

        {/* Main Analysis Interface */}
        {currentImage && !isLoading && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Image Preview Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-100 flex items-center">
                  <Eye className="h-5 w-5 text-blue-400 mr-2" />
                  Image Preview
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                    {outputOptions.format.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                    {outputOptions.size}
                  </span>
                </div>
              </div>
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

            {/* Metadata Analysis Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-100 flex items-center">
                  <Settings className="h-5 w-5 text-emerald-400 mr-2" />
                  Metadata Analysis
                </h2>
                <button
                  onClick={handleExportJSON}
                  className="text-xs text-slate-400 hover:text-slate-200 bg-slate-700/50 hover:bg-slate-600/50 px-3 py-1 rounded-full transition-colors flex items-center space-x-1"
                >
                  <FileText className="h-3 w-3" />
                  <span>Export JSON</span>
                </button>
              </div>
              <MetadataPanel metadata={currentImage.metadata} originalFile={currentImage.file} />
            </div>
          </div>
        )}

        {/* Share Section */}
        {currentImage && !isLoading && (
          <div className="mt-12">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-600/50 p-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-2 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-blue-400 mr-2" />
                  Share Your Experience
                </h3>
                <p className="text-slate-400 text-sm">
                  Help others discover privacy-focused image analysis
                </p>
              </div>
              <SocialShare 
                variant="prominent"
                onShare={(platform) => {
                  analytics.trackFeatureUsage('Social Share', `Processing Interface - ${platform}`);
                }}
                className="mx-auto"
              />
            </div>
          </div>
        )}

        {/* Action Center */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors space-x-2"
            >
              <Upload className="h-5 w-5" />
              <span>Analyze Another Image</span>
            </button>
            
            <div className="h-6 w-px bg-slate-600"></div>
            
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-xl transition-colors space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      {standalone && (
        <footer className="mt-16 py-12 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand Section */}
              <div>
                <div className="flex items-center space-x-3 mb-4 cursor-pointer" onClick={onBackToHome}>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    ProofPix
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4 max-w-md leading-relaxed">
                  Privacy-first image metadata extraction. All processing happens locally in your browser.
                </p>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <button onClick={onBackToHome} className="text-sm text-slate-400 hover:text-white transition-colors">
                      Home
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/docs')} className="text-sm text-slate-400 hover:text-white transition-colors">
                      Documentation
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/privacy')} className="text-sm text-slate-400 hover:text-white transition-colors">
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/support')} className="text-sm text-slate-400 hover:text-white transition-colors">
                      Support
                    </button>
                  </li>
                </ul>
              </div>
              
              {/* Features */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-4">Features</h4>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => navigate('/enterprise')} className="text-sm text-slate-400 hover:text-white transition-colors">
                      Enterprise Solutions
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/pricing')} className="text-sm text-slate-400 hover:text-white transition-colors">
                      Pricing
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/batch')} className="text-sm text-slate-400 hover:text-white transition-colors">
                      Batch Processing
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/docs/api')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center space-x-1">
                      <span>API Access</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Bottom Footer */}
            <div className="border-t border-slate-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-slate-400">
                © 2024 ProofPix. All rights reserved. • Privacy-focused image analysis.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <button onClick={() => navigate('/privacy')} className="text-sm text-slate-400 hover:text-white transition-colors">
                  Privacy
                </button>
                <button onClick={() => navigate('/terms')} className="text-sm text-slate-400 hover:text-white transition-colors">
                  Terms
                </button>
                <button onClick={() => navigate('/support')} className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}

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