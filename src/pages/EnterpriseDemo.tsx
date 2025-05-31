import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Star,
  ArrowLeft
} from 'lucide-react';
import { BrandingUploadInterface } from "../components/enterprise/BrandingUploadInterface";
import { BrandColorPicker } from "../components/enterprise/BrandColorPicker";
import { BrandingPreview } from "../components/enterprise/BrandingPreview";
import { StandardLayout } from '../components/ui/StandardLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseMetric,
  EnterpriseSection,
  EnterpriseGrid
} from '../components/ui/EnterpriseComponents';
import { EnterpriseDemo as EnterpriseShowcase } from '../components/EnterpriseDemo';
import DemoModeController from '../components/demo/DemoModeController';
import demoDataService from '../services/demoDataService';

// Type definitions for enterprise data
interface TeamStats {
  totalMembers: number;
  activeUsers: number;
  filesProcessed: number;
  apiCalls: number;
  storageUsed: string;
  uptime: string;
}

interface RecentActivity {
  user: string;
  action: string;
  time: string;
  type: string;
}

interface TeamMember {
  name: string;
  role: string;
  department: string;
  lastActive: string;
  status: 'online' | 'away' | 'offline';
}

interface ApiKey {
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: string;
}

interface EnterpriseData {
  teamStats: TeamStats;
  recentActivity: RecentActivity[];
  teamMembers: TeamMember[];
  apiKeys: ApiKey[];
}

const EnterpriseDemo: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');
  
  // Define all state hooks unconditionally at the top level
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIndustry, setSelectedIndustry] = useState('legal'); // Default to legal
  const [industryData, setIndustryData] = useState<any>(null);
  const [demoUser, setDemoUser] = useState<any>(null);
  const [enterpriseData, setEnterpriseData] = useState<EnterpriseData | null>(null);
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
  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: 'strict',
    mfaEnabled: true,
    sessionTimeout: 30,
    ipRestrictions: false,
    dataRetention: 90
  });
  const [processing, setProcessing] = useState({
    status: 'idle',
    progress: 0,
    results: null as any
  });
  
  // Demo staging state
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoScenario, setDemoScenario] = useState<any>(null);
  
  // Demo handlers
  const handleDemoStart = (scenario: any) => {
    setIsDemoMode(true);
    setDemoScenario(scenario);
    // Start demo session with enterprise scenario
    demoDataService.startDemoSession('enterprise', demoUser?.email);
  };

  const handleDemoEnd = () => {
    setIsDemoMode(false);
    setDemoScenario(null);
    demoDataService.endDemoSession();
  };
  
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

  // Initialize data based on selected industry
  useEffect(() => {
    const industry = industryConfigs[selectedIndustry as keyof typeof industryConfigs];
    setIndustryData(industry);
    
    // Set demo user
    setDemoUser({
      name: industry.user,
      role: industry.role,
      company: industry.company,
      email: industry.email,
      teamId: `team_${selectedIndustry}_demo`,
      permissions: ['api_access', 'custom_fields', 'team_management', 'white_label']
    });
    
    // Set enterprise data based on industry
    setEnterpriseData({
      teamStats: {
        totalMembers: selectedIndustry === 'legal' ? 47 : (selectedIndustry === 'insurance' ? 63 : 38),
        activeUsers: selectedIndustry === 'legal' ? 34 : (selectedIndustry === 'insurance' ? 48 : 29),
        filesProcessed: selectedIndustry === 'legal' ? 12847 : (selectedIndustry === 'insurance' ? 24982 : 8743),
        apiCalls: selectedIndustry === 'legal' ? 89234 : (selectedIndustry === 'insurance' ? 103478 : 67352),
        storageUsed: '0 GB', // Client-side processing
        uptime: '99.97%'
      },
      recentActivity: [
        { user: selectedIndustry === 'legal' ? 'Mike Johnson' : (selectedIndustry === 'insurance' ? 'James Wilson' : 'Dr. Emma Lin'), action: 'Processed batch of 150 images', time: '2 minutes ago', type: 'batch' },
        { user: selectedIndustry === 'legal' ? 'Lisa Wang' : (selectedIndustry === 'insurance' ? 'Sarah Parker' : 'Dr. Robert Kim'), action: 'Generated forensic report', time: '15 minutes ago', type: 'report' },
        { user: selectedIndustry === 'legal' ? 'David Smith' : (selectedIndustry === 'insurance' ? 'Michael Brown' : 'Dr. John Davis'), action: 'API integration test completed', time: '1 hour ago', type: 'api' },
        { user: selectedIndustry === 'legal' ? 'Emma Davis' : (selectedIndustry === 'insurance' ? 'Emily Thompson' : 'Dr. Susan Lee'), action: 'Custom field template created', time: '3 hours ago', type: 'template' }
      ],
      teamMembers: [
        { name: industry.user, role: 'Admin', department: selectedIndustry === 'legal' ? 'IT Security' : (selectedIndustry === 'insurance' ? 'Claims Processing' : 'Medical Records'), lastActive: 'Now', status: 'online' },
        { name: selectedIndustry === 'legal' ? 'Mike Johnson' : (selectedIndustry === 'insurance' ? 'James Wilson' : 'Dr. Emma Lin'), role: 'Power User', department: selectedIndustry === 'legal' ? 'Digital Forensics' : (selectedIndustry === 'insurance' ? 'Field Investigations' : 'Radiology'), lastActive: '5 min ago', status: 'online' },
        { name: selectedIndustry === 'legal' ? 'Lisa Wang' : (selectedIndustry === 'insurance' ? 'Sarah Parker' : 'Dr. Robert Kim'), role: 'User', department: selectedIndustry === 'legal' ? 'Legal' : (selectedIndustry === 'insurance' ? 'Documentation' : 'Cardiology'), lastActive: '1 hour ago', status: 'away' },
        { name: selectedIndustry === 'legal' ? 'David Smith' : (selectedIndustry === 'insurance' ? 'Michael Brown' : 'Dr. John Davis'), role: 'Developer', department: selectedIndustry === 'legal' ? 'Engineering' : (selectedIndustry === 'insurance' ? 'IT' : 'Health Informatics'), lastActive: '2 hours ago', status: 'offline' },
        { name: selectedIndustry === 'legal' ? 'Emma Davis' : (selectedIndustry === 'insurance' ? 'Emily Thompson' : 'Dr. Susan Lee'), role: 'User', department: selectedIndustry === 'legal' ? 'Compliance' : (selectedIndustry === 'insurance' ? 'Compliance' : 'Compliance'), lastActive: '1 day ago', status: 'offline' }
      ],
      apiKeys: [
        { name: 'Production API', key: 'pk_live_enterprise_****7890', created: '2024-01-15', lastUsed: '2 minutes ago', status: 'active' },
        { name: 'Development API', key: 'pk_test_enterprise_****1234', created: '2024-01-10', lastUsed: '1 hour ago', status: 'active' },
        { name: 'Staging API', key: 'pk_staging_enterprise_****5678', created: '2024-01-08', lastUsed: '1 day ago', status: 'active' }
      ]
    });
  }, [selectedIndustry]);

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

  // If the view is "showcase", render the marketing showcase view
  if (view === 'showcase') {
    return <EnterpriseShowcase />;
  }
  
  // Only render the main dashboard once the data is loaded
  if (!demoUser || !enterpriseData || !industryData) {
    return (
      <StandardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <p className="text-lg text-slate-600">Loading enterprise demo...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  const renderDashboard = () => (
    <EnterpriseSection size="lg">
      {/* Welcome Header */}
      <EnterpriseCard variant="dark" className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {demoUser.name}
            </h2>
            <p className="text-slate-300">
              {demoUser.company} Enterprise Dashboard • {demoUser.role}
            </p>
          </div>
          <div className="text-right">
            <EnterpriseBadge variant="success" className="mb-2">
              ✅ Enterprise Active
            </EnterpriseBadge>
            <p className="text-sm text-slate-400">Team ID: {demoUser.teamId}</p>
          </div>
        </div>
      </EnterpriseCard>

      {/* Quick Stats */}
      <EnterpriseGrid columns={4} className="mb-8">
        <EnterpriseCard>
          <div className="flex items-center justify-between">
            <div>
              <EnterpriseMetric 
                value={enterpriseData.teamStats.totalMembers.toString()} 
                label="Team Members" 
              />
              <p className="text-green-600 text-sm mt-1">{enterpriseData.teamStats.activeUsers} active</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </EnterpriseCard>

        <EnterpriseCard>
          <div className="flex items-center justify-between">
            <div>
              <EnterpriseMetric 
                value={enterpriseData.teamStats.filesProcessed.toLocaleString()} 
                label="Files Processed" 
              />
              <p className="text-blue-600 text-sm mt-1">This month</p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </EnterpriseCard>

        <EnterpriseCard>
          <div className="flex items-center justify-between">
            <div>
              <EnterpriseMetric 
                value={enterpriseData.teamStats.apiCalls.toLocaleString()} 
                label="API Calls" 
              />
              <p className="text-purple-600 text-sm mt-1">This month</p>
            </div>
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
        </EnterpriseCard>

        <EnterpriseCard>
          <div className="flex items-center justify-between">
            <div>
              <EnterpriseMetric 
                value={enterpriseData.teamStats.uptime} 
                label="System Uptime" 
              />
              <p className="text-green-600 text-sm mt-1">Last 30 days</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </EnterpriseCard>
      </EnterpriseGrid>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnterpriseCard>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {enterpriseData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{activity.user}</p>
                  <p className="text-sm text-slate-600">{activity.action}</p>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </EnterpriseCard>

        <EnterpriseCard>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-slate-900">API Services</span>
              </div>
              <EnterpriseBadge variant="success">Operational</EnterpriseBadge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-slate-900">Processing Engine</span>
              </div>
              <EnterpriseBadge variant="success">Operational</EnterpriseBadge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-slate-900">Security Systems</span>
              </div>
              <EnterpriseBadge variant="success">Operational</EnterpriseBadge>
            </div>
          </div>
        </EnterpriseCard>
      </div>
    </EnterpriseSection>
  );

  const renderProcessing = () => (
    <EnterpriseSection size="lg">
      <EnterpriseCard>
        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
          <Upload className="h-5 w-5 text-blue-600 mr-2" />
          Enterprise Image Processing
        </h3>
        
        {/* Enterprise Features Notice */}
        <EnterpriseCard variant="dark" className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Enterprise Features Active</span>
          </div>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Batch processing up to 1000 images</li>
            <li>• Custom metadata fields and templates</li>
            <li>• White-label PDF reports with company branding</li>
            <li>• API integration for automated workflows</li>
            <li>• Priority processing and dedicated resources</li>
          </ul>
        </EnterpriseCard>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-900 mb-2">Upload Images for Analysis</h4>
          <p className="text-slate-600 mb-4">
            Drag and drop images here, or click to browse. Enterprise accounts support batch processing.
          </p>
          <div className="flex justify-center space-x-4">
            <EnterpriseButton variant="primary">
              Select Files
            </EnterpriseButton>
            <EnterpriseButton variant="secondary">
              Batch Upload
            </EnterpriseButton>
          </div>
        </div>

        {/* Processing Templates */}
        <div className="mt-6">
          <h4 className="text-slate-900 font-medium mb-3">Enterprise Templates</h4>
          <EnterpriseGrid columns={2}>
            <EnterpriseCard>
              <h5 className="text-slate-900 font-medium mb-2">Legal Discovery Template</h5>
              <p className="text-slate-600 text-sm mb-3">Court-ready metadata reports with chain of custody</p>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <EnterpriseBadge variant="success">Active</EnterpriseBadge>
              </div>
            </EnterpriseCard>
            <EnterpriseCard>
              <h5 className="text-slate-900 font-medium mb-2">Insurance Claims Template</h5>
              <p className="text-slate-600 text-sm mb-3">Standardized documentation for claims processing</p>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <EnterpriseBadge variant="success">Active</EnterpriseBadge>
              </div>
            </EnterpriseCard>
          </EnterpriseGrid>
        </div>
      </EnterpriseCard>
    </EnterpriseSection>
  );

  const renderTeamManagement = () => (
    <EnterpriseSection size="lg">
      <EnterpriseCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            Team Management
          </h3>
          <EnterpriseButton variant="primary">
            <UserPlus className="h-5 w-5 mr-2" />
            Invite Member
          </EnterpriseButton>
        </div>

        {/* Team Members */}
        <div className="space-y-3 mb-6">
          {enterpriseData.teamMembers.map((member, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  member.status === 'online' ? 'bg-green-500' :
                  member.status === 'away' ? 'bg-yellow-500' : 'bg-slate-400'
                }`}></div>
                <div>
                  <p className="text-slate-900 font-medium">{member.name}</p>
                  <p className="text-slate-600 text-sm">{member.department} • {member.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-600 text-sm">Last active: {member.lastActive}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <EnterpriseBadge variant={
                    member.role === 'Admin' ? 'danger' :
                    member.role === 'Power User' ? 'primary' :
                    member.role === 'Developer' ? 'primary' :
                    'neutral'
                  }>
                    {member.role}
                  </EnterpriseBadge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Settings */}
        <div className="pt-6 border-t border-slate-200">
          <h4 className="text-slate-900 font-medium mb-4">Team Settings</h4>
          <EnterpriseGrid columns={2}>
            <EnterpriseCard>
              <h5 className="text-slate-900 font-medium mb-2">Default Permissions</h5>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked className="rounded text-blue-600" />
                  <span className="text-slate-700 text-sm">API Access</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked className="rounded text-blue-600" />
                  <span className="text-slate-700 text-sm">Custom Fields</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span className="text-slate-700 text-sm">Team Management</span>
                </label>
              </div>
            </EnterpriseCard>
            <EnterpriseCard>
              <h5 className="text-slate-900 font-medium mb-2">Team Limits</h5>
              <div className="space-y-2 text-sm text-slate-600">
                <p>Max Members: 50</p>
                <p>API Rate Limit: 10,000/hour</p>
                <p>Storage: Unlimited (client-side)</p>
                <p>Support: Priority 24/7</p>
              </div>
            </EnterpriseCard>
          </EnterpriseGrid>
        </div>
      </EnterpriseCard>
    </EnterpriseSection>
  );

  const renderAPIManagement = () => (
    <EnterpriseSection size="lg">
      <EnterpriseCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center">
            <Key className="h-5 w-5 text-blue-600 mr-2" />
            API Management
          </h3>
          <EnterpriseButton variant="primary">
            Generate New Key
          </EnterpriseButton>
        </div>

        {/* API Keys */}
        <div className="space-y-4">
          {enterpriseData.apiKeys.map((apiKey, index) => (
            <EnterpriseCard key={index}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-slate-900 font-medium">{apiKey.name}</h4>
                  <p className="text-slate-600 text-sm">Created: {apiKey.created}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <EnterpriseBadge variant="success">
                    {apiKey.status}
                  </EnterpriseBadge>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <code className="bg-slate-100 text-slate-700 px-3 py-1 rounded font-mono text-sm flex-1">
                  {apiKey.key}
                </code>
                <button className="text-slate-400 hover:text-slate-600">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-slate-500 text-sm">Last used: {apiKey.lastUsed}</p>
            </EnterpriseCard>
          ))}
        </div>

        {/* API Documentation */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-slate-900 font-medium mb-4">API Documentation & Integration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnterpriseCard>
              <h5 className="text-slate-900 font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Documentation
              </h5>
              <p className="text-slate-600 text-sm mb-3">
                Complete API reference with examples and SDKs
              </p>
              <button 
                onClick={() => navigate('/docs/enterprise-api')}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
              >
                View API Docs <ExternalLink className="h-3 w-3 ml-1" />
              </button>
            </EnterpriseCard>
            <EnterpriseCard>
              <h5 className="text-slate-900 font-medium mb-2 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Usage Analytics
              </h5>
              <p className="text-slate-600 text-sm mb-3">
                Monitor API usage, performance, and errors
              </p>
              <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                View Analytics <ExternalLink className="h-3 w-3 ml-1" />
              </button>
            </EnterpriseCard>
          </div>
        </div>
      </EnterpriseCard>
    </EnterpriseSection>
  );

  const renderSettings = () => (
    <EnterpriseSection size="lg">
      <EnterpriseCard>
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
          <Settings className="h-5 w-5 text-blue-600 mr-2" />
          Enterprise Settings
        </h3>

        {/* White-label Configuration */}
        <div className="mb-8">
          <h4 className="text-slate-900 font-medium mb-4">White-label Configuration</h4>
          <EnterpriseCard className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Custom Domain</label>
              <input 
                type="text" 
                value="exif.techcorp.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                readOnly
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" checked className="rounded text-blue-600" />
              <span className="text-slate-700 text-sm">Hide ProofPix branding</span>
            </div>
          </EnterpriseCard>
        </div>

        {/* Security Settings */}
        <div className="mb-8">
          <h4 className="text-slate-900 font-medium mb-4">Security Configuration</h4>
          <EnterpriseCard className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-900 font-medium">Single Sign-On (SSO)</p>
                <p className="text-slate-600 text-sm">SAML 2.0 integration with your identity provider</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <EnterpriseBadge variant="success">Configured</EnterpriseBadge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-900 font-medium">Multi-Factor Authentication</p>
                <p className="text-slate-600 text-sm">Required for all team members</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <EnterpriseBadge variant="success">Enforced</EnterpriseBadge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-900 font-medium">IP Whitelisting</p>
                <p className="text-slate-600 text-sm">Restrict access to approved IP ranges</p>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <EnterpriseBadge variant="warning">Optional</EnterpriseBadge>
              </div>
            </div>
          </EnterpriseCard>
        </div>

        {/* Compliance */}
        <div>
          <h4 className="text-slate-900 font-medium mb-4">Compliance & Audit</h4>
          <EnterpriseCard className="space-y-4">
            <EnterpriseGrid columns={2}>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-slate-700 text-sm">SOC 2 Type II Ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-slate-700 text-sm">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-slate-700 text-sm">HIPAA Ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-slate-700 text-sm">Audit Logging Enabled</span>
              </div>
            </EnterpriseGrid>

            {/* 🎨 Enterprise Branding Section */}
            <div className="space-y-6 mt-8">
              <BrandingUploadInterface onFilesUploaded={handleBrandingFilesUploaded} />
              <BrandColorPicker onColorsChange={handleBrandingColorsChange} />
              <BrandingPreview colors={brandingSettings.colors} logo={brandingSettings.logo} />
            </div>
          </EnterpriseCard>
        </div>
      </EnterpriseCard>
    </EnterpriseSection>
  );

  return (
    <DemoModeController onDemoStart={handleDemoStart} onDemoEnd={handleDemoEnd}>
      <StandardLayout
        title="Enterprise Demo"
        description="Experience ProofPix Enterprise features in action"
      >
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Demo Mode Active</h3>
                  <p className="text-sm opacity-90">
                    You're in a safe staging environment. All actions are simulated.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/enterprise')}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  ← Back to Enterprise
                </button>
                <button
                  onClick={handleDemoEnd}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Exit Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/enterprise')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Enterprise</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <EnterpriseBadge 
              variant={isDemoMode ? "success" : "warning"} 
              icon={<Star className="w-4 h-4" />}
            >
              {isDemoMode ? "STAGING MODE" : "DEMO MODE"}
            </EnterpriseBadge>
          </div>
        </div>

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
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Demo Info */}
            <EnterpriseCard variant="dark" className="mt-8">
              <h4 className="text-yellow-300 font-medium mb-2 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {isDemoMode ? "Staging Environment" : "Demo Environment"}
              </h4>
              <p className="text-slate-300 text-sm mb-3">
                {isDemoMode 
                  ? "You're in a safe staging environment where all actions are simulated and tracked."
                  : "This is a simulated enterprise environment showing how teams access and use ProofPix."
                }
              </p>
              <div className="space-y-2">
                {!isDemoMode && (
                  <button 
                    onClick={() => handleDemoStart({ id: 'enterprise', name: 'Enterprise Demo' })}
                    className="block w-full text-left text-green-300 hover:text-green-200 text-sm underline"
                  >
                    🚀 Start Staging Mode →
                  </button>
                )}
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
            </EnterpriseCard>
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
      </StandardLayout>
    </DemoModeController>
  );
};

export default EnterpriseDemo; 
 
 