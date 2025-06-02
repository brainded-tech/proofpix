import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, GitBranch, Zap, Shield, Target, TrendingUp, Users, Clock,
  ArrowRight, Play, Settings, Database, Cloud, Activity, BarChart3,
  CheckCircle, Star, Award, Layers, Cpu, Network, Lock, Globe
} from 'lucide-react';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route: string;
  badge?: string;
  stats: {
    label: string;
    value: string;
  }[];
  benefits: string[];
  pricing: {
    tier: string;
    price: string;
    note?: string;
  };
}

export const EnterpriseFeatureShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const enterpriseFeatures: FeatureCard[] = [
    {
      id: 'ai-training',
      title: 'Custom AI Training Dashboard',
      description: 'Train custom AI models on your specific document types with enterprise-grade tools and monitoring.',
      icon: Brain,
      color: 'purple',
      route: '/enterprise/ai-training',
      badge: 'NEW',
      stats: [
        { label: 'Training Time', value: '67% Faster' },
        { label: 'Model Accuracy', value: '94.2%' },
        { label: 'Cost Savings', value: '$50K+/year' }
      ],
      benefits: [
        'Drag-and-drop training data upload',
        'Real-time training progress monitoring',
        'A/B testing for model versions',
        'Automated cost optimization',
        'Enterprise-grade security'
      ],
      pricing: {
        tier: 'Enterprise',
        price: '$5,000+',
        note: 'Custom pricing based on data volume'
      }
    },
    {
      id: 'workflow-builder',
      title: 'Visual Workflow Builder',
      description: 'Create complex document processing workflows with intuitive drag-and-drop interface.',
      icon: GitBranch,
      color: 'blue',
      route: '/enterprise/workflow-builder',
      badge: 'HOT',
      stats: [
        { label: 'Setup Time', value: '90% Faster' },
        { label: 'Error Reduction', value: '85%' },
        { label: 'Productivity', value: '3x Increase' }
      ],
      benefits: [
        'No-code workflow creation',
        'Real-time debugging and testing',
        'Pre-built action blocks library',
        'Advanced conditional logic',
        'Team collaboration features'
      ],
      pricing: {
        tier: 'Professional+',
        price: '$2,500/month',
        note: 'Includes unlimited workflows'
      }
    },
    {
      id: 'hybrid-architecture',
      title: 'Hybrid Architecture Control',
      description: 'Switch between privacy-only, collaboration, and hybrid modes in real-time based on your needs.',
      icon: Network,
      color: 'green',
      route: '/mode-comparison',
      badge: 'REVOLUTIONARY',
      stats: [
        { label: 'Compliance', value: '100%' },
        { label: 'Flexibility', value: 'Real-time' },
        { label: 'Security', value: 'Unbreakable' }
      ],
      benefits: [
        'Real-time mode switching',
        'Zero-trust privacy mode',
        'Seamless collaboration',
        'Regulatory compliance',
        'Cost optimization'
      ],
      pricing: {
        tier: 'Enterprise',
        price: 'Custom',
        note: 'Pay only for what you use'
      }
    },
    {
      id: 'ai-intelligence',
      title: 'AI Document Intelligence',
      description: 'Advanced AI-powered document analysis with custom models and intelligent insights.',
      icon: Cpu,
      color: 'orange',
      route: '/dashboard',
      stats: [
        { label: 'Accuracy', value: '99.2%' },
        { label: 'Processing Speed', value: '10x Faster' },
        { label: 'Cost Reduction', value: '75%' }
      ],
      benefits: [
        'Multi-modal AI analysis',
        'Custom model training',
        'Real-time processing',
        'Intelligent classification',
        'Automated insights'
      ],
      pricing: {
        tier: 'Professional',
        price: '$500/month',
        note: 'Per 10,000 documents'
      }
    }
  ];

  const FeatureCard: React.FC<{ feature: FeatureCard; index: number }> = ({ feature, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-${feature.color}-500 transition-all duration-300 cursor-pointer group`}
      onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
    >
      {/* Badge */}
      {feature.badge && (
        <div className={`absolute -top-2 -right-2 bg-${feature.color}-500 text-white text-xs font-bold px-2 py-1 rounded-full`}>
          {feature.badge}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 bg-${feature.color}-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-100 mb-2">{feature.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {feature.stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className={`text-lg font-bold text-${feature.color}-400`}>{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-700/50 rounded-lg">
        <div>
          <div className="text-sm text-slate-400">{feature.pricing.tier}</div>
          <div className="text-lg font-bold text-slate-100">{feature.pricing.price}</div>
          {feature.pricing.note && (
            <div className="text-xs text-slate-500">{feature.pricing.note}</div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(feature.route);
          }}
          className={`bg-${feature.color}-600 hover:bg-${feature.color}-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
        >
          <Play className="w-4 h-4" />
          Try Now
        </button>
      </div>

      {/* Expandable Benefits */}
      {selectedFeature === feature.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-slate-700 pt-4"
        >
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Key Benefits:</h4>
          <div className="space-y-2">
            {feature.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                {benefit}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const TrustIndicators = () => (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
      <h3 className="text-xl font-semibold text-slate-100 mb-6 text-center">
        Trusted by Enterprise Leaders
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Shield, label: 'SOC 2 Certified', value: '100%' },
          { icon: Users, label: 'Enterprise Customers', value: '500+' },
          { icon: Globe, label: 'Countries Served', value: '50+' },
          { icon: Award, label: 'Uptime SLA', value: '99.9%' }
        ].map((indicator, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <indicator.icon className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-slate-100">{indicator.value}</div>
            <div className="text-sm text-slate-400">{indicator.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const ROICalculator = () => (
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30 p-6 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-slate-100 mb-2">
          Calculate Your ROI
        </h3>
        <p className="text-slate-400">
          See how much you can save with ProofPix Enterprise features
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">$2.3M</div>
          <div className="text-sm text-slate-400">Average Annual Savings</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">6 months</div>
          <div className="text-sm text-slate-400">Typical ROI Payback</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">85%</div>
          <div className="text-sm text-slate-400">Process Efficiency Gain</div>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={() => navigate('/enterprise/roi-calculator')}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
        >
          <BarChart3 className="w-5 h-5" />
          Calculate Your ROI
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              Enterprise AI Platform
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Revolutionary document intelligence platform with custom AI training, 
            visual workflow automation, and hybrid architecture control.
          </motion.p>
        </div>

        {/* Trust Indicators */}
        <TrustIndicators />

        {/* ROI Calculator */}
        <ROICalculator />

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {enterpriseFeatures.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl border border-slate-600 p-8"
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            Ready to Transform Your Document Processing?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join 500+ enterprise customers who have revolutionized their document workflows 
            with ProofPix's AI-powered platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/enterprise/demo')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 text-lg"
            >
              <Play className="w-5 h-5" />
              Schedule Enterprise Demo
            </button>
            
            <button
              onClick={() => navigate('/contact')}
              className="border border-slate-500 hover:border-slate-400 text-slate-100 px-8 py-4 rounded-lg font-semibold flex items-center gap-2 text-lg"
            >
              <Users className="w-5 h-5" />
              Talk to Sales
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 