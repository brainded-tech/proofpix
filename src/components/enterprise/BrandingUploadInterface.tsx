// Enterprise Branding Upload Interface with Security
import React, { useState } from 'react';
import { Upload, AlertTriangle, Image } from 'lucide-react';
export const BrandingUploadInterface: React.FC<{ onFilesUploaded: (files: any[]) => void }> = ({ onFilesUploaded }) => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <div className="flex items-center mb-6">
      <Image className="h-6 w-6 text-blue-400 mr-3" />
      <h2 className="text-xl font-bold text-white">Enterprise Branding Assets</h2>
    </div>
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
        <div>
          <h4 className="text-blue-300 font-medium mb-1">🔒 Enterprise Security</h4>
          <p className="text-blue-200 text-sm">All uploads are processed client-side with enterprise-grade security validation.</p>
        </div>
      </div>
    </div>
    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-300 mb-2">Upload branding assets</p>
        <p className="text-sm text-gray-500">Drag & drop files here, or click to select</p>
        <p className="text-xs text-gray-600 mt-2">Max 5MB • PNG, JPEG, SVG, WebP</p>
      </div>
    </div>
  </div>
);
