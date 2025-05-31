import axios, { AxiosInstance } from 'axios';

// Business Intelligence Types and Interfaces
export interface CustomerBehaviorAnalysis {
  customerId: string;
  behaviorProfile: {
    documentTypes: Record<string, number>;
    processingPatterns: {
      peakHours: number[];
      averageVolume: number;
      seasonality: Record<string, number>;
    };
    qualityTrends: {
      averageQuality: number;
      improvementRate: number;
      consistencyScore: number;
    };
    fraudPatterns: {
      riskLevel: 'low' | 'medium' | 'high';
      flaggedDocuments: number;
      falsePositiveRate: number;
    };
  };
  predictions: {
    nextMonthVolume: number;
    churnProbability: number;
    upgradeRecommendation: string;
    retentionScore: number;
  };
  insights: string[];
}

export interface UsagePatternAnalysis {
  timePatterns: {
    hourlyDistribution: Array<{ hour: number; volume: number }>;
    dailyDistribution: Array<{ day: string; volume: number }>;
    monthlyTrends: Array<{ month: string; volume: number; growth: number }>;
  };
  documentPatterns: {
    typeDistribution: Record<string, { count: number; percentage: number }>;
    qualityDistribution: Record<string, number>;
    processingTimeDistribution: Record<string, number>;
  };
  userSegments: Array<{
    segment: string;
    characteristics: string[];
    size: number;
    revenue: number;
    churnRate: number;
  }>;
  anomalies: Array<{
    type: 'volume_spike' | 'quality_drop' | 'processing_delay' | 'fraud_increase';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: Date;
    impact: string;
  }>;
}

export interface PerformanceForecast {
  timeframe: '1_week' | '1_month' | '3_months' | '6_months' | '1_year';
  predictions: {
    volumeForecast: Array<{ date: Date; predicted: number; confidence: number }>;
    qualityForecast: Array<{ date: Date; predicted: number; confidence: number }>;
    resourceNeeds: {
      processingCapacity: number;
      storageRequirements: number;
      bandwidthNeeds: number;
    };
    costProjections: {
      infrastructure: number;
      processing: number;
      storage: number;
      total: number;
    };
  };
  recommendations: Array<{
    category: 'scaling' | 'optimization' | 'cost_reduction' | 'quality_improvement';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    expectedImpact: string;
    implementationCost: number;
  }>;
  riskFactors: Array<{
    risk: string;
    probability: number;
    impact: string;
    mitigation: string;
  }>;
}

export interface BusinessMetrics {
  revenue: {
    current: number;
    projected: number;
    growth: number;
    breakdown: Record<string, number>;
  };
  customers: {
    total: number;
    active: number;
    new: number;
    churned: number;
    retentionRate: number;
    lifetimeValue: number;
  };
  operations: {
    documentsProcessed: number;
    averageProcessingTime: number;
    successRate: number;
    errorRate: number;
    fraudDetectionRate: number;
  };
  efficiency: {
    costPerDocument: number;
    automationRate: number;
    qualityScore: number;
    customerSatisfaction: number;
  };
}

export interface MarketIntelligence {
  industryTrends: Array<{
    trend: string;
    impact: 'positive' | 'negative' | 'neutral';
    confidence: number;
    timeframe: string;
    description: string;
  }>;
  competitiveAnalysis: {
    marketPosition: string;
    strengths: string[];
    opportunities: string[];
    threats: string[];
  };
  customerInsights: {
    satisfactionScore: number;
    npsScore: number;
    feedbackSentiment: 'positive' | 'neutral' | 'negative';
    topRequests: string[];
    painPoints: string[];
  };
}

export interface PredictiveModel {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering' | 'forecasting';
  accuracy: number;
  lastTrained: Date;
  features: string[];
  predictions: Array<{
    metric: string;
    value: number;
    confidence: number;
    timeframe: string;
  }>;
}

class BusinessIntelligenceService {
  private apiClient: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.apiClient = axios.create({
      baseURL: `${this.baseURL}/api/business-intelligence`,
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

  // Customer Behavior Analysis
  async analyzeCustomerBehavior(
    customerId: string,
    timeRange: { start: Date; end: Date }
  ): Promise<CustomerBehaviorAnalysis> {
    try {
      const response = await this.apiClient.post('/customer-behavior', {
        customerId,
        timeRange,
        analysisTypes: [
          'document_patterns',
          'processing_behavior',
          'quality_trends',
          'fraud_patterns',
          'predictions'
        ]
      });
      return response.data;
    } catch (error) {
      throw new Error(`Customer behavior analysis failed: ${error}`);
    }
  }

  async getCustomerSegmentation(): Promise<Array<{
    segment: string;
    size: number;
    characteristics: string[];
    averageRevenue: number;
    churnRate: number;
    growthPotential: number;
  }>> {
    try {
      const response = await this.apiClient.get('/customer-segmentation');
      return response.data;
    } catch (error) {
      throw new Error(`Customer segmentation failed: ${error}`);
    }
  }

  async predictCustomerChurn(customerId?: string): Promise<Array<{
    customerId: string;
    churnProbability: number;
    riskFactors: string[];
    retentionRecommendations: string[];
    timeToChurn: number;
  }>> {
    try {
      const response = await this.apiClient.post('/predict-churn', {
        customerId,
        includeRecommendations: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Churn prediction failed: ${error}`);
    }
  }

  // Usage Pattern Analysis
  async analyzeUsagePatterns(
    timeRange: { start: Date; end: Date },
    granularity: 'hour' | 'day' | 'week' | 'month' = 'day'
  ): Promise<UsagePatternAnalysis> {
    try {
      const response = await this.apiClient.post('/usage-patterns', {
        timeRange,
        granularity,
        includeAnomalies: true,
        includeSegmentation: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Usage pattern analysis failed: ${error}`);
    }
  }

  async detectAnomalies(
    metrics: string[],
    timeRange: { start: Date; end: Date }
  ): Promise<Array<{
    metric: string;
    anomalyType: 'spike' | 'drop' | 'trend_change' | 'outlier';
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: Date;
    value: number;
    expectedValue: number;
    description: string;
    possibleCauses: string[];
  }>> {
    try {
      const response = await this.apiClient.post('/detect-anomalies', {
        metrics,
        timeRange,
        sensitivity: 'medium',
        includeContext: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Anomaly detection failed: ${error}`);
    }
  }

  // Performance Forecasting
  async generatePerformanceForecast(
    timeframe: '1_week' | '1_month' | '3_months' | '6_months' | '1_year',
    metrics: string[]
  ): Promise<PerformanceForecast> {
    try {
      const response = await this.apiClient.post('/performance-forecast', {
        timeframe,
        metrics,
        includeRecommendations: true,
        includeRiskAnalysis: true,
        confidenceLevel: 0.95
      });
      return response.data;
    } catch (error) {
      throw new Error(`Performance forecasting failed: ${error}`);
    }
  }

  async predictResourceNeeds(
    timeframe: string,
    expectedGrowth?: number
  ): Promise<{
    processing: { current: number; predicted: number; scaling: string };
    storage: { current: number; predicted: number; scaling: string };
    bandwidth: { current: number; predicted: number; scaling: string };
    costs: { current: number; predicted: number; optimization: string[] };
  }> {
    try {
      const response = await this.apiClient.post('/predict-resources', {
        timeframe,
        expectedGrowth,
        includeOptimization: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Resource prediction failed: ${error}`);
    }
  }

  // Business Metrics & KPIs
  async getBusinessMetrics(
    timeRange: { start: Date; end: Date }
  ): Promise<BusinessMetrics> {
    try {
      const response = await this.apiClient.post('/business-metrics', {
        timeRange,
        includeProjections: true,
        includeBreakdowns: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Business metrics retrieval failed: ${error}`);
    }
  }

  async getKPIDashboard(): Promise<{
    kpis: Array<{
      name: string;
      value: number;
      target: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
      status: 'good' | 'warning' | 'critical';
    }>;
    alerts: Array<{
      type: 'performance' | 'quality' | 'cost' | 'customer';
      message: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      timestamp: Date;
    }>;
  }> {
    try {
      const response = await this.apiClient.get('/kpi-dashboard');
      return response.data;
    } catch (error) {
      throw new Error(`KPI dashboard retrieval failed: ${error}`);
    }
  }

  // Market Intelligence
  async getMarketIntelligence(): Promise<MarketIntelligence> {
    try {
      const response = await this.apiClient.get('/market-intelligence');
      return response.data;
    } catch (error) {
      throw new Error(`Market intelligence retrieval failed: ${error}`);
    }
  }

  async analyzeCompetitivePosition(): Promise<{
    marketShare: number;
    ranking: number;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  }> {
    try {
      const response = await this.apiClient.get('/competitive-analysis');
      return response.data;
    } catch (error) {
      throw new Error(`Competitive analysis failed: ${error}`);
    }
  }

  // Predictive Models
  async getPredictiveModels(): Promise<PredictiveModel[]> {
    try {
      const response = await this.apiClient.get('/predictive-models');
      return response.data;
    } catch (error) {
      throw new Error(`Predictive models retrieval failed: ${error}`);
    }
  }

  async trainPredictiveModel(
    modelConfig: {
      name: string;
      type: 'classification' | 'regression' | 'clustering' | 'forecasting';
      features: string[];
      target: string;
      trainingData?: any;
    }
  ): Promise<{
    modelId: string;
    accuracy: number;
    trainingTime: number;
    validationResults: any;
  }> {
    try {
      const response = await this.apiClient.post('/train-model', {
        ...modelConfig,
        hyperparameters: {
          epochs: 100,
          batchSize: 32,
          learningRate: 0.001,
          validationSplit: 0.2
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Model training failed: ${error}`);
    }
  }

  async getModelPredictions(
    modelId: string,
    inputData: any
  ): Promise<{
    predictions: Array<{
      value: number;
      confidence: number;
      explanation: string;
    }>;
    modelAccuracy: number;
    lastUpdated: Date;
  }> {
    try {
      const response = await this.apiClient.post(`/models/${modelId}/predict`, {
        inputData,
        includeExplanation: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Model prediction failed: ${error}`);
    }
  }

  // Advanced Analytics
  async getCohortAnalysis(
    cohortType: 'monthly' | 'weekly' | 'feature_based',
    timeRange: { start: Date; end: Date }
  ): Promise<{
    cohorts: Array<{
      cohortId: string;
      size: number;
      retentionRates: number[];
      revenuePerUser: number[];
      characteristics: string[];
    }>;
    insights: string[];
  }> {
    try {
      const response = await this.apiClient.post('/cohort-analysis', {
        cohortType,
        timeRange,
        includeInsights: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Cohort analysis failed: ${error}`);
    }
  }

  async getABTestResults(testId?: string): Promise<Array<{
    testId: string;
    name: string;
    status: 'running' | 'completed' | 'paused';
    variants: Array<{
      name: string;
      traffic: number;
      conversions: number;
      significance: number;
    }>;
    winner?: string;
    insights: string[];
  }>> {
    try {
      const response = await this.apiClient.get('/ab-test-results', {
        params: { testId }
      });
      return response.data;
    } catch (error) {
      throw new Error(`A/B test results retrieval failed: ${error}`);
    }
  }

  // Real-time Analytics
  async getRealTimeMetrics(): Promise<{
    activeUsers: number;
    documentsProcessing: number;
    systemLoad: number;
    errorRate: number;
    averageResponseTime: number;
    recentAlerts: Array<{
      type: string;
      message: string;
      timestamp: Date;
    }>;
  }> {
    try {
      const response = await this.apiClient.get('/real-time-metrics');
      return response.data;
    } catch (error) {
      throw new Error(`Real-time metrics retrieval failed: ${error}`);
    }
  }

  async subscribeToRealTimeUpdates(
    callback: (data: any) => void,
    metrics: string[]
  ): Promise<() => void> {
    // WebSocket subscription for real-time updates
    const ws = new WebSocket(`${this.baseURL.replace('http', 'ws')}/ws/real-time-analytics`);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', metrics }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    // Return unsubscribe function
    return () => {
      ws.close();
    };
  }

  // Export & Reporting
  async generateReport(
    reportType: 'executive' | 'operational' | 'financial' | 'technical',
    timeRange: { start: Date; end: Date },
    format: 'pdf' | 'excel' | 'json' = 'pdf'
  ): Promise<{
    reportId: string;
    downloadUrl: string;
    generatedAt: Date;
  }> {
    try {
      const response = await this.apiClient.post('/generate-report', {
        reportType,
        timeRange,
        format,
        includeCharts: true,
        includeRecommendations: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Report generation failed: ${error}`);
    }
  }

  async exportData(
    dataType: 'analytics' | 'customers' | 'transactions' | 'models',
    filters: Record<string, any> = {},
    format: 'csv' | 'json' | 'excel' = 'csv'
  ): Promise<{
    exportId: string;
    downloadUrl: string;
    recordCount: number;
  }> {
    try {
      const response = await this.apiClient.post('/export-data', {
        dataType,
        filters,
        format
      });
      return response.data;
    } catch (error) {
      throw new Error(`Data export failed: ${error}`);
    }
  }
}

export default new BusinessIntelligenceService(); 