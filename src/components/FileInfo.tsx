import React, { useEffect, useState } from 'react';
import { useExifExtraction } from '../hooks/useExifExtraction';

interface FileInfoProps {
  file: File;
  onReset: () => void;
}

export const FileInfo: React.FC<FileInfoProps> = ({ file, onReset }) => {
  const { extractExif, loading, error } = useExifExtraction();
  const [exifData, setExifData] = useState<any>(null);

  useEffect(() => {
    const processFile = async () => {
      try {
        const data = await extractExif(file);
        setExifData(data);
      } catch (err) {
        console.error('Error processing file:', err);
      }
    };
    processFile();
  }, [file, extractExif]);

  if (loading) {
    return (
      <div className="file-info loading">
        <p>Loading metadata...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-info error">
        <div>
          <p>Error: {error.toString()}</p>
          <button onClick={onReset}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="file-info">
      <h3>File Information</h3>
      {exifData ? (
        <div className="metadata-content">
          <p>Name: {file.name}</p>
          <p>Size: {Math.round(file.size / 1024)} KB</p>
          <p>Type: {file.type}</p>
          {/* Add more EXIF data display as needed */}
        </div>
      ) : (
        <p>No EXIF data found</p>
      )}
      <button onClick={onReset}>Reset</button>
    </div>
  );
}; 
