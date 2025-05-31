/**
 * Custom React Hooks for Priority 5A API Integration
 * Provides easy-to-use hooks for all backend services
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import apiService, {
  FileUploadResponse,
  ProcessingStatus,
  ApiKey,
  Webhook,
  AnalyticsData,
} from '../services/apiService';

// File Processing Hooks
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, options?: {
    generateThumbnail?: boolean;
    extractMetadata?: boolean;
    virusScan?: boolean;
  }) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await apiService.files.uploadFile(file, options);
      
      // Poll for processing status
      const pollStatus = async () => {
        const status = await apiService.files.getProcessingStatus(result.id);
        setProgress(status.progress);
        
        if (status.status === 'completed' || status.status === 'failed') {
          setUploading(false);
          if (status.status === 'failed') {
            setError(status.message || 'Upload failed');
          }
          return status;
        }
        
        setTimeout(pollStatus, 1000);
        return status;
      };

      await pollStatus();
      return result;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setUploading(false);
      throw err;
    }
  }, []);

  const batchUpload = useCallback(async (files: File[]) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await apiService.files.batchUpload(files);
      setUploading(false);
      setProgress(100);
      return result;
    } catch (err: any) {
      setError(err.message || 'Batch upload failed');
      setUploading(false);
      throw err;
    }
  }, []);

  return {
    uploadFile,
    batchUpload,
    uploading,
    progress,
    error,
  };
};

export const useFileList = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  mimeType?: string;
}) => {
  const [files, setFiles] = useState<FileUploadResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
  });

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.files.getFiles(params);
      setFiles(result.files);
      setPagination({
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      await apiService.files.deleteFile(fileId);
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete file');
      throw err;
    }
  }, []);

  return {
    files,
    loading,
    error,
    pagination,
    refetch: fetchFiles,
    deleteFile,
  };
};

// API Key Management Hooks
export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const keys = await apiService.apiKeys.getApiKeys();
      setApiKeys(keys);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const createApiKey = useCallback(async (data: {
    name: string;
    permissions: string[];
    rateLimit?: number;
  }) => {
    try {
      const newKey = await apiService.apiKeys.createApiKey(data);
      setApiKeys(prev => [...prev, newKey]);
      return newKey;
    } catch (err: any) {
      setError(err.message || 'Failed to create API key');
      throw err;
    }
  }, []);

  const updateApiKey = useCallback(async (keyId: string, data: Partial<ApiKey>) => {
    try {
      const updatedKey = await apiService.apiKeys.updateApiKey(keyId, data);
      setApiKeys(prev => prev.map(key => key.id === keyId ? updatedKey : key));
      return updatedKey;
    } catch (err: any) {
      setError(err.message || 'Failed to update API key');
      throw err;
    }
  }, []);

  const deleteApiKey = useCallback(async (keyId: string) => {
    try {
      await apiService.apiKeys.deleteApiKey(keyId);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete API key');
      throw err;
    }
  }, []);

  return {
    apiKeys,
    loading,
    error,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    refetch: fetchApiKeys,
  };
};

// Webhook Management Hooks
export const useWebhooks = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWebhooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const hooks = await apiService.webhooks.getWebhooks();
      setWebhooks(hooks);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch webhooks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  const createWebhook = useCallback(async (data: {
    url: string;
    events: string[];
    secret?: string;
  }) => {
    try {
      const newWebhook = await apiService.webhooks.createWebhook(data);
      setWebhooks(prev => [...prev, newWebhook]);
      return newWebhook;
    } catch (err: any) {
      setError(err.message || 'Failed to create webhook');
      throw err;
    }
  }, []);

  const updateWebhook = useCallback(async (webhookId: string, data: Partial<Webhook>) => {
    try {
      const updatedWebhook = await apiService.webhooks.updateWebhook(webhookId, data);
      setWebhooks(prev => prev.map(hook => hook.id === webhookId ? updatedWebhook : hook));
      return updatedWebhook;
    } catch (err: any) {
      setError(err.message || 'Failed to update webhook');
      throw err;
    }
  }, []);

  const deleteWebhook = useCallback(async (webhookId: string) => {
    try {
      await apiService.webhooks.deleteWebhook(webhookId);
      setWebhooks(prev => prev.filter(hook => hook.id !== webhookId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete webhook');
      throw err;
    }
  }, []);

  const testWebhook = useCallback(async (webhookId: string) => {
    try {
      const result = await apiService.webhooks.testWebhook(webhookId);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to test webhook');
      throw err;
    }
  }, []);

  return {
    webhooks,
    loading,
    error,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    testWebhook,
    refetch: fetchWebhooks,
  };
};

// Analytics Hooks
export const useAnalytics = (params?: {
  timeRange?: { start: Date; end: Date };
  metrics?: string[];
  groupBy?: string;
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const analyticsData = await apiService.analytics.getMetrics(params);
      setData(analyticsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

export const useUsageStats = () => {
  const [stats, setStats] = useState<{
    totalFiles: number;
    totalProcessed: number;
    totalStorage: number;
    apiCalls: number;
    activeUsers: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const usageStats = await apiService.analytics.getUsageStats();
      setStats(usageStats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch usage stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

// Real-time Updates Hook
export const useRealTimeUpdates = () => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listenersRef = useRef<Map<string, Function[]>>(new Map());

  useEffect(() => {
    const connect = async () => {
      try {
        await apiService.realTime.connect();
        setConnected(true);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to connect to real-time service');
        setConnected(false);
      }
    };

    connect();

    return () => {
      apiService.realTime.disconnect();
      setConnected(false);
    };
  }, []);

  const subscribe = useCallback((eventType: string, callback: Function) => {
    apiService.realTime.subscribe(eventType, callback);
    
    if (!listenersRef.current.has(eventType)) {
      listenersRef.current.set(eventType, []);
    }
    listenersRef.current.get(eventType)!.push(callback);
  }, []);

  const unsubscribe = useCallback((eventType: string, callback: Function) => {
    apiService.realTime.unsubscribe(eventType, callback);
    
    const listeners = listenersRef.current.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }, []);

  return {
    connected,
    error,
    subscribe,
    unsubscribe,
  };
};

// Security Hooks
export const useSecurityEvents = (params?: {
  page?: number;
  limit?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  type?: string;
}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.security.getSecurityEvents(params);
      setEvents(result.events);
      setPagination({
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch security events');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    pagination,
    refetch: fetchEvents,
  };
};

export const useComplianceStatus = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const complianceStatus = await apiService.security.getComplianceStatus();
      setStatus(complianceStatus);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch compliance status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
  };
};

// Export Data Hook
export const useDataExport = () => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(async (params: {
    format: 'csv' | 'json' | 'xlsx';
    timeRange: { start: Date; end: Date };
    metrics?: string[];
  }) => {
    setExporting(true);
    setError(null);
    setProgress(0);

    try {
      const result = await apiService.analytics.exportData(params);
      
      // Poll for export status
      const pollStatus = async () => {
        const status = await apiService.analytics.getExportStatus(result.jobId);
        setProgress(status.progress);
        
        if (status.status === 'completed') {
          setExporting(false);
          return status.downloadUrl;
        } else if (status.status === 'failed') {
          setExporting(false);
          setError('Export failed');
          throw new Error('Export failed');
        }
        
        setTimeout(pollStatus, 1000);
        return null;
      };

      const downloadUrl = await pollStatus();
      return downloadUrl;
    } catch (err: any) {
      setError(err.message || 'Export failed');
      setExporting(false);
      throw err;
    }
  }, []);

  return {
    exportData,
    exporting,
    progress,
    error,
  };
}; 