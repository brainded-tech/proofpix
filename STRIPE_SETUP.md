# ProofPix Stripe Integration Setup Guide

## Overview
ProofPix uses a **hybrid pricing model** with both session-based (no account) and account-based subscription options.

## Pricing Structure

### 🚫 Session-Based Plans (No Account Required)
- **Free**: 5 photos/day, no payment required
- **Day Pass**: $2.99 for 24h unlimited access
- **Week Pass**: $9.99 for 7d unlimited access

### 📧 Account-Based Subscriptions  
- **Starter**: $4.99/month, 50 photos/day
- **Pro**: $14.99/month, 500 photos/day (Most Popular)
- **Enterprise**: $49.99/month, unlimited + API access

## Required Stripe Products & Prices

### 1. Create Products in Stripe Dashboard

#### Session-Based Products
```
Product: ProofPix Day Pass
- Name: "ProofPix Day Pass"
- Description: "24-hour unlimited photo processing access"
- Price ID: price_daypass
- Amount: $2.99
- Billing: One-time
```

```
Product: ProofPix Week Pass  
- Name: "ProofPix Week Pass"
- Description: "7-day unlimited photo processing access"
- Price ID: price_weekpass
- Amount: $9.99
- Billing: One-time
```

#### Subscription Products
```
Product: ProofPix Starter
- Product ID: prod_starter
- Name: "ProofPix Starter"
- Description: "50 photos per day with email support"
- Price ID: price_starter
- Amount: $4.99
- Billing: Monthly recurring
```

```
Product: ProofPix Pro
- Product ID: prod_pro  
- Name: "ProofPix Pro"
- Description: "500 photos per day with priority features"
- Price ID: price_pro
- Amount: $14.99
- Billing: Monthly recurring
```

```
Product: ProofPix Enterprise
- Product ID: prod_enterprise
- Name: "ProofPix Enterprise" 
- Description: "Unlimited photos with API access"
- Price ID: price_enterprise
- Amount: $49.99
- Billing: Monthly recurring
```

### 2. Environment Variables

Add to your `.env` file:
```bash
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Webhook Configuration  
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Backend API Endpoints Required

#### Session-Based Checkout
```javascript
// POST /api/create-checkout-session
// For one-time payments (Day Pass, Week Pass)
{
  priceId: "price_daypass",
  successUrl: "https://upload.proofpixapp.com/success?plan=daypass",
  cancelUrl: "https://upload.proofpixapp.com/pricing"
}
```

#### Subscription Checkout  
```javascript
// POST /api/create-subscription-checkout
// For recurring subscriptions (Starter, Pro, Enterprise)
{
  priceId: "price_pro",
  customerEmail: "user@example.com", // Optional for guest checkout
  successUrl: "https://upload.proofpixapp.com/success?plan=pro",
  cancelUrl: "https://upload.proofpixapp.com/pricing"
}
```

### 4. Webhook Handling

Set up webhooks for these events:
- `checkout.session.completed` - Activate session or subscription
- `invoice.payment_succeeded` - Renew subscription  
- `customer.subscription.deleted` - Cancel subscription

#### Session-Based Webhook Handler
```javascript
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  
  if (session.mode === 'payment') {
    // One-time payment for Day/Week Pass
    // Redirect to success page with session activation
    const planId = session.metadata.planId;
    // No database storage needed - handled client-side
  }
}
```

#### Subscription Webhook Handler  
```javascript
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  
  if (session.mode === 'subscription') {
    // Recurring subscription
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    const planId = session.metadata.planId;
    
    // Store in your database
    await createUserSubscription({
      customerId,
      subscriptionId, 
      planId,
      email: session.customer_details.email
    });
  }
}
```

### 5. Frontend Integration

The frontend is already configured with:
- ✅ Pricing plans in `src/utils/stripe.js`
- ✅ Session management in `src/utils/sessionManager.js`  
- ✅ Pricing page with hybrid model
- ✅ Success page handling both plan types
- ✅ Session status component

### 6. Testing

#### Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

#### Test Scenarios
1. **Day Pass Purchase**: One-time payment, immediate session activation
2. **Week Pass Purchase**: One-time payment, 7-day session activation  
3. **Starter Subscription**: Monthly recurring, email signup required
4. **Pro Subscription**: Monthly recurring, most popular plan
5. **Enterprise Subscription**: Monthly recurring, full features

### 7. Privacy Compliance

#### Session-Based Plans
- ✅ No user data stored on servers
- ✅ Session stored locally in browser
- ✅ No email collection required
- ✅ GDPR compliant by design

#### Account-Based Plans  
- ✅ Minimal data collection (email only)
- ✅ Clear privacy policy
- ✅ Easy cancellation process
- ✅ Data deletion on request

### 8. Go Live Checklist

- [ ] Replace test keys with live keys
- [ ] Set up live webhook endpoints
- [ ] Test all payment flows
- [ ] Verify session management works
- [ ] Test subscription renewals
- [ ] Confirm webhook security
- [ ] Update success/cancel URLs
- [ ] Test refund process

### 9. Support & Monitoring

Monitor these metrics:
- Session-based conversion rates
- Subscription churn rates  
- Payment failure rates
- Session expiration patterns
- Plan upgrade/downgrade flows

The hybrid model gives users maximum choice while maintaining ProofPix's privacy-first approach!

## 🚀 Quick Setup Steps

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification
3. Get your API keys from the Stripe Dashboard

### 2. Environment Variables
Create a `.env` file in your project root with:

```bash
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Plausible Analytics
REACT_APP_PLAUSIBLE_DOMAIN=upload.proofpixapp.com

# App Configuration
REACT_APP_APP_NAME=ProofPix
REACT_APP_APP_URL=https://upload.proofpixapp.com
```

### 3. Create Stripe Products & Prices

In your Stripe Dashboard, create these products:

#### Starter Plan
- **Product Name**: ProofPix Starter
- **Price**: $4.99/month
- **Product ID**: `prod_starter`
- **Price ID**: `price_starter`

#### Pro Plan (Most Popular)
- **Product Name**: ProofPix Pro
- **Price**: $14.99/month
- **Product ID**: `prod_pro`
- **Price ID**: `price_pro`

#### Enterprise Plan
- **Product Name**: ProofPix Enterprise
- **Price**: $49.99/month
- **Product ID**: `prod_enterprise`
- **Price ID**: `price_enterprise`

### 4. Update Stripe Configuration

Update `src/utils/stripe.js` with your actual Stripe IDs:

```javascript
starter: {
  stripeProductId: 'prod_your_actual_starter_id',
  stripePriceId: 'price_your_actual_starter_price_id',
},
pro: {
  stripeProductId: 'prod_your_actual_pro_id', 
  stripePriceId: 'price_your_actual_pro_price_id',
},
enterprise: {
  stripeProductId: 'prod_your_actual_enterprise_id',
  stripePriceId: 'price_your_actual_enterprise_price_id',
}
```

### 5. Backend API Endpoint (Required)

You'll need to create a backend endpoint at `/api/create-checkout-session` that:

1. Creates a Stripe Checkout Session
2. Returns the session ID
3. Handles webhooks for subscription updates

Example Node.js/Express endpoint:

```javascript
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 6. Webhook Setup

Set up webhooks in Stripe Dashboard for:
- `customer.subscription.created`
- `customer.subscription.updated` 
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 7. Test the Integration

1. Use Stripe test cards: `4242 4242 4242 4242`
2. Test the complete flow: pricing page → checkout → success
3. Verify webhooks are working

## 🎯 Pricing Strategy Rationale

### Free Tier
- **5 photos/day**: Enough to test, not enough for serious use
- **Basic features**: Core functionality only

### Starter Tier ($4.99/month) - "The Tease"
- **50 photos/day**: 10x more than free
- **Limited batch processing**: Just enough to want more
- **Psychology**: Feels cheap but creates upgrade pressure

### Pro Tier ($14.99/month) - "Sweet Spot"
- **500 photos/day**: Professional level
- **Unlimited batch**: No restrictions
- **Best value**: Most users will choose this

### Enterprise Tier ($49.99/month) - "Future-Proof"
- **Unlimited everything**: No limits
- **API access**: For integrations
- **Big jump**: Encourages Pro subscriptions

## 🔧 Next Steps

1. **Set up Stripe account** ✅
2. **Create products/prices** ⏳
3. **Update environment variables** ⏳
4. **Build backend API** ⏳
5. **Test payment flow** ⏳
6. **Set up webhooks** ⏳
7. **Go live!** 🚀

## 💡 Pro Tips

- Start with test mode and test cards
- Use Stripe CLI for local webhook testing
- Monitor Stripe Dashboard for failed payments
- Set up email notifications for subscription events
- Consider adding annual billing with 20% discount

## 🆘 Need Help?

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/checkout)
- [Webhook Testing](https://stripe.com/docs/webhooks/test) 