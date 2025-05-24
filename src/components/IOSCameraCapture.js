import React, { useRef, useState, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';

const IOSCameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 4096 },
          height: { ideal: 4096 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error('Camera access failed:', error);
      alert('Camera access denied. Please check permissions.');
    }
  }, []);
  
  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    
    setIsCapturing(true);
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      
      // Add synthetic EXIF data
      const enhancedFile = Object.defineProperty(file, 'exifdata', {
        value: {
          Make: 'Apple',
          Model: navigator.userAgent.includes('iPhone') ? 'iPhone' : 'iOS Device',
          DateTime: new Date().toISOString(),
          DateTimeOriginal: new Date().toISOString(),
          Software: 'ProofPix Camera'
        }
      });
      
      onCapture(enhancedFile);
      stopCamera();
    }, 'image/jpeg', 0.95);
  }, [onCapture]);
  
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  }, [stream, onClose]);
  
  React.useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  return (
    <div className="ios-camera-capture">
      <div className="camera-header">
        <h3>Take Photo</h3>
        <button onClick={stopCamera} className="close-camera">
          <LucideIcons.X size={24} />
        </button>
      </div>
      
      <div className="camera-viewport">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="camera-feed"
        />
      </div>
      
      <div className="camera-controls">
        <button 
          className="capture-btn"
          onClick={capturePhoto}
          disabled={isCapturing}
        >
          <div className="capture-btn-inner" />
        </button>
      </div>
    </div>
  );
};

export default IOSCameraCapture;