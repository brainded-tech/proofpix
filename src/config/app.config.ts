// config/app.config.ts - Main application configuration with TypeScript interfaces

export interface FeatureFlags {
  bulkProcessing: boolean;
  advancedExif: boolean;
  pdfReports: boolean;
  gpsMapping: boolean;
  socialSharing: boolean;
  premiumFeatures: boolean;
  documentAI: boolean;
  enterpriseMode: boolean;
  whiteLabel: boolean;
}

export interface AppConfig {
  name: string;
  version: string;
  description: string;
  
  analytics: {
    googleAnalyticsId: string;
    enabled: boolean;
  };
  
  features: FeatureFlags;
  
  isDevelopment: boolean;
  isProduction: boolean;
  
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
    version: string;
  };

  limits: {
    supportedFormats: string[];
  };
}

export const APP_CONFIG: AppConfig = {
  // Application Info
  name: 'ProofPix',
  version: '1.0.0',
  description: 'Extract EXIF metadata from your images with complete privacy',
  
  // Analytics
  analytics: {
    googleAnalyticsId: process.env.REACT_APP_GA_ID || 'G-W1NLKX5B5S',
    enabled: process.env.NODE_ENV === 'production'
  },
  
  // Feature Flags
  features: {
    bulkProcessing: process.env.REACT_APP_BULK_PROCESSING === 'true' || false,
    advancedExif: process.env.REACT_APP_ADVANCED_EXIF === 'true' || true,
    pdfReports: process.env.REACT_APP_PDF_REPORTS === 'true' || true,
    gpsMapping: process.env.REACT_APP_GPS_MAPPING === 'true' || true,
    socialSharing: process.env.REACT_APP_SOCIAL_SHARING === 'true' || false,
    premiumFeatures: process.env.REACT_APP_PREMIUM === 'true' || false,
    documentAI: process.env.REACT_APP_DOCUMENT_AI === 'true' || false,
    enterpriseMode: process.env.REACT_APP_ENTERPRISE_MODE === 'true' || false,
    whiteLabel: process.env.REACT_APP_WHITE_LABEL === 'true' || false
  },
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API Endpoints (for future use)
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://app.proofpixapp.com',
    timeout: 30000,
    retries: 3,
    version: 'v1'
  },

  limits: {
    supportedFormats: ['.jpg', '.jpeg', '.png', '.heic', '.tiff', '.webp']
  }
};

// Utility functions for configuration
export const getConfigValue = <T>(path: string, defaultValue: T | null = null): T | null => {
  const keys = path.split('.');
  let current: any = APP_CONFIG;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current as T;
};

export default APP_CONFIG; 