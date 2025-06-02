import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Menu, 
  X, 
  ChevronDown,
  Layers,
  Zap,
  FileText,
  Building2,
  Users,
  BarChart3,
  Settings,
  ArrowRight,
  Sparkles,
  Eye,
  Search,
  Brain,
  Target,
  Scale,
  Heart
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  description?: string;
  tier?: 'free' | 'pro' | 'enterprise';
  isNew?: boolean;
}

interface DropdownSection {
  title: string;
  items: NavigationItem[];
}

export const StandardHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Primary Features - prominently displayed
  const primaryFeatures: NavigationItem[] = [
    {
      name: 'Image Analysis',
      href: '/',
      icon: Eye,
      description: 'Extract metadata and analyze images'
    },
    {
      name: 'Image Comparison',
      href: '/image-comparison',
      icon: Layers,
      description: 'Compare two images side-by-side',
      tier: 'pro'
    },
    {
      name: 'Batch Processing',
      href: '/batch-processing',
      icon: Zap,
      description: 'Process multiple images at once',
      tier: 'pro'
    }
  ];

  // Solutions dropdown
  const solutionsDropdown: DropdownSection[] = [
    {
      title: 'By Industry',
      items: [
        { name: 'Legal & Compliance', href: '/solutions/legal', icon: Scale },
        { name: 'Healthcare', href: '/solutions/healthcare', icon: Heart },
        { name: 'Insurance', href: '/solutions/insurance', icon: Shield },
        { name: 'Real Estate', href: '/solutions/realestate', icon: Building2 }
      ]
    },
    {
      title: 'By Use Case',
      items: [
        { name: 'Document Verification', href: '/solutions/verification', icon: FileText },
        { name: 'Privacy Compliance', href: '/security', icon: Shield },
        { name: 'Forensic Analysis', href: '/solutions/forensics', icon: Search }
      ]
    }
  ];

  // Enterprise dropdown
  const enterpriseDropdown: DropdownSection[] = [
    {
      title: 'Enterprise Tools',
      items: [
        { name: 'Enterprise Dashboard', href: '/enterprise', icon: BarChart3 },
        { name: 'Team Management', href: '/enterprise/teams', icon: Users },
        { name: 'API & Integrations', href: '/docs/api', icon: Settings },
        { name: 'ROI Dashboard', href: '/enterprise/roi-dashboard', icon: Target }
      ]
    },
    {
      title: 'AI & Analytics',
      items: [
        { name: 'AI Document Intelligence', href: '/ai/document-intelligence', icon: Brain, tier: 'enterprise' },
        { name: 'Advanced Analytics', href: '/advanced-analytics', icon: BarChart3, tier: 'pro' },
        { name: 'Security Dashboard', href: '/security-dashboard', icon: Shield, tier: 'pro' }
      ]
    }
  ];

  // Demos dropdown
  const demosDropdown: NavigationItem[] = [
    { name: 'Interactive Demos', href: '/enterprise/demo-selection', icon: Target },
    { name: 'Industry Showcases', href: '/demos/industry', icon: Building2 },
    { name: 'Feature Walkthroughs', href: '/demos/features', icon: Eye }
  ];

  const mainNavigation = [
    { name: 'Features', href: '/features' },
    { 
      name: 'Solutions', 
      href: '#',
      dropdown: solutionsDropdown
    },
    { 
      name: 'Enterprise', 
      href: '/enterprise',
      dropdown: enterpriseDropdown
    },
    { 
      name: 'Demos', 
      href: '#',
      dropdown: demosDropdown
    },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Docs', href: '/docs' }
  ];

  const handleDropdownToggle = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  const getTierBadge = (tier?: string) => {
    if (!tier) return null;
    
    const colors = {
      pro: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      enterprise: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    };

    return (
      <span className={`ml-2 px-1.5 py-0.5 text-xs font-medium rounded border ${colors[tier as keyof typeof colors]}`}>
        {tier.toUpperCase()}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeDropdowns}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              ProofPix
            </span>
          </Link>

          {/* Primary Features - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {primaryFeatures.map((feature) => (
              <Link
                key={feature.name}
                to={feature.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === feature.href
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {feature.icon && <feature.icon className="w-4 h-4" />}
                <span>{feature.name}</span>
                {getTierBadge(feature.tier)}
              </Link>
            ))}
          </div>

          {/* Main Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <button
                    onClick={() => handleDropdownToggle(item.name)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === item.name ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.href
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    onClick={closeDropdowns}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === item.name && item.dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden"
                    >
                      {Array.isArray(item.dropdown) && item.dropdown.length > 0 && 'name' in item.dropdown[0] ? (
                        // Simple dropdown (demos) - array of NavigationItems
                        <div className="p-2">
                          {(item.dropdown as NavigationItem[]).map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.href}
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                              onClick={closeDropdowns}
                            >
                              {dropdownItem.icon && <dropdownItem.icon className="w-4 h-4" />}
                              <span>{dropdownItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        // Sectioned dropdown (solutions, enterprise) - array of DropdownSections
                        <div className="p-2">
                          {(item.dropdown as DropdownSection[]).map((section, sectionIndex) => (
                            <div key={section.title} className={sectionIndex > 0 ? 'mt-4 pt-4 border-t border-slate-700' : ''}>
                              <h4 className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                {section.title}
                              </h4>
                              <div className="mt-1 space-y-1">
                                {section.items.map((sectionItem) => (
                                  <Link
                                    key={sectionItem.name}
                                    to={sectionItem.href}
                                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors group"
                                    onClick={closeDropdowns}
                                  >
                                    <div className="flex items-center space-x-3">
                                      {sectionItem.icon && <sectionItem.icon className="w-4 h-4" />}
                                      <span>{sectionItem.name}</span>
                                      {getTierBadge(sectionItem.tier)}
                                    </div>
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              Try Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-slate-800 border-t border-slate-700"
          >
            <div className="px-4 py-6 space-y-6">
              {/* Primary Features */}
              <div>
                <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Core Features
                </h3>
                <div className="mt-2 space-y-1">
                  {primaryFeatures.map((feature) => (
                    <Link
                      key={feature.name}
                      to={feature.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {feature.icon && <feature.icon className="w-5 h-5" />}
                      <span>{feature.name}</span>
                      {getTierBadge(feature.tier)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Main Navigation */}
              <div>
                <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Navigation
                </h3>
                <div className="mt-2 space-y-1">
                  {mainNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href === '#' ? '/features' : item.href}
                      className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-center font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Try Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeDropdowns}
        />
      )}
    </header>
  );
}; 