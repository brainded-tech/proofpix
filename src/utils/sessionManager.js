// Session-based premium access management
import { PRICING_PLANS } from './stripe';

const SESSION_STORAGE_KEY = 'proofpix_session';
const USAGE_STORAGE_KEY = 'proofpix_session_usage';

export class SessionManager {
  static createSession(planId, duration) {
    const plan = PRICING_PLANS[planId];
    if (!plan || !plan.sessionBased) {
      throw new Error('Invalid session-based plan');
    }

    // Use plan's duration or fallback to provided duration
    const sessionDuration = plan.limits.duration || duration || '24h';

    const session = {
      planId,
      planName: plan.name,
      startTime: Date.now(),
      duration: this.parseDuration(sessionDuration),
      limits: plan.limits,
      features: plan.features
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    
    // Initialize usage tracking
    this.resetUsage();
    
    return session;
  }

  static parseDuration(duration) {
    if (typeof duration === 'number') return duration;
    
    const match = duration.match(/^(\d+)([hdm])$/);
    if (!match) return 24 * 60 * 60 * 1000; // Default 24 hours
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'm': return value * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  }

  static getActiveSession() {
    try {
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Check if session is expired
      if (this.isSessionExpired(session)) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  static isSessionExpired(session) {
    if (!session) return true;
    
    const now = Date.now();
    const expiryTime = session.startTime + session.duration;
    
    return now > expiryTime;
  }

  static clearSession() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(USAGE_STORAGE_KEY);
  }

  static getTimeRemaining() {
    const session = this.getActiveSession();
    if (!session) return 0;

    const now = Date.now();
    const expiryTime = session.startTime + session.duration;
    
    return Math.max(0, expiryTime - now);
  }

  static formatTimeRemaining() {
    const remaining = this.getTimeRemaining();
    if (remaining === 0) return null;

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  }

  static getSessionUsage() {
    try {
      const usageData = localStorage.getItem(USAGE_STORAGE_KEY);
      if (!usageData) {
        return {
          uploads: 0,
          batchProcesses: 0,
          exports: 0,
          pdfDownloads: 0,
          advancedExports: 0
        };
      }
      return JSON.parse(usageData);
    } catch (error) {
      console.error('Error getting session usage:', error);
      return {
        uploads: 0,
        batchProcesses: 0,
        exports: 0,
        pdfDownloads: 0,
        advancedExports: 0
      };
    }
  }

  static updateUsage(actionType) {
    const usage = this.getSessionUsage();
    
    switch (actionType) {
      case 'upload':
        usage.uploads++;
        break;
      case 'batch':
        usage.batchProcesses++;
        break;
      case 'export':
        usage.exports++;
        break;
      case 'pdf':
        usage.pdfDownloads++;
        break;
      case 'advanced_export':
        usage.advancedExports++;
        break;
      default:
        console.warn(`Unknown action type: ${actionType}`);
        break;
    }

    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
  }

  static resetUsage() {
    const initialUsage = {
      uploads: 0,
      batchProcesses: 0,
      exports: 0,
      pdfDownloads: 0,
      advancedExports: 0
    };
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(initialUsage));
  }

  // 🔒 ENHANCED PAYMENT PROTECTION: Check if user can perform specific actions
  static canPerformAction(actionType) {
    // 🚀 LOCAL DEVELOPMENT BYPASS: Allow all actions in local development
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || 
                         hostname === '127.0.0.1' || 
                         hostname.includes('localhost') ||
                         hostname.includes('127.0.0.1') ||
                         process.env.NODE_ENV === 'development';
      
      console.log(`🔍 SessionManager Debug:`, {
        actionType,
        hostname,
        isLocalhost,
        nodeEnv: process.env.NODE_ENV,
        fullUrl: window.location.href
      });
      
      if (isLocalhost || process.env.NODE_ENV === 'development') {
        console.log(`🚀 Local development bypass: Allowing ${actionType}`);
        return true;
      }
    }

    const session = this.getActiveSession();
    if (!session) {
      // Free tier limitations
      return this.checkFreeAction(actionType);
    }

    const usage = this.getSessionUsage();
    
    switch (actionType) {
      case 'upload':
        return session.limits.dailyPhotos === Infinity || usage.uploads < session.limits.dailyPhotos;
      case 'batch':
        return session.limits.batchSize > 1;
      case 'ai_demo':
        return session.limits.batchSize > 1; // AI demo requires paid plan
      case 'ai_features':
        return session.limits.aiFeatures === true;
      case 'priority':
        return session.limits.priority === true;
      case 'advanced_export':
        return session.limits.batchSize > 1; // Advanced exports require paid plan
      case 'unlimited_pdf':
        return session.limits.batchSize > 1; // Unlimited PDF generation requires paid plan
      case 'api_access':
        return session.limits.apiAccess === true;
      case 'white_label':
        return session.limits.apiAccess === true; // Enterprise feature
      default:
        return true;
    }
  }

  // Check what free users can do
  static checkFreeAction(actionType) {
    switch (actionType) {
      case 'upload':
        return true; // Free users can upload (with daily limits handled elsewhere)
      case 'batch':
        return false; // Batch processing requires payment
      case 'ai_demo':
        return false; // AI demo requires payment
      case 'ai_features':
        return false; // AI features require payment
      case 'priority':
        return false; // Priority processing requires payment
      case 'advanced_export':
        return false; // Advanced exports require payment
      case 'unlimited_pdf':
        return false; // Unlimited PDF requires payment
      case 'api_access':
        return false; // API access requires payment
      case 'white_label':
        return false; // White label requires payment
      default:
        return true;
    }
  }

  // Get current user plan (session or account-based)
  static getCurrentPlan() {
    const session = this.getActiveSession();
    if (session) {
      return {
        type: 'session',
        plan: PRICING_PLANS[session.planId],
        timeRemaining: this.formatTimeRemaining(),
        usage: this.getSessionUsage()
      };
    }

    // Check for account-based subscription
    // This would integrate with your user authentication system
    
    return {
      type: 'free',
      plan: PRICING_PLANS.free,
      timeRemaining: null,
      usage: null
    };
  }

  // 🔒 PAYMENT PROTECTION: Get upgrade message for blocked features
  static getUpgradeMessage(actionType) {
    const messages = {
      batch: {
        title: 'Batch Processing - Premium Feature',
        description: 'Process multiple images simultaneously with advanced export options.',
        minPlan: 'Day Pass ($2.99)'
      },
      ai_demo: {
        title: 'AI Document Intelligence - Premium Feature',
        description: 'Experience advanced AI-powered document analysis and intelligence features.',
        minPlan: 'Pro Plan ($9.99/month)'
      },
      ai_features: {
        title: 'AI Features - Premium Feature',
        description: 'Access AI-powered analysis, smart categorization, and intelligent insights.',
        minPlan: 'Pro Plan ($9.99/month)'
      },
      advanced_export: {
        title: 'Advanced Export - Premium Feature',
        description: 'Export to multiple formats with custom templates and options.',
        minPlan: 'Day Pass ($2.99)'
      },
      unlimited_pdf: {
        title: 'Unlimited PDF Generation - Premium Feature',
        description: 'Generate unlimited PDF reports with professional templates.',
        minPlan: 'Day Pass ($2.99)'
      },
      priority: {
        title: 'Priority Processing - Premium Feature',
        description: 'Get faster processing speeds and priority support.',
        minPlan: 'Week Pass ($9.99)'
      },
      api_access: {
        title: 'API Access - Enterprise Feature',
        description: 'Integrate ProofPix into your applications with our API.',
        minPlan: 'Enterprise ($49.99/month)'
      },
      white_label: {
        title: 'White Label - Enterprise Feature',
        description: 'Remove ProofPix branding and customize the interface.',
        minPlan: 'Enterprise ($49.99/month)'
      }
    };

    return messages[actionType] || {
      title: 'Premium Feature',
      description: 'This feature requires a paid plan.',
      minPlan: 'Day Pass ($2.99)'
    };
  }
}

export default SessionManager; 