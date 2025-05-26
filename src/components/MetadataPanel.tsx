import React, { useState } from 'react';
import { Camera, Map, Info, Settings, Calendar, Edit3 } from 'lucide-react';
import { MetadataPanelProps } from '../types';
import { formatDateTime } from '../utils/formatters';
import { MetadataEditor } from './ExifEditor';

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ metadata }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentMetadata, setCurrentMetadata] = useState(metadata);

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

  const handleSave = (modifiedMetadata: any, removedFields: string[]) => {
    setCurrentMetadata(modifiedMetadata);
    setIsEditing(false);
    // TODO: Implement actual metadata saving to file
    console.log('Saving metadata:', modifiedMetadata, 'Removed fields:', removedFields);
  };

  const handleExport = (modifiedMetadata: any, removedFields: string[]) => {
    // TODO: Implement metadata export functionality
    console.log('Exporting with metadata:', modifiedMetadata, 'Removed fields:', removedFields);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <MetadataEditor
        metadata={currentMetadata}
        onSave={handleSave}
        onCancel={handleCancel}
        onExport={handleExport}
      />
    );
  }

  const hasGpsData = currentMetadata.gpsLatitude !== undefined && currentMetadata.gpsLongitude !== undefined;
  
  const getGoogleMapsUrl = () => {
    if (!hasGpsData) return null;
    return `https://www.google.com/maps?q=${currentMetadata.gpsLatitude},${currentMetadata.gpsLongitude}`;
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Image Metadata</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          title="Edit Metadata"
        >
          <Edit3 size={16} />
          <span>Edit</span>
        </button>
      </div>
      
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
                {currentMetadata.dateTime ? formatDateTime(currentMetadata.dateTime) : 'N/A'}
              </span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Last Modified</span>
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.lastModified || 'N/A'}</span>
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
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.make || 'N/A'}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Camera Model</span>
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.model || 'N/A'}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Lens</span>
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.lens || 'N/A'}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Software</span>
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.software || 'N/A'}</span>
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
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.exposureTime || 'N/A'}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">F-Number</span>
              <span className="metadata-value text-sm text-gray-200">
                {currentMetadata.fNumber ? `f/${currentMetadata.fNumber}` : 'N/A'}
              </span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">ISO</span>
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.iso || 'N/A'}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Focal Length</span>
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.focalLength || 'N/A'}</span>
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
                {formatGpsCoordinate(currentMetadata.gpsLatitude, 'lat')}
              </span>
            </div>
              <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
                <span className="metadata-label text-sm font-medium text-gray-400">Longitude</span>
                <span className="metadata-value text-sm text-gray-200">
                {formatGpsCoordinate(currentMetadata.gpsLongitude, 'long')}
              </span>
            </div>
              <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
                <span className="metadata-label text-sm font-medium text-gray-400">Altitude</span>
                <span className="metadata-value text-sm text-gray-200">
                  {currentMetadata.gpsAltitude ? `${currentMetadata.gpsAltitude}m` : 'N/A'}
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
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.fileName}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">File Size</span>
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.fileSize}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">File Type</span>
              <span className="metadata-value text-sm text-gray-200">{currentMetadata.fileType}</span>
            </div>
            <div className="metadata-row flex justify-between py-2 border-b border-gray-600">
              <span className="metadata-label text-sm font-medium text-gray-400">Dimensions</span>
              <span className="metadata-value text-sm text-gray-200">
                {currentMetadata.imageWidth && currentMetadata.imageHeight 
                  ? `${currentMetadata.imageWidth} × ${currentMetadata.imageHeight}`
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