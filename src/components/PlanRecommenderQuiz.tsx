import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Image, Users, Clock, Code, Building, Shield, Star, CheckCircle, Zap, ChevronLeft } from 'lucide-react';
import { EnterpriseButton } from './ui/EnterpriseComponents';
import { pricingAnalytics } from '../utils/analytics';
import { useABTest } from '../utils/abTesting';

interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: {
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    value: any;
  }[];
  type: 'single' | 'multiple' | 'slider';
  required?: boolean;
}

interface RecommendationResult {
  planId: string;
  planName: string;
  confidence: number;
  reasons: string[];
  alternativePlans: {
    planId: string;
    planName: string;
    description: string;
  }[];
}

const PlanRecommenderQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);
  const [quizStartTime] = useState(Date.now());
  const [isExitingStep, setIsExitingStep] = useState(false);
  const [isEnteringStep, setIsEnteringStep] = useState(true);
  
  // A/B Testing integration
  const quizLayoutTest = useABTest('quiz_layout_test');
  const quizLayout = quizLayoutTest.variant ? quizLayoutTest.variant.id : 'standard';
  
  // Track quiz start
  useEffect(() => {
    pricingAnalytics.trackQuizStart();
  }, []);

  // Transition between steps with animation
  const goToNextStep = () => {
    setIsExitingStep(true);
    
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
      setIsExitingStep(false);
      setIsEnteringStep(true);
      
      setTimeout(() => {
        setIsEnteringStep(false);
      }, 500);
    }, 300);
    
    // Track quiz step
    const currentQuestion = questions[currentStep];
    pricingAnalytics.trackQuizStep(
      currentStep + 1, 
      currentQuestion.question, 
      JSON.stringify(answers[currentQuestion.id])
    );
    
    // Track in A/B testing
    quizLayoutTest.trackEvent('next_step_clicked', undefined, {
      currentStep,
      answerSelected: answers[currentQuestion.id]
    });
  };
  
  const goToPreviousStep = () => {
    if (currentStep === 0) return;
    
    setIsExitingStep(true);
    
    setTimeout(() => {
      setCurrentStep(currentStep - 1);
      setIsExitingStep(false);
      setIsEnteringStep(true);
      
      setTimeout(() => {
        setIsEnteringStep(false);
      }, 500);
    }, 300);
    
    quizLayoutTest.trackEvent('previous_step_clicked', undefined, {
      currentStep
    });
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulating an API call to get recommendation
    setTimeout(() => {
      const recommendation = getRecommendation(answers);
      setRecommendation(recommendation);
      setIsSubmitting(false);
      
      // Track quiz completion
      pricingAnalytics.trackQuizComplete(
        recommendation.planId,
        answers
      );
      
      quizLayoutTest.trackConversion(1, {
        recommendedPlan: recommendation.planId,
        completionTime: Date.now() - quizStartTime
      });
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendation(null);
    setShowReasoning(false);
    
    quizLayoutTest.trackEvent('quiz_restarted');
  };

  const getRecommendation = (answers: Record<string, any>): RecommendationResult => {
    // Destructure and ensure proper typing for comparison
    const teamSize = answers.teamSize as string;
    const imageVolume = answers.imageVolume as string;
    const complianceLevel = answers.complianceLevel as string;
    const timeHorizon = answers.timeHorizon as string;
    const techIntegration = answers.techIntegration as string;
    const useCase = answers.useCase as string;
    
    // Enterprise criteria
    if (
      (teamSize === 'large' || teamSize === 'enterprise') ||
      complianceLevel === 'strict' ||
      techIntegration === 'deep'
    ) {
      return {
        planId: 'enterprise',
        planName: 'Enterprise',
        confidence: 94,
        reasons: [
          teamSize === 'large' || teamSize === 'enterprise' ? 'Your large team size requires enterprise-level features' : '',
          complianceLevel === 'strict' ? 'Your strict compliance requirements need enterprise-grade security' : '',
          techIntegration === 'deep' ? 'Your deep integration needs require customized enterprise solutions' : '',
          'Unlimited access to all features and dedicated support'
        ].filter(Boolean),
        alternativePlans: [
          {
            planId: 'business',
            planName: 'Business Plan',
            description: 'If budget is a concern, our Business plan offers many enterprise features at a lower price point'
          }
        ]
      };
    }
    
    // Business criteria
    if (
      (teamSize === 'medium' || imageVolume === 'high') ||
      complianceLevel === 'industry' ||
      useCase === 'business'
    ) {
      return {
        planId: 'business',
        planName: 'Business',
        confidence: 89,
        reasons: [
          teamSize === 'medium' ? 'Your team size (5-25 users) is ideal for our Business plan' : '',
          imageVolume === 'high' ? 'Your high volume of images requires the processing power of our Business plan' : '',
          complianceLevel === 'industry' ? 'Your industry compliance needs are covered by our Business plan' : '',
          useCase === 'business' ? 'Your business use case aligns perfectly with our Business plan features' : ''
        ].filter(Boolean),
        alternativePlans: [
          {
            planId: 'professional',
            planName: 'Professional Plan',
            description: 'If you need fewer seats but still want advanced features'
          },
          {
            planId: 'enterprise',
            planName: 'Enterprise Plan',
            description: 'If you need more customization and dedicated support'
          }
        ]
      };
    }
    
    // Professional criteria
    if (
      (teamSize === 'small' || imageVolume === 'medium') ||
      complianceLevel === 'basic' ||
      techIntegration === 'api' ||
      timeHorizon === 'long'
    ) {
      return {
        planId: 'professional',
        planName: 'Professional',
        confidence: 92,
        reasons: [
          teamSize === 'small' ? 'Your small team size (2-5 users) is perfect for our Professional plan' : '',
          imageVolume === 'medium' ? 'Your medium volume of image processing fits our Professional plan' : '',
          complianceLevel === 'basic' ? 'Your basic compliance needs are covered by our Professional plan' : '',
          techIntegration === 'api' ? 'Your API integration needs are included in our Professional plan' : '',
          timeHorizon === 'long' ? 'Your long-term needs are most cost-effective with a Professional subscription' : ''
        ].filter(Boolean),
        alternativePlans: [
          {
            planId: 'individual',
            planName: 'Individual Plan',
            description: 'If you\'re working solo but need professional features'
          },
          {
            planId: 'business',
            planName: 'Business Plan',
            description: 'If you expect your team to grow soon'
          }
        ]
      };
    }
    
    // Individual criteria
    if (
      (teamSize === 'individual' && imageVolume !== 'high') ||
      timeHorizon === 'long'
    ) {
      return {
        planId: 'individual',
        planName: 'Individual',
        confidence: 90,
        reasons: [
          teamSize === 'individual' ? 'As a solo user, our Individual plan gives you everything you need' : '',
          imageVolume === 'low' ? 'Your low volume of images is perfectly suited for our Individual plan' : '',
          timeHorizon === 'long' ? 'For ongoing use, our Individual subscription provides the best value' : ''
        ].filter(Boolean),
        alternativePlans: [
          {
            planId: 'month',
            planName: 'Month Pass',
            description: 'If you only need access for a month-long project'
          },
          {
            planId: 'professional',
            planName: 'Professional Plan',
            description: 'If you need more advanced features or API access'
          }
        ]
      };
    }
    
    // Week Pass criteria
    if (
      timeHorizon === 'medium' ||
      (imageVolume === 'low' && timeHorizon === 'short')
    ) {
      return {
        planId: 'week',
        planName: 'Week Pass',
        confidence: 88,
        reasons: [
          timeHorizon === 'medium' ? 'For your week-long project, our Week Pass is perfect' : '',
          imageVolume === 'low' && timeHorizon === 'short' ? 'For a short-term project with low volume, our Week Pass offers the best value' : ''
        ].filter(Boolean),
        alternativePlans: [
          {
            planId: 'day',
            planName: 'Day Pass',
            description: 'If you only need access for a single day'
          },
          {
            planId: 'month',
            planName: 'Month Pass',
            description: 'If your project might extend beyond a week'
          }
        ]
      };
    }
    
    // Day Pass criteria (default)
    return {
      planId: 'day',
      planName: 'Day Pass',
      confidence: 85,
      reasons: [
        timeHorizon === 'short' ? 'For your one-day project, our Day Pass is the most economical choice' : '',
        imageVolume === 'low' ? 'Your low volume of images fits perfectly within our Day Pass limits' : '',
        'Try out all features without commitment'
      ].filter(Boolean),
      alternativePlans: [
        {
          planId: 'week',
          planName: 'Week Pass',
          description: 'If you might need more than a day'
        },
        {
          planId: 'individual',
          planName: 'Individual Plan',
          description: 'If you expect to use ProofPix regularly'
        }
      ]
    };
  };

  const questions: QuizQuestion[] = [
    {
      id: 'teamSize',
      question: 'How large is your team?',
      description: 'Select the option that best describes your team size',
      options: [
        {
          id: 'individual',
          label: 'Just me',
          description: 'I\'m working solo',
          icon: <Users size={24} />,
          value: 'individual'
        },
        {
          id: 'small',
          label: 'Small team',
          description: '2-5 people',
          icon: <Users size={24} />,
          value: 'small'
        },
        {
          id: 'medium',
          label: 'Medium team',
          description: '6-25 people',
          icon: <Users size={24} />,
          value: 'medium'
        },
        {
          id: 'large',
          label: 'Large team',
          description: '26-100 people',
          icon: <Building size={24} />,
          value: 'large'
        },
        {
          id: 'enterprise',
          label: 'Enterprise',
          description: '100+ people',
          icon: <Building size={24} />,
          value: 'enterprise'
        }
      ],
      type: 'single',
      required: true
    },
    {
      id: 'imageVolume',
      question: 'How many images do you need to verify per month?',
      description: 'Select your estimated monthly volume',
      options: [
        {
          id: 'low',
          label: 'Low volume',
          description: 'Under 100 images',
          icon: <Image size={24} />,
          value: 'low'
        },
        {
          id: 'medium',
          label: 'Medium volume',
          description: '100-1,000 images',
          icon: <Image size={24} />,
          value: 'medium'
        },
        {
          id: 'high',
          label: 'High volume',
          description: '1,000+ images',
          icon: <Image size={24} />,
          value: 'high'
        }
      ],
      type: 'single',
      required: true
    },
    {
      id: 'timeHorizon',
      question: 'How long do you need our services?',
      description: 'Select your estimated usage period',
      options: [
        {
          id: 'short',
          label: 'One-time project',
          description: 'Just a day or two',
          icon: <Clock size={24} />,
          value: 'short'
        },
        {
          id: 'medium',
          label: 'Short-term project',
          description: 'A few days to a week',
          icon: <Clock size={24} />,
          value: 'medium'
        },
        {
          id: 'long',
          label: 'Ongoing use',
          description: 'Regular, continuous use',
          icon: <Clock size={24} />,
          value: 'long'
        }
      ],
      type: 'single',
      required: true
    },
    {
      id: 'complianceLevel',
      question: 'What are your compliance requirements?',
      description: 'Select the option that best matches your needs',
      options: [
        {
          id: 'none',
          label: 'Standard',
          description: 'No special requirements',
          icon: <Check size={24} />,
          value: 'none'
        },
        {
          id: 'basic',
          label: 'Basic compliance',
          description: 'General business compliance',
          icon: <Shield size={24} />,
          value: 'basic'
        },
        {
          id: 'industry',
          label: 'Industry-specific',
          description: 'Healthcare, Legal, Finance, etc.',
          icon: <Shield size={24} />,
          value: 'industry'
        },
        {
          id: 'strict',
          label: 'Strict regulatory',
          description: 'Government, Critical infrastructure',
          icon: <Shield size={24} />,
          value: 'strict'
        }
      ],
      type: 'single',
      required: false
    },
    {
      id: 'techIntegration',
      question: 'Do you need technical integration?',
      description: 'Select your integration requirements',
      options: [
        {
          id: 'none',
          label: 'No integration',
          description: 'Standalone use only',
          icon: <Code size={24} />,
          value: 'none'
        },
        {
          id: 'export',
          label: 'Export options',
          description: 'I need to export results',
          icon: <Code size={24} />,
          value: 'export'
        },
        {
          id: 'api',
          label: 'API access',
          description: 'I need to access via API',
          icon: <Code size={24} />,
          value: 'api'
        },
        {
          id: 'deep',
          label: 'Deep integration',
          description: 'Custom integration needs',
          icon: <Code size={24} />,
          value: 'deep'
        }
      ],
      type: 'single',
      required: false
    },
    {
      id: 'useCase',
      question: 'What\'s your primary use case?',
      description: 'Select the option that best describes your needs',
      options: [
        {
          id: 'personal',
          label: 'Personal',
          description: 'For individual projects',
          value: 'personal'
        },
        {
          id: 'business',
          label: 'Business',
          description: 'For professional use',
          value: 'business'
        },
        {
          id: 'legal',
          label: 'Legal',
          description: 'For legal documentation',
          value: 'legal'
        },
        {
          id: 'content',
          label: 'Content Creation',
          description: 'For media & publishing',
          value: 'content'
        },
        {
          id: 'other',
          label: 'Other',
          description: 'Something else',
          value: 'other'
        }
      ],
      type: 'single',
      required: false
    }
  ];

  const isQuestionAnswered = (questionId: string): boolean => {
    return !!answers[questionId];
  };

  const canProceed = (): boolean => {
    const currentQuestion = questions[currentStep];
    return currentQuestion.required ? isQuestionAnswered(currentQuestion.id) : true;
  };

  const renderOptionSelection = (question: QuizQuestion) => {
    const selectedValue = answers[question.id];
    
    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {question.options.map(option => (
          <div
            key={option.id}
            className={`
              border rounded-xl p-4 cursor-pointer transition-all
              ${selectedValue === option.value
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-400'
              }
            `}
            onClick={() => handleAnswer(question.id, option.value)}
          >
            <div className="flex items-center mb-2">
              {option.icon && (
                <div className={`mr-3 ${selectedValue === option.value ? 'text-blue-500' : 'text-gray-400'}`}>
                  {option.icon}
                </div>
              )}
              <div className="font-medium">{option.label}</div>
              {selectedValue === option.value && (
                <div className="ml-auto text-blue-500">
                  <CheckCircle size={16} />
                </div>
              )}
            </div>
            {option.description && (
              <div className="text-sm text-gray-600">{option.description}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderQuestion = () => {
    if (currentStep >= questions.length) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">Analyzing your needs...</h3>
          <p className="text-slate-300">We're finding the perfect plan for you</p>
        </div>
      );
    }

    const question = questions[currentStep];
    
    return (
      <div 
        className={`
          transition-all duration-300 transform
          ${isExitingStep ? 'opacity-0 translate-x-20' : ''}
          ${isEnteringStep ? 'opacity-0 -translate-x-20' : 'opacity-100 translate-x-0'}
        `}
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-semibold text-slate-100">{question.question}</h3>
            <div className="text-sm text-slate-400">
              Step {currentStep + 1} of {questions.length}
            </div>
          </div>
          {question.description && (
            <p className="text-slate-300">{question.description}</p>
          )}
        </div>
        
        {question.type === 'single' && renderOptionSelection(question)}
        
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={goToPreviousStep}
            className={`
              flex items-center text-slate-400 hover:text-slate-200 font-medium
              ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}
            `}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </button>
          
          <EnterpriseButton
            onClick={currentStep === questions.length - 1 ? handleSubmit : goToNextStep}
            disabled={!canProceed()}
            className={`
              bg-blue-600 hover:bg-blue-700 text-white
              ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {currentStep === questions.length - 1 ? (
              'Get Recommendation'
            ) : (
              <>
                Next
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </EnterpriseButton>
        </div>
      </div>
    );
  };

  const renderRecommendation = () => {
    if (!recommendation) return null;
    
    return (
      <div className="animate-fadeIn">
        <div className="mb-8 text-center">
          <div className="bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <Star className="text-green-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Your Recommended Plan</h2>
          <p className="text-slate-300">Based on your needs, we recommend:</p>
        </div>

        <div className="bg-slate-700 rounded-xl border-2 border-blue-500 p-6 mb-8 relative">
          <div className="absolute -top-3 left-8">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              {recommendation.confidence}% Match
            </span>
          </div>

          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-100 mb-2">
                {recommendation.planName} Plan
              </h3>
              <div className="flex items-center mb-4">
                <Zap className="text-yellow-400 mr-2" size={18} />
                <span className="text-slate-300">Best plan for your needs</span>
              </div>
              
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm underline mb-4"
              >
                {showReasoning ? 'Hide why we recommend this' : 'See why we recommend this'}
              </button>
              
              {showReasoning && (
                <div className="bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-500/30">
                  <h4 className="font-semibold text-slate-100 mb-2">Why we recommend this plan:</h4>
              <ul className="space-y-2">
                {recommendation.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-green-400 mr-2 flex-shrink-0 mt-0.5" size={16} />
                        <span className="text-slate-300">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
              )}
              
              <EnterpriseButton
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  window.location.href = `/checkout?plan=${recommendation.planId}`;
                }}
              >
                Choose {recommendation.planName} Plan
              </EnterpriseButton>
            </div>
          </div>
        </div>

        {/* Alternative Plans */}
        {recommendation.alternativePlans.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Other plans to consider:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendation.alternativePlans.map(plan => (
                <div key={plan.planId} className="bg-slate-600 rounded-lg border border-slate-500 p-4">
                  <h4 className="font-semibold text-slate-100 mb-1">{plan.planName}</h4>
                  <p className="text-sm text-slate-300 mb-3">{plan.description}</p>
                  <button
                    onClick={() => {
                      window.location.href = `/checkout?plan=${plan.planId}`;
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View plan details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center">
          <button
            onClick={handleRestart}
            className="text-slate-400 hover:text-slate-200 text-sm"
          >
            Restart quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-slate-700 rounded-xl border border-slate-600 p-6 ${quizLayout === 'compact' || quizLayout.includes('compact') ? 'max-w-2xl mx-auto' : ''}`}>
      {isSubmitting ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">Finding your perfect plan...</h3>
          <p className="text-slate-300">We're analyzing your responses to recommend the best option</p>
        </div>
      ) : recommendation ? (
        renderRecommendation()
      ) : (
        <>
      <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Find Your Perfect Plan</h2>
            <p className="text-slate-300">Answer a few questions to get a personalized recommendation</p>
      </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(currentStep / questions.length) * 100}%` }}
              ></div>
            </div>
      </div>

          {renderQuestion()}
        </>
      )}
    </div>
  );
};

export default PlanRecommenderQuiz; 