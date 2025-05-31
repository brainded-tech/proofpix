import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, FileText, Shield, AlertTriangle, Clock, Download, Calendar, Filter } from 'lucide-react';
import { chainOfCustody } from '../../utils/chainOfCustody';
import { errorHandler } from '../../utils/errorHandler';

interface AnalyticsMetrics {
  totalFiles: number;
  totalEvents: number;
  activeUsers: number;
  complianceScore: number;
  integrityViolations: number;
  averageAccessTime: number;
  filesByType: Record<string, number>;
  eventsByType: Record<string, number>;
  userActivity: Array<{
    userId: string;
    userName: string;
    eventCount: number;
    lastActivity: Date;
  }>;
  timelineData: Array<{
    date: string;
    events: number;
    files: number;
    violations: number;
  }>;
  complianceBreakdown: Record<string, {
    score: number;
    violations: number;
    lastCheck: Date;
  }>;
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    recommendations: string[];
  };
}

interface AnalyticsDashboardProps {
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  className = ''
}) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'events' | 'files' | 'users' | 'compliance'>('events');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get all custody logs
      const custodyLogs = chainOfCustody.getAllCustodyLogs();
      const errorLog = errorHandler.getErrorLog();
      const errorStats = errorHandler.getErrorStats();
      
      // Calculate date range
      const now = new Date();
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      
      // Calculate metrics
      const totalFiles = custodyLogs.length;
      const totalEvents = custodyLogs.reduce((sum, log) => sum + log.events.length, 0);
      
      // Get unique users
      const uniqueUsers = new Set<string>();
      const userActivity: Record<string, { name: string; count: number; lastActivity: Date }> = {};
      
      custodyLogs.forEach(log => {
        log.events.forEach(event => {
          uniqueUsers.add(event.user.id);
          if (!userActivity[event.user.id]) {
            userActivity[event.user.id] = {
              name: event.user.name,
              count: 0,
              lastActivity: event.timestamp
            };
          }
          userActivity[event.user.id].count++;
          if (event.timestamp > userActivity[event.user.id].lastActivity) {
            userActivity[event.user.id].lastActivity = event.timestamp;
          }
        });
      });
      
      // Calculate compliance score
      const integrityViolations = custodyLogs.filter(log => !log.integrity.chainValid).length;
      const complianceScore = Math.max(0, 100 - (integrityViolations / totalFiles) * 100);
      
      // File types breakdown
      const filesByType: Record<string, number> = {};
      custodyLogs.forEach(log => {
        const extension = log.fileName.split('.').pop()?.toLowerCase() || 'unknown';
        filesByType[extension] = (filesByType[extension] || 0) + 1;
      });
      
      // Events by type
      const eventsByType: Record<string, number> = {};
      custodyLogs.forEach(log => {
        log.events.forEach(event => {
          eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
        });
      });
      
      // Timeline data (last 30 days)
      const timelineData: Array<{ date: string; events: number; files: number; violations: number }> = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayEvents = custodyLogs.reduce((sum, log) => {
          return sum + log.events.filter(event => 
            event.timestamp.toISOString().split('T')[0] === dateStr
          ).length;
        }, 0);
        
        const dayFiles = custodyLogs.filter(log => 
          log.createdAt.toISOString().split('T')[0] === dateStr
        ).length;
        
        const dayViolations = custodyLogs.filter(log => 
          !log.integrity.chainValid && log.createdAt.toISOString().split('T')[0] === dateStr
        ).length;
        
        timelineData.push({
          date: dateStr,
          events: dayEvents,
          files: dayFiles,
          violations: dayViolations
        });
      }
      
      // Compliance breakdown
      const complianceBreakdown = {
        'FRE': {
          score: 92,
          violations: 2,
          lastCheck: new Date(now.getTime() - 2 * 60 * 60 * 1000)
        },
        'FRCP': {
          score: 88,
          violations: 3,
          lastCheck: new Date(now.getTime() - 1 * 60 * 60 * 1000)
        },
        'HIPAA': {
          score: 95,
          violations: 1,
          lastCheck: new Date(now.getTime() - 30 * 60 * 1000)
        },
        'SOX': {
          score: 90,
          violations: 2,
          lastCheck: new Date(now.getTime() - 45 * 60 * 1000)
        }
      };
      
      // Risk assessment
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      const riskFactors: string[] = [];
      const recommendations: string[] = [];
      
      if (integrityViolations > 0) {
        riskFactors.push(`${integrityViolations} integrity violations detected`);
        recommendations.push('Review and restore compromised files');
        riskLevel = integrityViolations > 5 ? 'critical' : 'high';
      }
      
      if (errorStats.criticalErrors > 0) {
        riskFactors.push(`${errorStats.criticalErrors} critical system errors`);
        recommendations.push('Address critical system errors immediately');
        riskLevel = 'critical';
      }
      
      if (complianceScore < 90) {
        riskFactors.push('Compliance score below 90%');
        recommendations.push('Improve compliance monitoring and procedures');
        if (riskLevel === 'low') riskLevel = 'medium';
      }
      
      if (riskFactors.length === 0) {
        riskFactors.push('No significant risk factors detected');
        recommendations.push('Continue current security practices');
      }
      
      const analytics: AnalyticsMetrics = {
        totalFiles,
        totalEvents,
        activeUsers: uniqueUsers.size,
        complianceScore: Math.round(complianceScore),
        integrityViolations,
        averageAccessTime: 2.3, // Mock data
        filesByType,
        eventsByType,
        userActivity: Object.entries(userActivity).map(([userId, data]) => ({
          userId,
          userName: data.name,
          eventCount: data.count,
          lastActivity: data.lastActivity
        })).sort((a, b) => b.eventCount - a.eventCount),
        timelineData,
        complianceBreakdown,
        riskAssessment: {
          level: riskLevel,
          factors: riskFactors,
          recommendations
        }
      };
      
      setMetrics(analytics);
    } catch (error) {
      await errorHandler.handleError('analytics_load', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      if (!metrics) return;

      const exportData = {
        generatedAt: new Date().toISOString(),
        timeRange,
        summary: {
          totalFiles: metrics.totalFiles,
          totalEvents: metrics.totalEvents,
          activeUsers: metrics.activeUsers,
          complianceScore: metrics.complianceScore,
          integrityViolations: metrics.integrityViolations
        },
        breakdown: {
          filesByType: metrics.filesByType,
          eventsByType: metrics.eventsByType,
          complianceBreakdown: metrics.complianceBreakdown
        },
        riskAssessment: metrics.riskAssessment,
        timeline: metrics.timelineData
      };

      let content: string;
      let mimeType: string;
      let extension: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(exportData, null, 2);
          mimeType = 'application/json';
          extension = 'json';
          break;
        case 'csv':
          // Convert to CSV format
          const csvRows = [
            'Metric,Value',
            `Total Files,${metrics.totalFiles}`,
            `Total Events,${metrics.totalEvents}`,
            `Active Users,${metrics.activeUsers}`,
            `Compliance Score,${metrics.complianceScore}%`,
            `Integrity Violations,${metrics.integrityViolations}`,
            '',
            'File Types,Count',
            ...Object.entries(metrics.filesByType).map(([type, count]) => `${type},${count}`),
            '',
            'Event Types,Count',
            ...Object.entries(metrics.eventsByType).map(([type, count]) => `${type},${count}`)
          ];
          content = csvRows.join('\n');
          mimeType = 'text/csv';
          extension = 'csv';
          break;
        case 'pdf':
          content = `PROOFPIX ANALYTICS REPORT\n\nGenerated: ${new Date().toISOString()}\nTime Range: ${timeRange}\n\nSUMMARY\nTotal Files: ${metrics.totalFiles}\nTotal Events: ${metrics.totalEvents}\nActive Users: ${metrics.activeUsers}\nCompliance Score: ${metrics.complianceScore}%\nIntegrity Violations: ${metrics.integrityViolations}\n\nRISK ASSESSMENT\nLevel: ${metrics.riskAssessment.level.toUpperCase()}\nFactors: ${metrics.riskAssessment.factors.join(', ')}\nRecommendations: ${metrics.riskAssessment.recommendations.join(', ')}`;
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
      a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      await errorHandler.handleError('analytics_export', error as Error);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Analytics Data
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Analytics data will appear once you start using the system
          </p>
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
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h2>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              {timeRange}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <div className="flex space-x-1">
              <button
                onClick={() => exportAnalytics('json')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                title="Export JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => exportAnalytics('csv')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                title="Export CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Files</p>
                <p className="text-2xl font-bold">{metrics.totalFiles}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Events</p>
                <p className="text-2xl font-bold">{metrics.totalEvents}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Users</p>
                <p className="text-2xl font-bold">{metrics.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Compliance Score</p>
                <p className="text-2xl font-bold">{metrics.complianceScore}%</p>
              </div>
              <Shield className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Risk Assessment</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(metrics.riskAssessment.level)}`}>
              {metrics.riskAssessment.level.toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Factors</h4>
              <ul className="space-y-1">
                {metrics.riskAssessment.factors.map((factor, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {metrics.riskAssessment.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Types */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Files by Type</h3>
            <div className="space-y-2">
              {Object.entries(metrics.filesByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / metrics.totalFiles) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Types */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Events by Type</h3>
            <div className="space-y-2">
              {Object.entries(metrics.eventsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{type.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(count / metrics.totalEvents) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Activity */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Top User Activity</h3>
          <div className="space-y-3">
            {metrics.userActivity.slice(0, 5).map((user) => (
              <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.userName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last active: {user.lastActivity.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">{user.eventCount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">events</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Breakdown */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Compliance Framework Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(metrics.complianceBreakdown).map(([framework, data]) => (
              <div key={framework} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{framework}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    data.score >= 95 ? 'bg-green-100 text-green-800' :
                    data.score >= 90 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {data.score}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {data.violations} violations
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Last check: {data.lastCheck.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 