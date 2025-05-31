/**
 * Hybrid Mode Selector Component
 * Allows users to choose between Privacy Mode and Collaboration Mode
 */

import React, { useState, useEffect } from 'react';
import { Shield, Users, Lock, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { hybridArchitectureService, ProcessingMode } from '../services/hybridArchitectureService';

interface HybridModeSelectorProps {
  onModeChange?: (mode: ProcessingMode) => void;
  showDetails?: boolean;
  className?: string;
}

export const HybridModeSelector: React.FC<HybridModeSelectorProps> = ({
  onModeChange,
  showDetails = true,
  className = ''
}) => {
  const [currentMode, setCurrentMode] = useState<ProcessingMode>('privacy');
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [architectureStatus, setArchitectureStatus] = useState<any>(null);
  const [pendingMode, setPendingMode] = useState<ProcessingMode | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial mode and status
    const mode = hybridArchitectureService.getCurrentMode();
    const status = hybridArchitectureService.getArchitectureStatus();
    
    setCurrentMode(mode);
    setArchitectureStatus(status);

    // Listen for mode changes
    const handleModeChange = (event: any) => {
      setCurrentMode(event.newMode);
      setArchitectureStatus(hybridArchitectureService.getArchitectureStatus());
      onModeChange?.(event.newMode);
    };

    hybridArchitectureService.on('modeChanged', handleModeChange);

    return () => {
      hybridArchitectureService.off('modeChanged', handleModeChange);
    };
  }, [onModeChange]);

  const handleModeSelection = async (mode: ProcessingMode) => {
    if (mode === currentMode) return;

    if (mode === 'collaboration') {
      // Show consent modal for collaboration mode
      setPendingMode(mode);
      setShowConsentModal(true);
    } else {
      // Switch to privacy mode immediately
      await switchToPrivacyMode();
    }
  };

  const handleConsentAccept = async () => {
    if (pendingMode === 'collaboration') {
      await switchToCollaborationMode();
    }
    setShowConsentModal(false);
    setPendingMode(null);
  };

  const handleConsentDecline = () => {
    setShowConsentModal(false);
    setPendingMode(null);
  };

  const switchToPrivacyMode = async () => {
    try {
      // Delete any existing ephemeral session
      await hybridArchitectureService.deleteEphemeralSession();
      
      // Switch to privacy mode
      await hybridArchitectureService.switchMode('privacy');
      onModeChange?.('privacy');
      
      setSessionInfo(null);
      setSessionError(null);
    } catch (error) {
      console.error('Failed to switch to privacy mode:', error);
    }
  };

  const switchToCollaborationMode = async () => {
    setIsCreatingSession(true);
    setSessionError(null);

    try {
      // Create ephemeral session
      const session = await hybridArchitectureService.createEphemeralSession({
        maxFiles: 10
      });

      // Switch to collaboration mode
      await hybridArchitectureService.switchMode('collaboration', true);
      onModeChange?.('collaboration');
      
      setSessionInfo(session);
    } catch (error) {
      console.error('Failed to create ephemeral session:', error);
      setSessionError(error instanceof Error ? error.message : 'Failed to create session');
    } finally {
      setIsCreatingSession(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const existingSession = hybridArchitectureService.getEphemeralSessionInfo();
    if (existingSession && hybridArchitectureService.hasActiveEphemeralSession()) {
      setSessionInfo(existingSession);
    }
  }, []);

  // Update session info periodically
  useEffect(() => {
    if (currentMode === 'collaboration') {
      const interval = setInterval(() => {
        const session = hybridArchitectureService.getEphemeralSessionInfo();
        if (session && hybridArchitectureService.hasActiveEphemeralSession()) {
          setSessionInfo(session);
        } else {
          setSessionInfo(null);
          // Auto-switch to privacy mode if session expired
          if (currentMode === 'collaboration') {
            switchToPrivacyMode();
          }
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [currentMode]);

  const formatTimeRemaining = (expiresAt: number): string => {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  const privacyModeFeatures = [
    'Images never leave your device',
    'Zero server processing',
    'Impossible to breach',
    'Automatic GDPR compliance',
    'Maximum privacy protection'
  ];

  const collaborationModeFeatures = [
    'Real-time team collaboration',
    'Encrypted ephemeral processing',
    '24-hour auto-deletion',
    'Enterprise workflow features',
    'Secure temporary sharing'
  ];

  return (
    <div className={`hybrid-mode-selector ${className}`}>
      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Privacy Mode Card */}
        <div 
          className={`mode-card ${currentMode === 'privacy' ? 'active' : ''} ${isLoading ? 'disabled' : ''}`}
          onClick={() => handleModeSelection('privacy')}
        >
          <div className="mode-header">
            <div className="mode-icon">
              <Shield className={`w-8 h-8 ${currentMode === 'privacy' ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div className="mode-title">
              <h3 className="text-lg font-semibold">Privacy Mode</h3>
              <p className="text-sm text-gray-600">Maximum Security (Default)</p>
            </div>
            {currentMode === 'privacy' && (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
          </div>

          {showDetails && (
            <div className="mode-details">
              <div className="security-level">
                <Lock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Maximum Security</span>
              </div>
              
              <ul className="feature-list">
                {privacyModeFeatures.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mode-description">
                <p className="text-xs text-gray-500">
                  Perfect for sensitive content and maximum privacy protection.
                  Your files are processed entirely on your device.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Collaboration Mode Card */}
        <div 
          className={`mode-card ${currentMode === 'collaboration' ? 'active' : ''} ${isLoading ? 'disabled' : ''}`}
          onClick={() => handleModeSelection('collaboration')}
        >
          <div className="mode-header">
            <div className="mode-icon">
              <Users className={`w-8 h-8 ${currentMode === 'collaboration' ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <div className="mode-title">
              <h3 className="text-lg font-semibold">Collaboration Mode</h3>
              <p className="text-sm text-gray-600">Team Features (Optional)</p>
            </div>
            {currentMode === 'collaboration' && (
              <CheckCircle className="w-6 h-6 text-blue-600" />
            )}
          </div>

          {showDetails && (
            <div className="mode-details">
              <div className="security-level">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Ephemeral Processing</span>
              </div>
              
              <ul className="feature-list">
                {collaborationModeFeatures.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mode-description">
                <p className="text-xs text-gray-500">
                  Perfect for team projects requiring real-time collaboration.
                  All data is encrypted and automatically deleted after 24 hours.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Status */}
      {architectureStatus && (
        <div className="current-status">
          <div className="status-header">
            <h4 className="text-sm font-medium">Current Status</h4>
            <span className={`status-badge ${currentMode}`}>
              {currentMode === 'privacy' ? 'Privacy Mode' : 'Collaboration Mode'}
            </span>
          </div>
          
          <div className="status-details">
            <div className="status-item">
              <span className="label">Security Level:</span>
              <span className="value">{architectureStatus.securityLevel}</span>
            </div>
            <div className="status-item">
              <span className="label">Active Sessions:</span>
              <span className="value">{architectureStatus.activeSessions}</span>
            </div>
            <div className="status-item">
              <span className="label">Last Updated:</span>
              <span className="value">{new Date(architectureStatus.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Session Status for Collaboration Mode */}
      {currentMode === 'collaboration' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-900">
              Collaboration Session
            </h4>
            {isCreatingSession && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-xs">Creating session...</span>
              </div>
            )}
          </div>

          {sessionError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {sessionError}
              </div>
              <button
                onClick={switchToCollaborationMode}
                className="mt-1 text-red-600 hover:text-red-800 underline text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {sessionInfo && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-700">
                <span>Session ID:</span>
                <code className="bg-blue-100 px-1 rounded">
                  {sessionInfo.sessionId.slice(-8)}
                </code>
              </div>
              
              <div className="flex items-center justify-between text-xs text-blue-700">
                <span>Time Remaining:</span>
                <span className="font-medium">
                  {formatTimeRemaining(sessionInfo.expiresAt)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-blue-700">
                <span>Max Files:</span>
                <span>{sessionInfo.maxFiles}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-blue-700">
                <span>Max File Size:</span>
                <span>{Math.round(sessionInfo.config.maxFileSize / (1024 * 1024))}MB</span>
              </div>

              <div className="mt-3 pt-2 border-t border-blue-200">
                <button
                  onClick={switchToPrivacyMode}
                  className="w-full text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  End Session & Switch to Privacy Mode
                </button>
              </div>
            </div>
          )}

          {!sessionInfo && !isCreatingSession && !sessionError && (
            <div className="text-xs text-blue-600">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                No active session
              </div>
              <button
                onClick={switchToCollaborationMode}
                className="mt-1 text-blue-600 hover:text-blue-800 underline"
              >
                Create new session
              </button>
            </div>
          )}
        </div>
      )}

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold">Enable Collaboration Mode</h3>
            </div>
            
            <div className="mb-6 space-y-3 text-sm text-gray-600">
              <p>
                <strong>You are about to enable Collaboration Mode.</strong> This will:
              </p>
              
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Create a temporary 24-hour processing session</li>
                <li>Enable server-side processing for team collaboration</li>
                <li>Allow secure file sharing with team members</li>
                <li>Automatically delete all data after 24 hours</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-xs text-yellow-800">
                    <strong>Important:</strong> Files will be temporarily processed on our servers. 
                    All data is encrypted and automatically deleted after 24 hours.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleConsentDecline}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConsentAccept}
                disabled={isCreatingSession}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreatingSession ? 'Creating...' : 'Accept & Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="text-sm text-gray-600">Switching modes...</p>
        </div>
      )}
    </div>
  );
};

export default HybridModeSelector; 