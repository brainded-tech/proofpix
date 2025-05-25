import React from 'react';
import { Mail, Star, Zap } from 'lucide-react';

interface AdProps {
  placement: 'header' | 'content' | 'sidebar' | 'bottom';
  className?: string;
}

interface SponsorSlot {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  icon: React.ReactNode;
  isAvailable: boolean;
  price?: string;
}

// Sponsor slots - easily configurable for direct sales
const sponsorSlots: Record<string, SponsorSlot> = {
  header: {
    title: "Sponsor This Space",
    description: "Reach privacy-conscious developers and photographers using ProofPix",
    ctaText: "Get Details",
    ctaUrl: "mailto:sponsor@proofpixapp.com?subject=Header Sponsorship Inquiry",
    icon: <Star className="h-5 w-5" />,
    isAvailable: true,
    price: "$50/month"
  },
  content: {
    title: "Featured Tool Spotlight",
    description: "Showcase your developer tool or photography software to our engaged audience",
    ctaText: "Sponsor Here",
    ctaUrl: "mailto:sponsor@proofpixapp.com?subject=Content Sponsorship Inquiry",
    icon: <Zap className="h-5 w-5" />,
    isAvailable: true,
    price: "$75/month"
  },
  bottom: {
    title: "Educational Content Partner",
    description: "Share privacy or photography education with users who care about metadata",
    ctaText: "Partner With Us",
    ctaUrl: "mailto:sponsor@proofpixapp.com?subject=Educational Partnership Inquiry",
    icon: <Mail className="h-5 w-5" />,
    isAvailable: true,
    price: "$40/month"
  }
};

export const Sponsorship: React.FC<AdProps> = ({ placement, className = '' }) => {
  const slot = sponsorSlots[placement] || sponsorSlots.content;

  // If slot is not available (i.e., sold), don't render anything
  if (!slot.isAvailable) {
    return null;
  }

  const renderHeaderSlot = () => (
    <div className={`bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            {slot.icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{slot.title}</h3>
            <p className="text-gray-300 text-xs">{slot.description}</p>
            {slot.price && (
              <p className="text-blue-400 text-xs font-medium">{slot.price}</p>
            )}
          </div>
        </div>
        <a
          href={slot.ctaUrl}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          {slot.ctaText}
        </a>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Direct sponsorship • No tracking • Developer audience
      </div>
    </div>
  );

  const renderContentSlot = () => (
    <div className={`bg-gray-800 border border-gray-600 rounded-lg p-6 ${className}`}>
      <div className="text-center">
        <div className="bg-gray-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
          {slot.icon}
        </div>
        <h3 className="text-white font-semibold mb-2">{slot.title}</h3>
        <p className="text-gray-400 text-sm mb-2">{slot.description}</p>
        {slot.price && (
          <p className="text-blue-400 text-sm font-medium mb-4">{slot.price}</p>
        )}
        <a
          href={slot.ctaUrl}
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md text-sm transition-colors"
        >
          {slot.ctaText}
        </a>
        <div className="text-xs text-gray-500 mt-3">
          Premium placement • Engaged audience
        </div>
      </div>
    </div>
  );

  const renderBottomSlot = () => (
    <div className={`bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
          {slot.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{slot.title}</h3>
          <p className="text-gray-300 text-sm mb-2">{slot.description}</p>
          {slot.price && (
            <p className="text-blue-400 text-sm font-medium mb-3">{slot.price}</p>
          )}
          <a
            href={slot.ctaUrl}
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            {slot.ctaText}
          </a>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Educational focus • Privacy-conscious audience
      </div>
    </div>
  );

  // Render based on placement
  switch (placement) {
    case 'header':
      return renderHeaderSlot();
    case 'content':
      return renderContentSlot();
    case 'bottom':
      return renderBottomSlot();
    default:
      return renderContentSlot();
  }
};

// Grid component for sponsor opportunities
export const SponsorshipGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  const availableSlots = Object.entries(sponsorSlots).filter(([_, slot]) => slot.isAvailable);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {availableSlots.map(([placement, slot], index) => (
        <div key={placement} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
          <div className="text-center">
            <div className="bg-gray-700 p-3 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
              {slot.icon}
            </div>
            <h4 className="text-white font-medium mb-2 text-sm">{slot.title}</h4>
            <p className="text-gray-400 text-xs mb-2">{slot.description}</p>
            {slot.price && (
              <p className="text-blue-400 text-xs font-medium mb-3">{slot.price}</p>
            )}
            <a
              href={slot.ctaUrl}
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              {slot.ctaText}
            </a>
          </div>
          <div className="text-xs text-gray-500 text-center mt-2">
            {placement.charAt(0).toUpperCase() + placement.slice(1)} placement
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sponsorship; 