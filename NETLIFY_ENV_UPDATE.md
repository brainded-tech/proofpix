# Update Netlify Environment Variables for Render

## 🎯 **CRITICAL: Update Netlify to Point to Render**

Go to your Netlify dashboard and update this environment variable:

### **Environment Variables to Update:**

```
REACT_APP_API_URL=https://proofpix-backend.onrender.com
```

### **Steps:**
1. Go to https://app.netlify.com
2. Select your ProofPix site
3. Go to Site Settings → Environment Variables
4. Find `REACT_APP_API_URL`
5. Update the value to: `https://proofpix-backend.onrender.com`
6. Click "Save"
7. Trigger a new deploy

### **Verify the Change:**
After deployment, your frontend will now make API calls to Render instead of Railway.

## 🔧 **Additional Steps for Render**

### **Step 3: Update Stripe Webhook URL**
1. Go to https://dashboard.stripe.com/webhooks
2. Find your webhook
3. Update the URL to: `https://proofpix-backend.onrender.com/api/stripe/webhook`
4. Test the webhook

### **Step 4: Update OAuth Redirect URLs**
If you're using OAuth, update these in Google/Microsoft consoles:
- `https://proofpix-backend.onrender.com/auth/google/callback`
- `https://proofpix-backend.onrender.com/oauth/callback`
- `https://proofpix-backend.onrender.com/api/auth/google/callback`

### **Step 5: Test Everything**
1. Deploy your frontend changes to Netlify
2. Test the health endpoint: `https://proofpix-backend.onrender.com/health`
3. Test a payment flow
4. Verify all API calls are working

## ✅ **You're Done!**

Your app is now running on:
- **Frontend**: Netlify (upload.proofpixapp.com)
- **Backend**: Render (proofpix-backend.onrender.com)
- **Database**: Render PostgreSQL + Redis

Much more reliable than Railway! 🎉 