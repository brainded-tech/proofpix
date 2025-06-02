import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DiscountPopup } from './DiscountPopup';
import { useExitIntent } from '../hooks/useExitIntent';

export const GlobalDiscountManager: React.FC = () => {
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const location = useLocation();

  // Exit intent for discount popup
  useExitIntent({
    enabled: true,
    delay: 10000, // 10 seconds minimum on page
    threshold: 50,
    onExitIntent: () => {
      // Only show popup if user hasn't seen it and isn't on checkout/enterprise pages
      const excludedPaths = ['/checkout', '/enterprise', '/pricing', '/billing'];
      const hasSeenPopup = localStorage.getItem('discountPopupSeen');
      const isExcludedPage = excludedPaths.some(path => location.pathname.includes(path));
      
      if (!hasSeenPopup && !isExcludedPage) {
        setShowDiscountPopup(true);
      }
    }
  });

  // Reset popup visibility when navigating to new pages (but respect the "seen" flag)
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('discountPopupSeen');
    if (hasSeenPopup) {
      setShowDiscountPopup(false);
    }
  }, [location.pathname]);

  const handleDiscountAccept = () => {
    localStorage.setItem('discountPopupSeen', 'true');
    setShowDiscountPopup(false);
    
    // Track conversion
    if (window.gtag) {
      window.gtag('event', 'discount_popup_conversion', {
        event_category: 'conversion',
        event_label: '15% exit intent discount',
        value: 15
      });
    }
    
    // Redirect to checkout with discount
    window.location.href = '/checkout?plan=professional&source=exit_intent&offer=discount&discount=15';
  };

  const handleDiscountClose = () => {
    localStorage.setItem('discountPopupSeen', 'true');
    setShowDiscountPopup(false);
  };

  return (
    <DiscountPopup
      isVisible={showDiscountPopup}
      onClose={handleDiscountClose}
      onAccept={handleDiscountAccept}
      discount={15}
      timeLimit={300} // 5 minutes
    />
  );
}; 