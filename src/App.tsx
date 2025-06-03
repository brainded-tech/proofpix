import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/global.css';
import './styles/main.css';
import './styles/design-system.css';
import './styles/modern.css';
import './styles/enterprise.css';
import './styles/enterprise-design-system.css';
import './styles/enhanced-design-system.css';
import './styles/dark-mode-overrides.css';
import './styles/button-contrast-fixes.css';
import './styles/container-background-fixes.css';
import './styles/comprehensive-ui-fixes.css';
import { ProofPix } from './ProofPix';
import ToastContainer from './components/EnhancedToastSystem';
import { errorHandler } from './utils/errorHandler';
import { performanceOptimizer } from './utils/performanceOptimizer';
import useEnhancedPdfGenerator from './utils/enhancedPdfGenerator';
import { enhancedDataExporter } from './utils/enhancedDataExporter';

// Keep essential components that are used immediately
import { TestAuthProvider } from './components/auth/TestAuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SimpleTestLogin } from './components/auth/SimpleTestLogin';

// Lazy load all major components for code splitting
const AboutUs = React.lazy(() => import('./components/AboutUs'));
const PrivacyPolicy = React.lazy(() => import('./components/PrivacyPolicy'));
const FAQ = React.lazy(() => import('./components/FAQ'));
const Terms = React.lazy(() => import('./components/Terms'));
const Support = React.lazy(() => import('./components/Support'));
const PricingPage = React.lazy(() => import('./components/PricingPage'));
const UnifiedPricingPage = React.lazy(() => import('./components/UnifiedPricingPage'));
const DocumentIntelligencePricing = React.lazy(() => import('./components/DocumentIntelligencePricing'));

// Lazy load pages
const AnalyticsDashboard = React.lazy(() => import('./pages/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));
const ImageComparisonPage = React.lazy(() => import('./pages/ImageComparisonPage').then(module => ({ default: module.ImageComparisonPage })));
const BatchProcessingPage = React.lazy(() => import('./pages/BatchProcessingPage'));
const BatchManagementPage = React.lazy(() => import('./components/BatchManagementPage'));
const Enterprise = React.lazy(() => import('./pages/Enterprise').then(module => ({ default: module.Enterprise })));
const EnterpriseDemo = React.lazy(() => import('./pages/EnterpriseDemo'));
const EnterpriseBranding = React.lazy(() => import('./pages/EnterpriseBranding'));
const IndustryDemoConfigurations = React.lazy(() => import('./components/industry/IndustryDemoConfigurations'));

// Lazy load documentation
const GettingStarted = React.lazy(() => import('./pages/docs/GettingStarted'));
const PrivacyGuide = React.lazy(() => import('./pages/docs/PrivacyGuide'));
const MetadataGuide = React.lazy(() => import('./pages/docs/MetadataGuide'));
const ApiDocs = React.lazy(() => import('./pages/docs/ApiDocs'));
const DocumentationIndex = React.lazy(() => import('./pages/docs/DocumentationIndex'));
const Architecture = React.lazy(() => import('./pages/docs/Architecture'));
const ApiReference = React.lazy(() => import('./pages/docs/ApiReference'));
const TestingGuide = React.lazy(() => import('./pages/docs/TestingGuide'));
const DeploymentGuide = React.lazy(() => import('./pages/docs/DeploymentGuide'));

// Lazy load enterprise components
const EnterpriseLayout = React.lazy(() => import('./components/ui/EnterpriseLayout').then(module => ({ default: module.EnterpriseLayout })));
const StandardLayout = React.lazy(() => import('./components/ui/StandardLayout').then(module => ({ default: module.StandardLayout })));
const EnterpriseButton = React.lazy(() => import('./components/ui/EnterpriseComponents').then(module => ({ default: module.EnterpriseButton })));

// Lazy load dashboard and main pages
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const EnhancedDashboard = React.lazy(() => import('./pages/EnhancedDashboard'));
const BillingPage = React.lazy(() => import('./pages/BillingPage').then(module => ({ default: module.BillingPage })));
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const SecurityDashboardPage = React.lazy(() => import('./pages/SecurityDashboardPage'));
const ContentManagement = React.lazy(() => import('./pages/ContentManagement'));
const AdvancedAnalyticsPage = React.lazy(() => import('./pages/AdvancedAnalyticsPage').then(module => ({ default: module.AdvancedAnalyticsPage })));
const AdvancedReportingPage = React.lazy(() => import('./pages/AdvancedReportingPage'));
const EnterpriseSSOPage = React.lazy(() => import('./pages/EnterpriseSSOPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const SuccessPage = React.lazy(() => import('./components/SuccessPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogEditor = React.lazy(() => import('./pages/BlogEditor'));

// Lazy load auth pages
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })));

// Lazy load solution pages
const LegalSolution = React.lazy(() => import('./pages/solutions/LegalSolution'));
const InsuranceSolution = React.lazy(() => import('./pages/solutions/InsuranceSolution'));
const HealthcareSolution = React.lazy(() => import('./pages/solutions/HealthcareSolution'));
const RealEstateSolution = React.lazy(() => import('./pages/solutions/RealEstateSolution'));
const Features = React.lazy(() => import('./pages/Features'));
const BatchProcessing = React.lazy(() => import('./pages/BatchProcessing'));
const ImageComparison = React.lazy(() => import('./pages/ImageComparison'));

// Lazy load AI and marketplace components
const EnterpriseMarketplaceDashboard = React.lazy(() => import('./components/marketplace/EnterpriseMarketplaceDashboard').then(module => ({ default: module.EnterpriseMarketplaceDashboard })));
const WorkflowBuilder = React.lazy(() => import('./components/marketplace/WorkflowBuilder').then(module => ({ default: module.WorkflowBuilder })));
const MarketplaceDashboard = React.lazy(() => import('./components/marketplace/MarketplaceDashboard').then(module => ({ default: module.MarketplaceDashboard })));
const APIMarketplace = React.lazy(() => import('./components/marketplace/APIMarketplace').then(module => ({ default: module.APIMarketplace })));

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
import { WorkflowBuilder } from './components/marketplace/WorkflowBuilder';

// Priority 16: Plugin Architecture & Marketplace Ecosystem - Frontend Components
import { DeveloperPortal } from './components/marketplace/DeveloperPortal';
import { WhiteLabelInterface } from './components/marketplace/WhiteLabelInterface';
import { PluginManagementInterface } from './components/marketplace/PluginManagementInterface';

// URGENT: Custom AI Training Dashboard and Visual Workflow Builder
import { CustomAITrainingDashboard } from './components/ai/CustomAITrainingDashboard';
import { VisualWorkflowBuilder } from './components/workflow/VisualWorkflowBuilder';
import { EnterpriseFeatureShowcase } from './components/enterprise/EnterpriseFeatureShowcase';

// Enterprise AI Packages and ROI Components
import ROIMeasurementDashboard from './components/enterprise/ROIMeasurementDashboard';
import EnterpriseComplianceTemplates from './components/enterprise/ComplianceDocumentationTemplates';

// Hybrid Architecture Demo for Sales
import { HybridArchitectureDemo } from './components/demo/HybridArchitectureDemo';

// BILLION-DOLLAR HYBRID ARCHITECTURE PAGES
import ModeComparisonPage from './pages/ModeComparisonPage';
import HybridPricingPage from './pages/HybridPricingPage';

// UI Showcase for demonstrating new components
import UIShowcase from './pages/UIShowcase';

// Import enhanced systems for global access (development/testing)
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
import RealEstateSolution from './pages/solutions/RealEstateSolution';
import Features from './pages/Features';
import BatchProcessing from './pages/BatchProcessing';
import ImageComparison from './pages/ImageComparison';

// Trust Verification Dashboard - Strategic UX Implementation
import TrustVerificationPage from './pages/TrustVerificationPage';
import AIFeaturesPositioning from './components/AIFeaturesPositioning';

// AI Package Pages
import LegalAIPackage from './pages/ai/LegalAIPackage';
import HealthcareAIPackage from './pages/ai/HealthcareAIPackage';
import FinancialAIPackage from './pages/ai/FinancialAIPackage';
import InsuranceAIPackage from './pages/ai/InsuranceAIPackage';
import { SimpleTestLogin } from './components/auth/SimpleTestLogin';

// Workflow Template Library
import WorkflowTemplateLibrary from './content/WorkflowTemplateLibrary';

// New Comprehensive Documentation Imports
import AIDocumentIntelligenceGuide from './pages/docs/AIDocumentIntelligenceGuide';
import SmartDocumentAssistantGuide from './pages/docs/SmartDocumentAssistantGuide';
import ComprehensiveAPIGuide from './pages/docs/ComprehensiveAPIGuide';
import SecurityComplianceGuide from './pages/docs/SecurityComplianceGuide';
import EnterpriseIntegrationsGuide from './pages/docs/EnterpriseIntegrationsGuide';
import BlogContentManagementGuide from './pages/docs/BlogContentManagementGuide';

// New pages for header navigation
import PrivacyMode from './pages/PrivacyMode';
import UseCases from './pages/UseCases';

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

// Plausible Analytics type declaration
declare global {
  interface Window {
    plausible?: (event: string, options?: any) => void;
  }
}

// Lazy load major components
const LandingPageLazy = React.lazy(() => import('./pages/LandingPage'));
const DashboardLazy = React.lazy(() => import('./pages/Dashboard'));
const FeaturesLazy = React.lazy(() => import('./pages/Features'));
const EnterpriseLazy = React.lazy(() => import('./pages/Enterprise'));
const EnterpriseDemoLazy = React.lazy(() => import('./pages/EnterpriseDemo'));
const SecurityLazy = React.lazy(() => import('./pages/Security'));
const PrivacyModeLazy = React.lazy(() => import('./pages/PrivacyMode'));
const ContactPageLazy = React.lazy(() => import('./pages/ContactPage'));
const FAQLazy = React.lazy(() => import('./components/FAQ'));
const PrivacyPolicyLazy = React.lazy(() => import('./components/PrivacyPolicy'));
const TermsLazy = React.lazy(() => import('./components/Terms'));
const SupportLazy = React.lazy(() => import('./components/Support'));

// Lazy load complex pages
const BatchProcessingLazy = React.lazy(() => import('./pages/BatchProcessing'));
const ImageComparisonLazy = React.lazy(() => import('./pages/ImageComparison'));
const ImageComparisonPageLazy = React.lazy(() => import('./pages/ImageComparisonPage'));
const AnalyticsDashboardLazy = React.lazy(() => import('./pages/AnalyticsDashboard'));
const AdvancedAnalyticsPageLazy = React.lazy(() => import('./pages/AdvancedAnalyticsPage'));
const BillingPageLazy = React.lazy(() => import('./pages/BillingPage'));
const ContentManagementLazy = React.lazy(() => import('./pages/ContentManagement'));
const BlogEditorLazy = React.lazy(() => import('./pages/BlogEditor'));

// Lazy load documentation
const DocumentationIndexLazy = React.lazy(() => import('./pages/docs/DocumentationIndex'));
const GettingStartedLazy = React.lazy(() => import('./pages/docs/GettingStarted'));
const ApiReferenceLazy = React.lazy(() => import('./pages/docs/ApiReference'));
const MetadataGuideLazy = React.lazy(() => import('./pages/docs/MetadataGuide'));
const PrivacyGuideLazy = React.lazy(() => import('./pages/docs/PrivacyGuide'));
const TestingGuideLazy = React.lazy(() => import('./pages/docs/TestingGuide'));
const DeploymentGuideLazy = React.lazy(() => import('./pages/docs/DeploymentGuide'));
const ArchitectureLazy = React.lazy(() => import('./pages/docs/Architecture'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

export function App() {
  return (
    <TestAuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
      <Routes>
            {/* Public Routes */}
        <Route path="/" element={<ProofPix />} />
        <Route path="/features" element={<FeaturesLazy />} />
        <Route path="/batch-processing" element={<BatchProcessingLazy />} />
        <Route path="/image-comparison" element={<ImageComparisonLazy />} />
        <Route path="/ui-showcase" element={<UIShowcase />} />
        <Route path="/landing" element={<LandingPageLazy />} />
        <Route path="/contact" element={<ContactPageLazy />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/test-auth" element={<SimpleTestLogin />} />
            
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
            <Route path="/enterprise" element={<EnterpriseLazy />} />
            <Route path="/enterprise/demo" element={<EnterpriseDemoLazy />} />
            <Route path="/enterprise/demo-selection" element={<IndustryDemoConfigurations />} />
            <Route path="/enterprise/ai-demo" element={<AIDocumentIntelligenceDashboard />} />
            <Route path="/enterprise/chain-of-custody" element={<ChainOfCustodyPage />} />
            <Route path="/enterprise/branding" element={<EnterpriseBranding />} />
            <Route path="/enterprise/industry-demos" element={<IndustryDemoConfigurations />} />
            <Route path="/security" element={<SecurityLazy />} />
            
            {/* 🚀 BILLION-DOLLAR HYBRID ARCHITECTURE ROUTES */}
            <Route path="/mode-comparison" element={<ModeComparisonPage />} />
            <Route path="/hybrid-pricing" element={<HybridPricingPage />} />
            <Route path="/choose-your-architecture" element={<ModeComparisonPage />} />
            <Route path="/architecture-pricing" element={<HybridPricingPage />} />
            
            {/* UNIFIED PRICING SYSTEM - All pricing routes redirect to main /pricing */}
            <Route path="/pricing" element={<UnifiedPricingPage />} />
            <Route path="/pricing-v2" element={<UnifiedPricingPage />} />
            <Route path="/unified-pricing" element={<UnifiedPricingPage />} />
            
            {/* Checkout Route */}
            <Route path="/checkout" element={<CheckoutPage />} />
            
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
                  <DashboardLazy />
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
                  <BillingPageLazy />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AnalyticsDashboardLazy />
                </ProtectedRoute>
              } 
            />
            {/* Add specific routes for shared dashboards and individual dashboard pages */}
            <Route 
              path="/analytics/dashboard/:dashboardId" 
              element={
                <ProtectedRoute>
                  <AnalyticsDashboardLazy />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics/shared" 
              element={
                <ProtectedRoute>
                  <AnalyticsDashboardLazy />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics/preferences" 
              element={
                <ProtectedRoute>
                  <AnalyticsDashboardLazy />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advanced-analytics" 
              element={
                <ProtectedRoute>
                  <AdvancedAnalyticsPageLazy />
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
            <Route path="/image-comparison" element={<ImageComparisonPageLazy />} />
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
            <Route path="/content-management" element={<ProtectedRoute><ContentManagementLazy /></ProtectedRoute>} />
            
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
            <Route path="/support" element={<SupportLazy />} />
            <Route path="/docs" element={<DocumentationIndexLazy />} />
            <Route path="/faq" element={<FAQLazy />} />
            <Route path="/terms" element={<TermsLazy />} />
            <Route path="/privacy" element={<PrivacyPolicyLazy />} />
            
            {/* New Header Navigation Pages */}
            <Route path="/privacy-mode" element={<PrivacyModeLazy />} />
            <Route path="/use-cases" element={<UseCases />} />
            
            {/* Documentation Routes */}
            <Route path="/docs/getting-started" element={<GettingStartedLazy />} />
            <Route path="/docs/privacy-guide" element={<PrivacyGuideLazy />} />
            <Route path="/docs/metadata-guide" element={<MetadataGuideLazy />} />
            <Route path="/docs/api" element={<ApiReferenceLazy />} />
            <Route path="/docs/index" element={<DocumentationIndexLazy />} />
            <Route path="/docs/architecture" element={<ArchitectureLazy />} />
            <Route path="/docs/testing" element={<TestingGuideLazy />} />
            <Route path="/docs/deployment" element={<DeploymentGuideLazy />} />
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
            
            {/* New Comprehensive Documentation Routes */}
            <Route path="/docs/ai-document-intelligence-guide" element={<AIDocumentIntelligenceGuide />} />
            <Route path="/docs/smart-document-assistant-guide" element={<SmartDocumentAssistantGuide />} />
            <Route path="/docs/comprehensive-api-guide" element={<ComprehensiveAPIGuide />} />
            <Route path="/docs/security-compliance-guide" element={<SecurityComplianceGuide />} />
            <Route path="/docs/enterprise-integrations-guide" element={<EnterpriseIntegrationsGuide />} />
            
            {/* Documentation Routes for Markdown Files */}
            <Route path="/docs/blog-content-management" element={<BlogContentManagementGuide />} />
            <Route path="/docs/workflow-template-implementation" element={<RedirectComponent url="/docs/WORKFLOW_TEMPLATE_IMPLEMENTATION_GUIDE.md" title="Workflow Template Implementation Guide" />} />
            <Route path="/docs/marketplace-integration" element={<RedirectComponent url="/docs/MARKETPLACE_INTEGRATION_USER_GUIDE.md" title="Marketplace Integration User Guide" />} />
            <Route path="/docs/enterprise-demo-features" element={<RedirectComponent url="/docs/ENTERPRISE_DEMO_FEATURES_GUIDE.md" title="Enterprise Demo Features Guide" />} />
            
            {/* Legacy Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyLazy />} />
            <Route path="/faq-legacy" element={<FAQLazy />} />
            <Route path="/terms-legacy" element={<TermsLazy />} />
            <Route path="/support-legacy" element={<SupportLazy />} />
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
            <Route path="/solutions/realestate" element={<RealEstateSolution />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/new" element={<ProtectedRoute><BlogEditorLazy /></ProtectedRoute>} />
            <Route path="/blog/edit/:id" element={<ProtectedRoute><BlogEditorLazy /></ProtectedRoute>} />
            
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
            <Route path="/features" element={<FeaturesLazy />} />
            
            {/* New routes for Performance Optimization and AI/ML Platform */}
            {/* Route path="/performance-optimization" element={<PerformanceOptimizationDashboard />} /> */}
            {/* Route path="/ai-ml-platform" element={<AIMLPlatformDashboard />} /> */}
            
            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<MarketplaceDashboard />} />
            <Route path="/marketplace/apis" element={<APIMarketplace />} />
            <Route path="/marketplace/plugins" element={<MarketplaceDashboard />} />
            <Route path="/marketplace/workflows" element={<MarketplaceDashboard />} />
            
            {/* Hybrid Architecture Demo for Sales */}
            <Route path="/hybrid-architecture-demo" element={<HybridArchitectureDemo />} />
            
            {/* Trust Verification Route */}
            <Route path="/trust-verification" element={<TrustVerificationPage />} />
            
            {/* AI Features Positioning Route */}
            <Route path="/ai-features" element={<AIFeaturesPositioning />} />
            
            {/* AI Package Pages */}
            <Route path="/ai/legal-ai-package" element={<LegalAIPackage />} />
            <Route path="/ai/healthcare-ai-package" element={<HealthcareAIPackage />} />
            <Route path="/ai/financial-ai-package" element={<FinancialAIPackage />} />
            <Route path="/ai/insurance-ai-package" element={<InsuranceAIPackage />} />
            
            {/* Workflow Template Library */}
            <Route path="/workflow-templates" element={<WorkflowTemplateLibrary />} />
            <Route path="/templates" element={<WorkflowTemplateLibrary />} />
            <Route path="/ai/workflow-templates" element={<WorkflowTemplateLibrary />} />
            
            {/* Enterprise AI Features - ROI and Compliance */}
            <Route 
              path="/enterprise/roi-dashboard" 
              element={
                <ProtectedRoute>
                  <ROIMeasurementDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/enterprise/compliance-templates" 
              element={
                <ProtectedRoute>
                  <EnterpriseComplianceTemplates />
                </ProtectedRoute>
              } 
            />
            
            {/* Industry-Specific AI Package Routes */}
            <Route 
              path="/ai/packages/healthcare" 
              element={
                <ProtectedRoute>
                  <ROIMeasurementDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai/packages/finance" 
              element={
                <ProtectedRoute>
                  <ROIMeasurementDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai/packages/legal" 
              element={
                <ProtectedRoute>
                  <ROIMeasurementDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* New routes for Custom AI Training and Visual Workflow Builder */}
            <Route path="/enterprise/ai-training" element={<CustomAITrainingDashboard />} />
            <Route path="/enterprise/workflow-builder" element={<VisualWorkflowBuilder />} />
            
            {/* Enterprise Feature Showcase */}
            <Route path="/enterprise/feature-showcase" element={<EnterpriseFeatureShowcase />} />
            
            {/* New routes for UI Showcase */}
            <Route path="/ui-showcase" element={<UIShowcase />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
            </div>
      </Router>
      
      {/* Enhanced Toast System */}
      <ToastContainer />
      
      {/* Global AI Assistant - Available on all pages */}
      <SmartDocumentAssistant />
    </TestAuthProvider>
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
    title="This Page Took a Different Path"
    description="Let's get you back to analyzing photos securely."
    maxWidth="6xl"
    backgroundColor="dark"
  >
    <div className="text-center">
      <h1 className="text-6xl font-bold text-emerald-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-100 mb-6">
        This page seems to have gone off the grid
      </h2>
      <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
        Don't worry—your photos are still safe and private. Let's get you back to what matters: 
        analyzing images without any data breach risk.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <a href="https://upload.proofpixapp.com" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
           onClick={() => window.plausible && window.plausible('Nav CTA Click')}>
          Analyze Photos Risk-Free
        </a>
        <EnterpriseButton 
          variant="secondary" 
          onClick={() => window.location.href = '/pricing'}
        >
          View Plans & Pricing
        </EnterpriseButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Try ProofPix Free</h3>
          <p className="text-slate-400 text-sm">Upload a photo and see your metadata in seconds</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Learn More</h3>
          <p className="text-slate-400 text-sm">Discover why we're the category creator</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Get Support</h3>
          <p className="text-slate-400 text-sm">Our team is here to help you succeed</p>
        </div>
      </div>
    </div>
  </EnterpriseLayout>
);

export default App;
