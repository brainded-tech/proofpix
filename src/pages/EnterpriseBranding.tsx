import React from 'react';
import { EnterpriseBrandingManager } from '../components/enterprise/EnterpriseBrandingManager';
import { EnhancedFooter } from '../components/EnhancedFooter';

const EnterpriseBranding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="enterprise-header py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="enterprise-badge mb-6">
            Enterprise Branding
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Brand Asset Management & Validation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive enterprise-grade branding system with automated validation, 
            compliance checking, and asset management for consistent brand identity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-enterprise btn-lg">
              Start Managing Assets
            </button>
            <button className="btn btn-secondary btn-lg">
              View Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise Branding Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools to maintain brand consistency and compliance across your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Asset Validation',
                description: 'Automated validation of logos, colors, fonts, and templates against enterprise standards',
                icon: '✓',
                color: 'bg-green-50 text-green-600'
              },
              {
                title: 'Compliance Checking',
                description: 'WCAG, SOC2, and enterprise compliance validation with detailed reporting',
                icon: '🛡️',
                color: 'bg-blue-50 text-blue-600'
              },
              {
                title: 'Brand Consistency',
                description: 'Ensure color harmony, typography standards, and visual consistency',
                icon: '🎨',
                color: 'bg-purple-50 text-purple-600'
              },
              {
                title: 'Real-time Feedback',
                description: 'Instant validation results with actionable suggestions and fixes',
                icon: '⚡',
                color: 'bg-yellow-50 text-yellow-600'
              },
              {
                title: 'Asset Management',
                description: 'Centralized repository for all brand assets with version control',
                icon: '📁',
                color: 'bg-indigo-50 text-indigo-600'
              },
              {
                title: 'Export & Reporting',
                description: 'Comprehensive reports and asset exports for stakeholders',
                icon: '📊',
                color: 'bg-red-50 text-red-600'
              }
            ].map((feature, index) => (
              <div key={index} className="card p-6">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Branding Manager */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <EnterpriseBrandingManager />
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with enterprise-grade standards and modern web technologies
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Validation Standards</h3>
              <div className="space-y-4">
                {[
                  { standard: 'WCAG 2.1 AA', description: 'Web Content Accessibility Guidelines compliance' },
                  { standard: 'SOC2 Type II', description: 'Security and availability controls' },
                  { standard: 'GDPR', description: 'Data protection and privacy compliance' },
                  { standard: 'Enterprise Brand', description: 'Custom brand guideline validation' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900">{item.standard}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Supported Formats</h3>
              <div className="space-y-4">
                {[
                  { category: 'Logos', formats: 'SVG, PNG, JPEG (up to 5MB)' },
                  { category: 'Colors', formats: 'HEX, RGB, HSL with contrast validation' },
                  { category: 'Fonts', formats: 'WOFF, WOFF2, TTF with license checking' },
                  { category: 'Templates', formats: 'HTML, CSS with responsive validation' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900">{item.category}</div>
                      <div className="text-sm text-gray-600">{item.formats}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Streamline Your Brand Management?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get started with enterprise branding validation and ensure consistent brand identity across your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-enterprise btn-lg">
              Start Free Trial
            </button>
            <button className="btn btn-secondary btn-lg">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      <EnhancedFooter />
    </div>
  );
};

export default EnterpriseBranding; 