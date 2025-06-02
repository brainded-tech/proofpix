import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ExternalLink, 
  Github, 
  Twitter, 
  Linkedin,
  Mail,
  ArrowUp,
  Sparkles,
  Globe, 
  Building2, 
  Phone, 
  MapPin
} from 'lucide-react';

interface FooterLink {
  label: string;
  to?: string;
  href?: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const EnhancedFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections: FooterSection[] = [
    {
      title: "Core Features",
      links: [
        { label: "Image Analysis", to: "/" },
        { label: "Image Comparison", to: "/image-comparison" },
        { label: "Batch Processing", to: "/batch-processing" },
        { label: "Security & Privacy", to: "/security" },
        { label: "Professional Reports", to: "/features" }
      ]
    },
    {
      title: "Solutions",
      links: [
        { label: "Legal & Compliance", to: "/solutions/legal" },
        { label: "Healthcare", to: "/solutions/healthcare" },
        { label: "Insurance", to: "/solutions/insurance" },
        { label: "Real Estate", to: "/solutions/realestate" },
        { label: "Enterprise", to: "/enterprise" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", to: "/docs" },
        { label: "API Reference", to: "/docs/api" },
        { label: "Interactive Demos", to: "/enterprise/demo-selection" },
        { label: "Blog", href: "https://blog.proofpixapp.com", external: true },
        { label: "Support Center", to: "/support" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Pricing", to: "/pricing" },
        { label: "Contact Sales", to: "/contact" },
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Terms of Service", to: "/terms" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com/proofpix", label: "GitHub" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/proofpixapp", label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/company/proofpixapp", label: "LinkedIn" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:hello@proofpixapp.com", label: "Email" }
  ];

  return (
    <footer className="relative bg-slate-900 border-t border-slate-800 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-900 pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
      <div className="absolute top-0 right-1/3 w-px h-24 bg-gradient-to-b from-emerald-500/20 to-transparent"></div>
      
      <div className="relative pp-container py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="pp-text-heading-md font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                ProofPix
              </span>
            </div>
            <p className="pp-text-body-sm text-slate-400 leading-relaxed mb-6">
              Privacy-first image intelligence for professionals. Extract metadata, analyze images, and generate reports—all processed locally on your device.
            </p>
            
            {/* Social links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 border border-slate-700/50 hover:border-slate-600"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="pp-text-heading-sm text-white mb-6 font-semibold">
                {section.title}
              </h3>
              <nav className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <motion.div
                    key={linkIndex}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center pp-text-body-sm text-slate-400 hover:text-white transition-colors duration-200 group"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        to={link.to!}
                        className="block pp-text-body-sm text-slate-400 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-slate-800 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="pp-text-body-sm text-slate-400">
                © 2025 ProofPix. Built for professionals, by professionals.
              </p>
              <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="pp-text-caption text-emerald-400 font-medium">100% Private</span>
              </div>
            </div>
            
            {/* Back to top button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-all duration-200 border border-slate-700/50 hover:border-slate-600"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="pp-text-body-sm">Back to top</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
