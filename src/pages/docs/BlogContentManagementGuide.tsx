import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { EnterpriseButton, EnterpriseCard, EnterpriseBadge } from '../../components/ui/EnterpriseComponents';
import { ArrowLeft, Edit3, Users, Globe, Settings, Calendar, BarChart3, Shield } from 'lucide-react';

const BlogContentManagementGuide: React.FC = () => {
  const navigate = useNavigate();

  return (
    <EnterpriseLayout
      showHero
      title="Blog Content Management Guide"
      description="Complete guide to managing blog content and CMS features in ProofPix"
      maxWidth="4xl"
    >
      <div className="space-y-8">
        {/* Navigation */}
        <EnterpriseButton
          variant="ghost"
          onClick={() => navigate('/docs')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documentation
        </EnterpriseButton>

        {/* Overview */}
        <EnterpriseCard>
          <div className="flex items-center mb-4">
            <Edit3 className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
          </div>
          <p className="text-slate-600 mb-4">
            ProofPix includes a comprehensive Content Management System (CMS) designed for both internal content creation 
            and enterprise client content management. This guide covers all aspects of the blog and content management features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Dual Purpose</h3>
              <p className="text-sm text-slate-600">Internal & Enterprise</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Rich Editor</h3>
              <p className="text-sm text-slate-600">Markdown Support</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Role-Based</h3>
              <p className="text-sm text-slate-600">Access Control</p>
            </div>
          </div>
        </EnterpriseCard>

        {/* Quick Access */}
        <EnterpriseCard variant="dark">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnterpriseButton
              variant="primary"
              onClick={() => navigate('/blog')}
              className="flex items-center justify-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Access Blog CMS
            </EnterpriseButton>
            <EnterpriseButton
              variant="secondary"
              onClick={() => navigate('/content-management')}
              className="flex items-center justify-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Content Management
            </EnterpriseButton>
          </div>
        </EnterpriseCard>

        {/* Features */}
        <EnterpriseCard>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Features</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Rich Text Editor</h3>
              <p className="text-slate-600 mb-2">
                Full-featured editor with Markdown support, real-time preview, and advanced formatting options.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Markdown syntax highlighting</li>
                <li>Live preview mode</li>
                <li>Image upload and management</li>
                <li>Code block support</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Content Organization</h3>
              <p className="text-slate-600 mb-2">
                Organize content with categories, tags, and advanced filtering options.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Category management</li>
                <li>Tag system</li>
                <li>Search and filtering</li>
                <li>Content scheduling</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Publishing Workflow</h3>
              <p className="text-slate-600 mb-2">
                Complete publishing workflow with draft management and scheduling capabilities.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Draft, published, and scheduled states</li>
                <li>Editorial calendar</li>
                <li>SEO optimization tools</li>
                <li>Social media integration</li>
              </ul>
            </div>
          </div>
        </EnterpriseCard>

        {/* Getting Started */}
        <EnterpriseCard>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Access the Blog CMS</h3>
                <p className="text-slate-600">Navigate to <code className="bg-slate-100 px-2 py-1 rounded">/blog</code> to access the content management interface.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Create Your First Post</h3>
                <p className="text-slate-600">Click "Create Post" to open the rich text editor and start writing your content.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Configure Settings</h3>
                <p className="text-slate-600">Set up categories, tags, SEO settings, and publishing preferences.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Publish or Schedule</h3>
                <p className="text-slate-600">Choose to publish immediately, save as draft, or schedule for future publication.</p>
              </div>
            </div>
          </div>
        </EnterpriseCard>

        {/* Advanced Features */}
        <EnterpriseCard>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Editorial Calendar
              </h3>
              <p className="text-slate-600 mb-3">
                Plan and schedule content with the integrated editorial calendar.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Visual content planning</li>
                <li>Deadline tracking</li>
                <li>Team collaboration</li>
                <li>Content pipeline management</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Analytics & Insights
              </h3>
              <p className="text-slate-600 mb-3">
                Track content performance with detailed analytics.
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>View counts and engagement</li>
                <li>Popular content identification</li>
                <li>SEO performance tracking</li>
                <li>Reader behavior analysis</li>
              </ul>
            </div>
          </div>
        </EnterpriseCard>

        {/* Enterprise Features */}
        <EnterpriseCard variant="dark">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Enterprise Features</h2>
            <EnterpriseBadge variant="primary" className="ml-3">Enterprise</EnterpriseBadge>
          </div>
          <p className="text-blue-100 mb-6">
            Advanced content management features for enterprise clients and internal teams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Multi-tenant Support</h3>
              <p className="text-blue-200 text-sm">
                Separate content spaces for different clients and departments with role-based access control.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Custom Branding</h3>
              <p className="text-blue-200 text-sm">
                White-label the CMS interface with client branding and custom themes.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">API Integration</h3>
              <p className="text-blue-200 text-sm">
                Integrate with external systems via REST API for automated content workflows.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Compliance Features</h3>
              <p className="text-blue-200 text-sm">
                Built-in compliance tools for GDPR, HIPAA, and other regulatory requirements.
              </p>
            </div>
          </div>
        </EnterpriseCard>

        {/* Next Steps */}
        <EnterpriseCard>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnterpriseButton
              variant="primary"
              onClick={() => navigate('/blog/new')}
              className="flex items-center justify-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Create First Post
            </EnterpriseButton>
            <EnterpriseButton
              variant="secondary"
              onClick={() => navigate('/docs/comprehensive-api-guide')}
              className="flex items-center justify-center"
            >
              API Documentation
            </EnterpriseButton>
            <EnterpriseButton
              variant="secondary"
              onClick={() => navigate('/enterprise')}
              className="flex items-center justify-center"
            >
              Enterprise Features
            </EnterpriseButton>
          </div>
        </EnterpriseCard>
      </div>
    </EnterpriseLayout>
  );
};

export default BlogContentManagementGuide; 