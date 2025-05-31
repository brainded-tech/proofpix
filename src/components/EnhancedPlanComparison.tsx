import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Info, Star, Zap, Shield, Users, ArrowRight, ChevronDown, ChevronUp, CheckCircle, TrendingUp, AlertCircle, Bell } from 'lucide-react';
import { pricingAnalytics } from '../utils/analytics';
import { useABTest } from '../utils/abTesting';
import { EnterpriseButton } from './ui/EnterpriseComponents';

interface PlanFeature {
  name: string;
  description?: string;
  included: boolean;
  highlight?: boolean;
  tooltip?: string;
  category?: string;
}

interface Plan {
  id: string;
  name: string;
  type: 'session' | 'subscription' | 'enterprise';
  price: {
    monthly: number;
    annual?: number;
  };
  popular?: boolean;
  recommended?: boolean;
  description: string;
  features: PlanFeature[];
  limits: {
    images?: number;
    users?: number;
    storage?: string;
    support?: string;
  };
  cta: string;
  badge?: string;
  color?: string;
}

interface FeatureCategory {
  id: string;
  name: string;
  description?: string;
  importance?: 'essential' | 'important' | 'nice-to-have';
}

interface EnhancedPlanComparisonProps {
  selectedPlans?: string[];
  onPlanSelect?: (planId: string) => void;
  onComparisonComplete?: (selectedPlan: string) => void;
  showAllFeatures?: boolean;
  highlightDifferences?: boolean;
  initialBillingCycle?: 'monthly' | 'annual';
  className?: string;
}

const EnhancedPlanComparison: React.FC<EnhancedPlanComparisonProps> = ({
  selectedPlans = [],
  onPlanSelect,
  onComparisonComplete,
  showAllFeatures = false,
  highlightDifferences = true,
  initialBillingCycle = 'monthly',
  className = ''
}) => {
  const [comparisonPlans, setComparisonPlans] = useState<string[]>(selectedPlans);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(initialBillingCycle);
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [comparisonStartTime] = useState(Date.now());
  const [expandedFeatureCategories, setExpandedFeatureCategories] = useState<string[]>(['core']);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState<boolean>(highlightDifferences);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [animatePlanSelection, setAnimatePlanSelection] = useState<string | null>(null);
  const comparatorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // A/B testing for comparison layout
  const comparisonTest = useABTest('plan_comparison_layout');
  const layoutVariant = comparisonTest.variant;

  useEffect(() => {
    // Track comparison tool usage
    pricingAnalytics.trackEvent('comparison_tool_opened', 'engagement', undefined, {
      initialPlans: selectedPlans,
      source: 'pricing_page',
      layoutVariant
    });

    // Handle click outside to close tooltip
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Feature categories for grouping features
  const featureCategories: FeatureCategory[] = [
    { id: 'core', name: 'Core Features', importance: 'essential' },
    { id: 'security', name: 'Security & Compliance', importance: 'important' },
    { id: 'collaboration', name: 'Team Collaboration', importance: 'important' },
    { id: 'integration', name: 'Integrations', importance: 'nice-to-have' },
    { id: 'support', name: 'Support & SLA', importance: 'important' },
    { id: 'advanced', name: 'Advanced Features', importance: 'nice-to-have' }
  ];

  const plans: Plan[] = [
    {
      id: 'day',
      name: 'Day Pass',
      type: 'session',
      price: { monthly: 2.99 },
      description: '24-hour access to all features',
      features: [
        { name: 'Full feature access', included: true, highlight: true, category: 'core' },
        { name: 'Unlimited processing', included: true, category: 'core' },
        { name: 'Export capabilities', included: true, category: 'core' },
        { name: 'Basic support', included: true, category: 'support' },
        { name: 'Team collaboration', included: false, category: 'collaboration' },
        { name: 'API access', included: false, category: 'integration' },
        { name: 'Advanced analytics', included: false, category: 'advanced' },
        { name: 'Priority support', included: false, category: 'support' }
      ],
      limits: {
        images: 1000,
        users: 1,
        storage: '1GB',
        support: 'Email'
      },
      cta: 'Get Day Pass',
      color: 'blue'
    },
    {
      id: 'week',
      name: 'Week Pass',
      type: 'session',
      price: { monthly: 9.99 },
      popular: true,
      badge: 'Most Popular',
      description: '7-day access to all features',
      features: [
        { name: 'Full feature access', included: true, highlight: true, category: 'core' },
        { name: 'Unlimited processing', included: true, category: 'core' },
        { name: 'Export capabilities', included: true, category: 'core' },
        { name: 'Priority support', included: true, category: 'support' },
        { name: 'Team collaboration', included: false, category: 'collaboration' },
        { name: 'API access', included: false, category: 'integration' },
        { name: 'Advanced analytics', included: false, category: 'advanced' },
        { name: 'Custom integrations', included: false, category: 'integration' }
      ],
      limits: {
        images: 10000,
        users: 1,
        storage: '5GB',
        support: 'Email + Chat'
      },
      cta: 'Get Week Pass',
      color: 'emerald'
    },
    {
      id: 'individual',
      name: 'Individual',
      type: 'subscription',
      price: { monthly: 19, annual: 190 },
      description: 'Perfect for personal use',
      features: [
        { name: 'Unlimited processing', included: true, highlight: true, category: 'core' },
        { name: 'All export formats', included: true, category: 'core' },
        { name: 'Priority support', included: true, category: 'support' },
        { name: 'Cloud storage', included: true, category: 'core' },
        { name: 'Team collaboration', included: false, category: 'collaboration' },
        { name: 'API access', included: false, category: 'integration' },
        { name: 'Advanced analytics', included: false, category: 'advanced' },
        { name: 'Custom integrations', included: false, category: 'integration' }
      ],
      limits: {
        users: 1,
        storage: '10GB',
        support: 'Email + Chat'
      },
      cta: 'Choose Individual',
      color: 'blue'
    },
    {
      id: 'professional',
      name: 'Professional',
      type: 'subscription',
      price: { monthly: 49, annual: 490 },
      recommended: true,
      badge: 'Recommended',
      description: 'Advanced features for professionals',
      features: [
        { name: 'Everything in Individual', included: true, category: 'core' },
        { name: 'Team collaboration', included: true, highlight: true, category: 'collaboration' },
        { name: 'API access', included: true, highlight: true, category: 'integration' },
        { name: 'Advanced analytics', included: true, category: 'advanced' },
        { name: 'Custom workflows', included: true, category: 'advanced' },
        { name: 'Priority support', included: true, category: 'support' },
        { name: 'Custom integrations', included: false, category: 'integration' },
        { name: 'Dedicated support', included: false, category: 'support' }
      ],
      limits: {
        users: 5,
        storage: '100GB',
        support: 'Email + Chat + Phone'
      },
      cta: 'Choose Professional',
      color: 'purple'
    },
    {
      id: 'business',
      name: 'Business',
      type: 'subscription',
      price: { monthly: 149, annual: 1490 },
      description: 'Full team collaboration',
      features: [
        { name: 'Everything in Professional', included: true, category: 'core' },
        { name: 'Unlimited users', included: true, highlight: true, category: 'collaboration' },
        { name: 'Advanced team management', included: true, category: 'collaboration' },
        { name: 'Custom integrations', included: true, category: 'integration' },
        { name: 'Advanced security', included: true, category: 'security' },
        { name: 'Dedicated support', included: true, category: 'support' },
        { name: 'SLA guarantees', included: true, category: 'support' },
        { name: 'On-premise deployment', included: false, category: 'security' }
      ],
      limits: {
        users: 25,
        storage: '1TB',
        support: 'Dedicated Manager'
      },
      cta: 'Choose Business',
      color: 'green'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      type: 'enterprise',
      price: { monthly: 499 },
      description: 'Custom enterprise solutions',
      features: [
        { name: 'Everything in Business', included: true, category: 'core' },
        { name: 'Unlimited everything', included: true, highlight: true, category: 'core' },
        { name: 'On-premise deployment', included: true, category: 'security' },
        { name: 'Custom development', included: true, category: 'advanced' },
        { name: 'White-label options', included: true, category: 'advanced' },
        { name: 'Executive support', included: true, category: 'support' },
        { name: 'Custom SLAs', included: true, category: 'support' },
        { name: 'Strategic partnership', included: true, category: 'advanced' }
      ],
      limits: {
        users: 999999,
        storage: 'Unlimited',
        support: 'Executive Team'
      },
      cta: 'Contact Sales',
      color: 'indigo'
    }
  ];

  const handlePlanToggle = (planId: string) => {
    let newComparison: string[];
    
    if (comparisonPlans.includes(planId)) {
      newComparison = comparisonPlans.filter(id => id !== planId);
    } else {
      if (comparisonPlans.length >= 3) {
        // Replace the first plan if already comparing 3
        newComparison = [comparisonPlans[1], comparisonPlans[2], planId];
      } else {
        newComparison = [...comparisonPlans, planId];
      }
    }
    
    setComparisonPlans(newComparison);
    onPlanSelect?.(planId);
    
    // Track comparison changes
    comparisonTest.trackEvent('comparison_plan_toggled', undefined, {
      planId,
      action: comparisonPlans.includes(planId) ? 'removed' : 'added',
      currentComparison: newComparison,
      comparisonCount: newComparison.length
    });
  };

  const handlePlanSelect = (planId: string) => {
    const timeSpent = Date.now() - comparisonStartTime;
    
    setAnimatePlanSelection(planId);
    setSelectedRecommendation(planId);
    
    comparisonTest.trackEvent('comparison_plan_selected', undefined, {
      selectedPlan: planId,
      comparedPlans: comparisonPlans,
      timeSpent,
      billingCycle
    });
    
    // Delay the completion to allow for animation
    setTimeout(() => {
      onComparisonComplete?.(planId);
    }, 1000);
  };

  const handleFeatureHover = (featureName: string) => {
    setHighlightedFeature(featureName);
  };

  const handleFeatureMouseLeave = () => {
    setHighlightedFeature(null);
  };

  const handleToggleFeatureCategory = (categoryId: string) => {
    setExpandedFeatureCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
    
    comparisonTest.trackEvent('feature_category_toggled', undefined, {
      categoryId,
      action: expandedFeatureCategories.includes(categoryId) ? 'collapsed' : 'expanded'
    });
  };

  const handleTooltipToggle = (featureId: string) => {
    setShowTooltip(prev => prev === featureId ? null : featureId);
  };

  const handleDifferenceToggle = () => {
    setShowOnlyDifferences(!showOnlyDifferences);
    
    comparisonTest.trackEvent('difference_filter_toggled', undefined, {
      showOnlyDifferences: !showOnlyDifferences
    });
  };

  const handleBillingCycleChange = (cycle: 'monthly' | 'annual') => {
    setBillingCycle(cycle);
    
    comparisonTest.trackEvent('billing_cycle_changed', undefined, {
      from: billingCycle,
      to: cycle
    });
  };

  const getPrice = (plan: Plan) => {
    if (plan.type === 'subscription' && billingCycle === 'annual' && plan.price.annual) {
      return plan.price.annual;
    }
    return plan.price.monthly;
  };

  const getSavings = (plan: Plan) => {
    if (plan.type === 'subscription' && billingCycle === 'annual' && plan.price.annual) {
      const monthlyCost = plan.price.monthly * 12;
      const annualCost = plan.price.annual;
      return Math.round((monthlyCost - annualCost) / monthlyCost * 100);
    }
    return 0;
  };

  const getComparisonData = () => {
    return plans.filter(plan => comparisonPlans.includes(plan.id));
  };

  // Get the combined list of all features from the selected plans
  const getAllFeatures = () => {
    const selectedPlans = getComparisonData();
    const allFeatures = new Map<string, { name: string, category: string }>();
    
    selectedPlans.forEach(plan => {
      plan.features.forEach(feature => {
        if (!allFeatures.has(feature.name)) {
          allFeatures.set(feature.name, { 
            name: feature.name, 
            category: feature.category || 'core' 
          });
        }
      });
    });
    
    return Array.from(allFeatures.values());
  };

  // Check if a feature is included in a plan
  const isFeatureIncluded = (planId: string, featureName: string) => {
    const plan = plans.find(p => p.id === planId);
    return plan?.features.find(f => f.name === featureName)?.included || false;
  };

  // Check if a feature differs across selected plans
  const featureDiffers = (featureName: string) => {
    const selectedPlans = getComparisonData();
    if (selectedPlans.length <= 1) return false;
    
    const firstPlanIncluded = isFeatureIncluded(selectedPlans[0].id, featureName);
    return selectedPlans.some(plan => isFeatureIncluded(plan.id, featureName) !== firstPlanIncluded);
  };

  // Determine if a feature should be shown based on filter settings
  const shouldShowFeature = (featureName: string, categoryId: string) => {
    if (!expandedFeatureCategories.includes(categoryId)) return false;
    if (!showOnlyDifferences) return true;
    return featureDiffers(featureName);
  };

  // Render the feature comparison table
  const renderFeatureComparison = () => {
    const selectedPlans = getComparisonData();
    const allFeatures = getAllFeatures();
    const isComparing = selectedPlans.length > 0;
    
    if (!isComparing) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Select at least one plan to compare features</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto mt-8">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-1/4 text-left p-4 bg-gray-50">Features</th>
              {selectedPlans.map(plan => (
                <th 
                  key={plan.id}
                  className={`w-1/4 p-4 text-center ${
                    plan.recommended ? 'bg-purple-50' : 'bg-gray-50'
                  } ${animatePlanSelection === plan.id ? 'animate-pulse bg-green-100' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-lg">{plan.name}</span>
                    <span className="text-2xl font-bold mt-2">
                      ${getPrice(plan).toFixed(2)}
                      {plan.type === 'subscription' && (
                        <span className="text-sm font-normal text-gray-600">
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      )}
                    </span>
                    {billingCycle === 'annual' && getSavings(plan) > 0 && (
                      <span className="text-sm text-green-600 mt-1">
                        Save {getSavings(plan)}%
                      </span>
                    )}
                    <button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`mt-4 px-4 py-2 rounded-lg text-white ${
                        plan.color ? `bg-${plan.color}-600 hover:bg-${plan.color}-700` : 'bg-blue-600 hover:bg-blue-700'
                      } transition-colors w-full`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureCategories.map(category => {
              const categoryFeatures = allFeatures.filter(f => f.category === category.id);
              if (categoryFeatures.length === 0) return null;
              
              return (
                <React.Fragment key={category.id}>
                  <tr>
                    <td 
                      colSpan={selectedPlans.length + 1} 
                      className="bg-gray-100 p-3 cursor-pointer"
                      onClick={() => handleToggleFeatureCategory(category.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-800">{category.name}</div>
                        <div>
                          {expandedFeatureCategories.includes(category.id) ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {expandedFeatureCategories.includes(category.id) && 
                   categoryFeatures.map(feature => {
                    if (showOnlyDifferences && !featureDiffers(feature.name)) return null;
                    
                    return (
                      <tr 
                        key={feature.name}
                        className={`border-t border-gray-200 ${
                          highlightedFeature === feature.name ? 'bg-blue-50' : ''
                        }`}
                        onMouseEnter={() => handleFeatureHover(feature.name)}
                        onMouseLeave={handleFeatureMouseLeave}
                      >
                        <td className="p-4 relative">
                          <div className="flex items-center">
                            <span>{feature.name}</span>
                            <button 
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              onClick={() => handleTooltipToggle(feature.name)}
                            >
                              <Info size={14} />
                            </button>
                          </div>
                          {showTooltip === feature.name && (
                            <div 
                              ref={tooltipRef}
                              className="absolute z-10 left-0 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-64"
                            >
                              <h4 className="font-semibold mb-1">{feature.name}</h4>
                              <p className="text-sm text-gray-600">
                                {plans.find(p => p.features.find(f => f.name === feature.name && f.description))
                                      ?.features.find(f => f.name === feature.name)?.description || 
                                  'Detailed description coming soon.'}
                              </p>
                            </div>
                          )}
                        </td>
                        {selectedPlans.map(plan => {
                          const isIncluded = isFeatureIncluded(plan.id, feature.name);
                          const isPlanHighlighted = plan.features.find(f => f.name === feature.name)?.highlight;
                          
                          return (
                            <td 
                              key={`${plan.id}-${feature.name}`} 
                              className={`p-4 text-center ${
                                isPlanHighlighted ? 'bg-green-50' : ''
                              }`}
                            >
                              {isIncluded ? (
                                <div className="flex justify-center">
                                  <CheckCircle className="text-green-500" size={20} />
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <X className="text-gray-300" size={20} />
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Plan selector component
  const PlanSelector = () => (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h3 className="text-lg font-semibold mb-4">Select plans to compare</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {plans.map(plan => (
          <div 
            key={plan.id}
            className={`
              border rounded-lg p-4 text-center cursor-pointer transition-all
              ${comparisonPlans.includes(plan.id) 
                ? `border-2 ${plan.color ? `border-${plan.color}-500` : 'border-blue-500'} shadow-md` 
                : 'border-gray-200 hover:border-gray-400'
              }
            `}
            onClick={() => handlePlanToggle(plan.id)}
          >
            <div className="font-semibold mb-2">{plan.name}</div>
            <div className="text-sm text-gray-600">${plan.price.monthly}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Settings bar for comparison view
  const ComparisonSettings = () => (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex items-center mb-4 md:mb-0">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyDifferences}
            onChange={handleDifferenceToggle}
            className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-gray-700">Show only differences</span>
        </label>
      </div>
      
      {/* Billing cycle toggle */}
      <div className="flex items-center rounded-lg border border-gray-200 p-1">
        <button
          onClick={() => handleBillingCycleChange('monthly')}
          className={`px-4 py-1 rounded-md text-sm ${
            billingCycle === 'monthly' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => handleBillingCycleChange('annual')}
          className={`px-4 py-1 rounded-md text-sm ${
            billingCycle === 'annual' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Annual <span className="text-green-600 font-medium">Save 20%</span>
        </button>
      </div>
    </div>
  );

  // Recommendation section that appears after comparison
  const RecommendationSection = () => {
    if (!selectedRecommendation) return null;
    
    const recommendedPlan = plans.find(p => p.id === selectedRecommendation);
    if (!recommendedPlan) return null;
    
    return (
      <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200 animate-fadeIn">
        <div className="flex items-start">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {recommendedPlan.name} Plan Selected
            </h3>
            <p className="text-gray-600 mb-4">
              Great choice! The {recommendedPlan.name} plan gives you {recommendedPlan.description.toLowerCase()}.
            </p>
            <EnterpriseButton
              className={`${recommendedPlan.color ? `bg-${recommendedPlan.color}-600 hover:bg-${recommendedPlan.color}-700` : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              onClick={() => window.location.href = `/checkout?plan=${recommendedPlan.id}&cycle=${billingCycle}`}
            >
              Proceed to Checkout
            </EnterpriseButton>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={comparatorRef} className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare Plans</h2>
        <p className="text-gray-600">
          Select plans below to compare features and find the best option for your needs
        </p>
      </div>
      
      <PlanSelector />
      
      {comparisonPlans.length > 0 && (
        <>
          <ComparisonSettings />
          {renderFeatureComparison()}
        </>
      )}
      
      <RecommendationSection />
      
      {/* Usage hints */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Tip: Click on the info icon next to feature names to learn more</p>
      </div>
      
      {/* Limited time offer banner */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
        <Bell className="text-blue-600 mr-3 flex-shrink-0" size={20} />
        <div>
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Limited Time Offer:</span> Get 20% off annual plans plus 3 months free when you subscribe today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPlanComparison; 