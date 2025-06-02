import React, { useState } from 'react';
import { X, Building2, Users, Mail, Phone, Globe, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { stripeIntegrationService, EnterpriseSetupData } from '../../services/stripeIntegrationService';

interface EnterpriseContactFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: (setupData: any) => void;
}

export const EnterpriseContactForm: React.FC<EnterpriseContactFormProps> = ({
  isVisible,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupData, setSetupData] = useState<any>(null);

  const [formData, setFormData] = useState<EnterpriseSetupData>({
    companyName: '',
    contactEmail: '',
    estimatedUsers: 10,
    industry: '',
    requirements: [],
    customFeatures: []
  });

  const industries = [
    'Healthcare',
    'Financial Services',
    'Legal',
    'Insurance',
    'Real Estate',
    'Government',
    'Education',
    'Manufacturing',
    'Technology',
    'Other'
  ];

  const requirements = [
    'HIPAA Compliance',
    'SOC 2 Compliance',
    'GDPR Compliance',
    'Single Sign-On (SSO)',
    'Multi-Factor Authentication',
    'Custom Branding',
    'API Integration',
    'Dedicated Support',
    'On-Premise Deployment',
    'Custom Workflows'
  ];

  const handleInputChange = (field: keyof EnterpriseSetupData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRequirementToggle = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.includes(requirement)
        ? prev.requirements.filter(r => r !== requirement)
        : [...prev.requirements, requirement]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate enterprise setup process
      const result = await stripeIntegrationService.setupEnterpriseAccount(formData);
      
      setSetupData(result);
      setSetupComplete(true);
      onSuccess?.(result);
    } catch (error) {
      console.error('Error setting up enterprise account:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Company Information</h3>
        <p className="text-gray-600">Tell us about your organization</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Company Name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@company.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Select your industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Users
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={formData.estimatedUsers}
              onChange={(e) => handleInputChange('estimatedUsers', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value={10}>10-50 users</option>
              <option value={100}>50-100 users</option>
              <option value={500}>100-500 users</option>
              <option value={1000}>500-1000 users</option>
              <option value={5000}>1000+ users</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => setStep(2)}
          disabled={!formData.companyName || !formData.contactEmail}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Requirements & Features</h3>
        <p className="text-gray-600">Select the features and compliance requirements you need</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Compliance & Security Requirements
        </label>
        <div className="grid grid-cols-1 gap-3">
          {requirements.map(requirement => (
            <label
              key={requirement}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.requirements.includes(requirement)}
                onChange={() => handleRequirementToggle(requirement)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">{requirement}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Setup Enterprise Account
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Enterprise Account Setup Complete!
        </h3>
        <p className="text-gray-600">
          Your enterprise account has been configured with all requested features.
        </p>
      </div>

      {setupData && (
        <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4">
          <h4 className="font-semibold text-gray-900">Account Details:</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Account ID:</span>
              <span className="ml-2 font-mono text-gray-600">{setupData.accountId}</span>
            </div>
            <div>
              <span className="font-medium">API Keys:</span>
              <div className="ml-2 space-y-1">
                <div>
                  <span className="text-gray-500">Publishable:</span>
                  <span className="ml-2 font-mono text-xs text-gray-600">{setupData.apiKeys.publishable}</span>
                </div>
                <div>
                  <span className="text-gray-500">Secret:</span>
                  <span className="ml-2 font-mono text-xs text-gray-600">{setupData.apiKeys.secret.substring(0, 20)}...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => window.location.href = setupData?.setupUrl || '/enterprise/dashboard'}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
        >
          Access Enterprise Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={onClose}
          className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Enterprise Setup</h2>
                  <p className="text-gray-300">
                    {setupComplete ? 'Setup Complete' : `Step ${step} of 2`}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {setupComplete ? renderSuccess() : step === 1 ? renderStep1() : renderStep2()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 