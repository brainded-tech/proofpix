import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';
import './styles/main.css';
import { ProofPix } from './ProofPix';
import { AboutUs } from './components/AboutUs';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { FAQ } from './components/FAQ';

export function App() {
  const location = useLocation();
  
  // Debug: Log current location
  React.useEffect(() => {
    console.log('Current route:', location.pathname);
  }, [location]);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<ProofPix />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        {/* Catch all route for debugging */}
        <Route path="*" element={
          <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Route Not Found</h2>
              <p className="mb-4">Current path: {location.pathname}</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Go Home
              </button>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
} 