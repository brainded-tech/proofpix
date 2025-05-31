import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Server, Eye, Lock, AlertTriangle, CheckCircle, XCircle, Code } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

const SecurityArchitectureDocument: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  return (
    <EnterpriseLayout
      showHero
      title="Security Architecture Document"
      description="Revolutionary client-side processing security model"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <EnterpriseButton
          variant="ghost"
          onClick={handleBackToDocs}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Documentation
        </EnterpriseButton>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Security Architecture Document</h1>
            <p className="text-xl text-slate-600 mt-2">
              Revolutionary client-side processing security model
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<Shield className="enterprise-icon-sm" />}>
            Security Architecture
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<CheckCircle className="enterprise-icon-sm" />}>
            Enterprise Ready
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<Server className="enterprise-icon-sm" />}>
            Infrastructure
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            ProofPix Security Architecture Document
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Revolutionary client-side processing security model that eliminates traditional SaaS risks
          </p>
        </div>

        {/* Executive Summary */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Executive Summary</h2>
          
          <p className="text-slate-600 mb-6">
            ProofPix represents a <strong className="text-blue-600">paradigm shift in SaaS security architecture</strong>. 
            By processing all image metadata extraction client-side in the user's browser, we've eliminated 90% of 
            traditional security risks while delivering superior performance and privacy protection.
          </p>

          <EnterpriseGrid columns={4}>
            <EnterpriseCard className="text-center border-2 border-green-200">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Zero Server Storage</h3>
              <p className="text-sm text-slate-600">Customer images never transmitted or stored</p>
            </EnterpriseCard>
            
            <EnterpriseCard className="text-center border-2 border-blue-200">
              <Server className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Minimal Attack Surface</h3>
              <p className="text-sm text-slate-600">No server-side processing to compromise</p>
            </EnterpriseCard>
            
            <EnterpriseCard className="text-center border-2 border-purple-200">
              <Lock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Privacy by Design</h3>
              <p className="text-sm text-slate-600">GDPR/CCPA compliance built into architecture</p>
            </EnterpriseCard>
            
            <EnterpriseCard className="text-center border-2 border-yellow-200">
              <Eye className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Transparent Security</h3>
              <p className="text-sm text-slate-600">Open-source codebase enables full verification</p>
            </EnterpriseCard>
          </EnterpriseGrid>
        </EnterpriseCard>

        {/* Architecture Overview */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Architecture Overview</h2>
          
          <EnterpriseGrid columns={2}>
            {/* Client-Side Processing Flow */}
            <EnterpriseCard className="border-2 border-green-200">
              <h3 className="text-lg font-semibold text-green-600 mb-4">Image Processing Flow (100% Client-Side)</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <div className="font-medium text-slate-900">File Selection</div>
                    <div className="text-sm text-slate-600">User selects images via secure file picker</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <div className="font-medium text-slate-900">Memory Loading</div>
                    <div className="text-sm text-slate-600">Images loaded into browser memory only</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <div className="font-medium text-slate-900">EXIF Extraction</div>
                    <div className="text-sm text-slate-600">Metadata extracted using client-side JavaScript</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                  <div>
                    <div className="font-medium text-slate-900">Results Display</div>
                    <div className="text-sm text-slate-600">Metadata displayed in browser interface</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                  <div>
                    <div className="font-medium text-slate-900">Export Generation</div>
                    <div className="text-sm text-slate-600">PDF/JSON exports created locally</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">6</div>
                  <div>
                    <div className="font-medium text-slate-900">Memory Cleanup</div>
                    <div className="text-sm text-slate-600">All data cleared when user leaves</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-green-100 border border-green-300 rounded-lg p-4">
                <p className="text-green-700 font-medium text-center">
                  Security Result: ZERO network transmission of customer images
                </p>
              </div>
            </EnterpriseCard>

            {/* Supporting Services Flow */}
            <EnterpriseCard className="border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Supporting Services Flow</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-900">Authentication</div>
                    <div className="text-sm text-slate-600">Standard OAuth/JWT tokens for account management</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-900">Payment Processing</div>
                    <div className="text-sm text-slate-600">Stripe handles all payment data (PCI DSS compliant)</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-900">Analytics</div>
                    <div className="text-sm text-slate-600">Anonymous usage metrics via privacy-focused Plausible</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-900">Static Delivery</div>
                    <div className="text-sm text-slate-600">Web app delivered via Netlify CDN with security headers</div>
                  </div>
                </div>
              </div>
            </EnterpriseCard>
          </EnterpriseGrid>
        </EnterpriseCard>

        {/* Threat Model Analysis */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Threat Model Analysis</h2>
          
          <EnterpriseGrid columns={2}>
            {/* Traditional SaaS Threats */}
            <EnterpriseCard className="border-2 border-red-200">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Traditional SaaS Threat Landscape</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Server-side code injection attacks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Database breaches and SQL injection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Admin account compromise</span>
                </div>
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Backup system vulnerabilities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Third-party service provider breaches</span>
                </div>
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Insider threats and privilege escalation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <span className="text-gray-300">Data retention and disposal risks</span>
                </div>
              </div>
            </EnterpriseCard>

            {/* ProofPix Threat Landscape */}
            <EnterpriseCard className="border-2 border-green-200">
              <h3 className="text-lg font-semibold text-green-600 mb-4">ProofPix Attack Surface (Dramatically Reduced)</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Server breaches: ELIMINATED</div>
                    <div className="text-sm text-gray-400">No server processing</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Database attacks: ELIMINATED</div>
                    <div className="text-sm text-gray-400">No customer data storage</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Admin compromise: MINIMAL IMPACT</div>
                    <div className="text-sm text-gray-400">No customer data access</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Backup vulnerabilities: ELIMINATED</div>
                    <div className="text-sm text-gray-400">No backups to secure</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Browser vulnerabilities: MITIGATED</div>
                    <div className="text-sm text-gray-400">Input validation, CSP headers</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Malicious file uploads: MITIGATED</div>
                    <div className="text-sm text-gray-400">Client-side processing, file validation</div>
                  </div>
                </div>
              </div>
            </EnterpriseCard>
          </EnterpriseGrid>

          {/* Risk Comparison Matrix */}
          <div className="mt-8 bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Risk Comparison Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-300">Threat Category</th>
                    <th className="text-center py-2 text-gray-300">Traditional SaaS</th>
                    <th className="text-center py-2 text-gray-300">ProofPix</th>
                    <th className="text-center py-2 text-gray-300">Risk Reduction</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-gray-800">
                    <td className="py-2 text-white">Data Breach</td>
                    <td className="text-center py-2 text-red-400 font-bold">HIGH</td>
                    <td className="text-center py-2 text-green-400 font-bold">VERY LOW</td>
                    <td className="text-center py-2 text-green-400">95% reduction</td>
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
                    <td className="py-2 text-white">Third-party Risks</td>
                    <td className="text-center py-2 text-yellow-400 font-bold">MEDIUM</td>
                    <td className="text-center py-2 text-yellow-400 font-bold">LOW</td>
                    <td className="text-center py-2 text-green-400">70% reduction</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 text-white">Compliance Violations</td>
                    <td className="text-center py-2 text-red-400 font-bold">HIGH</td>
                    <td className="text-center py-2 text-green-400 font-bold">VERY LOW</td>
                    <td className="text-center py-2 text-green-400">95% reduction</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white">Business Continuity</td>
                    <td className="text-center py-2 text-yellow-400 font-bold">MEDIUM</td>
                    <td className="text-center py-2 text-green-400 font-bold">HIGH</td>
                    <td className="text-center py-2 text-green-400">60% improvement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </EnterpriseCard>

        {/* Security Control Implementation */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Security Control Implementation</h2>
          
          <div className="space-y-8">
            {/* Client-Side Security Controls */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Client-Side Security Controls</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Code className="h-6 w-6 text-blue-400" />
                    <h4 className="font-semibold text-white">Input Validation & Sanitization</h4>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <pre className="text-sm text-green-400 overflow-x-auto">
{`// Secure file validation implementation
class SecureFileValidator {
  validateImageFile(file) {
    // File size limits
    if (file.size > 50 * 1024 * 1024) { // 50MB max
      throw new SecurityError('File too large');
    }
    
    // MIME type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      throw new SecurityError('Invalid file type');
    }
    
    // File signature validation
    return this.validateFileSignature(file);
  }
  
  sanitizeMetadata(metadata) {
    // Remove potentially dangerous fields
    const sanitized = {...metadata};
    delete sanitized.MakerNote; // Binary data
    delete sanitized.UserComment; // Potential XSS
    
    // Validate GPS coordinates
    if (sanitized.GPS) {
      sanitized.GPS = this.validateGPSData(sanitized.GPS);
    }
    
    return sanitized;
  }
}`}
                    </pre>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-6 w-6 text-green-400" />
                    <h4 className="font-semibold text-white">Content Security Policy (CSP)</h4>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <pre className="text-sm text-blue-400 overflow-x-auto">
{`<!-- Strict CSP headers prevent XSS attacks -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  connect-src 'self' https://api.stripe.com https://plausible.io;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://checkout.stripe.com;
">`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Additional Security Features</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Memory Management</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Automatic memory cleanup</li>
                    <li>• Secure object disposal</li>
                    <li>• Memory leak prevention</li>
                    <li>• Browser sandbox isolation</li>
                  </ul>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Transport Security</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• TLS 1.3 encryption</li>
                    <li>• HSTS enforcement</li>
                    <li>• Certificate pinning</li>
                    <li>• Perfect Forward Secrecy</li>
                  </ul>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Application Security</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• XSS protection headers</li>
                    <li>• CSRF token validation</li>
                    <li>• Clickjacking prevention</li>
                    <li>• Secure cookie settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </EnterpriseCard>

        {/* Security Validation */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Security Validation & Transparency</h2>
          
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
        </EnterpriseCard>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </EnterpriseLayout>
  );
};

export default SecurityArchitectureDocument; 