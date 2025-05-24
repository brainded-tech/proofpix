import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useExifExtraction } from '../hooks/useExifExtraction';
import { useErrorHandler } from '../hooks/useErrorHandler';

const ImageProcessor = ({
  image,
  overlayTimestamp,
  outputSize,
  onProcessingComplete,
  onError
}) => {
  const canvasRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const { processImage, applyTimestamp } = useImageProcessing();
  const { extractExif } = useExifExtraction();
  const { handleAsyncError } = useErrorHandler();

  const processAndUpdateImage = useCallback(async () => {
    if (!image) return;

    try {
      setProcessing(true);

      // Extract EXIF data first
      const exifData = await extractExif(image);

      // Create a new canvas context
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Load image
      const img = new Image();
      img.src = URL.createObjectURL(image);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Set canvas dimensions based on output size
      if (outputSize === 'original') {
        canvas.width = img.width;
        canvas.height = img.height;
      } else {
        const maxDimension = parseInt(outputSize);
        const ratio = Math.min(maxDimension / img.width, maxDimension / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
      }

      // Clear canvas and draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply timestamp if needed
      if (overlayTimestamp && exifData?.DateTimeOriginal) {
        await applyTimestamp(ctx, exifData.DateTimeOriginal, canvas.width, canvas.height);
      }

      // Convert canvas to blob
      const processedBlob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      });

      onProcessingComplete({
        processedImage: processedBlob,
        exifData,
        dimensions: {
          width: canvas.width,
          height: canvas.height
        }
      });

    } catch (error) {
      handleAsyncError(error);
      onError(error);
    } finally {
      setProcessing(false);
    }
  }, [image, overlayTimestamp, outputSize, processImage, applyTimestamp, extractExif, handleAsyncError, onProcessingComplete, onError]);

  useEffect(() => {
    processAndUpdateImage();
  }, [processAndUpdateImage]);

  return (
    <div className="image-processor">
      <canvas
        ref={canvasRef}
        className="hidden"
        aria-hidden="true"
      />
      {processing && (
        <div 
          className="processing-overlay"
          role="alert"
          aria-busy="true"
        >
          <div className="processing-spinner" />
          <p>Processing image...</p>
        </div>
      )}
    </div>
  );
};

export default ImageProcessor; 