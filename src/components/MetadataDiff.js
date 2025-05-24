// 3. Create components/MetadataDiff.js - Detailed metadata comparison

import React, { useState, useMemo, memo } from 'react';
import * as LucideIcons from 'lucide-react';
import { formatExifValue } from '../utils/exifUtils';

const MetadataDiff = memo(({ 
  exifA, 
  exifB, 
  imageA, 
  imageB, 
  comparisonResults, 
  showAdvanced, 
  setShowAdvanced 
}) => {
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'different', 'same'
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    camera: true,
    settings: true,
    location: true,
    datetime: true,
    technical: false,
    file: false
  });
  
  // Organize metadata into logical sections
  const organizedData = useMemo(() => {
    const sections = {
      camera: {
        title: 'Camera Information',
        icon: LucideIcons.Camera,
        fields: {
          make: 'Camera Make',
          model: 'Camera Model',
          software: 'Software',
          lensModel: 'Lens Model',
          serialNumber: 'Serial Number'
        }
      },
      settings: {
        title: 'Camera Settings',
        icon: LucideIcons.Settings,
        fields: {
          fNumber: 'Aperture',
          exposureTime: 'Shutter Speed',
          iso: 'ISO',
          focalLength: 'Focal Length',
          focalLengthIn35mmFormat: '35mm Equivalent',
          flash: 'Flash',
          whiteBalance: 'White Balance',
          meteringMode: 'Metering Mode'
        }
      },
      datetime: {
        title: 'Date & Time',
        icon: LucideIcons.Calendar,
        fields: {
          dateTimeOriginal: 'Date Taken',
          dateTime: 'Date Modified',
          dateTimeDigitized: 'Date Digitized'
        }
      },
      location: {
        title: 'GPS Location',
        icon: LucideIcons.MapPin,
        fields: {
          gpsLatitude: 'Latitude',
          gpsLongitude: 'Longitude',
          gpsAltitude: 'Altitude',
          gpsImgDirection: 'Direction'
        }
      },
      technical: {
        title: 'Technical Details',
        icon: LucideIcons.Info,
        fields: {
          orientation: 'Orientation',
          xResolution: 'X Resolution',
          yResolution: 'Y Resolution',
          resolutionUnit: 'Resolution Unit',
          colorSpace: 'Color Space',
          contrast: 'Contrast',
          saturation: 'Saturation',
          sharpness: 'Sharpness'
        }
      },
      file: {
        title: 'File Information',
        icon: LucideIcons.File,
        fields: {
          fileName: 'File Name',
          fileSize: 'File Size',
          fileType: 'File Type',
          lastModified: 'Last Modified'
        }
      }
    };
    
    // Add file info to the comparison
    const enrichedExifA = {
      ...exifA,
      fileName: imageA.name,
      fileSize: imageA.size,
      fileType: imageA.type,
      lastModified: new Date(imageA.lastModified).toISOString()
    };
    
    const enrichedExifB = {
      ...exifB,
      fileName: imageB.name,
      fileSize: imageB.size,
      fileType: imageB.type,
      lastModified: new Date(imageB.lastModified).toISOString()
    };
    
    // Process each section
    const processedSections = {};
    
    Object.entries(sections).forEach(([sectionKey, section]) => {
      const fields = [];
      
      Object.entries(section.fields).forEach(([fieldKey, fieldLabel]) => {
        const valueA = enrichedExifA[fieldKey];
        const valueB = enrichedExifB[fieldKey];
        
        // Skip if both values are missing
        if (!valueA && !valueB) return;
        
        const formattedA = formatFieldValue(fieldKey, valueA);
        const formattedB = formatFieldValue(fieldKey, valueB);
        const isDifferent = formattedA !== formattedB;
        
        fields.push({
          key: fieldKey,
          label: fieldLabel,
          valueA: formattedA,
          valueB: formattedB,
          rawA: valueA,
          rawB: valueB,
          isDifferent,
          importance: getFieldImportance(fieldKey)
        });
      });
      
      if (fields.length > 0) {
        processedSections[sectionKey] = {
          ...section,
          fields: fields.sort((a, b) => b.importance - a.importance),
          hasChanges: fields.some(f => f.isDifferent),
          changeCount: fields.filter(f => f.isDifferent).length
        };
      }
    });
    
    return processedSections;
  }, [exifA, exifB, imageA, imageB]);
  
  // Filter fields based on mode and search
  const filteredSections = useMemo(() => {
    const filtered = {};
    
    Object.entries(organizedData).forEach(([sectionKey, section]) => {
      const filteredFields = section.fields.filter(field => {
        // Filter by mode
        if (filterMode === 'different' && !field.isDifferent) return false;
        if (filterMode === 'same' && field.isDifferent) return false;
        
        // Filter by search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesLabel = field.label.toLowerCase().includes(searchLower);
          const matchesValueA = field.valueA.toLowerCase().includes(searchLower);
          const matchesValueB = field.valueB.toLowerCase().includes(searchLower);
          
          if (!matchesLabel && !matchesValueA && !matchesValueB) return false;
        }
        
        return true;
      });
      
      if (filteredFields.length > 0) {
        filtered[sectionKey] = {
          ...section,
          fields: filteredFields
        };
      }
    });
    
    return filtered;
  }, [organizedData, filterMode, searchTerm]);
  
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  
  const totalDifferences = Object.values(organizedData).reduce(
    (sum, section) => sum + section.changeCount, 0
  );
  
  const totalFields = Object.values(organizedData).reduce(
    (sum, section) => sum + section.fields.length, 0
  );
  
  return (
    <div className="metadata-diff">
      {/* Header */}
      <div className="diff-header">
        <div className="header-info">
          <h3>Metadata Comparison</h3>
          <div className="stats">
            <span className="stat">
              <LucideIcons.FileText size={14} />
              {totalFields} fields compared
            </span>
            <span className="stat different">
              <LucideIcons.AlertTriangle size={14} />
              {totalDifferences} differences found
            </span>
            <span className="stat similar">
              <LucideIcons.CheckCircle size={14} />
              {Math.round(comparisonResults.summary.similarity * 100)}% similar
            </span>
          </div>
        </div>
        
        <div className="header-controls">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`advanced-toggle ${showAdvanced ? 'active' : ''}`}
          >
            <LucideIcons.Settings size={16} />
            Advanced View
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="diff-filters">
        <div className="filter-group">
          <label>Show:</label>
          <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
            <option value="all">All Fields</option>
            <option value="different">Differences Only</option>
            <option value="same">Matches Only</option>
          </select>
        </div>
        
        <div className="search-group">
          <LucideIcons.Search size={16} />
          <input
            type="text"
            placeholder="Search metadata..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="clear-search">
              <LucideIcons.X size={14} />
            </button>
          )}
        </div>
      </div>
      
      {/* Quick Insights */}
      {!searchTerm && filterMode === 'all' && (
        <div className="quick-insights">
          <h4>🔍 Quick Insights:</h4>
          <div className="insights-grid">
            <div className={`insight ${comparisonResults.camera.sameMake && comparisonResults.camera.sameModel ? 'positive' : 'neutral'}`}>
              <LucideIcons.Camera size={16} />
              <span>
                {comparisonResults.camera.sameMake && comparisonResults.camera.sameModel 
                  ? 'Same camera model' 
                  : comparisonResults.camera.sameMake 
                    ? 'Same brand, different model'
                    : 'Different cameras'}
              </span>
            </div>
            
            {comparisonResults.gps.bothHaveGPS && (
              <div className={`insight ${comparisonResults.gps.distance < 1 ? 'positive' : 'neutral'}`}>
                <LucideIcons.MapPin size={16} />
                <span>
                  {comparisonResults.gps.distance < 0.1 
                    ? 'Taken at same location'
                    : `${comparisonResults.gps.distance.toFixed(2)}km apart`}
                </span>
              </div>
            )}
            
            <div className={`insight ${comparisonResults.camera.sameSettings ? 'positive' : 'neutral'}`}>
              <LucideIcons.Settings size={16} />
              <span>
                {comparisonResults.camera.sameSettings 
                  ? 'Identical camera settings'
                  : 'Different camera settings'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Metadata Sections */}
      <div className="diff-sections">
        {Object.entries(filteredSections).map(([sectionKey, section]) => (
          <div key={sectionKey} className={`diff-section ${expandedSections[sectionKey] ? 'expanded' : ''}`}>
            <div 
              className="section-header"
              onClick={() => toggleSection(sectionKey)}
            >
              <div className="section-title">
                <section.icon size={18} />
                <span>{section.title}</span>
                {section.hasChanges && (
                  <span className="change-count">{section.changeCount} changes</span>
                )}
              </div>
              
              <LucideIcons.ChevronDown 
                size={16} 
                className={`expand-icon ${expandedSections[sectionKey] ? 'expanded' : ''}`}
              />
            </div>
            
            {expandedSections[sectionKey] && (
              <div className="section-content">
                <div className="diff-table">
                  <div className="diff-table-header">
                    <div className="field-column">Field</div>
                    <div className="value-column">Image A</div>
                    <div className="value-column">Image B</div>
                    <div className="status-column">Status</div>
                  </div>
                  
                  {section.fields.map((field) => (
                    <div 
                      key={field.key} 
                      className={`diff-row ${field.isDifferent ? 'different' : 'same'}`}
                    >
                      <div className="field-column">
                        <span className="field-label">{field.label}</span>
                        {showAdvanced && (
                          <span className="field-key">{field.key}</span>
                        )}
                      </div>
                      
                      <div className="value-column value-a">
                        <span className="value-text">{field.valueA || '—'}</span>
                        {showAdvanced && field.rawA && (
                          <span className="raw-value">{JSON.stringify(field.rawA)}</span>
                        )}
                      </div>
                      
                      <div className="value-column value-b">
                        <span className="value-text">{field.valueB || '—'}</span>
                        {showAdvanced && field.rawB && (
                          <span className="raw-value">{JSON.stringify(field.rawB)}</span>
                        )}
                      </div>
                      
                      <div className="status-column">
                        {field.isDifferent ? (
                          <span className="status different">
                            <LucideIcons.AlertTriangle size={14} />
                            Different
                          </span>
                        ) : (
                          <span className="status same">
                            <LucideIcons.Check size={14} />
                            Match
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {Object.keys(filteredSections).length === 0 && (
        <div className="no-results">
          <LucideIcons.Search size={48} />
          <h4>No matching fields found</h4>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
});

// Helper Functions
const formatFieldValue = (fieldKey, value) => {
  if (!value && value !== 0) return '—';
  
  switch (fieldKey) {
    case 'fileSize':
      return `${(value / 1024).toFixed(1)} KB`;
    case 'lastModified':
    case 'dateTime':
    case 'dateTimeOriginal':
    case 'dateTimeDigitized':
      return new Date(value).toLocaleString();
    case 'gpsLatitude':
    case 'gpsLongitude':
      return Array.isArray(value) ? `${value[0]}°${value[1]}'${value[2]}"` : String(value);
    case 'gpsAltitude':
      return `${value}m`;
    default:
      return formatExifValue(fieldKey, value);
  }
};

const getFieldImportance = (fieldKey) => {
  const importanceMap = {
    // High importance
    make: 10,
    model: 10,
    dateTimeOriginal: 10,
    gpsLatitude: 9,
    gpsLongitude: 9,
    
    // Medium importance
    fNumber: 8,
    exposureTime: 8,
    iso: 8,
    focalLength: 8,
    fileName: 7,
    fileSize: 7,
    
    // Low importance
    software: 5,
    orientation: 4,
    xResolution: 3,
    yResolution: 3,
    
    // Default
    default: 6
  };
  
  return importanceMap[fieldKey] || importanceMap.default;
};

MetadataDiff.displayName = 'MetadataDiff';
export default MetadataDiff;