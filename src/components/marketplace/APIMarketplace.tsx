/**
 * API Marketplace - Discover and integrate with ProofPix APIs
 * Provides API discovery, testing, key management, and integration tools
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code,
  Key,
  Play,
  Copy,
  Search,
  Star,
  TrendingUp,
  BarChart3,
  Plus
} from 'lucide-react';
import { useEnterpriseMarketplace } from '../../hooks/useEnterpriseMarketplace';
import { ConsistentLayout } from '../ui/ConsistentLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../ui/EnterpriseComponents';

interface APIMarketplaceProps {
  className?: string;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  tier: 'free' | 'pro' | 'enterprise';
  usage: {
    current: number;
    limit: number;
    resetDate: Date;
  };
  permissions: string[];
  createdAt: Date;
  lastUsed?: Date;
  status: 'active' | 'suspended' | 'expired';
}

export const APIMarketplace: React.FC<APIMarketplaceProps> = ({
  className = ''
}) => {
  const {
    apiEndpoints,
    loading,
    error,
    generateAPIKey,
    getAPIEndpointsByCategory
  } = useEnterpriseMarketplace();

  const [activeTab, setActiveTab] = useState<'discover' | 'keys' | 'docs' | 'analytics'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAPI, setSelectedAPI] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);

  // Mock API keys for demonstration
  useEffect(() => {
    setApiKeys([
      {
        id: 'key-1',
        name: 'Production API Key',
        key: 'pk_live_1234567890abcdef',
        tier: 'enterprise',
        usage: { current: 1250, limit: 10000, resetDate: new Date('2024-02-01') },
        permissions: ['read', 'write', 'admin'],
        createdAt: new Date('2024-01-01'),
        lastUsed: new Date('2024-01-15'),
        status: 'active'
      },
      {
        id: 'key-2',
        name: 'Development API Key',
        key: 'pk_test_abcdef1234567890',
        tier: 'pro',
        usage: { current: 450, limit: 1000, resetDate: new Date('2024-02-01') },
        permissions: ['read', 'write'],
        createdAt: new Date('2024-01-10'),
        lastUsed: new Date('2024-01-14'),
        status: 'active'
      }
    ]);
  }, []);

  const filteredAPIs = apiEndpoints.filter(api => {
    const matchesSearch = !searchQuery || 
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleTestAPI = async (api: any) => {
    // Simulate API test
    setTestResponse({
      status: 200,
      data: {
        message: 'API test successful',
        timestamp: new Date().toISOString(),
        endpoint: api.endpoint,
        method: 'GET'
      },
      headers: {
        'content-type': 'application/json',
        'x-ratelimit-remaining': '999'
      }
    });
  };

  const handleGenerateKey = async (tier: 'free' | 'pro' | 'enterprise') => {
    try {
      const result = await generateAPIKey('default', tier);
      // Add new key to state
      const newKey: APIKey = {
        id: `key-${Date.now()}`,
        name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} API Key`,
        key: result.apiKey,
        tier,
        usage: { current: 0, limit: tier === 'free' ? 100 : tier === 'pro' ? 1000 : 10000, resetDate: new Date() },
        permissions: tier === 'enterprise' ? ['read', 'write', 'admin'] : ['read', 'write'],
        createdAt: new Date(),
        status: 'active'
      };
      setApiKeys(prev => [...prev, newKey]);
      setShowKeyModal(false);
    } catch (error) {
      console.error('Failed to generate API key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success notification
  };

  const tabs = [
    { id: 'discover', label: 'Discover APIs', icon: Search },
    { id: 'keys', label: 'API Keys', icon: Key, count: apiKeys.length },
    { id: 'docs', label: 'Documentation', icon: Code },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Code className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  API Marketplace
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Discover and integrate with ProofPix APIs
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowKeyModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Generate API Key</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Discover APIs Tab */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search APIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="document">Document Processing</option>
                <option value="analytics">Analytics</option>
                <option value="security">Security</option>
                <option value="integration">Integration</option>
                <option value="ai">AI & ML</option>
              </select>
            </div>

            {/* API Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAPIs.map((api) => (
                <div key={api.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {api.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {api.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Globe className="h-4 w-4" />
                          <span>{api.endpoint}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Activity className="h-4 w-4" />
                          <span>{api.metrics.successRate}% uptime</span>
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      api.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {api.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {api.metrics.popularityScore.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {api.metrics.totalRequests.toLocaleString()} requests
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      api.category === 'security' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      api.category === 'ai' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {api.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {api.pricing.model === 'free' ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                      ) : (
                        <span className="text-gray-900 dark:text-white font-medium">
                          ${api.pricing.cost}/1000 requests
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestAPI(api)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                      >
                        <Play className="h-3 w-3" />
                        <span>Test</span>
                      </button>
                      <button
                        onClick={() => setSelectedAPI(api)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h2>
              <button
                onClick={() => setShowKeyModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Generate New Key</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {apiKeys.map((key) => (
                <div key={key.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {key.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="flex items-center space-x-1">
                          <Key className="h-4 w-4" />
                          <span>{key.key.substring(0, 20)}...</span>
                        </span>
                        <button
                          onClick={() => copyToClipboard(key.key)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Created: {key.createdAt.toLocaleDateString()}</span>
                        {key.lastUsed && (
                          <span>Last used: {key.lastUsed.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        key.tier === 'enterprise' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        key.tier === 'pro' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {key.tier}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        key.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {key.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Usage</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {((key.usage.current / key.usage.limit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(key.usage.current / key.usage.limit) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {key.usage.current.toLocaleString()} / {key.usage.limit.toLocaleString()} requests
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Permissions</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {key.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Reset Date</span>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {key.usage.resetDate.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Usage limits reset monthly
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <button className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center space-x-1">
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button className="px-3 py-1 text-red-600 hover:text-red-700 flex items-center space-x-1">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">API Documentation</h3>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive API documentation coming soon...</p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">API Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">Usage analytics and insights coming soon...</p>
          </div>
        )}
      </div>

      {/* Generate API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Generate API Key
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Choose the tier for your new API key. Different tiers have different rate limits and features.
            </p>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleGenerateKey('free')}
                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Free Tier</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">100 requests/month</p>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-medium">$0</span>
                </div>
              </button>
              
              <button
                onClick={() => handleGenerateKey('pro')}
                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Pro Tier</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">1,000 requests/month</p>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">$29/mo</span>
                </div>
              </button>
              
              <button
                onClick={() => handleGenerateKey('enterprise')}
                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Enterprise Tier</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">10,000 requests/month</p>
                  </div>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">$299/mo</span>
                </div>
              </button>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Response Modal */}
      {testResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                API Test Response
              </h3>
              <button
                onClick={() => setTestResponse(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-auto max-h-96">
              <pre>{JSON.stringify(testResponse, null, 2)}</pre>
            </div>
            
            <div className="flex items-center justify-end mt-4">
              <button
                onClick={() => setTestResponse(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 