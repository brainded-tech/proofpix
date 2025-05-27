import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Shield, 
  Key, 
  Settings, 
  BarChart3, 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Globe,
  Lock,
  UserPlus,
  Copy,
  ExternalLink,
  Zap,
  Crown,
  Star
} from 'lucide-react';
import { BrandingUploadInterface } from "../components/enterprise/BrandingUploadInterface";
import { BrandColorPicker } from "../components/enterprise/BrandColorPicker";
import { BrandingPreview } from "../components/enterprise/BrandingPreview";

const EnterpriseDemo: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIndustry, setSelectedIndustry] = useState('legal'); // Default to legal
  
  // Industry-specific configurations
  const industryConfigs = {
    legal: {
      name: 'Legal Services',
      company: 'Morrison & Associates Law Firm',
      user: 'Sarah Chen',
      role: 'Digital Forensics Specialist',
      email: 'sarah.chen@morrisonlaw.com',
      color: '#1E40AF',
      icon: '⚖️'
    },
    insurance: {
      name: 'Insurance Claims',
      company: 'SecureGuard Insurance',
      user: 'Mike Rodriguez',
      role: 'Claims Investigation Manager',
      email: 'mike.rodriguez@secureguard.com',
      color: '#059669',
      icon: '🛡️'
    },
    healthcare: {
      name: 'Healthcare Documentation',
      company: 'MedTech Solutions',
      user: 'Dr. Lisa Wang',
      role: 'Chief Medical Information Officer',
      email: 'lisa.wang@medtechsolutions.com',
      color: '#DC2626',
      icon: '🏥'
    }
  };

  const currentIndustry = industryConfigs[selectedIndustry as keyof typeof industryConfigs];
  
  const [demoUser, setDemoUser] = useState({
    name: currentIndustry.user,
    role: currentIndustry.role,
    company: currentIndustry.company,
    email: currentIndustry.email,
    teamId: `team_${selectedIndustry}_demo`,
    permissions: ['api_access', 'custom_fields', 'team_management', 'white_label']
  });

  // Update demo user when industry changes
  useEffect(() => {
    const industry = industryConfigs[selectedIndustry as keyof typeof industryConfigs];
    setDemoUser({
      name: industry.user,
      role: industry.role,
      company: industry.company,
      email: industry.email,
      teamId: `team_${selectedIndustry}_demo`,
      permissions: ['api_access', 'custom_fields', 'team_management', 'white_label']
    });
  }, [selectedIndustry]);

  // Simulated enterprise data
  const [enterpriseData, setEnterpriseData] = useState({
    teamStats: {
      totalMembers: 47,
      activeUsers: 34,
      filesProcessed: 12847,
      apiCalls: 89234,
      storageUsed: '0 GB', // Client-side processing
      uptime: '99.97%'
    },
    recentActivity: [
      { user: 'Mike Johnson', action: 'Processed batch of 150 images', time: '2 minutes ago', type: 'batch' },
      { user: 'Lisa Wang', action: 'Generated forensic report', time: '15 minutes ago', type: 'report' },
      { user: 'David Smith', action: 'API integration test completed', time: '1 hour ago', type: 'api' },
      { user: 'Emma Davis', action: 'Custom field template created', time: '3 hours ago', type: 'template' }
    ],
    teamMembers: [
      { name: 'Sarah Chen', role: 'Admin', department: 'IT Security', lastActive: 'Now', status: 'online' },
      { name: 'Mike Johnson', role: 'Power User', department: 'Digital Forensics', lastActive: '5 min ago', status: 'online' },
      { name: 'Lisa Wang', role: 'User', department: 'Legal', lastActive: '1 hour ago', status: 'away' },
      { name: 'David Smith', role: 'Developer', department: 'Engineering', lastActive: '2 hours ago', status: 'offline' },
      { name: 'Emma Davis', role: 'User', department: 'Compliance', lastActive: '1 day ago', status: 'offline' }
    ],
    apiKeys: [
      { name: 'Production API', key: 'pk_live_enterprise_****7890', created: '2024-01-15', lastUsed: '2 minutes ago', status: 'active' },
      { name: 'Development API', key: 'pk_test_enterprise_****1234', created: '2024-01-10', lastUsed: '1 hour ago', status: 'active' },
      { name: 'Staging API', key: 'pk_staging_enterprise_****5678', created: '2024-01-08', lastUsed: '1 day ago', status: 'active' }
    ]
  });
  // 🎨 Enterprise Branding State
  const [brandingSettings, setBrandingSettings] = useState({
    colors: {
      primary: "#3B82F6",
      secondary: "#6B7280",
      accent: "#10B981",
      background: "#1F2937",
      text: "#FFFFFF"
    },
    logo: null as any,
    uploadedFiles: [] as any[]
  });


  // 🎨 Branding Handlers
  const handleBrandingFilesUploaded = (files: any[]) => {
    setBrandingSettings(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files],
      logo: files.find(f => f.type === "logo")?.preview || prev.logo
    }));
  };

  const handleBrandingColorsChange = (colors: any) => {
    setBrandingSettings(prev => ({ ...prev, colors }));
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {demoUser.name}
            </h2>
            <p className="text-gray-300">
              {demoUser.company} Enterprise Dashboard • {demoUser.role}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium mb-2">
              ✅ Enterprise Active
            </div>
            <p className="text-sm text-gray-400">Team ID: {demoUser.teamId}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Team Members</p>
              <p className="text-2xl font-bold text-white">{enterpriseData.teamStats.totalMembers}</p>
              <p className="text-green-400 text-sm">{enterpriseData.teamStats.activeUsers} active</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Files Processed</p>
              <p className="text-2xl font-bold text-white">{enterpriseData.teamStats.filesProcessed.toLocaleString()}</p>
              <p className="text-blue-400 text-sm">This month</p>
            </div>
            <FileText className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">API Calls</p>
              <p className="text-2xl font-bold text-white">{enterpriseData.teamStats.apiCalls.toLocaleString()}</p>
              <p className="text-purple-400 text-sm">This month</p>
            </div>
            <Zap className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Uptime</p>
              <p className="text-2xl font-bold text-white">{enterpriseData.teamStats.uptime}</p>
              <p className="text-green-400 text-sm">SLA: 99.9%</p>
            </div>
            <Shield className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="h-5 w-5 text-blue-400 mr-2" />
          Recent Team Activity
        </h3>
        <div className="space-y-3">
          {enterpriseData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'batch' ? 'bg-blue-400' :
                  activity.type === 'report' ? 'bg-green-400' :
                  activity.type === 'api' ? 'bg-purple-400' : 'bg-yellow-400'
                }`}></div>
                <div>
                  <p className="text-white font-medium">{activity.user}</p>
                  <p className="text-gray-400 text-sm">{activity.action}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveTab('processing')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-6 rounded-lg transition-all duration-200 text-left"
        >
          <Upload className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Process Images</h3>
          <p className="text-blue-100 text-sm">Upload and analyze image metadata</p>
        </button>

        <button 
          onClick={() => setActiveTab('api')}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-6 rounded-lg transition-all duration-200 text-left"
        >
          <Key className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">API Management</h3>
          <p className="text-purple-100 text-sm">Manage API keys and integrations</p>
        </button>

        <button 
          onClick={() => setActiveTab('team')}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-6 rounded-lg transition-all duration-200 text-left"
        >
          <Users className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Team Management</h3>
          <p className="text-green-100 text-sm">Manage users and permissions</p>
        </button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Upload className="h-5 w-5 text-blue-400 mr-2" />
          Enterprise Image Processing
        </h3>
        
        {/* Enterprise Features Notice */}
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Enterprise Features Active</span>
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Batch processing up to 1000 images</li>
            <li>• Custom metadata fields and templates</li>
            <li>• White-label PDF reports with company branding</li>
            <li>• API integration for automated workflows</li>
            <li>• Priority processing and dedicated resources</li>
          </ul>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">Upload Images for Analysis</h4>
          <p className="text-gray-400 mb-4">
            Drag and drop images here, or click to browse. Enterprise accounts support batch processing.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Select Files
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
              Batch Upload
            </button>
          </div>
        </div>

        {/* Processing Templates */}
        <div className="mt-6">
          <h4 className="text-white font-medium mb-3">Enterprise Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h5 className="text-white font-medium mb-2">Legal Discovery Template</h5>
              <p className="text-gray-400 text-sm mb-3">Court-ready metadata reports with chain of custody</p>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm">Active</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h5 className="text-white font-medium mb-2">Insurance Claims Template</h5>
              <p className="text-gray-400 text-sm mb-3">Standardized documentation for claims processing</p>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamManagement = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Users className="h-5 w-5 text-blue-400 mr-2" />
            Team Management
          </h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </button>
        </div>

        {/* Team Members */}
        <div className="space-y-3">
          {enterpriseData.teamMembers.map((member, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  member.status === 'online' ? 'bg-green-400' :
                  member.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                }`}></div>
                <div>
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-gray-400 text-sm">{member.department} • {member.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Last active: {member.lastActive}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs ${
                    member.role === 'Admin' ? 'bg-red-500/20 text-red-300' :
                    member.role === 'Power User' ? 'bg-purple-500/20 text-purple-300' :
                    member.role === 'Developer' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {member.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Settings */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-white font-medium mb-4">Team Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <h5 className="text-white font-medium mb-2">Default Permissions</h5>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked className="rounded" />
                  <span className="text-gray-300 text-sm">API Access</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked className="rounded" />
                  <span className="text-gray-300 text-sm">Custom Fields</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-300 text-sm">Team Management</span>
                </label>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <h5 className="text-white font-medium mb-2">Team Limits</h5>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Max Members: 50</p>
                <p>API Rate Limit: 10,000/hour</p>
                <p>Storage: Unlimited (client-side)</p>
                <p>Support: Priority 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPIManagement = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Key className="h-5 w-5 text-blue-400 mr-2" />
            API Management
          </h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Generate New Key
          </button>
        </div>

        {/* API Keys */}
        <div className="space-y-4">
          {enterpriseData.apiKeys.map((apiKey, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">{apiKey.name}</h4>
                  <p className="text-gray-400 text-sm">Created: {apiKey.created}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                    {apiKey.status}
                  </span>
                  <button className="text-gray-400 hover:text-white">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <code className="bg-gray-800 text-gray-300 px-3 py-1 rounded font-mono text-sm flex-1">
                  {apiKey.key}
                </code>
                <button className="text-gray-400 hover:text-white">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-500 text-sm">Last used: {apiKey.lastUsed}</p>
            </div>
          ))}
        </div>

        {/* API Documentation */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-white font-medium mb-4">API Documentation & Integration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <h5 className="text-white font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Documentation
              </h5>
              <p className="text-gray-400 text-sm mb-3">
                Complete API reference with examples and SDKs
              </p>
              <button 
                onClick={() => navigate('/docs/enterprise-api')}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
              >
                View API Docs <ExternalLink className="h-3 w-3 ml-1" />
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <h5 className="text-white font-medium mb-2 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Usage Analytics
              </h5>
              <p className="text-gray-400 text-sm mb-3">
                Monitor API usage, performance, and errors
              </p>
              <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                View Analytics <ExternalLink className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <Settings className="h-5 w-5 text-blue-400 mr-2" />
          Enterprise Settings
        </h3>

        {/* White Label Settings */}
        <div className="mb-8">
          <h4 className="text-white font-medium mb-4">White Label Configuration</h4>
          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Company Name</label>
              <input 
                type="text" 
                value={demoUser.company}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Custom Domain</label>
              <input 
                type="text" 
                value="exif.techcorp.com"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                readOnly
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" checked className="rounded" />
              <span className="text-gray-300 text-sm">Hide ProofPix branding</span>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="mb-8">
          <h4 className="text-white font-medium mb-4">Security Configuration</h4>
          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Single Sign-On (SSO)</p>
                <p className="text-gray-400 text-sm">SAML 2.0 integration with your identity provider</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400 text-sm">Configured</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Multi-Factor Authentication</p>
                <p className="text-gray-400 text-sm">Required for all team members</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400 text-sm">Enforced</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">IP Whitelisting</p>
                <p className="text-gray-400 text-sm">Restrict access to approved IP ranges</p>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm">Optional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div>
          <h4 className="text-white font-medium mb-4">Compliance & Audit</h4>
          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-300 text-sm">SOC 2 Type II Ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-300 text-sm">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-300 text-sm">HIPAA Ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-300 text-sm">Audit Logging Enabled</span>
              </div>
            </div>

      {/* 🎨 Enterprise Branding Section */}
      <div className="space-y-6 mt-8">
        <BrandingUploadInterface onFilesUploaded={handleBrandingFilesUploaded} />
        <BrandColorPicker onColorsChange={handleBrandingColorsChange} />
        <BrandingPreview colors={brandingSettings.colors} logo={brandingSettings.logo} />
      </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <Building2 className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <h1 className="text-xl font-bold">ProofPix Enterprise</h1>
                  <p className="text-sm" style={{ color: currentIndustry.color }}>
                    {currentIndustry.icon} {demoUser.company}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Industry Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Industry:</span>
                <select 
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="legal">⚖️ Legal Services</option>
                  <option value="insurance">🛡️ Insurance Claims</option>
                  <option value="healthcare">🏥 Healthcare</option>
                </select>
              </div>
              
              <div className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Star className="h-4 w-4 mr-1" />
                DEMO MODE
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{demoUser.name}</p>
                <p className="text-gray-400 text-sm">{demoUser.role}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 space-y-2">
            <nav className="space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'processing', label: 'Image Processing', icon: Upload },
                { id: 'team', label: 'Team Management', icon: Users },
                { id: 'api', label: 'API Management', icon: Key },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Demo Info */}
            <div className="mt-8 bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-yellow-300 font-medium mb-2 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Demo Environment
              </h4>
              <p className="text-yellow-200 text-sm mb-3">
                This is a simulated enterprise environment showing how teams access and use ProofPix.
              </p>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/enterprise/industry-demos')}
                  className="block w-full text-left text-yellow-300 hover:text-yellow-200 text-sm underline"
                >
                  🏢 Detailed Industry Demos →
                </button>
                <button 
                  onClick={() => navigate('/enterprise')}
                  className="block w-full text-left text-yellow-300 hover:text-yellow-200 text-sm underline"
                >
                  Learn about Enterprise →
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'processing' && renderProcessing()}
            {activeTab === 'team' && renderTeamManagement()}
            {activeTab === 'api' && renderAPIManagement()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDemo; 
 