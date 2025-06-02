import React, { useState, useEffect } from 'react';
import { Check, X, Shield, Lock, Eye, Database, Users, Cloud, Briefcase, MessageCircle, Star, ArrowRight, Zap, Globe, Building, Heart, Lightbulb, Target, TrendingUp, Award, Clock, DollarSign, CreditCard, Calendar, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

interface UnifiedPricingPageV2Props {}

const UnifiedPricingPageV2: React.FC<UnifiedPricingPageV2Props> = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', message: string}>>([]);

  const messagingFocus = [
    "Zero Data Transmission",
    "Real-time Mode Switching", 
    "Enterprise Security",
    "Unlimited Processing"
  ];

  const handleGetStarted = async (tierId: string) => {
    console.log('Getting started with tier:', tierId);
  };

  const handleSessionPassPurchase = async (passId: string) => {
    console.log('Purchasing session pass:', passId);
  };

  const handleAIAddonPurchase = async (addonId: string) => {
    console.log('Purchasing AI addon:', addonId);
  };

  const getAnnualSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
  };

  const handleIndustryContact = (industry: any) => {
    console.log('Contacting for industry:', industry);
    setShowContactModal(false);
  };

  const handleChatMessage = (message: string) => {
    setChatMessages(prev => [...prev, { role: 'user', message }]);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        message: "Thanks for your question! Our team will get back to you with detailed information about ProofPix's capabilities for your specific needs."
      }]);
    }, 1000);
  };

  const industries = [
    { id: 'healthcare', name: 'Healthcare & Medical' },
    { id: 'legal', name: 'Legal & Law Firms' },
    { id: 'finance', name: 'Financial Services' },
    { id: 'government', name: 'Government & Public Sector' },
    { id: 'education', name: 'Education & Research' },
    { id: 'enterprise', name: 'Enterprise & Corporate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Privacy-First Hybrid Pricing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Every plan includes <span className="font-bold text-yellow-300">BOTH</span> Privacy Mode 
              and Collaboration Mode. Choose your architecture in real-time.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {messagingFocus.map((message, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Check className="w-4 h-4 text-green-300" />
                  <span>{message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Architecture Mode Comparison */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Architecture</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The only platform that lets you switch between Privacy Mode and Collaboration Mode in real-time
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Privacy Mode */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Privacy Mode</h3>
                  <p className="text-blue-600 font-medium">100% Local Processing</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Zero Data Transmission</h4>
                    <p className="text-gray-600 text-sm">Your data never leaves your device</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Maximum Security</h4>
                    <p className="text-gray-600 text-sm">Perfect for sensitive documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Local AI Processing</h4>
                    <p className="text-gray-600 text-sm">AI runs entirely in your browser</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">Perfect For:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Healthcare records & HIPAA compliance</li>
                  <li>• Legal documents & attorney-client privilege</li>
                  <li>• Financial data & regulatory compliance</li>
                  <li>• Government & classified information</li>
                </ul>
              </div>
            </div>

            {/* Collaboration Mode */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Collaboration Mode</h3>
                  <p className="text-green-600 font-medium">Cloud-Enhanced Processing</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Cloud className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time Collaboration</h4>
                    <p className="text-gray-600 text-sm">Share and work together instantly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Enhanced Performance</h4>
                    <p className="text-gray-600 text-sm">Faster processing with cloud AI</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Universal Access</h4>
                    <p className="text-gray-600 text-sm">Access from anywhere, any device</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">Perfect For:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Team projects & collaborative editing</li>
                  <li>• Marketing materials & content creation</li>
                  <li>• Educational resources & training</li>
                  <li>• Public documents & general business</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isAnnual 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                isAnnual 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Professional Plans */}
        <div className="bg-slate-800/50 rounded-3xl p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Professional Plans</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Full-featured plans with both Privacy and Collaboration modes included
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-6">Perfect for individuals and small teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${isAnnual ? '29' : '39'}
                  </span>
                  <span className="text-gray-600">/month</span>
                  {isAnnual && (
                    <div className="text-sm text-green-600 font-medium">
                      Save ${(39 * 12) - (29 * 12)} annually
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleGetStarted('starter')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all"
                >
                  Get Started
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Up to 1,000 pages/month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Both Privacy & Collaboration modes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Basic OCR & text extraction</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Standard support</span>
                </div>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 relative text-white">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <p className="text-blue-100 mb-6">For growing businesses and teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? '79' : '99'}
                  </span>
                  <span className="text-blue-100">/month</span>
                  {isAnnual && (
                    <div className="text-sm text-yellow-300 font-medium">
                      Save ${(99 * 12) - (79 * 12)} annually
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleGetStarted('professional')}
                  className="w-full bg-white text-blue-600 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-all"
                >
                  Get Started
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Up to 10,000 pages/month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Both Privacy & Collaboration modes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Advanced OCR & AI analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-300" />
                  <span>Team collaboration tools</span>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large organizations with custom needs</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                  <div className="text-sm text-gray-600 mt-2">Contact for pricing</div>
                </div>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-all"
                >
                  Contact Sales
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Unlimited pages</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Both Privacy & Collaboration modes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Custom AI models</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">24/7 dedicated support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">On-premise deployment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Contact Sales</h3>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Choose your industry to connect with a specialist who understands your specific needs:
              </p>
              
              <div className="space-y-3">
                {industries.map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => handleIndustryContact(industry)}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center gap-3"
                  >
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">{industry.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Bot */}
        {showChatBot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg h-96 flex flex-col">
              <div className="flex justify-between items-center p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">ProofPix Assistant</h3>
                    <p className="text-sm text-gray-600">Ask me anything about ProofPix</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowChatBot(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500">
                    <p>Hi! I'm here to help you understand ProofPix.</p>
                    <p className="text-sm mt-2">Ask me about pricing, security, or industry features!</p>
                  </div>
                )}
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask about pricing, security, features..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          handleChatMessage(input.value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                      if (input.value.trim()) {
                        handleChatMessage(input.value);
                        input.value = '';
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedPricingPageV2; 