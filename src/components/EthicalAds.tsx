import React from 'react';
import { Camera, Zap, Shield } from 'lucide-react';

interface AdProps {
  placement: 'header' | 'content' | 'sidebar' | 'bottom';
  className?: string;
}

interface AdContent {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  category: string;
  isSponsored?: boolean;
}

// Privacy-focused contextual ads (no user tracking)
const ethicalAds: AdContent[] = [
  {
    title: "Adobe Lightroom - Photo Organization",
    description: "Professional photo editing and metadata management for photographers",
    url: "https://adobe.com/products/lightroom",
    icon: <Camera className="h-5 w-5" />,
    category: "photography",
    isSponsored: true
  },
  {
    title: "ExifTool - Command Line Metadata",
    description: "Advanced EXIF editing and metadata manipulation for professionals",
    url: "https://exiftool.org",
    icon: <Zap className="h-5 w-5" />,
    category: "tools"
  },
  {
    title: "Photography Privacy Guide",
    description: "Learn how to protect your location data in photos you share online",
    url: "#privacy",
    icon: <Shield className="h-5 w-5" />,
    category: "education"
  }
];

export const EthicalAd: React.FC<AdProps> = ({ placement, className = '' }) => {
  // Select ad based on placement
  const getAdForPlacement = (placement: string): AdContent => {
    switch (placement) {
      case 'header':
        return ethicalAds[0]; // Photography tools
      case 'content':
        return ethicalAds[1]; // Technical tools
      case 'bottom':
        return ethicalAds[2]; // Educational content
      default:
        return ethicalAds[0];
    }
  };

  const ad = getAdForPlacement(placement);

  // Different layouts for different placements
  const renderHeaderAd = () => (
    <div className={`bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            {ad.icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{ad.title}</h3>
            <p className="text-blue-200 text-xs">{ad.description}</p>
          </div>
        </div>
        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          Learn More
        </a>
      </div>
      {ad.isSponsored && (
        <div className="text-xs text-blue-300 mt-2">
          Sponsored • Privacy-friendly ad
        </div>
      )}
    </div>
  );

  const renderContentAd = () => (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
      <div className="text-center">
        <div className="bg-gray-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
          {ad.icon}
        </div>
        <h3 className="text-white font-semibold mb-2">{ad.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{ad.description}</p>
        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md text-sm transition-colors"
        >
          Explore Tool
        </a>
        {ad.isSponsored && (
          <div className="text-xs text-gray-500 mt-3">
            Sponsored content
          </div>
        )}
      </div>
    </div>
  );

  const renderBottomAd = () => (
    <div className={`bg-gradient-to-r from-purple-900 to-purple-800 border border-purple-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="bg-purple-600 p-2 rounded-lg flex-shrink-0">
          {ad.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{ad.title}</h3>
          <p className="text-purple-200 text-sm mb-3">{ad.description}</p>
          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            Read More
          </a>
        </div>
      </div>
      {ad.isSponsored && (
        <div className="text-xs text-purple-300 mt-2">
          Educational content • No tracking
        </div>
      )}
    </div>
  );

  // Render based on placement
  switch (placement) {
    case 'header':
      return renderHeaderAd();
    case 'content':
      return renderContentAd();
    case 'bottom':
      return renderBottomAd();
    default:
      return renderContentAd();
  }
};

// Grid component for multiple ads
export const EthicalAdGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {ethicalAds.map((ad, index) => (
        <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="text-center">
            <div className="bg-gray-700 p-3 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
              {ad.icon}
            </div>
            <h4 className="text-white font-medium mb-2 text-sm">{ad.title}</h4>
            <p className="text-gray-400 text-xs mb-3">{ad.description}</p>
            <a
              href={ad.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              Learn More
            </a>
          </div>
          {ad.isSponsored && (
            <div className="text-xs text-gray-500 text-center mt-2">
              Sponsored
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EthicalAd; 