# 🚀 ProofPix Stripe Integration Setup Guide

## Overview
ProofPix uses a **hybrid pricing model** that gives users maximum choice:
- **Session-based plans**: No account required, maximum privacy
- **Account-based subscriptions**: Ongoing access with usage tracking

## 💰 Pricing Structure

### 🚫 No Account Required (Session-Based)
| Plan | Price | Duration | Features |
|------|-------|----------|----------|
| **Free** | $0 | Daily | 5 photos/day, basic EXIF |
| **Day Pass** | $2.99 | 24 hours | Unlimited photos, batch processing |
| **Week Pass** | $9.99 | 7 days | Unlimited photos, priority processing |

### 📧 Account Required (Subscription-Based)
| Plan | Price | Billing | Features |
|------|-------|---------|----------|
| **Starter** | $4.99 | Monthly | 50 photos/day, email support |
| **Pro** | $14.99 | Monthly | 500 photos/day, advanced features |
| **Enterprise** | $49.99 | Monthly | Unlimited + API access |

---

## 🏗️ Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete business verification
3. Navigate to **Dashboard** → **Developers** → **API Keys**
4. Copy your **Publishable Key** and **Secret Key**

### 1.2 Environment Variables
Create a `.env` file in your project root:

```bash
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Webhook Configuration (we'll add this later)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
REACT_APP_APP_URL=https://upload.proofpixapp.com
```

---

## 🛍️ Step 2: Create Stripe Products

### 2.1 Session-Based Products (One-time payments)

#### Day Pass Product
1. Go to **Products** → **Add Product**
2. Fill in:
   - **Name**: `ProofPix Day Pass`
   - **Description**: `24-hour unlimited photo processing access`
   - **Pricing Model**: `One time`
   - **Price**: `$2.99 USD`
3. Click **Save Product**
4. Copy the **Price ID** (starts with `price_`) → Use as `price_daypass`

#### Week Pass Product
1. **Products** → **Add Product**
2. Fill in:
   - **Name**: `ProofPix Week Pass`
   - **Description**: `7-day unlimited photo processing access`
   - **Pricing Model**: `One time`
   - **Price**: `$9.99 USD`
3. Click **Save Product**
4. Copy the **Price ID** → Use as `price_weekpass`

### 2.2 Subscription Products (Recurring payments)

#### Starter Subscription
1. **Products** → **Add Product**
2. Fill in:
   - **Name**: `ProofPix Starter`
   - **Description**: `50 photos per day with email support`
   - **Pricing Model**: `Recurring`
   - **Price**: `$4.99 USD`
   - **Billing Period**: `Monthly`
3. Click **Save Product**
4. Copy both:
   - **Product ID** (starts with `prod_`) → Use as `prod_starter`
   - **Price ID** (starts with `price_`) → Use as `price_starter`

#### Pro Subscription (Most Popular)
1. **Products** → **Add Product**
2. Fill in:
   - **Name**: `ProofPix Pro`
   - **Description**: `500 photos per day with priority features`
   - **Pricing Model**: `Recurring`
   - **Price**: `$14.99 USD`
   - **Billing Period**: `Monthly`
3. Click **Save Product**
4. Copy both IDs → Use as `prod_pro` and `price_pro`

#### Enterprise Subscription
1. **Products** → **Add Product**
2. Fill in:
   - **Name**: `ProofPix Enterprise`
   - **Description**: `Unlimited photos with API access`
   - **Pricing Model**: `Recurring`
   - **Price**: `$49.99 USD`
   - **Billing Period**: `Monthly`
3. Click **Save Product**
4. Copy both IDs → Use as `prod_enterprise` and `price_enterprise`

---

## 🔧 Step 3: Update Frontend Configuration

### 3.1 Update Stripe Price IDs
Edit `src/utils/stripe.js` and replace the placeholder price IDs:

```javascript
export const PRICING_PLANS = {
  // ... other plans ...
  daypass: {
    stripePriceId: 'price_YOUR_ACTUAL_DAYPASS_ID', // Replace this
    // ... rest of config
  },
  weekpass: {
    stripePriceId: 'price_YOUR_ACTUAL_WEEKPASS_ID', // Replace this
    // ... rest of config
  },
  starter: {
    stripeProductId: 'prod_YOUR_ACTUAL_STARTER_ID', // Replace this
    stripePriceId: 'price_YOUR_ACTUAL_STARTER_ID', // Replace this
    // ... rest of config
  },
  pro: {
    stripeProductId: 'prod_YOUR_ACTUAL_PRO_ID', // Replace this
    stripePriceId: 'price_YOUR_ACTUAL_PRO_ID', // Replace this
    // ... rest of config
  },
  enterprise: {
    stripeProductId: 'prod_YOUR_ACTUAL_ENTERPRISE_ID', // Replace this
    stripePriceId: 'price_YOUR_ACTUAL_ENTERPRISE_ID', // Replace this
    // ... rest of config
  }
};
```

---

## 🖥️ Step 4: Backend API Setup

You need to create backend endpoints to handle Stripe checkout sessions.

### 4.1 Required Dependencies
```bash
npm install stripe express cors dotenv
```

### 4.2 Basic Express Server (`server.js`)
```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Session-based checkout (Day Pass, Week Pass)
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'payment', // One-time payment
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planType: 'session'
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Subscription checkout (Starter, Pro, Enterprise)
app.post('/api/create-subscription-checkout', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail } = req.body;
    
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription', // Recurring payment
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planType: 'subscription'
      }
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating subscription checkout:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 4.3 Update Frontend Checkout Function
Update `src/utils/stripe.js`:

```javascript
export const createCheckoutSession = async (priceId, successUrl, cancelUrl, isSubscription = false) => {
  try {
    const endpoint = isSubscription ? '/api/create-subscription-checkout' : '/api/create-checkout-session';
    
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        successUrl,
        cancelUrl,
      }),
    });

    const session = await response.json();
    
    if (session.error) {
      throw new Error(session.error);
    }

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const redirectToCheckout = async (priceId, isSubscription = false) => {
  try {
    const stripe = await stripePromise;
    const session = await createCheckoutSession(
      priceId,
      `${window.location.origin}/success?plan=${getPlanIdFromPriceId(priceId)}`,
      `${window.location.origin}/pricing`,
      isSubscription
    );

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

// Helper function to get plan ID from price ID
const getPlanIdFromPriceId = (priceId) => {
  const plans = Object.entries(PRICING_PLANS);
  const plan = plans.find(([_, planData]) => planData.stripePriceId === priceId);
  return plan ? plan[0] : 'pro';
};
```

---

## 🔗 Step 5: Webhook Setup

### 5.1 Create Webhook Endpoint
Add to your `server.js`:

```javascript
// Webhook endpoint (before other middleware)
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      if (session.mode === 'payment') {
        // Session-based purchase (Day Pass, Week Pass)
        console.log('Session-based purchase completed:', session.id);
        // No database storage needed - handled client-side
      } else if (session.mode === 'subscription') {
        // Subscription purchase (Starter, Pro, Enterprise)
        console.log('Subscription created:', session.subscription);
        // TODO: Store subscription in your database
        // await createUserSubscription({
        //   customerId: session.customer,
        //   subscriptionId: session.subscription,
        //   email: session.customer_details.email
        // });
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
      // TODO: Update user's subscription status in database
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Payment succeeded:', invoice.id);
      // TODO: Extend subscription period
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('Payment failed:', failedInvoice.id);
      // TODO: Handle failed payment (email user, etc.)
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});
```

### 5.2 Configure Webhook in Stripe Dashboard
1. Go to **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add Endpoint**
6. Copy the **Signing Secret** and add to your `.env` file

---

## 🧪 Step 6: Testing

### 6.1 Test Cards
Use these Stripe test cards:

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

### 6.2 Test Scenarios

#### Session-Based Plans
1. **Day Pass**: 
   - Go to pricing page
   - Click "Get Day Pass"
   - Complete checkout with test card
   - Verify session is created locally
   - Check session status component shows time remaining

2. **Week Pass**:
   - Same flow as Day Pass
   - Verify 7-day duration

#### Subscription Plans
1. **Starter Plan**:
   - Go to pricing page
   - Click "Upgrade to Starter"
   - Complete checkout
   - Verify webhook receives subscription event

2. **Pro Plan** (repeat for Enterprise):
   - Same flow as Starter
   - Test with different email addresses

### 6.3 Local Testing with Stripe CLI
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3001/webhook

# Test webhook
stripe trigger checkout.session.completed
```

---

## 🚀 Step 7: Going Live

### 7.1 Switch to Live Mode
1. In Stripe Dashboard, toggle to **Live Mode**
2. Get your live API keys
3. Update `.env` with live keys:
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_SECRET_KEY=sk_live_your_live_key
```

### 7.2 Update Webhook URLs
1. Update webhook endpoint to your production URL
2. Get new webhook signing secret for live mode

### 7.3 Final Checklist
- [ ] Live Stripe keys configured
- [ ] Webhook endpoint updated to production URL
- [ ] All test scenarios pass
- [ ] Session management works correctly
- [ ] Subscription flows tested
- [ ] Error handling implemented
- [ ] Monitoring set up

---

## 📊 Step 8: Monitoring & Analytics

### 8.1 Key Metrics to Track
- **Conversion rates** by plan type
- **Session vs subscription** preference
- **Churn rates** for subscriptions
- **Revenue** by plan tier
- **Failed payments** and recovery

### 8.2 Stripe Dashboard Monitoring
- Monitor **Payments** for successful transactions
- Check **Subscriptions** for active/cancelled subs
- Review **Disputes** and handle chargebacks
- Track **Revenue** trends

---

## 🆘 Troubleshooting

### Common Issues

#### "No such price" error
- Verify price IDs in `src/utils/stripe.js` match Stripe Dashboard
- Check you're using the correct mode (test vs live)

#### Webhook not receiving events
- Verify webhook URL is accessible
- Check webhook signing secret is correct
- Use Stripe CLI to test locally

#### Session not activating
- Check browser console for errors
- Verify `SessionManager.createSession()` is called
- Check localStorage for session data

#### Checkout not redirecting
- Verify success/cancel URLs are correct
- Check for CORS issues with backend
- Ensure Stripe publishable key is correct

---

## 💡 Pro Tips

1. **Start with test mode** - Always test thoroughly before going live
2. **Use metadata** - Add plan info to Stripe sessions for easier tracking
3. **Handle errors gracefully** - Show user-friendly error messages
4. **Monitor webhooks** - Set up alerts for failed webhook deliveries
5. **Test edge cases** - Failed payments, cancelled subscriptions, etc.
6. **Consider annual billing** - Add yearly options with discounts later

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/checkout/quickstart)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

## 🎯 Summary

Your ProofPix hybrid pricing model is now ready! Users can choose:

- **Maximum Privacy**: Session-based passes with no account required
- **Convenience**: Account-based subscriptions with ongoing access

This gives you the best of both worlds - privacy-conscious users and recurring revenue streams.

**Next Steps**: Set up your Stripe account, create the products, and start testing! 🚀 