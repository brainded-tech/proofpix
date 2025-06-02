import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Eye,
  Clock,
  Users,
  Phone,
  Calendar,
  AlertTriangle,
  BarChart3,
  Camera,
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
import { BackToHomeButton } from '../../components/ui/BackToHomeButton';

const InsuranceAIPackage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Claims Document Analysis',
      description: 'AI-powered processing of insurance claims with automated damage assessment and validation.',
      benefits: ['95% accuracy in damage assessment', 'Automated claim routing', 'Real-time fraud scoring']
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: 'Damage Assessment',
      description: 'Intelligent analysis of damage photos with cost estimation and repair recommendations.',
      benefits: ['Automated damage scoring', 'Cost estimation', 'Repair timeline prediction']
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Risk Scoring',
      description: 'Advanced risk assessment using AI analysis of claims history and patterns.',
      benefits: ['Predictive risk modeling', 'Premium optimization', 'Underwriting automation']
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Policy Document Processing',
      description: 'Automated processing and analysis of policy documents with compliance checking.',
      benefits: ['Policy validation', 'Coverage analysis', 'Compliance monitoring']
    }
  ];

  const useCases = [
    {
      title: 'Claims Processing Acceleration',
      description: 'Process insurance claims 65% faster with AI-powered analysis',
      timesSaved: '45 hours/week',
      costSavings: '$16,000/month'
    },
    {
      title: 'Fraud Detection',
      description: 'Reduce fraudulent claims by 80% with AI pattern recognition',
      timesSaved: '30 hours/week',
      costSavings: '$100,000/month'
    },
    {
      title: 'Damage Assessment',
      description: 'Automate damage assessment reducing adjuster visits by 70%',
      timesSaved: '60 hours/week',
      costSavings: '$22,000/month'
    }
  ];

  const handleContactSales = () => {
    navigate('/enterprise#contact');
  };

  const handleScheduleDemo = () => {
    navigate('/enterprise/demo');
  };

  const handleSelfSetup = () => {
    navigate('/pricing?package=insurance-ai');
  };

  return (
    <EnterpriseLayout
      showHero
      title="Insurance AI Package"
      description="Claims processing and risk assessment AI"
      maxWidth="6xl"
    >
      <BackToHomeButton variant="enterprise" />
      
      {/* Header */}
      <EnterpriseSection size="lg">
        <div className="text-center">
          <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-3 mb-8">
            <Shield className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-400 font-medium">INSURANCE AI • CLAIMS PROCESSING</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Insurance AI Package
            </span>
            <br />
            <span className="text-slate-900">Claims Processing & Risk Assessment</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-blue-600">Accelerate claims processing with AI-powered damage assessment.</span> 
            Process claims 45% faster while reducing fraud by 80% with intelligent pattern recognition.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">$3,499</div>
              <div className="text-sm text-slate-600">per month</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">45%</div>
              <div className="text-sm text-slate-600">faster claims processing</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">80%</div>
              <div className="text-sm text-slate-600">fraud reduction</div>
            </div>
          </div>
        </div>
      </EnterpriseSection>

      {/* Features */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          AI-Powered Insurance Processing
        </h2>
        
        <EnterpriseGrid columns={2}>
          {features.map((feature, index) => (
            <EnterpriseCard key={index}>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, bIndex) => (
                      <div key={bIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </EnterpriseCard>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* Use Cases & ROI */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Real-World Impact for Insurance Companies
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <EnterpriseCard key={index} variant="dark">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-slate-300 mb-4">
                  {useCase.description}
                </p>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-400">
                    {useCase.timesSaved}
                  </div>
                  <div className="text-sm text-slate-400">Time Saved</div>
                  <div className="text-lg font-semibold text-green-400">
                    {useCase.costSavings}
                  </div>
                  <div className="text-sm text-slate-400">Cost Savings</div>
                </div>
              </div>
            </EnterpriseCard>
          ))}
        </div>
      </EnterpriseSection>

      {/* CTA Section */}
      <EnterpriseSection size="lg">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Transform Your Claims Processing?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Join 150+ insurance companies who chose AI-powered claims processing with advanced fraud detection. 
              <span className="font-semibold text-blue-600">Faster claims, happier customers.</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <EnterpriseCard className="text-center">
                <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Talk to Insurance Expert</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Speak with our insurance technology specialists
                </p>
                <EnterpriseButton 
                  variant="primary"
                  onClick={handleContactSales}
                  className="w-full"
                >
                  Contact Sales
                </EnterpriseButton>
              </EnterpriseCard>

              <EnterpriseCard className="text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Schedule Demo</h3>
                <p className="text-sm text-slate-600 mb-4">
                  See claims processing AI in action
                </p>
                <EnterpriseButton 
                  variant="secondary"
                  onClick={handleScheduleDemo}
                  className="w-full"
                >
                  Book Demo
                </EnterpriseButton>
              </EnterpriseCard>

              <EnterpriseCard className="text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Start Immediately</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Set up your claims processing automatically
                </p>
                <EnterpriseButton 
                  variant="ghost"
                  onClick={handleSelfSetup}
                  className="w-full"
                >
                  Self Setup
                </EnterpriseButton>
              </EnterpriseCard>
            </div>
          </div>
        </div>
      </EnterpriseSection>
    </EnterpriseLayout>
  );
};

export default InsuranceAIPackage; 