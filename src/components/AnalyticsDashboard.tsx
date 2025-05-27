import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, FileImage, Download, Calendar, Zap, Camera } from 'lucide-react';
import { usageTracker, analytics } from '../utils/analytics';
import { Sponsorship } from './Sponsorships';

interface UsageData {
  date: string;
  uploads: number;
  pdfDownloads: number;
  imageDownloads: number;
  dataExports: number;
  processingTime: number;
}

interface AnalyticsData {
  totalImages: number;
  totalSessions: number;
  averageProcessingTime: number;
  topCameraBrands: Array<{ brand: string; count: number }>;
  fileFormats: Array<{ format: string; count: number }>;
  processingTrends: Array<{ date: string; count: number }>;
  errorRates: Array<{ type: string; count: number }>;
  userEngagement: {
    avgSessionDuration: number;
    bounceRate: number;
    returnUsers: number;
  };
  geographicData: Array<{ country: string; count: number }>;
  deviceTypes: Array<{ type: string; count: number }>;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  subtitle 
}) => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {subtitle && (
          <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`text-3xl ${color}`}>
        {icon}
      </div>
    </div>
    {change !== undefined && (
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${
          change >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {change >= 0 ? '↗️' : '↘️'} {Math.abs(change)}%
        </span>
        <span className="text-gray-500 text-sm ml-2">vs last period</span>
      </div>
    )}
  </div>
);

interface ChartProps {
  data: Array<{ label: string; value: number }>;
  title: string;
  type: 'bar' | 'pie' | 'line';
  color?: string;
}

const SimpleChart: React.FC<ChartProps> = ({ data, title, type, color = '#3b82f6' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  if (type === 'bar') {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="space-y-3">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-sm text-gray-400 truncate">
                {item.label}
              </div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
              <div className="w-12 text-sm text-white text-right">
                {item.value}
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
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="space-y-2">
          {data.slice(0, 5).map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                  />
                  <span className="text-sm text-gray-300">{item.label}</span>
                </div>
                <span className="text-sm text-white">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Line chart (simplified)
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-32 flex items-end space-x-1">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t transition-all duration-500"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: color,
                minHeight: '2px'
              }}
            />
            <span className="text-xs text-gray-400 mt-1 truncate">
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
  const [currentStats, setCurrentStats] = useState(usageTracker.getUsageStats());
  const [historicalData, setHistoricalData] = useState<UsageData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for Pro tier access - Analytics is Pro+ only
  const userTier = localStorage.getItem('proofpix_user_tier') || 'free';
  const hasProAccess = userTier === 'pro' || userTier === 'enterprise';

  const handleBackHome = () => {
    analytics.trackFeatureUsage('Navigation', 'Home - Analytics');
    navigate('/');
  };

  const handleAboutClick = () => {
    analytics.trackFeatureUsage('Navigation', 'About Us - Analytics');
    navigate('/about');
  };

  const handlePrivacyClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Privacy Policy - Analytics');
    navigate('/privacy');
  };

  const handleFAQClick = () => {
    analytics.trackFeatureUsage('Navigation', 'FAQ - Analytics');
    navigate('/faq');
  };

  const handleTermsClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Terms - Analytics');
    navigate('/terms');
  };

  const handleSupportClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Support - Analytics');
    navigate('/support');
  };

  const handleContactClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Contact - Analytics');
    window.location.href = 'https://proofpixapp.com/#contact';
  };

  const handlePricingClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Pricing - Analytics');
    navigate('/pricing');
  };

  const handleBatchClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Batch Management - Analytics');
    navigate('/batch');
  };

  // Update stats periodically
  useEffect(() => {
    const updateStats = () => {
      setCurrentStats(usageTracker.getUsageStats());
      
      // Get historical data from localStorage
      const stored = localStorage.getItem('proofpix_usage_history');
      if (stored) {
        try {
          const history = JSON.parse(stored);
          setHistoricalData(history);
        } catch (error) {
          console.warn('Failed to parse usage history:', error);
        }
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        // Simulate API call - replace with actual analytics service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const data: AnalyticsData = {
          totalImages: 15847,
          totalSessions: 3421,
          averageProcessingTime: 2.3,
          topCameraBrands: [
            { brand: 'Canon', count: 4521 },
            { brand: 'Nikon', count: 3892 },
            { brand: 'Sony', count: 3156 },
            { brand: 'Apple', count: 2847 },
            { brand: 'Samsung', count: 1431 }
          ],
          fileFormats: [
            { format: 'JPEG', count: 12456 },
            { format: 'PNG', count: 2134 },
            { format: 'TIFF', count: 987 },
            { format: 'RAW', count: 270 }
          ],
          processingTrends: [
            { date: '2024-01-01', count: 234 },
            { date: '2024-01-02', count: 456 },
            { date: '2024-01-03', count: 389 },
            { date: '2024-01-04', count: 567 },
            { date: '2024-01-05', count: 432 },
            { date: '2024-01-06', count: 678 },
            { date: '2024-01-07', count: 543 }
          ],
          errorRates: [
            { type: 'Metadata Missing', count: 45 },
            { type: 'File Corrupted', count: 23 },
            { type: 'Unsupported Format', count: 12 },
            { type: 'Processing Timeout', count: 8 }
          ],
          userEngagement: {
            avgSessionDuration: 8.5,
            bounceRate: 23.4,
            returnUsers: 67.8
          },
          geographicData: [
            { country: 'United States', count: 5432 },
            { country: 'United Kingdom', count: 2134 },
            { country: 'Germany', count: 1876 },
            { country: 'Canada', count: 1543 },
            { country: 'Australia', count: 987 }
          ],
          deviceTypes: [
            { type: 'Desktop', count: 8934 },
            { type: 'Mobile', count: 4567 },
            { type: 'Tablet', count: 2346 }
          ]
        };
        
        setAnalyticsData(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange]);

  // Calculate trends and insights
  const insights = useMemo(() => {
    const totalFiles = currentStats.uploads;
    const totalExports = currentStats.pdfDownloads + currentStats.imageDownloads + currentStats.dataExports;
    const exportRate = totalFiles > 0 ? (totalExports / totalFiles) * 100 : 0;
    
    // Calculate most active day
    const dayTotals = historicalData.reduce((acc, day) => {
      const total = day.uploads + day.pdfDownloads + day.imageDownloads + day.dataExports;
      acc[day.date] = total;
      return acc;
    }, {} as Record<string, number>);
    
    const mostActiveDay = Object.entries(dayTotals).reduce((max, [date, total]) => 
      total > max.total ? { date, total } : max, { date: '', total: 0 });

    // Calculate average processing time
    const avgProcessingTime = historicalData.length > 0 
      ? historicalData.reduce((sum, day) => sum + day.processingTime, 0) / historicalData.length
      : 0;

    return {
      totalFiles,
      totalExports,
      exportRate,
      mostActiveDay,
      avgProcessingTime
    };
  }, [currentStats, historicalData]);

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    if (!analyticsData) return null;

    return {
      avgImagesPerSession: (analyticsData.totalImages / analyticsData.totalSessions).toFixed(1),
      successRate: ((analyticsData.totalImages / (analyticsData.totalImages + 
        analyticsData.errorRates.reduce((sum, err) => sum + err.count, 0))) * 100).toFixed(1),
      topCameraBrand: analyticsData.topCameraBrands[0]?.brand || 'N/A',
      mostCommonFormat: analyticsData.fileFormats[0]?.format || 'N/A'
    };
  }, [analyticsData]);

  // Filter historical data based on time range
  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'all':
        cutoffDate.setFullYear(2020); // Far in the past
        break;
    }

    return historicalData.filter(data => new Date(data.date) >= cutoffDate);
  }, [historicalData, timeRange]);

  // Calculate totals for the selected time range
  const rangeTotals = useMemo(() => {
    return filteredData.reduce((totals, day) => ({
      uploads: totals.uploads + day.uploads,
      pdfDownloads: totals.pdfDownloads + day.pdfDownloads,
      imageDownloads: totals.imageDownloads + day.imageDownloads,
      dataExports: totals.dataExports + day.dataExports,
      processingTime: totals.processingTime + day.processingTime
    }), {
      uploads: 0,
      pdfDownloads: 0,
      imageDownloads: 0,
      dataExports: 0,
      processingTime: 0
    });
  }, [filteredData]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const getUsageLevel = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return { level: 'high', color: 'text-red-500', bg: 'bg-red-500' };
    if (percentage >= 70) return { level: 'medium', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { level: 'low', color: 'text-green-500', bg: 'bg-green-500' };
  };

  // If not Pro tier, show upgrade prompt
  if (!hasProAccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl mb-8">
              <BarChart3 size={64} className="mx-auto mb-4 text-white" />
              <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
              <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-2">🔒 Pro Feature</h2>
                <p className="text-gray-200 mb-4">
                  Analytics and usage insights are available to Pro tier users and above.
                </p>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>✨ Detailed usage statistics</p>
                  <p>📊 Historical data tracking</p>
                  <p>📈 Performance insights</p>
                  <p>📋 Data export capabilities</p>
                </div>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/pricing')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Upgrade to Pro
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-white mb-2">Analytics Unavailable</h2>
          <p className="text-gray-400">Unable to load analytics data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={handleBackHome}>
              <Camera className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold">ProofPix</h1>
            </div>
            
            {/* Header Sponsorship */}
            <div className="hidden lg:block">
              <Sponsorship placement="header" className="max-w-md" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="analytics-dashboard bg-gray-800 rounded-lg p-6">
      <div className="dashboard-header mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <BarChart3 size={24} className="mr-2" />
              Usage Analytics
            </h2>
            <p className="text-gray-400">Your local usage statistics and insights</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: 'all', label: 'All Time' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setTimeRange(option.key as any)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timeRange === option.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Day Usage */}
      <div className="current-usage mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Calendar size={18} className="mr-2" />
          Today's Usage
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'Uploads', 
              value: currentStats.uploads, 
              limit: 10, 
              icon: FileImage,
              description: 'Images processed'
            },
            { 
              label: 'PDF Downloads', 
              value: currentStats.pdfDownloads, 
              limit: 3, 
              icon: Download,
              description: 'Reports generated'
            },
            { 
              label: 'Image Downloads', 
              value: currentStats.imageDownloads, 
              limit: 15, 
              icon: Download,
              description: 'Images exported'
            },
            { 
              label: 'Data Exports', 
              value: currentStats.dataExports, 
              limit: 20, 
              icon: Download,
              description: 'JSON/CSV exports'
            }
          ].map(stat => {
            const usage = getUsageLevel(stat.value, stat.limit);
            return (
              <div key={stat.label} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon size={20} className={usage.color} />
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                <div className="w-full bg-gray-600 rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full ${usage.bg}`}
                    style={{ width: `${Math.min((stat.value / stat.limit) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">{stat.value}/{stat.limit} {stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Overview */}
      <div className="historical-overview mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp size={18} className="mr-2" />
          {timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'All Time'} Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{rangeTotals.uploads}</div>
            <div className="text-sm text-gray-400">Total Uploads</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{rangeTotals.pdfDownloads + rangeTotals.imageDownloads + rangeTotals.dataExports}</div>
            <div className="text-sm text-gray-400">Total Exports</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{insights.exportRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">Export Rate</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{formatTime(rangeTotals.processingTime)}</div>
            <div className="text-sm text-gray-400">Processing Time</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="insights">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Zap size={18} className="mr-2" />
          Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Usage Efficiency</h4>
            <p className="text-gray-400 text-sm">
              You export {insights.exportRate.toFixed(1)}% of uploaded images, showing {
                insights.exportRate > 80 ? 'excellent' : 
                insights.exportRate > 60 ? 'good' : 
                insights.exportRate > 40 ? 'moderate' : 'low'
              } workflow efficiency.
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Processing Speed</h4>
            <p className="text-gray-400 text-sm">
              Average processing time: {formatTime(insights.avgProcessingTime)}. 
              {insights.avgProcessingTime < 5 ? ' Lightning fast!' : 
               insights.avgProcessingTime < 15 ? ' Good performance.' : 
               ' Consider smaller files for faster processing.'}
            </p>
          </div>

          {insights.mostActiveDay.total > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Most Active Day</h4>
              <p className="text-gray-400 text-sm">
                {new Date(insights.mostActiveDay.date).toLocaleDateString()} with {insights.mostActiveDay.total} total actions.
              </p>
            </div>
          )}

          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Privacy Note</h4>
            <p className="text-gray-400 text-sm">
              All analytics are stored locally in your browser. No data is sent to external servers.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="data-management mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white">Data Management</h4>
            <p className="text-gray-400 text-sm">Manage your local analytics data</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                const data = JSON.stringify({
                  currentStats,
                  historicalData,
                  exportDate: new Date().toISOString()
                }, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `proofpix-analytics-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Export Data
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
                  localStorage.removeItem('proofpix_usage_stats');
                  localStorage.removeItem('proofpix_usage_history');
                  usageTracker.resetStats();
                  setCurrentStats(usageTracker.getUsageStats());
                  setHistoricalData([]);
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Clear Data
            </button>
          </div>
        </div>
      </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>© 2025 ProofPix. Built for professionals, by professionals.</p>
              <p>Privacy-respecting EXIF metadata tool - v1.8.0 • Open Source</p>
            </div>
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm">
              <button onClick={handleBackHome} className="text-gray-400 hover:text-white">Home</button>
              <button onClick={handleFAQClick} className="text-gray-400 hover:text-white">F.A.Q.</button>
              <button onClick={handleAboutClick} className="text-gray-400 hover:text-white">About</button>
              <button onClick={handlePrivacyClick} className="text-gray-400 hover:text-white">Privacy</button>
              <button onClick={handleTermsClick} className="text-gray-400 hover:text-white">Terms</button>
              <button onClick={handleSupportClick} className="text-gray-400 hover:text-white">Support</button>
              <button onClick={handleContactClick} className="text-gray-400 hover:text-white">Contact</button>
              <button onClick={handlePricingClick} className="text-gray-400 hover:text-white">Pricing</button>
              <button onClick={handleBatchClick} className="text-gray-400 hover:text-white">Batch Manager</button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}; 