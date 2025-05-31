import { API_CONFIG } from '../config/api.config';

// ===== ENHANCED DATA MODELS FOR PRIORITY 2 DATABASE LAYER =====

// User types for API responses
export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'enterprise' | 'standard' | 'free';
  subscription?: {
    plan: string;
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: string;
  };
  usage?: {
    filesProcessed: number;
    monthlyLimit: number;
    resetDate: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    autoExport: boolean;
  };
  createdAt: string;
  lastLoginAt?: string;
}

// ===== NEW: COMPREHENSIVE SUBSCRIPTION DATA MODEL =====
export interface SubscriptionData {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  metadata: {
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    paymentMethodId?: string;
  };
  pricing: {
    amount: number;
    currency: string;
    interval: 'month' | 'year';
    intervalCount: number;
  };
  features: {
    filesPerMonth: number;
    batchProcessing: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
    advancedAnalytics: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ===== NEW: COMPREHENSIVE USAGE TRACKING DATA MODEL =====
export interface UsageTrackingData {
  id: string;
  userId: string;
  subscriptionId: string;
  period: {
    start: Date;
    end: Date;
    type: 'monthly' | 'yearly' | 'daily';
  };
  metrics: {
    filesProcessed: number;
    dataProcessed: number; // in bytes
    apiCalls: number;
    batchJobs: number;
    storageUsed: number; // in bytes
    exportOperations: number;
  };
  limits: {
    filesPerMonth: number;
    dataPerMonth: number;
    apiCallsPerDay: number;
    storageLimit: number;
  };
  overages: {
    files: number;
    data: number;
    apiCalls: number;
    storage: number;
  };
  resetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===== NEW: COMPREHENSIVE ANALYTICS DATA MODEL =====
export interface AnalyticsData {
  id: string;
  userId: string;
  timeRange: {
    start: Date;
    end: Date;
    granularity: 'hour' | 'day' | 'week' | 'month';
  };
  metrics: {
    totalFiles: number;
    totalSize: number;
    privacyRisksDetected: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
    fileTypes: Record<string, number>;
    processingTimes: {
      average: number;
      median: number;
      p95: number;
      p99: number;
    };
    errorRates: {
      total: number;
      byType: Record<string, number>;
    };
  };
  trends: {
    filesProcessed: Array<{ date: Date; count: number }>;
    dataVolume: Array<{ date: Date; bytes: number }>;
    privacyRisks: Array<{ date: Date; risk: string; count: number }>;
  };
  insights: {
    topRiskTypes: Array<{ type: string; count: number; percentage: number }>;
    peakUsageHours: Array<{ hour: number; count: number }>;
    deviceTypes: Record<string, number>;
    locationData: {
      hasGPS: number;
      noGPS: number;
      countries: Record<string, number>;
    };
  };
  createdAt: Date;
}

// ===== NEW: BILLING AND INVOICE DATA MODELS =====
export interface BillingData {
  id: string;
  userId: string;
  subscriptionId: string;
  invoices: InvoiceData[];
  paymentMethods: PaymentMethodData[];
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  taxInfo: {
    taxId?: string;
    taxExempt: boolean;
    taxRates: Array<{ rate: number; type: string; jurisdiction: string }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceData {
  id: string;
  subscriptionId: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amount: {
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
  };
  period: {
    start: Date;
    end: Date;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    unitAmount: number;
    totalAmount: number;
  }>;
  dueDate: Date;
  paidAt?: Date;
  metadata: {
    stripeInvoiceId?: string;
    downloadUrl?: string;
  };
  createdAt: Date;
}

export interface PaymentMethodData {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  isDefault: boolean;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  bankAccount?: {
    bankName: string;
    last4: string;
    accountType: string;
  };
  metadata: {
    stripePaymentMethodId?: string;
  };
  createdAt: Date;
}

// ===== EXISTING INTERFACES (ENHANCED) =====
export interface AuthResponse {
  token: string;
  user: ApiUser;
  subscription?: SubscriptionData;
  usage?: UsageTrackingData;
}

export interface ExifData {
  camera?: {
    make?: string;
    model?: string;
    software?: string;
  };
  settings?: {
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
    flash?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
  };
  timestamp?: {
    dateTime?: string;
    dateTimeOriginal?: string;
    dateTimeDigitized?: string;
  };
}

export interface ExifResponse {
  exif: ExifData;
  fileInfo: {
    name: string;
    size: number;
    type: string;
    lastModified: string;
  };
}

export interface DashboardStats {
  filesProcessed: number;
  totalSize: number;
  privacyRisksFound: number;
  lastActivity: string;
  monthlyUsage: {
    current: number;
    limit: number;
    resetDate: string;
  };
  recentFiles: Array<{
    id: string;
    name: string;
    processedAt: string;
    privacyRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    size: number;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
  requestId?: string;
}

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Content Validation Service Types
export interface ContentValidationRequest {
  content: string;
  contentType: 'markdown' | 'html' | 'text';
  validationRules?: string[];
  metadata?: Record<string, any>;
}

export interface ContentValidationResponse {
  isValid: boolean;
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
    column?: number;
    rule?: string;
  }>;
  suggestions: string[];
  metrics: {
    readabilityScore: number;
    seoScore: number;
    accessibilityScore: number;
    qualityScore: number;
  };
}

// Quality Metrics Types
export interface QualityMetrics {
  id: string;
  contentId: string;
  timestamp: Date;
  metrics: {
    readability: number;
    seo: number;
    accessibility: number;
    performance: number;
    engagement: number;
  };
  trends: {
    period: '24h' | '7d' | '30d';
    change: number;
    direction: 'up' | 'down' | 'stable';
  };
}

// Link Validation Types
export interface LinkValidationRequest {
  urls: string[];
  options?: {
    timeout?: number;
    followRedirects?: boolean;
    checkContent?: boolean;
  };
}

export interface LinkValidationResponse {
  results: Array<{
    url: string;
    status: 'valid' | 'invalid' | 'warning' | 'pending';
    statusCode?: number;
    responseTime?: number;
    error?: string;
    redirectChain?: string[];
    lastChecked: Date;
  }>;
  summary: {
    total: number;
    valid: number;
    invalid: number;
    warnings: number;
  };
}

// Content Analytics Types
export interface ContentAnalytics {
  contentId: string;
  views: number;
  uniqueViews: number;
  timeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  socialShares: number;
  comments: number;
  ratings: {
    average: number;
    count: number;
    distribution: Record<string, number>;
  };
  performance: {
    loadTime: number;
    interactivity: number;
    visualStability: number;
  };
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private requestInterceptors: Array<(config: RequestInit) => RequestInit> = [];
  private responseInterceptors: Array<(response: Response) => Response | Promise<Response>> = [];

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.defaultTimeout = API_CONFIG.timeout;
    this.defaultRetries = 3;
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: (config: RequestInit) => RequestInit) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: (response: Response) => Response | Promise<Response>) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Create API error from response
   */
  private async createApiError(response: Response, requestId?: string): Promise<ApiError> {
    let errorData: any = {};
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = { message: await response.text() };
      }
    } catch {
      errorData = { message: 'Unknown error occurred' };
    }

    const error = new Error(errorData.message || `HTTP ${response.status}`) as ApiError;
    error.status = response.status;
    error.code = errorData.code;
    error.details = errorData.details;
    error.requestId = requestId;

    return error;
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = 1000,
      signal,
      ...fetchOptions
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Apply request interceptors
    let config: RequestInit = {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        ...fetchOptions.headers,
      },
    };

    for (const interceptor of this.requestInterceptors) {
      config = interceptor(config);
    }

    // Create timeout controller
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeout);

    // Combine signals
    const combinedSignal = signal ? this.combineAbortSignals([signal, timeoutController.signal]) : timeoutController.signal;

    let lastError: ApiError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...config,
          signal: combinedSignal,
        });

        clearTimeout(timeoutId);

        // Apply response interceptors
        let processedResponse = response;
        for (const interceptor of this.responseInterceptors) {
          processedResponse = await interceptor(processedResponse);
        }

        if (!processedResponse.ok) {
          const error = await this.createApiError(processedResponse, requestId);
          
          // Don't retry on client errors (4xx)
          if (processedResponse.status >= 400 && processedResponse.status < 500) {
            throw error;
          }
          
          lastError = error;
          
          // Retry on server errors (5xx) and network errors
          if (attempt < retries) {
            await this.sleep(retryDelay * Math.pow(2, attempt)); // Exponential backoff
            continue;
          }
          
          throw error;
        }

        const data = await processedResponse.json();
        
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          requestId,
        };

      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
          const apiError = new Error('Request timeout') as ApiError;
          apiError.code = 'TIMEOUT';
          apiError.requestId = requestId;
          throw apiError;
        }

        lastError = error as ApiError;

        if (attempt < retries) {
          await this.sleep(retryDelay * Math.pow(2, attempt));
          continue;
        }

        throw lastError;
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  /**
   * Combine multiple AbortSignals
   */
  private combineAbortSignals(signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort();
        break;
      }
      signal.addEventListener('abort', () => controller.abort());
    }

    return controller.signal;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    options?: RequestOptions & {
      onProgress?: (progress: UploadProgress) => void;
      additionalData?: Record<string, any>;
    }
  ): Promise<ApiResponse<T>> {
    const { onProgress, additionalData, ...requestOptions } = options || {};

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      const requestId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      formData.append('file', file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
        });
      }

      // Upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            };
            onProgress(progress);
          }
        });
      }

      // Handle completion
      xhr.addEventListener('load', () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve({
              success: true,
              data,
              timestamp: new Date().toISOString(),
              requestId,
            });
          } else {
            const error = new Error(`Upload failed: ${xhr.statusText}`) as ApiError;
            error.status = xhr.status;
            error.requestId = requestId;
            reject(error);
          }
        } catch (error) {
          const apiError = new Error('Failed to parse response') as ApiError;
          apiError.requestId = requestId;
          reject(apiError);
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        const error = new Error('Upload failed') as ApiError;
        error.requestId = requestId;
        reject(error);
      });

      // Handle timeout
      xhr.addEventListener('timeout', () => {
        const error = new Error('Upload timeout') as ApiError;
        error.code = 'TIMEOUT';
        error.requestId = requestId;
        reject(error);
      });

      // Handle abort
      xhr.addEventListener('abort', () => {
        const error = new Error('Upload aborted') as ApiError;
        error.code = 'ABORTED';
        error.requestId = requestId;
        reject(error);
      });

      // Set timeout
      xhr.timeout = requestOptions?.timeout || this.defaultTimeout;

      // Set headers
      xhr.setRequestHeader('X-Request-ID', requestId);
      if (requestOptions?.headers) {
        Object.entries(requestOptions.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      // Start upload
      xhr.open('POST', `${this.baseUrl}${endpoint}`);
      xhr.send(formData);

      // Handle abort signal
      if (requestOptions?.signal) {
        requestOptions.signal.addEventListener('abort', () => {
          xhr.abort();
        });
      }
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get('/health');
  }

  /**
   * Get API status
   */
  async getStatus(): Promise<ApiResponse<{ 
    status: string; 
    version: string; 
    uptime: number;
    endpoints: string[];
  }>> {
    return this.get('/api/status');
  }

  // Content Validation Service
  async validateContent(request: ContentValidationRequest): Promise<ContentValidationResponse> {
    const response = await this.post<ContentValidationResponse>('/api/content/validate', request);
    return response.data!;
  }

  // Quality Metrics Storage and Retrieval
  async storeQualityMetrics(metrics: Omit<QualityMetrics, 'id' | 'timestamp'>): Promise<QualityMetrics> {
    const response = await this.post<QualityMetrics>('/api/quality/metrics', metrics);
    return response.data!;
  }

  async getQualityMetrics(contentId: string, period?: '24h' | '7d' | '30d'): Promise<QualityMetrics[]> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    
    const response = await this.get<QualityMetrics[]>(`/api/quality/metrics/${contentId}?${params}`);
    return response.data!;
  }

  async getQualityTrends(contentIds: string[], period: '24h' | '7d' | '30d' = '7d'): Promise<Record<string, QualityMetrics[]>> {
    const response = await this.post<Record<string, QualityMetrics[]>>('/api/quality/trends', { contentIds, period });
    return response.data!;
  }

  // Link Validation Service
  async validateLinks(request: LinkValidationRequest): Promise<LinkValidationResponse> {
    const response = await this.post<LinkValidationResponse>('/api/links/validate', request);
    return response.data!;
  }

  async getLinkStatus(urls: string[]): Promise<LinkValidationResponse> {
    const params = new URLSearchParams();
    urls.forEach(url => params.append('url', url));
    
    const response = await this.get<LinkValidationResponse>(`/api/links/status?${params}`);
    return response.data!;
  }

  async scheduleLinkCheck(urls: string[], schedule: 'hourly' | 'daily' | 'weekly'): Promise<{ jobId: string }> {
    const response = await this.post<{ jobId: string }>('/api/links/schedule', { urls, schedule });
    return response.data!;
  }

  // Content Analytics and Reporting
  async getContentAnalytics(contentId: string, period?: '24h' | '7d' | '30d'): Promise<ContentAnalytics> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    
    const response = await this.get<ContentAnalytics>(`/api/analytics/content/${contentId}?${params}`);
    return response.data!;
  }

  async getBulkContentAnalytics(contentIds: string[], period?: '24h' | '7d' | '30d'): Promise<Record<string, ContentAnalytics>> {
    const response = await this.post<Record<string, ContentAnalytics>>('/api/analytics/content/bulk', { contentIds, period });
    return response.data!;
  }

  async trackContentEvent(contentId: string, event: string, metadata?: Record<string, any>): Promise<void> {
    await this.post<void>('/api/analytics/events', { contentId, event, metadata, timestamp: new Date() });
  }

  async generateContentReport(options: {
    contentIds?: string[];
    period: '24h' | '7d' | '30d';
    metrics: string[];
    format: 'json' | 'csv' | 'pdf';
  }): Promise<{ reportId: string; downloadUrl?: string }> {
    const response = await this.post<{ reportId: string; downloadUrl?: string }>('/api/analytics/reports', options);
    return response.data!;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Add default request interceptor for authentication
apiClient.addRequestInterceptor((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  return config;
});

// Add response interceptor for error logging
apiClient.addResponseInterceptor((response) => {
  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText}`, {
      url: response.url,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    });
  }
  return response;
});

// Specific API methods
export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> =>
      apiClient.post('/api/auth/login', credentials),
    
    register: (userData: { email: string; password: string; name: string }): Promise<ApiResponse<AuthResponse>> =>
      apiClient.post('/api/auth/register', userData),
    
    logout: (): Promise<ApiResponse<void>> =>
      apiClient.post('/api/auth/logout'),
    
    refreshToken: (): Promise<ApiResponse<{ token: string }>> =>
      apiClient.post('/api/auth/refresh'),
    
    me: (): Promise<ApiResponse<ApiUser>> =>
      apiClient.get('/api/auth/me'),
  },

  // ===== NEW: COMPREHENSIVE SUBSCRIPTION MANAGEMENT =====
  subscriptions: {
    // Get current subscription
    getCurrent: (): Promise<ApiResponse<SubscriptionData>> =>
      apiClient.get('/api/subscriptions/current'),
    
    // Get subscription by ID
    getById: (id: string): Promise<ApiResponse<SubscriptionData>> =>
      apiClient.get(`/api/subscriptions/${id}`),
    
    // Get subscription history
    getHistory: (options?: { limit?: number; offset?: number }): Promise<ApiResponse<SubscriptionData[]>> =>
      apiClient.get(`/api/subscriptions/history${options ? `?limit=${options.limit}&offset=${options.offset}` : ''}`),
    
    // Create new subscription
    create: (data: { planId: string; paymentMethodId?: string }): Promise<ApiResponse<SubscriptionData>> =>
      apiClient.post('/api/subscriptions', data),
    
    // Update subscription
    update: (id: string, data: Partial<SubscriptionData>): Promise<ApiResponse<SubscriptionData>> =>
      apiClient.put(`/api/subscriptions/${id}`, data),
    
    // Cancel subscription
    cancel: (id: string, options?: { cancelAtPeriodEnd?: boolean; reason?: string }): Promise<ApiResponse<SubscriptionData>> =>
      apiClient.post(`/api/subscriptions/${id}/cancel`, options),
    
    // Reactivate subscription
    reactivate: (id: string): Promise<ApiResponse<SubscriptionData>> =>
      apiClient.post(`/api/subscriptions/${id}/reactivate`),
    
    // Change plan
    changePlan: (id: string, data: { newPlanId: string; prorationBehavior?: 'create_prorations' | 'none' }): Promise<ApiResponse<SubscriptionData>> =>
      apiClient.post(`/api/subscriptions/${id}/change-plan`, data),
    
    // Get available plans
    getPlans: (): Promise<ApiResponse<Array<{ id: string; name: string; features: any; pricing: any }>>> =>
      apiClient.get('/api/subscriptions/plans'),
  },

  // ===== NEW: COMPREHENSIVE USAGE TRACKING =====
  usage: {
    // Get current usage
    getCurrent: (): Promise<ApiResponse<UsageTrackingData>> =>
      apiClient.get('/api/usage/current'),
    
    // Get usage by period
    getByPeriod: (start: Date, end: Date): Promise<ApiResponse<UsageTrackingData[]>> =>
      apiClient.get(`/api/usage/period?start=${start.toISOString()}&end=${end.toISOString()}`),
    
    // Get usage history
    getHistory: (options?: { limit?: number; offset?: number; granularity?: 'daily' | 'monthly' }): Promise<ApiResponse<UsageTrackingData[]>> =>
      apiClient.get(`/api/usage/history${options ? `?${new URLSearchParams(options as any).toString()}` : ''}`),
    
    // Track usage event
    track: (event: { 
      type: 'file_processed' | 'api_call' | 'batch_job' | 'export_operation';
      metadata: { fileSize?: number; processingTime?: number; [key: string]: any };
    }): Promise<ApiResponse<void>> =>
      apiClient.post('/api/usage/track', event),
    
    // Get usage limits
    getLimits: (): Promise<ApiResponse<UsageTrackingData['limits']>> =>
      apiClient.get('/api/usage/limits'),
    
    // Get usage alerts
    getAlerts: (): Promise<ApiResponse<Array<{ type: string; threshold: number; current: number; triggered: boolean }>>> =>
      apiClient.get('/api/usage/alerts'),
    
    // Set usage alerts
    setAlerts: (alerts: Array<{ type: string; threshold: number; enabled: boolean }>): Promise<ApiResponse<void>> =>
      apiClient.post('/api/usage/alerts', { alerts }),
  },

  // ===== NEW: COMPREHENSIVE ANALYTICS =====
  analytics: {
    // Get dashboard analytics
    dashboard: (timeRange?: { start: Date; end: Date }): Promise<ApiResponse<DashboardStats>> =>
      apiClient.get(`/api/analytics/dashboard${timeRange ? `?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}` : ''}`),
    
    // Get detailed analytics
    getDetailed: (options: {
      start: Date;
      end: Date;
      granularity?: 'hour' | 'day' | 'week' | 'month';
      metrics?: string[];
    }): Promise<ApiResponse<AnalyticsData>> =>
      apiClient.post('/api/analytics/detailed', options),
    
    // Get privacy risk analytics
    getPrivacyRisks: (timeRange?: { start: Date; end: Date }): Promise<ApiResponse<{
      summary: { low: number; medium: number; high: number; critical: number };
      trends: Array<{ date: Date; risk: string; count: number }>;
      topTypes: Array<{ type: string; count: number; percentage: number }>;
    }>> =>
      apiClient.get(`/api/analytics/privacy-risks${timeRange ? `?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}` : ''}`),
    
    // Get performance analytics
    getPerformance: (timeRange?: { start: Date; end: Date }): Promise<ApiResponse<{
      processingTimes: { average: number; median: number; p95: number; p99: number };
      errorRates: { total: number; byType: Record<string, number> };
      throughput: Array<{ date: Date; filesPerHour: number }>;
    }>> =>
      apiClient.get(`/api/analytics/performance${timeRange ? `?start=${timeRange.start.toISOString()}&end=${timeRange.end.toISOString()}` : ''}`),
    
    // Export analytics data
    export: (options: {
      start: Date;
      end: Date;
      format: 'csv' | 'json' | 'xlsx';
      metrics?: string[];
    }): Promise<ApiResponse<{ downloadUrl: string; expiresAt: Date }>> =>
      apiClient.post('/api/analytics/export', options),
    
    // Track custom event
    track: (event: { type: string; data: any; userId?: string }): Promise<ApiResponse<void>> =>
      apiClient.post('/api/analytics/track', event),
  },

  // ===== NEW: COMPREHENSIVE BILLING MANAGEMENT =====
  billing: {
    // Get billing information
    getInfo: (): Promise<ApiResponse<BillingData>> =>
      apiClient.get('/api/billing/info'),
    
    // Update billing address
    updateAddress: (address: BillingData['billingAddress']): Promise<ApiResponse<BillingData>> =>
      apiClient.put('/api/billing/address', address),
    
    // Get invoices
    getInvoices: (options?: { limit?: number; offset?: number; status?: string }): Promise<ApiResponse<InvoiceData[]>> =>
      apiClient.get(`/api/billing/invoices${options ? `?${new URLSearchParams(options as any).toString()}` : ''}`),
    
    // Get invoice by ID
    getInvoice: (id: string): Promise<ApiResponse<InvoiceData>> =>
      apiClient.get(`/api/billing/invoices/${id}`),
    
    // Download invoice
    downloadInvoice: (id: string): Promise<ApiResponse<{ downloadUrl: string }>> =>
      apiClient.get(`/api/billing/invoices/${id}/download`),
    
    // Get payment methods
    getPaymentMethods: (): Promise<ApiResponse<PaymentMethodData[]>> =>
      apiClient.get('/api/billing/payment-methods'),
    
    // Add payment method
    addPaymentMethod: (data: { type: string; token: string; setAsDefault?: boolean }): Promise<ApiResponse<PaymentMethodData>> =>
      apiClient.post('/api/billing/payment-methods', data),
    
    // Update payment method
    updatePaymentMethod: (id: string, data: { isDefault?: boolean }): Promise<ApiResponse<PaymentMethodData>> =>
      apiClient.put(`/api/billing/payment-methods/${id}`, data),
    
    // Delete payment method
    deletePaymentMethod: (id: string): Promise<ApiResponse<void>> =>
      apiClient.delete(`/api/billing/payment-methods/${id}`),
    
    // Get upcoming invoice
    getUpcomingInvoice: (): Promise<ApiResponse<InvoiceData>> =>
      apiClient.get('/api/billing/upcoming-invoice'),
    
    // Create checkout session
    createCheckout: (data: { planId: string; successUrl: string; cancelUrl: string }): Promise<ApiResponse<{ checkoutUrl: string; sessionId: string }>> =>
      apiClient.post('/api/billing/checkout', data),
    
    // Handle webhook
    handleWebhook: (data: { type: string; data: any }): Promise<ApiResponse<void>> =>
      apiClient.post('/api/billing/webhook', data),
  },

  // EXIF metadata (enhanced)
  exif: {
    extract: (file: File, options?: { onProgress?: (progress: UploadProgress) => void }): Promise<ApiResponse<ExifResponse>> =>
      apiClient.uploadFile('/api/exif/extract', file, options),
    
    batch: (files: File[], options?: RequestOptions & { onProgress?: (progress: UploadProgress) => void }): Promise<ApiResponse<ExifResponse[]>> =>
      apiClient.uploadFile('/api/exif/batch', files[0], options), // TODO: Handle multiple files properly
    
    analyze: (metadata: ExifData): Promise<ApiResponse<{ privacyRisk: string; risks: string[]; recommendations: string[] }>> =>
      apiClient.post('/api/exif/analyze', metadata),
    
    // New: Get processing history
    getHistory: (options?: { limit?: number; offset?: number }): Promise<ApiResponse<Array<{
      id: string;
      fileName: string;
      processedAt: Date;
      privacyRisk: string;
      fileSize: number;
    }>>> =>
      apiClient.get(`/api/exif/history${options ? `?limit=${options.limit}&offset=${options.offset}` : ''}`),
  },

  // User management (enhanced)
  users: {
    profile: (): Promise<ApiResponse<ApiUser>> =>
      apiClient.get('/api/users/profile'),
    
    updateProfile: (data: Partial<ApiUser>): Promise<ApiResponse<ApiUser>> =>
      apiClient.put('/api/users/profile', data),
    
    changePassword: (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> =>
      apiClient.put('/api/users/password', data),
    
    deleteAccount: (): Promise<ApiResponse<void>> =>
      apiClient.delete('/api/users/account'),
    
    // New: Get user preferences
    getPreferences: (): Promise<ApiResponse<ApiUser['preferences']>> =>
      apiClient.get('/api/users/preferences'),
    
    // New: Update user preferences
    updatePreferences: (preferences: Partial<ApiUser['preferences']>): Promise<ApiResponse<ApiUser['preferences']>> =>
      apiClient.put('/api/users/preferences', preferences),
    
    // New: Get user activity log
    getActivityLog: (options?: { limit?: number; offset?: number }): Promise<ApiResponse<Array<{
      id: string;
      action: string;
      timestamp: Date;
      metadata: any;
    }>>> =>
      apiClient.get(`/api/users/activity${options ? `?limit=${options.limit}&offset=${options.offset}` : ''}`),
  },

  // Health and monitoring
  health: () => apiClient.healthCheck(),
  status: () => apiClient.getStatus(),

  // Content Validation Service
  validateContent: (request: ContentValidationRequest): Promise<ContentValidationResponse> =>
    apiClient.validateContent(request),

  // Quality Metrics Storage and Retrieval
  storeQualityMetrics: (metrics: Omit<QualityMetrics, 'id' | 'timestamp'>): Promise<QualityMetrics> =>
    apiClient.storeQualityMetrics(metrics),

  getQualityMetrics: (contentId: string, period?: '24h' | '7d' | '30d'): Promise<QualityMetrics[]> =>
    apiClient.getQualityMetrics(contentId, period),

  getQualityTrends: (contentIds: string[], period: '24h' | '7d' | '30d' = '7d'): Promise<Record<string, QualityMetrics[]>> =>
    apiClient.getQualityTrends(contentIds, period),

  // Link Validation Service
  validateLinks: (request: LinkValidationRequest): Promise<LinkValidationResponse> =>
    apiClient.validateLinks(request),

  getLinkStatus: (urls: string[]): Promise<LinkValidationResponse> =>
    apiClient.getLinkStatus(urls),

  scheduleLinkCheck: (urls: string[], schedule: 'hourly' | 'daily' | 'weekly'): Promise<{ jobId: string }> =>
    apiClient.scheduleLinkCheck(urls, schedule),

  // Content Analytics and Reporting
  getContentAnalytics: (contentId: string, period?: '24h' | '7d' | '30d'): Promise<ContentAnalytics> =>
    apiClient.getContentAnalytics(contentId, period),

  getBulkContentAnalytics: (contentIds: string[], period?: '24h' | '7d' | '30d'): Promise<Record<string, ContentAnalytics>> =>
    apiClient.getBulkContentAnalytics(contentIds, period),

  trackContentEvent: (contentId: string, event: string, metadata?: Record<string, any>): Promise<void> =>
    apiClient.trackContentEvent(contentId, event, metadata),

  generateContentReport: (options: {
    contentIds?: string[];
    period: '24h' | '7d' | '30d';
    metrics: string[];
    format: 'json' | 'csv' | 'pdf';
  }): Promise<{ reportId: string; downloadUrl?: string }> =>
    apiClient.generateContentReport(options),
};

export default apiClient; 