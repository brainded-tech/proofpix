import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Users, Settings, BarChart3, Shield, ArrowRight, Play, Eye, CheckCircle } from 'lucide-react';
import DocumentationFooter from '../../components/DocumentationFooter';

export const EnterpriseDemoWalkthrough: React.FC = () => {
  const screenshots = [
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 text-sm">
        <Link to="/docs" className="text-blue-600 hover:underline">Documentation</Link>
        <span className="mx-2">/</span>
        <Link to="/docs" className="text-blue-600 hover:underline">Enterprise</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Demo Walkthrough</span>
      </nav>

      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <Monitor className="mr-3 text-blue-600" size={32} />
          Enterprise Demo Walkthrough
        </h1>
        <p className="text-xl text-gray-600">
          Complete guide to the TechCorp Industries enterprise simulation environment
        </p>
      </div>

      {/* Demo access info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
        <div className="flex items-center mb-3">
          <Play className="mr-2 text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-blue-900">Try the Demo Yourself</h3>
        </div>
        <p className="text-blue-800 mb-4">
          Experience the full enterprise environment by visiting our interactive demo. No registration required!
        </p>
        <Link 
          to="/enterprise/demo" 
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play className="mr-2" size={16} />
          Launch Enterprise Demo
        </Link>
      </div>

      {/* Table of contents */}
      <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Walkthrough Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {screenshots.map((section, index) => (
            <a 
              key={index}
              href={`#${section.category.toLowerCase().replace(' ', '-')}`} 
              className="text-blue-600 hover:underline text-sm"
            >
              {section.category} ({section.items.length} screenshots)
            </a>
          ))}
        </div>
      </nav>

      {/* Screenshot sections */}
      {screenshots.map((section, sectionIndex) => (
        <section key={sectionIndex} id={section.category.toLowerCase().replace(' ', '-')} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            {sectionIndex === 0 && <Eye className="mr-2 text-green-500" size={24} />}
            {sectionIndex === 1 && <BarChart3 className="mr-2 text-blue-500" size={24} />}
            {sectionIndex === 2 && <Monitor className="mr-2 text-purple-500" size={24} />}
            {sectionIndex === 3 && <Users className="mr-2 text-orange-500" size={24} />}
            {sectionIndex === 4 && <Settings className="mr-2 text-gray-500" size={24} />}
            {sectionIndex === 5 && <Shield className="mr-2 text-red-500" size={24} />}
            {section.category}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>

                {/* Screenshot placeholder */}
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center">
                  <Monitor className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-500 text-sm">Screenshot: {item.title}</p>
                  {(item as any).path && (
                    <p className="text-xs text-gray-400 mt-1">Path: {(item as any).path}</p>
                  )}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {item.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="mr-2 text-green-500" size={14} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics */}
                {(item as any).metrics && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Sample Metrics:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(item as any).metrics.map((metric: any, metricIndex: number) => (
                        <div key={metricIndex} className="bg-gray-50 p-2 rounded text-xs text-gray-600">
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional data */}
                {(item as any).data && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Sample Data:</h4>
                    <div className="space-y-1">
                      {(item as any).data.map((dataItem: any, dataIndex: number) => (
                        <div key={dataIndex} className="text-xs text-gray-600 font-mono bg-gray-50 p-1 rounded">
                          {dataItem}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enterprise features */}
                {(item as any).enterprise && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Enterprise Features:</h4>
                    <div className="space-y-1">
                      {(item as any).enterprise.map((feature: any, featureIndex: number) => (
                        <div key={featureIndex} className="text-xs text-purple-600 bg-purple-50 p-1 rounded">
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional categorized data */}
                {((item as any).roles || (item as any).permissions || (item as any).workflow || (item as any).security || (item as any).keys || (item as any).environments || (item as any).settings || (item as any).branding || (item as any).compliance || (item as any).templates || (item as any).capabilities || (item as any).activities) && (
                  <div className="text-xs text-gray-500">
                    {(item as any).roles && <div>Roles: {(item as any).roles.join(', ')}</div>}
                    {(item as any).permissions && <div>Permissions: {(item as any).permissions.join(', ')}</div>}
                    {(item as any).workflow && <div>Workflow: {(item as any).workflow.join(' → ')}</div>}
                    {(item as any).security && <div>Security: {(item as any).security.join(', ')}</div>}
                    {(item as any).keys && <div>API Keys: {(item as any).keys.join(', ')}</div>}
                    {(item as any).environments && <div>Environments: {(item as any).environments.join(', ')}</div>}
                    {(item as any).settings && <div>Settings: {(item as any).settings.join(', ')}</div>}
                    {(item as any).branding && <div>Branding: {(item as any).branding.join(', ')}</div>}
                    {(item as any).compliance && <div>Compliance: {(item as any).compliance.join(', ')}</div>}
                    {(item as any).templates && <div>Templates: {(item as any).templates.join(', ')}</div>}
                    {(item as any).capabilities && <div>Capabilities: {(item as any).capabilities.join(', ')}</div>}
                    {(item as any).activities && <div>Recent: {(item as any).activities.join(', ')}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Getting started guide */}
      <section className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started with the Demo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Start Steps</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">1</span>
                Visit the Enterprise page
              </li>
              <li className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">2</span>
                Click "Try Demo" button
              </li>
              <li className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">3</span>
                Explore TechCorp Industries environment
              </li>
              <li className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">4</span>
                Test all enterprise features
              </li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Demo Highlights</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                47 simulated team members
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                12,847 processed files
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                Complete enterprise dashboard
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={14} />
                Full API management
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer navigation */}
      <nav className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link 
            to="/docs/implementation-status" 
            className="flex items-center text-blue-600 hover:underline"
          >
            ← Previous: Implementation Status
          </Link>
          <Link 
            to="/docs/sales-playbook" 
            className="flex items-center text-blue-600 hover:underline"
          >
            Next: Sales Playbook →
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </nav>

      <DocumentationFooter />
    </div>
  );
}; 