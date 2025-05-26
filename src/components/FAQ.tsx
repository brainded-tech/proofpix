import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
  category: string;
}

interface FAQSection {
  title: string;
  icon: string;
  items: FAQItem[];
}

export const FAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleQuestionClick = (questionId: string) => {
    setOpenItem(openItem === questionId ? null : questionId);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const faqSections: FAQSection[] = [
    {
      title: "Getting Started",
      icon: "🚀",
      items: [
        {
          question: "What is ProofPix and how does it work?",
          answer: (
            <div>
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-lg p-4 mb-4">
                <p className="font-semibold text-white mb-2">ProofPix is a privacy-first tool that extracts hidden metadata from your photos — including timestamps, GPS locations, and camera details — all processed locally in your browser.</p>
              </div>
              <p className="mb-4">Every digital photo contains hidden information called EXIF metadata. This includes:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>When:</strong> Exact date and time the photo was taken
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Where:</strong> GPS coordinates (if location services were enabled)
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>How:</strong> Camera settings, device model, and technical details
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>What:</strong> Image dimensions, file size, and format information
                </li>
              </ul>
              <p>ProofPix makes this invisible information visible and actionable, helping you verify photo authenticity and protect your privacy.</p>
            </div>
          ),
          category: "getting-started"
        },
        {
          question: "How do I use ProofPix? Do I need to create an account?",
          answer: (
            <div>
              <p className="mb-4"><strong>No account required!</strong> Using ProofPix is incredibly simple:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  Visit upload.proofpixapp.com
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  Drag and drop your photo or click to browse
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  View your metadata instantly
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  Download timestamped images or PDF reports
                </li>
              </ul>
              <p>For basic features, you don't need to sign up for anything. Professional features and bulk processing require a subscription, but you can try everything first.</p>
            </div>
          ),
          category: "getting-started"
        },
        {
          question: "What file formats does ProofPix support?",
          answer: (
            <div>
              <p className="mb-4">ProofPix supports all major photo formats:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>JPEG/JPG:</strong> Most common format with full metadata support
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>PNG:</strong> Limited metadata but fully supported
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>TIFF:</strong> Professional format with extensive metadata
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>HEIC:</strong> iPhone's modern format (iOS 11+)
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>RAW formats:</strong> Professional camera files (coming soon)
                </li>
              </ul>
              <p>The amount of metadata varies by format and camera settings. JPEG files typically contain the most comprehensive information.</p>
            </div>
          ),
          category: "getting-started"
        },
        {
          question: "Why should I care about photo metadata?",
          answer: (
            <div>
              <p className="mb-4">Photo metadata serves two crucial purposes:</p>
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-2">📋 Professional Documentation</h4>
                <ul className="list-none pl-5 space-y-1">
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Prove when and where photos were taken for insurance, legal, or business purposes
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Verify authenticity for evidence or compliance
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Create professional reports for clients
                  </li>
                </ul>
              </div>
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">🔒 Privacy Protection</h4>
                <ul className="list-none pl-5 space-y-1">
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Understand what hidden information your photos reveal
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Remove sensitive location data before sharing
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Protect your family's privacy and safety
                  </li>
                </ul>
              </div>
            </div>
          ),
          category: "getting-started"
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: "🔒",
      items: [
        {
          question: "Is ProofPix secure? What happens to my photos?",
          answer: (
            <div>
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-lg p-4 mb-4">
                <p className="font-semibold text-white">100% secure. Your photos never leave your device.</p>
              </div>
              <p className="mb-4">ProofPix uses advanced browser technology to process everything locally:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>No uploads:</strong> Photos are processed entirely in your browser
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>No storage:</strong> We never save or store your images on any servers
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>No tracking:</strong> We don't track which photos you process
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Works offline:</strong> Once loaded, ProofPix works without internet
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Open source:</strong> Our code is publicly auditable for complete transparency
                </li>
              </ul>
              <p>This privacy-first approach means your sensitive photos — whether personal, professional, or legal — remain completely under your control.</p>
            </div>
          ),
          category: "privacy"
        },
        {
          question: "How do you make money if the service is free and private?",
          answer: (
            <div>
              <p className="mb-4">ProofPix uses a transparent freemium model:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Free tier:</strong> Core features remain free forever (10 photos/day)
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Professional subscriptions:</strong> Advanced features for power users
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Privacy-focused sponsorships:</strong> Partnerships with relevant tools, completely separate from your photo processing
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>No data selling:</strong> We never sell user data or photo information
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Open source transparency:</strong> All code is publicly available for audit and contribution
                </li>
              </ul>
              <p>Our business model is designed to keep your data private while providing sustainable, professional-grade tools.</p>
            </div>
          ),
          category: "privacy"
        },
        {
          question: "Is ProofPix really open source? Where can I see the code?",
          answer: (
            <div>
              <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 rounded-lg p-4 mb-4">
                <p className="font-semibold text-white">Yes! ProofPix is fully open source under the MIT License.</p>
              </div>
              <p className="mb-4">Complete transparency means you can:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-green-400 font-bold">•</span>
                  <strong>View all source code:</strong> Every line of code is publicly available on GitHub
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-green-400 font-bold">•</span>
                  <strong>Audit privacy claims:</strong> Verify that we actually do local processing only
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-green-400 font-bold">•</span>
                  <strong>Contribute improvements:</strong> Submit bug fixes, features, or suggestions
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-green-400 font-bold">•</span>
                  <strong>Fork for your needs:</strong> Create your own version with custom features
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-green-400 font-bold">•</span>
                  <strong>Self-host:</strong> Run your own instance for maximum control
                </li>
              </ul>
              <p>This level of transparency builds trust and ensures ProofPix remains privacy-focused forever.</p>
            </div>
          ),
          category: "privacy"
        },
        {
          question: "Can I remove location data from my photos?",
          answer: (
            <div>
              <p className="mb-4">Yes! ProofPix helps you both view and manage your photo metadata:</p>
              <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg p-4 mb-4">
                <h4 className="text-yellow-400 font-semibold mb-2">🔧 Current Features:</h4>
                <ul className="list-none pl-5 space-y-1">
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    View all metadata including GPS coordinates
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Understand what information your photos contain
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Export clean PDFs without sensitive metadata
                  </li>
                </ul>
              </div>
              <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">⭐ Coming Soon (Pro Feature):</h4>
                <ul className="list-none pl-5 space-y-1">
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    One-click metadata removal
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Bulk processing for multiple photos
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Selective metadata cleaning
                  </li>
                </ul>
              </div>
            </div>
          ),
          category: "privacy"
        },
        {
          question: "What information do you collect about me?",
          answer: (
            <div>
              <p className="mb-4">We collect minimal, anonymous information:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Usage statistics:</strong> Number of photos processed (anonymous)
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Performance data:</strong> App speed and error reports
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>No personal data:</strong> No names, emails, or identifying information
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>No photo data:</strong> We never see or store your actual photos
                </li>
              </ul>
              <p>You can opt out of all analytics in your privacy settings. See our full Privacy Policy for complete details.</p>
            </div>
          ),
          category: "privacy"
        }
      ]
    },
    {
      title: "Professional Features & Pricing",
      icon: "💼",
      items: [
        {
          question: "Will ProofPix stay free? What's the pricing?",
          answer: (
            <div>
              <p className="mb-4"><strong>Core features are free forever.</strong> Our pricing is designed to be accessible:</p>
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-2">🆓 Free Tier (Always Available):</h4>
                <ul className="list-none pl-5 space-y-1">
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    10 photos per day
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Full metadata viewing
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Basic PDF reports
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Timestamp overlays
                  </li>
                </ul>
              </div>
              <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg p-4 mb-4">
                <h4 className="text-yellow-400 font-semibold mb-2">⭐ Pro ($4.99/month):</h4>
                <ul className="list-none pl-5 space-y-1">
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Unlimited photo processing
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Bulk processing tools
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Advanced PDF reports
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Metadata removal tools
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Professional templates
                  </li>
                </ul>
              </div>
              <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">🏢 Enterprise (Custom pricing):</h4>
                <ul className="list-none pl-5 space-y-1">
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    API access
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    White-label solutions
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Advanced compliance features
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Priority support
                  </li>
                </ul>
              </div>
            </div>
          ),
          category: "professional"
        },
        {
          question: "Can I download timestamped images and PDF reports?",
          answer: (
            <div>
              <p className="mb-4"><strong>Yes!</strong> ProofPix offers multiple export options:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Timestamped Images:</strong> Add professional timestamp overlays to your photos
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>PDF Reports:</strong> Comprehensive metadata reports perfect for legal, insurance, or business use
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>JSON Export:</strong> Raw metadata for technical applications
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Custom Formats:</strong> Multiple image sizes and quality options
                </li>
              </ul>
              <p>All exports maintain the same privacy standards — everything is generated locally in your browser.</p>
            </div>
          ),
          category: "professional"
        },
        {
          question: "Who uses ProofPix professionally?",
          answer: (
            <div>
              <p className="mb-4">ProofPix serves a wide range of professionals who need photo verification:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Gig Workers:</strong> Uber/Lyft drivers documenting incidents, delivery workers proving completion
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Contractors:</strong> Progress photos with verified timestamps for clients
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Real Estate Agents:</strong> MLS compliance and property documentation
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Insurance Professionals:</strong> Claim documentation and evidence verification
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Legal Teams:</strong> Photo evidence authentication and chain of custody
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Property Managers:</strong> Maintenance and inspection documentation
                </li>
              </ul>
            </div>
          ),
          category: "professional"
        },
        {
          question: "Do you offer API access or integrations?",
          answer: (
            <div>
              <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg p-4 mb-4">
                <h4 className="text-yellow-400 font-semibold mb-2">🚀 Coming Soon: Enterprise API</h4>
                <p>We're developing API access for businesses and developers who need to integrate photo verification into their own applications.</p>
              </div>
              <p className="mb-4">Planned API features include:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  Metadata extraction endpoints
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  Bulk processing capabilities
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  Webhook notifications
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  Custom report generation
                </li>
              </ul>
              <p>Interested in API access? Contact us to join the early access program.</p>
            </div>
          ),
          category: "professional"
        }
      ]
    },
    {
      title: "Technical Support",
      icon: "🛠️",
      items: [
        {
          question: 'My photo shows "No metadata found" - why?',
          answer: (
            <div>
              <p className="mb-4">Several reasons why photos might lack metadata:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Screenshots:</strong> Screenshots don't contain camera metadata
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Edited photos:</strong> Many editing apps strip metadata when saving
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Social media downloads:</strong> Platforms like Instagram remove metadata for privacy
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Privacy settings:</strong> Location services might have been disabled
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Older cameras:</strong> Some older devices don't record GPS data
                </li>
              </ul>
              <p>This is actually a good thing for privacy! It means the photo doesn't reveal sensitive information.</p>
            </div>
          ),
          category: "technical"
        },
        {
          question: "Does ProofPix work on mobile devices?",
          answer: (
            <div>
              <p className="mb-4"><strong>Yes!</strong> ProofPix is designed to work seamlessly across all devices:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>iOS Safari:</strong> Full functionality on iPhone and iPad
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Android Chrome:</strong> Complete feature support
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Desktop browsers:</strong> Chrome, Firefox, Safari, Edge
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Responsive design:</strong> Optimized for touch and mobile use
                </li>
              </ul>
              <p>The mobile experience is particularly useful for field workers who need to verify photos on the go.</p>
            </div>
          ),
          category: "technical"
        },
        {
          question: "Can I process multiple photos at once?",
          answer: (
            <div>
              <p className="mb-4">Bulk processing is available with different options:</p>
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-2">🆓 Free Tier:</h4>
                <p>One photo at a time, up to 10 per day</p>
              </div>
              <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg p-4 mb-4">
                <h4 className="text-yellow-400 font-semibold mb-2">⭐ Pro Tier:</h4>
                <ul className="list-none pl-5 space-y-1">
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Upload multiple photos simultaneously
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Batch processing with progress tracking
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Bulk export to PDF or ZIP files
                  </li>
                  <li className="relative">
                    <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                    Comparison tools for multiple images
                  </li>
                </ul>
              </div>
              <p>Professional bulk processing maintains the same privacy standards — everything stays local to your device.</p>
            </div>
          ),
          category: "technical"
        },
        {
          question: "What browsers are supported?",
          answer: (
            <div>
              <p className="mb-4">ProofPix works on all modern browsers:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Chrome:</strong> Full support (recommended)
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Firefox:</strong> Full support
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Safari:</strong> Full support (iOS and macOS)
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Edge:</strong> Full support
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Opera:</strong> Full support
                </li>
              </ul>
              <p>We use standard web technologies, so ProofPix works without plugins or special software. For the best experience, we recommend keeping your browser updated.</p>
            </div>
          ),
          category: "technical"
        },
        {
          question: "I'm having technical issues. How do I get help?",
          answer: (
            <div>
              <p className="mb-4">We're here to help! Here's how to get support:</p>
              <ul className="list-none pl-5 mb-4 space-y-2">
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Check this FAQ:</strong> Most common issues are covered here
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Contact form:</strong> Use our contact page for specific issues
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Email support:</strong> Direct email for subscribers
                </li>
                <li className="relative">
                  <span className="absolute left-[-15px] text-blue-400 font-bold">•</span>
                  <strong>Community forum:</strong> User-to-user help and tips
                </li>
              </ul>
              <p>When reporting issues, please include your browser version and a description of what you were trying to do. This helps us resolve problems quickly.</p>
            </div>
          ),
          category: "technical"
        }
      ]
    }
  ];

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handlePrivacyClick = () => {
    navigate('/privacy');
  };

  const handleTermsClick = () => {
    navigate('/terms');
  };

  const handleSupportClick = () => {
    navigate('/support');
  };



  const handleContactSupportClick = () => {
    window.location.href = 'mailto:support@proofpixapp.com';
  };

  const handleStartNowClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Camera className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold">ProofPix</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5">
        {/* Hero Section */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
          <h1 
            className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
              animation: 'glow 2s ease-in-out infinite alternate'
            }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Everything you need to know about ProofPix, photo metadata, and protecting your privacy.
          </p>
        </section>

        {/* Quick Start Section */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 mb-10 text-center">
          <h3 className="text-green-400 text-xl font-bold mb-4 flex items-center justify-center gap-3">
            🚀 New to ProofPix?
          </h3>
          <p className="text-gray-300 mb-6">
            Try it now! Upload a photo and see your metadata in seconds. No account required, completely private.
          </p>
          <button
            onClick={handleStartNowClick}
            className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30"
          >
            Start Now - It's Free
          </button>
        </div>

        {/* Category Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {faqSections.map((section, index) => (
            <div
              key={section.title}
              onClick={() => scrollToSection(`section-${index}`)}
              className="bg-white/5 border border-white/10 rounded-xl p-5 text-center cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-0.5"
            >
              <h3 className="text-blue-400 text-lg font-semibold mb-2">{section.title}</h3>
              <p className="text-gray-400 text-sm">
                {section.title === "Getting Started" && "Basic usage and setup"}
                {section.title === "Privacy & Security" && "How we protect your data"}
                {section.title === "Professional Features & Pricing" && "Advanced tools and pricing"}
                {section.title === "Technical Support" && "Troubleshooting and help"}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="flex flex-col gap-10 my-15 mb-15">
          {faqSections.map((section, sectionIndex) => (
            <section
              key={section.title}
              id={`section-${sectionIndex}`}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10 transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 relative overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8 pb-5 border-b border-white/10">
                <span className="text-3xl">{section.icon}</span>
                <h2 className="text-3xl font-bold text-white">{section.title}</h2>
              </div>

              {/* FAQ Items */}
              <div className="flex flex-col gap-6">
                {section.items.map((item, itemIndex) => {
                  const questionId = `${sectionIndex}-${itemIndex}`;
                  const isOpen = openItem === questionId;
                  
                  return (
                    <div
                      key={questionId}
                      className="border-l-3 border-transparent pl-5 transition-all duration-300 hover:border-blue-400"
                    >
                      <div
                        onClick={() => handleQuestionClick(questionId)}
                        className="text-xl font-semibold text-white mb-3 cursor-pointer flex items-center gap-3 group"
                      >
                        <span
                          className={`text-blue-400 transition-transform duration-300 text-sm ${
                            isOpen ? 'rotate-90' : ''
                          }`}
                        >
                          ▶
                        </span>
                        {item.question}
                      </div>
                      <div
                        className={`text-gray-300 leading-relaxed overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-[2000px] mb-3' : 'max-h-0'
                        }`}
                      >
                        {typeof item.answer === 'string' ? (
                          <p>{item.answer}</p>
                        ) : (
                          item.answer
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-300/5 rounded-2xl p-10 text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-gray-400 text-lg mb-6">
            Can't find what you're looking for? We're here to help with any questions about ProofPix, photo metadata, or privacy.
          </p>
          <button
            onClick={handleContactSupportClick}
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>© 2025 ProofPix. Built for professionals, by professionals.</p>
              <p>Privacy-respecting EXIF metadata tool - v1.6.0 • Open Source</p>
            </div>
            <nav className="flex space-x-6 text-sm">
              <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">Home</button>
              <span className="text-blue-400 font-medium">F.A.Q.</span>
              <button onClick={handleAboutClick} className="text-gray-400 hover:text-white">About</button>
              <button onClick={handlePrivacyClick} className="text-gray-400 hover:text-white">Privacy</button>
              <button onClick={handleTermsClick} className="text-gray-400 hover:text-white">Terms</button>
              <button onClick={handleSupportClick} className="text-gray-400 hover:text-white">Support</button>
            </nav>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes glow {
          from { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3)); }
          to { filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.5)); }
        }
        
        .border-l-3 {
          border-left-width: 3px;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
}; 