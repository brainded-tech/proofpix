import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { Sponsorship } from './Sponsorships';

export const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const handleTryNowClick = () => {
    analytics.trackFeatureUsage('CTA Click', 'Try ProofPix Now - About Page');
    navigate('/');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const handlePrivacyClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Privacy Policy - About Page');
    navigate('/privacy');
  };

  const handleFAQClick = () => {
    analytics.trackFeatureUsage('Navigation', 'FAQ - About Page Footer');
    navigate('/faq');
  };

  const handleContactClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Contact - About Page Footer');
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

      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
            Your Photos. Your Proof. Your Privacy.
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-4xl mx-auto">
            ProofPix extracts hidden metadata from your photos to prove authenticity, verify timestamps, and document location—all without uploading anything to the cloud.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm font-semibold border border-green-500/20">
            🔒 Privacy-Respecting • No Uploads • Browser-Only Processing
          </div>
        </section>

        {/* Why ProofPix Section */}
        <section className="py-16 border-t border-gray-700">
          <h2 className="text-4xl font-bold text-center mb-5">Why ProofPix?</h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Every digital photo contains hidden metadata that can prove when, where, and how it was taken. ProofPix makes this invisible information visible and actionable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-5xl mb-5 block">🚗</span>
              <h3 className="text-2xl font-semibold mb-4">For Gig Workers</h3>
              <p className="text-gray-400 leading-relaxed">
                Uber, Lyft, and delivery drivers: Document incidents, prove delivery locations, and protect yourself with timestamped, GPS-verified photos that hold up with insurance and legal proceedings.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-5xl mb-5 block">🏗️</span>
              <h3 className="text-2xl font-semibold mb-4">For Contractors</h3>
              <p className="text-gray-400 leading-relaxed">
                Show clients exactly when work was completed with verifiable progress photos. Create professional documentation that builds trust and protects against disputes.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-5xl mb-5 block">🏡</span>
              <h3 className="text-2xl font-semibold mb-4">For Real Estate</h3>
              <p className="text-gray-400 leading-relaxed">
                Ensure MLS compliance and property documentation accuracy. Verify listing photos are current and authentic with extractable metadata and professional reports.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-5xl mb-5 block">📋</span>
              <h3 className="text-2xl font-semibold mb-4">For Insurance & Legal</h3>
              <p className="text-gray-400 leading-relaxed">
                Generate court-ready documentation with complete metadata extraction, timestamp verification, and professional PDF reports that establish photo authenticity.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-5xl mb-5 block">🔐</span>
              <h3 className="text-2xl font-semibold mb-4">Privacy-Respecting</h3>
              <p className="text-gray-400 leading-relaxed">
                Your photos never leave your device. All processing happens in your browser, with privacy-friendly analytics and direct sponsorships only.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-5xl mb-5 block">⚡</span>
              <h3 className="text-2xl font-semibold mb-4">Instant Results</h3>
              <p className="text-gray-400 leading-relaxed">
                No waiting, no uploads, no accounts required for basic use. Drag, drop, and get comprehensive metadata analysis in seconds—from anywhere, on any device.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-t border-gray-700">
          <h2 className="text-4xl font-bold text-center mb-16">What Makes Us Different</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            <div className="p-5">
              <span className="text-5xl font-bold text-blue-500 block mb-2">0</span>
              <span className="text-gray-400 text-lg font-medium">Photos Uploaded to Servers</span>
            </div>
            <div className="p-5">
              <span className="text-5xl font-bold text-blue-500 block mb-2">100%</span>
              <span className="text-gray-400 text-lg font-medium">Browser-Based Processing</span>
            </div>
            <div className="p-5">
              <span className="text-5xl font-bold text-blue-500 block mb-2">50+</span>
              <span className="text-gray-400 text-lg font-medium">Metadata Fields Extracted</span>
            </div>
            <div className="p-5">
              <span className="text-5xl font-bold text-blue-500 block mb-2">∞</span>
              <span className="text-gray-400 text-lg font-medium">Device Compatibility</span>
            </div>
          </div>
        </section>

        {/* Content Sponsorship */}
        <div className="py-8">
          <Sponsorship placement="content" className="max-w-2xl mx-auto" />
        </div>

        {/* The ProofPix Difference Section */}
        <section className="py-16 border-t border-gray-700">
          <h2 className="text-4xl font-bold text-center mb-5">The ProofPix Difference</h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            While other tools require expensive software or risky cloud uploads, ProofPix delivers professional-grade photo verification that respects your privacy and works everywhere.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-5xl mb-5 block">📱</span>
              <h3 className="text-2xl font-semibold mb-4">Works Everywhere</h3>
              <p className="text-gray-400 leading-relaxed">
                No app downloads, no software installation. Works on phones, tablets, laptops—anywhere you have a browser. Perfect for field work and on-the-go documentation.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-5xl mb-5 block">📊</span>
              <h3 className="text-2xl font-semibold mb-4">Professional Reports</h3>
              <p className="text-gray-400 leading-relaxed">
                Generate PDF reports with complete metadata breakdown, GPS location maps, camera settings, and timestamp verification—ready for clients, insurance, or legal use.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-5xl mb-5 block">💼</span>
              <h3 className="text-2xl font-semibold mb-4">Built for Professionals</h3>
              <p className="text-gray-400 leading-relaxed">
                Bulk processing, custom templates, metadata comparison, and export options designed for users who need reliable, verifiable photo documentation every day.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center bg-gradient-to-r from-blue-500/10 via-blue-600/5 to-blue-500/10 rounded-3xl my-16">
          <h2 className="text-4xl font-bold mb-5">Ready to Prove Your Photos?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who trust ProofPix for verifiable photo documentation. Start with our free tier—no signup required.
          </p>
          <button
            onClick={handleTryNowClick}
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/25 hover:from-blue-500 hover:to-blue-400"
          >
            Try ProofPix Now - It's Free
          </button>
        </section>

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
              <p>Privacy-respecting EXIF metadata tool - v1.7.0</p>
            </div>
            <nav className="flex space-x-6 text-sm">
              <button onClick={handleBackHome} className="text-gray-400 hover:text-white">Home</button>
              <button onClick={handleFAQClick} className="text-gray-400 hover:text-white">F.A.Q.</button>
              <span className="text-blue-400 font-medium">About</span>
              <button onClick={handlePrivacyClick} className="text-gray-400 hover:text-white">Privacy</button>
              <button onClick={handleContactClick} className="text-gray-400 hover:text-white">Contact</button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}; 