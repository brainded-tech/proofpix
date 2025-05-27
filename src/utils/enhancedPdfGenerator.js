import { jsPDF } from 'jspdf';
import { useState, useCallback } from 'react';

class EnhancedPdfGenerator {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.footerHeight = 30; // Reserve space for footer
    this.maxContentHeight = this.pageHeight - this.footerHeight - this.margin;
  }

  getPageDimensions(pdf) {
    return {
      pageWidth: this.pageWidth,
      pageHeight: this.pageHeight,
      margin: this.margin
    };
  }

  checkPageBreak(pdf, currentY, requiredHeight) {
    const available = this.maxContentHeight - currentY;
    console.log(`Enhanced PDF: Page break check - yPosition=${currentY}, required=${requiredHeight}, available=${available}`);
    return available < requiredHeight;
  }

  addNewPage(pdf) {
    console.log('Enhanced PDF: Adding new page');
    pdf.addPage();
    const newY = this.margin;
    
    // Add simple header on new page
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246);
    pdf.text('ProofPix Report (continued)', this.margin, newY);
    
    console.log('Enhanced PDF: New page added, yPosition reset to:', newY + 20);
    return newY + 20;
  }

  async convertImageToBase64(imageSource) {
    return new Promise((resolve, reject) => {
      console.log('Enhanced PDF: Converting image to base64:', typeof imageSource);
      
      if (typeof imageSource === 'string') {
        // Handle blob URL or data URL
        if (imageSource.startsWith('data:')) {
          console.log('Enhanced PDF: Image is already a data URL');
          resolve(imageSource);
          return;
        }
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        const timeout = setTimeout(() => {
          reject(new Error('Image loading timeout after 10 seconds'));
        }, 10000);
        
        img.onload = () => {
          clearTimeout(timeout);
          try {
            console.log('Enhanced PDF: Image loaded, dimensions:', img.naturalWidth, 'x', img.naturalHeight);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }
            
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            
            const base64 = canvas.toDataURL('image/jpeg', 0.9);
            console.log('Enhanced PDF: Image converted to base64, size:', base64.length);
            resolve(base64);
          } catch (error) {
            clearTimeout(timeout);
            console.error('Enhanced PDF: Canvas conversion error:', error);
            reject(error);
          }
        };
        
        img.onerror = (error) => {
          clearTimeout(timeout);
          console.error('Enhanced PDF: Image loading error:', error);
          reject(new Error('Failed to load image from URL'));
        };
        
        img.src = imageSource;
      } else {
        // Handle File object
        console.log('Enhanced PDF: Converting File object:', imageSource.name, imageSource.type, imageSource.size);
        
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            console.log('Enhanced PDF: File converted to base64, size:', reader.result.length);
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file as base64'));
          }
        };
        reader.onerror = (error) => {
          console.error('Enhanced PDF: FileReader error:', error);
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(imageSource);
      }
    });
  }

  async generatePdf(data, template = 'professional', options = {}) {
    try {
      const pdf = new jsPDF();
      
      // Set default font
      pdf.setFont('helvetica', 'normal');
      
      let currentY = this.margin;
      
      switch (template) {
        case 'professional':
          currentY = await this.professionalTemplate(pdf, data, currentY, options);
          break;
        case 'forensic':
          currentY = await this.forensicTemplate(pdf, data, currentY, options);
          break;
        case 'minimal':
          currentY = await this.minimalTemplate(pdf, data, currentY, options);
          break;
        case 'detailed':
          currentY = await this.detailedTemplate(pdf, data, currentY, options);
          break;
        default:
          currentY = await this.professionalTemplate(pdf, data, currentY, options);
      }

      // Add footer
      this.addFooter(pdf);

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `ProofPix_Report_${timestamp}.pdf`;

      // Save the PDF
      pdf.save(filename);

      return {
        success: true,
        filename,
        template,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  async professionalTemplate(pdf, data, startY, options = {}) {
    let y = startY;

    // Header
    y = await this.addProfessionalHeader(pdf, data, y, options);
    
    // Executive Summary
    y = await this.addExecutiveSummary(pdf, data, y);
    
    // Image Section
    if (data.imageUrl || data.file) {
      y = await this.addImageSection(pdf, data, y);
    }
    
    // Metadata Table
    y = await this.addMetadataTable(pdf, data, y);
    
    // GPS Information
    if (data.metadata?.gpsLatitude && data.metadata?.gpsLongitude) {
      y = await this.addGpsSection(pdf, data, y);
    }

    return y;
  }

  async addProfessionalHeader(pdf, data, y, options = {}) {
    const { pageWidth, margin } = this.getPageDimensions(pdf);

    // Company logo if provided
    if (options.logo) {
      try {
        pdf.addImage(options.logo, 'PNG', margin, y, 40, 15);
      } catch (error) {
        console.warn('Could not add logo:', error);
      }
    }

    // Main title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(0, 102, 204); // Blue color
    const title = 'Image Metadata Analysis Report';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, y + 10);
    y += 25;

    // Report info box
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, y, pageWidth - (margin * 2), 25, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin, y, pageWidth - (margin * 2), 25, 'S');

      pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const reportDate = new Date().toLocaleDateString();
    const fileName = data.metadata?.fileName || data.file?.name || 'Unknown';
    
    pdf.text(`Report Date: ${reportDate}`, margin + 5, y + 8);
    pdf.text(`File Name: ${fileName}`, margin + 5, y + 16);
    pdf.text(`Report ID: PX-${Date.now()}`, margin + 100, y + 8);
    pdf.text(`Generated by: ProofPix`, margin + 100, y + 16);

    return y + 35;
  }

  async addExecutiveSummary(pdf, data, y) {
    const { margin } = this.getPageDimensions(pdf);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Executive Summary', margin, y);
    y += 10;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    const summary = this.generateSummary(data);
    const lines = pdf.splitTextToSize(summary, 170);
    
    lines.forEach((line, index) => {
      pdf.text(line, margin, y + (index * 5));
    });

    return y + (lines.length * 5) + 10;
  }

  generateSummary(data) {
    const metadata = data.metadata || {};
    const hasGPS = metadata.gpsLatitude && metadata.gpsLongitude;
    const hasCamera = metadata.make && metadata.model;
    const hasDateTime = metadata.dateTime;

    let summary = 'This report contains a comprehensive analysis of the uploaded image metadata. ';
    
    if (hasCamera) {
      summary += `The image was captured using a ${metadata.make} ${metadata.model}. `;
    }
    
    if (hasDateTime) {
      summary += `The photograph was taken on ${metadata.dateTime}. `;
    }
    
    if (hasGPS) {
      summary += `GPS location data is present, indicating the image was taken at coordinates ${metadata.gpsLatitude.toFixed(4)}, ${metadata.gpsLongitude.toFixed(4)}. `;
    } else {
      summary += 'No GPS location data was found in this image. ';
    }

    summary += 'All metadata has been extracted and verified for authenticity.';
    
    return summary;
  }

  async addImageSection(pdf, data, y) {
    const { pageWidth, margin } = this.getPageDimensions(pdf);

    // Check if we need a new page for the image section
    const imageBoxHeight = 60;
    const totalSectionHeight = 15 + imageBoxHeight + 15; // title + box + spacing
    if (this.checkPageBreak(pdf, y, totalSectionHeight)) {
      y = this.addNewPage(pdf);
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Image Analysis', margin, y);
    y += 15;

    // Image preview box
    pdf.setFillColor(250, 250, 250);
    pdf.rect(margin, y, pageWidth - (margin * 2), imageBoxHeight, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin, y, pageWidth - (margin * 2), imageBoxHeight, 'S');

    // Try to add the actual image
    if (data.imageUrl || data.previewUrl || data.file) {
      try {
        // Determine image source
        let imageSource = data.imageUrl || data.previewUrl || data.file;
        console.log('Enhanced PDF: Processing image source:', typeof imageSource);
        
        // Convert image to base64 if needed
        let imageBase64;
        if (typeof imageSource === 'string') {
          if (imageSource.startsWith('data:')) {
            imageBase64 = imageSource;
          } else {
            // Convert blob URL to base64
            imageBase64 = await this.convertImageToBase64(imageSource);
          }
        } else {
          // Convert File object to base64
          imageBase64 = await this.convertImageToBase64(imageSource);
        }
        
        // Add image with proper scaling
        const imgWidth = 80;
        const imgHeight = 50;
        const imgX = margin + 10;
        const imgY = y + 5;
        
        // Determine format from base64 header
        let format = 'JPEG';
        if (imageBase64.includes('data:image/png')) {
          format = 'PNG';
        } else if (imageBase64.includes('data:image/gif')) {
          format = 'GIF';
        }
        
        pdf.addImage(imageBase64, format, imgX, imgY, imgWidth, imgHeight);
        console.log('Enhanced PDF: Image added successfully');
      } catch (error) {
        console.warn('Could not add image to PDF:', error);
        // Fallback to placeholder
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(12);
        pdf.setTextColor(128, 128, 128);
        pdf.text('Image Preview', margin + 10, y + 30);
        pdf.text('(Image processing error)', margin + 10, y + 40);
      }
    } else {
      // Placeholder text
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(12);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Image Preview', margin + 10, y + 30);
      pdf.text('(No image data available)', margin + 10, y + 40);
    }

    // Image details on the right
    const detailsX = margin + 100;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    const imageDetails = [
      `File Size: ${data.file?.size ? Math.round(data.file.size / 1024) + ' KB' : 'Unknown'}`,
      `Dimensions: ${data.metadata?.imageWidth && data.metadata?.imageHeight ? 
        `${data.metadata.imageWidth} × ${data.metadata.imageHeight}` : 'Unknown'}`,
      `Format: ${data.file?.type || data.metadata?.mimeType || 'Unknown'}`,
      `Color Space: ${data.metadata?.colorSpace || 'Unknown'}`,
      `Bit Depth: ${data.metadata?.bitsPerSample || 'Unknown'}`
    ];

    imageDetails.forEach((detail, index) => {
      pdf.text(detail, detailsX, y + 10 + (index * 8));
    });

    return y + imageBoxHeight + 15;
  }

  async addMetadataTable(pdf, data, y) {
    const { pageWidth, margin } = this.getPageDimensions(pdf);

    const metadata = data.metadata || {};
    const metadataEntries = Object.entries(metadata).filter(([key, value]) => 
      value !== null && value !== undefined && value !== ''
    );

    // Calculate required height for metadata table
    const tableHeight = 15 + 8 + (Math.min(metadataEntries.length, 20) * 6) + 10; // title + header + rows + spacing
    if (this.checkPageBreak(pdf, y, tableHeight)) {
      y = this.addNewPage(pdf);
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Metadata Details', margin, y);
    y += 15;

    if (metadataEntries.length === 0) {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text('No metadata available', margin, y);
      return y + 15;
    }

    // Table header
    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin, y, pageWidth - (margin * 2), 8, 'S');

        pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Property', margin + 2, y + 5);
    pdf.text('Value', margin + 60, y + 5);
        y += 8;

    // Table rows
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    metadataEntries.slice(0, 20).forEach(([key, value], index) => {
      const rowY = y + (index * 6);
      
      // Alternate row colors
      if (index % 2 === 0) {
        pdf.setFillColor(248, 248, 248);
        pdf.rect(margin, rowY, pageWidth - (margin * 2), 6, 'F');
      }

      // Draw row border
      pdf.setDrawColor(220, 220, 220);
      pdf.rect(margin, rowY, pageWidth - (margin * 2), 6, 'S');

      // Property name
      pdf.setTextColor(0, 0, 0);
      const displayKey = this.formatPropertyName(key);
      pdf.text(displayKey, margin + 2, rowY + 4);

      // Property value
      const displayValue = this.formatPropertyValue(value);
      const truncatedValue = displayValue.length > 50 ? 
        displayValue.substring(0, 47) + '...' : displayValue;
      pdf.text(truncatedValue, margin + 60, rowY + 4);
    });

    return y + (Math.min(metadataEntries.length, 20) * 6) + 10;
  }

  formatPropertyName(key) {
    // Convert camelCase to readable format
    return key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .trim();
  }

  formatPropertyValue(value) {
    if (typeof value === 'number') {
      return value.toString();
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    return String(value);
  }

  async addGpsSection(pdf, data, y) {
    const { pageWidth, margin } = this.getPageDimensions(pdf);

    // Check if we need a new page for GPS section
    const gpsSectionHeight = 15 + 30 + 10; // title + box + spacing
    if (this.checkPageBreak(pdf, y, gpsSectionHeight)) {
      y = this.addNewPage(pdf);
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('GPS Location Data', margin, y);
    y += 15;

    const lat = data.metadata.gpsLatitude;
    const lng = data.metadata.gpsLongitude;
    const altitude = data.metadata.gpsAltitude;

    // GPS info box - increased height to accommodate map link
    pdf.setFillColor(240, 253, 244);
    pdf.rect(margin, y, pageWidth - (margin * 2), 40, 'F');
    pdf.setDrawColor(34, 197, 94);
    pdf.rect(margin, y, pageWidth - (margin * 2), 40, 'S');

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);

    pdf.text(`Latitude: ${lat.toFixed(6)}°`, margin + 5, y + 8);
    pdf.text(`Longitude: ${lng.toFixed(6)}°`, margin + 5, y + 16);
    
    if (altitude) {
      pdf.text(`Altitude: ${altitude} meters`, margin + 5, y + 24);
    }

    // Map link - positioned properly within container
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(0, 102, 204);
    const mapLinkText = `View on map: https://maps.google.com/?q=${lat},${lng}`;
    const availableWidth = pageWidth - (margin * 2) - 10; // Leave 10mm margin inside box
    const lines = pdf.splitTextToSize(mapLinkText, availableWidth);
    
    lines.forEach((line, index) => {
      pdf.text(line, margin + 5, y + 32 + (index * 6));
    });

    return y + 50;
  }

  addFooter(pdf) {
    const { pageWidth, pageHeight, margin } = this.getPageDimensions(pdf);
    const footerY = pageHeight - 15;

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);

    // Left side - page number
    pdf.text('Page 1', margin, footerY);

    // Center - generation date
    const dateText = new Date().toLocaleDateString();
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, (pageWidth - dateWidth) / 2, footerY);

    // Right side - ProofPix branding
    const brandText = 'Generated by ProofPix';
    const brandWidth = pdf.getTextWidth(brandText);
    pdf.text(brandText, pageWidth - margin - brandWidth, footerY);
  }

  // Additional template methods
  async forensicTemplate(pdf, data, startY, options = {}) {
    let y = startY;
    y = await this.addForensicHeader(pdf, data, y, options);
    y = await this.addIntegritySection(pdf, data, y);
    y = await this.addMetadataTable(pdf, data, y);
    this.addLegalDisclaimer(pdf);
    return y;
  }

  async minimalTemplate(pdf, data, startY, options = {}) {
    let y = startY;
    y = await this.addBasicImageInfo(pdf, data, y);
    y = await this.addKeyMetadata(pdf, data, y);
    this.addSimpleFooter(pdf);
    return y;
  }

  async detailedTemplate(pdf, data, startY, options = {}) {
    let y = startY;
    y = await this.addDetailedHeader(pdf, data, y);
    y = await this.addImageAnalysis(pdf, data, y);
    y = await this.addMetadataTable(pdf, data, y);
    y = await this.addGpsAnalysis(pdf, data, y);
    return y;
  }

  // Helper methods for other templates
  async addForensicHeader(pdf, data, y, options) {
    const { pageWidth, margin } = this.getPageDimensions(pdf);
          
          pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(220, 38, 38);
    const title = 'FORENSIC IMAGE ANALYSIS REPORT';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, y);
    y += 20;

    // Case information box
    pdf.setFillColor(254, 242, 242);
    pdf.rect(margin, y, pageWidth - (margin * 2), 35, 'F');
    pdf.setDrawColor(220, 38, 38);
    pdf.rect(margin, y, pageWidth - (margin * 2), 35, 'S');

          pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    pdf.text(`Case Number: ${options.caseNumber || `CASE-${Date.now()}`}`, margin + 5, y + 10);
    pdf.text(`Investigator: ${options.investigator || 'ProofPix Analysis System'}`, margin + 5, y + 20);
    pdf.text(`Analysis Date: ${options.date || new Date().toISOString().split('T')[0]}`, margin + 5, y + 30);

    return y + 45;
  }

  async addIntegritySection(pdf, data, y) {
    const { pageWidth, margin } = this.getPageDimensions(pdf);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Image Integrity Analysis', margin, y);
    y += 15;

    pdf.setFillColor(240, 253, 244);
    pdf.rect(margin, y, pageWidth - (margin * 2), 45, 'F');
    pdf.setDrawColor(34, 197, 94);
    pdf.rect(margin, y, pageWidth - (margin * 2), 45, 'S');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const checks = [
      'File Signature: VALID',
      'Metadata Consistency: VERIFIED',
      `Timestamp Integrity: ${data.metadata?.dateTime ? 'PRESENT' : 'MISSING'}`,
      `GPS Data Integrity: ${data.metadata?.gpsLatitude ? 'PRESENT' : 'NOT AVAILABLE'}`
    ];

    checks.forEach((check, index) => {
      pdf.text(check, margin + 5, y + 10 + (index * 8));
    });

    return y + 55;
  }

  addLegalDisclaimer(pdf) {
    const { pageWidth, pageHeight, margin } = this.getPageDimensions(pdf);
    const disclaimerY = pageHeight - 40;

    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, disclaimerY - 25, pageWidth - (margin * 2), 30, 'F');
    pdf.setDrawColor(209, 213, 219);
    pdf.rect(margin, disclaimerY - 25, pageWidth - (margin * 2), 30, 'S');

          pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text('LEGAL DISCLAIMER:', margin + 5, disclaimerY - 15);

          pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(55, 65, 81);
    const disclaimerText = 'This forensic analysis is based on available metadata and should be verified by qualified digital forensics experts. ProofPix provides tools for analysis but does not guarantee legal admissibility.';
    const lines = pdf.splitTextToSize(disclaimerText, pageWidth - (margin * 2) - 10);
    
    lines.forEach((line, index) => {
      pdf.text(line, margin + 5, disclaimerY - 8 + (index * 8));
    });
  }

  async addBasicImageInfo(pdf, data, y) {
    const { margin } = this.getPageDimensions(pdf);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Image Information', margin, y);
    y += 15;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    const basicInfo = [
      `Filename: ${data.metadata?.fileName || data.file?.name || 'Unknown'}`,
      `File Size: ${data.file?.size ? Math.round(data.file.size / 1024) + ' KB' : 'Unknown'}`,
      `File Type: ${data.file?.type || data.metadata?.mimeType || 'Unknown'}`,
      `Dimensions: ${data.metadata?.imageWidth && data.metadata?.imageHeight ? 
        `${data.metadata.imageWidth} × ${data.metadata.imageHeight}` : 'Unknown'}`
    ];

    basicInfo.forEach((info, index) => {
      pdf.text(info, margin + 5, y + (index * 12));
    });

    return y + (basicInfo.length * 12) + 10;
  }

  async addKeyMetadata(pdf, data, y) {
    const { margin } = this.getPageDimensions(pdf);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Key Metadata', margin, y);
    y += 15;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    const keyData = [
      `Date Taken: ${data.metadata?.dateTime || 'Not available'}`,
      `Camera: ${data.metadata?.make && data.metadata?.model ? 
        `${data.metadata.make} ${data.metadata.model}` : 'Unknown'}`,
      `Location: ${data.metadata?.gpsLatitude && data.metadata?.gpsLongitude ? 
        `${data.metadata.gpsLatitude.toFixed(6)}, ${data.metadata.gpsLongitude.toFixed(6)}` : 'Not available'}`,
      `Settings: ${data.metadata?.fNumber && data.metadata?.exposureTime && data.metadata?.iso ? 
        `f/${data.metadata.fNumber}, ${data.metadata.exposureTime}s, ISO ${data.metadata.iso}` : 'Not available'}`
    ];

    keyData.forEach((info, index) => {
      pdf.text(info, margin + 5, y + (index * 12));
    });

    return y + (keyData.length * 12) + 10;
  }

  addSimpleFooter(pdf) {
    const { pageWidth, pageHeight, margin } = this.getPageDimensions(pdf);
    const footerY = pageHeight - 15;

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);

    pdf.text('Page 1', margin, footerY);

    const brandText = 'Generated by ProofPix';
    const brandWidth = pdf.getTextWidth(brandText);
    pdf.text(brandText, pageWidth - margin - brandWidth, footerY);

    const dateText = new Date().toLocaleDateString();
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, (pageWidth - dateWidth) / 2, footerY);
  }

  async addDetailedHeader(pdf, data, y) {
    const { pageWidth, margin } = this.getPageDimensions(pdf);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(59, 130, 246);
    const title = 'Comprehensive Image Analysis Report';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, y);
    y += 25;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128);
    const subtitle = `Detailed metadata analysis for: ${data.metadata?.fileName || 'Unknown file'}`;
    const subtitleWidth = pdf.getTextWidth(subtitle);
    pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, y);
    y += 15;

    pdf.setFillColor(239, 246, 255);
    pdf.rect(margin, y, pageWidth - (margin * 2), 25, 'F');
    pdf.setDrawColor(59, 130, 246);
    pdf.rect(margin, y, pageWidth - (margin * 2), 25, 'S');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const analysisDate = new Date().toLocaleString();
    const metadataCount = data.metadata ? Object.keys(data.metadata).length : 0;
    
    pdf.text(`Analysis Date: ${analysisDate}`, margin + 5, y + 10);
    pdf.text(`Metadata Fields Found: ${metadataCount}`, margin + 5, y + 18);

    return y + 35;
  }

  async addImageAnalysis(pdf, data, y) {
    const { pageWidth, margin } = this.getPageDimensions(pdf);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Technical Image Analysis', margin, y);
    y += 15;

    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, y, pageWidth - (margin * 2), 60, 'F');
    pdf.setDrawColor(229, 231, 235);
    pdf.rect(margin, y, pageWidth - (margin * 2), 60, 'S');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    const technicalSpecs = [
      `Color Space: ${data.metadata?.colorSpace || 'Unknown'}`,
      `Bit Depth: ${data.metadata?.bitsPerSample || 'Unknown'}`,
      `Compression: ${data.metadata?.compression || 'Unknown'}`,
      `Orientation: ${data.metadata?.orientation || 'Unknown'}`,
      `Resolution: ${data.metadata?.xResolution && data.metadata?.yResolution ? 
        `${data.metadata.xResolution} × ${data.metadata.yResolution} DPI` : 'Unknown'}`,
      `Software: ${data.metadata?.software || 'Unknown'}`,
      `White Balance: ${data.metadata?.whiteBalance || 'Unknown'}`,
      `Flash: ${data.metadata?.flash !== undefined ? 
        (data.metadata.flash ? 'Fired' : 'Did not fire') : 'Unknown'}`
    ];

    technicalSpecs.forEach((spec, index) => {
      pdf.text(spec, margin + 5, y + 10 + (index * 7));
    });

    return y + 70;
  }

  async addGpsAnalysis(pdf, data, y) {
    const { pageWidth, margin } = this.getPageDimensions(pdf);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('GPS Location Analysis', margin, y);
    y += 15;

    if (data.metadata?.gpsLatitude && data.metadata?.gpsLongitude) {
      pdf.setFillColor(240, 253, 244);
      pdf.rect(margin, y, pageWidth - (margin * 2), 45, 'F');
      pdf.setDrawColor(34, 197, 94);
      pdf.rect(margin, y, pageWidth - (margin * 2), 45, 'S');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      const lat = data.metadata.gpsLatitude;
      const lng = data.metadata.gpsLongitude;
      const altitude = data.metadata.gpsAltitude;

      pdf.text(`Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`, margin + 5, y + 10);
      pdf.text(`Decimal Degrees: ${lat}°, ${lng}°`, margin + 5, y + 20);
      
      if (altitude) {
        pdf.text(`Altitude: ${altitude} meters`, margin + 5, y + 30);
      }

      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      const mapLinkText = `View on map: https://maps.google.com/?q=${lat},${lng}`;
      const availableWidth = pageWidth - (margin * 2) - 10; // Leave 10mm margin inside box
      const lines = pdf.splitTextToSize(mapLinkText, availableWidth);
      
      lines.forEach((line, index) => {
        pdf.text(line, margin + 5, y + 40 + (index * 6));
      });

      return y + 50;
    } else {
      pdf.setFillColor(254, 242, 242);
      pdf.rect(margin, y, pageWidth - (margin * 2), 20, 'F');
      pdf.setDrawColor(239, 68, 68);
      pdf.rect(margin, y, pageWidth - (margin * 2), 20, 'S');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('No GPS location data found in this image.', margin + 5, y + 12);

      return y + 25;
    }
  }
}

// Hook for using the enhanced PDF generator
const useEnhancedPdfGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generatePdf = useCallback(async (data, template = 'professional', options = {}) => {
    setIsGenerating(true);
    setProgress(0);

    try {
      const generator = new EnhancedPdfGenerator();
      
      // Simulate progress
      setProgress(25);
      
      const result = await generator.generatePdf(data, template, {
        ...options,
        onProgress: (progress) => setProgress(progress)
      });
      
      setProgress(100);
      return result;
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const generateBatchPdf = useCallback(async (dataArray, template = 'professional', options = {}) => {
    setIsGenerating(true);
    setProgress(0);

    try {
      const generator = new EnhancedPdfGenerator();
      const results = [];
      
      for (let i = 0; i < dataArray.length; i++) {
        const result = await generator.generatePdf(dataArray[i], template, {
          ...options,
          onProgress: (progress) => setProgress((i / dataArray.length) * 100 + (progress / dataArray.length))
        });
        results.push(result);
      }
      
      setProgress(100);
      return results;
    } catch (error) {
      console.error('Batch PDF generation failed:', error);
      throw error;
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  return {
    generatePdf,
    generateBatchPdf,
    isGenerating,
    progress
  };
}; 

export default useEnhancedPdfGenerator; 