import React from 'react';
import TrustVerificationDashboard from '../components/TrustVerificationDashboard';
import { BackToHomeButton } from '../components/ui/BackToHomeButton';

export const TrustVerificationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <BackToHomeButton variant="minimal" />
            <h1 className="text-xl font-semibold text-gray-900">Trust Verification</h1>
            <div></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>
      
      <TrustVerificationDashboard />
    </div>
  );
};

export default TrustVerificationPage; 