import React, { useState, useCallback, useMemo } from 'react';
import { Search, Filter, X, Calendar, MapPin, Camera, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { ProcessedImage } from '../types';

interface FilterCriteria {
  searchTerm: string;
  dateRange: {
    start: string;
    end: string;
  };
  location: {
    hasGPS: boolean | null;
  };
  camera: {
    make: string;
    model: string;
    lens: string;
  };
  technical: {
    minWidth: number | null;
    maxWidth: number | null;
    minHeight: number | null;
    maxHeight: number | null;
    orientation: string;
    colorSpace: string;
  };
  fileInfo: {
    format: string;
    minSize: number | null;
    maxSize: number | null;
  };
}

interface AdvancedFilterProps {
  images: ProcessedImage[];
  onFilteredResults: (filteredImages: ProcessedImage[]) => void;
  onClearFilters: () => void;
}

const defaultFilters: FilterCriteria = {
  searchTerm: '',
  dateRange: {
    start: '',
    end: ''
  },
  location: {
    hasGPS: null
  },
  camera: {
    make: '',
    model: '',
    lens: ''
  },
  technical: {
    minWidth: null,
    maxWidth: null,
    minHeight: null,
    maxHeight: null,
    orientation: '',
    colorSpace: ''
  },
  fileInfo: {
    format: '',
    minSize: null,
    maxSize: null
  }
};

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  images,
  onFilteredResults,
  onClearFilters
}) => {
  const [filters, setFilters] = useState<FilterCriteria>(defaultFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Extract unique values from images for filter options
  const filterOptions = useMemo(() => {
    const options = {
      cameraMakes: new Set<string>(),
      cameraModels: new Set<string>(),
      lenses: new Set<string>(),
      orientations: new Set<string>(),
      colorSpaces: new Set<string>(),
      formats: new Set<string>()
    };

    images.forEach(image => {
      const { metadata } = image;
      
      if (metadata.make) options.cameraMakes.add(metadata.make);
      if (metadata.model) options.cameraModels.add(metadata.model);
      if (metadata.lens) options.lenses.add(metadata.lens);
      if (metadata.orientation) options.orientations.add(metadata.orientation.toString());
      if (metadata.colorSpace) options.colorSpaces.add(metadata.colorSpace);
      if (image.file.type) options.formats.add(image.file.type);
      // Note: GPS country/city not available in current metadata structure
      // These would need to be derived from coordinates via reverse geocoding
    });

    return {
      cameraMakes: Array.from(options.cameraMakes).sort(),
      cameraModels: Array.from(options.cameraModels).sort(),
      lenses: Array.from(options.lenses).sort(),
      orientations: Array.from(options.orientations).sort(),
      colorSpaces: Array.from(options.colorSpaces).sort(),
      formats: Array.from(options.formats).sort()
    };
  }, [images]);

  // Apply filters to images
  const filteredImages = useMemo(() => {
    return images.filter(image => {
      const { metadata, file } = image;

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = [
          file.name,
          metadata.make,
          metadata.model,
          metadata.lens,
          metadata.software,
          metadata.flash,
          metadata.whiteBalance,
          metadata.exposureProgram
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const imageDate = metadata.dateTime ? new Date(metadata.dateTime) : null;
        if (!imageDate) return false;

        if (filters.dateRange.start && imageDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && imageDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      // Location filters
      if (filters.location.hasGPS !== null) {
        const hasGPS = !!(metadata.gpsLatitude && metadata.gpsLongitude);
        if (filters.location.hasGPS !== hasGPS) {
          return false;
        }
      }

      // Note: Country/city filtering not available without reverse geocoding
      // Could be implemented by converting GPS coordinates to location names

      // Camera filters
      if (filters.camera.make && metadata.make !== filters.camera.make) {
        return false;
      }

      if (filters.camera.model && metadata.model !== filters.camera.model) {
        return false;
      }

      if (filters.camera.lens && metadata.lens !== filters.camera.lens) {
        return false;
      }

      // Technical filters
      if (filters.technical.minWidth && (!metadata.imageWidth || metadata.imageWidth < filters.technical.minWidth)) {
        return false;
      }

      if (filters.technical.maxWidth && (!metadata.imageWidth || metadata.imageWidth > filters.technical.maxWidth)) {
        return false;
      }

      if (filters.technical.minHeight && (!metadata.imageHeight || metadata.imageHeight < filters.technical.minHeight)) {
        return false;
      }

      if (filters.technical.maxHeight && (!metadata.imageHeight || metadata.imageHeight > filters.technical.maxHeight)) {
        return false;
      }

      if (filters.technical.orientation && metadata.orientation?.toString() !== filters.technical.orientation) {
        return false;
      }

      if (filters.technical.colorSpace && metadata.colorSpace !== filters.technical.colorSpace) {
        return false;
      }

      // File info filters
      if (filters.fileInfo.format && file.type !== filters.fileInfo.format) {
        return false;
      }

      if (filters.fileInfo.minSize && file.size < filters.fileInfo.minSize) {
        return false;
      }

      if (filters.fileInfo.maxSize && file.size > filters.fileInfo.maxSize) {
        return false;
      }

      return true;
    });
  }, [images, filters]);

  // Update filtered results when filters change
  React.useEffect(() => {
    onFilteredResults(filteredImages);
  }, [filteredImages, onFilteredResults]);

  const updateFilter = useCallback((section: keyof FilterCriteria, field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
    onClearFilters();
  }, [onClearFilters]);

  const hasActiveFilters = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(defaultFilters);
  }, [filters]);

  const toggleSection = useCallback((section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  }, []);

  return (
    <div className="advanced-filter bg-gray-800 rounded-lg p-4 mb-6">
      {/* Filter Header */}
      <div className="filter-header flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Filter size={20} className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
          <span className="text-sm text-gray-400">
            ({filteredImages.length} of {images.length} images)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              <X size={14} className="mr-1" />
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="quick-search mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search images by filename, camera, location, keywords..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', '', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="expanded-filters space-y-4">
          {/* Date Range Filter */}
          <div className="filter-section">
            <button
              onClick={() => toggleSection('date')}
              className="flex items-center justify-between w-full p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Calendar size={18} className="text-green-400" />
                <span className="font-medium text-white">Date Range</span>
              </div>
              {activeSection === 'date' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {activeSection === 'date' && (
              <div className="mt-3 p-3 bg-gray-750 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">From Date</label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => updateFilter('dateRange', 'start', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">To Date</label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => updateFilter('dateRange', 'end', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="filter-section">
            <button
              onClick={() => toggleSection('location')}
              className="flex items-center justify-between w-full p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-red-400" />
                <span className="font-medium text-white">Location</span>
              </div>
              {activeSection === 'location' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {activeSection === 'location' && (
              <div className="mt-3 p-3 bg-gray-750 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">GPS Data</label>
                  <select
                    value={filters.location.hasGPS === null ? '' : filters.location.hasGPS.toString()}
                    onChange={(e) => updateFilter('location', 'hasGPS', e.target.value === '' ? null : e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Any</option>
                    <option value="true">Has GPS Data</option>
                    <option value="false">No GPS Data</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-500 italic">
                  Note: Country/city filtering requires reverse geocoding of GPS coordinates. 
                  Currently only GPS presence filtering is available.
                </div>
              </div>
            )}
          </div>

          {/* Camera Filter */}
          <div className="filter-section">
            <button
              onClick={() => toggleSection('camera')}
              className="flex items-center justify-between w-full p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Camera size={18} className="text-purple-400" />
                <span className="font-medium text-white">Camera & Lens</span>
              </div>
              {activeSection === 'camera' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {activeSection === 'camera' && (
              <div className="mt-3 p-3 bg-gray-750 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Camera Make</label>
                    <select
                      value={filters.camera.make}
                      onChange={(e) => updateFilter('camera', 'make', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Any Make</option>
                      {filterOptions.cameraMakes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Camera Model</label>
                    <select
                      value={filters.camera.model}
                      onChange={(e) => updateFilter('camera', 'model', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Any Model</option>
                      {filterOptions.cameraModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Lens</label>
                  <select
                    value={filters.camera.lens}
                    onChange={(e) => updateFilter('camera', 'lens', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Any Lens</option>
                    {filterOptions.lenses.map(lens => (
                      <option key={lens} value={lens}>{lens}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Technical Filter */}
          <div className="filter-section">
            <button
              onClick={() => toggleSection('technical')}
              className="flex items-center justify-between w-full p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Settings size={18} className="text-yellow-400" />
                <span className="font-medium text-white">Technical Specs</span>
              </div>
              {activeSection === 'technical' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {activeSection === 'technical' && (
              <div className="mt-3 p-3 bg-gray-750 rounded-lg space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Min Width</label>
                    <input
                      type="number"
                      placeholder="px"
                      value={filters.technical.minWidth || ''}
                      onChange={(e) => updateFilter('technical', 'minWidth', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Max Width</label>
                    <input
                      type="number"
                      placeholder="px"
                      value={filters.technical.maxWidth || ''}
                      onChange={(e) => updateFilter('technical', 'maxWidth', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Min Height</label>
                    <input
                      type="number"
                      placeholder="px"
                      value={filters.technical.minHeight || ''}
                      onChange={(e) => updateFilter('technical', 'minHeight', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Max Height</label>
                    <input
                      type="number"
                      placeholder="px"
                      value={filters.technical.maxHeight || ''}
                      onChange={(e) => updateFilter('technical', 'maxHeight', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Orientation</label>
                    <select
                      value={filters.technical.orientation}
                      onChange={(e) => updateFilter('technical', 'orientation', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Any Orientation</option>
                      {filterOptions.orientations.map(orientation => (
                        <option key={orientation} value={orientation}>{orientation}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Color Space</label>
                    <select
                      value={filters.technical.colorSpace}
                      onChange={(e) => updateFilter('technical', 'colorSpace', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Any Color Space</option>
                      {filterOptions.colorSpaces.map(colorSpace => (
                        <option key={colorSpace} value={colorSpace}>{colorSpace}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 