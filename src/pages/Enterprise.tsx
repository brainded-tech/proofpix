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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Building2 className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold">ProofPix Enterprise</h1>
            </div>
            <button
              onClick={handleBookDemo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Book Demo
            </button>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
              🏢 Enterprise Solution
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Scale EXIF Processing
            <span className="block text-blue-400">Across Your Organization</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Deploy ProofPix's metadata extraction capabilities enterprise-wide. 
            White-label solutions, API access, and dedicated support for teams of any size.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/enterprise/demo')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center"
            >
              <Eye className="mr-2 h-5 w-5" />
              Try Interactive Demo
            </button>
            <button
              onClick={handleBookDemo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Live Demo
            </button>
            <button
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Get Custom Quote
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Enterprise Teams Choose ProofPix</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "SOC 2 compliant, on-premise deployment options, and enterprise-grade security controls."
              },
              {
                icon: Users,
                title: "Team Management", 
                description: "User roles, permissions, and centralized administration for organizations of any size."
              },
              {
                icon: Zap,
                title: "API Integration",
                description: "RESTful APIs for seamless integration with your existing workflows and systems."
              },
              {
                icon: Globe,
                title: "White Label",
                description: "Fully customizable interface with your branding, domain, and custom features."
              },
              {
                icon: Server,
                title: "Dedicated Infrastructure", 
                description: "Dedicated servers, priority processing, and guaranteed uptime SLAs."
              },
              {
                icon: Lock,
                title: "Data Sovereignty",
                description: "Keep your data in your preferred region with on-premise or private cloud options."
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <benefit.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Calculate Your ROI</h2>
            <p className="text-gray-300 text-lg">See how much ProofPix Enterprise can save your organization</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ROI Calculator */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <DollarSign className="h-6 w-6 text-green-400 mr-2" />
                ROI Calculator
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Monthly Photos Processed
                  </label>
                  <input
                    type="number"
                    value={roiData.monthlyPhotos}
                    onChange={(e) => setRoiData(prev => ({...prev, monthlyPhotos: parseInt(e.target.value) || 0}))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Staff Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={roiData.hourlyRate}
                    onChange={(e) => setRoiData(prev => ({...prev, hourlyRate: parseInt(e.target.value) || 0}))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minutes per Photo (manual process)
                  </label>
                  <input
                    type="number"
                    value={roiData.timePerPhoto}
                    onChange={(e) => setRoiData(prev => ({...prev, timePerPhoto: parseInt(e.target.value) || 0}))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
              </div>
            </div>
            
            {/* ROI Results */}
            <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-lg p-6 border border-green-500/30">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 text-green-400 mr-2" />
                Your Savings
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Monthly Hours Saved:</span>
                  <span className="text-white font-semibold">{roi.monthlyHours} hours</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Monthly Cost Savings:</span>
                  <span className="text-green-400 font-semibold">${roi.monthlyCost.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Annual Savings:</span>
                  <span className="text-green-400 font-bold text-xl">${roi.annualSavings.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">ROI:</span>
                  <span className="text-green-400 font-bold text-xl">{roi.roiPercentage}%</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-green-300 text-sm">
                  💡 <strong>ProofPix Enterprise</strong> pays for itself in just {Math.ceil(2400 / roi.monthlyCost)} months!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Urgency Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enterprise Ready</h3>
              <p className="text-gray-300">SOC 2 compliant, GDPR ready, and enterprise-grade security</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quick Setup</h3>
              <p className="text-gray-300">Deploy in under 24 hours with our white-glove onboarding</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <Star className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-300">95% reduction in metadata processing time for enterprise clients</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-6 border border-orange-500/30 mb-8">
            <h3 className="text-xl font-semibold mb-2 text-orange-300">🔥 Limited Time: Enterprise Launch Pricing</h3>
            <p className="text-gray-300">
              Lock in 50% off your first year when you book a demo this month. 
              <span className="text-orange-300 font-semibold"> Only 12 spots remaining.</span>
            </p>
          </div>
        </div>
      </section>

      <section id="contact-form" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Book Your Enterprise Demo</h2>
            <p className="text-gray-300 text-lg">
              Get a personalized demo and see how ProofPix Enterprise can transform your workflow
            </p>
            <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                30-minute demo
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Custom ROI analysis
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Implementation roadmap
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Quick Demo Booking */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-6 w-6 text-blue-400 mr-2" />
                Book Instant Demo
              </h3>
              <p className="text-gray-300 mb-6">
                Schedule a live demo with our enterprise team. Available today!
              </p>
              <button
                onClick={() => {
                  analytics.trackEvent('Enterprise Demo Booking', { source: 'enterprise_page' });
                  window.open('https://calendly.com/proofpix-enterprise/30min', '_blank');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Demo Now
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                ⚡ Usually available within 2 hours
              </p>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Mail className="h-6 w-6 text-green-400 mr-2" />
                Or Send Details
              </h3>
              <p className="text-gray-300 mb-6">
                Prefer to share your requirements first? We'll prepare a custom demo.
              </p>
              <button
                onClick={() => setShowROICalculator(!showROICalculator)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center mb-4"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Fill Contact Form
              </button>
            </div>
          </div>

          {submitted ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
              <p className="text-gray-300 mb-4">
                We've received your inquiry and will contact you within 24 hours to discuss your enterprise needs.
              </p>
              <button
                onClick={() => {
                  analytics.trackEvent('Enterprise Demo Booking', { source: 'thank_you_page' });
                  window.open('https://calendly.com/proofpix-enterprise/30min', '_blank');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors inline-flex items-center"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Demo Now
              </button>
            </div>
          ) : showROICalculator ? (
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company *</label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Size *</label>
                  <select
                    name="companySize"
                    required
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Use Case *</label>
                <select
                  name="useCase"
                  required
                  value={formData.useCase}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select use case</option>
                  <option value="forensics">Digital Forensics</option>
                  <option value="media">Media & Publishing</option>
                  <option value="legal">Legal & Compliance</option>
                  <option value="insurance">Insurance Claims</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="security">Security & Surveillance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your specific requirements..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                ) : (
                  <Mail className="mr-2 h-5 w-5" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Enterprise Inquiry'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Choose your preferred way to get started:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    analytics.trackEvent('Enterprise Demo Booking', { source: 'enterprise_page_bottom' });
                    window.open('https://calendly.com/proofpix-enterprise/30min', '_blank');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Demo
                </button>
                <button
                  onClick={() => setShowROICalculator(true)}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Form
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <Camera className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-bold">ProofPix</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Enterprise-grade EXIF metadata extraction and analysis platform.
              </p>
              <p className="text-gray-500 text-xs">
                © 2025 ProofPix. All rights reserved.
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">ProofPix Free</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pro Plans</a></li>
                <li><a href="/enterprise" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="/docs/api" className="hover:text-white transition-colors">API Access</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/docs/enterprise-security" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="mailto:enterprise@proofpix.com" className="hover:text-white transition-colors flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    enterprise@proofpix.com
                  </a>
                </li>
                <li>
                  <a href="/enterprise#demo" className="hover:text-white transition-colors flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Demo
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              Built for professionals, by professionals. Privacy-respecting metadata analysis.
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-400 hover:text-white transition-colors">
                ← Back to ProofPix
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};