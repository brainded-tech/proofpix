import React from 'react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';

const SecurityComplianceGuide: React.FC = () => {
  return (
    <EnterpriseLayout
      showHero
      title="Security & Compliance Technical Guide"
      description="Comprehensive security architecture and compliance framework documentation"
      maxWidth="6xl"
      backgroundColor="dark"
    >
      <div className="prose prose-invert max-w-none">
        <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700/50">
          <h1 className="text-3xl font-bold text-emerald-400 mb-6">
            Security & Compliance - Technical Guide
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Overview</h2>
              <p className="text-slate-300 mb-4">
                ProofPix implements a comprehensive security-first architecture with multi-layered 
                protection, end-to-end encryption, and compliance with major regulatory frameworks 
                including GDPR, HIPAA, SOX, and CCPA. Our security system spans over 1,273 lines 
                of sophisticated security logic and compliance controls.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Privacy-First Architecture</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Zero-Knowledge Processing</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Client-side encryption before upload</li>
                    <li>• Server-side processing without decryption</li>
                    <li>• Encrypted metadata extraction</li>
                    <li>• Secure key management (HSM)</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Data Minimization</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Selective metadata extraction</li>
                    <li>• Automatic data purging</li>
                    <li>• Configurable retention policies</li>
                    <li>• Right to be forgotten compliance</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Encryption Standards</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• AES-256-GCM for data at rest</li>
                    <li>• TLS 1.3 for data in transit</li>
                    <li>• RSA-4096 for key exchange</li>
                    <li>• Perfect Forward Secrecy (PFS)</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Access Controls</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Role-Based Access Control (RBAC)</li>
                    <li>• Multi-Factor Authentication (MFA)</li>
                    <li>• Zero-trust network architecture</li>
                    <li>• Principle of least privilege</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Compliance Frameworks</h2>
              <div className="space-y-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">GDPR Compliance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">Data Protection Rights</h4>
                      <ul className="text-slate-400 text-sm space-y-1">
                        <li>• Right to access</li>
                        <li>• Right to rectification</li>
                        <li>• Right to erasure</li>
                        <li>• Right to data portability</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">Technical Measures</h4>
                      <ul className="text-slate-400 text-sm space-y-1">
                        <li>• Privacy by design</li>
                        <li>• Data protection impact assessments</li>
                        <li>• Breach notification system</li>
                        <li>• Consent management</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">HIPAA Compliance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">Administrative Safeguards</h4>
                      <ul className="text-slate-400 text-sm space-y-1">
                        <li>• Security officer designation</li>
                        <li>• Workforce training</li>
                        <li>• Access management procedures</li>
                        <li>• Incident response plan</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">Technical Safeguards</h4>
                      <ul className="text-slate-400 text-sm space-y-1">
                        <li>• Unique user identification</li>
                        <li>• Automatic logoff</li>
                        <li>• Encryption and decryption</li>
                        <li>• Audit controls</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">SOX Compliance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">Financial Controls</h4>
                      <ul className="text-slate-400 text-sm space-y-1">
                        <li>• Document integrity verification</li>
                        <li>• Audit trail maintenance</li>
                        <li>• Change management controls</li>
                        <li>• Financial data protection</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-2">IT General Controls</h4>
                      <ul className="text-slate-400 text-sm space-y-1">
                        <li>• Access controls</li>
                        <li>• Change management</li>
                        <li>• Computer operations</li>
                        <li>• System development</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Threat Detection & Response</h2>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">Advanced Threat Protection</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-200">Real-time Monitoring</h4>
                    <p className="text-slate-400">24/7 security monitoring with AI-powered anomaly detection</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Incident Response</h4>
                    <p className="text-slate-400">Automated incident response with escalation procedures</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Vulnerability Management</h4>
                    <p className="text-slate-400">Continuous vulnerability scanning and patch management</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Penetration Testing</h4>
                    <p className="text-slate-400">Regular third-party security assessments and penetration testing</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Audit & Logging</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Comprehensive Logging</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• All user actions logged</li>
                    <li>• System events tracking</li>
                    <li>• API access logging</li>
                    <li>• Security events monitoring</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Audit Trail Features</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Immutable audit logs</li>
                    <li>• Digital signatures</li>
                    <li>• Timestamp verification</li>
                    <li>• Chain of custody tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Security Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-2">SOC 2 Type II</div>
                  <div className="text-slate-300 text-sm">Security & Availability</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-2">ISO 27001</div>
                  <div className="text-slate-300 text-sm">Information Security</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-2">FedRAMP</div>
                  <div className="text-slate-300 text-sm">Government Ready</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Implementation Guide</h2>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">Security Configuration</h3>
                <ol className="text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Configure encryption keys and certificates</li>
                  <li>Set up access control policies and roles</li>
                  <li>Enable audit logging and monitoring</li>
                  <li>Configure compliance frameworks</li>
                  <li>Set up incident response procedures</li>
                  <li>Implement backup and disaster recovery</li>
                  <li>Conduct security testing and validation</li>
                </ol>
              </div>
            </section>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default SecurityComplianceGuide; 