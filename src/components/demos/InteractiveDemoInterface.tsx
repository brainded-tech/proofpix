import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
import DemoManager from './DemoManager';

interface InteractiveDemoInterfaceProps {
  className?: string;
  autoStart?: boolean;
  fullscreen?: boolean;
  onClose?: () => void;
}

export const InteractiveDemoInterface: React.FC<InteractiveDemoInterfaceProps> = ({
  className = '',
  autoStart = false,
  fullscreen = false,
  onClose
}) => {
  const [isActive, setIsActive] = useState(autoStart);
  const [isFullscreen, setIsFullscreen] = useState(fullscreen);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    // Add small delay before restarting
    setTimeout(() => setIsActive(true), 100);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isActive) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-8 h-8 text-blue-600 ml-1" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Interactive ProofPix Demo
          </h2>
          
          <p className="text-slate-600 mb-8">
            Experience the full power of ProofPix's AI document intelligence platform. 
            Upload your own files and see real-time processing results.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Interactive Demo
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} ${className}`}>
      {/* Demo Controls */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleStop}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Stop Demo"
            >
              <Pause className="w-4 h-4 text-slate-600" />
            </button>
            
            <button
              onClick={handleReset}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset Demo"
            >
              <RotateCcw className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          
          <div className="h-4 w-px bg-slate-300" />
          
          <div className="text-sm text-slate-600">
            Interactive Demo Mode
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            <Maximize2 className="w-4 h-4 text-slate-600" />
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
      
      {/* Demo Content */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-73px)] overflow-auto' : ''} p-6`}>
        <DemoManager onClose={handleStop} />
      </div>
    </div>
  );
};

export default InteractiveDemoInterface; 