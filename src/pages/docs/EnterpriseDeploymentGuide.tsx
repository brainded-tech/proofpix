import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, Server, Shield, Users, Settings, Monitor, AlertTriangle } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';

const EnterpriseDeploymentGuide: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  return (
    <EnterpriseLayout
      showHero
      title="Enterprise Deployment Guide"
      description="Complete deployment guide for enterprise environments"
      maxWidth="6xl"
    >
      {/* Header */}
      <EnterpriseSection size="sm">
        <EnterpriseButton
          variant="ghost"
          onClick={handleBackToDocs}
          className="mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Documentation
        </EnterpriseButton>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Server className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Enterprise Deployment Guide</h1>
            <p className="text-xl text-slate-600 mt-2">
              Complete deployment guide for enterprise environments
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary">
            Enterprise Ready
          </EnterpriseBadge>
          <EnterpriseBadge variant="success">
            Multi-Deployment
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral">
            Scalable
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Content */}
        <EnterpriseSection size="lg">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Enterprise Deployment Guide
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Complete deployment guide for enterprise environments with security, compliance, and scalability
            </p>
          </div>

          {/* Deployment Options Overview */}
          <EnterpriseCard className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Deployment Options</h2>
            
            <EnterpriseGrid columns={3}>
              <EnterpriseCard className="border-2 border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Cloud className="h-8 w-8 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Cloud Deployment</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Fully managed cloud deployment with automatic scaling and global CDN distribution.
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Fastest time to deployment</li>
                  <li>• Automatic updates and patches</li>
                  <li>• Global CDN distribution</li>
                  <li>• 99.9% uptime SLA</li>
                  <li>• Built-in monitoring and alerts</li>
                </ul>
                <div className="mt-4">
                  <EnterpriseBadge variant="primary">
                    Recommended for most enterprises
                  </EnterpriseBadge>
                </div>
              </EnterpriseCard>

              <EnterpriseCard className="border-2 border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Server className="h-8 w-8 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">On-Premises</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Complete control with on-premises deployment for maximum security and compliance.
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Complete data sovereignty</li>
                  <li>• Air-gapped deployment option</li>
                  <li>• Custom security controls</li>
                  <li>• Integration with existing infrastructure</li>
                  <li>• Compliance with strict regulations</li>
                </ul>
                <div className="mt-4">
                  <EnterpriseBadge variant="success">
                    Ideal for regulated industries
                  </EnterpriseBadge>
                </div>
              </EnterpriseCard>

              <EnterpriseCard className="border-2 border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Hybrid Deployment</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Best of both worlds with hybrid cloud and on-premises deployment.
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Flexible data placement</li>
                  <li>• Gradual migration path</li>
                  <li>• Load balancing across environments</li>
                  <li>• Disaster recovery options</li>
                  <li>• Cost optimization</li>
                </ul>
                <div className="mt-4">
                  <EnterpriseBadge variant="primary">
                    Perfect for complex requirements
                  </EnterpriseBadge>
                </div>
              </EnterpriseCard>
            </EnterpriseGrid>
          </EnterpriseCard>

          {/* Cloud Deployment */}
          <EnterpriseCard className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Cloud Deployment</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Setup (5 minutes)</h3>
                <div className="bg-slate-900 rounded-lg p-4">
                  <pre className="text-sm text-green-400 overflow-x-auto">
{`# 1. Clone the enterprise repository
git clone https://github.com/proofpix/enterprise-deployment.git
cd enterprise-deployment

# 2. Configure environment
cp .env.enterprise.example .env.production
# Edit .env.production with your settings

# 3. Deploy to cloud provider
./deploy-cloud.sh --provider=aws --region=us-east-1

# 4. Configure custom domain
./configure-domain.sh --domain=proofpix.yourcompany.com

# 5. Set up SSL certificate
./setup-ssl.sh --domain=proofpix.yourcompany.com`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Environment Configuration</h3>
                <div className="bg-slate-900 rounded-lg p-4">
                  <pre className="text-sm text-blue-400 overflow-x-auto">
{`# .env.production
REACT_APP_ENVIRONMENT=production
REACT_APP_ENTERPRISE_MODE=true
REACT_APP_COMPANY_NAME="Your Company Name"
REACT_APP_CUSTOM_BRANDING=true

# Authentication
REACT_APP_SSO_ENABLED=true
REACT_APP_SAML_ENDPOINT=https://sso.yourcompany.com/saml
REACT_APP_OAUTH_CLIENT_ID=your_oauth_client_id

# Security
REACT_APP_SECURITY_HEADERS=strict
REACT_APP_CSP_ENABLED=true
REACT_APP_AUDIT_LOGGING=true

# Performance
REACT_APP_CDN_ENABLED=true
REACT_APP_CACHE_STRATEGY=aggressive
REACT_APP_COMPRESSION=gzip

# Monitoring
REACT_APP_MONITORING_ENABLED=true
REACT_APP_ERROR_TRACKING=true
REACT_APP_PERFORMANCE_MONITORING=true`}
                  </pre>
                </div>
              </div>
            </div>
          </EnterpriseCard>

          {/* On-Premises Deployment */}
          <EnterpriseCard className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">On-Premises Deployment</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">System Requirements</h3>
                <EnterpriseGrid columns={2}>
                  <EnterpriseCard>
                    <h4 className="font-semibold text-slate-900 mb-3">Minimum Requirements</h4>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• <strong>CPU:</strong> 4 cores, 2.4 GHz</li>
                      <li>• <strong>RAM:</strong> 8 GB</li>
                      <li>• <strong>Storage:</strong> 100 GB SSD</li>
                      <li>• <strong>Network:</strong> 1 Gbps</li>
                      <li>• <strong>OS:</strong> Ubuntu 20.04+ / RHEL 8+</li>
                    </ul>
                  </EnterpriseCard>
                  <EnterpriseCard>
                    <h4 className="font-semibold text-slate-900 mb-3">Recommended (Production)</h4>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li>• <strong>CPU:</strong> 16 cores, 3.0 GHz</li>
                      <li>• <strong>RAM:</strong> 32 GB</li>
                      <li>• <strong>Storage:</strong> 500 GB NVMe SSD</li>
                      <li>• <strong>Network:</strong> 10 Gbps</li>
                      <li>• <strong>Redundancy:</strong> Load balancer + 2+ nodes</li>
                    </ul>
                  </EnterpriseCard>
                </EnterpriseGrid>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Installation Steps</h3>
                <div className="bg-slate-900 rounded-lg p-4">
                  <pre className="text-sm text-green-400 overflow-x-auto">
{`# 1. Download enterprise installer
wget https://releases.proofpix.com/enterprise/latest/proofpix-enterprise.tar.gz
tar -xzf proofpix-enterprise.tar.gz
cd proofpix-enterprise

# 2. Run pre-installation checks
sudo ./scripts/pre-install-check.sh

# 3. Install dependencies
sudo ./scripts/install-dependencies.sh

# 4. Configure the application
sudo ./scripts/configure.sh --mode=production

# 5. Set up database (if required)
sudo ./scripts/setup-database.sh --type=postgresql

# 6. Install and start services
sudo ./scripts/install-services.sh
sudo systemctl enable proofpix-enterprise
sudo systemctl start proofpix-enterprise

# 7. Configure reverse proxy
sudo ./scripts/setup-nginx.sh --domain=proofpix.internal

# 8. Set up SSL certificates
sudo ./scripts/setup-ssl.sh --cert-path=/path/to/cert.pem`}
                  </pre>
                </div>
              </div>
            </div>
          </EnterpriseCard>

          {/* Security Configuration */}
          <EnterpriseCard className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Security Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">SSO Integration</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-3">SAML 2.0 Configuration</h4>
                    <pre className="text-sm text-blue-400 overflow-x-auto">
{`# SAML Configuration
SAML_ENTITY_ID=proofpix-enterprise
SAML_SSO_URL=https://sso.company.com/saml/sso
SAML_SLO_URL=https://sso.company.com/saml/slo
SAML_CERT_PATH=/etc/ssl/certs/saml.crt

# Attribute Mapping
SAML_EMAIL_ATTR=http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
SAML_NAME_ATTR=http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
SAML_ROLE_ATTR=http://schemas.microsoft.com/ws/2008/06/identity/claims/role`}
                    </pre>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-3">OAuth 2.0 / OpenID Connect</h4>
                    <pre className="text-sm text-blue-400 overflow-x-auto">
{`# OAuth Configuration
OAUTH_CLIENT_ID=proofpix-enterprise-client
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_DISCOVERY_URL=https://auth.company.com/.well-known/openid_configuration
OAUTH_REDIRECT_URI=https://proofpix.company.com/auth/callback

# Scopes
OAUTH_SCOPES=openid profile email groups`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Role-Based Access Control (RBAC)</h3>
                <div className="bg-slate-900 rounded-lg p-4">
                  <pre className="text-sm text-green-400 overflow-x-auto">
{`# roles.yaml
roles:
  admin:
    permissions:
      - user_management
      - system_configuration
      - audit_logs
      - all_features
    
  power_user:
    permissions:
      - batch_processing
      - api_access
      - advanced_features
      - export_data
    
  standard_user:
    permissions:
      - basic_processing
      - view_results
      - download_reports
    
  viewer:
    permissions:
      - view_results
      - basic_reports

# Group Mapping
group_mappings:
  "IT-Admins": admin
  "Power-Users": power_user
  "Standard-Users": standard_user
  "Read-Only": viewer`}
                  </pre>
                </div>
              </div>
            </div>
          </EnterpriseCard>

          {/* Monitoring and Maintenance */}
          <EnterpriseCard className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Monitoring & Maintenance</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Health Monitoring</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Monitor className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Application Health</div>
                        <div className="text-sm text-slate-600">Real-time application status monitoring</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Settings className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Performance Metrics</div>
                        <div className="text-sm text-slate-600">Response times, throughput, and resource usage</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Error Tracking</div>
                        <div className="text-sm text-slate-600">Automated error detection and alerting</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Health Check Endpoints</h4>
                    <pre className="text-sm text-blue-400 overflow-x-auto">
{`# Health check URLs
GET /health              # Basic health status
GET /health/detailed     # Detailed system status
GET /health/dependencies # External dependencies
GET /metrics            # Prometheus metrics

# Example response
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:00Z",
  "version": "2.0.0",
  "uptime": 86400,
  "checks": {
    "database": "healthy",
    "storage": "healthy",
    "external_apis": "healthy"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Backup and Recovery</h3>
                <div className="bg-slate-900 rounded-lg p-4">
                  <pre className="text-sm text-green-400 overflow-x-auto">
{`# Automated backup script
#!/bin/bash

# Configuration backup
tar -czf /backups/config-$(date +%Y%m%d).tar.gz /etc/proofpix/

# Database backup (if applicable)
pg_dump proofpix_enterprise > /backups/database-$(date +%Y%m%d).sql

# Application data backup
rsync -av /var/lib/proofpix/ /backups/data/

# Upload to secure storage
aws s3 cp /backups/ s3://company-backups/proofpix/ --recursive

# Retention policy (keep 30 days)
find /backups/ -name "*.tar.gz" -mtime +30 -delete
find /backups/ -name "*.sql" -mtime +30 -delete`}
                  </pre>
                </div>
              </div>
            </div>
          </EnterpriseCard>

          {/* Enterprise Support */}
          <EnterpriseCard className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Enterprise Support</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Support Tiers</h3>
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">Standard Support</h4>
                      <span className="text-sm text-slate-600">Included</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Business hours support (9 AM - 6 PM)</li>
                      <li>• Email and ticket system</li>
                      <li>• 4-hour response time</li>
                      <li>• Documentation and knowledge base</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">Premium Support</h4>
                      <span className="text-sm text-green-400">Available</span>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• 24/7 phone and email support</li>
                      <li>• 15-minute critical response time</li>
                      <li>• Dedicated customer success manager</li>
                      <li>• Custom deployment assistance</li>
                      <li>• Priority feature requests</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Deployment Services</h3>
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Professional Services</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Custom deployment planning</li>
                      <li>• Security assessment and hardening</li>
                      <li>• Integration with existing systems</li>
                      <li>• Staff training and certification</li>
                      <li>• Performance optimization</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-900 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-600">Enterprise Sales:</span>
                        <span className="text-blue-400 ml-2">enterprise@proofpixapp.com</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Technical Support:</span>
                        <span className="text-blue-400 ml-2">support@proofpixapp.com</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Emergency Hotline:</span>
                        <span className="text-blue-400 ml-2">+1 (555) 123-4567</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </EnterpriseCard>
        </EnterpriseSection>
      </div>

      {/* Footer */}
      <DocumentationFooter />
    </EnterpriseLayout>
  );
};

export default EnterpriseDeploymentGuide; 