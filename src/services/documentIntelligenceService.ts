import axios, { AxiosInstance } from 'axios';

// Document Intelligence Types and Interfaces
export interface DocumentClassificationResult {
  documentId: string;
  primaryType: 'legal' | 'financial' | 'medical' | 'identity' | 'business' | 'technical' | 'other';
  subType: string;
  confidence: number;
  features: Array<{
    name: string;
    value: string;
    confidence: number;
    importance: number;
  }>;
  reasoning: string;
  suggestedActions: string[];
  processingRecommendations: {
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimatedTime: number;
    requiredSteps: string[];
    qualityChecks: string[];
  };
}

export interface SmartRecommendation {
  id: string;
  type: 'processing' | 'quality' | 'workflow' | 'compliance' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  effort: 'minimal' | 'moderate' | 'significant' | 'extensive';
  category: string;
  applicableDocuments: string[];
  implementation: {
    steps: string[];
    estimatedTime: number;
    resources: string[];
    prerequisites: string[];
  };
  expectedOutcome: {
    qualityImprovement: number;
    timeReduction: number;
    costSavings: number;
    riskReduction: number;
  };
}

export interface WorkflowAutomation {
  id: string;
  name: string;
  description: string;
  triggers: Array<{
    type: 'document_type' | 'quality_score' | 'content_pattern' | 'metadata_value';
    condition: string;
    value: any;
  }>;
  actions: Array<{
    type: 'route_to_queue' | 'apply_template' | 'notify_user' | 'auto_approve' | 'flag_review';
    parameters: Record<string, any>;
    order: number;
  }>;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'matches_pattern';
    value: any;
  }>;
  isActive: boolean;
  performance: {
    documentsProcessed: number;
    successRate: number;
    averageTimeSaved: number;
    errorRate: number;
  };
}

export interface ContextualAnalysis {
  documentId: string;
  context: {
    businessContext: string;
    industryRelevance: string;
    complianceRequirements: string[];
    riskFactors: string[];
  };
  contentAnalysis: {
    keyEntities: Array<{
      type: string;
      value: string;
      confidence: number;
      relevance: number;
    }>;
    topics: Array<{
      name: string;
      relevance: number;
      keywords: string[];
    }>;
    sentiment: {
      overall: 'positive' | 'neutral' | 'negative';
      confidence: number;
      aspects: Record<string, number>;
    };
    complexity: {
      score: number;
      factors: string[];
      readabilityLevel: string;
    };
  };
  recommendations: {
    processing: string[];
    compliance: string[];
    quality: string[];
    workflow: string[];
  };
}

export interface DocumentTemplate {
  id: string;
  name: string;
  documentType: string;
  fields: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'file';
    required: boolean;
    validation: string;
    defaultValue?: any;
  }>;
  processingRules: Array<{
    condition: string;
    action: string;
    priority: number;
  }>;
  qualityChecks: Array<{
    name: string;
    description: string;
    automated: boolean;
    threshold: number;
  }>;
  compliance: {
    standards: string[];
    requirements: string[];
    validationRules: string[];
  };
  usage: {
    timesUsed: number;
    successRate: number;
    averageProcessingTime: number;
  };
}

export interface IntelligentInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'optimization' | 'compliance' | 'quality';
  title: string;
  description: string;
  confidence: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  affectedDocuments: string[];
  dataPoints: Array<{
    metric: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
    significance: number;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimatedImpact: string;
    implementationCost: 'low' | 'medium' | 'high';
  }>;
  timestamp: Date;
}

class DocumentIntelligenceService {
  private apiClient: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.apiClient = axios.create({
      baseURL: `${this.baseURL}/api/document-intelligence`,
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

  // Advanced Document Classification
  async classifyDocument(
    documentId: string,
    options?: {
      useCustomModel?: boolean;
      includeSubTypes?: boolean;
      confidenceThreshold?: number;
      contextualAnalysis?: boolean;
    }
  ): Promise<DocumentClassificationResult> {
    try {
      const response = await this.apiClient.post('/classify', {
        documentId,
        options: {
          useCustomModel: options?.useCustomModel ?? true,
          includeSubTypes: options?.includeSubTypes ?? true,
          confidenceThreshold: options?.confidenceThreshold ?? 0.8,
          contextualAnalysis: options?.contextualAnalysis ?? true,
          includeRecommendations: true,
          analyzeFeatures: true
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Document classification failed: ${error}`);
    }
  }

  async trainCustomClassifier(
    trainingData: Array<{
      documentId: string;
      documentType: string;
      subType?: string;
      features?: Record<string, any>;
      labels?: string[];
    }>,
    modelConfig: {
      name: string;
      description?: string;
      hyperparameters?: Record<string, any>;
    }
  ): Promise<{
    modelId: string;
    accuracy: number;
    trainingTime: number;
    validationResults: {
      precision: number;
      recall: number;
      f1Score: number;
      confusionMatrix: number[][];
    };
  }> {
    try {
      const response = await this.apiClient.post('/train-classifier', {
        trainingData,
        modelConfig: {
          ...modelConfig,
          hyperparameters: {
            epochs: 100,
            batchSize: 32,
            learningRate: 0.001,
            validationSplit: 0.2,
            ...modelConfig.hyperparameters
          }
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Classifier training failed: ${error}`);
    }
  }

  // Smart Recommendations Engine
  async generateSmartRecommendations(
    documentId: string,
    context?: {
      userRole?: string;
      businessContext?: string;
      urgency?: 'low' | 'medium' | 'high' | 'urgent';
      constraints?: string[];
    }
  ): Promise<SmartRecommendation[]> {
    try {
      const response = await this.apiClient.post('/recommendations', {
        documentId,
        context,
        includeImplementation: true,
        includeImpactAnalysis: true,
        maxRecommendations: 10
      });
      return response.data;
    } catch (error) {
      throw new Error(`Smart recommendations generation failed: ${error}`);
    }
  }

  async getRecommendationsByCategory(
    category: 'processing' | 'quality' | 'workflow' | 'compliance' | 'optimization',
    filters?: {
      impact?: string[];
      effort?: string[];
      confidence?: number;
      timeRange?: { start: Date; end: Date };
    }
  ): Promise<SmartRecommendation[]> {
    try {
      const response = await this.apiClient.get('/recommendations/category', {
        params: { category, ...filters }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Category recommendations retrieval failed: ${error}`);
    }
  }

  async implementRecommendation(
    recommendationId: string,
    parameters?: Record<string, any>
  ): Promise<{
    success: boolean;
    implementationId: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    results?: any;
    estimatedCompletion?: Date;
  }> {
    try {
      const response = await this.apiClient.post(`/recommendations/${recommendationId}/implement`, {
        parameters,
        trackProgress: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Recommendation implementation failed: ${error}`);
    }
  }

  // Workflow Automation
  async createWorkflowAutomation(
    workflow: Omit<WorkflowAutomation, 'id' | 'performance'>
  ): Promise<{ workflowId: string; isActive: boolean }> {
    try {
      const response = await this.apiClient.post('/workflows', {
        ...workflow,
        validateRules: true,
        testMode: false
      });
      return response.data;
    } catch (error) {
      throw new Error(`Workflow automation creation failed: ${error}`);
    }
  }

  async getWorkflowAutomations(
    filters?: {
      isActive?: boolean;
      documentType?: string;
      performance?: 'high' | 'medium' | 'low';
    }
  ): Promise<WorkflowAutomation[]> {
    try {
      const response = await this.apiClient.get('/workflows', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw new Error(`Workflow automations retrieval failed: ${error}`);
    }
  }

  async updateWorkflowAutomation(
    workflowId: string,
    updates: Partial<WorkflowAutomation>
  ): Promise<{ success: boolean; workflow: WorkflowAutomation }> {
    try {
      const response = await this.apiClient.put(`/workflows/${workflowId}`, {
        ...updates,
        validateChanges: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Workflow automation update failed: ${error}`);
    }
  }

  async testWorkflowAutomation(
    workflowId: string,
    testDocuments: string[]
  ): Promise<{
    results: Array<{
      documentId: string;
      triggered: boolean;
      actions: Array<{ action: string; success: boolean; result: any }>;
      processingTime: number;
    }>;
    summary: {
      successRate: number;
      averageProcessingTime: number;
      errors: string[];
    };
  }> {
    try {
      const response = await this.apiClient.post(`/workflows/${workflowId}/test`, {
        testDocuments,
        includeDetails: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Workflow automation testing failed: ${error}`);
    }
  }

  // Contextual Analysis
  async performContextualAnalysis(
    documentId: string,
    analysisOptions?: {
      includeEntities?: boolean;
      includeSentiment?: boolean;
      includeTopics?: boolean;
      includeCompliance?: boolean;
      businessContext?: string;
    }
  ): Promise<ContextualAnalysis> {
    try {
      const response = await this.apiClient.post('/contextual-analysis', {
        documentId,
        options: {
          includeEntities: analysisOptions?.includeEntities ?? true,
          includeSentiment: analysisOptions?.includeSentiment ?? true,
          includeTopics: analysisOptions?.includeTopics ?? true,
          includeCompliance: analysisOptions?.includeCompliance ?? true,
          businessContext: analysisOptions?.businessContext,
          generateRecommendations: true
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Contextual analysis failed: ${error}`);
    }
  }

  async analyzeDocumentBatch(
    documentIds: string[],
    analysisType: 'classification' | 'contextual' | 'recommendations' | 'all'
  ): Promise<{
    batchId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    results: Record<string, any>;
    progress: number;
    estimatedCompletion?: Date;
  }> {
    try {
      const response = await this.apiClient.post('/batch-analysis', {
        documentIds,
        analysisType,
        priority: 'normal',
        notifyOnCompletion: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Batch analysis failed: ${error}`);
    }
  }

  // Document Templates & Standards
  async createDocumentTemplate(
    template: Omit<DocumentTemplate, 'id' | 'usage'>
  ): Promise<{ templateId: string; isValid: boolean }> {
    try {
      const response = await this.apiClient.post('/templates', {
        ...template,
        validateFields: true,
        testProcessing: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Document template creation failed: ${error}`);
    }
  }

  async getDocumentTemplates(
    filters?: {
      documentType?: string;
      compliance?: string[];
      usage?: 'high' | 'medium' | 'low';
    }
  ): Promise<DocumentTemplate[]> {
    try {
      const response = await this.apiClient.get('/templates', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw new Error(`Document templates retrieval failed: ${error}`);
    }
  }

  async applyTemplate(
    documentId: string,
    templateId: string,
    customizations?: Record<string, any>
  ): Promise<{
    success: boolean;
    appliedFields: string[];
    validationResults: Array<{
      field: string;
      isValid: boolean;
      message?: string;
    }>;
    processingRecommendations: string[];
  }> {
    try {
      const response = await this.apiClient.post(`/templates/${templateId}/apply`, {
        documentId,
        customizations,
        validateAfterApplication: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Template application failed: ${error}`);
    }
  }

  // Intelligent Insights
  async generateIntelligentInsights(
    scope: 'document' | 'workflow' | 'system' | 'all',
    filters?: {
      timeRange?: { start: Date; end: Date };
      documentTypes?: string[];
      severity?: string[];
      includeRecommendations?: boolean;
    }
  ): Promise<IntelligentInsight[]> {
    try {
      const response = await this.apiClient.post('/insights', {
        scope,
        filters: {
          ...filters,
          includeRecommendations: filters?.includeRecommendations ?? true
        },
        analysisDepth: 'comprehensive'
      });
      return response.data;
    } catch (error) {
      throw new Error(`Intelligent insights generation failed: ${error}`);
    }
  }

  async getInsightsByType(
    type: 'pattern' | 'anomaly' | 'optimization' | 'compliance' | 'quality'
  ): Promise<IntelligentInsight[]> {
    try {
      const response = await this.apiClient.get(`/insights/type/${type}`);
      return response.data;
    } catch (error) {
      throw new Error(`Insights by type retrieval failed: ${error}`);
    }
  }

  // Advanced NLP & Content Analysis
  async extractKeyInformation(
    documentId: string,
    extractionRules?: {
      entities?: string[];
      patterns?: string[];
      customFields?: Array<{
        name: string;
        pattern: string;
        type: string;
      }>;
    }
  ): Promise<{
    extractedData: Record<string, any>;
    confidence: Record<string, number>;
    suggestions: string[];
    validationResults: Array<{
      field: string;
      isValid: boolean;
      confidence: number;
      suggestions?: string[];
    }>;
  }> {
    try {
      const response = await this.apiClient.post('/extract-information', {
        documentId,
        extractionRules,
        includeValidation: true,
        includeSuggestions: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Key information extraction failed: ${error}`);
    }
  }

  async compareDocuments(
    documentIds: string[],
    comparisonType: 'content' | 'structure' | 'metadata' | 'all'
  ): Promise<{
    similarities: Array<{
      document1: string;
      document2: string;
      similarity: number;
      commonElements: string[];
      differences: string[];
    }>;
    clusters: Array<{
      documents: string[];
      commonCharacteristics: string[];
      representativeDocument: string;
    }>;
    recommendations: string[];
  }> {
    try {
      const response = await this.apiClient.post('/compare-documents', {
        documentIds,
        comparisonType,
        includeRecommendations: true,
        clusterSimilar: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Document comparison failed: ${error}`);
    }
  }

  // Performance & Analytics
  async getDocumentIntelligenceAnalytics(
    timeRange: { start: Date; end: Date }
  ): Promise<{
    classification: {
      totalDocuments: number;
      averageConfidence: number;
      typeDistribution: Record<string, number>;
      accuracyTrend: Array<{ date: Date; accuracy: number }>;
    };
    recommendations: {
      totalGenerated: number;
      implementationRate: number;
      averageImpact: number;
      categoryBreakdown: Record<string, number>;
    };
    workflows: {
      totalAutomations: number;
      successRate: number;
      timeSaved: number;
      errorRate: number;
    };
    insights: {
      totalGenerated: number;
      actionablePercentage: number;
      severityDistribution: Record<string, number>;
      resolutionRate: number;
    };
  }> {
    try {
      const response = await this.apiClient.post('/analytics', {
        timeRange,
        includeBreakdowns: true,
        includeTrends: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Document intelligence analytics failed: ${error}`);
    }
  }

  async exportIntelligenceData(
    dataType: 'classifications' | 'recommendations' | 'workflows' | 'insights' | 'all',
    format: 'csv' | 'json' | 'excel' = 'csv',
    filters?: Record<string, any>
  ): Promise<{
    exportId: string;
    downloadUrl: string;
    recordCount: number;
    generatedAt: Date;
  }> {
    try {
      const response = await this.apiClient.post('/export', {
        dataType,
        format,
        filters,
        includeMetadata: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Intelligence data export failed: ${error}`);
    }
  }
}

export default new DocumentIntelligenceService(); 