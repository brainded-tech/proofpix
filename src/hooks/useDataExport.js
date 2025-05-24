// Update your hooks/useDataExport.js - Enhanced version for better integration

import { useCallback } from 'react';
import { convertDMSToDD } from '../utils/exifUtils';
import { updateUsage, checkLimit } from '../utils/usageUtils';
import { Logger } from '../utils/logger';

const logger = new Logger('DataExport');

export const useDataExport = () => {
  
  const exportAsJSON = useCallback((image, exifData, options = {}) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      exportType: 'single_file',
      file: {
        name: image.name,
        size: image.size,
        type: image.type,
        lastModified: new Date(image.lastModified).toISOString()
      },
      exifData: exifData || null
    };

    // Add GPS coordinates if available
    if (exifData?.gpsLatitude && exifData?.gpsLongitude) {
      const lat = convertDMSToDD(exifData.gpsLatitude, exifData.gpsLatitudeRef);
      const lng = convertDMSToDD(exifData.gpsLongitude, exifData.gpsLongitudeRef);
      
      exportData.gpsCoordinates = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        coordinates: `${lat}, ${lng}`,
        reference: {
          latitudeRef: exifData.gpsLatitudeRef,
          longitudeRef: exifData.gpsLongitudeRef
        }
      };
    }

    // Add processing metadata
    exportData.metadata = {
      extractedFields: exifData ? Object.keys(exifData).length : 0,
      hasGPS: !!(exifData?.gpsLatitude && exifData?.gpsLongitude),
      hasCamera: !!(exifData?.make || exifData?.model),
      hasDateTime: !!(exifData?.dateTime || exifData?.dateTimeOriginal)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const fileName = `${image.name.split('.')[0]}_exif_${Date.now()}.json`;
    downloadBlob(blob, fileName);
    
    logger.info('JSON export completed', { fileName, fileSize: blob.size });
    return fileName;
  }, []);

  const exportAsCSV = useCallback((image, exifData, options = {}) => {
    const headers = [
      'File Name',
      'File Size (KB)',
      'File Type',
      'Last Modified',
      'Camera Make',
      'Camera Model',
      'Date Taken',
      'ISO',
      'Aperture',
      'Shutter Speed',
      'Focal Length',
      'GPS Latitude',
      'GPS Longitude',
      'GPS Coordinates'
    ];

    const row = [
      image.name,
      Math.round(image.size / 1024),
      image.type,
      new Date(image.lastModified).toISOString(),
      exifData?.make || '',
      exifData?.model || '',
      exifData?.dateTimeOriginal || exifData?.dateTime || '',
      exifData?.iso || '',
      exifData?.fNumber ? `f/${exifData.fNumber}` : '',
      exifData?.exposureTime || '',
      exifData?.focalLength ? `${exifData.focalLength}mm` : '',
      '', // GPS Latitude (calculated below)
      '', // GPS Longitude (calculated below)
      ''  // GPS Coordinates (calculated below)
    ];

    // Add GPS data if available
    if (exifData?.gpsLatitude && exifData?.gpsLongitude) {
      const lat = convertDMSToDD(exifData.gpsLatitude, exifData.gpsLatitudeRef);
      const lng = convertDMSToDD(exifData.gpsLongitude, exifData.gpsLongitudeRef);
      
      row[11] = lat; // GPS Latitude
      row[12] = lng; // GPS Longitude
      row[13] = `${lat}, ${lng}`; // GPS Coordinates
    }

    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const fileName = `${image.name.split('.')[0]}_exif_${Date.now()}.csv`;
    downloadBlob(blob, fileName);
    
    logger.info('CSV export completed', { fileName, fileSize: blob.size });
    return fileName;
  }, []);

  const exportRawEXIF = useCallback((image, exifData, options = {}) => {
    const content = [
      `EXIF Data Export for: ${image.name}`,
      `Generated: ${new Date().toISOString()}`,
      `File Size: ${Math.round(image.size / 1024)} KB`,
      `File Type: ${image.type}`,
      `Last Modified: ${new Date(image.lastModified).toISOString()}`,
      '',
      '='.repeat(50),
      'RAW EXIF METADATA',
      '='.repeat(50),
      '',
      JSON.stringify(exifData || {}, null, 2)
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const fileName = `${image.name.split('.')[0]}_raw_exif_${Date.now()}.txt`;
    downloadBlob(blob, fileName);
    
    logger.info('Raw EXIF export completed', { fileName, fileSize: blob.size });
    return fileName;
  }, []);

  const copyToClipboard = useCallback(async (image, exifData, options = {}) => {
    const data = {
      file: {
        name: image.name,
        size: `${Math.round(image.size / 1024)} KB`,
        type: image.type
      },
      camera: {
        make: exifData?.make || 'Unknown',
        model: exifData?.model || 'Unknown'
      },
      settings: {
        iso: exifData?.iso || 'Unknown',
        aperture: exifData?.fNumber ? `f/${exifData.fNumber}` : 'Unknown',
        shutterSpeed: exifData?.exposureTime || 'Unknown',
        focalLength: exifData?.focalLength ? `${exifData.focalLength}mm` : 'Unknown'
      },
      dateTime: exifData?.dateTimeOriginal || exifData?.dateTime || 'Unknown'
    };

    // Add GPS if available
    if (exifData?.gpsLatitude && exifData?.gpsLongitude) {
      const lat = convertDMSToDD(exifData.gpsLatitude, exifData.gpsLatitudeRef);
      const lng = convertDMSToDD(exifData.gpsLongitude, exifData.gpsLongitudeRef);
      data.gps = `${lat}, ${lng}`;
    }

    const formattedText = [
      `EXIF Data for: ${data.file.name}`,
      `Camera: ${data.camera.make} ${data.camera.model}`,
      `Date: ${data.dateTime}`,
      `Settings: ISO ${data.settings.iso}, ${data.settings.aperture}, ${data.settings.shutterSpeed}, ${data.settings.focalLength}`,
      data.gps ? `GPS: ${data.gps}` : null,
      `File: ${data.file.size}, ${data.file.type}`
    ].filter(Boolean).join('\n');

    await navigator.clipboard.writeText(formattedText);
    logger.info('EXIF data copied to clipboard');
    return 'clipboard';
  }, []);

  // Helper function to download blobs
  const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportData = useCallback(async (format, image, exifData, options = {}) => {
    if (!checkLimit('dataExports')) {
      throw new Error('Data export limit reached for today');
    }

    if (!image) {
      throw new Error('No image data available for export');
    }

    let result;
    
    try {
      switch (format) {
        case 'json':
          result = exportAsJSON(image, exifData, options);
          break;
        case 'csv':
          result = exportAsCSV(image, exifData, options);
          break;
        case 'raw':
          result = exportRawEXIF(image, exifData, options);
          break;
        case 'clipboard':
          result = await copyToClipboard(image, exifData, options);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      // Update usage (except for clipboard as it's less resource intensive)
      if (format !== 'clipboard') {
        updateUsage('dataExports');
      }

      logger.info(`Data export completed: ${format}`, { 
        fileName: image.name,
        format,
        hasExifData: !!exifData
      });

      return result;
    } catch (error) {
      logger.error('Data export failed', error, { format, fileName: image.name });
      throw error;
    }
  }, [exportAsJSON, exportAsCSV, exportRawEXIF, copyToClipboard]);

  return {
    exportData,
    canExport: checkLimit('dataExports')
  };
};