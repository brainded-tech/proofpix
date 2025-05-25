import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { Sponsorship } from './Sponsorships';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    analytics.trackFeatureUsage('Navigation', 'Home - Privacy Policy');
    navigate('/');
  };

  const handleAboutClick = () => {
    analytics.trackFeatureUsage('Navigation', 'About Us - Privacy Policy');
    navigate('/about');
  };

  const handleContactClick = () => {
    analytics.trackFeatureUsage('CTA Click', 'Contact Us - Privacy Policy');
    // Link to contact section on main site
    window.location.href = 'https://proofpixapp.com/#contact';
  };

  const handleFAQClick = () => {
    analytics.trackFeatureUsage('Navigation', 'FAQ - Privacy Policy');
    navigate('/faq');
  };

  const handleContactFooterClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Contact - Privacy Policy Footer');
    window.location.href = 'https://proofpixapp.com/#contact';
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
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg mb-5">Last Updated: May 2025</p>
        </section>

        {/* Privacy Commitment */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 mb-16">
          <h2 className="text-green-400 text-2xl font-bold mb-4 flex items-center gap-3">
            🔒 Our Privacy-Respecting Commitment
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            ProofPix was built with privacy as a core principle. We believe you shouldn't have to choose between powerful features and privacy. Here's our comprehensive privacy policy explaining exactly how we protect your data and respect your privacy.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 mb-16">
          {/* Section 1: Image Processing & Storage */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">📱</span>
              <h2 className="text-2xl font-bold">Image Processing & Storage</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-2">🛡️ Zero Server Storage Guarantee</h4>
                <p className="text-gray-300">We never upload or store your photos on any servers. Your images stay on your device, always.</p>
              </div>
              
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Local Processing:</strong> All image processing happens directly in your browser using advanced client-side technology.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Zero Server Storage:</strong> We never upload or store your photos on any servers, anywhere.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Client-Side Operations:</strong> EXIF data extraction, timestamp overlays, and all image operations are performed locally on your device.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Offline Capability:</strong> Once loaded, the app can function without an internet connection for complete privacy.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Data Generation & Control */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">🎛️</span>
              <h2 className="text-2xl font-bold">Data Generation & Control</h2>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">•</span>
                <span><strong>Your Data Stays Yours:</strong> All generated content (edited images, PDFs, metadata reports) remains under your complete control.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">•</span>
                <span><strong>No Account Required:</strong> We don't require user accounts or logins for basic functionality.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">•</span>
                <span><strong>Local Storage Only:</strong> Any temporary data is stored locally in your browser and can be cleared at any time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">•</span>
                <span><strong>Full Control:</strong> You decide what to download, save, or delete - we never make that choice for you.</span>
              </li>
            </ul>
          </section>

          {/* Section 3: Privacy-Respecting Analytics */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">📊</span>
              <h2 className="text-2xl font-bold">Privacy-Respecting Analytics</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">To improve our service and understand how ProofPix is used, we employ Plausible Analytics with the following privacy safeguards:</p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">🔍 What We Track (Anonymously)</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Page views and navigation patterns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Feature usage statistics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Error reports for debugging</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Performance metrics</span>
                  </li>
                </ul>
              </div>

              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Plausible Analytics:</strong> We use privacy-friendly Plausible Analytics instead of Google Analytics - no cookies, no personal data collection.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>GDPR Compliant:</strong> Our analytics are GDPR compliant by design and don't require cookie consent banners.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>No Personal Information:</strong> We don't track or store any personally identifiable information.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Anonymous Usage Data:</strong> We track basic metrics like features used and navigation patterns, all completely anonymously.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Direct Sponsorships */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">🤝</span>
              <h2 className="text-2xl font-bold">Direct Sponsorships</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">ProofPix is supported by direct sponsorships from privacy-focused companies to keep the service free for basic usage. Our sponsorship model prioritizes your privacy:</p>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <h4 className="text-green-400 text-lg font-semibold mb-2">✅ Privacy-First Partnerships</h4>
                <p className="text-gray-300">We only partner with companies that share our commitment to privacy and user respect. No tracking, no data sharing.</p>
              </div>

              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Curated Partnerships:</strong> We carefully select sponsors that offer relevant tools for photographers and developers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>No User Tracking:</strong> Sponsors cannot track your behavior or access any of your data.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Clear Labeling:</strong> All sponsored content is clearly labeled as "Sponsored" or "Partnership".</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Complete Separation:</strong> Sponsorship systems are completely isolated from your image processing activities.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Direct Relationships:</strong> We work directly with sponsors, avoiding ad networks that compromise privacy.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Your Rights & Choices */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">⚖️</span>
              <h2 className="text-2xl font-bold">Your Rights & Choices</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">You have complete control over your privacy settings and data:</p>
              
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>No Cookies Required:</strong> Our core functionality doesn't require cookies, and our analytics don't use them either.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Analytics Opt-Out:</strong> You can use browser extensions or ad blockers to block analytics if desired.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Local Data Control:</strong> All local storage data can be cleared through your browser settings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Data Access:</strong> Since we don't store your data on our servers, there's nothing to request or delete from us.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Third-Party Services */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">🔗</span>
              <h2 className="text-2xl font-bold">Third-Party Services</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">ProofPix integrates with the following third-party services for analytics:</p>
              
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <div>
                    <strong>Plausible Analytics:</strong> For privacy-friendly usage statistics and performance monitoring
                    <br />
                    <a 
                      href="https://plausible.io/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      View Plausible Privacy Policy
                    </a>
                  </div>
                </li>
              </ul>
              
              <p className="text-gray-300">Plausible operates under their own privacy policy, which we encourage you to review. They share our commitment to privacy-first analytics.</p>
            </div>
          </section>

          {/* Section 7: Changes to This Policy */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">📝</span>
              <h2 className="text-2xl font-bold">Changes to This Policy</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">We may update this privacy policy as our service evolves and improves. Here's how we handle changes:</p>
              
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Notification:</strong> Significant changes will be announced prominently on our website.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Transparency:</strong> The "Last Updated" date at the top will always reflect the most recent changes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Review:</strong> We encourage you to review this policy periodically to stay informed about how we protect your privacy.</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Content Sponsorship */}
        <div className="py-8">
          <Sponsorship placement="content" className="max-w-2xl mx-auto" />
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-500/10 via-blue-600/5 to-blue-500/10 rounded-3xl p-10 text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-xl text-gray-400 mb-8">
            If you have questions about this privacy policy or our privacy practices, we're here to help.
          </p>
          <button
            onClick={handleContactClick}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            Contact Us
          </button>
        </div>

        {/* Agreement Notice */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 mb-16">
          <p className="text-gray-300 text-center text-lg leading-relaxed">
            <strong>By using ProofPix, you agree to this privacy policy and our use of privacy-respecting analytics and direct sponsorships as described above.</strong>
            <br /><br />
            We're committed to transparency and protecting your privacy while providing you with powerful photo verification tools.
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
              <p>Privacy-respecting EXIF metadata tool - v1.7.1</p>
            </div>
            <nav className="flex space-x-6 text-sm">
              <button onClick={handleBackHome} className="text-gray-400 hover:text-white">Home</button>
              <button onClick={handleFAQClick} className="text-gray-400 hover:text-white">F.A.Q.</button>
              <button onClick={handleAboutClick} className="text-gray-400 hover:text-white">About</button>
              <span className="text-blue-400 font-medium">Privacy</span>
              <button onClick={handleContactFooterClick} className="text-gray-400 hover:text-white">Contact</button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}; 