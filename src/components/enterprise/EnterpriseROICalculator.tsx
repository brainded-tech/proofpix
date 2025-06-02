import React, { useState, useEffect } from 'react';
import {
  Calculator,
  DollarSign,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  Clock,
  FileText,
  Zap,
  Building,
  Target
} from 'lucide-react';

interface ROIInputs {
  employees: number;
  documentsPerMonth: number;
  currentSolution: 'docusign' | 'adobe' | 'box' | 'custom' | 'none';
  industry: 'legal' | 'healthcare' | 'financial' | 'insurance' | 'other';
  complianceRequirements: string[];
  breachRiskTolerance: 'zero' | 'low' | 'medium' | 'high';
}

interface ROIResults {
  currentCosts: {
    software: number;
    compliance: number;
    security: number;
    breachRisk: number;
    implementation: number;
    total: number;
  };
  proofpixCosts: {
    software: number;
    compliance: number;
    security: number;
    breachRisk: number;
    implementation: number;
    total: number;
  };
  savings: {
    annual: number;
    threeYear: number;
    percentage: number;
  };
  paybackPeriod: number;
  riskReduction: number;
}

const EnterpriseROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    employees: 100,
    documentsPerMonth: 1000,
    currentSolution: 'none',
    industry: 'legal',
    complianceRequirements: ['GDPR'],
    breachRiskTolerance: 'zero'
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  const solutionCosts = {
    docusign: { base: 10000, perUser: 50, implementation: 50000 },
    adobe: { base: 15000, perUser: 75, implementation: 75000 },
    box: { base: 8000, perUser: 40, implementation: 40000 },
    custom: { base: 20000, perUser: 100, implementation: 100000 },
    none: { base: 0, perUser: 0, implementation: 0 }
  };

  const industryMultipliers = {
    legal: { compliance: 1.5, security: 1.3, breach: 2.0 },
    healthcare: { compliance: 2.0, security: 1.5, breach: 3.0 },
    financial: { compliance: 1.8, security: 1.4, breach: 2.5 },
    insurance: { compliance: 1.6, security: 1.3, breach: 2.2 },
    other: { compliance: 1.0, security: 1.0, breach: 1.0 }
  };

  const complianceCosts = {
    GDPR: 25000,
    HIPAA: 40000,
    SOX: 35000,
    CCPA: 20000,
    PCI: 30000
  };

  const calculateROI = () => {
    const solution = solutionCosts[inputs.currentSolution];
    const multiplier = industryMultipliers[inputs.industry];
    
    // Current solution costs
    const currentSoftware = solution.base + (solution.perUser * inputs.employees);
    const currentCompliance = inputs.complianceRequirements.reduce(
      (sum, req) => sum + (complianceCosts[req as keyof typeof complianceCosts] || 0), 0
    ) * multiplier.compliance;
    const currentSecurity = 50000 * multiplier.security; // Base security costs
    const currentBreachRisk = 4450000 * multiplier.breach * 0.1; // 10% chance of $4.45M breach
    const currentImplementation = solution.implementation;

    // ProofPix costs
    const proofpixSoftware = Math.min(inputs.employees * 20, 24000); // $20/user, max $2K/month
    const proofpixCompliance = currentCompliance * 0.2; // 80% reduction
    const proofpixSecurity = currentSecurity * 0.3; // 70% reduction
    const proofpixBreachRisk = 0; // Mathematically impossible
    const proofpixImplementation = 25000; // 4 weeks vs 24 weeks

    const currentTotal = currentSoftware + currentCompliance + currentSecurity + 
                        currentBreachRisk + (currentImplementation / 3); // Amortized over 3 years
    const proofpixTotal = proofpixSoftware + proofpixCompliance + proofpixSecurity + 
                         proofpixBreachRisk + (proofpixImplementation / 3);

    const annualSavings = currentTotal - proofpixTotal;
    const threeYearSavings = annualSavings * 3;
    const savingsPercentage = (annualSavings / currentTotal) * 100;
    const paybackPeriod = proofpixImplementation / (annualSavings / 12);
    const riskReduction = inputs.breachRiskTolerance === 'zero' ? 100 : 85;

    setResults({
      currentCosts: {
        software: currentSoftware,
        compliance: currentCompliance,
        security: currentSecurity,
        breachRisk: currentBreachRisk,
        implementation: currentImplementation,
        total: currentTotal
      },
      proofpixCosts: {
        software: proofpixSoftware,
        compliance: proofpixCompliance,
        security: proofpixSecurity,
        breachRisk: proofpixBreachRisk,
        implementation: proofpixImplementation,
        total: proofpixTotal
      },
      savings: {
        annual: annualSavings,
        threeYear: threeYearSavings,
        percentage: savingsPercentage
      },
      paybackPeriod,
      riskReduction
    });
  };

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field: keyof ROIInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleComplianceChange = (requirement: string, checked: boolean) => {
    setInputs(prev => ({
      ...prev,
      complianceRequirements: checked
        ? [...prev.complianceRequirements, requirement]
        : prev.complianceRequirements.filter(req => req !== requirement)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-green-600/20 rounded-full text-green-300 text-sm font-medium mb-6">
            <Calculator className="w-4 h-4 mr-2" />
            Enterprise ROI Calculator
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Calculate Your Security Investment ROI
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover how much you can save by eliminating data breach risk with ProofPix's hybrid architecture
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-slate-800/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Building className="w-6 h-6 mr-3 text-blue-400" />
              Organization Details
            </h2>

            <div className="space-y-6">
              {/* Employees */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Employees
                </label>
                <input
                  type="number"
                  value={inputs.employees}
                  onChange={(e) => handleInputChange('employees', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  min="1"
                />
              </div>

              {/* Documents per month */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Documents Processed Monthly
                </label>
                <input
                  type="number"
                  value={inputs.documentsPerMonth}
                  onChange={(e) => handleInputChange('documentsPerMonth', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  min="1"
                />
              </div>

              {/* Current Solution */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Solution
                </label>
                <select
                  value={inputs.currentSolution}
                  onChange={(e) => handleInputChange('currentSolution', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="none">No current solution</option>
                  <option value="docusign">DocuSign AI</option>
                  <option value="adobe">Adobe Enterprise</option>
                  <option value="box">Box AI</option>
                  <option value="custom">Custom Solution</option>
                </select>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Industry
                </label>
                <select
                  value={inputs.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="legal">Legal Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="financial">Financial Services</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Compliance Requirements */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Compliance Requirements
                </label>
                <div className="space-y-2">
                  {['GDPR', 'HIPAA', 'SOX', 'CCPA', 'PCI'].map((req) => (
                    <label key={req} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={inputs.complianceRequirements.includes(req)}
                        onChange={(e) => handleComplianceChange(req, e.target.checked)}
                        className="mr-2 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-300">{req}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Breach Risk Tolerance */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Acceptable Breach Risk
                </label>
                <select
                  value={inputs.breachRiskTolerance}
                  onChange={(e) => handleInputChange('breachRiskTolerance', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="zero">Zero tolerance (Impossible)</option>
                  <option value="low">Low risk (Unlikely)</option>
                  <option value="medium">Medium risk (Possible)</option>
                  <option value="high">High risk (Probable)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-slate-800/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
              ROI Analysis
            </h2>

            {results && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-900/30 rounded-lg p-4">
                    <div className="text-green-300 text-sm font-medium">Annual Savings</div>
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(results.savings.annual)}
                    </div>
                  </div>
                  <div className="bg-blue-900/30 rounded-lg p-4">
                    <div className="text-blue-300 text-sm font-medium">3-Year Savings</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {formatCurrency(results.savings.threeYear)}
                    </div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="text-purple-300 text-sm font-medium">Cost Reduction</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {results.savings.percentage.toFixed(0)}%
                    </div>
                  </div>
                  <div className="bg-orange-900/30 rounded-lg p-4">
                    <div className="text-orange-300 text-sm font-medium">Payback Period</div>
                    <div className="text-2xl font-bold text-orange-400">
                      {results.paybackPeriod.toFixed(1)} months
                    </div>
                  </div>
                </div>

                {/* Risk Reduction */}
                <div className="bg-red-900/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-red-300 text-sm font-medium">Breach Risk Reduction</div>
                      <div className="text-2xl font-bold text-red-400">
                        {results.riskReduction}%
                      </div>
                    </div>
                    <Shield className="w-8 h-8 text-red-400" />
                  </div>
                  {inputs.breachRiskTolerance === 'zero' && (
                    <div className="mt-2 text-xs text-red-300">
                      Mathematically impossible with hybrid architecture
                    </div>
                  )}
                </div>

                {/* Cost Comparison */}
                <div className="space-y-4">
                  <button
                    onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                    className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {showDetailedBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
                  </button>

                  {showDetailedBreakdown && (
                    <div className="space-y-4">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3">Current Solution Costs</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Software Licensing</span>
                            <span className="text-slate-200">{formatCurrency(results.currentCosts.software)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Compliance</span>
                            <span className="text-slate-200">{formatCurrency(results.currentCosts.compliance)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Security Infrastructure</span>
                            <span className="text-slate-200">{formatCurrency(results.currentCosts.security)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Breach Risk</span>
                            <span className="text-red-400">{formatCurrency(results.currentCosts.breachRisk)}</span>
                          </div>
                          <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold">
                            <span className="text-white">Total Annual</span>
                            <span className="text-white">{formatCurrency(results.currentCosts.total)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3">ProofPix Hybrid Costs</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Software Licensing</span>
                            <span className="text-slate-200">{formatCurrency(results.proofpixCosts.software)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Compliance</span>
                            <span className="text-slate-200">{formatCurrency(results.proofpixCosts.compliance)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Security Infrastructure</span>
                            <span className="text-slate-200">{formatCurrency(results.proofpixCosts.security)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Breach Risk</span>
                            <span className="text-green-400">{formatCurrency(results.proofpixCosts.breachRisk)}</span>
                          </div>
                          <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold">
                            <span className="text-white">Total Annual</span>
                            <span className="text-white">{formatCurrency(results.proofpixCosts.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Ready to Achieve These Savings?
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Schedule a personalized demo to see how hybrid architecture can transform your security posture
                  </p>
                  <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Schedule Enterprise Demo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-slate-800/50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Why Choose Architectural Impossibility?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-2">Zero Breach Risk</h4>
                <p className="text-slate-300 text-sm">
                  Mathematically impossible data breaches with local processing
                </p>
              </div>
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-2">80% Cost Savings</h4>
                <p className="text-slate-300 text-sm">
                  Dramatically lower costs compared to traditional enterprise solutions
                </p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h4 className="font-semibold text-white mb-2">4-Week Implementation</h4>
                <p className="text-slate-300 text-sm">
                  83% faster deployment than traditional enterprise platforms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseROICalculator; 