/**
 * Feature Usage Analytics Dashboard
 * Comprehensive dashboard for tracking and analyzing feature usage across the platform
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Zap
} from 'lucide-react';
import { 
  advancedAnalyticsService, 
  FeatureUsageAnalytics,
  FeatureUsageEvent 
} from '../../services/advancedAnalyticsService';

interface FeatureUsageDashboardProps {
  className?: string;
}

export const FeatureUsageDashboard: React.FC<FeatureUsageDashboardProps> = ({
  className = ''
}) => {
  const [analytics, setAnalytics] = useState<FeatureUsageAnalytics[]>([]);
  const [popularFeatures, setPopularFeatures] = useState<Array<{ feature: string; usage: number; growth: number }>>([]);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      let dateRange: { start: Date; end: Date } | undefined;
      if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const end = new Date();
        const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
        dateRange = { start, end };
      }

      const [analyticsData, popularData] = await Promise.all([
        advancedAnalyticsService.getFeatureUsageAnalytics(selectedFeature || undefined, dateRange),
        advancedAnalyticsService.getPopularFeatures(10)
      ]);

      setAnalytics(analyticsData);
      setPopularFeatures(popularData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load feature usage analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedFeature, timeRange]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number): string => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (growth < 0) return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading feature analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Feature Usage Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track feature adoption, usage patterns, and user engagement
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            
            <button
              onClick={loadAnalytics}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      </div>

      {/* Popular Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Most Popular Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularFeatures.slice(0, 6).map((feature, index) => (
            <div
              key={feature.feature}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => setSelectedFeature(feature.feature)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {feature.feature}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  #{index + 1}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">
                  {formatNumber(feature.usage)}
                </span>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(feature.growth)}
                  <span className={`text-sm ${getGrowthColor(feature.growth)}`}>
                    {formatPercentage(Math.abs(feature.growth))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Analytics */}
      {analytics.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedFeature ? `${selectedFeature} Analytics` : 'All Features Analytics'}
            </h2>
            
            {selectedFeature && (
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All Features
              </button>
            )}
          </div>

          <div className="space-y-6">
            {analytics.map((feature) => (
              <div key={feature.feature} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.feature}
                  </h3>
                  <button
                    onClick={() => setSelectedFeature(feature.feature)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(feature.totalUsage)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Usage</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(feature.uniqueUsers)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Unique Users</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPercentage(feature.adoptionRate)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Adoption Rate</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatPercentage(feature.retentionRate)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</div>
                  </div>
                </div>

                {/* Most Common Actions */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Most Common Actions
                  </h4>
                  <div className="space-y-2">
                    {feature.mostCommonActions.slice(0, 3).map((action) => (
                      <div key={action.action} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {action.action}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${action.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {action.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage by Tier */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Usage by Subscription Tier
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(feature.usageByTier).map(([tier, count]) => (
                      <div key={tier} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatNumber(count)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {tier}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {analytics.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Feature Usage Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start using features to see analytics data here.
          </p>
        </div>
      )}
    </div>
  );
};

export default FeatureUsageDashboard; 