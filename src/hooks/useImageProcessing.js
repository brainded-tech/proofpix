// Fix for hooks/useImageProcessing.js
// The issue is that generateWarnings is called before it's defined

import { useMemo, useCallback } from 'react';
import { useMemoizedExifProcessing, useMemoizedFileAnalysis, useMemoizedGPSConversion } from '../utils/exifUtils';

export const useImageProcessing = (image, exifData) => {
  // MOVE generateWarnings BEFORE it's used
  const generateWarnings = useCallback((image, exifData, processedExif) => {
    const warnings = [];
    
    if (processedExif?.analysis?.possibleStripping?.stripped) {
      warnings.push({
        type: 'metadata_stripped',
        message: processedExif.analysis.possibleStripping.reason,
        severity: 'warning'
      });
    }
    
    if (processedExif?.quality?.completeness < 30) {
      warnings.push({
        type: 'low_metadata',
        message: 'This image has very limited metadata available.',
        severity: 'info'
      });
    }
    
    if (processedExif?.analysis?.imageSource === 'Screenshot') {
      warnings.push({
        type: 'screenshot_detected',
        message: 'Screenshots typically don\'t contain camera metadata.',
        severity: 'info'
      });
    }
    
    return warnings;
  }, []);

  // Memoize processed EXIF data
  const processedExif = useMemoizedExifProcessing(exifData, image);
  
  // Memoize file analysis
  const fileAnalysis = useMemoizedFileAnalysis(image);
  
  // Memoize GPS coordinates
  const gpsCoordinates = useMemoizedGPSConversion(
    exifData?.gpsLatitude,
    exifData?.gpsLongitude,
    exifData?.gpsLatitudeRef,
    exifData?.gpsLongitudeRef
  );
  
  // Memoize combined data - now generateWarnings is defined
  const combinedData = useMemo(() => ({
    image: fileAnalysis,
    exif: processedExif,
    gps: gpsCoordinates,
    hasRichData: processedExif?.quality?.hasRichData || false,
    completeness: processedExif?.quality?.completeness || 0,
    warnings: generateWarnings(image, exifData, processedExif)
  }), [fileAnalysis, processedExif, gpsCoordinates, image, exifData, generateWarnings]);
  
  return combinedData;
};