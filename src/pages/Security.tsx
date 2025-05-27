import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, CheckCircle, ArrowLeft } from 'lucide-react';

const Security: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleContactSales = () => {
    window.location.href = 'mailto:enterprise@proofpixapp.com';
  };

  const handleRequestSecurityPackage = () => {
    window.location.href = 'mailto:security@proofpixapp.com?subject=Security Package Request';
  };

  const handleScheduleSecurityReview = () => {
    window.location.href = 'mailto:security@proofpixapp.com?subject=Security Review Request';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackHome}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300">
                Security Leader
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
                Zero Risk Architecture
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6">
            Security-First<br/>
            <span className="text-yellow-300">by Design</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-8">
            ProofPix redefines SaaS security through revolutionary client-side processing. 
            Your images never leave your device - eliminating 90% of traditional security risks.
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300">0</div>
              <div className="text-sm text-blue-200">Data Breaches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300">95%</div>
              <div className="text-sm text-blue-200">Risk Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300">100%</div>
              <div className="text-sm text-blue-200">Client-Side Processing</div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/docs/security-architecture')}
            className="bg-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-400 transition-colors"
          >
            View Security Architecture
          </button>
        </div>
      </section>

      {/* Security Principles */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Core Security Principles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Zero Knowledge</h3>
            <p className="text-gray-400">We never see your images or metadata - processing happens entirely in your browser.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Open Source</h3>
            <p className="text-gray-400">Complete code transparency enables independent security verification and audit.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Compliance Ready</h3>
            <p className="text-gray-400">SOC 2, GDPR, HIPAA compliance built into architecture, not retrofitted.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Transparent Tech</h3>
            <p className="text-gray-400">Client-side JavaScript processing is visible, auditable, and verifiable.</p>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Enterprise Security Features</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Built for Enterprise Requirements</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span><strong className="text-white">Single Sign-On (SSO)</strong> - SAML 2.0 and OAuth integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span><strong className="text-white">Multi-Factor Authentication</strong> - Hardware keys and authenticator apps</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span><strong className="text-white">Audit Trails</strong> - Comprehensive logging and monitoring</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span><strong className="text-white">Role-Based Access</strong> - Granular permissions and controls</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span><strong className="text-white">99.9% Uptime SLA</strong> - Enterprise-grade availability guarantee</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg">
              <h4 className="text-xl font-bold mb-4 text-white">Enterprise Security Package</h4>
              <ul className="space-y-2 text-sm mb-6 text-gray-300">
                <li>✓ SOC 2 Type II Certification</li>
                <li>✓ HIPAA Business Associate Agreement</li>
                <li>✓ Dedicated Security Manager</li>
                <li>✓ Priority Incident Response</li>
                <li>✓ Custom Security Reviews</li>
                <li>✓ Compliance Documentation</li>
              </ul>
              <button
                onClick={handleContactSales}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-100 text-gray-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Security Certifications & Compliance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">SOC</span>
              </div>
              <h3 className="font-bold mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-gray-600 mb-3">In Progress</p>
              <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded text-xs">
                Certification: Q2 2025
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-sm font-bold text-green-600">GDPR</span>
              </div>
              <h3 className="font-bold mb-2">GDPR Compliant</h3>
              <p className="text-sm text-gray-600 mb-3">Architecture Native</p>
              <div className="bg-green-50 text-green-800 px-3 py-1 rounded text-xs">
                ✓ Certified Compliant
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-sm font-bold text-purple-600">HIPAA</span>
              </div>
              <h3 className="font-bold mb-2">HIPAA Ready</h3>
              <p className="text-sm text-gray-600 mb-3">BAA Available</p>
              <div className="bg-purple-50 text-purple-800 px-3 py-1 rounded text-xs">
                90% Implementation
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-sm font-bold text-yellow-600">ISO</span>
              </div>
              <h3 className="font-bold mb-2">ISO 27001</h3>
              <p className="text-sm text-gray-600 mb-3">Planning Phase</p>
              <div className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded text-xs">
                Target: Q4 2025
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Security Documentation Available</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">For Enterprise Customers:</h4>
                <ul className="text-left space-y-1 text-sm">
                  <li>• Complete Security Architecture Document</li>
                  <li>• SOC 2 Readiness Assessment</li>
                  <li>• Compliance Certification Roadmap</li>
                  <li>• Privacy Impact Assessments</li>
                  <li>• Vendor Security Questionnaire Responses</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">For Technical Teams:</h4>
                <ul className="text-left space-y-1 text-sm">
                  <li>• Open Source Code Repository</li>
                  <li>• Security Control Implementation</li>
                  <li>• Penetration Testing Reports</li>
                  <li>• Vulnerability Assessment Results</li>
                  <li>• Incident Response Procedures</li>
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <button 
                onClick={handleRequestSecurityPackage}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mr-4 hover:bg-blue-700 transition-colors"
              >
                Request Security Package
              </button>
              <button 
                onClick={handleScheduleSecurityReview}
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Schedule Security Review
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Security Leadership?</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Join enterprise customers who've chosen ProofPix for unmatched security and privacy protection.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/enterprise')}
              className="bg-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-400 transition-colors"
            >
              Start Enterprise Trial
            </button>
            <button 
              onClick={handleContactSales}
              className="border border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Contact Security Team
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2025 ProofPix. Built with security-first architecture.</p>
          <div className="mt-4 space-x-4">
            <button onClick={() => navigate('/security')} className="text-blue-400 hover:text-blue-300">Security</button>
            <button onClick={() => navigate('/privacy')} className="text-blue-400 hover:text-blue-300">Privacy Policy</button>
            <button onClick={() => navigate('/docs/compliance-checklist')} className="text-blue-400 hover:text-blue-300">Compliance</button>
            <button onClick={() => navigate('/docs')} className="text-blue-400 hover:text-blue-300">Documentation</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Security; 