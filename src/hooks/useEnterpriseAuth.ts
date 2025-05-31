/**
 * ProofPix Enterprise Authentication Hooks
 * Custom React hooks for SSO and RBAC integration
 */

import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { ssoService, SSOProvider, SSOConfiguration, SSOAuthResult, SSOSession } from '../services/ssoService';
import { rbacService, Role, Permission, UserRoleAssignment, PermissionCheckResult } from '../services/rbacService';

// Authentication Context
interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  roles: Role[];
  ssoProvider?: SSOProvider;
  sessionInfo?: SSOSession;
  login: (provider: SSOProvider, credentials?: any) => Promise<void>;
  logout: () => Promise<void>;
  checkPermission: (permission: Permission, resourceId?: string) => Promise<boolean>;
  hasRole: (roleName: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// SSO Configuration Hook
export const useSSOConfiguration = () => {
  const [configurations, setConfigurations] = useState<SSOConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfigurations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const configs = await ssoService.getSSOConfigurations();
      setConfigurations(configs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load SSO configurations');
    } finally {
      setLoading(false);
    }
  }, []);

  const createConfiguration = useCallback(async (config: Omit<SSOConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newConfig = await ssoService.createSSOConfiguration(config);
      setConfigurations(prev => [...prev, newConfig]);
      return newConfig;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create SSO configuration');
    }
  }, []);

  const updateConfiguration = useCallback(async (configId: string, updates: Partial<SSOConfiguration>) => {
    try {
      const updatedConfig = await ssoService.updateSSOConfiguration(configId, updates);
      setConfigurations(prev => prev.map(config => 
        config.id === configId ? updatedConfig : config
      ));
      return updatedConfig;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update SSO configuration');
    }
  }, []);

  const deleteConfiguration = useCallback(async (configId: string) => {
    try {
      await ssoService.deleteSSOConfiguration(configId);
      setConfigurations(prev => prev.filter(config => config.id !== configId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete SSO configuration');
    }
  }, []);

  const testConfiguration = useCallback(async (configId: string) => {
    try {
      return await ssoService.testSSOConfiguration(configId);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to test SSO configuration');
    }
  }, []);

  useEffect(() => {
    loadConfigurations();
  }, [loadConfigurations]);

  return {
    configurations,
    loading,
    error,
    loadConfigurations,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
    testConfiguration,
  };
};

// Role Management Hook
export const useRoleManagement = (organizationId?: string) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const roleList = await rbacService.getRoles(organizationId);
      setRoles(roleList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  const createRole = useCallback(async (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>) => {
    try {
      const newRole = await rbacService.createRole(role);
      setRoles(prev => [...prev, newRole]);
      return newRole;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create role');
    }
  }, []);

  const updateRole = useCallback(async (roleId: string, updates: Partial<Role>) => {
    try {
      const updatedRole = await rbacService.updateRole(roleId, updates);
      setRoles(prev => prev.map(role => 
        role.id === roleId ? updatedRole : role
      ));
      return updatedRole;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update role');
    }
  }, []);

  const deleteRole = useCallback(async (roleId: string) => {
    try {
      await rbacService.deleteRole(roleId);
      setRoles(prev => prev.filter(role => role.id !== roleId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete role');
    }
  }, []);

  const assignRoleToUser = useCallback(async (
    userId: string,
    roleId: string,
    options?: { expiresAt?: Date; scope?: UserRoleAssignment['scope'] }
  ) => {
    try {
      return await rbacService.assignRoleToUser(userId, roleId, options);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to assign role to user');
    }
  }, []);

  const removeRoleFromUser = useCallback(async (userId: string, roleId: string) => {
    try {
      await rbacService.removeRoleFromUser(userId, roleId);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to remove role from user');
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  return {
    roles,
    loading,
    error,
    loadRoles,
    createRole,
    updateRole,
    deleteRole,
    assignRoleToUser,
    removeRoleFromUser,
  };
};

// Permission Management Hook
export const usePermissions = (userId?: string) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserPermissions = useCallback(async (targetUserId: string, organizationId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const userPermissions = await rbacService.getUserPermissions(targetUserId, organizationId);
      setPermissions(userPermissions.permissions);
      setRoles(userPermissions.roles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user permissions');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPermission = useCallback(async (
    targetUserId: string,
    resourceType: string,
    resourceId: string,
    action: string,
    organizationId?: string
  ): Promise<PermissionCheckResult> => {
    try {
      return await rbacService.checkPermission({
        userId: targetUserId,
        resourceType: resourceType as any,
        resourceId,
        action: action as any,
        organizationId,
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to check permission');
    }
  }, []);

  const checkMultiplePermissions = useCallback(async (contexts: Array<{
    userId: string;
    resourceType: string;
    resourceId?: string;
    action: string;
    organizationId?: string;
  }>) => {
    try {
      return await rbacService.checkMultiplePermissions(contexts.map(ctx => ({
        userId: ctx.userId,
        resourceType: ctx.resourceType as any,
        resourceId: ctx.resourceId,
        action: ctx.action as any,
        organizationId: ctx.organizationId,
      })));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to check multiple permissions');
    }
  }, []);

  const hasPermission = useCallback((permission: Permission): boolean => {
    return permissions.includes(permission);
  }, [permissions]);

  const hasRole = useCallback((roleName: string): boolean => {
    return roles.some(role => role.name === roleName);
  }, [roles]);

  const hasAnyRole = useCallback((roleNames: string[]): boolean => {
    return roles.some(role => roleNames.includes(role.name));
  }, [roles]);

  const hasAllRoles = useCallback((roleNames: string[]): boolean => {
    return roleNames.every(roleName => roles.some(role => role.name === roleName));
  }, [roles]);

  useEffect(() => {
    if (userId) {
      loadUserPermissions(userId);
    }
  }, [userId, loadUserPermissions]);

  return {
    permissions,
    roles,
    loading,
    error,
    loadUserPermissions,
    checkPermission,
    checkMultiplePermissions,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
};

// Session Management Hook
export const useSessionManagement = () => {
  const [sessions, setSessions] = useState<SSOSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const sessionList = await ssoService.getSSOSessions(userId);
      setSessions(sessionList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const terminateSession = useCallback(async (sessionId: string) => {
    try {
      await ssoService.terminateSession(sessionId);
      setSessions(prev => prev.filter(session => session.sessionId !== sessionId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to terminate session');
    }
  }, []);

  const terminateAllUserSessions = useCallback(async (userId: string) => {
    try {
      await ssoService.terminateAllSessions(userId);
      setSessions(prev => prev.filter(session => session.userId !== userId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to terminate all user sessions');
    }
  }, []);

  const getActiveSessions = useCallback((userId?: string) => {
    return sessions.filter(session => 
      session.isActive && 
      (!userId || session.userId === userId)
    );
  }, [sessions]);

  const getSessionsByProvider = useCallback((provider: SSOProvider) => {
    return sessions.filter(session => session.provider === provider);
  }, [sessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    loading,
    error,
    loadSessions,
    terminateSession,
    terminateAllUserSessions,
    getActiveSessions,
    getSessionsByProvider,
  };
};

// Security Analytics Hook
export const useSecurityAnalytics = (timeRange: { start: Date; end: Date }) => {
  const [ssoAnalytics, setSSOAnalytics] = useState<any>(null);
  const [rbacAnalytics, setRBACAnalytics] = useState<any>(null);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [ssoData, rbacData, events] = await Promise.all([
        ssoService.getSSOAnalytics(timeRange),
        rbacService.getRoleAnalytics(timeRange),
        ssoService.getSSOSecurityEvents({ limit: 100 }),
      ]);

      setSSOAnalytics(ssoData);
      setRBACAnalytics(rbacData);
      setSecurityEvents(events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load security analytics');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const getEventsByType = useCallback((eventType: string) => {
    return securityEvents.filter(event => event.type === eventType);
  }, [securityEvents]);

  const getEventsBySeverity = useCallback((severity: string) => {
    return securityEvents.filter(event => event.severity === severity);
  }, [securityEvents]);

  const getCriticalEvents = useCallback(() => {
    return securityEvents.filter(event => event.severity === 'critical');
  }, [securityEvents]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    ssoAnalytics,
    rbacAnalytics,
    securityEvents,
    loading,
    error,
    loadAnalytics,
    getEventsByType,
    getEventsBySeverity,
    getCriticalEvents,
  };
};

// Authentication Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Multi-Factor Authentication Hook
export const useMFA = () => {
  const [mfaEnabled, setMFAEnabled] = useState(false);
  const [mfaMethods, setMFAMethods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const enableMFA = useCallback(async (method: 'totp' | 'sms' | 'email') => {
    try {
      // This would be implemented in the backend
      const response = await fetch('/api/auth/mfa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to enable MFA');
      }
      
      const result = await response.json();
      setMFAEnabled(true);
      setMFAMethods(prev => [...prev, method]);
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to enable MFA');
    }
  }, []);

  const disableMFA = useCallback(async (method: string) => {
    try {
      const response = await fetch('/api/auth/mfa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to disable MFA');
      }
      
      setMFAMethods(prev => prev.filter(m => m !== method));
      if (mfaMethods.length === 1) {
        setMFAEnabled(false);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to disable MFA');
    }
  }, [mfaMethods]);

  const verifyMFA = useCallback(async (code: string, method: string) => {
    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, method }),
      });
      
      if (!response.ok) {
        throw new Error('MFA verification failed');
      }
      
      return await response.json();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'MFA verification failed');
    }
  }, []);

  const generateBackupCodes = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/mfa/backup-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate backup codes');
      }
      
      return await response.json();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to generate backup codes');
    }
  }, []);

  return {
    mfaEnabled,
    mfaMethods,
    loading,
    error,
    enableMFA,
    disableMFA,
    verifyMFA,
    generateBackupCodes,
  };
};

// Compliance Monitoring Hook
export const useCompliance = () => {
  const [complianceStatus, setComplianceStatus] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComplianceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load RBAC audit logs
      const logs = await rbacService.getAccessAuditLog({
        limit: 100,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        endDate: new Date(),
      });

      setAuditLogs(logs.logs);
      
      // Mock compliance status (would come from backend)
      const compliance = [
        {
          framework: 'SOC 2',
          score: 96,
          status: 'compliant',
          lastAudit: new Date('2024-01-15'),
          nextAudit: new Date('2024-07-15'),
        },
        {
          framework: 'GDPR',
          score: 92,
          status: 'compliant',
          lastAudit: new Date('2024-02-01'),
          nextAudit: new Date('2024-08-01'),
        },
        {
          framework: 'HIPAA',
          score: 89,
          status: 'partial',
          lastAudit: new Date('2024-01-20'),
          nextAudit: new Date('2024-07-20'),
        },
      ];
      
      setComplianceStatus(compliance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateComplianceReport = useCallback(async (
    type: string,
    timeRange: { start: Date; end: Date },
    format: 'json' | 'csv' | 'pdf'
  ) => {
    try {
      return await rbacService.generateComplianceReport({
        type: type as any,
        timeRange,
        format,
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to generate compliance report');
    }
  }, []);

  const validateRoleCompliance = useCallback(async (roleId: string) => {
    try {
      return await rbacService.validateRoleCompliance(roleId);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to validate role compliance');
    }
  }, []);

  useEffect(() => {
    loadComplianceData();
  }, [loadComplianceData]);

  return {
    complianceStatus,
    auditLogs,
    loading,
    error,
    loadComplianceData,
    generateComplianceReport,
    validateRoleCompliance,
  };
};

// Export all hooks
export {
  AuthContext,
}; 