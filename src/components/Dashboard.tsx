import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Scale, Shield, ArrowRight } from 'lucide-react';

export const DashboardAdvancedFeatures: React.FC = () => {
  const navigate = useNavigate();
  const userTier = localStorage.getItem('proofpix_user_tier') || 'free';

  return (
    <>
      {/* Advanced Features for Pro/Enterprise */}
      {(userTier === 'pro' || userTier === 'enterprise') && (
        <>
          {/* Multi-Signature Custody */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
               onClick={() => navigate('/chain-of-custody')}>
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                Collaborative
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Multi-Signature Custody
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Collaborative custody management with multiple required signatures for evidence handling
            </p>
            <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
              <span>Manage Signatures</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Legal Templates */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
               onClick={() => navigate('/chain-of-custody')}>
            <div className="flex items-center justify-between mb-4">
              <Scale className="w-8 h-8 text-blue-600" />
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                Court-Ready
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Legal Templates
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Generate court documents, affidavits, and expert reports with integrated chain of custody
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
              <span>Create Documents</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Compliance Monitor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
               onClick={() => navigate('/chain-of-custody')}>
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-green-600" />
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                Automated
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Compliance Monitor
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Real-time monitoring of FRE, FRCP, HIPAA, and SOX compliance with automated alerts
            </p>
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              <span>View Compliance</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </>
      )}
    </>
  );
}; 