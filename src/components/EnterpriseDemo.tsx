import React, { useState } from 'react';
import { PhotoToDocumentUpsell } from './PhotoToDocumentUpsell';
import { IndustrySelector } from './IndustrySelector';
import { CompetitorComparison } from './CompetitorComparison';
import EnterpriseContactForm from './EnterpriseContactForm';
import { ExitIntentPopup } from './ExitIntentPopup';

export const EnterpriseDemo: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [showExitPopup, setShowExitPopup] = useState(false);
  
  // For demo purposes - normally this would be triggered by exit intent
  const handleShowExitPopup = () => {
    setShowExitPopup(true);
  };
  
  const handleCloseExitPopup = () => {
    setShowExitPopup(false);
  };

  return (
    <div className="enterprise-demo">
      {/* Enterprise Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="bg-blue-700 text-blue-100 text-xs font-bold px-3 py-1 rounded-full">
                  ENTERPRISE SOLUTION
                </span>
                <h1 className="text-5xl font-extrabold mt-4 leading-tight">
                  Secure Image Metadata <br />
                  <span className="text-gradient">100% Client-Side Processing</span>
                </h1>
                <p className="text-xl mt-6 text-blue-100">
                  ProofPix Enterprise provides the most secure way to extract and
                  manage image metadata for legal, insurance, and healthcare organizations.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="btn btn-primary btn-lg">
                  Start Free Trial
                </button>
                <button className="btn btn-secondary btn-lg">
                  Schedule Demo
                </button>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex -space-x-2">
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://via.placeholder.com/40" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://via.placeholder.com/40" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://via.placeholder.com/40" alt="User" />
                </div>
                <div className="text-sm">
                  <span className="text-blue-200">Trusted by</span>
                  <span className="font-semibold"> 500+ </span>
                  <span className="text-blue-200">enterprise organizations</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500 rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500 rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
              
              <div className="relative bg-gradient-to-tr from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="px-6 pt-6">
                  <div className="flex items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="ml-4 flex-1 h-4 bg-gray-700 rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="aspect-w-4 aspect-h-3 bg-gray-800 rounded-lg overflow-hidden">
                    <img 
                      src="/images/dashboard-preview.jpg" 
                      alt="Enterprise Dashboard"
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/800x600/1e293b/64748b?text=Enterprise+Dashboard';
                      }}
                    />
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Processed</div>
                      <div className="text-2xl font-bold text-white">12.4K</div>
                      <div className="mt-2 w-full bg-gray-700 h-1 rounded-full">
                        <div className="bg-blue-500 h-1 rounded-full w-3/4"></div>
                      </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Security Score</div>
                      <div className="text-2xl font-bold text-white">97%</div>
                      <div className="mt-2 w-full bg-gray-700 h-1 rounded-full">
                        <div className="bg-green-500 h-1 rounded-full w-11/12"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Security Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Enterprise-Grade Security
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our client-side approach ensures your sensitive data never leaves your system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Zero Data Transmission</h3>
              <p className="text-gray-600">
                All image processing happens locally in your browser. Your files never leave your device,
                eliminating transmission risks entirely.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">HIPAA & GDPR Compliant</h3>
              <p className="text-gray-600">
                Our architecture simplifies compliance with major regulations because sensitive data
                stays within your control at all times.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tamper-Proof Audit Log</h3>
              <p className="text-gray-600">
                Every interaction with your metadata is cryptographically logged, creating a secure
                and court-admissible chain of custody.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Industry Selection */}
      <IndustrySelector 
        selectedIndustry={selectedIndustry}
        onSelectIndustry={setSelectedIndustry}
      />
      
      {/* Competitor Comparison */}
      <CompetitorComparison />
      
      {/* Document Intelligence Upsell */}
      <PhotoToDocumentUpsell
        onRequestDemo={() => console.log('Request demo clicked')}
        onLearnMore={() => console.log('Learn more clicked')}
      />
      
      {/* Testimonial Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Trusted by Industry Leaders</h2>
            <p className="mt-4 text-xl text-blue-200 max-w-3xl mx-auto">
              See what our enterprise customers say about ProofPix
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://via.placeholder.com/48"
                  alt="Testimonial"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium">Sarah Johnson</h4>
                  <p className="text-blue-300">CIO, Legal Partners LLP</p>
                </div>
              </div>
              <blockquote className="text-blue-100">
                "ProofPix's client-side processing has revolutionized how we handle sensitive
                legal evidence. The chain of custody tracking is invaluable for our case work."
              </blockquote>
            </div>
            
            <div className="bg-blue-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://via.placeholder.com/48"
                  alt="Testimonial"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium">Michael Chen</h4>
                  <p className="text-blue-300">Director of Claims, Assurance Co</p>
                </div>
              </div>
              <blockquote className="text-blue-100">
                "We've cut our claims processing time by 62% while improving our privacy compliance.
                The batch processing capability handles thousands of images effortlessly."
              </blockquote>
            </div>
            
            <div className="bg-blue-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://via.placeholder.com/48"
                  alt="Testimonial"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium">Dr. Lisa Patel</h4>
                  <p className="text-blue-300">CMIO, Northeast Medical</p>
                </div>
              </div>
              <blockquote className="text-blue-100">
                "As a healthcare provider, HIPAA compliance is non-negotiable. ProofPix's
                approach means PHI never leaves our system, simplifying our compliance efforts."
              </blockquote>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Get Started Today</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Contact our enterprise team to learn how ProofPix can help your organization
            </p>
          </div>
          
          <EnterpriseContactForm />
        </div>
      </section>
      
      {/* Exit Intent Popup Demo Button (for demonstration purposes) */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleShowExitPopup}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg"
        >
          Demo Exit Popup
        </button>
      </div>
      
      {/* Exit Intent Popup */}
      {showExitPopup && <ExitIntentPopup onClose={handleCloseExitPopup} />}
    </div>
  );
}; 