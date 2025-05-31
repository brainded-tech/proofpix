/**
 * Template Management Routes
 * Provides API endpoints for template creation, management, and marketplace features
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireSubscription } = require('../middleware/auth');
const { auditLog } = require('../services/auditService');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');

// Rate limiting for template endpoints
const templateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: 'Too many template requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all template routes
router.use(templateRateLimit);

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
 * GET /api/templates
 * Get templates with filtering and pagination
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      industry, 
      search, 
      featured,
      subscriptionTier = 'free'
    } = req.query;

    // Mock template data (would typically come from database)
    const templates = [
      {
        id: '1',
        name: 'Standard Proof Template',
        description: 'Basic proof template for general use',
        category: 'general',
        industry: 'all',
        subscriptionTier: 'free',
        featured: true,
        thumbnail: '/templates/standard-preview.png',
        settings: {
          watermark: true,
          compression: 'medium',
          format: 'jpg',
          quality: 85
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        downloads: 1250,
        rating: 4.5,
        author: 'ProofPix Team'
      },
      {
        id: '2',
        name: 'Photography Portfolio',
        description: 'Professional template for photography portfolios',
        category: 'portfolio',
        industry: 'photography',
        subscriptionTier: 'professional',
        featured: true,
        thumbnail: '/templates/photography-preview.png',
        settings: {
          watermark: false,
          compression: 'low',
          format: 'png',
          quality: 95
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        downloads: 890,
        rating: 4.8,
        author: 'ProofPix Team'
      },
      {
        id: '3',
        name: 'Enterprise Brand Template',
        description: 'Corporate branding template with advanced features',
        category: 'branding',
        industry: 'corporate',
        subscriptionTier: 'enterprise',
        featured: false,
        thumbnail: '/templates/enterprise-preview.png',
        settings: {
          watermark: true,
          compression: 'none',
          format: 'png',
          quality: 100,
          customBranding: true
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        downloads: 456,
        rating: 4.9,
        author: 'ProofPix Team'
      }
    ];

    // Filter templates based on query parameters
    let filteredTemplates = templates;

    if (category) {
      filteredTemplates = filteredTemplates.filter(t => t.category === category);
    }

    if (industry) {
      filteredTemplates = filteredTemplates.filter(t => t.industry === industry || t.industry === 'all');
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTemplates = filteredTemplates.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }

    if (featured === 'true') {
      filteredTemplates = filteredTemplates.filter(t => t.featured);
    }

    // Filter by subscription tier access
    const tierHierarchy = { free: 0, professional: 1, enterprise: 2 };
    const userTierLevel = tierHierarchy[subscriptionTier] || 0;
    
    filteredTemplates = filteredTemplates.filter(t => {
      const templateTierLevel = tierHierarchy[t.subscriptionTier] || 0;
      return templateTierLevel <= userTierLevel;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        templates: paginatedTemplates,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredTemplates.length,
          pages: Math.ceil(filteredTemplates.length / limit)
        },
        filters: {
          categories: ['general', 'portfolio', 'branding', 'marketing', 'ecommerce'],
          industries: ['all', 'photography', 'corporate', 'retail', 'healthcare', 'education'],
          subscriptionTiers: ['free', 'professional', 'enterprise']
        }
      }
    });
  } catch (error) {
    console.error('Failed to get templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve templates'
    });
  }
});

/**
 * GET /api/templates/:id
 * Get specific template details
 */
router.get('/:id', 
  [param('id').notEmpty().withMessage('Template ID is required')],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Mock template data (would typically come from database)
      const template = {
        id,
        name: 'Standard Proof Template',
        description: 'Basic proof template for general use with comprehensive settings',
        category: 'general',
        industry: 'all',
        subscriptionTier: 'free',
        featured: true,
        thumbnail: '/templates/standard-preview.png',
        previewImages: [
          '/templates/standard-preview-1.png',
          '/templates/standard-preview-2.png',
          '/templates/standard-preview-3.png'
        ],
        settings: {
          watermark: {
            enabled: true,
            text: 'PROOF',
            opacity: 0.3,
            position: 'center',
            fontSize: 48,
            color: '#ffffff'
          },
          compression: 'medium',
          format: 'jpg',
          quality: 85,
          dimensions: {
            width: 1920,
            height: 1080,
            maintainAspectRatio: true
          },
          metadata: {
            includeExif: false,
            includeTimestamp: true,
            includeLocation: false
          }
        },
        customization: {
          colors: ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'],
          fonts: ['Arial', 'Helvetica', 'Times New Roman', 'Courier'],
          layouts: ['standard', 'grid', 'masonry', 'carousel']
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        downloads: 1250,
        rating: 4.5,
        reviews: 89,
        author: 'ProofPix Team',
        version: '1.2.0',
        changelog: [
          { version: '1.2.0', date: new Date(), changes: 'Added new watermark options' },
          { version: '1.1.0', date: new Date(Date.now() - 86400000), changes: 'Improved compression algorithm' },
          { version: '1.0.0', date: new Date(Date.now() - 172800000), changes: 'Initial release' }
        ]
      };

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json({
        success: true,
        data: { template }
      });
    } catch (error) {
      console.error('Failed to get template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve template'
      });
    }
  }
);

/**
 * POST /api/templates
 * Create new template (Professional/Enterprise only)
 */
router.post('/',
  requireAuth,
  requireSubscription('professional'),
  [
    body('name').isLength({ min: 1, max: 100 }).trim().withMessage('Template name is required (1-100 characters)'),
    body('description').isLength({ min: 1, max: 500 }).trim().withMessage('Description is required (1-500 characters)'),
    body('category').isIn(['general', 'portfolio', 'branding', 'marketing', 'ecommerce']).withMessage('Valid category is required'),
    body('industry').optional().isLength({ max: 50 }).trim(),
    body('settings').isObject().withMessage('Settings object is required'),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { name, description, category, industry = 'all', settings, customization = {} } = req.body;
      
      // Create new template
      const newTemplate = {
        id: Date.now().toString(), // Would typically be generated by database
        name,
        description,
        category,
        industry,
        subscriptionTier: req.user.subscriptionTier,
        featured: false,
        thumbnail: null, // Would be generated after upload
        settings,
        customization,
        createdAt: new Date(),
        updatedAt: new Date(),
        downloads: 0,
        rating: 0,
        reviews: 0,
        author: `${req.user.firstName} ${req.user.lastName}`,
        authorId: req.user.userId,
        version: '1.0.0',
        status: 'draft'
      };

      await auditLog(req.user.userId, 'template_created', {
        templateId: newTemplate.id,
        templateName: name,
        category,
        industry
      });

      res.status(201).json({
        success: true,
        data: { template: newTemplate },
        message: 'Template created successfully'
      });
    } catch (error) {
      console.error('Failed to create template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create template'
      });
    }
  }
);

/**
 * PUT /api/templates/:id
 * Update template (owner or admin only)
 */
router.put('/:id',
  requireAuth,
  [
    param('id').notEmpty().withMessage('Template ID is required'),
    body('name').optional().isLength({ min: 1, max: 100 }).trim(),
    body('description').optional().isLength({ min: 1, max: 500 }).trim(),
    body('category').optional().isIn(['general', 'portfolio', 'branding', 'marketing', 'ecommerce']),
    body('settings').optional().isObject(),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Check if user owns the template or is admin
      // This would typically involve a database query
      const canEdit = true; // Placeholder logic
      
      if (!canEdit) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to edit this template'
        });
      }

      // Update template
      const updatedTemplate = {
        id,
        ...updates,
        updatedAt: new Date(),
        version: '1.1.0' // Would increment version appropriately
      };

      await auditLog(req.user.userId, 'template_updated', {
        templateId: id,
        updates: Object.keys(updates)
      });

      res.json({
        success: true,
        data: { template: updatedTemplate },
        message: 'Template updated successfully'
      });
    } catch (error) {
      console.error('Failed to update template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update template'
      });
    }
  }
);

/**
 * DELETE /api/templates/:id
 * Delete template (owner or admin only)
 */
router.delete('/:id',
  requireAuth,
  [param('id').notEmpty().withMessage('Template ID is required')],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if user owns the template or is admin
      const canDelete = true; // Placeholder logic
      
      if (!canDelete) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this template'
        });
      }

      // Delete template (typically soft delete)
      await auditLog(req.user.userId, 'template_deleted', {
        templateId: id
      });

      res.json({
        success: true,
        message: 'Template deleted successfully'
      });
    } catch (error) {
      console.error('Failed to delete template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete template'
      });
    }
  }
);

/**
 * POST /api/templates/:id/download
 * Download/use template
 */
router.post('/:id/download',
  requireAuth,
  [param('id').notEmpty().withMessage('Template ID is required')],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check subscription access
      // This would typically involve checking the template's subscription tier
      
      // Record download
      await auditLog(req.user.userId, 'template_downloaded', {
        templateId: id
      });

      // Return template data for use
      const templateData = {
        id,
        downloadUrl: `/api/templates/${id}/file`,
        settings: {
          // Template settings would be returned here
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };

      res.json({
        success: true,
        data: templateData,
        message: 'Template ready for download'
      });
    } catch (error) {
      console.error('Failed to download template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download template'
      });
    }
  }
);

/**
 * POST /api/templates/:id/review
 * Add review for template
 */
router.post('/:id/review',
  requireAuth,
  [
    param('id').notEmpty().withMessage('Template ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isLength({ max: 1000 }).trim()
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      
      // Create review
      const review = {
        id: Date.now().toString(),
        templateId: id,
        userId: req.user.userId,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        rating,
        comment,
        createdAt: new Date()
      };

      await auditLog(req.user.userId, 'template_reviewed', {
        templateId: id,
        rating,
        hasComment: !!comment
      });

      res.status(201).json({
        success: true,
        data: { review },
        message: 'Review added successfully'
      });
    } catch (error) {
      console.error('Failed to add review:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add review'
      });
    }
  }
);

/**
 * GET /api/templates/:id/reviews
 * Get template reviews
 */
router.get('/:id/reviews',
  [param('id').notEmpty().withMessage('Template ID is required')],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      // Mock reviews data
      const reviews = [
        {
          id: '1',
          templateId: id,
          userName: 'John Doe',
          rating: 5,
          comment: 'Excellent template, very professional!',
          createdAt: new Date()
        },
        {
          id: '2',
          templateId: id,
          userName: 'Jane Smith',
          rating: 4,
          comment: 'Good template, easy to use.',
          createdAt: new Date(Date.now() - 86400000)
        }
      ];

      res.json({
        success: true,
        data: {
          reviews,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: reviews.length,
            pages: Math.ceil(reviews.length / limit)
          },
          summary: {
            averageRating: 4.5,
            totalReviews: reviews.length,
            ratingDistribution: {
              5: 1,
              4: 1,
              3: 0,
              2: 0,
              1: 0
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to get reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve reviews'
      });
    }
  }
);

/**
 * GET /api/templates/user/my-templates
 * Get user's created templates
 */
router.get('/user/my-templates', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    // Mock user templates
    const userTemplates = [
      {
        id: '1',
        name: 'My Custom Template',
        description: 'Personal template for my projects',
        category: 'general',
        status: 'published',
        downloads: 45,
        rating: 4.2,
        reviews: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    let filteredTemplates = userTemplates;
    if (status) {
      filteredTemplates = filteredTemplates.filter(t => t.status === status);
    }

    res.json({
      success: true,
      data: {
        templates: filteredTemplates,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredTemplates.length,
          pages: Math.ceil(filteredTemplates.length / limit)
        },
        summary: {
          total: userTemplates.length,
          published: userTemplates.filter(t => t.status === 'published').length,
          draft: userTemplates.filter(t => t.status === 'draft').length,
          totalDownloads: userTemplates.reduce((sum, t) => sum + t.downloads, 0)
        }
      }
    });
  } catch (error) {
    console.error('Failed to get user templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user templates'
    });
  }
});

module.exports = router; 