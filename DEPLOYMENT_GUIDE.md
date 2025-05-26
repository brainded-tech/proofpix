# ProofPix Deployment Guide

## 🚀 Deployment Overview

This guide covers complete deployment strategies for ProofPix, from local development to production hosting, including CI/CD pipelines, monitoring, and maintenance procedures.

## 🎯 Deployment Philosophy

### **Static-First Architecture**
- Client-side processing eliminates server dependencies
- Static hosting provides infinite scalability
- CDN distribution ensures global performance
- Minimal infrastructure costs

### **Privacy-Compliant Deployment**
- No server-side data processing
- Minimal analytics and tracking
- GDPR/CCPA compliant by design
- Transparent data handling

## 🏗️ Environment Setup

### **Development Environment**

#### **Prerequisites**
```bash
# Required software
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.30.0

# Optional but recommended
VS Code with extensions:
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
```

#### **Local Setup**
```bash
# Clone repository
git clone https://github.com/yourusername/proofpix.git
cd proofpix

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm start
```

#### **Environment Variables**
```bash
# .env.local (development)
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.8.0
REACT_APP_API_URL=http://localhost:3002

# Payment processing (optional for core functionality)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Analytics (privacy-safe)
REACT_APP_ANALYTICS_ENABLED=false
REACT_APP_ERROR_REPORTING_ENABLED=true

# Feature flags
REACT_APP_BATCH_PROCESSING_ENABLED=true
REACT_APP_VIDEO_METADATA_ENABLED=false
REACT_APP_ENTERPRISE_FEATURES_ENABLED=false
```

### **Staging Environment**

#### **Staging Configuration**
```bash
# .env.staging
REACT_APP_ENVIRONMENT=staging
REACT_APP_VERSION=1.8.0
REACT_APP_API_URL=https://api-staging.proofpixapp.com

# Staging Stripe keys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Limited analytics for testing
REACT_APP_ANALYTICS_ENABLED=true
REACT_APP_ERROR_REPORTING_ENABLED=true

# All features enabled for testing
REACT_APP_BATCH_PROCESSING_ENABLED=true
REACT_APP_VIDEO_METADATA_ENABLED=true
REACT_APP_ENTERPRISE_FEATURES_ENABLED=true
```

### **Production Environment**

#### **Production Configuration**
```bash
# .env.production
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.8.0
REACT_APP_API_URL=https://api.proofpixapp.com

# Production Stripe keys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Minimal analytics
REACT_APP_ANALYTICS_ENABLED=true
REACT_APP_ERROR_REPORTING_ENABLED=true

# Production feature flags
REACT_APP_BATCH_PROCESSING_ENABLED=true
REACT_APP_VIDEO_METADATA_ENABLED=false
REACT_APP_ENTERPRISE_FEATURES_ENABLED=true
```

## 📦 Build Process

### **Development Build**
```bash
# Start development server with hot reload
npm start

# Development server runs on http://localhost:3001
# Features:
# - Hot module replacement
# - Source maps
# - Unminified code
# - Development error overlay
```

### **Production Build**
```bash
# Create optimized production build
npm run build

# Build output in build/ directory:
build/
├── static/
│   ├── css/           # Minified CSS files
│   ├── js/            # Minified JavaScript bundles
│   └── media/         # Optimized images and fonts
├── index.html         # Main HTML file
├── manifest.json      # PWA manifest
└── service-worker.js  # Service worker for caching
```

### **Build Optimization**

#### **Webpack Configuration**
```javascript
// Custom webpack optimizations (if ejected)
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
```

#### **Bundle Analysis**
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Performance budgets
# - Initial bundle: < 250KB gzipped
# - Vendor bundle: < 500KB gzipped
# - Total assets: < 2MB
```

## 🌐 Hosting Options

### **1. Netlify (Recommended)**

#### **Netlify Configuration**
```toml
# netlify.toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://api.stripe.com;"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### **Deployment Steps**
```bash
# 1. Connect repository to Netlify
# 2. Configure build settings:
#    - Build command: npm run build
#    - Publish directory: build
#    - Node version: 18

# 3. Set environment variables in Netlify dashboard
# 4. Enable automatic deployments from main branch
# 5. Configure custom domain and SSL
```

### **2. Vercel**

#### **Vercel Configuration**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### **3. AWS S3 + CloudFront**

#### **S3 Bucket Configuration**
```bash
# Create S3 bucket
aws s3 mb s3://proofpix-app

# Configure bucket for static website hosting
aws s3 website s3://proofpix-app \
  --index-document index.html \
  --error-document index.html

# Set bucket policy for public read access
aws s3api put-bucket-policy \
  --bucket proofpix-app \
  --policy file://bucket-policy.json
```

#### **CloudFront Distribution**
```json
{
  "DistributionConfig": {
    "CallerReference": "proofpix-distribution",
    "Origins": [
      {
        "Id": "S3-proofpix-app",
        "DomainName": "proofpix-app.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ],
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-proofpix-app",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    },
    "CustomErrorResponses": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": 200
      }
    ]
  }
}
```

### **4. GitHub Pages**

#### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_ENVIRONMENT: production
          REACT_APP_VERSION: ${{ github.sha }}
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**

#### **Complete CI/CD Pipeline**
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
      
      - name: Install Playwright
        run: npx playwright install
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload E2E test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          REACT_APP_ENVIRONMENT: production
          REACT_APP_VERSION: ${{ github.sha }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: build/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: build/
      
      - name: Deploy to staging
        run: |
          # Deploy to staging environment
          # This could be Netlify, Vercel, or custom deployment
          echo "Deploying to staging..."

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: build/
      
      - name: Deploy to production
        run: |
          # Deploy to production environment
          echo "Deploying to production..."
      
      - name: Create release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          draft: false
          prerelease: false
```

### **Quality Gates**

#### **Pre-deployment Checks**
```yaml
# Quality gate job
quality-gate:
  runs-on: ubuntu-latest
  steps:
    - name: Check test coverage
      run: |
        COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
        if (( $(echo "$COVERAGE < 90" | bc -l) )); then
          echo "Coverage $COVERAGE% is below 90% threshold"
          exit 1
        fi
    
    - name: Check bundle size
      run: |
        BUNDLE_SIZE=$(stat -c%s build/static/js/*.js | awk '{sum+=$1} END {print sum}')
        MAX_SIZE=262144  # 256KB
        if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
          echo "Bundle size $BUNDLE_SIZE exceeds $MAX_SIZE bytes"
          exit 1
        fi
    
    - name: Security audit
      run: npm audit --audit-level=high
    
    - name: Performance budget check
      run: npm run lighthouse:ci
```

## 📊 Monitoring & Analytics

### **Performance Monitoring**

#### **Web Vitals Tracking**
```typescript
// src/utils/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // Send to privacy-safe analytics
  if (process.env.REACT_APP_ANALYTICS_ENABLED === 'true') {
    // Implementation depends on chosen analytics provider
    console.log('Performance metric:', metric);
  }
};

// Track Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### **Custom Performance Metrics**
```typescript
// src/utils/customMetrics.ts
export const trackMetadataExtractionTime = (startTime: number) => {
  const duration = performance.now() - startTime;
  
  // Track processing time
  if (duration > 5000) {
    console.warn('Slow metadata extraction:', duration);
  }
  
  // Send to analytics (privacy-safe)
  sendMetric('metadata_extraction_time', duration);
};

export const trackFileSize = (size: number) => {
  const sizeCategory = size > 10 * 1024 * 1024 ? 'large' : 
                      size > 1 * 1024 * 1024 ? 'medium' : 'small';
  
  sendMetric('file_size_category', sizeCategory);
};
```

### **Error Monitoring**

#### **Error Tracking Setup**
```typescript
// src/utils/errorTracking.ts
class ErrorTracker {
  private errors: AppError[] = [];
  
  trackError(error: Error, context?: Record<string, any>) {
    const appError: AppError = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.errors.push(appError);
    
    // Send to error tracking service (privacy-compliant)
    this.sendToErrorService(appError);
  }
  
  private sendToErrorService(error: AppError) {
    // Implementation for error reporting
    // Ensure no sensitive user data is included
    if (process.env.REACT_APP_ERROR_REPORTING_ENABLED === 'true') {
      // Send to error tracking service
    }
  }
}

export const errorTracker = new ErrorTracker();
```

### **Health Checks**

#### **Application Health Monitoring**
```typescript
// src/utils/healthCheck.ts
export const performHealthCheck = async (): Promise<HealthStatus> => {
  const checks = {
    metadataExtraction: await testMetadataExtraction(),
    pdfGeneration: await testPdfGeneration(),
    localStorage: testLocalStorage(),
    webWorkers: testWebWorkers()
  };
  
  const allHealthy = Object.values(checks).every(check => check.healthy);
  
  return {
    status: allHealthy ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date()
  };
};

const testMetadataExtraction = async () => {
  try {
    // Test with small sample image
    const testResult = await extractMetadata(createTestFile());
    return { healthy: true, responseTime: performance.now() };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};
```

## 🔧 Maintenance & Updates

### **Dependency Management**

#### **Regular Updates**
```bash
# Check for outdated packages
npm outdated

# Update dependencies (patch versions)
npm update

# Update major versions (carefully)
npm install package@latest

# Security audit and fixes
npm audit
npm audit fix
```

#### **Automated Dependency Updates**
```yaml
# .github/workflows/dependency-update.yml
name: Dependency Updates

on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday

jobs:
  update-dependencies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Update dependencies
        run: |
          npm update
          npm audit fix
      
      - name: Run tests
        run: npm test
      
      - name: Create pull request
        uses: peter-evans/create-pull-request@v4
        with:
          title: 'chore: update dependencies'
          body: 'Automated dependency updates'
          branch: dependency-updates
```

### **Performance Optimization**

#### **Bundle Size Monitoring**
```bash
# Monitor bundle size over time
npm install -g bundlesize

# Add to package.json
{
  "bundlesize": [
    {
      "path": "./build/static/js/*.js",
      "maxSize": "250kb"
    },
    {
      "path": "./build/static/css/*.css",
      "maxSize": "50kb"
    }
  ]
}

# Run in CI
npm run bundlesize
```

#### **Performance Audits**
```bash
# Regular Lighthouse audits
npm install -g lighthouse

# Audit production site
lighthouse https://proofpixapp.com \
  --output=json \
  --output-path=./lighthouse-report.json \
  --chrome-flags="--headless"

# Performance budget enforcement
lighthouse https://proofpixapp.com \
  --budget-path=./budget.json \
  --output=json
```

### **Security Maintenance**

#### **Security Scanning**
```bash
# Regular security audits
npm audit

# Dependency vulnerability scanning
npm install -g snyk
snyk test
snyk monitor

# OWASP dependency check
dependency-check --project ProofPix --scan ./
```

#### **Content Security Policy Updates**
```javascript
// Regular CSP review and updates
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "blob:"],
  'connect-src': ["'self'", "https://api.stripe.com"],
  'font-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};
```

## 🚨 Incident Response

### **Deployment Rollback**

#### **Quick Rollback Procedure**
```bash
# Netlify rollback
netlify sites:list
netlify api listSiteDeploys --site-id=SITE_ID
netlify api restoreSiteDeploy --site-id=SITE_ID --deploy-id=DEPLOY_ID

# Vercel rollback
vercel --prod --confirm

# AWS CloudFront invalidation
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

### **Emergency Procedures**

#### **Critical Issue Response**
1. **Immediate Actions**
   - Assess impact and severity
   - Implement temporary fix or rollback
   - Communicate with stakeholders

2. **Investigation**
   - Gather logs and error reports
   - Identify root cause
   - Document findings

3. **Resolution**
   - Implement permanent fix
   - Test thoroughly
   - Deploy with monitoring

4. **Post-Incident**
   - Conduct post-mortem
   - Update procedures
   - Implement preventive measures

## 📋 Deployment Checklist

### **Pre-Deployment**
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security audit passed
- [ ] Performance budget met
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Backup procedures verified

### **Deployment**
- [ ] Build successful
- [ ] Staging deployment tested
- [ ] Production deployment executed
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] CDN cache invalidated

### **Post-Deployment**
- [ ] Functionality verified
- [ ] Performance metrics checked
- [ ] Error rates monitored
- [ ] User feedback collected
- [ ] Documentation updated
- [ ] Team notified

---

*This deployment guide is maintained by the Technical Analysis Lead and updated with each infrastructure change. For specific hosting platform details, consult the respective platform documentation.* 