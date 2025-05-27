// Email capture utilities - Optional privacy-preserving

// Email Capture System - Privacy-First Lead Generation
import React, { useState, useCallback } from 'react';
import { analytics } from '../analytics';

export class EmailCaptureSystem {
  constructor() {
    this.triggers = {
      upgrade: 'Upgrade to Pro',
      limit: 'Usage Limit Reached',
      feature: 'Premium Feature Access',
      exit: 'Exit Intent',
      enterprise: 'Enterprise Inquiry',
      newsletter: 'Newsletter Signup',
      download: 'Download Report'
    };

    this.captureReasons = {
      upgrade: 'Get notified about Pro features and exclusive offers',
      limit: 'Increase your limits with Pro - get early access',
      feature: 'Unlock this feature with Pro membership',
      exit: 'Get our free EXIF analysis guide before you go',
      enterprise: 'Discuss enterprise solutions and custom pricing',
      newsletter: 'Stay updated with forensic photography tips',
      download: 'Receive your analysis report and future updates'
    };
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
      upgrade: '🚀 Unlock Pro Features',
      limit: '⚡ Increase Your Limits',
      feature: '✨ Premium Feature Access',
      exit: '📚 Free EXIF Guide',
      enterprise: '🏢 Enterprise Solutions',
      newsletter: '📧 Stay Updated',
      download: '📄 Get Your Report'
    };
    return titles[trigger] || 'Join ProofPix';
  }

  getDefaultSubtitle(trigger) {
    const subtitles = {
      upgrade: 'Get unlimited analysis, advanced exports, and priority support',
      limit: 'Continue analyzing with Pro membership',
      feature: 'This feature is available for Pro users',
      exit: 'Get our comprehensive EXIF analysis guide',
      enterprise: 'Custom solutions for your organization',
      newsletter: 'Tips, tricks, and forensic photography insights',
      download: 'Receive your detailed analysis report'
    };
    return subtitles[trigger] || 'Join thousands of professionals using ProofPix';
  }

  getDefaultIncentive(trigger) {
    const incentives = {
      upgrade: '7-day free trial • Cancel anytime • No credit card required',
      limit: 'Instant access • 50x more images • Advanced features',
      feature: 'Full feature access • Professional templates • Priority support',
      exit: 'Free download • No spam • Unsubscribe anytime',
      enterprise: 'Custom pricing • Dedicated support • API access',
      newsletter: 'Weekly tips • Exclusive content • Unsubscribe anytime',
      download: 'Instant download • Secure delivery • Privacy protected'
    };
    return incentives[trigger] || 'Join the ProofPix community';
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
      title: '🚀 Unlock Pro Features',
      subtitle: 'Get unlimited analysis, advanced exports, and priority support',
      ...options
    });
  }

  showLimitCapture(currentUsage, limit, options = {}) {
    return this.showEmailCapture('limit', {
      title: '⚡ You\'ve reached your limit',
      subtitle: `You've used ${currentUsage}/${limit} images. Upgrade to continue.`,
      ...options
    });
  }

  showFeatureCapture(featureName, options = {}) {
    return this.showEmailCapture('feature', {
      title: `✨ ${featureName} is Pro-only`,
      subtitle: 'Upgrade to access this premium feature',
      ...options
    });
  }

  showExitCapture(options = {}) {
    return this.showEmailCapture('exit', {
      title: '📚 Free EXIF Analysis Guide',
      subtitle: 'Get our comprehensive guide before you leave',
      incentive: 'Free PDF • 50+ pages • Professional tips',
      ...options
    });
  }

  showEnterpriseCapture(options = {}) {
    return this.showEmailCapture('enterprise', {
      title: '🏢 Enterprise Solutions',
      subtitle: 'Custom pricing, dedicated support, and API access',
      showCompanyField: true,
      showUseCaseField: true,
      ...options
    });
  }

  showDownloadCapture(reportType, options = {}) {
    return this.showEmailCapture('download', {
      title: '📄 Get Your Report',
      subtitle: `Download your ${reportType} analysis report`,
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
