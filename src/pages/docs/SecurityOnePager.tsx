import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Download, 
  AlertTriangle,
  Server,
  Globe,
  Users,
  Database,
  Settings
} from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

const SecurityOnePager: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleDownload = () => {
    // Generate PDF version for sales team
    window.print();
  };

  return (
    <EnterpriseLayout
      showHero
      title="Security One-Pager"
      description="Executive summary of ProofPix security architecture and compliance"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <div className="flex items-center justify-between mb-6">
          <EnterpriseButton
            variant="ghost"
            onClick={handleBackHome}
          >
            ← Back to ProofPix
          </EnterpriseButton>
          
          <EnterpriseButton
            variant="primary"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </EnterpriseButton>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-green-600 p-3 rounded-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Security One-Pager</h1>
            <p className="text-xl text-slate-600 mt-2">
              Executive summary of ProofPix security architecture and compliance
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="success">
            Executive Summary
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            ProofPix Security One-Pager
          </h1>
          <p className="text-lg text-gray-300">
            Revolutionary Security Through Client-Side Processing
          </p>
          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-blue-300 font-medium">
              "We don't just meet security requirements - we've eliminated most security risks entirely."
            </p>
          </div>
        </div>

        {/* Key Security Advantages */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Shield className="h-6 w-6 text-green-400 mr-2" />
            Why ProofPix is More Secure Than Traditional SaaS
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Zero Server Storage</div>
                  <div className="text-sm text-gray-400">Customer images never leave their device</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">No Network Transmission</div>
                  <div className="text-sm text-gray-400">Images processed entirely in browser</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Automatic Compliance</div>
                  <div className="text-sm text-gray-400">GDPR/CCPA compliant by design</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Minimal Attack Surface</div>
                  <div className="text-sm text-gray-400">90% fewer security risks than traditional SaaS</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Open Source Transparency</div>
                  <div className="text-sm text-gray-400">Full code visibility for security verification</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Enterprise Authentication</div>
                  <div className="text-sm text-gray-400">SSO, MFA, RBAC ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Comparison */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Security Risk Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-300">Security Risk</th>
                  <th className="text-center py-2 text-gray-300">Traditional SaaS</th>
                  <th className="text-center py-2 text-gray-300">ProofPix</th>
                  <th className="text-center py-2 text-gray-300">Advantage</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-2 text-white">Data Breach</td>
                  <td className="text-center py-2 text-red-400 font-bold">HIGH</td>
                  <td className="text-center py-2 text-green-400 font-bold">NONE</td>
                  <td className="text-center py-2 text-green-400">100% elimination</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 text-white">Server Compromise</td>
                  <td className="text-center py-2 text-red-400 font-bold">HIGH</td>
                  <td className="text-center py-2 text-green-400 font-bold">NONE</td>
                  <td className="text-center py-2 text-green-400">100% elimination</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 text-white">Insider Threats</td>
                  <td className="text-center py-2 text-yellow-400 font-bold">MEDIUM</td>
                  <td className="text-center py-2 text-green-400 font-bold">VERY LOW</td>
                  <td className="text-center py-2 text-green-400">90% reduction</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 text-white">Compliance Violations</td>
                  <td className="text-center py-2 text-red-400 font-bold">HIGH</td>
                  <td className="text-center py-2 text-green-400 font-bold">VERY LOW</td>
                  <td className="text-center py-2 text-green-400">95% reduction</td>
                </tr>
                <tr>
                  <td className="py-2 text-white">Third-party Risks</td>
                  <td className="text-center py-2 text-yellow-400 font-bold">MEDIUM</td>
                  <td className="text-center py-2 text-green-400 font-bold">LOW</td>
                  <td className="text-center py-2 text-green-400">70% reduction</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Compliance Readiness</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">95%</div>
              <div className="text-sm text-white font-medium">GDPR Ready</div>
              <div className="text-xs text-gray-400">Privacy by design</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">90%</div>
              <div className="text-sm text-white font-medium">HIPAA Ready</div>
              <div className="text-xs text-gray-400">Minimal ePHI handling</div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">85%</div>
              <div className="text-sm text-white font-medium">SOC 2 Ready</div>
              <div className="text-xs text-gray-400">6 months to certification</div>
            </div>
          </div>
        </div>

        {/* Key Talking Points */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Key Sales Talking Points</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400 mb-2">🛡️ "Unhackable by Design"</h3>
              <p className="text-gray-300 text-sm">
                "Your images never leave your device, so they can't be stolen from our servers - because we don't have any servers storing your data."
              </p>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-2">📋 "Instant Compliance"</h3>
              <p className="text-gray-300 text-sm">
                "Our architecture automatically satisfies GDPR, CCPA, and most privacy regulations because we simply don't collect or store personal data."
              </p>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-purple-400 mb-2">🔍 "Complete Transparency"</h3>
              <p className="text-gray-300 text-sm">
                "Open source code means your security team can verify every line of code. No black boxes, no hidden processes."
              </p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-400 mb-2">⚡ "Zero Trust, Maximum Security"</h3>
              <p className="text-gray-300 text-sm">
                "Even if our entire infrastructure was compromised, your customer data would remain safe because it's never there to begin with."
              </p>
            </div>
          </div>
        </div>

        {/* Common Objections & Responses */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Common Objections & Responses</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-red-400 mb-2">❓ "How do we know client-side processing is secure?"</h3>
              <p className="text-gray-300 text-sm mb-2">
                <strong>Response:</strong> "Our code is open source and auditable. Plus, client-side processing eliminates the #1 security risk: server-side data storage. Even if there were vulnerabilities, there's no centralized data to compromise."
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-400 mb-2">❓ "What about compliance audits?"</h3>
              <p className="text-gray-300 text-sm mb-2">
                <strong>Response:</strong> "Audits are actually easier because there's less to audit. No data retention policies needed, no data disposal procedures, no backup security - because we don't store customer data."
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-400 mb-2">❓ "How do you handle enterprise authentication?"</h3>
              <p className="text-gray-300 text-sm mb-2">
                <strong>Response:</strong> "Full SSO integration with SAML and OAuth, MFA support, and RBAC. The difference is that even if accounts are compromised, there's no customer data to access."
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-bold text-white mb-2">Questions? Need Technical Details?</h2>
          <p className="text-gray-300 mb-4">Connect prospects with our technical team for deep-dive security discussions</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="text-sm">
              <span className="text-gray-400">Security Team:</span>
              <span className="text-blue-400 ml-2">security@proofpixapp.com</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Sales Engineering:</span>
              <span className="text-blue-400 ml-2">sales@proofpixapp.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </EnterpriseLayout>
  );
};

export default SecurityOnePager; 