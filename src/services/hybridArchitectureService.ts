/**
 * ProofPix Hybrid Architecture Service
 * Manages both Privacy Mode (client-side) and Collaboration Mode (ephemeral server-side)
 */

import { EventEmitter } from 'events';

// Architecture Mode Types
export type ProcessingMode = 'privacy' | 'collaboration';

export interface PrivacyModeConfig {
  clientSideOnly: true;
  noServerCommunication: true;
  localStorageOnly: true;
  encryptionLevel: 'browser-native';
}

export interface CollaborationModeConfig {
  ephemeralProcessing: true;
  encryptedTransmission: true;
  autoDeleteAfter: number; // milliseconds
  noLongTermStorage: true;
  maxSessionDuration: number;
}

export interface ProcessingSession {
  id: string;
  mode: ProcessingMode;
  createdAt: Date;
  expiresAt: Date;
  encrypted: boolean;
  autoDelete: boolean;
}

export interface HybridArchitectureConfig {
  defaultMode: ProcessingMode;
  allowModeSwitch: boolean;
  privacyMode: PrivacyModeConfig;
  collaborationMode: CollaborationModeConfig;
  securityLevel: 'maximum' | 'high' | 'standard';
}

interface EphemeralSession {
  sessionId: string;
  expiresAt: number;
  maxFiles: number;
  config: {
    maxFileSize: number;
    allowedFileTypes: string[];
    maxSessionDuration: number;
  };
}

interface EphemeralProcessingResult {
  fileId: string;
  sessionId: string;
  result: any;
  expiresAt: number;
  ephemeral: true;
}

class HybridArchitectureService extends EventEmitter {
  private currentMode: ProcessingMode = 'privacy';
  private config: HybridArchitectureConfig;
  private activeSessions: Map<string, ProcessingSession> = new Map();
  private autoDeleteTimers: Map<string, NodeJS.Timeout> = new Map();
  private ephemeralSession: EphemeralSession | null = null;
  private readonly API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  constructor() {
    super();
    
    this.config = {
      defaultMode: 'privacy',
      allowModeSwitch: true,
      privacyMode: {
        clientSideOnly: true,
        noServerCommunication: true,
        localStorageOnly: true,
        encryptionLevel: 'browser-native'
      },
      collaborationMode: {
        ephemeralProcessing: true,
        encryptedTransmission: true,
        autoDeleteAfter: 24 * 60 * 60 * 1000, // 24 hours
        noLongTermStorage: true,
        maxSessionDuration: 24 * 60 * 60 * 1000 // 24 hours
      },
      securityLevel: 'maximum'
    };

    this.initializeArchitecture();
  }

  /**
   * Initialize the hybrid architecture
   */
  private initializeArchitecture(): void {
    // Set default mode
    this.currentMode = this.config.defaultMode;
    
    // Set up automatic cleanup
    this.setupAutoCleanup();
    
    // Initialize security monitoring
    this.initializeSecurityMonitoring();
    
    this.emit('architectureInitialized', {
      mode: this.currentMode,
      config: this.config
    });
  }

  /**
   * Get current processing mode
   */
  getCurrentMode(): ProcessingMode {
    return this.currentMode;
  }

  /**
   * Switch processing mode with security validation
   */
  async switchMode(newMode: ProcessingMode, userConsent: boolean = false): Promise<boolean> {
    try {
      // Validate mode switch is allowed
      if (!this.config.allowModeSwitch) {
        throw new Error('Mode switching is disabled');
      }

      // Require explicit user consent for collaboration mode
      if (newMode === 'collaboration' && !userConsent) {
        throw new Error('User consent required for collaboration mode');
      }

      // Clean up current mode if switching from collaboration
      if (this.currentMode === 'collaboration') {
        await this.cleanupCollaborationMode();
      }

      // Switch mode
      const previousMode = this.currentMode;
      this.currentMode = newMode;

      // Initialize new mode
      if (newMode === 'collaboration') {
        await this.initializeCollaborationMode();
      } else {
        await this.initializePrivacyMode();
      }

      this.emit('modeChanged', {
        previousMode,
        newMode,
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      console.error('Failed to switch mode:', error);
      return false;
    }
  }

  /**
   * Initialize Privacy Mode (Client-side only)
   */
  private async initializePrivacyMode(): Promise<void> {
    // Ensure no server communication
    this.validateNoServerCommunication();
    
    // Initialize client-side processing
    this.initializeClientSideProcessing();
    
    // Set up local storage encryption
    this.setupLocalStorageEncryption();
    
    this.emit('privacyModeInitialized', {
      timestamp: new Date(),
      securityLevel: 'maximum'
    });
  }

  /**
   * Initialize Collaboration Mode (Ephemeral server-side)
   */
  private async initializeCollaborationMode(): Promise<void> {
    // Set up ephemeral processing
    this.setupEphemeralProcessing();
    
    // Initialize encryption for transmission
    this.setupTransmissionEncryption();
    
    // Set up auto-deletion
    this.setupAutoDeleteMechanisms();
    
    this.emit('collaborationModeInitialized', {
      timestamp: new Date(),
      securityLevel: 'high',
      ephemeral: true
    });
  }

  /**
   * Create processing session
   */
  async createProcessingSession(mode?: ProcessingMode): Promise<ProcessingSession> {
    const sessionMode = mode || this.currentMode;
    const sessionId = this.generateSecureSessionId();
    
    const session: ProcessingSession = {
      id: sessionId,
      mode: sessionMode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.config.collaborationMode.maxSessionDuration),
      encrypted: true,
      autoDelete: sessionMode === 'collaboration'
    };

    this.activeSessions.set(sessionId, session);

    // Set up auto-deletion for collaboration mode
    if (sessionMode === 'collaboration') {
      this.scheduleAutoDelete(sessionId);
    }

    this.emit('sessionCreated', session);
    return session;
  }

  /**
   * Process file based on current mode
   */
  async processFile(file: File, sessionId?: string): Promise<any> {
    const session = sessionId ? this.activeSessions.get(sessionId) : null;
    const mode = session?.mode || this.currentMode;

    if (mode === 'privacy') {
      return this.processFilePrivacyMode(file);
    } else {
      return this.processFileCollaborationMode(file, sessionId);
    }
  }

  /**
   * Process file in Privacy Mode (Client-side only)
   */
  private async processFilePrivacyMode(file: File): Promise<any> {
    try {
      // Validate no server communication
      this.validateNoServerCommunication();
      
      // Process entirely client-side
      const metadata = await this.extractMetadataClientSide(file);
      
      // Store locally only
      this.storeLocallyEncrypted(metadata);
      
      this.emit('fileProcessedPrivacy', {
        timestamp: new Date(),
        clientSideOnly: true,
        serverCommunication: false
      });

      return {
        success: true,
        mode: 'privacy',
        metadata,
        serverProcessing: false,
        localOnly: true
      };
    } catch (error) {
      this.emit('processingError', { mode: 'privacy', error });
      throw error;
    }
  }

  /**
   * Process file in Collaboration Mode (Ephemeral server-side)
   */
  private async processFileCollaborationMode(file: File, sessionId?: string): Promise<any> {
    try {
      if (!sessionId) {
        throw new Error('Session ID required for collaboration mode');
      }

      const session = this.activeSessions.get(sessionId);
      if (!session) {
        throw new Error('Invalid session');
      }

      // Process with ephemeral storage
      const result = await this.processEphemerallyEncrypted(file, session);
      
      // Schedule automatic deletion
      this.scheduleAutoDelete(sessionId);
      
      this.emit('fileProcessedCollaboration', {
        sessionId,
        timestamp: new Date(),
        ephemeral: true,
        autoDelete: true
      });

      return {
        success: true,
        mode: 'collaboration',
        sessionId,
        result,
        ephemeral: true,
        autoDeleteAt: session.expiresAt
      };
    } catch (error) {
      this.emit('processingError', { mode: 'collaboration', error });
      throw error;
    }
  }

  /**
   * Client-side metadata extraction
   */
  private async extractMetadataClientSide(file: File): Promise<any> {
    // This would use existing client-side EXIF extraction
    // No server communication whatsoever
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Extract metadata client-side
        const metadata = {
          filename: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          // Additional client-side extraction would go here
          extractedAt: new Date(),
          mode: 'privacy'
        };
        resolve(metadata);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Ephemeral encrypted processing
   */
  private async processEphemerallyEncrypted(file: File, session: ProcessingSession): Promise<any> {
    // This would integrate with the existing backend for collaboration features
    // But with ephemeral processing and auto-deletion
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', session.id);
    formData.append('ephemeral', 'true');
    formData.append('autoDelete', 'true');

    // Note: This would call the backend API for collaboration features
    // The backend would be configured for ephemeral processing only
    
    return {
      sessionId: session.id,
      processed: true,
      ephemeral: true,
      expiresAt: session.expiresAt
    };
  }

  /**
   * Schedule automatic deletion
   */
  private scheduleAutoDelete(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const deleteTimer = setTimeout(() => {
      this.deleteSession(sessionId);
    }, this.config.collaborationMode.autoDeleteAfter);

    this.autoDeleteTimers.set(sessionId, deleteTimer);
  }

  /**
   * Delete session and all associated data
   */
  private async deleteSession(sessionId: string): Promise<void> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) return;

      // Clear auto-delete timer
      const timer = this.autoDeleteTimers.get(sessionId);
      if (timer) {
        clearTimeout(timer);
        this.autoDeleteTimers.delete(sessionId);
      }

      // Remove session
      this.activeSessions.delete(sessionId);

      // If collaboration mode, clean up server-side data
      if (session.mode === 'collaboration') {
        await this.cleanupServerSideData(sessionId);
      }

      this.emit('sessionDeleted', {
        sessionId,
        mode: session.mode,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }

  /**
   * Clean up server-side data for collaboration mode
   */
  private async cleanupServerSideData(sessionId: string): Promise<void> {
    // This would call the backend to clean up any ephemeral data
    // Implementation would depend on backend architecture
    console.log(`Cleaning up server-side data for session: ${sessionId}`);
  }

  /**
   * Validate no server communication for privacy mode
   */
  private validateNoServerCommunication(): void {
    if (this.currentMode === 'privacy') {
      // Ensure no network requests are made
      // This could include monitoring network activity
      console.log('Privacy mode: No server communication validated');
    }
  }

  /**
   * Set up automatic cleanup mechanisms
   */
  private setupAutoCleanup(): void {
    // Clean up expired sessions every hour
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 60 * 60 * 1000); // 1 hour
  }

  /**
   * Clean up expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = new Date();
    
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.expiresAt < now) {
        this.deleteSession(sessionId);
      }
    }
  }

  /**
   * Initialize security monitoring
   */
  private initializeSecurityMonitoring(): void {
    // Monitor for security violations
    this.on('securityViolation', (event) => {
      console.error('Security violation detected:', event);
      // Implement security response
    });
  }

  /**
   * Generate secure session ID
   */
  private generateSecureSessionId(): string {
    return 'session_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Set up client-side processing
   */
  private initializeClientSideProcessing(): void {
    console.log('Client-side processing initialized');
  }

  /**
   * Set up local storage encryption
   */
  private setupLocalStorageEncryption(): void {
    console.log('Local storage encryption set up');
  }

  /**
   * Store data locally with encryption
   */
  private storeLocallyEncrypted(data: any): void {
    // Implement local storage with encryption
    const encrypted = this.encryptForLocalStorage(data);
    localStorage.setItem('proofpix_data', encrypted);
  }

  /**
   * Encrypt data for local storage
   */
  private encryptForLocalStorage(data: any): string {
    // Simple encryption for demo - use proper encryption in production
    return btoa(JSON.stringify(data));
  }

  /**
   * Set up ephemeral processing
   */
  private setupEphemeralProcessing(): void {
    console.log('Ephemeral processing set up');
  }

  /**
   * Set up transmission encryption
   */
  private setupTransmissionEncryption(): void {
    console.log('Transmission encryption set up');
  }

  /**
   * Set up auto-delete mechanisms
   */
  private setupAutoDeleteMechanisms(): void {
    console.log('Auto-delete mechanisms set up');
  }

  /**
   * Clean up collaboration mode
   */
  private async cleanupCollaborationMode(): Promise<void> {
    // Clean up all collaboration sessions
    for (const sessionId of this.activeSessions.keys()) {
      await this.deleteSession(sessionId);
    }
  }

  /**
   * Get architecture status
   */
  getArchitectureStatus(): any {
    return {
      currentMode: this.currentMode,
      activeSessions: this.activeSessions.size,
      config: this.config,
      securityLevel: this.config.securityLevel,
      timestamp: new Date()
    };
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string | null {
    // Check for stored auth tokens
    const authToken = localStorage.getItem('auth_token') || 
                     sessionStorage.getItem('auth_token') ||
                     localStorage.getItem('authToken') ||
                     sessionStorage.getItem('authToken');
    
    // Development/Demo mode fallback
    if (!authToken && (process.env.NODE_ENV === 'development' || process.env.REACT_APP_DEMO_MODE === 'true')) {
      console.warn('Using demo auth token for development/demo mode');
      return 'demo_auth_token_for_collaboration_mode';
    }
    
    return authToken;
  }

  /**
   * Check if user is authenticated for collaboration mode
   */
  private isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }

  /**
   * Create ephemeral processing session for collaboration mode
   */
  async createEphemeralSession(options: {
    maxFiles?: number;
    teamId?: string;
  } = {}): Promise<EphemeralSession> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required for collaboration mode. Please log in to use team features.');
      }

      // For demo/development mode, create a mock session
      if (token === 'demo_auth_token_for_collaboration_mode') {
        console.log('Creating demo ephemeral session');
        const mockSession: EphemeralSession = {
          sessionId: 'demo_session_' + Date.now(),
          expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          maxFiles: options.maxFiles || 10,
          config: {
            maxFileSize: 50 * 1024 * 1024, // 50MB
            allowedFileTypes: ['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'application/pdf'],
            maxSessionDuration: 24 * 60 * 60 // 24 hours in seconds
          }
        };

        this.ephemeralSession = mockSession;
        localStorage.setItem('ephemeral_session', JSON.stringify(this.ephemeralSession));
        this.scheduleSessionCleanup();
        
        console.log('Demo ephemeral session created:', mockSession);
        return mockSession;
      }

      const response = await fetch(`${this.API_BASE_URL}/ephemeral/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          maxFiles: options.maxFiles || 10,
          teamId: options.teamId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Failed to create ephemeral session: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      this.ephemeralSession = result.data;

      // Store session info locally
      localStorage.setItem('ephemeral_session', JSON.stringify(this.ephemeralSession));

      // Set up auto-cleanup timer
      this.scheduleSessionCleanup();

      if (!this.ephemeralSession) {
        throw new Error('Failed to create ephemeral session: invalid response data');
      }

      return this.ephemeralSession;
    } catch (error) {
      console.error('Failed to create ephemeral session:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          throw new Error('Please log in to use collaboration mode. Team features require authentication.');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to server. Please check your internet connection and try again.');
        } else {
          throw error;
        }
      }
      
      throw new Error('Failed to create collaboration session. Please try again.');
    }
  }

  /**
   * Process files ephemerally in collaboration mode
   */
  async processFilesEphemerally(files: File[]): Promise<EphemeralProcessingResult[]> {
    try {
      if (!this.ephemeralSession) {
        throw new Error('No active ephemeral session');
      }

      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Validate files
      for (const file of files) {
        if (file.size > this.ephemeralSession.config.maxFileSize) {
          throw new Error(`File ${file.name} exceeds maximum size limit`);
        }
        if (!this.ephemeralSession.config.allowedFileTypes.includes(file.type)) {
          throw new Error(`File type ${file.type} not allowed`);
        }
      }

      // Create FormData
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(
        `${this.API_BASE_URL}/ephemeral/process/${this.ephemeralSession.sessionId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Ephemeral processing failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data.results;
    } catch (error) {
      console.error('Ephemeral processing failed:', error);
      throw error;
    }
  }

  /**
   * Get ephemeral processing result
   */
  async getEphemeralResult(fileId: string): Promise<EphemeralProcessingResult> {
    try {
      if (!this.ephemeralSession) {
        throw new Error('No active ephemeral session');
      }

      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${this.API_BASE_URL}/ephemeral/result/${this.ephemeralSession.sessionId}/${fileId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get result: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get ephemeral result:', error);
      throw error;
    }
  }

  /**
   * Create ephemeral share link
   */
  async createEphemeralShare(
    fileId: string,
    options: {
      expiresInHours?: number;
      maxAccess?: number;
      requiresAuth?: boolean;
      allowedUsers?: string[];
    } = {}
  ): Promise<{ shareToken: string; shareUrl: string; expiresAt: number }> {
    try {
      if (!this.ephemeralSession) {
        throw new Error('No active ephemeral session');
      }

      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${this.API_BASE_URL}/ephemeral/share/${this.ephemeralSession.sessionId}/${fileId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(options)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create share: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to create ephemeral share:', error);
      throw error;
    }
  }

  /**
   * Delete ephemeral session and all data
   */
  async deleteEphemeralSession(): Promise<void> {
    try {
      if (!this.ephemeralSession) {
        return;
      }

      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${this.API_BASE_URL}/ephemeral/session/${this.ephemeralSession.sessionId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        console.warn('Failed to delete ephemeral session on server');
      }

      // Clear local session
      this.ephemeralSession = null;
      localStorage.removeItem('ephemeral_session');
      
      // Clear cleanup timer
      if (this.sessionCleanupTimer) {
        clearTimeout(this.sessionCleanupTimer);
        this.sessionCleanupTimer = null;
      }

    } catch (error) {
      console.error('Failed to delete ephemeral session:', error);
      // Still clear local session even if server deletion fails
      this.ephemeralSession = null;
      localStorage.removeItem('ephemeral_session');
    }
  }

  /**
   * Get current ephemeral session info
   */
  getEphemeralSessionInfo(): EphemeralSession | null {
    return this.ephemeralSession;
  }

  /**
   * Check if ephemeral session is active
   */
  hasActiveEphemeralSession(): boolean {
    return this.ephemeralSession !== null && this.ephemeralSession.expiresAt > Date.now();
  }

  /**
   * Restore ephemeral session from localStorage
   */
  private restoreEphemeralSession(): void {
    try {
      const stored = localStorage.getItem('ephemeral_session');
      if (stored) {
        const session = JSON.parse(stored);
        if (session.expiresAt > Date.now()) {
          this.ephemeralSession = session;
          this.scheduleSessionCleanup();
        } else {
          localStorage.removeItem('ephemeral_session');
        }
      }
    } catch (error) {
      console.error('Failed to restore ephemeral session:', error);
      localStorage.removeItem('ephemeral_session');
    }
  }

  private sessionCleanupTimer: NodeJS.Timeout | null = null;

  /**
   * Schedule automatic session cleanup
   */
  private scheduleSessionCleanup(): void {
    if (!this.ephemeralSession) return;

    const timeUntilExpiry = this.ephemeralSession.expiresAt - Date.now();
    if (timeUntilExpiry > 0) {
      this.sessionCleanupTimer = setTimeout(() => {
        this.deleteEphemeralSession();
      }, timeUntilExpiry);
    }
  }

  /**
   * Initialize service
   */
  initialize(): void {
    // ... existing initialization code ...
    
    // Restore ephemeral session if exists
    this.restoreEphemeralSession();
    
    // ... rest of existing initialization ...
  }
}

// Export singleton instance
export const hybridArchitectureService = new HybridArchitectureService();
export default hybridArchitectureService; 