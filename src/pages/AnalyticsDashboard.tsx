import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  FileImage,
  Clock,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  ArrowLeft,
  Zap,
  Database,
  Globe,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { errorHandler } from '../utils/errorHandler';
import { Sponsorship } from '../components/Sponsorships';
import { InteractiveCharts } from '../components/analytics/InteractiveCharts';

interface AnalyticsMetrics {
  totalFiles: number;
  filesProcessed: number;
  filesInQueue: number;
  processingErrors: number;
  averageProcessingTime: number;
  totalUsers: number;
  activeUsers: number;
  apiCalls: number;
  storageUsed: number;
  bandwidthUsed: number;
}

interface UsageData {
  date: string;
  files: number;
  users: number;
  apiCalls: number;
  processingTime: number;
  errors: number;
}

interface ProcessingStatus {
  id: string;
  fileName: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  fileSize: number;
  userId: string;
  errorMessage?: string;
}

interface AnalyticsDashboardState {
  metrics: AnalyticsMetrics | null;
  usageData: UsageData[];
  processingQueue: ProcessingStatus[];
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  timeRange: '1h' | '24h' | '7d' | '30d' | '90d';
  autoRefresh: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  subtitle,
  trend,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${color}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium flex items-center ${
            change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change)}%
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">vs last period</span>
        </div>
      )}
    </div>
  );
};

export const AnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<AnalyticsDashboardState>({
    metrics: null,
    usageData: [],
    processingQueue: [],
    isLoading: true,
    error: null,
    lastRefresh: null,
    timeRange: '24h',
    autoRefresh: true
  });

  // Check for Pro tier access - Analytics is Pro+ only
  const userTier = localStorage.getItem('proofpix_user_tier') || 'free';
  const hasProAccess = userTier === 'pro' || userTier === 'enterprise';

  const updateState = useCallback((updates: Partial<AnalyticsDashboardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Generate mock analytics data
  const generateMockMetrics = useCallback((): AnalyticsMetrics => {
    return {
      totalFiles: 15847,
      filesProcessed: 15623,
      filesInQueue: 12,
      processingErrors: 212,
      averageProcessingTime: 2.3,
      totalUsers: 1247,
      activeUsers: 89,
      apiCalls: 45623,
      storageUsed: 2.4, // GB
      bandwidthUsed: 156.7 // GB
    };
  }, []);

  const generateMockUsageData = useCallback((timeRange: string): UsageData[] => {
    const now = new Date();
    const data: UsageData[] = [];
    
    let days = 1;
    switch (timeRange) {
      case '1h': days = 1; break;
      case '24h': days = 1; break;
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        files: Math.floor(Math.random() * 500) + 100,
        users: Math.floor(Math.random() * 50) + 10,
        apiCalls: Math.floor(Math.random() * 2000) + 500,
        processingTime: Math.random() * 3 + 1,
        errors: Math.floor(Math.random() * 10)
      });
    }

    return data;
  }, []);

  const generateMockProcessingQueue = useCallback((): ProcessingStatus[] => {
    const statuses: Array<ProcessingStatus['status']> = ['queued', 'processing', 'completed', 'failed'];
    const queue: ProcessingStatus[] = [];

    for (let i = 0; i < 15; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const startTime = new Date(Date.now() - Math.random() * 3600000);
      
      queue.push({
        id: `proc-${i + 1}`,
        fileName: `image_${i + 1}.jpg`,
        status,
        progress: status === 'completed' ? 100 : status === 'failed' ? 0 : Math.floor(Math.random() * 100),
        startTime,
        endTime: status === 'completed' || status === 'failed' ? new Date(startTime.getTime() + Math.random() * 300000) : undefined,
        fileSize: Math.floor(Math.random() * 10000000) + 100000, // 100KB to 10MB
        userId: `user-${Math.floor(Math.random() * 100) + 1}`,
        errorMessage: status === 'failed' ? 'Invalid file format' : undefined
      });
    }

    return queue.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }, []);

  const loadAnalyticsData = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });

      // Simulate API calls (replace with actual API calls)
      const [metricsData, usageData, queueData] = await Promise.allSettled([
        Promise.resolve(generateMockMetrics()),
        Promise.resolve(generateMockUsageData(state.timeRange)),
        Promise.resolve(generateMockProcessingQueue())
      ]);

      updateState({
        metrics: metricsData.status === 'fulfilled' ? metricsData.value : null,
        usageData: usageData.status === 'fulfilled' ? usageData.value : [],
        processingQueue: queueData.status === 'fulfilled' ? queueData.value : [],
        isLoading: false,
        lastRefresh: new Date()
      });

    } catch (error) {
      console.error('Analytics data loading error:', error);
      await errorHandler.handleError('analytics_dashboard_load', error as Error);
      updateState({ 
        error: 'Failed to load analytics data', 
        isLoading: false 
      });
    }
  }, [state.timeRange, updateState, generateMockMetrics, generateMockUsageData, generateMockProcessingQueue]);

  const exportAnalyticsData = useCallback(async () => {
    try {
      const exportData = {
        generatedAt: new Date(),
        timeRange: state.timeRange,
        metrics: state.metrics,
        usageData: state.usageData,
        processingQueue: state.processingQueue
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report-${state.timeRange}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export error:', error);
      await errorHandler.handleError('analytics_export', error instanceof Error ? error : new Error(String(error)));
    }
  }, [state]);

  const formatFileSize = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const getStatusIcon = (status: ProcessingStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ProcessingStatus['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'queued':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  useEffect(() => {
    if (hasProAccess) {
      loadAnalyticsData();
    }
  }, [hasProAccess, loadAnalyticsData]);

  // Auto-refresh
  useEffect(() => {
    if (!state.autoRefresh || !hasProAccess) return;

    const interval = setInterval(() => {
      loadAnalyticsData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [state.autoRefresh, hasProAccess, loadAnalyticsData]);

  if (!hasProAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Advanced analytics and insights are available with Pro and Enterprise plans.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/pricing')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="block mx-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
          <Sponsorship placement="content" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Analytics Dashboard
              </h1>
              {state.lastRefresh && (
                <span className="ml-4 text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {state.lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* Time Range Filter */}
              <select
                value={state.timeRange}
                onChange={(e) => updateState({ timeRange: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              
              {/* Auto-refresh Toggle */}
              <button
                onClick={() => updateState({ autoRefresh: !state.autoRefresh })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  state.autoRefresh
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                }`}
              >
                {state.autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
              
              <button
                onClick={exportAnalyticsData}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2 inline" />
                Export
              </button>
              
              <button
                onClick={loadAnalyticsData}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                title="Refresh analytics data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {state.error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-red-600 dark:text-red-400">{state.error}</p>
              <button
                onClick={loadAnalyticsData}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Files"
            value={state.metrics?.totalFiles.toLocaleString() || '0'}
            change={12.5}
            icon={FileImage}
            color="text-blue-600 dark:text-blue-400"
            subtitle="All time"
            loading={state.isLoading}
          />
          
          <MetricCard
            title="Files Processed"
            value={state.metrics?.filesProcessed.toLocaleString() || '0'}
            change={8.3}
            icon={CheckCircle}
            color="text-green-600 dark:text-green-400"
            subtitle={`${state.metrics?.filesInQueue || 0} in queue`}
            loading={state.isLoading}
          />
          
          <MetricCard
            title="Active Users"
            value={state.metrics?.activeUsers || 0}
            change={-2.1}
            icon={Users}
            color="text-purple-600 dark:text-purple-400"
            subtitle={`${state.metrics?.totalUsers || 0} total users`}
            loading={state.isLoading}
          />
          
          <MetricCard
            title="API Calls"
            value={state.metrics?.apiCalls.toLocaleString() || '0'}
            change={15.7}
            icon={Zap}
            color="text-orange-600 dark:text-orange-400"
            subtitle="This period"
            loading={state.isLoading}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Avg Processing Time"
            value={`${state.metrics?.averageProcessingTime || 0}s`}
            change={-5.2}
            icon={Clock}
            color="text-indigo-600 dark:text-indigo-400"
            subtitle="Per file"
            loading={state.isLoading}
          />
          
          <MetricCard
            title="Storage Used"
            value={`${state.metrics?.storageUsed || 0} GB`}
            change={3.8}
            icon={Database}
            color="text-cyan-600 dark:text-cyan-400"
            subtitle="Total storage"
            loading={state.isLoading}
          />
          
          <MetricCard
            title="Bandwidth Used"
            value={`${state.metrics?.bandwidthUsed || 0} GB`}
            change={7.2}
            icon={Globe}
            color="text-pink-600 dark:text-pink-400"
            subtitle="This period"
            loading={state.isLoading}
          />
        </div>

        {/* Processing Queue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Processing Queue
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {state.processingQueue.length} items
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {state.isLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : state.processingQueue.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No files currently in processing queue</p>
              </div>
            ) : (
              state.processingQueue.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.fileName}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatFileSize(item.fileSize)}</span>
                          <span>User: {item.userId}</span>
                          <span>{item.startTime.toLocaleTimeString()}</span>
                        </div>
                        {item.status === 'processing' && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {item.progress}% complete
                            </p>
                          </div>
                        )}
                        {item.errorMessage && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Error: {item.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.toUpperCase()}
                      </span>
                      {item.endTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDuration((item.endTime.getTime() - item.startTime.getTime()) / 1000)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Usage Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Usage Trends
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              File processing and API usage over time
            </p>
          </div>
          <div className="p-6">
            <InteractiveCharts
              config={{
                title: 'Usage Analytics',
                subtitle: `Data for ${state.timeRange}`,
                type: 'line',
                series: [
                  {
                    id: 'files',
                    name: 'Files Processed',
                    data: state.usageData.map(d => ({
                      label: new Date(d.date).toLocaleDateString(),
                      value: d.files,
                      timestamp: new Date(d.date),
                      metadata: { date: d.date }
                    })),
                    color: '#3B82F6',
                    visible: true
                  },
                  {
                    id: 'users',
                    name: 'Active Users',
                    data: state.usageData.map(d => ({
                      label: new Date(d.date).toLocaleDateString(),
                      value: d.users,
                      timestamp: new Date(d.date),
                      metadata: { date: d.date }
                    })),
                    color: '#10B981',
                    visible: true
                  },
                  {
                    id: 'apiCalls',
                    name: 'API Calls',
                    data: state.usageData.map(d => ({
                      label: new Date(d.date).toLocaleDateString(),
                      value: d.apiCalls,
                      timestamp: new Date(d.date),
                      metadata: { date: d.date }
                    })),
                    color: '#F59E0B',
                    visible: true
                  }
                ],
                xAxisLabel: 'Date',
                yAxisLabel: 'Count',
                showLegend: true,
                showGrid: true,
                showTooltip: true,
                interactive: true,
                height: 400,
                timeRange: state.timeRange
              }}
              onDataPointClick={(point, series) => {
                console.log('Chart data point clicked:', point, series);
              }}
              onExport={(format) => {
                console.log('Exporting chart as:', format);
                // Handle chart export
              }}
              loading={state.isLoading}
              error={state.error || undefined}
            />
          </div>
        </div>
      </div>

      <Sponsorship placement="bottom" />
    </div>
  );
}; 