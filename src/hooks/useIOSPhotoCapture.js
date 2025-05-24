// hooks/useIOSPhotoCapture.js
import { useCallback } from 'react';
import { Logger } from '../utils/logger';

const logger = new Logger('IOSPhotoCapture');

export const useIOSPhotoCapture = () => {
  const captureFromFileInput = useCallback(async (file) => {
    // Try to extract metadata from the file input itself
    const metadata = {
      fileName: file.name,
      fileSize: file.size,
      lastModified: new Date(file.lastModified).toISOString(),
      
      // Parse filename for clues (iOS often includes metadata in filename)
      // Example: IMG_1234.HEIC or Photo_2024-01-15_10-30-45.jpg
      filenameMetadata: parseIOSFilename(file.name)
    };
    
    // If it's a HEIC file, it might have more metadata preserved
    if (file.name.toLowerCase().includes('.heic')) {
      metadata.possibleOriginal = true;
      metadata.tip = 'HEIC files often preserve more metadata';
    }
    
    return metadata;
  }, []);
  
  const parseIOSFilename = (filename) => {
    const metadata = {};
    
    // IMG_XXXX pattern (iPhone default)
    const imgMatch = filename.match(/IMG_(\d+)/i);
    if (imgMatch) {
      metadata.imageNumber = imgMatch[1];
      metadata.likelyDevice = 'iPhone';
    }
    
    // Date pattern in filename
    const dateMatch = filename.match(/(\d{4})[_-](\d{2})[_-](\d{2})/);
    if (dateMatch) {
      metadata.possibleDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
    }
    
    return metadata;
  };
  
  return { captureFromFileInput };
};