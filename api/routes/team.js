const express = require('express');
const { authenticateApiKey, requirePermission, createUser, generateApiKey } = require('../middleware/auth');
const router = express.Router();

// In-memory team storage (replace with database in production)
const teams = new Map();

// Initialize demo team data
function initializeTeamData() {
  const demoTeam = {
    id: 'team_enterprise_1',
    name: 'Enterprise Demo Team',
    ownerId: 'user_enterprise_1',
    members: [
      {
        id: 'user_enterprise_1',
        email: 'enterprise@example.com',
        role: 'owner',
        permissions: ['api_access', 'custom_fields', 'team_management', 'white_label'],
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }
    ],
    settings: {
      maxMembers: 50,
      allowApiAccess: true,
      allowCustomFields: true,
      defaultPermissions: ['api_access']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  teams.set(demoTeam.id, demoTeam);
}

initializeTeamData();

// Get team information
router.get('/',
  authenticateApiKey,
  requirePermission('team_management'),
  async (req, res) => {
    try {
      const teamId = req.user.teamId;
      
      if (!teamId) {
        return res.status(404).json({
          error: 'No team found',
          message: 'User is not associated with any team'
        });
      }
      
      const team = teams.get(teamId);
      
      if (!team) {
        return res.status(404).json({
          error: 'Team not found',
          message: `Team with ID '${teamId}' not found`
        });
      }
      
      res.json({
        success: true,
        data: {
          team: {
            id: team.id,
            name: team.name,
            memberCount: team.members.length,
            maxMembers: team.settings.maxMembers,
            settings: team.settings,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt
          },
          members: team.members.map(member => ({
            id: member.id,
            email: member.email,
            role: member.role,
            permissions: member.permissions,
            joinedAt: member.joinedAt,
            lastActive: member.lastActive
          })),
          userRole: req.user.role || 'member'
        }
      });
      
    } catch (error) {
      console.error('Get team error:', error);
      res.status(500).json({
        error: 'Failed to retrieve team information',
        message: error.message
      });
    }
  }
);

// Invite team member
router.post('/invite',
  authenticateApiKey,
  requirePermission('team_management'),
  async (req, res) => {
    try {
      const { email, role, permissions } = req.body;
      
      if (!email) {
        return res.status(400).json({
          error: 'Missing email',
          message: 'Email is required to invite a team member'
        });
      }
      
      const teamId = req.user.teamId;
      const team = teams.get(teamId);
      
      if (!team) {
        return res.status(404).json({
          error: 'Team not found',
          message: 'User team not found'
        });
      }
      
      // Check if user has permission to invite (owner or admin)
      const currentMember = team.members.find(m => m.id === req.user.id);
      if (!currentMember || !['owner', 'admin'].includes(currentMember.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Only team owners and admins can invite members'
        });
      }
      
      // Check if team has reached max members
      if (team.members.length >= team.settings.maxMembers) {
        return res.status(403).json({
          error: 'Team member limit reached',
          message: `Team has reached maximum of ${team.settings.maxMembers} members`
        });
      }
      
      // Check if email already exists in team
      if (team.members.some(member => member.email === email)) {
        return res.status(409).json({
          error: 'Member already exists',
          message: `User with email '${email}' is already a team member`
        });
      }
      
      // Validate role
      const allowedRoles = ['member', 'admin'];
      const memberRole = role || 'member';
      
      if (!allowedRoles.includes(memberRole)) {
        return res.status(400).json({
          error: 'Invalid role',
          message: `Role must be one of: ${allowedRoles.join(', ')}`
        });
      }
      
      // Set permissions based on role and team settings
      const memberPermissions = permissions || [...team.settings.defaultPermissions];
      
      if (memberRole === 'admin') {
        memberPermissions.push('team_management');
      }
      
      // Create new user account
      const newUser = createUser({
        email,
        plan: 'enterprise',
        teamId: teamId,
        role: memberRole,
        permissions: [...new Set(memberPermissions)], // Remove duplicates
        customFields: []
      });
      
      // Add to team
      const newMember = {
        id: newUser.id,
        email: email,
        role: memberRole,
        permissions: newUser.permissions,
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        apiKey: newUser.apiKey
      };
      
      team.members.push(newMember);
      team.updatedAt = new Date().toISOString();
      
      res.status(201).json({
        success: true,
        data: {
          member: {
            id: newMember.id,
            email: newMember.email,
            role: newMember.role,
            permissions: newMember.permissions,
            joinedAt: newMember.joinedAt
          },
          apiKey: newUser.apiKey,
          message: 'Team member invited successfully'
        }
      });
      
    } catch (error) {
      console.error('Invite team member error:', error);
      res.status(500).json({
        error: 'Failed to invite team member',
        message: error.message
      });
    }
  }
);

// Update team member
router.put('/members/:memberId',
  authenticateApiKey,
  requirePermission('team_management'),
  async (req, res) => {
    try {
      const { memberId } = req.params;
      const { role, permissions } = req.body;
      
      const teamId = req.user.teamId;
      const team = teams.get(teamId);
      
      if (!team) {
        return res.status(404).json({
          error: 'Team not found',
          message: 'User team not found'
        });
      }
      
      // Check permissions
      const currentMember = team.members.find(m => m.id === req.user.id);
      if (!currentMember || !['owner', 'admin'].includes(currentMember.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Only team owners and admins can update members'
        });
      }
      
      // Find member to update
      const memberIndex = team.members.findIndex(m => m.id === memberId);
      
      if (memberIndex === -1) {
        return res.status(404).json({
          error: 'Member not found',
          message: `Team member with ID '${memberId}' not found`
        });
      }
      
      const member = team.members[memberIndex];
      
      // Prevent owner from being modified by non-owners
      if (member.role === 'owner' && currentMember.role !== 'owner') {
        return res.status(403).json({
          error: 'Cannot modify owner',
          message: 'Only the team owner can modify owner permissions'
        });
      }
      
      // Update member
      if (role) {
        const allowedRoles = ['member', 'admin'];
        if (!allowedRoles.includes(role)) {
          return res.status(400).json({
            error: 'Invalid role',
            message: `Role must be one of: ${allowedRoles.join(', ')}`
          });
        }
        member.role = role;
      }
      
      if (permissions) {
        member.permissions = permissions;
      }
      
      team.updatedAt = new Date().toISOString();
      
      res.json({
        success: true,
        data: {
          member: {
            id: member.id,
            email: member.email,
            role: member.role,
            permissions: member.permissions,
            joinedAt: member.joinedAt,
            lastActive: member.lastActive
          },
          message: 'Team member updated successfully'
        }
      });
      
    } catch (error) {
      console.error('Update team member error:', error);
      res.status(500).json({
        error: 'Failed to update team member',
        message: error.message
      });
    }
  }
);

// Remove team member
router.delete('/members/:memberId',
  authenticateApiKey,
  requirePermission('team_management'),
  async (req, res) => {
    try {
      const { memberId } = req.params;
      
      const teamId = req.user.teamId;
      const team = teams.get(teamId);
      
      if (!team) {
        return res.status(404).json({
          error: 'Team not found',
          message: 'User team not found'
        });
      }
      
      // Check permissions
      const currentMember = team.members.find(m => m.id === req.user.id);
      if (!currentMember || !['owner', 'admin'].includes(currentMember.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Only team owners and admins can remove members'
        });
      }
      
      // Find member to remove
      const memberIndex = team.members.findIndex(m => m.id === memberId);
      
      if (memberIndex === -1) {
        return res.status(404).json({
          error: 'Member not found',
          message: `Team member with ID '${memberId}' not found`
        });
      }
      
      const member = team.members[memberIndex];
      
      // Prevent owner from being removed
      if (member.role === 'owner') {
        return res.status(403).json({
          error: 'Cannot remove owner',
          message: 'Team owner cannot be removed'
        });
      }
      
      // Remove member
      team.members.splice(memberIndex, 1);
      team.updatedAt = new Date().toISOString();
      
      // Revoke API key (in production, this would disable the user's access)
      // revokeApiKey(member.apiKey);
      
      res.json({
        success: true,
        data: {
          removedMember: {
            id: member.id,
            email: member.email,
            role: member.role
          },
          message: 'Team member removed successfully'
        }
      });
      
    } catch (error) {
      console.error('Remove team member error:', error);
      res.status(500).json({
        error: 'Failed to remove team member',
        message: error.message
      });
    }
  }
);

// Update team settings
router.put('/settings',
  authenticateApiKey,
  requirePermission('team_management'),
  async (req, res) => {
    try {
      const { name, maxMembers, allowApiAccess, allowCustomFields, defaultPermissions } = req.body;
      
      const teamId = req.user.teamId;
      const team = teams.get(teamId);
      
      if (!team) {
        return res.status(404).json({
          error: 'Team not found',
          message: 'User team not found'
        });
      }
      
      // Check if user is owner
      const currentMember = team.members.find(m => m.id === req.user.id);
      if (!currentMember || currentMember.role !== 'owner') {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Only team owner can update team settings'
        });
      }
      
      // Update settings
      if (name) team.name = name.trim();
      if (maxMembers) team.settings.maxMembers = Math.max(1, Math.min(100, maxMembers));
      if (allowApiAccess !== undefined) team.settings.allowApiAccess = allowApiAccess;
      if (allowCustomFields !== undefined) team.settings.allowCustomFields = allowCustomFields;
      if (defaultPermissions) team.settings.defaultPermissions = defaultPermissions;
      
      team.updatedAt = new Date().toISOString();
      
      res.json({
        success: true,
        data: {
          team: {
            id: team.id,
            name: team.name,
            settings: team.settings,
            updatedAt: team.updatedAt
          },
          message: 'Team settings updated successfully'
        }
      });
      
    } catch (error) {
      console.error('Update team settings error:', error);
      res.status(500).json({
        error: 'Failed to update team settings',
        message: error.message
      });
    }
  }
);

// Get team usage statistics
router.get('/usage',
  authenticateApiKey,
  requirePermission('team_management'),
  async (req, res) => {
    try {
      const teamId = req.user.teamId;
      const team = teams.get(teamId);
      
      if (!team) {
        return res.status(404).json({
          error: 'Team not found',
          message: 'User team not found'
        });
      }
      
      // Calculate team usage (in production, this would query the database)
      const { users } = require('../middleware/auth');
      const teamUsage = {
        totalRequests: 0,
        totalFiles: 0,
        memberUsage: []
      };
      
      team.members.forEach(member => {
        const user = users.get(member.id);
        if (user && user.usage) {
          teamUsage.totalRequests += user.usage.requests;
          teamUsage.totalFiles += user.usage.files;
          teamUsage.memberUsage.push({
            id: member.id,
            email: member.email,
            requests: user.usage.requests,
            files: user.usage.files,
            lastActive: member.lastActive
          });
        }
      });
      
      res.json({
        success: true,
        data: {
          team: {
            id: team.id,
            name: team.name,
            memberCount: team.members.length
          },
          usage: teamUsage,
          period: 'current_day'
        }
      });
      
    } catch (error) {
      console.error('Get team usage error:', error);
      res.status(500).json({
        error: 'Failed to retrieve team usage',
        message: error.message
      });
    }
  }
);

module.exports = router; 