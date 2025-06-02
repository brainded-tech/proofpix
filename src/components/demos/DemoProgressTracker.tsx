import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Brain, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Zap,
  Eye,
  Database,
  Cpu,
  Network
} from 'lucide-react';

interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'processing' | 'completed' | 'error';
  duration: number;
  progress: number;
  industrySpecific?: boolean;
}

interface DemoProgressTrackerProps {
  industryType: string;
  files: Array<{ name: string; size: string; type: string }>;
  onComplete: (results: any[]) => void;
  isActive: boolean;
}

const DemoProgressTracker: React.FC<DemoProgressTrackerProps> = ({
  industryType,
  files,
  onComplete,
  isActive
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<ProcessingStep[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);

  const getIndustrySteps = (industry: string): ProcessingStep[] => {
    const baseSteps = [
      {
        id: 'upload',
        name: 'File Upload',
        description: 'Securely uploading files to processing queue',
        icon: <Upload className="w-5 h-5" />,
        status: 'pending' as const,
        duration: 2,
        progress: 0
      },
      {
        id: 'validation',
        name: 'File Validation',
        description: 'Checking file integrity and format compatibility',
        icon: <Shield className="w-5 h-5" />,
        status: 'pending' as const,
        duration: 3,
        progress: 0
      },
      {
        id: 'extraction',
        name: 'Data Extraction',
        description: 'Extracting text, metadata, and visual elements',
        icon: <FileText className="w-5 h-5" />,
        status: 'pending' as const,
        duration: 5,
        progress: 0
      }
    ];

    const industrySteps = {
      legal: [
        {
          id: 'legal_analysis',
          name: 'Legal Document Analysis',
          description: 'Identifying clauses, citations, and legal entities',
          icon: <Brain className="w-5 h-5" />,
          status: 'pending' as const,
          duration: 8,
          progress: 0,
          industrySpecific: true
        },
        {
          id: 'chain_of_custody',
          name: 'Chain of Custody',
          description: 'Creating tamper-proof audit trail',
          icon: <Database className="w-5 h-5" />,
          status: 'pending' as const,
          duration: 4,
          progress: 0,
          industrySpecific: true
        }
      ],
      healthcare: [
        {
          id: 'phi_detection',
          name: 'PHI Detection',
          description: 'Identifying protected health information',
          icon: <Eye className="w-5 h-5" />,
          status: 'pending' as const,
          duration: 6,
          progress: 0,
          industrySpecific: true
        },
        {
          id: 'hipaa_compliance',
          name: 'HIPAA Compliance Check',
          description: 'Ensuring regulatory compliance standards',
          icon: <Shield className="w-5 h-5" />,
          status: 'pending' as const,
          duration: 5,
          progress: 0,
          industrySpecific: true
        }
      ],
      insurance: [
        {
          id: 'damage_assessment',
          name: 'Damage Assessment',
          description: 'Analyzing damage patterns and severity',
          icon: <Brain className="w-5 h-5" />,
          status: 'pending' as const,
          duration: 7,
          progress: 0,
          industrySpecific: true
        },
        {
          id: 'fraud_detection',
          name: 'Fraud Detection',
          description: 'Running fraud detection algorithms',
          icon: <AlertTriangle className="w-5 h-5" />,
          status: 'pending' as const,
          duration: 6,
          progress: 0,
          industrySpecific: true
        }
      ],
      enterprise: [
        {
          id: 'batch_processing',
          name: 'Batch Processing',
          description: 'Processing multiple files simultaneously',
          icon: <Cpu className="w-5 h-5" />,
          status: 'pending' as const,
          duration: 6,
          progress: 0,
          industrySpecific: true
        },
        {
          id: 'integration',
          name: 'System Integration',
          description: 'Integrating with enterprise workflows',
          icon: <Network className="w-5 h-5" />,
          status: 'pending' as const,
          duration: 4,
          progress: 0,
          industrySpecific: true
        }
      ]
    };

    const finalSteps = [
      {
        id: 'ai_analysis',
        name: 'AI Analysis',
        description: 'Running advanced AI models for insights',
        icon: <Brain className="w-5 h-5" />,
        status: 'pending' as const,
        duration: 10,
        progress: 0
      },
      {
        id: 'report_generation',
        name: 'Report Generation',
        description: 'Generating comprehensive analysis report',
        icon: <FileText className="w-5 h-5" />,
        status: 'pending' as const,
        duration: 3,
        progress: 0
      }
    ];

    return [
      ...baseSteps,
      ...(industrySteps[industry as keyof typeof industrySteps] || []),
      ...finalSteps
    ];
  };

  const getIndustryColor = (industry: string) => {
    const colors = {
      legal: 'from-blue-600 to-indigo-700',
      healthcare: 'from-green-600 to-emerald-700',
      insurance: 'from-orange-600 to-red-700',
      enterprise: 'from-purple-600 to-violet-700'
    };
    return colors[industry as keyof typeof colors] || 'from-gray-600 to-gray-700';
  };

  useEffect(() => {
    if (isActive) {
      setSteps(getIndustrySteps(industryType));
      setCurrentStep(0);
      setOverallProgress(0);
      setProcessingTime(0);
    }
  }, [isActive, industryType]);

  useEffect(() => {
    if (!isActive || currentStep >= steps.length) return;

    const timer = setInterval(() => {
      setProcessingTime(prev => prev + 1);
      
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        const current = newSteps[currentStep];
        
        if (current.status === 'pending') {
          current.status = 'processing';
        }
        
        if (current.status === 'processing') {
          current.progress = Math.min(current.progress + (100 / current.duration), 100);
          
          if (current.progress >= 100) {
            current.status = 'completed';
            
            // Move to next step after a brief delay
            setTimeout(() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
              } else {
                // All steps completed
                const mockResults = files.map((file, index) => ({
                  id: `result_${index}`,
                  fileName: file.name,
                  fileType: file.type,
                  processingTime: Math.floor(Math.random() * 10) + 5,
                  confidence: Math.floor(Math.random() * 20) + 80,
                  status: 'completed',
                  metadata: {
                    size: file.size,
                    dimensions: file.type.includes('image') ? '1920x1080' : undefined,
                    pages: file.type.includes('pdf') ? Math.floor(Math.random() * 10) + 1 : undefined
                  },
                  insights: [
                    {
                      category: `${industryType} Analysis`,
                      description: `Comprehensive ${industryType} analysis completed with high confidence`,
                      confidence: Math.floor(Math.random() * 20) + 80
                    }
                  ],
                  watermark: true
                }));
                
                onComplete(mockResults);
              }
            }, 500);
          }
        }
        
        return newSteps;
      });
      
      // Update overall progress
      const completedSteps = steps.filter(step => step.status === 'completed').length;
      const currentProgress = steps[currentStep]?.progress || 0;
      const newOverallProgress = ((completedSteps + currentProgress / 100) / steps.length) * 100;
      setOverallProgress(newOverallProgress);
      
    }, 100);

    return () => clearInterval(timer);
  }, [isActive, currentStep, steps, files, industryType, onComplete]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Processing Your Files
        </h3>
        <p className="text-gray-600">
          {files.length} files • {industryType} industry workflow
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${getIndustryColor(industryType)} rounded-lg flex items-center justify-center`}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Overall Progress</h4>
              <p className="text-sm text-gray-500">{Math.round(overallProgress)}% complete</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {Math.floor(processingTime / 60)}:{(processingTime % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-500">Processing time</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className={`h-3 bg-gradient-to-r ${getIndustryColor(industryType)} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Processing Steps */}
      <div className="space-y-4">
        <AnimatePresence>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl border transition-all duration-200 ${
                step.status === 'processing' 
                  ? 'border-blue-300 shadow-lg' 
                  : step.status === 'completed'
                  ? 'border-green-300'
                  : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    step.status === 'processing' 
                      ? 'bg-blue-100' 
                      : step.status === 'completed'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    {step.status === 'processing' || step.status === 'completed' ? step.icon : step.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{step.name}</h4>
                      {step.industrySpecific && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${getIndustryColor(industryType)} text-white`}>
                          {industryType}
                        </span>
                      )}
                      {getStatusIcon(step.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    
                    {step.status === 'processing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{Math.round(step.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="h-2 bg-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${step.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Files Being Processed */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Files in Queue</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-900 truncate">{file.name}</h5>
                  <p className="text-sm text-gray-500">{file.size}</p>
                </div>
                <div className="w-6 h-6">
                  {currentStep >= steps.length - 1 ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Clock className="w-6 h-6 text-blue-500 animate-spin" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoProgressTracker; 