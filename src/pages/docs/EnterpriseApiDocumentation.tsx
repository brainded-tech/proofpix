import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Zap, Globe, Lock, Clock, Users } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

const EnterpriseApiDocumentation: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  return (
    <EnterpriseLayout
      showHero
      title="Enterprise API Documentation"
      description="Comprehensive API reference for enterprise integration"
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
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Enterprise API Documentation</h1>
            <p className="text-xl text-slate-600 mt-2">
              Comprehensive API reference for enterprise integration
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary">
            Version 2.0 (Enterprise)
          </EnterpriseBadge>
          <EnterpriseBadge variant="success">
            SOC 2 Compliant
          </EnterpriseBadge>
          <EnterpriseBadge variant="primary">
            GDPR Ready
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            ProofPix Enterprise API Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive API reference for enterprise integration and automation
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Start</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Authentication</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-sm text-green-400 overflow-x-auto">
{`curl -X POST https://api.proofpixapp.com/v2/auth \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "your_enterprise_api_key",
    "secret": "your_enterprise_secret"
  }'`}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">First API Call</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-sm text-green-400 overflow-x-auto">
{`curl -X POST https://api.proofpixapp.com/v2/analyze \\
  -H "Authorization: Bearer {token}" \\
  -H "Content-Type: multipart/form-data" \\
  -F "image=@photo.jpg"`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* API Overview */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">API Overview</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-sm text-gray-400">API Uptime SLA</div>
            </div>
            <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="text-3xl font-bold text-green-400 mb-2">&lt;200ms</div>
              <div className="text-sm text-gray-400">Average Response Time</div>
            </div>
            <div className="text-center p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="text-3xl font-bold text-purple-400 mb-2">10,000</div>
              <div className="text-sm text-gray-400">Requests/minute (Enterprise)</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Enterprise API Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Batch Processing</div>
                  <div className="text-sm text-gray-400">Process up to 1,000 images per request</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Webhook Integration</div>
                  <div className="text-sm text-gray-400">Real-time notifications for processing completion</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Custom Metadata Extraction</div>
                  <div className="text-sm text-gray-400">Configure specific metadata fields for your use case</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Audit Logging</div>
                  <div className="text-sm text-gray-400">Complete audit trail for compliance requirements</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">Priority Processing</div>
                  <div className="text-sm text-gray-400">Guaranteed processing times for enterprise customers</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-white">White-label Integration</div>
                  <div className="text-sm text-gray-400">Embed ProofPix processing in your applications</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Authentication</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Enterprise API Keys</h3>
              <p className="text-gray-300 mb-4">
                Enterprise customers receive dedicated API keys with enhanced security and monitoring capabilities.
              </p>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-white mb-2">Request Access Token</h4>
                <pre className="text-sm text-green-400 overflow-x-auto">
{`POST /v2/auth/token
Content-Type: application/json

{
  "api_key": "pk_enterprise_1234567890abcdef",
  "secret": "sk_enterprise_abcdef1234567890",
  "scope": ["analyze", "batch", "webhooks"],
  "expires_in": 3600
}`}
                </pre>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Response</h4>
                <pre className="text-sm text-blue-400 overflow-x-auto">
{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": ["analyze", "batch", "webhooks"],
  "rate_limit": {
    "requests_per_minute": 10000,
    "concurrent_requests": 100
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-white">JWT Token Security</div>
                      <div className="text-sm text-gray-400">Signed tokens with configurable expiration</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-white">IP Whitelisting</div>
                      <div className="text-sm text-gray-400">Restrict API access to specific IP ranges</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-white">Rate Limiting</div>
                      <div className="text-sm text-gray-400">Configurable rate limits per API key</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-white">Audit Logging</div>
                      <div className="text-sm text-gray-400">Complete audit trail of all API calls</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-white">Webhook Signatures</div>
                      <div className="text-sm text-gray-400">HMAC-SHA256 signed webhook payloads</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-white">TLS 1.3 Encryption</div>
                      <div className="text-sm text-gray-400">End-to-end encryption for all communications</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Endpoints */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Core API Endpoints</h2>
          
          <div className="space-y-8">
            {/* Single Image Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Single Image Analysis</h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm font-medium">POST</span>
                  <span className="text-gray-300 font-mono">/v2/analyze</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Extract comprehensive metadata from a single image file.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Request</h4>
                    <pre className="text-sm text-green-400 overflow-x-auto">
{`curl -X POST https://api.proofpixapp.com/v2/analyze \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: multipart/form-data" \\
  -F "image=@photo.jpg" \\
  -F "extract_gps=true" \\
  -F "extract_camera_info=true" \\
  -F "format=json"`}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Response</h4>
                    <pre className="text-sm text-blue-400 overflow-x-auto">
{`{
  "id": "analysis_1234567890",
  "status": "completed",
  "metadata": {
    "exif": {
      "camera": "Canon EOS R5",
      "lens": "RF 24-70mm f/2.8L IS USM",
      "iso": 400,
      "aperture": "f/2.8",
      "shutter_speed": "1/250",
      "focal_length": "50mm"
    },
    "gps": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "altitude": 52.3,
      "timestamp": "2024-01-15T14:30:00Z"
    },
    "file_info": {
      "size": 8394752,
      "format": "JPEG",
      "dimensions": "6000x4000",
      "color_space": "sRGB"
    }
  },
  "processing_time_ms": 145,
  "timestamp": "2024-01-15T14:30:15Z"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Processing */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Batch Processing</h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm font-medium">POST</span>
                  <span className="text-gray-300 font-mono">/v2/batch</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Process up to 1,000 images in a single request with webhook notifications.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Request</h4>
                    <pre className="text-sm text-green-400 overflow-x-auto">
{`curl -X POST https://api.proofpixapp.com/v2/batch \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "images": [
      {"url": "https://example.com/image1.jpg", "id": "img_001"},
      {"url": "https://example.com/image2.jpg", "id": "img_002"}
    ],
    "webhook_url": "https://your-app.com/webhooks/proofpix",
    "options": {
      "extract_gps": true,
      "extract_camera_info": true,
      "priority": "high"
    }
  }'`}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Response</h4>
                    <pre className="text-sm text-blue-400 overflow-x-auto">
{`{
  "batch_id": "batch_1234567890",
  "status": "processing",
  "total_images": 2,
  "estimated_completion": "2024-01-15T14:35:00Z",
  "webhook_url": "https://your-app.com/webhooks/proofpix",
  "created_at": "2024-01-15T14:30:00Z"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SDKs and Libraries */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">SDKs and Libraries</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">JavaScript/Node.js</h3>
              <pre className="text-sm text-green-400 mb-3">
{`npm install @proofpix/sdk`}
              </pre>
              <pre className="text-sm text-blue-400">
{`import ProofPix from '@proofpix/sdk';

const client = new ProofPix({
  apiKey: 'your_api_key',
  secret: 'your_secret'
});

const result = await client.analyze('image.jpg');`}
              </pre>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Python</h3>
              <pre className="text-sm text-green-400 mb-3">
{`pip install proofpix-python`}
              </pre>
              <pre className="text-sm text-blue-400">
{`from proofpix import ProofPixClient

client = ProofPixClient(
    api_key='your_api_key',
    secret='your_secret'
)

result = client.analyze('image.jpg')`}
              </pre>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">.NET</h3>
              <pre className="text-sm text-green-400 mb-3">
{`dotnet add package ProofPix.SDK`}
              </pre>
              <pre className="text-sm text-blue-400">
{`using ProofPix;

var client = new ProofPixClient(
    "your_api_key", 
    "your_secret"
);

var result = await client.AnalyzeAsync("image.jpg");`}
              </pre>
            </div>
          </div>
        </div>

        {/* Enterprise Support */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Enterprise Support</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support Tiers</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">Enterprise Standard</h4>
                    <span className="text-sm text-gray-400">Included</span>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 24/7 email support</li>
                    <li>• 4-hour response time</li>
                    <li>• Technical documentation</li>
                    <li>• API status page access</li>
                  </ul>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">Enterprise Premium</h4>
                    <span className="text-sm text-green-400">Available</span>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 24/7 phone & email support</li>
                    <li>• 15-minute critical response</li>
                    <li>• Dedicated success manager</li>
                    <li>• Custom integration support</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Technical Support</h4>
                  <p className="text-gray-400 text-sm mb-2">For API and integration questions</p>
                  <p className="text-blue-400">enterprise-support@proofpixapp.com</p>
                  <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Sales & Partnerships</h4>
                  <p className="text-gray-400 text-sm mb-2">For enterprise sales and partnerships</p>
                  <p className="text-blue-400">enterprise-sales@proofpixapp.com</p>
                  <p className="text-gray-400 text-sm">+1 (555) 123-4568</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </EnterpriseLayout>
  );
};

export default EnterpriseApiDocumentation; 