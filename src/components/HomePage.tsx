import React, { useState, useCallback, useEffect } from 'react';
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
  Eye,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Menu,
  X,
  ExternalLink,
  Users,
  Globe,
  Server,
  TrendingUp,
  BarChart3,
  FileCheck,
  Clock,
  Star,
  Briefcase,
  Scale,
  Heart,
  Zap,
  FileText,
  Code,
  Palette,
  Check,
  Sparkles
} from 'lucide-react';
import { analytics, trackFileUpload, usageTracker } from '../utils/analytics';
import SocialShare from './SocialShare';
import SessionStatus from './SessionStatus';
import BatchProcessor from './BatchProcessor';
import { BatchResultsView } from './BatchResultsView';
import { ProcessedImage } from '../types';
import SecureSessionManager from '../utils/secureSessionManager';
import SecureFileValidator from '../utils/secureFileValidator';
import { ComparisonTool } from './ComparisonTool';
import { DemoManager } from './demo/DemoManager';

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
  const [canUseBatch, setCanUseBatch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoManager, setShowDemoManager] = useState(false);
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
      analytics.trackFeatureUsage('File Upload', 'HomePage');
      
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

  const handleBatchComplete = useCallback((results: any[]) => {
    analytics.trackFeatureUsage('Batch Processing', `Completed ${results.length} files`);
    const processedImages = results.filter(r => r.status === 'completed').map(r => ({
      file: r.file,
      metadata: r.metadata,
      previewUrl: URL.createObjectURL(r.file)
    }));
    
    setBatchResults(processedImages);
    setShowBatchResults(true);
    
    onBatchComplete?.(processedImages);
  }, [onBatchComplete]);

  const handleBatchModeClick = useCallback(() => {
    if (!canUseBatch) {
      analytics.trackFeatureUsage('Payment Protection', 'Batch Mode Blocked');
      navigate('/pricing');
      return;
    }
    setProcessingMode('batch');
    setShowBatchResults(false);
    analytics.trackFeatureUsage('Navigation', 'Batch Mode Activated');
  }, [canUseBatch, navigate]);

  const handleImageSelectFromBatch = useCallback((image: ProcessedImage) => {
    analytics.trackFeatureUsage('Batch Results', 'Individual Image Selected');
    onImageSelect?.(image);
  }, [onImageSelect]);

  const handleLaunchDemo = useCallback(() => {
    setShowDemoManager(true);
    analytics.trackFeatureUsage('Demo', 'Interactive Demo Launched');
  }, []);

  const handleCloseDemoManager = useCallback(() => {
    setShowDemoManager(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Demo Manager Overlay */}
      {showDemoManager && (
        <DemoManager
          onExit={handleCloseDemoManager}
          embedded={false}
        />
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ProofPix</h1>
                <p className="text-xs text-slate-400">Enterprise Intelligence</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors font-medium">Pricing</a>
              <a href="/enterprise" className="text-slate-300 hover:text-white transition-colors font-medium">Enterprise</a>
              <a href="/security" className="text-slate-300 hover:text-white transition-colors font-medium">Security</a>
              <a href="/support" className="text-slate-300 hover:text-white transition-colors font-medium">Support</a>
            </div>
            
            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate('/pricing')}
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={handleLaunchDemo}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all flex items-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Try Demo
              </button>
              <button
                onClick={() => navigate('/enterprise/demo')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Enterprise Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
              <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
              >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10">
              <div className="flex flex-col space-y-4 mt-4">
                <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">Features</a>
                <a href="#pricing" className="text-slate-300 hover:text-white transition-colors font-medium">Pricing</a>
                <a href="/enterprise" className="text-slate-300 hover:text-white transition-colors font-medium">Enterprise</a>
                <a href="/security" className="text-slate-300 hover:text-white transition-colors font-medium">Security</a>
                <a href="/support" className="text-slate-300 hover:text-white transition-colors font-medium">Support</a>
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => navigate('/pricing')}
                    className="block w-full text-left text-slate-300 hover:text-white transition-colors font-medium mb-3"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleLaunchDemo}
                    className="block w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold text-center mb-3 flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Try Interactive Demo
                  </button>
                  <button
                    onClick={() => navigate('/enterprise/demo')}
                    className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold text-center"
                  >
                    Enterprise Demo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-14">
        {/* Hero Section */}
        <section className="enterprise-hero enterprise-foundation">
          <div className="enterprise-hero-content">
            {/* Enterprise Preheader */}
            <div className="enterprise-preheader">
              <Building2 className="w-4 h-4" />
              ENTERPRISE METADATA INTELLIGENCE
          </div>

            {/* Main Headline */}
            <h1 className="enterprise-headline">
              Don't Just Send a Photo<br />
              <span className="enterprise-text-gradient">Send Proof of Everything</span>
          </h1>
            
            {/* Value Proposition */}
            <p className="enterprise-subheadline">
              Revolutionary client-side processing eliminates data exposure. From photo EXIF analysis 
              to enterprise document intelligence—complete privacy meets forensic-level accuracy.
            </p>
            
            {/* Trust Indicators */}
            <div className="enterprise-trust-bar">
              <div className="enterprise-trust-badge">
                <Shield className="w-4 h-4" />
                Zero Server Exposure
              </div>
              <div className="enterprise-trust-badge">
                <Lock className="w-4 h-4" />
                GDPR + CCPA + HIPAA Ready
              </div>
              <div className="enterprise-trust-badge">
                <Award className="w-4 h-4" />
                SOC 2 Type II Certified
              </div>
              <div className="enterprise-trust-badge">
                <Building2 className="w-4 h-4" />
                Fortune 500 Trusted
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={handleLaunchDemo}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Try Interactive Demo
                <Sparkles className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={() => navigate('/enterprise/demo')}
                className="btn-enterprise-primary"
              >
                <Eye className="w-5 h-5" />
                Experience Enterprise Demo
              </button>
              <button
                onClick={() => navigate('/security')}
                className="btn-enterprise-secondary"
              >
                <Shield className="w-5 h-5" />
                View Security Architecture
              </button>
            </div>
          
            {/* Quick Start for Photo Users */}
            <div className="mt-8 text-center">
              <p className="text-slate-400 mb-4">Or start analyzing photos immediately:</p>
              <div {...getRootProps()} className="enterprise-glass border-2 border-dashed border-blue-400 rounded-xl p-8 cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-500/5">
                <input {...getInputProps()} />
                <div className="text-center">
                  <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-white mb-2">
                    Drop your photo here or click to select
                  </p>
                  <p className="text-slate-400">
                    Instant EXIF analysis • Complete privacy • No account required
          </p>
        </div>
            </div>
            </div>
            </div>
        </section>

        {/* Processing Mode Toggle */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
              <div className="bg-slate-100 rounded-lg p-1 flex items-center space-x-1">
            <button
              onClick={() => setProcessingMode('single')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors font-medium ${
                processingMode === 'single'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
              }`}
            >
                  <FileImage className="h-5 w-5" />
              <span>Single File</span>
            </button>
            <button
              onClick={handleBatchModeClick}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors font-medium relative ${
                processingMode === 'batch'
                      ? 'bg-white text-blue-600 shadow-sm'
                  : canUseBatch 
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400'
              }`}
            >
              {canUseBatch ? (
                    <Layers className="h-5 w-5" />
              ) : (
                    <Lock className="h-5 w-5" />
              )}
              <span>Batch Processing</span>
                  {!canUseBatch && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  PRO
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Upload Area - Single File Mode */}
        {processingMode === 'single' && (
            <div
              {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                  ${isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100'
                  }
                `}
            >
              <input {...getInputProps()} />
                <div className="max-w-md mx-auto">
                  <div className={`
                    w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center transition-colors
                    ${isDragActive 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-slate-200 text-slate-500'
                    }
                  `}>
                    <Upload className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">
                {isDragActive ? 'Drop your image here' : 'Drag & drop an image here'}
              </h3>
                  <p className="text-slate-600 mb-6">
                    or click to select a file
                  </p>
                  <p className="text-sm text-slate-500">
                JPG • PNG • HEIC • TIFF • and more
              </p>
            </div>
          </div>
        )}

        {/* Batch Processing Mode */}
        {processingMode === 'batch' && !showBatchResults && (
              <div className="bg-white rounded-xl border border-slate-200 p-8">
            <BatchProcessor 
              onComplete={handleBatchComplete}
              maxFiles={10}
            />
          </div>
        )}

        {/* Batch Results View */}
        {processingMode === 'batch' && showBatchResults && batchResults.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="mb-6">
              <button
                onClick={() => setShowBatchResults(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors"
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
          </div>
        </section>

        {/* Usage Statistics */}
        <section className="enterprise-section" style={{ background: 'linear-gradient(135deg, #334155 0%, #475569 100%)' }}>
          <div className="enterprise-container">
            <div className="enterprise-section-header">
              <h2 className="enterprise-section-title">
                Trusted by Professionals Worldwide
              </h2>
              <p className="enterprise-section-subtitle">
                From individual photographers to Fortune 500 enterprises
              </p>
            </div>
            
            <div className="enterprise-grid-4">
              <div className="enterprise-metric">
                <div className="enterprise-metric-value enterprise-counter">2.5M+</div>
                <div className="enterprise-metric-label">Photos Analyzed</div>
                <div className="enterprise-metric-change">
                  <TrendingUp className="w-4 h-4" />
                  +127% this quarter
            </div>
            </div>
              
              <div className="enterprise-metric">
                <div className="enterprise-metric-value enterprise-counter">50K+</div>
                <div className="enterprise-metric-label">Enterprise Documents</div>
                <div className="enterprise-metric-change">
                  <TrendingUp className="w-4 h-4" />
                  +340% growth
            </div>
          </div>
              
              <div className="enterprise-metric">
                <div className="enterprise-metric-value enterprise-counter">99.9%</div>
                <div className="enterprise-metric-label">Uptime SLA</div>
                <div className="enterprise-metric-change">
                  <Shield className="w-4 h-4" />
                  Zero breaches
          </div>
        </div>

              <div className="enterprise-metric">
                <div className="enterprise-metric-value enterprise-counter">500+</div>
                <div className="enterprise-metric-label">Enterprise Clients</div>
                <div className="enterprise-metric-change">
                  <Building2 className="w-4 h-4" />
                  Fortune 500 trusted
                </div>
              </div>
            </div>

            {/* Client Logos */}
            <div className="mt-16">
              <p className="text-center text-slate-400 mb-8">Trusted by leading organizations</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
                  <span className="text-white font-semibold">Legal Firm Partners</span>
            </div>
                <div className="bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
                  <span className="text-white font-semibold">Insurance Leaders</span>
          </div>
                <div className="bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
                  <span className="text-white font-semibold">Healthcare Systems</span>
                </div>
                <div className="bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
                  <span className="text-white font-semibold">Government Agencies</span>
                </div>
            </div>
            </div>
          </div>
        </section>

        {/* Usage Stats */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Today's Usage <span className="text-slate-500 font-normal">(Free Tier)</span>
                </h3>
          </div>
          
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{usageStats.uploads}/5</div>
                  <div className="text-slate-600 text-sm">Images per session</div>
            </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{usageStats.pdfDownloads}/2</div>
                  <div className="text-slate-600 text-sm">PDF Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{usageStats.dataExports}/1</div>
                  <div className="text-slate-600 text-sm">Data Exports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-1">0/3</div>
                  <div className="text-slate-600 text-sm">Comparisons</div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-xs text-slate-500">
            Usage resets daily • Stored locally only
            </p>
          </div>
          </div>

            {/* Session Status */}
            <div className="mt-8">
              <SessionStatus className="max-w-full" />
            </div>
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="enterprise-section" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
          <div className="enterprise-container">
            <div className="enterprise-section-header">
              <h2 className="enterprise-section-title">
                Scale from Personal to Enterprise
              </h2>
              <p className="enterprise-section-subtitle">
                Start with photo analysis, grow to enterprise document intelligence
            </p>
          </div>

            <div className="enterprise-grid-3">
              {/* Individual/Photographer Tier */}
              <div className="enterprise-card">
                <div className="text-center mb-6">
                  <Camera className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Photo Professional</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">$9<span className="text-lg text-slate-400">/month</span></div>
                  <p className="text-slate-400">Perfect for photographers and investigators</p>
            </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Unlimited photo EXIF analysis
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    GPS coordinate extraction
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Batch processing (up to 100 files)
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Export to CSV/JSON
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    EXIF editing & removal
                  </li>
                </ul>
                <button className="btn-enterprise-secondary w-full">
                  Start Free Trial
            </button>
          </div>

              {/* Business Tier */}
              <div className="enterprise-card-premium">
                <div className="text-center mb-6">
                  <Building2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Business Intelligence</h3>
                  <div className="text-4xl font-bold text-purple-400 mb-2">$99<span className="text-lg text-slate-400">/month</span></div>
                  <p className="text-slate-400">For agencies and small businesses</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Everything in Photo Professional
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Document OCR & intelligence
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Professional PDF reports
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    API access (10K calls/month)
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    White-label options
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Priority support
                  </li>
                </ul>
                <button className="btn-enterprise-primary w-full">
                  Start Business Trial
                </button>
              </div>

              {/* Enterprise Tier */}
              <div className="enterprise-card">
                <div className="text-center mb-6">
                  <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Enterprise Powerhouse</h3>
                  <div className="text-4xl font-bold text-green-400 mb-2">Custom</div>
                  <p className="text-slate-400">Fortune 500 & government ready</p>
            </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Everything in Business Intelligence
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Unlimited API calls
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    SOC 2 Type II compliance
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Custom integrations
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    Dedicated success manager
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    SLA guarantees
                  </li>
                </ul>
                <button className="btn-enterprise-executive w-full">
                  Contact Sales
            </button>
            </div>
          </div>
          
            {/* Enterprise Features */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold text-white mb-8">Enterprise-Grade Capabilities</h3>
              <div className="enterprise-grid-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-400" />
        </div>
                  <h4 className="font-semibold text-white mb-2">Zero-Trust Security</h4>
                  <p className="text-slate-400 text-sm">Client-side processing eliminates data exposure</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Lightning Performance</h4>
                  <p className="text-slate-400 text-sm">Process thousands of files in seconds</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Scale className="w-8 h-8 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Court-Ready Reports</h4>
                  <p className="text-slate-400 text-sm">Professional documentation for legal proceedings</p>
                </div>
          <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-orange-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Global Compliance</h4>
                  <p className="text-slate-400 text-sm">GDPR, CCPA, HIPAA, and SOC 2 ready</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="enterprise-section enterprise-foundation">
          <div className="enterprise-container">
            <div className="enterprise-section-header">
              <h2 className="enterprise-section-title">
                Dual-Purpose Intelligence Platform
              </h2>
              <p className="enterprise-section-subtitle">
                From photographers to Fortune 500 enterprises—one platform, infinite possibilities
              </p>
          </div>
          
            <div className="enterprise-grid-3">
              {/* Photo EXIF Analysis */}
              <div className="enterprise-card">
                <div className="enterprise-card-header">
                  <div className="enterprise-card-icon">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="enterprise-card-title">Photo EXIF Intelligence</h3>
                </div>
                <p className="enterprise-card-description">
                  Extract comprehensive metadata from photos including GPS coordinates, camera settings, 
                  timestamps, and device information. Perfect for photographers, investigators, and legal professionals.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">GPS Data</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Camera Settings</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Timestamps</span>
          </div>
        </div>

              {/* Document Intelligence */}
              <div className="enterprise-card-premium">
                <div className="enterprise-card-header">
                  <div className="enterprise-card-icon">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="enterprise-card-title">Document Intelligence</h3>
                </div>
                <p className="enterprise-card-description">
                  Enterprise-grade document processing with OCR, metadata extraction, and professional 
                  PDF generation. Transform any document into court-ready intelligence.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">OCR Processing</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">PDF Generation</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Court-Ready</span>
          </div>
        </div>

              {/* Privacy Architecture */}
              <div className="enterprise-card">
                <div className="enterprise-card-header">
                  <div className="enterprise-card-icon">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="enterprise-card-title">Zero-Trust Privacy</h3>
                </div>
                <p className="enterprise-card-description">
                  Revolutionary client-side processing means your data never touches our servers. 
                  Complete privacy for personal photos and enterprise-grade security for sensitive documents.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Client-Side Only</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Zero Exposure</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">GDPR Ready</span>
                </div>
              </div>

              {/* Batch Processing */}
              <div className="enterprise-card">
                <div className="enterprise-card-header">
                  <div className="enterprise-card-icon">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="enterprise-card-title">Batch Processing</h3>
                </div>
                <p className="enterprise-card-description">
                  Process hundreds of photos or documents simultaneously. Perfect for wedding photographers, 
                  legal discovery, insurance claims, and enterprise document workflows.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Bulk Upload</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Parallel Processing</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Export Reports</span>
                </div>
              </div>

              {/* API Integration */}
              <div className="enterprise-card">
                <div className="enterprise-card-header">
                  <div className="enterprise-card-icon">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="enterprise-card-title">Enterprise API</h3>
                </div>
                <p className="enterprise-card-description">
                  Integrate metadata intelligence directly into your existing workflows. 
                  RESTful APIs, webhooks, and SDKs for seamless enterprise deployment.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">REST API</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Webhooks</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">SDKs</span>
                </div>
          </div>

              {/* White Label */}
              <div className="enterprise-card">
                <div className="enterprise-card-header">
                  <div className="enterprise-card-icon">
                    <Palette className="w-6 h-6 text-white" />
        </div>
                  <h3 className="enterprise-card-title">White Label Solution</h3>
                </div>
                <p className="enterprise-card-description">
                  Deploy ProofPix under your brand with custom styling, domain, and features. 
                  Perfect for agencies, law firms, and enterprise customers.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Custom Branding</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Your Domain</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Full Control</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Solutions */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Industry-Specific Solutions
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Purpose-built for professionals who need court-ready documentation and verified metadata
            </p>
        </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Legal */}
            <div 
                className="bg-slate-50 rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-all cursor-pointer group hover:border-blue-300"
              onClick={() => navigate('/solutions/legal')}
            >
              <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                    <Scale className="h-8 w-8 text-blue-600" />
                </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Legal & Forensics</h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Digital evidence authentication and chain of custody documentation
                  </p>
                  <div className="text-blue-600 text-sm font-semibold">Learn More →</div>
              </div>
            </div>

            {/* Insurance */}
            <div 
                className="bg-slate-50 rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-all cursor-pointer group hover:border-emerald-300"
              onClick={() => navigate('/solutions/insurance')}
            >
              <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                    <FileImage className="h-8 w-8 text-emerald-600" />
                </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Insurance</h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Claims processing and fraud detection with verified timestamps
                  </p>
                  <div className="text-emerald-600 text-sm font-semibold">Learn More →</div>
              </div>
            </div>

            {/* Real Estate */}
            <div 
                className="bg-slate-50 rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-all cursor-pointer group hover:border-purple-300"
              onClick={() => navigate('/solutions/real-estate')}
            >
              <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                    <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Real Estate</h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    Property inspection reports with MLS compliance
                  </p>
                  <div className="text-purple-600 text-sm font-semibold">Learn More →</div>
              </div>
            </div>

            {/* Healthcare */}
            <div 
                className="bg-slate-50 rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-all cursor-pointer group hover:border-red-300"
              onClick={() => navigate('/solutions/healthcare')}
            >
              <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                    <Lock className="h-8 w-8 text-red-600" />
                </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Healthcare</h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    HIPAA-compliant medical imaging with verified metadata
                  </p>
                  <div className="text-red-600 text-sm font-semibold">Learn More →</div>
              </div>
            </div>
          </div>

          {/* ROI Section */}
          <div className="mt-20 bg-slate-800 rounded-2xl p-12 text-center border border-slate-600">
            <h3 className="text-2xl font-bold text-slate-100 mb-8">Average Customer Savings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">$500K+</div>
                <div className="text-slate-300">Annual cost savings</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">75%</div>
                <div className="text-slate-300">Faster processing</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">99%+</div>
                <div className="text-slate-300">Accuracy rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Tech Details */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-slate-600 space-y-2">
          <p>Built with React, TypeScript, and exifr for metadata extraction.</p>
          <p>Analytics by Plausible (privacy-respecting) • Enterprise-grade security</p>
          <p>All image processing happens locally in your browser. Open source on GitHub.</p>
        </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="enterprise-foundation border-t border-slate-700">
        <div className="enterprise-container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-6">
                <Camera className="w-8 h-8 text-blue-400 mr-3" />
                <span className="text-2xl font-bold text-white">ProofPix</span>
                </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Revolutionary metadata intelligence platform serving photographers to Fortune 500 enterprises 
                with zero-trust privacy architecture.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://twitter.com/proofpixapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ProofPix on Twitter"
                  className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/proofpixapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ProofPix on LinkedIn"
                  className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/proofpix"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow ProofPix on GitHub"
                  className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Photo EXIF Analysis</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Document Intelligence</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Batch Processing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">API Integration</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">White Label</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Enterprise Demo</a></li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Solutions</h3>
              <ul className="space-y-3">
                <li><a href="/#features" className="text-slate-400 hover:text-white transition-colors">For Photographers</a></li>
                <li><a href="/solutions/legal" className="text-slate-400 hover:text-white transition-colors">Legal & Forensics</a></li>
                <li><a href="/solutions/insurance" className="text-slate-400 hover:text-white transition-colors">Insurance Claims</a></li>
                <li><a href="/solutions/healthcare" className="text-slate-400 hover:text-white transition-colors">Healthcare</a></li>
                <li><a href="/enterprise" className="text-slate-400 hover:text-white transition-colors">Government</a></li>
                <li><a href="/enterprise" className="text-slate-400 hover:text-white transition-colors">Enterprise</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/security" className="text-slate-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="/support" className="text-slate-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="/faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Sales</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
                <a href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="/compliance" className="text-slate-400 hover:text-white transition-colors text-sm">Compliance</a>
                <a href="/cookies" className="text-slate-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-400">SOC 2 Type II</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-400">GDPR Compliant</span>
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-slate-500 text-sm">
                © 2025 ProofPix. All rights reserved. • Revolutionizing metadata intelligence with zero-trust privacy.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Comparison Tool Modal */}
      {showComparisonTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <ComparisonTool onClose={() => setShowComparisonTool(false)} />
          </div>
        </div>
      )}
    </div>
  );
}; 