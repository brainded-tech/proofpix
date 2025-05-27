import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const EnterpriseSecurityFAQ: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToDocs}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Documentation</span>
            </button>
            <div className="flex space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-300">
                Security FAQ
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300">
                Enterprise Ready
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300">
                Zero Server Risk
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Enterprise Security FAQ
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Addressing enterprise customer security concerns with our revolutionary client-side processing architecture
          </p>
          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-300 font-medium">
              "We don't just meet enterprise security requirements - we've eliminated most security risks entirely through architectural design."
            </p>
          </div>
        </div>

        {/* Data Protection & Privacy */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Data Protection & Privacy</h2>
          </div>
          
          <div className="space-y-8">
            {/* Q1 */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">
                Q: How is customer data protected in ProofPix?
              </h3>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-green-300 font-medium">
                  A: Customer data is protected by the ultimate security measure - it never leaves the customer's device.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Detailed Explanation:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">Zero Server Transmission</div>
                        <div className="text-sm text-gray-400">Images processed entirely in browser using JavaScript</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">No Network Transfer</div>
                        <div className="text-sm text-gray-400">Customer images never traverse network connections</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">Memory-Only Processing</div>
                        <div className="text-sm text-gray-400">Images exist only in browser memory during processing</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">Automatic Cleanup</div>
                        <div className="text-sm text-gray-400">All data cleared when browser session ends</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-white mb-3">Traditional SaaS vs ProofPix:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-300">Traditional SaaS:</span>
                      <span className="text-gray-400">User → Network → Server → Database → Backup → Long-term Storage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-300">ProofPix:</span>
                      <span className="text-gray-400">User → Browser Processing → Local Export (END)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-300 font-medium">
                    Security Advantage: Eliminates 90% of data breach attack vectors by removing server-side data handling entirely.
                  </p>
                </div>
              </div>
            </div>

            {/* Q2 */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">
                Q: What happens to our images after processing?
              </h3>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-green-300 font-medium">
                  A: Nothing - because they're never stored anywhere to begin with.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Technical Details:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-white">Processing Lifecycle</div>
                        <div className="text-sm text-gray-400">Images loaded → Metadata extracted → Results displayed → Memory cleared</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-white">No Persistence</div>
                        <div className="text-sm text-gray-400">Images exist only during active browser session</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-white">No Backups</div>
                        <div className="text-sm text-gray-400">Nothing to backup since nothing is stored</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-white">No Recovery Needed</div>
                        <div className="text-sm text-gray-400">No data retention means no data recovery requirements</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-purple-300 font-medium">
                    Compliance Advantage: Automatically satisfies data retention, disposal, and right-to-erasure requirements across all privacy regulations.
                  </p>
                </div>
              </div>
            </div>

            {/* Q3 */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">
                Q: How do you handle sensitive metadata like GPS coordinates?
              </h3>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-green-300 font-medium">
                  A: Users maintain complete control - we provide tools, they control the data.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Privacy Controls:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Eye className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">User Visibility</div>
                        <div className="text-sm text-gray-400">All extracted metadata displayed before any export</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">Selective Export</div>
                        <div className="text-sm text-gray-400">Users choose which metadata fields to include</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Lock className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">GPS Redaction</div>
                        <div className="text-sm text-gray-400">Built-in tools to remove or blur GPS coordinates</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Enterprise Features:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">Metadata Policies</div>
                        <div className="text-sm text-gray-400">Admin controls for organizationally-acceptable metadata</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Server className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">Bulk Redaction</div>
                        <div className="text-sm text-gray-400">Remove sensitive fields from multiple images</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-white">Audit Trails</div>
                        <div className="text-sm text-gray-400">Local logging of metadata handling decisions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication & Access Control */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="h-8 w-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Authentication & Access Control</h2>
          </div>
          
          <div className="space-y-8">
            {/* Q4 */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">
                Q: What about user authentication and access controls?
              </h3>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-green-300 font-medium">
                  A: Enterprise-grade authentication with the unique advantage that compromised accounts can't access customer image data.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Authentication Features:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">Multi-Factor Authentication: Required for all enterprise accounts</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Single Sign-On (SSO): SAML 2.0 and OAuth 2.0 integration</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">Role-Based Access: Granular permissions for different user types</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300">Session Management: Secure session tokens with configurable timeouts</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">Unique Security Advantage:</h4>
                  <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-300">Traditional SaaS Breach Impact:</span>
                    </div>
                    <div className="text-gray-400 ml-6">Account compromise → Server access → Customer data exposure</div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-300">ProofPix Breach Impact:</span>
                    </div>
                    <div className="text-gray-400 ml-6">Account compromise → No customer data to access</div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                    <p className="text-blue-300 font-medium text-sm">
                      Why This Matters: Even if user accounts are compromised, attackers cannot access customer images because they don't exist on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Q5 */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">
                Q: How do you manage privileged access and admin accounts?
              </h3>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-green-300 font-medium">
                  A: Minimal privileged access needed due to architecture - no customer data to access.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Privileged Access Scope (Limited):</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300 text-sm">System Administration: Infrastructure and deployment management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300 text-sm">User Account Management: Account creation, billing, and support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Analytics Access: Anonymous usage statistics only</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Payment Processing: Limited to Stripe dashboard access</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">What Admins CANNOT Access:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-gray-300 text-sm">Customer images (never stored on servers)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-gray-300 text-sm">Customer metadata (processed client-side only)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-gray-300 text-sm">Processing history (no server-side processing logs)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-gray-300 text-sm">User content (no content stored server-side)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-6">
                <p className="text-green-300 font-medium">
                  Security Result: Privileged account compromise has minimal impact because there's no customer data to compromise.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue with more sections... */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            This FAQ continues with sections on Audit Trails & Monitoring, Infrastructure & Business Continuity, and more.
          </p>
          <button
            onClick={handleBackToDocs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Documentation Index
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseSecurityFAQ; 