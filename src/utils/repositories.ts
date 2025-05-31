// ===== REPOSITORY PATTERN IMPLEMENTATION =====
// Supporting PRIORITY 2 - DATABASE & DATA LAYER
// This provides a clean abstraction layer over the API client

import { 
  api, 
  ApiResponse, 
  ApiUser, 
  SubscriptionData, 
  UsageTrackingData, 
  AnalyticsData, 
  BillingData, 
  InvoiceData, 
  PaymentMethodData,
  ExifResponse,
  DashboardStats
} from './apiClient';

import { 
  apiClient,
  type ContentValidationRequest,
  type ContentValidationResponse,
  type QualityMetrics,
  type LinkValidationRequest,
  type LinkValidationResponse,
  type ContentAnalytics
} from './apiClient';

// ===== BASE REPOSITORY CLASS =====
abstract class BaseRepository {
  protected handleApiResponse<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      throw new Error(response.error || 'API request failed');
    }
    return response.data!;
  }

  protected handleApiError(error: any): never {
    console.error('Repository error:', error);
    throw error;
  }
}

// ===== USER REPOSITORY =====
export class UserRepository extends BaseRepository {
  async getProfile(): Promise<ApiUser> {
    try {
      const response = await api.users.profile();
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async updateProfile(data: Partial<ApiUser>): Promise<ApiUser> {
    try {
      const response = await api.users.updateProfile(data);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await api.users.changePassword({ currentPassword, newPassword });
      this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getPreferences(): Promise<ApiUser['preferences']> {
    try {
      const response = await api.users.getPreferences();
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async updatePreferences(preferences: Partial<ApiUser['preferences']>): Promise<ApiUser['preferences']> {
    try {
      const response = await api.users.updatePreferences(preferences);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getActivityLog(options?: { limit?: number; offset?: number }): Promise<Array<{
    id: string;
    action: string;
    timestamp: Date;
    metadata: any;
  }>> {
    try {
      const response = await api.users.getActivityLog(options);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const response = await api.users.deleteAccount();
      this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

// ===== SUBSCRIPTION REPOSITORY =====
export class SubscriptionRepository extends BaseRepository {
  async getCurrent(): Promise<SubscriptionData> {
    try {
      const response = await api.subscriptions.getCurrent();
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getById(id: string): Promise<SubscriptionData> {
    try {
      const response = await api.subscriptions.getById(id);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getHistory(options?: { limit?: number; offset?: number }): Promise<SubscriptionData[]> {
    try {
      const response = await api.subscriptions.getHistory(options);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async create(planId: string, paymentMethodId?: string): Promise<SubscriptionData> {
    try {
      const response = await api.subscriptions.create({ planId, paymentMethodId });
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async update(id: string, data: Partial<SubscriptionData>): Promise<SubscriptionData> {
    try {
      const response = await api.subscriptions.update(id, data);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async cancel(id: string, options?: { cancelAtPeriodEnd?: boolean; reason?: string }): Promise<SubscriptionData> {
    try {
      const response = await api.subscriptions.cancel(id, options);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async reactivate(id: string): Promise<SubscriptionData> {
    try {
      const response = await api.subscriptions.reactivate(id);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async changePlan(id: string, newPlanId: string, prorationBehavior?: 'create_prorations' | 'none'): Promise<SubscriptionData> {
    try {
      const response = await api.subscriptions.changePlan(id, { newPlanId, prorationBehavior });
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getAvailablePlans(): Promise<Array<{ id: string; name: string; features: any; pricing: any }>> {
    try {
      const response = await api.subscriptions.getPlans();
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

// ===== USAGE REPOSITORY =====
export class UsageRepository extends BaseRepository {
  async getCurrent(): Promise<UsageTrackingData> {
    try {
      const response = await api.usage.getCurrent();
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getByPeriod(start: Date, end: Date): Promise<UsageTrackingData[]> {
    try {
      const response = await api.usage.getByPeriod(start, end);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getHistory(options?: { limit?: number; offset?: number; granularity?: 'daily' | 'monthly' }): Promise<UsageTrackingData[]> {
    try {
      const response = await api.usage.getHistory(options);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async trackEvent(
    type: 'file_processed' | 'api_call' | 'batch_job' | 'export_operation',
    metadata: { fileSize?: number; processingTime?: number; [key: string]: any }
  ): Promise<void> {
    try {
      const response = await api.usage.track({ type, metadata });
      this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getLimits(): Promise<UsageTrackingData['limits']> {
    try {
      const response = await api.usage.getLimits();
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getAlerts(): Promise<Array<{ type: string; threshold: number; current: number; triggered: boolean }>> {
    try {
      const response = await api.usage.getAlerts();
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async setAlerts(alerts: Array<{ type: string; threshold: number; enabled: boolean }>): Promise<void> {
    try {
      const response = await api.usage.setAlerts(alerts);
      this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  // Helper methods for common usage patterns
  async isNearLimit(type: keyof UsageTrackingData['limits'], threshold: number = 0.8): Promise<boolean> {
    try {
      const current = await this.getCurrent();
      const limits = current.limits;
      const metrics = current.metrics;

      switch (type) {
        case 'filesPerMonth':
          return metrics.filesProcessed >= limits.filesPerMonth * threshold;
        case 'dataPerMonth':
          return metrics.dataProcessed >= limits.dataPerMonth * threshold;
        case 'apiCallsPerDay':
          return metrics.apiCalls >= limits.apiCallsPerDay * threshold;
        case 'storageLimit':
          return metrics.storageUsed >= limits.storageLimit * threshold;
        default:
          return false;
      }
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getRemainingQuota(): Promise<{
    files: number;
    data: number;
    apiCalls: number;
    storage: number;
  }> {
    try {
      const current = await this.getCurrent();
      return {
        files: Math.max(0, current.limits.filesPerMonth - current.metrics.filesProcessed),
        data: Math.max(0, current.limits.dataPerMonth - current.metrics.dataProcessed),
        apiCalls: Math.max(0, current.limits.apiCallsPerDay - current.metrics.apiCalls),
        storage: Math.max(0, current.limits.storageLimit - current.metrics.storageUsed),
      };
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

// ===== ANALYTICS REPOSITORY =====
export class AnalyticsRepository extends BaseRepository {
  async getDashboard(timeRange?: { start: Date; end: Date }): Promise<DashboardStats> {
    try {
      const response = await api.analytics.dashboard(timeRange);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getDetailed(options: {
    start: Date;
    end: Date;
    granularity?: 'hour' | 'day' | 'week' | 'month';
    metrics?: string[];
  }): Promise<AnalyticsData> {
    try {
      const response = await api.analytics.getDetailed(options);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getPrivacyRisks(timeRange?: { start: Date; end: Date }): Promise<{
    summary: { low: number; medium: number; high: number; critical: number };
    trends: Array<{ date: Date; risk: string; count: number }>;
    topTypes: Array<{ type: string; count: number; percentage: number }>;
  }> {
    try {
      const response = await api.analytics.getPrivacyRisks(timeRange);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getPerformance(timeRange?: { start: Date; end: Date }): Promise<{
    processingTimes: { average: number; median: number; p95: number; p99: number };
    errorRates: { total: number; byType: Record<string, number> };
    throughput: Array<{ date: Date; filesPerHour: number }>;
  }> {
    try {
      const response = await api.analytics.getPerformance(timeRange);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async exportData(options: {
    start: Date;
    end: Date;
    format: 'csv' | 'json' | 'xlsx';
    metrics?: string[];
  }): Promise<{ downloadUrl: string; expiresAt: Date }> {
    try {
      const response = await api.analytics.export(options);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async trackEvent(type: string, data: any, userId?: string): Promise<void> {
    try {
      const response = await api.analytics.track({ type, data, userId });
      this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  // Helper methods for common analytics patterns
  async getPrivacyRiskTrend(days: number = 30): Promise<Array<{ date: Date; risk: string; count: number }>> {
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    
    try {
      const data = await this.getPrivacyRisks({ start, end });
      return data.trends;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getUsageTrend(days: number = 30): Promise<Array<{ date: Date; count: number }>> {
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    
    try {
      const data = await this.getDetailed({ start, end, granularity: 'day' });
      return data.trends.filesProcessed;
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

// ===== BILLING REPOSITORY =====
export class BillingRepository extends BaseRepository {
  async getInfo(): Promise<BillingData> {
    try {
      const response = await api.billing.getInfo();
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async updateAddress(address: BillingData['billingAddress']): Promise<BillingData> {
    try {
      const response = await api.billing.updateAddress(address);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getInvoices(options?: { limit?: number; offset?: number; status?: string }): Promise<InvoiceData[]> {
    try {
      const response = await api.billing.getInvoices(options);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getInvoice(id: string): Promise<InvoiceData> {
    try {
      const response = await api.billing.getInvoice(id);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async downloadInvoice(id: string): Promise<{ downloadUrl: string }> {
    try {
      const response = await api.billing.downloadInvoice(id);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getPaymentMethods(): Promise<PaymentMethodData[]> {
    try {
      const response = await api.billing.getPaymentMethods();
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async addPaymentMethod(type: string, token: string, setAsDefault?: boolean): Promise<PaymentMethodData> {
    try {
      const response = await api.billing.addPaymentMethod({ type, token, setAsDefault });
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async updatePaymentMethod(id: string, data: { isDefault?: boolean }): Promise<PaymentMethodData> {
    try {
      const response = await api.billing.updatePaymentMethod(id, data);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async deletePaymentMethod(id: string): Promise<void> {
    try {
      const response = await api.billing.deletePaymentMethod(id);
      this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getUpcomingInvoice(): Promise<InvoiceData> {
    try {
      const response = await api.billing.getUpcomingInvoice();
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async createCheckoutSession(planId: string, successUrl: string, cancelUrl: string): Promise<{ checkoutUrl: string; sessionId: string }> {
    try {
      const response = await api.billing.createCheckout({ planId, successUrl, cancelUrl });
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

// ===== EXIF REPOSITORY =====
export class ExifRepository extends BaseRepository {
  async extractMetadata(file: File, onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void): Promise<ExifResponse> {
    try {
      const response = await api.exif.extract(file, { onProgress });
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async batchExtract(files: File[], onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void): Promise<ExifResponse[]> {
    try {
      const response = await api.exif.batch(files, { onProgress });
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async analyzePrivacyRisk(metadata: any): Promise<{ privacyRisk: string; risks: string[]; recommendations: string[] }> {
    try {
      const response = await api.exif.analyze(metadata);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getProcessingHistory(options?: { limit?: number; offset?: number }): Promise<Array<{
    id: string;
    fileName: string;
    processedAt: Date;
    privacyRisk: string;
    fileSize: number;
  }>> {
    try {
      const response = await api.exif.getHistory(options);
      return this.handleApiResponse(response);
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

// ===== REPOSITORY FACTORY =====
export class RepositoryFactory {
  private static userRepository: UserRepository;
  private static subscriptionRepository: SubscriptionRepository;
  private static usageRepository: UsageRepository;
  private static analyticsRepository: AnalyticsRepository;
  private static billingRepository: BillingRepository;
  private static exifRepository: ExifRepository;

  static getUserRepository(): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }

  static getSubscriptionRepository(): SubscriptionRepository {
    if (!this.subscriptionRepository) {
      this.subscriptionRepository = new SubscriptionRepository();
    }
    return this.subscriptionRepository;
  }

  static getUsageRepository(): UsageRepository {
    if (!this.usageRepository) {
      this.usageRepository = new UsageRepository();
    }
    return this.usageRepository;
  }

  static getAnalyticsRepository(): AnalyticsRepository {
    if (!this.analyticsRepository) {
      this.analyticsRepository = new AnalyticsRepository();
    }
    return this.analyticsRepository;
  }

  static getBillingRepository(): BillingRepository {
    if (!this.billingRepository) {
      this.billingRepository = new BillingRepository();
    }
    return this.billingRepository;
  }

  static getExifRepository(): ExifRepository {
    if (!this.exifRepository) {
      this.exifRepository = new ExifRepository();
    }
    return this.exifRepository;
  }
}

// ===== CONVENIENCE EXPORTS =====
export const userRepository = RepositoryFactory.getUserRepository();
export const subscriptionRepository = RepositoryFactory.getSubscriptionRepository();
export const usageRepository = RepositoryFactory.getUsageRepository();
export const analyticsRepository = RepositoryFactory.getAnalyticsRepository();
export const billingRepository = RepositoryFactory.getBillingRepository();
export const exifRepository = RepositoryFactory.getExifRepository();

export default RepositoryFactory;

// Content Management Repository
export const contentRepository = {
  // Content Validation
  async validateContent(request: ContentValidationRequest): Promise<ContentValidationResponse> {
    try {
      return await apiClient.validateContent(request);
    } catch (error) {
      console.error('Content validation failed:', error);
      throw new Error('Failed to validate content');
    }
  },

  async validateMarkdown(content: string, rules?: string[]): Promise<ContentValidationResponse> {
    return this.validateContent({
      content,
      contentType: 'markdown',
      validationRules: rules
    });
  },

  async validateHTML(content: string, rules?: string[]): Promise<ContentValidationResponse> {
    return this.validateContent({
      content,
      contentType: 'html',
      validationRules: rules
    });
  },

  // Quality Metrics Management
  async storeQualityMetrics(contentId: string, metrics: Omit<QualityMetrics['metrics'], 'id' | 'timestamp'>): Promise<QualityMetrics> {
    try {
      return await apiClient.storeQualityMetrics({
        contentId,
        metrics,
        trends: {
          period: '24h',
          change: 0,
          direction: 'stable'
        }
      });
    } catch (error) {
      console.error('Failed to store quality metrics:', error);
      throw new Error('Failed to store quality metrics');
    }
  },

  async getQualityMetrics(contentId: string, period?: '24h' | '7d' | '30d'): Promise<QualityMetrics[]> {
    try {
      return await apiClient.getQualityMetrics(contentId, period);
    } catch (error) {
      console.error('Failed to get quality metrics:', error);
      throw new Error('Failed to retrieve quality metrics');
    }
  },

  async getQualityTrends(contentIds: string[], period: '24h' | '7d' | '30d' = '7d'): Promise<Record<string, QualityMetrics[]>> {
    try {
      return await apiClient.getQualityTrends(contentIds, period);
    } catch (error) {
      console.error('Failed to get quality trends:', error);
      throw new Error('Failed to retrieve quality trends');
    }
  },

  // Link Validation Management
  async validateLinks(urls: string[], options?: LinkValidationRequest['options']): Promise<LinkValidationResponse> {
    try {
      return await apiClient.validateLinks({ urls, options });
    } catch (error) {
      console.error('Link validation failed:', error);
      throw new Error('Failed to validate links');
    }
  },

  async getLinkStatus(urls: string[]): Promise<LinkValidationResponse> {
    try {
      return await apiClient.getLinkStatus(urls);
    } catch (error) {
      console.error('Failed to get link status:', error);
      throw new Error('Failed to retrieve link status');
    }
  },

  async scheduleLinkCheck(urls: string[], schedule: 'hourly' | 'daily' | 'weekly'): Promise<{ jobId: string }> {
    try {
      return await apiClient.scheduleLinkCheck(urls, schedule);
    } catch (error) {
      console.error('Failed to schedule link check:', error);
      throw new Error('Failed to schedule link check');
    }
  },

  // Content Analytics Management
  async getContentAnalytics(contentId: string, period?: '24h' | '7d' | '30d'): Promise<ContentAnalytics> {
    try {
      return await apiClient.getContentAnalytics(contentId, period);
    } catch (error) {
      console.error('Failed to get content analytics:', error);
      throw new Error('Failed to retrieve content analytics');
    }
  },

  async getBulkContentAnalytics(contentIds: string[], period?: '24h' | '7d' | '30d'): Promise<Record<string, ContentAnalytics>> {
    try {
      return await apiClient.getBulkContentAnalytics(contentIds, period);
    } catch (error) {
      console.error('Failed to get bulk content analytics:', error);
      throw new Error('Failed to retrieve bulk content analytics');
    }
  },

  async trackContentEvent(contentId: string, event: string, metadata?: Record<string, any>): Promise<void> {
    try {
      await apiClient.trackContentEvent(contentId, event, metadata);
    } catch (error) {
      console.error('Failed to track content event:', error);
      // Don't throw for analytics tracking failures
    }
  },

  async generateContentReport(options: {
    contentIds?: string[];
    period: '24h' | '7d' | '30d';
    metrics: string[];
    format: 'json' | 'csv' | 'pdf';
  }): Promise<{ reportId: string; downloadUrl?: string }> {
    try {
      return await apiClient.generateContentReport(options);
    } catch (error) {
      console.error('Failed to generate content report:', error);
      throw new Error('Failed to generate content report');
    }
  }
}; 