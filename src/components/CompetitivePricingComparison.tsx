import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, X, Shield, Zap, Globe, DollarSign, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { EnterpriseButton } from './ui/EnterpriseComponents';
import { pricingAnalytics } from '../utils/analytics';

interface CompetitorData {
  id: string;
  name: string;
  logo?: string;
  description: string;
  pricing: {
    starter: number;
    professional: number;
    enterprise: string;
  };
  features: {
    clientSideProcessing: boolean;
    metadataExtraction: boolean;
    aiAnalysis: boolean;
    customBranding: boolean;
    privacyFocus: number; // 1-10 rating
    apiAccess: boolean;
    compliance: string[];
  };
  pros: string[];
  cons: string[];
}

interface ComparisonFeature {
  id: string;
  name: string;
  description: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  ourScore: number; // 1-10
  competitorAvgScore: number; // 1-10
  icon: React.ReactNode;
}

interface CompetitivePricingComparisonProps {
  highlightedPlan?: string;
  showAllCompetitors?: boolean;
  className?: string;
}

const CompetitivePricingComparison: React.FC<CompetitivePricingComparisonProps> = ({
  highlightedPlan = 'professional',
  showAllCompetitors = false,
  className = ''
}) => {
  const [selectedPlan, setSelectedPlan] = useState(highlightedPlan);
  const [showDetailedComparison, setShowDetailedComparison] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Track view
    pricingAnalytics.track({
      event: 'competitive_comparison_viewed',
      category: 'pricing',
      label: highlightedPlan
    });

    return () => clearTimeout(timer);
  }, [highlightedPlan]);

  const competitors: CompetitorData[] = [
    {
      id: 'competitor_a',
      name: 'MetaChecker',
      description: 'Server-based metadata extraction tool',
      pricing: {
        starter: 29,
        professional: 99,
        enterprise: 'Custom'
      },
      features: {
        clientSideProcessing: false,
        metadataExtraction: true,
        aiAnalysis: false,
        customBranding: false,
        privacyFocus: 4,
        apiAccess: true,
        compliance: ['GDPR']
      },
      pros: [
        'Established brand',
        'Good metadata extraction',
        'Basic API'
      ],
      cons: [
        'Uploads your photos to their servers',
        'Privacy concerns with cloud storage',
        'Limited export options',
        'Slow processing times'
      ]
    },
    {
      id: 'competitor_b',
      name: 'PhotoMeta Pro',
      description: 'Desktop-based metadata tool with limited features',
      pricing: {
        starter: 19.99,
        professional: 69,
        enterprise: '499+'
      },
      features: {
        clientSideProcessing: true,
        metadataExtraction: true,
        aiAnalysis: false,
        customBranding: true,
        privacyFocus: 7,
        apiAccess: false,
        compliance: []
      },
      pros: [
        'Desktop application',
        'One-time purchase option',
        'No internet required'
      ],
      cons: [
        'Limited to one device',
        'No cloud sync',
        'No team features',
        'Outdated interface'
      ]
    },
    {
      id: 'competitor_c',
      name: 'Veritas Imagery',
      description: 'Enterprise-focused image verification platform',
      pricing: {
        starter: 49,
        professional: 199,
        enterprise: '999+'
      },
      features: {
        clientSideProcessing: false,
        metadataExtraction: true,
        aiAnalysis: true,
        customBranding: true,
        privacyFocus: 6,
        apiAccess: true,
        compliance: ['GDPR', 'HIPAA', 'ISO27001']
      },
      pros: [
        'Advanced AI features',
        'Strong enterprise focus',
        'Good compliance certifications'
      ],
      cons: [
        'Very expensive',
        'Complex interface',
        'Server-side processing',
        'Long processing times'
      ]
    }
  ];

  const comparisonFeatures: ComparisonFeature[] = [
    {
      id: 'privacy',
      name: 'Privacy & Security',
      description: 'Processing photos without server uploads',
      importance: 'critical',
      ourScore: 10,
      competitorAvgScore: 5.7,
      icon: <Shield />
    },
    {
      id: 'speed',
      name: 'Processing Speed',
      description: 'Time to extract and analyze metadata',
      importance: 'high',
      ourScore: 9,
      competitorAvgScore: 6.3,
      icon: <Zap />
    },
    {
      id: 'cost',
      name: 'Cost Efficiency',
      description: 'Value for features provided',
      importance: 'high',
      ourScore: 9.5,
      competitorAvgScore: 5.8,
      icon: <DollarSign />
    },
    {
      id: 'compliance',
      name: 'Compliance & Standards',
      description: 'Meeting regulatory requirements',
      importance: 'high',
      ourScore: 9,
      competitorAvgScore: 7.2,
      icon: <Globe />
    },
    {
      id: 'reliability',
      name: 'Reliability',
      description: 'Consistent and accurate results',
      importance: 'critical',
      ourScore: 9.8,
      competitorAvgScore: 7.5,
      icon: <TrendingUp />
    }
  ];

  const getOurPrice = (planType: 'starter' | 'professional' | 'enterprise'): number | string => {
    switch (planType) {
      case 'starter':
        return 19;
      case 'professional':
        return 49;
      case 'enterprise':
        return 'From 499';
      default:
        return 0;
    }
  };

  const getCompetitorAvgPrice = (planType: 'starter' | 'professional' | 'enterprise'): number | string => {
    if (planType === 'enterprise') return 'Custom';
    
    const prices = competitors.map(c => c.pricing[planType]);
    const numericPrices = prices.filter(p => typeof p === 'number') as number[];
    const avg = numericPrices.reduce((sum, price) => sum + price, 0) / numericPrices.length;
    return Math.round(avg);
  };

  const getSavingsPercentage = (planType: 'starter' | 'professional'): number => {
    const ourPrice = getOurPrice(planType) as number;
    const avgPrice = getCompetitorAvgPrice(planType) as number;
    return Math.round(((avgPrice - ourPrice) / avgPrice) * 100);
  };

  const renderCompetitorComparison = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    const filtered = showAllCompetitors 
      ? competitors 
      : selectedCompetitor 
        ? competitors.filter(c => c.id === selectedCompetitor) 
        : competitors.slice(0, 2);

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">How We Compare</h3>
        
        {/* Competitor Selection */}
        {!selectedCompetitor && (
          <div className="flex flex-wrap gap-2 mb-4">
            {competitors.map(competitor => (
              <button
                key={competitor.id}
                className={`px-3 py-1 text-sm rounded-full border ${
                  filtered.some(c => c.id === competitor.id)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCompetitor(competitor.id)}
              >
                {competitor.name}
              </button>
            ))}
          </div>
        )}
        
        {/* Comparison Table */}
        <div className="overflow-x-auto bg-slate-700 rounded-lg border border-slate-600">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                  ProofPix
                </th>
                {filtered.map(competitor => (
                  <th 
                    key={competitor.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {competitor.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-slate-700 divide-y divide-slate-600">
              {/* Pricing Row */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Price
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600 bg-blue-50">
                  ${typeof getOurPrice(selectedPlan as any) === 'number' ? getOurPrice(selectedPlan as any) : getOurPrice(selectedPlan as any)}
                </td>
                {filtered.map(competitor => (
                  <td key={competitor.id} className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                    ${competitor.pricing[selectedPlan as keyof typeof competitor.pricing]}
                  </td>
                ))}
              </tr>
              
              {/* Feature Rows */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  Client-side Processing
                </td>
                <td className="px-6 py-4 whitespace-nowrap bg-blue-50">
                  <Check className="text-green-500" />
                </td>
                {filtered.map(competitor => (
                  <td key={competitor.id} className="px-6 py-4 whitespace-nowrap">
                    {competitor.features.clientSideProcessing ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  Privacy Rating
                </td>
                <td className="px-6 py-4 whitespace-nowrap bg-blue-50">
                  <div className="flex items-center">
                    <span className="font-semibold text-green-600">10/10</span>
                    <Shield className="text-green-500 ml-1" size={16} />
                  </div>
                </td>
                {filtered.map(competitor => (
                  <td key={competitor.id} className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${
                      competitor.features.privacyFocus > 7 ? 'text-green-600' : 
                      competitor.features.privacyFocus > 4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {competitor.features.privacyFocus}/10
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  Compliance Support
                </td>
                <td className="px-6 py-4 whitespace-nowrap bg-blue-50">
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">GDPR</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">HIPAA</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">SOC2</span>
                  </div>
                </td>
                {filtered.map(competitor => (
                  <td key={competitor.id} className="px-6 py-4 whitespace-nowrap">
                    {competitor.features.compliance.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {competitor.features.compliance.map(cert => (
                          <span key={cert} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {cert}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Limited</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  Processing Time
                </td>
                <td className="px-6 py-4 whitespace-nowrap bg-blue-50">
                  <div className="flex items-center">
                    <span className="font-semibold text-green-600">Instant</span>
                    <Zap className="text-green-500 ml-1" size={16} />
                  </div>
                </td>
                {filtered.map(competitor => (
                  <td key={competitor.id} className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {competitor.features.clientSideProcessing ? '< 5 seconds' : '30+ seconds'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Call to Action */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">
            See why ProofPix offers the best value for image verification and metadata extraction
          </p>
          <EnterpriseButton
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              pricingAnalytics.track({
                event: 'comparison_cta_clicked',
                category: 'conversion',
                label: selectedPlan
              });
              window.location.href = `/checkout?plan=${selectedPlan}`;
            }}
          >
            Try ProofPix {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
          </EnterpriseButton>
        </div>
      </div>
    );
  };

  const renderSavingsHighlight = () => {
    if (selectedPlan === 'enterprise') return null;
    
    const savingsPercentage = getSavingsPercentage(selectedPlan as 'starter' | 'professional');
    
    return (
      <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 flex items-start mb-6">
        <div className="bg-green-600/20 p-2 rounded-full mr-3">
          <DollarSign className="text-green-400" size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">Save up to {savingsPercentage}% vs. Competitors</h4>
          <p className="text-sm text-slate-300">
            ProofPix's {selectedPlan} plan costs ${getOurPrice(selectedPlan as any)} vs. the industry average of 
            ${getCompetitorAvgPrice(selectedPlan as any)} while providing superior privacy and security.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">How We Compare to the Competition</h2>
        <p className="text-slate-300">
          See how ProofPix provides superior value compared to other solutions
        </p>
      </div>
      
      {/* Plan selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
              selectedPlan === 'starter'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
            }`}
            onClick={() => setSelectedPlan('starter')}
          >
            Individual
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedPlan === 'professional'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
            }`}
            onClick={() => setSelectedPlan('professional')}
          >
            Professional
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
              selectedPlan === 'enterprise'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
            }`}
            onClick={() => setSelectedPlan('enterprise')}
          >
            Enterprise
          </button>
        </div>
      </div>
      
      {renderSavingsHighlight()}
      
      {/* Security Warning */}
      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 flex items-start mb-6">
        <div className="bg-yellow-600/20 p-2 rounded-full mr-3">
          <AlertTriangle className="text-yellow-400" size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">Why Server-Side Processing is a Risk</h4>
          <p className="text-sm text-slate-300">
            Most competitors upload your sensitive images to their servers, creating privacy and security 
            vulnerabilities. ProofPix processes everything client-side, keeping your data on your device.
          </p>
        </div>
      </div>
      
      {renderCompetitorComparison()}
      
      {/* Feature Score Comparison */}
      {showDetailedComparison && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Feature Comparison</h3>
          <div className="space-y-4">
            {comparisonFeatures.map(feature => (
              <div key={feature.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                  {feature.importance === 'critical' && (
                    <div className="ml-auto">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Critical
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium">ProofPix: {feature.ourScore}/10</span>
                    <span className="text-gray-600">Industry Avg: {feature.competitorAvgScore}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(feature.ourScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowDetailedComparison(!showDetailedComparison)}
          className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 text-blue-400 hover:text-blue-300 text-sm font-medium rounded-lg transition-all duration-200 backdrop-blur-sm"
        >
          {showDetailedComparison ? 'Show Less' : 'Show Detailed Comparison'}
        </button>
      </div>
    </div>
  );
};

export default CompetitivePricingComparison; 