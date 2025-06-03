import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  FileText, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Lock,
  Eye,
  Clock,
  UserCheck,
  Database
} from 'lucide-react';
import { ConsistentLayout } from '../../components/ui/ConsistentLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';

const HealthcareSolution: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'HIPAA Compliance Without Policies',
      description: 'Meet HIPAA requirements automatically—patient data never leaves your device, making breaches technically impossible.'
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: 'Protect Patient Privacy Absolutely',
      description: 'Analyze medical images without exposing patient data to third parties or cloud servers.'
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Maintain Medical Record Integrity',
      description: 'Verify image authenticity and detect tampering without compromising patient confidentiality.'
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Audit Trails That Can\'t Be Hacked',
      description: 'Generate compliance documentation with cryptographic proof of data handling integrity.'
    }
  ];

  const useCases = [
    'Verify medical image authenticity without patient data exposure',
    'Meet HIPAA requirements automatically with zero-transmission analysis',
    'Validate insurance claims while protecting patient privacy',
    'Support malpractice defense with tamper-proof evidence',
    'Ensure research data integrity without privacy compromise',
    'Enable secure telemedicine with verified image metadata'
  ];

  const compliance = [
    'HIPAA (Health Insurance Portability and Accountability Act)',
    'HITECH (Health Information Technology for Economic and Clinical Health)',
    'FDA 21 CFR Part 11 (Electronic Records)',
    'GDPR (General Data Protection Regulation)',
    'SOC 2 Type II Compliance',
    'ISO 27001 Information Security'
  ];

  return (
    <ConsistentLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Healthcare Solutions
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            HIPAA-compliant metadata analysis for healthcare organizations and medical professionals
          </p>
        </div>

        {/* Header */}
        <EnterpriseSection size="lg">
          <div className="text-center">
            <div className="inline-flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-3 mb-8">
              <Heart className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-purple-400 font-medium">HIPAA COMPLIANT • PATIENT SAFE</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                HIPAA Compliance Without Policies
              </span>
              <br />
              <span className="text-slate-900">Protect Patient Privacy Absolutely</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold text-purple-600">Analyze medical images without exposing patient data—ever.</span> 
              Automatic HIPAA compliance through architecture, not policies. No PHI transmission, no breach risk, 
              no compliance headaches. Used by 120+ healthcare organizations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
                <div className="text-sm text-slate-600">HIPAA compliance rate</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                <div className="text-sm text-slate-600">PHI exposures ever</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-1">120+</div>
                <div className="text-sm text-slate-600">Healthcare orgs protected</div>
              </div>
            </div>
          </div>
        </EnterpriseSection>

        {/* Features */}
        <EnterpriseSection size="lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Why Healthcare Organizations Choose Unbreachable Privacy
          </h2>
          
          <EnterpriseGrid columns={2}>
            {features.map((feature, index) => (
              <EnterpriseCard key={index}>
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </EnterpriseCard>
            ))}
          </EnterpriseGrid>
        </EnterpriseSection>

        {/* Use Cases and Compliance */}
        <EnterpriseSection size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Protect Patients, Enable Care
              </h2>
              <div className="space-y-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <span className="text-slate-700">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Compliance Standards
              </h2>
              <div className="space-y-4">
                {compliance.map((standard, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </EnterpriseSection>

        {/* Security Highlight */}
        <EnterpriseSection size="lg">
          <EnterpriseCard variant="dark" className="text-center">
            <Lock className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Zero-Knowledge Architecture
            </h2>
            <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
              Our zero-knowledge architecture ensures that patient data never leaves your environment. 
              All processing happens locally with end-to-end encryption.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <Clock className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white mb-1">Real-time Processing</h3>
                <p className="text-slate-400 text-sm">Instant metadata analysis</p>
              </div>
              <div className="text-center">
                <Eye className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white mb-1">Complete Privacy</h3>
                <p className="text-slate-400 text-sm">No data transmission</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-white mb-1">Full Compliance</h3>
                <p className="text-slate-400 text-sm">HIPAA & HITECH ready</p>
              </div>
            </div>
          </EnterpriseCard>
        </EnterpriseSection>

        {/* CTA */}
        <EnterpriseSection size="lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Make HIPAA Violations Technically Impossible
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join 120+ healthcare organizations who chose medical imaging analysis that can't expose patient data—ever.
              <span className="font-semibold text-purple-600"> When patient trust is everything, "unhackable" isn't optional.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnterpriseButton 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/enterprise/demo')}
              >
                Analyze Medical Images Risk-Free
              </EnterpriseButton>
              <EnterpriseButton 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/enterprise#contact')}
              >
                Speak with HIPAA Expert
              </EnterpriseButton>
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 mb-4">Trusted by leading healthcare systems</p>
              <div className="flex justify-center items-center space-x-8 text-sm text-slate-400">
                <span>• MedSecure Health Systems</span>
                <span>• Northeast Medical</span>
                <span>• Regional Health Network</span>
                <span>• 120+ More</span>
              </div>
            </div>
          </div>
        </EnterpriseSection>
      </div>
    </ConsistentLayout>
  );
};

export default HealthcareSolution; 