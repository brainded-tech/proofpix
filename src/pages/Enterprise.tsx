import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Building2, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  Globe,
  Lock,
  Clock,
  BarChart3,
  TrendingUp,
  Phone,
  Calendar,
  Mail,
  Sparkles,
  Target,
  Award,
  Database,
  Cpu,
  Settings,
  AlertTriangle,
  Eye,
  FileText,
  Download,
  Play,
  ChevronRight,
  Briefcase,
  DollarSign
} from 'lucide-react';

import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseInput, 
  EnterpriseTextarea, 
  EnterpriseSelect,
  EnterpriseBadge,
  EnterpriseMetric,
  EnterpriseSection,
  EnterpriseGrid,
  EnterpriseHero,
  EnterpriseAlert,
  EnterpriseModal
} from '../components/ui/EnterpriseComponents';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { BackToHomeButton } from '../components/ui/BackToHomeButton';

const Enterprise: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    employees: '',
    message: '',
    useCase: ''
  });

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % enterpriseFeatures.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const enterpriseFeatures = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 Type II compliance, end-to-end encryption, and advanced threat protection.",
      benefits: ["Zero-trust architecture", "Advanced encryption", "Compliance reporting", "Audit trails"],
      color: "blue"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Management",
      description: "Comprehensive user management with role-based access control, SSO integration, and team analytics.",
      benefits: ["Role-based permissions", "SSO integration", "Team analytics", "User provisioning"],
      color: "green"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Deep insights with custom dashboards, real-time reporting, and predictive analytics.",
      benefits: ["Custom dashboards", "Real-time data", "Predictive insights", "Export capabilities"],
      color: "purple"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "API & Integrations",
      description: "Seamless integration with your existing tools through our comprehensive API and pre-built connectors.",
      benefits: ["REST API access", "Webhook support", "Pre-built integrations", "Custom connectors"],
      color: "orange"
    }
  ];

  const pricingPlans = [
    {
      id: 'hybrid_access',
      name: 'Hybrid Access',
      price: '$299',
      period: '/month',
      description: 'Perfect for teams that need both privacy and collaboration',
      features: [
        'Real-time mode switching',
        'Privacy + Collaboration modes',
        'Unlimited team members',
        'Advanced user controls',
        'Compliance dashboard',
        'Custom security policies',
        'API access included',
        'Priority support'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      id: 'enterprise_hybrid',
      name: 'Enterprise Hybrid',
      price: '$999',
      period: '/month',
      description: 'Custom hybrid architecture for large organizations',
      features: [
        'Custom hybrid architecture',
        'Dedicated infrastructure',
        'Unlimited users and processing',
        'White-label capabilities',
        'Custom integrations',
        'On-premise deployment options',
        'SLA guarantees',
        '24/7 dedicated support'
      ],
      cta: 'Contact Sales',
      popular: false
    },
    {
      id: 'custom_enterprise',
      name: 'Custom Enterprise',
      price: 'Contact us',
      period: 'tailored pricing',
      description: 'Fully customized solution with dedicated infrastructure',
      features: [
        'Everything in Enterprise Hybrid',
        'Custom development',
        'Dedicated infrastructure',
        'Custom compliance frameworks',
        'White-glove onboarding',
        'Strategic consulting',
        'Custom SLAs',
        'Regulatory consulting'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const testimonials = [
    {
      quote: "ProofPix Enterprise transformed our document workflow. We've seen a 75% reduction in processing time.",
      author: "Sarah Chen",
      role: "CTO",
      company: "TechCorp",
      avatar: "👩‍💼"
    },
    {
      quote: "The security features and compliance tools gave us confidence to handle sensitive financial documents.",
      author: "Michael Rodriguez",
      role: "Head of Operations",
      company: "FinanceFirst",
      avatar: "👨‍💼"
    },
    {
      quote: "Seamless integration with our existing systems. The API is well-documented and powerful.",
      author: "Emily Johnson",
      role: "Lead Developer",
      company: "DevSolutions",
      avatar: "👩‍💻"
    }
  ];

  const useCases = [
    {
      industry: "Financial Services",
      icon: <DollarSign className="w-6 h-6" />,
      challenge: "Manual document verification processes taking hours",
      solution: "Automated document analysis with 99.9% accuracy",
      results: "80% faster processing, 95% cost reduction",
      metrics: { time: "80%", cost: "95%", accuracy: "99.9%" }
    },
    {
      industry: "Healthcare",
      icon: <Shield className="w-6 h-6" />,
      challenge: "HIPAA compliance and patient data security",
      solution: "End-to-end encryption with audit trails",
      results: "100% HIPAA compliance, zero security incidents",
      metrics: { compliance: "100%", incidents: "0", uptime: "99.99%" }
    },
    {
      industry: "Legal",
      icon: <FileText className="w-6 h-6" />,
      challenge: "Document discovery and case preparation",
      solution: "AI-powered document classification and search",
      results: "70% faster case preparation, 60% cost savings",
      metrics: { speed: "70%", cost: "60%", accuracy: "98%" }
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    setShowContactModal(false);
    // Show success message or redirect
  };

  const handleDemoRequest = () => {
    setShowDemoModal(true);
  };

  const handleGetStarted = () => {
    navigate('/pricing');
  };

  return (
    <EnterpriseLayout
      showHero={false}
      title="Enterprise Solutions"
      description="Powerful document intelligence for enterprise teams"
      maxWidth="7xl"
    >
      <BackToHomeButton variant="enterprise" />
      
      {/* Hero Section */}
      <EnterpriseHero variant="gradient" size="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <EnterpriseBadge variant="premium" className="mb-6">
            <Sparkles className="w-4 h-4" />
            Enterprise Ready
          </EnterpriseBadge>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Document Intelligence
            <br />
            <span className="enterprise-text-gradient">Built for Enterprise</span>
        </h1>
        
          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
            Transform your organization's document workflow with AI-powered analysis, 
            enterprise-grade security, and seamless integrations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <EnterpriseButton 
            variant="secondary" 
            size="lg"
              onClick={handleDemoRequest}
              icon={<Play className="w-5 h-5" />}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
              Watch Demo
          </EnterpriseButton>
          
          <EnterpriseButton 
              variant="primary"
            size="lg"
              onClick={() => setShowContactModal(true)}
              icon={<ArrowRight className="w-5 h-5" />}
              className="bg-white text-blue-600 hover:bg-blue-50"
          >
              Get Started
          </EnterpriseButton>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-blue-200 text-sm">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-blue-200 text-sm">Enterprise Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">SOC 2</div>
              <div className="text-blue-200 text-sm">Type II Certified</div>
          </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-blue-200 text-sm">Support</div>
        </div>
          </div>
        </motion.div>
      </EnterpriseHero>

      {/* Interactive Features Section */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Enterprise-Grade Features
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything your organization needs to scale document processing securely and efficiently.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Navigation */}
          <div className="space-y-4">
            {enterpriseFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  activeFeature === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    activeFeature === index ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 mb-3">
                      {feature.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {feature.benefits.map((benefit, bIndex) => (
                        <EnterpriseBadge key={bIndex} variant="neutral" size="sm">
                          {benefit}
                        </EnterpriseBadge>
                      ))}
          </div>
        </div>
              </div>
              </motion.div>
            ))}
          </div>

          {/* Feature Visualization */}
          <div className="relative">
            <EnterpriseCard variant="glass" className="p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-2xl mb-6 ${
                      enterpriseFeatures[activeFeature].color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      enterpriseFeatures[activeFeature].color === 'green' ? 'bg-green-100 text-green-600' :
                      enterpriseFeatures[activeFeature].color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {enterpriseFeatures[activeFeature].icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {enterpriseFeatures[activeFeature].title}
                    </h3>
                    <p className="text-slate-600 mb-6">
                      {enterpriseFeatures[activeFeature].description}
                    </p>
                    <EnterpriseButton
                      variant="primary"
                      onClick={() => navigate('/features')}
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Learn More
                    </EnterpriseButton>
                  </div>
                </motion.div>
              </AnimatePresence>
            </EnterpriseCard>
        </div>
          </div>
      </EnterpriseSection>

      {/* Use Cases Section */}
      <EnterpriseSection background="light" size="lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See how organizations across industries are transforming their document workflows.
          </p>
          </div>
          
        <EnterpriseGrid columns={3} gap="lg">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <EnterpriseCard hover interactive className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {useCase.industry}
              </h3>
                </div>
                
              <div className="space-y-4">
                <div>
                    <h4 className="font-medium text-slate-900 mb-1">Challenge</h4>
                    <p className="text-sm text-slate-600">{useCase.challenge}</p>
                </div>
                
                <div>
                    <h4 className="font-medium text-slate-900 mb-1">Solution</h4>
                    <p className="text-sm text-slate-600">{useCase.solution}</p>
                </div>
                
                <div>
                    <h4 className="font-medium text-slate-900 mb-2">Results</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(useCase.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-blue-600">{value}</div>
                          <div className="text-xs text-slate-500 capitalize">{key}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </EnterpriseCard>
            </motion.div>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* Pricing Section */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Enterprise Pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Flexible pricing options designed to scale with your organization.
          </p>
            </div>
            
        <EnterpriseGrid columns={3} gap="lg" className="max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <EnterpriseCard
                variant={plan.popular ? "premium" : "light"}
                className={`relative h-full ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
                interactive
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <EnterpriseBadge variant="primary">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </EnterpriseBadge>
                </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-1">{plan.price}</div>
                  <div className="text-slate-500 text-sm">{plan.period}</div>
                  <p className="text-slate-600 mt-2">{plan.description}</p>
                </div>
                
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
              </div>
                  ))}
            </div>
                
                <EnterpriseButton
                  variant={plan.popular ? "primary" : "secondary"}
                  fullWidth
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    if (plan.id === 'custom_enterprise') {
                      setShowContactModal(true);
                    } else {
                      navigate('/pricing');
                    }
                  }}
                >
                  {plan.id === 'custom_enterprise' ? 'Contact Sales' : 'Get Started'}
                </EnterpriseButton>
          </EnterpriseCard>
            </motion.div>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* Testimonials Section */}
      <EnterpriseSection background="light" size="lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-slate-600">
            Join hundreds of satisfied enterprise customers.
          </p>
        </div>
        
        <EnterpriseGrid columns={3} gap="lg">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <EnterpriseCard hover className="h-full">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
            </div>
            
                <blockquote className="text-slate-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.author}</div>
                    <div className="text-sm text-slate-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
            </div>
            </div>
          </EnterpriseCard>
            </motion.div>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* CTA Section */}
      <EnterpriseSection background="gradient" size="lg">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of organizations that trust ProofPix Enterprise for their document intelligence needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnterpriseButton
              variant="secondary"
              size="lg"
              onClick={() => setShowContactModal(true)}
              icon={<Phone className="w-5 h-5" />}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Contact Sales
            </EnterpriseButton>
            
            <EnterpriseButton
              variant="primary"
              size="lg"
              onClick={handleDemoRequest}
              icon={<Calendar className="w-5 h-5" />}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Schedule Demo
            </EnterpriseButton>
          </div>
        </div>
      </EnterpriseSection>

      {/* Contact Modal */}
      <EnterpriseModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Enterprise Sales"
        size="lg"
      >
        <form onSubmit={handleContactSubmit} className="space-y-6">
          <EnterpriseGrid columns={2} gap="md">
            <EnterpriseInput
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
            />
            <EnterpriseInput
              label="Work Email"
                    type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
            />
          </EnterpriseGrid>
          
          <EnterpriseGrid columns={2} gap="md">
            <EnterpriseInput
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
            />
            <EnterpriseSelect
              label="Company Size"
              options={[
                { value: '1-10', label: '1-10 employees' },
                { value: '11-50', label: '11-50 employees' },
                { value: '51-200', label: '51-200 employees' },
                { value: '201-1000', label: '201-1000 employees' },
                { value: '1000+', label: '1000+ employees' }
              ]}
              value={formData.employees}
              onChange={(value) => setFormData({ ...formData, employees: value })}
                    required
            />
          </EnterpriseGrid>
          
          <EnterpriseSelect
            label="Primary Use Case"
            options={[
              { value: 'document-processing', label: 'Document Processing' },
              { value: 'compliance', label: 'Compliance & Audit' },
              { value: 'workflow-automation', label: 'Workflow Automation' },
              { value: 'data-extraction', label: 'Data Extraction' },
              { value: 'other', label: 'Other' }
            ]}
            value={formData.useCase}
            onChange={(value) => setFormData({ ...formData, useCase: value })}
                  required
          />
          
          <EnterpriseTextarea
            label="Tell us about your requirements"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
            helpText="Help us understand your specific needs and challenges"
          />
          
          <div className="flex gap-4 pt-4">
            <EnterpriseButton
              type="button"
              variant="ghost"
              onClick={() => setShowContactModal(false)}
              fullWidth
            >
              Cancel
            </EnterpriseButton>
            <EnterpriseButton
                type="submit"
              variant="primary"
              fullWidth
            >
              Send Message
            </EnterpriseButton>
          </div>
            </form>
      </EnterpriseModal>

      {/* Demo Modal */}
      <EnterpriseModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        title="Schedule a Demo"
        size="md"
      >
            <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            See ProofPix Enterprise in Action
          </h3>
          <p className="text-slate-600 mb-6">
            Book a personalized demo with our enterprise specialists to see how ProofPix can transform your document workflow.
          </p>
          
          <div className="space-y-4">
            <EnterpriseButton
              variant="primary"
              fullWidth
              onClick={() => window.open('https://calendly.com/proofpix-enterprise', '_blank')}
              icon={<Calendar className="w-4 h-4" />}
            >
              Schedule Demo
            </EnterpriseButton>
            
            <EnterpriseButton
              variant="ghost"
              fullWidth
              onClick={() => setShowDemoModal(false)}
            >
              Maybe Later
            </EnterpriseButton>
          </div>
        </div>
      </EnterpriseModal>
    </EnterpriseLayout>
  );
};

export { Enterprise };