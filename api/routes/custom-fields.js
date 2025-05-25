const express = require('express');
const { authenticateApiKey, requirePermission } = require('../middleware/auth');
const router = express.Router();

// Get all custom fields for the authenticated user
router.get('/',
  authenticateApiKey,
  requirePermission('custom_fields'),
  async (req, res) => {
    try {
      const customFields = req.user.customFields || [];
      
      res.json({
        success: true,
        data: {
          fields: customFields,
          count: customFields.length,
          maxFields: getMaxCustomFields(req.user.plan)
        }
      });
      
    } catch (error) {
      console.error('Get custom fields error:', error);
      res.status(500).json({
        error: 'Failed to retrieve custom fields',
        message: error.message
      });
    }
  }
);

// Create a new custom field
router.post('/',
  authenticateApiKey,
  requirePermission('custom_fields'),
  async (req, res) => {
    try {
      const { name, exifKey, type, description, validation } = req.body;
      
      // Validate required fields
      if (!name || !exifKey || !type) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'name, exifKey, and type are required'
        });
      }
      
      // Validate field type
      const allowedTypes = ['string', 'number', 'date', 'boolean', 'array'];
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({
          error: 'Invalid field type',
          message: `Type must be one of: ${allowedTypes.join(', ')}`
        });
      }
      
      // Check if user has reached max custom fields
      const currentFields = req.user.customFields || [];
      const maxFields = getMaxCustomFields(req.user.plan);
      
      if (currentFields.length >= maxFields) {
        return res.status(403).json({
          error: 'Custom field limit reached',
          message: `Your ${req.user.plan} plan allows maximum ${maxFields} custom fields`
        });
      }
      
      // Check if field name already exists
      if (currentFields.some(field => field.name === name)) {
        return res.status(409).json({
          error: 'Field name already exists',
          message: `A custom field with name '${name}' already exists`
        });
      }
      
      // Check if EXIF key already mapped
      if (currentFields.some(field => field.exifKey === exifKey)) {
        return res.status(409).json({
          error: 'EXIF key already mapped',
          message: `EXIF key '${exifKey}' is already mapped to another field`
        });
      }
      
      // Create new custom field
      const newField = {
        id: 'cf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        exifKey: exifKey.trim(),
        type,
        description: description?.trim() || '',
        validation: validation || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to user's custom fields
      req.user.customFields = [...currentFields, newField];
      
      res.status(201).json({
        success: true,
        data: newField,
        message: 'Custom field created successfully'
      });
      
    } catch (error) {
      console.error('Create custom field error:', error);
      res.status(500).json({
        error: 'Failed to create custom field',
        message: error.message
      });
    }
  }
);

// Update an existing custom field
router.put('/:fieldId',
  authenticateApiKey,
  requirePermission('custom_fields'),
  async (req, res) => {
    try {
      const { fieldId } = req.params;
      const { name, exifKey, type, description, validation } = req.body;
      
      const customFields = req.user.customFields || [];
      const fieldIndex = customFields.findIndex(field => field.id === fieldId);
      
      if (fieldIndex === -1) {
        return res.status(404).json({
          error: 'Custom field not found',
          message: `No custom field found with ID '${fieldId}'`
        });
      }
      
      const existingField = customFields[fieldIndex];
      
      // Validate field type if provided
      if (type) {
        const allowedTypes = ['string', 'number', 'date', 'boolean', 'array'];
        if (!allowedTypes.includes(type)) {
          return res.status(400).json({
            error: 'Invalid field type',
            message: `Type must be one of: ${allowedTypes.join(', ')}`
          });
        }
      }
      
      // Check for name conflicts (excluding current field)
      if (name && customFields.some((field, index) => 
        index !== fieldIndex && field.name === name)) {
        return res.status(409).json({
          error: 'Field name already exists',
          message: `A custom field with name '${name}' already exists`
        });
      }
      
      // Check for EXIF key conflicts (excluding current field)
      if (exifKey && customFields.some((field, index) => 
        index !== fieldIndex && field.exifKey === exifKey)) {
        return res.status(409).json({
          error: 'EXIF key already mapped',
          message: `EXIF key '${exifKey}' is already mapped to another field`
        });
      }
      
      // Update field
      const updatedField = {
        ...existingField,
        name: name?.trim() || existingField.name,
        exifKey: exifKey?.trim() || existingField.exifKey,
        type: type || existingField.type,
        description: description?.trim() ?? existingField.description,
        validation: validation || existingField.validation,
        updatedAt: new Date().toISOString()
      };
      
      req.user.customFields[fieldIndex] = updatedField;
      
      res.json({
        success: true,
        data: updatedField,
        message: 'Custom field updated successfully'
      });
      
    } catch (error) {
      console.error('Update custom field error:', error);
      res.status(500).json({
        error: 'Failed to update custom field',
        message: error.message
      });
    }
  }
);

// Delete a custom field
router.delete('/:fieldId',
  authenticateApiKey,
  requirePermission('custom_fields'),
  async (req, res) => {
    try {
      const { fieldId } = req.params;
      
      const customFields = req.user.customFields || [];
      const fieldIndex = customFields.findIndex(field => field.id === fieldId);
      
      if (fieldIndex === -1) {
        return res.status(404).json({
          error: 'Custom field not found',
          message: `No custom field found with ID '${fieldId}'`
        });
      }
      
      const deletedField = customFields[fieldIndex];
      req.user.customFields.splice(fieldIndex, 1);
      
      res.json({
        success: true,
        data: deletedField,
        message: 'Custom field deleted successfully'
      });
      
    } catch (error) {
      console.error('Delete custom field error:', error);
      res.status(500).json({
        error: 'Failed to delete custom field',
        message: error.message
      });
    }
  }
);

// Get available EXIF keys for mapping
router.get('/available-keys',
  authenticateApiKey,
  requirePermission('custom_fields'),
  async (req, res) => {
    try {
      const availableKeys = [
        // Camera Information
        { key: 'Make', category: 'Camera', description: 'Camera manufacturer' },
        { key: 'Model', category: 'Camera', description: 'Camera model' },
        { key: 'Software', category: 'Camera', description: 'Software used' },
        { key: 'LensModel', category: 'Camera', description: 'Lens model' },
        { key: 'SerialNumber', category: 'Camera', description: 'Camera serial number' },
        { key: 'Artist', category: 'Camera', description: 'Photographer name' },
        { key: 'Copyright', category: 'Camera', description: 'Copyright information' },
        
        // Camera Settings
        { key: 'FNumber', category: 'Settings', description: 'Aperture f-number' },
        { key: 'ExposureTime', category: 'Settings', description: 'Shutter speed' },
        { key: 'ISO', category: 'Settings', description: 'ISO sensitivity' },
        { key: 'FocalLength', category: 'Settings', description: 'Focal length in mm' },
        { key: 'FocalLengthIn35mmFormat', category: 'Settings', description: '35mm equivalent focal length' },
        { key: 'Flash', category: 'Settings', description: 'Flash settings' },
        { key: 'WhiteBalance', category: 'Settings', description: 'White balance mode' },
        { key: 'MeteringMode', category: 'Settings', description: 'Metering mode' },
        { key: 'ExposureProgram', category: 'Settings', description: 'Exposure program' },
        { key: 'ExposureMode', category: 'Settings', description: 'Exposure mode' },
        { key: 'SceneCaptureType', category: 'Settings', description: 'Scene capture type' },
        
        // Date/Time
        { key: 'DateTime', category: 'DateTime', description: 'File modification date' },
        { key: 'DateTimeOriginal', category: 'DateTime', description: 'Original capture date' },
        { key: 'DateTimeDigitized', category: 'DateTime', description: 'Digitization date' },
        { key: 'SubSecTime', category: 'DateTime', description: 'Sub-second time' },
        
        // GPS Information
        { key: 'GPSLatitude', category: 'GPS', description: 'GPS latitude' },
        { key: 'GPSLongitude', category: 'GPS', description: 'GPS longitude' },
        { key: 'GPSAltitude', category: 'GPS', description: 'GPS altitude' },
        { key: 'GPSSpeed', category: 'GPS', description: 'GPS speed' },
        { key: 'GPSImgDirection', category: 'GPS', description: 'Image direction' },
        { key: 'GPSDestBearing', category: 'GPS', description: 'Destination bearing' },
        
        // Technical Details
        { key: 'ImageWidth', category: 'Technical', description: 'Image width in pixels' },
        { key: 'ImageHeight', category: 'Technical', description: 'Image height in pixels' },
        { key: 'Orientation', category: 'Technical', description: 'Image orientation' },
        { key: 'XResolution', category: 'Technical', description: 'Horizontal resolution' },
        { key: 'YResolution', category: 'Technical', description: 'Vertical resolution' },
        { key: 'ResolutionUnit', category: 'Technical', description: 'Resolution unit' },
        { key: 'ColorSpace', category: 'Technical', description: 'Color space' },
        { key: 'Compression', category: 'Technical', description: 'Compression method' },
        
        // Custom/User Fields
        { key: 'UserComment', category: 'Custom', description: 'User comment' },
        { key: 'ImageDescription', category: 'Custom', description: 'Image description' },
        { key: 'DocumentName', category: 'Custom', description: 'Document name' },
        { key: 'PageName', category: 'Custom', description: 'Page name' },
        { key: 'HostComputer', category: 'Custom', description: 'Host computer' }
      ];
      
      // Filter out already mapped keys
      const mappedKeys = (req.user.customFields || []).map(field => field.exifKey);
      const available = availableKeys.filter(key => !mappedKeys.includes(key.key));
      
      res.json({
        success: true,
        data: {
          available,
          mapped: mappedKeys,
          categories: [...new Set(availableKeys.map(key => key.category))]
        }
      });
      
    } catch (error) {
      console.error('Get available keys error:', error);
      res.status(500).json({
        error: 'Failed to retrieve available keys',
        message: error.message
      });
    }
  }
);

// Test custom field extraction
router.post('/test',
  authenticateApiKey,
  requirePermission('custom_fields'),
  async (req, res) => {
    try {
      const { exifKey, sampleData } = req.body;
      
      if (!exifKey) {
        return res.status(400).json({
          error: 'Missing EXIF key',
          message: 'exifKey is required for testing'
        });
      }
      
      // Simulate EXIF data extraction
      const mockExifData = sampleData || {
        Make: 'Canon',
        Model: 'EOS R5',
        Artist: 'John Photographer',
        UserComment: 'Project ABC-123',
        FNumber: 2.8,
        ISO: 800,
        DateTime: '2025:01:25 10:30:00'
      };
      
      const extractedValue = mockExifData[exifKey];
      
      res.json({
        success: true,
        data: {
          exifKey,
          extractedValue,
          valueType: typeof extractedValue,
          found: extractedValue !== undefined,
          sampleData: mockExifData
        }
      });
      
    } catch (error) {
      console.error('Test custom field error:', error);
      res.status(500).json({
        error: 'Failed to test custom field',
        message: error.message
      });
    }
  }
);

// Helper function to get max custom fields based on plan
function getMaxCustomFields(plan) {
  const limits = {
    free: 0,
    starter: 0,
    pro: 0,
    enterprise: 50
  };
  
  return limits[plan] || 0;
}

module.exports = router; 