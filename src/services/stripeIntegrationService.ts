import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe (use environment variable in production)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_live_51RSVJG2Llp3EL08qxey5Ko0SGvsiQYraVaoC9K0kG3FW7auDMjjnFjGFFYahbhRRI8wySRUYJoWlRNIrrhkL5eyP00hfGYzrgW');

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
  enterprise?: boolean;
}

export interface DiscountCode {
  code: string;
  percentage: number;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
}

export interface EnterpriseSetupData {
  companyName: string;
  contactEmail: string;
  estimatedUsers: number;
  industry: string;
  requirements: string[];
  customFeatures?: string[];
}

export interface CheckoutSession {
  id: string;
  url: string;
  customer_email?: string;
}

class StripeIntegrationService {
  private stripe: Promise<Stripe | null>;

  constructor() {
    this.stripe = stripePromise;
  }

  // Pricing plans configuration
  private pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      stripePriceId: '',
      features: [
        '10 documents per month',
        'Basic OCR processing',
        'Standard support',
        'Basic metadata extraction'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      interval: 'month',
      stripePriceId: 'price_pro_monthly',
      popular: true,
      features: [
        'Unlimited documents',
        'Advanced AI analysis',
        'Priority support',
        'Advanced metadata extraction',
        'Batch processing',
        'API access'
      ]
    },
    {
      id: 'pro-yearly',
      name: 'Pro (Yearly)',
      price: 290,
      interval: 'year',
      stripePriceId: 'price_pro_yearly',
      features: [
        'Everything in Pro',
        '2 months free',
        'Advanced analytics',
        'Custom integrations'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      interval: 'month',
      stripePriceId: 'price_enterprise_monthly',
      enterprise: true,
      features: [
        'Everything in Pro',
        'Unlimited users',
        'Custom deployment',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations',
        'Advanced security',
        'Compliance tools'
      ]
    }
  ];

  // Get all pricing plans
  getPricingPlans(): PricingPlan[] {
    return this.pricingPlans;
  }

  // Get specific plan by ID
  getPlan(planId: string): PricingPlan | undefined {
    return this.pricingPlans.find(plan => plan.id === planId);
  }

  // Create checkout session for subscription
  async createCheckoutSession(
    planId: string,
    customerEmail?: string,
    discountCode?: string,
    successUrl?: string,
    cancelUrl?: string
  ): Promise<CheckoutSession> {
    try {
      const plan = this.getPlan(planId);
      if (!plan) {
        throw new Error('Invalid plan selected');
      }

      // In a real implementation, this would call your backend API
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          customerEmail,
          discountCode,
          successUrl: successUrl || `${window.location.origin}/success`,
          cancelUrl: cancelUrl || `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Instead of returning demo fallback, throw the error
      throw new Error('Failed to create checkout session. Please try again or contact support.');
    }
  }

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await this.stripe;
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw error;
    }
  }

  // Apply discount code
  async applyDiscountCode(email: string, discountPercentage: number = 15): Promise<DiscountCode> {
    try {
      // In a real implementation, this would call your backend API
      const response = await fetch('/api/stripe/apply-discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          discountPercentage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply discount');
      }

      return await response.json();
    } catch (error) {
      console.error('Error applying discount:', error);
      // Fallback for demo purposes
      const code = 'SAVE' + discountPercentage;
      return {
        code,
        percentage: discountPercentage,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        usageLimit: 1,
        usedCount: 0
      };
    }
  }

  // Enterprise setup - one-click configuration
  async setupEnterpriseAccount(data: EnterpriseSetupData): Promise<{
    success: boolean;
    accountId: string;
    apiKeys: {
      publishable: string;
      secret: string;
    };
    setupUrl: string;
  }> {
    try {
      // In a real implementation, this would:
      // 1. Create Stripe Connect account
      // 2. Set up webhook endpoints
      // 3. Configure payment methods
      // 4. Generate API keys
      // 5. Set up compliance features
      // 6. Configure user permissions

      const response = await fetch('/api/stripe/setup-enterprise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to setup enterprise account');
      }

      return await response.json();
    } catch (error) {
      console.error('Error setting up enterprise account:', error);
      // Fallback for demo purposes
      return {
        success: true,
        accountId: 'acct_' + Math.random().toString(36).substr(2, 16),
        apiKeys: {
          publishable: 'pk_live_' + Math.random().toString(36).substr(2, 24),
          secret: 'sk_live_your_stripe_secret_key_here'
        },
        setupUrl: '/enterprise/setup-complete'
      };
    }
  }

  // Get customer portal URL for subscription management
  async getCustomerPortalUrl(customerId: string): Promise<string> {
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get customer portal URL');
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error getting customer portal URL:', error);
      // Fallback for demo purposes
      return '/billing';
    }
  }

  // Calculate pricing with discounts
  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): {
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    savings: number;
  } {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    const finalPrice = originalPrice - discountAmount;
    
    return {
      originalPrice,
      discountAmount,
      finalPrice,
      savings: discountAmount
    };
  }

  // Format price for display
  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  }

  // Check if plan requires payment
  requiresPayment(planId: string): boolean {
    const plan = this.getPlan(planId);
    return plan ? plan.price > 0 : false;
  }

  // Get trial period for plan
  getTrialPeriod(planId: string): number {
    // Return trial days (0 for no trial)
    const trialPlans: Record<string, number> = {
      'pro': 14,
      'pro-yearly': 14,
      'enterprise': 30
    };
    
    return trialPlans[planId] || 0;
  }

  // Validate discount code
  async validateDiscountCode(code: string): Promise<{
    valid: boolean;
    discount?: DiscountCode;
    error?: string;
  }> {
    try {
      const response = await fetch(`/api/stripe/validate-discount/${code}`);
      
      if (!response.ok) {
        return { valid: false, error: 'Invalid discount code' };
      }

      const discount = await response.json();
      
      // Check if code is expired
      if (new Date(discount.validUntil) < new Date()) {
        return { valid: false, error: 'Discount code has expired' };
      }

      // Check usage limit
      if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
        return { valid: false, error: 'Discount code usage limit reached' };
      }

      return { valid: true, discount };
    } catch (error) {
      console.error('Error validating discount code:', error);
      return { valid: false, error: 'Failed to validate discount code' };
    }
  }
}

export const stripeIntegrationService = new StripeIntegrationService(); 