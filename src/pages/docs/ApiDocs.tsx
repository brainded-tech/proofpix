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
  Mail,
  FileText,
  Terminal,
  Settings
} from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';

const ApiDocs: React.FC = () => {
  const navigate = useNavigate();

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
      icon: <Code className="h-5 w-5 text-yellow-500" />,
      status: 'Available',
      description: 'Full-featured SDK with TypeScript support'
    },
    {
      language: 'Python',
      icon: <Code className="h-5 w-5 text-blue-500" />,
      status: 'Available',
      description: 'Pythonic interface with async support'
    },
    {
      language: 'PHP',
      icon: <Code className="h-5 w-5 text-purple-500" />,
      status: 'Available',
      description: 'PSR-compliant library'
    },
    {
      language: 'cURL',
      icon: <Terminal className="h-5 w-5 text-green-500" />,
      status: 'Examples',
      description: 'Command-line examples and scripts'
    }
  ];

  const features = [
    {
      title: 'High Performance',
      description: 'Process thousands of images per hour',
      icon: <Zap className="h-6 w-6 text-yellow-500" />
    },
    {
      title: 'Secure by Design',
      description: 'API keys, rate limiting, and audit logs',
      icon: <Shield className="h-6 w-6 text-green-500" />
    },
    {
      title: 'Global CDN',
      description: 'Low latency worldwide',
      icon: <Globe className="h-6 w-6 text-blue-500" />
    },
    {
      title: 'Real-time Processing',
      description: 'Instant metadata extraction',
      icon: <Clock className="h-6 w-6 text-purple-500" />
    }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="ProofPix API Documentation"
      description="Enterprise-grade API for automated photo metadata processing"
      maxWidth="7xl"
    >
      {/* Hero Section with Badges */}
      <EnterpriseSection size="lg" className="text-center">
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-6">
            <EnterpriseBadge variant="danger" icon={<Shield className="enterprise-icon-sm" />}>Enterprise only</EnterpriseBadge>
            <EnterpriseBadge variant="warning" icon={<Key className="enterprise-icon-sm" />}>API key required</EnterpriseBadge>
            <EnterpriseBadge variant="success" icon={<Zap className="enterprise-icon-sm" />}>High performance</EnterpriseBadge>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="bg-green-100 p-3 rounded-lg">
            <Code className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-slate-900">ProofPix API Documentation</h1>
            <p className="text-xl text-slate-600 mt-2">
              Enterprise-grade API for automated photo metadata processing
            </p>
          </div>
        </div>
      </EnterpriseSection>

      {/* Enterprise Notice */}
      <EnterpriseSection size="lg">
        <EnterpriseCard variant="dark">
          <div className="flex items-center space-x-4 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Enterprise API Access</h2>
          </div>
          <p className="text-lg text-slate-300 mb-6">
            The ProofPix API is available exclusively to enterprise customers. Contact our enterprise team 
            to discuss your requirements and get access to our powerful metadata processing API.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <EnterpriseButton
              variant="primary"
              onClick={handleContactEnterprise}
            >
              <Mail className="h-5 w-5 mr-2" />
              Request API Access
            </EnterpriseButton>
            
            <EnterpriseButton
              variant="secondary"
              onClick={() => navigate('/pricing')}
            >
              <FileText className="h-5 w-5 mr-2" />
              View Enterprise Pricing
            </EnterpriseButton>
          </div>
        </EnterpriseCard>
      </EnterpriseSection>

      {/* API Overview */}
      <EnterpriseSection size="lg" background="light">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">API Overview</h2>
          <p className="text-xl text-slate-600">
            Powerful features designed for enterprise-scale metadata processing
          </p>
        </div>
        
        <EnterpriseGrid columns={4}>
          {features.map((feature, index) => (
            <EnterpriseCard key={index}>
              <div className="text-center">
                <div className="bg-slate-100 p-4 rounded-lg mb-3 inline-block">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            </EnterpriseCard>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* Authentication */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Authentication</h2>
          <p className="text-xl text-slate-600">
            Secure API access with enterprise-grade authentication
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EnterpriseCard>
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <Key className="h-6 w-6 text-blue-500 mr-2" />
              API Key Authentication
            </h3>
            <div className="space-y-4">
              <p className="text-slate-600">
                All API requests require a valid API key passed in the Authorization header:
              </p>
              <div className="bg-slate-100 p-4 rounded-lg">
                <code className="text-sm text-slate-800">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Rate limiting: 1000 requests/hour</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Automatic key rotation available</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Usage analytics and monitoring</span>
                </div>
              </div>
            </div>
          </EnterpriseCard>

          <EnterpriseCard>
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 text-green-500 mr-2" />
              Security Features
            </h3>
            <div className="space-y-4">
              <p className="text-slate-600">
                Enterprise security features included with API access:
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>TLS 1.3 encryption for all requests</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>IP whitelisting and geo-restrictions</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Comprehensive audit logging</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Real-time threat detection</span>
                </div>
              </div>
            </div>
          </EnterpriseCard>
        </div>
      </EnterpriseSection>

      {/* API Endpoints */}
      <EnterpriseSection size="lg" background="light">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">API Endpoints</h2>
          <p className="text-xl text-slate-600">
            Core endpoints for metadata extraction and processing
          </p>
        </div>
        
        <div className="space-y-6">
          {endpoints.map((endpoint, index) => (
            <EnterpriseCard key={index}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <EnterpriseBadge variant={endpoint.method === 'POST' ? 'primary' : 'neutral'}>
                      {endpoint.method}
                    </EnterpriseBadge>
                    <code className="text-sm font-mono text-slate-700">{endpoint.path}</code>
                  </div>
                  <p className="text-slate-600">{endpoint.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Parameters</h4>
                  <ul className="space-y-1">
                    {endpoint.params.map((param, paramIndex) => (
                      <li key={paramIndex} className="text-sm text-slate-600">
                        <code className="bg-slate-100 px-2 py-1 rounded text-xs">{param}</code>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Response</h4>
                  <p className="text-sm text-slate-600">{endpoint.response}</p>
                </div>
              </div>
            </EnterpriseCard>
          ))}
        </div>
      </EnterpriseSection>

      {/* SDKs and Libraries */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">SDKs and Libraries</h2>
          <p className="text-xl text-slate-600">
            Official SDKs and community libraries for easy integration
          </p>
        </div>
        
        <EnterpriseGrid columns={2}>
          {sdks.map((sdk, index) => (
            <EnterpriseCard key={index}>
              <div className="flex items-center space-x-3 mb-4">
                {sdk.icon}
                <div>
                  <h3 className="font-semibold text-slate-900">{sdk.language}</h3>
                  <EnterpriseBadge variant={sdk.status === 'Available' ? 'success' : 'warning'}>
                    {sdk.status}
                  </EnterpriseBadge>
                </div>
              </div>
              <p className="text-slate-600">{sdk.description}</p>
            </EnterpriseCard>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* Getting Started */}
      <EnterpriseSection size="lg" background="light">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Getting Started</h2>
          <p className="text-xl text-slate-600">
            Ready to integrate ProofPix API into your application?
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <EnterpriseCard>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Contact Enterprise Sales
              </h3>
              <p className="text-slate-600 mb-6">
                Our enterprise team will help you get started with API access, 
                provide documentation, and assist with integration planning.
              </p>
              <div className="space-y-3">
                <EnterpriseButton
                  variant="primary"
                  size="lg"
                  onClick={handleContactEnterprise}
                  className="w-full"
                >
                  Request API Access
                </EnterpriseButton>
                <EnterpriseButton
                  variant="ghost"
                  onClick={() => navigate('/enterprise')}
                  className="w-full"
                >
                  Learn More About Enterprise
                </EnterpriseButton>
              </div>
            </div>
          </EnterpriseCard>
        </div>
      </EnterpriseSection>
    </EnterpriseLayout>
  );
};

export default ApiDocs; 