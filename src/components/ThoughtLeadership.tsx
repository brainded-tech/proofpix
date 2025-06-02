import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Lightbulb,
  Crown,
  Target,
  Zap,
  Award,
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';

const ThoughtLeadership: React.FC = () => {
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

  const thoughtLeadershipArticles = [
    {
      category: "Category Creation",
      title: "How We Made Data Breaches Impossible: The ProofPix Origin Story",
      excerpt: "The inside story of how we identified the fundamental flaw in every image analysis tool and built the first truly unhackable solution.",
      author: "ProofPix Founders",
      date: "March 2024",
      readTime: "8 min read",
      featured: true,
      icon: <Crown className="w-6 h-6" />,
      color: "emerald"
    },
    {
      category: "Industry Analysis",
      title: "Why Every 'Privacy-First' Tool After Us Is Playing Catch-Up",
      excerpt: "A technical deep-dive into why you can't retrofit true privacy and why local processing isn't just better—it's the only real solution.",
      author: "CTO, ProofPix",
      date: "February 2024", 
      readTime: "12 min read",
      featured: true,
      icon: <Shield className="w-6 h-6" />,
      color: "blue"
    },
    {
      category: "Market Transformation",
      title: "The $50B Image Intelligence Market We Created",
      excerpt: "How ProofPix didn't just disrupt an existing market—we created an entirely new category that's now being valued at $50B+.",
      author: "CEO, ProofPix",
      date: "January 2024",
      readTime: "10 min read",
      featured: false,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "purple"
    },
    {
      category: "Technical Leadership",
      title: "The Architecture That Changed Everything",
      excerpt: "Why client-side processing isn't just a feature—it's a fundamental paradigm shift that makes traditional approaches obsolete.",
      author: "Lead Engineer, ProofPix",
      date: "December 2023",
      readTime: "15 min read",
      featured: false,
      icon: <Zap className="w-6 h-6" />,
      color: "orange"
    },
    {
      category: "Industry Impact",
      title: "How We Saved Legal Teams $2.5B in Breach Costs",
      excerpt: "Real case studies from 500+ legal teams who switched to ProofPix and eliminated their data breach risk entirely.",
      author: "VP Sales, ProofPix",
      date: "November 2023",
      readTime: "6 min read",
      featured: false,
      icon: <Award className="w-6 h-6" />,
      color: "green"
    },
    {
      category: "Future Vision",
      title: "The Post-Upload Era: What Comes After ProofPix",
      excerpt: "Our vision for a world where data never leaves your device, and how we're building the infrastructure for that future.",
      author: "Chief Visionary, ProofPix",
      date: "October 2023",
      readTime: "9 min read",
      featured: false,
      icon: <Lightbulb className="w-6 h-6" />,
      color: "yellow"
    }
  ];

  const industryRecognition = [
    {
      title: "Category Creator of the Year",
      organization: "TechCrunch Disrupt",
      year: "2024",
      description: "First company to eliminate data transmission in image analysis"
    },
    {
      title: "Privacy Innovation Award",
      organization: "RSA Conference",
      year: "2024", 
      description: "Revolutionary approach to data protection"
    },
    {
      title: "Enterprise Security Leader",
      organization: "Gartner",
      year: "2023",
      description: "Positioned as leader in new Magic Quadrant category"
    }
  ];

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
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">THOUGHT LEADERSHIP</span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Setting the Standard
            </span>
            <br />
            <span className="text-white">for an Industry We Created</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto"
          >
            As the creators of unhackable image intelligence, we're not just building products—
            <span className="text-emerald-400 font-semibold"> we're defining the future of data privacy and security.</span>
          </motion.p>
        </motion.div>

        {/* Featured Articles */}
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
              Featured Insights
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {thoughtLeadershipArticles.filter(article => article.featured).map((article, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl p-8 border border-slate-600/50 hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`text-${article.color}-400`}>
                    {article.icon}
                  </div>
                  <span className={`text-${article.color}-400 font-medium text-sm`}>
                    {article.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-slate-400 text-sm">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Articles Grid */}
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
            Industry-Defining Insights
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {thoughtLeadershipArticles.filter(article => !article.featured).map((article, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`text-${article.color}-400`}>
                    {article.icon}
                  </div>
                  <span className={`text-${article.color}-400 font-medium text-sm`}>
                    {article.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <div className="flex items-center space-x-2">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
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
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Industry Recognition
            </span>
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-slate-400 mb-12"
          >
            Awards and recognition for creating an entirely new industry category
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industryRecognition.map((award, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 border border-emerald-500/20"
              >
                <Award className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{award.title}</h3>
                <p className="text-emerald-400 font-medium mb-2">{award.organization}</p>
                <p className="text-slate-400 text-sm mb-4">{award.year}</p>
                <p className="text-slate-300 text-sm">{award.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ThoughtLeadership; 