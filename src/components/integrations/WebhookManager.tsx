import React, { useState, useEffect, useCallback } from 'react';
import { 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Send,
  Eye,
  Settings,
  Filter,
  Search,
  Copy,
  ExternalLink
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  headers: Record<string, string>;
  retryPolicy: {
    maxRetries: number;
    backoffType: 'linear' | 'exponential';
    initialDelay: number;
  };
  createdAt: string;
  lastTriggered?: string;
  successRate: number;
  totalDeliveries: number;
  failedDeliveries: number;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  httpStatus?: number;
  responseTime?: number;
  attempt: number;
  maxAttempts: number;
  nextRetry?: string;
  createdAt: string;
  deliveredAt?: string;
  errorMessage?: string;
  payload: any;
  response?: any;
}

const AVAILABLE_EVENTS = [
  'file.uploaded',
  'file.processed',
  'file.analyzed',
  'batch.started',
  'batch.completed',
  'batch.failed',
  'export.ready',
  'user.registered',
  'subscription.changed',
  'security.alert'
];

export const WebhookManager: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'webhooks' | 'deliveries'>('webhooks');

  // Fetch webhooks and deliveries
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      const mockWebhooks: WebhookEndpoint[] = [
        {
          id: 'wh-001',
          name: 'Insurance Claims Processor',
          url: 'https://api.insurance-co.com/webhooks/proofpix',
          events: ['file.processed', 'batch.completed'],
          isActive: true,
          secret: 'whsec_your_webhook_secret_here',
          headers: { 'Authorization': 'Bearer token123' },
          retryPolicy: {
            maxRetries: 3,
            backoffType: 'exponential',
            initialDelay: 1000
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          lastTriggered: new Date(Date.now() - 3600000).toISOString(),
          successRate: 98.5,
          totalDeliveries: 1247,
          failedDeliveries: 19
        },
        {
          id: 'wh-002',
          name: 'Legal Case Management',
          url: 'https://legal-system.law-firm.com/api/evidence',
          events: ['file.uploaded', 'file.analyzed'],
          isActive: true,
          secret: 'whsec_your_webhook_secret_here',
          headers: {},
          retryPolicy: {
            maxRetries: 5,
            backoffType: 'linear',
            initialDelay: 2000
          },
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          lastTriggered: new Date(Date.now() - 7200000).toISOString(),
          successRate: 95.2,
          totalDeliveries: 856,
          failedDeliveries: 41
        }
      ];

      const mockDeliveries: WebhookDelivery[] = [
        {
          id: 'del-001',
          webhookId: 'wh-001',
          event: 'file.processed',
          status: 'delivered',
          httpStatus: 200,
          responseTime: 245,
          attempt: 1,
          maxAttempts: 3,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          deliveredAt: new Date(Date.now() - 3599000).toISOString(),
          payload: {
            fileId: 'file-123',
            fileName: 'claim_photo.jpg',
            metadata: { camera: 'iPhone 13', location: 'New York' }
          },
          response: { success: true, claimId: 'CLM-456' }
        },
        {
          id: 'del-002',
          webhookId: 'wh-002',
          event: 'file.uploaded',
          status: 'failed',
          httpStatus: 500,
          attempt: 3,
          maxAttempts: 5,
          nextRetry: new Date(Date.now() + 300000).toISOString(),
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          errorMessage: 'Internal Server Error',
          payload: {
            fileId: 'file-456',
            fileName: 'evidence.png'
          }
        }
      ];

      setWebhooks(mockWebhooks);
      setDeliveries(mockDeliveries);
      
      analytics.trackFeatureUsage('Webhooks', 'Manager Viewed');
    } catch (error) {
      console.error('Failed to fetch webhook data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter webhooks
  const filteredWebhooks = webhooks.filter(webhook => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && webhook.isActive) ||
      (filter === 'inactive' && !webhook.isActive);
    const matchesSearch = webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webhook.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Webhook actions
  const toggleWebhook = useCallback(async (webhookId: string) => {
    try {
      setWebhooks(prev => prev.map(webhook => 
        webhook.id === webhookId 
          ? { ...webhook, isActive: !webhook.isActive }
          : webhook
      ));
      analytics.trackFeatureUsage('Webhooks', 'Webhook Toggled');
    } catch (error) {
      console.error('Failed to toggle webhook:', error);
    }
  }, []);

  const deleteWebhook = useCallback(async (webhookId: string) => {
    try {
      setWebhooks(prev => prev.filter(webhook => webhook.id !== webhookId));
      analytics.trackFeatureUsage('Webhooks', 'Webhook Deleted');
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  }, []);

  const testWebhook = useCallback(async (webhook: WebhookEndpoint) => {
    try {
      // Simulate webhook test
      const testDelivery: WebhookDelivery = {
        id: `test-${Date.now()}`,
        webhookId: webhook.id,
        event: 'test.event',
        status: 'delivered',
        httpStatus: 200,
        responseTime: 156,
        attempt: 1,
        maxAttempts: 1,
        createdAt: new Date().toISOString(),
        deliveredAt: new Date().toISOString(),
        payload: { test: true, timestamp: new Date().toISOString() },
        response: { received: true }
      };

      setDeliveries(prev => [testDelivery, ...prev]);
      analytics.trackFeatureUsage('Webhooks', 'Webhook Tested');
    } catch (error) {
      console.error('Failed to test webhook:', error);
    }
  }, []);

  const getStatusIcon = (status: WebhookDelivery['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'retrying':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: WebhookDelivery['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'retrying':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading webhook data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Webhook Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure and monitor webhook endpoints</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Webhook</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'webhooks'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Webhook className="h-4 w-4 mr-2 inline" />
            Endpoints ({webhooks.length})
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'deliveries'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Send className="h-4 w-4 mr-2 inline" />
            Deliveries ({deliveries.length})
          </button>
        </nav>
      </div>

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <>
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search webhooks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Webhooks</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredWebhooks.length} of {webhooks.length} webhooks
              </div>
            </div>
          </div>

          {/* Webhooks List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Webhook
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Triggered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredWebhooks.map((webhook) => (
                    <tr key={webhook.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {webhook.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            {webhook.url}
                            <button
                              onClick={() => navigator.clipboard.writeText(webhook.url)}
                              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              title="Copy URL"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          webhook.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                        }`}>
                          {webhook.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.slice(0, 2).map((event) => (
                            <span
                              key={event}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded"
                            >
                              {event}
                            </span>
                          ))}
                          {webhook.events.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 rounded">
                              +{webhook.events.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${webhook.successRate}%` }}
                            ></div>
                          </div>
                          <span>{webhook.successRate.toFixed(1)}%</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {webhook.totalDeliveries} total, {webhook.failedDeliveries} failed
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {webhook.lastTriggered ? (
                          <div>
                            <div>{new Date(webhook.lastTriggered).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(webhook.lastTriggered).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => testWebhook(webhook)}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                            title="Test Webhook"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleWebhook(webhook.id)}
                            className={webhook.isActive 
                              ? "text-orange-600 hover:text-orange-900 dark:hover:text-orange-400"
                              : "text-green-600 hover:text-green-900 dark:hover:text-green-400"
                            }
                            title={webhook.isActive ? "Disable" : "Enable"}
                          >
                            {webhook.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => setSelectedWebhook(webhook)}
                            className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteWebhook(webhook.id)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                            title="Delete Webhook"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Response
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Attempts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {delivery.event}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {webhooks.find(w => w.id === delivery.webhookId)?.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(delivery.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                          {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {delivery.httpStatus && (
                        <div>
                          <div className={`font-medium ${
                            delivery.httpStatus >= 200 && delivery.httpStatus < 300
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {delivery.httpStatus}
                          </div>
                          {delivery.responseTime && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {delivery.responseTime}ms
                            </div>
                          )}
                        </div>
                      )}
                      {delivery.errorMessage && (
                        <div className="text-red-600 text-xs">{delivery.errorMessage}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>{delivery.attempt} / {delivery.maxAttempts}</div>
                      {delivery.nextRetry && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Next: {new Date(delivery.nextRetry).toLocaleTimeString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>{new Date(delivery.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(delivery.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals would go here */}
    </div>
  );
}; 