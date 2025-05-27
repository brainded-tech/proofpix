import React, { useState, useCallback } from 'react';
import { Upload, X, Share2, AlertTriangle, CheckCircle, Copy, Layers } from 'lucide-react';
import { ProcessedImage } from '../types';
import { analytics } from '../utils/analytics';
import { extractMetadata } from '../utils/metadata';

interface ComparisonToolProps {
  onClose?: () => void;
}

interface ComparisonData {
  leftImage: ProcessedImage | null;
  rightImage: ProcessedImage | null;
  differences: string[];
  similarities: string[];
}

export const ComparisonTool: React.FC<ComparisonToolProps> = ({ onClose }) => {
  const [comparison, setComparison] = useState<ComparisonData>({
    leftImage: null,
    rightImage: null,
    differences: [],
    similarities: []
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (side: 'left' | 'right', file: File) => {
    try {
      // Use real EXIF extraction instead of mock data
      const metadata = await extractMetadata(file);
      
      const processedImage: ProcessedImage = {
        file,
        metadata,
        previewUrl: URL.createObjectURL(file)
      };

      setComparison(prev => ({
        ...prev,
        [side === 'left' ? 'leftImage' : 'rightImage']: processedImage
      }));

      analytics.trackFeatureUsage('Image Comparison', `${side} Image Uploaded`);
    } catch (error) {
      console.error('Error extracting metadata:', error);
      // Fallback to basic file info if EXIF extraction fails
      const basicMetadata = {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        fileType: file.type,
        lastModified: new Date(file.lastModified).toISOString(),
      };
      
      const processedImage: ProcessedImage = {
        file,
        metadata: basicMetadata,
        previewUrl: URL.createObjectURL(file)
      };

      setComparison(prev => ({
        ...prev,
        [side === 'left' ? 'leftImage' : 'rightImage']: processedImage
      }));

      analytics.trackFeatureUsage('Image Comparison', `${side} Image Uploaded (Basic Info Only)`);
    }
  }, []);

  const analyzeComparison = useCallback(async () => {
    if (!comparison.leftImage || !comparison.rightImage) return;

    setIsAnalyzing(true);
    
    try {
      // Real dynamic analysis based on actual metadata
      const leftMeta = comparison.leftImage.metadata;
      const rightMeta = comparison.rightImage.metadata;
      
      const differences: string[] = [];
      const similarities: string[] = [];

      console.log('Left metadata:', leftMeta);
      console.log('Right metadata:', rightMeta);

      // Compare camera make/model
      if (leftMeta.make && rightMeta.make) {
        if (leftMeta.make !== rightMeta.make) {
          differences.push(`Camera manufacturer differs (${leftMeta.make} vs ${rightMeta.make})`);
        } else {
          similarities.push(`Both images taken with ${leftMeta.make} cameras`);
        }
      } else if (leftMeta.make || rightMeta.make) {
        differences.push(`Camera make available for only one image (${leftMeta.make || 'Unknown'} vs ${rightMeta.make || 'Unknown'})`);
      }

      if (leftMeta.model && rightMeta.model) {
        if (leftMeta.model !== rightMeta.model) {
          differences.push(`Camera model differs (${leftMeta.model} vs ${rightMeta.model})`);
        } else {
          similarities.push(`Both images taken with ${leftMeta.model}`);
        }
      } else if (leftMeta.model || rightMeta.model) {
        differences.push(`Camera model available for only one image (${leftMeta.model || 'Unknown'} vs ${rightMeta.model || 'Unknown'})`);
      }

      // Compare GPS coordinates
      if (leftMeta.gpsLatitude && leftMeta.gpsLongitude && rightMeta.gpsLatitude && rightMeta.gpsLongitude) {
        const distance = Math.sqrt(
          Math.pow(leftMeta.gpsLatitude - rightMeta.gpsLatitude, 2) + 
          Math.pow(leftMeta.gpsLongitude - rightMeta.gpsLongitude, 2)
        ) * 69; // Rough miles conversion
        
        if (distance > 1) {
          differences.push(`GPS locations are ${distance.toFixed(1)} miles apart`);
        } else {
          similarities.push('Both images taken at similar locations');
        }
      } else if ((leftMeta.gpsLatitude && leftMeta.gpsLongitude) || (rightMeta.gpsLatitude && rightMeta.gpsLongitude)) {
        differences.push('GPS data available for only one image');
      }

      // Compare ISO settings
      if (leftMeta.iso && rightMeta.iso) {
        const leftIso = typeof leftMeta.iso === 'string' ? parseInt(leftMeta.iso) : leftMeta.iso;
        const rightIso = typeof rightMeta.iso === 'string' ? parseInt(rightMeta.iso) : rightMeta.iso;
        const isoDiff = Math.abs(leftIso - rightIso);
        
        if (isoDiff > 200) {
          differences.push(`ISO settings vary significantly (${leftIso} vs ${rightIso})`);
        } else if (isoDiff === 0) {
          similarities.push(`Both images use identical ISO ${leftIso}`);
        } else {
          similarities.push(`Similar ISO settings (${leftIso} vs ${rightIso})`);
        }
      } else if (leftMeta.iso || rightMeta.iso) {
        differences.push(`ISO data available for only one image (${leftMeta.iso || 'Unknown'} vs ${rightMeta.iso || 'Unknown'})`);
      }

      // Compare focal length
      if (leftMeta.focalLength && rightMeta.focalLength) {
        if (leftMeta.focalLength !== rightMeta.focalLength) {
          differences.push(`Focal lengths differ (${leftMeta.focalLength} vs ${rightMeta.focalLength})`);
        } else {
          similarities.push(`Both images shot at ${leftMeta.focalLength} focal length`);
        }
      } else if (leftMeta.focalLength || rightMeta.focalLength) {
        differences.push(`Focal length available for only one image (${leftMeta.focalLength || 'Unknown'} vs ${rightMeta.focalLength || 'Unknown'})`);
      }

      // Compare aperture (f-number)
      if (leftMeta.fNumber && rightMeta.fNumber) {
        const fDiff = Math.abs(leftMeta.fNumber - rightMeta.fNumber);
        if (fDiff > 0.5) {
          differences.push(`Aperture settings differ (f/${leftMeta.fNumber} vs f/${rightMeta.fNumber})`);
        } else {
          similarities.push(`Similar aperture settings (f/${leftMeta.fNumber} vs f/${rightMeta.fNumber})`);
        }
      } else if (leftMeta.fNumber || rightMeta.fNumber) {
        differences.push(`Aperture data available for only one image (f/${leftMeta.fNumber || 'Unknown'} vs f/${rightMeta.fNumber || 'Unknown'})`);
      }

      // Compare exposure time
      if (leftMeta.exposureTime && rightMeta.exposureTime) {
        if (leftMeta.exposureTime !== rightMeta.exposureTime) {
          differences.push(`Exposure times differ (${leftMeta.exposureTime} vs ${rightMeta.exposureTime})`);
        } else {
          similarities.push(`Identical exposure time (${leftMeta.exposureTime})`);
        }
      } else if (leftMeta.exposureTime || rightMeta.exposureTime) {
        differences.push(`Exposure time available for only one image (${leftMeta.exposureTime || 'Unknown'} vs ${rightMeta.exposureTime || 'Unknown'})`);
      }

      // Compare file sizes
      if (leftMeta.fileSize && rightMeta.fileSize) {
        const leftSizeStr = leftMeta.fileSize.toString();
        const rightSizeStr = rightMeta.fileSize.toString();
        const leftSize = parseFloat(leftSizeStr.replace(/[^\d.]/g, ''));
        const rightSize = parseFloat(rightSizeStr.replace(/[^\d.]/g, ''));
        const sizeDiff = Math.abs(leftSize - rightSize);
        
        if (sizeDiff > 1) {
          differences.push(`File sizes differ significantly (${leftMeta.fileSize} vs ${rightMeta.fileSize})`);
        } else {
          similarities.push(`Similar file sizes (${leftMeta.fileSize} vs ${rightMeta.fileSize})`);
        }
      }

      // Compare file types
      if (leftMeta.fileType && rightMeta.fileType) {
        if (leftMeta.fileType !== rightMeta.fileType) {
          differences.push(`File formats differ (${leftMeta.fileType} vs ${rightMeta.fileType})`);
        } else {
          similarities.push(`Both images are ${leftMeta.fileType} format`);
        }
      }

      // Compare date/time
      if (leftMeta.dateTime && rightMeta.dateTime) {
        const leftDate = new Date(leftMeta.dateTime);
        const rightDate = new Date(rightMeta.dateTime);
        
        if (!isNaN(leftDate.getTime()) && !isNaN(rightDate.getTime())) {
          const timeDiff = Math.abs(leftDate.getTime() - rightDate.getTime()) / (1000 * 60 * 60); // hours
          
          if (timeDiff > 24) {
            differences.push(`Images taken ${Math.floor(timeDiff / 24)} days apart`);
          } else if (timeDiff > 1) {
            differences.push(`Images taken ${Math.floor(timeDiff)} hours apart`);
          } else {
            similarities.push('Both images taken within the same hour');
          }
        }
      } else if (leftMeta.dateTime || rightMeta.dateTime) {
        differences.push('Date/time information available for only one image');
      }

      // Always ensure we have some results
      if (differences.length === 0 && similarities.length === 0) {
        differences.push('Limited metadata available for detailed comparison');
        similarities.push('Both files are valid image files');
        similarities.push(`File names: ${leftMeta.fileName} vs ${rightMeta.fileName}`);
      }

      // Ensure we have at least one similarity
      if (similarities.length === 0) {
        similarities.push('Both files are image files suitable for comparison');
      }

      console.log('Analysis results:', { differences, similarities });

      setComparison(prev => ({
        ...prev,
        differences,
        similarities
      }));

      analytics.trackFeatureUsage('Image Comparison', 'Analysis Completed');
    } catch (error) {
      console.error('Error during comparison analysis:', error);
      setComparison(prev => ({
        ...prev,
        differences: ['Error occurred during analysis'],
        similarities: ['Both files were successfully uploaded']
      }));
    } finally {
      setIsAnalyzing(false);
    }
  }, [comparison.leftImage, comparison.rightImage]);

  const generateShareableReport = useCallback(() => {
    const reportData = {
      timestamp: new Date().toISOString(),
      leftImage: comparison.leftImage?.metadata.fileName,
      rightImage: comparison.rightImage?.metadata.fileName,
      differences: comparison.differences,
      similarities: comparison.similarities,
      tool: 'ProofPix Comparison Tool'
    };

    const reportUrl = `https://proofpix.app/comparison/${btoa(JSON.stringify(reportData))}`;
    setShareUrl(reportUrl);
    
    analytics.trackFeatureUsage('Image Comparison', 'Shareable Report Generated');
  }, [comparison]);

  const copyShareUrl = useCallback(() => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      analytics.trackFeatureUsage('Image Comparison', 'Share URL Copied');
    }
  }, [shareUrl]);

  const canAnalyze = comparison.leftImage && comparison.rightImage;
  const hasResults = comparison.differences.length > 0;

  return (
    <div className="comparison-tool bg-gray-800 rounded-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Layers className="mr-3 text-purple-400" size={28} />
            🔍 Image Comparison Tool
          </h2>
          <p className="text-gray-400">Compare metadata between two images for forensic analysis</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Image */}
        <div className="upload-area">
          <h3 className="text-lg font-semibold text-white mb-3">Image A</h3>
          {comparison.leftImage ? (
            <div className="bg-gray-700 rounded-lg p-4">
              <img 
                src={comparison.leftImage.previewUrl} 
                alt="Left comparison" 
                className="w-full h-48 object-cover rounded mb-3"
              />
              <p className="text-sm text-gray-300">{comparison.leftImage.metadata.fileName}</p>
              <p className="text-xs text-gray-400">{comparison.leftImage.metadata.make} {comparison.leftImage.metadata.model}</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <Upload className="mx-auto mb-4 text-gray-500" size={48} />
              <p className="text-gray-400 mb-2">Drop image here or click to upload</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload('left', e.target.files[0])}
                className="hidden"
                id="left-upload"
              />
              <label htmlFor="left-upload" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors">
                Choose File
              </label>
            </div>
          )}
        </div>

        {/* Right Image */}
        <div className="upload-area">
          <h3 className="text-lg font-semibold text-white mb-3">Image B</h3>
          {comparison.rightImage ? (
            <div className="bg-gray-700 rounded-lg p-4">
              <img 
                src={comparison.rightImage.previewUrl} 
                alt="Right comparison" 
                className="w-full h-48 object-cover rounded mb-3"
              />
              <p className="text-sm text-gray-300">{comparison.rightImage.metadata.fileName}</p>
              <p className="text-xs text-gray-400">{comparison.rightImage.metadata.make} {comparison.rightImage.metadata.model}</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <Upload className="mx-auto mb-4 text-gray-500" size={48} />
              <p className="text-gray-400 mb-2">Drop image here or click to upload</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload('right', e.target.files[0])}
                className="hidden"
                id="right-upload"
              />
              <label htmlFor="right-upload" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors">
                Choose File
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Button */}
      {canAnalyze && !hasResults && (
        <div className="text-center mb-6">
          <button
            onClick={analyzeComparison}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg"
          >
            {isAnalyzing ? 'Analyzing...' : '🔍 Compare Images'}
          </button>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-400">Analyzing metadata differences...</p>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div className="results space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Differences */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                <AlertTriangle size={20} className="mr-2" />
                Key Differences ({comparison.differences.length})
              </h3>
              <ul className="space-y-2">
                {comparison.differences.map((diff, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    {diff}
                  </li>
                ))}
              </ul>
            </div>

            {/* Similarities */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                <CheckCircle size={20} className="mr-2" />
                Similarities ({comparison.similarities.length})
              </h3>
              <ul className="space-y-2">
                {comparison.similarities.map((sim, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    {sim}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Share Section - CMO's Viral Growth Strategy */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Share2 size={20} className="mr-2" />
              Share This Shocking Comparison
            </h3>
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={generateShareableReport}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center font-semibold shadow-lg transition-all"
              >
                <Share2 size={16} className="mr-2" />
                Generate Viral Report
              </button>
              
              {shareUrl && (
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="bg-gray-600 text-white px-3 py-2 rounded text-sm flex-1 min-w-0"
                    placeholder="Shareable URL will appear here..."
                  />
                  <button
                    onClick={copyShareUrl}
                    className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-500 flex items-center transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 space-y-1 bg-gray-800/50 rounded p-3">
              <p>📱 <strong>Social Media:</strong> "You won't believe what this comparison revealed!"</p>
              <p>📰 <strong>Professional:</strong> Share with journalists, investigators, and forensic professionals</p>
              <p>🔗 <strong>Embed:</strong> Perfect for reports, articles, and legal documentation</p>
              <p>🎯 <strong>Viral Potential:</strong> Shocking metadata differences drive engagement</p>
            </div>
          </div>
        </div>
      )}

      {/* Pro Feature Hint */}
      <div className="mt-6 text-center">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-sm text-yellow-400">
            💡 <strong>Pro Tip:</strong> Upgrade to Pro for advanced comparison features, batch analysis, and unlimited sharing
          </p>
        </div>
      </div>
    </div>
  );
};
