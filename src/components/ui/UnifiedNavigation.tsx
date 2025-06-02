import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Building2,
  FileText,
  Users,
  Zap,
  Globe,
  ExternalLink,
  ArrowRight,
  User,
  Settings,
  LogOut,
  CreditCard,
  BarChart3,
  Upload,
  Eye,
  Bell
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  external?: boolean;
  onClick?: () => void;
  requiresAuth?: boolean;
  tier?: 'free' | 'pro' | 'enterprise';
}

interface UnifiedNavigationProps {
  variant?: 'default' | 'transparent' | 'solid';
  showCTA?: boolean;
  className?: string;
  user?: {
    name?: string;
    email?: string;
    tier?: 'free' | 'pro' | 'enterprise';
    avatar?: string;
    isAuthenticated?: boolean;
  };
}

export const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({
  variant = 'default',
  showCTA = true,
  className = '',
  user
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation items configuration
  const publicNavigationItems: NavItem[] = [
    {
      label: 'Product',
      children: [
        {
          label: 'Features',
          href: '/features',
          icon: <Zap className="w-4 h-4" />
        },
        {
          label: 'AI Capabilities',
          href: '/ai-features',
          icon: <Sparkles className="w-4 h-4" />,
          badge: 'New',
          badgeColor: 'bg-orange-500'
        },
        {
          label: 'Security',
          href: '/security',
          icon: <Shield className="w-4 h-4" />
        },
        {
          label: 'Trust Verification',
          href: '/trust-verification',
          icon: <Shield className="w-4 h-4" />,
          badge: 'Verify',
          badgeColor: 'bg-green-500'
        },
        {
          label: 'Batch Processing',
          href: '/batch-processing',
          icon: <FileText className="w-4 h-4" />
        },
        {
          label: 'Image Comparison',
          href: '/image-comparison',
          icon: <Eye className="w-4 h-4" />
        }
      ]
    },
    {
      label: 'Solutions',
      children: [
        {
          label: 'Enterprise',
          href: '/enterprise',
          icon: <Building2 className="w-4 h-4" />,
          badge: 'Popular',
          badgeColor: 'bg-blue-500'
        },
        {
          label: 'Legal Professionals',
          href: '/solutions/legal',
          icon: <Users className="w-4 h-4" />
        },
        {
          label: 'Insurance Companies',
          href: '/solutions/insurance',
          icon: <Shield className="w-4 h-4" />
        },
        {
          label: 'Healthcare',
          href: '/solutions/healthcare',
          icon: <FileText className="w-4 h-4" />
        },
        {
          label: 'Real Estate',
          href: '/solutions/realestate',
          icon: <Building2 className="w-4 h-4" />
        }
      ]
    },
    {
      label: 'Resources',
      children: [
        {
          label: 'Documentation',
          href: '/docs',
          icon: <FileText className="w-4 h-4" />
        },
        {
          label: 'Support Center',
          href: '/support',
          icon: <Users className="w-4 h-4" />
        },
        {
          label: 'Blog',
          href: '/blog',
          icon: <Globe className="w-4 h-4" />
        },
        {
          label: 'Contact',
          href: '/contact',
          icon: <Users className="w-4 h-4" />
        }
      ]
    },
    {
      label: 'Pricing',
      href: '/pricing'
    }
  ];

  const authenticatedNavigationItems: NavItem[] = [
    {
      label: 'Upload',
      href: '/app',
      icon: <Upload className="w-4 h-4" />
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      tier: 'pro'
    },
    {
      label: 'Enterprise',
      href: '/enterprise',
      icon: <Building2 className="w-4 h-4" />,
      tier: 'enterprise'
    }
  ];

  const userMenuItems: NavItem[] = [
    {
      label: 'Profile',
      href: '/profile',
      icon: <User className="w-4 h-4" />
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="w-4 h-4" />
    },
    {
      label: 'Billing',
      href: '/billing',
      icon: <CreditCard className="w-4 h-4" />
    },
    {
      label: 'Sign Out',
      onClick: () => {
        // Handle logout
        navigate('/auth/login');
      },
      icon: <LogOut className="w-4 h-4" />
    }
  ];

  // Get navigation background classes based on variant and scroll state
  const getNavClasses = () => {
    const baseClasses = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300';
    
    if (variant === 'transparent') {
      return `${baseClasses} ${scrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50' 
        : 'bg-transparent'
      }`;
    }
    
    if (variant === 'solid') {
      return `${baseClasses} bg-slate-900 border-b border-slate-700`;
    }
    
    // Default variant
    return `${baseClasses} bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50`;
  };

  const handleNavItemClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      if (item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        navigate(item.href);
      }
    }
    setActiveDropdown(null);
    setUserMenuOpen(false);
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
    setUserMenuOpen(false);
  };

  const shouldShowNavItem = (item: NavItem) => {
    if (item.requiresAuth && !user?.isAuthenticated) return false;
    if (item.tier && user?.tier !== item.tier && item.tier !== 'free') return false;
    return true;
  };

  const getTierBadgeColor = (tier?: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'pro': return 'bg-gradient-to-r from-blue-500 to-purple-600';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const navigationItems = user?.isAuthenticated ? authenticatedNavigationItems : publicNavigationItems;

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${getNavClasses()} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                ProofPix
              </span>
              {user?.isAuthenticated && user.tier && (
                <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${getTierBadgeColor(user.tier)}`}>
                  {user.tier.toUpperCase()}
                </span>
              )}
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.filter(shouldShowNavItem).map((item) => (
              <div key={item.label} className="relative dropdown-container">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center space-x-1 text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        activeDropdown === item.label ? 'rotate-180' : ''
                      }`} />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-xl overflow-hidden"
                        >
                          {item.children.map((child, index) => (
                            <motion.button
                              key={child.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              onClick={() => handleNavItemClick(child)}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                            >
                              {child.icon}
                              <span className="flex-1">{child.label}</span>
                              {child.badge && (
                                <span className={`px-2 py-0.5 text-xs rounded-full text-white font-medium ${
                                  child.badgeColor || 'bg-blue-500'
                                }`}>
                                  {child.badge}
                                </span>
                              )}
                              {child.external && <ExternalLink className="w-3 h-3" />}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href || '#'}
                    onClick={() => handleNavItemClick(item)}
                    className="flex items-center space-x-2 text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full text-white font-medium ${
                        item.badgeColor || 'bg-blue-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user?.isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">{user.name || 'User'}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-xl overflow-hidden"
                      >
                        {userMenuItems.map((item, index) => (
                          <motion.button
                            key={item.label}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            onClick={() => handleNavItemClick(item)}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  Sign In
                </Link>
                {showCTA && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/auth/register"
                      className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="space-y-6">
                {/* User Info (Mobile) */}
                {user?.isAuthenticated && (
                  <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name || 'User'}</div>
                      <div className="text-slate-400 text-sm">{user.email}</div>
                      {user.tier && (
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full text-white font-medium ${getTierBadgeColor(user.tier)}`}>
                          {user.tier.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Items */}
                {navigationItems.filter(shouldShowNavItem).map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(item.label)}
                          className="w-full flex items-center justify-between p-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <span className="font-medium">{item.label}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`} />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 ml-4 space-y-2"
                            >
                              {item.children.map((child) => (
                                <button
                                  key={child.label}
                                  onClick={() => handleNavItemClick(child)}
                                  className="w-full flex items-center space-x-3 p-3 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                >
                                  {child.icon}
                                  <span>{child.label}</span>
                                  {child.badge && (
                                    <span className={`px-2 py-0.5 text-xs rounded-full text-white font-medium ${
                                      child.badgeColor || 'bg-blue-500'
                                    }`}>
                                      {child.badge}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.href || '#'}
                        onClick={() => handleNavItemClick(item)}
                        className="flex items-center space-x-3 p-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-xs rounded-full text-white font-medium ${
                            item.badgeColor || 'bg-blue-500'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </motion.div>
                ))}

                {/* Mobile Auth Actions */}
                {!user?.isAuthenticated && (
                  <div className="pt-6 border-t border-slate-700 space-y-3">
                    <Link
                      to="/auth/login"
                      className="block w-full text-center py-3 px-4 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth/register"
                      className="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </div>
                )}

                {/* Mobile User Menu */}
                {user?.isAuthenticated && (
                  <div className="pt-6 border-t border-slate-700 space-y-2">
                    {userMenuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavItemClick(item)}
                        className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}; 