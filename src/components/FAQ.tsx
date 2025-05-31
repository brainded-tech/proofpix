import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  Building2, 
  CreditCard, 
  HelpCircle,
  FileText,
  Users,
  Settings,
  Lock,
  Camera
} from 'lucide-react';
import { EnterpriseLayout } from './ui/EnterpriseLayout';

export const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'general', name: 'Getting Started', icon: FileText },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'features', name: 'Features & Usage', icon: Camera },
    { id: 'technical', name: 'Technical', icon: Settings },
    { id: 'pricing', name: 'Pricing', icon: CreditCard }
  ];

  const faqs = [
    // Getting Started
    {
      id: 'what-is-proofpix',
      category: 'general',
      question: 'What is ProofPix?',
      answer: 'ProofPix reveals the hidden story behind your photos—like where they were taken, what camera was used, and when they were captured. Everything happens in your browser, so your photos stay completely private on your device.'
    },
    {
      id: 'how-to-use',
      category: 'general',
      question: 'How do I use ProofPix?',
      answer: 'It\'s simple! Just drop a photo onto our homepage or click to browse your files. In seconds, you\'ll see all the hidden information your camera stored in that photo—no account needed, no uploads required.'
    },
    {
      id: 'supported-formats',
      category: 'general',
      question: 'What photo formats are supported?',
      answer: 'ProofPix works with photos from any camera or phone: JPEG, PNG, TIFF, HEIC, HEIF, and most RAW formats from Canon, Nikon, Sony, and other popular camera brands.'
    },
    {
      id: 'no-account-needed',
      category: 'general',
      question: 'Do I need to create an account?',
      answer: 'Nope! Just visit ProofPix and start analyzing photos immediately. No sign-ups, no passwords, no hassle. This is part of our privacy-first approach—we can\'t collect what we don\'t ask for.'
    },

    // Privacy & Security
    {
      id: 'photo-privacy',
      category: 'privacy',
      question: 'Are my photos safe and private?',
      answer: 'Absolutely! Your photos never leave your device—they stay right in your browser. We literally cannot see your photos, even if we wanted to. It\'s like having a photo analysis tool that runs entirely on your own computer.'
    },
    {
      id: 'data-collection',
      category: 'privacy',
      question: 'What data do you collect?',
      answer: 'We collect basic website analytics (like page views) to improve ProofPix, but we never see your photos or their hidden information. Everything stays on your device, completely private.'
    },
    {
      id: 'gdpr-compliance',
      category: 'privacy',
      question: 'Is ProofPix GDPR compliant?',
      answer: 'Yes! Since your photos and their information never leave your device, there\'s no personal data for us to mishandle. Our privacy protection is built into how ProofPix works, not just promised in a policy.'
    },
    {
      id: 'open-source',
      category: 'privacy',
      question: 'Is ProofPix open source?',
      answer: 'Yes! You can review our code, suggest improvements, or even run your own version. This transparency means you don\'t have to just trust our privacy claims—you can verify them yourself.'
    },

    // Features & Usage
    {
      id: 'metadata-types',
      category: 'features',
      question: 'What information can ProofPix find in my photos?',
      answer: 'ProofPix reveals the hidden story cameras store in every photo: where it was taken (GPS location), when it was captured, what camera and settings were used, image dimensions, and much more. It\'s like having a detective for your photos!'
    },
    {
      id: 'gps-coordinates',
      category: 'features',
      question: 'Can I see where a photo was taken?',
      answer: 'Yes! If your camera or phone recorded location information, ProofPix will show you exactly where the photo was taken and can display it on a map. This is incredibly useful for organizing photos or verifying locations.'
    },
    {
      id: 'batch-processing',
      category: 'features',
      question: 'Can I analyze multiple photos at once?',
      answer: 'Absolutely! ProofPix can analyze dozens or hundreds of photos simultaneously, saving you tons of time. This feature is perfect for legal professionals, insurance adjusters, and anyone working with large photo collections.'
    },
    {
      id: 'export-data',
      category: 'features',
      question: 'Can I save or export the information?',
      answer: 'Yes! You can create professional PDF reports, download data as spreadsheets (CSV), or export technical data (JSON). Perfect for legal documentation, insurance claims, or organizing your photo collection.'
    },
    {
      id: 'remove-metadata',
      category: 'features',
      question: 'Can ProofPix remove information from photos?',
      answer: 'Yes! ProofPix can strip all hidden information from your photos while keeping the image quality perfect. This is great when you want to share photos publicly without revealing location or camera details.'
    },

    // Technical
    {
      id: 'browser-support',
      category: 'technical',
      question: 'Which browsers work with ProofPix?',
      answer: 'ProofPix works on all modern browsers including Chrome, Firefox, Safari, and Edge. No plugins or downloads required - it runs entirely in your web browser.'
    },
    {
      id: 'mobile-support',
      category: 'technical',
      question: 'Does ProofPix work on mobile devices?',
      answer: 'Yes! ProofPix is fully responsive and works great on smartphones and tablets. You can analyze photos directly from your phone\'s camera or photo library.'
    },
    {
      id: 'file-size-limits',
      category: 'technical',
      question: 'Are there file size limits?',
      answer: 'ProofPix can handle large photo files, including high-resolution images and RAW files. Processing happens locally, so limits depend on your device\'s memory and browser capabilities.'
    },
    {
      id: 'internet-required',
      category: 'technical',
      question: 'Do I need an internet connection?',
      answer: 'You need internet to load ProofPix initially, but once loaded, photo analysis works offline. Your photos are processed locally without any server communication.'
    },

    // Pricing
    {
      id: 'free-features',
      category: 'pricing',
      question: 'What\'s included in the free version?',
      answer: 'The free version includes full metadata extraction, basic export options, and all core features. You can analyze unlimited photos with no account required.'
    },
    {
      id: 'professional-features',
      category: 'pricing',
      question: 'What do professional features include?',
      answer: 'Professional features include batch processing, advanced export formats, metadata removal tools, and priority support. Perfect for photographers and legal professionals.'
    },
    {
      id: 'pricing-model',
      category: 'pricing',
      question: 'How does pricing work?',
      answer: 'ProofPix uses a freemium model. Core features are free forever. Professional features are available through affordable subscriptions that help support development and hosting.'
    },
    {
      id: 'enterprise-options',
      category: 'pricing',
      question: 'Do you offer enterprise solutions?',
      answer: 'Yes! We offer enterprise solutions with custom branding, advanced security features, and dedicated support for organizations that need professional photo analysis tools.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <EnterpriseLayout
      showHero
      title="Frequently Asked Questions"
      description="Everything you need to know about ProofPix, photo metadata, and protecting your privacy."
      maxWidth="7xl"
    >
        {/* Quick Start Section */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-12 text-center">
        <h3 className="text-emerald-800 text-xl font-bold mb-4 flex items-center justify-center gap-3">
            🚀 New to ProofPix?
          </h3>
        <p className="text-emerald-700 mb-6">
            Try it now! Upload a photo and see your metadata in seconds. No account required, completely private.
          </p>
          <button
          onClick={() => navigate('/')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Start Now - It's Free
          </button>
        </div>

      {/* Search and Filter */}
      <div className="mb-12">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
              </div>

              {/* FAQ Items */}
      <div className="max-w-4xl mx-auto">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No questions found</h3>
            <p className="text-slate-600">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-slate-900 pr-4">
                    {faq.question}
                  </h3>
                  {expandedItems.has(faq.id) ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedItems.has(faq.id) && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-20">
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-slate-600">
              Our support team is here to help you get the most out of ProofPix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Contact Support</h3>
              <p className="text-slate-600 text-sm mb-4">Get help from our support team</p>
              <button
                onClick={() => navigate('/support')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Contact Support →
              </button>
            </div>

            <div className="text-center p-6 bg-white rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Camera className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Try ProofPix</h3>
              <p className="text-slate-600 text-sm mb-4">Start analyzing your photos right now</p>
              <button
                onClick={() => navigate('/')}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                Start Analyzing →
              </button>
            </div>

            <div className="text-center p-6 bg-white rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Learn More</h3>
              <p className="text-slate-600 text-sm mb-4">Read about ProofPix and photo privacy</p>
              <button
                onClick={() => navigate('/about')}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                About ProofPix →
              </button>
            </div>
          </div>
        </div>
        </div>

      {/* Popular Resources */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Popular Resources
          </h2>
          <p className="text-slate-600">
            Quick links to commonly requested information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/pricing')}
            className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-left"
          >
            <CreditCard className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-slate-900 mb-1">Pricing</h3>
            <p className="text-sm text-slate-600">Free and professional options</p>
          </button>

          <button
            onClick={() => navigate('/')}
            className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-left"
          >
            <Camera className="w-6 h-6 text-emerald-600 mb-2" />
            <h3 className="font-medium text-slate-900 mb-1">Try ProofPix</h3>
            <p className="text-sm text-slate-600">Analyze your photos now</p>
          </button>

          <button
            onClick={() => navigate('/about')}
            className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-left"
          >
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-slate-900 mb-1">About Us</h3>
            <p className="text-sm text-slate-600">Learn about our mission</p>
          </button>

          <button
            onClick={() => navigate('/privacy')}
            className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow text-left"
          >
            <Lock className="w-6 h-6 text-red-600 mb-2" />
            <h3 className="font-medium text-slate-900 mb-1">Privacy Policy</h3>
            <p className="text-sm text-slate-600">How we protect your privacy</p>
          </button>
        </div>
      </div>
    </EnterpriseLayout>
  );
}; 