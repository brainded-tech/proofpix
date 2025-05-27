import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, DollarSign, TrendingUp, ArrowRight, CheckCircle, Server, Shield, Clock, Users } from 'lucide-react';
import DocumentationFooter from '../../components/DocumentationFooter';

export const ROICalculator: React.FC = () => {
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 text-sm">
        <Link to="/docs" className="text-blue-600 hover:underline">Documentation</Link>
        <span className="mx-2">/</span>
        <Link to="/docs" className="text-blue-600 hover:underline">Sales</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">ROI Calculator</span>
      </nav>

      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <Calculator className="mr-3 text-blue-600" size={32} />
          ProofPix ROI Calculator
        </h1>
        <p className="text-xl text-gray-600">
          Calculate your cost savings and return on investment with ProofPix
        </p>
      </div>

      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-green-600" size={24} />
            <span className="text-sm text-green-600 font-medium">Monthly Savings</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{formatCurrency(results.monthlySavings)}</div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-blue-600" size={24} />
            <span className="text-sm text-blue-600 font-medium">Annual Savings</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{formatCurrency(results.annualSavings)}</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Calculator className="text-purple-600" size={24} />
            <span className="text-sm text-purple-600 font-medium">ROI Percentage</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{results.roiPercentage.toFixed(0)}%</div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-orange-600" size={24} />
            <span className="text-sm text-orange-600 font-medium">Payback Period</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{results.paybackMonths.toFixed(1)} months</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Current Situation</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Images Processed
              </label>
              <input
                type="number"
                value={inputs.monthlyImages}
                onChange={(e) => handleInputChange('monthlyImages', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Number of images your organization processes monthly</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Monthly Server Costs
              </label>
              <input
                type="number"
                value={inputs.currentServerCosts}
                onChange={(e) => handleInputChange('currentServerCosts', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Monthly costs for servers, cloud infrastructure, and maintenance</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Size
              </label>
              <input
                type="number"
                value={inputs.teamSize}
                onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Number of team members who process images</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Compliance Audit Costs
              </label>
              <input
                type="number"
                value={inputs.complianceAuditCosts}
                onChange={(e) => handleInputChange('complianceAuditCosts', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Annual costs for compliance audits and certifications</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Data Breach Insurance
              </label>
              <input
                type="number"
                value={inputs.dataBreachInsurance}
                onChange={(e) => handleInputChange('dataBreachInsurance', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Annual premium for data breach insurance coverage</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Processing Time (seconds)
              </label>
              <input
                type="number"
                value={inputs.averageProcessingTime}
                onChange={(e) => handleInputChange('averageProcessingTime', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Current average time to process one image</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Hourly Rate ($)
              </label>
              <input
                type="number"
                value={inputs.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Average hourly cost for team members processing images</p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Cost Breakdown</h2>
            
            <div className="space-y-4">
              {costBreakdown.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <item.icon className="mr-2 text-gray-500" size={16} />
                      <span className="font-medium text-gray-900">{item.category}</span>
                    </div>
                    <span className="text-green-600 font-bold">{formatCurrency(item.savings)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current: {formatCurrency(item.current)}</span>
                    <span className="text-blue-600">ProofPix: {formatCurrency(item.proofpix)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Key Benefits</h2>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <benefit.icon className="mr-3 text-blue-500 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{benefit.description}</p>
                    <span className="text-sm font-medium text-blue-600">{benefit.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Timeline */}
      <section className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Timeline & Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-lg font-bold">1</div>
            <h3 className="font-semibold text-gray-900 mb-2">Day 1</h3>
            <p className="text-sm text-gray-600">Instant deployment and immediate cost savings begin</p>
          </div>
          <div className="text-center">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-lg font-bold">7</div>
            <h3 className="font-semibold text-gray-900 mb-2">Week 1</h3>
            <p className="text-sm text-gray-600">Team training complete, full productivity achieved</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-lg font-bold">30</div>
            <h3 className="font-semibold text-gray-900 mb-2">Month 1</h3>
            <p className="text-sm text-gray-600">First month savings: {formatCurrency(results.monthlySavings)}</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-lg font-bold">365</div>
            <h3 className="font-semibold text-gray-900 mb-2">Year 1</h3>
            <p className="text-sm text-gray-600">Total annual savings: {formatCurrency(results.annualSavings)}</p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mt-12 bg-white border rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Saving?</h2>
        <p className="text-gray-600 mb-6">
          See these savings in action with our enterprise demo environment
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/enterprise/demo" 
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Enterprise Demo
          </Link>
          <Link 
            to="/docs/sales-playbook" 
            className="inline-flex items-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Sales Materials
          </Link>
        </div>
      </section>

      {/* Footer navigation */}
      <nav className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link 
            to="/docs/sales-playbook" 
            className="flex items-center text-blue-600 hover:underline"
          >
            ← Previous: Sales Playbook
          </Link>
          <Link 
            to="/docs/customer-success-stories" 
            className="flex items-center text-blue-600 hover:underline"
          >
            Next: Customer Success Stories →
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </nav>

      <DocumentationFooter />
    </div>
  );
}; 