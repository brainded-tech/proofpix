import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';
import './styles/main.css';
import { ProofPix } from './ProofPix';
import { AboutUs } from './components/AboutUs';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { FAQ } from './components/FAQ';
import { Terms } from './components/Terms';
import { Support } from './components/Support';
import PricingPage from './components/PricingPage';
import SuccessPage from './components/SuccessPage';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { BatchManagementPage } from './components/BatchManagementPage';
import ToastContainer from './components/EnhancedToastSystem';
import GettingStarted from './pages/docs/GettingStarted';
import PrivacyGuide from './pages/docs/PrivacyGuide';
import MetadataGuide from './pages/docs/MetadataGuide';
import ApiDocs from './pages/docs/ApiDocs';

// Import enhanced systems for global access (development/testing)
import { errorHandler } from './utils/errorHandler';
import { performanceOptimizer } from './utils/performanceOptimizer';
import { enhancedPdfGenerator } from './utils/enhancedPdfGenerator';
import { enhancedDataExporter } from './utils/enhancedDataExporter';

export function App() {
  const location = useLocation();
  
  // Debug: Log current location
  React.useEffect(() => {
    console.log('Current route:', location.pathname);
  }, [location]);

  // Make enhanced systems available globally for testing
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).errorHandler = errorHandler;
      (window as any).performanceOptimizer = performanceOptimizer;
      (window as any).enhancedPdfGenerator = enhancedPdfGenerator;
      (window as any).enhancedDataExporter = enhancedDataExporter;
      console.log('✅ Enhanced systems available globally for testing');
    }
  }, []);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<ProofPix />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/support" element={<Support />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/batch" element={<BatchManagementPage onBackToHome={() => window.location.href = '/'} />} />
        
        {/* Documentation Routes */}
        <Route path="/docs/getting-started" element={<GettingStarted />} />
        <Route path="/docs/privacy-guide" element={<PrivacyGuide />} />
        <Route path="/docs/metadata-guide" element={<MetadataGuide />} />
        <Route path="/docs/api" element={<ApiDocs />} />
        
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
      
      {/* Enhanced Toast System */}
      <ToastContainer />
    </div>
  );
} 