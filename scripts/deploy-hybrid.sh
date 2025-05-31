#!/bin/bash

# ProofPix Hybrid Deployment Script
# Handles both open source and proprietary deployments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_TYPE=${1:-"opensource"}
ENVIRONMENT=${2:-"development"}

echo -e "${BLUE}🚀 ProofPix Hybrid Deployment Script${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Validate deployment type
if [[ "$DEPLOYMENT_TYPE" != "opensource" && "$DEPLOYMENT_TYPE" != "proprietary" && "$DEPLOYMENT_TYPE" != "full" ]]; then
    print_error "Invalid deployment type. Use: opensource, proprietary, or full"
    echo ""
    echo "Usage: $0 [deployment_type] [environment]"
    echo "  deployment_type: opensource | proprietary | full"
    echo "  environment: development | staging | production"
    exit 1
fi

print_info "Deployment Type: $DEPLOYMENT_TYPE"
print_info "Environment: $ENVIRONMENT"
echo ""

# Check prerequisites
print_info "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed"
    exit 1
fi
print_status "Node.js found"

if ! command -v npm &> /dev/null; then
    print_error "npm is required but not installed"
    exit 1
fi
print_status "npm found"

# Install dependencies
print_info "Installing dependencies..."
npm install
print_status "Dependencies installed"

# Open Source Deployment
if [[ "$DEPLOYMENT_TYPE" == "opensource" || "$DEPLOYMENT_TYPE" == "full" ]]; then
    print_info "Preparing open source deployment..."
    
    # Ensure proprietary files are gitignored
    if [ -f ".gitignore" ]; then
        if ! grep -q "# PROPRIETARY AI/ML COMPONENTS" .gitignore; then
            print_warning "Proprietary sections not found in .gitignore"
            print_info "Adding proprietary sections to .gitignore..."
            cat >> .gitignore << 'EOF'

# ===== PROPRIETARY AI/ML COMPONENTS (HYBRID MODEL) =====
# These files contain proprietary AI algorithms and models
# and are kept private to maintain competitive advantage

# AI Model Files
/src/ai/models/
/src/ai/training/
/src/ai/algorithms/
/backend/ai/models/
/backend/ai/training/
/backend/ml/

# Proprietary AI Services
/src/services/proprietary/
/backend/services/proprietary/
**/proprietary/**
EOF
        fi
        print_status "Proprietary files properly gitignored"
    fi
    
    # Create open source build
    print_info "Building open source version..."
    
    # Set environment variables for open source build
    export REACT_APP_DEPLOYMENT_TYPE="opensource"
    export REACT_APP_AI_FEATURES="basic"
    
    npm run build
    print_status "Open source build completed"
    
    # Copy open source README
    if [ -f "README_OPENSOURCE.md" ]; then
        cp README_OPENSOURCE.md build/README.md
        print_status "Open source README copied"
    fi
fi

# Proprietary Deployment
if [[ "$DEPLOYMENT_TYPE" == "proprietary" || "$DEPLOYMENT_TYPE" == "full" ]]; then
    print_info "Preparing proprietary deployment..."
    
    # Check if proprietary components exist
    if [ ! -d "src/services/proprietary" ]; then
        print_warning "Proprietary AI services directory not found"
        print_info "Creating proprietary directory structure..."
        mkdir -p src/services/proprietary
        mkdir -p src/ai/{models,training,algorithms,industry}
        mkdir -p src/analytics/proprietary
        mkdir -p src/components/ai/{premium,enterprise}
        mkdir -p backend/ai/{models,training,industry}
        mkdir -p backend/services/proprietary
        mkdir -p data/{training,models}
        mkdir -p config/ai
    fi
    
    # Check for proprietary AI service
    if [ ! -f "src/services/proprietary/aiService.ts" ]; then
        print_warning "Proprietary AI service not found"
        print_info "This appears to be an open source deployment"
        print_info "Proprietary features will show upgrade prompts"
    else
        print_status "Proprietary AI services found"
    fi
    
    # Set environment variables for proprietary build
    export REACT_APP_DEPLOYMENT_TYPE="proprietary"
    export REACT_APP_AI_FEATURES="advanced"
    
    if [[ "$DEPLOYMENT_TYPE" == "proprietary" ]]; then
        npm run build
        print_status "Proprietary build completed"
    fi
fi

# Environment-specific configuration
print_info "Configuring for $ENVIRONMENT environment..."

case $ENVIRONMENT in
    "development")
        export REACT_APP_API_URL="http://localhost:3001"
        export REACT_APP_STRIPE_PUBLISHABLE_KEY="pk_test_..."
        print_status "Development configuration applied"
        ;;
    "staging")
        export REACT_APP_API_URL="https://api-staging.proofpix.com"
        export REACT_APP_STRIPE_PUBLISHABLE_KEY="pk_test_..."
        print_status "Staging configuration applied"
        ;;
    "production")
        export REACT_APP_API_URL="https://api.proofpix.com"
        export REACT_APP_STRIPE_PUBLISHABLE_KEY="pk_live_..."
        print_status "Production configuration applied"
        ;;
esac

# Generate deployment summary
print_info "Generating deployment summary..."

cat > deployment-summary.json << EOF
{
  "deploymentType": "$DEPLOYMENT_TYPE",
  "environment": "$ENVIRONMENT",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "features": {
    "openSourceCore": true,
    "basicAI": true,
    "advancedAI": $([ "$DEPLOYMENT_TYPE" == "proprietary" ] || [ "$DEPLOYMENT_TYPE" == "full" ] && echo "true" || echo "false"),
    "proprietaryModels": $([ -f "src/services/proprietary/aiService.ts" ] && echo "true" || echo "false")
  },
  "components": {
    "privacyEngine": "open-source",
    "basicAI": "open-source",
    "advancedAI": "$([ "$DEPLOYMENT_TYPE" == "opensource" ] && echo "upgrade-required" || echo "available")",
    "industryModels": "$([ "$DEPLOYMENT_TYPE" == "opensource" ] && echo "subscription-required" || echo "available")"
  }
}
EOF

print_status "Deployment summary generated"

# Final status
echo ""
print_info "Deployment Summary:"
echo "  Type: $DEPLOYMENT_TYPE"
echo "  Environment: $ENVIRONMENT"
echo "  Open Source Core: ✓ Available"
echo "  Basic AI Features: ✓ Available"

if [[ "$DEPLOYMENT_TYPE" == "opensource" ]]; then
    echo "  Advanced AI Features: ⚠ Requires subscription"
    echo "  Industry Models: ⚠ Requires subscription"
    echo "  Custom Training: ⚠ Requires subscription"
else
    echo "  Advanced AI Features: ✓ Available"
    echo "  Industry Models: ✓ Available"
    echo "  Custom Training: ✓ Available"
fi

echo ""
print_status "Deployment completed successfully!"

if [[ "$DEPLOYMENT_TYPE" == "opensource" ]]; then
    echo ""
    print_info "Open Source Deployment Notes:"
    echo "  • Privacy engine is fully functional and auditable"
    echo "  • Basic AI features are available without subscription"
    echo "  • Advanced AI features will show upgrade prompts"
    echo "  • Users can upgrade to access proprietary features"
    echo ""
    print_info "To enable proprietary features:"
    echo "  1. Obtain ProofPix subscription"
    echo "  2. Deploy with proprietary components"
    echo "  3. Configure subscription validation"
fi

if [[ "$ENVIRONMENT" == "development" ]]; then
    echo ""
    print_info "Development server can be started with:"
    echo "  npm start"
fi

echo ""
print_info "For more information, see:"
echo "  • HYBRID_ARCHITECTURE.md - Technical architecture"
echo "  • README_OPENSOURCE.md - Open source documentation"
echo "  • deployment-summary.json - This deployment's details" 