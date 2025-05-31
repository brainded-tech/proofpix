// White-label Interface Framework
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BrandingConfig {
  // Company Information
  companyName: string;
  companyLogo?: string;
  companyLogoLight?: string;
  companyLogoDark?: string;
  favicon?: string;
  
  // Colors and Theme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  
  // Typography
  fontFamily: string;
  headingFont?: string;
  
  // Layout and Styling
  borderRadius: string;
  shadowStyle: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  
  // Custom CSS
  customCSS?: string;
  
  // Features and Configuration
  features: {
    showPoweredBy: boolean;
    customFooter?: string;
    customHeader?: string;
    hideProofPixBranding: boolean;
    customDomain?: string;
  };
  
  // Contact and Support
  supportEmail?: string;
  supportPhone?: string;
  supportUrl?: string;
  
  // Legal and Compliance
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  complianceInfo?: string;
  
  // Analytics and Tracking
  googleAnalyticsId?: string;
  customTrackingCode?: string;
  
  // API and Integration
  apiEndpoint?: string;
  webhookUrl?: string;
  
  // Localization
  language: string;
  timezone: string;
  dateFormat: string;
  
  // Security
  allowedDomains?: string[];
  ssoConfig?: {
    enabled: boolean;
    provider: string;
    loginUrl?: string;
    logoutUrl?: string;
  };
}

interface WhiteLabelContextType {
  branding: BrandingConfig;
  setBranding: (config: Partial<BrandingConfig>) => void;
  resetBranding: () => void;
  isCustomBranded: boolean;
  applyBranding: () => void;
  exportBranding: () => string;
  importBranding: (config: string) => void;
}

const defaultBranding: BrandingConfig = {
  companyName: 'ProofPix',
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  accentColor: '#10b981',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  fontFamily: 'Inter, system-ui, sans-serif',
  borderRadius: '0.5rem',
  shadowStyle: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  buttonStyle: 'rounded',
  features: {
    showPoweredBy: true,
    hideProofPixBranding: false
  },
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/dd/yyyy'
};

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

interface WhiteLabelProviderProps {
  children: ReactNode;
  initialConfig?: Partial<BrandingConfig>;
}

export const WhiteLabelProvider: React.FC<WhiteLabelProviderProps> = ({ 
  children, 
  initialConfig 
}) => {
  const [branding, setBrandingState] = useState<BrandingConfig>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('proofpix_branding');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultBranding, ...parsed, ...initialConfig };
      } catch (error) {
        console.error('Failed to parse saved branding config:', error);
      }
    }
    return { ...defaultBranding, ...initialConfig };
  });

  const setBranding = (config: Partial<BrandingConfig>) => {
    const newBranding = { ...branding, ...config };
    setBrandingState(newBranding);
    localStorage.setItem('proofpix_branding', JSON.stringify(newBranding));
  };

  const resetBranding = () => {
    setBrandingState(defaultBranding);
    localStorage.removeItem('proofpix_branding');
  };

  const isCustomBranded = branding.companyName !== 'ProofPix' || 
                         branding.primaryColor !== defaultBranding.primaryColor ||
                         branding.companyLogo !== undefined;

  const applyBranding = () => {
    // Apply CSS custom properties
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', branding.primaryColor);
    root.style.setProperty('--secondary-color', branding.secondaryColor);
    root.style.setProperty('--accent-color', branding.accentColor);
    root.style.setProperty('--background-color', branding.backgroundColor);
    root.style.setProperty('--text-color', branding.textColor);
    root.style.setProperty('--font-family', branding.fontFamily);
    root.style.setProperty('--border-radius', branding.borderRadius);
    root.style.setProperty('--shadow-style', branding.shadowStyle);
    
    // Apply heading font if specified
    if (branding.headingFont) {
      root.style.setProperty('--heading-font', branding.headingFont);
    }
    
    // Update document title
    document.title = `${branding.companyName} - Privacy-First Image Metadata Extraction`;
    
    // Update favicon if provided
    if (branding.favicon) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = branding.favicon;
      }
    }
    
    // Apply custom CSS if provided
    if (branding.customCSS) {
      let customStyleElement = document.getElementById('custom-branding-styles');
      if (!customStyleElement) {
        customStyleElement = document.createElement('style');
        customStyleElement.id = 'custom-branding-styles';
        document.head.appendChild(customStyleElement);
      }
      customStyleElement.textContent = branding.customCSS;
    }
    
    // Apply button style class to body
    document.body.className = document.body.className.replace(/button-style-\w+/g, '');
    document.body.classList.add(`button-style-${branding.buttonStyle}`);
    
    // Set up analytics if configured
    if (branding.googleAnalyticsId && typeof window !== 'undefined') {
      // Initialize Google Analytics
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${branding.googleAnalyticsId}`;
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      const gtag = (...args: any[]) => {
        window.dataLayer.push(args);
      };
      gtag('js', new Date());
      gtag('config', branding.googleAnalyticsId);
    }
    
    // Apply custom tracking code if provided
    if (branding.customTrackingCode && typeof window !== 'undefined') {
      try {
        // Execute custom tracking code safely
        const script = document.createElement('script');
        script.textContent = branding.customTrackingCode;
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to execute custom tracking code:', error);
      }
    }
  };

  const exportBranding = (): string => {
    return JSON.stringify(branding, null, 2);
  };

  const importBranding = (configString: string) => {
    try {
      const config = JSON.parse(configString);
      setBranding(config);
    } catch (error) {
      console.error('Failed to import branding config:', error);
      throw new Error('Invalid branding configuration format');
    }
  };

  // Apply branding on mount and when branding changes
  useEffect(() => {
    applyBranding();
  }, [branding]);

  // Set up domain validation for security
  useEffect(() => {
    if (branding.allowedDomains && branding.allowedDomains.length > 0) {
      const currentDomain = window.location.hostname;
      const isAllowed = branding.allowedDomains.some(domain => 
        currentDomain === domain || currentDomain.endsWith(`.${domain}`)
      );
      
      if (!isAllowed) {
        console.warn('Current domain is not in the allowed domains list');
        // In a real implementation, you might redirect or show an error
      }
    }
  }, [branding.allowedDomains]);

  const contextValue: WhiteLabelContextType = {
    branding,
    setBranding,
    resetBranding,
    isCustomBranded,
    applyBranding,
    exportBranding,
    importBranding
  };

  return (
    <WhiteLabelContext.Provider value={contextValue}>
      {children}
    </WhiteLabelContext.Provider>
  );
};

// Hook to use white label context
export const useWhiteLabel = (): WhiteLabelContextType => {
  const context = useContext(WhiteLabelContext);
  if (!context) {
    throw new Error('useWhiteLabel must be used within a WhiteLabelProvider');
  }
  return context;
};

// Component to display company logo with fallback
export const CompanyLogo: React.FC<{ 
  className?: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
}> = ({ className = '', size = 'md', variant = 'auto' }) => {
  const { branding } = useWhiteLabel();
  
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  };
  
  const getLogo = () => {
    if (variant === 'light' && branding.companyLogoLight) {
      return branding.companyLogoLight;
    }
    if (variant === 'dark' && branding.companyLogoDark) {
      return branding.companyLogoDark;
    }
    return branding.companyLogo;
  };
  
  const logo = getLogo();
  
  if (logo) {
    return (
      <img
        src={logo}
        alt={`${branding.companyName} Logo`}
        className={`${sizeClasses[size]} ${className}`}
      />
    );
  }
  
  // Fallback to text logo
  return (
    <span className={`font-bold text-current ${className}`}>
      {branding.companyName}
    </span>
  );
};

// Component to display powered by ProofPix (if enabled)
export const PoweredBy: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { branding } = useWhiteLabel();
  
  if (branding.features.hideProofPixBranding || !branding.features.showPoweredBy) {
    return null;
  }
  
  return (
    <div className={`text-xs text-gray-500 dark:text-gray-400 ${className}`}>
      Powered by{' '}
      <a 
        href="https://proofpix.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        ProofPix
      </a>
    </div>
  );
};

// Component for custom footer content
export const CustomFooter: React.FC = () => {
  const { branding } = useWhiteLabel();
  
  if (!branding.features.customFooter) {
    return null;
  }
  
  return (
    <div 
      className="custom-footer-content"
      dangerouslySetInnerHTML={{ __html: branding.features.customFooter }}
    />
  );
};

// Component for custom header content
export const CustomHeader: React.FC = () => {
  const { branding } = useWhiteLabel();
  
  if (!branding.features.customHeader) {
    return null;
  }
  
  return (
    <div 
      className="custom-header-content"
      dangerouslySetInnerHTML={{ __html: branding.features.customHeader }}
    />
  );
};

// Hook to get branded contact information
export const useBrandedContact = () => {
  const { branding } = useWhiteLabel();
  
  return {
    supportEmail: branding.supportEmail || 'support@proofpix.com',
    supportPhone: branding.supportPhone,
    supportUrl: branding.supportUrl || 'https://proofpix.com/support',
    companyName: branding.companyName
  };
};

// Hook to get branded legal links
export const useBrandedLegal = () => {
  const { branding } = useWhiteLabel();
  
  return {
    privacyPolicyUrl: branding.privacyPolicyUrl || '/privacy',
    termsOfServiceUrl: branding.termsOfServiceUrl || '/terms',
    complianceInfo: branding.complianceInfo
  };
};

// Utility function to get branded colors for charts and visualizations
export const getBrandedColors = (branding: BrandingConfig) => {
  return {
    primary: branding.primaryColor,
    secondary: branding.secondaryColor,
    accent: branding.accentColor,
    background: branding.backgroundColor,
    text: branding.textColor,
    // Generate a palette based on primary color
    palette: [
      branding.primaryColor,
      branding.secondaryColor,
      branding.accentColor,
      // Add variations
      adjustColorBrightness(branding.primaryColor, 20),
      adjustColorBrightness(branding.primaryColor, -20),
      adjustColorBrightness(branding.secondaryColor, 20),
      adjustColorBrightness(branding.accentColor, 20)
    ]
  };
};

// Utility function to adjust color brightness
function adjustColorBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Extend window object for analytics
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default WhiteLabelProvider;
