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
  ArrowLeft,
  Activity,
  TrendingUp
} from 'lucide-react';
import { BrandingUploadInterface } from "../components/enterprise/BrandingUploadInterface";
import { BrandColorPicker } from "../components/enterprise/BrandColorPicker";
import { BrandingPreview } from "../components/enterprise/BrandingPreview";
import { StandardLayout } from '../components/ui/StandardLayout';
import { BackToHomeButton } from '../components/ui/BackToHomeButton';
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
  type: 'upload' | 'analysis' | 'export' | 'admin';
}

interface EnterpriseData {
  teamStats: TeamStats;
  recentActivity: RecentActivity[];
  systemHealth: {
    api: 'operational' | 'degraded' | 'down';
    processing: 'operational' | 'degraded' | 'down';
    security: 'operational' | 'degraded' | 'down';
  };
}

const EnterpriseDemo: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'processing' | 'team' | 'api' | 'settings'>('dashboard');
  const [enterpriseData, setEnterpriseData] = useState<EnterpriseData>({
    teamStats: {
      totalMembers: 24,
      activeUsers: 18,
      filesProcessed: 12847,
      apiCalls: 45623,
      storageUsed: '2.4 TB',
      uptime: '99.9%'
    },
    recentActivity: [
      { user: 'Sarah Chen', action: 'Processed 15 legal documents', time: '2 min ago', type: 'analysis' },
      { user: 'Mike Rodriguez', action: 'Exported compliance report', time: '8 min ago', type: 'export' },
      { user: 'Jennifer Kim', action: 'Updated team permissions', time: '15 min ago', type: 'admin' },
      { user: 'David Park', action: 'Uploaded medical images batch', time: '23 min ago', type: 'upload' },
      { user: 'Lisa Wang', action: 'Generated API keys', time: '1 hour ago', type: 'admin' }
    ],
    systemHealth: {
      api: 'operational',
      processing: 'operational',
      security: 'operational'
    }
  });

  const [demoUser] = useState({
    name: 'Alex Thompson',
    role: 'Enterprise Administrator',
    company: 'TechCorp Industries',
    teamId: 'ENT-2024-001'
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['dashboard', 'processing', 'team', 'api', 'settings'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'processing', label: 'Processing', icon: Zap },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'api', label: 'API & Integrations', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4 text-blue-500" />;
      case 'analysis': return <Eye className="w-4 h-4 text-green-500" />;
      case 'export': return <Download className="w-4 h-4 text-purple-500" />;
      case 'admin': return <Settings className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'down': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational': return <EnterpriseBadge variant="success">Operational</EnterpriseBadge>;
      case 'degraded': return <EnterpriseBadge variant="warning">Degraded</EnterpriseBadge>;
      case 'down': return <EnterpriseBadge variant="danger">Down</EnterpriseBadge>;
      default: return <EnterpriseBadge variant="neutral">Unknown</EnterpriseBadge>;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <EnterpriseCard variant="premium" className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Welcome back, {demoUser.name}
            </h2>
            <p className="text-sm text-slate-600">
              {demoUser.company} Enterprise Dashboard • {demoUser.role}
            </p>
          </div>
          <div className="text-right">
            <EnterpriseBadge variant="success" className="mb-2 text-xs">
              <Crown className="w-3 h-3" />
              Enterprise Active
            </EnterpriseBadge>
            <p className="text-xs text-slate-500">Team ID: {demoUser.teamId}</p>
          </div>
        </div>
      </EnterpriseCard>

      {/* Quick Stats */}
      <EnterpriseGrid columns={4} gap="md">
        <EnterpriseCard hover interactive>
              <EnterpriseMetric 
                value={enterpriseData.teamStats.totalMembers.toString()} 
                label="Team Members" 
            icon={<Users />}
            color="blue"
            trend="up"
            trendValue="+2 this month"
              />
        </EnterpriseCard>

        <EnterpriseCard hover interactive>
              <EnterpriseMetric 
                value={enterpriseData.teamStats.filesProcessed.toLocaleString()} 
                label="Files Processed" 
            icon={<FileText />}
            color="green"
            trend="up"
            trendValue="+12% vs last month"
              />
        </EnterpriseCard>

        <EnterpriseCard hover interactive>
              <EnterpriseMetric 
                value={enterpriseData.teamStats.apiCalls.toLocaleString()} 
                label="API Calls" 
            icon={<Globe />}
            color="purple"
            trend="up"
            trendValue="+8% this week"
              />
        </EnterpriseCard>

        <EnterpriseCard hover interactive>
              <EnterpriseMetric 
                value={enterpriseData.teamStats.uptime} 
                label="System Uptime" 
            icon={<Shield />}
            color="green"
            trend="up"
            trendValue="Last 30 days"
              />
        </EnterpriseCard>
      </EnterpriseGrid>

      {/* Recent Activity & System Status */}
      <EnterpriseGrid columns={2} gap="md">
        <EnterpriseCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <EnterpriseButton 
              variant="ghost" 
              size="sm"
              onClick={() => alert('View All Activity - Demo Feature')}
            >
              <Eye className="w-4 h-4" />
              View All
            </EnterpriseButton>
          </div>
          <div className="space-y-3">
            {enterpriseData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{activity.user}</p>
                  <p className="text-sm text-slate-600 truncate">{activity.action}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </EnterpriseCard>

        <EnterpriseCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">System Status</h3>
            <EnterpriseButton 
              variant="ghost" 
              size="sm"
              onClick={() => alert('System Details - Demo Feature')}
            >
              <TrendingUp className="w-4 h-4" />
              Details
            </EnterpriseButton>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(enterpriseData.systemHealth.api)}
                <span className="text-sm font-medium text-slate-900">API Services</span>
              </div>
              {getStatusBadge(enterpriseData.systemHealth.api)}
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(enterpriseData.systemHealth.processing)}
                <span className="text-sm font-medium text-slate-900">Processing Engine</span>
              </div>
              {getStatusBadge(enterpriseData.systemHealth.processing)}
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(enterpriseData.systemHealth.security)}
                <span className="text-sm font-medium text-slate-900">Security Systems</span>
              </div>
              {getStatusBadge(enterpriseData.systemHealth.security)}
            </div>
          </div>
        </EnterpriseCard>
      </EnterpriseGrid>
      </div>
  );

  const renderProcessing = () => (
    <div className="space-y-6">
      <EnterpriseCard>
        <div className="text-center py-8">
          <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise Processing Engine</h3>
          <p className="text-slate-600 mb-6">Advanced document processing with enterprise-grade security and compliance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnterpriseButton 
              variant="primary"
              onClick={() => navigate('/enterprise/ai-demo')}
            >
              <Upload className="w-4 h-4" />
              Start Processing
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary"
              onClick={() => navigate('/enterprise/demo-selection')}
            >
              <Eye className="w-4 h-4" />
              Try Different Demos
            </EnterpriseButton>
          </div>
        </div>
      </EnterpriseCard>
    </div>
  );

  const renderTeamManagement = () => (
    <div className="space-y-6">
      <EnterpriseCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Team Management</h3>
          <EnterpriseButton 
            variant="primary"
            onClick={() => alert('Add Team Member - Demo Feature\n\nIn production, this would open a form to invite new team members with role-based permissions.')}
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </EnterpriseButton>
        </div>
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">Manage your enterprise team members, roles, and permissions.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900">Active Users</h4>
              <p className="text-2xl font-bold text-blue-600">{enterpriseData.teamStats.activeUsers}</p>
                </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900">Total Members</h4>
              <p className="text-2xl font-bold text-green-600">{enterpriseData.teamStats.totalMembers}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900">Pending Invites</h4>
              <p className="text-2xl font-bold text-yellow-600">3</p>
              </div>
              </div>
        </div>
      </EnterpriseCard>
    </div>
  );

  const renderAPIManagement = () => (
    <div className="space-y-6">
      <EnterpriseCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900">API & Integrations</h3>
          <EnterpriseButton 
            variant="primary"
            onClick={() => alert('Generate API Key - Demo Feature\n\nAPI Key: pk_demo_1234567890abcdef\n\nIn production, this would generate a real API key for your enterprise account.')}
          >
            <Key className="w-4 h-4" />
            Generate API Key
          </EnterpriseButton>
        </div>
        <div className="space-y-4">
          <div className="text-center py-4">
            <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Integrate ProofPix with your existing enterprise systems and workflows.</p>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">API Usage</h4>
              <p className="text-2xl font-bold text-blue-600">{enterpriseData.teamStats.apiCalls.toLocaleString()}</p>
              <p className="text-sm text-slate-500">calls this month</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Rate Limit</h4>
              <p className="text-2xl font-bold text-green-600">Unlimited</p>
              <p className="text-sm text-slate-500">enterprise tier</p>
            </div>
          </div>
        </div>
      </EnterpriseCard>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <EnterpriseCard>
        <div className="text-center py-8">
          <Settings className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise Settings</h3>
          <p className="text-slate-600 mb-6">Configure your enterprise instance, security policies, and compliance settings.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <EnterpriseButton 
              variant="secondary" 
              className="p-4 h-auto flex-col"
              onClick={() => alert('Security Settings - Demo Feature\n\nConfigure 2FA, SSO, IP restrictions, and audit logging.')}
            >
              <Shield className="w-6 h-6 mb-2" />
              Security Settings
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary" 
              className="p-4 h-auto flex-col"
              onClick={() => alert('Compliance Settings - Demo Feature\n\nConfigure GDPR, HIPAA, SOX compliance settings and data retention policies.')}
            >
              <FileText className="w-6 h-6 mb-2" />
              Compliance
            </EnterpriseButton>
            <EnterpriseButton 
              variant="secondary" 
              className="p-4 h-auto flex-col"
              onClick={() => alert('Billing Settings - Demo Feature\n\nManage subscription, usage limits, and billing information.')}
            >
              <Activity className="w-6 h-6 mb-2" />
              Billing
            </EnterpriseButton>
            </div>
        </div>
      </EnterpriseCard>
    </div>
  );

  return (
    <DemoModeController>
      <StandardLayout>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-3">
                  <div className="scale-75">
                    <BackToHomeButton />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                <div>
                      <h1 className="text-sm font-semibold text-slate-900">Enterprise Suite</h1>
                      <p className="text-xs text-slate-500">Document Intelligence Platform</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <EnterpriseButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open('https://app.proofpixapp.com', '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Go to Production
                  </EnterpriseButton>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-2">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                <button
                  key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                      <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

                {/* Back to Dashboard button */}
                <div className="flex items-center space-x-2">
                  <EnterpriseButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('dashboard')}
                    className={activeTab === 'dashboard' ? 'hidden' : ''}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back to Dashboard
                  </EnterpriseButton>
                  <EnterpriseButton 
                    variant="ghost" 
                    size="sm"
                  onClick={() => navigate('/enterprise')}
                  >
                    <Building2 className="w-3 h-3" />
                    Enterprise Home
                  </EnterpriseButton>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
 
 