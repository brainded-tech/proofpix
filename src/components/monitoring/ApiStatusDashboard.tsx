import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Zap,
  Server
} from 'lucide-react';
import { apiMonitor, performanceMonitor, errorTracker } from '../../utils/monitoring';

interface ApiStatusDashboardProps {
  className?: string;
  compact?: boolean;
}

export const ApiStatusDashboard: React.FC<ApiStatusDashboardProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const [metrics, setMetrics] = useState(apiMonitor.getMetrics());
  const [performanceStats, setPerformanceStats] = useState(performanceMonitor.getStats());
  const [errorStats, setErrorStats] = useState(errorTracker.getErrorStats());
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Start monitoring when component mounts
    apiMonitor.startMonitoring(30000); // Check every 30 seconds
    setIsMonitoring(true);

    // Listen for monitoring updates
    const handleMonitoringUpdate = (event: string, data: any) => {
      setMetrics(data);
      setPerformanceStats(performanceMonitor.getStats());
      setErrorStats(errorTracker.getErrorStats());
    };

    apiMonitor.addEventListener(handleMonitoringUpdate);

    // Cleanup on unmount
    return () => {
      apiMonitor.removeEventListener(handleMonitoringUpdate);
      apiMonitor.stopMonitoring();
      setIsMonitoring(false);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'unhealthy': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5" />;
      case 'unhealthy': return <AlertTriangle className="h-5 w-5" />;
      case 'error': return <XCircle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className={`flex items-center space-x-2 ${getStatusColor(metrics.status)}`}>
          {getStatusIcon(metrics.status)}
          <span className="text-sm font-medium">
            API {metrics.status === 'healthy' ? 'Online' : 'Offline'}
          </span>
        </div>
        
        {metrics.responseTime > 0 && (
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{metrics.responseTime}ms</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">API Status</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-600">
            {isMonitoring ? 'Monitoring' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className={`flex items-center space-x-2 mb-2 ${getStatusColor(metrics.status)}`}>
            {getStatusIcon(metrics.status)}
            <span className="font-medium">Status</span>
          </div>
          <p className="text-sm text-gray-600 capitalize">{metrics.status}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2 text-blue-500">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Response Time</span>
          </div>
          <p className="text-sm text-gray-600">
            {metrics.responseTime > 0 ? `${metrics.responseTime}ms` : 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2 text-green-500">
            <Server className="h-5 w-5" />
            <span className="font-medium">Uptime</span>
          </div>
          <p className="text-sm text-gray-600">
            {metrics.uptime > 0 ? formatUptime(metrics.uptime) : 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2 text-purple-500">
            <Zap className="h-5 w-5" />
            <span className="font-medium">Version</span>
          </div>
          <p className="text-sm text-gray-600">{metrics.version || 'Unknown'}</p>
        </div>
      </div>

      {/* Performance Stats */}
      {performanceStats && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Success Rate</span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-900">
                {performanceStats.successRate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900">Avg Response</span>
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-lg font-bold text-green-900">
                {Math.round(performanceStats.averageResponseTime)}ms
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-900">Total Calls</span>
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-lg font-bold text-purple-900">
                {performanceStats.totalCalls}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Stats */}
      {errorStats && errorStats.totalErrors > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Errors</h4>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-900">Recent Issues</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-red-700">Last Hour:</span>
                <span className="font-medium ml-1">{errorStats.lastHour}</span>
              </div>
              <div>
                <span className="text-red-700">Last 24h:</span>
                <span className="font-medium ml-1">{errorStats.last24Hours}</span>
              </div>
              <div>
                <span className="text-red-700">Total:</span>
                <span className="font-medium ml-1">{errorStats.totalErrors}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Check */}
      {metrics.lastCheck && (
        <div className="text-xs text-gray-500">
          Last checked: {new Date(metrics.lastCheck).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ApiStatusDashboard; 