import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Activity,
  Target,
  Zap,
  Monitor,
  Globe,
  Lock,
  Search,
  Filter
} from 'lucide-react';
import { securityHardening } from '../../utils/securityHardening';

interface ThreatEvent {
  id: string;
  type: 'malware' | 'phishing' | 'ddos' | 'intrusion' | 'data_exfiltration' | 'brute_force' | 'anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: number;
  source: string;
  targetAsset: string;
  attackVector: string;
  ipAddress?: string;
  userAgent?: string;
  geolocation?: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
  indicators: string[];
  mitigationStatus: 'detected' | 'analyzing' | 'mitigating' | 'blocked' | 'resolved';
  confidence: number; // 0-100
  riskScore: number; // 0-100
  metadata?: Record<string, any>;
}

interface ThreatStatistics {
  totalThreats: number;
  activeThreats: number;
  blockedThreats: number;
  criticalThreats: number;
  averageResponseTime: number;
  threatsByType: Record<string, number>;
  threatsByHour: Array<{ hour: number; count: number }>;
  topSourceCountries: Array<{ country: string; count: number }>;
  riskTrend: 'increasing' | 'decreasing' | 'stable';
}

interface ThreatDetectionProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  showRealTimeMonitoring?: boolean;
  maxEvents?: number;
}

export const ThreatDetection: React.FC<ThreatDetectionProps> = ({
  autoRefresh = true,
  refreshInterval = 10000,
  showRealTimeMonitoring = true,
  maxEvents = 100
}) => {
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [statistics, setStatistics] = useState<ThreatStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [monitoring, setMonitoring] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null);
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | ThreatEvent['type'],
    severity: 'all' as 'all' | ThreatEvent['severity'],
    status: 'all' as 'all' | ThreatEvent['mitigationStatus'],
    timeRange: '24h' as '1h' | '24h' | '7d' | '30d'
  });

  // Generate mock threat events
  const generateMockThreats = useCallback((): ThreatEvent[] => {
    const threatTypes: Array<ThreatEvent['type']> = ['malware', 'phishing', 'ddos', 'intrusion', 'data_exfiltration', 'brute_force', 'anomaly'];
    const severities: Array<ThreatEvent['severity']> = ['critical', 'high', 'medium', 'low'];
    const statuses: Array<ThreatEvent['mitigationStatus']> = ['detected', 'analyzing', 'mitigating', 'blocked', 'resolved'];
    
    const countries = ['United States', 'China', 'Russia', 'Germany', 'United Kingdom', 'France', 'Brazil', 'India'];
    const cities = ['New York', 'Beijing', 'Moscow', 'Berlin', 'London', 'Paris', 'São Paulo', 'Mumbai'];

    const mockThreats: ThreatEvent[] = [
      {
        id: 'threat-001',
        type: 'malware',
        severity: 'critical',
        title: 'Advanced Persistent Threat Detected',
        description: 'Sophisticated malware with command and control capabilities detected on endpoint',
        timestamp: Date.now() - 300000,
        source: 'Endpoint Detection',
        targetAsset: 'DESKTOP-001',
        attackVector: 'Email Attachment',
        ipAddress: '203.0.113.42',
        geolocation: { country: 'Russia', city: 'Moscow', coordinates: [55.7558, 37.6176] },
        indicators: ['Suspicious process execution', 'Network communication to C&C server', 'Registry modifications'],
        mitigationStatus: 'mitigating',
        confidence: 95,
        riskScore: 90,
        metadata: { 
          malwareFamily: 'APT29',
          affectedFiles: 15,
          networkConnections: 3
        }
      },
      {
        id: 'threat-002',
        type: 'ddos',
        severity: 'high',
        title: 'Distributed Denial of Service Attack',
        description: 'Large-scale DDoS attack targeting web infrastructure',
        timestamp: Date.now() - 600000,
        source: 'Network Monitor',
        targetAsset: 'WEB-SERVER-01',
        attackVector: 'UDP Flood',
        ipAddress: '198.51.100.0/24',
        geolocation: { country: 'China', city: 'Beijing', coordinates: [39.9042, 116.4074] },
        indicators: ['Abnormal traffic volume', 'Multiple source IPs', 'Service degradation'],
        mitigationStatus: 'blocked',
        confidence: 88,
        riskScore: 75,
        metadata: {
          peakTraffic: '2.5 Gbps',
          sourceIPs: 1250,
          duration: '45 minutes'
        }
      },
      {
        id: 'threat-003',
        type: 'brute_force',
        severity: 'medium',
        title: 'SSH Brute Force Attack',
        description: 'Multiple failed SSH login attempts from external IP',
        timestamp: Date.now() - 900000,
        source: 'SSH Monitor',
        targetAsset: 'SERVER-03',
        attackVector: 'SSH Protocol',
        ipAddress: '192.0.2.100',
        geolocation: { country: 'United States', city: 'New York', coordinates: [40.7128, -74.0060] },
        indicators: ['Repeated login failures', 'Dictionary attack patterns', 'Multiple usernames tested'],
        mitigationStatus: 'blocked',
        confidence: 92,
        riskScore: 60,
        metadata: {
          attemptCount: 1500,
          targetUsers: ['root', 'admin', 'user'],
          duration: '2 hours'
        }
      },
      {
        id: 'threat-004',
        type: 'phishing',
        severity: 'high',
        title: 'Credential Harvesting Campaign',
        description: 'Phishing emails targeting employee credentials detected',
        timestamp: Date.now() - 1800000,
        source: 'Email Security',
        targetAsset: 'EMAIL-SYSTEM',
        attackVector: 'Spear Phishing',
        indicators: ['Suspicious sender domain', 'Credential harvesting form', 'Social engineering tactics'],
        mitigationStatus: 'resolved',
        confidence: 85,
        riskScore: 70,
        metadata: {
          emailCount: 25,
          targetedUsers: 12,
          blockedEmails: 23
        }
      },
      {
        id: 'threat-005',
        type: 'data_exfiltration',
        severity: 'critical',
        title: 'Unauthorized Data Transfer',
        description: 'Large volume of sensitive data being transferred to external location',
        timestamp: Date.now() - 2700000,
        source: 'Data Loss Prevention',
        targetAsset: 'DATABASE-01',
        attackVector: 'Insider Threat',
        indicators: ['Unusual data access patterns', 'Large file transfers', 'Off-hours activity'],
        mitigationStatus: 'analyzing',
        confidence: 78,
        riskScore: 85,
        metadata: {
          dataVolume: '500 GB',
          fileTypes: ['PDF', 'DOCX', 'XLSX'],
          transferDestination: 'External Cloud Storage'
        }
      },
      {
        id: 'threat-006',
        type: 'anomaly',
        severity: 'medium',
        title: 'Behavioral Anomaly Detected',
        description: 'User behavior deviating significantly from established baseline',
        timestamp: Date.now() - 3600000,
        source: 'User Behavior Analytics',
        targetAsset: 'USER-ACCOUNT-456',
        attackVector: 'Account Compromise',
        indicators: ['Unusual login times', 'Geographic anomaly', 'Access pattern changes'],
        mitigationStatus: 'detected',
        confidence: 65,
        riskScore: 45,
        metadata: {
          baselineDeviation: '85%',
          riskFactors: ['Time', 'Location', 'Access Pattern'],
          userRiskScore: 72
        }
      }
    ];

    return mockThreats;
  }, []);

  // Generate mock statistics
  const generateMockStatistics = useCallback((threats: ThreatEvent[]): ThreatStatistics => {
    const now = new Date();
    const last24Hours = threats.filter(t => Date.now() - t.timestamp < 24 * 60 * 60 * 1000);
    
    const threatsByType = threats.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const threatsByHour = Array.from({ length: 24 }, (_, i) => {
      const hour = (now.getHours() - i + 24) % 24;
      const hourStart = new Date(now);
      hourStart.setHours(hour, 0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hour + 1);
      
      const count = threats.filter(t => {
        const threatTime = new Date(t.timestamp);
        return threatTime >= hourStart && threatTime < hourEnd;
      }).length;
      
      return { hour, count };
    }).reverse();

    const topSourceCountries = Object.entries(
      threats
        .filter(t => t.geolocation)
        .reduce((acc, threat) => {
          const country = threat.geolocation!.country;
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    return {
      totalThreats: threats.length,
      activeThreats: threats.filter(t => !['blocked', 'resolved'].includes(t.mitigationStatus)).length,
      blockedThreats: threats.filter(t => t.mitigationStatus === 'blocked').length,
      criticalThreats: threats.filter(t => t.severity === 'critical').length,
      averageResponseTime: 12.5, // minutes
      threatsByType,
      threatsByHour,
      topSourceCountries,
      riskTrend: 'stable'
    };
  }, []);

  // Load threat data
  const loadThreats = useCallback(async () => {
    setLoading(true);
    try {
      const mockThreats = generateMockThreats();
      const mockStats = generateMockStatistics(mockThreats);
      
      setThreats(mockThreats);
      setStatistics(mockStats);
    } catch (error) {
      console.error('Failed to load threat data:', error);
    } finally {
      setLoading(false);
    }
  }, [generateMockThreats, generateMockStatistics]);

  // Filter threats
  const filteredThreats = threats.filter(threat => {
    if (filters.type !== 'all' && threat.type !== filters.type) return false;
    if (filters.severity !== 'all' && threat.severity !== filters.severity) return false;
    if (filters.status !== 'all' && threat.mitigationStatus !== filters.status) return false;
    
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const cutoff = Date.now() - timeRanges[filters.timeRange];
    if (threat.timestamp < cutoff) return false;
    
    return true;
  }).slice(0, maxEvents);

  // Get threat icon
  const getThreatIcon = (type: ThreatEvent['type']) => {
    switch (type) {
      case 'malware':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'phishing':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'ddos':
        return <Zap className="h-5 w-5 text-purple-500" />;
      case 'intrusion':
        return <Eye className="h-5 w-5 text-red-600" />;
      case 'data_exfiltration':
        return <Target className="h-5 w-5 text-pink-500" />;
      case 'brute_force':
        return <Lock className="h-5 w-5 text-yellow-500" />;
      case 'anomaly':
        return <Activity className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity: ThreatEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Get status color
  const getStatusColor = (status: ThreatEvent['mitigationStatus']) => {
    switch (status) {
      case 'detected':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'analyzing':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
      case 'mitigating':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300';
      case 'blocked':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
      case 'resolved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300';
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
    loadThreats();
  }, [loadThreats]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !monitoring) return;

    const interval = setInterval(() => {
      loadThreats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, monitoring, refreshInterval, loadThreats]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Threats</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistics.totalThreats}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Threats</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistics.activeThreats}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Blocked</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistics.blockedThreats}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistics.averageResponseTime}m</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Threat Detection Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Threat Detection
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                monitoring ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {monitoring ? 'MONITORING' : 'PAUSED'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMonitoring(!monitoring)}
                className={`p-2 rounded-md ${
                  monitoring ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' :
                  'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                {monitoring ? <CheckCircle className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
              </button>
              <button
                onClick={loadThreats}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Types</option>
              <option value="malware">Malware</option>
              <option value="phishing">Phishing</option>
              <option value="ddos">DDoS</option>
              <option value="intrusion">Intrusion</option>
              <option value="data_exfiltration">Data Exfiltration</option>
              <option value="brute_force">Brute Force</option>
              <option value="anomaly">Anomaly</option>
            </select>

            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value as any }))}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Status</option>
              <option value="detected">Detected</option>
              <option value="analyzing">Analyzing</option>
              <option value="mitigating">Mitigating</option>
              <option value="blocked">Blocked</option>
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
        </div>

        {/* Threats List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
          {filteredThreats.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No threats detected for the selected filters.</p>
            </div>
          ) : (
            filteredThreats.map((threat) => (
              <div key={threat.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getThreatIcon(threat.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {threat.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(threat.severity)}`}>
                          {threat.severity.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(threat.mitigationStatus)}`}>
                          {threat.mitigationStatus.toUpperCase().replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {threat.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimestamp(threat.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Lock className="h-3 w-3" />
                          <span>{threat.targetAsset}</span>
                        </div>
                        {threat.ipAddress && (
                          <div className="flex items-center space-x-1">
                            <Globe className="h-3 w-3" />
                            <span>{threat.ipAddress}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <span>Confidence: {threat.confidence}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Risk: {threat.riskScore}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedThreat(threat)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-900/50"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Threat Detail Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Threat Details
                </h3>
                <button
                  onClick={() => setSelectedThreat(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Threat ID
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                      {selectedThreat.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {selectedThreat.title}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {selectedThreat.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                        {selectedThreat.type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Severity
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                        {selectedThreat.severity}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Attack Vector
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {selectedThreat.attackVector}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Target Asset
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {selectedThreat.targetAsset}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confidence
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedThreat.confidence}%
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Risk Score
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedThreat.riskScore}/100
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Indicators
                    </label>
                    <ul className="text-sm text-gray-900 dark:text-gray-100 list-disc list-inside">
                      {selectedThreat.indicators.map((indicator, index) => (
                        <li key={index}>{indicator}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedThreat.geolocation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Geolocation
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedThreat.geolocation.city}, {selectedThreat.geolocation.country}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedThreat.metadata && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Information
                  </label>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                    {JSON.stringify(selectedThreat.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatDetection; 