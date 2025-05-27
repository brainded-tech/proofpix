import React from 'react';
import { Palette } from 'lucide-react';

export const BrandColorPicker: React.FC<{ onColorsChange: (colors: any) => void }> = ({ onColorsChange }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <Palette className="h-6 w-6 text-purple-400 mr-3" />
        <h2 className="text-xl font-bold text-white">Brand Color Palette</h2>
      </div>
      <p className="text-gray-300">Color picker functionality coming soon...</p>
    </div>
  );
};
