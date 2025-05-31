// ===== PAYMENT CLIENT FOR STRIPE INTEGRATION =====
// Supporting PRIORITY 3 - PAYMENT SYSTEM
// Frontend payment client with comprehensive Stripe integration

import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

// Payment interfaces
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name: string;
    email: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  created: number;
  is_default: boolean;
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'trialing';
  plan_type: 'free' | 'starter' | 'professional' | 'enterprise';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  payment_method?: PaymentMethod;
}

export interface Invoice {
  id: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amount_due: number;
  amount_paid: number;
  currency: string;
  created: number;
  due_date?: number;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
  period_start: number;
  period_end: number;
  lines: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
}

export interface UsageData {
  api_calls: {
    current: number;
    limit: number;
    percentage: number;
  };
  file_uploads: {
    current: number;
    limit: number;
    percentage: number;
  };
  storage_gb: {
    current: number;
    limit: number;
    percentage: number;
  };
  processing_minutes: {
    current: number;
    limit: number;
    percentage: number;
  };
}

export interface PlanFeatures {
  api_calls: number;
  file_uploads: number;
  storage_gb: number;
  processing_minutes: number;
  watermark_removal: boolean;
  priority_support: boolean;
  custom_branding: boolean;
  advanced_analytics: boolean;
  white_label: boolean;
  custom_domain: boolean;
  sso: boolean;
  dedicated_support: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  stripe_price_id_monthly: string;
  stripe_price_id_yearly: string;
  features: PlanFeatures;
  popular?: boolean;
  enterprise?: boolean;
}

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Payment Client Class
export class PaymentClient {
  private apiBaseUrl: string;
  private authToken: string | null;

  constructor() {
    this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.authToken = localStorage.getItem('auth_token');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.apiBaseUrl}/api/payments${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Customer Management
  async createCustomer(customerData: {
    name: string;
    email: string;
    phone?: string;
  }) {
    return this.makeRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async getCustomer() {
    return this.makeRequest('/customers/me');
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await this.makeRequest('/payment-methods');
    return response.payment_methods || [];
  }

  async attachPaymentMethod(paymentMethodId: string) {
    return this.makeRequest('/payment-methods', {
      method: 'POST',
      body: JSON.stringify({ payment_method_id: paymentMethodId }),
    });
  }

  async setDefaultPaymentMethod(paymentMethodId: string) {
    return this.makeRequest(`/payment-methods/${paymentMethodId}/default`, {
      method: 'PUT',
    });
  }

  async deletePaymentMethod(paymentMethodId: string) {
    return this.makeRequest(`/payment-methods/${paymentMethodId}`, {
      method: 'DELETE',
    });
  }

  // Subscription Management
  async createSubscription(priceId: string, paymentMethodId?: string) {
    return this.makeRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        price_id: priceId,
        payment_method_id: paymentMethodId,
      }),
    });
  }

  async getSubscription(): Promise<Subscription | null> {
    try {
      const response = await this.makeRequest('/subscriptions/me');
      return response.subscription;
    } catch (error) {
      return null;
    }
  }

  async updateSubscription(subscriptionId: string, newPriceId: string) {
    return this.makeRequest(`/subscriptions/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify({ price_id: newPriceId }),
    });
  }

  async cancelSubscription(subscriptionId: string, immediately = false) {
    return this.makeRequest(`/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      body: JSON.stringify({ immediately }),
    });
  }

  async reactivateSubscription(subscriptionId: string) {
    return this.makeRequest(`/subscriptions/${subscriptionId}/reactivate`, {
      method: 'POST',
    });
  }

  // Usage Tracking
  async getUsage(): Promise<UsageData> {
    const response = await this.makeRequest('/usage');
    return response.usage;
  }

  async trackUsage(usageType: string, quantity: number) {
    return this.makeRequest('/usage/track', {
      method: 'POST',
      body: JSON.stringify({
        usage_type: usageType,
        quantity,
      }),
    });
  }

  async checkQuota(usageType: string) {
    return this.makeRequest(`/usage/check/${usageType}`);
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    const response = await this.makeRequest('/invoices');
    return response.invoices || [];
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    const response = await this.makeRequest(`/invoices/${invoiceId}`);
    return response.invoice;
  }

  async downloadInvoice(invoiceId: string) {
    const response = await this.makeRequest(`/invoices/${invoiceId}/download`);
    return response.download_url;
  }

  // Billing Portal
  async createPortalSession(returnUrl?: string) {
    return this.makeRequest('/portal', {
      method: 'POST',
      body: JSON.stringify({
        return_url: returnUrl || window.location.origin + '/dashboard/billing',
      }),
    });
  }

  // Plan Management
  async upgradePlan(planType: string) {
    return this.makeRequest('/plans/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan_type: planType }),
    });
  }

  async downgradePlan(planType: string) {
    return this.makeRequest('/plans/downgrade', {
      method: 'POST',
      body: JSON.stringify({ plan_type: planType }),
    });
  }

  // Pricing Plans
  async getPricingPlans(): Promise<PricingPlan[]> {
    const response = await this.makeRequest('/plans');
    return response.plans || [];
  }

  // Payment Intents (for one-time payments)
  async createPaymentIntent(amount: number, currency = 'usd') {
    return this.makeRequest('/payment-intents', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
    return this.makeRequest(`/payment-intents/${paymentIntentId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ payment_method_id: paymentMethodId }),
    });
  }

  // Coupons and Discounts
  async applyCoupon(couponCode: string) {
    return this.makeRequest('/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ coupon_code: couponCode }),
    });
  }

  async removeCoupon() {
    return this.makeRequest('/coupons/remove', {
      method: 'DELETE',
    });
  }

  // Analytics (Enterprise only)
  async getRevenueAnalytics(startDate: string, endDate: string) {
    return this.makeRequest(`/analytics/revenue?start=${startDate}&end=${endDate}`);
  }

  async getSubscriptionAnalytics() {
    return this.makeRequest('/analytics/subscriptions');
  }

  // Webhooks (for testing)
  async testWebhook(eventType: string, data: any) {
    return this.makeRequest('/webhooks/test', {
      method: 'POST',
      body: JSON.stringify({ event_type: eventType, data }),
    });
  }
}

// Utility functions
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Stripe amounts are in cents
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getSubscriptionStatus = (subscription: Subscription) => {
  switch (subscription.status) {
    case 'active':
      return {
        text: 'Active',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      };
    case 'trialing':
      return {
        text: 'Trial',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      };
    case 'past_due':
      return {
        text: 'Past Due',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
      };
    case 'canceled':
      return {
        text: 'Canceled',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      };
    case 'unpaid':
      return {
        text: 'Unpaid',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      };
    case 'incomplete':
      return {
        text: 'Incomplete',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
      };
    default:
      return {
        text: 'Unknown',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
      };
  }
};

export const calculateUsagePercentage = (current: number, limit: number): number => {
  if (limit === -1) return 0; // Unlimited
  return Math.min((current / limit) * 100, 100);
};

export const isUsageOverLimit = (current: number, limit: number): boolean => {
  if (limit === -1) return false; // Unlimited
  return current > limit;
};

// Default export
export default PaymentClient; 