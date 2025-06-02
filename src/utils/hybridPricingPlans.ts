/**
 * Hybrid Architecture Pricing Plans
 * Revolutionary mode-based pricing that reflects the billion-dollar hybrid architecture value
 */

export interface HybridPricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  originalPrice?: {
    monthly: number;
    annual: number;
  };
  modes: {
    privacy: boolean;
    collaboration: boolean;
    switching: boolean;
  };
  features: string[];
  limitations?: string[];
  compliance: string[];
  targetAudience: string;
  useCases: string[];
  color: string;
  badge?: string;
  popular?: boolean;
  stripePriceId: {
    monthly: string;
    annual: string;
  };
  icon: string;
  trustScore: number; // 1-100
  securityLevel: 'maximum' | 'high' | 'standard';
}

export const HYBRID_PRICING_PLANS: Record<string, HybridPricingPlan> = {
  privacy_only: {
    id: 'privacy_only',
    name: 'Privacy Only',
    description: 'Perfect for maximum confidentiality - your data never leaves your device',
    price: {
      monthly: 99,
      annual: 990 // 17% discount
    },
    originalPrice: {
      monthly: 149,
      annual: 1490
    },
    modes: {
      privacy: true,
      collaboration: false,
      switching: false
    },
    features: [
      '100% client-side processing',
      'Zero server communication',
      'Unlimited document analysis',
      'Professional PDF reports',
      'Advanced metadata extraction',
      'Offline capability',
      'Local encrypted storage',
      'Priority email support'
    ],
    compliance: [
      'Perfect GDPR compliance (no data transfer)',
      'Perfect HIPAA compliance (no PHI transmission)',
      'Attorney-client privilege protection',
      'Government security standards',
      'Air-gapped processing'
    ],
    targetAudience: 'Healthcare, Legal, Government, High-security enterprises',
    useCases: [
      'Medical records processing',
      'Legal document analysis',
      'Classified document handling',
      'Personal sensitive documents',
      'Compliance-critical workflows'
    ],
    color: 'green',
    stripePriceId: {
      monthly: 'price_privacy_only_monthly',
      annual: 'price_privacy_only_annual'
    },
    icon: 'shield',
    trustScore: 100,
    securityLevel: 'maximum'
  },

  collaboration_only: {
    id: 'collaboration_only',
    name: 'Collaboration Only',
    description: 'Secure team collaboration with ephemeral processing and auto-deletion',
    price: {
      monthly: 199,
      annual: 1990 // 17% discount
    },
    originalPrice: {
      monthly: 299,
      annual: 2990
    },
    modes: {
      privacy: false,
      collaboration: true,
      switching: false
    },
    features: [
      'Ephemeral server processing',
      'AES-256 encrypted transmission',
      '24-hour auto-deletion',
      'Team collaboration (up to 10 users)',
      'Real-time document sharing',
      'Full audit trails',
      'API access',
      'Priority phone support'
    ],
    compliance: [
      'GDPR compliant (ephemeral processing)',
      'SOX audit trail requirements',
      'PCI-DSS encrypted transmission',
      'Enterprise security standards',
      'Automatic data deletion'
    ],
    targetAudience: 'Financial services, Enterprise teams, Audit firms',
    useCases: [
      'Financial document processing',
      'Team document workflows',
      'Audit trail requirements',
      'Collaborative analysis',
      'Enterprise integrations'
    ],
    color: 'blue',
    stripePriceId: {
      monthly: 'price_collaboration_only_monthly',
      annual: 'price_collaboration_only_annual'
    },
    icon: 'users',
    trustScore: 85,
    securityLevel: 'high'
  },

  hybrid_access: {
    id: 'hybrid_access',
    name: 'Hybrid Access',
    description: 'Ultimate flexibility - switch between privacy and collaboration modes in real-time',
    price: {
      monthly: 299,
      annual: 2990 // 17% discount
    },
    originalPrice: {
      monthly: 499,
      annual: 4990
    },
    modes: {
      privacy: true,
      collaboration: true,
      switching: true
    },
    features: [
      'Real-time mode switching',
      'All Privacy Mode features',
      'All Collaboration Mode features',
      'Advanced user controls',
      'Compliance dashboard',
      'Custom security policies',
      'Unlimited team members',
      'Dedicated account manager'
    ],
    compliance: [
      'All compliance standards supported',
      'Mode-specific compliance reporting',
      'Flexible regulatory adherence',
      'Custom compliance workflows',
      'Multi-jurisdiction support'
    ],
    targetAudience: 'Multi-national enterprises, Consulting firms, Hybrid organizations',
    useCases: [
      'Multi-regulatory environments',
      'Client-specific security requirements',
      'Flexible team workflows',
      'Consulting engagements',
      'Enterprise adaptability'
    ],
    color: 'purple',
    badge: 'Most Popular',
    popular: true,
    stripePriceId: {
      monthly: 'price_hybrid_access_monthly',
      annual: 'price_hybrid_access_annual'
    },
    icon: 'crown',
    trustScore: 95,
    securityLevel: 'maximum'
  },

  enterprise_hybrid: {
    id: 'enterprise_hybrid',
    name: 'Enterprise Hybrid',
    description: 'Custom hybrid architecture with dedicated infrastructure and unlimited scale',
    price: {
      monthly: 999,
      annual: 9990 // 17% discount
    },
    modes: {
      privacy: true,
      collaboration: true,
      switching: true
    },
    features: [
      'Custom hybrid architecture',
      'Dedicated infrastructure',
      'Unlimited users and processing',
      'White-label capabilities',
      'Custom integrations',
      'On-premise deployment options',
      'SLA guarantees',
      '24/7 dedicated support'
    ],
    compliance: [
      'Custom compliance frameworks',
      'Regulatory consulting included',
      'Certification assistance',
      'Audit support',
      'Legal documentation'
    ],
    targetAudience: 'Fortune 500, Government agencies, Large enterprises',
    useCases: [
      'Enterprise-wide deployment',
      'Custom security requirements',
      'Regulatory consulting needs',
      'White-label solutions',
      'Mission-critical workflows'
    ],
    color: 'gold',
    badge: 'Enterprise',
    stripePriceId: {
      monthly: 'price_enterprise_hybrid_monthly',
      annual: 'price_enterprise_hybrid_annual'
    },
    icon: 'building',
    trustScore: 100,
    securityLevel: 'maximum'
  }
};

// Add-on packages for hybrid architecture
export interface HybridAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'one-time';
  compatiblePlans: string[];
  features: string[];
}

export const HYBRID_ADD_ONS: Record<string, HybridAddOn> = {
  compliance_consulting: {
    id: 'compliance_consulting',
    name: 'Compliance Consulting',
    description: 'Expert guidance on regulatory requirements and mode selection',
    price: 2500,
    interval: 'one-time',
    compatiblePlans: ['hybrid_access', 'enterprise_hybrid'],
    features: [
      'Regulatory assessment',
      'Mode recommendation analysis',
      'Compliance documentation',
      'Implementation guidance',
      '3 months of support'
    ]
  },

  custom_integration: {
    id: 'custom_integration',
    name: 'Custom Integration',
    description: 'Integrate hybrid architecture with your existing systems',
    price: 5000,
    interval: 'one-time',
    compatiblePlans: ['collaboration_only', 'hybrid_access', 'enterprise_hybrid'],
    features: [
      'API development',
      'System integration',
      'Mode-aware workflows',
      'Testing and validation',
      '6 months of support'
    ]
  },

  advanced_analytics: {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Deep insights into mode usage and security metrics',
    price: 199,
    interval: 'monthly',
    compatiblePlans: ['hybrid_access', 'enterprise_hybrid'],
    features: [
      'Mode usage analytics',
      'Security metrics dashboard',
      'Compliance reporting',
      'Performance optimization',
      'Custom reports'
    ]
  }
};

// Utility functions
export const getHybridPlanById = (planId: string): HybridPricingPlan | null => {
  return HYBRID_PRICING_PLANS[planId] || null;
};

export const getHybridPlansByMode = (mode: 'privacy' | 'collaboration' | 'switching'): HybridPricingPlan[] => {
  return Object.values(HYBRID_PRICING_PLANS).filter(plan => {
    if (mode === 'switching') return plan.modes.switching;
    return plan.modes[mode];
  });
};

export const calculateHybridSavings = (plan: HybridPricingPlan, billingCycle: 'monthly' | 'annual'): number => {
  if (!plan.originalPrice) return 0;
  const original = plan.originalPrice[billingCycle];
  const current = plan.price[billingCycle];
  return Math.round(((original - current) / original) * 100);
};

export const getRecommendedPlan = (requirements: {
  needsPrivacy: boolean;
  needsCollaboration: boolean;
  teamSize: number;
  complianceLevel: 'basic' | 'advanced' | 'enterprise';
}): string => {
  const { needsPrivacy, needsCollaboration, teamSize, complianceLevel } = requirements;

  if (complianceLevel === 'enterprise' || teamSize > 50) {
    return 'enterprise_hybrid';
  }

  if (needsPrivacy && needsCollaboration) {
    return 'hybrid_access';
  }

  if (needsPrivacy && !needsCollaboration) {
    return 'privacy_only';
  }

  if (!needsPrivacy && needsCollaboration) {
    return 'collaboration_only';
  }

  // Default recommendation
  return 'hybrid_access';
};

export const formatHybridPrice = (price: number): string => {
  if (price === 0) return 'Free';
  if (price >= 1000) return `$${(price / 1000).toFixed(1)}k`;
  return `$${price}`;
};

// Trust score calculation based on mode capabilities
export const calculateTrustScore = (plan: HybridPricingPlan): number => {
  let score = 50; // Base score

  if (plan.modes.privacy) score += 30; // Privacy mode adds significant trust
  if (plan.modes.collaboration) score += 15; // Collaboration adds some trust
  if (plan.modes.switching) score += 20; // Flexibility adds trust
  if (plan.securityLevel === 'maximum') score += 10;

  return Math.min(score, 100);
};

// Compliance score for different industries
export const getComplianceScore = (plan: HybridPricingPlan, industry: string): number => {
  const industryRequirements = {
    healthcare: ['HIPAA', 'privacy'],
    finance: ['SOX', 'PCI-DSS', 'audit'],
    legal: ['attorney-client', 'privacy'],
    government: ['FedRAMP', 'FISMA', 'privacy'],
    enterprise: ['GDPR', 'flexibility']
  };

  const requirements = industryRequirements[industry as keyof typeof industryRequirements] || [];
  const planCompliance = plan.compliance.join(' ').toLowerCase();
  
  let score = 0;
  requirements.forEach(req => {
    if (planCompliance.includes(req.toLowerCase())) {
      score += 20;
    }
  });

  return Math.min(score, 100);
}; 