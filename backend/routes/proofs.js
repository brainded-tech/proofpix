/**
 * Proof Management Routes
 * Provides API endpoints for proof creation, review, approval, and collaboration
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireSubscription } = require('../middleware/auth');
const { auditLog } = require('../services/auditService');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');

// Rate limiting for proof endpoints
const proofRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: 'Too many proof requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all proof routes
router.use(proofRateLimit);

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
 * GET /api/proofs
 * Get proofs with filtering and pagination
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      project, 
      client,
      dateFrom,
      dateTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Mock proof data (would typically come from database)
    const proofs = [
      {
        id: '1',
        name: 'Product Photography - Main Shot',
        description: 'Hero image for product launch campaign',
        status: 'pending_review',
        project: 'Summer Collection 2024',
        client: 'Fashion Brand Co.',
        clientId: 'client_123',
        templateId: 'template_1',
        originalFile: {
          name: 'product_hero.jpg',
          size: 2048576,
          type: 'image/jpeg',
          url: '/uploads/proofs/product_hero.jpg'
        },
        proofFile: {
          name: 'product_hero_proof.jpg',
          size: 1536000,
          type: 'image/jpeg',
          url: '/uploads/proofs/product_hero_proof.jpg',
          watermarked: true
        },
        metadata: {
          dimensions: { width: 1920, height: 1080 },
          fileSize: '2.0 MB',
          format: 'JPEG',
          colorSpace: 'sRGB',
          dpi: 300
        },
        settings: {
          watermark: {
            text: 'PROOF - NOT FOR PRODUCTION',
            opacity: 0.3,
            position: 'center'
          },
          compression: 'medium',
          quality: 85
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: req.user.userId,
        assignedTo: ['reviewer_1', 'reviewer_2'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        priority: 'high',
        tags: ['product', 'hero', 'campaign'],
        version: 1,
        revisions: [],
        comments: [],
        approvals: []
      },
      {
        id: '2',
        name: 'Website Banner Design',
        description: 'Homepage banner for Q4 promotion',
        status: 'approved',
        project: 'Q4 Marketing Campaign',
        client: 'E-commerce Store',
        clientId: 'client_456',
        templateId: 'template_2',
        originalFile: {
          name: 'banner_design.png',
          size: 3145728,
          type: 'image/png',
          url: '/uploads/proofs/banner_design.png'
        },
        proofFile: {
          name: 'banner_design_proof.png',
          size: 2097152,
          type: 'image/png',
          url: '/uploads/proofs/banner_design_proof.png',
          watermarked: true
        },
        metadata: {
          dimensions: { width: 1200, height: 400 },
          fileSize: '3.0 MB',
          format: 'PNG',
          colorSpace: 'sRGB',
          dpi: 72
        },
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
        createdBy: req.user.userId,
        assignedTo: ['reviewer_3'],
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        tags: ['banner', 'web', 'promotion'],
        version: 2,
        revisions: [
          {
            version: 1,
            changes: 'Initial version',
            createdAt: new Date(Date.now() - 86400000)
          }
        ],
        comments: [
          {
            id: 'comment_1',
            text: 'Looks great! Approved.',
            author: 'reviewer_3',
            createdAt: new Date(Date.now() - 3600000)
          }
        ],
        approvals: [
          {
            id: 'approval_1',
            approver: 'reviewer_3',
            status: 'approved',
            createdAt: new Date(Date.now() - 3600000)
          }
        ]
      }
    ];

    // Filter proofs based on query parameters
    let filteredProofs = proofs;

    if (status) {
      filteredProofs = filteredProofs.filter(p => p.status === status);
    }

    if (project) {
      filteredProofs = filteredProofs.filter(p => 
        p.project.toLowerCase().includes(project.toLowerCase())
      );
    }

    if (client) {
      filteredProofs = filteredProofs.filter(p => 
        p.client.toLowerCase().includes(client.toLowerCase())
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProofs = filteredProofs.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredProofs = filteredProofs.filter(p => p.createdAt >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredProofs = filteredProofs.filter(p => p.createdAt <= toDate);
    }

    // Sort proofs
    filteredProofs.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProofs = filteredProofs.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        proofs: paginatedProofs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredProofs.length,
          pages: Math.ceil(filteredProofs.length / limit)
        },
        filters: {
          statuses: ['draft', 'pending_review', 'in_review', 'needs_revision', 'approved', 'rejected'],
          priorities: ['low', 'medium', 'high', 'urgent'],
          sortOptions: ['createdAt', 'updatedAt', 'name', 'dueDate', 'priority']
        },
        summary: {
          total: filteredProofs.length,
          byStatus: {
            draft: filteredProofs.filter(p => p.status === 'draft').length,
            pending_review: filteredProofs.filter(p => p.status === 'pending_review').length,
            in_review: filteredProofs.filter(p => p.status === 'in_review').length,
            needs_revision: filteredProofs.filter(p => p.status === 'needs_revision').length,
            approved: filteredProofs.filter(p => p.status === 'approved').length,
            rejected: filteredProofs.filter(p => p.status === 'rejected').length
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to get proofs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve proofs'
    });
  }
});

/**
 * GET /api/proofs/:id
 * Get specific proof details
 */
router.get('/:id', 
  requireAuth,
  [param('id').notEmpty().withMessage('Proof ID is required')],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Mock proof data (would typically come from database)
      const proof = {
        id,
        name: 'Product Photography - Main Shot',
        description: 'Hero image for product launch campaign with detailed specifications',
        status: 'pending_review',
        project: 'Summer Collection 2024',
        client: 'Fashion Brand Co.',
        clientId: 'client_123',
        templateId: 'template_1',
        originalFile: {
          name: 'product_hero.jpg',
          size: 2048576,
          type: 'image/jpeg',
          url: '/uploads/proofs/product_hero.jpg',
          checksum: 'abc123def456'
        },
        proofFile: {
          name: 'product_hero_proof.jpg',
          size: 1536000,
          type: 'image/jpeg',
          url: '/uploads/proofs/product_hero_proof.jpg',
          watermarked: true,
          checksum: 'def456ghi789'
        },
        metadata: {
          dimensions: { width: 1920, height: 1080 },
          fileSize: '2.0 MB',
          format: 'JPEG',
          colorSpace: 'sRGB',
          dpi: 300,
          exif: {
            camera: 'Canon EOS R5',
            lens: 'RF 24-70mm f/2.8L IS USM',
            settings: 'f/8, 1/125s, ISO 100'
          }
        },
        settings: {
          watermark: {
            text: 'PROOF - NOT FOR PRODUCTION',
            opacity: 0.3,
            position: 'center',
            fontSize: 48,
            color: '#ffffff'
          },
          compression: 'medium',
          quality: 85,
          format: 'jpeg'
        },
        workflow: {
          steps: [
            { name: 'Upload', status: 'completed', completedAt: new Date(Date.now() - 3600000) },
            { name: 'Processing', status: 'completed', completedAt: new Date(Date.now() - 3000000) },
            { name: 'Review', status: 'in_progress', startedAt: new Date(Date.now() - 1800000) },
            { name: 'Approval', status: 'pending' },
            { name: 'Delivery', status: 'pending' }
          ]
        },
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(),
        createdBy: req.user.userId,
        assignedTo: ['reviewer_1', 'reviewer_2'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'high',
        tags: ['product', 'hero', 'campaign'],
        version: 1,
        revisions: [],
        comments: [
          {
            id: 'comment_1',
            text: 'Please review the color balance in the upper right corner.',
            author: 'reviewer_1',
            authorName: 'John Reviewer',
            createdAt: new Date(Date.now() - 1800000),
            position: { x: 75, y: 25 }, // Percentage coordinates for annotation
            resolved: false
          }
        ],
        approvals: [],
        permissions: {
          canEdit: true,
          canDelete: true,
          canApprove: false,
          canComment: true,
          canDownload: true
        }
      };

      if (!proof) {
        return res.status(404).json({
          success: false,
          message: 'Proof not found'
        });
      }

      res.json({
        success: true,
        data: { proof }
      });
    } catch (error) {
      console.error('Failed to get proof:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve proof'
      });
    }
  }
);

/**
 * POST /api/proofs
 * Create new proof
 */
router.post('/',
  requireAuth,
  [
    body('name').isLength({ min: 1, max: 200 }).trim().withMessage('Proof name is required (1-200 characters)'),
    body('description').optional().isLength({ max: 1000 }).trim(),
    body('project').optional().isLength({ max: 100 }).trim(),
    body('client').optional().isLength({ max: 100 }).trim(),
    body('templateId').optional().isUUID().withMessage('Valid template ID required'),
    body('dueDate').optional().isISO8601().withMessage('Valid due date required'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Valid priority required'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { 
        name, 
        description, 
        project, 
        client, 
        templateId, 
        dueDate, 
        priority = 'medium', 
        tags = [],
        assignedTo = []
      } = req.body;
      
      // Create new proof
      const newProof = {
        id: Date.now().toString(), // Would typically be generated by database
        name,
        description,
        status: 'draft',
        project,
        client,
        templateId,
        originalFile: null, // Will be set when file is uploaded
        proofFile: null,
        metadata: {},
        settings: {
          watermark: {
            text: 'PROOF',
            opacity: 0.3,
            position: 'center'
          },
          compression: 'medium',
          quality: 85
        },
        workflow: {
          steps: [
            { name: 'Upload', status: 'pending' },
            { name: 'Processing', status: 'pending' },
            { name: 'Review', status: 'pending' },
            { name: 'Approval', status: 'pending' },
            { name: 'Delivery', status: 'pending' }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: req.user.userId,
        assignedTo,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        tags,
        version: 1,
        revisions: [],
        comments: [],
        approvals: []
      };

      await auditLog(req.user.userId, 'proof_created', {
        proofId: newProof.id,
        proofName: name,
        project,
        client
      });

      res.status(201).json({
        success: true,
        data: { proof: newProof },
        message: 'Proof created successfully'
      });
    } catch (error) {
      console.error('Failed to create proof:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create proof'
      });
    }
  }
);

/**
 * PUT /api/proofs/:id
 * Update proof
 */
router.put('/:id',
  requireAuth,
  [
    param('id').notEmpty().withMessage('Proof ID is required'),
    body('name').optional().isLength({ min: 1, max: 200 }).trim(),
    body('description').optional().isLength({ max: 1000 }).trim(),
    body('status').optional().isIn(['draft', 'pending_review', 'in_review', 'needs_revision', 'approved', 'rejected']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Check permissions (would typically involve database query)
      const canEdit = true; // Placeholder logic
      
      if (!canEdit) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to edit this proof'
        });
      }

      // Update proof
      const updatedProof = {
        id,
        ...updates,
        updatedAt: new Date()
      };

      await auditLog(req.user.userId, 'proof_updated', {
        proofId: id,
        updates: Object.keys(updates)
      });

      res.json({
        success: true,
        data: { proof: updatedProof },
        message: 'Proof updated successfully'
      });
    } catch (error) {
      console.error('Failed to update proof:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update proof'
      });
    }
  }
);

/**
 * POST /api/proofs/:id/comments
 * Add comment to proof
 */
router.post('/:id/comments',
  requireAuth,
  [
    param('id').notEmpty().withMessage('Proof ID is required'),
    body('text').isLength({ min: 1, max: 2000 }).trim().withMessage('Comment text is required (1-2000 characters)'),
    body('position').optional().isObject().withMessage('Position must be an object'),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { text, position } = req.body;
      
      // Create comment
      const comment = {
        id: Date.now().toString(),
        proofId: id,
        text,
        author: req.user.userId,
        authorName: `${req.user.firstName} ${req.user.lastName}`,
        position,
        createdAt: new Date(),
        resolved: false
      };

      await auditLog(req.user.userId, 'proof_comment_added', {
        proofId: id,
        commentId: comment.id,
        hasPosition: !!position
      });

      res.status(201).json({
        success: true,
        data: { comment },
        message: 'Comment added successfully'
      });
    } catch (error) {
      console.error('Failed to add comment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add comment'
      });
    }
  }
);

/**
 * PUT /api/proofs/:id/comments/:commentId/resolve
 * Resolve comment
 */
router.put('/:id/comments/:commentId/resolve',
  requireAuth,
  [
    param('id').notEmpty().withMessage('Proof ID is required'),
    param('commentId').notEmpty().withMessage('Comment ID is required'),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id, commentId } = req.params;
      
      await auditLog(req.user.userId, 'proof_comment_resolved', {
        proofId: id,
        commentId
      });

      res.json({
        success: true,
        message: 'Comment resolved successfully'
      });
    } catch (error) {
      console.error('Failed to resolve comment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resolve comment'
      });
    }
  }
);

/**
 * POST /api/proofs/:id/approve
 * Approve proof
 */
router.post('/:id/approve',
  requireAuth,
  [
    param('id').notEmpty().withMessage('Proof ID is required'),
    body('comment').optional().isLength({ max: 1000 }).trim(),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      
      // Create approval
      const approval = {
        id: Date.now().toString(),
        proofId: id,
        approver: req.user.userId,
        approverName: `${req.user.firstName} ${req.user.lastName}`,
        status: 'approved',
        comment,
        createdAt: new Date()
      };

      await auditLog(req.user.userId, 'proof_approved', {
        proofId: id,
        approvalId: approval.id,
        hasComment: !!comment
      });

      res.status(201).json({
        success: true,
        data: { approval },
        message: 'Proof approved successfully'
      });
    } catch (error) {
      console.error('Failed to approve proof:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to approve proof'
      });
    }
  }
);

/**
 * POST /api/proofs/:id/reject
 * Reject proof
 */
router.post('/:id/reject',
  requireAuth,
  [
    param('id').notEmpty().withMessage('Proof ID is required'),
    body('reason').isLength({ min: 1, max: 1000 }).trim().withMessage('Rejection reason is required (1-1000 characters)'),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      // Create rejection
      const rejection = {
        id: Date.now().toString(),
        proofId: id,
        reviewer: req.user.userId,
        reviewerName: `${req.user.firstName} ${req.user.lastName}`,
        status: 'rejected',
        reason,
        createdAt: new Date()
      };

      await auditLog(req.user.userId, 'proof_rejected', {
        proofId: id,
        rejectionId: rejection.id,
        reason
      });

      res.status(201).json({
        success: true,
        data: { rejection },
        message: 'Proof rejected successfully'
      });
    } catch (error) {
      console.error('Failed to reject proof:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject proof'
      });
    }
  }
);

/**
 * POST /api/proofs/:id/revisions
 * Create new revision
 */
router.post('/:id/revisions',
  requireAuth,
  [
    param('id').notEmpty().withMessage('Proof ID is required'),
    body('changes').isLength({ min: 1, max: 1000 }).trim().withMessage('Change description is required (1-1000 characters)'),
  ],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { changes } = req.body;
      
      // Create revision
      const revision = {
        id: Date.now().toString(),
        proofId: id,
        version: 2, // Would increment based on existing revisions
        changes,
        createdBy: req.user.userId,
        createdAt: new Date(),
        status: 'draft'
      };

      await auditLog(req.user.userId, 'proof_revision_created', {
        proofId: id,
        revisionId: revision.id,
        version: revision.version
      });

      res.status(201).json({
        success: true,
        data: { revision },
        message: 'Revision created successfully'
      });
    } catch (error) {
      console.error('Failed to create revision:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create revision'
      });
    }
  }
);

/**
 * GET /api/proofs/:id/download
 * Download proof file
 */
router.get('/:id/download',
  requireAuth,
  [param('id').notEmpty().withMessage('Proof ID is required')],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { type = 'proof' } = req.query; // 'proof' or 'original'
      
      // Check permissions
      const canDownload = true; // Placeholder logic
      
      if (!canDownload) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to download this proof'
        });
      }

      await auditLog(req.user.userId, 'proof_downloaded', {
        proofId: id,
        downloadType: type
      });

      // Return download URL or stream file
      res.json({
        success: true,
        data: {
          downloadUrl: `/api/proofs/${id}/file?type=${type}`,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        },
        message: 'Download ready'
      });
    } catch (error) {
      console.error('Failed to download proof:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download proof'
      });
    }
  }
);

/**
 * DELETE /api/proofs/:id
 * Delete proof
 */
router.delete('/:id',
  requireAuth,
  [param('id').notEmpty().withMessage('Proof ID is required')],
  validateErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check permissions
      const canDelete = true; // Placeholder logic
      
      if (!canDelete) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this proof'
        });
      }

      await auditLog(req.user.userId, 'proof_deleted', {
        proofId: id
      });

      res.json({
        success: true,
        message: 'Proof deleted successfully'
      });
    } catch (error) {
      console.error('Failed to delete proof:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete proof'
      });
    }
  }
);

module.exports = router; 