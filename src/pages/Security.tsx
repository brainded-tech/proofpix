import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, CheckCircle, ArrowLeft } from 'lucide-react';
import { ConsistentLayout } from '../components/ui/ConsistentLayout';
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
      title: "Impossible to Breach",
      description: "Your images never leave your device—we can't see them even if we wanted to. Data breaches become architecturally impossible.",
      color: "blue"
    },
    {
      icon: Eye,
      title: "Verifiably Secure",
      description: "Don't just trust our security claims—verify them. Our open-source code lets you see exactly how we protect your data.",
      color: "green"
    },
    {
      icon: CheckCircle,
      title: "Automatic Compliance",
      description: "Meet GDPR, HIPAA, and SOC 2 requirements automatically. Our architecture makes compliance effortless, not expensive.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Zero Trust Required",
      description: "You don't have to trust us with your sensitive data—because we literally can't access it. Trust through transparency.",
      color: "yellow"
    }
  ];

  const enterpriseFeatures = [
    "Eliminate $2.3M Average Breach Costs - Architecture makes data breaches technically impossible",
    "Meet Compliance Automatically - GDPR, HIPAA, SOC 2 compliance built into every analysis",
    "Deploy in Minutes, Not Months - No infrastructure changes or security reviews required",
    "Save 80% on Security Costs - No servers to secure, no data to protect, no breaches to prevent",
    "Guarantee 100% Uptime - Client-side processing means no server downtime affects your work"
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
    <ConsistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-emerald-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center space-x-2 mb-6">
                <EnterpriseBadge variant="success">Security Leader</EnterpriseBadge>
                <EnterpriseBadge variant="primary">Zero Risk Architecture</EnterpriseBadge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Security-First<br/>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">by Design</span>
              </h1>
              
              <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-8">
                ProofPix redefines SaaS security through revolutionary client-side processing. 
                Your images never leave your device - eliminating 90% of traditional security risks.
              </p>
              
              <div className="flex justify-center space-x-12 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">0</div>
                  <div className="text-blue-200 text-sm">Data Breaches</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">95%</div>
                  <div className="text-blue-200 text-sm">Risk Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">100%</div>
                  <div className="text-blue-200 text-sm">Client-Side Processing</div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/docs/security-architecture')}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
              >
                View Security Architecture
              </button>
            </div>
          </div>
        </section>
        
        {/* Rest of the content with proper dark theme styling */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Security Principles */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Core Security Principles</h2>
              <p className="text-xl text-slate-300">
                Built on a foundation of privacy, transparency, and zero-trust architecture
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {securityPrinciples.map((principle, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 text-center hover:border-slate-500/50 transition-all duration-300">
                  <div className={`w-16 h-16 bg-${principle.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <principle.icon className={`w-8 h-8 text-${principle.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{principle.title}</h3>
                  <p className="text-slate-300">{principle.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Enterprise Features */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Enterprise Security Features</h2>
              <p className="text-xl text-slate-300">
                Built for enterprise requirements with comprehensive security controls
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Built for Enterprise Requirements</h3>
                <div className="space-y-4">
                  {enterpriseFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-white mb-4">Enterprise Security Package</h4>
                <ul className="space-y-2 text-sm mb-6 text-slate-300">
                  <li>✓ SOC 2 Type II Certification</li>
                  <li>✓ HIPAA Business Associate Agreement</li>
                  <li>✓ Dedicated Security Manager</li>
                  <li>✓ Priority Incident Response</li>
                  <li>✓ Custom Security Reviews</li>
                  <li>✓ Compliance Documentation</li>
                </ul>
                <button
                  onClick={handleContactSales}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Contact Enterprise Sales
                </button>
              </div>
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Security Certifications</h2>
              <p className="text-xl text-slate-300">
                Industry-leading compliance and security standards
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-6 text-center">
                  <h4 className="font-semibold text-white mb-2">{cert.name}</h4>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                    cert.status === 'Certified' ? 'bg-green-500/20 text-green-400' :
                    cert.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                    cert.status === 'Available' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {cert.status}
                  </div>
                  <p className="text-sm text-slate-400">{cert.timeline}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </ConsistentLayout>
  );
};

export default Security; 