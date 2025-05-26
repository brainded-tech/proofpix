import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Database, Trash2 } from 'lucide-react';
import { ProcessedImage } from '../types';
import { AdvancedFilter } from './AdvancedFilter';
import { BatchResultsView } from './BatchResultsView';
import { ProcessingInterface } from './ProcessingInterface';
import { analytics } from '../utils/analytics';

interface BatchManagementPageProps {
  initialImages?: ProcessedImage[];
  onBackToHome: () => void;
}

export const BatchManagementPage: React.FC<BatchManagementPageProps> = ({
  initialImages = [],
  onBackToHome
}) => {
  const [allImages, setAllImages] = useState<ProcessedImage[]>(initialImages);
  const [filteredImages, setFilteredImages] = useState<ProcessedImage[]>(initialImages);
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null);
  const [storageStats, setStorageStats] = useState({ count: 0, totalSize: 0 });
  const navigate = useNavigate();

  // Load images from localStorage on component mount
  useEffect(() => {
    const loadStoredImages = () => {
      try {
        const stored = localStorage.getItem('proofpix_batch_images');
        if (stored) {
          const storedImages = JSON.parse(stored);
          // Recreate blob URLs for stored images
          const restoredImages = storedImages.map((img: any) => ({
            ...img,
            previewUrl: img.previewUrl // Note: This will be broken after page reload
          }));
          
          if (initialImages.length === 0) {
            setAllImages(restoredImages);
            setFilteredImages(restoredImages);
          }
        }
      } catch (error) {
        console.warn('Failed to load stored images:', error);
      }
    };

    loadStoredImages();
  }, [initialImages.length]);

  // Update storage stats when images change
  useEffect(() => {
    const totalSize = allImages.reduce((sum, img) => sum + img.file.size, 0);
    setStorageStats({
      count: allImages.length,
      totalSize
    });

    // Store images in localStorage (without blob URLs to avoid memory leaks)
    try {
      const imagesToStore = allImages.map(img => ({
        ...img,
        previewUrl: null // Don't store blob URLs
      }));
      localStorage.setItem('proofpix_batch_images', JSON.stringify(imagesToStore));
    } catch (error) {
      console.warn('Failed to store images:', error);
    }
  }, [allImages]);

  const handleFilteredResults = useCallback((filtered: ProcessedImage[]) => {
    setFilteredImages(filtered);
    analytics.trackFeatureUsage('Advanced Filter', `${filtered.length} results`);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilteredImages(allImages);
    analytics.trackFeatureUsage('Advanced Filter', 'Filters Cleared');
  }, [allImages]);

  const handleImageSelect = useCallback((image: ProcessedImage) => {
    setSelectedImage(image);
    analytics.trackFeatureUsage('Batch Management', 'Image Selected');
  }, []);

  const handleImageDelete = useCallback((imageToDelete: ProcessedImage) => {
    setAllImages(prev => prev.filter(img => img.file.name !== imageToDelete.file.name));
    setFilteredImages(prev => prev.filter(img => img.file.name !== imageToDelete.file.name));
    
    // Clean up blob URL
    if (imageToDelete.previewUrl) {
      URL.revokeObjectURL(imageToDelete.previewUrl);
    }
    
    analytics.trackFeatureUsage('Batch Management', 'Image Deleted');
  }, []);

  const handleClearAllImages = useCallback(() => {
    if (window.confirm(`Delete all ${allImages.length} images? This cannot be undone.`)) {
      // Clean up all blob URLs
      allImages.forEach(img => {
        if (img.previewUrl) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
      
      setAllImages([]);
      setFilteredImages([]);
      setSelectedImage(null);
      localStorage.removeItem('proofpix_batch_images');
      
      analytics.trackFeatureUsage('Batch Management', 'All Images Cleared');
    }
  }, [allImages]);

  const handleBackFromImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // If an image is selected, show the processing interface
  if (selectedImage) {
    return (
      <ProcessingInterface
        processedImage={selectedImage}
        onBackToHome={handleBackFromImage}
      />
    );
  }

  return (
    <div className="batch-management-page min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={onBackToHome}
                className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </button>
              <div className="flex items-center">
                <Camera className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-white">Batch Management</h1>
                  <p className="text-sm text-gray-400">Filter, sort, and manage your processed images</p>
                </div>
              </div>
            </div>
            
            {/* Storage Stats */}
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Database size={16} />
                <span>{storageStats.count} images</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>{formatFileSize(storageStats.totalSize)}</span>
              </div>
              {allImages.length > 0 && (
                <button
                  onClick={handleClearAllImages}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {allImages.length === 0 ? (
          // Empty State
          <div className="empty-state text-center py-16">
            <div className="max-w-md mx-auto">
              <Database size={64} className="mx-auto mb-6 text-gray-500" />
              <h2 className="text-2xl font-bold text-white mb-4">No Images Yet</h2>
              <p className="text-gray-400 mb-6">
                Process some images first to use the batch management features. 
                You can upload and process multiple images, then return here to filter and manage them.
              </p>
              <div className="space-y-3">
                <button
                  onClick={onBackToHome}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Process Images
                </button>
                <button
                  onClick={() => navigate('/analytics')}
                  className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Main Content
          <div className="space-y-6">
            {/* Advanced Filter */}
            <AdvancedFilter
              images={allImages}
              onFilteredResults={handleFilteredResults}
              onClearFilters={handleClearFilters}
            />

            {/* Batch Results View */}
            <BatchResultsView
              images={filteredImages}
              onImageSelect={handleImageSelect}
              onImageDelete={handleImageDelete}
            />
          </div>
        )}

        {/* Mobile Storage Stats */}
        <div className="md:hidden mt-8 bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Database size={16} />
                <span>{storageStats.count} images</span>
              </div>
              <div>
                <span>{formatFileSize(storageStats.totalSize)}</span>
              </div>
            </div>
            {allImages.length > 0 && (
              <button
                onClick={handleClearAllImages}
                className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-400">
            <p className="mb-2">
              Batch management processes images locally in your browser. No data is sent to external servers.
            </p>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <button onClick={onBackToHome} className="text-gray-400 hover:text-white">Home</button>
              <button onClick={() => navigate('/faq')} className="text-gray-400 hover:text-white">F.A.Q.</button>
              <button onClick={() => navigate('/about')} className="text-gray-400 hover:text-white">About</button>
              <button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-white">Privacy</button>
              <button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-white">Terms</button>
              <button onClick={() => navigate('/support')} className="text-gray-400 hover:text-white">Support</button>
              <button onClick={() => window.location.href = 'https://proofpixapp.com/#contact'} className="text-gray-400 hover:text-white">Contact</button>
              <button onClick={() => navigate('/pricing')} className="text-gray-400 hover:text-white">Pricing</button>
              <button onClick={() => navigate('/analytics')} className="text-gray-400 hover:text-white">Analytics</button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}; 