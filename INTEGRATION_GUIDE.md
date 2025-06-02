# 🚀 ProofPix Stripe Integration Setup Guide

## ✅ What's Been Implemented

### 1. 15% Discount Exit-Intent Popup
- **Component**: `src/components/DiscountPopup.tsx`
- **Hook**: `src/hooks/useExitIntent.ts`
- **Manager**: `src/components/GlobalDiscountManager.tsx`
- **Features**:
  - Exit-intent detection (mouse leaving viewport)
  - 5-minute countdown timer
  - 15% discount offer
  - Analytics tracking
  - Local storage to prevent repeat shows

### 2. One-Click Enterprise Setup
- **Component**: `src/components/OneClickEnterpriseSetup.tsx`
- **Netlify Function**: `netlify/functions/create-enterprise-checkout.js`
- **Features**:
  - Instant account provisioning
  - API key generation
  - Enterprise dashboard access
  - Real-time setup progress
  - Copy-to-clipboard credentials

## 🔧 Tech Team Action Items

### 1. Add Routes to App.tsx
```typescript
// Add these imports at the top
import { OneClickEnterpriseSetup } from './components/OneClickEnterpriseSetup';
import { GlobalDiscountManager } from './components/GlobalDiscountManager';

// Add these routes in your Routes component
<Route path="/enterprise/setup" element={<OneClickEnterpriseSetup />} />
<Route path="/enterprise/setup/:planType" element={<OneClickEnterpriseSetup />} />

// Add this component at the end of your App component (before closing div)
<GlobalDiscountManager />
```

### 2. Create Stripe Products
```bash
# Professional Plan
stripe products create --name="Professional Plan" --description="For professionals and small teams"
stripe prices create --product=prod_xxx --unit-amount=2900 --currency=usd --recurring[interval]=month

# Enterprise Standard
stripe products create --name="Enterprise Standard" --description="For large organizations"
stripe prices create --product=prod_xxx --unit-amount=49900 --currency=usd --recurring[interval]=month

# Enterprise Plus
stripe products create --name="Enterprise Plus" --description="Premium enterprise features"
stripe prices create --product=prod_xxx --unit-amount=99900 --currency=usd --recurring[interval]=month
```

### 3. Environment Variables
Add these to your `.env` file and Netlify environment:

```bash
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
STRIPE_SECRET_KEY=sk_live_your_key_here

# Enterprise Price IDs (from step 2)
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_standard_id
STRIPE_ENTERPRISE_PLUS_PRICE_ID=price_enterprise_plus_id
STRIPE_ENTERPRISE_CUSTOM_PRICE_ID=price_enterprise_custom_id

# Site URL
URL=https://upload.proofpixapp.com
```

### 4. Update Existing Price IDs
In `src/utils/stripe.js`, replace placeholder price IDs with real ones:

```javascript
export const PRICING_PLANS = {
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 29,
    stripePriceId: 'price_your_professional_id_here', // Replace placeholder
    // ... rest of config
  },
  // ... other plans
};
```

## 🎯 User Experience Flow

### Discount Popup Flow
1. User visits any page (except checkout/enterprise/pricing)
2. After 10 seconds, exit-intent detection activates
3. When mouse leaves viewport, popup appears
4. User sees 15% discount with 5-minute countdown
5. Clicking "Claim Discount" → `/checkout?plan=professional&source=exit_intent&offer=discount&discount=15`
6. Popup won't show again (localStorage flag)

### One-Click Enterprise Setup Flow
1. User clicks "One-Click Enterprise Setup" on Enterprise page
2. Shows plan details and instant setup promise
3. Clicking "Start Enterprise Setup Now" triggers:
   - Account ID generation
   - API key creation
   - Stripe checkout session creation
   - Progress animation (30-60 seconds)
4. Shows completion screen with:
   - Account credentials (copy-to-clipboard)
   - Dashboard access link
   - Setup documentation links
   - Next steps guide

## 🔒 Security Considerations

### Account Provisioning
- Account IDs are generated with timestamp + random string
- API keys use secure random generation
- All credentials are shown only once
- Session storage for temporary data only

### Payment Security
- All Stripe integration follows best practices
- Customer data stored in Stripe, not locally
- Webhook verification for payment confirmations
- Development mode graceful fallbacks

## 📊 Analytics Tracking

### Events Tracked
```javascript
// Discount popup events
gtag('event', 'discount_popup_conversion', {
  event_category: 'conversion',
  event_label: '15% exit intent discount',
  value: 15
});

// Enterprise setup events
gtag('event', 'enterprise_one_click_setup', {
  event_category: 'conversion',
  event_label: planType,
  value: planAmount
});
```

## 🧪 Testing

### Development Mode
- Both features work in development with mock responses
- Stripe checkout shows simulation alerts
- All UI flows functional without real payments

### Production Testing
1. Test discount popup on staging environment
2. Verify exit-intent detection works across browsers
3. Test enterprise setup with test Stripe keys
4. Confirm email notifications work
5. Validate analytics tracking

## 🚨 Deployment Checklist

- [ ] Add routes to App.tsx
- [ ] Create Stripe products and get price IDs
- [ ] Update environment variables
- [ ] Replace placeholder price IDs
- [ ] Test discount popup functionality
- [ ] Test enterprise setup flow
- [ ] Verify analytics tracking
- [ ] Test email notifications
- [ ] Deploy to staging first
- [ ] Full production testing

## 💡 Optional Enhancements

### Future Improvements
1. **A/B Testing**: Test different discount percentages
2. **Smart Timing**: Adjust popup timing based on page engagement
3. **Personalization**: Different offers for different user segments
4. **Enterprise Onboarding**: Automated welcome email sequences
5. **Usage Analytics**: Track feature adoption post-setup

## 🆘 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify environment variables are set
3. Test with Stripe test keys first
4. Check Netlify function logs
5. Contact development team with specific error messages

---

**Status**: ✅ Ready for integration
**Estimated Setup Time**: 2-3 hours
**Dependencies**: Stripe account, environment variables
**Testing Required**: Yes (staging environment recommended) 