import React from 'react';

interface OCRResult {
  text: string;
  confidence: number;
  language?: string;
  processingTime?: number;
}

interface OCROptions {
  language?: string;
  psm?: number; // Page segmentation mode
  oem?: number; // OCR Engine mode
  enhanceImage?: boolean;
  maxFileSize?: number;
}

export class OCRProcessor {
  private static workerInstance: any = null;
  private static isInitialized = false;
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff'];

  static async processImage(file: File, options: OCROptions = {}): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      // Validate file
      await this.validateFile(file);
      
      // Preprocess image if needed
      const processedFile = await this.preprocessImage(file, options);
      
      // Initialize worker if needed
      if (!this.workerInstance || !this.isInitialized) {
        await this.initializeWorker(options);
      }

      // Configure OCR parameters for better text extraction
      await this.configureOCR(options);

      // Perform OCR with retry logic
      const result = await this.performOCRWithRetry(processedFile, options);
      
      const processingTime = Date.now() - startTime;
      
      return {
        text: result.text.trim(),
        confidence: result.confidence / 100,
        language: options.language || 'eng',
        processingTime
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      
      // Provide more specific error messages
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage?.includes('network')) {
        throw new Error('Network error during OCR processing. Please check your connection and try again.');
      } else if (errorMessage?.includes('memory')) {
        throw new Error('File too large for processing. Please try a smaller image or reduce image quality.');
      } else if (errorMessage?.includes('format')) {
        throw new Error('Unsupported file format. Please use JPEG, PNG, WebP, or TIFF images.');
      } else {
        throw new Error(`OCR processing failed: ${errorMessage || 'Unknown error'}`);
      }
    }
  }

  private static async validateFile(file: File): Promise<void> {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds maximum allowed size (${this.MAX_FILE_SIZE / 1024 / 1024}MB)`);
    }

    if (!this.SUPPORTED_FORMATS.includes(file.type)) {
      throw new Error(`Unsupported file format: ${file.type}. Supported formats: ${this.SUPPORTED_FORMATS.join(', ')}`);
    }
  }

  private static async preprocessImage(file: File, options: OCROptions): Promise<File> {
    if (!options.enhanceImage) {
      return file;
    }

    try {
      // Create canvas for image enhancement
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            if (!ctx) {
              throw new Error('Failed to get canvas context for image preprocessing');
            }
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw original image
            ctx.drawImage(img, 0, 0);
            
            // Apply image enhancements for better OCR
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Increase contrast and brightness for better text recognition
            for (let i = 0; i < data.length; i += 4) {
              // Increase contrast
              data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));     // Red
              data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128)); // Green
              data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128)); // Blue
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            // Convert back to file
            canvas.toBlob((blob) => {
              if (blob) {
                const enhancedFile = new File([blob], file.name, { type: file.type });
                resolve(enhancedFile);
              } else {
                resolve(file); // Fallback to original
              }
            }, file.type, 0.95);
          } catch (error) {
            resolve(file); // Fallback to original on error
          }
        };
        
        img.onerror = () => resolve(file); // Fallback to original
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      return file; // Fallback to original file
    }
  }

  private static async initializeWorker(options: OCROptions): Promise<void> {
    try {
      // Lazy load Tesseract.js only when needed
      const { createWorker } = await import('tesseract.js');
      
      if (this.workerInstance) {
        await this.workerInstance.terminate();
      }
      
      this.workerInstance = await createWorker();
      
      const language = options.language || 'eng';
      await this.workerInstance.loadLanguage(language);
      await this.workerInstance.initialize(language);
      
      this.isInitialized = true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to initialize OCR worker: ${errorMessage}`);
    }
  }

  private static async configureOCR(options: OCROptions): Promise<void> {
    if (!this.workerInstance) return;

    try {
      // Configure OCR parameters for better text extraction
      await this.workerInstance.setParameters({
        tessedit_ocr_engine_mode: options.oem || 1, // LSTM OCR Engine Mode
        tessedit_pageseg_mode: options.psm || 3,    // Fully automatic page segmentation
        preserve_interword_spaces: 1,               // Preserve spaces between words
        tessedit_char_whitelist: '', // Allow all characters
        tessedit_char_blacklist: '', // No character blacklist
      });
    } catch (error) {
      console.warn('Failed to configure OCR parameters:', error);
      // Continue with default settings
    }
  }

  private static async performOCRWithRetry(file: File, options: OCROptions, maxRetries: number = 3): Promise<any> {
    let lastError: Error = new Error('OCR processing failed');
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data } = await this.workerInstance.recognize(file);
        
        // Validate result
        if (data && typeof data.text === 'string') {
          return data;
        } else {
          throw new Error('Invalid OCR result format');
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`OCR attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          
          // Reinitialize worker on retry
          if (attempt > 1) {
            await this.initializeWorker(options);
          }
        }
      }
    }
    
    throw lastError;
  }

  static async cleanup(): Promise<void> {
    try {
      if (this.workerInstance) {
        await this.workerInstance.terminate();
        this.workerInstance = null;
        this.isInitialized = false;
      }
    } catch (error) {
      console.warn('Error during OCR cleanup:', error);
    }
  }

  // Utility method to check if OCR is supported
  static isSupported(): boolean {
    return typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined';
  }

  // Method to get optimal OCR settings for different document types
  static getOptimalSettings(documentType: 'document' | 'handwritten' | 'mixed' = 'document'): OCROptions {
    const settings: Record<string, OCROptions> = {
      document: {
        psm: 3, // Fully automatic page segmentation
        oem: 1, // LSTM OCR Engine Mode
        enhanceImage: true
      },
      handwritten: {
        psm: 8, // Single word
        oem: 1, // LSTM OCR Engine Mode
        enhanceImage: true
      },
      mixed: {
        psm: 6, // Uniform block of text
        oem: 1, // LSTM OCR Engine Mode
        enhanceImage: true
      }
    };
    
    return settings[documentType] || settings.document;
  }
}

export default OCRProcessor; 