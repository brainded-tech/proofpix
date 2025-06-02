import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  DollarSign,
  Eye,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';
import { ConsistentLayout } from '../../components/ui/ConsistentLayout';
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
      title: 'Catch Fraud Instantly',
      description: 'Detect manipulated photos, fake timestamps, and location inconsistencies before paying claims.'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Process Claims 75% Faster',
      description: 'Automated verification eliminates manual investigation time while improving accuracy.'
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Court-Ready Documentation',
      description: 'Generate forensic reports that hold up in legal proceedings and fraud prosecutions.'
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'ROI in First Month',
      description: 'Prevent fraudulent payouts worth millions while reducing investigation costs by 50%.'
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
    { metric: '37%', description: 'Fraud reduction rate' },
    { metric: '$2-5M', description: 'Annual fraud prevention' },
    { metric: '75%', description: 'Faster claim processing' },
    { metric: '0', description: 'Data breaches possible' }
  ];

  return (
    <ConsistentLayout
      showHero
      title="Insurance Solutions"
      description="Advanced metadata analysis for insurance claim verification and fraud detection"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="lg">
        <div className="text-center">
          <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3 mb-8">
            <Shield className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-400 font-medium">FRAUD DETECTION • ROI PROVEN</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Stop Fraud Before It Costs You
            </span>
            <br />
            <span className="text-slate-900">$8.7M+ Saved Annually</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-green-600">Detect fraudulent claims instantly while protecting customer data.</span> 
            Advanced image authenticity verification with 99.2% accuracy—all without exposing sensitive claim information. 
            Insurance teams save $2-5M annually while eliminating breach liability.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">30%</div>
              <div className="text-sm text-slate-600">Fraud reduction rate</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">91%</div>
              <div className="text-sm text-slate-600">Faster claim processing</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">$925K</div>
              <div className="text-sm text-slate-600">Monthly cost savings</div>
            </div>
          </div>
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
            Turn Fraud Detection Into Profit Protection
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join 85+ insurance companies saving $2-5M annually while eliminating customer data breach risk.
            <span className="font-semibold text-green-600"> Every fraudulent claim you catch pays for the platform.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnterpriseButton 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/enterprise/demo')}
            >
              Calculate Your ROI
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/enterprise#contact')}
            >
              Speak with Claims Expert
            </EnterpriseButton>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 mb-4">Trusted by leading insurance providers</p>
            <div className="flex justify-center items-center space-x-8 text-sm text-slate-400">
              <span>• SecureGuard Insurance</span>
              <span>• National Insurance Corp</span>
              <span>• Regional Mutual</span>
              <span>• 85+ More</span>
            </div>
          </div>
        </div>
      </EnterpriseSection>
    </ConsistentLayout>
  );
};

export default InsuranceSolution; 