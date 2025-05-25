# 🚀 ProofPix Stripe Setup - Next Steps

## ✅ **What's Already Done:**

1. **Frontend Configuration Updated** ✅
   - Day Pass: `price_1RSWGB2Llp3EL08qcHedWKOU` ✅
   - Week Pass: `price_1RSWGv2Llp3EL08q0vOOSJTZ` ✅
   - Starter: `price_1RSWHb2Llp3EL08qGvoJXVXz` ✅
   - Pro: `price_1RSX6e2Llp3EL08qGBdLauKT` ✅
   - Enterprise: `price_1RSX7T2Llp3EL08qSMntcBFN` ✅

2. **Backend Server Created** ✅
   - `server.js` - Complete Express server
   - `package-backend.json` - Dependencies file
   - Webhook handling for all events

3. **All Stripe IDs Configured** ✅
   - All products and prices are ready to use

4. **Pricing Display Fixed** ✅
   - Yearly pricing now shows correct amounts and "/year" suffix
   - Session-based plans unaffected by billing toggle
   - Savings calculation corrected

## 🔧 **What You Need To Do:**

### Step 1: Create Environment Variables
Create a `.env` file in your project root with:

```bash
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Webhook Configuration (we'll add this in Step 3)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
REACT_APP_APP_URL=https://upload.proofpixapp.com
REACT_APP_API_URL=http://localhost:3001

# Server Configuration
PORT=3001
```

### Step 2: Install Backend Dependencies
```bash
# Install backend dependencies
npm install --save stripe express cors dotenv

# Optional: Install nodemon for development
npm install --save-dev nodemon
```

### Step 3: Test the Backend
```bash
# Start the backend server
node server.js

# Should see:
# 🚀 ProofPix Stripe server running on port 3001
# 📊 Health check: http://localhost:3001/health
# 🔗 Webhook endpoint: http://localhost:3001/webhook
```

### Step 4: Test Frontend Integration
```bash
# In another terminal, start your React app
npm start

# Test the pricing page:
# http://localhost:3000/pricing
```

## 🔗 **Step 5: Webhook Setup (Final Step)**

### 5.1 In Stripe Dashboard:
1. Go to **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. **Endpoint URL**: `https://yourdomain.com/webhook` (for production)
   - For testing: Use ngrok or similar to expose localhost:3001
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add Endpoint**
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Add to your `.env` file as `STRIPE_WEBHOOK_SECRET`

### 5.2 For Local Testing:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3001/webhook

# This will give you a webhook secret for testing
```

## 🧪 **Testing Checklist:**

### Session-Based Plans (No Account):
- [ ] Day Pass checkout works
- [ ] Week Pass checkout works  
- [ ] Session activates after payment
- [ ] Time remaining shows correctly

### Subscription Plans (Account Required):
- [ ] Starter plan checkout works
- [ ] Pro plan checkout works
- [ ] Enterprise plan checkout works
- [ ] Webhooks receive subscription events

### Test Cards:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

## 🚨 **Current Status:**

✅ **Ready to test**: ALL PLANS - Day Pass, Week Pass, Starter, Pro, Enterprise  
✅ **All Stripe IDs configured**: Frontend is ready to go  
⏳ **Need setup**: Environment variables, backend dependencies, webhook endpoint  

Your hybrid pricing model is now **100% configured** and ready for testing! 🎉 