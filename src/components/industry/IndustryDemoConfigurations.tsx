/**
 * 🏢 INDUSTRY-SPECIFIC DEMO CONFIGURATIONS
 * Tailored demo experiences for Legal, Insurance, and Healthcare sectors
 */

import React, { useState, useEffect } from 'react';
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
  BarChart3
} from 'lucide-react';
import { 
  trackDemoStarted, 
  trackDemoCompleted, 
  trackROICalculated, 
  trackContactRequested,
  conversionTracker
} from '../../utils/conversionTracking';

interface IndustryConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  primaryColor: string;
  description: string;
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
}

const industryConfigurations: Record<string, IndustryConfig> = {
  legal: {
    id: 'legal',
    name: 'Legal Services',
    icon: Scale,
    primaryColor: '#1E40AF',
    description: 'Digital forensics and evidence authentication for legal professionals',
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
    }
  },
  insurance: {
    id: 'insurance',
    name: 'Insurance Claims',
    icon: Shield,
    primaryColor: '#059669',
    description: 'Fraud detection and claims verification for insurance companies',
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
    }
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare Documentation',
    icon: Heart,
    primaryColor: '#DC2626',
    description: 'Medical image verification and patient documentation security',
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
    }
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
  const [selectedIndustry, setSelectedIndustry] = useState<string>('legal');
  const [roiCalculation, setRoiCalculation] = useState<ROICalculation | null>(null);
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics>({
    demoStarted: 0,
    demoCompleted: 0,
    roiCalculated: 0,
    contactRequested: 0,
    trialStarted: 0,
    conversionRate: 0
  });
  const [customInputs, setCustomInputs] = useState({
    hourlyRate: 0,
    casesPerMonth: 0,
    timePerCase: 0
  });

  const currentConfig = industryConfigurations[selectedIndustry];

  // Initialize custom inputs when industry changes
  useEffect(() => {
    if (currentConfig) {
      setCustomInputs({
        hourlyRate: currentConfig.roiFactors.hourlyRate,
        casesPerMonth: currentConfig.roiFactors.casesPerMonth,
        timePerCase: currentConfig.roiFactors.timePerCase
      });
    }
  }, [selectedIndustry, currentConfig]);

  // Real-time ROI calculation
  useEffect(() => {
    if (customInputs.hourlyRate && customInputs.casesPerMonth && customInputs.timePerCase) {
      calculateROI();
    }
  }, [customInputs, selectedIndustry]);

  const calculateROI = () => {
    const config = currentConfig;
    const { hourlyRate, casesPerMonth, timePerCase } = customInputs;
    
    // Calculate time savings
    const timeReductionPercent = config.metrics.timeReduction / 100;
    const timeSavedPerCase = timePerCase * timeReductionPercent;
    const monthlyCostSavings = casesPerMonth * timeSavedPerCase * hourlyRate;
    
    // Calculate error reduction savings
    const errorSavings = (config.roiFactors.errorCostReduction * config.metrics.accuracyImprovement) / 100;
    
    // Total savings
    const totalMonthlySavings = monthlyCostSavings + (errorSavings / 12);
    const annualSavings = totalMonthlySavings * 12;
    
    // Assume ProofPix cost (example pricing)
    const monthlyProofPixCost = 2500; // Enterprise tier
    const netMonthlySavings = totalMonthlySavings - monthlyProofPixCost;
    const paybackPeriod = monthlyProofPixCost / totalMonthlySavings;
    const roi = ((annualSavings - (monthlyProofPixCost * 12)) / (monthlyProofPixCost * 12)) * 100;

    setRoiCalculation({
      monthlySavings: netMonthlySavings,
      annualSavings: annualSavings - (monthlyProofPixCost * 12),
      timeRecovered: casesPerMonth * timeSavedPerCase,
      errorReduction: config.metrics.accuracyImprovement,
      paybackPeriod,
      roi
    });

    // Track ROI calculation with conversion tracking utility
    trackROICalculated(selectedIndustry, roi, {
      featuresViewed: ['roi_calculator'],
      timeSpent: 120 // 2 minutes
    });

    // Update local state for UI
    setConversionMetrics(prev => ({
      ...prev,
      roiCalculated: prev.roiCalculated + 1
    }));
  };

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    
    // Track demo started with conversion tracking utility
    trackDemoStarted(industryId, {
      featuresViewed: ['industry_selector'],
      painPointsIdentified: industryConfigurations[industryId]?.demoData.painPoints || []
    });
    
    // Update local state for UI
    setConversionMetrics(prev => ({
      ...prev,
      demoStarted: prev.demoStarted + 1
    }));
  };

  const handleDemoComplete = () => {
    // Track demo completion with conversion tracking utility
    trackDemoCompleted(selectedIndustry, {
      featuresViewed: ['roi_calculator', 'case_study', 'pain_points', 'solutions'],
      timeSpent: Date.now() - (Date.now() - 300000), // Simulate 5 minutes
      painPointsIdentified: currentConfig.demoData.painPoints
    });
    
    setConversionMetrics(prev => ({
      ...prev,
      demoCompleted: prev.demoCompleted + 1,
      conversionRate: ((prev.demoCompleted + 1) / (prev.demoStarted || 1)) * 100
    }));
  };

  const handleContactRequest = () => {
    // Track contact request with conversion tracking utility
    trackContactRequested(selectedIndustry, {
      featuresViewed: ['roi_calculator', 'case_study'],
      roiValue: roiCalculation?.roi || 0
    });
    
    setConversionMetrics(prev => ({
      ...prev,
      contactRequested: prev.contactRequested + 1
    }));
  };

  const IndustrySelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {Object.values(industryConfigurations).map((config) => {
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
          Real-Time ROI Calculator - {currentConfig.name}
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
            value={customInputs.hourlyRate}
            onChange={(e) => setCustomInputs(prev => ({
              ...prev,
              hourlyRate: Number(e.target.value)
            }))}
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
            value={customInputs.casesPerMonth}
            onChange={(e) => setCustomInputs(prev => ({
              ...prev,
              casesPerMonth: Number(e.target.value)
            }))}
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
            value={customInputs.timePerCase}
            onChange={(e) => setCustomInputs(prev => ({
              ...prev,
              timePerCase: Number(e.target.value)
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8"
          />
        </div>
      </div>

      {/* ROI Results */}
      {roiCalculation && (
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
        Conversion Tracking - {currentConfig.name} Segment
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

  return (
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
          {currentConfig.name} Demo Experience
        </h2>
        
        {/* Case Study */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            Case Study: {currentConfig.demoData.caseStudy}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Workflow */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Current Pain Points
              </h4>
              <ul className="space-y-2">
                {currentConfig.demoData.painPoints.map((point, index) => (
                  <li key={index} className="text-red-800 text-sm flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* ProofPix Solution */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                ProofPix Solutions
              </h4>
              <ul className="space-y-2">
                {currentConfig.demoData.solutions.map((solution, index) => (
                  <li key={index} className="text-green-800 text-sm flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {solution}
                  </li>
                ))}
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
            Download {currentConfig.name} Case Study
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryDemoConfigurations; 