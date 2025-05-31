import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Shield, Clock, Users, AlertTriangle } from 'lucide-react';
import { EnterpriseButton } from './ui/EnterpriseComponents';
import { pricingAnalytics } from '../utils/analytics';

interface ROIInputs {
  currentCost: number;
  teamSize: number;
  complianceNeeds: 'none' | 'basic' | 'industry' | 'strict';
  photosPerMonth: number;
  timePerPhoto: number; // minutes
  hourlyRate: number;
  breachRisk: 'low' | 'medium' | 'high';
}

interface ROIResults {
  currentAnnualCost: number;
  proofPixAnnualCost: number;
  annualSavings: number;
  riskReduction: number;
  timesSaved: number;
  roi: number;
  paybackPeriod: number; // months
  recommendedPlan: string;
}

export const ROICalculatorWidget: React.FC = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    currentCost: 0,
    teamSize: 1,
    complianceNeeds: 'none',
    photosPerMonth: 100,
    timePerPhoto: 5,
    hourlyRate: 50,
    breachRisk: 'medium'
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const calculateROI = (): void => {
    setIsCalculating(true);
    
    // Default return value while calculation is in progress
    const defaultResults: ROIResults = {
      currentAnnualCost: 0,
      proofPixAnnualCost: 0,
      annualSavings: 0,
      riskReduction: 0,
      timesSaved: 0,
      roi: 0,
      paybackPeriod: 0,
      recommendedPlan: 'individual'
    };
    
    // Start with default results
    setResults(defaultResults);

    // Start the calculation process
    setTimeout(() => {
      // Current costs calculation
      const monthlyTimeCost = (inputs.photosPerMonth * inputs.timePerPhoto / 60) * inputs.hourlyRate * inputs.teamSize;
      const currentAnnualCost = (inputs.currentCost + monthlyTimeCost) * 12;

      // ProofPix cost calculation based on team size and compliance
      let recommendedPlan = 'individual';
      let monthlyProofPixCost = 19;

      if (inputs.teamSize > 25 || inputs.complianceNeeds === 'strict') {
        recommendedPlan = 'enterprise';
        monthlyProofPixCost = 499;
      } else if (inputs.teamSize > 5 || inputs.complianceNeeds === 'industry') {
        recommendedPlan = 'business';
        monthlyProofPixCost = 149;
      } else if (inputs.teamSize > 1 || inputs.complianceNeeds === 'basic') {
        recommendedPlan = 'professional';
        monthlyProofPixCost = 49;
      }

      // Industry multipliers
      if (inputs.complianceNeeds === 'industry') {
        monthlyProofPixCost *= 2.2; // Average industry multiplier
      } else if (inputs.complianceNeeds === 'strict') {
        monthlyProofPixCost *= 3.0; // Government/strict compliance
      }

      const proofPixAnnualCost = monthlyProofPixCost * 12;

      // Time savings with ProofPix (80% reduction in processing time)
      const newTimePerPhoto = inputs.timePerPhoto * 0.2; // 80% time reduction
      const newMonthlyTimeCost = (inputs.photosPerMonth * newTimePerPhoto / 60) * inputs.hourlyRate * inputs.teamSize;
      const timeSavingsAnnual = (monthlyTimeCost - newMonthlyTimeCost) * 12;

      // Risk reduction calculation
      const breachCosts = {
        low: 1000000,    // $1M
        medium: 4450000, // $4.45M (industry average)
        high: 10000000   // $10M
      };
      
      const breachProbability = {
        low: 0.05,    // 5% chance
        medium: 0.15, // 15% chance  
        high: 0.30    // 30% chance
      };

      const expectedBreachCost = breachCosts[inputs.breachRisk] * breachProbability[inputs.breachRisk];
      const riskReduction = expectedBreachCost * 0.95; // 95% risk reduction with client-side processing

      // Total savings
      const annualSavings = timeSavingsAnnual + riskReduction - proofPixAnnualCost;
      const roi = (annualSavings / proofPixAnnualCost) * 100;
      const paybackPeriod = proofPixAnnualCost / (annualSavings / 12);

      const calculationResults: ROIResults = {
        currentAnnualCost,
        proofPixAnnualCost,
        annualSavings,
        riskReduction,
        timesSaved: timeSavingsAnnual,
        roi,
        paybackPeriod: Math.max(0, paybackPeriod),
        recommendedPlan
      };
      
      setResults(calculationResults);
      setIsCalculating(false);
      
      // Track analytics
      pricingAnalytics.trackROICalculated(inputs, calculationResults);
    }, 1500);
  };

  useEffect(() => {
    if (isVisible) {
      calculateROI();
    }
  }, [inputs, isVisible]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(0)}%`;
  };

  if (!isVisible) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
        <div className="text-center">
          <Calculator className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Calculate Your ROI</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            See how much time and money ProofPix can save your organization with our interactive ROI calculator.
          </p>
          <EnterpriseButton
            onClick={() => setIsVisible(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Savings
          </EnterpriseButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
      <div className="text-center mb-8">
        <Calculator className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">ROI Calculator</h3>
        <p className="text-slate-600">Calculate your potential savings with ProofPix</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Your Current Situation</h4>
          
          {/* Current Monthly Cost */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current monthly metadata tool costs
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                value={inputs.currentCost}
                onChange={(e) => setInputs({...inputs, currentCost: Number(e.target.value)})}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Team Size */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Team size
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                value={inputs.teamSize}
                onChange={(e) => setInputs({...inputs, teamSize: Number(e.target.value)})}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1"
                min="1"
              />
            </div>
          </div>

          {/* Photos per Month */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Photos processed per month
            </label>
            <input
              type="number"
              value={inputs.photosPerMonth}
              onChange={(e) => setInputs({...inputs, photosPerMonth: Number(e.target.value)})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="100"
              min="1"
            />
          </div>

          {/* Time per Photo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Average time per photo (minutes)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                value={inputs.timePerPhoto}
                onChange={(e) => setInputs({...inputs, timePerPhoto: Number(e.target.value)})}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5"
                min="1"
              />
            </div>
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Average hourly rate
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                value={inputs.hourlyRate}
                onChange={(e) => setInputs({...inputs, hourlyRate: Number(e.target.value)})}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50"
                min="1"
              />
            </div>
          </div>

          {/* Compliance Needs */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Compliance requirements
            </label>
            <select
              value={inputs.complianceNeeds}
              onChange={(e) => setInputs({...inputs, complianceNeeds: e.target.value as any})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">No special requirements</option>
              <option value="basic">Basic business compliance</option>
              <option value="industry">Industry-specific (Legal, Healthcare, etc.)</option>
              <option value="strict">Strict regulatory (Government, Finance)</option>
            </select>
          </div>

          {/* Breach Risk */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data breach risk level
            </label>
            <select
              value={inputs.breachRisk}
              onChange={(e) => setInputs({...inputs, breachRisk: e.target.value as any})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low risk</option>
              <option value="medium">Medium risk (Industry average)</option>
              <option value="high">High risk</option>
            </select>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Your Potential Savings</h4>
          
          {results && (
            <div className="space-y-4">
              {/* ROI Highlight */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {formatPercentage(results.roi)}
                  </div>
                  <div className="text-sm text-green-700">Annual ROI</div>
                </div>
              </div>

              {/* Savings Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(results.annualSavings)}
                  </div>
                  <div className="text-sm text-blue-700">Total Annual Savings</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {results.paybackPeriod.toFixed(1)}
                  </div>
                  <div className="text-sm text-purple-700">Months to Payback</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Time savings (80% reduction)</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(results.timesSaved)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Risk reduction (95% less breach risk)</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(results.riskReduction)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">ProofPix annual cost</span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(results.proofPixAnnualCost)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg">
                  <span className="font-semibold text-slate-900">Net Annual Savings</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(results.annualSavings)}
                  </span>
                </div>
              </div>

              {/* Recommended Plan */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h5 className="font-semibold text-slate-900 mb-2">Recommended Plan</h5>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-600 capitalize">
                    {results.recommendedPlan} Plan
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  Based on your team size and compliance requirements
                </p>
              </div>

              {/* Risk Warning */}
              {inputs.breachRisk === 'high' && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h6 className="font-semibold text-orange-900">High Risk Alert</h6>
                      <p className="text-sm text-orange-700">
                        Your current setup has high data breach risk. ProofPix's client-side processing eliminates this risk entirely.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3 pt-4">
                <EnterpriseButton
                  onClick={() => {
                    pricingAnalytics.trackCTAClick('roi_recommendation', results.recommendedPlan, 'roi-result');
                    window.location.href = `/checkout?plan=${results.recommendedPlan}&source=roi_calculator`;
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Get Started with {results.recommendedPlan} Plan
                </EnterpriseButton>
                
                <EnterpriseButton
                  onClick={() => window.location.href = '/enterprise'}
                  variant="secondary"
                  className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Schedule Enterprise Demo
                </EnterpriseButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-600 hover:text-slate-900 text-sm"
        >
          ← Back to calculator overview
        </button>
      </div>
    </div>
  );
};

export default ROICalculatorWidget; 