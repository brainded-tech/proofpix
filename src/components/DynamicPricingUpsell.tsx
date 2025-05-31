import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Award, ArrowRight, X, TrendingUp, Tag } from 'lucide-react';
import { EnterpriseButton } from './ui/EnterpriseComponents';
import { usePricingAnalytics } from '../hooks/usePricingAnalytics';
import { useABTest } from '../utils/abTesting';

interface DynamicPricingUpsellProps {
  className?: string;
  currentPlan?: string;
  scrollThreshold?: number;
  timeThreshold?: number;
  dismissible?: boolean;
  showCountdown?: boolean;
}

const DynamicPricingUpsell: React.FC<DynamicPricingUpsellProps> = ({
  className = '',
  currentPlan = 'starter',
  scrollThreshold = 65,
  timeThreshold = 30,
  dismissible = true,
  showCountdown = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [countdownTime, setCountdownTime] = useState(1800); // 30 minutes by default
  const [discount, setDiscount] = useState(15);
  const [offerType, setOfferType] = useState<'discount' | 'feature' | 'trial'>('discount');
  
  // Pricing analytics hook
  const analytics = usePricingAnalytics({
    componentId: 'dynamic_pricing_upsell',
    trackScrollDepth: false,
    trackTimeOnPage: false
  });
  
  // A/B test for offer type
  const offerTest = useABTest('dynamic_pricing_offer_type');

  // Initialize component based on A/B test
  useEffect(() => {
    if (offerTest.isInTest && offerTest.variant) {
      setOfferType(offerTest.variant.id as 'discount' | 'feature' | 'trial');
      
      // Different discount amounts for different variants
      if (offerTest.variant.id === 'discount') {
        setDiscount(Math.floor(Math.random() * 10) + 15); // Random discount between 15-25%
      }
    }
    
    // Start countdown timer
    const timer = setInterval(() => {
      setCountdownTime(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start time spent counter
    const timeCounter = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    // Clean up timers
    return () => {
      clearInterval(timer);
      clearInterval(timeCounter);
    };
  }, [offerTest.isInTest, offerTest.variant]);

  // Show upsell based on scroll depth or time spent
  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      if (scrollPercent >= scrollThreshold && !isVisible) {
        setIsVisible(true);
        analytics.trackUIInteraction('dynamic_upsell', 'scroll_trigger', scrollPercent, {
          offerType,
          timeSpent
        });
      }
    };
    
    // Show based on time spent
    if (timeSpent >= timeThreshold && !isVisible && !dismissed) {
      setIsVisible(true);
      analytics.trackUIInteraction('dynamic_upsell', 'time_trigger', timeSpent, {
        offerType
      });
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold, timeThreshold, timeSpent, isVisible, dismissed, offerTest.variant, analytics, offerType]);

  // Track visibility
  useEffect(() => {
    if (isVisible) {
      analytics.trackCTAInteraction('dynamic_upsell', 'view', {
        offerType,
        discount: offerType === 'discount' ? discount : undefined,
        countdown: countdownTime,
        currentPlan
      });
    }
  }, [isVisible, analytics, offerType, discount, countdownTime, currentPlan]);

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
    
    analytics.trackCTAInteraction('dynamic_upsell', 'click', {
      action: 'dismiss',
      offerType,
      timeVisible: timeSpent,
      discount: offerType === 'discount' ? discount : undefined
    });
  };

  const handleCTAClick = () => {
    analytics.trackCTAInteraction('dynamic_upsell', 'click', {
      offerType,
      discount: offerType === 'discount' ? discount : undefined,
      timeToClick: timeSpent,
      remainingTime: countdownTime
    });
    
    // Track as a conversion in the A/B test
    if (offerTest.isInTest) {
      offerTest.trackConversion(1, {
        action: 'upsell_click',
        offerType,
        discount: offerType === 'discount' ? discount : undefined
      });
    }
    
    window.location.href = `/checkout?plan=professional&source=dynamic_upsell&offer=${offerType}${
      offerType === 'discount' ? `&discount=${discount}` : ''
    }`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Determine next plan to recommend
  const getUpgradePlan = () => {
    switch (currentPlan) {
      case 'free':
      case 'starter':
        return 'Professional';
      case 'professional':
        return 'Enterprise';
      default:
        return 'Professional';
    }
  };

  // Render different offer types
  const renderOfferContent = () => {
    const nextPlan = getUpgradePlan();
    
    switch (offerType) {
      case 'discount':
        return (
          <>
            <div className="flex items-center justify-center mb-2">
              <Tag className="text-green-500 mr-2" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Special {discount}% Discount</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Upgrade to {nextPlan} now and save {discount}% for the first year!
            </p>
            {showCountdown && (
              <div className="text-xs text-gray-500 mb-3 flex items-center justify-center">
                <Clock className="mr-1" size={14} />
                Offer expires in: <span className="font-semibold ml-1">{formatTime(countdownTime)}</span>
              </div>
            )}
          </>
        );
        
      case 'feature':
        return (
          <>
            <div className="flex items-center justify-center mb-2">
              <Award className="text-purple-500 mr-2" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Unlock Premium Features</h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Upgrade to {nextPlan} to access these advanced capabilities:
            </p>
            <ul className="text-xs text-gray-700 mb-4 space-y-1">
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-1 flex-shrink-0 mt-0.5" size={12} />
                <span>Advanced metadata extraction</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-1 flex-shrink-0 mt-0.5" size={12} />
                <span>Unlimited batch processing</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-1 flex-shrink-0 mt-0.5" size={12} />
                <span>Priority customer support</span>
              </li>
            </ul>
          </>
        );
        
      case 'trial':
        return (
          <>
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="text-blue-500 mr-2" size={20} />
              <h3 className="text-lg font-bold text-gray-900">Free 14-Day Trial</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Try {nextPlan} plan free for 14 days with all premium features.
              No credit card required to start your trial!
            </p>
          </>
        );
        
      default:
        return null;
    }
  };

  if (!isVisible || dismissed) return null;

  return (
    <div className={`fixed bottom-4 right-4 max-w-xs z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-4 animate-slideInRight">
        {dismissible && (
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}
        
        {renderOfferContent()}
        
        <EnterpriseButton
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
          onClick={handleCTAClick}
        >
          {offerType === 'trial' ? 'Start Free Trial' : 'Upgrade Now'} <ArrowRight className="ml-1" size={16} />
        </EnterpriseButton>
      </div>
    </div>
  );
};

export default DynamicPricingUpsell; 