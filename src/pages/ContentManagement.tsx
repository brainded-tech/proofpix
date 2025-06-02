import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  BarChart3, 
  Link, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Download,
  Plus,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import ContentQualityDashboard from '../components/content/ContentQualityDashboard';
import { contentQualityService } from '../services/contentQualityService';
import { useTestAuth } from '../components/auth/TestAuthProvider';

// Simple subscription hook - replace with actual implementation
const useSubscription = () => {
  const tier = localStorage.getItem('proofpix_user_tier') || 'free';
  return {
    subscription: null,
    tier: tier as 'free' | 'pro' | 'enterprise'
  };
};

interface ContentItem {
  id: string;
  title: string;
  type: 'markdown' | 'html' | 'text';
  status: 'draft' | 'published' | 'archived';
  qualityScore: number;
  lastValidated: Date;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  tags: string[];
}

export const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useTestAuth();
  const { subscription, tier } = useSubscription();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'validation' | 'analytics'>('dashboard');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [loading, setLoading] = useState(false);

  // Check authentication and tier access
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (tier === 'free') {
      navigate('/billing?upgrade=pro');
      return;
    }
  }, [isAuthenticated, tier, navigate]);

  useEffect(() => {
    loadContentItems();
  }, []);

  const loadContentItems = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockContent: ContentItem[] = [
        {
          id: 'content-1',
          title: 'Getting Started Guide',
          type: 'markdown',
          status: 'published',
          qualityScore: 92,
          lastValidated: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          author: 'Content Team',
          tags: ['guide', 'onboarding', 'beginner']
        },
        {
          id: 'content-2',
          title: 'API Documentation',
          type: 'markdown',
          status: 'published',
          qualityScore: 88,
          lastValidated: new Date(Date.now() - 4 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          author: 'Engineering Team',
          tags: ['api', 'technical', 'reference']
        },
        {
          id: 'content-3',
          title: 'Security Best Practices',
          type: 'markdown',
          status: 'draft',
          qualityScore: 76,
          lastValidated: new Date(Date.now() - 6 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          author: 'Security Team',
          tags: ['security', 'compliance', 'enterprise']
        }
      ];
      
      setContentItems(mockContent);
    } catch (error) {
      console.error('Failed to load content items:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateAllContent = async () => {
    setLoading(true);
    try {
      for (const item of contentItems) {
        await contentQualityService.validateDocumentationContent(
          `# ${item.title}\n\nContent for ${item.title}`,
          item.type,
          { useCache: false }
        );
      }
      await loadContentItems();
    } catch (error) {
      console.error('Failed to validate content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getQualityColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-50';
      case 'draft': return 'text-yellow-600 bg-yellow-50';
      case 'archived': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderDashboardTab = () => (
    <div className="space-y-6">
      <ContentQualityDashboard 
        contentIds={contentItems.map(item => item.id)}
        className="bg-white rounded-lg border p-6"
      />
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Content Management Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={validateAllContent}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Validate All</span>
          </button>
          
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Content</span>
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Validated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.type}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityColor(item.qualityScore)}`}>
                        {item.qualityScore}%
                      </span>
                      {item.qualityScore >= 90 && <CheckCircle className="h-4 w-4 text-green-600 ml-2" />}
                      {item.qualityScore < 70 && <AlertTriangle className="h-4 w-4 text-red-600 ml-2" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lastValidated.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedContent(item.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Edit
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        Validate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderValidationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Content Validation Center</h3>
        <p className="text-gray-600 mb-6">
          Validate your documentation content for quality, accessibility, and SEO optimization.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Content Quality</h4>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Check readability, structure, and content quality metrics.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Run Quality Check
            </button>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Link Validation</h4>
              <Link className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Verify all links are working and accessible.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Validate Links
            </button>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">SEO Analysis</h4>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Analyze content for search engine optimization.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Analyze SEO
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Content Analytics</h3>
        <p className="text-gray-600 mb-6">
          Track content performance, user engagement, and quality trends.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1,247</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">89%</div>
            <div className="text-sm text-gray-600">Avg. Quality Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">156</div>
            <div className="text-sm text-gray-600">Links Validated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-gray-600">Issues Found</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated || tier === 'free') {
    return null; // Will redirect in useEffect
  }

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-2">
              Manage, validate, and analyze your documentation content with enterprise-grade tools.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'validation', label: 'Validation', icon: CheckCircle },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'validation' && renderValidationTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default ContentManagement; 