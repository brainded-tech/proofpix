import React from 'react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';

const EnterpriseIntegrationsGuide: React.FC = () => {
  return (
    <EnterpriseLayout
      showHero
      title="Enterprise Integrations Technical Guide"
      description="Comprehensive guide for integrating ProofPix with enterprise platforms"
      maxWidth="6xl"
      backgroundColor="dark"
    >
      <div className="prose prose-invert max-w-none">
        <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700/50">
          <h1 className="text-3xl font-bold text-emerald-400 mb-6">
            Enterprise Integrations - Technical Guide
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Overview</h2>
              <p className="text-slate-300 mb-4">
                ProofPix's Enterprise Integrations Dashboard provides seamless connectivity with 
                major enterprise platforms including Salesforce, Microsoft 365, Google Workspace, 
                Slack, Teams, and Zapier. This comprehensive system spans 1,088 lines of integration 
                logic, delivering real-time monitoring and automated workflow management.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Supported Integrations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Salesforce Integration</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Document attachment processing</li>
                    <li>• Automated case creation</li>
                    <li>• Custom field mapping</li>
                    <li>• Real-time sync capabilities</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Microsoft 365</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• SharePoint document libraries</li>
                    <li>• OneDrive file processing</li>
                    <li>• Teams notifications</li>
                    <li>• Outlook email integration</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Google Workspace</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Google Drive integration</li>
                    <li>• Gmail attachment processing</li>
                    <li>• Google Docs collaboration</li>
                    <li>• Calendar event triggers</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Communication Platforms</h3>
                  <ul className="text-slate-300 space-y-2">
                    <li>• Slack bot integration</li>
                    <li>• Microsoft Teams apps</li>
                    <li>• Webhook notifications</li>
                    <li>• Custom messaging workflows</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Real-time Monitoring</h2>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">Integration Health Dashboard</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-200">Connection Status Monitoring</h4>
                    <p className="text-slate-400">Real-time status tracking for all active integrations</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Performance Metrics</h4>
                    <p className="text-slate-400">Latency, throughput, and error rate monitoring</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Automated Alerts</h4>
                    <p className="text-slate-400">Proactive notifications for integration issues</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Usage Analytics</h4>
                    <p className="text-slate-400">Detailed analytics on integration usage patterns</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Configuration Management</h2>
              <div className="space-y-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">OAuth 2.0 Setup</h3>
                  <div className="bg-slate-800/50 rounded p-4">
                    <pre className="text-emerald-400 text-sm">
{`// Salesforce OAuth Configuration
{
  "client_id": "your_salesforce_client_id",
  "client_secret": "your_salesforce_client_secret",
  "redirect_uri": "https://app.proofpix.com/integrations/salesforce/callback",
  "scope": "api refresh_token",
  "sandbox": false
}

// Microsoft 365 Configuration
{
  "tenant_id": "your_tenant_id",
  "client_id": "your_app_id",
  "client_secret": "your_client_secret",
  "scopes": ["Files.ReadWrite", "Mail.Read", "User.Read"]
}`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Webhook Configuration</h3>
                  <div className="bg-slate-800/50 rounded p-4">
                    <pre className="text-emerald-400 text-sm">
{`// Webhook Endpoint Setup
POST /api/v1/integrations/webhooks
{
  "platform": "salesforce",
  "events": ["document.processed", "analysis.completed"],
  "endpoint": "https://your-org.salesforce.com/services/data/v54.0/sobjects/Case",
  "authentication": {
    "type": "oauth2",
    "token": "your_access_token"
  },
  "retry_policy": {
    "max_attempts": 3,
    "backoff": "exponential"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Development Patterns</h2>
              <div className="space-y-6">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Custom Integration Development</h3>
                  <div className="bg-slate-800/50 rounded p-4">
                    <pre className="text-emerald-400 text-sm">
{`import { IntegrationSDK } from '@proofpix/integrations';

class CustomIntegration extends IntegrationSDK {
  constructor(config) {
    super(config);
    this.platform = 'custom-platform';
  }

  async authenticate() {
    // Custom authentication logic
    return await this.oauth2Flow();
  }

  async processDocument(document) {
    // Custom document processing
    const result = await this.analyzeDocument(document);
    await this.sendToExternalSystem(result);
    return result;
  }

  async handleWebhook(payload) {
    // Custom webhook handling
    return await this.processWebhookPayload(payload);
  }
}`}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Error Handling & Retry Logic</h3>
                  <div className="bg-slate-800/50 rounded p-4">
                    <pre className="text-emerald-400 text-sm">
{`// Robust error handling with exponential backoff
const retryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2
};

async function executeWithRetry(operation, config = retryConfig) {
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === config.maxAttempts) throw error;
      
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
        config.maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">99.9%</div>
                  <div className="text-slate-300">Uptime SLA</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">&lt;100ms</div>
                  <div className="text-slate-300">API Response Time</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">10+</div>
                  <div className="text-slate-300">Platform Integrations</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Troubleshooting</h2>
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Common Issues</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-200">Authentication Failures</h4>
                      <p className="text-slate-400">Check OAuth credentials and token expiration</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Webhook Delivery Issues</h4>
                      <p className="text-slate-400">Verify endpoint accessibility and SSL certificates</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Rate Limiting</h4>
                      <p className="text-slate-400">Implement proper backoff strategies and request queuing</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Data Sync Conflicts</h4>
                      <p className="text-slate-400">Review field mappings and data transformation rules</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Best Practices</h2>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">Integration Guidelines</h3>
                <ul className="text-slate-300 space-y-2">
                  <li>• Use environment-specific configurations for development and production</li>
                  <li>• Implement comprehensive logging for all integration activities</li>
                  <li>• Set up monitoring and alerting for critical integration points</li>
                  <li>• Use secure credential storage (Azure Key Vault, AWS Secrets Manager)</li>
                  <li>• Implement proper error handling and graceful degradation</li>
                  <li>• Test integrations thoroughly in staging environments</li>
                  <li>• Document all custom field mappings and business logic</li>
                  <li>• Regularly review and update integration configurations</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default EnterpriseIntegrationsGuide; 