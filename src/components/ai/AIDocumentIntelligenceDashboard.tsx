import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Eye, 
  FileText, 
  Shield, 
  TrendingUp, 
  Zap, 
  Target, 
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Bot
} from 'lucide-react';
import {
  useOCR,
  useDocumentClassification,
  useFraudDetection,
  useQualityAssessment,
  usePredictiveAnalytics,
  useAIAnalytics,
  useAIModels,
  useAIConfiguration
} from '../../hooks/useAI';

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface ProcessingMetrics {
  totalProcessed: number;
  averageConfidence: number;
  processingSpeed: number;
  accuracyRate: number;
  fraudDetected: number;
  qualityImproved: number;
}

const AIDocumentIntelligenceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'insights' | 'analytics'>('overview');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  // AI Hooks
  const { analytics, getAIAnalytics, isLoading: analyticsLoading } = useAIAnalytics();
  const { models, getAvailableModels, isLoading: modelsLoading } = useAIModels();
  const { configuration, capabilities, isLoading: configLoading } = useAIConfiguration();

  // Mock data for demonstration
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'prediction',
      title: 'Processing Time Optimization',
      description: 'AI predicts 23% faster processing for batch operations during off-peak hours',
      confidence: 0.89,
      impact: 'high',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'alert',
      title: 'Fraud Pattern Detected',
      description: 'Unusual document patterns detected in recent uploads - review recommended',
      confidence: 0.94,
      impact: 'high',
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Quality Enhancement Available',
      description: 'AI suggests image enhancement for 15 documents to improve OCR accuracy',
      confidence: 0.76,
      impact: 'medium',
      timestamp: new Date()
    }
  ]);

  const [processingMetrics, setProcessingMetrics] = useState<ProcessingMetrics>({
    totalProcessed: 12847,
    averageConfidence: 0.94,
    processingSpeed: 2.3,
    accuracyRate: 0.96,
    fraudDetected: 23,
    qualityImproved: 156
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      try {
        await getAIAnalytics({ start: startDate, end: endDate });
      } catch (error) {
        console.error('Failed to fetch AI analytics:', error);
      }
    };

    fetchAnalytics();
  }, [timeRange, getAIAnalytics]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-slate-400">Total Processed</span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mb-1">
            {processingMetrics.totalProcessed.toLocaleString()}
          </div>
          <div className="text-sm text-green-400">+12% from last week</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mb-1">
            {(processingMetrics.averageConfidence * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-green-400">+2.3% improvement</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-slate-400">Processing Speed</span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mb-1">
            {processingMetrics.processingSpeed}s
          </div>
          <div className="text-sm text-green-400">-15% faster</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-xs text-slate-400">Fraud Detected</span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mb-1">
            {processingMetrics.fraudDetected}
          </div>
          <div className="text-sm text-red-400">+3 this week</div>
        </div>
      </div>

      {/* AI Capabilities Status */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-400" />
          AI Capabilities Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-3 text-blue-400" />
              <span className="text-slate-200">Computer Vision</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3 text-purple-400" />
              <span className="text-slate-200">Document Classification</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3 text-red-400" />
              <span className="text-slate-200">Fraud Detection</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-3 text-yellow-400" />
              <span className="text-slate-200">Predictive Analytics</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 mr-3 text-pink-400" />
              <span className="text-slate-200">Quality Enhancement</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-3 text-cyan-400" />
              <span className="text-slate-200">Smart Automation</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent AI Insights */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
          Recent AI Insights
        </h3>
        <div className="space-y-4">
          {insights.slice(0, 3).map((insight) => (
            <div key={insight.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  {insight.type === 'prediction' && <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />}
                  {insight.type === 'alert' && <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />}
                  {insight.type === 'recommendation' && <Target className="w-4 h-4 mr-2 text-green-400" />}
                  <span className="font-medium text-slate-200">{insight.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                    {(insight.confidence * 100).toFixed(0)}%
                  </span>
                  <span className={`text-xs ${getImpactColor(insight.impact)}`}>
                    {insight.impact}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModelsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <Layers className="w-5 h-5 mr-2 text-purple-400" />
          AI Models Performance
        </h3>
        
        {modelsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mock model data for demonstration */}
            {[
              { name: 'Document Classifier v2.1', type: 'classification', accuracy: 0.96, status: 'active' },
              { name: 'OCR Engine v3.0', type: 'ocr', accuracy: 0.94, status: 'active' },
              { name: 'Fraud Detector v1.8', type: 'fraud_detection', accuracy: 0.91, status: 'active' },
              { name: 'Quality Assessor v2.0', type: 'quality_assessment', accuracy: 0.89, status: 'active' }
            ].map((model, index) => (
              <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-200">{model.name}</h4>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    {model.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Accuracy</span>
                    <span className="text-slate-200">{(model.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${model.accuracy * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Type: {model.type}</span>
                    <span>Last updated: 2 days ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-400" />
          AI-Generated Insights
        </h3>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="p-6 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {insight.type === 'prediction' && <TrendingUp className="w-5 h-5 mr-3 text-blue-400" />}
                  {insight.type === 'alert' && <AlertTriangle className="w-5 h-5 mr-3 text-red-400" />}
                  {insight.type === 'recommendation' && <Target className="w-5 h-5 mr-3 text-green-400" />}
                  {insight.type === 'optimization' && <Zap className="w-5 h-5 mr-3 text-yellow-400" />}
                  <div>
                    <h4 className="font-medium text-slate-200">{insight.title}</h4>
                    <span className="text-xs text-slate-400 capitalize">{insight.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {(insight.confidence * 100).toFixed(0)}% confidence
                  </div>
                  <div className={`text-xs ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </div>
                </div>
              </div>
              <p className="text-slate-300 mb-3">{insight.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {insight.timestamp.toLocaleString()}
                </span>
                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
          AI Performance Analytics
        </h3>
        
        {analyticsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Processing Volume Chart */}
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-medium text-slate-200 mb-4">Processing Volume Trend</h4>
              <div className="h-48 flex items-end justify-between space-x-2">
                {[65, 78, 82, 91, 87, 94, 89].map((height, index) => (
                  <div key={index} className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t" 
                       style={{ height: `${height}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            {/* Accuracy Distribution */}
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-medium text-slate-200 mb-4">Accuracy Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">OCR</span>
                  <span className="text-sm text-slate-200">94.2%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Classification</span>
                  <span className="text-sm text-slate-200">96.1%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '96.1%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Fraud Detection</span>
                  <span className="text-sm text-slate-200">91.8%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '91.8%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                <Brain className="w-8 h-8 mr-3 text-blue-400" />
                AI Document Intelligence
              </h1>
              <p className="text-slate-400 mt-1">
                Advanced AI-powered document processing and analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-sm"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  realTimeEnabled 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <Activity className="w-4 h-4 mr-2" />
                Real-time
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'models', label: 'AI Models', icon: Layers },
              { id: 'insights', label: 'Insights', icon: Sparkles },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'models' && renderModelsTab()}
        {activeTab === 'insights' && renderInsightsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default AIDocumentIntelligenceDashboard; 