import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Register Form */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Need help?{' '}
          <Link
            to="/support"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}; 