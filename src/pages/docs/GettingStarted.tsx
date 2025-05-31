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
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';

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
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      example: 'Strip GPS coordinates from vacation photos'
    },
    {
      title: 'Professional Photography',
      description: 'Create detailed metadata reports for clients',
      icon: <Camera className="h-5 w-5 text-purple-600" />,
      example: 'Document camera settings and shooting conditions'
    },
    {
      title: 'Legal Documentation',
      description: 'Verify photo authenticity and capture details',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      example: 'Prove when and where evidence photos were taken'
    },
    {
      title: 'Real Estate Listings',
      description: 'Ensure MLS compliance and property verification',
      icon: <MapPin className="h-5 w-5 text-orange-600" />,
      example: 'Verify property photos with timestamp and location'
    }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Getting Started with ProofPix"
      description="Learn to extract, view, and protect your photo metadata in minutes"
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
            <div className="bg-blue-600 p-3 rounded-lg">
            <Play className="h-8 w-8 text-white" />
            </div>
            <div>
            <h1 className="text-4xl font-bold text-slate-900">Getting Started with ProofPix</h1>
            <p className="text-xl text-slate-600 mt-2">
                Learn to extract, view, and protect your photo metadata in minutes
              </p>
            </div>
          </div>
          
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="neutral" icon={<Clock className="enterprise-icon-sm" />}>
              5 minute read
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<Shield className="enterprise-icon-sm" />}>
              Privacy-focused
          </EnterpriseBadge>
          <EnterpriseBadge variant="primary" icon={<CheckCircle className="enterprise-icon-sm" />}>
              No registration required
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

        {/* What is ProofPix Section */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">What is ProofPix?</h2>
        <EnterpriseCard>
          <p className="text-lg text-slate-600 mb-6">
              ProofPix is a privacy-focused photo metadata extraction tool that works entirely in your browser. 
              Extract, view, and remove EXIF data from photos without uploading them to any server.
            </p>
            
          <EnterpriseGrid columns={3}>
              <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-3 inline-block">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">100% Private</h3>
              <p className="text-sm text-slate-600">Photos never leave your device</p>
              </div>
              
              <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-3 inline-block">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">No Registration</h3>
              <p className="text-sm text-slate-600">Start using immediately</p>
              </div>
              
              <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-3 inline-block">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Professional Grade</h3>
              <p className="text-sm text-slate-600">Enterprise-quality extraction</p>
            </div>
          </EnterpriseGrid>
        </EnterpriseCard>
      </EnterpriseSection>

        {/* Quick Start Section */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Quick Start (5 minutes)</h2>
        <EnterpriseGrid columns={3}>
            {quickSteps.map((step, index) => (
              <div key={index} className="relative">
              <EnterpriseCard className="h-full">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {step.step}
                    </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                      {step.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 mb-4">{step.description}</p>
                <p className="text-sm text-slate-500">{step.details}</p>
              </EnterpriseCard>
                
                {index < quickSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
        </EnterpriseGrid>
      </EnterpriseSection>

        {/* Step-by-Step Tutorial */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Step-by-Step Tutorial</h2>
          
          {/* Single Image Processing */}
        <EnterpriseCard className="mb-8">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
            <FileImage className="h-6 w-6 text-blue-600 mr-2" />
              Single Image Processing
            </h3>
            
            <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Step 1: Upload Your Photo</h4>
              <p className="text-slate-600 mb-3">
                Click the upload area or drag and drop your image file. ProofPix supports all major image formats.
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">
                  <strong>Tip:</strong> Your photo is processed entirely in your browser - it never leaves your device.
                </p>
                </div>
              </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Step 2: View Extracted Data</h4>
              <p className="text-slate-600 mb-3">
                Instantly see all metadata including camera settings, GPS coordinates, timestamps, and device information.
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">
                  <strong>Note:</strong> Not all photos contain metadata - it depends on the camera and settings used.
                </p>
              </div>
            </div>
            
            <div className="border-l-4 border-purple-600 pl-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Step 3: Export or Clean</h4>
              <p className="text-slate-600 mb-3">
                Download a detailed report, export raw data, or create a privacy-cleaned version of your photo.
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">
                  <strong>Privacy:</strong> Cleaned photos have all metadata removed for safe sharing.
                </p>
              </div>
            </div>
          </div>
        </EnterpriseCard>

        {/* Supported Formats */}
        <EnterpriseCard>
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">Supported File Formats</h3>
          <EnterpriseGrid columns={2}>
            {supportedFormats.map((format, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="text-blue-600">{format.icon}</div>
                <div>
                  <p className="font-medium text-slate-900">{format.format}</p>
                  <p className="text-sm text-slate-600">{format.description}</p>
                </div>
              </div>
            ))}
          </EnterpriseGrid>
        </EnterpriseCard>
      </EnterpriseSection>

      {/* Common Use Cases */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Common Use Cases</h2>
        <EnterpriseGrid columns={2}>
          {useCases.map((useCase, index) => (
            <EnterpriseCard key={index}>
              <div className="flex items-start space-x-3 mb-4">
                {useCase.icon}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{useCase.title}</h3>
                  <p className="text-slate-600 mb-3">{useCase.description}</p>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-600">
                      <strong>Example:</strong> {useCase.example}
                    </p>
                </div>
                </div>
              </div>
            </EnterpriseCard>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

        {/* Next Steps */}
      <EnterpriseSection size="lg">
        <EnterpriseCard variant="dark" className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Start extracting metadata from your photos right now - no registration required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <EnterpriseButton 
              variant="primary" 
              size="lg"
                onClick={handleBackHome}
            >
              Try ProofPix Now
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/enterprise')}
            >
              Learn About Enterprise
            </EnterpriseButton>
          </div>
        </EnterpriseCard>
      </EnterpriseSection>
    </EnterpriseLayout>
  );
};

export default GettingStarted; 