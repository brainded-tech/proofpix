// Enterprise Branding Preview with Isolation
import React, { useState, useEffect } from 'react';
import { Eye, Monitor, Smartphone, Tablet, Shield } from 'lucide-react';

interface BrandingPreviewProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  logo?: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export const BrandingPreview: React.FC<BrandingPreviewProps> = ({ colors, logo }) => {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [previewStyles, setPreviewStyles] = useState<string>('');

  // 🔒 SECURITY: Generate safe CSS with enterprise namespace isolation
  useEffect(() => {
    const sanitizedColors = {
      primary: colors.primary.replace(/[^#A-Fa-f0-9]/g, ''),
      secondary: colors.secondary.replace(/[^#A-Fa-f0-9]/g, ''),
      accent: colors.accent.replace(/[^#A-Fa-f0-9]/g, ''),
      background: colors.background.replace(/[^#A-Fa-f0-9]/g, ''),
      text: colors.text.replace(/[^#A-Fa-f0-9]/g, '')
    };

    const styles = `
      .enterprise-preview-container {
        --enterprise-primary: ${sanitizedColors.primary};
        --enterprise-secondary: ${sanitizedColors.secondary};
        --enterprise-accent: ${sanitizedColors.accent};
        --enterprise-background: ${sanitizedColors.background};
        --enterprise-text: ${sanitizedColors.text};
      }
    `;
    setPreviewStyles(styles);
  }, [colors]);

  const getViewportClasses = () => {
    switch (viewport) {
      case 'mobile': return 'w-80 h-96';
      case 'tablet': return 'w-96 h-80';
      case 'desktop': return 'w-full h-96';
      default: return 'w-full h-96';
    }
  };

  const ViewportButton: React.FC<{ size: ViewportSize; icon: React.ReactNode; label: string }> = ({ size, icon, label }) => (
    <button
      onClick={() => setViewport(size)}
      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
        viewport === size ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {icon}
      <span className="ml-2 text-sm">{label}</span>
    </button>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <style dangerouslySetInnerHTML={{ __html: previewStyles }} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Eye className="h-6 w-6 text-green-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Brand Preview</h2>
        </div>

        <div className="flex space-x-2">
          <ViewportButton size="desktop" icon={<Monitor className="h-4 w-4" />} label="Desktop" />
          <ViewportButton size="tablet" icon={<Tablet className="h-4 w-4" />} label="Tablet" />
          <ViewportButton size="mobile" icon={<Smartphone className="h-4 w-4" />} label="Mobile" />
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
          <div>
            <h4 className="text-green-300 font-medium mb-1">🔒 Enterprise Isolation</h4>
            <p className="text-green-200 text-sm">Preview runs in isolated namespace to prevent style conflicts with main application.</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
        <div className={`enterprise-preview-container mx-auto transition-all duration-300 ${getViewportClasses()}`}>
          <div
            className="h-full rounded-lg overflow-hidden"
            style={{ backgroundColor: colors.background }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {logo ? (
                    <img src={logo} alt="Brand Logo" className="h-8 w-auto mr-3" />
                  ) : (
                    <div
                      className="h-8 w-24 rounded mr-3"
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                  <h3 style={{ color: colors.text }} className="font-bold">Your Company</h3>
                </div>
                <button
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: colors.primary, color: colors.background }}
                >
                  Sign In
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h1 style={{ color: colors.text }} className="text-2xl font-bold mb-4">Welcome to ProofPix Enterprise</h1>
                  <p style={{ color: colors.secondary }} className="mb-6">Professional metadata verification for your organization</p>
                  <div className="space-y-3">
                    <button
                      className="w-full px-6 py-3 rounded-lg font-medium"
                      style={{ backgroundColor: colors.primary, color: colors.background }}
                    >
                      Upload Images
                    </button>
                    <button
                      className="w-full px-6 py-3 rounded-lg font-medium border"
                      style={{ borderColor: colors.accent, color: colors.accent }}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
