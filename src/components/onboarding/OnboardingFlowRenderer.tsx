import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  FileText, 
  Shield, 
  Building2,
  Zap,
  Eye,
  Download,
  Users,
  Settings,
  X
} from 'lucide-react';
import { UserIntent } from './IntentDetectionModal';

interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  action?: string;
  nextButton: string;
  visual?: string;
  interactive?: string;
  preview?: string;
  features?: string[];
  cta?: string;
  secondary?: string;
  completion_triggers?: string[];
}

interface OnboardingFlow {
  [key: string]: {
    steps: OnboardingStep[];
  };
}

interface OnboardingFlowRendererProps {
  userIntent: UserIntent;
  onComplete: () => void;
  onFeatureReveal: (features: string[]) => void;
  onBack?: () => void;
}

const ONBOARDING_FLOWS: OnboardingFlow = {
  simplified_workflow: {
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Secure Image Analysis',
        content: 'Your images stay on your device - no uploads, complete privacy',
        action: 'upload_single_image',
        nextButton: 'Upload My First Image',
        visual: 'privacy_animation'
      },
      {
        id: 'processing_demo',
        title: 'Processing Locally on Your Device',
        content: 'Watch as we extract metadata without sending data anywhere',
        visual: 'processing_animation_with_privacy_emphasis',
        nextButton: 'See My Results'
      },
      {
        id: 'results_exploration',
        title: 'Explore Your Image Information',
        content: 'Here\'s what we found - all processed securely on your device',
        features: ['key_metadata_highlights', 'export_options'],
        nextButton: 'Try Another Image'
      },
      {
        id: 'feature_teaser',
        title: 'Ready for More?',
        content: 'Process multiple images at once with batch processing',
        cta: 'Try Batch Processing',
        secondary: 'I\'m Good for Now',
        nextButton: 'Continue'
      }
    ]
  },
  professional_workflow: {
    steps: [
      {
        id: 'professional_welcome',
        title: 'Professional Image Analysis Workflow',
        content: 'Create reports, process batches, maintain complete privacy',
        action: 'demo_batch_upload',
        nextButton: 'See Professional Features'
      },
      {
        id: 'batch_processing_demo',
        title: 'Batch Processing Power',
        content: 'Upload multiple images and process them simultaneously',
        interactive: 'guided_batch_upload',
        nextButton: 'Generate Professional Report'
      },
      {
        id: 'pdf_report_demo',
        title: 'Professional PDF Reports',
        content: 'Create client-ready reports with your branding',
        preview: 'pdf_template_preview',
        nextButton: 'Explore Templates'
      },
      {
        id: 'advanced_features',
        title: 'Advanced Professional Tools',
        content: 'API access, custom templates, team collaboration',
        features: ['api_overview', 'template_customization', 'team_features'],
        cta: 'Upgrade to Professional',
        secondary: 'Continue with Free Features',
        nextButton: 'Continue'
      }
    ]
  },
  enterprise_demo_workflow: {
    steps: [
      {
        id: 'enterprise_security',
        title: 'Enterprise-Grade Security',
        content: 'Zero server exposure, complete compliance, audit trails',
        visual: 'security_architecture_diagram',
        nextButton: 'Explore Enterprise Demo'
      },
      {
        id: 'live_enterprise_demo',
        title: 'Experience Enterprise Simulation',
        content: 'Interact with our TechCorp Industries simulation',
        action: 'redirect_to_enterprise_demo',
        nextButton: 'Launch Enterprise Demo'
      },
      {
        id: 'compliance_overview',
        title: 'Compliance & Certifications',
        content: 'GDPR, CCPA, HIPAA, SOC 2 - built for enterprise requirements',
        features: ['compliance_badge_display'],
        nextButton: 'See Implementation Options'
      },
      {
        id: 'implementation_discussion',
        title: 'Ready to Implement?',
        content: 'Let\'s discuss your specific requirements and timeline',
        cta: 'Schedule Enterprise Consultation',
        secondary: 'Download Enterprise Overview',
        nextButton: 'Continue'
      }
    ]
  },
  privacy_emphasis_workflow: {
    steps: [
      {
        id: 'privacy_architecture',
        title: 'Complete Privacy by Design',
        content: 'See how we process everything locally without any data leaving your device',
        visual: 'privacy_architecture_demo',
        nextButton: 'See Privacy in Action'
      },
      {
        id: 'local_processing_demo',
        title: 'Local Processing Demonstration',
        content: 'Upload an image and watch real-time local processing',
        interactive: 'privacy_focused_upload',
        nextButton: 'Explore Security Features'
      },
      {
        id: 'compliance_features',
        title: 'Built for Compliance',
        content: 'GDPR, CCPA, HIPAA ready with audit trails and documentation',
        features: ['compliance_overview', 'audit_trail_demo'],
        nextButton: 'Try Secure Processing'
      },
      {
        id: 'security_validation',
        title: 'Verify Our Security Claims',
        content: 'Review our security architecture and third-party audits',
        cta: 'View Security Documentation',
        secondary: 'Start Processing Images',
        nextButton: 'Continue'
      }
    ]
  }
};

const InteractiveDemo: React.FC<{ type: string; onComplete?: () => void }> = ({ type, onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (type === 'processing_animation_with_privacy_emphasis') {
      setIsProcessing(true);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            onComplete?.();
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [type, onComplete]);

  switch (type) {
    case 'privacy_animation':
      return (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
            Your data never leaves your device
          </p>
        </div>
      );

    case 'processing_animation_with_privacy_emphasis':
      return (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">sample-image.jpg</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Processing locally...</p>
              </div>
            </div>
            <div className="text-green-600 dark:text-green-400">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              {progress < 50 ? 'Extracting EXIF data...' : 
               progress < 80 ? 'Analyzing metadata...' : 
               progress < 100 ? 'Generating report...' : 'Complete!'}
            </p>
          </div>
        </div>
      );

    case 'security_architecture_diagram':
      return (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Device</p>
            </div>
            
            <div className="flex justify-center">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-green-600 dark:text-green-400"
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Local Processing</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-red-700 dark:text-red-300">
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">No server uploads • No data exposure</span>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 text-center">
          <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Interactive demo placeholder</p>
        </div>
      );
  }
};

export const OnboardingFlowRenderer: React.FC<OnboardingFlowRendererProps> = ({
  userIntent,
  onComplete,
  onFeatureReveal,
  onBack
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const flow = ONBOARDING_FLOWS[userIntent.flow];
  const currentStep = flow?.steps[currentStepIndex];
  const isLastStep = currentStepIndex === flow?.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      onFeatureReveal(userIntent.features_revealed);
      onComplete();
      return;
    }

    setIsTransitioning(true);
    setCompletedSteps(prev => [...prev, currentStep.id]);
    
    setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePrevious = () => {
    if (isFirstStep) {
      onBack?.();
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStepIndex(prev => prev - 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'redirect_to_enterprise_demo':
        window.open('/enterprise/demo', '_blank');
        break;
      case 'upload_single_image':
        // Trigger file upload
        break;
      default:
        handleNext();
    }
  };

  if (!flow || !currentStep) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Progress Header */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {userIntent.title}
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Step {currentStepIndex + 1} of {flow.steps.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / flow.steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Step Title and Content */}
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  {currentStep.title}
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {currentStep.content}
                </p>
              </div>

              {/* Interactive Demo */}
              {currentStep.visual && (
                <div className="max-w-2xl mx-auto">
                  <InteractiveDemo 
                    type={currentStep.visual} 
                    onComplete={() => {
                      // Auto-advance after demo completion
                      setTimeout(handleNext, 1000);
                    }}
                  />
                </div>
              )}

              {/* Features List */}
              {currentStep.features && (
                <div className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentStep.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                      >
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fixed Footer with Action Buttons */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <button
              onClick={handlePrevious}
              className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isFirstStep ? 'Back to Selection' : 'Previous'}</span>
            </button>

            <div className="flex space-x-3">
              {currentStep.secondary && (
                <button
                  onClick={onComplete}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {currentStep.secondary}
                </button>
              )}
              
              <button
                onClick={currentStep.action ? () => handleAction(currentStep.action!) : handleNext}
                disabled={isTransitioning}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <span>{currentStep.cta || currentStep.nextButton}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingFlowRenderer; 