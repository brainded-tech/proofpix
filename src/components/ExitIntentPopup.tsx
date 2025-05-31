import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestEnterpriseWhitepaper } from '../services/enterpriseApi';

// Exit-Intent Popup - CMO Conversion Optimization

interface ExitIntentPopupProps {
  onClose: () => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        // Only show if user hasn't submitted yet
        if (!isSubmitted) {
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
  }, [isSubmitted]);

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsVisible(false);
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {isSubmitted ? (
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 text-green-500 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600">
                  We'll send you our enterprise security whitepaper shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Wait! Get Our Enterprise Security Whitepaper
                  </h2>
                  <p className="text-gray-600">
                    Learn how ProofPix ensures enterprise-grade security and privacy
                    for image metadata management. Perfect for legal, healthcare,
                    and insurance organizations.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                  <h3 className="text-blue-800 font-semibold mb-2">
                    What's Inside:
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Client-side Processing Security Analysis
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Compliance & Regulatory Framework
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Enterprise Integration Guide
                    </li>
                  </ul>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Work Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@company.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Get the Whitepaper'
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    By submitting, you agree to our{' '}
                    <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
