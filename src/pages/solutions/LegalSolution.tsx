import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  Shield, 
  FileText, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Gavel,
  Lock,
  Eye,
  Clock
} from 'lucide-react';
import { ConsistentLayout } from '../../components/ui/ConsistentLayout';

const LegalSolution: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Gavel className="h-6 w-6" />,
      title: 'Unbreakable Chain of Custody',
      description: 'Cryptographic proof that evidence hasn\'t been tampered with—because it never left your device.',
      isPro: true,
      link: '/enterprise/chain-of-custody'
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Evidence That Can\'t Be Hacked',
      description: 'Analyze sensitive evidence without data breach risk—technically impossible to compromise.'
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Court-Ready in Seconds',
      description: 'Generate forensic reports that judges trust and opposing counsel can\'t challenge.'
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Privacy Compliance by Design',
      description: 'Meet GDPR, CCPA, and attorney-client privilege requirements automatically—no policies needed.'
    }
  ];

  const useCases = [
    'Win cases with tamper-proof digital evidence',
    'Protect attorney-client privilege automatically',
    'Meet discovery requirements without data risk',
    'Stop insurance fraud before it costs clients',
    'Defend intellectual property with forensic proof',
    'Handle employment disputes with confidence'
  ];

  return (
    <ConsistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8">
                <Scale className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-blue-400 font-medium">COURT-TESTED • EVIDENCE-GRADE</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Court-Admissible Evidence
                </span>
                <br />
                <span className="text-white">Analysis That Can't Be Compromised</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                <span className="font-semibold text-blue-300">Strengthen your cases with unbreakable chain of custody protection.</span> 
                Analyze digital evidence with forensic-grade accuracy while eliminating data breach risk entirely. 
                Used in 1,000+ court cases with 99.9% admissibility rate.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400 mb-1">99.9%</div>
                  <div className="text-sm text-blue-200">Court admissibility rate</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400 mb-1">$0</div>
                  <div className="text-sm text-blue-200">Evidence breach risk</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400 mb-1">500+</div>
                  <div className="text-sm text-blue-200">Legal teams protected</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Why Legal Teams Choose Unbreakable Privacy
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500/20 p-3 rounded-lg flex-shrink-0">
                      <div className="text-blue-400">{feature.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {feature.title}
                        </h3>
                        {feature.isPro && (
                          <div className="bg-blue-500/20 px-2 py-1 rounded-full border border-blue-500/50">
                            <span className="text-blue-300 text-xs">Pro Feature</span>
                          </div>
                        )}
                      </div>
                      <p className="text-slate-300 mb-3">
                        {feature.description}
                      </p>
                      {feature.link && (
                        <button
                          onClick={() => navigate(feature.link)}
                          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          Explore Chain of Custody
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chain of Custody Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/30">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Gavel className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">
                      Chain of Custody Tracking
                    </h2>
                    <div className="bg-blue-500/20 px-2 py-1 rounded-full border border-blue-500/50">
                      <span className="text-blue-300 text-xs">Pro Feature</span>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Maintain cryptographically verified chain of custody for digital evidence. 
                    Every access, modification, and transfer is logged with tamper-proof timestamps 
                    and user authentication, ensuring court admissibility and legal compliance.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">Cryptographic integrity verification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">Federal Rules of Evidence (FRE) compliance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">Court-admissible documentation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">Multi-signature custody management</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => navigate('/enterprise/chain-of-custody')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Explore Chain of Custody
                    </button>
                    <button 
                      onClick={() => navigate('/pricing')}
                      className="bg-slate-800/50 text-white hover:bg-slate-700/50 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-slate-600/50"
                    >
                      View Pro Pricing
                    </button>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Chain of Custody Features
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-slate-300 text-sm">Tamper-proof evidence logging</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-slate-300 text-sm">Multi-party digital signatures</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-slate-300 text-sm">Automated compliance reports</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-slate-300 text-sm">Court-ready documentation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Legal Use Cases
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{useCase}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Strengthen Your Cases?</h2>
              <p className="text-xl text-blue-100 mb-6">
                Join 500+ legal teams using ProofPix for unbreakable evidence analysis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/enterprise')}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
                >
                  Start Enterprise Trial
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="border border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
                >
                  Contact Legal Team
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ConsistentLayout>
  );
};

export default LegalSolution; 