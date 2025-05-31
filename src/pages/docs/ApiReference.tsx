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
  Copy
} from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';

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
    <EnterpriseLayout
      showHero
      title="API Reference"
      description="Complete developer reference for ProofPix metadata extraction APIs"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <EnterpriseButton
          variant="ghost"
          onClick={handleBackHome}
          className="mb-6"
        >
          ← Back to ProofPix
        </EnterpriseButton>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-purple-600 p-3 rounded-lg">
            <Code className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">API Reference</h1>
            <p className="text-xl text-slate-600 mt-2">
              Complete developer reference for ProofPix metadata extraction APIs
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="neutral" icon={<Code className="enterprise-icon-sm" />}>
            Developer Documentation
          </EnterpriseBadge>
          <EnterpriseBadge variant="danger" icon={<Shield className="enterprise-icon-sm" />}>
            Privacy-focused
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<CheckCircle className="enterprise-icon-sm" />}>
            TypeScript Support
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* API Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">API Overview</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-lg text-gray-300 mb-6">
              ProofPix provides a comprehensive JavaScript API for extracting, processing, and exporting image metadata. 
              All operations are performed client-side with full TypeScript support and privacy protection.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-purple-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Code className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">TypeScript</h3>
                <p className="text-sm text-gray-400">Full type definitions</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Privacy-First</h3>
                <p className="text-sm text-gray-400">No network calls</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Zap className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">High Performance</h3>
                <p className="text-sm text-gray-400">Optimized algorithms</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Globe className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">Cross-Platform</h3>
                <p className="text-sm text-gray-400">Works everywhere</p>
              </div>
            </div>
          </div>
        </section>

        {/* API Modules */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">API Modules</h2>
          <div className="space-y-6">
            {apiModules.map((module, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600/20 p-3 rounded-lg flex-shrink-0">
                    {module.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{module.module}</h3>
                    <p className="text-gray-300 mb-4">{module.description}</p>
                    
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Available Functions</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {module.functions.map((func, funcIndex) => (
                          <li key={funcIndex} className="flex items-center font-mono">
                            <Code className="h-3 w-3 text-green-400 mr-2" />
                            {func}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core API Functions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Core API Functions</h2>
          <div className="space-y-8">
            {coreApis.map((api, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-400 font-mono">{api.name}</h3>
                    <p className="text-gray-300 mt-1">{api.description}</p>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-3">Parameters</h4>
                    <div className="space-y-2">
                      {api.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-mono text-sm text-blue-300">{param.name}</span>
                            <span className="text-xs text-gray-400">{param.type}</span>
                            {param.required && (
                              <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded">required</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{param.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold text-purple-400 mb-2">Returns</h4>
                      <span className="font-mono text-sm text-blue-300">{api.returns}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-3">Example Usage</h4>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-300">
                        <code>{api.example}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Data Types</h2>
          <div className="space-y-6">
            {dataTypes.map((type, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-400 font-mono">{type.name}</h3>
                    <p className="text-gray-300 mt-1">{type.description}</p>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {type.properties.map((prop, propIndex) => (
                    <div key={propIndex} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-sm text-green-300">{prop.name}</span>
                        <span className="text-xs text-gray-400">{prop.type}</span>
                      </div>
                      <p className="text-xs text-gray-400">{prop.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Error Handling</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              ProofPix APIs use structured error handling with specific error codes for different failure scenarios.
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Error Structure</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`interface ProofPixError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Example usage
try {
  const metadata = await extractMetadata(file);
} catch (error) {
  if (error.code === 'INVALID_FILE_TYPE') {
    // Handle invalid file type
  }
}`}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Common Error Codes</h3>
              <div className="space-y-3">
                {errorCodes.map((error, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-mono text-sm text-red-400">{error.code}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{error.description}</p>
                        <p className="text-gray-400 text-xs">
                          <strong>Solution:</strong> {error.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Complete Usage Examples</h2>
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Basic Metadata Extraction</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`import { extractMetadata, validateFileType } from 'proofpix-api';

async function processImage(file: File) {
  // Validate file first
  const validation = validateFileType(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  
  // Extract metadata
  const metadata = await extractMetadata(file, {
    includeGps: true,
    includeTechnical: true,
    sanitize: false
  });
  
  console.log('Camera:', metadata.camera);
  console.log('GPS:', metadata.gps);
  console.log('Timestamp:', metadata.timestamp);
  
  return metadata;
}`}
                </pre>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Generate PDF Report</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`import { extractMetadata, generatePdfReport, downloadFile } from 'proofpix-api';

async function createReport(file: File) {
  // Extract metadata
  const metadata = await extractMetadata(file);
  
  // Generate PDF report
  const pdfBlob = await generatePdfReport(metadata, {
    includeMap: true,
    includeCharts: true,
    template: 'professional',
    watermark: 'ProofPix Report'
  });
  
  // Download the report
  downloadFile(pdfBlob, \`\${metadata.fileName}_report.pdf\`);
}`}
                </pre>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Batch Processing</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{`import { extractMetadata, exportToJson } from 'proofpix-api';

async function processBatch(files: File[]) {
  const results = [];
  
  for (const file of files) {
    try {
      const metadata = await extractMetadata(file);
      results.push({
        fileName: file.name,
        success: true,
        metadata
      });
    } catch (error) {
      results.push({
        fileName: file.name,
        success: false,
        error: error.message
      });
    }
  }
  
  // Export batch results
  const jsonBlob = exportToJson(results);
  downloadFile(jsonBlob, 'batch_results.json');
  
  return results;
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Authentication & Session Management</h2>
          <div className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Session-Based Authentication (No Account Required)</h3>
              <p className="text-gray-300 mb-4">
                ProofPix offers session-based passes that provide instant access without requiring user accounts. 
                Perfect for privacy-focused workflows and one-time usage.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-green-400">Day Pass ($2.99)</h4>
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-gray-300">
{`// Purchase Day Pass
const session = await purchaseSession('daypass');

// Use session token for API calls
const metadata = await extractMetadata(file, {
  sessionToken: session.token,
  duration: '24h'
});

// Session automatically expires after 24 hours`}
                    </pre>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Unlimited photos for 24 hours</li>
                    <li>• Batch processing (up to 10 images)</li>
                    <li>• No account registration required</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-400">Week Pass ($9.99)</h4>
                  <div className="bg-gray-900 rounded-lg p-3 mb-3">
                    <pre className="text-sm text-gray-300">
{`// Purchase Week Pass
const session = await purchaseSession('weekpass');

// Enhanced session with priority processing
const metadata = await extractMetadata(file, {
  sessionToken: session.token,
  priority: true,
  duration: '7d'
});

// Session expires after 7 days`}
                    </pre>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Unlimited photos for 7 days</li>
                    <li>• Batch processing (up to 25 images)</li>
                    <li>• Priority processing queue</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Account-Based Authentication</h3>
              <p className="text-gray-300 mb-4">
                Subscription plans require simple email signup and provide ongoing access with usage tracking.
              </p>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-300">
{`// Initialize with API key (requires account)
import { ProofPixAPI } from 'proofpix-api';

const api = new ProofPixAPI({
  apiKey: 'your-api-key',
  plan: 'pro' // starter, pro, or enterprise
});

// All API calls automatically authenticated
const metadata = await api.extractMetadata(file);
const report = await api.generatePdfReport(metadata);

// Usage tracking included
const usage = await api.getUsageStats();
console.log(\`Used \${usage.imagesProcessed}/\${usage.limit} images this month\`);`}
                </pre>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h5 className="font-semibold text-yellow-400 mb-2">Starter ($4.99/month)</h5>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• 25 images per session</li>
                    <li>• 5 PDF exports/day</li>
                    <li>• Enhanced analytics</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h5 className="font-semibold text-purple-400 mb-2">Pro ($9.99/month)</h5>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• 50 images per session</li>
                    <li>• Unlimited exports</li>
                    <li>• Full analytics suite</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <h5 className="font-semibold text-yellow-400 mb-2">Enterprise (Custom)</h5>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Unlimited everything</li>
                    <li>• API access</li>
                    <li>• Custom templates</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-400">Session Management Examples</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Check Session Status</h4>
                  <pre className="text-sm text-gray-300">
{`// Check if session is still valid
const sessionStatus = await checkSessionStatus(sessionToken);

if (sessionStatus.isValid) {
  console.log(\`Session expires in: \${sessionStatus.timeRemaining}\`);
  console.log(\`Images processed: \${sessionStatus.usage.images}\`);
} else {
  // Redirect to purchase new session
  window.location.href = '/pricing';
}`}
                  </pre>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Handle Session Expiry</h4>
                  <pre className="text-sm text-gray-300">
{`// Graceful session expiry handling
try {
  const metadata = await extractMetadata(file, { sessionToken });
} catch (error) {
  if (error.code === 'SESSION_EXPIRED') {
    // Show upgrade prompt
    showUpgradeModal({
      message: 'Your session has expired',
      options: ['daypass', 'weekpass', 'starter']
    });
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Requirements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <Shield className="h-8 w-8 text-red-400 mr-3" />
            Security Requirements
          </h2>
          
          <div className="space-y-6">
            {/* Enterprise Security Overview */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Enterprise Security Standards</h3>
              <p className="text-gray-300 mb-4">
                ProofPix API implements enterprise-grade security controls for organizations with strict compliance requirements.
                All API endpoints follow security best practices and regulatory compliance standards.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Data Protection</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Zero server-side storage</li>
                    <li>• Client-side processing only</li>
                    <li>• Automatic memory cleanup</li>
                    <li>• No data transmission</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Authentication</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• OAuth 2.0 / JWT tokens</li>
                    <li>• API key rotation</li>
                    <li>• Session management</li>
                    <li>• Rate limiting</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Compliance</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• GDPR compliant</li>
                    <li>• CCPA compliant</li>
                    <li>• HIPAA ready</li>
                    <li>• SOC 2 in progress</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* API Security Controls */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">API Security Controls</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-white">Authentication & Authorization</h4>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm text-gray-300">
{`// Required headers for all API requests
const headers = {
  'Authorization': 'Bearer your-jwt-token',
  'X-API-Key': 'your-api-key',
  'Content-Type': 'application/json',
  'X-Client-Version': '1.8.0'
};

// Enterprise customers: IP whitelisting
const config = {
  allowedIPs: ['192.168.1.0/24', '10.0.0.0/8'],
  requireMFA: true,
  sessionTimeout: 3600 // 1 hour
};`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-white">Rate Limiting & Quotas</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-600 rounded-lg">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Plan</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Rate Limit</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Burst Limit</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-200">Monthly Quota</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-600">
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-300">Free</td>
                          <td className="px-4 py-3 text-sm text-gray-400">10 req/min</td>
                          <td className="px-4 py-3 text-sm text-gray-400">20 req/min</td>
                          <td className="px-4 py-3 text-sm text-gray-400">5 images/session</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-300">Starter</td>
                          <td className="px-4 py-3 text-sm text-gray-400">60 req/min</td>
                          <td className="px-4 py-3 text-sm text-gray-400">100 req/min</td>
                          <td className="px-4 py-3 text-sm text-gray-400">25 images/session</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-300">Pro</td>
                          <td className="px-4 py-3 text-sm text-gray-400">120 req/min</td>
                          <td className="px-4 py-3 text-sm text-gray-400">200 req/min</td>
                          <td className="px-4 py-3 text-sm text-gray-400">50 images/session</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-300">Enterprise</td>
                          <td className="px-4 py-3 text-sm text-gray-400">Custom</td>
                          <td className="px-4 py-3 text-sm text-gray-400">Custom</td>
                          <td className="px-4 py-3 text-sm text-gray-400">Unlimited</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-white">Security Headers & Validation</h4>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm text-gray-300">
{`// Required security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Input validation requirements
const validation = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/tiff', 'image/heic'],
  maxFilesPerRequest: 10,
  sanitizeFilenames: true,
  validateFileHeaders: true
};`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Requirements */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Compliance Requirements</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-white">GDPR Compliance</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Data processing lawful basis documented</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Right to erasure implemented (automatic)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Data portability supported (JSON export)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Privacy by design architecture</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-white">HIPAA Requirements</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Business Associate Agreement available</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Administrative safeguards implemented</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Technical safeguards (encryption, access controls)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Physical safeguards (no server storage)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Incident Response */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Security Incident Response</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2">Critical (1 hour)</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Data breach</li>
                    <li>• System compromise</li>
                    <li>• Service unavailability</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    Immediate notification to security@proofpixapp.com
                  </p>
                </div>
                
                <div className="bg-yellow-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">High (4 hours)</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• API vulnerabilities</li>
                    <li>• Authentication issues</li>
                    <li>• Performance degradation</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    Response within 4 hours during business hours
                  </p>
                </div>
                
                <div className="bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Medium (24 hours)</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Documentation issues</li>
                    <li>• Minor bugs</li>
                    <li>• Feature requests</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Integration Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Installation</h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-300">
{`npm install proofpix-api
# or
yarn add proofpix-api`}
                </pre>
              </div>
              <p className="text-sm text-gray-400">
                Install the ProofPix API package via npm or yarn for easy integration.
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Import</h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-300">
{`import { 
  extractMetadata,
  generatePdfReport,
  validateFileType 
} from 'proofpix-api';`}
                </pre>
              </div>
              <p className="text-sm text-gray-400">
                Import only the functions you need for optimal bundle size.
              </p>
            </div>
          </div>
        </section>

        {/* Performance Considerations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Performance Considerations</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Best Practices</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use Web Workers for large file processing</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Validate files before processing</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Process files in batches for better UX</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Clear memory after processing</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Limitations</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <Settings className="h-5 w-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Maximum file size: 50MB</span>
                  </li>
                  <li className="flex items-start">
                    <Settings className="h-5 w-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Browser memory limitations apply</span>
                  </li>
                  <li className="flex items-start">
                    <Settings className="h-5 w-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Processing time varies by file size</span>
                  </li>
                  <li className="flex items-start">
                    <Settings className="h-5 w-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Some mobile browsers have restrictions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Documentation */}
        <div className="text-center">
          <button
            onClick={() => navigate('/docs')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Back to Documentation Hub
          </button>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default ApiReference; 