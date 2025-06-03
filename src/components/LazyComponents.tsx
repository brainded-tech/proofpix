import React from 'react';

// Lazy load major pages for code splitting
export const LandingPage = React.lazy(() => import('../pages/LandingPage').then(module => ({ default: module.LandingPage })));
export const Dashboard = React.lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
export const Enterprise = React.lazy(() => import('../pages/Enterprise').then(module => ({ default: module.Enterprise })));
export const EnterpriseDemo = React.lazy(() => import('../pages/EnterpriseDemo'));
export const Features = React.lazy(() => import('../pages/Features'));
export const Security = React.lazy(() => import('../pages/Security'));
export const ContactPage = React.lazy(() => import('../pages/ContactPage').then(module => ({ default: module.ContactPage })));

// Lazy load documentation
export const DocumentationIndex = React.lazy(() => import('../pages/docs/DocumentationIndex'));
export const GettingStarted = React.lazy(() => import('../pages/docs/GettingStarted'));
export const ApiReference = React.lazy(() => import('../pages/docs/ApiReference'));
export const MetadataGuide = React.lazy(() => import('../pages/docs/MetadataGuide'));
export const PrivacyGuide = React.lazy(() => import('../pages/docs/PrivacyGuide'));
export const TestingGuide = React.lazy(() => import('../pages/docs/TestingGuide'));
export const DeploymentGuide = React.lazy(() => import('../pages/docs/DeploymentGuide'));
export const Architecture = React.lazy(() => import('../pages/docs/Architecture'));

// Lazy load complex components
export const AnalyticsDashboard = React.lazy(() => import('../pages/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));
export const AdvancedAnalyticsPage = React.lazy(() => import('../pages/AdvancedAnalyticsPage').then(module => ({ default: module.AdvancedAnalyticsPage })));
export const BillingPage = React.lazy(() => import('../pages/BillingPage').then(module => ({ default: module.BillingPage })));
export const BatchProcessing = React.lazy(() => import('../pages/BatchProcessing'));
export const ImageComparison = React.lazy(() => import('../pages/ImageComparison'));
export const ImageComparisonPage = React.lazy(() => import('../pages/ImageComparisonPage').then(module => ({ default: module.ImageComparisonPage })));

// Lazy load marketplace components
export const EnterpriseMarketplaceDashboard = React.lazy(() => import('../components/marketplace/EnterpriseMarketplaceDashboard').then(module => ({ default: module.EnterpriseMarketplaceDashboard })));
export const MarketplaceDashboard = React.lazy(() => import('../components/marketplace/MarketplaceDashboard').then(module => ({ default: module.MarketplaceDashboard })));
export const APIMarketplace = React.lazy(() => import('../components/marketplace/APIMarketplace').then(module => ({ default: module.APIMarketplace })));
export const WorkflowBuilder = React.lazy(() => import('../components/marketplace/WorkflowBuilder').then(module => ({ default: module.WorkflowBuilder })));

// Lazy load solution pages
export const LegalSolution = React.lazy(() => import('../pages/solutions/LegalSolution'));
export const InsuranceSolution = React.lazy(() => import('../pages/solutions/InsuranceSolution'));
export const HealthcareSolution = React.lazy(() => import('../pages/solutions/HealthcareSolution'));
export const RealEstateSolution = React.lazy(() => import('../pages/solutions/RealEstateSolution'));

// Lazy load AI packages
export const LegalAIPackage = React.lazy(() => import('../pages/ai/LegalAIPackage'));
export const HealthcareAIPackage = React.lazy(() => import('../pages/ai/HealthcareAIPackage'));
export const FinancialAIPackage = React.lazy(() => import('../pages/ai/FinancialAIPackage'));
export const InsuranceAIPackage = React.lazy(() => import('../pages/ai/InsuranceAIPackage'));

// Lazy load pricing pages
export const HybridPricingPage = React.lazy(() => import('../pages/HybridPricingPage'));
export const ModeComparisonPage = React.lazy(() => import('../pages/ModeComparisonPage'));
export const AIEnhancedPricingPage = React.lazy(() => import('../pages/AIEnhancedPricingPage').then(module => ({ default: module.AIEnhancedPricingPage })));

// Lazy load basic components
export const FAQ = React.lazy(() => import('../components/FAQ'));
export const PrivacyPolicy = React.lazy(() => import('../components/PrivacyPolicy'));
export const Terms = React.lazy(() => import('../components/Terms'));
export const Support = React.lazy(() => import('../components/Support'));
export const AboutUs = React.lazy(() => import('../components/AboutUs'));

// Loading component for Suspense fallback
export const PageLoader = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
); 