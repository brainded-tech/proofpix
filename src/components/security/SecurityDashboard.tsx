/**
 * ProofPix Security Dashboard Component
 * Real-time security monitoring, threat detection, and compliance reporting
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  Download,
  Filter,
  RefreshCw,
  Bell,
  Settings,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
  Info,
  Zap,
  Target,
  Database,
  Server,
  Wifi,
  HardDrive
} from 'lucide-react';
import { ssoService } from '../../services/ssoService';
import { rbacService } from '../../services/rbacService';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'permission_denied' | 'suspicious_activity' | 'data_access' | 'configuration_change' | 'threat_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  timestamp: Date;
  metadata: Record<string, any>;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  resolvedEvents: number;
  activeThreats: number;
  successfulLogins: number;
  failedLogins: number;
  uniqueUsers: number;
  averageResponseTime: number;
  complianceScore: number;
  uptime: number;
}

interface ComplianceStatus {
  framework: string;
  score: number;
  status: 'compliant' | 'non_compliant' | 'partial';
  lastAudit: Date;
  nextAudit: Date;
  requirements: Array<{
    id: string;
    name: string;
    status: 'met' | 'not_met' | 'partial';
    description: string;
  }>;
}

interface ThreatIntelligence {
  id: string;
  type: 'malware' | 'phishing' | 'brute_force' | 'data_exfiltration' | 'insider_threat';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  indicators: string[];
  mitigations: string[];
  timestamp: Date;
}

const SecurityDashboard: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'compliance' | 'threats' | 'analytics'>('overview');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus[]>([]);
  const [threatIntelligence, setThreatIntelligence] = useState<ThreatIntelligence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [eventFilter, setEventFilter] = useState<{
    severity?: string;
    type?: string;
    status?: string;
  }>({});
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  // Load Security Data
  const loadSecurityData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '1h':
          startDate.setHours(startDate.getHours() - 1);
          break;
        case '24h':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
      }

      // Load security events
      const events = await ssoService.getSSOSecurityEvents({
        limit: 100,
      });

      // Load RBAC analytics for security metrics
      const rbacAnalytics = await rbacService.getRoleAnalytics({ start: startDate, end: endDate });

      // Mock security metrics (would come from backend)
      const metrics: SecurityMetrics = {
        totalEvents: events.length,
        criticalEvents: events.filter(e => e.severity === 'critical').length,
        resolvedEvents: Math.floor(events.length * 0.8),
        activeThreats: Math.floor(events.length * 0.1),
        successfulLogins: 1250,
        failedLogins: 45,
        uniqueUsers: 89,
        averageResponseTime: 1.2,
        complianceScore: 94,
        uptime: 99.9,
      };

      // Mock compliance status
      const compliance: ComplianceStatus[] = [
        {
          framework: 'SOC 2 Type II',
          score: 96,
          status: 'compliant',
          lastAudit: new Date('2024-01-15'),
          nextAudit: new Date('2024-07-15'),
          requirements: [
            { id: '1', name: 'Access Controls', status: 'met', description: 'User access controls implemented' },
            { id: '2', name: 'Data Encryption', status: 'met', description: 'Data encrypted at rest and in transit' },
            { id: '3', name: 'Audit Logging', status: 'met', description: 'Comprehensive audit logs maintained' },
            { id: '4', name: 'Incident Response', status: 'partial', description: 'Incident response plan needs update' },
          ],
        },
        {
          framework: 'GDPR',
          score: 92,
          status: 'compliant',
          lastAudit: new Date('2024-02-01'),
          nextAudit: new Date('2024-08-01'),
          requirements: [
            { id: '1', name: 'Data Protection', status: 'met', description: 'Personal data protection measures' },
            { id: '2', name: 'Consent Management', status: 'met', description: 'User consent properly managed' },
            { id: '3', name: 'Data Portability', status: 'met', description: 'Data export functionality available' },
            { id: '4', name: 'Right to Erasure', status: 'met', description: 'Data deletion capabilities implemented' },
          ],
        },
        {
          framework: 'HIPAA',
          score: 89,
          status: 'partial',
          lastAudit: new Date('2024-01-20'),
          nextAudit: new Date('2024-07-20'),
          requirements: [
            { id: '1', name: 'Administrative Safeguards', status: 'met', description: 'Admin controls in place' },
            { id: '2', name: 'Physical Safeguards', status: 'met', description: 'Physical security measures' },
            { id: '3', name: 'Technical Safeguards', status: 'partial', description: 'Some technical controls need enhancement' },
            { id: '4', name: 'Breach Notification', status: 'met', description: 'Breach notification procedures' },
          ],
        },
      ];

      // Mock threat intelligence
      const threats: ThreatIntelligence[] = [
        {
          id: '1',
          type: 'brute_force',
            severity: 'high',
          source: 'External IP Scanner',
          description: 'Multiple failed login attempts detected from suspicious IP ranges',
          indicators: ['192.168.1.100', '10.0.0.50'],
          mitigations: ['IP blocking', 'Rate limiting', 'MFA enforcement'],
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'phishing',
          severity: 'medium',
          source: 'Email Security Gateway',
          description: 'Phishing attempt targeting user credentials',
          indicators: ['suspicious-domain.com', 'fake-login-page.net'],
          mitigations: ['Email filtering', 'User training', 'Domain blocking'],
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ];

      setSecurityEvents(events.map(e => ({
        id: e.id,
        type: e.type as any,
        severity: e.severity as any,
        title: e.message,
        description: e.message,
        userId: e.userId,
        userEmail: e.metadata?.userEmail,
        ipAddress: e.metadata?.ipAddress || 'Unknown',
        userAgent: e.metadata?.userAgent || 'Unknown',
        location: e.metadata?.location,
        timestamp: e.timestamp,
        metadata: e.metadata,
        status: 'open',
      })));
      
      setSecurityMetrics(metrics);
      setComplianceStatus(compliance);
      setThreatIntelligence(threats);
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadSecurityData();
    
    // Set up real-time updates
    if (realTimeEnabled) {
      const interval = setInterval(loadSecurityData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [loadSecurityData, realTimeEnabled]);

  // Severity Colors
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  // Status Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'met':
      case 'resolved': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'non_compliant':
      case 'not_met':
      case 'open': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'partial':
      case 'investigating': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  // Render Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {securityMetrics?.totalEvents || 0}
              </p>
        </div>
            <Shield className="h-8 w-8 text-blue-600" />
      </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">12% decrease</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Threats</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {securityMetrics?.criticalEvents || 0}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-600 dark:text-red-400">3% increase</span>
                  </div>
                </div>
                
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {securityMetrics?.complianceScore || 0}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">2% improvement</span>
                  </div>
                </div>
                
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {securityMetrics?.uptime || 0}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">Excellent</span>
                    </div>
                  </div>
                </div>
                
      {/* Recent Security Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Security Events</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {securityEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                  <AlertTriangle className="h-4 w-4" />
                    </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>
                  <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {event.ipAddress}
                    </span>
                    {event.userEmail && (
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {event.userEmail}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(event.severity)}`}>
                  {event.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
              </div>
              
      {/* Compliance Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Compliance Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {complianceStatus.map((compliance) => (
              <div key={compliance.framework} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{compliance.framework}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(compliance.status)}`}>
                    {compliance.status}
                  </span>
                </div>
                      <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${compliance.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {compliance.score}%
                        </span>
                      </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Next audit: {compliance.nextAudit.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Security Events Tab
  const renderEvents = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>
          
          <select
            value={eventFilter.severity || ''}
            onChange={(e) => setEventFilter(prev => ({ ...prev, severity: e.target.value || undefined }))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={eventFilter.type || ''}
            onChange={(e) => setEventFilter(prev => ({ ...prev, type: e.target.value || undefined }))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="login_attempt">Login Attempts</option>
            <option value="permission_denied">Permission Denied</option>
            <option value="suspicious_activity">Suspicious Activity</option>
            <option value="data_access">Data Access</option>
            <option value="configuration_change">Config Changes</option>
            <option value="threat_detected">Threats</option>
          </select>

          <select
            value={eventFilter.status || ''}
            onChange={(e) => setEventFilter(prev => ({ ...prev, status: e.target.value || undefined }))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="false_positive">False Positive</option>
          </select>

          <button
            onClick={() => setEventFilter({})}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Events</h3>
                        <button
              onClick={loadSecurityData}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                        >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
                        </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {securityEvents
            .filter(event => {
              if (eventFilter.severity && event.severity !== eventFilter.severity) return false;
              if (eventFilter.type && event.type !== eventFilter.type) return false;
              if (eventFilter.status && event.status !== eventFilter.status) return false;
              return true;
            })
            .map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.timestamp.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          {event.ipAddress}
                        </span>
                        {event.userEmail && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.userEmail}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
          </div>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitor security events, threats, and compliance status
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              {/* Real-time Toggle */}
              <button
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                  realTimeEnabled
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <Activity className="h-4 w-4" />
                <span>Real-time</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: Shield },
              { id: 'events', name: 'Security Events', icon: AlertTriangle },
              { id: 'compliance', name: 'Compliance', icon: CheckCircle },
              { id: 'threats', name: 'Threat Intelligence', icon: Target },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
            </div>
            
        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading security data...</span>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'events' && renderEvents()}
            {/* Other tabs would be implemented similarly */}
          </>
        )}
      </div>
    </div>
  );
}; 

export default SecurityDashboard; 