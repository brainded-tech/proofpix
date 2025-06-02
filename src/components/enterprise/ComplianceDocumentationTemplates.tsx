import React, { useState, useEffect } from 'react';
import { industryAIPackagesService } from '../../services/industryAIPackagesService';

interface ComplianceTemplate {
  id: string;
  name: string;
  framework: string;
  type: 'template' | 'checklist' | 'policy' | 'procedure';
  content: string;
  lastUpdated: Date;
  version: string;
  industry: string;
  status: 'draft' | 'approved' | 'archived';
}

interface ComplianceChecklist {
  id: string;
  name: string;
  framework: string;
  items: ChecklistItem[];
  completionRate: number;
  lastAssessed: Date;
}

interface ChecklistItem {
  id: number;
  requirement: string;
  status: 'pending' | 'compliant' | 'non-compliant' | 'not-applicable' | 'partial';
  evidence: string;
  notes: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  assignee?: string;
}

interface ComplianceReport {
  id: string;
  framework: string;
  overallScore: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  lastAssessed: Date;
  gaps: ComplianceGap[];
  recommendations: string[];
}

interface ComplianceGap {
  id: string;
  requirement: string;
  currentState: string;
  targetState: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  remediation: string;
  timeline: string;
}

const ComplianceDocumentationTemplates: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('healthcare');
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['HIPAA']);
  const [activeTab, setActiveTab] = useState<'templates' | 'checklists' | 'reports' | 'automation'>('templates');
  const [templates, setTemplates] = useState<ComplianceTemplate[]>([]);
  const [checklists, setChecklists] = useState<ComplianceChecklist[]>([]);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ComplianceTemplate | null>(null);

  const industries = [
    { value: 'healthcare', label: 'Healthcare', frameworks: ['HIPAA', 'FDA', 'HITECH'] },
    { value: 'finance', label: 'Financial Services', frameworks: ['SOX', 'PCI-DSS', 'GDPR'] },
    { value: 'legal', label: 'Legal', frameworks: ['ABA', 'GDPR', 'CCPA'] },
    { value: 'government', label: 'Government', frameworks: ['FedRAMP', 'FISMA', 'NIST'] },
    { value: 'education', label: 'Education', frameworks: ['FERPA', 'COPPA', 'GDPR'] }
  ];

  useEffect(() => {
    loadComplianceData();
  }, [selectedIndustry, selectedFrameworks]);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      const data = await industryAIPackagesService.getComplianceTemplates(
        selectedIndustry,
        selectedFrameworks
      );
      
      // Mock data for demonstration
      setTemplates([
        {
          id: 'hipaa-privacy-policy',
          name: 'HIPAA Privacy Policy Template',
          framework: 'HIPAA',
          type: 'template',
          content: generateHIPAAPrivacyPolicy(),
          lastUpdated: new Date(),
          version: '2.1',
          industry: 'healthcare',
          status: 'approved'
        },
        {
          id: 'hipaa-security-policy',
          name: 'HIPAA Security Policy Template',
          framework: 'HIPAA',
          type: 'template',
          content: generateHIPAASecurityPolicy(),
          lastUpdated: new Date(),
          version: '1.8',
          industry: 'healthcare',
          status: 'approved'
        },
        {
          id: 'incident-response-procedure',
          name: 'Data Breach Incident Response Procedure',
          framework: 'HIPAA',
          type: 'procedure',
          content: generateIncidentResponseProcedure(),
          lastUpdated: new Date(),
          version: '1.5',
          industry: 'healthcare',
          status: 'approved'
        }
      ]);

      setChecklists([
        {
          id: 'hipaa-compliance-checklist',
          name: 'HIPAA Compliance Checklist',
          framework: 'HIPAA',
          items: generateHIPAAChecklist(),
          completionRate: 78,
          lastAssessed: new Date()
        }
      ]);

      setReports([
        {
          id: 'hipaa-assessment-2024',
          framework: 'HIPAA',
          overallScore: 85,
          status: 'partial',
          lastAssessed: new Date(),
          gaps: [
            {
              id: 'gap-1',
              requirement: 'Encryption of PHI in transit',
              currentState: 'TLS 1.2 implemented',
              targetState: 'TLS 1.3 with end-to-end encryption',
              riskLevel: 'medium',
              remediation: 'Upgrade to TLS 1.3 and implement E2E encryption',
              timeline: '3 months'
            }
          ],
          recommendations: [
            'Implement automated PHI detection and classification',
            'Enhance access logging and monitoring',
            'Conduct quarterly security assessments'
          ]
        }
      ]);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateHIPAAPrivacyPolicy = (): string => {
    return `# HIPAA Privacy Policy Template

## 1. Purpose and Scope
This Privacy Policy establishes the framework for protecting Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act (HIPAA) Privacy Rule.

## 2. Definitions
- **Protected Health Information (PHI)**: Individually identifiable health information transmitted or maintained in any form or medium
- **Covered Entity**: Health plans, healthcare clearinghouses, and healthcare providers
- **Business Associate**: Person or entity that performs functions involving PHI on behalf of a covered entity

## 3. Privacy Principles
### 3.1 Minimum Necessary Standard
Use, disclose, and request only the minimum amount of PHI necessary to accomplish the intended purpose.

### 3.2 Individual Rights
Patients have the right to:
- Access their PHI
- Request amendments to their PHI
- Request restrictions on use and disclosure
- Request confidential communications
- File complaints

## 4. Administrative Safeguards
- Designate a Privacy Officer
- Conduct workforce training
- Implement access management procedures
- Establish incident response procedures

## 5. Physical Safeguards
- Facility access controls
- Workstation use restrictions
- Device and media controls

## 6. Technical Safeguards
- Access control measures
- Audit controls
- Integrity controls
- Person or entity authentication
- Transmission security

## 7. Breach Notification
In the event of a breach:
1. Assess the breach within 24 hours
2. Notify individuals within 60 days
3. Notify HHS within 60 days
4. Notify media if breach affects 500+ individuals

## 8. Training and Awareness
All workforce members must complete HIPAA privacy training:
- Initial training within 30 days of hire
- Annual refresher training
- Incident-specific training as needed

## 9. Compliance Monitoring
- Regular privacy risk assessments
- Audit of access logs
- Review of privacy practices
- Documentation of compliance activities

## 10. Sanctions
Violations of this policy may result in:
- Corrective action
- Disciplinary measures
- Termination of employment
- Legal action

---
*This template should be customized to reflect your organization's specific practices and procedures.*`;
  };

  const generateHIPAASecurityPolicy = (): string => {
    return `# HIPAA Security Policy Template

## 1. Security Management Process
Establish formal security management processes to conduct security activities.

### 1.1 Security Officer
- Designate a Security Officer responsible for security program
- Define roles and responsibilities
- Ensure adequate resources for security activities

### 1.2 Security Policies and Procedures
- Develop comprehensive security policies
- Regular review and updates
- Communication to all workforce members

## 2. Access Control
Implement procedures for granting access to ePHI.

### 2.1 Unique User Identification
- Assign unique identifiers to each user
- Prohibit shared accounts
- Regular review of user accounts

### 2.2 Automatic Logoff
- Implement automatic logoff after period of inactivity
- Configure appropriate timeout periods
- Balance security with usability

### 2.3 Encryption and Decryption
- Encrypt ePHI at rest and in transit
- Use FIPS 140-2 validated encryption
- Secure key management practices

## 3. Audit Controls
Implement hardware, software, and procedural mechanisms for recording access to ePHI.

### 3.1 Audit Logging
- Log all access to ePHI systems
- Include user ID, timestamp, and actions
- Protect audit logs from unauthorized access

### 3.2 Audit Review
- Regular review of audit logs
- Investigate suspicious activities
- Document review findings

## 4. Integrity
Protect ePHI from improper alteration or destruction.

### 4.1 Data Integrity Controls
- Implement checksums and digital signatures
- Version control for documents
- Backup and recovery procedures

## 5. Person or Entity Authentication
Verify user identity before granting access.

### 5.1 Multi-Factor Authentication
- Implement MFA for all users
- Use strong authentication methods
- Regular review of authentication logs

## 6. Transmission Security
Guard against unauthorized access to ePHI during transmission.

### 6.1 End-to-End Encryption
- Encrypt all ePHI transmissions
- Use secure protocols (TLS 1.3)
- Verify recipient identity

---
*Customize this template based on your organization's technical infrastructure and risk assessment.*`;
  };

  const generateIncidentResponseProcedure = (): string => {
    return `# Data Breach Incident Response Procedure

## 1. Incident Detection and Reporting
### 1.1 Detection Methods
- Automated monitoring systems
- Employee reports
- Patient complaints
- External notifications

### 1.2 Initial Response (Within 1 Hour)
1. Secure the affected systems
2. Notify the Security Officer
3. Begin incident documentation
4. Preserve evidence

## 2. Incident Assessment (Within 24 Hours)
### 2.1 Scope Determination
- Identify affected systems and data
- Determine number of individuals affected
- Assess type of PHI involved

### 2.2 Risk Assessment
- Evaluate likelihood of compromise
- Assess potential harm to individuals
- Consider mitigation factors

## 3. Containment and Mitigation
### 3.1 Immediate Actions
- Isolate affected systems
- Change compromised credentials
- Apply security patches
- Implement additional monitoring

### 3.2 Evidence Preservation
- Create forensic images
- Document all actions taken
- Maintain chain of custody

## 4. Notification Requirements
### 4.1 Individual Notification (Within 60 Days)
Required elements:
- Description of the breach
- Types of information involved
- Steps individuals should take
- Contact information for questions

### 4.2 HHS Notification (Within 60 Days)
Submit breach report including:
- Number of individuals affected
- Description of breach
- Discovery date
- Mitigation efforts

### 4.3 Media Notification (If Required)
For breaches affecting 500+ individuals:
- Notify prominent media outlets
- Provide same information as individual notice
- Coordinate with legal counsel

## 5. Recovery and Lessons Learned
### 5.1 System Recovery
- Verify system integrity
- Implement additional safeguards
- Monitor for ongoing threats

### 5.2 Post-Incident Review
- Conduct lessons learned session
- Update policies and procedures
- Provide additional training
- Document improvements

---
*This procedure should be tested regularly through tabletop exercises and updated based on lessons learned.*`;
  };

  const generateHIPAAChecklist = (): ChecklistItem[] => {
    return [
      {
        id: 1,
        requirement: 'Designate a Privacy Officer',
        status: 'compliant',
        evidence: 'John Smith appointed as Privacy Officer on 01/15/2024',
        notes: 'Privacy Officer has completed required training',
        priority: 'critical'
      },
      {
        id: 2,
        requirement: 'Conduct workforce HIPAA training',
        status: 'compliant',
        evidence: 'Annual training completed by 98% of workforce',
        notes: '2 employees pending training completion',
        priority: 'high'
      },
      {
        id: 3,
        requirement: 'Implement minimum necessary standard',
        status: 'partial',
        evidence: 'Policies in place, technical controls being implemented',
        notes: 'Need to complete role-based access controls',
        priority: 'high'
      },
      {
        id: 4,
        requirement: 'Encrypt PHI in transit and at rest',
        status: 'compliant',
        evidence: 'AES-256 encryption implemented for all PHI',
        notes: 'Regular encryption key rotation in place',
        priority: 'critical'
      },
      {
        id: 5,
        requirement: 'Implement audit controls',
        status: 'compliant',
        evidence: 'Comprehensive audit logging system deployed',
        notes: 'Monthly audit log reviews conducted',
        priority: 'high'
      },
      {
        id: 6,
        requirement: 'Establish breach notification procedures',
        status: 'non-compliant',
        evidence: 'Draft procedures exist but not formally approved',
        notes: 'Requires legal review and management approval',
        priority: 'critical'
      }
    ];
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'non-compliant': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Available Templates</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedTemplate?.id === template.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.framework}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                          {template.status}
                        </span>
                        <span className="text-xs text-gray-500">v{template.version}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {template.type === 'template' ? '📄' : template.type === 'policy' ? '📋' : '⚙️'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Template Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTemplate ? selectedTemplate.name : 'Select a template'}
                </h3>
                {selectedTemplate && (
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      Download
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                      Customize
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Framework:</span>
                      <span className="ml-2">{selectedTemplate.framework}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Version:</span>
                      <span className="ml-2">{selectedTemplate.version}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Last Updated:</span>
                      <span className="ml-2">{selectedTemplate.lastUpdated.toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTemplate.status)}`}>
                        {selectedTemplate.status}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                      {selectedTemplate.content}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">📄</div>
                  <p>Select a template from the list to view its content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChecklistsTab = () => (
    <div className="space-y-6">
      {checklists.map((checklist) => (
        <div key={checklist.id} className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{checklist.name}</h3>
                <p className="text-sm text-gray-600">{checklist.framework} Framework</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{checklist.completionRate}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${checklist.completionRate}%` }}
                />
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {checklist.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.status === 'compliant' ? 'bg-green-100 text-green-600' :
                      item.status === 'non-compliant' ? 'bg-red-100 text-red-600' :
                      item.status === 'partial' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status === 'compliant' ? '✓' : 
                       item.status === 'non-compliant' ? '✗' :
                       item.status === 'partial' ? '◐' : '○'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.requirement}</h4>
                        {item.evidence && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Evidence:</span> {item.evidence}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Notes:</span> {item.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      {reports.map((report) => (
        <div key={report.id} className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{report.framework} Compliance Report</h3>
                <p className="text-sm text-gray-600">Last assessed: {report.lastAssessed.toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{report.overallScore}</div>
                <div className="text-sm text-gray-600">Overall Score</div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Gaps */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Compliance Gaps</h4>
                <div className="space-y-3">
                  {report.gaps.map((gap) => (
                    <div key={gap.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{gap.requirement}</h5>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Current:</span> {gap.currentState}</p>
                            <p><span className="font-medium">Target:</span> {gap.targetState}</p>
                            <p><span className="font-medium">Remediation:</span> {gap.remediation}</p>
                            <p><span className="font-medium">Timeline:</span> {gap.timeline}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          gap.riskLevel === 'critical' ? 'bg-red-100 text-red-600' :
                          gap.riskLevel === 'high' ? 'bg-orange-100 text-orange-600' :
                          gap.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {gap.riskLevel} risk
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">AI-Powered Recommendations</h4>
                <div className="space-y-3">
                  {report.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 text-lg">💡</span>
                      <p className="text-sm text-blue-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAutomationTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Compliance Automation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-full">
                <span className="text-green-600 text-xl">🤖</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Automated Assessments</h4>
                <p className="text-sm text-gray-600">Continuous compliance monitoring</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Daily Scans</span>
                <span className="text-green-600">✓ Active</span>
              </div>
              <div className="flex justify-between">
                <span>Policy Violations</span>
                <span className="text-red-600">3 Found</span>
              </div>
              <div className="flex justify-between">
                <span>Last Scan</span>
                <span>2 hours ago</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Report Generation</h4>
                <p className="text-sm text-gray-600">Automated compliance reports</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monthly Reports</span>
                <span className="text-green-600">✓ Scheduled</span>
              </div>
              <div className="flex justify-between">
                <span>Next Report</span>
                <span>Dec 1, 2024</span>
              </div>
              <div className="flex justify-between">
                <span>Recipients</span>
                <span>5 stakeholders</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <span className="text-purple-600 text-xl">🔔</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Alert System</h4>
                <p className="text-sm text-gray-600">Real-time compliance alerts</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Alerts</span>
                <span className="text-orange-600">2 Medium</span>
              </div>
              <div className="flex justify-between">
                <span>Response Time</span>
                <span>&lt; 15 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Escalation</span>
                <span className="text-green-600">✓ Configured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Automation Rules */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Automation Rules</h3>
        <div className="space-y-4">
          {[
            {
              name: 'PHI Access Monitoring',
              description: 'Monitor and alert on unusual PHI access patterns',
              status: 'active',
              triggers: 'Access outside business hours, bulk data access',
              actions: 'Send alert, log incident, require justification'
            },
            {
              name: 'Encryption Compliance',
              description: 'Ensure all PHI is encrypted according to standards',
              status: 'active',
              triggers: 'Unencrypted PHI detected',
              actions: 'Block access, notify security team, auto-encrypt'
            },
            {
              name: 'Training Compliance',
              description: 'Track and enforce mandatory compliance training',
              status: 'active',
              triggers: 'Training deadline approaching, overdue training',
              actions: 'Send reminders, restrict access, notify manager'
            }
          ].map((rule, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{rule.name}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rule.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rule.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="font-medium text-gray-700">Triggers:</span> {rule.triggers}</p>
                    <p><span className="font-medium text-gray-700">Actions:</span> {rule.actions}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                    Test
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Documentation Templates</h1>
          <p className="text-gray-600">
            Industry-specific compliance templates, checklists, and automated reporting
          </p>
        </div>

        {/* Industry and Framework Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {industries.map((industry) => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Frameworks</label>
              <div className="flex flex-wrap gap-2">
                {industries.find(i => i.value === selectedIndustry)?.frameworks.map((framework) => (
                  <label key={framework} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFrameworks.includes(framework)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFrameworks([...selectedFrameworks, framework]);
                        } else {
                          setSelectedFrameworks(selectedFrameworks.filter(f => f !== framework));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{framework}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'templates', name: 'Templates', icon: '📄' },
                { id: 'checklists', name: 'Checklists', icon: '✅' },
                { id: 'reports', name: 'Reports', icon: '📊' },
                { id: 'automation', name: 'Automation', icon: '🤖' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'templates' && renderTemplatesTab()}
          {activeTab === 'checklists' && renderChecklistsTab()}
          {activeTab === 'reports' && renderReportsTab()}
          {activeTab === 'automation' && renderAutomationTab()}
        </div>
      </div>
    </div>
  );
};

export default ComplianceDocumentationTemplates; 