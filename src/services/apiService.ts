/**
 * ProofPix API Service - Frontend Integration for Priority 5A Backend
 * Comprehensive service layer for all backend API interactions
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Types and Interfaces
export interface FileUploadResponse {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  url?: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
  virusScanResult?: {
    clean: boolean;
    threats?: string[];
  };
}

export interface ProcessingStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  result?: any;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rateLimit: number;
  usage: {
    requests: number;
    lastUsed: Date;
  };
  isActive: boolean;
  createdAt: Date;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  lastDelivery?: {
    timestamp: Date;
    status: number;
    response: string;
  };
  deliveryStats: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface AnalyticsData {
  metrics: Record<string, number>;
  timeRange: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
}

// File Processing Service
export class FileProcessingService {
  static async uploadFile(file: File, options?: {
    generateThumbnail?: boolean;
    extractMetadata?: boolean;
    virusScan?: boolean;
  }): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const response = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  static async getProcessingStatus(fileId: string): Promise<ProcessingStatus> {
    const response = await apiClient.get(`/files/${fileId}/status`);
    return response.data;
  }

  static async batchUpload(files: File[]): Promise<{ batchId: string; files: FileUploadResponse[] }> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await apiClient.post('/files/batch-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  static async getFileMetadata(fileId: string): Promise<Record<string, any>> {
    const response = await apiClient.get(`/files/${fileId}/metadata`);
    return response.data;
  }

  static async deleteFile(fileId: string): Promise<void> {
    await apiClient.delete(`/files/${fileId}`);
  }

  static async getFiles(params?: {
    page?: number;
    limit?: number;
    status?: string;
    mimeType?: string;
  }): Promise<{ files: FileUploadResponse[]; total: number; page: number; totalPages: number }> {
    const response = await apiClient.get('/files', { params });
    return response.data;
  }
}

// API Key Management Service
export class ApiKeyService {
  static async createApiKey(data: {
    name: string;
    permissions: string[];
    rateLimit?: number;
  }): Promise<ApiKey> {
    const response = await apiClient.post('/keys', data);
    return response.data;
  }

  static async getApiKeys(): Promise<ApiKey[]> {
    const response = await apiClient.get('/keys');
    return response.data;
  }

  static async updateApiKey(keyId: string, data: Partial<ApiKey>): Promise<ApiKey> {
    const response = await apiClient.put(`/keys/${keyId}`, data);
    return response.data;
  }

  static async deleteApiKey(keyId: string): Promise<void> {
    await apiClient.delete(`/keys/${keyId}`);
  }

  static async getApiKeyUsage(keyId: string, timeRange?: {
    start: Date;
    end: Date;
  }): Promise<{
    requests: number;
    errors: number;
    avgResponseTime: number;
    topEndpoints: Array<{ endpoint: string; count: number }>;
  }> {
    const response = await apiClient.get(`/keys/${keyId}/usage`, {
      params: timeRange ? {
        start: timeRange.start.toISOString(),
        end: timeRange.end.toISOString(),
      } : undefined,
    });
    return response.data;
  }
}

// Webhook Management Service
export class WebhookService {
  static async createWebhook(data: {
    url: string;
    events: string[];
    secret?: string;
  }): Promise<Webhook> {
    const response = await apiClient.post('/webhooks', data);
    return response.data;
  }

  static async getWebhooks(): Promise<Webhook[]> {
    const response = await apiClient.get('/webhooks');
    return response.data;
  }

  static async updateWebhook(webhookId: string, data: Partial<Webhook>): Promise<Webhook> {
    const response = await apiClient.put(`/webhooks/${webhookId}`, data);
    return response.data;
  }

  static async deleteWebhook(webhookId: string): Promise<void> {
    await apiClient.delete(`/webhooks/${webhookId}`);
  }

  static async testWebhook(webhookId: string): Promise<{
    success: boolean;
    status: number;
    response: string;
    latency: number;
  }> {
    const response = await apiClient.post(`/webhooks/${webhookId}/test`);
    return response.data;
  }

  static async getWebhookDeliveries(webhookId: string, params?: {
    page?: number;
    limit?: number;
    status?: 'success' | 'failed';
  }): Promise<{
    deliveries: Array<{
      id: string;
      timestamp: Date;
      event: string;
      status: number;
      response: string;
      latency: number;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get(`/webhooks/${webhookId}/deliveries`, { params });
    return response.data;
  }
}

// OAuth2 Service
export class OAuth2Service {
  static async createApplication(data: {
    name: string;
    description?: string;
    redirectUris: string[];
    scopes: string[];
  }): Promise<{
    clientId: string;
    clientSecret: string;
    application: any;
  }> {
    const response = await apiClient.post('/oauth/applications', data);
    return response.data;
  }

  static async getApplications(): Promise<Array<{
    id: string;
    name: string;
    clientId: string;
    redirectUris: string[];
    scopes: string[];
    isActive: boolean;
    createdAt: Date;
  }>> {
    const response = await apiClient.get('/oauth/applications');
    return response.data;
  }

  static async authorizeApplication(clientId: string, scopes: string[], redirectUri: string): Promise<{
    authorizationUrl: string;
  }> {
    const response = await apiClient.post('/oauth/authorize', {
      clientId,
      scopes,
      redirectUri,
    });
    return response.data;
  }

  static async exchangeCodeForToken(code: string, clientId: string, clientSecret: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  }> {
    const response = await apiClient.post('/oauth/token', {
      code,
      clientId,
      clientSecret,
      grantType: 'authorization_code',
    });
    return response.data;
  }
}

// Analytics Service
export class AnalyticsService {
  static async getMetrics(params?: {
    timeRange?: { start: Date; end: Date };
    metrics?: string[];
    groupBy?: string;
  }): Promise<AnalyticsData> {
    const response = await apiClient.get('/analytics/metrics', { params });
    return response.data;
  }

  static async getUsageStats(): Promise<{
    totalFiles: number;
    totalProcessed: number;
    totalStorage: number;
    apiCalls: number;
    activeUsers: number;
  }> {
    const response = await apiClient.get('/analytics/usage');
    return response.data;
  }

  static async getPerformanceMetrics(): Promise<{
    avgProcessingTime: number;
    avgResponseTime: number;
    errorRate: number;
    throughput: number;
  }> {
    const response = await apiClient.get('/analytics/performance');
    return response.data;
  }

  static async exportData(params: {
    format: 'csv' | 'json' | 'xlsx';
    timeRange: { start: Date; end: Date };
    metrics?: string[];
  }): Promise<{ downloadUrl: string; jobId: string }> {
    const response = await apiClient.post('/analytics/export', params);
    return response.data;
  }

  static async getExportStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    downloadUrl?: string;
  }> {
    const response = await apiClient.get(`/analytics/export/${jobId}/status`);
    return response.data;
  }
}

// Security Service
export class SecurityService {
  static async getSecurityEvents(params?: {
    page?: number;
    limit?: number;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    type?: string;
  }): Promise<{
    events: Array<{
      id: string;
      type: string;
      severity: string;
      message: string;
      timestamp: Date;
      metadata: Record<string, any>;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await apiClient.get('/security/events', { params });
    return response.data;
  }

  static async getComplianceStatus(): Promise<{
    gdpr: { compliant: boolean; score: number; issues: string[] };
    hipaa: { compliant: boolean; score: number; issues: string[] };
    sox: { compliant: boolean; score: number; issues: string[] };
    overall: { score: number; status: 'compliant' | 'partial' | 'non-compliant' };
  }> {
    const response = await apiClient.get('/security/compliance');
    return response.data;
  }

  static async scanFile(fileId: string): Promise<{
    clean: boolean;
    threats: string[];
    scanTime: number;
  }> {
    const response = await apiClient.post(`/security/scan/${fileId}`);
    return response.data;
  }
}

// Real-time Service using WebSocket
export class RealTimeService {
  private static ws: WebSocket | null = null;
  private static listeners: Map<string, Function[]> = new Map();

  static connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('authToken');
      const wsUrl = `${WS_BASE_URL}?token=${token}`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        resolve();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const listeners = this.listeners.get(data.type) || [];
          listeners.forEach(listener => listener(data.payload));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      };
    });
  }

  static subscribe(eventType: string, callback: Function): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  static unsubscribe(eventType: string, callback: Function): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  static disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }
}

// Main API Service Export
export const apiService = {
  files: FileProcessingService,
  apiKeys: ApiKeyService,
  webhooks: WebhookService,
  oauth: OAuth2Service,
  analytics: AnalyticsService,
  security: SecurityService,
  realTime: RealTimeService,
  
  // Utility methods
  setAuthToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },
  
  clearAuthToken: () => {
    localStorage.removeItem('authToken');
  },
  
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },
  
  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: Date; services: Record<string, boolean> }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiService;

// Export apiClient for direct use
export { apiClient }; 