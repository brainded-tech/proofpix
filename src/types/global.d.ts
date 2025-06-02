// Global type definitions for ProofPix

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        time_remaining?: number;
        [key: string]: any;
      }
    ) => void;
  }
}

// User interface for authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'enterprise';
  subscriptionTier?: 'free' | 'professional' | 'enterprise';
  createdAt: Date;
  lastLogin?: Date;
}

export {}; 