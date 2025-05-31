# Custom Domain Setup for ProofPix Enterprise API

## Overview
Setting up a custom domain for your Railway deployment provides several benefits:
- **Professional branding** (api.proofpixapp.com instead of web-production-b12a8.up.railway.app)
- **SSL certificate management** (automatic HTTPS)
- **Better SEO and trust** for enterprise customers
- **Consistent API URLs** that don't change with deployments

## Prerequisites
- A domain name you own (e.g., proofpixapp.com)
- Access to your domain's DNS settings
- Railway project deployed and running

## Step-by-Step Setup

### 1. **Purchase/Configure Your Domain**
If you don't have a domain yet:
- Purchase from providers like Namecheap, GoDaddy, or Cloudflare
- For enterprise use, consider: `api.yourcompany.com` or `proofpix-api.yourcompany.com`

### 2. **Add Custom Domain in Railway**

#### Option A: Using Railway CLI
```bash
# Navigate to your project directory
cd /path/to/proofpixfinal

# Add custom domain
railway domain add api.proofpixapp.com

# Verify domain was added
railway domain list
```

#### Option B: Using Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Navigate to your project: "adventurous-quietude"
3. Click on the "web" service
4. Go to "Settings" → "Domains"
5. Click "Add Domain"
6. Enter your custom domain: `api.proofpixapp.com`
7. Click "Add"

### 3. **Configure DNS Records**

Railway will provide you with DNS configuration details. You'll need to add these records to your domain:

#### For Root Domain (api.proofpixapp.com):
```
Type: CNAME
Name: api
Value: web-production-b12a8.up.railway.app
TTL: 300 (or Auto)
```

#### For Subdomain (api.yourcompany.com):
```
Type: CNAME
Name: api
Value: web-production-b12a8.up.railway.app
TTL: 300 (or Auto)
```

### 4. **DNS Provider-Specific Instructions**

#### Cloudflare:
1. Log into Cloudflare dashboard
2. Select your domain
3. Go to "DNS" → "Records"
4. Click "Add record"
5. Type: CNAME, Name: api, Target: web-production-b12a8.up.railway.app
6. Ensure "Proxy status" is set to "Proxied" (orange cloud)

#### Namecheap:
1. Log into Namecheap account
2. Go to "Domain List" → "Manage"
3. Click "Advanced DNS"
4. Add new record: Type: CNAME Record, Host: api, Value: web-production-b12a8.up.railway.app

#### GoDaddy:
1. Log into GoDaddy account
2. Go to "My Products" → "DNS"
3. Click "Add" → "CNAME"
4. Name: api, Value: web-production-b12a8.up.railway.app

### 5. **SSL Certificate Setup**

Railway automatically provisions SSL certificates for custom domains:
- **Automatic**: Railway uses Let's Encrypt for free SSL certificates
- **Renewal**: Certificates auto-renew before expiration
- **Verification**: May take 5-15 minutes to provision

### 6. **Verification and Testing**

#### Check DNS Propagation:
```bash
# Check if DNS has propagated
nslookup api.proofpixapp.com

# Or use online tools:
# - whatsmydns.net
# - dnschecker.org
```

#### Test API Endpoints:
```bash
# Test health endpoint
curl https://api.proofpixapp.com/health

# Test API documentation
curl https://api.proofpixapp.com/api/docs

# Test with your frontend
# Update API_CONFIG.PRODUCTION_URL to 'https://api.proofpixapp.com'
```

### 7. **Update Application Configuration**

Once your custom domain is working, update your configuration:

```javascript
// src/config/api.config.js
export const API_CONFIG = {
  PRODUCTION_URL: 'https://api.proofpixapp.com', // Updated!
  DEVELOPMENT_URL: 'http://localhost:3001',
  // ... rest of config
};
```

### 8. **Advanced Configuration Options**

#### Multiple Domains:
```bash
# Add multiple domains for different environments
railway domain add api.proofpixapp.com          # Production
railway domain add api-staging.proofpixapp.com  # Staging
railway domain add api-dev.proofpixapp.com      # Development
```

#### Domain Redirects:
If you want to redirect the old Railway URL to your custom domain:
```javascript
// Add to server.js
app.use((req, res, next) => {
  if (req.headers.host === 'web-production-b12a8.up.railway.app') {
    return res.redirect(301, `https://api.proofpixapp.com${req.url}`);
  }
  next();
});
```

## Troubleshooting

### Common Issues:

#### 1. **DNS Not Propagating**
- Wait 24-48 hours for full global propagation
- Clear your local DNS cache: `sudo dscacheutil -flushcache` (macOS)
- Try accessing from different networks/devices

#### 2. **SSL Certificate Issues**
- Ensure CNAME record is correct
- Wait 15-30 minutes for certificate provisioning
- Check Railway dashboard for certificate status

#### 3. **Domain Not Working**
```bash
# Check Railway domain status
railway domain list

# Check if domain is properly configured
curl -I https://api.proofpixapp.com
```

#### 4. **Mixed Content Warnings**
- Ensure all API calls use HTTPS
- Update any hardcoded HTTP URLs in your frontend

### Getting Help:
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Support: support@railway.app

## Security Considerations

### 1. **CORS Configuration**
Update CORS settings for your custom domain:
```javascript
// server.js
app.use(cors({
  origin: [
    'https://proofpixapp.com',
    'https://www.proofpixapp.com',
    'https://app.proofpixapp.com'
  ],
  credentials: true
}));
```

### 2. **API Rate Limiting**
Consider implementing domain-specific rate limiting:
```javascript
// Different limits for different domains
const getDomainLimits = (req) => {
  const host = req.headers.host;
  if (host === 'api.proofpixapp.com') {
    return { windowMs: 15 * 60 * 1000, max: 1000 }; // Production limits
  }
  return { windowMs: 15 * 60 * 1000, max: 100 }; // Default limits
};
```

## Cost Considerations

### Railway Pricing:
- **Custom domains**: Free on all plans
- **SSL certificates**: Free (Let's Encrypt)
- **Bandwidth**: Included in Railway plan pricing
- **Compute**: Based on usage (current deployment uses minimal resources)

### Domain Costs:
- **.com domains**: $10-15/year
- **.app domains**: $20-25/year (good for APIs)
- **.dev domains**: $15-20/year (developer-focused)

## Best Practices

1. **Use subdomains**: `api.yourcompany.com` instead of `yourcompany.com/api`
2. **Plan for environments**: `api-staging.yourcompany.com`, `api-dev.yourcompany.com`
3. **Monitor uptime**: Set up monitoring for your custom domain
4. **Document changes**: Update API documentation with new URLs
5. **Gradual migration**: Test thoroughly before switching production traffic

## Example Implementation

Here's how to implement the custom domain in your ProofPix application:

```javascript
// src/config/environments.js
const ENVIRONMENTS = {
  production: {
    apiUrl: 'https://api.proofpixapp.com',
    frontendUrl: 'https://proofpixapp.com'
  },
  staging: {
    apiUrl: 'https://api-staging.proofpixapp.com',
    frontendUrl: 'https://staging.proofpixapp.com'
  },
  development: {
    apiUrl: 'http://localhost:3001',
    frontendUrl: 'http://localhost:3000'
  }
};

export const getCurrentEnvironment = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'proofpixapp.com' || hostname === 'www.proofpixapp.com') {
    return ENVIRONMENTS.production;
  } else if (hostname === 'staging.proofpixapp.com') {
    return ENVIRONMENTS.staging;
  } else {
    return ENVIRONMENTS.development;
  }
};
```

This setup provides a professional, scalable foundation for your ProofPix Enterprise API! 