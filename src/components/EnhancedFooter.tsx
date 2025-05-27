import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sponsorship } from './Sponsorships';

export const EnhancedFooter = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Sponsorship placement="bottom" className="max-w-4xl mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div><h3 className="text-white font-semibold mb-4">Product</h3><nav className="space-y-2"><button onClick={() => navigate('/')} className="block text-gray-400 hover:text-white text-sm">Home</button><button onClick={() => navigate('/security')} className="block text-gray-400 hover:text-white text-sm">Security</button></nav></div>
          <div><h3 className="text-white font-semibold mb-4">Enterprise</h3><nav className="space-y-2"><button onClick={() => navigate('/enterprise')} className="block text-gray-400 hover:text-white text-sm">Enterprise Solutions</button><button onClick={() => navigate('/enterprise/demo')} className="block text-gray-400 hover:text-white text-sm">Live Demo</button><button onClick={() => navigate('/enterprise/branding')} className="block text-gray-400 hover:text-white text-sm">Brand Management</button></nav></div>
          <div><h3 className="text-white font-semibold mb-4">Documentation</h3><nav className="space-y-2"><button onClick={() => navigate('/docs/api-reference')} className="block text-gray-400 hover:text-white text-sm">API Reference</button></nav></div>
          <div><h3 className="text-white font-semibold mb-4">Legal</h3><nav className="space-y-2"><button onClick={() => navigate('/privacy')} className="block text-gray-400 hover:text-white text-sm">Privacy Policy</button><button onClick={() => navigate('/terms')} className="block text-gray-400 hover:text-white text-sm">Terms</button></nav></div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">© 2025 ProofPix. Built for professionals, by professionals.</p>
        </div>
      </div>
    </footer>
  );
};
