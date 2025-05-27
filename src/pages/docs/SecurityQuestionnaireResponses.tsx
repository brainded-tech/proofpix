import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, XCircle, Download, Search, FileText, Lock } from 'lucide-react';
import DocumentationFooter from '../../components/DocumentationFooter';

const SecurityQuestionnaireResponses: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  const handleDownload = () => {
    window.print();
  };

  const questionCategories = [
    {
      title: "Data Protection & Privacy",
      icon: <Shield className="h-6 w-6" />,
      color: "blue",
      questions: [
        {
          question: "How is customer data protected during processing?",
          answer: "Customer data is protected by the ultimate security measure - it never leaves the customer's device. All image processing occurs entirely within the user's browser using JavaScript, eliminating network transmission risks.",
          evidence: "Open source code available for verification. No server-side processing infrastructure."
        },
        {
          question: "Where is customer data stored?",
          answer: "Customer data is NOT stored anywhere. Images exist only in browser memory during processing and are automatically cleared when the session ends.",
          evidence: "Architecture review available. No database infrastructure for customer data storage."
        },
        {
          question: "How long is customer data retained?",
          answer: "Zero retention period. Customer images and metadata are never stored on our servers, eliminating data retention concerns entirely.",
          evidence: "System architecture documentation. No data retention policies needed as no data is retained."
        },
        {
          question: "How do you handle data subject rights (GDPR Article 15-22)?",
          answer: "Data subject rights are automatically satisfied: Right to access (no data stored), Right to rectification (no data to correct), Right to erasure (automatic), Right to portability (user controls export), Right to object (processing is optional).",
          evidence: "GDPR compliance assessment showing 95% automatic compliance through architecture."
        },
        {
          question: "What data is collected about users?",
          answer: "Minimal data collection: Email addresses for account management, payment information (processed by Stripe), anonymous usage analytics (via privacy-focused Plausible). No customer images or metadata are collected.",
          evidence: "Privacy policy documentation. Data flow diagrams available."
        }
      ]
    },
    {
      title: "Infrastructure & Network Security",
      icon: <Lock className="h-6 w-6" />,
      color: "green",
      questions: [
        {
          question: "What cloud infrastructure do you use?",
          answer: "Static web application hosted on Netlify CDN with global distribution. No server infrastructure for customer data processing. Authentication services use industry-standard OAuth providers.",
          evidence: "Infrastructure documentation. Netlify security certifications available."
        },
        {
          question: "How is data encrypted in transit and at rest?",
          answer: "In transit: TLS 1.3 encryption for all communications. At rest: No customer data stored, so no encryption needed. Account data encrypted using industry standards.",
          evidence: "TLS configuration documentation. No customer data storage to encrypt."
        },
        {
          question: "What network security controls are in place?",
          answer: "Content Security Policy (CSP) headers, HSTS enforcement, DDoS protection via Netlify, secure cookie settings, and XSS protection headers.",
          evidence: "Security headers configuration. Netlify security documentation."
        },
        {
          question: "How do you handle network segmentation?",
          answer: "Client-side processing eliminates need for traditional network segmentation. Web application delivery is isolated from any backend processing through CDN architecture.",
          evidence: "Architecture diagrams showing separation of concerns."
        },
        {
          question: "What is your disaster recovery plan?",
          answer: "Simplified disaster recovery due to stateless architecture. Web application can be restored from source code. No customer data to recover. Global CDN provides automatic failover.",
          evidence: "Disaster recovery documentation. Source code repository backup procedures."
        }
      ]
    },
    {
      title: "Access Control & Authentication",
      icon: <FileText className="h-6 w-6" />,
      color: "purple",
      questions: [
        {
          question: "What authentication methods do you support?",
          answer: "Multi-factor authentication (MFA), Single Sign-On (SSO) via SAML 2.0 and OAuth 2.0, role-based access control (RBAC), and secure session management with configurable timeouts.",
          evidence: "Authentication system documentation. SSO integration guides available."
        },
        {
          question: "How do you manage privileged access?",
          answer: "Minimal privileged access required due to architecture. Admin access limited to: system administration, user account management, billing, and anonymous analytics. No access to customer data (as none is stored).",
          evidence: "Privileged access documentation. Role definitions and access matrices."
        },
        {
          question: "What is your password policy?",
          answer: "Strong password requirements enforced: minimum 12 characters, complexity requirements, no password reuse, MFA required for all accounts, regular password rotation encouraged.",
          evidence: "Password policy documentation. Authentication system configuration."
        },
        {
          question: "How do you handle user provisioning and deprovisioning?",
          answer: "Automated user lifecycle management through SSO integration. Immediate access revocation upon deprovisioning. No customer data access to revoke due to architecture.",
          evidence: "User management procedures. SSO integration documentation."
        },
        {
          question: "What audit logging is in place for access?",
          answer: "Comprehensive audit logging for: authentication events, administrative actions, system access, and configuration changes. Customer data access logging not needed (no customer data stored).",
          evidence: "Audit logging configuration. Sample audit reports available."
        }
      ]
    },
    {
      title: "Compliance & Governance",
      icon: <Search className="h-6 w-6" />,
      color: "yellow",
      questions: [
        {
          question: "What compliance certifications do you have?",
          answer: "GDPR compliant (95% ready), CCPA compliant (95% ready), HIPAA ready (90% compliant), SOC 2 Type II in progress (85% ready, 6 months to completion), ISO 27001 preparation underway (80% ready).",
          evidence: "Compliance assessment reports. Certification roadmap and timeline."
        },
        {
          question: "How do you handle regulatory audits?",
          answer: "Simplified audit process due to minimal data handling. Comprehensive documentation available, open source code for verification, and reduced audit scope due to no customer data storage.",
          evidence: "Audit preparation documentation. Previous audit reports (when available)."
        },
        {
          question: "What is your data governance framework?",
          answer: "Privacy-by-design architecture eliminates most data governance complexity. Clear data classification (no customer data), minimal data collection policies, and automatic compliance with privacy regulations.",
          evidence: "Data governance documentation. Privacy impact assessments."
        },
        {
          question: "How do you handle cross-border data transfers?",
          answer: "No cross-border data transfer issues as customer data never leaves the user's device. Only account management data (email, billing) subject to standard transfer protections.",
          evidence: "Data flow documentation. Cross-border transfer assessment."
        },
        {
          question: "What is your incident response plan?",
          answer: "Comprehensive incident response plan with defined roles, escalation procedures, and communication protocols. Simplified due to no customer data exposure risk.",
          evidence: "Incident response documentation. Contact information for security team."
        }
      ]
    },
    {
      title: "Vendor & Third-Party Risk",
      icon: <Shield className="h-6 w-6" />,
      color: "red",
      questions: [
        {
          question: "What third-party services do you use?",
          answer: "Netlify (hosting/CDN), Stripe (payment processing), Plausible (privacy-focused analytics), GitHub (source code), and standard OAuth providers (authentication). All vendors vetted for security.",
          evidence: "Vendor assessment documentation. Third-party security certifications."
        },
        {
          question: "How do you assess third-party security?",
          answer: "Formal vendor security assessment process including security questionnaires, certification review, contract security requirements, and ongoing monitoring.",
          evidence: "Vendor assessment procedures. Third-party security documentation."
        },
        {
          question: "What data do third parties have access to?",
          answer: "Netlify: No customer data (static hosting only). Stripe: Payment data only (PCI DSS compliant). Plausible: Anonymous usage data only. GitHub: Source code only. OAuth providers: Authentication tokens only.",
          evidence: "Data sharing agreements. Third-party data access documentation."
        },
        {
          question: "How do you monitor third-party compliance?",
          answer: "Regular review of third-party certifications, security updates monitoring, contract compliance verification, and incident notification requirements.",
          evidence: "Third-party monitoring procedures. Compliance tracking documentation."
        },
        {
          question: "What happens if a third-party has a security incident?",
          answer: "Incident response procedures include third-party incident assessment, customer notification if required, and service continuity planning. Customer data exposure risk is minimal due to architecture.",
          evidence: "Third-party incident response procedures. Business continuity plans."
        }
      ]
    },
    {
      title: "Security Operations & Monitoring",
      icon: <Search className="h-6 w-6" />,
      color: "orange",
      questions: [
        {
          question: "What security monitoring is in place?",
          answer: "Real-time security monitoring via Netlify, automated threat detection, security event logging, vulnerability scanning, and continuous security posture assessment.",
          evidence: "Security monitoring configuration. Sample security reports."
        },
        {
          question: "How do you handle vulnerability management?",
          answer: "Automated vulnerability scanning, regular security updates, dependency monitoring, penetration testing (annual), and responsible disclosure program.",
          evidence: "Vulnerability management procedures. Recent security assessment reports."
        },
        {
          question: "What is your security incident response time?",
          answer: "Critical incidents: 1 hour response, 4 hour resolution target. High incidents: 4 hour response, 24 hour resolution target. Medium/Low: 24/72 hour response respectively.",
          evidence: "Incident response SLA documentation. Historical incident response metrics."
        },
        {
          question: "How do you perform security testing?",
          answer: "Regular penetration testing, automated security scanning, code security reviews, dependency vulnerability scanning, and open source security auditing.",
          evidence: "Security testing procedures. Recent penetration test reports."
        },
        {
          question: "What security training do you provide?",
          answer: "Mandatory security awareness training for all employees, role-specific security training, regular security updates, and incident response training.",
          evidence: "Security training documentation. Training completion records."
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
      green: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400" },
      purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
      yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" },
      red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
      orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" }
    };
    return colors[color as keyof typeof colors];
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
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300">
                Security Q&A
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Security Questionnaire Responses
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive answers to standard enterprise security questions
          </p>
          <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-green-300 font-medium">
              Pre-answered responses to accelerate your security review process
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Executive Summary</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-lg font-semibold text-white mb-1">Risk Reduction</div>
              <div className="text-sm text-gray-400">vs traditional SaaS platforms</div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
              <div className="text-lg font-semibold text-white mb-1">Customer Data Stored</div>
              <div className="text-sm text-gray-400">Zero server-side storage</div>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-lg font-semibold text-white mb-1">Client Processing</div>
              <div className="text-sm text-gray-400">Browser-based architecture</div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-300 font-medium text-center">
              ProofPix's revolutionary architecture eliminates most traditional security concerns by processing all customer data client-side, never storing or transmitting sensitive information.
            </p>
          </div>
        </div>

        {/* Question Categories */}
        {questionCategories.map((category, categoryIndex) => {
          const colorClasses = getColorClasses(category.color);
          
          return (
            <div key={categoryIndex} className={`${colorClasses.bg} ${colorClasses.border} border rounded-lg p-8 mb-8`}>
              <div className="flex items-center space-x-3 mb-6">
                <div className={colorClasses.text}>
                  {category.icon}
                </div>
                <h2 className={`text-2xl font-bold ${colorClasses.text}`}>
                  {category.title}
                </h2>
              </div>
              
              <div className="space-y-6">
                {category.questions.map((qa, qaIndex) => (
                  <div key={qaIndex} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Q: {qa.question}
                    </h3>
                    
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                      <p className="text-green-300 font-medium mb-2">Answer:</p>
                      <p className="text-gray-300">{qa.answer}</p>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-blue-300 font-medium mb-2">Supporting Evidence:</p>
                      <p className="text-gray-400 text-sm">{qa.evidence}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Additional Information */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Additional Security Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Security Certifications in Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">SOC 2 Type II</span>
                  <span className="text-yellow-400">6 months to completion</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">ISO 27001</span>
                  <span className="text-blue-400">Planned 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">GDPR Certification</span>
                  <span className="text-green-400">Ready for assessment</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">HIPAA Compliance</span>
                  <span className="text-green-400">Architecture compliant</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Security Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Security Team:</span>
                  <span className="text-blue-400 ml-2">security@proofpixapp.com</span>
                </div>
                <div>
                  <span className="text-gray-400">Compliance Team:</span>
                  <span className="text-blue-400 ml-2">compliance@proofpixapp.com</span>
                </div>
                <div>
                  <span className="text-gray-400">Incident Response:</span>
                  <span className="text-blue-400 ml-2">incident@proofpixapp.com</span>
                </div>
                <div>
                  <span className="text-gray-400">Vulnerability Reports:</span>
                  <span className="text-blue-400 ml-2">security@proofpixapp.com</span>
                </div>
                <div>
                  <span className="text-gray-400">PGP Key:</span>
                  <span className="text-gray-400 ml-2">Available on request</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">How to Use This Document</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-3">For Sales Teams:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Use responses to pre-fill customer security questionnaires</li>
                <li>• Reference specific sections during security discussions</li>
                <li>• Highlight architectural advantages in proposals</li>
                <li>• Connect customers with security team for detailed questions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-3">For Customers:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Review responses relevant to your security requirements</li>
                <li>• Request additional documentation as needed</li>
                <li>• Schedule technical security discussions</li>
                <li>• Validate claims through independent security assessment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </div>
  );
};

export default SecurityQuestionnaireResponses; 