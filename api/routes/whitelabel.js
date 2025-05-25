const express = require('express');
const { authenticateApiKey, requirePermission } = require('../middleware/auth');
const router = express.Router();

// In-memory white-label storage (replace with database in production)
const whitelabelConfigs = new Map();

// Initialize demo white-label config
function initializeWhitelabelData() {
  const demoConfig = {
    userId: 'user_enterprise_1',
    teamId: 'team_enterprise_1',
    branding: {
      companyName: 'Enterprise Demo Corp',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#F59E0B',
      backgroundColor: '#111827',
      textColor: '#F9FAFB'
    },
    customization: {
      hideProofPixBranding: true,
      customFooterText: '© 2025 Enterprise Demo Corp. All rights reserved.',
      customSupportEmail: 'support@enterprisedemo.com',
      customDomain: 'exif.enterprisedemo.com',
      customTitle: 'Enterprise EXIF Extractor',
      customDescription: 'Professional EXIF metadata extraction for Enterprise Demo Corp'
    },
    features: {
      customWelcomeMessage: 'Welcome to Enterprise Demo Corp EXIF Extractor',
      customUploadText: 'Upload your images to extract professional metadata',
      customProcessingText: 'Processing your images with enterprise-grade security',
      showCustomFields: true,
      enableTeamBranding: true
    },
    api: {
      customApiDomain: 'api.enterprisedemo.com',
      customDocumentationUrl: 'https://docs.enterprisedemo.com/exif-api',
      customSupportUrl: 'https://support.enterprisedemo.com'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  whitelabelConfigs.set(demoConfig.userId, demoConfig);
}

initializeWhitelabelData();

// Get white-label configuration
router.get('/config',
  authenticateApiKey,
  requirePermission('white_label'),
  async (req, res) => {
    try {
      const config = whitelabelConfigs.get(req.user.id) || getDefaultConfig(req.user);
      
      res.json({
        success: true,
        data: {
          config,
          capabilities: {
            customBranding: true,
            customDomain: true,
            hideProofPixBranding: true,
            customApiEndpoints: true,
            teamBranding: true,
            customFields: true
          }
        }
      });
      
    } catch (error) {
      console.error('Get white-label config error:', error);
      res.status(500).json({
        error: 'Failed to retrieve white-label configuration',
        message: error.message
      });
    }
  }
);

// Update white-label configuration
router.put('/config',
  authenticateApiKey,
  requirePermission('white_label'),
  async (req, res) => {
    try {
      const { branding, customization, features, api } = req.body;
      
      const existingConfig = whitelabelConfigs.get(req.user.id) || getDefaultConfig(req.user);
      
      // Update branding settings
      if (branding) {
        if (branding.companyName) existingConfig.branding.companyName = branding.companyName.trim();
        if (branding.logoUrl) existingConfig.branding.logoUrl = branding.logoUrl.trim();
        if (branding.faviconUrl) existingConfig.branding.faviconUrl = branding.faviconUrl.trim();
        if (branding.primaryColor) existingConfig.branding.primaryColor = validateColor(branding.primaryColor);
        if (branding.secondaryColor) existingConfig.branding.secondaryColor = validateColor(branding.secondaryColor);
        if (branding.accentColor) existingConfig.branding.accentColor = validateColor(branding.accentColor);
        if (branding.backgroundColor) existingConfig.branding.backgroundColor = validateColor(branding.backgroundColor);
        if (branding.textColor) existingConfig.branding.textColor = validateColor(branding.textColor);
      }
      
      // Update customization settings
      if (customization) {
        if (customization.hideProofPixBranding !== undefined) {
          existingConfig.customization.hideProofPixBranding = customization.hideProofPixBranding;
        }
        if (customization.customFooterText) {
          existingConfig.customization.customFooterText = customization.customFooterText.trim();
        }
        if (customization.customSupportEmail) {
          existingConfig.customization.customSupportEmail = validateEmail(customization.customSupportEmail);
        }
        if (customization.customDomain) {
          existingConfig.customization.customDomain = validateDomain(customization.customDomain);
        }
        if (customization.customTitle) {
          existingConfig.customization.customTitle = customization.customTitle.trim();
        }
        if (customization.customDescription) {
          existingConfig.customization.customDescription = customization.customDescription.trim();
        }
      }
      
      // Update feature settings
      if (features) {
        if (features.customWelcomeMessage) {
          existingConfig.features.customWelcomeMessage = features.customWelcomeMessage.trim();
        }
        if (features.customUploadText) {
          existingConfig.features.customUploadText = features.customUploadText.trim();
        }
        if (features.customProcessingText) {
          existingConfig.features.customProcessingText = features.customProcessingText.trim();
        }
        if (features.showCustomFields !== undefined) {
          existingConfig.features.showCustomFields = features.showCustomFields;
        }
        if (features.enableTeamBranding !== undefined) {
          existingConfig.features.enableTeamBranding = features.enableTeamBranding;
        }
      }
      
      // Update API settings
      if (api) {
        if (api.customApiDomain) {
          existingConfig.api.customApiDomain = validateDomain(api.customApiDomain);
        }
        if (api.customDocumentationUrl) {
          existingConfig.api.customDocumentationUrl = validateUrl(api.customDocumentationUrl);
        }
        if (api.customSupportUrl) {
          existingConfig.api.customSupportUrl = validateUrl(api.customSupportUrl);
        }
      }
      
      existingConfig.updatedAt = new Date().toISOString();
      whitelabelConfigs.set(req.user.id, existingConfig);
      
      res.json({
        success: true,
        data: {
          config: existingConfig,
          message: 'White-label configuration updated successfully'
        }
      });
      
    } catch (error) {
      console.error('Update white-label config error:', error);
      res.status(500).json({
        error: 'Failed to update white-label configuration',
        message: error.message
      });
    }
  }
);

// Generate custom CSS for white-label styling
router.get('/css',
  authenticateApiKey,
  requirePermission('white_label'),
  async (req, res) => {
    try {
      const config = whitelabelConfigs.get(req.user.id) || getDefaultConfig(req.user);
      
      const customCSS = generateCustomCSS(config);
      
      res.setHeader('Content-Type', 'text/css');
      res.send(customCSS);
      
    } catch (error) {
      console.error('Generate CSS error:', error);
      res.status(500).json({
        error: 'Failed to generate custom CSS',
        message: error.message
      });
    }
  }
);

// Get white-label JavaScript configuration
router.get('/js-config',
  authenticateApiKey,
  requirePermission('white_label'),
  async (req, res) => {
    try {
      const config = whitelabelConfigs.get(req.user.id) || getDefaultConfig(req.user);
      
      const jsConfig = {
        branding: {
          companyName: config.branding.companyName,
          logoUrl: config.branding.logoUrl,
          faviconUrl: config.branding.faviconUrl
        },
        customization: {
          hideProofPixBranding: config.customization.hideProofPixBranding,
          customTitle: config.customization.customTitle,
          customDescription: config.customization.customDescription,
          customFooterText: config.customization.customFooterText,
          customSupportEmail: config.customization.customSupportEmail
        },
        features: {
          customWelcomeMessage: config.features.customWelcomeMessage,
          customUploadText: config.features.customUploadText,
          customProcessingText: config.features.customProcessingText,
          showCustomFields: config.features.showCustomFields,
          enableTeamBranding: config.features.enableTeamBranding
        },
        api: {
          customApiDomain: config.api.customApiDomain,
          customDocumentationUrl: config.api.customDocumentationUrl,
          customSupportUrl: config.api.customSupportUrl
        }
      };
      
      res.json({
        success: true,
        data: jsConfig
      });
      
    } catch (error) {
      console.error('Get JS config error:', error);
      res.status(500).json({
        error: 'Failed to retrieve JavaScript configuration',
        message: error.message
      });
    }
  }
);

// Preview white-label configuration
router.post('/preview',
  authenticateApiKey,
  requirePermission('white_label'),
  async (req, res) => {
    try {
      const { branding, customization, features } = req.body;
      
      // Create a temporary preview config
      const previewConfig = {
        ...getDefaultConfig(req.user),
        branding: { ...getDefaultConfig(req.user).branding, ...branding },
        customization: { ...getDefaultConfig(req.user).customization, ...customization },
        features: { ...getDefaultConfig(req.user).features, ...features }
      };
      
      const previewCSS = generateCustomCSS(previewConfig);
      const previewHTML = generatePreviewHTML(previewConfig);
      
      res.json({
        success: true,
        data: {
          config: previewConfig,
          css: previewCSS,
          html: previewHTML,
          previewUrl: `data:text/html;base64,${Buffer.from(previewHTML).toString('base64')}`
        }
      });
      
    } catch (error) {
      console.error('Preview white-label error:', error);
      res.status(500).json({
        error: 'Failed to generate preview',
        message: error.message
      });
    }
  }
);

// Reset white-label configuration to defaults
router.post('/reset',
  authenticateApiKey,
  requirePermission('white_label'),
  async (req, res) => {
    try {
      const defaultConfig = getDefaultConfig(req.user);
      whitelabelConfigs.set(req.user.id, defaultConfig);
      
      res.json({
        success: true,
        data: {
          config: defaultConfig,
          message: 'White-label configuration reset to defaults'
        }
      });
      
    } catch (error) {
      console.error('Reset white-label config error:', error);
      res.status(500).json({
        error: 'Failed to reset configuration',
        message: error.message
      });
    }
  }
);

// Helper functions
function getDefaultConfig(user) {
  return {
    userId: user.id,
    teamId: user.teamId,
    branding: {
      companyName: 'Your Company',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#F59E0B',
      backgroundColor: '#111827',
      textColor: '#F9FAFB'
    },
    customization: {
      hideProofPixBranding: false,
      customFooterText: '',
      customSupportEmail: '',
      customDomain: '',
      customTitle: 'EXIF Metadata Extractor',
      customDescription: 'Extract EXIF metadata from your images'
    },
    features: {
      customWelcomeMessage: '',
      customUploadText: '',
      customProcessingText: '',
      showCustomFields: true,
      enableTeamBranding: true
    },
    api: {
      customApiDomain: '',
      customDocumentationUrl: '',
      customSupportUrl: ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function validateColor(color) {
  // Basic hex color validation
  if (!/^#[0-9A-F]{6}$/i.test(color)) {
    throw new Error(`Invalid color format: ${color}. Use hex format like #FF0000`);
  }
  return color;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }
  return email.toLowerCase();
}

function validateDomain(domain) {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    throw new Error(`Invalid domain format: ${domain}`);
  }
  return domain.toLowerCase();
}

function validateUrl(url) {
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error(`Invalid URL format: ${url}`);
  }
}

function generateCustomCSS(config) {
  return `
/* White-label Custom Styles */
:root {
  --primary-color: ${config.branding.primaryColor};
  --secondary-color: ${config.branding.secondaryColor};
  --accent-color: ${config.branding.accentColor};
  --background-color: ${config.branding.backgroundColor};
  --text-color: ${config.branding.textColor};
}

.custom-primary {
  background-color: var(--primary-color) !important;
}

.custom-secondary {
  background-color: var(--secondary-color) !important;
}

.custom-accent {
  background-color: var(--accent-color) !important;
}

.custom-bg {
  background-color: var(--background-color) !important;
}

.custom-text {
  color: var(--text-color) !important;
}

.custom-border {
  border-color: var(--primary-color) !important;
}

/* Hide ProofPix branding if configured */
${config.customization.hideProofPixBranding ? `
.proofpix-branding {
  display: none !important;
}
` : ''}

/* Custom logo styling */
${config.branding.logoUrl ? `
.custom-logo {
  background-image: url('${config.branding.logoUrl}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
` : ''}

/* Button styling */
.btn-custom-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.btn-custom-primary:hover {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.btn-custom-accent {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

/* Form styling */
.form-control-custom {
  border-color: var(--primary-color);
  background-color: var(--background-color);
  color: var(--text-color);
}

.form-control-custom:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 0.2rem rgba(${hexToRgb(config.branding.accentColor)}, 0.25);
}
`;
}

function generatePreviewHTML(config) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.customization.customTitle}</title>
  <style>
    ${generateCustomCSS(config)}
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .preview-container { max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { height: 60px; margin-bottom: 20px; }
    .welcome { padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .upload-area { padding: 40px; border: 2px dashed; border-radius: 8px; text-align: center; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid; }
  </style>
</head>
<body class="custom-bg custom-text">
  <div class="preview-container">
    <div class="header">
      ${config.branding.logoUrl ? `<img src="${config.branding.logoUrl}" alt="Logo" class="logo">` : ''}
      <h1>${config.branding.companyName}</h1>
      <p>${config.customization.customDescription}</p>
    </div>
    
    <div class="welcome custom-primary" style="color: white;">
      <h2>${config.features.customWelcomeMessage || 'Welcome to EXIF Extractor'}</h2>
    </div>
    
    <div class="upload-area custom-border">
      <h3>${config.features.customUploadText || 'Upload your images'}</h3>
      <p>Drag and drop files here or click to browse</p>
    </div>
    
    <div class="footer">
      ${!config.customization.hideProofPixBranding ? '<p class="proofpix-branding">Powered by ProofPix</p>' : ''}
      <p>${config.customization.customFooterText}</p>
      ${config.customization.customSupportEmail ? `<p>Support: ${config.customization.customSupportEmail}</p>` : ''}
    </div>
  </div>
</body>
</html>
`;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
}

module.exports = router; 