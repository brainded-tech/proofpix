import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  X, 
  ArrowRight, 
  Lightbulb, 
  Zap, 
  Shield, 
  Star,
  ChevronRight,
  Play
} from 'lucide-react';
import { useAdaptiveUI, useUIComplexity } from './AdaptiveUIProvider';

interface TooltipContent {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'expert';
  category: 'feature' | 'workflow' | 'security' | 'tip';
  actions?: {
    label: string;
    action: () => void;
    primary?: boolean;
  }[];
  nextSteps?: string[];
  relatedFeatures?: string[];
  videoUrl?: string;
  keyboardShortcut?: string;
}

interface SmartTooltipProps {
  id: string;
  children: React.ReactNode;
  content: TooltipContent;
  trigger?: 'hover' | 'click' | 'focus';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  showOnlyOnce?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface TooltipState {
  isVisible: boolean;
  position: { x: number; y: number };
  placement: string;
}

const TOOLTIP_REGISTRY = new Map<string, TooltipContent>();

// Smart tooltip content based on user context
const getContextualContent = (
  baseContent: TooltipContent,
  userLevel: 'beginner' | 'intermediate' | 'expert',
  userIntent: string | null
): TooltipContent => {
  const contextualContent = { ...baseContent };

  // Adjust content complexity based on user level
  if (userLevel === 'beginner') {
    contextualContent.description = baseContent.description;
    contextualContent.nextSteps = baseContent.nextSteps?.slice(0, 2); // Limit steps for beginners
  } else if (userLevel === 'expert') {
    // Add advanced tips for experts
    if (baseContent.keyboardShortcut) {
      contextualContent.description += ` (Shortcut: ${baseContent.keyboardShortcut})`;
    }
  }

  // Add intent-specific guidance
  if (userIntent === 'enterprise_evaluation' && baseContent.category === 'security') {
    contextualContent.description += ' This feature meets enterprise security requirements.';
  }

  return contextualContent;
};

export const SmartTooltip: React.FC<SmartTooltipProps> = ({
  id,
  children,
  content,
  trigger = 'hover',
  placement = 'top',
  delay = 500,
  disabled = false,
  showOnlyOnce = false,
  priority = 'medium'
}) => {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    isVisible: false,
    position: { x: 0, y: 0 },
    placement: placement
  });
  
  const { userContext, markFeatureUsed } = useAdaptiveUI();
  const { showTooltips, complexity } = useUIComplexity();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [hasBeenShown, setHasBeenShown] = useState(false);

  // Register tooltip content
  useEffect(() => {
    TOOLTIP_REGISTRY.set(id, content);
    return () => {
      TOOLTIP_REGISTRY.delete(id);
    };
  }, [id, content]);

  // Check if tooltip should be shown
  const shouldShow = !disabled && 
    showTooltips && 
    (!showOnlyOnce || !hasBeenShown) &&
    (content.level === 'beginner' || userContext.experienceLevel !== 'beginner' || complexity !== 'simple');

  const contextualContent = getContextualContent(
    content,
    userContext.experienceLevel,
    userContext.intent?.id || null
  );

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipElement = tooltipRef.current;
    
    if (!tooltipElement) return;

    const tooltipRect = tooltipElement.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let x = 0;
    let y = 0;
    let finalPlacement = placement;

    // Calculate position based on placement
    switch (placement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        
        // Check if tooltip would be cut off at top
        if (y < 0) {
          finalPlacement = 'bottom';
          y = triggerRect.bottom + 8;
        }
        break;
        
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + 8;
        
        // Check if tooltip would be cut off at bottom
        if (y + tooltipRect.height > viewport.height) {
          finalPlacement = 'top';
          y = triggerRect.top - tooltipRect.height - 8;
        }
        break;
        
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        
        // Check if tooltip would be cut off at left
        if (x < 0) {
          finalPlacement = 'right';
          x = triggerRect.right + 8;
        }
        break;
        
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        
        // Check if tooltip would be cut off at right
        if (x + tooltipRect.width > viewport.width) {
          finalPlacement = 'left';
          x = triggerRect.left - tooltipRect.width - 8;
        }
        break;
    }

    // Ensure tooltip stays within viewport bounds
    x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8));

    setTooltipState(prev => ({
      ...prev,
      position: { x, y },
      placement: finalPlacement
    }));
  };

  const showTooltip = () => {
    if (!shouldShow) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setTooltipState(prev => ({ ...prev, isVisible: true }));
      setHasBeenShown(true);
      markFeatureUsed(`tooltip_${id}`);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTooltipState(prev => ({ ...prev, isVisible: false }));
  };

  const handleTriggerEvent = (event: React.MouseEvent | React.FocusEvent) => {
    event.preventDefault();
    
    if (trigger === 'click') {
      if (tooltipState.isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (tooltipState.isVisible) {
      calculatePosition();
    }
  }, [tooltipState.isVisible]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (tooltipState.isVisible) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tooltipState.isVisible]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feature': return <Star className="w-4 h-4" />;
      case 'workflow': return <ArrowRight className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'tip': return <Lightbulb className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'workflow': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'security': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'tip': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-900/30';
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
        onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
        onFocus={trigger === 'focus' ? showTooltip : undefined}
        onBlur={trigger === 'focus' ? hideTooltip : undefined}
        onClick={trigger === 'click' ? handleTriggerEvent : undefined}
      >
        {children}
      </div>

      <AnimatePresence>
        {tooltipState.isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 max-w-sm"
            style={{
              left: tooltipState.position.x,
              top: tooltipState.position.y
            }}
          >
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${getCategoryColor(contextualContent.category)}`}>
                    {getCategoryIcon(contextualContent.category)}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {contextualContent.title}
                  </h3>
                </div>
                
                {trigger === 'click' && (
                  <button
                    onClick={hideTooltip}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {contextualContent.description}
                </p>

                {/* Video preview */}
                {contextualContent.videoUrl && (
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                      <Play className="w-4 h-4" />
                      <span>Watch tutorial</span>
                    </div>
                  </div>
                )}

                {/* Next steps */}
                {contextualContent.nextSteps && contextualContent.nextSteps.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Next Steps
                    </h4>
                    <ul className="space-y-1">
                      {contextualContent.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <ChevronRight className="w-3 h-3" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related features */}
                {contextualContent.relatedFeatures && contextualContent.relatedFeatures.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Related Features
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {contextualContent.relatedFeatures.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {contextualContent.actions && contextualContent.actions.length > 0 && (
                  <div className="flex space-x-2 pt-2">
                    {contextualContent.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          action.action();
                          hideTooltip();
                        }}
                        className={`
                          px-3 py-1.5 text-sm rounded-md transition-colors
                          ${action.primary
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }
                        `}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div
                className={`
                  absolute w-2 h-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transform rotate-45
                  ${tooltipState.placement === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2' : ''}
                  ${tooltipState.placement === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' : ''}
                  ${tooltipState.placement === 'left' ? '-right-1 top-1/2 -translate-y-1/2' : ''}
                  ${tooltipState.placement === 'right' ? '-left-1 top-1/2 -translate-y-1/2' : ''}
                `}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Tooltip manager for global tooltip control
export class TooltipManager {
  private static instance: TooltipManager;
  private activeTooltips = new Set<string>();
  private maxConcurrentTooltips = 3;

  static getInstance(): TooltipManager {
    if (!TooltipManager.instance) {
      TooltipManager.instance = new TooltipManager();
    }
    return TooltipManager.instance;
  }

  canShowTooltip(id: string, priority: 'low' | 'medium' | 'high'): boolean {
    if (this.activeTooltips.size < this.maxConcurrentTooltips) {
      return true;
    }

    // Allow high priority tooltips to override low priority ones
    if (priority === 'high') {
      return true;
    }

    return false;
  }

  registerActiveTooltip(id: string): void {
    this.activeTooltips.add(id);
  }

  unregisterActiveTooltip(id: string): void {
    this.activeTooltips.delete(id);
  }

  hideAllTooltips(): void {
    this.activeTooltips.clear();
  }
}

export default SmartTooltip; 