import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, DollarSign, TrendingUp, ArrowRight, CheckCircle, Server, Shield, Clock, Users, ArrowLeft } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

export const ROICalculator: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  const [inputs, setInputs] = useState({
    monthlyImages: 10000,
    currentServerCosts: 5000,
    teamSize: 25,
    complianceAuditCosts: 50000,
    dataBreachInsurance: 25000,
    averageProcessingTime: 30,
    hourlyRate: 75
  });

  const [results, setResults] = useState({
    monthlySavings: 0,
    annualSavings: 0,
    roiPercentage: 0,
    paybackMonths: 0,
    totalBenefits: 0
  });

  const proofPixPricing = {
    starter: { monthly: 599, images: 50000 },
    professional: { monthly: 1495, images: 200000 },
    premium: { monthly: 2995, images: 500000 },
    enterprise: { monthly: 5000, images: 1000000 }
  };

  const calculateROI = () => {
    // Determine ProofPix tier based on monthly images
    let proofPixCost = 0;
    if (inputs.monthlyImages <= 50000) {
      proofPixCost = proofPixPricing.starter.monthly;
    } else if (inputs.monthlyImages <= 200000) {
      proofPixCost = proofPixPricing.professional.monthly;
    } else if (inputs.monthlyImages <= 500000) {
      proofPixCost = proofPixPricing.premium.monthly;
    } else {
      proofPixCost = proofPixPricing.enterprise.monthly;
    }

    // Calculate current costs
    const monthlyServerCosts = inputs.currentServerCosts;
    const monthlyComplianceCosts = inputs.complianceAuditCosts / 12;
    const monthlyInsuranceCosts = inputs.dataBreachInsurance / 12;
    const monthlyProcessingCosts = (inputs.monthlyImages * inputs.averageProcessingTime / 60) * inputs.hourlyRate;
    
    const totalCurrentMonthlyCosts = monthlyServerCosts + monthlyComplianceCosts + monthlyInsuranceCosts + monthlyProcessingCosts;

    // Calculate savings
    const monthlySavings = totalCurrentMonthlyCosts - proofPixCost;
    const annualSavings = monthlySavings * 12;
    const totalBenefits = annualSavings;
    const roiPercentage = (annualSavings / (proofPixCost * 12)) * 100;
    const paybackMonths = (proofPixCost * 12) / monthlySavings;

    setResults({
      monthlySavings: Math.max(0, monthlySavings),
      annualSavings: Math.max(0, annualSavings),
      roiPercentage: Math.max(0, roiPercentage),
      paybackMonths: Math.max(0, paybackMonths),
      totalBenefits: Math.max(0, totalBenefits)
    });
  };

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const handleInputChange = (field: string, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const costBreakdown = [
    {
      category: "Server Infrastructure",
      current: inputs.currentServerCosts,
      proofpix: 0,
      savings: inputs.currentServerCosts,
      icon: Server,
      description: "Eliminate server costs with client-side processing"
    },
    {
      category: "Compliance Audits",
      current: inputs.complianceAuditCosts / 12,
      proofpix: 0,
      savings: inputs.complianceAuditCosts / 12,
      icon: Shield,
      description: "Built-in compliance eliminates audit overhead"
    },
    {
      category: "Data Breach Insurance",
      current: inputs.dataBreachInsurance / 12,
      proofpix: 0,
      savings: inputs.dataBreachInsurance / 12,
      icon: Shield,
      description: "Zero data exposure = zero breach risk"
    },
    {
      category: "Processing Time",
      current: (inputs.monthlyImages * inputs.averageProcessingTime / 60) * inputs.hourlyRate,
      proofpix: (inputs.monthlyImages * 2 / 60) * inputs.hourlyRate, // 2 seconds with ProofPix
      savings: ((inputs.monthlyImages * inputs.averageProcessingTime / 60) * inputs.hourlyRate) - ((inputs.monthlyImages * 2 / 60) * inputs.hourlyRate),
      icon: Clock,
      description: "Instant processing vs traditional delays"
    }
  ];

  const benefits = [
    {
      title: "Zero Data Exposure",
      description: "Complete elimination of data breach risk",
      value: "Priceless",
      icon: Shield
    },
    {
      title: "Instant Processing",
      description: "Real-time results vs minutes/hours of waiting",
      value: `${formatNumber(inputs.monthlyImages)} images/month`,
      icon: Clock
    },
    {
      title: "No Infrastructure",
      description: "Eliminate server maintenance and scaling costs",
      value: formatCurrency(inputs.currentServerCosts * 12),
      icon: Server
    },
    {
      title: "Built-in Compliance",
      description: "GDPR, CCPA, HIPAA, SOC 2 ready out-of-the-box",
      value: formatCurrency(inputs.complianceAuditCosts),
      icon: CheckCircle
    }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="ProofPix ROI Calculator"
      description="Calculate your cost savings and return on investment with ProofPix"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <EnterpriseButton
          variant="ghost"
          onClick={handleBackToDocs}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Documentation
        </EnterpriseButton>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">ProofPix ROI Calculator</h1>
            <p className="text-xl text-slate-600 mt-2">
              Calculate your cost savings and return on investment with ProofPix
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<Calculator className="enterprise-icon-sm" />}>
            ROI Calculator
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<DollarSign className="enterprise-icon-sm" />}>
            Cost Analysis
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<TrendingUp className="enterprise-icon-sm" />}>
            Business Value
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ROI Summary Cards */}
        <EnterpriseGrid columns={4} className="mb-8">
          <EnterpriseCard className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-green-600" size={24} />
              <span className="text-sm text-green-600 font-medium">Monthly Savings</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(results.monthlySavings)}</div>
          </EnterpriseCard>

          <EnterpriseCard className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-blue-600" size={24} />
              <span className="text-sm text-blue-600 font-medium">Annual Savings</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(results.annualSavings)}</div>
          </EnterpriseCard>

          <EnterpriseCard className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Calculator className="text-purple-600" size={24} />
              <span className="text-sm text-purple-600 font-medium">ROI Percentage</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{results.roiPercentage.toFixed(0)}%</div>
          </EnterpriseCard>

          <EnterpriseCard className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-orange-600" size={24} />
              <span className="text-sm text-orange-600 font-medium">Payback Period</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">{results.paybackMonths.toFixed(1)} months</div>
          </EnterpriseCard>
        </EnterpriseGrid>

        {/* Input Form */}
        <EnterpriseGrid columns={2} className="mb-8">
          <EnterpriseCard>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Current Situation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly Images Processed
                </label>
                <input
                  type="number"
                  value={inputs.monthlyImages}
                  onChange={(e) => handleInputChange('monthlyImages', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Server Costs (Monthly)
                </label>
                <input
                  type="number"
                  value={inputs.currentServerCosts}
                  onChange={(e) => handleInputChange('currentServerCosts', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Team Size
                </label>
                <input
                  type="number"
                  value={inputs.teamSize}
                  onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Annual Compliance Audit Costs
                </label>
                <input
                  type="number"
                  value={inputs.complianceAuditCosts}
                  onChange={(e) => handleInputChange('complianceAuditCosts', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </EnterpriseCard>

          <EnterpriseCard>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Processing Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data Breach Insurance (Annual)
                </label>
                <input
                  type="number"
                  value={inputs.dataBreachInsurance}
                  onChange={(e) => handleInputChange('dataBreachInsurance', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Average Processing Time (seconds)
                </label>
                <input
                  type="number"
                  value={inputs.averageProcessingTime}
                  onChange={(e) => handleInputChange('averageProcessingTime', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  value={inputs.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </EnterpriseCard>
        </EnterpriseGrid>

        {/* Cost Breakdown */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Cost Breakdown Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Current Monthly</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">With ProofPix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Savings</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {costBreakdown.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 text-slate-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">{item.category}</div>
                          <div className="text-sm text-slate-500">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatCurrency(item.current)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatCurrency(item.proofpix)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(item.savings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </EnterpriseCard>

        {/* Benefits Overview */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Key Benefits</h2>
          <EnterpriseGrid columns={2}>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                <benefit.icon className="h-8 w-8 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">{benefit.description}</p>
                  <div className="text-lg font-bold text-blue-600">{benefit.value}</div>
                </div>
              </div>
            ))}
          </EnterpriseGrid>
        </EnterpriseCard>

        {/* Call to Action */}
        <EnterpriseCard className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Start Saving?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Based on your inputs, ProofPix can save your organization {formatCurrency(results.annualSavings)} annually 
            with a {results.roiPercentage.toFixed(0)}% ROI and {results.paybackMonths.toFixed(1)} month payback period.
          </p>
          <div className="flex justify-center space-x-4">
            <EnterpriseButton variant="primary">
              Schedule Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </EnterpriseButton>
            <EnterpriseButton variant="secondary">
              Get Custom Quote
            </EnterpriseButton>
          </div>
        </EnterpriseCard>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </EnterpriseLayout>
  );
}; 