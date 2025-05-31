/**
 * Deployment Management Hooks - Priority 10
 * React hooks for deployment infrastructure and DevOps automation
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { deploymentService, DeploymentConfig, EnvironmentConfig, InfrastructureStatus, PipelineConfig, DeploymentLog } from '../services/deploymentService';

// Deployment Management Hook
export const useDeployments = () => {
  const [deployments, setDeployments] = useState<DeploymentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeployments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deploymentService.getDeployments();
      setDeployments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deployments');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDeployment = useCallback(async (config: Partial<DeploymentConfig>) => {
    try {
      setError(null);
      const deploymentId = await deploymentService.createDeployment(config);
      await loadDeployments(); // Refresh list
      return deploymentId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deployment');
      throw err;
    }
  }, [loadDeployments]);

  const cancelDeployment = useCallback(async (deploymentId: string) => {
    try {
      setError(null);
      await deploymentService.cancelDeployment(deploymentId);
      await loadDeployments(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel deployment');
      throw err;
    }
  }, [loadDeployments]);

  const rollbackDeployment = useCallback(async (deploymentId: string) => {
    try {
      setError(null);
      await deploymentService.rollbackDeployment(deploymentId);
      await loadDeployments(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rollback deployment');
      throw err;
    }
  }, [loadDeployments]);

  useEffect(() => {
    loadDeployments();
  }, [loadDeployments]);

  return {
    deployments,
    loading,
    error,
    createDeployment,
    cancelDeployment,
    rollbackDeployment,
    refresh: loadDeployments
  };
};

// Single Deployment Hook
export const useDeployment = (deploymentId: string | null) => {
  const [deployment, setDeployment] = useState<DeploymentConfig | null>(null);
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeployment = useCallback(async () => {
    if (!deploymentId) {
      setDeployment(null);
      setLogs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [deploymentData, logsData] = await Promise.all([
        deploymentService.getDeployment(deploymentId),
        deploymentService.getDeploymentLogs(deploymentId)
      ]);
      
      setDeployment(deploymentData);
      setLogs(logsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deployment');
    } finally {
      setLoading(false);
    }
  }, [deploymentId]);

  useEffect(() => {
    loadDeployment();
    
    // Auto-refresh for active deployments
    if (deployment && (deployment.status === 'building' || deployment.status === 'deploying')) {
      const interval = setInterval(loadDeployment, 2000);
      return () => clearInterval(interval);
    }
  }, [loadDeployment, deployment?.status]);

  return {
    deployment,
    logs,
    loading,
    error,
    refresh: loadDeployment
  };
};

// Environment Management Hook
export const useEnvironments = () => {
  const [environments, setEnvironments] = useState<EnvironmentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEnvironments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deploymentService.getEnvironments();
      setEnvironments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load environments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnvironments();
  }, [loadEnvironments]);

  return {
    environments,
    loading,
    error,
    refresh: loadEnvironments
  };
};

// Infrastructure Monitoring Hook
export const useInfrastructureMonitoring = () => {
  const [infrastructureStatus, setInfrastructureStatus] = useState<InfrastructureStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadInfrastructureStatus = useCallback(async () => {
    try {
      setError(null);
      const data = await deploymentService.getInfrastructureStatus();
      setInfrastructureStatus(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load infrastructure status');
      setLoading(false);
    }
  }, []);

  const startMonitoring = useCallback(() => {
    loadInfrastructureStatus();
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(loadInfrastructureStatus, 30000); // Update every 30 seconds
  }, [loadInfrastructureStatus]);

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startMonitoring();
    
    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring]);

  return {
    infrastructureStatus,
    loading,
    error,
    startMonitoring,
    stopMonitoring,
    refresh: loadInfrastructureStatus
  };
};

// Pipeline Management Hook
export const usePipelines = () => {
  const [pipelines, setPipelines] = useState<PipelineConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPipelines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deploymentService.getPipelines();
      setPipelines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pipelines');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPipeline = useCallback(async (config: Partial<PipelineConfig>) => {
    try {
      setError(null);
      const pipelineId = await deploymentService.createPipeline(config);
      await loadPipelines(); // Refresh list
      return pipelineId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pipeline');
      throw err;
    }
  }, [loadPipelines]);

  useEffect(() => {
    loadPipelines();
  }, [loadPipelines]);

  return {
    pipelines,
    loading,
    error,
    createPipeline,
    refresh: loadPipelines
  };
};

// Deployment Metrics Hook
export const useDeploymentMetrics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deploymentService.getDeploymentMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deployment metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
    
    // Auto-refresh metrics every minute
    const interval = setInterval(loadMetrics, 60000);
    return () => clearInterval(interval);
  }, [loadMetrics]);

  return {
    metrics,
    loading,
    error,
    refresh: loadMetrics
  };
};

// Real-time Deployment Updates Hook
export const useRealTimeDeployments = () => {
  const [activeDeployments, setActiveDeployments] = useState<DeploymentConfig[]>([]);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timestamp: Date;
    deploymentId?: string;
  }>>([]);

  const addNotification = useCallback((notification: Omit<typeof notifications[0], 'id' | 'timestamp'>) => {
    const newNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10 notifications
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const deployments = await deploymentService.getDeployments();
        const active = deployments.filter(d => 
          d.status === 'building' || d.status === 'deploying'
        );
        
        // Check for status changes
        active.forEach(deployment => {
          const existing = activeDeployments.find(d => d.id === deployment.id);
          if (!existing) {
            addNotification({
              type: 'info',
              message: `Deployment ${deployment.name} started`,
              deploymentId: deployment.id
            });
          } else if (existing.status !== deployment.status) {
            if (deployment.status === 'success') {
              addNotification({
                type: 'success',
                message: `Deployment ${deployment.name} completed successfully`,
                deploymentId: deployment.id
              });
            } else if (deployment.status === 'failed') {
              addNotification({
                type: 'error',
                message: `Deployment ${deployment.name} failed`,
                deploymentId: deployment.id
              });
            }
          }
        });
        
        setActiveDeployments(active);
      } catch (error) {
        console.error('Failed to update real-time deployments:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [activeDeployments, addNotification]);

  return {
    activeDeployments,
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };
};

// Environment Health Hook
export const useEnvironmentHealth = (environmentName: string) => {
  const [status, setStatus] = useState<InfrastructureStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      setError(null);
      const data = await deploymentService.getEnvironmentStatus(environmentName);
      setStatus(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load environment status');
      setLoading(false);
    }
  }, [environmentName]);

  useEffect(() => {
    loadStatus();
    
    // Auto-refresh status every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [loadStatus]);

  return {
    status,
    loading,
    error,
    refresh: loadStatus
  };
}; 