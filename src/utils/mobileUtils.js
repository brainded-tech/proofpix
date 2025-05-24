// Create utils/mobileUtils.js - Mobile detection and utilities
export const mobileUtils = {
  // Detect if device is mobile
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  // Detect if device is iOS
  isIOS: () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },
  
  // Detect if device is Android
  isAndroid: () => {
    return /Android/i.test(navigator.userAgent);
  },
  
  // Get viewport dimensions
  getViewport: () => ({
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  }),
  
  // Check if in standalone mode (PWA)
  isStandalone: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
  },
  
  // Prevent zoom on input focus (iOS)
  preventZoom: () => {
    if (mobileUtils.isIOS()) {
      document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      });
    }
  },
  
  // Add viewport meta tag for better mobile experience
  setViewport: () => {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  }
};