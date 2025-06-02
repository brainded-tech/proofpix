/**
 * AI Features Positioning Component
 * 
 * This component implements the UX Team Lead's strategic vision for AI feature positioning,
 * creating clear value hierarchy and discovery flows for different user types.
 * 
 * Key Features:
 * - Clear AI tier communication (Basic, Advanced, Custom)
 * - Privacy Mode vs Collaboration Mode AI capabilities
 * - Industry-specific AI package recommendations
 * - ROI calculation for AI-powered efficiency
 * - Upgrade prompts and decision support
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Crown, 
  Shield, 
  Users, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Target,
  Briefcase,
  Scale,
  Heart,
  Building2,
  Eye,
  Lock,
  Cpu,
  Database,
  BarChart3,
  FileText,
  Search,
  Sparkles,
  Rocket,
  Globe
} from 'lucide-react';
import { hybridArchitectureService } from '../services/hybridArchitectureService';
import { BackToHomeButton } from './ui/BackToHomeButton';

interface AITier {
  id: 'basic' | 'advanced' | 'custom';
  name: string;
  description: string;
  availability: string;
  features: AIFeature[];
  pricing: string;
  badge?: string;
  color: string;
}

interface AIFeature {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  accuracy?: string;
  processingTime?: string;
  privacyMode: boolean;
  collaborationMode: boolean;
}

interface IndustryPackage {
  id: string;
  name: string;
  industry: string;
  description: string;
  features: string[];
  pricing: string;
  roi: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const AIFeaturesPositioning: React.FC = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<'privacy' | 'collaboration'>('privacy');
  const [selectedTier, setSelectedTier] = useState<'basic' | 'advanced' | 'custom'>('basic');
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'team' | 'enterprise'>('individual');

  useEffect(() => {
    // Monitor current processing mode
    const mode = hybridArchitectureService.getCurrentMode();
    setCurrentMode(mode);

    // Listen for mode changes
    const handleModeChange = (event: any) => {
      setCurrentMode(event.newMode);
    };

    hybridArchitectureService.on('modeChanged', handleModeChange);

    return () => {
      hybridArchitectureService.off('modeChanged', handleModeChange);
    };
  }, []);

  const aiTiers: AITier[] = [
    {
      id: 'basic',
      name: 'Basic AI',
      description: 'Core AI features that work locally',
      availability: 'Available in Privacy Mode',
      pricing: 'Included',
      color: 'green',
      features: [
        {
          name: 'Smart Cropping',
          description: 'Intelligent image cropping and optimization',
          icon: Cpu,
          accuracy: '85%',
          processingTime: '< 1s',
          privacyMode: true,
          collaborationMode: true
        },
        {
          name: 'Basic OCR',
          description: 'Text extraction from images',
          icon: FileText,
          accuracy: '80%',
          processingTime: '< 2s',
          privacyMode: true,
          collaborationMode: true
        },
        {
          name: 'Format Optimization',
          description: 'Automatic format conversion and compression',
          icon: Zap,
          accuracy: '95%',
          processingTime: '< 1s',
          privacyMode: true,
          collaborationMode: true
        },
        {
          name: 'Basic Classification',
          description: 'Simple document type detection',
          icon: Search,
          accuracy: '75%',
          processingTime: '< 1s',
          privacyMode: true,
          collaborationMode: true
        }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced AI',
      description: 'Advanced AI with cloud processing power',
      availability: 'Collaboration Mode required',
      pricing: 'From $149/month',
      badge: 'Most Popular',
      color: 'blue',
      features: [
        {
          name: 'Advanced OCR',
          description: 'High-accuracy text extraction with layout preservation',
          icon: FileText,
          accuracy: '95%+',
          processingTime: '< 3s',
          privacyMode: false,
          collaborationMode: true
        },
        {
          name: 'Fraud Detection',
          description: 'AI-powered document authenticity verification',
          icon: Shield,
          accuracy: '92%',
          processingTime: '< 5s',
          privacyMode: false,
          collaborationMode: true
        },
        {
          name: 'Predictive Analytics',
          description: 'Document workflow optimization predictions',
          icon: TrendingUp,
          accuracy: '88%',
          processingTime: '< 10s',
          privacyMode: false,
          collaborationMode: true
        },
        {
          name: 'Smart Categorization',
          description: 'Intelligent document classification and tagging',
          icon: Database,
          accuracy: '90%',
          processingTime: '< 2s',
          privacyMode: false,
          collaborationMode: true
        }
      ]
    },
    {
      id: 'custom',
      name: 'Custom AI',
      description: 'AI models trained specifically for your workflows',
      availability: 'Enterprise tier with custom training',
      pricing: 'From $1,999/month',
      badge: 'Enterprise',
      color: 'purple',
      features: [
        {
          name: 'Custom Model Training',
          description: 'AI models trained on your specific document types',
          icon: Brain,
          accuracy: '98%+',
          processingTime: 'Variable',
          privacyMode: false,
          collaborationMode: true
        },
        {
          name: 'Brand Recognition',
          description: 'Custom brand and logo detection',
          icon: Award,
          accuracy: '95%+',
          processingTime: '< 3s',
          privacyMode: false,
          collaborationMode: true
        },
        {
          name: 'Workflow Optimization',
          description: 'AI-powered process improvement recommendations',
          icon: Target,
          accuracy: '90%+',
          processingTime: '< 15s',
          privacyMode: false,
          collaborationMode: true
        },
        {
          name: 'Custom Compliance',
          description: 'Industry-specific compliance checking',
          icon: Scale,
          accuracy: '96%+',
          processingTime: '< 5s',
          privacyMode: false,
          collaborationMode: true
        }
      ]
    }
  ];

  const industryPackages: IndustryPackage[] = [
    {
      id: 'legal',
      name: 'Legal AI Package',
      industry: 'Legal',
      description: 'Specialized AI for legal document processing',
      features: [
        'Contract analysis and clause extraction',
        'Legal document classification',
        'Redaction and privacy protection',
        'Citation and reference validation'
      ],
      pricing: '$2,999/month',
      roi: '40% faster document review',
      icon: Scale,
      color: 'indigo'
    },
    {
      id: 'healthcare',
      name: 'Healthcare AI Package',
      industry: 'Healthcare',
      description: 'HIPAA-compliant medical document AI',
      features: [
        'Medical record processing',
        'Insurance claim analysis',
        'Patient data extraction',
        'Compliance monitoring'
      ],
      pricing: '$3,999/month',
      roi: '60% reduction in processing time',
      icon: Heart,
      color: 'red'
    },
    {
      id: 'finance',
      name: 'Financial AI Package',
      industry: 'Finance',
      description: 'Financial document intelligence',
      features: [
        'Invoice and receipt processing',
        'Financial statement analysis',
        'Fraud detection',
        'Regulatory compliance'
      ],
      pricing: '$2,499/month',
      roi: '50% cost reduction',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'insurance',
      name: 'Insurance AI Package',
      industry: 'Insurance',
      description: 'Claims processing and risk assessment',
      features: [
        'Claims document analysis',
        'Damage assessment',
        'Risk scoring',
        'Policy document processing'
      ],
      pricing: '$3,499/month',
      roi: '45% faster claims processing',
      icon: Shield,
      color: 'blue'
    }
  ];

  const getAvailableFeatures = () => {
    const tier = aiTiers.find(t => t.id === selectedTier);
    if (!tier) return [];

    return tier.features.filter(feature => {
      if (currentMode === 'privacy') {
        return feature.privacyMode;
      } else {
        return feature.collaborationMode;
      }
    });
  };

  const ROICalculator: React.FC = () => {
    const [documentsPerMonth, setDocumentsPerMonth] = useState(1000);
    const [timePerDocument, setTimePerDocument] = useState(5);
    const [hourlyRate, setHourlyRate] = useState(50);

    const calculateROI = () => {
      const monthlyHours = (documentsPerMonth * timePerDocument) / 60;
      const monthlyCost = monthlyHours * hourlyRate;
      const aiSavings = monthlyCost * 0.6; // 60% time savings
      const aiCost = selectedTier === 'basic' ? 0 : selectedTier === 'advanced' ? 149 : 1999;
      const netSavings = aiSavings - aiCost;
      const roi = ((netSavings / aiCost) * 100);

      return {
        monthlyCost,
        aiSavings,
        aiCost,
        netSavings,
        roi: isFinite(roi) ? roi : 0
      };
    };

    const results = calculateROI();

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          AI ROI Calculator
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documents per month
            </label>
            <input
              type="number"
              value={documentsPerMonth}
              onChange={(e) => setDocumentsPerMonth(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minutes per document
            </label>
            <input
              type="number"
              value={timePerDocument}
              onChange={(e) => setTimePerDocument(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly rate ($)
            </label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${results.monthlyCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Current monthly cost</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${results.aiSavings.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">AI savings (60%)</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${results.aiCost.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">AI subscription cost</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {results.roi.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">ROI</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <BackToHomeButton variant="minimal" />
            <h1 className="text-xl font-semibold text-gray-900">AI Features & Capabilities</h1>
            <div></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center">
            <Brain className="w-8 h-8 text-blue-600 mr-3" />
            AI Features & Capabilities
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover ProofPix's AI capabilities across different processing modes and find the perfect 
            AI solution for your workflow needs.
          </p>
        </div>

        {/* Current Mode Indicator */}
        <div className="flex justify-center">
          <div className={`px-6 py-3 rounded-lg border-2 ${
            currentMode === 'privacy' 
              ? 'border-green-500 bg-green-50' 
              : 'border-blue-500 bg-blue-50'
          }`}>
            <div className="flex items-center space-x-3">
              {currentMode === 'privacy' ? (
                <Shield className="w-5 h-5 text-green-600" />
              ) : (
                <Users className="w-5 h-5 text-blue-600" />
              )}
              <span className={`font-semibold ${
                currentMode === 'privacy' ? 'text-green-800' : 'text-blue-800'
              }`}>
                Currently in {currentMode === 'privacy' ? 'Privacy' : 'Collaboration'} Mode
              </span>
              <span className={`text-sm px-2 py-1 rounded ${
                currentMode === 'privacy' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {currentMode === 'privacy' ? 'Local AI Only' : 'Advanced AI Available'}
              </span>
            </div>
          </div>
        </div>

        {/* AI Tier Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Choose Your AI Level</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiTiers.map((tier) => (
              <div
                key={tier.id}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedTier === tier.id
                    ? `border-${tier.color}-500 bg-${tier.color}-50 shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      {tier.name}
                      {tier.badge && (
                        <span className={`text-xs px-2 py-1 rounded bg-${tier.color}-100 text-${tier.color}-800`}>
                          {tier.badge}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                  </div>
                  {selectedTier === tier.id && (
                    <CheckCircle className={`w-6 h-6 text-${tier.color}-600`} />
                  )}
                </div>

                <div className="space-y-3">
                  <div className={`p-3 rounded-lg bg-${tier.color}-50 border border-${tier.color}-200`}>
                    <div className="text-sm font-medium text-gray-900">{tier.availability}</div>
                    <div className={`text-lg font-bold text-${tier.color}-600`}>{tier.pricing}</div>
                  </div>

                  <div className="space-y-2">
                    {tier.features.slice(0, 2).map((feature, index) => {
                      const IconComponent = feature.icon;
                      const isAvailable = currentMode === 'privacy' ? feature.privacyMode : feature.collaborationMode;
                      
                      return (
                        <div key={index} className={`flex items-center space-x-2 text-sm ${
                          isAvailable ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            isAvailable ? `text-${tier.color}-600` : 'text-gray-400'
                          }`} />
                          <span>{feature.name}</span>
                          {!isAvailable && (
                            <span className="text-xs text-gray-500">(Collaboration Mode)</span>
                          )}
                        </div>
                      );
                    })}
                    <div className="text-xs text-gray-500">
                      +{tier.features.length - 2} more features
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Features in {currentMode === 'privacy' ? 'Privacy' : 'Collaboration'} Mode
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getAvailableFeatures().map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                      
                      <div className="flex space-x-4 text-xs text-gray-500">
                        {feature.accuracy && (
                          <span>Accuracy: {feature.accuracy}</span>
                        )}
                        {feature.processingTime && (
                          <span>Speed: {feature.processingTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upgrade Prompt for Privacy Mode Users */}
          {currentMode === 'privacy' && selectedTier !== 'basic' && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Unlock Advanced AI Features
                  </h3>
                  <p className="text-sm text-gray-600">
                    Switch to Collaboration Mode to access advanced AI capabilities with secure, 
                    ephemeral processing and 24-hour auto-deletion.
                  </p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Enable Collaboration Mode
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Industry Packages */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Industry-Specific AI Packages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industryPackages.map((pkg) => {
              const IconComponent = pkg.icon;
              return (
                <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`p-3 bg-${pkg.color}-50 rounded-lg`}>
                      <IconComponent className={`w-6 h-6 text-${pkg.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                      <p className="text-sm text-gray-600">{pkg.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div>
                        <div className="font-semibold text-gray-900">{pkg.pricing}</div>
                        <div className="text-sm text-green-600">{pkg.roi}</div>
                      </div>
                      <button 
                        onClick={() => navigate(`/ai/${pkg.id}-ai-package`)}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Calculate Your AI ROI</h2>
            <button
              onClick={() => setShowROICalculator(!showROICalculator)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showROICalculator ? 'Hide Calculator' : 'Show Calculator'}
            </button>
          </div>

          {showROICalculator && <ROICalculator />}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            Ready to Transform Your Document Workflow?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Start with our free Basic AI features, then upgrade as your needs grow
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule AI Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeaturesPositioning; 