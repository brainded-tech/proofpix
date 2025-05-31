import { PRICING_PLANS } from './stripe';

export interface AICredit {
  id: string;
  userId: string;
  operation: 'ocr' | 'classification' | 'fraud_detection' | 'quality_assessment' | 'entity_extraction' | 'custom_model' | 'predictive_analytics';
  creditsUsed: number;
  timestamp: Date;
  documentId?: string;
  confidence?: number;
  planType: string;
}

export interface AIUsage {
  userId: string;
  planType: string;
  creditsRemaining: number;
  creditsUsed: number;
  monthlyLimit: number;
  resetDate: Date;
  operations: AICredit[];
}

export class AICreditsManager {
  private static instance: AICreditsManager;
  private usageCache: Map<string, AIUsage> = new Map();

  static getInstance(): AICreditsManager {
    if (!AICreditsManager.instance) {
      AICreditsManager.instance = new AICreditsManager();
    }
    return AICreditsManager.instance;
  }

  // AI Operation Credit Costs
  private readonly CREDIT_COSTS = {
    ocr: {
      basic: 1,
      enhanced: 2,
      handwriting: 3
    },
    classification: {
      basic: 1,
      custom: 3,
      industry_specific: 5
    },
    fraud_detection: {
      basic: 2,
      advanced: 4,
      deep_analysis: 8
    },
    quality_assessment: {
      basic: 1,
      enhancement: 3,
      prediction: 2
    },
    entity_extraction: {
      basic: 2,
      advanced: 4,
      relationships: 6
    },
    predictive_analytics: {
      processing_time: 1,
      quality_prediction: 2,
      success_probability: 3,
      workflow_optimization: 5
    },
    custom_model: {
      training: 50,
      inference: 10,
      fine_tuning: 100
    }
  };

  async getUserUsage(userId: string): Promise<AIUsage> {
    // Check cache first
    if (this.usageCache.has(userId)) {
      return this.usageCache.get(userId)!;
    }

    // Fetch from API/localStorage
    const usage = await this.fetchUserUsage(userId);
    this.usageCache.set(userId, usage);
    return usage;
  }

  async consumeCredits(
    userId: string,
    operation: string,
    subOperation: string = 'basic',
    documentId?: string,
    confidence?: number
  ): Promise<{ success: boolean; creditsUsed: number; creditsRemaining: number; message?: string }> {
    const usage = await this.getUserUsage(userId);
    const creditsNeeded = this.getOperationCost(operation, subOperation);

    // Check if user has enough credits
    if (usage.creditsRemaining < creditsNeeded) {
      return {
        success: false,
        creditsUsed: 0,
        creditsRemaining: usage.creditsRemaining,
        message: `Insufficient credits. Need ${creditsNeeded}, have ${usage.creditsRemaining}`
      };
    }

    // Consume credits
    const credit: AICredit = {
      id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      operation: operation as any,
      creditsUsed: creditsNeeded,
      timestamp: new Date(),
      documentId,
      confidence,
      planType: usage.planType
    };

    usage.creditsUsed += creditsNeeded;
    usage.creditsRemaining -= creditsNeeded;
    usage.operations.push(credit);

    // Update cache and persist
    this.usageCache.set(userId, usage);
    await this.persistUsage(usage);

    return {
      success: true,
      creditsUsed: creditsNeeded,
      creditsRemaining: usage.creditsRemaining
    };
  }

  private getOperationCost(operation: string, subOperation: string): number {
    const operationCosts = this.CREDIT_COSTS[operation as keyof typeof this.CREDIT_COSTS];
    if (!operationCosts) return 1;

    if (typeof operationCosts === 'object') {
      return operationCosts[subOperation as keyof typeof operationCosts] || 1;
    }
    return operationCosts;
  }

  async purchaseCredits(userId: string, creditPackage: 'small' | 'medium' | 'large' | 'enterprise'): Promise<{
    success: boolean;
    creditsAdded: number;
    totalCredits: number;
    cost: number;
  }> {
    const packages = {
      small: { credits: 100, cost: 50 },
      medium: { credits: 500, cost: 200 },
      large: { credits: 2000, cost: 750 },
      enterprise: { credits: 10000, cost: 3000 }
    };

    const selectedPackage = packages[creditPackage];
    const usage = await this.getUserUsage(userId);

    // Add credits
    usage.creditsRemaining += selectedPackage.credits;

    // Update cache and persist
    this.usageCache.set(userId, usage);
    await this.persistUsage(usage);

    return {
      success: true,
      creditsAdded: selectedPackage.credits,
      totalCredits: usage.creditsRemaining,
      cost: selectedPackage.cost
    };
  }

  async getUsageAnalytics(userId: string, timeRange: '24h' | '7d' | '30d' | '90d' = '30d'): Promise<{
    totalOperations: number;
    totalCreditsUsed: number;
    operationBreakdown: Record<string, number>;
    averageConfidence: number;
    costSavings: number;
    recommendations: string[];
  }> {
    const usage = await this.getUserUsage(userId);
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
    }

    const filteredOperations = usage.operations.filter(op => op.timestamp >= startDate);
    
    const operationBreakdown: Record<string, number> = {};
    let totalCreditsUsed = 0;
    let totalConfidence = 0;
    let confidenceCount = 0;

    filteredOperations.forEach(op => {
      operationBreakdown[op.operation] = (operationBreakdown[op.operation] || 0) + op.creditsUsed;
      totalCreditsUsed += op.creditsUsed;
      if (op.confidence) {
        totalConfidence += op.confidence;
        confidenceCount++;
      }
    });

    const averageConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0;
    const costSavings = this.calculateCostSavings(usage.planType, totalCreditsUsed);
    const recommendations = this.generateRecommendations(operationBreakdown, usage.planType);

    return {
      totalOperations: filteredOperations.length,
      totalCreditsUsed,
      operationBreakdown,
      averageConfidence,
      costSavings,
      recommendations
    };
  }

  private calculateCostSavings(planType: string, creditsUsed: number): number {
    // Calculate how much user would pay with pay-per-use vs subscription
    const payPerUseCost = creditsUsed * 0.10; // $0.10 per credit
    const plan = PRICING_PLANS[planType as keyof typeof PRICING_PLANS];
    const subscriptionCost = typeof plan?.price === 'number' ? plan.price : 0;
    
    return Math.max(0, payPerUseCost - subscriptionCost);
  }

  private generateRecommendations(operationBreakdown: Record<string, number>, planType: string): string[] {
    const recommendations: string[] = [];
    const totalCredits = Object.values(operationBreakdown).reduce((sum, credits) => sum + credits, 0);

    // High usage recommendations
    if (totalCredits > 1000) {
      recommendations.push('Consider upgrading to a higher tier for unlimited AI processing');
    }

    // Operation-specific recommendations
    if (operationBreakdown.fraud_detection > 100) {
      recommendations.push('High fraud detection usage - consider the Financial AI Package for specialized models');
    }

    if (operationBreakdown.classification > 200) {
      recommendations.push('Frequent document classification - custom model training could improve accuracy');
    }

    if (operationBreakdown.ocr > 300) {
      recommendations.push('Heavy OCR usage detected - batch processing could reduce costs');
    }

    return recommendations;
  }

  private async fetchUserUsage(userId: string): Promise<AIUsage> {
    try {
      // Try to fetch from API first
      const response = await fetch(`/api/ai/usage/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to fetch usage from API, using localStorage fallback');
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(`ai_usage_${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        resetDate: new Date(parsed.resetDate),
        operations: parsed.operations.map((op: any) => ({
          ...op,
          timestamp: new Date(op.timestamp)
        }))
      };
    }

    // Create new usage record
    const plan = PRICING_PLANS.free;
    return {
      userId,
      planType: 'free',
      creditsRemaining: (plan?.limits as any)?.aiCredits || 0,
      creditsUsed: 0,
      monthlyLimit: (plan?.limits as any)?.aiCredits || 0,
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      operations: []
    };
  }

  private async persistUsage(usage: AIUsage): Promise<void> {
    try {
      // Try to persist to API first
      await fetch(`/api/ai/usage/${usage.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(usage)
      });
    } catch (error) {
      console.warn('Failed to persist usage to API, using localStorage fallback');
    }

    // Always persist to localStorage as backup
    localStorage.setItem(`ai_usage_${usage.userId}`, JSON.stringify(usage));
  }

  async resetMonthlyUsage(userId: string): Promise<void> {
    const usage = await this.getUserUsage(userId);
    const plan = PRICING_PLANS[usage.planType as keyof typeof PRICING_PLANS];
    
    usage.creditsUsed = 0;
    usage.creditsRemaining = ((plan as any)?.limits as any)?.aiCredits || 0;
    usage.resetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    usage.operations = [];

    this.usageCache.set(userId, usage);
    await this.persistUsage(usage);
  }

  // Check if user can perform operation
  async canPerformOperation(userId: string, operation: string, subOperation: string = 'basic'): Promise<{
    canPerform: boolean;
    creditsNeeded: number;
    creditsAvailable: number;
    upgradeRequired?: boolean;
  }> {
    const usage = await this.getUserUsage(userId);
    const creditsNeeded = this.getOperationCost(operation, subOperation);
    const plan = PRICING_PLANS[usage.planType as keyof typeof PRICING_PLANS];

    // Check if plan supports AI features
    if (!((plan as any)?.limits as any)?.aiFeatures) {
      return {
        canPerform: false,
        creditsNeeded,
        creditsAvailable: usage.creditsRemaining,
        upgradeRequired: true
      };
    }

    return {
      canPerform: usage.creditsRemaining >= creditsNeeded,
      creditsNeeded,
      creditsAvailable: usage.creditsRemaining
    };
  }
}

export const aiCreditsManager = AICreditsManager.getInstance(); 