import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  Shield, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Gavel,
  Lock,
  Eye,
  Clock,
  Users,
  Phone,
  Calendar,
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

const LegalAIPackage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUseCase, setSelectedUseCase] = useState(0);

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Contract Analysis & Clause Extraction',
      description: 'AI-powered analysis of legal contracts with automatic clause identification and risk assessment.',
      benefits: ['95% accuracy in clause detection', 'Automated risk scoring', 'Template matching']
    },
    {
      icon: <Gavel className="h-6 w-6" />,
      title: 'Legal Document Classification',
      description: 'Intelligent categorization of legal documents with court-specific formatting.',
      benefits: ['99% classification accuracy', 'Court format compliance', 'Automated filing preparation']
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Redaction & Privacy Protection',
      description: 'Automated detection and redaction of sensitive information in legal documents.',
      benefits: ['HIPAA/PII compliance', 'Attorney-client privilege protection', 'Audit trail generation']
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Citation & Reference Validation',
      description: 'Verify legal citations and cross-reference case law automatically.',
      benefits: ['Real-time citation checking', 'Case law validation', 'Precedent analysis']
    }
  ];

  const useCases = [
    {
      title: "Contract Analysis & Risk Assessment",
      problem: "Manual contract review takes 5-10 hours per document",
      solution: "AI-powered clause analysis with risk scoring and compliance checking",
      timeSavings: "70% faster review",
      costSavings: "$24,000/month",
      details: "Automatically identifies non-standard clauses, liability risks, and compliance gaps. Generates executive summaries with risk ratings."
    },
    {
      title: "Litigation Support & eDiscovery",
      problem: "eDiscovery costs $2-5K per GB with 90% irrelevant documents",
      solution: "Intelligent document relevance scoring and privilege review",
      timeSavings: "90% cost reduction",
      costSavings: "$200,000/case",
      details: "Reduces document review volumes by 85% while maintaining 99.9% accuracy. Automated privilege logs and work product protection."
    },
    {
      title: "Due Diligence Automation",
      problem: "M&A due diligence requires 200+ hours of document review",
      solution: "Automated document classification and red flag identification",
      timeSavings: "80% faster completion",
      costSavings: "$150,000/deal",
      details: "Processes thousands of documents in hours, not weeks. Identifies material contracts, litigation risks, and compliance issues."
    },
    {
      title: "Regulatory Compliance Monitoring",
      problem: "Manual compliance checking across multiple jurisdictions",
      solution: "Real-time regulatory change monitoring and impact assessment",
      timeSavings: "60% faster updates",
      costSavings: "$50,000/year",
      details: "Tracks regulatory changes across 50+ jurisdictions. Automatically flags affected documents and suggests updates."
    },
    {
      title: "Legal Research & Case Law Analysis",
      problem: "Research takes 10-15 hours per brief with inconsistent quality",
      solution: "AI-powered case law analysis with precedent matching",
      timeSavings: "75% faster research",
      costSavings: "$30,000/month",
      details: "Analyzes millions of cases to find relevant precedents. Generates citation-ready summaries with confidence scores."
    },
    {
      title: "Document Drafting & Template Management",
      problem: "Creating custom documents from scratch for each client",
      solution: "Intelligent template selection and clause customization",
      timeSavings: "65% faster drafting",
      costSavings: "$18,000/month",
      details: "Suggests optimal clauses based on deal type, jurisdiction, and risk profile. Maintains consistency across all documents."
    },
    {
      title: "Client Intake & Matter Management",
      problem: "Manual client onboarding and conflict checking",
      solution: "Automated intake processing with conflict detection",
      timeSavings: "80% faster onboarding",
      costSavings: "$12,000/month",
      details: "Processes intake forms, runs conflict checks, and creates matter files automatically. Integrates with practice management systems."
    },
    {
      title: "Billing & Time Entry Optimization",
      problem: "Attorneys lose 15-20% billable time to administrative tasks",
      solution: "AI-powered time tracking and billing narrative generation",
      timeSavings: "20% more billable hours",
      costSavings: "$100,000/year",
      details: "Automatically tracks time spent on documents and generates detailed billing narratives. Improves realization rates by 15%."
    },
    {
      title: "Expert Witness Report Generation",
      problem: "Technical reports take 40+ hours with high expert costs",
      solution: "Automated technical analysis with expert-ready summaries",
      timeSavings: "85% faster reports",
      costSavings: "$75,000/case",
      details: "Generates comprehensive technical analyses that experts can review and certify. Reduces expert time by 80%."
    },
    {
      title: "Chain of Custody & Evidence Management",
      problem: "Manual evidence tracking creates admissibility risks",
      solution: "Blockchain-verified chain of custody with automated documentation",
      timeSavings: "90% faster processing",
      costSavings: "$25,000/case",
      details: "Immutable evidence tracking from collection to court. Generates court-ready chain of custody reports automatically."
    }
  ];

  const integrations = [
    { name: "Clio", description: "Practice management integration", logo: "🏛️" },
    { name: "LexisNexis", description: "Legal research platform", logo: "📚" },
    { name: "Westlaw", description: "Case law database", logo: "⚖️" },
    { name: "DocuSign", description: "Document execution", logo: "✍️" },
    { name: "Relativity", description: "eDiscovery platform", logo: "🔍" },
    { name: "NetDocuments", description: "Document management", logo: "📁" },
    { name: "Microsoft 365", description: "Office suite integration", logo: "💼" },
    { name: "Salesforce", description: "CRM integration", logo: "☁️" }
  ];

  const complianceFeatures = [
    {
      title: "Attorney-Client Privilege Protection",
      description: "AI processing never compromises privileged communications",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "Work Product Doctrine Compliance",
      description: "Maintains work product protection throughout analysis",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Court-Admissible Reports",
      description: "Generates reports that meet Federal Rules of Evidence 902(14)",
      icon: <Scale className="w-6 h-6" />
    },
    {
      title: "Audit Trail Generation",
      description: "Complete documentation of all AI processing steps",
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: "Data Residency Control",
      description: "All processing occurs on your infrastructure",
      icon: <Building className="w-6 h-6" />
    },
    {
      title: "Professional Liability Coverage",
      description: "Backed by $10M professional liability insurance",
      icon: <AlertTriangle className="w-6 h-6" />
    }
  ];

  const handleContactSales = () => {
    // Navigate to contact form or open calendar booking
    navigate('/enterprise#contact');
  };

  const handleScheduleDemo = () => {
    // Navigate to demo scheduling
    navigate('/enterprise/demo');
  };

  const handleSelfSetup = () => {
    // Navigate to automated account setup
    navigate('/pricing?package=legal-ai');
  };

  return (
    <EnterpriseLayout
      showHero
      title="Legal AI Package"
      description="Specialized AI for legal document processing and analysis"
      maxWidth="6xl"
    >
      <BackToHomeButton variant="enterprise" />
      
      {/* Header */}
      <EnterpriseSection size="lg">
        <div className="text-center">
          <div className="inline-flex items-center bg-indigo-500/10 border border-indigo-500/20 rounded-full px-6 py-3 mb-8">
            <Scale className="w-5 h-5 text-indigo-400 mr-2" />
            <span className="text-indigo-400 font-medium">LEGAL AI • COURT-TESTED</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Legal AI Package
            </span>
            <br />
            <span className="text-slate-900">Specialized AI for Legal Professionals</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-indigo-600">Transform your legal document workflow with AI.</span> 
            Process contracts, discovery documents, and legal filings 60% faster with court-tested accuracy.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="text-2xl font-bold text-indigo-600 mb-1">$2,999</div>
              <div className="text-sm text-slate-600">per month</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="text-2xl font-bold text-indigo-600 mb-1">40%</div>
              <div className="text-sm text-slate-600">faster document review</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="text-2xl font-bold text-indigo-600 mb-1">95%</div>
              <div className="text-sm text-slate-600">AI accuracy rate</div>
            </div>
          </div>
        </div>
      </EnterpriseSection>

      {/* Features */}
      <EnterpriseSection size="lg">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          AI-Powered Legal Document Processing
        </h2>
        
        <EnterpriseGrid columns={2}>
          {features.map((feature, index) => (
            <EnterpriseCard key={index}>
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-lg flex-shrink-0">
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
          Real-World Impact for Legal Teams
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <EnterpriseCard key={index} variant="dark">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-slate-300 mb-4">
                  {useCase.solution}
                </p>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-indigo-400">
                    {useCase.timeSavings}
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
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Transform Your Legal Practice?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Join 500+ legal professionals who chose AI-powered document processing that strengthens cases 
              instead of creating liability. <span className="font-semibold text-indigo-600">Your clients' trust depends on it.</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <EnterpriseCard className="text-center">
                <Phone className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Talk to Legal Expert</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Speak with our legal technology specialists about your specific needs
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
                <Calendar className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Schedule Demo</h3>
                <p className="text-sm text-slate-600 mb-4">
                  See the Legal AI Package in action with your own documents
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
                <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Start Immediately</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Set up your account automatically and start processing today
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
    </EnterpriseLayout>
  );
};

export default LegalAIPackage; 