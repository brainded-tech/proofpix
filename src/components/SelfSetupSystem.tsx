import React, { useState, useEffect } from 'react';
import { 
  User, 
  Key, 
  Mail, 
  Building, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Download,
  ExternalLink,
  Shield,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed' | 'error';
}

interface AccountDetails {
  email: string;
  companyName: string;
  firstName: string;
  lastName: string;
  phone: string;
  industry: string;
  packageType: string;
}

interface APICredentials {
  apiKey: string;
  secretKey: string;
  endpoint: string;
  webhookUrl: string;
}

interface SelfSetupSystemProps {
  packageType?: string;
  onComplete?: (credentials: APICredentials) => void;
  onCancel?: () => void;
}

const SelfSetupSystem: React.FC<SelfSetupSystemProps> = ({
  packageType = 'healthcare-ai',
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    email: '',
    companyName: '',
    firstName: '',
    lastName: '',
    phone: '',
    industry: '',
    packageType
  });
  const [credentials, setCredentials] = useState<APICredentials | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const steps: SetupStep[] = [
    {
      id: 'account',
      title: 'Account Information',
      description: 'Basic company and contact details',
      status: currentStep === 0 ? 'current' : currentStep > 0 ? 'completed' : 'pending'
    },
    {
      id: 'payment',
      title: 'Payment Setup',
      description: 'Billing information and plan selection',
      status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending'
    },
    {
      id: 'generation',
      title: 'API Generation',
      description: 'Generate secure API credentials',
      status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending'
    },
    {
      id: 'access',
      title: 'Instant Access',
      description: 'Download credentials and access dashboard',
      status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending'
    }
  ];

  const industries = [
    'Healthcare',
    'Legal Services',
    'Insurance',
    'Real Estate',
    'Financial Services',
    'Government',
    'Education',
    'Other'
  ];

  const packageDetails = {
    'healthcare-ai': {
      name: 'Healthcare AI Package',
      price: '$3,999/month',
      features: ['HIPAA Compliance', 'Medical Document AI', 'EHR Integration']
    },
    'legal-ai': {
      name: 'Legal AI Package',
      price: '$2,999/month',
      features: ['Legal Document Analysis', 'Contract Processing', 'Compliance Tools']
    },
    'insurance-ai': {
      name: 'Insurance AI Package',
      price: '$2,499/month',
      features: ['Claims Processing', 'Risk Assessment', 'Fraud Detection']
    }
  };

  const handleInputChange = (field: keyof AccountDetails, value: string) => {
    setAccountDetails(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(
          accountDetails.email &&
          accountDetails.companyName &&
          accountDetails.firstName &&
          accountDetails.lastName &&
          accountDetails.industry
        );
      case 1:
        return true; // Payment validation would happen here
      default:
        return true;
    }
  };

  const generateAPICredentials = async (): Promise<APICredentials> => {
    // Simulate API credential generation
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    
    return {
      apiKey: `pk_${packageType}_${timestamp}_${randomSuffix}`,
      secretKey: `sk_${packageType}_${timestamp}_${randomSuffix}`,
      endpoint: `https://api.proofpix.com/v1/${packageType}`,
      webhookUrl: `https://api.proofpix.com/webhooks/${timestamp}`
    };
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      setError('Please fill in all required fields');
      return;
    }

    if (currentStep === 2) {
      setIsProcessing(true);
      try {
        // Simulate account creation and API generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        const newCredentials = await generateAPICredentials();
        setCredentials(newCredentials);
        setCurrentStep(3);
      } catch (err) {
        setError('Failed to generate API credentials. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCredentials = () => {
    if (!credentials) return;

    const credentialsData = {
      ...credentials,
      accountDetails,
      setupDate: new Date().toISOString(),
      packageType: packageDetails[packageType as keyof typeof packageDetails]
    };

    const blob = new Blob([JSON.stringify(credentialsData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proofpix-${packageType}-credentials.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={accountDetails.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={accountDetails.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={accountDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={accountDetails.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Company Inc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={accountDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  value={accountDetails.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 1:
        const currentPackage = packageDetails[packageType as keyof typeof packageDetails];
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                {currentPackage?.name}
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {currentPackage?.price}
              </div>
              <ul className="space-y-2">
                {currentPackage?.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-blue-700">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">Payment Setup</span>
              </div>
              <p className="text-yellow-700 mt-2">
                For this demo, payment setup is simulated. In production, this would integrate with Stripe or your preferred payment processor.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Payment Method</span>
                </div>
                <span className="text-green-600 font-medium">Demo Mode</span>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Security Compliance</span>
                </div>
                <span className="text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Generating Your API Credentials
              </h3>
              <p className="text-gray-600">
                We're creating secure API keys and setting up your account access.
              </p>
            </div>

            {isProcessing && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">What we're setting up:</h4>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Secure API key generation
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Account provisioning
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Dashboard access setup
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Webhook configuration
                </li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Setup Complete!
              </h3>
              <p className="text-gray-600">
                Your account is ready and API credentials have been generated.
              </p>
            </div>

            {credentials && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">API Key</label>
                    <button
                      onClick={() => handleCopy(credentials.apiKey, 'apiKey')}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copiedField === 'apiKey' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <code className="block text-sm bg-white p-2 rounded border font-mono break-all">
                    {credentials.apiKey}
                  </code>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Secret Key</label>
                    <button
                      onClick={() => handleCopy(credentials.secretKey, 'secretKey')}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copiedField === 'secretKey' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <code className="block text-sm bg-white p-2 rounded border font-mono break-all">
                    {credentials.secretKey}
                  </code>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">API Endpoint</label>
                    <button
                      onClick={() => handleCopy(credentials.endpoint, 'endpoint')}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copiedField === 'endpoint' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <code className="block text-sm bg-white p-2 rounded border font-mono break-all">
                    {credentials.endpoint}
                  </code>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">Important</span>
              </div>
              <p className="text-yellow-700 mt-2">
                Save these credentials securely. The secret key will not be shown again.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={downloadCredentials}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Credentials
              </button>
              <button
                onClick={() => window.open('/dashboard', '_blank')}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Access Dashboard
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Self-Setup System</h2>
          <p className="text-blue-100">
            Get instant access to your {packageDetails[packageType as keyof typeof packageDetails]?.name}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step.status === 'completed' ? 'bg-green-500 text-white' :
                    step.status === 'current' ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'}
                `}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            {currentStep > 0 && currentStep < 3 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={handleNext}
                disabled={isProcessing || !validateStep(currentStep)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : currentStep === 2 ? 'Generate Credentials' : 'Next'}
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={() => onComplete?.(credentials!)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfSetupSystem; 