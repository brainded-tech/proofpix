// 1. Create components/ImageComparisonTool.js - Main comparison interface

import React, { useState, useRef, useCallback, useMemo, memo } from 'react';
import * as LucideIcons from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import ComparisonView from './ComparisonView';
import MetadataDiff from './MetadataDiff';
import { useExifExtraction } from '../hooks/useExifExtraction';
import { useComparisonReport } from '../hooks/useComparisonReport';
import { validateImageFile } from '../utils/fileUtils';
import EnhancedLoadingSpinner from './EnhancedLoadingSpinner';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { compareExifData } from '../utils/exifUtils';
import { mobileUtils } from '../utils/mobileUtils';
// Remove any import for ComparisonReport

const ImageComparisonTool = memo(() => {
  // State for both images
  const [imageA, setImageA] = useState(null);
  const [imageB, setImageB] = useState(null);
  const [exifA, setExifA] = useState(null);
  const [exifB, setExifB] = useState(null);
  const [previewA, setPreviewA] = useState(null);
  const [previewB, setPreviewB] = useState(null);

   // Add mobile detection
  const isMobile = mobileUtils.isMobile();
  const [mobileView, setMobileView] = useState('upload'); // 'upload', 'imageA', 'imageB', 'compare'
  
  // UI state
  const [isProcessing, setIsProcessing] = useState({ a: false, b: false });
  const [activePanel, setActivePanel] = useState('images'); // 'images', 'metadata', 'report'
  const [syncZoom, setSyncZoom] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { extractExif } = useExifExtraction();
  
  // Process image data using our existing hook
  const processedDataA = useImageProcessing(imageA, exifA);
  const processedDataB = useImageProcessing(imageB, exifB);
  
  // Calculate comparison results
  const comparisonResults = useMemo(() => {
    if (!exifA || !exifB) return null;
    
    const metadataComparison = compareExifData(exifA, exifB);
    
    // Calculate file differences
    const fileDiff = {
      sizeDifference: imageA && imageB ? Math.abs(imageA.size - imageB.size) : 0,
      sizePercentage: imageA && imageB ? ((Math.abs(imageA.size - imageB.size) / Math.max(imageA.size, imageB.size)) * 100).toFixed(1) : 0,
      typeDifferent: imageA?.type !== imageB?.type,
      nameDifferent: imageA?.name !== imageB?.name
    };
    
    // GPS comparison
    const gpsComparison = {
      bothHaveGPS: !!(processedDataA?.gps && processedDataB?.gps),
      distance: calculateGPSDistance(processedDataA?.gps, processedDataB?.gps),
      locationDifferent: !!(processedDataA?.gps && processedDataB?.gps && 
        (processedDataA.gps.lat !== processedDataB.gps.lat || 
         processedDataA.gps.lng !== processedDataB.gps.lng))
    };
    
    // Camera comparison
    const cameraComparison = {
      sameMake: exifA.make === exifB.make,
      sameModel: exifA.model === exifB.model,
      sameSettings: (
        exifA.fNumber === exifB.fNumber &&
        exifA.exposureTime === exifB.exposureTime &&
        exifA.iso === exifB.iso &&
        exifA.focalLength === exifB.focalLength
      )
    };
    
    return {
      metadata: metadataComparison,
      file: fileDiff,
      gps: gpsComparison,
      camera: cameraComparison,
      summary: {
        totalDifferences: metadataComparison.differences?.length || 0,
        similarity: metadataComparison.similarity || 0,
        likelyRelated: determineLikelyRelated(metadataComparison, fileDiff, gpsComparison, cameraComparison)
      }
    };
  }, [exifA, exifB, imageA, imageB, processedDataA, processedDataB]);
  
  // File upload handlers
  const handleFileUpload = useCallback(async (files, side) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsProcessing(prev => ({ ...prev, [side]: true }));
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      if (side === 'a') {
        // Clean up previous preview
        if (previewA) URL.revokeObjectURL(previewA);
        setImageA(file);
        setPreviewA(previewUrl);
      } else {
        // Clean up previous preview
        if (previewB) URL.revokeObjectURL(previewB);
        setImageB(file);
        setPreviewB(previewUrl);
      }
      
      // Extract EXIF data
      const extractedExif = await extractExif(file);
      
      if (side === 'a') {
        setExifA(extractedExif);
      } else {
        setExifB(extractedExif);
      }
      
    } catch (error) {
      console.error(`Error processing image ${side.toUpperCase()}:`, error);
      if (side === 'a') {
        setExifA({ error: "Unable to extract EXIF data from this image." });
      } else {
        setExifB({ error: "Unable to extract EXIF data from this image." });
      }
    } finally {
      setIsProcessing(prev => ({ ...prev, [side]: false }));
    }
  }, [extractExif, previewA, previewB]);
  
  // Create dropzones for both sides
  const dropzoneA = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.heic', '.heif', '.tiff'] },
    onDrop: (files) => handleFileUpload(files, 'a'),
    maxFiles: 1,
    multiple: false
  });
  
  const dropzoneB = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.heic', '.heif', '.tiff'] },
    onDrop: (files) => handleFileUpload(files, 'b'),
    maxFiles: 1,
    multiple: false
  });
  
  // Clear comparison
  const clearComparison = useCallback(() => {
    if (previewA) URL.revokeObjectURL(previewA);
    if (previewB) URL.revokeObjectURL(previewB);
    
    setImageA(null);
    setImageB(null);
    setExifA(null);
    setExifB(null);
    setPreviewA(null);
    setPreviewB(null);
    setActivePanel('images');
  }, [previewA, previewB]);
  
  // Swap images
  const swapImages = useCallback(() => {
    const tempImage = imageA;
    const tempExif = exifA;
    const tempPreview = previewA;
    
    setImageA(imageB);
    setExifA(exifB);
    setPreviewA(previewB);
    
    setImageB(tempImage);
    setExifB(tempExif);
    setPreviewB(tempPreview);
  }, [imageA, imageB, exifA, exifB, previewA, previewB]);
  
  const hasImages = imageA && imageB;
  const hasComparison = hasImages && exifA && exifB && comparisonResults;

  const renderMobileMetadata = (exifData) => {
  if (!exifData) return <p>No metadata available</p>;
  
  const formatValue = (key, value) => {
    if (!value) return 'N/A';
    
    // Handle Date objects
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    
    // Handle date strings
    if (key.toLowerCase().includes('date') && typeof value === 'string') {
      try {
        return new Date(value).toLocaleString();
      } catch {
        return value;
      }
    }
    
    // Handle specific EXIF fields
    switch (key) {
      case 'fNumber':
        return `f/${value}`;
      case 'exposureTime':
        return typeof value === 'number' && value < 1 
          ? `1/${Math.round(1/value)}s` 
          : `${value}s`;
      case 'focalLength':
        return `${value}mm`;
      case 'iso':
        return `ISO ${value}`;
      default:
        return String(value);
    }
  };
  
  const keyFields = [
    { key: 'make', label: 'Camera Make' },
    { key: 'model', label: 'Camera Model' },
    { key: 'dateTimeOriginal', label: 'Date Taken' },
    { key: 'iso', label: 'ISO' },
    { key: 'fNumber', label: 'Aperture' },
    { key: 'exposureTime', label: 'Shutter Speed' },
    { key: 'focalLength', label: 'Focal Length' }
  ];
  
  return (
    <div className="metadata-list">
      {keyFields.map(({ key, label }) => (
        exifData[key] && (
          <div key={key} className="metadata-item">
            <span className="label">{label}:</span>
            <span className="value">{formatValue(key, exifData[key])}</span>
          </div>
        )
      ))}
    </div>
  );
};
  
  return (
      <div className={`image-comparison-tool ${isMobile ? 'mobile' : 'desktop'}`}>
        {/* Header */}
        <div className="comparison-header">
          <div className="header-left">
            <h2>
              <LucideIcons.Split size={24} />
              {isMobile ? 'Compare' : 'Image Comparison Tool'}
            </h2>
            {!isMobile && <p>Compare EXIF metadata between two images side-by-side</p>}
          </div>
          
          <div className="header-actions">
            {hasImages && (
              <>
                {!isMobile && (
                  <button onClick={swapImages} className="swap-btn" title="Swap images">
                    <LucideIcons.ArrowLeftRight size={16} />
                    Swap
                  </button>
                )}
                
                <button onClick={clearComparison} className="clear-btn" title="Clear comparison">
                  <LucideIcons.X size={16} />
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile View Selector */}
        {isMobile && hasImages && (
          <div className="mobile-view-selector">
            <button 
              className={`view-btn ${mobileView === 'imageA' ? 'active' : ''}`}
              onClick={() => setMobileView('imageA')}
            >
              Image A
            </button>
            <button 
              className={`view-btn ${mobileView === 'imageB' ? 'active' : ''}`}
              onClick={() => setMobileView('imageB')}
            >
              Image B
            </button>
            <button 
              className={`view-btn ${mobileView === 'compare' ? 'active' : ''}`}
              onClick={() => setMobileView('compare')}
            >
              Compare
            </button>
          </div>
        )}
        
        {/* Navigation Tabs - Desktop only */}
        {!isMobile && hasImages && (
          <div className="comparison-tabs">
            <button 
              className={`tab ${activePanel === 'images' ? 'active' : ''}`}
              onClick={() => setActivePanel('images')}
            >
              <LucideIcons.Image size={16} />
              Images
            </button>
            
            <button 
              className={`tab ${activePanel === 'metadata' ? 'active' : ''}`}
              onClick={() => setActivePanel('metadata')}
              disabled={!hasComparison}
            >
              <LucideIcons.FileText size={16} />
              Metadata
              {hasComparison && comparisonResults.summary.totalDifferences > 0 && (
                <span className="diff-badge">{comparisonResults.summary.totalDifferences}</span>
              )}
            </button>
            
            <button 
              className={`tab ${activePanel === 'report' ? 'active' : ''}`}
              onClick={() => setActivePanel('report')}
              disabled={!hasComparison}
            >
              <LucideIcons.FileBarChart size={16} />
              Report
            </button>
          </div>
        )}
        
        {/* Main Content */}
        <div className="comparison-content">
          {!hasImages ? (
            // Upload Interface - Mobile optimized
            <div className={`upload-interface ${isMobile ? 'mobile' : ''}`}>
              {isMobile ? (
                // Mobile stacked layout
                <div className="mobile-upload-stack">
                  <div className="upload-panel">
                    <div 
                      className={`upload-dropzone ${dropzoneA.isDragActive ? 'drag-active' : ''} ${imageA ? 'has-image' : ''}`}
                      {...dropzoneA.getRootProps()}
                    >
                      <input {...dropzoneA.getInputProps()} />
                      {isProcessing.a ? (
                        <div className="processing-state">
                          <div className="spinner-animation" />
                          <p>Processing...</p>
                        </div>
                      ) : imageA ? (
                        <div className="upload-content success">
                          <LucideIcons.CheckCircle size={48} />
                          <h3>Image A Ready</h3>
                          <p>{imageA.name}</p>
                          <button className="change-image-btn">Change</button>
                        </div>
                      ) : (
                        <div className="upload-content">
                          <LucideIcons.Upload size={48} />
                          <h3>Image A</h3>
                          <p>Tap to select</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="vs-divider-mobile">
                    <LucideIcons.ArrowDown size={24} />
                  </div>
                  
                  <div className="upload-panel">
                    <div 
                      className={`upload-dropzone ${dropzoneB.isDragActive ? 'drag-active' : ''} ${imageB ? 'has-image' : ''}`}
                      {...dropzoneB.getRootProps()}
                    >
                      <input {...dropzoneB.getInputProps()} />
                      {isProcessing.b ? (
                        <div className="processing-state">
                          <div className="spinner-animation" />
                          <p>Processing...</p>
                        </div>
                      ) : imageB ? (
                        <div className="upload-content success">
                          <LucideIcons.CheckCircle size={48} />
                          <h3>Image B Ready</h3>
                          <p>{imageB.name}</p>
                          <button className="change-image-btn">Change</button>
                        </div>
                      ) : (
                        <div className="upload-content">
                          <LucideIcons.Upload size={48} />
                          <h3>Image B</h3>
                          <p>Tap to select</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {imageA && imageB && (
                    <button 
                      className="compare-now-btn"
                      onClick={() => setMobileView('compare')}
                    >
                      <LucideIcons.GitCompare size={20} />
                      Compare Images
                    </button>
                  )}
                </div>
              ) : (
                // Desktop grid layout (existing)
                <div className="upload-grid">
                  {/* Image A Upload */}
                  <div className="upload-panel">
                    <div 
                      className={`upload-dropzone ${dropzoneA.isDragActive ? 'drag-active' : ''}`}
                      {...dropzoneA.getRootProps()}
                    >
                      <input {...dropzoneA.getInputProps()} />
                      {isProcessing.a ? (
                        <div className="processing-state">
                          <div className="spinner-animation" />
                          <p>Processing Image A...</p>
                        </div>
                      ) : (
                        <div className="upload-content">
                          <LucideIcons.Upload size={48} />
                          <h3>Image A</h3>
                          <p>Drop image here or click to select</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* VS Divider */}
                  <div className="vs-divider">
                    <div className="vs-circle">VS</div>
                  </div>
                  
                  {/* Image B Upload */}
                  <div className="upload-panel">
                    <div 
                      className={`upload-dropzone ${dropzoneB.isDragActive ? 'drag-active' : ''}`}
                      {...dropzoneB.getRootProps()}
                    >
                      <input {...dropzoneB.getInputProps()} />
                      {isProcessing.b ? (
                        <div className="processing-state">
                          <div className="spinner-animation" />
                          <p>Processing Image B...</p>
                        </div>
                      ) : (
                        <div className="upload-content">
                          <LucideIcons.Upload size={48} />
                          <h3>Image B</h3>
                          <p>Drop image here or click to select</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quick Tips */}
              <div className="comparison-tips">
                <h4>💡 Comparison Tips:</h4>
                <ul>
                  <li>Compare images from the same shoot to verify authenticity</li>
                  <li>Check if images were taken with the same camera</li>
                  <li>Analyze GPS data to verify location claims</li>
                  <li>Detect potential editing or metadata manipulation</li>
                </ul>
              </div>
            </div>
          ) : (
            // Comparison Views - Mobile optimized
            <>
              {isMobile ? (
                // Mobile view based on selection
                <>
                  {mobileView === 'imageA' && (
                    <div className="mobile-image-view">
                      <h3>Image A: {imageA.name}</h3>
                      <img src={previewA} alt={imageA.name} />
                      <div className="mobile-metadata">
                        <h4>Metadata</h4>
                        {renderMobileMetadata(exifA)}
                      </div>
                    </div>
                  )}
                  
                  {mobileView === 'imageB' && (
                    <div className="mobile-image-view">
                      <h3>Image B: {imageB.name}</h3>
                      <img src={previewB} alt={imageB.name} />
                      <div className="mobile-metadata">
                        <h4>Metadata</h4>
                        {renderMobileMetadata(exifB)}
                      </div>
                    </div>
                  )}
                  
                  {mobileView === 'compare' && (
                    <div className="mobile-comparison">
                      <MetadataDiff
                        exifA={exifA}
                        exifB={exifB}
                        imageA={imageA}
                        imageB={imageB}
                        comparisonResults={comparisonResults}
                        showAdvanced={showAdvanced}
                        setShowAdvanced={setShowAdvanced}
                        isMobile={true}
                      />
                    </div>
                  )}
                </>
              ) : (
                // Desktop views (existing)
                <>
                  {activePanel === 'images' && (
                    <ComparisonView
                      imageA={{ file: imageA, preview: previewA, exif: exifA }}
                      imageB={{ file: imageB, preview: previewB, exif: exifB }}
                      syncZoom={syncZoom}
                      setSyncZoom={setSyncZoom}
                      comparisonResults={comparisonResults}
                    />
                  )}
                  
                  {activePanel === 'metadata' && hasComparison && (
                    <MetadataDiff
                      exifA={exifA}
                      exifB={exifB}
                      imageA={imageA}
                      imageB={imageB}
                      comparisonResults={comparisonResults}
                      showAdvanced={showAdvanced}
                      setShowAdvanced={setShowAdvanced}
                    />
                  )}
                  
                  {activePanel === 'report' && hasComparison && (
                    <div className="comparison-report-placeholder">
                      <h3>Comparison Report</h3>
                      <div className="report-summary">
                        <h4>Summary</h4>
                        <p>Similarity Score: {(comparisonResults.summary.similarity * 100).toFixed(1)}%</p>
                        <p>Total Differences: {comparisonResults.summary.totalDifferences}</p>
                        <p>Likelihood Related: {comparisonResults.summary.likelyRelated.likelihood}</p>
                        <p>Confidence: {comparisonResults.summary.likelyRelated.confidence}%</p>
                      </div>
                      <div className="report-actions">
                        <button className="export-btn">
                          <LucideIcons.Download size={16} />
                          Export Report (Coming Soon)
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
        
        {/* Mobile Action Bar */}
        {isMobile && hasImages && (
          <div className="mobile-action-bar">
            <button onClick={swapImages} className="action-btn">
              <LucideIcons.ArrowLeftRight size={20} />
              Swap
            </button>
            <button onClick={() => setActivePanel('report')} className="action-btn" disabled={!hasComparison}>
              <LucideIcons.Download size={20} />
              Export
            </button>
          </div>
        )}
      </div>
    );
  });

// Helper Functions
const calculateGPSDistance = (gpsA, gpsB) => {
  if (!gpsA || !gpsB) return null;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (parseFloat(gpsB.lat) - parseFloat(gpsA.lat)) * Math.PI / 180;
  const dLon = (parseFloat(gpsB.lng) - parseFloat(gpsA.lng)) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(parseFloat(gpsA.lat) * Math.PI / 180) * Math.cos(parseFloat(gpsB.lat) * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance; // Distance in kilometers
};

const determineLikelyRelated = (metadataComp, fileComp, gpsComp, cameraComp) => {
  let score = 0;
  
  // Same camera increases likelihood
  if (cameraComp.sameMake && cameraComp.sameModel) score += 30;
  else if (cameraComp.sameMake) score += 15;
  
  // Close GPS locations increase likelihood
  if (gpsComp.bothHaveGPS) {
    if (gpsComp.distance < 0.1) score += 25; // Within 100m
    else if (gpsComp.distance < 1) score += 15; // Within 1km
    else if (gpsComp.distance < 10) score += 5; // Within 10km
  }
  
  // High metadata similarity
  if (metadataComp.similarity > 0.8) score += 20;
  else if (metadataComp.similarity > 0.6) score += 10;
  
  // Same settings suggest same session
  if (cameraComp.sameSettings) score += 15;
  
  return {
    score,
    likelihood: score > 60 ? 'High' : score > 30 ? 'Medium' : 'Low',
    confidence: Math.min(score, 100)
  };
};

ImageComparisonTool.displayName = 'ImageComparisonTool';
export default ImageComparisonTool;