import React, { useState } from 'react';
import { Shield, Lock, Server, Zap, Globe, AlertTriangle, Check, RefreshCw, Eye } from 'lucide-react';
import { EnterpriseButton } from './ui/EnterpriseComponents';
import { pricingAnalytics } from '../utils/analytics';

interface PrivacyValuePropositionProps {
  className?: string;
  showCTA?: boolean;
  compact?: boolean;
}

const PrivacyValueProposition: React.FC<PrivacyValuePropositionProps> = ({
  className = '',
  showCTA = true,
  compact = false
}) => {
  const [activeTab, setActiveTab] = useState<'risk' | 'security' | 'compliance'>('risk');
  const [showAnimation, setShowAnimation] = useState(true);

  // Track tab changes
  const handleTabChange = (tab: 'risk' | 'security' | 'compliance') => {
    setActiveTab(tab);
    
    pricingAnalytics.track({
      event: 'privacy_tab_selected',
      category: 'engagement',
      label: tab
    });
  };

  const handleCtaClick = () => {
    pricingAnalytics.track({
      event: 'privacy_cta_clicked',
      category: 'conversion',
      label: activeTab
    });
  };

  // Statistics about data breaches
  const breachStats = [
    {
      stat: '$4.45M',
      description: 'Average cost of a data breach in 2023',
      source: 'IBM Security Cost of a Data Breach Report'
    },
    {
      stat: '83%',
      description: 'Of organizations have experienced more than one data breach',
      source: 'Ponemon Institute'
    },
    {
      stat: '277 days',
      description: 'Average time to identify and contain a data breach',
      source: 'IBM Security'
    }
  ];

  // Security features
  const securityFeatures = [
    {
      title: 'Client-Side Processing',
      description: 'Images never leave your device, eliminating transfer vulnerabilities',
      icon: <Lock />
    },
    {
      title: 'Zero Server Storage',
      description: 'No images stored on external servers means no risk of server breach',
      icon: <Server />
    },
    {
      title: 'No Metadata Database',
      description: 'Metadata extraction happens locally, with no central database to target',
      icon: <Shield />
    },
    {
      title: 'Modern Encryption',
      description: 'End-to-end encryption for any optional data transfer',
      icon: <Lock />
    }
  ];

  // Compliance benefits
  const complianceBenefits = [
    {
      regulation: 'GDPR',
      benefits: [
        'No personal data processing on servers',
        'No data transfer outside EU',
        'No data retention concerns'
      ]
    },
    {
      regulation: 'HIPAA',
      benefits: [
        'No PHI stored on external servers',
        'Simplified compliance documentation',
        'Reduced breach notification risk'
      ]
    },
    {
      regulation: 'CCPA/CPRA',
      benefits: [
        'No consumer data sold or shared',
        'Simplified right-to-delete compliance',
        'Minimal data collection footprint'
      ]
    }
  ];

  const renderRiskTab = () => (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-900 mb-4">The Hidden Risks of Server-Side Processing</h3>
      
      <div className="bg-red-50 rounded-lg border border-red-200 p-4 mb-6">
        <div className="flex items-start">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <AlertTriangle className="text-red-600" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Server-Based Solutions Create Massive Liability</h4>
            <p className="text-sm text-gray-700">
              When your images are uploaded to third-party servers for metadata extraction,
              you're creating significant liability. Those images could contain sensitive information,
              including location data, personal identifiers, and proprietary content.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {breachStats.map((stat, index) => (
          <div key={index} className="bg-slate-700 rounded-lg border border-slate-600 p-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{stat.stat}</div>
            <p className="text-sm text-slate-200 mb-1">{stat.description}</p>
            <p className="text-xs text-slate-400 italic">Source: {stat.source}</p>
          </div>
        ))}
      </div>
      
      {showAnimation && !compact && (
        <div className="relative h-64 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-lg mb-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h4 className="font-semibold text-white mb-2">How Traditional Image Processing Works</h4>
              <p className="text-sm text-slate-300">Your images travel through multiple servers, creating risk at each step</p>
            </div>
          </div>
          
          {/* Animation elements */}
          <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50">
                <Globe className="text-blue-400" size={24} />
              </div>
              <div className="absolute top-0 left-full w-24 h-2 bg-gradient-to-r from-blue-400 to-red-400 animate-pulse"></div>
            </div>
          </div>
          
          <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/50">
              <Server className="text-red-400" size={24} />
            </div>
          </div>
          
          <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2">
            <div className="relative">
              <div className="absolute top-0 right-full w-24 h-2 bg-gradient-to-r from-red-400 to-purple-400 animate-pulse"></div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50">
                <Eye className="text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-green-500/20 rounded-lg border border-green-500/50 p-4">
        <div className="flex items-start">
          <div className="bg-green-500/20 p-2 rounded-full mr-3 border border-green-500/50">
            <Shield className="text-green-400" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-white mb-1">The ProofPix Difference: Client-Side Processing</h4>
            <p className="text-sm text-slate-300">
              ProofPix processes everything in your browser or app. Your images never leave your device,
              completely eliminating these risks. No data breach is possible because there's no data stored
              on external servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Our Client-First Security Architecture</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="bg-slate-700 rounded-lg border border-slate-600 p-4">
            <div className="flex items-start">
              <div className="bg-blue-900/50 p-2 rounded-full mr-3 text-blue-400">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 mb-1">{feature.title}</h4>
                <p className="text-sm text-slate-200">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!compact && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-center">How ProofPix Works vs. Traditional Solutions</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
              <h5 className="font-medium text-slate-100 mb-2 flex items-center">
                <Shield className="text-green-400 mr-2" size={16} />
                ProofPix (Client-Side)
              </h5>
              <ol className="space-y-2 text-sm text-slate-200">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                  <span>Upload image to your browser (stays on your device)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                  <span>JavaScript extracts metadata directly in your browser</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                  <span>Analysis performed locally with zero data transfer</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                  <span>Results displayed and optionally exported locally</span>
                </li>
              </ol>
            </div>
            
            <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
              <h5 className="font-medium text-slate-100 mb-2 flex items-center">
                <AlertTriangle className="text-red-400 mr-2" size={16} />
                Traditional Solutions (Server-Side)
              </h5>
              <ol className="space-y-2 text-sm text-slate-200">
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                  <span>Upload image to third-party servers (data leaves your control)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                  <span>Image stored in provider's database (potential breach point)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                  <span>Analysis performed on their servers (limited visibility)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                  <span>Data remains on their servers (retention risk)</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-start p-4 bg-gray-50 rounded-lg">
        <RefreshCw className="text-blue-600 mr-3 flex-shrink-0" size={20} />
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Regular Security Audits:</span> Our client-side architecture is regularly audited by independent security firms to ensure it maintains the highest security standards.
        </p>
      </div>
    </div>
  );

  const renderComplianceTab = () => (
    <div className="animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Simplified Compliance</h3>
      
      <p className="text-gray-600 mb-6">
        ProofPix's unique client-side processing architecture dramatically simplifies regulatory compliance across multiple frameworks. When data never leaves the user's device, many compliance requirements become irrelevant.
      </p>
      
      <div className="space-y-6 mb-6">
        {complianceBenefits.map((item, index) => (
          <div key={index} className="bg-slate-600 rounded-lg border border-slate-500 overflow-hidden">
            <div className="bg-slate-700 px-4 py-3 border-b border-slate-500">
              <h4 className="font-semibold text-slate-100">{item.regulation} Compliance Benefits</h4>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {item.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-slate-200 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      {!compact && (
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <AlertTriangle className="text-yellow-600" size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">A Note on Compliance</h4>
              <p className="text-sm text-gray-700">
                While our architecture dramatically reduces compliance burden, you should always consult with your legal team regarding your specific regulatory requirements. ProofPix provides extensive documentation to support your compliance efforts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`bg-slate-700 rounded-xl border border-slate-600 p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy by Design</h2>
        <p className="text-gray-600">
          Our client-side processing approach completely eliminates the privacy and security risks associated with traditional server-based solutions
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'risk'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('risk')}
        >
          Risk Elimination
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'security'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('security')}
        >
          Security Architecture
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'compliance'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('compliance')}
        >
          Simplified Compliance
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mb-6">
        {activeTab === 'risk' && renderRiskTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'compliance' && renderComplianceTab()}
      </div>
      
      {/* CTA Section */}
      {showCTA && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Experience the peace of mind that comes with client-side processing
          </p>
          <EnterpriseButton
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleCtaClick}
          >
            Try Risk-Free Processing Today
          </EnterpriseButton>
        </div>
      )}
    </div>
  );
};

export default PrivacyValueProposition; 