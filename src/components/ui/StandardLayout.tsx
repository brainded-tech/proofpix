import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Shield, 
  Menu, 
  X, 
  Building2, 
  FileText, 
  Users, 
  Globe,
  Camera,
  ChevronDown
} from 'lucide-react';

interface StandardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHero?: boolean;
  heroContent?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  backgroundColor?: 'white' | 'slate-50' | 'slate-100' | 'dark' | 'slate-800' | 'slate-900';
  className?: string;
}

export const StandardLayout: React.FC<StandardLayoutProps> = ({
  children,
  title,
  description,
  showHero = false,
  heroContent,
  maxWidth = '7xl',
  backgroundColor = 'dark',
  className = ''
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  const backgroundClasses = {
    'white': 'bg-white text-slate-900',
    'slate-50': 'bg-slate-50 text-slate-900',
    'slate-100': 'bg-slate-100 text-slate-900',
    'dark': 'bg-[#0f1729] text-slate-100',
    'slate-800': 'bg-slate-800 text-slate-100',
    'slate-900': 'bg-slate-900 text-slate-100'
  };

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      label: 'Product',
      children: [
        { label: 'Features', href: '/#features' },
        { label: 'AI Capabilities', href: '/ai-features' },
        { label: 'Security', href: '/security' },
        { label: 'Trust Verification', href: '/trust-verification' },
        { label: 'API Documentation', href: '/docs/api' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Enterprise Demo', href: '/enterprise/demo' }
      ]
    },
    {
      label: 'Solutions',
      children: [
        { label: 'Enterprise', href: '/enterprise' },
        { label: 'Legal Professionals', href: '/solutions/legal' },
        { label: 'Insurance Companies', href: '/solutions/insurance' },
        { label: 'Healthcare', href: '/solutions/healthcare' }
      ]
    },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Documentation', href: '/docs' }
  ];

  return (
    <div className={`min-h-screen ${backgroundClasses[backgroundColor]} ${className}`}>
      {/* Standard Navigation Header */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Always clickable to go home */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-100">ProofPix</h1>
                  <p className="text-xs text-slate-400 -mt-0.5">Image Metadata Platform</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                {navigationItems.map((item) => (
                  <div key={item.label} className="relative">
                    {item.children ? (
                      <div className="relative">
                        <button
                          onClick={() => setSolutionsDropdownOpen(!solutionsDropdownOpen)}
                          className="flex items-center space-x-1 text-slate-300 hover:text-slate-100 transition-colors text-sm font-medium"
                        >
                          <span>{item.label}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        
                        {solutionsDropdownOpen && item.label === 'Solutions' && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2 z-50">
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                to={child.href}
                                onClick={() => setSolutionsDropdownOpen(false)}
                                className="block px-4 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-700"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href!}
                        className={`transition-colors text-sm font-medium ${
                          isActive(item.href!) 
                            ? 'text-blue-400' 
                            : 'text-slate-300 hover:text-slate-100'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => navigate('/enterprise/demo')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Try Demo
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-slate-100 p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <div>
                      <div className="text-slate-300 font-medium text-base mb-2">{item.label}</div>
                      <div className="pl-4 space-y-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-slate-400 hover:text-slate-100 transition-colors text-sm"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href!}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-slate-300 hover:text-slate-100 transition-colors text-base font-medium"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-slate-700">
                <button 
                  onClick={() => { navigate('/enterprise/demo'); setMobileMenuOpen(false); }}
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
                >
                  Try Enterprise Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      {showHero && (
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 border-b border-slate-700">
          <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8`}>
            {heroContent || (
              <div className="text-center">
                {title && (
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 mb-4 leading-tight">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className={`py-8 px-4 sm:px-6 lg:px-8 mx-auto ${maxWidthClasses[maxWidth]}`}>
        {children}
      </main>

      {/* Standard Footer */}
      <footer className="mt-auto py-12 border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  ProofPix
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4 max-w-md leading-relaxed">
                Privacy-first image metadata extraction platform. Process images locally with enterprise-grade security.
              </p>
            </div>
            
            {/* Product Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/enterprise" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Enterprise
                  </Link>
                </li>
                <li>
                  <Link to="/security" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link to="/docs/api" className="text-sm text-slate-400 hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Company Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="border-t border-slate-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400 text-sm">
              © 2025 ProofPix. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/support" className="text-sm text-slate-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Click outside to close dropdowns */}
      {solutionsDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setSolutionsDropdownOpen(false)}
        />
      )}
    </div>
  );
}; 