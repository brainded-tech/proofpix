/**
 * Enhanced Dashboard - Priority 5A Integration Showcase
 * Comprehensive dashboard featuring all new backend integrations
 */

import React, { useState, useEffect } from 'react';
import { useUsageStats, useAnalytics, useRealTimeUpdates, useComplianceStatus } from '../hooks/useApiIntegration';
import FileUploadComponent from '../components/integration/FileUploadComponent';
import ApiKeyManager from '../components/integration/ApiKeyManager';
import apiService from '../services/apiService';

interface DashboardTab {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
}

const EnhancedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [realtimeEvents, setRealtimeEvents] = useState<any[]>([]);
  
  const { stats, loading: statsLoading } = useUsageStats();
  const { data: analyticsData, loading: analyticsLoading } = useAnalytics({
    timeRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      end: new Date(),
    },
  });
  const { connected, subscribe, unsubscribe } = useRealTimeUpdates();
  const { status: complianceStatus, loading: complianceLoading } = useComplianceStatus();

  // Subscribe to real-time events
  useEffect(() => {
    const handleRealtimeEvent = (data: any) => {
      setRealtimeEvents(prev => [
        { ...data, timestamp: new Date() },
        ...prev.slice(0, 9) // Keep only last 10 events
      ]);
    };

    if (connected) {
      subscribe('file:uploaded', handleRealtimeEvent);
      subscribe('file:processed', handleRealtimeEvent);
      subscribe('api:request', handleRealtimeEvent);
      subscribe('security:event', handleRealtimeEvent);
      subscribe('webhook:delivered', handleRealtimeEvent);
    }

    return () => {
      if (connected) {
        unsubscribe('file:uploaded', handleRealtimeEvent);
        unsubscribe('file:processed', handleRealtimeEvent);
        unsubscribe('api:request', handleRealtimeEvent);
        unsubscribe('security:event', handleRealtimeEvent);
        unsubscribe('webhook:delivered', handleRealtimeEvent);
      }
    };
  }, [connected, subscribe, unsubscribe]);

  // Overview Component
  const OverviewTab: React.FC = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <span className="text-2xl">📁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statsLoading ? '...' : stats?.totalFiles.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Processed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statsLoading ? '...' : stats?.totalProcessed.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <span className="text-2xl">🔗</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">API Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statsLoading ? '...' : stats?.apiCalls.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statsLoading ? '...' : stats?.activeUsers.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity & Compliance Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Real-time Activity
            </h3>
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} 
                 title={connected ? 'Connected' : 'Disconnected'} />
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {realtimeEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No recent activity
              </p>
            ) : (
              realtimeEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-lg">
                    {event.type === 'file:uploaded' && '📤'}
                    {event.type === 'file:processed' && '⚡'}
                    {event.type === 'api:request' && '🔗'}
                    {event.type === 'security:event' && '🛡️'}
                    {event.type === 'webhook:delivered' && '📡'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {event.message || event.type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {event.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Compliance Status
          </h3>
          
          {complianceLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : complianceStatus ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</span>
                <span className={`text-lg font-bold ${
                  complianceStatus.overall.score >= 90 ? 'text-green-600' :
                  complianceStatus.overall.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {complianceStatus.overall.score}%
                </span>
              </div>
              
              <div className="space-y-2">
                {Object.entries(complianceStatus).filter(([key]) => key !== 'overall').map(([standard, data]: [string, any]) => (
                  <div key={standard} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 uppercase">
                      {standard}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${
                        data.compliant ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {data.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Unable to load compliance status</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('files')}
            className="p-4 text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <div className="text-2xl mb-2">📁</div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Upload Files</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Process documents with AI</p>
          </button>
          
          <button
            onClick={() => setActiveTab('api-keys')}
            className="p-4 text-left bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
          >
            <div className="text-2xl mb-2">🔑</div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Manage API Keys</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create and monitor keys</p>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className="p-4 text-left bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">View Analytics</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Detailed insights</p>
          </button>
        </div>
      </div>
    </div>
  );

  // Files Tab Component
  const FilesTab: React.FC = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          File Processing
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload and process files with advanced AI capabilities
        </p>
      </div>
      
      <FileUploadComponent
        onUploadComplete={(files) => {
          console.log('Files uploaded:', files);
          // Refresh stats or show notification
        }}
        onUploadError={(error) => {
          console.error('Upload error:', error);
          // Show error notification
        }}
        enableVirusScan={true}
        enableMetadataExtraction={true}
        enableThumbnails={true}
        allowBatch={true}
      />
    </div>
  );

  // Analytics Tab Component
  const AnalyticsTab: React.FC = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Analytics & Insights
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive analytics and performance metrics
        </p>
      </div>
      
      {analyticsLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading analytics...</span>
        </div>
      ) : analyticsData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(analyticsData.metrics).map(([key, value]) => (
            <div key={key} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No analytics data available</p>
      )}
    </div>
  );

  const tabs: DashboardTab[] = [
    { id: 'overview', name: 'Overview', icon: '📊', component: OverviewTab },
    { id: 'files', name: 'File Processing', icon: '📁', component: FilesTab },
    { id: 'api-keys', name: 'API Keys', icon: '🔑', component: ApiKeyManager },
    { id: 'analytics', name: 'Analytics', icon: '📈', component: AnalyticsTab },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || OverviewTab;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            ProofPix Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Advanced API & Integration Platform - Priority 5A
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard; 