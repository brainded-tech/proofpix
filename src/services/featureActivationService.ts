// Dynamic Feature Activation Service
// Real-time feature toggling based on subscription tiers

export interface FeatureSet {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'ai' | 'collaboration' | 'enterprise' | 'industry';
  enabled: boolean;
  tier: 'free' | 'professional' | 'business' | 'enterprise' | 'custom';
  dependencies?: string[];
  limits?: {
    [key: string]: number | 'unlimited';
  };
}

export interface UserFeatureProfile {
  userId: string;
  currentTier: string;
  features: FeatureSet[];
  aiCredits: number;
  apiLimits: {
    callsPerMinute: number | 'unlimited';
    callsPerMonth: number | 'unlimited';
  };
  teamLimits: {
    maxMembers: number | 'unlimited';
    maxWorkspaces: number | 'unlimited';
  };
  industryAddons: string[];
  lastUpdated: Date;
}

export interface FeatureActivationEvent {
  userId: string;
  featureId: string;
  action: 'activate' | 'deactivate' | 'upgrade' | 'downgrade';
  timestamp: Date;
  reason: string;
  metadata?: any;
}

class FeatureActivationService {
  private featureDefinitions: FeatureSet[] = [
    // Core Features
    {
      id: 'basic_ocr',
      name: 'Basic OCR',
      description: 'Text extraction from images',
      category: 'core',
      enabled: true,
      tier: 'free'
    },
    {
      id: 'metadata_extraction',
      name: 'Metadata Extraction',
      description: 'Extract EXIF and technical metadata',
      category: 'core',
      enabled: true,
      tier: 'free',
      limits: { imagesPerSession: 5 }
    },
    {
      id: 'unlimited_processing',
      name: 'Unlimited Processing',
      description: 'Process unlimited images',
      category: 'core',
      enabled: false,
      tier: 'professional'
    },
    {
      id: 'batch_processing',
      name: 'Batch Processing',
      description: 'Process multiple images simultaneously',
      category: 'core',
      enabled: false,
      tier: 'professional',
      limits: { batchSize: 100 }
    },

    // AI Features
    {
      id: 'advanced_ai',
      name: 'Advanced AI Analysis',
      description: 'Enhanced AI-powered document analysis',
      category: 'ai',
      enabled: false,
      tier: 'business',
      dependencies: ['unlimited_processing']
    },
    {
      id: 'custom_ai_training',
      name: 'Custom AI Training',
      description: 'Train custom AI models',
      category: 'ai',
      enabled: false,
      tier: 'enterprise',
      limits: { modelsPerMonth: 5 }
    },
    {
      id: 'unlimited_ai_training',
      name: 'Unlimited AI Training',
      description: 'Unlimited custom AI model training',
      category: 'ai',
      enabled: false,
      tier: 'custom',
      dependencies: ['custom_ai_training']
    },

    // Collaboration Features
    {
      id: 'team_collaboration',
      name: 'Team Collaboration',
      description: 'Share workspaces with team members',
      category: 'collaboration',
      enabled: false,
      tier: 'professional',
      limits: { maxMembers: 5 }
    },
    {
      id: 'advanced_collaboration',
      name: 'Advanced Collaboration',
      description: 'Enhanced team features and analytics',
      category: 'collaboration',
      enabled: false,
      tier: 'business',
      dependencies: ['team_collaboration'],
      limits: { maxMembers: 25 }
    },
    {
      id: 'unlimited_collaboration',
      name: 'Unlimited Collaboration',
      description: 'Unlimited team members and workspaces',
      category: 'collaboration',
      enabled: false,
      tier: 'enterprise',
      dependencies: ['advanced_collaboration']
    },

    // Enterprise Features
    {
      id: 'white_label',
      name: 'White Label',
      description: 'Custom branding and white-label solution',
      category: 'enterprise',
      enabled: false,
      tier: 'enterprise'
    },
    {
      id: 'sso_integration',
      name: 'SSO Integration',
      description: 'Single Sign-On integration',
      category: 'enterprise',
      enabled: false,
      tier: 'enterprise'
    },
    {
      id: 'on_premise_deployment',
      name: 'On-Premise Deployment',
      description: 'Deploy on your own infrastructure',
      category: 'enterprise',
      enabled: false,
      tier: 'custom'
    },
    {
      id: 'dedicated_infrastructure',
      name: 'Dedicated Infrastructure',
      description: 'Dedicated cloud infrastructure',
      category: 'enterprise',
      enabled: false,
      tier: 'custom'
    },

    // Industry Features
    {
      id: 'legal_ai_package',
      name: 'Legal AI Package',
      description: 'Legal document analysis and compliance',
      category: 'industry',
      enabled: false,
      tier: 'professional' // Available as addon
    },
    {
      id: 'healthcare_ai_package',
      name: 'Healthcare AI Package',
      description: 'HIPAA-compliant medical document processing',
      category: 'industry',
      enabled: false,
      tier: 'professional'
    },
    {
      id: 'financial_ai_package',
      name: 'Financial AI Package',
      description: 'SOX compliance and financial document analysis',
      category: 'industry',
      enabled: false,
      tier: 'professional'
    },
    {
      id: 'insurance_ai_package',
      name: 'Insurance AI Package',
      description: 'Claims processing and fraud detection',
      category: 'industry',
      enabled: false,
      tier: 'professional'
    }
  ];

  private tierHierarchy = ['free', 'professional', 'business', 'enterprise', 'custom'];

  async updateUserFeatures(userId: string, newTier: string, addons: string[] = []): Promise<UserFeatureProfile> {
    const currentProfile = await this.getUserFeatureProfile(userId);
    const newFeatures = this.calculateFeaturesForTier(newTier, addons);
    
    // Track activation events
    const events: FeatureActivationEvent[] = [];
    
    // Compare current vs new features
    if (currentProfile) {
      for (const feature of newFeatures) {
        const currentFeature = currentProfile.features.find(f => f.id === feature.id);
        if (!currentFeature?.enabled && feature.enabled) {
          events.push({
            userId,
            featureId: feature.id,
            action: 'activate',
            timestamp: new Date(),
            reason: `Tier upgrade to ${newTier}`
          });
        } else if (currentFeature?.enabled && !feature.enabled) {
          events.push({
            userId,
            featureId: feature.id,
            action: 'deactivate',
            timestamp: new Date(),
            reason: `Tier change to ${newTier}`
          });
        }
      }
    }

    const newProfile: UserFeatureProfile = {
      userId,
      currentTier: newTier,
      features: newFeatures,
      aiCredits: this.getAICreditsForTier(newTier),
      apiLimits: this.getAPILimitsForTier(newTier),
      teamLimits: this.getTeamLimitsForTier(newTier),
      industryAddons: addons,
      lastUpdated: new Date()
    };

    // Store the new profile
    await this.storeUserFeatureProfile(newProfile);
    
    // Log activation events
    for (const event of events) {
      await this.logFeatureActivationEvent(event);
    }

    // Trigger real-time updates
    await this.broadcastFeatureUpdates(userId, newProfile);

    return newProfile;
  }

  private calculateFeaturesForTier(tier: string, addons: string[] = []): FeatureSet[] {
    const tierIndex = this.tierHierarchy.indexOf(tier);
    const features: FeatureSet[] = [];

    for (const featureDef of this.featureDefinitions) {
      const featureTierIndex = this.tierHierarchy.indexOf(featureDef.tier);
      const feature: FeatureSet = { ...featureDef };

      // Enable feature if user's tier is equal or higher
      if (tierIndex >= featureTierIndex) {
        feature.enabled = true;
      }

      // Enable industry addons
      if (featureDef.category === 'industry' && addons.includes(featureDef.id)) {
        feature.enabled = true;
      }

      // Check dependencies
      if (feature.enabled && feature.dependencies) {
        const dependenciesMet = feature.dependencies.every(depId => 
          features.find(f => f.id === depId)?.enabled
        );
        if (!dependenciesMet) {
          feature.enabled = false;
        }
      }

      // Adjust limits based on tier
      if (feature.limits) {
        feature.limits = this.adjustLimitsForTier(feature.limits, tier);
      }

      features.push(feature);
    }

    return features;
  }

  private adjustLimitsForTier(baseLimits: any, tier: string): any {
    const tierMultipliers = {
      free: 1,
      professional: 5,
      business: 25,
      enterprise: 100,
      custom: Infinity
    };

    const multiplier = tierMultipliers[tier as keyof typeof tierMultipliers] || 1;
    const adjustedLimits: any = {};

    for (const [key, value] of Object.entries(baseLimits)) {
      if (typeof value === 'number') {
        adjustedLimits[key] = multiplier === Infinity ? 'unlimited' : value * multiplier;
      } else {
        adjustedLimits[key] = value;
      }
    }

    return adjustedLimits;
  }

  private getAICreditsForTier(tier: string): number {
    const credits = {
      free: 0,
      professional: 100,
      business: 500,
      enterprise: 2000,
      custom: -1 // unlimited
    };
    return credits[tier as keyof typeof credits] || 0;
  }

  private getAPILimitsForTier(tier: string): any {
    const limits = {
      free: { callsPerMinute: 10, callsPerMonth: 100 },
      professional: { callsPerMinute: 100, callsPerMonth: 1000 },
      business: { callsPerMinute: 500, callsPerMonth: 10000 },
      enterprise: { callsPerMinute: 'unlimited', callsPerMonth: 'unlimited' },
      custom: { callsPerMinute: 'unlimited', callsPerMonth: 'unlimited' }
    };
    return limits[tier as keyof typeof limits] || limits.free;
  }

  private getTeamLimitsForTier(tier: string): any {
    const limits = {
      free: { maxMembers: 1, maxWorkspaces: 1 },
      professional: { maxMembers: 5, maxWorkspaces: 3 },
      business: { maxMembers: 25, maxWorkspaces: 10 },
      enterprise: { maxMembers: 'unlimited', maxWorkspaces: 'unlimited' },
      custom: { maxMembers: 'unlimited', maxWorkspaces: 'unlimited' }
    };
    return limits[tier as keyof typeof limits] || limits.free;
  }

  async getUserFeatureProfile(userId: string): Promise<UserFeatureProfile | null> {
    const stored = localStorage.getItem(`feature_profile_${userId}`);
    return stored ? JSON.parse(stored) : null;
  }

  private async storeUserFeatureProfile(profile: UserFeatureProfile): Promise<void> {
    localStorage.setItem(`feature_profile_${profile.userId}`, JSON.stringify(profile));
  }

  private async logFeatureActivationEvent(event: FeatureActivationEvent): Promise<void> {
    const events = this.getStoredEvents();
    events.push(event);
    localStorage.setItem('feature_activation_events', JSON.stringify(events.slice(-1000))); // Keep last 1000 events
    console.log('🔄 Feature activation event:', event);
  }

  private getStoredEvents(): FeatureActivationEvent[] {
    const stored = localStorage.getItem('feature_activation_events');
    return stored ? JSON.parse(stored) : [];
  }

  private async broadcastFeatureUpdates(userId: string, profile: UserFeatureProfile): Promise<void> {
    // Simulate real-time broadcast
    window.dispatchEvent(new CustomEvent('featureProfileUpdated', {
      detail: { userId, profile }
    }));
    console.log('📡 Feature updates broadcasted for user:', userId);
  }

  // Public API methods
  async isFeatureEnabled(userId: string, featureId: string): Promise<boolean> {
    const profile = await this.getUserFeatureProfile(userId);
    if (!profile) return false;
    
    const feature = profile.features.find(f => f.id === featureId);
    return feature?.enabled || false;
  }

  async getFeatureLimit(userId: string, featureId: string, limitKey: string): Promise<number | 'unlimited'> {
    const profile = await this.getUserFeatureProfile(userId);
    if (!profile) return 0;
    
    const feature = profile.features.find(f => f.id === featureId);
    return feature?.limits?.[limitKey] || 0;
  }

  async addIndustryAddon(userId: string, addonId: string): Promise<UserFeatureProfile> {
    const profile = await this.getUserFeatureProfile(userId);
    if (!profile) throw new Error('User profile not found');
    
    const newAddons = [...profile.industryAddons, addonId];
    return this.updateUserFeatures(userId, profile.currentTier, newAddons);
  }

  async removeIndustryAddon(userId: string, addonId: string): Promise<UserFeatureProfile> {
    const profile = await this.getUserFeatureProfile(userId);
    if (!profile) throw new Error('User profile not found');
    
    const newAddons = profile.industryAddons.filter(id => id !== addonId);
    return this.updateUserFeatures(userId, profile.currentTier, newAddons);
  }

  async getAvailableFeatures(tier: string): Promise<FeatureSet[]> {
    return this.calculateFeaturesForTier(tier);
  }

  async getFeatureUsageAnalytics(userId: string): Promise<any> {
    const events = this.getStoredEvents().filter(e => e.userId === userId);
    const profile = await this.getUserFeatureProfile(userId);
    
    return {
      totalActivations: events.filter(e => e.action === 'activate').length,
      totalDeactivations: events.filter(e => e.action === 'deactivate').length,
      currentTier: profile?.currentTier,
      enabledFeatures: profile?.features.filter(f => f.enabled).length || 0,
      lastActivity: events[events.length - 1]?.timestamp,
      featuresByCategory: this.groupFeaturesByCategory(profile?.features || [])
    };
  }

  private groupFeaturesByCategory(features: FeatureSet[]): any {
    const grouped: any = {};
    for (const feature of features) {
      if (!grouped[feature.category]) {
        grouped[feature.category] = { total: 0, enabled: 0 };
      }
      grouped[feature.category].total++;
      if (feature.enabled) {
        grouped[feature.category].enabled++;
      }
    }
    return grouped;
  }

  // Subscription change handlers
  async handleSubscriptionUpgrade(userId: string, fromTier: string, toTier: string): Promise<void> {
    console.log(`🚀 Subscription upgrade: ${fromTier} → ${toTier} for user ${userId}`);
    
    const profile = await this.getUserFeatureProfile(userId);
    await this.updateUserFeatures(userId, toTier, profile?.industryAddons || []);
    
    // Send upgrade notification
    await this.sendUpgradeNotification(userId, fromTier, toTier);
  }

  async handleSubscriptionDowngrade(userId: string, fromTier: string, toTier: string): Promise<void> {
    console.log(`📉 Subscription downgrade: ${fromTier} → ${toTier} for user ${userId}`);
    
    const profile = await this.getUserFeatureProfile(userId);
    await this.updateUserFeatures(userId, toTier, profile?.industryAddons || []);
    
    // Send downgrade notification with feature loss warning
    await this.sendDowngradeNotification(userId, fromTier, toTier);
  }

  private async sendUpgradeNotification(userId: string, fromTier: string, toTier: string): Promise<void> {
    console.log(`📧 Upgrade notification sent to user ${userId}: ${fromTier} → ${toTier}`);
  }

  private async sendDowngradeNotification(userId: string, fromTier: string, toTier: string): Promise<void> {
    console.log(`⚠️ Downgrade notification sent to user ${userId}: ${fromTier} → ${toTier}`);
  }

  // Feature gate checking
  async checkFeatureGate(userId: string, featureId: string): Promise<{ allowed: boolean; reason?: string }> {
    const isEnabled = await this.isFeatureEnabled(userId, featureId);
    
    if (!isEnabled) {
      const profile = await this.getUserFeatureProfile(userId);
      const feature = this.featureDefinitions.find(f => f.id === featureId);
      
      return {
        allowed: false,
        reason: `Feature "${feature?.name}" requires ${feature?.tier} tier or higher. Current tier: ${profile?.currentTier}`
      };
    }
    
    return { allowed: true };
  }
}

export const featureActivationService = new FeatureActivationService();
export default featureActivationService; 