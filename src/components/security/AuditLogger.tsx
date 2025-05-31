import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Clock,
  MapPin,
  Monitor,
  Shield,
  Database,
  Key,
  Settings,
  Activity,
  AlertCircle
} from 'lucide-react';

interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: 'authentication' | 'authorization' | 'data_access' | 'system' | 'security' | 'compliance';
  action: string;
  resource: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  session: {
    id: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
    device?: string;
  };
  outcome: 'success' | 'failure' | 'warning' | 'blocked';
  riskScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  metadata: {
    requestId?: string;
    correlationId?: string;
    tags: string[];
    source: string;
  };
  complianceFlags: string[];
}

interface AuditFilters {
  eventType?: string;
  outcome?: string;
  severity?: string;
  user?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  riskScoreMin?: number;
  riskScoreMax?: number;
  searchTerm?: string;
}

interface AuditLoggerProps {
  onEventSelect?: (event: AuditEvent) => void;
  onExportRequest?: (events: AuditEvent[], format: 'csv' | 'json' | 'pdf') => void;
  realTimeUpdates?: boolean;
}

export const AuditLogger: React.FC<AuditLoggerProps> = ({
  onEventSelect,
  onExportRequest,
  realTimeUpdates = true
}) => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      end: new Date()
    }
  });
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadAuditEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate loading audit events
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockEvents: AuditEvent[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          eventType: 'authentication',
          action: 'login_failed',
          resource: '/auth/login',
          user: {
            id: 'user_123',
            email: 'john.doe@company.com',
            name: 'John Doe',
            role: 'user'
          },
          session: {
            id: 'session_456',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            location: 'New York, US',
            device: 'Desktop'
          },
          outcome: 'failure',
          riskScore: 75,
          severity: 'medium',
          details: {
            reason: 'invalid_password',
            attempts: 3,
            lockoutTriggered: false
          },
          metadata: {
            requestId: 'req_789',
            correlationId: 'corr_abc',
            tags: ['authentication', 'failed_login'],
            source: 'web_app'
          },
          complianceFlags: ['SOC2_CC6.1', 'HIPAA_164.312(a)(1)']
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          eventType: 'data_access',
          action: 'export_user_data',
          resource: '/api/users/export',
          user: {
            id: 'admin_456',
            email: 'admin@company.com',
            name: 'Admin User',
            role: 'admin'
          },
          session: {
            id: 'session_789',
            ipAddress: '10.0.0.1',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            location: 'San Francisco, US',
            device: 'Desktop'
          },
          outcome: 'success',
          riskScore: 45,
          severity: 'medium',
          details: {
            recordCount: 150,
            format: 'CSV',
            dataTypes: ['personal_info', 'usage_data'],
            fileSize: 2048576
          },
          metadata: {
            requestId: 'req_def',
            correlationId: 'corr_ghi',
            tags: ['data_export', 'admin_action'],
            source: 'admin_panel'
          },
          complianceFlags: ['GDPR_Art15', 'CCPA_1798.110']
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          eventType: 'security',
          action: 'suspicious_activity_detected',
          resource: '/api/files/upload',
          user: {
            id: 'user_789',
            email: 'suspicious@external.com',
            name: 'Unknown User',
            role: 'user'
          },
          session: {
            id: 'session_abc',
            ipAddress: '203.0.113.1',
            userAgent: 'curl/7.68.0',
            location: 'Unknown',
            device: 'Unknown'
          },
          outcome: 'blocked',
          riskScore: 95,
          severity: 'critical',
          details: {
            reason: 'rate_limit_exceeded',
            requestsPerMinute: 1000,
            threshold: 100,
            blockedDuration: 3600
          },
          metadata: {
            requestId: 'req_jkl',
            correlationId: 'corr_mno',
            tags: ['rate_limit', 'suspicious_activity', 'blocked'],
            source: 'api_gateway'
          },
          complianceFlags: ['SOC2_CC6.7', 'ISO27001_A.12.6.1']
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          eventType: 'system',
          action: 'configuration_changed',
          resource: '/admin/settings/security',
          user: {
            id: 'admin_123',
            email: 'security@company.com',
            name: 'Security Admin',
            role: 'security_admin'
          },
          session: {
            id: 'session_def',
            ipAddress: '10.0.0.5',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            location: 'Corporate Office',
            device: 'Desktop'
          },
          outcome: 'success',
          riskScore: 30,
          severity: 'low',
          details: {
            setting: 'password_policy',
            oldValue: { minLength: 8, requireSpecialChars: false },
            newValue: { minLength: 12, requireSpecialChars: true },
            approvedBy: 'CISO'
          },
          metadata: {
            requestId: 'req_pqr',
            correlationId: 'corr_stu',
            tags: ['configuration', 'security_policy'],
            source: 'admin_panel'
          },
          complianceFlags: ['SOC2_CC6.1', 'NIST_AC-7']
        }
      ];

      setEvents(mockEvents);
      setLastRefresh(new Date());

    } catch (err) {
      setError('Failed to load audit events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...events];

    // Date range filter
    filtered = filtered.filter(event => 
      event.timestamp >= filters.dateRange.start && 
      event.timestamp <= filters.dateRange.end
    );

    // Event type filter
    if (filters.eventType) {
      filtered = filtered.filter(event => event.eventType === filters.eventType);
    }

    // Outcome filter
    if (filters.outcome) {
      filtered = filtered.filter(event => event.outcome === filters.outcome);
    }

    // Severity filter
    if (filters.severity) {
      filtered = filtered.filter(event => event.severity === filters.severity);
    }

    // User filter
    if (filters.user) {
      filtered = filtered.filter(event => 
        event.user.email.toLowerCase().includes(filters.user!.toLowerCase()) ||
        event.user.name.toLowerCase().includes(filters.user!.toLowerCase())
      );
    }

    // Risk score filter
    if (filters.riskScoreMin !== undefined) {
      filtered = filtered.filter(event => event.riskScore >= filters.riskScoreMin!);
    }
    if (filters.riskScoreMax !== undefined) {
      filtered = filtered.filter(event => event.riskScore <= filters.riskScoreMax!);
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.action.toLowerCase().includes(searchLower) ||
        event.resource.toLowerCase().includes(searchLower) ||
        JSON.stringify(event.details).toLowerCase().includes(searchLower)
      );
    }

    setFilteredEvents(filtered);
  }, [events, filters]);

  useEffect(() => {
    loadAuditEvents();
    
    if (realTimeUpdates) {
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadAuditEvents, 30 * 1000);
      return () => clearInterval(interval);
    }
  }, [loadAuditEvents, realTimeUpdates]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'authentication': return <Key className="h-4 w-4" />;
      case 'authorization': return <Shield className="h-4 w-4" />;
      case 'data_access': return <Database className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      case 'security': return <AlertTriangle className="h-4 w-4" />;
      case 'compliance': return <FileText className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'blocked': return <Shield className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleEventClick = (event: AuditEvent) => {
    setSelectedEvent(event);
    onEventSelect?.(event);
  };

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    onExportRequest?.(filteredEvents, format);
  };

  const clearFilters = () => {
    setFilters({
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      }
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading audit events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Audit Log
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredEvents.length} of {events.length} events
            {lastRefresh && ` • Last updated: ${lastRefresh.toLocaleTimeString()}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
              showFilters 
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="h-4 w-4 mr-1 inline" />
            Filters
          </button>
          <div className="relative">
            <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="h-4 w-4 mr-1 inline" />
              Export
            </button>
          </div>
          <button
            onClick={loadAuditEvents}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Type
              </label>
              <select
                value={filters.eventType || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Types</option>
                <option value="authentication">Authentication</option>
                <option value="authorization">Authorization</option>
                <option value="data_access">Data Access</option>
                <option value="system">System</option>
                <option value="security">Security</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Outcome
              </label>
              <select
                value={filters.outcome || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, outcome: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Outcomes</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
                <option value="warning">Warning</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Severity
              </label>
              <select
                value={filters.severity || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                User
              </label>
              <input
                type="text"
                placeholder="Search users..."
                value={filters.user || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Risk Score
              </label>
              <div className="flex space-x-1">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="100"
                  value={filters.riskScoreMin || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, riskScoreMin: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="100"
                  value={filters.riskScoreMax || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, riskScoreMax: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value || undefined }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Clear all filters
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredEvents.length} of {events.length} events
            </div>
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Outcome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEvents.map((event) => (
                <tr 
                  key={event.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getEventIcon(event.eventType)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {event.action}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {event.eventType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900 dark:text-gray-100">{event.user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{event.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getOutcomeIcon(event.outcome)}
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getRiskScoreColor(event.riskScore)}`}>
                      {event.riskScore}/100
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatTimestamp(event.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {event.session.location || 'Unknown'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Event Details
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Event Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">ID:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedEvent.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Type:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedEvent.eventType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Action:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedEvent.action}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Resource:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedEvent.resource}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Timestamp:</span>
                        <span className="text-gray-900 dark:text-gray-100">{formatTimestamp(selectedEvent.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">User Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Name:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedEvent.user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Email:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedEvent.user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Role:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedEvent.user.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Session Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">IP Address:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedEvent.session.ipAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Location:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedEvent.session.location || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Device:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedEvent.session.device || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Risk Assessment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Risk Score:</span>
                        <span className={`font-medium ${getRiskScoreColor(selectedEvent.riskScore)}`}>
                          {selectedEvent.riskScore}/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Severity:</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(selectedEvent.severity)}`}>
                          {selectedEvent.severity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Outcome:</span>
                        <div className="flex items-center">
                          {getOutcomeIcon(selectedEvent.outcome)}
                          <span className="ml-1 text-gray-900 dark:text-gray-100">{selectedEvent.outcome}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Event Details</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(selectedEvent.details, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Compliance Flags */}
              {selectedEvent.complianceFlags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Compliance Flags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.complianceFlags.map((flag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 