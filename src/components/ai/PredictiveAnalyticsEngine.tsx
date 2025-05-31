import React, { useState, useEffect } from 'react';
import { 
  Brain, TrendingUp, Target, Zap, AlertCircle, 
  BarChart3, LineChart, PieChart, Activity,
  Settings, Play, Pause, RefreshCw, Download,
  CheckCircle, XCircle, Clock, Lightbulb
} from 'lucide-react';

interface PredictiveModel {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'forecasting' | 'clustering';
  accuracy: number;
  status: 'training' | 'ready' | 'deployed' | 'error';
  lastTrained: Date;
  predictions: number;
  confidence: number;
}

interface Prediction {
  id: string;
  modelId: string;
  metric: string;
  value: number;
  confidence: number;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
  impact: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
}

interface AutomatedInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations: string[];
  timestamp: Date;
}

const PredictiveAnalyticsEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState('models');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Mock data for demonstration
  const [models] = useState<PredictiveModel[]>([
    {
      id: 'model-1',
      name: 'Customer Churn Predictor',
      type: 'classification',
      accuracy: 94.2,
      status: 'deployed',
      lastTrained: new Date('2024-01-15'),
      predictions: 1247,
      confidence: 0.89
    },
    {
      id: 'model-2',
      name: 'Revenue Forecaster',
      type: 'regression',
      accuracy: 87.5,
      status: 'ready',
      lastTrained: new Date('2024-01-20'),
      predictions: 856,
      confidence: 0.92
    },
    {
      id: 'model-3',
      name: 'Quality Score Predictor',
      type: 'regression',
      accuracy: 91.8,
      status: 'training',
      lastTrained: new Date('2024-01-22'),
      predictions: 0,
      confidence: 0.0
    },
    {
      id: 'model-4',
      name: 'Customer Segmentation',
      type: 'clustering',
      accuracy: 88.3,
      status: 'deployed',
      lastTrained: new Date('2024-01-18'),
      predictions: 2341,
      confidence: 0.85
    }
  ]);

  const [predictions] = useState<Prediction[]>([
    {
      id: 'pred-1',
      modelId: 'model-1',
      metric: 'Customer Churn Rate',
      value: 3.2,
      confidence: 0.89,
      timeframe: 'Next 30 days',
      trend: 'up',
      impact: 'medium',
      explanation: 'Seasonal pattern indicates increased churn risk due to contract renewals'
    },
    {
      id: 'pred-2',
      modelId: 'model-2',
      metric: 'Monthly Revenue',
      value: 285000,
      confidence: 0.92,
      timeframe: 'Next month',
      trend: 'up',
      impact: 'high',
      explanation: 'Strong growth trajectory driven by enterprise customer expansion'
    },
    {
      id: 'pred-3',
      modelId: 'model-4',
      metric: 'New Customer Acquisition',
      value: 156,
      confidence: 0.85,
      timeframe: 'Next quarter',
      trend: 'stable',
      impact: 'medium',
      explanation: 'Consistent acquisition rate with slight seasonal variation'
    }
  ]);

  const [insights] = useState<AutomatedInsight[]>([
    {
      id: 'insight-1',
      type: 'opportunity',
      title: 'Enterprise Upsell Opportunity',
      description: 'Analysis shows 23 SMB customers are ready for enterprise upgrade based on usage patterns',
      confidence: 0.87,
      priority: 'high',
      actionable: true,
      recommendations: [
        'Contact customers with personalized upgrade proposals',
        'Offer 30-day enterprise trial',
        'Schedule product demos for advanced features'
      ],
      timestamp: new Date('2024-01-23T10:30:00')
    },
    {
      id: 'insight-2',
      type: 'risk',
      title: 'Processing Capacity Alert',
      description: 'Current growth rate will exceed processing capacity in 45 days',
      confidence: 0.94,
      priority: 'critical',
      actionable: true,
      recommendations: [
        'Scale infrastructure by 40%',
        'Implement load balancing optimization',
        'Consider regional data center expansion'
      ],
      timestamp: new Date('2024-01-23T09:15:00')
    },
    {
      id: 'insight-3',
      type: 'trend',
      title: 'Quality Improvement Trend',
      description: 'Document processing quality has improved 12% over the last 30 days',
      confidence: 0.91,
      priority: 'medium',
      actionable: false,
      recommendations: [
        'Document best practices for team',
        'Analyze factors contributing to improvement',
        'Apply learnings to other processes'
      ],
      timestamp: new Date('2024-01-23T08:45:00')
    },
    {
      id: 'insight-4',
      type: 'anomaly',
      title: 'Unusual API Usage Pattern',
      description: 'Detected 300% increase in API calls from specific customer segment',
      confidence: 0.96,
      priority: 'high',
      actionable: true,
      recommendations: [
        'Investigate potential integration issues',
        'Contact affected customers',
        'Review rate limiting policies'
      ],
      timestamp: new Date('2024-01-23T07:20:00')
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'ready': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'training': return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'classification': return <Target className="w-4 h-4" />;
      case 'regression': return <TrendingUp className="w-4 h-4" />;
      case 'forecasting': return <LineChart className="w-4 h-4" />;
      case 'clustering': return <PieChart className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-green-500" />;
      case 'risk': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'anomaly': return <Zap className="w-5 h-5 text-orange-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const renderModelsTab = () => (
    <div className="space-y-6">
      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div 
            key={model.id} 
            className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border cursor-pointer transition-all ${
              selectedModel === model.id 
                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getTypeIcon(model.type)}
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{model.type}</span>
              </div>
              {getStatusIcon(model.status)}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{model.name}</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{model.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Predictions</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{model.predictions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{(model.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Last trained: {model.lastTrained.toLocaleDateString()}</span>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Model Details */}
      {selectedModel && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Model Performance</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Performance metrics visualization</p>
              <p className="text-xs text-gray-400 mt-1">Accuracy trends, confusion matrix, feature importance</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPredictionsTab = () => (
    <div className="space-y-6">
      {/* Predictions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Predictions</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Generate New</span>
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">{prediction.metric}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prediction.impact === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      prediction.impact === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                      prediction.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {prediction.impact} impact
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Predicted Value</span>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {prediction.metric.includes('Revenue') ? `$${prediction.value.toLocaleString()}` : 
                         prediction.metric.includes('Rate') ? `${prediction.value}%` : 
                         prediction.value.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{(prediction.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Timeframe</span>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{prediction.timeframe}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">{prediction.explanation}</p>
                </div>
                
                <div className="ml-4">
                  {prediction.trend === 'up' ? (
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  ) : prediction.trend === 'down' ? (
                    <TrendingUp className="w-6 h-6 text-red-500 transform rotate-180" />
                  ) : (
                    <Activity className="w-6 h-6 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </span>
                    {insight.actionable && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        Actionable
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    Confidence: {(insight.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">{insight.description}</p>
                
                {insight.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {insight.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">
                    Generated: {insight.timestamp.toLocaleString()}
                  </span>
                  {insight.actionable && (
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Take Action
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Predictive Analytics Engine</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">AI-powered predictions and automated insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isRunning ? 'Engine Running' : 'Engine Stopped'}
                </span>
              </div>
              <button 
                onClick={() => setIsRunning(!isRunning)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Stop' : 'Start'} Engine</span>
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
              { id: 'models', label: 'Models', icon: Brain },
              { id: 'predictions', label: 'Predictions', icon: Target },
              { id: 'insights', label: 'Insights', icon: Lightbulb },
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
          {activeTab === 'models' && renderModelsTab()}
          {activeTab === 'predictions' && renderPredictionsTab()}
          {activeTab === 'insights' && renderInsightsTab()}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsEngine; 