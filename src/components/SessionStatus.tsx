import React, { useState, useEffect } from 'react';
import { Clock, Zap, Star, Shield } from 'lucide-react';
import SessionManager from '../utils/sessionManager';

interface SessionStatusProps {
  className?: string;
}

const SessionStatus: React.FC<SessionStatusProps> = ({ className = '' }) => {
  const [currentPlan, setCurrentPlan] = useState(SessionManager.getCurrentPlan());

  useEffect(() => {
    const updatePlan = () => {
      setCurrentPlan(SessionManager.getCurrentPlan());
    };

    // Update every minute for session-based plans
    const interval = setInterval(updatePlan, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (currentPlan.type === 'free') {
    return null; // Don't show status for free plan
  }

  const getPlanIcon = () => {
    switch (currentPlan.plan.id) {
      case 'daypass': return <Zap className="h-5 w-5 text-orange-400" />;
      case 'weekpass': return <Star className="h-5 w-5 text-orange-400" />;
      case 'starter': return <Star className="h-5 w-5 text-green-400" />;
      case 'pro': return <Zap className="h-5 w-5 text-purple-400" />;
      case 'enterprise': return <Shield className="h-5 w-5 text-yellow-400" />;
      default: return <Shield className="h-5 w-5 text-blue-400" />;
    }
  };

  const getPlanColor = () => {
    if (currentPlan.type === 'session') {
      return 'from-orange-500 to-red-500';
    }
    return 'from-blue-500 to-purple-500';
  };

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-gradient-to-r ${getPlanColor()} bg-opacity-20`}>
            {getPlanIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-white">{currentPlan.plan.name} Plan</h3>
            <p className="text-sm text-gray-400">
              {currentPlan.type === 'session' ? 'Session-based access' : 'Account subscription'}
            </p>
          </div>
        </div>

        {currentPlan.timeRemaining && (
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-300">
              <Clock className="h-4 w-4 mr-1" />
              {currentPlan.timeRemaining}
            </div>
          </div>
        )}
      </div>

      {currentPlan.usage && currentPlan.type === 'session' && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-white font-medium">{currentPlan.usage.uploads}</div>
              <div className="text-gray-400">Uploads</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">{currentPlan.usage.batchProcesses}</div>
              <div className="text-gray-400">Batches</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">{currentPlan.usage.exports}</div>
              <div className="text-gray-400">Exports</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionStatus; 