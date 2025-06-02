import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { submitEnterpriseContactForm, EnterpriseContactFormData } from '../services/enterpriseApi';

// Form validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  industry: z.enum([
    'legal',
    'insurance',
    'healthcare',
    'government',
    'enterprise',
    'other'
  ], {
    required_error: 'Please select an industry',
  }),
  employeeCount: z.enum([
    '1-50',
    '51-200',
    '201-1000',
    '1001-5000',
    '5000+'
  ], {
    required_error: 'Please select company size',
  }),
  message: z.string().min(10, 'Please provide more details about your needs'),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: 'You must accept the privacy policy',
  }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const EnterpriseContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Send data to the API service
      const response = await submitEnterpriseContactForm(data as EnterpriseContactFormData);
      
      if (response.success) {
        setSubmitSuccess(true);
        reset();
      } else {
        setErrorMessage(response.message || 'An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          Eliminate Your $2.3M Breach Risk—Free Consultation
        </h2>
        <p className="text-gray-600 mb-8">
          See how 500+ legal teams, insurance companies, and healthcare organizations eliminated data breach risks 
          while saving 80% on security costs. Get your custom ROI analysis in 15 minutes.
        </p>

        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
          >
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Your Custom ROI Analysis is On the Way!
            </h3>
            <p className="text-green-700">
              Our enterprise security team will contact you within 4 hours with your personalized breach risk assessment 
              and cost savings analysis. Check your email for immediate access to our security architecture guide.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
                {errorMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  {...register('firstName')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  {...register('lastName')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="john.doe@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  {...register('company')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Company Name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  {...register('jobTitle')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Role"
                />
                {errors.jobTitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  {...register('industry')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Industry</option>
                  <option value="legal">Legal</option>
                  <option value="insurance">Insurance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="government">Government</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="other">Other</option>
                </select>
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select
                  {...register('employeeCount')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Company Size</option>
                  <option value="1-50">1-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1001-5000">1001-5000 employees</option>
                  <option value="5000+">5000+ employees</option>
                </select>
                {errors.employeeCount && (
                  <p className="mt-1 text-sm text-red-600">{errors.employeeCount.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How can we help?
              </label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about your needs and use cases..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...register('privacyPolicy')}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm text-gray-600">
                  I agree to ProofPix's{' '}
                  <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800">
                    Privacy Policy
                  </a>
                </label>
                {errors.privacyPolicy && (
                  <p className="mt-1 text-sm text-red-600">{errors.privacyPolicy.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Get My Custom ROI Analysis—Free'
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default EnterpriseContactForm; 