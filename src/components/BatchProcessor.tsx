import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Upload, X, FileImage, Download, AlertCircle, CheckCircle, Clock, ChevronDown, Lock, Crown } from 'lucide-react';
import { extractMetadata } from '../utils/metadata';
import { ProcessedImage } from '../types';
import { analytics } from '../utils/analytics';
import SessionManager from '../utils/sessionManager';
// import { LoadingSpinner, ProgressBar } from './LoadingStates';
// import EnhancedExportDialog from './EnhancedExportDialog';

interface BatchProcessorProps {
  onComplete?: (images: ProcessedImage[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
}

interface BatchItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  processedImage?: ProcessedImage;
  error?: string;
  progress?: number;
  expanded?: boolean;
}

const BatchProcessor: React.FC<BatchProcessorProps> = ({
  onComplete,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024 // 50MB
}) => {
  console.log('🔄 BatchProcessor component rendered', { onComplete, maxFiles, maxFileSize });
  
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔒 PAYMENT PROTECTION: Check if user can access batch processing
  const canUseBatch = SessionManager.canPerformAction('batch');
  const currentPlan = SessionManager.getCurrentPlan();
  
  console.log('🔒 Batch access check:', { canUseBatch, planType: currentPlan.type, planName: currentPlan.plan?.name });

  const supportedFormats = useMemo(() => [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/tiff',
    'image/heic',
    'image/heif'
  ], []);

  // 🔒 PAYMENT PROTECTION: Redirect to pricing if not authorized
  const handleUpgradeClick = useCallback(() => {
    analytics.trackFeatureUsage('Payment Protection', 'Batch Upgrade Click');
    window.location.href = '/pricing';
  }, []);

  // 🔒 PAYMENT PROTECTION: Block file selection for free users
  const handleFileSelect = useCallback((files: FileList) => {
    if (!canUseBatch) {
      console.log('🚫 Batch processing blocked - payment required');
      analytics.trackFeatureUsage('Payment Protection', 'Batch Access Denied');
      return;
    }

    console.log('📁 Files selected for batch processing:', files.length);
    
    const newItems: BatchItem[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file, index) => {
      console.log(`📄 Processing file ${index + 1}:`, { name: file.name, type: file.type, size: file.size });
      
      // Check file count limit
      if (batchItems.length + newItems.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Check file type
      if (!supportedFormats.includes(file.type)) {
        errors.push(`${file.name}: Unsupported format`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File too large (max ${Math.round(maxFileSize / 1024 / 1024)}MB)`);
        return;
      }

      newItems.push({
        id: `${Date.now()}_${index}`,
        file,
        status: 'pending'
      });
    });

    console.log('✅ Valid files for batch:', newItems.length);
    console.log('❌ Validation errors:', errors);

    if (errors.length > 0) {
      console.warn('File validation errors:', errors);
      // Show errors via toast system
      errors.forEach(error => {
        analytics.trackError('Batch Upload', error);
      });
    }

    if (newItems.length > 0) {
      setBatchItems(prev => {
        const updated = [...prev, ...newItems];
        console.log('📊 Updated batch items:', updated.length);
        return updated;
      });
      analytics.trackFeatureUsage('Batch Upload', `${newItems.length} files added`);
    }
  }, [batchItems.length, maxFiles, maxFileSize, supportedFormats, canUseBatch]);

  // 🔒 PAYMENT PROTECTION: Block drag and drop for free users
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (!canUseBatch) {
      console.log('🚫 Batch drop blocked - payment required');
      analytics.trackFeatureUsage('Payment Protection', 'Batch Drop Denied');
      return;
    }

    console.log('🎯 Files dropped on batch processor');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect, canUseBatch]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeItem = useCallback((id: string) => {
    console.log('🗑️ Removing batch item:', id);
    setBatchItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleItemExpanded = useCallback((id: string) => {
    setBatchItems(prev => prev.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  }, []);

  // 🔒 PAYMENT PROTECTION: Block processing for free users
  const processAllItems = useCallback(async () => {
    if (!canUseBatch) {
      console.log('🚫 Batch processing blocked - payment required');
      analytics.trackFeatureUsage('Payment Protection', 'Batch Process Denied');
      return;
    }

    if (isProcessing) {
      console.log('⚠️ Already processing, skipping');
      return;
    }

    console.log('🚀 Starting batch processing');
    setIsProcessing(true);
    setOverallProgress(0);

    const pendingItems = batchItems.filter(item => item.status === 'pending' || item.status === 'error');
    console.log('📋 Items to process:', pendingItems.length);
    
    let completedCount = 0;

    for (const item of pendingItems) {
      try {
        console.log(`🔄 Processing: ${item.file.name}`);
        
        // Update item status to processing
        setBatchItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, status: 'processing', progress: 0 } : i
        ));

        // Extract metadata
        const metadata = await extractMetadata(item.file);
        console.log(`✅ Metadata extracted for: ${item.file.name}`);
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(item.file);
        
        const processedImage: ProcessedImage = {
          file: item.file,
          metadata,
          previewUrl
        };

        // Update item status to completed
        setBatchItems(prev => prev.map(i => 
          i.id === item.id ? { 
            ...i, 
            status: 'completed', 
            processedImage,
            progress: 100 
          } : i
        ));

        completedCount++;
        setOverallProgress((completedCount / pendingItems.length) * 100);

        analytics.trackFeatureUsage('Batch Processing', 'Image Processed');

      } catch (error) {
        console.error(`❌ Error processing ${item.file.name}:`, error);
        
        // Update item status to error
        setBatchItems(prev => prev.map(i => 
          i.id === item.id ? { 
            ...i, 
            status: 'error', 
            error: 'Failed to process image'
          } : i
        ));

        analytics.trackError('Batch Processing', `Failed: ${item.file.name}`);
      }
    }

    setIsProcessing(false);
    console.log('🏁 Batch processing completed');
    
    // Get all completed images
    const completedImages = batchItems
      .filter(item => item.status === 'completed' && item.processedImage)
      .map(item => item.processedImage!);

    if (onComplete && completedImages.length > 0) {
      onComplete(completedImages);
    }

    analytics.trackFeatureUsage('Batch Processing', `Completed ${completedImages.length} images`);
  }, [batchItems, isProcessing, onComplete, canUseBatch]);

  const retryFailedItems = useCallback(() => {
    setBatchItems(prev => prev.map(item => 
      item.status === 'error' ? { ...item, status: 'pending', error: undefined } : item
    ));
  }, []);

  const clearCompleted = useCallback(() => {
    setBatchItems(prev => prev.filter(item => item.status !== 'completed'));
  }, []);

  const clearAll = useCallback(() => {
    setBatchItems([]);
    setOverallProgress(0);
  }, []);

  const handleExportAll = useCallback(() => {
    const completedImages = batchItems
      .filter(item => item.status === 'completed' && item.processedImage)
      .map(item => item.processedImage!);

    if (completedImages.length > 0) {
      setShowExportDialog(true);
    }
  }, [batchItems]);

  const getStatusIcon = (status: BatchItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-gray-400" />;
      case 'processing':
        return <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>;
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
    }
  };

  const formatMetadataPreview = (metadata: any) => {
    const items = [];
    
    if (metadata.make || metadata.model) {
      items.push({ label: 'Camera', value: `${metadata.make || ''} ${metadata.model || ''}`.trim() });
    }
    if (metadata.dateTime) {
      items.push({ label: 'Date Taken', value: metadata.dateTime });
    }
    if (metadata.imageWidth && metadata.imageHeight) {
      items.push({ label: 'Dimensions', value: `${metadata.imageWidth} × ${metadata.imageHeight}` });
    }
    if (metadata.exposureTime) {
      items.push({ label: 'Exposure', value: metadata.exposureTime });
    }
    if (metadata.fNumber) {
      items.push({ label: 'Aperture', value: `f/${metadata.fNumber}` });
    }
    if (metadata.iso) {
      items.push({ label: 'ISO', value: metadata.iso });
    }
    if (metadata.focalLength) {
      items.push({ label: 'Focal Length', value: metadata.focalLength });
    }
    if (metadata.gpsLatitude && metadata.gpsLongitude) {
      items.push({ 
        label: 'GPS Location', 
        value: `${metadata.gpsLatitude.toFixed(4)}, ${metadata.gpsLongitude.toFixed(4)}` 
      });
    }
    
    return items.slice(0, 6); // Limit to 6 items for clean display
  };

  const completedCount = batchItems.filter(item => item.status === 'completed').length;
  const errorCount = batchItems.filter(item => item.status === 'error').length;
  const pendingCount = batchItems.filter(item => item.status === 'pending').length;

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
              onClick={handleUpgradeClick}
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
      <div 
        className="upload-area border-2 border-dashed border-gray-600 rounded-xl p-8 text-center mb-6 hover:border-blue-500 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gray-700 rounded-full group-hover:bg-blue-600/20 transition-colors duration-200">
            <Upload size={48} className="text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
          </div>
          <div>
            <p className="text-white text-lg font-medium mb-2">Drop images here or click to browse</p>
            <p className="text-gray-400 text-sm">
              Supports JPEG, PNG, TIFF, HEIC • Max {maxFiles} files • Max {Math.round(maxFileSize / 1024 / 1024)}MB each
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={supportedFormats.join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Batch Stats */}
      {batchItems.length > 0 && (
        <div className="batch-stats bg-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{batchItems.length}</div>
              <div className="text-gray-400 text-sm">Total Files</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{completedCount}</div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
              <div className="text-gray-400 text-sm">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">{errorCount}</div>
              <div className="text-gray-400 text-sm">Errors</div>
            </div>
          </div>
          
          {isProcessing && (
            <div className="mt-4">
              <div className="w-full">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span className="flex items-center space-x-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span>Processing batch...</span>
                  </span>
                  <span className="font-medium text-blue-400">{Math.round(overallProgress)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                    style={{ width: `${overallProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{batchItems.filter(item => item.status === 'completed').length} completed</span>
                  <span>{batchItems.filter(item => item.status === 'pending' || item.status === 'processing').length} remaining</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Batch Actions */}
      {batchItems.length > 0 && (
        <div className="batch-actions flex flex-wrap gap-3 mb-6">
          <button
            onClick={processAllItems}
            disabled={isProcessing || pendingCount === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FileImage size={16} className="mr-2" />
            Process {pendingCount > 0 ? `${pendingCount} ` : ''}Images
          </button>

          {completedCount > 0 && (
            <button
              onClick={handleExportAll}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} className="mr-2" />
              Export All ({completedCount})
            </button>
          )}

          {errorCount > 0 && (
            <button
              onClick={retryFailedItems}
              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <AlertCircle size={16} className="mr-2" />
              Retry Failed ({errorCount})
            </button>
          )}

          <button
            onClick={clearCompleted}
            disabled={completedCount === 0}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear Completed
          </button>

          <button
            onClick={clearAll}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <X size={16} className="mr-2" />
            Clear All
          </button>
        </div>
      )}

      {/* Batch Items List */}
      {batchItems.length > 0 && (
        <div className="batch-items space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Files ({batchItems.length})</h3>
            <div className="text-sm text-gray-400">
              {isProcessing ? 'Processing...' : 'Ready to process'}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-3">
            {batchItems.map((item) => (
              <div key={item.id} className={`batch-item bg-gray-700 rounded-xl border transition-all duration-200 ${
                item.status === 'completed' ? 'border-green-500/30 bg-green-900/10' :
                item.status === 'error' ? 'border-red-500/30 bg-red-900/10' :
                item.status === 'processing' ? 'border-blue-500/30 bg-blue-900/10' :
                'border-gray-600 hover:border-gray-500'
              }`}>
                {/* Main Item Header - Clickable */}
                <div 
                  className="flex items-center space-x-4 p-4 cursor-pointer hover:bg-gray-600/30 transition-colors duration-200"
                  onClick={() => toggleItemExpanded(item.id)}
                >
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium truncate pr-2">{item.file.name}</h4>
                      <div className="flex items-center space-x-2">
                        {item.status === 'completed' && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                            Complete
                          </span>
                        )}
                        {item.status === 'error' && (
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                            Failed
                          </span>
                        )}
                        {item.status === 'processing' && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                            Processing
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{(item.file.size / 1024 / 1024).toFixed(2)} MB • {item.file.type.split('/')[1].toUpperCase()}</span>
                      {item.status === 'processing' && item.progress !== undefined && (
                        <span className="text-blue-400">{Math.round(item.progress)}%</span>
                      )}
                    </div>
                    
                    {/* Progress Bar for Processing */}
                    {item.status === 'processing' && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300 relative overflow-hidden"
                            style={{ width: `${item.progress || 0}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {item.error && (
                      <div className="mt-2 text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-lg border border-red-500/30">
                        <div className="flex items-center space-x-2">
                          <AlertCircle size={14} />
                          <span>{item.error}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Arrow */}
                  <div className="flex items-center space-x-2">
                    <ChevronDown 
                      size={16} 
                      className={`text-gray-400 transition-transform duration-200 ${
                        item.expanded ? 'rotate-180' : ''
                      }`}
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the dropdown
                        removeItem(item.id);
                      }}
                      disabled={item.status === 'processing'}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-600"
                      title="Remove file"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Expandable Metadata Section */}
                {item.expanded && (
                  <div className="border-t border-gray-600 bg-gray-800/50 rounded-b-xl overflow-hidden">
                    <div className="p-4">
                      {item.status === 'completed' && item.processedImage?.metadata ? (
                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                            <FileImage size={14} className="mr-2" />
                            Metadata Preview
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {formatMetadataPreview(item.processedImage.metadata).map((meta, index) => (
                              <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                                  {meta.label}
                                </div>
                                <div className="text-sm text-white font-medium">
                                  {meta.value}
                                </div>
                              </div>
                            ))}
                          </div>
                          {formatMetadataPreview(item.processedImage.metadata).length === 0 && (
                            <div className="text-sm text-gray-400 italic">
                              No metadata available for this image
                            </div>
                          )}
                        </div>
                      ) : item.status === 'pending' ? (
                        <div className="text-sm text-gray-400 italic flex items-center">
                          <Clock size={14} className="mr-2" />
                          Metadata will be available after processing
                        </div>
                      ) : item.status === 'processing' ? (
                        <div className="text-sm text-blue-400 italic flex items-center">
                          <div className="inline-block animate-spin rounded-full h-3 w-3 border-b border-blue-400 mr-2"></div>
                          Processing metadata...
                        </div>
                      ) : (
                        <div className="text-sm text-red-400 italic flex items-center">
                          <AlertCircle size={14} className="mr-2" />
                          Failed to extract metadata
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Export Dialog - Temporarily disabled for debugging */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">Export Options</h3>
            <p className="text-gray-400 mb-4">
              Export functionality temporarily disabled for debugging. 
              {completedCount} images ready for export.
            </p>
            <button
              onClick={() => setShowExportDialog(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchProcessor; 