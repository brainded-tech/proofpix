import React from 'react';
import { ArrowRight, Home, Clock, CheckCircle, Star, TrendingUp, DollarSign, Camera } from 'lucide-react';

const RealEstateLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Hero Section - Real Estate-Specific */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Home className="w-4 h-4 mr-2" />
              PROPERTY VERIFICATION & LISTING AUTHENTICATION
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Close Deals Faster with<br />
              <span className="text-orange-600">Verified Property Photos</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Authenticate property photos instantly and build buyer confidence. Our privacy-first technology verifies timestamps, locations, and authenticity—helping you close deals 40% faster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center">
                Verify Properties Now—Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg font-semibold hover:border-slate-400 transition-colors">
                See Property Verification Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate-Specific Value Props */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why 1,247 Real Estate Professionals Trust ProofPix for Property Verification
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Close Deals 40% Faster</h3>
              <p className="text-slate-600">
                Verified property photos build instant buyer confidence. No more delays from photo authenticity questions or listing disputes.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Authentic Listing Verification</h3>
              <p className="text-slate-600">
                Prove photos are recent and unedited. Timestamp verification and metadata analysis ensure listing accuracy and legal compliance.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Increase Commission by 23%</h3>
              <p className="text-slate-600">
                Faster closings mean more deals per month. Verified listings attract serious buyers and reduce time on market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Market Stats */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              The Hidden Cost of Photo Disputes in Real Estate
            </h2>
            <p className="text-xl text-slate-600">
              Property photo issues cause significant delays and lost commissions
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">18 days</div>
              <div className="text-sm text-slate-600">Average delay from photo disputes</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">34%</div>
              <div className="text-sm text-slate-600">Buyers who question photo authenticity</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">$8,400</div>
              <div className="text-sm text-slate-600">Average commission lost per delayed deal</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">40%</div>
              <div className="text-sm text-slate-600">Faster closings with ProofPix</div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Use Cases */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Real Success Stories from Top Agents
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-2 rounded-lg mr-4">
                  <Home className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Luxury Property Sales</h3>
              </div>
              <p className="text-slate-600 mb-4">
                "ProofPix helped me close a $2.8M luxury home 3 weeks early. The verified photos gave buyers complete confidence, and we avoided the usual back-and-forth about listing accuracy."
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>Sarah Martinez, Luxury Real Estate Specialist</span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Commercial Real Estate</h3>
              </div>
              <p className="text-slate-600 mb-4">
                "For commercial properties, photo authenticity is crucial. ProofPix's verification reports give investors the confidence they need to move quickly on deals."
              </p>
              <div className="flex items-center text-sm text-slate-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>Michael Chen, Commercial Real Estate Broker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Verification Process */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How Property Verification Works
            </h2>
            <p className="text-xl text-slate-600">
              Simple 3-step process to verify any property photo
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Upload Property Photos</h3>
              <p className="text-slate-600">
                Drag and drop your property photos into ProofPix. All processing happens locally in your browser—photos never leave your device.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Instant Verification Analysis</h3>
              <p className="text-slate-600">
                Our AI analyzes timestamps, GPS coordinates, device information, and editing history in seconds. Get comprehensive verification reports instantly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Share Verified Listings</h3>
              <p className="text-slate-600">
                Include verification badges and reports with your listings. Build buyer confidence and close deals faster with authenticated property photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate ROI Calculator */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Calculate Your Commission Increase
            </h2>
            <p className="text-xl text-slate-600">
              See how much more you can earn with faster closings
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Current Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Average deals per month:</span>
                    <span className="font-semibold">3.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Average commission per deal:</span>
                    <span className="font-semibold">$12,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Days on market (average):</span>
                    <span className="font-semibold">45 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ProofPix monthly cost:</span>
                    <span className="font-semibold text-orange-600">$199</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">With ProofPix Verification</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Deals per month (40% faster):</span>
                    <span className="font-semibold text-green-600">4.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Additional monthly commission:</span>
                    <span className="font-semibold text-green-600">$16,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Days on market (reduced):</span>
                    <span className="font-semibold text-green-600">27 days</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-slate-600">Annual ROI:</span>
                    <span className="font-bold text-2xl text-green-600">8,070%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                Calculate Your Custom ROI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate-Specific Pricing */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Real Estate Professional Pricing
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Property verification that pays for itself in one faster closing
          </p>
          
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Real Estate Professional Plan</h3>
            <div className="text-4xl font-bold mb-2">$199<span className="text-lg font-normal">/month</span></div>
            <p className="text-orange-100 mb-6">Complete property verification for real estate professionals</p>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Unlimited property photo verification
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Listing authenticity reports
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Verification badges for listings
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                MLS integration support
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                Priority real estate support
              </li>
            </ul>
            
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Real Estate CTA */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Close Deals Faster?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join 1,247 real estate professionals using ProofPix to verify properties and increase commissions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Verify Properties Now—Free Trial
            </button>
            <button className="border-2 border-slate-600 text-slate-300 px-8 py-4 rounded-lg font-semibold hover:border-slate-500 transition-colors">
              Schedule Property Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RealEstateLandingPage; 