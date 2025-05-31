import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { 
  MarketplacePlugin, 
  APIEndpoint, 
  WorkflowTemplate,
  WhiteLabelConfig,
  PartnerIntegration 
} from '../services/enterpriseMarketplaceService';

// Test providers wrapper
const TestProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

// Test data factories
export const createMockPlugin = (overrides: Partial<MarketplacePlugin> = {}): MarketplacePlugin => ({
  id: 'mock-plugin-1',
  name: 'Mock Plugin',
  description: 'A mock plugin for testing',
  version: '1.0.0',
  category: 'processing',
  developer: {
    name: 'Mock Developer',
    verified: true,
    rating: 4.5,
    supportUrl: 'https://mock.com/support'
  },
  pricing: {
    model: 'free',
    price: 0,
    currency: 'USD'
  },
  compatibility: {
    minVersion: '1.0.0',
    dependencies: [],
    conflicts: []
  },
  permissions: ['file.read'],
  installation: {
    type: 'npm',
    source: '@mock/plugin',
    config: {}
  },
  metrics: {
    downloads: 1000,
    rating: 4.5,
    reviews: 50,
    activeInstalls: 800,
    lastUpdated: new Date()
  },
  documentation: {
    readme: 'Mock plugin documentation',
    examples: ['example.js'],
    changelog: 'v1.0.0: Initial release'
  },
  status: 'active',
  tags: ['utility', 'mock'],
  screenshots: [],
  featured: false,
  ...overrides
});

export const createMockAPIEndpoint = (overrides: Partial<APIEndpoint> = {}): APIEndpoint => ({
  id: 'mock-api-1',
  name: 'Mock API',
  description: 'A mock API endpoint for testing',
  version: '1.0.0',
  category: 'document',
  method: 'POST',
  endpoint: '/api/mock',
  authentication: 'api-key',
  rateLimit: { requests: 1000, window: '1h', tier: 'free' },
  pricing: {
    model: 'free',
    cost: 0
  },
  parameters: [],
  responses: [],
  documentation: 'https://docs.mock.com',
  examples: [],
  metrics: {
    totalRequests: 1000,
    successRate: 99.0,
    avgResponseTime: 200,
    popularityScore: 4.5
  },
  status: 'active',
  ...overrides
});

export const createMockWorkflowTemplate = (overrides: Partial<WorkflowTemplate> = {}): WorkflowTemplate => ({
  id: 'mock-workflow-1',
  name: 'Mock Workflow',
  description: 'A mock workflow template for testing',
  version: '1.0.0',
  category: 'document-processing',
  complexity: 'simple',
  estimatedTime: '60 minutes',
  steps: [],
  triggers: [],
  conditions: [],
  actions: [],
  variables: [],
  permissions: [],
  author: {
    name: 'Mock Author',
    type: 'community',
    verified: true
  },
  metrics: {
    usage: 100,
    rating: 4.5,
    successRate: 95.0,
    avgExecutionTime: 30
  },
  pricing: {
    model: 'free'
  },
  tags: ['mock'],
  industry: ['general'],
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

export const createMockWhiteLabelSolution = (overrides = {}) => ({
  id: 'mock-wl-1',
  name: 'Mock White Label',
  description: 'A mock white label solution',
  configuration: {
    branding: {
      logo: 'https://mock.com/logo.png',
      colors: { primary: '#000000', secondary: '#ffffff' },
      domain: 'mock.example.com'
    },
    features: ['basic'],
    authentication: 'basic',
    billing: { model: 'subscription', price: 99 }
  },
  deployment: {
    type: 'cloud',
    region: 'us-east-1',
    status: 'active',
    url: 'https://mock.example.com'
  },
  support: {
    level: 'basic',
    contact: 'support@mock.com'
  },
  analytics: {
    users: 10,
    usage: 100,
    uptime: 99.0
  },
  compliance: {
    certifications: [],
    audits: []
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

export const createMockPartnerIntegration = (overrides = {}) => ({
  id: 'mock-partner-1',
  name: 'Mock Partner',
  type: 'technology',
  tier: 'bronze',
  contact: {
    name: 'Mock Contact',
    email: 'contact@mock.com',
    phone: '+1-555-0000'
  },
  integration: {
    type: 'api',
    status: 'active',
    endpoints: ['https://api.mock.com'],
    authentication: 'api-key'
  },
  revenue: {
    model: 'revenue-share',
    percentage: 10,
    total: 1000
  },
  marketing: {
    cobranded: false,
    materials: []
  },
  support: {
    level: 'basic',
    contact: 'support@mock.com'
  },
  metrics: {
    satisfaction: 4.0,
    responseTime: 5.0,
    uptime: 99.0
  },
  compliance: {
    certifications: [],
    lastAudit: new Date()
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

export const createMockAnalytics = (overrides = {}) => ({
  totalRevenue: 10000,
  monthlyGrowth: 15.5,
  activeUsers: 500,
  conversionRate: 3.2,
  ...overrides
});

// Test helpers
export const simulateNetworkDelay = (ms: number = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const createMockFile = (name: string, type: string, size: number = 1024) => {
  return new File(['mock content'], name, { type, lastModified: Date.now() });
};

export const createMockEvent = (type: string, properties: any = {}) => {
  return {
    type,
    timestamp: new Date(),
    properties,
    ...properties
  };
};

// Error boundary testing
export class TestErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary">Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Mock service responses
export function createSuccessResponse<T>(data: T) {
  return {
    success: true,
    data,
    message: 'Operation completed successfully'
  };
}

export function createErrorResponse(error: string) {
  return {
    success: false,
    error,
    message: 'Operation failed'
  };
} 