import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Eye, 
  Lock,
  Database,
  FileImage,
  Layers,
  BarChart3,
  Download, 
  Upload,
  Cpu,
  Globe, 
  Users, 
  Building2, 
  Scale,
  Heart,
  Briefcase,
  ArrowRight,
  CheckCircle, 
  Star, 
  Sparkles,
  Camera,
  FileCheck,
  Clock,
  Target,
  Fingerprint,
  CloudOff,
  GitCompareArrows,
  X,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  Search,
  Share2,
  AlertTriangle,
  Award,
  Settings,
  FileText
} from 'lucide-react';
import { ConsistentLayout } from '../components/ui/ConsistentLayout';

export const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

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

  const tabs = [
    { id: 'analysis', label: 'Image Analysis', icon: <Search className="w-5 h-5" /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'enterprise', label: 'Enterprise Tools', icon: <Users className="w-5 h-5" /> },
    { id: 'export', label: 'Export & Sharing', icon: <Share2 className="w-5 h-5" /> }
  ];

  const coreFeatures = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Complete Privacy Protection",
      description: "Your photos never leave your device—we can't see them even if we wanted to. Analysis happens entirely in your browser.",
      details: ["Zero server uploads", "Local processing only", "No data collection", "Impossible to breach", "GDPR compliant"],
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Photo Analysis",
      description: "Get comprehensive results in seconds. Discover location, timestamps, camera settings, and hidden details instantly.",
      details: ["Results in 2-3 seconds", "Real-time processing", "No waiting queues", "Immediate insights", "Lightning fast"],
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Discover Hidden Information",
      description: "Reveal the complete story behind any photo—where it was taken, when, with what camera, and much more.",
      details: ["GPS location mapping", "Exact timestamps", "Camera identification", "Technical settings", "Editing history"],
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Professional Reports",
      description: "Generate court-ready documentation with customizable PDF reports that meet legal and business standards.",
      details: ["4 report templates", "Custom branding", "Legal formatting", "Detailed analysis", "Export options"],
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Universal Compatibility",
      description: "Works with photos from any camera, phone, or device. Supports all major formats including professional RAW files.",
      details: ["15+ file formats", "RAW file support", "Mobile photos", "Professional cameras", "Social media images"],
      gradient: "from-teal-500 to-blue-600"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Works Everywhere",
      description: "Access from any device with a web browser. No downloads, installations, or special software required.",
      details: ["Any web browser", "Mobile responsive", "Cross-platform", "No installation", "Always available"],
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  const advancedFeatures = [
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Analyze Multiple Photos at Once",
      description: "Process hundreds of images simultaneously with intelligent queue management and progress tracking.",
      details: ["Unlimited batch size", "Progress tracking", "Error handling", "Resume capability", "Priority queues"],
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Track Usage and Insights",
      description: "Understand your photo analysis patterns, identify privacy risks, and monitor team usage with detailed analytics.",
      details: ["Usage analytics", "Risk reporting", "Trend analysis", "Custom dashboards", "Export reports"],
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration Tools",
      description: "Manage team access, assign roles, and collaborate on photo analysis projects with enterprise-grade controls.",
      details: ["Role-based access", "User permissions", "Team collaboration", "Activity logs", "SSO integration"],
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Integrate with Your Systems",
      description: "Connect ProofPix to your existing workflow with powerful APIs and seamless enterprise integrations.",
      details: ["REST API", "Webhook support", "Custom integrations", "SDK libraries", "Documentation"],
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const exportFeatures = [
    {
      icon: <Download className="w-8 h-8" />,
      title: "Export in Any Format You Need",
      description: "Get your analysis results in the format that works best for your workflow and requirements.",
      details: ["JSON export", "CSV reports", "PDF documents", "XML format", "Excel spreadsheets"],
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Professional Reports",
      description: "Generate court-ready documentation with detailed analysis and evidence chains.",
      details: ["Legal templates", "Evidence chains", "Digital signatures", "Watermarking", "Audit trails"],
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Secure Sharing",
      description: "Share analysis results securely with encrypted links and access controls.",
      details: ["Encrypted sharing", "Access controls", "Expiration dates", "Password protection", "View tracking"],
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cloud Integration",
      description: "Seamlessly integrate with popular cloud storage and collaboration platforms.",
      details: ["Cloud storage", "Platform integration", "Sync capabilities", "Backup options", "Version control"],
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const getActiveFeatures = () => {
    switch (activeTab) {
      case 'analysis': return coreFeatures;
      case 'privacy': return coreFeatures;
      case 'enterprise': return advancedFeatures;
      case 'export': return exportFeatures;
      default: return coreFeatures;
    }
  };

  const comparisonData = [
    { feature: "Client-side processing", free: true, pro: true, enterprise: true },
    { feature: "Basic EXIF analysis", free: true, pro: true, enterprise: true },
    { feature: "GPS location extraction", free: true, pro: true, enterprise: true },
    { feature: "Privacy risk detection", free: false, pro: true, enterprise: true },
    { feature: "Batch processing", free: false, pro: true, enterprise: true },
    { feature: "Professional reports", free: false, pro: true, enterprise: true },
    { feature: "API access", free: false, pro: false, enterprise: true },
    { feature: "Team management", free: false, pro: false, enterprise: true },
    { feature: "Custom integrations", free: false, pro: false, enterprise: true },
  ];

  return (
    <ConsistentLayout>
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Comprehensive Image Analysis Platform
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
              <br />
              <span className="text-white">Built for Professionals</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-3xl mx-auto"
            >
              Discover the comprehensive suite of tools that make ProofPix the leading choice for image metadata analysis and privacy protection.
            </motion.p>
          </motion.div>

          {/* Feature Tabs */}
          <motion.div 
            className="mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            {/* Feature Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              key={activeTab}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {getActiveFeatures().map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                  className="group relative"
                  onMouseEnter={() => setHoveredFeature(`${activeTab}-${index}`)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="h-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:-translate-y-2">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
              </div>
              
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-slate-300 mb-6 leading-relaxed">{feature.description}</p>
                    
                    {/* Feature Details */}
                    <div className={`transition-all duration-300 ${
                      hoveredFeature === `${activeTab}-${index}` ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="border-t border-slate-600/50 pt-4">
                        <ul className="space-y-2">
                          {feature.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                              {detail}
                  </li>
                ))}
              </ul>
            </div>
        </div>

                    <div className="flex items-center justify-between mt-6">
                      <span className="text-sm font-semibold text-emerald-400">
                        {hoveredFeature === `${activeTab}-${index}` ? 'View Details' : 'Hover for Details'}
              </span>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
        </div>
              </div>
              </motion.div>
            ))}
          </motion.div>
          </motion.div>

          {/* Comparison Table */}
          <motion.div 
            className="mb-16"
            initial="hidden"
            animate="visible"
                variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 text-white">
                Choose Your Plan
              </h2>
              <p className="text-xl text-slate-300">
                Compare features across all ProofPix plans
              </p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left p-6 text-slate-300 font-semibold">Feature</th>
                      <th className="text-center p-6 text-slate-300 font-semibold">Free</th>
                      <th className="text-center p-6 text-blue-400 font-semibold">Pro</th>
                      <th className="text-center p-6 text-emerald-400 font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                        <td className="p-6 text-white font-medium">{row.feature}</td>
                        <td className="p-6 text-center">
                          {row.free ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-slate-500 mx-auto" />
                          )}
                        </td>
                        <td className="p-6 text-center">
                          {row.pro ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-slate-500 mx-auto" />
                          )}
                        </td>
                        <td className="p-6 text-center">
                          {row.enterprise ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-slate-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Device Compatibility */}
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Works Everywhere
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              ProofPix runs seamlessly across all your devices with consistent performance and features.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Monitor className="w-12 h-12" />, title: "Desktop", description: "Full-featured experience on Windows, macOS, and Linux" },
                { icon: <Tablet className="w-12 h-12" />, title: "Tablet", description: "Optimized interface for iPad and Android tablets" },
                { icon: <Smartphone className="w-12 h-12" />, title: "Mobile", description: "Complete functionality on iOS and Android phones" }
              ].map((device, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
                  <div className="text-blue-400 mb-4 flex justify-center">
                    {device.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{device.title}</h3>
                  <p className="text-slate-300">{device.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
    </div>
    </ConsistentLayout>
  );
};

export default Features; 