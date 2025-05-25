import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Clock, Shield } from 'lucide-react';
import { analytics } from '../utils/analytics';
import SessionManager from '../utils/sessionManager';
import { PRICING_PLANS } from '../utils/stripe';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [planInfo, setPlanInfo] = useState<any>(null);
  const [isSessionBased, setIsSessionBased] = useState(false);

  useEffect(() => {
    // Get plan info from URL params (would be set by your backend)
    const planId = searchParams.get('plan') || 'pro';
    
    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    if (plan) {
      setPlanInfo(plan);
      setIsSessionBased(plan.sessionBased || false);
      
      // If it's a session-based plan, create the session
      if (plan.sessionBased) {
        try {
          SessionManager.createSession(planId, plan.limits.duration || '24h');
          analytics.trackFeatureUsage('Session', `Created - ${planId}`);
        } catch (error) {
          console.error('Error creating session:', error);
        }
      }
    }

    analytics.trackFeatureUsage('Purchase', `Success - ${planId}`);
  }, [searchParams]);

  const handleContinue = () => {
    analytics.trackFeatureUsage('Navigation', 'Continue from Success');
    navigate('/');
  };

  if (!planInfo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-white mb-4">
            {isSessionBased ? 'Session Activated!' : 'Welcome to ProofPix Pro!'}
          </h1>
          
          <p className="text-gray-300 mb-6">
            {isSessionBased 
              ? `Your ${planInfo.name} is now active and ready to use.`
              : `Your ${planInfo.name} subscription is now active.`
            }
          </p>

          {/* Plan Details */}
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-white mb-3">{planInfo.name} Features:</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              {planInfo.features.slice(0, 3).map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Session-specific info */}
          {isSessionBased && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-orange-400 mr-2" />
                <span className="text-orange-300 font-medium">Session-Based Access</span>
              </div>
              <p className="text-sm text-orange-200">
                No account required • Access stored locally in your browser
              </p>
            </div>
          )}

          {/* Account-based info */}
          {!isSessionBased && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-blue-300 font-medium">Account Subscription</span>
              </div>
              <p className="text-sm text-blue-200">
                Check your email for account setup instructions
              </p>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
          >
            Start Using ProofPix
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>

          {/* Privacy Reminder */}
          <p className="text-xs text-gray-500 mt-4">
            Your photos never leave your device • All processing happens locally
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage; 