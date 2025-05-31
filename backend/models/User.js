const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const { query, transaction } = require('../config/database');
const { auditLog } = require('../services/auditService');

class User {
  constructor(userData) {
    Object.assign(this, userData);
  }

  // Create new user with validation
  static async create(userData, createdBy = null) {
    const {
      email,
      password,
      firstName,
      lastName,
      company,
      jobTitle,
      phone,
      subscriptionTier = 'free',
      dataProcessingConsent = false,
      marketingConsent = false
    } = userData;

    // Validate required fields
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const result = await query(`
      INSERT INTO users (
        email, password_hash, first_name, last_name, company, job_title, phone,
        subscription_tier, email_verification_token, email_verification_expires,
        data_processing_consent, marketing_consent, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      company,
      jobTitle,
      phone,
      subscriptionTier,
      emailVerificationToken,
      emailVerificationExpires,
      dataProcessingConsent,
      marketingConsent,
      createdBy
    ]);

    const user = new User(result.rows[0]);

    // Log user creation
    await auditLog({
      eventType: 'user_created',
      eventCategory: 'user_management',
      eventDescription: `User account created for ${email}`,
      resourceType: 'user',
      resourceId: user.id,
      metadata: {
        email,
        subscriptionTier,
        company,
        createdBy
      }
    });

    return user;
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1 AND status != $2', [
      email.toLowerCase(),
      'deleted'
    ]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Find user by ID
  static async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1 AND status != $2', [
      id,
      'deleted'
    ]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Find user by verification token
  static async findByVerificationToken(token) {
    const result = await query(`
      SELECT * FROM users 
      WHERE email_verification_token = $1 
        AND email_verification_expires > CURRENT_TIMESTAMP 
        AND status != $2
    `, [token, 'deleted']);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Find user by reset token
  static async findByResetToken(token) {
    const result = await query(`
      SELECT * FROM users 
      WHERE password_reset_token = $1 
        AND password_reset_expires > CURRENT_TIMESTAMP 
        AND status != $2
    `, [token, 'deleted']);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Authenticate user with password
  async authenticate(password, ipAddress, userAgent) {
    // Check if account is locked
    if (this.locked_until && new Date() < new Date(this.locked_until)) {
      throw new Error('Account is temporarily locked due to too many failed login attempts');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, this.password_hash);
    
    if (!isValid) {
      // Increment login attempts
      await this.incrementLoginAttempts();
      
      await auditLog({
        userId: this.id,
        eventType: 'login_failed',
        eventCategory: 'auth',
        eventDescription: 'Failed login attempt - invalid password',
        resourceType: 'user',
        resourceId: this.id,
        ipAddress,
        userAgent,
        riskLevel: 'medium',
        metadata: { email: this.email }
      });

      throw new Error('Invalid credentials');
    }

    // Check if email is verified
    if (!this.email_verified) {
      throw new Error('Please verify your email address before logging in');
    }

    // Reset login attempts on successful authentication
    await this.resetLoginAttempts();

    // Update last login
    await this.updateLastLogin();

    await auditLog({
      userId: this.id,
      eventType: 'login_success',
      eventCategory: 'auth',
      eventDescription: 'Successful login',
      resourceType: 'user',
      resourceId: this.id,
      ipAddress,
      userAgent,
      metadata: { email: this.email }
    });

    return true;
  }

  // Generate JWT tokens
  generateTokens() {
    const payload = {
      userId: this.id,
      email: this.email,
      subscriptionTier: this.subscription_tier,
      emailVerified: this.email_verified
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      issuer: 'proofpix',
      audience: 'proofpix-users'
    });

    const refreshToken = jwt.sign(
      { userId: this.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        issuer: 'proofpix',
        audience: 'proofpix-users'
      }
    );

    return { accessToken, refreshToken };
  }

  // Setup 2FA
  async setup2FA() {
    const secret = speakeasy.generateSecret({
      name: `ProofPix (${this.email})`,
      issuer: 'ProofPix'
    });

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Store secret (but don't enable 2FA yet)
    await query(`
      UPDATE users 
      SET two_factor_secret = $1, two_factor_backup_codes = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [secret.base32, backupCodes, this.id]);

    await auditLog({
      userId: this.id,
      eventType: '2fa_setup_initiated',
      eventCategory: 'security',
      eventDescription: '2FA setup initiated',
      resourceType: 'user',
      resourceId: this.id,
      metadata: { email: this.email }
    });

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes
    };
  }

  // Enable 2FA after verification
  async enable2FA(token) {
    if (!this.two_factor_secret) {
      throw new Error('2FA setup not initiated');
    }

    const verified = speakeasy.totp.verify({
      secret: this.two_factor_secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      throw new Error('Invalid 2FA token');
    }

    await query(`
      UPDATE users 
      SET two_factor_enabled = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [this.id]);

    this.two_factor_enabled = true;

    await auditLog({
      userId: this.id,
      eventType: '2fa_enabled',
      eventCategory: 'security',
      eventDescription: '2FA enabled successfully',
      resourceType: 'user',
      resourceId: this.id,
      metadata: { email: this.email }
    });

    return true;
  }

  // Disable 2FA
  async disable2FA() {
    await query(`
      UPDATE users 
      SET two_factor_enabled = FALSE, 
          two_factor_secret = NULL, 
          two_factor_backup_codes = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [this.id]);

    this.two_factor_enabled = false;
    this.two_factor_secret = null;
    this.two_factor_backup_codes = null;

    await auditLog({
      userId: this.id,
      eventType: '2fa_disabled',
      eventCategory: 'security',
      eventDescription: '2FA disabled successfully',
      resourceType: 'user',
      resourceId: this.id,
      metadata: { email: this.email }
    });

    return true;
  }

  // Verify 2FA token
  verify2FA(token) {
    if (!this.two_factor_enabled || !this.two_factor_secret) {
      return false;
    }

    // Check if it's a backup code
    if (this.two_factor_backup_codes && this.two_factor_backup_codes.includes(token.toUpperCase())) {
      // Remove used backup code
      this.removeBackupCode(token.toUpperCase());
      return true;
    }

    // Verify TOTP token
    return speakeasy.totp.verify({
      secret: this.two_factor_secret,
      encoding: 'base32',
      token,
      window: 2
    });
  }

  // Remove used backup code
  async removeBackupCode(code) {
    const updatedCodes = this.two_factor_backup_codes.filter(c => c !== code);
    await query(`
      UPDATE users 
      SET two_factor_backup_codes = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [updatedCodes, this.id]);

    await auditLog({
      userId: this.id,
      eventType: '2fa_backup_code_used',
      eventCategory: 'security',
      eventDescription: '2FA backup code used',
      resourceType: 'user',
      resourceId: this.id,
      metadata: { email: this.email, remainingCodes: updatedCodes.length }
    });
  }

  // Verify email
  async verifyEmail(token) {
    if (this.email_verified) {
      throw new Error('Email is already verified');
    }

    if (this.email_verification_token !== token) {
      throw new Error('Invalid verification token');
    }

    if (new Date() > new Date(this.email_verification_expires)) {
      throw new Error('Verification token has expired');
    }

    await query(`
      UPDATE users 
      SET email_verified = TRUE, 
          email_verification_token = NULL, 
          email_verification_expires = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [this.id]);

    this.email_verified = true;

    await auditLog({
      userId: this.id,
      eventType: 'email_verified',
      eventCategory: 'auth',
      eventDescription: 'Email address verified',
      resourceType: 'user',
      resourceId: this.id,
      metadata: { email: this.email }
    });

    return true;
  }

  // Generate password reset token
  async generatePasswordResetToken() {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await query(`
      UPDATE users 
      SET password_reset_token = $1, 
          password_reset_expires = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [token, expires, this.id]);

    await auditLog({
      userId: this.id,
      eventType: 'password_reset_requested',
      eventCategory: 'auth',
      eventDescription: 'Password reset token generated',
      resourceType: 'user',
      resourceId: this.id,
      metadata: { email: this.email }
    });

    return token;
  }

  // Reset password
  async resetPassword(token, newPassword) {
    if (this.password_reset_token !== token) {
      throw new Error('Invalid reset token');
    }

    if (new Date() > new Date(this.password_reset_expires)) {
      throw new Error('Reset token has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await query(`
      UPDATE users 
      SET password_hash = $1,
          password_reset_token = NULL,
          password_reset_expires = NULL,
          login_attempts = 0,
          locked_until = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [passwordHash, this.id]);

    await auditLog({
      userId: this.id,
      eventType: 'password_reset_completed',
      eventCategory: 'auth',
      eventDescription: 'Password reset completed',
      resourceType: 'user',
      resourceId: this.id,
      metadata: { email: this.email }
    });

    return true;
  }

  // Update profile
  async updateProfile(updates, updatedBy = null) {
    const allowedFields = [
      'first_name', 'last_name', 'company', 'job_title', 'phone',
      'marketing_consent'
    ];

    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(field => {
      if (allowedFields.includes(field)) {
        updateFields.push(`${field} = $${paramIndex}`);
        updateValues.push(updates[field]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    if (updatedBy) {
      updateFields.push(`updated_by = $${paramIndex}`);
      updateValues.push(updatedBy);
      paramIndex++;
    }

    updateValues.push(this.id);

    await query(`
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
    `, updateValues);

    await auditLog({
      userId: this.id,
      eventType: 'profile_updated',
      eventCategory: 'user_management',
      eventDescription: 'User profile updated',
      resourceType: 'user',
      resourceId: this.id,
      metadata: { 
        email: this.email,
        updatedFields: Object.keys(updates),
        updatedBy
      }
    });

    // Refresh user data
    const updated = await User.findById(this.id);
    Object.assign(this, updated);
    return this;
  }

  // Increment login attempts
  async incrementLoginAttempts() {
    const newAttempts = (this.login_attempts || 0) + 1;
    let lockedUntil = null;

    // Lock account after 5 failed attempts
    if (newAttempts >= 5) {
      lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }

    await query(`
      UPDATE users 
      SET login_attempts = $1, 
          locked_until = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [newAttempts, lockedUntil, this.id]);

    this.login_attempts = newAttempts;
    this.locked_until = lockedUntil;
  }

  // Reset login attempts
  async resetLoginAttempts() {
    await query(`
      UPDATE users 
      SET login_attempts = 0, 
          locked_until = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [this.id]);

    this.login_attempts = 0;
    this.locked_until = null;
  }

  // Update last login
  async updateLastLogin() {
    await query(`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [this.id]);

    this.last_login = new Date();
  }

  // Get safe user data (without sensitive fields)
  toSafeObject() {
    const {
      password_hash,
      two_factor_secret,
      two_factor_backup_codes,
      email_verification_token,
      password_reset_token,
      ...safeData
    } = this;

    return safeData;
  }

  // Check if user has permission for subscription tier features
  hasFeatureAccess(feature) {
    const tierFeatures = {
      free: ['basic_analysis', 'single_upload'],
      professional: ['basic_analysis', 'single_upload', 'batch_processing', 'advanced_export', 'metadata_removal'],
      enterprise: ['basic_analysis', 'single_upload', 'batch_processing', 'advanced_export', 'metadata_removal', 'api_access', 'custom_branding', 'priority_support']
    };

    return tierFeatures[this.subscription_tier]?.includes(feature) || false;
  }
}

module.exports = User; 