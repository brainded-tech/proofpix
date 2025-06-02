import React, { useState } from 'react';
import { 
  Brain, 
  Zap, 
  Shield, 
  Target, 
  TrendingUp, 
  Eye, 
  FileText, 
  Sparkles,
  Check,
  X,
  Star,
  Crown,
  Rocket,
  Bot,
  ChevronRight,
  AlertCircle,
  DollarSign,
  Users,
  Building2,
  Briefcase
} from 'lucide-react';
import { PRICING_PLANS, INDUSTRY_AI_PACKAGES, AI_TRAINING_PACKAGES, redirectToCheckout } from '../utils/stripe';

interface PricingFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
  tooltip?: string;
}

interface PricingTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  interval: string;
  description: string;
  features: PricingFeature[];
  aiCredits: number;
  popular?: boolean;
  badge?: string;
  color: string;
  icon: React.ComponentType<any>;
  stripePriceId: string;
}

export const AIEnhancedPricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedTier, setSelectedTier] = useState<string>('professional');
  const [showIndustryPackages, setShowIndustryPackages] = useState(false);
  const [showTrainingPackages, setShowTrainingPackages] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const pricingTiers: PricingTier[] = [
    {
      id: 'individual',
      name: 'Individual AI',
      price: 49,
      interval: 'month',
      description: 'Perfect for freelancers and solo professionals',
      features: [
        { name: 'AI-powered OCR', included: true, highlight: true },
        { name: 'Smart document classification', included: true },
        { name: 'Quality assessment', included: true },
        { name: 'Fraud detection', included: true },
        { name: '100 AI credits/month', included: true, highlight: true },
        { name: 'Email support', included: true },
        { name: 'API access', included: false },
        { name: 'Custom models', included: false }
      ],
      aiCredits: 100,
      color: 'blue',
      icon: Users,
      stripePriceId: 'price_1RVJ08RwqAvTbIKuWpD9T8TJ'
    },
    {
      id: 'professional',
      name: 'Professional AI',
      price: 149,
      interval: 'month',
      description: 'Advanced AI features for growing teams',
      features: [
        { name: 'Everything in Individual', included: true },
        { name: 'Advanced AI features', included: true, highlight: true },
        { name: 'Entity extraction', included: true },
        { name: 'Custom AI models', included: true, highlight: true },
        { name: 'Team collaboration', included: true },
        { name: '500 AI credits/month', included: true, highlight: true },
        { name: 'Priority support', included: true },
        { name: 'API access', included: true }
      ],
      aiCredits: 500,
      popular: true,
      badge: 'Most Popular',
      color: 'purple',
      icon: Users,
      stripePriceId: 'price_1RVJ0aRwqAvTbIKuDQ57QNkL'
    },
    {
      id: 'business',
      name: 'Business AI',
      price: 499,
      interval: 'month',
      description: 'Enterprise-grade AI for organizations',
      features: [
        { name: 'Everything in Professional', included: true },
        { name: 'Industry-specific models', included: true, highlight: true },
        { name: 'Compliance monitoring', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'SSO integration', included: true },
        { name: '2000 AI credits/month', included: true, highlight: true },
        { name: 'Dedicated support', included: true },
        { name: 'Custom integrations', included: true }
      ],
      aiCredits: 2000,
      color: 'green',
      icon: Building2,
      stripePriceId: 'price_1RVJ0bRwqAvTbIKuh4ABzpLt'
    },
    {
      id: 'enterprise',
      name: 'Enterprise AI',
      price: 1999,
      interval: 'month',
      description: 'Unlimited AI with custom development',
      features: [
        { name: 'Everything in Business', included: true },
        { name: 'Unlimited AI credits', included: true, highlight: true },
        { name: 'Custom development', included: true, highlight: true },
        { name: 'White-label solution', included: true },
        { name: 'Dedicated team', included: true },
        { name: 'On-premise deployment', included: true },
        { name: '24/7 support', included: true },
        { name: 'SLA guarantee', included: true }
      ],
      aiCredits: -1, // Unlimited
      badge: 'Enterprise',
      color: 'gold',
      icon: Crown,
      stripePriceId: 'price_1RVJ0cRwqAvTbIKuEniR6biz'
    }
  ];

  const getDiscountPercentage = (tier: PricingTier) => {
    if (!tier.originalPrice) return 0;
    return Math.round(((tier.originalPrice - tier.price) / tier.originalPrice) * 100);
  };

  const handleCheckout = async (tier: PricingTier) => {
    if (!tier.stripePriceId) {
      alert('This plan is not yet available. Please contact support.');
      return;
    }

    setIsLoading(tier.id);
    try {
      await redirectToCheckout(tier.stripePriceId);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error starting checkout. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const renderPricingCard = (tier: PricingTier) => (
    <div
      key={tier.id}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
        tier.popular 
          ? 'border-purple-500 shadow-lg scale-105' 
          : selectedTier === tier.id
          ? 'border-blue-500 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={() => setSelectedTier(tier.id)}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
            <Star className="w-4 h-4 mr-1" />
            {tier.badge}
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${tier.color}-100 dark:bg-${tier.color}-900/20 mb-4`}>
            <tier.icon className={`w-8 h-8 text-${tier.color}-600 dark:text-${tier.color}-400`} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {tier.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {tier.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center mb-2">
            {tier.originalPrice && tier.originalPrice !== tier.price && (
              <span className="text-lg text-gray-400 line-through mr-2">
                ${tier.originalPrice}
              </span>
            )}
            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              ${tier.price}
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">
              /{tier.interval}
            </span>
          </div>
          
          {billingCycle === 'yearly' && getDiscountPercentage(tier) > 0 && (
            <div className="inline-flex items-center bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
              Save {getDiscountPercentage(tier)}%
            </div>
          )}
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {tier.aiCredits === -1 ? 'Unlimited AI credits' : `${tier.aiCredits} AI credits/month`}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              {feature.included ? (
                <Check className={`w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0 ${feature.highlight ? 'text-purple-500' : ''}`} />
              ) : (
                <X className="w-5 h-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
              )}
              <span className={`text-sm ${
                feature.included 
                  ? feature.highlight 
                    ? 'text-purple-600 dark:text-purple-400 font-medium' 
                    : 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => handleCheckout(tier)}
          disabled={isLoading === tier.id}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            tier.popular
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'
          } ${isLoading === tier.id ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading === tier.id ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <>
              Get Started
              <ChevronRight className="w-4 h-4 ml-2 inline" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Bot className="w-4 h-4 mr-2" />
              AI-Powered Document Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              The World's First
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                Privacy-First AI Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Transform your document processing with AI that never sees your data. 
              Local processing meets enterprise intelligence.
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <Shield className="w-6 h-6 text-green-600 mr-3" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">100% Private Processing</span>
              </div>
              <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <Target className="w-6 h-6 text-blue-600 mr-3" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">95% AI Accuracy</span>
              </div>
              <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">80% Time Savings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm">
            <div className="flex items-center">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {pricingTiers.map(renderPricingCard)}
        </div>
      </div>

      {/* AI Premium Add-On */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Rocket className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold">AI Premium Add-On</h3>
              </div>
              <p className="text-lg mb-4">
                Supercharge any plan with unlimited AI processing and advanced features
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Unlimited AI credits
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Advanced machine learning models
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Real-time AI insights
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$999</div>
              <div className="text-lg opacity-90 mb-4">/month add-on</div>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Add to Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Industry-Specific Packages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Industry-Specific AI Packages
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Specialized AI models trained for your industry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(INDUSTRY_AI_PACKAGES).map(([key, pkg]) => (
            <div key={key} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {pkg.name}
              </h3>
              <div className="text-3xl font-bold text-purple-600 mb-4">
                ${pkg.price.toLocaleString()}/month
              </div>
              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Contact Sales
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom AI Training */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Custom AI Model Training
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Train AI models specifically for your documents and workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(AI_TRAINING_PACKAGES).map(([key, pkg]) => {
            const trainingPkg = pkg as any; // Type assertion for training packages
            return (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {trainingPkg.name}
                </h3>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-purple-600">
                    ${trainingPkg.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {trainingPkg.interval === 'one-time' ? 'One-time setup' : 'Setup fee'}
                  </div>
                  {trainingPkg.monthlyPrice && (
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                      + ${trainingPkg.monthlyPrice.toLocaleString()}/month
                    </div>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {trainingPkg.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROI Calculator CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Calculate Your ROI
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              See how much time and money you'll save with AI-powered document processing
            </p>
            <button className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors">
              Calculate Savings
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              How does local AI processing work?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI models run entirely on your device or private cloud, ensuring your sensitive documents never leave your control. This provides enterprise-grade security with cloud-level intelligence.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              What are AI credits and how do they work?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI credits are used for advanced AI operations like OCR, classification, and fraud detection. Each operation consumes credits based on complexity. Credits reset monthly with your subscription.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Can I train custom AI models for my specific documents?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes! Professional and higher plans include custom model training. We can train AI specifically for your document types, improving accuracy and adding specialized features for your workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 