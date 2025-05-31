import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  HelpCircle,
  Building2,
  Shield,
  Zap,
  Users,
  Send,
  ExternalLink
} from 'lucide-react';
import { EnterpriseLayout } from './ui/EnterpriseLayout';

export const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    priority: 'normal',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const supportChannels = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get detailed help via email',
      response: '< 24 hours',
      action: 'Send Email',
      color: 'blue',
      available: 'Always available'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Real-time assistance',
      response: '< 5 minutes',
      action: 'Start Chat',
      color: 'emerald',
      available: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Direct phone assistance',
      response: 'Immediate',
      action: 'Schedule Call',
      color: 'purple',
      available: 'Professional customers'
    }
  ];

  const quickHelp = [
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Find answers to common questions',
      link: '/faq'
    },
    {
      icon: FileText,
      title: 'About ProofPix',
      description: 'Learn about our photo metadata tool',
      link: '/about'
    },
    {
      icon: Shield,
      title: 'Privacy Guide',
      description: 'How we protect your photos',
      link: '/privacy'
    },
    {
      icon: Building2,
      title: 'Professional Features',
      description: 'Advanced photo analysis tools',
      link: '/pricing'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Question' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'photo-analysis', label: 'Photo Analysis Help' },
    { value: 'metadata', label: 'Metadata Questions' },
    { value: 'privacy', label: 'Privacy & Security' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' }
  ];

  const priorities = [
    { value: 'low', label: 'Low - General inquiry' },
    { value: 'normal', label: 'Normal - Standard support' },
    { value: 'high', label: 'High - Urgent issue' },
    { value: 'critical', label: 'Critical - System down' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 text-white'
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        button: 'bg-emerald-600 hover:bg-emerald-700 text-white'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700 text-white'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (submitted) {
  return (
      <EnterpriseLayout
        showHero
        title="Thank You!"
        description="Your support request has been submitted successfully."
        maxWidth="4xl"
      >
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            We've received your message
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Our support team will review your request and get back to you within 24 hours. 
            You'll receive a confirmation email shortly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSubmitted(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Submit Another Request
            </button>
            <button
              onClick={() => navigate('/')}
              className="border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors bg-white"
            >
              Back to ProofPix
            </button>
          </div>
        </div>
      </EnterpriseLayout>
    );
  }

  return (
    <EnterpriseLayout
      showHero
      title="How can we help you?"
      description="Get the support you need to make the most of ProofPix photo metadata analysis. Our team is here to help."
      maxWidth="7xl"
    >
      {/* Support Channels */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Choose Your Support Channel
          </h2>
          <p className="text-lg text-slate-600">
            Multiple ways to get help, tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supportChannels.map((channel, index) => {
            const colorClasses = getColorClasses(channel.color);
            
            return (
              <div
                key={index}
                className={`${colorClasses.bg} ${colorClasses.border} border rounded-2xl p-8 hover:shadow-lg transition-shadow`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                    <channel.icon className={`w-8 h-8 ${colorClasses.icon}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {channel.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {channel.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">Response: {channel.response}</span>
                    </div>
                    <div className="text-sm text-slate-500">
                      {channel.available}
                </div>
              </div>

                  <button
                    onClick={() => {
                      if (channel.title === 'Email Support') {
                        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                      } else if (channel.title === 'Live Chat') {
                        // Implement chat widget
                        alert('Live chat will be available soon!');
                      } else {
                        navigate('/pricing');
                      }
                    }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${colorClasses.button}`}
                  >
                    {channel.action}
                  </button>
                </div>
              </div>
            );
          })}
            </div>
          </section>

      {/* Quick Help */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Quick Help Resources
          </h2>
          <p className="text-lg text-slate-600">
            Find answers instantly with our self-service resources
              </p>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickHelp.map((resource, index) => (
                <button
              key={index}
              onClick={() => navigate(resource.link)}
              className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-shadow text-left group"
                >
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <resource.icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{resource.title}</h3>
              <p className="text-slate-600 text-sm">{resource.description}</p>
                </button>
          ))}
            </div>
          </section>

      {/* Contact Form */}
      <section id="contact-form" className="mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Send us a Message
            </h2>
            <p className="text-lg text-slate-600">
              Can't find what you're looking for? Send us a detailed message and we'll get back to you.
            </p>
            </div>
            
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
            </div>
            
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Brief description of your issue or question"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Please provide as much detail as possible about your question or issue..."
                />
            </div>
            
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-slate-600">
                    <p className="font-medium text-slate-700 mb-1">Before submitting:</p>
                    <ul className="space-y-1">
                      <li>• Check our <button onClick={() => navigate('/faq')} className="text-blue-600 hover:underline">FAQ</button> for quick answers</li>
                      <li>• Include your browser version for technical issues</li>
                      <li>• Describe steps to reproduce any problems</li>
                  </ul>
                </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    category: 'general',
                    priority: 'normal',
                    message: ''
                  })}
                  className="px-6 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg font-semibold transition-colors bg-white"
                >
                  Clear Form
                </button>
              </div>
            </form>
              </div>
            </div>
          </section>

      {/* Professional Support */}
      <section className="bg-slate-900 text-white rounded-2xl p-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-white" />
            </div>
            
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need Professional Support?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Get priority support, advanced features, and professional photo analysis tools.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Priority Support</h3>
              <p className="text-slate-400 text-sm">Faster response times</p>
                </div>
            <div className="text-center">
              <Zap className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Advanced Features</h3>
              <p className="text-slate-400 text-sm">Batch processing & more</p>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Phone Support</h3>
              <p className="text-slate-400 text-sm">Direct access when needed</p>
        </div>
        </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/pricing')}
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              View Professional Plans
            </button>
            <button
              onClick={() => window.location.href = 'mailto:support@proofpix.com'}
              className="border border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </section>
    </EnterpriseLayout>
  );
}; 