import { useState, useCallback } from 'react';
import businessIntelligenceService from '../services/businessIntelligenceService';

export const useCustomerBehavior = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCustomerBehavior = useCallback(async (customerId: string, timeRange: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await businessIntelligenceService.analyzeCustomerBehavior(customerId, timeRange);
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { analyzeCustomerBehavior, isLoading, data, error };
};

export const usePerformanceForecast = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateForecast = useCallback(async (timeframe: any, metrics: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await businessIntelligenceService.generatePerformanceForecast(timeframe, metrics);
      setForecast(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Forecast failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generateForecast, isLoading, forecast, error };
};

export const useBusinessMetrics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const getMetrics = useCallback(async (timeRange: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await businessIntelligenceService.getBusinessMetrics(timeRange);
      setMetrics(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Metrics failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getMetrics, isLoading, metrics, error };
}; 