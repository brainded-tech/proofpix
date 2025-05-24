import { useState, useCallback } from 'react';

interface Error {
  id: string;
  message: string;
  timestamp: number;
}

export const useErrorHandler = () => {
  const [errors, setErrors] = useState<Error[]>([]);

  const addError = useCallback((message: string) => {
    const newError = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: Date.now()
    };
    setErrors(prev => [...prev, newError]);
  }, []);

  const clearError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    addError,
    clearError,
    clearAllErrors
  };
}; 