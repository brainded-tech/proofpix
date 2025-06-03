/**
 * Marketplace Dashboard - Unified Hub for Enterprise Marketplace
 * Integrates plugins, APIs, workflows, white-label solutions, and analytics
 */

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  Code, 
  Workflow,
  Palette,
  Users,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Settings,
  BarChart3,
  Zap,
  Shield,
  Download,
  Star,
  Clock,
  DollarSign,
  Activity,
  Globe,
  Database,
  Cpu,
  HardDrive,
  Network,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Info,
  ArrowRight
} from 'lucide-react';
import { useEnterpriseMarketplace } from '../../hooks/useEnterpriseMarketplace';
import { APIMarketplace } from './APIMarketplace';
import { ConsistentLayout } from '../ui/ConsistentLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../ui/EnterpriseComponents';

interface MarketplaceDashboardProps {
  className?: string;
}

export const MarketplaceDashboard: React.FC<MarketplaceDashboardProps> = ({
  className = ''
}) => {
  const {
    plugins,
    apiEndpoints,
    workflowTemplates,
    installedPlugins,
    marketplaceAnalytics,
    loading,
    error,
    searchPlugins,
    installPlugin,
    uninstallPlugin,
    refreshAnalytics
  } = useEnterpriseMarketplace();

  const [activeTab, setActiveTab] = useState<'overview' | 'plugins' | 'apis' | 'workflows' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Quick stats for overview
  const quickStats = {
    totalPlugins: plugins.length,
    installedPlugins: installedPlugins.length,
    activeAPIs: apiEndpoints.filter(api => api.status === 'active').length,
    totalWorkflows: workflowTemplates.length,
    monthlyRevenue: marketplaceAnalytics?.revenue?.monthly || 0,
    activeUsers: marketplaceAnalytics?.users?.active || 0
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'plugins', label: 'Plugin Store', icon: Package, count: quickStats.totalPlugins },
    { id: 'apis', label: 'API Hub', icon: Code, count: quickStats.activeAPIs },
    { id: 'workflows', label: 'Workflows', icon: Workflow, count: quickStats.totalWorkflows },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const handleSearch = async () => {
    if (activeTab === 'plugins') {
      await searchPlugins(searchQuery, selectedCategory === 'all' ? undefined : selectedCategory);
    }
  };

  const handleInstallPlugin = async (pluginId: string) => {
    const result = await installPlugin(pluginId);
    if (result.success) {
      // Show success notification
      console.log('Plugin installed successfully');
    } else {
      console.error('Plugin installation failed:', result.message);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Store className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Enterprise Marketplace
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Extend ProofPix with plugins, APIs, and workflows
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshAnalytics}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Refresh Data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Integration</span>
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
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading marketplace data...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Plugins</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{quickStats.totalPlugins}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {quickStats.installedPlugins} installed
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active APIs</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{quickStats.activeAPIs}</p>
                  </div>
                  <Code className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Ready for integration
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Workflows</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{quickStats.totalWorkflows}</p>
                  </div>
                  <Workflow className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Templates available
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${quickStats.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {quickStats.activeUsers} active users
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Plugin Installs
                </h3>
                <div className="space-y-3">
                  {installedPlugins.slice(0, 5).map((installation, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {installation.plugin.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            v{installation.plugin.version}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                        {installation.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Workflows
                </h3>
                <div className="space-y-3">
                  {workflowTemplates.slice(0, 5).map((workflow, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <Workflow className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {workflow.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {workflow.category}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {workflow.metrics.usage} uses
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plugin Store Tab */}
        {activeTab === 'plugins' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search plugins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="processing">Processing</option>
                <option value="analytics">Analytics</option>
                <option value="integration">Integration</option>
                <option value="security">Security</option>
                <option value="workflow">Workflow</option>
                <option value="ai">AI & ML</option>
                <option value="compliance">Compliance</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            {/* Plugin Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plugins.map((plugin) => {
                const isInstalled = installedPlugins.some(p => p.plugin.id === plugin.id);
                return (
                  <div key={plugin.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {plugin.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          by {plugin.developer.name}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {plugin.description}
                        </p>
                      </div>
                      {plugin.featured && (
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {plugin.metrics.rating}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {plugin.metrics.downloads.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        plugin.category === 'security' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        plugin.category === 'ai' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {plugin.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {plugin.pricing.model === 'free' ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                        ) : (
                          <span className="text-gray-900 dark:text-white font-medium">
                            ${plugin.pricing.price}/{plugin.pricing.billingCycle}
                          </span>
                        )}
                      </div>
                      
                      {isInstalled ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600 dark:text-green-400">Installed</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleInstallPlugin(plugin.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Install
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* API Hub Tab */}
        {activeTab === 'apis' && (
          <APIMarketplace />
        )}

        {activeTab === 'workflows' && (
          <div className="text-center py-12">
            <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Workflow Builder</h3>
            <p className="text-gray-600 dark:text-gray-400">Visual workflow builder coming soon...</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-400">Advanced analytics coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}; 