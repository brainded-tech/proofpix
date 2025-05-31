import React, { useState, useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale,
  TimeScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Shield, 
  Eye,
  Clock,
  FileImage,
  Zap,
  BarChart3,
  ArrowRight,
  ChevronDown,
  ZoomIn
} from 'lucide-react';
import { advancedAnalyticsService } from '../../services/advancedAnalyticsService';
import 'chartjs-adapter-date-fns'; // For time scale

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale,
  TimeScale
);

interface MetricsDashboardProps {
  userId?: string;
  organizationId?: string;
  refreshInterval?: number; // in seconds
  theme?: 'light' | 'dark';
  defaultTimeRange?: '24h' | '7d' | '30d' | '90d';
}

interface MetricData {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  unit?: string;
  icon: React.ReactNode;
}

interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'doughnut' | 'radar';
  data: any;
  options: any;
  isLoading: boolean;
  hasError: boolean;
  fullScreen?: boolean;
  drilldownLevel?: number;
  drilldownFilters?: Record<string, any>[];
}

export const RealTimeMetricsDashboard: React.FC<MetricsDashboardProps> = ({
  userId,
  organizationId,
  refreshInterval = 30,
  theme = 'light',
  defaultTimeRange = '24h'
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>(defaultTimeRange);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Theme-based colors
  const chartColors = theme === 'dark' 
    ? ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)']
    : ['rgba(37, 99, 235, 0.8)', 'rgba(5, 150, 105, 0.8)', 'rgba(217, 119, 6, 0.8)', 'rgba(220, 38, 38, 0.8)'];
  
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#f3f4f6' : '#111827';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  // Default chart options
  const getDefaultChartOptions = (type: ChartData['type']) => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: textColor,
            font: {
              family: 'Inter, sans-serif',
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: gridColor,
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context: any) {
              const label = context.dataset.label || '';
              const value = context.raw || 0;
              return `${label}: ${value.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: gridColor,
            borderColor: gridColor,
            display: true
          },
          ticks: {
            color: textColor
          }
        },
        y: {
          grid: {
            color: gridColor,
            borderColor: gridColor,
            display: true
          },
          ticks: {
            color: textColor
          },
          beginAtZero: true
        }
      }
    };

    // Chart-specific options
    if (type === 'doughnut') {
      return {
        ...baseOptions,
        cutout: '70%',
        scales: {} // No scales for doughnut
      };
    }

    if (type === 'radar') {
      return {
        ...baseOptions,
        scales: {
          r: {
            angleLines: {
              color: gridColor
            },
            grid: {
              color: gridColor
            },
            pointLabels: {
              color: textColor
            },
            ticks: {
              color: textColor,
              backdropColor: backgroundColor
            }
          }
        }
      };
    }

    return baseOptions;
  };

  // Load analytics data
  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Set date range based on selected timeRange
      const endDate = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '24h':
          startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }

      // Get granularity based on time range
      const granularity = timeRange === '24h' ? 'hour' : timeRange === '7d' ? 'day' : 'week';

      // Get analytics data
      const analyticsData = await advancedAnalyticsService.getAnalyticsData({
        period: {
          start: startDate,
          end: endDate,
          granularity
        },
        metrics: [
          'totalFiles', 
          'totalSize', 
          'privacyRisksDetected',
          'processingTimes',
          'errorRates'
        ]
      });

      // Update key metrics
      const newMetrics: MetricData[] = [
        {
          id: 'total-files',
          title: 'Files Processed',
          value: analyticsData.metrics.totalFiles,
          change: 5.2, // This would come from analytics data comparing to previous period
          changeType: 'positive',
          icon: <FileImage size={20} />
        },
        {
          id: 'total-size',
          title: 'Data Processed',
          value: analyticsData.metrics.totalSize,
          change: 8.7,
          changeType: 'positive',
          unit: 'MB',
          icon: <BarChart3 size={20} />
        },
        {
          id: 'privacy-risks',
          title: 'Privacy Risks',
          value: Object.values(analyticsData.metrics.privacyRisksDetected).reduce((a, b) => a + b, 0),
          change: -12.3,
          changeType: 'positive', // Negative change is positive for risks
          icon: <Shield size={20} />
        },
        {
          id: 'processing-time',
          title: 'Avg. Processing Time',
          value: analyticsData.metrics.processingTimes.average,
          change: -3.5,
          changeType: 'positive',
          unit: 'ms',
          icon: <Clock size={20} />
        }
      ];

      // Create chart data
      const filesProcessedData = {
        labels: analyticsData.trends.filesProcessed.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
          {
            label: 'Files Processed',
            data: analyticsData.trends.filesProcessed.map(item => item.count),
            borderColor: chartColors[0],
            backgroundColor: `${chartColors[0].slice(0, -4)}0.2)`,
            fill: true,
            tension: 0.4
          }
        ]
      };

      const dataVolumeData = {
        labels: analyticsData.trends.dataVolume.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
          {
            label: 'Data Volume (MB)',
            data: analyticsData.trends.dataVolume.map(item => item.bytes / (1024 * 1024)), // Convert to MB
            borderColor: chartColors[1],
            backgroundColor: chartColors[1],
            borderWidth: 1
          }
        ]
      };

      const privacyRiskData = {
        labels: ['Low', 'Medium', 'High', 'Critical'],
        datasets: [
          {
            label: 'Risk Distribution',
            data: [
              analyticsData.metrics.privacyRisksDetected.low,
              analyticsData.metrics.privacyRisksDetected.medium,
              analyticsData.metrics.privacyRisksDetected.high,
              analyticsData.metrics.privacyRisksDetected.critical
            ],
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(220, 38, 38, 0.9)'
            ],
            borderWidth: 1
          }
        ]
      };

      const fileTypesData = {
        labels: Object.keys(analyticsData.metrics.fileTypes),
        datasets: [
          {
            label: 'File Types',
            data: Object.values(analyticsData.metrics.fileTypes),
            backgroundColor: chartColors,
            borderWidth: 0
          }
        ]
      };

      // Update charts
      const newCharts: ChartData[] = [
        {
          id: 'files-processed-chart',
          title: 'Files Processed Over Time',
          type: 'line',
          data: filesProcessedData,
          options: {
            ...getDefaultChartOptions('line'),
            plugins: {
              ...getDefaultChartOptions('line').plugins,
              legend: {
                ...getDefaultChartOptions('line').plugins.legend,
                display: false
              }
            },
            interaction: {
              intersect: false,
              mode: 'nearest'
            }
          },
          isLoading: false,
          hasError: false,
          drilldownLevel: 0,
          drilldownFilters: []
        },
        {
          id: 'data-volume-chart',
          title: 'Data Volume Processed',
          type: 'bar',
          data: dataVolumeData,
          options: getDefaultChartOptions('bar'),
          isLoading: false,
          hasError: false
        },
        {
          id: 'privacy-risk-chart',
          title: 'Privacy Risk Distribution',
          type: 'doughnut',
          data: privacyRiskData,
          options: getDefaultChartOptions('doughnut'),
          isLoading: false,
          hasError: false
        },
        {
          id: 'file-types-chart',
          title: 'File Types Processed',
          type: 'bar',
          data: fileTypesData,
          options: getDefaultChartOptions('bar'),
          isLoading: false,
          hasError: false
        }
      ];

      setMetrics(newMetrics);
      setCharts(newCharts);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load analytics data', error);
      setError('Failed to load analytics data. Please try again later.');
      setIsLoading(false);
    }
  };

  // Initial load and refresh timer
  useEffect(() => {
    loadAnalyticsData();

    // Set up refresh timer
    if (refreshInterval > 0) {
      refreshTimerRef.current = setInterval(loadAnalyticsData, refreshInterval * 1000);
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [timeRange, refreshInterval]);

  // Handle manual refresh
  const handleRefresh = () => {
    loadAnalyticsData();
  };

  // Handle time range change
  const handleTimeRangeChange = (range: '24h' | '7d' | '30d' | '90d') => {
    setTimeRange(range);
  };

  // Handle chart drill down
  const handleChartDrilldown = (chartId: string) => {
    setCharts(prevCharts => prevCharts.map(chart => {
      if (chart.id === chartId) {
        const newDrilldownLevel = (chart.drilldownLevel || 0) + 1;
        const newDrilldownFilters = [...(chart.drilldownFilters || []), { level: newDrilldownLevel }];
        
        return {
          ...chart,
          fullScreen: true,
          drilldownLevel: newDrilldownLevel,
          drilldownFilters: newDrilldownFilters
        };
      }
      return chart;
    }));
  };

  // Handle chart return from drill down
  const handleChartReturn = (chartId: string) => {
    setCharts(prevCharts => prevCharts.map(chart => {
      if (chart.id === chartId) {
        const newDrilldownLevel = Math.max(0, (chart.drilldownLevel || 0) - 1);
        const newDrilldownFilters = chart.drilldownFilters 
          ? chart.drilldownFilters.slice(0, newDrilldownLevel)
          : [];
        
        return {
          ...chart,
          fullScreen: newDrilldownLevel > 0,
          drilldownLevel: newDrilldownLevel,
          drilldownFilters: newDrilldownFilters
        };
      }
      return chart;
    }));
  };

  // Handle full screen toggle
  const handleFullScreenToggle = (chartId: string) => {
    setCharts(prevCharts => prevCharts.map(chart => {
      if (chart.id === chartId) {
        return {
          ...chart,
          fullScreen: !chart.fullScreen
        };
      }
      // Close other fullscreen charts
      if (chart.fullScreen) {
        return {
          ...chart,
          fullScreen: false
        };
      }
      return chart;
    }));
  };

  // Render chart
  const renderChart = (chart: ChartData) => {
    if (chart.isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      );
    }

    if (chart.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <AlertTriangle className="w-8 h-8 text-red-500 mr-2" />
          <span className="text-red-500">Failed to load chart data</span>
        </div>
      );
    }

    switch (chart.type) {
      case 'line':
        return <Line data={chart.data} options={chart.options} />;
      case 'bar':
        return <Bar data={chart.data} options={chart.options} />;
      case 'doughnut':
        return <Doughnut data={chart.data} options={chart.options} />;
      case 'radar':
        return <Radar data={chart.data} options={chart.options} />;
      default:
        return null;
    }
  };

  return (
    <div className={`w-full h-full ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Dashboard Header */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Real-Time Analytics Dashboard</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Time Range Selector */}
            <div className={`inline-flex rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              {(['24h', '7d', '30d', '90d'] as const).map(range => (
                <button
                  key={range}
                  className={`px-3 py-2 text-sm font-medium ${
                    timeRange === range 
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-200'
                  } ${range === '24h' ? 'rounded-l-md' : ''} ${range === '90d' ? 'rounded-r-md' : ''}`}
                  onClick={() => handleTimeRangeChange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            
            {/* Refresh Button */}
            <button
              className={`p-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`m-4 p-4 rounded-md ${theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {metrics.map(metric => (
          <div 
            key={metric.id}
            className={`p-4 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {metric.title}
                </p>
                <div className="flex items-end mt-1">
                  <span className="text-2xl font-semibold">
                    {metric.value.toLocaleString()}
                  </span>
                  {metric.unit && (
                    <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {metric.unit}
                    </span>
                  )}
                </div>
              </div>
              <div className={`p-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {metric.icon}
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {metric.changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : metric.changeType === 'negative' ? (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              ) : (
                <div className="w-4 h-4 mr-1" />
              )}
              <span className={`text-sm ${
                metric.changeType === 'positive' 
                  ? 'text-green-500' 
                  : metric.changeType === 'negative'
                    ? 'text-red-500'
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
              <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                vs previous
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {charts.filter(chart => !chart.fullScreen).map(chart => (
            <div 
              key={chart.id}
              className={`rounded-lg p-4 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{chart.title}</h3>
                <div className="flex items-center space-x-1">
                  <button
                    className={`p-1 rounded-md ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => handleChartDrilldown(chart.id)}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-1 rounded-md ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => handleFullScreenToggle(chart.id)}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="h-64">
                {renderChart(chart)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Chart */}
      {charts.find(chart => chart.fullScreen) && (
        <div className={`fixed inset-0 z-50 ${
          theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'
        } flex items-center justify-center p-4`}>
          <div className={`w-full max-w-5xl rounded-lg p-6 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-lg'
          }`}>
            {charts.filter(chart => chart.fullScreen).map(chart => (
              <div key={chart.id} className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium">{chart.title}</h3>
                    {chart.drilldownLevel && chart.drilldownLevel > 0 && (
                      <div className="flex items-center mt-1">
                        <button 
                          className={`text-sm flex items-center ${
                            theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                          }`}
                          onClick={() => handleChartReturn(chart.id)}
                        >
                          <ChevronDown className="w-4 h-4 mr-1 transform rotate-90" />
                          Back
                        </button>
                        <span className={`text-sm ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Drill-down level: {chart.drilldownLevel}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    className={`p-2 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleFullScreenToggle(chart.id)}
                  >
                    Close
                  </button>
                </div>
                <div className="h-[70vh]">
                  {renderChart(chart)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeMetricsDashboard; 