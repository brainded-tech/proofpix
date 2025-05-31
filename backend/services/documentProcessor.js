/**
 * Document Processor Service - AI-Powered Document Processing
 * Handles document processing, metadata extraction, and AI analysis
 */

const sharp = require('sharp');
const pdf = require('pdf-parse');
const tesseract = require('tesseract.js');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

class DocumentProcessor {
  constructor() {
    this.supportedFormats = ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'webp'];
    this.tempDir = process.env.TEMP_DIR || '/tmp/proofpix';
    this.aiModels = {
      basic: 'tesseract',
      advanced: 'azure-cognitive',
      enterprise: 'custom-ml'
    };
  }

  /**
   * Process document with metadata extraction and optional AI analysis
   */
  async processDocument({ file, documentType, options, planType, processId }) {
    try {
      // Ensure temp directory exists
      await this.ensureTempDir();

      // Save uploaded file temporarily
      const tempFilePath = path.join(this.tempDir, `${processId}_${file.originalname}`);
      await fs.writeFile(tempFilePath, file.buffer);

      // Extract basic metadata
      const metadata = await this.extractMetadata(tempFilePath, file);

      // Perform OCR if requested
      let ocrResults = null;
      if (options?.extractText || options?.aiAnalysis) {
        ocrResults = await this.performOCR(tempFilePath, planType);
      }

      // AI analysis if requested and available in plan
      let aiInsights = null;
      if (options?.aiAnalysis && this.planSupportsAI(planType)) {
        aiInsights = await this.performAIAnalysis(tempFilePath, ocrResults, documentType, planType);
      }

      // Industry template processing
      let templateResults = null;
      if (options?.industryTemplate && this.planSupportsTemplates(planType)) {
        templateResults = await this.applyIndustryTemplate(metadata, ocrResults, options.industryTemplate);
      }

      // Calculate confidence score
      const confidence = this.calculateConfidenceScore(metadata, ocrResults, aiInsights);

      // Clean up temp file
      await fs.unlink(tempFilePath).catch(() => {}); // Ignore errors

      return {
        processId,
        metadata: {
          ...metadata,
          documentType,
          processingTimestamp: new Date().toISOString()
        },
        ocrResults,
        aiInsights,
        templateResults,
        confidence,
        planType
      };

    } catch (error) {
      console.error('Document processing error:', error);
      throw new Error(`Document processing failed: ${error.message}`);
    }
  }

  /**
   * Perform AI analysis on processed document
   */
  async analyzeDocument({ processId, analysisType, planType }) {
    try {
      // Get document data from previous processing
      const documentData = await this.getProcessedDocument(processId);
      if (!documentData) {
        throw new Error('Document not found or not processed');
      }

      const analysis = {};

      switch (analysisType) {
        case 'sentiment':
          analysis.sentiment = await this.analyzeSentiment(documentData.ocrResults?.text);
          break;
        
        case 'classification':
          analysis.classification = await this.classifyDocument(documentData);
          break;
        
        case 'entities':
          analysis.entities = await this.extractEntities(documentData.ocrResults?.text);
          break;
        
        case 'summary':
          analysis.summary = await this.generateSummary(documentData.ocrResults?.text);
          break;
        
        case 'compliance':
          analysis.compliance = await this.checkCompliance(documentData, planType);
          break;
        
        default:
          analysis.comprehensive = await this.performComprehensiveAnalysis(documentData, planType);
      }

      // Store analysis results
      await this.storeAnalysisResults(processId, analysisType, analysis);

      return {
        processId,
        analysisType,
        results: analysis,
        timestamp: new Date().toISOString(),
        planType
      };

    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Extract metadata from document
   */
  async extractMetadata(filePath, fileInfo) {
    const stats = await fs.stat(filePath);
    const metadata = {
      filename: fileInfo.originalname,
      fileSize: stats.size,
      mimeType: fileInfo.mimetype,
      uploadTimestamp: new Date().toISOString(),
      dimensions: null,
      pageCount: null,
      colorSpace: null,
      resolution: null
    };

    try {
      if (fileInfo.mimetype.startsWith('image/')) {
        const imageInfo = await sharp(filePath).metadata();
        metadata.dimensions = { width: imageInfo.width, height: imageInfo.height };
        metadata.colorSpace = imageInfo.space;
        metadata.resolution = { x: imageInfo.density, y: imageInfo.density };
      } else if (fileInfo.mimetype === 'application/pdf') {
        const pdfBuffer = await fs.readFile(filePath);
        const pdfData = await pdf(pdfBuffer);
        metadata.pageCount = pdfData.numpages;
        metadata.textLength = pdfData.text?.length || 0;
      }
    } catch (error) {
      console.error('Metadata extraction error:', error);
    }

    return metadata;
  }

  /**
   * Perform OCR on document
   */
  async performOCR(filePath, planType) {
    try {
      const ocrEngine = this.getOCREngine(planType);
      
      if (ocrEngine === 'tesseract') {
        const { data: { text, confidence } } = await tesseract.recognize(filePath, 'eng');
        return {
          text: text.trim(),
          confidence: confidence,
          engine: 'tesseract',
          language: 'eng'
        };
      }
      
      // For enterprise plans, use more advanced OCR
      if (ocrEngine === 'azure-cognitive' && planType === 'enterprise') {
        return await this.performAzureOCR(filePath);
      }

      return null;
    } catch (error) {
      console.error('OCR error:', error);
      return { text: '', confidence: 0, error: error.message };
    }
  }

  /**
   * Perform AI analysis based on plan type
   */
  async performAIAnalysis(filePath, ocrResults, documentType, planType) {
    const insights = {
      documentType: await this.classifyDocumentType(ocrResults?.text, documentType),
      keyPhrases: await this.extractKeyPhrases(ocrResults?.text),
      language: await this.detectLanguage(ocrResults?.text),
      readabilityScore: this.calculateReadability(ocrResults?.text)
    };

    if (planType === 'enterprise') {
      insights.advancedAnalysis = {
        entities: await this.extractEntities(ocrResults?.text),
        sentiment: await this.analyzeSentiment(ocrResults?.text),
        topics: await this.extractTopics(ocrResults?.text),
        compliance: await this.checkBasicCompliance(ocrResults?.text)
      };
    }

    return insights;
  }

  /**
   * Apply industry-specific template processing
   */
  async applyIndustryTemplate(metadata, ocrResults, templateName) {
    const templates = {
      invoice: {
        fields: ['invoice_number', 'date', 'total_amount', 'vendor'],
        patterns: {
          invoice_number: /(?:invoice|inv)[\s#:]*([a-z0-9-]+)/i,
          date: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
          total_amount: /(?:total|amount)[\s:]*\$?([0-9,]+\.?\d*)/i,
          vendor: /(?:from|vendor)[\s:]*([a-z\s]+)/i
        }
      },
      contract: {
        fields: ['parties', 'effective_date', 'termination_date', 'value'],
        patterns: {
          parties: /(?:between|party)[\s:]*([a-z\s,]+)(?:and|&)/i,
          effective_date: /(?:effective|start)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
          termination_date: /(?:expires?|ends?)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
          value: /(?:value|amount|worth)[\s:]*\$?([0-9,]+\.?\d*)/i
        }
      },
      receipt: {
        fields: ['merchant', 'date', 'total', 'items'],
        patterns: {
          merchant: /^([a-z\s]+)$/im,
          date: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
          total: /(?:total|amount)[\s:]*\$?([0-9,]+\.?\d*)/i,
          items: /(\d+\.?\d*\s+[a-z\s]+\s+\$?\d+\.?\d*)/gim
        }
      }
    };

    const template = templates[templateName];
    if (!template || !ocrResults?.text) {
      return null;
    }

    const extractedData = {};
    for (const [field, pattern] of Object.entries(template.patterns)) {
      const match = ocrResults.text.match(pattern);
      extractedData[field] = match ? match[1]?.trim() : null;
    }

    return {
      template: templateName,
      extractedFields: extractedData,
      confidence: this.calculateTemplateConfidence(extractedData, template.fields)
    };
  }

  // Helper methods
  planSupportsAI(planType) {
    return ['professional', 'enterprise'].includes(planType);
  }

  planSupportsTemplates(planType) {
    return ['professional', 'enterprise'].includes(planType);
  }

  getOCREngine(planType) {
    const engines = {
      starter: 'tesseract',
      professional: 'tesseract',
      enterprise: 'azure-cognitive'
    };
    return engines[planType] || 'tesseract';
  }

  calculateConfidenceScore(metadata, ocrResults, aiInsights) {
    let score = 0.5; // Base score

    if (metadata?.fileSize > 0) score += 0.1;
    if (ocrResults?.confidence > 80) score += 0.2;
    if (ocrResults?.text?.length > 100) score += 0.1;
    if (aiInsights?.keyPhrases?.length > 0) score += 0.1;

    return Math.min(score, 1.0);
  }

  calculateTemplateConfidence(extractedData, requiredFields) {
    const extractedCount = Object.values(extractedData).filter(v => v !== null).length;
    return extractedCount / requiredFields.length;
  }

  calculateReadability(text) {
    if (!text) return 0;
    
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Simple readability score (0-100)
    return Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 2)));
  }

  async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
  }

  // Placeholder methods for advanced AI features
  async classifyDocumentType(text, hint) {
    // Simple classification based on keywords
    const types = {
      invoice: ['invoice', 'bill', 'payment', 'due'],
      contract: ['agreement', 'contract', 'terms', 'conditions'],
      receipt: ['receipt', 'purchase', 'transaction', 'paid'],
      report: ['report', 'analysis', 'summary', 'findings']
    };

    if (!text) return hint || 'unknown';

    const textLower = text.toLowerCase();
    for (const [type, keywords] of Object.entries(types)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        return type;
      }
    }

    return hint || 'document';
  }

  async extractKeyPhrases(text) {
    if (!text) return [];
    
    // Simple keyword extraction
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const frequency = {};
    
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  async detectLanguage(text) {
    // Simple language detection
    if (!text) return 'unknown';
    
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of'];
    const textLower = text.toLowerCase();
    const englishCount = englishWords.filter(word => textLower.includes(word)).length;
    
    return englishCount > 3 ? 'en' : 'unknown';
  }

  async extractEntities(text) {
    // Simple entity extraction
    if (!text) return [];
    
    const entities = [];
    
    // Email addresses
    const emails = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
    if (emails) entities.push(...emails.map(email => ({ type: 'email', value: email })));
    
    // Phone numbers
    const phones = text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g);
    if (phones) entities.push(...phones.map(phone => ({ type: 'phone', value: phone })));
    
    // Dates
    const dates = text.match(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g);
    if (dates) entities.push(...dates.map(date => ({ type: 'date', value: date })));
    
    return entities;
  }

  async analyzeSentiment(text) {
    // Simple sentiment analysis
    if (!text) return { score: 0, label: 'neutral' };
    
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'approve'];
    const negativeWords = ['bad', 'terrible', 'negative', 'fail', 'reject', 'problem'];
    
    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
    
    const score = (positiveCount - negativeCount) / (positiveCount + negativeCount + 1);
    
    let label = 'neutral';
    if (score > 0.2) label = 'positive';
    else if (score < -0.2) label = 'negative';
    
    return { score, label };
  }

  // Placeholder storage methods
  async getProcessedDocument(processId) {
    // In production, this would query the database
    return null;
  }

  async storeAnalysisResults(processId, analysisType, results) {
    // In production, this would store in database
    return true;
  }
}

module.exports = {
  processDocument: async (params) => {
    const processor = new DocumentProcessor();
    return processor.processDocument(params);
  },
  analyzeDocument: async (params) => {
    const processor = new DocumentProcessor();
    return processor.analyzeDocument(params);
  }
}; 