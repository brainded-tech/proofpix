import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Building2, 
  Shield, 
  Zap,
  Users,
  MessageSquare,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { ConsistentLayout } from '../components/ui/ConsistentLayout';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  plan: string;
  contactType: string;
  message: string;
  urgency: string;
}

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    plan: searchParams.get('plan') || '',
    contactType: searchParams.get('type') || 'general',
    message: '',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactTypes = [
    { id: 'general', label: 'General Inquiry', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'contact_sales', label: 'Sales Inquiry', icon: <Building2 className="w-5 h-5" /> },
    { id: 'contact_support', label: 'Technical Support', icon: <Shield className="w-5 h-5" /> },
    { id: 'demo', label: 'Schedule Demo', icon: <Calendar className="w-5 h-5" /> },
    { id: 'enterprise', label: 'Enterprise Solutions', icon: <Users className="w-5 h-5" /> }
  ];

  const urgencyLevels = [
    { id: 'low', label: 'Low - General inquiry' },
    { id: 'normal', label: 'Normal - Standard response' },
    { id: 'high', label: 'High - Need response within 24h' },
    { id: 'urgent', label: 'Urgent - Need immediate assistance' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would send this to your backend
      console.log('Contact form submitted:', formData);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <ConsistentLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Message Sent!</h2>
            <p className="text-slate-300 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg transition-colors"
            >
              Return Home
            </Link>
          </motion.div>
        </div>
      </ConsistentLayout>
    );
  }

  return (
    <ConsistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
              <p className="text-xl text-slate-300 mb-8">
                Ready to transform your image intelligence workflow? Let's discuss how ProofPix can help your organization.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-slate-300">support@proofpixapp.com</p>
                    <p className="text-sm text-slate-400">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Enterprise Sales</h3>
                    <p className="text-slate-300">enterprise@proofpixapp.com</p>
                    <p className="text-sm text-slate-400">Dedicated enterprise support</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-slate-300">Philadelphia, PA</p>
                    <p className="text-sm text-slate-400">United States</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Response Times</h3>
                    <p className="text-slate-300">General: 24 hours</p>
                    <p className="text-slate-300">Enterprise: 4 hours</p>
                    <p className="text-slate-300">Urgent: 1 hour</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-12 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link
                    to="/enterprise/demo"
                    className="flex items-center text-slate-300 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Schedule Enterprise Demo
                  </Link>
                  <a
                    href="https://www.calendly.com/proofpix-enterprise"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-slate-300 hover:text-white transition-colors"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a Call
                  </a>
                  <Link
                    to="/docs"
                    className="flex items-center text-slate-300 hover:text-white transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Documentation
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-800 rounded-2xl p-8 border border-slate-700"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contact Type</label>
                  <select
                    value={formData.contactType}
                    onChange={(e) => handleInputChange('contactType', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {contactTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {formData.plan && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Interested Plan</label>
                    <input
                      type="text"
                      value={formData.plan}
                      onChange={(e) => handleInputChange('plan', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Plan name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Priority Level</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {urgencyLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your needs, questions, or how we can help..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </ConsistentLayout>
  );
}; 