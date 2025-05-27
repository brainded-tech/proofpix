import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Book, Users, Shield, Code, Settings, FileText, ExternalLink } from 'lucide-react';
import DocumentationFooter from '../../components/DocumentationFooter';

export const DocumentationIndex: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const documentationSections = [
    {
      title: "User Documentation",
      icon: <Book className="h-6 w-6" />,
      color: "blue",
      description: "Essential guides for all ProofPix users",
      docs: [
        {
          title: "Getting Started Guide",
          description: "Complete setup and usage guide for new users",
          path: "/docs/getting-started",
          internal: true
        },
        {
          title: "Privacy Best Practices",
          description: "Protect your privacy when working with image metadata",
          path: "/docs/privacy-guide",
          internal: true
        },
        {
          title: "Metadata Types Explained",
          description: "Understanding EXIF, IPTC, and XMP metadata",
          path: "/docs/metadata-guide",
          internal: true
        },
        {
          title: "Pro User Guide",
          description: "Advanced features for Pro subscribers",
          path: "https://github.com/brainded-tech/proofpix/blob/main/PRO_USER_GUIDE.md",
          internal: false,
          badge: "Pro"
        }
      ]
    },
    {
      title: "Enterprise Documentation",
      icon: <Users className="h-6 w-6" />,
      color: "purple",
      description: "Comprehensive guides for enterprise deployments",
      docs: [
        {
          title: "Enterprise Guide",
          description: "Complete enterprise features and workflows",
          path: "https://github.com/brainded-tech/proofpix/blob/main/ENTERPRISE_GUIDE.md",
          internal: false,
          badge: "Enterprise"
        },
        {
          title: "API Documentation",
          description: "Enterprise API reference and examples",
          path: "/docs/api",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Enterprise API Documentation",
          description: "Comprehensive API reference for enterprise integration",
          path: "/docs/enterprise-api",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Enterprise Deployment Guide",
          description: "Complete deployment guide for enterprise environments",
          path: "/docs/enterprise-deployment",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Integration Guide",
          description: "System integration and workflow automation",
          path: "https://github.com/brainded-tech/proofpix/blob/main/INTEGRATION_GUIDE.md",
          internal: false,
          badge: "Enterprise"
        },
        {
          title: "Compliance Guide",
          description: "Regulatory compliance and audit procedures",
          path: "https://github.com/brainded-tech/proofpix/blob/main/COMPLIANCE_GUIDE.md",
          internal: false,
          badge: "Enterprise"
        },
        {
          title: "AI-Driven Pricing",
          description: "Intelligent customer segmentation and instant pricing strategy",
          path: "/docs/ai-pricing",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Custom Branding",
          description: "Brand customization and white-label deployment options",
          path: "/docs/custom-branding",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Implementation Status",
          description: "Real-time project tracking and progress dashboard",
          path: "/docs/implementation-status",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Enterprise Demo Walkthrough",
          description: "Complete guide to the TechCorp Industries enterprise simulation with 20+ screenshots",
          path: "/docs/enterprise-demo-walkthrough",
          internal: true,
          badge: "Sales Tool"
        },
        {
          title: "Sales Playbook",
          description: "Comprehensive sales guide with customer segmentation, demo strategies, and objection handling",
          path: "/docs/sales-playbook",
          internal: true,
          badge: "Sales Tool"
        },
        {
          title: "ROI Calculator",
          description: "Interactive calculator to demonstrate cost savings and return on investment",
          path: "/docs/roi-calculator",
          internal: true,
          badge: "Sales Tool"
        },
        {
          title: "Customer Success Stories",
          description: "Real case studies from legal firms, insurance companies, and security agencies",
          path: "/docs/customer-success-stories",
          internal: true,
          badge: "Sales Tool"
        },
        {
          title: "Implementation Guides",
          description: "30-day implementation plan, integration checklist, and quick start guide",
          path: "/docs/implementation-guides",
          internal: true,
          badge: "Enterprise"
        }
      ]
    },
    {
      title: "Security & Compliance",
      icon: <Shield className="h-6 w-6" />,
      color: "red",
      description: "Enterprise security, compliance, and privacy documentation",
      docs: [
        {
          title: "Enterprise Security",
          description: "Comprehensive security controls and compliance features",
          path: "/docs/enterprise-security",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Security Architecture Overview",
          description: "Revolutionary client-side processing security architecture",
          path: "/docs/security-architecture",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Security FAQ",
          description: "Frequently asked questions about security and compliance",
          path: "/docs/security-faq",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Compliance Documentation",
          description: "GDPR, CCPA, HIPAA, and SOC 2 compliance details",
          path: "https://github.com/brainded-tech/proofpix/blob/main/ENTERPRISE_COMPLIANCE_DOCUMENTATION.md",
          internal: false,
          badge: "Enterprise"
        },
        {
          title: "SOC 2 Certification",
          description: "SOC 2 Type II certification progress and marketing materials",
          path: "https://github.com/brainded-tech/proofpix/blob/main/SOC2_CERTIFICATION_MARKETING.md",
          internal: false,
          badge: "Enterprise"
        },
        {
          title: "Compliance Documentation Templates",
          description: "Ready-to-use compliance templates for enterprise customers",
          path: "/docs/compliance-templates",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Enterprise Security FAQ",
          description: "Comprehensive security Q&A for enterprise customers",
          path: "/docs/enterprise-security-faq",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Compliance Checklist",
          description: "Complete compliance readiness assessment across regulatory frameworks",
          path: "/docs/compliance-checklist",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Security Architecture Document",
          description: "Detailed technical security architecture and threat model analysis",
          path: "/docs/security-architecture-document",
          internal: true,
          badge: "Enterprise"
        },
        {
          title: "Security One-Pager",
          description: "Concise security overview for sales teams and quick reference",
          path: "/docs/security-one-pager",
          internal: true,
          badge: "Sales Tool"
        },
        {
          title: "CISO Presentation Deck",
          description: "Executive-level security presentation for CISOs and security leaders",
          path: "/docs/ciso-presentation",
          internal: true,
          badge: "Executive"
        },
        {
          title: "Security Questionnaire Responses",
          description: "Pre-answered responses to standard enterprise security questions",
          path: "/docs/security-questionnaire",
          internal: true,
          badge: "Sales Tool"
        },
        {
          title: "Competitive Security Analysis",
          description: "Security comparison vs traditional image processing platforms",
          path: "/docs/competitive-security-analysis",
          internal: true,
          badge: "Competitive"
        }
      ]
    },
    {
      title: "Technical Documentation",
      icon: <Code className="h-6 w-6" />,
      color: "green",
      description: "Developer and system administrator resources",
      docs: [
        {
          title: "System Architecture",
          description: "Complete system design and architecture overview",
          path: "/docs/architecture",
          internal: true,
          badge: "Developers"
        },
        {
          title: "API Reference",
          description: "Comprehensive API documentation",
          path: "/docs/api-reference",
          internal: true,
          badge: "Developers"
        },
        {
          title: "Testing Guide",
          description: "Testing strategies and procedures",
          path: "/docs/testing",
          internal: true,
          badge: "Developers"
        },
        {
          title: "Deployment Guide",
          description: "Deployment and DevOps documentation",
          path: "/docs/deployment",
          internal: true,
          badge: "DevOps"
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-400",
        hover: "hover:border-blue-500/50"
      },
      purple: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        text: "text-purple-400",
        hover: "hover:border-purple-500/50"
      },
      green: {
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        text: "text-green-400",
        hover: "hover:border-green-500/50"
      },
      red: {
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        text: "text-red-400",
        hover: "hover:border-red-500/50"
      }
    };
    return colors[color as keyof typeof colors];
  };

  const getBadgeColor = (badge: string) => {
    const badgeColors = {
      "Pro": "bg-green-500 text-black",
      "Enterprise": "bg-purple-500 text-white",
      "Developers": "bg-yellow-500 text-black",
      "DevOps": "bg-orange-500 text-white",
      "Sales Tool": "bg-blue-500 text-white",
      "Executive": "bg-red-500 text-white",
      "Competitive": "bg-orange-600 text-white"
    };
    return badgeColors[badge as keyof typeof badgeColors] || "bg-gray-500 text-white";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={handleBackHome}>
              <Camera className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold">ProofPix</h1>
            </div>
            <nav className="flex space-x-6 text-sm">
              <button onClick={handleBackHome} className="text-gray-400 hover:text-white">
                Home
              </button>
              <button onClick={() => navigate('/support')} className="text-gray-400 hover:text-white">
                Support
              </button>
              <span className="text-blue-400 font-medium">Documentation</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
            ProofPix Documentation
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Comprehensive guides, API references, and technical documentation
          </p>
          <p className="text-gray-400">
            Everything you need to get the most out of ProofPix
          </p>
        </section>

        {/* Documentation Sections */}
        <div className="space-y-12">
          {documentationSections.map((section, sectionIndex) => {
            const colorClasses = getColorClasses(section.color);
            
            return (
              <section key={sectionIndex} className={`${colorClasses.bg} ${colorClasses.border} border rounded-2xl p-8 ${colorClasses.hover} transition-all duration-300`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={colorClasses.text}>
                    {section.icon}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${colorClasses.text}`}>
                      {section.title}
                    </h2>
                    <p className="text-gray-300">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {section.docs.map((doc, docIndex) => (
                    <div key={docIndex} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {doc.badge && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeColor(doc.badge)}`}>
                              {doc.badge}
                            </span>
                          )}
                          {!doc.internal && (
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        {doc.description}
                      </p>
                      {doc.internal ? (
                        <button
                          onClick={() => navigate(doc.path)}
                          className={`${colorClasses.text} hover:text-white underline text-sm font-medium`}
                        >
                          Read Guide →
                        </button>
                      ) : (
                        <a
                          href={doc.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${colorClasses.text} hover:text-white underline text-sm font-medium`}
                        >
                          View on GitHub →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Quick Links */}
        <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 mt-12">
          <div className="flex items-center gap-4 mb-6">
            <FileText className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Quick Links</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-300 text-sm mb-3">
                All processing happens locally in your browser
              </p>
              <button
                onClick={() => navigate('/docs/privacy-guide')}
                className="text-blue-400 hover:text-blue-300 underline text-sm"
              >
                Learn More
              </button>
            </div>

            <div className="text-center">
              <Settings className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Enterprise Ready</h3>
              <p className="text-gray-300 text-sm mb-3">
                Scalable solutions for business needs
              </p>
              <a
                href="https://github.com/brainded-tech/proofpix/blob/main/ENTERPRISE_GUIDE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline text-sm"
              >
                Enterprise Guide
              </a>
            </div>

            <div className="text-center">
              <Code className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Developer Friendly</h3>
              <p className="text-gray-300 text-sm mb-3">
                Open source with comprehensive APIs
              </p>
              <button
                onClick={() => navigate('/docs/api-reference')}
                className="text-blue-400 hover:text-blue-300 underline text-sm"
              >
                API Reference
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-300 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/support')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/faq')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View FAQ
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </div>
  );
};

export default DocumentationIndex; 