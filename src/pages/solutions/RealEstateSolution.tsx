import React from 'react';
import { StandardLayout } from '../../components/ui/StandardLayout';
import { BackToHomeButton } from '../../components/ui/BackToHomeButton';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Shield, 
  Camera, 
  MapPin, 
  Clock, 
  FileText, 
  Users, 
  CheckCircle,
  ArrowRight,
  Star,
  DollarSign,
  Lock,
  Eye,
  Award
} from 'lucide-react';

const RealEstateSolution: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "GPS Verification",
      description: "Verify exact property locations with tamper-proof GPS metadata extraction."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Timestamp Authentication",
      description: "Prove when photos were taken with cryptographically verified timestamps."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "MLS Compliance",
      description: "Meet all MLS requirements with automated compliance checking."
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Property Documentation",
      description: "Complete property condition documentation with metadata integrity."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Listing Verification",
      description: "Ensure listing photos are authentic and accurately represent properties."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Privacy Protection",
      description: "Process sensitive property data without exposing client information."
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Increase Listing Trust",
      description: "Verified photos build buyer confidence and reduce time on market"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Legal Protection",
      description: "Tamper-proof documentation protects against disputes and liability"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Client Confidence",
      description: "Show clients you use professional-grade verification technology"
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Industry Leadership",
      description: "Stand out from competitors with cutting-edge property verification"
    }
  ];

  const useCases = [
    {
      title: "Listing Photography",
      description: "Verify all listing photos are authentic, recent, and accurately represent the property condition.",
      icon: <Camera className="w-8 h-8" />
    },
    {
      title: "Property Inspections",
      description: "Document property conditions with tamper-proof timestamps for insurance and legal purposes.",
      icon: <FileText className="w-8 h-8" />
    },
    {
      title: "Market Analysis",
      description: "Ensure comparable property photos are legitimate and current for accurate market valuations.",
      icon: <Building2 className="w-8 h-8" />
    }
  ];

  return (
    <StandardLayout
      title="Real Estate Solutions"
      description="MLS-compliant property documentation with verified timestamps and locations"
      showHero={true}
      backgroundColor="dark"
    >
      {/* Navigation Header */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackToHomeButton variant="minimal" />
              <div className="h-6 w-px bg-slate-600"></div>
              <button
                onClick={() => navigate('/solutions')}
                className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Building2 className="h-4 w-4" />
                <span>Solutions</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-orange-400" />
              <h1 className="text-xl font-semibold text-white">Real Estate Solution</h1>
            </div>
            <div></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-500/20 px-4 py-2 rounded-full mb-6">
              <Building2 className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-semibold text-orange-400">REAL ESTATE SOLUTION</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Verify Every Property Photo
              <span className="block text-orange-400">Build Unshakeable Trust</span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Stop losing deals to photo authenticity questions. ProofPix provides MLS-compliant 
              property documentation with cryptographically verified timestamps and GPS locations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center">
                <Eye className="w-5 h-5 mr-2" />
                Try Demo
              </button>
              <button className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Professional Property Verification
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Every feature designed specifically for real estate professionals who demand authenticity and compliance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-700/50 p-6 rounded-xl border border-slate-600/50 hover:border-orange-500/50 transition-colors">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-orange-400">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Real Estate Use Cases
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              From listing photography to property inspections, ensure every image tells the truth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-orange-400">{useCase.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{useCase.title}</h3>
                <p className="text-slate-400 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Real Estate Professionals Choose ProofPix
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400">{benefit.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-slate-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Verify Your Property Photos?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of real estate professionals who trust ProofPix for authentic property documentation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-colors flex items-center justify-center">
              <ArrowRight className="w-5 h-5 mr-2" />
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
};

export default RealEstateSolution; 