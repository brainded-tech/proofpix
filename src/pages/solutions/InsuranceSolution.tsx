import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Camera,
  Clock,
  DollarSign,
  AlertTriangle,
  Search
} from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';

const InsuranceSolution: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Fraud Detection',
      description: 'Identify manipulated images and inconsistent metadata to detect fraudulent claims.'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Fast Claims Processing',
      description: 'Accelerate claim verification with automated metadata analysis and validation.'
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Detailed Reports',
      description: 'Generate comprehensive reports for claim documentation and legal proceedings.'
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Cost Reduction',
      description: 'Reduce investigation costs and prevent fraudulent payouts with accurate analysis.'
    }
  ];

  const useCases = [
    'Auto insurance claim verification',
    'Property damage assessment',
    'Workers compensation claims',
    'Health insurance fraud detection',
    'Life insurance investigations',
    'Liability claim validation'
  ];

  const benefits = [
    { metric: '75%', description: 'Faster claim processing' },
    { metric: '60%', description: 'Reduction in fraud losses' },
    { metric: '90%', description: 'Accuracy in detection' },
    { metric: '50%', description: 'Lower investigation costs' }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Insurance Solutions"
      description="Advanced metadata analysis for insurance claim verification and fraud detection"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-green-600 p-3 rounded-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Insurance Solutions</h1>
            <p className="text-xl text-slate-600 mt-2">
              Advanced metadata analysis for claim verification and fraud detection
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<Shield className="enterprise-icon-sm" />}>
            Fraud Detection
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<Clock className="enterprise-icon-sm" />}>
            Fast Processing
          </EnterpriseBadge>
          <EnterpriseBadge variant="warning" icon={<AlertTriangle className="enterprise-icon-sm" />}>
            Risk Assessment
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      {/* Benefits Stats */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Proven Results for Insurance Companies
        </h2>
        
        <EnterpriseGrid columns={4}>
          {benefits.map((benefit, index) => (
            <EnterpriseCard key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {benefit.metric}
              </div>
              <p className="text-slate-600">
                {benefit.description}
              </p>
            </EnterpriseCard>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* Features */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Comprehensive Insurance Tools
        </h2>
        
        <EnterpriseGrid columns={2}>
          {features.map((feature, index) => (
            <EnterpriseCard key={index}>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
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
              Insurance Use Cases
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
              <Camera className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">
                Detect Image Manipulation
              </h3>
              <p className="text-slate-300 mb-6">
                Advanced algorithms identify edited photos, timestamp inconsistencies, and location discrepancies.
              </p>
              <EnterpriseButton 
                variant="primary"
                onClick={() => navigate('/enterprise/demo')}
              >
                See Insurance Demo
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
            Protect Your Business from Fraud
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join leading insurance companies using ProofPix to reduce fraud and accelerate claims.
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

export default InsuranceSolution; 