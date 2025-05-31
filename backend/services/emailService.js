const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const winston = require('winston');

// Configure email logger
const emailLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/email.log' })
  ]
});

// Email transporter configuration
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };

  // Use different config for development
  if (process.env.NODE_ENV === 'development') {
    // Use Ethereal Email for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }

  return nodemailer.createTransporter(config);
};

// Email templates
const emailTemplates = {
  'email-verification': {
    subject: 'Verify Your ProofPix Account',
    template: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ProofPix!</h1>
          </div>
          <div class="content">
            <h2>Hi {{firstName}},</h2>
            <p>Thank you for signing up for ProofPix! To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="{{verificationUrl}}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="{{verificationUrl}}">{{verificationUrl}}</a></p>
            <p>This verification link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with ProofPix, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 ProofPix. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  'password-reset': {
    subject: 'Reset Your ProofPix Password',
    template: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .warning { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi {{firstName}},</h2>
            <p>We received a request to reset your ProofPix account password. If you made this request, click the button below to reset your password:</p>
            <a href="{{resetUrl}}" class="button">Reset Password</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="{{resetUrl}}">{{resetUrl}}</a></p>
            <div class="warning">
              <strong>Security Notice:</strong>
              <ul>
                <li>This reset link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password will remain unchanged until you create a new one</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 ProofPix. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  'welcome': {
    subject: 'Welcome to ProofPix - Your Account is Ready!',
    template: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ProofPix</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #10B981; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ProofPix!</h1>
          </div>
          <div class="content">
            <h2>Hi {{firstName}},</h2>
            <p>Your ProofPix account has been successfully verified and is now ready to use! You can now access all the powerful EXIF metadata extraction features.</p>
            
            <div class="feature">
              <h3>🔍 Extract EXIF Data</h3>
              <p>Upload images and instantly extract comprehensive metadata including camera settings, GPS coordinates, and timestamps.</p>
            </div>
            
            <div class="feature">
              <h3>📊 Analyze Metadata</h3>
              <p>Get detailed analysis and insights from your image metadata with our advanced processing tools.</p>
            </div>
            
            <div class="feature">
              <h3>🔒 Privacy & Security</h3>
              <p>Your images are processed securely and never stored on our servers. Complete privacy guaranteed.</p>
            </div>
            
            <a href="{{dashboardUrl}}" class="button">Start Using ProofPix</a>
            
            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>© 2025 ProofPix. All rights reserved.</p>
            <p>Need help? Contact us at support@proofpix.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  'security-alert': {
    subject: 'ProofPix Security Alert - Account Activity',
    template: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Security Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9f9f9; }
          .alert { background: #FEE2E2; border: 1px solid #DC2626; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Security Alert</h1>
          </div>
          <div class="content">
            <h2>Hi {{firstName}},</h2>
            <div class="alert">
              <strong>We detected unusual activity on your ProofPix account:</strong>
              <p>{{alertMessage}}</p>
              <p><strong>Time:</strong> {{timestamp}}</p>
              <p><strong>Location:</strong> {{location}}</p>
              <p><strong>Device:</strong> {{device}}</p>
            </div>
            <p>If this was you, no action is needed. If you don't recognize this activity, please:</p>
            <ul>
              <li>Change your password immediately</li>
              <li>Enable two-factor authentication</li>
              <li>Review your account activity</li>
              <li>Contact our support team</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2025 ProofPix. All rights reserved.</p>
            <p>For immediate assistance, contact security@proofpix.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

/**
 * Send email using template
 * @param {Object} options - Email options
 */
const sendEmail = async (options) => {
  try {
    const { to, subject, template, data, attachments = [] } = options;

    if (!to || !template) {
      throw new Error('Recipient email and template are required');
    }

    // Get template
    const emailTemplate = emailTemplates[template];
    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found`);
    }

    // Replace template variables
    let htmlContent = emailTemplate.template;
    let emailSubject = subject || emailTemplate.subject;

    if (data) {
      Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        htmlContent = htmlContent.replace(regex, data[key] || '');
        emailSubject = emailSubject.replace(regex, data[key] || '');
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: `"ProofPix" <${process.env.SMTP_FROM || 'noreply@proofpix.com'}>`,
      to,
      subject: emailSubject,
      html: htmlContent,
      attachments
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    emailLogger.info('Email sent successfully', {
      to,
      subject: emailSubject,
      template,
      messageId: info.messageId,
      response: info.response
    });

    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };

  } catch (error) {
    emailLogger.error('Failed to send email', {
      error: error.message,
      stack: error.stack,
      options
    });

    throw error;
  }
};

/**
 * Send bulk emails
 * @param {Array} emails - Array of email options
 */
const sendBulkEmails = async (emails) => {
  const results = [];

  for (const emailOptions of emails) {
    try {
      const result = await sendEmail(emailOptions);
      results.push({ success: true, email: emailOptions.to, result });
    } catch (error) {
      results.push({ success: false, email: emailOptions.to, error: error.message });
    }
  }

  return results;
};

/**
 * Verify email configuration
 */
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    emailLogger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    emailLogger.error('Email configuration verification failed', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  verifyEmailConfig,
  emailTemplates
}; 