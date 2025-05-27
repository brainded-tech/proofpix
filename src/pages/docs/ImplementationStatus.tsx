import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle, Clock, AlertCircle, TrendingUp, Users, Zap, ArrowRight, Calendar, Target } from 'lucide-react';

interface StatusCardProps {
  title: string;
  status: string;
  progress: number;
  details: string;
  icon: React.ReactNode;
  color: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, status, progress, details, icon, color }) => (
  <div className={`border rounded-lg p-6 bg-${color}-50 border-${color}-200`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        {icon}
        <h3 className={`text-lg font-semibold text-${color}-900 ml-2`}>{title}</h3>
      </div>
      <span className={`text-sm font-medium text-${color}-700`}>{status}</span>
    </div>
    
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className={`text-${color}-700`}>Progress</span>
        <span className={`text-${color}-700`}>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
    
    <p className={`text-sm text-${color}-700`}>{details}</p>
  </div>
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
      case 'upcoming': return 'text-gray-600 bg-gray-100';
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
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

export const ImplementationStatus: React.FC = () => {
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
      priority: "Medium",
      task: "Customer Success Onboarding Materials",
      owner: "Customer Success",
      deadline: "Next Week", 
      color: "yellow"
    },
    {
      priority: "Low",
      task: "Performance Optimization Review",
      owner: "Senior Developer",
      deadline: "2 Weeks",
      color: "green"
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
        <span className="text-gray-600">Implementation Status</span>
      </nav>

      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <Activity className="mr-3 text-blue-600" size={32} />
          Implementation Status Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Real-time tracking of ProofPix enterprise feature development and deployment
        </p>
      </div>

      {/* Overall Progress Summary */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Overall Project Progress</h2>
          <div className="flex items-center space-x-2">
            <Zap className="text-blue-600" size={20} />
            <span className="text-lg font-bold text-blue-600">88% Complete</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">Features Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">7</div>
            <div className="text-sm text-gray-600">Days to Launch</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full" style={{ width: '88%' }}></div>
        </div>
      </div>

      {/* Project Status Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Implementation Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectStatus.map((project, index) => (
            <StatusCard key={index} {...project} />
          ))}
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="mr-2 text-blue-500" size={24} />
          Implementation Timeline
        </h2>
        
        <div className="bg-white border rounded-lg p-6">
          <div className="space-y-6">
            {timelineItems.map((item, index) => (
              <div key={index}>
                <TimelineItem {...item} />
                {index < timelineItems.length - 1 && (
                  <div className="ml-4 mt-4 mb-2 border-l-2 border-gray-200 h-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps & Action Items */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="mr-2 text-green-500" size={24} />
          Next Steps & Action Items
        </h2>
        
        <div className="space-y-4">
          {nextSteps.map((step, index) => (
            <div key={index} className="bg-white border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  step.color === 'red' ? 'bg-red-100 text-red-800' :
                  step.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {step.priority}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{step.task}</h3>
                  <p className="text-sm text-gray-600">Owner: {step.owner}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{step.deadline}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Coordination Status */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Coordination Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Completed Teams</h3>
            <ul className="space-y-2 text-green-800">
              <li>• UI/UX Team - Branding specs delivered</li>
              <li>• Security Officer - Protocols defined</li>
              <li>• Sales & Marketing - Strategy approved</li>
              <li>• Tech Documentation - API docs created</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">In Progress</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Tech Team - Custom branding implementation</li>
              <li>• Senior Developer - API integration</li>
              <li>• Documentation Team - Perfection roadmap</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">Pending</h3>
            <ul className="space-y-2 text-yellow-800">
              <li>• Customer Success - Onboarding materials</li>
              <li>• Privacy Officer - Final compliance review</li>
              <li>• Social Media - Launch campaign</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Implementation Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
            <div className="text-sm text-gray-600">Documentation Pages Created</div>
          </div>
          
          <div className="bg-white border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
            <div className="text-sm text-gray-600">API Endpoints Documented</div>
          </div>
          
          <div className="bg-white border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
            <div className="text-sm text-gray-600">Team Responses Coordinated</div>
          </div>
          
          <div className="bg-white border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">Documentation Completeness</div>
          </div>
        </div>
      </section>

      {/* Risk Assessment */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Assessment</h2>
        
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle className="mr-2 text-green-600" size={16} />
              <span className="font-semibold text-green-800">Low Risk</span>
            </div>
            <p className="text-green-700 text-sm">
              Core features are complete and tested. Documentation is comprehensive. Team coordination is effective.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="mr-2 text-yellow-600" size={16} />
              <span className="font-semibold text-yellow-800">Medium Risk</span>
            </div>
            <p className="text-yellow-700 text-sm">
              Custom branding API integration timeline is tight. Sales team training needs to be scheduled promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer navigation */}
      <nav className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link 
            to="/docs/custom-branding" 
            className="flex items-center text-blue-600 hover:underline"
          >
            ← Previous: Custom Branding
          </Link>
          <Link 
            to="/docs/enterprise-demo-walkthrough" 
            className="flex items-center text-blue-600 hover:underline"
          >
            Next: Enterprise Demo Walkthrough →
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </nav>
    </div>
  );
}; 
