import React, { useState, useEffect } from 'react';
import { X, Percent, Clock, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiscountPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onAccept: (email: string) => void;
  discountPercentage?: number;
}

export const DiscountPopup: React.FC<DiscountPopupProps> = ({
  isVisible,
  onClose,
  onAccept,
  discountPercentage = 15
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await onAccept(email);
      onClose();
    } catch (error) {
      console.error('Failed to apply discount:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-6 h-6" />
                  <span className="text-lg font-bold">Limited Time Offer!</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {discountPercentage}% OFF
                </h2>
                <p className="text-blue-100">
                  Don't miss out on this exclusive discount
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Timer */}
              <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-red-50 rounded-lg border border-red-200">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-semibold">
                  Expires in: {formatTime(timeLeft)}
                </span>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">What you get:</h3>
                <div className="space-y-2">
                  {[
                    'Advanced AI document analysis',
                    'Unlimited OCR processing',
                    'Priority customer support',
                    'Enterprise-grade security'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="discount-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your email to claim this offer:
                  </label>
                  <input
                    id="discount-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Claim {discountPercentage}% Discount
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Trust indicators */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Secure checkout • No spam • Cancel anytime
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 