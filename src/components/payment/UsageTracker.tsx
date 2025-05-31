import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Upload, 
  Database, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  RefreshCw,
  Zap
} from 'lucide-react';
import { 
  PaymentClient, 
  UsageData, 
  calculateUsagePercentage, 
  isUsageOverLimit 
} from '../../utils/paymentClient';

interface UsageMetric {
  key: keyof UsageData;
  label: string;
  icon: React.ComponentType<any>;
  unit: string;
  color: string;
  description: string;
}

const USAGE_METRICS: UsageMetric[] = [
  {
    key: 'api_calls',
    label: 'API Calls',
    icon: Activity,
    unit: 'calls',
    color: 'blue',
    description: 'Number of API requests made this month'
  },
  {
    key: 'file_uploads',
    label: 'File Uploads',
    icon: Upload,
    unit: 'files',
    color: 'green',
    description: 'Number of files uploaded and processed'
  },
  {
    key: 'storage_gb',
    label: 'Storage',
    icon: Database,
    unit: 'GB',
    color: 'purple',
    description: 'Total storage space used'
  },
  {
    key: 'processing_minutes',
    label: 'Processing Time',
    icon: Clock,
    unit: 'minutes',
    color: 'orange',
    description: 'Total processing time used this month'
  }
];

interface UsageTrackerProps {
  onUpgradeNeeded?: () => void;
}

export const UsageTracker: React.FC<UsageTrackerProps> = ({ onUpgradeNeeded }) => {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const paymentClient = new PaymentClient();

  useEffect(() => {
    loadUsageData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadUsageData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadUsageData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const usageData = await paymentClient.getUsage();
      setUsage(usageData);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load usage data');
    } finally {
      setIsLoading(false);
    }
  };

  const getUsageColor = (current: number, limit: number) => {
    if (limit === -1) return 'text-green-600'; // Unlimited
    
    const percentage = calculateUsagePercentage(current, limit);
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressBarColor = (current: number, limit: number) => {
    if (limit === -1) return 'bg-green-500'; // Unlimited
    
    const percentage = calculateUsagePercentage(current, limit);
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const formatUsageValue = (value: number, unit: string) => {
    if (unit === 'GB') {
      return value.toFixed(2);
    }
    return value.toLocaleString();
  };

  const formatLimitValue = (limit: number, unit: string) => {
    if (limit === -1) return 'Unlimited';
    if (unit === 'GB') {
      return limit.toFixed(0);
    }
    return limit.toLocaleString();
  };

  const hasOverageRisk = () => {
    if (!usage) return false;
    return USAGE_METRICS.some(metric => {
      const data = usage[metric.key];
      return calculateUsagePercentage(data.current, data.limit) >= 85;
    });
  };

  const getOverageMetrics = () => {
    if (!usage) return [];
    return USAGE_METRICS.filter(metric => {
      const data = usage[metric.key];
      return isUsageOverLimit(data.current, data.limit);
    });
  };

  if (isLoading && !usage) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading usage data...</span>
        </div>
      </div>
    );
  }

  const overageMetrics = getOverageMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Usage & Quotas
          </h3>
          {lastRefresh && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={loadUsageData}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Overage Warning */}
      {overageMetrics.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                Usage Limit Exceeded
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                You've exceeded your plan limits for: {overageMetrics.map(m => m.label).join(', ')}. 
                Additional usage may incur overage charges.
              </p>
              {onUpgradeNeeded && (
                <button
                  onClick={onUpgradeNeeded}
                  className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* High Usage Warning */}
      {hasOverageRisk() && overageMetrics.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start">
            <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Approaching Usage Limits
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                You're approaching your plan limits. Consider upgrading to avoid service interruptions.
              </p>
              {onUpgradeNeeded && (
                <button
                  onClick={onUpgradeNeeded}
                  className="flex items-center px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  View Plans
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Usage Metrics */}
      {usage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {USAGE_METRICS.map((metric) => {
            const data = usage[metric.key];
            const percentage = calculateUsagePercentage(data.current, data.limit);
            const isOverLimit = isUsageOverLimit(data.current, data.limit);
            const Icon = metric.icon;

            return (
              <div
                key={metric.key}
                className={`bg-white dark:bg-gray-800 rounded-lg p-6 border ${
                  isOverLimit 
                    ? 'border-red-300 dark:border-red-700' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                      <Icon className={`h-5 w-5 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {metric.label}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                  {isOverLimit && (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Current Usage</span>
                    <span className={`font-medium ${getUsageColor(data.current, data.limit)}`}>
                      {formatUsageValue(data.current, metric.unit)} {metric.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Plan Limit</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatLimitValue(data.limit, metric.unit)} {data.limit !== -1 ? metric.unit : ''}
                    </span>
                  </div>

                  {data.limit !== -1 && (
                    <>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(data.current, data.limit)}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{percentage.toFixed(1)}% used</span>
                        {percentage > 100 && (
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            {(percentage - 100).toFixed(1)}% over limit
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}; 