import React, { useEffect } from 'react';
import { AdaptiveUIProvider } from './AdaptiveUIProvider';
import { AdaptiveOnboardingSystem } from './AdaptiveOnboardingSystem';
import { FeatureDiscoveryProvider } from './FeatureDiscoverySystem';
import { AdaptiveNavigationSystem } from './AdaptiveNavigationSystem';
import { MobileFirstEnhancement } from './MobileFirstEnhancement';
import { SmartTooltip } from './SmartTooltipSystem';

interface AdaptiveUXSystemProps {
  /**
   * The main application content
   */
  children: React.ReactNode;
  
  /**
   * Configuration for the Adaptive UX System
   */
  config?: {
    /**
     * Whether to show the onboarding system
     */
    enableOnboarding?: boolean;
    
    /**
     * Whether to enable feature discovery
     */
    enableFeatureDiscovery?: boolean;
    
    /**
     * Navigation configuration
     */
    navigation?: {
      /**
       * Navigation variant to use (top, sidebar, bottom)
       */
      variant?: 'top' | 'sidebar' | 'bottom';
      
      /**
       * Whether to show the logo in the navigation
       */
      showLogo?: boolean;
    };
    
    /**
     * Mobile optimization configuration
     */
    mobileOptimization?: {
      /**
       * Whether to enable mobile optimizations
       */
      enabled?: boolean;
      
      /**
       * Whether to enable swipe gestures
       */
      enableSwipeGestures?: boolean;
      
      /**
       * Whether to use compact mode on mobile
       */
      compactMode?: boolean;
    };
  };
}

/**
 * Comprehensive Adaptive UX System that integrates all adaptive components
 * into a cohesive user experience framework
 */
export const AdaptiveUXSystem: React.FC<AdaptiveUXSystemProps> = ({
  children,
  config = {
    enableOnboarding: true,
    enableFeatureDiscovery: true,
    navigation: {
      variant: 'top',
      showLogo: true
    },
    mobileOptimization: {
      enabled: true,
      enableSwipeGestures: true,
      compactMode: true
    }
  }
}) => {
  // Extract configuration
  const {
    enableOnboarding = true,
    enableFeatureDiscovery = true,
    navigation = {
      variant: 'top',
      showLogo: true
    },
    mobileOptimization = {
      enabled: true,
      enableSwipeGestures: true,
      compactMode: true
    }
  } = config;
  
  // Initialize analytics for user behavior tracking
  useEffect(() => {
    // Set up session tracking
    const sessionId = localStorage.getItem('proofpix_session_id') || 
      `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    sessionStorage.setItem('session_id', sessionId);
    
    if (!localStorage.getItem('proofpix_session_id')) {
      localStorage.setItem('proofpix_session_id', sessionId);
    }
    
    // Log session start
    console.log('AdaptiveUX session started', sessionId);
    
    return () => {
      // Log session end on component unmount
      console.log('AdaptiveUX session ended', sessionId);
    };
  }, []);
  
  return (
    <AdaptiveUIProvider>
      <FeatureDiscoveryProvider>
        {/* Main App Structure */}
        <div className="adaptive-ux-system">
          {/* Navigation */}
          <AdaptiveNavigationSystem 
            variant={navigation.variant} 
            showLogo={navigation.showLogo}
          />
          
          {/* Main Content with Mobile Optimizations */}
          <MobileFirstEnhancement
            compactMode={mobileOptimization.compactMode}
            enableSwipeGestures={mobileOptimization.enableSwipeGestures}
            collapsibleSidebars="both"
          >
            {/* App Content */}
            <main className="adaptive-content">
              {children}
            </main>
          </MobileFirstEnhancement>
          
          {/* Adaptive Onboarding System */}
          {enableOnboarding && (
            <AdaptiveOnboardingSystem
              trigger="auto"
              showImmediately={false}
            />
          )}
        </div>
      </FeatureDiscoveryProvider>
    </AdaptiveUIProvider>
  );
};

// Export all sub-components for individual use
export { 
  AdaptiveUIProvider, 
  useAdaptiveUI 
} from './AdaptiveUIProvider';

export { 
  AdaptiveOnboardingSystem,
  useAdaptiveOnboarding
} from './AdaptiveOnboardingSystem';

export { 
  FeatureDiscoveryProvider,
  useFeatureDiscovery
} from './FeatureDiscoverySystem';

export { 
  AdaptiveNavigationSystem,
  useAdaptiveNavigation
} from './AdaptiveNavigationSystem';

export {
  MobileFirstEnhancement,
  useMobileDetection
} from './MobileFirstEnhancement';

export {
  SmartTooltip
} from './SmartTooltipSystem'; 