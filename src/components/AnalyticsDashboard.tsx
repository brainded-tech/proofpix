import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  FileImage, 
  Download, 
  Calendar, 
  Zap, 
  Camera,
  Shield,
  Activity,
  Clock,
  AlertTriangle,
  RefreshCw,
  Filter
} from 'lucide-react';
import { 
  analyticsRepository,
  usageRepository,
  subscriptionRepository
} from '../utils/repositories';
import { errorHandler } from '../utils/errorHandler';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnalyticsData, UsageTrackingData, SubscriptionData } from '../utils/apiClient';

interface EnhancedAnalyticsState {
  analytics: AnalyticsData | null;
  usage: UsageTrackingData | null;
  subscription: SubscriptionData | null;
  privacyRisks: {
    summary: { low: number; medium: number; high: number; critical: number };
    trends: Array<{ date: Date; risk: string; count: number }>;
    topTypes: Array<{ type: string; count: number; percentage: number }>;
  } | null;
  performance: {
    processingTimes: { average: number; median: number; p95: number; p99: number };
    errorRates: { total: number; byType: Record<string, number> };
    throughput: Array<{ date: Date; filesPerHour: number }>;
  } | null;
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  subtitle,
  trend 
}) => (
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
        <span className={`text-sm font-medium ${
          change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {change >= 0 ? '↗️' : '↘️'} {Math.abs(change)}%
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">vs last period</span>
      </div>
    )}
  </div>
);

interface ChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title: string;
  type: 'bar' | 'pie' | 'line';
  color?: string;
  height?: string;
}

const EnhancedChart: React.FC<ChartProps> = ({ 
  data, 
  title, 
  type, 
  color = '#3b82f6',
  height = 'h-64'
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  if (type === 'bar') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="space-y-3">
          {data.slice(0, 8).map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate">
                {item.label}
              </div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color || color
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm text-gray-900 dark:text-white text-right font-medium">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="space-y-3">
          {data.slice(0, 6).map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
            const itemColor = item.color || `hsl(${index * 60}, 70%, 50%)`;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: itemColor }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{percentage}%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({item.value.toLocaleString()})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Enhanced line chart
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className={`${height} flex items-end space-x-1 px-2`}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center group">
            <div
              className="w-full rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
              style={{
                height: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '2px',
                backgroundColor: item.color || color,
                minHeight: '2px'
              }}
              title={`${item.label}: ${item.value}`}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [state, setState] = useState<EnhancedAnalyticsState>({
    analytics: null,
    usage: null,
    subscription: null,
    privacyRisks: null,
    performance: null,
    isLoading: true,
    error: null,
    lastRefresh: null
  });
  
  // Check for Pro tier access - Analytics is Pro+ only
  const userTier = localStorage.getItem('proofpix_user_tier') || 'free';
  const hasProAccess = userTier === 'pro' || userTier === 'enterprise';

  const updateState = useCallback((updates: Partial<EnhancedAnalyticsState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadAnalyticsData = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });

      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

      // Load all analytics data in parallel
      const [
        analyticsResult,
        usageResult,
        subscriptionResult,
        privacyRisksResult,
        performanceResult
      ] = await Promise.allSettled([
        analyticsRepository.getDetailed({
          start: startDate,
          end: endDate,
          granularity: days <= 7 ? 'day' : days <= 30 ? 'day' : 'week'
        }),
        usageRepository.getCurrent(),
        subscriptionRepository.getCurrent().catch(() => null),
        analyticsRepository.getPrivacyRisks({ start: startDate, end: endDate }),
        analyticsRepository.getPerformance({ start: startDate, end: endDate })
      ]);

      updateState({
        analytics: analyticsResult.status === 'fulfilled' ? analyticsResult.value : null,
        usage: usageResult.status === 'fulfilled' ? usageResult.value : null,
        subscription: subscriptionResult.status === 'fulfilled' ? subscriptionResult.value : null,
        privacyRisks: privacyRisksResult.status === 'fulfilled' ? privacyRisksResult.value : null,
        performance: performanceResult.status === 'fulfilled' ? performanceResult.value : null,
        isLoading: false,
        lastRefresh: new Date()
      });

    } catch (error) {
      console.error('Analytics loading error:', error);
      await errorHandler.handleError('analytics_load', error as Error);
      updateState({ 
        error: 'Failed to load analytics data', 
        isLoading: false 
      });
    }
  }, [timeRange, updateState]);

  useEffect(() => {
    if (hasProAccess) {
      loadAnalyticsData();
    }
  }, [hasProAccess, loadAnalyticsData]);

  const exportAnalytics = useCallback(async () => {
    try {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

      const exportData = await analyticsRepository.exportData({
        start: startDate,
        end: endDate,
        format: 'csv',
        metrics: ['usage', 'privacy_risks', 'performance']
      });

      // Create download link
      const link = document.createElement('a');
      link.href = exportData.downloadUrl;
      link.download = `proofpix-analytics-${timeRange}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      } catch (error) {
      console.error('Export error:', error);
      await errorHandler.handleError('analytics_export', error as Error);
      }
  }, [timeRange]);

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(unitIndex > 0 ? 2 : 0)} ${units[unitIndex]}`;
  };

  const formatTime = (milliseconds: number): string => {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    const seconds = milliseconds / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = seconds / 60;
    return `${minutes.toFixed(1)}m`;
  };

  // Computed data for charts
  const chartData = useMemo(() => {
    if (!state.analytics) return null;

    return {
      fileTypes: Object.entries(state.analytics.metrics.fileTypes || {}).map(([type, count]) => ({
        label: type.toUpperCase(),
        value: count
      })),
      
      privacyRiskTrends: state.analytics.trends.privacyRisks?.map(trend => ({
        label: new Date(trend.date).toLocaleDateString(),
        value: trend.count,
        color: trend.risk === 'critical' ? '#ef4444' : 
               trend.risk === 'high' ? '#f97316' :
               trend.risk === 'medium' ? '#eab308' : '#22c55e'
      })) || [],
      
      processingVolume: state.analytics.trends.filesProcessed?.map(trend => ({
        label: new Date(trend.date).toLocaleDateString(),
        value: trend.count
      })) || [],
      
      dataVolume: state.analytics.trends.dataVolume?.map(trend => ({
        label: new Date(trend.date).toLocaleDateString(),
        value: Math.round(trend.bytes / (1024 * 1024)) // Convert to MB
      })) || [],

      deviceTypes: Object.entries(state.analytics.insights.deviceTypes || {}).map(([type, count]) => ({
        label: type,
        value: count
      })),

      topRiskTypes: state.analytics.insights.topRiskTypes?.map(risk => ({
        label: risk.type,
        value: risk.count,
        color: risk.percentage > 50 ? '#ef4444' : 
               risk.percentage > 25 ? '#f97316' : 
               risk.percentage > 10 ? '#eab308' : '#22c55e'
      })) || []
    };
  }, [state.analytics]);

  const handleBackHome = () => {
    navigate('/');
  };

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
                onClick={handleBackHome}
                className="block mx-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                Back to Dashboard
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
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
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              
              <button
                onClick={exportAnalytics}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2 inline" />
                Export
              </button>
              
              <button
                onClick={loadAnalyticsData}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                title="Refresh analytics"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleBackHome}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
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
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
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
            title="Total Files Processed"
            value={state.analytics?.metrics.totalFiles?.toLocaleString() || '0'}
            icon={FileImage}
            color="text-blue-600 dark:text-blue-400"
            subtitle={`${formatFileSize(state.analytics?.metrics.totalSize || 0)} processed`}
          />
          
          <MetricCard
            title="Privacy Risks Detected"
            value={state.privacyRisks ? Object.values(state.privacyRisks.summary).reduce((a, b) => a + b, 0) : 0}
            icon={Shield}
            color="text-yellow-600 dark:text-yellow-400"
            subtitle={`${state.privacyRisks?.summary.critical || 0} critical risks`}
          />
          
          <MetricCard
            title="Avg Processing Time"
            value={formatTime(state.performance?.processingTimes.average || 0)}
            icon={Clock}
            color="text-green-600 dark:text-green-400"
            subtitle={`P95: ${formatTime(state.performance?.processingTimes.p95 || 0)}`}
          />
          
          <MetricCard
            title="Error Rate"
            value={`${((state.performance?.errorRates.total || 0) * 100).toFixed(2)}%`}
            icon={Activity}
            color="text-purple-600 dark:text-purple-400"
            subtitle="Last 30 days"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Processing Volume Trend */}
          {chartData?.processingVolume && (
            <EnhancedChart
              data={chartData.processingVolume}
              title="Files Processed Over Time"
              type="line"
              color="#3b82f6"
            />
          )}

          {/* Privacy Risk Trends */}
          {chartData?.privacyRiskTrends && (
            <EnhancedChart
              data={chartData.privacyRiskTrends}
              title="Privacy Risk Trends"
              type="line"
              color="#ef4444"
            />
          )}

          {/* File Types Distribution */}
          {chartData?.fileTypes && (
            <EnhancedChart
              data={chartData.fileTypes}
              title="File Types Processed"
              type="pie"
            />
          )}

          {/* Top Risk Types */}
          {chartData?.topRiskTypes && (
            <EnhancedChart
              data={chartData.topRiskTypes}
              title="Top Privacy Risk Types"
              type="bar"
            />
          )}
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Data Volume Trend */}
          {chartData?.dataVolume && (
            <EnhancedChart
              data={chartData.dataVolume}
              title="Data Volume Processed (MB)"
              type="line"
              color="#10b981"
            />
          )}

          {/* Device Types */}
          {chartData?.deviceTypes && (
            <EnhancedChart
              data={chartData.deviceTypes}
              title="Device Types Detected"
              type="pie"
            />
          )}
      </div>

        {/* Performance Insights */}
        {state.performance && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Performance Insights
        </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(state.performance.processingTimes.median)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Median Processing Time</p>
                </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {state.performance.throughput.length > 0 ? 
                    Math.round(state.performance.throughput.reduce((sum, t) => sum + t.filesPerHour, 0) / state.performance.throughput.length) : 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Files/Hour</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Object.keys(state.performance.errorRates.byType).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Error Types</p>
        </div>
      </div>
          </div>
        )}

        {/* Usage Summary */}
        {state.usage && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Current Usage Summary
        </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {state.usage.metrics.filesProcessed.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Files This Period</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  of {state.usage.limits.filesPerMonth.toLocaleString()} limit
            </p>
          </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatFileSize(state.usage.metrics.dataProcessed)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Data Processed</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  of {formatFileSize(state.usage.limits.dataPerMonth)} limit
            </p>
          </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {state.usage.metrics.apiCalls.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">API Calls Today</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  of {state.usage.limits.apiCallsPerDay.toLocaleString()} limit
              </p>
            </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatFileSize(state.usage.metrics.storageUsed)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Storage Used</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  of {formatFileSize(state.usage.limits.storageLimit)} limit
            </p>
          </div>
        </div>
      </div>
        )}
      </div>
    </div>
  );
}; 