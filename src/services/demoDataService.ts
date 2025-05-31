// Demo Data Service for Enterprise Demonstrations
// Provides controlled, staged data to prevent system gaming while enabling live demos

export interface DemoDocument {
  id: string;
  name: string;
  type: 'legal' | 'financial' | 'medical' | 'identity' | 'business' | 'technical';
  subType: string;
  size: number;
  uploadDate: Date;
  status: 'processed' | 'processing' | 'pending' | 'error';
  confidence: number;
  industry: 'legal' | 'insurance' | 'healthcare' | 'realestate' | 'government' | 'general';
  demoScenario: string;
  extractedData: Record<string, any>;
  processingTime: number;
  qualityScore: number;
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  industry: string;
  documents: DemoDocument[];
  workflows: any[];
  recommendations: any[];
  analytics: any;
  duration: number; // in minutes
  keyFeatures: string[];
}

class DemoDataService {
  private isDemoMode: boolean = false;
  private currentScenario: string | null = null;
  private demoStartTime: Date | null = null;
  private readonly DEMO_DURATION = 30 * 60 * 1000; // 30 minutes

  // Predefined demo scenarios for different industries
  private demoScenarios: Record<string, DemoScenario> = {
    // AI Features Demo Scenarios
    legal: {
      id: 'legal',
      name: 'Legal Document Analysis',
      description: 'AI-powered analysis of legal documents with evidence verification',
      industry: 'legal',
      documents: [], // this.generateLegalDocuments(),
      workflows: [], // this.generateLegalWorkflows(),
      recommendations: [], // this.generateLegalRecommendations(),
      analytics: {}, // this.generateLegalAnalytics(),
      duration: 15,
      keyFeatures: ['Document Classification', 'Evidence Analysis', 'Compliance Checking']
    },
    
    insurance: {
      id: 'insurance',
      name: 'Insurance Claims Processing',
      description: 'Automated damage assessment and fraud detection for insurance claims',
      industry: 'insurance',
      documents: [], // this.generateInsuranceDocuments(),
      workflows: [], // this.generateInsuranceWorkflows(),
      recommendations: [], // this.generateInsuranceRecommendations(),
      analytics: {}, // this.generateInsuranceAnalytics(),
      duration: 20,
      keyFeatures: ['Damage Assessment', 'Fraud Detection', 'Automated Processing']
    },
    
    healthcare: {
      id: 'healthcare',
      name: 'Medical Image Analysis',
      description: 'AI-assisted medical imaging analysis with HIPAA compliance',
      industry: 'healthcare',
      documents: [], // this.generateHealthcareDocuments(),
      workflows: [], // this.generateHealthcareWorkflows(),
      recommendations: [], // this.generateHealthcareRecommendations(),
      analytics: {}, // this.generateHealthcareAnalytics(),
      duration: 25,
      keyFeatures: ['Medical Imaging', 'HIPAA Compliance', 'Diagnostic Support']
    },

    // Enterprise Demo Scenarios
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise Platform Demo',
      description: 'Complete enterprise platform with team management, API access, and white-label features',
      industry: 'general',
      documents: [], // this.generateEnterpriseDocuments(),
      workflows: [], // this.generateEnterpriseWorkflows(),
      recommendations: [], // this.generateEnterpriseRecommendations(),
      analytics: {}, // this.generateEnterpriseAnalytics(),
      duration: 30,
      keyFeatures: ['Team Management', 'API Integration', 'White-label Branding', 'Enterprise Security']
    },

    enterpriseLegal: {
      id: 'enterpriseLegal',
      name: 'Legal Firm Enterprise',
      description: 'Enterprise platform tailored for legal services with compliance and security features',
      industry: 'legal',
      documents: [], // [this.generateDemoDocument(new File([''], 'legal-contract.pdf'), this.demoScenarios.legal)],
      workflows: [],
      recommendations: [],
      analytics: {},
      duration: 30,
      keyFeatures: ['Legal Compliance', 'Evidence Management', 'Client Portal', 'Audit Trails']
    },

    enterpriseInsurance: {
      id: 'enterpriseInsurance',
      name: 'Insurance Company Enterprise',
      description: 'Enterprise platform for insurance companies with claims processing and fraud detection',
      industry: 'insurance',
      documents: [], // [this.generateDemoDocument(new File([''], 'insurance-claim.pdf'), this.demoScenarios.insurance)],
      workflows: [],
      recommendations: [],
      analytics: {},
      duration: 30,
      keyFeatures: ['Claims Processing', 'Fraud Detection', 'Risk Assessment', 'Regulatory Compliance']
    },

    enterpriseHealthcare: {
      id: 'enterpriseHealthcare',
      name: 'Healthcare Enterprise',
      description: 'HIPAA-compliant enterprise platform for healthcare organizations',
      industry: 'healthcare',
      documents: [], // [this.generateDemoDocument(new File([''], 'medical-record.pdf'), this.demoScenarios.healthcare)],
      workflows: [],
      recommendations: [],
      analytics: {},
      duration: 30,
      keyFeatures: ['HIPAA Compliance', 'Medical Imaging', 'Patient Privacy', 'Clinical Workflows']
    }
  };

  // Demo session management
  startDemoSession(scenarioId: string, userEmail?: string): boolean {
    if (!this.demoScenarios[scenarioId]) {
      throw new Error(`Demo scenario '${scenarioId}' not found`);
    }

    this.isDemoMode = true;
    this.currentScenario = scenarioId;
    this.demoStartTime = new Date();

    // Log demo session start (for analytics)
    console.log(`Demo session started: ${scenarioId} for ${userEmail || 'anonymous'}`);
    
    return true;
  }

  endDemoSession(): void {
    this.isDemoMode = false;
    this.currentScenario = null;
    this.demoStartTime = null;
    console.log('Demo session ended');
  }

  isDemoActive(): boolean {
    if (!this.isDemoMode || !this.demoStartTime) return false;
    
    const elapsed = Date.now() - this.demoStartTime.getTime();
    if (elapsed > this.DEMO_DURATION) {
      this.endDemoSession();
      return false;
    }
    
    return true;
  }

  getCurrentScenario(): DemoScenario | null {
    if (!this.isDemoActive() || !this.currentScenario) return null;
    return this.demoScenarios[this.currentScenario];
  }

  // Demo document operations (replace real file operations)
  getDemoDocuments(): DemoDocument[] {
    const scenario = this.getCurrentScenario();
    return scenario ? scenario.documents : [];
  }

  uploadDemoDocument(file: File): Promise<DemoDocument> {
    return new Promise((resolve) => {
      // Simulate upload processing time
      setTimeout(() => {
        const scenario = this.getCurrentScenario();
        if (!scenario) {
          throw new Error('No active demo scenario');
        }

        // Return a predefined document based on file name or type
        const demoDoc = this.generateDemoDocument(file, scenario);
        resolve(demoDoc);
      }, 2000); // 2 second simulated processing
    });
  }

  private generateDemoDocument(file: File, scenario: DemoScenario): DemoDocument {
    const baseDoc: DemoDocument = {
      id: `demo-${Date.now()}`,
      name: file.name,
      type: 'business',
      subType: 'general',
      size: file.size,
      uploadDate: new Date(),
      status: 'processing',
      confidence: 0.85 + Math.random() * 0.15, // 85-100%
      industry: scenario.industry as any,
      demoScenario: scenario.id,
      processingTime: 2 + Math.random() * 4, // 2-6 seconds
      qualityScore: 85 + Math.random() * 15, // 85-100%
      extractedData: {}
    };

    // Customize based on file type and scenario
    if (file.name.toLowerCase().includes('contract')) {
      baseDoc.type = 'legal';
      baseDoc.subType = 'contract';
      baseDoc.extractedData = {
        documentType: 'Service Contract',
        parties: ['Demo Company A', 'Demo Company B'],
        effectiveDate: new Date().toISOString().split('T')[0],
        keyTerms: ['Payment terms', 'Service level agreement', 'Termination clause']
      };
    } else if (file.name.toLowerCase().includes('claim')) {
      baseDoc.type = 'business';
      baseDoc.subType = 'insurance_claim';
      baseDoc.extractedData = {
        claimNumber: `DEMO-${Date.now()}`,
        claimAmount: `$${(Math.random() * 10000 + 1000).toFixed(2)}`,
        incidentDate: new Date().toISOString().split('T')[0],
        status: 'Under Review'
      };
    } else if (file.name.toLowerCase().includes('medical')) {
      baseDoc.type = 'medical';
      baseDoc.subType = 'patient_record';
      baseDoc.extractedData = {
        patientId: '[REDACTED - DEMO]',
        documentType: 'Medical Record',
        complianceStatus: 'HIPAA Compliant',
        dataRedacted: true
      };
    }

    return baseDoc;
  }

  // Demo analytics (return staged data)
  getDemoAnalytics() {
    const scenario = this.getCurrentScenario();
    if (!scenario) return null;

    return {
      documentsProcessed: 1247 + Math.floor(Math.random() * 100),
      averageConfidence: 0.94 + Math.random() * 0.05,
      processingTime: 3.2 + Math.random() * 2,
      qualityScore: 92 + Math.random() * 8,
      industryBenchmark: {
        accuracy: 0.89,
        speed: 4.1,
        quality: 87
      },
      trends: {
        weeklyGrowth: 12.5,
        monthlyGrowth: 45.2,
        yearlyGrowth: 234.7
      }
    };
  }

  // Demo recommendations (return staged recommendations)
  getDemoRecommendations() {
    const scenario = this.getCurrentScenario();
    if (!scenario) return [];

    const baseRecommendations = [
      {
        id: 'demo-rec-1',
        type: 'processing',
        title: 'Implement Batch Processing',
        description: 'Process documents in batches to improve efficiency by 40%',
        confidence: 0.92,
        impact: 'high',
        effort: 'moderate',
        expectedOutcome: {
          qualityImprovement: 15,
          timeReduction: 40,
          costSavings: 25,
          riskReduction: 10
        }
      },
      {
        id: 'demo-rec-2',
        type: 'quality',
        title: 'Enhanced OCR Accuracy',
        description: 'Implement advanced OCR preprocessing for better text extraction',
        confidence: 0.89,
        impact: 'critical',
        effort: 'significant',
        expectedOutcome: {
          qualityImprovement: 35,
          timeReduction: 20,
          costSavings: 15,
          riskReduction: 30
        }
      }
    ];

    // Customize recommendations based on industry
    if (scenario.industry === 'legal') {
      baseRecommendations.push({
        id: 'demo-rec-legal',
        type: 'compliance',
        title: 'Automated Contract Review',
        description: 'Implement automated contract clause analysis and risk assessment',
        confidence: 0.95,
        impact: 'critical',
        effort: 'moderate',
        expectedOutcome: {
          qualityImprovement: 45,
          timeReduction: 60,
          costSavings: 35,
          riskReduction: 50
        }
      });
    } else if (scenario.industry === 'healthcare') {
      baseRecommendations.push({
        id: 'demo-rec-healthcare',
        type: 'compliance',
        title: 'HIPAA Compliance Automation',
        description: 'Automated PHI detection and redaction for HIPAA compliance',
        confidence: 0.97,
        impact: 'critical',
        effort: 'extensive',
        expectedOutcome: {
          qualityImprovement: 50,
          timeReduction: 30,
          costSavings: 20,
          riskReduction: 70
        }
      });
    }

    return baseRecommendations;
  }

  // Security: Prevent real file processing in demo mode
  validateDemoOperation(operation: string): boolean {
    if (!this.isDemoActive()) {
      throw new Error('Demo session not active');
    }

    // Block certain operations in demo mode
    const blockedOperations = [
      'deleteDocument',
      'exportRealData',
      'accessProductionAPI',
      'modifySystemSettings'
    ];

    if (blockedOperations.includes(operation)) {
      throw new Error(`Operation '${operation}' not allowed in demo mode`);
    }

    return true;
  }

  // Demo session info for UI
  getDemoSessionInfo() {
    if (!this.isDemoActive()) return null;

    const elapsed = this.demoStartTime ? Date.now() - this.demoStartTime.getTime() : 0;
    const remaining = Math.max(0, this.DEMO_DURATION - elapsed);

    return {
      scenario: this.getCurrentScenario(),
      timeElapsed: elapsed,
      timeRemaining: remaining,
      isActive: this.isDemoActive()
    };
  }

  // Available demo scenarios for selection
  getAvailableScenarios(): DemoScenario[] {
    return Object.values(this.demoScenarios);
  }
}

export default new DemoDataService(); 