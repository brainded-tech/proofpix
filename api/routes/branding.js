const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { authenticateApiKey, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/branding');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || 'anonymous';
    const fileExtension = path.extname(file.originalname);
    const fileName = `${userId}_${uuidv4()}${fileExtension}`;
    cb(null, fileName);
  }
});

// File filter for branding assets
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// In-memory branding storage (replace with database in production)
const brandingConfigs = new Map();

// Upload branding assets
router.post('/upload',
  authenticateApiKey,
  requirePermission('white_label'),
  upload.fields([
    { name: 'logo_light', maxCount: 1 },
    { name: 'logo_dark', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const files = req.files;
      const colors = req.body.colors ? JSON.parse(req.body.colors) : {};
      
      // Validate uploaded files
      if (!files || (!files.logo_light && !files.logo_dark && !files.favicon)) {
        return res.status(400).json({
          error: 'No branding assets uploaded',
          message: 'At least one branding asset is required'
        });
      }
      
      // Get or create branding config
      const userId = req.user.id;
      const existingConfig = brandingConfigs.get(userId) || {
        userId,
        teamId: req.user.teamId,
        assets: {},
        colors: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update asset URLs
      if (files.logo_light && files.logo_light[0]) {
        existingConfig.assets.logoLight = `/uploads/branding/${files.logo_light[0].filename}`;
      }
      
      if (files.logo_dark && files.logo_dark[0]) {
        existingConfig.assets.logoDark = `/uploads/branding/${files.logo_dark[0].filename}`;
      }
      
      if (files.favicon && files.favicon[0]) {
        existingConfig.assets.favicon = `/uploads/branding/${files.favicon[0].filename}`;
      }
      
      // Update colors if provided
      if (colors) {
        existingConfig.colors = {
          ...existingConfig.colors,
          ...colors
        };
      }
      
      // Update timestamp
      existingConfig.updatedAt = new Date().toISOString();
      
      // Save updated config
      brandingConfigs.set(userId, existingConfig);
      
      res.json({
        success: true,
        message: 'Branding assets uploaded successfully',
        data: {
          assets: existingConfig.assets,
          colors: existingConfig.colors,
          previewUrl: `/api/branding/preview/${userId}`
        }
      });
    } catch (error) {
      console.error('Branding upload error:', error);
      res.status(500).json({
        error: 'Failed to upload branding assets',
        message: error.message
      });
    }
  }
);

// Update branding colors
router.put('/colors',
  authenticateApiKey,
  requirePermission('white_label'),
  async (req, res) => {
    try {
      const { primary, secondary, accent, text, background } = req.body;
      
      // Get or create branding config
      const userId = req.user.id;
      const existingConfig = brandingConfigs.get(userId) || {
        userId,
        teamId: req.user.teamId,
        assets: {},
        colors: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update colors
      existingConfig.colors = {
        ...existingConfig.colors,
        primary: primary || existingConfig.colors.primary,
        secondary: secondary || existingConfig.colors.secondary,
        accent: accent || existingConfig.colors.accent,
        text: text || existingConfig.colors.text,
        background: background || existingConfig.colors.background
      };
      
      // Update timestamp
      existingConfig.updatedAt = new Date().toISOString();
      
      // Save updated config
      brandingConfigs.set(userId, existingConfig);
      
      res.json({
        success: true,
        message: 'Branding colors updated successfully',
        data: {
          colors: existingConfig.colors
        }
      });
    } catch (error) {
      console.error('Branding colors update error:', error);
      res.status(500).json({
        error: 'Failed to update branding colors',
        message: error.message
      });
    }
  }
);

// Configure white-label branding
router.put('/whitelabel',
  authenticateApiKey,
  requirePermission('white_label'),
  async (req, res) => {
    try {
      const { domain, applicationName, supportEmail, customFooter } = req.body;
      
      // Get or create branding config
      const userId = req.user.id;
      const existingConfig = brandingConfigs.get(userId) || {
        userId,
        teamId: req.user.teamId,
        assets: {},
        colors: {},
        whitelabel: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update whitelabel config
      existingConfig.whitelabel = {
        ...existingConfig.whitelabel,
        domain: domain || existingConfig.whitelabel.domain,
        applicationName: applicationName || existingConfig.whitelabel.applicationName,
        supportEmail: supportEmail || existingConfig.whitelabel.supportEmail,
        customFooter: customFooter || existingConfig.whitelabel.customFooter,
        hideProofPixBranding: true
      };
      
      // Update timestamp
      existingConfig.updatedAt = new Date().toISOString();
      
      // Save updated config
      brandingConfigs.set(userId, existingConfig);
      
      res.json({
        success: true,
        message: 'White-label configuration updated successfully',
        data: {
          whitelabel: existingConfig.whitelabel
        }
      });
    } catch (error) {
      console.error('White-label update error:', error);
      res.status(500).json({
        error: 'Failed to update white-label configuration',
        message: error.message
      });
    }
  }
);

// Get branding configuration
router.get('/config',
  authenticateApiKey,
  requirePermission('white_label'),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const config = brandingConfigs.get(userId) || {
        userId,
        teamId: req.user.teamId,
        assets: {},
        colors: {},
        whitelabel: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      console.error('Get branding config error:', error);
      res.status(500).json({
        error: 'Failed to retrieve branding configuration',
        message: error.message
      });
    }
  }
);

module.exports = router; 