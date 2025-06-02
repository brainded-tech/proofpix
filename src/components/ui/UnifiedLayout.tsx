import React from 'react';
import { motion } from 'framer-motion';
import { UnifiedNavigation } from './UnifiedNavigation';
import { 
  Shield, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail,
  MapPin,
  Phone,
  ExternalLink
} from 'lucide-react';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'transparent' | 'solid';
  showNavCTA?: boolean;
  showFooter?: boolean;
  className?: string;
  user?: {
    name?: string;
    email?: string;
    tier?: 'free' | 'pro' | 'enterprise';
    avatar?: string;
    isAuthenticated?: boolean;
  };
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  variant = 'default',
  showNavCTA = true,
  showFooter = true,
  className = '',
  user,
  pageTitle,
  pageDescription,
  breadcrumbs
}) => {
  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'AI Capabilities', href: '/ai-features' },
      { label: 'Security', href: '/security' },
      { label: 'Trust Verification', href: '/trust-verification' },
      { label: 'Batch Processing', href: '/batch-processing' },
      { label: 'Image Comparison', href: '/image-comparison' }
    ],
    solutions: [
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'Legal Professionals', href: '/solutions/legal' },
      { label: 'Insurance Companies', href: '/solutions/insurance' },
      { label: 'Healthcare', href: '/solutions/healthcare' },
      { label: 'Real Estate', href: '/solutions/realestate' }
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Support Center', href: '/support' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' }
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Partners', href: '/partners' }
    ]
  };

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com/proofpixapp', label: 'Twitter' },
    { icon: <Github className="w-5 h-5" />, href: 'https://github.com/proofpix', label: 'GitHub' },
    { icon: <Linkedin className="w-5 h-5" />, href: 'https://www.linkedin.com/company/proofpixapp', label: 'LinkedIn' }
  ];

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 ${className}`}>
      {/* Navigation */}
      <UnifiedNavigation 
        variant={variant}
        showCTA={showNavCTA}
        user={user}
      />

      {/* Main Content */}
      <main className="pt-20">
        {/* Page Header */}
        {(pageTitle || pageDescription || breadcrumbs) && (
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Breadcrumbs */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-4">
                  <ol className="flex items-center space-x-2 text-sm">
                    {breadcrumbs.map((crumb, index) => (
                      <li key={index} className="flex items-center">
                        {index > 0 && (
                          <span className="text-slate-400 mx-2">/</span>
                        )}
                        {crumb.href ? (
                          <a 
                            href={crumb.href}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            {crumb.label}
                          </a>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400">
                            {crumb.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Page Title & Description */}
              {(pageTitle || pageDescription) && (
                <div className="space-y-4">
                  {pageTitle && (
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-3xl font-bold text-slate-900 dark:text-slate-100"
                    >
                      {pageTitle}
                    </motion.h1>
                  )}
                  {pageDescription && (
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl"
                    >
                      {pageDescription}
                    </motion.p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                {/* Brand Section */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                      ProofPix
                    </span>
                  </div>
                  <p className="text-slate-400 mb-6 max-w-md">
                    The most trusted platform for image metadata analysis and document intelligence. 
                    Secure, private, and enterprise-ready.
                  </p>
                  
                  {/* Contact Info */}
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4" />
                      <span>support@proofpixapp.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4" />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                </div>

                {/* Product Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product</h3>
                  <ul className="space-y-3">
                    {footerLinks.product.map((link) => (
                      <li key={link.label}>
                        <a 
                          href={link.href}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solutions Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Solutions</h3>
                  <ul className="space-y-3">
                    {footerLinks.solutions.map((link) => (
                      <li key={link.label}>
                        <a 
                          href={link.href}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link) => (
                      <li key={link.label}>
                        <a 
                          href={link.href}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Company</h3>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.label}>
                        <a 
                          href={link.href}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-12 pt-8 border-t border-slate-800">
                <div className="max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                  <p className="text-slate-400 mb-4">
                    Get the latest updates on new features and security enhancements.
                  </p>
                  <div className="flex space-x-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="py-8 border-t border-slate-800">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                {/* Copyright */}
                <div className="text-slate-400 text-sm">
                  © 2025 ProofPix. All rights reserved.
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-6">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>

                {/* Security Badges */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Shield className="w-4 h-4" />
                    <span>SOC 2 Certified</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Shield className="w-4 h-4" />
                    <span>GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}; 