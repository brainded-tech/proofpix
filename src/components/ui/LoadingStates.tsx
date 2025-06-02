/**
 * Loading States Component
 * Comprehensive loading animations and states for better UX
 */

import React from 'react';
import { Loader2, Upload, CheckCircle, AlertCircle, Zap, Shield, Camera } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

interface LoadingStateProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'progress';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  progress?: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

interface ProcessingStageProps {
  stages: Array<{
    id: string;
    label: string;
    status: 'pending' | 'active' | 'completed' | 'error';
    icon?: React.ReactNode;
  }>;
  currentStage?: string;
  className?: string;
}

// Basic Loading Spinner
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'text-gray-500',
    primary: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} 
    />
  );
};

// Comprehensive Loading State
export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  size = 'md',
  text,
  progress,
  variant = 'default',
  className = ''
}) => {
  const renderLoadingType = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-current rounded-full animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`animate-pulse bg-current rounded-full ${
            size === 'sm' ? 'w-8 h-8' : 
            size === 'md' ? 'w-12 h-12' : 
            size === 'lg' ? 'w-16 h-16' : 'w-20 h-20'
          }`} />
        );

      case 'skeleton':
        return (
          <div className="space-y-3">
            <div className="animate-pulse bg-gray-300 h-4 rounded w-3/4"></div>
            <div className="animate-pulse bg-gray-300 h-4 rounded w-1/2"></div>
            <div className="animate-pulse bg-gray-300 h-4 rounded w-5/6"></div>
          </div>
        );

      case 'progress':
        return (
          <div className="w-full">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress || 0}%` }}
              />
            </div>
            {progress !== undefined && (
              <div className="text-sm text-gray-600 mt-2 text-center">
                {Math.round(progress)}%
              </div>
            )}
          </div>
        );

      default:
        return <LoadingSpinner size={size} variant={variant} />;
    }
  };

  const variantClasses = {
    default: 'text-gray-500',
    primary: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${variantClasses[variant]} ${className}`}>
      {renderLoadingType()}
      {text && (
        <div className="text-sm font-medium text-center">
          {text}
        </div>
      )}
    </div>
  );
};

// Processing Stages Component
export const ProcessingStages: React.FC<ProcessingStageProps> = ({
  stages,
  currentStage,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {stages.map((stage, index) => {
        const isActive = stage.id === currentStage;
        const isCompleted = stage.status === 'completed';
        const isError = stage.status === 'error';
        const isPending = stage.status === 'pending';

        return (
          <div
            key={stage.id}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              isActive ? 'bg-blue-50 border border-blue-200' :
              isCompleted ? 'bg-green-50 border border-green-200' :
              isError ? 'bg-red-50 border border-red-200' :
              'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isActive ? 'bg-blue-500 text-white' :
              isCompleted ? 'bg-green-500 text-white' :
              isError ? 'bg-red-500 text-white' :
              'bg-gray-300 text-gray-600'
            }`}>
              {isActive ? (
                <LoadingSpinner size="sm" variant="default" className="text-white" />
              ) : isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : isError ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                stage.icon || <span className="text-xs font-bold">{index + 1}</span>
              )}
            </div>
            
            <div className="flex-1">
              <div className={`font-medium ${
                isActive ? 'text-blue-900' :
                isCompleted ? 'text-green-900' :
                isError ? 'text-red-900' :
                'text-gray-600'
              }`}>
                {stage.label}
              </div>
            </div>

            {isActive && (
              <div className="flex-shrink-0">
                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// File Upload Loading State
type UploadStage = 'uploading' | 'processing' | 'analyzing' | 'complete';

export const FileUploadLoading: React.FC<{
  fileName?: string;
  progress?: number;
  stage?: UploadStage;
  className?: string;
}> = ({ fileName, progress, stage = 'uploading', className = '' }) => {
  const stageConfig: Record<UploadStage, { icon: any; text: string; color: string }> = {
    uploading: { icon: Upload, text: 'Uploading file...', color: 'blue' },
    processing: { icon: Zap, text: 'Processing image...', color: 'yellow' },
    analyzing: { icon: Shield, text: 'Analyzing metadata...', color: 'purple' },
    complete: { icon: CheckCircle, text: 'Analysis complete!', color: 'green' }
  };

  const config = stageConfig[stage];
  const IconComponent = config.icon;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-12 h-12 rounded-full bg-${config.color}-100 flex items-center justify-center`}>
          {stage === 'complete' ? (
            <IconComponent className={`w-6 h-6 text-${config.color}-600`} />
          ) : (
            <div className="relative">
              <IconComponent className={`w-6 h-6 text-${config.color}-600`} />
              {(stage === 'uploading' || stage === 'processing' || stage === 'analyzing') && (
                <div className="absolute -top-1 -right-1">
                  <LoadingSpinner size="sm" variant="primary" />
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="font-medium text-gray-900">{config.text}</div>
          {fileName && (
            <div className="text-sm text-gray-500 truncate">{fileName}</div>
          )}
        </div>
      </div>

      {progress !== undefined && (stage === 'uploading' || stage === 'processing' || stage === 'analyzing') && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-${config.color}-500 h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Page Loading Overlay
export const PageLoadingOverlay: React.FC<{
  isVisible: boolean;
  text?: string;
  className?: string;
}> = ({ isVisible, text = 'Loading...', className = '' }) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Camera className="w-12 h-12 text-blue-500" />
            <div className="absolute -top-1 -right-1">
              <LoadingSpinner size="sm" variant="primary" />
            </div>
          </div>
          <div className="text-lg font-medium text-gray-900">{text}</div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader for Cards
export const CardSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 1, 
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded" />
            <div className="h-3 bg-gray-300 rounded w-5/6" />
            <div className="h-3 bg-gray-300 rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  LoadingSpinner,
  LoadingState,
  ProcessingStages,
  FileUploadLoading,
  PageLoadingOverlay,
  CardSkeleton
}; 