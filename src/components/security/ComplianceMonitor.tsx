import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Eye, Download, Settings, Bell, TrendingUp } from 'lucide-react';
import { chainOfCustody } from '../../utils/chainOfCustody';
import { errorHandler } from '../../utils/errorHandler';

interface ComplianceRule {
  id: string;
  framework: 'FRE' | 'FRCP' | 'HIPAA' | 'SOX' | 'GDPR' | 'ISO27001';
  rule: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'integrity' | 'access' | 'retention' | 'documentation' | 'encryption' | 'audit';
  automated: boolean;
  checkInterval: number; // minutes
  lastChecked?: Date;
  status: 'compliant' | 'warning' | 'violation' | 'unknown';
  violations: ComplianceViolation[];
}

interface ComplianceViolation {
  id: string;
  ruleId: string;
  fileId: string;
  fileName: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  evidence: {
    eventId?: string;
    expectedValue: string;
    actualValue: string;
    context: Record<string, any>;
  };
}

interface ComplianceReport {
  id: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  frameworks: string[];
  overallScore: number; // 0-100
  totalFiles: number;
  compliantFiles: number;
  violations: ComplianceViolation[];
  recommendations: string[];
  trends: {
    complianceScore: number[];
    violationCounts: number[];
    dates: string[];
  };
}

interface ComplianceMonitorProps {
  fileId?: string;
  showAllFiles?: boolean;
  className?: string;
}

export const ComplianceMonitor: React.FC<ComplianceMonitorProps> = ({
  fileId,
  showAllFiles = false,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'violations' | 'reports'>('overview');
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [violations, setViolations] = useState<ComplianceViolation[]>([]);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoMonitoring, setAutoMonitoring] = useState(true);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['FRE', 'FRCP']);

  useEffect(() => {
    loadComplianceData();
    if (autoMonitoring) {
      const interval = setInterval(runComplianceCheck, 5 * 60 * 1000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [fileId, autoMonitoring]);

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      
      // Load compliance rules
      const rules: ComplianceRule[] = [
        {
          id: 'fre_901',
          framework: 'FRE',
          rule: 'FRE 901 - Authentication',
          description: 'Evidence must be authenticated to show it is what it purports to be',
          severity: 'critical',
          category: 'integrity',
          automated: true,
          checkInterval: 15,
          status: 'compliant',
          violations: []
        },
        {
          id: 'fre_902',
          framework: 'FRE',
          rule: 'FRE 902 - Self-Authentication',
          description: 'Digital records with proper certification are self-authenticating',
          severity: 'high',
          category: 'documentation',
          automated: true,
          checkInterval: 30,
          status: 'compliant',
          violations: []
        },
        {
          id: 'frcp_26',
          framework: 'FRCP',
          rule: 'FRCP 26(b)(2)(B) - ESI Accessibility',
          description: 'Electronically stored information must be reasonably accessible',
          severity: 'medium',
          category: 'access',
          automated: true,
          checkInterval: 60,
          status: 'compliant',
          violations: []
        },
        {
          id: 'frcp_37',
          framework: 'FRCP',
          rule: 'FRCP 37(e) - Spoliation',
          description: 'Failure to preserve ESI may result in sanctions',
          severity: 'critical',
          category: 'retention',
          automated: true,
          checkInterval: 30,
          status: 'warning',
          violations: []
        },
        {
          id: 'hipaa_164_312',
          framework: 'HIPAA',
          rule: 'HIPAA 164.312 - Technical Safeguards',
          description: 'Technical safeguards must protect electronic PHI',
          severity: 'critical',
          category: 'encryption',
          automated: true,
          checkInterval: 15,
          status: 'compliant',
          violations: []
        },
        {
          id: 'sox_404',
          framework: 'SOX',
          rule: 'SOX 404 - Internal Controls',
          description: 'Management must assess internal control effectiveness',
          severity: 'high',
          category: 'audit',
          automated: false,
          checkInterval: 1440, // Daily
          status: 'compliant',
          violations: []
        }
      ];

      // Generate mock violations
      const mockViolations: ComplianceViolation[] = [
        {
          id: 'viol_001',
          ruleId: 'frcp_37',
          fileId: 'file_001',
          fileName: 'evidence_photo_001.jpg',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          severity: 'medium',
          description: 'File accessed without proper custody documentation',
          recommendation: 'Ensure all file access events are properly logged with custody information',
          resolved: false,
          evidence: {
            eventId: 'event_123',
            expectedValue: 'custody_event_logged',
            actualValue: 'access_without_custody',
            context: {
              accessTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
              userId: 'user_001',
              ipAddress: '192.168.1.100'
            }
          }
        }
      ];

      // Generate compliance report
      const report: ComplianceReport = {
        id: 'report_001',
        generatedAt: new Date(),
        period: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          end: new Date()
        },
        frameworks: selectedFrameworks,
        overallScore: 87,
        totalFiles: 25,
        compliantFiles: 22,
        violations: mockViolations,
        recommendations: [
          'Implement automated custody logging for all file access events',
          'Enable real-time integrity verification for critical evidence files',
          'Set up automated retention policy enforcement',
          'Configure compliance alerts for high-severity violations'
        ],
        trends: {
          complianceScore: [82, 85, 83, 87, 89, 87, 87],
          violationCounts: [5, 3, 4, 2, 1, 2, 1],
          dates: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
        }
      };

      setComplianceRules(rules);
      setViolations(mockViolations);
      setComplianceReport(report);
    } catch (error) {
      await errorHandler.handleError('compliance_monitor_load', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const runComplianceCheck = async () => {
    try {
      // Get all custody logs
      const custodyLogs = chainOfCustody.getAllCustodyLogs();
      
      for (const log of custodyLogs) {
        // Check FRE 901 - Authentication
        if (!log.integrity.chainValid || !log.integrity.hashesValid) {
          await createViolation('fre_901', log.fileId, log.fileName, 
            'File integrity compromised - chain of custody broken',
            'Verify file integrity and restore from backup if necessary'
          );
        }

        // Check FRCP 37 - Spoliation
        const lastAccess = log.events[log.events.length - 1]?.timestamp;
        if (lastAccess && Date.now() - lastAccess.getTime() > 90 * 24 * 60 * 60 * 1000) { // 90 days
          await createViolation('frcp_37', log.fileId, log.fileName,
            'File not accessed for extended period - potential spoliation risk',
            'Review retention policy and ensure proper preservation'
          );
        }

        // Check access events have proper custody documentation
        const accessEvents = log.events.filter(e => e.eventType === 'access');
        for (const event of accessEvents) {
          if (!event.metadata.evidence?.caseNumber) {
            await createViolation('frcp_37', log.fileId, log.fileName,
              'File accessed without proper custody documentation',
              'Ensure all file access events include case number and custody information'
            );
          }
        }
      }

      // Update rule statuses
      setComplianceRules(prev => prev.map(rule => ({
        ...rule,
        lastChecked: new Date(),
        status: rule.violations.length === 0 ? 'compliant' : 
                rule.violations.some(v => v.severity === 'critical') ? 'violation' : 'warning'
      })));

    } catch (error) {
      await errorHandler.handleError('compliance_check', error as Error);
    }
  };

  const createViolation = async (ruleId: string, fileId: string, fileName: string, description: string, recommendation: string) => {
    const violation: ComplianceViolation = {
      id: `viol_${Date.now()}`,
      ruleId,
      fileId,
      fileName,
      timestamp: new Date(),
      severity: complianceRules.find(r => r.id === ruleId)?.severity || 'medium',
      description,
      recommendation,
      resolved: false,
      evidence: {
        expectedValue: 'compliant_state',
        actualValue: 'non_compliant_state',
        context: { automated: true }
      }
    };

    setViolations(prev => [...prev, violation]);
    
    // Update rule violations
    setComplianceRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, violations: [...rule.violations, violation] }
        : rule
    ));
  };

  const resolveViolation = async (violationId: string) => {
    setViolations(prev => prev.map(v => 
      v.id === violationId 
        ? { ...v, resolved: true, resolvedAt: new Date(), resolvedBy: 'current_user' }
        : v
    ));

    // Update rule violations
    setComplianceRules(prev => prev.map(rule => ({
      ...rule,
      violations: rule.violations.map(v => 
        v.id === violationId 
          ? { ...v, resolved: true, resolvedAt: new Date(), resolvedBy: 'current_user' }
          : v
      )
    })));
  };

  const exportComplianceReport = async (format: 'pdf' | 'json' | 'csv') => {
    try {
      if (!complianceReport) return;

      const reportData = {
        ...complianceReport,
        exportedAt: new Date(),
        format
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
        type: format === 'json' ? 'application/json' : 'text/plain' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance_report_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      await errorHandler.handleError('compliance_export', error as Error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'violation': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'violation': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading compliance data...</span>
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
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Compliance Monitor
            </h2>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
              {autoMonitoring ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoMonitoring(!autoMonitoring)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                autoMonitoring 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{autoMonitoring ? 'Auto-Monitor On' : 'Auto-Monitor Off'}</span>
            </button>
            <button
              onClick={runComplianceCheck}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Eye className="w-4 h-4" />
              <span>Run Check</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'rules', label: 'Rules', icon: FileText },
            { id: 'violations', label: 'Violations', icon: AlertTriangle },
            { id: 'reports', label: 'Reports', icon: Download }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {id === 'violations' && violations.filter(v => !v.resolved).length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {violations.filter(v => !v.resolved).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && complianceReport && (
          <div className="space-y-6">
            {/* Compliance Score */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Overall Score</p>
                    <p className="text-2xl font-bold">{complianceReport.overallScore}%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Files</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{complianceReport.totalFiles}</p>
                  </div>
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Compliant Files</p>
                    <p className="text-2xl font-bold text-green-600">{complianceReport.compliantFiles}</p>
                  </div>
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Active Violations</p>
                    <p className="text-2xl font-bold text-red-600">
                      {violations.filter(v => !v.resolved).length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </div>

            {/* Frameworks */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Active Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {complianceReport.frameworks.map(framework => (
                  <span
                    key={framework}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                  >
                    {framework}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Recommendations</h3>
              <div className="space-y-2">
                {complianceReport.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Compliance Rules</h3>
              <div className="flex items-center space-x-2">
                <select
                  multiple
                  value={selectedFrameworks}
                  onChange={(e) => setSelectedFrameworks(Array.from(e.target.selectedOptions, option => option.value))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="FRE">Federal Rules of Evidence</option>
                  <option value="FRCP">Federal Rules of Civil Procedure</option>
                  <option value="HIPAA">HIPAA</option>
                  <option value="SOX">Sarbanes-Oxley</option>
                  <option value="GDPR">GDPR</option>
                  <option value="ISO27001">ISO 27001</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {complianceRules
                .filter(rule => selectedFrameworks.includes(rule.framework))
                .map(rule => (
                <div key={rule.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(rule.status)}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{rule.rule}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{rule.framework}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(rule.severity)}`}>
                        {rule.severity}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rule.automated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.automated ? 'Automated' : 'Manual'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{rule.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Check interval: {rule.checkInterval} minutes</span>
                    {rule.lastChecked && (
                      <span>Last checked: {rule.lastChecked.toLocaleString()}</span>
                    )}
                  </div>
                  
                  {rule.violations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {rule.violations.filter(v => !v.resolved).length} active violations
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'violations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Compliance Violations</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {violations.filter(v => !v.resolved).length} active, {violations.filter(v => v.resolved).length} resolved
              </div>
            </div>

            {violations.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Violations Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  All files are compliant with selected frameworks
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {violations.map(violation => (
                  <div
                    key={violation.id}
                    className={`border rounded-lg p-4 ${
                      violation.resolved 
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                        : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(violation.severity)}`}>
                          {violation.severity}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {violation.fileName}
                        </span>
                        {violation.resolved && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      {!violation.resolved && (
                        <button
                          onClick={() => resolveViolation(violation.id)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                      {violation.description}
                    </p>
                    
                    <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">
                      <strong>Recommendation:</strong> {violation.recommendation}
                    </p>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <p>Rule: {complianceRules.find(r => r.id === violation.ruleId)?.rule}</p>
                      <p>Detected: {violation.timestamp.toLocaleString()}</p>
                      {violation.resolved && (
                        <p>Resolved: {violation.resolvedAt?.toLocaleString()} by {violation.resolvedBy}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && complianceReport && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Compliance Reports</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportComplianceReport('json')}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => exportComplianceReport('pdf')}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Report Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Report Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">Period:</span>
                  <p className="text-gray-900 dark:text-white">
                    {complianceReport.period.start.toLocaleDateString()} - {complianceReport.period.end.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">Generated:</span>
                  <p className="text-gray-900 dark:text-white">
                    {complianceReport.generatedAt.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">Frameworks:</span>
                  <p className="text-gray-900 dark:text-white">
                    {complianceReport.frameworks.join(', ')}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">Compliance Rate:</span>
                  <p className="text-gray-900 dark:text-white">
                    {Math.round((complianceReport.compliantFiles / complianceReport.totalFiles) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Trends Chart Placeholder */}
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Compliance Trends</h4>
              <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                  <p>Compliance trends chart would be displayed here</p>
                  <p className="text-sm">Current score: {complianceReport.overallScore}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 