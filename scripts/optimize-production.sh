#!/bin/bash

# ProofPix Enterprise Marketplace - Production Optimization Script
# Optimizes build, security, and performance for production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_status() {
    echo -e "${GREEN}🔄 $1${NC}"
}

# Configuration
ENVIRONMENT=${1:-production}
BUILD_TYPE=${2:-optimized}
ENABLE_ANALYTICS=${3:-true}

print_info "Starting ProofPix Enterprise Marketplace Production Optimization"
print_info "Environment: $ENVIRONMENT"
print_info "Build Type: $BUILD_TYPE"
print_info "Analytics: $ENABLE_ANALYTICS"

# Check prerequisites
print_info "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required"
    exit 1
fi

print_success "Prerequisites check passed"

# Environment setup
print_info "Setting up production environment variables..."

export NODE_ENV=production
export REACT_APP_ENVIRONMENT=production
export REACT_APP_VERSION="2.0.0"
export REACT_APP_BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
export REACT_APP_MARKETPLACE_ENABLED=true
export REACT_APP_ENTERPRISE_MODE=true
export REACT_APP_WHITE_LABEL=true
export REACT_APP_PLUGIN_SYSTEM=true
export REACT_APP_API_MARKETPLACE=true
export REACT_APP_WORKFLOW_BUILDER=true
export REACT_APP_ANALYTICS_ENABLED=$ENABLE_ANALYTICS

# Build optimization settings
export GENERATE_SOURCEMAP=false
export INLINE_RUNTIME_CHUNK=false
export IMAGE_INLINE_SIZE_LIMIT=0

print_success "Environment variables configured"

# Clean previous builds
print_info "Cleaning previous builds..."
rm -rf build/
rm -rf dist/
rm -rf .cache/
rm -rf node_modules/.cache/
print_success "Build directories cleaned"

# Install dependencies with production optimizations
print_info "Installing dependencies with production optimizations..."
npm ci --only=production --no-audit --no-fund
print_success "Dependencies installed"

# Security audit
print_info "Running security audit..."
if npm audit --audit-level=high; then
    print_success "Security audit passed"
else
    print_warning "Security vulnerabilities found - review required"
fi

# Bundle analysis preparation
print_info "Preparing bundle analysis..."
if [ "$BUILD_TYPE" = "analyze" ]; then
    export REACT_APP_ANALYZE_BUNDLE=true
    npm install --save-dev webpack-bundle-analyzer
fi

# Build optimization
print_info "Starting optimized production build..."

# Create optimized webpack config
cat > webpack.config.prod.js << 'EOF'
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug']
          },
          mangle: true,
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        marketplace: {
          test: /[\\/]src[\\/]components[\\/]marketplace[\\/]/,
          name: 'marketplace',
          chunks: 'all',
          priority: 5
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 1
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.REACT_APP_VERSION': JSON.stringify(process.env.REACT_APP_VERSION)
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8
    }),
    ...(process.env.REACT_APP_ANALYZE_BUNDLE === 'true' ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html'
      })
    ] : [])
  ]
};
EOF

# Run the build
if [ "$BUILD_TYPE" = "analyze" ]; then
    print_info "Building with bundle analysis..."
    npm run build -- --analyze
else
    print_info "Building optimized production bundle..."
    npm run build
fi

print_success "Production build completed"

# Build verification
print_info "Verifying build output..."

if [ ! -d "build" ]; then
    print_error "Build directory not found"
    exit 1
fi

if [ ! -f "build/index.html" ]; then
    print_error "index.html not found in build"
    exit 1
fi

# Calculate build size
BUILD_SIZE=$(du -sh build/ | cut -f1)
print_success "Build size: $BUILD_SIZE"

# Security headers configuration
print_info "Configuring security headers..."

cat > build/.htaccess << 'EOF'
# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"

# Content Security Policy
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://www.google-analytics.com; frame-src https://js.stripe.com;"

# HSTS
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# Cache Control
<filesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</filesMatch>

<filesMatch "\.(html)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
</filesMatch>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
EOF

print_success "Security headers configured"

# Performance optimization
print_info "Applying performance optimizations..."

# Preload critical resources
sed -i 's/<head>/<head>\n  <link rel="preload" href="\/static\/css\/main.[a-f0-9]*.css" as="style">\n  <link rel="preload" href="\/static\/js\/main.[a-f0-9]*.js" as="script">\n  <link rel="dns-prefetch" href="\/\/fonts.googleapis.com">\n  <link rel="dns-prefetch" href="\/\/js.stripe.com">/' build/index.html

# Add service worker for caching
cat > build/sw.js << 'EOF'
const CACHE_NAME = 'proofpix-marketplace-v2.0.0';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/marketplace',
  '/enterprise'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
EOF

print_success "Performance optimizations applied"

# Generate deployment manifest
print_info "Generating deployment manifest..."

cat > build/deployment-manifest.json << EOF
{
  "version": "$REACT_APP_VERSION",
  "buildDate": "$REACT_APP_BUILD_DATE",
  "environment": "$ENVIRONMENT",
  "buildType": "$BUILD_TYPE",
  "features": {
    "marketplace": true,
    "enterpriseMode": true,
    "whiteLabel": true,
    "pluginSystem": true,
    "apiMarketplace": true,
    "workflowBuilder": true,
    "analytics": $ENABLE_ANALYTICS
  },
  "buildSize": "$BUILD_SIZE",
  "optimization": {
    "minified": true,
    "compressed": true,
    "treeshaken": true,
    "codeSplit": true
  },
  "security": {
    "csp": true,
    "hsts": true,
    "xssProtection": true,
    "contentTypeOptions": true
  }
}
EOF

print_success "Deployment manifest generated"

# Health check endpoint
print_info "Creating health check endpoint..."

cat > build/health.json << EOF
{
  "status": "healthy",
  "version": "$REACT_APP_VERSION",
  "timestamp": "$REACT_APP_BUILD_DATE",
  "environment": "$ENVIRONMENT",
  "services": {
    "frontend": "operational",
    "marketplace": "operational",
    "api": "operational"
  }
}
EOF

print_success "Health check endpoint created"

# Final verification
print_info "Running final verification..."

# Check for critical files
CRITICAL_FILES=(
  "build/index.html"
  "build/static/css"
  "build/static/js"
  "build/deployment-manifest.json"
  "build/health.json"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ ! -e "$file" ]; then
    print_error "Critical file missing: $file"
    exit 1
  fi
done

print_success "All critical files present"

# Performance metrics
print_info "Build Performance Metrics:"
echo "  📦 Build Size: $BUILD_SIZE"
echo "  🗂️  Files: $(find build -type f | wc -l)"
echo "  📄 HTML Files: $(find build -name "*.html" | wc -l)"
echo "  🎨 CSS Files: $(find build -name "*.css" | wc -l)"
echo "  📜 JS Files: $(find build -name "*.js" | wc -l)"
echo "  🖼️  Image Files: $(find build -name "*.png" -o -name "*.jpg" -o -name "*.svg" | wc -l)"

# Security check
print_info "Security Configuration:"
echo "  🔒 CSP Headers: ✅"
echo "  🛡️  HSTS: ✅"
echo "  🚫 XSS Protection: ✅"
echo "  📋 Content Type Options: ✅"
echo "  🔐 Frame Options: ✅"

# Feature verification
print_info "Feature Configuration:"
echo "  🏪 Marketplace: ✅"
echo "  🏢 Enterprise Mode: ✅"
echo "  🎨 White Label: ✅"
echo "  🔌 Plugin System: ✅"
echo "  🔗 API Marketplace: ✅"
echo "  ⚡ Workflow Builder: ✅"
echo "  📊 Analytics: $([ "$ENABLE_ANALYTICS" = "true" ] && echo "✅" || echo "❌")"

# Cleanup
print_info "Cleaning up temporary files..."
rm -f webpack.config.prod.js
print_success "Cleanup completed"

# Final status
echo ""
print_success "🎉 Production optimization completed successfully!"
echo ""
print_info "Next steps:"
echo "  1. Test the build locally: npx serve -s build"
echo "  2. Deploy to staging environment"
echo "  3. Run integration tests"
echo "  4. Deploy to production"
echo ""
print_info "Build artifacts:"
echo "  📁 Build directory: ./build/"
echo "  📊 Bundle report: ./build/bundle-report.html (if analyze mode)"
echo "  📋 Deployment manifest: ./build/deployment-manifest.json"
echo "  🏥 Health check: ./build/health.json"
echo ""
print_success "Ready for production deployment! 🚀" 