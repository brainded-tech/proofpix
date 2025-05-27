import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Server, Cloud, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import DocumentationFooter from '../../components/DocumentationFooter';

const SecurityArchitectureOverview: React.FC = () => {
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300">
                Revolutionary Architecture
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
                Client-Side Processing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300">
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
            Security Architecture Overview
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionary client-side processing architecture that eliminates traditional cloud security risks
          </p>
        </div>

        {/* Architecture Comparison */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Traditional vs. ProofPix Architecture</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Architecture */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Server className="h-8 w-8 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Traditional Cloud Processing</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">User uploads image to server</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Image stored on cloud servers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Server processes metadata</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Results sent back to user</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-red-400 mb-2">Security Risks</h4>
                <div className="flex items-start space-x-3">
                  <XCircle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Images stored on servers (data breach risk)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Metadata accessible to service provider</span>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Network transmission vulnerabilities</span>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Server-side processing logs</span>
                </div>
              </div>
            </div>

            {/* ProofPix Architecture */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-8 w-8 text-green-400" />
                <h3 className="text-lg font-semibold text-white">ProofPix Client-Side Processing</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">User selects image locally</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Processing happens in browser</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Metadata extracted locally</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Results displayed instantly</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-green-400 mb-2">Security Advantages</h4>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Images never leave user's device</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Zero server-side data storage</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-400">No network transmission of images</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Complete user control and privacy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Layers */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Multi-Layer Security Framework</h2>
          
          <div className="space-y-6">
            {/* Layer 1 */}
            <div className="bg-gray-900 rounded-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h3 className="text-lg font-semibold text-white">Client-Side Processing Layer</h3>
              </div>
              <p className="text-gray-300 mb-4">
                All image processing happens directly in the user's browser using WebAssembly technology.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Technologies</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• WebAssembly (WASM) for performance</li>
                    <li>• JavaScript Web Workers for isolation</li>
                    <li>• File API for secure file handling</li>
                    <li>• Canvas API for image processing</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Security Benefits</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• No server-side image storage</li>
                    <li>• Sandboxed execution environment</li>
                    <li>• Memory isolation and cleanup</li>
                    <li>• Browser security model protection</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Layer 2 */}
            <div className="bg-gray-900 rounded-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h3 className="text-lg font-semibold text-white">Transport Security Layer</h3>
              </div>
              <p className="text-gray-300 mb-4">
                All communications are encrypted and authenticated using industry-standard protocols.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Encryption</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• TLS 1.3 for all connections</li>
                    <li>• AES-256 encryption at rest</li>
                    <li>• Perfect Forward Secrecy</li>
                    <li>• Certificate pinning</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Authentication</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• JWT token-based authentication</li>
                    <li>• OAuth 2.0 / OpenID Connect</li>
                    <li>• SAML 2.0 for enterprise SSO</li>
                    <li>• Multi-factor authentication support</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Layer 3 */}
            <div className="bg-gray-900 rounded-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <h3 className="text-lg font-semibold text-white">Application Security Layer</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Comprehensive application-level security controls and monitoring.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Access Controls</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Role-based access control (RBAC)</li>
                    <li>• Attribute-based access control (ABAC)</li>
                    <li>• Session management and timeout</li>
                    <li>• IP whitelisting and geofencing</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Security Headers</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Content Security Policy (CSP)</li>
                    <li>• HTTP Strict Transport Security</li>
                    <li>• X-Frame-Options protection</li>
                    <li>• Cross-Origin Resource Sharing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Layer 4 */}
            <div className="bg-gray-900 rounded-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
                <h3 className="text-lg font-semibold text-white">Infrastructure Security Layer</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Enterprise-grade infrastructure security and monitoring capabilities.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Infrastructure</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• CDN-based global distribution</li>
                    <li>• DDoS protection and mitigation</li>
                    <li>• Web Application Firewall (WAF)</li>
                    <li>• Network segmentation</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Monitoring</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Real-time security monitoring</li>
                    <li>• Automated threat detection</li>
                    <li>• Comprehensive audit logging</li>
                    <li>• Incident response automation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Model */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Comprehensive Threat Model</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Eliminated Threats */}
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-4">Eliminated Threats</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Server-Side Data Breaches</div>
                    <div className="text-sm text-gray-400">No customer images stored on servers</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Data Interception</div>
                    <div className="text-sm text-gray-400">Images never transmitted over network</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Insider Threats</div>
                    <div className="text-sm text-gray-400">No employee access to customer images</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Third-Party Access</div>
                    <div className="text-sm text-gray-400">No third-party processing or storage</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Government Surveillance</div>
                    <div className="text-sm text-gray-400">No server-side data to subpoena</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mitigated Threats */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-4">Mitigated Threats</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Client-Side Attacks</div>
                    <div className="text-sm text-gray-400">Browser security model + CSP protection</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Cross-Site Scripting (XSS)</div>
                    <div className="text-sm text-gray-400">Strict CSP + input sanitization</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Session Hijacking</div>
                    <div className="text-sm text-gray-400">Secure session management + HTTPS</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">DDoS Attacks</div>
                    <div className="text-sm text-gray-400">CDN protection + rate limiting</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Malicious File Uploads</div>
                    <div className="text-sm text-gray-400">Client-side validation + sandboxing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Framework */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Enterprise Compliance Framework</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="text-center mb-3">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">GDPR</h3>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">100%</div>
                <div className="text-sm text-gray-400">Compliant</div>
              </div>
              <ul className="text-xs text-gray-400 mt-3 space-y-1">
                <li>• Data minimization by design</li>
                <li>• No personal data processing</li>
                <li>• User consent not required</li>
                <li>• Right to be forgotten built-in</li>
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="text-center mb-3">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">CCPA</h3>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">100%</div>
                <div className="text-sm text-gray-400">Compliant</div>
              </div>
              <ul className="text-xs text-gray-400 mt-3 space-y-1">
                <li>• No personal information collected</li>
                <li>• No data sales or sharing</li>
                <li>• Transparent privacy practices</li>
                <li>• Consumer rights respected</li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="text-center mb-3">
                <AlertTriangle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">SOC 2</h3>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">90%</div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
              <ul className="text-xs text-gray-400 mt-3 space-y-1">
                <li>• Type II certification in progress</li>
                <li>• Security controls implemented</li>
                <li>• Audit scheduled Q3 2025</li>
                <li>• Continuous monitoring active</li>
              </ul>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="text-center mb-3">
                <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">HIPAA</h3>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">Ready</div>
                <div className="text-sm text-gray-400">Architecture</div>
              </div>
              <ul className="text-xs text-gray-400 mt-3 space-y-1">
                <li>• No PHI processing or storage</li>
                <li>• Technical safeguards in place</li>
                <li>• Administrative controls ready</li>
                <li>• BAA available for customers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Validation */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Security Validation & Transparency</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Open Source Transparency</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Eye className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Complete Source Code Access</div>
                    <div className="text-sm text-gray-400">Full transparency for security verification</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Independent Security Audits</div>
                    <div className="text-sm text-gray-400">Third-party security assessments available</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Continuous Security Monitoring</div>
                    <div className="text-sm text-gray-400">Real-time security posture assessment</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Security Certifications</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">SOC 2 Type II</span>
                    <span className="text-blue-400">In Progress</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">ISO 27001</span>
                    <span className="text-yellow-400">Planned 2025</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">GDPR Compliance</span>
                    <span className="text-green-400">Certified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">CCPA Compliance</span>
                    <span className="text-green-400">Certified</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold text-white mb-2">Contact Security Team</h4>
                <div className="text-sm text-gray-400">
                  <p>For security questions or to report vulnerabilities:</p>
                  <p className="text-blue-400 mt-1">security@proofpixapp.com</p>
                  <p className="text-gray-500 mt-1">PGP Key: Available on request</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </div>
  );
};

export default SecurityArchitectureOverview; 