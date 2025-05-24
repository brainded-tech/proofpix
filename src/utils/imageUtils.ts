import { OutputSize, ImageOutputOptions } from '../types';

export const overlayTimestamp = async (imageUrl: string, timestamp: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Configure text style - make it bigger
      const fontSize = Math.max(Math.min(img.width / 20, 72), 24); // Increased base font size
      ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
      
      // Calculate text width for background bar
      const textWidth = ctx.measureText(timestamp).width;
      const padding = fontSize;
      const barHeight = fontSize * 2; // Taller background bar
      
      // Position for bottom-right corner with more padding from edges
      const x = canvas.width - padding * 1.5;
      const y = canvas.height - padding * 1.5;
      
      // Draw semi-transparent black background bar with rounded corners
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'; // More opaque background
      const barX = x - textWidth - padding * 1.5;
      const barY = y - fontSize - padding;
      const barWidth = textWidth + padding * 3;
      const cornerRadius = fontSize / 4;

      // Draw rounded rectangle
      ctx.beginPath();
      ctx.moveTo(barX + cornerRadius, barY);
      ctx.lineTo(barX + barWidth - cornerRadius, barY);
      ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + cornerRadius);
      ctx.lineTo(barX + barWidth, barY + barHeight - cornerRadius);
      ctx.quadraticCurveTo(barX + barWidth, barY + barHeight, barX + barWidth - cornerRadius, barY + barHeight);
      ctx.lineTo(barX + cornerRadius, barY + barHeight);
      ctx.quadraticCurveTo(barX, barY + barHeight, barX, barY + barHeight - cornerRadius);
      ctx.lineTo(barX, barY + cornerRadius);
      ctx.quadraticCurveTo(barX, barY, barX + cornerRadius, barY);
      ctx.closePath();
      ctx.fill();

      // Draw text with white fill and thicker black stroke for better visibility
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.lineWidth = fontSize / 12; // Thicker stroke
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      
      // Draw text stroke and fill
      const textY = barY + barHeight/2;
      ctx.strokeText(timestamp, x, textY);
      ctx.fillText(timestamp, x, textY);

      // Convert to data URL and resolve
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve(dataUrl);
      } catch (err) {
        reject(new Error('Failed to generate image with timestamp'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
};

export interface ProcessedImageResult {
  url: string;
  width: number;
  height: number;
  size: number;
}

const getSizeConstraints = (size: OutputSize): { maxWidth: number; maxHeight: number } => {
  switch (size) {
    case 'small':
      return { maxWidth: 640, maxHeight: 640 };
    case 'medium':
      return { maxWidth: 1024, maxHeight: 1024 };
    case 'large':
      return { maxWidth: 2048, maxHeight: 2048 };
    case 'original':
    default:
      return { maxWidth: Infinity, maxHeight: Infinity };
  }
};

export const processImage = async (
  sourceUrl: string,
  options: ImageOutputOptions
): Promise<ProcessedImageResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Calculate new dimensions
        const { maxWidth, maxHeight } = getSizeConstraints(options.size);
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Get processed image URL
        const mimeType = `image/${options.format}`;
        const url = canvas.toDataURL(mimeType, options.quality);
        
        // Calculate approximate size (rough estimation)
        const base64Length = url.split(',')[1].length;
        const size = Math.round(base64Length * 0.75); // Base64 to binary conversion factor

        resolve({
          url,
          width,
          height,
          size
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = sourceUrl;
  });
};

export const downloadImage = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 