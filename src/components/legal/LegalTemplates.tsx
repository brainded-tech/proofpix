import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Edit, Plus, Search, Filter, Calendar, User, Scale, Gavel } from 'lucide-react';
import { chainOfCustody } from '../../utils/chainOfCustody';
import { errorHandler } from '../../utils/errorHandler';

interface LegalTemplate {
  id: string;
  name: string;
  type: 'motion' | 'affidavit' | 'exhibit_list' | 'chain_of_custody' | 'expert_report' | 'discovery_response' | 'subpoena' | 'court_order';
  jurisdiction: 'federal' | 'state' | 'local' | 'international';
  court: string;
  description: string;
  category: 'civil' | 'criminal' | 'family' | 'corporate' | 'intellectual_property' | 'employment';
  fields: TemplateField[];
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  tags: string[];
  usage_count: number;
  compliance_frameworks: string[];
}

interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'checkbox' | 'file_reference' | 'custody_log';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    message?: string;
  };
  defaultValue?: any;
  description?: string;
}

interface GeneratedDocument {
  id: string;
  templateId: string;
  templateName: string;
  fileName: string;
  content: string;
  data: Record<string, any>;
  generatedAt: Date;
  generatedBy: string;
  caseNumber?: string;
  status: 'draft' | 'final' | 'filed';
  signatures: DocumentSignature[];
  attachments: string[];
}

interface DocumentSignature {
  id: string;
  signerName: string;
  signerTitle: string;
  signedAt: Date;
  signature: string;
  verified: boolean;
}

interface LegalTemplatesProps {
  className?: string;
}

export const LegalTemplates: React.FC<LegalTemplatesProps> = ({
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'generated' | 'create'>('templates');
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocument[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterJurisdiction, setFilterJurisdiction] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadTemplates();
    loadGeneratedDocuments();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      
      const mockTemplates: LegalTemplate[] = [
        {
          id: 'template_001',
          name: 'Motion for Summary Judgment - Digital Evidence',
          type: 'motion',
          jurisdiction: 'federal',
          court: 'U.S. District Court',
          description: 'Standard motion for summary judgment with digital evidence authentication',
          category: 'civil',
          content: `UNITED STATES DISTRICT COURT
FOR THE {{district}}

{{plaintiff_name}},
                    Plaintiff,
v.                                    Case No. {{case_number}}
{{defendant_name}},
                    Defendant.

MOTION FOR SUMMARY JUDGMENT

TO THE HONORABLE COURT:

Plaintiff {{plaintiff_name}}, by and through undersigned counsel, respectfully moves this Court for summary judgment pursuant to Federal Rule of Civil Procedure 56.

I. STATEMENT OF FACTS

{{fact_statement}}

II. DIGITAL EVIDENCE AUTHENTICATION

The following digital evidence has been properly authenticated pursuant to Federal Rules of Evidence 901 and 902:

{{#each evidence_files}}
- {{name}}: {{description}}
  Chain of Custody ID: {{custody_id}}
  Hash: {{hash}}
  Authenticated: {{authenticated_date}}
{{/each}}

III. LEGAL STANDARD

{{legal_standard}}

IV. ARGUMENT

{{argument}}

V. CONCLUSION

For the foregoing reasons, Plaintiff respectfully requests that this Court grant summary judgment in favor of Plaintiff.

Respectfully submitted,

{{attorney_name}}
{{attorney_title}}
{{bar_number}}
{{firm_name}}
{{address}}
{{phone}}
{{email}}

Attorney for {{client_name}}`,
          fields: [
            {
              id: 'district',
              name: 'district',
              label: 'District',
              type: 'text',
              required: true,
              placeholder: 'e.g., NORTHERN DISTRICT OF CALIFORNIA'
            },
            {
              id: 'case_number',
              name: 'case_number',
              label: 'Case Number',
              type: 'text',
              required: true,
              placeholder: 'e.g., 3:24-cv-00123'
            },
            {
              id: 'plaintiff_name',
              name: 'plaintiff_name',
              label: 'Plaintiff Name',
              type: 'text',
              required: true
            },
            {
              id: 'defendant_name',
              name: 'defendant_name',
              label: 'Defendant Name',
              type: 'text',
              required: true
            },
            {
              id: 'evidence_files',
              name: 'evidence_files',
              label: 'Evidence Files',
              type: 'custody_log',
              required: true,
              description: 'Select files from chain of custody system'
            },
            {
              id: 'fact_statement',
              name: 'fact_statement',
              label: 'Statement of Facts',
              type: 'textarea',
              required: true,
              placeholder: 'Provide a clear and concise statement of the material facts...'
            },
            {
              id: 'legal_standard',
              name: 'legal_standard',
              label: 'Legal Standard',
              type: 'textarea',
              required: true,
              defaultValue: 'Summary judgment is appropriate when there is no genuine dispute as to any material fact and the movant is entitled to judgment as a matter of law. Fed. R. Civ. P. 56(a).'
            },
            {
              id: 'argument',
              name: 'argument',
              label: 'Argument',
              type: 'textarea',
              required: true,
              placeholder: 'Present your legal arguments...'
            },
            {
              id: 'attorney_name',
              name: 'attorney_name',
              label: 'Attorney Name',
              type: 'text',
              required: true
            },
            {
              id: 'attorney_title',
              name: 'attorney_title',
              label: 'Attorney Title',
              type: 'text',
              required: true,
              defaultValue: 'Attorney for Plaintiff'
            },
            {
              id: 'bar_number',
              name: 'bar_number',
              label: 'Bar Number',
              type: 'text',
              required: true
            },
            {
              id: 'firm_name',
              name: 'firm_name',
              label: 'Firm Name',
              type: 'text',
              required: true
            }
          ],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          createdBy: 'Legal Team',
          version: '2.1',
          status: 'active',
          tags: ['motion', 'summary judgment', 'digital evidence', 'federal'],
          usage_count: 45,
          compliance_frameworks: ['FRE', 'FRCP']
        },
        {
          id: 'template_002',
          name: 'Chain of Custody Affidavit',
          type: 'affidavit',
          jurisdiction: 'federal',
          court: 'All Courts',
          description: 'Sworn affidavit establishing chain of custody for digital evidence',
          category: 'criminal',
          content: `AFFIDAVIT OF CHAIN OF CUSTODY

STATE OF {{state}}
COUNTY OF {{county}}

I, {{affiant_name}}, being duly sworn, depose and state as follows:

1. I am {{affiant_title}} with {{organization}} and have been employed in this capacity since {{employment_date}}.

2. I am familiar with the procedures for handling, storing, and maintaining digital evidence in accordance with {{compliance_frameworks}}.

3. On {{collection_date}}, I collected the following digital evidence:

{{#each evidence_items}}
   Item {{@index}}: {{name}}
   Description: {{description}}
   Original Hash: {{original_hash}}
   Current Hash: {{current_hash}}
   Collection Method: {{collection_method}}
   Storage Location: {{storage_location}}
{{/each}}

4. The chain of custody for the above-described evidence has been maintained as follows:

{{custody_timeline}}

5. The digital evidence has been stored in a secure environment with restricted access and has not been altered, modified, or tampered with in any way.

6. All access to the evidence has been logged and documented in accordance with established protocols.

7. The integrity of the digital evidence has been verified through cryptographic hash comparison, and the evidence remains in the same condition as when originally collected.

I declare under penalty of perjury that the foregoing is true and correct.

Executed on {{execution_date}} at {{execution_location}}.

_________________________
{{affiant_name}}
{{affiant_title}}

Subscribed and sworn to before me this {{notary_date}} day of {{notary_month}}, {{notary_year}}.

_________________________
Notary Public
My commission expires: {{commission_expiry}}`,
          fields: [
            {
              id: 'state',
              name: 'state',
              label: 'State',
              type: 'text',
              required: true
            },
            {
              id: 'county',
              name: 'county',
              label: 'County',
              type: 'text',
              required: true
            },
            {
              id: 'affiant_name',
              name: 'affiant_name',
              label: 'Affiant Name',
              type: 'text',
              required: true
            },
            {
              id: 'affiant_title',
              name: 'affiant_title',
              label: 'Affiant Title',
              type: 'text',
              required: true,
              placeholder: 'e.g., Digital Forensics Specialist'
            },
            {
              id: 'organization',
              name: 'organization',
              label: 'Organization',
              type: 'text',
              required: true
            },
            {
              id: 'evidence_items',
              name: 'evidence_items',
              label: 'Evidence Items',
              type: 'custody_log',
              required: true,
              description: 'Select evidence items from chain of custody system'
            },
            {
              id: 'collection_date',
              name: 'collection_date',
              label: 'Collection Date',
              type: 'date',
              required: true
            },
            {
              id: 'custody_timeline',
              name: 'custody_timeline',
              label: 'Custody Timeline',
              type: 'textarea',
              required: true,
              description: 'Detailed timeline of evidence custody'
            },
            {
              id: 'execution_date',
              name: 'execution_date',
              label: 'Execution Date',
              type: 'date',
              required: true,
              defaultValue: new Date().toISOString().split('T')[0]
            },
            {
              id: 'execution_location',
              name: 'execution_location',
              label: 'Execution Location',
              type: 'text',
              required: true
            }
          ],
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-25'),
          createdBy: 'Forensics Team',
          version: '1.3',
          status: 'active',
          tags: ['affidavit', 'chain of custody', 'digital evidence', 'forensics'],
          usage_count: 78,
          compliance_frameworks: ['FRE', 'FRCP', 'ISO27001']
        },
        {
          id: 'template_003',
          name: 'Expert Witness Report - Digital Forensics',
          type: 'expert_report',
          jurisdiction: 'federal',
          court: 'All Courts',
          description: 'Comprehensive expert witness report for digital forensics analysis',
          category: 'civil',
          content: `EXPERT WITNESS REPORT
DIGITAL FORENSICS ANALYSIS

Case: {{case_name}}
Case Number: {{case_number}}
Date: {{report_date}}

EXPERT WITNESS: {{expert_name}}

I. QUALIFICATIONS

{{expert_qualifications}}

II. SCOPE OF ENGAGEMENT

I was retained to examine and analyze digital evidence in connection with {{case_description}}.

III. MATERIALS EXAMINED

The following digital evidence was examined:

{{#each evidence_files}}
- {{name}}
  File Type: {{type}}
  Size: {{size}}
  Hash (SHA-256): {{hash}}
  Date Created: {{created_date}}
  Date Modified: {{modified_date}}
  Chain of Custody ID: {{custody_id}}
{{/each}}

IV. METHODOLOGY

{{methodology}}

V. FINDINGS

{{findings}}

VI. OPINIONS

Based on my analysis, it is my opinion that:

{{opinions}}

VII. CHAIN OF CUSTODY VERIFICATION

I have verified the chain of custody for all examined evidence. The integrity of the digital evidence has been maintained throughout the examination process.

{{custody_verification}}

VIII. CONCLUSION

{{conclusion}}

This report is prepared in accordance with Federal Rule of Evidence 702 and Federal Rule of Civil Procedure 26(a)(2)(B).

Respectfully submitted,

{{expert_name}}
{{expert_title}}
{{expert_credentials}}
Date: {{signature_date}}`,
          fields: [
            {
              id: 'case_name',
              name: 'case_name',
              label: 'Case Name',
              type: 'text',
              required: true
            },
            {
              id: 'case_number',
              name: 'case_number',
              label: 'Case Number',
              type: 'text',
              required: true
            },
            {
              id: 'expert_name',
              name: 'expert_name',
              label: 'Expert Name',
              type: 'text',
              required: true
            },
            {
              id: 'expert_qualifications',
              name: 'expert_qualifications',
              label: 'Expert Qualifications',
              type: 'textarea',
              required: true,
              placeholder: 'Detail education, experience, certifications, and relevant background...'
            },
            {
              id: 'case_description',
              name: 'case_description',
              label: 'Case Description',
              type: 'textarea',
              required: true
            },
            {
              id: 'evidence_files',
              name: 'evidence_files',
              label: 'Evidence Files',
              type: 'custody_log',
              required: true,
              description: 'Select files from chain of custody system for analysis'
            },
            {
              id: 'methodology',
              name: 'methodology',
              label: 'Methodology',
              type: 'textarea',
              required: true,
              placeholder: 'Describe the methods and tools used in the analysis...'
            },
            {
              id: 'findings',
              name: 'findings',
              label: 'Findings',
              type: 'textarea',
              required: true,
              placeholder: 'Present factual findings from the analysis...'
            },
            {
              id: 'opinions',
              name: 'opinions',
              label: 'Expert Opinions',
              type: 'textarea',
              required: true,
              placeholder: 'State professional opinions based on the analysis...'
            },
            {
              id: 'custody_verification',
              name: 'custody_verification',
              label: 'Custody Verification',
              type: 'textarea',
              required: true,
              placeholder: 'Detail the chain of custody verification process...'
            },
            {
              id: 'conclusion',
              name: 'conclusion',
              label: 'Conclusion',
              type: 'textarea',
              required: true
            }
          ],
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-30'),
          createdBy: 'Expert Witness Team',
          version: '3.0',
          status: 'active',
          tags: ['expert report', 'digital forensics', 'analysis', 'federal'],
          usage_count: 23,
          compliance_frameworks: ['FRE', 'FRCP', 'Daubert']
        }
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      await errorHandler.handleError('legal_templates_load', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadGeneratedDocuments = async () => {
    try {
      const mockDocs: GeneratedDocument[] = [
        {
          id: 'doc_001',
          templateId: 'template_001',
          templateName: 'Motion for Summary Judgment - Digital Evidence',
          fileName: 'Motion_Summary_Judgment_Case_2024_001.pdf',
          content: '',
          data: {
            case_number: '3:24-cv-00123',
            plaintiff_name: 'TechCorp Inc.',
            defendant_name: 'DataBreach LLC'
          },
          generatedAt: new Date('2024-01-25'),
          generatedBy: 'Attorney Smith',
          caseNumber: '3:24-cv-00123',
          status: 'final',
          signatures: [
            {
              id: 'sig_001',
              signerName: 'John Smith',
              signerTitle: 'Attorney for Plaintiff',
              signedAt: new Date('2024-01-25'),
              signature: 'digital_signature_hash',
              verified: true
            }
          ],
          attachments: ['evidence_001.jpg', 'evidence_002.pdf']
        }
      ];

      setGeneratedDocs(mockDocs);
    } catch (error) {
      await errorHandler.handleError('generated_docs_load', error as Error);
    }
  };

  const generateDocument = async (template: LegalTemplate, data: Record<string, any>) => {
    try {
      // Process custody log fields
      const processedData = { ...data };
      
      for (const field of template.fields) {
        if (field.type === 'custody_log' && data[field.name]) {
          const custodyLogs = chainOfCustody.getAllCustodyLogs();
          const selectedFiles = data[field.name] as string[];
          
          processedData[field.name] = selectedFiles.map(fileId => {
            const log = custodyLogs.find(l => l.fileId === fileId);
            return log ? {
              name: log.fileName,
              custody_id: log.fileId,
              hash: log.currentHash,
              authenticated_date: log.createdAt.toLocaleDateString(),
              description: `Digital evidence file with verified chain of custody`,
              type: 'Digital File',
              size: 'N/A',
              created_date: log.createdAt.toLocaleDateString(),
              modified_date: log.lastModified.toLocaleDateString()
            } : null;
          }).filter(Boolean);
        }
      }

      // Generate document content using simple template replacement
      let content = template.content;
      
      // Replace simple variables
      Object.keys(processedData).forEach(key => {
        const value = processedData[key];
        if (typeof value === 'string' || typeof value === 'number') {
          content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        }
      });

      // Handle arrays (like evidence files)
      Object.keys(processedData).forEach(key => {
        const value = processedData[key];
        if (Array.isArray(value)) {
          const listRegex = new RegExp(`{{#each ${key}}}([\\s\\S]*?){{/each}}`, 'g');
          content = content.replace(listRegex, (match, itemTemplate) => {
            return value.map(item => {
              let itemContent = itemTemplate;
              Object.keys(item).forEach(itemKey => {
                itemContent = itemContent.replace(new RegExp(`{{${itemKey}}}`, 'g'), String(item[itemKey]));
              });
              return itemContent;
            }).join('\n');
          });
        }
      });

      const newDoc: GeneratedDocument = {
        id: `doc_${Date.now()}`,
        templateId: template.id,
        templateName: template.name,
        fileName: `${template.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
        content,
        data: processedData,
        generatedAt: new Date(),
        generatedBy: 'Current User',
        caseNumber: data.case_number || '',
        status: 'draft',
        signatures: [],
        attachments: []
      };

      setGeneratedDocs(prev => [...prev, newDoc]);
      setActiveTab('generated');
      
      // Update template usage count
      setTemplates(prev => prev.map(t => 
        t.id === template.id 
          ? { ...t, usage_count: t.usage_count + 1 }
          : t
      ));

    } catch (error) {
      await errorHandler.handleError('document_generation', error as Error);
    }
  };

  const downloadDocument = async (doc: GeneratedDocument) => {
    try {
      const blob = new Blob([doc.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      await errorHandler.handleError('document_download', error as Error);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || template.type === filterType;
    const matchesJurisdiction = filterJurisdiction === 'all' || template.jurisdiction === filterJurisdiction;
    
    return matchesSearch && matchesType && matchesJurisdiction;
  });

  const renderTemplateForm = (template: LegalTemplate) => {
    const custodyLogs = chainOfCustody.getAllCustodyLogs();

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            {template.name}
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            {template.description}
          </p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600 dark:text-blue-400">
            <span>Type: {template.type}</span>
            <span>Jurisdiction: {template.jurisdiction}</span>
            <span>Version: {template.version}</span>
          </div>
        </div>

        {template.fields.map(field => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {field.description}
              </p>
            )}

            {field.type === 'text' && (
              <input
                type="text"
                value={formData[field.name] || field.defaultValue || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required={field.required}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                value={formData[field.name] || field.defaultValue || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required={field.required}
              />
            )}

            {field.type === 'date' && (
              <input
                type="date"
                value={formData[field.name] || field.defaultValue || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required={field.required}
              />
            )}

            {field.type === 'select' && field.options && (
              <select
                value={formData[field.name] || field.defaultValue || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required={field.required}
              >
                <option value="">Select an option</option>
                {field.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}

            {field.type === 'custody_log' && (
              <div className="space-y-2">
                <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
                  {custodyLogs.map(log => (
                    <label key={log.fileId} className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input
                        type="checkbox"
                        checked={(formData[field.name] as string[] || []).includes(log.fileId)}
                        onChange={(e) => {
                          const currentSelection = formData[field.name] as string[] || [];
                          const newSelection = e.target.checked
                            ? [...currentSelection, log.fileId]
                            : currentSelection.filter(id => id !== log.fileId);
                          setFormData(prev => ({ ...prev, [field.name]: newSelection }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {log.fileName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Hash: {log.currentHash.substring(0, 16)}...
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Created: {log.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        log.integrity.chainValid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.integrity.chainValid ? 'Valid' : 'Invalid'}
                      </div>
                    </label>
                  ))}
                </div>
                {custodyLogs.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No files in chain of custody system
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => setSelectedTemplate(null)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Preview
          </button>
          <button
            onClick={() => generateDocument(template, formData)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Generate Document
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading legal templates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Legal Templates
            </h2>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              Court-Ready
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-4">
          {[
            { id: 'templates', label: 'Templates', icon: FileText },
            { id: 'generated', label: 'Generated', icon: Download },
            { id: 'create', label: 'Create New', icon: Plus }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {id === 'generated' && generatedDocs.length > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                  {generatedDocs.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'templates' && !selectedTemplate && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="motion">Motion</option>
                <option value="affidavit">Affidavit</option>
                <option value="expert_report">Expert Report</option>
                <option value="exhibit_list">Exhibit List</option>
                <option value="discovery_response">Discovery Response</option>
              </select>
              <select
                value={filterJurisdiction}
                onChange={(e) => setFilterJurisdiction(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Jurisdictions</option>
                <option value="federal">Federal</option>
                <option value="state">State</option>
                <option value="local">Local</option>
              </select>
            </div>

            {/* Templates Grid */}
            <div className="grid gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        {template.type}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                        {template.jurisdiction}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span>Version {template.version}</span>
                      <span>Used {template.usage_count} times</span>
                      <span>{template.compliance_frameworks.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>Updated {template.updatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Templates Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search criteria or create a new template
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && selectedTemplate && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Generate Document: {selectedTemplate.name}
              </h3>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ← Back to Templates
              </button>
            </div>
            
            {renderTemplateForm(selectedTemplate)}
          </div>
        )}

        {activeTab === 'generated' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Generated Documents</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {generatedDocs.length} documents
              </div>
            </div>

            {generatedDocs.length === 0 ? (
              <div className="text-center py-8">
                <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Generated Documents
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Generate your first document from a template
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {generatedDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {doc.fileName}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {doc.templateName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          doc.status === 'final' ? 'bg-green-100 text-green-800' :
                          doc.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {doc.status}
                        </span>
                        <button
                          onClick={() => downloadDocument(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Generated:</span> {doc.generatedAt.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">By:</span> {doc.generatedBy}
                      </div>
                      {doc.caseNumber && (
                        <div>
                          <span className="font-medium">Case:</span> {doc.caseNumber}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Signatures:</span> {doc.signatures.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="text-center py-8">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Create New Template
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Template creation interface would be implemented here
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Start Creating
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 