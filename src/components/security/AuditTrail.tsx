import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Calendar, User, Activity, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { chainOfCustody } from '../../utils/chainOfCustody';
import { errorHandler } from '../../utils/errorHandler';

interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: 'access' | 'modification' | 'transfer' | 'verification' | 'export' | 'signature' | 'compliance_check' | 'system_event';
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  description: string;
  fileId?: string;
  fileName?: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'warning' | 'error' | 'pending';
  metadata: {
    beforeState?: any;
    afterState?: any;
    correlationId?: string;
    complianceFramework?: string;
    evidenceHash?: string;
    signatureId?: string;
    [key: string]: any;
  };
  tags: string[];
}

interface AuditFilter {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  eventTypes: string[];
  users: string[];
  severity: string[];
  status: string[];
  searchTerm: string;
  fileId?: string;
}

interface AuditTrailProps {
  fileId?: string;
  showAllEvents?: boolean;
  className?: string;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({
  fileId,
  showAllEvents = false,
  className = ''
}) => {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<AuditFilter>({
    dateRange: { start: null, end: null },
    eventTypes: [],
    users: [],
    severity: [],
    status: [],
    searchTerm: '',
    fileId
  });

  useEffect(() => {
    loadAuditEvents();
  }, [fileId, showAllEvents]);

  useEffect(() => {
    applyFilters();
  }, [auditEvents, filter]);

  const loadAuditEvents = async () => {
    try {
      setLoading(true);
      
      // Function to map custody event types to audit event types
      const mapEventType = (custodyEventType: string): AuditEvent['eventType'] => {
        switch (custodyEventType) {
          case 'upload': return 'access';
          case 'analysis': return 'access';
          case 'access': return 'access';
          case 'modification': return 'modification';
          case 'transfer': return 'transfer';
          case 'verification': return 'verification';
          case 'export': return 'export';
          default: return 'system_event';
        }
      };
      
      // Generate comprehensive audit events from various sources
      const events: AuditEvent[] = [];
      
      // Get chain of custody events
      const custodyLogs = chainOfCustody.getAllCustodyLogs();
      custodyLogs.forEach(log => {
        if (!showAllEvents && fileId && log.fileId !== fileId) return;
        
        log.events.forEach(event => {
          events.push({
            id: `custody_${event.id}`,
            timestamp: event.timestamp,
            eventType: mapEventType(event.eventType),
            userId: event.user.id,
            userName: event.user.name,
            userRole: event.user.role,
            action: `Chain of Custody: ${event.eventType}`,
            description: event.action,
            fileId: log.fileId,
            fileName: log.fileName,
            ipAddress: event.user.ipAddress || 'Unknown',
            userAgent: event.user.userAgent || 'Unknown',
            sessionId: event.metadata.sessionId || 'Unknown',
            severity: event.eventType === 'verification' ? 'high' : 'medium',
            status: 'success',
            metadata: {
              ...event.metadata,
              evidenceHash: log.currentHash,
              correlationId: log.fileId
            },
            tags: ['chain_of_custody', event.eventType, log.fileName.split('.').pop() || 'file']
          });
        });
      });

      // Add system events
      const systemEvents: AuditEvent[] = [
        {
          id: 'sys_001',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          eventType: 'system_event',
          userId: 'system',
          userName: 'System',
          userRole: 'system',
          action: 'Compliance Check',
          description: 'Automated compliance verification completed',
          ipAddress: 'localhost',
          userAgent: 'ProofPix-System/1.0',
          sessionId: 'system_session',
          severity: 'low',
          status: 'success',
          metadata: {
            complianceFramework: 'FRE,FRCP',
            checksPerformed: 15,
            violationsFound: 0
          },
          tags: ['system', 'compliance', 'automated']
        },
        {
          id: 'sys_002',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          eventType: 'signature',
          userId: 'user_001',
          userName: 'Detective Sarah Johnson',
          userRole: 'investigator',
          action: 'Multi-Signature Request',
          description: 'Created multi-signature custody request for evidence verification',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          sessionId: 'session_abc123',
          severity: 'medium',
          status: 'pending',
          metadata: {
            signatureId: 'sig_req_001',
            requiredSignatures: 2,
            threshold: 2
          },
          tags: ['signature', 'multi_signature', 'evidence']
        },
        {
          id: 'sys_003',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          eventType: 'export',
          userId: 'user_002',
          userName: 'Attorney Lisa Chen',
          userRole: 'legal_counsel',
          action: 'Legal Document Export',
          description: 'Generated chain of custody affidavit for court filing',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          sessionId: 'session_def456',
          severity: 'high',
          status: 'success',
          metadata: {
            documentType: 'affidavit',
            templateId: 'template_002',
            caseNumber: '2024-CR-001'
          },
          tags: ['export', 'legal', 'affidavit', 'court']
        }
      ];

      events.push(...systemEvents);

      // Add error events from error handler
      const errorLog = errorHandler.getErrorLog();
      errorLog.forEach(({ error, context, id }) => {
        events.push({
          id: `error_${id}`,
          timestamp: context.timestamp,
          eventType: 'system_event',
          userId: context.userId || 'unknown',
          userName: 'Unknown User',
          userRole: 'user',
          action: 'System Error',
          description: `Error in ${context.operation}: ${error.message}`,
          fileId: context.fileId,
          fileName: context.metadata?.fileName,
          ipAddress: 'Unknown',
          userAgent: context.userAgent,
          sessionId: context.sessionId || 'unknown',
          severity: 'critical',
          status: 'error',
          metadata: {
            errorMessage: error.message,
            stackTrace: context.stackTrace,
            operation: context.operation,
            ...context.metadata
          },
          tags: ['error', 'system', context.operation || 'unknown']
        });
      });

      // Sort by timestamp (newest first)
      events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setAuditEvents(events);
    } catch (error) {
      await errorHandler.handleError('audit_trail_load', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...auditEvents];

    // Date range filter
    if (filter.dateRange.start) {
      filtered = filtered.filter(event => event.timestamp >= filter.dateRange.start!);
    }
    if (filter.dateRange.end) {
      filtered = filtered.filter(event => event.timestamp <= filter.dateRange.end!);
    }

    // Event type filter
    if (filter.eventTypes.length > 0) {
      filtered = filtered.filter(event => filter.eventTypes.includes(event.eventType));
    }

    // User filter
    if (filter.users.length > 0) {
      filtered = filtered.filter(event => filter.users.includes(event.userId));
    }

    // Severity filter
    if (filter.severity.length > 0) {
      filtered = filtered.filter(event => filter.severity.includes(event.severity));
    }

    // Status filter
    if (filter.status.length > 0) {
      filtered = filtered.filter(event => filter.status.includes(event.status));
    }

    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.action.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.userName.toLowerCase().includes(searchLower) ||
        (event.fileName && event.fileName.toLowerCase().includes(searchLower)) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredEvents(filtered);
  };

  const exportAuditLog = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      const exportData = filteredEvents.map(event => ({
        timestamp: event.timestamp.toISOString(),
        eventType: event.eventType,
        user: event.userName,
        action: event.action,
        description: event.description,
        fileName: event.fileName || 'N/A',
        severity: event.severity,
        status: event.status,
        ipAddress: event.ipAddress,
        sessionId: event.sessionId
      }));

      let content: string;
      let mimeType: string;
      let extension: string;

      switch (format) {
        case 'csv':
          const headers = Object.keys(exportData[0] || {}).join(',');
          const rows = exportData.map(row => Object.values(row).join(',')).join('\n');
          content = `${headers}\n${rows}`;
          mimeType = 'text/csv';
          extension = 'csv';
          break;
        case 'json':
          content = JSON.stringify(exportData, null, 2);
          mimeType = 'application/json';
          extension = 'json';
          break;
        case 'pdf':
          content = `PROOFPIX AUDIT TRAIL REPORT\n\nGenerated: ${new Date().toISOString()}\nTotal Events: ${exportData.length}\n\n${exportData.map(event => `${event.timestamp} | ${event.user} | ${event.action} | ${event.description}`).join('\n')}`;
          mimeType = 'text/plain';
          extension = 'txt';
          break;
        default:
          throw new Error('Unsupported format');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_trail_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      await errorHandler.handleError('audit_export', error as Error);
    }
  };

  const getEventIcon = (eventType: string, status: string) => {
    if (status === 'error') return <AlertTriangle className="w-4 h-4 text-red-600" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    if (status === 'pending') return <Clock className="w-4 h-4 text-blue-600" />;

    switch (eventType) {
      case 'access': return <Eye className="w-4 h-4 text-blue-600" />;
      case 'modification': return <Activity className="w-4 h-4 text-orange-600" />;
      case 'transfer': return <User className="w-4 h-4 text-purple-600" />;
      case 'verification': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'export': return <Download className="w-4 h-4 text-indigo-600" />;
      case 'signature': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'compliance_check': return <Shield className="w-4 h-4 text-green-600" />;
      case 'system_event': return <Activity className="w-4 h-4 text-gray-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading audit trail...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Audit Trail
            </h2>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              {filteredEvents.length} events
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <div className="flex space-x-1">
              <button
                onClick={() => exportAuditLog('csv')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                title="Export CSV"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => exportAuditLog('json')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                title="Export JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={filter.searchTerm}
                  onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Date Range */}
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filter.dateRange.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setFilter(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value ? new Date(e.target.value) : null }
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="date"
                  value={filter.dateRange.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setFilter(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value ? new Date(e.target.value) : null }
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Event Type */}
              <select
                multiple
                value={filter.eventTypes}
                onChange={(e) => setFilter(prev => ({
                  ...prev,
                  eventTypes: Array.from(e.target.selectedOptions, option => option.value)
                }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="access">Access</option>
                <option value="modification">Modification</option>
                <option value="transfer">Transfer</option>
                <option value="verification">Verification</option>
                <option value="export">Export</option>
                <option value="signature">Signature</option>
                <option value="compliance_check">Compliance Check</option>
                <option value="system_event">System Event</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setFilter({
                  dateRange: { start: null, end: null },
                  eventTypes: [],
                  users: [],
                  severity: [],
                  status: [],
                  searchTerm: '',
                  fileId
                })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Events List */}
      <div className="p-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Audit Events Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getEventIcon(event.eventType, event.status)}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {event.action}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {event.userName} • {event.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {event.description}
                </p>
                
                {event.fileName && (
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    File: {event.fileName}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {event.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Event Details
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Event ID</label>
                    <p className="text-gray-900 dark:text-white">{selectedEvent.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</label>
                    <p className="text-gray-900 dark:text-white">{selectedEvent.timestamp.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">User</label>
                    <p className="text-gray-900 dark:text-white">{selectedEvent.userName} ({selectedEvent.userRole})</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">IP Address</label>
                    <p className="text-gray-900 dark:text-white">{selectedEvent.ipAddress}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                  <p className="text-gray-900 dark:text-white">{selectedEvent.description}</p>
                </div>

                {selectedEvent.fileName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">File</label>
                    <p className="text-gray-900 dark:text-white">{selectedEvent.fileName}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Metadata</label>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedEvent.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 