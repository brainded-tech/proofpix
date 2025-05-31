import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RefreshCw, 
  AlertTriangle,
  Clock,
  Layout,
  BarChart,
  PanelTop,
  Eye,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { AnalyticsPreferences } from '../../models/AnalyticsPermission';
import { analyticsPermissionService } from '../../services/analyticsPermissionService';

interface UserDashboardPreferencesProps {
  className?: string;
  onPreferencesChanged?: (preferences: AnalyticsPreferences) => void;
  availableMetrics?: Array<{
    id: string;
    name: string;
    description?: string;
    category?: string;
  }>;
  availableDashboards?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  theme?: 'light' | 'dark';
}

export const UserDashboardPreferences: React.FC<UserDashboardPreferencesProps> = ({
  className = '',
  onPreferencesChanged,
  availableMetrics = [],
  availableDashboards = [],
  theme = 'light'
}) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<AnalyticsPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);
  
  const loadUserPreferences = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const prefs = await analyticsPermissionService.getUserPreferences(user.id);
      setPreferences(prefs);
      
      // Notify parent component if needed
      if (onPreferencesChanged) {
        onPreferencesChanged(prefs);
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      setError('Failed to load preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSavePreferences = async () => {
    if (!user || !preferences) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const success = await analyticsPermissionService.updateUserPreferences(
        user.id,
        preferences
      );
      
      if (success) {
        setSuccess(true);
        
        // Notify parent component if needed
        if (onPreferencesChanged) {
          onPreferencesChanged(preferences);
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save preferences. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handlePreferenceChange = <K extends keyof AnalyticsPreferences>(
    key: K,
    value: AnalyticsPreferences[K]
  ) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [key]: value
    });
  };
  
  const toggleFavoriteMetric = (metricId: string) => {
    if (!preferences) return;
    
    const favoriteMetrics = [...preferences.favoriteMetrics];
    const index = favoriteMetrics.indexOf(metricId);
    
    if (index >= 0) {
      favoriteMetrics.splice(index, 1);
    } else {
      favoriteMetrics.push(metricId);
    }
    
    setPreferences({
      ...preferences,
      favoriteMetrics
    });
  };
  
  // Helper for theme selection
  const getThemeIcon = (themeValue: 'light' | 'dark' | 'system') => {
    switch (themeValue) {
      case 'light': return <Sun className="w-5 h-5" />;
      case 'dark': return <Moon className="w-5 h-5" />;
      case 'system': return <Monitor className="w-5 h-5" />;
    }
  };
  
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <RefreshCw className={`w-8 h-8 animate-spin ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
        }`} />
      </div>
    );
  }
  
  if (!preferences) return null;
  
  const isDarkTheme = theme === 'dark';
  
  return (
    <div className={`${className} ${
      isDarkTheme ? 'text-white' : 'text-gray-900'
    }`}>
      <div className={`mb-6 flex items-center justify-between ${
        isDarkTheme ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h2 className="text-xl font-semibold">Dashboard Preferences</h2>
        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className={`flex items-center px-4 py-2 rounded-md ${
            isDarkTheme
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </div>
      
      {error && (
        <div className={`p-3 mb-4 rounded-md ${
          isDarkTheme ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'
        }`}>
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {success && (
        <div className={`p-3 mb-4 rounded-md ${
          isDarkTheme ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'
        }`}>
          <div className="flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            <span>Preferences saved successfully</span>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Time Range Preferences */}
        <div className={`p-4 rounded-md ${
          isDarkTheme ? 'bg-gray-800' : 'bg-white'
        } border ${
          isDarkTheme ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Default Time Range</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => handlePreferenceChange('defaultTimeRange', range)}
                className={`px-4 py-2 rounded-md transition ${
                  preferences.defaultTimeRange === range
                    ? isDarkTheme
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : isDarkTheme
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        {/* Layout Preferences */}
        <div className={`p-4 rounded-md ${
          isDarkTheme ? 'bg-gray-800' : 'bg-white'
        } border ${
          isDarkTheme ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center mb-4">
            <Layout className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Layout</h3>
          </div>
          
          <div className="space-y-4">
            {/* Dashboard Layout */}
            <div>
              <label className="block mb-2 text-sm font-medium">Dashboard Layout</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handlePreferenceChange('dashboardLayout', 'grid')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    preferences.dashboardLayout === 'grid'
                      ? isDarkTheme
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkTheme
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <PanelTop className="w-4 h-4 mr-2" />
                  <span>Grid</span>
                </button>
                
                <button
                  onClick={() => handlePreferenceChange('dashboardLayout', 'list')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    preferences.dashboardLayout === 'list'
                      ? isDarkTheme
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkTheme
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  <span>List</span>
                </button>
              </div>
            </div>
            
            {/* Compact View */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Compact View</label>
                <p className={`text-xs ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Show more data with less padding
                </p>
              </div>
              
              <button
                onClick={() => handlePreferenceChange('compactView', !preferences.compactView)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.compactView
                    ? isDarkTheme
                      ? 'bg-blue-600'
                      : 'bg-blue-500'
                    : isDarkTheme
                      ? 'bg-gray-600'
                      : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.compactView ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {/* Auto Refresh */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium">Auto-refresh Data</label>
                <p className={`text-xs ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Automatically refresh dashboard data
                </p>
              </div>
              
              <button
                onClick={() => handlePreferenceChange('autoRefresh', !preferences.autoRefresh)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.autoRefresh
                    ? isDarkTheme
                      ? 'bg-blue-600'
                      : 'bg-blue-500'
                    : isDarkTheme
                      ? 'bg-gray-600'
                      : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {/* Refresh Interval */}
            {preferences.autoRefresh && (
              <div>
                <label className="block mb-2 text-sm font-medium">Refresh Interval (seconds)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="15"
                    max="300"
                    step="15"
                    value={preferences.refreshInterval}
                    onChange={(e) => handlePreferenceChange('refreshInterval', parseInt(e.target.value, 10))}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                      isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  />
                  <span className={`px-2 py-1 rounded-md ${
                    isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {preferences.refreshInterval}s
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Theme Preferences */}
        <div className={`p-4 rounded-md ${
          isDarkTheme ? 'bg-gray-800' : 'bg-white'
        } border ${
          isDarkTheme ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center mb-4">
            <Eye className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Appearance</h3>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Dashboard Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {(['light', 'dark', 'system'] as const).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => handlePreferenceChange('theme', themeOption)}
                  className={`flex items-center justify-center px-4 py-2 rounded-md ${
                    preferences.theme === themeOption
                      ? isDarkTheme
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkTheme
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {getThemeIcon(themeOption)}
                  <span className="ml-2 capitalize">{themeOption}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Default Dashboard */}
        {availableDashboards.length > 0 && (
          <div className={`p-4 rounded-md ${
            isDarkTheme ? 'bg-gray-800' : 'bg-white'
          } border ${
            isDarkTheme ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center mb-4">
              <PanelTop className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Default Dashboard</h3>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Select Default Dashboard</label>
              <select
                value={preferences.defaultDashboardId || ''}
                onChange={(e) => handlePreferenceChange('defaultDashboardId', e.target.value || undefined)}
                className={`w-full p-2 rounded-md border ${
                  isDarkTheme
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">None (Show Overview)</option>
                {availableDashboards.map((dashboard) => (
                  <option key={dashboard.id} value={dashboard.id}>
                    {dashboard.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* Favorite Metrics */}
        {availableMetrics.length > 0 && (
          <div className={`p-4 rounded-md ${
            isDarkTheme ? 'bg-gray-800' : 'bg-white'
          } border ${
            isDarkTheme ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center mb-4">
              <BarChart className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Favorite Metrics</h3>
            </div>
            
            <p className={`text-sm mb-4 ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Select metrics to show prominently on your dashboard
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {availableMetrics.map((metric) => (
                <div
                  key={metric.id}
                  onClick={() => toggleFavoriteMetric(metric.id)}
                  className={`flex items-center p-3 rounded-md cursor-pointer ${
                    preferences.favoriteMetrics.includes(metric.id)
                      ? isDarkTheme
                        ? 'bg-blue-900/30 border border-blue-700'
                        : 'bg-blue-50 border border-blue-200'
                      : isDarkTheme
                        ? 'bg-gray-700 border border-gray-600 hover:bg-gray-600'
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-sm mr-3 flex items-center justify-center ${
                    preferences.favoriteMetrics.includes(metric.id)
                      ? isDarkTheme
                        ? 'bg-blue-600'
                        : 'bg-blue-500'
                      : isDarkTheme
                        ? 'border border-gray-500'
                        : 'border border-gray-400'
                  }`}>
                    {preferences.favoriteMetrics.includes(metric.id) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3 text-white"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  
                  <div>
                    <div className="font-medium">{metric.name}</div>
                    {metric.description && (
                      <div className={`text-xs ${
                        isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {metric.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPreferences; 