/**
 * Templates Service - Industry-Specific Document Templates
 * Provides templates for different document types and industries
 */

class TemplatesService {
  constructor() {
    this.templates = this.initializeTemplates();
  }

  /**
   * Get industry templates based on plan type
   */
  async getIndustryTemplates(planType) {
    const availableTemplates = this.filterTemplatesByPlan(planType);
    
    return {
      templates: availableTemplates,
      planType,
      totalCount: availableTemplates.length,
      categories: this.getTemplateCategories(availableTemplates)
    };
  }

  /**
   * Get specific template by ID
   */
  async getTemplate(templateId, planType) {
    const template = this.templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }

    if (!this.isTemplateAvailableForPlan(template, planType)) {
      throw new Error('Template not available for your plan');
    }

    return template;
  }

  /**
   * Initialize all available templates
   */
  initializeTemplates() {
    return [
      // Financial Templates
      {
        id: 'invoice-standard',
        name: 'Standard Invoice',
        category: 'financial',
        description: 'Extract invoice number, date, amount, and vendor information',
        planRequired: 'professional',
        fields: [
          { name: 'invoice_number', type: 'string', required: true },
          { name: 'date', type: 'date', required: true },
          { name: 'total_amount', type: 'currency', required: true },
          { name: 'vendor', type: 'string', required: true },
          { name: 'due_date', type: 'date', required: false },
          { name: 'tax_amount', type: 'currency', required: false }
        ],
        patterns: {
          invoice_number: /(?:invoice|inv)[\s#:]*([a-z0-9-]+)/i,
          date: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
          total_amount: /(?:total|amount)[\s:]*\$?([0-9,]+\.?\d*)/i,
          vendor: /(?:from|vendor)[\s:]*([a-z\s]+)/i,
          due_date: /(?:due|payment)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
          tax_amount: /(?:tax|vat)[\s:]*\$?([0-9,]+\.?\d*)/i
        },
        confidence_threshold: 0.7
      },
      {
        id: 'receipt-retail',
        name: 'Retail Receipt',
        category: 'financial',
        description: 'Extract merchant, items, and total from retail receipts',
        planRequired: 'professional',
        fields: [
          { name: 'merchant', type: 'string', required: true },
          { name: 'date', type: 'date', required: true },
          { name: 'total', type: 'currency', required: true },
          { name: 'items', type: 'array', required: false },
          { name: 'payment_method', type: 'string', required: false }
        ],
        patterns: {
          merchant: /^([a-z\s]+)$/im,
          date: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
          total: /(?:total|amount)[\s:]*\$?([0-9,]+\.?\d*)/i,
          items: /(\d+\.?\d*\s+[a-z\s]+\s+\$?\d+\.?\d*)/gim,
          payment_method: /(?:card|cash|credit|debit)[\s:]*([a-z0-9*]+)/i
        },
        confidence_threshold: 0.6
      },

      // Legal Templates
      {
        id: 'contract-standard',
        name: 'Standard Contract',
        category: 'legal',
        description: 'Extract parties, dates, and key terms from contracts',
        planRequired: 'enterprise',
        fields: [
          { name: 'parties', type: 'array', required: true },
          { name: 'effective_date', type: 'date', required: true },
          { name: 'termination_date', type: 'date', required: false },
          { name: 'value', type: 'currency', required: false },
          { name: 'governing_law', type: 'string', required: false }
        ],
        patterns: {
          parties: /(?:between|party)[\s:]*([a-z\s,]+)(?:and|&)/i,
          effective_date: /(?:effective|start)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
          termination_date: /(?:expires?|ends?)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
          value: /(?:value|amount|worth)[\s:]*\$?([0-9,]+\.?\d*)/i,
          governing_law: /(?:governed|jurisdiction)[\s:]*([a-z\s]+)/i
        },
        confidence_threshold: 0.8
      },
      {
        id: 'nda-standard',
        name: 'Non-Disclosure Agreement',
        category: 'legal',
        description: 'Extract key terms from NDAs and confidentiality agreements',
        planRequired: 'enterprise',
        fields: [
          { name: 'disclosing_party', type: 'string', required: true },
          { name: 'receiving_party', type: 'string', required: true },
          { name: 'effective_date', type: 'date', required: true },
          { name: 'duration', type: 'string', required: false },
          { name: 'purpose', type: 'string', required: false }
        ],
        patterns: {
          disclosing_party: /(?:disclosing|discloser)[\s:]*([a-z\s]+)/i,
          receiving_party: /(?:receiving|recipient)[\s:]*([a-z\s]+)/i,
          effective_date: /(?:effective|dated)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
          duration: /(?:period|duration)[\s:]*([0-9]+\s*(?:years?|months?))/i,
          purpose: /(?:purpose|regarding)[\s:]*([a-z\s,]+)/i
        },
        confidence_threshold: 0.75
      },

      // Healthcare Templates
      {
        id: 'medical-report',
        name: 'Medical Report',
        category: 'healthcare',
        description: 'Extract patient info and key findings from medical reports',
        planRequired: 'enterprise',
        fields: [
          { name: 'patient_name', type: 'string', required: true },
          { name: 'patient_id', type: 'string', required: true },
          { name: 'date_of_service', type: 'date', required: true },
          { name: 'diagnosis', type: 'string', required: false },
          { name: 'physician', type: 'string', required: false }
        ],
        patterns: {
          patient_name: /(?:patient|name)[\s:]*([a-z\s,]+)/i,
          patient_id: /(?:id|mrn)[\s:]*([a-z0-9-]+)/i,
          date_of_service: /(?:date|service)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
          diagnosis: /(?:diagnosis|condition)[\s:]*([a-z\s,]+)/i,
          physician: /(?:physician|doctor|md)[\s:]*([a-z\s,]+)/i
        },
        confidence_threshold: 0.9,
        compliance: ['HIPAA']
      },

      // Real Estate Templates
      {
        id: 'lease-agreement',
        name: 'Lease Agreement',
        category: 'real_estate',
        description: 'Extract lease terms, rent, and property details',
        planRequired: 'professional',
        fields: [
          { name: 'landlord', type: 'string', required: true },
          { name: 'tenant', type: 'string', required: true },
          { name: 'property_address', type: 'string', required: true },
          { name: 'monthly_rent', type: 'currency', required: true },
          { name: 'lease_start', type: 'date', required: true },
          { name: 'lease_end', type: 'date', required: true }
        ],
        patterns: {
          landlord: /(?:landlord|lessor)[\s:]*([a-z\s,]+)/i,
          tenant: /(?:tenant|lessee)[\s:]*([a-z\s,]+)/i,
          property_address: /(?:property|address)[\s:]*([a-z0-9\s,]+)/i,
          monthly_rent: /(?:rent|monthly)[\s:]*\$?([0-9,]+\.?\d*)/i,
          lease_start: /(?:start|commence)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
          lease_end: /(?:end|expire)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
        },
        confidence_threshold: 0.7
      },

      // Insurance Templates
      {
        id: 'insurance-claim',
        name: 'Insurance Claim',
        category: 'insurance',
        description: 'Extract claim details and coverage information',
        planRequired: 'professional',
        fields: [
          { name: 'claim_number', type: 'string', required: true },
          { name: 'policy_number', type: 'string', required: true },
          { name: 'claimant', type: 'string', required: true },
          { name: 'incident_date', type: 'date', required: true },
          { name: 'claim_amount', type: 'currency', required: false }
        ],
        patterns: {
          claim_number: /(?:claim)[\s#:]*([a-z0-9-]+)/i,
          policy_number: /(?:policy)[\s#:]*([a-z0-9-]+)/i,
          claimant: /(?:claimant|insured)[\s:]*([a-z\s,]+)/i,
          incident_date: /(?:incident|loss)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
          claim_amount: /(?:amount|claim)[\s:]*\$?([0-9,]+\.?\d*)/i
        },
        confidence_threshold: 0.8
      },

      // HR Templates
      {
        id: 'employment-contract',
        name: 'Employment Contract',
        category: 'hr',
        description: 'Extract employment terms and compensation details',
        planRequired: 'professional',
        fields: [
          { name: 'employee_name', type: 'string', required: true },
          { name: 'position', type: 'string', required: true },
          { name: 'start_date', type: 'date', required: true },
          { name: 'salary', type: 'currency', required: false },
          { name: 'department', type: 'string', required: false }
        ],
        patterns: {
          employee_name: /(?:employee|name)[\s:]*([a-z\s,]+)/i,
          position: /(?:position|title|role)[\s:]*([a-z\s,]+)/i,
          start_date: /(?:start|commence)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
          salary: /(?:salary|compensation)[\s:]*\$?([0-9,]+\.?\d*)/i,
          department: /(?:department|division)[\s:]*([a-z\s,]+)/i
        },
        confidence_threshold: 0.7
      }
    ];
  }

  /**
   * Filter templates by plan type
   */
  filterTemplatesByPlan(planType) {
    const planHierarchy = {
      starter: [],
      professional: ['professional'],
      enterprise: ['professional', 'enterprise']
    };

    const allowedPlans = planHierarchy[planType] || [];
    
    return this.templates.filter(template => 
      allowedPlans.includes(template.planRequired)
    );
  }

  /**
   * Check if template is available for plan
   */
  isTemplateAvailableForPlan(template, planType) {
    const planHierarchy = {
      starter: [],
      professional: ['professional'],
      enterprise: ['professional', 'enterprise']
    };

    const allowedPlans = planHierarchy[planType] || [];
    return allowedPlans.includes(template.planRequired);
  }

  /**
   * Get template categories
   */
  getTemplateCategories(templates) {
    const categories = {};
    
    templates.forEach(template => {
      if (!categories[template.category]) {
        categories[template.category] = {
          name: this.getCategoryDisplayName(template.category),
          count: 0,
          templates: []
        };
      }
      
      categories[template.category].count++;
      categories[template.category].templates.push({
        id: template.id,
        name: template.name,
        description: template.description
      });
    });

    return categories;
  }

  /**
   * Get display name for category
   */
  getCategoryDisplayName(category) {
    const displayNames = {
      financial: 'Financial Documents',
      legal: 'Legal Documents',
      healthcare: 'Healthcare Documents',
      real_estate: 'Real Estate Documents',
      insurance: 'Insurance Documents',
      hr: 'Human Resources'
    };

    return displayNames[category] || category;
  }

  /**
   * Search templates by keyword
   */
  async searchTemplates(query, planType) {
    const availableTemplates = this.filterTemplatesByPlan(planType);
    
    if (!query) {
      return availableTemplates;
    }

    const searchTerm = query.toLowerCase();
    
    return availableTemplates.filter(template => 
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.category.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get template usage statistics
   */
  async getTemplateStats(templateId) {
    // In production, this would query the database for usage statistics
    return {
      templateId,
      totalUsage: 0,
      successRate: 0,
      averageConfidence: 0,
      lastUsed: null
    };
  }
}

module.exports = {
  getIndustryTemplates: async (planType) => {
    const service = new TemplatesService();
    return service.getIndustryTemplates(planType);
  },
  getTemplate: async (templateId, planType) => {
    const service = new TemplatesService();
    return service.getTemplate(templateId, planType);
  },
  searchTemplates: async (query, planType) => {
    const service = new TemplatesService();
    return service.searchTemplates(query, planType);
  }
}; 