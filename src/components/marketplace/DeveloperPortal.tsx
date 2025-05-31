import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code,
  Download,
  Key,
  Book,
  Users,
  Star,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Settings,
  Terminal,
  FileText,
  Globe,
  Shield,
  Zap,
  Database,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useEnterpriseMarketplace } from '../../hooks/useEnterpriseMarketplace';

interface DeveloperPortalProps {
  className?: string;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  tier: 'free' | 'pro' | 'enterprise';
  created: Date;
  lastUsed?: Date;
  requests: {
    total: number;
    thisMonth: number;
    limit: number;
  };
  status: 'active' | 'suspended' | 'revoked';
}

interface SDK {
  language: string;
  version: string;
  downloadUrl: string;
  documentation: string;
  examples: string[];
  icon: React.ReactNode;
  popularity: number;
  lastUpdated: Date;
  size: string;
}

export const DeveloperPortal: React.FC<DeveloperPortalProps> = ({
  className = ''
}) => {
  const navigate = useNavigate();
  const { apiEndpoints, generateAPIKey, loading } = useEnterpriseMarketplace();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'api-keys' | 'sdks' | 'docs' | 'examples'>('overview');
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedTier, setSelectedTier] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Mock data for demonstration - will be replaced by backend API calls
  const sdks: SDK[] = [
    {
      language: 'JavaScript/Node.js',
      version: '2.1.0',
      downloadUrl: '/downloads/proofpix-js-sdk-2.1.0.tar.gz',
      documentation: '/docs/sdks/javascript',
      examples: ['Basic Usage', 'Batch Processing', 'Webhook Integration'],
      icon: <Code className="h-6 w-6 text-yellow-500" />,
      popularity: 95,
      lastUpdated: new Date('2024-01-15'),
      size: '2.3 MB'
    },
    {
      language: 'Python',
      version: '2.0.8',
      downloadUrl: '/downloads/proofpix-python-sdk-2.0.8.tar.gz',
      documentation: '/docs/sdks/python',
      examples: ['Quick Start', 'Django Integration', 'FastAPI Example'],
      icon: <Code className="h-6 w-6 text-blue-500" />,
      popularity: 88,
      lastUpdated: new Date('2024-01-12'),
      size: '1.8 MB'
    },
    {
      language: 'PHP',
      version: '1.9.2',
      downloadUrl: '/downloads/proofpix-php-sdk-1.9.2.tar.gz',
      documentation: '/docs/sdks/php',
      examples: ['Laravel Integration', 'WordPress Plugin', 'Symfony Bundle'],
      icon: <Code className="h-6 w-6 text-purple-500" />,
      popularity: 72,
      lastUpdated: new Date('2024-01-10'),
      size: '1.5 MB'
    },
    {
      language: '.NET',
      version: '1.8.0',
      downloadUrl: '/downloads/proofpix-dotnet-sdk-1.8.0.nupkg',
      documentation: '/docs/sdks/dotnet',
      examples: ['ASP.NET Core', 'Blazor App', 'Console Application'],
      icon: <Code className="h-6 w-6 text-indigo-500" />,
      popularity: 65,
      lastUpdated: new Date('2024-01-08'),
      size: '2.1 MB'
    }
  ];

  const handleCreateAPIKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      const result = await generateAPIKey('developer-portal', selectedTier);
      
      const newKey: APIKey = {
        id: `key_${Date.now()}`,
        name: newKeyName,
        key: result.apiKey,
        tier: selectedTier,
        created: new Date(),
        requests: {
          total: 0,
          thisMonth: 0,
          limit: result.limits.monthly || 1000
        },
        status: 'active'
      };

      setApiKeys(prev => [...prev, newKey]);
      setShowCreateKeyModal(false);
      setNewKeyName('');
      setSelectedTier('free');
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadSDK = (sdk: SDK) => {
    // In production, this would trigger the actual download
    console.log(`Downloading ${sdk.language} SDK v${sdk.version}`);
    window.open(sdk.downloadUrl, '_blank');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity className="h-4 w-4" /> },
    { id: 'api-keys', label: 'API Keys', icon: <Key className="h-4 w-4" /> },
    { id: 'sdks', label: 'SDKs', icon: <Download className="h-4 w-4" /> },
    { id: 'docs', label: 'Documentation', icon: <Book className="h-4 w-4" /> },
    { id: 'examples', label: 'Examples', icon: <Code className="h-4 w-4" /> }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Developer Portal</h1>
                <p className="text-sm text-slate-600">Build with ProofPix APIs</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/docs/api')}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>API Docs</span>
              </button>
              <button
                onClick={() => setShowCreateKeyModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create API Key
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
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'api-keys' && (
          <APIKeysTab 
            apiKeys={apiKeys}
            onCopyKey={handleCopyKey}
            copiedKey={copiedKey}
            onCreateKey={() => setShowCreateKeyModal(true)}
          />
        )}
        {activeTab === 'sdks' && (
          <SDKsTab 
            sdks={sdks}
            onDownload={handleDownloadSDK}
          />
        )}
        {activeTab === 'docs' && <DocumentationTab />}
        {activeTab === 'examples' && <ExamplesTab />}
      </div>

      {/* Create API Key Modal */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production App, Development"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tier
                </label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="free">Free (1,000 requests/month)</option>
                  <option value="pro">Pro (10,000 requests/month)</option>
                  <option value="enterprise">Enterprise (Unlimited)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateKeyModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAPIKey}
                disabled={!newKeyName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC = () => {
  const stats = [
    { label: 'API Endpoints', value: '12', icon: <Database className="h-5 w-5 text-blue-500" /> },
    { label: 'SDKs Available', value: '4', icon: <Code className="h-5 w-5 text-green-500" /> },
    { label: 'Developers', value: '1,247', icon: <Users className="h-5 w-5 text-purple-500" /> },
    { label: 'API Calls/Month', value: '2.3M', icon: <TrendingUp className="h-5 w-5 text-orange-500" /> }
  ];

  const quickLinks = [
    { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes', icon: <Zap className="h-5 w-5" />, href: '/docs/quick-start' },
    { title: 'API Reference', description: 'Complete API documentation', icon: <Book className="h-5 w-5" />, href: '/docs/api' },
    { title: 'Code Examples', description: 'Ready-to-use code snippets', icon: <Code className="h-5 w-5" />, href: '/docs/examples' },
    { title: 'Community Forum', description: 'Get help from other developers', icon: <Users className="h-5 w-5" />, href: '/community' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to ProofPix Developer Portal</h2>
        <p className="text-blue-100 mb-6">
          Build powerful applications with our metadata extraction and document processing APIs. 
          Get started with our comprehensive SDKs and documentation.
        </p>
        <div className="flex space-x-4">
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Get Started
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
            View Examples
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  {link.icon}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{link.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{link.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// API Keys Tab Component
interface APIKeysTabProps {
  apiKeys: APIKey[];
  onCopyKey: (key: string) => void;
  copiedKey: string | null;
  onCreateKey: () => void;
}

const APIKeysTab: React.FC<APIKeysTabProps> = ({ apiKeys, onCopyKey, copiedKey, onCreateKey }) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">API Keys</h2>
          <p className="text-slate-600">Manage your API keys and monitor usage</p>
        </div>
        <button
          onClick={onCreateKey}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create New Key
        </button>
      </div>

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No API Keys</h3>
          <p className="text-slate-600 mb-4">Create your first API key to start building with ProofPix</p>
          <button
            onClick={onCreateKey}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create API Key
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-slate-900">{apiKey.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(apiKey.tier)}`}>
                    {apiKey.tier.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apiKey.status)}`}>
                    {apiKey.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onCopyKey(apiKey.key)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {copiedKey === apiKey.key ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <code className="text-sm font-mono text-slate-700">
                  {apiKey.key.substring(0, 20)}...{apiKey.key.substring(apiKey.key.length - 8)}
                </code>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Created</p>
                  <p className="font-medium text-slate-900">{apiKey.created.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-600">This Month</p>
                  <p className="font-medium text-slate-900">
                    {apiKey.requests.thisMonth.toLocaleString()} / {apiKey.requests.limit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Last Used</p>
                  <p className="font-medium text-slate-900">
                    {apiKey.lastUsed ? apiKey.lastUsed.toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// SDKs Tab Component
interface SDKsTabProps {
  sdks: SDK[];
  onDownload: (sdk: SDK) => void;
}

const SDKsTab: React.FC<SDKsTabProps> = ({ sdks, onDownload }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Software Development Kits</h2>
        <p className="text-slate-600">Official SDKs for popular programming languages</p>
      </div>

      {/* SDKs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sdks.map((sdk, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {sdk.icon}
                <div>
                  <h3 className="font-medium text-slate-900">{sdk.language}</h3>
                  <p className="text-sm text-slate-600">v{sdk.version}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-slate-600">{sdk.popularity}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Size:</span>
                <span className="text-slate-900">{sdk.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Updated:</span>
                <span className="text-slate-900">{sdk.lastUpdated.toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Examples:</p>
              <div className="flex flex-wrap gap-1">
                {sdk.examples.map((example, exampleIndex) => (
                  <span
                    key={exampleIndex}
                    className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onDownload(sdk)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                <Book className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Documentation Tab Component
const DocumentationTab: React.FC = () => {
  const docSections = [
    {
      title: 'Getting Started',
      description: 'Quick start guide and basic concepts',
      icon: <Zap className="h-5 w-5 text-green-500" />,
      links: [
        { title: 'Quick Start Guide', href: '/docs/quick-start' },
        { title: 'Authentication', href: '/docs/auth' },
        { title: 'Rate Limiting', href: '/docs/rate-limits' }
      ]
    },
    {
      title: 'API Reference',
      description: 'Complete API documentation',
      icon: <Book className="h-5 w-5 text-blue-500" />,
      links: [
        { title: 'Metadata Extraction', href: '/docs/api/metadata' },
        { title: 'Batch Processing', href: '/docs/api/batch' },
        { title: 'Webhooks', href: '/docs/api/webhooks' }
      ]
    },
    {
      title: 'SDKs & Libraries',
      description: 'Language-specific documentation',
      icon: <Code className="h-5 w-5 text-purple-500" />,
      links: [
        { title: 'JavaScript SDK', href: '/docs/sdks/javascript' },
        { title: 'Python SDK', href: '/docs/sdks/python' },
        { title: 'PHP SDK', href: '/docs/sdks/php' }
      ]
    },
    {
      title: 'Security',
      description: 'Security best practices and compliance',
      icon: <Shield className="h-5 w-5 text-red-500" />,
      links: [
        { title: 'Security Overview', href: '/docs/security' },
        { title: 'API Security', href: '/docs/security/api' },
        { title: 'Compliance', href: '/docs/security/compliance' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Documentation</h2>
        <p className="text-slate-600">Comprehensive guides and API reference</p>
      </div>

      {/* Documentation Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docSections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              {section.icon}
              <div>
                <h3 className="font-medium text-slate-900">{section.title}</h3>
                <p className="text-sm text-slate-600">{section.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {section.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.href}
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Popular Docs */}
      <div className="bg-slate-50 rounded-lg p-6">
        <h3 className="font-medium text-slate-900 mb-4">Popular Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/docs/quick-start" className="flex items-center space-x-2 text-sm text-slate-700 hover:text-slate-900">
            <TrendingUp className="h-4 w-4" />
            <span>Quick Start Guide</span>
          </a>
          <a href="/docs/api/metadata" className="flex items-center space-x-2 text-sm text-slate-700 hover:text-slate-900">
            <TrendingUp className="h-4 w-4" />
            <span>Metadata API</span>
          </a>
          <a href="/docs/sdks/javascript" className="flex items-center space-x-2 text-sm text-slate-700 hover:text-slate-900">
            <TrendingUp className="h-4 w-4" />
            <span>JavaScript SDK</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// Examples Tab Component
const ExamplesTab: React.FC = () => {
  const examples = [
    {
      title: 'Basic Metadata Extraction',
      description: 'Extract metadata from a single image',
      language: 'JavaScript',
      code: `const proofpix = require('@proofpix/sdk');

const client = new proofpix.Client({
  apiKey: 'your_api_key'
});

async function extractMetadata() {
  try {
    const result = await client.extract({
      file: 'path/to/image.jpg',
      includeGPS: true,
      includeTechnical: true
    });
    
    console.log('Metadata:', result.metadata);
    console.log('GPS:', result.gps);
  } catch (error) {
    console.error('Error:', error);
  }
}`
    },
    {
      title: 'Batch Processing',
      description: 'Process multiple images in a single request',
      language: 'Python',
      code: `import proofpix

client = proofpix.Client(api_key='your_api_key')

def process_batch():
    files = [
        'image1.jpg',
        'image2.png',
        'image3.tiff'
    ]
    
    results = client.batch_extract(
        files=files,
        options={
            'include_gps': True,
            'include_technical': True,
            'format': 'json'
        }
    )
    
    for result in results:
        print(f"File: {result.filename}")
        print(f"Status: {result.status}")
        if result.metadata:
            print(f"Camera: {result.metadata.camera}")
            print(f"GPS: {result.metadata.gps}")
        print("---")`
    },
    {
      title: 'Webhook Integration',
      description: 'Handle webhook events for async processing',
      language: 'PHP',
      code: `<?php
require_once 'vendor/autoload.php';

use ProofPix\\Client;
use ProofPix\\Webhook;

$client = new Client(['api_key' => 'your_api_key']);

// Configure webhook
$webhook = $client->webhooks()->create([
    'url' => 'https://your-app.com/webhooks/proofpix',
    'events' => ['batch.completed', 'file.processed'],
    'secret' => 'your_webhook_secret'
]);

// Handle webhook in your endpoint
function handleWebhook($payload, $signature) {
    $webhook = new Webhook('your_webhook_secret');
    
    if ($webhook->verify($payload, $signature)) {
        $event = json_decode($payload, true);
        
        switch ($event['type']) {
            case 'batch.completed':
                processBatchCompleted($event['data']);
                break;
            case 'file.processed':
                processFileCompleted($event['data']);
                break;
        }
    }
}
?>`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Code Examples</h2>
        <p className="text-slate-600">Ready-to-use code snippets and integration examples</p>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        {examples.map((example, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">{example.title}</h3>
                  <p className="text-sm text-slate-600">{example.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                    {example.language}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 p-6">
              <pre className="text-sm text-green-400 overflow-x-auto">
                <code>{example.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* More Examples */}
      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <h3 className="font-medium text-slate-900 mb-2">Need More Examples?</h3>
        <p className="text-slate-600 mb-4">
          Check out our GitHub repository for more comprehensive examples and sample applications.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          View on GitHub
        </button>
      </div>
    </div>
  );
}; 