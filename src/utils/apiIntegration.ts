// API Integration for ProofPix Backend
export {};

import { errorHandler } from './errorHandler';

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  rateLimit: {
    requests: number;
    windowMs: number;
  };
  cache: {
    enabled: boolean;
    ttl: number; // Time to live in milliseconds
  };
  authentication: {
    type: 'bearer' | 'api-key' | 'basic' | 'none';
    credentials?: {
      token?: string;
      apiKey?: string;
      username?: string;
      password?: string;
    };
  };
}

interface ApiRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
  skipCache?: boolean;
  skipRateLimit?: boolean;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  cached: boolean;
  requestId: string;
  timestamp: Date;
}

interface CacheEntry {
  data: any;
  timestamp: Date;
  ttl: number;
  requestHash: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: Date;
}

class AdvancedApiClient {
  private config: ApiConfig;
  private cache: Map<string, CacheEntry> = new Map();
  private rateLimitTracker: Map<string, RateLimitEntry> = new Map();
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  constructor(config: ApiConfig) {
    this.config = config;
    this.startCacheCleanup();
    this.startRateLimitCleanup();
  }

  async request<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId();
    
    try {
      // Check rate limiting
      if (!request.skipRateLimit && !this.checkRateLimit()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Check cache
      if (!request.skipCache && request.method === 'GET') {
        const cachedResponse = this.getCachedResponse<T>(request);
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      // Execute request with retry logic
      const response = await this.executeWithRetry<T>(request, requestId);

      // Cache successful GET requests
      if (request.method === 'GET' && this.config.cache.enabled && !request.skipCache) {
        this.cacheResponse(request, response);
      }

      // Update rate limit tracker
      this.updateRateLimit();

      return response;
    } catch (error) {
      await errorHandler.handleError('api_request', error as Error, {
        metadata: {
          endpoint: request.endpoint,
          method: request.method,
          requestId
        }
      });
      throw error;
    }
  }

  private async executeWithRetry<T>(request: ApiRequest, requestId: string): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await this.executeRequest<T>(request, requestId);
        return response;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof Error && error.message.includes('4')) {
          throw error;
        }
        
        // Wait before retrying
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * Math.pow(2, attempt));
        }
      }
    }
    
    throw lastError || new Error('Request failed after all retry attempts');
  }

  private async executeRequest<T>(request: ApiRequest, requestId: string): Promise<ApiResponse<T>> {
    const url = this.buildUrl(request);
    const headers = this.buildHeaders(request);
    const timeout = request.timeout || this.config.timeout;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method: request.method,
        headers,
        signal: controller.signal,
      };

      if (request.data && request.method !== 'GET') {
        fetchOptions.body = JSON.stringify(request.data);
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        cached: false,
        requestId,
        timestamp: new Date()
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private buildUrl(request: ApiRequest): string {
    let url = `${this.config.baseUrl}${request.endpoint}`;
    
    if (request.params) {
      const searchParams = new URLSearchParams(request.params);
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  private buildHeaders(request: ApiRequest): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...request.headers
    };

    // Add authentication headers
    switch (this.config.authentication.type) {
      case 'bearer':
        if (this.config.authentication.credentials?.token) {
          headers['Authorization'] = `Bearer ${this.config.authentication.credentials.token}`;
        }
        break;
      case 'api-key':
        if (this.config.authentication.credentials?.apiKey) {
          headers['X-API-Key'] = this.config.authentication.credentials.apiKey;
        }
        break;
      case 'basic':
        if (this.config.authentication.credentials?.username && this.config.authentication.credentials?.password) {
          const credentials = btoa(`${this.config.authentication.credentials.username}:${this.config.authentication.credentials.password}`);
          headers['Authorization'] = `Basic ${credentials}`;
        }
        break;
    }

    return headers;
  }

  private checkRateLimit(): boolean {
    const now = new Date();
    const key = 'global';
    const entry = this.rateLimitTracker.get(key);

    if (!entry) {
      return true;
    }

    if (now >= entry.resetTime) {
      this.rateLimitTracker.delete(key);
      return true;
    }

    return entry.count < this.config.rateLimit.requests;
  }

  private updateRateLimit(): void {
    const now = new Date();
    const key = 'global';
    const entry = this.rateLimitTracker.get(key);

    if (!entry || now >= entry.resetTime) {
      this.rateLimitTracker.set(key, {
        count: 1,
        resetTime: new Date(now.getTime() + this.config.rateLimit.windowMs)
      });
    } else {
      entry.count++;
    }
  }

  private getCachedResponse<T>(request: ApiRequest): ApiResponse<T> | null {
    if (!this.config.cache.enabled) {
      return null;
    }

    const cacheKey = this.generateCacheKey(request);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      return null;
    }

    const now = new Date();
    if (now.getTime() - entry.timestamp.getTime() > entry.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }

    return {
      ...entry.data,
      cached: true,
      requestId: this.generateRequestId()
    };
  }

  private cacheResponse<T>(request: ApiRequest, response: ApiResponse<T>): void {
    if (!this.config.cache.enabled) {
      return;
    }

    const cacheKey = this.generateCacheKey(request);
    const entry: CacheEntry = {
      data: response,
      timestamp: new Date(),
      ttl: this.config.cache.ttl,
      requestHash: cacheKey
    };

    this.cache.set(cacheKey, entry);
  }

  private generateCacheKey(request: ApiRequest): string {
    const keyData = {
      endpoint: request.endpoint,
      method: request.method,
      params: request.params,
      data: request.data
    };
    return btoa(JSON.stringify(keyData));
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private startCacheCleanup(): void {
    setInterval(() => {
      const now = new Date();
      for (const [key, entry] of this.cache.entries()) {
        if (now.getTime() - entry.timestamp.getTime() > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Clean up every minute
  }

  private startRateLimitCleanup(): void {
    setInterval(() => {
      const now = new Date();
      for (const [key, entry] of this.rateLimitTracker.entries()) {
        if (now >= entry.resetTime) {
          this.rateLimitTracker.delete(key);
        }
      }
    }, 30000); // Clean up every 30 seconds
  }

  // Public utility methods
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; entries: Array<{ key: string; age: number; ttl: number }> } {
    const now = new Date();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now.getTime() - entry.timestamp.getTime(),
      ttl: entry.ttl
    }));

    return {
      size: this.cache.size,
      entries
    };
  }

  getRateLimitStatus(): { remaining: number; resetTime: Date | null } {
    const entry = this.rateLimitTracker.get('global');
    if (!entry) {
      return {
        remaining: this.config.rateLimit.requests,
        resetTime: null
      };
    }

    return {
      remaining: Math.max(0, this.config.rateLimit.requests - entry.count),
      resetTime: entry.resetTime
    };
  }

  updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Batch request support
  async batchRequest<T = any>(requests: ApiRequest[]): Promise<Array<ApiResponse<T> | Error>> {
    const results = await Promise.allSettled(
      requests.map(request => this.request<T>(request))
    );

    return results.map(result => 
      result.status === 'fulfilled' ? result.value : result.reason
    );
  }

  // Streaming support for large responses
  async streamRequest(request: ApiRequest): Promise<ReadableStream> {
    const url = this.buildUrl(request);
    const headers = this.buildHeaders(request);

    const response = await fetch(url, {
      method: request.method,
      headers,
      body: request.data ? JSON.stringify(request.data) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is not available for streaming');
    }

    return response.body;
  }
}

// Pre-configured API clients for different services
export const createApiClient = (config: ApiConfig): AdvancedApiClient => {
  return new AdvancedApiClient(config);
};

// Default configurations for common use cases
export const defaultConfigs = {
  development: {
    baseUrl: 'http://localhost:3001/api',
    timeout: 10000,
    retryAttempts: 2,
    retryDelay: 1000,
    rateLimit: { requests: 100, windowMs: 60000 },
    cache: { enabled: true, ttl: 300000 },
    authentication: { type: 'none' as const }
  },
  production: {
    baseUrl: 'https://api.proofpix.com',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 2000,
    rateLimit: { requests: 1000, windowMs: 60000 },
    cache: { enabled: true, ttl: 600000 },
    authentication: { type: 'bearer' as const }
  },
  enterprise: {
    baseUrl: 'https://enterprise-api.proofpix.com',
    timeout: 60000,
    retryAttempts: 5,
    retryDelay: 3000,
    rateLimit: { requests: 10000, windowMs: 60000 },
    cache: { enabled: true, ttl: 900000 },
    authentication: { type: 'api-key' as const }
  }
};

// Global API client instance
export const apiClient = createApiClient(
  process.env.NODE_ENV === 'production' 
    ? defaultConfigs.production 
    : defaultConfigs.development
);

// Specialized API clients
export const enterpriseApiClient = createApiClient(defaultConfigs.enterprise);

// Helper functions for common API operations
export const apiHelpers = {
  // Chain of custody API calls
  async getCustodyLog(fileId: string) {
    return apiClient.request({
      endpoint: `/custody/${fileId}`,
      method: 'GET'
    });
  },

  async createCustodyEvent(fileId: string, eventData: any) {
    return apiClient.request({
      endpoint: `/custody/${fileId}/events`,
      method: 'POST',
      data: eventData
    });
  },

  async getComplianceStatus(fileId?: string) {
    return apiClient.request({
      endpoint: fileId ? `/compliance/${fileId}` : '/compliance',
      method: 'GET'
    });
  },

  async runComplianceCheck(fileId: string) {
    return apiClient.request({
      endpoint: `/compliance/${fileId}/check`,
      method: 'POST'
    });
  },

  async getAuditTrail(params?: { startDate?: string; endDate?: string; fileId?: string }) {
    return apiClient.request({
      endpoint: '/audit',
      method: 'GET',
      params
    });
  },

  async getAnalytics(timeRange: string = '30d') {
    return apiClient.request({
      endpoint: '/analytics',
      method: 'GET',
      params: { timeRange }
    });
  },

  async createSignatureRequest(data: any) {
    return apiClient.request({
      endpoint: '/signatures/requests',
      method: 'POST',
      data
    });
  },

  async signDocument(requestId: string, signatureData: any) {
    return apiClient.request({
      endpoint: `/signatures/requests/${requestId}/sign`,
      method: 'POST',
      data: signatureData
    });
  },

  async generateLegalDocument(templateId: string, data: any) {
    return apiClient.request({
      endpoint: `/legal/templates/${templateId}/generate`,
      method: 'POST',
      data
    });
  },

  async uploadFile(file: File, metadata?: any) {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    return apiClient.request({
      endpoint: '/files/upload',
      method: 'POST',
      data: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
      }
    });
  }
};

export default apiClient;
