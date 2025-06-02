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
import { ConsistentLayout } from '../components/ui/ConsistentLayout';

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
    <ConsistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-emerald-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Enterprise Ready
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
                Document Intelligence
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Built for Enterprise</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Transform your organization's document workflow with AI-powered analysis, 
                enterprise-grade security, and seamless integrations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button 
                  onClick={handleDemoRequest}
                  className="bg-slate-800/50 border border-slate-600/50 text-white hover:bg-slate-700/50 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
                
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
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
          </div>
        </section>

        {/* Interactive Features Section */}
        <section className="py-16 bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Enterprise-Grade Features
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
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
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600/50 bg-slate-800/30 hover:border-slate-500/50'
                    }`}
                    onClick={() => setActiveFeature(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        activeFeature === index ? 'bg-blue-500 text-white' : 'bg-slate-700/50 text-slate-300'
                      }`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-slate-300 mb-3">
                          {feature.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {feature.benefits.map((benefit, bIndex) => (
                            <span key={bIndex} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Feature Visualization */}
              <div className="relative">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 min-h-[400px]">
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
                          enterpriseFeatures[activeFeature].color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                          enterpriseFeatures[activeFeature].color === 'green' ? 'bg-green-500/20 text-green-400' :
                          enterpriseFeatures[activeFeature].color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {enterpriseFeatures[activeFeature].icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          {enterpriseFeatures[activeFeature].title}
                        </h3>
                        <p className="text-slate-300 mb-6">
                          {enterpriseFeatures[activeFeature].description}
                        </p>
                        <button
                          onClick={() => navigate('/features')}
                          className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                        >
                          Learn More
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16 bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                See how organizations across industries are transforming their document workflows.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 hover:border-slate-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                      {useCase.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {useCase.industry}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-1">Challenge</h4>
                      <p className="text-sm text-slate-300">{useCase.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white mb-1">Solution</h4>
                      <p className="text-sm text-slate-300">{useCase.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white mb-2">Results</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(useCase.metrics).map(([key, value]) => (
                          <div key={key} className="text-center bg-slate-700/50 rounded-lg p-2 border border-slate-600/50">
                            <div className="text-lg font-bold text-emerald-400">{value}</div>
                            <div className="text-xs text-slate-400 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Enterprise Pricing
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Flexible pricing options designed to scale with your organization.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-8 hover:border-slate-500/50 transition-all duration-300 ${
                    plan.popular ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-slate-600/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-white mb-1">{plan.price}</div>
                    <div className="text-slate-400 text-sm">{plan.period}</div>
                    <p className="text-slate-300 mt-2">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => plan.cta === 'Contact Sales' ? setShowContactModal(true) : handleGetStarted()}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700' 
                        : 'bg-slate-700/50 text-white hover:bg-slate-600/50 border border-slate-600/50'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-slate-300">
                Join hundreds of satisfied enterprise customers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 hover:border-slate-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-slate-300 mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-sm text-slate-300">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-900 via-slate-900 to-emerald-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Transform Your Document Workflow?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Join thousands of organizations that trust ProofPix Enterprise for their document intelligence needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="bg-slate-800/50 border border-slate-600/50 text-white hover:bg-slate-700/50 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Contact Sales
                </button>
                
                <button
                  onClick={handleDemoRequest}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Modal */}
        <EnterpriseModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          title="Contact Enterprise Sales"
          size="lg"
        >
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
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
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              See ProofPix Enterprise in Action
            </h3>
            <p className="text-slate-300 mb-6">
              Book a personalized demo with our enterprise specialists to see how ProofPix can transform your document workflow.
            </p>
            
            <div className="space-y-4">
              <EnterpriseButton
                variant="primary"
                fullWidth
                onClick={() => window.open('https://www.calendly.com/proofpix-enterprise', '_blank')}
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
      </div>
    </ConsistentLayout>
  );
};

export { Enterprise };