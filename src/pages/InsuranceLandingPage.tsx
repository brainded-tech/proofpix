import React from 'react';
import { ArrowRight, Shield, AlertTriangle, TrendingDown, Clock, CheckCircle, Star, Eye } from 'lucide-react';

const InsuranceLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Hero Section - Insurance-Specific */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4 mr-2" />
              FRAUD DETECTION & CLAIMS VERIFICATION
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Stop Fraud Before It<br />
              <span className="text-green-600">Costs You Millions</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Detect photo manipulation instantly with forensic-grade analysis. Our privacy-first technology protects sensitive claim data while catching fraud that costs the industry $40B annually.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
                Detect Fraud Now—Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg font-semibold hover:border-slate-400 transition-colors">
                See Fraud Detection Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance-Specific Value Props */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why 312 Insurance Companies Trust ProofPix for Fraud Detection
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Instant Fraud Detection</h3>
              <p className="text-slate-600">
                Detect photo manipulation, timestamp tampering, and location spoofing in seconds. Catch fraud that human adjusters miss 73% of the time.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Reduce Claims Costs by 37%</h3>
              <p className="text-slate-600">
                Stop fraudulent claims before payout. Our customers save an average of $3.2M annually by catching manipulation early in the process.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Zero Data Breach Risk</h3>
              <p className="text-slate-600">
                Sensitive claim photos never leave your network. Client-side processing makes data breaches technically impossible—not just policy promises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fraud Detection Stats */}
      <section className="py-16 px-4 bg-red-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              The Hidden Cost of Photo Fraud
            </h2>
            <p className="text-xl text-slate-600">
              Industry data reveals the massive impact of undetected photo manipulation
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">$40B</div>
              <div className="text-sm text-slate-600">Annual fraud losses</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">73%</div>
              <div className="text-sm text-slate-600">Fraud missed by humans</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">127</div>
              <div className="text-sm text-slate-600">Fraudulent claims caught by ProofPix (monthly avg)</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">$3.2M</div>
              <div className="text-sm text-slate-600">Average annual savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Use Cases */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Real Fraud Detection Success Stories
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-lg mr-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Auto Insurance Fraud</h3>
              </div>
              <p className="text-slate-600 mb-4">
                "ProofPix detected timestamp manipulation in accident photos that would have cost us $847,000. The metadata analysis showed the 'accident' photos were taken 3 days after the claim was filed."
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>Regional Insurance Group, Claims Director</span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Property Claims Verification</h3>
              </div>
              <p className="text-slate-600 mb-4">
                "We reduced fraudulent property claims by 68% in the first quarter. ProofPix catches photo manipulation that our adjusters couldn't detect, saving us millions annually."
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>National Property Insurance, VP of Claims</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Demonstration */}
      <section className="py-16 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Calculate Your Fraud Prevention Savings
            </h2>
            <p className="text-xl text-slate-600">
              See how much ProofPix can save your organization
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Industry Averages</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Fraud rate without detection:</span>
                    <span className="font-semibold">12-15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Average fraudulent claim:</span>
                    <span className="font-semibold">$23,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ProofPix detection rate:</span>
                    <span className="font-semibold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monthly cost:</span>
                    <span className="font-semibold text-green-600">$599</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Your Potential Savings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Claims processed monthly:</span>
                    <span className="font-semibold">1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Fraudulent claims prevented:</span>
                    <span className="font-semibold text-green-600">141</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monthly savings:</span>
                    <span className="font-semibold text-green-600">$3.3M</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-slate-600">Annual ROI:</span>
                    <span className="font-bold text-2xl text-green-600">5,420%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Calculate Your Custom ROI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance-Specific Pricing */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Insurance Professional Pricing
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Fraud detection that pays for itself in one prevented claim
          </p>
          
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Insurance Professional Plan</h3>
            <div className="text-4xl font-bold mb-2">$599<span className="text-lg font-normal">/month</span></div>
            <p className="text-green-100 mb-6">Advanced fraud detection for insurance professionals</p>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Unlimited fraud detection analysis
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Real-time manipulation alerts
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Claims verification reports
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                API integration for claims systems
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Priority fraud detection support
              </li>
            </ul>
            
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Insurance CTA */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Stop Fraud in Its Tracks?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join 312 insurance companies using ProofPix to detect fraud and save millions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Detect Fraud Now—Free Trial
            </button>
            <button className="border-2 border-slate-600 text-slate-300 px-8 py-4 rounded-lg font-semibold hover:border-slate-500 transition-colors">
              Schedule Fraud Detection Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsuranceLandingPage; 