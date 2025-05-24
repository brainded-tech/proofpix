// hooks/useBulkExport.js - Export functionality for bulk operations
import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { convertDMSToDD } from '../utils/exifUtils';
import { Logger } from '../utils/logger';

const logger = new Logger('BulkExport');

export const useBulkExport = () => {
  
  const exportAsJSON = useCallback((files, options) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalFiles: files.length,
      files: files.map(fileItem => {
        const data = {
          fileName: fileItem.file.name,
          fileSize: fileItem.file.size,
          fileType: fileItem.file.type,
          processingDate: new Date().toISOString()
        };

        if (options.includeMetadata && fileItem.exifData) {
          data.exifData = fileItem.exifData;
        }

        if (options.includeGPS && fileItem.exifData?.gpsLatitude) {
          const lat = convertDMSToDD(fileItem.exifData.gpsLatitude, fileItem.exifData.gpsLatitudeRef);
          const lng = convertDMSToDD(fileItem.exifData.gpsLongitude, fileItem.exifData.gpsLongitudeRef);
          
          data.gpsCoordinates = {
            latitude: lat,
            longitude: lng,
            coordinates: `${lat}, ${lng}`
          };
        }

        return data;
      })
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proofpix-bulk-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logger.info(`Exported ${files.length} files as JSON`);
  }, []);

  const exportAsCSV = useCallback((files, options) => {
    const headers = [
      'File Name',
      'File Size (KB)',
      'File Type'
    ];

    if (options.includeMetadata) {
      headers.push('Camera Make', 'Camera Model', 'Date Taken', 'ISO', 'Aperture', 'Shutter Speed', 'Focal Length');
    }

    if (options.includeGPS) {
      headers.push('Latitude', 'Longitude', 'GPS Coordinates');
    }

    const rows = [headers];

    files.forEach(fileItem => {
      const row = [
        fileItem.file.name,
        Math.round(fileItem.file.size / 1024),
        fileItem.file.type
      ];

      if (options.includeMetadata) {
        const exif = fileItem.exifData || {};
        row.push(
          exif.make || '',
          exif.model || '',
          exif.dateTimeOriginal || exif.dateTime || '',
          exif.iso || '',
          exif.fNumber || '',
          exif.exposureTime || '',
          exif.focalLength || ''
        );
      }

      if (options.includeGPS) {
        if (fileItem.exifData?.gpsLatitude) {
          const lat = convertDMSToDD(fileItem.exifData.gpsLatitude, fileItem.exifData.gpsLatitudeRef);
          const lng = convertDMSToDD(fileItem.exifData.gpsLongitude, fileItem.exifData.gpsLongitudeRef);
          row.push(lat, lng, `${lat}, ${lng}`);
        } else {
          row.push('', '', '');
        }
      }

      rows.push(row);
    });

    const csvContent = rows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proofpix-bulk-export-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logger.info(`Exported ${files.length} files as CSV`);
  }, []);

  const exportAsPDF = useCallback(async (files, options) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    
    let y = margin;
    
    // Title page
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246);
    pdf.text('ProofPix Bulk Report', pageWidth/2, y, { align: 'center' });
    y += 15;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth/2, y, { align: 'center' });
    pdf.text(`Total Files: ${files.length}`, pageWidth/2, y + 8, { align: 'center' });
    y += 30;
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      
      // Check if we need a new page
      if (y + 80 > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      
      // File header
      pdf.setFillColor(243, 244, 246);
      pdf.rect(margin, y, pageWidth - (margin * 2), 20, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${i + 1}. ${fileItem.file.name}`, margin + 5, y + 13);
      y += 25;
      
      // File info
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Size: ${Math.round(fileItem.file.size / 1024)} KB`, margin + 5, y);
      pdf.text(`Type: ${fileItem.file.type}`, margin + 5, y + 8);
      y += 20;
      
      // Add image thumbnail if requested and available
      if (options.includeImages && fileItem.previewUrl) {
        try {
          const imgWidth = 60;
          const imgHeight = 45;
          pdf.addImage(fileItem.previewUrl, 'JPEG', margin + 5, y, imgWidth, imgHeight);
          y += imgHeight + 10;
        } catch (error) {
          logger.warn(`Could not add image for ${fileItem.file.name}`, error);
        }
      }
      
      // EXIF data
      if (options.includeMetadata && fileItem.exifData) {
        const exif = fileItem.exifData;
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text('EXIF Metadata:', margin + 5, y);
        y += 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        
        const metadata = [
          ['Camera', `${exif.make || 'Unknown'} ${exif.model || ''}`],
          ['Date Taken', exif.dateTimeOriginal || exif.dateTime || 'Unknown'],
          ['ISO', exif.iso || 'Unknown'],
          ['Aperture', exif.fNumber ? `f/${exif.fNumber}` : 'Unknown'],
          ['Shutter Speed', exif.exposureTime || 'Unknown'],
          ['Focal Length', exif.focalLength ? `${exif.focalLength}mm` : 'Unknown']
        ];
        
        metadata.forEach(([label, value]) => {
          if (value && value !== 'Unknown' && value.trim() !== '') {
            pdf.text(`${label}: ${value}`, margin + 10, y);
            y += 8;
          }
        });
      }
      
      // GPS data
      if (options.includeGPS && fileItem.exifData?.gpsLatitude) {
        const lat = convertDMSToDD(fileItem.exifData.gpsLatitude, fileItem.exifData.gpsLatitudeRef);
        const lng = convertDMSToDD(fileItem.exifData.gpsLongitude, fileItem.exifData.gpsLongitudeRef);
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text('GPS Location:', margin + 5, y);
        y += 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.text(`Coordinates: ${lat}, ${lng}`, margin + 10, y);
        y += 15;
      }
      
      y += 10; // Space between files
    }
    
    // Footer on each page
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(
        `Generated with ProofPix - Page ${i} of ${totalPages}`, 
        pageWidth/2, 
        pageHeight - 10, 
        { align: 'center' }
      );
    }
    
    const filename = `proofpix-bulk-report-${Date.now()}.pdf`;
    pdf.save(filename);
    
    logger.info(`Exported ${files.length} files as PDF`);
    return filename;
  }, []);

  const exportFiles = useCallback((options) => {
    const { format, files } = options;
    
    if (!files || files.length === 0) {
      throw new Error('No files to export');
    }
    
    logger.info(`Starting bulk export: ${format} format, ${files.length} files`);
    
    switch (format) {
      case 'json':
        return exportAsJSON(files, options);
      case 'csv':
        return exportAsCSV(files, options);
      case 'pdf':
        return exportAsPDF(files, options);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }, [exportAsJSON, exportAsCSV, exportAsPDF]);

  return {
    exportFiles
  };
};