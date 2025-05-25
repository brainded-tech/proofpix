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

  static getActiveSession() {
    try {
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Check if session has expired
      if (this.isSessionExpired(session)) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting session:', error);
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
    const timeLeft = this.getTimeRemaining();
    if (timeLeft === 0) return 'Expired';

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  }

  static parseDuration(duration) {
    const durations = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    return durations[duration] || durations['24h'];
  }

  // Usage tracking for session-based plans
  static getSessionUsage() {
    try {
      const usageData = localStorage.getItem(USAGE_STORAGE_KEY);
      return usageData ? JSON.parse(usageData) : {
        uploads: 0,
        batchProcesses: 0,
        exports: 0,
        lastReset: Date.now()
      };
    } catch (error) {
      console.error('Error getting session usage:', error);
      return { uploads: 0, batchProcesses: 0, exports: 0, lastReset: Date.now() };
    }
  }

  static incrementSessionUsage(type) {
    const usage = this.getSessionUsage();
    usage[type] = (usage[type] || 0) + 1;
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
    return usage;
  }

  static resetUsage() {
    const usage = {
      uploads: 0,
      batchProcesses: 0,
      exports: 0,
      lastReset: Date.now()
    };
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
    return usage;
  }

  static canPerformAction(actionType) {
    const session = this.getActiveSession();
    if (!session) return false;

    const usage = this.getSessionUsage();
    
    switch (actionType) {
      case 'upload':
        return session.limits.dailyPhotos === Infinity || usage.uploads < session.limits.dailyPhotos;
      case 'batch':
        return session.limits.batchSize > 1;
      case 'priority':
        return session.limits.priority === true;
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

    // TODO: Check for account-based subscription
    // This would integrate with your user authentication system
    
    return {
      type: 'free',
      plan: PRICING_PLANS.free,
      timeRemaining: null,
      usage: null
    };
  }
}

export default SessionManager; 