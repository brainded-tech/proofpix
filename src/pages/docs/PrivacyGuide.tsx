import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Camera, 
  Smartphone,
  Globe,
  Users,
  FileText,
  Download,
  Upload,
  Settings,
  Info,
  Heart,
  ShoppingCart,
  Briefcase,
  ArrowLeft
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

const PrivacyGuide: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const metadataRisks = [
    {
      type: 'GPS Location',
      icon: <MapPin className="h-6 w-6 text-red-400" />,
      risk: 'High',
      description: 'Reveals exact coordinates where photo was taken',
      examples: ['Home address exposure', 'Workplace location', 'Travel patterns', 'Security vulnerabilities'],
      riskColor: 'border-red-500 bg-red-900/30'
    },
    {
      type: 'Device Information',
      icon: <Smartphone className="h-6 w-6 text-orange-400" />,
      risk: 'Medium',
      description: 'Identifies your camera, phone, or equipment',
      examples: ['Device fingerprinting', 'Equipment tracking', 'Software versions', 'Unique identifiers'],
      riskColor: 'border-orange-500 bg-orange-900/30'
    },
    {
      type: 'Timestamp Data',
      icon: <Clock className="h-6 w-6 text-yellow-400" />,
      risk: 'Medium',
      description: 'Shows when photos were taken with timezone info',
      examples: ['Activity patterns', 'Sleep schedules', 'Work hours', 'Travel timeline'],
      riskColor: 'border-yellow-500 bg-yellow-900/30'
    },
    {
      type: 'Camera Settings',
      icon: <Camera className="h-6 w-6 text-green-400" />,
      risk: 'Low',
      description: 'Technical photography information',
      examples: ['ISO, aperture, shutter speed', 'Lens information', 'Flash settings', 'Color profiles'],
      riskColor: 'border-green-500 bg-green-900/30'
    }
  ];

  const platformGuidelines = [
    {
      platform: 'Social Media',
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      guidelines: [
        'Always remove GPS coordinates before posting',
        'Check for identifying device information',
        'Consider timestamp implications for privacy',
        'Use ProofPix to verify what you\'re sharing'
      ],
      warning: 'Most platforms don\'t strip all metadata automatically'
    },
    {
      platform: 'Dating Profiles',
      icon: <Heart className="h-6 w-6 text-pink-400" />,
      guidelines: [
        'Never include location data in profile photos',
        'Remove device information to prevent tracking',
        'Strip timestamps to avoid revealing patterns',
        'Use photos taken in public, non-identifying locations'
      ],
      warning: 'Location data can reveal home/work addresses'
    },
    {
      platform: 'Marketplace Sales',
      icon: <ShoppingCart className="h-6 w-6 text-green-400" />,
      guidelines: [
        'Remove GPS data to protect home address',
        'Keep device info if selling camera equipment',
        'Timestamps can verify when item was purchased',
        'Consider what background reveals about location'
      ],
      warning: 'Buyers may extract location from metadata'
    },
    {
      platform: 'Professional Portfolios',
      icon: <Briefcase className="h-6 w-6 text-purple-400" />,
      guidelines: [
        'Keep camera settings for technical credibility',
        'Remove personal location data',
        'Consider keeping shoot location if relevant',
        'Maintain consistent metadata for authenticity'
      ],
      warning: 'Balance privacy with professional transparency'
    }
  ];

  const businessPractices = [
    {
      title: 'Employee Photo Policies',
      description: 'Establish clear guidelines for workplace photography',
      practices: [
        'Train employees on metadata risks',
        'Implement photo review processes',
        'Use ProofPix for company social media',
        'Create metadata removal workflows'
      ]
    },
    {
      title: 'Client Privacy Protection',
      description: 'Protect client information in business photos',
      practices: [
        'Strip location data from client site photos',
        'Remove timestamps that reveal business hours',
        'Protect client device information',
        'Maintain professional metadata standards'
      ]
    },
    {
      title: 'Marketing Material Safety',
      description: 'Ensure marketing photos don\'t leak sensitive data',
      practices: [
        'Review all metadata before publication',
        'Remove office location coordinates',
        'Strip employee device information',
        'Maintain brand consistency in metadata'
      ]
    }
  ];

  const advancedTips = [
    {
      title: 'Camera Settings Configuration',
      description: 'Configure your camera to minimize metadata collection',
      tips: [
        'Disable GPS recording in camera settings',
        'Turn off automatic timestamp adjustment',
        'Disable location services for camera apps',
        'Review and clear stored location data regularly'
      ],
      icon: <Settings className="h-5 w-5 text-blue-400" />
    },
    {
      title: 'Mobile App Privacy Settings',
      description: 'Optimize your phone\'s camera app for privacy',
      tips: [
        'Disable location access for camera apps',
        'Turn off photo location tagging',
        'Review app permissions regularly',
        'Use airplane mode when taking sensitive photos'
      ],
      icon: <Smartphone className="h-5 w-5 text-green-400" />
    },
    {
      title: 'Cloud Storage Considerations',
      description: 'Understand how cloud services handle metadata',
      tips: [
        'Check if cloud services preserve metadata',
        'Use local storage for sensitive photos',
        'Review cloud service privacy policies',
        'Consider metadata when sharing cloud links'
      ],
      icon: <Globe className="h-5 w-5 text-purple-400" />
    },
    {
      title: 'Backup Privacy Practices',
      description: 'Maintain privacy in your photo backup strategy',
      tips: [
        'Encrypt backups containing sensitive photos',
        'Strip metadata before cloud backup',
        'Use local backup for high-privacy photos',
        'Regularly audit backup metadata exposure'
      ],
      icon: <Lock className="h-5 w-5 text-orange-400" />
    }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Privacy Best Practices"
      description="Protect your privacy when sharing photos online"
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
          <div className="bg-red-600 p-3 rounded-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Privacy Best Practices</h1>
            <p className="text-xl text-slate-600 mt-2">
              Protect your privacy when sharing photos online
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="neutral" icon={<Clock className="enterprise-icon-sm" />}>
            10 minute read
          </EnterpriseBadge>
          <EnterpriseBadge variant="warning" icon={<AlertTriangle className="enterprise-icon-sm" />}>
            Privacy critical
          </EnterpriseBadge>
          <EnterpriseBadge variant="primary" icon={<Eye className="enterprise-icon-sm" />}>
            Essential knowledge
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why Photo Privacy Matters */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Why Photo Privacy Matters</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-lg text-gray-300 mb-6">
              Every digital photo contains hidden metadata that can reveal far more about you than the image itself. 
              This invisible data can expose your location, device information, and personal patterns to anyone who knows how to look.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-red-600/20 p-4 rounded-lg mb-3 inline-block">
                  <MapPin className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="font-semibold mb-2 text-red-400">Location Tracking</h3>
                <p className="text-sm text-gray-400">GPS coordinates can reveal your home, work, and travel patterns</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Smartphone className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2 text-orange-400">Device Fingerprinting</h3>
                <p className="text-sm text-gray-400">Camera and phone models can be used to track you across platforms</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="font-semibold mb-2 text-yellow-400">Temporal Patterns</h3>
                <p className="text-sm text-gray-400">Timestamps reveal your daily routines and activity patterns</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600/20 p-4 rounded-lg mb-3 inline-block">
                  <FileText className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2 text-purple-400">Personal Information</h3>
                <p className="text-sm text-gray-400">Software versions and settings can reveal personal details</p>
              </div>
            </div>
          </div>
        </section>

        {/* What Metadata Reveals */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What Metadata Reveals About You</h2>
          <div className="space-y-6">
            {metadataRisks.map((risk, index) => (
              <div key={index} className={`rounded-xl p-6 border ${risk.riskColor}`}>
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-700 p-3 rounded-lg flex-shrink-0">
                    {risk.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">{risk.type}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        risk.risk === 'High' ? 'bg-red-600 text-white' :
                        risk.risk === 'Medium' ? 'bg-orange-600 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        {risk.risk} Risk
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{risk.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {risk.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-center text-sm text-gray-400">
                          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices by Platform */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Best Practices for Different Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformGuidelines.map((platform, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-700 p-2 rounded-lg mr-3">
                    {platform.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{platform.platform}</h3>
                </div>
                
                <ul className="space-y-3 mb-4">
                  {platform.guidelines.map((guideline, guidelineIndex) => (
                    <li key={guidelineIndex} className="flex items-start text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      {guideline}
                    </li>
                  ))}
                </ul>
                
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-300 text-sm">
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    <strong>Warning:</strong> {platform.warning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Business Privacy Practices */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Business Privacy Practices</h2>
          <div className="space-y-6">
            {businessPractices.map((practice, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Briefcase className="h-5 w-5 mr-3 text-blue-400" />
                  {practice.title}
                </h3>
                <p className="text-gray-300 mb-4">{practice.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {practice.practices.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ProofPix Privacy Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">How ProofPix Protects Your Privacy</h2>
          <div className="bg-gradient-to-r from-blue-900/50 to-green-900/50 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Lock className="h-5 w-5 mr-3 text-green-400" />
                  Local Processing Only
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Photos never leave your device
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    No server uploads or cloud storage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    All processing happens in your browser
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-3 text-blue-400" />
                  Zero Data Collection
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    No analytics or tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    No user accounts required
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Open source and transparent
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Privacy Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Advanced Privacy Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advancedTips.map((tip, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  {tip.icon}
                  <span className="ml-3">{tip.title}</span>
                </h3>
                <p className="text-gray-300 mb-4">{tip.description}</p>
                
                <ul className="space-y-2">
                  {tip.tips.map((tipItem, tipIndex) => (
                    <li key={tipIndex} className="flex items-start text-sm text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      {tipItem}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Privacy Checklist */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Quick Privacy Checklist</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">Before sharing any photo online, ask yourself:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-400">🚨 High Priority Checks</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" />
                    <span className="text-gray-300">Does this photo contain GPS coordinates?</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" />
                    <span className="text-gray-300">Could the location reveal my home or work?</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" />
                    <span className="text-gray-300">Is there identifying device information?</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" />
                    <span className="text-gray-300">Could timestamps reveal personal patterns?</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-yellow-400">⚠️ Secondary Checks</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" />
                    <span className="text-gray-300">Have I used ProofPix to check metadata?</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" />
                    <span className="text-gray-300">Is this appropriate for the platform?</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" />
                    <span className="text-gray-300">Do I need to keep any metadata for authenticity?</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" />
                    <span className="text-gray-300">Have I considered long-term privacy implications?</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-red-900/50 to-purple-900/50 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Start Protecting Your Privacy Today</h2>
            <p className="text-gray-300 mb-6">
              Don't let hidden metadata compromise your privacy. Use ProofPix to see what your photos reveal and take control of your digital footprint.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBackHome}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Shield className="h-5 w-5 mr-2" />
                Check Your Photos Now
              </button>
              
              <button
                onClick={() => navigate('/docs/metadata-guide')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Info className="h-5 w-5 mr-2" />
                Learn About Metadata Types
              </button>
            </div>
          </div>
        </section>
      </div>
    </EnterpriseLayout>
  );
};

export default PrivacyGuide; 