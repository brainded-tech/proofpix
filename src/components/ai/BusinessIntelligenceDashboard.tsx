import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, 
  BarChart3, PieChart, Activity, AlertTriangle,
  Target, Brain, Zap, Calendar, Download,
  RefreshCw, Filter, Settings
} from 'lucide-react';
import { useCustomerBehavior, usePerformanceForecast, useBusinessMetrics } from '../../hooks/useBusinessIntelligence';

interface KPICard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface ForecastData {
  date: string;
  predicted: number;
  confidence: number;
  actual?: number;
}

interface CustomerSegment {
  segment: string;
  size: number;
  revenue: number;
  churnRate: number;
  growthPotential: number;
}

const BusinessIntelligenceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { analyzeCustomerBehavior, isLoading: customerLoading, data: customerData } = useCustomerBehavior();
  const { generateForecast, isLoading: forecastLoading, forecast } = usePerformanceForecast();
  const { getMetrics, isLoading: metricsLoading, metrics } = useBusinessMetrics();

  // Mock data for demonstration
  const [kpis] = useState<KPICard[]>([
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: 12.5,
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Active Customers',
      value: '8,432',
      change: 8.2,
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600'
    },
    {
      title: 'Processing Volume',
      value: '156K',
      change: -2.1,
      trend: 'down',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-orange-600'
    },
    {
      title: 'Churn Rate',
      value: '3.2%',
      change: -0.8,
      trend: 'up',
      icon: <TrendingDown className="w-6 h-6" />,
      color: 'text-red-600'
    }
  ]);

  const [forecastData] = useState<ForecastData[]>([
    { date: '2024-01', predicted: 180000, confidence: 0.92, actual: 175000 },
    { date: '2024-02', predicted: 195000, confidence: 0.89, actual: 192000 },
    { date: '2024-03', predicted: 210000, confidence: 0.87 },
    { date: '2024-04', predicted: 225000, confidence: 0.85 },
    { date: '2024-05', predicted: 240000, confidence: 0.83 },
    { date: '2024-06', predicted: 255000, confidence: 0.81 }
  ]);

  const [customerSegments] = useState<CustomerSegment[]>([
    { segment: 'Enterprise', size: 245, revenue: 1200000, churnRate: 2.1, growthPotential: 85 },
    { segment: 'SMB', size: 1850, revenue: 850000, churnRate: 4.5, growthPotential: 72 },
    { segment: 'Startup', size: 3200, revenue: 350000, churnRate: 8.2, growthPotential: 65 },
    { segment: 'Individual', size: 3137, revenue: 125000, churnRate: 12.5, growthPotential: 45 }
  ]);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange.replace('d', '')));
      
      await Promise.all([
        getMetrics({ start: startDate, end: endDate }),
        generateForecast('3_months', ['volume', 'revenue', 'quality'])
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className={kpi.color}>
                {kpi.icon}
              </div>
              {getTrendIcon(kpi.trend)}
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.title}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${getChangeColor(kpi.change)}`}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Forecast Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Forecast</h3>
          <div className="flex items-center space-x-2">
            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="volume">Processing Volume</option>
              <option value="revenue">Revenue</option>
              <option value="quality">Quality Score</option>
            </select>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Forecast visualization would appear here</p>
            <p className="text-xs text-gray-400 mt-1">Predicted growth: +15.2% over next 3 months</p>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">Customer Behavior Pattern</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Enterprise customers show 23% higher retention when using batch processing</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">Optimization Opportunity</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Processing efficiency can be improved by 18% with resource reallocation</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">Risk Alert</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">3 high-value customers at risk of churning in next 30 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Predictive Recommendations</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Scale Processing Capacity</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Expected 25% volume increase in Q2</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">Implement Quality Automation</p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">Potential 30% reduction in manual review time</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Customer Success Outreach</p>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Target 15 at-risk accounts for retention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomersTab = () => (
    <div className="space-y-6">
      {/* Customer Segments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Customer Segments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Segment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Size</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Churn Rate</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Growth Potential</th>
              </tr>
            </thead>
            <tbody>
              {customerSegments.map((segment, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">{segment.segment}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{segment.size.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">${(segment.revenue / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      segment.churnRate < 5 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      segment.churnRate < 10 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {segment.churnRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${segment.growthPotential}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{segment.growthPotential}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Churn Risk Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Churn Risk Analysis</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Churn risk visualization would appear here</p>
            <p className="text-xs text-gray-400 mt-1">High risk: 12 customers | Medium risk: 45 customers</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderForecastTab = () => (
    <div className="space-y-6">
      {/* Forecast Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Forecast Configuration</h3>
          <button 
            onClick={() => generateForecast('6_months', ['volume', 'revenue', 'quality'])}
            disabled={forecastLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {forecastLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            <span>Generate Forecast</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeframe</label>
            <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="1_month">1 Month</option>
              <option value="3_months">3 Months</option>
              <option value="6_months">6 Months</option>
              <option value="1_year">1 Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Metrics</label>
            <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="all">All Metrics</option>
              <option value="volume">Processing Volume</option>
              <option value="revenue">Revenue</option>
              <option value="quality">Quality Score</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confidence Level</label>
            <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="0.95">95%</option>
              <option value="0.90">90%</option>
              <option value="0.85">85%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forecast Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Forecast Results</h3>
        <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Advanced forecast visualization</p>
            <p className="text-xs text-gray-400 mt-2">Interactive charts with confidence intervals and scenario analysis</p>
          </div>
        </div>
      </div>

      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Volume Forecast</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">+18.5%</p>
          <p className="text-xs text-gray-500 mt-1">Expected growth over 6 months</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Revenue Forecast</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">$3.2M</p>
          <p className="text-xs text-gray-500 mt-1">Projected 6-month revenue</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quality Forecast</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">94.2%</p>
          <p className="text-xs text-gray-500 mt-1">Predicted quality score</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Intelligence</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Advanced analytics and predictive insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button 
                onClick={loadDashboardData}
                disabled={isRefreshing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'forecast', label: 'Forecast', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'customers' && renderCustomersTab()}
          {activeTab === 'forecast' && renderForecastTab()}
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelligenceDashboard; 