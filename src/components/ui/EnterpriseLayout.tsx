import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Camera, 
  Shield, 
  Building2, 
  Eye, 
  Menu, 
  X,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

interface EnterpriseLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHero?: boolean;
  heroContent?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  backgroundColor?: 'white' | 'slate-50' | 'slate-100' | 'dark' | 'slate-800' | 'slate-900';
}

export const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({
  children,
  title,
  description,
  showHero = false,
  heroContent,
  maxWidth = '7xl',
  backgroundColor = 'dark'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
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

  return (
    <div className={`min-h-screen ${backgroundClasses[backgroundColor]}`}>
      {/* Navigation Header */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-bold text-slate-100 truncate">ProofPix</h1>
                  <p className="text-xs text-slate-400 -mt-0.5 truncate hidden sm:block">Document Intelligence Platform</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/security')}
                  className={`transition-colors text-sm font-medium flex items-center space-x-2 ${
                    isActive('/security') 
                      ? 'text-blue-400' 
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Security</span>
                </button>
                
                <button 
                  onClick={() => navigate('/enterprise')}
                  className={`transition-colors text-sm font-medium flex items-center space-x-2 ${
                    isActive('/enterprise') 
                      ? 'text-blue-400' 
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Enterprise</span>
                </button>

                <button 
                  onClick={() => navigate('/pricing')}
                  className={`transition-colors text-sm font-medium ${
                    isActive('/pricing') 
                      ? 'text-blue-400' 
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  Pricing
                </button>

                {/* Documentation Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDocsDropdownOpen(!docsDropdownOpen)}
                    className={`transition-colors text-sm font-medium flex items-center space-x-1 ${
                      location.pathname.startsWith('/docs') 
                        ? 'text-blue-400' 
                        : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    <span>Documentation</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {docsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 z-50">
                      <button
                        onClick={() => { navigate('/docs'); setDocsDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                      >
                        Documentation Home
                      </button>
                      <button
                        onClick={() => { navigate('/docs/getting-started'); setDocsDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                      >
                        Getting Started
                      </button>
                      <button
                        onClick={() => { navigate('/docs/api'); setDocsDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                      >
                        API Reference
                      </button>
                      <button
                        onClick={() => { navigate('/docs/enterprise-security'); setDocsDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                      >
                        Enterprise Security
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => navigate('/enterprise/demo')}
                  className={`transition-colors text-sm font-medium flex items-center space-x-2 ${
                    isActive('/enterprise/demo') 
                      ? 'text-blue-400' 
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Try Demo</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/enterprise/demo')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Enterprise Demo
                </button>
              </div>
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
              <button 
                onClick={() => { navigate('/security'); setMobileMenuOpen(false); }}
                className="block text-slate-300 hover:text-slate-100 transition-colors text-base font-medium w-full text-left"
              >
                Security
              </button>
              <button 
                onClick={() => { navigate('/enterprise'); setMobileMenuOpen(false); }}
                className="block text-slate-300 hover:text-slate-100 transition-colors text-base font-medium w-full text-left"
              >
                Enterprise
              </button>
              <button 
                onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }}
                className="block text-slate-300 hover:text-slate-100 transition-colors text-base font-medium w-full text-left"
              >
                Pricing
              </button>
              <button 
                onClick={() => { navigate('/docs'); setMobileMenuOpen(false); }}
                className="block text-slate-300 hover:text-slate-100 transition-colors text-base font-medium w-full text-left"
              >
                Documentation
              </button>
              <button 
                onClick={() => { navigate('/enterprise/demo'); setMobileMenuOpen(false); }}
                className="block text-slate-300 hover:text-slate-100 transition-colors text-base font-medium w-full text-left"
              >
                Try Demo
              </button>
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
      <main className={`py-12 px-4 sm:px-6 lg:px-8 mx-auto ${maxWidthClasses[maxWidth]}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} ProofPix. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Click outside to close dropdowns */}
      {docsDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setDocsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default EnterpriseLayout; 