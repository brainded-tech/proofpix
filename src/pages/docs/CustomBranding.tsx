import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Palette, Upload, Settings, Eye, Code, CheckCircle, ArrowRight, Image, Zap, ArrowLeft } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

export const CustomBranding: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  return (
    <EnterpriseLayout
      showHero
      title="Custom Branding & White-Label Solutions"
      description="Complete branding customization for enterprise deployments"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <EnterpriseButton
          variant="ghost"
          onClick={handleBackToDocs}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Documentation
        </EnterpriseButton>
        
        <div className="flex items-center space-x-6 text-sm mb-8">
          <EnterpriseBadge variant="primary" icon={<Palette className="enterprise-icon-sm" />}>
            Branding Solutions
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<Settings className="enterprise-icon-sm" />}>
            White-Label Ready
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<Eye className="enterprise-icon-sm" />}>
            Custom UI/UX
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Table of contents */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-lg font-semibold mb-3">On This Page</h2>
          <ul className="space-y-2">
            <li><a href="#overview" className="text-blue-600 hover:underline">Branding Overview</a></li>
            <li><a href="#logo-assets" className="text-blue-600 hover:underline">Logo & Assets</a></li>
            <li><a href="#color-themes" className="text-blue-600 hover:underline">Color Themes</a></li>
            <li><a href="#white-label" className="text-blue-600 hover:underline">White-Label Options</a></li>
            <li><a href="#api-integration" className="text-blue-600 hover:underline">API Integration</a></li>
            <li><a href="#preview" className="text-blue-600 hover:underline">Preview & Testing</a></li>
          </ul>
        </EnterpriseCard>

        {/* Brand Asset Upload */}
        <section id="brand-assets" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <Upload className="mr-2 text-blue-500" size={24} />
            Brand Asset Upload
          </h2>
          
          <p className="text-slate-700 mb-6">
            Upload your company's branding assets to create a seamless, branded experience for your team 
            and customers. All assets are processed securely and optimized for web performance.
          </p>

          <EnterpriseGrid columns={2} className="mb-8">
            <EnterpriseCard className="bg-blue-50 border-blue-200">
              <div className="flex items-center mb-4">
                <Image className="mr-2 text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-blue-900">Logo Requirements</h3>
              </div>
              <ul className="text-sm text-slate-700 space-y-2">
                <li>• <strong>Formats:</strong> PNG, SVG, JPG</li>
                <li>• <strong>Max Size:</strong> 2MB per file</li>
                <li>• <strong>Recommended:</strong> 300x100px (3:1 ratio)</li>
                <li>• <strong>Background:</strong> Transparent PNG preferred</li>
                <li>• <strong>Variants:</strong> Light and dark versions</li>
              </ul>
            </EnterpriseCard>
            
            <EnterpriseCard className="bg-green-50 border-green-200">
              <div className="flex items-center mb-4">
                <Palette className="mr-2 text-green-600" size={20} />
                <h3 className="text-lg font-semibold text-green-900">Color Scheme</h3>
              </div>
              <ul className="text-sm text-slate-700 space-y-2">
                <li>• <strong>Primary:</strong> Buttons, links, highlights</li>
                <li>• <strong>Secondary:</strong> Backgrounds, borders</li>
                <li>• <strong>Accent:</strong> Success states, CTAs</li>
                <li>• <strong>Text:</strong> Headings and body text</li>
                <li>• <strong>Format:</strong> HEX, RGB, or HSL values</li>
              </ul>
            </EnterpriseCard>
          </EnterpriseGrid>

          <div className="bg-slate-900 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Example</h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
{`// Upload brand assets via API
const uploadBrandAssets = async (files, colors) => {
  const formData = new FormData();
  
  // Add logo files
  formData.append('logo_light', files.logoLight);
  formData.append('logo_dark', files.logoDark);
  formData.append('favicon', files.favicon);
  
  // Add color scheme
  formData.append('colors', JSON.stringify({
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    text: colors.text
  }));
  
  const response = await fetch('/api/v2/enterprise/branding/upload', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'X-Client-Version': '2.1.0'
    },
    body: formData
  });
  
  return response.json();
};`}
            </pre>
          </div>

          <EnterpriseCard className="bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex items-center mb-2">
              <Zap className="mr-2 text-yellow-600" size={16} />
              <span className="font-semibold text-yellow-800">Pro Tip</span>
            </div>
            <p className="text-yellow-700 text-sm">
              Upload both light and dark logo variants for optimal display across different themes and backgrounds.
            </p>
          </EnterpriseCard>
        </section>

        {/* Color Schemes */}
        <section id="color-schemes" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Color Scheme Configuration</h2>
          
          <EnterpriseGrid columns={2}>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Color Palette Setup</h3>
              <div className="space-y-4">
                <EnterpriseCard>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Primary Color</span>
                    <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                  </div>
                  <p className="text-sm text-slate-600">Used for buttons, links, and primary actions</p>
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded">#2563eb</code>
                </EnterpriseCard>

                <EnterpriseCard>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Secondary Color</span>
                    <div className="w-8 h-8 bg-slate-600 rounded border"></div>
                  </div>
                  <p className="text-sm text-slate-600">Used for backgrounds and subtle elements</p>
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded">#4b5563</code>
                </EnterpriseCard>
              
                <EnterpriseCard>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Accent Color</span>
                    <div className="w-8 h-8 bg-green-600 rounded border"></div>
                  </div>
                  <p className="text-sm text-slate-600">Used for success states and highlights</p>
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded">#059669</code>
                </EnterpriseCard>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">API Configuration</h3>
              <div className="bg-slate-900 rounded-lg p-4">
                <pre className="text-green-400 text-sm overflow-x-auto">
{`// Update color scheme
const updateColors = async (colors) => {
  const response = await fetch(
    '/api/v2/enterprise/branding/colors',
    {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        text: colors.text,
        background: colors.background
      })
    }
  );
  
  return response.json();
};`}
                </pre>
              </div>
            </div>
          </EnterpriseGrid>
          
          <div className="mt-8">
            <EnterpriseGrid columns={3}>
              <EnterpriseCard className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-3"></div>
                <h4 className="font-semibold">Tech Theme</h4>
              </EnterpriseCard>
              <EnterpriseCard className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg mx-auto mb-3"></div>
                <h4 className="font-semibold">Corporate Theme</h4>
              </EnterpriseCard>
              <EnterpriseCard className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg mx-auto mb-3"></div>
                <h4 className="font-semibold">Creative Theme</h4>
              </EnterpriseCard>
            </EnterpriseGrid>
          </div>
        </section>

        {/* White-Label Configuration */}
        <section id="white-label" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <Settings className="mr-2 text-slate-600" size={24} />
            White-Label Configuration
          </h2>
          
          <p className="text-slate-700 mb-6">
            Complete white-label customization allows you to present ProofPix as your own solution, 
            with your branding, domain, and custom messaging throughout the application.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Domain & URLs</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• <strong>Custom Domain:</strong> app.yourcompany.com</li>
                <li>• <strong>SSL Certificate:</strong> Automatically provisioned</li>
                <li>• <strong>API Subdomain:</strong> api.yourcompany.com</li>
                <li>• <strong>Documentation:</strong> docs.yourcompany.com</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Application Branding</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• <strong>Application Name:</strong> Your Product Name</li>
                <li>• <strong>Email Templates:</strong> Custom branded emails</li>
                <li>• <strong>Support Links:</strong> Your support channels</li>
                <li>• <strong>Footer Text:</strong> Your company information</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-semibold text-purple-900 mb-3">White-Label Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li className="flex items-center text-purple-700">
                  <CheckCircle className="mr-2" size={16} />
                  <span>Complete UI customization</span>
                </li>
                <li className="flex items-center text-purple-700">
                  <CheckCircle className="mr-2" size={16} />
                  <span>Custom domain mapping</span>
                </li>
                <li className="flex items-center text-purple-700">
                  <CheckCircle className="mr-2" size={16} />
                  <span>Branded email notifications</span>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-center text-purple-700">
                  <CheckCircle className="mr-2" size={16} />
                  <span>Custom support integration</span>
                </li>
                <li className="flex items-center text-purple-700">
                  <CheckCircle className="mr-2" size={16} />
                  <span>White-label documentation</span>
                </li>
                <li className="flex items-center text-purple-700">
                  <CheckCircle className="mr-2" size={16} />
                  <span>API endpoint customization</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* API Integration */}
        <section id="api-integration" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <Code className="mr-2 text-green-500" size={24} />
            API Integration
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Complete Branding Setup</h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
{`// Complete branding configuration
const setupCustomBranding = async (brandingConfig) => {
  // 1. Upload brand assets
  const assetResponse = await fetch('/api/v2/enterprise/branding/upload', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + apiKey },
    body: createBrandingFormData(brandingConfig.assets)
  });
  
  // 2. Configure colors and theme
  const colorResponse = await fetch('/api/v2/enterprise/branding/colors', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(brandingConfig.colors)
  });
  
  // 3. Set up white-label configuration
  const whitelabelResponse = await fetch('/api/v2/enterprise/branding/whitelabel', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      domain: brandingConfig.domain,
      applicationName: brandingConfig.appName,
      supportEmail: brandingConfig.supportEmail,
      customFooter: brandingConfig.footer
    })
  });
  
  return {
    assets: await assetResponse.json(),
    colors: await colorResponse.json(),
    whitelabel: await whitelabelResponse.json()
  };
};`}
            </pre>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-3">Request Format</h4>
                <div className="bg-slate-50 p-4 rounded text-sm">
                  <pre>{`{
    "assets": {
      "logoLight": File,
      "logoDark": File,
      "favicon": File
  },
  "colors": {
      "primary": "#2563eb",
      "secondary": "#4b5563",
      "accent": "#059669"
    },
    "domain": "app.company.com",
    "appName": "Company Analytics"
  }`}</pre>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Response Format</h4>
                <div className="bg-gray-50 p-4 rounded text-sm">
                  <pre>{`{
    "success": true,
    "brandingId": "brand_xyz789",
    "previewUrl": "https://preview.../xyz789",
    "status": "processing",
    "estimatedCompletion": "2024-01-01T12:30:00Z"
  }`}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preview & Testing */}
        <section id="preview" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Eye className="mr-2 text-blue-500" size={24} />
            Preview & Testing
          </h2>
          
          <p className="text-gray-700 mb-6">
            Test your custom branding before going live with our preview environment and staging deployment options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Eye className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Preview</h3>
              <p className="text-sm text-gray-600">
                Real-time preview of your branding changes in a sandbox environment
              </p>
            </div>

            <div className="border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Staging Deploy</h3>
              <p className="text-sm text-gray-600">
                Deploy to staging environment for team testing and approval
              </p>
            </div>
            
            <div className="border rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Production Deploy</h3>
              <p className="text-sm text-gray-600">
                One-click deployment to production with rollback capabilities
              </p>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Preview API</h3>
            <pre className="text-green-400 text-sm overflow-x-auto">
{`// Generate preview URL
const generatePreview = async (brandingId) => {
  const response = await fetch('/api/v2/enterprise/branding/preview', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      brandingId: brandingId,
      duration: '24h' // Preview expires in 24 hours
    })
  });
  
  const { previewUrl, expiresAt } = await response.json();
  return { previewUrl, expiresAt };
};

// Deploy to production
const deployToProduction = async (brandingId) => {
  const response = await fetch('/api/v2/enterprise/branding/deploy', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      brandingId: brandingId,
      environment: 'production'
    })
  });
  
  return response.json();
};`}
            </pre>
          </div>
        </section>

        {/* Footer navigation */}
        <nav className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link 
              to="/docs/ai-pricing" 
              className="flex items-center text-blue-600 hover:underline"
            >
              ← Previous: AI-Driven Pricing
            </Link>
            <Link 
              to="/docs/implementation-status" 
              className="flex items-center text-blue-600 hover:underline"
            >
              Next: Implementation Status →
              <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
        </nav>

        <DocumentationFooter />
      </div>
    </EnterpriseLayout>
  );
}; 