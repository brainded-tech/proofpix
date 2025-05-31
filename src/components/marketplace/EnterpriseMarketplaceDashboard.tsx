/**
 * Enterprise Marketplace Dashboard - Priority 14
 * Comprehensive marketplace interface for plugins, APIs, white-label solutions, and workflows
 */

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  Code, 
  Palette, 
  Users, 
  Workflow,
  Search,
  Filter,
  Download,
  Star,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  Settings,
  ExternalLink,
  Play,
  Pause,
  Trash2,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { enterpriseMarketplaceService, MarketplacePlugin, APIEndpoint, WhiteLabelConfig, PartnerIntegration, WorkflowTemplate } from '../../services/enterpriseMarketplaceService';

interface EnterpriseMarketplaceDashboardProps {
  className?: string;
}

export const EnterpriseMarketplaceDashboard: React.FC<EnterpriseMarketplaceDashboardProps> = ({
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'plugins' | 'apis' | 'white-label' | 'partners' | 'workflows' | 'analytics'>('plugins');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [plugins, setPlugins] = useState<MarketplacePlugin[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [whiteLabelConfigs, setWhiteLabelConfigs] = useState<WhiteLabelConfig[]>([]);
  const [partnerIntegrations, setPartnerIntegrations] = useState<PartnerIntegration[]>([]);
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([]);
  const [installedPlugins, setInstalledPlugins] = useState<any[]>([]);
  const [marketplaceAnalytics, setMarketplaceAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    setLoading(true);
    try {
      const [pluginsData, apisData, whiteLabelData, partnersData, workflowsData, installedData, analyticsData] = await Promise.all([
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
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (activeTab === 'plugins') {
      const results = await enterpriseMarketplaceService.searchPlugins(searchQuery, selectedCategory);
      setPlugins(results);
    }
  };

  const handleInstallPlugin = async (pluginId: string) => {
    const result = await enterpriseMarketplaceService.installPlugin(pluginId);
    if (result.success) {
      loadMarketplaceData(); // Refresh data
    }
    alert(result.message);
  };

  const handleUninstallPlugin = async (pluginId: string) => {
    const result = await enterpriseMarketplaceService.uninstallPlugin(pluginId);
    if (result.success) {
      loadMarketplaceData(); // Refresh data
    }
    alert(result.message);
  };

  const tabs = [
    { id: 'plugins', label: 'Plugin Store', icon: Package, count: plugins.length },
    { id: 'apis', label: 'API Marketplace', icon: Code, count: apiEndpoints.length },
    { id: 'white-label', label: 'White Label', icon: Palette, count: whiteLabelConfigs.length },
    { id: 'partners', label: 'Partners', icon: Users, count: partnerIntegrations.length },
    { id: 'workflows', label: 'Workflows', icon: Workflow, count: workflowTemplates.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: 0 }
  ];

  return (
    <div className={`bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Store className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Enterprise Marketplace
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Extend ProofPix with plugins, APIs, and custom solutions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'plugins' && (
              <PluginStoreTab 
                plugins={plugins}
                installedPlugins={installedPlugins}
                onInstall={handleInstallPlugin}
                onUninstall={handleUninstallPlugin}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}
            {activeTab === 'apis' && (
              <APIMarketplaceTab 
                endpoints={apiEndpoints}
              />
            )}
            {activeTab === 'white-label' && (
              <WhiteLabelTab 
                configs={whiteLabelConfigs}
              />
            )}
            {activeTab === 'partners' && (
              <PartnersTab 
                partners={partnerIntegrations}
              />
            )}
            {activeTab === 'workflows' && (
              <WorkflowsTab 
                templates={workflowTemplates}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsTab 
                analytics={marketplaceAnalytics}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Plugin Store Tab Component
interface PluginStoreTabProps {
  plugins: MarketplacePlugin[];
  installedPlugins: any[];
  onInstall: (pluginId: string) => void;
  onUninstall: (pluginId: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const PluginStoreTab: React.FC<PluginStoreTabProps> = ({
  plugins,
  installedPlugins,
  onInstall,
  onUninstall,
  selectedCategory,
  onCategoryChange
}) => {
  const categories = ['', 'processing', 'analytics', 'integration', 'security', 'workflow', 'ai', 'compliance'];
  const installedPluginIds = new Set(installedPlugins.map(p => p.plugin.id));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Filter className="h-5 w-5 text-gray-400" />
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.slice(1).map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Featured Plugins */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured Plugins</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plugins.filter(p => p.featured).map((plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              isInstalled={installedPluginIds.has(plugin.id)}
              onInstall={() => onInstall(plugin.id)}
              onUninstall={() => onUninstall(plugin.id)}
            />
          ))}
        </div>
      </div>

      {/* All Plugins */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Plugins</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plugins.filter(p => !p.featured).map((plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              isInstalled={installedPluginIds.has(plugin.id)}
              onInstall={() => onInstall(plugin.id)}
              onUninstall={() => onUninstall(plugin.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Plugin Card Component
interface PluginCardProps {
  plugin: MarketplacePlugin;
  isInstalled: boolean;
  onInstall: () => void;
  onUninstall: () => void;
}

const PluginCard: React.FC<PluginCardProps> = ({ plugin, isInstalled, onInstall, onUninstall }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'processing': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'beta': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getCategoryIcon(plugin.category)}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{plugin.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">v{plugin.version}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plugin.status)}`}>
            {plugin.status}
          </span>
          {plugin.featured && (
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
          )}
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {plugin.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>{plugin.metrics.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span>{plugin.metrics.downloads.toLocaleString()}</span>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {plugin.pricing.model === 'free' ? 'Free' : `$${plugin.pricing.price}/${plugin.pricing.billingCycle}`}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {isInstalled ? (
          <>
            <button
              onClick={onUninstall}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Uninstall</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onInstall}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Install</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Eye className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        {plugin.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
          >
            {tag}
          </span>
        ))}
        {plugin.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
            +{plugin.tags.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};

// API Marketplace Tab Component
interface APIMarketplaceTabProps {
  endpoints: APIEndpoint[];
}

const APIMarketplaceTab: React.FC<APIMarketplaceTabProps> = ({ endpoints }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Endpoints</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Generate API Key</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {endpoints.map((endpoint) => (
          <div
            key={endpoint.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedEndpoint(endpoint)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{endpoint.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{endpoint.method} {endpoint.endpoint}</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-xs font-medium">
                {endpoint.category}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {endpoint.description}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <span>{endpoint.metrics.totalRequests.toLocaleString()} requests</span>
                <span>{endpoint.metrics.successRate}% success</span>
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {endpoint.pricing.model === 'free' ? 'Free' : `$${endpoint.pricing.cost}/request`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Details Modal would go here */}
    </div>
  );
};

// White Label Tab Component
interface WhiteLabelTabProps {
  configs: WhiteLabelConfig[];
}

const WhiteLabelTab: React.FC<WhiteLabelTabProps> = ({ configs }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">White Label Solutions</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Solution</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {configs.map((config) => (
          <div
            key={config.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{config.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{config.domain.subdomain}.proofpix.com</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                config.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                config.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {config.status}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Deployment:</span>
                <span className="text-gray-900 dark:text-white">{config.deployment.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Billing:</span>
                <span className="text-gray-900 dark:text-white">{config.billing.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Support:</span>
                <span className="text-gray-900 dark:text-white">{config.support.level}</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Configure
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Partners Tab Component
interface PartnersTabProps {
  partners: PartnerIntegration[];
}

const PartnersTab: React.FC<PartnersTabProps> = ({ partners }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Partner Integrations</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Partner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{partner.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{partner.contact.company}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  partner.tier === 'platinum' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                  partner.tier === 'gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  partner.tier === 'silver' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                  'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                }`}>
                  {partner.tier}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  partner.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {partner.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className="text-gray-900 dark:text-white">{partner.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                <span className="text-gray-900 dark:text-white">${partner.metrics.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Satisfaction:</span>
                <span className="text-gray-900 dark:text-white">{partner.metrics.satisfaction}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Health:</span>
                <span className="text-gray-900 dark:text-white">{partner.metrics.integrationHealth}%</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Workflows Tab Component
interface WorkflowsTabProps {
  templates: WorkflowTemplate[];
}

const WorkflowsTab: React.FC<WorkflowsTabProps> = ({ templates }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Workflow Templates</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{template.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{template.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  template.complexity === 'simple' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  template.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {template.complexity}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {template.description}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Usage:</span>
                <span className="text-gray-900 dark:text-white">{template.metrics.usage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                <span className="text-gray-900 dark:text-white">{template.metrics.rating}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                <span className="text-gray-900 dark:text-white">{template.metrics.successRate}%</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Use Template</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Eye className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Analytics Tab Component
interface AnalyticsTabProps {
  analytics: any;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketplace Analytics</h3>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Plugins</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.plugins?.total || 0}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">API Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.apis?.totalRequests?.toLocaleString() || 0}</p>
            </div>
            <Code className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Partner Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${analytics.partners?.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Workflow Usage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.workflows?.totalUsage || 0}</p>
            </div>
            <Workflow className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Category Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Plugin Categories</h4>
          <div className="space-y-3">
            {Object.entries(analytics.plugins?.categories || {}).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{category}</span>
                <span className="font-medium text-gray-900 dark:text-white">{count as number}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Partner Tiers</h4>
          <div className="space-y-3">
            {Object.entries(analytics.partners?.tiers || {}).map(([tier, count]) => (
              <div key={tier} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{tier}</span>
                <span className="font-medium text-gray-900 dark:text-white">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseMarketplaceDashboard; 