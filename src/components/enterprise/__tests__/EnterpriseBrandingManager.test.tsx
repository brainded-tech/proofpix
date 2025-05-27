import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EnterpriseBrandingManager } from '../EnterpriseBrandingManager';

// Mock the validator
jest.mock('../../../utils/enterpriseBrandingValidator', () => ({
  enterpriseBrandingValidator: {
    getBrandAssets: jest.fn(() => []),
    validateAllAssets: jest.fn(() => Promise.resolve(new Map())),
    generateComplianceReport: jest.fn(() => Promise.resolve({
      totalAssets: 0,
      overallScore: 100,
      complianceByStandard: {},
      generatedAt: new Date(),
      recommendations: []
    })),
    addBrandAsset: jest.fn(() => Promise.resolve('test-id')),
    deleteBrandAsset: jest.fn(() => true)
  }
}));

describe('EnterpriseBrandingManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main interface', async () => {
    render(<EnterpriseBrandingManager />);
    
    expect(screen.getByText('Enterprise Branding Manager')).toBeInTheDocument();
    expect(screen.getByText('Manage and validate your brand assets')).toBeInTheDocument();
  });

  it('renders navigation tabs', async () => {
    render(<EnterpriseBrandingManager />);
    
    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
    expect(screen.getByText('Compliance')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders asset type filters', async () => {
    render(<EnterpriseBrandingManager />);
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Font')).toBeInTheDocument();
    expect(screen.getByText('Template')).toBeInTheDocument();
  });

  it('renders upload cards', async () => {
    render(<EnterpriseBrandingManager />);
    
    expect(screen.getByText('Upload Logo')).toBeInTheDocument();
    expect(screen.getByText('Add Color')).toBeInTheDocument();
    expect(screen.getByText('Add Font')).toBeInTheDocument();
    expect(screen.getByText('Upload Template')).toBeInTheDocument();
  });

  it('switches between tabs', async () => {
    render(<EnterpriseBrandingManager />);
    
    // Click on Validation tab
    fireEvent.click(screen.getByText('Validation'));
    expect(screen.getByText('Validation Results')).toBeInTheDocument();
    
    // Click on Compliance tab
    fireEvent.click(screen.getByText('Compliance'));
    expect(screen.getByText('Compliance Report')).toBeInTheDocument();
    
    // Click on Settings tab
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Branding validation settings and preferences will be available here.')).toBeInTheDocument();
  });

  it('filters assets by type', async () => {
    render(<EnterpriseBrandingManager />);
    
    // Click on Logo filter
    fireEvent.click(screen.getByText('Logo'));
    
    // The Logo button should be active (blue background)
    const logoButton = screen.getByText('Logo');
    expect(logoButton).toHaveClass('bg-blue-600');
  });

  it('shows color picker when adding color', async () => {
    render(<EnterpriseBrandingManager />);
    
    // Click on Add Color button
    const addColorButton = screen.getByText('Add Color');
    fireEvent.click(addColorButton);
    
    // Should show color picker interface
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Color name')).toBeInTheDocument();
    });
  });

  it('handles refresh button', async () => {
    render(<EnterpriseBrandingManager />);
    
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    // Should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders compliance metrics', async () => {
    render(<EnterpriseBrandingManager />);
    
    // Switch to compliance tab
    fireEvent.click(screen.getByText('Compliance'));
    
    await waitFor(() => {
      expect(screen.getByText('Total Assets')).toBeInTheDocument();
      expect(screen.getByText('Compliance Score')).toBeInTheDocument();
      expect(screen.getByText('Standards Checked')).toBeInTheDocument();
    });
  });

  it('handles export button', async () => {
    render(<EnterpriseBrandingManager />);
    
    const exportButton = screen.getByText('Export Report');
    expect(exportButton).toBeInTheDocument();
    
    // Button should be clickable
    fireEvent.click(exportButton);
  });
}); 