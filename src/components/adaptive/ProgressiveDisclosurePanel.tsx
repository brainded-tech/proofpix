import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Settings, 
  Zap, 
  Star,
  Lock,
  Unlock,
  Info,
  ArrowRight
} from 'lucide-react';
import { useAdaptiveUI, useUIComplexity, useFeatureFlag } from './AdaptiveUIProvider';

interface DisclosureSection {
  id: string;
  title: string;
  description?: string;
  level: 'beginner' | 'intermediate' | 'expert';
  category: 'basic' | 'advanced' | 'enterprise' | 'experimental';
  requiredFeatures?: string[];
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ComponentType<any>;
  badge?: string;
  comingSoon?: boolean;
  premium?: boolean;
}

interface ProgressiveDisclosurePanelProps {
  sections: DisclosureSection[];
  title?: string;
  description?: string;
  className?: string;
  allowMultipleExpanded?: boolean;
  showLevelIndicators?: boolean;
  compactMode?: boolean;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'basic': return Zap;
    case 'advanced': return Settings;
    case 'enterprise': return Star;
    case 'experimental': return Eye;
    default: return Info;
  }
};

export const ProgressiveDisclosurePanel: React.FC<ProgressiveDisclosurePanelProps> = ({
  sections,
  title,
  description,
  className = '',
  allowMultipleExpanded = false,
  showLevelIndicators = true,
  compactMode = false
}) => {
  const { userContext, shouldShowFeature, markFeatureUsed } = useAdaptiveUI();
  const { complexity, isSimple, showTooltips } = useUIComplexity();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());

  // Initialize expanded sections based on user level and defaults
  useEffect(() => {
    const initialExpanded = new Set<string>();
    
    sections.forEach(section => {
      // Auto-expand based on user level and section level
      const shouldAutoExpand = 
        section.defaultExpanded ||
        (section.level === 'beginner' && userContext.experienceLevel === 'beginner') ||
        (section.level === userContext.experienceLevel && userContext.usage.sessionCount <= 2);

      if (shouldAutoExpand && shouldShowSection(section)) {
        initialExpanded.add(section.id);
      }
    });

    setExpandedSections(initialExpanded);
  }, [sections, userContext.experienceLevel, userContext.usage.sessionCount]);

  const shouldShowSection = (section: DisclosureSection): boolean => {
    // Check if section is manually hidden
    if (hiddenSections.has(section.id)) {
      return false;
    }

    // Check required features
    if (section.requiredFeatures) {
      const hasRequiredFeatures = section.requiredFeatures.every(feature => 
        shouldShowFeature(feature)
      );
      if (!hasRequiredFeatures) {
        return false;
      }
    }

    // Check user level compatibility
    const userLevel = userContext.experienceLevel;
    
    // Always show beginner sections
    if (section.level === 'beginner') {
      return true;
    }

    // Show intermediate sections for intermediate+ users
    if (section.level === 'intermediate' && userLevel !== 'beginner') {
      return true;
    }

    // Show expert sections only for expert users or when explicitly enabled
    if (section.level === 'expert') {
      return userLevel === 'expert' || userContext.preferences.showAdvancedFeatures;
    }

    return true;
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev);
      
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId);
      } else {
        // If not allowing multiple expanded, close others
        if (!allowMultipleExpanded) {
          newExpanded.clear();
        }
        newExpanded.add(sectionId);
        markFeatureUsed(`disclosure_${sectionId}`);
      }
      
      return newExpanded;
    });
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setHiddenSections(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(sectionId)) {
        newHidden.delete(sectionId);
      } else {
        newHidden.add(sectionId);
        // Also collapse if hiding
        setExpandedSections(prevExpanded => {
          const newExpanded = new Set(prevExpanded);
          newExpanded.delete(sectionId);
          return newExpanded;
        });
      }
      return newHidden;
    });
  };

  const visibleSections = sections.filter(shouldShowSection);

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Panel Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-2">
        {visibleSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const IconComponent = section.icon || getCategoryIcon(section.category);
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`
                  w-full flex items-center justify-between p-4 text-left transition-colors
                  ${isExpanded 
                    ? 'bg-slate-50 dark:bg-slate-800' 
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }
                  ${compactMode ? 'p-3' : 'p-4'}
                `}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* Icon */}
                  <div className={`
                    p-2 rounded-lg
                    ${section.category === 'basic' ? 'bg-green-100 dark:bg-green-900/30' : ''}
                    ${section.category === 'advanced' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
                    ${section.category === 'enterprise' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}
                    ${section.category === 'experimental' ? 'bg-orange-100 dark:bg-orange-900/30' : ''}
                  `}>
                    <IconComponent className={`
                      w-4 h-4
                      ${section.category === 'basic' ? 'text-green-600 dark:text-green-400' : ''}
                      ${section.category === 'advanced' ? 'text-blue-600 dark:text-blue-400' : ''}
                      ${section.category === 'enterprise' ? 'text-purple-600 dark:text-purple-400' : ''}
                      ${section.category === 'experimental' ? 'text-orange-600 dark:text-orange-400' : ''}
                    `} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {section.title}
                      </h4>
                      
                      {/* Badges */}
                      <div className="flex items-center space-x-1">
                        {showLevelIndicators && (
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getLevelColor(section.level)}`}>
                            {section.level}
                          </span>
                        )}
                        
                        {section.badge && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                            {section.badge}
                          </span>
                        )}
                        
                        {section.premium && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full">
                            Pro
                          </span>
                        )}
                        
                        {section.comingSoon && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full">
                            Soon
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {section.description && !compactMode && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {section.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2 ml-3">
                  {/* Visibility toggle for advanced users */}
                  {userContext.experienceLevel === 'expert' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSectionVisibility(section.id);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      title="Hide this section"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                  )}

                  {/* Expand/collapse indicator */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </div>
              </button>

              {/* Section Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      {section.comingSoon ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Settings className="w-6 h-6 text-slate-400" />
                          </div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                            Coming Soon
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            This feature is currently in development and will be available soon.
                          </p>
                        </div>
                      ) : section.premium && !userContext.intent?.id.includes('enterprise') ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                            Premium Feature
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Upgrade to access this advanced functionality.
                          </p>
                          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors">
                            <span>Upgrade Now</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        section.children
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Hidden sections indicator for expert users */}
      {userContext.experienceLevel === 'expert' && hiddenSections.size > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <EyeOff className="w-4 h-4" />
              <span>{hiddenSections.size} section{hiddenSections.size !== 1 ? 's' : ''} hidden</span>
            </div>
            <button
              onClick={() => setHiddenSections(new Set())}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Show All
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressiveDisclosurePanel; 