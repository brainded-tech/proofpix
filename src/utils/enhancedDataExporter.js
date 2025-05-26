// Enhanced Data Exporter for CSV and JSON with Custom Field Selection
import React from 'react';
import { memoizedFormatters } from './performanceOptimizer';

export class EnhancedDataExporter {
  constructor() {
    this.exportFormats = {
      json: this.exportAsJSON,
      csv: this.exportAsCSV,
      xml: this.exportAsXML,
      excel: this.exportAsExcel
    };

    this.fieldCategories = {
      file: ['fileName', 'fileSize', 'fileType', 'imageWidth', 'imageHeight'],
      camera: ['make', 'model', 'software', 'lens'],
      settings: ['fNumber', 'exposureTime', 'iso', 'focalLength', 'flash', 'whiteBalance'],
      datetime: ['dateTime', 'dateTimeOriginal', 'dateTimeDigitized'],
      location: ['gpsLatitude', 'gpsLongitude', 'gpsAltitude'],
      technical: ['colorSpace', 'orientation', 'compression', 'meteringMode', 'exposureProgram']
    };
  }

  // Enhanced JSON export with structured data
  async exportAsJSON(data, options = {}) {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        exportVersion: '2.0',
        generator: 'ProofPix Enhanced Exporter',
        totalFiles: Array.isArray(data) ? data.length : 1,
        exportOptions: options
      },
      files: this.processDataForExport(data, options)
    };

    // Add summary statistics if requested
    if (options.includeSummary) {
      exportData.summary = this.generateSummaryStats(exportData.files);
    }

    // Add field definitions if requested
    if (options.includeFieldDefinitions) {
      exportData.fieldDefinitions = this.getFieldDefinitions();
    }

    const blob = new Blob([JSON.stringify(exportData, null, options.compact ? 0 : 2)], {
      type: 'application/json'
    });

    return this.downloadFile(blob, options.filename || `proofpix-export-${Date.now()}.json`);
  }

  // Enhanced CSV export with custom field selection
  async exportAsCSV(data, options = {}) {
    const files = this.processDataForExport(data, options);
    const selectedFields = options.fields || this.getAllAvailableFields(files);
    
    // Create CSV header
    const headers = selectedFields.map(field => this.formatFieldName(field));
    let csvContent = headers.join(',') + '\n';

    // Add data rows
    files.forEach(fileData => {
      const row = selectedFields.map(field => {
        const value = this.getNestedValue(fileData, field);
        return this.formatCsvValue(value);
      });
      csvContent += row.join(',') + '\n';
    });

    // Add summary row if requested
    if (options.includeSummary) {
      csvContent += '\n' + this.generateCsvSummary(files, selectedFields);
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    return this.downloadFile(blob, options.filename || `proofpix-export-${Date.now()}.csv`);
  }

  // XML export for compatibility
  async exportAsXML(data, options = {}) {
    const files = this.processDataForExport(data, options);
    
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<proofpix-export>\n';
    xmlContent += `  <metadata>\n`;
    xmlContent += `    <exportDate>${new Date().toISOString()}</exportDate>\n`;
    xmlContent += `    <totalFiles>${files.length}</totalFiles>\n`;
    xmlContent += `    <generator>ProofPix Enhanced Exporter</generator>\n`;
    xmlContent += `  </metadata>\n`;
    xmlContent += `  <files>\n`;

    files.forEach((fileData, index) => {
      xmlContent += `    <file id="${index + 1}">\n`;
      xmlContent += this.objectToXml(fileData, '      ');
      xmlContent += `    </file>\n`;
    });

    xmlContent += `  </files>\n`;
    xmlContent += '</proofpix-export>';

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    return this.downloadFile(blob, options.filename || `proofpix-export-${Date.now()}.xml`);
  }

  // Process data for export with field selection and formatting
  processDataForExport(data, options = {}) {
    const files = Array.isArray(data) ? data : [data];
    const selectedCategories = options.categories || Object.keys(this.fieldCategories);
    const customFields = options.customFields || [];

    return files.map(fileData => {
      const processedFile = {
        id: fileData.id || `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        processingDate: new Date().toISOString()
      };

      // Add selected category fields
      selectedCategories.forEach(category => {
        if (this.fieldCategories[category]) {
          const categoryData = {};
          this.fieldCategories[category].forEach(field => {
            if (fileData.metadata && fileData.metadata[field] !== undefined) {
              categoryData[field] = this.formatFieldValue(field, fileData.metadata[field]);
            }
          });
          if (Object.keys(categoryData).length > 0) {
            processedFile[category] = categoryData;
          }
        }
      });

      // Add custom fields
      customFields.forEach(field => {
        if (fileData.metadata && fileData.metadata[field] !== undefined) {
          if (!processedFile.custom) processedFile.custom = {};
          processedFile.custom[field] = this.formatFieldValue(field, fileData.metadata[field]);
        }
      });

      // Add computed fields if requested
      if (options.includeComputed) {
        processedFile.computed = this.generateComputedFields(fileData);
      }

      // Add GPS data in multiple formats if available
      if (fileData.metadata?.gpsLatitude && fileData.metadata?.gpsLongitude) {
        processedFile.location = {
          ...processedFile.location,
          coordinates: {
            decimal: {
              latitude: fileData.metadata.gpsLatitude,
              longitude: fileData.metadata.gpsLongitude
            },
            dms: memoizedFormatters.gpsCoordinates(
              fileData.metadata.gpsLatitude, 
              fileData.metadata.gpsLongitude
            )
          }
        };
      }

      return processedFile;
    });
  }

  // Generate computed fields from metadata
  generateComputedFields(fileData) {
    const computed = {};
    const metadata = fileData.metadata || {};

    // Image aspect ratio
    if (metadata.imageWidth && metadata.imageHeight) {
      computed.aspectRatio = (metadata.imageWidth / metadata.imageHeight).toFixed(3);
      computed.orientation = metadata.imageWidth > metadata.imageHeight ? 'landscape' : 
                           metadata.imageWidth < metadata.imageHeight ? 'portrait' : 'square';
    }

    // Megapixels
    if (metadata.imageWidth && metadata.imageHeight) {
      computed.megapixels = ((metadata.imageWidth * metadata.imageHeight) / 1000000).toFixed(2);
    }

    // Camera settings summary
    if (metadata.fNumber && metadata.exposureTime && metadata.iso) {
      computed.exposureSummary = `f/${metadata.fNumber}, ${metadata.exposureTime}s, ISO ${metadata.iso}`;
    }

    // File size category
    if (metadata.fileSize) {
      const sizeMB = metadata.fileSize / (1024 * 1024);
      computed.sizeCategory = sizeMB < 1 ? 'small' : sizeMB < 5 ? 'medium' : sizeMB < 20 ? 'large' : 'very_large';
    }

    // Age of photo
    if (metadata.dateTimeOriginal) {
      const photoDate = new Date(metadata.dateTimeOriginal);
      const now = new Date();
      const ageInDays = Math.floor((now - photoDate) / (1000 * 60 * 60 * 24));
      computed.ageInDays = ageInDays;
      computed.ageCategory = ageInDays < 7 ? 'recent' : ageInDays < 30 ? 'this_month' : 
                           ageInDays < 365 ? 'this_year' : 'older';
    }

    return computed;
  }

  // Generate summary statistics
  generateSummaryStats(files) {
    const stats = {
      totalFiles: files.length,
      cameras: new Set(),
      dateRange: { earliest: null, latest: null },
      locations: [],
      fileSizes: { min: Infinity, max: 0, average: 0 },
      resolutions: new Set()
    };

    let totalSize = 0;

    files.forEach(file => {
      // Camera information
      if (file.camera?.make && file.camera?.model) {
        stats.cameras.add(`${file.camera.make} ${file.camera.model}`);
      }

      // Date range
      if (file.datetime?.dateTimeOriginal) {
        const date = new Date(file.datetime.dateTimeOriginal);
        if (!stats.dateRange.earliest || date < stats.dateRange.earliest) {
          stats.dateRange.earliest = date;
        }
        if (!stats.dateRange.latest || date > stats.dateRange.latest) {
          stats.dateRange.latest = date;
        }
      }

      // File sizes
      if (file.file?.fileSize) {
        const size = file.file.fileSize;
        totalSize += size;
        stats.fileSizes.min = Math.min(stats.fileSizes.min, size);
        stats.fileSizes.max = Math.max(stats.fileSizes.max, size);
      }

      // Resolutions
      if (file.file?.imageWidth && file.file?.imageHeight) {
        stats.resolutions.add(`${file.file.imageWidth}x${file.file.imageHeight}`);
      }

      // Locations
      if (file.location?.coordinates?.decimal) {
        stats.locations.push(file.location.coordinates.decimal);
      }
    });

    // Calculate averages
    if (files.length > 0) {
      stats.fileSizes.average = totalSize / files.length;
    }

    // Convert sets to arrays for JSON serialization
    stats.cameras = Array.from(stats.cameras);
    stats.resolutions = Array.from(stats.resolutions);

    return stats;
  }

  // Get field definitions for documentation
  getFieldDefinitions() {
    return {
      file: {
        fileName: 'Original filename of the image',
        fileSize: 'File size in bytes',
        fileType: 'MIME type of the file',
        imageWidth: 'Image width in pixels',
        imageHeight: 'Image height in pixels'
      },
      camera: {
        make: 'Camera manufacturer',
        model: 'Camera model',
        software: 'Software used to process the image',
        lens: 'Lens information'
      },
      settings: {
        fNumber: 'Aperture f-number',
        exposureTime: 'Shutter speed in seconds',
        iso: 'ISO sensitivity',
        focalLength: 'Focal length in mm',
        flash: 'Flash settings',
        whiteBalance: 'White balance setting'
      },
      datetime: {
        dateTime: 'File modification date',
        dateTimeOriginal: 'Date and time when image was captured',
        dateTimeDigitized: 'Date and time when image was digitized'
      },
      location: {
        gpsLatitude: 'GPS latitude coordinate',
        gpsLongitude: 'GPS longitude coordinate',
        gpsAltitude: 'GPS altitude in meters'
      }
    };
  }

  // Utility methods
  getAllAvailableFields(files) {
    const fields = new Set();
    files.forEach(file => {
      this.addFieldsFromObject(file, '', fields);
    });
    return Array.from(fields);
  }

  addFieldsFromObject(obj, prefix, fields) {
    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        this.addFieldsFromObject(obj[key], fullKey, fields);
      } else {
        fields.add(fullKey);
      }
    });
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  formatFieldName(field) {
    return field.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .replace(/\./g, ' ');
  }

  formatFieldValue(key, value) {
    if (value === null || value === undefined) return null;

    switch (key) {
      case 'fileSize':
        return typeof value === 'number' ? memoizedFormatters.fileSize(value) : value;
      case 'dateTime':
      case 'dateTimeOriginal':
      case 'dateTimeDigitized':
        return memoizedFormatters.dateTime(value);
      case 'fNumber':
        return typeof value === 'number' ? `f/${value}` : value;
      case 'exposureTime':
        return typeof value === 'number' && value < 1 ? `1/${Math.round(1/value)}s` : `${value}s`;
      case 'focalLength':
        return `${value}mm`;
      case 'iso':
        return `ISO ${value}`;
      default:
        return value;
    }
  }

  formatCsvValue(value) {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  objectToXml(obj, indent = '') {
    let xml = '';
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        xml += `${indent}<${key}>\n`;
        xml += this.objectToXml(value, indent + '  ');
        xml += `${indent}</${key}>\n`;
      } else {
        xml += `${indent}<${key}>${this.escapeXml(String(value))}</${key}>\n`;
      }
    });
    return xml;
  }

  escapeXml(text) {
    return text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#39;');
  }

  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return filename;
  }

  // Main export method
  async exportData(data, format = 'json', options = {}) {
    if (!this.exportFormats[format]) {
      throw new Error(`Unsupported export format: ${format}`);
    }

    return await this.exportFormats[format].call(this, data, options);
  }
}

// Create singleton instance
export const enhancedDataExporter = new EnhancedDataExporter();

// React hook for enhanced data export
export const useEnhancedDataExporter = () => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const exportData = React.useCallback(async (data, format = 'json', options = {}) => {
    setIsExporting(true);
    setProgress(0);

    try {
      setProgress(25);
      const filename = await enhancedDataExporter.exportData(data, format, options);
      setProgress(100);
      return filename;
    } catch (error) {
      console.error('Enhanced data export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }, []);

  const getAvailableFields = React.useCallback((data) => {
    const files = enhancedDataExporter.processDataForExport(data, { categories: Object.keys(enhancedDataExporter.fieldCategories) });
    return enhancedDataExporter.getAllAvailableFields(files);
  }, []);

  const getFieldCategories = React.useCallback(() => {
    return enhancedDataExporter.fieldCategories;
  }, []);

  return {
    exportData,
    getAvailableFields,
    getFieldCategories,
    isExporting,
    progress
  };
}; 