import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import DemoSelector from './DemoSelector';
import DemoFileUploader from './DemoFileUploader';
import DemoProgressTracker from './DemoProgressTracker';
import DemoResultsViewer from './DemoResultsViewer';

type DemoStep = 'selection' | 'upload' | 'processing' | 'results';

interface DemoManagerProps {
  className?: string;
  onClose?: () => void;
}

interface DemoState {
  selectedDemo: string | null;
  currentStep: DemoStep;
  uploadedFiles: any[];
  processingResults: any[];
  isProcessing: boolean;
}

export const DemoManager: React.FC<DemoManagerProps> = ({
  className = '',
  onClose
}) => {
  const [demoState, setDemoState] = useState<DemoState>({
    selectedDemo: null,
    currentStep: 'selection',
    uploadedFiles: [],
    processingResults: [],
    isProcessing: false
  });

  const handleDemoSelection = useCallback((demoId: string) => {
    setDemoState(prev => ({
      ...prev,
      selectedDemo: demoId,
      currentStep: 'upload'
    }));
  }, []);

  const handleFilesUploaded = useCallback((files: any[]) => {
    setDemoState(prev => ({
      ...prev,
      uploadedFiles: files,
      currentStep: 'processing',
      isProcessing: true
    }));
  }, []);

  const handleProcessingComplete = useCallback((results: any[]) => {
    setDemoState(prev => ({
      ...prev,
      processingResults: results,
      currentStep: 'results',
      isProcessing: false
    }));
  }, []);

  const handleBack = useCallback(() => {
    setDemoState(prev => {
      switch (prev.currentStep) {
        case 'upload':
          return { ...prev, currentStep: 'selection', selectedDemo: null };
        case 'processing':
          return { ...prev, currentStep: 'upload', isProcessing: false };
        case 'results':
          return { ...prev, currentStep: 'upload' };
        default:
          return prev;
      }
    });
  }, []);

  const handleReset = useCallback(() => {
    setDemoState({
      selectedDemo: null,
      currentStep: 'selection',
      uploadedFiles: [],
      processingResults: [],
      isProcessing: false
    });
  }, []);

  const getStepTitle = () => {
    switch (demoState.currentStep) {
      case 'selection': return 'Select Demo';
      case 'upload': return 'Upload Files';
      case 'processing': return 'Processing';
      case 'results': return 'Results';
      default: return 'Demo';
    }
  };

  const canGoBack = demoState.currentStep !== 'selection' && !demoState.isProcessing;

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {canGoBack && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              ProofPix Demo - {getStepTitle()}
            </h1>
            {demoState.selectedDemo && (
              <p className="text-slate-600 capitalize">
                {demoState.selectedDemo.replace('-', ' ')} Experience
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {demoState.currentStep !== 'selection' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Demo
            </button>
          )}
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

      {/* Progress Indicator */}
      {demoState.currentStep !== 'selection' && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
            <span>Step {demoState.currentStep === 'upload' ? '1' : demoState.currentStep === 'processing' ? '2' : '3'} of 3</span>
            <span>{Math.round(((demoState.currentStep === 'upload' ? 1 : demoState.currentStep === 'processing' ? 2 : 3) / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((demoState.currentStep === 'upload' ? 1 : demoState.currentStep === 'processing' ? 2 : 3) / 3) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Demo Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={demoState.currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {demoState.currentStep === 'selection' && (
            <DemoSelector
              onSelect={handleDemoSelection}
              selectedDemo={demoState.selectedDemo || undefined}
            />
          )}

          {demoState.currentStep === 'upload' && (
            <DemoFileUploader
              industryType={demoState.selectedDemo || 'enterprise'}
              onFilesReady={handleFilesUploaded}
              maxFiles={5}
            />
          )}

          {demoState.currentStep === 'processing' && (
            <DemoProgressTracker
              files={demoState.uploadedFiles}
              industryType={demoState.selectedDemo || 'enterprise'}
              onComplete={handleProcessingComplete}
              isActive={demoState.isProcessing}
            />
          )}

          {demoState.currentStep === 'results' && (
            <DemoResultsViewer
              results={demoState.processingResults}
              industryType={demoState.selectedDemo || 'enterprise'}
              onUpgrade={() => console.log('Upgrade clicked')}
              onExport={(format) => console.log('Export:', format)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DemoManager; 