import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, Server, Database, FileText, Users, Globe, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { ConsistentLayout } from './ui/ConsistentLayout';
import { EnterpriseButton, EnterpriseCard, EnterpriseBadge, EnterpriseSection } from './ui/EnterpriseComponents';
import DocumentationFooter from './DocumentationFooter';

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

  const handleTermsClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Terms - Privacy Policy Footer');
    navigate('/terms');
  };

  const handleSupportClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Support - Privacy Policy Footer');
    navigate('/support');
  };

  return (
    <ConsistentLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            How we protect your data and respect your privacy with our client-side processing approach.
          </p>
        </div>

        {/* Back Button */}
        <EnterpriseSection>
          <EnterpriseButton
            variant="ghost"
            onClick={handleBackHome}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </EnterpriseButton>
        </EnterpriseSection>

        {/* Last Updated Badge */}
        <EnterpriseSection className="text-center">
          <EnterpriseBadge variant="neutral">Last Updated: May 2025</EnterpriseBadge>
        </EnterpriseSection>

        {/* Privacy Commitment */}
        <EnterpriseSection>
          <EnterpriseCard className="border-l-4 border-green-600 bg-green-50">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-slate-900">Our Privacy-Respecting Commitment</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              ProofPix was built with privacy as a core principle. We believe you shouldn't have to choose between powerful features and privacy. As an open source project, our privacy claims are fully auditable and transparent. Here's our comprehensive privacy policy explaining exactly how we protect your data and respect your privacy.
            </p>
          </EnterpriseCard>
        </EnterpriseSection>

        {/* Policy Sections */}
        <EnterpriseSection>
          <div className="space-y-8">
            {/* Section 1: Image Processing & Storage */}
            <EnterpriseCard>
              <div className="flex items-center gap-4 mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Image Processing & Storage</h2>
              </div>
              <div className="space-y-4">
                <EnterpriseCard className="bg-blue-50 border border-blue-200">
                  <h4 className="text-blue-700 text-lg font-semibold mb-2">🛡️ Zero Server Storage Guarantee</h4>
                  <p className="text-slate-700">We never upload or store your photos on any servers. Your images stay on your device, always.</p>
                </EnterpriseCard>
                
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span><strong>Local Processing:</strong> All image processing happens directly in your browser using advanced client-side technology.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span><strong>Zero Server Storage:</strong> We never upload or store your photos on any servers, anywhere.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span><strong>Client-Side Operations:</strong> EXIF data extraction, timestamp overlays, and all image operations are performed locally on your device.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span><strong>Offline Capability:</strong> Once loaded, the app can function without an internet connection for complete privacy.</span>
                  </li>
                </ul>
              </div>
            </EnterpriseCard>

            {/* Section 2: Data Generation & Control */}
            <EnterpriseCard>
              <div className="flex items-center gap-4 mb-6">
                <Database className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Data Generation & Control</h2>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">•</span>
                  <span><strong>Your Data Stays Yours:</strong> All generated content (edited images, PDFs, metadata reports) remains under your complete control.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">•</span>
                  <span><strong>No Account Required:</strong> We don't require user accounts or logins for basic functionality.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">•</span>
                  <span><strong>Local Storage Only:</strong> Any temporary data is stored locally in your browser and can be cleared at any time.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">•</span>
                  <span><strong>Full Control:</strong> You decide what to download, save, or delete - we never make that choice for you.</span>
                </li>
              </ul>
            </EnterpriseCard>

            {/* Section 3: Privacy-Respecting Analytics */}
            <EnterpriseCard>
              <div className="flex items-center gap-4 mb-6">
                <Eye className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Privacy-Respecting Analytics</h2>
              </div>
              <div className="space-y-4">
                <p className="text-slate-700">To improve our service and understand how ProofPix is used, we employ Plausible Analytics with the following privacy safeguards:</p>
                
                <EnterpriseCard className="bg-slate-50 border border-slate-200">
                  <h4 className="text-blue-600 text-lg font-semibold mb-3">🔍 What We Track (Anonymously)</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-sm">•</span>
                      <span>Page views and navigation patterns</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-sm">•</span>
                      <span>Feature usage statistics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-sm">•</span>
                      <span>Error reports for debugging</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-sm">•</span>
                      <span>Performance metrics</span>
                    </li>
                  </ul>
                </EnterpriseCard>

                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span><strong>Plausible Analytics:</strong> We use privacy-friendly Plausible Analytics instead of Google Analytics - no cookies, no personal data collection.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span><strong>GDPR Compliant:</strong> Our analytics are GDPR compliant by design and don't require cookie consent banners.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span><strong>No Personal Information:</strong> We don't track or store any personally identifiable information.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">•</span>
                    <span><strong>Anonymous Usage Data:</strong> We track basic metrics like features used and navigation patterns, all completely anonymously.</span>
                  </li>
                </ul>
              </div>
            </EnterpriseCard>
          </div>
        </EnterpriseSection>

        <DocumentationFooter />
      </div>
    </ConsistentLayout>
  );
}; 