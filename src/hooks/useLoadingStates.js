// hooks/useLoadingStates.js

import { useState, useCallback, useMemo } from 'react';
import { Logger } from '../utils/logger';

const logger = new Logger('LoadingStates');

export const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState({});
  
  const startLoading = useCallback((operation, message = 'Loading...') => {
    logger.info(`Starting loading: ${operation}`, { message });
    setLoadingStates(prev => ({
      ...prev,
      [operation]: {
        isLoading: true,
        message,
        startTime: Date.now(),
        progress: 0
      }
    }));
  }, []);
  
  const updateProgress = useCallback((operation, progress, message) => {
    setLoadingStates(prev => {
      const current = prev[operation];
      if (!current) return prev;
      
      return {
        ...prev,
        [operation]: {
          ...current,
          progress,
          message: message || current.message
        }
      };
    });
  }, []);
  
  const finishLoading = useCallback((operation) => {
    setLoadingStates(prev => {
      const current = prev[operation];
      if (current) {
        const duration = Date.now() - current.startTime;
        logger.info(`Finished loading: ${operation}`, { duration });
      }
      
      const { [operation]: _, ...rest } = prev;
      return rest;
    });
  }, []);
  
  const getLoadingState = useCallback((operation) => {
    return loadingStates[operation] || { isLoading: false, progress: 0, message: '' };
  }, [loadingStates]);
  
  const isAnyLoading = useMemo(() => {
    return Object.values(loadingStates).some(state => state.isLoading);
  }, [loadingStates]);
  
  const activeOperations = useMemo(() => {
    return Object.keys(loadingStates);
  }, [loadingStates]);
  
  return {
    startLoading,
    updateProgress,
    finishLoading,
    getLoadingState,
    isAnyLoading,
    activeOperations
  };
};