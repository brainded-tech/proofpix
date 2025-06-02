import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Key, 
  Users, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Lock,
  Unlock,
  Globe,
  Building,
  Smartphone,
  Mail,
  QrCode
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oauth' | 'oidc' | 'ldap';
  status: 'active' | 'inactive' | 'testing';
  domain: string;
  configuration: {
    entityId?: string;
    ssoUrl?: string;
    certificateFingerprint?: string;
    clientId?: string;
    clientSecret?: string;
    authUrl?: string;
    tokenUrl?: string;
    userInfoUrl?: string;
    scopes?: string[];
    ldapUrl?: string;
    baseDn?: string;
    bindDn?: string;
    bindPassword?: string;
  };
  userMapping: {
    email: string;
    firstName: string;
    lastName: string;
    groups?: string;
    department?: string;
  };
  createdAt: string;
  lastUsed?: string;
  userCount: number;
}

interface MFAMethod {
  id: string;
  type: 'totp' | 'sms' | 'email' | 'hardware_key' | 'backup_codes';
  name: string;
  isEnabled: boolean;
  isRequired: boolean;
  configuration: any;
  userCount: number;
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  rules: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireLowercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSymbols: boolean;
    passwordExpiryDays: number;
    sessionTimeoutMinutes: number;
    maxFailedAttempts: number;
    lockoutDurationMinutes: number;
    requireMFA: boolean;
    allowedIpRanges?: string[];
    allowedCountries?: string[];
    blockTorNodes: boolean;
    requireDeviceRegistration: boolean;
  };
  appliedTo: string[];
  createdAt: string;
  updatedAt: string;
}

export const EnterpriseSSO: React.FC = () => {
  const [ssoProviders, setSsoProviders] = useState<SSOProvider[]>([]);
  const [mfaMethods, setMfaMethods] = useState<MFAMethod[]>([]);
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([]);
  const [activeTab, setActiveTab] = useState<'sso' | 'mfa' | 'policies' | 'audit'>('sso');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SSOProvider | null>(null);

  // Fetch authentication data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      const mockSSOProviders: SSOProvider[] = [
        {
          id: 'sso-001',
          name: 'Corporate Active Directory',
          type: 'saml',
          status: 'active',
          domain: 'company.com',
          configuration: {
            entityId: 'https://company.com/saml',
            ssoUrl: 'https://adfs.company.com/adfs/ls/',
            certificateFingerprint: 'AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD'
          },
          userMapping: {
            email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
            firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
            lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
            groups: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/groups'
          },
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          lastUsed: new Date(Date.now() - 3600000).toISOString(),
          userCount: 247
        },
        {
          id: 'sso-002',
          name: 'Google Workspace',
          type: 'oauth',
          status: 'active',
          domain: 'company.com',
          configuration: {
            clientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
            clientSecret: 'GOOGLE_CLIENT_SECRET_HERE',
            authUrl: 'https://accounts.google.com/o/oauth2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
            scopes: ['openid', 'email', 'profile']
          },
          userMapping: {
            email: 'email',
            firstName: 'given_name',
            lastName: 'family_name'
          },
          createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
          lastUsed: new Date(Date.now() - 7200000).toISOString(),
          userCount: 89
        }
      ];

      const mockMFAMethods: MFAMethod[] = [
        {
          id: 'mfa-001',
          type: 'totp',
          name: 'Authenticator App (TOTP)',
          isEnabled: true,
          isRequired: true,
          configuration: {
            issuer: 'ProofPix Enterprise',
            algorithm: 'SHA1',
            digits: 6,
            period: 30
          },
          userCount: 156
        },
        {
          id: 'mfa-002',
          type: 'sms',
          name: 'SMS Verification',
          isEnabled: true,
          isRequired: false,
          configuration: {
            provider: 'twilio',
            messageTemplate: 'Your ProofPix verification code is: {code}'
          },
          userCount: 89
        },
        {
          id: 'mfa-003',
          type: 'hardware_key',
          name: 'Hardware Security Keys',
          isEnabled: true,
          isRequired: false,
          configuration: {
            allowedKeys: ['yubikey', 'solokey'],
            requireUserPresence: true,
            requireUserVerification: false
          },
          userCount: 23
        }
      ];

      const mockSecurityPolicies: SecurityPolicy[] = [
        {
          id: 'policy-001',
          name: 'Enterprise Security Policy',
          description: 'Standard security policy for all enterprise users',
          rules: {
            passwordMinLength: 12,
            passwordRequireUppercase: true,
            passwordRequireLowercase: true,
            passwordRequireNumbers: true,
            passwordRequireSymbols: true,
            passwordExpiryDays: 90,
            sessionTimeoutMinutes: 480,
            maxFailedAttempts: 5,
            lockoutDurationMinutes: 30,
            requireMFA: true,
            allowedIpRanges: ['192.168.1.0/24', '10.0.0.0/8'],
            blockTorNodes: true,
            requireDeviceRegistration: true
          },
          appliedTo: ['enterprise_users', 'admin_users'],
          createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
        }
      ];

      setSsoProviders(mockSSOProviders);
      setMfaMethods(mockMFAMethods);
      setSecurityPolicies(mockSecurityPolicies);
      
      analytics.trackFeatureUsage('Enterprise SSO', 'Dashboard Viewed');
    } catch (error) {
      console.error('Failed to fetch authentication data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusColor = (status: SSOProvider['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: SSOProvider['type']) => {
    switch (type) {
      case 'saml':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'oauth':
        return <Key className="h-4 w-4 text-green-500" />;
      case 'oidc':
        return <Globe className="h-4 w-4 text-purple-500" />;
      case 'ldap':
        return <Building className="h-4 w-4 text-orange-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMFAIcon = (type: MFAMethod['type']) => {
    switch (type) {
      case 'totp':
        return <QrCode className="h-4 w-4 text-blue-500" />;
      case 'sms':
        return <Smartphone className="h-4 w-4 text-green-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-purple-500" />;
      case 'hardware_key':
        return <Key className="h-4 w-4 text-orange-500" />;
      case 'backup_codes':
        return <Lock className="h-4 w-4 text-gray-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading authentication settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enterprise Authentication</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage SSO, MFA, and security policies</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Provider</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">SSO Providers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{ssoProviders.length}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {ssoProviders.filter(p => p.status === 'active').length} active
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">MFA Methods</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mfaMethods.length}</p>
            </div>
            <Key className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {mfaMethods.filter(m => m.isEnabled).length} enabled
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">SSO Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {ssoProviders.reduce((sum, p) => sum + p.userCount, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enterprise accounts
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Security Policies</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{securityPolicies.length}</p>
            </div>
            <Settings className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Active policies
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('sso')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sso'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Shield className="h-4 w-4 mr-2 inline" />
            SSO Providers ({ssoProviders.length})
          </button>
          <button
            onClick={() => setActiveTab('mfa')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mfa'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Key className="h-4 w-4 mr-2 inline" />
            Multi-Factor Auth ({mfaMethods.length})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'policies'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Settings className="h-4 w-4 mr-2 inline" />
            Security Policies ({securityPolicies.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audit'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Eye className="h-4 w-4 mr-2 inline" />
            Audit Logs
          </button>
        </nav>
      </div>

      {/* SSO Providers Tab */}
      {activeTab === 'sso' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ssoProviders.map((provider) => (
            <div key={provider.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(provider.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {provider.domain} • {provider.type.toUpperCase()}
                    </p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(provider.status)}`}>
                      {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedProvider(provider)}
                    className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                    title="Edit Provider"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                    title="Delete Provider"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Provider Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{provider.userCount}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Last Used</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {provider.lastUsed ? new Date(provider.lastUsed).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>

              {/* Configuration Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Configuration</h4>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  {provider.type === 'saml' && (
                    <>
                      <div>Entity ID: {provider.configuration.entityId}</div>
                      <div>SSO URL: {provider.configuration.ssoUrl}</div>
                    </>
                  )}
                  {provider.type === 'oauth' && (
                    <>
                      <div>Client ID: {provider.configuration.clientId?.slice(0, 20)}...</div>
                      <div>Scopes: {provider.configuration.scopes?.join(', ')}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                  Test Connection
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 dark:hover:text-gray-400">
                  Download Metadata
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MFA Methods Tab */}
      {activeTab === 'mfa' && (
        <div className="space-y-6">
          {mfaMethods.map((method) => (
            <div key={method.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getMFAIcon(method.type)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {method.userCount} users enrolled
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Enabled</span>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        method.isEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          method.isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Required</span>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        method.isRequired ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          method.isRequired ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Method Configuration */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {method.type === 'totp' && (
                    <>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Issuer:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{method.configuration.issuer}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Algorithm:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{method.configuration.algorithm}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Digits:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{method.configuration.digits}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Period:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{method.configuration.period}s</span>
                      </div>
                    </>
                  )}
                  {method.type === 'sms' && (
                    <>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Provider:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{method.configuration.provider}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-600 dark:text-gray-400">Template:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{method.configuration.messageTemplate}</span>
                      </div>
                    </>
                  )}
                  {method.type === 'hardware_key' && (
                    <>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Allowed Keys:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{method.configuration.allowedKeys.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">User Presence:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {method.configuration.requireUserPresence ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                  Configure Method
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 dark:hover:text-gray-400">
                  View Usage Stats
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Policies Tab */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          {securityPolicies.map((policy) => (
            <div key={policy.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {policy.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {policy.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Applied to {policy.appliedTo.length} groups</span>
                    <span>Updated {new Date(policy.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Policy Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Password Policy</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Min Length:</span>
                      <span className="text-gray-900 dark:text-white">{policy.rules.passwordMinLength}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Expiry:</span>
                      <span className="text-gray-900 dark:text-white">{policy.rules.passwordExpiryDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Complexity:</span>
                      <span className="text-gray-900 dark:text-white">
                        {[
                          policy.rules.passwordRequireUppercase && 'A-Z',
                          policy.rules.passwordRequireLowercase && 'a-z',
                          policy.rules.passwordRequireNumbers && '0-9',
                          policy.rules.passwordRequireSymbols && '!@#'
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Session Policy</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Timeout:</span>
                      <span className="text-gray-900 dark:text-white">{policy.rules.sessionTimeoutMinutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Max Attempts:</span>
                      <span className="text-gray-900 dark:text-white">{policy.rules.maxFailedAttempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Lockout:</span>
                      <span className="text-gray-900 dark:text-white">{policy.rules.lockoutDurationMinutes} min</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Security Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">MFA Required:</span>
                      <span className="text-gray-900 dark:text-white">
                        {policy.rules.requireMFA ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Block Tor:</span>
                      <span className="text-gray-900 dark:text-white">
                        {policy.rules.blockTorNodes ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Device Registration:</span>
                      <span className="text-gray-900 dark:text-white">
                        {policy.rules.requireDeviceRegistration ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* IP Restrictions */}
              {policy.rules.allowedIpRanges && policy.rules.allowedIpRanges.length > 0 && (
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">IP Restrictions</h4>
                  <div className="text-sm text-blue-800 dark:text-blue-400">
                    Allowed ranges: {policy.rules.allowedIpRanges.join(', ')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Audit Logs
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comprehensive logging of all authentication events, SSO logins, and security policy changes.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              View Audit Logs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 