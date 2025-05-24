// 4. Create hooks/useComparisonReport.js - Generate comparison reports
import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { convertDMSToDD } from '../utils/exifUtils';

export const useComparisonReport = () => {
  const generateComparisonReport = useCallback(async (imageA, imageB, exifA, exifB, options = {}) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;
    
    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(59, 130, 246);
    pdf.text('ProofPix Image Comparison Report', pageWidth/2, y, { align: 'center' });
    y += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth/2, y, { align: 'center' });
    y += 20;
    
    // Image info section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Image Information', margin, y);
    y += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Image A info
    pdf.text(`Image A: ${imageA.name}`, margin + 5, y);
    pdf.text(`Size: ${(imageA.size / 1024).toFixed(2)} KB`, margin + 5, y + 6);
    
    // Image B info
    pdf.text(`Image B: ${imageB.name}`, pageWidth/2 + 5, y);
    pdf.text(`Size: ${(imageB.size / 1024).toFixed(2)} KB`, pageWidth/2 + 5, y + 6);
    y += 20;
    
    // Key differences section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Key Differences', margin, y);
    y += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    // Compare key fields
    const keyFields = ['make', 'model', 'dateTimeOriginal', 'gpsLatitude', 'gpsLongitude'];
    
    keyFields.forEach(field => {
      const valueA = exifA?.[field];
      const valueB = exifB?.[field];
      
      if (valueA !== valueB) {
        pdf.text(`${field}:`, margin + 5, y);
        pdf.text(`A: ${valueA || 'N/A'}`, margin + 40, y);
        pdf.text(`B: ${valueB || 'N/A'}`, pageWidth/2 + 5, y);
        y += 8;
      }
    });
    
    // Save PDF
    const filename = `comparison-${Date.now()}.pdf`;
    pdf.save(filename);
    
    return filename;
  }, []);
  
  return { generateComparisonReport };
};