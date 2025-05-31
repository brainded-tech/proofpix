/**
 * Enterprise Integrations Dashboard - Priority 15
 * Comprehensive dashboard for managing enterprise platform integrations
 */

import React, { useState, useEffect } from 'react';
import { 
  useEnterpriseIntegrations, 
  useIntegrationAnalytics,
  useSalesforceIntegration,
  useMicrosoft365Integration,
  useGoogleWorkspaceIntegration,
  useCommunicationIntegrations,
  useZapierIntegration
} from '../../hooks/useEnterpriseIntegrations';

interface IntegrationCardProps {
  integration: any;
  onConnect: (id: string, credentials: any) => void;
  onDisconnect: (id: string) => void;
  onTest: (id: string) => void;
  onSync?: (id: string) => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ 
  integration, 
  onConnect, 
  onDisconnect, 
  onTest, 
  onSync 
}) => {
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState<Record<string, any>>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'configuring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIntegrationIcon = (id: string) => {
    const icons: Record<string, string> = {
      'salesforce': '🏢',
      'microsoft365': '📧',
      'google-workspace': '🌐',
      'slack': '💬',
      'microsoft-teams': '👥',
      'zapier': '⚡'
    };
    return icons[id] || '🔗';
  };

  const renderCredentialsForm = () => {
    switch (integration.id) {
      case 'salesforce':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Instance URL"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.instanceUrl || ''}
              onChange={(e) => setCredentials({...credentials, instanceUrl: e.target.value})}
            />
            <input
              type="text"
              placeholder="Client ID"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.clientId || ''}
              onChange={(e) => setCredentials({...credentials, clientId: e.target.value})}
            />
            <input
              type="password"
              placeholder="Client Secret"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.clientSecret || ''}
              onChange={(e) => setCredentials({...credentials, clientSecret: e.target.value})}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.username || ''}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.password || ''}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
            <input
              type="text"
              placeholder="Security Token"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.securityToken || ''}
              onChange={(e) => setCredentials({...credentials, securityToken: e.target.value})}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sandbox"
                checked={credentials.sandbox || false}
                onChange={(e) => setCredentials({...credentials, sandbox: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="sandbox">Sandbox Environment</label>
            </div>
          </div>
        );
      case 'microsoft365':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tenant ID"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.tenantId || ''}
              onChange={(e) => setCredentials({...credentials, tenantId: e.target.value})}
            />
            <input
              type="text"
              placeholder="Client ID"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.clientId || ''}
              onChange={(e) => setCredentials({...credentials, clientId: e.target.value})}
            />
            <input
              type="password"
              placeholder="Client Secret"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.clientSecret || ''}
              onChange={(e) => setCredentials({...credentials, clientSecret: e.target.value})}
            />
            <input
              type="text"
              placeholder="Redirect URI"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.redirectUri || ''}
              onChange={(e) => setCredentials({...credentials, redirectUri: e.target.value})}
            />
          </div>
        );
      case 'google-workspace':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Client ID"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.clientId || ''}
              onChange={(e) => setCredentials({...credentials, clientId: e.target.value})}
            />
            <input
              type="password"
              placeholder="Client Secret"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.clientSecret || ''}
              onChange={(e) => setCredentials({...credentials, clientSecret: e.target.value})}
            />
            <input
              type="text"
              placeholder="Refresh Token"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.refreshToken || ''}
              onChange={(e) => setCredentials({...credentials, refreshToken: e.target.value})}
            />
          </div>
        );
      case 'slack':
        return (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Bot Token"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.botToken || ''}
              onChange={(e) => setCredentials({...credentials, botToken: e.target.value})}
            />
            <input
              type="password"
              placeholder="Signing Secret"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.signingSecret || ''}
              onChange={(e) => setCredentials({...credentials, signingSecret: e.target.value})}
            />
            <input
              type="text"
              placeholder="App ID"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.appId || ''}
              onChange={(e) => setCredentials({...credentials, appId: e.target.value})}
            />
          </div>
        );
      case 'microsoft-teams':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tenant ID"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.tenantId || ''}
              onChange={(e) => setCredentials({...credentials, tenantId: e.target.value})}
            />
            <input
              type="text"
              placeholder="Client ID"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.clientId || ''}
              onChange={(e) => setCredentials({...credentials, clientId: e.target.value})}
            />
            <input
              type="password"
              placeholder="Client Secret"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.clientSecret || ''}
              onChange={(e) => setCredentials({...credentials, clientSecret: e.target.value})}
            />
            <input
              type="text"
              placeholder="Bot ID"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.botId || ''}
              onChange={(e) => setCredentials({...credentials, botId: e.target.value})}
            />
          </div>
        );
      case 'zapier':
        return (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="API Key"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.apiKey || ''}
              onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
            />
            <input
              type="text"
              placeholder="Webhook URL"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.webhookUrl || ''}
              onChange={(e) => setCredentials({...credentials, webhookUrl: e.target.value})}
            />
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="API Key"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={credentials.apiKey || ''}
              onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{getIntegrationIcon(integration.id)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{integration.type}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
          {integration.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Last Sync:</span>
          <span className="text-gray-900">
            {integration.lastSync ? new Date(integration.lastSync).toLocaleDateString() : 'Never'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Sync Frequency:</span>
          <span className="text-gray-900 capitalize">{integration.syncFrequency}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Features:</span>
          <span className="text-gray-900">{integration.features?.length || 0}</span>
        </div>
      </div>

      {integration.features && integration.features.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
          <div className="flex flex-wrap gap-1">
            {integration.features.slice(0, 3).map((feature: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {feature}
              </span>
            ))}
            {integration.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{integration.features.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {showCredentials && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Configuration</h4>
          {renderCredentialsForm()}
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => {
                onConnect(integration.id, credentials);
                setShowCredentials(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save & Connect
            </button>
            <button
              onClick={() => setShowCredentials(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {integration.status === 'disconnected' ? (
          <button
            onClick={() => setShowCredentials(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Connect
          </button>
        ) : (
          <>
            <button
              onClick={() => onDisconnect(integration.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Disconnect
            </button>
            <button
              onClick={() => onTest(integration.id)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Test
            </button>
            {onSync && (
              <button
                onClick={() => onSync(integration.id)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Sync
              </button>
            )}
          </>
        )}
        <button
          onClick={() => setShowCredentials(!showCredentials)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
        >
          Configure
        </button>
      </div>
    </div>
  );
};

const EnterpriseIntegrationsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    integrations,
    connectedIntegrations,
    disconnectedIntegrations,
    loading,
    error,
    connectIntegration,
    disconnectIntegration,
    testConnection,
    syncAllIntegrations
  } = useEnterpriseIntegrations();

  const { analytics } = useIntegrationAnalytics();
  const { syncData: syncSalesforce } = useSalesforceIntegration();
  const { syncData: syncMicrosoft365 } = useMicrosoft365Integration();
  const { syncData: syncGoogleWorkspace } = useGoogleWorkspaceIntegration();
  const { sendSlackNotification, sendTeamsNotification } = useCommunicationIntegrations();
  const { triggerWebhook, webhookEvents } = useZapierIntegration();

  const handleSync = async (integrationId: string) => {
    try {
      switch (integrationId) {
        case 'salesforce':
          await syncSalesforce();
          break;
        case 'microsoft365':
          await syncMicrosoft365();
          break;
        case 'google-workspace':
          await syncGoogleWorkspace();
          break;
      }
    } catch (error) {
      console.error(`Sync failed for ${integrationId}:`, error);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'webhooks', name: 'Webhooks', icon: '⚡' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Integrations</h1>
        <p className="text-gray-600">Manage your enterprise platform integrations and workflows</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🔗</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                  <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Connected</p>
                  <p className="text-2xl font-bold text-gray-900">{connectedIntegrations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Syncs</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalSyncs || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Webhooks</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalWebhooks || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={syncAllIntegrations}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sync All Integrations
              </button>
              <button
                onClick={() => sendSlackNotification('#general', 'Test notification from ProofPix')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Slack Notification
              </button>
              <button
                onClick={() => sendTeamsNotification('General', 'Test notification from ProofPix')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Test Teams Notification
              </button>
              <button
                onClick={() => triggerWebhook('test_event', { message: 'Test webhook trigger' })}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Trigger Test Webhook
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {webhookEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{event.event}</p>
                    <p className="text-sm text-gray-600">{event.integrationId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{new Date(event.timestamp).toLocaleString()}</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.processed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.processed ? 'Processed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConnect={connectIntegration}
              onDisconnect={disconnectIntegration}
              onTest={testConnection}
              onSync={handleSync}
            />
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Integration Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{analytics.successfulSyncs || 0}</p>
                <p className="text-gray-600">Successful Syncs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{analytics.failedSyncs || 0}</p>
                <p className="text-gray-600">Failed Syncs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{analytics.averageSyncTime || 0}ms</p>
                <p className="text-gray-600">Avg Sync Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Integration Status</h3>
            <div className="space-y-3">
              {Object.entries(analytics.integrationStatus || {}).map(([id, status]) => (
                <div key={id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium capitalize">{id.replace('-', ' ')}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status as string)}`}>
                    {String(status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Webhook Events</h3>
            <div className="space-y-3">
              {webhookEvents.map((event) => (
                <div key={event.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{event.event}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.processed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.processed ? 'Processed' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Source: {event.integrationId}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                  {event.retryCount > 0 && (
                    <p className="text-sm text-orange-600">Retry count: {event.retryCount}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>File Upload Notifications</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span>Processing Complete Notifications</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span>Error Notifications</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span>Sync Notifications</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected': return 'bg-green-100 text-green-800';
    case 'disconnected': return 'bg-gray-100 text-gray-800';
    case 'error': return 'bg-red-100 text-red-800';
    case 'configuring': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default EnterpriseIntegrationsDashboard; 