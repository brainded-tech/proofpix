import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Lock,
  Eye,
  FileText,
  Users,
  Globe,
  Clock,
  TrendingUp,
  Download,
  RefreshCw,
  Settings,
  ArrowLeft,
  Zap,
  Database,
  Server,
  Key,
  UserCheck,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { errorHandler } from '../utils/errorHandler';
import { ComplianceMonitor } from '../components/security/ComplianceMonitor';
import { AuditLogger } from '../components/security/AuditLogger';
import { SecurityAlerts } from '../components/security/SecurityAlerts';
import { ThreatDetection } from '../components/security/ThreatDetection';
import { SecurityConfiguration } from '../components/security/SecurityConfiguration';
import { EnterpriseBadge } from '../components/ui/EnterpriseComponents';

interface SecurityMetrics {
  overallScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeThreats: number;
  blockedAttempts: number;
  lastScan: Date;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

interface ComplianceStatus {
  soc2: { status: 'compliant' | 'partial' | 'non-compliant'; score: number; lastAudit: Date };
  hipaa: { status: 'compliant' | 'partial' | 'non-compliant'; score: number; lastAudit: Date };
  gdpr: { status: 'compliant' | 'partial' | 'non-compliant'; score: number; lastAudit: Date };
  iso27001: { status: 'compliant' | 'partial' | 'non-compliant'; score: number; lastAudit: Date };
}

interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  riskScore: number;
  details: Record<string, any>;
}

interface SecurityAlert {
  id: string;
  type: 'authentication' | 'access' | 'data' | 'system' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved';
  affectedUsers?: number;
  recommendedActions: string[];
}

interface SecurityDashboardState {
  metrics: SecurityMetrics | null;
  compliance: ComplianceStatus | null;
  auditEvents: AuditEvent[];
  alerts: SecurityAlert[];
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  timeRange: '24h' | '7d' | '30d';
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  subtitle,
  trend,
  severity 
}) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
    }
  };

  return (
    <div className={`rounded-lg p-6 border shadow-sm ${getSeverityColor(severity)}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${color}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {change >= 0 ? '↗️' : '↘️'} {Math.abs(change)}%
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">vs last period</span>
        </div>
      )}
    </div>
  );
};

export const SecurityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<SecurityDashboardState>({
    metrics: null,
    compliance: null,
    auditEvents: [],
    alerts: [],
    isLoading: true,
    error: null,
    lastRefresh: null,
    timeRange: '24h'
  });

  // Add tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'compliance' | 'audit' | 'alerts' | 'threats' | 'configuration'>('overview');

  // Check for Pro tier access - Security Dashboard is Pro+ only
  const userTier = localStorage.getItem('proofpix_user_tier') || 'free';
  const hasProAccess = userTier === 'pro' || userTier === 'enterprise';

  const updateState = useCallback((updates: Partial<SecurityDashboardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadSecurityData = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });

      // Simulate loading security data (replace with actual API calls)
      const [metricsData, complianceData, auditData, alertsData] = await Promise.allSettled([
        loadSecurityMetrics(state.timeRange),
        loadComplianceStatus(),
        loadAuditEvents(state.timeRange),
        loadSecurityAlerts()
      ]);

      updateState({
        metrics: metricsData.status === 'fulfilled' ? metricsData.value : null,
        compliance: complianceData.status === 'fulfilled' ? complianceData.value : null,
        auditEvents: auditData.status === 'fulfilled' ? auditData.value : [],
        alerts: alertsData.status === 'fulfilled' ? alertsData.value : [],
        isLoading: false,
        lastRefresh: new Date()
      });

    } catch (error) {
      console.error('Security data loading error:', error);
      await errorHandler.handleError('security_dashboard_load', error as Error);
      updateState({ 
        error: 'Failed to load security data', 
        isLoading: false 
      });
    }
  }, [state.timeRange, updateState]);

  useEffect(() => {
    if (hasProAccess) {
      loadSecurityData();
      
      // Auto-refresh every 5 minutes
      const interval = setInterval(loadSecurityData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [hasProAccess, loadSecurityData]);

  // Mock data loading functions (replace with actual API calls)
  const loadSecurityMetrics = async (timeRange: string): Promise<SecurityMetrics> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      overallScore: 94,
      threatLevel: 'low',
      activeThreats: 0,
      blockedAttempts: 23,
      lastScan: new Date(),
      vulnerabilities: {
        critical: 0,
        high: 1,
        medium: 3,
        low: 7
      }
    };
  };

  const loadComplianceStatus = async (): Promise<ComplianceStatus> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      soc2: { status: 'partial', score: 85, lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      hipaa: { status: 'compliant', score: 95, lastAudit: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      gdpr: { status: 'compliant', score: 98, lastAudit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      iso27001: { status: 'partial', score: 78, lastAudit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) }
    };
  };

  const loadAuditEvents = async (timeRange: string): Promise<AuditEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        id: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        eventType: 'authentication',
        severity: 'medium',
        user: 'john.doe@company.com',
        action: 'Failed login attempt',
        resource: '/auth/login',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        riskScore: 65,
        details: { attempts: 3, location: 'New York, US' }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        eventType: 'data_access',
        severity: 'low',
        user: 'admin@company.com',
        action: 'Exported user data',
        resource: '/api/users/export',
        ipAddress: '10.0.0.1',
        userAgent: 'Mozilla/5.0...',
        riskScore: 25,
        details: { recordCount: 150, format: 'CSV' }
      }
    ];
  };

  const loadSecurityAlerts = async (): Promise<SecurityAlert[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        id: '1',
        type: 'authentication',
        severity: 'medium',
        title: 'Multiple Failed Login Attempts',
        description: 'Detected 5 failed login attempts from IP 203.0.113.1 in the last hour',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'active',
        affectedUsers: 1,
        recommendedActions: [
          'Monitor IP address for continued suspicious activity',
          'Consider implementing IP-based rate limiting',
          'Notify affected user of potential security threat'
        ]
      },
      {
        id: '2',
        type: 'compliance',
        severity: 'low',
        title: 'SOC 2 Control Gap Identified',
        description: 'Access review procedures need to be updated to meet SOC 2 requirements',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'investigating',
        recommendedActions: [
          'Update access review procedures documentation',
          'Schedule quarterly access reviews',
          'Implement automated access review reminders'
        ]
      }
    ];
  };

  const exportSecurityReport = useCallback(async () => {
    try {
      // Generate comprehensive security report
      const reportData = {
        generatedAt: new Date(),
        timeRange: state.timeRange,
        metrics: state.metrics,
        compliance: state.compliance,
        auditEvents: state.auditEvents,
        alerts: state.alerts
      };

      // Create and download report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `security-report-${state.timeRange}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export error:', error);
      await errorHandler.handleError('security_report_export', error instanceof Error ? error : new Error(String(error)));
    }
  }, [state]);

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'partial': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'non-compliant': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!hasProAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Security Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Advanced security monitoring and compliance features are available with Pro and Enterprise plans.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/pricing')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="block mx-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Security Dashboard
              </h1>
              {state.lastRefresh && (
                <span className="ml-4 text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {state.lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* Time Range Filter */}
              <select
                value={state.timeRange}
                onChange={(e) => updateState({ timeRange: e.target.value as '24h' | '7d' | '30d' })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
              
              <button
                onClick={exportSecurityReport}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2 inline" />
                Export Report
              </button>
              
              <button
                onClick={loadSecurityData}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                title="Refresh security data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Activity className="h-4 w-4 mr-2 inline" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'compliance'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 mr-2 inline" />
              Compliance
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'audit'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Eye className="h-4 w-4 mr-2 inline" />
              Audit Log
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <AlertTriangle className="h-4 w-4 mr-2 inline" />
              Alerts
              {state.alerts.length > 0 && (
                <span className="ml-1 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {state.alerts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('threats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'threats'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Shield className="h-4 w-4 mr-2 inline" />
              Threat Detection
            </button>
            <button
              onClick={() => setActiveTab('configuration')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'configuration'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Settings className="h-4 w-4 mr-2 inline" />
              Configuration
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {state.error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-red-600 dark:text-red-400">{state.error}</p>
              <button
                onClick={loadSecurityData}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Security Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Security Score"
                value={`${state.metrics?.overallScore || 0}%`}
                icon={Shield}
                color="text-blue-600 dark:text-blue-400"
                subtitle="Overall security posture"
                severity={state.metrics?.overallScore && state.metrics.overallScore >= 90 ? 'low' : 'medium'}
              />
              
              <MetricCard
                title="Active Threats"
                value={state.metrics?.activeThreats || 0}
                icon={AlertTriangle}
                color="text-red-600 dark:text-red-400"
                subtitle="Requiring immediate attention"
                severity={state.metrics?.activeThreats && state.metrics.activeThreats > 0 ? 'high' : 'low'}
              />
              
              <MetricCard
                title="Blocked Attempts"
                value={state.metrics?.blockedAttempts || 0}
                icon={Lock}
                color="text-green-600 dark:text-green-400"
                subtitle={`In the last ${state.timeRange}`}
              />
              
              <MetricCard
                title="Vulnerabilities"
                value={state.metrics ? Object.values(state.metrics.vulnerabilities).reduce((a, b) => a + b, 0) : 0}
                icon={Eye}
                color="text-yellow-600 dark:text-yellow-400"
                subtitle={`${state.metrics?.vulnerabilities.critical || 0} critical`}
                severity={state.metrics?.vulnerabilities.critical && state.metrics.vulnerabilities.critical > 0 ? 'critical' : 'low'}
              />
            </div>

            {/* Quick Compliance Status */}
            {state.compliance && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Compliance Status Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(state.compliance).map(([framework, status]) => (
                    <div key={framework} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 uppercase">
                          {framework}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getComplianceStatusColor(status.status)}`}>
                          {status.status}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {status.score}%
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last audit: {formatTimeAgo(status.lastAudit)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vulnerability Summary */}
            {state.metrics?.vulnerabilities && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Vulnerability Summary
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(state.metrics.vulnerabilities).map(([severity, count]) => (
                    <div key={severity} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
                      <div className={`text-2xl font-bold mb-1 ${
                        severity === 'critical' ? 'text-red-600' :
                        severity === 'high' ? 'text-orange-600' :
                        severity === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {count}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {severity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compliance' && (
          <ComplianceMonitor />
        )}

        {activeTab === 'audit' && (
          <AuditLogger />
        )}

        {activeTab === 'alerts' && (
          <SecurityAlerts 
            maxAlerts={50}
            autoRefresh={true}
            refreshInterval={30000}
            showFilters={true}
            onAlertAction={(alertId, action) => {
              console.log(`Alert ${alertId} action: ${action}`);
              // Handle alert actions here
            }}
          />
        )}

        {activeTab === 'threats' && (
          <ThreatDetection 
            autoRefresh={true}
            refreshInterval={10000}
            showRealTimeMonitoring={true}
            maxEvents={100}
          />
        )}

        {activeTab === 'configuration' && (
          <SecurityConfiguration />
        )}
      </div>
    </div>
  );
}; 