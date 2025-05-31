/**
 * Enterprise Integrations Dashboard - Priority 9
 * Comprehensive management interface for enterprise system integrations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Settings, 
  TestTube, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  ExternalLink,
  Activity,
  BarChart3,
  Users,
  Building,
  Cloud,
  MessageSquare,
  FileText,
  Zap
} from 'lucide-react';
import { 
  enterpriseIntegrationsService, 
  IntegrationConfig,
  SalesforceConfig,
  SharePointConfig,
  SlackConfig,
  BatchResult
} from '../../services/enterpriseIntegrationsService';
import { advancedAnalyticsService } from '../../services/advancedAnalyticsService';

interface EnterpriseIntegrationsDashboardProps {
  className?: string;
}

interface IntegrationStats {
  totalIntegrations: number;
  activeIntegrations: number;
  lastSyncTime: Date | null;
  totalProcessed: number;
  successRate: number;
}

export const EnterpriseIntegrationsDashboard: React.FC<EnterpriseIntegrationsDashboardProps> = ({
  className = ''
}) => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [stats, setStats] = useState<IntegrationStats>({
    totalIntegrations: 0,
    activeIntegrations: 0,
    lastSyncTime: null,
    totalProcessed: 0,
    successRate: 0
  });
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configType, setConfigType] = useState<'salesforce' | 'sharepoint' | 'slack' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentBatches, setRecentBatches] = useState<BatchResult[]>([]);

  // Load integrations and stats
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const integrationsData = await enterpriseIntegrationsService.getIntegrations();
      setIntegrations(integrationsData);

      // Calculate stats
      const activeCount = integrationsData.filter(i => i.status === 'connected').length;
      const lastSync = integrationsData
        .filter(i => i.lastSync)
        .sort((a, b) => (b.lastSync?.getTime() || 0) - (a.lastSync?.getTime() || 0))[0]?.lastSync || null;

      setStats({
        totalIntegrations: integrationsData.length,
        activeIntegrations: activeCount,
        lastSyncTime: lastSync,
        totalProcessed: Math.floor(Math.random() * 10000), // Mock data
        successRate: 94.5 + Math.random() * 5 // Mock data
      });

      // Load recent batches (mock data)
      setRecentBatches([
        {
          batchId: 'sf_batch_001',
          totalFiles: 45,
          successCount: 43,
          errorCount: 2,
          results: [],
          startTime: new Date(Date.now() - 3600000),
          endTime: new Date(Date.now() - 3300000),
          duration: 300000
        },
        {
          batchId: 'sp_batch_002',
          totalFiles: 128,
          successCount: 125,
          errorCount: 3,
          results: [],
          startTime: new Date(Date.now() - 7200000),
          endTime: new Date(Date.now() - 6900000),
          duration: 300000
        }
      ]);

      advancedAnalyticsService.trackFeatureUsage('Enterprise Integration', 'Dashboard Viewed');
    } catch (error) {
      console.error('Failed to load integrations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleConfigureIntegration = (type: 'salesforce' | 'sharepoint' | 'slack') => {
    setConfigType(type);
    setShowConfigModal(true);
  };

  const handleTestIntegration = async (integration: IntegrationConfig) => {
    try {
      setIsProcessing(true);
      const success = await enterpriseIntegrationsService.testIntegrationConnection(integration.id);
      
      if (success) {
        // Update integration status - this would need to be implemented
        // await enterpriseIntegrationsService.updateIntegration(integration.id, { status: 'connected' });
        await loadData();
      }
    } catch (error) {
      console.error('Integration test failed:', error);
      // await enterpriseIntegrationsService.updateIntegration(integration.id, { status: 'error' });
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncIntegration = async (integration: IntegrationConfig) => {
    try {
      setIsProcessing(true);
      // Use the appropriate sync method based on integration type
      switch (integration.id) {
        case 'salesforce':
          await enterpriseIntegrationsService.syncSalesforceData();
          break;
        case 'microsoft365':
          await enterpriseIntegrationsService.syncMicrosoft365Data();
          break;
        case 'google-workspace':
          await enterpriseIntegrationsService.syncGoogleWorkspaceData();
          break;
        default:
          console.log(`Sync not implemented for ${integration.id}`);
      }
      await loadData();
    } catch (error) {
      console.error('Integration sync failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteIntegration = async (integration: IntegrationConfig) => {
    if (window.confirm(`Are you sure you want to delete the ${integration.name} integration?`)) {
      try {
        await enterpriseIntegrationsService.disconnectIntegration(integration.id);
        await loadData();
      } catch (error) {
        console.error('Failed to delete integration:', error);
      }
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'salesforce':
        return <Cloud className="h-6 w-6 text-blue-600" />;
      case 'sharepoint':
        return <Building className="h-6 w-6 text-purple-600" />;
      case 'slack':
        return <MessageSquare className="h-6 w-6 text-green-600" />;
      case 'microsoft365':
        return <FileText className="h-6 w-6 text-orange-600" />;
      case 'google_workspace':
        return <Users className="h-6 w-6 text-red-600" />;
      default:
        return <Zap className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Enterprise Integrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage connections to your enterprise systems and automate workflows
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleConfigureIntegration('salesforce')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Integration</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Integrations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalIntegrations}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeIntegrations}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Files Processed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProcessed.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.successRate.toFixed(1)}%</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getIntegrationIcon(integration.type)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {integration.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusIcon(integration.status)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Last Sync:</span>
                <span className="text-gray-900 dark:text-white">
                  {integration.lastSync ? new Date(integration.lastSync).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleTestIntegration(integration)}
                disabled={isProcessing}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
              >
                <TestTube className="h-3 w-3" />
                <span>Test</span>
              </button>
              
              <button
                onClick={() => handleSyncIntegration(integration)}
                disabled={isProcessing}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Sync</span>
              </button>
              
              <button
                onClick={() => setSelectedIntegration(integration)}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                <Settings className="h-3 w-3" />
                <span>Config</span>
              </button>
              
              <button
                onClick={() => handleDeleteIntegration(integration)}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}

        {/* Add New Integration Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 flex flex-col items-center justify-center text-center">
          <Plus className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Add Integration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Connect to your enterprise systems
          </p>
          
          <div className="space-y-2 w-full">
            <button
              onClick={() => handleConfigureIntegration('salesforce')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Cloud className="h-4 w-4" />
              <span>Salesforce</span>
            </button>
            
            <button
              onClick={() => handleConfigureIntegration('sharepoint')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Building className="h-4 w-4" />
              <span>SharePoint</span>
            </button>
            
            <button
              onClick={() => handleConfigureIntegration('slack')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Slack</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Batches */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Processing Batches</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Batch ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Files
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentBatches.map((batch) => (
                <tr key={batch.batchId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {batch.batchId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {batch.totalFiles}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {((batch.successCount / batch.totalFiles) * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {Math.round(batch.duration / 1000)}s
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {batch.startTime.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && configType && (
        <IntegrationConfigModal
          type={configType}
          onClose={() => {
            setShowConfigModal(false);
            setConfigType(null);
          }}
          onSave={async (config) => {
            try {
              // TODO: Implement these methods in the new service
              // switch (configType) {
              //   case 'salesforce':
              //     await enterpriseIntegrationsService.configureSalesforce(config as SalesforceConfig);
              //     break;
              //   case 'sharepoint':
              //     await enterpriseIntegrationsService.configureSharePoint(config as SharePointConfig);
              //     break;
              //   case 'slack':
              //     await enterpriseIntegrationsService.configureSlack(config as SlackConfig);
              //     break;
              // }
              console.log('Configuration saved:', config);
              await loadData();
              setShowConfigModal(false);
              setConfigType(null);
            } catch (error) {
              console.error('Failed to configure integration:', error);
            }
          }}
        />
      )}

      {/* Integration Details Modal */}
      {selectedIntegration && (
        <IntegrationDetailsModal
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
          onUpdate={async (updates) => {
            // TODO: Implement updateIntegration method in the new service
            // await enterpriseIntegrationsService.updateIntegration(selectedIntegration.id, updates);
            console.log('Integration updated:', updates);
            await loadData();
            setSelectedIntegration(null);
          }}
        />
      )}
    </div>
  );
};

// Configuration Modal Component
interface IntegrationConfigModalProps {
  type: 'salesforce' | 'sharepoint' | 'slack';
  onClose: () => void;
  onSave: (config: any) => Promise<void>;
}

const IntegrationConfigModal: React.FC<IntegrationConfigModalProps> = ({
  type,
  onClose,
  onSave
}) => {
  const [config, setConfig] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(config);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderConfigForm = () => {
    switch (type) {
      case 'salesforce':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={config.clientId || ''}
                onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter Salesforce Client ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Secret
              </label>
              <input
                type="password"
                value={config.clientSecret || ''}
                onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter Salesforce Client Secret"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={config.username || ''}
                onChange={(e) => setConfig({ ...config, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter Salesforce Username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={config.password || ''}
                onChange={(e) => setConfig({ ...config, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter Salesforce Password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Security Token
              </label>
              <input
                type="password"
                value={config.securityToken || ''}
                onChange={(e) => setConfig({ ...config, securityToken: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter Salesforce Security Token"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sandbox"
                checked={config.sandbox || false}
                onChange={(e) => setConfig({ ...config, sandbox: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="sandbox" className="text-sm text-gray-700 dark:text-gray-300">
                Use Sandbox Environment
              </label>
            </div>
          </div>
        );

      case 'sharepoint':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tenant ID
              </label>
              <input
                type="text"
                value={config.tenantId || ''}
                onChange={(e) => setConfig({ ...config, tenantId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter Azure Tenant ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={config.clientId || ''}
                onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter Azure App Client ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client Secret
              </label>
              <input
                type="password"
                value={config.clientSecret || ''}
                onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter Azure App Client Secret"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site URL
              </label>
              <input
                type="url"
                value={config.siteUrl || ''}
                onChange={(e) => setConfig({ ...config, siteUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://company.sharepoint.com/sites/sitename"
              />
            </div>
          </div>
        );

      case 'slack':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bot Token
              </label>
              <input
                type="password"
                value={config.botToken || ''}
                onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="xoxb-your-bot-token"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                App Token
              </label>
              <input
                type="password"
                value={config.appToken || ''}
                onChange={(e) => setConfig({ ...config, appToken: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="xapp-your-app-token"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Signing Secret
              </label>
              <input
                type="password"
                value={config.signingSecret || ''}
                onChange={(e) => setConfig({ ...config, signingSecret: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter Slack Signing Secret"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Channel ID (Optional)
              </label>
              <input
                type="text"
                value={config.channelId || ''}
                onChange={(e) => setConfig({ ...config, channelId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="C1234567890"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Configure {type.charAt(0).toUpperCase() + type.slice(1)} Integration
          </h2>
        </div>
        
        <div className="p-6">
          {renderConfigForm()}
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Integration'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Integration Details Modal Component
interface IntegrationDetailsModalProps {
  integration: IntegrationConfig;
  onClose: () => void;
  onUpdate: (updates: Partial<IntegrationConfig>) => Promise<void>;
}

const IntegrationDetailsModal: React.FC<IntegrationDetailsModalProps> = ({
  integration,
  onClose,
  onUpdate
}) => {
  const [settings, setSettings] = useState(integration.settings);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await onUpdate({ settings });
    } catch (error) {
      console.error('Failed to update integration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {integration.name} Settings
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Auto Sync
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoSync || false}
                onChange={(e) => setSettings({ ...settings, autoSync: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Enable automatic synchronization
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sync Interval (minutes)
            </label>
            <input
              type="number"
              value={Math.floor((settings.syncInterval || 3600000) / 60000)}
              onChange={(e) => setSettings({ ...settings, syncInterval: parseInt(e.target.value) * 60000 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="5"
              max="1440"
            />
          </div>

          {integration.type === 'communication' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notification Types
              </label>
              <div className="space-y-2">
                {['high_privacy_risk', 'batch_complete', 'errors'].map((alertType) => (
                  <div key={alertType} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(settings.alertTypes || []).includes(alertType)}
                      onChange={(e) => {
                        const alertTypes = settings.alertTypes || [];
                        if (e.target.checked) {
                          setSettings({ ...settings, alertTypes: [...alertTypes, alertType] });
                        } else {
                          setSettings({ ...settings, alertTypes: alertTypes.filter((t: string) => t !== alertType) });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {alertType.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseIntegrationsDashboard; 