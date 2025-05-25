import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Key, 
  Zap, 
  Shield, 
  Globe, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Mail,
  FileText,
  Terminal,
  Database,
  Settings
} from 'lucide-react';

const ApiDocs: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleContactEnterprise = () => {
    window.location.href = 'mailto:enterprise@proofpixapp.com?subject=API Access Request';
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/extract',
      description: 'Extract metadata from uploaded image',
      params: ['file (multipart/form-data)', 'format (optional)'],
      response: 'JSON object with extracted metadata'
    },
    {
      method: 'POST',
      path: '/api/clean',
      description: 'Remove specified metadata fields',
      params: ['file (multipart/form-data)', 'fields (array)'],
      response: 'Cleaned image file'
    },
    {
      method: 'POST',
      path: '/api/batch',
      description: 'Process multiple images',
      params: ['files (array)', 'operation (extract|clean)'],
      response: 'Array of results'
    }
  ];

  const sdks = [
    {
      language: 'JavaScript/Node.js',
      icon: <Code className="h-5 w-5 text-yellow-400" />,
      status: 'Available',
      description: 'Full-featured SDK with TypeScript support'
    },
    {
      language: 'Python',
      icon: <Code className="h-5 w-5 text-blue-400" />,
      status: 'Available',
      description: 'Pythonic interface with async support'
    },
    {
      language: 'PHP',
      icon: <Code className="h-5 w-5 text-purple-400" />,
      status: 'Available',
      description: 'PSR-compliant library'
    },
    {
      language: 'cURL',
      icon: <Terminal className="h-5 w-5 text-green-400" />,
      status: 'Examples',
      description: 'Command-line examples and scripts'
    }
  ];

  const features = [
    {
      title: 'High Performance',
      description: 'Process thousands of images per hour',
      icon: <Zap className="h-6 w-6 text-yellow-400" />
    },
    {
      title: 'Secure by Design',
      description: 'API keys, rate limiting, and audit logs',
      icon: <Shield className="h-6 w-6 text-green-400" />
    },
    {
      title: 'Global CDN',
      description: 'Low latency worldwide',
      icon: <Globe className="h-6 w-6 text-blue-400" />
    },
    {
      title: 'Real-time Processing',
      description: 'Instant metadata extraction',
      icon: <Clock className="h-6 w-6 text-purple-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBackHome}
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            ← Back to ProofPix
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-green-600 p-3 rounded-lg">
              <Code className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">ProofPix API Documentation</h1>
              <p className="text-xl text-gray-300 mt-2">
                Enterprise-grade API for automated photo metadata processing
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Enterprise only
            </span>
            <span className="flex items-center">
              <Key className="h-4 w-4 mr-1" />
              API key required
            </span>
            <span className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              High performance
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enterprise Notice */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center space-x-4 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <h2 className="text-2xl font-bold">Enterprise API Access</h2>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              The ProofPix API is available exclusively to enterprise customers. Contact our enterprise team 
              to discuss your requirements and get access to our powerful metadata processing API.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContactEnterprise}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Mail className="h-5 w-5 mr-2" />
                Request API Access
              </button>
              
              <button
                onClick={() => navigate('/pricing')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <FileText className="h-5 w-5 mr-2" />
                View Enterprise Pricing
              </button>
            </div>
          </div>
        </section>

        {/* API Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">API Overview</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-700 p-4 rounded-lg mb-3 inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Authentication</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Key className="h-5 w-5 mr-3 text-yellow-400" />
                  API Key Required
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Include API key in Authorization header
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Rate limiting: 1000 requests/hour
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    HTTPS only for security
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-3 text-blue-400" />
                  Request Format
                </h3>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <code className="text-sm text-green-400">
                    Authorization: Bearer YOUR_API_KEY<br/>
                    Content-Type: multipart/form-data
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">API Endpoints</h2>
          <div className="space-y-6">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 rounded text-xs font-bold ${
                    endpoint.method === 'POST' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono text-blue-400">{endpoint.path}</code>
                </div>
                
                <p className="text-gray-300 mb-4">{endpoint.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-yellow-400">Parameters:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {endpoint.params.map((param, paramIndex) => (
                        <li key={paramIndex}>• {param}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-green-400">Response:</h4>
                    <p className="text-sm text-gray-300">{endpoint.response}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SDKs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">SDKs Available</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sdks.map((sdk, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  {sdk.icon}
                  <h3 className="text-xl font-semibold">{sdk.language}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    sdk.status === 'Available' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                  }`}>
                    {sdk.status}
                  </span>
                </div>
                <p className="text-gray-300">{sdk.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Enterprise Features</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-3 text-yellow-400" />
                  Performance & Scale
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Dedicated processing capacity
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Higher rate limits
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Batch processing optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Priority queue processing
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-3 text-green-400" />
                  Security & Support
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Webhook notifications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Custom processing rules
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Dedicated support channel
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    SLA guarantees
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact for Access */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-6">
              Contact our enterprise team to discuss your API requirements, get pricing information, 
              and receive your API credentials.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContactEnterprise}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Enterprise Team
              </button>
              
              <button
                onClick={() => navigate('/docs/getting-started')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <FileText className="h-5 w-5 mr-2" />
                View Getting Started Guide
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApiDocs; 