import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, ChevronDown, Menu, X, Users, FileText, Zap, Building, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UnifiedHeaderProps {
  variant?: 'default' | 'enterprise' | 'minimal';
  showCTA?: boolean;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ 
  variant = 'default', 
  showCTA = true 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Features',
      href: '/features',
      dropdown: [
        { label: 'Metadata Analysis', href: '/features/metadata', icon: FileText },
        { label: 'Batch Processing', href: '/batch-processing', icon: Zap },
        { label: 'Image Comparison', href: '/image-comparison', icon: Users },
        { label: 'AI Document Intelligence', href: '/ai-features', icon: Zap },
        { label: 'Privacy Mode', href: '/privacy-mode', icon: Shield },
      ]
    },
    {
      label: 'Use Cases',
      href: '/use-cases',
      dropdown: [
        { label: 'Legal Professionals', href: '/legal', icon: Building },
        { label: 'Insurance Claims', href: '/insurance', icon: Shield },
        { label: 'Healthcare Systems', href: '/healthcare', icon: Users },
        { label: 'Real Estate', href: '/real-estate', icon: Building },
        { label: 'Government & Security', href: '/government', icon: Shield },
      ]
    },
    {
      label: 'Solutions',
      href: '/solutions',
      dropdown: [
        { label: 'Enterprise', href: '/enterprise', icon: Building },
        { label: 'AI Packages', href: '/ai-packages', icon: Zap },
        { label: 'Workflow Templates', href: '/workflow-templates', icon: FileText },
        { label: 'API Integration', href: '/api', icon: Zap },
        { label: 'White Label', href: '/white-label', icon: Building },
      ]
    },
    {
      label: 'Resources',
      href: '/resources',
      dropdown: [
        { label: 'Documentation', href: '/docs', icon: FileText },
        { label: 'Blog', href: '/blog', icon: FileText },
        { label: 'Case Studies', href: '/case-studies', icon: Users },
        { label: 'Trust & Security', href: '/trust-verification', icon: Shield },
        { label: 'Support Center', href: '/support', icon: Users },
      ]
    },
    {
      label: 'Pricing',
      href: '/pricing',
    },
    {
      label: 'Contact',
      href: '/contact',
      dropdown: [
        { label: 'Contact Sales', href: '/contact?type=sales', icon: Phone },
        { label: 'Support', href: '/contact?type=support', icon: Mail },
        { label: 'Schedule Demo', href: 'https://calendly.com/proofpix/demo', icon: Users, external: true },
      ]
    }
  ];

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const handleNavigation = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank');
    } else {
      navigate(href);
    }
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const isActivePath = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ProofPix</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <button
                    onClick={() => handleDropdownToggle(item.label)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActivePath(item.href) || activeDropdown === item.label
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      activeDropdown === item.label ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActivePath(item.href)
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-xl shadow-xl py-2"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map((dropdownItem) => {
                        const IconComponent = dropdownItem.icon;
                        return (
                          <button
                            key={dropdownItem.label}
                            onClick={() => handleNavigation(dropdownItem.href, dropdownItem.external)}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                          >
                            <IconComponent className="w-4 h-4 text-slate-400" />
                            <span>{dropdownItem.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          {showCTA && (
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                to="/enterprise/demo"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Try Demo
              </Link>
              <Link
                to="/pricing"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-slate-700/50 py-4"
            >
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => handleDropdownToggle(item.label)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                        >
                          <span>{item.label}</span>
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
                              className="ml-4 mt-2 space-y-1"
                            >
                              {item.dropdown.map((dropdownItem) => {
                                const IconComponent = dropdownItem.icon;
                                return (
                                  <button
                                    key={dropdownItem.label}
                                    onClick={() => handleNavigation(dropdownItem.href, dropdownItem.external)}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors rounded-lg"
                                  >
                                    <IconComponent className="w-4 h-4" />
                                    <span>{dropdownItem.label}</span>
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActivePath(item.href)
                            ? 'text-blue-400 bg-blue-500/10'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                
                {showCTA && (
                  <div className="pt-4 border-t border-slate-700/50 space-y-2">
                    <Link
                      to="/enterprise/demo"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      Try Demo
                    </Link>
                    <Link
                      to="/pricing"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 text-center"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}; 