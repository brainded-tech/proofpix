// Comprehensive analytics stub
type AnyFunction = (...args: any[]) => any;

const createAnalyticsStub = (): any => {
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === "getUsageStats") {
        return () => ({ uploads: 0, pdfs: 0, images: 0, pdfDownloads: 0, imageDownloads: 0, dataExports: 0 });
      }
      if (prop === "getCurrentUsage") {
        return () => ({ imagesProcessed: 0, pdfsGenerated: 0, uploadsToday: 0, dataExports: 0 });
      }
      if (prop === "getLimits") {
        return () => ({ imagesPerSession: 100, pdfsPerSession: 50, uploadsPerDay: 1000, dataExportsPerDay: 100 });
      }
      return (...args: any[]) => {};
    }
  });
};

export const analytics = createAnalyticsStub();
export const usageTracker = createAnalyticsStub();
export const trackTimestampOverlay = (...args: any[]) => {};
export const trackPDFExport = (...args: any[]) => {};
export const trackJSONExport = (...args: any[]) => {};
export const trackImageExport = (...args: any[]) => {};
export const trackFileUpload = (...args: any[]) => {};

// Analytics tracking system for unified pricing page
export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

export interface UserContext {
  userId?: string;
  sessionId: string;
  referrer: string;
  userAgent: string;
  viewport: { width: number; height: number };
  industry?: string;
  companySize?: string;
  userType?: string;
}

export interface ConversionFunnelStep {
  step: string;
  timestamp: number;
  data?: Record<string, any>;
}

class PricingAnalytics {
  private sessionId: string;
  private funnelSteps: ConversionFunnelStep[] = [];
  private startTime: number;
  private userContext: Partial<UserContext> = {};
  private eventThrottle: Map<string, number> = new Map();
  private readonly THROTTLE_DELAY = 1000; // 1 second throttle

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initializeContext();
    this.trackPageView();
  }

  private generateSessionId(): string {
    // Polyfill for crypto.randomUUID if not available
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback UUID generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private initializeContext(): void {
    this.userContext = {
      sessionId: this.sessionId,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      industry: this.detectIndustry(),
      companySize: this.detectCompanySize(),
      userType: this.detectUserType()
    };
  }

  private detectIndustry(): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    const industry = urlParams.get('industry');
    if (industry) return industry;

    // Detect from referrer
    const referrer = document.referrer.toLowerCase();
    if (referrer.includes('legal')) return 'legal';
    if (referrer.includes('healthcare') || referrer.includes('medical')) return 'healthcare';
    if (referrer.includes('insurance')) return 'insurance';
    if (referrer.includes('realestate') || referrer.includes('real-estate')) return 'realestate';
    if (referrer.includes('government') || referrer.includes('gov')) return 'government';

    return undefined;
  }

  private detectCompanySize(): string | undefined {
    // Could be enhanced with IP-based company detection
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('company_size') || undefined;
  }

  private detectUserType(): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    if (view) return view;

    // Detect from localStorage
    return localStorage.getItem('proofpix_user_type') || 'general';
  }

  // Core tracking methods
  public trackPageView(): void {
    this.track({
      event: 'page_view',
      category: 'pricing',
      properties: {
        ...this.userContext,
        url: window.location.href,
        title: document.title
      }
    });

    this.addFunnelStep('page_view');
  }

  public trackSectionView(section: string): void {
    this.track({
      event: 'section_view',
      category: 'engagement',
      label: section,
      properties: {
        section,
        timeOnPage: Date.now() - this.startTime
      }
    });

    this.addFunnelStep('section_view', { section });
  }

  public trackPlanHover(plan: string, duration: number): void {
    this.track({
      event: 'plan_hover',
      category: 'engagement',
      label: plan,
      value: duration,
      properties: {
        plan,
        duration,
        section: this.getCurrentSection()
      }
    });
  }

  public trackCTAClick(cta: string, plan: string, position: string): void {
    this.track({
      event: 'cta_click',
      category: 'conversion',
      label: `${cta}_${plan}`,
      properties: {
        cta,
        plan,
        position,
        timeToClick: Date.now() - this.startTime
      }
    });

    this.addFunnelStep('cta_click', { cta, plan, position });
  }

  public trackQuizStart(): void {
    this.track({
      event: 'quiz_start',
      category: 'engagement',
      properties: {
        timeToStart: Date.now() - this.startTime
      }
    });

    this.addFunnelStep('quiz_start');
  }

  public trackQuizStep(step: number, question: string, answer: string): void {
    this.track({
      event: 'quiz_step',
      category: 'engagement',
      label: `step_${step}`,
      value: step,
      properties: {
        step,
        question,
        answer,
        timeInQuiz: Date.now() - this.getQuizStartTime()
      }
    });
  }

  public trackQuizComplete(recommendation: string, answers: Record<string, string>): void {
    const quizDuration = Date.now() - this.getQuizStartTime();
    
    this.track({
      event: 'quiz_complete',
      category: 'conversion',
      label: recommendation,
      value: quizDuration,
      properties: {
        recommendation,
        answers,
        duration: quizDuration,
        completionRate: 100
      }
    });

    this.addFunnelStep('quiz_complete', { recommendation, answers });
  }

  public trackROICalculatorStart(): void {
    this.track({
      event: 'roi_calculator_start',
      category: 'engagement',
      properties: {
        timeToStart: Date.now() - this.startTime
      }
    });

    this.addFunnelStep('roi_calculator_start');
  }

  public trackROICalculated(inputs: Record<string, any>, results: Record<string, any>): void {
    this.track({
      event: 'roi_calculated',
      category: 'conversion',
      label: results.recommendedPlan,
      value: Math.round(results.roi),
      properties: {
        inputs,
        results,
        calculationTime: Date.now() - this.getROIStartTime()
      }
    });

    this.addFunnelStep('roi_calculated', { inputs, results });
  }

  public trackIndustrySelection(industry: string): void {
    this.userContext.industry = industry;
    
    this.track({
      event: 'industry_selection',
      category: 'engagement',
      label: industry,
      properties: {
        industry,
        previousIndustry: this.userContext.industry
      }
    });

    this.addFunnelStep('industry_selection', { industry });
  }

  public trackBillingCycleChange(cycle: 'monthly' | 'annual'): void {
    this.track({
      event: 'billing_cycle_change',
      category: 'engagement',
      label: cycle,
      properties: {
        cycle,
        timeToChange: Date.now() - this.startTime
      }
    });
  }

  public trackFAQExpand(question: string, index: number): void {
    this.track({
      event: 'faq_expand',
      category: 'engagement',
      label: question,
      value: index,
      properties: {
        question,
        index,
        timeToExpand: Date.now() - this.startTime
      }
    });
  }

  public trackScrollDepth(percentage: number): void {
    // Only track at 25%, 50%, 75%, 100%
    if ([25, 50, 75, 100].includes(percentage)) {
      this.track({
        event: 'scroll_depth',
        category: 'engagement',
        label: `${percentage}%`,
        value: percentage,
        properties: {
          percentage,
          timeToScroll: Date.now() - this.startTime
        }
      });
    }
  }

  public trackExitIntent(): void {
    this.track({
      event: 'exit_intent',
      category: 'engagement',
      properties: {
        timeOnPage: Date.now() - this.startTime,
        funnelSteps: this.funnelSteps.length,
        lastStep: this.funnelSteps[this.funnelSteps.length - 1]?.step
      }
    });
  }

  public trackConversion(plan: string, type: 'session' | 'subscription' | 'enterprise'): void {
    const conversionTime = Date.now() - this.startTime;
    
    this.track({
      event: 'conversion',
      category: 'conversion',
      label: plan,
      value: this.getPlanValue(plan),
      properties: {
        plan,
        type,
        conversionTime,
        funnelSteps: this.funnelSteps.length,
        userJourney: this.funnelSteps.map(s => s.step),
        industry: this.userContext.industry
      }
    });

    this.addFunnelStep('conversion', { plan, type });
  }

  // Helper methods
  private addFunnelStep(step: string, data?: Record<string, any>): void {
    this.funnelSteps.push({
      step,
      timestamp: Date.now(),
      data
    });
  }

  private getQuizStartTime(): number {
    const quizStart = this.funnelSteps.find(s => s.step === 'quiz_start');
    return quizStart?.timestamp || Date.now();
  }

  private getROIStartTime(): number {
    const roiStart = this.funnelSteps.find(s => s.step === 'roi_calculator_start');
    return roiStart?.timestamp || Date.now();
  }

  private getCurrentSection(): string {
    // Determine current section based on scroll position
    const scrollY = window.scrollY;
    const sections = ['hero', 'session-passes', 'subscriptions', 'enterprise', 'interactive-tools', 'faq'];
    
    // Simple section detection - could be enhanced
    if (scrollY < 800) return 'hero';
    if (scrollY < 1600) return 'session-passes';
    if (scrollY < 2400) return 'subscriptions';
    if (scrollY < 3200) return 'enterprise';
    if (scrollY < 4000) return 'interactive-tools';
    return 'faq';
  }

  private getPlanValue(plan: string): number {
    const values = {
      'day': 2.99,
      'week': 9.99,
      'month': 49.99,
      'individual': 19,
      'professional': 49,
      'business': 149,
      'enterprise': 499
    };
    return values[plan as keyof typeof values] || 0;
  }

  // Core tracking method
  public track(event: AnalyticsEvent): void {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: event.properties
      });
    }

    // Custom analytics endpoint
    this.sendToCustomAnalytics(event).catch(error => {
      console.error('Failed to send analytics event:', error);
    });

    // Console logging for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 Analytics Event:', event);
    }
  }

  // Generic event tracking method
  public trackEvent(event: string, category: string, value?: number, properties?: Record<string, any>): void {
    this.track({
      event,
      category,
      value,
      properties
    });
  }

  // Enhanced event tracking with label and full options
  public trackEventWithDetails(
    event: string, 
    category: string, 
    label?: string,
    value?: number, 
    properties?: Record<string, any>
  ): void {
    this.track({
      event,
      category,
      label,
      value,
      properties: {
        timestamp: Date.now(),
        timeSinceSessionStart: Date.now() - this.startTime,
        currentUrl: window.location.href,
        ...this.userContext,
        ...properties
      }
    });

    // Add to funnel steps if it's a significant event
    if (
      category === 'conversion' || 
      category === 'engagement' || 
      event.includes('view_') || 
      event.includes('click_')
    ) {
      this.addFunnelStep(event, { category, label, value, ...properties });
    }
  }

  private async sendToCustomAnalytics(event: AnalyticsEvent): Promise<void> {
    // Skip analytics in development mode to prevent spam
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    try {
      // Only send to production analytics endpoint
      const apiUrl = process.env.REACT_APP_API_URL || 'https://api.proofpixapp.com';
      
      await fetch(`${apiUrl}/api/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          sessionId: this.sessionId,
          timestamp: Date.now(),
          userContext: this.userContext
        })
      });
    } catch (error) {
      // Silently fail in production to avoid console spam
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Analytics tracking failed:', error);
      }
    }
  }

  // Public API for getting analytics data
  public getFunnelData(): ConversionFunnelStep[] {
    return [...this.funnelSteps];
  }

  public getSessionData(): Record<string, any> {
    return {
      sessionId: this.sessionId,
      duration: Date.now() - this.startTime,
      funnelSteps: this.funnelSteps.length,
      userContext: this.userContext,
      lastActivity: this.funnelSteps[this.funnelSteps.length - 1]?.timestamp
    };
  }
}

// Singleton instance
export const pricingAnalytics = new PricingAnalytics();

// Scroll depth tracking
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
  const scrollDepth = Math.round(
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
  );
  
  if (scrollDepth > maxScrollDepth) {
    maxScrollDepth = scrollDepth;
    pricingAnalytics.trackScrollDepth(scrollDepth);
  }
});

// Exit intent tracking
document.addEventListener('mouseleave', (e) => {
  if (e.clientY <= 0) {
    pricingAnalytics.trackExitIntent();
  }
});

// Page visibility tracking
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pricingAnalytics.trackExitIntent();
  }
});

export default pricingAnalytics;
