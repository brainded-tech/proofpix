import { useEffect, useState, useCallback } from 'react';

interface UseExitIntentOptions {
  enabled?: boolean;
  threshold?: number;
  delay?: number;
  onExitIntent?: () => void;
}

export const useExitIntent = ({
  enabled = true,
  threshold = 50,
  delay = 1000,
  onExitIntent
}: UseExitIntentOptions = {}) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (!enabled || hasTriggered) return;

    // Check if mouse is leaving from the top of the viewport
    if (e.clientY <= threshold && e.relatedTarget === null) {
      setHasTriggered(true);
      onExitIntent?.();
    }
  }, [enabled, hasTriggered, threshold, onExitIntent]);

  const handleMouseEnter = useCallback(() => {
    if (!enabled) return;
    setIsActive(true);
  }, [enabled]);

  const reset = useCallback(() => {
    setHasTriggered(false);
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let timeoutId: NodeJS.Timeout;

    const delayedActivation = () => {
      timeoutId = setTimeout(() => {
        setIsActive(true);
      }, delay);
    };

    // Add event listeners
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Activate after delay
    delayedActivation();

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [enabled, delay, handleMouseEnter, handleMouseLeave]);

  return {
    hasTriggered,
    isActive,
    reset
  };
}; 