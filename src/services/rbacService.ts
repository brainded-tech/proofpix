/**
 * ProofPix Advanced RBAC Service
 * Comprehensive Role-Based Access Control with granular permissions
 */

import { apiClient } from './apiService';

// Permission Types
export type Permission = 
  // File Operations
  | 'files:read' | 'files:write' | 'files:delete' | 'files:share' | 'files:download'
  // API Management
  | 'api:read' | 'api:write' | 'api:delete' | 'api:manage_keys'
  // User Management
  | 'users:read' | 'users:write' | 'users:delete' | 'users:invite' | 'users:manage_roles'
  // Analytics
  | 'analytics:read' | 'analytics:export' | 'analytics:configure'
  // Security
  | 'security:read' | 'security:write' | 'security:audit' | 'security:configure'
  // Billing
  | 'billing:read' | 'billing:write' | 'billing:manage'
  // Admin
  | 'admin:read' | 'admin:write' | 'admin:configure' | 'admin:super'
  // SSO
  | 'sso:read' | 'sso:write' | 'sso:configure' | 'sso:manage'
  // Webhooks
  | 'webhooks:read' | 'webhooks:write' | 'webhooks:delete' | 'webhooks:configure'
  // Compliance
  | 'compliance:read' | 'compliance:write' | 'compliance:audit' | 'compliance:configure';

// Resource Types
export type ResourceType = 
  | 'file' | 'api_key' | 'user' | 'role' | 'webhook' | 'analytics' 
  | 'security' | 'billing' | 'sso_config' | 'compliance' | 'organization';

// Action Types
export type Action = 'create' | 'read' | 'update' | 'delete' | 'execute' | 'manage';

// Role Interface
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
  isDefault: boolean;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
  userCount: number;
}

// Permission Policy
export interface PermissionPolicy {
  id: string;
  name: string;
  description: string;
  effect: 'allow' | 'deny';
  resources: Array<{
    type: ResourceType;
    identifiers?: string[]; // Specific resource IDs, or * for all
    attributes?: Record<string, any>; // Resource attributes for filtering
  }>;
  actions: Action[];
  conditions?: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
    value: any;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// User Role Assignment
export interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  scope?: {
    organizationId?: string;
    projectId?: string;
    resourceIds?: string[];
  };
}

// Permission Check Result
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  matchedPolicies?: string[];
  deniedBy?: string;
}

// Resource Access Context
export interface AccessContext {
  userId: string;
  resourceType: ResourceType;
  resourceId?: string;
  action: Action;
  organizationId?: string;
  projectId?: string;
  additionalContext?: Record<string, any>;
}

// API Key Permissions
export interface ApiKeyPermissions {
  id: string;
  apiKeyId: string;
  permissions: Permission[];
  resourceScopes: Array<{
    type: ResourceType;
    identifiers?: string[];
    restrictions?: Record<string, any>;
  }>;
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  ipWhitelist?: string[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Session Permissions
export interface SessionPermissions {
  sessionId: string;
  userId: string;
  permissions: Permission[];
  roles: Role[];
  effectivePolicies: PermissionPolicy[];
  organizationId?: string;
  lastUpdated: Date;
  expiresAt: Date;
}

class RBACService {
  // Role Management
  async createRole(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>): Promise<Role> {
    try {
      const response = await apiClient.post('/admin/rbac/roles', role);
      return response.data;
    } catch (error) {
      throw new Error(`Role creation failed: ${error}`);
    }
  }

  async getRoles(organizationId?: string): Promise<Role[]> {
    try {
      const response = await apiClient.get('/admin/rbac/roles', {
        params: organizationId ? { organizationId } : {},
      });
      return response.data.roles;
    } catch (error) {
      throw new Error(`Failed to fetch roles: ${error}`);
    }
  }

  async getRole(roleId: string): Promise<Role> {
    try {
      const response = await apiClient.get(`/admin/rbac/roles/${roleId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch role: ${error}`);
    }
  }

  async updateRole(roleId: string, updates: Partial<Role>): Promise<Role> {
    try {
      const response = await apiClient.put(`/admin/rbac/roles/${roleId}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(`Role update failed: ${error}`);
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/rbac/roles/${roleId}`);
    } catch (error) {
      throw new Error(`Role deletion failed: ${error}`);
    }
  }

  async cloneRole(roleId: string, newName: string): Promise<Role> {
    try {
      const response = await apiClient.post(`/admin/rbac/roles/${roleId}/clone`, {
        name: newName,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Role cloning failed: ${error}`);
    }
  }

  // Permission Policy Management
  async createPolicy(policy: Omit<PermissionPolicy, 'id' | 'createdAt' | 'updatedAt'>): Promise<PermissionPolicy> {
    try {
      const response = await apiClient.post('/admin/rbac/policies', policy);
      return response.data;
    } catch (error) {
      throw new Error(`Policy creation failed: ${error}`);
    }
  }

  async getPolicies(): Promise<PermissionPolicy[]> {
    try {
      const response = await apiClient.get('/admin/rbac/policies');
      return response.data.policies;
    } catch (error) {
      throw new Error(`Failed to fetch policies: ${error}`);
    }
  }

  async getPolicy(policyId: string): Promise<PermissionPolicy> {
    try {
      const response = await apiClient.get(`/admin/rbac/policies/${policyId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch policy: ${error}`);
    }
  }

  async updatePolicy(policyId: string, updates: Partial<PermissionPolicy>): Promise<PermissionPolicy> {
    try {
      const response = await apiClient.put(`/admin/rbac/policies/${policyId}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(`Policy update failed: ${error}`);
    }
  }

  async deletePolicy(policyId: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/rbac/policies/${policyId}`);
    } catch (error) {
      throw new Error(`Policy deletion failed: ${error}`);
    }
  }

  // User Role Assignment
  async assignRoleToUser(
    userId: string,
    roleId: string,
    options?: {
      expiresAt?: Date;
      scope?: UserRoleAssignment['scope'];
    }
  ): Promise<UserRoleAssignment> {
    try {
      const response = await apiClient.post('/admin/rbac/user-roles', {
        userId,
        roleId,
        ...options,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Role assignment failed: ${error}`);
    }
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    try {
      await apiClient.delete(`/admin/rbac/user-roles/${userId}/${roleId}`);
    } catch (error) {
      throw new Error(`Role removal failed: ${error}`);
    }
  }

  async getUserRoles(userId: string): Promise<UserRoleAssignment[]> {
    try {
      const response = await apiClient.get(`/admin/rbac/users/${userId}/roles`);
      return response.data.assignments;
    } catch (error) {
      throw new Error(`Failed to fetch user roles: ${error}`);
    }
  }

  async getRoleUsers(roleId: string): Promise<Array<{
    userId: string;
    email: string;
    name: string;
    assignment: UserRoleAssignment;
  }>> {
    try {
      const response = await apiClient.get(`/admin/rbac/roles/${roleId}/users`);
      return response.data.users;
    } catch (error) {
      throw new Error(`Failed to fetch role users: ${error}`);
    }
  }

  // Permission Checking
  async checkPermission(context: AccessContext): Promise<PermissionCheckResult> {
    try {
      const response = await apiClient.post('/rbac/check-permission', context);
      return response.data;
    } catch (error) {
      throw new Error(`Permission check failed: ${error}`);
    }
  }

  async checkMultiplePermissions(
    contexts: AccessContext[]
  ): Promise<Array<{ context: AccessContext; result: PermissionCheckResult }>> {
    try {
      const response = await apiClient.post('/rbac/check-permissions', { contexts });
      return response.data.results;
    } catch (error) {
      throw new Error(`Multiple permission check failed: ${error}`);
    }
  }

  async getUserPermissions(userId: string, organizationId?: string): Promise<{
    permissions: Permission[];
    roles: Role[];
    effectivePolicies: PermissionPolicy[];
  }> {
    try {
      const response = await apiClient.get(`/rbac/users/${userId}/permissions`, {
        params: organizationId ? { organizationId } : {},
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user permissions: ${error}`);
    }
  }

  // API Key Permissions
  async setApiKeyPermissions(
    apiKeyId: string,
    permissions: Omit<ApiKeyPermissions, 'id' | 'apiKeyId' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiKeyPermissions> {
    try {
      const response = await apiClient.put(`/admin/rbac/api-keys/${apiKeyId}/permissions`, permissions);
      return response.data;
    } catch (error) {
      throw new Error(`API key permissions update failed: ${error}`);
    }
  }

  async getApiKeyPermissions(apiKeyId: string): Promise<ApiKeyPermissions> {
    try {
      const response = await apiClient.get(`/admin/rbac/api-keys/${apiKeyId}/permissions`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch API key permissions: ${error}`);
    }
  }

  async checkApiKeyPermission(
    apiKeyId: string,
    context: Omit<AccessContext, 'userId'>
  ): Promise<PermissionCheckResult> {
    try {
      const response = await apiClient.post(`/rbac/api-keys/${apiKeyId}/check-permission`, context);
      return response.data;
    } catch (error) {
      throw new Error(`API key permission check failed: ${error}`);
    }
  }

  // Session Management
  async getSessionPermissions(sessionId: string): Promise<SessionPermissions> {
    try {
      const response = await apiClient.get(`/rbac/sessions/${sessionId}/permissions`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch session permissions: ${error}`);
    }
  }

  async refreshSessionPermissions(sessionId: string): Promise<SessionPermissions> {
    try {
      const response = await apiClient.post(`/rbac/sessions/${sessionId}/refresh`);
      return response.data;
    } catch (error) {
      throw new Error(`Session permissions refresh failed: ${error}`);
    }
  }

  // Bulk Operations
  async bulkAssignRoles(assignments: Array<{
    userId: string;
    roleIds: string[];
    scope?: UserRoleAssignment['scope'];
  }>): Promise<{ successful: number; failed: number; errors: string[] }> {
    try {
      const response = await apiClient.post('/admin/rbac/bulk-assign-roles', { assignments });
      return response.data;
    } catch (error) {
      throw new Error(`Bulk role assignment failed: ${error}`);
    }
  }

  async bulkRemoveRoles(removals: Array<{
    userId: string;
    roleIds: string[];
  }>): Promise<{ successful: number; failed: number; errors: string[] }> {
    try {
      const response = await apiClient.post('/admin/rbac/bulk-remove-roles', { removals });
      return response.data;
    } catch (error) {
      throw new Error(`Bulk role removal failed: ${error}`);
    }
  }

  // Analytics and Reporting
  async getRoleAnalytics(timeRange: { start: Date; end: Date }): Promise<{
    roleUsage: Array<{ roleId: string; roleName: string; userCount: number; activeUsers: number }>;
    permissionUsage: Array<{ permission: Permission; usageCount: number; uniqueUsers: number }>;
    accessPatterns: Array<{ resourceType: ResourceType; action: Action; count: number }>;
    securityEvents: Array<{ type: string; count: number; severity: string }>;
  }> {
    try {
      const response = await apiClient.get('/analytics/rbac', {
        params: {
          startDate: timeRange.start.toISOString(),
          endDate: timeRange.end.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch RBAC analytics: ${error}`);
    }
  }

  async getAccessAuditLog(params: {
    userId?: string;
    resourceType?: ResourceType;
    action?: Action;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{
    logs: Array<{
      id: string;
      userId: string;
      userEmail: string;
      resourceType: ResourceType;
      resourceId?: string;
      action: Action;
      allowed: boolean;
      reason?: string;
      timestamp: Date;
      ipAddress: string;
      userAgent: string;
    }>;
    total: number;
  }> {
    try {
      const response = await apiClient.get('/audit/rbac/access-log', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch access audit log: ${error}`);
    }
  }

  // Compliance and Governance
  async generateComplianceReport(params: {
    type: 'role_assignments' | 'permission_usage' | 'access_patterns' | 'security_violations';
    timeRange: { start: Date; end: Date };
    organizationId?: string;
    format: 'json' | 'csv' | 'pdf';
  }): Promise<{ reportId: string; downloadUrl: string }> {
    try {
      const response = await apiClient.post('/compliance/rbac/reports', params);
      return response.data;
    } catch (error) {
      throw new Error(`Compliance report generation failed: ${error}`);
    }
  }

  async validateRoleCompliance(roleId: string): Promise<{
    compliant: boolean;
    violations: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      recommendation: string;
    }>;
    score: number;
  }> {
    try {
      const response = await apiClient.post(`/compliance/rbac/roles/${roleId}/validate`);
      return response.data;
    } catch (error) {
      throw new Error(`Role compliance validation failed: ${error}`);
    }
  }

  // Template and Presets
  async getRoleTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    permissions: Permission[];
    isRecommended: boolean;
  }>> {
    try {
      const response = await apiClient.get('/admin/rbac/role-templates');
      return response.data.templates;
    } catch (error) {
      throw new Error(`Failed to fetch role templates: ${error}`);
    }
  }

  async createRoleFromTemplate(templateId: string, roleName: string): Promise<Role> {
    try {
      const response = await apiClient.post(`/admin/rbac/role-templates/${templateId}/create-role`, {
        name: roleName,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Role creation from template failed: ${error}`);
    }
  }

  // Permission Discovery
  async discoverRequiredPermissions(userId: string, timeRange: { start: Date; end: Date }): Promise<{
    currentPermissions: Permission[];
    usedPermissions: Permission[];
    unusedPermissions: Permission[];
    missingPermissions: Permission[];
    recommendations: Array<{
      action: 'add' | 'remove';
      permission: Permission;
      reason: string;
      confidence: number;
    }>;
  }> {
    try {
      const response = await apiClient.post(`/rbac/users/${userId}/discover-permissions`, {
        timeRange,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Permission discovery failed: ${error}`);
    }
  }
}

// Export singleton instance
export const rbacService = new RBACService();

// Utility functions
export const RBACUtils = {
  /**
   * Check if a permission allows a specific action on a resource type
   */
  permissionAllowsAction(permission: Permission, resourceType: ResourceType, action: Action): boolean {
    const [resource, permAction] = permission.split(':');
    
    // Map resource types to permission prefixes
    const resourceMap: Record<ResourceType, string> = {
      'file': 'files',
      'api_key': 'api',
      'user': 'users',
      'role': 'users', // Role management is under users
      'webhook': 'webhooks',
      'analytics': 'analytics',
      'security': 'security',
      'billing': 'billing',
      'sso_config': 'sso',
      'compliance': 'compliance',
      'organization': 'admin',
    };

    const expectedResource = resourceMap[resourceType];
    if (resource !== expectedResource) return false;

    // Map actions to permission actions
    const actionMap: Record<Action, string[]> = {
      'create': ['write'],
      'read': ['read'],
      'update': ['write'],
      'delete': ['delete'],
      'execute': ['write', 'manage'],
      'manage': ['manage', 'configure'],
    };

    const allowedActions = actionMap[action] || [];
    return allowedActions.includes(permAction);
  },

  /**
   * Get all permissions for a resource type
   */
  getResourcePermissions(resourceType: ResourceType): Permission[] {
    const resourceMap: Record<ResourceType, Permission[]> = {
      'file': ['files:read', 'files:write', 'files:delete', 'files:share', 'files:download'],
      'api_key': ['api:read', 'api:write', 'api:delete', 'api:manage_keys'],
      'user': ['users:read', 'users:write', 'users:delete', 'users:invite', 'users:manage_roles'],
      'role': ['users:manage_roles'],
      'webhook': ['webhooks:read', 'webhooks:write', 'webhooks:delete', 'webhooks:configure'],
      'analytics': ['analytics:read', 'analytics:export', 'analytics:configure'],
      'security': ['security:read', 'security:write', 'security:audit', 'security:configure'],
      'billing': ['billing:read', 'billing:write', 'billing:manage'],
      'sso_config': ['sso:read', 'sso:write', 'sso:configure', 'sso:manage'],
      'compliance': ['compliance:read', 'compliance:write', 'compliance:audit', 'compliance:configure'],
      'organization': ['admin:read', 'admin:write', 'admin:configure', 'admin:super'],
    };

    return resourceMap[resourceType] || [];
  },

  /**
   * Get permission display name
   */
  getPermissionDisplayName(permission: Permission): string {
    const names: Record<Permission, string> = {
      'files:read': 'View Files',
      'files:write': 'Upload/Edit Files',
      'files:delete': 'Delete Files',
      'files:share': 'Share Files',
      'files:download': 'Download Files',
      'api:read': 'View API Keys',
      'api:write': 'Create/Edit API Keys',
      'api:delete': 'Delete API Keys',
      'api:manage_keys': 'Manage API Keys',
      'users:read': 'View Users',
      'users:write': 'Create/Edit Users',
      'users:delete': 'Delete Users',
      'users:invite': 'Invite Users',
      'users:manage_roles': 'Manage User Roles',
      'analytics:read': 'View Analytics',
      'analytics:export': 'Export Analytics',
      'analytics:configure': 'Configure Analytics',
      'security:read': 'View Security',
      'security:write': 'Manage Security',
      'security:audit': 'Security Audit',
      'security:configure': 'Configure Security',
      'billing:read': 'View Billing',
      'billing:write': 'Manage Billing',
      'billing:manage': 'Full Billing Access',
      'admin:read': 'View Admin',
      'admin:write': 'Admin Actions',
      'admin:configure': 'Configure System',
      'admin:super': 'Super Admin',
      'sso:read': 'View SSO',
      'sso:write': 'Manage SSO',
      'sso:configure': 'Configure SSO',
      'sso:manage': 'Full SSO Access',
      'webhooks:read': 'View Webhooks',
      'webhooks:write': 'Create/Edit Webhooks',
      'webhooks:delete': 'Delete Webhooks',
      'webhooks:configure': 'Configure Webhooks',
      'compliance:read': 'View Compliance',
      'compliance:write': 'Manage Compliance',
      'compliance:audit': 'Compliance Audit',
      'compliance:configure': 'Configure Compliance',
    };

    return names[permission] || permission;
  },

  /**
   * Group permissions by category
   */
  groupPermissionsByCategory(permissions: Permission[]): Record<string, Permission[]> {
    const categories: Record<string, Permission[]> = {
      'File Management': [],
      'API Management': [],
      'User Management': [],
      'Analytics': [],
      'Security': [],
      'Billing': [],
      'Administration': [],
      'SSO': [],
      'Webhooks': [],
      'Compliance': [],
    };

    permissions.forEach(permission => {
      const [resource] = permission.split(':');
      switch (resource) {
        case 'files':
          categories['File Management'].push(permission);
          break;
        case 'api':
          categories['API Management'].push(permission);
          break;
        case 'users':
          categories['User Management'].push(permission);
          break;
        case 'analytics':
          categories['Analytics'].push(permission);
          break;
        case 'security':
          categories['Security'].push(permission);
          break;
        case 'billing':
          categories['Billing'].push(permission);
          break;
        case 'admin':
          categories['Administration'].push(permission);
          break;
        case 'sso':
          categories['SSO'].push(permission);
          break;
        case 'webhooks':
          categories['Webhooks'].push(permission);
          break;
        case 'compliance':
          categories['Compliance'].push(permission);
          break;
      }
    });

    // Remove empty categories
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });

    return categories;
  },

  /**
   * Validate role name
   */
  isValidRoleName(name: string): boolean {
    return /^[a-zA-Z0-9\s\-_]{3,50}$/.test(name);
  },

  /**
   * Check if role has admin permissions
   */
  isAdminRole(role: Role): boolean {
    return role.permissions.some(p => p.startsWith('admin:'));
  },

  /**
   * Get role permission level (0-100)
   */
  getRolePermissionLevel(role: Role): number {
    const totalPermissions = Object.values(RBACUtils.groupPermissionsByCategory(
      Object.keys({
        'files:read': true, 'files:write': true, 'files:delete': true, 'files:share': true, 'files:download': true,
        'api:read': true, 'api:write': true, 'api:delete': true, 'api:manage_keys': true,
        'users:read': true, 'users:write': true, 'users:delete': true, 'users:invite': true, 'users:manage_roles': true,
        'analytics:read': true, 'analytics:export': true, 'analytics:configure': true,
        'security:read': true, 'security:write': true, 'security:audit': true, 'security:configure': true,
        'billing:read': true, 'billing:write': true, 'billing:manage': true,
        'admin:read': true, 'admin:write': true, 'admin:configure': true, 'admin:super': true,
        'sso:read': true, 'sso:write': true, 'sso:configure': true, 'sso:manage': true,
        'webhooks:read': true, 'webhooks:write': true, 'webhooks:delete': true, 'webhooks:configure': true,
        'compliance:read': true, 'compliance:write': true, 'compliance:audit': true, 'compliance:configure': true,
      }) as Permission[]
    )).flat().length;

    return Math.round((role.permissions.length / totalPermissions) * 100);
  },
};

export default rbacService; 