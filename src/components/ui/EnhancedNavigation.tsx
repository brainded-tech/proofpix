import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';

interface NavigationProps {
  variant?: 'default' | 'transparent' | 'solid';
  showCTA?: boolean;
  className?: string;
}

interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  children?: NavItem[];
  icon?: React.ReactNode;
  badge?: string;
  external?: boolean;
}

export const EnhancedNavigation: React.FC<NavigationProps> = ({
  variant = 'default',
  showCTA = true,
  className = ''
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Navigation items configuration
  const navigationItems: NavItem[] = [
    {
      label: 'Product',
      children: [
        {
          label: 'Features',
          href: '/#features',
          icon: <Zap className="w-4 h-4" />
        },
        {
          label: 'AI Capabilities',
          href: '/ai-features',
          icon: <Sparkles className="w-4 h-4" />,
          badge: 'New'
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
          badge: 'Verify'
        },
        {
          label: 'API Documentation',
          href: '/docs/api',
          icon: <FileText className="w-4 h-4" />
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
          badge: 'Popular'
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
          href: 'https://blog.proofpixapp.com',
          icon: <Globe className="w-4 h-4" />,
          external: true
        }
      ]
    },
    {
      label: 'Pricing',
      href: '/pricing'
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
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${getNavClasses()} ${className}`}
    >
      <div className="pp-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="pp-text-heading-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              ProofPix
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center space-x-1 pp-text-body-md text-slate-300 hover:text-white transition-colors duration-200 py-2"
                    >
                      <span>{item.label}</span>
                      <motion.div
                        animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-xl overflow-hidden"
                        >
                          {item.children.map((child, index) => (
                            <motion.button
                              key={child.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              onClick={() => handleNavItemClick(child)}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-700/50 transition-colors group"
                            >
                              {child.icon && (
                                <span className="text-slate-400 group-hover:text-blue-400 transition-colors">
                                  {child.icon}
                                </span>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="pp-text-body-sm text-slate-300 group-hover:text-white transition-colors">
                                    {child.label}
                                  </span>
                                  {child.badge && (
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                      {child.badge}
                                    </span>
                                  )}
                                  {child.external && (
                                    <ExternalLink className="w-3 h-3 text-slate-500" />
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavItemClick(item)}
                    className="pp-text-body-md text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}

            {/* CTA Button */}
            {showCTA && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/enterprise/demo')}
                className="pp-btn pp-btn-primary pp-btn-md group"
              >
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                Get Started
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
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

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50"
          >
            <div className="pp-container py-6">
              <div className="space-y-6">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(`mobile-${item.label}`)}
                          className="flex items-center justify-between w-full pp-text-body-md text-slate-300 hover:text-white transition-colors py-2"
                        >
                          <span>{item.label}</span>
                          <motion.div
                            animate={{ rotate: activeDropdown === `mobile-${item.label}` ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {activeDropdown === `mobile-${item.label}` && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 ml-4 space-y-3"
                            >
                              {item.children.map((child, childIndex) => (
                                <motion.button
                                  key={child.label}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: childIndex * 0.05 }}
                                  onClick={() => handleNavItemClick(child)}
                                  className="flex items-center space-x-3 w-full text-left py-2 px-3 rounded-lg hover:bg-slate-700/50 transition-colors group"
                                >
                                  {child.icon && (
                                    <span className="text-slate-400 group-hover:text-blue-400 transition-colors">
                                      {child.icon}
                                    </span>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="pp-text-body-sm text-slate-300 group-hover:text-white transition-colors">
                                        {child.label}
                                      </span>
                                      {child.badge && (
                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                          {child.badge}
                                        </span>
                                      )}
                                      {child.external && (
                                        <ExternalLink className="w-3 h-3 text-slate-500" />
                                      )}
                                    </div>
                                  </div>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleNavItemClick(item)}
                        className="block w-full text-left pp-text-body-md text-slate-300 hover:text-white transition-colors py-2"
                      >
                        {item.label}
                      </button>
                    )}
                  </motion.div>
                ))}

                {/* Mobile CTA */}
                {showCTA && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: navigationItems.length * 0.1 }}
                    className="pt-4 border-t border-slate-700"
                  >
                    <button
                      onClick={() => navigate('/enterprise/demo')}
                      className="w-full pp-btn pp-btn-primary pp-btn-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      Get Started
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </motion.nav>
  );
};

export default EnhancedNavigation; 