import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  ArrowRight, 
  Clock, 
  FileText, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  Building,
  Heart,
  Scale,
  Home,
  Sparkles,
  Lock,
  Crown,
  CheckCircle,
  Star,
  ChevronRight
} from 'lucide-react';
import demoDataService, { DemoScenario } from '../../services/demoDataService';

interface DemoSelectorProps {
  onSelectDemo: (scenarioId: string) => void;
  onClose?: () => void;
}

interface IndustryInfo {
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  description: string;
  keyBenefits: string[];
  useCases: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
}

const industryInfo: Record<string, IndustryInfo> = {
  legal: {
    icon: Scale,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    description: 'Ensure evidence integrity and chain of custody compliance',
    complexity: 'Advanced',
    keyBenefits: [
      'Tamper-proof evidence verification',
      'Automated chain of custody tracking',
      'Court-admissible documentation'
    ],
    useCases: [
      'Accident scene documentation',
      'Digital evidence authentication',
      'Legal document verification'
    ]
  },
  insurance: {
    icon: Shield,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Accelerate claims processing with AI-powered fraud detection',
    complexity: 'Intermediate',
    keyBenefits: [
      'Instant fraud detection',
      'Automated damage assessment',
      'Streamlined claims workflow'
    ],
    useCases: [
      'Vehicle damage assessment',
      'Property damage claims',
      'Medical claim verification'
    ]
  },
  healthcare: {
    icon: Heart,
    color: 'red',
    gradient: 'from-red-500 to-pink-600',
    description: 'HIPAA-compliant medical imaging and documentation',
    complexity: 'Advanced',
    keyBenefits: [
      'HIPAA compliance automation',
      'Medical image authentication',
      'Patient data protection'
    ],
    useCases: [
      'Medical imaging verification',
      'Patient record authentication',
      'Telemedicine documentation'
    ]
  },
  general: {
    icon: Building,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    description: 'Enterprise-grade document processing and workflow automation',
    complexity: 'Beginner',
    keyBenefits: [
      'Batch processing capabilities',
      'API integration ready',
      'Custom workflow creation'
    ],
    useCases: [
      'Document authentication',
      'Workflow automation',
      'Quality assurance'
    ]
  }
};

export const DemoSelector: React.FC<DemoSelectorProps> = ({ onSelectDemo, onClose }) => {
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  useEffect(() => {
    const availableScenarios = demoDataService.getAvailableScenarios();
    setScenarios(availableScenarios);
  }, []);

  const groupedScenarios = scenarios.reduce((acc, scenario) => {
    if (!acc[scenario.industry]) {
      acc[scenario.industry] = [];
    }
    acc[scenario.industry].push(scenario);
    return acc;
  }, {} as Record<string, DemoScenario[]>);

  const handleDemoStart = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    onSelectDemo(scenarioId);
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'text-green-600 bg-green-50';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'Advanced': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getCategoryColor = (industry: string) => {
    const info = industryInfo[industry];
    if (!info) return 'text-slate-600 bg-slate-50 border-slate-200';
    
    switch (info.color) {
      case 'blue': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'emerald': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'red': return 'text-red-600 bg-red-50 border-red-200';
      case 'purple': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const industries = Object.keys(groupedScenarios);
  const filteredScenarios = selectedIndustry 
    ? groupedScenarios[selectedIndustry] || []
    : scenarios;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Compact Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 mb-1">Choose Your Demo Experience</h1>
              <p className="text-sm text-slate-600">Experience ProofPix's AI document intelligence capabilities</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-medium">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Live Demo
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors text-xl"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Industry Filter */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedIndustry(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                !selectedIndustry
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Demos ({scenarios.length})
            </button>
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedIndustry === industry
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {industry.charAt(0).toUpperCase() + industry.slice(1)} ({groupedScenarios[industry]?.length || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredScenarios.map((scenario) => {
            const info = industryInfo[scenario.industry] || industryInfo.general;
            const IconComponent = info.icon;
            
            return (
              <motion.div
                key={scenario.id}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedScenario === scenario.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredScenario(scenario.id)}
                onHoverEnd={() => setHoveredScenario(null)}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${getCategoryColor(scenario.industry)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  <motion.div
                    animate={{
                      x: hoveredScenario === scenario.id ? 4 : 0,
                      opacity: hoveredScenario === scenario.id ? 1 : 0.5
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {scenario.name}
                </h3>
                
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {scenario.description}
                </p>

                {/* Key Features */}
                <div className="space-y-1 mb-4">
                  {info.keyBenefits.slice(0, 2).map((benefit, index) => (
                    <div key={index} className="flex items-center text-xs text-slate-500">
                      <div className="w-1 h-1 bg-slate-400 rounded-full mr-2" />
                      {benefit}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getCategoryColor(scenario.industry)}`}>
                      {scenario.industry.charAt(0).toUpperCase() + scenario.industry.slice(1)}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getComplexityColor(info.complexity)}`}>
                      {info.complexity}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(scenario.duration)}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedScenario === scenario.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Start Demo Button */}
        {selectedScenario && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={() => handleDemoStart(selectedScenario)}
              className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Demo
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-sm text-slate-500 mt-2">
              Experience {filteredScenarios.find(s => s.id === selectedScenario)?.name} in action
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 