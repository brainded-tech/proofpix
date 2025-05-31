/**
 * Enterprise Branding Service
 * Client-side service for managing enterprise branding assets and configuration
 */

import { API_CONFIG } from '../config/api.config';

export interface BrandingAssets {
  logoLight?: File;
  logoDark?: File;
  favicon?: File;
}

export interface BrandingColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  text?: string;
  background?: string;
}

export interface WhitelabelConfig {
  domain?: string;
  applicationName?: string;
  supportEmail?: string;
  customFooter?: string;
  hideProofPixBranding?: boolean;
}

export interface BrandingConfig {
  assets: {
    logoLight?: string;
    logoDark?: string;
    favicon?: string;
  };
  colors: BrandingColors;
  whitelabel: WhitelabelConfig;
  userId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    assets: Record<string, string>;
    colors: BrandingColors;
    previewUrl: string;
  };
}

export interface ColorUpdateResponse {
  success: boolean;
  message: string;
  data: {
    colors: BrandingColors;
  };
}

export interface WhitelabelUpdateResponse {
  success: boolean;
  message: string;
  data: {
    whitelabel: WhitelabelConfig;
  };
}

export interface ConfigResponse {
  success: boolean;
  data: BrandingConfig;
}

class BrandingService {
  private apiKey: string | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl || '';
    // Try to load API key from localStorage
    try {
      this.apiKey = localStorage.getItem('proofpix_api_key');
    } catch (error) {
      console.error('Failed to load API key from localStorage:', error);
    }
  }

  /**
   * Set API key for authenticated requests
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    // Store in localStorage for persistence
    try {
      localStorage.setItem('proofpix_api_key', apiKey);
    } catch (error) {
      console.error('Failed to store API key in localStorage:', error);
    }
  }

  /**
   * Upload branding assets
   */
  async uploadBrandAssets(assets: BrandingAssets, colors?: BrandingColors): Promise<UploadResponse> {
    if (!this.apiKey) {
      throw new Error('API key is required for branding uploads');
    }

    const formData = new FormData();
    
    // Add assets to formData
    if (assets.logoLight) {
      formData.append('logo_light', assets.logoLight);
    }
    
    if (assets.logoDark) {
      formData.append('logo_dark', assets.logoDark);
    }
    
    if (assets.favicon) {
      formData.append('favicon', assets.favicon);
    }
    
    // Add colors if provided
    if (colors) {
      formData.append('colors', JSON.stringify(colors));
    }
    
    const response = await fetch(`${this.baseUrl}/api/branding/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Client-Version': '2.0.0'
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload branding assets');
    }
    
    return await response.json();
  }

  /**
   * Update branding colors
   */
  async updateColors(colors: BrandingColors): Promise<ColorUpdateResponse> {
    if (!this.apiKey) {
      throw new Error('API key is required for branding updates');
    }
    
    const response = await fetch(`${this.baseUrl}/api/branding/colors`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Client-Version': '2.0.0'
      },
      body: JSON.stringify(colors)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update branding colors');
    }
    
    return await response.json();
  }

  /**
   * Update white-label configuration
   */
  async updateWhitelabel(config: WhitelabelConfig): Promise<WhitelabelUpdateResponse> {
    if (!this.apiKey) {
      throw new Error('API key is required for white-label updates');
    }
    
    const response = await fetch(`${this.baseUrl}/api/branding/whitelabel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Client-Version': '2.0.0'
      },
      body: JSON.stringify(config)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update white-label configuration');
    }
    
    return await response.json();
  }

  /**
   * Get branding configuration
   */
  async getConfig(): Promise<BrandingConfig> {
    if (!this.apiKey) {
      throw new Error('API key is required to get branding configuration');
    }
    
    const response = await fetch(`${this.baseUrl}/api/branding/config`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Client-Version': '2.0.0'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get branding configuration');
    }
    
    const data: ConfigResponse = await response.json();
    return data.data;
  }

  /**
   * Setup complete branding
   */
  async setupBranding(
    assets: BrandingAssets,
    colors: BrandingColors,
    whitelabel: WhitelabelConfig
  ): Promise<BrandingConfig> {
    try {
      // 1. Upload assets
      const uploadResponse = await this.uploadBrandAssets(assets, colors);
      
      // 2. Update white-label config
      await this.updateWhitelabel(whitelabel);
      
      // 3. Get complete config
      return await this.getConfig();
    } catch (error) {
      console.error('Failed to setup complete branding:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const brandingService = new BrandingService(); 