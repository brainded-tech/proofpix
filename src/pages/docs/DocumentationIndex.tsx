import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Book, Users, Shield, Code, Settings, FileText, ExternalLink, ChevronDown, ChevronRight, Star, Zap, BarChart3, Image } from 'lucide-react';
import { ConsistentLayout } from '../../components/ui/ConsistentLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

export const DocumentationIndex: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

  const handleBackHome = () => {
    navigate('/');
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Quick Start Path - Most Common User Journey
  const quickStartPath = [
    {
      title: "Getting Started Guide",
      description: "Upload your first image and extract metadata in 3 simple steps",
      path: "/docs/getting-started",
      icon: <Star className="h-5 w-5" />,
      priority: "high",
      estimatedTime: "5 min"
    },
    {
      title: "Comprehensive API Guide",
      description: "Complete REST API reference with 50+ endpoints and SDK examples",
      path: "/docs/comprehensive-api-guide",
      icon: <Code className="h-5 w-5" />,
      priority: "high",
      estimatedTime: "15 min"
    },
    {
      title: "Privacy Guide",
      description: "Complete privacy architecture and data protection guide",
      path: "/docs/privacy-guide",
      icon: <Shield className="h-5 w-5" />,
      priority: "high",
      estimatedTime: "10 min"
    },
    {
      title: "Metadata Extraction Guide",
      description: "Learn how to extract and analyze image metadata effectively",
      path: "/docs/metadata-guide",
      icon: <Image className="h-5 w-5" />,
      priority: "high",
      estimatedTime: "8 min"
    }
  ];

  // Define priority type
  type Priority = 'high' | 'medium' | 'low';

  // Organized by user type and complexity
  const documentationSections: Array<{
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    priority: Priority;
    expanded?: boolean;
    docs: Array<{
      title: string;
      description: string;
      path: string;
      internal?: boolean;
      badge?: string;
      time?: string;
    }>;
  }> = [
    {
      id: "getting-started",
      title: "🚀 New to ProofPix?",
      subtitle: "Start here - everything you need in 15 minutes",
      icon: <Zap className="h-6 w-6" />,
      color: "green",
      priority: "high",
      expanded: true,
      docs: quickStartPath
    },
    {
      id: "user-guides",
      title: "📚 User Guides",
      subtitle: "Detailed guides for regular users",
      icon: <Book className="h-6 w-6" />,
      color: "blue",
      priority: "medium",
      docs: [
        {
          title: "Privacy Guide",
          description: "Complete privacy architecture and data protection guide",
          path: "/docs/privacy-guide",
          internal: true,
          badge: "Essential",
          time: "15 min read"
        },
        {
          title: "Metadata Types Explained",
          description: "Deep dive into EXIF, IPTC, and XMP metadata formats",
          path: "/docs/metadata-guide",
          internal: true,
          time: "20 min read"
        },
        {
          title: "Blog Content Management Guide",
          description: "Complete guide to managing blog content and CMS features",
          path: "/docs/blog-content-management",
          internal: true,
          badge: "New",
          time: "12 min read"
        },
        {
          title: "Workflow Template Implementation",
          description: "Step-by-step guide to implementing workflow templates",
          path: "/docs/workflow-template-implementation",
          internal: true,
          badge: "Popular",
          time: "18 min read"
        },
        {
          title: "Marketplace Integration Guide",
          description: "Complete user guide for marketplace and integrations",
          path: "/docs/marketplace-integration",
          internal: true,
          badge: "Enterprise",
          time: "16 min read"
        }
      ]
    },
    {
      id: "enterprise",
      title: "🏢 Enterprise & Business",
      subtitle: "For teams, organizations, and enterprise deployments",
      icon: <Users className="h-6 w-6" />,
      color: "purple",
      priority: "medium",
      docs: [
        {
          title: "Enterprise Demo Features Guide",
          description: "Complete implementation guide for all enterprise demo features",
          path: "/docs/enterprise-demo-features",
          internal: true,
          badge: "Enterprise",
          time: "25 min read"
        },
        {
          title: "Enterprise Overview",
          description: "Complete enterprise features and workflows",
          path: "https://github.com/brainded-tech/proofpix/blob/main/ENTERPRISE_GUIDE.md",
          internal: false,
          badge: "Enterprise",
          time: "20 min read"
        },
        {
          title: "API Documentation",
          description: "Enterprise API reference and integration examples",
          path: "/docs/enterprise-api",
          internal: true,
          badge: "Enterprise",
          time: "25 min read"
        },
        {
          title: "Deployment Guide",
          description: "Complete deployment guide for enterprise environments",
          path: "/docs/enterprise-deployment", 
          internal: true,
          badge: "Enterprise",
          time: "30 min read"
        },
        {
          title: "Custom Branding",
          description: "Brand customization and white-label deployment options",
          path: "/docs/custom-branding",
          internal: true,
          badge: "Enterprise",
          time: "10 min read"
        }
      ]
    },
    {
      id: "security",
      title: "🔒 Security & Compliance",
      subtitle: "Enterprise security, compliance, and privacy documentation",
      icon: <Shield className="h-6 w-6" />,
      color: "red",
      priority: "medium",
      docs: [
        {
          title: "Security Architecture",
          description: "Revolutionary client-side processing security architecture",
          path: "/docs/security-architecture",
          internal: true,
          badge: "Enterprise",
          time: "15 min read"
        },
        {
          title: "Security FAQ",
          description: "Common security questions and detailed answers",
          path: "/docs/security-faq",
          internal: true,
          badge: "Enterprise",
          time: "12 min read"
        },
        {
          title: "Enterprise Security FAQ",
          description: "Advanced enterprise security questions and answers",
          path: "/docs/enterprise-security-faq",
          internal: true,
          badge: "Enterprise",
          time: "15 min read"
        },
        {
          title: "Security Architecture Document",
          description: "Detailed technical security architecture documentation",
          path: "/docs/security-architecture-doc",
          internal: true,
          badge: "Technical",
          time: "25 min read"
        },
        {
          title: "Security One-Pager",
          description: "Executive summary of ProofPix security features",
          path: "/docs/security-onepager",
          internal: true,
          badge: "Executive",
          time: "5 min read"
        },
        {
          title: "CISO Presentation Deck",
          description: "Complete presentation deck for Chief Information Security Officers",
          path: "/docs/ciso-presentation",
          internal: true,
          badge: "Executive",
          time: "20 min read"
        },
        {
          title: "Security Questionnaire Responses",
          description: "Pre-filled responses to common security questionnaires",
          path: "/docs/security-questionnaire",
          internal: true,
          badge: "Sales Tool",
          time: "15 min read"
        },
        {
          title: "Competitive Security Analysis",
          description: "Security comparison with competitors and industry standards",
          path: "/docs/competitive-security",
          internal: true,
          badge: "Sales Tool",
          time: "18 min read"
        },
        {
          title: "Compliance Templates",
          description: "Ready-to-use GDPR, HIPAA, and SOC 2 compliance templates",
          path: "/docs/compliance-templates",
          internal: true,
          badge: "Enterprise", 
          time: "20 min read"
        },
        {
          title: "Compliance Checklist",
          description: "Step-by-step compliance verification checklist",
          path: "/docs/compliance-checklist",
          internal: true,
          badge: "Enterprise",
          time: "10 min read"
        }
      ]
    },
    {
      id: "sales-tools",
      title: "💼 Sales & Implementation",
      subtitle: "Tools for sales teams and implementation specialists",
      icon: <Settings className="h-6 w-6" />,
      color: "orange",
      priority: "low",
      docs: [
        {
          title: "Enterprise Demo Walkthrough",
          description: "Complete guide to the TechCorp Industries enterprise simulation",
          path: "/docs/demo-walkthrough",
          internal: true,
          badge: "Sales Tool",
          time: "25 min read"
        },
        {
          title: "Sales Playbook", 
          description: "Comprehensive sales guide with customer segmentation and objection handling",
          path: "/docs/sales-playbook",
          internal: true,
          badge: "Sales Tool",
          time: "30 min read"
        },
        {
          title: "ROI Calculator",
          description: "Interactive calculator to demonstrate cost savings and ROI",
          path: "/docs/roi-calculator",
          internal: true,
          badge: "Sales Tool",
          time: "5 min read"
        },
        {
          title: "Customer Success Stories",
          description: "Real case studies from legal firms, insurance companies, and security agencies",
          path: "/docs/customer-success-stories", 
          internal: true,
          badge: "Sales Tool",
          time: "15 min read"
        },
        {
          title: "Implementation Guides",
          description: "30-day implementation plan and integration checklist",
          path: "/docs/implementation-guides",
          internal: true,
          badge: "Enterprise",
          time: "20 min read"
        }
      ]
    },
    {
      id: "technical",
      title: "⚙️ Technical Documentation",
      subtitle: "For developers, system administrators, and technical teams",
      icon: <Code className="h-6 w-6" />,
      color: "gray",
      priority: "low", 
      docs: [
        {
          title: "AI Document Intelligence Guide",
          description: "Comprehensive technical guide for AI Document Intelligence Dashboard",
          path: "/docs/ai-document-intelligence-guide",
          internal: true,
          badge: "AI/ML",
          time: "20 min read"
        },
        {
          title: "Smart Document Assistant Guide",
          description: "Technical documentation for Smart Document Assistant conversational AI",
          path: "/docs/smart-document-assistant-guide",
          internal: true,
          badge: "AI/ML",
          time: "15 min read"
        },
        {
          title: "Comprehensive API Guide",
          description: "Complete REST API reference with 50+ endpoints and SDK examples",
          path: "/docs/comprehensive-api-guide",
          internal: true,
          badge: "API",
          time: "35 min read"
        },
        {
          title: "Security & Compliance Guide",
          description: "Complete security architecture and compliance framework documentation",
          path: "/docs/security-compliance-guide",
          internal: true,
          badge: "Security",
          time: "30 min read"
        },
        {
          title: "Enterprise Integrations Guide",
          description: "Technical guide for integrating with Salesforce, Microsoft 365, and more",
          path: "/docs/enterprise-integrations-guide",
          internal: true,
          badge: "Enterprise",
          time: "25 min read"
        },
        {
          title: "System Architecture",
          description: "Complete system design and technical architecture",
          path: "/docs/architecture",
          internal: true,
          time: "25 min read"
        },
        {
          title: "API Reference",
          description: "Comprehensive API documentation with examples",
          path: "/docs/api",
          internal: true,
          time: "30 min read"
        },
        {
          title: "Testing Guide",
          description: "Testing strategies and quality assurance procedures",
          path: "/docs/testing",
          internal: true,
          time: "20 min read"
        },
        {
          title: "Deployment Guide",
          description: "Technical deployment and DevOps documentation",
          path: "/docs/deployment",
          internal: true,
          time: "25 min read"
        },
        {
          title: "Integration Guide",
          description: "System integration and workflow automation",
          path: "https://github.com/brainded-tech/proofpix/blob/main/INTEGRATION_GUIDE.md",
          internal: false,
          time: "35 min read"
        }
      ]
    }
  ];

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'Enterprise':
        return 'primary';
      case 'Pro':
        return 'success';
      case 'Sales Tool':
        return 'warning';
      case 'AI/ML':
        return 'primary';
      case 'API':
        return 'success';
      case 'Security':
        return 'danger';
      case 'Technical':
        return 'neutral';
      case 'Executive':
        return 'primary';
      case 'Essential':
        return 'success';
      case 'New':
        return 'primary';
      case 'Popular':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const handleDocClick = (doc: any) => {
    if (doc.internal) {
      navigate(doc.path);
    } else {
      window.open(doc.path, '_blank');
    }
  };

  return (
    <ConsistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-emerald-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                ProofPix Documentation
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Comprehensive guides, API references, and resources for all ProofPix users
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <button
            onClick={handleBackHome}
            className="mb-8 bg-slate-800/50 text-white hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors border border-slate-600/50"
          >
            ← Back to ProofPix
          </button>

          {/* Quick Start Banner */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">New to ProofPix?</h2>
            </div>
            <p className="text-blue-100 mb-6">
              Get started in just 15 minutes with our guided quick start path
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStartPath.map((doc, index) => (
                <div 
                  key={index}
                  className="bg-slate-700/50 rounded-lg p-4 cursor-pointer hover:bg-slate-600/50 transition-colors border border-slate-600/50"
                  onClick={() => handleDocClick(doc)}
                >
                  <div className="flex items-center mb-2">
                    {doc.icon}
                    <span className="ml-2 text-sm text-blue-200">{doc.estimatedTime}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{doc.title}</h3>
                  <p className="text-blue-200 text-xs">{doc.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Sections */}
          <div className="space-y-6">
            {documentationSections
              .filter(section => section.id !== 'getting-started')
              .sort((a, b) => {
                const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map((section, sectionIndex) => {
                const isExpanded = expandedSections.includes(section.id);
              
                return (
                  <div key={sectionIndex} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl overflow-hidden">
                    {/* Section Header */}
                    <div 
                      className={`p-6 cursor-pointer transition-colors ${
                        isExpanded ? 'bg-slate-700/50' : 'hover:bg-slate-700/30'
                      }`}
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${
                            section.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                            section.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                            section.color === 'red' ? 'bg-red-500/20 text-red-400' :
                            section.color === 'green' ? 'bg-green-500/20 text-green-400' :
                            section.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {section.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{section.title}</h3>
                            <p className="text-slate-300">{section.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-slate-400">
                          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Section Content */}
                    {isExpanded && (
                      <div className="border-t border-slate-600/50 bg-slate-700/30">
                        <div className="p-6">
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.docs.map((doc, docIndex) => (
                              <div
                                key={docIndex}
                                className="bg-slate-800/50 rounded-lg p-4 cursor-pointer hover:bg-slate-700/50 transition-colors border border-slate-600/50 group"
                                onClick={() => handleDocClick(doc)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                    {doc.title}
                                  </h4>
                                  {!doc.internal && <ExternalLink className="h-4 w-4 text-slate-400" />}
                                </div>
                                <p className="text-slate-300 text-sm mb-3">{doc.description}</p>
                                <div className="flex items-center justify-between">
                                  {doc.badge && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      getBadgeVariant(doc.badge) === 'primary' ? 'bg-blue-500/20 text-blue-400' :
                                      getBadgeVariant(doc.badge) === 'success' ? 'bg-green-500/20 text-green-400' :
                                      getBadgeVariant(doc.badge) === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                      getBadgeVariant(doc.badge) === 'danger' ? 'bg-red-500/20 text-red-400' :
                                      'bg-slate-500/20 text-slate-400'
                                    }`}>
                                      {doc.badge}
                                    </span>
                                  )}
                                  {doc.time && (
                                    <span className="text-xs text-slate-400">{doc.time}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </ConsistentLayout>
  );
};

export default DocumentationIndex;