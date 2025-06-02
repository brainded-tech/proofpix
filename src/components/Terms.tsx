import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Shield, CreditCard, Users, FileText, Scale, Phone, AlertTriangle, Lock, Globe, ArrowLeft } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { ConsistentLayout } from './ui/ConsistentLayout';
import { EnterpriseButton, EnterpriseCard, EnterpriseBadge, EnterpriseSection } from './ui/EnterpriseComponents';
import DocumentationFooter from './DocumentationFooter';

export const Terms: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    analytics.trackFeatureUsage('Navigation', 'Home - Terms of Service');
    navigate('/');
  };

  const handleAboutClick = () => {
    analytics.trackFeatureUsage('Navigation', 'About Us - Terms of Service');
    navigate('/about');
  };

  const handlePrivacyClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Privacy Policy - Terms of Service');
    navigate('/privacy');
  };

  const handleFAQClick = () => {
    analytics.trackFeatureUsage('Navigation', 'FAQ - Terms of Service');
    navigate('/faq');
  };

  const handleSupportClick = () => {
    analytics.trackFeatureUsage('Navigation', 'Support - Terms of Service');
    navigate('/support');
  };

  const handleContactClick = () => {
    analytics.trackFeatureUsage('CTA Click', 'Contact Us - Terms of Service');
    window.location.href = 'mailto:support@proofpixapp.com';
  };

  return (
    <ConsistentLayout
      showHero
      title="Terms of Service"
      description="These terms govern your use of ProofPix and our photo metadata extraction services."
      maxWidth="6xl"
    >
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
        <EnterpriseBadge variant="neutral">Last Updated: January 2025</EnterpriseBadge>
      </EnterpriseSection>

      {/* Legal Notice */}
      <EnterpriseSection>
        <EnterpriseCard className="border-l-4 border-blue-600 bg-blue-50">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Legal Agreement</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            By accessing or using ProofPix, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service. These terms apply to all users of the service.
          </p>
        </EnterpriseCard>
      </EnterpriseSection>

        {/* Terms Sections */}
      <EnterpriseSection>
        <div className="space-y-8">
          {/* Section 1: Service Description */}
          <EnterpriseCard>
            <div className="flex items-center gap-4 mb-6">
              <FileText className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Service Description</h2>
            </div>
            <div className="space-y-4">
              <p className="text-slate-700">
                ProofPix is a privacy-focused photo metadata extraction and removal tool that operates entirely within your web browser. Our Service allows you to:
              </p>
              
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">•</span>
                  <span>Extract and view hidden metadata (EXIF, IPTC, XMP) from digital photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">•</span>
                  <span>Remove sensitive location and device information from images</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">•</span>
                  <span>Process photos locally without uploading to our servers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">•</span>
                  <span>Export cleaned images in various formats</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">•</span>
                  <span>Generate PDF reports of metadata findings</span>
                </li>
              </ul>

              <EnterpriseCard className="bg-blue-50 border border-blue-200">
                <h4 className="text-blue-600 text-lg font-semibold mb-3">Premium Features Include:</h4>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-sm">•</span>
                    <span>Unlimited bulk processing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-sm">•</span>
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-sm">•</span>
                    <span>Advanced export options (multiple formats and sizes)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-sm">•</span>
                    <span>Batch PDF report generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 text-sm">•</span>
                    <span>Commercial use license</span>
                  </li>
                </ul>
              </EnterpriseCard>
            </div>
          </EnterpriseCard>

          {/* Section 2: Acceptable Use Policy */}
          <EnterpriseCard>
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Acceptable Use Policy</h2>
            </div>
            <div className="space-y-4">
              <p className="text-slate-700">By using ProofPix, you agree that you will:</p>
              
              <EnterpriseCard className="bg-green-50 border border-green-200">
                <h4 className="text-green-700 text-lg font-semibold mb-3">✅ Permitted Uses</h4>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-sm">•</span>
                    <span>Only process images you own or have explicit permission to modify</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-sm">•</span>
                    <span>Use the Service for lawful purposes only</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-sm">•</span>
                    <span>Respect intellectual property rights of others</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 text-sm">•</span>
                    <span>Use for personal and professional legitimate purposes</span>
                  </li>
                </ul>
              </EnterpriseCard>

              <EnterpriseCard className="bg-red-50 border border-red-200">
                <h4 className="text-red-700 text-lg font-semibold mb-3">❌ Prohibited Activities</h4>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 text-sm">•</span>
                    <span>Processing illegal, harmful, or offensive content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 text-sm">•</span>
                    <span>Attempting to reverse engineer, decompile, or hack the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 text-sm">•</span>
                    <span>Using automated systems or scripts to access the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 text-sm">•</span>
                    <span>Copyright infringement or malicious use</span>
                  </li>
                </ul>
              </EnterpriseCard>
            </div>
          </EnterpriseCard>
        </div>
      </EnterpriseSection>

      <DocumentationFooter />
    </ConsistentLayout>
  );
}; 