import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const ComplianceDocumentationTemplates: React.FC = () => {
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
                Ready-to-Use
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
                Compliance Templates
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300">
                Enterprise Ready
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Compliance Documentation Templates
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready-to-use compliance templates for enterprise customers to accelerate procurement and regulatory approval
          </p>
        </div>

        {/* Overview */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Template Overview</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="text-3xl font-bold text-green-400 mb-2">6</div>
              <div className="text-sm text-gray-400">Compliance Templates</div>
            </div>
            <div className="text-center p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-400 mb-2">50%</div>
              <div className="text-sm text-gray-400">Faster Procurement</div>
            </div>
            <div className="text-center p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-sm text-gray-400">Pre-filled Responses</div>
            </div>
          </div>

          <p className="text-gray-300 mb-4">
            These templates eliminate compliance documentation barriers and reduce customer procurement time by providing 
            pre-filled, legally reviewed documents that demonstrate ProofPix's regulatory expertise and readiness.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-400">Legal Review Required</div>
                <div className="text-sm text-gray-400">
                  All templates should be reviewed by your legal team before execution. These are starting points 
                  that may need customization for your specific requirements.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GDPR Data Processing Agreement */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">GDPR Data Processing Agreement (DPA)</h2>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Template Details</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">GDPR Article 28 Compliant</div>
                    <div className="text-sm text-gray-400">Meets all processor agreement requirements</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Pre-filled ProofPix Details</div>
                    <div className="text-sm text-gray-400">Security measures and processing details included</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Standard Contractual Clauses</div>
                    <div className="text-sm text-gray-400">EU-approved transfer mechanisms included</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Key Sections</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Subject matter and duration of processing</li>
                <li>• Nature and purpose of processing</li>
                <li>• Categories of personal data (Note: ProofPix processes minimal data)</li>
                <li>• Categories of data subjects</li>
                <li>• Technical and organizational security measures</li>
                <li>• Sub-processor arrangements</li>
                <li>• Data subject rights assistance</li>
                <li>• International transfer safeguards</li>
                <li>• Audit and inspection rights</li>
                <li>• Breach notification procedures</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-green-400">ProofPix Advantage</div>
                <div className="text-sm text-gray-400">
                  ProofPix's client-side processing architecture means we process minimal personal data, 
                  making GDPR compliance significantly simpler than traditional cloud services.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SOC 2 Vendor Assessment */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">SOC 2 Vendor Assessment Template</h2>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Assessment Coverage</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Trust Services Criteria</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Security</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Availability</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Processing Integrity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Confidentiality</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Control Categories</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Control Environment (CC1)</li>
                    <li>• Communication and Information (CC2)</li>
                    <li>• Risk Assessment (CC3)</li>
                    <li>• Monitoring Activities (CC4)</li>
                    <li>• Control Activities (CC5)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Pre-filled Responses</h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-white mb-3">Sample Questions & Responses</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-blue-400 font-medium">Q: Do you have a SOC 2 Type II report?</div>
                    <div className="text-gray-400">A: SOC 2 Type II certification in progress, 90% complete. Audit scheduled for Q3 2025.</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-medium">Q: How do you protect customer data?</div>
                    <div className="text-gray-400">A: Revolutionary client-side processing - customer images never leave their device, eliminating server-side data breach risks.</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-medium">Q: What encryption do you use?</div>
                    <div className="text-gray-400">A: TLS 1.3 for all communications, AES-256 for data at rest, with Perfect Forward Secrecy.</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="text-sm text-blue-400 font-medium mb-1">Certification Timeline</div>
                <div className="text-sm text-gray-400">
                  SOC 2 Type II audit scheduled for Q3 2025. Current security controls meet or exceed SOC 2 requirements.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HIPAA Business Associate Agreement */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">HIPAA Business Associate Agreement</h2>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">HIPAA Compliance</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Technical Safeguards</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Access control and unique user identification</li>
                    <li>• Automatic logoff and encryption</li>
                    <li>• Audit controls and integrity controls</li>
                    <li>• Transmission security measures</li>
                  </ul>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Administrative Safeguards</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Security officer designation</li>
                    <li>• Workforce training and access management</li>
                    <li>• Incident response procedures</li>
                    <li>• Business associate agreements</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">ProofPix HIPAA Advantages</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">No PHI Processing</div>
                    <div className="text-sm text-gray-400">Client-side processing means no PHI touches our servers</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Simplified Compliance</div>
                    <div className="text-sm text-gray-400">Reduced compliance burden due to architecture</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Audit Trail</div>
                    <div className="text-sm text-gray-400">Comprehensive logging for compliance verification</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="text-sm text-purple-400 font-medium mb-1">Healthcare Use Cases</div>
                <div className="text-sm text-gray-400">
                  Perfect for medical imaging metadata extraction, forensic analysis, and evidence management 
                  in healthcare environments.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Questionnaire */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Security Questionnaire Template</h2>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Comprehensive Security Assessment</h3>
              <p className="text-gray-300 mb-4">
                Pre-filled responses to common enterprise security questionnaires, covering all major security domains 
                and highlighting ProofPix's unique security advantages.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-white mb-3">Security Domains Covered</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Data Protection & Privacy</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Access Control & Authentication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Network & Infrastructure Security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">Incident Response & Business Continuity</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-gray-300">Compliance & Governance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-gray-300">Vendor Management & Third Parties</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Sample Q&A</h4>
                <div className="bg-gray-900 rounded-lg p-4 space-y-3 text-sm">
                  <div>
                    <div className="text-blue-400 font-medium">Q: Where is customer data stored?</div>
                    <div className="text-gray-400">A: Customer images are never stored on our servers. All processing happens client-side in the user's browser.</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-medium">Q: What certifications do you have?</div>
                    <div className="text-gray-400">A: SOC 2 Type II in progress (90% complete), GDPR compliant, CCPA compliant, HIPAA-ready architecture.</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-medium">Q: How do you handle data breaches?</div>
                    <div className="text-gray-400">A: Our architecture eliminates most data breach risks since customer images never leave their device.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Templates */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Additional Compliance Templates</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Data Processing Impact Assessment (DPIA)</h3>
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                GDPR-compliant DPIA template for high-risk processing activities, pre-filled with ProofPix's 
                low-risk assessment due to client-side processing.
              </p>
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm">
                <Download className="h-4 w-4" />
                <span>Download DPIA Template</span>
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Audit Evidence Collection Package</h3>
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Comprehensive package of audit evidence including security policies, procedures, 
                and technical documentation for compliance audits.
              </p>
              <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-sm">
                <Download className="h-4 w-4" />
                <span>Download Evidence Package</span>
              </button>
            </div>
          </div>

          <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Custom Template Requests</h3>
            <p className="text-gray-300 mb-4">
              Need a specific compliance template not listed here? Our compliance team can create custom 
              templates tailored to your industry requirements and regulatory framework.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm">
                Request Custom Template
              </button>
              <button className="border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-4 py-2 rounded-lg transition-colors text-sm">
                Contact Compliance Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDocumentationTemplates; 