import React from 'react';
import { ArrowRight, Shield, Scale, FileText, Clock, CheckCircle, Star } from 'lucide-react';

const LegalLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section - Legal-Specific */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Scale className="w-4 h-4 mr-2" />
              COURT-ADMISSIBLE EVIDENCE ANALYSIS
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Turn Every Photo Into<br />
              <span className="text-blue-600">Bulletproof Legal Evidence</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Extract forensic-grade metadata that stands up in court. Our privacy-first technology ensures evidence integrity while protecting client confidentiality—impossible to breach by design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                Analyze Evidence Now—Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg font-semibold hover:border-slate-400 transition-colors">
                See Court-Ready Reports
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Legal-Specific Value Props */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why 847 Law Firms Trust ProofPix for Evidence Analysis
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Court-Admissible Reports</h3>
              <p className="text-slate-600">
                Generate forensic-grade documentation that meets legal standards. Chain of custody preserved, metadata authenticated, ready for court presentation.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Client Privilege Protected</h3>
              <p className="text-slate-600">
                Everything processes locally in your browser. We can't see your evidence even if we wanted to—technical impossibility, not just policy.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">5-Minute Evidence Analysis</h3>
              <p className="text-slate-600">
                Extract location, timestamps, device info, and tampering evidence instantly. What used to take hours now takes minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Use Cases */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Proven Results in Real Legal Cases
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-2 rounded-lg mr-4">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Personal Injury Cases</h3>
              </div>
              <p className="text-slate-600 mb-4">
                "ProofPix helped us prove the exact time and location of accident photos, strengthening our client's case and securing a $2.3M settlement."
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>Martinez & Associates, Personal Injury Law</span>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-lg mr-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Criminal Defense</h3>
              </div>
              <p className="text-slate-600 mb-4">
                "The metadata analysis revealed photo manipulation in the prosecution's evidence. Case dismissed. ProofPix literally saved our client's freedom."
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>Thompson Defense Group, Criminal Law</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal-Specific Pricing */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Legal Professional Pricing
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Court-ready evidence analysis that pays for itself in one case
          </p>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Hybrid Access for Legal</h3>
            <div className="text-4xl font-bold mb-2">$299<span className="text-lg font-normal">/month</span></div>
            <p className="text-blue-100 mb-6">Privacy + Collaboration modes for complete legal workflow</p>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Real-time mode switching (Privacy ↔ Collaboration)
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Court-ready evidence reports with chain of custody
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Unlimited team members and case collaboration
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Advanced compliance dashboard for legal standards
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Custom security policies and audit trails
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Dedicated account manager and legal support
              </li>
            </ul>
            
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Legal CTA */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Strengthen Your Next Case?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join 847 law firms using ProofPix for court-admissible evidence analysis
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Analyze Evidence Now—Free
            </button>
            <button className="border-2 border-slate-600 text-slate-300 px-8 py-4 rounded-lg font-semibold hover:border-slate-500 transition-colors">
              Schedule Legal Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalLandingPage; 