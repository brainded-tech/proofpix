import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, CheckCircle, AlertTriangle, FileText, Users, Globe, HelpCircle, ArrowLeft } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

const SecurityFAQ: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  const faqSections = [
    {
      title: "Data Security & Privacy",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      questions: [
        {
          question: "Where is our data stored and processed?",
          answer: "ProofPix uses a privacy-first architecture where ALL image processing happens locally on your device. No images or metadata are ever transmitted to our servers. This eliminates data storage risks and ensures complete privacy control."
        },
        {
          question: "How does ProofPix ensure GDPR compliance?",
          answer: "ProofPix is GDPR compliant by design: (1) No personal data collection or processing on servers, (2) Data minimization - only essential metadata is extracted, (3) Right to erasure is automatic (local storage only), (4) Privacy by design architecture, (5) No international data transfers, (6) Transparent privacy practices with clear consent mechanisms."
        },
        {
          question: "Is ProofPix HIPAA compliant for healthcare organizations?",
          answer: "Yes, ProofPix supports HIPAA compliance through: (1) Business Associate Agreements available, (2) Technical safeguards (encryption, access controls, audit logs), (3) Administrative safeguards (security policies, training), (4) Physical safeguards (no server-side PHI storage), (5) Local processing eliminates PHI transmission risks."
        },
        {
          question: "What happens to our data when we stop using ProofPix?",
          answer: "Since ProofPix processes everything locally, there's no data to delete from our servers. Any local data (session tokens, preferences) is automatically cleared when you close the application. For enterprise accounts, we can provide data export tools and account closure procedures."
        }
      ]
    },
    {
      title: "Enterprise Security Controls",
      icon: <Lock className="h-6 w-6 text-green-600" />,
      questions: [
        {
          question: "What authentication methods does ProofPix support?",
          answer: "ProofPix supports multiple enterprise authentication methods: (1) OAuth 2.0 / JWT tokens, (2) API key authentication with rotation, (3) Single Sign-On (SSO) integration, (4) Multi-factor authentication (MFA), (5) IP whitelisting for enterprise accounts, (6) Role-based access controls (RBAC)."
        },
        {
          question: "How does ProofPix handle API security and rate limiting?",
          answer: "Our API implements comprehensive security controls: (1) TLS 1.3 encryption for all communications, (2) Rate limiting per plan (Free: 10 req/min, Enterprise: Custom), (3) Request validation and sanitization, (4) Security headers (CSP, HSTS, etc.), (5) API key rotation policies, (6) Comprehensive audit logging."
        },
        {
          question: "What deployment options are available for enterprise customers?",
          answer: "Enterprise customers have multiple deployment options: (1) Cloud hosting on enterprise infrastructure, (2) On-premises deployment with full support, (3) Hybrid cloud/on-premises configurations, (4) Air-gapped deployments for sensitive environments, (5) Custom domain and branding options."
        },
        {
          question: "How does ProofPix ensure service availability and reliability?",
          answer: "ProofPix maintains high availability through: (1) CDN distribution for global performance, (2) Redundant infrastructure with 99.9% uptime SLA, (3) Automated monitoring and alerting, (4) Disaster recovery procedures, (5) Regular security and performance audits, (6) 24/7 enterprise support."
        }
      ]
    },
    {
      title: "Compliance & Certifications",
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      questions: [
        {
          question: "What compliance certifications does ProofPix have?",
          answer: "Current and planned certifications: (1) GDPR Compliant ✅, (2) CCPA Compliant ✅, (3) HIPAA Ready ✅, (4) SOC 2 Type II (In Progress - 7 months), (5) ISO 27001 (Planned), (6) Regular third-party security audits, (7) Vendor security assessments completed."
        },
        {
          question: "How often does ProofPix undergo security audits?",
          answer: "ProofPix follows a comprehensive audit schedule: (1) Annual third-party security audits, (2) Quarterly internal security reviews, (3) Monthly vulnerability assessments, (4) Continuous automated security monitoring, (5) SOC 2 Type II audit currently in progress, (6) Vendor security assessments updated annually."
        },
        {
          question: "Can ProofPix provide compliance documentation for our audits?",
          answer: "Yes, we provide comprehensive compliance documentation: (1) Security control matrices, (2) Data processing agreements, (3) Business Associate Agreements (HIPAA), (4) Vendor security assessments, (5) Compliance certificates and reports, (6) Risk assessment documentation, (7) Incident response procedures."
        },
        {
          question: "How does ProofPix handle regulatory changes and updates?",
          answer: "We maintain compliance through: (1) Dedicated compliance team monitoring regulatory changes, (2) Quarterly compliance reviews and updates, (3) Legal team consultation on new regulations, (4) Proactive policy updates, (5) Customer notification of compliance changes, (6) Regular training for all team members."
        }
      ]
    },
    {
      title: "Incident Response & Support",
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      questions: [
        {
          question: "What is ProofPix's incident response procedure?",
          answer: "Our 3-tier incident response system: (1) Critical incidents (1 hour response): Data breaches, system compromise, service unavailability, (2) High priority (4 hours): API vulnerabilities, authentication issues, performance degradation, (3) Medium priority (24 hours): Documentation issues, minor bugs, feature requests. All incidents include immediate notification and detailed post-incident reports."
        },
        {
          question: "How does ProofPix communicate security incidents to customers?",
          answer: "Security incident communication follows strict protocols: (1) Immediate notification for critical incidents affecting customer data, (2) 24-hour notification for material service impacts, (3) Transparent disclosure of incident details and remediation, (4) Regular updates throughout incident resolution, (5) Post-incident reports with lessons learned, (6) Regulatory notifications as required."
        },
        {
          question: "What support is available for enterprise customers?",
          answer: "Enterprise customers receive premium support: (1) Dedicated account manager, (2) 24/7 technical support, (3) Priority incident response, (4) Custom deployment assistance, (5) Compliance consultation, (6) Regular security briefings, (7) Direct access to security and engineering teams."
        },
        {
          question: "How can we report security vulnerabilities or concerns?",
          answer: "Security reporting channels: (1) Security team: security@proofpixapp.com, (2) Incident response: incident@proofpixapp.com, (3) Privacy concerns: privacy@proofpixapp.com, (4) Responsible disclosure program, (5) Bug bounty program for verified vulnerabilities, (6) Encrypted communication available for sensitive reports."
        }
      ]
    },
    {
      title: "Third-Party Integrations",
      icon: <Globe className="h-6 w-6 text-orange-600" />,
      questions: [
        {
          question: "How does ProofPix vet third-party vendors and services?",
          answer: "Our vendor security assessment process includes: (1) Comprehensive security questionnaires, (2) Compliance certification verification, (3) Regular security reviews and updates, (4) Contract terms alignment with our security standards, (5) Exit strategy planning, (6) Current vendors: Stripe (Excellent), Netlify (Good), Plausible (Excellent)."
        },
        {
          question: "What third-party services does ProofPix use and why?",
          answer: "ProofPix uses minimal, carefully vetted services: (1) Stripe for payment processing (PCI DSS Level 1, SOC 2, ISO 27001), (2) Netlify for hosting infrastructure (SOC 2 Type II), (3) Plausible for privacy-focused analytics (GDPR native, EU-based), (4) All vendors undergo annual security assessments."
        },
        {
          question: "Can ProofPix integrate with our existing security infrastructure?",
          answer: "Yes, ProofPix supports enterprise integrations: (1) SSO integration with major providers (Okta, Azure AD, Google Workspace), (2) SIEM integration for security monitoring, (3) API integration with security tools, (4) Custom authentication providers, (5) Audit log integration, (6) Compliance reporting integration."
        },
        {
          question: "How does ProofPix ensure supply chain security?",
          answer: "Supply chain security measures include: (1) Minimal dependency footprint, (2) Regular dependency vulnerability scanning, (3) Automated security updates, (4) Vendor risk assessments, (5) Open source component auditing, (6) Secure development lifecycle practices, (7) Code signing and integrity verification."
        }
      ]
    }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Enterprise Security FAQ"
      description="Comprehensive answers to security, compliance, and privacy questions"
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
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Enterprise Security FAQ</h1>
            <p className="text-xl text-slate-600 mt-2">
              Comprehensive answers to security, compliance, and privacy questions
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<HelpCircle className="enterprise-icon-sm" />}>
            Security FAQ
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<Shield className="enterprise-icon-sm" />}>
            Enterprise Ready
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<CheckCircle className="enterprise-icon-sm" />}>
            Compliance Focused
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Navigation */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {faqSections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="flex items-center space-x-2 p-3 bg-white rounded-lg border hover:border-blue-300 transition-colors"
              >
                {section.icon}
                <span className="text-sm font-medium text-slate-700">{section.title}</span>
              </a>
            ))}
          </div>
        </EnterpriseCard>

        {/* FAQ Sections */}
        {faqSections.map((section, sectionIndex) => (
          <div key={sectionIndex} id={`section-${sectionIndex}`} className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              {section.icon}
              <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
            </div>
            
            <div className="space-y-4">
              {section.questions.map((faq, faqIndex) => (
                <EnterpriseCard key={faqIndex}>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-3 mt-1 flex-shrink-0">
                      Q{sectionIndex + 1}.{faqIndex + 1}
                    </span>
                    {faq.question}
                  </h3>
                  <div className="text-slate-700 leading-relaxed pl-12">
                    {faq.answer}
                  </div>
                </EnterpriseCard>
              ))}
            </div>
          </div>
        ))}

        {/* Contact Section */}
        <EnterpriseCard className="bg-blue-50 border-blue-200 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Still Have Questions?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-6">
            Our enterprise security team is here to help. Contact us for detailed discussions about your specific 
            security requirements, compliance needs, or custom deployment scenarios.
          </p>
          
          <EnterpriseGrid columns={3}>
            <EnterpriseCard className="text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 mb-1">Security Team</h3>
              <p className="text-slate-600 text-sm mb-1">Alexander Rivera, CISO</p>
              <a href="mailto:security@proofpixapp.com" className="text-blue-600 hover:underline text-sm">
                security@proofpixapp.com
              </a>
            </EnterpriseCard>
            
            <EnterpriseCard className="text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 mb-1">Enterprise Sales</h3>
              <p className="text-slate-600 text-sm mb-1">Olivia Rodriguez, VP of Sales</p>
              <a href="mailto:enterprise@proofpixapp.com" className="text-blue-600 hover:underline text-sm">
                enterprise@proofpixapp.com
              </a>
            </EnterpriseCard>
            
            <EnterpriseCard className="text-center">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 mb-1">Compliance Team</h3>
              <p className="text-slate-600 text-sm mb-1">Nathan Patel, Compliance Director</p>
              <a href="mailto:compliance@proofpixapp.com" className="text-blue-600 hover:underline text-sm">
                compliance@proofpixapp.com
              </a>
            </EnterpriseCard>
          </EnterpriseGrid>
        </EnterpriseCard>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </EnterpriseLayout>
  );
};

export default SecurityFAQ; 