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
  Tablet,
  Fingerprint,
  Rocket,
  Crown,
  DollarSign,
  Phone,
  Calendar,
  Mail,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Eye,
  FileCheck,
  TrendingUp,
  MapPin,
  Clock,
  BarChart3,
  Timer,
  Target,
  Heart,
  Briefcase
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
import { EnhancedFooter } from './EnhancedFooter';

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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showPricingPreview, setShowPricingPreview] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    // Auto-rotate features
    const featureInterval = setInterval(() => {
      setSelectedFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(featureInterval);
    };
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
    // Navigate based on user intent
    if (selectedIntent?.id === 'enterprise_evaluation') {
      navigate('/enterprise');
    } else if (selectedIntent?.id === 'professional_work') {
      navigate('/docs/api');
    } else {
      navigate('/pricing');
    }
  };

  const handleBackToIntentSelection = () => {
    setShowOnboardingFlow(false);
    setShowIntentModal(true);
  };

  const restartOnboarding = () => {
    setShowIntentModal(true);
  };

  // Enhanced testimonials with more compelling social proof
  const testimonials = [
    {
      quote: "ProofPix saved us $2.3M in potential GDPR fines. The local processing means zero data exposure risk.",
      author: "Sarah Chen",
      role: "Chief Privacy Officer",
      company: "TechCorp Industries",
      avatar: "/api/placeholder/64/64",
      metric: "$2.3M saved",
      verified: true
    },
    {
      quote: "We process 50,000+ legal documents monthly. ProofPix's accuracy rate of 99.7% is unmatched.",
      author: "Michael Rodriguez",
      role: "Managing Partner",
      company: "Rodriguez & Associates",
      avatar: "/api/placeholder/64/64",
      metric: "99.7% accuracy",
      verified: true
    },
    {
      quote: "Implementation took 2 hours, not 2 months. Our team was analyzing photos the same day.",
      author: "Dr. Emily Watson",
      role: "Research Director",
      company: "MedTech Solutions",
      avatar: "/api/placeholder/64/64",
      metric: "2-hour setup",
      verified: true
    },
    {
      quote: "ROI was immediate. We eliminated $180K in annual compliance costs on day one.",
      author: "James Park",
      role: "CFO",
      company: "Financial Services Inc",
      avatar: "/api/placeholder/64/64",
      metric: "$180K saved",
      verified: true
    }
  ];

  // Enhanced features with stronger value propositions
  const features = [
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: "Impossible to Breach",
      description: "Your photos never touch our servers. Data breaches become technically impossible, not just unlikely.",
      benefit: "Zero breach risk",
      color: "emerald",
      stats: "0% data exposure",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Instant Intelligence",
      description: "Extract GPS locations, camera settings, and timestamps in seconds. No waiting, no uploads.",
      benefit: "10x faster analysis",
      color: "blue",
      stats: "< 3 second processing",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Court-Tested Accuracy",
      description: "99.7% accuracy rate trusted by Fortune 500 legal teams and government agencies.",
      benefit: "Legal-grade precision",
      color: "purple",
      stats: "99.7% accuracy",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Immediate ROI",
      description: "Eliminate compliance costs, reduce manual work, prevent data breaches. ROI in days, not months.",
      benefit: "Instant cost savings",
      color: "orange",
      stats: "< 30 day ROI",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  // Enhanced trust indicators
  const trustIndicators = [
    { icon: <Shield className="w-5 h-5" />, text: "SOC 2 Type II", color: "emerald" },
    { icon: <Lock className="w-5 h-5" />, text: "GDPR + HIPAA Ready", color: "blue" },
    { icon: <Award className="w-5 h-5" />, text: "Fortune 500 Trusted", color: "purple" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "99.7% Uptime SLA", color: "orange" }
  ];

  // Pricing preview data
  const pricingPreview = [
    {
      name: "Professional",
      price: "$149",
      period: "/month",
      description: "Perfect for growing teams",
      features: ["Unlimited processing", "Team collaboration", "API access", "Priority support"],
      popular: true,
      savings: "Save $600/year"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored for large organizations",
      features: ["White-label solution", "On-premise deployment", "Dedicated support", "Custom integrations"],
      popular: false,
      savings: "ROI in 30 days"
    }
  ];

  // Animation variants
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">ProofPix</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#enterprise" className="text-slate-300 hover:text-white transition-colors">Enterprise</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
                <button
                  onClick={restartOnboarding}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
      <section ref={heroRef} className="relative pt-20 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="text-center"
          >
            {/* Trust Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-3 mb-8">
              <Shield className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-emerald-400 font-medium">IMPOSSIBLE TO BREACH • INSTANT ANALYSIS • COURT-TESTED</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Don't Just Send a Photo
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Send Proof of Everything
              </span>
            </motion.h1>

            {/* Value Proposition */}
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              <span className="font-semibold text-white">Revolutionary client-side processing</span> eliminates data exposure. 
              Extract GPS locations, timestamps, and hidden metadata in seconds—with <span className="text-emerald-400">zero server contact</span>.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6 mb-12">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className={`flex items-center space-x-2 px-4 py-2 bg-${indicator.color}-500/10 border border-${indicator.color}-500/20 rounded-full`}>
                  <span className={`text-${indicator.color}-400`}>{indicator.icon}</span>
                  <span className={`text-${indicator.color}-400 font-medium text-sm`}>{indicator.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
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
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Start Analyzing Images</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SmartTooltip>
              
              <button 
                onClick={() => navigate('/enterprise/demo')}
                className="group px-8 py-4 border border-slate-600 text-slate-300 rounded-xl font-semibold text-lg hover:border-slate-500 hover:text-white transition-colors flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-slate-400 mb-4">Trusted by 50,000+ professionals worldwide</p>
              <div className="flex items-center justify-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-2 border-slate-900" />
                    ))}
                  </div>
                  <span className="text-slate-300 text-sm">+50,000 users</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-slate-300 text-sm ml-2">4.9/5 rating</span>
            </div>
          </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Professionals Choose ProofPix
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              The only photo analysis platform that guarantees your data never leaves your device
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative group cursor-pointer ${selectedFeature === index ? 'scale-105' : ''}`}
                onClick={() => setSelectedFeature(index)}
                onMouseEnter={() => setSelectedFeature(index)}
              >
                <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 text-white`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-${feature.color}-400 font-semibold text-sm`}>{feature.benefit}</span>
                    <span className="text-slate-400 text-sm">{feature.stats}</span>
                  </div>
            </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See how professionals are saving millions with ProofPix
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50 max-w-4xl mx-auto"
              >
                <div className="flex items-start space-x-6">
                  <img
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].author}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <blockquote className="text-xl text-slate-200 mb-6 leading-relaxed">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{testimonials[currentTestimonial].author}</span>
                          {testimonials[currentTestimonial].verified && (
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                          )}
          </div>
                        <p className="text-slate-400">{testimonials[currentTestimonial].role}</p>
                        <p className="text-slate-500">{testimonials[currentTestimonial].company}</p>
              </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">{testimonials[currentTestimonial].metric}</div>
                        <div className="text-slate-400 text-sm">Impact</div>
            </div>
              </div>
            </div>
              </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Start free, upgrade when you need more. No hidden fees, no surprises.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPreview.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border ${
                  plan.popular ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-slate-600/50'
                } hover:border-slate-500/50 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
              </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-300 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400 ml-1">{plan.period}</span>
              </div>
                  <p className="text-emerald-400 text-sm mt-2">{plan.savings}</p>
              </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/pricing')}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'border border-slate-500 text-slate-300 hover:border-slate-400 hover:text-white'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </motion.div>
            ))}
              </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View all plans and features</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
            </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Revolutionize Your Photo Analysis?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join 50,000+ professionals who trust ProofPix for secure, accurate, and instant photo intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => setShowIntentModal(true)}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <Rocket className="w-5 h-5" />
                <span>Start Free Analysis</span>
              </button>
              
              <button 
                onClick={() => navigate('/enterprise')}
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center space-x-2"
              >
                <Building2 className="w-5 h-5" />
                <span>Enterprise Demo</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <EnhancedFooter />

      {/* Modals */}
      <AnimatePresence>
        {showIntentModal && (
      <IntentDetectionModal
        isOpen={showIntentModal}
        onIntentSelect={handleIntentSelect}
        onClose={() => setShowIntentModal(false)}
      />
        )}

        {showOnboardingFlow && selectedIntent && (
        <OnboardingFlowRenderer
          userIntent={selectedIntent}
          onComplete={handleOnboardingComplete}
          onFeatureReveal={(features) => {
            console.log('Features revealed:', features);
          }}
          onBack={handleBackToIntentSelection}
        />
      )}
      </AnimatePresence>
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