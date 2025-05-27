import React from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentationFooter: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            <p>© 2025 ProofPix. Built for professionals, by professionals.</p>
            <p>Privacy-respecting EXIF metadata tool - v1.8.0 • Open Source</p>
          </div>
          <nav className="flex space-x-6 text-sm">
            <button onClick={handleBackHome} className="text-gray-400 hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => navigate('/docs')} className="text-gray-400 hover:text-white transition-colors">
              Documentation
            </button>
            <button onClick={() => navigate('/faq')} className="text-gray-400 hover:text-white transition-colors">
              FAQ
            </button>
            <button onClick={() => navigate('/about')} className="text-gray-400 hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </button>
            <button onClick={() => navigate('/support')} className="text-gray-400 hover:text-white transition-colors">
              Support
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default DocumentationFooter; 