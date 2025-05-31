import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Upload,
  Download,
  FileImage,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';

interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
  type?: 'default' | 'upload' | 'download' | 'processing' | 'security';
  error?: string;
  success?: string;
}

interface EnhancedLoadingProps {
  state: LoadingState;
  className?: string;
  showProgress?: boolean;
  showMessage?: boolean;
  variant?: 'overlay' | 'inline' | 'card';
}

// Loading spinner variants
const spinnerVariants = {
  default: {
    icon: <Loader2 className="w-6 h-6" />,
    color: 'blue'
  },
  upload: {
    icon: <Upload className="w-6 h-6" />,
    color: 'emerald'
  },
  download: {
    icon: <Download className="w-6 h-6" />,
    color: 'purple'
  },
  processing: {
    icon: <Zap className="w-6 h-6" />,
    color: 'amber'
  },
  security: {
    icon: <Shield className="w-6 h-6" />,
    color: 'green'
  }
};

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  state,
  className = '',
  showProgress = true,
  showMessage = true,
  variant = 'overlay'
}) => {
  const { isLoading, progress, message, type = 'default', error, success } = state;
  const spinner = spinnerVariants[type];

  const getVariantClasses = () => {
    switch (variant) {
      case 'overlay':
        return 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center';
      case 'inline':
        return 'flex items-center justify-center py-8';
      case 'card':
        return 'pp-card p-8 flex flex-col items-center justify-center';
      default:
        return '';
    }
  };

  if (!isLoading && !error && !success) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`${getVariantClasses()} ${className}`}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="text-center max-w-md mx-auto"
        >
          {/* Status Icon */}
          <div className="mb-6">
            {error ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <XCircle className="w-8 h-8 text-red-400" />
              </motion.div>
            ) : success ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-400" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={`w-16 h-16 bg-${spinner.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <span className={`text-${spinner.color}-400`}>
                  {spinner.icon}
                </span>
              </motion.div>
            )}
          </div>

          {/* Progress Bar */}
          {showProgress && progress !== undefined && !error && !success && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="pp-text-body-sm text-slate-400">Progress</span>
                <span className="pp-text-body-sm font-medium text-white">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r from-${spinner.color}-500 to-${spinner.color}-400 rounded-full`}
                />
              </div>
            </div>
          )}

          {/* Message */}
          {showMessage && (
            <div className="text-center">
              {error ? (
                <div>
                  <h3 className="pp-text-heading-sm text-red-400 mb-2">Error</h3>
                  <p className="pp-text-body-sm text-slate-400">{error}</p>
                </div>
              ) : success ? (
                <div>
                  <h3 className="pp-text-heading-sm text-green-400 mb-2">Success</h3>
                  <p className="pp-text-body-sm text-slate-400">{success}</p>
                </div>
              ) : (
                <div>
                  <h3 className="pp-text-heading-sm text-white mb-2">
                    {message || 'Loading...'}
                  </h3>
                  <p className="pp-text-body-sm text-slate-400">
                    Please wait while we process your request
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Skeleton loading components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pp-card p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-700 rounded"></div>
        <div className="h-3 bg-slate-700 rounded w-5/6"></div>
        <div className="h-3 bg-slate-700 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

export const SkeletonText: React.FC<{ 
  lines?: number; 
  className?: string;
  width?: 'full' | 'half' | 'quarter';
}> = ({ lines = 3, className = '', width = 'full' }) => {
  const getWidth = (index: number) => {
    if (width === 'half') return 'w-1/2';
    if (width === 'quarter') return 'w-1/4';
    if (index === lines - 1) return 'w-3/4'; // Last line shorter
    return 'w-full';
  };

  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className={`h-3 bg-slate-700 rounded ${getWidth(index)}`}></div>
      ))}
    </div>
  );
};

export const SkeletonImage: React.FC<{ 
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}> = ({ className = '', aspectRatio = 'square' }) => {
  const getAspectClasses = () => {
    switch (aspectRatio) {
      case 'video':
        return 'aspect-video';
      case 'wide':
        return 'aspect-[21/9]';
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className={`bg-slate-700 rounded-xl animate-pulse ${getAspectClasses()} ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <FileImage className="w-8 h-8 text-slate-600" />
      </div>
    </div>
  );
};

// Loading states hook
export const useLoadingState = (initialState: Partial<LoadingState> = {}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    message: '',
    type: 'default',
    ...initialState
  });

  const startLoading = (options: Partial<LoadingState> = {}) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: true,
      error: undefined,
      success: undefined,
      progress: 0,
      ...options
    }));
  };

  const updateProgress = (progress: number, message?: string) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
      ...(message && { message })
    }));
  };

  const setError = (error: string) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      error,
      success: undefined
    }));
  };

  const setSuccess = (success: string) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      success,
      error: undefined
    }));
  };

  const stopLoading = () => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      error: undefined,
      success: undefined
    }));
  };

  return {
    loadingState,
    startLoading,
    updateProgress,
    setError,
    setSuccess,
    stopLoading
  };
};

// Animated counter component
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}> = ({ value, duration = 1000, className = '', prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Pulse loading indicator
export const PulseLoader: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}> = ({ size = 'md', color = 'blue', className = '' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
          className={`${sizeClasses[size]} bg-${color}-500 rounded-full`}
        />
      ))}
    </div>
  );
};

// Shimmer effect component
export const ShimmerEffect: React.FC<{
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}> = ({ children, isLoading = false, className = '' }) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="opacity-50">{children}</div>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};

// Progress ring component
export const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}> = ({ progress, size = 120, strokeWidth = 8, color = 'blue', className = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`text-${color}-500`}
        />
      </svg>
      {/* Progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="pp-text-heading-sm font-bold text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default EnhancedLoading; 