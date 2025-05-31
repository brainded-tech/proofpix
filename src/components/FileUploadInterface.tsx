import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, FileText, Image, AlertCircle, CheckCircle, Clock, User, Building, Hash, Layers, Shield } from 'lucide-react';
import { chainOfCustody } from '../utils/chainOfCustody';
import ImageComparisonTool from './ImageComparisonTool';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onFileProcessed: (file: File, metadata: any) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFormats?: string[];
  className?: string;
  enableChainOfCustody?: boolean;
  custodyOptions?: {
    caseNumber?: string;
    evidenceTag?: string;
    investigator?: string;
    department?: string;
    classification?: 'public' | 'internal' | 'confidential' | 'restricted';
    frameworks?: string[];
  };
}

interface FileStatus {
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  metadata?: any;
  error?: string;
  custodyId?: string;
}

export const FileUploadInterface: React.FC<FileUploadProps> = ({
  onFilesSelected,
  onFileProcessed,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/tiff', 'image/heic', 'image/webp'],
  className = '',
  enableChainOfCustody = false,
  custodyOptions = {}
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'comparison'>('single');
  const [showComparisonTool, setShowComparisonTool] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has access to chain of custody
  const userTier = localStorage.getItem('proofpix_user_tier') || 'free';
  const hasChainOfCustodyAccess = userTier === 'pro' || userTier === 'enterprise';
  const shouldUseChainOfCustody = enableChainOfCustody && hasChainOfCustodyAccess;

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Unsupported file format. Accepted formats: ${acceptedFormats.join(', ')}`;
    }
    
    if (file.size > maxFileSize) {
      return `File too large. Maximum size: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`;
    }
    
    return null;
  }, [acceptedFormats, maxFileSize]);

  const processFile = async (fileStatus: FileStatus): Promise<void> => {
    try {
      // Update status to processing
      setFiles(prev => prev.map(f => 
        f.file === fileStatus.file 
          ? { ...f, status: 'processing', progress: 0 }
          : f
      ));

      let custodyId: string | undefined;

      // Initialize chain of custody if enabled
      if (shouldUseChainOfCustody) {
        try {
          custodyId = await chainOfCustody.initializeChainOfCustody(fileStatus.file, {
            caseNumber: custodyOptions.caseNumber,
            evidenceTag: custodyOptions.evidenceTag,
            investigator: custodyOptions.investigator,
            department: custodyOptions.department,
            classification: custodyOptions.classification || 'confidential',
            frameworks: custodyOptions.frameworks || ['FRE', 'FRCP']
          });

          // Update file status with custody ID
          setFiles(prev => prev.map(f => 
            f.file === fileStatus.file 
              ? { ...f, custodyId, progress: 25 }
              : f
          ));

          // Add access event to chain of custody
          await chainOfCustody.addCustodyEvent(
            custodyId,
            'access',
            'File accessed for metadata extraction and analysis'
          );

          setFiles(prev => prev.map(f => 
            f.file === fileStatus.file 
              ? { ...f, progress: 50 }
              : f
          ));
        } catch (error) {
          console.error('Chain of custody initialization failed:', error);
          // Continue processing without chain of custody
        }
      }

      // Simulate metadata extraction progress
      const progressSteps = shouldUseChainOfCustody ? [75, 90, 100] : [25, 50, 75, 100];
      for (const progress of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.file === fileStatus.file 
            ? { ...f, progress }
            : f
        ));
      }

      // Mock metadata extraction (replace with actual implementation)
      const mockMetadata = {
        fileName: fileStatus.file.name,
        fileSize: fileStatus.file.size,
        fileType: fileStatus.file.type,
        lastModified: new Date(fileStatus.file.lastModified),
        custodyId: custodyId,
        chainOfCustodyEnabled: shouldUseChainOfCustody,
        // Add more metadata fields as needed
      };

      // Add analysis event to chain of custody
      if (shouldUseChainOfCustody && custodyId) {
        try {
          await chainOfCustody.addCustodyEvent(
            custodyId,
            'analysis',
            'Metadata extraction and analysis completed'
          );
        } catch (error) {
          console.error('Failed to add analysis event to chain of custody:', error);
        }
      }

      // Update status to completed
      setFiles(prev => prev.map(f => 
        f.file === fileStatus.file 
          ? { ...f, status: 'completed', progress: 100, metadata: mockMetadata, custodyId }
          : f
      ));

      onFileProcessed(fileStatus.file, mockMetadata);
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.file === fileStatus.file 
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Processing failed' }
          : f
      ));
    }
  };

  const handleFiles = useCallback(async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    
    if (files.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: FileStatus[] = [];
    const invalidFiles: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        invalidFiles.push(`${file.name}: ${error}`);
      } else {
        validFiles.push({
          file,
          status: 'pending',
          progress: 0
        });
      }
    });

    if (invalidFiles.length > 0) {
      alert(`Invalid files:\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      onFilesSelected(validFiles.map(f => f.file));
      
      // Start processing files
      setIsProcessing(true);
      for (const fileStatus of validFiles) {
        await processFile(fileStatus);
      }
      setIsProcessing(false);
    }
  }, [files.length, maxFiles, validateFile, onFilesSelected, onFileProcessed, shouldUseChainOfCustody, custodyOptions]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  }, [handleFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const removeFile = useCallback((fileToRemove: File) => {
    setFiles(prev => prev.filter(f => f.file !== fileToRemove));
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const getStatusIcon = (status: FileStatus['status']) => {
    switch (status) {
      case 'pending':
        return <FileText className="h-5 w-5 text-gray-400" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: FileStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'border-gray-300';
      case 'processing':
        return 'border-blue-500';
      case 'completed':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Chain of Custody Status */}
      {shouldUseChainOfCustody && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Chain of Custody Enabled
            </span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
            All uploaded files will be tracked with cryptographic verification and legal compliance
          </p>
        </div>
      )}

      {/* Upgrade Notice for Free Users */}
      {enableChainOfCustody && !hasChainOfCustodyAccess && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Chain of Custody Available in Pro
            </span>
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
            Upgrade to Pro or Enterprise to enable legal-grade file tracking and verification
          </p>
        </div>
      )}

      {/* Upload Mode Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => setUploadMode('single')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              uploadMode === 'single'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Single Image Analysis
          </button>
          <button
            onClick={() => setUploadMode('comparison')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              uploadMode === 'comparison'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Image Comparison
          </button>
        </div>
        
        {uploadMode === 'comparison' && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-start">
              <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">
                  Image Comparison Mode
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  Upload two images to compare their metadata, camera settings, GPS locations, and generate side-by-side analysis reports.
                </p>
                <button
                  onClick={() => setShowComparisonTool(true)}
                  className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 font-medium"
                >
                  Open Comparison Tool →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Tool Modal */}
      {showComparisonTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-auto">
            <ImageComparisonTool onClose={() => setShowComparisonTool(false)} />
          </div>
        </div>
      )}

      {uploadMode === 'single' && (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
            ${isDragOver 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
            ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload image files"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFormats.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
            aria-hidden="true"
          />
          
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {isDragOver ? 'Drop files here' : 'Upload Images'}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Drag and drop your images here, or click to select files
          </p>
          
          <div className="text-sm text-gray-500 dark:text-gray-500">
            <p>Supported formats: JPEG, PNG, TIFF, HEIC, WebP</p>
            <p>Maximum file size: {(maxFileSize / 1024 / 1024).toFixed(1)}MB</p>
            <p>Maximum files: {maxFiles}</p>
            {shouldUseChainOfCustody && (
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                🔒 Chain of custody tracking enabled
              </p>
            )}
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Uploaded Files ({files.length})
            </h4>
            {files.length > 1 && (
              <button
                onClick={clearAllFiles}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                disabled={isProcessing}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {files.map((fileStatus, index) => (
              <div
                key={`${fileStatus.file.name}-${index}`}
                className={`flex items-center space-x-4 p-4 border rounded-lg ${getStatusColor(fileStatus.status)} bg-white dark:bg-gray-800`}
              >
                {getStatusIcon(fileStatus.status)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {fileStatus.file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {fileStatus.custodyId && (
                        <div title="Chain of custody enabled">
                          <Shield className="w-4 h-4 text-blue-500" />
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(fileStatus.file)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        disabled={fileStatus.status === 'processing'}
                        aria-label={`Remove ${fileStatus.file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{(fileStatus.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span className="capitalize">{fileStatus.status}</span>
                  </div>
                  
                  {fileStatus.status === 'processing' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileStatus.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {fileStatus.progress}% complete
                        {shouldUseChainOfCustody && fileStatus.progress <= 50 && ' - Initializing chain of custody...'}
                        {shouldUseChainOfCustody && fileStatus.progress > 50 && fileStatus.progress < 100 && ' - Processing with custody tracking...'}
                      </p>
                    </div>
                  )}
                  
                  {fileStatus.status === 'error' && fileStatus.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {fileStatus.error}
                    </p>
                  )}

                  {fileStatus.status === 'completed' && fileStatus.custodyId && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <Building className="w-3 h-3 inline mr-1" />
                        Chain of custody ID: <span className="font-mono">{fileStatus.custodyId.slice(-8)}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 