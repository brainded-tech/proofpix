import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Eye, 
  Download, 
  Shield, 
  Camera, 
  MapPin, 
  Clock, 
  FileImage,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Play
} from 'lucide-react';

const GettingStarted: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const supportedFormats = [
    { format: 'JPEG/JPG', description: 'Full EXIF support including GPS', icon: <Camera className="h-4 w-4" /> },
    { format: 'PNG', description: 'Basic metadata support', icon: <FileImage className="h-4 w-4" /> },
    { format: 'TIFF', description: 'Complete EXIF extraction', icon: <Camera className="h-4 w-4" /> },
    { format: 'HEIC/HEIF', description: 'iOS format support', icon: <Camera className="h-4 w-4" /> }
  ];

  const quickSteps = [
    {
      step: 1,
      title: 'Upload Your Photo',
      description: 'Drag and drop or click to select your image file',
      icon: <Upload className="h-6 w-6" />,
      details: 'Supports JPEG, PNG, TIFF, and HEIC formats up to 50MB'
    },
    {
      step: 2,
      title: 'View Metadata',
      description: 'Instantly see all hidden data in your photo',
      icon: <Eye className="h-6 w-6" />,
      details: 'Camera settings, GPS location, timestamps, and device info'
    },
    {
      step: 3,
      title: 'Export Results',
      description: 'Download professional reports or clean images',
      icon: <Download className="h-6 w-6" />,
      details: 'PDF reports, JSON data, or privacy-cleaned images'
    }
  ];

  const useCases = [
    {
      title: 'Social Media Privacy',
      description: 'Remove location data before sharing photos online',
      icon: <Shield className="h-5 w-5 text-blue-400" />,
      example: 'Strip GPS coordinates from vacation photos'
    },
    {
      title: 'Professional Photography',
      description: 'Create detailed metadata reports for clients',
      icon: <Camera className="h-5 w-5 text-purple-400" />,
      example: 'Document camera settings and shooting conditions'
    },
    {
      title: 'Legal Documentation',
      description: 'Verify photo authenticity and capture details',
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      example: 'Prove when and where evidence photos were taken'
    },
    {
      title: 'Real Estate Listings',
      description: 'Ensure MLS compliance and property verification',
      icon: <MapPin className="h-5 w-5 text-orange-400" />,
      example: 'Verify property photos with timestamp and location'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBackHome}
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            ← Back to ProofPix
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Play className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Getting Started with ProofPix</h1>
              <p className="text-xl text-gray-300 mt-2">
                Learn to extract, view, and protect your photo metadata in minutes
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              5 minute read
            </span>
            <span className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Privacy-focused
            </span>
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              No registration required
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What is ProofPix Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What is ProofPix?</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-lg text-gray-300 mb-6">
              ProofPix is a privacy-focused photo metadata extraction tool that works entirely in your browser. 
              Extract, view, and remove EXIF data from photos without uploading them to any server.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">100% Private</h3>
                <p className="text-sm text-gray-400">Photos never leave your device</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600/20 p-4 rounded-lg mb-3 inline-block">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">No Registration</h3>
                <p className="text-sm text-gray-400">Start using immediately</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Eye className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Professional Grade</h3>
                <p className="text-sm text-gray-400">Enterprise-quality extraction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Quick Start (5 minutes)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 h-full">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {step.step}
                    </div>
                    <div className="bg-blue-600/20 p-2 rounded-lg">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-300 mb-4">{step.description}</p>
                  <p className="text-sm text-gray-400">{step.details}</p>
                </div>
                
                {index < quickSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Tutorial */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Step-by-Step Tutorial</h2>
          
          {/* Single Image Processing */}
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 mb-8">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <FileImage className="h-6 w-6 mr-3 text-blue-400" />
              Single Image Processing
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3">1. Upload Your Photo</h4>
                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 mb-3">
                    Use the drag-and-drop interface on the homepage or click "Choose File" to select your image.
                  </p>
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-300 text-sm">
                      <Info className="h-4 w-4 inline mr-2" />
                      <strong>Tip:</strong> You can also paste images directly from your clipboard!
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">2. Supported Formats</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportedFormats.map((format, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4 flex items-center">
                      <div className="bg-green-600/20 p-2 rounded mr-3">
                        {format.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-green-400">{format.format}</div>
                        <div className="text-sm text-gray-400">{format.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">3. File Size Limits</h4>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-300">
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    Maximum file size: <strong>50MB</strong>. For best performance, use files under 10MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Batch Processing */}
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Upload className="h-6 w-6 mr-3 text-purple-400" />
              Batch Processing
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                Process multiple images simultaneously for efficient workflow:
              </p>
              
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  Select multiple files at once (up to 50 images)
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  Real-time progress tracking for each file
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  Individual error handling with retry options
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  Bulk export in multiple formats
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Understanding Results */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Understanding Your Results</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">What Metadata Was Found</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <Camera className="h-4 w-4 text-blue-400 mr-3" />
                    Camera settings (ISO, aperture, shutter speed)
                  </li>
                  <li className="flex items-center">
                    <MapPin className="h-4 w-4 text-red-400 mr-3" />
                    GPS coordinates (if available)
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 text-green-400 mr-3" />
                    Timestamp information
                  </li>
                  <li className="flex items-center">
                    <FileImage className="h-4 w-4 text-purple-400 mr-3" />
                    Device and software details
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Privacy Implications</h3>
                <div className="space-y-3">
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-300 text-sm">
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      <strong>High Risk:</strong> GPS coordinates reveal exact location
                    </p>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-yellow-300 text-sm">
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      <strong>Medium Risk:</strong> Device info can identify your equipment
                    </p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-300 text-sm">
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      <strong>Low Risk:</strong> Camera settings are generally safe to share
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Common Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-700 p-2 rounded-lg mr-3">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{useCase.title}</h3>
                </div>
                <p className="text-gray-300 mb-3">{useCase.description}</p>
                <p className="text-sm text-gray-400 italic">Example: {useCase.example}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Troubleshooting</h2>
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Common Issues</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">File not uploading</h4>
                  <ul className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>• Check file size (must be under 50MB)</li>
                    <li>• Ensure file format is supported (JPEG, PNG, TIFF, HEIC)</li>
                    <li>• Try refreshing the page and uploading again</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Metadata not detected</h4>
                  <ul className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>• Some images may not contain EXIF data</li>
                    <li>• Screenshots typically have no metadata</li>
                    <li>• Social media platforms often strip metadata</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Browser compatibility</h4>
                  <ul className="text-gray-300 text-sm space-y-1 ml-4">
                    <li>• Use Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+</li>
                    <li>• Enable JavaScript in your browser</li>
                    <li>• Clear browser cache if experiencing issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-6">
              Now that you understand how ProofPix works, try it with your own photos!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBackHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Upload className="h-5 w-5 mr-2" />
                Start Extracting Metadata
              </button>
              
              <button
                onClick={() => navigate('/docs/privacy-guide')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Shield className="h-5 w-5 mr-2" />
                Learn Privacy Best Practices
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GettingStarted; 