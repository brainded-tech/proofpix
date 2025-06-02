import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Star,
  Users,
  Building2,
  Award,
  Sparkles,
  Eye,
  FileCheck,
  Globe,
  TrendingUp,
  Camera,
  MapPin,
  Clock,
  Download,
  BarChart3,
  Verified,
  Timer,
  Target
} from 'lucide-react';
import { UnifiedHeader } from '../components/ui/UnifiedHeader';
import { UnifiedFooter } from '../components/ui/UnifiedFooter';

export const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showDemoPreview, setShowDemoPreview] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    photos: 0,
    accuracy: 0,
    speed: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate statistics
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedStats({
          users: Math.floor(easeOut * 50000),
          photos: Math.floor(easeOut * 2500000),
          accuracy: Math.floor(easeOut * 99.9 * 10) / 10,
          speed: Math.floor(easeOut * 1.8 * 10) / 10
        });
        
        if (step >= steps) clearInterval(timer);
      }, interval);
    };
    
    // Start animation after component mounts
    setTimeout(animateStats, 500);
    
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(testimonialInterval);
  }, []);

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

  const trustIndicators = [
    { 
      icon: <Shield className="w-6 h-6" />, 
      text: "Zero Data Breaches", 
      value: "100%", 
      color: "emerald",
      description: "Your data never leaves your device"
    },
    { 
      icon: <Timer className="w-6 h-6" />, 
      text: "Processing Speed", 
      value: `${animatedStats.speed}s`, 
      color: "blue",
      description: "Average analysis time"
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      text: "Active Users", 
      value: `${(animatedStats.users / 1000).toFixed(0)}K+`, 
      color: "purple",
      description: "Professionals trust ProofPix"
    },
    { 
      icon: <Target className="w-6 h-6" />, 
      text: "Accuracy Rate", 
      value: `${animatedStats.accuracy}%`, 
      color: "orange",
      description: "Court-accepted evidence"
    }
  ];

  const testimonials = [
    {
      quote: "ProofPix saved us hours of manual metadata analysis. The privacy-first approach gives us complete confidence.",
      author: "Sarah Chen",
      role: "Legal Professional, Evidence Analysis Team",
      company: "Morrison & Associates",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      quote: "Finally, a tool that doesn't compromise on security. Our clients' data stays completely private.",
      author: "Michael Rodriguez", 
      role: "Insurance Investigator, Claims Department",
      company: "SecureGuard Insurance",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      quote: "The batch processing feature transformed our workflow. We can analyze hundreds of images in minutes.",
      author: "Dr. Emily Watson",
      role: "Digital Forensics Specialist",
      company: "TechForensics Lab",
      rating: 5,
      avatar: "👩‍🔬"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Unhackable by Design",
      description: "Your photos never touch our servers—making data breaches technically impossible, not just unlikely.",
      gradient: "from-emerald-500 to-teal-600",
      stats: "0% Breach Risk",
      demo: "🔒 Client-side processing"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Analysis",
      description: "Extract GPS locations, camera settings, and timestamps in under 2 seconds with our optimized engine.",
      gradient: "from-blue-500 to-cyan-600",
      stats: "<2s Processing",
      demo: "⚡ Real-time extraction"
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Court-Ready Reports",
      description: "Generate professional documentation that legal teams trust and judges accept as evidence.",
      gradient: "from-purple-500 to-indigo-600",
      stats: "Legal Grade",
      demo: "📋 Professional PDFs"
    }
  ];

  const DemoPreview = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setShowDemoPreview(false)}
    >
      <div 
        className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Interactive Demo Preview</h3>
          <button 
            onClick={() => setShowDemoPreview(false)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Camera className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Camera Details</span>
              </div>
              <div className="text-sm text-slate-300 space-y-1">
                <div>📷 iPhone 14 Pro</div>
                <div>🔍 f/1.78, 1/120s, ISO 64</div>
                <div>📐 4032 × 3024 pixels</div>
              </div>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">Location Data</span>
              </div>
              <div className="text-sm text-slate-300 space-y-1">
                <div>📍 37.7749° N, 122.4194° W</div>
                <div>🏙️ San Francisco, CA</div>
                <div>🎯 ±5m accuracy</div>
              </div>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Timestamp</span>
              </div>
              <div className="text-sm text-slate-300 space-y-1">
                <div>📅 March 15, 2024</div>
                <div>🕐 2:34:17 PM PST</div>
                <div>🌍 UTC-8 timezone</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30">
              <h4 className="text-white font-medium mb-2">🔍 Analysis Complete</h4>
              <div className="text-sm text-slate-300">
                ✅ Metadata extracted in 1.2s<br/>
                ✅ Privacy scan completed<br/>
                ✅ Report generated<br/>
                ✅ Ready for download
              </div>
            </div>
            
          <Link
              to="/auth/register"
              onClick={() => setShowDemoPreview(false)}
              className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-lg font-semibold text-center transition-all duration-200"
          >
              Try It Free Now
          </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping delay-3000"></div>
      </div>

      {/* Unified Header */}
      <UnifiedHeader />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Hero Section */}
        <motion.div 
          className="pt-20 pb-16 text-center"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <Verified className="w-4 h-4 mr-2 text-emerald-400" />
              Trusted by {(animatedStats.users / 1000).toFixed(0)}K+ professionals worldwide
              <Sparkles className="w-4 h-4 ml-2 text-blue-400" />
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Don't Just Send a Photo
            </span>
            <br />
            <span className="text-white">Send Proof</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed px-4"
          >
            Extract hidden GPS locations, camera settings, and forensic details from any image—
            <span className="text-emerald-400 font-semibold"> completely private</span> and 
            <span className="text-blue-400 font-semibold"> impossible to breach</span>.
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              to="/auth/register"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <span className="relative">Start Analyzing Photos</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
            </Link>
            
            <button 
              onClick={() => setShowDemoPreview(true)}
              className="group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 px-8 py-4 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Watch Interactive Demo</span>
            </button>
          </motion.div>

          {/* Enhanced Trust Indicators */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div 
                key={index} 
                className="group text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-${indicator.color}-500 to-${indicator.color}-600 rounded-xl mb-3 group-hover:shadow-lg transition-shadow`}>
                  {indicator.icon}
                </div>
                <div className={`text-2xl font-bold text-${indicator.color}-400 mb-1`}>
                  {indicator.value}
                </div>
                <div className="text-sm font-medium text-white mb-1">
                  {indicator.text}
                </div>
                <div className="text-xs text-slate-400">
                  {indicator.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Features Section */}
        <motion.div 
          className="py-20"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Why Professionals Choose ProofPix
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built for legal teams, investigators, and enterprises who need bulletproof evidence analysis
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 group-hover:shadow-lg transition-shadow`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className={`text-sm font-semibold px-3 py-1 bg-gradient-to-r ${feature.gradient} bg-opacity-20 rounded-full text-white`}>
                    {feature.stats}
                  </div>
                  <div className="text-sm text-slate-400">
                    {feature.demo}
                  </div>
        </div>
        
                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Testimonials Section */}
        <motion.div 
          className="py-20"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Trusted by Industry Leaders
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See how professionals are using ProofPix to transform their evidence analysis workflow
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <h4 className="text-lg font-semibold text-white">
                      {testimonials[currentTestimonial].author}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {testimonials[currentTestimonial].company}
          </p>
        </div>
                </div>
                
                <blockquote className="text-xl text-slate-200 leading-relaxed italic">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div 
          className="py-20 text-center"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Ready to Transform Your Evidence Analysis?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust ProofPix for court-ready metadata analysis
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/auth/register"
                className="group bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/enterprise"
                className="group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 px-8 py-4 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm flex items-center justify-center space-x-2"
              >
                <Building2 className="w-5 h-5" />
                <span>Enterprise Solutions</span>
              </Link>
            </div>
            
            <div className="text-sm text-slate-400">
              ✅ No credit card required • ✅ 14-day free trial • ✅ Cancel anytime
        </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Unified Footer */}
      <UnifiedFooter />

      {showDemoPreview && <DemoPreview />}
  </div>
); 
}; 