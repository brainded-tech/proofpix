import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { convertDMSToDD } from '../utils/exifUtils';
import { useLoadingStates } from './useLoadingStates';
import { useErrorHandler } from './useErrorHandler';

const PAGE_SIZES = {
  A4: {
    width: 210,
    height: 297
  },
  LETTER: {
    width: 215.9,
    height: 279.4
  }
};

const PDF_OPTIONS = {
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
};

export const usePdfGenerator = () => {
  const { startLoading, updateProgress, finishLoading } = useLoadingStates();
  const { handleAsyncError, ERROR_TYPES } = useErrorHandler();
  
  const generateSingleReport = useCallback(async (image, exifData, previewUrl, showFullExif = false) => {
    const operationId = 'pdf-generation';
    
    try {
      startLoading(operationId, 'Initializing PDF generation...');
      
      if (!image || !exifData) {
        throw new Error('Missing required data for PDF generation');
      }
      
      updateProgress(operationId, 10, 'Creating PDF document...');
      
      const doc = new jsPDF(PDF_OPTIONS);
      const pageWidth = PAGE_SIZES.A4.width;
      const pageHeight = PAGE_SIZES.A4.height;
      const margin = 20;
      let yPosition = margin;
      
      updateProgress(operationId, 25, 'Adding header information...');
      
      // Header section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246);
      doc.text('ProofPix Report', pageWidth/2, yPosition, { align: 'center' });
      yPosition += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth/2, yPosition, { align: 'center' });
      yPosition += 20;
      
      updateProgress(operationId, 40, 'Processing image...');
      
      // Image section
      if (previewUrl) {
        try {
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = 100;
          doc.addImage(previewUrl, 'JPEG', margin, yPosition, imgWidth, imgHeight, undefined, 'MEDIUM');
          yPosition += imgHeight + 10;
        } catch (error) {
          console.warn('Failed to add image to PDF:', error);
        }
      }
      
      updateProgress(operationId, 60, 'Adding metadata sections...');
      
      // Add EXIF data
      doc.setFontSize(14);
      doc.text('Image Metadata', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      if (exifData) {
        const metadata = showFullExif ? exifData : {
          DateTimeOriginal: exifData.DateTimeOriginal,
          Make: exifData.Make,
          Model: exifData.Model,
          FNumber: exifData.FNumber,
          ExposureTime: exifData.ExposureTime,
          ISO: exifData.ISO,
          FocalLength: exifData.FocalLength,
          GPSLatitude: exifData.GPSLatitude,
          GPSLongitude: exifData.GPSLongitude
        };

        for (const [key, value] of Object.entries(metadata)) {
          if (value) {
            const text = `${key}: ${value}`;
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(text, margin, yPosition);
            yPosition += 7;
          }
        }
      } else {
        doc.text('No EXIF data available', margin, yPosition);
      }
      
      updateProgress(operationId, 90, 'Finalizing PDF...');
      
      // Footer
      const footerY = pageHeight - 10;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(
        'Generated with ProofPix - Privacy-focused EXIF tool | All processing done locally in your browser', 
        pageWidth/2, 
        footerY, 
        { align: 'center' }
      );
      
      updateProgress(operationId, 100, 'Downloading PDF...');
      
      const filename = `proofpix-${Date.now()}.pdf`;
      doc.save(filename);
      
      finishLoading(operationId);
      return filename;
      
    } catch (error) {
      finishLoading(operationId);
      throw error;
    }
  }, [startLoading, updateProgress, finishLoading]);

  const generateBatchReport = useCallback(async (images) => {
    const doc = new jsPDF(PDF_OPTIONS);
    let isFirstPage = true;

    for (const { image, exifData, previewUrl } of images) {
      if (!isFirstPage) {
        doc.addPage();
      }
      
      try {
        const singleDoc = await generateSingleReport(image, exifData, previewUrl, false);
        if (!isFirstPage) {
          doc.addPage();
        }
        doc.setPage(doc.internal.getNumberOfPages());
        doc.addPage();
        doc.deletePage(doc.internal.getNumberOfPages());
        isFirstPage = false;
      } catch (error) {
        console.warn('Failed to generate report for image:', error);
      }
    }

    return doc;
  }, [generateSingleReport]);

  const generatePdfReport = useCallback(async (input, exifData, previewUrl, showFullExif = false) => {
    return handleAsyncError(
      async () => {
        let doc;
        
        if (Array.isArray(input)) {
          doc = await generateBatchReport(input);
        } else {
          doc = await generateSingleReport(input, exifData, previewUrl, showFullExif);
        }

        // Save the PDF
        const filename = Array.isArray(input) 
          ? `proofpix-batch-${Date.now()}.pdf`
          : `proofpix-${Date.now()}.pdf`;

        doc.save(filename);
        return filename;
      },
      ERROR_TYPES.DOWNLOAD,
      { 
        action: 'generate_pdf',
        isBatch: Array.isArray(input)
      }
    );
  }, [handleAsyncError, generateSingleReport, generateBatchReport]);

  return {
    generatePdfReport
  };
};

export default usePdfGenerator;