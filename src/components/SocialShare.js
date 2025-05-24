// components/SocialShare.js
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';

const SocialShare = ({ imageUrl, metadata }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const shareUrl = window.location.href;
  const shareText = `Check out ProofPix - Extract EXIF metadata from photos with complete privacy! 📸`;
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`
  };
  
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch {
      prompt('Copy this link:', shareUrl);
    }
  };
  
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ProofPix - EXIF Metadata Extractor',
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      setShowShareMenu(true);
    }
  };
  
  return (
    <div className="social-share">
      <button 
        onClick={nativeShare}
        className="share-button"
      >
        <LucideIcons.Share2 size={16} />
        Share ProofPix
      </button>
      
      {showShareMenu && (
        <div className="share-menu">
          <div className="share-header">
            <h4>Share ProofPix</h4>
            <button onClick={() => setShowShareMenu(false)}>
              <LucideIcons.X size={16} />
            </button>
          </div>
          
          <div className="share-options">
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="share-option twitter">
              <LucideIcons.Twitter size={20} />
              Twitter
            </a>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="share-option facebook">
              <LucideIcons.Facebook size={20} />
              Facebook
            </a>
            <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="share-option linkedin">
              <LucideIcons.Linkedin size={20} />
              LinkedIn
            </a>
            <a href={shareLinks.reddit} target="_blank" rel="noopener noreferrer" className="share-option reddit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              Reddit
            </a>
            <button onClick={copyShareLink} className="share-option copy">
              <LucideIcons.Link size={20} />
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;