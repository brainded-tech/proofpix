/**
 * Mode Comparison Page - The Billion-Dollar Differentiator
 * Showcases ProofPix's revolutionary hybrid architecture
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  Clock, 
  Lock, 
  Eye, 
  Server, 
  Smartphone,
  ArrowRight,
  Zap,
  Globe,
  Building2,
  Crown,
  Star,
  TrendingUp,
  AlertTriangle,
  Database,
  Wifi,
  WifiOff,
  FileCheck,
  UserCheck,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { hybridArchitectureService, ProcessingMode } from '../services/hybridArchitectureService';
import { HybridModeSelector } from '../components/HybridModeSelector';
import { HybridArchitectureVisualization } from '../components/demo/HybridArchitectureVisualization';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge 
} from '../components/ui/EnterpriseComponents';

interface ModeFeature {
  id: string;
  name: string;
  description: string;
  privacyMode: boolean | string;
  collaborationMode: boolean | string;
  icon: React.ComponentType<any>;
  category: 'security' | 'compliance' | 'features' | 'performance';
  importance: 'critical' | 'high' | 'medium';
}

interface ComplianceScenario {
  id: string;
  name: string;
  description: string;
  regulation: string;
  recommendedMode: ProcessingMode;
  reasoning: string;
  icon: React.ComponentType<any>;
  industry: string;
}

export const ModeComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<ProcessingMode>('privacy');
  const [isLiveDemo, setIsLiveDemo] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('healthcare');
  const [animationStep, setAnimationStep] = useState(0);
  const [showPricingCalculator, setShowPricingCalculator] = useState(false);

  const modeFeatures: ModeFeature[] = [
    {
      id: 'data_location',
      name: 'Data Location',
      description: 'Where your sensitive documents are processed',
      privacyMode: 'Your device only',
      collaborationMode: 'Encrypted ephemeral server',
      icon: Database,
      category: 'security',
      importance: 'critical'
    },
    {
      id: 'server_communication',
      name: 'Server Communication',
      description: 'Network transmission of your data',
      privacyMode: 'Zero communication',
      collaborationMode: 'AES-256 encrypted only',
      icon: Wifi,
      category: 'security',
      importance: 'critical'
    },
    {
      id: 'data_retention',
      name: 'Data Retention',
      description: 'How long data exists after processing',
      privacyMode: 'Permanent (your control)',
      collaborationMode: 'Auto-deleted in 24 hours',
      icon: Clock,
      category: 'security',
      importance: 'critical'
    },
    {
      id: 'team_collaboration',
      name: 'Team Collaboration',
      description: 'Share and collaborate on documents',
      privacyMode: false,
      collaborationMode: true,
      icon: Users,
      category: 'features',
      importance: 'high'
    },
    {
      id: 'real_time_sharing',
      name: 'Real-time Sharing',
      description: 'Instant document sharing with team members',
      privacyMode: false,
      collaborationMode: true,
      icon: Zap,
      category: 'features',
      importance: 'high'
    },
    {
      id: 'audit_trails',
      name: 'Audit Trails',
      description: 'Track who accessed what and when',
      privacyMode: 'Local only',
      collaborationMode: 'Full audit logging',
      icon: FileCheck,
      category: 'compliance',
      importance: 'high'
    },
    {
      id: 'gdpr_compliance',
      name: 'GDPR Compliance',
      description: 'European data protection regulation',
      privacyMode: 'Automatic (no data transfer)',
      collaborationMode: 'Compliant (ephemeral processing)',
      icon: Shield,
      category: 'compliance',
      importance: 'critical'
    },
    {
      id: 'hipaa_compliance',
      name: 'HIPAA Compliance',
      description: 'Healthcare data protection',
      privacyMode: 'Perfect (no PHI transmission)',
      collaborationMode: 'Compliant (encrypted ephemeral)',
      icon: UserCheck,
      category: 'compliance',
      importance: 'critical'
    },
    {
      id: 'processing_speed',
      name: 'Processing Speed',
      description: 'Time to analyze documents',
      privacyMode: 'Instant (local processing)',
      collaborationMode: 'Near-instant (optimized servers)',
      icon: Zap,
      category: 'performance',
      importance: 'medium'
    },
    {
      id: 'offline_capability',
      name: 'Offline Capability',
      description: 'Work without internet connection',
      privacyMode: true,
      collaborationMode: false,
      icon: WifiOff,
      category: 'features',
      importance: 'medium'
    }
  ];

  const complianceScenarios: ComplianceScenario[] = [
    {
      id: 'healthcare',
      name: 'Healthcare Documents',
      description: 'Medical records, patient files, insurance claims',
      regulation: 'HIPAA',
      recommendedMode: 'privacy',
      reasoning: 'PHI never leaves your device, ensuring perfect HIPAA compliance',
      icon: UserCheck,
      industry: 'Healthcare'
    },
    {
      id: 'financial',
      name: 'Financial Services',
      description: 'Bank statements, tax documents, audit trails',
      regulation: 'SOX, PCI-DSS',
      recommendedMode: 'collaboration',
      reasoning: 'Audit trails and team collaboration required for compliance',
      icon: Building2,
      industry: 'Finance'
    },
    {
      id: 'legal',
      name: 'Legal Documents',
      description: 'Case files, evidence, client communications',
      regulation: 'Attorney-Client Privilege',
      recommendedMode: 'privacy',
      reasoning: 'Maximum confidentiality with zero data transmission',
      icon: Shield,
      industry: 'Legal'
    },
    {
      id: 'government',
      name: 'Government Files',
      description: 'Classified documents, citizen data, official records',
      regulation: 'FedRAMP, FISMA',
      recommendedMode: 'privacy',
      reasoning: 'Air-gapped processing meets highest security standards',
      icon: Crown,
      industry: 'Government'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Teams',
      description: 'Internal documents, project files, team collaboration',
      regulation: 'GDPR, Internal Policies',
      recommendedMode: 'collaboration',
      reasoning: 'Team features with ephemeral processing for data protection',
      icon: Users,
      industry: 'Enterprise'
    }
  ];

  const handleModeChange = (mode: ProcessingMode) => {
    setCurrentMode(mode);
  };

  const startLiveDemo = () => {
    setIsLiveDemo(true);
    setAnimationStep(0);
    
    // Simulate processing steps
    const steps = currentMode === 'privacy' 
      ? ['upload', 'local-process', 'store-locally']
      : ['upload', 'encrypt', 'transmit', 'ephemeral-process', 'auto-delete'];
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnimationStep(index + 1);
        if (index === steps.length - 1) {
          setTimeout(() => setIsLiveDemo(false), 2000);
        }
      }, (index + 1) * 1500);
    });
  };

  const resetDemo = () => {
    setIsLiveDemo(false);
    setAnimationStep(0);
  };

  const ModeComparisonTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="text-left py-4 px-6 font-semibold text-slate-200">Feature</th>
            <th className="text-center py-4 px-6 font-semibold text-green-400">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy Mode</span>
              </div>
            </th>
            <th className="text-center py-4 px-6 font-semibold text-blue-400">
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Collaboration Mode</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {modeFeatures.map((feature) => (
            <motion.tr 
              key={feature.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="hover:bg-slate-800/50"
            >
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <feature.icon className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="font-medium text-slate-200">{feature.name}</div>
                    <div className="text-sm text-slate-400">{feature.description}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-center">
                {typeof feature.privacyMode === 'boolean' ? (
                  feature.privacyMode ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-600 mx-auto" />
                  )
                ) : (
                  <span className="text-green-400 font-medium">{feature.privacyMode}</span>
                )}
              </td>
              <td className="py-4 px-6 text-center">
                {typeof feature.collaborationMode === 'boolean' ? (
                  feature.collaborationMode ? (
                    <CheckCircle className="w-6 h-6 text-blue-500 mx-auto" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-600 mx-auto" />
                  )
                ) : (
                  <span className="text-blue-400 font-medium">{feature.collaborationMode}</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ComplianceScenarios = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {complianceScenarios.map((scenario) => (
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
            selectedScenario === scenario.id
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
          }`}
          onClick={() => setSelectedScenario(scenario.id)}
        >
          <div className="flex items-center space-x-3 mb-4">
            <scenario.icon className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="font-semibold text-slate-200">{scenario.name}</h3>
              <span className="text-sm text-slate-400">{scenario.industry}</span>
            </div>
          </div>
          
          <p className="text-slate-300 mb-4">{scenario.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Regulation:</span>
              <span className="text-sm font-medium text-slate-200">{scenario.regulation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Recommended:</span>
              <span className={`text-sm font-medium ${
                scenario.recommendedMode === 'privacy' ? 'text-green-400' : 'text-blue-400'
              }`}>
                {scenario.recommendedMode === 'privacy' ? 'Privacy Mode' : 'Collaboration Mode'}
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-300">{scenario.reasoning}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const LiveDemoSection = () => (
    <EnterpriseCard className="bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-100 mb-4">
          See the Hybrid Architecture in Action
        </h3>
        <p className="text-slate-300">
          Watch how your data flows differently in each mode
        </p>
      </div>

      <div className="mb-8">
        <HybridModeSelector 
          onModeChange={handleModeChange}
          showDetails={false}
          className="max-w-2xl mx-auto"
        />
      </div>

      <div className="mb-8">
        <HybridArchitectureVisualization 
          currentMode={currentMode}
          showMetrics={true}
          interactive={true}
        />
      </div>

      <div className="flex justify-center space-x-4">
        <EnterpriseButton
          onClick={startLiveDemo}
          disabled={isLiveDemo}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {isLiveDemo ? 'Demo Running...' : 'Start Live Demo'}
        </EnterpriseButton>
        
        <EnterpriseButton
          onClick={resetDemo}
          variant="secondary"
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </EnterpriseButton>
      </div>
    </EnterpriseCard>
  );

  const PricingCalculator = () => (
    <EnterpriseCard className="bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <h3 className="text-xl font-bold text-slate-100 mb-6 text-center">
        Choose Your Architecture Pricing
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="text-center mb-4">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-green-400">Privacy Only</h4>
            <div className="text-3xl font-bold text-slate-100 mt-2">$99</div>
            <div className="text-slate-400">/month</div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              100% client-side processing
            </li>
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Zero data transmission
            </li>
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Perfect GDPR/HIPAA compliance
            </li>
          </ul>
        </div>

        <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="text-center mb-4">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-blue-400">Collaboration Only</h4>
            <div className="text-3xl font-bold text-slate-100 mt-2">$199</div>
            <div className="text-slate-400">/month</div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
              Team collaboration features
            </li>
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
              Ephemeral processing
            </li>
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
              24-hour auto-deletion
            </li>
          </ul>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <EnterpriseBadge className="bg-purple-600 text-white">Most Popular</EnterpriseBadge>
          </div>
          <div className="text-center mb-4">
            <Crown className="w-12 h-12 text-purple-400 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-purple-400">Hybrid Access</h4>
            <div className="text-3xl font-bold text-slate-100 mt-2">$299</div>
            <div className="text-slate-400">/month</div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-4 h-4 text-purple-400 mr-2" />
              Switch modes in real-time
            </li>
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-4 h-4 text-purple-400 mr-2" />
              Best of both worlds
            </li>
            <li className="flex items-center text-slate-300">
              <CheckCircle className="w-4 h-4 text-purple-400 mr-2" />
              Ultimate flexibility
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8">
        <EnterpriseButton
          onClick={() => navigate('/checkout')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Start Free Trial - Choose Your Architecture
        </EnterpriseButton>
      </div>
    </EnterpriseCard>
  );

  return (
    <EnterpriseLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <EnterpriseBadge className="bg-purple-600 text-white mb-6">
                WORLD'S FIRST HYBRID ARCHITECTURE
              </EnterpriseBadge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8">
                <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Choose Your Architecture
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                The only platform that lets you switch between <span className="text-green-400 font-semibold">100% private processing</span> and <span className="text-blue-400 font-semibold">secure collaboration</span> in real-time. Your data, your choice, your control.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <EnterpriseButton
                  onClick={() => navigate('/enterprise/demo')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
                >
                  <Play className="w-5 h-5 mr-2" />
                  See Live Demo
                </EnterpriseButton>
                
                <EnterpriseButton
                  onClick={() => setShowPricingCalculator(true)}
                  variant="secondary"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View Pricing
                </EnterpriseButton>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <LiveDemoSection />
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-slate-100 mb-6">
                Privacy vs Collaboration: Side-by-Side
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Compare how each mode handles your sensitive documents
              </p>
            </motion.div>

            <EnterpriseCard>
              <ModeComparisonTable />
            </EnterpriseCard>
          </div>
        </section>

        {/* Compliance Scenarios */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-slate-100 mb-6">
                Perfect for Every Compliance Requirement
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Choose the right mode for your industry and regulatory needs
              </p>
            </motion.div>

            <ComplianceScenarios />
          </div>
        </section>

        {/* Pricing Calculator */}
        {showPricingCalculator && (
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <PricingCalculator />
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-100 mb-8">
                Ready to Control Your Architecture?
              </h2>
              <p className="text-xl text-slate-300 mb-12">
                Join thousands of professionals who choose ProofPix for uncompromising security and flexibility.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <EnterpriseButton
                  onClick={() => navigate('/enterprise/demo')}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-4"
                >
                  Start Free Trial
                </EnterpriseButton>
                
                <EnterpriseButton
                  onClick={() => navigate('/contact')}
                  variant="secondary"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4"
                >
                  Talk to Sales
                </EnterpriseButton>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </EnterpriseLayout>
  );
};

export default ModeComparisonPage; 