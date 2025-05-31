import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle, Clock, AlertCircle, TrendingUp, Users, Zap, ArrowRight, Calendar, Target, ArrowLeft } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

interface StatusCardProps {
  title: string;
  status: string;
  progress: number;
  details: string;
  icon: React.ReactNode;
  color: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, status, progress, details, icon, color }) => (
  <EnterpriseCard className={`${
    color === 'green' ? 'bg-green-50 border-green-200' :
    color === 'blue' ? 'bg-blue-50 border-blue-200' :
    color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
    'bg-slate-50 border-slate-200'
  }`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        {icon}
        <h3 className={`text-lg font-semibold ml-2 ${
          color === 'green' ? 'text-green-900' :
          color === 'blue' ? 'text-blue-900' :
          color === 'yellow' ? 'text-yellow-900' :
          'text-slate-900'
        }`}>{title}</h3>
      </div>
      <EnterpriseBadge 
        variant={color === 'green' ? 'success' : color === 'blue' ? 'primary' : color === 'yellow' ? 'warning' : 'neutral'}
      >
        {status}
      </EnterpriseBadge>
    </div>
    
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className={`${
          color === 'green' ? 'text-green-700' :
          color === 'blue' ? 'text-blue-700' :
          color === 'yellow' ? 'text-yellow-700' :
          'text-slate-700'
        }`}>Progress</span>
        <span className={`${
          color === 'green' ? 'text-green-700' :
          color === 'blue' ? 'text-blue-700' :
          color === 'yellow' ? 'text-yellow-700' :
          'text-slate-700'
        }`}>{progress}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            color === 'green' ? 'bg-green-600' :
            color === 'blue' ? 'bg-blue-600' :
            color === 'yellow' ? 'bg-yellow-600' :
            'bg-slate-600'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
    
    <p className={`text-sm ${
      color === 'green' ? 'text-green-700' :
      color === 'blue' ? 'text-blue-700' :
      color === 'yellow' ? 'text-yellow-700' :
      'text-slate-700'
    }`}>{details}</p>
  </EnterpriseCard>
);

interface TimelineItemProps {
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, description, date, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'in-progress': return <Clock size={16} />;
      case 'upcoming': return <Calendar size={16} />;
    }
  };

  return (
    <div className="flex items-start space-x-4">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor()}`}>
        {getStatusIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

export const ImplementationStatus: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  const projectStatus = [
    {
      title: "AI-Driven Pricing",
      status: "✅ Complete",
      progress: 100,
      details: "Hybrid pricing system implemented and tested with customer segmentation",
      icon: <TrendingUp className="text-green-600" size={20} />,
      color: "green"
    },
    {
      title: "Enterprise Demo",
      status: "✅ Complete", 
      progress: 100,
      details: "Interactive TechCorp Industries demo fully functional at /enterprise/demo",
      icon: <CheckCircle className="text-green-600" size={20} />,
      color: "green"
    },
    {
      title: "Custom Branding",
      status: "🔄 In Progress",
      progress: 85,
      details: "UI components ready, API integration 85% complete, testing in progress",
      icon: <Clock className="text-blue-600" size={20} />,
      color: "blue"
    },
    {
      title: "Documentation Suite",
      status: "🔄 In Progress",
      progress: 95,
      details: "Comprehensive docs created, working toward 100% completeness",
      icon: <Activity className="text-blue-600" size={20} />,
      color: "blue"
    },
    {
      title: "Team Coordination",
      status: "✅ Complete",
      progress: 100,
      details: "All team prompts delivered, responses coordinated, implementation plans active",
      icon: <Users className="text-green-600" size={20} />,
      color: "green"
    },
    {
      title: "Sales Enablement",
      status: "⚠️ Pending",
      progress: 60,
      details: "Security docs complete, pricing strategy approved, sales training pending",
      icon: <AlertCircle className="text-yellow-600" size={20} />,
      color: "yellow"
    }
  ];

  const timelineItems = [
    {
      title: "Enterprise Documentation Created",
      description: "Complete security, compliance, and API documentation suite",
      date: "Completed",
      status: "completed" as const
    },
    {
      title: "AI-Driven Pricing Implemented",
      description: "Hybrid pricing strategy with customer segmentation",
      date: "Completed",
      status: "completed" as const
    },
    {
      title: "Enterprise Demo Launched",
      description: "Interactive TechCorp Industries simulation environment",
      date: "Completed", 
      status: "completed" as const
    },
    {
      title: "Custom Branding Development",
      description: "Brand upload, color schemes, white-label configuration",
      date: "In Progress",
      status: "in-progress" as const
    },
    {
      title: "Documentation Perfection",
      description: "Achieving 100% completeness, accuracy, and consistency",
      date: "In Progress",
      status: "in-progress" as const
    },
    {
      title: "Sales Team Training",
      description: "Training on new features and pricing strategy",
      date: "This Week",
      status: "upcoming" as const
    },
    {
      title: "Production Deployment",
      description: "Full enterprise feature rollout to production",
      date: "Next Week",
      status: "upcoming" as const
    }
  ];

  const nextSteps = [
    {
      priority: "High",
      task: "Complete Custom Branding API Integration",
      owner: "Tech Team",
      deadline: "This Week",
      color: "red"
    },
    {
      priority: "High", 
      task: "Finalize Documentation to 100%",
      owner: "Tech Documentation Team",
      deadline: "This Week",
      color: "red"
    },
    {
      priority: "Medium",
      task: "Sales Team Training on New Features",
      owner: "Sales & Marketing",
      deadline: "Next Week",
      color: "yellow"
    },
    {
      priority: "Low",
      task: "Production Deployment Planning",
      owner: "DevOps Team",
      deadline: "Next Week",
      color: "green"
    }
  ];

  const metrics = [
    {
      label: "Overall Progress",
      value: "88%",
      change: "+12%",
      icon: Target,
      color: "blue"
    },
    {
      label: "Features Complete",
      value: "15/18",
      change: "+3",
      icon: CheckCircle,
      color: "green"
    },
    {
      label: "Documentation",
      value: "95%",
      change: "+25%",
      icon: Activity,
      color: "purple"
    },
    {
      label: "Team Velocity",
      value: "High",
      change: "Stable",
      icon: Zap,
      color: "orange"
    }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Implementation Status"
      description="Real-time project status, milestones, and next steps for ProofPix enterprise features"
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
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Implementation Status</h1>
            <p className="text-xl text-slate-600 mt-2">
              Real-time project status, milestones, and next steps for ProofPix enterprise features
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<Activity className="enterprise-icon-sm" />}>
            Implementation Status
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<TrendingUp className="enterprise-icon-sm" />}>
            Progress Tracking
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<Clock className="enterprise-icon-sm" />}>
            Real-time Updates
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Metrics</h2>
          <EnterpriseGrid columns={4}>
            {metrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
                <metric.icon className={`h-8 w-8 mx-auto mb-2 ${
                  metric.color === 'blue' ? 'text-blue-600' :
                  metric.color === 'green' ? 'text-green-600' :
                  metric.color === 'purple' ? 'text-purple-600' :
                  'text-orange-600'
                }`} />
                <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
                <div className="text-sm text-slate-600 mb-1">{metric.label}</div>
                <div className={`text-xs font-medium ${
                  metric.change.startsWith('+') ? 'text-green-600' : 'text-slate-500'
                }`}>
                  {metric.change}
                </div>
              </div>
            ))}
          </EnterpriseGrid>
        </EnterpriseCard>

        {/* Project Status */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Status Overview</h2>
          <EnterpriseGrid columns={2}>
            {projectStatus.map((project, index) => (
              <StatusCard key={index} {...project} />
            ))}
          </EnterpriseGrid>
        </div>

        {/* Timeline */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Implementation Timeline</h2>
          <div className="space-y-6">
            {timelineItems.map((item, index) => (
              <TimelineItem key={index} {...item} />
            ))}
          </div>
        </EnterpriseCard>

        {/* Next Steps */}
        <EnterpriseCard className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Next Steps & Action Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Deadline</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {nextSteps.map((step, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EnterpriseBadge 
                        variant={step.priority === 'High' ? 'danger' : step.priority === 'Medium' ? 'warning' : 'success'}
                      >
                        {step.priority}
                      </EnterpriseBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{step.task}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{step.owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{step.deadline}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </EnterpriseCard>

        {/* Team Communication */}
        <EnterpriseCard className="mb-8 bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Team Communication</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Daily Standups</h3>
                <p className="text-slate-600 text-sm">Team sync every morning at 9:00 AM EST to review progress and blockers</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Weekly Reviews</h3>
                <p className="text-slate-600 text-sm">Comprehensive progress review every Friday with stakeholder updates</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Sprint Planning</h3>
                <p className="text-slate-600 text-sm">Bi-weekly sprint planning sessions to prioritize features and allocate resources</p>
              </div>
            </div>
          </div>
        </EnterpriseCard>

        {/* Call to Action */}
        <EnterpriseCard className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Stay Updated</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            This status page is updated in real-time as we make progress. 
            Check back regularly for the latest updates on enterprise feature development.
          </p>
          <div className="flex justify-center space-x-4">
            <EnterpriseButton variant="primary">
              View Enterprise Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </EnterpriseButton>
            <EnterpriseButton variant="secondary">
              Contact Team
            </EnterpriseButton>
          </div>
        </EnterpriseCard>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </EnterpriseLayout>
  );
}; 


