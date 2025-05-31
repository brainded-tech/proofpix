import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  X, 
  Menu,
  Search,
  Filter,
  Share,
  Download,
  Heart,
  Star,
  ArrowUp,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

interface MobileEnhancementsProps {
  children: React.ReactNode;
  showFloatingActions?: boolean;
  showScrollToTop?: boolean;
  enableSwipeGestures?: boolean;
}

interface FloatingAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  action: () => void;
  color?: string;
  badge?: number;
}

export const MobileEnhancements: React.FC<MobileEnhancementsProps> = ({
  children,
  showFloatingActions = true,
  showScrollToTop = true,
  enableSwipeGestures = true
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect device type
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  // Handle scroll for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating action buttons configuration
  const floatingActions: FloatingAction[] = [
    {
      id: 'search',
      icon: <Search className="w-5 h-5" />,
      label: 'Search',
      action: () => console.log('Search'),
      color: 'blue'
    },
    {
      id: 'filter',
      icon: <Filter className="w-5 h-5" />,
      label: 'Filter',
      action: () => console.log('Filter'),
      color: 'purple'
    },
    {
      id: 'share',
      icon: <Share className="w-5 h-5" />,
      label: 'Share',
      action: () => console.log('Share'),
      color: 'green'
    },
    {
      id: 'download',
      icon: <Download className="w-5 h-5" />,
      label: 'Download',
      action: () => console.log('Download'),
      color: 'orange'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSwipe = (event: any, info: PanInfo) => {
    if (!enableSwipeGestures) return;

    const { offset, velocity } = info;
    const swipeThreshold = 50;
    const velocityThreshold = 500;

    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
      if (offset.x > 0) {
        setSwipeDirection('right');
        // Handle swipe right action
        console.log('Swiped right');
      } else {
        setSwipeDirection('left');
        // Handle swipe left action
        console.log('Swiped left');
      }

      // Reset swipe direction after animation
      setTimeout(() => setSwipeDirection(null), 300);
    }
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Main content with swipe gestures */}
      <motion.div
        drag={enableSwipeGestures && deviceType !== 'desktop' ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleSwipe}
        className={`${swipeDirection ? 'pointer-events-none' : ''}`}
      >
        {children}
      </motion.div>

      {/* Swipe feedback indicators */}
      <AnimatePresence>
        {swipeDirection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed top-1/2 ${swipeDirection === 'left' ? 'right-8' : 'left-8'} transform -translate-y-1/2 z-50`}
          >
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-full p-4 shadow-xl">
              <ChevronUp className={`w-6 h-6 text-blue-400 transform ${swipeDirection === 'left' ? 'rotate-90' : '-rotate-90'}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Device type indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50 bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            {getDeviceIcon()}
            <span className="capitalize">{deviceType}</span>
          </div>
        </div>
      )}

      {/* Floating Action Button (Mobile/Tablet only) */}
      {showFloatingActions && deviceType !== 'desktop' && (
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {fabOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-16 right-0 space-y-3"
              >
                {floatingActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      action.action();
                      setFabOpen(false);
                    }}
                    className={`
                      flex items-center space-x-3 bg-${action.color}-600 hover:bg-${action.color}-700 
                      text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl 
                      transition-all duration-200 transform hover:scale-105
                      min-w-max
                    `}
                  >
                    {action.icon}
                    <span className="text-sm font-medium">{action.label}</span>
                    {action.badge && (
                      <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setFabOpen(!fabOpen)}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: fabOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {fabOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </motion.button>
        </div>
      )}

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className={`
              fixed z-50 w-12 h-12 bg-slate-800/90 backdrop-blur-xl border border-slate-700 
              text-slate-300 hover:text-white rounded-full shadow-lg hover:shadow-xl 
              transition-all duration-200 flex items-center justify-center
              ${showFloatingActions && deviceType !== 'desktop' ? 'bottom-24 right-6' : 'bottom-6 right-6'}
            `}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile-specific touch feedback overlay */}
      {deviceType === 'mobile' && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Touch ripple effects could be added here */}
        </div>
      )}

      {/* Pull-to-refresh indicator (placeholder) */}
      {deviceType === 'mobile' && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 transform -translate-y-full transition-transform duration-300 z-50" />
      )}
    </div>
  );
};

// Hook for mobile-specific interactions
export const useMobileInteractions = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setOrientation(height > width ? 'portrait' : 'landscape');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  const preventZoom = (event: TouchEvent) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (isMobile) {
      document.addEventListener('touchstart', preventZoom, { passive: false });
      return () => document.removeEventListener('touchstart', preventZoom);
    }
  }, [isMobile]);

  return {
    isMobile,
    isTablet,
    orientation,
    hapticFeedback,
    isTouch: 'ontouchstart' in window
  };
};

// Mobile-optimized card component
export const MobileCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
  swipeable?: boolean;
}> = ({ children, className = '', onTap, swipeable = false }) => {
  const { hapticFeedback } = useMobileInteractions();

  const handleTap = () => {
    hapticFeedback('light');
    onTap?.();
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      drag={swipeable ? 'x' : false}
      dragConstraints={{ left: -100, right: 100 }}
      dragElastic={0.2}
      onClick={handleTap}
      className={`
        pp-card cursor-pointer select-none
        ${onTap ? 'active:bg-slate-50 dark:active:bg-slate-800' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// Mobile-optimized input component
export const MobileInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'search';
  className?: string;
}> = ({ placeholder, value, onChange, type = 'text', className = '' }) => {
  const { isMobile } = useMobileInteractions();

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`
        pp-input
        ${isMobile ? 'text-base' : ''} // Prevent zoom on iOS
        ${className}
      `}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
    />
  );
};

export default MobileEnhancements; 