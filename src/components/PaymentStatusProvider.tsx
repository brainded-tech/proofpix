import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, AlertTriangle, CreditCard, Clock, Zap } from 'lucide-react';

// Real-Time Payment Status Updates - Senior Dev Implementation

interface PaymentStatus {
  sessionId: string | null;
  status: 'idle' | 'processing' | 'succeeded' | 'failed' | 'requires_action';
  amount?: number;
  currency?: string;
  planName?: string;
  progress: number; // 0-100
  message: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PaymentStatusContextType {
  paymentStatus: PaymentStatus;
  startPaymentTracking: (sessionId: string, planName?: string) => void;
  clearPaymentStatus: () => void;
  updatePaymentProgress: (progress: number, message: string) => void;
}

const PaymentStatusContext = createContext<PaymentStatusContextType | undefined>(undefined);

export const usePaymentStatus = () => {
  const context = useContext(PaymentStatusContext);
  if (!context) {
    throw new Error('usePaymentStatus must be used within PaymentStatusProvider');
  }
  return context;
};

interface PaymentStatusProviderProps {
  children: ReactNode;
}

export const PaymentStatusProvider: React.FC<PaymentStatusProviderProps> = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    sessionId: null,
    status: 'idle',
    progress: 0,
    message: '',
    timestamp: Date.now()
  });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection for real-time updates
  useEffect(() => {
    if (paymentStatus.sessionId && paymentStatus.status === 'processing') {
      initializeWebSocket();
    }

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [paymentStatus.sessionId, paymentStatus.status]);

  const initializeWebSocket = () => {
    try {
      // In production, this would connect to your WebSocket server
      // For now, we'll simulate real-time updates
      const ws = new WebSocket('wss://app.proofpixapp.com/payments/status');
      
      ws.onopen = () => {
        console.log('Payment status WebSocket connected');
        if (paymentStatus.sessionId) {
          ws.send(JSON.stringify({
            type: 'subscribe',
            sessionId: paymentStatus.sessionId
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Fallback to polling if WebSocket fails
        startPollingPaymentStatus();
      };

      ws.onclose = () => {
        console.log('Payment status WebSocket disconnected');
      };

      setWebsocket(ws);
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      // Fallback to polling
      startPollingPaymentStatus();
    }
  };

  const handleWebSocketMessage = (data: any) => {
    if (data.sessionId === paymentStatus.sessionId) {
      setPaymentStatus(prev => ({
        ...prev,
        status: data.status,
        progress: data.progress || prev.progress,
        message: data.message || prev.message,
        amount: data.amount || prev.amount,
        currency: data.currency || prev.currency,
        timestamp: Date.now(),
        metadata: data.metadata || prev.metadata
      }));

      // Show completion modal for final states
      if (data.status === 'succeeded' || data.status === 'failed') {
        setShowStatusModal(true);
      }
    }
  };

  const startPollingPaymentStatus = () => {
    if (!paymentStatus.sessionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/.netlify/functions/payment-status?session_id=${paymentStatus.sessionId}`);
        const data = await response.json();
        
        if (data.status) {
          setPaymentStatus(prev => ({
            ...prev,
            status: data.status,
            progress: data.progress || prev.progress,
            message: data.message || prev.message,
            timestamp: Date.now()
          }));

          // Stop polling when payment is complete
          if (data.status === 'succeeded' || data.status === 'failed') {
            clearInterval(pollInterval);
            setShowStatusModal(true);
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    }, 2000); // Poll every 2 seconds

    // Clean up polling after 10 minutes
    setTimeout(() => clearInterval(pollInterval), 600000);
  };

  const startPaymentTracking = (sessionId: string, planName?: string) => {
    setPaymentStatus({
      sessionId,
      status: 'processing',
      progress: 10,
      message: 'Initializing payment...',
      planName,
      timestamp: Date.now()
    });
    setShowStatusModal(true);

    // Simulate payment progress for demo
    simulatePaymentProgress();
  };

  const simulatePaymentProgress = () => {
    const progressSteps = [
      { progress: 20, message: 'Validating payment method...', delay: 1000 },
      { progress: 40, message: 'Processing payment...', delay: 2000 },
      { progress: 60, message: 'Confirming transaction...', delay: 1500 },
      { progress: 80, message: 'Setting up your account...', delay: 2000 },
      { progress: 100, message: 'Payment successful!', delay: 1000 }
    ];

    let currentStep = 0;
    const executeStep = () => {
      if (currentStep < progressSteps.length) {
        const step = progressSteps[currentStep];
        setTimeout(() => {
          setPaymentStatus(prev => ({
            ...prev,
            progress: step.progress,
            message: step.message,
            status: step.progress === 100 ? 'succeeded' : 'processing',
            timestamp: Date.now()
          }));
          currentStep++;
          executeStep();
        }, step.delay);
      }
    };

    executeStep();
  };

  const updatePaymentProgress = (progress: number, message: string) => {
    setPaymentStatus(prev => ({
      ...prev,
      progress,
      message,
      timestamp: Date.now()
    }));
  };

  const clearPaymentStatus = () => {
    setPaymentStatus({
      sessionId: null,
      status: 'idle',
      progress: 0,
      message: '',
      timestamp: Date.now()
    });
    setShowStatusModal(false);
    
    if (websocket) {
      websocket.close();
      setWebsocket(null);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus.status) {
      case 'processing':
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
      case 'succeeded':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'requires_action':
        return <CreditCard className="w-8 h-8 text-yellow-500" />;
      default:
        return <Clock className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus.status) {
      case 'processing':
        return 'blue';
      case 'succeeded':
        return 'green';
      case 'failed':
        return 'red';
      case 'requires_action':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const contextValue: PaymentStatusContextType = {
    paymentStatus,
    startPaymentTracking,
    clearPaymentStatus,
    updatePaymentProgress
  };

  return (
    <PaymentStatusContext.Provider value={contextValue}>
      {children}
      
      {/* Real-Time Payment Status Modal */}
      <AnimatePresence>
        {showStatusModal && paymentStatus.sessionId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            >
              {/* Close button - only show for final states */}
              {(paymentStatus.status === 'succeeded' || paymentStatus.status === 'failed') && (
                <button
                  onClick={clearPaymentStatus}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light"
                >
                  ×
                </button>
              )}

              <div className="text-center">
                {/* Status Icon */}
                <div className="flex justify-center mb-6">
                  {getStatusIcon()}
                </div>

                {/* Status Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {paymentStatus.status === 'processing' && 'Processing Payment'}
                  {paymentStatus.status === 'succeeded' && 'Payment Successful!'}
                  {paymentStatus.status === 'failed' && 'Payment Failed'}
                  {paymentStatus.status === 'requires_action' && 'Action Required'}
                </h3>

                {/* Plan Information */}
                {paymentStatus.planName && (
                  <p className="text-gray-600 mb-4">
                    {paymentStatus.planName} Plan
                    {paymentStatus.amount && paymentStatus.currency && (
                      <span className="font-semibold">
                        {' '}• ${paymentStatus.amount / 100} {paymentStatus.currency.toUpperCase()}
                      </span>
                    )}
                  </p>
                )}

                {/* Progress Bar */}
                {paymentStatus.status === 'processing' && (
                  <div className="mb-6">
                    <div className="bg-gray-200 rounded-full h-3 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${paymentStatus.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`bg-${getStatusColor()}-500 h-3 rounded-full`}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{paymentStatus.progress}% complete</p>
                  </div>
                )}

                {/* Status Message */}
                <p className="text-gray-700 mb-6">
                  {paymentStatus.message}
                </p>

                {/* Real-time indicator */}
                {paymentStatus.status === 'processing' && (
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                    <Zap className="w-4 h-4 mr-1 text-blue-500" />
                    <span>Real-time updates</span>
                  </div>
                )}

                {/* Action Buttons */}
                {paymentStatus.status === 'succeeded' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => window.location.href = '/dashboard'}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Access Your Account
                    </button>
                    <button
                      onClick={clearPaymentStatus}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Continue Browsing
                    </button>
                  </div>
                )}

                {paymentStatus.status === 'failed' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => window.location.href = '/checkout'}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={clearPaymentStatus}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PaymentStatusContext.Provider>
  );
}; 