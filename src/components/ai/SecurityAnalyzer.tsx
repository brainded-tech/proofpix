import React from 'react';

interface SecurityAnalysisResult {
  piiDetected: boolean;
  piiTypes: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  complianceFlags: {
    gdpr: boolean;
    hipaa: boolean;
    ccpa: boolean;
    sox: boolean;
  };
  sensitiveDataCount: number;
  encryptionRecommended: boolean;
  retentionPolicy: string;
}

export class SecurityAnalyzer {
  private static readonly PII_PATTERNS = {
    ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
    creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
    passport: /\b[A-Z]{1,2}\d{6,9}\b/g,
    driverLicense: /\b[A-Z]{1,2}\d{6,8}\b/g,
    bankAccount: /\b\d{8,17}\b/g,
    ipAddress: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
    dateOfBirth: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-](19|20)\d{2}\b/g,
    medicalRecord: /\b(MRN|MR|Medical Record|Patient ID)[\s:]*\d+/gi
  };

  private static readonly SENSITIVE_KEYWORDS = [
    'confidential', 'classified', 'restricted', 'private', 'secret',
    'patient', 'medical', 'diagnosis', 'treatment', 'prescription',
    'financial', 'salary', 'income', 'tax', 'banking', 'account',
    'legal', 'attorney', 'lawsuit', 'settlement', 'contract'
  ];

  static analyzeDocument(text: string, entities: any[]): SecurityAnalysisResult {
    const piiTypes: string[] = [];
    let sensitiveDataCount = 0;
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Detect PII patterns
    Object.entries(this.PII_PATTERNS).forEach(([type, pattern]) => {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        piiTypes.push(type.toUpperCase());
        sensitiveDataCount += matches.length;
      }
    });

    // Check for sensitive keywords
    const lowerText = text.toLowerCase();
    const sensitiveKeywordCount = this.SENSITIVE_KEYWORDS.filter(keyword => 
      lowerText.includes(keyword)
    ).length;

    // Determine risk level
    if (sensitiveDataCount > 10 || sensitiveKeywordCount > 5) {
      riskLevel = 'critical';
    } else if (sensitiveDataCount > 5 || sensitiveKeywordCount > 3) {
      riskLevel = 'high';
    } else if (sensitiveDataCount > 0 || sensitiveKeywordCount > 0) {
      riskLevel = 'medium';
    }

    // Compliance analysis
    const complianceFlags = {
      gdpr: this.checkGDPRCompliance(text, piiTypes),
      hipaa: this.checkHIPAACompliance(text, piiTypes),
      ccpa: this.checkCCPACompliance(text, piiTypes),
      sox: this.checkSOXCompliance(text, piiTypes)
    };

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      riskLevel, 
      piiTypes, 
      complianceFlags,
      sensitiveDataCount
    );

    return {
      piiDetected: piiTypes.length > 0,
      piiTypes,
      riskLevel,
      recommendations,
      complianceFlags,
      sensitiveDataCount,
      encryptionRecommended: riskLevel === 'high' || riskLevel === 'critical',
      retentionPolicy: this.getRetentionPolicy(riskLevel, complianceFlags)
    };
  }

  private static checkGDPRCompliance(text: string, piiTypes: string[]): boolean {
    const gdprSensitiveTypes = ['EMAIL', 'PHONE', 'SSN', 'PASSPORT', 'DRIVERLICENSE'];
    return piiTypes.some(type => gdprSensitiveTypes.includes(type));
  }

  private static checkHIPAACompliance(text: string, piiTypes: string[]): boolean {
    const hipaaKeywords = ['patient', 'medical', 'diagnosis', 'treatment', 'prescription'];
    const lowerText = text.toLowerCase();
    return hipaaKeywords.some(keyword => lowerText.includes(keyword)) ||
           piiTypes.includes('MEDICALRECORD');
  }

  private static checkCCPACompliance(text: string, piiTypes: string[]): boolean {
    const ccpaSensitiveTypes = ['EMAIL', 'PHONE', 'SSN', 'CREDITCARD', 'IPADDRESS'];
    return piiTypes.some(type => ccpaSensitiveTypes.includes(type));
  }

  private static checkSOXCompliance(text: string, piiTypes: string[]): boolean {
    const soxKeywords = ['financial', 'audit', 'revenue', 'earnings', 'accounting'];
    const lowerText = text.toLowerCase();
    return soxKeywords.some(keyword => lowerText.includes(keyword)) ||
           piiTypes.includes('BANKACCOUNT');
  }

  private static generateRecommendations(
    riskLevel: string,
    piiTypes: string[],
    complianceFlags: any,
    sensitiveDataCount: number
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical') {
      recommendations.push('Immediate encryption required for this document');
      recommendations.push('Restrict access to authorized personnel only');
      recommendations.push('Implement audit logging for all access attempts');
    }

    if (riskLevel === 'high' || riskLevel === 'critical') {
      recommendations.push('Consider data masking for non-essential viewers');
      recommendations.push('Enable multi-factor authentication for access');
    }

    if (piiTypes.includes('SSN') || piiTypes.includes('CREDITCARD')) {
      recommendations.push('Apply PCI DSS compliance measures');
      recommendations.push('Implement tokenization for sensitive numbers');
    }

    if (complianceFlags.gdpr) {
      recommendations.push('Ensure GDPR consent mechanisms are in place');
      recommendations.push('Implement right to erasure procedures');
    }

    if (complianceFlags.hipaa) {
      recommendations.push('Apply HIPAA safeguards and access controls');
      recommendations.push('Ensure business associate agreements are signed');
    }

    if (complianceFlags.ccpa) {
      recommendations.push('Implement CCPA privacy notice requirements');
      recommendations.push('Enable consumer rights request handling');
    }

    if (complianceFlags.sox) {
      recommendations.push('Apply SOX financial data protection measures');
      recommendations.push('Implement change management controls');
    }

    if (sensitiveDataCount > 5) {
      recommendations.push('Consider data loss prevention (DLP) tools');
      recommendations.push('Implement regular security assessments');
    }

    return recommendations;
  }

  private static getRetentionPolicy(riskLevel: string, complianceFlags: any): string {
    if (complianceFlags.hipaa) {
      return '6 years (HIPAA requirement)';
    }
    if (complianceFlags.sox) {
      return '7 years (SOX requirement)';
    }
    if (complianceFlags.gdpr) {
      return 'As long as necessary for purpose (GDPR)';
    }
    
    switch (riskLevel) {
      case 'critical':
        return '1 year with secure deletion';
      case 'high':
        return '2 years with secure deletion';
      case 'medium':
        return '3 years standard retention';
      default:
        return '5 years standard retention';
    }
  }

  static generateComplianceReport(analysis: SecurityAnalysisResult): string {
    return `
SECURITY COMPLIANCE REPORT
==========================

Risk Level: ${analysis.riskLevel.toUpperCase()}
PII Detected: ${analysis.piiDetected ? 'YES' : 'NO'}
Sensitive Data Count: ${analysis.sensitiveDataCount}

COMPLIANCE STATUS:
- GDPR: ${analysis.complianceFlags.gdpr ? 'APPLICABLE' : 'NOT APPLICABLE'}
- HIPAA: ${analysis.complianceFlags.hipaa ? 'APPLICABLE' : 'NOT APPLICABLE'}
- CCPA: ${analysis.complianceFlags.ccpa ? 'APPLICABLE' : 'NOT APPLICABLE'}
- SOX: ${analysis.complianceFlags.sox ? 'APPLICABLE' : 'NOT APPLICABLE'}

PII TYPES FOUND:
${analysis.piiTypes.map(type => `- ${type}`).join('\n')}

RECOMMENDATIONS:
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

RETENTION POLICY: ${analysis.retentionPolicy}
ENCRYPTION RECOMMENDED: ${analysis.encryptionRecommended ? 'YES' : 'NO'}
    `.trim();
  }
}

export default SecurityAnalyzer; 