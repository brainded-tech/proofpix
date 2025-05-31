import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Users,
  Globe,
  Server,
  Eye,
  TrendingUp,
  BarChart3,
  FileCheck,
  Clock,
  Star,
  Briefcase,
  Scale,
  Heart,
  Database,
  Cpu,
  Smartphone,
  HelpCircle,
  BookOpen,
  Code,
  Wrench,
  Target,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Download,
  Sparkles,
  Rocket,
  Fingerprint,
  CloudOff
} from 'lucide-react';
import { analytics, trackFileUpload, usageTracker } from '../utils/analytics';
import { ProcessedImage } from '../types';
import SecureSessionManager from '../utils/secureSessionManager';
import SecureFileValidator from '../utils/secureFileValidator';

interface EnterpriseHomePageProps {
  onFileSelect: (file: File) => void;
  onBatchComplete?: (images: ProcessedImage[]) => void;
  onImageSelect?: (image: ProcessedImage) => void;
}

type UserType = 'business' | 'technical' | 'developer' | 'enterprise' | 'unknown';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  userTypes: UserType[];
  estimatedTime: string;
}

interface UserTypeProfile {
  id: UserType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  primaryGoals: string[];
  recommendedPath: string[];
  estimatedTime: string;
}

export const EnterpriseHomePage: React.FC<EnterpriseHomePageProps> = ({ 
  onFileSelect, 
  onBatchComplete, 
  onImageSelect 
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [usageStats, setUsageStats] = useState(usageTracker.getUsageStats());
  const [processingMode, setProcessingMode] = useState<'single' | 'batch'>('single');
  const [canUseBatch, setCanUseBatch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [userType, setUserType] = useState<UserType>('unknown');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Initialize visibility for animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // User type profiles for personalized onboarding
  const userTypeProfiles: UserTypeProfile[] = [
    {
      id: 'business',
      title: 'Business Decision Maker',
      description: 'Evaluate ROI, security, and business impact',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'blue',
      primaryGoals: ['Understand business value', 'Assess security', 'Calculate ROI', 'Schedule demo'],
      recommendedPath: ['/docs/business/executive-summary', '/docs/business/roi-calculator', '/enterprise/demo'],
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'technical',
      title: 'Technical Implementer',
      description: 'Review architecture, security, and deployment',
      icon: <Wrench className="w-6 h-6" />,
      color: 'green',
      primaryGoals: ['Review architecture', 'Understand security', 'Plan deployment', 'Test integration'],
      recommendedPath: ['/docs/technical/architecture', '/docs/technical/security-deep-dive', '/docs/technical/deployment'],
      estimatedTime: '30-45 minutes'
    },
    {
      id: 'developer',
      title: 'Developer/API User',
      description: 'Integrate APIs, review code examples, test SDKs',
      icon: <Code className="w-6 h-6" />,
      color: 'purple',
      primaryGoals: ['Try API', 'Review examples', 'Test integration', 'Download SDKs'],
      recommendedPath: ['/docs/api/quick-start', '/docs/api/code-examples', '/docs/api/sdks'],
      estimatedTime: '20-30 minutes'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Evaluator',
      description: 'Assess compliance, scalability, and enterprise features',
      icon: <Building2 className="w-6 h-6" />,
      color: 'orange',
      primaryGoals: ['Review compliance', 'Assess scalability', 'Evaluate features', 'Plan rollout'],
      recommendedPath: ['/docs/enterprise/overview', '/docs/enterprise/compliance', '/enterprise/demo'],
      estimatedTime: 'Multiple sessions'
    }
  ];

  // Enhanced trust indicators
  const trustIndicators = [
    { icon: <Shield className="w-5 h-5" />, text: "100% Private", color: "emerald" },
    { icon: <Zap className="w-5 h-5" />, text: "Instant Processing", color: "blue" },
    { icon: <Award className="w-5 h-5" />, text: "Enterprise Ready", color: "purple" },
    { icon: <CloudOff className="w-5 h-5" />, text: "Zero Upload", color: "orange" }
  ];

  // Enhanced feature highlights
  const featureHighlights = [
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: "Privacy-First Architecture",
      description: "All processing happens locally in your browser. Your images never leave your device.",
      color: "emerald",
      stats: "100% Local"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Extract comprehensive metadata in seconds with our optimized WebAssembly engine.",
      color: "blue",
      stats: "<2s Processing"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Enterprise Grade",
      description: "Built for scale with advanced security, compliance, and white-label options.",
      color: "purple",
      stats: "Fortune 500 Ready"
    }
  ];

  // Usage tracking and analytics
    const trackBehavior = () => {
    analytics.trackFeatureUsage('Homepage Interaction', 'EnterpriseHomePage');
  };

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
      analytics.trackFeatureUsage('File Upload', 'EnterpriseHomePage');
      
      usageTracker.incrementUpload();
      setUsageStats(usageTracker.getUsageStats());
      
      onFileSelect(file);
    } catch (error) {
      console.error('File validation error:', error);
      alert('File validation failed. Please try a different image.');
    }
  }, [onFileSelect]);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileSelect(acceptedFiles);
      }
    },
    noClick: true // Disable click to prevent double opening of file dialog
  });

  const handleUserTypeSelection = (selectedType: UserType) => {
    setUserType(selectedType);
    setShowUserTypeSelection(false);
    localStorage.setItem('proofpix_user_type', selectedType);
    analytics.trackFeatureUsage('User Type Selected', selectedType);
  };

  // Personalized onboarding steps based on user type
  const getOnboardingSteps = (selectedUserType: UserType): OnboardingStep[] => {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'upload',
        title: 'Upload Your First Image',
        description: 'Try our privacy-first metadata extraction',
        icon: <Upload className="w-5 h-5" />,
        action: 'Upload Image',
        userTypes: ['business', 'technical', 'developer', 'enterprise'],
        estimatedTime: '30 seconds'
      },
      {
        id: 'results',
        title: 'View Extracted Metadata',
        description: 'See comprehensive EXIF data and privacy features',
        icon: <Eye className="w-5 h-5" />,
        action: 'View Results',
        userTypes: ['business', 'technical', 'developer', 'enterprise'],
        estimatedTime: '1 minute'
      }
    ];

    const userSpecificSteps: Record<UserType, OnboardingStep[]> = {
      business: [
        {
          id: 'roi',
          title: 'Calculate Your ROI',
          description: 'See potential cost savings and business impact',
          icon: <TrendingUp className="w-5 h-5" />,
          action: 'Calculate ROI',
          userTypes: ['business'],
          estimatedTime: '2 minutes'
        }
      ],
      technical: [
        {
          id: 'architecture',
          title: 'Review Architecture',
          description: 'Understand our privacy-first technical design',
          icon: <Database className="w-5 h-5" />,
          action: 'View Architecture',
          userTypes: ['technical'],
          estimatedTime: '5 minutes'
        }
      ],
      developer: [
        {
          id: 'api',
          title: 'Try the API',
          description: 'Test our RESTful API with live examples',
          icon: <Code className="w-5 h-5" />,
          action: 'Try API',
          userTypes: ['developer'],
          estimatedTime: '3 minutes'
        }
      ],
      enterprise: [
        {
          id: 'compliance',
          title: 'Review Compliance',
          description: 'Explore GDPR, HIPAA, and SOC 2 documentation',
          icon: <FileCheck className="w-5 h-5" />,
          action: 'View Compliance',
          userTypes: ['enterprise'],
          estimatedTime: '5 minutes'
        }
      ],
      unknown: []
    };

    return [...baseSteps, ...(userSpecificSteps[selectedUserType] || [])];
  };

  const handleStepAction = (step: OnboardingStep) => {
    switch (step.id) {
      case 'upload':
        // Trigger file upload
        openFileDialog();
        break;
      case 'results':
        // Show results section
        document.querySelector('#results-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'roi':
        navigate('/docs/business/roi-calculator');
        break;
      case 'demo':
        navigate('/enterprise/demo');
        break;
      case 'architecture':
        navigate('/docs/technical/architecture');
        break;
      case 'security':
        navigate('/docs/technical/security-deep-dive');
        break;
      case 'api':
        navigate('/docs/api/quick-start');
        break;
      case 'sdk':
        navigate('/docs/api/sdks');
        break;
      case 'compliance':
        navigate('/docs/enterprise/compliance');
        break;
      case 'enterprise-demo':
        navigate('/enterprise/demo');
        break;
    }
    
    // Mark step as completed
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps(prev => [...prev, step.id]);
      analytics.trackFeatureUsage('Onboarding Step Completed', step.id);
    }
  };

  const getProgressPercentage = () => {
    const totalSteps = getOnboardingSteps(userType).length;
    return totalSteps > 0 ? (completedSteps.length / totalSteps) * 100 : 0;
  };

  // Enhanced Quick Start Overlay Component with User Type Detection
  const EnhancedQuickStartOverlay = () => {
    const currentSteps = getOnboardingSteps(userType);
    const currentProfile = userTypeProfiles.find(p => p.id === userType);
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {showUserTypeSelection ? (
            // User Type Selection Screen
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Welcome to ProofPix!</h2>
                <p className="text-lg text-slate-600 mb-2">Let's personalize your experience</p>
                <p className="text-sm text-slate-500">Choose your role to get a customized onboarding experience</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {userTypeProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => handleUserTypeSelection(profile.id)}
                    className={`p-6 border-2 border-slate-200 rounded-xl cursor-pointer transition-all hover:border-${profile.color}-500 hover:shadow-lg group`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg bg-${profile.color}-100 text-${profile.color}-600 group-hover:bg-${profile.color}-500 group-hover:text-white transition-colors`}>
                        {profile.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">{profile.title}</h3>
                        <p className="text-slate-600 text-sm mb-3">{profile.description}</p>
                        <div className="flex items-center text-xs text-slate-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {profile.estimatedTime}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button 
                  onClick={() => {
                    setShowUserTypeSelection(false);
                    setUserType('business'); // Default fallback
                  }}
                  className="text-slate-500 hover:text-slate-700 text-sm"
                >
                  Skip personalization →
                </button>
              </div>
            </div>
          ) : (
            // Personalized Onboarding Flow
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-${currentProfile?.color}-100 rounded-lg flex items-center justify-center`}>
                    <div className={`text-${currentProfile?.color}-600`}>
                      {currentProfile?.icon}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{currentProfile?.title} Guide</h2>
                    <p className="text-slate-600">{currentProfile?.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setShowUserTypeSelection(true)}
                    className="text-slate-500 hover:text-slate-700 text-sm flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Change Role
                  </button>
                  <button 
                    onClick={() => setShowQuickStart(false)}
                    className="text-slate-400 hover:text-slate-600 p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Your Progress</span>
                  <span className="text-sm text-slate-500">{completedSteps.length} of {currentSteps.length} completed</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`bg-${currentProfile?.color}-600 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Primary Goals */}
              <div className="mb-8 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Your Goals</h3>
                <div className="grid grid-cols-2 gap-2">
                  {currentProfile?.primaryGoals.map((goal, index) => (
                    <div key={index} className="flex items-center text-sm text-slate-600">
                      <Target className="w-3 h-3 mr-2 text-slate-400" />
                      {goal}
                    </div>
                  ))}
                </div>
              </div>

              {/* Onboarding Steps */}
              <div className="space-y-4 mb-8">
                {currentSteps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isCurrent = index === onboardingStep;
                  
                  return (
                    <div 
                      key={step.id}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        isCompleted 
                          ? 'border-green-200 bg-green-50' 
                          : isCurrent 
                            ? `border-${currentProfile?.color}-200 bg-${currentProfile?.color}-50`
                            : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent 
                                ? `bg-${currentProfile?.color}-500 text-white`
                                : 'bg-slate-200 text-slate-500'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="text-sm font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{step.title}</h3>
                            <p className="text-slate-600 text-sm">{step.description}</p>
                            <div className="flex items-center mt-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {step.estimatedTime}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleStepAction(step)}
                          disabled={isCompleted}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            isCompleted
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : `bg-${currentProfile?.color}-600 hover:bg-${currentProfile?.color}-700 text-white`
                          }`}
                        >
                          {isCompleted ? 'Completed' : step.action}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowQuickStart(false)}
                  className={`flex-1 bg-${currentProfile?.color}-600 hover:bg-${currentProfile?.color}-700 text-white px-6 py-3 rounded-lg font-medium transition-colors`}
                >
                  Start Exploring
                </button>
                <button 
                  onClick={() => {
                    setShowQuickStart(false);
                    navigate('/docs');
                  }}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  View All Docs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Enhanced Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50"
      >
        <div className="pp-container">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
        </div>
              <span className="pp-text-heading-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                ProofPix
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/#features" className="pp-text-body-md text-slate-300 hover:text-white transition-colors duration-200">Features</Link>
              <Link to="/#enterprise" className="pp-text-body-md text-slate-300 hover:text-white transition-colors duration-200">Enterprise</Link>
              <Link to="/#pricing" className="pp-text-body-md text-slate-300 hover:text-white transition-colors duration-200">Pricing</Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQuickStart(true)}
                className="pp-btn pp-btn-primary pp-btn-md"
              >
                <Sparkles className="w-4 h-4" />
                Get Started
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50"
            >
              <div className="pp-container py-6 space-y-4">
                <Link to="/#features" className="block pp-text-body-md text-slate-300 hover:text-white transition-colors">Features</Link>
                <Link to="/#enterprise" className="block pp-text-body-md text-slate-300 hover:text-white transition-colors">Enterprise</Link>
                <Link to="/#pricing" className="block pp-text-body-md text-slate-300 hover:text-white transition-colors">Pricing</Link>
              <button 
                  onClick={() => setShowQuickStart(true)}
                  className="w-full pp-btn pp-btn-primary pp-btn-md"
              >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Enhanced Hero Section */}
      <section className="pp-hero-section pt-32 pb-20">
        <div className="pp-container">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {/* Enhanced Trust Indicators */}
            <motion.div 
              variants={fadeInUp}
              className="flex items-center justify-center flex-wrap gap-6 mb-12"
            >
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-${indicator.color}-500/10 border border-${indicator.color}-500/20`}
                >
                  <span className={`text-${indicator.color}-400`}>{indicator.icon}</span>
                  <span className="pp-text-body-sm font-medium text-slate-300">{indicator.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Main Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="pp-text-display-lg md:pp-text-display-xl mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
                Privacy-First
              </span>
              <br />
              <span className="text-white">Image Intelligence</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="pp-text-body-xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto"
            >
              Extract metadata, analyze images, and generate reports—all processed locally on your device. 
              <span className="text-emerald-400 font-semibold"> No uploads, no data exposure, complete privacy.</span>
            </motion.p>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={openFileDialog}
                className="pp-btn pp-btn-primary pp-btn-xl group"
              >
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                Start Analyzing Images
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="pp-btn pp-btn-outline pp-btn-xl group"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Enhanced Feature Highlights */}
            <motion.div 
              variants={staggerContainer}
              className="pp-feature-grid max-w-6xl mx-auto"
            >
              {featureHighlights.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="pp-card pp-card-glass p-8 text-center group cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-${feature.color}-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className={`text-${feature.color}-400`}>{feature.icon}</span>
            </div>
                  <h3 className="pp-text-heading-md mb-4">{feature.title}</h3>
                  <p className="pp-text-body-md text-slate-400 mb-4 leading-relaxed">{feature.description}</p>
                  <div className={`pp-text-caption text-${feature.color}-400 font-bold`}>
                    {feature.stats}
          </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Upload Section */}
      <section id="features" className="py-20 bg-slate-900">
        <div className="pp-container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
          <div 
            {...getRootProps()} 
            className={`
                pp-card pp-card-glass p-12 text-center cursor-pointer transition-all duration-300 group
              ${isDragActive 
                  ? 'border-blue-400 bg-blue-500/10 scale-105' 
                  : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800/70'
              }
            `}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            
              <motion.div 
                className="w-20 h-20 bg-slate-700/50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300"
                animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              >
                <Upload className="w-10 h-10 text-slate-300 group-hover:text-blue-400 transition-colors" />
              </motion.div>
              
              <h3 className="pp-text-heading-lg mb-6">
                {isDragActive ? 'Drop your images here' : 'Drop Images Here'}
              </h3>
              <p className="pp-text-body-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Drag and drop your images or click to browse. All processing happens locally—your images never leave your device.
              </p>
              
              <motion.button 
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pp-btn pp-btn-secondary pp-btn-lg"
              >
                <FileImage className="w-5 h-5" />
                Choose Files
              </motion.button>
              
              <div className="mt-8 flex items-center justify-center space-x-6 pp-text-body-sm text-slate-500">
                <span>Supports: JPG, PNG, TIFF, RAW</span>
                <span>•</span>
                <span>Max 50MB per file</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">100% Private</span>
          </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      {usageStats && (
        <section className="py-16 bg-slate-800/30">
          <div className="pp-container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h3 className="pp-text-heading-lg text-center mb-12 text-white">Today's Usage</h3>
              <div className="pp-stats-grid">
                {[
                  { label: 'Uploads', value: usageStats.uploads, color: 'blue', icon: <Upload className="w-6 h-6" /> },
                  { label: 'PDF Downloads', value: usageStats.pdfDownloads, color: 'emerald', icon: <Download className="w-6 h-6" /> },
                  { label: 'Image Downloads', value: usageStats.imageDownloads, color: 'amber', icon: <FileImage className="w-6 h-6" /> },
                  { label: 'Data Exports', value: usageStats.dataExports, color: 'purple', icon: <Database className="w-6 h-6" /> }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="pp-card text-center p-8"
                  >
                    <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <span className={`text-${stat.color}-400`}>{stat.icon}</span>
          </div>
                    <div className={`pp-text-display-sm text-${stat.color}-400 mb-2 font-bold`}>{stat.value}</div>
                    <div className="pp-text-body-sm text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
        </div>
      </section>
      )}

      {/* Enhanced Enterprise CTA */}
      <section id="enterprise" className="pp-cta-section">
        <div className="pp-container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-full mb-8"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span className="pp-text-caption text-emerald-400">ENTERPRISE READY</span>
            </motion.div>
            
            <h2 className="pp-text-display-md mb-8">
              Secure, scalable, and compliant.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Perfect for teams and organizations.
              </span>
            </h2>
            
            <p className="pp-text-body-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Built with React, TypeScript, and JWT for metadata extraction.
              Analytics for Founders, privacy-respecting, Direct screenshots only.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/enterprise')}
                className="pp-btn pp-btn-secondary pp-btn-xl"
              >
                <Building2 className="w-5 h-5" />
                Enterprise Solutions
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/enterprise/demo')}
                className="pp-btn pp-btn-glass pp-btn-xl"
              >
                <Play className="w-5 h-5" />
                View Live Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-16">
        <div className="pp-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="pp-text-heading-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  ProofPix
                </span>
                </div>
              <p className="pp-text-body-md text-slate-400 mb-6 max-w-md leading-relaxed">
                Privacy-first image metadata extraction platform. Process images locally with enterprise-grade security.
              </p>
              <div className="flex space-x-4">
                <motion.a 
                  href="#" 
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Globe className="w-6 h-6" />
                </motion.a>
                <motion.a 
                  href="#" 
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Building2 className="w-6 h-6" />
                </motion.a>
              </div>
            </div>
            
            <div>
              <h4 className="pp-text-heading-sm mb-6">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/#features" className="pp-text-body-md text-slate-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="pp-text-body-md text-slate-400 hover:text-white transition-colors">
                  Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/enterprise" className="pp-text-body-md text-slate-400 hover:text-white transition-colors">
                    Enterprise
                  </Link>
                </li>
                <li>
                  <Link to="/docs/api" className="pp-text-body-md text-slate-400 hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="pp-text-heading-sm mb-6">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="pp-text-body-md text-slate-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="pp-text-body-md text-slate-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/security" className="pp-text-body-md text-slate-400 hover:text-white transition-colors">
                  Security
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="pp-text-body-md text-slate-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="pp-text-body-sm text-slate-400">
              © 2024 ProofPix. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              {['Terms', 'Privacy', 'Cookies'].map((item) => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="pp-text-body-sm text-slate-400 hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}; 