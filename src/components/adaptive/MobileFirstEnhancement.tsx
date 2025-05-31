import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdaptiveUI } from './AdaptiveUIProvider';
import { X, Maximize2, Minimize2, ChevronUp, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface MobileOptimizationProps {
  /**
   * Content that should be optimized for mobile
   */
  children: React.ReactNode;
  
  /**
   * Whether to apply compact layout on mobile
   */
  compactMode?: boolean;
  
  /**
   * Specify which sidebar elements to collapse in mobile view
   */
  collapsibleSidebars?: 'left' | 'right' | 'both' | 'none';
  
  /**
   * Whether to enable swipe gestures for navigation
   */
  enableSwipeGestures?: boolean;
  
  /**
   * Whether to enable adaptive font sizing
   */
  adaptiveFontSize?: boolean;
  
  /**
   * Threshold for mobile layout (in pixels)
   */
  mobileThreshold?: number;
}

export const MobileFirstEnhancement: React.FC<MobileOptimizationProps> = ({
  children,
  compactMode = true,
  collapsibleSidebars = 'both',
  enableSwipeGestures = true,
  adaptiveFontSize = true,
  mobileThreshold = 768
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < mobileThreshold);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(isMobile);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(isMobile);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const { userContext } = useAdaptiveUI();
  
  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < mobileThreshold;
      setIsMobile(newIsMobile);
      
      // Auto-collapse sidebars on mobile
      if (newIsMobile) {
        if (collapsibleSidebars === 'left' || collapsibleSidebars === 'both') {
          setIsLeftSidebarCollapsed(true);
        }
        if (collapsibleSidebars === 'right' || collapsibleSidebars === 'both') {
          setIsRightSidebarCollapsed(true);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileThreshold, collapsibleSidebars]);
  
  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipeGestures || !isMobile) return;
    
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipeGestures || !isMobile || startX === null) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Limit swipe distance
    if (Math.abs(diff) < 100) {
      setSwipeDistance(diff);
    }
  };
  
  const handleTouchEnd = () => {
    if (!enableSwipeGestures || !isMobile || startX === null) return;
    
    // If swipe distance is significant, toggle appropriate sidebar
    if (swipeDistance > 50) {
      setIsLeftSidebarCollapsed(false);
    } else if (swipeDistance < -50) {
      setIsRightSidebarCollapsed(false);
    }
    
    // Reset swipe state
    setSwipeDistance(0);
    setStartX(null);
  };
  
  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch(err => console.error(`Error attempting to enable fullscreen: ${err.message}`));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullScreen(false))
          .catch(err => console.error(`Error attempting to exit fullscreen: ${err.message}`));
      }
    }
  };
  
  // Update document with mobile optimizations
  useEffect(() => {
    if (isMobile) {
      // Set viewport meta tag for proper mobile rendering
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.setAttribute('name', 'viewport');
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      
      // Apply adaptive font sizing if enabled
      if (adaptiveFontSize) {
        document.documentElement.style.fontSize = '14px';
      }
      
      // Apply compact mode styles if enabled
      if (compactMode) {
        document.body.classList.add('mobile-compact-mode');
      }
    } else {
      // Reset mobile optimizations when not in mobile mode
      if (adaptiveFontSize) {
        document.documentElement.style.fontSize = '';
      }
      
      if (compactMode) {
        document.body.classList.remove('mobile-compact-mode');
      }
    }
    
    return () => {
      // Clean up mobile optimizations
      if (compactMode) {
        document.body.classList.remove('mobile-compact-mode');
      }
    };
  }, [isMobile, adaptiveFontSize, compactMode]);
  
  // Apply mobile-specific class to the wrapper
  const mobileWrapperClasses = `
    mobile-first-enhancement
    ${isMobile ? 'is-mobile' : ''}
    ${compactMode && isMobile ? 'compact-mode' : ''}
    ${isLeftSidebarCollapsed ? 'left-sidebar-collapsed' : ''}
    ${isRightSidebarCollapsed ? 'right-sidebar-collapsed' : ''}
  `;
  
  return (
    <div 
      className={mobileWrapperClasses}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Controls */}
      {isMobile && (
        <div className="mobile-controls fixed bottom-16 right-4 z-50 flex flex-col space-y-2">
          {/* Sidebar Toggle Buttons */}
          {(collapsibleSidebars === 'left' || collapsibleSidebars === 'both') && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              {isLeftSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </motion.button>
          )}
          
          {/* Fullscreen Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullScreen}
            className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg"
          >
            {isFullScreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </motion.button>
          
          {/* Quick Scroll to Top */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        </div>
      )}
      
      {/* Swipe Indicator */}
      <AnimatePresence>
        {swipeDistance !== 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="swipe-indicator fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
          >
            <div className={`
              w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center
              ${swipeDistance > 0 ? 'translate-x-' + Math.abs(swipeDistance / 4) : '-translate-x-' + Math.abs(swipeDistance / 4)}
            `}>
              {swipeDistance > 0 ? (
                <PanelLeftOpen className="w-8 h-8 text-white" />
              ) : (
                <PanelLeftClose className="w-8 h-8 text-white" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      {children}
    </div>
  );
};

// Helper hook for responsive development
export const useMobileDetection = (threshold = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < threshold);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < threshold);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [threshold]);
  
  return { isMobile };
}; 