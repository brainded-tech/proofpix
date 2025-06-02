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
  CloudOff,
  Crown
} from 'lucide-react';
import { analytics, trackFileUpload, usageTracker } from '../utils/analytics';
import { ProcessedImage } from '../types';
import SecureSessionManager from '../utils/secureSessionManager';
import SecureFileValidator from '../utils/secureFileValidator';
import { HybridModeSelector } from './HybridModeSelector';
import { ProcessingMode } from '../services/hybridArchitectureService';
import { UnifiedHeader } from './ui/UnifiedHeader';
import { UnifiedFooter } from './ui/UnifiedFooter';

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
  const [currentProcessingMode, setCurrentProcessingMode] = useState<ProcessingMode>('privacy');
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
    { icon: <Shield className="w-5 h-5" />, text: "0 Breaches in 2+ Years", color: "emerald" },
    { icon: <Zap className="w-5 h-5" />, text: "Results in Under 2 Seconds", color: "blue" },
    { icon: <Award className="w-5 h-5" />, text: "Used in 500+ Legal Cases", color: "purple" },
    { icon: <CloudOff className="w-5 h-5" />, text: "Never Touches Our Servers", color: "orange" }
  ];

  // Enhanced feature highlights
  const featureHighlights = [
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: "Unhackable by Design",
      description: "Your photos never touch our servers—making data breaches technically impossible, not just unlikely.",
      color: "emerald",
      stats: "0% Breach Risk",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Instant Photo Intelligence",
      description: "Discover hidden GPS locations, camera settings, and timestamps in seconds—no waiting, no uploads.",
      color: "blue",
      stats: "<2s Analysis",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Scale className="w-8 h-8" />,
      title: "Court-Admissible Results",
      description: "Generate forensic-grade reports that legal professionals trust for evidence and documentation.",
      color: "purple",
      stats: "Legal-Grade",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Enterprise Without Complexity",
      description: "Get enterprise-level security and features with consumer-simple deployment and usage.",
      color: "orange",
      stats: "5min Setup",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  // Enhanced industry solutions
  const industrySolutions = [
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Legal & Forensics",
      description: "Court-admissible evidence analysis with unbreakable chain of custody protection.",
      link: "/solutions/legal",
      color: "blue"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Healthcare",
      description: "HIPAA-compliant medical imaging with patient data that never leaves your network.",
      link: "/solutions/healthcare",
      color: "emerald"
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Insurance",
      description: "Stop fraud before it costs you—instant claim verification and damage assessment.",
      link: "/solutions/insurance",
      color: "purple"
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Real Estate",
      description: "MLS-compliant property documentation with verified timestamps and locations.",
      link: "/solutions/realestate",
      color: "orange"
    }
  ];

  // Enhanced stats
  const stats = [
    { value: "0", label: "Data Breaches Ever", icon: <Shield className="w-5 h-5" /> },
    { value: "$50M+", label: "Fraud Prevented", icon: <TrendingUp className="w-5 h-5" /> },
    { value: "500+", label: "Legal Teams Protected", icon: <Scale className="w-5 h-5" /> },
    { value: "2M+", label: "Photos Analyzed Privately", icon: <FileImage className="w-5 h-5" /> }
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
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.tif', '.heic', '.heif']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false)
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

  const handleProcessingModeChange = (mode: ProcessingMode) => {
    setCurrentProcessingMode(mode);
    // Track mode selection for analytics
    analytics.track('Processing Mode Changed', {
      mode,
      timestamp: new Date().toISOString(),
      userType
    });
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
    <>
      {/* Enhanced Quick Start Overlay */}
      <AnimatePresence>
        {showQuickStart && <EnhancedQuickStartOverlay />}
      </AnimatePresence>

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Unified Header */}
      <UnifiedHeader />

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-8">
            <Shield className="w-4 h-4 mr-2" />
            Complete Photo Analysis with Complete Privacy
            </div>

            {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Don't Just Send a Photo—
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Send Proof of Everything
              </span>
            </h1>
            
            {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Extract every hidden detail from your photos—location, timestamps, camera settings, and more. 
            Professional-grade analysis that happens entirely in your browser for complete privacy.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-slate-400">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span>Never Touches Our Servers</span>
              </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-yellow-400 mr-2" />
              <span>Results in Seconds</span>
              </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-400 mr-2" />
              <span>Trusted by 500+ Legal Teams</span>
              </div>
            </div>

          {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/enterprise/demo')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
              See How It Works
              </button>
              <button
                onClick={() => navigate('/security')}
                className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
              Why It's Secure
              </button>
            </div>

          {/* Enhanced stats display */}
          <div className="bg-slate-800/50 rounded-lg p-6 mb-12 max-w-3xl mx-auto border border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">500+</div>
                <div className="text-sm text-slate-400">Legal Teams Protected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">$50M+</div>
                <div className="text-sm text-slate-400">Fraud Prevented</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">0</div>
                <div className="text-sm text-slate-400">Data Breaches Ever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="pp-container">
          <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Try It Right Now</h2>
              <p className="text-xl text-slate-300">Upload an image and see the magic happen instantly</p>
          </div>
          
            {/* Processing Mode Selector */}
            <div className="max-w-2xl mx-auto mb-8">
              <HybridModeSelector
                onModeChange={handleProcessingModeChange}
                showDetails={true}
              />
            </div>

            {/* File Upload Area */}
            <div className="max-w-2xl mx-auto">
          <div 
            {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-800/30'
                }`}
          >
            <input {...getInputProps()} />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      handleFileSelect(files);
                    }
                  }}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-blue-400" />
              </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {isDragActive ? 'Drop your image here' : 'Upload an image to analyze'}
              </h3>
                  <p className="text-slate-400 mb-4">
                    Supports JPEG, PNG, TIFF, HEIC files up to 50MB
                  </p>
                  <button
                    onClick={openFileDialog}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Choose File
                  </button>
                </div>
            </div>
          </div>
        </div>
      </section>

        {/* Features Section */}
      <section className="py-20 bg-slate-900">
        <div className="pp-container">
          <motion.div 
            className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                Why Privacy-First Matters
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-slate-300 max-w-3xl mx-auto"
              >
                Traditional tools upload your sensitive images to unknown servers. We process everything locally in your browser.
              </motion.p>
          </motion.div>

          <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
              {featureHighlights.map((feature, index) => (
              <motion.div
                key={index}
                  variants={scaleIn}
                  className={`bg-gradient-to-br ${feature.gradient} p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group`}
                >
                  <div className={`text-${feature.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
            </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300 mb-4 leading-relaxed">{feature.description}</p>
                  <div className={`text-${feature.color}-400 font-semibold text-sm`}>
                    {feature.stats}
            </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

        {/* Industry Solutions Section */}
      <section id="features" className="py-20 bg-slate-900">
        <div className="pp-container">
          <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
            viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                Built for Your Industry
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-slate-300 max-w-3xl mx-auto"
              >
                Specialized solutions for industries that can't afford data breaches
              </motion.p>
              </motion.div>
              
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {industrySolutions.map((solution, index) => (
                  <motion.div
                    key={index}
                  variants={fadeInUp}
                  className={`bg-slate-800/50 border border-${solution.color}-500/20 rounded-2xl p-8 hover:border-${solution.color}-500/40 transition-all duration-300 group`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-${solution.color}-500/10 text-${solution.color}-400 group-hover:bg-${solution.color}-500/20 transition-colors`}>
                      {solution.icon}
              </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">{solution.title}</h3>
                      <p className="text-slate-300 mb-4 leading-relaxed">{solution.description}</p>
                      <Link
                        to={solution.link}
                        className={`inline-flex items-center text-${solution.color}-400 hover:text-${solution.color}-300 font-medium transition-colors`}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
            </div>
              </div>
                  </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

        {/* Category Creation Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="pp-container">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
              variants={staggerContainer}
            >
            <motion.h2 
              variants={fadeInUp}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6"
            >
                <span className="text-slate-400">We Didn't Just Enter the Market—</span>
              <br />
              <span className="text-white">We Created the Category</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-4xl mx-auto"
            >
              Before ProofPix, every image analysis tool required uploading sensitive data to servers. 
              <span className="text-emerald-400 font-semibold"> We made that entire approach obsolete.</span>
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-8 border border-red-500/20"
            >
              <div className="text-red-400 text-3xl font-bold mb-4">Before ProofPix</div>
              <ul className="space-y-3 text-slate-300">
                <li>• Upload sensitive data to unknown servers</li>
                <li>• Hope their security policies protect you</li>
                <li>• Wait minutes for processing</li>
                <li>• Accept breach risk as "normal"</li>
                <li>• Pay for their server costs</li>
              </ul>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 border border-emerald-500/20 transform scale-105"
            >
              <div className="text-emerald-400 text-3xl font-bold mb-4">After ProofPix</div>
              <ul className="space-y-3 text-white font-medium">
                <li>• Zero data transmission</li>
                <li>• Technically impossible to breach</li>
                <li>• Instant local processing</li>
                <li>• Privacy by architecture</li>
                <li>• No server costs</li>
              </ul>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20"
            >
              <div className="text-purple-400 text-3xl font-bold mb-4">Industry Impact</div>
              <ul className="space-y-3 text-slate-300">
                <li>• 500+ legal teams switched</li>
                <li>• $2-5M fraud prevented per company</li>
                <li>• Zero patient data breaches</li>
                <li>• New industry standard created</li>
                <li>• Competitors scrambling to copy</li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-12 border border-slate-600/50"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                "ProofPix didn't just enter the market—they created it."
              </h3>
              <p className="text-slate-300 mb-6">
                Every "privacy-first" tool launched after us is trying to catch up. But you can't retrofit true privacy—
                it has to be built from the ground up, like we did.
              </p>
              <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">First</div>
                  <div className="text-slate-400 text-sm">To eliminate uploads</div>
              </div>
              <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">Only</div>
                  <div className="text-slate-400 text-sm">Unhackable solution</div>
              </div>
              <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">Leader</div>
                  <div className="text-slate-400 text-sm">Category we created</div>
              </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Unified Footer */}
      <UnifiedFooter />
    </div>
    </>
  );
}; 