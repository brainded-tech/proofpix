import React, { useState, useEffect } from 'react';
import { Mail, User, Building, Phone, Calendar, CheckCircle, ArrowRight, Star, Target, Clock } from 'lucide-react';

interface LeadData {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  jobTitle?: string;
  companySize?: string;
  useCase?: string;
  industry?: string;
  urgency?: 'low' | 'medium' | 'high';
  source: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'demo_scheduled' | 'closed';
  createdAt: Date;
  lastActivity?: Date;
  notes?: string;
}

interface AutomationSequence {
  id: string;
  name: string;
  trigger: string;
  emails: {
    delay: number; // hours
    subject: string;
    template: string;
    cta?: string;
    ctaUrl?: string;
  }[];
}

interface LeadCaptureSystemProps {
  onLeadCaptured?: (lead: LeadData) => void;
  source?: string;
  variant?: 'inline' | 'modal' | 'sidebar';
}

export const LeadCaptureSystem: React.FC<LeadCaptureSystemProps> = ({
  onLeadCaptured,
  source = 'website',
  variant = 'inline'
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    company: string;
    phone: string;
    jobTitle: string;
    companySize: string;
    useCase: string;
    industry: string;
    urgency: 'low' | 'medium' | 'high';
  }>({
    name: '',
    email: '',
    company: '',
    phone: '',
    jobTitle: '',
    companySize: '',
    useCase: '',
    industry: '',
    urgency: 'medium'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadScore, setLeadScore] = useState(0);

  // Calculate lead score based on form data
  useEffect(() => {
    let score = 0;
    
    // Company size scoring
    if (formData.companySize === '1000+') score += 30;
    else if (formData.companySize === '500-999') score += 25;
    else if (formData.companySize === '100-499') score += 20;
    else if (formData.companySize === '50-99') score += 15;
    else if (formData.companySize === '10-49') score += 10;
    
    // Job title scoring
    if (formData.jobTitle?.toLowerCase().includes('cto') || 
        formData.jobTitle?.toLowerCase().includes('ciso') ||
        formData.jobTitle?.toLowerCase().includes('vp')) score += 25;
    else if (formData.jobTitle?.toLowerCase().includes('director') ||
             formData.jobTitle?.toLowerCase().includes('manager')) score += 15;
    
    // Industry scoring (high-value industries)
    if (['legal', 'insurance', 'healthcare', 'government'].includes(formData.industry)) {
      score += 20;
    }
    
    // Use case scoring
    if (formData.useCase?.toLowerCase().includes('compliance') ||
        formData.useCase?.toLowerCase().includes('audit') ||
        formData.useCase?.toLowerCase().includes('forensic')) score += 15;
    
    // Urgency scoring
    if (formData.urgency === 'high') score += 20;
    else if (formData.urgency === 'medium') score += 10;
    
    setLeadScore(Math.min(score, 100));
  }, [formData]);

  const automationSequences: AutomationSequence[] = [
    {
      id: 'enterprise_nurture',
      name: 'Enterprise Lead Nurture',
      trigger: 'form_submission',
      emails: [
        {
          delay: 0,
          subject: 'Welcome to ProofPix Enterprise - Your Security-First Document Intelligence Platform',
          template: `Hi {{name}},

Thank you for your interest in ProofPix Enterprise! We're excited to help {{company}} transform your document processing workflows with our security-first approach.

Based on your interest in {{useCase}}, I wanted to share some resources that might be immediately helpful:

🔒 Security Architecture Overview: See how we ensure zero data exposure
📊 ROI Calculator: Estimate your potential savings
🎯 Industry Solutions: Tailored for {{industry}} organizations

What's Next?
I'd love to schedule a personalized demo to show you exactly how ProofPix can address {{company}}'s specific needs. 

Best regards,
[Enterprise Sales Specialist Name]
ProofPix Enterprise Team`,
          cta: 'Schedule Your Demo',
          ctaUrl: 'https://calendly.com/proofpix-enterprise'
        },
        {
          delay: 24,
          subject: 'How {{company}} Can Achieve 65% Faster Document Processing',
          template: `Hi {{name}},

I wanted to follow up on your interest in ProofPix Enterprise and share some specific results we've seen with {{industry}} organizations:

✅ 65% reduction in document processing time
✅ 100% elimination of data exposure risks  
✅ $2.3M average annual savings for enterprise customers
✅ 99.9% uptime with enterprise SLA

Case Study Spotlight:
A similar {{industry}} organization reduced their compliance audit time from 2 weeks to 2 days while maintaining 100% security standards.

Ready to see these results for {{company}}?

Best regards,
[Enterprise Sales Specialist Name]`,
          cta: 'Book a 15-Minute Call',
          ctaUrl: 'https://calendly.com/proofpix-enterprise'
        },
        {
          delay: 72,
          subject: 'Last chance: Exclusive enterprise demo for {{company}}',
          template: `Hi {{name}},

I don't want you to miss out on seeing how ProofPix Enterprise can transform {{company}}'s document workflows.

This week only, I'm offering:
• Personalized demo tailored to {{useCase}}
• Custom ROI analysis for {{company}}
• 30-day pilot program discussion
• Direct access to our security team

The demo takes just 15 minutes and could save {{company}} significant time and costs.

Shall we schedule it?

Best regards,
[Enterprise Sales Specialist Name]`,
          cta: 'Claim Your Demo Spot',
          ctaUrl: 'https://calendly.com/proofpix-enterprise'
        }
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const leadData: LeadData = {
        id: `lead_${Date.now()}`,
        ...formData,
        source,
        score: leadScore,
        status: 'new',
        createdAt: new Date()
      };

      // Store lead data (in production, this would go to your CRM)
      const existingLeads = JSON.parse(localStorage.getItem('proofpix_leads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('proofpix_leads', JSON.stringify(existingLeads));

      // Trigger automation sequence
      await triggerAutomationSequence(leadData);

      // Notify parent component
      onLeadCaptured?.(leadData);

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error capturing lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerAutomationSequence = async (lead: LeadData) => {
    // In production, this would integrate with your email automation platform
    console.log('Triggering automation sequence for lead:', lead);
    
    // Store automation data for tracking
    const automationData = {
      leadId: lead.id,
      sequenceId: 'enterprise_nurture',
      startedAt: new Date(),
      emails: automationSequences[0].emails.map((email, index) => ({
        ...email,
        scheduledFor: new Date(Date.now() + email.delay * 60 * 60 * 1000),
        status: 'scheduled'
      }))
    };
    
    const existingAutomations = JSON.parse(localStorage.getItem('proofpix_automations') || '[]');
    existingAutomations.push(automationData);
    localStorage.setItem('proofpix_automations', JSON.stringify(existingAutomations));
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">Thank You!</h3>
        <p className="text-green-700 mb-4">
          We've received your information and will be in touch within 24 hours.
        </p>
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium mb-2">What happens next:</p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✓ Personalized welcome email (immediate)</li>
            <li>✓ Custom demo invitation (within 24 hours)</li>
            <li>✓ ROI analysis for your organization (48 hours)</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center mb-4">
        <Target className="h-6 w-6 text-blue-600 mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Get Your Enterprise Demo</h3>
          <p className="text-sm text-slate-600">See how ProofPix can transform your document workflows</p>
        </div>
      </div>

      {leadScore > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">Lead Score</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm font-bold text-blue-900">{leadScore}/100</span>
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${leadScore}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Business Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Acme Corporation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="CTO, CISO, IT Director"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Size
            </label>
            <select
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select size</option>
              <option value="1-9">1-9 employees</option>
              <option value="10-49">10-49 employees</option>
              <option value="50-99">50-99 employees</option>
              <option value="100-499">100-499 employees</option>
              <option value="500-999">500-999 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select industry</option>
              <option value="legal">Legal Services</option>
              <option value="insurance">Insurance</option>
              <option value="healthcare">Healthcare</option>
              <option value="government">Government</option>
              <option value="financial">Financial Services</option>
              <option value="technology">Technology</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Primary Use Case
          </label>
          <textarea
            value={formData.useCase}
            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Digital forensics, compliance auditing, document authenticity verification..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Timeline
          </label>
          <select
            value={formData.urgency}
            onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Exploring options (3+ months)</option>
            <option value="medium">Evaluating solutions (1-3 months)</option>
            <option value="high">Need solution ASAP (within 1 month)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Clock className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Get My Enterprise Demo
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 text-center">
          By submitting this form, you agree to receive communications from ProofPix. 
          We respect your privacy and will never share your information.
        </p>
      </form>
    </div>
  );
};

export default LeadCaptureSystem; 