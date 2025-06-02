import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTestAuth } from './TestAuthProvider';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader, Shield, Users, Chrome, Briefcase } from 'lucide-react';

interface TestLoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

export const TestLoginForm: React.FC<TestLoginFormProps> = ({ 
  onSuccess, 
  redirectTo = '/dashboard',
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(true);
  
  const { login, loginWithOAuth, switchUser } = useTestAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or use default
  const from = (location.state as any)?.from?.pathname || redirectTo;

  const testAccounts = [
    { email: 'admin@proofpix.com', role: 'Admin', description: 'Full system access, all features' },
    { email: 'enterprise@proofpix.com', role: 'Enterprise', description: 'Enterprise features, AI tools, ROI dashboard' },
    { email: 'standard@proofpix.com', role: 'Standard', description: 'Standard features, limited AI access' },
    { email: 'free@proofpix.com', role: 'Free', description: 'Basic features, 10 files/month' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        onSuccess?.();
        navigate(from, { replace: true });
      } else {
        setErrors({ submit: result.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'microsoft') => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await loginWithOAuth(provider);
      
      if (result.success) {
        onSuccess?.();
        navigate(from, { replace: true });
      } else {
        setErrors({ submit: result.error || `${provider} login failed` });
      }
    } catch (error) {
      setErrors({ submit: 'OAuth login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (email: string) => {
    setFormData({ email, password: 'test123' });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ProofPix Login
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Test Environment - Enterprise Features
          </p>
        </div>

        {/* Test Credentials Panel */}
        {showTestCredentials && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Test Accounts
              </h3>
              <button
                onClick={() => setShowTestCredentials(false)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-xs"
              >
                Hide
              </button>
            </div>
            <div className="space-y-2">
              {testAccounts.map((account) => (
                <div key={account.email} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-blue-900 dark:text-blue-100">
                      {account.role}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      {account.email}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      {account.description}
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickLogin(account.email)}
                    className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Password for all accounts:</strong> test123
              </p>
            </div>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <Chrome className="h-5 w-5 mr-3 text-red-500" />
            Continue with Google (Test)
          </button>
          
          <button
            onClick={() => handleOAuthLogin('microsoft')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <Briefcase className="h-5 w-5 mr-3 text-blue-600" />
            Continue with Microsoft (Test)
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`
                  block w-full pl-10 pr-3 py-3 border rounded-lg
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
                  ${errors.email 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                `}
                placeholder="Enter your email"
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`
                  block w-full pl-10 pr-10 py-3 border rounded-lg
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
                  ${errors.password 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                  }
                `}
                placeholder="Enter your password"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full flex items-center justify-center px-4 py-3 border border-transparent
              text-sm font-medium rounded-lg text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-colors duration-200
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Test Environment Notice */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
            🧪 <strong>Test Environment</strong> - All Enterprise features enabled for testing
          </p>
        </div>
      </div>
    </div>
  );
}; 