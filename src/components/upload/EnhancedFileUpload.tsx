import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  FileImage, 
  File, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  Download,
  Trash2,
  Plus,
  Camera,
  MapPin,
  Clock,
  Shield,
  Zap,
  BarChart3,
  Settings,
  Maximize2,
  Grid3X3,
  List,
  Filter,
  Search,
  RefreshCw,
  Pause,
  Play,
  SkipForward
} from 'lucide-react';

interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: number;
  error?: string;
  metadata?: {
    camera?: string;
    location?: string;
    timestamp?: string;
    size?: string;
    dimensions?: string;
  };
  analysis?: {
    privacyRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    hasGPS: boolean;
    hasPII: boolean;
    confidence: number;
  };
}

interface EnhancedFileUploadProps {
  onUploadComplete?: (files: UploadFile[]) => void;
  onUploadError?: (error: string) => void;
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  enableBatch?: boolean;
  enablePreview?: boolean;
  enableAnalysis?: boolean;
  className?: string;
}

export const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  maxFileSize = 50 * 1024 * 1024, // 50MB
  maxFiles = 10,
  enableBatch = true,
  enablePreview = true,
  enableAnalysis = true,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // Generate preview for image files
  const generatePreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve('');
      }
    });
  }, []);

  // Simulate file analysis
  const analyzeFile = useCallback(async (file: File): Promise<UploadFile['analysis']> => {
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const hasGPS = Math.random() > 0.3;
    const hasPII = Math.random() > 0.7;
    const confidence = 85 + Math.random() * 15;
    
    let privacyRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (hasGPS && hasPII) privacyRisk = 'CRITICAL';
    else if (hasGPS || hasPII) privacyRisk = 'HIGH';
    else if (Math.random() > 0.5) privacyRisk = 'MEDIUM';

    return {
      privacyRisk,
      hasGPS,
      hasPII,
      confidence: Math.round(confidence)
    };
  }, []);

  // Extract metadata simulation
  const extractMetadata = useCallback(async (file: File): Promise<UploadFile['metadata']> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const cameras = ['iPhone 14 Pro', 'Canon EOS R5', 'Sony A7R IV', 'Nikon D850', 'Google Pixel 7'];
    const locations = ['San Francisco, CA', 'New York, NY', 'London, UK', 'Tokyo, Japan', 'Sydney, AU'];
    
    return {
      camera: cameras[Math.floor(Math.random() * cameras.length)],
      location: Math.random() > 0.4 ? locations[Math.floor(Math.random() * locations.length)] : undefined,
      timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      dimensions: file.type.startsWith('image/') ? `${1920 + Math.floor(Math.random() * 2000)} × ${1080 + Math.floor(Math.random() * 1500)}` : undefined
    };
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File size exceeds ${Math.round(maxFileSize / 1024 / 1024)}MB limit`;
    }

    if (acceptedTypes.length > 0) {
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type === type || file.type.startsWith(type.split('/')[0]);
      });

      if (!isAccepted) {
        return `File type not supported. Accepted: ${acceptedTypes.join(', ')}`;
      }
    }

    if (files.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return null;
  }, [acceptedTypes, maxFileSize, maxFiles, files.length]);

  const processFile = useCallback(async (uploadFile: UploadFile) => {
    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f
      ));

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress } : f
        ));
      }

      // Update to processing
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'processing' as const, progress: 0 } : f
      ));

      // Extract metadata and analyze in parallel
      const [metadata, analysis] = await Promise.all([
        extractMetadata(uploadFile.file),
        enableAnalysis ? analyzeFile(uploadFile.file) : Promise.resolve(undefined)
      ]);

      // Complete
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'completed' as const, 
          progress: 100,
          metadata,
          analysis
        } : f
      ));

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'failed' as const, 
          error: error instanceof Error ? error.message : 'Processing failed'
        } : f
      ));
    }
  }, [extractMetadata, analyzeFile, enableAnalysis]);

  const handleFiles = useCallback(async (fileList: FileList) => {
    const newFiles: UploadFile[] = [];
    const errors: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const error = validateFile(file);
      
      if (error) {
        errors.push(`${file.name}: ${error}`);
        continue;
      }

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const preview = enablePreview ? await generatePreview(file) : undefined;
      
      newFiles.push({
        id,
        file,
        preview,
        status: 'pending',
        progress: 0
      });
    }

    if (errors.length > 0) {
      onUploadError?.(errors.join('\n'));
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      
      // Start processing files
      if (enableBatch) {
        setIsProcessing(true);
        for (const uploadFile of newFiles) {
          await processFile(uploadFile);
        }
        setIsProcessing(false);
        onUploadComplete?.(newFiles);
      } else {
        newFiles.forEach(processFile);
      }
    }
  }, [validateFile, generatePreview, enablePreview, enableBatch, processFile, onUploadComplete, onUploadError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const retryFile = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      processFile(file);
    }
  }, [files, processFile]);

  const pauseFile = useCallback((fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'paused' as const } : f
    ));
  }, []);

  const resumeFile = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file && file.status === 'paused') {
      processFile(file);
    }
  }, [files, processFile]);

  const clearCompleted = useCallback(() => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
  }, []);

  const filteredFiles = files.filter(file => {
    if (filterStatus !== 'all' && file.status !== filterStatus) return false;
    if (searchQuery && !file.file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: UploadFile['status']) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'uploading': case 'processing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'HIGH': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'CRITICAL': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900/20';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Zone */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={enableBatch}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700/50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-10 h-10 text-slate-300 group-hover:text-blue-400 transition-colors" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            {dragActive ? 'Drop your photos here' : 'Ready to discover what your photos reveal?'}
          </h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto leading-relaxed">
            {dragActive 
              ? 'Release to start analyzing your photos instantly'
              : 'Every photo tells a hidden story. Drag and drop your images here to uncover GPS locations, camera details, timestamps, and much more—all while keeping your photos completely private on your device.'
            }
          </p>
          
          <motion.button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <FileImage className="w-5 h-5" />
            Choose Photos to Analyze
          </motion.button>
          
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-slate-500">
            <span>Works with any camera or phone</span>
            <span>•</span>
            <span>Results in seconds</span>
            <span>•</span>
            <span className="font-semibold text-emerald-400">
              100% Private
            </span>
          </div>
        </div>
      </motion.div>

      {/* File Management Header */}
      {files.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Files ({filteredFiles.length})
            </h3>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Files</option>
              <option value="pending">Pending</option>
              <option value="uploading">Uploading</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            {/* Actions */}
            <button
              onClick={clearCompleted}
              className="px-3 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium"
            >
              Clear Completed
            </button>
          </div>
        </motion.div>
      )}

      {/* File List */}
      {filteredFiles.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-3'
          }
        >
          <AnimatePresence>
            {filteredFiles.map((uploadFile) => (
              <motion.div
                key={uploadFile.id}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${
                  viewMode === 'grid' ? 'p-4' : 'p-3'
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="space-y-3">
                    {/* Preview */}
                    <div className="relative aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                      {uploadFile.preview ? (
                        <img 
                          src={uploadFile.preview} 
                          alt={uploadFile.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileImage className="w-12 h-12 text-slate-400" />
                        </div>
                      )}
                      
                      {/* Status Overlay */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(uploadFile.status)}`}>
                          {uploadFile.status}
                        </span>
                      </div>

                      {/* Privacy Risk Badge */}
                      {uploadFile.analysis && (
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(uploadFile.analysis.privacyRisk)}`}>
                            {uploadFile.analysis.privacyRisk}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white truncate">
                        {uploadFile.file.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {uploadFile.metadata?.size || `${(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB`}
                      </p>
                    </div>

                    {/* Progress */}
                    {(uploadFile.status === 'uploading' || uploadFile.status === 'processing') && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">
                            {uploadFile.status === 'uploading' ? 'Securely receiving your photo...' : 'Analyzing your photo\'s hidden information...'}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {uploadFile.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadFile.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    {uploadFile.metadata && uploadFile.status === 'completed' && (
                      <div className="space-y-2 text-sm">
                        {uploadFile.metadata.camera && (
                          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                            <Camera className="w-4 h-4" />
                            <span>{uploadFile.metadata.camera}</span>
                          </div>
                        )}
                        {uploadFile.metadata.location && (
                          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                            <MapPin className="w-4 h-4" />
                            <span>{uploadFile.metadata.location}</span>
                          </div>
                        )}
                        {uploadFile.metadata.timestamp && (
                          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>{uploadFile.metadata.timestamp}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {uploadFile.status === 'failed' && (
                          <button
                            onClick={() => retryFile(uploadFile.id)}
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        {uploadFile.status === 'uploading' && (
                          <button
                            onClick={() => pauseFile(uploadFile.id)}
                            className="p-1 text-yellow-600 hover:text-yellow-700"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        )}
                        {uploadFile.status === 'paused' && (
                          <button
                            onClick={() => resumeFile(uploadFile.id)}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {uploadFile.status === 'completed' && (
                          <button className="p-1 text-blue-600 hover:text-blue-700">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <button
                        onClick={() => removeFile(uploadFile.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex items-center space-x-4">
                    {/* Preview Thumbnail */}
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                      {uploadFile.preview ? (
                        <img 
                          src={uploadFile.preview} 
                          alt={uploadFile.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileImage className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 dark:text-white truncate">
                        {uploadFile.file.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>{uploadFile.metadata?.size || `${(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB`}</span>
                        {uploadFile.metadata?.camera && <span>{uploadFile.metadata.camera}</span>}
                        {uploadFile.analysis && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(uploadFile.analysis.privacyRisk)}`}>
                            {uploadFile.analysis.privacyRisk}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status & Progress */}
                    <div className="flex items-center space-x-3">
                      {(uploadFile.status === 'uploading' || uploadFile.status === 'processing') && (
                        <div className="w-24">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(uploadFile.status)}`}>
                        {uploadFile.status}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center space-x-1">
                        {uploadFile.status === 'failed' && (
                          <button
                            onClick={() => retryFile(uploadFile.id)}
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        {uploadFile.status === 'completed' && (
                          <button className="p-1 text-blue-600 hover:text-blue-700">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeFile(uploadFile.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileImage className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Ready to discover what your photos reveal?
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Upload your first photo to see hidden information like location, camera settings, and timestamps—all analyzed privately on your device.
          </p>
        </motion.div>
      )}
    </div>
  );
}; 