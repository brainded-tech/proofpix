import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Image, 
  X, 
  CheckCircle, 
  AlertTriangle,
  File,
  Camera,
  Folder
} from 'lucide-react';

interface DemoFile {
  id: string;
  name: string;
  size: string;
  type: string;
  preview?: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

interface DemoFileUploaderProps {
  industryType: string;
  onFilesReady: (files: DemoFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const DemoFileUploader: React.FC<DemoFileUploaderProps> = ({
  industryType,
  onFilesReady,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx']
}) => {
  const [files, setFiles] = useState<DemoFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const getIndustryColor = (industry: string) => {
    const colors = {
      legal: 'from-blue-600 to-indigo-700',
      healthcare: 'from-green-600 to-emerald-700',
      insurance: 'from-orange-600 to-red-700',
      enterprise: 'from-purple-600 to-violet-700'
    };
    return colors[industry as keyof typeof colors] || 'from-gray-600 to-gray-700';
  };

  const getIndustryExamples = (industry: string) => {
    const examples = {
      legal: [
        'Contract documents (PDF)',
        'Legal correspondence',
        'Evidence photos',
        'Court filings',
        'Witness statements'
      ],
      healthcare: [
        'Medical records (PDF)',
        'X-ray images',
        'Lab reports',
        'Patient forms',
        'Insurance documents'
      ],
      insurance: [
        'Claim photos',
        'Damage assessments',
        'Policy documents',
        'Accident reports',
        'Repair estimates'
      ],
      enterprise: [
        'Business documents',
        'Financial reports',
        'Product images',
        'Compliance forms',
        'Training materials'
      ]
    };
    return examples[industry as keyof typeof examples] || examples.enterprise;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="w-6 h-6" />;
    if (fileType.includes('pdf')) return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const simulateFileUpload = (file: DemoFile) => {
    const updateProgress = () => {
      setFiles(prevFiles => 
        prevFiles.map(f => {
          if (f.id === file.id && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + Math.random() * 20 + 10, 100);
            const newStatus = newProgress >= 100 ? 'completed' : 'uploading';
            return { ...f, progress: newProgress, status: newStatus };
          }
          return f;
        })
      );
    };

    const interval = setInterval(() => {
      updateProgress();
      
      setFiles(currentFiles => {
        const currentFile = currentFiles.find(f => f.id === file.id);
        if (currentFile && currentFile.progress !== undefined && currentFile.progress >= 100) {
          clearInterval(interval);
          return currentFiles;
        }
        return currentFiles;
      });
    }, 200 + Math.random() * 300);
  };

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: DemoFile[] = Array.from(selectedFiles).slice(0, maxFiles - files.length).map((file, index) => ({
      id: `demo_file_${Date.now()}_${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: file.type || 'application/octet-stream',
      status: 'uploading',
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    // Simulate upload for each file
    newFiles.forEach(file => {
      setTimeout(() => simulateFileUpload(file), Math.random() * 1000);
    });

    // Check when all uploads are complete
    setTimeout(() => {
      const checkCompletion = () => {
        setFiles(currentFiles => {
          const allCompleted = currentFiles.every(f => f.status !== 'uploading');
          if (allCompleted && currentFiles.length > 0) {
            setIsUploading(false);
            onFilesReady(currentFiles.filter(f => f.status === 'completed'));
          }
          return currentFiles;
        });
      };
      
      const completionCheck = setInterval(() => {
        checkCompletion();
        setFiles(currentFiles => {
          if (currentFiles.every(f => f.status !== 'uploading')) {
            clearInterval(completionCheck);
          }
          return currentFiles;
        });
      }, 500);
    }, 1000);
  }, [files.length, maxFiles, onFilesReady]);

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
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      if (newFiles.length === 0) {
        setIsUploading(false);
      }
      return newFiles;
    });
  };

  const addSampleFiles = () => {
    const sampleFiles: DemoFile[] = [
      {
        id: 'sample_1',
        name: `${industryType}_document_1.pdf`,
        size: '2.4 MB',
        type: 'application/pdf',
        status: 'uploading',
        progress: 0
      },
      {
        id: 'sample_2',
        name: `${industryType}_image_1.jpg`,
        size: '1.8 MB',
        type: 'image/jpeg',
        status: 'uploading',
        progress: 0
      }
    ];

    setFiles(prev => [...prev, ...sampleFiles]);
    setIsUploading(true);

    sampleFiles.forEach(file => {
      setTimeout(() => simulateFileUpload(file), Math.random() * 500);
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? `border-blue-400 bg-blue-50`
            : files.length > 0
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={files.length >= maxFiles}
        />

        <div className="space-y-4">
          <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${getIndustryColor(industryType)} rounded-full flex items-center justify-center`}>
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload {industryType} Documents
            </h3>
            <p className="text-gray-600">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Maximum {maxFiles} files • PDF, Images, Documents
            </p>
          </div>

          {files.length === 0 && (
            <button
              onClick={addSampleFiles}
              className={`px-4 py-2 bg-gradient-to-r ${getIndustryColor(industryType)} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
            >
              Try Sample Files
            </button>
          )}
        </div>
      </div>

      {/* Industry Examples */}
      {files.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Perfect for {industryType} documents like:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getIndustryExamples(industryType).map((example, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                {example}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                Uploaded Files ({files.length}/{maxFiles})
              </h4>
              {isUploading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-4">
                    {/* File Icon/Preview */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {file.preview ? (
                        <img 
                          src={file.preview} 
                          alt={file.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 truncate">{file.name}</h5>
                      <p className="text-sm text-gray-500">{file.size}</p>
                      
                      {/* Progress Bar */}
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Uploading...</span>
                            <span>{Math.round(file.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="h-2 bg-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${file.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-2">
                      {file.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Notice */}
      {files.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-amber-900">Demo Mode</h4>
              <p className="text-amber-700 text-sm">
                Files are processed locally for demonstration. No data is uploaded to our servers.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoFileUploader; 