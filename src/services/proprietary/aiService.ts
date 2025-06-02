import axios, { AxiosInstance } from 'axios';

// AI/ML Types and Interfaces
export interface AIProcessingResult {
  success: boolean;
  confidence: number;
  processingTime: number;
  results: any;
  error?: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  language: string;
  orientation: number;
}

export interface DocumentClassification {
  type: 'legal' | 'financial' | 'medical' | 'identity' | 'business' | 'other';
  subtype: string;
  confidence: number;
  features: string[];
  reasoning: string;
}

export interface EntityExtraction {
  entities: Array<{
    type: 'person' | 'organization' | 'location' | 'date' | 'money' | 'email' | 'phone' | 'id_number';
    value: string;
    confidence: number;
    position: { start: number; end: number };
  }>;
  relationships: Array<{
    entity1: string;
    entity2: string;
    relationship: string;
    confidence: number;
  }>;
}

export interface QualityAssessment {
  overallScore: number;
  factors: {
    clarity: number;
    resolution: number;
    lighting: number;
    orientation: number;
    completeness: number;
  };
  recommendations: string[];
  enhancementSuggestions: string[];
}

export interface FraudDetection {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  indicators: Array<{
    type: string;
    description: string;
    severity: number;
    confidence: number;
  }>;
  recommendations: string[];
}

export interface MetadataEnhancement {
  originalMetadata: Record<string, any>;
  enhancedMetadata: Record<string, any>;
  extractedData: Record<string, any>;
  confidence: number;
  processingNotes: string[];
}

export interface PredictiveAnalytics {
  processingTimeEstimate: number;
  qualityPrediction: number;
  successProbability: number;
  recommendedSettings: Record<string, any>;
  potentialIssues: string[];
}

class AIService {
  private apiClient: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.apiClient = axios.create({
      baseURL: `${this.baseURL}/api/ai`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth interceptor
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Computer Vision & OCR
  async performOCR(
    fileId: string,
    options?: {
      language?: string;
      enhanceImage?: boolean;
      extractTables?: boolean;
      detectHandwriting?: boolean;
    }
  ): Promise<OCRResult> {
    try {
      const response = await this.apiClient.post('/ocr', {
        fileId,
        options: {
          language: 'auto',
          enhanceImage: true,
          extractTables: true,
          detectHandwriting: true,
          ...options,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`OCR processing failed: ${error}`);
    }
  }

  async enhanceImageQuality(
    fileId: string,
    enhancements?: {
      denoising?: boolean;
      sharpening?: boolean;
      contrastAdjustment?: boolean;
      perspectiveCorrection?: boolean;
    }
  ): Promise<{ enhancedFileId: string; improvements: string[] }> {
    try {
      const response = await this.apiClient.post('/enhance-image', {
        fileId,
        enhancements: {
          denoising: true,
          sharpening: true,
          contrastAdjustment: true,
          perspectiveCorrection: true,
          ...enhancements,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Image enhancement failed: ${error}`);
    }
  }

  // Document Classification
  async classifyDocument(
    fileId: string,
    options?: {
      useCustomModel?: boolean;
      confidenceThreshold?: number;
      includeSubtypes?: boolean;
    }
  ): Promise<DocumentClassification> {
    try {
      const response = await this.apiClient.post('/classify', {
        fileId,
        options: {
          useCustomModel: false,
          confidenceThreshold: 0.8,
          includeSubtypes: true,
          ...options,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Document classification failed: ${error}`);
    }
  }

  async trainCustomClassifier(
    trainingData: Array<{
      fileId: string;
      documentType: string;
      subtype?: string;
      features?: string[];
    }>,
    modelName: string
  ): Promise<{ modelId: string; accuracy: number; trainingTime: number }> {
    try {
      const response = await this.apiClient.post('/train-classifier', {
        trainingData,
        modelName,
        hyperparameters: {
          epochs: 100,
          batchSize: 32,
          learningRate: 0.001,
          validationSplit: 0.2,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Custom classifier training failed: ${error}`);
    }
  }

  // Entity Extraction & NLP
  async extractEntities(
    text: string,
    options?: {
      entityTypes?: string[];
      includeRelationships?: boolean;
      language?: string;
    }
  ): Promise<EntityExtraction> {
    try {
      const response = await this.apiClient.post('/extract-entities', {
        text,
        options: {
          entityTypes: ['person', 'organization', 'location', 'date', 'money', 'email', 'phone'],
          includeRelationships: true,
          language: 'auto',
          ...options,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Entity extraction failed: ${error}`);
    }
  }

  async summarizeDocument(
    text: string,
    options?: {
      maxLength?: number;
      extractKeyPoints?: boolean;
      includeTopics?: boolean;
    }
  ): Promise<{
    summary: string;
    keyPoints: string[];
    topics: string[];
    confidence: number;
  }> {
    try {
      const response = await this.apiClient.post('/summarize', {
        text,
        options: {
          maxLength: 500,
          extractKeyPoints: true,
          includeTopics: true,
          ...options,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Document summarization failed: ${error}`);
    }
  }

  // Quality Assessment
  async assessDocumentQuality(
    fileId: string,
    options?: {
      includeRecommendations?: boolean;
      detailedAnalysis?: boolean;
    }
  ): Promise<QualityAssessment> {
    try {
      const response = await this.apiClient.post('/assess-quality', {
        fileId,
        options: {
          includeRecommendations: true,
          detailedAnalysis: true,
          ...options,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Quality assessment failed: ${error}`);
    }
  }

  async predictQuality(
    fileMetadata: Record<string, any>
  ): Promise<{
    predictedScore: number;
    confidence: number;
    factors: Record<string, number>;
    recommendations: string[];
  }> {
    try {
      const response = await this.apiClient.post('/predict-quality', {
        metadata: fileMetadata,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Quality prediction failed: ${error}`);
    }
  }

  // Fraud Detection
  async detectFraud(
    fileId: string,
    options?: {
      checkTypes?: string[];
      sensitivityLevel?: 'low' | 'medium' | 'high';
      includeExplanation?: boolean;
    }
  ): Promise<FraudDetection> {
    try {
      const response = await this.apiClient.post('/detect-fraud', {
        fileId,
        options: {
          checkTypes: ['tampering', 'forgery', 'duplication', 'inconsistency'],
          sensitivityLevel: 'medium',
          includeExplanation: true,
          ...options,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Fraud detection failed: ${error}`);
    }
  }

  // Metadata Enhancement
  async enhanceMetadata(
    fileId: string,
    existingMetadata: Record<string, any>,
    options?: {
      extractAdditionalFields?: boolean;
      validateExisting?: boolean;
      enrichFromExternal?: boolean;
    }
  ): Promise<MetadataEnhancement> {
    try {
      const response = await this.apiClient.post('/enhance-metadata', {
        fileId,
        existingMetadata,
        options: {
          extractAdditionalFields: true,
          validateExisting: true,
          enrichFromExternal: false,
          ...options,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Metadata enhancement failed: ${error}`);
    }
  }

  // Predictive Analytics
  async getPredictiveAnalytics(
    fileMetadata: Record<string, any>,
    historicalData?: Record<string, any>
  ): Promise<PredictiveAnalytics> {
    try {
      const response = await this.apiClient.post('/predictive-analytics', {
        fileMetadata,
        historicalData,
        analysisTypes: [
          'processing_time',
          'quality_prediction',
          'success_probability',
          'optimization_suggestions',
        ],
      });
      return response.data;
    } catch (error) {
      throw new Error(`Predictive analytics failed: ${error}`);
    }
  }

  async getProcessingTimeEstimate(
    fileMetadata: Record<string, any>
  ): Promise<{
    estimatedTime: number;
    confidence: number;
    factors: Record<string, number>;
  }> {
    try {
      const response = await this.apiClient.post('/estimate-processing-time', {
        metadata: fileMetadata,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Processing time estimation failed: ${error}`);
    }
  }

  // Batch Processing
  async processBatch(
    fileIds: string[],
    operations: Array<{
      type: 'ocr' | 'classify' | 'enhance' | 'fraud_detect' | 'quality_assess';
      options?: Record<string, any>;
    }>
  ): Promise<{
    batchId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    results: Record<string, AIProcessingResult>;
    progress: number;
  }> {
    try {
      const response = await this.apiClient.post('/batch-process', {
        fileIds,
        operations,
        priority: 'normal',
      });
      return response.data;
    } catch (error) {
      throw new Error(`Batch processing failed: ${error}`);
    }
  }

  async getBatchStatus(batchId: string): Promise<{
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress: number;
    results: Record<string, AIProcessingResult>;
    estimatedCompletion?: Date;
  }> {
    try {
      const response = await this.apiClient.get(`/batch-status/${batchId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get batch status: ${error}`);
    }
  }

  // Model Management
  async getAvailableModels(): Promise<Array<{
    id: string;
    name: string;
    type: 'classification' | 'ocr' | 'fraud_detection' | 'quality_assessment';
    accuracy: number;
    version: string;
    isActive: boolean;
    trainingDate: Date;
  }>> {
    try {
      const response = await this.apiClient.get('/models');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get available models: ${error}`);
    }
  }

  async getModelPerformance(modelId: string): Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: number[][];
    performanceTrend: Array<{ date: Date; accuracy: number }>;
  }> {
    try {
      const response = await this.apiClient.get(`/models/${modelId}/performance`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get model performance: ${error}`);
    }
  }

  // AI Analytics
  async getAIAnalytics(timeRange: { start: Date; end: Date }): Promise<{
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
  }> {
    try {
      const response = await this.apiClient.post('/analytics', {
        timeRange,
        metrics: [
          'processing_volume',
          'confidence_scores',
          'processing_times',
          'accuracy_trends',
          'operation_breakdown',
          'error_rates',
        ],
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get AI analytics: ${error}`);
    }
  }

  // Utility Methods
  async validateAIConfiguration(): Promise<{
    isValid: boolean;
    services: Record<string, { available: boolean; latency: number }>;
    recommendations: string[];
  }> {
    try {
      const response = await this.apiClient.get('/validate-config');
      return response.data;
    } catch (error) {
      throw new Error(`AI configuration validation failed: ${error}`);
    }
  }

  async getAICapabilities(): Promise<{
    ocr: { languages: string[]; formats: string[] };
    classification: { types: string[]; customModels: boolean };
    entityExtraction: { types: string[]; languages: string[] };
    fraudDetection: { methods: string[]; accuracy: number };
    qualityAssessment: { factors: string[]; realTime: boolean };
  }> {
    try {
      const response = await this.apiClient.get('/capabilities');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get AI capabilities: ${error}`);
    }
  }
}

export default new AIService(); 