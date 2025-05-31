const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { auditLog } = require('../services/auditService');
const { sendEmail } = require('../services/emailService');
const { createSession, invalidateSession } = require('../services/sessionService');
const { authenticateToken, requireAuth, verifyRefreshToken } = require('../middleware/auth');
const { getClientInfo } = require('../utils/clientInfo');

const router = express.Router();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictAuthLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour for sensitive operations
  message: {
    error: 'Too many attempts, please try again later',
    retryAfter: 60 * 60 // 1 hour in seconds
  }
});

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required and must be less than 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required and must be less than 100 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Company name must be less than 255 characters'),
  body('jobTitle')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Job title must be less than 255 characters'),
  body('dataProcessingConsent')
    .isBoolean()
    .custom(value => {
      if (!value) {
        throw new Error('Data processing consent is required');
      }
      return true;
    })
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Register new user
router.post('/register', authLimiter, registerValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      company,
      jobTitle,
      phone,
      subscriptionTier = 'free',
      dataProcessingConsent,
      marketingConsent = false
    } = req.body;

    const clientInfo = getClientInfo(req);

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      company,
      jobTitle,
      phone,
      subscriptionTier,
      dataProcessingConsent,
      marketingConsent
    });

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: 'Verify Your ProofPix Account',
      template: 'email-verification',
      data: {
        firstName: user.first_name,
        verificationToken: user.email_verification_token,
        verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${user.email_verification_token}`
      }
    });

    await auditLog({
      eventType: 'user_registered',
      eventCategory: 'auth',
      eventDescription: `New user registered: ${email}`,
      resourceType: 'user',
      resourceId: user.id,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      metadata: {
        email,
        company,
        subscriptionTier,
        dataProcessingConsent,
        marketingConsent
      }
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      data: {
        user: user.toSafeObject()
      }
    });

  } catch (error) {
    const clientInfo = getClientInfo(req);
    
    await auditLog({
      eventType: 'registration_failed',
      eventCategory: 'auth',
      eventDescription: `Registration failed: ${error.message}`,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      riskLevel: 'medium',
      metadata: {
        email: req.body.email,
        error: error.message
      }
    });

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Login user
router.post('/login', authLimiter, loginValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, twoFactorToken } = req.body;
    const clientInfo = getClientInfo(req);

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      await auditLog({
        eventType: 'login_failed',
        eventCategory: 'auth',
        eventDescription: 'Login failed - user not found',
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        riskLevel: 'medium',
        metadata: { email }
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Authenticate user
    await user.authenticate(password, clientInfo.ipAddress, clientInfo.userAgent);

    // Check 2FA if enabled
    if (user.two_factor_enabled) {
      if (!twoFactorToken) {
        return res.status(200).json({
          success: true,
          requiresTwoFactor: true,
          message: 'Two-factor authentication required'
        });
      }

      const is2FAValid = user.verify2FA(twoFactorToken);
      if (!is2FAValid) {
        await auditLog({
          userId: user.id,
          eventType: '2fa_failed',
          eventCategory: 'auth',
          eventDescription: 'Invalid 2FA token provided',
          resourceType: 'user',
          resourceId: user.id,
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          riskLevel: 'high',
          metadata: { email }
        });

        return res.status(401).json({
          success: false,
          message: 'Invalid two-factor authentication code'
        });
      }
    }

    // Generate tokens
    const tokens = user.generateTokens();

    // Create session record
    const sessionData = {
      userId: user.id,
      sessionToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      deviceType: clientInfo.deviceType,
      browser: clientInfo.browser,
      os: clientInfo.os,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    };

    // Store session in database and Redis
    const session = await createSession(sessionData);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSafeObject(),
        tokens,
        session: {
          id: session.id,
          expiresAt: session.expires_at
        }
      }
    });

  } catch (error) {
    const clientInfo = getClientInfo(req);
    
    await auditLog({
      eventType: 'login_error',
      eventCategory: 'auth',
      eventDescription: `Login error: ${error.message}`,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      riskLevel: 'medium',
      metadata: {
        email: req.body.email,
        error: error.message
      }
    });

    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user by verification token
    const user = await User.findByVerificationToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    await user.verifyEmail(token);

    res.json({
      success: true,
      message: 'Email verified successfully. You can now log in to your account.'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Request password reset
router.post('/forgot-password', strictAuthLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const clientInfo = getClientInfo(req);

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    const resetToken = await user.generatePasswordResetToken();

    await sendEmail({
      to: user.email,
      subject: 'Reset Your ProofPix Password',
      template: 'password-reset',
      data: {
        firstName: user.first_name,
        resetToken,
        resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      }
    });

    res.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request'
    });
  }
});

// Reset password
router.post('/reset-password', strictAuthLimiter, [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    // Find user by reset token
    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    await user.resetPassword(token, password);

    res.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Setup 2FA
router.post('/setup-2fa', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.two_factor_enabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is already enabled'
      });
    }

    const setup2FA = await user.setup2FA();

    res.json({
      success: true,
      message: '2FA setup initiated. Please scan the QR code with your authenticator app.',
      data: setup2FA
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Enable 2FA
router.post('/enable-2fa', requireAuth, [
  body('token').notEmpty().withMessage('2FA token is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.enable2FA(token);

    res.json({
      success: true,
      message: 'Two-factor authentication enabled successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Disable 2FA
router.post('/disable-2fa', requireAuth, [
  body('password').notEmpty().withMessage('Password is required'),
  body('token').notEmpty().withMessage('2FA token is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { password, token } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const clientInfo = getClientInfo(req);
    await user.authenticate(password, clientInfo.ipAddress, clientInfo.userAgent);

    // Verify 2FA token
    const is2FAValid = user.verify2FA(token);
    if (!is2FAValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid two-factor authentication code'
      });
    }

    await user.disable2FA();

    res.json({
      success: true,
      message: 'Two-factor authentication disabled successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get current user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toSafeObject()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile', requireAuth, [
  body('firstName').optional().trim().isLength({ min: 1, max: 100 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 100 }),
  body('company').optional().trim().isLength({ max: 255 }),
  body('jobTitle').optional().trim().isLength({ max: 255 }),
  body('phone').optional().trim().isLength({ max: 50 }),
  body('marketingConsent').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updates = {};
    const allowedFields = ['firstName', 'lastName', 'company', 'jobTitle', 'phone', 'marketingConsent'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field === 'firstName' ? 'first_name' : 
               field === 'lastName' ? 'last_name' : 
               field === 'jobTitle' ? 'job_title' : 
               field === 'marketingConsent' ? 'marketing_consent' : field] = req.body[field];
      }
    });

    const updatedUser = await user.updateProfile(updates, req.user.userId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toSafeObject()
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Logout
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      await invalidateSession(token, 'logout');
    }
    
    const clientInfo = getClientInfo(req);
    await auditLog({
      userId: req.user.userId,
      eventType: 'logout',
      eventCategory: 'auth',
      eventDescription: 'User logged out',
      resourceType: 'user',
      resourceId: req.user.userId,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Refresh token
router.post('/refresh-token', verifyRefreshToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new tokens
    const tokens = user.generateTokens();

    const clientInfo = getClientInfo(req);
    await auditLog({
      userId: user.id,
      eventType: 'token_refreshed',
      eventCategory: 'auth',
      eventDescription: 'Access token refreshed',
      resourceType: 'user',
      resourceId: user.id,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      metadata: { email: user.email }
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens,
        user: user.toSafeObject()
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

module.exports = router; 