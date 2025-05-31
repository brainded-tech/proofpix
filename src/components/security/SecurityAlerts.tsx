import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  X,
  Monitor,
  Globe
} from 'lucide-react';
import { securityHardening } from '../../utils/securityHardening';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'authentication' | 'authorization' | 'data_breach' | 'malware' | 'network' | 'compliance' | 'system';
  title: string;
  message: string;
  timestamp: number;
  source: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  acknowledged: boolean;
  resolved: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    type: 'primary' | 'secondary' | 'danger';
  }>;
  metadata?: Record<string, any>;
}

interface SecurityAlertsProps {
  maxAlerts?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  showFilters?: boolean;
  onAlertAction?: (alertId: string, action: string) => void;
}

export const SecurityAlerts: React.FC<SecurityAlertsProps> = ({
  maxAlerts = 50,
  autoRefresh = true,
  refreshInterval = 30000,
  showFilters = true,
  onAlertAction
}) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'critical' | 'high' | 'medium' | 'low' | 'info',
    category: 'all' as 'all' | 'authentication' | 'authorization' | 'data_breach' | 'malware' | 'network' | 'compliance' | 'system',
    status: 'all' as 'all' | 'unresolved' | 'acknowledged' | 'resolved',
    timeRange: '24h' as '1h' | '24h' | '7d' | '30d'
  });
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);

  // Generate mock security alerts
  const generateMockAlerts = useCallback((): SecurityAlert[] => {
    const alertTypes: Array<SecurityAlert['type']> = ['critical', 'high', 'medium', 'low', 'info'];
    const categories: Array<SecurityAlert['category']> = ['authentication', 'authorization', 'data_breach', 'malware', 'network', 'compliance', 'system'];
    
    const mockAlerts: SecurityAlert[] = [
      {
        id: 'alert-001',
        type: 'critical',
        category: 'authentication',
        title: 'Multiple Failed Login Attempts',
        message: 'Detected 15 failed login attempts from IP 192.168.1.100 in the last 5 minutes',
        timestamp: Date.now() - 300000,
        source: 'Authentication Service',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        acknowledged: false,
        resolved: false,
        actions: [
          { label: 'Block IP', action: () => {}, type: 'danger' },
          { label: 'Investigate', action: () => {}, type: 'primary' }
        ],
        metadata: { attemptCount: 15, targetUser: 'admin@company.com' }
      },
      {
        id: 'alert-002',
        type: 'high',
        category: 'data_breach',
        title: 'Suspicious Data Export Activity',
        message: 'Large volume data export detected outside business hours',
        timestamp: Date.now() - 1800000,
        source: 'Data Loss Prevention',
        userId: 'user-456',
        acknowledged: true,
        resolved: false,
        actions: [
          { label: 'Review Export', action: () => {}, type: 'primary' },
          { label: 'Contact User', action: () => {}, type: 'secondary' }
        ],
        metadata: { exportSize: '2.5GB', exportTime: '02:30 AM' }
      },
      {
        id: 'alert-003',
        type: 'medium',
        category: 'malware',
        title: 'Malicious File Upload Blocked',
        message: 'Attempted upload of potentially malicious file detected and blocked',
        timestamp: Date.now() - 3600000,
        source: 'File Scanner',
        ipAddress: '10.0.0.45',
        acknowledged: false,
        resolved: true,
        metadata: { fileName: 'document.exe', fileSize: '1.2MB', scanResult: 'Trojan.Generic' }
      },
      {
        id: 'alert-004',
        type: 'high',
        category: 'compliance',
        title: 'GDPR Compliance Violation',
        message: 'Personal data accessed without proper consent documentation',
        timestamp: Date.now() - 7200000,
        source: 'Compliance Monitor',
        userId: 'user-789',
        acknowledged: false,
        resolved: false,
        actions: [
          { label: 'Review Access', action: () => {}, type: 'primary' },
          { label: 'Generate Report', action: () => {}, type: 'secondary' }
        ],
        metadata: { dataType: 'PII', recordCount: 150, regulation: 'GDPR' }
      },
      {
        id: 'alert-005',
        type: 'medium',
        category: 'network',
        title: 'Unusual Network Traffic Pattern',
        message: 'Detected abnormal outbound traffic to unknown external servers',
        timestamp: Date.now() - 10800000,
        source: 'Network Monitor',
        ipAddress: '203.0.113.42',
        acknowledged: true,
        resolved: false,
        metadata: { trafficVolume: '500MB', destination: '203.0.113.42', protocol: 'HTTPS' }
      },
      {
        id: 'alert-006',
        type: 'info',
        category: 'system',
        title: 'Security Patch Applied',
        message: 'Critical security update successfully installed on all systems',
        timestamp: Date.now() - 14400000,
        source: 'System Update Service',
        acknowledged: true,
        resolved: true,
        metadata: { patchId: 'KB5028166', affectedSystems: 25 }
      }
    ];

    return mockAlerts;
  }, []);

  // Load alerts
  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from an API
      const mockAlerts = generateMockAlerts();
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Failed to load security alerts:', error);
    } finally {
      setLoading(false);
    }
  }, [generateMockAlerts]);

  // Filter alerts based on current filters
  const applyFilters = useCallback(() => {
    let filtered = [...alerts];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(alert => alert.type === filters.type);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(alert => alert.category === filters.category);
    }

    // Filter by status
    if (filters.status !== 'all') {
      if (filters.status === 'unresolved') {
        filtered = filtered.filter(alert => !alert.resolved);
      } else if (filters.status === 'acknowledged') {
        filtered = filtered.filter(alert => alert.acknowledged && !alert.resolved);
      } else if (filters.status === 'resolved') {
        filtered = filtered.filter(alert => alert.resolved);
      }
    }

    // Filter by time range
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = now - timeRanges[filters.timeRange];
    filtered = filtered.filter(alert => alert.timestamp >= cutoff);

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // Limit results
    filtered = filtered.slice(0, maxAlerts);

    setFilteredAlerts(filtered);
  }, [alerts, filters, maxAlerts]);

  // Handle alert actions
  const handleAlertAction = useCallback((alertId: string, actionType: string) => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        switch (actionType) {
          case 'acknowledge':
            return { ...alert, acknowledged: true };
          case 'resolve':
            return { ...alert, resolved: true, acknowledged: true };
          case 'dismiss':
            return { ...alert, acknowledged: true };
          default:
            return alert;
        }
      }
      return alert;
    }));

    if (onAlertAction) {
      onAlertAction(alertId, actionType);
    }
  }, [onAlertAction]);

  // Get alert icon
  const getAlertIcon = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'critical':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'info':
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get alert color classes
  const getAlertColorClasses = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'info':
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
      default:
        return 'border-gray-300 bg-white dark:bg-gray-800';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;

    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Initialize component
  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAlerts();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadAlerts]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Security Alerts
            </h3>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium px-2 py-1 rounded-full">
              {filteredAlerts.filter(a => !a.resolved).length} Active
            </span>
          </div>
          <button
            onClick={loadAlerts}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="authentication">Authentication</option>
              <option value="authorization">Authorization</option>
              <option value="data_breach">Data Breach</option>
              <option value="malware">Malware</option>
              <option value="network">Network</option>
              <option value="compliance">Compliance</option>
              <option value="system">System</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Status</option>
              <option value="unresolved">Unresolved</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={filters.timeRange}
              onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value as any }))}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        )}
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No security alerts found for the selected filters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border-l-4 ${getAlertColorClasses(alert.type)} ${
                alert.resolved ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {alert.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        alert.type === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        alert.type === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        alert.type === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        alert.type === 'low' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}>
                        {alert.type.toUpperCase()}
                      </span>
                      {alert.acknowledged && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium">
                          ACKNOWLEDGED
                        </span>
                      )}
                      {alert.resolved && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 font-medium">
                          RESOLVED
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(alert.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Monitor className="h-3 w-3" />
                        <span>{alert.source}</span>
                      </div>
                      {alert.ipAddress && (
                        <div className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>{alert.ipAddress}</span>
                        </div>
                      )}
                      {alert.userId && (
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{alert.userId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                    >
                      Acknowledge
                    </button>
                  )}
                  {!alert.resolved && (
                    <button
                      onClick={() => handleAlertAction(alert.id, 'resolve')}
                      className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-900/50"
                  >
                    Details
                  </button>
                </div>
              </div>

              {/* Custom Actions */}
              {alert.actions && alert.actions.length > 0 && (
                <div className="mt-3 flex items-center space-x-2">
                  {alert.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`text-xs px-3 py-1 rounded font-medium ${
                        action.type === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                        action.type === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' :
                        'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Alert Details
                </h3>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alert ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {selectedAlert.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedAlert.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedAlert.message}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Severity
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                      {selectedAlert.type}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                      {selectedAlert.category.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Timestamp
                  </label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(selectedAlert.timestamp).toLocaleString()}
                  </p>
                </div>
                {selectedAlert.metadata && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Additional Information
                    </label>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                      {JSON.stringify(selectedAlert.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAlerts; 