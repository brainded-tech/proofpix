/**
 * API Key Management Component - Priority 5A Integration
 * Comprehensive management of API keys with usage analytics and permissions
 */

import React, { useState } from 'react';
import { useApiKeys } from '../../hooks/useApiIntegration';
import apiService from '../../services/apiService';

interface ApiKeyManagerProps {
  className?: string;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ className = '' }) => {
  const { apiKeys, loading, error, createApiKey, updateApiKey, deleteApiKey, refetch } = useApiKeys();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [keyUsage, setKeyUsage] = useState<any>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const [newKeyData, setNewKeyData] = useState({
    name: '',
    permissions: [] as string[],
    rateLimit: 1000,
  });

  const availablePermissions = [
    'files:read',
    'files:write',
    'files:delete',
    'analytics:read',
    'webhooks:read',
    'webhooks:write',
    'oauth:read',
    'oauth:write',
    'security:read',
  ];

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newKeyData.name.trim()) {
      alert('Please enter a name for the API key');
      return;
    }

    if (newKeyData.permissions.length === 0) {
      alert('Please select at least one permission');
      return;
    }

    try {
      await createApiKey(newKeyData);
      setNewKeyData({ name: '', permissions: [], rateLimit: 1000 });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create API key:', err);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      try {
        await deleteApiKey(keyId);
      } catch (err) {
        console.error('Failed to delete API key:', err);
      }
    }
  };

  const handleToggleKey = async (keyId: string, isActive: boolean) => {
    try {
      await updateApiKey(keyId, { isActive: !isActive });
    } catch (err) {
      console.error('Failed to toggle API key:', err);
    }
  };

  const loadKeyUsage = async (keyId: string) => {
    setLoadingUsage(true);
    try {
      const usage = await apiService.apiKeys.getApiKeyUsage(keyId, {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        end: new Date(),
      });
      setKeyUsage(usage);
      setSelectedKey(keyId);
    } catch (err) {
      console.error('Failed to load key usage:', err);
    } finally {
      setLoadingUsage(false);
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setNewKeyData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={`api-key-manager ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading API keys...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`api-key-manager ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            API Key Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage API keys for accessing ProofPix services
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Key
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Create Key Form */}
      {showCreateForm && (
        <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Create New API Key
          </h3>
          
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Name
              </label>
              <input
                type="text"
                value={newKeyData.name}
                onChange={(e) => setNewKeyData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="e.g., Production API Key"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rate Limit (requests per hour)
              </label>
              <input
                type="number"
                value={newKeyData.rateLimit}
                onChange={(e) => setNewKeyData(prev => ({ ...prev, rateLimit: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                min="1"
                max="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availablePermissions.map(permission => (
                  <label key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newKeyData.permissions.includes(permission)}
                      onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {permission}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Key
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔑</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No API Keys
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first API key to start using the ProofPix API
            </p>
          </div>
        ) : (
          apiKeys.map((key) => (
            <div
              key={key.id}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {key.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      key.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {key.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">API Key</p>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {key.key.substring(0, 20)}...
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.key)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Copy to clipboard"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rate Limit</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {key.rateLimit.toLocaleString()} req/hour
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(key.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {key.permissions.map(permission => (
                        <span
                          key={permission}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {key.usage.requests.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last Used</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {key.usage.lastUsed ? formatDate(key.usage.lastUsed) : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => loadKeyUsage(key.id)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    View Usage
                  </button>
                  
                  <button
                    onClick={() => handleToggleKey(key.id, key.isActive)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      key.isActive
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/40'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40'
                    }`}
                  >
                    {key.isActive ? 'Disable' : 'Enable'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteKey(key.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Usage Details Modal */}
      {selectedKey && keyUsage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                API Key Usage Analytics
              </h3>
              <button
                onClick={() => {
                  setSelectedKey(null);
                  setKeyUsage(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {loadingUsage ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading usage data...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {keyUsage.requests.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Error Rate</p>
                    <p className="text-2xl font-bold text-red-600">
                      {((keyUsage.errors / keyUsage.requests) * 100).toFixed(1)}%
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {keyUsage.avgResponseTime}ms
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
                    <p className="text-2xl font-bold text-red-600">
                      {keyUsage.errors.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Top Endpoints
                  </h4>
                  <div className="space-y-2">
                    {keyUsage.topEndpoints.map((endpoint: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {endpoint.endpoint}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {endpoint.count.toLocaleString()} requests
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager; 