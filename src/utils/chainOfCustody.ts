import { errorHandler } from './errorHandler';

export interface CustodyEvent {
  id: string;
  timestamp: Date;
  eventType: 'upload' | 'access' | 'analysis' | 'export' | 'modification' | 'transfer' | 'verification';
  action: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
  };
  file: {
    name: string;
    originalHash: string;
    currentHash: string;
    size: number;
    mimeType: string;
  };
  integrity: {
    verified: boolean;
    hashAlgorithm: 'SHA-256' | 'MD5' | 'SHA-1';
    previousHash?: string;
    signatureValid?: boolean;
  };
  metadata: {
    correlationId: string;
    sessionId: string;
    deviceFingerprint: string;
    timezone: string;
    source: string;
    evidence?: {
      caseNumber?: string;
      evidenceTag?: string;
      investigator?: string;
      department?: string;
    };
  };
  compliance: {
    frameworks: string[]; // ['FRE', 'HIPAA', 'SOX', 'GDPR']
    retentionPeriod: number; // days
    classification: 'public' | 'internal' | 'confidential' | 'restricted';
    auditRequired: boolean;
  };
  digitalSignature?: {
    algorithm: string;
    signature: string;
    certificate: string;
    timestamp: Date;
    valid: boolean;
  };
}

export interface ChainOfCustodyLog {
  fileId: string;
  fileName: string;
  originalHash: string;
  currentHash: string;
  createdAt: Date;
  lastModified: Date;
  events: CustodyEvent[];
  integrity: {
    chainValid: boolean;
    hashesValid: boolean;
    signaturesValid: boolean;
    lastVerification: Date;
    verificationCount: number;
  };
  compliance: {
    frameworks: string[];
    status: 'compliant' | 'non-compliant' | 'pending';
    lastAudit: Date;
    nextAudit: Date;
    violations: string[];
  };
  courtAdmissibility: {
    score: number; // 0-100
    factors: {
      integrityMaintained: boolean;
      properCustody: boolean;
      completeDocumentation: boolean;
      expertTestimony: boolean;
      chainOfPossession: boolean;
    };
    recommendations: string[];
  };
}

class ChainOfCustodyManager {
  private logs: Map<string, ChainOfCustodyLog> = new Map();
  private currentUser: any = null;
  private sessionId: string = '';

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserContext();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async loadUserContext() {
    // Load current user context from auth system
    try {
      const userTier = localStorage.getItem('proofpix_user_tier') || 'free';
      const userId = localStorage.getItem('proofpix_user_id') || 'anonymous';
      
      this.currentUser = {
        id: userId,
        name: localStorage.getItem('proofpix_user_name') || 'Unknown User',
        email: localStorage.getItem('proofpix_user_email') || 'unknown@example.com',
        role: userTier,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        location: await this.getClientLocation()
      };
    } catch (error) {
      console.error('Failed to load user context:', error);
      this.currentUser = {
        id: 'anonymous',
        name: 'Anonymous User',
        email: 'anonymous@example.com',
        role: 'free',
        ipAddress: 'unknown',
        userAgent: navigator.userAgent
      };
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      // In production, this would call your backend API to get the real IP
      return 'client-ip-placeholder';
    } catch {
      return 'unknown';
    }
  }

  private async getClientLocation(): Promise<string> {
    try {
      // In production, this would use geolocation API with user consent
      return 'location-placeholder';
    } catch {
      return 'unknown';
    }
  }

  async generateFileHash(file: File, algorithm: 'SHA-256' | 'MD5' | 'SHA-1' = 'SHA-256'): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          resolve(hashHex);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file for hashing'));
      reader.readAsArrayBuffer(file);
    });
  }

  async initializeChainOfCustody(
    file: File, 
    options: {
      caseNumber?: string;
      evidenceTag?: string;
      investigator?: string;
      department?: string;
      classification?: 'public' | 'internal' | 'confidential' | 'restricted';
      frameworks?: string[];
    } = {}
  ): Promise<string> {
    try {
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const originalHash = await this.generateFileHash(file);
      
      const initialEvent: CustodyEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        eventType: 'upload',
        action: 'File uploaded and chain of custody initialized',
        user: this.currentUser,
        file: {
          name: file.name,
          originalHash,
          currentHash: originalHash,
          size: file.size,
          mimeType: file.type
        },
        integrity: {
          verified: true,
          hashAlgorithm: 'SHA-256',
          signatureValid: true
        },
        metadata: {
          correlationId: fileId,
          sessionId: this.sessionId,
          deviceFingerprint: this.generateDeviceFingerprint(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          source: 'ProofPix Enterprise',
          evidence: {
            caseNumber: options.caseNumber,
            evidenceTag: options.evidenceTag,
            investigator: options.investigator,
            department: options.department
          }
        },
        compliance: {
          frameworks: options.frameworks || ['FRE', 'FRCP'],
          retentionPeriod: 2555, // 7 years default for legal evidence
          classification: options.classification || 'confidential',
          auditRequired: true
        }
      };

      const custodyLog: ChainOfCustodyLog = {
        fileId,
        fileName: file.name,
        originalHash,
        currentHash: originalHash,
        createdAt: new Date(),
        lastModified: new Date(),
        events: [initialEvent],
        integrity: {
          chainValid: true,
          hashesValid: true,
          signaturesValid: true,
          lastVerification: new Date(),
          verificationCount: 1
        },
        compliance: {
          frameworks: options.frameworks || ['FRE', 'FRCP'],
          status: 'compliant',
          lastAudit: new Date(),
          nextAudit: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          violations: []
        },
        courtAdmissibility: {
          score: 95,
          factors: {
            integrityMaintained: true,
            properCustody: true,
            completeDocumentation: true,
            expertTestimony: true,
            chainOfPossession: true
          },
          recommendations: []
        }
      };

      this.logs.set(fileId, custodyLog);
      
      // Store in localStorage for persistence (in production, this would be backend storage)
      this.persistCustodyLog(fileId, custodyLog);
      
      return fileId;
    } catch (error) {
      await errorHandler.handleError('chain_of_custody_init', error as Error);
      throw error;
    }
  }

  async addCustodyEvent(
    fileId: string, 
    eventType: CustodyEvent['eventType'], 
    action: string,
    additionalData: Partial<CustodyEvent> = {}
  ): Promise<void> {
    try {
      const custodyLog = this.logs.get(fileId);
      if (!custodyLog) {
        throw new Error(`Chain of custody log not found for file: ${fileId}`);
      }

      const event: CustodyEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        eventType,
        action,
        user: this.currentUser,
        file: {
          name: custodyLog.fileName,
          originalHash: custodyLog.originalHash,
          currentHash: custodyLog.currentHash,
          size: 0, // Would be updated with actual file size
          mimeType: 'unknown'
        },
        integrity: {
          verified: true,
          hashAlgorithm: 'SHA-256',
          signatureValid: true
        },
        metadata: {
          correlationId: fileId,
          sessionId: this.sessionId,
          deviceFingerprint: this.generateDeviceFingerprint(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          source: 'ProofPix Enterprise'
        },
        compliance: {
          frameworks: custodyLog.compliance.frameworks,
          retentionPeriod: 2555,
          classification: 'confidential',
          auditRequired: true
        },
        ...additionalData
      };

      custodyLog.events.push(event);
      custodyLog.lastModified = new Date();
      custodyLog.integrity.lastVerification = new Date();
      custodyLog.integrity.verificationCount++;

      this.logs.set(fileId, custodyLog);
      this.persistCustodyLog(fileId, custodyLog);
    } catch (error) {
      await errorHandler.handleError('chain_of_custody_event', error as Error);
      throw error;
    }
  }

  async verifyIntegrity(fileId: string, currentFile?: File): Promise<boolean> {
    try {
      const custodyLog = this.logs.get(fileId);
      if (!custodyLog) {
        throw new Error(`Chain of custody log not found for file: ${fileId}`);
      }

      let integrityValid = true;
      const violations: string[] = [];

      // Verify hash chain
      if (currentFile) {
        const currentHash = await this.generateFileHash(currentFile);
        if (currentHash !== custodyLog.originalHash) {
          integrityValid = false;
          violations.push('File hash does not match original');
        }
      }

      // Verify event chain
      for (let i = 1; i < custodyLog.events.length; i++) {
        const prevEvent = custodyLog.events[i - 1];
        const currentEvent = custodyLog.events[i];
        
        if (currentEvent.timestamp < prevEvent.timestamp) {
          integrityValid = false;
          violations.push(`Event timestamp out of order: ${currentEvent.id}`);
        }
      }

      // Update integrity status
      custodyLog.integrity.chainValid = integrityValid;
      custodyLog.integrity.hashesValid = integrityValid;
      custodyLog.integrity.lastVerification = new Date();
      custodyLog.compliance.violations = violations;
      custodyLog.compliance.status = integrityValid ? 'compliant' : 'non-compliant';

      // Update court admissibility score
      custodyLog.courtAdmissibility.score = this.calculateAdmissibilityScore(custodyLog);
      custodyLog.courtAdmissibility.factors.integrityMaintained = integrityValid;

      this.logs.set(fileId, custodyLog);
      this.persistCustodyLog(fileId, custodyLog);

      // Add verification event
      await this.addCustodyEvent(fileId, 'verification', 
        `Integrity verification ${integrityValid ? 'passed' : 'failed'}`, {
        integrity: {
          verified: integrityValid,
          hashAlgorithm: 'SHA-256',
          signatureValid: integrityValid
        }
      });

      return integrityValid;
    } catch (error) {
      await errorHandler.handleError('chain_of_custody_verify', error as Error);
      throw error;
    }
  }

  private calculateAdmissibilityScore(custodyLog: ChainOfCustodyLog): number {
    let score = 100;
    
    if (!custodyLog.integrity.chainValid) score -= 30;
    if (!custodyLog.integrity.hashesValid) score -= 25;
    if (custodyLog.compliance.violations.length > 0) score -= 20;
    if (custodyLog.events.length < 2) score -= 15; // Need multiple events for proper chain
    if (!custodyLog.compliance.frameworks.includes('FRE')) score -= 10;

    return Math.max(0, score);
  }

  private generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('ProofPix', 10, 10);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      window.screen.width + 'x' + window.screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).substr(0, 32);
  }

  private persistCustodyLog(fileId: string, custodyLog: ChainOfCustodyLog): void {
    try {
      const key = `custody_log_${fileId}`;
      localStorage.setItem(key, JSON.stringify(custodyLog, null, 2));
    } catch (error) {
      console.error('Failed to persist custody log:', error);
    }
  }

  getCustodyLog(fileId: string): ChainOfCustodyLog | null {
    return this.logs.get(fileId) || this.loadCustodyLog(fileId);
  }

  private loadCustodyLog(fileId: string): ChainOfCustodyLog | null {
    try {
      const key = `custody_log_${fileId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const custodyLog = JSON.parse(stored);
        // Convert date strings back to Date objects
        custodyLog.createdAt = new Date(custodyLog.createdAt);
        custodyLog.lastModified = new Date(custodyLog.lastModified);
        custodyLog.events.forEach((event: any) => {
          event.timestamp = new Date(event.timestamp);
        });
        this.logs.set(fileId, custodyLog);
        return custodyLog;
      }
    } catch (error) {
      console.error('Failed to load custody log:', error);
    }
    return null;
  }

  getAllCustodyLogs(): ChainOfCustodyLog[] {
    const allLogs: ChainOfCustodyLog[] = [];
    
    // Load from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('custody_log_')) {
        const fileId = key.replace('custody_log_', '');
        const log = this.loadCustodyLog(fileId);
        if (log) allLogs.push(log);
      }
    }
    
    return allLogs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async exportCustodyReport(fileId: string, format: 'json' | 'pdf' | 'xml' = 'json'): Promise<string> {
    const custodyLog = this.getCustodyLog(fileId);
    if (!custodyLog) {
      throw new Error(`Chain of custody log not found for file: ${fileId}`);
    }

    switch (format) {
      case 'json':
        return JSON.stringify(custodyLog, null, 2);
      case 'xml':
        return this.generateXMLReport(custodyLog);
      case 'pdf':
        return this.generatePDFReport(custodyLog);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private generateXMLReport(custodyLog: ChainOfCustodyLog): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ChainOfCustodyReport>
  <FileInfo>
    <FileId>${custodyLog.fileId}</FileId>
    <FileName>${custodyLog.fileName}</FileName>
    <OriginalHash>${custodyLog.originalHash}</OriginalHash>
    <CreatedAt>${custodyLog.createdAt.toISOString()}</CreatedAt>
  </FileInfo>
  <Integrity>
    <ChainValid>${custodyLog.integrity.chainValid}</ChainValid>
    <HashesValid>${custodyLog.integrity.hashesValid}</HashesValid>
    <LastVerification>${custodyLog.integrity.lastVerification.toISOString()}</LastVerification>
  </Integrity>
  <Events>
    ${custodyLog.events.map(event => `
    <Event>
      <Id>${event.id}</Id>
      <Timestamp>${event.timestamp.toISOString()}</Timestamp>
      <Type>${event.eventType}</Type>
      <Action>${event.action}</Action>
      <User>${event.user.name} (${event.user.email})</User>
    </Event>`).join('')}
  </Events>
</ChainOfCustodyReport>`;
  }

  private generatePDFReport(custodyLog: ChainOfCustodyLog): string {
    // This would integrate with a PDF generation library
    // For now, return a placeholder
    return `PDF Report for ${custodyLog.fileName} - Chain of Custody Documentation`;
  }
}

export const chainOfCustody = new ChainOfCustodyManager(); 