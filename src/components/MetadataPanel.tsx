import React, { useState } from 'react';
import { 
  Camera, 
  Map, 
  Info, 
  Settings, 
  Calendar, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Download,
  FileText,
  FileDown,
  FileJson,
  ExternalLink,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  Sparkles,
  Clock,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { MetadataPanelProps } from '../types';
import { formatDateTime } from '../utils/formatters';
import { MetadataEditor } from './ExifEditor';
import { metadataManipulator } from '../utils/metadataManipulator';

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ metadata, originalFile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentMetadata, setCurrentMetadata] = useState(metadata);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    camera: true,
    settings: false,
    location: false,
    technical: false,
    privacy: true
  });
  
  // Copy functionality state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!metadata) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
        <div className="text-center">
          <ImageIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">No Metadata Available</h3>
          <p className="text-slate-400">Upload an image to view its metadata analysis</p>
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
      const validation = metadataManipulator.validateMetadata(modifiedMetadata);
      if (!validation.valid) {
        alert(`Validation errors:\n${validation.errors.join('\n')}`);
        setIsProcessing(false);
        return;
      }

      const result = await metadataManipulator.saveMetadataToFile(
        originalFile,
        modifiedMetadata,
        removedFields
      );

      if (result.success && result.downloadUrl && result.filename) {
        setCurrentMetadata(modifiedMetadata);
        setIsEditing(false);
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

  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    setIsProcessing(true);
    try {
      if (format === 'pdf') {
        // Handle PDF export separately using existing PDF generation
        if (originalFile) {
          const { generatePDF } = await import('../utils/pdfUtils');
          const processedImage = {
            file: originalFile,
            metadata: currentMetadata,
            previewUrl: URL.createObjectURL(originalFile),
            timestampedUrl: undefined
          };
          
          const pdfBlob = await generatePDF(processedImage, false);
          const url = URL.createObjectURL(pdfBlob);
          const filename = `${currentMetadata.fileName || 'metadata'}_report.pdf`;
          
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          alert('PDF report exported successfully!');
        } else {
          alert('Original file not available for PDF export.');
        }
      } else {
        // Handle JSON and CSV exports
        const result = await metadataManipulator.exportMetadata(
          currentMetadata,
          [],
          format as 'json' | 'csv'
        );

        if (result.success && result.downloadUrl && result.filename) {
          metadataManipulator.downloadFile(result.downloadUrl, result.filename);
          alert(result.message);
        } else {
          alert(result.message);
        }
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
        onExport={(modifiedMetadata, removedFields) => {
          // Handle export from editor
          handleExport('json');
        }}
      />
    );
  }

  const hasGpsData = currentMetadata.gpsLatitude !== undefined && currentMetadata.gpsLongitude !== undefined;
  const hasCameraData = currentMetadata.make || currentMetadata.model;
  const hasSettingsData = currentMetadata.exposureTime || currentMetadata.fNumber || currentMetadata.iso;
  
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

  // Privacy risk assessment
  const getPrivacyRisk = () => {
    let riskLevel = 'LOW';
    let risks = [];
    
    if (hasGpsData) {
      risks.push('Location data present');
      riskLevel = 'HIGH';
    }
    if (currentMetadata.dateTime) {
      risks.push('Timestamp information');
      if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
    }
    if (hasCameraData) {
      risks.push('Device information');
      if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
    }
    
    return { level: riskLevel, risks };
  };

  const privacyRisk = getPrivacyRisk();

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
  const MetadataRow: React.FC<{ 
    label: string; 
    value: string; 
    fieldKey: string;
    sensitive?: boolean;
    icon?: React.ReactNode;
  }> = ({ label, value, fieldKey, sensitive = false, icon }) => {
    const shouldHide = sensitive && !showSensitiveData;
    const displayValue = shouldHide ? '••••••••' : value;
    
    return (
      <div className="flex justify-between items-center py-3 px-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          <span className="text-sm font-medium text-slate-300">{label}</span>
          {sensitive && (
            <span title="Sensitive data">
              <Shield className="h-3 w-3 text-amber-400" />
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-100 font-mono break-all max-w-xs text-right">
            {displayValue}
          </span>
          <button
            onClick={() => handleCopyMetadata(label, value)}
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition-all duration-200"
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
  };

  // Collapsible section component
  const CollapsibleSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    sectionKey: keyof typeof expandedSections;
    priority?: 'high' | 'medium' | 'low';
    badge?: string;
    children: React.ReactNode;
  }> = ({ title, icon, sectionKey, priority = 'medium', badge, children }) => {
    const isExpanded = expandedSections[sectionKey];
    const priorityColors = {
      high: 'text-emerald-400 bg-emerald-400/10',
      medium: 'text-blue-400 bg-blue-400/10', 
      low: 'text-slate-400 bg-slate-400/10'
    };

    return (
      <div className="mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-slate-600/30"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${priorityColors[priority]}`}>
              {icon}
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
              {badge && (
                <span className="text-xs text-slate-400 bg-slate-600/50 px-2 py-1 rounded-full mt-1 inline-block">
                  {badge}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {badge && (
              <span className="text-xs font-medium text-slate-300 bg-slate-600/50 px-2 py-1 rounded-full">
                {badge}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </div>
        </button>
        
        {isExpanded && (
          <div className="mt-3 space-y-2 bg-slate-800/30 rounded-xl p-4 border border-slate-600/20">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">Metadata Analysis</h2>
          <p className="text-slate-400 text-sm">
            {currentMetadata.fileName || 'Unknown file'} • {privacyRisk.level} Privacy Risk
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Privacy Toggle */}
          <button
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showSensitiveData 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
            }`}
            title={showSensitiveData ? 'Hide sensitive data' : 'Show sensitive data'}
          >
            {showSensitiveData ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{showSensitiveData ? 'Hide' : 'Show'} Sensitive</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <Download size={16} />
              <span>Export</span>
              <ChevronDown size={14} />
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleExport('json')}
                  disabled={isProcessing}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-slate-200 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
                >
                  <FileJson size={16} className="text-purple-400" />
                  <span>Export as JSON</span>
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isProcessing}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-slate-200 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
                >
                  <FileText size={16} className="text-green-400" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isProcessing}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-slate-200 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
                >
                  <FileDown size={16} className="text-red-400" />
                  <span>Export as PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            disabled={isProcessing}
            className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isProcessing 
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="Edit Metadata"
          >
            <Edit3 size={16} />
            <span>{isProcessing ? 'Processing...' : 'Edit'}</span>
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full animate-pulse">
              ✨
            </span>
          </button>
        </div>
      </div>

      {/* Privacy Risk Alert */}
      {privacyRisk.level !== 'LOW' && (
        <div className={`p-4 rounded-xl border ${
          privacyRisk.level === 'HIGH' 
            ? 'bg-red-500/10 border-red-500/30 text-red-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-start space-x-3">
            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">
                {privacyRisk.level} Privacy Risk Detected
              </h4>
              <p className="text-sm opacity-90 mb-2">
                This image contains potentially sensitive information:
              </p>
              <ul className="text-sm space-y-1">
                {privacyRisk.risks.map((risk, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Sections */}
      <div className="space-y-4">
        {/* Overview Section */}
        <CollapsibleSection
          title="File Overview"
          icon={<Info size={20} />}
          sectionKey="overview"
          priority="high"
          badge={`${Object.keys(currentMetadata).length} fields`}
        >
          <MetadataRow 
            label="File Name" 
            value={currentMetadata.fileName || 'N/A'} 
            fieldKey="fileName"
            icon={<FileText size={14} />}
          />
          <MetadataRow 
            label="File Size" 
            value={currentMetadata.fileSize || 'N/A'} 
            fieldKey="fileSize"
            icon={<Zap size={14} />}
          />
          <MetadataRow 
            label="Dimensions" 
            value={currentMetadata.imageWidth && currentMetadata.imageHeight 
              ? `${currentMetadata.imageWidth} × ${currentMetadata.imageHeight} pixels`
              : 'N/A'
            } 
            fieldKey="dimensions"
            icon={<ImageIcon size={14} />}
          />
          <MetadataRow 
            label="Date Taken" 
            value={currentMetadata.dateTime ? formatDateTime(currentMetadata.dateTime) : 'N/A'} 
            fieldKey="dateTime"
            sensitive={true}
            icon={<Clock size={14} />}
          />
        </CollapsibleSection>

        {/* Camera Details Section */}
        {hasCameraData && (
          <CollapsibleSection
            title="Camera Information"
            icon={<Camera size={20} />}
            sectionKey="camera"
            priority="high"
            badge="Device Info"
          >
            <MetadataRow 
              label="Camera Make" 
              value={currentMetadata.make || 'N/A'} 
              fieldKey="make"
              sensitive={true}
            />
            <MetadataRow 
              label="Camera Model" 
              value={currentMetadata.model || 'N/A'} 
              fieldKey="model"
              sensitive={true}
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
              sensitive={true}
            />
          </CollapsibleSection>
        )}

        {/* Camera Settings Section */}
        {hasSettingsData && (
          <CollapsibleSection
            title="Camera Settings"
            icon={<Settings size={20} />}
            sectionKey="settings"
            priority="medium"
            badge="Technical"
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
              value={currentMetadata.focalLength ? `${String(currentMetadata.focalLength)}mm` : 'N/A'} 
              fieldKey="focalLength"
            />
          </CollapsibleSection>
        )}

        {/* Location Data Section */}
        {hasGpsData && (
          <CollapsibleSection
            title="Location Data"
            icon={<Map size={20} />}
            sectionKey="location"
            priority="high"
            badge="Sensitive"
          >
            <MetadataRow 
              label="Latitude" 
              value={formatGpsCoordinate(currentMetadata.gpsLatitude, 'lat')} 
              fieldKey="gpsLatitude"
              sensitive={true}
            />
            <MetadataRow 
              label="Longitude" 
              value={formatGpsCoordinate(currentMetadata.gpsLongitude, 'long')} 
              fieldKey="gpsLongitude"
              sensitive={true}
            />
            <MetadataRow 
              label="Altitude" 
              value={currentMetadata.gpsAltitude ? `${currentMetadata.gpsAltitude}m` : 'N/A'} 
              fieldKey="gpsAltitude"
              sensitive={true}
            />
            
            {getGoogleMapsUrl() && (
              <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                <a 
                  href={getGoogleMapsUrl()!} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>View Location on Google Maps</span>
                </a>
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* Technical Details Section */}
        <CollapsibleSection
          title="Technical Details"
          icon={<Sparkles size={20} />}
          sectionKey="technical"
          priority="low"
          badge="Advanced"
        >
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
          <MetadataRow 
            label="Orientation" 
            value={currentMetadata.orientation ? String(currentMetadata.orientation) : 'N/A'} 
            fieldKey="orientation"
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}; 