import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import ExifReader from 'react-native-exif';
import RNFetchBlob from 'react-native-fetch-blob';

export default function App() {
  const [image, setImage] = useState(null);
  const [exifData, setExifData] = useState(null);

  const requestPermissions = async () => {
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (mediaStatus !== 'granted' || cameraStatus !== 'granted') {
      Alert.alert('Sorry, we need camera roll and camera permissions to make this work!');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (!await requestPermissions()) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        exif: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
        readExif(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error picking image:', error.message);
    }
  };

  const readExif = async (uri) => {
    try {
      const exif = await ExifReader.read(uri);
      setExifData(exif);
    } catch (error) {
      Alert.alert('Error reading EXIF:', error.message);
    }
  };

  const uploadToServer = async () => {
    if (!image) return;

    try {
      // Replace this URL with your actual server endpoint
      const uploadUrl = 'https://webhook.site/your-webhook-id';
      
      const response = await RNFetchBlob.fetch('POST', uploadUrl, {
        'Content-Type': 'multipart/form-data',
      }, [
        {
          name: 'image',
          filename: 'image.jpg',
          type: 'image/jpeg',
          data: RNFetchBlob.wrap(image.uri)
        },
        {
          name: 'exif',
          data: JSON.stringify(exifData)
        }
      ]);

      if (response.respInfo.status === 200) {
        Alert.alert('Success', 'Image uploaded successfully!');
      } else {
        Alert.alert('Error', 'Failed to upload image');
      }
    } catch (error) {
      Alert.alert('Upload Error:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>ProofPix Mobile</Text>
      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      {exifData && (
        <View style={styles.metadata}>
          <Text style={styles.metaText}>Timestamp: {exifData.DateTimeOriginal || 'N/A'}</Text>
          <Text style={styles.metaText}>Camera: {exifData.Make} {exifData.Model}</Text>
          <Text style={styles.metaText}>Latitude: {exifData.GPSLatitude || 'N/A'}</Text>
          <Text style={styles.metaText}>Longitude: {exifData.GPSLongitude || 'N/A'}</Text>
        </View>
      )}
      <Button title="Upload to Server" onPress={uploadToServer} disabled={!image} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: '#1e1e1e',
    flexGrow: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    marginVertical: 20,
  },
  metadata: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    width: '100%',
  },
  metaText: {
    color: '#fff',
    marginBottom: 4,
  },
}); 