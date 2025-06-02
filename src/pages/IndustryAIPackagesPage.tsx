import React, { useState } from 'react';
import { ArrowRight, Check, Shield, Zap, Users, Building2, Scale, Heart, DollarSign, TrendingUp, Star, Crown } from 'lucide-react';
import { redirectToCheckout } from '../utils/stripe';

interface IndustryPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  industry: string;
  compliance: string[];
  features: string[];
  benefits: string[];
  roi: string;
  stripePriceId: string;
  icon: React.ComponentType<any>;
  color: string;
  popular?: boolean;
}

export const IndustryAIPackagesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const industryPackages: IndustryPackage[] = [
    {
      id: 'legal',
      name: 'Legal AI Package',
      price: 2999,
      description: 'Court-admissible document processing for law firms',
      industry: 'Legal',
      compliance: ['Court-Admissible Metadata', 'Chain of Custody', 'Legal Standards'],
      features: [
        'Legal document OCR with 99.9% accuracy',
        'Case file analysis and categorization',
        'Contract review and risk assessment',
        'Evidence chain management',
        'Court-admissible metadata extraction',
        'Legal precedent matching',
        'Compliance monitoring',
        'Secure client portal'
      ],
      benefits: [
        'Reduce document review time by 80%',
        'Ensure court admissibility',
        'Minimize legal risks',
        'Accelerate case preparation'
      ],
      roi: 'Save $50,000+ annually on document review costs',
      stripePriceId: 'price_1RVJ8CRwqAvTbIKumVT2tOjI',
      icon: Scale,
      color: 'blue',
      popular: true
    },
    {
      id: 'healthcare',
      name: 'Healthcare AI Package',
      price: 3999,
      description: 'HIPAA-compliant medical document processing',
      industry: 'Healthcare',
      compliance: ['HIPAA Compliant', 'PHI Protection', 'Medical Standards'],
      features: [
        'Medical record digitization',
        'Patient data extraction',
        'Diagnostic image analysis',
        'Insurance claim processing',
        'PHI protection and anonymization',
        'Medical coding assistance',
        'Treatment plan optimization',
        'Regulatory compliance monitoring'
      ],
      benefits: [
        'Improve patient care efficiency',
        'Reduce administrative burden',
        'Ensure HIPAA compliance',
        'Accelerate insurance processing'
      ],
      roi: 'Increase operational efficiency by 60%',
      stripePriceId: 'price_1RVJ8xRwqAvTbIKuXxTnoIuH',
      icon: Heart,
      color: 'red'
    },
    {
      id: 'financial',
      name: 'Financial AI Package',
      price: 4999,
      description: 'Advanced fraud detection for financial institutions',
      industry: 'Financial Services',
      compliance: ['SOX Compliant', 'PCI DSS', 'AML Regulations'],
      features: [
        'Real-time fraud detection',
        'Transaction analysis',
        'Risk assessment modeling',
        'AML compliance monitoring',
        'Document verification',
        'Identity authentication',
        'Regulatory reporting',
        'Suspicious activity detection'
      ],
      benefits: [
        'Prevent financial fraud',
        'Ensure regulatory compliance',
        'Reduce false positives by 70%',
        'Accelerate KYC processes'
      ],
      roi: 'Prevent $1M+ in fraud losses annually',
      stripePriceId: 'price_1RVJ8xRwqAvTbIKu3mHSSWR6',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'insurance',
      name: 'Insurance AI Package',
      price: 3499,
      description: 'Claims processing and fraud detection',
      industry: 'Insurance',
      compliance: ['Insurance Regulations', 'Claims Standards', 'Fraud Prevention'],
      features: [
        'Automated claims processing',
        'Damage assessment from images',
        'Fraud pattern detection',
        'Policy document analysis',
        'Risk evaluation',
        'Settlement recommendations',
        'Regulatory compliance',
        'Customer communication automation'
      ],
      benefits: [
        'Process claims 5x faster',
        'Reduce fraudulent claims',
        'Improve customer satisfaction',
        'Lower operational costs'
      ],
      roi: 'Reduce claims processing costs by 40%',
      stripePriceId: 'price_1RVJ8yRwqAvTbIKuoQnYUTvi',
      icon: Shield,
      color: 'purple'
    }
  ];

  const handleCheckout = async (pkg: IndustryPackage) => {
    setIsLoading(pkg.id);
    try {
      await redirectToCheckout(pkg.stripePriceId);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error starting checkout. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const renderPackageCard = (pkg: IndustryPackage) => (
    <div key={pkg.id} className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 ${
      pkg.popular ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
    } p-8 transform hover:scale-105 transition-all duration-300`}>
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${pkg.color}-100 dark:bg-${pkg.color}-900 mb-4`}>
          <pkg.icon className={`w-8 h-8 text-${pkg.color}-600`} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{pkg.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{pkg.description}</p>
        
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">${pkg.price.toLocaleString()}</span>
          <span className="text-gray-600 dark:text-gray-400 ml-2">/month</span>
        </div>

        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${pkg.color}-100 text-${pkg.color}-800 dark:bg-${pkg.color}-900 dark:text-${pkg.color}-200 mb-6`}>
          <Crown className="w-4 h-4 mr-1" />
          {pkg.industry} Specialist
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-500" />
            Compliance & Security
          </h4>
          <div className="flex flex-wrap gap-2">
            {pkg.compliance.map((item, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-500" />
            AI Features
          </h4>
          <ul className="space-y-2">
            {pkg.features.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
            {pkg.features.length > 4 && (
              <li className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                +{pkg.features.length - 4} more features
              </li>
            )}
          </ul>
        </div>

        <div className={`bg-${pkg.color}-50 dark:bg-${pkg.color}-900/20 rounded-lg p-4`}>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            ROI Impact
          </h4>
          <p className={`text-${pkg.color}-700 dark:text-${pkg.color}-300 font-medium`}>{pkg.roi}</p>
        </div>

        <button
          onClick={() => handleCheckout(pkg)}
          disabled={isLoading === pkg.id}
          className={`w-full bg-${pkg.color}-600 hover:bg-${pkg.color}-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center ${
            isLoading === pkg.id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-1'
          }`}
        >
          {isLoading === pkg.id ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Industry-Specific
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Packages</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Specialized AI solutions designed for your industry's unique challenges. 
              Court-admissible, compliant, and built for enterprise scale.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Industry Compliant
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Enterprise Ready
              </div>
              <div className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-purple-500" />
                Premium Support
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {industryPackages.map(renderPackageCard)}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Industry Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join leading organizations already using ProofPix AI to revolutionize their document processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors">
              Schedule Demo
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 