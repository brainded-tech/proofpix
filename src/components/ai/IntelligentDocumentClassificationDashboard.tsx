import React, { useState, useEffect } from 'react';
import { 
  FileText, Brain, Zap, Settings, Target, 
  CheckCircle, AlertCircle, Clock, TrendingUp,
  Filter, Search, Download, RefreshCw, Play,
  Lightbulb, Workflow, Tag, BarChart3
} from 'lucide-react';
import { 
  useDocumentClassification, 
  useSmartRecommendations, 
  useWorkflowAutomation,
  useContextualAnalysis 
} from '../../hooks/useDocumentIntelligence';

interface ClassifiedDocument {
  id: string;
  name: string;
  type: string;
  subType: string;
  confidence: number;
  status: 'classified' | 'processing' | 'pending' | 'error';
  features: Array<{
    name: string;
    value: string;
    confidence: number;
  }>;
  recommendations: string[];
  timestamp: Date;
}

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggers: string[];
  actions: string[];
  performance: {
    documentsProcessed: number;
    successRate: number;
    timeSaved: number;
  };
}

const IntelligentDocumentClassificationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('classification');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const { classifyDocument, isLoading: classificationLoading } = useDocumentClassification();
  const { generateRecommendations, isLoading: recommendationsLoading } = useSmartRecommendations();
  const { getWorkflows, isLoading: workflowsLoading } = useWorkflowAutomation();
  const { performAnalysis, isLoading: analysisLoading } = useContextualAnalysis();

  // Mock data for demonstration
  const [classifiedDocuments] = useState<ClassifiedDocument[]>([
    {
      id: 'doc-1',
      name: 'Contract_Agreement_2024.pdf',
      type: 'legal',
      subType: 'contract',
      confidence: 0.94,
      status: 'classified',
      features: [
        { name: 'Contract Type', value: 'Service Agreement', confidence: 0.92 },
        { name: 'Parties', value: '2 entities identified', confidence: 0.89 },
        { name: 'Duration', value: '12 months', confidence: 0.95 }
      ],
      recommendations: ['Apply contract template', 'Schedule review reminder', 'Extract key dates'],
      timestamp: new Date('2024-01-23T10:30:00')
    },
    {
      id: 'doc-2',
      name: 'Financial_Report_Q4.xlsx',
      type: 'financial',
      subType: 'quarterly_report',
      confidence: 0.98,
      status: 'classified',
      features: [
        { name: 'Report Period', value: 'Q4 2023', confidence: 0.97 },
        { name: 'Currency', value: 'USD', confidence: 0.99 },
        { name: 'Tables', value: '15 financial tables', confidence: 0.94 }
      ],
      recommendations: ['Validate calculations', 'Generate summary', 'Archive with metadata'],
      timestamp: new Date('2024-01-23T09:15:00')
    },
    {
      id: 'doc-3',
      name: 'Medical_Record_Patient_001.pdf',
      type: 'medical',
      subType: 'patient_record',
      confidence: 0.91,
      status: 'processing',
      features: [
        { name: 'Patient ID', value: 'Identified', confidence: 0.88 },
        { name: 'Medical History', value: 'Present', confidence: 0.93 },
        { name: 'Prescriptions', value: '3 medications', confidence: 0.90 }
      ],
      recommendations: ['Apply HIPAA compliance', 'Redact sensitive data', 'Secure storage'],
      timestamp: new Date('2024-01-23T08:45:00')
    },
    {
      id: 'doc-4',
      name: 'Identity_Verification_Form.pdf',
      type: 'identity',
      subType: 'verification_form',
      confidence: 0.87,
      status: 'classified',
      features: [
        { name: 'Document Type', value: 'Government ID', confidence: 0.85 },
        { name: 'Verification Status', value: 'Pending', confidence: 0.89 },
        { name: 'Expiry Date', value: '2026-12-15', confidence: 0.92 }
      ],
      recommendations: ['Verify authenticity', 'Check expiry date', 'Update customer profile'],
      timestamp: new Date('2024-01-23T07:20:00')
    }
  ]);

  const [workflowRules] = useState<WorkflowRule[]>([
    {
      id: 'workflow-1',
      name: 'Contract Auto-Processing',
      description: 'Automatically process and route legal contracts based on type and value',
      isActive: true,
      triggers: ['Document type: legal', 'Subtype: contract', 'Confidence > 90%'],
      actions: ['Apply contract template', 'Extract key dates', 'Route to legal team'],
      performance: {
        documentsProcessed: 156,
        successRate: 94.2,
        timeSaved: 312
      }
    },
    {
      id: 'workflow-2',
      name: 'Financial Report Validation',
      description: 'Validate financial documents and generate compliance reports',
      isActive: true,
      triggers: ['Document type: financial', 'Contains financial tables', 'Quarterly period'],
      actions: ['Validate calculations', 'Generate summary', 'Compliance check'],
      performance: {
        documentsProcessed: 89,
        successRate: 97.8,
        timeSaved: 178
      }
    },
    {
      id: 'workflow-3',
      name: 'Medical Record Compliance',
      description: 'Ensure HIPAA compliance for medical documents',
      isActive: true,
      triggers: ['Document type: medical', 'Contains PHI', 'Patient data present'],
      actions: ['Apply HIPAA rules', 'Redact sensitive data', 'Secure storage'],
      performance: {
        documentsProcessed: 234,
        successRate: 99.1,
        timeSaved: 445
      }
    },
    {
      id: 'workflow-4',
      name: 'Identity Verification Pipeline',
      description: 'Automated identity document verification and validation',
      isActive: false,
      triggers: ['Document type: identity', 'Government ID detected', 'Verification required'],
      actions: ['Verify authenticity', 'Check databases', 'Update customer profile'],
      performance: {
        documentsProcessed: 67,
        successRate: 91.0,
        timeSaved: 134
      }
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'classified': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'legal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'financial': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'identity': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'business': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'technical': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.8) return 'text-yellow-600 dark:text-yellow-400';
    if (confidence >= 0.7) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const filteredDocuments = classifiedDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const renderClassificationTab = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Classification</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="legal">Legal</option>
            <option value="financial">Financial</option>
            <option value="medical">Medical</option>
            <option value="identity">Identity</option>
            <option value="business">Business</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDocuments.map((doc) => (
            <div 
              key={doc.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedDocument === doc.id 
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setSelectedDocument(doc.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{doc.name}</h4>
                    <p className="text-xs text-gray-500">{doc.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                {getStatusIcon(doc.status)}
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
                  {doc.type}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{doc.subType}</span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Confidence</span>
                  <span className={`text-xs font-medium ${getConfidenceColor(doc.confidence)}`}>
                    {(doc.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${doc.confidence * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Key Features:</h5>
                {doc.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{feature.name}:</span> {feature.value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Details */}
      {selectedDocument && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Document Analysis</h3>
          {(() => {
            const doc = classifiedDocuments.find(d => d.id === selectedDocument);
            if (!doc) return null;
            
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Extracted Features</h4>
                  <div className="space-y-3">
                    {doc.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{feature.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{feature.value}</p>
                        </div>
                        <span className={`text-sm font-medium ${getConfidenceColor(feature.confidence)}`}>
                          {(feature.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Smart Recommendations</h4>
                  <div className="space-y-2">
                    {doc.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span className="text-sm text-blue-900 dark:text-blue-100">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );

  const renderWorkflowsTab = () => (
    <div className="space-y-6">
      {/* Workflow Rules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Workflow Automation Rules</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Workflow className="w-4 h-4" />
            <span>Create Rule</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflowRules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{rule.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rule.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rule.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Triggers:</h5>
                  <div className="flex flex-wrap gap-1">
                    {rule.triggers.map((trigger, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs rounded">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Actions:</h5>
                  <div className="flex flex-wrap gap-1">
                    {rule.actions.map((action, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs rounded">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{rule.performance.documentsProcessed}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Processed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{rule.performance.successRate}%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{rule.performance.timeSaved}h</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Time Saved</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Documents Classified</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2,847</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600 dark:text-green-400">+12.5%</span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Confidence</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">94.2%</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600 dark:text-green-400">+2.1%</span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <Workflow className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600 dark:text-green-400">+3</span>
            <span className="text-xs text-gray-500 ml-1">new this month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time Saved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,069h</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600 dark:text-green-400">+18.7%</span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
      </div>

      {/* Classification Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Classification Trends</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Classification analytics visualization</p>
            <p className="text-xs text-gray-400 mt-1">Document type distribution, confidence trends, accuracy metrics</p>
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Intelligent Document Classification</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">AI-powered document analysis and workflow automation</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Train Model</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'classification', label: 'Classification', icon: Tag },
              { id: 'workflows', label: 'Workflows', icon: Workflow },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
          {activeTab === 'classification' && renderClassificationTab()}
          {activeTab === 'workflows' && renderWorkflowsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>
    </div>
  );
};

export default IntelligentDocumentClassificationDashboard; 