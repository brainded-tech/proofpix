import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, CheckCircle, ArrowLeft } from 'lucide-react';
import { StandardLayout } from '../components/ui/StandardLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseMetric,
  EnterpriseSection,
  EnterpriseGrid
} from '../components/ui/EnterpriseComponents';

const Security: React.FC = () => {
  const navigate = useNavigate();

  const handleContactSales = () => {
    window.location.href = 'mailto:enterprise@proofpixapp.com';
  };

  const handleRequestSecurityPackage = () => {
    window.location.href = 'mailto:security@proofpixapp.com?subject=Security Package Request';
  };

  const handleScheduleSecurityReview = () => {
    window.location.href = 'mailto:security@proofpixapp.com?subject=Security Review Request';
  };

  const securityPrinciples = [
    {
      icon: Lock,
      title: "Zero Knowledge",
      description: "We never see your images or metadata - processing happens entirely in your browser.",
      color: "blue"
    },
    {
      icon: Eye,
      title: "Open Source",
      description: "Complete code transparency enables independent security verification and audit.",
      color: "green"
    },
    {
      icon: CheckCircle,
      title: "Compliance Ready",
      description: "SOC 2, GDPR, HIPAA compliance built into architecture, not retrofitted.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Transparent Tech",
      description: "Client-side JavaScript processing is visible, auditable, and verifiable.",
      color: "yellow"
    }
  ];

  const enterpriseFeatures = [
    "Single Sign-On (SSO) - SAML 2.0 and OAuth integration",
    "Multi-Factor Authentication - Hardware keys and authenticator apps",
    "Audit Trails - Comprehensive logging and monitoring",
    "Role-Based Access - Granular permissions and controls",
    "99.9% Uptime SLA - Enterprise-grade availability guarantee"
  ];

  const certifications = [
    {
      name: "SOC 2 Type II",
      status: "In Progress",
      timeline: "Q2 2025",
      color: "blue"
    },
    {
      name: "GDPR Compliant",
      status: "Certified",
      timeline: "Architecture Native",
      color: "green"
    },
    {
      name: "HIPAA Ready",
      status: "Available",
      timeline: "Enterprise Plans",
      color: "purple"
    },
    {
      name: "ISO 27001",
      status: "Planned",
      timeline: "Q3 2025",
      color: "orange"
    }
  ];

  return (
    <StandardLayout
      showHero
      title="Security-First by Design"
      description="ProofPix redefines SaaS security through revolutionary client-side processing. Your images never leave your device - eliminating 90% of traditional security risks."
      maxWidth="7xl"
    >
      {/* Hero Stats Section */}
      <EnterpriseSection size="lg" className="text-center">
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-6">
            <EnterpriseBadge variant="success">Security Leader</EnterpriseBadge>
            <EnterpriseBadge variant="primary">Zero Risk Architecture</EnterpriseBadge>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-6 text-slate-900">
          Security-First<br/>
          <span className="text-yellow-500">by Design</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
          ProofPix redefines SaaS security through revolutionary client-side processing. 
          Your images never leave your device - eliminating 90% of traditional security risks.
        </p>
        
        <div className="flex justify-center space-x-12 mb-8">
          <EnterpriseMetric value="0" label="Data Breaches" />
          <EnterpriseMetric value="95%" label="Risk Reduction" />
          <EnterpriseMetric value="100%" label="Client-Side Processing" />
        </div>
        
        <EnterpriseButton 
          variant="primary" 
          size="lg"
          onClick={() => navigate('/docs/security-architecture')}
        >
          View Security Architecture
        </EnterpriseButton>
      </EnterpriseSection>

      {/* Security Principles */}
      <EnterpriseSection size="lg" background="light">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Core Security Principles</h2>
          <p className="text-xl text-slate-600">
            Built on a foundation of privacy, transparency, and zero-trust architecture
          </p>
        </div>
        
        <EnterpriseGrid columns={4}>
          {securityPrinciples.map((principle, index) => (
            <EnterpriseCard key={index}>
              <div className="text-center">
                <div className={`w-16 h-16 bg-${principle.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <principle.icon className={`w-8 h-8 text-${principle.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{principle.title}</h3>
                <p className="text-slate-600">{principle.description}</p>
              </div>
            </EnterpriseCard>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* Enterprise Features */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Enterprise Security Features</h2>
          <p className="text-xl text-slate-600">
            Built for enterprise requirements with comprehensive security controls
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Built for Enterprise Requirements</h3>
            <div className="space-y-4">
              {enterpriseFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <EnterpriseCard variant="dark">
            <h4 className="text-xl font-bold text-white mb-4">Enterprise Security Package</h4>
            <ul className="space-y-2 text-sm mb-6 text-slate-300">
              <li>✓ SOC 2 Type II Certification</li>
              <li>✓ HIPAA Business Associate Agreement</li>
              <li>✓ Dedicated Security Manager</li>
              <li>✓ Priority Incident Response</li>
              <li>✓ Custom Security Reviews</li>
              <li>✓ Compliance Documentation</li>
            </ul>
            <EnterpriseButton
              variant="primary"
              onClick={handleContactSales}
              className="w-full"
            >
              Contact Enterprise Sales
            </EnterpriseButton>
          </EnterpriseCard>
        </div>
      </EnterpriseSection>

      {/* Certifications */}
      <EnterpriseSection size="lg" background="light">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Security Certifications & Compliance</h2>
          <p className="text-xl text-slate-600">
            Meeting the highest standards for enterprise security and compliance
          </p>
        </div>
        
        <EnterpriseGrid columns={4}>
          {certifications.map((cert, index) => (
            <EnterpriseCard key={index}>
              <div className="text-center">
                <div className={`w-16 h-16 bg-${cert.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className={`text-2xl font-bold text-${cert.color}-600`}>
                    {cert.name.split(' ')[0]}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{cert.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{cert.status}</p>
                <EnterpriseBadge 
                  variant={cert.status === 'Certified' ? 'success' : cert.status === 'In Progress' ? 'warning' : 'neutral'}
                >
                  {cert.timeline}
                </EnterpriseBadge>
              </div>
            </EnterpriseCard>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* Call to Action */}
      <EnterpriseSection size="lg">
        <EnterpriseCard variant="dark" className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Experience Security Leadership?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Join enterprise customers who've chosen ProofPix for unmatched security and privacy protection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <EnterpriseButton 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/enterprise')}
            >
              Start Enterprise Trial
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary" 
              size="lg"
              onClick={handleContactSales}
            >
              Contact Security Team
            </EnterpriseButton>
          </div>
        </EnterpriseCard>
      </EnterpriseSection>
    </StandardLayout>
  );
};

export default Security; 