import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';
import './styles/main.css';
import './styles/design-system.css';
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
import { Enterprise } from './pages/Enterprise';
import EnterpriseDemo from './pages/EnterpriseDemo';
import EnterpriseBranding from './pages/EnterpriseBranding';
import IndustryDemoConfigurations from './components/industry/IndustryDemoConfigurations';
import ToastContainer from './components/EnhancedToastSystem';
import GettingStarted from './pages/docs/GettingStarted';
import PrivacyGuide from './pages/docs/PrivacyGuide';
import MetadataGuide from './pages/docs/MetadataGuide';
import ApiDocs from './pages/docs/ApiDocs';
import DocumentationIndex from './pages/docs/DocumentationIndex';
import Architecture from './pages/docs/Architecture';
import ApiReference from './pages/docs/ApiReference';
import TestingGuide from './pages/docs/TestingGuide';
import DeploymentGuide from './pages/docs/DeploymentGuide';
import EnterpriseSecurity from './pages/docs/EnterpriseSecurity';
import SecurityFAQ from './pages/docs/SecurityFAQ';
import EnterpriseApiDocumentation from './pages/docs/EnterpriseApiDocumentation';
import EnterpriseDeploymentGuide from './pages/docs/EnterpriseDeploymentGuide';
import SecurityArchitectureOverview from './pages/docs/SecurityArchitectureOverview';
import ComplianceDocumentationTemplates from './pages/docs/ComplianceDocumentationTemplates';
import EnterpriseSecurityFAQ from './pages/docs/EnterpriseSecurityFAQ';
import ComplianceChecklist from './pages/docs/ComplianceChecklist';
import SecurityArchitectureDocument from './pages/docs/SecurityArchitectureDocument';
import SecurityOnePager from './pages/docs/SecurityOnePager';
import CISOPresentationDeck from './pages/docs/CISOPresentationDeck';
import SecurityQuestionnaireResponses from './pages/docs/SecurityQuestionnaireResponses';
import CompetitiveSecurityAnalysis from './pages/docs/CompetitiveSecurityAnalysis';
import { AIDrivenPricing } from './pages/docs/AIDrivenPricing';
import { CustomBranding } from './pages/docs/CustomBranding';
import { ImplementationStatus } from './pages/docs/ImplementationStatus';
import { EnterpriseDemoWalkthrough } from './pages/docs/EnterpriseDemoWalkthrough';
import { SalesPlaybook } from './pages/docs/SalesPlaybook';
import { ROICalculator } from './pages/docs/ROICalculator';
import { CustomerSuccessStories } from './pages/docs/CustomerSuccessStories';
import { ImplementationGuides } from './pages/docs/ImplementationGuides';
import Security from './pages/Security';

// Import enhanced systems for global access (development/testing)
import { errorHandler } from './utils/errorHandler';
import { performanceOptimizer } from './utils/performanceOptimizer';
import useEnhancedPdfGenerator from './utils/enhancedPdfGenerator';
import { enhancedDataExporter } from './utils/enhancedDataExporter';

// Redirect component for external documentation
const RedirectComponent: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  React.useEffect(() => {
    window.location.href = url;
  }, [url]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Redirecting to {title}...</h2>
        <p className="mb-4">You'll be redirected to our comprehensive documentation.</p>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
};

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
      (window as any).useEnhancedPdfGenerator = useEnhancedPdfGenerator;
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
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/enterprise/demo" element={<EnterpriseDemo />} />
        <Route path="/enterprise/industry-demos" element={<IndustryDemoConfigurations />} />
        <Route path="/enterprise/branding" element={<EnterpriseBranding />} />
        <Route path="/security" element={<Security />} />
        
        {/* Documentation Routes */}
        <Route path="/docs" element={<DocumentationIndex />} />
        <Route path="/docs/getting-started" element={<GettingStarted />} />
        <Route path="/docs/privacy-guide" element={<PrivacyGuide />} />
        <Route path="/docs/metadata-guide" element={<MetadataGuide />} />
        <Route path="/docs/api" element={<ApiDocs />} />
        <Route path="/docs/architecture" element={<Architecture />} />
        <Route path="/docs/api-reference" element={<ApiReference />} />
        <Route path="/docs/testing" element={<TestingGuide />} />
        <Route path="/docs/deployment" element={<DeploymentGuide />} />
        <Route path="/docs/enterprise-security" element={<EnterpriseSecurity />} />
        <Route path="/docs/security-faq" element={<SecurityFAQ />} />
        
        {/* New Enterprise Documentation Routes */}
        <Route path="/docs/enterprise-api" element={<EnterpriseApiDocumentation />} />
        <Route path="/docs/enterprise-deployment" element={<EnterpriseDeploymentGuide />} />
        <Route path="/docs/security-architecture" element={<SecurityArchitectureOverview />} />
        <Route path="/docs/compliance-templates" element={<ComplianceDocumentationTemplates />} />
        
        {/* Additional Security Documentation Routes */}
        <Route path="/docs/enterprise-security-faq" element={<EnterpriseSecurityFAQ />} />
        <Route path="/docs/compliance-checklist" element={<ComplianceChecklist />} />
        <Route path="/docs/security-architecture-document" element={<SecurityArchitectureDocument />} />
        
        {/* Sales Enablement Security Documents */}
        <Route path="/docs/security-one-pager" element={<SecurityOnePager />} />
        <Route path="/docs/ciso-presentation" element={<CISOPresentationDeck />} />
        <Route path="/docs/security-questionnaire" element={<SecurityQuestionnaireResponses />} />
        <Route path="/docs/competitive-security-analysis" element={<CompetitiveSecurityAnalysis />} />
                    <Route path="/docs/ai-pricing" element={<AIDrivenPricing />} />
            <Route path="/docs/custom-branding" element={<CustomBranding />} />
            <Route path="/docs/implementation-status" element={<ImplementationStatus />} />
            <Route path="/docs/enterprise-demo-walkthrough" element={<EnterpriseDemoWalkthrough />} />
            <Route path="/docs/sales-playbook" element={<SalesPlaybook />} />
            <Route path="/docs/roi-calculator" element={<ROICalculator />} />
            <Route path="/docs/customer-success-stories" element={<CustomerSuccessStories />} />
            <Route path="/docs/implementation-guides" element={<ImplementationGuides />} />
        
        {/* External Documentation Links - These will redirect to GitHub */}
        <Route path="/docs/enterprise" element={<RedirectComponent url="https://github.com/brainded-tech/proofpix/blob/main/ENTERPRISE_GUIDE.md" title="Enterprise Guide" />} />
        <Route path="/docs/pro" element={<RedirectComponent url="https://github.com/brainded-tech/proofpix/blob/main/PRO_USER_GUIDE.md" title="Pro User Guide" />} />
        <Route path="/docs/compliance" element={<RedirectComponent url="https://github.com/brainded-tech/proofpix/blob/main/COMPLIANCE_GUIDE.md" title="Compliance Guide" />} />
        <Route path="/docs/integration" element={<RedirectComponent url="https://github.com/brainded-tech/proofpix/blob/main/INTEGRATION_GUIDE.md" title="Integration Guide" />} />
        
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