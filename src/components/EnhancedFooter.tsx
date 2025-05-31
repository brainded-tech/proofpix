import React from 'react';
import { Link } from 'react-router-dom';
import { Sponsorship } from './Sponsorships';

export const EnhancedFooter = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Sponsorship placement="bottom" className="max-w-4xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <nav className="space-y-2">
              <Link to="/#features" className="block text-gray-400 hover:text-white text-sm">Features</Link>
              <Link to="/security" className="block text-gray-400 hover:text-white text-sm">Security</Link>
              <Link to="/pricing" className="block text-gray-400 hover:text-white text-sm">Pricing</Link>
            </nav>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Enterprise</h3>
            <nav className="space-y-2">
              <Link to="/enterprise" className="block text-gray-400 hover:text-white text-sm">Enterprise Solutions</Link>
              <Link to="/enterprise/demo" className="block text-gray-400 hover:text-white text-sm">Live Demo</Link>
              <Link to="/enterprise/branding" className="block text-gray-400 hover:text-white text-sm">Brand Management</Link>
            </nav>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <nav className="space-y-2">
              <Link to="/docs" className="block text-gray-400 hover:text-white text-sm">Documentation</Link>
              <Link to="/docs/api" className="block text-gray-400 hover:text-white text-sm">API Reference</Link>
              <a href="https://blog.proofpixapp.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white text-sm">Blog</a>
            </nav>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <nav className="space-y-2">
              <Link to="/privacy" className="block text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
              <Link to="/terms" className="block text-gray-400 hover:text-white text-sm">Terms</Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">© 2025 ProofPix. Built for professionals, by professionals.</p>
        </div>
      </div>
    </footer>
  );
};
