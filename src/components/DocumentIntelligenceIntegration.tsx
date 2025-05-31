import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  FileText, 
  Brain, 
  Scan, 
  Eye, 
  Download, 
  Upload, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Settings,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  X,
  Plus,
  Trash2
} from 'lucide-react';

interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  results?: {
    text: string;
    entities: Array<{
      type: string;
      value: string;
      confidence: number;
      position: { start: number; end: number };
    }>;
    metadata: {
      pageCount?: number;
      language?: string;
      documentType?: string;
      confidence: number;
    };
    insights: {
      summary: string;
      keyTopics: string[];
      sentiment?: 'positive' | 'negative' | 'neutral';
      readabilityScore?: number;
    };
    privacy: {
      piiDetected: boolean;
      piiTypes: string[];
      riskLevel: 'low' | 'medium' | 'high' | 'critical';
      recommendations: string[];
    };
  };
  error?: string;
}

interface ProcessingSettings {
  extractText: boolean;
  detectEntities: boolean;
  analyzePrivacy: boolean;
  generateSummary: boolean;
  detectLanguage: boolean;
  ocrEnabled: boolean;
  confidenceThreshold: number;
}

const defaultSettings: ProcessingSettings = {
  extractText: true,
  detectEntities: true,
  analyzePrivacy: true,
  generateSummary: true,
  detectLanguage: true,
  ocrEnabled: true,
  confidenceThreshold: 0.7
};

export const DocumentIntelligenceIntegration: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentAnalysis[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentAnalysis | null>(null);
  const [settings, setSettings] = useState<ProcessingSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'processing' | 'completed' | 'failed'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate document processing
  const processDocument = useCallback(async (file: File): Promise<DocumentAnalysis> => {
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const initialDoc: DocumentAnalysis = {
      id: documentId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
      status: 'processing',
      progress: 0
    };

    setDocuments(prev => [initialDoc, ...prev]);

    // Simulate processing with progress updates
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, progress }
          : doc
      ));
    }

    // Simulate analysis results
    const results = {
      text: `This is extracted text from ${file.name}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
      entities: [
        { type: 'PERSON', value: 'John Doe', confidence: 0.95, position: { start: 45, end: 53 } },
        { type: 'EMAIL', value: 'john.doe@example.com', confidence: 0.92, position: { start: 120, end: 140 } },
        { type: 'PHONE', value: '+1-555-123-4567', confidence: 0.88, position: { start: 180, end: 195 } },
        { type: 'DATE', value: '2024-01-15', confidence: 0.91, position: { start: 200, end: 210 } }
      ],
      metadata: {
        pageCount: Math.floor(Math.random() * 10) + 1,
        language: 'en',
        documentType: file.type.includes('pdf') ? 'PDF Document' : 'Text Document',
        confidence: 0.89
      },
      insights: {
        summary: 'This document appears to be a business communication containing personal information and contact details.',
        keyTopics: ['Business Communication', 'Contact Information', 'Personal Data'],
        sentiment: 'neutral' as const,
        readabilityScore: 75
      },
      privacy: {
        piiDetected: true,
        piiTypes: ['Email Address', 'Phone Number', 'Personal Name'],
        riskLevel: 'medium' as const,
        recommendations: [
          'Consider redacting email addresses before sharing',
          'Verify consent for processing personal names',
          'Implement access controls for sensitive data'
        ]
      }
    };

    const completedDoc: DocumentAnalysis = {
      ...initialDoc,
      status: 'completed',
      progress: 100,
      results
    };

    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? completedDoc : doc
    ));

    return completedDoc;
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    
    try {
      const uploadPromises = Array.from(files).map(file => processDocument(file));
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error processing documents:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [processDocument]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Format file size
  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Get status color
  const getStatusColor = (status: DocumentAnalysis['status']): string => {
    switch (status) {
      case 'processing': return 'text-blue-600 dark:text-blue-400';
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'failed': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Get risk level color
  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Export results
  const exportResults = useCallback((doc: DocumentAnalysis) => {
    if (!doc.results) return;

    const exportData = {
      document: {
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        uploadedAt: doc.uploadedAt,
        processedAt: new Date()
      },
      analysis: doc.results,
      settings
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-${doc.fileName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [settings]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Document Intelligence
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                disabled={isProcessing}
              >
                <Upload className="h-4 w-4 mr-2 inline" />
                Upload Documents
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Processing Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Text Processing</h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.extractText}
                    onChange={(e) => setSettings(prev => ({ ...prev, extractText: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Extract Text</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.ocrEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, ocrEnabled: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">OCR for Images</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.detectLanguage}
                    onChange={(e) => setSettings(prev => ({ ...prev, detectLanguage: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Detect Language</span>
                </label>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Analysis</h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.detectEntities}
                    onChange={(e) => setSettings(prev => ({ ...prev, detectEntities: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Detect Entities</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.generateSummary}
                    onChange={(e) => setSettings(prev => ({ ...prev, generateSummary: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Generate Summary</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.analyzePrivacy}
                    onChange={(e) => setSettings(prev => ({ ...prev, analyzePrivacy: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Privacy Analysis</span>
                </label>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Confidence</h4>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Confidence: {(settings.confidenceThreshold * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.confidenceThreshold}
                    onChange={(e) => setSettings(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center mb-8 hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Upload Documents for AI Analysis
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Drag and drop files here, or click to select files
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 inline animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2 inline" />
                Select Files
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Documents List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Documents ({filteredDocuments.length})
            </h2>
            {filteredDocuments.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {documents.length === 0 ? 'No documents uploaded yet' : 'No documents match your search'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg p-4 border cursor-pointer transition-colors ${
                      selectedDocument?.id === doc.id
                        ? 'border-purple-500 dark:border-purple-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {doc.fileName}
                      </h3>
                      <span className={`text-sm font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>{doc.uploadedAt.toLocaleDateString()}</span>
                    </div>
                    {doc.status === 'processing' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${doc.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {doc.progress}% complete
                        </p>
                      </div>
                    )}
                    {doc.results?.privacy && (
                      <div className="mt-2 flex items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Privacy Risk:</span>
                        <span className={`text-xs font-medium ${getRiskColor(doc.results.privacy.riskLevel)}`}>
                          {doc.results.privacy.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Analysis Results
            </h2>
            {selectedDocument ? (
              <div className="space-y-6">
                {/* Document Info */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedDocument.fileName}
                    </h3>
                    {selectedDocument.results && (
                      <button
                        onClick={() => exportResults(selectedDocument)}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Download className="h-3 w-3 mr-1 inline" />
                        Export
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Size:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {formatFileSize(selectedDocument.fileSize)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {selectedDocument.mimeType}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`ml-2 font-medium ${getStatusColor(selectedDocument.status)}`}>
                        {selectedDocument.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Uploaded:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">
                        {selectedDocument.uploadedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analysis Results */}
                {selectedDocument.results && (
                  <>
                    {/* Privacy Analysis */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Privacy Analysis
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level:</span>
                          <span className={`text-sm font-medium ${getRiskColor(selectedDocument.results.privacy.riskLevel)}`}>
                            {selectedDocument.results.privacy.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">PII Detected:</span>
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {selectedDocument.results.privacy.piiDetected ? 'Yes' : 'No'}
                          </span>
                        </div>
                        {selectedDocument.results.privacy.piiTypes.length > 0 && (
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">PII Types:</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedDocument.results.privacy.piiTypes.map((type, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Entities */}
                    {selectedDocument.results.entities.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          Detected Entities
                        </h4>
                        <div className="space-y-2">
                          {selectedDocument.results.entities.map((entity, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {entity.value}
                                </span>
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                  ({entity.type})
                                </span>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {(entity.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Document Summary
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {selectedDocument.results.insights.summary}
                      </p>
                      {selectedDocument.results.insights.keyTopics.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Key Topics:</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedDocument.results.insights.keyTopics.map((topic, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {selectedDocument.status === 'failed' && selectedDocument.error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      <p className="text-red-800 dark:text-red-200 font-medium">Processing Failed</p>
                    </div>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-2">
                      {selectedDocument.error}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Select a document to view analysis results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
