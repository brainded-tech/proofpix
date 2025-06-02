import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Upload, 
  Eye, 
  Download, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Shield, 
  Target, 
  Zap,
  AlertTriangle,
  FileImage,
  BarChart3,
  Settings,
  Users,
  Lock,
  Crown,
  Sparkles,
  X,
  RefreshCw
} from 'lucide-react';
import demoDataService, { DemoScenario, DemoSampleFile, DemoRestrictions } from '../../services/demoDataService';

interface InteractiveDemoProps {
  scenarioId: string;
  onComplete?: () => void;
  onExit?: () => void;
}

interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: 'select_file' | 'upload' | 'analyze' | 'view_results' | 'export' | 'complete';
  completed: boolean;
  highlight?: string;
  estimatedTime: number; // seconds
}

interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  results: any;
  error?: string;
}

export const InteractiveDemoInterface: React.FC<InteractiveDemoProps> = ({
  scenarioId,
  onComplete,
  onExit
}) => {
  const [scenario, setScenario] = useState<DemoScenario | null>(null);
  const [restrictions, setRestrictions] = useState<DemoRestrictions | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([]);
  const [selectedFile, setSelectedFile] = useState<DemoSampleFile | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    currentStep: '',
    results: null
  });
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  const [filesProcessed, setFilesProcessed] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);

  // Initialize demo session
  useEffect(() => {
    const initDemo = async () => {
      try {
        const success = demoDataService.startDemoSession(scenarioId);
        if (success) {
          const currentScenario = demoDataService.getCurrentScenario();
          const demoRestrictions = demoDataService.getDemoRestrictions();
          
          if (currentScenario && demoRestrictions) {
            setScenario(currentScenario);
            setRestrictions(demoRestrictions);
            setSessionTimeLeft(demoRestrictions.sessionDuration * 60); // Convert to seconds
            generateDemoSteps(currentScenario);
          }
        }
      } catch (error) {
        console.error('Failed to initialize demo:', error);
      }
    };

    initDemo();

    return () => {
      demoDataService.endDemoSession();
    };
  }, [scenarioId]);

  // Session timer
  useEffect(() => {
    if (sessionTimeLeft > 0 && demoStarted) {
      const timer = setInterval(() => {
        setSessionTimeLeft(prev => {
          if (prev <= 1) {
            handleDemoTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [sessionTimeLeft, demoStarted]);

  const generateDemoSteps = (scenario: DemoScenario) => {
    const steps: DemoStep[] = [
      {
        id: 'welcome',
        title: `Welcome to ${scenario.name}`,
        description: `Experience ${scenario.description} with real ProofPix technology and sample data.`,
        action: 'select_file',
        completed: false,
        highlight: 'All processing happens locally - your data never leaves your device.',
        estimatedTime: 30
      },
      {
        id: 'file_selection',
        title: 'Choose Sample File',
        description: `Select from ${scenario.sampleFiles.length} industry-specific sample files to analyze.`,
        action: 'select_file',
        completed: false,
        estimatedTime: 15
      },
      {
        id: 'upload',
        title: 'Upload & Process',
        description: 'Watch ProofPix analyze the sample file with real-time processing.',
        action: 'upload',
        completed: false,
        estimatedTime: 45
      },
      {
        id: 'analysis',
        title: 'AI Analysis',
        description: 'See advanced AI algorithms extract insights and metadata.',
        action: 'analyze',
        completed: false,
        estimatedTime: 60
      },
      {
        id: 'results',
        title: 'Review Results',
        description: 'Explore comprehensive analysis results and industry-specific insights.',
        action: 'view_results',
        completed: false,
        estimatedTime: 90
      },
      {
        id: 'export',
        title: 'Export Demo Report',
        description: 'Generate a sample report (watermarked for demo purposes).',
        action: 'export',
        completed: false,
        estimatedTime: 30
      }
    ];

    setDemoSteps(steps);
  };

  const startDemo = () => {
    setDemoStarted(true);
    setCurrentStep(1); // Move to file selection
  };

  const handleFileSelection = (file: DemoSampleFile) => {
    setSelectedFile(file);
    completeCurrentStep();
  };

  const handleUpload = async () => {
    if (!selectedFile || !scenario) return;

    setProcessing({
      isProcessing: true,
      progress: 0,
      currentStep: 'Uploading file...',
      results: null
    });

    // Simulate realistic upload and processing
    const steps = [
      { step: 'Uploading file...', duration: 1000 },
      { step: 'Validating file format...', duration: 800 },
      { step: 'Extracting metadata...', duration: 1500 },
      { step: 'Running AI analysis...', duration: 2000 },
      { step: 'Generating insights...', duration: 1200 },
      { step: 'Finalizing results...', duration: 500 }
    ];

    let totalProgress = 0;
    const progressIncrement = 100 / steps.length;

    for (const { step, duration } of steps) {
      setProcessing(prev => ({ ...prev, currentStep: step }));
      
      await new Promise(resolve => {
        const interval = setInterval(() => {
          totalProgress += progressIncrement / (duration / 100);
          setProcessing(prev => ({ 
            ...prev, 
            progress: Math.min(totalProgress, (steps.indexOf({ step, duration }) + 1) * progressIncrement)
          }));
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          resolve(void 0);
        }, duration);
      });
    }

    // Mark file as processed
    demoDataService.markFileProcessed(selectedFile.name);
    setFilesProcessed(prev => prev + 1);

    // Set results
    setProcessing({
      isProcessing: false,
      progress: 100,
      currentStep: 'Complete',
      results: selectedFile.expectedResults
    });

    completeCurrentStep();
  };

  const completeCurrentStep = () => {
    setDemoSteps(prev => prev.map((step, index) => 
      index === currentStep ? { ...step, completed: true } : step
    ));
    
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleViewResults = () => {
    setShowResults(true);
    completeCurrentStep();
  };

  const handleExport = () => {
    // Simulate export with watermark
    const exportData = {
      ...processing.results,
      watermark: 'DEMO VERSION - NOT FOR PRODUCTION USE',
      timestamp: new Date().toISOString(),
      restrictions: 'This is a demonstration report with sample data'
    };

    // Create downloadable demo report
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proofpix-demo-report-${scenario?.industry}.json`;
    a.click();
    URL.revokeObjectURL(url);

    completeCurrentStep();
  };

  const handleDemoTimeout = () => {
    alert('Demo session has expired. Please start a new demo to continue.');
    onExit?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIndustryColor = (industry?: string) => {
    const colors = {
      legal: 'blue',
      healthcare: 'green', 
      insurance: 'orange',
      enterprise: 'purple'
    };
    return colors[(industry || 'enterprise') as keyof typeof colors] || 'blue';
  };

  const getCurrentStepComponent = () => {
    const step = demoSteps[currentStep];
    if (!step) return null;

    switch (step.action) {
      case 'select_file':
        return <FileSelectionStep />;
      case 'upload':
        return <UploadStep />;
      case 'analyze':
        return <AnalysisStep />;
      case 'view_results':
        return <ResultsStep />;
      case 'export':
        return <ExportStep />;
      default:
        return <WelcomeStep />;
    }
  };

  const FileSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Choose Your Sample File</h3>
        <p className="text-slate-300">Select from industry-specific sample files to see ProofPix in action</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenario?.sampleFiles.map((file) => (
          <motion.div
            key={file.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFileSelection(file)}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              selectedFile?.id === file.id
                ? `border-${getIndustryColor(scenario.industry)}-500 bg-${getIndustryColor(scenario.industry)}-500/10`
                : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-${getIndustryColor(scenario.industry)}-500/20`}>
                <FileImage className={`w-6 h-6 text-${getIndustryColor(scenario.industry)}-400`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-2">{file.name}</h4>
                <p className="text-slate-300 text-sm mb-3">{file.description}</p>
                <div className="text-xs text-slate-400">
                  Type: {file.type}
                </div>
              </div>
              {selectedFile?.id === file.id && (
                <CheckCircle className={`w-6 h-6 text-${getIndustryColor(scenario.industry)}-400`} />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedFile && (
        <div className="text-center">
          <button
            onClick={() => setCurrentStep(2)}
            className={`bg-${getIndustryColor(scenario?.industry)}-600 hover:bg-${getIndustryColor(scenario?.industry)}-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto`}
          >
            Continue with {selectedFile.name}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );

  const UploadStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Processing Sample File</h3>
        <p className="text-slate-300">Watch ProofPix analyze your selected file in real-time</p>
      </div>

      {selectedFile && (
        <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <FileImage className={`w-8 h-8 text-${getIndustryColor(scenario?.industry)}-400`} />
            <div>
              <h4 className="font-semibold text-white">{selectedFile.name}</h4>
              <p className="text-slate-400 text-sm">{selectedFile.description}</p>
            </div>
          </div>
        </div>
      )}

      {processing.isProcessing ? (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-lg font-medium text-white mb-2">{processing.currentStep}</div>
            <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
              <div 
                className={`bg-${getIndustryColor(scenario?.industry)}-600 h-3 rounded-full transition-all duration-300`}
                style={{ width: `${processing.progress}%` }}
              ></div>
            </div>
            <div className="text-slate-400 text-sm">{Math.round(processing.progress)}% complete</div>
          </div>
        </div>
      ) : processing.results ? (
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-white mb-2">Processing Complete!</h4>
          <p className="text-slate-300 mb-6">Your file has been analyzed successfully</p>
          <button
            onClick={() => setCurrentStep(4)}
            className={`bg-${getIndustryColor(scenario?.industry)}-600 hover:bg-${getIndustryColor(scenario?.industry)}-700 text-white px-8 py-3 rounded-lg font-medium transition-colors`}
          >
            View Results
          </button>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`bg-${getIndustryColor(scenario?.industry)}-600 hover:bg-${getIndustryColor(scenario?.industry)}-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto`}
          >
            <Upload className="w-4 h-4 mr-2" />
            Start Processing
          </button>
        </div>
      )}
    </div>
  );

  const AnalysisStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">AI Analysis in Progress</h3>
        <p className="text-slate-300">Advanced algorithms are extracting insights from your file</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenario?.keyFeatures.map((feature, index) => (
          <div key={index} className="bg-slate-800/50 rounded-xl p-6 text-center">
            <Zap className={`w-8 h-8 text-${getIndustryColor(scenario.industry)}-400 mx-auto mb-4`} />
            <h4 className="font-semibold text-white mb-2">{feature}</h4>
            <div className="text-slate-400 text-sm">Active</div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleViewResults}
          className={`bg-${getIndustryColor(scenario?.industry)}-600 hover:bg-${getIndustryColor(scenario?.industry)}-700 text-white px-8 py-3 rounded-lg font-medium transition-colors`}
        >
          View Analysis Results
        </button>
      </div>
    </div>
  );

  const ResultsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Analysis Results</h3>
        <p className="text-slate-300">Comprehensive insights extracted from your sample file</p>
      </div>

      {processing.results && (
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h4 className="font-semibold text-white mb-4">Extracted Data & Insights</h4>
          <div className="space-y-4">
            {Object.entries(processing.results).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-white font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Crown className="w-6 h-6 text-yellow-400" />
          <div>
            <h4 className="font-semibold text-yellow-400">Demo Version</h4>
            <p className="text-yellow-300 text-sm">This is a demonstration with sample data. Production version provides full export capabilities.</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setCurrentStep(5)}
          className={`bg-${getIndustryColor(scenario?.industry)}-600 hover:bg-${getIndustryColor(scenario?.industry)}-700 text-white px-8 py-3 rounded-lg font-medium transition-colors`}
        >
          Export Demo Report
        </button>
      </div>
    </div>
  );

  const ExportStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">Export Demo Report</h3>
        <p className="text-slate-300">Generate a sample report to see ProofPix output format</p>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6">
        <h4 className="font-semibold text-white mb-4">Report Contents</h4>
        <ul className="space-y-2 text-slate-300">
          <li>• Complete metadata analysis</li>
          <li>• Industry-specific insights</li>
          <li>• Authenticity verification</li>
          <li>• Compliance documentation</li>
          <li>• Watermarked for demo purposes</li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={handleExport}
          className={`bg-${getIndustryColor(scenario?.industry)}-600 hover:bg-${getIndustryColor(scenario?.industry)}-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto`}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Demo Report
        </button>
      </div>
    </div>
  );

  const WelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-4">
        Welcome to {scenario?.name}
      </h2>
      
      <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
        {scenario?.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {scenario?.keyFeatures.map((feature, index) => (
          <div key={index} className="bg-slate-800/50 rounded-xl p-6">
            <Target className={`w-8 h-8 text-${getIndustryColor(scenario.industry)}-400 mx-auto mb-4`} />
            <h4 className="font-semibold text-white mb-2">{feature}</h4>
          </div>
        ))}
      </div>

      <button
        onClick={startDemo}
        className={`bg-${getIndustryColor(scenario?.industry)}-600 hover:bg-${getIndustryColor(scenario?.industry)}-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center mx-auto`}
      >
        <Play className="w-5 h-5 mr-2" />
        Start Interactive Demo
      </button>
    </div>
  );

  if (!scenario || !restrictions) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading demo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Demo Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 bg-${getIndustryColor(scenario.industry)}-400 rounded-full animate-pulse`}></div>
            <span className="font-semibold">Demo Session Active</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">Time Remaining: {formatTime(sessionTimeLeft)}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">Files Processed: {filesProcessed}/{restrictions.maxFiles}</span>
          </div>
          
          <button
            onClick={onExit}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-slate-800/30 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            {demoSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep 
                      ? `bg-${getIndustryColor(scenario.industry)}-500 text-white`
                      : 'bg-slate-600 text-slate-400'
                }`}>
                  {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                {index < demoSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step.completed ? 'bg-green-500' : 'bg-slate-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Demo Content */}
      <div className="max-w-6xl mx-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getCurrentStepComponent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Demo Restrictions Notice */}
      <div className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-white text-sm">Demo Limitations</h4>
            <ul className="text-xs text-slate-300 mt-1 space-y-1">
              <li>• Max {restrictions.maxFiles} files per session</li>
              <li>• {restrictions.sessionDuration} minute time limit</li>
              <li>• Watermarked results</li>
              <li>• Sample data only</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 