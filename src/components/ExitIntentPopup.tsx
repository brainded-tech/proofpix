import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestEnterpriseWhitepaper } from '../services/enterpriseApi';
import { Shield, AlertTriangle, Crown, DollarSign, Clock, Users } from 'lucide-react';
import { PRICING_PLANS } from '../utils/stripe';

// Exit-Intent Popup - CMO Conversion Optimization with 15% Discount

interface ExitIntentPopupProps {
  onClose: () => void;
}

// Discount configuration
const discountConfig = {
  percentage: 15,
  originalPrice: 149,
  discountedPrice: 127, // $149 - 15% = $126.65, rounded to $127
  planName: 'Professional AI',
  stripePriceId: 'price_1RVJ0aRwqAvTbIKuDQ57QNkL', // Professional AI plan
  maxUsers: 100,
  expirationHours: 48
};

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [discountStatus, setDiscountStatus] = useState<{
    available: boolean;
    usersRemaining: number;
    timeRemaining: number;
  }>({ available: true, usersRemaining: discountConfig.maxUsers, timeRemaining: discountConfig.expirationHours * 3600 });

  // Check discount availability on mount
  useEffect(() => {
    checkDiscountAvailability();
  }, []);

  // Countdown timer for discount expiration
  useEffect(() => {
    if (!discountStatus.available) return;

    const timer = setInterval(() => {
      setDiscountStatus(prev => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer);
          return { ...prev, available: false, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [discountStatus.available]);

  const checkDiscountAvailability = async () => {
    try {
      // Check localStorage for discount usage tracking
      const discountData = localStorage.getItem('proofpix_discount_15');
      const parsedData = discountData ? JSON.parse(discountData) : null;
      
      if (parsedData) {
        const now = Date.now();
        const expirationTime = parsedData.startTime + (discountConfig.expirationHours * 3600 * 1000);
        
        if (now > expirationTime || parsedData.usersUsed >= discountConfig.maxUsers) {
          setDiscountStatus({ available: false, usersRemaining: 0, timeRemaining: 0 });
          return;
        }
        
        const timeRemaining = Math.max(0, Math.floor((expirationTime - now) / 1000));
        const usersRemaining = Math.max(0, discountConfig.maxUsers - parsedData.usersUsed);
        
        setDiscountStatus({
          available: usersRemaining > 0 && timeRemaining > 0,
          usersRemaining,
          timeRemaining
        });
      } else {
        // Initialize discount tracking
        const initialData = {
          startTime: Date.now(),
          usersUsed: 0,
          maxUsers: discountConfig.maxUsers
        };
        localStorage.setItem('proofpix_discount_15', JSON.stringify(initialData));
      }
    } catch (error) {
      console.error('Error checking discount availability:', error);
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        // Only show if user hasn't submitted yet and discount is available
        if (!isSubmitted && discountStatus.available) {
          setIsVisible(true);
        }
      }
    };

    // Wait a bit before adding the listener to avoid immediate triggering
    timeoutId = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isSubmitted, discountStatus.available]);

  const handleDiscountClaim = async () => {
    try {
      // Update discount usage
      const discountData = localStorage.getItem('proofpix_discount_15');
      const parsedData = discountData ? JSON.parse(discountData) : { startTime: Date.now(), usersUsed: 0 };
      
      parsedData.usersUsed += 1;
      localStorage.setItem('proofpix_discount_15', JSON.stringify(parsedData));
      
      // Generate unique discount code
      const discountCode = `SAVE15-${Date.now().toString(36).toUpperCase()}`;
      
      // Redirect to checkout with discount
      const checkoutUrl = `/checkout?plan=${discountConfig.planName.toLowerCase()}&discount=${discountConfig.percentage}&code=${discountCode}&source=exit_intent`;
      window.location.href = checkoutUrl;
      
      // Track discount usage
      if (window.gtag) {
        window.gtag('event', 'discount_claimed', {
          event_category: 'conversion',
          event_label: 'exit_intent_15_percent',
          value: discountConfig.originalPrice - discountConfig.discountedPrice
        });
      }
    } catch (error) {
      console.error('Error claiming discount:', error);
      setErrorMessage('Unable to apply discount. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    
    try {
      // Call the API service
      const response = await requestEnterpriseWhitepaper({ email });
      
      if (response.success) {
        setIsSubmitted(true);
        
        // Close after showing success message
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 3000);
      } else {
        setErrorMessage(response.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible || !discountStatus.available) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-slate-600/30"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-2xl font-light"
          >
            ×
          </button>

          {isSubmitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Your Breach Prevention Guide is On Its Way!
              </h3>
              <p className="text-slate-300">
                Check your email for "How to Eliminate Data Breach Risk" - the same strategies our enterprise clients use to make breaches impossible.
              </p>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                {/* Urgency Banner */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-bold">LIMITED TIME: {formatTimeRemaining(discountStatus.timeRemaining)}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-xs">Only {discountStatus.usersRemaining} spots left!</span>
                  </div>
                </div>

                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  Wait! Get 15% Off Professional Plan
                </h2>
                
                <p className="text-slate-300 mb-4">
                  Don't leave without securing your evidence analysis at our lowest price ever. 
                  <span className="font-semibold text-blue-400"> Limited to first {discountConfig.maxUsers} users only.</span>
                </p>

                {/* Discount Offer */}
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 mb-4 border-2 border-green-500/30">
                  <div className="flex items-center justify-center mb-2">
                    <Crown className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-lg font-bold text-green-400">EXCLUSIVE 15% DISCOUNT</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-2xl font-bold text-slate-400 line-through">${discountConfig.originalPrice}</span>
                      <span className="text-3xl font-bold text-green-400">${discountConfig.discountedPrice}</span>
                      <span className="text-sm text-slate-300">/month</span>
                    </div>
                    <p className="text-sm text-green-300 font-medium">
                      Professional Plan - Everything you need for court-admissible evidence
                    </p>
                  </div>
                </div>

                {/* Features Preview */}
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border border-slate-600/30">
                  <h4 className="font-semibold text-white mb-2">What You Get:</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>✓ Unlimited metadata analysis</li>
                    <li>✓ Court-ready PDF reports</li>
                    <li>✓ Batch processing (100 images)</li>
                    <li>✓ Priority support</li>
                    <li>✓ Advanced export options</li>
                  </ul>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 text-red-400">
                  {errorMessage}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDiscountClaim}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Claim 15% Discount Now
                </button>

                <button
                  onClick={onClose}
                  className="w-full border border-slate-500 text-slate-300 py-2 px-4 rounded-lg font-medium hover:bg-slate-700/50 transition-colors"
                >
                  No thanks, I'll pay full price later
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-4 border-t border-slate-600/50">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 text-green-400 mr-1" />
                    <span>0 Breaches Ever</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="w-3 h-3 text-blue-400 mr-1" />
                    <span>Court-Tested</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-3 h-3 text-purple-400 mr-1" />
                    <span>30-Day Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};