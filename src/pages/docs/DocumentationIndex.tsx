import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Book, Users, Shield, Code, Settings, FileText, ExternalLink, ChevronDown, ChevronRight, Star, Zap, BarChart3, Image } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
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
      title: "Content Quality Dashboard",
      description: "Monitor documentation quality, validate links, and track content analytics",
      path: "/docs/content-quality",
      icon: <BarChart3 className="h-5 w-5" />,
      priority: "medium",
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
          title: "Pro User Guide",
          description: "Advanced features for Pro subscribers - batch processing, custom exports, and more",
          path: "https://github.com/brainded-tech/proofpix/blob/main/PRO_USER_GUIDE.md",
          internal: false,
          badge: "Pro",
          time: "15 min read"
        },
        {
          title: "Metadata Types Explained",
          description: "Deep dive into EXIF, IPTC, and XMP metadata formats",
          path: "/docs/metadata-guide",
          internal: true,
          time: "10 min read"
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
    <EnterpriseLayout
      showHero
      title="ProofPix Documentation"
      description="Comprehensive guides, API references, and resources for all ProofPix users"
      maxWidth="7xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <EnterpriseButton
          variant="ghost"
          onClick={handleBackHome}
          className="mb-6"
        >
          ← Back to ProofPix
        </EnterpriseButton>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Documentation Center
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to get the most out of ProofPix, from basic usage to enterprise deployment
          </p>
        </div>
      </EnterpriseSection>

      {/* Quick Start Banner */}
      <EnterpriseSection size="sm">
        <EnterpriseCard variant="dark" className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-yellow-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">New to ProofPix?</h2>
          </div>
          <p className="text-blue-100 mb-6">
            Get started in just 15 minutes with our guided quick start path
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {quickStartPath.map((doc, index) => (
              <div 
                key={index}
                className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
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
        </EnterpriseCard>
      </EnterpriseSection>

      {/* Documentation Sections with Progressive Disclosure */}
      <EnterpriseSection size="lg">
        <div className="space-y-6">
          {documentationSections
            .filter(section => section.id !== 'getting-started') // Already shown above
            .sort((a, b) => {
              const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((section, sectionIndex) => {
              const isExpanded = expandedSections.includes(section.id);
            
            return (
                <div key={sectionIndex} className="border border-slate-200 rounded-lg overflow-hidden">
                  {/* Section Header - Always Visible */}
                  <div 
                    className={`p-6 cursor-pointer transition-colors ${
                      isExpanded ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
                    }`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          section.color === 'blue' ? 'bg-blue-100' :
                          section.color === 'purple' ? 'bg-purple-100' :
                          section.color === 'red' ? 'bg-red-100' :
                          section.color === 'green' ? 'bg-green-100' :
                          section.color === 'orange' ? 'bg-orange-100' :
                          'bg-gray-100'
                        }`}>
                          <div className={`${
                            section.color === 'blue' ? 'text-blue-600' :
                            section.color === 'purple' ? 'text-purple-600' :
                            section.color === 'red' ? 'text-red-600' :
                            section.color === 'green' ? 'text-green-600' :
                            section.color === 'orange' ? 'text-orange-600' :
                            'text-gray-600'
                          }`}>
                    {section.icon}
                          </div>
                  </div>
                  <div>
                          <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                          <p className="text-slate-600">{section.subtitle}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-slate-500">{section.docs.length} guides</span>
                            {section.priority === 'high' && (
                              <EnterpriseBadge variant="success" className="ml-2">Recommended</EnterpriseBadge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                  </div>
                </div>

                  {/* Section Content - Collapsible */}
                  {isExpanded && (
                    <div className="p-6 pt-0 bg-slate-50">
                      <EnterpriseGrid columns={2}>
                  {section.docs.map((doc, docIndex) => (
                          <EnterpriseCard 
                            key={docIndex}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                            onClick={() => handleDocClick(doc)}
                          >
                      <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-semibold text-slate-900 flex-1 pr-2">
                          {doc.title}
                        </h3>
                              <div className="flex items-center space-x-2">
                                {doc.time && (
                                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    {doc.time}
                            </span>
                          )}
                                {doc.badge && (
                                  <EnterpriseBadge variant={getBadgeVariant(doc.badge)}>
                                    {doc.badge}
                                  </EnterpriseBadge>
                          )}
                          {!doc.internal && (
                                  <ExternalLink className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{doc.description}</p>
                          </EnterpriseCard>
                        ))}
                      </EnterpriseGrid>
                    </div>
                  )}
                </div>
            );
          })}
        </div>
      </EnterpriseSection>

      {/* Quick Actions Footer */}
      <EnterpriseSection size="lg">
        <EnterpriseCard variant="dark" className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Need Help Getting Started?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Jump right into the most popular documentation sections
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <EnterpriseButton 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/docs/getting-started')}
            >
              Getting Started Guide
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/docs/enterprise-api')}
            >
              API Documentation
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/enterprise')}
            >
              Enterprise Features
            </EnterpriseButton>
          </div>
        </EnterpriseCard>
      </EnterpriseSection>

      <DocumentationFooter />
    </EnterpriseLayout>
  );
};

export default DocumentationIndex; 