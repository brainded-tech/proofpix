import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Shield, Clock, Users } from 'lucide-react';

interface ROIInputs {
  industry: 'legal' | 'insurance' | 'healthcare' | 'realestate' | 'general';
  teamSize: number;
  monthlyPhotos: number;
  currentSolution: 'manual' | 'basic' | 'enterprise' | 'none';
  averageCaseValue: number;
  timePerPhoto: number; // minutes
}

interface ROIResults {
  monthlySavings: number;
  annualSavings: number;
  timeRecovered: number; // hours per month
  riskReduction: number; // dollar value
  roiPercentage: number;
  paybackPeriod: number; // months
  productivityGain: number; // percentage
}

const AdvancedROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    industry: 'legal',
    teamSize: 5,
    monthlyPhotos: 100,
    currentSolution: 'manual',
    averageCaseValue: 50000,
    timePerPhoto: 15
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const industryData = {
    legal: {
      name: 'Legal Services',
      hourlyRate: 350,
      riskMultiplier: 2.5,
      efficiencyGain: 0.85,
      complianceSavings: 25000,
      icon: '⚖️'
    },
    insurance: {
      name: 'Insurance',
      hourlyRate: 125,
      riskMultiplier: 3.2,
      efficiencyGain: 0.75,
      complianceSavings: 15000,
      icon: '🛡️'
    },
    healthcare: {
      name: 'Healthcare',
      hourlyRate: 200,
      riskMultiplier: 4.0,
      efficiencyGain: 0.80,
      complianceSavings: 50000,
      icon: '🏥'
    },
    realestate: {
      name: 'Real Estate',
      hourlyRate: 75,
      riskMultiplier: 1.8,
      efficiencyGain: 0.70,
      complianceSavings: 5000,
      icon: '🏠'
    },
    general: {
      name: 'General Business',
      hourlyRate: 100,
      riskMultiplier: 2.0,
      efficiencyGain: 0.65,
      complianceSavings: 10000,
      icon: '💼'
    }
  };

  const currentSolutionCosts = {
    manual: { monthlyCost: 0, efficiencyPenalty: 0.5 },
    basic: { monthlyCost: 99, efficiencyPenalty: 0.3 },
    enterprise: { monthlyCost: 899, efficiencyPenalty: 0.1 },
    none: { monthlyCost: 0, efficiencyPenalty: 0.8 }
  };

  const calculateROI = (): ROIResults => {
    const industry = industryData[inputs.industry];
    const currentSolution = currentSolutionCosts[inputs.currentSolution];
    
    // Time savings calculation
    const currentTimePerPhoto = inputs.timePerPhoto * (1 + currentSolution.efficiencyPenalty);
    const proofPixTimePerPhoto = 2; // 2 minutes with ProofPix
    const timeSavedPerPhoto = currentTimePerPhoto - proofPixTimePerPhoto;
    const monthlyTimeSaved = (timeSavedPerPhoto * inputs.monthlyPhotos) / 60; // hours
    
    // Cost savings calculation
    const laborSavings = monthlyTimeSaved * industry.hourlyRate * inputs.teamSize;
    const currentToolCosts = currentSolution.monthlyCost;
    const proofPixCost = inputs.industry === 'legal' ? 299 : 
                        inputs.industry === 'insurance' ? 599 :
                        inputs.industry === 'healthcare' ? 899 : 199;
    
    const monthlySavings = laborSavings - currentToolCosts - proofPixCost;
    const annualSavings = monthlySavings * 12;
    
    // Risk reduction (data breach prevention)
    const breachRisk = inputs.averageCaseValue * industry.riskMultiplier * 0.001; // 0.1% chance
    const riskReduction = breachRisk * 12; // Annual risk reduction
    
    // ROI calculation
    const totalAnnualBenefit = annualSavings + riskReduction + industry.complianceSavings;
    const annualCost = proofPixCost * 12;
    const roiPercentage = ((totalAnnualBenefit - annualCost) / annualCost) * 100;
    
    // Payback period
    const paybackPeriod = annualCost / (monthlySavings + (riskReduction / 12));
    
    // Productivity gain
    const productivityGain = industry.efficiencyGain * 100;

    return {
      monthlySavings,
      annualSavings: totalAnnualBenefit,
      timeRecovered: monthlyTimeSaved * inputs.teamSize,
      riskReduction,
      roiPercentage,
      paybackPeriod,
      productivityGain
    };
  };

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      setResults(calculateROI());
      setIsCalculating(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [inputs]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Calculator className="w-4 h-4 mr-2" />
          ROI CALCULATOR
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Calculate Your ProofPix ROI
        </h2>
        <p className="text-lg text-slate-600">
          See exactly how much time and money ProofPix will save your organization
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Your Organization</h3>
          
          {/* Industry Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
            <select
              value={inputs.industry}
              onChange={(e) => setInputs({...inputs, industry: e.target.value as any})}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(industryData).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.icon} {data.name}
                </option>
              ))}
            </select>
          </div>

          {/* Team Size */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Team Size</label>
            <input
              type="number"
              value={inputs.teamSize}
              onChange={(e) => setInputs({...inputs, teamSize: parseInt(e.target.value) || 1})}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="1000"
            />
          </div>

          {/* Monthly Photos */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Photos Analyzed Per Month</label>
            <input
              type="number"
              value={inputs.monthlyPhotos}
              onChange={(e) => setInputs({...inputs, monthlyPhotos: parseInt(e.target.value) || 1})}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="10000"
            />
          </div>

          {/* Current Solution */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Solution</label>
            <select
              value={inputs.currentSolution}
              onChange={(e) => setInputs({...inputs, currentSolution: e.target.value as any})}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="manual">Manual Analysis</option>
              <option value="basic">Basic Tools ($99/month)</option>
              <option value="enterprise">Enterprise Tools ($899/month)</option>
              <option value="none">No Current Solution</option>
            </select>
          </div>

          {/* Average Case Value */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Average Case/Project Value</label>
            <input
              type="number"
              value={inputs.averageCaseValue}
              onChange={(e) => setInputs({...inputs, averageCaseValue: parseInt(e.target.value) || 1000})}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1000"
              step="1000"
            />
          </div>

          {/* Time Per Photo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Time Per Photo (minutes)</label>
            <input
              type="number"
              value={inputs.timePerPhoto}
              onChange={(e) => setInputs({...inputs, timePerPhoto: parseInt(e.target.value) || 1})}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="120"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Your ROI Results</h3>
          
          {isCalculating ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : results ? (
            <div className="space-y-4">
              {/* Annual Savings */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                  <h4 className="text-lg font-semibold text-green-900">Annual Savings</h4>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(results.annualSavings)}
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Including labor, risk reduction, and compliance savings
                </p>
              </div>

              {/* ROI Percentage */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                  <h4 className="text-lg font-semibold text-blue-900">ROI</h4>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {results.roiPercentage.toFixed(0)}%
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Return on investment in first year
                </p>
              </div>

              {/* Time Recovered */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center mb-2">
                  <Clock className="w-6 h-6 text-purple-600 mr-2" />
                  <h4 className="text-lg font-semibold text-purple-900">Time Recovered</h4>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {results.timeRecovered.toFixed(0)} hrs
                </div>
                <p className="text-sm text-purple-700 mt-1">
                  Per month across your team
                </p>
              </div>

              {/* Payback Period */}
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center mb-2">
                  <Shield className="w-6 h-6 text-orange-600 mr-2" />
                  <h4 className="text-lg font-semibold text-orange-900">Payback Period</h4>
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {results.paybackPeriod.toFixed(1)} months
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  Time to recover your investment
                </p>
              </div>

              {/* Productivity Gain */}
              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <Users className="w-6 h-6 text-indigo-600 mr-2" />
                  <h4 className="text-lg font-semibold text-indigo-900">Productivity Gain</h4>
                </div>
                <div className="text-3xl font-bold text-indigo-600">
                  {results.productivityGain.toFixed(0)}%
                </div>
                <p className="text-sm text-indigo-700 mt-1">
                  Increase in team efficiency
                </p>
              </div>
            </div>
          ) : null}

          {/* CTA */}
          <div className="bg-slate-900 text-white p-6 rounded-lg text-center">
            <h4 className="text-lg font-semibold mb-2">Ready to Start Saving?</h4>
            <p className="text-slate-300 mb-4">
              Join {industryData[inputs.industry].name.toLowerCase()} professionals already using ProofPix
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full">
              Start Free Trial—See Results in 5 Minutes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedROICalculator; 