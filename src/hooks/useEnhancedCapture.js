// hooks/useEnhancedCapture.js
import { useCallback, useState } from 'react';
import { Logger } from '../utils/logger';

const logger = new Logger('EnhancedCapture');

export const useEnhancedCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureWithMetadata = useCallback(async (file) => {
    logger.info('Starting enhanced capture for:', file.name);
    setIsCapturing(true);

    try {
      // Build enhanced metadata from available sources
      const metadata = {
        // File basics
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        lastModified: new Date(file.lastModified).toISOString(),
        
        // Device detection
        make: detectMake(),
        model: detectModel(),
        software: `ProofPix Web ${getAppVersion()}`,
        userAgent: navigator.userAgent,
        
        // Timestamps
        dateTime: new Date().toISOString(),
        dateTimeOriginal: new Date(file.lastModified).toISOString(),
        dateTimeDigitized: new Date().toISOString(),
        
        // Screen and viewport info (can help identify device)
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        pixelRatio: window.devicePixelRatio,
        colorDepth: window.screen.colorDepth,
        
        // Browser and platform
        platform: navigator.platform,
        language: navigator.language,
        onLine: navigator.onLine,
      };

      // Try to get GPS location
      if ('geolocation' in navigator) {
        try {
          const position = await getLocationWithTimeout(10000);
          if (position) {
            // Convert to DMS format like real EXIF
            metadata.gpsLatitude = decimalToDMS(position.coords.latitude);
            metadata.gpsLongitude = decimalToDMS(position.coords.longitude);
            metadata.gpsLatitudeRef = position.coords.latitude >= 0 ? 'N' : 'S';
            metadata.gpsLongitudeRef = position.coords.longitude >= 0 ? 'E' : 'W';
            metadata.gpsAltitude = position.coords.altitude;
            metadata.gpsAccuracy = position.coords.accuracy;
            metadata.gpsTimestamp = new Date(position.timestamp).toISOString();
            
            // Also store decimal for convenience
            metadata.gpsLatitudeDecimal = position.coords.latitude;
            metadata.gpsLongitudeDecimal = position.coords.longitude;
            
            logger.info('GPS data captured successfully');
          }
        } catch (error) {
          logger.warn('GPS capture failed:', error.message);
          metadata.gpsError = error.message;
        }
      }

      // Try to get device orientation
      if (window.DeviceOrientationEvent) {
        try {
          const orientation = await getOrientationWithTimeout(2000);
          if (orientation) {
            metadata.compassHeading = orientation.alpha;
            metadata.tilt = orientation.beta;
            metadata.rotation = orientation.gamma;
            logger.info('Orientation data captured');
          }
        } catch (error) {
          logger.warn('Orientation capture failed:', error.message);
        }
      }

      // Try to detect light level (ambient light sensor)
      if ('AmbientLightSensor' in window) {
        try {
          const sensor = new window.AmbientLightSensor();
          sensor.start();
          await new Promise(resolve => setTimeout(resolve, 100));
          metadata.ambientLight = sensor.illuminance;
          sensor.stop();
        } catch (error) {
          logger.warn('Light sensor failed:', error.message);
        }
      }

      // Battery info (can help identify device state)
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          metadata.batteryLevel = Math.round(battery.level * 100);
          metadata.batteryCharging = battery.charging;
        } catch (error) {
          logger.warn('Battery API failed:', error.message);
        }
      }

      // Network info
      if ('connection' in navigator) {
        metadata.networkType = navigator.connection.effectiveType;
        metadata.networkSpeed = navigator.connection.downlink;
      }

      logger.info('Enhanced metadata collected:', metadata);
      setIsCapturing(false);
      
      return { 
        file, 
        metadata,
        enhanced: true,
        captureMethod: 'browser-api'
      };
      
    } catch (error) {
      logger.error('Enhanced capture failed:', error);
      setIsCapturing(false);
      throw error;
    }
  }, []);

  // Helper functions
  const detectMake = () => {
    const ua = navigator.userAgent;
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'Apple';
    if (ua.includes('Samsung')) return 'Samsung';
    if (ua.includes('Google')) return 'Google';
    if (ua.includes('OnePlus')) return 'OnePlus';
    if (ua.includes('Xiaomi')) return 'Xiaomi';
    return 'Unknown';
  };

  const detectModel = () => {
    const ua = navigator.userAgent;
    const w = window.screen.width;
    const h = window.screen.height;
    
    // iPhone detection based on screen dimensions
    if (ua.includes('iPhone')) {
      const dims = `${Math.min(w,h)}x${Math.max(w,h)}`;
      const models = {
        '320x568': 'iPhone SE (1st gen)',
        '375x667': 'iPhone 6/7/8/SE2/SE3',
        '414x736': 'iPhone 6/7/8 Plus',
        '375x812': 'iPhone X/XS/11 Pro/12 Mini/13 Mini',
        '390x844': 'iPhone 12/12 Pro/13/13 Pro/14/15',
        '414x896': 'iPhone XR/XS Max/11/11 Pro Max',
        '428x926': 'iPhone 12 Pro Max/13 Pro Max/14 Plus/15 Plus',
        '430x932': 'iPhone 14 Pro Max/15 Pro Max',
        '393x852': 'iPhone 14 Pro/15 Pro'
      };
      return models[dims] || 'iPhone';
    }
    
    if (ua.includes('iPad')) return 'iPad';
    
    // Try to extract Android model
    const androidMatch = ua.match(/\(Linux;.*?(\w+\s+[\w\s]+)\s+Build/);
    if (androidMatch) return androidMatch[1];
    
    return navigator.platform || 'Unknown Device';
  };

  const getAppVersion = () => {
    return process.env.REACT_APP_VERSION || '1.0.0';
  };

  const decimalToDMS = (decimal) => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;
    
    return [degrees, minutes, parseFloat(seconds.toFixed(2))];
  };

  const getLocationWithTimeout = (timeout) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Location timeout'));
      }, timeout);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timer);
          resolve(position);
        },
        (error) => {
          clearTimeout(timer);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: timeout,
          maximumAge: 0
        }
      );
    });
  };

  const getOrientationWithTimeout = (timeout) => {
    return new Promise((resolve) => {
      let handler;
      const timer = setTimeout(() => {
        window.removeEventListener('deviceorientation', handler);
        resolve(null);
      }, timeout);
      
      handler = (event) => {
        clearTimeout(timer);
        window.removeEventListener('deviceorientation', handler);
        resolve(event);
      };
      
      window.addEventListener('deviceorientation', handler);
    });
  };

  return {
    captureWithMetadata,
    isCapturing
  };
};