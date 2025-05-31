import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Check, 
  X, 
  Star, 
  Shield, 
  Building2, 
  Users, 
  Zap,
  Lock,
  Globe,
  ArrowRight,
  CheckCircle,
  Target,
  Briefcase,
  Code,
  Scale,
  Heart,
  Clock,
  ChevronDown,
  ChevronUp,
  Calculator,
  Phone,
  Mail,
  Award,
  TrendingUp,
  Ticket,
  Calendar,
  CreditCard,
  AlertCircle,
  Timer,
  Sparkles,
  FileImage,
  AlertTriangle,
  Home,
  MapPin,
  Building
} from 'lucide-react';
import { EnterpriseLayout } from './ui/EnterpriseLayout';
import { EnterpriseButton, EnterpriseCard, EnterpriseBadge } from './ui/EnterpriseComponents';
import PlanRecommenderQuiz from './PlanRecommenderQuiz';
import ROICalculatorWidget from './ROICalculatorWidget';
import { pricingAnalytics } from '../utils/analytics';
import { useABTest } from '../utils/abTesting';
import { performanceMonitor, ImageOptimizer } from '../utils/performance';
import EnhancedPlanComparison from './EnhancedPlanComparison';
import CompetitivePricingComparison from './CompetitivePricingComparison';
import PrivacyValueProposition from './PrivacyValueProposition';
import DynamicPricingUpsell from './DynamicPricingUpsell';
import PricingDataVisualization from './PricingDataVisualization';

type UserType = 'general' | 'business' | 'technical' | 'enterprise' | 'industry';
type IndustryType = 'legal' | 'insurance' | 'healthcare' | 'realestate' | 'government';
type ViewType = 'general' | 'industry' | 'enterprise';

interface SessionPass {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  features: string[];
  popular?: boolean;
  badge?: string;
  color: string;
}

interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: { monthly: number; annual: number };
  originalPrice?: { monthly: number; annual: number };
  features: string[];
  limitations?: string[];
  popular?: boolean;
  color: string;
  badge?: string;
}

interface IndustryMultiplier {
  id: IndustryType;
  name: string;
  multiplier: number;
  icon: React.ReactNode;
  features: string[];
  description: string;
  color: string;
}

// Add new types for enhanced pricing features
interface PricingFeature {
  name: string;
  description: string;
  icon: React.ReactNode;
  included: boolean;
  highlight?: boolean;
  tooltip?: string;
}

// Use a new interface instead of extending IndustryMultiplier
interface IndustryPricing {
  id: IndustryType;
  name: string;
  multiplier: number;
  icon: React.ReactNode;
  description: string;
  color: string;
  features: PricingFeature[];
  testimonials: {
    quote: string;
    author: string;
    company: string;
    image?: string;
  }[];
  caseStudies: {
    title: string;
    description: string;
    results: string[];
    link: string;
  }[];
  requirements?: string[];
  complianceInfo?: {
    standards: string[];
    requirements: string[];
    certification?: string;
  };
}

// Define industry pricing data based on the new interface
const industryPricingData: Record<IndustryType, IndustryPricing> = {
  legal: {
    id: 'legal',
    name: 'Legal Services',
    multiplier: 1.5,
    icon: <Scale className="w-6 h-6" />,
    description: 'Specialized features for legal professionals, digital forensics, and evidence management.',
    color: 'blue',
    features: [
      {
        name: 'Chain of Custody',
        description: 'Full documentation of image handling',
        icon: <Lock className="w-5 h-5" />,
        included: true,
        highlight: true
      },
      // ...other features
    ],
    testimonials: [
      {
        quote: 'ProofPix has transformed how we handle digital evidence, ensuring metadata integrity throughout the legal process.',
        author: 'Sarah Chen',
        company: 'Morrison & Associates Law Firm'
      }
    ],
    caseStudies: [
      {
        title: 'Digital Evidence Management',
        description: 'How a major law firm improved metadata verification',
        results: ['56% faster processing', '100% metadata preservation'],
        link: '/case-studies/legal'
      }
    ],
    complianceInfo: {
      standards: ['EDRM', 'FRE 902(14)'],
      requirements: ['Metadata preservation', 'Tamper protection'],
      certification: 'Legal Technology Certification'
    }
  },
  insurance: {
    id: 'insurance',
    name: 'Insurance',
    multiplier: 1.3,
    icon: <Shield className="w-6 h-6" />,
    description: 'Specialized tools for claims processing, fraud detection, and documentation.',
    color: 'green',
    features: [
      {
        name: 'Fraud Detection',
        description: 'Advanced image analysis for fraud prevention',
        icon: <AlertTriangle className="w-5 h-5" />,
        included: true,
        highlight: true
      }
    ],
    testimonials: [
      {
        quote: 'ProofPix has reduced our fraudulent claims by 37% through accurate metadata verification.',
        author: 'Michael Johnson',
        company: 'Global Insurance Group'
      }
    ],
    caseStudies: [
      {
        title: 'Claims Processing Efficiency',
        description: 'How an insurance provider streamlined verification',
        results: ['43% faster claims processing', '37% reduction in fraud'],
        link: '/case-studies/insurance'
      }
    ],
    complianceInfo: {
      standards: ['ACORD', 'ISO 27001'],
      requirements: ['Data integrity', 'Audit trails'],
      certification: 'Insurance Tech Certification'
    }
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    multiplier: 1.6,
    icon: <Heart className="w-6 h-6" />,
    description: 'HIPAA-compliant solutions for medical imaging and documentation.',
    color: 'red',
    features: [
      {
        name: 'HIPAA Compliance',
        description: 'Privacy-focused image processing',
        icon: <Shield className="w-5 h-5" />,
        included: true,
        highlight: true
      }
    ],
    testimonials: [
      {
        quote: 'ProofPix ensures our patient documentation maintains HIPAA compliance while preserving critical metadata.',
        author: 'Dr. Amelia Roberts',
        company: 'Metropolitan Medical Center'
      }
    ],
    caseStudies: [
      {
        title: 'Medical Documentation Integrity',
        description: 'How a hospital improved image data management',
        results: ['100% HIPAA compliance', '62% faster documentation'],
        link: '/case-studies/healthcare'
      }
    ],
    complianceInfo: {
      standards: ['HIPAA', 'HITECH'],
      requirements: ['PHI protection', 'Secure transmission'],
      certification: 'Healthcare Information Security'
    }
  },
  realestate: {
    id: 'realestate',
    name: 'Real Estate',
    multiplier: 1.2,
    icon: <Home className="w-6 h-6" />,
    description: 'Property documentation and verification tools for real estate professionals.',
    color: 'orange',
    features: [
      {
        name: 'Location Verification',
        description: 'GPS metadata validation for property images',
        icon: <MapPin className="w-5 h-5" />,
        included: true,
        highlight: true
      }
    ],
    testimonials: [
      {
        quote: 'ProofPix has become essential for verifying property images and maintaining accurate documentation.',
        author: 'Jennifer Kim',
        company: 'Premier Properties'
      }
    ],
    caseStudies: [
      {
        title: 'Property Documentation',
        description: 'How a real estate agency improved image authenticity',
        results: ['84% faster image processing', '100% verification accuracy'],
        link: '/case-studies/realestate'
      }
    ],
    complianceInfo: {
      standards: ['NAR', 'RESPA'],
      requirements: ['Documentation accuracy', 'Disclosure compliance'],
      certification: 'Real Estate Tech Compliance'
    }
  },
  government: {
    id: 'government',
    name: 'Government',
    multiplier: 1.4,
    icon: <Building className="w-6 h-6" />,
    description: 'Secure image verification and documentation for government agencies.',
    color: 'blue',
    features: [
      {
        name: 'FIPS Compliance',
        description: 'Federal information processing standards',
        icon: <Lock className="w-5 h-5" />,
        included: true,
        highlight: true
      }
    ],
    testimonials: [
      {
        quote: 'ProofPix provides the security and compliance features essential for our verification processes.',
        author: 'Thomas Rivera',
        company: 'Federal Documentation Office'
      }
    ],
    caseStudies: [
      {
        title: 'Government Documentation',
        description: 'How a federal agency improved metadata management',
        results: ['95% security compliance', '73% process improvement'],
        link: '/case-studies/government'
      }
    ],
    complianceInfo: {
      standards: ['FIPS 140-2', 'FISMA'],
      requirements: ['Secure processing', 'Audit capabilities'],
      certification: 'Government Security Certification'
    }
  }
}

export const UnifiedPricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [viewType, setViewType] = useState<ViewType>('general');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(true);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState('session-passes');
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // A/B Testing hooks
  const urgencyBannerTest = useABTest('pricing_urgency_banner');
  const sectionOrderTest = useABTest('pricing_display_order');
  const ctaButtonTest = useABTest('cta_button_text');
  const socialProofTest = useABTest('social_proof_placement');

  // Detect view type and industry from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const view = urlParams.get('view') as ViewType;
    const industry = urlParams.get('industry') as IndustryType;
    
    if (view && ['general', 'industry', 'enterprise'].includes(view)) {
      setViewType(view);
    }
    
    if (industry && ['legal', 'insurance', 'healthcare', 'realestate', 'government'].includes(industry)) {
      setSelectedIndustry(industry);
      setViewType('industry');
    }
  }, [location]);

  useEffect(() => {
    // Track initial page view and context
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    const industry = urlParams.get('industry');
    
    if (view) {
      pricingAnalytics.trackSectionView(`initial_${view}`);
    }
    
    if (industry) {
      pricingAnalytics.trackIndustrySelection(industry);
    }

    // Set up intersection observer for section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionName = entry.target.getAttribute('data-section');
            if (sectionName) {
              pricingAnalytics.trackSectionView(sectionName);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Session Passes - Lead Generation Tools
  const sessionPasses: SessionPass[] = [
    {
      id: 'day',
      name: 'Day Pass',
      duration: '24 hours',
      price: 2.99,
      originalPrice: 9,
      features: [
        'Unlimited photo analysis',
        'Full EXIF metadata extraction',
        'Basic export (PDF, JSON)',
        '100% client-side processing',
        'Email support'
      ],
      color: 'blue',
      badge: 'Perfect for trials'
    },
    {
      id: 'week',
      name: 'Week Pass',
      duration: '7 days',
      price: 9.99,
      originalPrice: 24,
      features: [
        'Everything in Day Pass',
        'Batch processing (up to 50 photos)',
        'Advanced export formats',
        'GPS map integration',
        'Priority support'
      ],
      popular: true,
      color: 'emerald',
      badge: 'Most Popular'
    },
    {
      id: 'month',
      name: 'Month Pass',
      duration: '30 days',
      price: 49.99,
      features: [
        'Everything in Week Pass',
        'Unlimited batch processing',
        'Professional PDF reports',
        'Custom export templates',
        'Phone support'
      ],
      color: 'purple',
      badge: 'Best Value'
    }
  ];

  // Subscription Tiers - Regular Users
  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'individual',
      name: 'Individual',
      description: 'Perfect for freelancers and solo professionals',
      price: { monthly: 19, annual: 190 },
      originalPrice: { monthly: 19, annual: 228 },
      features: [
        'Unlimited photo analysis',
        'Full EXIF metadata extraction',
        'Batch processing (up to 100 photos)',
        'Advanced export formats (PDF, CSV, JSON, XML)',
        'GPS map integration',
        'Professional PDF reports',
        'Email support'
      ],
      color: 'blue'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For working professionals and small teams',
      price: { monthly: 49, annual: 490 },
      originalPrice: { monthly: 49, annual: 588 },
      features: [
        'Everything in Individual',
        'Team management (up to 5 users)',
        'API access (1,000 calls/month)',
        'Metadata removal and editing tools',
        'Custom branding options',
        'Advanced analytics dashboard',
        'Priority email support',
        'Phone support'
      ],
      popular: true,
      color: 'emerald',
      badge: 'Most Popular'
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For growing teams and organizations',
      price: { monthly: 149, annual: 1490 },
      originalPrice: { monthly: 149, annual: 1788 },
      features: [
        'Everything in Professional',
        'Team management (up to 25 users)',
        'API access (10,000 calls/month)',
        'SSO integration',
        'Advanced security controls',
        'Compliance reporting',
        'Business support',
        'Custom integrations'
      ],
      color: 'purple'
    }
  ];

  // Industry Multipliers
  const industryMultipliers: IndustryMultiplier[] = [
    {
      id: 'legal',
      name: 'Legal Professional',
      multiplier: 2.5,
      icon: <Scale className="w-6 h-6" />,
      features: [
        'Forensic-grade metadata analysis',
        'Court-admissible reports',
        'Chain of custody tracking',
        'Legal compliance framework',
        'Expert witness support'
      ],
      description: 'Court-ready documentation and evidence management',
      color: 'blue'
    },
    {
      id: 'insurance',
      name: 'Insurance Claims',
      multiplier: 2.0,
      icon: <Shield className="w-6 h-6" />,
      features: [
        'Advanced fraud detection',
        'Claims verification tools',
        'Risk assessment reports',
        'Integration with claims systems',
        'Automated flagging system'
      ],
      description: 'Claims verification and fraud detection',
      color: 'orange'
    },
    {
      id: 'healthcare',
      name: 'Healthcare Systems',
      multiplier: 2.2,
      icon: <Heart className="w-6 h-6" />,
      features: [
        'HIPAA compliance built-in',
        'Medical imaging support',
        'Patient privacy protection',
        'Audit trail generation',
        'Healthcare-specific workflows'
      ],
      description: 'HIPAA-compliant medical imaging analysis',
      color: 'green'
    },
    {
      id: 'realestate',
      name: 'Real Estate',
      multiplier: 1.5,
      icon: <Building2 className="w-6 h-6" />,
      features: [
        'Property verification tools',
        'Listing authenticity checks',
        'MLS integration ready',
        'Bulk processing capabilities',
        'Market analysis tools'
      ],
      description: 'Property documentation and verification',
      color: 'emerald'
    },
    {
      id: 'government',
      name: 'Government & Security',
      multiplier: 3.0,
      icon: <Lock className="w-6 h-6" />,
      features: [
        'Government-grade security',
        'FedRAMP compliance ready',
        'Advanced audit trails',
        'Multi-level access controls',
        'Classified data handling'
      ],
      description: 'Government and security applications',
      color: 'red'
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: 'What are Session Passes and how do they work?',
      answer: 'Session Passes are perfect for one-time projects or trying ProofPix risk-free. They provide full access to our platform for a specific duration (24 hours, 7 days, or 30 days) at a fraction of subscription cost. Great for testing workflows before committing to a subscription.'
    },
    {
      question: 'How does the $2.99 Day Pass eliminate $4.45M data breach risk?',
      answer: 'Traditional metadata tools upload your photos to servers, creating massive liability. ProofPix processes everything locally in your browser - your photos never leave your device. This architectural approach eliminates data breach risk entirely, protecting you from the average $4.45M cost of a data breach.'
    },
    {
      question: 'Why choose ProofPix over free tools?',
      answer: 'Free tools upload your data to servers, creating massive liability for professionals. ProofPix is the only platform with 100% client-side processing - your photos never leave your device. Plus, we offer forensic-grade accuracy, industry-specific compliance, and professional features that free tools simply cannot provide.'
    },
    {
      question: 'What are Industry Multipliers?',
      answer: 'Industry Multipliers reflect the specialized features, compliance requirements, and value delivered to specific industries. Legal professionals get 2.5x value through court-ready documentation, while healthcare gets 2.2x value through HIPAA compliance and medical imaging support.'
    },
    {
      question: 'Can I upgrade from Session Passes to subscriptions?',
      answer: 'Absolutely! 25% of Session Pass users upgrade to subscriptions within 90 days. You can upgrade anytime and we\'ll credit your Session Pass purchase toward your first subscription payment.'
    },
    {
      question: 'What makes your pricing transparent?',
      answer: 'We show all options upfront - from $2.99 day passes to enterprise solutions. No hidden fees, no surprise charges. Industry multipliers are clearly displayed, and you always know exactly what you\'re paying for and why.'
    }
  ];

  // Get industry-adjusted pricing
  const getIndustryPrice = (basePrice: number, industry?: IndustryType): number => {
    if (!industry) return basePrice;
    const multiplier = industryMultipliers.find(i => i.id === industry)?.multiplier || 1;
    return Math.round(basePrice * multiplier);
  };

  // Handle plan selection
  const handlePlanSelection = (planType: string, planId: string) => {
    switch (planType) {
      case 'session':
        navigate('/enterprise/demo', { state: { plan: planId, type: 'session' } });
        break;
      case 'subscription':
        navigate('/enterprise/demo', { state: { plan: planId, type: 'subscription' } });
        break;
      case 'enterprise':
        navigate('/enterprise', { state: { plan: planId } });
        break;
      default:
        navigate('/enterprise/demo');
    }
  };

  const handleCTAClick = (cta: string, plan: string, position: string) => {
    pricingAnalytics.trackCTAClick(cta, plan, position);
    
    // Track A/B test conversions
    urgencyBannerTest.trackConversion(getPlanValue(plan), { plan, position });
    ctaButtonTest.trackConversion(getPlanValue(plan), { plan, position });
    
    // Handle the actual CTA action
    if (cta === 'get_started' || cta === 'choose_plan') {
      window.location.href = `/checkout?plan=${plan}&source=pricing_${position}`;
    } else if (cta === 'contact_sales') {
      pricingAnalytics.trackConversion(plan, 'enterprise');
      window.location.href = `/contact?plan=${plan}&source=pricing_${position}`;
    }
  };

  const getPlanValue = (plan: string): number => {
    // Session passes are fixed prices
    const sessionValues = {
      'day': 2.99,
      'week': 9.99,
      'month': 49.99,
      'enterprise': 499
    };
    
    if (sessionValues[plan as keyof typeof sessionValues]) {
      return sessionValues[plan as keyof typeof sessionValues];
    }
    
    // Subscription tiers - calculate based on billing cycle
    const subscriptionTier = subscriptionTiers.find(tier => tier.id === plan);
    if (subscriptionTier) {
      return subscriptionTier.price[billingCycle];
    }
    
    // Fallback for any other plans
    return 0;
  };

  const handlePlanHover = (plan: string) => {
    const hoverStart = Date.now();
    
    return () => {
      const duration = Date.now() - hoverStart;
      if (duration > 1000) { // Only track meaningful hovers
        pricingAnalytics.trackPlanHover(plan, duration);
      }
    };
  };

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry as IndustryType);
    pricingAnalytics.trackIndustrySelection(industry);
  };

  const handleBillingCycleChange = (cycle: 'monthly' | 'annual') => {
    setBillingCycle(cycle);
    pricingAnalytics.trackBillingCycleChange(cycle);
  };

  const handleFAQToggle = (question: string, index: number, isExpanding: boolean) => {
    if (isExpanding) {
      pricingAnalytics.trackFAQExpand(question, index);
    }
  };

  // Get A/B test configurations
  const bannerText = urgencyBannerTest.config.bannerText || '🔥 Limited Time: 50% off all plans! Use code SAVE50';
  const sectionOrder = sectionOrderTest.config.sectionOrder || ['sessions', 'subscriptions', 'enterprise'];
  const ctaText = ctaButtonTest.config.ctaText || 'Get Started';
  const trustSignalsConfig = socialProofTest.config;

  // Set urgency banner from A/B test config
  React.useEffect(() => {
    setShowUrgencyBanner(urgencyBannerTest.config.showUrgencyBanner);
  }, [urgencyBannerTest.config.showUrgencyBanner]);

  // Enhanced Trust Signals Bar with A/B testing
  const TrustSignalsBar = () => {
    if (!trustSignalsConfig.trustSignalsTop) return null;
    
    return (
      <div 
        className="bg-slate-800 py-4 border-b border-slate-700"
        ref={(el) => sectionRefs.current['trust-signals'] = el}
        data-section="trust-signals"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-300">
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span>50,000+ Images Verified</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              <span>Enterprise Ready</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced CTA Button with A/B testing
  const CTAButton: React.FC<{
    plan: string;
    position: string;
    className?: string;
    variant?: 'primary' | 'secondary';
  }> = ({ plan, position, className = '', variant = 'primary' }) => {
    const baseClasses = variant === 'primary' 
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    
    return (
      <button
        onClick={() => handleCTAClick('get_started', plan, position)}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${baseClasses} ${className}`}
        onMouseEnter={() => {
          ctaButtonTest.trackEvent('button_hover', undefined, { plan, position });
        }}
      >
        {ctaText}
      </button>
    );
  };

  // Dynamic section rendering based on A/B test
  const renderSections = () => {
    const sectionComponents = {
      sessions: <SessionPassesSection key="sessions" />,
      subscriptions: <SubscriptionsSection key="subscriptions" />,
      enterprise: <EnterpriseSection key="enterprise" />
    };

    return sectionOrder.map((sectionName: string) => sectionComponents[sectionName as keyof typeof sectionComponents]);
  };

  // Enhanced Session Passes Section
  const SessionPassesSection = () => (
    <section 
      className="py-16 bg-slate-800"
      ref={(el) => sectionRefs.current['session-passes'] = el}
      data-section="session-passes"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            🎫 Session Passes - Perfect for Trying ProofPix
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            No commitment required. Perfect for one-time projects or testing our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Day Pass */}
          <div 
            className="bg-slate-700 rounded-xl border-2 border-slate-600 p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
            onMouseEnter={() => {
              const cleanup = handlePlanHover('day');
              sectionOrderTest.trackEvent('plan_hover', undefined, { plan: 'day', section: 'sessions' });
              return cleanup;
            }}
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Day Pass</h3>
              <div className="text-3xl font-bold text-blue-400 mb-4">
                ${getPlanValue('day')}
              </div>
              <p className="text-slate-300 mb-6">24-hour access to all features</p>
              
              <CTAButton plan="day" position="session-passes" />
            </div>
          </div>

          {/* Week Pass */}
          <div 
            className="bg-slate-700 rounded-xl border-2 border-blue-500 p-6 relative hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => {
              const cleanup = handlePlanHover('week');
              sectionOrderTest.trackEvent('plan_hover', undefined, { plan: 'week', section: 'sessions' });
              return cleanup;
            }}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Week Pass</h3>
              <div className="text-3xl font-bold text-blue-400 mb-4">
                ${getPlanValue('week')}
              </div>
              <p className="text-slate-300 mb-6">7-day access to all features</p>
              
              <CTAButton plan="week" position="session-passes" />
            </div>
          </div>

          {/* Month Pass */}
          <div 
            className="bg-slate-700 rounded-xl border-2 border-slate-600 p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
            onMouseEnter={() => {
              const cleanup = handlePlanHover('month');
              sectionOrderTest.trackEvent('plan_hover', undefined, { plan: 'month', section: 'sessions' });
              return cleanup;
            }}
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Month Pass</h3>
              <div className="text-3xl font-bold text-blue-400 mb-4">
                ${getPlanValue('month')}
              </div>
              <p className="text-slate-300 mb-6">30-day access to all features</p>
              
              <CTAButton plan="month" position="session-passes" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Enhanced Subscriptions Section
  const SubscriptionsSection = () => (
    <section 
      className="py-16 bg-slate-900"
      ref={(el) => sectionRefs.current['subscriptions'] = el}
      data-section="subscriptions"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            📊 Subscription Plans - For Regular Users
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Ongoing access with advanced features and priority support.
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mt-8">
            <div className="bg-slate-700 rounded-lg p-1 border border-slate-600">
              <button
                onClick={() => {
                  handleBillingCycleChange('monthly');
                  sectionOrderTest.trackEvent('billing_cycle_change', undefined, { cycle: 'monthly' });
                }}
                className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => {
                  handleBillingCycleChange('annual');
                  sectionOrderTest.trackEvent('billing_cycle_change', undefined, { cycle: 'annual' });
                }}
                className={`px-6 py-2 rounded-md font-semibold transition-colors ${
                  billingCycle === 'annual'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                Annual <span className="text-green-400 text-sm">(Save 20%)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Individual Plan */}
          <div 
            className="bg-slate-700 rounded-xl border-2 border-slate-600 p-8 hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
            onMouseEnter={() => {
              const cleanup = handlePlanHover('individual');
              sectionOrderTest.trackEvent('plan_hover', undefined, { plan: 'individual', section: 'subscriptions' });
              return cleanup;
            }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-slate-100 mb-2">Individual</h3>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                ${getPlanValue('individual')}
                <span className="text-lg text-slate-300">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="text-slate-300 mb-8">Perfect for personal use and small projects</p>
              
              <CTAButton plan="individual" position="subscriptions" />
            </div>
          </div>

          {/* Professional Plan */}
          <div 
            className="bg-slate-700 rounded-xl border-2 border-purple-500 p-8 relative hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => {
              const cleanup = handlePlanHover('professional');
              sectionOrderTest.trackEvent('plan_hover', undefined, { plan: 'professional', section: 'subscriptions' });
              return cleanup;
            }}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                ⭐ Most Popular
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-slate-100 mb-2">Professional</h3>
              <div className="text-4xl font-bold text-purple-400 mb-4">
                ${getPlanValue('professional')}
                <span className="text-lg text-slate-300">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="text-slate-300 mb-8">Advanced features for professionals</p>
              
              <CTAButton plan="professional" position="subscriptions" />
            </div>
          </div>

          {/* Business Plan */}
          <div 
            className="bg-slate-700 rounded-xl border-2 border-slate-600 p-8 hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
            onMouseEnter={() => {
              const cleanup = handlePlanHover('business');
              sectionOrderTest.trackEvent('plan_hover', undefined, { plan: 'business', section: 'subscriptions' });
              return cleanup;
            }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-slate-100 mb-2">Business</h3>
              <div className="text-4xl font-bold text-blue-400 mb-4">
                ${getPlanValue('business')}
                <span className="text-lg text-slate-300">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="text-slate-300 mb-8">Team collaboration and advanced analytics</p>
              
              <CTAButton plan="business" position="subscriptions" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Enhanced Enterprise Section
  const EnterpriseSection = () => (
    <section 
      className="py-16 bg-gradient-to-br from-purple-900 to-blue-900 text-white"
      ref={(el) => sectionRefs.current['enterprise'] = el}
      data-section="enterprise"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            🏢 Enterprise Solutions
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Custom solutions for large organizations with specific requirements.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Enterprise Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Custom deployment options
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Dedicated support team
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    SLA guarantees
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Custom integrations
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold mb-4">Custom Pricing</div>
                <p className="text-purple-100 mb-6">
                  Starting at $499/month for enterprise features
                </p>
                
                <button
                  onClick={() => {
                    handleCTAClick('contact_sales', 'enterprise', 'enterprise');
                    socialProofTest.trackEvent('enterprise_contact', undefined, { source: 'enterprise_section' });
                  }}
                  className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Industry Multipliers Section
  const IndustryMultipliersSection = () => (
    <section className="py-16 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            Industry-Specific Solutions
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Specialized features and pricing for different industries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industryMultipliers.map((industry) => (
            <div key={industry.id} className="bg-slate-700 rounded-lg p-6 shadow-sm border border-slate-600 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-${industry.color}-900 rounded-lg flex items-center justify-center mr-4`}>
                  <span className={`text-${industry.color}-400`}>{industry.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-100">{industry.name}</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">{industry.description}</p>
              <div className="space-y-2">
                {industry.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <span className="text-green-400 mr-2">✓</span>
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Interactive Tools Section
  const InteractiveToolsSection = () => (
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            Interactive Tools
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Try our tools to see the value ProofPix can bring to your workflow.
          </p>
        </div>
        
        {/* Visualization Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center">
            Cost & ROI Visualization
          </h3>
          <PricingDataVisualization 
            visualizationType="savings"
            className="mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PricingDataVisualization
              visualizationType="bar"
              compactMode={true}
            />
            <PricingDataVisualization
              visualizationType="radar" 
              compactMode={true}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-700 rounded-lg p-8 text-center border border-slate-600">
            <div className="w-16 h-16 bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-4">ROI Calculator</h3>
            <p className="text-slate-300 mb-6">
              Calculate potential savings and return on investment for your organization.
            </p>
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                const element = document.getElementById('roi-calculator');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Calculate ROI
            </button>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-8 text-center border border-slate-600">
            <div className="w-16 h-16 bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-4">Find Your Perfect Plan</h3>
            <p className="text-slate-300 mb-6">
              Use our interactive quiz to get a personalized recommendation.
            </p>
            <button 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => {
                const element = document.getElementById('plan-recommender');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Take Plan Quiz
            </button>
          </div>
        </div>
        
        {/* Sections for new components */}
        <div id="roi-calculator" className="mb-16 scroll-mt-24">
          <ROICalculatorWidget />
        </div>
        
        <div id="plan-recommender" className="mb-16 scroll-mt-24">
          <PlanRecommenderQuiz />
        </div>
        
        <div className="mb-16">
          <EnhancedPlanComparison />
        </div>
        
        <div className="mb-16">
          <CompetitivePricingComparison />
        </div>
        
        <div className="mb-16">
          <PrivacyValueProposition />
        </div>
      </div>
    </section>
  );

  // FAQ Section
  const FAQSection = () => (
    <section className="py-16 bg-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-300">
            Get answers to common questions about ProofPix pricing and features.
          </p>
        </div>
        
        <div className="space-y-6">
          {[
            {
              question: "What's included in the free trial?",
              answer: "The free trial includes access to all core features for 14 days, with a limit of 100 image analyses."
            },
            {
              question: "Can I change my plan anytime?",
              answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
            },
            {
              question: "Is there a setup fee for enterprise plans?",
              answer: "Enterprise plans may include a one-time setup fee depending on customization requirements."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards, PayPal, and wire transfers for enterprise customers."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-slate-700 rounded-lg p-6 shadow-sm border border-slate-600">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Add new sections for industry-specific pricing
  const IndustryPricingSection = () => {
    return (
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Industry-Specific Solutions
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Tailored features and compliance for your industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.values(industryPricingData).map((industry) => (
              <div key={industry.id} className="bg-slate-700 rounded-xl shadow-sm p-8 border border-slate-600">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-${industry.color}-900 rounded-lg flex items-center justify-center mr-4`}>
                    <span className={`text-${industry.color}-400`}>{industry.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">{industry.name}</h3>
                    <p className="text-slate-300">{industry.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-100 mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {industry.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-400 mr-3">✓</span>
                          <span className="text-slate-300">{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-100 mb-3">Pricing</h4>
                    <div className="bg-slate-600 rounded-lg p-4 border border-slate-500">
                      <div className="text-2xl font-bold text-slate-100">
                        {industry.multiplier}x
                      </div>
                      <p className="text-slate-300">Industry multiplier on base pricing</p>
                    </div>
                  </div>

                  <EnterpriseButton
                    className={`w-full bg-${industry.color}-600 hover:bg-${industry.color}-700 text-white`}
                    onClick={() => handleIndustryChange(industry.id)}
                  >
                    Learn More
                  </EnterpriseButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <EnterpriseLayout
      showHero
      title="Choose Your ProofPix Plan"
      description="From quick session passes to enterprise solutions, find the perfect plan for your image verification needs."
      maxWidth="7xl"
    >
      <TrustSignalsBar />
      
      {showUrgencyBanner && (
        <div 
          className="bg-red-600 text-white py-2 px-4 text-center"
          onClick={() => {
            urgencyBannerTest.trackEvent('banner_click');
          }}
        >
          <span className="font-semibold">{bannerText}</span>
        </div>
      )}

      {/* Hero Section */}
      <section 
        className="py-20 bg-gradient-to-br from-slate-800 to-slate-900"
        ref={(el) => sectionRefs.current['hero'] = el}
        data-section="hero"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-6">
            Choose Your ProofPix Plan
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            From quick session passes to enterprise solutions, find the perfect plan for your image verification needs.
          </p>
          
          {trustSignalsConfig.testimonialPlacement === 'integrated' && (
            <div className="bg-slate-700 rounded-lg p-6 max-w-2xl mx-auto shadow-sm border border-slate-600">
              <p className="text-slate-300 italic mb-4">
                "ProofPix has revolutionized our image verification process. The accuracy and speed are unmatched."
              </p>
              <div className="text-sm text-slate-400">
                — Sarah Johnson, Legal Tech Director
              </div>
            </div>
          )}
        </div>
      </section>

      {renderSections()}
      
      <IndustryPricingSection />
      
      <InteractiveToolsSection />
      <FAQSection />

      {/* Final CTA */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of professionals who trust ProofPix for their image verification needs.</p>
          <CTAButton plan="professional" position="final-cta" className="bg-white text-blue-600 hover:bg-gray-100" />
        </div>
      </section>

      {/* Bottom Trust Signals */}
      {trustSignalsConfig.trustSignalsBottom && (
        <div className="bg-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-300">
              <div>🔒 Bank-level Security</div>
              <div>⚡ 99.9% Uptime SLA</div>
              <div>🏆 Industry Leading Accuracy</div>
              <div>📞 24/7 Support</div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic pricing upsell */}
      <DynamicPricingUpsell 
        currentPlan="starter" 
        timeThreshold={45}
      />
    </EnterpriseLayout>
  );
};

export default UnifiedPricingPage; 