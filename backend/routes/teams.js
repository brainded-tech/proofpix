/**
 * Team Management Routes
 * Handles team collaboration features for hybrid architecture
 */

const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { authenticateToken } = require('../middleware/auth');
const { auditLog } = require('../services/auditService');
const { logger } = require('../config/database');
const { query: dbQuery } = require('../config/database');

const router = express.Router();

// Rate limiting for team operations
const teamLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many team requests, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all team routes
router.use(teamLimit);

// Validation middleware
const validateTeamCreation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Team name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
  body('settings.maxMembers')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max members must be between 1 and 100'),
  body('settings.allowGuestAccess')
    .optional()
    .isBoolean()
    .withMessage('Allow guest access must be a boolean'),
  body('settings.requireApproval')
    .optional()
    .isBoolean()
    .withMessage('Require approval must be a boolean')
];

const validateMemberInvitation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('role')
    .isIn(['admin', 'member', 'viewer'])
    .withMessage('Role must be admin, member, or viewer'),
  body('permissions')
    .optional()
    .isObject()
    .withMessage('Permissions must be an object')
];

const validateMemberUpdate = [
  body('role')
    .optional()
    .isIn(['admin', 'member', 'viewer'])
    .withMessage('Role must be admin, member, or viewer'),
  body('permissions')
    .optional()
    .isObject()
    .withMessage('Permissions must be an object')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Helper function to check team ownership/admin access
const checkTeamAccess = async (userId, teamId, requiredRole = 'member') => {
  try {
    const result = await dbQuery(`
      SELECT tm.role, tm.permissions, t.owner_id
      FROM team_members tm
      JOIN teams t ON tm.team_id = t.id
      WHERE tm.user_id = $1 AND tm.team_id = $2 AND tm.status = 'active'
    `, [userId, teamId]);

    if (result.rows.length === 0) {
      return { hasAccess: false, error: 'Not a member of this team' };
    }

    const member = result.rows[0];
    const isOwner = member.owner_id === userId;
    const role = member.role;

    // Check role hierarchy: owner > admin > member > viewer
    const roleHierarchy = { owner: 4, admin: 3, member: 2, viewer: 1 };
    const userLevel = isOwner ? 4 : roleHierarchy[role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return { hasAccess: false, error: 'Insufficient permissions' };
    }

    return {
      hasAccess: true,
      role: isOwner ? 'owner' : role,
      permissions: member.permissions,
      isOwner
    };
  } catch (error) {
    logger.error('Error checking team access:', error);
    return { hasAccess: false, error: 'Access check failed' };
  }
};

/**
 * POST /api/teams
 * Create a new team
 */
router.post('/',
  authenticateToken,
  validateTeamCreation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, description, settings = {} } = req.body;
      const userId = req.user.id;

      // Default settings
      const defaultSettings = {
        maxMembers: 10,
        allowGuestAccess: false,
        requireApproval: true,
        sessionTimeout: 24,
        maxFileSize: 50 * 1024 * 1024,
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'application/pdf'],
        retentionPeriod: 24,
        encryptionLevel: 'enhanced'
      };

      const teamSettings = { ...defaultSettings, ...settings };

      // Create team
      const teamResult = await dbQuery(`
        INSERT INTO teams (name, description, owner_id, settings, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, name, description, owner_id, settings, created_at, updated_at
      `, [name, description, userId, JSON.stringify(teamSettings)]);

      const team = teamResult.rows[0];

      // Add owner as team member
      await dbQuery(`
        INSERT INTO team_members (team_id, user_id, role, status, permissions, joined_at)
        VALUES ($1, $2, 'owner', 'active', $3, NOW())
      `, [team.id, userId, JSON.stringify({
        canUpload: true,
        canProcess: true,
        canShare: true,
        canManageMembers: true,
        canManageSettings: true,
        canViewAnalytics: true,
        canExport: true
      })]);

      // Audit log
      await auditLog(userId, 'team_created', {
        teamId: team.id,
        teamName: name,
        settings: teamSettings
      });

      res.status(201).json({
        success: true,
        data: {
          ...team,
          settings: JSON.parse(team.settings)
        },
        message: 'Team created successfully'
      });

    } catch (error) {
      logger.error('Failed to create team:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create team',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/teams
 * Get user's teams
 */
router.get('/',
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const result = await dbQuery(`
        SELECT 
          t.id, t.name, t.description, t.owner_id, t.settings, t.created_at, t.updated_at,
          tm.role, tm.permissions, tm.joined_at,
          COUNT(tm2.id) as member_count
        FROM teams t
        JOIN team_members tm ON t.id = tm.team_id
        LEFT JOIN team_members tm2 ON t.id = tm2.team_id AND tm2.status = 'active'
        WHERE tm.user_id = $1 AND tm.status = 'active'
        GROUP BY t.id, tm.role, tm.permissions, tm.joined_at
        ORDER BY t.created_at DESC
      `, [userId]);

      const teams = result.rows.map(team => ({
        ...team,
        settings: JSON.parse(team.settings),
        permissions: JSON.parse(team.permissions),
        isOwner: team.owner_id === userId
      }));

      res.json({
        success: true,
        data: teams,
        message: 'Teams retrieved successfully'
      });

    } catch (error) {
      logger.error('Failed to get teams:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get teams',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/teams/:teamId
 * Get team details
 */
router.get('/:teamId',
  authenticateToken,
  param('teamId').isInt().withMessage('Team ID must be an integer'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { teamId } = req.params;
      const userId = req.user.id;

      // Check access
      const access = await checkTeamAccess(userId, teamId);
      if (!access.hasAccess) {
        return res.status(403).json({
          success: false,
          error: access.error
        });
      }

      // Get team details
      const teamResult = await dbQuery(`
        SELECT id, name, description, owner_id, settings, created_at, updated_at
        FROM teams
        WHERE id = $1
      `, [teamId]);

      if (teamResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Team not found'
        });
      }

      // Get team members
      const membersResult = await dbQuery(`
        SELECT 
          tm.user_id, tm.role, tm.status, tm.permissions, tm.joined_at, tm.last_active,
          u.email, u.name
        FROM team_members tm
        JOIN users u ON tm.user_id = u.id
        WHERE tm.team_id = $1
        ORDER BY tm.joined_at ASC
      `, [teamId]);

      const team = teamResult.rows[0];
      const members = membersResult.rows.map(member => ({
        ...member,
        permissions: JSON.parse(member.permissions)
      }));

      res.json({
        success: true,
        data: {
          ...team,
          settings: JSON.parse(team.settings),
          members,
          stats: {
            totalMembers: members.length,
            activeMembers: members.filter(m => m.status === 'active').length
          }
        },
        message: 'Team details retrieved successfully'
      });

    } catch (error) {
      logger.error('Failed to get team details:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get team details',
        message: error.message
      });
    }
  }
);

/**
 * PUT /api/teams/:teamId/settings
 * Update team settings
 */
router.put('/:teamId/settings',
  authenticateToken,
  param('teamId').isInt().withMessage('Team ID must be an integer'),
  body('settings').isObject().withMessage('Settings must be an object'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { teamId } = req.params;
      const { settings } = req.body;
      const userId = req.user.id;

      // Check admin access
      const access = await checkTeamAccess(userId, teamId, 'admin');
      if (!access.hasAccess) {
        return res.status(403).json({
          success: false,
          error: access.error
        });
      }

      // Get current settings
      const currentResult = await dbQuery(`
        SELECT settings FROM teams WHERE id = $1
      `, [teamId]);

      const currentSettings = JSON.parse(currentResult.rows[0].settings);
      const updatedSettings = { ...currentSettings, ...settings };

      // Update team settings
      const result = await dbQuery(`
        UPDATE teams 
        SET settings = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, name, description, owner_id, settings, created_at, updated_at
      `, [JSON.stringify(updatedSettings), teamId]);

      const team = result.rows[0];

      // Audit log
      await auditLog(userId, 'team_settings_updated', {
        teamId,
        updatedSettings: settings
      });

      res.json({
        success: true,
        data: {
          ...team,
          settings: JSON.parse(team.settings)
        },
        message: 'Team settings updated successfully'
      });

    } catch (error) {
      logger.error('Failed to update team settings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update team settings',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/teams/:teamId/invitations
 * Invite member to team
 */
router.post('/:teamId/invitations',
  authenticateToken,
  param('teamId').isInt().withMessage('Team ID must be an integer'),
  validateMemberInvitation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { teamId } = req.params;
      const { email, role, permissions = {} } = req.body;
      const userId = req.user.id;

      // Check admin access
      const access = await checkTeamAccess(userId, teamId, 'admin');
      if (!access.hasAccess) {
        return res.status(403).json({
          success: false,
          error: access.error
        });
      }

      // Check if user exists
      const userResult = await dbQuery(`
        SELECT id, email, name FROM users WHERE email = $1
      `, [email]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const invitedUser = userResult.rows[0];

      // Check if already a member
      const memberCheck = await dbQuery(`
        SELECT id FROM team_members 
        WHERE team_id = $1 AND user_id = $2
      `, [teamId, invitedUser.id]);

      if (memberCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'User is already a member of this team'
        });
      }

      // Default permissions based on role
      const defaultPermissions = {
        admin: {
          canUpload: true,
          canProcess: true,
          canShare: true,
          canManageMembers: true,
          canManageSettings: true,
          canViewAnalytics: true,
          canExport: true
        },
        member: {
          canUpload: true,
          canProcess: true,
          canShare: true,
          canManageMembers: false,
          canManageSettings: false,
          canViewAnalytics: true,
          canExport: true
        },
        viewer: {
          canUpload: false,
          canProcess: false,
          canShare: false,
          canManageMembers: false,
          canManageSettings: false,
          canViewAnalytics: true,
          canExport: false
        }
      };

      const memberPermissions = { ...defaultPermissions[role], ...permissions };

      // Generate invitation token
      const crypto = require('crypto');
      const invitationToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Create invitation
      const invitationResult = await dbQuery(`
        INSERT INTO team_invitations (
          team_id, user_id, invited_by, email, role, permissions, 
          token, expires_at, status, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
        RETURNING id, token, expires_at
      `, [
        teamId, invitedUser.id, userId, email, role, 
        JSON.stringify(memberPermissions), invitationToken, expiresAt
      ]);

      const invitation = invitationResult.rows[0];

      // Audit log
      await auditLog(userId, 'team_member_invited', {
        teamId,
        invitedUserId: invitedUser.id,
        invitedEmail: email,
        role,
        invitationId: invitation.id
      });

      res.status(201).json({
        success: true,
        data: {
          id: invitation.id,
          teamId: parseInt(teamId),
          email,
          role,
          permissions: memberPermissions,
          invitedBy: userId,
          token: invitation.token,
          expiresAt: invitation.expires_at,
          status: 'pending'
        },
        message: 'Team invitation created successfully'
      });

    } catch (error) {
      logger.error('Failed to invite team member:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to invite team member',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/teams/invitations/:token/accept
 * Accept team invitation
 */
router.post('/invitations/:token/accept',
  authenticateToken,
  param('token').isLength({ min: 32, max: 64 }).withMessage('Invalid invitation token'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { token } = req.params;
      const userId = req.user.id;

      // Get invitation
      const invitationResult = await dbQuery(`
        SELECT ti.*, t.name as team_name
        FROM team_invitations ti
        JOIN teams t ON ti.team_id = t.id
        WHERE ti.token = $1 AND ti.user_id = $2 AND ti.status = 'pending' AND ti.expires_at > NOW()
      `, [token, userId]);

      if (invitationResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Invalid or expired invitation'
        });
      }

      const invitation = invitationResult.rows[0];

      // Add user to team
      await dbQuery(`
        INSERT INTO team_members (team_id, user_id, role, status, permissions, joined_at)
        VALUES ($1, $2, $3, 'active', $4, NOW())
      `, [
        invitation.team_id, userId, invitation.role, invitation.permissions
      ]);

      // Update invitation status
      await dbQuery(`
        UPDATE team_invitations 
        SET status = 'accepted', updated_at = NOW()
        WHERE id = $1
      `, [invitation.id]);

      // Get team details
      const teamResult = await dbQuery(`
        SELECT id, name, description, owner_id, settings, created_at, updated_at
        FROM teams WHERE id = $1
      `, [invitation.team_id]);

      const team = teamResult.rows[0];

      // Audit log
      await auditLog(userId, 'team_invitation_accepted', {
        teamId: invitation.team_id,
        invitationId: invitation.id,
        role: invitation.role
      });

      res.json({
        success: true,
        data: {
          ...team,
          settings: JSON.parse(team.settings),
          userRole: invitation.role,
          userPermissions: JSON.parse(invitation.permissions)
        },
        message: 'Team invitation accepted successfully'
      });

    } catch (error) {
      logger.error('Failed to accept team invitation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to accept team invitation',
        message: error.message
      });
    }
  }
);

/**
 * PUT /api/teams/:teamId/members/:memberId
 * Update team member
 */
router.put('/:teamId/members/:memberId',
  authenticateToken,
  param('teamId').isInt().withMessage('Team ID must be an integer'),
  param('memberId').isInt().withMessage('Member ID must be an integer'),
  validateMemberUpdate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { teamId, memberId } = req.params;
      const { role, permissions } = req.body;
      const userId = req.user.id;

      // Check admin access
      const access = await checkTeamAccess(userId, teamId, 'admin');
      if (!access.hasAccess) {
        return res.status(403).json({
          success: false,
          error: access.error
        });
      }

      // Cannot modify owner
      const ownerCheck = await dbQuery(`
        SELECT owner_id FROM teams WHERE id = $1
      `, [teamId]);

      if (ownerCheck.rows[0].owner_id === parseInt(memberId)) {
        return res.status(400).json({
          success: false,
          error: 'Cannot modify team owner'
        });
      }

      // Build update query
      const updates = [];
      const values = [];
      let paramCount = 0;

      if (role) {
        updates.push(`role = $${++paramCount}`);
        values.push(role);
      }

      if (permissions) {
        updates.push(`permissions = $${++paramCount}`);
        values.push(JSON.stringify(permissions));
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No updates provided'
        });
      }

      updates.push(`updated_at = NOW()`);
      values.push(teamId, memberId);

      // Update member
      const result = await dbQuery(`
        UPDATE team_members 
        SET ${updates.join(', ')}
        WHERE team_id = $${paramCount + 1} AND user_id = $${paramCount + 2}
        RETURNING user_id, role, permissions, status, joined_at, last_active
      `, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Team member not found'
        });
      }

      const member = result.rows[0];

      // Audit log
      await auditLog(userId, 'team_member_updated', {
        teamId,
        memberId,
        updates: { role, permissions }
      });

      res.json({
        success: true,
        data: {
          ...member,
          permissions: JSON.parse(member.permissions)
        },
        message: 'Team member updated successfully'
      });

    } catch (error) {
      logger.error('Failed to update team member:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update team member',
        message: error.message
      });
    }
  }
);

/**
 * DELETE /api/teams/:teamId/members/:memberId
 * Remove team member
 */
router.delete('/:teamId/members/:memberId',
  authenticateToken,
  param('teamId').isInt().withMessage('Team ID must be an integer'),
  param('memberId').isInt().withMessage('Member ID must be an integer'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { teamId, memberId } = req.params;
      const userId = req.user.id;

      // Check admin access
      const access = await checkTeamAccess(userId, teamId, 'admin');
      if (!access.hasAccess) {
        return res.status(403).json({
          success: false,
          error: access.error
        });
      }

      // Cannot remove owner
      const ownerCheck = await dbQuery(`
        SELECT owner_id FROM teams WHERE id = $1
      `, [teamId]);

      if (ownerCheck.rows[0].owner_id === parseInt(memberId)) {
        return res.status(400).json({
          success: false,
          error: 'Cannot remove team owner'
        });
      }

      // Remove member
      const result = await dbQuery(`
        DELETE FROM team_members 
        WHERE team_id = $1 AND user_id = $2
        RETURNING user_id
      `, [teamId, memberId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Team member not found'
        });
      }

      // Audit log
      await auditLog(userId, 'team_member_removed', {
        teamId,
        removedMemberId: memberId
      });

      res.json({
        success: true,
        message: 'Team member removed successfully'
      });

    } catch (error) {
      logger.error('Failed to remove team member:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove team member',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/teams/:teamId/leave
 * Leave team
 */
router.post('/:teamId/leave',
  authenticateToken,
  param('teamId').isInt().withMessage('Team ID must be an integer'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { teamId } = req.params;
      const userId = req.user.id;

      // Check if user is team owner
      const ownerCheck = await dbQuery(`
        SELECT owner_id FROM teams WHERE id = $1
      `, [teamId]);

      if (ownerCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Team not found'
        });
      }

      if (ownerCheck.rows[0].owner_id === userId) {
        return res.status(400).json({
          success: false,
          error: 'Team owner cannot leave team. Transfer ownership or delete team instead.'
        });
      }

      // Remove user from team
      const result = await dbQuery(`
        DELETE FROM team_members 
        WHERE team_id = $1 AND user_id = $2
        RETURNING user_id
      `, [teamId, userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Not a member of this team'
        });
      }

      // Audit log
      await auditLog(userId, 'team_left', {
        teamId
      });

      res.json({
        success: true,
        message: 'Left team successfully'
      });

    } catch (error) {
      logger.error('Failed to leave team:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to leave team',
        message: error.message
      });
    }
  }
);

/**
 * DELETE /api/teams/:teamId
 * Delete team (owner only)
 */
router.delete('/:teamId',
  authenticateToken,
  param('teamId').isInt().withMessage('Team ID must be an integer'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { teamId } = req.params;
      const userId = req.user.id;

      // Check if user is team owner
      const ownerCheck = await dbQuery(`
        SELECT owner_id, name FROM teams WHERE id = $1
      `, [teamId]);

      if (ownerCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Team not found'
        });
      }

      if (ownerCheck.rows[0].owner_id !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Only team owner can delete team'
        });
      }

      const teamName = ownerCheck.rows[0].name;

      // Delete team (cascade will handle members and invitations)
      await dbQuery(`DELETE FROM teams WHERE id = $1`, [teamId]);

      // Audit log
      await auditLog(userId, 'team_deleted', {
        teamId,
        teamName
      });

      res.json({
        success: true,
        message: 'Team deleted successfully'
      });

    } catch (error) {
      logger.error('Failed to delete team:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete team',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/teams/:teamId/analytics
 * Get team analytics
 */
router.get('/:teamId/analytics',
  authenticateToken,
  param('teamId').isInt().withMessage('Team ID must be an integer'),
  query('timeframe').optional().isIn(['24h', '7d', '30d']).withMessage('Invalid timeframe'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { teamId } = req.params;
      const { timeframe = '7d' } = req.query;
      const userId = req.user.id;

      // Check access
      const access = await checkTeamAccess(userId, teamId);
      if (!access.hasAccess) {
        return res.status(403).json({
          success: false,
          error: access.error
        });
      }

      // Check analytics permission
      if (!access.permissions.canViewAnalytics) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions to view analytics'
        });
      }

      // Calculate time range
      const timeRanges = {
        '24h': "NOW() - INTERVAL '24 hours'",
        '7d': "NOW() - INTERVAL '7 days'",
        '30d': "NOW() - INTERVAL '30 days'"
      };

      const timeCondition = timeRanges[timeframe];

      // Get analytics data (placeholder - would integrate with actual analytics)
      const analytics = {
        timeframe,
        teamId: parseInt(teamId),
        members: {
          total: 0,
          active: 0,
          newThisPeriod: 0
        },
        sessions: {
          total: 0,
          ephemeral: 0,
          averageDuration: 0
        },
        files: {
          processed: 0,
          shared: 0,
          totalSize: 0
        },
        activity: {
          uploads: 0,
          downloads: 0,
          shares: 0
        }
      };

      res.json({
        success: true,
        data: analytics,
        message: 'Team analytics retrieved successfully'
      });

    } catch (error) {
      logger.error('Failed to get team analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get team analytics',
        message: error.message
      });
    }
  }
);

module.exports = router; 