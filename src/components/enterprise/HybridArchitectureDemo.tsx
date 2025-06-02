import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Users,
  Cloud,
  Server,
  CheckCircle,
  AlertTriangle,
  Zap,
  Eye,
  FileText,
  Clock,
  Database,
  Network,
  Globe,
  Settings,
  Monitor,
  ArrowRight,
  Download,
  Upload,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';

interface ArchitectureMode {
  id: 'privacy' | 'collaboration' | 'hybrid';
  name: string;
  description: string;
  features: string[];
  securityLevel: 'maximum' | 'high' | 'enterprise';
  dataFlow: string[];
}

interface SecurityMetric {
  name: string;
  traditional: number;
  proofpix: number;
  unit: string;
  improvement: string;
}

const HybridArchitectureDemo: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'privacy' | 'collaboration' | 'hybrid'>('privacy');
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const architectureModes: ArchitectureMode[] = [
    {
      id: 'privacy',
      name: 'Privacy Mode',
      description: 'Maximum security - files never leave your device',
      features: [
        'Local processing only',
        'Zero server uploads',
        'Mathematically impossible breach',
        'GDPR/CCPA compliant by design',
        'Open source verification'
      ],
      securityLevel: 'maximum',
      dataFlow: [
        'File selected on device',
        'Processing in browser memory',
        'Results displayed locally',
        'No network transmission',
        'Auto-cleanup on close'
      ]
    },
    {
      id: 'collaboration',
      name: 'Collaboration Mode',
      description: 'Team features with ephemeral security',
      features: [
        'Temporary secure sharing',
        '24-hour auto-deletion',
        'Encrypted team channels',
        'Audit trail logging',
        'Role-based permissions'
      ],
      securityLevel: 'high',
      dataFlow: [
        'File encrypted locally',
        'Temporary secure upload',
        'Team access granted',
        'Auto-deletion timer starts',
        'Complete removal after 24h'
      ]
    },
    {
      id: 'hybrid',
      name: 'Hybrid Architecture',
      description: 'Best of both worlds - privacy + collaboration',
      features: [
        'Mode switching on demand',
        'Privacy-first default',
        'Optional collaboration',
        'Verifiable security claims',
        'Enterprise compliance ready'
      ],
      securityLevel: 'enterprise',
      dataFlow: [
        'User selects mode',
        'Privacy: Local processing',
        'Collaboration: Ephemeral sharing',
        'Automatic security optimization',
        'Compliance documentation'
      ]
    }
  ];

  const securityMetrics: SecurityMetric[] = [
    {
      name: 'Breach Risk',
      traditional: 100,
      proofpix: 0,
      unit: '%',
      improvement: 'Eliminated'
    },
    {
      name: 'Data Exposure',
      traditional: 24,
      proofpix: 0,
      unit: 'hours',
      improvement: 'Zero exposure'
    },
    {
      name: 'Compliance Cost',
      traditional: 150000,
      proofpix: 25000,
      unit: '$',
      improvement: '83% reduction'
    },
    {
      name: 'Implementation Time',
      traditional: 24,
      proofpix: 4,
      unit: 'weeks',
      improvement: '83% faster'
    }
  ];

  const competitorComparison = [
    {
      name: 'DocuSign AI',
      cost: '$10,000+',
      security: 'Server-based',
      breach: 'Possible',
      compliance: 'Manual'
    },
    {
      name: 'Adobe Enterprise',
      cost: '$15,000+',
      security: 'Cloud storage',
      breach: 'Possible',
      compliance: 'Complex'
    },
    {
      name: 'Box AI',
      cost: '$8,000+',
      security: 'Cloud-first',
      breach: 'Possible',
      compliance: 'Additional cost'
    },
    {
      name: 'ProofPix Hybrid',
      cost: '$2,000',
      security: 'Hybrid/Local',
      breach: 'Impossible',
      compliance: 'Built-in'
    }
  ];

  const demoSteps = [
    'Select Privacy Mode',
    'Process document locally',
    'Switch to Collaboration Mode',
    'Share with team securely',
    'Auto-deletion demonstration',
    'Compliance verification'
  ];

  useEffect(() => {
    if (isProcessing && demoStep < demoSteps.length - 1) {
      const timer = setTimeout(() => {
        setDemoStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (demoStep >= demoSteps.length - 1) {
      setIsProcessing(false);
    }
  }, [isProcessing, demoStep]);

  const startDemo = () => {
    setIsProcessing(true);
    setDemoStep(0);
  };

  const currentMode = architectureModes.find(mode => mode.id === activeMode)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Architectural Impossibility Demo
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Hybrid Architecture
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Privacy + Collaboration
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              The only platform where data breaches are mathematically impossible, 
              not just improbable. Experience the future of secure document processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startDemo}
                disabled={isProcessing}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Running Demo...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Start Interactive Demo
                  </>
                )}
              </button>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Comparison
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Modes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Architecture</h2>
          <p className="text-slate-300">Switch between modes based on your security and collaboration needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {architectureModes.map((mode) => (
            <div
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                activeMode === mode.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center mb-4">
                {mode.id === 'privacy' && <Lock className="w-6 h-6 text-green-400 mr-3" />}
                {mode.id === 'collaboration' && <Users className="w-6 h-6 text-blue-400 mr-3" />}
                {mode.id === 'hybrid' && <Shield className="w-6 h-6 text-purple-400 mr-3" />}
                <h3 className="text-xl font-semibold text-white">{mode.name}</h3>
              </div>
              <p className="text-slate-300 mb-4">{mode.description}</p>
              <div className="space-y-2">
                {mode.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-slate-400">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  mode.securityLevel === 'maximum' ? 'bg-green-900/30 text-green-300' :
                  mode.securityLevel === 'high' ? 'bg-blue-900/30 text-blue-300' :
                  'bg-purple-900/30 text-purple-300'
                }`}>
                  {mode.securityLevel.toUpperCase()} SECURITY
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Flow Visualization */}
        <div className="bg-slate-800/50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            {currentMode.name} Data Flow
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {currentMode.dataFlow.map((step, index) => (
              <React.Fragment key={index}>
                <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isProcessing && demoStep >= index
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {step}
                </div>
                {index < currentMode.dataFlow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityMetrics.map((metric, index) => (
            <div key={index} className="bg-slate-800/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">{metric.name}</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Traditional</span>
                  <span className="text-red-400 font-mono">
                    {metric.traditional.toLocaleString()}{metric.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ProofPix</span>
                  <span className="text-green-400 font-mono">
                    {metric.proofpix.toLocaleString()}{metric.unit}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-600">
                  <span className="text-blue-400 font-semibold">{metric.improvement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Competitor Comparison */}
        {showComparison && (
          <div className="bg-slate-800/50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Competitive Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-4 text-slate-300">Platform</th>
                    <th className="text-left py-3 px-4 text-slate-300">Monthly Cost</th>
                    <th className="text-left py-3 px-4 text-slate-300">Security Model</th>
                    <th className="text-left py-3 px-4 text-slate-300">Breach Risk</th>
                    <th className="text-left py-3 px-4 text-slate-300">Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorComparison.map((competitor, index) => (
                    <tr key={index} className={`border-b border-slate-700 ${
                      competitor.name === 'ProofPix Hybrid' ? 'bg-blue-900/20' : ''
                    }`}>
                      <td className="py-3 px-4 text-white font-medium">{competitor.name}</td>
                      <td className="py-3 px-4 text-slate-300">{competitor.cost}</td>
                      <td className="py-3 px-4 text-slate-300">{competitor.security}</td>
                      <td className="py-3 px-4">
                        {competitor.breach === 'Impossible' ? (
                          <span className="text-green-400 font-semibold">{competitor.breach}</span>
                        ) : (
                          <span className="text-red-400">{competitor.breach}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{competitor.compliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-green-900/30 text-green-300 rounded-lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                80% cost savings with mathematically impossible breach risk
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Eliminate Data Breach Risk?
            </h3>
            <p className="text-blue-100 mb-6">
              Join the organizations that have moved beyond "breach mitigation" to "breach impossibility"
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Schedule Enterprise Demo
              </button>
              <button className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                View Open Source Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HybridArchitectureDemo; 