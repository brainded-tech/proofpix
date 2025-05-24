import React from 'react';
import * as LucideIcons from 'lucide-react';

const ExifField = ({ label, value, icon: Icon }) => {
  if (!value) return null;
  
  return (
    <div className="mobile-exif-item">
      <div className="mobile-exif-label">
        {Icon && <Icon size={16} className="exif-icon" />}
        {label}
      </div>
      <div className="mobile-exif-value">{value}</div>
    </div>
  );
};

const MobileExifDisplay = ({ exifData }) => {
  if (!exifData) {
    return (
      <div className="mobile-exif-display">
        <div className="mobile-exif-empty">
          <LucideIcons.Image size={24} />
          <p>No EXIF data available</p>
        </div>
      </div>
    );
  }

  const {
    dateTimeOriginal,
    make,
    model,
    fNumber,
    exposureTime,
    iso,
    focalLength,
    resolution,
    software
  } = exifData;

  const formatExposure = (exposure) => {
    if (!exposure) return null;
    // Convert decimal to fraction if needed (e.g., 0.005 to 1/200)
    if (exposure < 1) {
      const fraction = Math.round(1 / exposure);
      return `1/${fraction}s`;
    }
    return `${exposure}s`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleString();
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="mobile-exif-display">
      <div className="mobile-exif-header">
        <h3>Image Details</h3>
      </div>
      
      <div className="mobile-exif-content">
        <ExifField
          label="Date Taken"
          value={formatDate(dateTimeOriginal)}
          icon={LucideIcons.Calendar}
        />
        
        {(make || model) && (
          <ExifField
            label="Camera"
            value={[make, model].filter(Boolean).join(' ')}
            icon={LucideIcons.Camera}
          />
        )}
        
        {(fNumber || exposureTime || iso) && (
          <ExifField
            label="Camera Settings"
            value={[
              fNumber && `ƒ/${fNumber}`,
              exposureTime && formatExposure(exposureTime),
              iso && `ISO ${iso}`
            ].filter(Boolean).join(' · ')}
            icon={LucideIcons.Settings2}
          />
        )}
        
        <ExifField
          label="Focal Length"
          value={focalLength && `${focalLength}mm`}
          icon={LucideIcons.ZoomIn}
        />
        
        <ExifField
          label="Resolution"
          value={resolution}
          icon={LucideIcons.Maximize2}
        />
        
        <ExifField
          label="Software"
          value={software}
          icon={LucideIcons.Terminal}
        />
      </div>
    </div>
  );
};

export default MobileExifDisplay; 