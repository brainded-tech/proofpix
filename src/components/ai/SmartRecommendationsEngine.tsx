import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, TrendingUp, Clock, Target, 
  CheckCircle, AlertTriangle, Zap, Settings,
  Filter, Search, Star, ThumbsUp, ThumbsDown,
  Play, Pause, RotateCcw, Download, Brain
} from 'lucide-react';
import { useSmartRecommendations } from '../../hooks/useDocumentIntelligence';

interface Recommendation {
  id: string;
  type: 'processing' | 'quality' | 'workflow' | 'compliance' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  effort: 'minimal' | 'moderate' | 'significant' | 'extensive';
  category: string;
  applicableDocuments: string[];
  implementation: {
    steps: string[];
    estimatedTime: number;
    resources: string[];
    prerequisites: string[];
  };
  expectedOutcome: {
    qualityImprovement: number;
    timeReduction: number;
    costSavings: number;
    riskReduction: number;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  feedback?: {
    rating: number;
    helpful: boolean;
    comments: string;
  };
}

const SmartRecommendationsEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterImpact, setFilterImpact] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const { generateRecommendations, implementRecommendation, isLoading } = useSmartRecommendations();

  // Mock data for demonstration
  const [recommendations] = useState<Recommendation[]>([
    {
      id: 'rec-1',
      type: 'processing',
      title: 'Implement Batch Processing for Legal Documents',
      description: 'Process legal documents in batches to improve efficiency and reduce processing time by 40%',
      confidence: 0.92,
      impact: 'high',
      effort: 'moderate',
      category: 'Document Processing',
      applicableDocuments: ['legal', 'contracts', 'agreements'],
      implementation: {
        steps: [
          'Configure batch processing rules',
          'Set up document queues',
          'Implement parallel processing',
          'Test with sample documents',
          'Deploy to production'
        ],
        estimatedTime: 120,
        resources: ['Development Team', 'System Administrator'],
        prerequisites: ['Queue system setup', 'Load balancer configuration']
      },
      expectedOutcome: {
        qualityImprovement: 15,
        timeReduction: 40,
        costSavings: 25,
        riskReduction: 10
      },
      status: 'pending',
      priority: 'high',
      createdAt: new Date('2024-01-23T10:00:00')
    },
    {
      id: 'rec-2',
      type: 'quality',
      title: 'Enhanced OCR Accuracy for Financial Documents',
      description: 'Implement advanced OCR preprocessing to improve text extraction accuracy for financial documents',
      confidence: 0.89,
      impact: 'critical',
      effort: 'significant',
      category: 'Quality Improvement',
      applicableDocuments: ['financial', 'invoices', 'receipts'],
      implementation: {
        steps: [
          'Analyze current OCR performance',
          'Implement image preprocessing',
          'Train custom OCR models',
          'Validate accuracy improvements',
          'Deploy enhanced OCR pipeline'
        ],
        estimatedTime: 240,
        resources: ['ML Engineer', 'Data Scientist', 'QA Team'],
        prerequisites: ['Training data collection', 'GPU resources']
      },
      expectedOutcome: {
        qualityImprovement: 35,
        timeReduction: 20,
        costSavings: 15,
        riskReduction: 30
      },
      status: 'in_progress',
      priority: 'urgent',
      createdAt: new Date('2024-01-22T14:30:00'),
      feedback: {
        rating: 5,
        helpful: true,
        comments: 'Excellent recommendation, already seeing improvements'
      }
    },
    {
      id: 'rec-3',
      type: 'workflow',
      title: 'Automated Compliance Checking for Medical Records',
      description: 'Implement automated HIPAA compliance validation for medical document processing',
      confidence: 0.95,
      impact: 'critical',
      effort: 'extensive',
      category: 'Compliance Automation',
      applicableDocuments: ['medical', 'patient_records', 'health_data'],
      implementation: {
        steps: [
          'Define HIPAA compliance rules',
          'Implement automated validation',
          'Set up audit logging',
          'Create compliance reports',
          'Train staff on new workflow'
        ],
        estimatedTime: 320,
        resources: ['Compliance Officer', 'Development Team', 'Legal Team'],
        prerequisites: ['HIPAA training', 'Compliance framework setup']
      },
      expectedOutcome: {
        qualityImprovement: 45,
        timeReduction: 30,
        costSavings: 20,
        riskReduction: 60
      },
      status: 'pending',
      priority: 'urgent',
      createdAt: new Date('2024-01-21T09:15:00')
    },
    {
      id: 'rec-4',
      type: 'optimization',
      title: 'Smart Document Routing Based on Content Analysis',
      description: 'Implement intelligent document routing to automatically assign documents to appropriate teams',
      confidence: 0.87,
      impact: 'medium',
      effort: 'moderate',
      category: 'Workflow Optimization',
      applicableDocuments: ['all'],
      implementation: {
        steps: [
          'Analyze current routing patterns',
          'Implement content-based classification',
          'Set up routing rules',
          'Test routing accuracy',
          'Deploy smart routing system'
        ],
        estimatedTime: 160,
        resources: ['Business Analyst', 'Development Team'],
        prerequisites: ['Team capacity analysis', 'Routing rules definition']
      },
      expectedOutcome: {
        qualityImprovement: 25,
        timeReduction: 35,
        costSavings: 30,
        riskReduction: 15
      },
      status: 'completed',
      priority: 'medium',
      createdAt: new Date('2024-01-20T16:45:00'),
      feedback: {
        rating: 4,
        helpful: true,
        comments: 'Good improvement in routing efficiency'
      }
    },
    {
      id: 'rec-5',
      type: 'compliance',
      title: 'Implement Data Retention Policies',
      description: 'Set up automated data retention and deletion policies to ensure compliance with regulations',
      confidence: 0.91,
      impact: 'high',
      effort: 'minimal',
      category: 'Data Governance',
      applicableDocuments: ['all'],
      implementation: {
        steps: [
          'Define retention policies',
          'Implement automated archiving',
          'Set up deletion schedules',
          'Create audit trails',
          'Monitor compliance status'
        ],
        estimatedTime: 80,
        resources: ['Compliance Officer', 'System Administrator'],
        prerequisites: ['Legal review', 'Storage capacity planning']
      },
      expectedOutcome: {
        qualityImprovement: 20,
        timeReduction: 15,
        costSavings: 40,
        riskReduction: 50
      },
      status: 'pending',
      priority: 'medium',
      createdAt: new Date('2024-01-19T11:20:00')
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'processing': return <Zap className="w-5 h-5 text-blue-500" />;
      case 'quality': return <Target className="w-5 h-5 text-green-500" />;
      case 'workflow': return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case 'compliance': return <CheckCircle className="w-5 h-5 text-red-500" />;
      case 'optimization': return <Settings className="w-5 h-5 text-orange-500" />;
      default: return <Lightbulb className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'quality': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'workflow': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'compliance': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'optimization': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'extensive': return 'text-red-600 dark:text-red-400';
      case 'significant': return 'text-orange-600 dark:text-orange-400';
      case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
      case 'minimal': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Play className="w-5 h-5 text-blue-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'dismissed': return <Pause className="w-5 h-5 text-gray-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || rec.type === activeTab;
    const matchesImpact = filterImpact === 'all' || rec.impact === filterImpact;
    const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
    return matchesSearch && matchesTab && matchesImpact && matchesStatus;
  });

  const renderRecommendationCard = (rec: Recommendation) => (
    <div 
      key={rec.id}
      className={`border rounded-lg p-6 cursor-pointer transition-all ${
        selectedRecommendation === rec.id 
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
      onClick={() => setSelectedRecommendation(rec.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          {getTypeIcon(rec.type)}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
          </div>
        </div>
        {getStatusIcon(rec.status)}
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(rec.type)}`}>
          {rec.type}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
          {rec.priority}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Impact</p>
          <p className={`text-sm font-medium ${getImpactColor(rec.impact)}`}>{rec.impact}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Effort</p>
          <p className={`text-sm font-medium ${getEffortColor(rec.effort)}`}>{rec.effort}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Confidence</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{(rec.confidence * 100).toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Est. Time</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{rec.implementation.estimatedTime}h</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-green-600 dark:text-green-400">+{rec.expectedOutcome.qualityImprovement}%</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Quality</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">-{rec.expectedOutcome.timeReduction}%</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">-{rec.expectedOutcome.costSavings}%</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Cost</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">-{rec.expectedOutcome.riskReduction}%</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Risk</p>
        </div>
      </div>

      {rec.feedback && (
        <div className="flex items-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < rec.feedback!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">•</span>
          <span className="text-xs text-gray-600 dark:text-gray-400">{rec.feedback.comments}</span>
        </div>
      )}
    </div>
  );

  const renderRecommendationDetails = () => {
    const rec = recommendations.find(r => r.id === selectedRecommendation);
    if (!rec) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Implementation Details</h3>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Implement</span>
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
              <ThumbsDown className="w-4 h-4" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Implementation Steps</h4>
            <div className="space-y-2">
              {rec.implementation.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Resources Required</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Members:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {rec.implementation.resources.map((resource, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs rounded">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Prerequisites:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {rec.implementation.prerequisites.map((prereq, index) => (
                    <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs rounded">
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Expected Outcomes</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">+{rec.expectedOutcome.qualityImprovement}%</p>
              <p className="text-sm text-green-700 dark:text-green-300">Quality Improvement</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">-{rec.expectedOutcome.timeReduction}%</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Time Reduction</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">-{rec.expectedOutcome.costSavings}%</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">Cost Savings</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">-{rec.expectedOutcome.riskReduction}%</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">Risk Reduction</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Recommendations Engine</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">AI-powered recommendations for process optimization</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Generate New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search recommendations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterImpact}
              onChange={(e) => setFilterImpact(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Impact</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          {/* Type Tabs */}
          <nav className="flex space-x-8">
            {[
              { id: 'all', label: 'All Recommendations', icon: Lightbulb },
              { id: 'processing', label: 'Processing', icon: Zap },
              { id: 'quality', label: 'Quality', icon: Target },
              { id: 'workflow', label: 'Workflow', icon: TrendingUp },
              { id: 'compliance', label: 'Compliance', icon: CheckCircle },
              { id: 'optimization', label: 'Optimization', icon: Settings },
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

        {/* Recommendations Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecommendations.map(renderRecommendationCard)}
          </div>

          {/* Recommendation Details */}
          {selectedRecommendation && renderRecommendationDetails()}
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendationsEngine; 