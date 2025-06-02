import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Lock,
  Eye,
  Clock,
  Users,
  Phone,
  Calendar,
  Activity,
  UserCheck,
  DollarSign,
  Zap,
  Building,
  AlertTriangle,
  TrendingUp
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
import SelfSetupSystem from '../../components/SelfSetupSystem';

const HealthcareAIPackage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWorkflow, setSelectedWorkflow] = useState(0);
  const [showSelfSetup, setShowSelfSetup] = useState(false);

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Medical Record Processing',
      description: 'AI-powered extraction and analysis of patient data from medical records with HIPAA compliance.',
      benefits: ['98% accuracy in data extraction', 'HIPAA-compliant processing', 'Automated PHI detection']
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Insurance Claim Analysis',
      description: 'Intelligent processing of insurance claims with fraud detection and approval recommendations.',
      benefits: ['95% fraud detection accuracy', 'Automated claim routing', 'Real-time approval scoring']
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: 'Patient Data Extraction',
      description: 'Secure extraction of patient information with automatic anonymization and privacy protection.',
      benefits: ['Zero PHI exposure', 'Automated anonymization', 'Audit trail compliance']
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: 'Compliance Monitoring',
      description: 'Continuous monitoring for HIPAA, HITECH, and other healthcare compliance requirements.',
      benefits: ['Real-time compliance alerts', 'Automated reporting', 'Risk assessment scoring']
    }
  ];

  const useCases = [
    {
      title: 'Claims Processing Acceleration',
      description: 'Process insurance claims 70% faster with AI-powered analysis',
      timesSaved: '60 hours/week',
      costSavings: '$20,000/month'
    },
    {
      title: 'Medical Record Digitization',
      description: 'Convert paper records to digital format 15x faster',
      timesSaved: '100 hours/week',
      costSavings: '$35,000/month'
    },
    {
      title: 'Compliance Automation',
      description: 'Reduce compliance violations by 85% with automated monitoring',
      timesSaved: '30 hours/week',
      costSavings: '$12,000/month'
    }
  ];

  const medicalWorkflows = [
    {
      title: "Medical Records Classification & Routing",
      problem: "Manual sorting of patient documents takes 20+ hours/week",
      solution: "HIPAA-compliant AI classification with automated EHR routing",
      timeSavings: "85% faster processing",
      costSavings: "$50,000/month",
      details: "Automatically classifies lab results, imaging reports, physician notes, and insurance documents. Routes to appropriate EHR sections while maintaining audit trails."
    },
    {
      title: "Insurance Claims Processing Automation",
      problem: "Claims processing takes 7-14 days with 30% error rates",
      solution: "Automated claim validation with real-time eligibility checking",
      timeSavings: "90% faster approval",
      costSavings: "$75,000/month",
      details: "Validates patient information, checks coverage, identifies missing documentation, and flags potential denials before submission."
    },
    {
      title: "Clinical Documentation Improvement",
      problem: "Incomplete documentation leads to $125K annual revenue loss",
      solution: "AI-powered documentation gap analysis and coding optimization",
      timeSavings: "70% faster coding",
      costSavings: "$200,000/year",
      details: "Identifies missing diagnoses, suggests appropriate codes, and ensures documentation supports billing. Improves coding accuracy by 95%."
    },
    {
      title: "Patient Privacy Protection & Audit",
      problem: "HIPAA compliance audits cost $500K+ when violations found",
      solution: "Continuous privacy monitoring with automated risk assessment",
      timeSavings: "95% faster audits",
      costSavings: "$500,000 risk reduction",
      details: "Monitors all document access, identifies potential privacy breaches, and generates compliance reports. Prevents violations before they occur."
    },
    {
      title: "Telemedicine Documentation Verification",
      problem: "Remote consultations create documentation quality concerns",
      solution: "Real-time image verification and quality assessment",
      timeSavings: "80% faster verification",
      costSavings: "$30,000/month",
      details: "Validates medical images for quality and authenticity. Ensures telemedicine documentation meets clinical standards and legal requirements."
    },
    {
      title: "Research Data Validation & Compliance",
      problem: "Clinical research data validation takes 100+ hours per study",
      solution: "Automated data integrity checking with regulatory compliance",
      timeSavings: "90% faster validation",
      costSavings: "$150,000/study",
      details: "Validates research data against protocols, identifies anomalies, and ensures FDA compliance. Accelerates study timelines by months."
    },
    {
      title: "Medical Imaging Workflow Optimization",
      problem: "Radiology backlogs delay diagnosis by 3-5 days",
      solution: "AI-powered image prioritization and quality control",
      timeSavings: "60% faster reporting",
      costSavings: "$100,000/month",
      details: "Prioritizes urgent cases, performs quality checks, and routes images to appropriate specialists. Reduces critical diagnosis delays."
    },
    {
      title: "Prescription Management & Safety",
      problem: "Medication errors affect 1.5M patients annually",
      solution: "Automated prescription verification and interaction checking",
      timeSavings: "95% error reduction",
      costSavings: "$250,000 liability reduction",
      details: "Validates prescriptions against patient history, checks drug interactions, and ensures dosage accuracy. Prevents adverse events."
    }
  ];

  const ehrIntegrations = [
    { name: "Epic", description: "Complete EHR integration", logo: "🏥", marketShare: "31%" },
    { name: "Cerner", description: "Oracle Health platform", logo: "⚕️", marketShare: "25%" },
    { name: "Allscripts", description: "Healthcare IT solutions", logo: "📋", marketShare: "8%" },
    { name: "athenahealth", description: "Cloud-based EHR", logo: "☁️", marketShare: "6%" },
    { name: "NextGen", description: "Ambulatory EHR", logo: "🔄", marketShare: "4%" },
    { name: "eClinicalWorks", description: "Unified healthcare IT", logo: "💻", marketShare: "4%" },
    { name: "MEDITECH", description: "Integrated EHR", logo: "🏨", marketShare: "3%" },
    { name: "Greenway", description: "Practice management", logo: "🌿", marketShare: "2%" }
  ];

  const hipaaCompliance = [
    {
      title: "Zero PHI Transmission",
      description: "Patient data never leaves your secure environment",
      icon: <Lock className="w-6 h-6" />,
      benefit: "Eliminates breach risk"
    },
    {
      title: "Automated Audit Trails",
      description: "Complete documentation of all data access and processing",
      icon: <FileText className="w-6 h-6" />,
      benefit: "Audit-ready compliance"
    },
    {
      title: "Role-Based Access Control",
      description: "Granular permissions based on job function and need-to-know",
      icon: <Users className="w-6 h-6" />,
      benefit: "Minimum necessary access"
    },
    {
      title: "Encryption at Rest & Transit",
      description: "AES-256 encryption for all data storage and transmission",
      icon: <Shield className="w-6 h-6" />,
      benefit: "Military-grade security"
    },
    {
      title: "Business Associate Agreement",
      description: "Comprehensive BAA covering all AI processing activities",
      icon: <FileText className="w-6 h-6" />,
      benefit: "Legal compliance coverage"
    },
    {
      title: "Incident Response Plan",
      description: "24/7 security monitoring with immediate breach notification",
      icon: <AlertTriangle className="w-6 h-6" />,
      benefit: "Rapid threat response"
    }
  ];

  const riskReduction = [
    {
      risk: "HIPAA Violation Penalties",
      cost: "$1.5M average fine",
      reduction: "99% risk elimination",
      solution: "Local processing prevents data exposure"
    },
    {
      risk: "Medical Malpractice Claims",
      cost: "$250K average settlement",
      reduction: "80% documentation improvement",
      solution: "AI ensures complete clinical documentation"
    },
    {
      risk: "Coding & Billing Errors",
      cost: "$125K annual revenue loss",
      reduction: "95% accuracy improvement",
      solution: "Automated coding validation and optimization"
    },
    {
      risk: "Operational Inefficiencies",
      cost: "$500K annual waste",
      reduction: "70% process optimization",
      solution: "Streamlined workflows and automation"
    }
  ];

  // Cost Comparison Data
  const costComparison = [
    {
      category: "Traditional Manual Processing",
      setup: "$0",
      monthly: "$0",
      staffCosts: "$15,000/month",
      errorCosts: "$8,000/month",
      complianceCosts: "$5,000/month",
      total: "$28,000/month",
      annual: "$336,000/year"
    },
    {
      category: "Basic Document Management",
      setup: "$10,000",
      monthly: "$2,000",
      staffCosts: "$12,000/month",
      errorCosts: "$6,000/month",
      complianceCosts: "$4,000/month",
      total: "$24,000/month",
      annual: "$298,000/year"
    },
    {
      category: "ProofPix Healthcare AI",
      setup: "$0",
      monthly: "$3,999",
      staffCosts: "$6,000/month",
      errorCosts: "$400/month",
      complianceCosts: "$500/month",
      total: "$10,899/month",
      annual: "$130,788/year"
    }
  ];

  // Feature Comparison Data
  const featureComparison = [
    {
      feature: "HIPAA Compliance",
      manual: "❌ Manual processes",
      basic: "⚠️ Basic compliance",
      proofpix: "✅ Built-in compliance"
    },
    {
      feature: "OCR Accuracy",
      manual: "❌ Human error prone",
      basic: "⚠️ 85% accuracy",
      proofpix: "✅ 99.2% accuracy"
    },
    {
      feature: "Processing Speed",
      manual: "❌ 2-3 days",
      basic: "⚠️ 4-6 hours",
      proofpix: "✅ 2-5 minutes"
    },
    {
      feature: "Data Security",
      manual: "❌ Physical documents",
      basic: "⚠️ Server storage",
      proofpix: "✅ Client-side only"
    },
    {
      feature: "Integration",
      manual: "❌ No integration",
      basic: "⚠️ Limited APIs",
      proofpix: "✅ Full EHR integration"
    },
    {
      feature: "AI Analysis",
      manual: "❌ None",
      basic: "❌ None",
      proofpix: "✅ Advanced AI insights"
    },
    {
      feature: "Audit Trail",
      manual: "❌ Paper based",
      basic: "⚠️ Basic logging",
      proofpix: "✅ Complete audit trail"
    },
    {
      feature: "Scalability",
      manual: "❌ Linear scaling",
      basic: "⚠️ Limited scaling",
      proofpix: "✅ Unlimited scaling"
    }
  ];

  const handleContactSales = () => {
    navigate('/enterprise#contact');
  };

  const handleScheduleDemo = () => {
    navigate('/enterprise/demo');
  };

  const handleSelfSetup = () => {
    setShowSelfSetup(true);
  };

  const handleSetupComplete = (credentials: any) => {
    setShowSelfSetup(false);
    // Handle successful setup
    console.log('Setup completed with credentials:', credentials);
  };

  const handleSetupCancel = () => {
    setShowSelfSetup(false);
  };

  if (showSelfSetup) {
    return (
      <SelfSetupSystem
        packageType="healthcare-ai"
        onComplete={handleSetupComplete}
        onCancel={handleSetupCancel}
      />
    );
  }

  return (
    <EnterpriseLayout
      showHero
      title="Healthcare AI Package"
      description="HIPAA-compliant medical document AI processing"
      maxWidth="6xl"
    >
      <BackToHomeButton variant="enterprise" />
      
      {/* Header */}
      <EnterpriseSection size="lg">
        <div className="text-center">
          <div className="inline-flex items-center bg-red-500/10 border border-red-500/20 rounded-full px-6 py-3 mb-8">
            <Heart className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-400 font-medium">HEALTHCARE AI • HIPAA COMPLIANT</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Healthcare AI Package
            </span>
            <br />
            <span className="text-slate-900">HIPAA-Compliant Medical Document AI</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-red-600">Secure medical document processing with zero PHI exposure.</span> 
            Process patient records, insurance claims, and medical documents 60% faster while maintaining strict compliance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-2xl font-bold text-red-600 mb-1">$3,999</div>
              <div className="text-sm text-slate-600">per month</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-2xl font-bold text-red-600 mb-1">60%</div>
              <div className="text-sm text-slate-600">reduction in processing time</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-2xl font-bold text-red-600 mb-1">100%</div>
              <div className="text-sm text-slate-600">HIPAA compliance</div>
            </div>
          </div>
        </div>
      </EnterpriseSection>

      {/* Features */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          HIPAA-Compliant AI Processing
        </h2>
        
        <EnterpriseGrid columns={2}>
          {features.map((feature, index) => (
            <EnterpriseCard key={index}>
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
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
          Real-World Impact for Healthcare Organizations
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
                  <div className="text-2xl font-bold text-red-400">
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
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border border-red-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Secure Your Healthcare Data Processing?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Join 200+ healthcare organizations who chose AI-powered document processing with zero PHI exposure. 
              <span className="font-semibold text-red-600">Patient privacy is non-negotiable.</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <EnterpriseCard className="text-center">
                <Phone className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Talk to Healthcare Expert</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Speak with our healthcare compliance specialists
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
                <Calendar className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Schedule Demo</h3>
                <p className="text-sm text-slate-600 mb-4">
                  See HIPAA-compliant processing in action
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
                <Clock className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Start Immediately</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Set up your compliant account automatically
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

      {/* Medical Workflows Section */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Medical Workflow Automation That Saves Lives & Money
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Real healthcare workflows with quantified outcomes from our medical customers
          </p>
        </div>

        <div className="space-y-4">
          {medicalWorkflows.map((workflow, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl cursor-pointer transition-all ${
                selectedWorkflow === index
                  ? 'bg-red-600 text-white shadow-lg'
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
            {medicalWorkflows[selectedWorkflow].title}
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Clinical Challenge:</h4>
              <p className="text-gray-600 dark:text-gray-400">{medicalWorkflows[selectedWorkflow].problem}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-600 mb-2">AI Solution:</h4>
              <p className="text-gray-600 dark:text-gray-400">{medicalWorkflows[selectedWorkflow].solution}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Implementation:</h4>
              <p className="text-gray-600 dark:text-gray-400">{medicalWorkflows[selectedWorkflow].details}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">{medicalWorkflows[selectedWorkflow].timeSavings}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Efficiency Gain</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{medicalWorkflows[selectedWorkflow].costSavings}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Annual Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EnterpriseSection>

      {/* HIPAA Compliance Section */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            HIPAA Compliance by Design, Not by Accident
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            The only AI platform that makes HIPAA violations technically impossible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hipaaCompliance.map((feature, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="text-red-600 mr-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">{feature.description}</p>
              <div className="text-sm font-medium text-green-600">{feature.benefit}</div>
            </div>
          ))}
        </div>
      </EnterpriseSection>

      {/* EHR Integration Showcase */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Seamless EHR Integration Across All Major Platforms
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Works with 85% of healthcare providers' existing EHR systems
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ehrIntegrations.map((integration, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{integration.logo}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{integration.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{integration.description}</p>
              <div className="text-xs text-blue-600 font-medium">{integration.marketShare} market share</div>
            </div>
          ))}
        </div>
      </EnterpriseSection>

      {/* Risk Reduction Value */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Risk Reduction Worth More Than the Savings
          </h2>
          <p className="text-xl text-red-100">
            Healthcare AI that eliminates risks instead of creating them
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {riskReduction.map((risk, index) => (
            <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">{risk.risk}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-red-200">{risk.cost}</div>
                  <div className="text-red-100 text-sm">Potential Cost</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-300">{risk.reduction}</div>
                  <div className="text-red-100 text-sm">Risk Reduction</div>
                </div>
              </div>
              <p className="text-red-100">{risk.solution}</p>
            </div>
          ))}
        </div>
      </EnterpriseSection>

      {/* Cost Comparison Section */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Cost Comparison: Why Healthcare AI Pays for Itself
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            See how ProofPix Healthcare AI delivers immediate ROI compared to traditional methods
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Solution</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Setup Cost</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Monthly Software</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Staff Costs</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Error Costs</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Total Monthly</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Annual Cost</th>
              </tr>
            </thead>
            <tbody>
              {costComparison.map((item, index) => (
                <tr key={index} className={`border-t ${index === 2 ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.category}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{item.setup}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{item.monthly}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{item.staffCosts}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{item.errorCosts}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">{item.total}</td>
                  <td className="px-6 py-4 text-center font-bold text-lg text-gray-900 dark:text-white">{item.annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
              Annual Savings: $205,212
            </h3>
            <p className="text-green-700 dark:text-green-400">
              ProofPix Healthcare AI pays for itself in just 2.1 months
            </p>
          </div>
        </div>
      </EnterpriseSection>

      {/* Feature Comparison Section */}
      <EnterpriseSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Feature Comparison: Why Healthcare Professionals Choose ProofPix
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            See how our AI-powered solution compares to traditional document processing methods
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Feature</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Manual Processing</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Basic Software</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">ProofPix Healthcare AI</th>
              </tr>
            </thead>
            <tbody>
              {featureComparison.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.feature}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{item.manual}</td>
                  <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{item.basic}</td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600 dark:text-green-400">{item.proofpix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">Manual</div>
            <div className="text-red-700 dark:text-red-300">High risk, slow, expensive</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">Basic Software</div>
            <div className="text-yellow-700 dark:text-yellow-300">Limited features, compliance gaps</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">ProofPix AI</div>
            <div className="text-green-700 dark:text-green-300">Complete solution, HIPAA compliant</div>
          </div>
        </div>
      </EnterpriseSection>

      {/* Pricing & ROI */}
      <EnterpriseSection size="lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            $3,999/Month Investment → $50,000+ Monthly Returns
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Regional hospitals typically save 20+ hours/week on documentation alone. 
            At $150/hour clinical time, that's $156,000 in annual savings—plus $500K+ in risk reduction.
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">20</div>
                <div className="text-gray-600 dark:text-gray-400">Hours Saved/Week</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">$156K</div>
                <div className="text-gray-600 dark:text-gray-400">Annual Savings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">$500K</div>
                <div className="text-gray-600 dark:text-gray-400">Risk Reduction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">1,250%</div>
                <div className="text-gray-600 dark:text-gray-400">Total ROI</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors mr-4">
              Start HIPAA-Compliant Trial
            </button>
            <button className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transition-colors">
              Schedule Clinical Demo
            </button>
          </div>
        </div>
      </EnterpriseSection>
    </EnterpriseLayout>
  );
};

export default HealthcareAIPackage; 