import React from 'react';
import { Shield, Lock, CheckCircle, AlertTriangle, FileText, Users, Globe, Server } from 'lucide-react';

const EnterpriseSecurity: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Shield className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Enterprise Security & Compliance</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          ProofPix provides enterprise-grade security and compliance features designed for organizations 
          with strict data governance and regulatory requirements.
        </p>
      </div>

      {/* Key Security Advantages */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
          <Lock className="h-6 w-6 text-blue-600 mr-2" />
          Privacy-First Architecture
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Zero Data Storage</h3>
                <p className="text-gray-600 text-sm">Images never leave your device - all processing happens locally</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Client-Side Processing</h3>
                <p className="text-gray-600 text-sm">No server-side image processing eliminates data transfer risks</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Open Source</h3>
                <p className="text-gray-600 text-sm">Fully auditable codebase builds trust and transparency</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Privacy by Design</h3>
                <p className="text-gray-600 text-sm">Built with privacy as the foundational principle</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Standards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          Regulatory Compliance
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* GDPR */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">GDPR Compliant</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Data protection by design</li>
              <li>• Automatic data deletion</li>
              <li>• Data subject rights implementation</li>
              <li>• No international data transfers</li>
            </ul>
          </div>

          {/* CCPA */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">CCPA Compliant</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• No personal data sales</li>
              <li>• Transparent privacy practices</li>
              <li>• Consumer rights implementation</li>
              <li>• Opt-out mechanisms</li>
            </ul>
          </div>

          {/* HIPAA */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">HIPAA Ready</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Business Associate Agreements</li>
              <li>• Technical safeguards</li>
              <li>• Administrative controls</li>
              <li>• Audit logging</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Certifications */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Shield className="h-6 w-6 text-blue-600 mr-2" />
          Security Certifications
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* SOC 2 */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">SOC 2 Type II</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">In Progress</span>
            </div>
            <p className="text-gray-600 text-sm">
              Currently undergoing SOC 2 Type II audit with completion expected in 7 months. 
              Covers security, availability, processing integrity, confidentiality, and privacy.
            </p>
            <div className="text-sm text-gray-500">
              <strong>Timeline:</strong> 7-month certification process<br/>
              <strong>Auditor:</strong> Independent third-party firm<br/>
              <strong>Investment:</strong> $50,000+ compliance infrastructure
            </div>
          </div>

          {/* ISO 27001 */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">ISO 27001</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Planned</span>
            </div>
            <p className="text-gray-600 text-sm">
              Information Security Management System (ISMS) framework implementation planned. 
              Comprehensive security controls and continuous improvement process.
            </p>
            <div className="text-sm text-gray-500">
              <strong>Scope:</strong> All ProofPix systems and processes<br/>
              <strong>Controls:</strong> 93 security controls implemented<br/>
              <strong>Review:</strong> Quarterly management reviews
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          Enterprise Features
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Security Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Security Controls</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>TLS 1.3 encryption for all communications</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Role-based access controls (RBAC)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Comprehensive audit logging</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Automated vulnerability scanning</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Session timeout and automatic logoff</span>
              </li>
            </ul>
          </div>

          {/* API Security */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">API Security</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>OAuth 2.0 / JWT token authentication</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Configurable rate limiting</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>IP whitelisting capabilities</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Secure API key management</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>API key rotation policies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Deployment Options */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Server className="h-6 w-6 text-blue-600 mr-2" />
          Deployment Options
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 text-center space-y-2">
            <Globe className="h-8 w-8 text-blue-600 mx-auto" />
            <h3 className="font-medium text-gray-900">Cloud Hosting</h3>
            <p className="text-sm text-gray-600">Managed deployment on enterprise infrastructure</p>
          </div>
          <div className="border rounded-lg p-4 text-center space-y-2">
            <Server className="h-8 w-8 text-green-600 mx-auto" />
            <h3 className="font-medium text-gray-900">On-Premises</h3>
            <p className="text-sm text-gray-600">Self-hosted deployment with support</p>
          </div>
          <div className="border rounded-lg p-4 text-center space-y-2">
            <Users className="h-8 w-8 text-purple-600 mx-auto" />
            <h3 className="font-medium text-gray-900">Hybrid</h3>
            <p className="text-sm text-gray-600">Cloud and on-premises combination</p>
          </div>
          <div className="border rounded-lg p-4 text-center space-y-2">
            <Lock className="h-8 w-8 text-red-600 mx-auto" />
            <h3 className="font-medium text-gray-900">Air-Gapped</h3>
            <p className="text-sm text-gray-600">Completely isolated deployment</p>
          </div>
        </div>
      </div>

      {/* Vendor Security */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Third-Party Security Assessment</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Service</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Security Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Certifications</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Stripe</td>
                <td className="px-4 py-3 text-sm text-gray-600">Payment Processing</td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Excellent</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">SOC 2, PCI DSS Level 1, ISO 27001</td>
                <td className="px-4 py-3 text-sm text-gray-600">GDPR, CCPA, HIPAA BAA</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Netlify</td>
                <td className="px-4 py-3 text-sm text-gray-600">Hosting Infrastructure</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Good</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">SOC 2 Type II</td>
                <td className="px-4 py-3 text-sm text-gray-600">GDPR, BAA Available</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Plausible</td>
                <td className="px-4 py-3 text-sm text-gray-600">Privacy Analytics</td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Excellent</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">Open Source</td>
                <td className="px-4 py-3 text-sm text-gray-600">GDPR Native (EU-based)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Enterprise Security Contacts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Security Team</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Security Engineer: <a href="mailto:security@proofpixapp.com" className="text-blue-600 hover:underline">security@proofpixapp.com</a></li>
              <li>Compliance Team: <a href="mailto:compliance@proofpixapp.com" className="text-blue-600 hover:underline">compliance@proofpixapp.com</a></li>
              <li>Incident Response: <a href="mailto:incident@proofpixapp.com" className="text-blue-600 hover:underline">incident@proofpixapp.com</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Privacy & Legal</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Privacy Officer: <a href="mailto:privacy@proofpixapp.com" className="text-blue-600 hover:underline">privacy@proofpixapp.com</a></li>
              <li>Legal Team: <a href="mailto:legal@proofpixapp.com" className="text-blue-600 hover:underline">legal@proofpixapp.com</a></li>
              <li>Enterprise Support: <a href="mailto:enterprise@proofpixapp.com" className="text-blue-600 hover:underline">enterprise@proofpixapp.com</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 pt-8">
        <h2 className="text-2xl font-semibold text-gray-900">Ready for Enterprise Deployment?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Contact our enterprise team to discuss your specific security and compliance requirements, 
          custom deployment options, and Business Associate Agreements.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="mailto:enterprise@proofpixapp.com" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Enterprise Sales
          </a>
          <a 
            href="/docs/api"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View API Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseSecurity; 