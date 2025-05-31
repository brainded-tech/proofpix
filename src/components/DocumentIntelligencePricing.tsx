import React from 'react';
import { Check, Building2, Shield, Users, Zap } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  enterprise?: boolean;
}

const DocumentIntelligencePricing: React.FC = () => {
  const consumerTiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for personal use and small projects",
      features: [
        "5 images per day",
        "Basic EXIF extraction",
        "Privacy-first processing",
        "Standard export formats"
      ],
      cta: "Get Started Free"
    },
    {
      name: "Pro",
      price: "$19",
      description: "Enhanced features for professionals",
      features: [
        "Unlimited images",
        "Advanced metadata analysis",
        "Batch processing",
        "Priority support",
        "Custom export templates"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Business",
      price: "$29",
      description: "Team collaboration and advanced tools",
      features: [
        "Everything in Pro",
        "Team management",
        "API access",
        "Advanced analytics",
        "White-label options"
      ],
      cta: "Start Business Trial"
    }
  ];

  const enterpriseTiers: PricingTier[] = [
    {
      name: "Legal",
      price: "$299",
      description: "Court-ready documentation and evidence management",
      features: [
        "Court-ready documentation",
        "Chain of custody tracking",
        "Legal compliance framework",
        "Expert witness support",
        "24/7 enterprise support"
      ],
      cta: "Contact Legal Sales",
      enterprise: true
    },
    {
      name: "Insurance",
      price: "$599",
      description: "Claims verification and fraud detection",
      features: [
        "Claims verification tools",
        "Fraud detection algorithms",
        "Risk assessment reports",
        "Integration with claims systems",
        "Dedicated account manager"
      ],
      cta: "Contact Insurance Sales",
      enterprise: true
    },
    {
      name: "Real Estate",
      price: "$99",
      description: "Property documentation and verification",
      features: [
        "Property verification",
        "Listing authenticity",
        "MLS integration ready",
        "Bulk processing",
        "Real estate compliance"
      ],
      cta: "Contact Real Estate Sales",
      enterprise: true
    },
    {
      name: "Healthcare",
      price: "Custom",
      description: "HIPAA-compliant medical imaging analysis",
      features: [
        "HIPAA compliance",
        "Medical imaging support",
        "Secure cloud deployment",
        "Custom integration",
        "Regulatory support"
      ],
      cta: "Contact Healthcare Sales",
      enterprise: true
    }
  ];

  const PricingCard: React.FC<{ tier: PricingTier }> = ({ tier }) => (
    <div className={`relative bg-gray-800 rounded-lg p-6 ${tier.popular ? 'ring-2 ring-blue-500' : 'border border-gray-700'}`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
        <div className="mb-2">
          <span className="text-3xl font-bold text-white">{tier.price}</span>
          {tier.price !== "Custom" && tier.price !== "$0" && (
            <span className="text-gray-400">/month</span>
          )}
        </div>
        <p className="text-gray-400 text-sm">{tier.description}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
        tier.enterprise 
          ? 'bg-orange-600 hover:bg-orange-500 text-white'
          : tier.popular 
            ? 'bg-blue-600 hover:bg-blue-500 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
      }`}>
        {tier.cta}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Document Intelligence Platform
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Enterprise-grade metadata analysis with privacy-first architecture
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              500+ Enterprise Customers
            </div>
            <div className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-500" />
              Zero Data Breaches
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-500" />
              24/7 Enterprise Support
            </div>
          </div>
        </div>

        {/* Consumer Pricing */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Consumer & Professional Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {consumerTiers.map((tier, index) => (
              <PricingCard key={index} tier={tier} />
            ))}
          </div>
        </div>

        {/* Enterprise Pricing */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-4">Enterprise Industry Solutions</h2>
          <p className="text-center text-gray-400 mb-8">
            Industry-specific features with HIPAA/SOC 2/GDPR compliance
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterpriseTiers.map((tier, index) => (
              <PricingCard key={index} tier={tier} />
            ))}
          </div>
        </div>

        {/* Enterprise Features */}
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Why Choose ProofPix Enterprise?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Enterprise-Grade Security</h4>
              <p className="text-gray-400 text-sm">SOC 2, HIPAA, GDPR compliant with zero data breaches</p>
            </div>
            <div>
              <Zap className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Court-Ready Documentation</h4>
              <p className="text-gray-400 text-sm">Legally admissible reports with chain of custody</p>
            </div>
            <div>
              <Building2 className="h-12 w-12 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Privacy-First Architecture</h4>
              <p className="text-gray-400 text-sm">100% client-side processing, your data never leaves your device</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentIntelligencePricing;
export {};
