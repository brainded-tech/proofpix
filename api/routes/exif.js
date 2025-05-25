const express = require('express');
const multer = require('multer');
const exifr = require('exifr');
const rateLimit = require('express-rate-limit');
const { authenticateApiKey } = require('../middleware/auth');
const { validateApiUsage } = require('../middleware/usage');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Max 10 files per request
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/heic', 'image/heif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // Different limits based on plan
    const plan = req.user?.plan || 'free';
    switch (plan) {
      case 'enterprise': return 1000;
      case 'pro': return 500;
      case 'starter': return 100;
      default: return 50;
    }
  },
  message: {
    error: 'Rate limit exceeded',
    message: 'Too many API requests. Please upgrade your plan for higher limits.'
  }
});

// Extract EXIF from single image
router.post('/extract', 
  apiLimiter,
  authenticateApiKey,
  validateApiUsage,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No image file provided',
          message: 'Please upload an image file'
        });
      }

      // Extract EXIF data
      const exifData = await exifr.parse(req.file.buffer, {
        gps: true,
        tiff: true,
        exif: true,
        icc: false,
        iptc: false,
        xmp: false,
        mergeOutput: true,
        sanitize: true,
        reviveValues: true
      });

      // Process and format the data
      const processedData = {
        filename: req.file.originalname,
        filesize: req.file.size,
        mimetype: req.file.mimetype,
        metadata: {
          // Camera Information
          camera: {
            make: exifData?.Make,
            model: exifData?.Model,
            software: exifData?.Software,
            lens: exifData?.LensModel
          },
          
          // Camera Settings
          settings: {
            aperture: exifData?.FNumber,
            shutterSpeed: exifData?.ExposureTime,
            iso: exifData?.ISO,
            focalLength: exifData?.FocalLength,
            focalLength35mm: exifData?.FocalLengthIn35mmFormat,
            flash: exifData?.Flash,
            whiteBalance: exifData?.WhiteBalance,
            meteringMode: exifData?.MeteringMode,
            exposureProgram: exifData?.ExposureProgram
          },
          
          // Date/Time
          datetime: {
            taken: exifData?.DateTimeOriginal,
            modified: exifData?.DateTime,
            digitized: exifData?.DateTimeDigitized
          },
          
          // GPS Location
          gps: exifData?.latitude && exifData?.longitude ? {
            latitude: exifData.latitude,
            longitude: exifData.longitude,
            altitude: exifData?.GPSAltitude,
            accuracy: exifData?.GPSHPositioningError
          } : null,
          
          // Technical Details
          technical: {
            width: exifData?.ImageWidth || exifData?.ExifImageWidth,
            height: exifData?.ImageHeight || exifData?.ExifImageHeight,
            orientation: exifData?.Orientation,
            colorSpace: exifData?.ColorSpace,
            xResolution: exifData?.XResolution,
            yResolution: exifData?.YResolution,
            resolutionUnit: exifData?.ResolutionUnit
          },
          
          // Custom fields (if user has defined any)
          custom: req.user?.customFields ? 
            extractCustomFields(exifData, req.user.customFields) : {}
        },
        
        // API metadata
        api: {
          version: '1.0',
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - req.startTime,
          plan: req.user?.plan || 'free'
        }
      };

      // Track API usage
      await req.trackApiUsage('extract', 1);

      res.json({
        success: true,
        data: processedData
      });

    } catch (error) {
      console.error('EXIF extraction error:', error);
      res.status(500).json({
        error: 'Extraction failed',
        message: error.message
      });
    }
  }
);

// Batch extract EXIF from multiple images
router.post('/extract/batch',
  apiLimiter,
  authenticateApiKey,
  validateApiUsage,
  upload.array('images', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          error: 'No image files provided',
          message: 'Please upload at least one image file'
        });
      }

      const results = [];
      const errors = [];

      // Process each file
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        
        try {
          const exifData = await exifr.parse(file.buffer, {
            gps: true,
            tiff: true,
            exif: true,
            icc: false,
            iptc: false,
            xmp: false,
            mergeOutput: true,
            sanitize: true,
            reviveValues: true
          });

          results.push({
            index: i,
            filename: file.originalname,
            filesize: file.size,
            mimetype: file.mimetype,
            metadata: formatExifData(exifData, req.user?.customFields),
            success: true
          });

        } catch (error) {
          errors.push({
            index: i,
            filename: file.originalname,
            error: error.message,
            success: false
          });
        }
      }

      // Track API usage
      await req.trackApiUsage('batch_extract', req.files.length);

      res.json({
        success: true,
        processed: results.length,
        errors: errors.length,
        data: {
          results,
          errors,
          summary: {
            total: req.files.length,
            successful: results.length,
            failed: errors.length,
            processingTime: Date.now() - req.startTime
          }
        }
      });

    } catch (error) {
      console.error('Batch extraction error:', error);
      res.status(500).json({
        error: 'Batch extraction failed',
        message: error.message
      });
    }
  }
);

// Get API usage statistics
router.get('/usage',
  authenticateApiKey,
  async (req, res) => {
    try {
      const usage = await req.getApiUsage();
      
      res.json({
        success: true,
        data: {
          plan: req.user?.plan || 'free',
          usage: usage,
          limits: getApiLimits(req.user?.plan),
          resetDate: getNextResetDate()
        }
      });

    } catch (error) {
      console.error('Usage retrieval error:', error);
      res.status(500).json({
        error: 'Failed to retrieve usage',
        message: error.message
      });
    }
  }
);

// Helper functions
function extractCustomFields(exifData, customFields) {
  const custom = {};
  
  customFields.forEach(field => {
    if (exifData[field.exifKey]) {
      custom[field.name] = {
        value: exifData[field.exifKey],
        type: field.type,
        description: field.description
      };
    }
  });
  
  return custom;
}

function formatExifData(exifData, customFields) {
  return {
    camera: {
      make: exifData?.Make,
      model: exifData?.Model,
      software: exifData?.Software,
      lens: exifData?.LensModel
    },
    settings: {
      aperture: exifData?.FNumber,
      shutterSpeed: exifData?.ExposureTime,
      iso: exifData?.ISO,
      focalLength: exifData?.FocalLength,
      flash: exifData?.Flash,
      whiteBalance: exifData?.WhiteBalance
    },
    datetime: {
      taken: exifData?.DateTimeOriginal,
      modified: exifData?.DateTime
    },
    gps: exifData?.latitude && exifData?.longitude ? {
      latitude: exifData.latitude,
      longitude: exifData.longitude,
      altitude: exifData?.GPSAltitude
    } : null,
    custom: customFields ? extractCustomFields(exifData, customFields) : {}
  };
}

function getApiLimits(plan) {
  const limits = {
    free: { requests: 50, files: 100 },
    starter: { requests: 100, files: 500 },
    pro: { requests: 500, files: 2500 },
    enterprise: { requests: 1000, files: 10000 }
  };
  
  return limits[plan] || limits.free;
}

function getNextResetDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

module.exports = router; 