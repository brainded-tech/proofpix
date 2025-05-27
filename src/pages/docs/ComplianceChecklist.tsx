import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Clock, Target, FileText } from 'lucide-react';
import DocumentationFooter from '../../components/DocumentationFooter';

const ComplianceChecklist: React.FC = () => {
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
                Compliance Ready
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
                Assessment
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300">
                Enterprise
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Enterprise Compliance Checklist
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive compliance readiness assessment across all major regulatory frameworks
          </p>
        </div>

        {/* Executive Summary */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="h-8 w-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Executive Summary</h2>
          </div>
          
          <p className="text-gray-300 mb-6">
            ProofPix's client-side architecture provides <strong className="text-blue-400">exceptional compliance advantages</strong> across 
            all major regulatory frameworks. Our zero-server-storage model eliminates most compliance complexity while delivering 
            superior privacy protection.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">SOC 2</span>
                <span className="text-2xl font-bold text-green-400">85%</span>
              </div>
              <div className="text-sm text-gray-400">6 months to certification</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">HIPAA</span>
                <span className="text-2xl font-bold text-green-400">90%</span>
              </div>
              <div className="text-sm text-gray-400">Architecture naturally compliant</div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">FedRAMP</span>
                <span className="text-2xl font-bold text-yellow-400">60%</span>
              </div>
              <div className="text-sm text-gray-400">Requires specialized implementation</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">ISO 27001</span>
                <span className="text-2xl font-bold text-green-400">80%</span>
              </div>
              <div className="text-sm text-gray-400">Strong security foundation</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">GDPR</span>
                <span className="text-2xl font-bold text-green-400">95%</span>
              </div>
              <div className="text-sm text-gray-400">Privacy-by-design architecture</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">CCPA</span>
                <span className="text-2xl font-bold text-green-400">95%</span>
              </div>
              <div className="text-sm text-gray-400">Minimal data collection</div>
            </div>
          </div>
        </div>

        {/* SOC 2 Type II Readiness */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">SOC 2 Type II Readiness Assessment</h2>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Trust Service Criteria Evaluation</h3>
            
            {/* Security Common Criteria */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Security (Common Criteria)</h4>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold text-yellow-400">85%</div>
                  <span className="text-sm text-gray-400">Ready</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white">CC1.0 - Control Environment</div>
                      <ul className="text-sm text-gray-400 mt-1 space-y-1">
                        <li>✅ Management philosophy documented</li>
                        <li>✅ Organizational structure defined</li>
                        <li>✅ Board oversight established</li>
                        <li className="text-yellow-400">⚠️ Need: Security committee charter</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white">CC2.0 - Communication</div>
                      <ul className="text-sm text-gray-400 mt-1 space-y-1">
                        <li>✅ Privacy policy published</li>
                        <li>✅ Internal security procedures</li>
                        <li className="text-yellow-400">⚠️ Need: Security awareness training</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white">CC3.0 - Risk Assessment (70%)</div>
                      <ul className="text-sm text-gray-400 mt-1 space-y-1">
                        <li>✅ Basic risk identification</li>
                        <li>✅ Architecture advantages documented</li>
                        <li className="text-yellow-400">⚠️ Need: Formal risk methodology</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white">CC4.0 - Monitoring (80%)</div>
                      <ul className="text-sm text-gray-400 mt-1 space-y-1">
                        <li>✅ Security monitoring via Netlify</li>
                        <li>✅ Code repository monitoring</li>
                        <li className="text-yellow-400">⚠️ Need: Compliance dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Trust Service Criteria */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Availability</h4>
                  <span className="text-xl font-bold text-green-400">90%</span>
                </div>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>✅ 99.9% uptime target</li>
                  <li>✅ DDoS protection</li>
                  <li>✅ Global distribution</li>
                  <li className="text-yellow-400">⚠️ Need: SLA docs</li>
                </ul>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Processing Integrity</h4>
                  <span className="text-xl font-bold text-green-400">80%</span>
                </div>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>✅ Client-side processing</li>
                  <li>✅ Input validation</li>
                  <li>✅ Error handling</li>
                  <li className="text-yellow-400">⚠️ Need: Quality monitoring</li>
                </ul>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Confidentiality</h4>
                  <span className="text-xl font-bold text-green-400">95%</span>
                </div>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>✅ Data never transmitted</li>
                  <li>✅ HTTPS encryption</li>
                  <li>✅ Secure authentication</li>
                  <li className="text-yellow-400">⚠️ Need: Data classification</li>
                </ul>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Privacy</h4>
                  <span className="text-xl font-bold text-green-400">95%</span>
                </div>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>✅ Privacy notice</li>
                  <li>✅ Data subject rights</li>
                  <li>✅ Privacy-by-design</li>
                  <li className="text-yellow-400">⚠️ Need: DPIA docs</li>
                </ul>
              </div>
            </div>

            {/* SOC 2 Timeline */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">SOC 2 Implementation Timeline</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-blue-400">Phase 1 (Q1 2024)</h5>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Policy Documentation (30d)</li>
                    <li>• Risk Assessment (30d)</li>
                    <li>• Control Implementation (45d)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-blue-400">Phase 2 (Q2 2024)</h5>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Internal Testing (30d)</li>
                    <li>• Gap Remediation (30d)</li>
                    <li>• Readiness Assessment (15d)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-blue-400">Phase 3 (Q3 2024)</h5>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• External Audit (45d)</li>
                    <li>• Report Review (15d)</li>
                    <li>• Certification (Milestone)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <h5 className="font-medium text-white mb-2">Estimated Investment:</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">External Auditor:</span>
                    <span className="text-green-400 ml-2">$35,000</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Compliance Platform:</span>
                    <span className="text-green-400 ml-2">$15,000/year</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Internal Resources:</span>
                    <span className="text-green-400 ml-2">200 hours</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Total:</span>
                    <span className="text-green-400 ml-2 font-bold">~$65,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HIPAA Compliance */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="h-8 w-8 text-green-400" />
            <h2 className="text-2xl font-bold text-white">HIPAA Compliance Assessment</h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-400">90%</span>
              <span className="text-sm text-gray-400">Ready</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Administrative Safeguards */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Administrative Safeguards</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white text-sm">§164.308(a)(1) - Security Officer</div>
                    <div className="text-xs text-gray-400">✅ Role defined ⚠️ Need formal appointment</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white text-sm">§164.308(a)(3) - Workforce Training</div>
                    <div className="text-xs text-gray-400">✅ Materials available ⚠️ Need formal program</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white text-sm">§164.308(a)(4) - Access Management</div>
                    <div className="text-xs text-gray-400">✅ RBAC implemented ⚠️ Need review procedures</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Safeguards */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Physical Safeguards</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white text-sm">§164.310(a)(1) - Facility Access</div>
                    <div className="text-xs text-gray-400">✅ Remote work environment ⚠️ Need workstation security</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Safeguards */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Technical Safeguards</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white text-sm">§164.312(a)(1) - Access Control</div>
                    <div className="text-xs text-gray-400">✅ Unique user ID ✅ Auto logoff ✅ Encryption</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white text-sm">§164.312(c) - Integrity</div>
                    <div className="text-xs text-gray-400">✅ Client-side processing ensures integrity</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white text-sm">§164.312(e) - Transmission Security</div>
                    <div className="text-xs text-gray-400">✅ TLS 1.3 ✅ No ePHI transmission</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HIPAA Advantages */}
          <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-4">ProofPix Architecture Benefits</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">No ePHI Storage</span>
                </div>
                <p className="text-sm text-gray-300 ml-8">Client-side processing eliminates server storage risks</p>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">Minimal Breach Risk</span>
                </div>
                <p className="text-sm text-gray-300 ml-8">No centralized ePHI database to compromise</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">Natural Compliance</span>
                </div>
                <p className="text-sm text-gray-300 ml-8">Architecture inherently meets most HIPAA requirements</p>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">Simplified Auditing</span>
                </div>
                <p className="text-sm text-gray-300 ml-8">Reduced scope due to minimal ePHI handling</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="h-8 w-8 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">Required Actions for Full Compliance</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Immediate Actions (30 days)</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <div className="font-medium text-white">Business Associate Agreements</div>
                    <div className="text-sm text-gray-400">Execute BAAs with Stripe and Netlify</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <div>
                    <div className="font-medium text-white">Formal Security Officer Appointment</div>
                    <div className="text-sm text-gray-400">Document security officer role and responsibilities</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <div>
                    <div className="font-medium text-white">Security Awareness Training</div>
                    <div className="text-sm text-gray-400">Implement formal training program</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Medium-term Actions (90 days)</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                  <div>
                    <div className="font-medium text-white">Risk Assessment Framework</div>
                    <div className="text-sm text-gray-400">Implement formal risk methodology</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">5</div>
                  <div>
                    <div className="font-medium text-white">Compliance Dashboard</div>
                    <div className="text-sm text-gray-400">Automated compliance monitoring system</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">6</div>
                  <div>
                    <div className="font-medium text-white">Audit Procedures</div>
                    <div className="text-sm text-gray-400">Comprehensive audit log system</div>
                  </div>
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

export default ComplianceChecklist; 