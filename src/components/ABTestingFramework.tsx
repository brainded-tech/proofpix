import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Target, BarChart3, Zap } from 'lucide-react';

interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-100, percentage of traffic
  active: boolean;
}

interface ABTest {
  id: string;
  name: string;
  description: string;
  element: 'headline' | 'cta' | 'social_proof' | 'pricing' | 'hero_image' | 'testimonial';
  variants: ABTestVariant[];
  metrics: {
    impressions: number;
    conversions: number;
    conversionRate: number;
    confidence: number;
  }[];
  status: 'draft' | 'running' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  winner?: string;
}

interface ABTestConfig {
  headlines: {
    [key: string]: string[];
  };
  ctas: {
    [key: string]: {
      text: string;
      color: string;
      style: string;
    }[];
  };
  socialProof: {
    [key: string]: {
      type: 'customer_count' | 'testimonial' | 'case_study' | 'logo_wall';
      content: string;
    }[];
  };
  pricing: {
    [key: string]: {
      emphasis: 'monthly' | 'annual' | 'roi' | 'savings';
      presentation: 'card' | 'table' | 'comparison';
    }[];
  };
}

const ABTestingFramework: React.FC = () => {
  const [activeTests, setActiveTests] = useState<ABTest[]>([]);
  const [testConfig, setTestConfig] = useState<ABTestConfig>({
    headlines: {
      legal: [
        "Turn Every Photo Into Bulletproof Legal Evidence",
        "Court-Admissible Evidence Analysis in 5 Minutes",
        "Protect Client Privilege While Extracting Forensic Data",
        "The Only Evidence Analysis That Never Sees Your Data"
      ],
      insurance: [
        "Stop Fraud Before It Costs You Millions",
        "Detect Photo Manipulation Instantly—Save $3.2M Annually",
        "94% Fraud Detection Rate vs 27% Human Detection",
        "The Only Fraud Detection That Protects Your Data"
      ],
      healthcare: [
        "Patient Privacy Protection That Actually Works",
        "Automatic HIPAA Compliance—Zero Breach Risk",
        "Medical Photo Analysis Without Privacy Compromise",
        "The Only Healthcare Solution That Can't Be Breached"
      ],
      realestate: [
        "Close Deals Faster with Verified Property Photos",
        "Increase Commissions 23% with Property Verification",
        "Build Buyer Confidence with Authenticated Listings",
        "The Only Property Verification That Protects Your Data"
      ]
    },
    ctas: {
      primary: [
        { text: "Start Free Trial", color: "blue", style: "solid" },
        { text: "Try ProofPix Free", color: "blue", style: "solid" },
        { text: "Get Started—Free", color: "green", style: "solid" },
        { text: "Analyze Photos Now", color: "purple", style: "solid" }
      ],
      secondary: [
        { text: "See Demo", color: "gray", style: "outline" },
        { text: "Watch Demo", color: "gray", style: "outline" },
        { text: "Schedule Demo", color: "gray", style: "outline" },
        { text: "View Live Demo", color: "gray", style: "outline" }
      ]
    },
    socialProof: {
      legal: [
        { type: 'customer_count', content: "847 Law Firms Trust ProofPix" },
        { type: 'customer_count', content: "Used by 847+ Legal Professionals" },
        { type: 'testimonial', content: "Secured $2.3M settlement with ProofPix evidence" },
        { type: 'case_study', content: "Case dismissed—prosecution evidence proven manipulated" }
      ],
      insurance: [
        { type: 'customer_count', content: "312 Insurance Companies Trust ProofPix" },
        { type: 'customer_count', content: "Trusted by 312+ Insurance Professionals" },
        { type: 'testimonial', content: "Saved $847K by detecting timestamp manipulation" },
        { type: 'case_study', content: "68% reduction in fraudulent claims" }
      ],
      healthcare: [
        { type: 'customer_count', content: "89 Healthcare Systems Trust ProofPix" },
        { type: 'customer_count', content: "Used by 89+ Healthcare Organizations" },
        { type: 'testimonial', content: "Automatic HIPAA compliance—no more breach worry" },
        { type: 'case_study', content: "Zero breaches in 3+ years of operation" }
      ],
      realestate: [
        { type: 'customer_count', content: "1,247 Real Estate Professionals Trust ProofPix" },
        { type: 'customer_count', content: "Used by 1,247+ Real Estate Agents" },
        { type: 'testimonial', content: "Closed $2.8M luxury home 3 weeks early" },
        { type: 'case_study', content: "40% faster closings with verified photos" }
      ]
    },
    pricing: {
      legal: [
        { emphasis: 'monthly', presentation: 'card' },
        { emphasis: 'roi', presentation: 'card' },
        { emphasis: 'savings', presentation: 'comparison' },
        { emphasis: 'annual', presentation: 'table' }
      ],
      insurance: [
        { emphasis: 'roi', presentation: 'card' },
        { emphasis: 'savings', presentation: 'card' },
        { emphasis: 'monthly', presentation: 'comparison' },
        { emphasis: 'annual', presentation: 'table' }
      ],
      healthcare: [
        { emphasis: 'savings', presentation: 'card' },
        { emphasis: 'roi', presentation: 'card' },
        { emphasis: 'monthly', presentation: 'comparison' },
        { emphasis: 'annual', presentation: 'table' }
      ],
      realestate: [
        { emphasis: 'roi', presentation: 'card' },
        { emphasis: 'monthly', presentation: 'card' },
        { emphasis: 'savings', presentation: 'comparison' },
        { emphasis: 'annual', presentation: 'table' }
      ]
    }
  });

  // Sample active tests
  useEffect(() => {
    setActiveTests([
      {
        id: 'legal-headline-test-1',
        name: 'Legal Landing Page Headlines',
        description: 'Testing emotional vs rational headline approaches',
        element: 'headline',
        variants: [
          { id: 'control', name: 'Control: Bulletproof Evidence', weight: 50, active: true },
          { id: 'variant-a', name: 'Variant A: 5-Minute Analysis', weight: 50, active: true }
        ],
        metrics: [
          { impressions: 2847, conversions: 412, conversionRate: 14.5, confidence: 95 },
          { impressions: 2923, conversions: 467, conversionRate: 16.0, confidence: 97 }
        ],
        status: 'running',
        startDate: '2024-01-15',
        winner: 'variant-a'
      },
      {
        id: 'insurance-cta-test-1',
        name: 'Insurance CTA Optimization',
        description: 'Testing CTA button colors and text',
        element: 'cta',
        variants: [
          { id: 'control', name: 'Control: Blue "Start Free Trial"', weight: 33, active: true },
          { id: 'variant-a', name: 'Variant A: Green "Get Started"', weight: 33, active: true },
          { id: 'variant-b', name: 'Variant B: Purple "Analyze Now"', weight: 34, active: true }
        ],
        metrics: [
          { impressions: 1847, conversions: 287, conversionRate: 15.5, confidence: 89 },
          { impressions: 1923, conversions: 356, conversionRate: 18.5, confidence: 94 },
          { impressions: 1876, conversions: 301, conversionRate: 16.0, confidence: 91 }
        ],
        status: 'running',
        startDate: '2024-01-20'
      },
      {
        id: 'healthcare-social-proof-test-1',
        name: 'Healthcare Social Proof',
        description: 'Testing customer count vs testimonial effectiveness',
        element: 'social_proof',
        variants: [
          { id: 'control', name: 'Control: Customer Count', weight: 50, active: true },
          { id: 'variant-a', name: 'Variant A: HIPAA Testimonial', weight: 50, active: true }
        ],
        metrics: [
          { impressions: 1247, conversions: 187, conversionRate: 15.0, confidence: 88 },
          { impressions: 1298, conversions: 233, conversionRate: 17.9, confidence: 93 }
        ],
        status: 'running',
        startDate: '2024-01-18'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600';
    if (confidence >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWinnerIndicator = (test: ABTest, variantId: string) => {
    if (test.winner === variantId) {
      return <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Winner</span>;
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-slate-900">A/B Testing Dashboard</h1>
        </div>
        <p className="text-lg text-slate-600">
          Optimize conversion rates through systematic testing of headlines, CTAs, and social proof
        </p>
      </div>

      {/* Test Performance Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Active Tests</h3>
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">3</div>
          <div className="text-sm text-green-600">+1 from last week</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Avg Conversion Lift</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">+18.3%</div>
          <div className="text-sm text-green-600">vs control variants</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Total Impressions</h3>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">14.2K</div>
          <div className="text-sm text-blue-600">This month</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Revenue Impact</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">$847K</div>
          <div className="text-sm text-green-600">Additional ARR</div>
        </div>
      </div>

      {/* Active Tests */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Active Tests</h2>
        
        {activeTests.map((test) => (
          <div key={test.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{test.name}</h3>
                  <p className="text-slate-600">{test.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(test.status)}`}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </span>
                  <div className="text-sm text-slate-500">
                    Started: {test.startDate}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {test.variants.map((variant, index) => (
                  <div key={variant.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">
                        {variant.name}
                        {getWinnerIndicator(test, variant.id)}
                      </h4>
                      <span className="text-sm text-slate-500">{variant.weight}% traffic</span>
                    </div>
                    
                    {test.metrics[index] && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Impressions:</span>
                          <span className="font-medium">{test.metrics[index].impressions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Conversions:</span>
                          <span className="font-medium">{test.metrics[index].conversions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Conv. Rate:</span>
                          <span className="font-medium">{test.metrics[index].conversionRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Confidence:</span>
                          <span className={`font-medium ${getConfidenceColor(test.metrics[index].confidence)}`}>
                            {test.metrics[index].confidence}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Test Configuration */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Test Configuration Library</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Headlines */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Headline Variants</h3>
            {Object.entries(testConfig.headlines).map(([industry, headlines]) => (
              <div key={industry} className="mb-4">
                <h4 className="font-medium text-slate-700 mb-2 capitalize">{industry}</h4>
                <div className="space-y-2">
                  {headlines.map((headline, index) => (
                    <div key={index} className="text-sm text-slate-600 p-2 bg-slate-50 rounded">
                      {headline}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">CTA Variants</h3>
            {Object.entries(testConfig.ctas).map(([type, ctas]) => (
              <div key={type} className="mb-4">
                <h4 className="font-medium text-slate-700 mb-2 capitalize">{type}</h4>
                <div className="space-y-2">
                  {ctas.map((cta, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                      <span>{cta.text}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full bg-${cta.color}-500`}></span>
                        <span className="text-xs text-slate-500">{cta.style}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors p-4 rounded-lg text-left">
            <Zap className="w-6 h-6 mb-2" />
            <div className="font-semibold">Create New Test</div>
            <div className="text-sm opacity-90">Set up A/B test for any element</div>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors p-4 rounded-lg text-left">
            <BarChart3 className="w-6 h-6 mb-2" />
            <div className="font-semibold">View Analytics</div>
            <div className="text-sm opacity-90">Deep dive into test performance</div>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors p-4 rounded-lg text-left">
            <Target className="w-6 h-6 mb-2" />
            <div className="font-semibold">Implement Winners</div>
            <div className="text-sm opacity-90">Deploy winning variants site-wide</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ABTestingFramework; 