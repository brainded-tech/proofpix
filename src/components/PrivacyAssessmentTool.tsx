import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, X, TrendingUp, DollarSign, Users, Lock } from 'lucide-react';

interface AssessmentInputs {
  industry: 'legal' | 'insurance' | 'healthcare' | 'realestate' | 'general';
  currentSolution: 'cloud' | 'onpremise' | 'manual' | 'none';
  dataVolume: 'low' | 'medium' | 'high' | 'enterprise';
  complianceRequirements: string[];
  teamSize: number;
  averageDataValue: number;
}

interface RiskAssessment {
  overallRiskScore: number; // 0-100
  breachProbability: number; // percentage
  potentialBreachCost: number;
  complianceGaps: string[];
  riskFactors: string[];
  recommendations: string[];
  proofPixBenefits: {
    riskReduction: number;
    costSavings: number;
    complianceImprovement: string[];
  };
}

const PrivacyAssessmentTool: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<AssessmentInputs>({
    industry: 'legal',
    currentSolution: 'cloud',
    dataVolume: 'medium',
    complianceRequirements: [],
    teamSize: 10,
    averageDataValue: 50000
  });
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const industries = [
    { id: 'legal', name: 'Legal Services', riskMultiplier: 2.5, avgBreachCost: 8.2 },
    { id: 'insurance', name: 'Insurance', riskMultiplier: 2.8, avgBreachCost: 7.8 },
    { id: 'healthcare', name: 'Healthcare', riskMultiplier: 4.0, avgBreachCost: 10.9 },
    { id: 'realestate', name: 'Real Estate', riskMultiplier: 1.8, avgBreachCost: 5.4 },
    { id: 'general', name: 'General Business', riskMultiplier: 2.0, avgBreachCost: 4.9 }
  ];

  const solutions = [
    { id: 'cloud', name: 'Cloud-based tools (DocuSign, Adobe, etc.)', riskScore: 75 },
    { id: 'onpremise', name: 'On-premise servers', riskScore: 45 },
    { id: 'manual', name: 'Manual processes', riskScore: 30 },
    { id: 'none', name: 'No current solution', riskScore: 85 }
  ];

  const dataVolumes = [
    { id: 'low', name: 'Low (< 100 photos/month)', multiplier: 0.5 },
    { id: 'medium', name: 'Medium (100-1,000 photos/month)', multiplier: 1.0 },
    { id: 'high', name: 'High (1,000-10,000 photos/month)', multiplier: 2.0 },
    { id: 'enterprise', name: 'Enterprise (10,000+ photos/month)', multiplier: 3.5 }
  ];

  const complianceOptions = [
    'HIPAA', 'GDPR', 'CCPA', 'SOX', 'PCI DSS', 'ISO 27001', 'SOC 2', 'FERPA'
  ];

  const calculateRiskAssessment = (): RiskAssessment => {
    const industry = industries.find(i => i.id === inputs.industry)!;
    const solution = solutions.find(s => s.id === inputs.currentSolution)!;
    const volume = dataVolumes.find(v => v.id === inputs.dataVolume)!;

    // Calculate overall risk score (0-100)
    let riskScore = solution.riskScore;
    riskScore *= volume.multiplier;
    riskScore *= industry.riskMultiplier;
    riskScore = Math.min(100, riskScore / 10); // Normalize to 0-100

    // Calculate breach probability
    const baseProbability = {
      cloud: 0.29,
      onpremise: 0.18,
      manual: 0.12,
      none: 0.35
    };
    const breachProbability = baseProbability[inputs.currentSolution] * industry.riskMultiplier * volume.multiplier;

    // Calculate potential breach cost
    const potentialBreachCost = industry.avgBreachCost * 1000000 * volume.multiplier;

    // Identify compliance gaps
    const complianceGaps: string[] = [];
    if (inputs.currentSolution === 'cloud') {
      complianceGaps.push('Data stored on external servers');
      complianceGaps.push('Third-party access to sensitive data');
      complianceGaps.push('Complex BAA requirements');
    }
    if (inputs.currentSolution === 'manual') {
      complianceGaps.push('No audit trail for data handling');
      complianceGaps.push('Human error in compliance processes');
    }
    if (inputs.complianceRequirements.includes('HIPAA') && inputs.currentSolution !== 'manual') {
      complianceGaps.push('PHI potentially exposed to third parties');
    }

    // Identify risk factors
    const riskFactors: string[] = [];
    if (inputs.currentSolution === 'cloud') {
      riskFactors.push('External data storage increases breach surface');
      riskFactors.push('Vendor security depends on their policies');
      riskFactors.push('Data in transit vulnerable to interception');
    }
    if (inputs.dataVolume === 'high' || inputs.dataVolume === 'enterprise') {
      riskFactors.push('High data volume increases breach impact');
    }
    if (inputs.complianceRequirements.length > 2) {
      riskFactors.push('Multiple compliance requirements increase complexity');
    }

    // Generate recommendations
    const recommendations: string[] = [
      'Implement client-side processing to eliminate external data exposure',
      'Use privacy-first architecture to make breaches technically impossible',
      'Automate compliance through architectural design',
      'Reduce third-party risk by keeping data local'
    ];

    // Calculate ProofPix benefits
    const riskReduction = Math.min(95, riskScore * 0.9); // 90% risk reduction
    const costSavings = potentialBreachCost * (breachProbability / 100) * 0.9; // 90% of expected breach cost
    const complianceImprovement = [
      'Automatic HIPAA compliance through local processing',
      'GDPR compliance by design (no data transfer)',
      'Simplified audit requirements',
      'Reduced third-party risk assessments'
    ];

    return {
      overallRiskScore: Math.round(riskScore),
      breachProbability: Math.round(breachProbability * 100) / 100,
      potentialBreachCost,
      complianceGaps,
      riskFactors,
      recommendations,
      proofPixBenefits: {
        riskReduction,
        costSavings,
        complianceImprovement
      }
    };
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        setAssessment(calculateRiskAssessment());
        setIsCalculating(false);
        setCurrentStep(5);
      }, 2000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Shield className="w-4 h-4 mr-2" />
          PRIVACY RISK ASSESSMENT
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          How Secure Is Your Current Solution?
        </h2>
        <p className="text-lg text-slate-600">
          Discover your privacy risks and see how ProofPix can eliminate them
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Step {currentStep} of 5</span>
          <span className="text-sm text-slate-600">{Math.round((currentStep / 5) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Industry */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">What industry are you in?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setInputs({...inputs, industry: industry.id as any})}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  inputs.industry === industry.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900">{industry.name}</div>
                <div className="text-sm text-slate-600">
                  Avg breach cost: {formatCurrency(industry.avgBreachCost * 1000000)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Current Solution */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">What's your current photo analysis solution?</h3>
          <div className="space-y-3">
            {solutions.map((solution) => (
              <button
                key={solution.id}
                onClick={() => setInputs({...inputs, currentSolution: solution.id as any})}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  inputs.currentSolution === solution.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{solution.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(solution.riskScore)}`}>
                    Risk Score: {solution.riskScore}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Data Volume */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">How many photos do you process monthly?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {dataVolumes.map((volume) => (
              <button
                key={volume.id}
                onClick={() => setInputs({...inputs, dataVolume: volume.id as any})}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  inputs.dataVolume === volume.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900">{volume.name}</div>
                <div className="text-sm text-slate-600">
                  Risk multiplier: {volume.multiplier}x
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Compliance Requirements */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Which compliance requirements apply to you?</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {complianceOptions.map((compliance) => (
              <button
                key={compliance}
                onClick={() => {
                  const current = inputs.complianceRequirements;
                  const updated = current.includes(compliance)
                    ? current.filter(c => c !== compliance)
                    : [...current, compliance];
                  setInputs({...inputs, complianceRequirements: updated});
                }}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  inputs.complianceRequirements.includes(compliance)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {compliance}
              </button>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Team Size</label>
              <input
                type="number"
                value={inputs.teamSize}
                onChange={(e) => setInputs({...inputs, teamSize: parseInt(e.target.value) || 1})}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Average Data Value per Case/Project</label>
              <input
                type="number"
                value={inputs.averageDataValue}
                onChange={(e) => setInputs({...inputs, averageDataValue: parseInt(e.target.value) || 1000})}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1000"
                step="1000"
              />
            </div>
          </div>
        </div>
      )}

      {/* Calculating */}
      {currentStep === 5 && isCalculating && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Analyzing Your Privacy Risk</h3>
          <p className="text-slate-600">Calculating breach probability, compliance gaps, and potential costs...</p>
        </div>
      )}

      {/* Results */}
      {currentStep === 5 && assessment && !isCalculating && (
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Your Privacy Risk Assessment</h3>
          </div>

          {/* Overall Risk Score */}
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-900">Overall Risk Score</h4>
              <span className={`px-4 py-2 rounded-full font-bold text-lg ${getRiskColor(assessment.overallRiskScore)}`}>
                {assessment.overallRiskScore}/100 - {getRiskLabel(assessment.overallRiskScore)}
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{assessment.breachProbability}%</div>
                <div className="text-sm text-slate-600">Annual breach probability</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(assessment.potentialBreachCost)}</div>
                <div className="text-sm text-slate-600">Potential breach cost</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{assessment.complianceGaps.length}</div>
                <div className="text-sm text-slate-600">Compliance gaps identified</div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Risk Factors
              </h4>
              <ul className="space-y-2">
                {assessment.riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start text-red-700">
                    <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                ProofPix Benefits
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-700">Risk Reduction:</span>
                  <span className="font-semibold text-green-600">{Math.round(assessment.proofPixBenefits.riskReduction)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Annual Savings:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(assessment.proofPixBenefits.costSavings)}</span>
                </div>
                <div className="text-sm text-green-700 mt-3">
                  <strong>Compliance Improvements:</strong>
                  <ul className="mt-1 space-y-1">
                    {assessment.proofPixBenefits.complianceImprovement.slice(0, 2).map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="text-xs">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg text-center">
            <h4 className="text-2xl font-bold mb-4">Ready to Eliminate Your Privacy Risk?</h4>
            <p className="text-blue-100 mb-6">
              ProofPix can reduce your risk by {Math.round(assessment.proofPixBenefits.riskReduction)}% and save you {formatCurrency(assessment.proofPixBenefits.costSavings)} annually
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Start Free Trial—Eliminate Risk Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Schedule Privacy Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {currentStep === 4 ? 'Calculate Risk' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PrivacyAssessmentTool; 