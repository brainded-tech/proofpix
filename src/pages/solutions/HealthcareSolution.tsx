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
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
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
      title: 'HIPAA Compliance',
      description: 'Ensure full HIPAA compliance with secure metadata handling and patient privacy protection.'
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: 'Patient Identity Verification',
      description: 'Verify patient identity through medical image metadata and prevent identity fraud.'
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Medical Record Integrity',
      description: 'Maintain the integrity of medical images and ensure authenticity for legal purposes.'
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Audit Trail',
      description: 'Complete audit trails for medical image access and modifications for compliance.'
    }
  ];

  const useCases = [
    'Medical image authentication',
    'Patient identity verification',
    'Insurance claim validation',
    'Medical malpractice investigations',
    'Research data integrity',
    'Telemedicine verification'
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
    <EnterpriseLayout
      showHero
      title="Healthcare Solutions"
      description="HIPAA-compliant metadata analysis for healthcare organizations and medical professionals"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-red-600 p-3 rounded-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Healthcare Solutions</h1>
            <p className="text-xl text-slate-600 mt-2">
              HIPAA-compliant metadata analysis for healthcare organizations
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<Heart className="enterprise-icon-sm" />}>
            Healthcare Grade
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<Lock className="enterprise-icon-sm" />}>
            HIPAA Compliant
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<Shield className="enterprise-icon-sm" />}>
            Secure Processing
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      {/* Features */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Built for Healthcare Security
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
              Healthcare Use Cases
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
            Secure Your Healthcare Data
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join healthcare organizations worldwide using ProofPix for secure medical image analysis.
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

export default HealthcareSolution; 