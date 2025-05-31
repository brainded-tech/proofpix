import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, CheckSquare, Rocket, ArrowRight, CheckCircle, Clock, Users, Settings, AlertTriangle, ArrowLeft } from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import DocumentationFooter from '../../components/DocumentationFooter';
import { useNavigate } from 'react-router-dom';

export const ImplementationGuides: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('30-day');

  const handleBackToDocs = () => {
    navigate('/docs');
  };

  const implementationPlan = {
    week1: {
      title: "Setup and Configuration",
      days: [
        {
          day: 1,
          title: "Initial Setup",
          tasks: [
            "Account creation and team setup",
            "API key generation and configuration",
            "Initial security policy review",
            "Stakeholder kickoff meeting"
          ],
          deliverables: ["Active ProofPix account", "API keys configured", "Team access granted"],
          owner: "IT Team"
        },
        {
          day: 2,
          title: "Environment Configuration",
          tasks: [
            "Development environment setup",
            "Staging environment configuration",
            "Initial integration testing",
            "Security compliance verification"
          ],
          deliverables: ["Dev/staging environments", "Basic integration working", "Security checklist completed"],
          owner: "DevOps Team"
        },
        {
          day: 3,
          title: "Team Training - Day 1",
          tasks: [
            "Platform overview training",
            "Basic feature demonstration",
            "Hands-on practice session",
            "Q&A and feedback collection"
          ],
          deliverables: ["Training materials", "Team competency assessment", "Feedback summary"],
          owner: "Training Team"
        },
        {
          day: 4,
          title: "Team Training - Day 2",
          tasks: [
            "Advanced features training",
            "Integration workflow training",
            "Best practices session",
            "Certification completion"
          ],
          deliverables: ["Advanced training completed", "Team certifications", "Best practices guide"],
          owner: "Training Team"
        },
        {
          day: 5,
          title: "Pilot Planning",
          tasks: [
            "Pilot use cases identification",
            "Success metrics definition",
            "Pilot team selection",
            "Timeline and milestones planning"
          ],
          deliverables: ["Pilot plan document", "Success criteria defined", "Pilot team ready"],
          owner: "Project Manager"
        }
      ]
    },
    week2: {
      title: "Pilot Program Launch",
      days: [
        {
          day: 8,
          title: "Pilot Launch",
          tasks: [
            "Pilot environment deployment",
            "Initial use case testing",
            "Performance monitoring setup",
            "Daily standup meetings begin"
          ],
          deliverables: ["Pilot environment live", "First use cases tested", "Monitoring dashboard"],
          owner: "Pilot Team"
        },
        {
          day: 9,
          title: "Process Integration",
          tasks: [
            "Existing workflow integration",
            "Custom field configuration",
            "Automation rule setup",
            "Error handling procedures"
          ],
          deliverables: ["Integrated workflows", "Custom configurations", "Error procedures"],
          owner: "Process Team"
        },
        {
          day: 10,
          title: "Performance Optimization",
          tasks: [
            "Performance baseline establishment",
            "Optimization recommendations",
            "Configuration fine-tuning",
            "Load testing execution"
          ],
          deliverables: ["Performance baseline", "Optimization plan", "Tuned configuration"],
          owner: "Technical Team"
        },
        {
          day: 11,
          title: "User Feedback Collection",
          tasks: [
            "User experience surveys",
            "Feedback session facilitation",
            "Issue identification and logging",
            "Improvement recommendations"
          ],
          deliverables: ["User feedback report", "Issue log", "Improvement plan"],
          owner: "UX Team"
        },
        {
          day: 12,
          title: "Week 2 Review",
          tasks: [
            "Pilot progress assessment",
            "Metrics review and analysis",
            "Stakeholder update meeting",
            "Week 3 planning session"
          ],
          deliverables: ["Progress report", "Metrics dashboard", "Week 3 plan"],
          owner: "Project Manager"
        }
      ]
    },
    week3: {
      title: "Pilot Expansion",
      days: [
        {
          day: 15,
          title: "Expanded Use Cases",
          tasks: [
            "Additional use case implementation",
            "Cross-team collaboration testing",
            "Advanced feature utilization",
            "Integration stress testing"
          ],
          deliverables: ["Expanded use cases", "Collaboration workflows", "Stress test results"],
          owner: "Extended Pilot Team"
        },
        {
          day: 16,
          title: "Quality Assurance",
          tasks: [
            "Comprehensive testing execution",
            "Quality metrics validation",
            "Bug identification and resolution",
            "Performance verification"
          ],
          deliverables: ["QA test results", "Quality metrics", "Bug resolution log"],
          owner: "QA Team"
        },
        {
          day: 17,
          title: "Documentation Update",
          tasks: [
            "Process documentation updates",
            "User guide refinements",
            "Training material improvements",
            "Knowledge base expansion"
          ],
          deliverables: ["Updated documentation", "Refined user guides", "Enhanced training"],
          owner: "Documentation Team"
        },
        {
          day: 18,
          title: "Security Validation",
          tasks: [
            "Security audit execution",
            "Compliance verification",
            "Penetration testing",
            "Security policy updates"
          ],
          deliverables: ["Security audit report", "Compliance certification", "Updated policies"],
          owner: "Security Team"
        },
        {
          day: 19,
          title: "Pilot Completion",
          tasks: [
            "Final pilot assessment",
            "Success metrics evaluation",
            "Lessons learned documentation",
            "Full rollout planning"
          ],
          deliverables: ["Pilot completion report", "Success metrics", "Rollout plan"],
          owner: "Project Manager"
        }
      ]
    },
    week4: {
      title: "Full Rollout Preparation",
      days: [
        {
          day: 22,
          title: "Production Preparation",
          tasks: [
            "Production environment setup",
            "Data migration planning",
            "Backup and recovery procedures",
            "Monitoring and alerting setup"
          ],
          deliverables: ["Production environment", "Migration plan", "Recovery procedures"],
          owner: "Infrastructure Team"
        },
        {
          day: 23,
          title: "Team Scaling",
          tasks: [
            "Additional team training",
            "Role and responsibility definition",
            "Support process establishment",
            "Escalation procedures creation"
          ],
          deliverables: ["Trained teams", "Defined roles", "Support processes"],
          owner: "Operations Team"
        },
        {
          day: 24,
          title: "Go-Live Preparation",
          tasks: [
            "Go-live checklist completion",
            "Rollback procedures testing",
            "Communication plan execution",
            "Final stakeholder approval"
          ],
          deliverables: ["Go-live checklist", "Rollback procedures", "Stakeholder approval"],
          owner: "Project Manager"
        },
        {
          day: 25,
          title: "Production Deployment",
          tasks: [
            "Production deployment execution",
            "System health verification",
            "User access validation",
            "Initial production monitoring"
          ],
          deliverables: ["Live production system", "Health verification", "User access confirmed"],
          owner: "Deployment Team"
        },
        {
          day: 26,
          title: "Post-Launch Support",
          tasks: [
            "24/7 monitoring activation",
            "User support availability",
            "Issue resolution procedures",
            "Performance optimization"
          ],
          deliverables: ["Active monitoring", "Support availability", "Optimized performance"],
          owner: "Support Team"
        }
      ]
    }
  };

  const integrationChecklist = [
    {
      category: "Technical Prerequisites",
      items: [
        { task: "Modern browser compatibility verified", required: true, estimated: "1 hour" },
        { task: "JavaScript enabled and configured", required: true, estimated: "30 minutes" },
        { task: "HTTPS/SSL certificate installed", required: true, estimated: "2 hours" },
        { task: "API endpoint accessibility confirmed", required: true, estimated: "1 hour" },
        { task: "Network firewall rules configured", required: false, estimated: "2 hours" },
        { task: "Content Security Policy updated", required: false, estimated: "1 hour" }
      ]
    },
    {
      category: "Account Setup",
      items: [
        { task: "ProofPix enterprise account created", required: true, estimated: "15 minutes" },
        { task: "Team members invited and configured", required: true, estimated: "30 minutes" },
        { task: "Role-based access control setup", required: true, estimated: "45 minutes" },
        { task: "API keys generated for all environments", required: true, estimated: "20 minutes" },
        { task: "Billing and subscription configured", required: true, estimated: "15 minutes" },
        { task: "Support contact information updated", required: false, estimated: "10 minutes" }
      ]
    },
    {
      category: "Integration Development",
      items: [
        { task: "SDK installation and configuration", required: true, estimated: "2 hours" },
        { task: "Authentication implementation", required: true, estimated: "3 hours" },
        { task: "File upload integration", required: true, estimated: "4 hours" },
        { task: "Metadata extraction integration", required: true, estimated: "3 hours" },
        { task: "Error handling implementation", required: true, estimated: "2 hours" },
        { task: "Custom field mapping", required: false, estimated: "2 hours" },
        { task: "Webhook integration", required: false, estimated: "3 hours" },
        { task: "Batch processing implementation", required: false, estimated: "4 hours" }
      ]
    },
    {
      category: "Testing and Validation",
      items: [
        { task: "Unit tests for integration code", required: true, estimated: "4 hours" },
        { task: "Integration tests with ProofPix API", required: true, estimated: "3 hours" },
        { task: "End-to-end workflow testing", required: true, estimated: "6 hours" },
        { task: "Performance and load testing", required: true, estimated: "4 hours" },
        { task: "Security penetration testing", required: true, estimated: "8 hours" },
        { task: "User acceptance testing", required: true, estimated: "8 hours" },
        { task: "Cross-browser compatibility testing", required: false, estimated: "4 hours" },
        { task: "Mobile device testing", required: false, estimated: "3 hours" }
      ]
    },
    {
      category: "Security and Compliance",
      items: [
        { task: "Data privacy impact assessment", required: true, estimated: "4 hours" },
        { task: "Security policy review and approval", required: true, estimated: "2 hours" },
        { task: "Compliance framework verification", required: true, estimated: "6 hours" },
        { task: "Audit trail configuration", required: true, estimated: "2 hours" },
        { task: "Access control validation", required: true, estimated: "3 hours" },
        { task: "Data retention policy setup", required: false, estimated: "2 hours" },
        { task: "Incident response procedures", required: false, estimated: "4 hours" }
      ]
    },
    {
      category: "Deployment and Monitoring",
      items: [
        { task: "Production environment configuration", required: true, estimated: "4 hours" },
        { task: "Monitoring and alerting setup", required: true, estimated: "3 hours" },
        { task: "Backup and recovery procedures", required: true, estimated: "4 hours" },
        { task: "Performance monitoring configuration", required: true, estimated: "2 hours" },
        { task: "Log aggregation and analysis", required: false, estimated: "3 hours" },
        { task: "Automated deployment pipeline", required: false, estimated: "8 hours" }
      ]
    }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: "Account Setup",
      duration: "15 minutes",
      description: "Create your ProofPix enterprise account and configure basic settings",
      tasks: [
        "Visit ProofPix enterprise signup page",
        "Complete account registration form",
        "Verify email address and phone number",
        "Set up initial team and billing information"
      ],
      code: `// Account setup - no code required
// Complete setup through ProofPix dashboard`
    },
    {
      step: 2,
      title: "API Key Generation",
      duration: "10 minutes",
      description: "Generate API keys for development, staging, and production environments",
      tasks: [
        "Navigate to API settings in dashboard",
        "Generate development API key",
        "Generate staging API key",
        "Generate production API key (when ready)"
      ],
      code: `// Store API keys securely
const PROOFPIX_API_KEY = process.env.PROOFPIX_API_KEY;
const PROOFPIX_ENVIRONMENT = process.env.NODE_ENV;`
    },
    {
      step: 3,
      title: "SDK Installation",
      duration: "5 minutes",
      description: "Install the ProofPix SDK for your preferred programming language",
      tasks: [
        "Choose your programming language",
        "Install SDK via package manager",
        "Import SDK in your project",
        "Verify installation success"
      ],
      code: `// JavaScript/Node.js
npm install @proofpix/sdk

// Python
pip install proofpix-sdk

// PHP
composer require proofpix/sdk`
    },
    {
      step: 4,
      title: "Basic Integration",
      duration: "30 minutes",
      description: "Implement basic image processing functionality",
      tasks: [
        "Initialize ProofPix client",
        "Implement file upload handler",
        "Add metadata extraction call",
        "Handle response and errors"
      ],
      code: `// JavaScript example
import ProofPix from '@proofpix/sdk';

const client = new ProofPix({
  apiKey: PROOFPIX_API_KEY,
  environment: PROOFPIX_ENVIRONMENT
});

// Process image
const result = await client.processImage(file, {
  extractMetadata: true,
  generateReport: true
});`
    },
    {
      step: 5,
      title: "Testing",
      duration: "20 minutes",
      description: "Test your integration with sample images and verify results",
      tasks: [
        "Upload test images through your integration",
        "Verify metadata extraction results",
        "Test error handling scenarios",
        "Validate response format and data"
      ],
      code: `// Test with sample image
const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const testResult = await client.processImage(testFile);

console.log('Metadata:', testResult.metadata);
console.log('Processing time:', testResult.processingTime);`
    },
    {
      step: 6,
      title: "Production Deployment",
      duration: "45 minutes",
      description: "Deploy your integration to production environment",
      tasks: [
        "Update API key to production",
        "Configure production environment variables",
        "Deploy to production servers",
        "Monitor initial production usage"
      ],
      code: `// Production configuration
const client = new ProofPix({
  apiKey: process.env.PROOFPIX_PROD_API_KEY,
  environment: 'production',
  timeout: 30000,
  retries: 3
});`
    }
  ];

  const tabs = [
    { id: '30-day', label: '30-Day Implementation Plan', icon: Calendar },
    { id: 'checklist', label: 'Integration Checklist', icon: CheckSquare },
    { id: 'quick-start', label: 'Quick Start Guide', icon: Rocket }
  ];

  return (
    <EnterpriseLayout
      showHero
      title="Implementation Guides"
      description="Complete guides to successfully implement ProofPix in your organization"
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
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Implementation Guides</h1>
            <p className="text-xl text-slate-600 mt-2">
              Complete guides to successfully implement ProofPix in your organization
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <EnterpriseBadge variant="primary" icon={<BookOpen className="enterprise-icon-sm" />}>
            Implementation Guide
          </EnterpriseBadge>
          <EnterpriseBadge variant="success" icon={<CheckSquare className="enterprise-icon-sm" />}>
            Step-by-Step
          </EnterpriseBadge>
          <EnterpriseBadge variant="neutral" icon={<Rocket className="enterprise-icon-sm" />}>
            Production Ready
          </EnterpriseBadge>
        </div>
      </EnterpriseSection>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon className="mr-2" size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 30-Day Implementation Plan */}
        {activeTab === '30-day' && (
          <div className="space-y-8">
            <EnterpriseCard className="border-l-4 border-blue-500">
              <h2 className="text-xl font-bold text-blue-900 mb-2">30-Day Implementation Plan</h2>
              <p className="text-blue-800">
                A comprehensive week-by-week plan to successfully implement ProofPix across your organization.
                This plan ensures proper setup, thorough testing, and smooth rollout to production.
              </p>
            </EnterpriseCard>

            {Object.entries(implementationPlan).map(([weekKey, week]) => (
              <EnterpriseCard key={weekKey}>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Calendar className="mr-2 text-blue-600" size={20} />
                  {week.title}
                </h3>
                
                <div className="space-y-6">
                  {week.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="border-l-2 border-slate-200 pl-6 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">Day {day.day}: {day.title}</h4>
                          <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {day.owner}
                          </span>
                        </div>
                        
                        <EnterpriseGrid columns={2}>
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Tasks:</h5>
                            <ul className="space-y-1">
                              {day.tasks.map((task, taskIndex) => (
                                <li key={taskIndex} className="flex items-start text-sm text-slate-600">
                                  <CheckCircle className="mr-2 text-green-500 mt-0.5" size={12} />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Deliverables:</h5>
                            <ul className="space-y-1">
                              {day.deliverables.map((deliverable, deliverableIndex) => (
                                <li key={deliverableIndex} className="flex items-start text-sm text-slate-600">
                                  <CheckSquare className="mr-2 text-blue-500 mt-0.5" size={12} />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </EnterpriseGrid>
                      </div>
                    </div>
                  ))}
                </div>
              </EnterpriseCard>
            ))}
          </div>
        )}

        {/* Integration Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-8">
            <EnterpriseCard className="border-l-4 border-green-500">
              <h2 className="text-xl font-bold text-green-900 mb-2">Integration Checklist</h2>
              <p className="text-green-800">
                Complete checklist to ensure all aspects of your ProofPix integration are properly implemented.
                Check off items as you complete them to track your progress.
              </p>
            </EnterpriseCard>

            {integrationChecklist.map((category, categoryIndex) => (
              <EnterpriseCard key={categoryIndex}>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <CheckSquare className="mr-2 text-green-600" size={20} />
                  {category.category}
                </h3>
                
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                        <span className="text-slate-900">{item.task}</span>
                        {item.required && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="text-slate-400" size={14} />
                        <span className="text-sm text-slate-500">{item.estimated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </EnterpriseCard>
            ))}

            <EnterpriseCard className="border border-yellow-200 bg-yellow-50">
              <div className="flex items-center mb-3">
                <AlertTriangle className="mr-2 text-yellow-600" size={20} />
                <h3 className="text-lg font-semibold text-yellow-900">Implementation Tips</h3>
              </div>
              <ul className="space-y-2 text-yellow-800">
                <li>• Focus on required items first to establish basic functionality</li>
                <li>• Test each category thoroughly before moving to the next</li>
                <li>• Keep detailed documentation of any custom configurations</li>
                <li>• Schedule regular checkpoints with stakeholders</li>
                <li>• Plan for additional time if implementing optional features</li>
              </ul>
            </EnterpriseCard>
          </div>
        )}

        {/* Quick Start Guide */}
        {activeTab === 'quick-start' && (
          <div className="space-y-8">
            <EnterpriseCard className="border-l-4 border-purple-500">
              <h2 className="text-xl font-bold text-purple-900 mb-2">Quick Start Guide</h2>
              <p className="text-purple-800">
                Get up and running with ProofPix in under 2 hours. This guide covers the essential steps
                to implement basic image processing functionality.
              </p>
            </EnterpriseCard>

            <div className="space-y-8">
              {quickStartSteps.map((step, stepIndex) => (
                <EnterpriseCard key={stepIndex}>
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-4">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="mr-1" size={14} />
                        {step.duration}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-4">{step.description}</p>
                  
                  <EnterpriseGrid columns={2}>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Tasks:</h4>
                      <ul className="space-y-2">
                        {step.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start text-sm text-slate-600">
                            <CheckCircle className="mr-2 text-green-500 mt-0.5" size={12} />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Code Example:</h4>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  </EnterpriseGrid>
                </EnterpriseCard>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">🎉 Congratulations!</h3>
              <p className="text-green-800 mb-4">
                You've successfully implemented basic ProofPix functionality. Your integration can now:
              </p>
              <ul className="space-y-1 text-green-800">
                <li>• Process images with client-side security</li>
                <li>• Extract comprehensive metadata</li>
                <li>• Handle errors gracefully</li>
                <li>• Scale to production workloads</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-sm text-green-700">
                  <strong>Next steps:</strong> Explore advanced features like batch processing, custom fields, 
                  and webhook integrations in our comprehensive documentation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <DocumentationFooter />
    </EnterpriseLayout>
  );
}; 