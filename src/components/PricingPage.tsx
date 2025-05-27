import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap, Shield, Users, Crown } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { PRICING_PLANS, formatPrice, redirectToCheckout } from '../utils/stripe';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  const handleBackHome = () => {
    analytics.trackFeatureUsage('Navigation', 'Back to Home - Pricing');
    navigate('/');
  };

  const handleUpgrade = async (planId: string, priceId: string) => {
    if (planId === 'free') {
      handleBackHome();
      return;
    }

    // Enterprise plans should go to contact/enterprise page
    if (planId === 'enterprise') {
      analytics.trackFeatureUsage('Navigation', 'Enterprise Contact - Pricing');
      navigate('/enterprise');
      return;
    }

    setIsLoading(planId);
    analytics.trackFeatureUsage('Subscription', `Upgrade Attempt - ${planId}`);

    try {
      await redirectToCheckout(priceId);
    } catch (error) {
      console.error('Checkout error:', error);
      analytics.trackFeatureUsage('Error', `Checkout Failed - ${planId}`);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Shield className="h-8 w-8 text-blue-400" />;
      case 'daypass': return <Zap className="h-8 w-8 text-orange-400" />;
      case 'weekpass': return <Star className="h-8 w-8 text-orange-400" />;
      case 'starter': return <Star className="h-8 w-8 text-green-400" />;
      case 'pro': return <Zap className="h-8 w-8 text-purple-400" />;
      case 'teams': return <Users className="h-8 w-8 text-blue-400" />;
      case 'enterprise': return <Crown className="h-8 w-8 text-yellow-400" />;
      default: return <Shield className="h-8 w-8 text-blue-400" />;
    }
  };

  const plans = Object.values(PRICING_PLANS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <button
              onClick={handleBackHome}
              className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
            >
              ← Back to ProofPix
            </button>
            
            <h1 className="text-5xl font-bold text-white mb-6">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ProofPix</span> Plan
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose your privacy level: No-account passes for instant access, or accounts for ongoing subscriptions.
            </p>

            {/* Privacy Choice Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gray-800/50 rounded-full p-1 border border-gray-700">
                <span className="px-4 py-2 text-sm text-gray-300">
                  🚫 No Account Required
                </span>
                <span className="px-4 py-2 text-sm text-gray-500">•</span>
                <span className="px-4 py-2 text-sm text-gray-300">
                  📧 Account-Based
                </span>
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <div className="bg-gray-800/50 rounded-full p-1 border border-gray-700">
                <button
                  onClick={() => setBillingInterval('monthly')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    billingInterval === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingInterval('yearly')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    billingInterval === 'yearly'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Yearly
                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Session-Based Plans (No Account Required) */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">🚫 No Account Required</h2>
            <p className="text-gray-400">Instant access, maximum privacy</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {plans.filter(plan => !plan.accountRequired).map((plan) => {
              const isPopular = plan.popular || false;
              // Session-based plans are one-time payments, not affected by billing interval
              const displayPrice = plan.price;
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                    isPopular
                      ? 'border-purple-500 ring-2 ring-purple-500/20'
                      : 'border-gray-700 hover:border-orange-500/50'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Most Private
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      {getPlanIcon(plan.id)}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">
                        {formatPrice(displayPrice)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-400 ml-2">
                          /{plan.interval}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.sessionBased && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-xs text-green-300 text-center">
                        🚫 No account required • Session-based
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleUpgrade(plan.id, plan.stripePriceId || '')}
                    disabled={isLoading === plan.id}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                      plan.id === 'free'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                    } ${isLoading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading === plan.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : plan.id === 'free' ? (
                      'Current Plan'
                    ) : (
                      `Get ${plan.name}`
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Account-Based Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">📧 Account-Based Subscriptions</h2>
            <p className="text-gray-400">Ongoing access with usage tracking & support</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {plans.filter(plan => plan.accountRequired).map((plan) => {
              const isPopular = plan.popular || false;
              const yearlyPrice = billingInterval === 'yearly' ? ((plan.price as number) * 12 * 0.8) : (plan.price as number);
              const displayPrice = billingInterval === 'yearly' ? yearlyPrice : plan.price;
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                    isPopular
                      ? 'border-purple-500 ring-2 ring-purple-500/20'
                      : 'border-gray-700 hover:border-blue-500/50'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      {getPlanIcon(plan.id)}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">
                        {formatPrice(displayPrice)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-400 ml-2">
                          /{billingInterval === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>

                    {billingInterval === 'yearly' && plan.price > 0 && (
                      <div className="text-sm text-green-400 mb-4">
                        Save ${(((plan.price as number) * 12) - yearlyPrice).toFixed(2)} per year
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-300 text-center">
                      📧 Requires simple email signup
                    </p>
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan.id, plan.stripePriceId || '')}
                    disabled={isLoading === plan.id}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } ${isLoading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading === plan.id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : plan.id === 'enterprise' ? (
                      'Contact Sales'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                What's the difference between passes and subscriptions?
              </h3>
              <p className="text-gray-300">
                Passes (Day/Week) require no account - just pay and use immediately. Subscriptions need email signup but offer ongoing access and usage tracking.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                What about my photo privacy?
              </h3>
              <p className="text-gray-300">
                Your photos never leave your device regardless of plan. All processing happens locally in your browser. We only track usage limits, never photo content.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                How do session-based passes work?
              </h3>
              <p className="text-gray-300">
                Pay once, get instant access for the duration (24h or 7 days). No signup required - your access is stored locally in your browser.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Can I switch between plans?
              </h3>
              <p className="text-gray-300">
                Yes! You can buy passes anytime for immediate access, or upgrade to subscriptions for ongoing use. Each works independently.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-300">
                We offer a 30-day money-back guarantee for subscriptions. Passes are non-refundable due to their instant access nature.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Is my payment information secure?
              </h3>
              <p className="text-gray-300">
                Absolutely. We use Stripe for secure payment processing. We never store your payment information on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-8 text-gray-400">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>Trusted by Photographers</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              <span>Instant Activation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 