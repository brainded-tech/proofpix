const express = require('express');
const multer = require('multer');
const router = express.Router();
const { authenticateToken, authenticateApiKey } = require('../middleware/auth');
const { checkQuota, trackUsage, requireFeature } = require('../middleware/quota');
const fileProcessingService = require('../services/fileProcessingService');
const webhookService = require('../services/webhookService');
const { auditLog } = require('../services/auditService');
const db = require('../config/database');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/files.log' })
  ]
});


// Rate limiting for file operations
const fileUploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 uploads per windowMs
  message: { error: 'Too many file uploads, please try again later' }
});

const fileDownloadLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 downloads per windowMs
  message: { error: 'Too many file downloads, please try again later' }
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10 // Max 10 files per request
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/tiff',
      'image/bmp',
      'application/pdf'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  }
});

// Authentication middleware that supports both JWT and API key
const authenticate = async (req, res, next) => {
  // Check for API key first
  const apiKey = req.headers['x-api-key'];
  const apiSecret = req.headers['x-api-secret'];

  if (apiKey && apiSecret) {
    return authenticateApiKey(req, res, next);
  } else {
    return authenticateToken(req, res, next);
  }
};

// File Upload Routes

// Upload single file
router.post('/upload', 
  authenticate,
  fileUploadLimit,
  checkQuota('fileUploads', 1),
  upload.single('file'),
  trackUsage('fileUploads', 1),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file provided'
        });
      }

      const options = {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        allowDuplicates: req.body.allowDuplicates === 'true',
        expiresIn: req.body.expiresIn ? parseInt(req.body.expiresIn) : null
      };

      const result = await fileProcessingService.processFileUpload(
        req.file,
        req.user.id,
        options
      );

      // Trigger webhook event
      await webhookService.triggerEvent('file.uploaded', {
        fileId: result.file.id,
        fileName: result.file.original_name,
        fileSize: result.file.file_size,
        mimeType: result.file.mime_type,
        duplicate: result.duplicate
      }, req.user.id);

      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Upload multiple files
router.post('/upload/batch',
  authenticate,
  fileUploadLimit,
  checkQuota('fileUploads', 10), // Check for max 10 files
  upload.array('files', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files provided'
        });
      }

      const options = {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        allowDuplicates: req.body.allowDuplicates === 'true'
      };

      const results = [];
      let successCount = 0;
      let errorCount = 0;

      for (const file of req.files) {
        try {
          const result = await fileProcessingService.processFileUpload(
            file,
            req.user.id,
            options
          );
          results.push(result);
          successCount++;

          // Trigger webhook event for each file
          await webhookService.triggerEvent('file.uploaded', {
            fileId: result.file.id,
            fileName: result.file.original_name,
            fileSize: result.file.file_size,
            mimeType: result.file.mime_type,
            duplicate: result.duplicate
          }, req.user.id);
        } catch (error) {
          results.push({
            success: false,
            fileName: file.originalname,
            error: error.message
          });
          errorCount++;
        }
      }

      // Track usage for successful uploads
      if (successCount > 0) {
        await trackUsage('fileUploads', successCount);
      }

      res.json({
        success: true,
        results,
        summary: {
          total: req.files.length,
          successful: successCount,
          failed: errorCount
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// File Management Routes

// Get user's files
router.get('/',
  authenticate,
  async (req, res) => {
    try {
      const { page = 1, limit = 20, status, mimeType, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE user_id = $1';
      const params = [req.user.id, limit, offset];
      let paramCount = 1;

      if (status) {
        whereClause += ` AND processing_status = $${++paramCount}`;
        params.splice(paramCount - 1, 0, status);
      }

      if (mimeType) {
        whereClause += ` AND mime_type LIKE $${++paramCount}`;
        params.splice(paramCount - 1, 0, `${mimeType}%`);
      }

      const allowedSortFields = ['created_at', 'file_size', 'original_name', 'processing_status'];
      const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
      const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      const files = await db.query(`
        SELECT id, original_name, file_size, mime_type, processing_status,
               virus_scan_status, upload_date, processing_completed_at,
               download_count, expires_at, is_public, created_at
        FROM files
        ${whereClause}
        ORDER BY ${sortField} ${order}
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `, params);

      const totalCount = await db.query(`
        SELECT COUNT(*) as count FROM files ${whereClause}
      `, params.slice(0, paramCount));

      res.json({
        success: true,
        files: files.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(totalCount.rows[0].count),
          pages: Math.ceil(parseInt(totalCount.rows[0].count) / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get specific file details
router.get('/:fileId',
  authenticate,
  async (req, res) => {
    try {
      const { fileId } = req.params;

      const file = await db.query(`
        SELECT * FROM files
        WHERE id = $1 AND user_id = $2
      `, [fileId, req.user.id]);

      if (file.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      res.json({
        success: true,
        file: file.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Download file
router.get('/:fileId/download',
  authenticate,
  fileDownloadLimit,
  async (req, res) => {
    try {
      const { fileId } = req.params;

      const file = await db.query(`
        SELECT * FROM files
        WHERE id = $1 AND (user_id = $2 OR is_public = true)
      `, [fileId, req.user.id]);

      if (file.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      const fileRecord = file.rows[0];

      // Check if file processing is complete
      if (fileRecord.processing_status !== 'completed') {
        return res.status(400).json({
          success: false,
          error: 'File is still being processed'
        });
      }

      // Check if file has virus
      if (fileRecord.virus_scan_status === 'infected') {
        return res.status(400).json({
          success: false,
          error: 'File contains virus and cannot be downloaded'
        });
      }

      // Increment download count
      await db.query(`
        UPDATE files SET download_count = download_count + 1
        WHERE id = $1
      `, [fileId]);

      // Set appropriate headers
      res.setHeader('Content-Type', fileRecord.mime_type);
      res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.original_name}"`);

      // If file is stored in S3, redirect to S3 URL
      if (fileRecord.file_path.startsWith('http')) {
        return res.redirect(fileRecord.file_path);
      }

      // Serve local file
      res.sendFile(fileRecord.file_path, { root: '/' });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get file thumbnail
router.get('/:fileId/thumbnail',
  authenticate,
  fileDownloadLimit,
  async (req, res) => {
    try {
      const { fileId } = req.params;

      const file = await db.query(`
        SELECT * FROM files
        WHERE id = $1 AND (user_id = $2 OR is_public = true)
      `, [fileId, req.user.id]);

      if (file.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      const fileRecord = file.rows[0];

      if (!fileRecord.thumbnail_path) {
        return res.status(404).json({
          success: false,
          error: 'Thumbnail not available'
        });
      }

      res.setHeader('Content-Type', 'image/jpeg');
      res.sendFile(fileRecord.thumbnail_path, { root: '/' });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// EXIF Data Routes

// Get EXIF data
router.get('/:fileId/exif',
  authenticate,
  requireFeature('exif:read'),
  async (req, res) => {
    try {
      const { fileId } = req.params;

      const file = await db.query(`
        SELECT exif_data, original_name, mime_type FROM files
        WHERE id = $1 AND user_id = $2
      `, [fileId, req.user.id]);

      if (file.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      const fileRecord = file.rows[0];

      if (!fileRecord.mime_type.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          error: 'EXIF data is only available for image files'
        });
      }

      res.json({
        success: true,
        fileName: fileRecord.original_name,
        exifData: fileRecord.exif_data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Extract EXIF data (manual trigger)
router.post('/:fileId/exif/extract',
  authenticate,
  requireFeature('exif:extract'),
  checkQuota('apiCalls', 1),
  trackUsage('apiCalls', 1),
  async (req, res) => {
    try {
      const { fileId } = req.params;

      const file = await db.query(`
        SELECT * FROM files
        WHERE id = $1 AND user_id = $2
      `, [fileId, req.user.id]);

      if (file.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      const result = await fileProcessingService.extractExifData(fileId);

      if (result.success) {
        // Trigger webhook event
        await webhookService.triggerEvent('exif.extracted', {
          fileId,
          fileName: file.rows[0].original_name,
          exifData: result.exifData
        }, req.user.id);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// File Operations

// Update file metadata
router.put('/:fileId',
  authenticate,
  async (req, res) => {
    try {
      const { fileId } = req.params;
      const { isPublic, expiresAt } = req.body;

      const updates = {};
      if (typeof isPublic === 'boolean') {
        updates.is_public = isPublic;
      }
      if (expiresAt) {
        updates.expires_at = new Date(expiresAt);
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid fields to update'
        });
      }

      const updateFields = Object.keys(updates).map((field, index) => `${field} = $${index + 2}`);
      const updateValues = [fileId, req.user.id, ...Object.values(updates)];

      const result = await db.query(`
        UPDATE files 
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `, updateValues);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      await auditLog(req.user.id, 'file_updated', {
        fileId,
        updates: Object.keys(updates)
      });

      res.json({
        success: true,
        file: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Delete file
router.delete('/:fileId',
  authenticate,
  requireFeature('files:delete'),
  async (req, res) => {
    try {
      const { fileId } = req.params;

      const file = await db.query(`
        SELECT * FROM files
        WHERE id = $1 AND user_id = $2
      `, [fileId, req.user.id]);

      if (file.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      const fileRecord = file.rows[0];

      // Delete from storage (S3 or local)
      if (fileRecord.file_path) {
        if (fileRecord.file_path.startsWith('http')) {
          // Delete from S3
          const s3Key = fileRecord.metadata?.s3Key;
          if (s3Key && fileProcessingService.useS3) {
            await fileProcessingService.s3.deleteObject({
              Bucket: fileProcessingService.s3Bucket,
              Key: s3Key
            }).promise();
          }
        } else {
          // Delete local file
          await fileProcessingService.deleteFile(fileRecord.file_path);
        }
      }

      // Delete thumbnail
      if (fileRecord.thumbnail_path) {
        await fileProcessingService.deleteFile(fileRecord.thumbnail_path);
      }

      // Delete from database
      await db.query('DELETE FROM files WHERE id = $1', [fileId]);

      await auditLog(req.user.id, 'file_deleted', {
        fileId,
        fileName: fileRecord.original_name
      });

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// File Processing Status

// Get processing status
router.get('/:fileId/status',
  authenticate,
  async (req, res) => {
    try {
      const { fileId } = req.params;

      const file = await db.query(`
        SELECT processing_status, virus_scan_status, processing_started_at,
               processing_completed_at, processing_error
        FROM files
        WHERE id = $1 AND user_id = $2
      `, [fileId, req.user.id]);

      if (file.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      res.json({
        success: true,
        status: file.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// File Statistics

// Get user file statistics
router.get('/stats/overview',
  authenticate,
  async (req, res) => {
    try {
      const stats = await db.query(`
        SELECT 
          COUNT(*) as total_files,
          SUM(file_size) as total_size,
          COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) as processed_files,
          COUNT(CASE WHEN processing_status = 'pending' THEN 1 END) as pending_files,
          COUNT(CASE WHEN processing_status = 'failed' THEN 1 END) as failed_files,
          COUNT(CASE WHEN virus_scan_status = 'infected' THEN 1 END) as infected_files,
          SUM(download_count) as total_downloads
        FROM files
        WHERE user_id = $1
      `, [req.user.id]);

      const mimeTypeStats = await db.query(`
        SELECT 
          mime_type,
          COUNT(*) as count,
          SUM(file_size) as total_size
        FROM files
        WHERE user_id = $1
        GROUP BY mime_type
        ORDER BY count DESC
      `, [req.user.id]);

      res.json({
        success: true,
        overview: stats.rows[0],
        mimeTypes: mimeTypeStats.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get file metadata (EXIF, processing details, etc.)
router.get('/:fileId/metadata',
  authenticate,
  async (req, res) => {
    try {
      const { fileId } = req.params;

      const file = await db.query(`
        SELECT * FROM files
        WHERE id = $1 AND user_id = $2
      `, [fileId, req.user.id]);

      if (file.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      const fileRecord = file.rows[0];

      // Get EXIF data if available
      let exifData = null;
      if (fileRecord.exif_data) {
        try {
          exifData = JSON.parse(fileRecord.exif_data);
        } catch (e) {
          logger.warn('Failed to parse EXIF data for file', fileId);
        }
      }

      // Get processing metadata
      const metadata = {
        fileId: fileRecord.id,
        originalName: fileRecord.original_name,
        mimeType: fileRecord.mime_type,
        fileSize: fileRecord.file_size,
        processingStatus: fileRecord.processing_status,
        virusScanStatus: fileRecord.virus_scan_status,
        uploadDate: fileRecord.upload_date,
        processingCompletedAt: fileRecord.processing_completed_at,
        exifData: exifData,
        dimensions: fileRecord.image_width && fileRecord.image_height ? {
          width: fileRecord.image_width,
          height: fileRecord.image_height
        } : null,
        colorProfile: fileRecord.color_profile,
        compression: fileRecord.compression_type,
        quality: fileRecord.image_quality,
        hasWatermark: fileRecord.has_watermark || false,
        processingTime: fileRecord.processing_time_ms,
        checksums: {
          md5: fileRecord.md5_hash,
          sha256: fileRecord.sha256_hash
        }
      };

      res.json({
        success: true,
        metadata
      });
    } catch (error) {
      logger.error('Failed to get file metadata:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get file processing status
router.get('/:fileId/status',
  authenticate,
  async (req, res) => {
    try {
      const { fileId } = req.params;

      const file = await db.query(`
        SELECT id, processing_status, virus_scan_status, processing_progress,
               processing_error, processing_started_at, processing_completed_at,
               processing_time_ms, queue_position
        FROM files
        WHERE id = $1 AND user_id = $2
      `, [fileId, req.user.id]);

      if (file.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      const fileRecord = file.rows[0];

      // Calculate progress percentage
      let progress = 0;
      switch (fileRecord.processing_status) {
        case 'pending':
          progress = 0;
          break;
        case 'processing':
          progress = fileRecord.processing_progress || 50;
          break;
        case 'completed':
          progress = 100;
          break;
        case 'failed':
          progress = 0;
          break;
        default:
          progress = 0;
      }

      const status = {
        fileId: fileRecord.id,
        status: fileRecord.processing_status,
        progress: progress,
        virusScanStatus: fileRecord.virus_scan_status,
        error: fileRecord.processing_error,
        startedAt: fileRecord.processing_started_at,
        completedAt: fileRecord.processing_completed_at,
        processingTime: fileRecord.processing_time_ms,
        queuePosition: fileRecord.queue_position,
        estimatedTimeRemaining: fileRecord.queue_position ? fileRecord.queue_position * 30 : null // 30 seconds per file estimate
      };

      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      logger.error('Failed to get file status:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Error handling middleware
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds the maximum allowed size'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files in request'
      });
    }
  }

  logger.error('File route error:', { error: error.message, stack: error.stack });
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

module.exports = router; 