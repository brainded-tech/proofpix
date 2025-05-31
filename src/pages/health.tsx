import React, { useEffect, useState } from 'react';
import { APP_CONFIG } from '../config/app.config';

// Add memory extension to Performance interface
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
    };
  }
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  environment: string;
  timestamp: string;
  uptime: number;
  features: {
    documentAI: boolean;
    batchProcessing: boolean;
    enterpriseMode: boolean;
    whiteLabel: boolean;
  };
  performance: {
    memory: {
      used: number;
      total: number;
    };
    loadTime: number;
  };
}

const HealthCheck: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const startTime = performance.now();
        
        // Safely access memory property with fallback
        const memory = performance.memory ?? {
          usedJSHeapSize: 0,
          totalJSHeapSize: 0
        };

        const status: HealthStatus = {
          status: 'healthy',
          version: APP_CONFIG.version,
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString(),
          uptime: Math.floor(performance.now() / 1000),
          features: {
            documentAI: APP_CONFIG.features.documentAI || false,
            batchProcessing: APP_CONFIG.features.bulkProcessing || false,
            enterpriseMode: APP_CONFIG.features.enterpriseMode || false,
            whiteLabel: APP_CONFIG.features.whiteLabel || false
          },
          performance: {
            memory: {
              used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
              total: Math.round(memory.totalJSHeapSize / 1024 / 1024)
            },
            loadTime: Math.round(performance.now() - startTime)
          }
        };

        setHealth(status);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check health');
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  if (loading) {
    return <div>Loading health status...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!health) {
    return <div>No health data available</div>;
  }

  return (
    <div className="health-check">
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </div>
  );
};

export default HealthCheck; 