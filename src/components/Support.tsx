import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, Clock, HelpCircle, FileText, Users, AlertCircle, CheckCircle, MessageSquare, Shield, Zap, Globe } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { Sponsorship } from './Sponsorships';

export const Support: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    analytics.trackFeatureUsage('Navigation', 'Home - Support');
    navigate('/');
  };

  const handleAboutClick = () => {
    analytics.trackFeatureUsage('Navigation', 'About Us - Support');
    navigate('/about');
  };

  const handlePrivacyClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Privacy Policy - Support');
    navigate('/privacy');
  };

  const handleFAQClick = () => {
    analytics.trackFeatureUsage('Navigation', 'FAQ - Support');
    navigate('/faq');
  };

  const handleTermsClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Terms - Support');
    navigate('/terms');
  };

  const handleEmailClick = (type: string) => {
    analytics.trackFeatureUsage('CTA Click', `Email Contact - ${type} - Support`);
    const emails = {
      support: 'support@proofpixapp.com', // Cloudflare
      enterprise: 'enterprise@proofpixapp.com', // Cloudflare
      security: 'security@proofpixapp.com', // Cloudflare
      product: 'product@proofpixapp.com', // Cloudflare
      partners: 'partners@proofpixapp.com', // Cloudflare
      billing: 'billing@proofpixapp.com', // Cloudflare
      legal: 'legal@proofpixapp.com' // Cloudflare
    };
    window.location.href = `mailto:${emails[type as keyof typeof emails]}`;
  };

  const handleFAQNavClick = () => {
    analytics.trackFeatureUsage('Navigation', 'FAQ Link - Support');
    navigate('/faq');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={handleBackHome}>
              <Camera className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold">ProofPix</h1>
            </div>
            
            {/* Header Sponsorship */}
            <div className="hidden lg:block">
              <Sponsorship placement="header" className="max-w-md" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
            Support Center
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We're here to help with any questions about ProofPix
          </p>
        </section>

        {/* Quick Status */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 mb-16">
          <div className="flex items-center gap-4 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-green-400 text-2xl font-bold">System Status</h2>
          </div>
          <p className="text-gray-300 text-lg">
            ✅ All systems operational • ProofPix is running smoothly
          </p>
        </div>

        {/* Contact Methods */}
        <div className="space-y-10 mb-16">
          {/* Primary Contact */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <Mail className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Contact Methods</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email Support */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Support
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => handleEmailClick('support')}
                    className="block w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <div className="font-semibold">support@proofpixapp.com</div>
                    <div className="text-sm text-blue-100">24-48 hour response time</div>
                  </button>
                  <div className="text-gray-300 text-sm">
                    <p><strong>Best for:</strong> General questions, technical issues, billing support</p>
                  </div>
                </div>
              </div>

              {/* Self-Service */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <h4 className="text-green-400 text-lg font-semibold mb-3 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Self-Service
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={handleFAQNavClick}
                    className="block w-full text-left bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <div className="font-semibold">Check Our FAQ</div>
                    <div className="text-sm text-green-100">Instant answers to common questions</div>
                  </button>
                  <div className="text-gray-300 text-sm">
                    <p><strong>Best for:</strong> Quick answers, how-to guides, troubleshooting</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Support Hours */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <Clock className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Support Hours</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">📅 Regular Business Hours</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM EST</li>
                  <li><strong>Saturday - Sunday:</strong> Limited support (48-72 hour response)</li>
                  <li><strong>Response Time:</strong> 24-48 hours during business days</li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h4 className="text-yellow-400 text-lg font-semibold mb-3">🎄 Holidays (Office Closed)</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• New Year's Day</li>
                  <li>• Memorial Day</li>
                  <li>• Independence Day</li>
                  <li>• Labor Day</li>
                  <li>• Thanksgiving Day</li>
                  <li>• Christmas Day</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mt-6">
              <p className="text-green-400 font-semibold">
                🌐 ProofPix service remains fully operational 24/7, even when support is unavailable.
              </p>
            </div>
          </section>

          {/* Common Support Topics */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Common Support Topics</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Refund Requests */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">💰 Refund Requests</h4>
                <p className="text-gray-300 mb-3">Need a refund? We offer a 30-day money-back guarantee for first-time premium subscribers.</p>
                <button
                  onClick={() => handleEmailClick('support')}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Email support@proofpixapp.com
                </button>
              </div>

              {/* Billing Questions */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <h4 className="text-green-400 text-lg font-semibold mb-3">💳 Billing Questions</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Subscription management</li>
                  <li>• Payment method updates</li>
                  <li>• Invoice requests</li>
                  <li>• Pricing inquiries</li>
                </ul>
              </div>

              {/* Technical Issues */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h4 className="text-yellow-400 text-lg font-semibold mb-3">🔧 Technical Issues</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Image processing problems</li>
                  <li>• Browser compatibility</li>
                  <li>• Export failures</li>
                  <li>• Metadata detection issues</li>
                </ul>
              </div>

              {/* Account Management */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-purple-400 text-lg font-semibold mb-3">👤 Account Management</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Password reset</li>
                  <li>• Email changes</li>
                  <li>• Subscription upgrades/downgrades</li>
                  <li>• Account deletion requests</li>
                </ul>
              </div>

              {/* Feature Requests */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6">
                <h4 className="text-indigo-400 text-lg font-semibold mb-3">💡 Feature Requests</h4>
                <p className="text-gray-300 text-sm mb-2">We love hearing your ideas! Send suggestions for new features or improvements.</p>
                <button
                  onClick={() => handleEmailClick('product')}
                  className="text-indigo-400 hover:text-indigo-300 underline text-sm"
                                  >
                    product@proofpixapp.com
                  </button>
              </div>

              {/* Bug Reports */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <h4 className="text-red-400 text-lg font-semibold mb-3">🐛 Bug Reports</h4>
                <p className="text-gray-300 text-sm">Found a bug? Help us fix it by providing detailed information about the issue.</p>
              </div>
            </div>
          </section>

          {/* Before You Contact Us */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Before You Contact Us</h2>
            </div>
            
            <p className="text-gray-300 mb-6">Try these quick fixes first - they solve most common issues:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">🧹 Clear Browser Cache</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Chrome: Settings → Privacy → Clear browsing data</li>
                    <li>• Firefox: Settings → Privacy & Security → Clear Data</li>
                    <li>• Safari: Preferences → Privacy → Manage Website Data</li>
                  </ul>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <h4 className="text-green-400 font-semibold mb-2">🌐 Check Browser Compatibility</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Chrome 90+ (Recommended)</li>
                    <li>• Firefox 88+</li>
                    <li>• Safari 14+</li>
                    <li>• Edge 90+</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">📁 Verify File Format</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Supported: JPEG, PNG, HEIC, HEIF, WebP</li>
                    <li>• Maximum file size: 50MB per image</li>
                    <li>• Bulk processing: Up to 100 images (Premium)</li>
                  </ul>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">🔌 Disable Browser Extensions</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Ad blockers may interfere with processing</li>
                    <li>• Try incognito/private mode</li>
                    <li>• Check internet connection stability</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Business & Enterprise */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Business & Enterprise</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Enterprise Support
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm mb-4">
                  <li>• Volume licensing available</li>
                  <li>• Custom deployment options</li>
                  <li>• Priority support SLA</li>
                  <li>• Training and onboarding</li>
                </ul>
                <button
                  onClick={() => handleEmailClick('enterprise')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                  >
                    enterprise@proofpixapp.com
                  </button>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <h4 className="text-green-400 text-lg font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Partnership Inquiries
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm mb-4">
                  <li>• API access</li>
                  <li>• White-label solutions</li>
                  <li>• Integration opportunities</li>
                  <li>• Reseller programs</li>
                </ul>
                <button
                  onClick={() => handleEmailClick('partners')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                  >
                    partners@proofpixapp.com
                  </button>
              </div>
            </div>
          </section>

          {/* Self-Service Resources */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <FileText className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Self-Service Resources</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h4 className="text-blue-400 text-lg font-semibold mb-3">📚 Documentation</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• <button onClick={() => navigate('/docs/getting-started')} className="text-blue-400 hover:text-blue-300 underline">Getting Started Guide</button></li>
                    <li>• <button onClick={() => navigate('/docs/api')} className="text-blue-400 hover:text-blue-300 underline">API Documentation</button> <span className="text-gray-400">[Enterprise]</span></li>
                    <li>• <button onClick={() => navigate('/docs/privacy-guide')} className="text-blue-400 hover:text-blue-300 underline">Privacy Best Practices</button></li>
                    <li>• <button onClick={() => navigate('/docs/metadata-guide')} className="text-blue-400 hover:text-blue-300 underline">Metadata Types Explained</button></li>
                  </ul>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                  <h4 className="text-green-400 text-lg font-semibold mb-3">🎥 Video Tutorials</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• <span className="text-gray-400">[Coming Soon]</span> How to Remove GPS Data (5 min)</li>
                    <li>• <span className="text-gray-400">[Coming Soon]</span> Bulk Processing Guide (8 min)</li>
                    <li>• <span className="text-gray-400">[Coming Soon]</span> Understanding EXIF Data (12 min)</li>
                    <li>• <span className="text-gray-400">[Coming Soon]</span> Privacy Best Practices (10 min)</li>
                  </ul>
                  <p className="text-sm text-gray-400 mt-3 italic">
                    📹 Video tutorials will be hosted on YouTube and embedded in our documentation
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                  <h4 className="text-purple-400 text-lg font-semibold mb-3">🌐 Community</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• <a href="https://blog.proofpixapp.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">ProofPix Blog</a></li>
                    <li>• <a href="https://medium.com/proofpix" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Medium Publication</a></li>
                    <li>• <span className="text-gray-400">[Coming Soon]</span> Privacy Tips Newsletter</li>
                    <li>• <span className="text-gray-400">[Coming Soon]</span> User Forum</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                  <h4 className="text-yellow-400 text-lg font-semibold mb-3">🔍 Quick Links</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• <button onClick={handleFAQClick} className="text-blue-400 hover:text-blue-300 underline">Frequently Asked Questions</button></li>
                    <li>• <button onClick={handlePrivacyClick} className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</button></li>
                    <li>• <button onClick={handleTermsClick} className="text-blue-400 hover:text-blue-300 underline">Terms of Service</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Report Issues */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Report Issues</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <h4 className="text-red-400 text-lg font-semibold mb-3">🔒 Security Vulnerabilities</h4>
                <p className="text-gray-300 mb-3">Please do not publicly disclose security issues. We offer responsible disclosure rewards.</p>
                <button
                  onClick={() => handleEmailClick('security')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  security@proofpixapp.com
                </button>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h4 className="text-yellow-400 text-lg font-semibold mb-3">🐛 Bug Reports</h4>
                <p className="text-gray-300 mb-3">When reporting bugs, please include:</p>
                <ul className="text-gray-300 text-sm space-y-1 mb-3">
                  <li>• Browser version</li>
                  <li>• Operating system</li>
                  <li>• Steps to reproduce</li>
                  <li>• Error messages (if any)</li>
                  <li>• Screenshots (helpful but not required)</li>
                </ul>
                <button
                  onClick={() => handleEmailClick('support')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Report Bug
                </button>
              </div>
            </div>
          </section>

          {/* Business Information */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <Globe className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Business Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-6">
                <h4 className="text-gray-300 text-lg font-semibold mb-3">🏢 Company Details</h4>
                          <div className="text-gray-400 space-y-1">
            <p><strong>ProofPix</strong></p>
            <p>ProofPix</p>
            <p>2501 Wharton St Unit S RLA 502</p>
            <p>Philadelphia, PA 19146</p>
            <p>United States</p>
          </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">📋 Legal Information</h4>
                <div className="text-gray-300 space-y-2">
                  <p><strong>Business Registration:</strong> [Your Business Registration Number]</p>
                  <p><strong>VAT/Tax ID:</strong> [Your Tax ID]</p>
                  <button
                    onClick={() => handleEmailClick('legal')}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    legal@proofpixapp.com
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Content Sponsorship */}
        <div className="py-8">
          <Sponsorship placement="content" className="max-w-2xl mx-auto" />
        </div>

        {/* Feedback Section */}
        <div className="bg-gradient-to-r from-blue-500/10 via-blue-600/5 to-blue-500/10 rounded-3xl p-10 text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">We Value Your Feedback</h2>
          <p className="text-xl text-gray-400 mb-8">
            Your feedback shapes ProofPix. We read every message and use your input to improve our service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleEmailClick('product')}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              Product Feedback
            </button>
            <button
              onClick={() => handleEmailClick('support')}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/25"
            >
              General Inquiries
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 mb-16">
          <p className="text-gray-300 text-center text-lg leading-relaxed">
            <strong>ProofPix is committed to protecting your privacy through local, browser-based photo processing.</strong>
            <br />
            We never upload or store your images on our servers.
          </p>
        </div>

        {/* Bottom Sponsorship */}
        <div className="py-8">
          <Sponsorship placement="bottom" className="max-w-3xl mx-auto" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>© 2025 ProofPix. Built for professionals, by professionals.</p>
              <p>Privacy-respecting EXIF metadata tool - v1.7.1 • Open Source</p>
            </div>
            <nav className="flex space-x-6 text-sm">
              <button onClick={handleBackHome} className="text-gray-400 hover:text-white">Home</button>
              <button onClick={handleFAQClick} className="text-gray-400 hover:text-white">F.A.Q.</button>
              <button onClick={handleAboutClick} className="text-gray-400 hover:text-white">About</button>
              <button onClick={handlePrivacyClick} className="text-gray-400 hover:text-white">Privacy</button>
              <button onClick={handleTermsClick} className="text-gray-400 hover:text-white">Terms</button>
              <span className="text-blue-400 font-medium">Support</span>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}; 