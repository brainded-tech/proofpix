import React from 'react';
import useEnhancedPdfGenerator from '../utils/enhancedPdfGenerator';

const PDFTestComponent: React.FC = () => {
  const { generatePdf, isGenerating, progress } = useEnhancedPdfGenerator();

  const sampleData = {
    file: {
      name: 'sample_image.jpg',
      size: 2457600, // 2.4MB
      type: 'image/jpeg'
    },
    metadata: {
      fileName: 'sample_image.jpg',
      imageWidth: 4000,
      imageHeight: 3000,
      make: 'Canon',
      model: 'EOS R5',
      dateTime: '2024-03-15 14:30:22',
      fNumber: 2.8,
      exposureTime: '1/250',
      iso: 400,
      gpsLatitude: 37.7749,
      gpsLongitude: -122.4194,
      gpsAltitude: 52,
      colorSpace: 'sRGB',
      bitsPerSample: 8,
      compression: 'JPEG',
      orientation: 1,
      xResolution: 300,
      yResolution: 300,
      software: 'Adobe Lightroom',
      whiteBalance: 'Auto',
      flash: false
    },
    imageUrl: null // No actual image for this test
  };

  const handleGeneratePDF = async (template: string) => {
    try {
      const result = await generatePdf(sampleData, template, {
        logo: null, // No logo for test
        caseNumber: 'TEST-001',
        investigator: 'Test User',
        date: new Date().toISOString().split('T')[0]
      });
      
      console.log('PDF generated successfully:', result);
      alert(`PDF generated successfully: ${result.filename}`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`PDF generation failed: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">PDF Generator Test</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Sample Data Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>File:</strong> {sampleData.file.name}</div>
              <div><strong>Size:</strong> {Math.round(sampleData.file.size / 1024)} KB</div>
              <div><strong>Camera:</strong> {sampleData.metadata.make} {sampleData.metadata.model}</div>
              <div><strong>Date:</strong> {sampleData.metadata.dateTime}</div>
              <div><strong>Dimensions:</strong> {sampleData.metadata.imageWidth} × {sampleData.metadata.imageHeight}</div>
              <div><strong>GPS:</strong> {sampleData.metadata.gpsLatitude}, {sampleData.metadata.gpsLongitude}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Test PDF Templates</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleGeneratePDF('professional')}
              disabled={isGenerating}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Professional
            </button>
            
            <button
              onClick={() => handleGeneratePDF('forensic')}
              disabled={isGenerating}
              className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Forensic
            </button>
            
            <button
              onClick={() => handleGeneratePDF('minimal')}
              disabled={isGenerating}
              className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Minimal
            </button>
            
            <button
              onClick={() => handleGeneratePDF('detailed')}
              disabled={isGenerating}
              className="bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Detailed
            </button>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-800">Generating PDF... {progress}%</span>
              </div>
              <div className="mt-2 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Test Instructions</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Click any template button to generate a test PDF</li>
            <li>• The PDF will be automatically downloaded to your Downloads folder</li>
            <li>• Check the browser console for detailed logs</li>
            <li>• Each template demonstrates different formatting and content</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFTestComponent; 