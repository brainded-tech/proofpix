import React, { useState, useCallback, useRef } from 'react';
import { 
  Lock, 
  Crown, 
  Zap, 
  Upload, 
  Play, 
  Square, 
  Download, 
  Clock, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { extractMetadata } from '../utils/metadata';
import { analytics } from '../utils/analytics';
import SessionManager from '../utils/sessionManager';
import { usageTracker } from '../utils/analytics';
import { useEmailCapture } from '../utils/enhanced/emailCapture';
// import { LoadingSpinner, ProgressBar } from './LoadingStates';
// import EnhancedExportDialog from './EnhancedExportDialog';

interface BatchFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  metadata?: any;
  error?: string;
  progress: number;
}

interface BatchProcessorProps {
  onComplete?: (results: BatchFile[]) => void;
  onProgress?: (progress: number) => void;
  maxFiles?: number;
  allowedFormats?: string[];
}

const BatchProcessor: React.FC<BatchProcessorProps> = ({
  onComplete,
  onProgress,
  maxFiles = 100,
  allowedFormats = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp']
}) => {
  console.log('🔄 BatchProcessor component rendered', { onComplete, maxFiles, allowedFormats });
  
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [processingStats, setProcessingStats] = useState({
    total: 0,
    completed: 0,
    errors: 0,
    startTime: null as Date | null,
    estimatedTimeRemaining: null as number | null
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef<boolean>(false);
  const { showLimitCapture, showUpgradeCapture } = useEmailCapture();

  // 🔒 PAYMENT PROTECTION: Check if user can access batch processing
  const canUseBatch = SessionManager.canPerformAction('batch');
  const currentPlan = SessionManager.getCurrentPlan();
  
  console.log('🔒 Batch access check:', { canUseBatch, planType: currentPlan.type, planName: currentPlan.plan?.name });

  // Check usage limits
  const checkUsageLimits = useCallback((fileCount: number) => {
    const usage = usageTracker.getCurrentUsage();
    const limits = usageTracker.getLimits();
    
    if (usage.imagesProcessed + fileCount > limits.imagesPerSession) {
      showLimitCapture(usage.imagesProcessed, limits.imagesPerSession, {
        title: '📊 Batch Processing Limit Reached',
        subtitle: `You can process ${limits.imagesPerSession - usage.imagesProcessed} more images today`,
        incentive: 'Pro users get unlimited batch processing'
      });
      return false;
    }
    
    return true;
  }, [showLimitCapture]);

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    
    // Check file count limits
    if (fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed. Please select fewer files.`);
      return;
    }

    // Check usage limits
    if (!checkUsageLimits(fileArray.length)) {
      return;
    }

    // Validate file types
    const validFiles = fileArray.filter(file => {
      if (!allowedFormats.includes(file.type)) {
        console.warn(`Skipping unsupported file type: ${file.type}`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        console.warn(`Skipping large file: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length !== fileArray.length) {
      const skipped = fileArray.length - validFiles.length;
      alert(`${skipped} files were skipped (unsupported format or too large)`);
    }

    // Create batch file objects
    const batchFiles: BatchFile[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: 'pending',
      progress: 0
    }));

    setFiles(batchFiles);
    setProcessingStats({
      total: batchFiles.length,
      completed: 0,
      errors: 0,
      startTime: null,
      estimatedTimeRemaining: null
    });

  }, [maxFiles, allowedFormats, checkUsageLimits]);

  // Process single file
  const processFile = useCallback(async (batchFile: BatchFile): Promise<BatchFile> => {
    try {
      // Update status to processing
      setFiles(prev => prev.map(f => 
        f.id === batchFile.id 
          ? { ...f, status: 'processing', progress: 10 }
          : f
      ));

      // Extract metadata
      const metadata = await extractMetadata(batchFile.file);
      
      // Update progress to 90% after metadata extraction
      setFiles(prev => prev.map(f => 
        f.id === batchFile.id 
          ? { ...f, progress: 90 }
          : f
      ));

      // Complete processing
      const completedFile: BatchFile = {
        ...batchFile,
        status: 'completed',
        metadata,
        progress: 100
      };

      setFiles(prev => prev.map(f => 
        f.id === batchFile.id ? completedFile : f
      ));

      // Track usage
      usageTracker.trackImageProcessed();

      return completedFile;
    } catch (error) {
      console.error(`Error processing ${batchFile.file.name}:`, error);
      
      const errorFile: BatchFile = {
        ...batchFile,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        progress: 0
      };

      setFiles(prev => prev.map(f => 
        f.id === batchFile.id ? errorFile : f
      ));

      return errorFile;
    }
  }, []);

  // Process all files
  const processBatch = useCallback(async () => {
    if (files.length === 0 || isProcessing) return;

    setIsProcessing(true);
    processingRef.current = true;
    
    const startTime = new Date();
    setProcessingStats(prev => ({
      ...prev,
      startTime,
      completed: 0,
      errors: 0
    }));


    try {
      // Process files in parallel with concurrency limit
      const concurrency = 3; // Process 3 files at a time
      const results: BatchFile[] = [];
      
      for (let i = 0; i < files.length; i += concurrency) {
        if (!processingRef.current) break; // Check if cancelled
        
        const batch = files.slice(i, i + concurrency);
        const batchResults = await Promise.all(
          batch.map(file => processFile(file))
        );
        
        results.push(...batchResults);
        
        // Update overall progress
        const completed = results.filter(f => f.status === 'completed').length;
        const errors = results.filter(f => f.status === 'error').length;
        const progress = (results.length / files.length) * 100;
        
        setOverallProgress(progress);
        setProcessingStats(prev => ({
          ...prev,
          completed,
          errors,
          estimatedTimeRemaining: calculateETA(startTime, results.length, files.length)
        }));
        
        onProgress?.(progress);
      }

      // Final update
      const finalCompleted = results.filter(f => f.status === 'completed').length;
      const finalErrors = results.filter(f => f.status === 'error').length;
      
      setProcessingStats(prev => ({
        ...prev,
        completed: finalCompleted,
        errors: finalErrors,
        estimatedTimeRemaining: 0
      }));

      onComplete?.(results);

    } catch (error) {
      console.error('Batch processing error:', error);
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
    }
  }, [files, isProcessing, processFile, onProgress, onComplete]);

  // Calculate estimated time remaining
  const calculateETA = (startTime: Date, completed: number, total: number): number | null => {
    if (completed === 0) return null;
    
    const elapsed = Date.now() - startTime.getTime();
    const avgTimePerFile = elapsed / completed;
    const remaining = total - completed;
    
    return Math.round((remaining * avgTimePerFile) / 1000); // seconds
  };

  // Cancel processing
  const cancelProcessing = useCallback(() => {
    processingRef.current = false;
    setIsProcessing(false);
  }, []);



  // Export results
  const exportResults = useCallback(async () => {
    const completedFiles = files.filter(f => f.status === 'completed');
    if (completedFiles.length === 0) return;

    try {
      // Check if user has export limits
      const usage = usageTracker.getCurrentUsage();
      const limits = usageTracker.getLimits();
      
      if (usage.dataExports >= limits.dataExportsPerDay) {
        await showUpgradeCapture({
          title: '📊 Export Limit Reached',
          subtitle: 'Upgrade to get unlimited exports',
          incentive: 'Pro users get unlimited data exports'
        });
        return;
      }

      // Create export data
      const exportData = {
        timestamp: new Date().toISOString(),
        totalFiles: files.length,
        successfulFiles: completedFiles.length,
        failedFiles: files.filter(f => f.status === 'error').length,
        processingTime: processingStats.startTime 
          ? Math.round((Date.now() - processingStats.startTime.getTime()) / 1000)
          : 0,
        results: completedFiles.map(f => ({
          filename: f.file.name,
          size: f.file.size,
          type: f.file.type,
          metadata: f.metadata
        }))
      };

      // Download as JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proofpix-batch-results-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      usageTracker.trackDataExport();

    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export results. Please try again.');
    }
  }, [files, processingStats, showUpgradeCapture]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Format time
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // 🔒 PAYMENT PROTECTION: Show upgrade prompt if user can't access batch processing
  if (!canUseBatch) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Modern Enterprise Upgrade Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
            <div className="relative z-10 text-center">
              <div className="bg-purple-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Batch Processing - Premium Feature
              </h2>
              
              <p className="text-slate-300 mb-6">
                Process multiple images simultaneously with advanced export options. 
                Upgrade to unlock batch processing for faster workflows.
              </p>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 mb-6">
                <h3 className="text-white font-semibold mb-2">Current Plan: {currentPlan.plan?.name || 'Free'}</h3>
                <p className="text-slate-400 text-sm">
                  {currentPlan.type === 'free' 
                    ? 'Single image processing only' 
                    : 'Batch processing not included in this plan'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    window.location.href = '/pricing';
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Pro
                </button>
                
                <p className="text-xs text-slate-500">
                  Starting at $2.99 for 24-hour access • No account required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Modern Header */}
        <div className="text-center mb-8">
          <div className="bg-purple-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Zap className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Batch Image Processing</h1>
          <p className="text-slate-400">Upload multiple images for batch processing and export</p>
        </div>

        {/* File Upload Area */}
        <div className="mb-8">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedFormats.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-800/30 transition-all duration-300"
          >
            <div className="bg-slate-700/50 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Upload className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Select Multiple Images
            </h3>
            <p className="text-slate-400 mb-2">
              Choose up to {maxFiles} images for batch processing
            </p>
            <p className="text-sm text-slate-500">
              Supported: JPEG, PNG, TIFF, WebP (max 50MB each)
            </p>
          </div>
        </div>

        {/* Processing Stats */}
        {files.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {processingStats.total}
                </div>
                <div className="text-slate-400 text-sm">Total Files</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {processingStats.completed}
                </div>
                <div className="text-slate-400 text-sm">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400 mb-1">
                  {processingStats.errors}
                </div>
                <div className="text-slate-400 text-sm">Errors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {Math.round(overallProgress)}%
                </div>
                <div className="text-slate-400 text-sm">Progress</div>
              </div>
            </div>
            
            {processingStats.estimatedTimeRemaining !== null && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Estimated time remaining: {formatTime(processingStats.estimatedTimeRemaining)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Overall Progress Bar */}
        {isProcessing && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-300">Overall Progress</span>
              <span className="text-sm font-medium text-slate-300">{Math.round(overallProgress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {files.length > 0 && (
          <div className="flex gap-4 mb-8">
            {!isProcessing ? (
              <button
                onClick={processBatch}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Play className="h-5 w-5 mr-2 inline" />
                Start Processing ({files.length} files)
              </button>
            ) : (
              <button
                onClick={cancelProcessing}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Square className="h-5 w-5 mr-2 inline" />
                Cancel Processing
              </button>
            )}
            
            {processingStats.completed > 0 && (
              <button
                onClick={exportResults}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isProcessing}
              >
                <Download className="h-5 w-5 mr-2 inline" />
                Export Results
              </button>
            )}
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Processing Queue</h3>
            </div>
            <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {file.status === 'pending' && (
                        <div className="w-10 h-10 bg-slate-600/20 border border-slate-500/30 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                      {file.status === 'processing' && (
                        <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                          <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
                        </div>
                      )}
                      {file.status === 'completed' && (
                        <div className="w-10 h-10 bg-green-600/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                      )}
                      {file.status === 'error' && (
                        <div className="w-10 h-10 bg-red-600/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {file.file.name}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span>{formatFileSize(file.file.size)}</span>
                        {file.status === 'processing' && (
                          <span>{file.progress}% complete</span>
                        )}
                        {file.error && (
                          <span className="text-red-400">Error: {file.error}</span>
                        )}
                      </div>
                      
                      {file.status === 'processing' && (
                        <div className="mt-2">
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      file.status === 'pending' ? 'bg-slate-600/20 text-slate-400 border border-slate-500/30' :
                      file.status === 'processing' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' :
                      file.status === 'completed' ? 'bg-green-600/20 text-green-400 border border-green-500/30' :
                      'bg-red-600/20 text-red-400 border border-red-500/30'
                    }`}>
                      {file.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchProcessor; 
