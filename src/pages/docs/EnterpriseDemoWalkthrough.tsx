import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Users, Settings, BarChart3, Shield, ArrowRight, Play, Eye, CheckCircle, ArrowLeft } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

interface DemoItem {
  title: string;
  description: string;
  features: string[];
  path?: string;
  metrics?: string[];
  activities?: string[];
  capabilities?: string[];
  data?: string[];
  enterprise?: string[];
  templates?: string[];
  roles?: string[];
  permissions?: string[];
  workflow?: string[];
  security?: string[];
  keys?: string[];
  environments?: string[];
  settings?: string[];
  branding?: string[];
  compliance?: string[];
}

interface DemoCategory {
  category: string;
  items: DemoItem[];
}

export const EnterpriseDemoWalkthrough: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  const screenshots: DemoCategory[] = [
    {
      category: "Demo Access",
      items: [
        {
          title: "Enterprise Page - Try Demo Button",
          description: "Navigate to the Enterprise page and locate the prominent 'Try Demo' button in the hero section.",
          features: ["Prominent call-to-action", "Enterprise branding", "Clear value proposition"],
          path: "/enterprise → Try Demo button"
        },
        {
          title: "Demo Access Screen",
          description: "Click 'Try Demo' to access the enterprise simulation environment without requiring registration.",
          features: ["Instant access", "No registration required", "Professional loading screen"],
          path: "Automatic redirect to demo environment"
        },
        {
          title: "TechCorp Industries Welcome",
          description: "Welcome screen introducing the TechCorp Industries simulation with company branding and context.",
          features: ["Custom company branding", "Contextual introduction", "Professional presentation"],
          path: "/enterprise/demo landing page"
        }
      ]
    },
    {
      category: "Dashboard Overview",
      items: [
        {
          title: "Main Enterprise Dashboard",
          description: "Complete enterprise dashboard showing real-time metrics, team activity, and system status.",
          features: ["Real-time metrics", "Team statistics", "System health indicators", "Activity feed"],
          metrics: ["47 team members", "12,847 files processed", "89,234 API calls", "99.9% uptime"]
        },
        {
          title: "Team Statistics Panel",
          description: "Detailed breakdown of team composition, roles, and activity levels across the organization.",
          features: ["Role distribution", "Activity heatmap", "Performance metrics", "Growth trends"],
          metrics: ["15 Admins", "32 Users", "Active this week: 43", "New this month: 8"]
        },
        {
          title: "Usage Analytics",
          description: "Comprehensive analytics showing processing volume, API usage, and performance metrics.",
          features: ["Processing volume charts", "API usage graphs", "Performance trends", "Cost analysis"],
          metrics: ["2.3TB processed", "99.2% success rate", "1.2s avg processing", "$2,847 monthly savings"]
        },
        {
          title: "Recent Activity Feed",
          description: "Live activity stream showing recent file processing, team actions, and system events.",
          features: ["Real-time updates", "User attribution", "Action categorization", "Timestamp tracking"],
          activities: ["Batch processing completed", "New team member added", "API key generated", "Report exported"]
        }
      ]
    },
    {
      category: "Image Processing",
      items: [
        {
          title: "Enterprise File Upload",
          description: "Advanced file upload interface with batch processing, drag-and-drop, and enterprise features.",
          features: ["Batch upload support", "Drag-and-drop interface", "File validation", "Progress tracking"],
          capabilities: ["Multiple file formats", "Size validation", "Metadata preview", "Queue management"]
        },
        {
          title: "Batch Processing in Action",
          description: "Live demonstration of batch processing with real-time progress, queue management, and results.",
          features: ["Real-time progress", "Queue visualization", "Error handling", "Parallel processing"],
          metrics: ["15 files in queue", "Processing: 3/15", "Estimated time: 2m 30s", "Success rate: 100%"]
        },
        {
          title: "Metadata Extraction Results",
          description: "Comprehensive metadata display with enterprise-specific fields and advanced analysis.",
          features: ["Complete EXIF data", "GPS coordinates", "Camera information", "Timestamp analysis"],
          data: ["Camera: Canon EOS R5", "Location: 40.7128°N, 74.0060°W", "Date: 2024-05-27 14:30:22", "ISO: 400"]
        },
        {
          title: "Enterprise Features Demo",
          description: "Showcase of enterprise-specific features including custom fields, compliance tags, and audit trails.",
          features: ["Custom metadata fields", "Compliance tagging", "Audit trail logging", "Chain of custody"],
          enterprise: ["Legal case reference", "Evidence tracking", "Compliance status", "Approval workflow"]
        },
        {
          title: "PDF Report Generation",
          description: "Professional PDF report generation with custom branding, multiple templates, and export options.",
          features: ["Custom branding", "Multiple templates", "Batch export", "Digital signatures"],
          templates: ["Professional", "Forensic", "Compliance", "Executive Summary"]
        }
      ]
    },
    {
      category: "Team Management",
      items: [
        {
          title: "Team Members Directory",
          description: "Complete team directory with role management, contact information, and activity status.",
          features: ["Role-based access", "Contact management", "Activity tracking", "Search and filter"],
          roles: ["Super Admin (3)", "Admin (12)", "User (25)", "Viewer (7)"]
        },
        {
          title: "User Roles and Permissions",
          description: "Granular permission system with role-based access control and custom permission sets.",
          features: ["Role-based permissions", "Custom access levels", "Feature restrictions", "Audit logging"],
          permissions: ["File upload", "Report generation", "Team management", "API access"]
        },
        {
          title: "Team Invitation System",
          description: "Streamlined invitation process with role assignment, welcome emails, and onboarding workflows.",
          features: ["Email invitations", "Role pre-assignment", "Onboarding workflow", "Bulk invitations"],
          workflow: ["Send invitation", "Role assignment", "Welcome email", "First login setup"]
        },
        {
          title: "Access Control Settings",
          description: "Advanced access control with IP restrictions, time-based access, and security policies.",
          features: ["IP whitelisting", "Time-based access", "Security policies", "Session management"],
          security: ["2FA required", "IP restrictions", "Session timeout", "Login monitoring"]
        }
      ]
    },
    {
      category: "API Management",
      items: [
        {
          title: "API Key Dashboard",
          description: "Comprehensive API key management with usage tracking, rate limiting, and security controls.",
          features: ["Key generation", "Usage monitoring", "Rate limiting", "Security controls"],
          keys: ["Production (pk_live_...)", "Staging (pk_test_...)", "Development (pk_dev_...)"]
        },
        {
          title: "Environment Configuration",
          description: "Multi-environment setup with separate configurations for development, staging, and production.",
          features: ["Environment separation", "Configuration management", "Deployment controls", "Version tracking"],
          environments: ["Production", "Staging", "Development", "Testing"]
        },
        {
          title: "API Usage Monitoring",
          description: "Real-time API usage monitoring with analytics, error tracking, and performance metrics.",
          features: ["Real-time monitoring", "Error tracking", "Performance analytics", "Usage quotas"],
          metrics: ["89,234 calls today", "99.8% success rate", "45ms avg response", "2.1MB data transferred"]
        }
      ]
    },
    {
      category: "Enterprise Settings",
      items: [
        {
          title: "White-Label Configuration",
          description: "Complete white-label setup with custom domain, branding, and application customization.",
          features: ["Custom domain", "Brand customization", "UI theming", "Email templates"],
          settings: ["Domain: app.techcorp.com", "Theme: Corporate Blue", "Logo: TechCorp Industries", "Custom CSS"]
        },
        {
          title: "Custom Branding Options",
          description: "Advanced branding customization with logo upload, color schemes, and typography options.",
          features: ["Logo upload", "Color customization", "Typography", "Brand guidelines"],
          branding: ["Primary: #1E40AF", "Secondary: #64748B", "Accent: #10B981", "Font: Inter"]
        },
        {
          title: "Security Settings",
          description: "Enterprise security configuration with compliance controls, audit settings, and security policies.",
          features: ["Compliance controls", "Audit logging", "Security policies", "Encryption settings"],
          security: ["SOC 2 compliant", "GDPR ready", "Audit logging enabled", "End-to-end encryption"]
        },
        {
          title: "Compliance Controls",
          description: "Comprehensive compliance management with regulatory frameworks, audit trails, and reporting.",
          features: ["Regulatory compliance", "Audit trails", "Compliance reporting", "Policy enforcement"],
          compliance: ["GDPR", "CCPA", "HIPAA", "SOC 2 Type II"]
        }
      ]
    }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Enterprise Demo Walkthrough"
      description="Complete guide to the TechCorp Industries enterprise simulation environment"
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
            <Monitor className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Enterprise Demo Walkthrough</h1>
            <p className="text-xl text-slate-600 mt-2">
              Complete guide to the TechCorp Industries enterprise simulation environment
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<Monitor className="enterprise-icon-sm" />}>
            Demo Guide
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<Play className="enterprise-icon-sm" />}>
            Interactive Demo
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<Eye className="enterprise-icon-sm" />}>
            Step-by-Step
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Demo access info */}
        <EnterpriseCard className="mb-8 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-4">
            <Play className="h-8 w-8 text-blue-600 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Try the Live Demo</h2>
              <p className="text-slate-600 mb-4">
                Experience the full enterprise environment with the TechCorp Industries simulation. 
                No registration required - instant access to all enterprise features.
              </p>
              <EnterpriseButton variant="primary">
                Launch Enterprise Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </EnterpriseButton>
            </div>
          </div>
        </EnterpriseCard>

        {/* Screenshots sections */}
        {screenshots.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              {section.category === "Demo Access" && <Play className="mr-2 text-blue-600" size={24} />}
              {section.category === "Dashboard Overview" && <BarChart3 className="mr-2 text-green-600" size={24} />}
              {section.category === "Image Processing" && <Monitor className="mr-2 text-purple-600" size={24} />}
              {section.category === "Team Management" && <Users className="mr-2 text-orange-600" size={24} />}
              {section.category === "API Management" && <Settings className="mr-2 text-red-600" size={24} />}
              {section.category === "Enterprise Settings" && <Shield className="mr-2 text-indigo-600" size={24} />}
              {section.category}
            </h2>
            
            <div className="space-y-6">
              {section.items.map((item, itemIndex) => (
                <EnterpriseCard key={itemIndex}>
                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-100 p-3 rounded-lg flex-shrink-0">
                      <Eye className="h-6 w-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600 mb-4">{item.description}</p>
                      
                      {item.path && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-slate-700">Navigation Path:</span>
                          <code className="ml-2 px-2 py-1 bg-slate-100 rounded text-sm text-slate-800">
                            {item.path}
                          </code>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {item.features && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Key Features:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.features.map((feature, featureIndex) => (
                                <EnterpriseBadge key={featureIndex} variant="neutral">
                                  {feature}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.metrics && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Sample Metrics:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.metrics.map((metric, metricIndex) => (
                                <EnterpriseBadge key={metricIndex} variant="success">
                                  {metric}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.capabilities && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Capabilities:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.capabilities.map((capability, capIndex) => (
                                <EnterpriseBadge key={capIndex} variant="primary">
                                  {capability}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.data && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Sample Data:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.data.map((dataPoint, dataIndex) => (
                                <EnterpriseBadge key={dataIndex} variant="warning">
                                  {dataPoint}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.enterprise && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Enterprise Features:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.enterprise.map((feature, entIndex) => (
                                <EnterpriseBadge key={entIndex} variant="danger">
                                  {feature}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.templates && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Available Templates:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.templates.map((template, tempIndex) => (
                                <EnterpriseBadge key={tempIndex} variant="neutral">
                                  {template}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.roles && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">User Roles:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.roles.map((role, roleIndex) => (
                                <EnterpriseBadge key={roleIndex} variant="primary">
                                  {role}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.permissions && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Permissions:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.permissions.map((permission, permIndex) => (
                                <EnterpriseBadge key={permIndex} variant="success">
                                  {permission}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.workflow && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Workflow Steps:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.workflow.map((step, stepIndex) => (
                                <EnterpriseBadge key={stepIndex} variant="neutral">
                                  {stepIndex + 1}. {step}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.security && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Security Features:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.security.map((security, secIndex) => (
                                <EnterpriseBadge key={secIndex} variant="danger">
                                  {security}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.keys && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">API Keys:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.keys.map((key, keyIndex) => (
                                <EnterpriseBadge key={keyIndex} variant="warning">
                                  {key}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.environments && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Environments:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.environments.map((env, envIndex) => (
                                <EnterpriseBadge key={envIndex} variant="neutral">
                                  {env}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.settings && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Configuration:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.settings.map((setting, setIndex) => (
                                <EnterpriseBadge key={setIndex} variant="primary">
                                  {setting}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.branding && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Branding Options:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.branding.map((brand, brandIndex) => (
                                <EnterpriseBadge key={brandIndex} variant="success">
                                  {brand}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.compliance && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Compliance Standards:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.compliance.map((comp, compIndex) => (
                                <EnterpriseBadge key={compIndex} variant="danger">
                                  {comp}
                                </EnterpriseBadge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.activities && (
                          <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Recent Activities:</h4>
                            <div className="space-y-1">
                              {item.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="flex items-center text-sm text-slate-600">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  {activity}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </EnterpriseCard>
              ))}
            </div>
          </div>
        ))}

        {/* Call to Action */}
        <EnterpriseCard className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Experience the Full Demo?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Follow this walkthrough while exploring the live TechCorp Industries simulation. 
            See how ProofPix transforms enterprise image processing workflows.
          </p>
          <div className="flex justify-center space-x-4">
            <EnterpriseButton variant="primary">
              Launch Demo Environment
              <Play className="ml-2 h-4 w-4" />
            </EnterpriseButton>
            <EnterpriseButton variant="secondary">
              Schedule Live Demo
            </EnterpriseButton>
          </div>
        </EnterpriseCard>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </EnterpriseLayout>
  );
}; 