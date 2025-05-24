// constants/ui.js - UI-related constants
export const UI_CONSTANTS = {
  // Animation durations (ms)
  animations: {
    toast: 300,
    modal: 250,
    spinner: 1000,
    progressBar: 150,
    tooltip: 200
  },
  
  // Breakpoints (px)
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },
  
  // Toast settings
  toasts: {
    duration: 5000,
    maxVisible: 3,
    position: 'top-right'
  },
  
  // Loading states
  loading: {
    spinnerSize: {
      small: 20,
      medium: 32,
      large: 48
    },
    messages: {
      uploading: 'Uploading image...',
      processing: 'Processing image...',
      extracting: 'Extracting EXIF data...',
      generating: 'Generating preview...',
      downloading: 'Preparing download...'
    }
  },
  
  // Error display
  errors: {
    retryDelay: 2000,
    maxRetries: 3,
    criticalErrorTimeout: 10000
  }
};