import React from 'react';
import { ConsistentLayout } from '../components/ui/ConsistentLayout';
import { Shield, Lock, Eye, Server, CheckCircle, AlertTriangle, Zap, Users, Globe } from 'lucide-react';

export const PrivacyMode: React.FC = () => {
  return (
    <ConsistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Architecturally Impossible to Breach
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Privacy Mode
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The only image analysis platform where your data never leaves your device. 
              Not just secure—architecturally impossible to breach.
            </p>
          </div>

          {/* How It Works */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">How Privacy Mode Works</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Local Processing Only</h3>
                    <p className="text-slate-400">All image analysis happens entirely in your browser using WebAssembly and client-side AI models.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Zero Data Transmission</h3>
                    <p className="text-slate-400">Your images never leave your device. No uploads, no cloud processing, no server storage.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Open Source Verification</h3>
                    <p className="text-slate-400">Our privacy claims are verifiable through open source code and independent security audits.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-6">Privacy Guarantees</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">No server uploads required</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Works offline after initial load</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Automatic GDPR compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">HIPAA compliant by design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Zero vendor lock-in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Privacy Mode vs Traditional SaaS</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  Traditional SaaS Platforms
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li>• Upload sensitive data to unknown servers</li>
                  <li>• Hope their security policies protect you</li>
                  <li>• Accept breach risk as "normal"</li>
                  <li>• Pay for their massive security infrastructure</li>
                  <li>• Comply with their data retention policies</li>
                  <li>• Trust third-party security audits</li>
                </ul>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center">
                  <Shield className="w-6 h-6 mr-3" />
                  ProofPix Privacy Mode
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li>• Zero data transmission to servers</li>
                  <li>• Technically impossible to breach</li>
                  <li>• Eliminate breach risk entirely</li>
                  <li>• No server costs = 83% savings</li>
                  <li>• You control all data retention</li>
                  <li>• Verify privacy claims in open source</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Technical Implementation</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-400" />
                  WebAssembly Engine
                </h3>
                <p className="text-slate-400 text-sm">
                  High-performance image processing using compiled WebAssembly modules for near-native speed.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Server className="w-5 h-5 mr-2 text-purple-400" />
                  Client-Side AI
                </h3>
                <p className="text-slate-400 text-sm">
                  Advanced AI models optimized for browser execution, providing enterprise-grade analysis locally.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-400" />
                  Offline Capable
                </h3>
                <p className="text-slate-400 text-sm">
                  Works completely offline after initial load, ensuring privacy even without internet connectivity.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Experience True Privacy</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Try Privacy Mode now and see why 50,000+ professionals trust ProofPix with their most sensitive data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
              >
                Try Privacy Mode Free
              </a>
              <a
                href="/trust-verification"
                className="border border-slate-600 text-slate-300 hover:text-white px-8 py-4 rounded-lg font-semibold hover:border-slate-500 transition-all duration-200"
              >
                Verify Our Claims
              </a>
            </div>
          </div>
        </div>
      </div>
    </ConsistentLayout>
  );
};

export default PrivacyMode; 