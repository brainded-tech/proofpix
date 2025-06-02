import React, { useState, useEffect, useCallback } from 'react';
import { X, Clock, Zap, ArrowRight, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiscountPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onAccept: () => void;
  discount?: number;
  timeLimit?: number; // seconds
}

export const DiscountPopup: React.FC<DiscountPopupProps> = ({
  isVisible,
  onClose,
  onAccept,
  discount = 15,
  timeLimit = 300 // 5 minutes
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!isVisible || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, isExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    // Track conversion
    if (window.gtag) {
      window.gtag('event', 'discount_popup_conversion', {
        event_category: 'engagement',
        event_label: `${discount}% discount`,
        value: discount
      });
    }
    
    onAccept();
  };

  const handleClose = () => {
    // Track dismissal
    if (window.gtag) {
      window.gtag('event', 'discount_popup_dismissed', {
        event_category: 'engagement',
        event_label: `${discount}% discount`,
        time_remaining: timeLeft
      });
    }
    
    onClose();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3 mb-2">
              <Gift className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">Wait! Special Offer</h3>
                <p className="text-white/90">Don't miss out on this limited-time deal</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isExpired ? (
              <>
                {/* Discount Badge */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full text-white text-3xl font-bold mb-4">
                    {discount}%
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Get {discount}% Off Your First Year
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upgrade to Professional and save ${Math.round(29 * 12 * (discount / 100))} annually
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-mono text-lg font-bold">
                      {formatTime(timeLeft)}
                    </span>
                    <span className="text-sm">remaining</span>
                  </div>
                  <p className="text-center text-sm text-red-600 dark:text-red-400 mt-1">
                    This offer expires soon!
                  </p>
                </div>

                {/* Features Highlight */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="w-4 h-4 text-green-500 mr-2" />
                    Unlimited photo analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="w-4 h-4 text-green-500 mr-2" />
                    Batch processing up to 100 files
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="w-4 h-4 text-green-500 mr-2" />
                    Professional PDF reports
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="w-4 h-4 text-green-500 mr-2" />
                    Priority support
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAccept}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Claim {discount}% Discount</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={handleClose}
                    className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm py-2 transition-colors"
                  >
                    No thanks, I'll pay full price
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">⏰</div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Offer Expired
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This special discount has expired, but you can still upgrade at regular pricing.
                </p>
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  View Regular Pricing
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 