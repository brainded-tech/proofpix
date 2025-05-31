/**
 * Enterprise Marketplace Hook - Priority 14
 * React hook for managing marketplace operations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  enterpriseMarketplaceService, 
  MarketplacePlugin, 
  APIEndpoint, 
  WhiteLabelConfig, 
  PartnerIntegration, 
  WorkflowTemplate 
} from '../services/enterpriseMarketplaceService';

export const useEnterpriseMarketplace = () => {
  const [plugins, setPlugins] = useState<MarketplacePlugin[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [whiteLabelConfigs, setWhiteLabelConfigs] = useState<WhiteLabelConfig[]>([]);
  const [partnerIntegrations, setPartnerIntegrations] = useState<PartnerIntegration[]>([]);
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([]);
  const [installedPlugins, setInstalledPlugins] = useState<any[]>([]);
  const [marketplaceAnalytics, setMarketplaceAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all marketplace data
  const loadMarketplaceData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        pluginsData,
        apisData,
        whiteLabelData,
        partnersData,
        workflowsData,
        installedData,
        analyticsData
      ] = await Promise.all([
        enterpriseMarketplaceService.searchPlugins(''),
        enterpriseMarketplaceService.getAPIEndpoints(),
        enterpriseMarketplaceService.getWhiteLabelConfigs(),
        enterpriseMarketplaceService.getPartnerIntegrations(),
        enterpriseMarketplaceService.getWorkflowTemplates(),
        enterpriseMarketplaceService.getInstalledPlugins(),
        enterpriseMarketplaceService.getMarketplaceAnalytics()
      ]);

      setPlugins(pluginsData);
      setApiEndpoints(apisData);
      setWhiteLabelConfigs(whiteLabelData);
      setPartnerIntegrations(partnersData);
      setWorkflowTemplates(workflowsData);
      setInstalledPlugins(installedData);
      setMarketplaceAnalytics(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Plugin operations
  const searchPlugins = useCallback(async (query: string, category?: string, tags?: string[]) => {
    try {
      const results = await enterpriseMarketplaceService.searchPlugins(query, category, tags);
      setPlugins(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search plugins');
      return [];
    }
  }, []);

  const installPlugin = useCallback(async (pluginId: string, config: Record<string, any> = {}) => {
    try {
      const result = await enterpriseMarketplaceService.installPlugin(pluginId, config);
      if (result.success) {
        // Refresh installed plugins
        const updatedInstalled = await enterpriseMarketplaceService.getInstalledPlugins();
        setInstalledPlugins(updatedInstalled);
        
        // Refresh analytics
        const updatedAnalytics = await enterpriseMarketplaceService.getMarketplaceAnalytics();
        setMarketplaceAnalytics(updatedAnalytics);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to install plugin';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  const uninstallPlugin = useCallback(async (pluginId: string) => {
    try {
      const result = await enterpriseMarketplaceService.uninstallPlugin(pluginId);
      if (result.success) {
        // Refresh installed plugins
        const updatedInstalled = await enterpriseMarketplaceService.getInstalledPlugins();
        setInstalledPlugins(updatedInstalled);
        
        // Refresh analytics
        const updatedAnalytics = await enterpriseMarketplaceService.getMarketplaceAnalytics();
        setMarketplaceAnalytics(updatedAnalytics);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to uninstall plugin';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  // API operations
  const generateAPIKey = useCallback(async (endpointId: string, tier: 'free' | 'pro' | 'enterprise') => {
    try {
      const result = await enterpriseMarketplaceService.generateAPIKey(endpointId, tier);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate API key');
      throw err;
    }
  }, []);

  const getAPIEndpointsByCategory = useCallback((category?: string) => {
    return enterpriseMarketplaceService.getAPIEndpoints(category);
  }, []);

  // White label operations
  const createWhiteLabelSolution = useCallback(async (config: Partial<WhiteLabelConfig>) => {
    try {
      const result = await enterpriseMarketplaceService.createWhiteLabelSolution(config);
      
      // Refresh white label configs
      const updatedConfigs = await enterpriseMarketplaceService.getWhiteLabelConfigs();
      setWhiteLabelConfigs(updatedConfigs);
      
      // Refresh analytics
      const updatedAnalytics = await enterpriseMarketplaceService.getMarketplaceAnalytics();
      setMarketplaceAnalytics(updatedAnalytics);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create white label solution');
      throw err;
    }
  }, []);

  // Partner operations
  const getPartnersByType = useCallback((type?: string) => {
    return enterpriseMarketplaceService.getPartnerIntegrations(type);
  }, []);

  // Workflow operations
  const getWorkflowsByCategory = useCallback((category?: string, industry?: string) => {
    return enterpriseMarketplaceService.getWorkflowTemplates(category, industry);
  }, []);

  const createCustomWorkflow = useCallback(async (template: Partial<WorkflowTemplate>) => {
    try {
      const result = await enterpriseMarketplaceService.createCustomWorkflow(template);
      
      // Refresh workflow templates
      const updatedTemplates = await enterpriseMarketplaceService.getWorkflowTemplates();
      setWorkflowTemplates(updatedTemplates);
      
      // Refresh analytics
      const updatedAnalytics = await enterpriseMarketplaceService.getMarketplaceAnalytics();
      setMarketplaceAnalytics(updatedAnalytics);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create custom workflow');
      throw err;
    }
  }, []);

  // Analytics operations
  const refreshAnalytics = useCallback(async () => {
    try {
      const analytics = await enterpriseMarketplaceService.getMarketplaceAnalytics();
      setMarketplaceAnalytics(analytics);
      return analytics;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh analytics');
      return {};
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    loadMarketplaceData();
  }, [loadMarketplaceData]);

  return {
    // State
    plugins,
    apiEndpoints,
    whiteLabelConfigs,
    partnerIntegrations,
    workflowTemplates,
    installedPlugins,
    marketplaceAnalytics,
    loading,
    error,

    // Actions
    loadMarketplaceData,
    searchPlugins,
    installPlugin,
    uninstallPlugin,
    generateAPIKey,
    getAPIEndpointsByCategory,
    createWhiteLabelSolution,
    getPartnersByType,
    getWorkflowsByCategory,
    createCustomWorkflow,
    refreshAnalytics,

    // Utilities
    clearError: () => setError(null),
    isPluginInstalled: (pluginId: string) => 
      installedPlugins.some(p => p.plugin.id === pluginId),
    getInstalledPluginConfig: (pluginId: string) => 
      installedPlugins.find(p => p.plugin.id === pluginId)?.config || {},
    getPluginsByCategory: (category: string) => 
      plugins.filter(p => p.category === category),
    getFeaturedPlugins: () => 
      plugins.filter(p => p.featured),
    getPopularWorkflows: () => 
      workflowTemplates.sort((a, b) => b.metrics.usage - a.metrics.usage).slice(0, 5),
    getTopPartners: () => 
      partnerIntegrations.sort((a, b) => b.metrics.revenue - a.metrics.revenue).slice(0, 5)
  };
};

// Specialized hooks for specific marketplace sections

export const usePluginMarketplace = () => {
  const {
    plugins,
    installedPlugins,
    loading,
    error,
    searchPlugins,
    installPlugin,
    uninstallPlugin,
    isPluginInstalled,
    getInstalledPluginConfig,
    getPluginsByCategory,
    getFeaturedPlugins,
    clearError
  } = useEnterpriseMarketplace();

  return {
    plugins,
    installedPlugins,
    loading,
    error,
    searchPlugins,
    installPlugin,
    uninstallPlugin,
    isPluginInstalled,
    getInstalledPluginConfig,
    getPluginsByCategory,
    getFeaturedPlugins,
    clearError
  };
};

export const useAPIMarketplace = () => {
  const {
    apiEndpoints,
    loading,
    error,
    generateAPIKey,
    getAPIEndpointsByCategory,
    clearError
  } = useEnterpriseMarketplace();

  const [apiKeys, setApiKeys] = useState<Record<string, { key: string; limits: any }>>({});

  const createAPIKey = useCallback(async (endpointId: string, tier: 'free' | 'pro' | 'enterprise') => {
    try {
      const result = await generateAPIKey(endpointId, tier);
      setApiKeys(prev => ({
        ...prev,
        [endpointId]: { key: result.apiKey, limits: result.limits }
      }));
      return result;
    } catch (err) {
      throw err;
    }
  }, [generateAPIKey]);

  return {
    apiEndpoints,
    apiKeys,
    loading,
    error,
    createAPIKey,
    getAPIEndpointsByCategory,
    clearError,
    hasAPIKey: (endpointId: string) => !!apiKeys[endpointId],
    getAPIKey: (endpointId: string) => apiKeys[endpointId]?.key,
    getAPILimits: (endpointId: string) => apiKeys[endpointId]?.limits
  };
};

export const useWhiteLabelMarketplace = () => {
  const {
    whiteLabelConfigs,
    loading,
    error,
    createWhiteLabelSolution,
    clearError
  } = useEnterpriseMarketplace();

  const [deploymentStatus, setDeploymentStatus] = useState<Record<string, string>>({});

  const deployWhiteLabelSolution = useCallback(async (configId: string) => {
    setDeploymentStatus(prev => ({ ...prev, [configId]: 'deploying' }));
    
    // Simulate deployment process
    setTimeout(() => {
      setDeploymentStatus(prev => ({ ...prev, [configId]: 'deployed' }));
    }, 5000);
  }, []);

  return {
    whiteLabelConfigs,
    deploymentStatus,
    loading,
    error,
    createWhiteLabelSolution,
    deployWhiteLabelSolution,
    clearError,
    getActiveConfigs: () => whiteLabelConfigs.filter(c => c.status === 'active'),
    getPendingConfigs: () => whiteLabelConfigs.filter(c => c.status === 'pending'),
    isDeploying: (configId: string) => deploymentStatus[configId] === 'deploying',
    isDeployed: (configId: string) => deploymentStatus[configId] === 'deployed'
  };
};

export const useWorkflowMarketplace = () => {
  const {
    workflowTemplates,
    loading,
    error,
    getWorkflowsByCategory,
    createCustomWorkflow,
    getPopularWorkflows,
    clearError
  } = useEnterpriseMarketplace();

  const [executionStatus, setExecutionStatus] = useState<Record<string, string>>({});

  const executeWorkflow = useCallback(async (workflowId: string, inputs: Record<string, any> = {}) => {
    setExecutionStatus(prev => ({ ...prev, [workflowId]: 'running' }));
    
    // Simulate workflow execution
    setTimeout(() => {
      setExecutionStatus(prev => ({ ...prev, [workflowId]: 'completed' }));
    }, 3000);
  }, []);

  return {
    workflowTemplates,
    executionStatus,
    loading,
    error,
    getWorkflowsByCategory,
    createCustomWorkflow,
    executeWorkflow,
    getPopularWorkflows,
    clearError,
    isExecuting: (workflowId: string) => executionStatus[workflowId] === 'running',
    isCompleted: (workflowId: string) => executionStatus[workflowId] === 'completed',
    getWorkflowsByIndustry: (industry: string) => 
      workflowTemplates.filter(w => w.industry.includes(industry)),
    getWorkflowsByComplexity: (complexity: 'simple' | 'intermediate' | 'advanced') => 
      workflowTemplates.filter(w => w.complexity === complexity)
  };
};

export const usePartnerMarketplace = () => {
  const {
    partnerIntegrations,
    loading,
    error,
    getPartnersByType,
    getTopPartners,
    clearError
  } = useEnterpriseMarketplace();

  return {
    partnerIntegrations,
    loading,
    error,
    getPartnersByType,
    getTopPartners,
    clearError,
    getTechnologyPartners: () => getPartnersByType('technology'),
    getChannelPartners: () => getPartnersByType('channel'),
    getSolutionPartners: () => getPartnersByType('solution'),
    getStrategicPartners: () => getPartnersByType('strategic'),
    getPartnersByTier: (tier: 'bronze' | 'silver' | 'gold' | 'platinum') => 
      partnerIntegrations.filter(p => p.tier === tier),
    getActivePartners: () => partnerIntegrations.filter(p => p.status === 'active')
  };
};

export default useEnterpriseMarketplace; 