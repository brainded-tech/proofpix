import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Clock, 
  FileText, 
  Smartphone, 
  Settings, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Shield,
  Aperture,
  Globe,
  Edit,
  Copyright,
  Tag,
  User,
  BookOpen,
  Database
} from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import { StandardLayout } from '../../components/ui/StandardLayout';
import { BackToHomeButton } from '../../components/ui/BackToHomeButton';

const MetadataGuide: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('exif');

  const handleBackHome = () => {
    navigate('/');
  };

  const metadataTypes = {
    exif: {
      title: 'EXIF (Exchangeable Image File Format)',
      description: 'Technical data automatically added by cameras and smartphones',
      icon: <Camera className="h-6 w-6" />,
      color: 'blue',
      categories: [
        {
          name: 'Camera Settings',
          icon: <Aperture className="h-5 w-5 text-blue-400" />,
          fields: [
            { name: 'Aperture (f-stop)', example: 'f/2.8', privacy: 'low', description: 'Controls depth of field' },
            { name: 'Shutter Speed', example: '1/125s', privacy: 'low', description: 'Exposure time duration' },
            { name: 'ISO Sensitivity', example: 'ISO 800', privacy: 'low', description: 'Sensor sensitivity to light' },
            { name: 'Focal Length', example: '85mm', privacy: 'low', description: 'Lens zoom level' },
            { name: 'Flash Mode', example: 'Auto, Did not fire', privacy: 'low', description: 'Flash usage information' },
            { name: 'White Balance', example: 'Daylight', privacy: 'low', description: 'Color temperature setting' }
          ]
        },
        {
          name: 'Device Information',
          icon: <Smartphone className="h-5 w-5 text-orange-400" />,
          fields: [
            { name: 'Camera Make', example: 'Apple', privacy: 'medium', description: 'Manufacturer of the device' },
            { name: 'Camera Model', example: 'iPhone 14 Pro', privacy: 'medium', description: 'Specific device model' },
            { name: 'Lens Model', example: 'iPhone 14 Pro back triple camera', privacy: 'medium', description: 'Lens specification' },
            { name: 'Software Version', example: 'iOS 16.1.1', privacy: 'medium', description: 'Operating system version' },
            { name: 'Firmware Version', example: '16.1.1', privacy: 'low', description: 'Device firmware details' }
          ]
        },
        {
          name: 'Capture Details',
          icon: <Clock className="h-5 w-5 text-green-400" />,
          fields: [
            { name: 'Date/Time Original', example: '2024:01:15 14:30:22', privacy: 'medium', description: 'When photo was taken' },
            { name: 'Date/Time Digitized', example: '2024:01:15 14:30:22', privacy: 'medium', description: 'When image was processed' },
            { name: 'GPS Latitude', example: '37.7749° N', privacy: 'high', description: 'Exact north-south position' },
            { name: 'GPS Longitude', example: '122.4194° W', privacy: 'high', description: 'Exact east-west position' },
            { name: 'GPS Altitude', example: '52.3m above sea level', privacy: 'high', description: 'Height above sea level' },
            { name: 'Orientation', example: 'Rotate 90 CW', privacy: 'low', description: 'Image rotation information' }
          ]
        }
      ]
    },
    iptc: {
      title: 'IPTC (International Press Telecommunications Council)',
      description: 'Descriptive information added by photographers and editors',
      icon: <FileText className="h-6 w-6" />,
      color: 'purple',
      categories: [
        {
          name: 'Descriptive Information',
          icon: <Tag className="h-5 w-5 text-purple-400" />,
          fields: [
            { name: 'Title/Headline', example: 'Sunset over Golden Gate Bridge', privacy: 'low', description: 'Image title or headline' },
            { name: 'Caption/Description', example: 'Beautiful sunset view from Crissy Field', privacy: 'low', description: 'Detailed image description' },
            { name: 'Keywords', example: 'sunset, bridge, San Francisco', privacy: 'medium', description: 'Searchable tags' },
            { name: 'Category', example: 'Travel, Landscape', privacy: 'low', description: 'Image classification' },
            { name: 'Instructions', example: 'Credit required for publication', privacy: 'low', description: 'Usage instructions' }
          ]
        },
        {
          name: 'Creator Information',
          icon: <User className="h-5 w-5 text-blue-400" />,
          fields: [
            { name: 'Creator/Photographer', example: 'John Smith', privacy: 'high', description: 'Photographer name' },
            { name: 'Creator Job Title', example: 'Professional Photographer', privacy: 'medium', description: 'Photographer role' },
            { name: 'Creator Address', example: '123 Main St, San Francisco', privacy: 'high', description: 'Photographer contact info' },
            { name: 'Creator Phone', example: '+1-555-123-4567', privacy: 'high', description: 'Contact phone number' },
            { name: 'Creator Email', example: 'john@example.com', privacy: 'high', description: 'Contact email address' },
            { name: 'Creator Website', example: 'www.johnsmithphoto.com', privacy: 'medium', description: 'Professional website' }
          ]
        },
        {
          name: 'Rights & Usage',
          icon: <Copyright className="h-5 w-5 text-green-400" />,
          fields: [
            { name: 'Copyright Notice', example: '© 2024 John Smith', privacy: 'low', description: 'Copyright information' },
            { name: 'Rights Usage Terms', example: 'Editorial use only', privacy: 'low', description: 'Usage restrictions' },
            { name: 'Credit Line', example: 'Photo by John Smith', privacy: 'medium', description: 'Required attribution' },
            { name: 'Source', example: 'Smith Photography Studio', privacy: 'medium', description: 'Image source organization' }
          ]
        }
      ]
    },
    xmp: {
      title: 'XMP (Extensible Metadata Platform)',
      description: 'Adobe and software-specific metadata for editing and processing',
      icon: <Edit className="h-6 w-6" />,
      color: 'green',
      categories: [
        {
          name: 'Editing History',
          icon: <Edit className="h-5 w-5 text-green-400" />,
          fields: [
            { name: 'Software Used', example: 'Adobe Lightroom Classic', privacy: 'medium', description: 'Editing software name' },
            { name: 'Software Version', example: 'Lightroom Classic 12.1', privacy: 'low', description: 'Software version used' },
            { name: 'Processing Date', example: '2024-01-15T14:30:22', privacy: 'medium', description: 'When image was edited' },
            { name: 'Edit Count', example: '3 versions', privacy: 'low', description: 'Number of edits made' },
            { name: 'Original Filename', example: 'IMG_1234.jpg', privacy: 'low', description: 'Original file name' }
          ]
        },
        {
          name: 'Processing Settings',
          icon: <Settings className="h-5 w-5 text-blue-400" />,
          fields: [
            { name: 'Exposure Adjustment', example: '+0.5 EV', privacy: 'low', description: 'Exposure compensation applied' },
            { name: 'Color Temperature', example: '5500K', privacy: 'low', description: 'White balance adjustment' },
            { name: 'Saturation', example: '+15', privacy: 'low', description: 'Color saturation changes' },
            { name: 'Sharpening', example: 'Amount: 40', privacy: 'low', description: 'Sharpening settings applied' },
            { name: 'Noise Reduction', example: 'Luminance: 25', privacy: 'low', description: 'Noise reduction settings' }
          ]
        },
        {
          name: 'Custom Fields',
          icon: <Tag className="h-5 w-5 text-purple-400" />,
          fields: [
            { name: 'Rating', example: '4 stars', privacy: 'low', description: 'User-assigned rating' },
            { name: 'Color Label', example: 'Blue', privacy: 'low', description: 'Organizational color coding' },
            { name: 'Collections', example: 'Best of 2024', privacy: 'low', description: 'Album or collection membership' },
            { name: 'Custom Keywords', example: 'portfolio, featured', privacy: 'low', description: 'User-defined tags' }
          ]
        }
      ]
    }
  };

  const privacyLevels = {
    low: { color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-500/30', label: 'Low Risk' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-500/30', label: 'Medium Risk' },
    high: { color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-500/30', label: 'High Risk' }
  };

  const realWorldExamples = [
    {
      scenario: 'Social Media Oversharing',
      description: 'A vacation photo reveals your exact hotel location through GPS coordinates',
      metadata: 'GPS Latitude/Longitude',
      risk: 'High',
      consequence: 'Stalkers could track your travel patterns and current location',
      icon: <Globe className="h-6 w-6 text-red-400" />
    },
    {
      scenario: 'Professional Photography Leak',
      description: 'Wedding photos contain photographer\'s personal contact information',
      metadata: 'IPTC Creator Fields',
      risk: 'Medium',
      consequence: 'Photographer receives unwanted contact or spam',
      icon: <Camera className="h-6 w-6 text-orange-400" />
    },
    {
      scenario: 'Device Fingerprinting',
      description: 'Multiple photos from same device create trackable digital fingerprint',
      metadata: 'Camera Make/Model',
      risk: 'Medium',
      consequence: 'Cross-platform tracking and targeted advertising',
      icon: <Smartphone className="h-6 w-6 text-yellow-400" />
    },
    {
      scenario: 'Legal Evidence Verification',
      description: 'Timestamp and GPS data prove when and where evidence was captured',
      metadata: 'EXIF Date/Time + GPS',
      risk: 'Beneficial',
      consequence: 'Strengthens legal case with verifiable proof',
      icon: <CheckCircle className="h-6 w-6 text-green-400" />
    }
  ];

  const getTabColor = (type: string) => {
    const colors = {
      exif: 'blue',
      iptc: 'purple',
      xmp: 'green'
    };
    return colors[type as keyof typeof colors] || 'blue';
  };

  return (
    <StandardLayout
      title="Understanding Photo Metadata"
      description="Complete guide to EXIF data and photo metadata"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <BackToHomeButton variant="minimal" />
          <div className="h-6 w-px bg-gray-300"></div>
          <button
            onClick={() => navigate('/docs')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>Documentation</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Metadata Guide</h1>
        </div>
        <div></div> {/* Spacer for centering */}
      </div>

      <EnterpriseLayout
        showHero
        title="Metadata Extraction Guide"
        description="Complete guide to understanding and extracting image metadata"
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
            <div className="bg-teal-600 p-3 rounded-lg">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Metadata Extraction Guide</h1>
              <p className="text-xl text-slate-600 mt-2">
                Complete guide to understanding and extracting image metadata
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <EnterpriseBadge variant="neutral" icon={<FileText className="enterprise-icon-sm" />}>
              Technical Guide
            </EnterpriseBadge>
            <EnterpriseBadge variant="warning" icon={<AlertTriangle className="enterprise-icon-sm" />}>
              Privacy-focused
            </EnterpriseBadge>
            <EnterpriseBadge variant="primary" icon={<Info className="enterprise-icon-sm" />}>
              Educational
            </EnterpriseBadge>
          </div>
        </EnterpriseSection>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* What is Metadata */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">What is Metadata?</h2>
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              <p className="text-lg text-gray-300 mb-6">
                Metadata is "data about data" - hidden information embedded in image files that describes various aspects 
                of the photo, from technical camera settings to descriptive information added by photographers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-600/20 p-4 rounded-lg mb-3 inline-block">
                    <Eye className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Hidden Information</h3>
                  <p className="text-sm text-gray-400">Not visible in the image itself</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-600/20 p-4 rounded-lg mb-3 inline-block">
                    <Settings className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Automatically Added</h3>
                  <p className="text-sm text-gray-400">Created by cameras and software</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-600/20 p-4 rounded-lg mb-3 inline-block">
                    <FileText className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Multiple Types</h3>
                  <p className="text-sm text-gray-400">EXIF, IPTC, XMP, and more</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-red-600/20 p-4 rounded-lg mb-3 inline-block">
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Privacy Risk</h3>
                  <p className="text-sm text-gray-400">Can reveal personal information</p>
                </div>
              </div>
            </div>
          </section>

          {/* Metadata Types Tabs */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Types of Metadata</h2>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg">
              {Object.entries(metadataTypes).map(([key, type]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                    activeTab === key
                      ? `bg-${getTabColor(key)}-600 text-white`
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {type.icon}
                  <span className="font-medium">{type.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              {Object.entries(metadataTypes).map(([key, type]) => (
                activeTab === key && (
                  <div key={key}>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`bg-${type.color}-600/20 p-3 rounded-lg`}>
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{type.title}</h3>
                        <p className="text-gray-300">{type.description}</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {type.categories.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h4 className="text-xl font-semibold mb-4 flex items-center">
                            {category.icon}
                            <span className="ml-3">{category.name}</span>
                          </h4>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {category.fields.map((field, fieldIndex) => (
                              <div key={fieldIndex} className={`p-4 rounded-lg border ${privacyLevels[field.privacy as keyof typeof privacyLevels].bg} ${privacyLevels[field.privacy as keyof typeof privacyLevels].border}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold">{field.name}</h5>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${privacyLevels[field.privacy as keyof typeof privacyLevels].color}`}>
                                    {privacyLevels[field.privacy as keyof typeof privacyLevels].label}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-400 mb-2">{field.description}</p>
                                <div className="bg-gray-700/50 rounded p-2">
                                  <span className="text-xs text-gray-500">Example: </span>
                                  <span className="text-sm font-mono text-gray-300">{field.example}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </section>

          {/* Privacy Risk Levels */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Privacy-Sensitive Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
                  <h3 className="text-xl font-semibold text-red-400">High Risk</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li>• GPS coordinates (exact location)</li>
                  <li>• Personal contact information</li>
                  <li>• Device serial numbers</li>
                  <li>• Precise timestamps with timezone</li>
                  <li>• Creator personal details</li>
                </ul>
                <p className="text-sm text-red-300 mt-4">
                  <strong>Risk:</strong> Can reveal personal location, identity, and patterns
                </p>
              </div>

              <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3" />
                  <h3 className="text-xl font-semibold text-yellow-400">Medium Risk</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li>• Camera/phone model</li>
                  <li>• Software versions</li>
                  <li>• Editing software used</li>
                  <li>• General timestamps</li>
                  <li>• Keywords and descriptions</li>
                </ul>
                <p className="text-sm text-yellow-300 mt-4">
                  <strong>Risk:</strong> Can enable device fingerprinting and tracking
                </p>
              </div>

              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold text-green-400">Low Risk</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li>• Camera settings (ISO, aperture)</li>
                  <li>• Color profiles</li>
                  <li>• Image dimensions</li>
                  <li>• File format information</li>
                  <li>• Basic editing adjustments</li>
                </ul>
                <p className="text-sm text-green-300 mt-4">
                  <strong>Risk:</strong> Generally safe to share, minimal privacy impact
                </p>
              </div>
            </div>
          </section>

          {/* Real-World Examples */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Real-World Examples</h2>
            <div className="space-y-6">
              {realWorldExamples.map((example, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-700 p-3 rounded-lg flex-shrink-0">
                      {example.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold">{example.scenario}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          example.risk === 'High' ? 'bg-red-600 text-white' :
                          example.risk === 'Medium' ? 'bg-orange-600 text-white' :
                          example.risk === 'Beneficial' ? 'bg-green-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {example.risk} Risk
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-3">{example.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-400">Metadata Type:</span>
                          <p className="font-medium text-blue-400">{example.metadata}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Potential Consequence:</span>
                          <p className="font-medium">{example.consequence}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How ProofPix Helps */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">How ProofPix Helps</h2>
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-8 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Eye className="h-5 w-5 mr-3 text-blue-400" />
                    Complete Metadata Visibility
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                      Identifies all metadata types (EXIF, IPTC, XMP)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                      Highlights privacy-sensitive fields
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                      Shows exact GPS coordinates on map
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                      Displays technical camera settings
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-3 text-green-400" />
                    Privacy Protection Tools
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                      Selective metadata removal options
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                      Batch processing for multiple images
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                      Professional export formats
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                      100% local processing (no uploads)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Explore Your Photo Metadata</h2>
              <p className="text-gray-300 mb-6">
                Now that you understand what metadata is and why it matters, try ProofPix to see what your photos reveal.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBackHome}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Analyze Your Photos
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
      </EnterpriseLayout>
    </StandardLayout>
  );
};

export default MetadataGuide; 