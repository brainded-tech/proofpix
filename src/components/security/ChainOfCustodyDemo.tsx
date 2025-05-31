import React, { useState } from 'react';
import { Upload, FileText, Shield, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { chainOfCustody } from '../../utils/chainOfCustody';
import { ChainOfCustody } from './ChainOfCustody';

export const ChainOfCustodyDemo: React.FC = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [demoFileId, setDemoFileId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const createDemoFile = (name: string, content: string): File => {
    const blob = new Blob([content], { type: 'text/plain' });
    return new File([blob], name, { type: 'text/plain' });
  };

  const runDemo = async () => {
    setIsRunning(true);
    setDemoStep(1);

    try {
      // Step 1: Create a demo file
      const demoFile = createDemoFile(
        'evidence_photo_001.jpg',
        'This is a demo file representing digital evidence for legal proceedings. ' +
        'In a real scenario, this would be an actual image file with EXIF metadata.'
      );

      // Step 2: Initialize chain of custody
      setDemoStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const fileId = await chainOfCustody.initializeChainOfCustody(demoFile, {
        caseNumber: 'CASE-2024-001',
        evidenceTag: 'EVIDENCE-001',
        investigator: 'Detective Sarah Johnson',
        department: 'Digital Forensics Unit',
        classification: 'confidential',
        frameworks: ['FRE', 'FRCP', 'HIPAA']
      });

      setDemoFileId(fileId);

      // Step 3: Simulate file access
      setDemoStep(3);
      await new Promise(resolve => setTimeout(resolve, 1500));

      await chainOfCustody.addCustodyEvent(
        fileId,
        'access',
        'File accessed for metadata analysis',
        {
          metadata: {
            correlationId: fileId,
            sessionId: 'demo_session_001',
            deviceFingerprint: 'demo_device',
            timezone: 'UTC',
            source: 'ProofPix Enterprise Demo',
            evidence: {
              caseNumber: 'CASE-2024-001',
              evidenceTag: 'EVIDENCE-001'
            }
          }
        }
      );

      // Step 4: Simulate analysis
      setDemoStep(4);
      await new Promise(resolve => setTimeout(resolve, 1500));

      await chainOfCustody.addCustodyEvent(
        fileId,
        'analysis',
        'EXIF metadata extracted and analyzed',
        {
          metadata: {
            correlationId: fileId,
            sessionId: 'demo_session_001',
            deviceFingerprint: 'demo_device',
            timezone: 'UTC',
            source: 'ProofPix Enterprise Demo'
          }
        }
      );

      // Step 5: Simulate export
      setDemoStep(5);
      await new Promise(resolve => setTimeout(resolve, 1500));

      await chainOfCustody.addCustodyEvent(
        fileId,
        'export',
        'Forensic report generated and exported',
        {
          metadata: {
            correlationId: fileId,
            sessionId: 'demo_session_001',
            deviceFingerprint: 'demo_device',
            timezone: 'UTC',
            source: 'ProofPix Enterprise Demo'
          }
        }
      );

      // Step 6: Verify integrity
      setDemoStep(6);
      await new Promise(resolve => setTimeout(resolve, 1500));

      await chainOfCustody.verifyIntegrity(fileId, demoFile);

      setDemoStep(7);
    } catch (error) {
      console.error('Demo failed:', error);
      setDemoStep(-1);
    } finally {
      setIsRunning(false);
    }
  };

  const resetDemo = () => {
    setDemoStep(0);
    setDemoFileId(null);
    setIsRunning(false);
  };

  const demoSteps = [
    { title: 'Ready to Start', description: 'Click "Run Demo" to see chain of custody in action' },
    { title: 'Creating Demo File', description: 'Generating sample evidence file...' },
    { title: 'Initializing Chain of Custody', description: 'Creating cryptographic hash and initial custody event...' },
    { title: 'File Access Event', description: 'Recording file access for analysis...' },
    { title: 'Analysis Event', description: 'Documenting metadata extraction process...' },
    { title: 'Export Event', description: 'Logging report generation...' },
    { title: 'Integrity Verification', description: 'Verifying file integrity and chain validity...' },
    { title: 'Demo Complete', description: 'Chain of custody successfully established and verified!' }
  ];

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Chain of Custody Demo
            </h2>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
              Live Demo
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={runDemo}
              disabled={isRunning}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isRunning ? 'Running...' : 'Run Demo'}</span>
            </button>
            <button
              onClick={resetDemo}
              disabled={isRunning}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Demo Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-gray-600 dark:text-gray-300">
              Step {Math.max(0, demoStep)} of {demoSteps.length - 1}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(demoStep / (demoSteps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Current Step */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              {demoStep === -1 ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : demoStep === demoSteps.length - 1 ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <div className="w-5 h-5 border-2 border-blue-600 rounded-full animate-pulse"></div>
              )}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {demoStep === -1 ? 'Demo Failed' : demoSteps[demoStep]?.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {demoStep === -1 ? 'An error occurred during the demo' : demoSteps[demoStep]?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Demo Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-gray-900 dark:text-white">Cryptographic Hashing</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                SHA-256 hashes ensure file integrity and detect any modifications
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-gray-900 dark:text-white">Legal Compliance</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Meets FRE, FRCP, and other legal framework requirements
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium text-gray-900 dark:text-white">Court Admissibility</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Automated scoring and documentation for court proceedings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chain of Custody Display */}
      {demoFileId && (
        <ChainOfCustody 
          fileId={demoFileId}
          className="mt-6"
        />
      )}

      {/* Demo Instructions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          Demo Instructions
        </h3>
        <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
          <p>
            <strong>1. Run Demo:</strong> Click "Run Demo" to simulate a complete chain of custody workflow
          </p>
          <p>
            <strong>2. Watch Progress:</strong> Observe each step as it creates custody events and verifies integrity
          </p>
          <p>
            <strong>3. Explore Results:</strong> Use the tabs below to examine events, integrity status, and compliance
          </p>
          <p>
            <strong>4. Export Reports:</strong> Try exporting custody reports in JSON, XML, or PDF formats
          </p>
          <p>
            <strong>5. Verify Integrity:</strong> Click "Verify Integrity" to re-check file and chain validity
          </p>
        </div>
      </div>
    </div>
  );
}; 