// A/B Testing Framework for ProofPix Pricing Page
import { pricingAnalytics } from './analytics';

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABVariant[];
  trafficSplit: number[]; // Percentage split for each variant
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  targetMetric: string;
  minimumSampleSize: number;
  confidenceLevel: number;
}

export interface ABVariant {
  id: string;
  name: string;
  description: string;
  config: Record<string, any>;
  weight: number;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  sessionId: string;
  timestamp: number;
  converted: boolean;
  conversionValue?: number;
  metadata?: Record<string, any>;
}

class ABTestingManager {
  private activeTests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map(); // userId -> testId -> variantId
  private testResults: ABTestResult[] = [];

  constructor() {
    this.initializeTests();
    this.loadUserAssignments();
  }

  private initializeTests(): void {
    // Define active A/B tests
    const tests: ABTest[] = [
      {
        id: 'pricing_urgency_banner',
        name: 'Urgency Banner Test',
        description: 'Test impact of urgency banner on conversion rates',
        variants: [
          {
            id: 'control',
            name: 'No Banner',
            description: 'Standard pricing page without urgency banner',
            config: { showUrgencyBanner: false },
            weight: 50
          },
          {
            id: 'urgency_banner',
            name: 'Urgency Banner',
            description: 'Show limited time offer banner',
            config: { 
              showUrgencyBanner: true,
              bannerText: '🔥 Limited Time: 50% off all plans! Use code SAVE50',
              bannerColor: 'red'
            },
            weight: 50
          }
        ],
        trafficSplit: [50, 50],
        isActive: true,
        startDate: new Date('2024-01-01'),
        targetMetric: 'conversion_rate',
        minimumSampleSize: 1000,
        confidenceLevel: 95
      },
      {
        id: 'pricing_display_order',
        name: 'Pricing Section Order',
        description: 'Test optimal order of pricing sections',
        variants: [
          {
            id: 'sessions_first',
            name: 'Sessions First',
            description: 'Show session passes before subscriptions',
            config: { 
              sectionOrder: ['sessions', 'subscriptions', 'enterprise'],
              emphasizeSessionPasses: true
            },
            weight: 50
          },
          {
            id: 'subscriptions_first',
            name: 'Subscriptions First',
            description: 'Show subscriptions before session passes',
            config: { 
              sectionOrder: ['subscriptions', 'sessions', 'enterprise'],
              emphasizeSubscriptions: true
            },
            weight: 50
          }
        ],
        trafficSplit: [50, 50],
        isActive: true,
        startDate: new Date('2024-01-01'),
        targetMetric: 'subscription_conversion',
        minimumSampleSize: 800,
        confidenceLevel: 95
      },
      {
        id: 'cta_button_text',
        name: 'CTA Button Text',
        description: 'Test different call-to-action button texts',
        variants: [
          {
            id: 'get_started',
            name: 'Get Started',
            description: 'Standard "Get Started" text',
            config: { 
              ctaText: 'Get Started',
              ctaStyle: 'primary'
            },
            weight: 25
          },
          {
            id: 'start_free_trial',
            name: 'Start Free Trial',
            description: 'Emphasize free trial',
            config: { 
              ctaText: 'Start Free Trial',
              ctaStyle: 'primary'
            },
            weight: 25
          },
          {
            id: 'choose_plan',
            name: 'Choose Plan',
            description: 'Direct plan selection',
            config: { 
              ctaText: 'Choose Plan',
              ctaStyle: 'primary'
            },
            weight: 25
          },
          {
            id: 'try_now',
            name: 'Try Now',
            description: 'Immediate action focus',
            config: { 
              ctaText: 'Try Now',
              ctaStyle: 'primary'
            },
            weight: 25
          }
        ],
        trafficSplit: [25, 25, 25, 25],
        isActive: true,
        startDate: new Date('2024-01-01'),
        targetMetric: 'cta_click_rate',
        minimumSampleSize: 1200,
        confidenceLevel: 95
      },
      {
        id: 'social_proof_placement',
        name: 'Social Proof Placement',
        description: 'Test optimal placement of trust signals and social proof',
        variants: [
          {
            id: 'top_only',
            name: 'Top Only',
            description: 'Show trust signals only at the top',
            config: { 
              trustSignalsTop: true,
              trustSignalsBottom: false,
              testimonialPlacement: 'none'
            },
            weight: 33
          },
          {
            id: 'top_and_bottom',
            name: 'Top and Bottom',
            description: 'Show trust signals at top and bottom',
            config: { 
              trustSignalsTop: true,
              trustSignalsBottom: true,
              testimonialPlacement: 'bottom'
            },
            weight: 33
          },
          {
            id: 'integrated',
            name: 'Integrated',
            description: 'Integrate trust signals throughout the page',
            config: { 
              trustSignalsTop: true,
              trustSignalsBottom: true,
              testimonialPlacement: 'integrated'
            },
            weight: 34
          }
        ],
        trafficSplit: [33, 33, 34],
        isActive: true,
        startDate: new Date('2024-01-01'),
        targetMetric: 'trust_engagement',
        minimumSampleSize: 900,
        confidenceLevel: 95
      }
    ];

    tests.forEach(test => {
      this.activeTests.set(test.id, test);
    });
  }

  private loadUserAssignments(): void {
    try {
      const stored = localStorage.getItem('proofpix_ab_assignments');
      if (stored) {
        const assignments = JSON.parse(stored);
        this.userAssignments = new Map(
          Object.entries(assignments).map(([userId, tests]) => [
            userId,
            new Map(Object.entries(tests as Record<string, string>))
          ])
        );
      }
    } catch (error) {
      console.warn('Failed to load A/B test assignments:', error);
    }
  }

  private saveUserAssignments(): void {
    try {
      const assignments: Record<string, Record<string, string>> = {};
      this.userAssignments.forEach((tests, userId) => {
        assignments[userId] = Object.fromEntries(tests);
      });
      localStorage.setItem('proofpix_ab_assignments', JSON.stringify(assignments));
    } catch (error) {
      console.warn('Failed to save A/B test assignments:', error);
    }
  }

  public getUserId(): string {
    let userId = localStorage.getItem('proofpix_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('proofpix_user_id', userId);
    }
    return userId;
  }

  public getVariant(testId: string): ABVariant | null {
    const test = this.activeTests.get(testId);
    if (!test || !test.isActive) {
      return null;
    }

    const userId = this.getUserId();
    
    // Check if user already has an assignment
    if (this.userAssignments.has(userId)) {
      const userTests = this.userAssignments.get(userId)!;
      if (userTests.has(testId)) {
        const variantId = userTests.get(testId)!;
        return test.variants.find(v => v.id === variantId) || null;
      }
    }

    // Assign user to a variant
    const variant = this.assignUserToVariant(test, userId);
    
    // Store assignment
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map());
    }
    this.userAssignments.get(userId)!.set(testId, variant.id);
    this.saveUserAssignments();

    // Track assignment
    pricingAnalytics.track({
      event: 'ab_test_assignment',
      category: 'experiment',
      label: `${testId}_${variant.id}`,
      properties: {
        testId,
        variantId: variant.id,
        userId,
        testName: test.name,
        variantName: variant.name
      }
    });

    return variant;
  }

  private assignUserToVariant(test: ABTest, userId: string): ABVariant {
    // Use consistent hashing for stable assignments
    const hash = this.hashString(`${userId}_${test.id}`);
    const bucket = hash % 100;
    
    let cumulativeWeight = 0;
    for (let i = 0; i < test.variants.length; i++) {
      cumulativeWeight += test.trafficSplit[i];
      if (bucket < cumulativeWeight) {
        return test.variants[i];
      }
    }
    
    // Fallback to first variant
    return test.variants[0];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  public trackConversion(testId: string, conversionValue?: number, metadata?: Record<string, any>): void {
    const userId = this.getUserId();
    const variant = this.getVariant(testId);
    
    if (!variant) return;

    const result: ABTestResult = {
      testId,
      variantId: variant.id,
      userId,
      sessionId: pricingAnalytics.getSessionData().sessionId,
      timestamp: Date.now(),
      converted: true,
      conversionValue,
      metadata
    };

    this.testResults.push(result);
    
    // Track in analytics
    pricingAnalytics.track({
      event: 'ab_test_conversion',
      category: 'experiment',
      label: `${testId}_${variant.id}`,
      value: conversionValue,
      properties: {
        ...result,
        testName: this.activeTests.get(testId)?.name,
        variantName: variant.name
      }
    });

    // Send to backend for analysis
    this.sendResultToBackend(result);
  }

  public trackEvent(testId: string, eventName: string, eventValue?: number, metadata?: Record<string, any>): void {
    const userId = this.getUserId();
    const variant = this.getVariant(testId);
    
    if (!variant) return;

    pricingAnalytics.track({
      event: 'ab_test_event',
      category: 'experiment',
      label: `${testId}_${variant.id}_${eventName}`,
      value: eventValue,
      properties: {
        testId,
        variantId: variant.id,
        userId,
        eventName,
        eventValue,
        metadata,
        testName: this.activeTests.get(testId)?.name,
        variantName: variant.name
      }
    });
  }

  private async sendResultToBackend(result: ABTestResult): Promise<void> {
    try {
      await fetch('/api/ab-test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result)
      });
    } catch (error) {
      console.warn('Failed to send A/B test result:', error);
    }
  }

  public getTestConfig(testId: string): Record<string, any> {
    const variant = this.getVariant(testId);
    return variant?.config || {};
  }

  public isInTest(testId: string): boolean {
    return this.getVariant(testId) !== null;
  }

  public getActiveTests(): ABTest[] {
    return Array.from(this.activeTests.values()).filter(test => test.isActive);
  }

  public getTestResults(testId: string): ABTestResult[] {
    return this.testResults.filter(result => result.testId === testId);
  }

  // Statistical analysis methods
  public calculateSignificance(testId: string): Record<string, any> {
    const test = this.activeTests.get(testId);
    if (!test) return {};

    const results = this.getTestResults(testId);
    const variantStats: Record<string, any> = {};

    test.variants.forEach(variant => {
      const variantResults = results.filter(r => r.variantId === variant.id);
      const conversions = variantResults.filter(r => r.converted).length;
      const total = variantResults.length;
      const conversionRate = total > 0 ? conversions / total : 0;

      variantStats[variant.id] = {
        name: variant.name,
        total,
        conversions,
        conversionRate,
        confidence: this.calculateConfidence(conversions, total, test.confidenceLevel)
      };
    });

    return {
      testName: test.name,
      variants: variantStats,
      isSignificant: this.isStatisticallySignificant(variantStats, test.confidenceLevel),
      recommendedWinner: this.getRecommendedWinner(variantStats)
    };
  }

  private calculateConfidence(conversions: number, total: number, targetConfidence: number): number {
    if (total === 0) return 0;
    
    const p = conversions / total;
    const z = this.getZScore(targetConfidence);
    const margin = z * Math.sqrt((p * (1 - p)) / total);
    
    return Math.max(0, Math.min(100, (1 - 2 * margin) * 100));
  }

  private getZScore(confidence: number): number {
    const zScores: Record<number, number> = {
      90: 1.645,
      95: 1.96,
      99: 2.576
    };
    return zScores[confidence] || 1.96;
  }

  private isStatisticallySignificant(variantStats: Record<string, any>, targetConfidence: number): boolean {
    const variants = Object.values(variantStats);
    if (variants.length < 2) return false;

    return variants.some((variant: any) => variant.confidence >= targetConfidence);
  }

  private getRecommendedWinner(variantStats: Record<string, any>): string | null {
    const variants = Object.entries(variantStats);
    if (variants.length < 2) return null;

    const winner = variants.reduce((best, current) => {
      const [, bestStats] = best;
      const [, currentStats] = current;
      
      if (currentStats.confidence >= 95 && currentStats.conversionRate > bestStats.conversionRate) {
        return current;
      }
      return best;
    });

    return winner[1].confidence >= 95 ? winner[0] : null;
  }
}

// Singleton instance
export const abTestingManager = new ABTestingManager();

// Helper hooks for React components
export const useABTest = (testId: string) => {
  const variant = abTestingManager.getVariant(testId);
  const config = abTestingManager.getTestConfig(testId);
  
  return {
    variant,
    config,
    isInTest: variant !== null,
    trackConversion: (value?: number, metadata?: Record<string, any>) => 
      abTestingManager.trackConversion(testId, value, metadata),
    trackEvent: (eventName: string, value?: number, metadata?: Record<string, any>) => 
      abTestingManager.trackEvent(testId, eventName, value, metadata)
  };
};

export default abTestingManager; 