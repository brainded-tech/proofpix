import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Shield, 
  Zap, 
  Globe, 
  Server, 
  Cloud,
  Settings,
  CheckCircle,
  Code,
  Monitor,
  Database,
  ArrowRight,
  Copy,
  Terminal,
  AlertTriangle,
  Users,
  Lock,
  Eye
} from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';

const DeploymentGuide: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const deploymentOptions = [
    {
      platform: 'Netlify',
      description: 'Fastest deployment with automatic builds and CDN',
      icon: <Zap className="h-6 w-6" />,
      difficulty: 'Beginner',
      features: ['Automatic builds', 'CDN distribution', 'Custom domains', 'SSL certificates'],
      buildTime: '2-3 minutes'
    },
    {
      platform: 'Vercel',
      description: 'Optimized for React applications with edge functions',
      icon: <Globe className="h-6 w-6" />,
      difficulty: 'Beginner',
      features: ['Edge functions', 'Analytics', 'Preview deployments', 'Custom domains'],
      buildTime: '1-2 minutes'
    },
    {
      platform: 'AWS S3 + CloudFront',
      description: 'Enterprise-grade hosting with global distribution',
      icon: <Cloud className="h-6 w-6" />,
      difficulty: 'Intermediate',
      features: ['Global CDN', 'Custom caching', 'Advanced security', 'Cost optimization'],
      buildTime: '5-10 minutes'
    },
    {
      platform: 'GitHub Pages',
      description: 'Free hosting directly from your GitHub repository',
      icon: <Code className="h-6 w-6" />,
      difficulty: 'Beginner',
      features: ['Free hosting', 'GitHub integration', 'Custom domains', 'Automatic updates'],
      buildTime: '3-5 minutes'
    }
  ];

  const buildSteps = [
    {
      step: 'Environment Setup',
      description: 'Configure build environment and dependencies',
      commands: [
        'npm install',
        'npm run build'
      ]
    },
    {
      step: 'Build Optimization',
      description: 'Optimize bundle size and performance',
      commands: [
        'npm run analyze',
        'npm run optimize'
      ]
    },
    {
      step: 'Security Configuration',
      description: 'Set up security headers and CSP policies',
      commands: [
        'npm run security-check',
        'npm run configure-headers'
      ]
    },
    {
      step: 'Deployment',
      description: 'Deploy to production environment',
      commands: [
        'npm run deploy',
        'npm run verify-deployment'
      ]
    }
  ];

  const environmentVariables = [
    { name: 'REACT_APP_VERSION', description: 'Application version number', required: false, example: '1.0.0' },
    { name: 'REACT_APP_ENVIRONMENT', description: 'Deployment environment', required: true, example: 'production' },
    { name: 'REACT_APP_API_URL', description: 'API base URL (if applicable)', required: false, example: 'https://api.proofpix.com' },
    { name: 'REACT_APP_ANALYTICS_ID', description: 'Analytics tracking ID', required: false, example: 'GA-XXXXXXXXX' }
  ];

  const securityHeaders = [
    { header: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'" },
    { header: 'X-Frame-Options', value: 'DENY' },
    { header: 'X-Content-Type-Options', value: 'nosniff' },
    { header: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { header: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Deployment Guide"
      description="Complete deployment guide for ProofPix in enterprise environments"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <EnterpriseButton
          variant="ghost"
          onClick={handleBackHome}
          className="mb-6"
        >
          ← Back to ProofPix
        </EnterpriseButton>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Deployment Guide</h1>
            <p className="text-xl text-slate-600 mt-2">
              Complete deployment guide for ProofPix in enterprise environments
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<Rocket className="enterprise-icon-sm" />}>
            Deployment Guide
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<Server className="enterprise-icon-sm" />}>
            Infrastructure
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<CheckCircle className="enterprise-icon-sm" />}>
            Production Ready
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Deployment Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Deployment Overview</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-lg text-gray-300 mb-6">
              ProofPix is designed as a static web application that can be deployed to any hosting platform 
              supporting static files and HTTPS. This guide covers multiple deployment options from simple 
              to enterprise-grade solutions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-orange-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Rocket className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">Static Hosting</h3>
                <p className="text-sm text-gray-400">No server required</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Secure by Default</h3>
                <p className="text-sm text-gray-400">HTTPS and security headers</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Globe className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Global CDN</h3>
                <p className="text-sm text-gray-400">Fast worldwide access</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600/20 p-4 rounded-lg mb-3 inline-block">
                  <Zap className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Auto Scaling</h3>
                <p className="text-sm text-gray-400">Handles any traffic</p>
              </div>
            </div>
          </div>
        </section>

        {/* Netlify Deployment (Detailed) */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Netlify Deployment (Recommended)</h2>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <Zap className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <h3 className="text-xl font-semibold">Fastest & Easiest Deployment</h3>
                <p className="text-gray-400">Deploy ProofPix to Netlify in under 5 minutes with automatic builds and CDN.</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Step 1: Repository Setup */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
                  Repository Setup
                </h4>
                <p className="text-gray-300 mb-4">First, ensure your ProofPix code is in a Git repository (GitHub, GitLab, or Bitbucket).</p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-300">
{`# Clone or fork the ProofPix repository
git clone https://github.com/brainded-tech/proofpix.git
cd proofpix

# Install dependencies
npm install

# Test local build
npm run build`}
                  </pre>
                </div>
              </div>

              {/* Step 2: Netlify Account */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                  Create Netlify Account
                </h4>
                <p className="text-gray-300 mb-4">Sign up for a free Netlify account and connect your Git provider.</p>
                <ul className="text-gray-300 space-y-2">
                  <li>• Go to <code className="bg-gray-700 px-2 py-1 rounded">netlify.com</code> and sign up</li>
                  <li>• Connect your GitHub/GitLab/Bitbucket account</li>
                  <li>• Authorize Netlify to access your repositories</li>
                </ul>
              </div>

              {/* Step 3: Site Creation */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
                  Create New Site
                </h4>
                <p className="text-gray-300 mb-4">Import your ProofPix repository and configure build settings.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">Build Settings:</h5>
                    <div className="bg-gray-900 rounded-lg p-3">
                      <pre className="text-sm text-gray-300">
{`Build command: npm run build
Publish directory: build
Node version: 18.x`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Advanced Settings:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Enable automatic deploys</li>
                      <li>• Set up branch deploys</li>
                      <li>• Configure build notifications</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 4: Environment Variables */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">4</span>
                  Environment Variables
                </h4>
                <p className="text-gray-300 mb-4">Configure essential environment variables in Netlify dashboard.</p>
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h5 className="font-semibold mb-2">Required Variables:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <code className="text-green-400">REACT_APP_STRIPE_PUBLISHABLE_KEY</code>
                        <span className="text-gray-400">Your Stripe publishable key</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <code className="text-green-400">REACT_APP_ENVIRONMENT</code>
                        <span className="text-gray-400">production</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <code className="text-green-400">REACT_APP_VERSION</code>
                        <span className="text-gray-400">1.8.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h5 className="font-semibold mb-2">Optional Variables:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <code className="text-blue-400">REACT_APP_ANALYTICS_ID</code>
                        <span className="text-gray-400">Plausible analytics ID</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <code className="text-blue-400">REACT_APP_SENTRY_DSN</code>
                        <span className="text-gray-400">Error tracking (optional)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5: Custom Domain */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">5</span>
                  Custom Domain Setup
                </h4>
                <p className="text-gray-300 mb-4">Configure your custom domain (e.g., upload.proofpixapp.com).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">DNS Configuration:</h5>
                    <div className="bg-gray-900 rounded-lg p-3">
                      <pre className="text-sm text-gray-300">
{`# Add CNAME record to your DNS:
upload.proofpixapp.com → your-site.netlify.app

# Or use Netlify DNS for full management`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">SSL Certificate:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Automatic Let's Encrypt SSL</li>
                      <li>• Force HTTPS redirect</li>
                      <li>• HSTS headers enabled</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 6: Security Headers */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">6</span>
                  Security Headers Configuration
                </h4>
                <p className="text-gray-300 mb-4">Add security headers via <code className="bg-gray-700 px-2 py-1 rounded">_headers</code> file in your public directory.</p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-300">
{`# public/_headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://api.stripe.com;`}
                  </pre>
                </div>
              </div>

              {/* Step 7: Deploy & Verify */}
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">7</span>
                  Deploy & Verify
                </h4>
                <p className="text-gray-300 mb-4">Trigger deployment and verify everything works correctly.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">Deployment Checklist:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>✅ Build completes successfully</li>
                      <li>✅ Site loads without errors</li>
                      <li>✅ File upload works</li>
                      <li>✅ Metadata extraction functions</li>
                      <li>✅ PDF generation works</li>
                      <li>✅ Stripe integration active</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Performance Check:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Lighthouse score &gt; 90</li>
                      <li>• First load &lt; 3 seconds</li>
                      <li>• CDN distribution active</li>
                      <li>• Gzip compression enabled</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Deploy Button */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
              <h4 className="text-lg font-semibold mb-2">One-Click Deploy</h4>
              <p className="text-gray-300 mb-4">Deploy ProofPix to Netlify instantly with pre-configured settings.</p>
              <div className="bg-gray-900 rounded-lg p-3">
                <pre className="text-sm text-gray-300">
{`# Add this deploy button to your README:
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/brainded-tech/proofpix)`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Deployment Platforms */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Deployment Platforms</h2>
          <div className="space-y-6">
            {deploymentOptions.map((option, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-600/20 p-3 rounded-lg flex-shrink-0">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{option.platform}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          option.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-400' :
                          option.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {option.difficulty}
                        </span>
                        <span className="text-xs text-gray-400">Build: {option.buildTime}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{option.description}</p>
                    
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Key Features</h4>
                      <ul className="text-sm text-gray-400 grid grid-cols-2 gap-1">
                        {option.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Build Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Build Process</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              Follow these steps to build and deploy ProofPix to production. Each step includes 
              verification commands to ensure successful completion.
            </p>
            
            <div className="space-y-6">
              {buildSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{step.step}</h3>
                    <p className="text-gray-300 mb-3">{step.description}</p>
                    <div className="bg-gray-900 rounded-lg p-4">
                      {step.commands.map((command, cmdIndex) => (
                        <div key={cmdIndex} className="flex items-center justify-between mb-2 last:mb-0">
                          <code className="text-sm text-green-400">{command}</code>
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Netlify Deployment */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Netlify Deployment (Recommended)</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              Netlify offers the fastest and easiest deployment option for ProofPix with automatic builds and CDN distribution.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Method 1: Git Integration</h3>
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <pre className="text-sm text-gray-300">
{`# 1. Push your code to GitHub/GitLab
git add .
git commit -m "Deploy to Netlify"
git push origin main

# 2. Connect repository in Netlify dashboard
# 3. Configure build settings:
#    Build command: npm run build
#    Publish directory: build`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Method 2: Netlify CLI</h3>
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <pre className="text-sm text-gray-300">
{`# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=build`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Netlify Configuration</h3>
                <p className="text-gray-300 mb-3">Create a <code className="bg-gray-700 px-2 py-1 rounded">netlify.toml</code> file in your project root:</p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-300">
{`[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AWS S3 + CloudFront */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">AWS S3 + CloudFront Deployment</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              Enterprise-grade deployment with AWS S3 for storage and CloudFront for global CDN distribution.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Prerequisites</h3>
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <pre className="text-sm text-gray-300">
{`# Install AWS CLI
npm install -g aws-cli

# Configure AWS credentials
aws configure
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region name: us-east-1
# Default output format: json`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">S3 Bucket Setup</h3>
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <pre className="text-sm text-gray-300">
{`# Create S3 bucket
aws s3 mb s3://your-proofpix-bucket

# Enable static website hosting
aws s3 website s3://your-proofpix-bucket \\
  --index-document index.html \\
  --error-document index.html

# Upload build files
npm run build
aws s3 sync build/ s3://your-proofpix-bucket --delete`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">CloudFront Distribution</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-300">
{`# Create CloudFront distribution
aws cloudfront create-distribution \\
  --distribution-config file://cloudfront-config.json

# Example cloudfront-config.json:
{
  "CallerReference": "proofpix-$(date +%s)",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-your-proofpix-bucket",
      "DomainName": "your-proofpix-bucket.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-proofpix-bucket",
    "ViewerProtocolPolicy": "redirect-to-https"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Environment Variables */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Environment Variables</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              Configure these environment variables for your deployment environment.
            </p>
            
            <div className="space-y-3">
              {environmentVariables.map((env, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-mono text-sm text-blue-300">{env.name}</span>
                        {env.required && (
                          <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded">required</span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{env.description}</p>
                      <p className="text-gray-400 text-xs">
                        <strong>Example:</strong> <code className="bg-gray-600 px-1 rounded">{env.example}</code>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Environment File Example</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-sm text-gray-300">
{`# .env.production
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
REACT_APP_API_URL=https://api.proofpix.com
REACT_APP_ANALYTICS_ID=GA-XXXXXXXXX`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Security Configuration */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Security Configuration</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              Essential security headers and configurations for production deployment.
            </p>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Required Security Headers</h3>
              {securityHeaders.map((header, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-mono text-sm text-green-300 mb-2">{header.header}</h4>
                      <code className="text-xs text-gray-400 break-all">{header.value}</code>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors ml-4">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">HTTPS Configuration</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-sm text-gray-300">
{`# Nginx configuration example
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Serve static files
    location / {
        root /var/www/proofpix;
        try_files $uri $uri/ /index.html;
    }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Optimization */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Performance Optimization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">Build Optimization</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Enable gzip compression</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Optimize bundle splitting</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Minify CSS and JavaScript</span>
                </li>
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Optimize image assets</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">CDN Configuration</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <Globe className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Set appropriate cache headers</span>
                </li>
                <li className="flex items-start">
                  <Globe className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Enable HTTP/2 support</span>
                </li>
                <li className="flex items-start">
                  <Globe className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Configure edge locations</span>
                </li>
                <li className="flex items-start">
                  <Globe className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Monitor performance metrics</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Monitoring and Analytics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Monitoring and Analytics</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              Set up monitoring and analytics to track application performance and user behavior.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-400">Performance Monitoring</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <Monitor className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Core Web Vitals tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Monitor className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Error tracking and reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Monitor className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Uptime monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <Monitor className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Load time analysis</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-purple-400">User Analytics</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <Database className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Privacy-compliant analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Database className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Feature usage tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Database className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>User journey analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Database className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Performance insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Troubleshooting</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-400">Common Issues</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-400 mb-2">Build Fails with Memory Error</h4>
                    <p className="text-gray-300 text-sm mb-2">Increase Node.js memory limit during build</p>
                    <div className="bg-gray-900 rounded-lg p-2">
                      <code className="text-xs text-green-400">NODE_OPTIONS="--max-old-space-size=4096" npm run build</code>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-400 mb-2">404 Errors on Refresh</h4>
                    <p className="text-gray-300 text-sm mb-2">Configure server to serve index.html for all routes</p>
                    <div className="bg-gray-900 rounded-lg p-2">
                      <code className="text-xs text-green-400">try_files $uri $uri/ /index.html;</code>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-400 mb-2">HTTPS Certificate Issues</h4>
                    <p className="text-gray-300 text-sm mb-2">Ensure certificate chain is complete and valid</p>
                    <div className="bg-gray-900 rounded-lg p-2">
                      <code className="text-xs text-green-400">openssl verify -CAfile ca-bundle.crt certificate.crt</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Documentation */}
        <div className="text-center">
          <button
            onClick={() => navigate('/docs')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Back to Documentation Hub
          </button>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default DeploymentGuide; 