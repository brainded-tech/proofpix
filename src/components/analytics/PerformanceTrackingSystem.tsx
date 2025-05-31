import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Server, 
  HardDrive, 
  Database, 
  Clock, 
  Cpu, 
  BarChart, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  change: number;
  history: number[];
  thresholds: {
    warning: number;
    critical: number;
  };
}

interface SystemComponent {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'offline' | 'unknown';
  lastChecked: Date;
  responseTime?: number;
  metrics: SystemMetric[];
}

interface PerformanceTrackingProps {
  refreshInterval?: number; // in seconds
  theme?: 'light' | 'dark';
  compact?: boolean;
}

export const PerformanceTrackingSystem: React.FC<PerformanceTrackingProps> = ({
  refreshInterval = 30,
  theme = 'light',
  compact = false
}) => {
  // State for system components and metrics
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('1h');

  // Theme colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return theme === 'dark' ? 'text-green-400' : 'text-green-500';
      case 'warning':
      case 'degraded':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500';
      case 'critical':
      case 'offline':
        return theme === 'dark' ? 'text-red-400' : 'text-red-500';
      default:
        return theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100';
      case 'warning':
      case 'degraded':
        return theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-100';
      case 'critical':
      case 'offline':
        return theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100';
      default:
        return theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="w-5 h-5" />;
      case 'critical':
      case 'offline':
        return <XCircle className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  // Function to fetch system metrics data
  const fetchSystemMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // For demo purposes, we'll generate mock data
      const mockComponents: SystemComponent[] = [
        {
          id: 'api_server',
          name: 'API Server',
          status: 'healthy',
          lastChecked: new Date(),
          responseTime: 45,
          metrics: [
            {
              id: 'cpu_usage',
              name: 'CPU Usage',
              value: 32,
              unit: '%',
              status: 'healthy',
              change: -2.5,
              history: [28, 35, 32, 30, 34, 38, 32],
              thresholds: { warning: 70, critical: 90 }
            },
            {
              id: 'memory_usage',
              name: 'Memory Usage',
              value: 45,
              unit: '%',
              status: 'healthy',
              change: 5.3,
              history: [40, 42, 38, 45, 43, 44, 45],
              thresholds: { warning: 75, critical: 90 }
            },
            {
              id: 'request_rate',
              name: 'Request Rate',
              value: 234,
              unit: 'req/s',
              status: 'healthy',
              change: 12.7,
              history: [180, 210, 195, 220, 245, 230, 234],
              thresholds: { warning: 500, critical: 800 }
            }
          ]
        },
        {
          id: 'database',
          name: 'Database',
          status: 'healthy',
          lastChecked: new Date(),
          responseTime: 12,
          metrics: [
            {
              id: 'db_cpu',
              name: 'CPU Usage',
              value: 28,
              unit: '%',
              status: 'healthy',
              change: 1.2,
              history: [25, 27, 26, 28, 27, 29, 28],
              thresholds: { warning: 70, critical: 90 }
            },
            {
              id: 'db_memory',
              name: 'Memory Usage',
              value: 62,
              unit: '%',
              status: 'healthy',
              change: 3.5,
              history: [58, 60, 59, 61, 60, 62, 62],
              thresholds: { warning: 75, critical: 90 }
            },
            {
              id: 'db_connections',
              name: 'Active Connections',
              value: 42,
              unit: '',
              status: 'healthy',
              change: -3.8,
              history: [48, 45, 47, 44, 43, 45, 42],
              thresholds: { warning: 100, critical: 150 }
            },
            {
              id: 'db_latency',
              name: 'Query Latency',
              value: 25,
              unit: 'ms',
              status: 'healthy',
              change: -5.2,
              history: [30, 28, 32, 27, 26, 28, 25],
              thresholds: { warning: 100, critical: 200 }
            }
          ]
        },
        {
          id: 'storage',
          name: 'Storage Service',
          status: 'degraded',
          lastChecked: new Date(),
          responseTime: 85,
          metrics: [
            {
              id: 'disk_usage',
              name: 'Disk Usage',
              value: 78,
              unit: '%',
              status: 'warning',
              change: 8.4,
              history: [65, 68, 72, 74, 75, 76, 78],
              thresholds: { warning: 75, critical: 90 }
            },
            {
              id: 'io_throughput',
              name: 'I/O Throughput',
              value: 42,
              unit: 'MB/s',
              status: 'healthy',
              change: -2.1,
              history: [45, 48, 46, 44, 43, 40, 42],
              thresholds: { warning: 20, critical: 10 }
            },
            {
              id: 'storage_latency',
              name: 'Storage Latency',
              value: 120,
              unit: 'ms',
              status: 'warning',
              change: 25.3,
              history: [80, 85, 90, 95, 110, 115, 120],
              thresholds: { warning: 100, critical: 200 }
            }
          ]
        },
        {
          id: 'frontend',
          name: 'Frontend Service',
          status: 'healthy',
          lastChecked: new Date(),
          responseTime: 65,
          metrics: [
            {
              id: 'load_time',
              name: 'Page Load Time',
              value: 380,
              unit: 'ms',
              status: 'healthy',
              change: -12.5,
              history: [450, 430, 420, 400, 390, 385, 380],
              thresholds: { warning: 1000, critical: 2000 }
            },
            {
              id: 'error_rate',
              name: 'Client Error Rate',
              value: 0.8,
              unit: '%',
              status: 'healthy',
              change: -0.3,
              history: [1.5, 1.3, 1.2, 1.0, 0.9, 0.85, 0.8],
              thresholds: { warning: 5, critical: 10 }
            }
          ]
        }
      ];

      setComponents(mockComponents);
      setSelectedComponent(mockComponents[0].id);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch system metrics', error);
      setError('Failed to fetch system metrics. Please try again later.');
      setIsLoading(false);
    }
  }, []);

  // Initial load and refresh timer
  useEffect(() => {
    fetchSystemMetrics();
    
    const timer = setInterval(() => {
      fetchSystemMetrics();
    }, refreshInterval * 1000);
    
    return () => clearInterval(timer);
  }, [fetchSystemMetrics, refreshInterval]);

  // Get selected component data
  const selectedComponentData = selectedComponent
    ? components.find(c => c.id === selectedComponent)
    : null;

  // Calculate overall system health
  const calculateOverallHealth = () => {
    if (components.length === 0) return 'unknown';
    
    if (components.some(c => c.status === 'offline')) return 'critical';
    if (components.some(c => c.status === 'degraded')) return 'degraded';
    if (components.every(c => c.status === 'healthy')) return 'healthy';
    
    return 'degraded';
  };

  const overallHealth = calculateOverallHealth();

  // Prepare chart data for a selected metric
  const prepareChartData = (metric: SystemMetric) => {
    const labels = Array.from({ length: metric.history.length }, (_, i) => i + 1);
    
    return {
      labels,
      datasets: [
        {
          label: metric.name,
          data: metric.history,
          borderColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.8)',
          backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4
        },
        // Warning threshold line
        {
          label: 'Warning Threshold',
          data: Array(metric.history.length).fill(metric.thresholds.warning),
          borderColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(217, 119, 6, 0.8)',
          borderWidth: 1,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        },
        // Critical threshold line
        {
          label: 'Critical Threshold',
          data: Array(metric.history.length).fill(metric.thresholds.critical),
          borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(220, 38, 38, 0.8)',
          borderWidth: 1,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
          font: {
            family: 'Inter, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
        titleColor: theme === 'dark' ? '#f3f4f6' : '#111827',
        bodyColor: theme === 'dark' ? '#f3f4f6' : '#111827',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: theme === 'dark' ? '#f3f4f6' : '#111827'
        }
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: theme === 'dark' ? '#f3f4f6' : '#111827'
        }
      }
    }
  };

  // Loading state
  if (isLoading && components.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className={`w-8 h-8 animate-spin ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
      </div>
    );
  }

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">System Health & Performance</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Time Range Selector */}
            <div className={`inline-flex rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              {(['1h', '24h', '7d'] as const).map(range => (
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
                  } ${range === '1h' ? 'rounded-l-md' : ''} ${range === '7d' ? 'rounded-r-md' : ''}`}
                  onClick={() => setTimeRange(range)}
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
              onClick={() => fetchSystemMetrics()}
            >
              <RefreshCw className="w-5 h-5" />
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

      {/* Health Overview */}
      <div className="p-4">
        <div className={`p-4 rounded-lg ${getStatusBgColor(overallHealth)} mb-4`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} mr-3`}>
              {getStatusIcon(overallHealth)}
            </div>
            <div>
              <h3 className="text-lg font-medium">System Status: {overallHealth.charAt(0).toUpperCase() + overallHealth.slice(1)}</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {overallHealth === 'healthy' 
                  ? 'All systems operational' 
                  : overallHealth === 'degraded'
                    ? 'Some services are experiencing issues'
                    : overallHealth === 'critical'
                      ? 'Critical system issues detected'
                      : 'System status unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {components.map(component => (
            <div 
              key={component.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                component.id === selectedComponent
                  ? theme === 'dark' 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-blue-500 bg-blue-50'
                  : theme === 'dark'
                    ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
              onClick={() => setSelectedComponent(component.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{component.name}</h3>
                <span className={`flex items-center ${getStatusColor(component.status)}`}>
                  {getStatusIcon(component.status)}
                </span>
              </div>
              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Response Time: {component.responseTime}ms
              </p>
              <div className="grid grid-cols-2 gap-2">
                {component.metrics.slice(0, 2).map(metric => (
                  <div key={metric.id} className={`p-2 rounded ${getStatusBgColor(metric.status)}`}>
                    <p className="text-xs font-medium">{metric.name}</p>
                    <div className="flex items-end">
                      <span className="text-lg font-semibold">{metric.value}</span>
                      <span className="text-xs ml-1">{metric.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Component Details */}
        {selectedComponentData && (
          <div className={`rounded-lg border p-4 ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">{selectedComponentData.name} Details</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Last checked: {selectedComponentData.lastChecked.toLocaleTimeString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full flex items-center ${getStatusBgColor(selectedComponentData.status)}`}>
                {getStatusIcon(selectedComponentData.status)}
                <span className="ml-1 text-sm font-medium">
                  {selectedComponentData.status.charAt(0).toUpperCase() + selectedComponentData.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Metrics Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedComponentData.metrics.map(metric => (
                <div 
                  key={metric.id}
                  className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{metric.name}</h4>
                    <div className={`flex items-center ${
                      metric.change > 0 
                        ? 'text-red-500' 
                        : metric.change < 0 
                          ? 'text-green-500' 
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {metric.change > 0 ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : metric.change < 0 ? (
                        <ArrowUpRight className="w-4 h-4 mr-1 transform rotate-180" />
                      ) : null}
                      <span className="text-sm">
                        {Math.abs(metric.change)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold">{metric.value}</span>
                    <span className={`ml-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {metric.unit}
                    </span>
                  </div>
                  
                  <div className="h-40">
                    <Line data={prepareChartData(metric)} options={chartOptions} />
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className={`p-2 rounded ${theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                      <span className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}>
                        Warning: {metric.thresholds.warning}{metric.unit}
                      </span>
                    </div>
                    <div className={`p-2 rounded ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'}`}>
                      <span className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
                        Critical: {metric.thresholds.critical}{metric.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTrackingSystem; 