/**
 * Hybrid Architecture Visualization Component
 * Real-time visual demonstration of Privacy vs Collaboration modes
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Monitor, 
  Smartphone, 
  Server, 
  Database, 
  Wifi, 
  WifiOff, 
  Lock, 
  Eye, 
  Clock, 
  Trash2,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { hybridArchitectureService, ProcessingMode } from '../../services/hybridArchitectureService';

interface ArchitectureVisualizationProps {
  currentMode?: ProcessingMode;
  showMetrics?: boolean;
  interactive?: boolean;
  className?: string;
}

export const HybridArchitectureVisualization: React.FC<ArchitectureVisualizationProps> = ({
  currentMode: propMode,
  showMetrics = true,
  interactive = true,
  className = ''
}) => {
  const [currentMode, setCurrentMode] = useState<ProcessingMode>(propMode || 'privacy');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataFlow, setDataFlow] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({
    privacyScore: 100,
    serverLoad: 0,
    dataTransmission: false,
    storageUsed: 0,
    sessionExpiry: null as Date | null
  });

  useEffect(() => {
    // Listen for mode changes
    const handleModeChange = (event: any) => {
      setCurrentMode(event.newMode);
      updateMetrics(event.newMode);
    };

    hybridArchitectureService.on('modeChanged', handleModeChange);
    
    // Initial metrics
    updateMetrics(currentMode);

    return () => {
      hybridArchitectureService.off('modeChanged', handleModeChange);
    };
  }, [currentMode]);

  const updateMetrics = (mode: ProcessingMode) => {
    if (mode === 'privacy') {
      setMetrics({
        privacyScore: 100,
        serverLoad: 0,
        dataTransmission: false,
        storageUsed: 0,
        sessionExpiry: null
      });
      setDataFlow(['device', 'local-storage']);
    } else {
      const sessionInfo = hybridArchitectureService.getEphemeralSessionInfo();
      setMetrics({
        privacyScore: 85,
        serverLoad: 25,
        dataTransmission: true,
        storageUsed: 0, // Ephemeral only
        sessionExpiry: sessionInfo?.expiresAt ? new Date(sessionInfo.expiresAt) : null
      });
      setDataFlow(['device', 'encrypted-transmission', 'ephemeral-server', 'auto-delete']);
    }
  };

  const simulateProcessing = async () => {
    setIsProcessing(true);
    
    // Simulate file processing flow
    const steps = currentMode === 'privacy' 
      ? ['upload', 'client-process', 'local-store']
      : ['upload', 'encrypt', 'transmit', 'ephemeral-process', 'auto-delete'];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Visual feedback for each step
    }
    
    setIsProcessing(false);
  };

  const PrivacyModeVisualization = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Privacy Mode</h3>
      </div>
      
      <div className="relative bg-gray-50 rounded-lg p-6 min-h-96">
        {/* Device Node */}
        <div className="absolute top-4 left-4 bg-white rounded-lg p-4 shadow-md border-2 border-blue-500">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">Your Device</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">Processing locally</div>
          {isProcessing && (
            <div className="absolute -top-2 -right-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Server Node - Disabled */}
        <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-md border-2 border-gray-200 opacity-50">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-400">Cloud Server</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">Not used</div>
        </div>

        {/* Storage Node - Disabled */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg p-4 shadow-md border-2 border-gray-200 opacity-50">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-gray-400">Cloud Storage</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">Never accessed</div>
        </div>

        {/* No Connection Status */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          <WifiOff className="w-8 h-8 text-green-600" />
          <span className="text-green-600 font-semibold">No Network Required</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">Privacy Guarantees:</h4>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>100% local processing</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>No data transmission</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Zero cloud storage</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Complete offline capability</span>
        </div>
      </div>
    </div>
  );

  const CollaborationModeVisualization = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-semibold text-gray-900">Collaboration Mode</h3>
      </div>
      
      <div className="relative bg-gray-50 rounded-lg p-6 min-h-96">
        {/* Device Node */}
        <div className="absolute top-4 left-4 bg-white rounded-lg p-4 shadow-md border-2 border-blue-500">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">Your Device</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">Initial processing</div>
        </div>

        {/* Server Node - Active */}
        <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-md border-2 border-orange-500">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-orange-600" />
            <span className="font-semibold">Ephemeral Server</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">Temporary processing</div>
          <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
            <Clock className="w-3 h-3" />
            <span>Auto-delete in 24h</span>
          </div>
          {isProcessing && (
            <div className="absolute -top-2 -right-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Connection Flow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <ArrowRight className="w-6 h-6 text-blue-500" />
          <span className="text-blue-600 font-semibold">Encrypted Transfer</span>
        </div>

        {/* Team Members */}
        <div className="absolute bottom-4 right-4 space-y-2">
          <div className="flex items-center gap-2 text-sm bg-white rounded px-3 py-1 shadow">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Team Member 1</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white rounded px-3 py-1 shadow">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Team Member 2</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">Collaboration Features:</h4>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Secure team sharing</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Ephemeral cloud processing</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Automatic data deletion</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>End-to-end encryption</span>
        </div>
      </div>
    </div>
  );

  const MetricsPanel = () => (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Privacy Metrics
      </h3>
      
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-1">Privacy Score</div>
        <div className="relative bg-gray-200 rounded-full h-4 flex items-center">
          <div 
            className="h-full rounded-full transition-all duration-500 bg-green-500"
            style={{ width: `${metrics.privacyScore}%` }}
          />
          <div className="absolute right-2 text-xs font-semibold text-white">
            {metrics.privacyScore}%
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-1">Server Load</div>
        <div className="relative bg-gray-200 rounded-full h-4 flex items-center">
          <div 
            className="h-full rounded-full transition-all duration-500 bg-orange-500"
            style={{ width: `${metrics.serverLoad}%` }}
          />
          <div className="absolute right-2 text-xs font-semibold text-white">
            {metrics.serverLoad}%
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-1">Storage Used</div>
        <div className="relative bg-gray-200 rounded-full h-4 flex items-center">
          <div 
            className="h-full rounded-full transition-all duration-500 bg-blue-500"
            style={{ width: `${metrics.storageUsed}%` }}
          />
          <div className="absolute right-2 text-xs font-semibold text-white">
            {metrics.storageUsed}%
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-1">Data Transmission</div>
        <div className="text-sm font-semibold">
          {metrics.dataTransmission ? (
            <span className="text-orange-600">Encrypted Only</span>
          ) : (
            <span className="text-green-600">None</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          ProofPix Hybrid Architecture
        </h2>
        <p className="text-gray-600">
          Real-time visualization of processing modes
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => hybridArchitectureService.switchMode('privacy')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
            currentMode === 'privacy' 
              ? 'bg-blue-50 border-blue-500 text-blue-700' 
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
          disabled={!interactive}
        >
          <Shield className="w-5 h-5" />
          Privacy Mode
        </button>
        <button
          onClick={() => hybridArchitectureService.switchMode('collaboration', true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
            currentMode === 'collaboration' 
              ? 'bg-blue-50 border-blue-500 text-blue-700' 
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
          disabled={!interactive}
        >
          <Users className="w-5 h-5" />
          Collaboration Mode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentMode === 'privacy' ? (
            <PrivacyModeVisualization />
          ) : (
            <CollaborationModeVisualization />
          )}
        </div>

        {showMetrics && (
          <div className="metrics-sidebar">
            <MetricsPanel />
          </div>
        )}
      </div>

      {interactive && (
        <div className="demo-controls text-center mt-6">
          <button
            onClick={simulateProcessing}
            disabled={isProcessing}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Simulate File Processing'}
          </button>
        </div>
      )}
    </div>
  );
}; 