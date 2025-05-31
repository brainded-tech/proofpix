/**
 * ProofPix Enterprise Authentication Component
 * Comprehensive SSO integration with role-based access control
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Building, 
  Key, 
  Users, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  Settings,
  Eye,
  EyeOff,
  Fingerprint,
  Smartphone,
  Globe,
  ArrowRight,
  RefreshCw,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { ssoService, SSOProvider, SSOConfiguration, SSOAuthResult } from '../../services/ssoService';
import { rbacService, Role, Permission } from '../../services/rbacService';

interface EnterpriseAuthProps {
  onAuthSuccess: (result: SSOAuthResult) => void;
  onAuthError: (error: string) => void;
  organizationId?: string;
  redirectUrl?: string;
  showRoleInfo?: boolean;
}

interface AuthMethod {
  id: string;
  name: string;
  provider: SSOProvider;
  icon: React.ReactNode;
  description: string;
  isEnabled: boolean;
  isDefault: boolean;
  config: SSOConfiguration;
}

interface MFAChallenge {
  type: 'totp' | 'sms' | 'email' | 'biometric';
  challenge: string;
  expiresAt: Date;
}

const EnterpriseAuth: React.FC<EnterpriseAuthProps> = ({
  onAuthSuccess,
  onAuthError,
  organizationId,
  redirectUrl,
  showRoleInfo = true,
}) => {
  // State Management
  const [authMethods, setAuthMethods] = useState<AuthMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<AuthMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState<MFAChallenge | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [authStep, setAuthStep] = useState<'method' | 'credentials' | 'mfa' | 'role_selection'>('method');
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  // Provider Icons
  const getProviderIcon = (provider: SSOProvider): React.ReactNode => {
    const iconProps = { size: 20, className: "text-blue-600" };
    
    switch (provider) {
      case 'saml':
        return <Shield {...iconProps} />;
      case 'ldap':
        return <Building {...iconProps} />;
      case 'azure-ad':
        return <Globe {...iconProps} className="text-blue-500" />;
      case 'google-workspace':
        return <Globe {...iconProps} className="text-red-500" />;
      case 'okta':
        return <Key {...iconProps} className="text-blue-700" />;
      case 'auth0':
        return <Lock {...iconProps} className="text-orange-500" />;
      default:
        return <Shield {...iconProps} />;
    }
  };

  // Load Available Authentication Methods
  const loadAuthMethods = useCallback(async () => {
    try {
      setLoadingMethods(true);
      const configurations = await ssoService.getSSOConfigurations();
      
      const methods: AuthMethod[] = configurations
        .filter(config => config.isEnabled)
        .map(config => ({
          id: config.id,
          name: config.name,
          provider: config.provider,
          icon: getProviderIcon(config.provider),
          description: getProviderDescription(config.provider),
          isEnabled: config.isEnabled,
          isDefault: config.isDefault,
          config,
        }));

      setAuthMethods(methods);
      
      // Auto-select default method
      const defaultMethod = methods.find(m => m.isDefault);
      if (defaultMethod) {
        setSelectedMethod(defaultMethod);
      }
    } catch (error) {
      console.error('Failed to load auth methods:', error);
      onAuthError('Failed to load authentication methods');
    } finally {
      setLoadingMethods(false);
    }
  }, [onAuthError]);

  // Load Available Roles
  const loadAvailableRoles = useCallback(async () => {
    if (!showRoleInfo) return;
    
    try {
      const roles = await rbacService.getRoles(organizationId);
      setAvailableRoles(roles.filter(role => !role.isSystemRole));
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  }, [organizationId, showRoleInfo]);

  useEffect(() => {
    loadAuthMethods();
    loadAvailableRoles();
  }, [loadAuthMethods, loadAvailableRoles]);

  // Provider Description Helper
  const getProviderDescription = (provider: SSOProvider): string => {
    const descriptions: Record<SSOProvider, string> = {
      'saml': 'Enterprise SAML 2.0 Single Sign-On',
      'ldap': 'Active Directory / LDAP Authentication',
      'azure-ad': 'Microsoft Azure Active Directory',
      'google-workspace': 'Google Workspace SSO',
      'okta': 'Okta Identity Platform',
      'auth0': 'Auth0 Universal Login',
    };
    return descriptions[provider] || 'Enterprise Authentication';
  };

  // Handle Authentication Method Selection
  const handleMethodSelect = async (method: AuthMethod) => {
    setSelectedMethod(method);
    setIsLoading(true);

    try {
      if (method.provider === 'ldap') {
        setAuthStep('credentials');
      } else {
        // For SAML and OAuth2 providers, initiate redirect flow
        let authUrl: string;
        
        if (method.provider === 'saml') {
          const result = await ssoService.initiateSAMLLogin(method.id, redirectUrl);
          authUrl = result.redirectUrl;
        } else {
          const result = await ssoService.initiateOAuth2Login(method.id);
          authUrl = result.authorizationUrl;
        }
        
        // Redirect to provider
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error('Authentication initiation failed:', error);
      onAuthError('Failed to initiate authentication');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle LDAP Credentials
  const handleLDAPAuth = async () => {
    if (!selectedMethod || !credentials.username || !credentials.password) return;

    setIsLoading(true);
    try {
      const result = await ssoService.authenticateLDAP(
        selectedMethod.id,
        credentials.username,
        credentials.password
      );

      if (result.success) {
        if (result.user) {
          // Check if MFA is required
          if (result.user.attributes?.mfaRequired) {
            setMfaChallenge({
              type: result.user.attributes.mfaType || 'totp',
              challenge: result.user.attributes.mfaChallenge || '',
              expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
            });
            setAuthStep('mfa');
          } else {
            onAuthSuccess(result);
          }
        }
      } else {
        onAuthError(result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('LDAP authentication failed:', error);
      onAuthError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle MFA Verification
  const handleMFAVerification = async () => {
    if (!mfaCode || !mfaChallenge) return;

    setIsLoading(true);
    try {
      // This would be implemented in the backend
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge: mfaChallenge.challenge,
          code: mfaCode,
          type: mfaChallenge.type,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        onAuthSuccess(result);
      } else {
        onAuthError(result.error || 'MFA verification failed');
      }
    } catch (error) {
      console.error('MFA verification failed:', error);
      onAuthError('MFA verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Render Authentication Methods
  const renderAuthMethods = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Enterprise Sign In
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose your authentication method
        </p>
      </div>

      {loadingMethods ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading authentication methods...
          </span>
        </div>
      ) : authMethods.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No authentication methods configured
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {authMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method)}
              disabled={isLoading}
              className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                selectedMethod?.id === method.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              } ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {method.icon}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {method.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault && (
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      Default
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showRoleInfo && availableRoles.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Available Roles
          </h4>
          <div className="space-y-2">
            {availableRoles.slice(0, 3).map((role) => (
              <div key={role.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{role.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {role.permissions.length} permissions
                </span>
              </div>
            ))}
            {availableRoles.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                +{availableRoles.length - 3} more roles available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Render LDAP Credentials Form
  const renderCredentialsForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Building className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {selectedMethod?.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Enter your credentials to continue
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter your username"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => setAuthStep('method')}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleLDAPAuth}
            disabled={isLoading || !credentials.username || !credentials.password}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Render MFA Challenge
  const renderMFAChallenge = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Fingerprint className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Multi-Factor Authentication
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {mfaChallenge?.type === 'totp' && 'Enter the code from your authenticator app'}
          {mfaChallenge?.type === 'sms' && 'Enter the code sent to your phone'}
          {mfaChallenge?.type === 'email' && 'Enter the code sent to your email'}
          {mfaChallenge?.type === 'biometric' && 'Complete biometric verification'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-lg tracking-widest"
            placeholder="000000"
            maxLength={6}
            disabled={isLoading}
          />
        </div>

        {mfaChallenge && (
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            Code expires at {mfaChallenge.expiresAt.toLocaleTimeString()}
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => setAuthStep('credentials')}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleMFAVerification}
            disabled={isLoading || mfaCode.length !== 6}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              'Verify'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
          {authStep === 'method' && renderAuthMethods()}
          {authStep === 'credentials' && renderCredentialsForm()}
          {authStep === 'mfa' && renderMFAChallenge()}
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
            <Shield className="h-4 w-4 mr-2" />
            <span>Secured by ProofPix Enterprise Security</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Your connection is encrypted and monitored for security
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseAuth; 