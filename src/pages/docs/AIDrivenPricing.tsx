import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Users, TrendingUp, DollarSign, Brain, Target, CheckCircle, ArrowRight } from 'lucide-react';

export const AIDrivenPricing: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 text-sm">
        <Link to="/docs" className="text-blue-600 hover:underline">Documentation</Link>
        <span className="mx-2">/</span>
        <Link to="/docs" className="text-blue-600 hover:underline">Enterprise</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">AI-Driven Pricing</span>
      </nav>

      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <Brain className="mr-3 text-blue-600" size={32} />
          AI-Driven Enterprise Pricing
        </h1>
        <p className="text-xl text-gray-600">
          Intelligent customer segmentation and instant pricing for enterprise sales acceleration
        </p>
      </div>

      {/* Table of contents */}
      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">On This Page</h2>
        <ul className="space-y-2">
          <li><a href="#hybrid-strategy" className="text-blue-600 hover:underline">Hybrid Pricing Strategy</a></li>
          <li><a href="#customer-segments" className="text-blue-600 hover:underline">Customer Segmentation</a></li>
          <li><a href="#pricing-tiers" className="text-blue-600 hover:underline">Pricing Tiers</a></li>
          <li><a href="#implementation" className="text-blue-600 hover:underline">Implementation Guide</a></li>
          <li><a href="#benefits" className="text-blue-600 hover:underline">Business Benefits</a></li>
        </ul>
      </nav>

      {/* Hybrid Pricing Strategy */}
      <section id="hybrid-strategy" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="mr-2 text-yellow-500" size={24} />
          Hybrid Pricing Strategy
        </h2>
        
        <p className="text-gray-700 mb-6">
          ProofPix uses intelligent customer segmentation to provide instant, accurate pricing based on 
          company characteristics, usage patterns, and AI-readiness assessment. Our hybrid approach 
          combines AI automation with human expertise for optimal conversion rates.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Customer Segments</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="mr-2 text-green-500" size={20} />
                <span className="font-semibold text-green-700">AI-Native (40%)</span>
              </div>
              <p className="text-sm text-gray-600">SMB, tech-forward, self-service ready</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="mr-2 text-blue-500" size={20} />
                <span className="font-semibold text-blue-700">AI-Assisted (35%)</span>
              </div>
              <p className="text-sm text-gray-600">Mid-market, needs validation</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="mr-2 text-purple-500" size={20} />
                <span className="font-semibold text-purple-700">Human-Led (25%)</span>
              </div>
              <p className="text-sm text-gray-600">Enterprise, complex requirements</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Key Benefits</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle className="mr-2 text-green-500" size={16} />
              <span>50% faster sales cycles</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 text-green-500" size={16} />
              <span>40% increase in sales productivity</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 text-green-500" size={16} />
              <span>25% higher conversion rates</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 text-green-500" size={16} />
              <span>Industry leadership positioning</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Customer Segmentation */}
      <section id="customer-segments" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Segmentation Details</h2>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-700 mb-4">AI-Native Segment (40%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Characteristics:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tech-forward companies</li>
                  <li>• Self-service preference</li>
                  <li>• Quick decision making</li>
                  <li>• API-first mindset</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sales Process:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Instant AI-generated quotes</li>
                  <li>• Self-service onboarding</li>
                  <li>• Automated contract generation</li>
                  <li>• Digital signature workflow</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">AI-Assisted Segment (35%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Characteristics:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Mid-market companies</li>
                  <li>• Need human validation</li>
                  <li>• Moderate tech adoption</li>
                  <li>• Budget approval processes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sales Process:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI-generated initial quote</li>
                  <li>• Human sales validation</li>
                  <li>• Guided demo sessions</li>
                  <li>• Assisted contract negotiation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">Human-Led Segment (25%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Characteristics:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Large enterprises</li>
                  <li>• Complex requirements</li>
                  <li>• Multiple stakeholders</li>
                  <li>• Compliance needs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sales Process:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI insights for sales team</li>
                  <li>• Custom solution design</li>
                  <li>• Executive presentations</li>
                  <li>• Enterprise contract negotiation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="pricing-tiers" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <DollarSign className="mr-2 text-green-500" size={24} />
          Pricing Tiers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Starter</h3>
            <div className="text-2xl font-bold text-green-600 mb-4">$599/month</div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Up to 5 users</li>
              <li>• 1,000 files/month</li>
              <li>• Basic templates</li>
              <li>• Email support</li>
            </ul>
            <div className="mt-4 text-xs text-gray-500">
              Psychological anchoring tier
            </div>
          </div>

          <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
              Most Popular
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional</h3>
            <div className="text-2xl font-bold text-blue-600 mb-4">$1,495/month</div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Up to 25 users</li>
              <li>• 10,000 files/month</li>
              <li>• Advanced templates</li>
              <li>• Priority support</li>
              <li>• API access</li>
            </ul>
            <div className="mt-4 text-xs text-gray-500">
              Sweet spot pricing
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium</h3>
            <div className="text-2xl font-bold text-purple-600 mb-4">$2,995/month</div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Up to 100 users</li>
              <li>• 50,000 files/month</li>
              <li>• Custom branding</li>
              <li>• Dedicated support</li>
              <li>• Advanced analytics</li>
            </ul>
            <div className="mt-4 text-xs text-gray-500">
              Optimized from $3,500
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
            <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
            <div className="text-2xl font-bold mb-4">Contact Sales</div>
            <ul className="text-sm space-y-2">
              <li>• Unlimited users</li>
              <li>• Unlimited files</li>
              <li>• White-label solution</li>
              <li>• 24/7 support</li>
              <li>• Custom integrations</li>
            </ul>
            <div className="mt-4 text-xs opacity-75">
              Fortune 500 companies
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section id="implementation" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Guide</h2>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Customer Segmentation Example</h3>
          <pre className="text-green-400 text-sm overflow-x-auto">
{`// AI-driven customer analysis
const analyzeCustomer = (demoData, companyInfo) => {
  const techScore = calculateTechReadiness(companyInfo);
  const sizeScore = calculateCompanySize(companyInfo);
  const urgencyScore = analyzeDemoUsage(demoData);
  
  if (techScore > 8 && sizeScore < 5) {
    return 'ai-native';
  } else if (techScore > 5 && sizeScore < 8) {
    return 'ai-assisted';
  } else {
    return 'human-led';
  }
};

// Generate instant pricing quote
const generateQuote = (segment, usage) => {
  const basePrice = getPricingTier(usage.estimatedVolume);
  const industryMultiplier = getIndustryMultiplier(usage.industry);
  const urgencyDiscount = calculateUrgencyDiscount(usage.timeline);
  
  return {
    basePrice,
    finalPrice: basePrice * industryMultiplier * urgencyDiscount,
    segment,
    confidence: calculateConfidence(usage),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
};`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Industry Multipliers</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Legal: 2.5x (high compliance needs)</li>
              <li>• Security: 3.0x (critical use cases)</li>
              <li>• Insurance: 2.0x (regulatory requirements)</li>
              <li>• Real Estate: 1.5x (standard workflows)</li>
              <li>• General Business: 1.0x (baseline)</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">AI Decision Factors</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Demo usage patterns</li>
              <li>• Company technology stack</li>
              <li>• Team size and structure</li>
              <li>• Industry and use case</li>
              <li>• Timeline and urgency</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section id="benefits" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Sales Team Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-green-700">
                <CheckCircle className="mr-2" size={16} />
                <span>Instant quote generation</span>
              </li>
              <li className="flex items-center text-green-700">
                <CheckCircle className="mr-2" size={16} />
                <span>Higher conversion rates</span>
              </li>
              <li className="flex items-center text-green-700">
                <CheckCircle className="mr-2" size={16} />
                <span>Reduced manual work</span>
              </li>
              <li className="flex items-center text-green-700">
                <CheckCircle className="mr-2" size={16} />
                <span>Better lead qualification</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Customer Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-blue-700">
                <CheckCircle className="mr-2" size={16} />
                <span>Transparent pricing</span>
              </li>
              <li className="flex items-center text-blue-700">
                <CheckCircle className="mr-2" size={16} />
                <span>Faster decision making</span>
              </li>
              <li className="flex items-center text-blue-700">
                <CheckCircle className="mr-2" size={16} />
                <span>Personalized experience</span>
              </li>
              <li className="flex items-center text-blue-700">
                <CheckCircle className="mr-2" size={16} />
                <span>Right-sized solutions</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer navigation */}
      <nav className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link 
            to="/docs/enterprise-api" 
            className="flex items-center text-blue-600 hover:underline"
          >
            ← Previous: Enterprise API Documentation
          </Link>
          <Link 
            to="/docs/custom-branding" 
            className="flex items-center text-blue-600 hover:underline"
          >
            Next: Custom Branding →
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </nav>
    </div>
  );
}; 