import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle, 
  Info, 
  ChevronDown,
  Upload,
  File,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

// Base form field props
interface BaseFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  success?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

// Input field component
interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  showPasswordToggle?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  hint,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  icon,
  iconPosition = 'left',
  autoComplete,
  maxLength,
  minLength,
  pattern,
  showPasswordToggle = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasLeftIcon = icon && iconPosition === 'left';
  const hasRightIcon = icon && iconPosition === 'right';
  const hasPasswordToggle = type === 'password' && showPasswordToggle;

  const getStatusColor = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500/20';
    if (focused) return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/20';
    return 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={id || name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {hasLeftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type={inputType}
          id={id || name}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={`
            w-full px-4 py-3 text-base
            bg-white dark:bg-slate-800
            border-2 rounded-lg
            transition-all duration-200
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            text-slate-900 dark:text-slate-100
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-4
            ${hasLeftIcon ? 'pl-11' : ''}
            ${hasRightIcon || hasPasswordToggle ? 'pr-11' : ''}
            ${getStatusColor()}
          `}
        />

        {/* Right Icon or Password Toggle */}
        {(hasRightIcon || hasPasswordToggle) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {hasPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                disabled={disabled}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            ) : (
              <div className="text-slate-400 dark:text-slate-500">
                {icon}
              </div>
            )}
          </div>
        )}

        {/* Status Icons */}
        {(error || success) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error && <AlertCircle className="w-5 h-5 text-red-500" />}
            {success && <Check className="w-5 h-5 text-green-500" />}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <AnimatePresence>
        {(error || success || hint) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-start space-x-2"
          >
            {error && (
              <>
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </>
            )}
            {success && !error && (
              <>
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
              </>
            )}
            {hint && !error && !success && (
              <>
                <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-500 dark:text-slate-400">{hint}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Textarea component
interface TextareaFieldProps extends BaseFieldProps {
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  hint,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  rows = 4,
  maxLength,
  resize = 'vertical'
}) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  useEffect(() => {
    setCharCount(value?.length || 0);
  }, [value]);

  const getStatusColor = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500/20';
    if (focused) return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/20';
    return 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label 
            htmlFor={id || name}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {maxLength && (
            <span className={`text-xs ${
              charCount > maxLength * 0.9 
                ? 'text-red-500' 
                : 'text-slate-400 dark:text-slate-500'
            }`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      {/* Textarea */}
      <textarea
        id={id || name}
        name={name}
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
          setCharCount(e.target.value.length);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-4 py-3 text-base
          bg-white dark:bg-slate-800
          border-2 rounded-lg
          transition-all duration-200
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          text-slate-900 dark:text-slate-100
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-4
          resize-${resize}
          ${getStatusColor()}
        `}
      />

      {/* Helper Text */}
      <AnimatePresence>
        {(error || success || hint) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-start space-x-2"
          >
            {error && (
              <>
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </>
            )}
            {success && !error && (
              <>
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
              </>
            )}
            {hint && !error && !success && (
              <>
                <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-500 dark:text-slate-400">{hint}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Select component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps extends Omit<BaseFieldProps, 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  placeholder = 'Select an option...',
  value,
  onChange,
  error,
  success,
  hint,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  options,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500/20';
    if (focused || isOpen) return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/20';
    return 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={id || name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => setFocused(true)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-base text-left
            bg-white dark:bg-slate-800
            border-2 rounded-lg
            transition-all duration-200
            text-slate-900 dark:text-slate-100
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-4
            ${icon ? 'pl-11' : ''}
            pr-11
            ${getStatusColor()}
          `}
        >
          {/* Left Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}

          {/* Selected Value */}
          <span className={selectedOption ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          {/* Chevron */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} />
          </div>
        </button>

        {/* Options Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange?.(option.value);
                      setIsOpen(false);
                      setFocused(false);
                    }
                  }}
                  disabled={option.disabled}
                  className={`
                    w-full px-4 py-3 text-left text-base
                    hover:bg-slate-50 dark:hover:bg-slate-700
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors
                    ${value === option.value 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-900 dark:text-slate-100'
                    }
                  `}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <AnimatePresence>
        {(error || success || hint) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-start space-x-2"
          >
            {error && (
              <>
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </>
            )}
            {success && !error && (
              <>
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
              </>
            )}
            {hint && !error && !success && (
              <>
                <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-500 dark:text-slate-400">{hint}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// File Upload component
interface FileUploadFieldProps extends Omit<BaseFieldProps, 'value' | 'onChange'> {
  value?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  preview?: boolean;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  value = [],
  onChange,
  error,
  success,
  hint,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  preview = true
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    let validFiles = fileArray;

    // Apply file size limit
    if (maxSize) {
      validFiles = validFiles.filter(file => file.size <= maxSize);
    }

    // Apply file count limit
    if (maxFiles) {
      validFiles = validFiles.slice(0, maxFiles);
    }

    if (multiple) {
      onChange?.([...value, ...validFiles]);
    } else {
      onChange?.(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-500' : ''}
          ${success ? 'border-green-500' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id || name}
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
            {isDragOver ? 'Drop files here' : 'Upload files'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Drag and drop files here, or click to select
          </p>
          {(accept || maxSize || maxFiles) && (
            <div className="text-xs text-slate-400 dark:text-slate-500 space-y-1">
              {accept && <p>Accepted formats: {accept}</p>}
              {maxSize && <p>Max file size: {formatFileSize(maxSize)}</p>}
              {maxFiles && <p>Max files: {maxFiles}</p>}
            </div>
          )}
        </div>
      </div>

      {/* File Preview */}
      {preview && value.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Selected Files ({value.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {value.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <AnimatePresence>
        {(error || success || hint) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-start space-x-2"
          >
            {error && (
              <>
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </>
            )}
            {success && !error && (
              <>
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
              </>
            )}
            {hint && !error && !success && (
              <>
                <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-500 dark:text-slate-400">{hint}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Button component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 focus:ring-blue-500/20';
      case 'secondary':
        return 'bg-slate-600 hover:bg-slate-700 text-white border-slate-600 hover:border-slate-700 focus:ring-slate-500/20';
      case 'outline':
        return 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-slate-500/20';
      case 'ghost':
        return 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent focus:ring-slate-500/20';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 focus:ring-red-500/20';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 focus:ring-green-500/20';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 focus:ring-blue-500/20';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-3 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'xl':
        return 'px-8 py-4 text-xl';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium border-2 rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-4
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {icon && iconPosition === 'left' && !loading && icon}
      {children}
      {icon && iconPosition === 'right' && !loading && icon}
    </motion.button>
  );
};

// Form container component
interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  title?: string;
  description?: string;
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className = '',
  title,
  description
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-6 ${className}`}
    >
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </form>
  );
}; 