import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Camera, FileImage, Layers, Lock, Upload, Shield, Building2, Eye } from 'lucide-react';
import { analytics, trackFileUpload, usageTracker } from '../utils/analytics';
import { Sponsorship } from './Sponsorships';
import SocialShare from './SocialShare';
import SessionStatus from './SessionStatus';
import BatchProcessor from './BatchProcessor';
import { BatchResultsView } from './BatchResultsView';
import { ProcessedImage } from '../types';
import SecureSessionManager from '../utils/secureSessionManager';
import SecureFileValidator from '../utils/secureFileValidator';
import { ComparisonTool } from './ComparisonTool';

interface HomePageProps {
  onFileSelect: (file: File) => void;
  onBatchComplete?: (images: ProcessedImage[]) => void;
  onImageSelect?: (image: ProcessedImage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onFileSelect, onBatchComplete, onImageSelect }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [usageStats, setUsageStats] = useState(usageTracker.getUsageStats());
  const [processingMode, setProcessingMode] = useState<'single' | 'batch'>('single');
  const [showComparisonTool, setShowComparisonTool] = useState(false);
  const [batchResults, setBatchResults] = useState<ProcessedImage[]>([]);
  const [showBatchResults, setShowBatchResults] = useState(false);
  const navigate = useNavigate();

  // Update usage stats on component mount and periodically
  useEffect(() => {
    const updateStats = () => {
      setUsageStats(usageTracker.getUsageStats());
    };
    
    updateStats();
    const interval = setInterval(updateStats, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    try {
      // 🔒 SECURE FILE VALIDATION: Comprehensive security validation
      const validationResult = await SecureFileValidator.validateFile(file);
      
      if (!validationResult.valid) {
        console.error('File validation failed:', validationResult.errors);
        alert(`File validation failed: ${validationResult.errors?.join(', ')}`);
        return;
      }

      if (validationResult.warnings && validationResult.warnings.length > 0) {
        console.warn('File validation warnings:', validationResult.warnings);
      }

      // Track analytics (privacy-friendly)
      trackFileUpload(file.type, file.size);
      analytics.trackFeatureUsage('File Upload', 'HomePage');
      
      // Update usage stats
      usageTracker.incrementUpload();
      setUsageStats(usageTracker.getUsageStats());
      
      onFileSelect(file);
    } catch (error) {
      console.error('File validation error:', error);
      alert('File validation failed. Please try a different image.');
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileSelect,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.heic', '.heif']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  const handleAboutClick = () => {
    analytics.trackFeatureUsage('Navigation', 'About Us - Footer');
    navigate('/about');
  };

  const handlePrivacyClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Privacy Policy - Footer');
    navigate('/privacy');
  };

  const handleFAQClick = () => {
    analytics.trackFeatureUsage('Navigation', 'FAQ - Footer');
    navigate('/faq');
  };

  const handleContactClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Contact - Footer');
    window.location.href = 'https://proofpixapp.com/#contact';
  };

  const handlePricingClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Pricing - Footer');
    navigate('/pricing');
  };

  const handleAnalyticsClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Analytics - Footer');
    navigate('/analytics');
  };

  const handleBatchManagementClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Batch Management - Footer');
    navigate('/batch');
  };

  const handleEnterpriseClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Enterprise - Footer');
    navigate('/enterprise');
  };

  const handleTermsClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Terms - Footer');
    navigate('/terms');
  };

  const handleSupportClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Support - Footer');
    navigate('/support');
  };

  const handleComparisonToolClick = () => {
    setShowComparisonTool(true);
    analytics.trackFeatureUsage('Navigation', 'Comparison Tool Opened');
  };

  const handleBatchComplete = useCallback((results: any[]) => {
    analytics.trackFeatureUsage('Batch Processing', `Completed ${results.length} files`);
    // Convert BatchFile[] to ProcessedImage[] if needed
    const processedImages = results.filter(r => r.status === 'completed').map(r => ({
      file: r.file,
      metadata: r.metadata,
      previewUrl: URL.createObjectURL(r.file)
    }));
    
    // Store batch results and show them instead of navigating away
    setBatchResults(processedImages);
    setShowBatchResults(true);
    
    onBatchComplete?.(processedImages);
  }, [onBatchComplete]);

      // 🔒 SECURE PAYMENT PROTECTION: Server-side validated batch access
    const [canUseBatch, setCanUseBatch] = useState(false);
    
    useEffect(() => {
      const checkBatchAccess = async () => {
        try {
          const hasAccess = await SecureSessionManager.canPerformAction('batch');
          setCanUseBatch(hasAccess);
        } catch (error) {
          console.warn('Batch access check failed:', error);
          setCanUseBatch(false);
        }
      };
      
      checkBatchAccess();
    }, []);

  const handleBatchModeClick = useCallback(() => {
    if (!canUseBatch) {
      analytics.trackFeatureUsage('Payment Protection', 'Batch Mode Blocked');
      navigate('/pricing');
      return;
    }
    setProcessingMode('batch');
    setShowBatchResults(false); // Hide results when switching to batch mode
    analytics.trackFeatureUsage('Navigation', 'Batch Mode Activated');
  }, [canUseBatch, navigate]);

  const handleImageSelectFromBatch = useCallback((image: ProcessedImage) => {
    analytics.trackFeatureUsage('Batch Results', 'Individual Image Selected');
    onImageSelect?.(image);
  }, [onImageSelect]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={() => window.location.reload()}>
              <Camera className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold">ProofPix</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Security Navigation */}
              <button
                onClick={() => navigate('/security')}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </button>
              
              {/* Enterprise Navigation */}
              <button
                onClick={handleEnterpriseClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Building2 className="h-4 w-4" />
                <span>Enterprise</span>
              </button>
              
              {/* Enterprise Demo */}
              <button
                onClick={() => navigate('/enterprise/demo')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Try Demo</span>
              </button>
              

            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Don't Just Send a Photo — Send Proof. 🔒
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Extract and view EXIF metadata from your images, locally.
          </p>
          <p className="text-gray-400">
            Privacy-respecting analytics • Direct sponsorships • Local processing
          </p>
          
          {/* Security Badges */}
          <div className="flex justify-center space-x-4 mt-6">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              ✓ Zero Server Storage
            </div>
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              ✓ SOC 2 Ready
            </div>
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              ✓ GDPR Compliant
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex items-center space-x-1">
            <button
              onClick={() => setProcessingMode('single')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                processingMode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileImage className="h-4 w-4" />
              <span>Single File</span>
            </button>
            <button
              onClick={handleBatchModeClick}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                processingMode === 'batch'
                  ? 'bg-blue-600 text-white'
                  : canUseBatch 
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-yellow-400'
              }`}
            >
              {canUseBatch ? (
                <Layers className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>Batch Processing</span>
              {canUseBatch ? (
                <span className="bg-green-500 text-black text-xs px-2 py-1 rounded-full font-medium ml-2">
                  NEW
                </span>
              ) : (
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium ml-2">
                  PRO
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Upload Area - Single File Mode */}
        {processingMode === 'single' && (
          <div className="max-w-2xl mx-auto mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {isDragActive ? 'Drop your image here' : 'Drag & drop an image here'}
              </h3>
              <p className="text-gray-400 mb-2">or click to select a file</p>
              <p className="text-sm text-gray-500">
                JPG • PNG • HEIC • TIFF • and more
              </p>
            </div>
          </div>
        )}

        {/* Batch Processing Mode */}
        {processingMode === 'batch' && !showBatchResults && (
          <div className="max-w-4xl mx-auto mb-8">
            <BatchProcessor 
              onComplete={handleBatchComplete}
              maxFiles={10}
            />
          </div>
        )}

        {/* Batch Results View */}
        {processingMode === 'batch' && showBatchResults && batchResults.length > 0 && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="mb-4">
              <button
                onClick={() => setShowBatchResults(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← Process More Images
              </button>
            </div>
            <BatchResultsView
              images={batchResults}
              onImageSelect={handleImageSelectFromBatch}
              onImageDelete={(image) => {
                setBatchResults(prev => prev.filter(img => img.file.name !== image.file.name));
              }}
            />
          </div>
        )}

        {/* Real-time Usage Stats */}
        <div className="bg-gray-800 rounded-lg p-6 mb-12 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Today's Usage (Free Tier)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Images per session:</span>
              <span>{usageStats.uploads}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">PDF exports:</span>
              <span>{usageStats.pdfDownloads}/2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Data exports:</span>
              <span>{usageStats.dataExports}/1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Comparisons:</span>
              <span>0/3</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Usage resets daily • Stored locally only
          </div>
        </div>

        {/* Session Status - Show if user has active premium session */}
        <SessionStatus className="max-w-md mx-auto mb-12" />

        {/* Divider */}
        <div className="border-t border-gray-700 mb-12"></div>

                  {/* Enterprise Banner */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <Building2 className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Enterprise Ready</h3>
              <Building2 className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-gray-300 mb-4">
              Secure, scalable, and compliant. Perfect for teams and organizations.
            </p>
            <button
              onClick={handleEnterpriseClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Learn More About Enterprise
            </button>
          </div>

          {/* Features Grid - Enhanced with border and styling */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-12 relative">
          {/* Optional subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-gray-500/5 rounded-2xl"></div>
          
          {/* Features header */}
          <div className="relative z-10 text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Why Choose ProofPix?</h2>
            <p className="text-gray-400">Professional-grade features designed for privacy and reliability</p>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Privacy Feature */}
          <div className="text-center">
            <div className="bg-blue-500 bg-opacity-20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">🔐 Privacy-Respecting</h3>
            <p className="text-gray-400 text-sm">
              All processing happens locally in your browser. Your photos never leave your device. Open source and auditable.
            </p>
          </div>

          {/* EXIF Editor Feature */}
          <div className="text-center bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-6">
            <div className="bg-blue-500 bg-opacity-20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileImage className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              ✨ EXIF Editor
              <span className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                NEW
              </span>
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              Edit, remove, or modify metadata fields. Perfect for privacy protection and forensic analysis.
            </p>
            <p className="text-blue-400 text-xs">
              → Upload a photo to access
            </p>
          </div>

          {/* Image Comparison Feature */}
          <div className="text-center bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-30 rounded-lg p-6">
            <div className="bg-purple-500 bg-opacity-20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Layers className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              🔍 Image Comparison
              <span className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                NEW
              </span>
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              Side-by-side metadata comparison for forensic analysis and verification workflows.
            </p>
            <button
              onClick={handleComparisonToolClick}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              → Open Comparison Tool
            </button>
          </div>



          {/* Bulk Processing Feature */}
          <div className="text-center bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-6">
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Layers className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              🚀 Batch Processing
              <span className="ml-2 bg-green-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                NEW
              </span>
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              Process multiple images simultaneously with advanced export options. Now available!
            </p>
            <button
              onClick={handleBatchManagementClick}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              → Open Batch Manager
            </button>
            </div>
          </div>
        </div>

        {/* Security Comparison Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">ProofPix vs Traditional SaaS Security</h2>
            <p className="text-gray-400">See how our client-side architecture eliminates traditional security risks</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-white">Security Aspect</th>
                  <th className="px-6 py-4 text-center font-bold text-red-400">Traditional SaaS</th>
                  <th className="px-6 py-4 text-center font-bold text-green-400">ProofPix</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4 font-medium text-white">Data Breach Risk</td>
                  <td className="px-6 py-4 text-center text-red-400">HIGH<br/><small className="text-gray-400">Server storage vulnerable</small></td>
                  <td className="px-6 py-4 text-center text-green-400">ELIMINATED<br/><small className="text-gray-400">No server data storage</small></td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800/50">
                  <td className="px-6 py-4 font-medium text-white">Compliance Complexity</td>
                  <td className="px-6 py-4 text-center text-red-400">COMPLEX<br/><small className="text-gray-400">Extensive data handling</small></td>
                  <td className="px-6 py-4 text-center text-green-400">SIMPLE<br/><small className="text-gray-400">Minimal compliance scope</small></td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4 font-medium text-white">User Privacy</td>
                  <td className="px-6 py-4 text-center text-red-400">POLICY-BASED<br/><small className="text-gray-400">Trust our promises</small></td>
                  <td className="px-6 py-4 text-center text-green-400">ARCHITECTURE-BASED<br/><small className="text-gray-400">Impossible to violate</small></td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800/50">
                  <td className="px-6 py-4 font-medium text-white">Audit Requirements</td>
                  <td className="px-6 py-4 text-center text-red-400">EXTENSIVE<br/><small className="text-gray-400">Complex data flows</small></td>
                  <td className="px-6 py-4 text-center text-green-400">STREAMLINED<br/><small className="text-gray-400">Minimal audit scope</small></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/docs/security-architecture')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Learn More About Our Security Architecture
            </button>
          </div>
        </div>



        {/* Tech Details */}
        <div className="text-center text-gray-400 text-sm mb-8">
          <p>Built with React, TypeScript, and exifr for metadata extraction.</p>
          <p>Analytics by Plausible (privacy-respecting) • Direct sponsorships only</p>
          <p>All image processing happens locally in your browser. Open source on GitHub.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="text-sm text-gray-400">
                <p className="font-semibold text-white mb-2">ProofPix</p>
                <p>© 2025 ProofPix. Built for professionals, by professionals.</p>
                <p>Privacy-respecting EXIF metadata tool - v1.8.0 • Open Source</p>
                
                {/* Social Share */}
                <div className="mt-4">
                  <SocialShare 
                    variant="minimal"
                    onShare={(platform) => {
                      analytics.trackFeatureUsage('Social Share', `HomePage Footer - ${platform}`);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <button onClick={() => window.location.reload()} className="text-gray-400 hover:text-white text-left">Home</button>
                <button onClick={() => navigate('/security')} className="text-gray-400 hover:text-white text-left">Security</button>
                <button onClick={handlePricingClick} className="text-gray-400 hover:text-white text-left">Pricing</button>
                <button onClick={handleEnterpriseClick} className="text-gray-400 hover:text-white text-left">Enterprise</button>
                <button onClick={handleAnalyticsClick} className="text-gray-400 hover:text-white text-left">Analytics</button>
                <button onClick={handleBatchManagementClick} className="text-gray-400 hover:text-white text-left">Batch Manager</button>
              </nav>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <button onClick={handleFAQClick} className="text-gray-400 hover:text-white text-left">F.A.Q.</button>
                <button onClick={handleAboutClick} className="text-gray-400 hover:text-white text-left">About</button>
                <button onClick={handleSupportClick} className="text-gray-400 hover:text-white text-left">Support</button>
                <button onClick={handleContactClick} className="text-gray-400 hover:text-white text-left">Contact</button>
                <button onClick={handlePrivacyClick} className="text-gray-400 hover:text-white text-left">Privacy</button>
                <button onClick={handleTermsClick} className="text-gray-400 hover:text-white text-left">Terms</button>
              </nav>
            </div>
          </div>

          {/* Partnership Section */}
          <div className="border-t border-gray-700 pt-6">
            <div className="text-center mb-4">
              <h4 className="font-semibold text-white mb-2">Partnership Opportunities</h4>
              <p className="text-sm text-gray-400">Direct sponsorships • Privacy-focused partnerships • No user tracking</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Sponsorship placement="header" className="max-w-full" />
              <Sponsorship placement="content" className="max-w-full" />
              <Sponsorship placement="bottom" className="max-w-full" />
            </div>
          </div>
        </div>
      </footer>

      {/* Comparison Tool Modal */}
      {showComparisonTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <ComparisonTool onClose={() => setShowComparisonTool(false)} />
          </div>
        </div>
      )}
    </div>
  );
}; 