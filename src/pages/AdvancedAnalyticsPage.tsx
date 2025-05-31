import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Zap,
  Target,
  Settings,
  Download,
  ArrowLeft
} from 'lucide-react';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection
} from '../components/ui/EnterpriseComponents';
import AdvancedAnalyticsDashboard from '../components/analytics/AdvancedAnalyticsDashboard';
import { useAuth } from '../components/auth/AuthContext';

// Simple subscription hook - replace with actual implementation
const useSubscription = () => {
  const tier = localStorage.getItem('proofpix_user_tier') || 'free';
  return {
    subscription: null,
    tier: tier as 'free' | 'pro' | 'enterprise'
  };
};

export const AdvancedAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { subscription, tier } = useSubscription();
  
  const [activeView, setActiveView] = useState<'dashboard' | 'overview'>('dashboard');

  // Check authentication and tier access
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (tier === 'free') {
      navigate('/billing?upgrade=pro');
      return;
    }
  }, [isAuthenticated, tier, navigate]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const analyticsFeatures = [
    {
      title: "Real-Time Monitoring",
      description: "Live performance metrics, user activity, and system health monitoring with instant alerts",
      icon: <Activity className="h-8 w-8 text-blue-600" />,
      metrics: ["Active Users: 1,247", "Response Time: 245ms", "Uptime: 99.9%"],
      tier: "Pro"
    },
    {
      title: "Predictive Analytics",
      description: "AI-powered churn prediction, usage forecasting, and revenue projections",
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      metrics: ["Churn Risk: 15%", "Growth Forecast: +23%", "Revenue Projection: $125K"],
      tier: "Enterprise"
    },
    {
      title: "Business Intelligence",
      description: "Executive reports, operational insights, and financial analysis with automated recommendations",
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      metrics: ["Reports Generated: 47", "Insights: 12", "Actions: 8"],
      tier: "Enterprise"
    },
    {
      title: "User Behavior Analysis",
      description: "Deep dive into user patterns, feature adoption, and engagement metrics",
      icon: <Users className="h-8 w-8 text-orange-600" />,
      metrics: ["Engagement Score: 8.4", "Feature Adoption: 67%", "Session Duration: 12m"],
      tier: "Pro"
    },
    {
      title: "Performance Optimization",
      description: "System performance analysis with automated optimization recommendations",
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      metrics: ["Performance Score: 94", "Optimizations: 5", "Improvement: +18%"],
      tier: "Enterprise"
    },
    {
      title: "Revenue Analytics",
      description: "Financial metrics, subscription analytics, and revenue optimization insights",
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      metrics: ["MRR: $45K", "Growth Rate: +18.2%", "LTV: $2,340"],
      tier: "Enterprise"
    }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <EnterpriseCard variant="dark" className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Brain className="h-12 w-12 text-blue-400 mr-4" />
          <div>
            <h2 className="text-3xl font-bold text-white">Advanced Analytics & Business Intelligence</h2>
            <p className="text-blue-100 mt-2">Enterprise-grade analytics with AI-powered insights and predictive capabilities</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">1,247</div>
            <div className="text-blue-200 text-sm">Active Users</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">$125K</div>
            <div className="text-blue-200 text-sm">Monthly Revenue</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">94%</div>
            <div className="text-blue-200 text-sm">Performance Score</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">23%</div>
            <div className="text-blue-200 text-sm">Growth Rate</div>
          </div>
        </div>
      </EnterpriseCard>

      {/* Analytics Features Grid */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsFeatures.map((feature, index) => (
            <EnterpriseCard key={index} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {feature.icon}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{feature.title}</h4>
                    <EnterpriseBadge 
                      variant={feature.tier === 'Enterprise' ? 'primary' : 'success'}
                      className="mt-1"
                    >
                      {feature.tier}
                    </EnterpriseBadge>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              
              <div className="space-y-2">
                {feature.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="flex justify-between text-sm">
                    <span className="text-gray-600">{metric.split(':')[0]}:</span>
                    <span className="font-medium">{metric.split(':')[1]}</span>
                  </div>
                ))}
              </div>
            </EnterpriseCard>
          ))}
        </div>
      </div>

      {/* Key Benefits */}
      <EnterpriseCard>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Why Advanced Analytics?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Data-Driven Decision Making</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Real-time insights into user behavior and system performance</li>
              <li>• Predictive analytics to anticipate trends and issues</li>
              <li>• Automated recommendations for optimization</li>
              <li>• Executive-level reporting for strategic planning</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Business Impact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Reduce churn by identifying at-risk customers early</li>
              <li>• Optimize performance and reduce operational costs</li>
              <li>• Increase revenue through data-driven optimizations</li>
              <li>• Improve user experience with behavioral insights</li>
            </ul>
          </div>
        </div>
      </EnterpriseCard>

      {/* Call to Action */}
      <EnterpriseCard variant="dark" className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Dive Deeper?</h3>
        <p className="text-blue-100 mb-6">
          Explore your data with our comprehensive analytics dashboard
        </p>
        <EnterpriseButton 
          variant="primary" 
          size="lg"
          onClick={() => setActiveView('dashboard')}
        >
          Open Analytics Dashboard
        </EnterpriseButton>
      </EnterpriseCard>
    </div>
  );

  if (!isAuthenticated || tier === 'free') {
    return null; // Will redirect in useEffect
  }

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <EnterpriseButton
              variant="ghost"
              onClick={handleBackToDashboard}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </EnterpriseButton>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
              <p className="text-gray-600 mt-2">
                Enterprise-grade analytics, business intelligence, and predictive insights
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <EnterpriseBadge variant="primary" icon={<Brain className="enterprise-icon-sm" />}>
              AI-Powered
            </EnterpriseBadge>
            <EnterpriseBadge variant="success" icon={<Activity className="enterprise-icon-sm" />}>
              Real-Time
            </EnterpriseBadge>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'overview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
          </div>
          
          {activeView === 'dashboard' && (
            <div className="flex items-center space-x-2">
              <EnterpriseButton variant="secondary" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </EnterpriseButton>
              <EnterpriseButton variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </EnterpriseButton>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeView === 'overview' && renderOverviewTab()}
          {activeView === 'dashboard' && (
            <div className="bg-white rounded-lg border p-6">
              <AdvancedAnalyticsDashboard />
            </div>
          )}
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default AdvancedAnalyticsPage; 