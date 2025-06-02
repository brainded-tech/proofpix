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
  Play,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { ConsistentLayout } from '../../components/ui/ConsistentLayout';

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
    <ConsistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-emerald-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-600 p-3 rounded-lg mr-4">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                    Getting Started with ProofPix
                  </h1>
                  <p className="text-xl text-blue-100 mt-2">
                    Learn to extract, view, and protect your photo metadata in minutes
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/50 flex items-center">
                  <Clock className="h-4 w-4 text-slate-400 mr-2" />
                  <span className="text-slate-300">5 minute read</span>
                </div>
                <div className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/50 flex items-center">
                  <Shield className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-green-300">Privacy-focused</span>
                </div>
                <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/50 flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-blue-300">No registration required</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={handleBackHome}
              className="bg-slate-800/50 text-white hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors border border-slate-600/50 flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to ProofPix
            </button>
            <button
              onClick={() => navigate('/docs')}
              className="bg-slate-800/50 text-white hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors border border-slate-600/50 flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Documentation
            </button>
          </div>

          {/* What is ProofPix Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">What is ProofPix?</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
              <p className="text-lg text-slate-300 mb-8">
                ProofPix is a privacy-focused photo metadata extraction tool that works entirely in your browser. 
                Extract, view, and remove EXIF data from photos without uploading them to any server.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-500/20 p-4 rounded-lg mb-4 inline-block">
                    <Shield className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">100% Private</h3>
                  <p className="text-sm text-slate-400">Photos never leave your device</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-500/20 p-4 rounded-lg mb-4 inline-block">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">No Registration</h3>
                  <p className="text-sm text-slate-400">Start using immediately</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-500/20 p-4 rounded-lg mb-4 inline-block">
                    <Eye className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Professional Grade</h3>
                  <p className="text-sm text-slate-400">Enterprise-quality extraction</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Start Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Quick Start (5 minutes)</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {quickSteps.map((step, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <div className="text-blue-400 mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-300 mb-3">{step.description}</p>
                  <p className="text-sm text-slate-400">{step.details}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Supported Formats */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Supported Formats</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportedFormats.map((format, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <div className="text-blue-400 mr-2">{format.icon}</div>
                    <h3 className="font-semibold text-white">{format.format}</h3>
                  </div>
                  <p className="text-sm text-slate-400">{format.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Common Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    {useCase.icon}
                    <h3 className="text-xl font-bold text-white ml-3">{useCase.title}</h3>
                  </div>
                  <p className="text-slate-300 mb-3">{useCase.description}</p>
                  <p className="text-sm text-slate-400 italic">Example: {useCase.example}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Get Started CTA */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-blue-100 mb-6">
                Start analyzing your photos in seconds - no registration required
              </p>
              <button
                onClick={handleBackHome}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                Try ProofPix Now
              </button>
            </div>
          </section>
        </div>
      </div>
    </ConsistentLayout>
  );
};

export default GettingStarted; 