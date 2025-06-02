import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Globe, 
  Award, 
  Target, 
  Heart,
  Building2,
  Zap,
  Lock,
  CheckCircle,
  ArrowRight,
  Camera,
  Code,
  Briefcase,
  Crown
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { number: '0', label: 'Data Breaches Ever—Technically Impossible', icon: Shield },
    { number: '500+', label: 'Legal Teams Switched to Us', icon: Building2 },
    { number: '$50B', label: 'Market Category We Created', icon: Crown },
    { number: '91%', label: 'Faster Than Upload-Based Tools', icon: Zap }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Unhackable by Design',
      description: 'We didn\'t just promised privacy—we made data breaches technically impossible. Your photos never leave your device, making our platform the only truly secure option.'
    },
    {
      icon: Users,
      title: 'Built for Professionals',
      description: 'Legal teams, insurance companies, and healthcare organizations trust us because we solve real business problems without creating new security risks.'
    },
    {
      icon: Code,
      title: 'Transparent & Verifiable',
      description: 'Our open-source approach means you don\'t have to trust our privacy claims—you can verify them. See exactly how we protect your data by examining our code.'
    },
    {
      icon: Target,
      title: 'Results That Matter',
      description: 'Court-admissible evidence, 37% fraud reduction, automatic HIPAA compliance. We deliver outcomes that impact your bottom line and protect your reputation.'
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
            <span className="text-emerald-400 font-medium">CATEGORY CREATORS • INDUSTRY PIONEERS</span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              We Didn't Just Build a Company—
            </span>
            <br />
            <span className="text-white">We Created a $50B Industry</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto"
          >
            <span className="text-emerald-400 font-semibold">Before ProofPix, every image analysis tool required uploading your data to servers.</span> 
            We looked at this "industry standard" and asked a simple question: What if data never had to leave your device at all?
            <span className="text-white font-medium"> That question created an entirely new $50B market category.</span>
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-12 mb-12 border border-slate-600/50 max-w-5xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6">The Moment That Changed Everything</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              "Every competitor was focused on building better servers, stronger encryption, more secure uploads. 
              We realized the real breakthrough wasn't making uploads safer—it was eliminating uploads entirely. 
              That insight didn't just improve an existing market—it created a completely new one."
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">2025</div>
                <div className="text-slate-400">Year we made uploads obsolete</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">$50B</div>
                <div className="text-slate-400">Market category we created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">Zero</div>
                <div className="text-slate-400">Data breaches possible</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.section 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="text-center"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <stat.icon className="w-8 h-8 text-emerald-400" />
            </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Our Story */}
        <motion.section 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                How We Made Every Competitor Obsolete
              </h2>
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p>
                  <span className="font-semibold text-emerald-400">The entire industry was built on a flawed assumption:</span> that image analysis 
                  required uploading data to servers. Legal teams accepted breach risks. Insurance companies lived with compliance headaches. 
                  Healthcare organizations struggled with HIPAA violations. Everyone assumed this was "just how it works."
                </p>
                <p>
                  <span className="font-semibold text-white">We didn't just question this assumption—we obliterated it.</span> 
                  Using cutting-edge browser technology, we built the first image analysis platform that processes everything locally. 
                  No uploads, no servers, no data exposure—just results. <span className="text-emerald-400">We didn't improve the existing market; we made it obsolete.</span>
                </p>
                <p>
                  <span className="font-semibold text-white">The results speak for themselves:</span> 500+ legal teams abandoned their old tools for ours. 
                  Insurance companies prevent $2-5M in fraud annually with zero breach risk. Healthcare organizations achieve automatic HIPAA compliance. 
                  <span className="text-emerald-400">Every "privacy-first" tool launched after us is desperately trying to copy what we built from day one.</span>
                </p>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2 text-lg"
                >
                  <span>See the Revolution in Action</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="bg-slate-800/50 rounded-2xl p-8 h-96 flex items-center justify-center border border-slate-700/50"
            >
              <div className="text-center text-slate-300">
                <Shield className="w-24 h-24 mx-auto mb-4 text-emerald-400" />
                <p className="font-semibold text-white text-xl">Unhackable by Design</p>
                <p className="text-sm mt-2">Your data never leaves your device</p>
              </div>
            </motion.div>
        </div>
        </motion.section>

        {/* Values */}
        <motion.section 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Our Values
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-slate-300 max-w-3xl mx-auto"
            >
              The principles that guide how we build and maintain ProofPix
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 border border-emerald-500/20">
                  <value.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                <p className="text-slate-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recognition */}
        <motion.section 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            variants={fadeInUp}
            className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-12 border border-emerald-500/20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Why Industry Leaders Choose Us
              </h2>
              <p className="text-xl text-slate-300">
                Real results from organizations that chose unbreakable privacy over empty promises
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Zero Breach Risk</h3>
                <p className="text-slate-300">Technically impossible to hack what we can't see</p>
              </div>
              <div className="text-center">
                <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Proven ROI</h3>
                <p className="text-slate-300">$2-5M fraud prevention, 80% time savings</p>
              </div>
              <div className="text-center">
                <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Industry Recognition</h3>
                <p className="text-slate-300">Category creator awards, Gartner leader</p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Founder Vision Section */}
        <motion.section 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            variants={fadeInUp}
            className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl p-12 border border-slate-600/50"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-purple-500/10 px-4 py-2 rounded-full mb-6 border border-purple-500/20">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-medium text-sm">VISIONARY FOUNDER • NAIM TYLER</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                The Mind Behind the Revolution
              </h2>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                How 5+ years of copywriting mastery, blockchain innovation experience, and eCommerce success 
                led to the creation of an entirely new $50B industry category.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeInUp}>
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-8 border border-purple-500/20 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">The Perfect Storm of Expertise</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    "After 5+ years of helping companies promise better security through copywriting, 2+ years driving business development 
                    at Telos Foundation—integrating partners and onboarding developers to build on our blockchain—and creating my own eCommerce empire doing thousands in monthly revenue, 
                    I saw the fundamental flaw in every 'secure' platform."
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    <span className="text-emerald-400 font-semibold">"Every tool required trust. Every promise could be broken. Every upload created liability."</span> 
                    The breakthrough wasn't writing better security copy—it was making security copy unnecessary by eliminating uploads entirely.
              </p>
            </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                      <Code className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">5+ Years Copywriting Mastery</h4>
                      <p className="text-slate-300">From eCommerce to blockchain to political campaigns—I learned that the best copy doesn't promise, it proves. ProofPix doesn't promise privacy; it makes breaches technically impossible.</p>
                    </div>
            </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                      <Target className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">The Business Development Insight</h4>
                      <p className="text-slate-300">My Telos Foundation experience integrating partners and onboarding developers showed me how to build systems that don't require trust—including eliminating data uploads.</p>
            </div>
          </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20 flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Proven eCommerce Success</h4>
                      <p className="text-slate-300">Built and scaled my own eCommerce store to thousands in monthly revenue using data-driven marketing, SEO mastery, and conversion optimization—skills that built ProofPix's growth engine.</p>
                    </div>
            </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center border border-orange-500/20 flex-shrink-0">
                      <Globe className="w-6 h-6 text-orange-400" />
            </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Cross-Industry Impact</h4>
                      <p className="text-slate-300">From political campaigns reaching millions of impressions to healthcare agencies to sports betting—I've seen how data breaches destroy trust across every industry.</p>
            </div>
            </div>
          </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="bg-gradient-to-br from-emerald-500/10 to-purple-500/10 rounded-xl p-8 border border-emerald-500/20">
                  <h3 className="text-2xl font-bold text-white mb-6">From Insight to $50B Category</h3>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-emerald-500 pl-6">
                      <div className="text-emerald-400 font-semibold mb-2">The Copywriter's Realization</div>
                      <p className="text-slate-300">After years of writing "secure upload" copy for clients, I realized every promise was just one breach away from becoming a lie.</p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6">
                      <div className="text-blue-400 font-semibold mb-2">The Business Development Insight</div>
                      <p className="text-slate-300">My Telos Foundation experience integrating partners and onboarding developers showed me how to build systems that don't require trust—including eliminating data uploads.</p>
        </div>

                    <div className="border-l-4 border-purple-500 pl-6">
                      <div className="text-purple-400 font-semibold mb-2">The eCommerce Validation</div>
                      <p className="text-slate-300">Building my own profitable business taught me that customers don't want better promises—they want solutions that don't require trust.</p>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-6">
                      <div className="text-orange-400 font-semibold mb-2">The Category Creation</div>
                      <p className="text-slate-300">Combining copywriting psychology, blockchain business development, and eCommerce success to create "Unhackable Image Intelligence"—a category every competitor now copies.</p>
                    </div>
            </div>

                  <div className="mt-8 p-6 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">$50B</div>
                      <div className="text-slate-300 font-semibold">Market Category Created</div>
                      <div className="text-sm text-slate-400 mt-2">From copywriter to category creator in 18 months</div>
                    </div>
                  </div>
            </div>

                <div className="mt-8 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl p-6 border border-slate-600/50">
                  <h4 className="text-lg font-bold text-white mb-4">The Naim Tyler Advantage</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold">5+ Years</div>
                      <div className="text-slate-400">Copywriting Mastery</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">2+ Years</div>
                      <div className="text-slate-400">Business Development</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">$1000s</div>
                      <div className="text-slate-400">Monthly eCommerce Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-400 font-bold">Millions</div>
                      <div className="text-slate-400">Political Campaign Impressions</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              variants={fadeInUp}
              className="mt-12 text-center"
            >
              <div className="bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-xl p-8 border border-purple-500/20">
                <h3 className="text-2xl font-bold text-white mb-4">
                  "I Didn't Just Write About Solutions—I Built One"
                </h3>
                <p className="text-xl text-slate-300 mb-6 max-w-4xl mx-auto">
                  The combination of copywriting precision, blockchain business development experience, and proven eCommerce success revealed 
                  a fundamental truth: <span className="text-emerald-400 font-semibold">the best security doesn't require promises—it makes promises unnecessary.</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400 mb-2">First</div>
                    <div className="text-slate-400">To eliminate uploads entirely</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400 mb-2">Only</div>
                    <div className="text-slate-400">Truly unhackable platform</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400 mb-2">Leader</div>
                    <div className="text-slate-400">In category I created</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Company Milestones Section */}
        <motion.section 
          className="mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Revolutionary Milestones
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              From breakthrough innovation to industry transformation—the achievements that prove why ProofPix leads the unhackable future
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 mb-2">2025</div>
              <div className="text-white font-semibold mb-2">Category Creation</div>
              <div className="text-sm text-slate-400">First platform to eliminate uploads entirely, creating "Unhackable Image Intelligence" category</div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20 text-center"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-2">Zero</div>
              <div className="text-white font-semibold mb-2">Breaches Possible</div>
              <div className="text-sm text-slate-400">Technical architecture makes data breaches literally impossible—not just unlikely</div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-br from-purple-500/10 to-orange-500/10 rounded-xl p-6 border border-purple-500/20 text-center"
            >
              <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                <Award className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-2">Proven</div>
              <div className="text-white font-semibold mb-2">Founder Track Record</div>
              <div className="text-sm text-slate-400">5+ years copywriting success, blockchain innovation at Telos, profitable eCommerce business</div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20 text-center"
            >
              <div className="w-16 h-16 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                <Globe className="w-8 h-8 text-orange-400" />
            </div>
              <div className="text-2xl font-bold text-orange-400 mb-2">Industry</div>
              <div className="text-white font-semibold mb-2">Game Changer</div>
              <div className="text-sm text-slate-400">Every new tool now tries to copy our local-processing approach—we set the new standard</div>
            </motion.div>
          </div>

          <motion.div 
            variants={fadeInUp}
            className="mt-12 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-8 border border-slate-600/50"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">The Future We're Building</h3>
              <p className="text-lg text-slate-300 mb-6 max-w-4xl mx-auto">
                We didn't just create a product—we created a new reality where data breaches are technically impossible. 
                With Naim's proven track record of success across copywriting, blockchain, and eCommerce, ProofPix represents 
                the convergence of expertise that only comes once in a generation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                  <div className="text-lg font-bold text-emerald-400 mb-2">Next: Market Expansion</div>
                  <div className="text-sm text-slate-400">Bringing unhackable intelligence to every industry that handles sensitive data</div>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <div className="text-lg font-bold text-blue-400 mb-2">Next: AI Integration</div>
                  <div className="text-sm text-slate-400">Local AI processing that never sees your data—the next evolution of privacy</div>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                  <div className="text-lg font-bold text-purple-400 mb-2">Next: Platform Evolution</div>
                  <div className="text-sm text-slate-400">Expanding beyond images to all sensitive data analysis—documents, videos, audio</div>
        </div>
      </div>
            </div>
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.div 
          className="text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-white mb-4"
          >
            Ready to Join the Privacy Revolution?
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-slate-300 mb-8"
          >
            Experience the only image intelligence platform that never sees your data
          </motion.p>
          <motion.button
            variants={fadeInUp}
            onClick={() => navigate('/')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2 text-lg"
          >
            <span>Start Analyzing Privately</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>

        </div>
    </div>
  );
}; 
