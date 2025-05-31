/**
 * API Configuration
 */

export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || '',
  version: '2.0.0',
  endpoints: {
    auth: '/api/auth',
    analytics: '/api/analytics',
    exif: '/api/exif',
    whitelabel: '/api/whitelabel',
    branding: '/api/branding',
    customFields: '/api/custom-fields',
    team: '/api/team'
  },
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  maxUploadSize: 50 * 1024 * 1024, // 50MB
  acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
}; 