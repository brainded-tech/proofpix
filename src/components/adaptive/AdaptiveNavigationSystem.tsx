import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Settings, 
  Users, 
  Database, 
  Key, 
  Shield, 
  ChevronDown, 
  ChevronRight,
  X,
  Menu,
  Zap,
  Building2,
  BarChart3,
  Layout,
  User,
  Phone,
  Star,
  ExternalLink,
  Info as InfoIcon,
  PlusCircle
} from 'lucide-react';
import { useAdaptiveUI } from './AdaptiveUIProvider';
import { useFeatureDiscovery } from './FeatureDiscoverySystem';
import { analytics } from '../../utils/analytics';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  action?: () => void;
  badge?: string;
  badgeColor?: string;
  children?: NavItem[];
  requiredFeatures?: string[];
  userTypes?: ('quick_user' | 'professional_user' | 'enterprise_user')[];
  contextualReveals?: {
    condition: string;
    value?: number;
  };
  isExternal?: boolean;
  isProminent?: boolean;
}

interface AdaptiveNavigationConfig {
  [key: string]: {
    primary_nav: string[];
    secondary_nav?: string[];
    hidden_nav?: string[];
    contextual_reveals?: Record<string, string>;
    prominent_features?: string[];
  };
}

interface AdaptiveNavigationProps {
  variant?: 'top' | 'sidebar' | 'bottom';
  showLogo?: boolean;
  className?: string;
  allowMobileNav?: boolean;
  mobileBreakpoint?: number;
}

// Navigation configurations for different user types
const NAV_CONFIGS: AdaptiveNavigationConfig = {
  quick_user: {
    primary_nav: ['upload', 'results', 'help'],
    hidden_nav: ['enterprise', 'api_docs', 'team_management'],
    contextual_reveals: {
      after_5_uploads: 'batch_processing',
      after_export: 'templates'
    }
  },
  professional_user: {
    primary_nav: ['upload', 'batch_processing', 'templates', 'results', 'account'],
    secondary_nav: ['api_docs', 'integrations', 'support'],
    hidden_nav: ['enterprise_demo', 'team_management'],
    contextual_reveals: {
      business_email: 'enterprise',
      api_usage: 'developer_docs'
    }
  },
  enterprise_user: {
    primary_nav: ['dashboard', 'team', 'processing', 'reports', 'settings'],
    secondary_nav: ['api', 'security', 'compliance', 'support'],
    prominent_features: ['enterprise_demo', 'contact_sales', 'security_architecture']
  }
};

// Base navigation items
const ALL_NAV_ITEMS: NavItem[] = [
  {
    id: 'upload',
    label: 'Upload',
    icon: <Upload className="w-5 h-5" />,
    href: '/app'
  },
  {
    id: 'results',
    label: 'Results',
    icon: <FileText className="w-5 h-5" />,
    href: '/results'
  },
  {
    id: 'batch_processing',
    label: 'Batch Processing',
    icon: <Database className="w-5 h-5" />,
    href: '/batch-management',
    requiredFeatures: ['batch_processing']
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: <Layout className="w-5 h-5" />,
    href: '/templates',
    requiredFeatures: ['template_customization']
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/dashboard'
  },
  {
    id: 'team',
    label: 'Team',
    icon: <Users className="w-5 h-5" />,
    href: '/team',
    requiredFeatures: ['team_features'],
    badge: 'New'
  },
  {
    id: 'processing',
    label: 'Processing',
    icon: <Zap className="w-5 h-5" />,
    href: '/processing'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <FileText className="w-5 h-5" />,
    href: '/reports'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/settings'
  },
  {
    id: 'api',
    label: 'API',
    icon: <Key className="w-5 h-5" />,
    href: '/docs/api',
    requiredFeatures: ['api_overview']
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Shield className="w-5 h-5" />,
    href: '/security',
    isProminent: true
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: <FileText className="w-5 h-5" />,
    href: '/compliance',
    requiredFeatures: ['compliance_info']
  },
  {
    id: 'support',
    label: 'Support',
    icon: <InfoIcon className="w-5 h-5" />,
    href: '/support'
  },
  {
    id: 'help',
    label: 'Help',
    icon: <InfoIcon className="w-5 h-5" />,
    href: '/help'
  },
  {
    id: 'account',
    label: 'Account',
    icon: <User className="w-5 h-5" />,
    href: '/account'
  },
  {
    id: 'enterprise_demo',
    label: 'Enterprise Demo',
    icon: <Building2 className="w-5 h-5" />,
    href: '/enterprise/demo?view=showcase',
    requiredFeatures: ['enterprise_demo'],
    isProminent: true,
    badge: 'Demo'
  },
  {
    id: 'contact_sales',
    label: 'Contact Sales',
    icon: <Phone className="w-5 h-5" />,
    href: '/enterprise#contact',
    isProminent: true
  },
  {
    id: 'security_architecture',
    label: 'Security Architecture',
    icon: <Shield className="w-5 h-5" />,
    href: '/security#architecture',
    requiredFeatures: ['security_architecture'],
    isProminent: true
  },
  {
    id: 'api_docs',
    label: 'API Docs',
    icon: <FileText className="w-5 h-5" />,
    href: '/docs/api',
    requiredFeatures: ['api_overview']
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: <Settings className="w-5 h-5" />,
    href: '/integrations'
  },
  {
    id: 'team_management',
    label: 'Team Management',
    icon: <Users className="w-5 h-5" />,
    href: '/team',
    requiredFeatures: ['team_features']
  },
  {
    id: 'developer_docs',
    label: 'Developer Docs',
    icon: <FileText className="w-5 h-5" />,
    href: '/docs/api',
    requiredFeatures: ['api_overview']
  }
];

/**
 * Adaptive Navigation System that adjusts navigation items and structure based on 
 * user context, behavior, and current application state
 */
export const AdaptiveNavigationSystem: React.FC<AdaptiveNavigationProps> = ({
  variant = 'top',
  showLogo = true,
  className = '',
  allowMobileNav = true,
  mobileBreakpoint = 768
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItems, setActiveItems] = useState<NavItem[]>([]);
  const [secondaryItems, setSecondaryItems] = useState<NavItem[]>([]);
  const [prominentItems, setProminentItems] = useState<NavItem[]>([]);
  const [currentUserType, setCurrentUserType] = useState<string>('quick_user');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < mobileBreakpoint);
  
  const { userContext, shouldShowFeature } = useAdaptiveUI();
  const { showHint } = useFeatureDiscovery();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  
  // Determine user type based on user context
  useEffect(() => {
    let userType = 'quick_user';
    
    if (userContext.intent) {
      if (userContext.intent.id === 'enterprise_evaluation') {
        userType = 'enterprise_user';
      } else if (userContext.intent.id === 'professional_work') {
        userType = 'professional_user';
      }
    } else if (userContext.experienceLevel === 'expert') {
      userType = 'professional_user';
    }
    
    setCurrentUserType(userType);
  }, [userContext.intent, userContext.experienceLevel]);
  
  // Update navigation items when user type changes
  useEffect(() => {
    const navConfig = NAV_CONFIGS[currentUserType] || NAV_CONFIGS.quick_user;
    
    // Filter items based on user type configuration
    const primaryItems = navConfig.primary_nav
      .map(id => ALL_NAV_ITEMS.find(item => item.id === id))
      .filter((item): item is NavItem => Boolean(item))
      .filter(item => shouldShowNavItem(item));
    
    const secondaryItems = (navConfig.secondary_nav || [])
      .map(id => ALL_NAV_ITEMS.find(item => item.id === id))
      .filter((item): item is NavItem => Boolean(item))
      .filter(item => shouldShowNavItem(item));
    
    const prominentItems = (navConfig.prominent_features || [])
      .map(id => ALL_NAV_ITEMS.find(item => item.id === id))
      .filter((item): item is NavItem => Boolean(item))
      .filter(item => shouldShowNavItem(item));
    
    setActiveItems(primaryItems);
    setSecondaryItems(secondaryItems);
    setProminentItems(prominentItems);
    
    // Track navigation analytics
    analytics.track({
      event: 'navigation_updated',
      category: 'ui',
      label: currentUserType,
      properties: {
        user_type: currentUserType,
        primary_items: primaryItems.map(i => i.id),
        secondary_items: secondaryItems.map(i => i.id),
        prominent_items: prominentItems.map(i => i.id)
      }
    });
  }, [currentUserType, shouldShowFeature, userContext.revealedFeatures]);
  
  // Close mobile menu on location change
  useEffect(() => {
    setMobileMenuOpen(false);
    setExpandedItem(null);
  }, [location]);
  
  // Check for window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint]);
  
  // Check if a navigation item should be shown
  const shouldShowNavItem = (item: NavItem): boolean => {
    // Check if item requires specific features
    if (item.requiredFeatures && !item.requiredFeatures.every(feature => shouldShowFeature(feature))) {
      return false;
    }
    
    // Check if item is restricted to certain user types
    if (item.userTypes && !item.userTypes.includes(currentUserType as any)) {
      return false;
    }
    
    // Check if item is in hidden_nav for current user type
    const navConfig = NAV_CONFIGS[currentUserType] || NAV_CONFIGS.quick_user;
    if (navConfig.hidden_nav?.includes(item.id)) {
      return false;
    }
    
    return true;
  };
  
  // Get the URL for a navigation item
  const getItemUrl = (item: NavItem): string => {
    if (item.href) {
      return item.href;
    }
    return '#';
  };
  
  // Handle navigation item click
  const handleNavItemClick = (item: NavItem, event?: React.MouseEvent) => {
    if (event) {
      // Stop propagation if there are children
      if (item.children && item.children.length > 0) {
        event.preventDefault();
        setExpandedItem(expandedItem === item.id ? null : item.id);
        return;
      }
    }
    
    // Handle custom action
    if (item.action) {
      item.action();
      return;
    }
    
    // Handle external links
    if (item.isExternal && item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Standard navigation
    if (item.href) {
      navigate(item.href);
    }
    
    // Track navigation analytics
    analytics.track({
      event: 'navigation_item_clicked',
      category: 'ui',
      label: item.id,
      properties: {
        item_id: item.id,
        item_label: item.label,
        user_type: currentUserType
      }
    });
  };
  
  // Render different navigation variants
  const renderNavigation = () => {
    switch (variant) {
      case 'sidebar':
        return renderSidebarNav();
      case 'bottom':
        return renderBottomNav();
      case 'top':
      default:
        return renderTopNav();
    }
  };
  
  // Render top navigation
  const renderTopNav = () => (
    <nav className={`bg-slate-900 shadow-md ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex">
            {showLogo && (
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <Shield className="w-8 h-8 text-blue-500" />
                  <span className="text-white font-bold text-xl">ProofPix</span>
                </Link>
              </div>
            )}
            
            {/* Desktop Primary Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {activeItems.map(item => (
                <div key={item.id} className="relative group">
                  <Link
                    to={getItemUrl(item)}
                    onClick={(e) => handleNavItemClick(item, e)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === item.href
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        item.badgeColor || 'bg-blue-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {/* Secondary & Prominent Items */}
          <div className="hidden md:flex items-center space-x-4">
            {secondaryItems.map(item => (
              <Link
                key={item.id}
                to={getItemUrl(item)}
                onClick={(e) => handleNavItemClick(item, e)}
                className="text-slate-300 hover:text-white px-2 py-1 text-sm"
              >
                {item.label}
              </Link>
            ))}
            
            {prominentItems.length > 0 && (
              <div className="border-l border-slate-700 pl-4 ml-2 flex items-center space-x-3">
                {prominentItems.map(item => (
                  <Link
                    key={item.id}
                    to={getItemUrl(item)}
                    onClick={(e) => handleNavItemClick(item, e)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
                  >
                    <span className="mr-1">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-500 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          {allowMobileNav && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {activeItems.map(item => (
                <Link
                  key={item.id}
                  to={getItemUrl(item)}
                  onClick={() => handleNavItemClick(item)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
              
              {prominentItems.length > 0 && (
                <div className="pt-4 pb-3 border-t border-slate-700">
                  <div className="px-2">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Featured
                    </p>
                    {prominentItems.map(item => (
                      <Link
                        key={item.id}
                        to={getItemUrl(item)}
                        onClick={() => handleNavItemClick(item)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
  
  // Render sidebar navigation
  const renderSidebarNav = () => (
    <div className={`h-screen bg-slate-900 text-white flex flex-col ${className}`}>
      {/* Logo */}
      {showLogo && (
        <div className="p-4 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="font-bold text-xl">ProofPix</span>
          </Link>
        </div>
      )}
      
      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {activeItems.map(item => (
            <li key={item.id}>
              <Link
                to={getItemUrl(item)}
                onClick={(e) => handleNavItemClick(item, e)}
                className={`flex items-center p-2 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                    item.badgeColor || 'bg-blue-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Secondary Items */}
        {secondaryItems.length > 0 && (
          <div className="mt-8 pt-4 border-t border-slate-800">
            <p className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Advanced
            </p>
            <ul className="space-y-2 px-2">
              {secondaryItems.map(item => (
                <li key={item.id}>
                  <Link
                    to={getItemUrl(item)}
                    onClick={(e) => handleNavItemClick(item, e)}
                    className="flex items-center p-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Prominent Items */}
      {prominentItems.length > 0 && (
        <div className="p-4 border-t border-slate-800">
          {prominentItems.map(item => (
            <Link
              key={item.id}
              to={getItemUrl(item)}
              onClick={(e) => handleNavItemClick(item, e)}
              className="flex items-center justify-center p-2 mb-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <span className="mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
  
  // Render bottom navigation for mobile
  const renderBottomNav = () => (
    <div className={`fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 ${className}`}>
      <div className="grid grid-cols-5 h-16">
        {activeItems.slice(0, 5).map(item => (
          <Link
            key={item.id}
            to={getItemUrl(item)}
            onClick={() => handleNavItemClick(item)}
            className={`flex flex-col items-center justify-center px-2 ${
              location.pathname === item.href
                ? 'text-blue-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="mb-1">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
  
  return (
    <>
      {renderNavigation()}
    </>
  );
};

// Hook for using adaptive navigation programmatically
export const useAdaptiveNavigation = () => {
  const navigate = useNavigate();
  
  const navigateTo = (itemId: string) => {
    const item = ALL_NAV_ITEMS.find(i => i.id === itemId);
    if (item && item.href) {
      navigate(item.href);
    }
  };
  
  return {
    navigateTo
  };
};