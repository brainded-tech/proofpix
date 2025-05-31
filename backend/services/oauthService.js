const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { logger } = require('../config/database');
const { auditLog } = require('./auditService');

class OAuthService {
  constructor() {
    this.authorizationCodes = new Map(); // In-memory store for auth codes (use Redis in production)
    this.accessTokens = new Map(); // In-memory store for access tokens (use Redis in production)
    this.refreshTokens = new Map(); // In-memory store for refresh tokens (use Redis in production)
    
    // OAuth2 configuration
    this.config = {
      authorizationCodeExpiry: 10 * 60 * 1000, // 10 minutes
      accessTokenExpiry: 60 * 60 * 1000, // 1 hour
      refreshTokenExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days
      supportedGrantTypes: ['authorization_code', 'refresh_token'],
      supportedResponseTypes: ['code'],
      supportedScopes: [
        'read:files',
        'write:files',
        'read:exif',
        'write:exif',
        'read:webhooks',
        'write:webhooks',
        'read:profile',
        'write:profile',
        // Collaboration mode scopes
        'collaboration:create',
        'collaboration:join',
        'collaboration:manage',
        'team:read',
        'team:write',
        'team:manage',
        'ephemeral:process',
        'ephemeral:share'
      ]
    };
  }

  // Client Application Management

  async createApplication(userId, applicationData) {
    try {
      const { name, description, redirectUris, scopes, applicationType = 'web' } = applicationData;

      // Validate input
      if (!name || !redirectUris || !Array.isArray(redirectUris) || redirectUris.length === 0) {
        throw new Error('Application name and redirect URIs are required');
      }

      // Validate redirect URIs
      for (const uri of redirectUris) {
        if (!this.isValidRedirectUri(uri)) {
          throw new Error(`Invalid redirect URI: ${uri}`);
        }
      }

      // Validate scopes
      if (scopes && !this.validateScopes(scopes)) {
        throw new Error('Invalid scopes provided');
      }

      // Generate client credentials
      const clientId = this.generateClientId();
      const clientSecret = this.generateClientSecret();
      const clientSecretHash = this.hashSecret(clientSecret);

      // Insert application into database
      const result = await db.query(`
        INSERT INTO oauth_applications (
          user_id, client_id, client_secret_hash, application_name, 
          description, redirect_uris, scopes, application_type, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING id, client_id, application_name, description, redirect_uris, 
                 scopes, application_type, created_at
      `, [
        userId, clientId, clientSecretHash, name, description,
        JSON.stringify(redirectUris), JSON.stringify(scopes || []), applicationType
      ]);

      const application = result.rows[0];

      // Audit log
      await auditLog(userId, 'oauth_application_created', {
        applicationId: application.id,
        clientId: application.client_id,
        applicationName: name
      });

      logger.info(`OAuth application created: ${name} (${clientId}) for user ${userId}`);

      return {
        success: true,
        application: {
          ...application,
          client_secret: clientSecret // Only return secret on creation
        }
      };
    } catch (error) {
      logger.error('Failed to create OAuth application:', error);
      throw error;
    }
  }

  async getUserApplications(userId) {
    try {
      const result = await db.query(`
        SELECT id, client_id, application_name, description, redirect_uris,
               scopes, application_type, is_active, created_at, updated_at
        FROM oauth_applications
        WHERE user_id = $1
        ORDER BY created_at DESC
      `, [userId]);

      return result.rows.map(app => ({
        ...app,
        redirect_uris: JSON.parse(app.redirect_uris),
        scopes: JSON.parse(app.scopes)
      }));
    } catch (error) {
      logger.error('Failed to get user applications:', error);
      throw error;
    }
  }

  async updateApplication(applicationId, userId, updates) {
    try {
      const allowedUpdates = ['application_name', 'description', 'redirect_uris', 'scopes', 'is_active'];
      const updateFields = [];
      const updateValues = [];
      let paramCount = 0;

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key)) {
          updateFields.push(`${key} = $${++paramCount}`);
          
          if (key === 'redirect_uris' || key === 'scopes') {
            updateValues.push(JSON.stringify(value));
          } else {
            updateValues.push(value);
          }
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      updateFields.push(`updated_at = $${++paramCount}`);
      updateValues.push(new Date());

      updateValues.push(applicationId, userId);

      const result = await db.query(`
        UPDATE oauth_applications 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
        RETURNING id, client_id, application_name, description, redirect_uris,
                 scopes, application_type, is_active, created_at, updated_at
      `, updateValues);

      if (result.rows.length === 0) {
        throw new Error('Application not found');
      }

      const application = result.rows[0];

      // Audit log
      await auditLog(userId, 'oauth_application_updated', {
        applicationId,
        updates: Object.keys(updates)
      });

      return {
        ...application,
        redirect_uris: JSON.parse(application.redirect_uris),
        scopes: JSON.parse(application.scopes)
      };
    } catch (error) {
      logger.error('Failed to update OAuth application:', error);
      throw error;
    }
  }

  async deleteApplication(applicationId, userId) {
    try {
      // Revoke all tokens for this application
      await this.revokeAllTokensForApplication(applicationId);

      // Delete application
      const result = await db.query(`
        DELETE FROM oauth_applications
        WHERE id = $1 AND user_id = $2
        RETURNING client_id, application_name
      `, [applicationId, userId]);

      if (result.rows.length === 0) {
        throw new Error('Application not found');
      }

      const deletedApp = result.rows[0];

      // Audit log
      await auditLog(userId, 'oauth_application_deleted', {
        applicationId,
        clientId: deletedApp.client_id,
        applicationName: deletedApp.application_name
      });

      logger.info(`OAuth application deleted: ${deletedApp.application_name} (${deletedApp.client_id})`);

      return {
        success: true,
        message: 'Application deleted successfully'
      };
    } catch (error) {
      logger.error('Failed to delete OAuth application:', error);
      throw error;
    }
  }

  // Authorization Flow

  async authorize(clientId, redirectUri, responseType, scope, state, userId) {
    try {
      // Validate client
      const client = await this.getClientByClientId(clientId);
      if (!client || !client.is_active) {
        throw new Error('Invalid or inactive client');
      }

      // Validate redirect URI
      const redirectUris = JSON.parse(client.redirect_uris);
      if (!redirectUris.includes(redirectUri)) {
        throw new Error('Invalid redirect URI');
      }

      // Validate response type
      if (!this.config.supportedResponseTypes.includes(responseType)) {
        throw new Error('Unsupported response type');
      }

      // Validate and normalize scopes
      const requestedScopes = scope ? scope.split(' ') : [];
      const validatedScopes = this.validateAndFilterScopes(requestedScopes);

      // Generate authorization code
      const authorizationCode = this.generateAuthorizationCode();
      const expiresAt = new Date(Date.now() + this.config.authorizationCodeExpiry);

      // Store authorization code
      await db.query(`
        INSERT INTO oauth_authorization_codes (
          code, client_id, user_id, redirect_uri, scopes, state, expires_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `, [
        authorizationCode, clientId, userId, redirectUri,
        JSON.stringify(validatedScopes), state, expiresAt
      ]);

      // Audit log
      await auditLog(userId, 'oauth_authorization_granted', {
        clientId,
        scopes: validatedScopes,
        redirectUri
      });

      logger.info(`Authorization code generated for client ${clientId}, user ${userId}`);

      return {
        success: true,
        authorizationCode,
        redirectUri,
        state
      };
    } catch (error) {
      logger.error('Authorization failed:', error);
      throw error;
    }
  }

  async exchangeCodeForToken(clientId, clientSecret, code, redirectUri, grantType) {
    try {
      // Validate grant type
      if (!this.config.supportedGrantTypes.includes(grantType)) {
        throw new Error('Unsupported grant type');
      }

      // Validate client credentials
      const client = await this.authenticateClient(clientId, clientSecret);
      if (!client) {
        throw new Error('Invalid client credentials');
      }

      // Get and validate authorization code
      const authCode = await db.query(`
        SELECT * FROM oauth_authorization_codes
        WHERE code = $1 AND client_id = $2 AND expires_at > NOW()
      `, [code, clientId]);

      if (authCode.rows.length === 0) {
        throw new Error('Invalid or expired authorization code');
      }

      const authData = authCode.rows[0];

      // Validate redirect URI
      if (authData.redirect_uri !== redirectUri) {
        throw new Error('Redirect URI mismatch');
      }

      // Generate tokens
      const accessToken = this.generateAccessToken();
      const refreshToken = this.generateRefreshToken();
      const accessTokenExpiresAt = new Date(Date.now() + this.config.accessTokenExpiry);
      const refreshTokenExpiresAt = new Date(Date.now() + this.config.refreshTokenExpiry);

      // Store tokens
      await db.query(`
        INSERT INTO oauth_access_tokens (
          token, client_id, user_id, scopes, expires_at, refresh_token, 
          refresh_token_expires_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `, [
        accessToken, clientId, authData.user_id, authData.scopes,
        accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt
      ]);

      // Delete used authorization code
      await db.query('DELETE FROM oauth_authorization_codes WHERE code = $1', [code]);

      // Audit log
      await auditLog(authData.user_id, 'oauth_token_issued', {
        clientId,
        scopes: JSON.parse(authData.scopes)
      });

      logger.info(`Access token issued for client ${clientId}, user ${authData.user_id}`);

      return {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: Math.floor(this.config.accessTokenExpiry / 1000),
        refresh_token: refreshToken,
        scope: JSON.parse(authData.scopes).join(' ')
      };
    } catch (error) {
      logger.error('Token exchange failed:', error);
      throw error;
    }
  }

  async refreshAccessToken(clientId, clientSecret, refreshToken) {
    try {
      // Validate client credentials
      const client = await this.authenticateClient(clientId, clientSecret);
      if (!client) {
        throw new Error('Invalid client credentials');
      }

      // Get and validate refresh token
      const tokenData = await db.query(`
        SELECT * FROM oauth_access_tokens
        WHERE refresh_token = $1 AND client_id = $2 AND refresh_token_expires_at > NOW()
      `, [refreshToken, clientId]);

      if (tokenData.rows.length === 0) {
        throw new Error('Invalid or expired refresh token');
      }

      const existingToken = tokenData.rows[0];

      // Generate new access token
      const newAccessToken = this.generateAccessToken();
      const newRefreshToken = this.generateRefreshToken();
      const accessTokenExpiresAt = new Date(Date.now() + this.config.accessTokenExpiry);
      const refreshTokenExpiresAt = new Date(Date.now() + this.config.refreshTokenExpiry);

      // Update token record
      await db.query(`
        UPDATE oauth_access_tokens
        SET token = $1, expires_at = $2, refresh_token = $3, 
            refresh_token_expires_at = $4, updated_at = NOW()
        WHERE id = $5
      `, [
        newAccessToken, accessTokenExpiresAt, newRefreshToken,
        refreshTokenExpiresAt, existingToken.id
      ]);

      // Audit log
      await auditLog(existingToken.user_id, 'oauth_token_refreshed', {
        clientId
      });

      logger.info(`Access token refreshed for client ${clientId}, user ${existingToken.user_id}`);

      return {
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: Math.floor(this.config.accessTokenExpiry / 1000),
        refresh_token: newRefreshToken,
        scope: JSON.parse(existingToken.scopes).join(' ')
      };
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  // Token Validation and Management

  async validateAccessToken(accessToken) {
    try {
      const tokenData = await db.query(`
        SELECT oat.*, oa.application_name
        FROM oauth_access_tokens oat
        JOIN oauth_applications oa ON oat.client_id = oa.client_id
        WHERE oat.token = $1 AND oat.expires_at > NOW() AND oa.is_active = true
      `, [accessToken]);

      if (tokenData.rows.length === 0) {
        return null;
      }

      const token = tokenData.rows[0];

      return {
        userId: token.user_id,
        clientId: token.client_id,
        applicationName: token.application_name,
        scopes: JSON.parse(token.scopes),
        expiresAt: token.expires_at
      };
    } catch (error) {
      logger.error('Token validation failed:', error);
      return null;
    }
  }

  async revokeToken(token, tokenTypeHint = 'access_token') {
    try {
      let result;

      if (tokenTypeHint === 'refresh_token') {
        result = await db.query(`
          DELETE FROM oauth_access_tokens
          WHERE refresh_token = $1
          RETURNING user_id, client_id
        `, [token]);
      } else {
        result = await db.query(`
          DELETE FROM oauth_access_tokens
          WHERE token = $1
          RETURNING user_id, client_id
        `, [token]);
      }

      if (result.rows.length > 0) {
        const { user_id, client_id } = result.rows[0];
        
        // Audit log
        await auditLog(user_id, 'oauth_token_revoked', {
          clientId: client_id,
          tokenType: tokenTypeHint
        });

        logger.info(`OAuth token revoked for client ${client_id}, user ${user_id}`);
      }

      return {
        success: true,
        message: 'Token revoked successfully'
      };
    } catch (error) {
      logger.error('Token revocation failed:', error);
      throw error;
    }
  }

  async revokeAllTokensForApplication(applicationId) {
    try {
      const result = await db.query(`
        DELETE FROM oauth_access_tokens
        WHERE client_id IN (
          SELECT client_id FROM oauth_applications WHERE id = $1
        )
        RETURNING user_id, client_id
      `, [applicationId]);

      logger.info(`Revoked ${result.rowCount} tokens for application ${applicationId}`);

      return result.rowCount;
    } catch (error) {
      logger.error('Failed to revoke tokens for application:', error);
      throw error;
    }
  }

  async revokeAllTokensForUser(userId) {
    try {
      const result = await db.query(`
        DELETE FROM oauth_access_tokens
        WHERE user_id = $1
        RETURNING client_id
      `, [userId]);

      logger.info(`Revoked ${result.rowCount} tokens for user ${userId}`);

      return result.rowCount;
    } catch (error) {
      logger.error('Failed to revoke tokens for user:', error);
      throw error;
    }
  }

  // Utility Methods

  async getClientByClientId(clientId) {
    try {
      const result = await db.query(`
        SELECT * FROM oauth_applications WHERE client_id = $1
      `, [clientId]);

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Failed to get client by client ID:', error);
      return null;
    }
  }

  async authenticateClient(clientId, clientSecret) {
    try {
      const client = await this.getClientByClientId(clientId);
      if (!client || !client.is_active) {
        return null;
      }

      const isValidSecret = this.verifySecret(clientSecret, client.client_secret_hash);
      return isValidSecret ? client : null;
    } catch (error) {
      logger.error('Client authentication failed:', error);
      return null;
    }
  }

  generateClientId() {
    return 'client_' + crypto.randomBytes(16).toString('hex');
  }

  generateClientSecret() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateAuthorizationCode() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateAccessToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateRefreshToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  hashSecret(secret) {
    return crypto.createHash('sha256').update(secret).digest('hex');
  }

  verifySecret(secret, hash) {
    return this.hashSecret(secret) === hash;
  }

  isValidRedirectUri(uri) {
    try {
      const url = new URL(uri);
      // Allow http for localhost in development
      const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
      return url.protocol === 'https:' || (isLocalhost && url.protocol === 'http:');
    } catch {
      return false;
    }
  }

  validateScopes(scopes) {
    if (!Array.isArray(scopes)) return false;
    return scopes.every(scope => this.config.supportedScopes.includes(scope));
  }

  validateAndFilterScopes(requestedScopes) {
    return requestedScopes.filter(scope => this.config.supportedScopes.includes(scope));
  }

  // Analytics and Monitoring

  async getApplicationAnalytics(applicationId, userId, startDate, endDate) {
    try {
      const analytics = await db.query(`
        SELECT 
          DATE(oat.created_at) as date,
          COUNT(*) as tokens_issued,
          COUNT(DISTINCT oat.user_id) as unique_users
        FROM oauth_access_tokens oat
        JOIN oauth_applications oa ON oat.client_id = oa.client_id
        WHERE oa.id = $1 AND oa.user_id = $2
          AND oat.created_at >= $3 AND oat.created_at <= $4
        GROUP BY DATE(oat.created_at)
        ORDER BY date DESC
      `, [applicationId, userId, startDate, endDate]);

      const totalTokens = await db.query(`
        SELECT COUNT(*) as total
        FROM oauth_access_tokens oat
        JOIN oauth_applications oa ON oat.client_id = oa.client_id
        WHERE oa.id = $1 AND oa.user_id = $2
          AND oat.created_at >= $3 AND oat.created_at <= $4
      `, [applicationId, userId, startDate, endDate]);

      const activeTokens = await db.query(`
        SELECT COUNT(*) as active
        FROM oauth_access_tokens oat
        JOIN oauth_applications oa ON oat.client_id = oa.client_id
        WHERE oa.id = $1 AND oa.user_id = $2 AND oat.expires_at > NOW()
      `, [applicationId, userId]);

      return {
        dailyStats: analytics.rows,
        totalTokensIssued: parseInt(totalTokens.rows[0].total),
        activeTokens: parseInt(activeTokens.rows[0].active)
      };
    } catch (error) {
      logger.error('Failed to get application analytics:', error);
      throw error;
    }
  }

  // Cleanup expired tokens
  async cleanupExpiredTokens() {
    try {
      const result = await db.query(`
        DELETE FROM oauth_access_tokens
        WHERE expires_at < NOW()
      `);

      logger.info(`Cleaned up ${result.rowCount} expired OAuth tokens`);
      return result.rowCount;
    } catch (error) {
      logger.error('Failed to cleanup expired tokens:', error);
      throw error;
    }
  }

  // Get OAuth server info
  getServerInfo() {
    // Automatically detect production environment and use correct base URL
    const baseUrl = process.env.OAUTH_BASE_URL || 
                   process.env.OAUTH_ISSUER || 
                   (process.env.NODE_ENV === 'production' 
                     ? 'https://api.proofpix.com' 
                     : 'http://localhost:5000');

    return {
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/api/oauth/authorize`,
      token_endpoint: `${baseUrl}/api/oauth/token`,
      revocation_endpoint: `${baseUrl}/api/oauth/revoke`,
      userinfo_endpoint: `${baseUrl}/api/oauth/userinfo`,
      jwks_uri: `${baseUrl}/api/oauth/.well-known/jwks.json`,
      scopes_supported: this.config.supportedScopes,
      response_types_supported: this.config.supportedResponseTypes,
      grant_types_supported: this.config.supportedGrantTypes,
      token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
      code_challenge_methods_supported: ['S256'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256']
    };
  }

  /**
   * Create collaboration session with OAuth
   */
  async createCollaborationSession(accessToken, teamId = null) {
    try {
      // Validate access token
      const tokenData = await this.validateAccessToken(accessToken);
      if (!tokenData.valid) {
        throw new Error('Invalid access token');
      }

      // Check collaboration scopes
      const requiredScopes = ['collaboration:create', 'ephemeral:process'];
      if (!this.hasRequiredScopes(tokenData.scopes, requiredScopes)) {
        throw new Error('Insufficient scopes for collaboration mode');
      }

      // Create ephemeral session
      const ephemeralProcessingService = require('./ephemeralProcessingService');
      const session = await ephemeralProcessingService.createEphemeralSession(tokenData.userId, {
        teamId,
        oauthClientId: tokenData.clientId,
        scopes: tokenData.scopes
      });

      // Audit log
      await auditLog(tokenData.userId, 'oauth_collaboration_session_created', {
        sessionId: session.sessionId,
        teamId,
        clientId: tokenData.clientId,
        scopes: tokenData.scopes
      });

      return {
        success: true,
        session,
        tokenInfo: {
          clientId: tokenData.clientId,
          scopes: tokenData.scopes,
          expiresAt: tokenData.expiresAt
        }
      };
    } catch (error) {
      logger.error('Failed to create collaboration session:', error);
      throw error;
    }
  }

  /**
   * Validate team access for collaboration
   */
  async validateTeamAccess(accessToken, teamId) {
    try {
      const tokenData = await this.validateAccessToken(accessToken);
      if (!tokenData.valid) {
        return { valid: false, error: 'Invalid access token' };
      }

      // Check team scopes
      const requiredScopes = ['team:read'];
      if (!this.hasRequiredScopes(tokenData.scopes, requiredScopes)) {
        return { valid: false, error: 'Insufficient scopes for team access' };
      }

      // Validate team membership (would integrate with team service)
      // For now, return valid if user has team scopes
      return {
        valid: true,
        userId: tokenData.userId,
        teamId,
        scopes: tokenData.scopes
      };
    } catch (error) {
      logger.error('Failed to validate team access:', error);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Generate collaboration-specific authorization URL
   */
  generateCollaborationAuthUrl(clientId, redirectUri, teamId = null, state = null) {
    try {
      const collaborationScopes = [
        'collaboration:create',
        'collaboration:join',
        'ephemeral:process',
        'ephemeral:share',
        'team:read'
      ];

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: collaborationScopes.join(' '),
        state: state || this.generateState()
      });

      if (teamId) {
        params.append('team_id', teamId);
      }

      const baseUrl = process.env.OAUTH_BASE_URL || `${process.env.BACKEND_URL}/api/oauth`;
      return `${baseUrl}/authorize?${params.toString()}`;
    } catch (error) {
      logger.error('Failed to generate collaboration auth URL:', error);
      throw error;
    }
  }

  /**
   * Check if token has required scopes
   */
  hasRequiredScopes(tokenScopes, requiredScopes) {
    if (!Array.isArray(tokenScopes) || !Array.isArray(requiredScopes)) {
      return false;
    }

    return requiredScopes.every(scope => tokenScopes.includes(scope));
  }

  /**
   * Generate state parameter for OAuth flow
   */
  generateState() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Validate collaboration session access
   */
  async validateCollaborationAccess(accessToken, sessionId) {
    try {
      const tokenData = await this.validateAccessToken(accessToken);
      if (!tokenData.valid) {
        return { valid: false, error: 'Invalid access token' };
      }

      // Check ephemeral processing scopes
      const requiredScopes = ['ephemeral:process'];
      if (!this.hasRequiredScopes(tokenData.scopes, requiredScopes)) {
        return { valid: false, error: 'Insufficient scopes for ephemeral processing' };
      }

      // Validate session ownership
      const ephemeralProcessingService = require('./ephemeralProcessingService');
      const session = await ephemeralProcessingService.getSession(sessionId);
      
      if (!session || session.userId !== tokenData.userId) {
        return { valid: false, error: 'Session not found or access denied' };
      }

      return {
        valid: true,
        userId: tokenData.userId,
        sessionId,
        scopes: tokenData.scopes,
        session
      };
    } catch (error) {
      logger.error('Failed to validate collaboration access:', error);
      return { valid: false, error: error.message };
    }
  }
}

const oauthService = new OAuthService();

module.exports = oauthService; 