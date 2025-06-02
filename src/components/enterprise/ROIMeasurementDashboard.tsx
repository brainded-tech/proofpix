import React, { useState, useEffect } from 'react';
import { industryAIPackagesService, ROIMetric, BenchmarkData } from '../../services/industryAIPackagesService';

interface ExtendedROIMetric extends ROIMetric {
  status?: 'on-track' | 'needs-attention' | 'critical';
  trend?: 'improving' | 'declining' | 'stable';
  projected?: number;
}

interface ROIData {
  totalROI: number;
  breakdown: ExtendedROIMetric[];
  projections: any[];
  benchmarks: BenchmarkData[];
}

interface ROIProgress {
  currentMetrics: ExtendedROIMetric[];
  trends: any[];
  alerts: any[];
  recommendations: string[];
}

const ROIMeasurementDashboard: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>('healthcare-ai');
  const [timeframe, setTimeframe] = useState<string>('6-months');
  const [roiData, setROIData] = useState<ROIData | null>(null);
  const [roiProgress, setROIProgress] = useState<ROIProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'benchmarks' | 'projections'>('overview');

  const companyMetrics = {
    size: 'large',
    employees: 5000,
    monthlyDocuments: 50000,
    currentProcessingTime: 120,
    currentAccuracy: 85,
    currentCosts: 250000
  };

  useEffect(() => {
    loadROIData();
    loadROIProgress();
  }, [selectedPackage, timeframe]);

  const loadROIData = async () => {
    setLoading(true);
    try {
      const data = await industryAIPackagesService.calculateROI(
        selectedPackage,
        companyMetrics,
        timeframe
      );
      setROIData(data as ROIData);
    } catch (error) {
      console.error('Error loading ROI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadROIProgress = async () => {
    try {
      const progress = await industryAIPackagesService.trackROIProgress(
        selectedPackage,
        'current-user'
      );
      setROIProgress(progress as ROIProgress);
    } catch (error) {
      console.error('Error loading ROI progress:', error);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getMetricStatusColor = (status: string): string => {
    switch (status) {
      case 'on-track': return '#10B981';
      case 'needs-attention': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  // Mock data for demonstration
  const mockMetrics: ExtendedROIMetric[] = [
    {
      id: 'processing-time',
      name: 'Document Processing Time',
      category: 'efficiency',
      baseline: 120,
      target: 20,
      current: 45,
      unit: 'minutes',
      timeframe: '6 months',
      calculationMethod: 'Average processing time',
      benchmarkData: [],
      trackingFrequency: 'daily',
      status: 'on-track',
      trend: 'improving'
    },
    {
      id: 'accuracy',
      name: 'Processing Accuracy',
      category: 'accuracy',
      baseline: 85,
      target: 95,
      current: 92,
      unit: '%',
      timeframe: '6 months',
      calculationMethod: 'Accuracy percentage',
      benchmarkData: [],
      trackingFrequency: 'daily',
      status: 'on-track',
      trend: 'improving'
    },
    {
      id: 'cost-per-doc',
      name: 'Cost per Document',
      category: 'cost-savings',
      baseline: 8.5,
      target: 3.0,
      current: 5.2,
      unit: '$',
      timeframe: '6 months',
      calculationMethod: 'Total cost divided by documents',
      benchmarkData: [],
      trackingFrequency: 'weekly',
      status: 'needs-attention',
      trend: 'stable'
    }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total ROI</p>
              <p className="text-3xl font-bold text-green-600">285%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <span>↗️ +15% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost Savings</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(355000)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">💵</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-blue-600">
              <span>↗️ +8% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Efficiency Gain</p>
              <p className="text-3xl font-bold text-purple-600">78%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-purple-600">
              <span>↗️ +12% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payback Period</p>
              <p className="text-3xl font-bold text-orange-600">4.2</p>
              <p className="text-sm text-gray-500">months</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-orange-600">
              <span>↘️ -0.8 months improved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">92%</div>
            <div className="text-sm text-gray-600">Processing Accuracy</div>
            <div className="text-xs text-green-600">+7% improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">65%</div>
            <div className="text-sm text-gray-600">Time Reduction</div>
            <div className="text-xs text-green-600">+12% improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">98.5%</div>
            <div className="text-sm text-gray-600">Compliance Score</div>
            <div className="text-xs text-green-600">+2.5% improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">45K</div>
            <div className="text-sm text-gray-600">Documents/Month</div>
            <div className="text-xs text-green-600">+18% increase</div>
          </div>
        </div>
      </div>

      {/* ROI Trend Visualization */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">ROI Trend Analysis</h3>
        <div className="grid grid-cols-6 gap-4 mb-4">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
            const roiValues = [150, 175, 190, 210, 235, 260];
            const targetValues = [200, 200, 200, 200, 200, 200];
            return (
              <div key={month} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">{month}</div>
                <div className="relative h-32 bg-gray-100 rounded">
                  <div 
                    className="absolute bottom-0 w-full bg-blue-500 rounded"
                    style={{ height: `${(roiValues[index] / 300) * 100}%` }}
                  />
                  <div 
                    className="absolute w-full border-t-2 border-dashed border-green-500"
                    style={{ bottom: `${(targetValues[index] / 300) * 100}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-blue-600 mt-1">{roiValues[index]}%</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Actual ROI</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 border-t-2 border-dashed border-green-500"></div>
            <span>Target ROI</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetricsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMetrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">{metric.name}</h4>
              <span className="text-2xl">{getTrendIcon(metric.trend || 'stable')}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current</span>
                <span className="font-bold text-lg">
                  {metric.current} {metric.unit}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target</span>
                <span className="font-medium text-green-600">
                  {metric.target} {metric.unit}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Baseline</span>
                <span className="font-medium text-gray-500">
                  {metric.baseline} {metric.unit}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress to Target</span>
                <span>{Math.min(100, ((metric.current - metric.baseline) / (metric.target - metric.baseline)) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, ((metric.current - metric.baseline) / (metric.target - metric.baseline)) * 100)}%`
                  }}
                />
              </div>
            </div>

            <div className="mt-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  metric.status === 'on-track'
                    ? 'bg-green-100 text-green-800'
                    : metric.status === 'needs-attention'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {metric.status?.replace('-', ' ').toUpperCase() || 'STABLE'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Recommendations</h3>
        <div className="space-y-3">
          {[
            'Optimize processing workflows to reduce cost per document by 15%',
            'Increase automation coverage to improve efficiency gains',
            'Implement advanced quality checks to boost accuracy to target levels'
          ].map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-600 text-lg">💡</span>
              <p className="text-sm text-blue-800">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBenchmarksTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Industry Benchmarks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { metric: 'Processing Speed', value: 85, percentile: 75, industry: 'Healthcare' },
            { metric: 'Accuracy Rate', value: 92, percentile: 80, industry: 'Healthcare' },
            { metric: 'Cost Reduction', value: 35, percentile: 70, industry: 'Healthcare' },
            { metric: 'Compliance Score', value: 95, percentile: 85, industry: 'Healthcare' }
          ].map((benchmark, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4">{benchmark.metric}</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Your Score</span>
                  <span className="font-bold text-blue-600">{benchmark.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Industry Percentile</span>
                  <span className="font-bold text-green-600">{benchmark.percentile}th</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${benchmark.value}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">vs {benchmark.industry} Industry</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjectionsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Conservative Scenario</h4>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-red-600">355%</p>
            <p className="text-sm text-gray-600">12-month ROI</p>
            <p className="text-xs text-gray-500">
              Assumes minimal adoption and slower implementation
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Investment Recovery</span>
              <span className="font-medium">8.5 months</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Annual Savings</span>
              <span className="font-medium">{formatCurrency(890000)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Realistic Scenario</h4>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-blue-600">440%</p>
            <p className="text-sm text-gray-600">12-month ROI</p>
            <p className="text-xs text-gray-500">
              Based on current trends and industry averages
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Investment Recovery</span>
              <span className="font-medium">6.8 months</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Annual Savings</span>
              <span className="font-medium">{formatCurrency(1100000)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Optimistic Scenario</h4>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-green-600">600%</p>
            <p className="text-sm text-gray-600">12-month ROI</p>
            <p className="text-xs text-gray-500">
              Assumes full adoption and optimal implementation
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Investment Recovery</span>
              <span className="font-medium">5.0 months</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Annual Savings</span>
              <span className="font-medium">{formatCurrency(1500000)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projection Timeline */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">12-Month ROI Projection</h3>
        <div className="grid grid-cols-12 gap-2">
          {Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const conservative = 100 + (month * 21);
            const realistic = 100 + (month * 28);
            const optimistic = 100 + (month * 42);
            
            return (
              <div key={month} className="text-center">
                <div className="text-xs text-gray-600 mb-2">M{month}</div>
                <div className="relative h-24 bg-gray-100 rounded">
                  <div 
                    className="absolute bottom-0 w-full bg-red-300 rounded"
                    style={{ height: `${(conservative / 600) * 100}%` }}
                  />
                  <div 
                    className="absolute bottom-0 w-full bg-blue-400 rounded opacity-75"
                    style={{ height: `${(realistic / 600) * 100}%` }}
                  />
                  <div 
                    className="absolute bottom-0 w-full bg-green-500 rounded opacity-50"
                    style={{ height: `${(optimistic / 600) * 100}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-green-600 mt-1">{optimistic}%</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center space-x-6 text-sm mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-300 rounded"></div>
            <span>Conservative</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span>Realistic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Optimistic</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ROI Measurement Dashboard</h1>
          <p className="text-gray-600">
            Track and analyze return on investment for your AI packages
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select AI Package
              </label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="healthcare-ai">Healthcare AI Suite</option>
                <option value="finance-ai">Financial Services AI Suite</option>
                <option value="legal-ai">Legal AI Suite</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadROIData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'metrics', name: 'Metrics', icon: '📈' },
                { id: 'benchmarks', name: 'Benchmarks', icon: '🎯' },
                { id: 'projections', name: 'Projections', icon: '🔮' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'metrics' && renderMetricsTab()}
          {activeTab === 'benchmarks' && renderBenchmarksTab()}
          {activeTab === 'projections' && renderProjectionsTab()}
        </div>
      </div>
    </div>
  );
};

export default ROIMeasurementDashboard; 