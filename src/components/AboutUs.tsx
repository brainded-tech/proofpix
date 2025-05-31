import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Globe, 
  Award, 
  Target, 
  Heart,
  Building2,
  Zap,
  Lock,
  CheckCircle,
  ArrowRight,
  Camera,
  Code,
  Briefcase
} from 'lucide-react';
import { StandardLayout } from './ui/StandardLayout';

export const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { number: '100K+', label: 'Photos Processed', icon: Camera },
    { number: '50+', label: 'Countries Served', icon: Globe },
    { number: '99.9%', label: 'Privacy Protection', icon: Shield },
    { number: '0', label: 'Data Stored', icon: Lock }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All photo processing happens locally in your browser. Your images never leave your device, ensuring complete privacy and security.'
    },
    {
      icon: Users,
      title: 'User Focused',
      description: 'Built for photographers, legal professionals, and anyone who needs reliable photo metadata analysis without compromising privacy.'
    },
    {
      icon: Code,
      title: 'Open Source',
      description: 'Transparent, auditable code that you can trust. Our open-source approach ensures accountability and community-driven improvements.'
    },
    {
      icon: Globe,
      title: 'Accessible',
      description: 'Professional-grade EXIF analysis tools accessible to everyone, from hobbyist photographers to forensic investigators.'
    }
  ];

  return (
    <StandardLayout
      showHero
      title="About ProofPix"
      description="Privacy-first photo metadata extraction tool built for professionals and photography enthusiasts."
      maxWidth="7xl"
    >
      {/* Mission Statement */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              To provide the most trusted, privacy-respecting photo metadata analysis tool available. 
              We believe that powerful EXIF analysis shouldn't require uploading your photos to unknown servers 
              or compromising your privacy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white px-6 py-3 rounded-lg border border-slate-200">
                <span className="text-slate-700 font-medium">📸 Photo Metadata</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg border border-slate-200">
                <span className="text-slate-700 font-medium">🔒 Complete Privacy</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg border border-slate-200">
                <span className="text-slate-700 font-medium">🌍 Open Source</span>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
          </div>
        </section>

      {/* Our Story */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                ProofPix was created out of frustration with existing photo metadata tools that required 
                uploading sensitive images to remote servers. As photographers and privacy advocates, 
                we knew there had to be a better way.
              </p>
              <p>
                Using modern web technologies, we built a completely client-side solution that extracts 
                EXIF data, GPS coordinates, camera settings, and more - all without your photos ever 
                leaving your device. This approach ensures complete privacy while providing professional-grade analysis.
              </p>
              <p>
                Today, ProofPix serves photographers, legal professionals, forensic analysts, and privacy-conscious 
                users worldwide. Every photo processed stays on your device, making data breaches impossible 
                and your privacy guaranteed.
              </p>
            </div>
            <div className="mt-8">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <span>Try ProofPix Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            </div>
          <div className="bg-slate-100 rounded-2xl p-8 h-96 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Camera className="w-24 h-24 mx-auto mb-4" />
              <p>Privacy-First Photo Analysis</p>
            </div>
            </div>
          </div>
        </section>

      {/* Values */}
      <section className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our Values
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The principles that guide how we build and maintain ProofPix
          </p>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <value.icon className="w-6 h-6 text-blue-600" />
            </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{value.title}</h3>
              <p className="text-slate-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
          </div>
        </section>

      {/* Recognition */}
      <section className="mb-20">
        <div className="bg-slate-900 text-white rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose ProofPix?
            </h2>
            <p className="text-xl text-slate-300">
              Trusted by professionals and privacy advocates worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">100% Private</h3>
              <p className="text-slate-300">Photos never leave your device</p>
            </div>
            <div className="text-center">
              <Code className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Open Source</h3>
              <p className="text-slate-300">Transparent and auditable code</p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
              <p className="text-slate-300">Built with user feedback and contributions</p>
            </div>
            </div>
          </div>
        </section>

      {/* CTA */}
      <section className="text-center">
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Analyze Your Photos?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Start extracting metadata from your photos with complete privacy and professional-grade accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Start Analyzing Photos
            </button>
          <button
              onClick={() => navigate('/faq')}
              className="border border-slate-300 hover:border-slate-400 text-slate-700 px-8 py-4 rounded-lg font-semibold transition-colors bg-white"
          >
              Learn More
          </button>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}; 
