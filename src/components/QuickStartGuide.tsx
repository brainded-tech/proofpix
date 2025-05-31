import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Briefcase, 
  Wrench, 
  Code, 
  Building2, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  X,
  Upload,
  Eye,
  TrendingUp,
  Calendar,
  Database,
  Shield,
  Download,
  FileCheck,
  Users,
  BookOpen
} from 'lucide-react';
import { analytics } from '../utils/analytics';

type UserType = 'business' | 'technical' | 'developer' | 'enterprise' | 'unknown';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  userTypes: UserType[];
  estimatedTime: string;
  route?: string;
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

interface QuickStartGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload?: () => void;
  currentPage?: string;
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ 
  isOpen, 
  onClose, 
  onFileUpload,
  currentPage = 'home'
}) => {
  const [userType, setUserType] = useState<UserType>('unknown');
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const navigate = useNavigate();

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
          estimatedTime: '2 minutes',
          route: '/docs/business/roi-calculator'
        },
        {
          id: 'demo',
          title: 'Schedule Enterprise Demo',
          description: 'Get personalized demonstration for your team',
          icon: <Calendar className="w-5 h-5" />,
          action: 'Schedule Demo',
          userTypes: ['business'],
          estimatedTime: '1 minute',
          route: '/enterprise/demo'
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
          estimatedTime: '5 minutes',
          route: '/docs/technical/architecture'
        },
        {
          id: 'security',
          title: 'Security Deep Dive',
          description: 'Explore comprehensive security documentation',
          icon: <Shield className="w-5 h-5" />,
          action: 'Review Security',
          userTypes: ['technical'],
          estimatedTime: '10 minutes',
          route: '/docs/technical/security-deep-dive'
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
          estimatedTime: '3 minutes',
          route: '/docs/api/quick-start'
        },
        {
          id: 'sdk',
          title: 'Download SDKs',
          description: 'Get started with our JavaScript, Python, or PHP SDKs',
          icon: <Download className="w-5 h-5" />,
          action: 'Download SDK',
          userTypes: ['developer'],
          estimatedTime: '2 minutes',
          route: '/docs/api/sdks'
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
          estimatedTime: '5 minutes',
          route: '/docs/enterprise/compliance'
        },
        {
          id: 'enterprise-demo',
          title: 'Enterprise Consultation',
          description: 'Speak with our enterprise solutions team',
          icon: <Users className="w-5 h-5" />,
          action: 'Contact Enterprise',
          userTypes: ['enterprise'],
          estimatedTime: '2 minutes',
          route: '/enterprise/demo'
        }
      ],
      unknown: []
    };

    return [...baseSteps, ...(userSpecificSteps[selectedUserType] || [])];
  };

  // Load saved user type and completed steps
  useEffect(() => {
    const savedUserType = localStorage.getItem('proofpix_user_type') as UserType;
    const savedSteps = JSON.parse(localStorage.getItem('proofpix_completed_steps') || '[]');
    
    if (savedUserType) {
      setUserType(savedUserType);
    } else {
      setShowUserTypeSelection(true);
    }
    
    setCompletedSteps(savedSteps);
  }, []);

  // Save completed steps to localStorage
  useEffect(() => {
    localStorage.setItem('proofpix_completed_steps', JSON.stringify(completedSteps));
  }, [completedSteps]);

  const handleUserTypeSelection = (selectedType: UserType) => {
    setUserType(selectedType);
    setShowUserTypeSelection(false);
    localStorage.setItem('proofpix_user_type', selectedType);
    analytics.trackFeatureUsage('User Type Selected', selectedType);
  };

  const handleStepAction = (step: OnboardingStep) => {
    // Mark step as completed
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps(prev => [...prev, step.id]);
      analytics.trackFeatureUsage('Onboarding Step Completed', step.id);
    }

    // Handle specific actions
    switch (step.id) {
      case 'upload':
        if (onFileUpload) {
          onFileUpload();
        } else {
          // Trigger file upload if on homepage
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          fileInput?.click();
        }
        break;
      case 'results':
        // Show results section
        document.querySelector('#results-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        if (step.route) {
          navigate(step.route);
          onClose();
        }
        break;
    }
  };

  const getProgressPercentage = () => {
    const totalSteps = getOnboardingSteps(userType).length;
    return totalSteps > 0 ? (completedSteps.length / totalSteps) * 100 : 0;
  };

  if (!isOpen) return null;

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
                  className="p-6 border-2 border-slate-200 rounded-xl cursor-pointer transition-all hover:border-blue-500 hover:shadow-lg group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
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
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-blue-600">
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
                  onClick={onClose}
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
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
                
                return (
                  <div 
                    key={step.id}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-slate-200 bg-white hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-blue-500 text-white'
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
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
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
                onClick={onClose}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Exploring
              </button>
              <button 
                onClick={() => {
                  navigate('/docs');
                  onClose();
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

export default QuickStartGuide; 