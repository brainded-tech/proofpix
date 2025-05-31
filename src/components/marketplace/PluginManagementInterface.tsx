import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Settings,
  Play,
  Pause,
  Trash2,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  Database,
  Code,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Copy
} from 'lucide-react';
import { useEnterpriseMarketplace } from '../../hooks/useEnterpriseMarketplace';

interface PluginManagementInterfaceProps {
  className?: string;
}

interface InstalledPlugin {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'error' | 'updating';
  category: string;
  developer: string;
  installedDate: Date;
  lastUpdated: Date;
  config: Record<string, any>;
  permissions: string[];
  dependencies: string[];
  usage: {
    calls: number;
    errors: number;
    lastUsed: Date;
  };
  updateAvailable?: string;
}

export const PluginManagementInterface: React.FC<PluginManagementInterfaceProps> = ({
  className = ''
}) => {
  const navigate = useNavigate();
  const { installedPlugins, loading } = useEnterpriseMarketplace();
  
  const [activeTab, setActiveTab] = useState<'installed' | 'available' | 'updates'>('installed');
  const [selectedPlugin, setSelectedPlugin] = useState<InstalledPlugin | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock data for demonstration - will be replaced by backend API calls
  const mockInstalledPlugins: InstalledPlugin[] = [
    {
      id: 'metadata-enhancer',
      name: 'Advanced Metadata Enhancer',
      version: '2.1.0',
      status: 'active',
      category: 'processing',
      developer: 'ProofPix Labs',
      installedDate: new Date('2024-01-10'),
      lastUpdated: new Date('2024-01-15'),
      config: {
        enableGPSEnhancement: true,
        includeWeatherData: false,
        apiKey: 'pk_live_***'
      },
      permissions: ['read:metadata', 'write:metadata', 'network:external'],
      dependencies: ['core-api@^2.0.0'],
      usage: {
        calls: 15420,
        errors: 3,
        lastUsed: new Date('2024-01-16')
      },
      updateAvailable: '2.2.0'
    },
    {
      id: 'batch-processor',
      name: 'Batch Processing Engine',
      version: '1.8.5',
      status: 'active',
      category: 'workflow',
      developer: 'Workflow Solutions',
      installedDate: new Date('2024-01-05'),
      lastUpdated: new Date('2024-01-12'),
      config: {
        maxBatchSize: 100,
        parallelProcessing: true,
        retryAttempts: 3
      },
      permissions: ['read:files', 'write:files', 'system:resources'],
      dependencies: ['core-api@^2.0.0', 'file-handler@^1.5.0'],
      usage: {
        calls: 8750,
        errors: 12,
        lastUsed: new Date('2024-01-16')
      }
    },
    {
      id: 'security-scanner',
      name: 'Security Vulnerability Scanner',
      version: '3.0.2',
      status: 'error',
      category: 'security',
      developer: 'SecureCode Inc',
      installedDate: new Date('2023-12-20'),
      lastUpdated: new Date('2024-01-08'),
      config: {
        scanDepth: 'deep',
        alertThreshold: 'medium',
        autoQuarantine: false
      },
      permissions: ['read:files', 'read:metadata', 'network:security'],
      dependencies: ['security-core@^1.2.0'],
      usage: {
        calls: 2340,
        errors: 45,
        lastUsed: new Date('2024-01-14')
      },
      updateAvailable: '3.1.0'
    }
  ];

  const [plugins, setPlugins] = useState<InstalledPlugin[]>(mockInstalledPlugins);

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.developer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plugin.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || plugin.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handlePluginAction = async (pluginId: string, action: 'start' | 'stop' | 'restart' | 'uninstall' | 'update') => {
    setPlugins(prev => prev.map(plugin => {
      if (plugin.id === pluginId) {
        switch (action) {
          case 'start':
            return { ...plugin, status: 'active' as const };
          case 'stop':
            return { ...plugin, status: 'inactive' as const };
          case 'restart':
            return { ...plugin, status: 'updating' as const };
          case 'update':
            return { ...plugin, status: 'updating' as const };
          case 'uninstall':
            return plugin; // Will be removed from array
          default:
            return plugin;
        }
      }
      return plugin;
    }));

    // Simulate API call delay
    if (action === 'restart' || action === 'update') {
      setTimeout(() => {
        setPlugins(prev => prev.map(plugin => 
          plugin.id === pluginId ? { ...plugin, status: 'active' as const } : plugin
        ));
      }, 2000);
    }

    if (action === 'uninstall') {
      setTimeout(() => {
        setPlugins(prev => prev.filter(plugin => plugin.id !== pluginId));
      }, 1000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <Pause className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'updating':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'updating':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'processing':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'workflow':
        return <Settings className="h-4 w-4 text-blue-500" />;
      case 'security':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'analytics':
        return <Database className="h-4 w-4 text-purple-500" />;
      case 'integration':
        return <Code className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const tabs = [
    { id: 'installed', label: 'Installed Plugins', count: plugins.length },
    { id: 'available', label: 'Available Plugins', count: 0 },
    { id: 'updates', label: 'Updates', count: plugins.filter(p => p.updateAvailable).length }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Plugin Management</h1>
                <p className="text-sm text-slate-600">Manage your installed plugins and extensions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/marketplace')}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Browse Marketplace</span>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                Install Plugin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg p-4 border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search plugins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
                <option value="updating">Updating</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Categories</option>
                <option value="processing">Processing</option>
                <option value="workflow">Workflow</option>
                <option value="security">Security</option>
                <option value="analytics">Analytics</option>
                <option value="integration">Integration</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Plugin List */}
        {activeTab === 'installed' && (
          <div className="space-y-4">
            {filteredPlugins.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Plugins Found</h3>
                <p className="text-slate-600 mb-4">
                  {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? 'No plugins match your current filters.'
                    : 'You haven\'t installed any plugins yet.'
                  }
                </p>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              filteredPlugins.map((plugin) => (
                <PluginCard
                  key={plugin.id}
                  plugin={plugin}
                  onAction={handlePluginAction}
                  onConfigure={() => {
                    setSelectedPlugin(plugin);
                    setShowConfigModal(true);
                  }}
                  onViewDetails={() => setSelectedPlugin(plugin)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'available' && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Browse Available Plugins</h3>
            <p className="text-slate-600 mb-4">
              Discover new plugins to extend your ProofPix functionality.
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go to Marketplace
            </button>
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-4">
            {plugins.filter(p => p.updateAvailable).length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">All Plugins Up to Date</h3>
                <p className="text-slate-600">
                  All your installed plugins are running the latest versions.
                </p>
              </div>
            ) : (
              plugins
                .filter(p => p.updateAvailable)
                .map((plugin) => (
                  <UpdateCard
                    key={plugin.id}
                    plugin={plugin}
                    onUpdate={() => handlePluginAction(plugin.id, 'update')}
                  />
                ))
            )}
          </div>
        )}
      </div>

      {/* Plugin Configuration Modal */}
      {showConfigModal && selectedPlugin && (
        <PluginConfigModal
          plugin={selectedPlugin}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedPlugin(null);
          }}
          onSave={(config) => {
            setPlugins(prev => prev.map(p => 
              p.id === selectedPlugin.id ? { ...p, config } : p
            ));
            setShowConfigModal(false);
            setSelectedPlugin(null);
          }}
        />
      )}
    </div>
  );
};

// Plugin Card Component
interface PluginCardProps {
  plugin: InstalledPlugin;
  onAction: (pluginId: string, action: 'start' | 'stop' | 'restart' | 'uninstall' | 'update') => void;
  onConfigure: () => void;
  onViewDetails: () => void;
}

const PluginCard: React.FC<PluginCardProps> = ({ plugin, onAction, onConfigure, onViewDetails }) => {
  const [showActions, setShowActions] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'processing':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'workflow':
        return <Settings className="h-4 w-4 text-blue-500" />;
      case 'security':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'analytics':
        return <Database className="h-4 w-4 text-purple-500" />;
      case 'integration':
        return <Code className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <Pause className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'updating':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'updating':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getCategoryIcon(plugin.category)}
          <div>
            <h3 className="font-medium text-slate-900">{plugin.name}</h3>
            <p className="text-sm text-slate-600">by {plugin.developer}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plugin.status)}`}>
            {plugin.status.toUpperCase()}
          </span>
          {plugin.updateAvailable && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
              Update Available
            </span>
          )}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                <div className="py-1">
                  {plugin.status === 'active' ? (
                    <button
                      onClick={() => {
                        onAction(plugin.id, 'stop');
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Pause className="h-4 w-4" />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onAction(plugin.id, 'start');
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      onAction(plugin.id, 'restart');
                      setShowActions(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Restart</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onConfigure();
                      setShowActions(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configure</span>
                  </button>
                  
                  {plugin.updateAvailable && (
                    <button
                      onClick={() => {
                        onAction(plugin.id, 'update');
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4" />
                      <span>Update</span>
                    </button>
                  )}
                  
                  <hr className="my-1" />
                  
                  <button
                    onClick={() => {
                      onAction(plugin.id, 'uninstall');
                      setShowActions(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Uninstall</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-slate-600">Version</p>
          <p className="font-medium text-slate-900">{plugin.version}</p>
        </div>
        <div>
          <p className="text-slate-600">Installed</p>
          <p className="font-medium text-slate-900">{plugin.installedDate.toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-slate-600">API Calls</p>
          <p className="font-medium text-slate-900">{plugin.usage.calls.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-slate-600">Last Used</p>
          <p className="font-medium text-slate-900">{plugin.usage.lastUsed.toLocaleDateString()}</p>
        </div>
      </div>
      
      {plugin.status === 'error' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">
              Plugin encountered {plugin.usage.errors} errors. Check configuration or restart.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Update Card Component
interface UpdateCardProps {
  plugin: InstalledPlugin;
  onUpdate: () => void;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ plugin, onUpdate }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Download className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">{plugin.name}</h3>
            <p className="text-sm text-slate-600">
              Update available: {plugin.version} → {plugin.updateAvailable}
            </p>
          </div>
        </div>
        
        <button
          onClick={onUpdate}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Update Now
        </button>
      </div>
    </div>
  );
};

// Plugin Configuration Modal
interface PluginConfigModalProps {
  plugin: InstalledPlugin;
  onClose: () => void;
  onSave: (config: Record<string, any>) => void;
}

const PluginConfigModal: React.FC<PluginConfigModalProps> = ({ plugin, onClose, onSave }) => {
  const [config, setConfig] = useState(plugin.config);

  const handleSave = () => {
    onSave(config);
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Configure {plugin.name}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Plugin Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Version</p>
                <p className="font-medium text-slate-900">{plugin.version}</p>
              </div>
              <div>
                <p className="text-slate-600">Developer</p>
                <p className="font-medium text-slate-900">{plugin.developer}</p>
              </div>
            </div>
          </div>
          
          {/* Configuration Fields */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Configuration</h4>
            
            {Object.entries(config).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                
                {typeof value === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleConfigChange(key, e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 rounded"
                  />
                ) : typeof value === 'number' ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleConfigChange(key, parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Permissions */}
          <div>
            <h4 className="font-medium text-slate-900 mb-2">Permissions</h4>
            <div className="space-y-2">
              {plugin.permissions.map((permission, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{permission}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}; 