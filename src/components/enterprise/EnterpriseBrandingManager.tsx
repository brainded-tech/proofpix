import React, { useState, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Palette, 
  Type, 
  FileImage, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Download,
  Eye,
  Trash2,
  Plus,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';
import { 
  enterpriseBrandingValidator, 
  BrandAsset, 
  BrandingValidationResult,
  ComplianceCheck 
} from '../../utils/enterpriseBrandingValidator';

interface EnterpriseBrandingManagerProps {
  className?: string;
}

export const EnterpriseBrandingManager: React.FC<EnterpriseBrandingManagerProps> = ({ 
  className = '' 
}) => {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [validationResults, setValidationResults] = useState<Map<string, BrandingValidationResult>>(new Map());
  const [activeTab, setActiveTab] = useState<'assets' | 'validation' | 'compliance' | 'settings'>('assets');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<'all' | 'logo' | 'color' | 'font' | 'template'>('all');
  const [complianceReport, setComplianceReport] = useState<any>(null);

  // Load assets and validation results
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const brandAssets = enterpriseBrandingValidator.getBrandAssets();
      setAssets(brandAssets);
      
      // Load validation results for all assets
      const results = await enterpriseBrandingValidator.validateAllAssets();
      setValidationResults(results);
      
      // Generate compliance report
      const report = await enterpriseBrandingValidator.generateComplianceReport();
      setComplianceReport(report);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileUpload = useCallback(async (file: File, type: BrandAsset['type'], name: string) => {
    setIsLoading(true);
    try {
      const assetId = await enterpriseBrandingValidator.addBrandAsset({
        type,
        name,
        value: file,
        metadata: {
          uploadedAt: new Date().toISOString(),
          fileSize: file.size,
          fileType: file.type
        }
      });
      
      await loadAssets();
      console.log(`✅ Asset ${name} uploaded successfully with ID: ${assetId}`);
    } catch (error) {
      console.error('Failed to upload asset:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadAssets]);

  const handleColorAdd = useCallback(async (color: string, name: string) => {
    setIsLoading(true);
    try {
      const assetId = await enterpriseBrandingValidator.addBrandAsset({
        type: 'color',
        name,
        value: color,
        metadata: {
          addedAt: new Date().toISOString(),
          colorFormat: 'hex'
        }
      });
      
      await loadAssets();
      console.log(`✅ Color ${name} added successfully with ID: ${assetId}`);
    } catch (error) {
      console.error('Failed to add color:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadAssets]);

  const handleAssetDelete = useCallback(async (assetId: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      const success = enterpriseBrandingValidator.deleteBrandAsset(assetId);
      if (success) {
        await loadAssets();
        console.log(`✅ Asset ${assetId} deleted successfully`);
      }
    }
  }, [loadAssets]);

  const getValidationIcon = (result?: BrandingValidationResult) => {
    if (!result) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    
    if (result.isValid) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (result.errors.some(e => e.severity === 'high')) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getAssetIcon = (type: BrandAsset['type']) => {
    switch (type) {
      case 'logo': return <FileImage className="w-5 h-5" />;
      case 'color': return <Palette className="w-5 h-5" />;
      case 'font': return <Type className="w-5 h-5" />;
      case 'template': return <FileImage className="w-5 h-5" />;
      default: return <FileImage className="w-5 h-5" />;
    }
  };

  const filteredAssets = selectedAssetType === 'all' 
    ? (assets || [])
    : (assets || []).filter(asset => asset.type === selectedAssetType);

  const renderAssetsTab = () => (
    <div className="space-y-6">
      {/* Asset Type Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'logo', 'color', 'font', 'template'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedAssetType(type as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedAssetType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Upload Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Asset</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AssetUploadCard
            type="logo"
            title="Upload Logo"
            description="SVG, PNG, or JPEG"
            onUpload={handleFileUpload}
          />
          <AssetUploadCard
            type="color"
            title="Add Color"
            description="Brand color palette"
            onColorAdd={handleColorAdd}
          />
          <AssetUploadCard
            type="font"
            title="Add Font"
            description="Typography assets"
            onUpload={handleFileUpload}
          />
          <AssetUploadCard
            type="template"
            title="Upload Template"
            description="Design templates"
            onUpload={handleFileUpload}
          />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const validationResult = validationResults.get(asset.id);
          return (
            <div key={asset.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getAssetIcon(asset.type)}
                  <span className="font-medium text-gray-900">{asset.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getValidationIcon(validationResult)}
                  <button
                    onClick={() => handleAssetDelete(asset.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Asset Preview */}
              <div className="mb-3">
                {asset.type === 'color' && typeof asset.value === 'string' && (
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: asset.value }}
                    />
                    <span className="text-sm font-mono text-gray-600">{asset.value}</span>
                  </div>
                )}
                {asset.type === 'logo' && asset.value instanceof File && (
                  <div className="text-sm text-gray-600">
                    {asset.value.name} ({(asset.value.size / 1024).toFixed(1)}KB)
                  </div>
                )}
              </div>

              {/* Validation Status */}
              {validationResult && (
                <div className="text-xs">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full ${
                    validationResult.isValid 
                      ? 'bg-green-100 text-green-800'
                      : validationResult.errors.some(e => e.severity === 'high')
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Score: {validationResult.score}/100
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderValidationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Validation Results</h3>
        
        {Array.from(validationResults.entries()).map(([assetId, result]) => {
          const asset = assets.find(a => a.id === assetId);
          if (!asset) return null;

          return (
            <div key={assetId} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{asset.name}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.score}/100
                </span>
              </div>

              {result.errors.length > 0 && (
                <div className="mb-2">
                  <h5 className="text-sm font-medium text-red-700 mb-1">Errors:</h5>
                  {result.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600 ml-2">
                      • {error.message}
                    </div>
                  ))}
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className="mb-2">
                  <h5 className="text-sm font-medium text-yellow-700 mb-1">Warnings:</h5>
                  {result.warnings.map((warning, index) => (
                    <div key={index} className="text-sm text-yellow-600 ml-2">
                      • {warning.message}
                    </div>
                  ))}
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-blue-700 mb-1">Suggestions:</h5>
                  {result.suggestions.map((suggestion, index) => (
                    <div key={index} className="text-sm text-blue-600 ml-2">
                      • {suggestion.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderComplianceTab = () => (
    <div className="space-y-6">
      {complianceReport && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Report</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{complianceReport.totalAssets}</div>
              <div className="text-sm text-blue-800">Total Assets</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{complianceReport.overallScore}%</div>
              <div className="text-sm text-green-800">Compliance Score</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(complianceReport.complianceByStandard).length}
              </div>
              <div className="text-sm text-purple-800">Standards Checked</div>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(complianceReport.complianceByStandard).map(([standard, counts]: [string, any]) => (
              <div key={standard} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">{standard} Compliance</h4>
                <div className="flex space-x-4 text-sm">
                  <span className="text-green-600">✓ {counts.pass} Passed</span>
                  <span className="text-yellow-600">⚠ {counts.warning} Warnings</span>
                  <span className="text-red-600">✗ {counts.fail} Failed</span>
                </div>
              </div>
            ))}
          </div>

          {complianceReport.recommendations.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {complianceReport.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={`enterprise-branding-manager ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Branding Manager</h1>
            <p className="text-gray-600">Manage and validate your brand assets</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadAssets}
              disabled={isLoading}
              className="btn btn-secondary btn-sm"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
            <button className="btn btn-primary btn-sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'assets', label: 'Assets', icon: FileImage },
            { id: 'validation', label: 'Validation', icon: CheckCircle },
            { id: 'compliance', label: 'Compliance', icon: Shield },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'assets' && renderAssetsTab()}
        {activeTab === 'validation' && renderValidationTab()}
        {activeTab === 'compliance' && renderComplianceTab()}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <p className="text-gray-600">Branding validation settings and preferences will be available here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Asset Upload Card Component
interface AssetUploadCardProps {
  type: BrandAsset['type'];
  title: string;
  description: string;
  onUpload?: (file: File, type: BrandAsset['type'], name: string) => void;
  onColorAdd?: (color: string, name: string) => void;
}

const AssetUploadCard: React.FC<AssetUploadCardProps> = ({
  type,
  title,
  description,
  onUpload,
  onColorAdd
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorValue, setColorValue] = useState('#3b82f6');
  const [colorName, setColorName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      const name = file.name.split('.')[0];
      onUpload(file, type, name);
    }
  };

  const handleColorSubmit = () => {
    if (colorName && onColorAdd) {
      onColorAdd(colorValue, colorName);
      setColorName('');
      setShowColorPicker(false);
    }
  };

  if (type === 'color') {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
        <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        
        {!showColorPicker ? (
          <button
            onClick={() => setShowColorPicker(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Color
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="color"
              value={colorValue}
              onChange={(e) => setColorValue(e.target.value)}
              className="w-full h-8 rounded border border-gray-300"
            />
            <input
              type="text"
              placeholder="Color name"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleColorSubmit}
                className="btn btn-primary btn-sm flex-1"
              >
                Add
              </button>
              <button
                onClick={() => setShowColorPicker(false)}
                className="btn btn-secondary btn-sm flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer">
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      <span className="btn btn-primary btn-sm">
        <Plus className="w-4 h-4 mr-1" />
        Upload
      </span>
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept={type === 'logo' ? 'image/*' : undefined}
      />
    </label>
  );
}; 