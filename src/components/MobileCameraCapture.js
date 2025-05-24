import React, { useCallback, useRef, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { useExifExtraction } from '../hooks/useExifExtraction';

const MobileCameraCapture = ({ onCapture, onError }) => {
  const inputRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const { extractExif } = useExifExtraction();

  const handleCapture = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsCapturing(true);
    try {
      // Try to extract EXIF data immediately after capture
      const { exifData } = await extractExif(file);
      
      // Create a new file with enhanced metadata
      const enhancedFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
      });
      
      if (exifData) {
        enhancedFile.enhancedMetadata = exifData;
      }

      // If the browser supports image capture API, try to get additional metadata
      if ('ImageCapture' in window && file instanceof Blob) {
        try {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          // Add resolution info if not in EXIF
          if (!exifData?.ImageWidth) {
            enhancedFile.enhancedMetadata = {
              ...enhancedFile.enhancedMetadata,
              ImageWidth: img.width,
              ImageHeight: img.height
            };
          }

          URL.revokeObjectURL(img.src);
        } catch (error) {
          console.warn('Failed to get additional image metadata:', error);
        }
      }

      onCapture(enhancedFile);
    } catch (error) {
      console.error('Error during capture:', error);
      onError?.(error);
    } finally {
      setIsCapturing(false);
      // Reset input to allow capturing the same image again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [extractExif, onCapture, onError]);

  const openCamera = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="mobile-camera-capture">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        style={{ display: 'none' }}
      />
      <button 
        onClick={openCamera}
        disabled={isCapturing}
        className="camera-capture-btn"
        aria-label="Take photo"
      >
        {isCapturing ? (
          <LucideIcons.Loader className="spin" />
        ) : (
          <LucideIcons.Camera />
        )}
        <span>Take Photo</span>
      </button>
    </div>
  );
};

export default MobileCameraCapture; 