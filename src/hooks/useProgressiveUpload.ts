import { useState, useCallback } from 'react';

export const useProgressiveUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    'Reading file...',
    'Extracting metadata...',
    'Processing EXIF data...',
    'Preparing results...'
  ];

  const updateProgress = useCallback((progress: number) => {
    setUploadProgress(progress);
  }, []);

  const updateStage = useCallback((stage: number) => {
    setCurrentStage(stage);
  }, []);

  return {
    uploadProgress,
    stages,
    currentStage,
    updateProgress,
    updateStage
  };
}; 