import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Eye, 
  Download, 
  FileText, 
  Settings, 
  Globe, 
  Lock, 
  Users, 
  Building2, 
  Camera, 
  Layers, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  Star, 
  Crown, 
  Sparkles,
  ArrowRight,
  Play,
  Code,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Palette,
  Search,
  Filter,
  Share2,
  Archive,
  Workflow,
  Target,
  TrendingUp,
  Award,
  Briefcase,
  Scale,
  Heart,
  MapPin,
  Calendar,
  Image,
  FileImage,
  Cpu,
  HardDrive,
  Network,
  Server,
  Upload
} from 'lucide-react';
import { StandardLayout } from '../components/ui/StandardLayout';

const Features: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<'free' | 'pro' | 'enterprise'>('free');

  const tiers = {
    free: {
      name: 'Free',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'blue',
      description: 'Perfect for personal use and getting started',
      features: [
        'Basic EXIF data extraction',
        'Single image processing',
        'Standard metadata viewing',
        'Basic export options (JSON)',
        'Privacy-first local processing',
        'Mobile-friendly interface'
      ]
    },
    pro: {
      name: 'Pro',
      icon: <Star className="h-6 w-6" />,
      color: 'emerald',
      description: 'Advanced features for professionals',
      features: [
        'Batch processing (up to 50 images)',
        'Advanced metadata analysis',
        'PDF report generation',
        'Custom export formats',
        'Timestamp overlay tools',
        'Enhanced image comparison',
        'Priority processing',
        'Advanced filtering & search'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      icon: <Crown className="h-6 w-6" />,
      color: 'purple',
      description: 'Complete solution for organizations',
      features: [
        'Unlimited batch processing',
        'White-label PDF reports',
        'Custom branding options',
        'API access & integrations',
        'Team management tools',
        'Advanced security features',
        'Custom metadata fields',
        'Dedicated support',
        'SLA guarantees',
        'On-premise deployment options'
      ]
    }
  };

  const coreFeatures = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'Metadata Extraction',
      description: 'Extract comprehensive EXIF, IPTC, and XMP metadata from images',
      details: [
        'Camera settings and technical data',
        'GPS location information',
        'Timestamp and date information',
        'Creator and copyright details',
        'Custom metadata fields',
        'Lens and equipment information'
      ],
      tier: 'free'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Privacy-First Processing',
      description: 'All image processing happens locally in your browser',
      details: [
        'No server uploads required',
        'Complete data privacy',
        'GDPR compliant by design',
        'No tracking or analytics on images',
        'Secure local processing',
        'Zero data retention'
      ],
      tier: 'free'
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: 'Batch Processing',
      description: 'Process multiple images simultaneously for efficiency',
      details: [
        'Drag & drop multiple files',
        'Progress tracking',
        'Bulk export options',
        'Parallel processing',
        'Queue management',
        'Error handling & recovery'
      ],
      tier: 'pro'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Professional Reports',
      description: 'Generate detailed PDF reports with custom branding',
      details: [
        'Comprehensive metadata reports',
        'Custom company branding',
        'Multiple export formats',
        'Automated report generation',
        'Template customization',
        'Digital signatures'
      ],
      tier: 'pro'
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'API Integration',
      description: 'Integrate ProofPix capabilities into your applications',
      details: [
        'RESTful API endpoints',
        'Webhook support',
        'SDK libraries',
        'Rate limiting & quotas',
        'Authentication & security',
        'Comprehensive documentation'
      ],
      tier: 'enterprise'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Team Management',
      description: 'Collaborate with team members and manage permissions',
      details: [
        'User role management',
        'Permission controls',
        'Activity tracking',
        'Team analytics',
        'Shared workspaces',
        'Audit logs'
      ],
      tier: 'enterprise'
    }
  ];

  const useCases = [
    {
      icon: <Scale className="h-6 w-6" />,
      title: 'Legal & Forensics',
      description: 'Evidence analysis and digital forensics',
      features: ['Chain of custody tracking', 'Tamper detection', 'Court-ready reports']
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: 'Insurance Claims',
      description: 'Photo verification for claims processing',
      features: ['Timestamp verification', 'Location validation', 'Fraud detection']
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Healthcare',
      description: 'Medical imaging metadata management',
      features: ['HIPAA compliance', 'Patient privacy', 'Secure processing']
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: 'Photography',
      description: 'Professional photo management',
      features: ['Portfolio organization', 'Copyright protection', 'Technical analysis']
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Media & Publishing',
      description: 'Content verification and management',
      features: ['Source verification', 'Rights management', 'Workflow integration']
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'Corporate Security',
      description: 'Enterprise data protection',
      features: ['Data loss prevention', 'Compliance monitoring', 'Risk assessment']
    }
  ];

  const technicalCapabilities = [
    {
      category: 'Supported Formats',
      icon: <FileImage className="h-6 w-6" />,
      items: ['JPEG/JPG', 'PNG', 'TIFF', 'HEIC/HEIF', 'WebP', 'RAW formats']
    },
    {
      category: 'Metadata Standards',
      icon: <Database className="h-6 w-6" />,
      items: ['EXIF 2.3', 'IPTC Core', 'XMP', 'Dublin Core', 'Custom schemas']
    },
    {
      category: 'Export Options',
      icon: <Download className="h-6 w-6" />,
      items: ['JSON', 'CSV', 'XML', 'PDF Reports', 'Excel', 'Custom formats']
    },
    {
      category: 'Security Features',
      icon: <Lock className="h-6 w-6" />,
      items: ['End-to-end encryption', 'Zero-knowledge processing', 'Secure APIs', 'Audit trails']
    },
    {
      category: 'Platform Support',
      icon: <Monitor className="h-6 w-6" />,
      items: ['Web browsers', 'Mobile responsive', 'Desktop apps', 'API integration']
    },
    {
      category: 'Performance',
      icon: <Zap className="h-6 w-6" />,
      items: ['Real-time processing', 'Parallel execution', 'Optimized algorithms', 'Scalable architecture']
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'blue';
      case 'pro': return 'emerald';
      case 'enterprise': return 'purple';
      default: return 'blue';
    }
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      free: 'bg-blue-100 text-blue-800 border-blue-200',
      pro: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      enterprise: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors[tier as keyof typeof colors]}`}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </span>
    );
  };

  return (
    <StandardLayout
      title="Features & Capabilities"
      description="Comprehensive image metadata analysis tools for every use case"
      showHero={true}
      heroContent={
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 mb-6 leading-tight">
            Powerful Features for
            <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Every Use Case
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            From basic metadata extraction to enterprise-grade analysis tools, 
            ProofPix provides comprehensive image intelligence solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate('/enterprise/demo')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Try Demo</span>
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-8 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
            >
              <TrendingUp className="h-5 w-5" />
              <span>View Pricing</span>
            </button>
          </div>
        </div>
      }
    >
      {/* Tier Overview */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Choose Your Tier</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Select a tier to explore features tailored to your needs
          </p>
        </div>

        {/* Tier Selector */}
        <div className="flex flex-col sm:flex-row justify-center mb-8 space-y-2 sm:space-y-0 sm:space-x-2">
          {Object.entries(tiers).map(([key, tier]) => (
            <button
              key={key}
              onClick={() => setSelectedTier(key as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                selectedTier === key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tier.icon}
              <span>{tier.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Tier Details */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {tiers[selectedTier].icon}
              <h3 className="text-2xl font-bold text-slate-100 ml-3">
                {tiers[selectedTier].name} Tier
              </h3>
            </div>
            <p className="text-slate-400 text-lg">
              {tiers[selectedTier].description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiers[selectedTier].features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-slate-700/30 rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-200">{feature}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button 
              onClick={() => navigate('/pricing')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <span>Get Started with {tiers[selectedTier].name}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Core Features</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Comprehensive tools for image metadata analysis and management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreFeatures.map((feature, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                  {feature.icon}
                </div>
                {getTierBadge(feature.tier)}
              </div>
              
              <h3 className="text-xl font-semibold text-slate-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 mb-4">
                {feature.description}
              </p>
              
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start space-x-2 text-sm text-slate-300">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Industry Use Cases</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Trusted by professionals across various industries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:bg-slate-800/50 transition-colors">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center text-emerald-400 mb-4">
                {useCase.icon}
              </div>
              
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                {useCase.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {useCase.description}
              </p>
              
              <ul className="space-y-1">
                {useCase.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2 text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Capabilities */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Technical Capabilities</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Built on cutting-edge technology for reliable performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicalCapabilities.map((capability, index) => (
            <div key={index} className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400">
                  {capability.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {capability.category}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {capability.items.map((item, itemIndex) => (
                  <span key={itemIndex} className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Stats */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl border border-slate-600/50 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Performance & Scale</h2>
            <p className="text-slate-400 text-lg">
              Built for speed, reliability, and scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-2">&lt; 1s</div>
              <div className="text-slate-400">Processing Time</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <HardDrive className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-2">50MB</div>
              <div className="text-slate-400">Max File Size</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400 mx-auto mb-4">
                <Layers className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-2">1000+</div>
              <div className="text-slate-400">Batch Capacity</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600/20 rounded-2xl flex items-center justify-center text-orange-400 mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-2">100%</div>
              <div className="text-slate-400">Privacy Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust ProofPix for their image metadata analysis needs.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-colors flex items-center space-x-2"
            >
              <Upload className="h-5 w-5" />
              <span>Start Free Analysis</span>
            </button>
            
            <button 
              onClick={() => navigate('/enterprise/demo')}
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-8 py-4 rounded-xl font-medium transition-colors flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
            
            <button 
              onClick={() => navigate('/contact')}
              className="text-slate-300 hover:text-slate-100 px-8 py-4 rounded-xl font-medium transition-colors flex items-center space-x-2"
            >
              <span>Contact Sales</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
};

export default Features; 