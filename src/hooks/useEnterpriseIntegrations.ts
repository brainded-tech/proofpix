/**
 * Enterprise Integrations Hooks - Priority 15
 * React hooks for managing enterprise platform integrations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  enterpriseIntegrationsService,
  IntegrationConfig,
  SalesforceConfig,
  Microsoft365Config,
  GoogleWorkspaceConfig,
  SlackConfig,
  TeamsConfig,
  ZapierConfig,
  WebhookEvent
} from '../services/enterpriseIntegrationsService';

interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errors: string[];
  duration: number;
  timestamp: Date;
}

// Main integrations management hook
export const useEnterpriseIntegrations = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = enterpriseIntegrationsService.getIntegrations();
      setIntegrations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load integrations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshIntegrations();
    
    // Refresh integrations every 30 seconds
    const interval = setInterval(refreshIntegrations, 30000);
    return () => clearInterval(interval);
  }, [refreshIntegrations]);

  const connectIntegration = useCallback(async (id: string, credentials: Record<string, any>) => {
    try {
      setError(null);
      let success = false;

      switch (id) {
        case 'salesforce':
          success = await enterpriseIntegrationsService.connectSalesforce(credentials as SalesforceConfig);
          break;
        case 'microsoft365':
          success = await enterpriseIntegrationsService.connectMicrosoft365(credentials as Microsoft365Config);
          break;
        case 'google-workspace':
          success = await enterpriseIntegrationsService.connectGoogleWorkspace(credentials as GoogleWorkspaceConfig);
          break;
        case 'slack':
          success = await enterpriseIntegrationsService.connectSlack(credentials as SlackConfig);
          break;
        case 'microsoft-teams':
          success = await enterpriseIntegrationsService.connectMicrosoftTeams(credentials as TeamsConfig);
          break;
        case 'zapier':
          success = await enterpriseIntegrationsService.connectZapier(credentials as ZapierConfig);
          break;
        default:
          throw new Error(`Unknown integration: ${id}`);
      }

      if (success) {
        await refreshIntegrations();
        return { success: true, message: 'Integration connected successfully' };
      } else {
        throw new Error('Failed to connect integration');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setError(message);
      return { success: false, message };
    }
  }, [refreshIntegrations]);

  const disconnectIntegration = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = await enterpriseIntegrationsService.disconnectIntegration(id);
      if (success) {
        await refreshIntegrations();
        return { success: true, message: 'Integration disconnected successfully' };
      } else {
        throw new Error('Failed to disconnect integration');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Disconnection failed';
      setError(message);
      return { success: false, message };
    }
  }, [refreshIntegrations]);

  const testConnection = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = await enterpriseIntegrationsService.testIntegrationConnection(id);
      return { success, message: success ? 'Connection test passed' : 'Connection test failed' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection test failed';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const syncAllIntegrations = useCallback(async () => {
    try {
      setError(null);
      const results = await enterpriseIntegrationsService.syncAllIntegrations();
      await refreshIntegrations();
      return { success: true, results };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      setError(message);
      return { success: false, message };
    }
  }, [refreshIntegrations]);

  const connectedIntegrations = useMemo(() => 
    integrations.filter(integration => integration.status === 'connected'),
    [integrations]
  );

  const disconnectedIntegrations = useMemo(() => 
    integrations.filter(integration => integration.status === 'disconnected'),
    [integrations]
  );

  return {
    integrations,
    connectedIntegrations,
    disconnectedIntegrations,
    loading,
    error,
    connectIntegration,
    disconnectIntegration,
    testConnection,
    syncAllIntegrations,
    refreshIntegrations
  };
};

// Salesforce-specific hook
export const useSalesforceIntegration = () => {
  const [syncHistory, setSyncHistory] = useState<SyncResult[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSyncHistory = useCallback(async () => {
    try {
      const history = enterpriseIntegrationsService.getSyncHistory('salesforce');
      setSyncHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sync history');
    }
  }, []);

  useEffect(() => {
    refreshSyncHistory();
    
    // Refresh sync history every minute
    const interval = setInterval(refreshSyncHistory, 60000);
    return () => clearInterval(interval);
  }, [refreshSyncHistory]);

  const syncData = useCallback(async () => {
    try {
      setSyncing(true);
      setError(null);
      const result = await enterpriseIntegrationsService.syncSalesforceData();
      await refreshSyncHistory();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      setError(message);
      throw err;
    } finally {
      setSyncing(false);
    }
  }, [refreshSyncHistory]);

  const lastSync = useMemo(() => syncHistory[0] || null, [syncHistory]);
  
  const syncStats = useMemo(() => {
    if (syncHistory.length === 0) return null;
    
    const totalSyncs = syncHistory.length;
    const successfulSyncs = syncHistory.filter(sync => sync.success).length;
    const totalRecords = syncHistory.reduce((sum, sync) => sum + sync.recordsProcessed, 0);
    const averageDuration = syncHistory.reduce((sum, sync) => sum + sync.duration, 0) / totalSyncs;
    
    return {
      totalSyncs,
      successfulSyncs,
      successRate: (successfulSyncs / totalSyncs) * 100,
      totalRecords,
      averageDuration: Math.round(averageDuration)
    };
  }, [syncHistory]);

  return {
    syncHistory,
    lastSync,
    syncStats,
    syncing,
    error,
    syncData,
    refreshSyncHistory
  };
};

// Microsoft 365 integration hook
export const useMicrosoft365Integration = () => {
  const [syncHistory, setSyncHistory] = useState<SyncResult[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSyncHistory = useCallback(async () => {
    try {
      const history = enterpriseIntegrationsService.getSyncHistory('microsoft365');
      setSyncHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sync history');
    }
  }, []);

  useEffect(() => {
    refreshSyncHistory();
    const interval = setInterval(refreshSyncHistory, 60000);
    return () => clearInterval(interval);
  }, [refreshSyncHistory]);

  const syncData = useCallback(async () => {
    try {
      setSyncing(true);
      setError(null);
      const result = await enterpriseIntegrationsService.syncMicrosoft365Data();
      await refreshSyncHistory();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      setError(message);
      throw err;
    } finally {
      setSyncing(false);
    }
  }, [refreshSyncHistory]);

  const lastSync = useMemo(() => syncHistory[0] || null, [syncHistory]);

  return {
    syncHistory,
    lastSync,
    syncing,
    error,
    syncData,
    refreshSyncHistory
  };
};

// Google Workspace integration hook
export const useGoogleWorkspaceIntegration = () => {
  const [syncHistory, setSyncHistory] = useState<SyncResult[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSyncHistory = useCallback(async () => {
    try {
      const history = enterpriseIntegrationsService.getSyncHistory('google-workspace');
      setSyncHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sync history');
    }
  }, []);

  useEffect(() => {
    refreshSyncHistory();
    const interval = setInterval(refreshSyncHistory, 60000);
    return () => clearInterval(interval);
  }, [refreshSyncHistory]);

  const syncData = useCallback(async () => {
    try {
      setSyncing(true);
      setError(null);
      const result = await enterpriseIntegrationsService.syncGoogleWorkspaceData();
      await refreshSyncHistory();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      setError(message);
      throw err;
    } finally {
      setSyncing(false);
    }
  }, [refreshSyncHistory]);

  const lastSync = useMemo(() => syncHistory[0] || null, [syncHistory]);

  return {
    syncHistory,
    lastSync,
    syncing,
    error,
    syncData,
    refreshSyncHistory
  };
};

// Communication platforms hook (Slack & Teams)
export const useCommunicationIntegrations = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendSlackNotification = useCallback(async (channel: string, message: string, attachments?: any[]) => {
    try {
      setSending(true);
      setError(null);
      const success = await enterpriseIntegrationsService.sendSlackNotification(channel, message, attachments);
      
      if (success) {
        const notification = {
          id: Date.now(),
          platform: 'slack',
          channel,
          message,
          timestamp: new Date(),
          status: 'sent'
        };
        setNotifications(prev => [notification, ...prev.slice(0, 49)]);
      }
      
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send Slack notification';
      setError(message);
      return false;
    } finally {
      setSending(false);
    }
  }, []);

  const sendTeamsNotification = useCallback(async (channel: string, message: string, adaptiveCard?: any) => {
    try {
      setSending(true);
      setError(null);
      const success = await enterpriseIntegrationsService.sendTeamsNotification(channel, message, adaptiveCard);
      
      if (success) {
        const notification = {
          id: Date.now(),
          platform: 'teams',
          channel,
          message,
          timestamp: new Date(),
          status: 'sent'
        };
        setNotifications(prev => [notification, ...prev.slice(0, 49)]);
      }
      
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send Teams notification';
      setError(message);
      return false;
    } finally {
      setSending(false);
    }
  }, []);

  return {
    notifications,
    sending,
    error,
    sendSlackNotification,
    sendTeamsNotification
  };
};

// Zapier integration hook
export const useZapierIntegration = () => {
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [triggering, setTriggering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWebhookEvents = useCallback(async () => {
    try {
      const events = enterpriseIntegrationsService.getWebhookEvents(50);
      setWebhookEvents(events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load webhook events');
    }
  }, []);

  useEffect(() => {
    refreshWebhookEvents();
    
    // Refresh webhook events every 10 seconds
    const interval = setInterval(refreshWebhookEvents, 10000);
    return () => clearInterval(interval);
  }, [refreshWebhookEvents]);

  const triggerWebhook = useCallback(async (event: string, data: Record<string, any>) => {
    try {
      setTriggering(true);
      setError(null);
      const success = await enterpriseIntegrationsService.triggerZapierWebhook(event, data);
      
      if (success) {
        await refreshWebhookEvents();
      }
      
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to trigger webhook';
      setError(message);
      return false;
    } finally {
      setTriggering(false);
    }
  }, [refreshWebhookEvents]);

  const webhookStats = useMemo(() => {
    const total = webhookEvents.length;
    const processed = webhookEvents.filter(event => event.processed).length;
    const failed = webhookEvents.filter(event => !event.processed && event.retryCount >= 3).length;
    const pending = webhookEvents.filter(event => !event.processed && event.retryCount < 3).length;
    
    return {
      total,
      processed,
      failed,
      pending,
      successRate: total > 0 ? (processed / total) * 100 : 0
    };
  }, [webhookEvents]);

  return {
    webhookEvents,
    webhookStats,
    triggering,
    error,
    triggerWebhook,
    refreshWebhookEvents
  };
};

// Integration analytics hook
export const useIntegrationAnalytics = () => {
  const [analytics, setAnalytics] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = enterpriseIntegrationsService.getIntegrationAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAnalytics();
    
    // Refresh analytics every 2 minutes
    const interval = setInterval(refreshAnalytics, 120000);
    return () => clearInterval(interval);
  }, [refreshAnalytics]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics
  };
};

// Bulk operations hook
export const useBulkIntegrationOperations = () => {
  const [operations, setOperations] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkConnect = useCallback(async (integrationConfigs: Array<{ id: string; credentials: Record<string, any> }>) => {
    try {
      setProcessing(true);
      setError(null);
      
      const results = [];
      for (const config of integrationConfigs) {
        const operation = {
          id: config.id,
          operation: 'connect',
          timestamp: new Date(),
          status: 'processing'
        };
        
        setOperations(prev => [...prev, operation]);
        
        try {
          let success = false;
          switch (config.id) {
            case 'salesforce':
              success = await enterpriseIntegrationsService.connectSalesforce(config.credentials as SalesforceConfig);
              break;
            case 'microsoft365':
              success = await enterpriseIntegrationsService.connectMicrosoft365(config.credentials as Microsoft365Config);
              break;
            case 'google-workspace':
              success = await enterpriseIntegrationsService.connectGoogleWorkspace(config.credentials as GoogleWorkspaceConfig);
              break;
            case 'slack':
              success = await enterpriseIntegrationsService.connectSlack(config.credentials as SlackConfig);
              break;
            case 'microsoft-teams':
              success = await enterpriseIntegrationsService.connectMicrosoftTeams(config.credentials as TeamsConfig);
              break;
            case 'zapier':
              success = await enterpriseIntegrationsService.connectZapier(config.credentials as ZapierConfig);
              break;
          }
          
          operation.status = success ? 'completed' : 'failed';
          results.push({ id: config.id, success });
          
        } catch (err) {
          operation.status = 'failed';
          results.push({ id: config.id, success: false, error: err instanceof Error ? err.message : 'Unknown error' });
        }
        
        setOperations(prev => prev.map(op => op.id === config.id && op.operation === 'connect' ? operation : op));
      }
      
      return results;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bulk operation failed';
      setError(message);
      return [];
    } finally {
      setProcessing(false);
    }
  }, []);

  const bulkSync = useCallback(async (integrationIds: string[]) => {
    try {
      setProcessing(true);
      setError(null);
      
      const results = [];
      for (const id of integrationIds) {
        const operation = {
          id,
          operation: 'sync',
          timestamp: new Date(),
          status: 'processing'
        };
        
        setOperations(prev => [...prev, operation]);
        
        try {
          let result: SyncResult | null = null;
          switch (id) {
            case 'salesforce':
              result = await enterpriseIntegrationsService.syncSalesforceData();
              break;
            case 'microsoft365':
              result = await enterpriseIntegrationsService.syncMicrosoft365Data();
              break;
            case 'google-workspace':
              result = await enterpriseIntegrationsService.syncGoogleWorkspaceData();
              break;
          }
          
          operation.status = result?.success ? 'completed' : 'failed';
          results.push({ id, success: result?.success || false, result });
          
        } catch (err) {
          operation.status = 'failed';
          results.push({ id, success: false, error: err instanceof Error ? err.message : 'Unknown error' });
        }
        
        setOperations(prev => prev.map(op => op.id === id && op.operation === 'sync' ? operation : op));
      }
      
      return results;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bulk sync failed';
      setError(message);
      return [];
    } finally {
      setProcessing(false);
    }
  }, []);

  const clearOperations = useCallback(() => {
    setOperations([]);
  }, []);

  return {
    operations,
    processing,
    error,
    bulkConnect,
    bulkSync,
    clearOperations
  };
}; 