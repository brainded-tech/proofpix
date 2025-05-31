/**
 * ProofPix Mobile API Service
 * Mobile-optimized API service with offline support and background sync
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { MMKV } from 'react-native-mmkv';
import DeviceInfo from 'react-native-device-info';

// Mobile-specific storage
const storage = new MMKV();

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api' 
  : 'https://api.proofpix.com/api';

interface QueuedRequest {
  id: string;
  method: string;
  url: string;
  data?: any;
  headers?: any;
  timestamp: number;
  retryCount: number;
}

interface OfflineFile {
  id: string;
  uri: string;
  name: string;
  type: string;
  size: number;
  metadata?: any;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  timestamp: number;
}

class MobileApiService {
  private apiClient: AxiosInstance;
  private isOnline: boolean = true;
  private requestQueue: QueuedRequest[] = [];
  private offlineFiles: OfflineFile[] = [];
  private syncInProgress: boolean = false;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `ProofPix-Mobile/${DeviceInfo.getVersion()}`,
      },
    });

    this.setupInterceptors();
    this.setupNetworkListener();
    this.loadOfflineData();
  }

  private setupInterceptors() {
    // Request interceptor
    this.apiClient.interceptors.request.use(
      async (config) => {
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add device info
        config.headers['X-Device-ID'] = await DeviceInfo.getUniqueId();
        config.headers['X-Device-Platform'] = DeviceInfo.getSystemName();
        config.headers['X-App-Version'] = DeviceInfo.getVersion();

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.clearAuthToken();
          // Navigate to login screen
          // NavigationService.navigate('Login');
        }

        // Queue request for retry if offline
        if (!this.isOnline && error.config) {
          this.queueRequest(error.config);
        }

        return Promise.reject(error);
      }
    );
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      if (wasOffline && this.isOnline) {
        this.syncOfflineData();
      }
    });
  }

  private loadOfflineData() {
    try {
      const queueData = storage.getString('requestQueue');
      if (queueData) {
        this.requestQueue = JSON.parse(queueData);
      }

      const filesData = storage.getString('offlineFiles');
      if (filesData) {
        this.offlineFiles = JSON.parse(filesData);
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  }

  private saveOfflineData() {
    try {
      storage.set('requestQueue', JSON.stringify(this.requestQueue));
      storage.set('offlineFiles', JSON.stringify(this.offlineFiles));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  private queueRequest(config: any) {
    const queuedRequest: QueuedRequest = {
      id: Date.now().toString(),
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.requestQueue.push(queuedRequest);
    this.saveOfflineData();
  }

  private async syncOfflineData() {
    if (this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;

    try {
      // Sync queued requests
      for (const request of this.requestQueue) {
        try {
          await this.apiClient.request({
            method: request.method,
            url: request.url,
            data: request.data,
            headers: request.headers,
          });

          // Remove successful request from queue
          this.requestQueue = this.requestQueue.filter(r => r.id !== request.id);
        } catch (error) {
          request.retryCount++;
          if (request.retryCount >= 3) {
            // Remove failed request after 3 retries
            this.requestQueue = this.requestQueue.filter(r => r.id !== request.id);
          }
        }
      }

      // Sync offline files
      for (const file of this.offlineFiles) {
        if (file.status === 'pending') {
          try {
            await this.uploadFileFromCache(file);
          } catch (error) {
            console.error('Error uploading cached file:', error);
          }
        }
      }

      this.saveOfflineData();
    } finally {
      this.syncInProgress = false;
    }
  }

  // Authentication methods
  async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem('authToken', token);
  }

  async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  async clearAuthToken(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
  }

  // File upload with offline support
  async uploadFile(
    fileUri: string,
    fileName: string,
    fileType: string,
    options?: {
      generateThumbnail?: boolean;
      extractMetadata?: boolean;
      virusScan?: boolean;
    }
  ): Promise<any> {
    const fileSize = await this.getFileSize(fileUri);
    
    const offlineFile: OfflineFile = {
      id: Date.now().toString(),
      uri: fileUri,
      name: fileName,
      type: fileType,
      size: fileSize,
      metadata: options,
      uploadProgress: 0,
      status: 'pending',
      timestamp: Date.now(),
    };

    this.offlineFiles.push(offlineFile);
    this.saveOfflineData();

    if (this.isOnline) {
      return this.uploadFileFromCache(offlineFile);
    } else {
      return { id: offlineFile.id, status: 'queued' };
    }
  }

  private async uploadFileFromCache(file: OfflineFile): Promise<any> {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    if (file.metadata) {
      Object.entries(file.metadata).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    file.status = 'uploading';
    this.saveOfflineData();

    try {
      const response = await this.apiClient.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          file.uploadProgress = progress;
          this.saveOfflineData();
        },
      });

      file.status = 'completed';
      this.saveOfflineData();

      return response.data;
    } catch (error) {
      file.status = 'failed';
      this.saveOfflineData();
      throw error;
    }
  }

  private async getFileSize(uri: string): Promise<number> {
    try {
      const RNFS = require('react-native-fs');
      const stat = await RNFS.stat(uri);
      return stat.size;
    } catch (error) {
      return 0;
    }
  }

  // Camera capture and upload
  async captureAndUpload(options?: {
    quality?: number;
    includeBase64?: boolean;
    mediaType?: 'photo' | 'video';
  }): Promise<any> {
    const ImagePicker = require('react-native-image-picker');
    
    return new Promise((resolve, reject) => {
      ImagePicker.launchCamera(
        {
          mediaType: options?.mediaType || 'photo',
          quality: options?.quality || 0.8,
          includeBase64: options?.includeBase64 || false,
        },
        async (response: any) => {
          if (response.didCancel || response.error) {
            reject(new Error(response.error || 'Camera cancelled'));
            return;
          }

          const asset = response.assets[0];
          try {
            const result = await this.uploadFile(
              asset.uri,
              asset.fileName || 'camera_capture.jpg',
              asset.type || 'image/jpeg',
              {
                generateThumbnail: true,
                extractMetadata: true,
                virusScan: true,
              }
            );
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  // Document picker and upload
  async pickAndUploadDocument(): Promise<any> {
    const DocumentPicker = require('react-native-document-picker');
    
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const file = result[0];
      return await this.uploadFile(
        file.uri,
        file.name,
        file.type,
        {
          extractMetadata: true,
          virusScan: true,
        }
      );
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        throw new Error('Document picker cancelled');
      }
      throw error;
    }
  }

  // Get files with offline caching
  async getFiles(params?: {
    page?: number;
    limit?: number;
    status?: string;
    mimeType?: string;
  }): Promise<any> {
    const cacheKey = `files_${JSON.stringify(params)}`;
    
    try {
      const response = await this.apiClient.get('/files', { params });
      
      // Cache the response
      storage.set(cacheKey, JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      // Return cached data if offline
      if (!this.isOnline) {
        const cachedData = storage.getString(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      }
      throw error;
    }
  }

  // Analytics with offline caching
  async getAnalytics(params?: {
    timeRange?: { start: Date; end: Date };
    metrics?: string[];
  }): Promise<any> {
    const cacheKey = `analytics_${JSON.stringify(params)}`;
    
    try {
      const response = await this.apiClient.get('/analytics/metrics', { params });
      
      // Cache the response
      storage.set(cacheKey, JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      // Return cached data if offline
      if (!this.isOnline) {
        const cachedData = storage.getString(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      }
      throw error;
    }
  }

  // Usage stats with offline caching
  async getUsageStats(): Promise<any> {
    const cacheKey = 'usage_stats';
    
    try {
      const response = await this.apiClient.get('/analytics/usage');
      
      // Cache the response
      storage.set(cacheKey, JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      // Return cached data if offline
      if (!this.isOnline) {
        const cachedData = storage.getString(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      }
      throw error;
    }
  }

  // Security events
  async getSecurityEvents(params?: {
    page?: number;
    limit?: number;
    severity?: string;
  }): Promise<any> {
    const response = await this.apiClient.get('/security/events', { params });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.apiClient.get('/health');
    return response.data;
  }

  // Get offline status and queued items
  getOfflineStatus() {
    return {
      isOnline: this.isOnline,
      queuedRequests: this.requestQueue.length,
      pendingFiles: this.offlineFiles.filter(f => f.status === 'pending').length,
      syncInProgress: this.syncInProgress,
    };
  }

  // Clear offline cache
  clearOfflineCache() {
    this.requestQueue = [];
    this.offlineFiles = [];
    storage.clearAll();
  }

  // Get cached files
  getCachedFiles(): OfflineFile[] {
    return this.offlineFiles;
  }

  // Remove cached file
  removeCachedFile(fileId: string) {
    this.offlineFiles = this.offlineFiles.filter(f => f.id !== fileId);
    this.saveOfflineData();
  }
}

export default new MobileApiService(); 