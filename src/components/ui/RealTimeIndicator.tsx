import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface RealTimeIndicatorProps {
  isConnected?: boolean;
  lastUpdate?: Date;
  updateInterval?: number;
  showLastUpdate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'minimal' | 'detailed' | 'badge';
}

export const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({
  isConnected = true,
  lastUpdate,
  updateInterval = 30000, // 30 seconds
  showLastUpdate = true,
  size = 'md',
  variant = 'detailed'
}) => {
  const [connectionStatus, setConnectionStatus] = useState(isConnected);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('');

  useEffect(() => {
    setConnectionStatus(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (!lastUpdate) return;

    const updateTimeSince = () => {
      const now = new Date();
      const diff = now.getTime() - lastUpdate.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        setTimeSinceUpdate(`${hours}h ago`);
      } else if (minutes > 0) {
        setTimeSinceUpdate(`${minutes}m ago`);
      } else {
        setTimeSinceUpdate(`${seconds}s ago`);
      }
    };

    updateTimeSince();
    const interval = setInterval(updateTimeSince, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  useEffect(() => {
    if (!connectionStatus) return;

    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [connectionStatus, updateInterval]);

  const getStatusIcon = () => {
    if (isRefreshing) {
      return <RefreshCw className={`animate-spin ${getSizeClass()}`} />;
    }
    
    if (connectionStatus) {
      return <CheckCircle className={`text-green-500 ${getSizeClass()}`} />;
    }
    
    return <AlertCircle className={`text-red-500 ${getSizeClass()}`} />;
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-4 w-4';
    }
  };

  const getTextSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const getStatusText = () => {
    if (isRefreshing) return 'Updating...';
    if (connectionStatus) return 'Live';
    return 'Disconnected';
  };

  const getStatusColor = () => {
    if (isRefreshing) return 'text-blue-600 dark:text-blue-400';
    if (connectionStatus) return 'text-green-600 dark:text-green-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${connectionStatus ? 'bg-green-500' : 'bg-red-500'} ${isRefreshing ? 'animate-pulse' : ''}`} />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
        connectionStatus 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      }`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {getStatusIcon()}
        <span className={`font-medium ${getStatusColor()} ${getTextSizeClass()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {showLastUpdate && lastUpdate && (
        <span className={`text-gray-500 dark:text-gray-400 ${getTextSizeClass()}`}>
          • {timeSinceUpdate}
        </span>
      )}
    </div>
  );
}; 