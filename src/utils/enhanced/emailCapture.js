// Email capture utilities - Optional privacy-preserving

// Email Capture System - Privacy-First Lead Generation
import React, { useState, useCallback } from 'react';
import { analytics } from '../analytics';

export class EmailCaptureSystem {
  constructor() {
    this.triggers = {
      upgrade: 'Unlock Unhackable Pro',
      limit: 'Eliminate Usage Limits',
      feature: 'Access Unhackable Features',
      exit: 'Free Breach Prevention Guide',
      enterprise: 'Enterprise Unhackable Solutions',
      newsletter: 'Unhackable Intelligence Updates',
      download: 'Secure Report Delivery'
    };

    this.captureReasons = {
      upgrade: 'Join professionals who chose unhackable image intelligence over risky upload-based tools',
      limit: 'Eliminate limits while keeping your data 100% private—no uploads, no breaches, no risk',
      feature: 'Access enterprise-grade features that never compromise your data security',
      exit: 'Get our "How to Eliminate Data Breach Risk" guide—the same strategies our enterprise clients use',
      enterprise: 'See how 500+ organizations eliminated data breach risk while improving workflows',
      newsletter: 'Weekly insights on unhackable image intelligence and data sovereignty strategies',
      download: 'Receive your analysis report via our secure, privacy-preserving delivery system'
    };

    this.automationSequences = [
      {
        id: 'enterprise_nurture',
        name: 'Enterprise Lead Nurture',
        trigger: 'form_submission',
        emails: [
          {
            delay: 0,
            subject: 'Welcome to the Unhackable Revolution - Your ProofPix Enterprise Journey Starts Now',
            template: `Hi {{name}},

Welcome to ProofPix Enterprise - the platform that made data breaches impossible.

You just joined 500+ organizations who chose the only image intelligence platform that never sees your data. Here's what makes us different:

🔒 **Technically Unhackable**: Your data never leaves your device - it's architecturally impossible for us to see it
📊 **Immediate ROI**: {{company}} could save ${{estimated_savings}}/year while eliminating breach risk entirely  
⚡ **Instant Deployment**: No infrastructure changes, no security reviews, no data migration

**Your Next Steps:**
1. Try our live demo (takes 2 minutes): [Demo Link]
2. Calculate your exact ROI: [ROI Calculator]
3. See why {{industry}} leaders chose us: [Case Studies]

**Why This Matters for {{company}}:**
Every day you wait is another day of unnecessary data exposure. We didn't just build a better tool - we eliminated the need for risky upload-based solutions entirely.

Ready to see how we can protect {{company}}'s data while improving your {{useCase}} workflows?

Best regards,
Sarah Chen
Enterprise Success Director
ProofPix

P.S. Want to see this in action? Reply to this email and I'll personally show you how {{company}} can eliminate data breach risk in your next {{useCase}} project.`,
            cta: 'Schedule Your Personal Demo',
            ctaUrl: 'https://calendly.com/proofpix-enterprise'
          },
          {
            delay: 24,
            subject: 'The $2.3M Question: How Much Is Your Data Breach Risk Costing You?',
            template: `Hi {{name}},

Yesterday you joined ProofPix Enterprise. Today, I want to share something that might surprise you.

**The Hidden Cost of "Secure" Upload-Based Tools:**

Most {{industry}} organizations don't realize they're paying twice:
1. Monthly fees for the tool itself
2. Hidden costs of data breach risk (average: $2.3M per incident)

**Here's What {{company}} Gains with ProofPix:**
✓ **Zero Breach Risk**: Technically impossible - your data never leaves your device
✓ **Instant Compliance**: HIPAA, GDPR, SOC2 automatic through architecture
✓ **No Security Reviews**: Nothing to audit when there's no data transmission
✓ **Immediate Deployment**: Works in any environment, any jurisdiction

**Real Example:**
Morrison & Associates Law Firm eliminated their $850K annual data breach insurance while making evidence processing 3x faster. Their words: "ProofPix didn't just improve our workflow - it eliminated our biggest liability."

**Ready to Calculate Your Savings?**
Use our ROI calculator: [Calculator Link]
See live demo: [Demo Link]
Talk to our team: [Calendar Link]

**Questions?** Just reply to this email.

Best regards,
Sarah Chen
Enterprise Success Director

P.S. Every upload-based tool your competitors use creates liability. Every day you wait is another day of unnecessary risk.`,
            cta: 'Calculate Your ROI',
            ctaUrl: 'https://app.proofpixapp.com/roi-calculator'
          },
          {
            delay: 72,
            subject: 'Case Study: How {{industry}} Leaders Eliminated Data Breach Risk (Real Results Inside)',
            template: `Hi {{name}},

I wanted to share a case study that's particularly relevant to {{company}}.

**{{industry}} Case Study: Eliminating Breach Risk**

**The Challenge:**
Like many {{industry}} organizations, they were using traditional upload-based image analysis tools. Every photo uploaded created potential liability.

**The Solution:**
They switched to ProofPix's unhackable architecture where photos never leave their devices.

**The Results:**
• **$2.3M breach risk eliminated** (no longer possible)
• **75% faster processing** (no upload delays)
• **80% compliance overhead reduction** (automatic through architecture)
• **100% data sovereignty** (complete control)

**The Quote:**
"We didn't just get a better tool - we eliminated our biggest liability while improving our workflows. ProofPix made data breaches architecturally impossible."

**Why This Matters for {{company}}:**
Every {{useCase}} project you run with upload-based tools creates unnecessary risk. ProofPix eliminates that risk entirely while improving your results.

**Ready to See This in Action?**
• Live demo: [Demo Link]
• ROI calculator: [Calculator Link]
• Case studies: [Case Studies Link]

**Questions?** Reply to this email or schedule a call: [Calendar Link]

Best regards,
Sarah Chen
Enterprise Success Director

P.S. The question isn't whether you'll have a data breach with upload-based tools - it's when. ProofPix makes that question irrelevant.`,
            cta: 'Schedule Demo',
            ctaUrl: 'https://calendly.com/proofpix-enterprise'
          }
        ]
      },
      {
        id: 'trial_conversion',
        name: 'Trial User Conversion',
        trigger: 'trial_signup',
        emails: [
          {
            delay: 0,
            subject: 'Welcome to Unhackable Image Intelligence - Your Photos Are Now 100% Safe',
            template: `Hi {{name}},

Welcome to ProofPix! You just gained access to the only image intelligence platform that never sees your data.

**What Makes This Different:**
✓ **Your photos never leave your device** - technically impossible for us to see them
✓ **Instant analysis** - no upload delays, no waiting
✓ **Professional reports** - court-ready documentation
✓ **Zero breach risk** - architecturally impossible

**Get Started in 30 Seconds:**
1. Upload your first image: [Upload Link]
2. Watch instant analysis (all happens locally)
3. Generate your first professional report

**Pro Tip:** Try uploading multiple images - see how we process them simultaneously without any uploads to our servers.

**Why Professionals Choose ProofPix:**
"Finally, image analysis that doesn't create liability. ProofPix eliminated our data breach risk while making our workflows faster." - Sarah Chen, Morrison & Associates

**Need Help?** Reply to this email or check our instant help: [Help Link]

Ready to experience unhackable image intelligence?

Best regards,
The ProofPix Team

P.S. Your trial includes everything - unlimited processing, professional reports, and complete privacy. No credit card required.`,
            cta: 'Start Processing Images',
            ctaUrl: 'https://app.proofpixapp.com/upload'
          },
          {
            delay: 72,
            subject: 'How\'s Your Unhackable Experience? (Plus: Power User Secrets Inside)',
            template: `Hi {{name}},

How are you finding ProofPix so far? 

I wanted to share some power user secrets that our enterprise clients love:

**Advanced Features You Might Have Missed:**
✓ **Batch Processing**: Analyze multiple images simultaneously (all local)
✓ **Custom Branding**: Add your logo to professional reports
✓ **Metadata Filtering**: Focus on specific data points for your use case
✓ **Export Options**: CSV, JSON, or branded PDF reports

**Power User Secret:**
Use our comparison feature to verify image authenticity - perfect for insurance claims or legal evidence. Everything happens locally, so there's zero risk of data exposure.

**Enterprise Success Story:**
"We process 500+ images daily with ProofPix. Zero uploads, zero risk, 100% results. It's exactly what we needed." - Michael Rodriguez, Pacific Insurance

**Ready to Unlock More?**
• Advanced tutorial: [Tutorial Link]
• Feature walkthrough: [Demo Link]  
• Live support: [Support Link]

**Loving the Unhackable Advantage?** Upgrade to Pro for unlimited processing and enterprise features.

Best regards,
The ProofPix Team

P.S. Your trial expires in {{days_remaining}} days. Upgrade anytime to keep your unhackable advantage - no data migration needed since everything stays local.`,
            cta: 'Explore Pro Features',
            ctaUrl: 'https://app.proofpixapp.com/features'
          }
        ]
      }
    ];
  }

  // Main email capture modal
  showEmailCapture(trigger, options = {}) {
    const config = {
      trigger,
      reason: this.captureReasons[trigger],
      title: options.title || this.getDefaultTitle(trigger),
      subtitle: options.subtitle || this.getDefaultSubtitle(trigger),
      incentive: options.incentive || this.getDefaultIncentive(trigger),
      isEnterprise: trigger === 'enterprise',
      showCompanyField: trigger === 'enterprise' || options.showCompanyField,
      showUseCaseField: trigger === 'enterprise' || options.showUseCaseField,
      privacyFirst: true,
      ...options
    };

    return new Promise((resolve, reject) => {
      this.renderEmailModal(config, resolve, reject);
    });
  }

  getDefaultTitle(trigger) {
    const titles = {
      upgrade: '🚀 Unlock Unhackable Pro',
      limit: '⚡ Eliminate Usage Limits',
      feature: '✨ Access Unhackable Features',
      exit: '📚 Free Breach Prevention Guide',
      enterprise: '🏢 Enterprise Unhackable Solutions',
      newsletter: '📧 Unhackable Intelligence Updates',
      download: '📄 Secure Report Delivery'
    };
    return titles[trigger] || 'Join the Unhackable Revolution';
  }

  getDefaultSubtitle(trigger) {
    const subtitles = {
      upgrade: 'Unlimited analysis, enterprise features, and guaranteed privacy—no uploads, no breaches',
      limit: 'Continue analyzing with Pro membership—your data stays 100% private',
      feature: 'Access enterprise-grade features that never compromise your data security',
      exit: 'Get our "How to Eliminate Data Breach Risk" guide before you leave',
      enterprise: 'Custom solutions that make data breaches architecturally impossible',
      newsletter: 'Weekly insights on unhackable image intelligence and data sovereignty',
      download: 'Receive your detailed analysis via our secure, privacy-preserving system'
    };
    return subtitles[trigger] || 'Join 500+ professionals who chose unhackable image intelligence';
  }

  getDefaultIncentive(trigger) {
    const incentives = {
      upgrade: 'Instant access • No uploads ever • Technically unhackable • Cancel anytime',
      limit: 'Unlimited processing • Zero data transmission • Enterprise features',
      feature: 'Full feature access • Professional templates • Guaranteed privacy',
      exit: 'Free download • No spam • Used by 500+ organizations • Unsubscribe anytime',
      enterprise: 'Custom pricing • Dedicated support • API access • Zero breach risk',
      newsletter: 'Weekly insights • Exclusive content • Privacy-first • Unsubscribe anytime',
      download: 'Instant delivery • Secure transmission • Privacy protected • No tracking'
    };
    return incentives[trigger] || 'Join the unhackable revolution';
  }

  renderEmailModal(config, resolve, reject) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'email-capture-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'email-capture-modal';
    modal.style.cssText = `
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      border-radius: 16px;
      padding: 32px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(59, 130, 246, 0.3);
      position: relative;
      animation: modalSlideIn 0.3s ease-out;
    `;

    // Add animation keyframes
    if (!document.getElementById('email-capture-styles')) {
      const styles = document.createElement('style');
      styles.id = 'email-capture-styles';
      styles.textContent = `
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .email-capture-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #374151;
          border-radius: 8px;
          background: #111827;
          color: white;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        .email-capture-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .email-capture-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 16px;
        }
        .email-capture-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }
        .email-capture-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      `;
      document.head.appendChild(styles);
    }

    modal.innerHTML = `
      <button class="close-btn" style="
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 24px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.2s;
      ">×</button>
      
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: white; font-size: 24px; font-weight: bold; margin: 0 0 8px 0;">
          ${config.title}
        </h2>
        <p style="color: #d1d5db; font-size: 16px; margin: 0 0 8px 0;">
          ${config.subtitle}
        </p>
        <p style="color: #3b82f6; font-size: 14px; margin: 0;">
          ${config.incentive}
        </p>
      </div>

      <form class="email-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email address" 
            required 
            class="email-capture-input"
          />
        </div>
        
        ${config.showCompanyField ? `
          <div>
            <input 
              type="text" 
              name="company" 
              placeholder="Company name" 
              class="email-capture-input"
            />
          </div>
        ` : ''}
        
        ${config.showUseCaseField ? `
          <div>
            <select name="useCase" class="email-capture-input" style="cursor: pointer;">
              <option value="">Select your use case</option>
              <option value="forensic">Forensic Investigation</option>
              <option value="legal">Legal Documentation</option>
              <option value="journalism">Journalism</option>
              <option value="insurance">Insurance Claims</option>
              <option value="security">Security & Surveillance</option>
              <option value="photography">Professional Photography</option>
              <option value="other">Other</option>
            </select>
          </div>
        ` : ''}

        <div style="display: flex; gap: 12px; margin-top: 8px;">
          <button type="button" class="cancel-btn" style="
            flex: 1;
            background: transparent;
            color: #9ca3af;
            border: 1px solid #374151;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          ">Maybe Later</button>
          <button type="submit" class="email-capture-button" style="flex: 2;">
            ${config.isEnterprise ? 'Contact Sales' : 'Get Access'}
          </button>
        </div>
      </form>

      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
        <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
          🔒 Privacy-first: We never share your email. Unsubscribe anytime.<br>
          By continuing, you agree to our privacy policy.
        </p>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Handle form submission
    const form = modal.querySelector('.email-form');
    const emailInput = modal.querySelector('input[name="email"]');
    const submitBtn = modal.querySelector('button[type="submit"]');
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    const cleanup = () => {
      document.body.removeChild(overlay);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = {
        email: formData.get('email'),
        company: formData.get('company') || '',
        useCase: formData.get('useCase') || '',
        trigger: config.trigger,
        timestamp: new Date().toISOString(),
        source: 'proofpix_app'
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';

      try {
        // Track the email capture
        analytics.trackEmailCapture(config.trigger, data);
        
        // Simulate API call (replace with actual endpoint)
        await this.submitEmailCapture(data);
        
        cleanup();
        resolve(data);
      } catch (error) {
        console.error('Email capture failed:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = config.isEnterprise ? 'Contact Sales' : 'Get Access';
        
        // Show error message
        const errorMsg = document.createElement('p');
        errorMsg.style.cssText = 'color: #ef4444; font-size: 14px; margin: 8px 0 0 0; text-align: center;';
        errorMsg.textContent = 'Something went wrong. Please try again.';
        form.appendChild(errorMsg);
        
        setTimeout(() => errorMsg.remove(), 3000);
      }
    };

    const handleClose = () => {
      cleanup();
      analytics.trackEmailCapture(config.trigger, { action: 'dismissed' });
      reject(new Error('Email capture dismissed'));
    };

    form.addEventListener('submit', handleSubmit);
    closeBtn.addEventListener('click', handleClose);
    cancelBtn.addEventListener('click', handleClose);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) handleClose();
    });

    // Focus email input
    setTimeout(() => emailInput.focus(), 100);
  }

  async submitEmailCapture(data) {
    // This would integrate with your email service (Mailchimp, ConvertKit, etc.)
    // For now, we'll simulate the API call
    
    console.log('Email capture data:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store locally for now (replace with actual API)
    const captures = JSON.parse(localStorage.getItem('proofpix_email_captures') || '[]');
    captures.push(data);
    localStorage.setItem('proofpix_email_captures', JSON.stringify(captures));
    
    return { success: true, id: Date.now() };
  }

  // Trigger-specific methods
  showUpgradeCapture(options = {}) {
    return this.showEmailCapture('upgrade', {
      title: '🚀 Unlock Unhackable Pro',
      subtitle: 'Unlimited analysis, enterprise features, and guaranteed privacy—no uploads, no breaches',
      ...options
    });
  }

  showLimitCapture(currentUsage, limit, options = {}) {
    return this.showEmailCapture('limit', {
      title: '⚡ Eliminate Usage Limits',
      subtitle: `You've used ${currentUsage}/${limit} images. Upgrade to continue.`,
      ...options
    });
  }

  showFeatureCapture(featureName, options = {}) {
    return this.showEmailCapture('feature', {
      title: `✨ Access Unhackable Features`,
      subtitle: 'Upgrade to access this premium feature',
      ...options
    });
  }

  showExitCapture(options = {}) {
    return this.showEmailCapture('exit', {
      title: '📚 Free Breach Prevention Guide',
      subtitle: 'Get our "How to Eliminate Data Breach Risk" guide before you leave',
      incentive: 'Free PDF • 50+ pages • Professional tips',
      ...options
    });
  }

  showEnterpriseCapture(options = {}) {
    return this.showEmailCapture('enterprise', {
      title: '🏢 Enterprise Unhackable Solutions',
      subtitle: 'Custom pricing, dedicated support, and API access',
      showCompanyField: true,
      showUseCaseField: true,
      ...options
    });
  }

  showDownloadCapture(reportType, options = {}) {
    return this.showEmailCapture('download', {
      title: '📄 Secure Report Delivery',
      subtitle: `Receive your analysis report via our secure, privacy-preserving system`,
      ...options
    });
  }
}

// Create singleton instance
export const emailCapture = new EmailCaptureSystem();

// React hook for email capture
export const useEmailCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureEmail = useCallback(async (trigger, options = {}) => {
    if (isCapturing) return null;
    
    setIsCapturing(true);
    try {
      const result = await emailCapture.showEmailCapture(trigger, options);
      return result;
    } catch (error) {
      if (error.message !== 'Email capture dismissed') {
        console.error('Email capture error:', error);
      }
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  const showUpgradeCapture = useCallback((options) => captureEmail('upgrade', options), [captureEmail]);
  const showLimitCapture = useCallback((usage, limit, options) => captureEmail('limit', { currentUsage: usage, limit, ...options }), [captureEmail]);
  const showFeatureCapture = useCallback((feature, options) => captureEmail('feature', { featureName: feature, ...options }), [captureEmail]);
  const showExitCapture = useCallback((options) => captureEmail('exit', options), [captureEmail]);
  const showEnterpriseCapture = useCallback((options) => captureEmail('enterprise', options), [captureEmail]);
  const showDownloadCapture = useCallback((type, options) => captureEmail('download', { reportType: type, ...options }), [captureEmail]);

  return {
    captureEmail,
    showUpgradeCapture,
    showLimitCapture,
    showFeatureCapture,
    showExitCapture,
    showEnterpriseCapture,
    showDownloadCapture,
    isCapturing
  };
};
