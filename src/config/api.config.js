// API Configuration for ProofPix Enterprise
const API_CONFIG = {
  // Base URLs
  PRODUCTION_URL: 'https://app.proofpixapp.com',
  DEVELOPMENT_URL: 'http://localhost:5000',
  STAGING_URL: 'https://app.proofpixapp.com',
  
  // Get the appropriate base URL based on environment
  getBaseUrl: () => {
    // Force correct production URL - ignore environment variable if it's the old domain
    if (process.env.REACT_APP_API_URL && 
        !process.env.REACT_APP_API_URL.includes('proofpix-backend.onrender.com')) {
      return process.env.REACT_APP_API_URL;
    }
    
    return process.env.NODE_ENV === 'production' 
      ? API_CONFIG.PRODUCTION_URL 
      : API_CONFIG.DEVELOPMENT_URL;
  },
  
  // API Endpoints
  endpoints: {
    health: '/health',
    extract: '/api/exif/extract',
    extractBatch: '/api/exif/extract/batch',
    usage: '/api/exif/usage',
    docs: '/api/docs',
    analytics: '/api/analytics/dashboard',
    analyticsHealth: '/api/analytics/health',
    auth: '/api/auth/me',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    validateSession: '/api/auth/validate-session'
  },
  
  // Request configuration
  timeout: 10000,
  maxRetries: 3,
  retryDelay: 1000
};

// Named export for API_CONFIG
export { API_CONFIG };

// Utility function to build full API URLs
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_CONFIG.getBaseUrl();
  const endpointPath = API_CONFIG.endpoints[endpoint] || endpoint;
  return `${baseUrl}${endpointPath}`;
};

// API client utility
export const apiClient = {
  get: async (endpoint, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
  
  post: async (endpoint, data, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },
  
  upload: async (endpoint, formData, options = {}) => {
    const url = buildApiUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
};

export default API_CONFIG; 