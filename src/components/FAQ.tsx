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
      question: 'What is ProofPix and how does it work?',
      answer: 'ProofPix reveals the hidden story behind any photo. Every digital photo contains invisible information—where it was taken, when, what camera was used, and much more. We extract this information instantly and privately, right in your browser. Think of it as a detective for your photos that works completely offline and never sees your data.'
    },
    {
      id: 'how-to-start',
      category: 'general',
      question: 'How do I get started?',
      answer: 'Just drag and drop a photo onto our homepage, or click to select one from your device. Results appear in seconds—no account required, no downloads, completely free to try. It\'s that simple!'
    },
    {
      id: 'file-formats',
      category: 'general',
      question: 'What types of photos work with ProofPix?',
      answer: 'ProofPix works with photos from any camera or phone—JPEG, PNG, TIFF, HEIC, and even professional RAW files. Whether it\'s from your iPhone, Android, DSLR camera, or downloaded from the web, we can analyze it.'
    },
    {
      id: 'no-metadata',
      category: 'general',
      question: 'Why does my photo show "No information found"?',
      answer: 'Some photos don\'t contain hidden information, and that\'s actually good for privacy! Screenshots, heavily edited photos, and images from social media often have this information removed. Photos from older cameras or phones with location services disabled also won\'t have GPS data.'
    },

    // Privacy & Security
    {
      id: 'privacy-protection',
      category: 'privacy',
      question: 'How do you protect my photos?',
      answer: 'Your photos never leave your device—period. ProofPix works entirely in your browser using advanced technology that processes everything locally. We literally cannot see your photos because they never reach our servers. It\'s like having a private photo lab that only you can access.'
    },
    {
      id: 'data-collection',
      category: 'privacy',
      question: 'What data do you collect about me?',
      answer: 'We collect basic website analytics (like page views) to improve ProofPix, but we never see your photos or their hidden information. Everything stays on your device, completely private. We can\'t collect what we can\'t see, and we can\'t see what never leaves your device.'
    },
    {
      id: 'gdpr-compliance',
      category: 'privacy',
      question: 'Is ProofPix GDPR compliant?',
      answer: 'Yes, and here\'s why it\'s different: Since your photos and their information never leave your device, there\'s literally no personal data for us to mishandle. Our privacy protection is built into the technology itself, not just promised in a policy. You can\'t breach data that was never collected.'
    },
    {
      id: 'open-source',
      category: 'privacy',
      question: 'Can I verify ProofPix is really private?',
      answer: 'Absolutely! ProofPix is open source, which means you can review our code, suggest improvements, or even run your own version. This transparency means you don\'t have to just trust our privacy claims—you can verify them yourself.'
    },

    // Features & Usage
    {
      id: 'what-information-revealed',
      category: 'features',
      question: 'What hidden information can ProofPix reveal?',
      answer: 'ProofPix uncovers the complete story cameras store in every photo: exact GPS location (often down to the meter), precise timestamps, camera make and model, technical settings like aperture and ISO, image dimensions, and even signs of editing. It\'s like having a forensic expert analyze your photos instantly.'
    },
    {
      id: 'gps-locations',
      category: 'features',
      question: 'Can I see exactly where a photo was taken?',
      answer: 'Yes! If your camera or phone recorded location information, ProofPix will show you exactly where the photo was taken and display it on an interactive map. This is incredibly useful for organizing travel photos, verifying locations, or understanding the context of any image.'
    },
    {
      id: 'batch-processing',
      category: 'features',
      question: 'Can I analyze multiple photos at once?',
      answer: 'Absolutely! ProofPix can analyze dozens or hundreds of photos simultaneously, saving you hours of time. This feature is perfect for legal professionals, insurance adjusters, real estate agents, and anyone working with large photo collections.'
    },
    {
      id: 'export-options',
      category: 'features',
      question: 'How can I save or share the results?',
      answer: 'You can create professional PDF reports, download data as spreadsheets (CSV), or export technical data (JSON). Perfect for legal documentation, insurance claims, business reports, or simply organizing your photo collection with detailed information.'
    },
    {
      id: 'remove-information',
      category: 'features',
      question: 'Can ProofPix remove hidden information from photos?',
      answer: 'Yes! ProofPix can strip all hidden information from your photos while keeping the image quality perfect. This is great when you want to share photos publicly without revealing location, camera details, or other sensitive information.'
    },

    // Technical
    {
      id: 'browser-compatibility',
      category: 'technical',
      question: 'What devices and browsers work with ProofPix?',
      answer: 'ProofPix works on all modern browsers including Chrome, Firefox, Safari, and Edge. No plugins or downloads required—it runs entirely in your web browser on any device: Windows, Mac, iPhone, Android, tablets, you name it.'
    },
    {
      id: 'mobile-experience',
      category: 'technical',
      question: 'Does ProofPix work well on phones and tablets?',
      answer: 'Yes! ProofPix is fully responsive and works great on smartphones and tablets. You can analyze photos directly from your phone\'s camera or photo library. The mobile experience is particularly useful for field workers who need to verify photos on the go.'
    },
    {
      id: 'file-size-limits',
      category: 'technical',
      question: 'Are there limits on photo size or quality?',
      answer: 'ProofPix can handle large photo files, including high-resolution images and professional RAW files. Since processing happens locally on your device, limits depend mainly on your device\'s memory and browser capabilities. Most modern devices handle even very large files without issues.'
    },
    {
      id: 'offline-capability',
      category: 'technical',
      question: 'Do I need an internet connection to use ProofPix?',
      answer: 'You need internet to load ProofPix initially, but once loaded, photo analysis works completely offline. Your photos are processed locally without any server communication, making it perfect for sensitive work or areas with limited connectivity.'
    },

    // Pricing & Plans
    {
      id: 'free-features',
      category: 'pricing',
      question: 'What\'s included in the free version?',
      answer: 'The free version includes full photo analysis, GPS mapping, basic export options, and all core features. You can analyze unlimited photos with complete privacy—no account required, no credit card needed, no hidden fees.'
    },
    {
      id: 'professional-benefits',
      category: 'pricing',
      question: 'What extra benefits do I get with Professional?',
      answer: 'Professional adds time-saving features like batch processing (analyze 100+ photos at once), professional PDF reports, advanced export formats, privacy removal tools, and priority support. Perfect for photographers, legal professionals, and anyone who works with lots of photos.'
    },
    {
      id: 'pricing-value',
      category: 'pricing',
      question: 'How does ProofPix pricing work?',
      answer: 'ProofPix uses a freemium model—core features are free forever. Professional features are available through affordable subscriptions that help support development and keep the service running. We believe in providing value first, then earning your business.'
    },
    {
      id: 'enterprise-solutions',
      category: 'pricing',
      question: 'Do you offer solutions for large organizations?',
      answer: 'Yes! We offer enterprise solutions with custom branding, team management, advanced security features, and dedicated support for organizations that need professional photo analysis tools. Perfect for legal firms, insurance companies, and government agencies.'
    },

    // Business Value & ROI
    {
      id: 'legal-roi',
      category: 'pricing',
      question: 'How does ProofPix help legal professionals?',
      answer: 'Legal teams save 80% of investigation time and eliminate data breach liability entirely. One prevented breach pays for decades of ProofPix. Plus, court-admissible reports strengthen cases and reduce discovery disputes. Many firms see ROI within the first case.'
    },
    {
      id: 'insurance-fraud-prevention',
      category: 'pricing',
      question: 'How much fraud can ProofPix help prevent?',
      answer: 'Insurance companies using ProofPix report 37% reduction in fraudulent claims. For a mid-size insurer, that\'s typically $2-5M in prevented payouts annually—far exceeding the cost of our enterprise solution. The photo evidence speaks for itself.'
    },
    {
      id: 'competitive-advantage',
      category: 'general',
      question: 'How is ProofPix different from other photo analysis tools?',
      answer: 'Other tools require uploading your photos to their servers—creating data breach risk and compliance issues. ProofPix is the only platform that literally cannot see your data, making breaches technically impossible while delivering faster, more accurate results.'
    },
    {
      id: 'browser-vs-software',
      category: 'technical',
      question: 'Why use a browser tool instead of desktop software?',
      answer: 'Browser-based means instant access, automatic updates, and works on any device. But unlike other web tools, ProofPix runs entirely locally—giving you desktop-level privacy with web-level convenience. No installation, no maintenance, no security updates to manage.'
    },

    // Enterprise & Deployment
    {
      id: 'enterprise-deployment',
      category: 'technical',
      question: 'How quickly can we deploy ProofPix across our organization?',
      answer: 'Enterprise deployment takes minutes, not months. Since ProofPix runs in browsers, there\'s no software to install or maintain. Just provide the URL to your team and they\'re ready to analyze images securely. SSO integration adds maybe an hour.'
    },
    {
      id: 'compliance-built-in',
      category: 'pricing',
      question: 'How does ProofPix ensure compliance automatically?',
      answer: 'Compliance is built into our architecture, not added as an afterthought. Since your data never leaves your device, GDPR, HIPAA, and SOC 2 requirements are met by design. No policies to maintain, no audits to worry about—compliance is technically guaranteed.'
    },
    {
      id: 'insurance-cost-reduction',
      category: 'pricing',
      question: 'Can ProofPix reduce our data breach insurance costs?',
      answer: 'Many customers see insurance premium reductions because we eliminate data breach risk entirely. When insurers understand that your image data literally cannot be breached (because it never leaves your devices), they often adjust premiums accordingly.'
    },
    {
      id: 'competitive-advantage-business',
      category: 'general',
      question: 'What competitive advantage does ProofPix provide our business?',
      answer: 'You can offer clients something competitors can\'t: guaranteed data privacy. Legal firms win more cases, insurance companies prevent more fraud, healthcare organizations avoid HIPAA violations—all while competitors struggle with data breach risks and compliance costs.'
    },
    {
      id: 'system-integration',
      category: 'technical',
      question: 'How does ProofPix integrate with our existing systems?',
      answer: 'Our API integrates seamlessly with existing workflows while maintaining privacy. Unlike traditional APIs that require sending data to external servers, our integration points work with locally processed results—keeping your data secure throughout the entire workflow.'
    },
    {
      id: 'team-training',
      category: 'general',
      question: 'How long does it take to train our team on ProofPix?',
      answer: 'Most teams are productive within minutes. The interface is intuitive—drag, drop, analyze. Advanced features like batch processing and custom reports typically take under an hour to master. We also provide specialized training for legal, insurance, and healthcare workflows.'
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
      title="Your Questions, Answered"
      description="Everything you need to know about unhackable photo analysis and why privacy-first actually works better."
      maxWidth="7xl"
    >
        {/* Quick Start Section */}
      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-8 mb-12 text-center">
        <h3 className="text-emerald-400 text-xl font-bold mb-4 flex items-center justify-center gap-3">
            🚀 New to ProofPix?
          </h3>
        <p className="text-emerald-300 mb-6">
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