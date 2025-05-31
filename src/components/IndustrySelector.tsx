// Industry Selection Component - CMO Personalization Directive
import React from 'react';
import { motion } from 'framer-motion';

interface Industry {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
}

interface IndustrySelectorProps {
  selectedIndustry: string | null;
  onSelectIndustry: (industryId: string) => void;
}

const industries: Industry[] = [
  {
    id: 'legal',
    name: 'Legal',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    description: 'Secure metadata extraction for legal documentation and evidence handling',
    features: [
      'Chain of custody tracking',
      'Court-admissible metadata reports',
      'Bulk processing for case files'
    ]
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    description: 'Streamline claims processing with automated image verification',
    features: [
      'Timestamp verification',
      'Location data extraction',
      'Fraud detection support'
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    description: 'HIPAA-compliant image metadata management for healthcare providers',
    features: [
      'PHI protection',
      'Audit trail generation',
      'Secure sharing protocols'
    ]
  },
  {
    id: 'government',
    name: 'Government',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
    description: 'Secure metadata handling for government agencies and contractors',
    features: [
      'FedRAMP compliance',
      'Data sovereignty',
      'Access control management'
    ]
  }
];

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  selectedIndustry,
  onSelectIndustry
}) => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Industry
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We understand that different industries have unique requirements.
            Select your industry to see how ProofPix can help your organization.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <motion.div
              key={industry.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectIndustry(industry.id)}
              className={`
                cursor-pointer rounded-xl p-6 transition-shadow hover:shadow-lg
                ${
                  selectedIndustry === industry.id
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-white border border-gray-200'
                }
              `}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`
                    p-3 rounded-full mb-4
                    ${
                      selectedIndustry === industry.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {industry.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {industry.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {industry.description}
                </p>
                <ul className="space-y-2 text-left w-full">
                  {industry.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
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
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
