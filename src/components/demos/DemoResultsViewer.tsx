import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Download, 
  Share2, 
  FileText, 
  Image, 
  BarChart3, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Crown,
  ArrowRight
} from 'lucide-react';

interface DemoResult {
  id: string;
  fileName: string;
  fileType: string;
  processingTime: number;
  confidence: number;
  status: 'completed' | 'processing' | 'error';
  metadata: {
    size: string;
    dimensions?: string;
    pages?: number;
    extractedText?: string;
    detectedObjects?: string[];
    classification?: string;
    riskScore?: number;
  };
  insights: {
    category: string;
    description: string;
    confidence: number;
  }[];
  watermark: boolean;
}

interface DemoResultsViewerProps {
  results: DemoResult[];
  industryType: string;
  onUpgrade: () => void;
  onExport: (format: string) => void;
}

const DemoResultsViewer: React.FC<DemoResultsViewerProps> = ({
  results,
  industryType,
  onUpgrade,
  onExport
}) => {
  const [selectedResult, setSelectedResult] = useState<DemoResult | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [exportFormat, setExportFormat] = useState('pdf');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="w-6 h-6" />;
    if (fileType.includes('pdf')) return <FileText className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const getIndustryColor = (industry: string) => {
    const colors = {
      legal: 'from-blue-600 to-indigo-700',
      healthcare: 'from-green-600 to-emerald-700',
      insurance: 'from-orange-600 to-red-700',
      enterprise: 'from-purple-600 to-violet-700'
    };
    return colors[industry as keyof typeof colors] || 'from-gray-600 to-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Processing Results
          </h3>
          <p className="text-gray-600 mt-1">
            {results.length} files processed • {industryType} industry demo
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
          
          <button
            onClick={onUpgrade}
            className={`px-4 py-2 bg-gradient-to-r ${getIndustryColor(industryType)} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2`}
          >
            <Crown className="w-4 h-4" />
            Upgrade for Full Access
          </button>
        </div>
      </div>

      {/* Demo Watermark Notice */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900">Demo Mode Active</h4>
            <p className="text-amber-700 text-sm">
              Results include watermarks and limited features. Upgrade to access full processing capabilities.
            </p>
          </div>
          <button
            onClick={onUpgrade}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            Remove Limits
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Results Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        <AnimatePresence>
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer ${
                viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
              }`}
              onClick={() => setSelectedResult(result)}
            >
              {/* Watermark Overlay */}
              {result.watermark && (
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/5 rounded-xl pointer-events-none">
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400 font-mono opacity-50 transform rotate-12">
                    DEMO
                  </div>
                </div>
              )}

              <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : 'space-y-4'}>
                {/* File Info */}
                <div className={viewMode === 'list' ? 'flex items-center gap-3' : 'flex items-center justify-between'}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(result.fileType)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 truncate max-w-[200px]">
                        {result.fileName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {result.metadata.size}
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(result.status)}
                </div>

                {/* Processing Stats */}
                <div className={viewMode === 'list' ? 'flex items-center gap-6' : 'grid grid-cols-2 gap-4'}>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {result.confidence}%
                    </div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {result.processingTime}s
                    </div>
                    <div className="text-xs text-gray-500">Processing</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className={viewMode === 'list' ? 'flex items-center gap-2' : 'flex justify-between'}>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Export Options */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Export Results</h4>
        <div className="flex flex-wrap gap-3">
          {['pdf', 'excel', 'json', 'csv'].map((format) => (
            <button
              key={format}
              onClick={() => onExport(format)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                exportFormat === format
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Demo exports include watermarks. Upgrade for clean, professional reports.
        </p>
      </div>

      {/* Detailed Result Modal */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedResult(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedResult.fileName}
                  </h3>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Metadata */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">File Metadata</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">Size</div>
                      <div className="font-medium">{selectedResult.metadata.size}</div>
                    </div>
                    {selectedResult.metadata.dimensions && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-500">Dimensions</div>
                        <div className="font-medium">{selectedResult.metadata.dimensions}</div>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">Confidence</div>
                      <div className="font-medium">{selectedResult.confidence}%</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-500">Processing Time</div>
                      <div className="font-medium">{selectedResult.processingTime}s</div>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">AI Insights</h4>
                  <div className="space-y-3">
                    {selectedResult.insights.map((insight, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-900">{insight.category}</span>
                          <span className="text-sm text-blue-600">{insight.confidence}% confidence</span>
                        </div>
                        <p className="text-blue-800">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upgrade Prompt */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Crown className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900">Unlock Full Analysis</h4>
                      <p className="text-purple-700 text-sm">
                        Get detailed insights, remove watermarks, and access advanced features.
                      </p>
                    </div>
                    <button
                      onClick={onUpgrade}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoResultsViewer; 