import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Share2,
  Clock,
  Users,
  FileText,
  Image,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  Target,
  Zap
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'usage' | 'performance' | 'compliance' | 'financial' | 'custom';
  type: 'chart' | 'table' | 'dashboard' | 'summary';
  visualization: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'heatmap';
  dataSource: string[];
  filters: ReportFilter[];
  metrics: ReportMetric[];
  schedule?: ReportSchedule;
  createdBy: string;
  createdAt: string;
  lastRun?: string;
  isPublic: boolean;
  tags: string[];
}

interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
  label: string;
}

interface ReportMetric {
  field: string;
  aggregation: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct';
  label: string;
  format: 'number' | 'currency' | 'percentage' | 'duration';
}

interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
}

interface ReportData {
  id: string;
  templateId: string;
  data: any[];
  metadata: {
    totalRecords: number;
    generatedAt: string;
    executionTime: number;
    filters: ReportFilter[];
  };
  charts?: ChartData[];
}

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: any[];
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
}

interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'alert';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  data: any;
  createdAt: string;
  actionable: boolean;
}

export const AdvancedReportingEngine: React.FC = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'reports' | 'insights' | 'builder'>('templates');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Fetch reporting data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      const mockTemplates: ReportTemplate[] = [
        {
          id: 'tpl-001',
          name: 'Monthly Usage Report',
          description: 'Comprehensive monthly usage statistics and trends',
          category: 'usage',
          type: 'dashboard',
          visualization: 'bar',
          dataSource: ['files', 'users', 'processing_jobs'],
          filters: [
            { field: 'date', operator: 'between', value: [dateRange.start, dateRange.end], label: 'Date Range' }
          ],
          metrics: [
            { field: 'file_count', aggregation: 'count', label: 'Total Files', format: 'number' },
            { field: 'processing_time', aggregation: 'avg', label: 'Avg Processing Time', format: 'duration' },
            { field: 'storage_used', aggregation: 'sum', label: 'Storage Used', format: 'number' }
          ],
          schedule: {
            frequency: 'monthly',
            time: '09:00',
            recipients: ['admin@company.com'],
            format: 'pdf'
          },
          createdBy: 'user-001',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          lastRun: new Date(Date.now() - 86400000).toISOString(),
          isPublic: true,
          tags: ['usage', 'monthly', 'executive']
        },
        {
          id: 'tpl-002',
          name: 'Compliance Audit Report',
          description: 'Chain of custody and compliance tracking report',
          category: 'compliance',
          type: 'table',
          visualization: 'heatmap',
          dataSource: ['chain_of_custody', 'compliance_events'],
          filters: [
            { field: 'compliance_framework', operator: 'in', value: ['FRE', 'FRCP', 'HIPAA'], label: 'Frameworks' }
          ],
          metrics: [
            { field: 'compliance_score', aggregation: 'avg', label: 'Compliance Score', format: 'percentage' },
            { field: 'violations', aggregation: 'count', label: 'Violations', format: 'number' },
            { field: 'custody_events', aggregation: 'count', label: 'Custody Events', format: 'number' }
          ],
          createdBy: 'user-002',
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
          lastRun: new Date(Date.now() - 86400000 * 2).toISOString(),
          isPublic: false,
          tags: ['compliance', 'audit', 'legal']
        },
        {
          id: 'tpl-003',
          name: 'Performance Analytics',
          description: 'System performance and optimization insights',
          category: 'performance',
          type: 'chart',
          visualization: 'line',
          dataSource: ['processing_jobs', 'system_metrics'],
          filters: [],
          metrics: [
            { field: 'response_time', aggregation: 'avg', label: 'Response Time', format: 'duration' },
            { field: 'throughput', aggregation: 'sum', label: 'Throughput', format: 'number' },
            { field: 'error_rate', aggregation: 'avg', label: 'Error Rate', format: 'percentage' }
          ],
          createdBy: 'user-003',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          isPublic: true,
          tags: ['performance', 'optimization', 'technical']
        }
      ];

      const mockReports: ReportData[] = [
        {
          id: 'rpt-001',
          templateId: 'tpl-001',
          data: [
            { date: '2024-01-01', files: 1247, users: 45, processing_time: 2.3, storage: 15.7 },
            { date: '2024-01-02', files: 1356, users: 48, processing_time: 2.1, storage: 16.2 },
            { date: '2024-01-03', files: 1189, users: 42, processing_time: 2.5, storage: 15.9 }
          ],
          metadata: {
            totalRecords: 3,
            generatedAt: new Date().toISOString(),
            executionTime: 1.2,
            filters: [
              { field: 'date', operator: 'between', value: [dateRange.start, dateRange.end], label: 'Date Range' }
            ]
          },
          charts: [
            {
              type: 'bar',
              title: 'Daily File Uploads',
              data: [
                { date: '2024-01-01', value: 1247 },
                { date: '2024-01-02', value: 1356 },
                { date: '2024-01-03', value: 1189 }
              ],
              xAxis: 'date',
              yAxis: 'value',
              colors: ['#3B82F6']
            }
          ]
        }
      ];

      const mockInsights: AnalyticsInsight[] = [
        {
          id: 'ins-001',
          type: 'trend',
          title: 'Upload Volume Increasing',
          description: 'File uploads have increased by 23% over the past week, indicating growing user adoption.',
          impact: 'medium',
          confidence: 87,
          data: { trend: 'up', percentage: 23, period: '7 days' },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          actionable: true
        },
        {
          id: 'ins-002',
          type: 'anomaly',
          title: 'Processing Time Spike',
          description: 'Average processing time increased by 45% yesterday, possibly due to larger file sizes.',
          impact: 'high',
          confidence: 92,
          data: { metric: 'processing_time', increase: 45, date: '2024-01-02' },
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          actionable: true
        },
        {
          id: 'ins-003',
          type: 'recommendation',
          title: 'Optimize Storage Usage',
          description: 'Consider implementing automated archiving for files older than 90 days to reduce storage costs.',
          impact: 'medium',
          confidence: 78,
          data: { potential_savings: '$1,200/month', affected_files: 15000 },
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          actionable: true
        }
      ];

      setTemplates(mockTemplates);
      setReports(mockReports);
      setInsights(mockInsights);
      
      analytics.trackFeatureUsage('Advanced Reporting', 'Engine Viewed');
    } catch (error) {
      console.error('Failed to fetch reporting data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesFilter = filter === 'all' || template.category === filter;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getCategoryColor = (category: ReportTemplate['category']) => {
    switch (category) {
      case 'usage':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'performance':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'compliance':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'financial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'custom':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getImpactColor = (impact: AnalyticsInsight['impact']) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getInsightIcon = (type: AnalyticsInsight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'anomaly':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'recommendation':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <Zap className="h-4 w-4 text-orange-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const runReport = useCallback(async (templateId: string) => {
    try {
      // Simulate report generation
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      // Update last run time
      setTemplates(prev => prev.map(t => 
        t.id === templateId 
          ? { ...t, lastRun: new Date().toISOString() }
          : t
      ));

      analytics.trackFeatureUsage('Advanced Reporting', 'Report Generated');
    } catch (error) {
      console.error('Failed to run report:', error);
    }
  }, [templates]);

  const exportReport = useCallback(async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      // Simulate export
      analytics.trackFeatureUsage('Advanced Reporting', 'Report Exported', { format });
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading reporting engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Reporting</h1>
          <p className="text-gray-600 dark:text-gray-400">Create, schedule, and analyze comprehensive reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
            <span className="text-gray-500 dark:text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Report Templates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{templates.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {templates.filter(t => t.isPublic).length} public
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generated Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This month
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {templates.filter(t => t.schedule).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Auto-generated
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI Insights</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{insights.length}</p>
            </div>
            <Target className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {insights.filter(i => i.actionable).length} actionable
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 mr-2 inline" />
            Templates ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2 inline" />
            Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'insights'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Target className="h-4 w-4 mr-2 inline" />
            AI Insights ({insights.length})
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'builder'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Settings className="h-4 w-4 mr-2 inline" />
            Report Builder
          </button>
        </nav>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <>
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
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
                  <option value="all">All Categories</option>
                  <option value="usage">Usage</option>
                  <option value="performance">Performance</option>
                  <option value="compliance">Compliance</option>
                  <option value="financial">Financial</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredTemplates.length} of {templates.length} templates
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {template.description}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                      {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                    </span>
                  </div>

                  {/* Template Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      {template.visualization.charAt(0).toUpperCase() + template.visualization.slice(1)} Chart
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FileText className="h-4 w-4 mr-2" />
                      {template.metrics.length} metrics
                    </div>
                    {template.schedule && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        {template.schedule.frequency} at {template.schedule.time}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Last Run */}
                  {template.lastRun && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Last run: {new Date(template.lastRun).toLocaleDateString()}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => runReport(template.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Run Report
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        title="View Template"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                        title="Edit Template"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                        title="Share Template"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reports.map((report) => {
                  const template = templates.find(t => t.id === report.templateId);
                  return (
                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Report #{report.id.slice(-3)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Generated in {report.metadata.executionTime}s
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {template?.name || 'Unknown Template'}
                        </div>
                        {template && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {report.metadata.totalRecords.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{new Date(report.metadata.generatedAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(report.metadata.generatedAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                            title="View Report"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => exportReport(report.id, 'pdf')}
                            className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                            title="Export PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                            title="Share Report"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {insights.map((insight) => (
            <div key={insight.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {insight.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(insight.impact)}`}>
                        {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {insight.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {insight.confidence}% confidence
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(insight.createdAt).toLocaleDateString()}
                      </div>
                      {insight.actionable && (
                        <div className="flex items-center text-blue-600 dark:text-blue-400">
                          <Target className="h-4 w-4 mr-1" />
                          Actionable
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Data */}
              {insight.data && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Details</h4>
                  <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-auto">
                    {JSON.stringify(insight.data, null, 2)}
                  </pre>
                </div>
              )}

              {/* Actions */}
              {insight.actionable && (
                <div className="flex items-center space-x-3 mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Take Action
                  </button>
                  <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report Builder Tab */}
      {activeTab === 'builder' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Visual Report Builder
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Drag-and-drop interface for creating custom reports with advanced visualizations.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Launch Builder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 