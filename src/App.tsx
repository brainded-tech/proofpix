import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/global.css';
import './styles/main.css';
import './styles/design-system.css';
import './styles/modern.css';
import './styles/enterprise.css';
import './styles/enterprise-design-system.css';
import './styles/enhanced-design-system.css';
import './styles/dark-mode-overrides.css';
import { ProofPix } from './ProofPix';
import { AboutUs } from './components/AboutUs';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { FAQ } from './components/FAQ';
import { Terms } from './components/Terms';
import { Support } from './components/Support';
import PricingPage from './components/PricingPage';
import UnifiedPricingPage from './components/UnifiedPricingPage';
import DocumentIntelligencePricing from './components/DocumentIntelligencePricing';
import SuccessPage from './components/SuccessPage';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { ImageComparisonPage } from './pages/ImageComparisonPage';
import { BatchProcessingPage } from './pages/BatchProcessingPage';
import { BatchManagementPage } from './components/BatchManagementPage';
import { Enterprise } from './pages/Enterprise';
import EnterpriseDemo from './pages/EnterpriseDemo';
import EnterpriseBranding from './pages/EnterpriseBranding';
import IndustryDemoConfigurations from './components/industry/IndustryDemoConfigurations';
import ToastContainer from './components/EnhancedToastSystem';
import { EnterpriseLayout } from './components/ui/EnterpriseLayout';
import { StandardLayout } from './components/ui/StandardLayout';
import { EnterpriseButton } from './components/ui/EnterpriseComponents';
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
import { ChainOfCustodyPage } from './pages/ChainOfCustodyPage';

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
import { MainApp } from './pages/MainApp';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import EnhancedDashboard from './pages/EnhancedDashboard';
import { BillingPage } from './pages/BillingPage';
import { LandingPage } from './pages/LandingPage';
import { SecurityDashboardPage } from './pages/SecurityDashboardPage';
import ContentQualityDashboard from './components/content/ContentQualityDashboard';
import ContentManagement from './pages/ContentManagement';
import { AdvancedAnalyticsPage } from './pages/AdvancedAnalyticsPage';
import { AdvancedReportingPage } from './pages/AdvancedReportingPage';
import { EnterpriseSSOPage } from './pages/EnterpriseSSOPage';

// Priority 4: Enterprise SSO & Security Enhancement - New Imports
import EnterpriseAuth from './components/auth/EnterpriseAuth';
import EnterpriseSecurityDashboard from './components/security/SecurityDashboard';

// Priority 5: AI/ML Integration & Intelligent Features - New Imports
import AIDocumentIntelligenceDashboard from './components/ai/AIDocumentIntelligenceDashboard';
import SmartDocumentAssistant from './components/ai/SmartDocumentAssistant';
import { AIEnhancedPricingPage } from './pages/AIEnhancedPricingPage';
import IntelligentDocumentClassificationDashboard from './components/ai/IntelligentDocumentClassificationDashboard';
import SmartRecommendationsEngine from './components/ai/SmartRecommendationsEngine';
import DemoModeController from './components/demo/DemoModeController';

// Priority 9: Enterprise Integrations - New Import
import EnterpriseIntegrationsDashboard from './components/integrations/EnterpriseIntegrationsDashboard';

// Priority 10: Advanced Deployment Infrastructure & DevOps Automation - New Import
import { DevOpsDashboard } from './components/devops/DevOpsDashboard';

// Priority 14: Enterprise Marketplace & Ecosystem - New Import
import { EnterpriseMarketplaceDashboard } from './components/marketplace/EnterpriseMarketplaceDashboard';
import { WorkflowBuilder } from './components/marketplace/WorkflowBuilder';
import { MarketplaceDashboard } from './components/marketplace/MarketplaceDashboard';
import { APIMarketplace } from './components/marketplace/APIMarketplace';

// Priority 16: Plugin Architecture & Marketplace Ecosystem - Frontend Components
import { DeveloperPortal } from './components/marketplace/DeveloperPortal';
import { WhiteLabelInterface } from './components/marketplace/WhiteLabelInterface';
import { PluginManagementInterface } from './components/marketplace/PluginManagementInterface';

// Import enhanced systems for global access (development/testing)
import { errorHandler } from './utils/errorHandler';
import { performanceOptimizer } from './utils/performanceOptimizer';
import useEnhancedPdfGenerator from './utils/enhancedPdfGenerator';
import { enhancedDataExporter } from './utils/enhancedDataExporter';

// Page imports - Commented out missing pages
// import { HomePage } from './pages/HomePage';
// import { AnalyticsPage } from './pages/AnalyticsPage';
// import { SettingsPage } from './pages/SettingsPage';
// import { PreferencesPage } from './pages/PreferencesPage';
// import { DocsPage } from './pages/DocsPage';
// import { APIPage } from './pages/APIPage';
// import { DocumentationPage } from './pages/DocumentationPage';
// import { ExamplesPage } from './pages/ExamplesPage';
// import { AdminDashboard } from './pages/AdminDashboard';
// import { EnterpriseFeatures } from './pages/EnterpriseFeatures';
// import { SecurityExplainer } from './pages/SecurityExplainer';
// import { PrivacyPledge } from './pages/PrivacyPledge';
// import { UpgradePage } from './pages/UpgradePage';
// import { MetadataExplainerPage } from './pages/MetadataExplainerPage';
// import { TeamManagement } from './pages/TeamManagement';
import AdaptiveUXDemoPage from './pages/AdaptiveUXDemo';
import ProtectedAnalyticsRoute from './components/analytics/ProtectedAnalyticsRoute';
import LeadManagementDashboard from './components/automation/LeadManagementDashboard';

// Import solution pages
import LegalSolution from './pages/solutions/LegalSolution';
import InsuranceSolution from './pages/solutions/InsuranceSolution';
import HealthcareSolution from './pages/solutions/HealthcareSolution';
import Blog from './pages/Blog';
import Features from './pages/Features';

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

// ScrollToTop component to fix navigation scroll issues
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// import PerformanceOptimizationDashboard from './components/optimization/PerformanceOptimizationDashboard';
// import AIMLPlatformDashboard from './components/ai/AIMLPlatformDashboard';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
      <Routes>
            {/* Public Routes */}
        <Route path="/" element={<ProofPix />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            
            {/* Priority 4: Enterprise SSO & Security Enhancement Routes */}
            <Route 
              path="/auth/enterprise" 
              element={
                <EnterpriseAuth 
                  onAuthSuccess={(result) => {
                    console.log('Enterprise auth success:', result);
                    window.location.href = '/dashboard';
                  }}
                  onAuthError={(error) => {
                    console.error('Enterprise auth error:', error);
                  }}
                />
              } 
            />
            <Route 
              path="/enterprise/security" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <EnterpriseSecurityDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Enterprise Public Routes */}
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/enterprise/demo" element={<EnterpriseDemo />} />
            <Route path="/enterprise/ai-demo" element={<AIDocumentIntelligenceDashboard />} />
            <Route path="/enterprise/chain-of-custody" element={<ChainOfCustodyPage />} />
            <Route path="/enterprise/branding" element={<EnterpriseBranding />} />
            <Route path="/enterprise/industry-demos" element={<IndustryDemoConfigurations />} />
            <Route path="/security" element={<Security />} />
            
            {/* UNIFIED PRICING SYSTEM - All pricing routes redirect to main /pricing */}
            <Route path="/pricing" element={<UnifiedPricingPage />} />
            
            {/* Pricing Redirects - Consolidate all pricing pages into unified system */}
            <Route path="/pricing-page" element={<Navigate to="/pricing" replace />} />
            <Route path="/document-intelligence-pricing" element={<Navigate to="/pricing?view=industry" replace />} />
            <Route path="/docs/ai-pricing" element={<Navigate to="/pricing?view=enterprise" replace />} />
            <Route path="/enterprise/pricing" element={<Navigate to="/pricing?view=enterprise" replace />} />
            <Route path="/legal-pricing" element={<Navigate to="/pricing?industry=legal" replace />} />
            <Route path="/insurance-pricing" element={<Navigate to="/pricing?industry=insurance" replace />} />
            <Route path="/healthcare-pricing" element={<Navigate to="/pricing?industry=healthcare" replace />} />
            <Route path="/realestate-pricing" element={<Navigate to="/pricing?industry=realestate" replace />} />
            <Route path="/government-pricing" element={<Navigate to="/pricing?industry=government" replace />} />
            
            {/* Legacy pricing routes for SEO preservation */}
            <Route path="/pricing-legacy" element={<PricingPage />} />
            <Route path="/document-intelligence-pricing-legacy" element={<DocumentIntelligencePricing />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/enhanced-dashboard" 
              element={
                <ProtectedRoute>
                  <EnhancedDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/app" 
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/billing" 
              element={
                <ProtectedRoute>
                  <BillingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Add specific routes for shared dashboards and individual dashboard pages */}
            <Route 
              path="/analytics/dashboard/:dashboardId" 
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics/shared" 
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics/preferences" 
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advanced-analytics" 
              element={
                <ProtectedRoute>
                  <AdvancedAnalyticsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/security-dashboard" 
              element={
                <ProtectedRoute>
                  <SecurityDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chain-of-custody" 
              element={
                <ProtectedRoute>
                  <ChainOfCustodyPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/image-comparison" element={<ImageComparisonPage />} />
            <Route path="/batch-processing" element={<BatchProcessingPage />} />
            <Route 
              path="/advanced-reporting" 
              element={
                <ProtectedRoute>
                  <AdvancedReportingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/enterprise-sso" 
              element={
                <ProtectedRoute>
                  <EnterpriseSSOPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/content-management" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} />
            
            {/* Enterprise Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Admin Panel
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400">
                        Admin functionality coming soon...
                      </p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Core Application Routes */}
            <Route path="/settings" element={<SettingsPlaceholder />} />
            <Route path="/support" element={<Support />} />
            <Route path="/docs" element={<DocumentationIndex />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
        
        {/* Documentation Routes */}
        <Route path="/docs/getting-started" element={<GettingStarted />} />
        <Route path="/docs/privacy-guide" element={<PrivacyGuide />} />
        <Route path="/docs/metadata-guide" element={<MetadataGuide />} />
            <Route path="/docs/api" element={<ApiReference />} />
            <Route path="/docs/index" element={<DocumentationIndex />} />
        <Route path="/docs/architecture" element={<Architecture />} />
        <Route path="/docs/testing" element={<TestingGuide />} />
        <Route path="/docs/deployment" element={<DeploymentGuide />} />
        <Route path="/docs/enterprise-security" element={<EnterpriseSecurity />} />
        <Route path="/docs/security-faq" element={<SecurityFAQ />} />
            <Route path="/docs/enterprise-api" element={<EnterpriseApiDocumentation />} />
            <Route path="/docs/enterprise-deployment" element={<EnterpriseDeploymentGuide />} />
            <Route path="/docs/security-architecture" element={<SecurityArchitectureOverview />} />
            <Route path="/docs/compliance-templates" element={<ComplianceDocumentationTemplates />} />
            <Route path="/docs/enterprise-security-faq" element={<EnterpriseSecurityFAQ />} />
            <Route path="/docs/compliance-checklist" element={<ComplianceChecklist />} />
            <Route path="/docs/security-architecture-doc" element={<SecurityArchitectureDocument />} />
            <Route path="/docs/security-onepager" element={<SecurityOnePager />} />
            <Route path="/docs/ciso-presentation" element={<CISOPresentationDeck />} />
            <Route path="/docs/security-questionnaire" element={<SecurityQuestionnaireResponses />} />
            <Route path="/docs/competitive-security" element={<CompetitiveSecurityAnalysis />} />
            <Route path="/docs/ai-pricing" element={<AIDrivenPricing />} />
            <Route path="/docs/custom-branding" element={<CustomBranding />} />
            <Route path="/docs/implementation-status" element={<ImplementationStatus />} />
            <Route path="/docs/demo-walkthrough" element={<EnterpriseDemoWalkthrough />} />
            <Route path="/docs/sales-playbook" element={<SalesPlaybook />} />
            <Route path="/docs/roi-calculator" element={<ROICalculator />} />
            <Route path="/docs/customer-stories" element={<CustomerSuccessStories />} />
            <Route path="/docs/implementation-guides" element={<ImplementationGuides />} />
            <Route path="/docs/content-quality" element={<ContentQualityDashboard />} />
            
            {/* Legacy Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/faq-legacy" element={<FAQ />} />
            <Route path="/terms-legacy" element={<Terms />} />
            <Route path="/support-legacy" element={<Support />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/batch-management" element={<BatchManagementPage onBackToHome={() => window.location.href = '/'} />} />
            <Route path="/industry-demos" element={<IndustryDemoConfigurations />} />
            
            {/* Redirect authenticated users to dashboard */}
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/register" element={<Navigate to="/auth/register" replace />} />
            
            {/* New route for Adaptive UX Demo */}
            <Route path="/adaptive-ux-demo" element={<AdaptiveUXDemoPage />} />
            
            {/* AUTOMATION & SALES TOOLS */}
            <Route path="/sales/leads" element={<LeadManagementDashboard />} />
            
            {/* Solution Routes */}
            <Route path="/solutions/legal" element={<LegalSolution />} />
            <Route path="/solutions/insurance" element={<InsuranceSolution />} />
            <Route path="/solutions/healthcare" element={<HealthcareSolution />} />
            
            {/* Blog Route */}
            <Route path="/blog" element={<Blog />} />
            
            {/* AI-Enhanced Pricing Route */}
            <Route path="/ai-pricing" element={<AIEnhancedPricingPage />} />
            
            {/* Phase 5C: Intelligent Document Classification & Smart Recommendations Routes */}
            <Route 
              path="/ai/document-classification" 
              element={
                <ProtectedRoute>
                  <IntelligentDocumentClassificationDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai/smart-recommendations" 
              element={
                <ProtectedRoute>
                  <SmartRecommendationsEngine />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai/document-intelligence" 
              element={
                <ProtectedRoute>
                  <AIDocumentIntelligenceDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai/smart-assistant" 
              element={
                <ProtectedRoute>
                  <SmartDocumentAssistant />
                </ProtectedRoute>
              } 
            />
            
            {/* Priority 5: AI/ML Integration & Intelligent Features */}
            <Route 
              path="/ai/dashboard" 
              element={
                <ProtectedRoute>
                  <AIDocumentIntelligenceDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Priority 9: Enterprise Integrations */}
            <Route path="/enterprise/integrations" element={
              <ProtectedRoute>
                <EnterpriseIntegrationsDashboard />
              </ProtectedRoute>
            } />
            
            {/* Priority 10: Advanced Deployment Infrastructure & DevOps Automation */}
            <Route path="/devops" element={
              <ProtectedRoute>
                <DevOpsDashboard />
              </ProtectedRoute>
            } />
            
            {/* Priority 14: Enterprise Marketplace & Ecosystem */}
            <Route path="/marketplace" element={
              <ProtectedRoute>
                <EnterpriseMarketplaceDashboard />
              </ProtectedRoute>
            } />
            <Route path="/marketplace/workflow-builder" element={
              <ProtectedRoute>
                <WorkflowBuilder />
              </ProtectedRoute>
            } />
            <Route path="/marketplace/workflow-builder/:templateId" element={
              <ProtectedRoute>
                <WorkflowBuilder />
              </ProtectedRoute>
            } />
            
            {/* Priority 16: Plugin Architecture & Marketplace Ecosystem - Frontend Routes */}
            <Route path="/developer-portal" element={
              <ProtectedRoute>
                <DeveloperPortal />
              </ProtectedRoute>
            } />
            <Route path="/marketplace/developer" element={
              <ProtectedRoute>
                <DeveloperPortal />
              </ProtectedRoute>
            } />
            <Route path="/white-label" element={
              <ProtectedRoute>
                <WhiteLabelInterface />
              </ProtectedRoute>
            } />
            <Route path="/marketplace/white-label" element={
              <ProtectedRoute>
                <WhiteLabelInterface />
              </ProtectedRoute>
            } />
            <Route path="/plugins" element={
              <ProtectedRoute>
                <PluginManagementInterface />
              </ProtectedRoute>
            } />
            <Route path="/marketplace/plugins" element={
              <ProtectedRoute>
                <PluginManagementInterface />
              </ProtectedRoute>
            } />
            
            {/* Features page route */}
            <Route path="/features" element={<Features />} />
            
            {/* New routes for Performance Optimization and AI/ML Platform */}
            {/* Route path="/performance-optimization" element={<PerformanceOptimizationDashboard />} /> */}
            {/* Route path="/ai-ml-platform" element={<AIMLPlatformDashboard />} /> */}
            
            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<MarketplaceDashboard />} />
            <Route path="/marketplace/apis" element={<APIMarketplace />} />
            <Route path="/marketplace/plugins" element={<MarketplaceDashboard />} />
            <Route path="/marketplace/workflows" element={<MarketplaceDashboard />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
            </div>
      </Router>
      
      {/* Enhanced Toast System */}
      <ToastContainer />
      
      {/* Global AI Assistant - Available on all pages */}
      <SmartDocumentAssistant />
    </AuthProvider>
  );
}

// Placeholder components for routes that will be implemented later
const PricingPlaceholder: React.FC = () => (
  <StandardLayout
    showHero
    title="Pricing Plans"
    description="Pricing page coming soon. Choose the perfect plan for your needs."
    maxWidth="6xl"
    backgroundColor="dark"
  >
    <div className="text-center">
      <EnterpriseButton onClick={() => window.location.href = '/'}>
        Back to Home
      </EnterpriseButton>
    </div>
  </StandardLayout>
);

const SettingsPlaceholder: React.FC = () => (
  <EnterpriseLayout
    showHero
    title="Account Settings"
    description="Settings page coming soon. Manage your account preferences."
    maxWidth="6xl"
    backgroundColor="dark"
  >
    <div className="text-center">
      <EnterpriseButton onClick={() => window.location.href = '/dashboard'}>
        Back to Dashboard
      </EnterpriseButton>
    </div>
  </EnterpriseLayout>
);

const NotFoundPage: React.FC = () => (
  <EnterpriseLayout
    showHero
    title="404 - Page Not Found"
    description="The page you're looking for doesn't exist."
    maxWidth="6xl"
    backgroundColor="dark"
  >
    <div className="text-center">
      <h1 className="text-6xl font-bold text-slate-100 mb-4">404</h1>
      <EnterpriseButton onClick={() => window.location.href = '/'}>
        Back to Home
      </EnterpriseButton>
    </div>
  </EnterpriseLayout>
);

export default App;
