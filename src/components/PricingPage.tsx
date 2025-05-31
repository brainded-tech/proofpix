import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  Star, 
  Shield, 
  Building2, 
  Users, 
  Zap,
  Lock,
  Globe,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { EnterpriseLayout } from './ui/EnterpriseLayout';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying ProofPix and occasional photo analysis',
      price: { monthly: 0, annual: 0 },
      features: [
        'Analyze unlimited photos',
        'See all hidden photo information',
        'View GPS locations on maps',
        'Download basic reports',
        'Complete privacy protection',
        'Community support'
      ],
      limitations: [
        'One photo at a time',
        'Basic export options only',
        'No privacy removal tools'
      ],
      cta: 'Start Free Now',
      popular: false,
      color: 'slate'
    },
    {
      name: 'Professional',
      description: 'For professionals who need powerful tools and time-saving features',
      price: { monthly: 9, annual: 75 },
      features: [
        'Everything in Free',
        'Analyze up to 100 photos at once',
        'Professional PDF reports',
        'Export data as spreadsheets',
        'Remove hidden information from photos',
        'Priority email support',
        'Custom report templates',
        'Advanced GPS mapping'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: true,
      color: 'blue'
    },
    {
      name: 'Enterprise',
      description: 'For organizations that need custom solutions and dedicated support',
      price: { monthly: 'Custom', annual: 'Custom' },
      features: [
        'Everything in Professional',
        'Analyze unlimited photos simultaneously',
        'Custom branding with your logo',
        'Team management and user roles',
        'Advanced security controls',
        'Dedicated account manager',
        'Custom integrations and API access',
        'Service level agreements',
        'On-premise deployment options',
        'Court-ready forensic reports'
      ],
      limitations: [],
      cta: 'Get Custom Quote',
      popular: false,
      color: 'emerald'
    }
  ];

  const enterpriseFeatures = [
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Local processing ensures your photos never leave your device'
    },
    {
      icon: Building2,
      title: 'Custom Branding',
      description: 'White-label the interface with your organization\'s branding'
    },
    {
      icon: Users,
      title: 'Team Features',
      description: 'User management, shared templates, and team collaboration'
    },
    {
      icon: Zap,
      title: 'Batch Processing',
      description: 'Analyze hundreds of photos simultaneously with advanced tools'
    },
    {
      icon: Lock,
      title: 'Forensic Grade',
      description: 'Court-ready reports and chain of custody documentation'
    },
    {
      icon: Globe,
      title: 'Global Support',
      description: 'Dedicated support team with expertise in photo analysis'
    }
  ];

  const faqs = [
    {
      question: 'How does the free plan work?',
      answer: 'The free plan lets you analyze unlimited photos and see all their hidden information. Everything happens in your browser for complete privacy—no account required, no time limits, no catch.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Absolutely! Upgrade instantly to unlock more features, or downgrade at the end of your billing period. No contracts, no penalties—just flexibility when you need it.'
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: 'Yes! Try Professional features free for 14 days—no credit card required. Experience batch processing, professional reports, and priority support risk-free.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards and PayPal for instant access. Enterprise customers can use invoicing, purchase orders, and other business payment methods.'
    },
    {
      question: 'How does enterprise pricing work?',
      answer: 'Enterprise pricing is tailored to your needs—team size, usage volume, and required features. Contact our team for a personalized quote that fits your budget and requirements.'
    }
  ];

  const getColorClasses = (color: string, popular: boolean = false) => {
    const colors = {
      slate: {
        border: popular ? 'border-slate-300' : 'border-slate-200',
        button: 'bg-slate-600 hover:bg-slate-700 text-white',
        accent: 'text-slate-600'
      },
      blue: {
        border: popular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        accent: 'text-blue-600'
      },
      emerald: {
        border: popular ? 'border-emerald-300' : 'border-emerald-200',
        button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        accent: 'text-emerald-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.slate;
  };

  return (
    <EnterpriseLayout
      showHero
      title="Simple, Transparent Pricing"
      description="Choose the perfect plan for your photo metadata analysis needs. Start free, upgrade when you're ready."
      maxWidth="7xl"
    >
            {/* Billing Toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-slate-700 rounded-lg p-1 flex items-center">
                <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  Monthly
                </button>
                <button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'annual'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            Annual
            <span className="ml-2 bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded-full">
              Save 17%
                  </span>
                </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {plans.map((plan, index) => {
          const colorClasses = getColorClasses(plan.color, plan.popular);
              
              return (
                <div
              key={index}
              className={`relative bg-slate-800 rounded-2xl border-2 ${colorClasses.border} p-8 hover:shadow-lg transition-shadow`}
            >
              {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-100 mb-2">{plan.name}</h3>
                <p className="text-slate-300 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  {typeof plan.price[billingCycle] === 'number' ? (
                    <div>
                      <span className="text-4xl font-bold text-slate-100">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-slate-300 ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      {billingCycle === 'annual' && plan.price.annual > 0 && 
                       typeof plan.price.monthly === 'number' && typeof plan.price.annual === 'number' && (
                        <div className="text-sm text-emerald-400 mt-1">
                          Save ${(plan.price.monthly * 12) - plan.price.annual} per year
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-slate-100">
                      {plan.price[billingCycle]}
                    </div>
                  )}
                </div>

                  <button
                  onClick={() => {
                    if (plan.name === 'Enterprise') {
                      navigate('/enterprise');
                    } else if (plan.name === 'Professional') {
                      navigate('/enterprise/demo');
                    } else {
                      navigate('/');
                    }
                  }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${colorClasses.button}`}
                >
                  {plan.cta}
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-100 mb-4">What's included:</h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t border-slate-600">
                    <h5 className="font-medium text-slate-200 mb-3">Not included:</h5>
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start space-x-3">
                        <X className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-400">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
                </div>
              );
            })}
        </div>

      {/* Enterprise Features */}
      <section className="py-20 bg-slate-800 rounded-2xl mb-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built for organizations that need security, scalability, and compliance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                    </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
                    </div>
            ))}
                    </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/enterprise')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <span>Learn More About Enterprise</span>
              <ArrowRight className="w-5 h-5" />
            </button>
                      </div>
                  </div>
      </section>

      {/* Contact Sales CTA */}
      <section className="bg-slate-900 text-white rounded-2xl p-12 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Our team can work with you to create a tailored plan that fits your specific requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = 'mailto:sales@proofpix.com'}
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Email Sales</span>
            </button>
                  <button
              onClick={() => window.location.href = 'tel:+1-555-PROOFPIX'}
              className="border border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Schedule a Call</span>
                  </button>
          </div>
        </div>
      </section>

        {/* FAQ Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to know about our pricing and plans
              </p>
            </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <button
            onClick={() => navigate('/support')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact our support team →
          </button>
        </div>
      </section>
    </EnterpriseLayout>
  );
};

export default PricingPage; 