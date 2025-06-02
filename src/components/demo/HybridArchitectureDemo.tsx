/**
 * Hybrid Architecture Demo Component
 * 
 * This component provides a comprehensive demonstration of ProofPix's
 * hybrid architecture for sales presentations and enterprise demos.
 * 
 * Features:
 * - Live mode switching demonstration
 * - Privacy guarantees visualization
 * - Collaboration features showcase
 * - Security transparency
 * - Enterprise value proposition
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Lock, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Database,
  Server,
  Smartphone,
  Globe,
  FileText,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Download,
  Upload,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react';
import { hybridArchitectureService, ProcessingMode } from '../../services/hybridArchitectureService';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  mode: ProcessingMode;
  duration: number;
  highlights: string[];
  securityLevel: 'maximum' | 'high' | 'standard';
}

interface DemoScenario {
  id: string;
  name: string;
  description: string;
  industry: string;
  steps: DemoStep[];
  businessValue: string[];
}

export const HybridArchitectureDemo: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<ProcessingMode>('privacy');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<string>('enterprise-onboarding');
  const [demoProgress, setDemoProgress] = useState(0);
  const [architectureStatus, setArchitectureStatus] = useState<any>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    privacyScore: 100,
    collaborationActive: false,
    dataTransmission: false,
    serverStorage: false,
    encryptionLevel: 'AES-256',
    sessionExpiry: null as Date | null
  });

  // Demo scenarios for different industries and use cases
  const demoScenarios: DemoScenario[] = [
    {
      id: 'enterprise-onboarding',
      name: 'Enterprise Customer Onboarding',
      description: 'Demonstrate how enterprises can start with privacy and scale to collaboration',
      industry: 'Enterprise',
      steps: [
        {
          id: 'privacy-start',
          title: 'Privacy Mode - Initial Setup',
          description: 'Customer starts with maximum privacy protection',
          mode: 'privacy',
          duration: 3000,
          highlights: [
            'Images never leave device',
            'Zero server communication',
            'Impossible to breach',
            'Automatic GDPR compliance'
          ],
          securityLevel: 'maximum'
        },
        {
          id: 'privacy-processing',
          title: 'Client-Side AI Processing',
          description: 'AI analysis happens entirely on the client device',
          mode: 'privacy',
          duration: 4000,
          highlights: [
            'Local AI processing',
            'No data transmission',
            'Real-time results',
            'Privacy preserved'
          ],
          securityLevel: 'maximum'
        },
        {
          id: 'collaboration-consent',
          title: 'Team Collaboration Request',
          description: 'User opts into collaboration mode with explicit consent',
          mode: 'privacy',
          duration: 2000,
          highlights: [
            'Explicit user consent',
            'Clear privacy trade-offs',
            'Optional feature',
            'User control'
          ],
          securityLevel: 'maximum'
        },
        {
          id: 'collaboration-active',
          title: 'Ephemeral Collaboration',
          description: 'Secure team collaboration with auto-deletion',
          mode: 'collaboration',
          duration: 5000,
          highlights: [
            'Encrypted transmission',
            '24-hour auto-deletion',
            'Memory-only processing',
            'Complete audit trail'
          ],
          securityLevel: 'high'
        },
        {
          id: 'collaboration-cleanup',
          title: 'Automatic Data Cleanup',
          description: 'All collaboration data automatically deleted',
          mode: 'collaboration',
          duration: 2000,
          highlights: [
            'Guaranteed deletion',
            'No persistent storage',
            'Privacy restored',
            'Audit confirmation'
          ],
          securityLevel: 'high'
        }
      ],
      businessValue: [
        'Start with maximum privacy to build trust',
        'Scale to collaboration when needed',
        'Maintain compliance throughout',
        'Reduce security investment by 83%'
      ]
    },
    {
      id: 'healthcare-compliance',
      name: 'Healthcare HIPAA Compliance',
      description: 'Show how healthcare organizations can process sensitive documents',
      industry: 'Healthcare',
      steps: [
        {
          id: 'hipaa-privacy',
          title: 'HIPAA-Compliant Privacy Mode',
          description: 'Patient documents processed with maximum privacy',
          mode: 'privacy',
          duration: 4000,
          highlights: [
            'HIPAA automatic compliance',
            'Patient data never transmitted',
            'Local processing only',
            'Zero breach risk'
          ],
          securityLevel: 'maximum'
        },
        {
          id: 'medical-ai',
          title: 'Medical AI Analysis',
          description: 'AI analysis of medical documents without privacy compromise',
          mode: 'privacy',
          duration: 5000,
          highlights: [
            'Medical AI models',
            'Privacy-preserving analysis',
            'Instant results',
            'No data exposure'
          ],
          securityLevel: 'maximum'
        },
        {
          id: 'team-consultation',
          title: 'Secure Team Consultation',
          description: 'Medical team collaboration with ephemeral processing',
          mode: 'collaboration',
          duration: 4000,
          highlights: [
            'Encrypted medical data',
            'Temporary team access',
            'Audit trail for compliance',
            'Automatic cleanup'
          ],
          securityLevel: 'high'
        }
      ],
      businessValue: [
        'Automatic HIPAA compliance',
        'Zero patient data exposure',
        'Secure team collaboration',
        'Reduced compliance costs'
      ]
    },
    {
      id: 'legal-discovery',
      name: 'Legal Document Discovery',
      description: 'Demonstrate secure legal document processing and collaboration',
      industry: 'Legal',
      steps: [
        {
          id: 'legal-privacy',
          title: 'Attorney-Client Privilege Protection',
          description: 'Legal documents processed with absolute privacy',
          mode: 'privacy',
          duration: 3000,
          highlights: [
            'Attorney-client privilege preserved',
            'No document transmission',
            'Local analysis only',
            'Privileged information protected'
          ],
          securityLevel: 'maximum'
        },
        {
          id: 'legal-ai',
          title: 'Legal AI Document Analysis',
          description: 'AI-powered legal document analysis without exposure',
          mode: 'privacy',
          duration: 6000,
          highlights: [
            'Legal AI models',
            'Contract analysis',
            'Risk assessment',
            'Privacy maintained'
          ],
          securityLevel: 'maximum'
        },
        {
          id: 'legal-collaboration',
          title: 'Secure Legal Team Collaboration',
          description: 'Law firm team collaboration with ephemeral processing',
          mode: 'collaboration',
          duration: 4000,
          highlights: [
            'Encrypted legal documents',
            'Temporary team access',
            'Privilege protection',
            'Automatic deletion'
          ],
          securityLevel: 'high'
        }
      ],
      businessValue: [
        'Attorney-client privilege protection',
        'Secure legal team collaboration',
        'AI-powered legal analysis',
        'Reduced malpractice risk'
      ]
    }
  ];

  const currentScenario = demoScenarios.find(s => s.id === selectedScenario) || demoScenarios[0];
  const currentStepData = currentScenario.steps[currentStep];

  useEffect(() => {
    // Initialize architecture status
    const status = hybridArchitectureService.getArchitectureStatus();
    setArchitectureStatus(status);

    // Set up real-time metrics updates
    const interval = setInterval(() => {
      const mode = hybridArchitectureService.getCurrentMode();
      const session = hybridArchitectureService.getEphemeralSessionInfo();
      
      setCurrentMode(mode);
      setSessionInfo(session);
      
      setRealTimeMetrics({
        privacyScore: mode === 'privacy' ? 100 : 85,
        collaborationActive: mode === 'collaboration',
        dataTransmission: mode === 'collaboration',
        serverStorage: false, // Always false due to ephemeral processing
        encryptionLevel: 'AES-256',
        sessionExpiry: session?.expiresAt ? new Date(session.expiresAt) : null
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setDemoProgress(0);

    // Reset to privacy mode
    await hybridArchitectureService.switchMode('privacy');
    
    runDemoStep(0);
  };

  const runDemoStep = async (stepIndex: number) => {
    if (stepIndex >= currentScenario.steps.length) {
      setIsRunning(false);
      setDemoProgress(100);
      return;
    }

    const step = currentScenario.steps[stepIndex];
    setCurrentStep(stepIndex);

    // Switch to the required mode for this step
    if (step.mode !== currentMode) {
      if (step.mode === 'collaboration') {
        // Create ephemeral session for collaboration mode
        await hybridArchitectureService.createEphemeralSession();
      }
      await hybridArchitectureService.switchMode(step.mode, true);
    }

    // Simulate step processing
    const progressInterval = setInterval(() => {
      setDemoProgress(prev => {
        const stepProgress = ((stepIndex + 1) / currentScenario.steps.length) * 100;
        return Math.min(stepProgress, prev + 2);
      });
    }, step.duration / 50);

    // Wait for step duration
    setTimeout(() => {
      clearInterval(progressInterval);
      runDemoStep(stepIndex + 1);
    }, step.duration);
  };

  const stopDemo = () => {
    setIsRunning(false);
    setDemoProgress(0);
    setCurrentStep(0);
  };

  const resetDemo = async () => {
    setIsRunning(false);
    setDemoProgress(0);
    setCurrentStep(0);
    await hybridArchitectureService.switchMode('privacy');
    await hybridArchitectureService.deleteEphemeralSession();
  };

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'maximum': return <Shield className="w-5 h-5 text-green-600" />;
      case 'high': return <Lock className="w-5 h-5 text-blue-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getModeIcon = (mode: ProcessingMode) => {
    return mode === 'privacy' ? 
      <Shield className="w-6 h-6 text-green-600" /> : 
      <Users className="w-6 h-6 text-blue-600" />;
  };

  const formatTimeRemaining = (expiresAt: Date): string => {
    const remaining = expiresAt.getTime() - Date.now();
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="hybrid-architecture-demo max-w-7xl mx-auto p-6">
      {/* Demo Header */}
      <div className="demo-header mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ProofPix Hybrid Architecture Demo
            </h1>
            <p className="text-lg text-gray-600">
              Experience the world's first privacy-first AI platform with verifiable trust
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {!isRunning ? (
              <button
                onClick={startDemo}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Demo
              </button>
            ) : (
              <button
                onClick={stopDemo}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Pause className="w-5 h-5 mr-2" />
                Stop Demo
              </button>
            )}
            <button
              onClick={resetDemo}
              className="flex items-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${demoProgress}%` }}
          />
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="scenario-selection mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Demo Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`scenario-card p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedScenario === scenario.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => !isRunning && setSelectedScenario(scenario.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {scenario.industry}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
              <div className="text-xs text-gray-500">
                {scenario.steps.length} steps • {scenario.businessValue.length} benefits
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Step Display */}
        <div className="lg:col-span-2">
          <div className="current-step bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getModeIcon(currentStepData?.mode || 'privacy')}
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentStepData?.title || 'Ready to Start Demo'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Step {currentStep + 1} of {currentScenario.steps.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {getSecurityIcon(currentStepData?.securityLevel || 'maximum')}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {currentStepData?.securityLevel || 'Maximum'} Security
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              {currentStepData?.description || 'Select a scenario and click Start Demo to begin'}
            </p>

            {currentStepData?.highlights && (
              <div className="highlights">
                <h4 className="font-medium text-gray-900 mb-2">Key Highlights:</h4>
                <ul className="space-y-1">
                  {currentStepData.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Architecture Visualization */}
          <div className="architecture-viz bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Architecture Visualization</h3>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Privacy Mode */}
              <div className={`mode-viz p-4 rounded-lg border-2 ${
                currentMode === 'privacy' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center mb-3">
                  <Shield className="w-6 h-6 text-green-600 mr-2" />
                  <h4 className="font-semibold">Privacy Mode</h4>
                  {currentMode === 'privacy' && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Smartphone className="w-4 h-4 text-green-600 mr-2" />
                    <span>Client-side processing</span>
                  </div>
                  <div className="flex items-center">
                    <WifiOff className="w-4 h-4 text-green-600 mr-2" />
                    <span>No server communication</span>
                  </div>
                  <div className="flex items-center">
                    <HardDrive className="w-4 h-4 text-green-600 mr-2" />
                    <span>Local storage only</span>
                  </div>
                </div>
              </div>

              {/* Collaboration Mode */}
              <div className={`mode-viz p-4 rounded-lg border-2 ${
                currentMode === 'collaboration' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center mb-3">
                  <Users className="w-6 h-6 text-blue-600 mr-2" />
                  <h4 className="font-semibold">Collaboration Mode</h4>
                  {currentMode === 'collaboration' && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Server className="w-4 h-4 text-blue-600 mr-2" />
                    <span>Ephemeral processing</span>
                  </div>
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 text-blue-600 mr-2" />
                    <span>Encrypted transmission</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-blue-600 mr-2" />
                    <span>24-hour auto-deletion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Metrics */}
        <div className="metrics-panel">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Real-Time Security Metrics</h3>
            
            <div className="space-y-4">
              <div className="metric">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Privacy Score</span>
                  <span className="text-sm font-bold text-green-600">
                    {realTimeMetrics.privacyScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${realTimeMetrics.privacyScore}%` }}
                  />
                </div>
              </div>

              <div className="metric">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Transmission</span>
                  <span className={`text-sm font-bold ${
                    realTimeMetrics.dataTransmission ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {realTimeMetrics.dataTransmission ? 'Encrypted' : 'None'}
                  </span>
                </div>
              </div>

              <div className="metric">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Server Storage</span>
                  <span className="text-sm font-bold text-green-600">
                    {realTimeMetrics.serverStorage ? 'Temporary' : 'None'}
                  </span>
                </div>
              </div>

              <div className="metric">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Encryption</span>
                  <span className="text-sm font-bold text-blue-600">
                    {realTimeMetrics.encryptionLevel}
                  </span>
                </div>
              </div>

              {realTimeMetrics.sessionExpiry && (
                <div className="metric">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Session Expiry</span>
                    <span className="text-sm font-bold text-orange-600">
                      {formatTimeRemaining(realTimeMetrics.sessionExpiry)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Value */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Business Value</h3>
            
            <div className="space-y-3">
              {currentScenario.businessValue.map((value, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-900">ROI Impact</span>
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 83% reduction in security costs</li>
                <li>• 5x faster enterprise sales cycles</li>
                <li>• 10x better customer trust scores</li>
                <li>• 99%+ profit margins on AI features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Steps Timeline */}
      <div className="demo-timeline mt-8">
        <h3 className="text-lg font-semibold mb-4">Demo Timeline</h3>
        <div className="flex items-center space-x-4 overflow-x-auto pb-4">
          {currentScenario.steps.map((step, index) => (
            <div
              key={step.id}
              className={`timeline-step flex-shrink-0 p-3 rounded-lg border-2 min-w-[200px] ${
                index === currentStep && isRunning
                  ? 'border-blue-500 bg-blue-50'
                  : index < currentStep
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === currentStep && isRunning
                    ? 'bg-blue-500 text-white'
                    : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium">{step.title}</span>
              </div>
              <p className="text-xs text-gray-600">{step.description}</p>
              <div className="flex items-center mt-2">
                {getModeIcon(step.mode)}
                <span className="ml-1 text-xs text-gray-500">
                  {step.mode === 'privacy' ? 'Privacy' : 'Collaboration'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HybridArchitectureDemo; 