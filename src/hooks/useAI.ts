import { useState, useEffect, useCallback } from 'react';
import aiService, {
  OCRResult,
  DocumentClassification,
  EntityExtraction,
  QualityAssessment,
  FraudDetection,
  MetadataEnhancement,
  PredictiveAnalytics,
  AIProcessingResult,
} from '../services/aiService';

// OCR Hook
export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performOCR = useCallback(async (
    fileId: string,
    options?: {
      language?: string;
      enhanceImage?: boolean;
      extractTables?: boolean;
      detectHandwriting?: boolean;
    }
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      const ocrResult = await aiService.performOCR(fileId, options);
      setResult(ocrResult);
      return ocrResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OCR processing failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    performOCR,
    isProcessing,
    result,
    error,
    reset,
  };
};

// Document Classification Hook
export const useDocumentClassification = () => {
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState<DocumentClassification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classifyDocument = useCallback(async (
    fileId: string,
    options?: {
      useCustomModel?: boolean;
      confidenceThreshold?: number;
      includeSubtypes?: boolean;
    }
  ) => {
    setIsClassifying(true);
    setError(null);
    try {
      const result = await aiService.classifyDocument(fileId, options);
      setClassification(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Document classification failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsClassifying(false);
    }
  }, []);

  const trainCustomClassifier = useCallback(async (
    trainingData: Array<{
      fileId: string;
      documentType: string;
      subtype?: string;
      features?: string[];
    }>,
    modelName: string
  ) => {
    setIsClassifying(true);
    setError(null);
    try {
      const result = await aiService.trainCustomClassifier(trainingData, modelName);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Custom classifier training failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsClassifying(false);
    }
  }, []);

  const reset = useCallback(() => {
    setClassification(null);
    setError(null);
    setIsClassifying(false);
  }, []);

  return {
    classifyDocument,
    trainCustomClassifier,
    isClassifying,
    classification,
    error,
    reset,
  };
};

// Entity Extraction Hook
export const useEntityExtraction = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [entities, setEntities] = useState<EntityExtraction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractEntities = useCallback(async (
    text: string,
    options?: {
      entityTypes?: string[];
      includeRelationships?: boolean;
      language?: string;
    }
  ) => {
    setIsExtracting(true);
    setError(null);
    try {
      const result = await aiService.extractEntities(text, options);
      setEntities(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Entity extraction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const summarizeDocument = useCallback(async (
    text: string,
    options?: {
      maxLength?: number;
      extractKeyPoints?: boolean;
      includeTopics?: boolean;
    }
  ) => {
    setIsExtracting(true);
    setError(null);
    try {
      const result = await aiService.summarizeDocument(text, options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Document summarization failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setEntities(null);
    setError(null);
    setIsExtracting(false);
  }, []);

  return {
    extractEntities,
    summarizeDocument,
    isExtracting,
    entities,
    error,
    reset,
  };
};

// Quality Assessment Hook
export const useQualityAssessment = () => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessment, setAssessment] = useState<QualityAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const assessQuality = useCallback(async (
    fileId: string,
    options?: {
      includeRecommendations?: boolean;
      detailedAnalysis?: boolean;
    }
  ) => {
    setIsAssessing(true);
    setError(null);
    try {
      const result = await aiService.assessDocumentQuality(fileId, options);
      setAssessment(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Quality assessment failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAssessing(false);
    }
  }, []);

  const predictQuality = useCallback(async (fileMetadata: Record<string, any>) => {
    setIsAssessing(true);
    setError(null);
    try {
      const result = await aiService.predictQuality(fileMetadata);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Quality prediction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAssessing(false);
    }
  }, []);

  const enhanceImageQuality = useCallback(async (
    fileId: string,
    enhancements?: {
      denoising?: boolean;
      sharpening?: boolean;
      contrastAdjustment?: boolean;
      perspectiveCorrection?: boolean;
    }
  ) => {
    setIsAssessing(true);
    setError(null);
    try {
      const result = await aiService.enhanceImageQuality(fileId, enhancements);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image enhancement failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAssessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAssessment(null);
    setError(null);
    setIsAssessing(false);
  }, []);

  return {
    assessQuality,
    predictQuality,
    enhanceImageQuality,
    isAssessing,
    assessment,
    error,
    reset,
  };
};

// Fraud Detection Hook
export const useFraudDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [fraudResult, setFraudResult] = useState<FraudDetection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectFraud = useCallback(async (
    fileId: string,
    options?: {
      checkTypes?: string[];
      sensitivityLevel?: 'low' | 'medium' | 'high';
      includeExplanation?: boolean;
    }
  ) => {
    setIsDetecting(true);
    setError(null);
    try {
      const result = await aiService.detectFraud(fileId, options);
      setFraudResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fraud detection failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setFraudResult(null);
    setError(null);
    setIsDetecting(false);
  }, []);

  return {
    detectFraud,
    isDetecting,
    fraudResult,
    error,
    reset,
  };
};

// Metadata Enhancement Hook
export const useMetadataEnhancement = () => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancement, setEnhancement] = useState<MetadataEnhancement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enhanceMetadata = useCallback(async (
    fileId: string,
    existingMetadata: Record<string, any>,
    options?: {
      extractAdditionalFields?: boolean;
      validateExisting?: boolean;
      enrichFromExternal?: boolean;
    }
  ) => {
    setIsEnhancing(true);
    setError(null);
    try {
      const result = await aiService.enhanceMetadata(fileId, existingMetadata, options);
      setEnhancement(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Metadata enhancement failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEnhancing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setEnhancement(null);
    setError(null);
    setIsEnhancing(false);
  }, []);

  return {
    enhanceMetadata,
    isEnhancing,
    enhancement,
    error,
    reset,
  };
};

// Predictive Analytics Hook
export const usePredictiveAnalytics = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analytics, setAnalytics] = useState<PredictiveAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPredictiveAnalytics = useCallback(async (
    fileMetadata: Record<string, any>,
    historicalData?: Record<string, any>
  ) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await aiService.getPredictiveAnalytics(fileMetadata, historicalData);
      setAnalytics(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Predictive analytics failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const getProcessingTimeEstimate = useCallback(async (fileMetadata: Record<string, any>) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await aiService.getProcessingTimeEstimate(fileMetadata);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Processing time estimation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalytics(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return {
    getPredictiveAnalytics,
    getProcessingTimeEstimate,
    isAnalyzing,
    analytics,
    error,
    reset,
  };
};

// Batch Processing Hook
export const useBatchProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchStatus, setBatchStatus] = useState<{
    batchId?: string;
    status?: 'queued' | 'processing' | 'completed' | 'failed';
    progress?: number;
    results?: Record<string, AIProcessingResult>;
    estimatedCompletion?: Date;
  }>({});
  const [error, setError] = useState<string | null>(null);

  const processBatch = useCallback(async (
    fileIds: string[],
    operations: Array<{
      type: 'ocr' | 'classify' | 'enhance' | 'fraud_detect' | 'quality_assess';
      options?: Record<string, any>;
    }>
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await aiService.processBatch(fileIds, operations);
      setBatchStatus(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch processing failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getBatchStatus = useCallback(async (batchId: string) => {
    try {
      const result = await aiService.getBatchStatus(batchId);
      setBatchStatus(prev => ({ ...prev, ...result }));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get batch status';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setBatchStatus({});
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    processBatch,
    getBatchStatus,
    isProcessing,
    batchStatus,
    error,
    reset,
  };
};

// AI Analytics Hook
export const useAIAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<{
    totalProcessed: number;
    averageConfidence: number;
    processingTimeStats: {
      average: number;
      median: number;
      p95: number;
    };
    accuracyTrend: Array<{ date: Date; accuracy: number }>;
    operationBreakdown: Record<string, number>;
    errorRate: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAIAnalytics = useCallback(async (timeRange: { start: Date; end: Date }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.getAIAnalytics(timeRange);
      setAnalytics(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI analytics';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalytics(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    getAIAnalytics,
    isLoading,
    analytics,
    error,
    reset,
  };
};

// AI Models Hook
export const useAIModels = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<Array<{
    id: string;
    name: string;
    type: 'classification' | 'ocr' | 'fraud_detection' | 'quality_assessment';
    accuracy: number;
    version: string;
    isActive: boolean;
    trainingDate: Date;
  }>>([]);
  const [error, setError] = useState<string | null>(null);

  const getAvailableModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.getAvailableModels();
      setModels(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get available models';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getModelPerformance = useCallback(async (modelId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.getModelPerformance(modelId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get model performance';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAvailableModels();
  }, [getAvailableModels]);

  const reset = useCallback(() => {
    setModels([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    getAvailableModels,
    getModelPerformance,
    isLoading,
    models,
    error,
    reset,
  };
};

// AI Configuration Hook
export const useAIConfiguration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [configuration, setConfiguration] = useState<{
    isValid: boolean;
    services: Record<string, { available: boolean; latency: number }>;
    recommendations: string[];
  } | null>(null);
  const [capabilities, setCapabilities] = useState<{
    ocr: { languages: string[]; formats: string[] };
    classification: { types: string[]; customModels: boolean };
    entityExtraction: { types: string[]; languages: string[] };
    fraudDetection: { methods: string[]; accuracy: number };
    qualityAssessment: { factors: string[]; realTime: boolean };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateConfiguration = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.validateAIConfiguration();
      setConfiguration(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI configuration validation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCapabilities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.getAICapabilities();
      setCapabilities(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI capabilities';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    validateConfiguration();
    getCapabilities();
  }, [validateConfiguration, getCapabilities]);

  const reset = useCallback(() => {
    setConfiguration(null);
    setCapabilities(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    validateConfiguration,
    getCapabilities,
    isLoading,
    configuration,
    capabilities,
    error,
    reset,
  };
}; 