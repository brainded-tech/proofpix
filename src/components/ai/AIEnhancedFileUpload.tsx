import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Image, 
  Brain, 
  Eye, 
  Shield, 
  Target, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  X,
  Download,
  RotateCcw,
  Lightbulb
} from 'lucide-react';
import {
  useOCR,
  useDocumentClassification,
  useFraudDetection,
  useQualityAssessment,
  usePredictiveAnalytics
} from '../../hooks/useAI';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  aiAnalysis?: {
    classification?: any;
    qualityScore?: number;
    fraudRisk?: number;
    ocrText?: string;
    predictions?: any;
    processingTime?: number;
  };
  recommendations?: string[];
}

interface AIEnhancedFileUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  enableAIAnalysis?: boolean;
}

const AIEnhancedFileUpload: React.FC<AIEnhancedFileUploadProps> = ({
  onFilesUploaded,
  maxFiles = 10,
  acceptedTypes = ['image/*', 'application/pdf'],
  enableAIAnalysis = true
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  // AI Hooks
  const { performOCR } = useOCR();
  const { classifyDocument } = useDocumentClassification();
  const { detectFraud } = useFraudDetection();
  const { assessQuality, predictQuality } = useQualityAssessment();
  const { getPredictiveAnalytics } = usePredictiveAnalytics();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0,
      recommendations: []
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload and AI analysis
    for (const uploadedFile of newFiles) {
      await simulateUpload(uploadedFile);
      if (enableAIAnalysis) {
        await performAIAnalysis(uploadedFile);
      }
    }

    if (onFilesUploaded) {
      onFilesUploaded(uploadedFiles);
    }
  }, [uploadedFiles, onFilesUploaded, enableAIAnalysis]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    multiple: true
  });

  const simulateUpload = async (file: UploadedFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { ...f, progress, status: progress === 100 ? 'processing' : 'uploading' }
            : f
        )
      );
    }
  };

  const performAIAnalysis = async (file: UploadedFile) => {
    setIsAnalyzing(true);
    
    try {
      const startTime = Date.now();
      
      // Simulate AI analysis with realistic delays
      const analysis: any = {};
      const recommendations: string[] = [];

      // Quality Prediction (fastest)
      await new Promise(resolve => setTimeout(resolve, 500));
      const qualityPrediction = await predictQuality({
        fileName: file.file.name,
        fileSize: file.file.size,
        fileType: file.file.type
      });
      analysis.qualityScore = qualityPrediction.predictedScore;
      
      if (qualityPrediction.predictedScore < 0.7) {
        recommendations.push("Consider image enhancement for better OCR accuracy");
      }

      // Document Classification
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simulate classification result
      analysis.classification = {
        type: 'financial',
        subtype: 'invoice',
        confidence: 0.92,
        features: ['table_structure', 'monetary_values', 'date_fields']
      };

      // Fraud Detection
      await new Promise(resolve => setTimeout(resolve, 1200));
      analysis.fraudRisk = Math.random() * 0.3; // Low fraud risk for demo
      
      if (analysis.fraudRisk > 0.2) {
        recommendations.push("Document flagged for manual review due to fraud indicators");
      }

      // OCR Preview (if image)
      if (file.file.type.startsWith('image/')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        analysis.ocrText = "Sample extracted text from document...";
      }

      // Predictive Analytics
      await new Promise(resolve => setTimeout(resolve, 600));
      analysis.predictions = {
        processingTimeEstimate: 45,
        successProbability: 0.94,
        recommendedSettings: {
          enhanceImage: qualityPrediction.predictedScore < 0.8,
          useAdvancedOCR: file.file.type.startsWith('image/'),
          fraudSensitivity: 'medium'
        }
      };

      analysis.processingTime = Date.now() - startTime;

      // Add general recommendations
      if (analysis.classification.confidence > 0.9) {
        recommendations.push("High confidence classification - ready for automated processing");
      }
      
      if (analysis.qualityScore > 0.8) {
        recommendations.push("Excellent image quality detected");
      }

      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: 'completed', 
                aiAnalysis: analysis,
                recommendations 
              }
            : f
        )
      );

    } catch (error) {
      console.error('AI analysis failed:', error);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'error' }
            : f
        )
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
    
    if (selectedFile === fileId) {
      setSelectedFile(null);
    }
  };

  const retryAnalysis = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'processing', aiAnalysis: undefined, recommendations: [] }
            : f
        )
      );
      await performAIAnalysis(file);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'processing':
        return <Brain className="w-4 h-4 text-purple-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 0.3) return 'text-green-400';
    if (risk <= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const selectedFileData = selectedFile ? uploadedFiles.find(f => f.id === selectedFile) : null;

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragActive
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-slate-600 hover:border-slate-500 bg-slate-800/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
            <Upload className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              {isDragActive ? 'Drop files here' : 'Upload Documents'}
            </h3>
            <p className="text-slate-400 mb-2">
              Drag & drop files or click to browse
            </p>
            <p className="text-xs text-slate-500">
              Supports images and PDFs • Max {maxFiles} files
            </p>
          </div>
          {enableAIAnalysis && (
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Brain className="w-4 h-4" />
              <span>AI analysis enabled</span>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Uploaded Files ({uploadedFiles.length})
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File List */}
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`p-4 bg-slate-800/50 border rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedFile === file.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedFile(file.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(file.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === 'error' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            retryAnalysis(file.id);
                          }}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <div className="mb-2">
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {file.status === 'uploading' ? 'Uploading...' : 'AI Analysis in progress...'}
                      </p>
                    </div>
                  )}

                  {/* AI Analysis Summary */}
                  {file.aiAnalysis && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Classification:</span>
                        <span className={getConfidenceColor(file.aiAnalysis.classification?.confidence || 0)}>
                          {file.aiAnalysis.classification?.type || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Quality:</span>
                        <span className={getConfidenceColor(file.aiAnalysis.qualityScore || 0)}>
                          {((file.aiAnalysis.qualityScore || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Fraud Risk:</span>
                        <span className={getRiskColor(file.aiAnalysis.fraudRisk || 0)}>
                          {((file.aiAnalysis.fraudRisk || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Processing:</span>
                        <span className="text-slate-200">
                          {file.aiAnalysis.processingTime}ms
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* File Details */}
            {selectedFileData && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-100">File Details</h4>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* File Preview */}
                {selectedFileData.file.type.startsWith('image/') && (
                  <div className="mb-4">
                    <img
                      src={selectedFileData.preview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* AI Analysis Details */}
                {selectedFileData.aiAnalysis && (
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-slate-200 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-purple-400" />
                        Classification
                      </h5>
                      <div className="bg-slate-700/30 rounded-lg p-3 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-400">Type:</span>
                          <span className="text-slate-200">{selectedFileData.aiAnalysis.classification?.type}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-400">Subtype:</span>
                          <span className="text-slate-200">{selectedFileData.aiAnalysis.classification?.subtype}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Confidence:</span>
                          <span className={getConfidenceColor(selectedFileData.aiAnalysis.classification?.confidence || 0)}>
                            {((selectedFileData.aiAnalysis.classification?.confidence || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-slate-200 mb-2 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-pink-400" />
                        Quality Assessment
                      </h5>
                      <div className="bg-slate-700/30 rounded-lg p-3 text-sm">
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-400">Overall Score:</span>
                          <span className={getConfidenceColor(selectedFileData.aiAnalysis.qualityScore || 0)}>
                            {((selectedFileData.aiAnalysis.qualityScore || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${(selectedFileData.aiAnalysis.qualityScore || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-slate-200 mb-2 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-red-400" />
                        Fraud Detection
                      </h5>
                      <div className="bg-slate-700/30 rounded-lg p-3 text-sm">
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-400">Risk Level:</span>
                          <span className={getRiskColor(selectedFileData.aiAnalysis.fraudRisk || 0)}>
                            {((selectedFileData.aiAnalysis.fraudRisk || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                            style={{ width: `${(selectedFileData.aiAnalysis.fraudRisk || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {selectedFileData.recommendations && selectedFileData.recommendations.length > 0 && (
                      <div>
                        <h5 className="font-medium text-slate-200 mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                          AI Recommendations
                        </h5>
                        <div className="space-y-2">
                          {selectedFileData.recommendations.map((rec, index) => (
                            <div key={index} className="bg-slate-700/30 rounded-lg p-3 text-sm text-slate-300">
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIEnhancedFileUpload; 