// Minimal BatchProcessor Test Component
import React from 'react';

interface MinimalBatchProcessorProps {
  onComplete?: (images: any[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
}

const MinimalBatchProcessor: React.FC<MinimalBatchProcessorProps> = ({
  onComplete,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024
}) => {
  console.log('🧪 MinimalBatchProcessor rendered!', { onComplete, maxFiles, maxFileSize });

  return (
    <div className="bg-gray-800 rounded-lg p-6" style={{ minHeight: '200px' }}>
      <h2 className="text-xl font-bold text-white mb-4">
        🧪 Minimal Batch Processor Test
      </h2>
      <div className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
        <p className="text-white mb-2">Test Batch Processor Component</p>
        <p className="text-gray-400 text-sm">
          If you can see this, the component is rendering correctly.
        </p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            console.log('🎯 Test button clicked!');
            alert('Minimal batch processor is working!');
          }}
        >
          Test Button
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        Props: maxFiles={maxFiles}, maxFileSize={Math.round(maxFileSize / 1024 / 1024)}MB
      </div>
    </div>
  );
};

export default MinimalBatchProcessor; 