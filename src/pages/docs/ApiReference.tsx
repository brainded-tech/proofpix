import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Shield, 
  Zap, 
  Database, 
  Globe, 
  FileText,
  Settings,
  Download,
  Upload,
  Eye,
  CheckCircle,
  ArrowRight,
  Copy,
  ArrowLeft
} from 'lucide-react';
import { ConsistentLayout } from '../../components/ui/ConsistentLayout';

const ApiReference: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const apiModules = [
    {
      module: 'Metadata Extraction',
      description: 'Core functions for extracting EXIF and metadata from images',
      icon: <Eye className="h-6 w-6" />,
      functions: [
        'extractMetadata(file: File)',
        'parseExifData(buffer: ArrayBuffer)',
        'getGpsCoordinates(exifData: object)',
        'getCameraSettings(exifData: object)'
      ]
    },
    {
      module: 'File Processing',
      description: 'Utilities for handling and validating image files',
      icon: <Upload className="h-6 w-6" />,
      functions: [
        'validateFileType(file: File)',
        'validateFileSize(file: File, maxSize: number)',
        'readFileAsArrayBuffer(file: File)',
        'createImagePreview(file: File)'
      ]
    },
    {
      module: 'Data Export',
      description: 'Functions for exporting metadata and generating reports',
      icon: <Download className="h-6 w-6" />,
      functions: [
        'generatePdfReport(metadata: object)',
        'exportToJson(metadata: object)',
        'createEnhancedImage(file: File, options: object)',
        'downloadFile(data: Blob, filename: string)'
      ]
    },
    {
      module: 'Privacy Utils',
      description: 'Privacy-focused utilities for data handling',
      icon: <Shield className="h-6 w-6" />,
      functions: [
        'clearMemory()',
        'validateNoNetworkCalls()',
        'sanitizeMetadata(metadata: object)',
        'removePersonalData(metadata: object)'
      ]
    }
  ];

  const coreApis = [
    {
      name: 'extractMetadata',
      description: 'Extracts all available metadata from an image file',
      parameters: [
        { name: 'file', type: 'File', required: true, description: 'The image file to process' },
        { name: 'options', type: 'ExtractionOptions', required: false, description: 'Optional extraction settings' }
      ],
      returns: 'Promise<MetadataResult>',
      example: `const metadata = await extractMetadata(imageFile, {
  includeGps: true,
  includeTechnical: true,
  includeTimestamp: true
});`
    },
    {
      name: 'generatePdfReport',
      description: 'Creates a professional PDF report from metadata',
      parameters: [
        { name: 'metadata', type: 'MetadataResult', required: true, description: 'Extracted metadata object' },
        { name: 'options', type: 'ReportOptions', required: false, description: 'Report formatting options' }
      ],
      returns: 'Promise<Blob>',
      example: `const pdfBlob = await generatePdfReport(metadata, {
  includeMap: true,
  includeCharts: true,
  template: 'professional'
});`
    },
    {
      name: 'validateFileType',
      description: 'Validates if a file is a supported image format',
      parameters: [
        { name: 'file', type: 'File', required: true, description: 'File to validate' }
      ],
      returns: 'ValidationResult',
      example: `const validation = validateFileType(file);
if (validation.isValid) {
  // Process the file
} else {
  console.error(validation.error);
}`
    }
  ];

  const dataTypes = [
    {
      name: 'MetadataResult',
      description: 'Complete metadata extraction result',
      properties: [
        { name: 'fileName', type: 'string', description: 'Original file name' },
        { name: 'fileSize', type: 'number', description: 'File size in bytes' },
        { name: 'dimensions', type: 'ImageDimensions', description: 'Image width and height' },
        { name: 'camera', type: 'CameraData', description: 'Camera and technical settings' },
        { name: 'gps', type: 'GpsData', description: 'GPS coordinates and location data' },
        { name: 'timestamp', type: 'TimestampData', description: 'Creation and modification dates' },
        { name: 'technical', type: 'TechnicalData', description: 'Technical EXIF data' }
      ]
    },
    {
      name: 'ExtractionOptions',
      description: 'Configuration options for metadata extraction',
      properties: [
        { name: 'includeGps', type: 'boolean', description: 'Extract GPS coordinates (default: true)' },
        { name: 'includeTechnical', type: 'boolean', description: 'Extract technical data (default: true)' },
        { name: 'includeTimestamp', type: 'boolean', description: 'Extract timestamp data (default: true)' },
        { name: 'sanitize', type: 'boolean', description: 'Remove personal data (default: false)' }
      ]
    },
    {
      name: 'ValidationResult',
      description: 'File validation result',
      properties: [
        { name: 'isValid', type: 'boolean', description: 'Whether the file is valid' },
        { name: 'error', type: 'string | null', description: 'Error message if invalid' },
        { name: 'mimeType', type: 'string', description: 'Detected MIME type' },
        { name: 'supportedFeatures', type: 'string[]', description: 'Available features for this file type' }
      ]
    }
  ];

  const errorCodes = [
    { code: 'INVALID_FILE_TYPE', description: 'File type not supported', solution: 'Use JPEG, PNG, TIFF, or HEIC files' },
    { code: 'FILE_TOO_LARGE', description: 'File exceeds size limit', solution: 'Reduce file size or use compression' },
    { code: 'NO_METADATA', description: 'No metadata found in file', solution: 'File may not contain EXIF data' },
    { code: 'CORRUPTED_FILE', description: 'File appears to be corrupted', solution: 'Try with a different file' },
    { code: 'PROCESSING_ERROR', description: 'Error during metadata extraction', solution: 'Check file integrity and try again' }
  ];

  return (
    <ConsistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-purple-600 p-3 rounded-lg mr-4">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                    API Reference
                  </h1>
                  <p className="text-xl text-purple-100 mt-2">
                    Complete developer reference for ProofPix metadata extraction APIs
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/50 flex items-center">
                  <Code className="h-4 w-4 text-slate-400 mr-2" />
                  <span className="text-slate-300">JavaScript API</span>
                </div>
                <div className="bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/50 flex items-center">
                  <Shield className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-purple-300">Client-side only</span>
                </div>
                <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/50 flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-blue-300">No server required</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Navigation */}
          <button
            onClick={handleBackHome}
            className="mb-12 bg-slate-800/50 text-white hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors border border-slate-600/50 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to ProofPix
          </button>

          {/* API Modules Overview */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">API Modules</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {apiModules.map((module, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-purple-400 mr-3">{module.icon}</div>
                    <h3 className="text-xl font-bold text-white">{module.module}</h3>
                  </div>
                  <p className="text-slate-300 mb-4">{module.description}</p>
                  <div className="space-y-2">
                    {module.functions.map((func, funcIndex) => (
                      <div key={funcIndex} className="bg-slate-700/50 rounded-lg p-2">
                        <code className="text-sm text-green-400">{func}</code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Core APIs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Core APIs</h2>
            <div className="space-y-8">
              {coreApis.map((api, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">{api.name}</h3>
                    <div className="bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/50">
                      <span className="text-purple-300 text-sm">Function</span>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-6">{api.description}</p>
                  
                  {/* Parameters */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Parameters</h4>
                    <div className="space-y-2">
                      {api.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <code className="text-blue-400 mr-2">{param.name}</code>
                            <span className="text-green-400 text-sm">{param.type}</span>
                            {param.required && (
                              <span className="ml-2 bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs">Required</span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm">{param.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Returns */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Returns</h4>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <code className="text-green-400">{api.returns}</code>
                    </div>
                  </div>

                  {/* Example */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Example</h4>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/50">
                      <pre className="text-green-400 text-sm overflow-x-auto">
                        <code>{api.example}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Data Types */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Data Types</h2>
            <div className="space-y-8">
              {dataTypes.map((type, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">{type.name}</h3>
                    <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/50">
                      <span className="text-blue-300 text-sm">Interface</span>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-6">{type.description}</p>
                  
                  <div className="space-y-3">
                    {type.properties.map((prop, propIndex) => (
                      <div key={propIndex} className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <code className="text-blue-400 mr-2">{prop.name}</code>
                          <span className="text-green-400 text-sm">{prop.type}</span>
                        </div>
                        <p className="text-slate-400 text-sm">{prop.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Error Codes */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Error Codes</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
              <div className="space-y-4">
                {errorCodes.map((error, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-red-400 font-semibold">{error.code}</code>
                      <div className="bg-red-500/20 px-2 py-1 rounded text-red-400 text-xs">Error</div>
                    </div>
                    <p className="text-slate-300 mb-2">{error.description}</p>
                    <p className="text-slate-400 text-sm">
                      <strong>Solution:</strong> {error.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Authentication and Session Management - Updated Pricing */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Authentication and Session Management</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Current Pricing (2024)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Starter Plan</h4>
                    <div className="text-2xl font-bold text-green-400 mb-1">$29/month</div>
                    <p className="text-slate-400 text-sm">Up to 1,000 API calls/month</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Professional Plan</h4>
                    <div className="text-2xl font-bold text-green-400 mb-1">$99/month</div>
                    <p className="text-slate-400 text-sm">Up to 10,000 API calls/month</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Enterprise Plan</h4>
                    <div className="text-2xl font-bold text-green-400 mb-1">Custom</div>
                    <p className="text-slate-400 text-sm">Unlimited API calls + SLA</p>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 mb-4">
                ProofPix operates entirely client-side, so traditional authentication is not required for basic usage. 
                However, enterprise features and API access require authentication.
              </p>
              
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Enterprise API Access</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
                  <code>{`// Initialize with API key
const proofpix = new ProofPixAPI({
  apiKey: 'your-enterprise-api-key',
  endpoint: 'https://api.proofpixapp.com/v1'
});

// Authenticate session
await proofpix.authenticate();`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Get Started CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Building?</h2>
              <p className="text-xl text-purple-100 mb-6">
                Get started with ProofPix APIs and build powerful metadata extraction features
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleBackHome}
                  className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
                >
                  Try Live Demo
                </button>
                <button
                  onClick={() => navigate('/docs')}
                  className="border border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
                >
                  View All Docs
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ConsistentLayout>
  );
};

export default ApiReference; 