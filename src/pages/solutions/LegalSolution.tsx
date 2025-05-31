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
      title: 'Chain of Custody',
      description: 'Maintain complete audit trails for digital evidence with cryptographic verification.'
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Forensic Integrity',
      description: 'Preserve original metadata while ensuring evidence admissibility in court.'
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Court-Ready Reports',
      description: 'Generate professional reports that meet legal standards and requirements.'
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Privacy Compliance',
      description: 'Ensure GDPR, CCPA, and other privacy regulation compliance in evidence handling.'
    }
  ];

  const useCases = [
    'Digital forensics investigations',
    'Evidence authentication',
    'Litigation support',
    'Insurance fraud detection',
    'Intellectual property protection',
    'Employment law cases'
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Legal Solutions"
      description="Professional-grade metadata analysis for legal professionals and law enforcement"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Legal Solutions</h1>
            <p className="text-xl text-slate-600 mt-2">
              Professional-grade metadata analysis for legal professionals
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<Scale className="enterprise-icon-sm" />}>
            Legal Grade
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<Shield className="enterprise-icon-sm" />}>
            Court Admissible
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<Lock className="enterprise-icon-sm" />}>
            Forensically Sound
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      {/* Features */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Built for Legal Professionals
        </h2>
        
        <EnterpriseGrid columns={2}>
          {features.map((feature, index) => (
            <EnterpriseCard key={index}>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
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

      {/* Use Cases */}
      <EnterpriseSection size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Common Use Cases
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
                Save 80% of Investigation Time
              </h3>
              <p className="text-slate-300 mb-6">
                Automated metadata extraction and analysis reduces manual work from hours to minutes.
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
            Ready to Enhance Your Legal Practice?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join hundreds of legal professionals using ProofPix for digital evidence analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnterpriseButton 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/enterprise/demo')}
            >
              Start Free Trial
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/enterprise#contact')}
            >
              Contact Sales
            </EnterpriseButton>
          </div>
        </div>
      </EnterpriseSection>
    </EnterpriseLayout>
  );
};

export default LegalSolution; 