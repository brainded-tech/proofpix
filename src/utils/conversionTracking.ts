/**
 * 📊 CONVERSION TRACKING UTILITY
 * Advanced analytics for customer segment behavior and demo performance
 */

interface CustomerSegment {
  id: string;
  name: string;
  industry: 'legal' | 'insurance' | 'healthcare' | 'general';
  size: 'startup' | 'smb' | 'enterprise';
  urgency: 'low' | 'medium' | 'high';
  techSavviness: 'basic' | 'intermediate' | 'advanced';
  budget: 'budget' | 'standard' | 'premium';
}

interface ConversionEvent {
  eventType: 'demo_started' | 'demo_completed' | 'roi_calculated' | 'contact_requested' | 'trial_started' | 'purchase_completed';
  timestamp: number;
  segment: CustomerSegment;
  metadata: {
    industry: string;
    roiValue?: number;
    timeSpent?: number;
    featuresViewed?: string[];
    painPointsIdentified?: string[];
  };
}

interface ConversionFunnel {
  segment: CustomerSegment;
  metrics: {
    demoStarted: number;
    demoCompleted: number;
    roiCalculated: number;
    contactRequested: number;
    trialStarted: number;
    purchaseCompleted: number;
  };
  conversionRates: {
    demoCompletion: number;
    roiEngagement: number;
    contactConversion: number;
    trialConversion: number;
    purchaseConversion: number;
  };
  averageTimeToConvert: number;
  averageROIValue: number;
}

interface IndustryPerformance {
  industry: string;
  totalDemos: number;
  conversionRate: number;
  averageROI: number;
  topPainPoints: string[];
  preferredFeatures: string[];
  timeToDecision: number;
}

class ConversionTracker {
  private events: ConversionEvent[] = [];
  private segments: Map<string, CustomerSegment> = new Map();
  private funnels: Map<string, ConversionFunnel> = new Map();

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultSegments();
  }

  /**
   * Initialize default customer segments for tracking
   */
  private initializeDefaultSegments(): void {
    const defaultSegments: CustomerSegment[] = [
      {
        id: 'legal_enterprise',
        name: 'Legal Enterprise',
        industry: 'legal',
        size: 'enterprise',
        urgency: 'high',
        techSavviness: 'intermediate',
        budget: 'premium'
      },
      {
        id: 'insurance_smb',
        name: 'Insurance SMB',
        industry: 'insurance',
        size: 'smb',
        urgency: 'medium',
        techSavviness: 'basic',
        budget: 'standard'
      },
      {
        id: 'healthcare_enterprise',
        name: 'Healthcare Enterprise',
        industry: 'healthcare',
        size: 'enterprise',
        urgency: 'high',
        techSavviness: 'advanced',
        budget: 'premium'
      },
      {
        id: 'general_startup',
        name: 'General Startup',
        industry: 'general',
        size: 'startup',
        urgency: 'low',
        techSavviness: 'advanced',
        budget: 'budget'
      }
    ];

    defaultSegments.forEach(segment => {
      this.segments.set(segment.id, segment);
      if (!this.funnels.has(segment.id)) {
        this.initializeFunnel(segment);
      }
    });
  }

  /**
   * Initialize conversion funnel for a segment
   */
  private initializeFunnel(segment: CustomerSegment): void {
    const funnel: ConversionFunnel = {
      segment,
      metrics: {
        demoStarted: 0,
        demoCompleted: 0,
        roiCalculated: 0,
        contactRequested: 0,
        trialStarted: 0,
        purchaseCompleted: 0
      },
      conversionRates: {
        demoCompletion: 0,
        roiEngagement: 0,
        contactConversion: 0,
        trialConversion: 0,
        purchaseConversion: 0
      },
      averageTimeToConvert: 0,
      averageROIValue: 0
    };

    this.funnels.set(segment.id, funnel);
  }

  /**
   * Track a conversion event
   */
  trackEvent(
    eventType: ConversionEvent['eventType'],
    segmentId: string,
    metadata: ConversionEvent['metadata']
  ): void {
    const segment = this.segments.get(segmentId);
    if (!segment) {
      console.warn(`Segment ${segmentId} not found`);
      return;
    }

    const event: ConversionEvent = {
      eventType,
      timestamp: Date.now(),
      segment,
      metadata
    };

    this.events.push(event);
    this.updateFunnelMetrics(segmentId, eventType, metadata);
    this.saveToStorage();

    console.log(`📊 Conversion Event Tracked:`, {
      event: eventType,
      segment: segment.name,
      industry: segment.industry,
      metadata
    });
  }

  /**
   * Update funnel metrics based on event
   */
  private updateFunnelMetrics(
    segmentId: string,
    eventType: ConversionEvent['eventType'],
    metadata: ConversionEvent['metadata']
  ): void {
    const funnel = this.funnels.get(segmentId);
    if (!funnel) return;

    // Update raw metrics
    switch (eventType) {
      case 'demo_started':
        funnel.metrics.demoStarted++;
        break;
      case 'demo_completed':
        funnel.metrics.demoCompleted++;
        break;
      case 'roi_calculated':
        funnel.metrics.roiCalculated++;
        if (metadata.roiValue) {
          this.updateAverageROI(funnel, metadata.roiValue);
        }
        break;
      case 'contact_requested':
        funnel.metrics.contactRequested++;
        break;
      case 'trial_started':
        funnel.metrics.trialStarted++;
        break;
      case 'purchase_completed':
        funnel.metrics.purchaseCompleted++;
        break;
    }

    // Recalculate conversion rates
    this.calculateConversionRates(funnel);
  }

  /**
   * Calculate conversion rates for a funnel
   */
  private calculateConversionRates(funnel: ConversionFunnel): void {
    const { metrics } = funnel;
    
    funnel.conversionRates = {
      demoCompletion: metrics.demoStarted > 0 ? (metrics.demoCompleted / metrics.demoStarted) * 100 : 0,
      roiEngagement: metrics.demoCompleted > 0 ? (metrics.roiCalculated / metrics.demoCompleted) * 100 : 0,
      contactConversion: metrics.roiCalculated > 0 ? (metrics.contactRequested / metrics.roiCalculated) * 100 : 0,
      trialConversion: metrics.contactRequested > 0 ? (metrics.trialStarted / metrics.contactRequested) * 100 : 0,
      purchaseConversion: metrics.trialStarted > 0 ? (metrics.purchaseCompleted / metrics.trialStarted) * 100 : 0
    };
  }

  /**
   * Update average ROI for a funnel
   */
  private updateAverageROI(funnel: ConversionFunnel, newROI: number): void {
    const currentAverage = funnel.averageROIValue;
    const count = funnel.metrics.roiCalculated;
    
    funnel.averageROIValue = ((currentAverage * (count - 1)) + newROI) / count;
  }

  /**
   * Get conversion funnel for a specific segment
   */
  getFunnel(segmentId: string): ConversionFunnel | undefined {
    return this.funnels.get(segmentId);
  }

  /**
   * Get all conversion funnels
   */
  getAllFunnels(): ConversionFunnel[] {
    return Array.from(this.funnels.values());
  }

  /**
   * Get industry performance analytics
   */
  getIndustryPerformance(): IndustryPerformance[] {
    const industries = ['legal', 'insurance', 'healthcare', 'general'];
    
    return industries.map(industry => {
      const industryFunnels = Array.from(this.funnels.values())
        .filter(funnel => funnel.segment.industry === industry);
      
      const totalDemos = industryFunnels.reduce((sum, funnel) => sum + funnel.metrics.demoStarted, 0);
      const totalContacts = industryFunnels.reduce((sum, funnel) => sum + funnel.metrics.contactRequested, 0);
      const conversionRate = totalDemos > 0 ? (totalContacts / totalDemos) * 100 : 0;
      
      const averageROI = industryFunnels.reduce((sum, funnel) => sum + funnel.averageROIValue, 0) / industryFunnels.length || 0;
      
      // Get top pain points from events
      const industryEvents = this.events.filter(event => event.segment.industry === industry);
      const painPoints = industryEvents
        .flatMap(event => event.metadata.painPointsIdentified || [])
        .reduce((acc, point) => {
          acc[point] = (acc[point] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      
      const topPainPoints = Object.entries(painPoints)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([point]) => point);

      // Get preferred features
      const features = industryEvents
        .flatMap(event => event.metadata.featuresViewed || [])
        .reduce((acc, feature) => {
          acc[feature] = (acc[feature] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      
      const preferredFeatures = Object.entries(features)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([feature]) => feature);

      return {
        industry,
        totalDemos,
        conversionRate,
        averageROI,
        topPainPoints,
        preferredFeatures,
        timeToDecision: this.calculateAverageTimeToDecision(industry)
      };
    });
  }

  /**
   * Calculate average time to decision for an industry
   */
  private calculateAverageTimeToDecision(industry: string): number {
    const industryEvents = this.events.filter(event => event.segment.industry === industry);
    
    // Group events by segment and calculate time from demo start to contact request
    const segmentTimes: number[] = [];
    
    const segmentGroups = industryEvents.reduce((acc, event) => {
      const segmentId = event.segment.id;
      if (!acc[segmentId]) acc[segmentId] = [];
      acc[segmentId].push(event);
      return acc;
    }, {} as Record<string, ConversionEvent[]>);

    Object.values(segmentGroups).forEach(events => {
      const demoStart = events.find(e => e.eventType === 'demo_started');
      const contactRequest = events.find(e => e.eventType === 'contact_requested');
      
      if (demoStart && contactRequest) {
        const timeDiff = contactRequest.timestamp - demoStart.timestamp;
        segmentTimes.push(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
      }
    });

    return segmentTimes.length > 0 
      ? segmentTimes.reduce((sum, time) => sum + time, 0) / segmentTimes.length 
      : 0;
  }

  /**
   * Get segment performance comparison
   */
  getSegmentComparison(): Array<{
    segment: CustomerSegment;
    overallConversionRate: number;
    averageROI: number;
    timeToConvert: number;
    performance: 'high' | 'medium' | 'low';
  }> {
    return Array.from(this.funnels.values()).map(funnel => {
      const overallConversionRate = funnel.metrics.demoStarted > 0 
        ? (funnel.metrics.contactRequested / funnel.metrics.demoStarted) * 100 
        : 0;
      
      let performance: 'high' | 'medium' | 'low' = 'low';
      if (overallConversionRate > 15) performance = 'high';
      else if (overallConversionRate > 8) performance = 'medium';

      return {
        segment: funnel.segment,
        overallConversionRate,
        averageROI: funnel.averageROIValue,
        timeToConvert: funnel.averageTimeToConvert,
        performance
      };
    }).sort((a, b) => b.overallConversionRate - a.overallConversionRate);
  }

  /**
   * Export analytics data
   */
  exportAnalytics(): {
    summary: {
      totalEvents: number;
      totalSegments: number;
      overallConversionRate: number;
      topPerformingIndustry: string;
    };
    funnels: ConversionFunnel[];
    industryPerformance: IndustryPerformance[];
    events: ConversionEvent[];
  } {
    const allFunnels = this.getAllFunnels();
    const totalDemos = allFunnels.reduce((sum, funnel) => sum + funnel.metrics.demoStarted, 0);
    const totalContacts = allFunnels.reduce((sum, funnel) => sum + funnel.metrics.contactRequested, 0);
    const overallConversionRate = totalDemos > 0 ? (totalContacts / totalDemos) * 100 : 0;
    
    const industryPerformance = this.getIndustryPerformance();
    const topPerformingIndustry = industryPerformance
      .sort((a, b) => b.conversionRate - a.conversionRate)[0]?.industry || 'none';

    return {
      summary: {
        totalEvents: this.events.length,
        totalSegments: this.segments.size,
        overallConversionRate,
        topPerformingIndustry
      },
      funnels: allFunnels,
      industryPerformance,
      events: this.events
    };
  }

  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        events: this.events,
        segments: Array.from(this.segments.entries()),
        funnels: Array.from(this.funnels.entries())
      };
      localStorage.setItem('proofpix_conversion_tracking', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save conversion tracking data:', error);
    }
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('proofpix_conversion_tracking');
      if (data) {
        const parsed = JSON.parse(data);
        this.events = parsed.events || [];
        this.segments = new Map(parsed.segments || []);
        this.funnels = new Map(parsed.funnels || []);
      }
    } catch (error) {
      console.warn('Failed to load conversion tracking data:', error);
    }
  }

  /**
   * Clear all tracking data (for testing)
   */
  clearData(): void {
    this.events = [];
    this.funnels.clear();
    this.segments.clear();
    this.initializeDefaultSegments();
    this.saveToStorage();
  }
}

// Global conversion tracker instance
export const conversionTracker = new ConversionTracker();

// Utility functions for easy tracking
export const trackDemoStarted = (industry: string, metadata: any = {}) => {
  const segmentId = `${industry}_enterprise`; // Default to enterprise segment
  conversionTracker.trackEvent('demo_started', segmentId, { industry, ...metadata });
};

export const trackDemoCompleted = (industry: string, metadata: any = {}) => {
  const segmentId = `${industry}_enterprise`;
  conversionTracker.trackEvent('demo_completed', segmentId, { industry, ...metadata });
};

export const trackROICalculated = (industry: string, roiValue: number, metadata: any = {}) => {
  const segmentId = `${industry}_enterprise`;
  conversionTracker.trackEvent('roi_calculated', segmentId, { industry, roiValue, ...metadata });
};

export const trackContactRequested = (industry: string, metadata: any = {}) => {
  const segmentId = `${industry}_enterprise`;
  conversionTracker.trackEvent('contact_requested', segmentId, { industry, ...metadata });
};

// Export types for use in components
