import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Users, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  FileImage, 
  BarChart3,
  Lock,
  Crown,
  Star,
  Layers,
  GitCompareArrows
} from 'lucide-react';
import { UnifiedHeader } from '../components/ui/UnifiedHeader';
import { UnifiedFooter } from '../components/ui/UnifiedFooter';

const PremiumToolsPage: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<'batch' | 'comparison' | null>(null);
  const navigate = useNavigate();

  const tools = [
    {
      id: 'batch',
      name: 'Batch Processing',
      icon: Layers,
      description: 'Process hundreds of images simultaneously with enterprise-grade efficiency',
      features: [
        'Upload up to 500 images at once',
        'Parallel processing for maximum speed',
        'Individual image analysis and editing',
        'Bulk export to enhanced PDFs',
        'Advanced filtering and sorting',
        'Progress tracking and error handling',
        'Custom naming and organization',
        'Metadata comparison across batches'
      ],
      benefits: [
        'Save 15+ hours per week on repetitive tasks',
        'Process entire case folders in minutes',
        'Maintain individual image control',
        'Generate comprehensive batch reports',
        'Ensure consistency across large datasets'
      ],
      pricing: {
        credits: 2,
        description: '2 credits per image processed'
      },
      useCases: [
        'Legal case evidence processing',
        'Insurance claim batch analysis',
        'Real estate listing verification',
        'Medical imaging workflows',
        'Forensic investigation batches'
      ]
    },
    {
      id: 'comparison',
      name: 'Image Comparison',
      icon: GitCompareArrows,
      description: 'Advanced side-by-side analysis with AI-powered difference detection',
      features: [
        'Side-by-side visual comparison',
        'AI-powered difference highlighting',
        'Metadata variance analysis',
        'Timestamp and location comparison',
        'Quality degradation detection',
        'Authenticity verification',
        'Detailed comparison reports',
        'Export comparison findings'
      ],
      benefits: [
        'Detect image manipulation instantly',
        'Verify document authenticity',
        'Identify quality degradation',
        'Compare evidence versions',
        'Generate court-ready comparison reports'
      ],
      pricing: {
        credits: 3,
        description: '3 credits per comparison analysis'
      },
      useCases: [
        'Evidence authenticity verification',
        'Insurance fraud detection',
        'Document version comparison',
        'Quality assurance workflows',
        'Forensic image analysis'
      ]
    }
  ];

  const handleToolAccess = (toolId: string) => {
    // Check if user has sufficient credits/subscription
    const userPlan = localStorage.getItem('proofpix_user_plan') || 'free';
    
    if (userPlan === 'free') {
      // Redirect to pricing with tool-specific messaging
      navigate(`/pricing?tool=${toolId}&source=premium_tools`);
      return;
    }

    // Navigate to the actual tool
    if (toolId === 'batch') {
      navigate('/batch-processing');
    } else if (toolId === 'comparison') {
      navigate('/image-comparison');
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <UnifiedHeader />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center space-x-2 bg-purple-500/10 px-6 py-3 rounded-full mb-8 border border-purple-500/20"
            >
              <Crown className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-medium">PREMIUM TOOLS</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-8"
            >
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Professional-Grade
              </span>
              <br />
              <span className="text-white">Image Intelligence</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-4xl mx-auto mb-8"
            >
              Unlock the full power of ProofPix with our premium tools. 
              <span className="text-emerald-400 font-semibold"> Process hundreds of images in minutes</span> and 
              <span className="text-blue-400 font-semibold"> detect the smallest differences</span> with AI precision.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400"
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Zero Data Exposure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>15x Faster Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-purple-400" />
                <span>Enterprise Grade</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  variants={fadeInUp}
                  className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                    selectedTool === tool.id
                      ? 'border-purple-500 ring-4 ring-purple-500/20 scale-105'
                      : 'border-slate-600/30 hover:border-purple-400'
                  }`}
                  onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id as 'batch' | 'comparison')}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-7 h-7 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{tool.name}</h3>
                          <p className="text-slate-400">{tool.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">{tool.pricing.credits}</div>
                        <div className="text-xs text-slate-400">credits</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-white font-semibold mb-3">Key Features</h4>
                        <ul className="space-y-2">
                          {tool.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-sm text-slate-300">
                              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-3">Benefits</h4>
                        <ul className="space-y-2">
                          {tool.benefits.slice(0, 3).map((benefit, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-sm text-slate-300">
                              <Star className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        {tool.pricing.description}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToolAccess(tool.id);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                      >
                        <span>Access Tool</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {selectedTool === tool.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-slate-600/30"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-white font-semibold mb-3">All Features</h5>
                            <ul className="space-y-2">
                              {tool.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start space-x-2 text-sm text-slate-300">
                                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-white font-semibold mb-3">Use Cases</h5>
                            <ul className="space-y-2">
                              {tool.useCases.map((useCase, idx) => (
                                <li key={idx} className="flex items-start space-x-2 text-sm text-slate-300">
                                  <FileImage className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span>{useCase}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Pricing CTA */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-500/20 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Unlock Professional Tools?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Get access to Batch Processing and Image Comparison with any paid plan. 
              <span className="text-purple-400 font-semibold"> Start with a free trial</span> and see the difference professional tools make.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/pricing?source=premium_tools')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Crown className="w-5 h-5" />
                <span>View Pricing Plans</span>
              </button>
              
              <button
                onClick={() => navigate('/enterprise/demo?tools=premium')}
                className="px-8 py-4 border border-purple-500 text-purple-400 font-semibold rounded-xl hover:bg-purple-500/10 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Try Demo</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Why Professionals Choose Our Premium Tools
            </motion.h2>
            
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">15x Faster</h3>
                <p className="text-slate-400">Process entire case folders in minutes instead of hours</p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">99.9% Accuracy</h3>
                <p className="text-slate-400">AI-powered analysis with forensic-grade precision</p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Zero Risk</h3>
                <p className="text-slate-400">All processing happens locally - your data never leaves your device</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <UnifiedFooter />
    </div>
  );
};

export default PremiumToolsPage; 