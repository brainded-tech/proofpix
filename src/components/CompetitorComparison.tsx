import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Competitor Comparison - CMO Sales Tool

interface Feature {
  id: string;
  name: string;
  description: string;
  proofPixAdvantage: string;
  category: 'security' | 'privacy' | 'performance' | 'compliance';
}

const features: Feature[] = [
  {
    id: 'client-side',
    name: '100% Client-Side Processing',
    description: 'All metadata extraction and processing happens locally in the browser',
    proofPixAdvantage: 'Zero data transmission risk, complete privacy preservation',
    category: 'privacy'
  },
  {
    id: 'hipaa',
    name: 'HIPAA Compliance',
    description: 'Fully compliant with healthcare data privacy requirements',
    proofPixAdvantage: 'No PHI ever leaves your system',
    category: 'compliance'
  },
  {
    id: 'audit',
    name: 'Audit Trail',
    description: 'Comprehensive logging of all metadata operations',
    proofPixAdvantage: 'Court-admissible chain of custody tracking',
    category: 'security'
  },
  {
    id: 'bulk',
    name: 'Enterprise Bulk Processing',
    description: 'Process thousands of images simultaneously',
    proofPixAdvantage: 'Superior performance with local processing',
    category: 'performance'
  },
  {
    id: 'encryption',
    name: 'End-to-End Encryption',
    description: 'Military-grade encryption for all operations',
    proofPixAdvantage: 'No server-side decryption needed',
    category: 'security'
  },
  {
    id: 'compliance',
    name: 'Regulatory Compliance',
    description: 'Meets GDPR, CCPA, and other privacy regulations',
    proofPixAdvantage: 'Simplified compliance with no data storage',
    category: 'compliance'
  },
  {
    id: 'integration',
    name: 'Enterprise Integration',
    description: 'Seamless integration with existing workflows',
    proofPixAdvantage: 'API-first architecture with complete documentation',
    category: 'performance'
  },
  {
    id: 'data-sovereignty',
    name: 'Data Sovereignty',
    description: 'Complete control over data location and processing',
    proofPixAdvantage: 'Data never leaves your jurisdiction',
    category: 'privacy'
  }
];

interface ComparisonRow {
  feature: string;
  proofPix: string;
  competitors: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Data Processing Location',
    proofPix: '100% Client-Side',
    competitors: 'Server-Side Processing'
  },
  {
    feature: 'Privacy Risk',
    proofPix: 'Zero Data Transmission',
    competitors: 'Data Must Leave System'
  },
  {
    feature: 'Processing Speed',
    proofPix: 'Instant Local Processing',
    competitors: 'Network-Dependent'
  },
  {
    feature: 'Compliance Overhead',
    proofPix: 'Minimal (No Data Storage)',
    competitors: 'Complex Data Handling'
  },
  {
    feature: 'Cost Structure',
    proofPix: 'Predictable Pricing',
    competitors: 'Usage-Based Billing'
  }
];

export const CompetitorComparison: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFeatures = selectedCategory
    ? features.filter(f => f.category === selectedCategory)
    : features;

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The ProofPix Enterprise Advantage
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how our unique client-side approach delivers superior security,
            privacy, and performance for enterprise organizations.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['security', 'privacy', 'performance', 'compliance'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(
                selectedCategory === category ? null : category
              )}
              className={`
                px-6 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <AnimatePresence>
            {filteredFeatures.map((feature) => (
              <motion.div
                key={feature.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-medium">
                    {feature.proofPixAdvantage}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Direct Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-6 py-3 text-left text-gray-500 font-medium">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-left text-blue-600 font-medium">
                    ProofPix Enterprise
                  </th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium">
                    Traditional Solutions
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {row.proofPix}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {row.competitors}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
