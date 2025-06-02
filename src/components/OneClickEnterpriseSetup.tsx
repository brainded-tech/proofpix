import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Zap, 
  Shield, 
  Users, 
  CheckCircle, 
  Loader2, 
  Key, 
  Mail, 
  ArrowRight,
  Copy,
  ExternalLink,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnterpriseLayout } from './ui/EnterpriseLayout';
import { EnterpriseButton } from './ui/EnterpriseComponents';
import { PRICING_PLANS } from '../utils/stripe';

interface EnterpriseSetupData {
  accountId: string;
  apiKey: string;
  secretKey: string;
  dashboardUrl: string;
  adminEmail: string;
  setupToken: string;
}

interface OneClickEnterpriseSetupProps {
  planType?: 'enterprise' | 'enterprise-plus' | 'custom';
  source?: string;
}

export const OneClickEnterpriseSetup: React.FC<OneClickEnterpriseSetupProps> = ({
  planType = 'enterprise',
  source = 'direct'
}) => {
  const [step, setStep] = useState<'selection' | 'processing' | 'complete' | 'error'>('selection');
  const [setupData, setSetupData] = useState<EnterpriseSetupData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [estimatedSetupTime, setEstimatedSetupTime] = useState(30);

  const enterprisePlans = {
    enterprise: {
      name: 'Hybrid Access',
      price: '$299/month',
      setupFee: '$0',
      features: [
        'Real-time mode switching',
        'Privacy + Collaboration modes',
        'Unlimited team members',
        'Advanced user controls',
        'Compliance dashboard',
        'Custom security policies',
        'Dedicated account manager',
        'API access included'
      ],
      setupTime: 30,
      stripePriceId: PRICING_PLANS.enterprise?.stripePriceId || 'price_hybrid_access_monthly'
    },
    'enterprise-plus': {
      name: 'Enterprise Hybrid',
      price: '$999/month',
      setupFee: '$0',
      features: [
        'Custom hybrid architecture',
        'Dedicated infrastructure',
        'Unlimited users and processing',
        'White-label capabilities',
        'Custom integrations',
        'On-premise deployment options',
        'SLA guarantees',
        '24/7 dedicated support'
      ],
      setupTime: 45,
      stripePriceId: PRICING_PLANS.custom?.stripePriceId || 'price_enterprise_hybrid_monthly'
    },
    custom: {
      name: 'Custom Enterprise',
      price: 'Custom pricing',
      setupFee: '$0',
      features: [
        'Everything in Enterprise Hybrid',
        'Custom development',
        'Dedicated infrastructure',
        'Compliance certifications',
        'Custom SLAs',
        'Dedicated account manager'
      ],
      setupTime: 60,
      stripePriceId: PRICING_PLANS.custom?.stripePriceId || 'price_enterprise_custom'
    }
  };

  const currentPlan = enterprisePlans[planType];

  useEffect(() => {
    setEstimatedSetupTime(currentPlan.setupTime);
  }, [planType, currentPlan.setupTime]);

  const generateEnterpriseAccount = async (): Promise<EnterpriseSetupData> => {
    // Simulate account generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const accountId = `ent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const apiKey = `pk_live_${Math.random().toString(36).substr(2, 32)}`;
    const secretKey = `sk_live_your_stripe_secret_key_here`;
    
    return {
      accountId,
      apiKey,
      secretKey,
      dashboardUrl: `https://enterprise.proofpixapp.com/dashboard/${accountId}`,
      adminEmail: 'admin@yourcompany.com', // Would be collected from form
      setupToken: Math.random().toString(36).substr(2, 16)
    };
  };

  const handleOneClickSetup = async () => {
    setStep('processing');
    setError(null);

    try {
      // Track the conversion
      if (window.gtag) {
        window.gtag('event', 'enterprise_one_click_setup', {
          event_category: 'conversion',
          event_label: planType,
          value: parseInt(currentPlan.price.replace(/[^0-9]/g, '')) || 499
        });
      }

      // Generate enterprise account
      const accountData = await generateEnterpriseAccount();
      
      // Create Stripe checkout session for enterprise plan
      const checkoutResponse = await fetch('/.netlify/functions/create-enterprise-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          accountId: accountData.accountId,
          features: selectedFeatures,
          source,
          successUrl: `${window.location.origin}/enterprise/welcome?account=${accountData.accountId}`,
          cancelUrl: `${window.location.origin}/enterprise`
        })
      });

      if (!checkoutResponse.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await checkoutResponse.json();
      
      // Store setup data for after payment
      sessionStorage.setItem('enterpriseSetupData', JSON.stringify(accountData));
      
      setSetupData(accountData);
      setStep('complete');

      // In production, redirect to Stripe checkout
      // For demo, we'll show the completion screen
      
    } catch (err) {
      console.error('Enterprise setup error:', err);
      setError(err instanceof Error ? err.message : 'Setup failed');
      setStep('error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const renderSelectionStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">
          Enterprise Setup in 60 Seconds
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Get instant access to your enterprise account with one click
        </p>
        
        <div className="inline-flex items-center bg-green-900/30 border border-green-500/30 rounded-lg px-4 py-2 text-green-300">
          <Zap className="w-4 h-4 mr-2" />
          <span className="text-sm">Instant setup • No waiting • Immediate access</span>
        </div>
      </div>

      {/* Plan Details */}
      <div className="bg-slate-800/50 border border-slate-600 rounded-2xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{currentPlan.name}</h3>
            <p className="text-slate-300">Everything you need for enterprise deployment</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{currentPlan.price}</div>
            <div className="text-sm text-green-400">Setup: {currentPlan.setupFee}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Included Features</h4>
            <div className="space-y-3">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">What You Get Instantly</h4>
            <div className="space-y-3">
              <div className="flex items-center text-slate-300">
                <Key className="w-5 h-5 text-blue-400 mr-3" />
                <span>API keys and credentials</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Building2 className="w-5 h-5 text-purple-400 mr-3" />
                <span>Enterprise dashboard access</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Users className="w-5 h-5 text-green-400 mr-3" />
                <span>User management portal</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Shield className="w-5 h-5 text-red-400 mr-3" />
                <span>Security configuration</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Mail className="w-5 h-5 text-yellow-400 mr-3" />
                <span>Setup instructions via email</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Time Estimate */}
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-5 h-5 text-blue-400 mr-3" />
            <span className="text-blue-300">Estimated setup time: {estimatedSetupTime} seconds</span>
          </div>
          <div className="text-blue-300 text-sm">
            Account provisioning + Payment processing
          </div>
        </div>
      </div>

      {/* One-Click Setup Button */}
      <div className="text-center">
        <EnterpriseButton
          onClick={handleOneClickSetup}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg"
        >
          <Zap className="w-5 h-5 mr-2" />
          Start Enterprise Setup Now
          <ArrowRight className="w-5 h-5 ml-2" />
        </EnterpriseButton>
        
        <p className="text-slate-400 text-sm mt-4">
          Secure payment • Instant access • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-6 animate-spin" />
      <h2 className="text-3xl font-bold text-white mb-4">Setting Up Your Enterprise Account</h2>
      <p className="text-slate-300 mb-8">
        We're provisioning your enterprise infrastructure and generating your credentials...
      </p>
      
      <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Creating enterprise account</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Generating API credentials</span>
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Setting up dashboard access</span>
            <div className="w-5 h-5 border-2 border-slate-600 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Configuring security settings</span>
            <div className="w-5 h-5 border-2 border-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Enterprise Account Ready!</h2>
        <p className="text-slate-300 mb-8">
          Your enterprise account has been created. Here are your credentials and next steps.
        </p>
      </div>

      {setupData && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Credentials */}
          <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Your Credentials
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Account ID</label>
                <div className="flex items-center bg-slate-900/50 rounded-lg p-3 mt-1">
                  <code className="text-green-400 flex-1 text-sm">{setupData.accountId}</code>
                  <button
                    onClick={() => copyToClipboard(setupData.accountId)}
                    className="text-slate-400 hover:text-white ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400">API Key</label>
                <div className="flex items-center bg-slate-900/50 rounded-lg p-3 mt-1">
                  <code className="text-blue-400 flex-1 text-sm">{setupData.apiKey}</code>
                  <button
                    onClick={() => copyToClipboard(setupData.apiKey)}
                    className="text-slate-400 hover:text-white ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400">Secret Key</label>
                <div className="flex items-center bg-slate-900/50 rounded-lg p-3 mt-1">
                  <code className="text-red-400 flex-1 text-sm">{setupData.secretKey}</code>
                  <button
                    onClick={() => copyToClipboard(setupData.secretKey)}
                    className="text-slate-400 hover:text-white ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <EnterpriseButton
                onClick={() => window.open(setupData.dashboardUrl, '_blank')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Open Enterprise Dashboard
                <ExternalLink className="w-4 h-4 ml-2" />
              </EnterpriseButton>

              <EnterpriseButton
                onClick={() => window.open('/docs/enterprise/getting-started', '_blank')}
                variant="secondary"
                className="w-full"
              >
                View Setup Documentation
              </EnterpriseButton>

              <EnterpriseButton
                onClick={() => window.open('/enterprise/support', '_blank')}
                variant="secondary"
                className="w-full"
              >
                Contact Enterprise Support
              </EnterpriseButton>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-green-300 mb-4">Next Steps</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start">
            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</div>
            <div>
              <div className="text-white font-medium">Check Your Email</div>
              <div className="text-green-200">Setup instructions sent to {setupData?.adminEmail}</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</div>
            <div>
              <div className="text-white font-medium">Configure Users</div>
              <div className="text-green-200">Add team members in the dashboard</div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</div>
            <div>
              <div className="text-white font-medium">Start Processing</div>
              <div className="text-green-200">Begin using your enterprise features</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderErrorStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="text-6xl mb-6">❌</div>
      <h2 className="text-3xl font-bold text-white mb-4">Setup Failed</h2>
      <p className="text-slate-300 mb-8">{error}</p>
      
      <div className="space-y-4">
        <EnterpriseButton
          onClick={() => setStep('selection')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Try Again
        </EnterpriseButton>
        
        <EnterpriseButton
          onClick={() => window.open('/enterprise/support', '_blank')}
          variant="secondary"
        >
          Contact Support
        </EnterpriseButton>
      </div>
    </div>
  );

  return (
    <EnterpriseLayout
      title="One-Click Enterprise Setup"
      description="Get your enterprise account ready in 60 seconds"
      maxWidth="6xl"
      backgroundColor="dark"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="py-12"
        >
          {step === 'selection' && renderSelectionStep()}
          {step === 'processing' && renderProcessingStep()}
          {step === 'complete' && renderCompleteStep()}
          {step === 'error' && renderErrorStep()}
        </motion.div>
      </AnimatePresence>
    </EnterpriseLayout>
  );
}; 