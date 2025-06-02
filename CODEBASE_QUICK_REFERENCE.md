# ProofPix Codebase Quick Reference

## System Overview
Enterprise document processing platform with AI/ML, marketplace, and privacy-first architecture.

## Tech Stack
- React 18 + TypeScript + Tailwind CSS
- React Router v6, Custom Auth, Lucide Icons

## Authentication (Current: Test Mode)
**Provider**: `TestAuthProvider` (src/components/auth/TestAuthProvider.tsx)
**Test Credentials**: All use password `test123`
- `admin@proofpix.com` - Full access
- `enterprise@proofpix.com` - Business features  
- `standard@proofpix.com` - Limited features
- `free@proofpix.com` - Basic features

## Key Enterprise Features

### 1. ROI Dashboard
**File**: `src/components/enterprise/ROIMeasurementDashboard.tsx`
**Route**: `/enterprise/roi-dashboard`
**Features**: Real-time ROI (285%), cost savings ($355K), benchmarks

### 2. Compliance Templates  
**File**: `src/components/enterprise/ComplianceDocumentationTemplates.tsx`
**Route**: `/enterprise/compliance-templates`
**Features**: HIPAA/SOX/GDPR templates, checklists, gap analysis

### 3. Marketplace
**File**: `src/components/marketplace/EnterpriseMarketplaceDashboard.tsx`
**Routes**: `/marketplace`, `/marketplace/plugins`, `/marketplace/developer`
**Features**: Plugin management, workflow builder, white-label

### 4. AI Document Intelligence
**File**: `src/services/documentIntelligenceService.ts`
**Routes**: `/ai/document-intelligence`, `/ai/document-classification`
**Features**: 7 doc types, smart recommendations, workflow automation

## Critical Routes
```
/auth/login - Test login with credentials above
/enterprise/roi-dashboard - ROI calculations
/marketplace - Plugin system
/ai/document-intelligence - AI processing
/enterprise/compliance-templates - Compliance docs
```

## Directory Structure
```
src/
├── components/
│   ├── auth/ - Authentication
│   ├── enterprise/ - Enterprise features
│   ├── marketplace/ - Plugin marketplace
│   ├── ai/ - AI/ML components
│   └── demo/ - Demo/staging
├── pages/ - Page components
├── services/ - Business logic
├── hooks/ - Custom React hooks
└── utils/ - Utilities
```

## Quick Start Testing
1. `npm start`
2. Go to `http://localhost:3000/auth/login`
3. Click "Use" next to Enterprise account
4. Test critical routes above

## Key Services
- `documentIntelligenceService.ts` - AI processing
- `industryAIPackagesService.ts` - Enterprise AI packages
- `demoDataService.ts` - Demo environment

## Current Status
✅ Authentication working with test users
✅ All Enterprise features accessible  
✅ Marketplace fully functional
✅ AI features complete
✅ ROI dashboard operational
🔧 Minor import conflicts being resolved

## For New Team Members
Focus on Enterprise features (revenue critical), test with enterprise@proofpix.com account, all major functionality is implemented and testable. 