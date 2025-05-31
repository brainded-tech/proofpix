import { enhancedDataExporter } from './enhancedDataExporter';

export interface MetadataField {
  key: string;
  value: any;
  category: 'file' | 'camera' | 'settings' | 'datetime' | 'location' | 'technical';
  editable: boolean;
  type: 'string' | 'number' | 'date' | 'coordinates';
}

export interface MetadataSaveResult {
  success: boolean;
  message: string;
  downloadUrl?: string;
  filename?: string;
}

export class MetadataManipulator {
  constructor() {
    // Use the singleton instance
  }

  async saveMetadataToFile(
    originalFile: File,
    modifiedMetadata: any,
    removedFields: string[] = []
  ): Promise<MetadataSaveResult> {
    try {
      const metadataPackage = {
        originalFilename: originalFile.name,
        modifiedAt: new Date().toISOString(),
        modifiedMetadata,
        removedFields,
        originalSize: originalFile.size,
        originalType: originalFile.type
      };

      const metadataBlob = new Blob([JSON.stringify(metadataPackage, null, 2)], {
        type: 'application/json'
      });

      const downloadUrl = URL.createObjectURL(metadataBlob);
      const filename = `${originalFile.name.split('.')[0]}_metadata.json`;

      return {
        success: true,
        message: 'Metadata saved successfully! Download the metadata file to preserve your changes.',
        downloadUrl,
        filename
      };
    } catch (error: unknown) {
      console.error('Error saving metadata:', error);
      return {
        success: false,
        message: 'Failed to save metadata. Please try again.'
      };
    }
  }

  async exportMetadata(
    metadata: any,
    removedFields: string[] = [],
    format: 'json' | 'csv' | 'xml' | 'excel' = 'json'
  ): Promise<MetadataSaveResult> {
    try {
      const exportData = {
        ...metadata,
        _exportInfo: {
          exportedAt: new Date().toISOString(),
          removedFields,
          format,
          generator: 'ProofPix Pro'
        }
      };

      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'json':
          blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
          });
          filename = `metadata_export_${Date.now()}.json`;
          break;

        case 'csv':
          // Use the enhanced data exporter for CSV
          const success = await enhancedDataExporter.exportData({
            format: 'csv',
            fileName: `metadata_export_${Date.now()}`,
            dateRange: {
              start: new Date(),
              end: new Date()
            }
          });
          
          if (success) {
            return {
              success: true,
              message: `Metadata exported successfully as ${format.toUpperCase()}!`
            };
          } else {
            throw new Error('CSV export failed');
          }

        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      const downloadUrl = URL.createObjectURL(blob);

      return {
        success: true,
        message: `Metadata exported successfully as ${format.toUpperCase()}!`,
        downloadUrl,
        filename
      };
    } catch (error: unknown) {
      console.error('Error exporting metadata:', error);
      return {
        success: false,
        message: `Failed to export metadata as ${format.toUpperCase()}. Please try again.`
      };
    }
  }

  validateMetadata(metadata: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (metadata.gpsLatitude !== undefined) {
      const lat = parseFloat(metadata.gpsLatitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push('GPS Latitude must be between -90 and 90 degrees');
      }
    }

    if (metadata.gpsLongitude !== undefined) {
      const lng = parseFloat(metadata.gpsLongitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.push('GPS Longitude must be between -180 and 180 degrees');
      }
    }

    if (metadata.iso !== undefined) {
      const iso = parseInt(metadata.iso);
      if (isNaN(iso) || iso < 50 || iso > 102400) {
        errors.push('ISO must be between 50 and 102400');
      }
    }

    if (metadata.fNumber !== undefined) {
      const fNumber = parseFloat(metadata.fNumber);
      if (isNaN(fNumber) || fNumber < 0.5 || fNumber > 64) {
        errors.push('F-Number must be between 0.5 and 64');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  downloadFile(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export const metadataManipulator = new MetadataManipulator();
