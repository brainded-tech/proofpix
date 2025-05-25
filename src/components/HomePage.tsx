import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, FileImage, Layers, Shield, Clock } from 'lucide-react';
import { analytics, trackFileUpload, usageTracker } from '../utils/analytics';
import { Sponsorship, SponsorshipGrid } from './Sponsorships';
import SocialShare from './SocialShare';
import SessionStatus from './SessionStatus';

interface HomePageProps {
  onFileSelect: (file: File) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onFileSelect }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [usageStats, setUsageStats] = useState(usageTracker.getUsageStats());
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
    
    // Track analytics (privacy-friendly)
    trackFileUpload(file.type, file.size);
    analytics.trackFeatureUsage('File Upload', 'HomePage');
    
    // Update usage stats
    usageTracker.incrementUpload();
    setUsageStats(usageTracker.getUsageStats());
    
    onFileSelect(file);
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
            
            {/* Header Sponsorship - Privacy-friendly partnerships */}
            <div className="hidden lg:block">
              <Sponsorship placement="header" className="max-w-md" />
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
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md">
              <FileImage className="h-4 w-4" />
              <span>Single File</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 text-gray-400">
              <Layers className="h-4 w-4" />
              <span>Bulk Processing</span>
              <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                COMING SOON
              </span>
            </div>
          </div>
        </div>

        {/* Upload Area */}
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

        {/* Real-time Usage Stats */}
        <div className="bg-gray-800 rounded-lg p-6 mb-12 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Today's Usage</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Uploads:</span>
              <span>{usageStats.uploads}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">PDF Downloads:</span>
              <span>{usageStats.pdfDownloads}/3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Image Downloads:</span>
              <span>{usageStats.imageDownloads}/15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Data Exports:</span>
              <span>{usageStats.dataExports}/20</span>
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

        {/* Features Grid - Enhanced with border and styling */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-12 relative">
          {/* Optional subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-gray-500/5 rounded-2xl"></div>
          
          {/* Features header */}
          <div className="relative z-10 text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Why Choose ProofPix?</h2>
            <p className="text-gray-400">Professional-grade features designed for privacy and reliability</p>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Privacy Feature */}
          <div className="text-center">
            <div className="bg-blue-500 bg-opacity-20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">🔐 Privacy-Respecting</h3>
            <p className="text-gray-400 text-sm">
              All processing happens locally in your browser. Your photos never leave your device.
            </p>
          </div>

          {/* Instant Results Feature */}
          <div className="text-center">
            <div className="bg-green-500 bg-opacity-20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">⚡ Instant Results</h3>
            <p className="text-gray-400 text-sm">
              Upload, inspect, and export your metadata in seconds — no photo storage, ever.
            </p>
          </div>

          {/* Bulk Processing Feature */}
          <div className="text-center bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-6">
            <div className="bg-yellow-500 bg-opacity-20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Layers className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              🚀 Bulk Processing
              <span className="ml-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                COMING SOON
              </span>
            </h3>
            <p className="text-gray-400 text-sm">
              Process multiple images simultaneously with advanced export options.
            </p>
            </div>
          </div>
        </div>

        {/* Sponsorship Grid - Updated heading */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center mb-6">Featured Partners</h3>
          <SponsorshipGrid className="max-w-4xl mx-auto" />
          <div className="text-center text-xs text-gray-500 mt-4">
            Direct partnerships • No user tracking
          </div>
        </div>

        {/* Bottom Educational Sponsorship */}
        <div className="mb-12">
          <Sponsorship placement="bottom" className="max-w-2xl mx-auto" />
        </div>

        {/* Tech Details */}
        <div className="text-center text-gray-400 text-sm mb-8">
          <p>Built with React, TypeScript, and exifr for metadata extraction.</p>
          <p>Analytics by Plausible (privacy-respecting) • Direct sponsorships only</p>
          <p>All image processing happens locally in your browser.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>© 2025 ProofPix. Built for professionals, by professionals.</p>
              <p>Privacy-respecting EXIF metadata tool - v1.6.0</p>
              
              {/* Minimal Social Share */}
              <div className="mt-3">
                <SocialShare 
                  variant="minimal"
                  onShare={(platform) => {
                    analytics.trackFeatureUsage('Social Share', `HomePage Footer - ${platform}`);
                  }}
                />
              </div>
            </div>
            <nav className="flex space-x-6 text-sm">
              <button onClick={() => window.location.reload()} className="text-gray-400 hover:text-white">Home</button>
              <button onClick={handleFAQClick} className="text-gray-400 hover:text-white">F.A.Q.</button>
              <button onClick={handleAboutClick} className="text-gray-400 hover:text-white">About</button>
              <button onClick={handlePrivacyClick} className="text-gray-400 hover:text-white">Privacy</button>
              <button onClick={handleContactClick} className="text-gray-400 hover:text-white">Contact</button>
              <button onClick={handlePricingClick} className="text-gray-400 hover:text-white">Pricing</button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}; 