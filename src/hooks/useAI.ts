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

// Check if we're in demo mode (no backend available)
const isDemoMode = () => {
  return process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_URL;
};

// Mock data for demo mode
const mockAnalytics = {
  totalProcessed: 12847,
  averageConfidence: 0.94,
  processingTimeStats: {
    average: 2.3,
    median: 1.8,
    p95: 4.2
  },
  accuracyTrend: [
    { date: new Date('2024-01-01'), accuracy: 0.92 },
    { date: new Date('2024-01-02'), accuracy: 0.94 },
    { date: new Date('2024-01-03'), accuracy: 0.96 },
    { date: new Date('2024-01-04'), accuracy: 0.95 },
    { date: new Date('2024-01-05'), accuracy: 0.97 }
  ],
  operationBreakdown: {
    'OCR': 45,
    'Classification': 25,
    'Fraud Detection': 15,
    'Quality Assessment': 15
  },
  errorRate: 0.03
};

const mockModels = [
  {
    id: 'ocr-v2',
    name: 'Advanced OCR Model',
    type: 'ocr' as const,
    accuracy: 0.97,
    version: '2.1.0',
    isActive: true,
    trainingDate: new Date('2024-01-15')
  },
  {
    id: 'classifier-v1',
    name: 'Document Classifier',
    type: 'classification' as const,
    accuracy: 0.94,
    version: '1.3.2',
    isActive: true,
    trainingDate: new Date('2024-01-10')
  },
  {
    id: 'fraud-detector-v1',
    name: 'Fraud Detection Model',
    type: 'fraud_detection' as const,
    accuracy: 0.89,
    version: '1.0.5',
    isActive: true,
    trainingDate: new Date('2024-01-08')
  }
];

const mockConfiguration = {
  isValid: true,
  services: {
    'OCR Service': { available: true, latency: 120 },
    'Classification Service': { available: true, latency: 85 },
    'Fraud Detection': { available: true, latency: 200 },
    'Quality Assessment': { available: true, latency: 95 }
  },
  recommendations: [
    'Consider upgrading OCR model for better accuracy',
    'Enable real-time fraud detection for critical documents'
  ]
};

const mockCapabilities = {
  ocr: { 
    languages: ['en', 'es', 'fr', 'de', 'it', 'pt'], 
    formats: ['PDF', 'JPEG', 'PNG', 'TIFF', 'BMP'] 
  },
  classification: { 
    types: ['invoice', 'contract', 'receipt', 'form', 'letter'], 
    customModels: true 
  },
  entityExtraction: { 
    types: ['person', 'organization', 'location', 'date', 'amount'], 
    languages: ['en', 'es', 'fr'] 
  },
  fraudDetection: { 
    methods: ['pattern_analysis', 'anomaly_detection', 'signature_verification'], 
    accuracy: 0.89 
  },
  qualityAssessment: { 
    factors: ['resolution', 'clarity', 'orientation', 'completeness'], 
    realTime: true 
  }
};

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
      if (isDemoMode()) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockResult: OCRResult = {
          text: 'Sample extracted text from document...',
          confidence: 0.95,
          language: options?.language || 'en',
          boundingBoxes: [
            {
              text: 'Sample',
              x: 10,
              y: 20,
              width: 60,
              height: 15,
              confidence: 0.95
            },
            {
              text: 'extracted',
              x: 75,
              y: 20,
              width: 80,
              height: 15,
              confidence: 0.93
            },
            {
              text: 'text',
              x: 160,
              y: 20,
              width: 40,
              height: 15,
              confidence: 0.97
            }
          ],
          orientation: 0
        };
        setResult(mockResult);
        return mockResult;
      } else {
        const ocrResult = await aiService.performOCR(fileId, options);
        setResult(ocrResult);
        return ocrResult;
      }
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
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockResult: DocumentClassification = {
          type: 'financial',
          confidence: 0.92,
          subtype: 'commercial_invoice',
          features: ['monetary_values', 'date_fields', 'table_structure', 'company_header'],
          reasoning: 'Document contains structured financial data with clear monetary values and invoice formatting'
        };
        setClassification(mockResult);
        return mockResult;
      } else {
        const result = await aiService.classifyDocument(fileId, options);
        setClassification(result);
        return result;
      }
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
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
          modelId: `custom-${modelName}`,
          accuracy: 0.94,
          trainingTime: 2000,
          status: 'completed'
        };
      } else {
        const result = await aiService.trainCustomClassifier(trainingData, modelName);
        return result;
      }
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
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 600));
        const mockResult: EntityExtraction = {
          entities: [
            { type: 'person', value: 'John Smith', confidence: 0.95, position: { start: 0, end: 10 } },
            { type: 'organization', value: 'Acme Corp', confidence: 0.88, position: { start: 20, end: 29 } },
            { type: 'date', value: '2024-01-15', confidence: 0.92, position: { start: 35, end: 45 } }
          ],
          relationships: options?.includeRelationships ? [
            { entity1: 'John Smith', entity2: 'Acme Corp', relationship: 'works_for', confidence: 0.85 }
          ] : []
        };
        setEntities(mockResult);
        return mockResult;
      } else {
        const result = await aiService.extractEntities(text, options);
        setEntities(result);
        return result;
      }
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
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          summary: 'This document contains important business information...',
          keyPoints: options?.extractKeyPoints ? [
            'Contract terms and conditions',
            'Payment schedule details',
            'Delivery requirements'
          ] : [],
          topics: options?.includeTopics ? ['business', 'legal', 'finance'] : [],
          confidence: 0.91
        };
      } else {
        const result = await aiService.summarizeDocument(text, options);
        return result;
      }
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
      checkResolution?: boolean;
      detectBlur?: boolean;
      analyzeOrientation?: boolean;
      validateCompleteness?: boolean;
    }
  ) => {
    setIsAssessing(true);
    setError(null);
    try {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 700));
        const mockResult: QualityAssessment = {
          overallScore: 0.87,
          factors: {
            resolution: 0.92,
            clarity: 0.85,
            lighting: 0.90,
            orientation: 0.95,
            completeness: 0.78
          },
          recommendations: [
            'Consider rescanning with higher resolution',
            'Ensure document is fully within frame'
          ],
          enhancementSuggestions: [
            'Apply image sharpening filter',
            'Adjust brightness and contrast'
          ]
        };
        setAssessment(mockResult);
        return mockResult;
      } else {
        // Map hook options to service options
        const serviceOptions = {
          includeRecommendations: true,
          detailedAnalysis: !!(options?.checkResolution || options?.detectBlur || options?.analyzeOrientation || options?.validateCompleteness)
        };
        const result = await aiService.assessDocumentQuality(fileId, serviceOptions);
        setAssessment(result);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Quality assessment failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAssessing(false);
    }
  }, []);

  const predictQuality = useCallback(async (
    fileMetadata: {
      fileName: string;
      fileSize: number;
      fileType: string;
    }
  ) => {
    try {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Simulate quality prediction based on file metadata
        let predictedScore = 0.8; // Base score
        
        // Adjust based on file type
        if (fileMetadata.fileType.includes('pdf')) {
          predictedScore += 0.1; // PDFs generally have good quality
        } else if (fileMetadata.fileType.includes('image/jpeg') || fileMetadata.fileType.includes('image/png')) {
          predictedScore += 0.05; // Good image formats
        } else if (fileMetadata.fileType.includes('image/gif')) {
          predictedScore -= 0.1; // GIFs may have quality issues
        }
        
        // Adjust based on file size (larger files often have better quality)
        if (fileMetadata.fileSize > 5 * 1024 * 1024) { // > 5MB
          predictedScore += 0.05;
        } else if (fileMetadata.fileSize < 500 * 1024) { // < 500KB
          predictedScore -= 0.1;
        }
        
        // Add some randomness for demo
        predictedScore += (Math.random() - 0.5) * 0.2;
        predictedScore = Math.max(0.1, Math.min(1.0, predictedScore));
        
        return {
          predictedScore,
          confidence: 0.75 + Math.random() * 0.2,
          factors: {
            fileType: fileMetadata.fileType.includes('pdf') ? 'excellent' : 'good',
            fileSize: fileMetadata.fileSize > 1024 * 1024 ? 'adequate' : 'small',
            fileName: fileMetadata.fileName.toLowerCase().includes('scan') ? 'scan_detected' : 'normal'
          },
          recommendations: predictedScore < 0.7 ? [
            'File may benefit from enhancement before processing',
            'Consider using higher quality source if available'
          ] : [
            'File appears suitable for processing',
            'Good quality expected'
          ]
        };
      } else {
        const result = await aiService.predictQuality(fileMetadata);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Quality prediction failed';
      setError(errorMessage);
      throw err;
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
    isAssessing,
    assessment,
    error,
    reset,
  };
};

// Fraud Detection Hook
export const useFraudDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detection, setDetection] = useState<FraudDetection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectFraud = useCallback(async (
    fileId: string,
    options?: {
      checkSignatures?: boolean;
      analyzePatterns?: boolean;
      validateMetadata?: boolean;
      compareDatabase?: boolean;
    }
  ) => {
    setIsDetecting(true);
    setError(null);
    try {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        const mockResult: FraudDetection = {
          riskScore: 0.15,
          riskLevel: 'low',
          indicators: [
            {
              type: 'signature_analysis',
              severity: 0.2,
              description: 'Signature appears consistent with known patterns',
              confidence: 0.92
            }
          ],
          recommendations: [
            'Document appears legitimate',
            'No immediate action required'
          ]
        };
        setDetection(mockResult);
        return mockResult;
      } else {
        // Map hook options to service options
        const serviceOptions = {
          checkTypes: options?.checkSignatures ? ['signatures'] : undefined,
          sensitivityLevel: 'medium' as const,
          includeExplanation: true
        };
        const result = await aiService.detectFraud(fileId, serviceOptions);
        setDetection(result);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fraud detection failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDetection(null);
    setError(null);
    setIsDetecting(false);
  }, []);

  return {
    detectFraud,
    isDetecting,
    detection,
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
    options?: {
      extractDates?: boolean;
      identifyParties?: boolean;
      categorizeContent?: boolean;
      generateTags?: boolean;
    }
  ) => {
    setIsEnhancing(true);
    setError(null);
    try {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 900));
        const mockResult: MetadataEnhancement = {
          originalMetadata: {
            fileName: 'document.pdf',
            fileSize: 1024000,
            createdDate: new Date('2024-01-15')
          },
          enhancedMetadata: {
            title: 'Business Contract Agreement',
            author: 'Legal Department',
            creationDate: new Date('2024-01-15'),
            lastModified: new Date('2024-01-16'),
            documentType: 'contract',
            category: 'legal',
            tags: ['business', 'agreement', 'legal', 'contract'],
            parties: ['Acme Corp', 'Beta Industries'],
            keyDates: [
              { type: 'effective_date', date: new Date('2024-02-01') },
              { type: 'expiration_date', date: new Date('2025-02-01') }
            ],
            confidenceScore: 0.89
          },
          extractedData: {
            contractValue: '$50,000',
            duration: '12 months',
            jurisdiction: 'California',
            signatureCount: 2
          },
          confidence: 0.89,
          processingNotes: [
            'Successfully extracted contract metadata',
            'High confidence in party identification',
            'Date extraction completed with 95% accuracy'
          ]
        };
        setEnhancement(mockResult);
        return mockResult;
      } else {
        // Provide empty existing metadata and map options
        const existingMetadata = {};
        const serviceOptions = {
          extractAdditionalFields: options?.extractDates || options?.identifyParties || options?.categorizeContent || options?.generateTags,
          validateExisting: true,
          enrichFromExternal: false
        };
        const result = await aiService.enhanceMetadata(fileId, existingMetadata, serviceOptions);
        setEnhancement(result);
        return result;
      }
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
    data: {
      documentTypes: string[];
      timeRange: { start: Date; end: Date };
      includeForecasting?: boolean;
      includeTrends?: boolean;
    }
  ) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockResult: PredictiveAnalytics = {
          processingTimeEstimate: 45,
          qualityPrediction: 0.87,
          successProbability: 0.94,
          recommendedSettings: {
            enhanceImage: data.documentTypes.includes('image'),
            useAdvancedOCR: true,
            fraudSensitivity: 'medium',
            batchSize: 10
          },
          potentialIssues: [
            'Peak processing times may cause delays',
            'Large file sizes may require additional processing time'
          ]
        };
        setAnalytics(mockResult);
        return mockResult;
      } else {
        const result = await aiService.getPredictiveAnalytics(data);
        setAnalytics(result);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Predictive analytics failed';
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
    isAnalyzing,
    analytics,
    error,
    reset,
  };
};

// Batch Processing Hook
export const useBatchProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchStatus, setBatchStatus] = useState<Record<string, {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    result?: AIProcessingResult;
    error?: string;
  }>>({});
  const [error, setError] = useState<string | null>(null);

  const processBatch = useCallback(async (
    fileIds: string[],
    operations: Array<'ocr' | 'classification' | 'fraud_detection' | 'quality_assessment'>,
    options?: {
      priority?: 'low' | 'normal' | 'high';
      notifyOnComplete?: boolean;
      maxConcurrent?: number;
    }
  ) => {
    setIsProcessing(true);
    setError(null);
    
    // Initialize batch status
    const initialStatus = fileIds.reduce((acc, fileId) => {
      acc[fileId] = { status: 'pending', progress: 0 };
      return acc;
    }, {} as typeof batchStatus);
    setBatchStatus(initialStatus);

    try {
      if (isDemoMode()) {
        // Simulate batch processing
        for (const fileId of fileIds) {
          setBatchStatus(prev => ({
            ...prev,
            [fileId]: { status: 'processing', progress: 0 }
          }));

          // Simulate progress updates
          for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise(resolve => setTimeout(resolve, 200));
            setBatchStatus(prev => ({
              ...prev,
              [fileId]: { status: 'processing', progress }
            }));
          }

          // Complete processing
          setBatchStatus(prev => ({
            ...prev,
            [fileId]: {
              status: 'completed',
              progress: 100,
              result: {
                success: true,
                confidence: 0.9 + Math.random() * 0.1,
                processingTime: 1500,
                results: {
                  fileId,
                  operations: operations.map(op => ({
                    type: op,
                    status: 'completed',
                    confidence: 0.9 + Math.random() * 0.1,
                    processingTime: 500 + Math.random() * 1000
                  })),
                  totalProcessingTime: 1500,
                  overallConfidence: 0.92
                }
              }
            }
          }));
        }
        return { batchId: 'demo-batch-' + Date.now(), status: 'completed' };
      } else {
        // Convert operations to the format expected by the service
        const serviceOperations = operations.map(op => ({
          type: op as 'ocr' | 'classify' | 'enhance' | 'fraud_detect' | 'quality_assess',
          options: {}
        }));
        const result = await aiService.processBatch(fileIds, serviceOperations);
        return result;
      }
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
      if (isDemoMode()) {
        return { batchId, status: 'completed', progress: 100 };
      } else {
        const result = await aiService.getBatchStatus(batchId);
        return result;
      }
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
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAnalytics(mockAnalytics);
        return mockAnalytics;
      } else {
        const result = await aiService.getAIAnalytics(timeRange);
        setAnalytics(result);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI analytics';
      setError(errorMessage);
      // In demo mode, still return mock data even if there's an error
      if (isDemoMode()) {
        setAnalytics(mockAnalytics);
        setError(null);
        return mockAnalytics;
      }
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
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setModels(mockModels);
        return mockModels;
      } else {
        const result = await aiService.getAvailableModels();
        setModels(result);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get available models';
      setError(errorMessage);
      // In demo mode, still return mock data even if there's an error
      if (isDemoMode()) {
        setModels(mockModels);
        setError(null);
        return mockModels;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getModelPerformance = useCallback(async (modelId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 400));
        return {
          modelId,
          accuracy: 0.94,
          precision: 0.92,
          recall: 0.96,
          f1Score: 0.94,
          processingSpeed: 1.8,
          lastEvaluated: new Date()
        };
      } else {
        const result = await aiService.getModelPerformance(modelId);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get model performance';
      setError(errorMessage);
      if (isDemoMode()) {
        setError(null);
        return {
          modelId,
          accuracy: 0.94,
          precision: 0.92,
          recall: 0.96,
          f1Score: 0.94,
          processingSpeed: 1.8,
          lastEvaluated: new Date()
        };
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAvailableModels().catch(() => {
      // Error already handled in the function
    });
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
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setConfiguration(mockConfiguration);
        return mockConfiguration;
      } else {
        const result = await aiService.validateAIConfiguration();
        setConfiguration(result);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI configuration validation failed';
      setError(errorMessage);
      // In demo mode, still return mock data even if there's an error
      if (isDemoMode()) {
        setConfiguration(mockConfiguration);
        setError(null);
        return mockConfiguration;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCapabilities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setCapabilities(mockCapabilities);
        return mockCapabilities;
      } else {
        const result = await aiService.getAICapabilities();
        setCapabilities(result);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI capabilities';
      setError(errorMessage);
      // In demo mode, still return mock data even if there's an error
      if (isDemoMode()) {
        setCapabilities(mockCapabilities);
        setError(null);
        return mockCapabilities;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    validateConfiguration().catch(() => {
      // Error already handled in the function
    });
    getCapabilities().catch(() => {
      // Error already handled in the function
    });
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