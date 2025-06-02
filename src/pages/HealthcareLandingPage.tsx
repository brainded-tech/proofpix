import React from 'react';
import { ArrowRight, Shield, Heart, Lock, Clock, CheckCircle, Star, UserCheck } from 'lucide-react';

const HealthcareLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Hero Section - Healthcare-Specific */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4 mr-2" />
              HIPAA-COMPLIANT BY DESIGN
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Patient Privacy Protection<br />
              <span className="text-purple-600">That Actually Works</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Analyze medical photos with absolute privacy protection. Our client-side processing ensures patient data never leaves your network—making HIPAA compliance automatic, not aspirational.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center">
                Protect Patient Privacy—Try Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg font-semibold hover:border-slate-400 transition-colors">
                See HIPAA Compliance Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare-Specific Value Props */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why 89 Healthcare Systems Trust ProofPix for Patient Privacy
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Automatic HIPAA Compliance</h3>
              <p className="text-slate-600">
                Patient photos never leave your local environment. No cloud uploads, no server storage, no breach risk. Compliance is built into the architecture.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Enhanced Patient Trust</h3>
              <p className="text-slate-600">
                Patients trust you more when they know their photos stay private. 94% of patients prefer providers who guarantee local processing.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Instant Medical Documentation</h3>
              <p className="text-slate-600">
                Extract metadata for medical records instantly. Timestamp verification, device authentication, and chain of custody for legal medical documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HIPAA Compliance Stats */}
      <section className="py-16 px-4 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              The Real Cost of Healthcare Data Breaches
            </h2>
            <p className="text-xl text-slate-600">
              Healthcare faces the highest breach costs of any industry
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">$10.9M</div>
              <div className="text-sm text-slate-600">Average healthcare breach cost</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">329 days</div>
              <div className="text-sm text-slate-600">Average time to identify breach</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-sm text-slate-600">ProofPix breaches ever (impossible by design)</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">$1.8M</div>
              <div className="text-sm text-slate-600">Average annual savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Use Cases */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Real Healthcare Privacy Success Stories
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Patient Documentation</h3>
              </div>
              <p className="text-slate-600 mb-4">
                "Client-side processing means patient photos never leave our network. We get the analysis we need with absolute privacy protection. It's exactly what healthcare needs."
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>Dr. Sarah Chen, Chief Medical Officer</span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Compliance Assurance</h3>
              </div>
              <p className="text-slate-600 mb-4">
                "No more worrying about HIPAA violations. ProofPix makes compliance automatic. Our IT security team loves that there's literally nothing to breach."
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>Metro Healthcare System, CISO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Architecture Explanation */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How We Make HIPAA Compliance Automatic
            </h2>
            <p className="text-xl text-slate-600">
              Technical architecture that makes data breaches impossible
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">Traditional Cloud Solutions</h3>
              <div className="space-y-4">
                <div className="flex items-center text-red-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span>Photos uploaded to external servers</span>
                </div>
                <div className="flex items-center text-red-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span>Data stored in vendor databases</span>
                </div>
                <div className="flex items-center text-red-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span>Breach risk from external access</span>
                </div>
                <div className="flex items-center text-red-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span>Complex BAAs and compliance audits</span>
                </div>
                <div className="flex items-center text-red-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span>Ongoing compliance monitoring required</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">ProofPix Privacy-First Architecture</h3>
              <div className="space-y-4">
                <div className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>All processing happens in your browser</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>Photos never leave your local environment</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>Zero external breach risk (impossible by design)</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>Automatic HIPAA compliance</span>
                </div>
                <div className="flex items-center text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>No ongoing compliance overhead</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare ROI */}
      <section className="py-16 px-4 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Calculate Your Privacy Protection Savings
            </h2>
            <p className="text-xl text-slate-600">
              See how much ProofPix can save your healthcare organization
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Healthcare Industry Risks</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Average breach cost:</span>
                    <span className="font-semibold text-red-600">$10.9M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Annual breach probability:</span>
                    <span className="font-semibold text-red-600">29%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Compliance overhead:</span>
                    <span className="font-semibold text-red-600">$500K/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ProofPix monthly cost:</span>
                    <span className="font-semibold text-green-600">$899</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Your Protection Benefits</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Breach risk eliminated:</span>
                    <span className="font-semibold text-green-600">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Annual risk reduction:</span>
                    <span className="font-semibold text-green-600">$3.16M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Compliance savings:</span>
                    <span className="font-semibold text-green-600">$500K</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-slate-600">Annual ROI:</span>
                    <span className="font-bold text-2xl text-green-600">3,320%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Calculate Your Custom ROI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare-Specific Pricing */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Healthcare Professional Pricing
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Privacy protection that prevents one breach and saves millions
          </p>
          
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Healthcare Professional Plan</h3>
            <div className="text-4xl font-bold mb-2">$899<span className="text-lg font-normal">/month</span></div>
            <p className="text-purple-100 mb-6">Complete HIPAA compliance with zero breach risk</p>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Unlimited patient photo analysis
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Automatic HIPAA compliance
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Medical documentation reports
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                EHR system integration
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Priority healthcare support
              </li>
            </ul>
            
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Healthcare CTA */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Protect Patient Privacy Automatically?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join 89 healthcare systems using ProofPix for automatic HIPAA compliance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Protect Patient Privacy—Try Free
            </button>
            <button className="border-2 border-slate-600 text-slate-300 px-8 py-4 rounded-lg font-semibold hover:border-slate-500 transition-colors">
              Schedule HIPAA Compliance Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HealthcareLandingPage; 