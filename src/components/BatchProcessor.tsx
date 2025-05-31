import React, { useState, useCallback, useRef } from 'react';
import { Lock, Crown } from 'lucide-react';
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

  // 🔒 PAYMENT PROTECTION: Show upgrade prompt for free users
  if (!canUseBatch) {
    return (
      <div className="batch-processor bg-gray-800 rounded-lg p-6">
        <div className="text-center py-12">
          <div className="bg-yellow-500/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-12 w-12 text-yellow-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            🚀 Batch Processing - Premium Feature
          </h2>
          
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Process multiple images simultaneously with advanced export options. 
            Upgrade to unlock batch processing for faster workflows.
          </p>

          <div className="bg-gray-700/50 rounded-lg p-4 mb-6 max-w-sm mx-auto">
            <h3 className="text-white font-semibold mb-2">Current Plan: {currentPlan.plan?.name || 'Free'}</h3>
            <p className="text-gray-400 text-sm">
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
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 flex items-center justify-center mx-auto"
            >
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to Pro
            </button>
            
            <p className="text-xs text-gray-500">
              Starting at $2.99 for 24-hour access • No account required
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="batch-processor bg-gray-800 rounded-lg p-6">
      <div className="batch-header mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Batch Image Processing</h2>
        <p className="text-gray-400">Upload multiple images for batch processing and export</p>
      </div>

      {/* File Upload Area */}
      <div className="mb-6">
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
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Select Multiple Images
          </h3>
          <p className="text-gray-400 mb-2">
            Choose up to {maxFiles} images for batch processing
          </p>
          <p className="text-sm text-gray-500">
            Supported: JPEG, PNG, TIFF, WebP (max 50MB each)
          </p>
        </div>
      </div>

      {/* Processing Stats */}
      {files.length > 0 && (
        <div className="batch-stats bg-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {processingStats.total}
              </div>
              <div className="text-gray-400 text-sm">Total Files</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {processingStats.completed}
              </div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {processingStats.errors}
              </div>
              <div className="text-gray-400 text-sm">Errors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(overallProgress)}%
              </div>
              <div className="text-gray-400 text-sm">Progress</div>
            </div>
          </div>
          
          {processingStats.estimatedTimeRemaining !== null && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Estimated time remaining: {formatTime(processingStats.estimatedTimeRemaining)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Overall Progress Bar */}
      {isProcessing && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-sm text-gray-400">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex gap-4 mb-6">
          {!isProcessing ? (
            <button
              onClick={processBatch}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              🚀 Start Processing ({files.length} files)
            </button>
          ) : (
            <button
              onClick={cancelProcessing}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              ⏹️ Cancel Processing
            </button>
          )}
          
          {processingStats.completed > 0 && (
            <button
              onClick={exportResults}
              className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              disabled={isProcessing}
            >
              📥 Export Results
            </button>
          )}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {file.status === 'pending' && (
                    <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-xs">⏳</span>
                    </div>
                  )}
                  {file.status === 'processing' && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-spin">
                      <span className="text-xs">⚙️</span>
                    </div>
                  )}
                  {file.status === 'completed' && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs">✅</span>
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs">❌</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {file.file.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(file.file.size)}
                    {file.error && (
                      <span className="text-red-400 ml-2">• {file.error}</span>
                    )}
                  </p>
                </div>
              </div>
              
              {file.status === 'processing' && (
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-10">
                    {file.progress}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Ready for Batch Processing
          </h3>
          <p className="text-gray-400 mb-4">
            Upload multiple images to analyze them simultaneously
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Select Images
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchProcessor; 
