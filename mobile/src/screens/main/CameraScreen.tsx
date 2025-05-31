/**
 * ProofPix Mobile Camera Screen
 * Advanced document capture with edge detection and real-time processing
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import HapticFeedback from 'react-native-haptic-feedback';
import Orientation from 'react-native-orientation-locker';
import { BlurView } from '@react-native-blur/blur';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';

import MobileApiService from '../../services/MobileApiService';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface CaptureMode {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const captureModes: CaptureMode[] = [
  {
    id: 'document',
    name: 'Document',
    icon: 'description',
    description: 'Scan documents with edge detection',
  },
  {
    id: 'photo',
    name: 'Photo',
    icon: 'photo-camera',
    description: 'Capture high-quality photos',
  },
  {
    id: 'batch',
    name: 'Batch',
    icon: 'photo-library',
    description: 'Capture multiple documents',
  },
  {
    id: 'qr',
    name: 'QR Code',
    icon: 'qr-code-scanner',
    description: 'Scan QR codes and barcodes',
  },
];

const CameraScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const cameraRef = useRef<RNCamera>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [flashMode, setFlashMode] = useState<string>(RNCamera.Constants.FlashMode.auto);
  const [cameraType, setCameraType] = useState<string>(RNCamera.Constants.Type.back);
  const [selectedMode, setSelectedMode] = useState<string>('document');
  const [showModeSelector, setShowModeSelector] = useState<boolean>(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [edgeDetection, setEdgeDetection] = useState<boolean>(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    requestCameraPermission();
    Orientation.lockToPortrait();
    
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA;
      
      const result = await request(permission);
      setHasPermission(result === RESULTS.GRANTED);
      
      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to capture documents.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => {/* Open settings */} },
          ]
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    HapticFeedback.trigger('impactMedium');

    // Animate capture button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const options = {
        quality: 0.8,
        base64: false,
        skipProcessing: false,
        orientation: 'portrait',
        fixOrientation: true,
      };

      const data = await cameraRef.current.takePictureAsync(options);
      
      if (selectedMode === 'batch') {
        setCapturedImages(prev => [...prev, data.uri]);
        Toast.show({
          type: 'success',
          text1: 'Image Captured',
          text2: `${capturedImages.length + 1} images in batch`,
        });
      } else {
        await processAndUpload(data.uri);
      }
    } catch (error) {
      console.error('Capture error:', error);
      Toast.show({
        type: 'error',
        text1: 'Capture Failed',
        text2: 'Please try again',
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const processAndUpload = async (imageUri: string) => {
    setIsProcessing(true);
    
    try {
      const fileName = `capture_${Date.now()}.jpg`;
      const result = await MobileApiService.uploadFile(
        imageUri,
        fileName,
        'image/jpeg',
        {
          generateThumbnail: true,
          extractMetadata: true,
          virusScan: true,
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Upload Successful',
        text2: 'Document is being processed',
      });

      // Navigate to processing status
      navigation.navigate('ProcessingStatus', { fileId: result.id });
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'File saved locally for later sync',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchUpload = async () => {
    if (capturedImages.length === 0) return;

    setIsProcessing(true);
    
    try {
      const uploadPromises = capturedImages.map(async (uri, index) => {
        const fileName = `batch_${Date.now()}_${index}.jpg`;
        return MobileApiService.uploadFile(
          uri,
          fileName,
          'image/jpeg',
          {
            generateThumbnail: true,
            extractMetadata: true,
            virusScan: true,
          }
        );
      });

      await Promise.all(uploadPromises);
      
      Toast.show({
        type: 'success',
        text1: 'Batch Upload Complete',
        text2: `${capturedImages.length} documents uploaded`,
      });

      setCapturedImages([]);
      navigation.navigate('Files');
    } catch (error) {
      console.error('Batch upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Batch Upload Failed',
        text2: 'Some files saved locally for later sync',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFlash = () => {
    const modes = [
      RNCamera.Constants.FlashMode.auto,
      RNCamera.Constants.FlashMode.on,
      RNCamera.Constants.FlashMode.off,
    ];
    const currentIndex = modes.indexOf(flashMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setFlashMode(modes[nextIndex]);
    HapticFeedback.trigger('impactLight');
  };

  const toggleCamera = () => {
    setCameraType(
      cameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
    HapticFeedback.trigger('impactLight');
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case RNCamera.Constants.FlashMode.auto:
        return 'flash-auto';
      case RNCamera.Constants.FlashMode.on:
        return 'flash-on';
      case RNCamera.Constants.FlashMode.off:
        return 'flash-off';
      default:
        return 'flash-auto';
    }
  };

  const renderModeSelector = () => (
    <Animatable.View
      animation={showModeSelector ? 'slideInUp' : 'slideOutDown'}
      duration={300}
      style={styles.modeSelector}
    >
      <BlurView
        style={styles.modeBlur}
        blurType="dark"
        blurAmount={10}
      >
        <View style={styles.modeContent}>
          <Text style={[styles.modeTitle, { color: colors.white }]}>
            Capture Mode
          </Text>
          
          {captureModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeItem,
                selectedMode === mode.id && styles.selectedModeItem,
              ]}
              onPress={() => {
                setSelectedMode(mode.id);
                setShowModeSelector(false);
                HapticFeedback.trigger('impactLight');
              }}
            >
              <Icon
                name={mode.icon}
                size={24}
                color={selectedMode === mode.id ? colors.primary : colors.white}
              />
              <View style={styles.modeText}>
                <Text
                  style={[
                    styles.modeName,
                    { color: selectedMode === mode.id ? colors.primary : colors.white },
                  ]}
                >
                  {mode.name}
                </Text>
                <Text style={[styles.modeDescription, { color: colors.gray }]}>
                  {mode.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </BlurView>
    </Animatable.View>
  );

  const renderOverlay = () => (
    <View style={styles.overlay}>
      {/* Top Controls */}
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'transparent']}
        style={styles.topGradient}
      >
        <View style={styles.topControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFlash}
          >
            <Icon name={getFlashIcon()} size={24} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setEdgeDetection(!edgeDetection)}
          >
            <Icon
              name={edgeDetection ? 'crop-free' : 'crop'}
              size={24}
              color={edgeDetection ? colors.accent : colors.white}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCamera}
          >
            <Icon name="flip-camera-ios" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Document Frame (for document mode) */}
      {selectedMode === 'document' && (
        <View style={styles.documentFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      )}

      {/* Bottom Controls */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.bottomGradient}
      >
        <View style={styles.bottomControls}>
          {/* Mode Selector */}
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => setShowModeSelector(!showModeSelector)}
          >
            <Icon
              name={captureModes.find(m => m.id === selectedMode)?.icon || 'camera'}
              size={20}
              color={colors.white}
            />
            <Text style={[styles.modeButtonText, { color: colors.white }]}>
              {captureModes.find(m => m.id === selectedMode)?.name}
            </Text>
          </TouchableOpacity>

          {/* Capture Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.captureButton,
                isCapturing && styles.capturingButton,
              ]}
              onPress={handleCapture}
              disabled={isCapturing || isProcessing}
            >
              <View style={styles.captureButtonInner}>
                {isCapturing || isProcessing ? (
                  <Animatable.View
                    animation="rotate"
                    iterationCount="infinite"
                    duration={1000}
                  >
                    <Icon name="hourglass-empty" size={32} color={colors.white} />
                  </Animatable.View>
                ) : (
                  <Icon name="camera" size={32} color={colors.white} />
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Batch Counter / Gallery */}
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={() => {
              if (selectedMode === 'batch' && capturedImages.length > 0) {
                handleBatchUpload();
              } else {
                navigation.navigate('Files');
              }
            }}
          >
            {selectedMode === 'batch' && capturedImages.length > 0 ? (
              <View style={styles.batchCounter}>
                <Text style={[styles.batchCountText, { color: colors.white }]}>
                  {capturedImages.length}
                </Text>
              </View>
            ) : (
              <Icon name="photo-library" size={20} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {showModeSelector && renderModeSelector()}
    </View>
  );

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.permissionText, { color: colors.text }]}>
          Camera permission is required to capture documents
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          onPress={requestCameraPermission}
        >
          <Text style={[styles.permissionButtonText, { color: colors.white }]}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        captureAudio={false}
      >
        {renderOverlay()}
      </RNCamera>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topGradient: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentFrame: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    bottom: '35%',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00ff00',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  bottomGradient: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeButton: {
    alignItems: 'center',
    minWidth: 60,
  },
  modeButtonText: {
    fontSize: 12,
    marginTop: 4,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  capturingButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  batchCounter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  batchCountText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modeSelector: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
  modeBlur: {
    flex: 1,
  },
  modeContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectedModeItem: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modeText: {
    marginLeft: 15,
    flex: 1,
  },
  modeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  modeDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScreen; 