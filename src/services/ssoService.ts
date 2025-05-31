/**
 * ProofPix Enterprise SSO Service
 * Comprehensive Single Sign-On integration for enterprise identity providers
 */

import axios, { AxiosInstance } from 'axios';
import { apiClient } from './apiService';

// SSO Provider Types
export type SSOProvider = 'saml' | 'ldap' | 'azure-ad' | 'google-workspace' | 'okta' | 'auth0';

// SAML Configuration Interface
export interface SAMLConfig {
  entityId: string;
  ssoUrl: string;
  sloUrl?: string;
  certificate: string;
  nameIdFormat?: string;
  attributeMapping?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    groups?: string;
    department?: string;
  };
}

// LDAP Configuration Interface
export interface LDAPConfig {
  server: string;
  port: number;
  baseDN: string;
  bindDN: string;
  bindPassword: string;
  userSearchBase: string;
  userSearchFilter: string;
  groupSearchBase?: string;
  groupSearchFilter?: string;
  tlsEnabled: boolean;
  attributeMapping: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    groups?: string;
  };
}

// OAuth2/OIDC Configuration
export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope: string[];
  redirectUri: string;
}

// SSO Configuration Union Type
export interface SSOConfiguration {
  id: string;
  name: string;
  provider: SSOProvider;
  isEnabled: boolean;
  isDefault: boolean;
  config: SAMLConfig | LDAPConfig | OAuth2Config;
  createdAt: Date;
  updatedAt: Date;
}

// SSO User Profile
export interface SSOUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  groups: string[];
  department?: string;
  title?: string;
  attributes: Record<string, any>;
  provider: SSOProvider;
  providerId: string;
}

// SSO Authentication Result
export interface SSOAuthResult {
  success: boolean;
  user?: SSOUserProfile;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
  redirectUrl?: string;
}

// SSO Session Information
export interface SSOSession {
  sessionId: string;
  userId: string;
  provider: SSOProvider;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

class SSOService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = apiClient;
  }

  // SAML Authentication Methods
  async initiateSAMLLogin(configId: string, returnUrl?: string): Promise<{ redirectUrl: string }> {
    try {
      const response = await this.apiClient.post('/auth/saml/login', {
        configId,
        returnUrl,
      });
      return response.data;
    } catch (error) {
      throw new Error(`SAML login initiation failed: ${error}`);
    }
  }

  async processSAMLResponse(samlResponse: string, relayState?: string): Promise<SSOAuthResult> {
    try {
      const response = await this.apiClient.post('/auth/saml/callback', {
        samlResponse,
        relayState,
      });
      return response.data;
    } catch (error) {
      throw new Error(`SAML response processing failed: ${error}`);
    }
  }

  async initiateSAMLLogout(sessionId: string): Promise<{ redirectUrl: string }> {
    try {
      const response = await this.apiClient.post('/auth/saml/logout', {
        sessionId,
      });
      return response.data;
    } catch (error) {
      throw new Error(`SAML logout initiation failed: ${error}`);
    }
  }

  // LDAP Authentication Methods
  async authenticateLDAP(
    configId: string,
    username: string,
    password: string
  ): Promise<SSOAuthResult> {
    try {
      const response = await this.apiClient.post('/auth/ldap/authenticate', {
        configId,
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(`LDAP authentication failed: ${error}`);
    }
  }

  async searchLDAPUsers(
    configId: string,
    searchQuery: string,
    limit: number = 50
  ): Promise<SSOUserProfile[]> {
    try {
      const response = await this.apiClient.get('/auth/ldap/search', {
        params: { configId, query: searchQuery, limit },
      });
      return response.data.users;
    } catch (error) {
      throw new Error(`LDAP user search failed: ${error}`);
    }
  }

  async syncLDAPGroups(configId: string): Promise<{ syncedGroups: number; errors: string[] }> {
    try {
      const response = await this.apiClient.post('/auth/ldap/sync-groups', {
        configId,
      });
      return response.data;
    } catch (error) {
      throw new Error(`LDAP group sync failed: ${error}`);
    }
  }

  // OAuth2/OIDC Methods
  async initiateOAuth2Login(
    configId: string,
    state?: string,
    nonce?: string
  ): Promise<{ authorizationUrl: string }> {
    try {
      const response = await this.apiClient.post('/auth/oauth2/authorize', {
        configId,
        state,
        nonce,
      });
      return response.data;
    } catch (error) {
      throw new Error(`OAuth2 authorization failed: ${error}`);
    }
  }

  async processOAuth2Callback(
    configId: string,
    code: string,
    state?: string
  ): Promise<SSOAuthResult> {
    try {
      const response = await this.apiClient.post('/auth/oauth2/callback', {
        configId,
        code,
        state,
      });
      return response.data;
    } catch (error) {
      throw new Error(`OAuth2 callback processing failed: ${error}`);
    }
  }

  async refreshOAuth2Token(refreshToken: string): Promise<SSOAuthResult> {
    try {
      const response = await this.apiClient.post('/auth/oauth2/refresh', {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw new Error(`OAuth2 token refresh failed: ${error}`);
    }
  }

  // SSO Configuration Management
  async createSSOConfiguration(config: Omit<SSOConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<SSOConfiguration> {
    try {
      const response = await this.apiClient.post('/admin/sso/configurations', config);
      return response.data;
    } catch (error) {
      throw new Error(`SSO configuration creation failed: ${error}`);
    }
  }

  async getSSOConfigurations(): Promise<SSOConfiguration[]> {
    try {
      const response = await this.apiClient.get('/admin/sso/configurations');
      return response.data.configurations;
    } catch (error) {
      throw new Error(`Failed to fetch SSO configurations: ${error}`);
    }
  }

  async getSSOConfiguration(configId: string): Promise<SSOConfiguration> {
    try {
      const response = await this.apiClient.get(`/admin/sso/configurations/${configId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch SSO configuration: ${error}`);
    }
  }

  async updateSSOConfiguration(
    configId: string,
    updates: Partial<SSOConfiguration>
  ): Promise<SSOConfiguration> {
    try {
      const response = await this.apiClient.put(`/admin/sso/configurations/${configId}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(`SSO configuration update failed: ${error}`);
    }
  }

  async deleteSSOConfiguration(configId: string): Promise<void> {
    try {
      await this.apiClient.delete(`/admin/sso/configurations/${configId}`);
    } catch (error) {
      throw new Error(`SSO configuration deletion failed: ${error}`);
    }
  }

  async testSSOConfiguration(configId: string): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const response = await this.apiClient.post(`/admin/sso/configurations/${configId}/test`);
      return response.data;
    } catch (error) {
      throw new Error(`SSO configuration test failed: ${error}`);
    }
  }

  // Session Management
  async getSSOSessions(userId?: string): Promise<SSOSession[]> {
    try {
      const response = await this.apiClient.get('/auth/sessions', {
        params: userId ? { userId } : {},
      });
      return response.data.sessions;
    } catch (error) {
      throw new Error(`Failed to fetch SSO sessions: ${error}`);
    }
  }

  async terminateSession(sessionId: string): Promise<void> {
    try {
      await this.apiClient.delete(`/auth/sessions/${sessionId}`);
    } catch (error) {
      throw new Error(`Session termination failed: ${error}`);
    }
  }

  async terminateAllSessions(userId: string): Promise<void> {
    try {
      await this.apiClient.delete(`/auth/sessions/user/${userId}`);
    } catch (error) {
      throw new Error(`All sessions termination failed: ${error}`);
    }
  }

  // User Provisioning
  async provisionUser(userProfile: Omit<SSOUserProfile, 'id'>): Promise<SSOUserProfile> {
    try {
      const response = await this.apiClient.post('/auth/provision', userProfile);
      return response.data;
    } catch (error) {
      throw new Error(`User provisioning failed: ${error}`);
    }
  }

  async updateUserFromSSO(userId: string, ssoProfile: SSOUserProfile): Promise<SSOUserProfile> {
    try {
      const response = await this.apiClient.put(`/auth/users/${userId}/sso-sync`, ssoProfile);
      return response.data;
    } catch (error) {
      throw new Error(`SSO user update failed: ${error}`);
    }
  }

  async deprovisionUser(userId: string, provider: SSOProvider): Promise<void> {
    try {
      await this.apiClient.delete(`/auth/users/${userId}/sso/${provider}`);
    } catch (error) {
      throw new Error(`User deprovisioning failed: ${error}`);
    }
  }

  // Group and Role Mapping
  async mapSSOGroupsToRoles(
    configId: string,
    groupMappings: Array<{ ssoGroup: string; role: string }>
  ): Promise<void> {
    try {
      await this.apiClient.post(`/admin/sso/configurations/${configId}/group-mappings`, {
        mappings: groupMappings,
      });
    } catch (error) {
      throw new Error(`SSO group mapping failed: ${error}`);
    }
  }

  async getSSOGroupMappings(configId: string): Promise<Array<{ ssoGroup: string; role: string }>> {
    try {
      const response = await this.apiClient.get(`/admin/sso/configurations/${configId}/group-mappings`);
      return response.data.mappings;
    } catch (error) {
      throw new Error(`Failed to fetch SSO group mappings: ${error}`);
    }
  }

  // Analytics and Monitoring
  async getSSOAnalytics(timeRange: { start: Date; end: Date }): Promise<{
    totalLogins: number;
    successfulLogins: number;
    failedLogins: number;
    uniqueUsers: number;
    providerBreakdown: Array<{ provider: SSOProvider; count: number }>;
    loginTrend: Array<{ date: string; count: number }>;
  }> {
    try {
      const response = await this.apiClient.get('/analytics/sso', {
        params: {
          startDate: timeRange.start.toISOString(),
          endDate: timeRange.end.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch SSO analytics: ${error}`);
    }
  }

  async getSSOSecurityEvents(params?: {
    severity?: 'low' | 'medium' | 'high' | 'critical';
    provider?: SSOProvider;
    limit?: number;
  }): Promise<Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
    provider: SSOProvider;
    userId?: string;
    timestamp: Date;
    metadata: Record<string, any>;
  }>> {
    try {
      const response = await this.apiClient.get('/security/sso-events', { params });
      return response.data.events;
    } catch (error) {
      throw new Error(`Failed to fetch SSO security events: ${error}`);
    }
  }

  // Utility Methods
  async validateSAMLMetadata(metadataXml: string): Promise<{
    valid: boolean;
    entityId?: string;
    ssoUrl?: string;
    certificate?: string;
    errors?: string[];
  }> {
    try {
      const response = await this.apiClient.post('/auth/saml/validate-metadata', {
        metadata: metadataXml,
      });
      return response.data;
    } catch (error) {
      throw new Error(`SAML metadata validation failed: ${error}`);
    }
  }

  async testLDAPConnection(config: LDAPConfig): Promise<{
    success: boolean;
    message: string;
    userCount?: number;
    groupCount?: number;
  }> {
    try {
      const response = await this.apiClient.post('/auth/ldap/test-connection', config);
      return response.data;
    } catch (error) {
      throw new Error(`LDAP connection test failed: ${error}`);
    }
  }

  async generateSAMLMetadata(configId: string): Promise<{ metadata: string }> {
    try {
      const response = await this.apiClient.get(`/auth/saml/metadata/${configId}`);
      return response.data;
    } catch (error) {
      throw new Error(`SAML metadata generation failed: ${error}`);
    }
  }

  // Just-In-Time (JIT) Provisioning
  async enableJITProvisioning(
    configId: string,
    settings: {
      enabled: boolean;
      defaultRole: string;
      attributeMapping: Record<string, string>;
      groupMapping?: Record<string, string>;
    }
  ): Promise<void> {
    try {
      await this.apiClient.put(`/admin/sso/configurations/${configId}/jit`, settings);
    } catch (error) {
      throw new Error(`JIT provisioning configuration failed: ${error}`);
    }
  }

  async getJITProvisioningSettings(configId: string): Promise<{
    enabled: boolean;
    defaultRole: string;
    attributeMapping: Record<string, string>;
    groupMapping?: Record<string, string>;
  }> {
    try {
      const response = await this.apiClient.get(`/admin/sso/configurations/${configId}/jit`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch JIT provisioning settings: ${error}`);
    }
  }
}

// Export singleton instance
export const ssoService = new SSOService();

// Export utility functions
export const SSOUtils = {
  /**
   * Get SSO provider display name
   */
  getProviderDisplayName(provider: SSOProvider): string {
    const names: Record<SSOProvider, string> = {
      'saml': 'SAML 2.0',
      'ldap': 'LDAP/Active Directory',
      'azure-ad': 'Microsoft Azure AD',
      'google-workspace': 'Google Workspace',
      'okta': 'Okta',
      'auth0': 'Auth0',
    };
    return names[provider] || provider;
  },

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Generate secure state parameter for OAuth2
   */
  generateState(): string {
    return btoa(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  },

  /**
   * Generate nonce for OIDC
   */
  generateNonce(): string {
    return btoa(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  },

  /**
   * Parse JWT token (client-side only for display purposes)
   */
  parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const payload = this.parseJWT(token);
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  },
};

export default ssoService; 