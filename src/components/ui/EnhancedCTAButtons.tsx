import React, { useState } from 'react';
import { ArrowRight, Zap, Building2, Clock, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { stripeIntegrationService, PricingPlan } from '../../services/stripeIntegrationService';

interface EnhancedCTAButtonsProps {
  plan?: PricingPlan;
  variant?: 'primary' | 'secondary' | 'enterprise' | 'trial';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showTrial?: boolean;
  onTrialStart?: (planId: string) => void;
  onEnterpriseContact?: () => void;
  className?: string;
}

export const EnhancedCTAButtons: React.FC<EnhancedCTAButtonsProps> = ({
  plan,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showTrial = true,
  onTrialStart,
  onEnterpriseContact,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleStartTrial = async (planId: string) => {
    if (!plan) return;
    
    setIsLoading(true);
    setLoadingAction('trial');
    
    try {
      const trialDays = stripeIntegrationService.getTrialPeriod(planId);
      
      if (trialDays > 0) {
        // Create checkout session with trial
        const session = await stripeIntegrationService.createCheckoutSession(
          planId,
          undefined,
          undefined,
          `${window.location.origin}/trial-started`,
          `${window.location.origin}/pricing`
        );
        
        // Redirect to checkout or handle trial start
        if (session.url.startsWith('http')) {
          window.location.href = session.url;
        } else {
          onTrialStart?.(planId);
        }
      } else {
        // No trial available, go directly to checkout
        await handleSubscribe(planId);
      }
    } catch (error) {
      console.error('Error starting trial:', error);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!plan) return;
    
    setIsLoading(true);
    setLoadingAction('subscribe');
    
    try {
      const session = await stripeIntegrationService.createCheckoutSession(
        planId,
        undefined,
        undefined,
        `${window.location.origin}/success`,
        `${window.location.origin}/pricing`
      );
      
      if (session.url.startsWith('http')) {
        window.location.href = session.url;
      } else {
        // Demo mode - redirect to demo checkout
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleEnterpriseSetup = async () => {
    setIsLoading(true);
    setLoadingAction('enterprise');
    
    try {
      // In a real implementation, this would open a form or redirect to enterprise setup
      onEnterpriseContact?.();
    } catch (error) {
      console.error('Error initiating enterprise setup:', error);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const getVariantClasses = (buttonVariant: string) => {
    switch (buttonVariant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50';
      case 'enterprise':
        return 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-lg hover:shadow-xl';
      case 'trial':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const LoadingSpinner = () => (
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );

  // Free plan
  if (plan?.id === 'free') {
    return (
      <div className={`space-y-3 ${fullWidth ? 'w-full' : ''} ${className}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/signup'}
          className={`
            ${getSizeClasses()}
            ${getVariantClasses('secondary')}
            ${fullWidth ? 'w-full' : ''}
            rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
          `}
        >
          Get Started Free
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    );
  }

  // Enterprise plan
  if (plan?.enterprise) {
    const trialDays = stripeIntegrationService.getTrialPeriod(plan.id);
    
    return (
      <div className={`space-y-3 ${fullWidth ? 'w-full' : ''} ${className}`}>
        {/* Primary CTA - Enterprise Setup */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEnterpriseSetup}
          disabled={isLoading}
          className={`
            ${getSizeClasses()}
            ${getVariantClasses('enterprise')}
            ${fullWidth ? 'w-full' : ''}
            rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading && loadingAction === 'enterprise' ? (
            <LoadingSpinner />
          ) : (
            <>
              <Building2 className="w-5 h-5" />
              One-Click Enterprise Setup
            </>
          )}
        </motion.button>

        {/* Secondary CTA - Trial */}
        {showTrial && trialDays > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStartTrial(plan.id)}
            disabled={isLoading}
            className={`
              ${getSizeClasses()}
              ${getVariantClasses('trial')}
              ${fullWidth ? 'w-full' : ''}
              rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isLoading && loadingAction === 'trial' ? (
              <LoadingSpinner />
            ) : (
              <>
                <Clock className="w-5 h-5" />
                Start {trialDays}-Day Free Trial
              </>
            )}
          </motion.button>
        )}

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>99.9% Uptime</span>
          </div>
        </div>
      </div>
    );
  }

  // Pro plans
  const trialDays = stripeIntegrationService.getTrialPeriod(plan?.id || '');
  const hasFreeTrial = trialDays > 0;

  return (
    <div className={`space-y-3 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Primary CTA */}
      {hasFreeTrial && showTrial ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => plan && handleStartTrial(plan.id)}
          disabled={isLoading}
          className={`
            ${getSizeClasses()}
            ${getVariantClasses('trial')}
            ${fullWidth ? 'w-full' : ''}
            rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading && loadingAction === 'trial' ? (
            <LoadingSpinner />
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Start {trialDays}-Day Free Trial
            </>
          )}
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => plan && handleSubscribe(plan.id)}
          disabled={isLoading}
          className={`
            ${getSizeClasses()}
            ${getVariantClasses(variant)}
            ${fullWidth ? 'w-full' : ''}
            rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading && loadingAction === 'subscribe' ? (
            <LoadingSpinner />
          ) : (
            <>
              Subscribe Now
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      )}

      {/* Secondary CTA */}
      {hasFreeTrial && showTrial && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => plan && handleSubscribe(plan.id)}
          disabled={isLoading}
          className={`
            ${getSizeClasses()}
            ${getVariantClasses('secondary')}
            ${fullWidth ? 'w-full' : ''}
            rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading && loadingAction === 'subscribe' ? (
            <LoadingSpinner />
          ) : (
            <>
              Subscribe Without Trial
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      )}

      {/* Trust indicators for paid plans */}
      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
        <span>🔒 Secure Payment</span>
        <span>📞 24/7 Support</span>
        <span>🔄 Cancel Anytime</span>
      </div>
    </div>
  );
}; 