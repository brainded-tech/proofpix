// 2. Create utils/environment.js
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // Browser detection
  browser: {
    isChrome: typeof navigator !== 'undefined' && /Chrome/.test(navigator.userAgent),
    isFirefox: typeof navigator !== 'undefined' && /Firefox/.test(navigator.userAgent),
    isSafari: typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
    isEdge: typeof navigator !== 'undefined' && /Edge/.test(navigator.userAgent),
    isMobile: typeof navigator !== 'undefined' && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)
  },
  
  // Feature detection
  supports: {
    webp: () => {
      if (typeof document === 'undefined') return false;
      try {
        return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
      } catch {
        return false;
      }
    },
    fileApi: () => !!(typeof window !== 'undefined' && window.File && window.FileReader && window.FileList && window.Blob),
    dragDrop: () => typeof document !== 'undefined' && 'draggable' in document.createElement('span'),
    clipboard: () => typeof navigator !== 'undefined' && !!navigator.clipboard,
    serviceWorker: () => typeof navigator !== 'undefined' && 'serviceWorker' in navigator
  }
};