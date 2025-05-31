import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TestTube, 
  Shield, 
  Zap, 
  CheckCircle, 
  Code, 
  Monitor,
  Smartphone,
  Globe,
  Bug,
  Target,
  Play,
  ArrowRight,
  AlertTriangle,
  Clock,
  FileText,
  Eye,
  Lock,
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
import DocumentationFooter from '../../components/DocumentationFooter';

const TestingGuide: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const testingLevels = [
    {
      level: 'Unit Testing',
      description: 'Testing individual components and utility functions',
      icon: <Code className="h-6 w-6" />,
      tools: ['Jest', 'React Testing Library', '@testing-library/jest-dom'],
      coverage: ['Utility Functions', 'Component Logic', 'State Management', 'Error Handling']
    },
    {
      level: 'Integration Testing',
      description: 'Testing component interactions and data flow',
      icon: <Target className="h-6 w-6" />,
      tools: ['React Testing Library', 'MSW (Mock Service Worker)', 'Jest'],
      coverage: ['File Processing Pipeline', 'Component Integration', 'State Updates', 'Event Handling']
    },
    {
      level: 'End-to-End Testing',
      description: 'Testing complete user workflows and scenarios',
      icon: <Monitor className="h-6 w-6" />,
      tools: ['Cypress', 'Playwright', 'Puppeteer'],
      coverage: ['User Workflows', 'File Upload/Download', 'Cross-browser Testing', 'Performance Testing']
    },
    {
      level: 'Privacy Testing',
      description: 'Ensuring no data leaves the browser environment',
      icon: <Shield className="h-6 w-6" />,
      tools: ['Network Monitoring', 'Browser DevTools', 'Custom Validators'],
      coverage: ['Network Traffic', 'Local Storage', 'Memory Usage', 'Data Leakage Prevention']
    }
  ];

  const testingStrategies = [
    {
      strategy: 'Test-Driven Development (TDD)',
      description: 'Write tests before implementing features',
      icon: <TestTube className="h-5 w-5 text-green-400" />,
      benefits: ['Better code design', 'Higher test coverage', 'Fewer bugs', 'Refactoring confidence']
    },
    {
      strategy: 'Behavior-Driven Development (BDD)',
      description: 'Focus on user behavior and business requirements',
      icon: <Target className="h-5 w-5 text-blue-400" />,
      benefits: ['User-focused testing', 'Clear requirements', 'Stakeholder alignment', 'Living documentation']
    },
    {
      strategy: 'Continuous Testing',
      description: 'Automated testing in CI/CD pipeline',
      icon: <Zap className="h-5 w-5 text-yellow-400" />,
      benefits: ['Fast feedback', 'Early bug detection', 'Deployment confidence', 'Quality gates']
    },
    {
      strategy: 'Privacy-First Testing',
      description: 'Validate privacy and security requirements',
      icon: <Shield className="h-5 w-5 text-purple-400" />,
      benefits: ['Data protection', 'Compliance validation', 'Trust building', 'Risk mitigation']
    }
  ];

  const testScenarios = [
    {
      category: 'File Processing',
      scenarios: [
        'Upload valid JPEG with EXIF data',
        'Upload image without metadata',
        'Upload unsupported file format',
        'Upload file exceeding size limit',
        'Process corrupted image file'
      ]
    },
    {
      category: 'Metadata Extraction',
      scenarios: [
        'Extract GPS coordinates from photo',
        'Parse camera settings and technical data',
        'Handle missing or incomplete metadata',
        'Process multiple metadata standards',
        'Validate timestamp accuracy'
      ]
    },
    {
      category: 'Privacy Compliance',
      scenarios: [
        'Verify no network requests during processing',
        'Confirm local-only file handling',
        'Test memory cleanup after processing',
        'Validate no persistent storage',
        'Check for data leakage prevention'
      ]
    },
    {
      category: 'Export Functionality',
      scenarios: [
        'Generate PDF report with metadata',
        'Export JSON data format',
        'Download enhanced images',
        'Batch export multiple files',
        'Handle export errors gracefully'
      ]
    }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Testing Guide"
      description="Comprehensive testing strategies for privacy-focused applications"
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
          <div className="bg-green-600 p-3 rounded-lg">
            <TestTube className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Testing Guide</h1>
            <p className="text-xl text-slate-600 mt-2">
              Comprehensive testing strategies for privacy-focused applications
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="neutral" icon={<TestTube className="enterprise-icon-sm" />}>
            Testing Documentation
          </EnterpriseBadge>
          <EnterpriseBadge variant="danger" icon={<Shield className="enterprise-icon-sm" />}>
            Privacy-focused
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<CheckCircle className="enterprise-icon-sm" />}>
            Production Ready
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Testing Philosophy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Testing Philosophy</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-lg text-gray-300 mb-6">
              ProofPix follows a comprehensive testing approach that prioritizes privacy, user experience, 
              and reliability. Our testing strategy ensures that user data never leaves the browser while 
              maintaining enterprise-grade quality standards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-green-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-gray-400">No data leakage testing</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">User-Focused</h3>
                <p className="text-sm text-gray-400">Real-world scenarios</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Zap className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="font-semibold mb-2">Performance</h3>
                <p className="text-sm text-gray-400">Speed and efficiency</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600/20 p-4 rounded-lg mb-3 inline-block">
                  <CheckCircle className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Reliability</h3>
                <p className="text-sm text-gray-400">Consistent results</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testing Levels */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Testing Levels</h2>
          <div className="space-y-6">
            {testingLevels.map((level, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600/20 p-3 rounded-lg flex-shrink-0">
                    {level.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{level.level}</h3>
                    <p className="text-gray-300 mb-4">{level.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Tools & Frameworks</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                          {level.tools.map((tool, toolIndex) => (
                            <li key={toolIndex} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Test Coverage</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                          {level.coverage.map((coverage, coverageIndex) => (
                            <li key={coverageIndex} className="flex items-center">
                              <ArrowRight className="h-3 w-3 text-purple-400 mr-2" />
                              {coverage}
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

        {/* Testing Strategies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Testing Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testingStrategies.map((strategy, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start space-x-3 mb-4">
                  {strategy.icon}
                  <div>
                    <h3 className="text-lg font-semibold">{strategy.strategy}</h3>
                    <p className="text-gray-300 text-sm">{strategy.description}</p>
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">Benefits:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {strategy.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Test Scenarios */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Test Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testScenarios.map((category, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-blue-400">{category.category}</h3>
                <ul className="space-y-2">
                  {category.scenarios.map((scenario, scenarioIndex) => (
                    <li key={scenarioIndex} className="flex items-start text-sm text-gray-300">
                      <Play className="h-3 w-3 text-green-400 mr-2 mt-1 flex-shrink-0" />
                      {scenario}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Unit Testing Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Unit Testing Examples</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Metadata Extraction Tests</h3>
            <div className="bg-gray-900 rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-sm text-gray-300">
{`// metadata.test.ts
import { extractMetadata } from '../utils/metadata';

describe('Metadata Extraction', () => {
  test('should extract GPS coordinates from JPEG', async () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const metadata = await extractMetadata(mockFile);
    
    expect(metadata.gpsLatitude).toBeDefined();
    expect(metadata.gpsLongitude).toBeDefined();
  });

  test('should handle files without metadata gracefully', async () => {
    const mockFile = new File([''], 'no-exif.jpg', { type: 'image/jpeg' });
    const metadata = await extractMetadata(mockFile);
    
    expect(metadata).toBeDefined();
    expect(metadata.error).toBeUndefined();
  });
});`}
              </pre>
            </div>

            <h3 className="text-xl font-semibold mb-4">Component Testing Examples</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">
{`// FileUpload.test.tsx
// Note: This example uses @testing-library/react (install separately for testing)
// import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from '../components/FileUpload';

describe('FileUpload Component', () => {
  test('should accept valid image files', () => {
    const mockOnFileSelect = jest.fn();
    // render(<FileUpload onFileSelect={mockOnFileSelect} />);
    
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    // const input = screen.getByLabelText(/upload/i);
    
    // fireEvent.change(input, { target: { files: [file] } });
    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
  });

  test('should reject unsupported file types', () => {
    const mockOnFileSelect = jest.fn();
    // render(<FileUpload onFileSelect={mockOnFileSelect} />);
    
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    // const input = screen.getByLabelText(/upload/i);
    
    // fireEvent.change(input, { target: { files: [file] } });
    expect(mockOnFileSelect).not.toHaveBeenCalled();
    // expect(screen.getByText(/unsupported file format/i)).toBeInTheDocument();
  });
});`}
              </pre>
            </div>
          </div>
        </section>

        {/* Privacy Testing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Privacy Testing</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              Privacy testing is crucial for ProofPix to ensure that user data never leaves the browser environment.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-400">Network Monitoring</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Monitor all network requests during file processing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Verify no file uploads or data transmission</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Test with network disabled scenarios</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Memory Management</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Verify file data is cleared from memory</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Test for memory leaks during processing</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Validate no persistent storage usage</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-Browser Testing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Cross-Browser Testing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Desktop Browsers</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <Monitor className="h-4 w-4 text-blue-400 mr-2" />
                  Chrome 90+
                </li>
                <li className="flex items-center">
                  <Monitor className="h-4 w-4 text-blue-400 mr-2" />
                  Firefox 88+
                </li>
                <li className="flex items-center">
                  <Monitor className="h-4 w-4 text-blue-400 mr-2" />
                  Safari 14+
                </li>
                <li className="flex items-center">
                  <Monitor className="h-4 w-4 text-blue-400 mr-2" />
                  Edge 90+
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Mobile Browsers</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <Smartphone className="h-4 w-4 text-green-400 mr-2" />
                  iOS Safari
                </li>
                <li className="flex items-center">
                  <Smartphone className="h-4 w-4 text-green-400 mr-2" />
                  Chrome Mobile
                </li>
                <li className="flex items-center">
                  <Smartphone className="h-4 w-4 text-green-400 mr-2" />
                  Firefox Mobile
                </li>
                <li className="flex items-center">
                  <Smartphone className="h-4 w-4 text-green-400 mr-2" />
                  Samsung Internet
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Testing Tools</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <Globe className="h-4 w-4 text-purple-400 mr-2" />
                  BrowserStack
                </li>
                <li className="flex items-center">
                  <Globe className="h-4 w-4 text-purple-400 mr-2" />
                  Sauce Labs
                </li>
                <li className="flex items-center">
                  <Globe className="h-4 w-4 text-purple-400 mr-2" />
                  Playwright
                </li>
                <li className="flex items-center">
                  <Globe className="h-4 w-4 text-purple-400 mr-2" />
                  Cypress
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Performance Testing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Performance Testing</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Metrics to Monitor</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>File processing time (target: &lt;2 seconds for 10MB files)</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Memory usage during processing</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>UI responsiveness during heavy operations</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Bundle size and load times</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Testing Scenarios</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <Target className="h-5 w-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Large file processing (up to 50MB)</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Batch processing multiple files</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Low-end device performance</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Concurrent user simulations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CI/CD Integration */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">CI/CD Integration</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              Automated testing is integrated into the continuous integration pipeline to ensure quality at every deployment.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Code Commit</h4>
                  <p className="text-sm text-gray-400">Developer pushes code to repository</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Automated Testing</h4>
                  <p className="text-sm text-gray-400">Unit, integration, and privacy tests run automatically</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Quality Gates</h4>
                  <p className="text-sm text-gray-400">Code coverage and performance thresholds must be met</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Deployment</h4>
                  <p className="text-sm text-gray-400">Successful tests trigger automated deployment</p>
                </div>
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

export default TestingGuide; 