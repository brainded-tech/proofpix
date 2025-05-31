/**
 * ProofPix Public AI Service Interface
 * 
 * This is the open source interface to ProofPix's AI capabilities.
 * It provides basic AI functionality while advanced features require
 * proprietary components and valid subscriptions.
 * 
 * Open Source Components:
 * - Basic OCR
 * - Simple document classification
 * - Basic quality assessment
 * 
 * Proprietary Components (require subscription):
 * - Advanced AI models
 * - Industry-specific processing
 * - Custom model training
 * - Fraud detection
 * - Predictive analytics
 */

import axios, { AxiosInstance } from 'axios';

// Public AI Types (Open Source)
export interface BasicOCRResult {
  text: string;
  confidence: number;
  language: string;
  processingTime: number;
}

export interface BasicDocumentClassification {
  type: 'document' | 'image' | 'pdf' | 'unknown';
  confidence: number;
  features: string[];
}

export interface BasicQualityAssessment {
  overallScore: number;
  clarity: number;
  resolution: number;
  recommendations: string[];
}

export interface AIServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  requiresUpgrade?: boolean;
  upgradeMessage?: string;
}

class PublicAIService {
  private apiClient: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.apiClient = axios.create({
      baseURL: `${this.baseURL}/api/ai/public`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth interceptor
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Basic OCR - Open Source Implementation
   * Provides simple text extraction without advanced features
   */
  async performBasicOCR(fileId: string): Promise<AIServiceResponse<BasicOCRResult>> {
    try {
      const response = await this.apiClient.post('/ocr/basic', {
        fileId,
        options: {
          language: 'auto',
          enhanceImage: false, // Advanced enhancement requires subscription
          extractTables: false, // Table extraction requires subscription
          detectHandwriting: false // Handwriting detection requires subscription
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      if (error.response?.status === 403) {
        return {
          success: false,
          requiresUpgrade: true,
          upgradeMessage: 'Advanced OCR features require a Professional or Enterprise subscription'
        };
      }
      
      return {
        success: false,
        error: `Basic OCR failed: ${error.message}`
      };
    }
  }

  /**
   * Basic Document Classification - Open Source Implementation
   * Provides simple document type detection
   */
  async classifyDocumentBasic(fileId: string): Promise<AIServiceResponse<BasicDocumentClassification>> {
    try {
      const response = await this.apiClient.post('/classify/basic', {
        fileId,
        options: {
          useAdvancedModels: false, // Advanced models require subscription
          includeSubtypes: false, // Detailed classification requires subscription
          confidenceThreshold: 0.5
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      if (error.response?.status === 403) {
        return {
          success: false,
          requiresUpgrade: true,
          upgradeMessage: 'Advanced document classification requires a Professional or Enterprise subscription'
        };
      }

      return {
        success: false,
        error: `Basic classification failed: ${error.message}`
      };
    }
  }

  /**
   * Basic Quality Assessment - Open Source Implementation
   * Provides simple quality scoring without enhancement suggestions
   */
  async assessQualityBasic(fileId: string): Promise<AIServiceResponse<BasicQualityAssessment>> {
    try {
      const response = await this.apiClient.post('/quality/basic', {
        fileId,
        options: {
          includeEnhancementSuggestions: false, // Enhancement requires subscription
          detailedAnalysis: false // Detailed analysis requires subscription
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      if (error.response?.status === 403) {
        return {
          success: false,
          requiresUpgrade: true,
          upgradeMessage: 'Advanced quality assessment requires a Professional or Enterprise subscription'
        };
      }

      return {
        success: false,
        error: `Basic quality assessment failed: ${error.message}`
      };
    }
  }

  /**
   * Check AI Feature Availability
   * Returns what AI features are available for the current user's subscription
   */
  async getAvailableFeatures(): Promise<AIServiceResponse<{
    basicOCR: boolean;
    advancedOCR: boolean;
    basicClassification: boolean;
    advancedClassification: boolean;
    fraudDetection: boolean;
    customModels: boolean;
    industryModels: boolean;
    predictiveAnalytics: boolean;
  }>> {
    try {
      const response = await this.apiClient.get('/features');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to fetch available features: ${error.message}`
      };
    }
  }

  /**
   * Get Subscription Upgrade Information
   * Returns information about upgrading to access advanced AI features
   */
  async getUpgradeInfo(): Promise<AIServiceResponse<{
    currentPlan: string;
    availableUpgrades: Array<{
      planName: string;
      price: number;
      features: string[];
      aiCredits: number;
    }>;
    upgradeUrl: string;
  }>> {
    try {
      const response = await this.apiClient.get('/upgrade-info');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to fetch upgrade information: ${error.message}`
      };
    }
  }

  /**
   * Advanced AI Features Gateway
   * This method checks if the user has access to proprietary AI features
   * and routes to the appropriate service
   */
  async accessAdvancedAI(): Promise<{
    hasAccess: boolean;
    message: string;
    upgradeRequired?: boolean;
  }> {
    try {
      // Check if proprietary AI service is available
      const proprietaryService = await import('./proprietary/aiService');
      
      // Verify subscription level
      const features = await this.getAvailableFeatures();
      
      if (features.success && features.data) {
        const hasAdvancedFeatures = features.data.advancedOCR || 
                                   features.data.fraudDetection || 
                                   features.data.customModels;
        
        if (hasAdvancedFeatures) {
          return {
            hasAccess: true,
            message: 'Advanced AI features are available'
          };
        }
      }

      return {
        hasAccess: false,
        message: 'Advanced AI features require a Professional or Enterprise subscription',
        upgradeRequired: true
      };
    } catch (error) {
      // Proprietary service not available (open source deployment)
      return {
        hasAccess: false,
        message: 'This is an open source deployment. Advanced AI features are available with ProofPix subscriptions.',
        upgradeRequired: true
      };
    }
  }
}

// Export singleton instance
export const publicAIService = new PublicAIService();
export default publicAIService;

/**
 * Open Source AI Utilities
 * These functions provide basic AI functionality that doesn't require subscriptions
 */

export const openSourceAIUtils = {
  /**
   * Calculate basic confidence score for text extraction
   */
  calculateTextConfidence(text: string): number {
    if (!text || text.length === 0) return 0;
    
    // Simple heuristics for confidence scoring
    const hasAlphanumeric = /[a-zA-Z0-9]/.test(text);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(text);
    const wordCount = text.split(/\s+/).length;
    
    let confidence = 0.5; // Base confidence
    
    if (hasAlphanumeric) confidence += 0.2;
    if (wordCount > 5) confidence += 0.2;
    if (!hasSpecialChars || hasSpecialChars && hasAlphanumeric) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  },

  /**
   * Basic document type detection based on file properties
   */
  detectBasicDocumentType(fileName: string, mimeType: string): BasicDocumentClassification {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    let type: 'document' | 'image' | 'pdf' | 'unknown' = 'unknown';
    let confidence = 0.5;
    const features: string[] = [];

    if (mimeType.startsWith('image/')) {
      type = 'image';
      confidence = 0.9;
      features.push('visual_content');
    } else if (mimeType === 'application/pdf' || extension === 'pdf') {
      type = 'pdf';
      confidence = 0.9;
      features.push('structured_document');
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
      type = 'document';
      confidence = 0.8;
      features.push('text_document');
    }

    return { type, confidence, features };
  },

  /**
   * Basic quality assessment based on file properties
   */
  assessBasicQuality(fileSize: number, dimensions?: { width: number; height: number }): BasicQualityAssessment {
    let overallScore = 0.5;
    let clarity = 0.5;
    let resolution = 0.5;
    const recommendations: string[] = [];

    // File size assessment
    if (fileSize < 100000) { // Less than 100KB
      overallScore -= 0.2;
      recommendations.push('File size is quite small, consider using higher quality source');
    } else if (fileSize > 10000000) { // More than 10MB
      overallScore += 0.1;
    }

    // Dimensions assessment (if available)
    if (dimensions) {
      const totalPixels = dimensions.width * dimensions.height;
      
      if (totalPixels < 500000) { // Less than 0.5MP
        resolution = 0.3;
        recommendations.push('Low resolution detected, consider using higher resolution images');
      } else if (totalPixels > 2000000) { // More than 2MP
        resolution = 0.8;
      }

      clarity = resolution; // Simple correlation for basic assessment
    }

    overallScore = Math.max(0, Math.min(1, overallScore + (resolution - 0.5) * 0.3));

    return {
      overallScore,
      clarity,
      resolution,
      recommendations
    };
  }
};

/**
 * Community Contribution Guidelines
 * 
 * This open source AI service welcomes community contributions!
 * 
 * How to contribute:
 * 1. Fork the repository
 * 2. Create a feature branch
 * 3. Add your improvements to the open source AI utilities
 * 4. Submit a pull request
 * 
 * Areas for contribution:
 * - Improved basic OCR algorithms
 * - Better document type detection
 * - Enhanced quality assessment heuristics
 * - Additional file format support
 * - Performance optimizations
 * 
 * Note: Contributions should focus on basic AI functionality.
 * Advanced AI features are part of the proprietary layer.
 */ 