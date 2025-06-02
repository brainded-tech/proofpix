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
  sampleData: boolean; // Flag to indicate this is demo data
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
  sampleFiles: DemoSampleFile[];
  restrictions: DemoRestrictions;
}

export interface DemoSampleFile {
  id: string;
  name: string;
  description: string;
  type: string;
  previewUrl: string;
  expectedResults: any;
  metadata: any;
}

export interface DemoRestrictions {
  maxFiles: number;
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  sessionDuration: number; // in minutes
  featuresEnabled: string[];
  featuresDisabled: string[];
  watermarkResults: boolean;
}

class DemoDataService {
  private isDemoMode: boolean = false;
  private currentScenario: string | null = null;
  private demoStartTime: Date | null = null;
  private readonly DEMO_DURATION = 30 * 60 * 1000; // 30 minutes
  private processedFiles: Set<string> = new Set();

  // Predefined demo scenarios for different industries
  private demoScenarios: Record<string, DemoScenario> = {
    // AI Features Demo Scenarios
    legal: {
      id: 'legal',
      name: 'Legal Document Analysis',
      description: 'AI-powered analysis of legal documents with evidence verification',
      industry: 'legal',
      documents: this.generateLegalDocuments(),
      workflows: this.generateLegalWorkflows(),
      recommendations: this.generateLegalRecommendations(),
      analytics: this.generateLegalAnalytics(),
      duration: 15,
      keyFeatures: ['Document Classification', 'Evidence Analysis', 'Compliance Checking'],
      sampleFiles: this.generateLegalSampleFiles(),
      restrictions: {
        maxFiles: 5,
        maxFileSize: 10,
        allowedFileTypes: ['jpg', 'png', 'pdf'],
        sessionDuration: 15,
        featuresEnabled: ['metadata_extraction', 'ai_analysis', 'report_generation'],
        featuresDisabled: ['api_access', 'bulk_processing', 'custom_branding'],
        watermarkResults: true
      }
    },
    
    insurance: {
      id: 'insurance',
      name: 'Insurance Claims Processing',
      description: 'Automated damage assessment and fraud detection for insurance claims',
      industry: 'insurance',
      documents: this.generateInsuranceDocuments(),
      workflows: this.generateInsuranceWorkflows(),
      recommendations: this.generateInsuranceRecommendations(),
      analytics: this.generateInsuranceAnalytics(),
      duration: 20,
      keyFeatures: ['Damage Assessment', 'Fraud Detection', 'Automated Processing'],
      sampleFiles: this.generateInsuranceSampleFiles(),
      restrictions: {
        maxFiles: 8,
        maxFileSize: 15,
        allowedFileTypes: ['jpg', 'png', 'heic'],
        sessionDuration: 20,
        featuresEnabled: ['fraud_detection', 'damage_assessment', 'timeline_analysis'],
        featuresDisabled: ['api_integration', 'white_label', 'enterprise_sso'],
        watermarkResults: true
      }
    },
    
    healthcare: {
      id: 'healthcare',
      name: 'Medical Image Analysis',
      description: 'AI-assisted medical imaging analysis with HIPAA compliance',
      industry: 'healthcare',
      documents: this.generateHealthcareDocuments(),
      workflows: this.generateHealthcareWorkflows(),
      recommendations: this.generateHealthcareRecommendations(),
      analytics: this.generateHealthcareAnalytics(),
      duration: 25,
      keyFeatures: ['Medical Imaging', 'HIPAA Compliance', 'Diagnostic Support'],
      sampleFiles: this.generateHealthcareSampleFiles(),
      restrictions: {
        maxFiles: 6,
        maxFileSize: 20,
        allowedFileTypes: ['jpg', 'png', 'dicom'],
        sessionDuration: 25,
        featuresEnabled: ['hipaa_compliance', 'medical_analysis', 'privacy_protection'],
        featuresDisabled: ['data_export', 'third_party_integration', 'cloud_storage'],
        watermarkResults: true
      }
    },

    // Enterprise Demo Scenarios
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise Platform Demo',
      description: 'Complete enterprise platform with team management, API access, and white-label features',
      industry: 'general',
      documents: this.generateEnterpriseDocuments(),
      workflows: this.generateEnterpriseWorkflows(),
      recommendations: this.generateEnterpriseRecommendations(),
      analytics: this.generateEnterpriseAnalytics(),
      duration: 30,
      keyFeatures: ['Team Management', 'API Integration', 'White-label Branding', 'Enterprise Security'],
      sampleFiles: this.generateEnterpriseSampleFiles(),
      restrictions: {
        maxFiles: 10,
        maxFileSize: 25,
        allowedFileTypes: ['jpg', 'png', 'pdf', 'tiff'],
        sessionDuration: 30,
        featuresEnabled: ['all_features'],
        featuresDisabled: ['production_api', 'real_data_export', 'billing_access'],
        watermarkResults: true
      }
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
      keyFeatures: ['Legal Compliance', 'Evidence Management', 'Client Portal', 'Audit Trails'],
      sampleFiles: [],
      restrictions: {
        maxFiles: 100,
        maxFileSize: 50,
        allowedFileTypes: ['jpg', 'png', 'pdf', 'tiff', 'doc', 'docx'],
        sessionDuration: 60,
        featuresEnabled: ['all_features'],
        featuresDisabled: ['production_api'],
        watermarkResults: false
      }
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
      keyFeatures: ['Claims Processing', 'Fraud Detection', 'Risk Assessment', 'Regulatory Compliance'],
      sampleFiles: [],
      restrictions: {
        maxFiles: 100,
        maxFileSize: 50,
        allowedFileTypes: ['jpg', 'png', 'pdf', 'tiff', 'doc', 'docx'],
        sessionDuration: 60,
        featuresEnabled: ['all_features'],
        featuresDisabled: ['production_api'],
        watermarkResults: false
      }
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
      keyFeatures: ['HIPAA Compliance', 'Medical Imaging', 'Patient Privacy', 'Clinical Workflows'],
      sampleFiles: [],
      restrictions: {
        maxFiles: 100,
        maxFileSize: 50,
        allowedFileTypes: ['jpg', 'png', 'pdf', 'tiff', 'dcm'],
        sessionDuration: 60,
        featuresEnabled: ['all_features'],
        featuresDisabled: ['production_api'],
        watermarkResults: false
      }
    }
  };

  // Generate sample files for each industry
  private generateLegalSampleFiles(): DemoSampleFile[] {
    return [
      {
        id: 'legal-evidence-1',
        name: 'accident_scene_photo.jpg',
        description: 'Traffic accident scene photograph for personal injury case',
        type: 'evidence_photo',
        previewUrl: '/demo-assets/legal/accident_scene_preview.jpg',
        expectedResults: {
          timestamp: '2024-03-15 14:47:23',
          location: '40.7128° N, 74.0060° W (5th & Main St)',
          device: 'iPhone 14 Pro',
          authenticity: 'Verified - No manipulation detected',
          chainOfCustody: 'Maintained',
          legalAdmissibility: 'Court-ready'
        },
        metadata: {
          camera: 'iPhone 14 Pro',
          lens: '24mm f/1.78',
          iso: 125,
          shutterSpeed: '1/120s',
          gps: { lat: 40.7128, lng: -74.0060 },
          timestamp: '2024-03-15T14:47:23Z'
        }
      },
      {
        id: 'legal-document-1',
        name: 'contract_scan.pdf',
        description: 'Scanned legal contract requiring authenticity verification',
        type: 'legal_document',
        previewUrl: '/demo-assets/legal/contract_preview.pdf',
        expectedResults: {
          documentType: 'Legal Contract',
          scanQuality: 'High (98% confidence)',
          textExtraction: 'Complete',
          signatures: '3 detected and verified',
          authenticity: 'Original document confirmed',
          compliance: 'Meets legal standards'
        },
        metadata: {
          scanner: 'HP LaserJet Pro',
          resolution: '600 DPI',
          colorSpace: 'RGB',
          compression: 'None',
          pages: 12
        }
      }
    ];
  }

  private generateInsuranceSampleFiles(): DemoSampleFile[] {
    return [
      {
        id: 'insurance-damage-1',
        name: 'vehicle_damage_front.jpg',
        description: 'Front-end vehicle damage from collision claim',
        type: 'damage_assessment',
        previewUrl: '/demo-assets/insurance/vehicle_damage_preview.jpg',
        expectedResults: {
          damageAssessment: 'Severe front-end damage',
          estimatedCost: '$8,500 - $12,000',
          fraudRisk: 'Low (15% probability)',
          timestamp: 'Consistent with claim date',
          location: 'Verified at incident location',
          authenticity: 'No editing detected'
        },
        metadata: {
          camera: 'Samsung Galaxy S23',
          timestamp: '2024-03-20T09:15:42Z',
          gps: { lat: 34.0522, lng: -118.2437 },
          weather: 'Clear, 72°F'
        }
      },
      {
        id: 'insurance-property-1',
        name: 'storm_damage_roof.jpg',
        description: 'Roof damage from storm insurance claim',
        type: 'property_damage',
        previewUrl: '/demo-assets/insurance/roof_damage_preview.jpg',
        expectedResults: {
          damageType: 'Hail and wind damage',
          severity: 'Moderate to severe',
          fraudIndicators: 'ALERT: Timestamp inconsistency detected',
          recommendedAction: 'Requires field investigation',
          estimatedCost: '$15,000 - $25,000',
          riskScore: 'High (78% fraud probability)'
        },
        metadata: {
          camera: 'iPhone 13',
          timestamp: '2024-03-18T16:30:15Z',
          gps: { lat: 29.7604, lng: -95.3698 },
          editing: 'Color enhancement detected'
        }
      }
    ];
  }

  private generateHealthcareSampleFiles(): DemoSampleFile[] {
    return [
      {
        id: 'healthcare-xray-1',
        name: 'chest_xray_patient_001.jpg',
        description: 'Chest X-ray for diagnostic analysis (anonymized)',
        type: 'medical_imaging',
        previewUrl: '/demo-assets/healthcare/xray_preview.jpg',
        expectedResults: {
          imageType: 'Chest X-ray (PA view)',
          quality: 'Diagnostic quality confirmed',
          hipaaCompliance: 'Fully compliant - Local processing only',
          findings: 'Normal cardiac silhouette, clear lung fields',
          confidence: '94% diagnostic confidence',
          recommendations: 'Suitable for clinical review'
        },
        metadata: {
          modality: 'Digital Radiography',
          studyDate: '2024-03-22',
          institution: 'Demo Medical Center',
          patientId: 'DEMO_001 (anonymized)',
          technique: 'PA Chest, 120kVp, 2.5mAs'
        }
      }
    ];
  }

  private generateEnterpriseSampleFiles(): DemoSampleFile[] {
    return [
      {
        id: 'enterprise-batch-1',
        name: 'batch_processing_demo.zip',
        description: 'Sample batch of 50 images for enterprise processing demo',
        type: 'batch_processing',
        previewUrl: '/demo-assets/enterprise/batch_preview.jpg',
        expectedResults: {
          totalFiles: 50,
          processedSuccessfully: 48,
          errors: 2,
          averageProcessingTime: '1.2 seconds per file',
          totalProcessingTime: '1 minute 4 seconds',
          apiCallsUsed: 50,
          storageUsed: '0 MB (local processing)'
        },
        metadata: {
          batchId: 'DEMO_BATCH_001',
          submittedBy: 'demo.user@company.com',
          processingMode: 'Enterprise Parallel',
          priority: 'High'
        }
      }
    ];
  }

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
      extractedData: {},
      sampleData: true
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

  // Generate demo data for different industries
  private generateLegalDocuments(): DemoDocument[] {
    return [
      {
        id: 'legal-doc-1',
        name: 'evidence_photo_001.jpg',
        type: 'legal',
        subType: 'evidence_photo',
        size: 2.4 * 1024 * 1024, // 2.4MB
        uploadDate: new Date('2024-03-15T14:47:23Z'),
        status: 'processed',
        confidence: 98.5,
        industry: 'legal',
        demoScenario: 'legal',
        extractedData: {
          timestamp: '2024-03-15 14:47:23',
          location: '40.7128° N, 74.0060° W',
          device: 'iPhone 14 Pro',
          authenticity: 'Verified',
          chainOfCustody: 'Maintained'
        },
        processingTime: 2.3,
        qualityScore: 98.5,
        sampleData: true
      }
    ];
  }

  private generateInsuranceDocuments(): DemoDocument[] {
    return [
      {
        id: 'insurance-doc-1',
        name: 'damage_assessment_001.jpg',
        type: 'business',
        subType: 'damage_photo',
        size: 3.1 * 1024 * 1024, // 3.1MB
        uploadDate: new Date('2024-03-20T09:15:42Z'),
        status: 'processed',
        confidence: 87.2,
        industry: 'insurance',
        demoScenario: 'insurance',
        extractedData: {
          damageType: 'Vehicle collision',
          severity: 'Moderate',
          fraudRisk: 'Low (15%)',
          estimatedCost: '$8,500 - $12,000'
        },
        processingTime: 3.1,
        qualityScore: 87.2,
        sampleData: true
      }
    ];
  }

  private generateHealthcareDocuments(): DemoDocument[] {
    return [
      {
        id: 'healthcare-doc-1',
        name: 'medical_image_001.jpg',
        type: 'medical',
        subType: 'diagnostic_image',
        size: 1.8 * 1024 * 1024, // 1.8MB
        uploadDate: new Date('2024-03-22T10:30:15Z'),
        status: 'processed',
        confidence: 94.7,
        industry: 'healthcare',
        demoScenario: 'healthcare',
        extractedData: {
          imageType: 'Chest X-ray',
          quality: 'Diagnostic',
          hipaaCompliance: 'Verified',
          findings: 'Normal'
        },
        processingTime: 1.9,
        qualityScore: 94.7,
        sampleData: true
      }
    ];
  }

  private generateEnterpriseDocuments(): DemoDocument[] {
    return [
      {
        id: 'enterprise-doc-1',
        name: 'batch_sample_001.jpg',
        type: 'business',
        subType: 'batch_item',
        size: 2.2 * 1024 * 1024, // 2.2MB
        uploadDate: new Date(),
        status: 'processed',
        confidence: 96.3,
        industry: 'general',
        demoScenario: 'enterprise',
        extractedData: {
          batchId: 'DEMO_BATCH_001',
          processingMode: 'Enterprise',
          apiVersion: 'v2.1',
          features: 'All enabled'
        },
        processingTime: 1.2,
        qualityScore: 96.3,
        sampleData: true
      }
    ];
  }

  private generateLegalWorkflows(): any[] {
    return [
      {
        id: 'legal-workflow-1',
        name: 'Evidence Chain of Custody',
        steps: ['Upload', 'Verify', 'Analyze', 'Report', 'Archive'],
        status: 'active',
        compliance: 'Court-admissible'
      }
    ];
  }

  private generateInsuranceWorkflows(): any[] {
    return [
      {
        id: 'insurance-workflow-1',
        name: 'Claims Processing Pipeline',
        steps: ['Intake', 'Damage Assessment', 'Fraud Check', 'Approval', 'Payment'],
        status: 'active',
        automation: '85% automated'
      }
    ];
  }

  private generateHealthcareWorkflows(): any[] {
    return [
      {
        id: 'healthcare-workflow-1',
        name: 'HIPAA-Compliant Analysis',
        steps: ['Secure Upload', 'Local Processing', 'Analysis', 'Report', 'Secure Archive'],
        status: 'active',
        compliance: 'HIPAA-compliant'
      }
    ];
  }

  private generateEnterpriseWorkflows(): any[] {
    return [
      {
        id: 'enterprise-workflow-1',
        name: 'Enterprise Batch Processing',
        steps: ['Batch Upload', 'Parallel Processing', 'Quality Check', 'Report Generation', 'API Response'],
        status: 'active',
        scalability: 'Unlimited'
      }
    ];
  }

  private generateLegalRecommendations(): any[] {
    return [
      {
        type: 'compliance',
        title: 'Evidence Integrity Verified',
        description: 'All uploaded evidence maintains chain of custody and is court-admissible',
        priority: 'high',
        action: 'Proceed with legal proceedings'
      }
    ];
  }

  private generateInsuranceRecommendations(): any[] {
    return [
      {
        type: 'fraud_detection',
        title: 'Low Fraud Risk Detected',
        description: 'Claim appears legitimate based on metadata analysis',
        priority: 'medium',
        action: 'Approve claim for standard processing'
      }
    ];
  }

  private generateHealthcareRecommendations(): any[] {
    return [
      {
        type: 'compliance',
        title: 'HIPAA Compliance Maintained',
        description: 'All processing completed locally with no data transmission',
        priority: 'high',
        action: 'Safe for clinical use'
      }
    ];
  }

  private generateEnterpriseRecommendations(): any[] {
    return [
      {
        type: 'optimization',
        title: 'Processing Efficiency Optimal',
        description: 'Batch processing completed with 96% success rate',
        priority: 'medium',
        action: 'Continue current configuration'
      }
    ];
  }

  private generateLegalAnalytics(): any {
    return {
      totalCases: 247,
      successRate: 98.5,
      averageProcessingTime: '2.3 seconds',
      complianceScore: 100,
      courtAdmissibility: '100%'
    };
  }

  private generateInsuranceAnalytics(): any {
    return {
      totalClaims: 1834,
      fraudDetected: 127,
      fraudRate: '6.9%',
      averageSavings: '$12,400',
      processingTime: '3.1 seconds'
    };
  }

  private generateHealthcareAnalytics(): any {
    return {
      totalImages: 892,
      hipaaCompliance: '100%',
      diagnosticAccuracy: '94.7%',
      processingTime: '1.9 seconds',
      privacyBreaches: 0
    };
  }

  private generateEnterpriseAnalytics(): any {
    return {
      totalFiles: 15847,
      successRate: 96.3,
      apiCalls: 89234,
      averageResponseTime: '1.2 seconds',
      uptime: '99.97%'
    };
  }

  // Demo restriction enforcement
  canProcessFile(fileName: string): boolean {
    const scenario = this.getCurrentScenario();
    if (!scenario) return false;

    // Check if file already processed
    if (this.processedFiles.has(fileName)) {
      return false;
    }

    // Check file limits
    if (this.processedFiles.size >= scenario.restrictions.maxFiles) {
      return false;
    }

    return true;
  }

  markFileProcessed(fileName: string): void {
    this.processedFiles.add(fileName);
  }

  getDemoRestrictions(): DemoRestrictions | null {
    const scenario = this.getCurrentScenario();
    return scenario ? scenario.restrictions : null;
  }

  getSampleFiles(): DemoSampleFile[] {
    const scenario = this.getCurrentScenario();
    return scenario ? scenario.sampleFiles : [];
  }

  isFeatureEnabled(feature: string): boolean {
    const scenario = this.getCurrentScenario();
    if (!scenario) return false;

    const restrictions = scenario.restrictions;
    return restrictions.featuresEnabled.includes(feature) || 
           restrictions.featuresEnabled.includes('all_features');
  }

  shouldWatermarkResults(): boolean {
    const scenario = this.getCurrentScenario();
    return scenario ? scenario.restrictions.watermarkResults : true;
  }
}

export default new DemoDataService(); 