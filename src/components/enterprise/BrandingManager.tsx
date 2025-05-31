import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Image, Check, X, AlertTriangle, Palette, Globe } from 'lucide-react';
import { brandingService, BrandingAssets, BrandingColors, WhitelabelConfig, BrandingConfig } from '../../services/brandingService';

// Tab types
type TabType = 'assets' | 'colors' | 'whitelabel';

interface BrandingManagerProps {
  apiKey?: string;
  onSuccess?: (config: BrandingConfig) => void;
  onError?: (error: Error) => void;
}

export const BrandingManager: React.FC<BrandingManagerProps> = ({ 
  apiKey,
  onSuccess,
  onError
}) => {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('assets');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [brandingConfig, setBrandingConfig] = useState<BrandingConfig | null>(null);
  
  // Form state
  const [assets, setAssets] = useState<BrandingAssets>({});
  const [colors, setColors] = useState<BrandingColors>({
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#F59E0B',
    text: '#F9FAFB',
    background: '#111827'
  });
  const [whitelabel, setWhitelabel] = useState<WhitelabelConfig>({
    hideProofPixBranding: true
  });
  
  // Preview URLs for uploaded assets
  const [previews, setPreviews] = useState<Record<string, string>>({});
  
  // Initialize with API key if provided
  useEffect(() => {
    if (apiKey) {
      brandingService.setApiKey(apiKey);
      fetchBrandingConfig();
    }
  }, [apiKey]);
  
  // Fetch existing branding config
  const fetchBrandingConfig = async () => {
    try {
      setIsLoading(true);
      const config = await brandingService.getConfig();
      setBrandingConfig(config);
      
      // Initialize form state with existing config
      if (config.colors) {
        setColors(config.colors);
      }
      
      if (config.whitelabel) {
        setWhitelabel(config.whitelabel);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch branding config:', error);
      setIsLoading(false);
    }
  };
  
  // Handle asset file selection
  const handleAssetChange = (type: keyof BrandingAssets) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Update assets state
      setAssets(prev => ({
        ...prev,
        [type]: file
      }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({
        ...prev,
        [type]: previewUrl
      }));
    }
  };
  
  // Handle color change
  const handleColorChange = (type: keyof BrandingColors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setColors(prev => ({
      ...prev,
      [type]: e.target.value
    }));
  };
  
  // Handle whitelabel change
  const handleWhitelabelChange = (type: keyof WhitelabelConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    setWhitelabel(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Handle asset upload
  const handleUploadAssets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await brandingService.uploadBrandAssets(assets, colors);
      
      setSuccess('Branding assets uploaded successfully');
      setActiveTab('colors');
      setIsLoading(false);
      
      // Fetch updated config
      await fetchBrandingConfig();
      
      // Call success callback if provided
      if (onSuccess && brandingConfig) {
        onSuccess(brandingConfig);
      }
    } catch (error) {
      console.error('Failed to upload assets:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload assets');
      setIsLoading(false);
      
      // Call error callback if provided
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };
  
  // Handle color update
  const handleUpdateColors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await brandingService.updateColors(colors);
      
      setSuccess('Branding colors updated successfully');
      setActiveTab('whitelabel');
      setIsLoading(false);
      
      // Fetch updated config
      await fetchBrandingConfig();
    } catch (error) {
      console.error('Failed to update colors:', error);
      setError(error instanceof Error ? error.message : 'Failed to update colors');
      setIsLoading(false);
      
      // Call error callback if provided
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };
  
  // Handle whitelabel update
  const handleUpdateWhitelabel = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await brandingService.updateWhitelabel(whitelabel);
      
      setSuccess('White-label configuration updated successfully');
      setIsLoading(false);
      
      // Fetch updated config
      await fetchBrandingConfig();
      
      // Call success callback if provided
      if (onSuccess && brandingConfig) {
        onSuccess(brandingConfig);
      }
    } catch (error) {
      console.error('Failed to update white-label config:', error);
      setError(error instanceof Error ? error.message : 'Failed to update white-label configuration');
      setIsLoading(false);
      
      // Call error callback if provided
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };
  
  // Handle complete setup
  const handleCompleteSetup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const config = await brandingService.setupBranding(assets, colors, whitelabel);
      
      setBrandingConfig(config);
      setSuccess('Branding setup completed successfully');
      setIsLoading(false);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(config);
      }
    } catch (error) {
      console.error('Failed to complete branding setup:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete branding setup');
      setIsLoading(false);
      
      // Call error callback if provided
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Image className="h-6 w-6 text-blue-500 mr-3" />
        <h2 className="text-xl font-bold text-slate-100">Enterprise Branding Manager</h2>
      </div>
      
      {/* Status messages */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
            <p className="text-green-300">{success}</p>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-slate-700 mb-6">
        <div className="flex space-x-6">
        <button
            className={`py-3 font-medium text-sm border-b-2 ${activeTab === 'assets' 
              ? 'border-blue-500 text-blue-500' 
              : 'border-transparent text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('assets')}
        >
            <Upload className="inline-block h-4 w-4 mr-2" />
            Brand Assets
        </button>
          
        <button
            className={`py-3 font-medium text-sm border-b-2 ${activeTab === 'colors' 
              ? 'border-blue-500 text-blue-500' 
              : 'border-transparent text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('colors')}
        >
            <Palette className="inline-block h-4 w-4 mr-2" />
            Brand Colors
        </button>
          
        <button
            className={`py-3 font-medium text-sm border-b-2 ${activeTab === 'whitelabel' 
              ? 'border-blue-500 text-blue-500' 
              : 'border-transparent text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('whitelabel')}
        >
            <Globe className="inline-block h-4 w-4 mr-2" />
            White-labeling
          </button>
          </div>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Upload Brand Assets</h3>
            <p className="text-slate-300 mb-6">
              Upload your organization's logo and other brand assets to customize your ProofPix experience.
            </p>
            
            <div className="space-y-8">
              {/* Logo Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company Logo
                  </label>
                  <div className="rounded-lg border-2 border-dashed border-slate-600 p-6 flex flex-col items-center justify-center bg-slate-700/30">
                    {previews.logoLight ? (
                      <div className="relative w-full">
                        <img src={previews.logoLight} alt="Logo preview" className="mx-auto max-h-32 object-contain mb-2" />
                        <button 
                          onClick={() => {
                            setAssets(prev => {
                              const newAssets = {...prev};
                              delete newAssets.logoLight;
                              return newAssets;
                            });
                            setPreviews(prev => {
                              const newPreviews = {...prev};
                              delete newPreviews.logoLight;
                              return newPreviews;
                            });
                          }}
                          className="absolute top-0 right-0 p-1 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-slate-400 mb-3" />
                        <p className="text-sm text-slate-400 mb-2">Drag and drop or click to upload</p>
                        <p className="text-xs text-slate-500">SVG, PNG or JPG (max. 2MB)</p>
                      </>
                    )}
              <input
                type="file"
                      id="logo-upload" 
                      onChange={handleAssetChange('logoLight')} 
                      accept=".svg,.png,.jpg,.jpeg" 
                className="hidden"
              />
                    {!previews.logoLight && (
              <label
                        htmlFor="logo-upload" 
                        className="mt-4 px-4 py-2 bg-blue-600 text-slate-100 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
              >
                        Select file
              </label>
                    )}
                  </div>
            </div>
            
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Favicon
                  </label>
                  <div className="rounded-lg border-2 border-dashed border-slate-600 p-6 flex flex-col items-center justify-center bg-slate-700/30">
                {previews.favicon ? (
                      <div className="relative w-full">
                        <img src={previews.favicon} alt="Favicon preview" className="mx-auto max-h-32 object-contain mb-2" />
                        <button 
                          onClick={() => {
                            setAssets(prev => {
                              const newAssets = {...prev};
                              delete newAssets.favicon;
                              return newAssets;
                            });
                            setPreviews(prev => {
                              const newPreviews = {...prev};
                              delete newPreviews.favicon;
                              return newPreviews;
                            });
                          }}
                          className="absolute top-0 right-0 p-1 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Image className="h-12 w-12 text-slate-400 mb-3" />
                        <p className="text-sm text-slate-400 mb-2">Drag and drop or click to upload</p>
                        <p className="text-xs text-slate-500">ICO, PNG or SVG (max. 1MB)</p>
                      </>
                    )}
              <input
                type="file"
                      id="favicon-upload" 
                      onChange={handleAssetChange('favicon')} 
                      accept=".ico,.png,.svg" 
                className="hidden"
              />
                    {!previews.favicon && (
              <label
                        htmlFor="favicon-upload" 
                        className="mt-4 px-4 py-2 bg-blue-600 text-slate-100 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
              >
                        Select file
              </label>
                    )}
                  </div>
            </div>
          </div>
          
              {/* Action Buttons */}
          <div className="flex justify-end">
            <button
                  type="button"
              onClick={handleUploadAssets}
                  disabled={isLoading || (!assets.logoLight && !assets.favicon)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isLoading || (!assets.logoLight && !assets.favicon)
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Uploading...' : 'Continue'}
            </button>
              </div>
          </div>
        </div>
      )}
      
      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Brand Colors</h3>
            <p className="text-slate-300 mb-6">
              Customize the color scheme to match your organization's brand identity.
            </p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-lg mr-4 shadow-inner border border-slate-600" 
                  style={{ backgroundColor: colors.primary }}
                ></div>
              <input
                type="text"
                      value={colors.primary} 
                onChange={handleColorChange('primary')}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
              />
              <input
                type="color"
                      value={colors.primary} 
                onChange={handleColorChange('primary')}
                      className="sr-only"
                      id="primary-color-picker"
                    />
                    <label 
                      htmlFor="primary-color-picker"
                      className="ml-2 p-2 rounded-full hover:bg-slate-700 cursor-pointer"
                    >
                      <Palette className="h-5 w-5 text-slate-300" />
                    </label>
                  </div>
            </div>
            
            {/* Secondary Color */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-lg mr-4 shadow-inner border border-slate-600" 
                  style={{ backgroundColor: colors.secondary }}
                ></div>
              <input
                type="text"
                      value={colors.secondary} 
                onChange={handleColorChange('secondary')}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
              />
              <input
                type="color"
                      value={colors.secondary} 
                onChange={handleColorChange('secondary')}
                      className="sr-only"
                      id="secondary-color-picker"
                    />
                    <label 
                      htmlFor="secondary-color-picker"
                      className="ml-2 p-2 rounded-full hover:bg-slate-700 cursor-pointer"
                    >
                      <Palette className="h-5 w-5 text-slate-300" />
                    </label>
              </div>
            </div>
            </div>
            
              {/* Action Buttons */}
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={handleUpdateColors}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isLoading
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Updating...' : 'Continue'}
                </button>
              </div>
          </div>
        </div>
      )}
      
        {/* Whitelabel Tab */}
      {activeTab === 'whitelabel' && (
        <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">White-label Configuration</h3>
            <p className="text-slate-300 mb-6">
              Configure white-labeling options to customize the appearance of ProofPix for your organization.
            </p>
            
            <div className="space-y-6">
              {/* White-label Options */}
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                    <label className="text-sm font-medium text-slate-200">
                      Hide ProofPix Branding
                    </label>
                    <p className="text-xs text-slate-400 mt-1">
                      Remove all references to ProofPix in the UI
                  </p>
                </div>
                  <div className="relative inline-block w-12 h-6">
                  <input 
                    type="checkbox" 
                      id="hide-branding" 
                      checked={whitelabel.hideProofPixBranding} 
                    onChange={handleWhitelabelChange('hideProofPixBranding')}
                      className="sr-only"
                    />
                    <label 
                      htmlFor="hide-branding"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                        whitelabel.hideProofPixBranding ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span 
                        className={`block h-6 w-6 rounded-full transform transition-transform bg-white ${
                          whitelabel.hideProofPixBranding ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                </label>
              </div>
            </div>
          </div>
          
              {/* Action Buttons */}
          <div className="flex justify-end">
            <button
                  type="button"
              onClick={handleUpdateWhitelabel}
              disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isLoading
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
            >
                  {isLoading ? 'Updating...' : 'Complete Setup'}
            </button>
              </div>
          </div>
        </div>
      )}
      </div>
      
      {/* Complete Setup Button */}
      <div className="mt-8 pt-6 border-t border-slate-700">
        <button
          className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center disabled:opacity-50"
          onClick={handleCompleteSetup}
          disabled={isLoading}
        >
          <Check className="h-5 w-5 mr-2" />
          {isLoading ? 'Processing...' : 'Complete Branding Setup'}
        </button>
      </div>
    </div>
  );
}; 