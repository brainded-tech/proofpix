import React, { useState, useEffect } from 'react';
import { Play, Upload, Eye, Download, CheckCircle, ArrowRight, Clock, Shield, Target, Zap, Sparkles } from 'lucide-react';
import { DemoManager } from './demo/DemoManager';
import demoDataService, { DemoScenario } from '../services/demoDataService';

interface InteractiveProductDemoProps {
  embedded?: boolean;
  initialScenario?: string;
}

const InteractiveProductDemo: React.FC<InteractiveProductDemoProps> = ({ 
  embedded = false, 
  initialScenario 
}) => {
  const [showDemoManager, setShowDemoManager] = useState(false);
  const [availableScenarios, setAvailableScenarios] = useState<DemoScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(initialScenario || null);

  useEffect(() => {
    // Load available demo scenarios
    const scenarios = demoDataService.getAvailableScenarios();
    setAvailableScenarios(scenarios);
  }, []);

  useEffect(() => {
    if (initialScenario) {
      handleLaunchDemo(initialScenario);
    }
  }, [initialScenario]);

  const handleLaunchDemo = (scenarioId?: string) => {
    if (scenarioId) {
      setSelectedScenario(scenarioId);
    }
    setShowDemoManager(true);
  };

  const handleCloseDemoManager = () => {
    setShowDemoManager(false);
    setSelectedScenario(null);
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

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'legal': return '⚖️';
      case 'insurance': return '🛡️';
      case 'healthcare': return '🏥';
      case 'general': return '🏢';
      default: return '📊';
    }
  };

  if (showDemoManager) {
    return (
      <DemoManager
        initialScenario={selectedScenario || undefined}
        onExit={handleCloseDemoManager}
        embedded={embedded}
      />
    );
  }

  return (
    <div className="interactive-product-demo">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-300 font-semibold">Interactive Product Demo</span>
                </div>
                
            <h1 className="text-5xl font-bold text-white mb-6">
              Experience ProofPix
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                In Real-Time
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
              Try our industry-specific demos with real sample data. See how ProofPix transforms 
              your workflow with secure, client-side image metadata processing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Real Processing</h3>
                <p className="text-slate-300 text-sm">Actual ProofPix algorithms</p>
                  </div>
              <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">100% Secure</h3>
                <p className="text-slate-300 text-sm">Local processing only</p>
                </div>
              <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700">
                <Target className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Industry-Specific</h3>
                <p className="text-slate-300 text-sm">Tailored scenarios</p>
                  </div>
              <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700">
                <Clock className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">15-30 Minutes</h3>
                <p className="text-slate-300 text-sm">Complete experience</p>
              </div>
            </div>

          <button
              onClick={() => handleLaunchDemo()}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center mx-auto"
          >
              <Play className="w-6 h-6 mr-3" />
              Start Interactive Demo
              <ArrowRight className="w-6 h-6 ml-3" />
          </button>
          </div>
        </div>
      </section>

      {/* Demo Scenarios Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Choose Your Industry Demo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each demo is tailored to specific industry needs with realistic scenarios and sample data
            </p>
              </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {availableScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleLaunchDemo(scenario.id)}
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r from-${getIndustryColor(scenario.industry)}-500 to-${getIndustryColor(scenario.industry)}-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                    {getIndustryIcon(scenario.industry)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{scenario.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-900">{scenario.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Sample Files:</span>
                    <span className="font-medium text-gray-900">{scenario.sampleFiles.length}</span>
              </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Features:</span>
                    <span className="font-medium text-gray-900">{scenario.keyFeatures.length}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {scenario.keyFeatures.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 bg-${getIndustryColor(scenario.industry)}-100 text-${getIndustryColor(scenario.industry)}-700 text-xs rounded-full`}
                      >
                        {feature}
                      </span>
                    ))}
                    {scenario.keyFeatures.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{scenario.keyFeatures.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  className={`w-full bg-gradient-to-r from-${getIndustryColor(scenario.industry)}-500 to-${getIndustryColor(scenario.industry)}-600 hover:from-${getIndustryColor(scenario.industry)}-600 hover:to-${getIndustryColor(scenario.industry)}-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group-hover:scale-105`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Try {scenario.industry.charAt(0).toUpperCase() + scenario.industry.slice(1)} Demo
                </button>
              </div>
            ))}
                    </div>
                  </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Try Our Interactive Demo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the full power of ProofPix without any commitment or data sharing
            </p>
                </div>
                
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">No Data Risk</h3>
              <p className="text-gray-600">
                All processing happens locally in your browser. Your data never leaves your device, 
                ensuring complete privacy and security.
              </p>
                </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real Technology</h3>
              <p className="text-gray-600">
                Experience actual ProofPix algorithms and processing power with realistic 
                sample data from your industry.
              </p>
        </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-purple-600" />
                  </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Industry-Specific</h3>
              <p className="text-gray-600">
                Each demo is tailored to your industry's specific needs, challenges, 
                and compliance requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Start with our interactive demo and see how ProofPix can revolutionize 
            your image metadata processing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleLaunchDemo()}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Demo Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300">
              Schedule Live Demo
            </button>
          </div>
          
          <p className="text-blue-200 text-sm mt-6">
            No signup required • 15-30 minute experience • Industry-specific scenarios
          </p>
        </div>
      </section>
    </div>
  );
};

export default InteractiveProductDemo; 