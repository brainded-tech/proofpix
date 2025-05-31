/**
 * DevOps Dashboard - Priority 10
 * Comprehensive deployment infrastructure and DevOps automation dashboard
 */

import React, { useState, useMemo } from 'react';
import { 
  useDeployments, 
  useInfrastructureMonitoring, 
  usePipelines, 
  useDeploymentMetrics,
  useRealTimeDeployments 
} from '../../hooks/useDeployment';
import { DeploymentConfig, EnvironmentConfig, InfrastructureStatus } from '../../services/deploymentService';

interface DevOpsDashboardProps {
  className?: string;
}

export const DevOpsDashboard: React.FC<DevOpsDashboardProps> = ({
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deployments' | 'infrastructure' | 'pipelines' | 'monitoring'>('overview');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');

  const { deployments, loading: deploymentsLoading, createDeployment, cancelDeployment, rollbackDeployment } = useDeployments();
  const { infrastructureStatus, loading: infrastructureLoading } = useInfrastructureMonitoring();
  const { pipelines, loading: pipelinesLoading, createPipeline } = usePipelines();
  const { metrics, loading: metricsLoading } = useDeploymentMetrics();
  const { activeDeployments, notifications, removeNotification, clearNotifications } = useRealTimeDeployments();

  const filteredDeployments = useMemo(() => {
    if (selectedEnvironment === 'all') return deployments;
    return deployments.filter(d => d.environment === selectedEnvironment);
  }, [deployments, selectedEnvironment]);

  const handleCreateDeployment = async () => {
    try {
      await createDeployment({
        name: `Deployment ${new Date().toLocaleString()}`,
        environment: selectedEnvironment === 'all' ? 'development' : selectedEnvironment as any,
        type: 'fullstack',
        branch: 'main',
        version: '1.0.0'
      });
    } catch (error) {
      console.error('Failed to create deployment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'failed':
      case 'down':
        return 'text-red-600 bg-red-100';
      case 'building':
      case 'deploying':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy':
        return '✅';
      case 'failed':
      case 'down':
        return '❌';
      case 'building':
      case 'deploying':
        return '🔄';
      case 'degraded':
        return '⚠️';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '🚫';
      default:
        return '❓';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deployments</p>
              <p className="text-2xl font-bold text-gray-900">
                {metricsLoading ? '...' : metrics?.total || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              {metricsLoading ? '...' : metrics?.deploymentsToday || 0} today
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {metricsLoading ? '...' : `${Math.round(metrics?.successRate || 0)}%`}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              {metricsLoading ? '...' : metrics?.successful || 0} successful
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-blue-600">
                {metricsLoading ? '...' : `${Math.round((metrics?.avgDuration || 0) / 1000)}s`}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Average build time</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deployments</p>
              <p className="text-2xl font-bold text-orange-600">
                {activeDeployments.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">🔄</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Currently running</span>
          </div>
        </div>
      </div>

      {/* Infrastructure Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Infrastructure Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {infrastructureStatus.map((env) => (
            <div key={env.environment} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 capitalize">{env.environment}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(env.status)}`}>
                  {getStatusIcon(env.status)} {env.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-medium">{env.uptime.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Services:</span>
                  <span className="font-medium">
                    {env.services.filter(s => s.status === 'healthy').length}/{env.services.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-medium">{Math.round(env.metrics.responseTime)}ms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Deployments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Deployments</h3>
          <button
            onClick={handleCreateDeployment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Deployment
          </button>
        </div>
        <div className="space-y-3">
          {filteredDeployments.slice(0, 5).map((deployment) => (
            <div key={deployment.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getStatusIcon(deployment.status)}</span>
                <div>
                  <p className="font-medium text-gray-900">{deployment.name}</p>
                  <p className="text-sm text-gray-600">
                    {deployment.environment} • {deployment.type} • {deployment.branch}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                  {deployment.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {deployment.duration ? `${Math.round(deployment.duration / 1000)}s` : 'In progress'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeployments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Deployments</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedEnvironment}
            onChange={(e) => setSelectedEnvironment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Environments</option>
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
          <button
            onClick={handleCreateDeployment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Deployment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deployment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Environment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeployments.map((deployment) => (
                <tr key={deployment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{deployment.name}</div>
                      <div className="text-sm text-gray-500">{deployment.branch} • {deployment.commit.slice(0, 7)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                      {deployment.environment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                      {getStatusIcon(deployment.status)} {deployment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deployment.duration ? `${Math.round(deployment.duration / 1000)}s` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {deployment.createdAt.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {(deployment.status === 'building' || deployment.status === 'deploying') && (
                      <button
                        onClick={() => cancelDeployment(deployment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                    {deployment.status === 'success' && (
                      <button
                        onClick={() => rollbackDeployment(deployment.id)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Rollback
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInfrastructure = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Infrastructure Monitoring</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {infrastructureStatus.map((env) => (
          <div key={env.environment} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 capitalize">{env.environment}</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(env.status)}`}>
                {getStatusIcon(env.status)} {env.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="font-medium">{Math.round(env.metrics.cpu)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${env.metrics.cpu}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="font-medium">{Math.round(env.metrics.memory)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${env.metrics.memory}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Disk Usage</span>
                  <span className="font-medium">{Math.round(env.metrics.disk)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${env.metrics.disk}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Services</h5>
              <div className="space-y-2">
                {env.services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{service.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{service.responseTime}ms</span>
                      <span className={`w-2 h-2 rounded-full ${
                        service.status === 'healthy' ? 'bg-green-500' : 
                        service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{env.uptime.toFixed(2)}%</p>
                  <p className="text-xs text-gray-500">Uptime</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{Math.round(env.metrics.responseTime)}ms</p>
                  <p className="text-xs text-gray-500">Response Time</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPipelines = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">CI/CD Pipelines</h3>
        <button
          onClick={() => createPipeline({ name: `Pipeline ${new Date().toLocaleString()}` })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Pipeline
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pipelines.map((pipeline) => (
          <div key={pipeline.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">{pipeline.name}</h4>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {pipeline.trigger}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Environment:</span>
                <span className="font-medium capitalize">{pipeline.environment}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Stages:</span>
                <span className="font-medium">{pipeline.stages.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rollback:</span>
                <span className="font-medium">{pipeline.rollback.enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Pipeline Stages</h5>
              <div className="space-y-1">
                {pipeline.stages.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-900">{stage.name}</span>
                    <span className="text-gray-500">({stage.type})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Real-time Monitoring</h3>
      
      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Recent Notifications</h4>
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear All
            </button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent notifications</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {notification.type === 'success' ? '✅' : 
                     notification.type === 'error' ? '❌' : 
                     notification.type === 'warning' ? '⚠️' : 'ℹ️'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Deployments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Active Deployments</h4>
        
        {activeDeployments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No active deployments</p>
        ) : (
          <div className="space-y-4">
            {activeDeployments.map((deployment) => (
              <div key={deployment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{deployment.name}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                    {getStatusIcon(deployment.status)} {deployment.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {deployment.environment} • {deployment.type} • {deployment.branch}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        width: deployment.status === 'building' ? '30%' : 
                               deployment.status === 'deploying' ? '70%' : '100%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">DevOps Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive deployment infrastructure and DevOps automation
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'deployments', label: 'Deployments', icon: '🚀' },
            { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
            { id: 'pipelines', label: 'Pipelines', icon: '🔄' },
            { id: 'monitoring', label: 'Monitoring', icon: '📡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'deployments' && renderDeployments()}
        {activeTab === 'infrastructure' && renderInfrastructure()}
        {activeTab === 'pipelines' && renderPipelines()}
        {activeTab === 'monitoring' && renderMonitoring()}
      </div>
    </div>
  );
}; 