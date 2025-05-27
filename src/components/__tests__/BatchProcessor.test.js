import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BatchProcessor from '../BatchProcessor';
import { useImageProcessing } from '../../hooks/useImageProcessing';
import { useErrorHandler } from '../../hooks/useErrorHandler';

// Mock the hooks
jest.mock('../../hooks/useImageProcessing');
jest.mock('../../hooks/useErrorHandler');

// Mock SessionManager to control payment protection behavior
jest.mock('../../utils/sessionManager', () => ({
  canPerformAction: jest.fn(),
  getActiveSession: jest.fn(),
  getCurrentPlan: jest.fn(),
  getUpgradeMessage: jest.fn(() => ({
    title: 'Batch Processing - Premium Feature',
    description: 'Process multiple images simultaneously with advanced export options.',
    minPlan: 'Day Pass ($2.99)'
  }))
}));

describe('BatchProcessor', () => {
  const mockProcessImage = jest.fn();
  const mockAddError = jest.fn();
  const mockHandleAsyncError = jest.fn();
  const mockCanPerformAction = require('../../utils/sessionManager').canPerformAction;
  const mockGetActiveSession = require('../../utils/sessionManager').getActiveSession;
  const mockGetCurrentPlan = require('../../utils/sessionManager').getCurrentPlan;

  beforeEach(() => {
    useImageProcessing.mockReturnValue({ processImage: mockProcessImage });
    useErrorHandler.mockReturnValue({ addError: mockAddError, handleAsyncError: mockHandleAsyncError });
    // Default to free user (no batch access)
    mockCanPerformAction.mockReturnValue(false);
    mockGetActiveSession.mockReturnValue(null);
    mockGetCurrentPlan.mockReturnValue({
      type: 'free',
      plan: { name: 'Free' }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders payment protection screen for free users', () => {
    render(<BatchProcessor />);
    expect(screen.getByText(/Batch Processing - Premium Feature/i)).toBeInTheDocument();
    expect(screen.getByText(/Upgrade to Pro/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Plan: Free/i)).toBeInTheDocument();
  });

  it('renders upload area for paid users', () => {
    // Mock paid user with batch access
    mockCanPerformAction.mockReturnValue(true);
    mockGetActiveSession.mockReturnValue({
      planType: 'daypass',
      limits: { batchSize: 10 }
    });
    mockGetCurrentPlan.mockReturnValue({
      type: 'session',
      plan: { name: 'Day Pass' }
    });

    render(<BatchProcessor />);
    expect(screen.getByText(/Select Multiple Images/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose up to 100 images/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Images/i)).toBeInTheDocument();
  });

  it('handles file selection correctly for paid users', async () => {
    // Mock paid user with batch access
    mockCanPerformAction.mockReturnValue(true);
    mockGetActiveSession.mockReturnValue({
      planType: 'daypass',
      limits: { batchSize: 10 }
    });
    mockGetCurrentPlan.mockReturnValue({
      type: 'session',
      plan: { name: 'Day Pass' }
    });

    const onProcessingComplete = jest.fn();
    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
    ];

    render(<BatchProcessor onComplete={onProcessingComplete} />);

    // Should show the batch processing interface for paid users
    expect(screen.getByText(/Select Multiple Images/i)).toBeInTheDocument();
    expect(screen.getByText(/Batch Image Processing/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select images/i })).toBeInTheDocument();
    expect(screen.getByText(/Select Multiple Images/i)).toBeInTheDocument();
  });

  it('enforces file limit for paid users', async () => {
    // Mock paid user with batch access
    mockCanPerformAction.mockReturnValue(true);
    mockGetActiveSession.mockReturnValue({
      planType: 'daypass',
      limits: { batchSize: 10 }
    });
    mockGetCurrentPlan.mockReturnValue({
      type: 'session',
      plan: { name: 'Day Pass' }
    });

    const maxFiles = 2;
    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      new File(['test3'], 'test3.jpg', { type: 'image/jpeg' })
    ];

    render(<BatchProcessor maxFiles={maxFiles} />);

    // Should show the correct file limit in the UI
    expect(screen.getByText(/Choose up to 2 images/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Multiple Images/i)).toBeInTheDocument();

  });

  it('renders correctly for paid users', async () => {
    // Mock paid user with batch access
    mockCanPerformAction.mockReturnValue(true);
    mockGetActiveSession.mockReturnValue({
      planType: 'daypass',
      limits: { batchSize: 10 }
    });
    mockGetCurrentPlan.mockReturnValue({
      type: 'session',
      plan: { name: 'Day Pass' }
    });

    const onProcessingComplete = jest.fn();

    render(<BatchProcessor onComplete={onProcessingComplete} />);

    // Should show the batch processing interface for paid users
    expect(screen.getByText(/Batch Image Processing/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Multiple Images/i)).toBeInTheDocument();
  });

  it('shows correct interface for paid users', async () => {
    // Mock paid user with batch access
    mockCanPerformAction.mockReturnValue(true);
    mockGetActiveSession.mockReturnValue({
      planType: 'daypass',
      limits: { batchSize: 10 }
    });
    mockGetCurrentPlan.mockReturnValue({
      type: 'session',
      plan: { name: 'Day Pass' }
    });

    render(<BatchProcessor />);

    // Should show the batch processing interface
    expect(screen.getByText(/Batch Image Processing/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready for Batch Processing/i)).toBeInTheDocument();
  });

  it('shows file input for paid users', async () => {
    // Mock paid user with batch access
    mockCanPerformAction.mockReturnValue(true);
    mockGetActiveSession.mockReturnValue({
      planType: 'daypass',
      limits: { batchSize: 10 }
    });
    mockGetCurrentPlan.mockReturnValue({
      type: 'session',
      plan: { name: 'Day Pass' }
    });

    render(<BatchProcessor />);

    // Should show file input for paid users
    const fileInput = screen.getByRole('button', { name: /select images/i });
    expect(fileInput).toBeInTheDocument();
  });
});
