import React, { useCallback } from 'react';
import { Lock, Crown, Zap, Star, Shield, X } from 'lucide-react';
import { analytics } from '../utils/analytics';
import SessionManager from '../utils/sessionManager';

interface PaymentProtectionProps {
  feature: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'modal' | 'inline' | 'overlay';
  showCurrentPlan?: boolean;
  onClose?: () => void;
}

const PaymentProtection: React.FC<PaymentProtectionProps> = ({
  feature,
  children,
  className = '',
  variant = 'inline',
  showCurrentPlan = true,
  onClose
}) => {
  const currentPlan = SessionManager.getCurrentPlan();
  const upgradeMessage = SessionManager.getUpgradeMessage(feature);

  const handleUpgradeClick = useCallback(() => {
    analytics.trackFeatureUsage('Payment Protection', `${feature} Upgrade Click`);
    window.location.href = '/pricing';
  }, [feature]);

  const getFeatureIcon = () => {
    switch (feature) {
      case 'batch': return <Zap className="h-8 w-8 text-blue-400" />;
      case 'advanced_export': return <Star className="h-8 w-8 text-purple-400" />;
      case 'unlimited_pdf': return <Crown className="h-8 w-8 text-yellow-400" />;
      case 'priority': return <Zap className="h-8 w-8 text-orange-400" />;
      case 'api_access': return <Shield className="h-8 w-8 text-green-400" />;
      case 'white_label': return <Crown className="h-8 w-8 text-yellow-400" />;
      default: return <Lock className="h-8 w-8 text-gray-400" />;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'modal':
        return 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
      case 'overlay':
        return 'absolute inset-0 bg-gray-900/95 flex items-center justify-center z-10';
      case 'inline':
      default:
        return 'bg-gray-800 rounded-lg p-6';
    }
  };

  const contentClasses = variant === 'modal' 
    ? 'bg-gray-800 rounded-xl p-8 max-w-md w-full'
    : '';

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      <div className={contentClasses}>
        {/* Close button for modal variant */}
        {variant === 'modal' && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        )}
        
        <div className="text-center">
          {/* Feature Icon */}
          <div className="bg-gray-700/50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            {getFeatureIcon()}
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-4">
            {upgradeMessage.title}
          </h2>
          
          {/* Description */}
          <p className="text-gray-300 mb-6">
            {upgradeMessage.description}
          </p>

          {/* Current Plan Info */}
          {showCurrentPlan && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-2">
                Current Plan: {currentPlan.plan?.name || 'Free'}
              </h3>
              <p className="text-gray-400 text-sm">
                {currentPlan.type === 'free' 
                  ? 'Limited features available' 
                  : currentPlan.type === 'session'
                    ? `Session expires: ${currentPlan.timeRemaining || 'Soon'}`
                    : 'Account subscription active'
                }
              </p>
            </div>
          )}

          {/* Upgrade Options */}
          <div className="space-y-3">
            <button
              onClick={handleUpgradeClick}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              <Crown className="h-5 w-5 mr-2" />
              Upgrade Now
            </button>
            
            <p className="text-xs text-gray-500">
              Minimum plan: {upgradeMessage.minPlan}
            </p>
          </div>

          {/* Additional Content */}
          {children && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProtection; 