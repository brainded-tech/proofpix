import React from 'react';
import { Camera, Map, Info, Settings, Calendar } from 'lucide-react';
import { MetadataPanelProps } from '../types';
import { formatDateTime } from '../utils/formatters';

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ metadata }) => {
  if (!metadata) {
    return (
      <div className="metadata-panel bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-white">Image Metadata</h2>
        <div className="text-center py-8 text-gray-400">
          No metadata available
        </div>
      </div>
    );
  }

  const hasGpsData = metadata.gpsLatitude !== undefined && metadata.gpsLongitude !== undefined;
  
  const getGoogleMapsUrl = () => {
    if (!hasGpsData) return null;
    return `https://www.google.com/maps?q=${metadata.gpsLatitude},${metadata.gpsLongitude}`;
  };

  const formatGpsCoordinate = (value: number | undefined, type: 'lat' | 'long'): string => {
    if (value === undefined) return 'N/A';
    const direction = type === 'lat' 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W');
    return `${Math.abs(value).toFixed(6)}° ${direction}`;
  };

  return (
    <div className="metadata-panel bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Image Metadata</h2>
      
      <div className="metadata-sections space-y-6">
        {/* Timestamp Section */}
        <div className="metadata-section">
          <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
            <Calendar size={16} className="mr-2" /> 
            Timestamp
          </h3>
          <div className="metadata-content space-y-2">
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Date Taken</span>
              <span className="metadata-value text-sm text-gray-200">
                {metadata.dateTime ? formatDateTime(metadata.dateTime) : 'N/A'}
              </span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Last Modified</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.lastModified || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Camera Details Section */}
        <div className="metadata-section">
          <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
            <Camera size={16} className="mr-2" /> 
            Camera Details
          </h3>
          <div className="metadata-content space-y-2">
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Camera Make</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.make || 'N/A'}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Camera Model</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.model || 'N/A'}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Lens</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.lens || 'N/A'}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Software</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.software || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Camera Settings Section */}
        <div className="metadata-section">
          <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
            <Settings size={16} className="mr-2" /> 
            Camera Settings
          </h3>
          <div className="metadata-content space-y-2">
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Exposure Time</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.exposureTime || 'N/A'}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">F-Number</span>
              <span className="metadata-value text-sm text-gray-200">
                {metadata.fNumber ? `f/${metadata.fNumber}` : 'N/A'}
              </span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">ISO</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.iso || 'N/A'}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Focal Length</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.focalLength || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Location Data Section */}
        {hasGpsData && (
          <div className="metadata-section">
            <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
              <Map size={16} className="mr-2" /> 
              Location Data
            </h3>
            <div className="metadata-content space-y-2">
              <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
                <span className="metadata-label text-sm font-medium text-gray-400">Latitude</span>
                <span className="metadata-value text-sm text-gray-200">
                  {formatGpsCoordinate(metadata.gpsLatitude, 'lat')}
                </span>
              </div>
              <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
                <span className="metadata-label text-sm font-medium text-gray-400">Longitude</span>
                <span className="metadata-value text-sm text-gray-200">
                  {formatGpsCoordinate(metadata.gpsLongitude, 'long')}
                </span>
              </div>
              <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
                <span className="metadata-label text-sm font-medium text-gray-400">Altitude</span>
                <span className="metadata-value text-sm text-gray-200">
                  {metadata.gpsAltitude ? `${metadata.gpsAltitude}m` : 'N/A'}
                </span>
              </div>
              {getGoogleMapsUrl() && (
                <div className="mt-3">
                  <a 
                    href={getGoogleMapsUrl()!} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <Map size={14} className="mr-1" />
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* File Details Section */}
        <div className="metadata-section">
          <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">
            <Info size={16} className="mr-2" /> 
            File Details
          </h3>
          <div className="metadata-content space-y-2">
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">File Name</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.fileName}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">File Size</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.fileSize}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">File Type</span>
              <span className="metadata-value text-sm text-gray-200">{metadata.fileType}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Dimensions</span>
              <span className="metadata-value text-sm text-gray-200">
                {metadata.imageWidth && metadata.imageHeight 
                  ? `${metadata.imageWidth} × ${metadata.imageHeight}`
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 