import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Shield, 
  Lock,
  X,
  File,
  Image as ImageIcon
} from 'lucide-react';

interface EnterpriseFileUploadProps {
  onFileSelect: (file: File) => void;
  maxSize?: number;
  acceptedFormats?: string[];
  className?: string;
  disabled?: boolean;
}

export const EnterpriseFileUpload: React.FC<EnterpriseFileUploadProps> = ({
  onFileSelect,
  maxSize = 50 * 1024 * 1024, // 50MB default
  acceptedFormats = ['.jpeg', '.jpg', '.png', '.tiff', '.heic', '.heif'],
  className = '',
  disabled = false
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`
      };
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      return {
        valid: false,
        error: `Unsupported file format. Accepted formats: ${acceptedFormats.join(', ')}`
      };
    }

    return { valid: true };
  }, [maxSize, acceptedFormats]);

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setSelectedFile(null);
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop: handleFileSelect,
    accept: {
      'image/*': acceptedFormats
    },
    multiple: false,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => {
      setIsDragActive(false);
      setUploadError('Invalid file type or size');
    }
  });

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setUploadError(null);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Main Upload Area */}
      <div 
        {...getRootProps()} 
        className={`
          relative group cursor-pointer transition-all duration-300 rounded-2xl
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDragActive && !isDragReject 
            ? 'scale-105 shadow-glow-lg' 
            : 'hover:scale-102 hover:shadow-glow'
          }
          ${isDragReject ? 'scale-95' : ''}
        `}
      >
        <input {...getInputProps()} disabled={disabled} />
        
        <div className={`
          glass-effect rounded-2xl p-8 md:p-12 border-2 border-dashed transition-all duration-300
          ${isDragActive && !isDragReject
            ? 'border-primary-400 bg-primary-500/10' 
            : isDragReject
            ? 'border-security-red bg-security-red/10'
            : 'border-enterprise-accent hover:border-primary-500 hover:bg-primary-500/5'
          }
          ${disabled ? 'border-secondary-600 bg-secondary-800/20' : ''}
        `}>
          <div className="text-center">
            {/* Upload Icon */}
            <div className="relative inline-block mb-6">
              {isDragReject ? (
                <AlertCircle className="h-16 w-16 mx-auto text-security-red" />
              ) : (
                <Upload className={`h-16 w-16 mx-auto transition-all duration-300 ${
                  isDragActive 
                    ? 'text-primary-400 scale-110' 
                    : disabled
                    ? 'text-secondary-600'
                    : 'text-secondary-400 group-hover:text-primary-500'
                }`} />
              )}
              
              {!isDragReject && !disabled && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            {/* Upload Text */}
            <h3 className="text-2xl font-semibold mb-3 text-white">
              {isDragActive && !isDragReject
                ? 'Drop your image here'
                : isDragReject
                ? 'Invalid file type'
                : disabled
                ? 'Upload disabled'
                : 'Drag & drop an image here'
              }
            </h3>
            
            <p className="text-secondary-300 mb-6">
              {isDragReject 
                ? `Please select a valid image file (${acceptedFormats.join(', ')})`
                : disabled
                ? 'File upload is currently disabled'
                : `or click to select a file • ${acceptedFormats.join(', ').toUpperCase()} supported`
              }
            </p>
            
            {/* Feature Indicators */}
            {!disabled && (
              <div className="flex items-center justify-center space-x-6 md:space-x-8 text-sm text-secondary-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-security-green" />
                  <span>Max {Math.round(maxSize / (1024 * 1024))}MB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-security-green" />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-security-blue" />
                  <span>Local Processing</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected File Display */}
      {selectedFile && !uploadError && (
        <div className="mt-4 p-4 bg-enterprise-light border border-enterprise-accent rounded-xl animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <p className="font-medium text-white truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-secondary-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="p-2 hover:bg-enterprise-accent rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-secondary-400 hover:text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <div className="mt-4 p-4 bg-security-red/10 border border-security-red/30 rounded-xl animate-slide-up">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-security-red flex-shrink-0" />
            <p className="text-security-red font-medium">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="mt-6 p-4 bg-enterprise-light/50 rounded-xl">
        <h4 className="font-medium text-white mb-3 flex items-center">
          <FileImage className="h-4 w-4 mr-2 text-primary-500" />
          Upload Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-secondary-400">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-security-green flex-shrink-0" />
            <span>Supported formats: JPEG, PNG, TIFF, HEIC</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-security-green flex-shrink-0" />
            <span>Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-3 w-3 text-security-blue flex-shrink-0" />
            <span>All processing happens locally</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="h-3 w-3 text-security-blue flex-shrink-0" />
            <span>Your files never leave your device</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 