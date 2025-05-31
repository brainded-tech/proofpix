import React, { useState } from 'react';
import { Shield, FileText, Users, Lock, Gavel, Info } from 'lucide-react';
import { ChainOfCustodyDemo } from '../components/security/ChainOfCustodyDemo';
import { ChainOfCustody } from '../components/security/ChainOfCustody';
import { MultiSignatureCustody } from '../components/security/MultiSignatureCustody';
import { ComplianceMonitor } from '../components/security/ComplianceMonitor';
import { LegalTemplates } from '../components/legal/LegalTemplates';

export const ChainOfCustodyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'demo' | 'all-files' | 'info'>('demo');

  // Check user tier for access control
  const userTier = localStorage.getItem('proofpix_user_tier') || 'free';
  const hasAccess = userTier === 'pro' || userTier === 'enterprise';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Chain of Custody - Pro Feature
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Chain of custody tracking is available for Pro and Enterprise users. 
              This feature provides cryptographic verification, legal compliance, 
              and court-admissible documentation for digital evidence.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Cryptographic Security</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">SHA-256 hashing and integrity verification</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <Gavel className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Legal Compliance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">FRE, FRCP, HIPAA framework support</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Court Reports</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Automated admissibility scoring</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Chain of Custody
            </h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
              Enterprise Legal
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Comprehensive digital evidence tracking with cryptographic verification, 
            legal compliance monitoring, and court-admissible documentation for 
            enterprise legal and forensic workflows.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'demo', label: 'Live Demo', icon: Shield, description: 'Interactive demonstration' },
                { id: 'all-files', label: 'All Files', icon: FileText, description: 'View all custody logs' },
                { id: 'info', label: 'Information', icon: Info, description: 'Feature overview' }
              ].map(({ id, label, icon: Icon, description }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <div>{label}</div>
                    <div className="text-xs opacity-75">{description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'demo' && <ChainOfCustodyDemo />}
          
          {activeTab === 'all-files' && (
            <div className="space-y-6">
              <ChainOfCustody showAllFiles={true} />
              
              {/* Multi-Signature Custody */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Multi-Signature Custody Management
                </h3>
                <MultiSignatureCustody fileId="all_files" />
              </div>

              {/* Compliance Monitor */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Compliance Monitoring
                </h3>
                <ComplianceMonitor showAllFiles={true} />
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-8">
              {/* Feature Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Chain of Custody Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Cryptographic Integrity</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          SHA-256 hashing ensures file integrity and detects any unauthorized modifications
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">User Tracking</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Complete audit trail of who accessed files, when, and from where
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Gavel className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Legal Compliance</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Meets Federal Rules of Evidence (FRE) and other legal framework requirements
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-orange-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Court-Ready Reports</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Automated generation of court-admissible documentation and reports
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Lock className="w-5 h-5 text-red-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Tamper Detection</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Real-time verification and alerts for any integrity violations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-indigo-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Digital Signatures</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Cryptographic signatures for enhanced authenticity and non-repudiation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Frameworks */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Supported Legal Frameworks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'FRE', full: 'Federal Rules of Evidence', description: 'US federal court evidence standards' },
                    { name: 'FRCP', full: 'Federal Rules of Civil Procedure', description: 'Civil litigation procedures' },
                    { name: 'HIPAA', full: 'Health Insurance Portability', description: 'Healthcare data protection' },
                    { name: 'SOX', full: 'Sarbanes-Oxley Act', description: 'Financial compliance requirements' }
                  ].map((framework) => (
                    <div key={framework.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">{framework.name}</h3>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{framework.full}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{framework.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Common Use Cases
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Legal Evidence</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Track digital evidence for litigation, ensuring admissibility in court proceedings
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Forensic Investigation</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Maintain integrity of digital evidence during forensic analysis and investigation
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Compliance Auditing</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Document handling procedures for regulatory compliance and audit requirements
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Insurance Claims</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Provide verifiable documentation for insurance claim investigations
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Technical Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Cryptographic Standards</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>• SHA-256 file hashing</li>
                      <li>• RSA-2048 digital signatures</li>
                      <li>• AES-256 encryption for storage</li>
                      <li>• RFC 3161 timestamping</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Export Formats</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>• JSON structured data</li>
                      <li>• XML legal documentation</li>
                      <li>• PDF court-ready reports</li>
                      <li>• CSV audit logs</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Legal Templates Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Legal Document Templates
                </h3>
                <LegalTemplates />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 