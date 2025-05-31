/**
 * Ephemeral Processing Routes
 * API endpoints for collaboration mode with temporary processing
 */

const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { authenticateToken } = require('../middleware/auth');
const ephemeralProcessingService = require('../services/ephemeralProcessingService');
const { auditLog } = require('../services/auditService');
const { logger } = require('../config/database');

const router = express.Router();

// Configure multer for file uploads (memory storage for ephemeral processing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10 // Max 10 files per request
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  }
});

// Rate limiting for ephemeral processing
const ephemeralRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    error: 'Too many ephemeral processing requests, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all ephemeral routes
router.use(ephemeralRateLimit);

/**
 * POST /api/ephemeral/session
 * Create new ephemeral processing session
 */
router.post('/session', authenticateToken, async (req, res) => {
  try {
    const { maxFiles = 10, teamId = null } = req.body;
    const userId = req.user.id;

    // Create ephemeral session
    const result = await ephemeralProcessingService.createEphemeralSession(userId, {
      maxFiles,
      teamId,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });

    // Audit log
    await auditLog(userId, 'ephemeral_session_requested', {
      sessionId: result.sessionId,
      maxFiles,
      teamId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: result,
      message: 'Ephemeral session created successfully'
    });

  } catch (error) {
    logger.error('Failed to create ephemeral session:', error);
    
    await auditLog(req.user?.id, 'ephemeral_session_failed', {
      error: error.message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      success: false,
      error: 'Failed to create ephemeral session',
      message: error.message
    });
  }
});

/**
 * POST /api/ephemeral/process/:sessionId
 * Process files ephemerally
 */
router.post('/process/:sessionId', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files provided'
      });
    }

    // Validate session ownership
    const session = await ephemeralProcessingService.getSession(sessionId);
    if (!session || session.userId !== userId) {
      await auditLog(userId, 'ephemeral_unauthorized_access', {
        sessionId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(403).json({
        success: false,
        error: 'Invalid or unauthorized session'
      });
    }

    // Process files
    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const result = await ephemeralProcessingService.processFileEphemerally(sessionId, file);
        results.push(result);
      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    // Audit log
    await auditLog(userId, 'ephemeral_files_processed', {
      sessionId,
      filesProcessed: results.length,
      filesErrored: errors.length,
      totalFiles: files.length,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        results,
        errors,
        sessionId,
        processed: results.length,
        failed: errors.length
      },
      message: `Processed ${results.length} files successfully`
    });

  } catch (error) {
    logger.error('Ephemeral processing failed:', error);
    
    await auditLog(req.user?.id, 'ephemeral_processing_failed', {
      sessionId: req.params.sessionId,
      error: error.message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      success: false,
      error: 'Ephemeral processing failed',
      message: error.message
    });
  }
});

/**
 * GET /api/ephemeral/result/:sessionId/:fileId
 * Get ephemeral processing result
 */
router.get('/result/:sessionId/:fileId', authenticateToken, async (req, res) => {
  try {
    const { sessionId, fileId } = req.params;
    const userId = req.user.id;

    // Validate session ownership
    const session = await ephemeralProcessingService.getSession(sessionId);
    if (!session || session.userId !== userId) {
      await auditLog(userId, 'ephemeral_unauthorized_result_access', {
        sessionId,
        fileId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(403).json({
        success: false,
        error: 'Invalid or unauthorized session'
      });
    }

    // Get result
    const result = await ephemeralProcessingService.getEphemeralResult(sessionId, fileId);

    res.json({
      success: true,
      data: result,
      message: 'Result retrieved successfully'
    });

  } catch (error) {
    logger.error('Failed to get ephemeral result:', error);
    
    res.status(404).json({
      success: false,
      error: 'Result not found or expired',
      message: error.message
    });
  }
});

/**
 * POST /api/ephemeral/share/:sessionId/:fileId
 * Create ephemeral share link
 */
router.post('/share/:sessionId/:fileId', authenticateToken, async (req, res) => {
  try {
    const { sessionId, fileId } = req.params;
    const { expiresInHours = 1, maxAccess = 10, requiresAuth = false, allowedUsers = [] } = req.body;
    const userId = req.user.id;

    // Validate session ownership
    const session = await ephemeralProcessingService.getSession(sessionId);
    if (!session || session.userId !== userId) {
      await auditLog(userId, 'ephemeral_unauthorized_share', {
        sessionId,
        fileId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(403).json({
        success: false,
        error: 'Invalid or unauthorized session'
      });
    }

    // Create share
    const shareResult = await ephemeralProcessingService.createEphemeralShare(sessionId, fileId, {
      expiresInHours,
      maxAccess,
      requiresAuth,
      allowedUsers
    });

    // Audit log
    await auditLog(userId, 'ephemeral_share_created', {
      sessionId,
      fileId,
      shareToken: shareResult.shareToken,
      expiresInHours,
      maxAccess,
      requiresAuth,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: shareResult,
      message: 'Share link created successfully'
    });

  } catch (error) {
    logger.error('Failed to create ephemeral share:', error);
    
    await auditLog(req.user?.id, 'ephemeral_share_failed', {
      sessionId: req.params.sessionId,
      fileId: req.params.fileId,
      error: error.message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      success: false,
      error: 'Failed to create share link',
      message: error.message
    });
  }
});

/**
 * GET /api/ephemeral/session/:sessionId
 * Get session information
 */
router.get('/session/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Get session
    const session = await ephemeralProcessingService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or expired'
      });
    }

    // Validate ownership
    if (session.userId !== userId) {
      await auditLog(userId, 'ephemeral_unauthorized_session_access', {
        sessionId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to session'
      });
    }

    // Return session info (without sensitive data)
    const sessionInfo = {
      id: session.id,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      mode: session.mode,
      maxFiles: session.maxFiles,
      processedFiles: session.processedFiles,
      status: session.status,
      timeRemaining: session.expiresAt - Date.now()
    };

    res.json({
      success: true,
      data: sessionInfo,
      message: 'Session information retrieved'
    });

  } catch (error) {
    logger.error('Failed to get session info:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get session information',
      message: error.message
    });
  }
});

/**
 * DELETE /api/ephemeral/session/:sessionId
 * Delete ephemeral session and all data
 */
router.delete('/session/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Delete session
    const result = await ephemeralProcessingService.deleteEphemeralSession(sessionId, userId);

    res.json({
      success: true,
      data: result,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    logger.error('Failed to delete ephemeral session:', error);
    
    await auditLog(req.user?.id, 'ephemeral_session_delete_failed', {
      sessionId: req.params.sessionId,
      error: error.message,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      success: false,
      error: 'Failed to delete session',
      message: error.message
    });
  }
});

/**
 * GET /api/ephemeral/status
 * Get ephemeral processing service status
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const status = ephemeralProcessingService.getStatus();
    
    res.json({
      success: true,
      data: status,
      message: 'Service status retrieved'
    });

  } catch (error) {
    logger.error('Failed to get service status:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get service status',
      message: error.message
    });
  }
});

/**
 * Error handling middleware for multer
 */
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'Maximum file size is 50MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files',
        message: 'Maximum 10 files per request'
      });
    }
  }
  
  if (error.message.includes('File type') && error.message.includes('not allowed')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type',
      message: error.message
    });
  }

  next(error);
});

module.exports = router; 