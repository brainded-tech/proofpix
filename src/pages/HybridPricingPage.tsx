/**
 * Hybrid Pricing Page - Revolutionary Mode-Based Pricing
 * Showcases the billion-dollar value proposition of choosing your architecture
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Crown, 
  Building2,
  CheckCircle, 
  Star,
  TrendingUp,
  Calculator,
  Zap,
  Lock,
  Eye,
  Globe,
  Award,
  ArrowRight,
  Play,
  Phone,
  Mail,
  Clock,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { 
  HYBRID_PRICING_PLANS, 
  HYBRID_ADD_ONS,
  HybridPricingPlan,
  calculateHybridSavings,
  getRecommendedPlan,
  formatHybridPrice,
  getComplianceScore
} from '../utils/hybridPricingPlans';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge 
} from '../components/ui/EnterpriseComponents';

interface PricingCalculatorState {
  industry: string;
  teamSize: number;
  needsPrivacy: boolean;
  needsCollaboration: boolean;
  complianceLevel: 'basic' | 'advanced' | 'enterprise';
  currentCost: number;
}

export const HybridPricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('hybrid_access');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorState, setCalculatorState] = useState<PricingCalculatorState>({
    industry: 'enterprise',
    teamSize: 10,
    needsPrivacy: true,
    needsCollaboration: true,
    complianceLevel: 'advanced',
    currentCost: 500
  });
  const [recommendedPlan, setRecommendedPlan] = useState<string>('hybrid_access');

  const plans = Object.values(HYBRID_PRICING_PLANS);

  useEffect(() => {
    const recommended = getRecommendedPlan({
      needsPrivacy: calculatorState.needsPrivacy,
      needsCollaboration: calculatorState.needsCollaboration,
      teamSize: calculatorState.teamSize,
      complianceLevel: calculatorState.complianceLevel
    });
    setRecommendedPlan(recommended);
  }, [calculatorState]);

  const getIconComponent = (iconName: string) => {
    const icons = {
      shield: Shield,
      users: Users,
      crown: Crown,
      building: Building2
    };
    return icons[iconName as keyof typeof icons] || Shield;
  };

  const calculateROI = (plan: HybridPricingPlan) => {
    const planCost = plan.price[billingCycle];
    const savings = calculatorState.currentCost - planCost;
    const roi = calculatorState.currentCost > 0 ? (savings / calculatorState.currentCost) * 100 : 0;
    return { savings, roi };
  };

  const PricingCard = ({ plan }: { plan: HybridPricingPlan }) => {
    const IconComponent = getIconComponent(plan.icon);
    const savings = calculateHybridSavings(plan, billingCycle);
    const { roi } = calculateROI(plan);
    const complianceScore = getComplianceScore(plan, calculatorState.industry);
    const isRecommended = plan.id === recommendedPlan;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
          isRecommended
            ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10 scale-105'
            : plan.popular
            ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10'
            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
        }`}
      >
        {/* Badge */}
        {(plan.badge || isRecommended) && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <EnterpriseBadge className={`${
              isRecommended ? 'bg-purple-600' : 'bg-blue-600'
            } text-white`}>
              {isRecommended ? 'Recommended for You' : plan.badge}
            </EnterpriseBadge>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${plan.color}-100 dark:bg-${plan.color}-900/20 mb-4`}>
            <IconComponent className={`w-8 h-8 text-${plan.color}-600 dark:text-${plan.color}-400`} />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-100 mb-2">{plan.name}</h3>
          <p className="text-slate-300 text-sm mb-4">{plan.description}</p>
          
          {/* Trust Score */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">
              {plan.trustScore}% Trust Score
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center mb-2">
            {plan.originalPrice && savings > 0 && (
              <span className="text-lg text-slate-400 line-through mr-2">
                ${plan.originalPrice[billingCycle]}
              </span>
            )}
            <span className="text-4xl font-bold text-slate-100">
              ${plan.price[billingCycle]}
            </span>
            <span className="text-slate-400 ml-1">
              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
            </span>
          </div>
          
          {savings > 0 && (
            <div className="inline-flex items-center bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium mb-2">
              Save {savings}%
            </div>
          )}

          {roi > 0 && (
            <div className="text-sm text-blue-400">
              {roi.toFixed(0)}% ROI vs current solution
            </div>
          )}
        </div>

        {/* Mode Indicators */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Architecture Modes</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Privacy Mode</span>
              {plan.modes.privacy ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-slate-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Collaboration Mode</span>
              {plan.modes.collaboration ? (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-slate-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Real-time Switching</span>
              {plan.modes.switching ? (
                <CheckCircle className="w-4 h-4 text-purple-500" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-slate-600" />
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Key Features</h4>
          <ul className="space-y-2">
            {plan.features.slice(0, 6).map((feature, index) => (
              <li key={index} className="flex items-start text-sm text-slate-300">
                <CheckCircle className={`w-4 h-4 text-${plan.color}-500 mr-2 mt-0.5 flex-shrink-0`} />
                {feature}
              </li>
            ))}
            {plan.features.length > 6 && (
              <li className="text-sm text-slate-400">
                +{plan.features.length - 6} more features
              </li>
            )}
          </ul>
        </div>

        {/* Compliance Score */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Compliance Score</span>
            <span className="text-sm font-medium text-slate-200">{complianceScore}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`bg-${plan.color}-500 h-2 rounded-full transition-all duration-300`}
              style={{ width: `${complianceScore}%` }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <EnterpriseButton
          onClick={() => {
            setSelectedPlan(plan.id);
            navigate(`/checkout?plan=${plan.id}&billing=${billingCycle}`);
          }}
          className={`w-full ${
            isRecommended
              ? 'bg-purple-600 hover:bg-purple-700'
              : `bg-${plan.color}-600 hover:bg-${plan.color}-700`
          }`}
        >
          {plan.price.monthly === 0 ? 'Start Free' : 'Start Free Trial'}
        </EnterpriseButton>

        {/* Contact Sales for Enterprise */}
        {plan.id === 'enterprise_hybrid' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/contact')}
              className="text-sm text-slate-400 hover:text-slate-300 underline"
            >
              Or contact sales for custom pricing
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const PricingCalculator = () => (
    <EnterpriseCard className="bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="text-center mb-8">
        <Calculator className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-100 mb-4">
          Find Your Perfect Architecture
        </h3>
        <p className="text-slate-300">
          Answer a few questions to get personalized recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Industry
          </label>
          <select
            value={calculatorState.industry}
            onChange={(e) => setCalculatorState(prev => ({ ...prev, industry: e.target.value }))}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
          >
            <option value="healthcare">Healthcare</option>
            <option value="finance">Financial Services</option>
            <option value="legal">Legal</option>
            <option value="government">Government</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Team Size
          </label>
          <input
            type="number"
            value={calculatorState.teamSize}
            onChange={(e) => setCalculatorState(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 0 }))}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
            placeholder="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Current Monthly Cost
          </label>
          <input
            type="number"
            value={calculatorState.currentCost}
            onChange={(e) => setCalculatorState(prev => ({ ...prev, currentCost: parseInt(e.target.value) || 0 }))}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
            placeholder="500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Compliance Level
          </label>
          <select
            value={calculatorState.complianceLevel}
            onChange={(e) => setCalculatorState(prev => ({ ...prev, complianceLevel: e.target.value as any }))}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
          >
            <option value="basic">Basic</option>
            <option value="advanced">Advanced</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="needsPrivacy"
            checked={calculatorState.needsPrivacy}
            onChange={(e) => setCalculatorState(prev => ({ ...prev, needsPrivacy: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
          />
          <label htmlFor="needsPrivacy" className="text-slate-300">
            Need maximum privacy (data never leaves device)
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="needsCollaboration"
            checked={calculatorState.needsCollaboration}
            onChange={(e) => setCalculatorState(prev => ({ ...prev, needsCollaboration: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
          />
          <label htmlFor="needsCollaboration" className="text-slate-300">
            Need team collaboration features
          </label>
        </div>
      </div>

      {recommendedPlan && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 text-center">
          <h4 className="text-lg font-semibold text-purple-400 mb-2">
            Recommended: {HYBRID_PRICING_PLANS[recommendedPlan].name}
          </h4>
          <p className="text-slate-300 mb-4">
            {HYBRID_PRICING_PLANS[recommendedPlan].description}
          </p>
          <EnterpriseButton
            onClick={() => {
              setSelectedPlan(recommendedPlan);
              setShowCalculator(false);
              document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            View Recommended Plan
          </EnterpriseButton>
        </div>
      )}
    </EnterpriseCard>
  );

  const ComparisonTable = () => (
    <EnterpriseCard>
      <h3 className="text-xl font-bold text-slate-100 mb-6 text-center">
        Architecture Mode Comparison
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left py-4 px-6 font-semibold text-slate-200">Feature</th>
              <th className="text-center py-4 px-6 font-semibold text-green-400">Privacy Mode</th>
              <th className="text-center py-4 px-6 font-semibold text-blue-400">Collaboration Mode</th>
              <th className="text-center py-4 px-6 font-semibold text-purple-400">Hybrid Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {[
              {
                feature: 'Data Location',
                privacy: 'Your device only',
                collaboration: 'Encrypted ephemeral server',
                hybrid: 'Your choice in real-time'
              },
              {
                feature: 'Server Communication',
                privacy: 'Zero communication',
                collaboration: 'AES-256 encrypted',
                hybrid: 'Mode-dependent'
              },
              {
                feature: 'Team Collaboration',
                privacy: '❌',
                collaboration: '✅ Full features',
                hybrid: '✅ When needed'
              },
              {
                feature: 'Compliance',
                privacy: 'Perfect GDPR/HIPAA',
                collaboration: 'Enterprise standards',
                hybrid: 'All standards supported'
              },
              {
                feature: 'Offline Capability',
                privacy: '✅ Full offline',
                collaboration: '❌ Requires internet',
                hybrid: '✅ Privacy mode offline'
              }
            ].map((row, index) => (
              <tr key={index} className="hover:bg-slate-800/50">
                <td className="py-4 px-6 font-medium text-slate-200">{row.feature}</td>
                <td className="py-4 px-6 text-center text-green-400">{row.privacy}</td>
                <td className="py-4 px-6 text-center text-blue-400">{row.collaboration}</td>
                <td className="py-4 px-6 text-center text-purple-400">{row.hybrid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EnterpriseCard>
  );

  return (
    <EnterpriseLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <EnterpriseBadge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-6">
                REVOLUTIONARY MODE-BASED PRICING
              </EnterpriseBadge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8">
                <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Pay for What You Choose
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                The world's first pricing model that lets you pay based on your architecture choice. 
                <span className="text-green-400 font-semibold"> Privacy-only</span>, 
                <span className="text-blue-400 font-semibold"> collaboration-only</span>, or 
                <span className="text-purple-400 font-semibold"> hybrid flexibility</span> - you decide.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                <EnterpriseButton
                  onClick={() => setShowCalculator(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Find My Perfect Plan
                </EnterpriseButton>
                
                <EnterpriseButton
                  onClick={() => navigate('/mode-comparison')}
                  variant="secondary"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4"
                >
                  <Play className="w-5 h-5 mr-2" />
                  See Architecture Demo
                </EnterpriseButton>
              </div>

              {/* Billing Toggle */}
              <div className="inline-flex items-center bg-slate-800 rounded-lg p-1 border border-slate-600">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === 'annual'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Annual <span className="text-green-400 ml-1">Save 17%</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Calculator */}
        {showCalculator && (
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <PricingCalculator />
            </div>
          </section>
        )}

        {/* Pricing Plans */}
        <section id="pricing-plans" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-slate-100 mb-6">
                Choose Your Architecture
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Revolutionary pricing that reflects the value of architectural choice
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <ComparisonTable />
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-slate-100 mb-6">
                Why Enterprises Choose ProofPix
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Unbreakable Security',
                  description: 'Privacy mode makes data breaches technically impossible',
                  stat: '100% Trust Score'
                },
                {
                  icon: Zap,
                  title: 'Instant Flexibility',
                  description: 'Switch between modes in real-time based on your needs',
                  stat: 'Real-time Switching'
                },
                {
                  icon: Award,
                  title: 'Compliance Ready',
                  description: 'Meet any regulatory requirement with the right mode',
                  stat: 'All Standards'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6"
                >
                  <item.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-slate-300 mb-4">{item.description}</p>
                  <div className="text-blue-400 font-semibold">{item.stat}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-100 mb-8">
                Ready to Choose Your Architecture?
              </h2>
              <p className="text-xl text-slate-300 mb-12">
                Start with a free trial and experience the power of architectural choice.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <EnterpriseButton
                  onClick={() => navigate('/enterprise/demo')}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-4"
                >
                  Start Free Trial
                </EnterpriseButton>
                
                <EnterpriseButton
                  onClick={() => navigate('/contact')}
                  variant="secondary"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Talk to Sales
                </EnterpriseButton>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </EnterpriseLayout>
  );
};

export default HybridPricingPage; 