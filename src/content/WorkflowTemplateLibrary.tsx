import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  ArrowRight, 
  Download, 
  Play, 
  Settings,
  Users,
  Zap,
  Shield,
  BarChart3,
  Building,
  Heart,
  Calculator,
  Home,
  UserCheck,
  Search
} from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  title: string;
  industry: string[];
  description: string;
  problem: string;
  solution: string;
  timeSavings: string;
  costSavings: string;
  complexity: 'Simple' | 'Moderate' | 'Advanced';
  estimatedSetup: string;
  icon: React.ReactNode;
  steps: string[];
  integrations: string[];
  successMetrics: string[];
  roiCase: {
    scenario: string;
    beforeCost: string;
    afterCost: string;
    annualSavings: string;
  };
}

const WorkflowTemplateLibrary: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'setup' | 'roi'>('overview');

  const templates: WorkflowTemplate[] = [
    {
      id: 'invoice-processing',
      title: 'Invoice Processing & Approval',
      industry: ['All Industries'],
      description: 'Automated invoice extraction, validation, and approval routing',
      problem: 'Manual invoice review takes 2-3 days with 15% error rates',
      solution: 'AI extracts data → validates against POs → routes for approval → posts to accounting',
      timeSavings: '15 hours/week',
      costSavings: '$78,000/year',
      complexity: 'Simple',
      estimatedSetup: '2 hours',
      icon: <FileText className="w-6 h-6" />,
      steps: [
        'Upload invoice documents (PDF, image, email)',
        'AI extracts vendor, amount, date, line items',
        'Validate against purchase orders and contracts',
        'Route to appropriate approver based on amount/department',
        'Send notifications and track approval status',
        'Post approved invoices to accounting system',
        'Generate exception reports for manual review'
      ],
      integrations: ['QuickBooks', 'SAP', 'NetSuite', 'Xero', 'Sage', 'Oracle Financials'],
      successMetrics: [
        '90% reduction in processing time',
        '95% accuracy in data extraction',
        '80% straight-through processing',
        '50% reduction in late payment fees'
      ],
      roiCase: {
        scenario: 'Mid-size company processing 500 invoices/month',
        beforeCost: '$15 per invoice × 500 = $7,500/month',
        afterCost: '$2 per invoice × 500 = $1,000/month',
        annualSavings: '$78,000 annually + reduced late fees'
      }
    },
    {
      id: 'contract-review',
      title: 'Contract Review & Redlining',
      industry: ['Legal', 'Enterprise'],
      description: 'AI-powered contract analysis with automated risk flagging and redlining',
      problem: 'Contract review takes 5-10 hours per document with inconsistent quality',
      solution: 'AI analyzes clauses → flags risks → suggests redlines → generates summary',
      timeSavings: '70% faster review',
      costSavings: '$240,000/year',
      complexity: 'Advanced',
      estimatedSetup: '4 hours',
      icon: <Shield className="w-6 h-6" />,
      steps: [
        'Upload contract documents in any format',
        'AI extracts and analyzes all clauses',
        'Compare against company playbook and standards',
        'Flag high-risk terms and missing provisions',
        'Generate automated redlines and comments',
        'Create executive summary with risk assessment',
        'Route to legal team for final review'
      ],
      integrations: ['DocuSign', 'PandaDoc', 'ContractWorks', 'Ironclad', 'LexisNexis', 'Westlaw'],
      successMetrics: [
        '70% reduction in review time',
        '95% consistency in risk identification',
        '60% fewer contract disputes',
        '40% faster deal closure'
      ],
      roiCase: {
        scenario: 'Law firm reviewing 50 contracts/month',
        beforeCost: '8 hours × $400/hour × 50 = $160,000/month',
        afterCost: '2.5 hours × $400/hour × 50 = $50,000/month',
        annualSavings: '$1,320,000 annually'
      }
    },
    {
      id: 'medical-records',
      title: 'Medical Records Classification',
      industry: ['Healthcare'],
      description: 'HIPAA-compliant document processing with automated EHR routing',
      problem: 'Manual sorting of patient documents takes 20+ hours/week',
      solution: 'AI classifies documents → validates PHI → routes to EHR → maintains audit trail',
      timeSavings: '20 hours/week',
      costSavings: '$156,000/year',
      complexity: 'Moderate',
      estimatedSetup: '3 hours',
      icon: <Heart className="w-6 h-6" />,
      steps: [
        'Receive documents via secure upload or fax',
        'AI classifies document type (lab, imaging, notes, etc.)',
        'Extract patient identifiers and validate PHI',
        'Route to appropriate EHR section/department',
        'Generate audit trail for compliance',
        'Flag incomplete or problematic documents',
        'Send notifications to relevant clinical staff'
      ],
      integrations: ['Epic', 'Cerner', 'Allscripts', 'athenahealth', 'NextGen', 'eClinicalWorks'],
      successMetrics: [
        '85% reduction in manual sorting time',
        '99% accuracy in document classification',
        '100% HIPAA compliance maintenance',
        '50% faster patient record updates'
      ],
      roiCase: {
        scenario: 'Regional hospital with 200 documents/day',
        beforeCost: '20 hours/week × $75/hour × 52 weeks = $78,000/year',
        afterCost: '3 hours/week × $75/hour × 52 weeks = $11,700/year',
        annualSavings: '$66,300 + improved patient care efficiency'
      }
    },
    {
      id: 'insurance-claims',
      title: 'Insurance Claim Validation',
      industry: ['Insurance', 'Healthcare'],
      description: 'Automated claim processing with fraud detection and approval routing',
      problem: 'Claim processing takes 7-14 days with 30% requiring manual review',
      solution: 'AI validates claims → detects fraud → routes decisions → updates systems',
      timeSavings: '80% faster processing',
      costSavings: '$500,000/year',
      complexity: 'Advanced',
      estimatedSetup: '5 hours',
      icon: <Shield className="w-6 h-6" />,
      steps: [
        'Receive claim documents and supporting evidence',
        'Validate policy coverage and eligibility',
        'Cross-reference with medical/damage databases',
        'Run fraud detection algorithms',
        'Calculate settlement amounts automatically',
        'Route to appropriate adjuster or auto-approve',
        'Generate payment instructions or denial letters'
      ],
      integrations: ['Guidewire', 'Duck Creek', 'Majesco', 'Sapiens', 'Insurity', 'Applied Systems'],
      successMetrics: [
        '80% reduction in processing time',
        '60% increase in straight-through processing',
        '40% improvement in fraud detection',
        '25% reduction in claim costs'
      ],
      roiCase: {
        scenario: 'Insurance company processing 1,000 claims/month',
        beforeCost: '4 hours × $85/hour × 1,000 = $340,000/month',
        afterCost: '0.8 hours × $85/hour × 1,000 = $68,000/month',
        annualSavings: '$3,264,000 annually'
      }
    },
    {
      id: 'legal-discovery',
      title: 'Legal Discovery Processing',
      industry: ['Legal'],
      description: 'Automated eDiscovery with relevance scoring and privilege review',
      problem: 'eDiscovery costs $2-5K per GB with 90% irrelevant documents',
      solution: 'AI scores relevance → identifies privilege → creates review sets → generates reports',
      timeSavings: '90% cost reduction',
      costSavings: '$2,000,000/case',
      complexity: 'Advanced',
      estimatedSetup: '6 hours',
      icon: <Search className="w-6 h-6" />,
      steps: [
        'Ingest documents from multiple sources',
        'Apply AI relevance scoring to all documents',
        'Identify privileged and work product materials',
        'Create prioritized review sets for attorneys',
        'Generate privilege logs automatically',
        'Track review progress and quality metrics',
        'Produce final document sets for opposing counsel'
      ],
      integrations: ['Relativity', 'Concordance', 'Logikcull', 'Everlaw', 'Zylab', 'DISCO'],
      successMetrics: [
        '90% reduction in review volume',
        '85% cost savings vs traditional review',
        '99% privilege identification accuracy',
        '75% faster case resolution'
      ],
      roiCase: {
        scenario: 'Large litigation case with 1TB of data',
        beforeCost: '1TB × $5,000/GB × 1,000GB = $5,000,000',
        afterCost: '100GB relevant × $500/GB = $50,000',
        annualSavings: '$4,950,000 per major case'
      }
    },
    {
      id: 'financial-audit',
      title: 'Financial Audit Preparation',
      industry: ['Finance', 'Accounting'],
      description: 'Automated document gathering and compliance checking for audits',
      problem: 'Audit prep takes 200+ hours with high stress and error rates',
      solution: 'AI gathers documents → validates completeness → checks compliance → generates reports',
      timeSavings: '60% time reduction',
      costSavings: '$180,000/audit',
      complexity: 'Moderate',
      estimatedSetup: '4 hours',
      icon: <Calculator className="w-6 h-6" />,
      steps: [
        'Automatically gather required audit documents',
        'Validate document completeness against checklist',
        'Perform preliminary compliance checks',
        'Identify potential issues and exceptions',
        'Generate audit-ready document packages',
        'Create summary reports for auditors',
        'Track audit progress and responses'
      ],
      integrations: ['SAP', 'Oracle', 'NetSuite', 'Workday', 'MindBridge', 'CaseWare', 'TeamMate'],
      successMetrics: [
        '60% reduction in prep time',
        '90% document completeness on first submission',
        '50% fewer audit exceptions',
        '40% faster audit completion'
      ],
      roiCase: {
        scenario: 'Mid-size company annual audit',
        beforeCost: '200 hours × $150/hour = $30,000 internal + $120,000 external',
        afterCost: '80 hours × $150/hour = $12,000 internal + $90,000 external',
        annualSavings: '$48,000 per audit cycle'
      }
    },
    {
      id: 'compliance-review',
      title: 'Compliance Document Review',
      industry: ['All Regulated Industries'],
      description: 'Automated policy checking with gap analysis and remediation',
      problem: 'Compliance reviews are manual, slow, and error-prone',
      solution: 'AI checks policies → identifies gaps → suggests fixes → tracks remediation',
      timeSavings: '50% faster cycles',
      costSavings: '$300,000/year',
      complexity: 'Moderate',
      estimatedSetup: '3 hours',
      icon: <CheckCircle className="w-6 h-6" />,
      steps: [
        'Upload policies, procedures, and regulatory documents',
        'AI compares against current regulations',
        'Identify compliance gaps and risks',
        'Generate remediation recommendations',
        'Track implementation of fixes',
        'Create compliance status reports',
        'Schedule automatic re-reviews'
      ],
      integrations: ['MetricStream', 'ServiceNow GRC', 'LogicGate', 'Resolver', 'Thomson Reuters', 'Compliance.ai'],
      successMetrics: [
        '50% faster compliance cycles',
        '80% reduction in compliance gaps',
        '90% improvement in audit readiness',
        '60% reduction in regulatory risk'
      ],
      roiCase: {
        scenario: 'Financial services firm with quarterly reviews',
        beforeCost: '40 hours × $200/hour × 4 quarters = $32,000/year',
        afterCost: '20 hours × $200/hour × 4 quarters = $16,000/year',
        annualSavings: '$16,000 + reduced regulatory risk'
      }
    },
    {
      id: 'real-estate-docs',
      title: 'Real Estate Document Processing',
      industry: ['Real Estate'],
      description: 'Property transaction document validation and closing preparation',
      problem: 'Property transactions involve 50+ documents with manual coordination',
      solution: 'AI validates documents → checks title → prepares closing → coordinates parties',
      timeSavings: '3-day faster closings',
      costSavings: '$25,000/transaction',
      complexity: 'Moderate',
      estimatedSetup: '3 hours',
      icon: <Home className="w-6 h-6" />,
      steps: [
        'Collect all transaction documents',
        'Validate document completeness and accuracy',
        'Perform automated title searches',
        'Check for liens and encumbrances',
        'Generate closing disclosure documents',
        'Coordinate with all parties and vendors',
        'Prepare final closing packages'
      ],
      integrations: ['MLS systems', 'First American', 'Stewart Title', 'Fidelity National', 'DocuSign', 'dotloop'],
      successMetrics: [
        '3-day reduction in closing time',
        '95% document accuracy on first review',
        '80% reduction in closing delays',
        '60% improvement in client satisfaction'
      ],
      roiCase: {
        scenario: 'Real estate agency with 10 transactions/month',
        beforeCost: '20 hours × $100/hour × 10 = $20,000/month',
        afterCost: '8 hours × $100/hour × 10 = $8,000/month',
        annualSavings: '$144,000 + faster deal velocity'
      }
    },
    {
      id: 'hr-onboarding',
      title: 'HR Document Management',
      industry: ['All Industries'],
      description: 'Employee onboarding paperwork automation and system updates',
      problem: 'Employee onboarding takes 5+ hours of manual paperwork processing',
      solution: 'AI processes forms → validates data → updates systems → tracks completion',
      timeSavings: '5 hours per hire',
      costSavings: '$15,000/year',
      complexity: 'Simple',
      estimatedSetup: '2 hours',
      icon: <UserCheck className="w-6 h-6" />,
      steps: [
        'Collect completed onboarding forms',
        'Extract and validate employee data',
        'Perform background check coordination',
        'Update HRIS and payroll systems',
        'Generate employee ID and access credentials',
        'Create onboarding checklists and schedules',
        'Send welcome packages and notifications'
      ],
      integrations: ['Workday', 'BambooHR', 'ADP', 'Paychex', 'UltiPro', 'SuccessFactors'],
      successMetrics: [
        '80% reduction in onboarding time',
        '95% data accuracy in systems',
        '90% new hire satisfaction improvement',
        '50% reduction in onboarding errors'
      ],
      roiCase: {
        scenario: 'Company hiring 5 employees/month',
        beforeCost: '5 hours × $50/hour × 5 × 12 = $15,000/year',
        afterCost: '1 hour × $50/hour × 5 × 12 = $3,000/year',
        annualSavings: '$12,000 + improved employee experience'
      }
    },
    {
      id: 'quality-control',
      title: 'Quality Control Inspection',
      industry: ['Manufacturing', 'Construction'],
      description: 'Photo analysis with defect detection and corrective action routing',
      problem: 'Manual inspections are slow, inconsistent, and miss critical defects',
      solution: 'AI analyzes photos → detects defects → classifies severity → routes actions',
      timeSavings: '40% faster inspections',
      costSavings: '$200,000/year',
      complexity: 'Advanced',
      estimatedSetup: '5 hours',
      icon: <BarChart3 className="w-6 h-6" />,
      steps: [
        'Capture inspection photos with mobile devices',
        'AI analyzes images for defects and anomalies',
        'Classify defect types and severity levels',
        'Generate inspection reports automatically',
        'Route corrective actions to responsible teams',
        'Track remediation progress and completion',
        'Create quality trend analysis and reports'
      ],
      integrations: ['SAP QM', 'Oracle Quality', 'Intelex', 'MasterControl', 'ETQ', 'Sparta Systems'],
      successMetrics: [
        '40% faster inspection completion',
        '85% improvement in defect detection',
        '60% reduction in quality escapes',
        '50% decrease in rework costs'
      ],
      roiCase: {
        scenario: 'Manufacturing facility with 100 inspections/week',
        beforeCost: '2 hours × $75/hour × 100 × 52 = $780,000/year',
        afterCost: '1.2 hours × $75/hour × 100 × 52 = $468,000/year',
        annualSavings: '$312,000 + reduced defect costs'
      }
    }
  ];

  const currentTemplate = templates[selectedTemplate];

  const handleDownloadGuide = () => {
    // Create a comprehensive implementation guide for the selected template
    const guideContent = `# ${currentTemplate.title} - Implementation Guide

## Overview
${currentTemplate.description}

## Problem Statement
${currentTemplate.problem}

## Solution
${currentTemplate.solution}

## Expected Results
- **Time Savings**: ${currentTemplate.timeSavings}
- **Cost Savings**: ${currentTemplate.costSavings}
- **Complexity**: ${currentTemplate.complexity}
- **Setup Time**: ${currentTemplate.estimatedSetup}

## Implementation Steps

${currentTemplate.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Success Metrics
${currentTemplate.successMetrics.map(metric => `- ${metric}`).join('\n')}

## Required Integrations
${currentTemplate.integrations.map(integration => `- ${integration}`).join('\n')}

## ROI Analysis
**Scenario**: ${currentTemplate.roiCase.scenario}
- **Before**: ${currentTemplate.roiCase.beforeCost}
- **After**: ${currentTemplate.roiCase.afterCost}
- **Annual Savings**: ${currentTemplate.roiCase.annualSavings}

## Next Steps
1. Review the complete Workflow Template Implementation Guide
2. Contact our Professional Services team for implementation assistance
3. Schedule a setup session to configure your specific environment

For detailed implementation instructions, visit our comprehensive documentation portal.
`;

    // Create and download the file
    const blob = new Blob([guideContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplate.title.replace(/\s+/g, '_')}_Implementation_Guide.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Workflow Automation Template Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Ready-to-use workflows that deliver ROI from day one
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">10</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ready Templates</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">50%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Faster Onboarding</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">3x</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Feature Adoption</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Templates</h2>
            <div className="space-y-3">
              {templates.map((template, index) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === index
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTemplate(index)}
                >
                  <div className="flex items-center mb-2">
                    <div className="mr-3">{template.icon}</div>
                    <h3 className="font-semibold text-sm">{template.title}</h3>
                  </div>
                  <div className="text-xs opacity-75 mb-2">{template.industry.join(', ')}</div>
                  <div className="flex justify-between text-xs">
                    <span>{template.timeSavings}</span>
                    <span>{template.complexity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              {/* Template Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="text-blue-600 mr-4">{currentTemplate.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentTemplate.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{currentTemplate.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{currentTemplate.timeSavings}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{currentTemplate.costSavings}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Annual Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{currentTemplate.complexity}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Complexity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{currentTemplate.estimatedSetup}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Setup Time</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'setup', label: 'Setup Guide' },
                    { id: 'roi', label: 'ROI Analysis' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab(tab.id as any)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Problem Statement</h3>
                      <p className="text-gray-600 dark:text-gray-400">{currentTemplate.problem}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Solution Overview</h3>
                      <p className="text-gray-600 dark:text-gray-400">{currentTemplate.solution}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Success Metrics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentTemplate.successMetrics.map((metric, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-gray-600 dark:text-gray-400">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Integrations</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentTemplate.integrations.map((integration, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                          >
                            {integration}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'setup' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Workflow Steps</h3>
                      <div className="space-y-3">
                        {currentTemplate.steps.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Start</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        This template can be deployed in {currentTemplate.estimatedSetup} with minimal configuration. 
                        All integrations are pre-built and ready to connect to your existing systems.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'roi' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">ROI Case Study</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{currentTemplate.roiCase.scenario}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Before</h4>
                          <p className="text-red-600 dark:text-red-300 text-sm">{currentTemplate.roiCase.beforeCost}</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">After</h4>
                          <p className="text-blue-600 dark:text-blue-300 text-sm">{currentTemplate.roiCase.afterCost}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Savings</h4>
                          <p className="text-green-600 dark:text-green-300 text-sm">{currentTemplate.roiCase.annualSavings}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ready to Get Started?</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        This template is ready to deploy and can start delivering value immediately.
                      </p>
                      <div className="flex space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                          <Play className="w-4 h-4 mr-2" />
                          Deploy Template
                        </button>
                        <button 
                          onClick={handleDownloadGuide}
                          className="border border-gray-300 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Guide
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTemplateLibrary; 