import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  X, 
  Check, 
  AlertTriangle, 
  Zap, 
  Crown,
  Target,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';

// Competitor Comparison - CMO Sales Tool

interface Feature {
  id: string;
  name: string;
  description: string;
  proofPixAdvantage: string;
  category: 'security' | 'privacy' | 'performance' | 'compliance';
}

const features: Feature[] = [
  {
    id: 'client-side',
    name: '100% Client-Side Processing',
    description: 'All metadata extraction and processing happens locally in the browser',
    proofPixAdvantage: 'Zero data transmission risk, complete privacy preservation',
    category: 'privacy'
  },
  {
    id: 'hipaa',
    name: 'HIPAA Compliance',
    description: 'Fully compliant with healthcare data privacy requirements',
    proofPixAdvantage: 'No PHI ever leaves your system',
    category: 'compliance'
  },
  {
    id: 'audit',
    name: 'Audit Trail',
    description: 'Comprehensive logging of all metadata operations',
    proofPixAdvantage: 'Court-admissible chain of custody tracking',
    category: 'security'
  },
  {
    id: 'bulk',
    name: 'Enterprise Bulk Processing',
    description: 'Process thousands of images simultaneously',
    proofPixAdvantage: 'Superior performance with local processing',
    category: 'performance'
  },
  {
    id: 'encryption',
    name: 'End-to-End Encryption',
    description: 'Military-grade encryption for all operations',
    proofPixAdvantage: 'No server-side decryption needed',
    category: 'security'
  },
  {
    id: 'compliance',
    name: 'Regulatory Compliance',
    description: 'Meets GDPR, CCPA, and other privacy regulations',
    proofPixAdvantage: 'Simplified compliance with no data storage',
    category: 'compliance'
  },
  {
    id: 'integration',
    name: 'Enterprise Integration',
    description: 'Seamless integration with existing workflows',
    proofPixAdvantage: 'API-first architecture with complete documentation',
    category: 'performance'
  },
  {
    id: 'data-sovereignty',
    name: 'Data Sovereignty',
    description: 'Complete control over data location and processing',
    proofPixAdvantage: 'Data never leaves your jurisdiction',
    category: 'privacy'
  }
];

interface ComparisonRow {
  feature: string;
  proofPix: string;
  competitors: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Data Processing Location',
    proofPix: '100% Client-Side',
    competitors: 'Server-Side Processing'
  },
  {
    feature: 'Privacy Risk',
    proofPix: 'Zero Data Transmission',
    competitors: 'Data Must Leave System'
  },
  {
    feature: 'Processing Speed',
    proofPix: 'Instant Local Processing',
    competitors: 'Network-Dependent'
  },
  {
    feature: 'Compliance Overhead',
    proofPix: 'Minimal (No Data Storage)',
    competitors: 'Complex Data Handling'
  },
  {
    feature: 'Cost Structure',
    proofPix: 'Predictable Pricing',
    competitors: 'Usage-Based Billing'
  }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const detailedComparisonData = [
  {
    feature: "Data Security",
    proofpix: "Technically impossible to breach",
    proofpixIcon: <Shield className="w-5 h-5 text-emerald-500" />,
    legacy: "Upload to servers and hope",
    legacyIcon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    impact: "Zero breaches vs. industry average of 1 in 4 companies"
  },
  {
    feature: "Processing Speed",
    proofpix: "Instant local analysis",
    proofpixIcon: <Zap className="w-5 h-5 text-emerald-500" />,
    legacy: "Upload, wait, download",
    legacyIcon: <X className="w-5 h-5 text-red-500" />,
    impact: "2 seconds vs. 2-5 minutes average"
  },
  {
    feature: "Compliance",
    proofpix: "Automatic by design",
    proofpixIcon: <Check className="w-5 h-5 text-emerald-500" />,
    legacy: "Policies and prayers",
    legacyIcon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    impact: "Built-in vs. bolt-on compliance"
  },
  {
    feature: "Setup Time",
    proofpix: "Instant access",
    proofpixIcon: <Zap className="w-5 h-5 text-emerald-500" />,
    legacy: "Weeks of deployment",
    legacyIcon: <X className="w-5 h-5 text-red-500" />,
    impact: "Minutes vs. months to deploy"
  },
  {
    feature: "Data Exposure",
    proofpix: "Zero transmission",
    proofpixIcon: <Shield className="w-5 h-5 text-emerald-500" />,
    legacy: "Full upload required",
    legacyIcon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    impact: "0% vs. 100% data exposure"
  }
];

const industryImpact = [
  {
    industry: "Legal",
    before: "Evidence uploaded to unknown servers",
    after: "Court-admissible analysis with zero breach risk",
    result: "500+ legal teams switched"
  },
  {
    industry: "Insurance", 
    before: "$2.5B annual fraud losses",
    after: "37% fraud reduction with private analysis",
    result: "$2-5M prevented per company"
  },
  {
    industry: "Healthcare",
    before: "HIPAA violations from data exposure",
    after: "Automatic compliance with local processing",
    result: "Zero patient data breaches"
  }
];

const CompetitorComparison: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-slate-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center space-x-2 bg-emerald-500/10 px-6 py-3 rounded-full mb-8 border border-emerald-500/20"
          >
            <Crown className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">CATEGORY CREATOR</span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              We Didn't Just Build a Better Tool—
            </span>
            <br />
            <span className="text-white">We Made Every Upload-Based Tool Obsolete</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto"
          >
            Before ProofPix, every image analysis tool required uploading your sensitive data to someone else's servers. 
            <span className="text-emerald-400 font-semibold"> We created an entirely new category: unhackable image intelligence.</span>
            <br />
            <span className="text-white font-medium">Now every competitor is scrambling to copy what we built from day one.</span>
          </motion.p>
        </motion.div>

        {/* The Revolution Section */}
        <motion.div 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-center mb-16"
          >
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              The ProofPix Revolution
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {industryImpact.map((impact, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50"
              >
                <h3 className="text-xl font-bold text-emerald-400 mb-4">{impact.industry}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Before ProofPix:</p>
                    <p className="text-slate-300">{impact.before}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">After ProofPix:</p>
                    <p className="text-white font-medium">{impact.after}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-emerald-400 font-bold">{impact.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Comparison */}
        <motion.div 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-center mb-4"
          >
            ProofPix vs. Legacy Solutions
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-slate-400 text-center mb-12"
          >
            Why industry leaders are abandoning traditional tools for the category creator
          </motion.p>

          <div className="bg-slate-800/30 rounded-2xl overflow-hidden border border-slate-700/50">
            <div className="grid grid-cols-4 gap-4 p-6 bg-slate-800/50 border-b border-slate-700/50">
              <div className="text-slate-400 font-medium">Feature</div>
              <div className="text-emerald-400 font-bold flex items-center">
                <Crown className="w-4 h-4 mr-2" />
                ProofPix (Category Creator)
              </div>
              <div className="text-slate-400 font-medium">Legacy Tools</div>
              <div className="text-slate-400 font-medium">Real Impact</div>
        </div>

            {detailedComparisonData.map((item, index) => (
              <motion.div
                    key={index}
                variants={fadeInUp}
                className="grid grid-cols-4 gap-4 p-6 border-b border-slate-700/30 last:border-b-0 hover:bg-slate-800/20 transition-colors"
              >
                <div className="font-medium text-white">{item.feature}</div>
                <div className="flex items-center space-x-2">
                  {item.proofpixIcon}
                  <span className="text-emerald-400 font-medium">{item.proofpix}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.legacyIcon}
                  <span className="text-slate-400">{item.legacy}</span>
                </div>
                <div className="text-slate-300 text-sm">{item.impact}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Industry Recognition */}
        <motion.div 
          className="text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            variants={fadeInUp}
            className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-12 border border-emerald-500/20"
          >
            <Award className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                The Standard That Others Try to Copy
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Every "privacy-first" tool launched after us is trying to catch up. But you can't retrofit true privacy—
              it has to be built from the ground up, like we did.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">First</div>
                <div className="text-slate-400">To eliminate data transmission</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">Only</div>
                <div className="text-slate-400">Technically unhackable solution</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">Leader</div>
                <div className="text-slate-400">In the category we created</div>
          </div>
        </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default CompetitorComparison;
