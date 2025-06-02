/**
 * Notification System Component
 * Comprehensive notification system with toasts, alerts, and status messages
 */

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell, Settings } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration ?? 5000
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove non-persistent notifications
    if (!notification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Toast Notification Component
const ToastNotification: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ${
        isVisible && !isRemoving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`max-w-sm w-full ${getBackgroundColor()} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-gray-900">
              {notification.title}
            </div>
            {notification.message && (
              <div className="mt-1 text-sm text-gray-600">
                {notification.message}
              </div>
            )}
            {notification.action && (
              <div className="mt-3">
                <button
                  onClick={notification.action.onClick}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  {notification.action.label}
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleRemove}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Container
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-sm">
      {notifications.map(notification => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

// Alert Component
export const Alert: React.FC<{
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}> = ({ type, title, message, onClose, action, className = '' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStyles()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {title}
          </h3>
          {message && (
            <div className="mt-2 text-sm">
              {message}
            </div>
          )}
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className="text-sm font-medium underline hover:no-underline"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        
        {onClose && (
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Status Banner Component
export const StatusBanner: React.FC<{
  type: 'maintenance' | 'update' | 'warning' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
}> = ({ type, message, action, dismissible = false, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getStyles = () => {
    switch (type) {
      case 'maintenance':
        return 'bg-red-600 text-white';
      case 'update':
        return 'bg-blue-600 text-white';
      case 'warning':
        return 'bg-yellow-600 text-white';
      case 'info':
        return 'bg-gray-600 text-white';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${getStyles()} px-4 py-3`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5" />
          <span className="text-sm font-medium">{message}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
          
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Notification Bell Component
export const NotificationBell: React.FC<{
  count?: number;
  onClick?: () => void;
  className?: string;
}> = ({ count = 0, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <Bell className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

// Notification Settings Component
export const NotificationSettings: React.FC<{
  settings: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    marketing: boolean;
  };
  onSettingsChange: (settings: any) => void;
  className?: string;
}> = ({ settings, onSettingsChange, className = '' }) => {
  const handleToggle = (key: string) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key as keyof typeof settings]
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-6 h-6 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 capitalize">
                {key === 'push' ? 'Push Notifications' : 
                 key === 'desktop' ? 'Desktop Notifications' :
                 key === 'marketing' ? 'Marketing Emails' : 
                 'Email Notifications'}
              </div>
              <div className="text-sm text-gray-500">
                {key === 'email' ? 'Receive notifications via email' :
                 key === 'push' ? 'Receive push notifications on mobile' :
                 key === 'desktop' ? 'Show desktop notifications' :
                 'Receive marketing and promotional emails'}
              </div>
            </div>
            
            <button
              onClick={() => handleToggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick notification helpers
export const showSuccess = (title: string, message?: string) => {
  // This would be used with the context
  return { type: 'success' as const, title, message };
};

export const showError = (title: string, message?: string) => {
  return { type: 'error' as const, title, message };
};

export const showWarning = (title: string, message?: string) => {
  return { type: 'warning' as const, title, message };
};

export const showInfo = (title: string, message?: string) => {
  return { type: 'info' as const, title, message };
};

export default {
  NotificationProvider,
  useNotifications,
  Alert,
  StatusBanner,
  NotificationBell,
  NotificationSettings,
  showSuccess,
  showError,
  showWarning,
  showInfo
}; 