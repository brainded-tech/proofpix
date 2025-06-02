import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Image, 
  Building2, 
  Shield, 
  Zap, 
  Eye,
  ChevronRight,
  Star,
  Clock,
  Users,
  BarChart3,
  ArrowRight
} from 'lucide-react';

interface DemoOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  category: 'document' | 'image' | 'enterprise';
  featured?: boolean;
  duration: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  highlights: string[];
}

interface DemoSelectorProps {
  onSelect: (demoId: string) => void;
  selectedDemo?: string;
  className?: string;
}

const demoOptions: DemoOption[] = [
  {
    id: 'document-analysis',
    title: 'Document Analysis',
    description: 'AI-powered document processing and text extraction with real-time insights',
    icon: <FileText className="w-5 h-5" />,
    category: 'document',
    featured: true,
    duration: '5 min',
    complexity: 'Beginner',
    highlights: ['OCR Processing', 'Text Extraction', 'Metadata Analysis']
  },
  {
    id: 'image-verification',
    title: 'Image Verification',
    description: 'Advanced image authenticity and fraud detection using AI algorithms',
    icon: <Image className="w-5 h-5" />,
    category: 'image',
    featured: true,
    duration: '7 min',
    complexity: 'Intermediate',
    highlights: ['Fraud Detection', 'Authenticity Check', 'Quality Assessment']
  },
  {
    id: 'enterprise-suite',
    title: 'Enterprise Suite',
    description: 'Complete enterprise document intelligence platform with team management',
    icon: <Building2 className="w-5 h-5" />,
    category: 'enterprise',
    featured: true,
    duration: '15 min',
    complexity: 'Advanced',
    highlights: ['Team Dashboard', 'API Management', 'Compliance Tools']
  },
  {
    id: 'compliance-check',
    title: 'Compliance Analysis',
    description: 'Automated regulatory compliance verification for GDPR, HIPAA, and SOX',
    icon: <Shield className="w-5 h-5" />,
    category: 'document',
    duration: '8 min',
    complexity: 'Intermediate',
    highlights: ['GDPR Compliance', 'HIPAA Validation', 'Audit Trails']
  },
  {
    id: 'batch-processing',
    title: 'Batch Processing',
    description: 'High-volume document processing capabilities for enterprise workflows',
    icon: <Zap className="w-5 h-5" />,
    category: 'enterprise',
    duration: '10 min',
    complexity: 'Advanced',
    highlights: ['Bulk Upload', 'Queue Management', 'Progress Tracking']
  },
  {
    id: 'real-time-analysis',
    title: 'Real-time Analysis',
    description: 'Live document processing and instant results with streaming analytics',
    icon: <Eye className="w-5 h-5" />,
    category: 'document',
    duration: '6 min',
    complexity: 'Intermediate',
    highlights: ['Live Processing', 'Instant Results', 'Stream Analytics']
  }
];

export const DemoSelector: React.FC<DemoSelectorProps> = ({
  onSelect,
  selectedDemo,
  className = ''
}) => {
  const [hoveredDemo, setHoveredDemo] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'document': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'image': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'enterprise': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'text-green-600 bg-green-50';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'Advanced': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const filteredDemos = filterCategory === 'all' 
    ? demoOptions 
    : demoOptions.filter(demo => demo.category === filterCategory);

  const categories = [
    { id: 'all', label: 'All Demos', count: demoOptions.length },
    { id: 'document', label: 'Document', count: demoOptions.filter(d => d.category === 'document').length },
    { id: 'image', label: 'Image', count: demoOptions.filter(d => d.category === 'image').length },
    { id: 'enterprise', label: 'Enterprise', count: demoOptions.filter(d => d.category === 'enterprise').length }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Choose Your Demo Experience
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Explore ProofPix's powerful AI document intelligence capabilities through interactive demonstrations
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 rounded-lg p-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilterCategory(category.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                filterCategory === category.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {category.label}
              <span className="ml-1 text-xs opacity-60">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDemos.map((demo) => (
          <motion.div
            key={demo.id}
            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedDemo === demo.id
                ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredDemo(demo.id)}
            onHoverEnd={() => setHoveredDemo(null)}
            onClick={() => onSelect(demo.id)}
          >
            {demo.featured && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${getCategoryColor(demo.category)}`}>
                {demo.icon}
              </div>
              
              <motion.div
                animate={{
                  x: hoveredDemo === demo.id ? 4 : 0,
                  opacity: hoveredDemo === demo.id ? 1 : 0.5
                }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </motion.div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {demo.title}
            </h3>
            
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {demo.description}
            </p>

            {/* Highlights */}
            <div className="space-y-1 mb-4">
              {demo.highlights.slice(0, 2).map((highlight, index) => (
                <div key={index} className="flex items-center text-xs text-slate-500">
                  <div className="w-1 h-1 bg-slate-400 rounded-full mr-2" />
                  {highlight}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getCategoryColor(demo.category)}`}>
                  {demo.category.charAt(0).toUpperCase() + demo.category.slice(1)}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getComplexityColor(demo.complexity)}`}>
                  {demo.complexity}
                </span>
              </div>
              
              <div className="flex items-center text-xs text-slate-500">
                <Clock className="w-3 h-3 mr-1" />
                {demo.duration}
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedDemo === demo.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Start Demo Button */}
      {selectedDemo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={() => onSelect(selectedDemo)}
            className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Demo
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-sm text-slate-500 mt-2">
            Experience {filteredDemos.find(d => d.id === selectedDemo)?.title} in action
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DemoSelector; 