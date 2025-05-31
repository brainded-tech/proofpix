import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Users, 
  Building2, 
  Crown, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  Calendar,
  Star,
  Shield,
  Globe,
  Settings,
  Eye,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

export const AIDrivenPricing: React.FC = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [currentCost, setCurrentCost] = useState('');
  const [teamSize, setTeamSize] = useState('');

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  const calculateROI = () => {
    const current = parseFloat(currentCost) || 0;
    const size = parseInt(teamSize) || 1;
    const proofPixCost = size <= 5 ? 49 : size <= 25 ? 149 : 499;
    const savings = Math.max(0, current - proofPixCost);
    return { savings, proofPixCost };
  };

  const sessionPasses = [
    {
      name: "Day Pass",
      price: "$2.99",
      duration: "24 hours",
      description: "Perfect for one-time projects",
      features: ["Unlimited processing", "All features included", "24-hour access"],
      cta: "Start Now",
      badge: "Try risk-free"
    },
    {
      name: "Week Pass", 
      price: "$9.99",
      duration: "7 days",
      description: "Great for short-term projects",
      features: ["Unlimited processing", "All features included", "7-day access", "Email support"],
      cta: "Start Now",
      badge: "Most flexible"
    },
    {
      name: "Month Pass",
      price: "$49.99", 
      duration: "30 days",
      description: "Extended project access",
      features: ["Unlimited processing", "All features included", "30-day access", "Priority support"],
      cta: "Start Now",
      badge: "Best value"
    }
  ];

  const subscriptionPlans = [
    {
      name: "Individual",
      price: isAnnual ? "$15" : "$19",
      period: "month",
      description: "For individual professionals",
      features: [
        "Single user account",
        "Unlimited processing", 
        "Basic API access",
        "Email support",
        "Privacy-first processing"
      ],
      cta: "Start Free Trial",
      popular: false,
      badge: "Save 10 hours/month"
    },
    {
      name: "Professional", 
      price: isAnnual ? "$39" : "$49",
      period: "month",
      description: "For growing teams",
      features: [
        "Up to 5 team members",
        "Unlimited processing",
        "Full API access (500 calls/mo)",
        "Priority support", 
        "Team collaboration",
        "Advanced analytics"
      ],
      cta: "Start Free Trial",
      popular: true,
      badge: "73% choose this plan"
    },
    {
      name: "Business",
      price: isAnnual ? "$119" : "$149", 
      period: "month",
      description: "For established businesses",
      features: [
        "Up to 25 team members",
        "Unlimited processing",
        "Full API access (5K calls/mo)",
        "Business support",
        "SSO integration",
        "Custom branding",
        "Advanced security"
      ],
      cta: "Start Free Trial",
      popular: false,
      badge: "ROI in 45 days"
    }
  ];

  const enterprisePlan = {
    name: "Enterprise",
    price: "$499",
    period: "month", 
    description: "Advanced security & compliance",
    features: [
      "Up to 100 users",
      "Unlimited processing",
      "Unlimited API access",
      "Dedicated support",
      "White-label ready",
      "SOC 2 compliance",
      "Custom integrations",
      "On-premise deployment"
    ],
    cta: "Contact Sales",
    badge: "Zero server = Zero risk"
  };

  return (
    <EnterpriseLayout
      showHero
      title="ProofPix Pricing"
      description="Choose the perfect plan for your needs - from quick projects to enterprise solutions"
      maxWidth="7xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <EnterpriseButton
          variant="ghost"
          onClick={handleBackToDocs}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Documentation
        </EnterpriseButton>
      </EnterpriseSection>

      {/* Trust Signals */}
      <div className="text-center mb-12">
        <p className="text-lg text-slate-600 mb-4">
          Join 10,000+ professionals securing their photo metadata
        </p>
        <div className="flex justify-center items-center space-x-8 mb-6">
          <div className="text-sm text-slate-500">Law Firm Partners</div>
          <div className="text-sm text-slate-500">Insurance Companies</div>
          <div className="text-sm text-slate-500">Healthcare Systems</div>
        </div>
        <div className="flex justify-center items-center space-x-6 text-sm">
          <EnterpriseBadge variant="success" icon={<Shield className="enterprise-icon-sm" />}>SOC 2 Compliant</EnterpriseBadge>
          <EnterpriseBadge variant="primary" icon={<Shield className="enterprise-icon-sm" />}>HIPAA Ready</EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<Globe className="enterprise-icon-sm" />}>100% Client-Side</EnterpriseBadge>
        </div>
      </div>

      {/* Holiday Special Banner */}
      <EnterpriseCard className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-8">
        <div className="text-center py-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🎉 Holiday Special: 20% off annual plans</h3>
          <p className="text-blue-700">🔒 Lock in 2024 pricing - Rates increase January 1st</p>
        </div>
      </EnterpriseCard>

      {/* Three-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Column 1: Quick Access */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">🎫 NEED IT NOW?</h2>
            <p className="text-slate-600">Perfect for one-time projects</p>
          </div>
          
          <div className="space-y-4">
            {sessionPasses.map((pass, index) => (
              <EnterpriseCard key={index} className="relative">
                {pass.badge && (
                  <div className="absolute -top-3 left-4">
                    <EnterpriseBadge variant="primary">{pass.badge}</EnterpriseBadge>
                  </div>
                )}
                <div className="pt-2">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{pass.name}</h3>
                      <p className="text-sm text-slate-600">{pass.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{pass.price}</div>
                      <div className="text-sm text-slate-500">{pass.duration}</div>
              </div>
            </div>
                  
                  <ul className="space-y-2 mb-4">
                    {pass.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <EnterpriseButton className="w-full">
                    {pass.cta} <ArrowRight className="w-4 h-4 ml-2" />
                  </EnterpriseButton>
              </div>
              </EnterpriseCard>
            ))}
            </div>
              </div>

        {/* Column 2: Professional Plans */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">📊 MONTHLY SUBSCRIPTIONS</h2>
            <p className="text-slate-600">For regular professional use</p>
            
            {/* Annual/Monthly Toggle */}
            <div className="flex items-center justify-center mt-4 p-1 bg-slate-100 rounded-lg w-fit mx-auto">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Annual (20% off)
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {subscriptionPlans.map((plan, index) => (
              <EnterpriseCard key={index} className={`relative ${plan.popular ? 'border-2 border-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <EnterpriseBadge variant="primary" icon={<Star className="enterprise-icon-sm" />}>MOST POPULAR</EnterpriseBadge>
                  </div>
                )}
                {plan.badge && !plan.popular && (
                  <div className="absolute -top-3 left-4">
                    <EnterpriseBadge variant="success">{plan.badge}</EnterpriseBadge>
                  </div>
                )}
                
                <div className="pt-2">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                      <p className="text-sm text-slate-600">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{plan.price}</div>
                      <div className="text-sm text-slate-500">per {plan.period}</div>
          </div>
        </div>

                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
            </li>
                    ))}
          </ul>
                  
                  <EnterpriseButton 
                    className="w-full" 
                    variant={plan.popular ? "primary" : "secondary"}
                  >
                    {plan.cta}
                  </EnterpriseButton>
                </div>
              </EnterpriseCard>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <EnterpriseButton variant="ghost" onClick={() => navigate('/docs/features')}>
              View All Features <ArrowRight className="w-4 h-4 ml-2" />
            </EnterpriseButton>
          </div>
        </div>

        {/* Column 3: Enterprise */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">🏢 ENTERPRISE SOLUTIONS</h2>
            <p className="text-slate-600">Advanced security & compliance</p>
          </div>
          
          <EnterpriseCard className="border-2 border-purple-200">
            <div className="absolute -top-3 left-4">
              <EnterpriseBadge variant="neutral" icon={<Crown className="enterprise-icon-sm" />}>{enterprisePlan.badge}</EnterpriseBadge>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between items-start mb-3">
              <div>
                  <h3 className="text-lg font-semibold text-slate-900">{enterprisePlan.name}</h3>
                  <p className="text-sm text-slate-600">{enterprisePlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{enterprisePlan.price}</div>
                  <div className="text-sm text-slate-500">per {enterprisePlan.period}</div>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {enterprisePlan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                </ul>
              
              <EnterpriseButton className="w-full mb-3" variant="secondary">
                <Building2 className="w-4 h-4 mr-2" />
                {enterprisePlan.cta}
              </EnterpriseButton>
              
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Custom Pricing</p>
                <p className="text-xs text-slate-500">✓ Fortune 500 & Government</p>
              </div>
            </div>
          </EnterpriseCard>
          
          {/* Add-on Services */}
          <EnterpriseCard className="mt-6">
            <h3 className="font-semibold text-slate-900 mb-3">Add-on Services</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Priority Onboarding</span>
                <span className="font-medium">$2,500</span>
              </div>
              <div className="flex justify-between">
                <span>Compliance Audit Package</span>
                <span className="font-medium">$5,000</span>
              </div>
              <div className="flex justify-between">
                <span>Custom Training</span>
                <span className="font-medium">$1,500/day</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Security Review</span>
                <span className="font-medium">$10,000/year</span>
              </div>
            </div>
          </EnterpriseCard>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Plan Recommender */}
        <EnterpriseCard>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">💡 Not sure which plan?</h3>
          <p className="text-slate-600 mb-4">Answer 3 questions to get a recommendation:</p>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                How often do you process photos?
              </label>
              <select className="w-full p-2 border border-slate-300 rounded-md">
                <option>Occasionally</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Do you work with a team?
              </label>
              <select className="w-full p-2 border border-slate-300 rounded-md">
                <option>Just me</option>
                <option>Small team (2-5)</option>
                <option>Large team (5+)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Do you need compliance features?
              </label>
              <select className="w-full p-2 border border-slate-300 rounded-md">
                <option>No</option>
                <option>Basic compliance</option>
                <option>Full compliance</option>
              </select>
            </div>
          </div>
          <EnterpriseButton className="w-full">
            Get Recommendation
          </EnterpriseButton>
        </EnterpriseCard>

        {/* ROI Calculator */}
        <EnterpriseCard>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            <Calculator className="w-5 h-5 inline mr-2" />
            See Your Savings
          </h3>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current solution cost (monthly):
              </label>
              <input
                type="number"
                value={currentCost}
                onChange={(e) => setCurrentCost(e.target.value)}
                placeholder="$500"
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Team size:
              </label>
              <input
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="5"
                className="w-full p-2 border border-slate-300 rounded-md"
              />
            </div>
          </div>

          {currentCost && teamSize && (
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="text-lg font-semibold text-green-900">
                You'll save ${calculateROI().savings.toLocaleString()}/month
              </div>
              <div className="text-sm text-green-700">
                ProofPix cost: ${calculateROI().proofPixCost}/month
              </div>
            </div>
          )}
          
          <EnterpriseButton className="w-full" onClick={() => setShowROICalculator(true)}>
            Calculate Savings
          </EnterpriseButton>
        </EnterpriseCard>
          </div>

      {/* Feature Comparison Table */}
      <EnterpriseCard className="mb-12">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Feature</th>
                <th className="text-center py-3 px-4 font-medium text-slate-700">Session Passes</th>
                <th className="text-center py-3 px-4 font-medium text-slate-700">Individual</th>
                <th className="text-center py-3 px-4 font-medium text-slate-700">Professional</th>
                <th className="text-center py-3 px-4 font-medium text-slate-700">Business</th>
                <th className="text-center py-3 px-4 font-medium text-slate-700">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4">Processing</td>
                <td className="text-center py-3 px-4">Time-limited</td>
                <td className="text-center py-3 px-4">Unlimited</td>
                <td className="text-center py-3 px-4">Unlimited</td>
                <td className="text-center py-3 px-4">Unlimited</td>
                <td className="text-center py-3 px-4">Unlimited</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4">Team Members</td>
                <td className="text-center py-3 px-4">1</td>
                <td className="text-center py-3 px-4">1</td>
                <td className="text-center py-3 px-4">5</td>
                <td className="text-center py-3 px-4">25</td>
                <td className="text-center py-3 px-4">100+</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4">API Access</td>
                <td className="text-center py-3 px-4">❌</td>
                <td className="text-center py-3 px-4">❌</td>
                <td className="text-center py-3 px-4">✅ 500/mo</td>
                <td className="text-center py-3 px-4">✅ 5K/mo</td>
                <td className="text-center py-3 px-4">✅ Unlimited</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4">Custom Branding</td>
                <td className="text-center py-3 px-4">❌</td>
                <td className="text-center py-3 px-4">Logo</td>
                <td className="text-center py-3 px-4">Advanced</td>
                <td className="text-center py-3 px-4">Complete</td>
                <td className="text-center py-3 px-4">White-label</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Support</td>
                <td className="text-center py-3 px-4">Community</td>
                <td className="text-center py-3 px-4">Email</td>
                <td className="text-center py-3 px-4">Priority</td>
                <td className="text-center py-3 px-4">Business</td>
                <td className="text-center py-3 px-4">Dedicated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </EnterpriseCard>

      {/* FAQ Section */}
      <EnterpriseCard className="mb-12">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 rounded-lg">
              <span className="font-medium">Can I switch plans anytime?</span>
              <HelpCircle className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="p-4 text-slate-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </div>
          </details>
          
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 rounded-lg">
              <span className="font-medium">Is there a free trial?</span>
              <HelpCircle className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="p-4 text-slate-600">
              Yes, all subscription plans include a 14-day free trial. No credit card required.
            </div>
          </details>
          
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-50 rounded-lg">
              <span className="font-medium">What's included in the Enterprise plan?</span>
              <HelpCircle className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="p-4 text-slate-600">
              Enterprise includes unlimited users, white-label options, SOC 2 compliance, dedicated support, and custom integrations.
            </div>
          </details>
        </div>
      </EnterpriseCard>

      {/* Trust Signals */}
      <div className="text-center mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No credit card required for trial</p>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Cancel anytime, no questions asked</p>
          </div>
          <div className="text-center">
            <Globe className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Data export available always</p>
          </div>
          <div className="text-center">
            <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600">99.9% uptime SLA</p>
          </div>
        </div>
        </div>

      <DocumentationFooter />
    </EnterpriseLayout>
  );
}; 
 