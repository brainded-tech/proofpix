import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  Shield, 
  Zap, 
  Database, 
  Globe, 
  Lock,
  Code,
  Server,
  Monitor,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Users,
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

const Architecture: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const architectureLayers = [
    {
      layer: 'Presentation Layer',
      description: 'React 18 with TypeScript for type-safe UI components',
      icon: <Monitor className="h-6 w-6" />,
      technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
      responsibilities: ['User Interface', 'State Management', 'Component Logic', 'Responsive Design']
    },
    {
      layer: 'Processing Layer',
      description: 'Client-side metadata extraction and image processing',
      icon: <Zap className="h-6 w-6" />,
      technologies: ['exifr Library', 'Canvas API', 'File API', 'Web Workers'],
      responsibilities: ['EXIF Extraction', 'Image Processing', 'Data Validation', 'Error Handling']
    },
    {
      layer: 'Security Layer',
      description: 'Privacy-first design with local-only processing',
      icon: <Shield className="h-6 w-6" />,
      technologies: ['Local Storage', 'Memory Processing', 'No Network Calls', 'CSP Headers'],
      responsibilities: ['Data Privacy', 'Local Processing', 'Secure Storage', 'Privacy Compliance']
    },
    {
      layer: 'Export Layer',
      description: 'Professional reporting and data export capabilities',
      icon: <Database className="h-6 w-6" />,
      technologies: ['jsPDF', 'Canvas API', 'Blob API', 'Download API'],
      responsibilities: ['PDF Generation', 'JSON Export', 'Image Enhancement', 'Report Creation']
    }
  ];

  const designPrinciples = [
    {
      principle: 'Privacy First',
      description: 'All processing happens locally in the browser',
      icon: <Lock className="h-5 w-5 text-green-400" />,
      implementation: 'No server uploads, no cloud storage, no tracking'
    },
    {
      principle: 'Performance Optimized',
      description: 'Fast processing with minimal resource usage',
      icon: <Zap className="h-5 w-5 text-yellow-400" />,
      implementation: 'Web Workers, lazy loading, optimized algorithms'
    },
    {
      principle: 'Mobile Responsive',
      description: 'Works seamlessly across all devices',
      icon: <Smartphone className="h-5 w-5 text-blue-400" />,
      implementation: 'Progressive Web App, touch-friendly interface'
    },
    {
      principle: 'Enterprise Ready',
      description: 'Scalable architecture for business needs',
      icon: <Server className="h-5 w-5 text-purple-400" />,
      implementation: 'Modular design, API endpoints, batch processing'
    }
  ];

  const dataFlow = [
    { step: 'File Selection', description: 'User selects image file via drag-drop or file picker' },
    { step: 'Validation', description: 'File type and size validation before processing' },
    { step: 'EXIF Extraction', description: 'Metadata extracted using exifr library in browser' },
    { step: 'Data Processing', description: 'Metadata parsed, validated, and structured' },
    { step: 'UI Rendering', description: 'Results displayed in organized, searchable interface' },
    { step: 'Export Options', description: 'User can export as PDF, JSON, or enhanced images' }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="System Architecture"
      description="Technical overview of ProofPix's privacy-first architecture"
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
          <div className="bg-indigo-600 p-3 rounded-lg">
            <Layers className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">System Architecture</h1>
            <p className="text-xl text-slate-600 mt-2">
              Technical overview of ProofPix's privacy-first architecture
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="neutral" icon={<Code className="enterprise-icon-sm" />}>
            Technical Documentation
          </EnterpriseBadge>
          <EnterpriseBadge variant="danger" icon={<Shield className="enterprise-icon-sm" />}>
            Privacy-first
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<CheckCircle className="enterprise-icon-sm" />}>
            Enterprise Ready
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* System Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">System Overview</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-lg text-gray-300 mb-6">
              ProofPix is built on a privacy-first architecture that processes all image metadata locally in the browser. 
              This design ensures complete data privacy while providing enterprise-grade functionality.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Globe className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Web-Based</h3>
                <p className="text-sm text-gray-400">No installation required</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Privacy-First</h3>
                <p className="text-sm text-gray-400">Local processing only</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Zap className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">High Performance</h3>
                <p className="text-sm text-gray-400">Optimized algorithms</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Server className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">Scalable</h3>
                <p className="text-sm text-gray-400">Enterprise ready</p>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Layers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Architecture Layers</h2>
          <div className="space-y-6">
            {architectureLayers.map((layer, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600/20 p-3 rounded-lg flex-shrink-0">
                    {layer.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{layer.layer}</h3>
                    <p className="text-gray-300 mb-4">{layer.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Technologies</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                          {layer.technologies.map((tech, techIndex) => (
                            <li key={techIndex} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Responsibilities</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                          {layer.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex} className="flex items-center">
                              <ArrowRight className="h-3 w-3 text-purple-400 mr-2" />
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Design Principles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Design Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {designPrinciples.map((principle, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start space-x-3 mb-4">
                  {principle.icon}
                  <div>
                    <h3 className="text-lg font-semibold">{principle.principle}</h3>
                    <p className="text-gray-300 text-sm">{principle.description}</p>
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">{principle.implementation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Flow */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Data Flow</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <div className="space-y-4">
              {dataFlow.map((flow, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{flow.step}</h4>
                    <p className="text-sm text-gray-400">{flow.description}</p>
                  </div>
                  {index < dataFlow.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Frontend</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• React 18 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• React Router for navigation</li>
                <li>• Lucide React for icons</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Processing</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• exifr for metadata extraction</li>
                <li>• Canvas API for image processing</li>
                <li>• Web Workers for performance</li>
                <li>• File API for local file handling</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Export & Reports</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• jsPDF for PDF generation</li>
                <li>• JSON for data export</li>
                <li>• Blob API for file downloads</li>
                <li>• Canvas for image enhancement</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security Architecture */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Security Architecture</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-400">Privacy Protection</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>All processing happens locally in browser memory</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>No server uploads or cloud storage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>No tracking or analytics on user data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Files automatically cleared from memory</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Security Measures</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Content Security Policy (CSP) headers</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Input validation and sanitization</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Secure file type validation</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Memory management and cleanup</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Optimization */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Performance Optimization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">Frontend Optimization</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Code splitting and lazy loading</li>
                <li>• Component memoization</li>
                <li>• Optimized bundle size</li>
                <li>• Progressive Web App features</li>
                <li>• Efficient state management</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Processing Optimization</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Web Workers for heavy processing</li>
                <li>• Streaming file processing</li>
                <li>• Memory-efficient algorithms</li>
                <li>• Batch processing capabilities</li>
                <li>• Error handling and recovery</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Deployment Architecture */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Deployment Architecture</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              ProofPix is designed as a static web application that can be deployed to any hosting platform 
              that supports static files and HTTPS.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Globe className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Static Hosting</h3>
                <p className="text-sm text-gray-400">Netlify, Vercel, AWS S3</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Server className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">CDN Distribution</h3>
                <p className="text-sm text-gray-400">Global edge locations</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">HTTPS Only</h3>
                <p className="text-sm text-gray-400">Secure connections required</p>
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

export default Architecture; 