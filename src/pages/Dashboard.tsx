import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTestAuth } from '../components/auth/TestAuthProvider';
import { 
  userRepository,
  subscriptionRepository,
  usageRepository,
  analyticsRepository,
  billingRepository
} from '../utils/repositories';
import { errorHandler } from '../utils/errorHandler';
import { 
  User, 
  Settings, 
  FileImage, 
  BarChart3, 
  Shield, 
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  Upload,
  Eye,
  DollarSign,
  Zap,
  Activity,
  Bell,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Book,
  Brain,
  Layers,
  X
} from 'lucide-react';
import type { 
  SubscriptionData, 
  UsageTrackingData, 
  AnalyticsData,
  DashboardStats,
  InvoiceData
} from '../utils/apiClient';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge 
} from '../components/ui/EnterpriseComponents';

// Simple Image Metadata Viewer Component
const ImageMetadataViewer: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<Array<{
    id: string;
    name: string;
    size: number;
    url: string;
    metadata: any;
    expanded: boolean;
  }>>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          url: e.target?.result as string,
          metadata: {
            fileName: file.name,
            fileSize: `${(file.size / 1024).toFixed(2)} KB`,
            fileType: file.type,
            lastModified: new Date(file.lastModified).toLocaleString(),
            dimensions: 'Analyzing...',
            camera: 'Canon EOS R5 (simulated)',
            location: 'San Francisco, CA (simulated)',
            timestamp: new Date().toISOString(),
            hash: 'sha256:' + Math.random().toString(36).substr(2, 16)
          },
          expanded: false
        };
        setUploadedImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleExpanded = (id: string) => {
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, expanded: !img.expanded } : img
      )
    );
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Image Metadata Analysis</h3>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mb-6">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">Upload images to view their metadata</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          <Upload className="h-4 w-4 mr-2" />
          Select Images
        </label>
      </div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Uploaded Images ({uploadedImages.length})</h4>
          {uploadedImages.map((image) => (
            <div key={image.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{image.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{image.metadata.fileSize}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleExpanded(image.id)}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 text-sm"
                  >
                    {image.expanded ? 'Hide' : 'View'} Metadata
                  </button>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Metadata */}
              {image.expanded && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-3">
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Metadata Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">File Name:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{image.metadata.fileName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">File Size:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{image.metadata.fileSize}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">File Type:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{image.metadata.fileType}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Last Modified:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{image.metadata.lastModified}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Camera:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{image.metadata.camera}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{image.metadata.location}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Timestamp:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{new Date(image.metadata.timestamp).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Hash:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono text-xs">{image.metadata.hash}</span>
                    </div>
                  </div>
                  
                  {/* Enterprise Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-800">
                        Generate Report
                      </button>
                      <button className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-sm hover:bg-purple-200 dark:hover:bg-purple-800">
                        Chain of Custody
                      </button>
                      <button className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded text-sm hover:bg-orange-200 dark:hover:bg-orange-800">
                        Export Metadata
                      </button>
                      <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800">
                        Compare Images
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface DashboardState {
  stats: DashboardStats | null;
  subscription: SubscriptionData | null;
  usage: UsageTrackingData | null;
  analytics: AnalyticsData | null;
  recentInvoices: InvoiceData[];
  alerts: Array<{ type: string; threshold: number; current: number; triggered: boolean }>;
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useTestAuth();
  const [state, setState] = useState<DashboardState>({
    stats: null,
    subscription: null,
    usage: null,
    analytics: null,
    recentInvoices: [],
    alerts: [],
    isLoading: true,
    error: null,
    lastRefresh: null
  });
  const navigate = useNavigate();

  // Get user tier from localStorage
  const tier = localStorage.getItem('proofpix_user_tier') || 'free';

  const updateState = useCallback((updates: Partial<DashboardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });

      // Load all dashboard data in parallel
      const [
        statsResponse,
        subscriptionData,
        usageData,
        analyticsData,
        alertsData,
        invoicesData
      ] = await Promise.allSettled([
        analyticsRepository.getDashboard(),
        subscriptionRepository.getCurrent().catch(() => null),
        usageRepository.getCurrent().catch(() => null),
        analyticsRepository.getDetailed({
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(),
          granularity: 'day'
        }).catch(() => null),
        usageRepository.getAlerts().catch(() => []),
        billingRepository.getInvoices({ limit: 5 }).catch(() => [])
      ]);

      updateState({
        stats: statsResponse.status === 'fulfilled' ? statsResponse.value : null,
        subscription: subscriptionData.status === 'fulfilled' ? subscriptionData.value : null,
        usage: usageData.status === 'fulfilled' ? usageData.value : null,
        analytics: analyticsData.status === 'fulfilled' ? analyticsData.value : null,
        alerts: alertsData.status === 'fulfilled' ? alertsData.value : [],
        recentInvoices: invoicesData.status === 'fulfilled' ? invoicesData.value : [],
        isLoading: false,
        lastRefresh: new Date()
      });

    } catch (error) {
      console.error('Dashboard error:', error);
      await errorHandler.handleError('dashboard_load', error as Error);
      updateState({ 
        error: 'Failed to load dashboard data', 
        isLoading: false 
      });
    }
  }, [updateState]);

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(unitIndex > 0 ? 2 : 0)} ${units[unitIndex]}`;
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100); // Assuming amounts are in cents
  };

  const getRiskColor = (risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string) => {
    switch (risk.toUpperCase()) {
      case 'LOW': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'HIGH': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'CRITICAL': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getSubscriptionStatus = () => {
    if (!state.subscription) return { text: 'Free Plan', color: 'text-gray-600', icon: CreditCard };
    
    switch (state.subscription.status) {
      case 'active': return { text: 'Active', color: 'text-green-600', icon: CheckCircle };
      case 'past_due': return { text: 'Past Due', color: 'text-red-600', icon: XCircle };
      case 'canceled': return { text: 'Canceled', color: 'text-gray-600', icon: XCircle };
      case 'trialing': return { text: 'Trial', color: 'text-blue-600', icon: Clock };
      default: return { text: 'Unknown', color: 'text-gray-600', icon: AlertTriangle };
    }
  };

  const getUsagePercentage = (current: number, limit: number): number => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Dashboard
              </h1>
              {state.lastRefresh && (
                <span className="ml-4 text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {state.lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadDashboardData}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                title="Refresh dashboard"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <Link
                to="/app"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2 inline" />
                Upload Images
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Alerts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your ProofPix account and recent activity.
          </p>
          
          {/* Usage Alerts */}
          {state.alerts.length > 0 && state.alerts.some(alert => alert.triggered) && (
            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Usage Alerts
                  </h3>
                  <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    {state.alerts.filter(alert => alert.triggered).map((alert, index) => (
                      <p key={index}>
                        {alert.type}: {alert.current} / {alert.threshold} ({Math.round((alert.current / alert.threshold) * 100)}%)
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {state.error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-red-600 dark:text-red-400">{state.error}</p>
              <button
                onClick={loadDashboardData}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Files Processed */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FileImage className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Files Processed</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {state.stats?.filesProcessed?.toLocaleString() || state.usage?.metrics.filesProcessed?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Processed */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Processed</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {formatFileSize(state.stats?.totalSize || state.usage?.metrics.dataProcessed || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Risks */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Privacy Risks</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {state.stats?.privacyRisksFound || 
                       (state.analytics?.metrics.privacyRisksDetected ? 
                         Object.values(state.analytics.metrics.privacyRisksDetected).reduce((a, b) => a + b, 0) : 
                         '0')}
                    </p>
                  </div>
                </div>
              </div>

              {/* API Calls */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">API Calls</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {state.usage?.metrics.apiCalls?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Usage Progress */}
            {state.usage && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Usage Overview
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Resets {new Date(state.usage.resetDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Files Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Files</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {state.usage.metrics.filesProcessed} / {state.usage.limits.filesPerMonth}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(state.usage.metrics.filesProcessed, state.usage.limits.filesPerMonth))}`}
                        style={{ 
                          width: `${getUsagePercentage(state.usage.metrics.filesProcessed, state.usage.limits.filesPerMonth)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Data Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Data</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatFileSize(state.usage.metrics.dataProcessed)} / {formatFileSize(state.usage.limits.dataPerMonth)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(state.usage.metrics.dataProcessed, state.usage.limits.dataPerMonth))}`}
                        style={{ 
                          width: `${getUsagePercentage(state.usage.metrics.dataProcessed, state.usage.limits.dataPerMonth)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* API Calls Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">API Calls (Daily)</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {state.usage.metrics.apiCalls} / {state.usage.limits.apiCallsPerDay}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(state.usage.metrics.apiCalls, state.usage.limits.apiCallsPerDay))}`}
                        style={{ 
                          width: `${getUsagePercentage(state.usage.metrics.apiCalls, state.usage.limits.apiCallsPerDay)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Storage Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatFileSize(state.usage.metrics.storageUsed)} / {formatFileSize(state.usage.limits.storageLimit)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(state.usage.metrics.storageUsed, state.usage.limits.storageLimit))}`}
                        style={{ 
                          width: `${getUsagePercentage(state.usage.metrics.storageUsed, state.usage.limits.storageLimit)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image Metadata Viewer */}
            <ImageMetadataViewer />

            {/* Privacy Risk Breakdown */}
            {state.analytics?.metrics.privacyRisksDetected && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Privacy Risk Analysis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(state.analytics.metrics.privacyRisksDetected).map(([risk, count]) => (
                    <div key={risk} className="text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${getRiskColor(risk)}`}>
                        <span className="text-lg font-semibold">{count}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {risk}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Files */}
            {state.stats?.recentFiles && state.stats.recentFiles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Recent Files
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {state.stats.recentFiles.map((file) => (
                    <div key={file.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileImage className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatFileSize(file.size)} • {new Date(file.processedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(file.privacyRisk)}`}>
                            {file.privacyRisk}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/app"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View all files →
                  </Link>
                </div>
              </div>
            )}

            {/* Image Comparison Tool */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg mr-4">
                    <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Image Comparison</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compare metadata between images</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Side-by-side visual comparison
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Detailed metadata analysis
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Forensic comparison reports
                </div>
              </div>
              <button 
                onClick={() => navigate('/image-comparison')}
                className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Compare Images
              </button>
            </div>

            {/* Batch Processing - Pro/Enterprise only */}
            {(tier === 'pro' || tier === 'enterprise') && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg mr-4">
                      <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Batch Processing</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manage bulk operations</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time queue monitoring
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Bulk upload & processing
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Advanced job management
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/batch-processing')}
                  className="w-full mt-4 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Manage Batches
                </button>
              </div>
            )}

            {/* Advanced Reporting - Pro/Enterprise only */}
            {(tier === 'pro' || tier === 'enterprise') && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg mr-4">
                      <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Reporting</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Analytics & insights engine</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Custom report templates
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    AI-powered insights
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Scheduled reports
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/advanced-reporting')}
                  className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Reports
                </button>
              </div>
            )}

            {/* Enterprise SSO - Enterprise only */}
            {tier === 'enterprise' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-lg mr-4">
                      <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enterprise SSO</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Authentication & security</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    SAML & OAuth integration
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Multi-factor authentication
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Security policies
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/enterprise-sso')}
                  className="w-full mt-4 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Manage SSO
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Account & Subscription Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {React.createElement(getSubscriptionStatus().icon, { 
                    className: "h-5 w-5 text-gray-400 mr-3" 
                  })}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {state.subscription?.planId || 'Free Plan'}
                    </p>
                    <p className={`text-sm ${getSubscriptionStatus().color}`}>
                      {getSubscriptionStatus().text}
                    </p>
                  </div>
                </div>

                {state.subscription && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Next billing
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(state.subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Member since
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Invoices */}
            {state.recentInvoices.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Recent Invoices
                </h3>
                <div className="space-y-3">
                  {state.recentInvoices.slice(0, 3).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(invoice.amount.total, invoice.amount.currency)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(invoice.period.start).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' :
                          invoice.status === 'open' ? 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20' :
                          'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
                        }`}>
                          {invoice.status}
                        </span>
                        {invoice.metadata.downloadUrl && (
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/billing"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View all invoices →
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                onClick={() => navigate('/upload')}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                  <span className="text-sm text-gray-500">Quick Action</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Images</h3>
                <p className="text-sm text-gray-600">Process new images and extract metadata</p>
              </div>

              <div 
                onClick={() => navigate('/security-dashboard')}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                  <span className="text-sm text-gray-500">Pro/Enterprise</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Security Dashboard</h3>
                <p className="text-sm text-gray-600">Comprehensive security monitoring and compliance tracking</p>
              </div>

              {(tier === 'pro' || tier === 'enterprise') && (
                <div 
                  onClick={() => navigate('/chain-of-custody')}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                    <span className="text-sm text-gray-500">Pro/Enterprise</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Chain of Custody</h3>
                  <p className="text-sm text-gray-600">Legal-grade file tracking and verification</p>
                </div>
              )}

              {(tier === 'pro' || tier === 'enterprise') && (
                <div 
                  onClick={() => navigate('/content-management')}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <span className="text-sm text-gray-500">Pro/Enterprise</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Content Management</h3>
                  <p className="text-sm text-gray-600">Validate and analyze documentation quality</p>
                </div>
              )}

              {/* AI Packages Quick Access */}
              {(tier === 'pro' || tier === 'enterprise') && (
                <div 
                  onClick={() => navigate('/ai/legal-ai-package')}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Brain className="h-8 w-8 text-blue-600" />
                    <span className="text-sm text-gray-500">AI Package</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Legal AI Package</h3>
                  <p className="text-sm text-gray-600">Contract analysis & evidence processing</p>
                </div>
              )}

              {(tier === 'pro' || tier === 'enterprise') && (
                <div 
                  onClick={() => navigate('/ai/healthcare-ai-package')}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Brain className="h-8 w-8 text-green-600" />
                    <span className="text-sm text-gray-500">AI Package</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Healthcare AI Package</h3>
                  <p className="text-sm text-gray-600">HIPAA-compliant medical records processing</p>
                </div>
              )}

              {(tier === 'pro' || tier === 'enterprise') && (
                <div 
                  onClick={() => navigate('/ai/financial-ai-package')}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Brain className="h-8 w-8 text-purple-600" />
                    <span className="text-sm text-gray-500">AI Package</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Financial AI Package</h3>
                  <p className="text-sm text-gray-600">SOX compliance & audit automation</p>
                </div>
              )}

              {/* Workflow Templates Quick Access */}
              <div 
                onClick={() => navigate('/workflow-templates')}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Layers className="h-8 w-8 text-indigo-600" />
                  <span className="text-sm text-gray-500">Templates</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Workflow Templates</h3>
                <p className="text-sm text-gray-600">Pre-built automation workflows</p>
              </div>

              <div 
                onClick={() => navigate('/advanced-analytics')}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Brain className="h-8 w-8 text-indigo-600" />
                  <span className="text-sm text-gray-500">Enterprise</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                <p className="text-sm text-gray-600">AI-powered insights and predictive analytics</p>
              </div>

              <div 
                onClick={() => navigate('/docs')}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Book className="h-8 w-8 text-indigo-600" />
                  <span className="text-sm text-gray-500">Documentation</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
                <p className="text-sm text-gray-600">Browse guides and API documentation</p>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <Link
                  to="/docs"
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                >
                  Documentation
                </Link>
                <Link
                  to="/support"
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                >
                  Contact Support
                </Link>
                <Link
                  to="/faq"
                  className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 