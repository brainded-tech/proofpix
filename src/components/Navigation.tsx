import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Shield, 
  Brain, 
  Building2, 
  CreditCard,
  FileText,
  Users,
  Settings,
  Layers,
  Zap,
  Target
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  tier?: 'free' | 'pro' | 'enterprise';
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Main dashboard and overview'
  },
  {
    name: 'Analytics',
    href: '/advanced-analytics',
    icon: BarChart3,
    description: 'Advanced analytics and reporting',
    tier: 'pro'
  },
  {
    name: 'Security Dashboard',
    href: '/security-dashboard',
    icon: Shield,
    description: 'Security monitoring and compliance',
    tier: 'pro'
  },
  {
    name: 'AI Document Intelligence',
    href: '/ai/document-intelligence',
    icon: Brain,
    description: 'AI-powered document analysis',
    tier: 'pro'
  },
  {
    name: 'Industry AI Packages',
    href: '/ai/packages',
    icon: Building2,
    description: 'Industry-specific AI solutions',
    tier: 'enterprise'
  },
  {
    name: 'Marketplace',
    href: '/marketplace',
    icon: Target,
    description: 'Plugin marketplace and integrations',
    tier: 'enterprise'
  },
  {
    name: 'ROI Dashboard',
    href: '/enterprise/roi-dashboard',
    icon: BarChart3,
    description: 'ROI measurement and analytics',
    tier: 'enterprise'
  },
  {
    name: 'Compliance Templates',
    href: '/enterprise/compliance-templates',
    icon: FileText,
    description: 'HIPAA, SOX, GDPR templates',
    tier: 'enterprise'
  },
  {
    name: 'Image Comparison',
    href: '/image-comparison',
    icon: Layers,
    description: 'Compare image metadata'
  },
  {
    name: 'Batch Processing',
    href: '/batch-processing',
    icon: Zap,
    description: 'Bulk processing operations',
    tier: 'pro'
  },
  {
    name: 'Content Management',
    href: '/content-management',
    icon: FileText,
    description: 'Content quality and validation',
    tier: 'pro'
  },
  {
    name: 'Enterprise SSO',
    href: '/enterprise-sso',
    icon: Users,
    description: 'Single sign-on configuration',
    tier: 'enterprise'
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard,
    description: 'Subscription and billing'
  }
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const userTier = localStorage.getItem('proofpix_user_tier') || 'free';

  const filteredItems = navigationItems.filter(item => {
    if (!item.tier) return true;
    if (item.tier === 'pro' && (userTier === 'pro' || userTier === 'enterprise')) return true;
    if (item.tier === 'enterprise' && userTier === 'enterprise') return true;
    return false;
  });

  const getTierBadge = (tier?: string) => {
    if (!tier) return null;
    
    const colors = {
      pro: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      enterprise: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };

    return (
      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${colors[tier as keyof typeof colors]}`}>
        {tier.toUpperCase()}
      </span>
    );
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">ProofPix Enterprise</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {filteredItems.slice(0, 6).map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    title={item.description}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {getTierBadge(item.tier)}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              userTier === 'enterprise' 
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : userTier === 'pro'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {userTier.toUpperCase()} Plan
            </span>
          </div>
        </div>
      </div>

      {/* Mobile menu - simplified for now */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-700">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
                {getTierBadge(item.tier)}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}; 