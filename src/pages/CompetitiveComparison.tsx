import React, { useState } from 'react';
import { Check, X, Shield, Zap, DollarSign, Users, AlertTriangle, Star } from 'lucide-react';

interface CompetitorFeature {
  feature: string;
  proofpix: boolean | string;
  docusign: boolean | string;
  adobe: boolean | string;
  box: boolean | string;
  traditional: boolean | string;
  category: 'privacy' | 'features' | 'cost' | 'compliance' | 'usability';
}

const CompetitiveComparison: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const competitors = [
    { name: 'ProofPix', color: 'bg-blue-600', textColor: 'text-white' },
    { name: 'DocuSign AI', color: 'bg-gray-200', textColor: 'text-gray-700' },
    { name: 'Adobe Sign', color: 'bg-gray-200', textColor: 'text-gray-700' },
    { name: 'Box AI', color: 'bg-gray-200', textColor: 'text-gray-700' },
    { name: 'Traditional Tools', color: 'bg-gray-200', textColor: 'text-gray-700' }
  ];

  const features: CompetitorFeature[] = [
    // Privacy & Security
    {
      feature: 'Client-side processing (never uploads data)',
      proofpix: true,
      docusign: false,
      adobe: false,
      box: false,
      traditional: false,
      category: 'privacy'
    },
    {
      feature: 'Technically impossible to breach',
      proofpix: true,
      docusign: false,
      adobe: false,
      box: false,
      traditional: false,
      category: 'privacy'
    },
    {
      feature: 'Open source privacy verification',
      proofpix: true,
      docusign: false,
      adobe: false,
      box: false,
      traditional: false,
      category: 'privacy'
    },
    {
      feature: 'GDPR compliant by design',
      proofpix: true,
      docusign: 'Policy-based',
      adobe: 'Policy-based',
      box: 'Policy-based',
      traditional: 'Manual',
      category: 'compliance'
    },
    
    // Features & Capabilities
    {
      feature: 'Forensic-grade metadata extraction',
      proofpix: true,
      docusign: 'Basic',
      adobe: 'Basic',
      box: false,
      traditional: 'Manual',
      category: 'features'
    },
    {
      feature: 'Court-admissible reports',
      proofpix: true,
      docusign: false,
      adobe: false,
      box: false,
      traditional: 'Manual',
      category: 'features'
    },
    {
      feature: 'Real-time processing',
      proofpix: true,
      docusign: false,
      adobe: false,
      box: false,
      traditional: false,
      category: 'features'
    },
    {
      feature: 'Batch processing',
      proofpix: true,
      docusign: true,
      adobe: true,
      box: 'Limited',
      traditional: false,
      category: 'features'
    },
    {
      feature: 'API integration',
      proofpix: true,
      docusign: true,
      adobe: true,
      box: true,
      traditional: false,
      category: 'features'
    },
    
    // Cost & Value
    {
      feature: 'Monthly cost (Enterprise)',
      proofpix: '$299-899',
      docusign: '$10,000+',
      adobe: '$8,000+',
      box: '$5,000+',
      traditional: '$2,000+',
      category: 'cost'
    },
    {
      feature: 'Setup fees',
      proofpix: '$0',
      docusign: '$25,000+',
      adobe: '$15,000+',
      box: '$10,000+',
      traditional: '$5,000+',
      category: 'cost'
    },
    {
      feature: 'Training required',
      proofpix: '< 1 hour',
      docusign: '2-4 weeks',
      adobe: '1-3 weeks',
      box: '1-2 weeks',
      traditional: '4-8 weeks',
      category: 'usability'
    },
    
    // Compliance & Legal
    {
      feature: 'Chain of custody preservation',
      proofpix: true,
      docusign: 'Manual',
      adobe: 'Manual',
      box: false,
      traditional: 'Manual',
      category: 'compliance'
    },
    {
      feature: 'HIPAA compliance',
      proofpix: true,
      docusign: 'BAA required',
      adobe: 'BAA required',
      box: 'BAA required',
      traditional: 'Manual',
      category: 'compliance'
    },
    {
      feature: 'SOC 2 Type II',
      proofpix: true,
      docusign: true,
      adobe: true,
      box: true,
      traditional: false,
      category: 'compliance'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Features', icon: Star },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'features', name: 'Features', icon: Zap },
    { id: 'cost', name: 'Cost', icon: DollarSign },
    { id: 'compliance', name: 'Compliance', icon: AlertTriangle },
    { id: 'usability', name: 'Usability', icon: Users }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(f => f.category === activeCategory);

  const renderFeatureValue = (value: boolean | string, isProofPix: boolean = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className={`w-5 h-5 ${isProofPix ? 'text-white' : 'text-green-600'}`} />
      ) : (
        <X className={`w-5 h-5 ${isProofPix ? 'text-red-200' : 'text-red-500'}`} />
      );
    }
    return (
      <span className={`text-sm ${isProofPix ? 'text-white' : 'text-gray-700'} font-medium`}>
        {value}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            COMPETITIVE COMPARISON
          </div>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-6">
            Why ProofPix Beats Every Alternative
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            See how our privacy-first architecture delivers superior results at a fraction of the cost
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-4 p-4 bg-slate-50 border-b">
            <div className="font-semibold text-slate-900">Feature</div>
            {competitors.map((competitor, index) => (
              <div
                key={index}
                className={`text-center p-3 rounded-lg font-semibold ${competitor.color} ${competitor.textColor}`}
              >
                {competitor.name}
              </div>
            ))}
          </div>

          {/* Feature Rows */}
          {filteredFeatures.map((feature, index) => (
            <div
              key={index}
              className={`grid grid-cols-6 gap-4 p-4 border-b border-slate-100 ${
                index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
              }`}
            >
              <div className="font-medium text-slate-900 flex items-center">
                {feature.feature}
              </div>
              
              <div className="flex justify-center items-center bg-blue-600 text-white p-2 rounded">
                {renderFeatureValue(feature.proofpix, true)}
              </div>
              
              <div className="flex justify-center items-center">
                {renderFeatureValue(feature.docusign)}
              </div>
              
              <div className="flex justify-center items-center">
                {renderFeatureValue(feature.adobe)}
              </div>
              
              <div className="flex justify-center items-center">
                {renderFeatureValue(feature.box)}
              </div>
              
              <div className="flex justify-center items-center">
                {renderFeatureValue(feature.traditional)}
              </div>
            </div>
          ))}
        </div>

        {/* Key Advantages */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
              Unbreachable by Design
            </h3>
            <p className="text-slate-600 text-center">
              Our client-side processing makes data breaches technically impossible—not just policy promises, but architectural reality.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
              80% Cost Savings
            </h3>
            <p className="text-slate-600 text-center">
              Get enterprise-grade capabilities at a fraction of traditional costs. No setup fees, no lengthy implementations.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
              5-Minute Setup
            </h3>
            <p className="text-slate-600 text-center">
              Start analyzing photos immediately. No weeks of training, no complex integrations, no IT headaches.
            </p>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            What Customers Say About Switching
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-4 border-blue-600 pl-6">
              <p className="text-slate-600 mb-4 italic">
                "We were paying DocuSign $12,000/month and still worried about data breaches. ProofPix gives us better features for $599/month with zero breach risk. ROI was immediate."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">JM</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Jennifer Martinez</div>
                  <div className="text-sm text-slate-500">CTO, Regional Insurance Group</div>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-green-600 pl-6">
              <p className="text-slate-600 mb-4 italic">
                "Adobe's solution required 3 weeks of training and $25K setup. ProofPix had us analyzing evidence in 10 minutes. The court-ready reports are exactly what we needed."
              </p>
              <div className="flex items-center">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold">DT</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">David Thompson</div>
                  <div className="text-sm text-slate-500">Managing Partner, Thompson Law</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Switch to the Superior Solution?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 2,847 organizations that chose privacy, performance, and savings
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Start Free Trial—No Setup Required
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Competitive Demo
            </button>
          </div>
          
          <p className="text-sm text-blue-200 mt-4">
            See side-by-side comparison with your current solution
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveComparison; 