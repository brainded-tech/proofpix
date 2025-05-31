/**
 * Performance Optimization Dashboard - Priority 11
 * Real-time performance monitoring and optimization tools
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Activity, 
  Zap, 
  Database, 
  Server, 
  Monitor, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  Wifi,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Target,
  Gauge
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

interface PerformanceMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
    frequency: number;
  };
  memory: {
    used: number;
    total: number;
    available: number;
    percentage: number;
  };
  network: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    packetsLost: number;
  };
  storage: {
    used: number;
    total: number;
    readSpeed: number;
    writeSpeed: number;
  };
  application: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    activeUsers: number;
  };
  webVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
  };
}

interface OptimizationRecommendation {
  id: string;
  category: 'performance' | 'memory' | 'network' | 'storage' | 'code';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  solution: string;
  estimatedImprovement: string;
  implementationTime: string;
  autoFixAvailable: boolean;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

const PerformanceOptimizationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'optimization' | 'alerts' | 'settings'>('overview');
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoOptimization, setAutoOptimization] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [loading, setLoading] = useState(true);

  // Simulate real-time metrics collection
  const generateMockMetrics = useCallback((): PerformanceMetrics => {
    return {
      cpu: {
        usage: Math.random() * 100,
        cores: 8,
        temperature: 45 + Math.random() * 20,
        frequency: 2.4 + Math.random() * 1.6
      },
      memory: {
        used: 4 + Math.random() * 8,
        total: 16,
        available: 8 + Math.random() * 4,
        percentage: 25 + Math.random() * 50
      },
      network: {
        downloadSpeed: 50 + Math.random() * 100,
        uploadSpeed: 10 + Math.random() * 40,
        latency: 10 + Math.random() * 50,
        packetsLost: Math.random() * 2
      },
      storage: {
        used: 250 + Math.random() * 500,
        total: 1000,
        readSpeed: 100 + Math.random() * 400,
        writeSpeed: 80 + Math.random() * 320
      },
      application: {
        responseTime: 50 + Math.random() * 200,
        throughput: 100 + Math.random() * 500,
        errorRate: Math.random() * 5,
        activeUsers: 50 + Math.random() * 200
      },
      webVitals: {
        lcp: 1000 + Math.random() * 2000,
        fid: Math.random() * 100,
        cls: Math.random() * 0.25,
        fcp: 500 + Math.random() * 1500,
        ttfb: 100 + Math.random() * 400
      }
    };
  }, []);

  // Generate optimization recommendations
  const generateRecommendations = useCallback((metrics: PerformanceMetrics): OptimizationRecommendation[] => {
    const recs: OptimizationRecommendation[] = [];

    if (metrics.cpu.usage > 80) {
      recs.push({
        id: 'cpu-high',
        category: 'performance',
        severity: 'high',
        title: 'High CPU Usage Detected',
        description: `CPU usage is at ${metrics.cpu.usage.toFixed(1)}%, which may impact performance.`,
        impact: 'Slower response times and potential system instability',
        solution: 'Optimize CPU-intensive operations, implement caching, or scale horizontally',
        estimatedImprovement: '30-50% performance boost',
        implementationTime: '2-4 hours',
        autoFixAvailable: true
      });
    }

    if (metrics.memory.percentage > 85) {
      recs.push({
        id: 'memory-high',
        category: 'memory',
        severity: 'high',
        title: 'High Memory Usage',
        description: `Memory usage is at ${metrics.memory.percentage.toFixed(1)}% of available capacity.`,
        impact: 'Risk of memory leaks and application crashes',
        solution: 'Implement memory pooling, optimize data structures, clear unused objects',
        estimatedImprovement: '25-40% memory reduction',
        implementationTime: '1-3 hours',
        autoFixAvailable: true
      });
    }

    if (metrics.webVitals.lcp > 2500) {
      recs.push({
        id: 'lcp-slow',
        category: 'performance',
        severity: 'medium',
        title: 'Slow Largest Contentful Paint',
        description: `LCP is ${metrics.webVitals.lcp.toFixed(0)}ms, exceeding the 2.5s threshold.`,
        impact: 'Poor user experience and SEO ranking',
        solution: 'Optimize images, implement lazy loading, use CDN for static assets',
        estimatedImprovement: '40-60% faster page loads',
        implementationTime: '3-6 hours',
        autoFixAvailable: false
      });
    }

    if (metrics.application.errorRate > 2) {
      recs.push({
        id: 'error-rate-high',
        category: 'code',
        severity: 'critical',
        title: 'High Error Rate',
        description: `Application error rate is ${metrics.application.errorRate.toFixed(2)}%, above acceptable threshold.`,
        impact: 'User frustration and potential data loss',
        solution: 'Review error logs, implement better error handling, add monitoring',
        estimatedImprovement: '80-95% error reduction',
        implementationTime: '4-8 hours',
        autoFixAvailable: false
      });
    }

    return recs;
  }, []);

  // Generate performance alerts
  const generateAlerts = useCallback((metrics: PerformanceMetrics): PerformanceAlert[] => {
    const newAlerts: PerformanceAlert[] = [];

    if (metrics.cpu.usage > 90) {
      newAlerts.push({
        id: `alert-cpu-${Date.now()}`,
        type: 'error',
        metric: 'CPU Usage',
        value: metrics.cpu.usage,
        threshold: 90,
        message: 'Critical CPU usage detected',
        timestamp: new Date(),
        resolved: false
      });
    }

    if (metrics.network.latency > 100) {
      newAlerts.push({
        id: `alert-latency-${Date.now()}`,
        type: 'warning',
        metric: 'Network Latency',
        value: metrics.network.latency,
        threshold: 100,
        message: 'High network latency detected',
        timestamp: new Date(),
        resolved: false
      });
    }

    return newAlerts;
  }, []);

  // Update metrics periodically
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newMetrics = generateMockMetrics();
      setMetrics(newMetrics);
      
      const newRecommendations = generateRecommendations(newMetrics);
      setRecommendations(newRecommendations);
      
      const newAlerts = generateAlerts(newMetrics);
      setAlerts(prev => [...prev.slice(-10), ...newAlerts]); // Keep last 10 alerts
      
      // Track performance metrics
      analyticsService.trackPerformanceMetric('cpu_usage', newMetrics.cpu.usage);
      analyticsService.trackPerformanceMetric('memory_usage', newMetrics.memory.percentage);
      analyticsService.trackPerformanceMetric('response_time', newMetrics.application.responseTime);
      
      setLoading(false);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isMonitoring, refreshInterval, generateMockMetrics, generateRecommendations, generateAlerts]);

  // Performance score calculation
  const performanceScore = useMemo(() => {
    if (!metrics) return 0;
    
    const cpuScore = Math.max(0, 100 - metrics.cpu.usage);
    const memoryScore = Math.max(0, 100 - metrics.memory.percentage);
    const responseScore = Math.max(0, 100 - (metrics.application.responseTime / 10));
    const errorScore = Math.max(0, 100 - (metrics.application.errorRate * 20));
    
    return Math.round((cpuScore + memoryScore + responseScore + errorScore) / 4);
  }, [metrics]);

  // Auto-optimization handler
  const handleAutoOptimization = useCallback(async () => {
    if (!autoOptimization || !recommendations.length) return;

    const autoFixableRecs = recommendations.filter(rec => rec.autoFixAvailable);
    
    for (const rec of autoFixableRecs) {
      // Simulate auto-fix implementation
      console.log(`Auto-fixing: ${rec.title}`);
      analyticsService.trackEvent('Optimization', 'Auto Fix Applied', rec.category);
      
      // Remove the recommendation after auto-fix
      setRecommendations(prev => prev.filter(r => r.id !== rec.id));
    }
  }, [autoOptimization, recommendations]);

  useEffect(() => {
    handleAutoOptimization();
  }, [handleAutoOptimization]);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    unit?: string;
    icon: React.ReactNode;
    status: 'good' | 'warning' | 'critical';
    trend?: 'up' | 'down' | 'stable';
  }> = ({ title, value, unit, icon, status, trend }) => {
    const statusColors = {
      good: 'border-green-200 bg-green-50 text-green-800',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
      critical: 'border-red-200 bg-red-50 text-red-800'
    };

    const trendIcons = {
      up: <TrendingUp className="w-4 h-4 text-red-500" />,
      down: <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />,
      stable: <div className="w-4 h-4 border-b-2 border-gray-400" />
    };

    return (
      <div className={`p-4 rounded-lg border-2 ${statusColors[status]}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="font-medium text-sm">{title}</span>
          </div>
          {trend && trendIcons[trend]}
        </div>
        <div className="text-2xl font-bold">
          {value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Gauge className="w-8 h-8 mr-3 text-blue-600" />
            Performance Optimization Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time system monitoring and optimization</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Performance Score:</span>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
              performanceScore >= 80 ? 'bg-green-100 text-green-800' :
              performanceScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {performanceScore}/100
            </div>
          </div>
          
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isMonitoring 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Monitor },
            { id: 'metrics', label: 'Detailed Metrics', icon: BarChart3 },
            { id: 'optimization', label: 'Optimization', icon: Zap },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="CPU Usage"
              value={metrics.cpu.usage.toFixed(1)}
              unit="%"
              icon={<Cpu className="w-5 h-5" />}
              status={metrics.cpu.usage > 80 ? 'critical' : metrics.cpu.usage > 60 ? 'warning' : 'good'}
              trend={metrics.cpu.usage > 70 ? 'up' : 'stable'}
            />
            
            <MetricCard
              title="Memory Usage"
              value={metrics.memory.percentage.toFixed(1)}
              unit="%"
              icon={<HardDrive className="w-5 h-5" />}
              status={metrics.memory.percentage > 85 ? 'critical' : metrics.memory.percentage > 70 ? 'warning' : 'good'}
              trend={metrics.memory.percentage > 80 ? 'up' : 'stable'}
            />
            
            <MetricCard
              title="Response Time"
              value={metrics.application.responseTime.toFixed(0)}
              unit="ms"
              icon={<Clock className="w-5 h-5" />}
              status={metrics.application.responseTime > 200 ? 'critical' : metrics.application.responseTime > 100 ? 'warning' : 'good'}
              trend={metrics.application.responseTime > 150 ? 'up' : 'down'}
            />
            
            <MetricCard
              title="Active Users"
              value={metrics.application.activeUsers.toFixed(0)}
              icon={<Eye className="w-5 h-5" />}
              status="good"
              trend="up"
            />
          </div>

          {/* Web Vitals */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Core Web Vitals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.webVitals.lcp.toFixed(0)}ms</div>
                <div className="text-sm text-gray-600">LCP</div>
                <div className={`text-xs mt-1 ${metrics.webVitals.lcp <= 2500 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.webVitals.lcp <= 2500 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.webVitals.fid.toFixed(0)}ms</div>
                <div className="text-sm text-gray-600">FID</div>
                <div className={`text-xs mt-1 ${metrics.webVitals.fid <= 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.webVitals.fid <= 100 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.webVitals.cls.toFixed(3)}</div>
                <div className="text-sm text-gray-600">CLS</div>
                <div className={`text-xs mt-1 ${metrics.webVitals.cls <= 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.webVitals.cls <= 0.1 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.webVitals.fcp.toFixed(0)}ms</div>
                <div className="text-sm text-gray-600">FCP</div>
                <div className={`text-xs mt-1 ${metrics.webVitals.fcp <= 1800 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.webVitals.fcp <= 1800 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.webVitals.ttfb.toFixed(0)}ms</div>
                <div className="text-sm text-gray-600">TTFB</div>
                <div className={`text-xs mt-1 ${metrics.webVitals.ttfb <= 600 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.webVitals.ttfb <= 600 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <RefreshCw className="w-6 h-6 text-blue-600 mb-2" />
                <div className="font-medium">Clear Cache</div>
                <div className="text-sm text-gray-600">Clear application cache to improve performance</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Database className="w-6 h-6 text-green-600 mb-2" />
                <div className="font-medium">Optimize Database</div>
                <div className="text-sm text-gray-600">Run database optimization routines</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Server className="w-6 h-6 text-purple-600 mb-2" />
                <div className="font-medium">Restart Services</div>
                <div className="text-sm text-gray-600">Restart background services safely</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'optimization' && (
        <div className="space-y-6">
          {/* Auto-optimization Toggle */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Auto-Optimization</h3>
                <p className="text-gray-600">Automatically apply performance optimizations when detected</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoOptimization}
                  onChange={(e) => setAutoOptimization(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Optimization Recommendations</h3>
            {recommendations.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">No optimization recommendations at this time. Your system is performing well!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map(rec => (
                  <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            rec.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            rec.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {rec.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600">{rec.category}</span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                        <p className="text-gray-600 mb-3">{rec.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Impact:</span>
                            <p className="text-gray-600">{rec.impact}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Solution:</span>
                            <p className="text-gray-600">{rec.solution}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Estimated Improvement:</span>
                            <p className="text-gray-600">{rec.estimatedImprovement}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Implementation Time:</span>
                            <p className="text-gray-600">{rec.implementationTime}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col space-y-2">
                        {rec.autoFixAvailable && (
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            Auto Fix
                          </button>
                        )}
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Alerts</h3>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No active alerts. System is running smoothly!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice().reverse().map(alert => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{alert.metric}</span>
                        <span className="text-sm text-gray-600">
                          {alert.value.toFixed(1)} (threshold: {alert.threshold})
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Interval (seconds)
              </label>
              <select
                value={refreshInterval / 1000}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value) * 1000)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value={1}>1 second</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoOptimization}
                  onChange={(e) => setAutoOptimization(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Enable auto-optimization</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceOptimizationDashboard; 