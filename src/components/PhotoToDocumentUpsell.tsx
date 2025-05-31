import React from 'react';
import { motion } from 'framer-motion';

// Trojan Horse Strategy - Photo to Document Upsell

interface PhotoToDocumentUpsellProps {
  onRequestDemo?: () => void;
  onLearnMore?: () => void;
}

export const PhotoToDocumentUpsell: React.FC<PhotoToDocumentUpsellProps> = ({
  onRequestDemo,
  onLearnMore
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="mb-12 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upgrade to Document Intelligence
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Take your metadata extraction to the next level with our advanced Document
              Intelligence platform. Extract structured data from any document type with
              enterprise-grade accuracy and security.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Advanced OCR Technology
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Extract text from any document with 99.9% accuracy, including
                    handwritten notes and complex layouts.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Intelligent Form Processing
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Automatically identify form fields and extract structured data from
                    insurance claims, legal documents, and healthcare forms.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Same Client-Side Security
                  </h3>
                  <p className="mt-1 text-gray-600">
                    All document processing happens locally in the browser with zero data
                    transmission, maintaining the same privacy standards.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRequestDemo}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Request Enterprise Demo
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLearnMore}
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md border border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Learn More
              </motion.button>
            </div>
          </div>
          
          {/* Right Column - Image */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full opacity-70" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full opacity-70" />
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src="/images/document-intelligence-preview.jpg"
                  alt="Document Intelligence Platform"
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x600/f1f5f9/64748b?text=Document+Intelligence';
                  }}
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-white bg-opacity-90 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-500">Processing Speed</div>
                    <div className="text-sm font-medium text-blue-600">5x Faster</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-5/6" />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">99.8%</div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">100%</div>
                      <div className="text-xs text-gray-500">Privacy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">24/7</div>
                      <div className="text-xs text-gray-500">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Industry Testimonial */}
        <div className="mt-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0">
                <img
                  className="h-12 w-12 rounded-full"
                  src="/images/testimonial-avatar.jpg"
                  alt="Customer testimonial"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/48/f1f5f9/64748b?text=JD';
                  }}
                />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  James Davidson
                </h4>
                <p className="text-gray-600">
                  CTO, Westfield Insurance
                </p>
              </div>
            </div>
            <blockquote className="text-gray-700 italic">
              "ProofPix's Document Intelligence platform reduced our claims processing time
              by 73%. The ability to extract data without sending sensitive information to
              third-party servers has been a game-changer for our compliance team."
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};
