import { useCallback, useEffect, useState } from 'react';
import { pricingAnalytics } from '../utils/analytics';
import { useABTest } from '../utils/abTesting';

interface UsePricingAnalyticsOptions {
  pageName?: string;
  componentId?: string;
  trackInitialView?: boolean;
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
}

interface PricingInteraction {
  component: string;
  action: string;
  value?: number;
  metadata?: Record<string, any>;
}

/**
 * Custom hook for tracking pricing page and component interactions
 * @param options Configuration options for analytics tracking
 * @returns Object with tracking functions
 */
export const usePricingAnalytics = (options: UsePricingAnalyticsOptions = {}) => {
  const {
    pageName = 'pricing_page',
    componentId = '',
    trackInitialView = true,
    trackScrollDepth = true,
    trackTimeOnPage = true
  } = options;

  const [startTime] = useState<number>(Date.now());
  const [interactions, setInteractions] = useState<PricingInteraction[]>([]);
  const [lastInteraction, setLastInteraction] = useState<number>(Date.now());
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  // Use the A/B testing hook
  const pricingTest = useABTest('pricing_display_order');
  const urgencyTest = useABTest('pricing_urgency_banner');

  // Initial view tracking
  useEffect(() => {
    if (trackInitialView) {
      pricingAnalytics.trackEventWithDetails(
        'view',
        'pricing',
        pageName,
        undefined,
        {
          component: componentId,
          timestamp: Date.now(),
          variant: pricingTest.variant?.id || 'default'
        }
      );
    }
  }, [pageName, componentId, trackInitialView, pricingTest.variant]);

  // Time tracking
  useEffect(() => {
    if (!trackTimeOnPage) return;

    const interval = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
      
      // Track time spent on page in 30-second intervals
      if (timeOnPage % 30 === 0 && timeOnPage > 0) {
        pricingAnalytics.trackEventWithDetails(
          'time_on_page',
          'engagement',
          pageName,
          timeOnPage,
          {
            component: componentId,
            interactionCount: interactions.length,
            timeSinceLastInteraction: Math.floor((Date.now() - lastInteraction) / 1000)
          }
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, pageName, componentId, interactions.length, lastInteraction, trackTimeOnPage]);

  // Scroll depth tracking
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
        pricingAnalytics.trackEventWithDetails(
          'scroll_started',
          'engagement',
          pageName,
          undefined,
          {
            component: componentId,
            timestamp: Date.now()
          }
        );
      }

      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      // Track scroll at 25%, 50%, 75%, and 100%
      const thresholds = [25, 50, 75, 100];
      const threshold = thresholds.find(t => scrollPercent >= t && !sessionStorage.getItem(`scrolled_${t}`));
      
      if (threshold) {
        sessionStorage.setItem(`scrolled_${threshold}`, 'true');
        pricingAnalytics.trackEventWithDetails(
          'scroll_depth',
          'engagement',
          `${threshold}%`,
          threshold,
          {
            component: componentId,
            timeSincePageLoad: Math.floor((Date.now() - startTime) / 1000)
          }
        );
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled, pageName, componentId, startTime, trackScrollDepth]);

  // Track plan interaction
  const trackPlanInteraction = useCallback((
    plan: string, 
    action: 'view' | 'hover' | 'click' | 'select', 
    metadata?: Record<string, any>
  ) => {
    const interaction: PricingInteraction = {
      component: componentId || pageName,
      action: `plan_${action}`,
      metadata: {
        plan,
        timestamp: Date.now(),
        timeSincePageLoad: Math.floor((Date.now() - startTime) / 1000),
        ...metadata
      }
    };
    
    setInteractions(prev => [...prev, interaction]);
    setLastInteraction(Date.now());
    
    // Use trackEventWithDetails
    pricingAnalytics.trackEventWithDetails(
      `plan_${action}`,
      action === 'view' ? 'impression' : (action === 'select' ? 'conversion' : 'engagement'),
      plan,
      undefined,
      interaction.metadata
    );
    
    // Also track as A/B test event if applicable
    if (pricingTest.isInTest) {
      pricingTest.trackEvent(`plan_${action}`, undefined, {
        plan,
        source: componentId || pageName,
        ...metadata
      });
    }
    
    return interaction;
  }, [componentId, pageName, startTime, pricingTest]);

  // Track feature interaction
  const trackFeatureInteraction = useCallback((
    feature: string,
    action: 'view' | 'hover' | 'click' | 'highlight',
    metadata?: Record<string, any>
  ) => {
    const interaction: PricingInteraction = {
      component: componentId || pageName,
      action: `feature_${action}`,
      metadata: {
        feature,
        timestamp: Date.now(),
        timeSincePageLoad: Math.floor((Date.now() - startTime) / 1000),
        ...metadata
      }
    };
    
    setInteractions(prev => [...prev, interaction]);
    setLastInteraction(Date.now());
    
    // Use trackEventWithDetails
    pricingAnalytics.trackEventWithDetails(
      `feature_${action}`,
      'engagement',
      feature,
      undefined,
      interaction.metadata
    );
    
    return interaction;
  }, [componentId, pageName, startTime]);

  // Track CTA interactions
  const trackCTAInteraction = useCallback((
    ctaId: string,
    action: 'view' | 'hover' | 'click',
    metadata?: Record<string, any>
  ) => {
    try {
      const interaction: PricingInteraction = {
        component: componentId || pageName,
        action: `cta_${action}`,
        metadata: {
          ctaId,
          timestamp: Date.now(),
          timeSincePageLoad: Math.floor((Date.now() - startTime) / 1000),
          ...metadata
        }
      };
      
      // Use setTimeout to prevent nested state updates during render
      setTimeout(() => {
        try {
          setInteractions(prev => [...prev, interaction]);
          setLastInteraction(Date.now());
        } catch (error) {
          console.warn('Failed to update interaction state:', error);
        }
      }, 0);
      
      // Use trackEventWithDetails
      pricingAnalytics.trackEventWithDetails(
        `cta_${action}`,
        action === 'click' ? 'conversion' : 'engagement',
        ctaId,
        undefined,
        interaction.metadata
      );
      
      // Also track as A/B test event for urgency banner test
      if (urgencyTest.isInTest && metadata?.bannerId) {
        urgencyTest.trackEvent(`banner_${action}`, undefined, metadata);
      }
      
      return interaction;
    } catch (error) {
      console.warn('Failed to track CTA interaction:', error);
      return null;
    }
  }, [componentId, pageName, startTime, urgencyTest]);

  // Track UI component interactions
  const trackUIInteraction = useCallback((
    elementId: string,
    action: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    const interaction: PricingInteraction = {
      component: componentId || pageName,
      action,
      value,
      metadata: {
        elementId,
        timestamp: Date.now(),
        timeSincePageLoad: Math.floor((Date.now() - startTime) / 1000),
        ...metadata
      }
    };
    
    setInteractions(prev => [...prev, interaction]);
    setLastInteraction(Date.now());
    
    // Use trackEventWithDetails
    pricingAnalytics.trackEventWithDetails(
      action,
      'ui_interaction',
      elementId,
      value,
      interaction.metadata
    );
    
    return interaction;
  }, [componentId, pageName, startTime]);

  // Track conversion events
  const trackConversion = useCallback((
    conversionType: string,
    plan: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    const journey = interactions.map(i => `${i.action}:${i.component}`).join(' > ');
    
    const conversionData = {
      conversionType,
      plan,
      value,
      timestamp: Date.now(),
      timeToConversion: Math.floor((Date.now() - startTime) / 1000),
      interactionCount: interactions.length,
      userJourney: journey,
      ...metadata
    };
    
    // Use trackEventWithDetails instead of direct track call
    pricingAnalytics.trackEventWithDetails(
      'conversion',
      'conversion',
      `${conversionType}_${plan}`,
      value,
      conversionData
    );
    
    // Track conversions in both tests
    if (pricingTest.isInTest) {
      pricingTest.trackConversion(value, { plan, conversionType, ...metadata });
    }
    
    if (urgencyTest.isInTest) {
      urgencyTest.trackConversion(value, { plan, conversionType, ...metadata });
    }
    
    return conversionData;
  }, [interactions, startTime, pricingTest, urgencyTest]);

  // Track generic event
  const trackEvent = useCallback((
    eventName: string,
    category: string = 'pricing',
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    const interaction: PricingInteraction = {
      component: componentId || pageName,
      action: eventName,
      value,
      metadata: {
        timestamp: Date.now(),
        timeSincePageLoad: Math.floor((Date.now() - startTime) / 1000),
        category,
        label,
        ...metadata
      }
    };
    
    setInteractions(prev => [...prev, interaction]);
    setLastInteraction(Date.now());
    
    // Use the enhanced trackEventWithDetails method
    pricingAnalytics.trackEventWithDetails(
      eventName,
      category,
      label,
      value,
      {
        component: componentId,
        pageName,
        ...metadata
      }
    );
    
    return interaction;
  }, [componentId, pageName, startTime]);

  // Enhanced trackEvent with more contextual data and A/B test tracking
  const trackEventWithContext = useCallback((
    eventName: string,
    options: {
      category?: string;
      label?: string;
      value?: number;
      context?: 'plan' | 'feature' | 'upsell' | 'component' | 'page' | 'experiment';
      action?: 'view' | 'click' | 'hover' | 'scroll' | 'select' | 'dismiss' | 'custom';
      metadata?: Record<string, any>;
      trackInTests?: boolean;
    } = {}
  ) => {
    const {
      category = 'pricing',
      label,
      value,
      context = 'component',
      action = 'custom',
      metadata = {},
      trackInTests = true
    } = options;
    
    // Create rich contextual data
    const contextualData = {
      timestamp: Date.now(),
      timeSincePageLoad: Math.floor((Date.now() - startTime) / 1000),
      interactionCount: interactions.length,
      timeSinceLastInteraction: Math.floor((Date.now() - lastInteraction) / 1000),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      url: window.location.href,
      referrer: document.referrer,
      device: {
        mobile: window.innerWidth < 768,
        tablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        desktop: window.innerWidth >= 1024
      },
      experimentData: {
        pricingVariant: pricingTest.variant?.id,
        urgencyVariant: urgencyTest.variant?.id
      },
      ...metadata
    };
    
    const interaction: PricingInteraction = {
      component: componentId || pageName,
      action: `${context}_${action}_${eventName}`,
      value,
      metadata: {
        category,
        label,
        context,
        action,
        ...contextualData
      }
    };
    
    // Update internal state
    setInteractions(prev => [...prev, interaction]);
    setLastInteraction(Date.now());
    
    // Track via analytics service using enhanced method
    pricingAnalytics.trackEventWithDetails(
      eventName,
      category,
      label,
      value,
      {
        component: componentId,
        context,
        action,
        ...contextualData
      }
    );
    
    // Track in A/B tests if configured
    if (trackInTests) {
      // For pricing display order test
      if (pricingTest.isInTest) {
        pricingTest.trackEvent(eventName, value, {
          category,
          label,
          context,
          action,
          source: componentId || pageName
        });
      }
      
      // For urgency banner test
      if (urgencyTest.isInTest) {
        urgencyTest.trackEvent(eventName, value, {
          category,
          label,
          context,
          action,
          source: componentId || pageName
        });
      }
    }
    
    return interaction;
  }, [componentId, pageName, startTime, lastInteraction, interactions.length, pricingTest, urgencyTest]);

  return {
    trackPlanInteraction,
    trackFeatureInteraction,
    trackCTAInteraction,
    trackUIInteraction,
    trackConversion,
    trackEvent,
    trackEventWithContext,
    getInteractions: () => interactions,
    getTimeOnPage: () => Math.floor((Date.now() - startTime) / 1000),
    getABTestData: () => ({
      pricingTest: pricingTest.variant,
      urgencyTest: urgencyTest.variant
    })
  };
};

export default usePricingAnalytics; 