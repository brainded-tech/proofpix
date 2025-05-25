import exifr from 'exifr';
import { ImageMetadata } from '../types';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatFlash = (flash: number | undefined): string | undefined => {
  if (flash === undefined) return undefined;
  const flashModes: Record<number, string> = {
    0x0: 'No Flash',
    0x1: 'Flash Fired',
    0x5: 'Flash Fired, Return not detected',
    0x7: 'Flash Fired, Return detected',
    0x8: 'On, Flash did not fire',
    0x9: 'Flash Fired, Auto',
    0xd: 'Flash Fired, Auto, Return not detected',
    0xf: 'Flash Fired, Auto, Return detected',
    0x10: 'No flash function',
    0x18: 'Off, No flash function',
    0x19: 'Flash Fired, Auto, Red-eye reduction',
    0x1d: 'Flash Fired, Auto, Return not detected, Red-eye reduction',
    0x1f: 'Flash Fired, Auto, Return detected, Red-eye reduction',
  };
  return flashModes[flash] || `Unknown (${flash})`;
};

const formatWhiteBalance = (wb: number | undefined): string | undefined => {
  if (wb === undefined) return undefined;
  const whiteBalanceModes: Record<number, string> = {
    0: 'Auto',
    1: 'Manual'
  };
  return whiteBalanceModes[wb] || `Unknown (${wb})`;
};

const formatExposureProgram = (program: number | undefined): string | undefined => {
  if (program === undefined) return undefined;
  const programs: Record<number, string> = {
    0: 'Not Defined',
    1: 'Manual',
    2: 'Program AE',
    3: 'Aperture Priority',
    4: 'Shutter Priority',
    5: 'Creative Program',
    6: 'Action Program',
    7: 'Portrait Mode',
    8: 'Landscape Mode',
  };
  return programs[program] || `Unknown (${program})`;
};

const formatMeteringMode = (mode: number | undefined): string | undefined => {
  if (mode === undefined) return undefined;
  const modes: Record<number, string> = {
    0: 'Unknown',
    1: 'Average',
    2: 'Center Weighted Average',
    3: 'Spot',
    4: 'Multi Spot',
    5: 'Pattern',
    6: 'Partial',
    255: 'Other',
  };
  return modes[mode] || `Unknown (${mode})`;
};

const convertDMSToDD = (dms: number[], ref: string): number => {
  if (!dms || dms.length !== 3) return 0;
  let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
  if (ref === 'S' || ref === 'W') dd = -dd;
  return parseFloat(dd.toFixed(6));
};

export const extractMetadata = async (file: File): Promise<ImageMetadata> => {
  try {
    // Get EXIF data with all options enabled
    const exif = await exifr.parse(file, {
      gps: true,           // Ensure GPS parsing is enabled
      tiff: true,          // Enable TIFF metadata
      exif: true,          // Enable EXIF metadata
      icc: false,          // Disable ICC profile parsing (can cause issues)
      iptc: false,         // Disable IPTC metadata (can cause issues)
      xmp: false,          // Disable XMP metadata (can cause issues)
      mergeOutput: true,   // Merge all data into one object
      sanitize: true,      // Sanitize output
      reviveValues: true   // Parse dates and numbers properly
    });
    
    console.log('Raw EXIF data:', exif); // Debug log
    
    // Basic file info
    const metadata: ImageMetadata = {
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileType: file.type,
      lastModified: new Date(file.lastModified).toLocaleString(),
    };

    if (exif) {
      try {
        // Camera info
        metadata.make = exif.Make;
        metadata.model = exif.Model;
        metadata.software = exif.Software;
        
        // Handle date parsing safely
        if (exif.DateTimeOriginal) {
          try {
            metadata.dateTime = new Date(exif.DateTimeOriginal).toLocaleString();
          } catch (dateError) {
            console.warn('Date parsing error:', dateError);
            metadata.dateTime = exif.DateTimeOriginal?.toString();
          }
        }
        
        // GPS data - enhanced extraction with error handling
        try {
          if (exif.latitude !== undefined && exif.longitude !== undefined) {
            // Direct decimal format
            metadata.gpsLatitude = Number(exif.latitude);
            metadata.gpsLongitude = Number(exif.longitude);
            metadata.gpsAltitude = exif.altitude ? Number(exif.altitude) : undefined;
            console.log('GPS (decimal):', { lat: metadata.gpsLatitude, lng: metadata.gpsLongitude });
          } else if (exif.GPSLatitude && exif.GPSLongitude) {
            // DMS format
            metadata.gpsLatitude = convertDMSToDD(exif.GPSLatitude, exif.GPSLatitudeRef || 'N');
            metadata.gpsLongitude = convertDMSToDD(exif.GPSLongitude, exif.GPSLongitudeRef || 'E');
            metadata.gpsAltitude = exif.GPSAltitude ? Number(exif.GPSAltitude) : undefined;
            console.log('GPS (DMS):', { 
              raw: { lat: exif.GPSLatitude, lng: exif.GPSLongitude },
              converted: { lat: metadata.gpsLatitude, lng: metadata.gpsLongitude }
            });
          } else if (exif.gps) {
            // Some cameras store GPS in a nested 'gps' object
            const { latitude, longitude, altitude } = exif.gps;
            metadata.gpsLatitude = latitude ? Number(latitude) : undefined;
            metadata.gpsLongitude = longitude ? Number(longitude) : undefined;
            metadata.gpsAltitude = altitude ? Number(altitude) : undefined;
            console.log('GPS (nested):', { lat: latitude, lng: longitude });
          }

          // Additional GPS metadata
          if (exif.GPSTimeStamp) {
            try {
              // Handle GPS timestamp more safely
              if (Array.isArray(exif.GPSTimeStamp) && exif.GPSTimeStamp.length >= 3) {
                // GPS timestamp is usually [hours, minutes, seconds]
                const [hours, minutes, seconds] = exif.GPSTimeStamp;
                metadata.gpsTimeStamp = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(Math.floor(seconds)).padStart(2, '0')}`;
              } else if (typeof exif.GPSTimeStamp === 'string') {
                metadata.gpsTimeStamp = exif.GPSTimeStamp;
              } else {
                metadata.gpsTimeStamp = String(exif.GPSTimeStamp);
              }
            } catch (gpsTimeError) {
              console.warn('GPS time parsing error:', gpsTimeError);
              // Continue without GPS timestamp
            }
          }
          if (exif.GPSDateStamp) metadata.gpsDateStamp = exif.GPSDateStamp;
          if (exif.GPSAltitudeRef !== undefined) metadata.gpsAltitudeRef = exif.GPSAltitudeRef;
        } catch (gpsError) {
          console.warn('GPS data processing error:', gpsError);
          // Continue processing without GPS data
        }
        
        // Camera settings
        try {
          metadata.exposureTime = exif.ExposureTime ? `1/${Math.round(1/exif.ExposureTime)}` : undefined;
          metadata.fNumber = exif.FNumber ? Number(exif.FNumber) : undefined;
          metadata.iso = exif.ISO ? Number(exif.ISO) : undefined;
          metadata.focalLength = exif.FocalLength ? `${Number(exif.FocalLength)}mm` : undefined;
          metadata.lens = exif.LensModel;
        } catch (settingsError) {
          console.warn('Camera settings processing error:', settingsError);
        }
        
        // Image details
        try {
          metadata.imageWidth = exif.ImageWidth || exif.ExifImageWidth;
          metadata.imageHeight = exif.ImageHeight || exif.ExifImageHeight;
          metadata.orientation = exif.Orientation;
          metadata.colorSpace = exif.ColorSpace;
        } catch (imageError) {
          console.warn('Image details processing error:', imageError);
        }
        
        // Additional settings
        try {
          metadata.flash = formatFlash(exif.Flash);
          metadata.whiteBalance = formatWhiteBalance(exif.WhiteBalance);
          metadata.exposureProgram = formatExposureProgram(exif.ExposureProgram);
          metadata.meteringMode = formatMeteringMode(exif.MeteringMode);
        } catch (additionalError) {
          console.warn('Additional settings processing error:', additionalError);
        }
      } catch (metadataError) {
        console.warn('Metadata processing error:', metadataError);
        // Continue with basic file info
      }
    }

    console.log('Processed metadata:', metadata); // Debug log
    return metadata;
  } catch (error) {
    console.error('EXIF extraction error:', error);
    
    // Return basic file metadata if EXIF parsing fails
    return {
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileType: file.type,
      lastModified: new Date(file.lastModified).toLocaleString(),
    };
  }
}; 