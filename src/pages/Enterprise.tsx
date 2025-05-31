import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Shield, 
  Users, 
  Zap, 
  CheckCircle, 
  Calendar,
  Lock,
  Server,
  Globe,
  Mail,
  Camera,
  ArrowRight,
  Star,
  Award,
  TrendingUp,
  Clock,
  DollarSign,
  Eye
} from 'lucide-react';
import { analytics } from '../utils/analytics';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseInput, 
  EnterpriseTextarea, 
  EnterpriseBadge,
  EnterpriseMetric,
  EnterpriseSection,
  EnterpriseGrid
} from '../components/ui/EnterpriseComponents';
import LeadCaptureSystem from '../components/automation/LeadCaptureSystem';

export const Enterprise: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    companySize: '',
    useCase: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [roiData, setRoiData] = useState({
    monthlyPhotos: 1000,
    hourlyRate: 75,
    timePerPhoto: 5
  });
  const navigate = useNavigate();

  // Calculate ROI savings
  const calculateROI = () => {
    const monthlyHours = (roiData.monthlyPhotos * roiData.timePerPhoto) / 60;
    const monthlyCost = monthlyHours * roiData.hourlyRate;
    const annualCost = monthlyCost * 12;
    const proofPixCost = 2400; // $200/month enterprise
    const annualSavings = annualCost - proofPixCost;
    
    return {
      monthlyHours: Math.round(monthlyHours),
      monthlyCost: Math.round(monthlyCost),
      annualSavings: Math.round(annualSavings),
      roiPercentage: Math.round((annualSavings / proofPixCost) * 100)
    };
  };

  const roi = calculateROI();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    analytics.trackEvent('Enterprise Inquiry', {
      company_size: formData.companySize,
      use_case: formData.useCase,
      source: 'enterprise_page'
    });
    
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleBookDemo = () => {
    analytics.trackEvent('Enterprise Demo Booking', { source: 'enterprise_page' });
    window.open('https://calendly.com/proofpix-enterprise', '_blank');
  };

  const benefits = [
              {
                icon: Shield,
                title: "Enterprise Security",
      description: "Privacy-first architecture with client-side processing. No cloud uploads, no data breaches, complete compliance."
              },
              {
                icon: Users,
      title: "Industry Solutions", 
      description: "Purpose-built solutions for legal, insurance, real estate, and healthcare with industry-specific templates."
              },
              {
                icon: Zap,
      title: "Document Intelligence",
      description: "Advanced metadata extraction, OCR capabilities, and professional PDF generation with verified timestamps."
              },
              {
                icon: Globe,
                title: "White Label",
      description: "Fully customizable interface with your branding, domain, and custom features for seamless integration."
              },
              {
                icon: Server,
      title: "Scalable Processing", 
      description: "Handle millions of documents with batch processing, automated workflows, and enterprise infrastructure."
              },
              {
                icon: Lock,
      title: "Compliance Ready",
      description: "Meet regulatory requirements with audit trails, chain of custody tracking, and compliance documentation."
    }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Enterprise Document Intelligence"
      description="Transform your organization's document processing with enterprise-grade metadata extraction, OCR capabilities, and professional PDF generation."
      maxWidth="7xl"
    >
      {/* Hero CTA Section */}
      <EnterpriseSection size="lg" className="text-center">
        <div className="mb-8">
          <EnterpriseBadge variant="primary" icon={<Building2 className="enterprise-icon-sm" />}>
            🏢 Enterprise Solution
          </EnterpriseBadge>
              </div>
        
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Enterprise-Grade Photo Metadata Processing
        </h1>
        
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
          Secure, scalable, and compliant metadata extraction for organizations that handle sensitive visual evidence. 
          Built for legal firms, insurance companies, and enterprise teams.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <EnterpriseButton 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/enterprise/demo')}
            icon={<Eye className="enterprise-icon-sm" />}
          >
            Try Interactive Demo
          </EnterpriseButton>
          
          <EnterpriseButton 
            variant="secondary" 
            size="lg"
            onClick={handleBookDemo}
            icon={<Calendar className="enterprise-icon-sm" />}
          >
            Book Live Demo
          </EnterpriseButton>
          
          <EnterpriseButton 
            variant="ghost" 
            size="lg"
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Custom Quote
          </EnterpriseButton>
          </div>
      </EnterpriseSection>

      {/* Benefits Section */}
      <EnterpriseSection size="lg" background="light">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Why Enterprise Teams Choose ProofPix
          </h2>
          <p className="text-xl text-slate-600">
            Built for organizations that need security, scalability, and compliance
          </p>
        </div>
        
        <EnterpriseGrid columns={3}>
          {benefits.map((benefit, index) => (
            <EnterpriseCard key={index}>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-slate-600">{benefit.description}</p>
            </EnterpriseCard>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* ROI Calculator Section */}
      <EnterpriseSection size="lg">
          <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Calculate Your ROI</h2>
          <p className="text-xl text-slate-600">See how much ProofPix Enterprise can save your organization</p>
          </div>
          
        <div className="max-w-4xl mx-auto">
          <EnterpriseCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Your Current Process</h3>
              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Photos Processed
                  </label>
                    <EnterpriseInput
                    type="number"
                      value={roiData.monthlyPhotos.toString()}
                      onChange={(e) => setRoiData(prev => ({ ...prev, monthlyPhotos: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Hourly Rate ($)
                  </label>
                    <EnterpriseInput
                    type="number"
                      value={roiData.hourlyRate.toString()}
                      onChange={(e) => setRoiData(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Minutes per Photo
                  </label>
                    <EnterpriseInput
                    type="number"
                      value={roiData.timePerPhoto.toString()}
                      onChange={(e) => setRoiData(prev => ({ ...prev, timePerPhoto: parseInt(e.target.value) || 0 }))}
                  />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Projected Savings</h3>
              <div className="space-y-4">
                  <EnterpriseMetric
                    value={`${roi.monthlyHours} hours`}
                    label="Monthly Time Saved"
                  />
                  <EnterpriseMetric
                    value={`$${roi.monthlyCost.toLocaleString()}`}
                    label="Monthly Cost Savings"
                  />
                  <EnterpriseMetric
                    value={`$${roi.annualSavings.toLocaleString()}`}
                    label="Annual Savings"
                  />
                  <EnterpriseMetric
                    value={`${roi.roiPercentage}%`}
                    label="ROI Percentage"
                  />
                </div>
              </div>
            </div>
          </EnterpriseCard>
          </div>
      </EnterpriseSection>

      {/* Enterprise Ready Section */}
      <EnterpriseSection size="lg" background="light">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Enterprise Ready</h2>
          <p className="text-xl text-slate-600">Built for scale, security, and success</p>
        </div>
        
        <EnterpriseGrid columns={3}>
          <EnterpriseCard>
            <div className="text-center">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise Ready</h3>
              <p className="text-slate-600">SOC 2 compliant, GDPR ready, and enterprise-grade security</p>
            </div>
          </EnterpriseCard>
          
          <EnterpriseCard>
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Quick Setup</h3>
              <p className="text-slate-600">Deploy in under 24 hours with our white-glove onboarding</p>
            </div>
          </EnterpriseCard>
          
          <EnterpriseCard>
            <div className="text-center">
              <Star className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Proven Results</h3>
              <p className="text-slate-600">95% reduction in metadata processing time for enterprise clients</p>
            </div>
          </EnterpriseCard>
        </EnterpriseGrid>
        
        <div className="text-center mt-12">
          <EnterpriseCard variant="dark">
            <h3 className="text-xl font-semibold text-white mb-2">
              🔥 Limited Time: Enterprise Launch Pricing
            </h3>
            <p className="text-slate-300">
              Lock in 50% off your first year when you book a demo this month. 
              <span className="text-orange-300 font-semibold"> Only 12 spots remaining.</span>
            </p>
          </EnterpriseCard>
        </div>
      </EnterpriseSection>

      {/* Contact Form Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Transform Your Document Workflows?
            </h2>
            <p className="text-xl text-slate-600">
              Get a personalized demo and see how ProofPix Enterprise can benefit your organization
            </p>
          </div>

          <LeadCaptureSystem 
            source="enterprise_page"
            onLeadCaptured={(lead) => {
              console.log('New lead captured:', lead);
              // In production, this could trigger additional actions
            }}
          />
        </div>
      </section>
    </EnterpriseLayout>
  );
};