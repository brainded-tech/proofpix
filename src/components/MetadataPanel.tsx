import React, { useState } from 'react';
import { Camera, Map, Info, Settings, Calendar, Edit3, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { MetadataPanelProps } from '../types';
import { formatDateTime } from '../utils/formatters';
import { MetadataEditor } from './ExifEditor';
import { metadataManipulator } from '../utils/metadataManipulator';

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ metadata, originalFile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentMetadata, setCurrentMetadata] = useState(metadata);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    timestamp: true,
    camera: true,
    settings: false,
    location: false,
    technical: false
  });
  
  // Copy functionality state
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const handleSave = async (modifiedMetadata: any, removedFields: string[]) => {
    if (!originalFile) {
      alert('Original file not available for saving metadata.');
      return;
    }

    setIsProcessing(true);
    try {
      // Validate metadata first
      const validation = metadataManipulator.validateMetadata(modifiedMetadata);
      if (!validation.valid) {
        alert(`Validation errors:\n${validation.errors.join('\n')}`);
        setIsProcessing(false);
        return;
      }

      // Save metadata to file
      const result = await metadataManipulator.saveMetadataToFile(
        originalFile,
        modifiedMetadata,
        removedFields
      );

      if (result.success && result.downloadUrl && result.filename) {
        // Update current metadata
        setCurrentMetadata(modifiedMetadata);
        setIsEditing(false);
        
        // Auto-download the metadata file
        metadataManipulator.downloadFile(result.downloadUrl, result.filename);
        
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error saving metadata:', error);
      alert('Failed to save metadata. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async (modifiedMetadata: any, removedFields: string[]) => {
    setIsProcessing(true);
    try {
      // Show format selection dialog
      const format = prompt(
        'Select export format:\n1. JSON\n2. CSV\n\nEnter 1 or 2:',
        '1'
      );

      let exportFormat: 'json' | 'csv' = 'json';
      if (format === '2') {
        exportFormat = 'csv';
      }

      const result = await metadataManipulator.exportMetadata(
        modifiedMetadata,
        removedFields,
        exportFormat
      );

      if (result.success && result.downloadUrl && result.filename) {
        // Auto-download the export file
        metadataManipulator.downloadFile(result.downloadUrl, result.filename);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error exporting metadata:', error);
      alert('Failed to export metadata. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Copy metadata value to clipboard
  const handleCopyMetadata = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(`${key}: ${value}`);
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Reusable metadata row component
  const MetadataRow: React.FC<{ label: string; value: string; fieldKey: string }> = ({ label, value, fieldKey }) => (
    <div className="metadata-row flex justify-between items-center py-2 border-b border-gray-600 group">
      <span className="metadata-label text-sm font-medium text-gray-400">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="metadata-value text-sm text-gray-200 break-all">{value}</span>
        <button
          onClick={() => handleCopyMetadata(label, value)}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-all duration-200 touch-manipulation"
          title="Copy to clipboard"
        >
          {copiedField === fieldKey ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} />
          )}
        </button>
            </div>
            </div>
  );

  // Collapsible section component
  const CollapsibleSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    sectionKey: keyof typeof expandedSections;
    priority?: 'high' | 'medium' | 'low';
    children: React.ReactNode;
  }> = ({ title, icon, sectionKey, priority = 'medium', children }) => {
    const isExpanded = expandedSections[sectionKey];
    const priorityColors = {
      high: 'text-green-400',
      medium: 'text-blue-400', 
      low: 'text-gray-400'
    };

    return (
      <div className="metadata-section mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors touch-manipulation"
        >
          <div className="flex items-center space-x-2">
            <span className={priorityColors[priority]}>{icon}</span>
            <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </button>
        
        {isExpanded && (
          <div className="metadata-content mt-3 space-y-1 bg-gray-800/30 rounded-lg p-3">
            {children}
          </div>
        )}
        </div>
    );
  };

  return (
    <div className="metadata-panel bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Image Metadata</h2>
        <button
          onClick={() => setIsEditing(true)}
          disabled={isProcessing}
          className={`relative flex items-center space-x-2 px-3 py-2 text-white rounded transition-colors ${
            isProcessing 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title="Edit Metadata"
        >
          <Edit3 size={16} />
          <span>{isProcessing ? 'Processing...' : 'Edit'}</span>
          <span 
            className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full animate-pulse shadow-lg"
            style={{
              animation: 'pulse 2s infinite, glow 2s ease-in-out infinite alternate'
            }}
          >
            ✨ NEW
              </span>
        </button>
        </div>

      <div className="metadata-sections space-y-3">
        {/* Timestamp Section - High Priority */}
        <CollapsibleSection
          title="Key Information"
          icon={<Calendar size={16} />}
          sectionKey="timestamp"
          priority="high"
        >
          <MetadataRow 
            label="Date Taken" 
            value={currentMetadata.dateTime ? formatDateTime(currentMetadata.dateTime) : 'N/A'} 
            fieldKey="dateTime"
          />
          <MetadataRow 
            label="Last Modified" 
            value={currentMetadata.lastModified || 'N/A'} 
            fieldKey="lastModified"
          />
          <MetadataRow 
            label="File Name" 
            value={currentMetadata.fileName || 'N/A'} 
            fieldKey="fileName"
          />
          <MetadataRow 
            label="Dimensions" 
            value={currentMetadata.imageWidth && currentMetadata.imageHeight 
              ? `${currentMetadata.imageWidth} × ${currentMetadata.imageHeight}`
              : 'N/A'
            } 
            fieldKey="dimensions"
          />
        </CollapsibleSection>

        {/* Camera Details Section - High Priority */}
        <CollapsibleSection
          title="Camera Details"
          icon={<Camera size={16} />}
          sectionKey="camera"
          priority="high"
        >
          <MetadataRow 
            label="Camera Make" 
            value={currentMetadata.make || 'N/A'} 
            fieldKey="make"
          />
          <MetadataRow 
            label="Camera Model" 
            value={currentMetadata.model || 'N/A'} 
            fieldKey="model"
          />
          <MetadataRow 
            label="Lens" 
            value={currentMetadata.lens || 'N/A'} 
            fieldKey="lens"
          />
          <MetadataRow 
            label="Software" 
            value={currentMetadata.software || 'N/A'} 
            fieldKey="software"
          />
        </CollapsibleSection>

        {/* Camera Settings Section - Medium Priority */}
        <CollapsibleSection
          title="Camera Settings"
          icon={<Settings size={16} />}
          sectionKey="settings"
          priority="medium"
        >
          <MetadataRow 
            label="Exposure Time" 
            value={currentMetadata.exposureTime ? String(currentMetadata.exposureTime) : 'N/A'} 
            fieldKey="exposureTime"
          />
          <MetadataRow 
            label="F-Number" 
            value={currentMetadata.fNumber ? `f/${String(currentMetadata.fNumber)}` : 'N/A'} 
            fieldKey="fNumber"
          />
          <MetadataRow 
            label="ISO" 
            value={currentMetadata.iso ? String(currentMetadata.iso) : 'N/A'} 
            fieldKey="iso"
          />
          <MetadataRow 
            label="Focal Length" 
            value={currentMetadata.focalLength ? String(currentMetadata.focalLength) : 'N/A'} 
            fieldKey="focalLength"
          />
        </CollapsibleSection>

        {/* Location Data Section - Medium Priority */}
        {hasGpsData && (
          <CollapsibleSection
            title="Location Data"
            icon={<Map size={16} />}
            sectionKey="location"
            priority="medium"
          >
            <MetadataRow 
              label="Latitude" 
              value={formatGpsCoordinate(currentMetadata.gpsLatitude, 'lat')} 
              fieldKey="gpsLatitude"
            />
            <MetadataRow 
              label="Longitude" 
              value={formatGpsCoordinate(currentMetadata.gpsLongitude, 'long')} 
              fieldKey="gpsLongitude"
            />
            <MetadataRow 
              label="Altitude" 
              value={currentMetadata.gpsAltitude ? `${currentMetadata.gpsAltitude}m` : 'N/A'} 
              fieldKey="gpsAltitude"
            />
              {getGoogleMapsUrl() && (
              <div className="mt-3 pt-2 border-t border-gray-600">
                <a 
                  href={getGoogleMapsUrl()!} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  <Map size={14} className="mr-1" />
                  View on Google Maps
                </a>
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* Technical Details Section - Low Priority */}
        <CollapsibleSection
          title="Technical Details"
          icon={<Info size={16} />}
          sectionKey="technical"
          priority="low"
        >
          <MetadataRow 
            label="File Size" 
            value={currentMetadata.fileSize || 'N/A'} 
            fieldKey="fileSize"
          />
          <MetadataRow 
            label="File Type" 
            value={currentMetadata.fileType || 'N/A'} 
            fieldKey="fileType"
          />
          <MetadataRow 
            label="Color Space" 
            value={currentMetadata.colorSpace || 'N/A'} 
            fieldKey="colorSpace"
          />
          <MetadataRow 
            label="White Balance" 
            value={currentMetadata.whiteBalance || 'N/A'} 
            fieldKey="whiteBalance"
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}; 