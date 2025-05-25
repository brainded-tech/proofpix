import React, { useState, useCallback, useMemo } from 'react';
import { Grid, List, Download, Eye, Trash2, CheckSquare, Square, ArrowUpDown, Calendar, Camera, MapPin } from 'lucide-react';
import { ProcessedImage } from '../types';
import { formatDateTime, formatFileSize } from '../utils/formatters';
import EnhancedExportDialog from './EnhancedExportDialog';

interface BatchResultsViewProps {
  images: ProcessedImage[];
  onImageSelect: (image: ProcessedImage) => void;
  onImageDelete?: (image: ProcessedImage) => void;
  onBatchExport?: (images: ProcessedImage[]) => void;
}

type SortField = 'name' | 'date' | 'size' | 'camera' | 'location';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export const BatchResultsView: React.FC<BatchResultsViewProps> = ({
  images,
  onImageSelect,
  onImageDelete,
  onBatchExport
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Sort images based on current sort criteria
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.file.name.toLowerCase();
          bValue = b.file.name.toLowerCase();
          break;
        case 'date':
          aValue = a.metadata.dateTime ? new Date(a.metadata.dateTime).getTime() : 0;
          bValue = b.metadata.dateTime ? new Date(b.metadata.dateTime).getTime() : 0;
          break;
        case 'size':
          aValue = a.file.size;
          bValue = b.file.size;
          break;
        case 'camera':
          aValue = `${a.metadata.make || ''} ${a.metadata.model || ''}`.toLowerCase();
          bValue = `${b.metadata.make || ''} ${b.metadata.model || ''}`.toLowerCase();
          break;
        case 'location':
          aValue = a.metadata.gpsLatitude ? 'has-gps' : 'no-gps';
          bValue = b.metadata.gpsLatitude ? 'has-gps' : 'no-gps';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [images, sortField, sortDirection]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const toggleImageSelection = useCallback((imageId: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  }, []);

  const selectAllImages = useCallback(() => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.file.name)));
    }
  }, [images, selectedImages.size]);

  const getSelectedImages = useCallback(() => {
    return images.filter(img => selectedImages.has(img.file.name));
  }, [images, selectedImages]);

  const handleBatchExport = useCallback(() => {
    const selected = getSelectedImages();
    if (selected.length > 0) {
      setShowExportDialog(true);
    }
  }, [getSelectedImages]);

  const handleBatchDelete = useCallback(() => {
    if (onImageDelete) {
      const selected = getSelectedImages();
      if (selected.length > 0 && window.confirm(`Delete ${selected.length} selected images?`)) {
        selected.forEach(image => onImageDelete(image));
        setSelectedImages(new Set());
      }
    }
  }, [getSelectedImages, onImageDelete]);

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
        sortField === field 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      <span>{children}</span>
      {sortField === field && (
        <ArrowUpDown size={12} className={sortDirection === 'desc' ? 'rotate-180' : ''} />
      )}
    </button>
  );

  const ImageCard: React.FC<{ image: ProcessedImage; isSelected: boolean }> = ({ image, isSelected }) => {
    const imageId = image.file.name;
    
    return (
      <div className={`image-card bg-gray-700 rounded-lg overflow-hidden transition-all hover:bg-gray-600 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}>
        {/* Image Preview */}
        <div className="relative aspect-video bg-gray-800">
          <img
            src={image.previewUrl}
            alt={image.file.name}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onImageSelect(image)}
          />
          
          {/* Selection Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleImageSelection(imageId);
            }}
            className="absolute top-2 left-2 p-1 bg-black bg-opacity-50 rounded hover:bg-opacity-70 transition-colors"
          >
            {isSelected ? (
              <CheckSquare size={16} className="text-blue-400" />
            ) : (
              <Square size={16} className="text-white" />
            )}
          </button>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageSelect(image);
              }}
              className="p-1 bg-black bg-opacity-50 rounded hover:bg-opacity-70 transition-colors"
              title="View Details"
            >
              <Eye size={16} className="text-white" />
            </button>
            {onImageDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this image?')) {
                    onImageDelete(image);
                  }
                }}
                className="p-1 bg-black bg-opacity-50 rounded hover:bg-opacity-70 transition-colors"
                title="Delete Image"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            )}
          </div>

          {/* GPS Indicator */}
          {image.metadata.gpsLatitude && image.metadata.gpsLongitude && (
            <div className="absolute bottom-2 left-2">
              <MapPin size={14} className="text-green-400" />
            </div>
          )}
        </div>

        {/* Image Info */}
        <div className="p-3">
          <h4 className="font-medium text-white truncate mb-1" title={image.file.name}>
            {image.file.name}
          </h4>
          
          <div className="text-xs text-gray-400 space-y-1">
            {image.metadata.dateTime && (
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{formatDateTime(image.metadata.dateTime)}</span>
              </div>
            )}
            
            {(image.metadata.make || image.metadata.model) && (
              <div className="flex items-center space-x-1">
                <Camera size={12} />
                <span className="truncate">
                  {image.metadata.make} {image.metadata.model}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>{formatFileSize(image.file.size)}</span>
              {image.metadata.imageWidth && image.metadata.imageHeight && (
                <span>{image.metadata.imageWidth}×{image.metadata.imageHeight}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ListItem: React.FC<{ image: ProcessedImage; isSelected: boolean }> = ({ image, isSelected }) => {
    const imageId = image.file.name;
    
    return (
      <div className={`list-item flex items-center p-3 bg-gray-700 rounded-lg transition-all hover:bg-gray-600 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}>
        {/* Selection Checkbox */}
        <button
          onClick={() => toggleImageSelection(imageId)}
          className="mr-3 p-1"
        >
          {isSelected ? (
            <CheckSquare size={16} className="text-blue-400" />
          ) : (
            <Square size={16} className="text-gray-400" />
          )}
        </button>

        {/* Thumbnail */}
        <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden mr-4 flex-shrink-0">
          <img
            src={image.previewUrl}
            alt={image.file.name}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onImageSelect(image)}
          />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate mb-1">{image.file.name}</h4>
          <div className="text-sm text-gray-400">
            {formatFileSize(image.file.size)} • {image.metadata.imageWidth}×{image.metadata.imageHeight}
          </div>
        </div>

        {/* Camera Info */}
        <div className="hidden md:block w-48 text-sm text-gray-400 truncate">
          {image.metadata.make} {image.metadata.model}
        </div>

        {/* Date */}
        <div className="hidden lg:block w-32 text-sm text-gray-400">
          {image.metadata.dateTime ? formatDateTime(image.metadata.dateTime) : 'No date'}
        </div>

        {/* Location */}
        <div className="hidden xl:block w-32 text-sm text-gray-400 truncate">
          {image.metadata.gpsLatitude && image.metadata.gpsLongitude ? 
            `${image.metadata.gpsLatitude.toFixed(4)}, ${image.metadata.gpsLongitude.toFixed(4)}` : 
            'No GPS'
          }
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onImageSelect(image)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {onImageDelete && (
            <button
              onClick={() => {
                if (window.confirm('Delete this image?')) {
                  onImageDelete(image);
                }
              }}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              title="Delete Image"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  if (images.length === 0) {
    return (
      <div className="batch-results-empty text-center py-12">
        <div className="text-gray-400 mb-4">
          <Grid size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No images match your filters</p>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="batch-results-view">
      {/* Results Header */}
      <div className="results-header bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
          {/* Results Count & Selection */}
          <div className="flex items-center space-x-4">
            <button
              onClick={selectAllImages}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {selectedImages.size === images.length ? (
                <CheckSquare size={16} className="text-blue-400" />
              ) : (
                <Square size={16} />
              )}
              <span>
                {selectedImages.size > 0 
                  ? `${selectedImages.size} of ${images.length} selected`
                  : `${images.length} images`
                }
              </span>
            </button>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-3">
            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <SortButton field="date">Date</SortButton>
              <SortButton field="name">Name</SortButton>
              <SortButton field="size">Size</SortButton>
              <SortButton field="camera">Camera</SortButton>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-700 rounded">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Batch Actions */}
        {selectedImages.size > 0 && (
          <div className="batch-actions mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBatchExport}
                className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                <Download size={14} className="mr-1" />
                Export Selected ({selectedImages.size})
              </button>
              
              {onImageDelete && (
                <button
                  onClick={handleBatchDelete}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete Selected ({selectedImages.size})
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Grid/List */}
      <div className="results-content">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedImages.map(image => (
              <ImageCard
                key={image.file.name}
                image={image}
                isSelected={selectedImages.has(image.file.name)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedImages.map(image => (
              <ListItem
                key={image.file.name}
                image={image}
                isSelected={selectedImages.has(image.file.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Export Dialog */}
      {showExportDialog && (
        <EnhancedExportDialog
          {...{
            isOpen: showExportDialog,
            onClose: () => setShowExportDialog(false),
            data: getSelectedImages(),
            onExportComplete: (filename: string, format: string) => {
              console.log(`✅ Batch export completed: ${filename}`);
              setSelectedImages(new Set()); // Clear selection after export
            }
          }}
        />
      )}
    </div>
  );
}; 