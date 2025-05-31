// Performance Monitor - Real-time Performance Tracking
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
  BarChart3,
  Monitor,
  Wifi,
  Database
} from 'lucide-react';

interface PerformanceMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
  };
  processing: {
    averageTime: number;
    queueLength: number;
    throughput: number;
    errorRate: number;
  };
  system: {
    uptime: number;
    loadAverage: number[];
    processCount: number;
  };
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  metric: string;
  message: string;
  timestamp: Date;
  threshold: number;
  currentValue: number;
}

interface PerformanceThresholds {
  cpu: { warning: number; critical: number };
  memory: { warning: number; critical: number };
  storage: { warning: number; critical: number };
  processing: { warning: number; critical: number };
  errorRate: { warning: number; critical: number };
}

const defaultThresholds: PerformanceThresholds = {
  cpu: { warning: 70, critical: 90 },
  memory: { warning: 80, critical: 95 },
  storage: { warning: 85, critical: 95 },
  processing: { warning: 5000, critical: 10000 }, // milliseconds
  errorRate: { warning: 5, critical: 10 } // percentage
};

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [thresholds, setThresholds] = useState<PerformanceThresholds>(defaultThresholds);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealTime, setIsRealTime] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Simulate performance data collection
  const collectMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    // In a real implementation, this would call actual system APIs
    return {
      cpu: {
        usage: Math.random() * 100,
        cores: 8,
        temperature: 45 + Math.random() * 20
      },
      memory: {
        used: 6.4 + Math.random() * 2,
        total: 16,
        percentage: (6.4 + Math.random() * 2) / 16 * 100
      },
      storage: {
        used: 250 + Math.random() * 50,
        total: 512,
        percentage: (250 + Math.random() * 50) / 512 * 100
      },
      network: {
        downloadSpeed: 50 + Math.random() * 50,
        uploadSpeed: 10 + Math.random() * 20,
        latency: 10 + Math.random() * 40
      },
      processing: {
        averageTime: 1000 + Math.random() * 3000,
        queueLength: Math.floor(Math.random() * 20),
        throughput: 50 + Math.random() * 100,
        errorRate: Math.random() * 5
      },
      system: {
        uptime: Date.now() - (Math.random() * 86400000 * 7), // Up to 7 days
        loadAverage: [
          Math.random() * 4,
          Math.random() * 4,
          Math.random() * 4
        ],
        processCount: 150 + Math.floor(Math.random() * 50)
      }
    };
  }, []);

  // Check for threshold violations and generate alerts
  const checkThresholds = useCallback((newMetrics: PerformanceMetrics) => {
    const newAlerts: PerformanceAlert[] = [];

    // CPU check
    if (newMetrics.cpu.usage > thresholds.cpu.critical) {
      newAlerts.push({
        id: `cpu-${Date.now()}`,
        type: 'error',
        metric: 'CPU Usage',
        message: `CPU usage is critically high at ${newMetrics.cpu.usage.toFixed(1)}%`,
        timestamp: new Date(),
        threshold: thresholds.cpu.critical,
        currentValue: newMetrics.cpu.usage
      });
    } else if (newMetrics.cpu.usage > thresholds.cpu.warning) {
      newAlerts.push({
        id: `cpu-${Date.now()}`,
        type: 'warning',
        metric: 'CPU Usage',
        message: `CPU usage is high at ${newMetrics.cpu.usage.toFixed(1)}%`,
        timestamp: new Date(),
        threshold: thresholds.cpu.warning,
        currentValue: newMetrics.cpu.usage
      });
    }

    // Memory check
    if (newMetrics.memory.percentage > thresholds.memory.critical) {
      newAlerts.push({
        id: `memory-${Date.now()}`,
        type: 'error',
        metric: 'Memory Usage',
        message: `Memory usage is critically high at ${newMetrics.memory.percentage.toFixed(1)}%`,
        timestamp: new Date(),
        threshold: thresholds.memory.critical,
        currentValue: newMetrics.memory.percentage
      });
    } else if (newMetrics.memory.percentage > thresholds.memory.warning) {
      newAlerts.push({
        id: `memory-${Date.now()}`,
        type: 'warning',
        metric: 'Memory Usage',
        message: `Memory usage is high at ${newMetrics.memory.percentage.toFixed(1)}%`,
        timestamp: new Date(),
        threshold: thresholds.memory.warning,
        currentValue: newMetrics.memory.percentage
      });
    }

    // Processing time check
    if (newMetrics.processing.averageTime > thresholds.processing.critical) {
      newAlerts.push({
        id: `processing-${Date.now()}`,
        type: 'error',
        metric: 'Processing Time',
        message: `Processing time is critically slow at ${newMetrics.processing.averageTime.toFixed(0)}ms`,
        timestamp: new Date(),
        threshold: thresholds.processing.critical,
        currentValue: newMetrics.processing.averageTime
      });
    } else if (newMetrics.processing.averageTime > thresholds.processing.warning) {
      newAlerts.push({
        id: `processing-${Date.now()}`,
        type: 'warning',
        metric: 'Processing Time',
        message: `Processing time is slow at ${newMetrics.processing.averageTime.toFixed(0)}ms`,
        timestamp: new Date(),
        threshold: thresholds.processing.warning,
        currentValue: newMetrics.processing.averageTime
      });
    }

    // Error rate check
    if (newMetrics.processing.errorRate > thresholds.errorRate.critical) {
      newAlerts.push({
        id: `error-${Date.now()}`,
        type: 'error',
        metric: 'Error Rate',
        message: `Error rate is critically high at ${newMetrics.processing.errorRate.toFixed(1)}%`,
        timestamp: new Date(),
        threshold: thresholds.errorRate.critical,
        currentValue: newMetrics.processing.errorRate
      });
    } else if (newMetrics.processing.errorRate > thresholds.errorRate.warning) {
      newAlerts.push({
        id: `error-${Date.now()}`,
        type: 'warning',
        metric: 'Error Rate',
        message: `Error rate is high at ${newMetrics.processing.errorRate.toFixed(1)}%`,
        timestamp: new Date(),
        threshold: thresholds.errorRate.warning,
        currentValue: newMetrics.processing.errorRate
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 50)); // Keep last 50 alerts
    }
  }, [thresholds]);

  // Update metrics
  const updateMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const newMetrics = await collectMetrics();
      setMetrics(newMetrics);
      setLastUpdate(new Date());
      checkThresholds(newMetrics);
    } catch (error) {
      console.error('Failed to collect performance metrics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [collectMetrics, checkThresholds]);

  // Real-time updates
  useEffect(() => {
    updateMetrics();
    
    if (isRealTime) {
      const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [updateMetrics, isRealTime]);

  // Format uptime
  const formatUptime = (uptime: number): string => {
    const seconds = Math.floor((Date.now() - uptime) / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Format file size
  const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Get status color based on percentage and thresholds
  const getStatusColor = (value: number, warning: number, critical: number): string => {
    if (value >= critical) return 'text-red-600 dark:text-red-400';
    if (value >= warning) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  // Export performance report
  const exportReport = useCallback(() => {
    if (!metrics) return;

    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      alerts: alerts.slice(0, 10),
      thresholds
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [metrics, alerts, thresholds]);

  if (isLoading && !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading performance metrics...</p>
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
              <Monitor className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Performance Monitor
              </h1>
              {lastUpdate && (
                <span className="ml-4 text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsRealTime(!isRealTime)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRealTime
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {isRealTime ? 'Real-time ON' : 'Real-time OFF'}
              </button>
              
              <button
                onClick={exportReport}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2 inline" />
                Export
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
              
              <button
                onClick={updateMetrics}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Active Alerts ({alerts.length})
            </h2>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.type === 'error'
                      ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                      : alert.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                      : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-center">
                    {alert.type === 'error' ? (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${
                        alert.type === 'error'
                          ? 'text-red-800 dark:text-red-200'
                          : alert.type === 'warning'
                          ? 'text-yellow-800 dark:text-yellow-200'
                          : 'text-blue-800 dark:text-blue-200'
                      }`}>
                        {alert.message}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* CPU Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Cpu className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    CPU Usage
                  </h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Usage</span>
                  <span className={`text-sm font-medium ${getStatusColor(
                    metrics.cpu.usage,
                    thresholds.cpu.warning,
                    thresholds.cpu.critical
                  )}`}>
                    {metrics.cpu.usage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metrics.cpu.usage >= thresholds.cpu.critical
                        ? 'bg-red-600'
                        : metrics.cpu.usage >= thresholds.cpu.warning
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(metrics.cpu.usage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Cores: {metrics.cpu.cores}</span>
                  {metrics.cpu.temperature && (
                    <span>Temp: {metrics.cpu.temperature.toFixed(1)}°C</span>
                  )}
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <HardDrive className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Memory
                  </h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                  <span className={`text-sm font-medium ${getStatusColor(
                    metrics.memory.percentage,
                    thresholds.memory.warning,
                    thresholds.memory.critical
                  )}`}>
                    {metrics.memory.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metrics.memory.percentage >= thresholds.memory.critical
                        ? 'bg-red-600'
                        : metrics.memory.percentage >= thresholds.memory.warning
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(metrics.memory.percentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatBytes(metrics.memory.used * 1024 * 1024 * 1024)} / {formatBytes(metrics.memory.total * 1024 * 1024 * 1024)}
                </div>
              </div>
            </div>

            {/* Storage Usage */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Database className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Storage
                  </h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                  <span className={`text-sm font-medium ${getStatusColor(
                    metrics.storage.percentage,
                    thresholds.storage.warning,
                    thresholds.storage.critical
                  )}`}>
                    {metrics.storage.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metrics.storage.percentage >= thresholds.storage.critical
                        ? 'bg-red-600'
                        : metrics.storage.percentage >= thresholds.storage.warning
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(metrics.storage.percentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatBytes(metrics.storage.used * 1024 * 1024 * 1024)} / {formatBytes(metrics.storage.total * 1024 * 1024 * 1024)}
                </div>
              </div>
            </div>

            {/* Network Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Wifi className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Network
                  </h3>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Download</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {metrics.network.downloadSpeed.toFixed(1)} Mbps
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Upload</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {metrics.network.uploadSpeed.toFixed(1)} Mbps
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Latency</span>
                  <span className={`text-sm font-medium ${
                    metrics.network.latency > 100 ? 'text-red-600 dark:text-red-400' :
                    metrics.network.latency > 50 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {metrics.network.latency.toFixed(0)}ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Processing Performance
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {metrics.processing.averageTime.toFixed(0)}ms
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Processing Time</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {metrics.processing.throughput.toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Files/Hour</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {metrics.processing.queueLength}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Queue Length</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {metrics.processing.errorRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Error Rate</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                System Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatUptime(metrics.system.uptime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Load Average</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {metrics.system.loadAverage.map(load => load.toFixed(2)).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Processes</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {metrics.system.processCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Alert Thresholds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CPU Warning (%)
                </label>
                <input
                  type="number"
                  value={thresholds.cpu.warning}
                  onChange={(e) => setThresholds(prev => ({
                    ...prev,
                    cpu: { ...prev.cpu, warning: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CPU Critical (%)
                </label>
                <input
                  type="number"
                  value={thresholds.cpu.critical}
                  onChange={(e) => setThresholds(prev => ({
                    ...prev,
                    cpu: { ...prev.cpu, critical: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Memory Warning (%)
                </label>
                <input
                  type="number"
                  value={thresholds.memory.warning}
                  onChange={(e) => setThresholds(prev => ({
                    ...prev,
                    memory: { ...prev.memory, warning: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Memory Critical (%)
                </label>
                <input
                  type="number"
                  value={thresholds.memory.critical}
                  onChange={(e) => setThresholds(prev => ({
                    ...prev,
                    memory: { ...prev.memory, critical: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
