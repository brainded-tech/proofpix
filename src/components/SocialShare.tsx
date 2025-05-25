// components/SocialShare.tsx
import React, { memo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { analytics } from '../utils/analytics';

interface SocialShareProps {
  isVisible?: boolean;
  variant?: 'success' | 'minimal' | 'prominent';
  className?: string;
  exportType?: string | null;
  onShare?: (platform: string) => void;
}

const SocialShare = memo<SocialShareProps>(({ 
  isVisible = true,
  variant = 'success', // 'success', 'minimal', 'prominent'
  className = '',
  exportType = null,
  onShare = null
}) => {
  const [showCopied, setShowCopied] = useState(false);

  const shareData = {
    twitter: {
      text: 'I just discovered hidden metadata in my photos using ProofPix! 📸🔍 It shows GPS coordinates, timestamps, and camera details that I never knew were there. Check out this privacy-first tool:',
      url: 'https://upload.proofpixapp.com',
      hashtags: 'PhotoPrivacy,EXIF,ProofPix,DigitalPrivacy,PhotoMetadata'
    },
    linkedin: {
      text: 'Discovered ProofPix - a game-changing tool for extracting photo metadata! Perfect for professionals who need to verify photo authenticity and manage privacy. The tool processes everything locally for complete data security.',
      url: 'https://upload.proofpixapp.com'
    },
    facebook: {
      text: 'Found an amazing tool that reveals hidden information in photos! ProofPix shows GPS coordinates, timestamps, and camera details that are normally invisible. Great for privacy awareness and professional use.',
      url: 'https://upload.proofpixapp.com'
    },
    reddit: {
      title: 'PSA: Your photos contain way more hidden data than you think',
      text: 'Just tried ProofPix and was shocked at all the metadata in my photos. GPS coordinates, exact timestamps, camera settings, and more. This free tool processes everything locally (no uploads) and is perfect for checking what info you\'re accidentally sharing.',
      url: 'https://upload.proofpixapp.com'
    }
  };

  const handleTwitterShare = () => {
    const data = shareData.twitter;
    const tweetText = encodeURIComponent(`${data.text} ${data.url} #${data.hashtags.replace(/,/g, ' #')}`);
    const url = `https://twitter.com/intent/tweet?text=${tweetText}`;
    
    window.open(url, '_blank', 'width=550,height=420');
    analytics.trackFeatureUsage('Social Share', 'Twitter');
    onShare?.('twitter');
  };

  const handleLinkedInShare = () => {
    const data = shareData.linkedin;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}&summary=${encodeURIComponent(data.text)}`;
    
    window.open(url, '_blank', 'width=550,height=420');
    analytics.trackFeatureUsage('Social Share', 'LinkedIn');
    onShare?.('linkedin');
  };

  const handleFacebookShare = () => {
    const data = shareData.facebook;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.text)}`;
    
    window.open(url, '_blank', 'width=550,height=420');
    analytics.trackFeatureUsage('Social Share', 'Facebook');
    onShare?.('facebook');
  };

  const handleRedditShare = () => {
    const data = shareData.reddit;
    const url = `https://www.reddit.com/submit?title=${encodeURIComponent(data.title)}&text=${encodeURIComponent(data.text + '\n\n' + data.url)}`;
    
    window.open(url, '_blank', 'width=550,height=420');
    analytics.trackFeatureUsage('Social Share', 'Reddit');
    onShare?.('reddit');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://upload.proofpixapp.com');
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
      analytics.trackFeatureUsage('Social Share', 'Copy Link');
      onShare?.('copy');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = 'https://upload.proofpixapp.com';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
      analytics.trackFeatureUsage('Social Share', 'Copy Link Fallback');
      onShare?.('copy');
    }
  };

  if (!isVisible) return null;

  // Success variant - shown after successful exports
  if (variant === 'success') {
    return (
      <div className={`social-share-success ${className}`}>
        <div className="share-header">
          <LucideIcons.Share2 size={16} className="share-icon" />
          <span className="share-title">Enjoyed ProofPix?</span>
        </div>
        <p className="share-description">
          Help others discover their photo metadata! Share ProofPix with friends and colleagues.
        </p>
        <div className="share-buttons-grid">
          <button onClick={handleTwitterShare} className="share-btn twitter" title="Share on Twitter">
            <LucideIcons.Twitter size={16} />
            <span>Twitter</span>
          </button>
          <button onClick={handleLinkedInShare} className="share-btn linkedin" title="Share on LinkedIn">
            <LucideIcons.Linkedin size={16} />
            <span>LinkedIn</span>
          </button>
          <button onClick={handleFacebookShare} className="share-btn facebook" title="Share on Facebook">
            <LucideIcons.Facebook size={16} />
            <span>Facebook</span>
          </button>
          <button onClick={handleRedditShare} className="share-btn reddit" title="Share on Reddit">
            <LucideIcons.MessageCircle size={16} />
            <span>Reddit</span>
          </button>
          <button onClick={handleCopyLink} className="share-btn copy" title="Copy link">
            {showCopied ? <LucideIcons.Check size={16} /> : <LucideIcons.Copy size={16} />}
            <span>{showCopied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Minimal variant - compact inline version
  if (variant === 'minimal') {
    return (
      <div className={`social-share-minimal ${className}`}>
        <span className="share-label">Share:</span>
        <div className="share-buttons-inline">
          <button onClick={handleTwitterShare} className="share-btn-mini twitter" title="Twitter">
            <LucideIcons.Twitter size={14} />
          </button>
          <button onClick={handleLinkedInShare} className="share-btn-mini linkedin" title="LinkedIn">
            <LucideIcons.Linkedin size={14} />
          </button>
          <button onClick={handleCopyLink} className="share-btn-mini copy" title="Copy link">
            {showCopied ? <LucideIcons.Check size={14} /> : <LucideIcons.Copy size={14} />}
          </button>
        </div>
      </div>
    );
  }

  // Prominent variant - larger call-to-action
  if (variant === 'prominent') {
    return (
      <div className={`social-share-prominent ${className}`}>
        <div className="share-hero">
          <LucideIcons.Heart size={20} className="share-heart" />
          <h3>Love ProofPix? Spread the word!</h3>
          <p>Help others discover the hidden data in their photos</p>
        </div>
        <div className="share-buttons-prominent">
          <button onClick={handleTwitterShare} className="share-btn-large twitter">
            <LucideIcons.Twitter size={18} />
            <span>Tweet about ProofPix</span>
          </button>
          <button onClick={handleLinkedInShare} className="share-btn-large linkedin">
            <LucideIcons.Linkedin size={18} />
            <span>Share professionally</span>
          </button>
          <button onClick={handleCopyLink} className="share-btn-large copy">
            {showCopied ? <LucideIcons.Check size={18} /> : <LucideIcons.Copy size={18} />}
            <span>{showCopied ? 'Link copied!' : 'Copy & share link'}</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
});

SocialShare.displayName = 'SocialShare';
export default SocialShare;