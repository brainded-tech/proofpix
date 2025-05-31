import React, { useState, useMemo } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Settings, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Shield, 
  Info,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface MetadataProps {
  metadata: {
    fileName: string;
    fileSize: number;
    fileType: string;
    lastModified: Date;
    exif?: {
      camera?: {
        make?: string;
        model?: string;
        software?: string;
      };
      settings?: {
        iso?: number;
        aperture?: string;
        shutterSpeed?: string;
        focalLength?: string;
        flash?: string;
      };
      location?: {
        latitude?: number;
        longitude?: number;
        altitude?: number;
      };
      timestamp?: {
        dateTime?: string;
        dateTimeOriginal?: string;
        dateTimeDigitized?: string;
      };
    };
    privacyAnalysis?: {
      overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
      risks: {
        gps?: { level: 'LOW' | 'MEDIUM' | 'HIGH'; description: string };
        device?: { level: 'LOW' | 'MEDIUM' | 'HIGH'; description: string };
        timestamp?: { level: 'LOW' | 'MEDIUM' | 'HIGH'; description: string };
      };
      recommendations: string[];
    };
  };
  onExport?: (format: 'json' | 'csv' | 'pdf') => void;
  onRemoveMetadata?: () => void;
  className?: string;
}

interface MetadataSection {
  title: string;
  icon: React.ReactNode;
  items: Array<{ label: string; value: string | number | null; sensitive?: boolean }>;
  collapsible?: boolean;
}

export const MetadataVisualization: React.FC<MetadataProps> = ({
  metadata,
  onExport,
  onRemoveMetadata,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'privacy']));
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(unitIndex > 0 ? 2 : 0)} ${units[unitIndex]}`;
  };

  const formatCoordinate = (coord: number, type: 'lat' | 'lng'): string => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(6)}° ${direction}`;
  };

  const getPrivacyRiskColor = (level: 'LOW' | 'MEDIUM' | 'HIGH'): string => {
    switch (level) {
      case 'LOW': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'HIGH': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
    }
  };

  const sections: MetadataSection[] = useMemo(() => [
    {
      title: 'Basic Information',
      icon: <Info className="h-5 w-5" />,
      items: [
        { label: 'File Name', value: metadata.fileName },
        { label: 'File Size', value: formatFileSize(metadata.fileSize) },
        { label: 'File Type', value: metadata.fileType },
        { label: 'Last Modified', value: metadata.lastModified.toLocaleString() }
      ]
    },
    {
      title: 'Camera Information',
      icon: <Camera className="h-5 w-5" />,
      collapsible: true,
      items: [
        { label: 'Make', value: metadata.exif?.camera?.make || null },
        { label: 'Model', value: metadata.exif?.camera?.model || null },
        { label: 'Software', value: metadata.exif?.camera?.software || null }
      ]
    },
    {
      title: 'Camera Settings',
      icon: <Settings className="h-5 w-5" />,
      collapsible: true,
      items: [
        { label: 'ISO', value: metadata.exif?.settings?.iso || null },
        { label: 'Aperture', value: metadata.exif?.settings?.aperture || null },
        { label: 'Shutter Speed', value: metadata.exif?.settings?.shutterSpeed || null },
        { label: 'Focal Length', value: metadata.exif?.settings?.focalLength || null },
        { label: 'Flash', value: metadata.exif?.settings?.flash || null }
      ]
    },
    {
      title: 'Location Data',
      icon: <MapPin className="h-5 w-5" />,
      collapsible: true,
      items: [
        { 
          label: 'Latitude', 
          value: metadata.exif?.location?.latitude ? formatCoordinate(metadata.exif.location.latitude, 'lat') : null,
          sensitive: true
        },
        { 
          label: 'Longitude', 
          value: metadata.exif?.location?.longitude ? formatCoordinate(metadata.exif.location.longitude, 'lng') : null,
          sensitive: true
        },
        { 
          label: 'Altitude', 
          value: metadata.exif?.location?.altitude ? `${metadata.exif.location.altitude}m` : null,
          sensitive: true
        }
      ]
    },
    {
      title: 'Timestamps',
      icon: <Calendar className="h-5 w-5" />,
      collapsible: true,
      items: [
        { label: 'Date/Time', value: metadata.exif?.timestamp?.dateTime || null },
        { label: 'Original Date/Time', value: metadata.exif?.timestamp?.dateTimeOriginal || null },
        { label: 'Digitized Date/Time', value: metadata.exif?.timestamp?.dateTimeDigitized || null }
      ]
    }
  ], [metadata]);

  const MetadataItem: React.FC<{ 
    label: string; 
    value: string | number | null; 
    sensitive?: boolean 
  }> = ({ label, value, sensitive = false }) => {
    if (!value) return null;

    const displayValue = sensitive && !showSensitiveData ? '••••••••' : value.toString();
    const fieldId = `${label}-${value}`;

    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">
            {displayValue}
          </span>
          {sensitive && (
            <button
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title={showSensitiveData ? 'Hide sensitive data' : 'Show sensitive data'}
            >
              {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={() => copyToClipboard(value.toString(), fieldId)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Copy to clipboard"
          >
            {copiedField === fieldId ? (
              <span className="text-green-500 text-xs">✓</span>
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Metadata Analysis
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSensitiveData(!showSensitiveData)}
              className={`
                px-3 py-1 rounded-md text-sm font-medium transition-colors
                ${showSensitiveData 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }
              `}
            >
              {showSensitiveData ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {showSensitiveData ? 'Hide' : 'Show'} Sensitive
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Analysis */}
      {metadata.privacyAnalysis && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Privacy Analysis
            </h4>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPrivacyRiskColor(metadata.privacyAnalysis.overallRisk)}`}>
              {metadata.privacyAnalysis.overallRisk} RISK
            </span>
          </div>

          {/* Risk Details */}
          <div className="space-y-3 mb-4">
            {Object.entries(metadata.privacyAnalysis.risks).map(([riskType, risk]) => (
              <div key={riskType} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {riskType} Data
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {risk.description}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPrivacyRiskColor(risk.level)}`}>
                  {risk.level}
                </span>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          {metadata.privacyAnalysis.recommendations.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Recommendations
              </h5>
              <ul className="space-y-1">
                {metadata.privacyAnalysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-blue-800 dark:text-blue-200 flex items-start">
                    <span className="mr-2">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Metadata Sections */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sections.map((section, index) => {
          const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
          const isExpanded = expandedSections.has(sectionId);
          const hasData = section.items.some(item => item.value !== null);

          if (!hasData) return null;

          return (
            <div key={index} className="p-6">
              <button
                onClick={() => section.collapsible && toggleSection(sectionId)}
                className={`
                  w-full flex items-center justify-between text-left
                  ${section.collapsible ? 'hover:text-blue-600 dark:hover:text-blue-400' : ''}
                `}
                disabled={!section.collapsible}
              >
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  {section.icon}
                  <span className="ml-2">{section.title}</span>
                </h4>
                {section.collapsible && (
                  isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
                )}
              </button>

              {(!section.collapsible || isExpanded) && (
                <div className="mt-4 space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <MetadataItem
                      key={itemIndex}
                      label={item.label}
                      value={item.value}
                      sensitive={item.sensitive}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Export as:</span>
            <button
              onClick={() => onExport?.('json')}
              className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-md text-sm hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
            >
              JSON
            </button>
            <button
              onClick={() => onExport?.('csv')}
              className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-md text-sm hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
            >
              CSV
            </button>
            <button
              onClick={() => onExport?.('pdf')}
              className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 rounded-md text-sm hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
            >
              PDF
            </button>
          </div>

          {onRemoveMetadata && (
            <button
              onClick={onRemoveMetadata}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors flex items-center"
            >
              <Shield className="h-4 w-4 mr-2" />
              Remove Metadata
            </button>
          )}
        </div>

        {/* Location Map Link */}
        {metadata.exif?.location?.latitude && metadata.exif?.location?.longitude && showSensitiveData && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <a
              href={`https://www.google.com/maps?q=${metadata.exif.location.latitude},${metadata.exif.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <MapPin className="h-4 w-4 mr-1" />
              View location on map
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}; 