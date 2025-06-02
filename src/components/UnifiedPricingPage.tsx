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
  Building,
  Crown
} from 'lucide-react';
import { ConsistentLayout } from './ui/ConsistentLayout';
import { EnterpriseButton, EnterpriseCard, EnterpriseBadge } from './ui/EnterpriseComponents';
import { EnhancedCTAButtons } from './ui/EnhancedCTAButtons';
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
import { motion } from 'framer-motion';

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

  // Enhanced session passes with stronger conversion focus
  const sessionPasses: SessionPass[] = [
    {
      id: 'day',
      name: 'Try Risk-Free',
      duration: '24 hours',
      price: 2.99,
      originalPrice: 9,
      features: [
        'Discover what your photos reveal instantly',
        'Complete privacy protection guaranteed',
        'Professional PDF reports included',
        'Zero data exposure risk',
        'Instant expert support via chat'
      ],
      color: 'blue',
      badge: 'Perfect for testing',
      popular: false
    },
    {
      id: 'week',
      name: 'Professional Trial',
      duration: '7 days',
      price: 9.99,
      originalPrice: 24,
      features: [
        'Everything in Try Risk-Free',
        'Analyze up to 100 photos at once',
        'Advanced forensic exports (CSV, JSON)',
        'GPS location mapping & visualization',
        'Priority expert support',
        'Court-ready documentation'
      ],
      popular: true,
      color: 'emerald',
      badge: 'Most Popular - 73% choose this'
    },
    {
      id: 'month',
      name: 'Business Evaluation',
      duration: '30 days',
      price: 49.99,
      features: [
        'Everything in Professional Trial',
        'Unlimited batch processing',
        'Custom report templates',
        'Team collaboration features',
        'Direct phone support',
        'Enterprise security preview'
      ],
      color: 'purple',
      badge: 'Best Value - Save $120'
    }
  ];

  // Enhanced subscription tiers with stronger value props
  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'individual',
      name: 'Individual Pro',
      description: 'Perfect for professionals who can\'t risk data breaches',
      price: { monthly: 19, annual: Math.round(19 * 12 * 0.8) },
      originalPrice: { monthly: 29, annual: 348 },
      features: [
        'Analyze unlimited photos privately',
        'Extract hidden metadata instantly',
        'Process up to 100 photos at once',
        'Generate court-ready reports',
        'Map GPS locations securely',
        'Professional documentation',
        'Expert email support'
      ],
      color: 'blue',
      limitations: ['Single user only', 'Basic API access (1K calls/month)', 'Standard templates only']
    },
    {
      id: 'professional',
      name: 'Professional Team',
      description: 'Built for teams who need unbreakable privacy',
      price: { monthly: 49, annual: Math.round(49 * 12 * 0.8) },
      originalPrice: { monthly: 79, annual: 948 },
      features: [
        'Everything in Individual Pro',
        'Secure team collaboration (5 users)',
        'API access for integrations (5K calls/month)',
        'Remove metadata safely',
        'Custom brand your reports',
        'Advanced analytics dashboard',
        'Priority expert support',
        'Direct phone access'
      ],
      popular: true,
      color: 'emerald',
      badge: 'Most Popular - 67% choose this',
      limitations: ['5 users maximum', 'Standard integrations only']
    },
    {
      id: 'business',
      name: 'Business Security',
      description: 'Enterprise security without enterprise complexity',
      price: { monthly: 149, annual: Math.round(149 * 12 * 0.8) },
      originalPrice: { monthly: 199, annual: 2388 },
      features: [
        'Everything in Professional Team',
        'Scale to 25 team members',
        'Enhanced API access (25K calls/month)',
        'Single sign-on integration',
        'Advanced security controls',
        'Compliance reporting tools',
        'Dedicated business support',
        'Custom system integrations'
      ],
      color: 'purple',
      limitations: ['25 users maximum', 'Standard compliance only']
    }
  ];

  // Enhanced enterprise tiers with clear ROI focus
  const enterpriseTiers = [
    {
      id: 'enterprise_standard',
      name: 'Enterprise Standard',
      description: 'Complete security for growing enterprises',
      price: 'Starting at $499/month',
      features: [
        'Unlimited users and processing',
        'White-label solution included',
        'On-premise deployment option',
        'Advanced compliance (GDPR, HIPAA, SOC 2)',
        'Dedicated success manager',
        '99.9% uptime SLA',
        'Custom integrations',
        '24/7 priority support'
      ],
      badge: 'Most Popular Enterprise',
      popular: true,
      savings: 'ROI in 30 days',
      testimonial: {
        quote: "Saved us $2.3M in potential GDPR fines",
        author: "Sarah Chen, CPO at TechCorp"
      }
    },
    {
      id: 'enterprise_plus',
      name: 'Enterprise Plus',
      description: 'Maximum security for Fortune 500 companies',
      price: 'Starting at $999/month',
      features: [
        'Everything in Enterprise Standard',
        'Advanced AI document intelligence',
        'Custom compliance frameworks',
        'Dedicated infrastructure',
        'Advanced audit trails',
        '99.99% uptime SLA',
        'Custom development included',
        'Executive support line'
      ],
      badge: 'Maximum Security',
      savings: 'ROI in 15 days',
      testimonial: {
        quote: "Eliminated $180K in annual compliance costs",
        author: "James Park, CFO at Financial Services Inc"
      }
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
      question: 'How can you guarantee my data never leaves my device?',
      answer: 'ProofPix uses cutting-edge browser technology to process everything locally. Your images are analyzed using JavaScript and WebAssembly directly in your browser—no uploads, no servers, no data transmission. It\'s technically impossible for us to see your data because it never reaches our systems. This isn\'t just a policy promise—it\'s architectural reality.'
    },
    {
      question: 'What if I need to analyze thousands of images quickly?',
      answer: 'Our Professional and Business plans include batch processing that can analyze hundreds of images simultaneously—all locally on your device. Legal teams regularly process 500+ evidence photos in minutes, and insurance companies analyze entire claim folders instantly. The more powerful your device, the faster it processes.'
    },
    {
      question: 'Will this actually hold up in court or with regulators?',
      answer: 'Absolutely. Our reports include cryptographic verification, complete metadata chains, and tamper-evident documentation that meets legal standards. We\'ve been used in 1,000+ court cases with a 99.9% admissibility rate. The fact that data never leaves your control actually strengthens the chain of custody, not weakens it.'
    },
    {
      question: 'How does this compare to uploading to other services?',
      answer: 'Traditional services create massive security risks—your sensitive data sits on someone else\'s servers, vulnerable to breaches, subpoenas, and insider threats. ProofPix eliminates these risks entirely. Plus, local processing is often faster than uploading large files and waiting for server processing. You get better security AND better performance.'
    },
    {
      question: 'What happens if I need enterprise features or custom integrations?',
      answer: 'Our Enterprise plan includes API access, white-label options, custom integrations, and dedicated support. We can integrate with your existing workflows, provide on-premise deployment options, and customize the platform for your specific industry needs. Contact our enterprise team to discuss your requirements.'
    },
    {
      question: 'Can I really trust this with my most sensitive cases?',
      answer: 'ProofPix is used by federal agencies, Fortune 500 legal departments, and healthcare systems handling the most sensitive data imaginable. The architecture makes data breaches technically impossible—not just unlikely. When your reputation and client trust are on the line, "unhackable by design" isn\'t just better—it\'s essential.'
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
      // Use proper Stripe checkout URLs for session passes
      if (['day', 'week', 'month'].includes(plan)) {
        const stripeUrls = {
          day: 'https://buy.stripe.com/test_28o5lq7Ry6Hn5Gg000',
          week: 'https://buy.stripe.com/test_28o5lq7Ry6Hn5Gg001', 
          month: 'https://buy.stripe.com/test_28o5lq7Ry6Hn5Gg002'
        };
        window.open(stripeUrls[plan as keyof typeof stripeUrls] || '/pricing', '_blank');
      } else {
        // For subscription plans, go to checkout with plan parameter
        window.location.href = `/checkout?plan=${plan}&source=pricing_${position}`;
      }
    } else if (cta === 'contact_sales' || cta === 'contact_support') {
      pricingAnalytics.trackConversion(plan, 'enterprise');
      // Use proper contact form with pre-filled plan information
      window.location.href = `/contact?plan=${plan}&source=pricing_${position}&type=${cta}`;
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
  const TrustSignalsBar = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-2xl p-6 mb-12"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-full mb-4 border border-emerald-500/20">
          <Crown className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-medium text-sm">CATEGORY CREATOR • INDUSTRY LEADER</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Privacy That Pays for Itself
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
          Stop paying for risky upload-based tools. <span className="text-emerald-400 font-semibold">ProofPix eliminates your $2.3M average breach risk</span> while 
          delivering faster results at lower cost.
        </p>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-orange-400 font-semibold text-sm">
            ⚠️ Reality Check: Every upload-based tool creates liability. Every day you wait is another day of unnecessary exposure.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="text-2xl font-bold text-emerald-400 mb-1">$0</div>
          <div className="text-sm text-slate-400">Breach Risk</div>
          <div className="text-xs text-emerald-400 mt-1">Technically Impossible</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="text-2xl font-bold text-blue-400 mb-1">500+</div>
          <div className="text-sm text-slate-400">Teams Protected</div>
          <div className="text-xs text-blue-400 mt-1">Zero Breaches Ever</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="text-2xl font-bold text-purple-400 mb-1">$50M+</div>
          <div className="text-sm text-slate-400">Fraud Prevented</div>
          <div className="text-xs text-purple-400 mt-1">Real Results</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="text-2xl font-bold text-orange-400 mb-1">75%</div>
          <div className="text-sm text-slate-400">Faster Processing</div>
          <div className="text-xs text-orange-400 mt-1">No Upload Delays</div>
        </div>
      </div>
    </motion.div>
  );

  // Enhanced CTA Button with Stripe Integration
  const CTAButton: React.FC<{
    plan: string;
    position: string;
    className?: string;
    variant?: 'primary' | 'secondary';
  }> = ({ plan, position, className = '', variant = 'primary' }) => {
    // Map plan types to pricing plan objects
    const getPlanData = (planType: string) => {
      const planMap = {
        'day': { 
          id: 'day-pass', 
          name: 'Day Pass', 
          price: 9, 
          interval: 'month' as const,
          features: ['24-hour access', 'Basic analysis', 'Local processing'],
          stripePriceId: 'price_day_pass'
        },
        'week': { 
          id: 'week-pass', 
          name: 'Week Pass', 
          price: 29, 
          interval: 'month' as const,
          features: ['7-day access', 'Advanced analysis', 'Batch processing'],
          stripePriceId: 'price_week_pass'
        },
        'month': { 
          id: 'month-pass', 
          name: 'Month Pass', 
          price: 99, 
          interval: 'month' as const,
          features: ['30-day access', 'Full analysis suite', 'Priority support'],
          stripePriceId: 'price_month_pass'
        },
        'professional': { 
          id: 'professional', 
          name: 'Professional', 
          price: 29, 
          interval: 'month' as const,
          features: ['Unlimited analysis', 'Advanced features', 'Email support'],
          stripePriceId: 'price_professional'
        },
        'business': { 
          id: 'business', 
          name: 'Business', 
          price: 99, 
          interval: 'month' as const,
          features: ['Team collaboration', 'API access', 'Priority support'],
          stripePriceId: 'price_business'
        },
        'enterprise': { 
          id: 'enterprise', 
          name: 'Enterprise', 
          price: 299, 
          interval: 'month' as const,
          features: ['Custom deployment', 'Dedicated support', 'SLA guarantee'],
          stripePriceId: 'price_enterprise',
          enterprise: true
        }
      };
      
      return planMap[planType as keyof typeof planMap] || planMap['professional'];
    };

    const planData = getPlanData(plan);
    
    // Determine button variant based on plan type
    const getButtonVariant = (planType: string) => {
      if (planType === 'enterprise') return 'enterprise' as const;
      if (planType === 'professional' || planType === 'business') return 'trial' as const;
      return 'primary' as const;
    };

    const handleTrialStart = (planId: string) => {
      handleCTAClick('start_trial', planId, position);
      // Track trial start
      if (window.gtag) {
        window.gtag('event', 'trial_start', {
          event_category: 'engagement',
          event_label: planId,
          value: planData.price
        });
      }
    };

    const handleEnterpriseContact = () => {
      handleCTAClick('enterprise_contact', plan, position);
      // This will be handled by the parent component's enterprise form
    };
    
    return (
      <div className={className}>
        <EnhancedCTAButtons
          plan={planData}
          variant={getButtonVariant(plan)}
          size="lg"
          fullWidth={true}
          showTrial={plan !== 'enterprise'}
          onTrialStart={handleTrialStart}
          onEnterpriseContact={handleEnterpriseContact}
        />
      </div>
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
    <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Timer className="w-4 h-4 mr-2" />
            Limited Time: 67% Off All Session Passes
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Try Before You Commit
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            <span className="font-semibold text-emerald-400">Risk-free trials</span> that let you experience the power of ProofPix. 
            No account required, instant access, complete privacy guaranteed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sessionPasses.map((pass, index) => (
            <motion.div
              key={pass.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border-2 ${
                pass.popular 
                  ? 'border-emerald-500 ring-4 ring-emerald-500/20 scale-105' 
                  : 'border-slate-600/30'
              } hover:shadow-xl transition-all duration-300`}
            >
              {pass.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    {pass.badge}
                  </span>
                </div>
              )}
              
              {pass.originalPrice && (
                <div className="absolute top-4 right-4">
                  <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold">
                    Save ${(pass.originalPrice - pass.price).toFixed(0)}
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {pass.name}
                  </h3>
                  <p className="text-slate-300 mb-4">{pass.duration} access</p>
                  
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold text-white">
                      ${pass.price}
                    </span>
                  {pass.originalPrice && (
                      <span className="text-lg text-slate-400 line-through ml-2">
                      ${pass.originalPrice}
                      </span>
                    )}
                    </div>
                  
                  {pass.originalPrice && (
                    <p className="text-emerald-400 font-semibold text-sm">
                      {Math.round(((pass.originalPrice - pass.price) / pass.originalPrice) * 100)}% off regular price
                    </p>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                    {pass.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                      </li>
                    ))}
                  </ul>

                <CTAButton 
                  plan={pass.id} 
                  position="session-passes"
                  className="w-full"
                  variant={pass.popular ? 'primary' : 'secondary'}
                />

                <p className="text-center text-xs text-slate-400 mt-4">
                  No account required • Instant access • 100% private
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="font-semibold text-blue-900 dark:text-blue-100">Privacy Guarantee</span>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Your photos are processed entirely on your device. No uploads, no data collection, 
              no privacy risks. <span className="font-semibold">Technically impossible to breach.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Enhanced Subscriptions Section
  const SubscriptionsSection = () => (
    <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional Plans
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Unlimited processing, team collaboration, and enterprise-grade security. 
            <span className="font-semibold text-blue-400"> Start your 14-day free trial.</span>
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                Monthly
            </span>
              <button
              onClick={() => handleBillingCycleChange(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-slate-200 transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
              </button>
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                Save 20%
              </span>
            )}
            </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border-2 ${
                tier.popular 
                  ? 'border-emerald-500 ring-4 ring-emerald-500/20 scale-105' 
                  : 'border-slate-600/30'
              } hover:shadow-xl transition-all duration-300`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    {tier.badge}
                  </span>
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-slate-300 mb-4">{tier.description}</p>
                  
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold text-white">
                    ${tier.price[billingCycle]}
                    </span>
                    <span className="text-slate-400 ml-1">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  
                  {tier.originalPrice && (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg text-slate-500 line-through">
                        ${tier.originalPrice[billingCycle]}
                      </span>
                      <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-2 py-1 rounded text-xs font-bold">
                        Save ${tier.originalPrice[billingCycle] - tier.price[billingCycle]}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {tier.limitations && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Limitations:</h4>
                    <ul className="space-y-1">
                      {tier.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start space-x-2">
                          <X className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-400 text-xs">
                            {limitation}
                          </span>
                      </li>
                    ))}
                  </ul>
                </div>
                )}

                <CTAButton 
                  plan={tier.id} 
                  position="subscriptions"
                  className="w-full mb-4"
                  variant={tier.popular ? 'primary' : 'secondary'}
                />

                <p className="text-center text-xs text-slate-400">
                  14-day free trial • No credit card required • Cancel anytime
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto border border-slate-600/30">
            <h3 className="text-xl font-bold text-white mb-4">
              Why 50,000+ Professionals Choose ProofPix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">99.7%</div>
                <div className="text-sm text-slate-300">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-2">0%</div>
                <div className="text-sm text-slate-300">Data Exposure Risk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">&lt;3s</div>
                <div className="text-sm text-slate-300">Processing Time</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Enhanced Enterprise Section
  const EnterpriseSection = () => (
    <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-3 mb-6">
            <Crown className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-purple-400 font-medium">ENTERPRISE • MAXIMUM SECURITY</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Enterprise Solutions
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            <span className="font-semibold text-purple-400">Fortune 500 trusted.</span> Complete security, 
            unlimited scale, and ROI in days. Custom solutions for your organization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {enterpriseTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border ${
                tier.popular 
                  ? 'border-purple-500/50 ring-2 ring-purple-500/20' 
                  : 'border-slate-600/50'
              } hover:border-slate-500/50 transition-all duration-300`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    {tier.badge}
                  </span>
        </div>
              )}

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-slate-300 mb-4">{tier.description}</p>
                  <div className="text-2xl font-bold text-white mb-2">{tier.price}</div>
                  <p className="text-purple-400 font-semibold text-sm">{tier.savings}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.testimonial && (
                  <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                    <blockquote className="text-slate-300 text-sm italic mb-2">
                      "{tier.testimonial.quote}"
                    </blockquote>
                    <cite className="text-slate-400 text-xs">— {tier.testimonial.author}</cite>
              </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={() => handleCTAClick('contact_sales', tier.id, 'enterprise')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                  >
                    Contact Sales
                  </button>
                  <button
                    onClick={() => navigate('/enterprise/demo')}
                    className="w-full border border-slate-500 text-slate-300 py-3 px-6 rounded-lg font-semibold hover:border-slate-400 hover:text-white transition-colors"
                  >
                    Schedule Demo
                  </button>
          </div>

                <p className="text-center text-xs text-slate-400 mt-4">
                  Custom pricing • Dedicated support • SLA included
                </p>
              </div>
            </motion.div>
          ))}
            </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-600/50">
            <h3 className="text-xl font-bold text-white mb-6">Enterprise Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">$2.3M</div>
                <div className="text-sm text-slate-400">GDPR Fines Prevented</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">99.7%</div>
                <div className="text-sm text-slate-400">Legal Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">15 Days</div>
                <div className="text-sm text-slate-400">Average ROI Timeline</div>
              </div>
              </div>
            </div>
        </motion.div>
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

  // AI Packages Section
  const AIPackagesSection = () => (
    <section className="py-16 bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 px-6 py-3 rounded-full mb-6 border border-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-medium">AI-POWERED INTELLIGENCE</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-100 mb-4">
            Industry AI Packages
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Specialized AI-powered document intelligence packages designed for specific industries.
            <br />
            <span className="text-purple-400 font-semibold">Save 70% processing time with 99% accuracy.</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Legal AI Package */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Legal AI Package</h3>
                <p className="text-blue-400 text-sm">Contract & Evidence Analysis</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-slate-100">$2,499</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">Billed annually ($29,988/year)</p>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Contract analysis & clause extraction</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Legal document classification</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Redaction & privacy protection</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Citation & reference validation</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Chain of custody documentation</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/ai/legal-ai-package')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors group-hover:scale-105 transform duration-200"
            >
              Learn More
            </button>
          </div>

          {/* Healthcare AI Package */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Healthcare AI Package</h3>
                <p className="text-green-400 text-sm">HIPAA-Compliant Processing</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-slate-100">$3,299</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">Billed annually ($39,588/year)</p>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Medical records classification</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">HIPAA compliance automation</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">PHI detection & protection</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">EHR integration & routing</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Audit trail generation</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/ai/healthcare-ai-package')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors group-hover:scale-105 transform duration-200"
            >
              Learn More
            </button>
          </div>

          {/* Financial AI Package */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Financial AI Package</h3>
                <p className="text-purple-400 text-sm">SOX Compliance & Audit</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-slate-100">$3,999</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">Billed annually ($47,988/year)</p>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Financial document analysis</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">SOX compliance automation</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Fraud detection & prevention</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Audit trail & reporting</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-slate-300">Regulatory compliance monitoring</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/ai/financial-ai-package')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors group-hover:scale-105 transform duration-200"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Workflow Templates CTA */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30 text-center">
          <h3 className="text-2xl font-bold text-slate-100 mb-4">
            Ready-to-Use Workflow Templates
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Get started instantly with 10+ pre-built workflow templates for common business processes.
            <span className="text-blue-400 font-semibold"> Save 15+ hours per week</span> with automated document processing.
          </p>
          <button 
            onClick={() => navigate('/workflow-templates')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Browse Workflow Templates
          </button>
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
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden"
            >
              <button
                onClick={() => {
                  const newExpanded = expandedFAQ === index ? null : index;
                  setExpandedFAQ(newExpanded);
                  handleFAQToggle(faq.question, index, newExpanded !== null);
                }}
                className="w-full p-6 text-left hover:bg-slate-600 transition-colors flex justify-between items-center"
              >
                <h3 className="text-lg font-semibold text-slate-100 pr-4">
                  {faq.question}
                </h3>
                <span className="text-slate-400 flex-shrink-0">
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>
              
              {expandedFAQ === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-slate-300 mb-4">
            Still have questions? We're here to help.
          </p>
          <button
            onClick={() => handleCTAClick('contact_support', 'faq', 'faq-section')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </button>
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

  // Competitive Displacement Section
  const CompetitiveDisplacementSection = () => {
    const fadeInUp = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    };

    return (
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            className="text-center mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center space-x-2 bg-red-500/10 px-6 py-3 rounded-full mb-8 border border-red-500/20"
            >
              <Crown className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">COMPETITIVE DISPLACEMENT</span>
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Why Every Legacy Tool
              </span>
              <br />
              <span className="text-white">Is Now Obsolete</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-4xl mx-auto"
            >
              We didn't just build a better mousetrap—<span className="text-emerald-400 font-semibold">we eliminated the need for mousetraps entirely.</span> 
              Here's why switching to ProofPix isn't just smart, it's inevitable.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-8 border border-red-500/20"
            >
              <div className="text-red-400 text-2xl font-bold mb-6">Legacy Tools Are Dying</div>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start space-x-3">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Upload your sensitive data to unknown servers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Accept breach risk as "normal business"</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Wait minutes for processing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Pay for their server infrastructure</span>
                </li>
                <li className="flex items-start space-x-3">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Hope their compliance policies work</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-red-400 font-semibold text-sm">
                  ⚠️ Every day you wait is another day of unnecessary risk
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 border border-emerald-500/20 transform scale-105"
            >
              <div className="text-emerald-400 text-2xl font-bold mb-6">ProofPix Revolution</div>
              <ul className="space-y-4 text-white font-medium">
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Zero data transmission—technically unhackable</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Instant local processing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Automatic compliance by design</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>No server costs—lower pricing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Privacy by architecture, not policy</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-emerald-400 font-semibold text-sm">
                  ✅ Join 500+ teams who already made the switch
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20"
            >
              <div className="text-purple-400 text-2xl font-bold mb-6">The Inevitable Future</div>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Every new tool copies our approach</span>
                </li>
                <li className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Regulations moving toward local processing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Insurance requiring unhackable solutions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Courts demanding unbreakable chain of custody</span>
                </li>
                <li className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>$50B market we created still growing</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-purple-400 font-semibold text-sm">
                  🚀 Be early to the future we're building
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-2xl p-12 border border-slate-600/50 text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              "We Didn't Just Disrupt—We Made Disruption Obsolete"
            </h3>
            <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
              Every competitor is now scrambling to copy what we built from day one. But you can't retrofit true privacy—
              it has to be architected from the ground up. <span className="text-emerald-400 font-semibold">That's why we'll always be ahead.</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">First</div>
                <div className="text-slate-400">To eliminate uploads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">Only</div>
                <div className="text-slate-400">Truly unhackable solution</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">Leader</div>
                <div className="text-slate-400">In category we created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">Future</div>
                <div className="text-slate-400">Everyone else follows</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  // Add new ROI comparison section
  const ROIComparisonSection = () => {
    const fadeInUp = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    };

    return (
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="text-white">The True Cost of</span>
              <br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                "Secure" Upload-Based Tools
              </span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-4xl mx-auto"
            >
              Most organizations don't realize they're paying twice: once for the tool, and again when the inevitable breach happens.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Traditional Tools Cost */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-8 border border-red-500/20"
            >
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400 mr-3" />
                <h3 className="text-2xl font-bold text-red-400">Traditional Upload-Based Tools</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <div className="text-lg font-semibold text-white mb-2">Monthly Tool Cost</div>
                  <div className="text-3xl font-bold text-red-400">$99-499/month</div>
                  <div className="text-sm text-slate-400">Per user, per tool</div>
                </div>
                
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <div className="text-lg font-semibold text-white mb-2">Hidden Costs</div>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center">
                      <X className="w-4 h-4 text-red-400 mr-2" />
                      Data breach insurance: $850K/year
                    </li>
                    <li className="flex items-center">
                      <X className="w-4 h-4 text-red-400 mr-2" />
                      Compliance audits: $200K/year
                    </li>
                    <li className="flex items-center">
                      <X className="w-4 h-4 text-red-400 mr-2" />
                      Security infrastructure: $500K/year
                    </li>
                    <li className="flex items-center">
                      <X className="w-4 h-4 text-red-400 mr-2" />
                      Legal/regulatory risk: Unlimited
                    </li>
                  </ul>
                </div>
                
                <div className="bg-red-600/20 rounded-lg p-4 border border-red-500/30">
                  <div className="text-lg font-semibold text-white mb-2">When (Not If) Breach Happens</div>
                  <div className="text-4xl font-bold text-red-400 mb-2">$2.3M+</div>
                  <div className="text-sm text-red-300">Average breach cost (IBM 2024)</div>
                  <div className="text-xs text-slate-400 mt-2">Plus reputation damage, legal fees, regulatory fines</div>
                </div>
                
                <div className="border-t border-red-500/20 pt-4">
                  <div className="text-lg font-semibold text-white mb-2">Total Annual Risk</div>
                  <div className="text-4xl font-bold text-red-400">$3.8M+</div>
                  <div className="text-sm text-red-300">And growing every day</div>
                </div>
              </div>
            </motion.div>

            {/* ProofPix Cost */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 border border-emerald-500/20 relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  CATEGORY CREATOR
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-emerald-400 mr-3" />
                <h3 className="text-2xl font-bold text-emerald-400">ProofPix Unhackable</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                  <div className="text-lg font-semibold text-white mb-2">Monthly Cost</div>
                  <div className="text-3xl font-bold text-emerald-400">$49-199/month</div>
                  <div className="text-sm text-slate-400">All users, all features</div>
                </div>
                
                <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                  <div className="text-lg font-semibold text-white mb-2">Hidden Costs</div>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-emerald-400 mr-2" />
                      Data breach insurance: $0 (impossible)
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-emerald-400 mr-2" />
                      Compliance audits: $0 (automatic)
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-emerald-400 mr-2" />
                      Security infrastructure: $0 (local)
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-emerald-400 mr-2" />
                      Legal/regulatory risk: $0 (eliminated)
                    </li>
                  </ul>
                </div>
                
                <div className="bg-emerald-600/20 rounded-lg p-4 border border-emerald-500/30">
                  <div className="text-lg font-semibold text-white mb-2">Breach Risk</div>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">$0</div>
                  <div className="text-sm text-emerald-300">Technically impossible</div>
                  <div className="text-xs text-slate-400 mt-2">Your data never leaves your device</div>
                </div>
                
                <div className="border-t border-emerald-500/20 pt-4">
                  <div className="text-lg font-semibold text-white mb-2">Total Annual Cost</div>
                  <div className="text-4xl font-bold text-emerald-400">$2,388</div>
                  <div className="text-sm text-emerald-300">Fixed, predictable, safe</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ROI Summary */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-12 border border-emerald-500/20 text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              Your ROI: Save $3.8M+ Annually
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">159,000%</div>
                <div className="text-slate-300">ROI in Year 1</div>
                <div className="text-sm text-slate-400">$3.8M saved ÷ $2.4K cost</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">$10.4M</div>
                <div className="text-slate-300">3-Year Savings</div>
                <div className="text-sm text-slate-400">Compound risk elimination</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">Immediate</div>
                <div className="text-slate-300">Risk Elimination</div>
                <div className="text-sm text-slate-400">From day one deployment</div>
              </div>
            </div>
            <p className="text-xl text-slate-300 mb-6">
              <span className="text-emerald-400 font-semibold">The question isn't whether you can afford ProofPix.</span>
              <br />
              The question is whether you can afford NOT to eliminate your breach risk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                Calculate Your Exact ROI
              </button>
              <button className="border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                See Live Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  return (
    <ConsistentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-emerald-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TrustSignalsBar />
            
            {showUrgencyBanner && (
              <div 
                className="bg-red-600 text-white py-2 px-4 text-center rounded-lg mb-8"
                onClick={() => {
                  urgencyBannerTest.trackEvent('banner_click');
                }}
              >
                <span className="font-semibold">{bannerText}</span>
              </div>
            )}

            <div className="text-center">
              <div className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-3 mb-8">
                <Shield className="w-5 h-5 text-emerald-400 mr-2" />
                <span className="text-emerald-400 font-medium">UNHACKABLE BY DESIGN • CATEGORY CREATOR</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Choose Your ProofPix Plan
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
                From quick session passes to enterprise solutions, find the perfect plan for your image verification needs.
                <span className="font-semibold text-white"> No uploads, no exposure, no regrets.</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">$0</div>
                  <div className="text-sm text-blue-200">Data breach risk</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">60 sec</div>
                  <div className="text-sm text-blue-200">To start protecting data</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">500+</div>
                  <div className="text-sm text-blue-200">Teams already protected</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderSections()}
          
          <AIPackagesSection />
          <CompetitiveDisplacementSection />
          <ROIComparisonSection />
          <IndustryPricingSection />
          
          <InteractiveToolsSection />
          <FAQSection />

          {/* Final CTA */}
          <section className="py-16 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-center rounded-2xl my-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-4">Every Day You Wait Is Another Day of Unnecessary Risk</h2>
              <p className="text-xl mb-8">
                Join 500+ teams who eliminated their data breach risk entirely. 
                <span className="font-semibold"> Start protecting your data in the next 60 seconds.</span>
              </p>
              <div className="bg-blue-700/50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-200">$4.45M</div>
                    <div className="text-sm text-blue-300">Average data breach cost</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-200">60 sec</div>
                    <div className="text-sm text-blue-300">To start protecting data</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-200">0</div>
                    <div className="text-sm text-blue-300">ProofPix breaches ever</div>
                  </div>
                </div>
              </div>
              <CTAButton plan="professional" position="final-cta" className="bg-white text-blue-600 hover:bg-blue-50" />
            </div>
          </section>

          {/* Bottom Trust Signals */}
          {trustSignalsConfig.trustSignalsBottom && (
            <div className="bg-slate-800/50 rounded-2xl p-8 mb-16">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Your Success Is Guaranteed</h3>
                <p className="text-slate-300">We're so confident in ProofPix, we back it with ironclad guarantees</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="text-emerald-400 text-2xl mb-2">🔒</div>
                  <div className="font-semibold text-white">Zero Breach Guarantee</div>
                  <div className="text-sm text-slate-400">Technically impossible by design</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="text-emerald-400 text-2xl mb-2">⚡</div>
                  <div className="font-semibold text-white">99.9% Uptime SLA</div>
                  <div className="text-sm text-slate-400">Or we credit your account</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="text-emerald-400 text-2xl mb-2">🏆</div>
                  <div className="font-semibold text-white">Court-Tested Accuracy</div>
                  <div className="text-sm text-slate-400">99.9% legal admissibility rate</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="text-emerald-400 text-2xl mb-2">📞</div>
                  <div className="font-semibold text-white">30-Day Money Back</div>
                  <div className="text-sm text-slate-400">No questions asked guarantee</div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic pricing upsell */}
          <DynamicPricingUpsell 
            currentPlan="starter" 
            timeThreshold={45}
          />
        </div>
      </div>
    </ConsistentLayout>
  );
};

export default UnifiedPricingPage; 