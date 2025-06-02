// CMO's Unified "Privacy-First Hybrid" Pricing Strategy
// Every tier includes BOTH Privacy and Collaboration modes

export interface UnifiedPricingTier {
  id: string;
  name: string;
  description: string;
  price: { monthly: number; annual: number };
  originalPrice?: { monthly: number; annual: number };
  features: string[];
  privacyFeatures: string[];
  collaborationFeatures: string[];
  aiCredits: number;
  teamMembers: number | 'unlimited';
  apiCalls: number | 'unlimited';
  industryAI: number | 'all';
  popular?: boolean;
  badge?: string;
  color: string;
}

export interface SessionPass {
  id: string;
  name: string;
  duration: string;
  price: number;
  features: string[];
  badge?: string;
  color: string;
}

export interface AIAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  industry: string;
  color: string;
}

export interface AITrainingPackage {
  id: string;
  name: string;
  price: number;
  samples: number | 'unlimited';
  description: string;
  features: string[];
}

export interface AICreditsPackage {
  id: string;
  credits: number;
  price: number;
  description: string;
}

// FREE TIER (Lead Generation)
export const freeTier = {
  id: 'free',
  name: 'Free',
  description: 'Try ProofPix risk-free',
  price: { monthly: 0, annual: 0 },
  features: [
    '5 images per session',
    'Privacy Mode ONLY',
    'Basic metadata extraction',
    'Community support'
  ],
  privacyFeatures: ['Local processing only'],
  collaborationFeatures: ['None - upgrade for team features'],
  aiCredits: 0,
  teamMembers: 1,
  apiCalls: 0,
  industryAI: 0,
  color: 'gray'
};

// MAIN SUBSCRIPTION TIERS
export const unifiedPricingTiers: UnifiedPricingTier[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Perfect for professionals and small teams',
    price: { monthly: 99, annual: 950 }, // 20% annual discount
    originalPrice: { monthly: 149, annual: 1788 },
    features: [
      'Unlimited local processing',
      '5 team members included',
      '100 AI credits/month',
      'Core AI features (OCR, classification)',
      'Professional PDF reports',
      'Email support',
      'API access (1K calls/month)'
    ],
    privacyFeatures: [
      'Unlimited local processing',
      'Zero data transmission',
      'Client-side AI analysis',
      'Local report generation'
    ],
    collaborationFeatures: [
      '5 team members',
      'Shared workspaces',
      'Team analytics',
      'Collaborative reporting'
    ],
    aiCredits: 100,
    teamMembers: 5,
    apiCalls: 1000,
    industryAI: 0,
    color: 'blue'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Most popular for growing businesses',
    price: { monthly: 299, annual: 2870 }, // 20% annual discount
    originalPrice: { monthly: 499, annual: 5988 },
    features: [
      'Advanced local AI processing',
      '25 team members included',
      '500 AI credits/month',
      'Industry AI models (choose 1)',
      'Advanced analytics dashboard',
      'Priority support',
      'API access (10K calls/month)',
      'Custom integrations'
    ],
    privacyFeatures: [
      'Advanced local AI',
      'Enhanced privacy controls',
      'Local white-labeling',
      'Advanced local analytics'
    ],
    collaborationFeatures: [
      '25 team members',
      'Advanced team management',
      'Real-time collaboration',
      'Team performance analytics',
      'Shared AI models'
    ],
    aiCredits: 500,
    teamMembers: 25,
    apiCalls: 10000,
    industryAI: 1,
    popular: true,
    badge: 'Most Popular',
    color: 'purple'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complete platform control',
    price: { monthly: 999, annual: 9590 }, // 20% annual discount
    originalPrice: { monthly: 1999, annual: 23988 },
    features: [
      'Full white-label capabilities',
      'Unlimited team members',
      '2000 AI credits/month',
      'All industry AI models',
      'Unlimited API access',
      'Dedicated account manager',
      'Advanced security features',
      'SLA guarantees'
    ],
    privacyFeatures: [
      'Full white-label privacy mode',
      'Custom privacy controls',
      'On-premise deployment',
      'Advanced audit trails'
    ],
    collaborationFeatures: [
      'Unlimited team members',
      'Enterprise team management',
      'Advanced collaboration tools',
      'Enterprise analytics',
      'Custom workflows'
    ],
    aiCredits: 2000,
    teamMembers: 'unlimited',
    apiCalls: 'unlimited',
    industryAI: 'all',
    color: 'emerald'
  }
];

// CUSTOM ENTERPRISE
export const customEnterprise = {
  id: 'custom',
  name: 'Custom Enterprise',
  description: 'Tailored solutions for large organizations',
  price: 'Contact Sales',
  startingPrice: 2999,
  features: [
    'Everything in Enterprise',
    'On-premise deployment',
    'Custom AI training',
    'Dedicated infrastructure',
    'Custom compliance frameworks',
    'White-glove onboarding'
  ]
};

// SESSION PASSES (Simplified)
export const sessionPasses: SessionPass[] = [
  {
    id: 'day',
    name: 'Day Pass',
    duration: '24 hours',
    price: 2.99,
    features: [
      'Unlimited processing for 24 hours',
      'Privacy mode only',
      'Basic reports',
      'Email support'
    ],
    badge: 'Entry Drug',
    color: 'blue'
  },
  {
    id: 'week',
    name: 'Week Pass',
    duration: '7 days',
    price: 9.99,
    features: [
      'Unlimited processing for 7 days',
      'Privacy + basic collaboration',
      'Advanced reports',
      'Priority support'
    ],
    badge: 'Trial Period',
    color: 'green'
  },
  {
    id: 'month',
    name: 'Month Pass',
    duration: '30 days',
    price: 49.99,
    features: [
      'Unlimited processing for 30 days',
      'Full privacy + collaboration modes',
      'All report types',
      'Phone support'
    ],
    badge: 'Decision Time',
    color: 'purple'
  }
];

// AI ADD-ONS (Pure Profit)
export const aiAddons: AIAddon[] = [
  {
    id: 'legal-ai',
    name: 'Legal AI Package',
    price: 999,
    description: 'Contract analysis & evidence processing',
    features: [
      'Contract analysis & clause extraction',
      'Legal document classification',
      'Redaction & privacy protection',
      'Citation & reference validation',
      'Chain of custody documentation'
    ],
    industry: 'Legal',
    color: 'blue'
  },
  {
    id: 'healthcare-ai',
    name: 'Healthcare AI Package',
    price: 1499,
    description: 'HIPAA-compliant medical processing',
    features: [
      'Medical records classification',
      'HIPAA compliance automation',
      'PHI detection & protection',
      'EHR integration & routing',
      'Medical audit trail generation'
    ],
    industry: 'Healthcare',
    color: 'green'
  },
  {
    id: 'financial-ai',
    name: 'Financial AI Package',
    price: 1999,
    description: 'SOX compliance & audit automation',
    features: [
      'Financial document analysis',
      'SOX compliance automation',
      'Fraud detection & prevention',
      'Audit trail & reporting',
      'Regulatory compliance monitoring'
    ],
    industry: 'Financial',
    color: 'purple'
  },
  {
    id: 'insurance-ai',
    name: 'Insurance AI Package',
    price: 999,
    description: 'Claims processing & fraud detection',
    features: [
      'Claims document analysis',
      'Fraud detection algorithms',
      'Risk assessment automation',
      'Claims workflow integration',
      'Automated reporting'
    ],
    industry: 'Insurance',
    color: 'orange'
  }
];

// AI TRAINING PACKAGES (One-time)
export const aiTrainingPackages: AITrainingPackage[] = [
  {
    id: 'basic',
    name: 'Basic AI Training',
    price: 999,
    samples: 1000,
    description: 'Custom AI model training with 1K samples',
    features: [
      '1,000 training samples',
      'Basic model customization',
      'Standard accuracy optimization',
      'Email support during training'
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced AI Training',
    price: 2999,
    samples: 10000,
    description: 'Advanced AI model training with 10K samples',
    features: [
      '10,000 training samples',
      'Advanced model customization',
      'High accuracy optimization',
      'Priority support during training',
      'Custom validation metrics'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise AI Training',
    price: 9999,
    samples: 'unlimited',
    description: 'Unlimited AI model training',
    features: [
      'Unlimited training samples',
      'Full model customization',
      'Maximum accuracy optimization',
      'Dedicated AI engineer support',
      'Custom metrics & validation',
      'Ongoing model updates'
    ]
  }
];

// AI CREDITS (Consumption-based)
export const aiCreditsPackages: AICreditsPackage[] = [
  {
    id: 'small',
    credits: 100,
    price: 49,
    description: 'Perfect for occasional AI processing'
  },
  {
    id: 'medium',
    credits: 500,
    price: 199,
    description: 'Great for regular AI usage'
  },
  {
    id: 'large',
    credits: 2000,
    price: 599,
    description: 'Ideal for heavy AI processing'
  }
];

// REVENUE PROJECTIONS
export const revenueProjections = {
  conservative: {
    totalCustomers: 1000,
    distribution: {
      professional: { percentage: 40, customers: 400, mrr: 39600 },
      business: { percentage: 40, customers: 400, mrr: 119600 },
      enterprise: { percentage: 15, customers: 150, mrr: 149850 },
      custom: { percentage: 5, customers: 50, mrr: 149950 }
    },
    baseMRR: 459000,
    addons: {
      industryAI: { attachRate: 0.3, customers: 300, avgPrice: 1299, mrr: 389700 },
      aiCredits: { attachRate: 0.2, customers: 200, avgPrice: 199, mrr: 39800 }
    },
    totalMRR: 888500,
    arr: 10662000
  }
};

// MESSAGING FOCUS
export const messagingFocus = [
  'Privacy Mode included in every plan',
  'Add team collaboration when you need it',
  'AI that respects your privacy',
  'Choose your industry, we\'ll handle compliance'
];

export default {
  freeTier,
  unifiedPricingTiers,
  customEnterprise,
  sessionPasses,
  aiAddons,
  aiTrainingPackages,
  aiCreditsPackages,
  revenueProjections,
  messagingFocus
}; 