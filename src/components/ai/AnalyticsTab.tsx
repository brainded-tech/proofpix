import React from 'react';
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react';

interface AnalyticsTabProps {
  processingMetrics: {
    totalProcessed: number;
    averageConfidence: number;
    processingSpeed: number;
    accuracyRate: number;
    fraudDetected: number;
    qualityImproved: number;
  };
  timeRange: string;
  setTimeRange: (range: '24h' | '7d' | '30d' | '90d') => void;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ 
  processingMetrics, 
  timeRange, 
  setTimeRange 
}) => {
  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-slate-100">
              {processingMetrics.totalProcessed.toLocaleString()}
            </span>
          </div>
          <h3 className="text-slate-400 text-sm">Documents Processed</h3>
          <p className="text-green-400 text-sm mt-1">+12% from last period</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold text-slate-100">
              {(processingMetrics.averageConfidence * 100).toFixed(1)}%
            </span>
          </div>
          <h3 className="text-slate-400 text-sm">Average Confidence</h3>
          <p className="text-green-400 text-sm mt-1">+2.3% from last period</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-slate-100">
              {processingMetrics.processingSpeed.toFixed(1)}s
            </span>
          </div>
          <h3 className="text-slate-400 text-sm">Avg Processing Time</h3>
          <p className="text-green-400 text-sm mt-1">-15% from last period</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-slate-100">
              {(processingMetrics.accuracyRate * 100).toFixed(1)}%
            </span>
          </div>
          <h3 className="text-slate-400 text-sm">Accuracy Rate</h3>
          <p className="text-green-400 text-sm mt-1">+1.8% from last period</p>
        </div>
      </div>

      {/* Processing Trends */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Processing Trends</h3>
        <div className="h-64 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Chart visualization would be rendered here</p>
            <p className="text-sm mt-2">Real-time processing analytics and trends</p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Quality Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">High Quality Documents</span>
              <span className="text-green-400 font-medium">{processingMetrics.qualityImproved}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Fraud Detected</span>
              <span className="text-red-400 font-medium">{processingMetrics.fraudDetected}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Processing Success Rate</span>
              <span className="text-green-400 font-medium">{(processingMetrics.accuracyRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Performance Optimization</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm font-medium">Optimization Suggestion</p>
              <p className="text-slate-300 text-sm mt-1">
                Consider batch processing for documents larger than 5MB to improve efficiency.
              </p>
            </div>
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm font-medium">Performance Improvement</p>
              <p className="text-slate-300 text-sm mt-1">
                OCR accuracy improved by 12% with recent model updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab; 