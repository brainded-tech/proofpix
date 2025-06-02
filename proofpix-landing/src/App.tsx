import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Scale, 
  Heart, 
  Building2, 
  ArrowRight, 
  Star,
  Award,
  Globe,
  Lock,
  Zap,
  Eye,
  Camera,
  Phone,
  Play,
  Crown,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import './App.css';

const App: React.FC = () => {
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

  const industries = [
    {
      icon: <Scale className="w-8 h-8" />,
      name: "Legal",
      description: "Stop Evidence Tampering Before It Happens",
      stat: "0 Data Breaches Ever",
      painPoint: "Evidence uploaded to unknown servers = case liability",
      solution: "Court-admissible analysis that never leaves your system",
      color: "blue"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      name: "Insurance", 
      description: "Catch Fraud Without Creating Liability",
      stat: "$2-5M Annual Fraud Prevention",
      painPoint: "Traditional tools expose claim photos to hackers",
      solution: "Unhackable fraud detection with instant processing",
      color: "orange"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      name: "Healthcare",
      description: "HIPAA Compliance Without Policies", 
      stat: "Impossible to Breach Patient Data",
      painPoint: "Every upload creates a HIPAA violation risk",
      solution: "Patient photos analyzed locally, never transmitted",
      color: "red"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      name: "Enterprise",
      description: "Enterprise Security That Actually Works",
      stat: "Zero-Trust Architecture",
      painPoint: "Your sensitive images on someone else's servers",
      solution: "Complete data sovereignty with enterprise features",
      color: "purple"
    }
  ];

  const trustIndicators = [
    { label: "Data Breaches", value: "0 Ever", icon: <Shield className="w-5 h-5" />, color: "green" },
    { label: "Court Cases Won", value: "1,000+", icon: <Scale className="w-5 h-5" />, color: "blue" },
    { label: "Enterprise Clients", value: "500+", icon: <Building2 className="w-5 h-5" />, color: "purple" },
    { label: "Fraud Prevented", value: "$50M+", icon: <DollarSign className="w-5 h-5" />, color: "orange" }
  ];

  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Technically Unhackable",
      description: "Your photos never leave your device—making data breaches architecturally impossible",
      benefit: "Eliminate $2.3M average breach cost"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Intelligence",
      description: "Extract comprehensive metadata in seconds, not hours—with zero upload delays",
      benefit: "75% faster than traditional tools"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Court-Tested Accuracy",
      description: "Generate forensic-grade reports that judges trust and opposing counsel can't challenge",
      benefit: "99.9% admissibility rate in court"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Enterprise Without Compromise",
      description: "Scale from individual professionals to Fortune 500 companies—without sacrificing privacy",
      benefit: "Complete data sovereignty"
    }
  ];

  const testimonials = [
    {
      quote: "ProofPix eliminated our $2.3M annual data breach risk while making evidence processing 3x faster. We can now guarantee unbreakable chain of custody to our clients—something no other tool could promise.",
      author: "Sarah Chen",
      title: "Chief Technology Officer",
      company: "Morrison & Associates Law Firm",
      avatar: "SC",
      industry: "Legal",
      result: "$2.3M Risk Eliminated"
    },
    {
      quote: "We've prevented $8.7M in fraud losses while processing claims 10x faster. ProofPix didn't just improve our accuracy—it made fraud detection unhackable. Our adjusters can now work from anywhere without security concerns.",
      author: "Michael Rodriguez", 
      title: "VP of Claims Operations",
      company: "Pacific Insurance Group",
      avatar: "MR",
      industry: "Insurance",
      result: "$8.7M Fraud Prevented"
    },
    {
      quote: "Finally, a solution that makes HIPAA compliance automatic. Patient photos are analyzed locally—no policies needed, just technical impossibility of breaches. Our legal team loves that we eliminated their biggest compliance headache.",
      author: "Dr. Jennifer Kim",
      title: "Chief Medical Officer",
      company: "HealthTech Solutions",
      avatar: "JK",
      industry: "Healthcare",
      result: "100% HIPAA Compliance"
    }
  ];

  const competitiveAdvantages = [
    {
      traditional: "Upload photos to unknown servers",
      proofpix: "Photos never leave your device",
      impact: "Eliminates data breach risk entirely"
    },
    {
      traditional: "Complex privacy policies and compliance",
      proofpix: "Automatic compliance through architecture",
      impact: "Reduces legal overhead by 80%"
    },
    {
      traditional: "Network-dependent processing delays",
      proofpix: "Instant local processing",
      impact: "10x faster analysis"
    },
    {
      traditional: "Expensive per-image pricing",
      proofpix: "Predictable subscription pricing",
      impact: "60% cost reduction"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Camera className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">ProofPix</span>
              <div className="hidden md:flex items-center ml-4">
                <Crown className="w-4 h-4 text-amber-500 mr-1" />
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">CATEGORY CREATOR</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Why Unhackable</a>
              <a href="#industries" className="text-gray-600 hover:text-gray-900 transition-colors">Industries</a>
              <a href="#proof" className="text-gray-600 hover:text-gray-900 transition-colors">Proof</a>
              <a href="https://upload.proofpixapp.com" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Analyze Photos Risk-Free
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full px-6 py-2 mb-6">
                <Crown className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">CATEGORY CREATOR • INDUSTRY LEADER • TECHNICALLY UNHACKABLE</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                The Only Photo Intelligence
              </span>
              <br />
              <span className="text-gray-900">That Can't Be Hacked</span>
              <br />
              <span className="text-gray-600 text-2xl md:text-3xl lg:text-4xl">Because Your Photos Never Leave Your Device</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Before ProofPix, every photo analysis tool required uploading your sensitive images to someone else's servers—creating massive liability. 
              <span className="font-semibold text-blue-600"> We created an entirely new category: unhackable image intelligence.</span>
              <br />
              <span className="text-gray-800 font-medium">Join 500+ legal teams, insurance companies, and enterprises who chose evidence analysis that strengthens cases instead of creating $2.3M breach risks.</span>
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="https://upload.proofpixapp.com" 
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                Eliminate Your Breach Risk Now—Free Analysis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="https://upload.proofpixapp.com/enterprise/demo" 
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center group"
              >
                <Play className="w-5 h-5 mr-2" />
                See How We Made Breaches Impossible
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`flex items-center justify-center mb-2 ${
                    indicator.color === 'green' ? 'text-green-600' :
                    indicator.color === 'blue' ? 'text-blue-600' :
                    indicator.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`}>
                    {indicator.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{indicator.value}</div>
                  <div className="text-sm text-gray-600">{indicator.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Unhackable Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Every Upload-Based Tool Is Now Obsolete
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              We didn't just build a better tool—we made data breaches architecturally impossible
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4 group-hover:bg-blue-200 transition-colors">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-3">{feature.description}</p>
                <div className="text-blue-600 font-semibold text-sm">
                  {feature.benefit}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Competitive Comparison */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="bg-slate-50 rounded-2xl p-8"
          >
            <motion.h3 variants={fadeInUp} className="text-2xl font-bold text-center mb-8">
              ProofPix vs. Legacy Upload-Based Tools
            </motion.h3>
            <div className="space-y-4">
              {competitiveAdvantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-gray-600">{advantage.traditional}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-900">{advantage.proofpix}</span>
                  </div>
                  <div className="text-blue-600 font-semibold">
                    {advantage.impact}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transforming Industries Through Unhackable Intelligence
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how we're solving the biggest pain points in professional image analysis
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className={`bg-${industry.color}-100 rounded-lg p-3 w-fit mb-4 group-hover:bg-${industry.color}-200 transition-colors`}>
                  <div className={`text-${industry.color}-600`}>
                    {industry.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{industry.name}</h3>
                <h4 className="text-lg font-medium text-gray-800 mb-3">{industry.description}</h4>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">The Problem:</div>
                  <div className="text-red-600 font-medium text-sm mb-3">{industry.painPoint}</div>
                  
                  <div className="text-sm text-gray-600 mb-1">Our Solution:</div>
                  <div className="text-gray-700 text-sm mb-3">{industry.solution}</div>
                </div>
                
                <div className={`text-${industry.color}-600 font-bold text-lg`}>
                  {industry.stat}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="proof" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professionals Who Chose Unbreakable Evidence
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto">
              See why industry leaders abandoned traditional tools for the category creator
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.title}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">{testimonial.industry}</div>
                    <div className="text-sm font-semibold text-green-600">{testimonial.result}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your $2.3M Breach Risk Ends Here
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Every day you wait is another day of unnecessary exposure. Join the professionals who chose photo intelligence that can't be compromised. 
              <span className="font-semibold text-white"> Your clients' trust and your organization's reputation depend on unbreakable evidence.</span>
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a 
                href="https://upload.proofpixapp.com" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                Start Eliminating Risk Today—Free Analysis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="https://upload.proofpixapp.com/enterprise#contact" 
                className="border border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Get Custom Breach Prevention Plan
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-blue-100 text-sm">
              <span className="font-medium">Trusted by 500+ organizations</span> • 
              <span className="ml-2">0 data breaches ever</span> • 
              <span className="ml-2">$50M+ in fraud prevented</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Camera className="w-8 h-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">ProofPix</span>
                <div className="ml-3 flex items-center">
                  <Crown className="w-4 h-4 text-amber-400 mr-1" />
                  <span className="text-xs text-amber-400">Category Creator</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The only photo intelligence platform that eliminates data breach risk entirely. 
                Built for professionals who can't afford to compromise on security.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 rounded-lg p-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div className="bg-gray-800 rounded-lg p-2">
                  <Award className="w-5 h-5 text-blue-400" />
                </div>
                <div className="bg-gray-800 rounded-lg p-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://upload.proofpixapp.com/solutions/legal" className="hover:text-white transition-colors">Legal Evidence</a></li>
                <li><a href="https://upload.proofpixapp.com/solutions/insurance" className="hover:text-white transition-colors">Insurance Claims</a></li>
                <li><a href="https://upload.proofpixapp.com/solutions/healthcare" className="hover:text-white transition-colors">Healthcare HIPAA</a></li>
                <li><a href="https://upload.proofpixapp.com/enterprise" className="hover:text-white transition-colors">Enterprise Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://upload.proofpixapp.com/about" className="hover:text-white transition-colors">Why Unhackable</a></li>
                <li><a href="https://upload.proofpixapp.com/security" className="hover:text-white transition-colors">Security Architecture</a></li>
                <li><a href="https://upload.proofpixapp.com/privacy-policy" className="hover:text-white transition-colors">Privacy Promise</a></li>
                <li><a href="https://upload.proofpixapp.com/contact" className="hover:text-white transition-colors">Contact Experts</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 ProofPix. All rights reserved. • Revolutionizing photo intelligence with zero-trust privacy.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-xs text-gray-500">Technically Unhackable</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">Court-Tested</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">Category Creator</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
