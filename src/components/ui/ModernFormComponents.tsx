/**
 * Modern Form Components
 * Enhanced form components with validation, accessibility, and modern UX
 */

import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle, Upload, Search, ChevronDown } from 'lucide-react';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  className?: string;
}

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  helperText?: string;
  className?: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFileSelect: (files: File[]) => void;
  error?: string;
  disabled?: boolean;
  helperText?: string;
  preview?: boolean;
  className?: string;
}

// Enhanced Input Component
export const ModernInput: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled,
  required,
  helperText,
  icon,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : success
              ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-2
            ${isFocused ? 'shadow-md' : 'shadow-sm'}
          `}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {success && !error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <Check className="w-5 h-5" />
          </div>
        )}
        
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

// Enhanced TextArea Component
export const ModernTextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled,
  required,
  rows = 4,
  maxLength,
  helperText,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const remainingChars = maxLength ? maxLength - value.length : null;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200 resize-none
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-2
            ${isFocused ? 'shadow-md' : 'shadow-sm'}
          `}
        />
        
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {remainingChars}/{maxLength}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

// Enhanced Select Component
export const ModernSelect: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  disabled,
  required,
  placeholder,
  helperText,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200 text-left
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer'}
            focus:outline-none focus:ring-2
            ${isFocused ? 'shadow-md' : 'shadow-sm'}
          `}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder || 'Select an option'}
          </span>
          <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
                disabled={option.disabled}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors
                  ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  ${option.disabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

// Enhanced File Upload Component
export const ModernFileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  multiple,
  maxSize,
  onFileSelect,
  error,
  disabled,
  helperText,
  preview,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
    onFileSelect(validFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
        <div className="text-sm text-gray-600">
          <span className="font-medium">Click to upload</span> or drag and drop
        </div>
        {accept && (
          <div className="text-xs text-gray-500 mt-1">
            Accepted formats: {accept}
          </div>
        )}
        {maxSize && (
          <div className="text-xs text-gray-500">
            Max file size: {maxSize}MB
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={disabled}
          className="hidden"
        />
      </div>
      
      {selectedFiles.length > 0 && preview && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Selected Files:</div>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newFiles = selectedFiles.filter((_, i) => i !== index);
                  setSelectedFiles(newFiles);
                  onFileSelect(newFiles);
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {(error || helperText) && (
        <div className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

// Search Input Component
export const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}> = ({ value, onChange, placeholder = 'Search...', onSearch, className = '' }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default {
  ModernInput,
  ModernTextArea,
  ModernSelect,
  ModernFileUpload,
  SearchInput
}; 