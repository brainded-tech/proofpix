/**
 * 🏢 ENTERPRISE DEMO CENTER
 * Modern, sleek demo selection experience
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  Shield, 
  Heart, 
  Calculator, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  Play,
  Star,
  Zap,
  Eye,
  Building2,
  ChevronRight,
  Sparkles,
  Target,
  Award,
  Rocket
} from 'lucide-react';
import { 
  trackDemoStarted, 
  trackDemoCompleted, 
  trackROICalculated, 
  trackContactRequested,
  conversionTracker
} from '../../utils/conversionTracking';
import { BackToHomeButton } from '../ui/BackToHomeButton';

interface IndustryConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  primaryColor: string;
  gradient: string;
  description: string;
  tagline: string;
  useCases: string[];
  metrics: {
    timeReduction: number;
    costSavings: number;
    accuracyImprovement: number;
    complianceBoost: number;
  };
  demoData: {
    caseStudy: string;
    sampleFiles: string[];
    typicalWorkflow: string[];
    painPoints: string[];
    solutions: string[];
  };
  roiFactors: {
    hourlyRate: number;
    casesPerMonth: number;
    timePerCase: number;
    errorCostReduction: number;
  };
  featured?: boolean;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
}

const industryConfigurations: Record<string, IndustryConfig> = {
  legal: {
    id: 'legal',
    name: 'Legal Services',
    icon: Scale,
    primaryColor: '#1E40AF',
    gradient: 'linear-gradient(to right, #1E40AF, #4B5563)',
    description: 'Digital forensics and evidence authentication for legal professionals',
    tagline: 'Secure and Efficient Legal Workflow',
    useCases: [
      'Evidence authentication for court proceedings',
      'Digital forensics for litigation support',
      'Document integrity verification',
      'Chain of custody documentation',
      'Expert witness report generation'
    ],
    metrics: {
      timeReduction: 75,
      costSavings: 60,
      accuracyImprovement: 95,
      complianceBoost: 90
    },
    demoData: {
      caseStudy: 'Personal Injury Case - Photo Evidence Authentication',
      sampleFiles: [
        'accident_scene_photo_1.jpg',
        'vehicle_damage_front.jpg', 
        'medical_records_scan.pdf',
        'witness_statement_photo.jpg'
      ],
      typicalWorkflow: [
        'Receive digital evidence from client',
        'Manual verification of authenticity',
        'Create forensic analysis report',
        'Prepare expert witness testimony',
        'Present findings in court'
      ],
      painPoints: [
        'Time-consuming manual verification process',
        'Difficulty proving image authenticity',
        'Complex technical explanations for juries',
        'High cost of forensic experts',
        'Risk of evidence being challenged'
      ],
      solutions: [
        'Automated authenticity verification',
        'Detailed forensic analysis reports',
        'Court-ready documentation',
        'Expert witness support',
        'Blockchain-verified chain of custody'
      ]
    },
    roiFactors: {
      hourlyRate: 450,
      casesPerMonth: 12,
      timePerCase: 8,
      errorCostReduction: 25000
    },
    featured: true,
    complexity: 'Intermediate',
    duration: '30 minutes'
  },
  insurance: {
    id: 'insurance',
    name: 'Insurance Claims',
    icon: Shield,
    primaryColor: '#059669',
    gradient: 'linear-gradient(to right, #059669, #075939)',
    description: 'Fraud detection and claims verification for insurance companies',
    tagline: 'Protecting Your Assets with AI',
    useCases: [
      'Auto accident claims verification',
      'Property damage assessment',
      'Fraud detection and prevention',
      'Claims processing automation',
      'Risk assessment documentation'
    ],
    metrics: {
      timeReduction: 80,
      costSavings: 70,
      accuracyImprovement: 92,
      complianceBoost: 85
    },
    demoData: {
      caseStudy: 'Auto Insurance Claim - Suspected Fraud Investigation',
      sampleFiles: [
        'claim_damage_photo_1.jpg',
        'accident_report_scan.pdf',
        'repair_estimate_photo.jpg',
        'police_report_image.jpg'
      ],
      typicalWorkflow: [
        'Receive claim documentation',
        'Schedule adjuster inspection',
        'Manual photo analysis',
        'Cross-reference with databases',
        'Make claim decision'
      ],
      painPoints: [
        'High volume of fraudulent claims',
        'Time-intensive manual review',
        'Inconsistent adjuster assessments',
        'Delayed claim processing',
        'Difficulty detecting sophisticated fraud'
      ],
      solutions: [
        'AI-powered fraud detection',
        'Automated image analysis',
        'Real-time verification',
        'Standardized assessment criteria',
        'Faster claim resolution'
      ]
    },
    roiFactors: {
      hourlyRate: 85,
      casesPerMonth: 150,
      timePerCase: 3,
      errorCostReduction: 15000
    },
    featured: true,
    complexity: 'Advanced',
    duration: '45 minutes'
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare Documentation',
    icon: Heart,
    primaryColor: '#DC2626',
    gradient: 'linear-gradient(to right, #DC2626, #9A3412)',
    description: 'Medical image verification and patient documentation security',
    tagline: 'Ensuring Patient Safety and Compliance',
    useCases: [
      'Medical image authenticity verification',
      'Patient record integrity checks',
      'Telemedicine documentation',
      'Research data validation',
      'Compliance audit support'
    ],
    metrics: {
      timeReduction: 65,
      costSavings: 55,
      accuracyImprovement: 98,
      complianceBoost: 95
    },
    demoData: {
      caseStudy: 'Telemedicine Consultation - Image Verification',
      sampleFiles: [
        'patient_xray_chest.jpg',
        'skin_condition_photo.jpg',
        'prescription_scan.pdf',
        'medical_chart_image.jpg'
      ],
      typicalWorkflow: [
        'Receive patient images remotely',
        'Manual quality assessment',
        'Verify image authenticity',
        'Document in patient record',
        'Ensure HIPAA compliance'
      ],
      painPoints: [
        'Risk of manipulated medical images',
        'HIPAA compliance complexity',
        'Quality control challenges',
        'Time-consuming verification',
        'Audit trail requirements'
      ],
      solutions: [
        'Automated image verification',
        'HIPAA-compliant processing',
        'Quality assurance automation',
        'Comprehensive audit trails',
        'Secure documentation workflow'
      ]
    },
    roiFactors: {
      hourlyRate: 120,
      casesPerMonth: 200,
      timePerCase: 2,
      errorCostReduction: 8000
    },
    featured: true,
    complexity: 'Beginner',
    duration: '20 minutes'
  }
};

interface ROICalculation {
  monthlySavings: number;
  annualSavings: number;
  timeRecovered: number;
  errorReduction: number;
  paybackPeriod: number;
  roi: number;
}

interface ConversionMetrics {
  demoStarted: number;
  demoCompleted: number;
  roiCalculated: number;
  contactRequested: number;
  trialStarted: number;
  conversionRate: number;
}

const IndustryDemoConfigurations: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [showROI, setShowROI] = useState(false);
  const [roiCalculation, setROICalculation] = useState<ROICalculation | null>(null);
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics>({
    demoStarted: 0,
    demoCompleted: 0,
    roiCalculated: 0,
    contactRequested: 0,
    trialStarted: 0,
    conversionRate: 0
  });
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'featured' | 'beginner' | 'advanced'>('all');

  useEffect(() => {
    // Load conversion metrics - simplified for demo
    // const metrics = conversionTracker.getMetrics();
    // setConversionMetrics(metrics);
  }, []);

  const filteredIndustries = Object.values(industryConfigurations).filter(industry => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'featured') return industry.featured;
    if (selectedCategory === 'beginner') return industry.complexity === 'Beginner';
    if (selectedCategory === 'advanced') return industry.complexity === 'Advanced';
    return true;
  });

  const calculateROI = () => {
    if (!selectedIndustry) return;
    
    const config = industryConfigurations[selectedIndustry];
    const { hourlyRate, casesPerMonth, timePerCase, errorCostReduction } = config.roiFactors;
    const { timeReduction } = config.metrics;
    
    const currentMonthlyCost = hourlyRate * timePerCase * casesPerMonth;
    const timeSaved = (timeReduction / 100) * timePerCase;
    const monthlySavings = (hourlyRate * timeSaved * casesPerMonth) + errorCostReduction;
    const annualSavings = monthlySavings * 12;
    const timeRecovered = timeSaved * casesPerMonth;
    const errorReduction = config.metrics.accuracyImprovement;
    const paybackPeriod = 2; // months
    const roi = ((annualSavings - 12000) / 12000) * 100; // Assuming $12k annual cost
    
    const calculation: ROICalculation = {
      monthlySavings,
      annualSavings,
      timeRecovered,
      errorReduction,
      paybackPeriod,
      roi
    };
    
    setROICalculation(calculation);
    setShowROI(true);
    
    // Track ROI calculation
    trackROICalculated(selectedIndustry, calculation.roi);
    
    // Update conversion metrics
    setConversionMetrics(prev => ({
      ...prev,
      roiCalculated: prev.roiCalculated + 1
    }));
  };

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    setShowROI(false);
    
    // Track demo started
    trackDemoStarted(industryId);
    
    // Update conversion metrics
    setConversionMetrics(prev => ({
      ...prev,
      demoStarted: prev.demoStarted + 1
    }));
  };

  const handleDemoComplete = () => {
    if (!selectedIndustry) return;
    
    // Track demo completion
    trackDemoCompleted(selectedIndustry);
    
    // Update conversion metrics
    setConversionMetrics(prev => ({
      ...prev,
      demoCompleted: prev.demoCompleted + 1,
      conversionRate: ((prev.demoCompleted + 1) / (prev.demoStarted || 1)) * 100
    }));
    
    // Navigate to actual demo
    window.location.href = `/enterprise/ai-demo?industry=${selectedIndustry}`;
  };

  const handleContactRequest = () => {
    if (!selectedIndustry) return;
    
    // Track contact request
    trackContactRequested(selectedIndustry);
    
    // Update conversion metrics
    setConversionMetrics(prev => ({
      ...prev,
      contactRequested: prev.contactRequested + 1
    }));
    
    // Navigate to contact form
    window.location.href = '/contact?source=demo&industry=' + selectedIndustry;
  };

  const IndustrySelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {filteredIndustries.map((config) => {
        const IconComponent = config.icon;
        const isSelected = selectedIndustry === config.id;
        
        return (
          <button
            key={config.id}
            onClick={() => handleIndustrySelect(config.id)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
              isSelected
                ? `border-blue-500 bg-blue-50`
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center mb-3">
              <IconComponent 
                className={`h-8 w-8 mr-3 ${
                  isSelected ? 'text-blue-600' : 'text-gray-600'
                }`}
              />
              <h3 className={`text-lg font-semibold ${
                isSelected ? 'text-blue-900' : 'text-gray-900'
              }`}>
                {config.name}
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">{config.description}</p>
            
            {/* Key Metrics Preview */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {config.metrics.timeReduction}% Time Saved
              </div>
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {config.metrics.costSavings}% Cost Reduction
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  const ROICalculator = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">
          Real-Time ROI Calculator - {selectedIndustry ? industryConfigurations[selectedIndustry].name : ''}
        </h3>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate ($)
          </label>
          <input
            type="number"
            value={industryConfigurations[selectedIndustry || 'legal'].roiFactors.hourlyRate}
            onChange={(e) => handleIndustrySelect(selectedIndustry || 'legal')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="450"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cases per Month
          </label>
          <input
            type="number"
            value={industryConfigurations[selectedIndustry || 'legal'].roiFactors.casesPerMonth}
            onChange={(e) => handleIndustrySelect(selectedIndustry || 'legal')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="12"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hours per Case
          </label>
          <input
            type="number"
            value={industryConfigurations[selectedIndustry || 'legal'].roiFactors.timePerCase}
            onChange={(e) => handleIndustrySelect(selectedIndustry || 'legal')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8"
          />
        </div>
      </div>

      {/* ROI Results */}
      {showROI && roiCalculation && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Monthly Savings</p>
                <p className="text-2xl font-bold text-green-900">
                  ${roiCalculation.monthlySavings.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Annual ROI</p>
                <p className="text-2xl font-bold text-blue-900">
                  {roiCalculation.roi.toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Time Recovered</p>
                <p className="text-2xl font-bold text-purple-900">
                  {roiCalculation.timeRecovered.toFixed(0)}h/mo
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Payback Period</p>
                <p className="text-2xl font-bold text-orange-900">
                  {roiCalculation.paybackPeriod.toFixed(1)} mo
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ConversionTracker = () => (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Users className="h-5 w-5 text-gray-600 mr-2" />
        Conversion Tracking - {selectedIndustry ? industryConfigurations[selectedIndustry].name : ''} Segment
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{conversionMetrics.demoStarted}</p>
          <p className="text-sm text-gray-600">Demos Started</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{conversionMetrics.demoCompleted}</p>
          <p className="text-sm text-gray-600">Demos Completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{conversionMetrics.roiCalculated}</p>
          <p className="text-sm text-gray-600">ROI Calculated</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{conversionMetrics.contactRequested}</p>
          <p className="text-sm text-gray-600">Contact Requests</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{conversionMetrics.conversionRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Conversion Rate</p>
        </div>
      </div>
    </div>
  );

  const DemoExperience = () => (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Industry-Specific Demo Experience
        </h1>
        <p className="text-gray-600">
          Explore how ProofPix transforms workflows in your industry with tailored demonstrations and real-time ROI calculations.
        </p>
      </div>

      <IndustrySelector />
      <ConversionTracker />
      <ROICalculator />

      {/* Industry-Specific Demo Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {selectedIndustry ? industryConfigurations[selectedIndustry].name : ''} Demo Experience
        </h2>
        
        {/* Case Study */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            Case Study: {selectedIndustry ? industryConfigurations[selectedIndustry].demoData.caseStudy : ''}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Workflow */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Current Pain Points
              </h4>
              <ul className="space-y-2">
                {selectedIndustry ? industryConfigurations[selectedIndustry].demoData.painPoints.map((point, index) => (
                  <li key={index} className="text-red-800 text-sm flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {point}
                  </li>
                )) : null}
              </ul>
            </div>
            
            {/* ProofPix Solution */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                ProofPix Solutions
              </h4>
              <ul className="space-y-2">
                {selectedIndustry ? industryConfigurations[selectedIndustry].demoData.solutions.map((solution, index) => (
                  <li key={index} className="text-green-800 text-sm flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {solution}
                  </li>
                )) : null}
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleDemoComplete}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Complete Demo Experience
          </button>
          
          <button
            onClick={handleContactRequest}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Request Sales Contact
          </button>
          
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Download {selectedIndustry ? industryConfigurations[selectedIndustry].name : ''} Case Study
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Simple Navigation */}
        <div className="flex items-center justify-between mb-6">
          <BackToHomeButton />
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure Demo Environment</span>
          </div>
        </div>

        {!selectedIndustry ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Hero Section - Reduced sizes */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium"
              >
                <Star className="w-3 h-3" />
                <span>AI-Powered Document Intelligence</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-slate-900"
              >
                Choose Your Demo Scenario
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base text-slate-600 max-w-2xl mx-auto"
              >
                Experience ProofPix AI capabilities with industry-specific scenarios designed to showcase real-world value and ROI potential.
              </motion.p>
            </div>

            {/* Category Filter - Smaller */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center"
            >
              <div className="bg-white rounded-xl p-1.5 shadow-md border border-slate-200">
                <div className="flex space-x-1">
                  {[
                    { id: 'all', label: 'All Demos', icon: Eye },
                    { id: 'featured', label: 'Featured', icon: Star },
                    { id: 'beginner', label: 'Beginner', icon: Target },
                    { id: 'advanced', label: 'Advanced', icon: Rocket }
                  ].map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id as any)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedCategory === category.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Demo Cards - Smaller and more compact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredIndustries.map((config, index) => {
                  const IconComponent = config.icon;
                  return (
                    <motion.div
                      key={config.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        {config.featured && (
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center space-x-1">
                              <Award className="w-2.5 h-2.5" />
                              <span>FEATURED</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          {/* Icon and Header - Smaller */}
                          <div className="space-y-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                              style={{ background: config.gradient }}
                            >
                              <IconComponent className="w-6 h-6" />
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 mb-1">{config.name}</h3>
                              <p className="text-xs font-medium text-slate-600 mb-2">{config.tagline}</p>
                              <p className="text-sm text-slate-600 leading-relaxed">{config.description}</p>
                            </div>
                          </div>

                          {/* Metrics - Smaller */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-lg p-2.5">
                              <div className="text-lg font-bold text-green-600">{config.metrics.timeReduction}%</div>
                              <div className="text-xs text-slate-600">Time Saved</div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2.5">
                              <div className="text-lg font-bold text-blue-600">{config.metrics.accuracyImprovement}%</div>
                              <div className="text-xs text-slate-600">Accuracy</div>
                            </div>
                          </div>

                          {/* Demo Info - Smaller */}
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center space-x-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{config.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <Target className="w-3.5 h-3.5" />
                              <span>{config.complexity}</span>
                            </div>
                          </div>

                          {/* Action Button - Smaller */}
                          <button
                            onClick={() => handleIndustrySelect(config.id)}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-md"
                          >
                            <Play className="w-4 h-4" />
                            <span>Start Demo Session</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* What You'll Experience Section - Smaller */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-slate-200"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What You'll Experience</h3>
                <p className="text-sm text-slate-600">Each demo includes comprehensive features designed to showcase real-world value</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: Zap,
                    title: 'AI Classification',
                    description: 'Intelligent document type detection with confidence scoring'
                  },
                  {
                    icon: Shield,
                    title: 'Smart Recommendations',
                    description: 'AI-powered process optimization suggestions'
                  },
                  {
                    icon: BarChart3,
                    title: 'Workflow Automation',
                    description: 'Automated processing rules and compliance checks'
                  },
                  {
                    icon: CheckCircle,
                    title: 'Security & Compliance',
                    description: 'Enterprise-grade security with industry compliance'
                  }
                ].map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="text-center space-y-2"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">{feature.title}</h4>
                      <p className="text-xs text-slate-600">{feature.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Demo Environment Notice - Smaller */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">🔒 Demo Environment Notice</h4>
                  <p className="text-blue-800 text-xs leading-relaxed">
                    This is a controlled demo environment with simulated data. All processing is simulated and no real documents are stored or analyzed. 
                    Demo sessions automatically expire after 30 minutes for security.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <DemoExperience />
        )}
      </div>
    </div>
  );
};

export default IndustryDemoConfigurations; 