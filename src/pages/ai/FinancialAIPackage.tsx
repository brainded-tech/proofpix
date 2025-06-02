import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Shield, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Eye,
  Clock,
  Users,
  Phone,
  Calendar,
  AlertTriangle,
  BarChart3,
  Calculator,
  Zap,
  Building,
  PieChart
} from 'lucide-react';
import { EnterpriseLayout } from '../../components/ui/EnterpriseLayout';
import { 
  EnterpriseButton, 
  EnterpriseCard, 
  EnterpriseBadge,
  EnterpriseSection,
  EnterpriseGrid
} from '../../components/ui/EnterpriseComponents';
import { BackToHomeButton } from '../../components/ui/BackToHomeButton';

const FinancialAIPackage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWorkflow, setSelectedWorkflow] = useState(0);

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Invoice & Receipt Processing',
      description: 'Automated extraction and validation of financial data from invoices and receipts.',
      benefits: ['99% accuracy in data extraction', 'Multi-currency support', 'Automated approval workflows']
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Financial Statement Analysis',
      description: 'AI-powered analysis of financial statements with risk assessment and trend identification.',
      benefits: ['Real-time risk scoring', 'Trend analysis', 'Automated reporting']
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: 'Fraud Detection',
      description: 'Advanced fraud detection using machine learning patterns and anomaly detection.',
      benefits: ['97% fraud detection rate', 'Real-time monitoring', 'False positive reduction']
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Regulatory Compliance',
      description: 'Automated compliance checking for SOX, GAAP, and other financial regulations.',
      benefits: ['Automated compliance reports', 'Risk mitigation', 'Audit trail generation']
    }
  ];

  const useCases = [
    {
      title: 'Invoice Processing Automation',
      description: 'Process invoices 80% faster with AI-powered extraction',
      timesSaved: '50 hours/week',
      costSavings: '$18,000/month'
    },
    {
      title: 'Financial Statement Analysis',
      description: 'Analyze financial statements 20x faster with AI insights',
      timesSaved: '75 hours/week',
      costSavings: '$28,000/month'
    },
    {
      title: 'Fraud Prevention',
      description: 'Reduce financial fraud losses by 90% with AI detection',
      timesSaved: '25 hours/week',
      costSavings: '$50,000/month'
    }
  ];

  const financialWorkflows = [
    {
      title: "SOX Compliance Automation",
      problem: "SOX compliance costs $2.3M annually for mid-size companies",
      solution: "Automated controls testing and documentation generation",
      timeSavings: "80% faster compliance",
      costSavings: "$1,800,000/year",
      details: "Automates 404 compliance testing, generates control documentation, and maintains continuous monitoring. Reduces audit preparation from 6 months to 6 weeks."
    },
    {
      title: "Financial Document Classification",
      problem: "Manual document sorting takes 40+ hours/week during audits",
      solution: "AI-powered classification with automated routing and indexing",
      timeSavings: "90% faster processing",
      costSavings: "$120,000/year",
      details: "Classifies invoices, receipts, contracts, and financial statements. Routes to appropriate GL accounts and creates audit-ready documentation trails."
    },
    {
      title: "Audit Trail Generation & Management",
      problem: "Creating audit trails manually costs $500K+ in professional fees",
      solution: "Automated audit trail creation with blockchain verification",
      timeSavings: "95% faster documentation",
      costSavings: "$400,000/audit",
      details: "Generates immutable audit trails for all financial transactions. Creates detailed documentation that satisfies PCAOB and SEC requirements."
    },
    {
      title: "Risk Assessment & Fraud Detection",
      problem: "Financial fraud costs companies 5% of annual revenue",
      solution: "Real-time transaction monitoring with anomaly detection",
      timeSavings: "85% faster detection",
      costSavings: "$2,500,000/year",
      details: "Monitors all financial transactions for unusual patterns. Flags potential fraud, embezzlement, and compliance violations in real-time."
    },
    {
      title: "Financial Reporting Automation",
      problem: "Monthly close process takes 15+ days with high error rates",
      solution: "Automated report generation with variance analysis",
      timeSavings: "70% faster close",
      costSavings: "$300,000/year",
      details: "Automates financial statement preparation, variance analysis, and management reporting. Reduces close cycle from 15 days to 4 days."
    },
    {
      title: "Tax Compliance & Documentation",
      problem: "Tax preparation costs $200K+ annually in professional fees",
      solution: "Automated tax document preparation and compliance checking",
      timeSavings: "75% faster preparation",
      costSavings: "$150,000/year",
      details: "Automates tax return preparation, ensures compliance across jurisdictions, and maintains supporting documentation for audits."
    },
    {
      title: "Budget Planning & Variance Analysis",
      problem: "Budget planning takes 3+ months with limited accuracy",
      solution: "AI-powered forecasting with real-time variance tracking",
      timeSavings: "80% faster planning",
      costSavings: "$200,000/year",
      details: "Creates accurate financial forecasts, tracks budget variances in real-time, and provides predictive analytics for better decision-making."
    },
    {
      title: "Accounts Payable Automation",
      problem: "AP processing costs $15 per invoice with 3% error rates",
      solution: "End-to-end AP automation with three-way matching",
      timeSavings: "90% faster processing",
      costSavings: "$500,000/year",
      details: "Automates invoice processing, approval workflows, and payment execution. Reduces processing costs to $2 per invoice with 99.5% accuracy."
    }
  ];

  const financialIntegrations = [
    { name: "QuickBooks", description: "Small business accounting", logo: "📊", userBase: "7M+ businesses" },
    { name: "SAP", description: "Enterprise ERP platform", logo: "🏢", userBase: "440K+ customers" },
    { name: "Oracle Financials", description: "Cloud financial management", logo: "☁️", userBase: "430K+ users" },
    { name: "NetSuite", description: "Cloud business suite", logo: "💼", userBase: "32K+ organizations" },
    { name: "Workday", description: "Financial management", logo: "⚡", userBase: "10K+ enterprises" },
    { name: "Sage", description: "Business management", logo: "🌿", userBase: "3M+ customers" },
    { name: "Xero", description: "Online accounting", logo: "🔄", userBase: "3.5M+ subscribers" },
    { name: "Microsoft Dynamics", description: "Business applications", logo: "🖥️", userBase: "200K+ organizations" }
  ];

  const complianceFrameworks = [
    {
      title: "SOX Section 404 Compliance",
      description: "Automated internal controls testing and documentation",
      icon: <Shield className="w-6 h-6" />,
      benefit: "$1.8M annual savings",
      requirements: ["Control testing", "Documentation", "Management certification"]
    },
    {
      title: "GAAP Compliance Monitoring",
      description: "Real-time accounting standards compliance checking",
      icon: <FileText className="w-6 h-6" />,
      benefit: "99.9% accuracy",
      requirements: ["Revenue recognition", "Expense matching", "Disclosure requirements"]
    },
    {
      title: "SEC Reporting Automation",
      description: "Automated 10-K, 10-Q, and 8-K report generation",
      icon: <BarChart3 className="w-6 h-6" />,
      benefit: "75% faster filing",
      requirements: ["XBRL formatting", "Disclosure controls", "Certification processes"]
    },
    {
      title: "PCAOB Audit Readiness",
      description: "Continuous audit trail maintenance and documentation",
      icon: <CheckCircle className="w-6 h-6" />,
      benefit: "90% audit efficiency",
      requirements: ["Audit trails", "Supporting documentation", "Control evidence"]
    },
    {
      title: "IFRS Compliance Support",
      description: "International financial reporting standards compliance",
      icon: <Building className="w-6 h-6" />,
      benefit: "Multi-jurisdiction support",
      requirements: ["Fair value measurement", "Impairment testing", "Disclosure standards"]
    },
    {
      title: "Anti-Money Laundering (AML)",
      description: "Automated transaction monitoring and suspicious activity reporting",
      icon: <AlertTriangle className="w-6 h-6" />,
      benefit: "100% transaction coverage",
      requirements: ["Transaction monitoring", "SAR filing", "Customer due diligence"]
    }
  ];

  const riskMitigation = [
    {
      risk: "Financial Fraud & Embezzlement",
      cost: "$4.7B annual losses (ACFE)",
      reduction: "85% detection improvement",
      solution: "Real-time transaction monitoring with ML anomaly detection"
    },
    {
      risk: "SOX Non-Compliance Penalties",
      cost: "$2.3M average compliance cost",
      reduction: "80% cost reduction",
      solution: "Automated controls testing and continuous monitoring"
    },
    {
      risk: "Audit Failures & Restatements",
      cost: "$1.5M average restatement cost",
      reduction: "95% error prevention",
      solution: "Continuous audit trail maintenance and validation"
    },
    {
      risk: "Tax Compliance Violations",
      cost: "$500K average penalty",
      reduction: "99% compliance accuracy",
      solution: "Automated tax calculation and multi-jurisdiction compliance"
    }
  ];

  const handleContactSales = () => {
    navigate('/enterprise#contact');
  };

  const handleScheduleDemo = () => {
    navigate('/enterprise/demo');
  };

  const handleSelfSetup = () => {
    navigate('/pricing?package=financial-ai');
  };

  return (
    <EnterpriseLayout
      showHero
      title="Financial AI Package"
      description="Financial document intelligence and fraud detection"
      maxWidth="6xl"
    >
      <BackToHomeButton variant="enterprise" />
      
      {/* Header */}
      <EnterpriseSection size="lg">
        <div className="text-center">
          <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3 mb-8">
            <DollarSign className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-400 font-medium">FINANCIAL AI • FRAUD DETECTION</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Financial AI Package
            </span>
            <br />
            <span className="text-slate-900">Financial Document Intelligence</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-green-600">Automate financial document processing with AI-powered fraud detection.</span> 
            Process invoices, statements, and financial documents 50% faster while reducing fraud risk by 90%.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">$2,499</div>
              <div className="text-sm text-slate-600">per month</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">50%</div>
              <div className="text-sm text-slate-600">cost reduction</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">97%</div>
              <div className="text-sm text-slate-600">fraud detection rate</div>
            </div>
          </div>
        </div>
      </EnterpriseSection>

      {/* Features */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          AI-Powered Financial Processing
        </h2>
        
        <EnterpriseGrid columns={2}>
          {features.map((feature, index) => (
            <EnterpriseCard key={index}>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, bIndex) => (
                      <div key={bIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </EnterpriseCard>
          ))}
        </EnterpriseGrid>
      </EnterpriseSection>

      {/* Use Cases & ROI */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Real-World Impact for Financial Organizations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <EnterpriseCard key={index} variant="dark">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-slate-300 mb-4">
                  {useCase.description}
                </p>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-400">
                    {useCase.timesSaved}
                  </div>
                  <div className="text-sm text-slate-400">Time Saved</div>
                  <div className="text-lg font-semibold text-green-400">
                    {useCase.costSavings}
                  </div>
                  <div className="text-sm text-slate-400">Cost Savings</div>
                </div>
              </div>
            </EnterpriseCard>
          ))}
        </div>
      </EnterpriseSection>

      {/* CTA Section */}
      <EnterpriseSection size="lg">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Secure Your Financial Operations?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Join 300+ financial institutions who chose AI-powered document processing with advanced fraud detection. 
              <span className="font-semibold text-green-600">Financial security is paramount.</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <EnterpriseCard className="text-center">
                <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Talk to Financial Expert</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Speak with our financial technology specialists
                </p>
                <EnterpriseButton 
                  variant="primary"
                  onClick={handleContactSales}
                  className="w-full"
                >
                  Contact Sales
                </EnterpriseButton>
              </EnterpriseCard>

              <EnterpriseCard className="text-center">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Schedule Demo</h3>
                <p className="text-sm text-slate-600 mb-4">
                  See financial AI processing in action
                </p>
                <EnterpriseButton 
                  variant="secondary"
                  onClick={handleScheduleDemo}
                  className="w-full"
                >
                  Book Demo
                </EnterpriseButton>
              </EnterpriseCard>

              <EnterpriseCard className="text-center">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Start Immediately</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Set up your secure account automatically
                </p>
                <EnterpriseButton 
                  variant="ghost"
                  onClick={handleSelfSetup}
                  className="w-full"
                >
                  Self Setup
                </EnterpriseButton>
              </EnterpriseCard>
            </div>
          </div>
        </div>
      </EnterpriseSection>

      {/* Financial Workflows Section */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Financial Automation That CFOs Love
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Proven workflows that reduce costs while strengthening controls
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workflow Selector */}
          <div className="space-y-4">
            {financialWorkflows.map((workflow, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl cursor-pointer transition-all ${
                  selectedWorkflow === index
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-md'
                }`}
                onClick={() => setSelectedWorkflow(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{workflow.title}</h3>
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div className="mt-2 flex space-x-4 text-sm">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {workflow.timeSavings}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {workflow.costSavings}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {financialWorkflows[selectedWorkflow].title}
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Financial Challenge:</h4>
                <p className="text-gray-600 dark:text-gray-400">{financialWorkflows[selectedWorkflow].problem}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-600 mb-2">AI Solution:</h4>
                <p className="text-gray-600 dark:text-gray-400">{financialWorkflows[selectedWorkflow].solution}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">Implementation:</h4>
                <p className="text-gray-600 dark:text-gray-400">{financialWorkflows[selectedWorkflow].details}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{financialWorkflows[selectedWorkflow].timeSavings}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Efficiency Gain</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{financialWorkflows[selectedWorkflow].costSavings}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Annual Savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EnterpriseSection>

      {/* Compliance Frameworks */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Built for Financial Compliance
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Automated compliance across all major financial regulations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {complianceFrameworks.map((framework, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="text-green-600 mr-3">{framework.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{framework.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">{framework.description}</p>
              <div className="text-sm font-medium text-green-600 mb-3">{framework.benefit}</div>
              <div className="space-y-1">
                {framework.requirements.map((req, reqIndex) => (
                  <div key={reqIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    {req}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </EnterpriseSection>

      {/* Financial Software Integration */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Seamless Integration with Your Financial Stack
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Works with 95% of financial software platforms
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {financialIntegrations.map((integration, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{integration.logo}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{integration.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{integration.description}</p>
              <div className="text-xs text-green-600 font-medium">{integration.userBase}</div>
            </div>
          ))}
        </div>
      </EnterpriseSection>

      {/* Risk Mitigation */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Risk Mitigation Worth Millions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Financial AI that prevents problems instead of creating them
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {riskMitigation.map((risk, index) => (
            <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">{risk.risk}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-green-200">{risk.cost}</div>
                  <div className="text-green-100 text-sm">Industry Average</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{risk.reduction}</div>
                  <div className="text-green-100 text-sm">Risk Reduction</div>
                </div>
              </div>
              <p className="text-green-100">{risk.solution}</p>
            </div>
          ))}
        </div>
      </EnterpriseSection>

      {/* Pricing & ROI */}
      <EnterpriseSection size="lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            $2,499/Month Investment → $1.8M+ Annual Returns
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Mid-size companies typically spend $2.3M annually on SOX compliance. 
            Our AI reduces this by 80% while improving accuracy and audit readiness.
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">$2.3M</div>
                <div className="text-gray-600 dark:text-gray-400">Typical SOX Cost</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">80%</div>
                <div className="text-gray-600 dark:text-gray-400">Cost Reduction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">$1.8M</div>
                <div className="text-gray-600 dark:text-gray-400">Annual Savings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">6,000%</div>
                <div className="text-gray-600 dark:text-gray-400">First Year ROI</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors mr-4">
              Start SOX-Compliant Trial
            </button>
            <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors">
              Schedule CFO Demo
            </button>
          </div>
        </div>
      </EnterpriseSection>
    </EnterpriseLayout>
  );
};

export default FinancialAIPackage; 