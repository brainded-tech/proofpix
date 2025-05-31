import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserIntent } from '../onboarding/IntentDetectionModal';

export interface UserContext {
  intent: UserIntent | null;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  revealedFeatures: string[];
  completedOnboarding: boolean;
  preferences: {
    showAdvancedFeatures: boolean;
    preferredView: 'simple' | 'detailed' | 'expert';
    autoHideCompleted: boolean;
    enableTooltips: boolean;
    compactMode: boolean;
  };
  usage: {
    sessionCount: number;
    featuresUsed: string[];
    lastActiveDate: string;
    totalProcessingTime: number;
  };
}

export interface AdaptiveUIState {
  userContext: UserContext;
  setUserIntent: (intent: UserIntent) => void;
  revealFeatures: (features: string[]) => void;
  updatePreferences: (preferences: Partial<UserContext['preferences']>) => void;
  markFeatureUsed: (feature: string) => void;
  shouldShowFeature: (feature: string) => boolean;
  getUIComplexity: () => 'simple' | 'standard' | 'advanced';
  resetOnboarding: () => void;
  completeOnboarding: () => void;
}

const defaultUserContext: UserContext = {
  intent: null,
  experienceLevel: 'beginner',
  revealedFeatures: [],
  completedOnboarding: false,
  preferences: {
    showAdvancedFeatures: false,
    preferredView: 'simple',
    autoHideCompleted: true,
    enableTooltips: true,
    compactMode: false
  },
  usage: {
    sessionCount: 0,
    featuresUsed: [],
    lastActiveDate: new Date().toISOString(),
    totalProcessingTime: 0
  }
};

const AdaptiveUIContext = createContext<AdaptiveUIState | null>(null);

interface AdaptiveUIProviderProps {
  children: ReactNode;
}

export const AdaptiveUIProvider: React.FC<AdaptiveUIProviderProps> = ({ children }) => {
  const [userContext, setUserContext] = useState<UserContext>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('proofpix-user-context');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultUserContext, ...parsed };
      } catch (error) {
        console.warn('Failed to parse saved user context:', error);
      }
    }
    return defaultUserContext;
  });

  // Save to localStorage whenever context changes
  useEffect(() => {
    localStorage.setItem('proofpix-user-context', JSON.stringify(userContext));
  }, [userContext]);

  // Update session count on mount
  useEffect(() => {
    setUserContext(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        sessionCount: prev.usage.sessionCount + 1,
        lastActiveDate: new Date().toISOString()
      }
    }));
  }, []);

  // Auto-detect experience level based on usage
  useEffect(() => {
    const { sessionCount, featuresUsed } = userContext.usage;
    let newLevel: UserContext['experienceLevel'] = 'beginner';
    
    if (sessionCount >= 10 && featuresUsed.length >= 5) {
      newLevel = 'expert';
    } else if (sessionCount >= 3 && featuresUsed.length >= 2) {
      newLevel = 'intermediate';
    }

    if (newLevel !== userContext.experienceLevel) {
      setUserContext(prev => ({
        ...prev,
        experienceLevel: newLevel
      }));
    }
  }, [userContext.usage, userContext.experienceLevel]);

  const updateUserIntent = (intent: UserIntent) => {
    setUserContext(prev => ({
      ...prev,
      intent,
      // Auto-reveal basic features based on intent
      revealedFeatures: Array.from(new Set([...prev.revealedFeatures, ...intent.features_revealed]))
    }));
  };

  const revealFeatures = (features: string[]) => {
    setUserContext(prev => ({
      ...prev,
      revealedFeatures: Array.from(new Set([...prev.revealedFeatures, ...features]))
    }));
  };

  const updatePreferences = (preferences: Partial<UserContext['preferences']>) => {
    setUserContext(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preferences
      }
    }));
  };

  const trackFeatureUsage = (feature: string) => {
    setUserContext(prev => ({
      ...prev,
      usage: {
        ...prev.usage,
        featuresUsed: Array.from(new Set([...prev.usage.featuresUsed, feature]))
      }
    }));
  };

  const shouldShowFeature = (feature: string): boolean => {
    const { revealedFeatures, preferences, experienceLevel } = userContext;
    
    // Always show if explicitly revealed
    if (revealedFeatures.includes(feature)) {
      return true;
    }

    // Show advanced features based on preferences and experience
    if (preferences.showAdvancedFeatures && experienceLevel !== 'beginner') {
      return true;
    }

    // Feature-specific logic
    const featureRules: Record<string, boolean> = {
      // Basic features - always show
      'basic_upload': true,
      'key_metadata': true,
      'simple_export': true,
      
      // Intermediate features
      'batch_processing': experienceLevel !== 'beginner',
      'pdf_reports': experienceLevel !== 'beginner',
      'advanced_metadata': experienceLevel === 'expert',
      
      // Enterprise features
      'enterprise_demo': userContext.intent?.id === 'enterprise_evaluation',
      'security_architecture': userContext.intent?.id === 'enterprise_evaluation' || userContext.intent?.id === 'privacy_focused',
      'compliance_info': userContext.intent?.id === 'enterprise_evaluation' || userContext.intent?.id === 'privacy_focused',
      
      // Privacy features
      'security_explanation': userContext.intent?.id === 'privacy_focused',
      'compliance_overview': userContext.intent?.id === 'privacy_focused',
      'local_processing_demo': userContext.intent?.id === 'privacy_focused',
      
      // Professional features
      'api_overview': userContext.intent?.id === 'professional_work' && experienceLevel === 'expert',
      'template_customization': userContext.intent?.id === 'professional_work',
      'team_features': userContext.intent?.id === 'professional_work' && experienceLevel !== 'beginner'
    };

    return featureRules[feature] ?? false;
  };

  const getUIComplexity = (): 'simple' | 'standard' | 'advanced' => {
    const { experienceLevel, preferences } = userContext;
    
    if (preferences.preferredView === 'expert' || experienceLevel === 'expert') {
      return 'advanced';
    }
    
    if (preferences.preferredView === 'detailed' || experienceLevel === 'intermediate') {
      return 'standard';
    }
    
    return 'simple';
  };

  const resetOnboarding = () => {
    setUserContext(prev => ({
      ...prev,
      intent: null,
      completedOnboarding: false,
      revealedFeatures: []
    }));
  };

  const completeOnboarding = () => {
    setUserContext(prev => ({
      ...prev,
      completedOnboarding: true
    }));
  };

  const value: AdaptiveUIState = {
    userContext,
    setUserIntent: updateUserIntent,
    revealFeatures,
    updatePreferences,
    markFeatureUsed: trackFeatureUsage,
    shouldShowFeature,
    getUIComplexity,
    resetOnboarding,
    completeOnboarding
  };

  return (
    <AdaptiveUIContext.Provider value={value}>
      {children}
    </AdaptiveUIContext.Provider>
  );
};

export const useAdaptiveUI = (): AdaptiveUIState => {
  const context = useContext(AdaptiveUIContext);
  if (!context) {
    throw new Error('useAdaptiveUI must be used within an AdaptiveUIProvider');
  }
  return context;
};

// Higher-order component for feature-gated components
export const withFeatureGate = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredFeature: string,
  fallback?: React.ComponentType<P>
) => {
  return (props: P) => {
    const { shouldShowFeature } = useAdaptiveUI();
    
    if (shouldShowFeature(requiredFeature)) {
      return <WrappedComponent {...props} />;
    }
    
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent {...props} />;
    }
    
    return null;
  };
};

// Hook for conditional feature rendering
export const useFeatureFlag = (feature: string): boolean => {
  const { shouldShowFeature } = useAdaptiveUI();
  return shouldShowFeature(feature);
};

// Hook for UI complexity adaptation
export const useUIComplexity = () => {
  const { getUIComplexity, userContext } = useAdaptiveUI();
  const complexity = getUIComplexity();
  
  return {
    complexity,
    isSimple: complexity === 'simple',
    isStandard: complexity === 'standard',
    isAdvanced: complexity === 'advanced',
    showTooltips: userContext.preferences.enableTooltips,
    compactMode: userContext.preferences.compactMode
  };
};

export default AdaptiveUIProvider; 