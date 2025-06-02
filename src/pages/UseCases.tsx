import React from 'react';
import { Link } from 'react-router-dom';
import { ConsistentLayout } from '../components/ui/ConsistentLayout';
import { Building, Shield, Users, FileText, ArrowRight, CheckCircle } from 'lucide-react';

export const UseCases: React.FC = () => {
  const useCases = [
    {
      title: 'Legal Professionals',
      description: 'Evidence authentication, document verification, and chain of custody for legal proceedings.',
      icon: Building,
      href: '/legal',
      features: ['Evidence Authentication', 'Chain of Custody', 'Court-Ready Reports', 'GDPR Compliance'],
      color: 'blue'
    },
    {
      title: 'Insurance Claims',
      description: 'Fraud detection, damage assessment, and automated claim processing with AI analysis.',
      icon: Shield,
      href: '/insurance',
      features: ['Fraud Detection', 'Damage Assessment', 'Automated Processing', 'Risk Analysis'],
      color: 'emerald'
    },
    {
      title: 'Healthcare Systems',
      description: 'Medical image analysis, patient privacy protection, and HIPAA-compliant workflows.',
      icon: Users,
      href: '/healthcare',
      features: ['Medical Imaging', 'HIPAA Compliance', 'Patient Privacy', 'Diagnostic Support'],
      color: 'purple'
    },
    {
      title: 'Real Estate',
      description: 'Property documentation, virtual tours, and automated property assessment.',
      icon: Building,
      href: '/real-estate',
      features: ['Property Documentation', 'Virtual Tours', 'Assessment Reports', 'Market Analysis'],
      color: 'orange'
    },
    {
      title: 'Government & Security',
      description: 'Secure document processing, identity verification, and classified data handling.',
      icon: Shield,
      href: '/government',
      features: ['Document Security', 'Identity Verification', 'Classified Handling', 'Audit Trails'],
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <ConsistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Use Cases
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover how ProofPix transforms image intelligence across industries with 
              privacy-first architecture and enterprise-grade security.
            </p>
          </div>

          {/* Use Cases Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(useCase.color)} rounded-xl flex items-center justify-center mr-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{useCase.title}</h3>
                  </div>
                  
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    {useCase.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {useCase.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    to={useCase.href}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-1 duration-300"
                  >
                    <span className="mr-2">Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Common Benefits */}
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Common Benefits Across All Industries
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
                <p className="text-slate-400 text-sm">
                  Data never leaves your device in Privacy Mode. Architecturally impossible to breach.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Team Collaboration</h3>
                <p className="text-slate-400 text-sm">
                  Secure collaboration mode with encrypted processing and 24-hour auto-deletion.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Compliance Ready</h3>
                <p className="text-slate-400 text-sm">
                  Automatic GDPR, HIPAA, and industry-specific compliance with audit trails.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join 50,000+ professionals who trust ProofPix for their most sensitive image intelligence needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/enterprise/demo"
                className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-200"
              >
                Schedule Demo
              </Link>
              <Link
                to="/pricing"
                className="border border-slate-600 text-slate-300 hover:text-white px-8 py-4 rounded-lg font-semibold hover:border-slate-500 transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ConsistentLayout>
  );
};

export default UseCases; 