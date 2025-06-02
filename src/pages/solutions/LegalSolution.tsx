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
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';

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
    <EnterpriseLayout
      showHero
      title="Legal Solutions"
      description="Professional-grade metadata analysis for legal professionals and law enforcement"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="lg">
        <div className="text-center">
          <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8">
            <Scale className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-400 font-medium">COURT-TESTED • EVIDENCE-GRADE</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Court-Admissible Evidence
            </span>
            <br />
            <span className="text-slate-900">Analysis That Can't Be Compromised</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-blue-600">Strengthen your cases with unbreakable chain of custody protection.</span> 
            Analyze digital evidence with forensic-grade accuracy while eliminating data breach risk entirely. 
            Used in 1,000+ court cases with 99.9% admissibility rate.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">99.9%</div>
              <div className="text-sm text-slate-600">Court admissibility rate</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">$0</div>
              <div className="text-sm text-slate-600">Evidence breach risk</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
              <div className="text-sm text-slate-600">Legal teams protected</div>
            </div>
          </div>
        </div>
      </EnterpriseSection>

      {/* Features */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Why Legal Teams Choose Unbreakable Privacy
        </h2>
        
        <EnterpriseGrid columns={2}>
          {features.map((feature, index) => (
            <EnterpriseCard key={index}>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                    {feature.isPro && (
                      <EnterpriseBadge variant="primary">Pro Feature</EnterpriseBadge>
                    )}
                  </div>
                  <p className="text-slate-600 mb-3">
                    {feature.description}
                  </p>
                  {feature.link && (
                    <button
                      onClick={() => navigate(feature.link)}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Explore Chain of Custody
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </EnterpriseCard>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* Chain of Custody Section */}
      <EnterpriseSection size="lg">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gavel className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Chain of Custody Tracking
                </h2>
                <EnterpriseBadge variant="primary">Pro Feature</EnterpriseBadge>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Maintain cryptographically verified chain of custody for digital evidence. 
                Every access, modification, and transfer is logged with tamper-proof timestamps 
                and user authentication, ensuring court admissibility and legal compliance.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Cryptographic integrity verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Federal Rules of Evidence (FRE) compliance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Court-admissible documentation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">Multi-signature custody management</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <EnterpriseButton 
                  variant="primary"
                  onClick={() => navigate('/enterprise/chain-of-custody')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Explore Chain of Custody
                </EnterpriseButton>
                <EnterpriseButton 
                  variant="secondary"
                  onClick={() => navigate('/pricing')}
                >
                  View Pro Pricing
                </EnterpriseButton>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Chain of Custody Features
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Tamper Detection</h4>
                    <p className="text-sm text-slate-600">Real-time alerts for any integrity violations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">User Tracking</h4>
                    <p className="text-sm text-slate-600">Complete audit trail of all access events</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Court Reports</h4>
                    <p className="text-sm text-slate-600">Automated generation of legal documentation</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Chain of Custody tracking requires a Pro or Enterprise account. 
                  <button 
                    onClick={() => navigate('/pricing')} 
                    className="text-blue-700 underline hover:text-blue-900 font-medium"
                  >
                    Upgrade to access this feature
                  </button>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </EnterpriseSection>

      {/* Use Cases */}
      <EnterpriseSection size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Strengthen Every Case
            </h2>
            <div className="space-y-4">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
          
          <EnterpriseCard variant="dark">
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">
                Win More Cases, Risk Less Data
              </h3>
              <p className="text-slate-300 mb-6">
                Join 500+ legal teams who chose evidence analysis that can't be breached, tampered with, or subpoenaed.
              </p>
              <EnterpriseButton 
                variant="primary"
                onClick={() => navigate('/enterprise/demo')}
              >
                See Legal Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </EnterpriseButton>
            </div>
          </EnterpriseCard>
        </div>
      </EnterpriseSection>

      {/* CTA */}
      <EnterpriseSection size="lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Win More Cases with Unbreakable Evidence
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join 500+ legal professionals who chose evidence analysis that strengthens cases instead of creating liability.
            <span className="font-semibold text-blue-600"> Your clients' trust depends on uncompromised evidence.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnterpriseButton 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/enterprise/demo')}
            >
              Analyze Evidence Risk-Free
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/enterprise#contact')}
            >
              Speak with Legal Expert
            </EnterpriseButton>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 mb-4">Trusted by leading law firms nationwide</p>
            <div className="flex justify-center items-center space-x-8 text-sm text-slate-400">
              <span>• Morrison & Associates</span>
              <span>• Federal Security Agency</span>
              <span>• Pacific Legal Group</span>
              <span>• 500+ More</span>
            </div>
          </div>
        </div>
      </EnterpriseSection>
    </EnterpriseLayout>
  );
};

export default LegalSolution; 