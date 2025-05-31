/**
 * AI/ML Platform Dashboard - Priority 13
 * Advanced machine learning platform with model management and AI insights
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Brain, 
  Cpu, 
  Database, 
  TrendingUp, 
  Zap, 
  Eye, 
  Settings, 
  Play, 
  Pause, 
  Download, 
  Upload, 
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Lightbulb,
  Layers,
  GitBranch,
  Gauge,
  Sparkles,
  Bot,
  FileText,
  PieChart,
  LineChart
} from 'lucide-react';
import { aiMLPlatformService } from '../../services/aiMLPlatformService';

interface MLModel {
  id: string;
  name: string;
  type: 'classification' | 'extraction' | 'generation' | 'analysis' | 'prediction';
  version: string;
  status: 'training' | 'ready' | 'deployed' | 'error';
  accuracy: number;
  trainingData: number;
  lastTrained: Date;
  description: string;
  capabilities: string[];
  inputTypes: string[];
  outputTypes: string[];
  performance: {
    latency: number;
    throughput: number;
    memoryUsage: number;
  };
}

interface TrainingJob {
  id: string;
  modelId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  datasetSize: number;
  epochs: number;
  currentEpoch: number;
  metrics: {
    loss: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  logs: string[];
}

interface AIInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'trend' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  data: Record<string, any>;
  timestamp: Date;
  actionable: boolean;
  suggestedActions: string[];
}

const AIMLPlatformDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'training' | 'insights' | 'analytics' | 'automl'>('overview');
  const [models, setModels] = useState<MLModel[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreatingModel, setIsCreatingModel] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const modelsData = aiMLPlatformService.getModels();
        const trainingData = aiMLPlatformService.getTrainingJobs();
        const insightsData = aiMLPlatformService.getInsights(20);

        setModels(modelsData);
        setTrainingJobs(trainingData);
        setInsights(insightsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading AI/ML data:', error);
        setLoading(false);
      }
    };

    loadData();

    // Refresh data periodically
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Platform statistics
  const platformStats = useMemo(() => {
    const deployedModels = models.filter(m => m.status === 'deployed').length;
    const trainingModels = models.filter(m => m.status === 'training').length;
    const avgAccuracy = models.length > 0 ? models.reduce((sum, m) => sum + m.accuracy, 0) / models.length : 0;
    const totalPredictions = models.reduce((sum, m) => sum + Math.floor(Math.random() * 10000), 0);

    return {
      totalModels: models.length,
      deployedModels,
      trainingModels,
      avgAccuracy,
      totalPredictions,
      activeInsights: insights.filter(i => i.actionable).length
    };
  }, [models, insights]);

  const ModelCard: React.FC<{ model: MLModel }> = ({ model }) => {
    const statusColors = {
      training: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ready: 'bg-blue-100 text-blue-800 border-blue-200',
      deployed: 'bg-green-100 text-green-800 border-green-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    };

    const typeIcons = {
      classification: <Target className="w-5 h-5" />,
      extraction: <FileText className="w-5 h-5" />,
      generation: <Sparkles className="w-5 h-5" />,
      analysis: <Eye className="w-5 h-5" />,
      prediction: <TrendingUp className="w-5 h-5" />
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {typeIcons[model.type]}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{model.name}</h3>
              <p className="text-sm text-gray-600">v{model.version}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[model.status]}`}>
            {model.status.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">{model.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-gray-500">Accuracy</span>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${model.accuracy * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-500">Latency</span>
            <p className="text-sm font-medium">{model.performance.latency}ms</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {model.capabilities.slice(0, 3).map(capability => (
            <span key={capability} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {capability}
            </span>
          ))}
          {model.capabilities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{model.capabilities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={() => setSelectedModel(model.id)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            View Details
          </button>
          {model.status === 'ready' && (
            <button 
              onClick={() => aiMLPlatformService.deployModel(model.id)}
              className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              Deploy
            </button>
          )}
        </div>
      </div>
    );
  };

  const TrainingJobCard: React.FC<{ job: TrainingJob }> = ({ job }) => {
    const model = models.find(m => m.id === job.modelId);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{model?.name || 'Unknown Model'}</h3>
            <p className="text-sm text-gray-600">Training Job #{job.id.slice(-8)}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            job.status === 'running' ? 'bg-blue-100 text-blue-800' :
            job.status === 'completed' ? 'bg-green-100 text-green-800' :
            job.status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.status.toUpperCase()}
          </span>
        </div>

        {job.status === 'running' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{job.progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Epoch {job.currentEpoch}/{job.epochs}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-gray-500">Accuracy</span>
            <p className="text-sm font-medium">{(job.metrics.accuracy * 100).toFixed(2)}%</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Loss</span>
            <p className="text-sm font-medium">{job.metrics.loss.toFixed(4)}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">F1 Score</span>
            <p className="text-sm font-medium">{job.metrics.f1Score.toFixed(3)}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Dataset Size</span>
            <p className="text-sm font-medium">{job.datasetSize.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded p-3">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Recent Logs</h4>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {job.logs.slice(-3).map((log, index) => (
              <p key={index} className="text-xs text-gray-600 font-mono">{log}</p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const InsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
    const typeIcons = {
      pattern: <Layers className="w-5 h-5" />,
      anomaly: <AlertCircle className="w-5 h-5" />,
      trend: <TrendingUp className="w-5 h-5" />,
      recommendation: <Lightbulb className="w-5 h-5" />,
      prediction: <Eye className="w-5 h-5" />
    };

    const impactColors = {
      low: 'border-blue-200 bg-blue-50',
      medium: 'border-yellow-200 bg-yellow-50',
      high: 'border-orange-200 bg-orange-50',
      critical: 'border-red-200 bg-red-50'
    };

    return (
      <div className={`rounded-lg border-l-4 p-4 ${impactColors[insight.impact]}`}>
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-white rounded-lg">
            {typeIcons[insight.type]}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{insight.title}</h3>
              <span className="text-xs text-gray-500">
                {insight.confidence.toFixed(0)}% confidence
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
            
            {insight.actionable && insight.suggestedActions.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1">Suggested Actions:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {insight.suggestedActions.slice(0, 2).map((action, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <span>•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
            <Brain className="w-8 h-8 mr-3 text-blue-600" />
            AI/ML Platform Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Advanced machine learning and artificial intelligence platform</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsCreatingModel(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Bot className="w-4 h-4" />
            <span>Create Model</span>
          </button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Models</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{platformStats.totalModels}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Deployed</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{platformStats.deployedModels}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Training</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{platformStats.trainingModels}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Avg Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{(platformStats.avgAccuracy * 100).toFixed(1)}%</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Predictions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{platformStats.totalPredictions.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-600">AI Insights</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{platformStats.activeInsights}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Gauge },
            { id: 'models', label: 'Models', icon: Bot },
            { id: 'training', label: 'Training', icon: Activity },
            { id: 'insights', label: 'AI Insights', icon: Lightbulb },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'automl', label: 'AutoML', icon: Sparkles }
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
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent AI Insights */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
              Recent AI Insights
            </h3>
            <div className="space-y-4">
              {insights.slice(0, 3).map(insight => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>

          {/* Active Training Jobs */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Active Training Jobs
            </h3>
            {trainingJobs.filter(job => job.status === 'running').length === 0 ? (
              <p className="text-gray-600 text-center py-8">No active training jobs</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {trainingJobs.filter(job => job.status === 'running').slice(0, 4).map(job => (
                  <TrainingJobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* Top Performing Models */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Top Performing Models
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {models
                .sort((a, b) => b.accuracy - a.accuracy)
                .slice(0, 3)
                .map(model => (
                  <ModelCard key={model.id} model={model} />
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Model Library</h3>
            <div className="flex space-x-2">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">All Types</option>
                <option value="classification">Classification</option>
                <option value="extraction">Extraction</option>
                <option value="generation">Generation</option>
                <option value="analysis">Analysis</option>
                <option value="prediction">Prediction</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">All Status</option>
                <option value="ready">Ready</option>
                <option value="deployed">Deployed</option>
                <option value="training">Training</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {models.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Training Jobs</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Start New Training
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trainingJobs.map(job => (
              <TrainingJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Insights & Recommendations</h3>
            <div className="flex space-x-2">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">All Types</option>
                <option value="pattern">Patterns</option>
                <option value="anomaly">Anomalies</option>
                <option value="trend">Trends</option>
                <option value="recommendation">Recommendations</option>
                <option value="prediction">Predictions</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">All Impact</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Model Performance Trends</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <LineChart className="w-12 h-12 mb-2" />
                <p>Performance charts would be rendered here</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Model Type Distribution</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <PieChart className="w-12 h-12 mb-2" />
                <p>Distribution charts would be rendered here</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Usage Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1.2M</div>
                <div className="text-sm text-gray-600">API Calls Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">45ms</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">0.02%</div>
                <div className="text-sm text-gray-600">Error Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'automl' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
              AutoML Recommendations
            </h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Hyperparameter Optimization</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Automatically tune hyperparameters for your models to improve performance.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Start Optimization
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Data Augmentation</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Generate synthetic training data to improve model generalization.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Generate Data
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Model Architecture Search</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Automatically discover optimal neural network architectures.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Search Architecture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMLPlatformDashboard; 