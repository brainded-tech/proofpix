/**
 * Hybrid Mode Selector Component
 * Allows users to choose between Privacy Mode and Collaboration Mode
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  Clock, 
  Lock, 
  Eye, 
  Info, 
  TrendingDown,
  Award,
  AlertTriangle,
  Zap,
  Brain,
  ExternalLink,
  Server
} from 'lucide-react';
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
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<ProcessingMode>('privacy');
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [architectureStatus, setArchitectureStatus] = useState<any>(null);
  const [pendingMode, setPendingMode] = useState<ProcessingMode | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [showEducationModal, setShowEducationModal] = useState(false);

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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const switchToCollaborationMode = async () => {
    setIsCreatingSession(true);
    setSessionError(null);

    try {
      // Check if user is authenticated
      const authToken = localStorage.getItem('auth_token') || 
                       sessionStorage.getItem('auth_token') ||
                       localStorage.getItem('authToken') ||
                       sessionStorage.getItem('authToken');
      
      if (!authToken && process.env.NODE_ENV !== 'development' && process.env.REACT_APP_DEMO_MODE !== 'true') {
        throw new Error('Please log in to use collaboration mode. Team features require authentication.');
      }

      // Create ephemeral session
      const session = await hybridArchitectureService.createEphemeralSession({
        maxFiles: 10
      });

      // Switch to collaboration mode
      await hybridArchitectureService.switchMode('collaboration', true);
      onModeChange?.('collaboration');
      
      setSessionInfo(session);
      console.log('Successfully switched to collaboration mode:', session);
    } catch (error) {
      console.error('Failed to create ephemeral session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
      setSessionError(errorMessage);
      
      // If it's an authentication error, provide helpful guidance
      if (errorMessage.includes('log in') || errorMessage.includes('Authentication required')) {
        setSessionError('Authentication required: Please log in to use collaboration mode. Team features require a valid account.');
      }
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
    { icon: Eye, text: 'Images never leave your device' },
    { icon: Server, text: 'Zero server processing' },
    { icon: Shield, text: 'Impossible to breach' },
    { icon: Award, text: 'Automatic GDPR compliance' },
    { icon: Lock, text: 'Maximum privacy protection' }
  ];

  const collaborationModeFeatures = [
    { icon: Users, text: 'Real-time team collaboration' },
    { icon: Lock, text: 'Encrypted ephemeral processing' },
    { icon: Clock, text: '24-hour auto-deletion' },
    { icon: Zap, text: 'Enterprise workflow features' },
    { icon: Shield, text: 'Secure temporary sharing' }
  ];

  const trustIndicators = [
    { icon: Shield, text: 'SOC 2 Certified' },
    { icon: Award, text: 'GDPR Compliant' },
    { icon: Lock, text: 'End-to-End Encrypted' }
  ];

  return (
    <div className={`w-full max-w-6xl mx-auto p-4 sm:p-6 bg-slate-800/40 border border-slate-600/30 rounded-2xl backdrop-blur-sm ${className}`}>
      {/* Strategic Header with Trust Building */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-2 sm:gap-0">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 sm:mr-3" />
          <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white text-center">Choose Your Processing Mode</h2>
          <div className="sm:ml-3 px-2 sm:px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <span className="text-xs font-semibold text-green-400">PRIVACY FIRST</span>
          </div>
        </div>
        
        <p className="text-slate-400 text-sm sm:text-base lg:text-lg mb-4 max-w-3xl mx-auto px-2">
          ProofPix's revolutionary hybrid architecture gives you the choice: maximum privacy or secure collaboration. 
          <strong className="text-white"> Your data, your control.</strong>
        </p>
        
        {/* Strategic Trust Building Links */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 px-2">
          <button
            onClick={() => setShowEducationModal(true)}
            className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-500/10"
          >
            <Info className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Learn about privacy modes</span>
            <span className="sm:hidden">Privacy Info</span>
          </button>
          
          {/* Open Source Verification Link - Strategic Priority */}
          <button 
            onClick={() => navigate('/trust-verification')}
            className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-green-400 hover:text-green-300 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-green-500/10 border border-green-500/30"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden lg:inline">Verify privacy claims in open source code</span>
            <span className="lg:hidden">Verify Claims</span>
          </button>
          
          {/* Cost Advantage Link */}
          <button 
            onClick={() => navigate('/trust-verification?tab=cost')}
            className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-purple-500/10"
          >
            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">See 83% cost savings vs traditional SaaS</span>
            <span className="sm:hidden">Cost Savings</span>
          </button>

          {/* AI Features Discovery Link */}
          <button 
            onClick={() => navigate('/ai-features')}
            className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-orange-400 hover:text-orange-300 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-orange-500/10"
          >
            <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Explore AI capabilities</span>
            <span className="sm:hidden">AI Features</span>
          </button>
        </div>

        {/* Competitive Advantage Messaging */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-green-400">Unique Market Position:</strong> ProofPix is the only AI platform that combines 
            <span className="text-green-400 font-semibold"> verifiable privacy</span> with 
            <span className="text-blue-400 font-semibold"> enterprise collaboration</span>. 
            Our open source privacy engine proves our claims while proprietary AI delivers unmatched capabilities.
          </p>
        </div>
      </div>

      {/* Enhanced Mode Selection Cards */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Privacy Mode Card - Enhanced */}
        <div 
          className={`flex-1 p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            currentMode === 'privacy' 
              ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20' 
              : 'border-slate-600 bg-slate-800/50 hover:border-green-400 hover:bg-green-500/5'
          } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
          onClick={() => handleModeSelection('privacy')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                currentMode === 'privacy' ? 'bg-green-500/20' : 'bg-slate-700/50'
              }`}>
                <Shield className={`w-5 h-5 sm:w-7 sm:h-7 ${currentMode === 'privacy' ? 'text-green-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span>Privacy Mode</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30 w-fit">
                    DEFAULT
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">Images never leave your device</p>
              </div>
            </div>
            {currentMode === 'privacy' && (
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
            )}
          </div>

          {showDetails && (
            <div className="space-y-4">
              {/* Strategic Value Proposition */}
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Architecturally Impossible to Breach</span>
              </div>
              
              <div className="space-y-2">
                {privacyModeFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 text-sm text-slate-300">
                      <IconComponent className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Enhanced Trust Indicators */}
              {currentMode === 'privacy' && (
                <div className="space-y-3 pt-3 border-t border-slate-600/30">
                  <div className="flex flex-wrap gap-2">
                    {trustIndicators.map((indicator, index) => {
                      const IconComponent = indicator.icon;
                      return (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                          <IconComponent className="w-3 h-3" />
                          <span>{indicator.text}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Strategic Open Source Verification */}
                  <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-semibold text-green-400">Open Source Verification</h5>
                      <a 
                        href="https://github.com/proofpix/privacy-core" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-green-400 hover:text-green-300 underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View Code
                      </a>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Our privacy claims are verifiable through open source code. Independent audits confirm: 
                      <strong className="text-green-400"> zero server communication in Privacy Mode</strong>.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-600/30">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-white">Perfect for sensitive content.</strong> Your files are processed entirely on your device. 
                  No internet connection required after initial load. Automatic GDPR, CCPA, and HIPAA compliance.
                </p>
              </div>

              {/* Strategic Cost Advantage */}
              {currentMode === 'privacy' && (
                <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                  <h5 className="text-sm font-semibold text-purple-400 mb-1">Cost Advantage</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-purple-400">83% lower security costs</strong> compared to traditional SaaS. 
                    No massive security investment needed when data never leaves your device.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collaboration Mode Card - Enhanced */}
        <div 
          className={`flex-1 p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            currentMode === 'collaboration' 
              ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
              : 'border-slate-600 bg-slate-800/50 hover:border-blue-400 hover:bg-blue-500/5'
          } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
          onClick={() => handleModeSelection('collaboration')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                currentMode === 'collaboration' ? 'bg-blue-500/20' : 'bg-slate-700/50'
              }`}>
                <Users className={`w-5 h-5 sm:w-7 sm:h-7 ${currentMode === 'collaboration' ? 'text-blue-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span>Collaboration Mode</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 w-fit">
                    OPTIONAL
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">Secure team features with 24h auto-deletion</p>
              </div>
            </div>
            {currentMode === 'collaboration' && (
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
            )}
          </div>

          {showDetails && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Ephemeral Processing - No Permanent Storage</span>
              </div>
              
              <div className="space-y-2">
                {collaborationModeFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 text-sm text-slate-300">
                      <IconComponent className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span>{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-600/30">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-white">Perfect for team projects.</strong> All data is encrypted during temporary processing 
                  and automatically deleted after 24 hours. No permanent storage ensures security even in collaboration.
                </p>
              </div>

              {/* Enhanced Collaboration Security */}
              {currentMode === 'collaboration' && (
                <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  <h5 className="text-sm font-semibold text-blue-400 mb-1">Enterprise Security</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-blue-400">AES-256 encryption</strong> during processing. 
                    <strong className="text-blue-400"> Guaranteed 24-hour deletion</strong> prevents long-term exposure. 
                    Still 80% more secure than traditional SaaS platforms.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Current Status with Strategic Messaging */}
      {architectureStatus && (
        <div className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              Current Status
              {currentMode === 'privacy' && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  MAXIMUM PRIVACY
                </span>
              )}
              {currentMode === 'collaboration' && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                  SECURE COLLABORATION
                </span>
              )}
            </h4>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentMode === 'privacy' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {currentMode === 'privacy' ? 'Privacy Mode Active' : 'Collaboration Mode Active'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Security Level:</span>
              <span className="text-white font-medium">{architectureStatus.securityLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Data Location:</span>
              <span className="text-white font-medium">{currentMode === 'privacy' ? 'Your Device Only' : 'Encrypted Temporary'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Breach Risk:</span>
              <span className="text-green-400 font-medium">{currentMode === 'privacy' ? 'Impossible' : 'Minimal'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Compliance:</span>
              <span className="text-green-400 font-medium">Automatic</span>
            </div>
          </div>
          
          {/* Strategic Trust Building Footer */}
          <div className="mt-4 pt-3 border-t border-slate-600/30 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>✓ Open source verified</span>
              <span>✓ Independently audited</span>
              <span>✓ Zero vendor lock-in</span>
            </div>
            <a 
              href="/trust-verification" 
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              View full trust verification →
            </a>
          </div>
        </div>
      )}

      {/* Session Status for Collaboration Mode */}
      {currentMode === 'collaboration' && (
        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-blue-300">
              Collaboration Session
            </h4>
            {isCreatingSession && (
              <div className="flex items-center text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                <span className="text-xs">Creating session...</span>
              </div>
            )}
          </div>

          {sessionError && (
            <div className="mb-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {sessionError}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={switchToCollaborationMode}
                  className="text-red-400 hover:text-red-300 underline text-xs"
                >
                  Retry
                </button>
                {sessionError.includes('Authentication required') && (
                  <button
                    onClick={() => {
                      // For demo/development purposes, create a demo auth token
                      if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_DEMO_MODE === 'true') {
                        localStorage.setItem('auth_token', 'demo_auth_token_' + Date.now());
                        setSessionError(null);
                        switchToCollaborationMode();
                      } else {
                        // In production, redirect to login
                        window.location.href = '/login';
                      }
                    }}
                    className="text-blue-400 hover:text-blue-300 underline text-xs ml-2"
                  >
                    {process.env.NODE_ENV === 'development' ? 'Demo Login' : 'Go to Login'}
                  </button>
                )}
              </div>
            </div>
          )}

          {sessionInfo && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-300">Session ID:</span>
                  <code className="bg-blue-900/30 px-2 py-1 rounded text-blue-200">
                    {sessionInfo.sessionId.slice(-8)}
                  </code>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-blue-300">Time Remaining:</span>
                  <span className="font-medium text-blue-200">
                    {formatTimeRemaining(sessionInfo.expiresAt)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-blue-300">Max Files:</span>
                  <span className="text-blue-200">{sessionInfo.maxFiles}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-300">Max File Size:</span>
                  <span className="text-blue-200">{Math.round(sessionInfo.config.maxFileSize / (1024 * 1024))}MB</span>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-500/30">
                <button
                  onClick={switchToPrivacyMode}
                  className="w-full text-sm text-blue-400 hover:text-blue-300 underline"
                >
                  End Session & Switch to Privacy Mode
                </button>
              </div>
            </div>
          )}

          {!sessionInfo && !isCreatingSession && !sessionError && (
            <div className="text-sm text-blue-400">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                No active session
              </div>
              <button
                onClick={switchToCollaborationMode}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Create new session
              </button>
            </div>
          )}
        </div>
      )}

      {/* Privacy Education Modal */}
      {showEducationModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-600 rounded-2xl p-8 max-w-3xl mx-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white">Understanding Privacy Modes</h3>
              <button
                onClick={() => setShowEducationModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-8 text-sm text-slate-300">
              <div>
                <h4 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  Privacy Mode (Recommended)
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                  <li>Your images are processed entirely on your device</li>
                  <li>Zero server communication means zero data breach risk</li>
                  <li>Automatic compliance with GDPR, CCPA, and HIPAA</li>
                  <li>Perfect for sensitive documents and personal photos</li>
                  <li>No internet connection required after initial load</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  Collaboration Mode (Optional)
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                  <li>Enables real-time team collaboration features</li>
                  <li>Files are encrypted during temporary processing</li>
                  <li>All data is automatically deleted after 24 hours</li>
                  <li>Perfect for team projects and shared workflows</li>
                  <li>Requires explicit consent before activation</li>
                </ul>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6">
                <h5 className="text-amber-400 font-semibold mb-3 text-lg">Your Choice, Your Control</h5>
                <p className="text-slate-300 leading-relaxed">
                  You can switch between modes anytime. Privacy Mode is always the default, 
                  and you'll be clearly informed before any data leaves your device.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowEducationModal(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-600 rounded-2xl p-8 max-w-lg mx-4 shadow-2xl">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Enable Collaboration Mode</h3>
            </div>
            
            <div className="mb-8 space-y-4 text-sm text-slate-300">
              <p>
                <strong className="text-white">You are about to enable Collaboration Mode.</strong> This will:
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create a temporary 24-hour processing session</li>
                <li>Enable server-side processing for team collaboration</li>
                <li>Allow secure file sharing with team members</li>
                <li>Automatically delete all data after 24 hours</li>
              </ul>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 mt-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-300">
                    <strong>Important:</strong> Files will be temporarily processed on our servers. 
                    All data is encrypted and automatically deleted after 24 hours.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleConsentDecline}
                className="flex-1 px-6 py-3 border border-slate-600 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConsentAccept}
                disabled={isCreatingSession}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isCreatingSession ? 'Creating...' : 'Accept & Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-slate-900 border border-slate-600 rounded-2xl p-8 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-sm text-slate-400">Switching modes...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HybridModeSelector; 