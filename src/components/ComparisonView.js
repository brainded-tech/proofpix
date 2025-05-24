// 2. Create components/ComparisonView.js - Side-by-side image viewer

import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import * as LucideIcons from 'lucide-react';

const ComparisonView = memo(({ 
  imageA, 
  imageB, 
  syncZoom, 
  setSyncZoom, 
  comparisonResults 
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [showOverlay, setShowOverlay] = useState(true);
  
  const containerRef = useRef(null);
  const imageARef = useRef(null);
  const imageBRef = useRef(null);
  
  // Reset zoom when images change
  useEffect(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [imageA.file, imageB.file]);
  
  // Zoom handlers
  const handleZoom = useCallback((delta, clientX, clientY) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = (clientX - rect.left) / rect.width;
    const centerY = (clientY - rect.top) / rect.height;
    
    setZoomLevel(prev => {
      const newZoom = Math.max(0.5, Math.min(5, prev + delta));
      
      // Adjust pan position to zoom towards cursor
      if (delta !== 0) {
        setPanPosition(prevPan => ({
          x: prevPan.x - (centerX - 0.5) * delta * 50,
          y: prevPan.y - (centerY - 0.5) * delta * 50
        }));
      }
      
      return newZoom;
    });
  }, []);
  
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.01;
    handleZoom(delta, e.clientX, e.clientY);
  }, [handleZoom]);
  
  // Pan handlers
  const handleMouseDown = useCallback((e) => {
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, []);
  
  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    
    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;
    
    setPanPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isPanning, lastPanPoint]);
  
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);
  
  // Zoom controls
  const zoomIn = () => handleZoom(0.2, 0, 0);
  const zoomOut = () => handleZoom(-0.2, 0, 0);
  const resetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };
  
  // Fit to container
  const fitToContainer = () => {
    if (!imageARef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageARef.current.getBoundingClientRect();
    
    const scaleX = (containerRect.width / 2 - 40) / imageRect.width;
    const scaleY = (containerRect.height - 100) / imageRect.height;
    const optimalZoom = Math.min(scaleX, scaleY, 1);
    
    setZoomLevel(optimalZoom);
    setPanPosition({ x: 0, y: 0 });
  };
  
  // Comparison summary
  const getSummaryIcon = (similarity) => {
    if (similarity > 0.8) return { icon: LucideIcons.CheckCircle, color: '#22c55e', text: 'Very Similar' };
    if (similarity > 0.6) return { icon: LucideIcons.AlertCircle, color: '#f59e0b', text: 'Somewhat Similar' };
    return { icon: LucideIcons.XCircle, color: '#ef4444', text: 'Different' };
  };
  
  const summaryInfo = comparisonResults ? getSummaryIcon(comparisonResults.summary.similarity) : null;
  
  return (
    <div className="comparison-view">
      {/* Controls Bar */}
      <div className="comparison-controls">
        <div className="zoom-controls">
          <button onClick={zoomOut} disabled={zoomLevel <= 0.5} title="Zoom Out">
            <LucideIcons.ZoomOut size={16} />
          </button>
          
          <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
          
          <button onClick={zoomIn} disabled={zoomLevel >= 5} title="Zoom In">
            <LucideIcons.ZoomIn size={16} />
          </button>
          
          <button onClick={resetZoom} title="Reset Zoom">
            <LucideIcons.RotateCcw size={16} />
          </button>
          
          <button onClick={fitToContainer} title="Fit to Container">
            <LucideIcons.Maximize2 size={16} />
          </button>
        </div>
        
        <div className="view-controls">
          <label className="sync-control">
            <input
              type="checkbox"
              checked={syncZoom}
              onChange={(e) => setSyncZoom(e.target.checked)}
            />
            <span>Sync Zoom</span>
          </label>
          
          <label className="overlay-control">
            <input
              type="checkbox"
              checked={showOverlay}
              onChange={(e) => setShowOverlay(e.target.checked)}
            />
            <span>Show Info</span>
          </label>
        </div>
        
        {/* Quick Comparison Summary */}
        {comparisonResults && summaryInfo && (
          <div className="quick-summary">
            <summaryInfo.icon size={16} style={{ color: summaryInfo.color }} />
            <span style={{ color: summaryInfo.color }}>{summaryInfo.text}</span>
            <span className="similarity-score">
              {Math.round(comparisonResults.summary.similarity * 100)}% Similar
            </span>
          </div>
        )}
      </div>
      
      {/* Image Comparison Container */}
      <div 
        className="image-comparison-container"
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {/* Image A */}
        <div className="image-panel panel-a">
          <div className="image-wrapper">
            <img
              ref={imageARef}
              src={imageA.preview}
              alt={imageA.file.name}
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                transformOrigin: 'center center'
              }}
              draggable={false}
            />
            
            {showOverlay && (
              <div className="image-overlay overlay-a">
                <div className="image-info">
                  <h4>Image A</h4>
                  <p className="filename">{imageA.file.name}</p>
                  <p className="filesize">{(imageA.file.size / 1024).toFixed(1)} KB</p>
                  {imageA.exif?.make && (
                    <p className="camera">{imageA.exif.make} {imageA.exif.model}</p>
                  )}
                  {imageA.exif?.dateTimeOriginal && (
                    <p className="date">{new Date(imageA.exif.dateTimeOriginal).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Divider */}
        <div className="comparison-divider">
          <div className="divider-line"></div>
        </div>
        
        {/* Image B */}
        <div className="image-panel panel-b">
          <div className="image-wrapper">
            <img
              ref={imageBRef}
              src={imageB.preview}
              alt={imageB.file.name}
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                transformOrigin: 'center center'
              }}
              draggable={false}
            />
            
            {showOverlay && (
              <div className="image-overlay overlay-b">
                <div className="image-info">
                  <h4>Image B</h4>
                  <p className="filename">{imageB.file.name}</p>
                  <p className="filesize">{(imageB.file.size / 1024).toFixed(1)} KB</p>
                  {imageB.exif?.make && (
                    <p className="camera">{imageB.exif.make} {imageB.exif.model}</p>
                  )}
                  {imageB.exif?.dateTimeOriginal && (
                    <p className="date">{new Date(imageB.exif.dateTimeOriginal).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Key Differences Summary */}
      {comparisonResults && (
        <div className="key-differences">
          <h4>📊 Key Differences:</h4>
          <div className="differences-grid">
            <div className="diff-item">
              <LucideIcons.Camera size={16} />
              <span>Camera: {comparisonResults.camera.sameMake && comparisonResults.camera.sameModel ? '✅ Same' : '❌ Different'}</span>
            </div>
            
            {comparisonResults.gps.bothHaveGPS && (
              <div className="diff-item">
                <LucideIcons.MapPin size={16} />
                <span>
                  Location: {comparisonResults.gps.distance < 0.1 ? '✅ Same spot' : 
                    `📍 ${comparisonResults.gps.distance.toFixed(2)}km apart`}
                </span>
              </div>
            )}
            
            <div className="diff-item">
              <LucideIcons.Settings size={16} />
              <span>Settings: {comparisonResults.camera.sameSettings ? '✅ Same' : '❌ Different'}</span>
            </div>
            
            <div className="diff-item">
              <LucideIcons.FileText size={16} />
              <span>Metadata: {comparisonResults.summary.totalDifferences} differences</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Usage Hint */}
      <div className="usage-hint">
        💡 <strong>Tip:</strong> Use mouse wheel to zoom, drag to pan. Enable "Sync Zoom" to zoom both images together.
      </div>
    </div>
  );
});

ComparisonView.displayName = 'ComparisonView';
export default ComparisonView;