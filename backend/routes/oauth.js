const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { requireFeature } = require('../middleware/quota');
const oauthService = require('../services/oauthService');
const { body, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiting for OAuth operations
const oauthLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many OAuth requests, please try again later' }
});

const tokenLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 token requests per windowMs
  message: { error: 'Too many token requests, please try again later' }
});

// Validation middleware
const validateApplicationCreation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Application name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('redirectUris')
    .isArray({ min: 1 })
    .withMessage('Redirect URIs must be a non-empty array'),
  body('redirectUris.*')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Each redirect URI must be a valid URL'),
  body('scopes')
    .optional()
    .isArray()
    .withMessage('Scopes must be an array'),
  body('applicationType')
    .optional()
    .isIn(['web', 'native', 'spa'])
    .withMessage('Application type must be web, native, or spa')
];

const validateAuthorization = [
  query('client_id')
    .notEmpty()
    .withMessage('Client ID is required'),
  query('redirect_uri')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Redirect URI must be a valid URL'),
  query('response_type')
    .equals('code')
    .withMessage('Response type must be code'),
  query('scope')
    .optional()
    .isString()
    .withMessage('Scope must be a string'),
  query('state')
    .optional()
    .isString()
    .withMessage('State must be a string')
];

const validateTokenExchange = [
  body('grant_type')
    .isIn(['authorization_code', 'refresh_token'])
    .withMessage('Grant type must be authorization_code or refresh_token'),
  body('client_id')
    .notEmpty()
    .withMessage('Client ID is required'),
  body('client_secret')
    .notEmpty()
    .withMessage('Client secret is required')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// OAuth2 Server Discovery
router.get('/.well-known/oauth-authorization-server', (req, res) => {
  try {
    const serverInfo = oauthService.getServerInfo();
    res.json(serverInfo);
  } catch (error) {
    res.status(500).json({
      error: 'server_error',
      error_description: 'Failed to get server information'
    });
  }
});

// Application Management Routes

// Create OAuth application
router.post('/applications',
  authenticateToken,
  oauthLimit,
  requireFeature('oauth:manage'),
  validateApplicationCreation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, description, redirectUris, scopes, applicationType } = req.body;

      const applicationData = {
        name,
        description,
        redirectUris,
        scopes,
        applicationType
      };

      const result = await oauthService.createApplication(req.user.id, applicationData);

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        error: 'invalid_request',
        error_description: error.message
      });
    }
  }
);

// Get user's OAuth applications
router.get('/applications',
  authenticateToken,
  requireFeature('oauth:manage'),
  async (req, res) => {
    try {
      const applications = await oauthService.getUserApplications(req.user.id);

      res.json({
        success: true,
        applications
      });
    } catch (error) {
      res.status(500).json({
        error: 'server_error',
        error_description: error.message
      });
    }
  }
);

// Get specific application details
router.get('/applications/:applicationId',
  authenticateToken,
  requireFeature('oauth:manage'),
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      const applications = await oauthService.getUserApplications(req.user.id);
      const application = applications.find(app => app.id === parseInt(applicationId));

      if (!application) {
        return res.status(404).json({
          error: 'not_found',
          error_description: 'Application not found'
        });
      }

      res.json({
        success: true,
        application
      });
    } catch (error) {
      res.status(500).json({
        error: 'server_error',
        error_description: error.message
      });
    }
  }
);

// Update OAuth application
router.put('/applications/:applicationId',
  authenticateToken,
  oauthLimit,
  requireFeature('oauth:manage'),
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      const updates = req.body;

      const application = await oauthService.updateApplication(applicationId, req.user.id, updates);

      res.json({
        success: true,
        application
      });
    } catch (error) {
      res.status(400).json({
        error: 'invalid_request',
        error_description: error.message
      });
    }
  }
);

// Delete OAuth application
router.delete('/applications/:applicationId',
  authenticateToken,
  oauthLimit,
  requireFeature('oauth:manage'),
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      const result = await oauthService.deleteApplication(applicationId, req.user.id);

      res.json(result);
    } catch (error) {
      res.status(400).json({
        error: 'invalid_request',
        error_description: error.message
      });
    }
  }
);

// Get application analytics
router.get('/applications/:applicationId/analytics',
  authenticateToken,
  requireFeature('oauth:manage'),
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { startDate, endDate } = req.query;

      // Default to last 30 days if no dates provided
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const analytics = await oauthService.getApplicationAnalytics(applicationId, req.user.id, start, end);

      res.json({
        success: true,
        analytics
      });
    } catch (error) {
      res.status(500).json({
        error: 'server_error',
        error_description: error.message
      });
    }
  }
);

// OAuth2 Authorization Flow

// Authorization endpoint
router.get('/authorize',
  oauthLimit,
  validateAuthorization,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { client_id, redirect_uri, response_type, scope, state } = req.query;

      // Check if user is authenticated
      if (!req.user) {
        // Redirect to login with OAuth parameters
        const loginUrl = `/auth/login?` + new URLSearchParams({
          oauth_client_id: client_id,
          oauth_redirect_uri: redirect_uri,
          oauth_response_type: response_type,
          oauth_scope: scope || '',
          oauth_state: state || ''
        });

        return res.redirect(loginUrl);
      }

      // Get client application details
      const client = await oauthService.getClientByClientId(client_id);
      if (!client || !client.is_active) {
        return res.status(400).json({
          error: 'invalid_client',
          error_description: 'Invalid or inactive client'
        });
      }

      // Validate redirect URI
      const redirectUris = JSON.parse(client.redirect_uris);
      if (!redirectUris.includes(redirect_uri)) {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Invalid redirect URI'
        });
      }

      // Parse and validate scopes
      const requestedScopes = scope ? scope.split(' ') : [];
      const validatedScopes = oauthService.validateAndFilterScopes(requestedScopes);

      // For this implementation, we'll auto-approve the authorization
      // In a real implementation, you'd show a consent screen
      const authResult = await oauthService.authorize(
        client_id, redirect_uri, response_type, scope, state, req.user.id
      );

      // Redirect back to client with authorization code
      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set('code', authResult.authorizationCode);
      if (state) {
        redirectUrl.searchParams.set('state', state);
      }

      res.redirect(redirectUrl.toString());
    } catch (error) {
      // Redirect with error if possible
      if (req.query.redirect_uri) {
        try {
          const redirectUrl = new URL(req.query.redirect_uri);
          redirectUrl.searchParams.set('error', 'server_error');
          redirectUrl.searchParams.set('error_description', error.message);
          if (req.query.state) {
            redirectUrl.searchParams.set('state', req.query.state);
          }
          return res.redirect(redirectUrl.toString());
        } catch (urlError) {
          // Fall through to JSON error response
        }
      }

      res.status(400).json({
        error: 'server_error',
        error_description: error.message
      });
    }
  }
);

// Token endpoint
router.post('/token',
  tokenLimit,
  validateTokenExchange,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { grant_type, client_id, client_secret } = req.body;

      if (grant_type === 'authorization_code') {
        const { code, redirect_uri } = req.body;

        if (!code || !redirect_uri) {
          return res.status(400).json({
            error: 'invalid_request',
            error_description: 'Code and redirect_uri are required for authorization_code grant'
          });
        }

        const tokenResponse = await oauthService.exchangeCodeForToken(
          client_id, client_secret, code, redirect_uri, grant_type
        );

        res.json(tokenResponse);
      } else if (grant_type === 'refresh_token') {
        const { refresh_token } = req.body;

        if (!refresh_token) {
          return res.status(400).json({
            error: 'invalid_request',
            error_description: 'Refresh token is required for refresh_token grant'
          });
        }

        const tokenResponse = await oauthService.refreshAccessToken(
          client_id, client_secret, refresh_token
        );

        res.json(tokenResponse);
      } else {
        res.status(400).json({
          error: 'unsupported_grant_type',
          error_description: 'Grant type not supported'
        });
      }
    } catch (error) {
      let errorCode = 'server_error';
      
      if (error.message.includes('Invalid client')) {
        errorCode = 'invalid_client';
      } else if (error.message.includes('Invalid or expired')) {
        errorCode = 'invalid_grant';
      } else if (error.message.includes('Redirect URI mismatch')) {
        errorCode = 'invalid_grant';
      }

      res.status(400).json({
        error: errorCode,
        error_description: error.message
      });
    }
  }
);

// Token revocation endpoint
router.post('/revoke',
  tokenLimit,
  async (req, res) => {
    try {
      const { token, token_type_hint } = req.body;

      if (!token) {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Token is required'
        });
      }

      await oauthService.revokeToken(token, token_type_hint);

      // RFC 7009 specifies that revocation endpoint should return 200 OK
      res.status(200).json({});
    } catch (error) {
      res.status(400).json({
        error: 'invalid_request',
        error_description: error.message
      });
    }
  }
);

// Token introspection endpoint (RFC 7662)
router.post('/introspect',
  tokenLimit,
  async (req, res) => {
    try {
      const { token, token_type_hint } = req.body;

      if (!token) {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Token is required'
        });
      }

      const tokenInfo = await oauthService.validateAccessToken(token);

      if (!tokenInfo) {
        return res.json({
          active: false
        });
      }

      res.json({
        active: true,
        client_id: tokenInfo.clientId,
        username: tokenInfo.userId.toString(),
        scope: tokenInfo.scopes.join(' '),
        exp: Math.floor(tokenInfo.expiresAt.getTime() / 1000),
        iat: Math.floor((tokenInfo.expiresAt.getTime() - 3600000) / 1000), // Assuming 1 hour token
        sub: tokenInfo.userId.toString(),
        aud: tokenInfo.clientId
      });
    } catch (error) {
      res.status(500).json({
        error: 'server_error',
        error_description: error.message
      });
    }
  }
);

// OAuth2 Middleware for API authentication
const authenticateOAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'invalid_token',
        error_description: 'Bearer token required'
      });
    }

    const token = authHeader.substring(7);
    const tokenInfo = await oauthService.validateAccessToken(token);

    if (!tokenInfo) {
      return res.status(401).json({
        error: 'invalid_token',
        error_description: 'Invalid or expired token'
      });
    }

    // Add OAuth info to request
    req.oauth = {
      userId: tokenInfo.userId,
      clientId: tokenInfo.clientId,
      applicationName: tokenInfo.applicationName,
      scopes: tokenInfo.scopes
    };

    // Also set user for compatibility with existing middleware
    req.user = { id: tokenInfo.userId };

    next();
  } catch (error) {
    res.status(500).json({
      error: 'server_error',
      error_description: 'Token validation failed'
    });
  }
};

// OAuth scope validation middleware
const requireOAuthScope = (requiredScope) => {
  return (req, res, next) => {
    if (!req.oauth) {
      return res.status(401).json({
        error: 'invalid_token',
        error_description: 'OAuth token required'
      });
    }

    if (!req.oauth.scopes.includes(requiredScope)) {
      return res.status(403).json({
        error: 'insufficient_scope',
        error_description: `Scope '${requiredScope}' required`
      });
    }

    next();
  };
};

// User info endpoint (OpenID Connect style)
router.get('/userinfo',
  authenticateOAuth,
  requireOAuthScope('read:profile'),
  async (req, res) => {
    try {
      const db = require('../config/database');
      const user = await db.query(`
        SELECT id, email, first_name, last_name, created_at
        FROM users WHERE id = $1
      `, [req.oauth.userId]);

      if (user.rows.length === 0) {
        return res.status(404).json({
          error: 'not_found',
          error_description: 'User not found'
        });
      }

      const userData = user.rows[0];

      res.json({
        sub: userData.id.toString(),
        email: userData.email,
        given_name: userData.first_name,
        family_name: userData.last_name,
        email_verified: true, // Assuming email is verified
        updated_at: Math.floor(userData.created_at.getTime() / 1000)
      });
    } catch (error) {
      res.status(500).json({
        error: 'server_error',
        error_description: error.message
      });
    }
  }
);

// Consent screen (for manual approval flow)
router.get('/consent',
  authenticateToken,
  async (req, res) => {
    try {
      const { client_id, redirect_uri, scope, state } = req.query;

      // Get client details
      const client = await oauthService.getClientByClientId(client_id);
      if (!client) {
        return res.status(400).json({
          error: 'invalid_client',
          error_description: 'Invalid client'
        });
      }

      const requestedScopes = scope ? scope.split(' ') : [];
      const validatedScopes = oauthService.validateAndFilterScopes(requestedScopes);

      // In a real implementation, you'd render a consent screen
      // For this example, we'll return the consent data as JSON
      res.json({
        client: {
          name: client.application_name,
          description: client.description
        },
        scopes: validatedScopes,
        user: {
          id: req.user.id,
          email: req.user.email
        },
        authorizationUrl: `/oauth/authorize?${new URLSearchParams({
          client_id,
          redirect_uri,
          response_type: 'code',
          scope: validatedScopes.join(' '),
          state: state || ''
        })}`
      });
    } catch (error) {
      res.status(500).json({
        error: 'server_error',
        error_description: error.message
      });
    }
  }
);

// Collaboration Mode OAuth Routes

// Create collaboration session with OAuth
router.post('/collaboration/session',
  authenticateToken,
  oauthLimit,
  async (req, res) => {
    try {
      const { teamId } = req.body;
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'invalid_token',
          error_description: 'Bearer token required'
        });
      }

      const accessToken = authHeader.substring(7);
      const result = await oauthService.createCollaborationSession(accessToken, teamId);

      res.json(result);
    } catch (error) {
      res.status(400).json({
        error: 'invalid_request',
        error_description: error.message
      });
    }
  }
);

// Generate collaboration authorization URL
router.post('/collaboration/auth-url',
  authenticateToken,
  body('clientId').notEmpty().withMessage('Client ID is required'),
  body('redirectUri').isURL().withMessage('Valid redirect URI is required'),
  body('teamId').optional().isString(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { clientId, redirectUri, teamId, state } = req.body;
      
      const authUrl = oauthService.generateCollaborationAuthUrl(clientId, redirectUri, teamId, state);

      res.json({
        success: true,
        authUrl,
        scopes: [
          'collaboration:create',
          'collaboration:join',
          'ephemeral:process',
          'ephemeral:share',
          'team:read'
        ]
      });
    } catch (error) {
      res.status(400).json({
        error: 'invalid_request',
        error_description: error.message
      });
    }
  }
);

// Validate team access
router.post('/collaboration/validate-team',
  authenticateToken,
  body('teamId').notEmpty().withMessage('Team ID is required'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { teamId } = req.body;
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'invalid_token',
          error_description: 'Bearer token required'
        });
      }

      const accessToken = authHeader.substring(7);
      const result = await oauthService.validateTeamAccess(accessToken, teamId);

      if (!result.valid) {
        return res.status(403).json({
          error: 'insufficient_scope',
          error_description: result.error
        });
      }

      res.json({
        success: true,
        access: result
      });
    } catch (error) {
      res.status(400).json({
        error: 'invalid_request',
        error_description: error.message
      });
    }
  }
);

// Validate collaboration session access
router.post('/collaboration/validate-session',
  authenticateToken,
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { sessionId } = req.body;
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'invalid_token',
          error_description: 'Bearer token required'
        });
      }

      const accessToken = authHeader.substring(7);
      const result = await oauthService.validateCollaborationAccess(accessToken, sessionId);

      if (!result.valid) {
        return res.status(403).json({
          error: 'insufficient_scope',
          error_description: result.error
        });
      }

      res.json({
        success: true,
        access: result
      });
    } catch (error) {
      res.status(400).json({
        error: 'invalid_request',
        error_description: error.message
      });
    }
  }
);

// Get collaboration scopes information
router.get('/collaboration/scopes',
  async (req, res) => {
    try {
      const collaborationScopes = {
        'collaboration:create': 'Create collaboration sessions',
        'collaboration:join': 'Join collaboration sessions',
        'collaboration:manage': 'Manage collaboration settings',
        'team:read': 'Read team information',
        'team:write': 'Modify team data',
        'team:manage': 'Manage team members and settings',
        'ephemeral:process': 'Process files ephemerally',
        'ephemeral:share': 'Create ephemeral share links'
      };

      res.json({
        success: true,
        scopes: collaborationScopes,
        description: 'Available scopes for collaboration mode'
      });
    } catch (error) {
      res.status(500).json({
        error: 'server_error',
        error_description: error.message
      });
    }
  }
);

// Export middleware for use in other routes
router.authenticateOAuth = authenticateOAuth;
router.requireOAuthScope = requireOAuthScope;

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('OAuth route error:', error);
  res.status(500).json({
    error: 'server_error',
    error_description: 'Internal server error'
  });
});

module.exports = router; 