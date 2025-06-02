import React, { useState } from 'react';
import { Shield, FileText, Users, Lock, Gavel, Info, User, LogIn } from 'lucide-react';
import { ChainOfCustodyDemo } from '../components/security/ChainOfCustodyDemo';
import { ChainOfCustody } from '../components/security/ChainOfCustody';
import { MultiSignatureCustody } from '../components/security/MultiSignatureCustody';
import { ComplianceMonitor } from '../components/security/ComplianceMonitor';
import { LegalTemplates } from '../components/legal/LegalTemplates';
import { useMockAuth } from '../services/mockAuthService';

export const ChainOfCustodyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'demo' | 'all-files' | 'info'>('demo');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Use mock authentication service
  const { isAuthenticated, user, loading, login, loginWithGoogle, logout, hasFeatureAccess, getMockUsers } = useMockAuth();

  // Check if user has access to Chain of Custody
  const hasAccess = hasFeatureAccess('chain-of-custody');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const result = await login(loginEmail);
    if (result.success) {
      setShowLoginForm(false);
      setLoginEmail('');
    } else {
      setLoginError(result.error || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError('');
    const result = await loginWithGoogle();
    if (!result.success) {
      setLoginError(result.error || 'Google login failed');
    }
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-8 text-center">
            <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">
              Chain of Custody - Pro Feature
            </h1>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Chain of custody tracking is available for Pro and Enterprise users. 
              This feature provides cryptographic verification, legal compliance, 
              and court-admissible documentation for digital evidence.
            </p>

            {!isAuthenticated ? (
              <div className="space-y-6">
                <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Sign In to Access Chain of Custody
                  </h3>
                  
                  {!showLoginForm ? (
            <div className="space-y-4">
                      <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full max-w-sm mx-auto flex items-center justify-center px-6 py-3 border border-slate-500 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                        ) : (
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        )}
                        Sign in with Google (Demo)
                      </button>
                      
                      <div className="text-slate-400 text-sm">or</div>
                      
                      <button
                        onClick={() => setShowLoginForm(true)}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Sign in with email (No password required)
                      </button>
                      
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-slate-300 font-medium">Quick Login (Click to sign in instantly):</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            onClick={() => login('pro@proofpixapp.com')}
                            className="px-3 py-1 bg-blue-600 text-blue-100 rounded text-sm hover:bg-blue-500 transition-colors"
                          >
                            Pro User
                          </button>
                          <button
                            onClick={() => login('enterprise@proofpixapp.com')}
                            className="px-3 py-1 bg-purple-600 text-purple-100 rounded text-sm hover:bg-purple-500 transition-colors"
                          >
                            Enterprise User
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="Enter email address"
                          className="w-full max-w-sm mx-auto px-4 py-2 border border-slate-500 bg-slate-600 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      {loginError && (
                        <p className="text-red-400 text-sm">{loginError}</p>
                      )}
                      <div className="flex gap-3 justify-center">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLoginForm(false)}
                          className="px-6 py-2 border border-slate-500 text-slate-300 rounded-lg hover:bg-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                  
                  <div className="mt-6 p-4 bg-slate-600 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Test Accounts (No Password Required):</h4>
                    <div className="text-sm text-slate-300 space-y-2">
                      <p className="text-xs text-slate-400 mb-3">Simply enter one of these email addresses above - no password needed!</p>
                      {getMockUsers().map(mockUser => (
                        <div key={mockUser.id} className="flex justify-between items-center p-2 bg-slate-700 rounded border border-slate-600">
                          <span className="font-mono text-sm text-slate-200">{mockUser.email}</span>
                          <span className={`px-2 py-1 text-xs rounded font-medium capitalize ${
                            mockUser.tier === 'enterprise' ? 'bg-purple-600 text-purple-100' :
                            mockUser.tier === 'pro' ? 'bg-blue-600 text-blue-100' :
                            'bg-slate-500 text-slate-100'
                          }`}>
                            {mockUser.tier}
                          </span>
                        </div>
                      ))}
                      <p className="text-xs text-green-400 mt-2">
                        ✓ Pro and Enterprise accounts have Chain of Custody access
                      </p>
                </div>
                </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-amber-900 border border-amber-700 rounded-lg p-6">
                  <h3 className="font-medium text-amber-100 mb-1">Upgrade Required</h3>
                  <p className="text-amber-200 mb-4">
                    You're signed in as <strong>{user?.name}</strong> ({user?.tier} tier), but Chain of Custody requires a Pro or Enterprise account.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Upgrade to Pro
              </button>
                    <button
                      onClick={logout}
                      className="px-6 py-2 border border-slate-500 text-slate-300 rounded-lg hover:bg-slate-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
            </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">
              Chain of Custody
            </h1>
              <span className="px-3 py-1 bg-blue-600 text-blue-100 text-sm rounded-full">
              Enterprise Legal
            </span>
            </div>
            
            {/* User Profile Indicator */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-slate-400 capitalize">{user.tier} Account</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-slate-200"
                  title="Sign Out"
                >
                  <LogIn className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <p className="text-slate-300 max-w-3xl">
            Comprehensive digital evidence tracking with cryptographic verification, 
            legal compliance monitoring, and court-admissible documentation for 
            enterprise legal and forensic workflows.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg mb-6">
          <div className="border-b border-slate-700">
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
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
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