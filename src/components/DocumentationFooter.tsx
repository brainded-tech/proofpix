import React from 'react';
import { Link } from 'react-router-dom';

const DocumentationFooter: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            <p>© 2025 ProofPix. Built for professionals, by professionals.</p>
            <p>Privacy-respecting EXIF metadata tool - v1.8.0 • Open Source</p>
          </div>
          <nav className="flex space-x-6 text-sm">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/docs" className="text-gray-400 hover:text-white transition-colors">
              Documentation
            </Link>
            <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
              FAQ
            </Link>
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
              Support
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default DocumentationFooter; 