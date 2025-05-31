const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const exifr = require('exifr');
const AWS = require('aws-sdk');
const { logger } = require('../config/database');
const { auditLog } = require('./auditService');
const queueService = require('./queueService');
const db = require('../config/database');

class FileProcessingService {
  constructor() {
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/tiff',
      'image/bmp',
      'application/pdf'
    ];

    this.maxFileSize = 50 * 1024 * 1024; // 50MB
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.thumbnailDir = process.env.THUMBNAIL_DIR || './uploads/thumbnails';

    // Initialize AWS S3 if configured
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      this.s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1'
      });
      this.s3Bucket = process.env.S3_BUCKET_NAME;
      this.useS3 = true;
    } else {
      this.useS3 = false;
    }

    this.ensureDirectories();
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(this.thumbnailDir, { recursive: true });
      logger.info('Upload directories ensured');
    } catch (error) {
      logger.error('Failed to create upload directories:', error);
    }
  }

  // File Upload and Initial Processing
  async processFileUpload(file, userId, options = {}) {
    try {
      // Validate file
      const validation = await this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Generate file hash
      const fileHash = await this.generateFileHash(file.buffer);

      // Check for duplicate files
      const existingFile = await this.checkDuplicateFile(fileHash, userId);
      if (existingFile && !options.allowDuplicates) {
        return {
          success: true,
          file: existingFile,
          duplicate: true,
          message: 'File already exists'
        };
      }

      // Generate unique filename
      const fileName = this.generateUniqueFileName(file.originalname);
      const filePath = path.join(this.uploadDir, fileName);

      // Save file locally first
      await fs.writeFile(filePath, file.buffer);

      // Create file record in database
      const fileRecord = await this.createFileRecord({
        userId,
        fileName,
        originalName: file.originalname,
        filePath: this.useS3 ? null : filePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileHash,
        metadata: {
          uploadedAt: new Date(),
          userAgent: options.userAgent,
          ipAddress: options.ipAddress
        }
      });

      // Queue processing jobs
      await this.queueProcessingJobs(fileRecord.id, userId, {
        virusScan: true,
        exifExtraction: this.isImageFile(file.mimetype),
        thumbnailGeneration: this.isImageFile(file.mimetype),
        s3Upload: this.useS3
      });

      await auditLog(userId, 'file_uploaded', {
        fileId: fileRecord.id,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype
      });

      return {
        success: true,
        file: fileRecord,
        duplicate: false,
        message: 'File uploaded successfully and queued for processing'
      };
    } catch (error) {
      logger.error('File upload processing failed:', error);
      throw error;
    }
  }

  async validateFile(file) {
    try {
      // Check file size
      if (file.size > this.maxFileSize) {
        return {
          valid: false,
          error: `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`
        };
      }

      // Check MIME type
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        return {
          valid: false,
          error: `File type ${file.mimetype} is not allowed`
        };
      }

      // Verify file type matches content using dynamic import
      try {
        const { fileTypeFromBuffer } = await import('file-type');
        const detectedType = await fileTypeFromBuffer(file.buffer);
        if (detectedType && !this.allowedMimeTypes.includes(detectedType.mime)) {
          return {
            valid: false,
            error: 'File content does not match declared type'
          };
        }
      } catch (importError) {
        logger.warn('File type detection unavailable, skipping content verification');
      }

      // Check for malicious content patterns
      const maliciousCheck = await this.checkMaliciousContent(file.buffer);
      if (!maliciousCheck.safe) {
        return {
          valid: false,
          error: maliciousCheck.reason
        };
      }

      return { valid: true };
    } catch (error) {
      logger.error('File validation error:', error);
      return {
        valid: false,
        error: 'File validation failed'
      };
    }
  }

  async checkMaliciousContent(buffer) {
    try {
      const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1024));
      
      // Check for script tags and other suspicious patterns
      const maliciousPatterns = [
        /<script[^>]*>/i,
        /javascript:/i,
        /vbscript:/i,
        /onload\s*=/i,
        /onerror\s*=/i,
        /%3Cscript/i,
        /\x00/g // Null bytes
      ];

      for (const pattern of maliciousPatterns) {
        if (pattern.test(content)) {
          return {
            safe: false,
            reason: 'Potentially malicious content detected'
          };
        }
      }

      return { safe: true };
    } catch (error) {
      logger.error('Malicious content check error:', error);
      return { safe: true }; // Default to safe if check fails
    }
  }

  async generateFileHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  generateUniqueFileName(originalName) {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${timestamp}_${random}${ext}`;
  }

  async checkDuplicateFile(fileHash, userId) {
    try {
      const result = await db.query(`
        SELECT * FROM files 
        WHERE file_hash = $1 AND user_id = $2 
        ORDER BY created_at DESC 
        LIMIT 1
      `, [fileHash, userId]);

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Duplicate file check error:', error);
      return null;
    }
  }

  async createFileRecord(fileData) {
    try {
      const result = await db.query(`
        INSERT INTO files (
          user_id, file_name, original_name, file_path, file_size,
          mime_type, file_hash, metadata, processing_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
        RETURNING *
      `, [
        fileData.userId,
        fileData.fileName,
        fileData.originalName,
        fileData.filePath,
        fileData.fileSize,
        fileData.mimeType,
        fileData.fileHash,
        JSON.stringify(fileData.metadata)
      ]);

      return result.rows[0];
    } catch (error) {
      logger.error('Failed to create file record:', error);
      throw error;
    }
  }

  async queueProcessingJobs(fileId, userId, options) {
    try {
      const jobs = [];

      // Virus scan job (highest priority)
      if (options.virusScan) {
        jobs.push(queueService.addFileProcessingJob({
          type: 'virus-scan',
          fileId,
          userId
        }, { priority: 10 }));
      }

      // EXIF extraction job
      if (options.exifExtraction) {
        jobs.push(queueService.addFileProcessingJob({
          type: 'exif-extraction',
          fileId,
          userId
        }, { priority: 5 }));
      }

      // Thumbnail generation job
      if (options.thumbnailGeneration) {
        jobs.push(queueService.addFileProcessingJob({
          type: 'thumbnail-generation',
          fileId,
          userId
        }, { priority: 3 }));
      }

      // S3 upload job (after virus scan)
      if (options.s3Upload) {
        jobs.push(queueService.addFileProcessingJob({
          type: 's3-upload',
          fileId,
          userId
        }, { priority: 1, delay: 5000 })); // Delay to allow virus scan
      }

      await Promise.all(jobs);
      logger.info(`Queued ${jobs.length} processing jobs for file ${fileId}`);
    } catch (error) {
      logger.error('Failed to queue processing jobs:', error);
      throw error;
    }
  }

  // Virus Scanning
  async performVirusScan(fileId) {
    try {
      await this.updateFileProcessingStatus(fileId, 'processing');
      await this.updateVirusScanStatus(fileId, 'scanning');

      const file = await this.getFileById(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      // Read file for scanning
      const filePath = file.file_path;
      const fileBuffer = await fs.readFile(filePath);

      // Perform virus scan (using ClamAV or similar)
      const scanResult = await this.scanFileForViruses(fileBuffer, filePath);

      if (scanResult.infected) {
        await this.updateVirusScanStatus(fileId, 'infected', scanResult.details);
        await this.updateFileProcessingStatus(fileId, 'virus_detected');
        
        // Delete infected file
        await this.deleteFile(filePath);
        
        await auditLog(file.user_id, 'virus_detected', {
          fileId,
          fileName: file.original_name,
          virusDetails: scanResult.details
        });

        return {
          success: false,
          infected: true,
          details: scanResult.details
        };
      } else {
        await this.updateVirusScanStatus(fileId, 'clean');
        
        await auditLog(file.user_id, 'virus_scan_clean', {
          fileId,
          fileName: file.original_name
        });

        return {
          success: true,
          infected: false,
          details: 'File is clean'
        };
      }
    } catch (error) {
      logger.error('Virus scan failed:', error);
      await this.updateVirusScanStatus(fileId, 'error', error.message);
      throw error;
    }
  }

  async scanFileForViruses(buffer, filePath) {
    try {
      // This is a placeholder implementation
      // In production, you would integrate with ClamAV or another antivirus solution
      
      // Simple pattern-based detection for demonstration
      const suspiciousPatterns = [
        /EICAR-STANDARD-ANTIVIRUS-TEST-FILE/,
        /X5O!P%@AP\[4\\PZX54\(P\^\)7CC\)7\}\$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!\$H\+H\*/
      ];

      const content = buffer.toString('binary');
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
          return {
            infected: true,
            details: 'Test virus signature detected'
          };
        }
      }

      // Check file size for zip bombs
      if (buffer.length > this.maxFileSize * 2) {
        return {
          infected: true,
          details: 'Suspicious file size detected'
        };
      }

      return {
        infected: false,
        details: 'No threats detected'
      };
    } catch (error) {
      logger.error('Virus scanning error:', error);
      return {
        infected: false,
        details: 'Scan completed with warnings'
      };
    }
  }

  // EXIF Metadata Extraction
  async extractExifData(fileId) {
    try {
      const file = await this.getFileById(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      if (!this.isImageFile(file.mime_type)) {
        return {
          success: false,
          error: 'File is not an image'
        };
      }

      const filePath = file.file_path;
      const exifData = await exifr.parse(filePath, {
        pick: [
          'Make', 'Model', 'DateTime', 'DateTimeOriginal', 'DateTimeDigitized',
          'ExposureTime', 'FNumber', 'ISO', 'FocalLength', 'Flash',
          'WhiteBalance', 'ExposureMode', 'MeteringMode', 'SceneCaptureType',
          'ImageWidth', 'ImageHeight', 'Orientation', 'XResolution', 'YResolution',
          'Software', 'Artist', 'Copyright', 'GPS'
        ]
      });

      // Clean and process EXIF data
      const processedExifData = this.processExifData(exifData);

      // Update file record with EXIF data
      await db.query(`
        UPDATE files SET exif_data = $1 WHERE id = $2
      `, [JSON.stringify(processedExifData), fileId]);

      await auditLog(file.user_id, 'exif_extracted', {
        fileId,
        fileName: file.original_name,
        exifFields: Object.keys(processedExifData || {})
      });

      return {
        success: true,
        exifData: processedExifData
      };
    } catch (error) {
      logger.error('EXIF extraction failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  processExifData(exifData) {
    if (!exifData) return null;

    const processed = {};

    // Camera information
    if (exifData.Make) processed.camera = {};
    if (exifData.Make) processed.camera.make = exifData.Make;
    if (exifData.Model) processed.camera.model = exifData.Model;
    if (exifData.Software) processed.camera.software = exifData.Software;

    // Date information
    if (exifData.DateTime || exifData.DateTimeOriginal || exifData.DateTimeDigitized) {
      processed.dates = {};
      if (exifData.DateTime) processed.dates.modified = exifData.DateTime;
      if (exifData.DateTimeOriginal) processed.dates.taken = exifData.DateTimeOriginal;
      if (exifData.DateTimeDigitized) processed.dates.digitized = exifData.DateTimeDigitized;
    }

    // Technical settings
    if (exifData.ExposureTime || exifData.FNumber || exifData.ISO || exifData.FocalLength) {
      processed.settings = {};
      if (exifData.ExposureTime) processed.settings.exposureTime = exifData.ExposureTime;
      if (exifData.FNumber) processed.settings.aperture = exifData.FNumber;
      if (exifData.ISO) processed.settings.iso = exifData.ISO;
      if (exifData.FocalLength) processed.settings.focalLength = exifData.FocalLength;
      if (exifData.Flash) processed.settings.flash = exifData.Flash;
      if (exifData.WhiteBalance) processed.settings.whiteBalance = exifData.WhiteBalance;
    }

    // Image dimensions
    if (exifData.ImageWidth || exifData.ImageHeight) {
      processed.dimensions = {};
      if (exifData.ImageWidth) processed.dimensions.width = exifData.ImageWidth;
      if (exifData.ImageHeight) processed.dimensions.height = exifData.ImageHeight;
      if (exifData.Orientation) processed.dimensions.orientation = exifData.Orientation;
    }

    // GPS information (be careful with privacy)
    if (exifData.GPS && Object.keys(exifData.GPS).length > 0) {
      processed.location = {
        hasGPS: true,
        // Don't store exact coordinates for privacy
        approximate: this.approximateGPSLocation(exifData.GPS)
      };
    }

    // Copyright and artist information
    if (exifData.Artist || exifData.Copyright) {
      processed.rights = {};
      if (exifData.Artist) processed.rights.artist = exifData.Artist;
      if (exifData.Copyright) processed.rights.copyright = exifData.Copyright;
    }

    return processed;
  }

  approximateGPSLocation(gps) {
    // Return approximate location (city/region level) for privacy
    if (gps.latitude && gps.longitude) {
      return {
        region: 'Location data available',
        coordinates: 'Available but not displayed for privacy'
      };
    }
    return null;
  }

  // Thumbnail Generation
  async generateThumbnail(fileId) {
    try {
      const file = await this.getFileById(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      if (!this.isImageFile(file.mime_type)) {
        return {
          success: false,
          error: 'File is not an image'
        };
      }

      const filePath = file.file_path;
      const thumbnailFileName = `thumb_${file.file_name}`;
      const thumbnailPath = path.join(this.thumbnailDir, thumbnailFileName);

      // Generate thumbnail using Sharp
      await sharp(filePath)
        .resize(300, 300, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      // Update file record with thumbnail path
      await db.query(`
        UPDATE files SET thumbnail_path = $1 WHERE id = $2
      `, [thumbnailPath, fileId]);

      await auditLog(file.user_id, 'thumbnail_generated', {
        fileId,
        fileName: file.original_name,
        thumbnailPath
      });

      return {
        success: true,
        thumbnailPath
      };
    } catch (error) {
      logger.error('Thumbnail generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // S3 Upload
  async uploadToS3(fileId) {
    try {
      if (!this.useS3) {
        return {
          success: false,
          error: 'S3 not configured'
        };
      }

      const file = await this.getFileById(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      const filePath = file.file_path;
      const fileBuffer = await fs.readFile(filePath);

      const s3Key = `files/${file.user_id}/${file.file_name}`;
      
      const uploadParams = {
        Bucket: this.s3Bucket,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: file.mime_type,
        Metadata: {
          originalName: file.original_name,
          userId: file.user_id.toString(),
          uploadDate: new Date().toISOString()
        }
      };

      const result = await this.s3.upload(uploadParams).promise();

      // Update file record with S3 URL
      await db.query(`
        UPDATE files SET 
          file_path = $1,
          metadata = metadata || $2
        WHERE id = $3
      `, [
        result.Location,
        JSON.stringify({ s3Key, s3Bucket: this.s3Bucket }),
        fileId
      ]);

      // Delete local file after successful S3 upload
      await this.deleteFile(filePath);

      await auditLog(file.user_id, 's3_upload_completed', {
        fileId,
        fileName: file.original_name,
        s3Location: result.Location
      });

      return {
        success: true,
        s3Location: result.Location,
        s3Key
      };
    } catch (error) {
      logger.error('S3 upload failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Utility Methods
  isImageFile(mimeType) {
    return mimeType.startsWith('image/');
  }

  async getFileById(fileId) {
    try {
      const result = await db.query('SELECT * FROM files WHERE id = $1', [fileId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Failed to get file by ID:', error);
      return null;
    }
  }

  async updateFileProcessingStatus(fileId, status) {
    try {
      await db.query(`
        UPDATE files SET 
          processing_status = $1,
          processing_started_at = CASE WHEN $1 = 'processing' THEN NOW() ELSE processing_started_at END,
          processing_completed_at = CASE WHEN $1 IN ('completed', 'failed', 'virus_detected') THEN NOW() ELSE processing_completed_at END
        WHERE id = $2
      `, [status, fileId]);
    } catch (error) {
      logger.error('Failed to update file processing status:', error);
    }
  }

  async updateVirusScanStatus(fileId, status, result = null) {
    try {
      await db.query(`
        UPDATE files SET 
          virus_scan_status = $1,
          virus_scan_result = $2
        WHERE id = $3
      `, [status, result, fileId]);
    } catch (error) {
      logger.error('Failed to update virus scan status:', error);
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.error('Failed to delete file:', error);
    }
  }

  // File Cleanup
  async cleanupExpiredFiles() {
    try {
      const expiredFiles = await db.query(`
        SELECT * FROM files 
        WHERE expires_at IS NOT NULL AND expires_at < NOW()
      `);

      for (const file of expiredFiles.rows) {
        try {
          // Delete from S3 if applicable
          if (this.useS3 && file.metadata?.s3Key) {
            await this.s3.deleteObject({
              Bucket: this.s3Bucket,
              Key: file.metadata.s3Key
            }).promise();
          }

          // Delete local files
          if (file.file_path && !file.file_path.startsWith('http')) {
            await this.deleteFile(file.file_path);
          }
          
          if (file.thumbnail_path) {
            await this.deleteFile(file.thumbnail_path);
          }

          // Delete from database
          await db.query('DELETE FROM files WHERE id = $1', [file.id]);

          await auditLog(file.user_id, 'file_expired_deleted', {
            fileId: file.id,
            fileName: file.original_name
          });
        } catch (error) {
          logger.error(`Failed to cleanup expired file ${file.id}:`, error);
        }
      }

      logger.info(`Cleaned up ${expiredFiles.rows.length} expired files`);
      return expiredFiles.rows.length;
    } catch (error) {
      logger.error('File cleanup failed:', error);
      throw error;
    }
  }
}

const fileProcessingService = new FileProcessingService();

module.exports = fileProcessingService; 