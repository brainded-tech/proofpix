import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Key, 
  Eye, 
  Monitor,
  Globe,
  Clock,
  X
} from 'lucide-react';
import { securityHardening } from '../../utils/securityHardening';

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: 'authentication' | 'authorization' | 'data_protection' | 'monitoring' | 'compliance';
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  settings: Record<string, any>;
  lastModified: Date;
  modifiedBy: string;
}

interface SecurityThreshold {
  id: string;
  name: string;
  description: string;
  type: 'count' | 'percentage' | 'time' | 'size';
  value: number;
  unit: string;
  alertLevel: 'info' | 'warning' | 'critical';
  enabled: boolean;
}

interface SecurityConfigurationProps {
  onConfigurationChange?: (config: any) => void;
  readOnly?: boolean;
}

export const SecurityConfiguration: React.FC<SecurityConfigurationProps> = ({
  onConfigurationChange,
  readOnly = false
}) => {
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [thresholds, setThresholds] = useState<SecurityThreshold[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'policies' | 'thresholds' | 'notifications' | 'integrations'>('policies');
  const [selectedPolicy, setSelectedPolicy] = useState<SecurityPolicy | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Generate mock security policies
  const generateMockPolicies = useCallback((): SecurityPolicy[] => {
    return [
      {
        id: 'policy-001',
        name: 'Password Policy',
        description: 'Enforce strong password requirements for all user accounts',
        category: 'authentication',
        enabled: true,
        severity: 'high',
        settings: {
          minLength: 12,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          maxAge: 90,
          preventReuse: 5,
          lockoutThreshold: 5,
          lockoutDuration: 30
        },
        lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        modifiedBy: 'admin@company.com'
      },
      {
        id: 'policy-002',
        name: 'Multi-Factor Authentication',
        description: 'Require MFA for all administrative and privileged accounts',
        category: 'authentication',
        enabled: true,
        severity: 'critical',
        settings: {
          enforceForAdmins: true,
          enforceForUsers: false,
          allowedMethods: ['totp', 'sms', 'email'],
          gracePeriod: 7,
          bypassEmergency: false
        },
        lastModified: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        modifiedBy: 'security@company.com'
      },
      {
        id: 'policy-003',
        name: 'Data Encryption',
        description: 'Encrypt sensitive data at rest and in transit',
        category: 'data_protection',
        enabled: true,
        severity: 'critical',
        settings: {
          encryptionAtRest: true,
          encryptionInTransit: true,
          keyRotationInterval: 90,
          algorithm: 'AES-256',
          tlsVersion: '1.3'
        },
        lastModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        modifiedBy: 'admin@company.com'
      },
      {
        id: 'policy-004',
        name: 'Access Control',
        description: 'Implement role-based access control and principle of least privilege',
        category: 'authorization',
        enabled: true,
        severity: 'high',
        settings: {
          rbacEnabled: true,
          defaultRole: 'user',
          sessionTimeout: 480,
          concurrentSessions: 3,
          ipWhitelisting: false,
          geoBlocking: true
        },
        lastModified: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        modifiedBy: 'admin@company.com'
      },
      {
        id: 'policy-005',
        name: 'Audit Logging',
        description: 'Comprehensive logging of security events and user activities',
        category: 'monitoring',
        enabled: true,
        severity: 'medium',
        settings: {
          logLevel: 'info',
          retentionPeriod: 365,
          realTimeAlerts: true,
          logEncryption: true,
          tamperProtection: true,
          exportFormat: 'json'
        },
        lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        modifiedBy: 'security@company.com'
      },
      {
        id: 'policy-006',
        name: 'Compliance Monitoring',
        description: 'Automated compliance checking for SOC 2, HIPAA, and GDPR',
        category: 'compliance',
        enabled: true,
        severity: 'high',
        settings: {
          frameworks: ['soc2', 'hipaa', 'gdpr', 'iso27001'],
          scanFrequency: 'daily',
          autoRemediation: false,
          reportGeneration: true,
          alertThreshold: 'medium'
        },
        lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        modifiedBy: 'compliance@company.com'
      }
    ];
  }, []);

  // Generate mock security thresholds
  const generateMockThresholds = useCallback((): SecurityThreshold[] => {
    return [
      {
        id: 'threshold-001',
        name: 'Failed Login Attempts',
        description: 'Alert when failed login attempts exceed threshold',
        type: 'count',
        value: 5,
        unit: 'attempts',
        alertLevel: 'warning',
        enabled: true
      },
      {
        id: 'threshold-002',
        name: 'Data Export Volume',
        description: 'Alert when data export volume exceeds threshold',
        type: 'size',
        value: 1,
        unit: 'GB',
        alertLevel: 'critical',
        enabled: true
      },
      {
        id: 'threshold-003',
        name: 'Session Duration',
        description: 'Alert when user sessions exceed maximum duration',
        type: 'time',
        value: 8,
        unit: 'hours',
        alertLevel: 'info',
        enabled: true
      },
      {
        id: 'threshold-004',
        name: 'Vulnerability Score',
        description: 'Alert when vulnerability score exceeds threshold',
        type: 'percentage',
        value: 80,
        unit: '%',
        alertLevel: 'critical',
        enabled: true
      },
      {
        id: 'threshold-005',
        name: 'Concurrent Sessions',
        description: 'Alert when concurrent sessions exceed threshold',
        type: 'count',
        value: 10,
        unit: 'sessions',
        alertLevel: 'warning',
        enabled: true
      }
    ];
  }, []);

  // Load configuration data
  const loadConfiguration = useCallback(async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from an API
      const mockPolicies = generateMockPolicies();
      const mockThresholds = generateMockThresholds();
      
      setPolicies(mockPolicies);
      setThresholds(mockThresholds);
    } catch (error) {
      console.error('Failed to load security configuration:', error);
    } finally {
      setLoading(false);
    }
  }, [generateMockPolicies, generateMockThresholds]);

  // Handle policy toggle
  const handlePolicyToggle = useCallback((policyId: string) => {
    if (readOnly) return;
    
    setPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { ...policy, enabled: !policy.enabled, lastModified: new Date() }
        : policy
    ));
    setUnsavedChanges(true);
  }, [readOnly]);

  // Handle threshold update
  const handleThresholdUpdate = useCallback((thresholdId: string, updates: Partial<SecurityThreshold>) => {
    if (readOnly) return;
    
    setThresholds(prev => prev.map(threshold => 
      threshold.id === thresholdId 
        ? { ...threshold, ...updates }
        : threshold
    ));
    setUnsavedChanges(true);
  }, [readOnly]);

  // Save configuration
  const saveConfiguration = useCallback(async () => {
    try {
      // In a real implementation, this would save to an API
      const config = { policies, thresholds };
      
      if (onConfigurationChange) {
        onConfigurationChange(config);
      }
      
      setUnsavedChanges(false);
      console.log('Configuration saved successfully');
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  }, [policies, thresholds, onConfigurationChange]);

  // Get category icon
  const getCategoryIcon = (category: SecurityPolicy['category']) => {
    switch (category) {
      case 'authentication':
        return <Key className="h-5 w-5" />;
      case 'authorization':
        return <Globe className="h-5 w-5" />;
      case 'data_protection':
        return <Lock className="h-5 w-5" />;
      case 'monitoring':
        return <Eye className="h-5 w-5" />;
      case 'compliance':
        return <Monitor className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
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

  // Get alert level color
  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
      case 'warning':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300';
      case 'info':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  // Initialize component
  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Security Configuration
            </h2>
            {unsavedChanges && (
              <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs font-medium px-2 py-1 rounded-full">
                Unsaved Changes
              </span>
            )}
          </div>
          {!readOnly && (
            <div className="flex items-center space-x-2">
              <button
                onClick={loadConfiguration}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Reset
              </button>
              <button
                onClick={saveConfiguration}
                disabled={!unsavedChanges}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Section Navigation */}
        <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('policies')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'policies'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Shield className="h-4 w-4 mr-2 inline" />
              Security Policies
            </button>
            <button
              onClick={() => setActiveSection('thresholds')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'thresholds'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <AlertTriangle className="h-4 w-4 mr-2 inline" />
              Alert Thresholds
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'notifications'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Monitor className="h-4 w-4 mr-2 inline" />
              Notifications
            </button>
            <button
              onClick={() => setActiveSection('integrations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'integrations'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Globe className="h-4 w-4 mr-2 inline" />
              Integrations
            </button>
          </nav>
        </div>
      </div>

      {/* Security Policies Section */}
      {activeSection === 'policies' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Security Policies
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configure and manage security policies for your organization
            </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {policies.map((policy) => (
              <div key={policy.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getCategoryIcon(policy.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {policy.name}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(policy.severity)}`}>
                          {policy.severity.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 font-medium capitalize">
                          {policy.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {policy.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Modified {new Date(policy.lastModified).toLocaleDateString()}</span>
                        </div>
                        <span>by {policy.modifiedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedPolicy(policy);
                        setShowPolicyModal(true);
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-900/50"
                    >
                      Configure
                    </button>
                    {!readOnly && (
                      <button
                        onClick={() => handlePolicyToggle(policy.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          policy.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            policy.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Thresholds Section */}
      {activeSection === 'thresholds' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Alert Thresholds
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configure thresholds for security alerts and notifications
            </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {thresholds.map((threshold) => (
              <div key={threshold.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {threshold.name}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getAlertLevelColor(threshold.alertLevel)}`}>
                        {threshold.alertLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {threshold.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-xs text-gray-500 dark:text-gray-400">Threshold:</label>
                        {!readOnly ? (
                          <input
                            type="number"
                            value={threshold.value}
                            onChange={(e) => handleThresholdUpdate(threshold.id, { value: Number(e.target.value) })}
                            className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {threshold.value}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">{threshold.unit}</span>
                      </div>
                      {!readOnly && (
                        <select
                          value={threshold.alertLevel}
                          onChange={(e) => handleThresholdUpdate(threshold.id, { alertLevel: e.target.value as any })}
                          className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="info">Info</option>
                          <option value="warning">Warning</option>
                          <option value="critical">Critical</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {!readOnly && (
                    <button
                      onClick={() => handleThresholdUpdate(threshold.id, { enabled: !threshold.enabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        threshold.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          threshold.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Notification Settings
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Notification configuration will be available in a future update.
            </p>
          </div>
        </div>
      )}

      {/* Integrations Section */}
      {activeSection === 'integrations' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center py-12">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Security Integrations
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Integration with external security tools will be available in a future update.
            </p>
          </div>
        </div>
      )}

      {/* Policy Configuration Modal */}
      {showPolicyModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Configure {selectedPolicy.name}
                </h3>
                <button
                  onClick={() => setShowPolicyModal(false)}
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
                    Policy Settings
                  </label>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto">
                    {JSON.stringify(selectedPolicy.settings, null, 2)}
                  </pre>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Category:</strong> {selectedPolicy.category.replace('_', ' ')}</p>
                  <p><strong>Severity:</strong> {selectedPolicy.severity}</p>
                  <p><strong>Last Modified:</strong> {selectedPolicy.lastModified.toLocaleString()}</p>
                  <p><strong>Modified By:</strong> {selectedPolicy.modifiedBy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityConfiguration; 