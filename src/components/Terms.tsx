import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Shield, CreditCard, Users, FileText, Scale, Phone, AlertTriangle, Lock, Globe } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { Sponsorship } from './Sponsorships';

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
            Terms of Service
          </h1>
          <p className="text-gray-400 text-lg mb-5">Last Updated: January 2025</p>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            These terms govern your use of ProofPix and our photo metadata extraction services.
          </p>
        </section>

        {/* Legal Notice */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-8 mb-16">
          <h2 className="text-blue-400 text-2xl font-bold mb-4 flex items-center gap-3">
            <Scale className="h-6 w-6" />
            Legal Agreement
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            By accessing or using ProofPix, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service. These terms apply to all users of the service.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10 mb-16">
          {/* Section 1: Service Description */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <FileText className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Service Description</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">
                ProofPix is a privacy-focused photo metadata extraction and removal tool that operates entirely within your web browser. Our Service allows you to:
              </p>
              
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span>Extract and view hidden metadata (EXIF, IPTC, XMP) from digital photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span>Remove sensitive location and device information from images</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span>Process photos locally without uploading to our servers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span>Export cleaned images in various formats</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span>Generate PDF reports of metadata findings</span>
                </li>
              </ul>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mt-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">Premium Features Include:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Unlimited bulk processing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Advanced export options (multiple formats and sizes)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Batch PDF report generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Commercial use license</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Acceptable Use Policy */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Acceptable Use Policy</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">By using ProofPix, you agree that you will:</p>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <h4 className="text-green-400 text-lg font-semibold mb-3">✅ Permitted Uses</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>Only process images you own or have explicit permission to modify</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>Use the Service for lawful purposes only</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>Respect intellectual property rights of others</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>Use for personal and professional legitimate purposes</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <h4 className="text-red-400 text-lg font-semibold mb-3">❌ Prohibited Activities</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-sm">•</span>
                    <span>Processing illegal, harmful, or offensive content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-sm">•</span>
                    <span>Attempting to reverse engineer, decompile, or hack the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-sm">•</span>
                    <span>Using automated systems or scripts to access the Service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-sm">•</span>
                    <span>Copyright infringement or malicious use</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-300">
                <strong>Age Requirement:</strong> You must be at least 18 years old or have parental consent to use this Service. By using ProofPix, you represent and warrant that you meet these requirements.
              </p>
            </div>
          </section>

          {/* Section 3: Payment Terms */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <CreditCard className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Payment Terms</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">💳 Subscription Billing</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Premium subscriptions are billed monthly or annually in advance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>All prices are listed in US Dollars (USD)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Payments are processed securely through Stripe</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>We do not store your credit card information</span>
                  </li>
                </ul>
              </div>

              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Price Changes:</strong> We reserve the right to modify pricing with 30 days advance notice. Price changes will not affect active subscription periods.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Automatic Renewal:</strong> Subscriptions automatically renew unless cancelled. Renewal charges occur at the start of each billing period.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Subscription Management:</strong> You can manage subscriptions through your account settings at any time.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Refund Policy */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">💰</span>
              <h2 className="text-2xl font-bold">Refund Policy</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">We want you to be completely satisfied with ProofPix. Here's our refund policy:</p>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <h4 className="text-green-400 text-lg font-semibold mb-3">🎯 30-Day Money-Back Guarantee</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>First-time premium subscribers can request a full refund within 30 days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>Refunds are processed to the original payment method</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>Processing time: 5-7 business days</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">📧 How to Request a Refund</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Email: support@proofpixapp.com</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Include your account email and reason for refund</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>We'll process your request within 48 hours</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h4 className="text-yellow-400 text-lg font-semibold mb-3">⚠️ Refund Limitations</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 text-sm">•</span>
                    <span>Only one refund per customer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 text-sm">•</span>
                    <span>No partial refunds for cancelled subscriptions after 30 days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 text-sm">•</span>
                    <span>Refunds void your access to premium features immediately</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Cancellation Policy */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">🚪</span>
              <h2 className="text-2xl font-bold">Cancellation Policy</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">You may cancel your premium subscription at any time:</p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">📋 How to Cancel</h4>
                <ol className="space-y-2 text-gray-300 list-decimal list-inside">
                  <li>Log into your account settings</li>
                  <li>Click "Manage Subscription"</li>
                  <li>Select "Cancel Subscription"</li>
                  <li>Confirm cancellation</li>
                </ol>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <h4 className="text-green-400 text-lg font-semibold mb-3">✅ What Happens After Cancellation</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>Access to premium features continues until the end of your billing period</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>No further charges will occur</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>You can resubscribe at any time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-sm">•</span>
                    <span>Your settings and preferences are saved for 90 days</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6: Dispute Resolution */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Dispute Resolution</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">We aim to resolve all customer concerns quickly and fairly:</p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">🤝 Initial Resolution</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Contact us first at support@proofpixapp.com</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>We'll respond within 48 business hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Most issues are resolved within 3-5 business days</span>
                  </li>
                </ul>
              </div>

              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Formal Disputes:</strong> If initial resolution fails, submit a formal dispute in writing with all relevant documentation. We'll investigate and respond within 10 business days.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Arbitration:</strong> Unresolved disputes will be settled through binding arbitration. Each party bears their own costs.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7: Service Limitations & Disclaimer */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <AlertTriangle className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Service Limitations & Disclaimer</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h4 className="text-yellow-400 text-lg font-semibold mb-3">⚠️ No Warranty</h4>
                <p className="text-gray-300 mb-3">ProofPix is provided "as is" without warranty of any kind, express or implied, including but not limited to:</p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 text-sm">•</span>
                    <span>Accuracy of metadata detection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 text-sm">•</span>
                    <span>Completeness of metadata removal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 text-sm">•</span>
                    <span>Uninterrupted service availability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 text-sm">•</span>
                    <span>Error-free operation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <h4 className="text-red-400 text-lg font-semibold mb-3">🚫 Limitation of Liability</h4>
                <p className="text-gray-300 mb-3">In no event shall ProofPix be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-sm">•</span>
                    <span>Loss of profits or revenue</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-sm">•</span>
                    <span>Loss of data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-sm">•</span>
                    <span>Business interruption</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-sm">•</span>
                    <span>Personal injury</span>
                  </li>
                </ul>
                <p className="text-gray-300 mt-3">
                  <strong>Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Privacy & Data Protection */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <Lock className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Privacy & Data Protection</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">Your privacy is critically important to us:</p>
              
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Local Processing:</strong> We process all images locally in your browser</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>No Server Storage:</strong> We do not upload, store, or have access to your photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Data Protection:</strong> Account information is protected with industry-standard encryption</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Compliance:</strong> We comply with GDPR, CCPA, and other privacy regulations</span>
                </li>
              </ul>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">🗑️ Data Deletion</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>You can request account deletion at any time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>All personal data is permanently removed within 30 days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 text-sm">•</span>
                    <span>Deletion requests: privacy@proofpixapp.com</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-300">
                Full details in our <button onClick={handlePrivacyClick} className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</button>
              </p>
            </div>
          </section>

          {/* Section 9: Contact Information */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <Phone className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Contact Information</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h4 className="text-blue-400 text-lg font-semibold mb-3">📧 Customer Support</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><strong>Email:</strong> support@proofpixapp.com</li>
                  <li><strong>Response Time:</strong> 24-48 hours</li>
                  <li><strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 5:00 PM EST</li>
                </ul>
              </div>

              <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-6">
                <h4 className="text-gray-300 text-lg font-semibold mb-3">🏢 Business Information</h4>
                <div className="text-gray-400 space-y-1">
                  <p><strong>ProofPix</strong></p>
                  <p>ProofPix</p>
                  <p>2501 Wharton St Unit S RLA 502</p>
                  <p>Philadelphia, PA 19146</p>
                  <p>United States</p>
                  <p className="text-xs text-gray-500 mt-2">Business registration pending</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h4 className="text-yellow-400 text-lg font-semibold mb-3">⚖️ Legal Inquiries</h4>
                <p className="text-gray-300">Email: legal@proofpixapp.com</p>
              </div>
            </div>
          </section>

          {/* Section 10: General Terms */}
          <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-4 mb-6">
              <Globe className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold">General Terms</h2>
            </div>
            <div className="space-y-4">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Governing Law:</strong> These Terms are governed by the laws of Pennsylvania, United States, without regard to its conflict of law provisions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Severability:</strong> If any provision of these Terms is deemed invalid or unenforceable, the remaining provisions continue in full force and effect.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and ProofPix regarding the Service and supersede all prior agreements.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Changes to Terms:</strong> We reserve the right to modify these Terms at any time. Changes are effective immediately upon posting. Material changes will be notified via email.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">•</span>
                  <span><strong>Account Termination:</strong> We may terminate or suspend your account immediately for breach of these Terms, fraudulent payment information, illegal activities, or abuse of the Service.</span>
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
          <h2 className="text-3xl font-bold mb-4">Questions About These Terms?</h2>
          <p className="text-xl text-gray-400 mb-8">
            If you have questions about these Terms of Service, we're here to help.
          </p>
          <button
            onClick={handleContactClick}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            Contact Support
          </button>
        </div>

        {/* Agreement Notice */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-8 mb-16">
          <p className="text-gray-300 text-center text-lg leading-relaxed">
            <strong>By using ProofPix, you agree to these Terms of Service and our Privacy Policy.</strong>
            <br /><br />
            We're committed to providing you with powerful photo verification tools while maintaining transparency and protecting your rights.
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
              <p>Privacy-respecting EXIF metadata tool - v1.8.0 • Open Source</p>
            </div>
            <nav className="flex space-x-6 text-sm">
              <button onClick={handleBackHome} className="text-gray-400 hover:text-white">Home</button>
              <button onClick={handleFAQClick} className="text-gray-400 hover:text-white">F.A.Q.</button>
              <button onClick={handleAboutClick} className="text-gray-400 hover:text-white">About</button>
              <button onClick={handlePrivacyClick} className="text-gray-400 hover:text-white">Privacy</button>
              <span className="text-blue-400 font-medium">Terms</span>
              <button onClick={handleSupportClick} className="text-gray-400 hover:text-white">Support</button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}; 