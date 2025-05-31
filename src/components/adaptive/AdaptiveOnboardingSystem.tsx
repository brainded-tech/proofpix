import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IntentDetectionModal, UserIntent } from '../onboarding/IntentDetectionModal';
import { OnboardingFlowRenderer } from '../onboarding/OnboardingFlowRenderer';
import { useAdaptiveUI } from './AdaptiveUIProvider';
import { analytics } from '../../utils/analytics';

interface AdaptiveOnboardingSystemProps {
  /**
   * Trigger when the onboarding should appear
   * - auto: Shows on new session or when explicitly restarted
   * - manual: Only shows when explicitly triggered
   * - disabled: Never shows automatically
   */
  trigger?: 'auto' | 'manual' | 'disabled';
  
  /**
   * Optional callback when onboarding is completed
   */
  onComplete?: () => void;
  
  /**
   * Optional callback when a specific onboarding step is completed
   */
  onStepComplete?: (step: string, flow: string) => void;
  
  /**
   * Whether to show the onboarding immediately on mount
   */
  showImmediately?: boolean;
}

/**
 * Enhanced Adaptive Onboarding System that detects user intent and provides
 * personalized onboarding flows with progressive feature revelation
 */
export const AdaptiveOnboardingSystem: React.FC<AdaptiveOnboardingSystemProps> = ({
  trigger = 'auto',
  onComplete,
  onStepComplete,
  showImmediately = false
}) => {
  const [showIntentModal, setShowIntentModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { userContext, setUserIntent, revealFeatures, completeOnboarding } = useAdaptiveUI();
  const navigate = useNavigate();
  
  // Check if onboarding should be shown on initial load
  useEffect(() => {
    if (showImmediately || (trigger === 'auto' && shouldShowOnboarding())) {
      setShowIntentModal(true);
    }
  }, []);
  
  // Determine if onboarding should be shown
  const shouldShowOnboarding = (): boolean => {
    // Skip if already completed or disabled
    if (userContext.completedOnboarding || trigger === 'disabled') {
      return false;
    }
    
    // Check if new session
    const lastSessionDate = localStorage.getItem('proofpix_last_session');
    const isNewSession = !lastSessionDate || 
      (new Date().getTime() - new Date(lastSessionDate).getTime() > 24 * 60 * 60 * 1000);
    
    if (isNewSession) {
      // Update session tracking
      localStorage.setItem('proofpix_last_session', new Date().toISOString());
      return true;
    }
    
    return false;
  };
  
  // Handle intent selection
  const handleIntentSelect = (intent: UserIntent) => {
    // Update user intent in context
    setUserIntent(intent);
    
    // Close intent modal and show onboarding
    setShowIntentModal(false);
    setShowOnboarding(true);
    
    // Track analytics
    analytics.track({
      event: 'onboarding_intent_selected',
      category: 'onboarding',
      label: intent.id,
      properties: {
        intent_id: intent.id,
        intent_flow: intent.flow,
        features_revealed: intent.features_revealed,
        session_id: sessionStorage.getItem('session_id') || 'unknown'
      }
    });
  };
  
  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    completeOnboarding();
    setShowOnboarding(false);
    
    // Track analytics
    analytics.track({
      event: 'onboarding_completed',
      category: 'onboarding',
      label: userContext.intent?.id || 'unknown',
      properties: {
        intent_id: userContext.intent?.id,
        flow: userContext.intent?.flow,
        revealed_features: userContext.revealedFeatures,
        time_to_complete: Date.now() - (parseInt(sessionStorage.getItem('onboarding_start_time') || '0') || Date.now())
      }
    });
    
    // Invoke callback if provided
    onComplete?.();
  };
  
  // Handle feature revelation
  const handleFeatureReveal = (features: string[]) => {
    revealFeatures(features);
    
    // Track analytics
    analytics.track({
      event: 'features_revealed',
      category: 'onboarding',
      properties: {
        features,
        intent_id: userContext.intent?.id,
        flow: userContext.intent?.flow
      }
    });
  };
  
  // Public method to manually start onboarding
  const startOnboarding = () => {
    // Store start time for analytics
    sessionStorage.setItem('onboarding_start_time', Date.now().toString());
    setShowIntentModal(true);
  };
  
  // Handle specific action requests from onboarding
  const handleAction = (action: string) => {
    switch (action) {
      case 'redirect_to_enterprise_demo':
        navigate('/enterprise/demo?view=showcase');
        break;
      case 'demo_batch_upload':
        // Show batch upload demo interface
        // This would typically be handled by your app's state management
        break;
      case 'upload_single_image':
        // Trigger file upload dialog or show demo
        // This would typically be handled by your app's state management
        break;
      default:
        console.warn(`Unhandled onboarding action: ${action}`);
    }
    
    // Track action analytics
    analytics.track({
      event: 'onboarding_action',
      category: 'onboarding',
      label: action,
      properties: {
        action,
        intent_id: userContext.intent?.id,
        flow: userContext.intent?.flow
      }
    });
  };
  
  return (
    <>
      {/* Intent Detection Modal */}
      <AnimatePresence>
        {showIntentModal && (
          <IntentDetectionModal
            isOpen={showIntentModal}
            onIntentSelect={handleIntentSelect}
            onClose={() => setShowIntentModal(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Onboarding Flow */}
      <AnimatePresence>
        {showOnboarding && userContext.intent && (
          <OnboardingFlowRenderer
            userIntent={userContext.intent}
            onComplete={handleOnboardingComplete}
            onFeatureReveal={handleFeatureReveal}
            onBack={() => {
              setShowOnboarding(false);
              setShowIntentModal(true);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Export for public API
export const useAdaptiveOnboarding = () => {
  const [onboardingRef] = useState<{ startOnboarding: () => void }>({
    startOnboarding: () => {}
  });
  
  return {
    startOnboarding: () => onboardingRef.startOnboarding()
  };
}; 