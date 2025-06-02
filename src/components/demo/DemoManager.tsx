import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DemoSelector } from './DemoSelector';
import { InteractiveDemoInterface } from './InteractiveDemoInterface';
import demoDataService from '../../services/demoDataService';

interface DemoManagerProps {
  initialScenario?: string;
  onExit?: () => void;
  embedded?: boolean;
}

type DemoState = 'selector' | 'demo' | 'completed' | 'error';

interface DemoSession {
  scenarioId: string;
  startTime: Date;
  completed: boolean;
  results?: any;
}

export const DemoManager: React.FC<DemoManagerProps> = ({
  initialScenario,
  onExit,
  embedded = false
}) => {
  const [currentState, setCurrentState] = useState<DemoState>('selector');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(initialScenario || null);
  const [demoSession, setDemoSession] = useState<DemoSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize with scenario if provided
  useEffect(() => {
    if (initialScenario) {
      handleScenarioSelect(initialScenario);
    }
  }, [initialScenario]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (demoDataService.isDemoActive()) {
        demoDataService.endDemoSession();
      }
    };
  }, []);

  const handleScenarioSelect = (scenarioId: string) => {
    try {
      setSelectedScenario(scenarioId);
      setDemoSession({
        scenarioId,
        startTime: new Date(),
        completed: false
      });
      setCurrentState('demo');
      setError(null);
    } catch (err) {
      console.error('Failed to start demo:', err);
      setError('Failed to start demo. Please try again.');
      setCurrentState('error');
    }
  };

  const handleDemoComplete = (results?: any) => {
    if (demoSession) {
      setDemoSession({
        ...demoSession,
        completed: true,
        results
      });
    }
    setCurrentState('completed');
  };

  const handleDemoExit = () => {
    // End demo session
    if (demoDataService.isDemoActive()) {
      demoDataService.endDemoSession();
    }
    
    // Reset state
    setSelectedScenario(null);
    setDemoSession(null);
    setError(null);
    
    if (embedded) {
      setCurrentState('selector');
    } else {
      onExit?.();
    }
  };

  const handleReturnToSelector = () => {
    // End current demo session
    if (demoDataService.isDemoActive()) {
      demoDataService.endDemoSession();
    }
    
    setSelectedScenario(null);
    setDemoSession(null);
    setCurrentState('selector');
  };

  const handleRetryDemo = () => {
    if (selectedScenario) {
      handleScenarioSelect(selectedScenario);
    } else {
      setCurrentState('selector');
    }
    setError(null);
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'selector':
        return (
          <DemoSelector
            onSelectDemo={handleScenarioSelect}
            onClose={embedded ? undefined : onExit}
          />
        );

      case 'demo':
        return selectedScenario ? (
          <InteractiveDemoInterface
            scenarioId={selectedScenario}
            onComplete={handleDemoComplete}
            onExit={handleDemoExit}
          />
        ) : null;

      case 'completed':
        return <DemoCompletedView />;

      case 'error':
        return <DemoErrorView />;

      default:
        return null;
    }
  };

  const DemoCompletedView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center p-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">Demo Completed!</h1>
        <p className="text-xl text-slate-300 mb-8">
          Thank you for experiencing ProofPix. You've seen how our platform can transform your workflow.
        </p>

        {demoSession && (
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Session Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Demo Type:</span>
                <span className="text-white">{demoSession.scenarioId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="text-white">
                  {Math.round((new Date().getTime() - demoSession.startTime.getTime()) / 60000)} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-green-400">Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Results:</span>
                <span className="text-white">Available for download</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleReturnToSelector}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Try Another Demo
            </button>
            <button
              onClick={onExit}
              className="border border-slate-500 hover:border-slate-400 text-slate-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Contact Sales
            </button>
          </div>
          
          <button
            onClick={handleDemoExit}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            Exit Demo
          </button>
        </div>
      </motion.div>
    </div>
  );

  const DemoErrorView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center p-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">Demo Error</h1>
        <p className="text-xl text-slate-300 mb-8">
          {error || 'Something went wrong with the demo. Please try again.'}
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetryDemo}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Retry Demo
            </button>
            <button
              onClick={handleReturnToSelector}
              className="border border-slate-500 hover:border-slate-400 text-slate-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Choose Different Demo
            </button>
          </div>
          
          <button
            onClick={handleDemoExit}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            Exit Demo
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className={embedded ? '' : 'fixed inset-0 z-50'}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {renderCurrentState()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 