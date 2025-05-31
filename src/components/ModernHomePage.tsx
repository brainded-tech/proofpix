import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  FileImage, 
  Layers, 
  Lock, 
  Upload, 
  Shield, 
  Building2, 
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Menu,
  X,
  ExternalLink,
  FileText,
  Download,
  Users,
  Star,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { analytics, trackFileUpload, usageTracker } from '../utils/analytics';
import { ProcessedImage } from '../types';
import SecureSessionManager from '../utils/secureSessionManager';
import SecureFileValidator from '../utils/secureFileValidator';
import { motion, AnimatePresence } from 'framer-motion';

// Import new adaptive components
import IntentDetectionModal, { UserIntent } from './onboarding/IntentDetectionModal';
import OnboardingFlowRenderer from './onboarding/OnboardingFlowRenderer';
import { AdaptiveUIProvider, useAdaptiveUI } from './adaptive/AdaptiveUIProvider';
import SmartTooltip from './adaptive/SmartTooltipSystem';
import ProgressiveDisclosurePanel from './adaptive/ProgressiveDisclosurePanel';

interface ModernHomePageProps {
  onFileSelect: (file: File) => void;
  onBatchComplete?: (images: ProcessedImage[]) => void;
  onImageSelect?: (image: ProcessedImage) => void;
}

export const ModernHomePage: React.FC<ModernHomePageProps> = ({ 
  onFileSelect, 
  onBatchComplete, 
  onImageSelect 
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [usageStats, setUsageStats] = useState(usageTracker.getUsageStats());
  const [processingMode, setProcessingMode] = useState<'single' | 'batch'>('single');
  const [canUseBatch, setCanUseBatch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showIntentModal, setShowIntentModal] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<UserIntent | null>(null);
  const [showOnboardingFlow, setShowOnboardingFlow] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Update usage stats
  useEffect(() => {
    const updateStats = () => {
      setUsageStats(usageTracker.getUsageStats());
    };
    
    updateStats();
    const interval = setInterval(updateStats, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Check batch access
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

  // Check if user is new (no previous context)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('proofpix-user-context');
    if (!hasSeenOnboarding) {
      // Show intent detection after a brief delay for new users
      setTimeout(() => setShowIntentModal(true), 2000);
    }
  }, []);

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    try {
      const validationResult = await SecureFileValidator.validateFile(file);
      
      if (!validationResult.valid) {
        console.error('File validation failed:', validationResult.errors);
        alert(`File validation failed: ${validationResult.errors?.join(', ')}`);
        return;
      }

      if (validationResult.warnings && validationResult.warnings.length > 0) {
        console.warn('File validation warnings:', validationResult.warnings);
      }

      trackFileUpload(file.type, file.size);
      analytics.trackFeatureUsage('File Upload', 'ModernHomePage');
      
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

  const handleIntentSelect = (intent: UserIntent) => {
    setSelectedIntent(intent);
    setShowIntentModal(false);
    setShowOnboardingFlow(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboardingFlow(false);
    setSelectedIntent(null);
  };

  const handleBackToIntentSelection = () => {
    setShowOnboardingFlow(false);
    setShowIntentModal(true);
  };

  const restartOnboarding = () => {
    setShowIntentModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ProofPix</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#enterprise" className="text-slate-300 hover:text-white transition-colors">Enterprise</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              
              <SmartTooltip
                id="restart-onboarding"
                content={{
                  title: "Restart Onboarding",
                  description: "Get a personalized experience based on your needs",
                  level: 'beginner',
                  category: 'workflow',
                  actions: [
                    {
                      label: "Start Over",
                      action: restartOnboarding,
                      primary: true
                    }
                  ]
                }}
                trigger="hover"
              >
                <button
                  onClick={restartOnboarding}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Get Started
                </button>
              </SmartTooltip>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-800 border-t border-slate-700"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-slate-300 hover:text-white transition-colors">Features</a>
                <a href="#enterprise" className="block text-slate-300 hover:text-white transition-colors">Enterprise</a>
                <a href="#pricing" className="block text-slate-300 hover:text-white transition-colors">Pricing</a>
                <button
                  onClick={restartOnboarding}
                  className="w-full text-left px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-6 mb-8 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Instant Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Enterprise Ready</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                Privacy-First
              </span>
              <br />
              Image Analysis
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Extract metadata, analyze images, and generate reports—all processed locally on your device. 
              No uploads, no data exposure, complete privacy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <SmartTooltip
                id="start-analyzing"
                content={{
                  title: "Start Your Analysis Journey",
                  description: "Choose your path and get a personalized experience tailored to your needs",
                  level: 'beginner',
                  category: 'workflow',
                  nextSteps: [
                    "Select your use case",
                    "Follow guided setup",
                    "Start processing images"
                  ]
                }}
                trigger="hover"
              >
                <button
                  onClick={() => setShowIntentModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Analyzing Images
                </button>
              </SmartTooltip>
              
              <button className="px-8 py-4 border border-slate-600 text-slate-300 rounded-xl font-semibold text-lg hover:border-slate-500 hover:text-white transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Area */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div 
            {...getRootProps()} 
            className={`
              bg-slate-800/50 backdrop-blur-sm border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
              ${isDragActive 
                ? 'border-blue-400 bg-blue-500/10' 
                : 'border-slate-700 hover:border-blue-500 hover:bg-slate-800/70'
              }
            `}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-slate-300" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">
              {isDragActive ? 'Drop your images here' : 'Drop Images Here'}
            </h3>
            <p className="text-slate-400 mb-6">
              Drag and drop your images or click to browse. All processing happens locally—your images never leave your device.
            </p>
            
            <SmartTooltip
              id="upload-security"
              content={{
                title: "Complete Privacy Guarantee",
                description: "Your images are processed entirely on your device using WebAssembly. No data is ever sent to our servers.",
                level: 'beginner',
                category: 'security',
                relatedFeatures: ['Local Processing', 'Zero Upload', 'GDPR Compliant']
              }}
              trigger="hover"
            >
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Files
              </button>
            </SmartTooltip>
            
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-slate-500">
              <span>Supports: JPG, PNG, TIFF, RAW</span>
              <span>•</span>
              <span>Max 50MB per file</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">ProofPix</span>?
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Professional-grade features designed for privacy and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Privacy-Respecting */}
            <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">🔒 Privacy-Respecting</h3>
              <p className="text-slate-400 leading-relaxed">
                All processing happens locally in your browser. Your photos never leave your device.
                Open source and transparent.
              </p>
            </div>

            {/* Instant Results */}
            <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">⚡ Instant Results</h3>
              <p className="text-slate-400 leading-relaxed">
                Upload, extract, and export your metadata in seconds. No waiting, no delays.
                Export options: JSON, CSV, PDF.
              </p>
            </div>

            {/* Batch Processing */}
            <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">📊 Batch Processing</h3>
              <p className="text-slate-400 leading-relaxed">
                Process multiple images simultaneously with advanced filtering and export options.
                Now available!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full mb-8">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">ENTERPRISE READY</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Secure, scalable, and compliant.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Perfect for teams and organizations.
              </span>
            </h2>
            
            <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Built with React, TypeScript, and JWT for metadata extraction.
              Analytics for Founders, privacy-respecting, Direct screenshots only.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-sm text-slate-400">Client-Side Processing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">0</div>
                <div className="text-sm text-slate-400">Server Data Exposure</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50MB</div>
                <div className="text-sm text-slate-400">Max File Size</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">∞</div>
                <div className="text-sm text-slate-400">Processing Speed</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/enterprise')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center space-x-2"
              >
                <Building2 className="w-5 h-5" />
                <span>Enterprise Solutions</span>
              </button>
              <button 
                onClick={() => navigate('/enterprise/demo')}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors border border-slate-700 hover:border-slate-600 flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>View Live Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Stats */}
      {usageStats && (
        <section className="bg-slate-800/30 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-center mb-8 text-white">Today's Usage</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-2xl font-bold text-blue-400 mb-2">{usageStats.uploads}</div>
                  <div className="text-sm text-slate-400">Uploads</div>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-2xl font-bold text-emerald-400 mb-2">{usageStats.pdfDownloads}</div>
                  <div className="text-sm text-slate-400">PDF Downloads</div>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-2xl font-bold text-amber-400 mb-2">{usageStats.imageDownloads}</div>
                  <div className="text-sm text-slate-400">Image Downloads</div>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-2xl font-bold text-purple-400 mb-2">{usageStats.dataExports}</div>
                  <div className="text-sm text-slate-400">Data Exports</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section with Progressive Disclosure */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-400">Everything you need for professional image analysis</p>
          </div>

          <ProgressiveDisclosurePanel
            title="Feature Categories"
            description="Explore features based on your experience level and needs"
            sections={[
              {
                id: 'basic-features',
                title: 'Essential Tools',
                description: 'Core functionality for everyday image analysis',
                level: 'beginner',
                category: 'basic',
                defaultExpanded: true,
                children: (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
                      <FileText className="w-8 h-8 text-blue-500 mb-4" />
                      <h4 className="font-semibold mb-2">Metadata Extraction</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Extract EXIF data, GPS coordinates, camera settings, and more
                      </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
                      <Download className="w-8 h-8 text-green-500 mb-4" />
                      <h4 className="font-semibold mb-2">Export Options</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Export data as CSV, JSON, or PDF reports
                      </p>
                    </div>
                  </div>
                )
              },
              {
                id: 'advanced-features',
                title: 'Professional Tools',
                description: 'Advanced features for professional workflows',
                level: 'intermediate',
                category: 'advanced',
                requiredFeatures: ['batch_processing'],
                children: (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
                      <Users className="w-8 h-8 text-purple-500 mb-4" />
                      <h4 className="font-semibold mb-2">Batch Processing</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Process hundreds of images simultaneously
                      </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
                      <FileText className="w-8 h-8 text-orange-500 mb-4" />
                      <h4 className="font-semibold mb-2">Custom Reports</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Generate branded PDF reports with custom templates
                      </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
                      <Zap className="w-8 h-8 text-blue-500 mb-4" />
                      <h4 className="font-semibold mb-2">API Access</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Integrate with your existing workflows
                      </p>
                    </div>
                  </div>
                )
              },
              {
                id: 'enterprise-features',
                title: 'Enterprise Solutions',
                description: 'Enterprise-grade security and compliance features',
                level: 'expert',
                category: 'enterprise',
                requiredFeatures: ['enterprise_demo'],
                premium: true,
                children: (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
                      <Building2 className="w-8 h-8 text-emerald-500 mb-4" />
                      <h4 className="font-semibold mb-2">White-Label Solution</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Custom branding and domain for your organization
                      </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
                      <Shield className="w-8 h-8 text-red-500 mb-4" />
                      <h4 className="font-semibold mb-2">Compliance Suite</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        GDPR, CCPA, HIPAA compliance with audit trails
                      </p>
                    </div>
                  </div>
                )
              }
            ]}
            allowMultipleExpanded={true}
            showLevelIndicators={true}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ProofPix</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Privacy-first image metadata extraction platform. Process images locally with enterprise-grade security.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Building2 className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#enterprise" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400 text-sm">
              © 2024 ProofPix. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Onboarding Modals */}
      <IntentDetectionModal
        isOpen={showIntentModal}
        onIntentSelect={handleIntentSelect}
        onClose={() => setShowIntentModal(false)}
      />

      {selectedIntent && (
        <OnboardingFlowRenderer
          userIntent={selectedIntent}
          onComplete={handleOnboardingComplete}
          onFeatureReveal={(features) => {
            // Features will be revealed through the AdaptiveUIProvider
            console.log('Features revealed:', features);
          }}
          onBack={handleBackToIntentSelection}
        />
      )}
    </div>
  );
};

// Wrap the component with AdaptiveUIProvider
const ModernHomePageWithProvider: React.FC<Partial<ModernHomePageProps>> = (props) => {
  const defaultProps: ModernHomePageProps = {
    onFileSelect: (file: File) => {
      console.log('File selected:', file.name);
      // Default implementation - could navigate to processing page
    },
    onBatchComplete: (images: ProcessedImage[]) => {
      console.log('Batch completed:', images.length, 'images');
    },
    onImageSelect: (image: ProcessedImage) => {
      console.log('Image selected:', image);
    },
    ...props
  };

  return (
    <AdaptiveUIProvider>
      <ModernHomePage {...defaultProps} />
    </AdaptiveUIProvider>
  );
};

export default ModernHomePageWithProvider; 