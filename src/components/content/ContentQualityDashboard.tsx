import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Link, 
  FileText, 
  Eye, 
  Download,
  RefreshCw,
  Settings
} from 'lucide-react';
import { contentQualityService } from '../../services/contentQualityService';
import { 
  ContentValidationResponse, 
  QualityMetrics, 
  LinkValidationResponse,
  ContentAnalytics 
} from '../../utils/apiClient';

interface ContentQualityDashboardProps {
  contentId?: string;
  contentIds?: string[];
  className?: string;
}

interface DashboardState {
  validation: ContentValidationResponse | null;
  metrics: QualityMetrics[];
  linkValidation: LinkValidationResponse | null;
  analytics: ContentAnalytics | null;
  loading: boolean;
  error: string | null;
  lastRefresh: Date | null;
}

export const ContentQualityDashboard: React.FC<ContentQualityDashboardProps> = ({
  contentId,
  contentIds = [],
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'validation' | 'links' | 'analytics'>('overview');
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('7d');
  const [state, setState] = useState<DashboardState>({
    validation: null,
    metrics: [],
    linkValidation: null,
    analytics: null,
    loading: false,
    error: null,
    lastRefresh: null
  });

  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (contentId || contentIds.length > 0) {
      loadDashboardData();
    }
  }, [contentId, contentIds, period]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadDashboardData, 5 * 60 * 1000); // 5 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadDashboardData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const promises: Promise<any>[] = [];

      // Load quality metrics
      if (contentId) {
        promises.push(contentQualityService.getContentQualityMetrics(contentId, period));
        promises.push(contentQualityService.getContentAnalytics(contentId, period));
      }

      const results = await Promise.allSettled(promises);
      
      setState(prev => ({
        ...prev,
        metrics: results[0]?.status === 'fulfilled' ? results[0].value : [],
        analytics: results[1]?.status === 'fulfilled' ? results[1].value : null,
        loading: false,
        lastRefresh: new Date()
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load dashboard data',
        loading: false
      }));
    }
  };

  const validateContent = async (content: string, contentType: 'markdown' | 'html' | 'text' = 'markdown') => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const validation = await contentQualityService.validateDocumentationContent(content, contentType, {
        useCache: true
      });
      
      setState(prev => ({ ...prev, validation, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Content validation failed',
        loading: false
      }));
    }
  };

  const validateLinks = async (urls: string[]) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const linkValidation = await contentQualityService.validateDocumentationLinks(urls, {
        useCache: true,
        timeout: 10000
      });
      
      setState(prev => ({ ...prev, linkValidation, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Link validation failed',
        loading: false
      }));
    }
  };

  const generateReport = async () => {
    if (!contentId && contentIds.length === 0) return;

    try {
      const report = await contentQualityService.generateContentReport({
        contentIds: contentId ? [contentId] : contentIds,
        period,
        metrics: ['readability', 'seo', 'accessibility', 'performance', 'engagement'],
        format: 'pdf'
      });

      if (report.downloadUrl) {
        window.open(report.downloadUrl, '_blank');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to generate report'
      }));
    }
  };

  const getOverallScore = (): number => {
    if (!state.metrics.length) return 0;
    
    const latest = state.metrics[0];
    const scores = [
      latest.metrics.readability,
      latest.metrics.seo,
      latest.metrics.accessibility,
      latest.metrics.performance,
      latest.metrics.engagement
    ];
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const renderOverviewTab = () => {
    const overallScore = getOverallScore();
    const latest = state.metrics[0];

    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overall Quality Score</h3>
            <div className="flex items-center space-x-2">
              {getScoreIcon(overallScore)}
              <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </span>
            </div>
          </div>
          
          {latest && (
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Readability</div>
                <div className={`text-lg font-semibold ${getScoreColor(latest.metrics.readability)}`}>
                  {latest.metrics.readability}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">SEO</div>
                <div className={`text-lg font-semibold ${getScoreColor(latest.metrics.seo)}`}>
                  {latest.metrics.seo}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Accessibility</div>
                <div className={`text-lg font-semibold ${getScoreColor(latest.metrics.accessibility)}`}>
                  {latest.metrics.accessibility}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Performance</div>
                <div className={`text-lg font-semibold ${getScoreColor(latest.metrics.performance)}`}>
                  {latest.metrics.performance}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Engagement</div>
                <div className={`text-lg font-semibold ${getScoreColor(latest.metrics.engagement)}`}>
                  {latest.metrics.engagement}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Content Views</p>
                <p className="text-2xl font-bold">{state.analytics?.views || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Link Status</p>
                <p className="text-2xl font-bold">
                  {state.linkValidation ? 
                    `${state.linkValidation.summary.valid}/${state.linkValidation.summary.total}` : 
                    'N/A'
                  }
                </p>
              </div>
              <Link className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quality Trend</p>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold">
                    {latest?.trends.direction === 'up' ? '+' : latest?.trends.direction === 'down' ? '-' : ''}
                    {latest?.trends.change || 0}%
                  </span>
                  {latest?.trends.direction === 'up' && <TrendingUp className="h-5 w-5 text-green-600" />}
                  {latest?.trends.direction === 'down' && <TrendingDown className="h-5 w-5 text-red-600" />}
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderValidationTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Content Validation</h3>
          
          {state.validation ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Validation Status</span>
                <div className="flex items-center space-x-2">
                  {state.validation.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={state.validation.isValid ? 'text-green-600' : 'text-red-600'}>
                    {state.validation.isValid ? 'Valid' : 'Issues Found'}
                  </span>
                </div>
              </div>
              
              {state.validation.issues.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Issues</h4>
                  <div className="space-y-2">
                    {state.validation.issues.map((issue, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">{issue.message}</div>
                          {issue.line && (
                            <div className="text-xs text-gray-600">Line {issue.line}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {state.validation.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Suggestions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {state.validation.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No validation data available</p>
              <p className="text-sm">Upload content to see validation results</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLinksTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Link Validation</h3>
          
          {state.linkValidation ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{state.linkValidation.summary.total}</div>
                  <div className="text-sm text-gray-600">Total Links</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{state.linkValidation.summary.valid}</div>
                  <div className="text-sm text-gray-600">Valid</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{state.linkValidation.summary.invalid}</div>
                  <div className="text-sm text-gray-600">Invalid</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{state.linkValidation.summary.warnings}</div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {state.linkValidation.results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      {result.status === 'valid' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {result.status === 'invalid' && <XCircle className="h-4 w-4 text-red-600" />}
                      {result.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      {result.status === 'pending' && <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />}
                      <span className="text-sm font-mono">{result.url}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {result.statusCode && `${result.statusCode} • `}
                      {result.responseTime && `${result.responseTime}ms`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No link validation data available</p>
              <p className="text-sm">Validate links to see results</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAnalyticsTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Content Analytics</h3>
          
          {state.analytics ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{state.analytics.views}</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{state.analytics.uniqueViews}</div>
                <div className="text-sm text-gray-600">Unique Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(state.analytics.timeOnPage)}s</div>
                <div className="text-sm text-gray-600">Avg. Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(state.analytics.bounceRate * 100)}%</div>
                <div className="text-sm text-gray-600">Bounce Rate</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No analytics data available</p>
              <p className="text-sm">Analytics will appear once content is tracked</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Quality Dashboard</h2>
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as '24h' | '7d' | '30d')}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg text-sm ${
              autoRefresh ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Auto Refresh
          </button>
          
          <button
            onClick={loadDashboardData}
            disabled={state.loading}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${state.loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={generateReport}
            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{state.error}</span>
          </div>
        </div>
      )}

      {/* Last Refresh */}
      {state.lastRefresh && (
        <div className="text-sm text-gray-600">
          Last updated: {state.lastRefresh.toLocaleTimeString()}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'validation', label: 'Validation', icon: CheckCircle },
            { id: 'links', label: 'Links', icon: Link },
            { id: 'analytics', label: 'Analytics', icon: Eye }
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
      <div className="min-h-[400px]">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'validation' && renderValidationTab()}
        {activeTab === 'links' && renderLinksTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default ContentQualityDashboard; 