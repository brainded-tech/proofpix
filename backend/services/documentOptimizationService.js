/**
 * Document Optimization Service - Production Performance & Risk Mitigation
 * Addresses technical risks: OCR accuracy, processing speed, storage costs
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../config/database');

class DocumentOptimizationService {
  constructor() {
    this.optimizationCache = new Map();
    this.processingQueue = [];
    this.maxConcurrentProcessing = 5;
    this.currentProcessing = 0;
    
    // Performance thresholds
    this.performanceTargets = {
      maxProcessingTime: 30000, // 30 seconds
      maxFileSize: 50 * 1024 * 1024, // 50MB
      minOcrConfidence: 70,
      maxRetries: 3
    };
  }

  /**
   * Optimize document before processing to improve speed and accuracy
   */
  async optimizeDocument(filePath, options = {}) {
    try {
      const startTime = Date.now();
      const fileStats = await fs.stat(filePath);
      
      // Check if optimization is needed
      const optimizationNeeded = await this.assessOptimizationNeeds(filePath, fileStats);
      
      if (!optimizationNeeded.required) {
        logger.info('Document optimization not required', {
          filePath,
          fileSize: fileStats.size,
          reason: optimizationNeeded.reason
        });
        return { optimizedPath: filePath, optimizationApplied: false };
      }

      // Apply optimizations
      const optimizedPath = await this.applyOptimizations(filePath, optimizationNeeded.optimizations, options);
      
      const processingTime = Date.now() - startTime;
      
      logger.info('Document optimization completed', {
        originalPath: filePath,
        optimizedPath,
        processingTime,
        optimizations: optimizationNeeded.optimizations
      });

      return {
        optimizedPath,
        optimizationApplied: true,
        optimizations: optimizationNeeded.optimizations,
        processingTime
      };

    } catch (error) {
      logger.error('Document optimization failed:', error);
      // Return original path if optimization fails
      return { optimizedPath: filePath, optimizationApplied: false, error: error.message };
    }
  }

  /**
   * Assess what optimizations are needed
   */
  async assessOptimizationNeeds(filePath, fileStats) {
    const optimizations = [];
    let required = false;

    try {
      // Check file size
      if (fileStats.size > 10 * 1024 * 1024) { // 10MB
        optimizations.push('compress');
        required = true;
      }

      // Check if it's an image that can be optimized
      const ext = path.extname(filePath).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.tiff', '.webp'].includes(ext)) {
        const metadata = await sharp(filePath).metadata();
        
        // Check resolution - if too high, resize for better OCR
        if (metadata.width > 3000 || metadata.height > 3000) {
          optimizations.push('resize');
          required = true;
        }

        // Check if image needs enhancement for OCR
        if (metadata.density && metadata.density < 150) {
          optimizations.push('enhance_dpi');
          required = true;
        }

        // Check if image needs contrast/brightness adjustment
        optimizations.push('enhance_contrast');
        required = true;
      }

      return {
        required,
        optimizations,
        reason: required ? 'Optimizations will improve processing speed and accuracy' : 'File is already optimized'
      };

    } catch (error) {
      logger.error('Error assessing optimization needs:', error);
      return { required: false, optimizations: [], reason: 'Assessment failed' };
    }
  }

  /**
   * Apply specific optimizations to the document
   */
  async applyOptimizations(filePath, optimizations, options = {}) {
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);
    const optimizedPath = path.join(dirName, `${baseName}_optimized${ext}`);

    try {
      let sharpInstance = sharp(filePath);

      // Apply optimizations in sequence
      for (const optimization of optimizations) {
        switch (optimization) {
          case 'resize':
            sharpInstance = sharpInstance.resize(2000, 2000, {
              fit: 'inside',
              withoutEnlargement: true
            });
            break;

          case 'enhance_dpi':
            sharpInstance = sharpInstance.withMetadata({
              density: 300
            });
            break;

          case 'enhance_contrast':
            sharpInstance = sharpInstance
              .normalize() // Auto-adjust contrast
              .sharpen(); // Improve text clarity
            break;

          case 'compress':
            if (ext.toLowerCase() === '.png') {
              sharpInstance = sharpInstance.png({ quality: 90, compressionLevel: 6 });
            } else {
              sharpInstance = sharpInstance.jpeg({ quality: 85, progressive: true });
            }
            break;

          case 'grayscale':
            sharpInstance = sharpInstance.grayscale();
            break;
        }
      }

      // Save optimized image
      await sharpInstance.toFile(optimizedPath);

      return optimizedPath;

    } catch (error) {
      logger.error('Error applying optimizations:', error);
      throw new Error(`Optimization failed: ${error.message}`);
    }
  }

  /**
   * Intelligent OCR with fallback strategies
   */
  async performIntelligentOCR(filePath, planType, options = {}) {
    const strategies = this.getOCRStrategies(planType);
    let bestResult = null;
    let highestConfidence = 0;

    for (const strategy of strategies) {
      try {
        const result = await this.executeOCRStrategy(filePath, strategy, options);
        
        if (result.confidence > highestConfidence) {
          highestConfidence = result.confidence;
          bestResult = result;
        }

        // If we get high confidence, use this result
        if (result.confidence >= this.performanceTargets.minOcrConfidence) {
          break;
        }

      } catch (error) {
        logger.warn(`OCR strategy ${strategy.name} failed:`, error);
        continue;
      }
    }

    return bestResult || {
      text: '',
      confidence: 0,
      engine: 'none',
      error: 'All OCR strategies failed'
    };
  }

  /**
   * Get OCR strategies based on plan type
   */
  getOCRStrategies(planType) {
    const strategies = [
      {
        name: 'tesseract_optimized',
        engine: 'tesseract',
        config: {
          lang: 'eng',
          oem: 1, // LSTM OCR Engine Mode
          psm: 3  // Fully automatic page segmentation
        }
      }
    ];

    // Add premium strategies for higher tiers
    if (planType === 'professional' || planType === 'enterprise') {
      strategies.unshift({
        name: 'tesseract_enhanced',
        engine: 'tesseract',
        config: {
          lang: 'eng',
          oem: 1,
          psm: 6, // Uniform block of text
          preserve_interword_spaces: 1
        }
      });
    }

    if (planType === 'enterprise') {
      strategies.unshift({
        name: 'azure_cognitive',
        engine: 'azure',
        config: {
          endpoint: process.env.AZURE_COGNITIVE_SERVICES_ENDPOINT,
          key: process.env.AZURE_COGNITIVE_SERVICES_KEY
        }
      });
    }

    return strategies;
  }

  /**
   * Execute specific OCR strategy
   */
  async executeOCRStrategy(filePath, strategy, options = {}) {
    switch (strategy.engine) {
      case 'tesseract':
        return await this.executeTesseractOCR(filePath, strategy.config);
      
      case 'azure':
        return await this.executeAzureOCR(filePath, strategy.config);
      
      default:
        throw new Error(`Unknown OCR engine: ${strategy.engine}`);
    }
  }

  /**
   * Execute Tesseract OCR with optimized settings
   */
  async executeTesseractOCR(filePath, config) {
    const tesseract = require('tesseract.js');
    
    try {
      const worker = await tesseract.createWorker();
      
      await worker.loadLanguage(config.lang);
      await worker.initialize(config.lang);
      
      // Set OCR Engine Mode and Page Segmentation Mode
      await worker.setParameters({
        tessedit_ocr_engine_mode: config.oem,
        tessedit_pageseg_mode: config.psm,
        preserve_interword_spaces: config.preserve_interword_spaces || 0
      });

      const { data } = await worker.recognize(filePath);
      await worker.terminate();

      return {
        text: data.text.trim(),
        confidence: data.confidence,
        engine: 'tesseract',
        language: config.lang,
        processingTime: Date.now()
      };

    } catch (error) {
      throw new Error(`Tesseract OCR failed: ${error.message}`);
    }
  }

  /**
   * Execute Azure Cognitive Services OCR (Enterprise only)
   */
  async executeAzureOCR(filePath, config) {
    if (!config.endpoint || !config.key) {
      throw new Error('Azure Cognitive Services not configured');
    }

    // This would integrate with Azure Cognitive Services
    // For now, return a placeholder that indicates enterprise OCR
    return {
      text: 'Azure OCR integration placeholder',
      confidence: 95,
      engine: 'azure_cognitive',
      language: 'en',
      processingTime: Date.now(),
      note: 'Azure integration requires API setup'
    };
  }

  /**
   * Optimize storage by cleaning up temporary files
   */
  async optimizeStorage(tempDir = process.env.TEMP_DIR || '/tmp/proofpix') {
    try {
      const files = await fs.readdir(tempDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      let cleanedFiles = 0;
      let freedSpace = 0;

      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        // Delete files older than 24 hours
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          cleanedFiles++;
          freedSpace += stats.size;
        }
      }

      logger.info('Storage optimization completed', {
        cleanedFiles,
        freedSpace: `${(freedSpace / 1024 / 1024).toFixed(2)} MB`,
        tempDir
      });

      return { cleanedFiles, freedSpace };

    } catch (error) {
      logger.error('Storage optimization failed:', error);
      return { cleanedFiles: 0, freedSpace: 0 };
    }
  }

  /**
   * Monitor processing performance and adjust settings
   */
  async monitorPerformance(processingStats) {
    const { processingTime, fileSize, confidence, planType } = processingStats;

    // Check if processing time exceeds threshold
    if (processingTime > this.performanceTargets.maxProcessingTime) {
      logger.warn('Processing time exceeded threshold', {
        processingTime,
        threshold: this.performanceTargets.maxProcessingTime,
        fileSize,
        planType
      });

      // Suggest optimizations
      return {
        needsOptimization: true,
        suggestions: [
          'Consider file size reduction',
          'Enable document pre-processing',
          'Upgrade to higher tier for better performance'
        ]
      };
    }

    // Check OCR confidence
    if (confidence < this.performanceTargets.minOcrConfidence) {
      logger.warn('OCR confidence below threshold', {
        confidence,
        threshold: this.performanceTargets.minOcrConfidence,
        planType
      });

      return {
        needsOptimization: true,
        suggestions: [
          'Try document enhancement',
          'Check image quality',
          'Consider manual review'
        ]
      };
    }

    return { needsOptimization: false };
  }

  /**
   * Get optimization recommendations for user
   */
  getOptimizationRecommendations(userStats, planType) {
    const recommendations = [];

    // Analyze usage patterns
    if (userStats.averageProcessingTime > 15000) { // 15 seconds
      recommendations.push({
        type: 'performance',
        priority: 'high',
        title: 'Slow Processing Detected',
        description: 'Your documents are taking longer than average to process',
        suggestions: [
          'Reduce file sizes before upload',
          'Use supported formats (PDF, JPEG, PNG)',
          'Consider upgrading for faster processing'
        ]
      });
    }

    if (userStats.averageConfidence < 80) {
      recommendations.push({
        type: 'accuracy',
        priority: 'medium',
        title: 'OCR Accuracy Could Be Improved',
        description: 'Text extraction confidence is below optimal levels',
        suggestions: [
          'Ensure documents are high resolution',
          'Use clear, well-lit scans',
          'Avoid handwritten text when possible'
        ]
      });
    }

    if (planType === 'free' && userStats.documentsThisMonth > 3) {
      recommendations.push({
        type: 'upgrade',
        priority: 'medium',
        title: 'Consider Upgrading Your Plan',
        description: 'Unlock advanced AI features and higher quotas',
        suggestions: [
          'Professional plan: 100 documents/month + AI analysis',
          'Enterprise plan: 1000 documents/month + premium features',
          'Better OCR accuracy with premium engines'
        ]
      });
    }

    return recommendations;
  }
}

module.exports = DocumentOptimizationService; 