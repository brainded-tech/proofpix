import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Briefcase, 
  Building2, 
  Shield, 
  ArrowRight,
  X
} from 'lucide-react';

export interface UserIntent {
  id: 'quick_analysis' | 'professional_work' | 'enterprise_evaluation' | 'privacy_focused';
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  flow: string;
  features_revealed: string[];
  gradient: string;
  iconColor: string;
}

interface IntentDetectionModalProps {
  isOpen: boolean;
  onIntentSelect: (intent: UserIntent) => void;
  onClose: () => void;
}

const USER_INTENTS: UserIntent[] = [
  {
    id: 'quick_analysis',
    icon: Zap,
    title: 'Analyze Images Risk-Free',
    description: 'Process images instantly without any data leaving your device - see why 500+ teams chose unhackable',
    flow: 'simplified_workflow',
    features_revealed: ['basic_upload', 'key_metadata', 'simple_export'],
    gradient: 'from-blue-500 to-cyan-500',
    iconColor: 'text-blue-500'
  },
  {
    id: 'professional_work',
    icon: Briefcase,
    title: 'Professional Evidence Analysis',
    description: 'Create court-admissible reports and process evidence with unbreakable chain of custody',
    flow: 'professional_workflow',
    features_revealed: ['batch_processing', 'pdf_reports', 'advanced_metadata'],
    gradient: 'from-purple-500 to-pink-500',
    iconColor: 'text-purple-500'
  },
  {
    id: 'enterprise_evaluation',
    icon: Building2,
    title: 'Eliminate Enterprise Data Risk',
    description: 'See how 500+ organizations eliminated $4.45M breach risk while improving workflows',
    flow: 'enterprise_demo_workflow',
    features_revealed: ['enterprise_demo', 'security_architecture', 'compliance_info'],
    gradient: 'from-emerald-500 to-teal-500',
    iconColor: 'text-emerald-500'
  },
  {
    id: 'privacy_focused',
    icon: Shield,
    title: 'Unhackable by Design',
    description: 'Experience the only platform where data breaches are technically impossible',
    flow: 'privacy_emphasis_workflow',
    features_revealed: ['security_explanation', 'compliance_overview', 'local_processing_demo'],
    gradient: 'from-orange-500 to-red-500',
    iconColor: 'text-orange-500'
  }
];

export const IntentDetectionModal: React.FC<IntentDetectionModalProps> = ({
  isOpen,
  onIntentSelect,
  onClose
}) => {
  const [selectedIntent, setSelectedIntent] = useState<UserIntent | null>(null);
  const [hoveredIntent, setHoveredIntent] = useState<string | null>(null);

  const handleIntentClick = (intent: UserIntent) => {
    setSelectedIntent(intent);
    // Add slight delay for visual feedback
    setTimeout(() => {
      onIntentSelect(intent);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 pb-12">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                
                <h1 className="text-3xl font-bold mb-3">
                  Welcome to ProofPix
                </h1>
                <p className="text-xl text-slate-300 mb-2">
                  What brings you here today?
                </p>
                <p className="text-sm text-slate-400">
                  Choose your path to get a personalized experience
                </p>
              </div>
            </div>

            {/* Intent Cards */}
            <div className="p-8 -mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {USER_INTENTS.map((intent, index) => {
                  const IconComponent = intent.icon;
                  const isSelected = selectedIntent?.id === intent.id;
                  const isHovered = hoveredIntent === intent.id;
                  
                  return (
                    <motion.div
                      key={intent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="relative"
                    >
                      <motion.button
                        onClick={() => handleIntentClick(intent)}
                        onHoverStart={() => setHoveredIntent(intent.id)}
                        onHoverEnd={() => setHoveredIntent(null)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          w-full p-6 rounded-xl border-2 text-left transition-all duration-300
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : isHovered
                            ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                          }
                          hover:shadow-lg dark:hover:shadow-slate-900/20
                        `}
                      >
                        {/* Icon with gradient background */}
                        <div className={`
                          w-12 h-12 rounded-lg bg-gradient-to-r ${intent.gradient} 
                          flex items-center justify-center mb-4
                        `}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          {intent.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          {intent.description}
                        </p>

                        {/* Features preview */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {intent.features_revealed.slice(0, 2).map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full"
                            >
                              {feature.replace('_', ' ')}
                            </span>
                          ))}
                          {intent.features_revealed.length > 2 && (
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full">
                              +{intent.features_revealed.length - 2} more
                            </span>
                          )}
                        </div>

                        {/* Arrow indicator */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Get Started
                          </span>
                          <motion.div
                            animate={{ x: isHovered ? 4 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className={`w-4 h-4 ${intent.iconColor}`} />
                          </motion.div>
                        </div>

                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          </motion.div>
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Privacy assurance */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    100% Private - All processing happens on your device
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntentDetectionModal; 