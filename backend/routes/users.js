/**
 * User Management Routes
 * Provides API endpoints for user profile management, account settings, and administration
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireSubscription } = require('../middleware/auth');
const { auditLog } = require('../services/auditService');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');

// Rate limiting for user endpoints
const userRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many user requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all user routes
router.use(userRateLimit);

// Validation middleware
const validateErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * GET /api/users/profile
 * Get current user profile
 */
router.get('/profile', requireAuth, async (req, res) => {
  try {
    // Get user from database (this would typically use a User model)
    const user = {
      id: req.user.userId,
      email: req.user.email,
      firstName: req.user.firstName || '',
      lastName: req.user.lastName || '',
      company: req.user.company || '',
      jobTitle: req.user.jobTitle || '',
      phone: req.user.phone || '',
      subscriptionTier: req.user.subscriptionTier || 'free',
      emailVerified: req.user.emailVerified || false,
      createdAt: req.user.createdAt || new Date(),
      lastLoginAt: req.user.lastLoginAt || null,
      preferences: req.user.preferences || {},
      avatar: req.user.avatar || null
    };

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Failed to get user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile'
    });
  }
});

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', 
  requireAuth,
  [
    body('firstName').optional().isLength({ min: 1, max: 50 }).trim(),
    body('lastName').optional().isLength({ min: 1, max: 50 }).trim(),
    body('company').optional().isLength({ max: 100 }).trim(),
    body('jobTitle').optional().isLength({ max: 100 }).trim(),
    body('phone').optional().isMobilePhone(),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { firstName, lastName, company, jobTitle, phone } = req.body;
      
      // Update user profile (this would typically update the database)
      const updatedUser = {
        ...req.user,
        firstName,
        lastName,
        company,
        jobTitle,
        phone,
        updatedAt: new Date()
      };

      await auditLog(req.user.userId, 'profile_updated', {
        changes: { firstName, lastName, company, jobTitle, phone }
      });

      res.json({
        success: true,
        data: { user: updatedUser },
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Failed to update user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }
);

/**
 * GET /api/users/preferences
 * Get user preferences
 */
router.get('/preferences', requireAuth, async (req, res) => {
  try {
    const preferences = {
      notifications: {
        email: true,
        push: false,
        marketing: false
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false
      },
      interface: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC'
      },
      workflow: {
        autoSave: true,
        defaultTemplate: 'standard',
        compressionLevel: 'medium'
      }
    };

    res.json({
      success: true,
      data: { preferences }
    });
  } catch (error) {
    console.error('Failed to get user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve preferences'
    });
  }
});

/**
 * PUT /api/users/preferences
 * Update user preferences
 */
router.put('/preferences', 
  requireAuth,
  [
    body('notifications').optional().isObject(),
    body('privacy').optional().isObject(),
    body('interface').optional().isObject(),
    body('workflow').optional().isObject(),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { notifications, privacy, interface: interfacePrefs, workflow } = req.body;
      
      const updatedPreferences = {
        notifications,
        privacy,
        interface: interfacePrefs,
        workflow,
        updatedAt: new Date()
      };

      await auditLog(req.user.userId, 'preferences_updated', {
        preferences: updatedPreferences
      });

      res.json({
        success: true,
        data: { preferences: updatedPreferences },
        message: 'Preferences updated successfully'
      });
    } catch (error) {
      console.error('Failed to update preferences:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update preferences'
      });
    }
  }
);

/**
 * GET /api/users/activity
 * Get user activity log
 */
router.get('/activity', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    // Mock activity data (would typically come from audit logs)
    const activities = [
      {
        id: '1',
        type: 'login',
        description: 'User logged in',
        timestamp: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      },
      {
        id: '2',
        type: 'profile_update',
        description: 'Profile information updated',
        timestamp: new Date(Date.now() - 3600000),
        ipAddress: req.ip
      }
    ];

    const filteredActivities = type ? activities.filter(a => a.type === type) : activities;
    
    res.json({
      success: true,
      data: {
        activities: filteredActivities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredActivities.length,
          pages: Math.ceil(filteredActivities.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Failed to get user activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve activity log'
    });
  }
});

/**
 * POST /api/users/change-password
 * Change user password
 */
router.post('/change-password',
  requireAuth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    })
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      // Verify current password and update (this would typically use bcrypt)
      // const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      // if (!isValidPassword) {
      //   return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      // }
      
      // const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      // Update user password in database

      await auditLog(req.user.userId, 'password_changed', {
        timestamp: new Date(),
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }
);

/**
 * DELETE /api/users/account
 * Delete user account
 */
router.delete('/account', requireAuth, async (req, res) => {
  try {
    const { reason, feedback } = req.body;
    
    // Mark account for deletion (typically would be a soft delete)
    await auditLog(req.user.userId, 'account_deletion_requested', {
      reason,
      feedback,
      timestamp: new Date(),
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Account deletion request submitted. Your account will be deleted within 30 days.'
    });
  } catch (error) {
    console.error('Failed to delete account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process account deletion'
    });
  }
});

/**
 * GET /api/users/usage
 * Get user usage statistics
 */
router.get('/usage', requireAuth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Mock usage data (would typically come from analytics)
    const usage = {
      period,
      proofs: {
        created: 45,
        approved: 38,
        rejected: 7,
        pending: 12
      },
      storage: {
        used: '2.3 GB',
        limit: '10 GB',
        percentage: 23
      },
      api: {
        calls: 1250,
        limit: 10000,
        percentage: 12.5
      },
      features: {
        templates: 15,
        integrations: 3,
        webhooks: 2
      }
    };

    res.json({
      success: true,
      data: { usage }
    });
  } catch (error) {
    console.error('Failed to get usage statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve usage statistics'
    });
  }
});

/**
 * Admin Routes (Enterprise only)
 */

/**
 * GET /api/users/admin/list
 * Get list of all users (admin only)
 */
router.get('/admin/list', 
  requireAuth, 
  requireSubscription('enterprise'),
  async (req, res) => {
    try {
      // Check if user has admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { page = 1, limit = 20, search, status, subscriptionTier } = req.query;
      
      // Mock user list (would typically come from database)
      const users = [
        {
          id: '1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          company: 'Example Corp',
          subscriptionTier: 'enterprise',
          status: 'active',
          createdAt: new Date(),
          lastLoginAt: new Date()
        }
      ];

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: users.length,
            pages: Math.ceil(users.length / limit)
          },
          filters: { search, status, subscriptionTier }
        }
      });
    } catch (error) {
      console.error('Failed to get user list:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user list'
      });
    }
  }
);

/**
 * PUT /api/users/admin/:userId/status
 * Update user status (admin only)
 */
router.put('/admin/:userId/status',
  requireAuth,
  requireSubscription('enterprise'),
  [
    param('userId').isUUID().withMessage('Valid user ID is required'),
    body('status').isIn(['active', 'suspended', 'banned']).withMessage('Valid status is required'),
    body('reason').optional().isLength({ max: 500 }).trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      // Check if user has admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { userId } = req.params;
      const { status, reason } = req.body;
      
      // Update user status in database
      await auditLog(req.user.userId, 'user_status_updated', {
        targetUserId: userId,
        newStatus: status,
        reason,
        adminId: req.user.userId
      });

      res.json({
        success: true,
        message: `User status updated to ${status}`
      });
    } catch (error) {
      console.error('Failed to update user status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user status'
      });
    }
  }
);

module.exports = router; 