// 🔒 SECURITY MONITORING DASHBOARD - Enterprise Security
// Real-time security event monitoring and threat detection

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, Users, FileX, Lock } from 'lucide-react';

interface SecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: any;
  ip?: string;
  userAgent?: string;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  blockedAttacks: number;
  validationFailures: number;
  rateLimitHits: number;
  fraudDetections: number;
}

export const SecurityDashboard: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalEvents: 0,
    blockedAttacks: 0,
    validationFailures: 0,
    rateLimitHits: 0,
    fraudDetections: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      // In a real implementation, this would fetch from your security monitoring API
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          event: 'File validation failed',
          severity: 'high',
          details: { fileName: 'suspicious.jpg', reason: 'Malicious content detected' },
          ip: '192.168.1.100'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          event: 'Session validation successful',
          severity: 'low',
          details: { planId: 'pro' },
          ip: '10.0.0.1'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          event: 'Rate limit exceeded',
          severity: 'medium',
          details: { endpoint: '/api/validate-plan-usage' },
          ip: '203.0.113.1'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          event: 'Fraudulent activity detected',
          severity: 'critical',
          details: { planType: 'free', actionType: 'batch', attempts: 10 },
          ip: '198.51.100.1'
        }
      ];

      const mockMetrics: SecurityMetrics = {
        totalEvents: 1247,
        criticalEvents: 3,
        blockedAttacks: 15,
        validationFailures: 42,
        rateLimitHits: 128,
        fraudDetections: 7
      };

      setEvents(mockEvents);
      setMetrics(mockMetrics);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load security data:', error);
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Activity className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.severity === filter
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
        </div>
        <p className="text-gray-400">Real-time security monitoring and threat detection</p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Events</p>
              <p className="text-2xl font-bold">{metrics.totalEvents.toLocaleString()}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Critical Events</p>
              <p className="text-2xl font-bold text-red-500">{metrics.criticalEvents}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Blocked Attacks</p>
              <p className="text-2xl font-bold text-green-500">{metrics.blockedAttacks}</p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Validation Failures</p>
              <p className="text-2xl font-bold text-orange-500">{metrics.validationFailures}</p>
            </div>
            <FileX className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rate Limit Hits</p>
              <p className="text-2xl font-bold text-yellow-500">{metrics.rateLimitHits}</p>
            </div>
            <Lock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fraud Detections</p>
              <p className="text-2xl font-bold text-purple-500">{metrics.fraudDetections}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Security Events */}
      <div className="bg-gray-800 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Security Events</h2>
            <div className="flex space-x-2">
              {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
                <button
                  key={severity}
                  onClick={() => setFilter(severity as any)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    filter === severity
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No security events found for the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                        {getSeverityIcon(event.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{event.event}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(event.severity)}`}>
                            {event.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                        {event.ip && (
                          <p className="text-gray-400 text-sm">
                            IP: <span className="font-mono">{event.ip}</span>
                          </p>
                        )}
                        {event.details && (
                          <div className="mt-2">
                            <details className="text-sm">
                              <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                                View Details
                              </summary>
                              <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-x-auto">
                                {JSON.stringify(event.details, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Security Status */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Security Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium">File Validation</p>
              <p className="text-sm text-gray-400">Active & Monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium">Session Security</p>
              <p className="text-sm text-gray-400">Encrypted & Validated</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium">Payment Protection</p>
              <p className="text-sm text-gray-400">Server-side Validation</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium">Rate Limiting</p>
              <p className="text-sm text-gray-400">Active Protection</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium">Fraud Detection</p>
              <p className="text-sm text-gray-400">AI-Powered Monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium">Security Headers</p>
              <p className="text-sm text-gray-400">Enterprise Grade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard; 