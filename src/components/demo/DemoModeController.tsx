import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Clock, Users, Shield, 
  AlertTriangle, CheckCircle, Settings, 
  Monitor, FileText, Brain, Zap
} from 'lucide-react';
import demoDataService, { DemoScenario } from '../../services/demoDataService';

interface DemoModeControllerProps {
  onDemoStart?: (scenario: DemoScenario) => void;
  onDemoEnd?: () => void;
  children?: React.ReactNode;
}

const DemoModeController: React.FC<DemoModeControllerProps> = ({ 
  onDemoStart, 
  onDemoEnd, 
  children 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [scenarios] = useState<DemoScenario[]>(demoDataService.getAvailableScenarios());

  useEffect(() => {
    const interval = setInterval(() => {
      const info = demoDataService.getDemoSessionInfo();
      setSessionInfo(info);
      setIsActive(info?.isActive || false);
      
      if (!info?.isActive && isActive) {
        // Demo session ended
        onDemoEnd?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onDemoEnd]);

  const startDemo = () => {
    if (!selectedScenario) return;
    
    try {
      demoDataService.startDemoSession(selectedScenario);
      const scenario = scenarios.find(s => s.id === selectedScenario);
      if (scenario) {
        onDemoStart?.(scenario);
      }
      setIsActive(true);
    } catch (error) {
      console.error('Failed to start demo:', error);
    }
  };

  const endDemo = () => {
    demoDataService.endDemoSession();
    setIsActive(false);
    onDemoEnd?.();
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getScenarioIcon = (industry: string) => {
    switch (industry) {
      case 'legal': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'insurance': return <Shield className="w-5 h-5 text-green-500" />;
      case 'healthcare': return <Users className="w-5 h-5 text-red-500" />;
      default: return <Monitor className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isActive && sessionInfo) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">DEMO MODE ACTIVE</span>
              </div>
              
              <div className="flex items-center space-x-2 text-blue-100">
                <Monitor className="w-4 h-4" />
                <span className="text-sm">{sessionInfo.scenario?.name}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-blue-100">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {formatTime(sessionInfo.timeRemaining)} remaining
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-100">
                <Brain className="w-4 h-4" />
                <span className="text-sm">AI Features Active</span>
              </div>
              
              <button
                onClick={endDemo}
                className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors"
              >
                End Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* Demo Content */}
        <div className="pt-16">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Enterprise Demo Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Experience ProofPix AI capabilities with industry-specific scenarios
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure Demo Environment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>30-Minute Sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span>Full AI Features</span>
            </div>
          </div>
        </div>

        {/* Demo Scenario Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Choose Your Demo Scenario
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  selectedScenario === scenario.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <div className="flex items-center space-x-3 mb-4">
                  {getScenarioIcon(scenario.industry)}
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {scenario.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {scenario.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{scenario.duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Documents:</span>
                    <span className="font-medium">{scenario.documents.length} samples</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Features:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {scenario.keyFeatures.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {scenario.keyFeatures.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded">
                        +{scenario.keyFeatures.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={startDemo}
              disabled={!selectedScenario}
              className={`px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
                selectedScenario
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-5 h-5" />
              <span>Start Demo Session</span>
            </button>
          </div>
        </div>

        {/* Demo Features Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            What You'll Experience
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                AI Classification
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Intelligent document type detection with confidence scoring
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Smart Recommendations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered process optimization suggestions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Workflow Automation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automated processing rules and compliance checks
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Security & Compliance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enterprise-grade security with industry compliance
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Demo Environment Notice
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This is a controlled demo environment with staged data. All processing is simulated 
                and no real documents are stored or analyzed. Demo sessions automatically expire 
                after 30 minutes for security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModeController; 