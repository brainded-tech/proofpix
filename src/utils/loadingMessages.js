// Contextual Loading Messages for ProofPix
// Engaging, benefit-focused copy for different processing stages

export const LOADING_MESSAGES = {
  // Initial file processing
  UPLOAD: {
    starting: "Securely receiving your photo...",
    progress: "Your photo stays on your device—we're just getting started...",
    complete: "Photo received! Now let's see what secrets it holds..."
  },

  // Metadata extraction stages
  ANALYSIS: {
    starting: "Analyzing your photo's hidden information...",
    camera: "Discovering camera settings and technical details...",
    location: "Checking for location data and GPS coordinates...",
    timestamp: "Verifying when this photo was actually taken...",
    editing: "Detecting any photo modifications or edits...",
    complete: "Analysis complete! Here's what we found..."
  },

  // Batch processing
  BATCH: {
    starting: "Processing multiple photos—this saves you tons of time...",
    progress: (current, total) => `Analyzing photo ${current} of ${total}...`,
    organizing: "Organizing results by date and location...",
    complete: "All photos analyzed! Ready to explore your results..."
  },

  // Report generation
  REPORTS: {
    starting: "Creating your professional report...",
    formatting: "Formatting data for easy reading...",
    security: "Adding security features and verification...",
    complete: "Your report is ready for download!"
  },

  // Comparison tool
  COMPARISON: {
    starting: "Comparing photos for differences...",
    metadata: "Analyzing metadata differences...",
    timeline: "Checking timestamps and sequences...",
    complete: "Comparison complete! Here are the differences..."
  },

  // Export operations
  EXPORT: {
    pdf: "Generating your professional PDF report...",
    csv: "Preparing data for spreadsheet export...",
    json: "Formatting technical data for export...",
    complete: "Export ready! Your data is prepared for download..."
  },

  // Error recovery
  RETRY: {
    starting: "Trying again with enhanced processing...",
    progress: "Sometimes photos need a little extra attention...",
    complete: "Success! We got it working..."
  },

  // Privacy-focused messages
  PRIVACY: {
    local: "Everything happens in your browser—your photos never leave your device",
    secure: "Processing locally for maximum privacy...",
    complete: "Analysis complete—your privacy protected throughout"
  }
};

// Context-aware message selector
export const getLoadingMessage = (stage, context = {}) => {
  const { progress, current, total, operation } = context;

  switch (stage) {
    case 'upload':
      if (progress < 30) return LOADING_MESSAGES.UPLOAD.starting;
      if (progress < 80) return LOADING_MESSAGES.UPLOAD.progress;
      return LOADING_MESSAGES.UPLOAD.complete;

    case 'analysis':
      if (progress < 20) return LOADING_MESSAGES.ANALYSIS.starting;
      if (progress < 40) return LOADING_MESSAGES.ANALYSIS.camera;
      if (progress < 60) return LOADING_MESSAGES.ANALYSIS.location;
      if (progress < 80) return LOADING_MESSAGES.ANALYSIS.timestamp;
      if (progress < 95) return LOADING_MESSAGES.ANALYSIS.editing;
      return LOADING_MESSAGES.ANALYSIS.complete;

    case 'batch':
      if (current && total) {
        return LOADING_MESSAGES.BATCH.progress(current, total);
      }
      if (progress < 10) return LOADING_MESSAGES.BATCH.starting;
      if (progress < 90) return LOADING_MESSAGES.BATCH.organizing;
      return LOADING_MESSAGES.BATCH.complete;

    case 'report':
      if (progress < 30) return LOADING_MESSAGES.REPORTS.starting;
      if (progress < 70) return LOADING_MESSAGES.REPORTS.formatting;
      if (progress < 90) return LOADING_MESSAGES.REPORTS.security;
      return LOADING_MESSAGES.REPORTS.complete;

    case 'comparison':
      if (progress < 40) return LOADING_MESSAGES.COMPARISON.starting;
      if (progress < 80) return LOADING_MESSAGES.COMPARISON.metadata;
      return LOADING_MESSAGES.COMPARISON.complete;

    case 'export':
      const exportType = operation || 'pdf';
      if (progress < 90) return LOADING_MESSAGES.EXPORT[exportType] || LOADING_MESSAGES.EXPORT.pdf;
      return LOADING_MESSAGES.EXPORT.complete;

    case 'retry':
      if (progress < 50) return LOADING_MESSAGES.RETRY.starting;
      if (progress < 90) return LOADING_MESSAGES.RETRY.progress;
      return LOADING_MESSAGES.RETRY.complete;

    case 'privacy':
      if (progress < 50) return LOADING_MESSAGES.PRIVACY.local;
      if (progress < 90) return LOADING_MESSAGES.PRIVACY.secure;
      return LOADING_MESSAGES.PRIVACY.complete;

    default:
      return "Working on it...";
  }
};

// Encouraging messages for longer operations
export const ENCOURAGEMENT_MESSAGES = [
  "Your photos contain amazing hidden information...",
  "Every photo tells a story—we're reading yours...",
  "Professional-grade analysis takes just a moment...",
  "Your privacy is protected throughout this process...",
  "Almost done—the results will be worth the wait...",
  "Complex analysis made simple—just for you..."
];

// Get random encouragement message
export const getEncouragementMessage = () => {
  return ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
};

// Industry-specific loading messages
export const INDUSTRY_MESSAGES = {
  legal: {
    analysis: "Preparing court-ready evidence analysis...",
    report: "Generating forensic-grade documentation...",
    complete: "Legal documentation ready for submission..."
  },
  insurance: {
    analysis: "Detecting potential fraud indicators...",
    report: "Creating claim verification report...",
    complete: "Fraud analysis complete—here's what we found..."
  },
  realestate: {
    analysis: "Verifying property documentation...",
    report: "Preparing MLS-ready photo reports...",
    complete: "Property verification complete..."
  },
  healthcare: {
    analysis: "Processing with HIPAA compliance...",
    report: "Creating secure medical documentation...",
    complete: "HIPAA-compliant analysis complete..."
  }
};

// Get industry-specific message
export const getIndustryMessage = (industry, stage, progress = 0) => {
  const industryMessages = INDUSTRY_MESSAGES[industry];
  if (!industryMessages) return getLoadingMessage(stage, { progress });

  if (progress < 50) return industryMessages.analysis;
  if (progress < 90) return industryMessages.report;
  return industryMessages.complete;
}; 