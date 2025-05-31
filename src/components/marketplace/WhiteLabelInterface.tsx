import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Upload,
  Eye,
  Settings,
  Globe,
  Shield,
  CreditCard,
  Users,
  Monitor,
  Smartphone,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Save,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useEnterpriseMarketplace } from '../../hooks/useEnterpriseMarketplace';

interface WhiteLabelInterfaceProps {
  className?: string;
}

interface BrandingConfig {
  logo: {
    light: string;
    dark: string;
    favicon: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
  };
  customCSS: string;
}

interface DeploymentConfig {
  subdomain: string;
  customDomain?: string;
  sslEnabled: boolean;
  region: string;
  scaling: 'auto' | 'manual';
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
}

export const WhiteLabelInterface: React.FC<WhiteLabelInterfaceProps> = ({
  className = ''
}) => {
  const navigate = useNavigate();
  const { whiteLabelConfigs, createWhiteLabelSolution, loading } = useEnterpriseMarketplace();
  
  const [activeTab, setActiveTab] = useState<'branding' | 'deployment' | 'features' | 'preview'>('branding');
  const [brandingConfig, setBrandingConfig] = useState<BrandingConfig>({
    logo: { light: '', dark: '', favicon: '' },
    colors: {
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#10B981',
      text: '#1E293B',
      background: '#FFFFFF'
    },
    typography: {
      fontFamily: 'Inter',
      headingFont: 'Inter',
      bodyFont: 'Inter'
    },
    customCSS: ''
  });
  
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    subdomain: '',
    customDomain: '',
    sslEnabled: true,
    region: 'us-east-1',
    scaling: 'auto',
    resources: {
      cpu: '2 vCPU',
      memory: '4 GB',
      storage: '50 GB'
    }
  });

  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([
    'metadata-extraction',
    'batch-processing',
    'api-access'
  ]);

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const availableFeatures = [
    { id: 'metadata-extraction', name: 'Metadata Extraction', description: 'Core image metadata extraction' },
    { id: 'batch-processing', name: 'Batch Processing', description: 'Process multiple files at once' },
    { id: 'api-access', name: 'API Access', description: 'RESTful API for integrations' },
    { id: 'white-label-branding', name: 'Custom Branding', description: 'Full white-label customization' },
    { id: 'advanced-analytics', name: 'Advanced Analytics', description: 'Detailed usage analytics' },
    { id: 'sso-integration', name: 'SSO Integration', description: 'Single sign-on support' },
    { id: 'compliance-tools', name: 'Compliance Tools', description: 'GDPR, HIPAA compliance features' },
    { id: 'custom-workflows', name: 'Custom Workflows', description: 'Workflow automation tools' }
  ];

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Source Sans Pro', 'Nunito'
  ];

  const regionOptions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'Europe (Ireland)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
    { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const config = {
        name: `${deploymentConfig.subdomain} White Label`,
        clientId: `client_${Date.now()}`,
        branding: {
          logo: brandingConfig.logo.light,
          primaryColor: brandingConfig.colors.primary,
          secondaryColor: brandingConfig.colors.secondary,
          accentColor: brandingConfig.colors.accent,
          fontFamily: brandingConfig.typography.fontFamily,
          customCSS: brandingConfig.customCSS
        },
        domain: {
          subdomain: deploymentConfig.subdomain,
          customDomain: deploymentConfig.customDomain,
          sslEnabled: deploymentConfig.sslEnabled
        },
        features: {
          enabled: enabledFeatures,
          disabled: availableFeatures.filter(f => !enabledFeatures.includes(f.id)).map(f => f.id),
          customizations: {}
        },
        deployment: {
          type: 'saas' as const,
          region: deploymentConfig.region,
          scaling: deploymentConfig.scaling,
          resources: deploymentConfig.resources
        }
      };

      await createWhiteLabelSolution(config);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save white-label configuration:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (type: 'light' | 'dark' | 'favicon', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setBrandingConfig(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          [type]: e.target?.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: 'branding', label: 'Branding', icon: <Palette className="h-4 w-4" /> },
    { id: 'deployment', label: 'Deployment', icon: <Globe className="h-4 w-4" /> },
    { id: 'features', label: 'Features', icon: <Settings className="h-4 w-4" /> },
    { id: 'preview', label: 'Preview', icon: <Eye className="h-4 w-4" /> }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">White-Label Configuration</h1>
                <p className="text-sm text-slate-600">Customize your branded solution</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {saveStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Saved successfully</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Save failed</span>
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'branding' && (
          <BrandingTab
            config={brandingConfig}
            onChange={setBrandingConfig}
            onFileUpload={handleFileUpload}
            fontOptions={fontOptions}
          />
        )}
        {activeTab === 'deployment' && (
          <DeploymentTab
            config={deploymentConfig}
            onChange={setDeploymentConfig}
            regionOptions={regionOptions}
          />
        )}
        {activeTab === 'features' && (
          <FeaturesTab
            availableFeatures={availableFeatures}
            enabledFeatures={enabledFeatures}
            onChange={setEnabledFeatures}
          />
        )}
        {activeTab === 'preview' && (
          <PreviewTab
            brandingConfig={brandingConfig}
            previewMode={previewMode}
            onPreviewModeChange={setPreviewMode}
          />
        )}
      </div>
    </div>
  );
};

// Branding Tab Component
interface BrandingTabProps {
  config: BrandingConfig;
  onChange: (config: BrandingConfig) => void;
  onFileUpload: (type: 'light' | 'dark' | 'favicon', file: File) => void;
  fontOptions: string[];
}

const BrandingTab: React.FC<BrandingTabProps> = ({ config, onChange, onFileUpload, fontOptions }) => {
  const handleColorChange = (colorType: keyof BrandingConfig['colors'], value: string) => {
    onChange({
      ...config,
      colors: {
        ...config.colors,
        [colorType]: value
      }
    });
  };

  const handleTypographyChange = (fontType: keyof BrandingConfig['typography'], value: string) => {
    onChange({
      ...config,
      typography: {
        ...config.typography,
        [fontType]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Logo Upload */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Logo & Brand Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LogoUpload
            label="Light Mode Logo"
            description="Logo for light backgrounds"
            currentLogo={config.logo.light}
            onUpload={(file) => onFileUpload('light', file)}
          />
          <LogoUpload
            label="Dark Mode Logo"
            description="Logo for dark backgrounds"
            currentLogo={config.logo.dark}
            onUpload={(file) => onFileUpload('dark', file)}
          />
          <LogoUpload
            label="Favicon"
            description="Browser tab icon (32x32px)"
            currentLogo={config.logo.favicon}
            onUpload={(file) => onFileUpload('favicon', file)}
          />
        </div>
      </div>

      {/* Color Scheme */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Color Scheme</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ColorPicker
            label="Primary Color"
            description="Main brand color for buttons and links"
            value={config.colors.primary}
            onChange={(value) => handleColorChange('primary', value)}
          />
          <ColorPicker
            label="Secondary Color"
            description="Secondary elements and borders"
            value={config.colors.secondary}
            onChange={(value) => handleColorChange('secondary', value)}
          />
          <ColorPicker
            label="Accent Color"
            description="Highlights and call-to-action elements"
            value={config.colors.accent}
            onChange={(value) => handleColorChange('accent', value)}
          />
          <ColorPicker
            label="Text Color"
            description="Primary text color"
            value={config.colors.text}
            onChange={(value) => handleColorChange('text', value)}
          />
          <ColorPicker
            label="Background Color"
            description="Main background color"
            value={config.colors.background}
            onChange={(value) => handleColorChange('background', value)}
          />
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Primary Font Family
            </label>
            <select
              value={config.typography.fontFamily}
              onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Heading Font
            </label>
            <select
              value={config.typography.headingFont}
              onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Body Font
            </label>
            <select
              value={config.typography.bodyFont}
              onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Custom CSS</h3>
        <p className="text-sm text-slate-600 mb-4">
          Add custom CSS to further customize the appearance of your white-label solution.
        </p>
        <textarea
          value={config.customCSS}
          onChange={(e) => onChange({ ...config, customCSS: e.target.value })}
          placeholder="/* Add your custom CSS here */"
          className="w-full h-40 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
        />
      </div>
    </div>
  );
};

// Logo Upload Component
interface LogoUploadProps {
  label: string;
  description: string;
  currentLogo: string;
  onUpload: (file: File) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ label, description, currentLogo, onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
      <div className="mb-4">
        {currentLogo ? (
          <img src={currentLogo} alt={label} className="h-16 w-auto mx-auto" />
        ) : (
          <Upload className="h-12 w-12 text-slate-400 mx-auto" />
        )}
      </div>
      <h4 className="font-medium text-slate-900 mb-1">{label}</h4>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
          {currentLogo ? 'Replace' : 'Upload'}
        </span>
      </label>
    </div>
  );
};

// Color Picker Component
interface ColorPickerProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, description, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <p className="text-xs text-slate-600 mb-2">{description}</p>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 border border-slate-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
        />
      </div>
    </div>
  );
};

// Deployment Tab Component
interface DeploymentTabProps {
  config: DeploymentConfig;
  onChange: (config: DeploymentConfig) => void;
  regionOptions: { value: string; label: string }[];
}

const DeploymentTab: React.FC<DeploymentTabProps> = ({ config, onChange, regionOptions }) => {
  const handleChange = (field: keyof DeploymentConfig, value: any) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  const handleResourceChange = (resource: keyof DeploymentConfig['resources'], value: string) => {
    onChange({
      ...config,
      resources: {
        ...config.resources,
        [resource]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Domain Configuration */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Domain Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subdomain
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={config.subdomain}
                onChange={(e) => handleChange('subdomain', e.target.value)}
                placeholder="your-company"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg text-slate-600">
                .proofpixapp.com
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Custom Domain (Optional)
            </label>
            <input
              type="text"
              value={config.customDomain}
              onChange={(e) => handleChange('customDomain', e.target.value)}
              placeholder="app.yourcompany.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ssl-enabled"
              checked={config.sslEnabled}
              onChange={(e) => handleChange('sslEnabled', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
            />
            <label htmlFor="ssl-enabled" className="ml-2 text-sm text-slate-700">
              Enable SSL/TLS encryption
            </label>
          </div>
        </div>
      </div>

      {/* Infrastructure Settings */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Infrastructure Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Region
            </label>
            <select
              value={config.region}
              onChange={(e) => handleChange('region', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {regionOptions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Scaling
            </label>
            <select
              value={config.scaling}
              onChange={(e) => handleChange('scaling', e.target.value as 'auto' | 'manual')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="auto">Auto Scaling</option>
              <option value="manual">Manual Scaling</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resource Allocation */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Resource Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              CPU
            </label>
            <select
              value={config.resources.cpu}
              onChange={(e) => handleResourceChange('cpu', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="1 vCPU">1 vCPU</option>
              <option value="2 vCPU">2 vCPU</option>
              <option value="4 vCPU">4 vCPU</option>
              <option value="8 vCPU">8 vCPU</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Memory
            </label>
            <select
              value={config.resources.memory}
              onChange={(e) => handleResourceChange('memory', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="2 GB">2 GB</option>
              <option value="4 GB">4 GB</option>
              <option value="8 GB">8 GB</option>
              <option value="16 GB">16 GB</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Storage
            </label>
            <select
              value={config.resources.storage}
              onChange={(e) => handleResourceChange('storage', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="25 GB">25 GB</option>
              <option value="50 GB">50 GB</option>
              <option value="100 GB">100 GB</option>
              <option value="250 GB">250 GB</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features Tab Component
interface FeaturesTabProps {
  availableFeatures: Array<{ id: string; name: string; description: string }>;
  enabledFeatures: string[];
  onChange: (features: string[]) => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({ availableFeatures, enabledFeatures, onChange }) => {
  const handleFeatureToggle = (featureId: string) => {
    if (enabledFeatures.includes(featureId)) {
      onChange(enabledFeatures.filter(id => id !== featureId));
    } else {
      onChange([...enabledFeatures, featureId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Features</h3>
        <p className="text-slate-600 mb-6">
          Select which features to include in your white-label solution.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                enabledFeatures.includes(feature.id)
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => handleFeatureToggle(feature.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{feature.name}</h4>
                  <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={enabledFeatures.includes(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Preview Tab Component
interface PreviewTabProps {
  brandingConfig: BrandingConfig;
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
}

const PreviewTab: React.FC<PreviewTabProps> = ({ brandingConfig, previewMode, onPreviewModeChange }) => {
  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Preview</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPreviewModeChange('desktop')}
              className={`p-2 rounded-lg transition-colors ${
                previewMode === 'desktop'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Monitor className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPreviewModeChange('mobile')}
              className={`p-2 rounded-lg transition-colors ${
                previewMode === 'mobile'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <div className={`mx-auto border border-slate-300 rounded-lg overflow-hidden ${
          previewMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'
        }`}>
          <div
            className="p-6"
            style={{
              backgroundColor: brandingConfig.colors.background,
              color: brandingConfig.colors.text,
              fontFamily: brandingConfig.typography.fontFamily
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: brandingConfig.colors.secondary }}>
              <div className="flex items-center space-x-3">
                {brandingConfig.logo.light && (
                  <img src={brandingConfig.logo.light} alt="Logo" className="h-8 w-auto" />
                )}
                <span className="font-bold text-xl" style={{ fontFamily: brandingConfig.typography.headingFont }}>
                  Your Brand
                </span>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: brandingConfig.colors.primary }}
              >
                Get Started
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: brandingConfig.typography.headingFont }}>
                  Welcome to Your Platform
                </h1>
                <p className="text-lg" style={{ fontFamily: brandingConfig.typography.bodyFont, color: brandingConfig.colors.secondary }}>
                  This is how your white-label solution will look with your custom branding applied.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border" style={{ borderColor: brandingConfig.colors.secondary }}>
                  <h3 className="font-semibold mb-2" style={{ color: brandingConfig.colors.primary }}>
                    Feature One
                  </h3>
                  <p className="text-sm" style={{ fontFamily: brandingConfig.typography.bodyFont }}>
                    Description of your first feature.
                  </p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: brandingConfig.colors.secondary }}>
                  <h3 className="font-semibold mb-2" style={{ color: brandingConfig.colors.primary }}>
                    Feature Two
                  </h3>
                  <p className="text-sm" style={{ fontFamily: brandingConfig.typography.bodyFont }}>
                    Description of your second feature.
                  </p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: brandingConfig.colors.secondary }}>
                  <h3 className="font-semibold mb-2" style={{ color: brandingConfig.colors.primary }}>
                    Feature Three
                  </h3>
                  <p className="text-sm" style={{ fontFamily: brandingConfig.typography.bodyFont }}>
                    Description of your third feature.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  className="px-6 py-3 rounded-lg text-white font-medium"
                  style={{ backgroundColor: brandingConfig.colors.primary }}
                >
                  Primary Action
                </button>
                <button
                  className="px-6 py-3 rounded-lg font-medium border"
                  style={{ 
                    borderColor: brandingConfig.colors.accent,
                    color: brandingConfig.colors.accent
                  }}
                >
                  Secondary Action
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 