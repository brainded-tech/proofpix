import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, MapPin, Twitter, Linkedin, Github } from 'lucide-react';

interface UnifiedFooterProps {
  variant?: 'default' | 'minimal';
}

export const UnifiedFooter: React.FC<UnifiedFooterProps> = ({ variant = 'default' }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'API', href: '/api' },
      { label: 'Integrations', href: '/integrations' },
    ],
    useCases: [
      { label: 'Legal Professionals', href: '/legal' },
      { label: 'Insurance Claims', href: '/insurance' },
      { label: 'Healthcare Systems', href: '/healthcare' },
      { label: 'Real Estate', href: '/real-estate' },
      { label: 'Government', href: '/government' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Support Center', href: '/support' },
      { label: 'Trust & Security', href: '/trust-verification' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/proofpix', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/proofpix', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/proofpix', label: 'GitHub' },
  ];

  if (variant === 'minimal') {
    return (
      <footer className="bg-slate-900 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ProofPix</span>
            </div>
            <div className="text-sm text-slate-400">
              © {currentYear} ProofPix. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-900 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ProofPix</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              The only image intelligence platform that's architecturally impossible to breach. 
              Trusted by 50,000+ professionals worldwide.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm text-slate-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@proofpixapp.com" className="hover:text-white transition-colors">
                  support@proofpixapp.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>Philadelphia, PA</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Use Cases Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Use Cases</h3>
            <ul className="space-y-2">
              {footerLinks.useCases.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-slate-400 mb-4 md:mb-0">
              © {currentYear} ProofPix. All rights reserved. | 
              <Link to="/privacy" className="hover:text-white transition-colors ml-1">Privacy Policy</Link> | 
              <Link to="/terms" className="hover:text-white transition-colors ml-1">Terms of Service</Link>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-slate-700/50 mt-8 pt-8">
          <div className="flex flex-wrap items-center justify-center space-x-8 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>SOC 2 Type II Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>HIPAA Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 