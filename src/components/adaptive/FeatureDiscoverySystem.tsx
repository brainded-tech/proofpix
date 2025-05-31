import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Zap, 
  Lightbulb, 
  ArrowRight,
  Star,
  Unlock,
  ChevronRight,
  Medal,
  Shield
} from 'lucide-react';
import { useAdaptiveUI } from './AdaptiveUIProvider';
import { analytics } from '../../utils/analytics';

// Types for contextual hints
export interface ContextualHintConfig {
  id: string;
  trigger: string;
  message: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'below_upload_area' | 'in_results_panel' | 'top_banner';
  demo?: string;
  cta?: string;
  ctaAction?: string;
  ctaLink?: string;
  dismissible?: boolean;
  analyticsEvent?: string;
  upgradeRequired?: string;
  priority?: 'low' | 'medium' | 'high';
  requiredFeatures?: string[];
  showAfterUse?: number;
}

// Types for achievements
export interface Achievement {
  id: string;
  condition: string;
  unlock: string[];
  celebration: string;
  icon?: React.ReactNode;
  description?: string;
  completed?: boolean;
}

// Context for feature discovery system
interface FeatureDiscoveryContextType {
  showHint: (hintId: string) => void;
  dismissHint: (hintId: string) => void;
  trackAchievementProgress: (condition: string, value?: number) => void;
  currentHints: ContextualHintConfig[];
  recentAchievements: Achievement[];
  clearRecentAchievements: () => void;
}

const FeatureDiscoveryContext = createContext<FeatureDiscoveryContextType | null>(null);

// Predefined hints configuration
const CONTEXTUAL_HINTS: ContextualHintConfig[] = [
  {
    id: 'batch_processing_hint',
    trigger: 'after_3_single_uploads',
    placement: 'below_upload_area',
    message: '💡 Save time - process multiple images at once',
    demo: 'animated_batch_upload_preview',
    cta: 'Try Batch Processing',
    ctaAction: 'navigate_to_batch',
    dismissible: true,
    analyticsEvent: 'batch_processing_hint_shown',
    priority: 'medium'
  },
  {
    id: 'pdf_report_hint',
    trigger: 'after_metadata_export_3_times',
    placement: 'in_results_panel',
    message: '📊 Create professional PDF reports with this data',
    demo: 'pdf_template_preview',
    cta: 'Generate PDF Report',
    ctaAction: 'show_pdf_options',
    upgradeRequired: 'pro_tier',
    priority: 'medium'
  },
  {
    id: 'enterprise_features_hint',
    trigger: 'business_email_domain || frequent_usage_pattern',
    placement: 'top_banner',
    message: '🏢 Teams love ProofPix - see enterprise features',
    demo: 'enterprise_demo_preview',
    cta: 'Explore Enterprise Features',
    ctaLink: '/enterprise',
    analyticsEvent: 'enterprise_hint_conversion',
    priority: 'high'
  },
  {
    id: 'security_features_hint',
    trigger: 'after_first_upload',
    placement: 'top',
    message: '🔒 Your images never leave your device - learn how our security works',
    cta: 'See Security Details',
    ctaLink: '/security',
    dismissible: true,
    priority: 'medium',
    requiredFeatures: ['security_explanation']
  },
  {
    id: 'custom_template_hint',
    trigger: 'after_pdf_export',
    placement: 'right',
    message: '✨ Create custom branded templates for your reports',
    cta: 'Customize Templates',
    ctaAction: 'show_template_editor',
    upgradeRequired: 'pro_tier',
    priority: 'low',
    showAfterUse: 2
  }
];

// Predefined achievements
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_upload',
    condition: 'successful_single_upload',
    unlock: ['metadata_exploration_guide', 'export_options_tutorial'],
    celebration: 'First image processed! 🎉',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    description: 'Successfully processed your first image'
  },
  {
    id: 'power_user',
    condition: 'processed_10_images',
    unlock: ['batch_processing_access', 'advanced_templates'],
    celebration: 'You\'re a power user! Unlock batch processing 🚀',
    icon: <Star className="w-5 h-5 text-purple-400" />,
    description: 'Processed 10 images'
  },
  {
    id: 'professional',
    condition: 'used_batch_processing_5_times',
    unlock: ['pro_tier_preview', 'custom_branding_demo'],
    celebration: 'Ready for professional features? 💼',
    icon: <Medal className="w-5 h-5 text-blue-400" />,
    description: 'Used batch processing 5 times'
  },
  {
    id: 'privacy_advocate',
    condition: 'verified_privacy_settings',
    unlock: ['advanced_privacy_controls', 'security_audit_tools'],
    celebration: 'Privacy advocate badge earned! 🔒',
    icon: <Shield className="w-5 h-5 text-green-400" />,
    description: 'Verified privacy settings'
  }
];

interface FeatureDiscoveryProviderProps {
  children: React.ReactNode;
}

export const FeatureDiscoveryProvider: React.FC<FeatureDiscoveryProviderProps> = ({ 
  children 
}) => {
  const [activeHints, setActiveHints] = useState<ContextualHintConfig[]>([]);
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set());
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const { userContext, revealFeatures, shouldShowFeature } = useAdaptiveUI();
  
  // Load dismissed hints from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('proofpix_dismissed_hints');
      if (saved) {
        setDismissedHints(new Set(JSON.parse(saved)));
      }
      
      // Load achievement progress
      const savedAchievements = localStorage.getItem('proofpix_achievements');
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }
    } catch (error) {
      console.warn('Failed to load feature discovery data:', error);
    }
  }, []);
  
  // Save dismissed hints when updated
  useEffect(() => {
    if (dismissedHints.size > 0) {
      localStorage.setItem('proofpix_dismissed_hints', JSON.stringify(Array.from(dismissedHints)));
    }
  }, [dismissedHints]);
  
  // Save achievements when updated
  useEffect(() => {
    localStorage.setItem('proofpix_achievements', JSON.stringify(achievements));
  }, [achievements]);
  
  // Check trigger conditions and show appropriate hints
  const evaluateTriggers = () => {
    // Filter out dismissed hints and check conditions
    const eligibleHints = CONTEXTUAL_HINTS.filter(hint => {
      // Skip if already dismissed
      if (dismissedHints.has(hint.id)) return false;
      
      // Check if features are required and available
      if (hint.requiredFeatures && !hint.requiredFeatures.every(feature => shouldShowFeature(feature))) {
        return false;
      }
      
      // Only show a limited number of hints at once
      if (activeHints.length >= 2 && hint.priority !== 'high') {
        return false;
      }
      
      // Basic trigger evaluation - would be expanded with more complex logic
      switch (hint.trigger) {
        case 'after_3_single_uploads':
          return userContext.usage.featuresUsed.filter(f => f === 'single_upload').length >= 3;
        
        case 'after_metadata_export_3_times':
          return userContext.usage.featuresUsed.filter(f => f === 'metadata_export').length >= 3;
        
        case 'business_email_domain || frequent_usage_pattern':
          // Check for business email domain
          const email = localStorage.getItem('user_email') || '';
          const isBusinessEmail = email && !email.endsWith('.com') && !email.endsWith('.net') && 
            !email.endsWith('.org') && !email.endsWith('.edu') && !email.endsWith('.io');
          
          // Or check for frequent usage
          const isFrequentUser = userContext.usage.sessionCount >= 5;
          
          return isBusinessEmail || isFrequentUser;
        
        case 'after_first_upload':
          return userContext.usage.featuresUsed.includes('single_upload');
          
        case 'after_pdf_export':
          return userContext.usage.featuresUsed.includes('pdf_export');
          
        default:
          return false;
      }
    });
    
    // Don't add duplicates
    const newHints = eligibleHints.filter(hint => 
      !activeHints.some(activeHint => activeHint.id === hint.id)
    );
    
    if (newHints.length > 0) {
      setActiveHints(current => [...current, ...newHints]);
      
      // Track analytics for new hints
      newHints.forEach(hint => {
        if (hint.analyticsEvent) {
          analytics.track({
            event: hint.analyticsEvent,
            category: 'feature_discovery',
            label: hint.id,
            properties: {
              hint_id: hint.id,
              message: hint.message,
              placement: hint.placement
            }
          });
        }
      });
    }
  };
  
  // Check for achievements and unlock features
  const checkAchievements = () => {
    const updatedAchievements = [...achievements];
    const newlyCompleted: Achievement[] = [];
    
    updatedAchievements.forEach(achievement => {
      if (achievement.completed) return;
      
      // Check if achievement condition is met
      let isCompleted = false;
      
      switch (achievement.condition) {
        case 'successful_single_upload':
          isCompleted = userContext.usage.featuresUsed.includes('single_upload');
          break;
          
        case 'processed_10_images':
          isCompleted = 
            (parseInt(localStorage.getItem('processed_image_count') || '0') >= 10);
          break;
          
        case 'used_batch_processing_5_times':
          isCompleted = 
            userContext.usage.featuresUsed.filter(f => f === 'batch_processing').length >= 5;
          break;
          
        case 'verified_privacy_settings':
          isCompleted = userContext.usage.featuresUsed.includes('privacy_settings_viewed');
          break;
          
        default:
          break;
      }
      
      if (isCompleted) {
        achievement.completed = true;
        newlyCompleted.push(achievement);
        
        // Unlock features
        if (achievement.unlock.length > 0) {
          revealFeatures(achievement.unlock);
        }
        
        // Track analytics
        analytics.track({
          event: 'achievement_unlocked',
          category: 'feature_discovery',
          label: achievement.id,
          properties: {
            achievement_id: achievement.id,
            unlocked_features: achievement.unlock
          }
        });
      }
    });
    
    if (newlyCompleted.length > 0) {
      setAchievements(updatedAchievements);
      setRecentAchievements(current => [...current, ...newlyCompleted]);
    }
  };
  
  // Run evaluations when usage data changes
  useEffect(() => {
    evaluateTriggers();
    checkAchievements();
  }, [userContext.usage]);
  
  // Show a specific hint programmatically
  const showHint = (hintId: string) => {
    const hint = CONTEXTUAL_HINTS.find(h => h.id === hintId);
    if (!hint || dismissedHints.has(hintId)) return;
    
    setActiveHints(current => {
      if (current.some(h => h.id === hintId)) return current;
      return [...current, hint];
    });
  };
  
  // Dismiss a hint
  const dismissHint = (hintId: string) => {
    setActiveHints(current => current.filter(hint => hint.id !== hintId));
    setDismissedHints(current => {
      const updated = new Set(current);
      updated.add(hintId);
      return updated;
    });
    
    // Track analytics
    analytics.track({
      event: 'hint_dismissed',
      category: 'feature_discovery',
      label: hintId
    });
  };
  
  // Track progress toward achievements
  const trackAchievementProgress = (condition: string, value: number = 1) => {
    // Update counters in localStorage
    if (condition === 'processed_images') {
      const current = parseInt(localStorage.getItem('processed_image_count') || '0');
      localStorage.setItem('processed_image_count', (current + value).toString());
    }
    
    // Add to features used
    if (!userContext.usage.featuresUsed.includes(condition)) {
      userContext.usage.featuresUsed.push(condition);
    }
    
    // Re-evaluate achievements
    checkAchievements();
  };
  
  // Clear recent achievements
  const clearRecentAchievements = () => {
    setRecentAchievements([]);
  };
  
  const contextValue: FeatureDiscoveryContextType = {
    showHint,
    dismissHint,
    trackAchievementProgress,
    currentHints: activeHints,
    recentAchievements,
    clearRecentAchievements
  };
  
  return (
    <FeatureDiscoveryContext.Provider value={contextValue}>
      {children}
      
      {/* Render active hints */}
      <AnimatePresence>
        {activeHints.map(hint => (
          <ContextualHint
            key={hint.id}
            hint={hint}
            onAction={() => {
              // Handle CTA action
              if (hint.ctaAction) {
                // This would typically dispatch an action or navigate
                console.log(`Would execute action: ${hint.ctaAction}`);
              }
              
              if (hint.ctaLink) {
                window.location.href = hint.ctaLink;
              }
              
              // Track analytics
              analytics.track({
                event: 'hint_cta_clicked',
                category: 'feature_discovery',
                label: hint.id,
                properties: {
                  hint_id: hint.id,
                  cta: hint.cta,
                  action: hint.ctaAction || hint.ctaLink
                }
              });
              
              // Auto-dismiss after action
              dismissHint(hint.id);
            }}
            onDismiss={() => dismissHint(hint.id)}
          />
        ))}
      </AnimatePresence>
      
      {/* Render achievement notifications */}
      <AnimatePresence>
        {recentAchievements.map(achievement => (
          <AchievementNotification
            key={achievement.id}
            achievement={achievement}
            onDismiss={() => {
              setRecentAchievements(current => 
                current.filter(a => a.id !== achievement.id)
              );
            }}
          />
        ))}
      </AnimatePresence>
    </FeatureDiscoveryContext.Provider>
  );
};

// Contextual Hint Component
const ContextualHint: React.FC<{
  hint: ContextualHintConfig;
  onAction: () => void;
  onDismiss: () => void;
}> = ({ hint, onAction, onDismiss }) => {
  // Position the hint based on placement
  const getHintStyles = () => {
    switch(hint.placement) {
      case 'top_banner':
        return 'fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'below_upload_area':
        return 'relative mt-4 w-full';
      case 'in_results_panel':
        return 'absolute bottom-4 right-4 max-w-xs';
      default:
        return 'fixed bottom-4 right-4 max-w-xs z-50';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${getHintStyles()} bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/40 dark:to-purple-900/40 border border-blue-200 dark:border-blue-700 rounded-lg shadow-lg overflow-hidden`}
    >
      <div className="flex items-start p-4">
        <div className="flex-1">
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-2 font-medium">{hint.message}</p>
          
          {hint.demo && (
            <div className="mb-3 bg-white dark:bg-slate-800 rounded-md p-2 border border-slate-200 dark:border-slate-700">
              {/* This would render a demo component based on the hint.demo value */}
              <div className="h-20 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
                <Lightbulb className="w-4 h-4 mr-2" />
                Feature preview would appear here
              </div>
            </div>
          )}
          
          <div className="flex space-x-2 mt-2">
            {hint.cta && (
              <button
                onClick={onAction}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
              >
                {hint.cta}
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            )}
            
            {hint.dismissible && (
              <button
                onClick={onDismiss}
                className="text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded text-sm hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Maybe Later
              </button>
            )}
          </div>
        </div>
        
        {hint.dismissible && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {hint.upgradeRequired && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-4 py-2 text-xs text-purple-800 dark:text-purple-300 flex items-center">
          <Star className="w-3 h-3 mr-1 text-purple-500" />
          <span>Requires {hint.upgradeRequired} upgrade</span>
        </div>
      )}
    </motion.div>
  );
};

// Achievement Notification Component
const AchievementNotification: React.FC<{
  achievement: Achievement;
  onDismiss: () => void;
}> = ({ achievement, onDismiss }) => {
  // Auto-dismiss after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 300 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 300 }}
      className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/40 border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-lg p-4 max-w-xs z-50"
    >
      <div className="flex items-start">
        <div className="p-2 bg-yellow-500/20 rounded-full mr-3">
          {achievement.icon || <Medal className="w-5 h-5 text-yellow-500" />}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">
            Achievement Unlocked!
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
            {achievement.celebration}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500">
            {achievement.description}
          </p>
          
          {achievement.unlock.length > 0 && (
            <div className="mt-2 text-xs flex items-center text-emerald-700 dark:text-emerald-400">
              <Unlock className="w-3 h-3 mr-1" />
              <span>
                {achievement.unlock.length} new {achievement.unlock.length === 1 ? 'feature' : 'features'} unlocked
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 p-1"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// Hook for using the feature discovery system
export const useFeatureDiscovery = () => {
  const context = useContext(FeatureDiscoveryContext);
  if (!context) {
    throw new Error('useFeatureDiscovery must be used within a FeatureDiscoveryProvider');
  }
  return context;
}; 