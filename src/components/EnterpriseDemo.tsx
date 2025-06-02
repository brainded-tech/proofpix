import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhotoToDocumentUpsell } from './PhotoToDocumentUpsell';
import { IndustrySelector } from './IndustrySelector';
import CompetitorComparison from './CompetitorComparison';
import EnterpriseContactForm from './EnterpriseContactForm';
import { ExitIntentPopup } from './ExitIntentPopup';
import { DemoManager } from './demo/DemoManager';
import { Play, Sparkles, Shield, Zap, Users, ArrowRight, BarChart3, FileText, Lock, Globe, CheckCircle, AlertTriangle, Eye, Download, Pause, RotateCcw, Settings } from 'lucide-react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  duration: number;
}

interface SampleDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  piiDetected: boolean;
  confidence: number;
  processingTime: number;
}

export const EnterpriseDemo: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showDemoManager, setShowDemoManager] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedDocuments, setProcessedDocuments] = useState<SampleDocument[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    documentsProcessed: 0,
    averageProcessingTime: 0,
    privacyViolations: 0,
    complianceScore: 100
  });

  // For demo purposes - normally this would be triggered by exit intent
  const handleShowExitPopup = () => {
    setShowExitPopup(true);
  };
  
  const handleCloseExitPopup = () => {
    setShowExitPopup(false);
  };

  const handleLaunchDemo = () => {
    setShowDemoManager(true);
  };

  const handleCloseDemoManager = () => {
    setShowDemoManager(false);
  };

  // Sample documents for demo
  const sampleDocuments: SampleDocument[] = [
    {
      id: '1',
      name: 'Medical_Record_Patient_001.pdf',
      type: 'Healthcare Document',
      size: '2.4 MB',
      riskLevel: 'critical',
      piiDetected: true,
      confidence: 0.98,
      processingTime: 1.2
    },
    {
      id: '2',
      name: 'Legal_Contract_NDA_2024.pdf',
      type: 'Legal Document',
      size: '1.8 MB',
      riskLevel: 'medium',
      piiDetected: true,
      confidence: 0.94,
      processingTime: 0.8
    },
    {
      id: '3',
      name: 'Financial_Statement_Q4.pdf',
      type: 'Financial Document',
      size: '3.1 MB',
      riskLevel: 'high',
      piiDetected: true,
      confidence: 0.96,
      processingTime: 1.5
    },
    {
      id: '4',
      name: 'Employee_Handbook_2024.pdf',
      type: 'Business Document',
      size: '5.2 MB',
      riskLevel: 'low',
      piiDetected: false,
      confidence: 0.92,
      processingTime: 2.1
    }
  ];

  const demoSteps: DemoStep[] = [
    {
      id: 'upload',
      title: 'Bulk Document Upload',
      description: 'Upload hundreds of documents simultaneously with drag-and-drop interface',
      component: <BulkUploadDemo />,
      duration: 5000
    },
    {
      id: 'processing',
      title: 'Real-time AI Processing',
      description: 'Watch documents get processed with advanced AI analysis in real-time',
      component: <RealTimeProcessingDemo documents={sampleDocuments} />,
      duration: 8000
    },
    {
      id: 'privacy',
      title: 'Privacy Risk Assessment',
      description: 'Automatic detection of PII and privacy risks with compliance scoring',
      component: <PrivacyAnalysisDemo documents={processedDocuments} />,
      duration: 6000
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Secure team workspaces with role-based access and audit trails',
      component: <CollaborationDemo />,
      duration: 7000
    },
    {
      id: 'analytics',
      title: 'Enterprise Analytics',
      description: 'Comprehensive dashboards with real-time metrics and insights',
      component: <AnalyticsDashboardDemo metrics={realTimeMetrics} />,
      duration: 6000
    },
    {
      id: 'compliance',
      title: 'Compliance Reporting',
      description: 'Automated compliance reports for GDPR, HIPAA, SOX, and more',
      component: <ComplianceReportingDemo />,
      duration: 5000
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (demoSteps[currentStep].duration / 100));
          
          if (newProgress >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(prev => prev + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          
          return newProgress;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, demoSteps]);

  // Simulate document processing
  useEffect(() => {
    if (currentStep === 1 && isPlaying) {
      const processDocuments = () => {
        sampleDocuments.forEach((doc, index) => {
          setTimeout(() => {
            setProcessedDocuments(prev => [...prev, doc]);
            setRealTimeMetrics(prev => ({
              documentsProcessed: prev.documentsProcessed + 1,
              averageProcessingTime: (prev.averageProcessingTime + doc.processingTime) / 2,
              privacyViolations: prev.privacyViolations + (doc.piiDetected ? 1 : 0),
              complianceScore: Math.max(85, prev.complianceScore - (doc.riskLevel === 'critical' ? 5 : 0))
            }));
          }, index * 2000);
        });
      };
      
      processDocuments();
    }
  }, [currentStep, isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    setProcessedDocuments([]);
    setRealTimeMetrics({
      documentsProcessed: 0,
      averageProcessingTime: 0,
      privacyViolations: 0,
      complianceScore: 100
    });
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Enterprise ProofPix Demo
          </h1>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Experience the power of enterprise-grade document intelligence with real-time demonstrations
          </p>
          
          {/* Demo Controls */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Demo
            </button>
            <button
              onClick={handlePause}
              disabled={!isPlaying}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Demo Progress</span>
            <span className="text-sm text-blue-200">
              Step {currentStep + 1} of {demoSteps.length}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / demoSteps.length) * 100 + (progress / demoSteps.length)}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {demoSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`p-4 rounded-lg border-2 transition-all ${
                index === currentStep
                  ? 'border-blue-400 bg-blue-500/20'
                  : index < currentStep
                  ? 'border-green-400 bg-green-500/20'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-slate-600'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="text-sm font-medium">{step.title}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">{demoSteps[currentStep].title}</h2>
            <p className="text-blue-200 text-lg">{demoSteps[currentStep].description}</p>
          </div>
          
          <div className="min-h-[400px]">
            {demoSteps[currentStep].component}
          </div>
          
          {/* Step Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Step Progress</span>
              <span className="text-sm text-blue-200">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Demo Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
            <Shield className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
            <p className="text-slate-300">
              Bank-level encryption, zero-trust architecture, and compliance with all major regulations.
            </p>
          </div>
          
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
            <Zap className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-slate-300">
              Process thousands of documents per minute with our optimized AI pipeline.
            </p>
          </div>
          
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
            <Users className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
            <p className="text-slate-300">
              Seamless team workflows with role-based access and real-time collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Components
const BulkUploadDemo: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filesUploaded, setFilesUploaded] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress <= 100) {
          setFilesUploaded(Math.floor(newProgress / 10));
          return newProgress;
        }
        return 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-blue-400 rounded-xl p-12 text-center bg-blue-500/10">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">Drag & Drop Documents</h3>
        <p className="text-blue-200 mb-4">Upload up to 1,000 documents at once</p>
        <div className="text-2xl font-bold text-green-400">{filesUploaded} files uploaded</div>
      </div>
      
      <div className="bg-slate-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Upload Progress</span>
          <span className="text-blue-400">{uploadProgress}%</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const RealTimeProcessingDemo: React.FC<{ documents: SampleDocument[] }> = ({ documents }) => {
  const [processingQueue, setProcessingQueue] = useState<SampleDocument[]>([]);
  const [currentlyProcessing, setCurrentlyProcessing] = useState<SampleDocument | null>(null);

  useEffect(() => {
    setProcessingQueue(documents);
  }, [documents]);

  useEffect(() => {
    if (processingQueue.length > 0 && !currentlyProcessing) {
      const nextDoc = processingQueue[0];
      setCurrentlyProcessing(nextDoc);
      setProcessingQueue(prev => prev.slice(1));
      
      setTimeout(() => {
        setCurrentlyProcessing(null);
      }, nextDoc.processingTime * 1000);
    }
  }, [processingQueue, currentlyProcessing]);

  return (
    <div className="space-y-6">
      {currentlyProcessing && (
        <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Processing: {currentlyProcessing.name}</h3>
              <p className="text-blue-200">AI Analysis in progress...</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Type:</span>
              <div className="font-medium">{currentlyProcessing.type}</div>
            </div>
            <div>
              <span className="text-slate-400">Size:</span>
              <div className="font-medium">{currentlyProcessing.size}</div>
            </div>
            <div>
              <span className="text-slate-400">Confidence:</span>
              <div className="font-medium">{(currentlyProcessing.confidence * 100).toFixed(1)}%</div>
            </div>
            <div>
              <span className="text-slate-400">ETA:</span>
              <div className="font-medium">{currentlyProcessing.processingTime}s</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid gap-4">
        <h4 className="font-bold">Processing Queue ({processingQueue.length} remaining)</h4>
        {processingQueue.slice(0, 3).map((doc) => (
          <div key={doc.id} className="bg-slate-700 rounded-lg p-4 flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{doc.name}</div>
              <div className="text-sm text-slate-400">{doc.type} • {doc.size}</div>
            </div>
            <div className="text-sm text-slate-400">Queued</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PrivacyAnalysisDemo: React.FC<{ documents: SampleDocument[] }> = ({ documents }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-900/30 border-red-400';
      case 'high': return 'text-orange-400 bg-orange-900/30 border-orange-400';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-400';
      case 'low': return 'text-green-400 bg-green-900/30 border-green-400';
      default: return 'text-slate-400 bg-slate-900/30 border-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-red-500/20 border border-red-400 rounded-lg p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-400">
            {documents.filter(d => d.riskLevel === 'critical').length}
          </div>
          <div className="text-sm">Critical Risk</div>
        </div>
        
        <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4 text-center">
          <Eye className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-400">
            {documents.filter(d => d.piiDetected).length}
          </div>
          <div className="text-sm">PII Detected</div>
        </div>
        
        <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 text-center">
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-400">
            {Math.round((documents.filter(d => d.riskLevel === 'low').length / documents.length) * 100)}%
          </div>
          <div className="text-sm">Compliant</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{doc.name}</div>
              <div className={`px-3 py-1 rounded-full text-xs border ${getRiskColor(doc.riskLevel)}`}>
                {doc.riskLevel.toUpperCase()}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
              <div>Type: {doc.type}</div>
              <div>PII: {doc.piiDetected ? 'Detected' : 'None'}</div>
              <div>Confidence: {(doc.confidence * 100).toFixed(1)}%</div>
              <div>Processed: {doc.processingTime}s</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CollaborationDemo: React.FC = () => {
  const teamMembers = [
    { name: 'Sarah Johnson', role: 'Legal Analyst', status: 'online', avatar: 'SJ' },
    { name: 'Mike Chen', role: 'Compliance Officer', status: 'online', avatar: 'MC' },
    { name: 'Emily Davis', role: 'Data Scientist', status: 'away', avatar: 'ED' },
    { name: 'James Wilson', role: 'Security Admin', status: 'offline', avatar: 'JW' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-700 rounded-lg p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </h4>
          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-slate-400">{member.role}</div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  member.status === 'online' ? 'bg-green-400' :
                  member.status === 'away' ? 'bg-yellow-400' : 'bg-slate-400'
                }`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Recent Activity
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Sarah reviewed Medical_Record_001.pdf</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Mike flagged Legal_Contract_NDA.pdf</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>Emily updated compliance rules</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span>James configured security settings</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-6">
        <h4 className="font-bold mb-2">Real-time Collaboration Features</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Live document editing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Role-based permissions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Audit trail logging</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Secure team workspaces</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Real-time notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Version control</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboardDemo: React.FC<{ metrics: any }> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{metrics.documentsProcessed}</div>
          <div className="text-sm">Documents Processed</div>
        </div>
        <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{metrics.averageProcessingTime.toFixed(1)}s</div>
          <div className="text-sm">Avg Processing Time</div>
        </div>
        <div className="bg-red-500/20 border border-red-400 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{metrics.privacyViolations}</div>
          <div className="text-sm">Privacy Violations</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{metrics.complianceScore}%</div>
          <div className="text-sm">Compliance Score</div>
        </div>
      </div>
      
      <div className="bg-slate-700 rounded-lg p-6">
        <h4 className="font-bold mb-4">Processing Trends</h4>
        <div className="h-32 bg-slate-800 rounded-lg flex items-end justify-center p-4">
          <div className="text-center text-slate-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
            <div>Real-time analytics visualization</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComplianceReportingDemo: React.FC = () => {
  const complianceReports = [
    { name: 'GDPR Compliance Report', status: 'Generated', score: 98, date: '2024-01-15' },
    { name: 'HIPAA Assessment', status: 'In Progress', score: 95, date: '2024-01-14' },
    { name: 'SOX Financial Review', status: 'Generated', score: 92, date: '2024-01-13' },
    { name: 'ISO 27001 Audit', status: 'Scheduled', score: null, date: '2024-01-16' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-400">4</div>
          <div className="text-sm">Active Frameworks</div>
        </div>
        <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4 text-center">
          <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-400">12</div>
          <div className="text-sm">Reports Generated</div>
        </div>
        <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-4 text-center">
          <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-400">95%</div>
          <div className="text-sm">Avg Compliance</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {complianceReports.map((report, index) => (
          <div key={index} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{report.name}</div>
              <div className="text-sm text-slate-400">{report.date}</div>
            </div>
            <div className="flex items-center gap-4">
              {report.score && (
                <div className="text-right">
                  <div className="font-bold text-green-400">{report.score}%</div>
                  <div className="text-xs text-slate-400">Score</div>
                </div>
              )}
              <div className={`px-3 py-1 rounded-full text-xs ${
                report.status === 'Generated' ? 'bg-green-500/20 text-green-400' :
                report.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {report.status}
              </div>
              <button className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnterpriseDemo; 