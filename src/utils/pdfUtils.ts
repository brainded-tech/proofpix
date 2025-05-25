import jsPDF from 'jspdf';
import { ProcessedImage } from '../types';
import { formatDateTime } from './formatters';

export const generatePDF = async (
  processedImage: ProcessedImage,
  showTimestamp: boolean = false
): Promise<Blob> => {
  console.log('Starting PDF generation...', { processedImage, showTimestamp });
  
  try {
  const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const footerHeight = 25; // Reserve space for footer
    const maxContentHeight = pageHeight - footerHeight;
  const { metadata } = processedImage;
  
    console.log('PDF initialized, loading banner...');
    
    // Load banner graphic with better error handling
    let bannerDataUrl = '';
    try {
      const bannerImg = new Image();
      bannerImg.crossOrigin = 'anonymous';
      
      const bannerPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Banner loading timeout'));
        }, 5000); // 5 second timeout
        
        bannerImg.onload = () => {
          clearTimeout(timeout);
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }
            canvas.width = bannerImg.width;
            canvas.height = bannerImg.height;
            ctx.drawImage(bannerImg, 0, 0);
            bannerDataUrl = canvas.toDataURL('image/png');
            console.log('Banner loaded successfully');
            resolve(bannerDataUrl);
          } catch (canvasError) {
            clearTimeout(timeout);
            reject(canvasError);
          }
        };
        
        bannerImg.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Banner image failed to load'));
        };
        
        bannerImg.src = '/pdfreportbanner.png';
      });
      
      await bannerPromise;
    } catch (error) {
      console.warn('Could not load PDF report banner:', error);
      bannerDataUrl = ''; // Ensure it's empty for fallback
    }
    
    console.log('Setting up PDF layout...');
    
    // Helper function to check if we need a new page
    const checkPageBreak = (requiredHeight: number): boolean => {
      return yPosition + requiredHeight > maxContentHeight;
    };
    
    // Helper function to add a new page with header
    const addNewPage = () => {
      pdf.addPage();
      yPosition = margin;
      
      // Add simple header on new page
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
      pdf.setTextColor(59, 130, 246);
      pdf.text('ProofPix Field Report (continued)', margin, yPosition);
      yPosition += 20;
    };
    
    let yPosition = margin;
    
    console.log('Adding header section...');
  
    // Header section with banner graphic or text fallback
    if (bannerDataUrl) {
      try {
        // Calculate banner dimensions to maintain aspect ratio
        const maxBannerWidth = pageWidth - (margin * 2);
        const maxBannerHeight = 60; // Maximum height for banner
        
        // Default dimensions if we can't get natural dimensions
        let bannerWidth = maxBannerWidth;
        let bannerHeight = 40; // Default reasonable height
        
        // Try to get actual dimensions but don't fail if we can't
        try {
          const bannerImg = new Image();
          bannerImg.src = bannerDataUrl;
          
          if (bannerImg.naturalWidth && bannerImg.naturalHeight) {
            const aspectRatio = bannerImg.naturalWidth / bannerImg.naturalHeight;
            bannerHeight = bannerWidth / aspectRatio;
            
            if (bannerHeight > maxBannerHeight) {
              bannerHeight = maxBannerHeight;
              bannerWidth = bannerHeight * aspectRatio;
            }
          }
        } catch (dimensionError) {
          console.warn('Could not get banner dimensions, using defaults:', dimensionError);
        }
        
        // Center the banner
        const bannerX = (pageWidth - bannerWidth) / 2;
        
        // Add banner with proper spacing
        pdf.addImage(bannerDataUrl, 'PNG', bannerX, yPosition, bannerWidth, bannerHeight);
        yPosition += bannerHeight + 20; // Add spacing below banner
        console.log('Banner added successfully');
        
      } catch (bannerError) {
        console.warn('Error adding banner, falling back to text header:', bannerError);
        // Fall back to text header if banner fails
  pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(24);
        pdf.setTextColor(59, 130, 246);
        pdf.text('ProofPix', margin, yPosition);
        yPosition += 15;
      }
    } else {
      // Text header fallback if banner fails to load
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246);
      pdf.text('ProofPix', margin, yPosition);
      yPosition += 15;
      console.log('Text header fallback used');
    }
    
    console.log('Adding content sections...');
    
    // Add a separator line between header and content
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(1);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
  
    // Main title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(17, 24, 39);
    pdf.text('Field Report: Image Metadata Analysis', margin, yPosition);
    yPosition += 10;
    
    // Report metadata
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    const reportDate = new Date().toLocaleString();
    pdf.text(`Generated: ${reportDate}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Report ID: RPT-${Date.now()}`, margin, yPosition);
    yPosition += 15;
    
    // Add a separator line
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    // Add image section
    const imageHeight = 100; // Estimated height including title and spacing
    if (checkPageBreak(imageHeight)) {
      addNewPage();
    }
    
    try {
      const imageUrl = showTimestamp && processedImage.timestampedUrl 
        ? processedImage.timestampedUrl 
        : processedImage.previewUrl;
      
      console.log('Adding image preview...');
      
      // Create a proper image section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(17, 24, 39);
      pdf.text('Image Preview', margin, yPosition);
      yPosition += 10;
      
      // Calculate optimal image size
      const maxImageWidth = pageWidth - (margin * 2);
      const maxImageHeight = 80;
      
      let imgWidth = maxImageWidth;
      let imgHeight = maxImageHeight;
      
      if (metadata.imageWidth && metadata.imageHeight) {
        const aspectRatio = metadata.imageWidth / metadata.imageHeight;
        if (aspectRatio > 1) {
          // Landscape
          imgHeight = imgWidth / aspectRatio;
          if (imgHeight > maxImageHeight) {
            imgHeight = maxImageHeight;
            imgWidth = imgHeight * aspectRatio;
          }
        } else {
          // Portrait or square
          imgWidth = imgHeight * aspectRatio;
          if (imgWidth > maxImageWidth) {
            imgWidth = maxImageWidth;
            imgHeight = imgWidth / aspectRatio;
          }
        }
      }
      
      // Center the image
      const imgX = (pageWidth - imgWidth) / 2;
      
      // Add a border around the image
      pdf.setFillColor(249, 250, 251);
      pdf.rect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 'F');
      pdf.setDrawColor(209, 213, 219);
      pdf.rect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4, 'S');
      
      pdf.addImage(imageUrl, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 15;
      console.log('Image preview added successfully');
      
    } catch (error) {
      console.warn('Could not add image to PDF:', error);
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(10);
      pdf.setTextColor(156, 163, 175);
      pdf.text('Image could not be embedded in this report', margin, yPosition);
      yPosition += 15;
    }
    
    // File Information Section
    const fileInfoHeight = 55;
    if (checkPageBreak(fileInfoHeight)) {
      addNewPage();
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(17, 24, 39);
    pdf.text('File Information', margin, yPosition);
    yPosition += 10;
    
    // Create a styled info box
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 35, 'F');
    pdf.setDrawColor(229, 231, 235);
    pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 35, 'S');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    
    const fileInfo = [
      ['File Name:', String(metadata.fileName || 'Unknown')],
      ['File Size:', String(metadata.fileSize || 'Unknown')],
      ['File Type:', String(metadata.fileType || 'Unknown')],
      ['Dimensions:', metadata.imageWidth && metadata.imageHeight 
        ? `${metadata.imageWidth} × ${metadata.imageHeight} pixels`
        : 'Unknown']
    ];
    
    fileInfo.forEach(([label, value], index) => {
      const x = index < 2 ? margin + 5 : pageWidth / 2 + 5;
      const y = yPosition + (index % 2) * 8;
      pdf.setFont('helvetica', 'bold');
      pdf.text(String(label), x, y);
      pdf.setFont('helvetica', 'normal');
      const labelWidth = pdf.getTextWidth(String(label));
      pdf.text(String(value), x + labelWidth + 3, y);
    });
    
    yPosition += 45;
    
    // Camera Information Section (if available)
    if (metadata.make || metadata.model || metadata.software) {
      console.log('Adding camera information...');
      
      const cameraInfoHeight = 45;
      if (checkPageBreak(cameraInfoHeight)) {
        addNewPage();
      }
      
    pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(17, 24, 39);
      pdf.text('Camera Information', margin, yPosition);
    yPosition += 10;
      
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 25, 'F');
      pdf.setDrawColor(229, 231, 235);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 25, 'S');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
      pdf.setTextColor(55, 65, 81);
      
      const cameraInfo = [
        ['Make:', String(metadata.make || 'N/A')],
        ['Model:', String(metadata.model || 'N/A')],
        ['Software:', String(metadata.software || 'N/A')]
      ];
      
      cameraInfo.forEach(([label, value], index) => {
        const y = yPosition + index * 6;
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(label), margin + 5, y);
        pdf.setFont('helvetica', 'normal');
        const labelWidth = pdf.getTextWidth(String(label));
        pdf.text(String(value), margin + 5 + labelWidth + 3, y);
      });
    
      yPosition += 35;
  }
  
    // Camera Settings Section (if available)
    if (metadata.exposureTime || metadata.fNumber || metadata.iso || metadata.focalLength) {
      console.log('Adding camera settings...');
      
      const cameraSettingsHeight = 55;
      if (checkPageBreak(cameraSettingsHeight)) {
        addNewPage();
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(17, 24, 39);
      pdf.text('Camera Settings', margin, yPosition);
      yPosition += 10;
      
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 35, 'F');
      pdf.setDrawColor(229, 231, 235);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 35, 'S');
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(55, 65, 81);
      
      const settingsInfo = [
        ['Exposure:', String(metadata.exposureTime || 'N/A')],
        ['Aperture:', metadata.fNumber ? `f/${metadata.fNumber}` : 'N/A'],
        ['ISO:', String(metadata.iso || 'N/A')],
        ['Focal Length:', String(metadata.focalLength || 'N/A')]
      ];
      
      settingsInfo.forEach(([label, value], index) => {
        const x = index < 2 ? margin + 5 : pageWidth / 2 + 5;
        const y = yPosition + (index % 2) * 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(label), x, y);
        pdf.setFont('helvetica', 'normal');
        const labelWidth = pdf.getTextWidth(String(label));
        pdf.text(String(value), x + labelWidth + 3, y);
      });
      
      yPosition += 45;
    }
    
    // Timestamp Information Section (if available)
    if (metadata.dateTime) {
      console.log('Adding timestamp information...');
      
      const timestampHeight = 35;
      if (checkPageBreak(timestampHeight)) {
        addNewPage();
      }
      
    pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(17, 24, 39);
      pdf.text('Timestamp Information', margin, yPosition);
    yPosition += 10;
      
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 15, 'F');
      pdf.setDrawColor(229, 231, 235);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 15, 'S');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
      pdf.setTextColor(55, 65, 81);
      
      pdf.text('Date Taken:', margin + 5, yPosition);
      const dateLabel = 'Date Taken:';
      const labelWidth = pdf.getTextWidth(dateLabel);
      pdf.text(formatDateTime(metadata.dateTime), margin + 5 + labelWidth + 3, yPosition);
      
      yPosition += 25;
    }
    
    // GPS Information Section (if available)
    if (metadata.gpsLatitude !== undefined && metadata.gpsLongitude !== undefined) {
      console.log('Adding GPS information...');
      
      const gpsHeight = 45;
      if (checkPageBreak(gpsHeight)) {
        addNewPage();
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(17, 24, 39);
      pdf.text('Location Information', margin, yPosition);
      yPosition += 10;
      
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 25, 'F');
      pdf.setDrawColor(229, 231, 235);
      pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 25, 'S');
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(55, 65, 81);
    
    const formatCoord = (value: number, type: 'lat' | 'lng') => {
      const direction = type === 'lat' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');
      return `${Math.abs(value).toFixed(6)}° ${direction}`;
    };
    
    const gpsInfo = [
      ['Latitude:', formatCoord(metadata.gpsLatitude, 'lat')],
        ['Longitude:', formatCoord(metadata.gpsLongitude, 'lng')]
      ];
      
      gpsInfo.forEach(([label, value], index) => {
        const y = yPosition + index * 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(label), margin + 5, y);
        pdf.setFont('helvetica', 'normal');
        const labelWidth = pdf.getTextWidth(String(label));
        pdf.text(String(value), margin + 5 + labelWidth + 3, y);
      });
      
      yPosition += 30;
    }
    
    // Add detailed metadata section if there's space or on a new page
    const detailedMetadataHeight = 80;
    if (checkPageBreak(detailedMetadataHeight)) {
      addNewPage();
    }
    
    console.log('Adding technical details...');
    
    // Additional Technical Details Section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(17, 24, 39);
    pdf.text('Technical Details', margin, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(55, 65, 81);
    
    // Add more detailed technical information (only using properties that exist on ImageMetadata)
    const technicalDetails = [
      ['Color Space:', String(metadata.colorSpace || 'N/A')],
      ['Orientation:', String(metadata.orientation || 'N/A')],
      ['Flash:', String(metadata.flash || 'N/A')],
      ['White Balance:', String(metadata.whiteBalance || 'N/A')],
      ['Metering Mode:', String(metadata.meteringMode || 'N/A')],
      ['Exposure Program:', String(metadata.exposureProgram || 'N/A')]
    ];
    
    technicalDetails.forEach(([label, value], index) => {
      if (checkPageBreak(8)) {
        addNewPage();
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(String(label), margin + 5, yPosition);
      pdf.setFont('helvetica', 'normal');
      const labelWidth = pdf.getTextWidth(String(label) + ' ');
      pdf.text(String(value), margin + 5 + labelWidth, yPosition);
      yPosition += 7;
    });
    
    console.log('Adding footers...');
    
    // Footer with ProofPix branding on all pages
    const totalPages = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      const footerY = pageHeight - 15;
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      
      // Bottom right footer as requested
      const footerText = 'Generated by ProofPix - Privacy Focused EXIF Extraction';
      const footerWidth = pdf.getTextWidth(footerText);
      pdf.text(footerText, pageWidth - margin - footerWidth, footerY);
      
      // Add page number on bottom left
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Page ${i} of ${totalPages}`, margin, footerY);
    }
    
    console.log('PDF generation completed successfully');
    return pdf.output('blob');
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`PDF generation failed: ${errorMessage}`);
  }
};

export const downloadPDF = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 