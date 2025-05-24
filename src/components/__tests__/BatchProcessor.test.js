import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BatchProcessor from '../BatchProcessor';
import { useImageProcessing } from '../../hooks/useImageProcessing';
import { useErrorHandler } from '../../hooks/useErrorHandler';

// Mock the hooks
jest.mock('../../hooks/useImageProcessing');
jest.mock('../../hooks/useErrorHandler');

describe('BatchProcessor', () => {
  const mockProcessImage = jest.fn();
  const mockAddError = jest.fn();
  const mockHandleAsyncError = jest.fn();

  beforeEach(() => {
    useImageProcessing.mockReturnValue({ processImage: mockProcessImage });
    useErrorHandler.mockReturnValue({ addError: mockAddError, handleAsyncError: mockHandleAsyncError });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload area correctly', () => {
    render(<BatchProcessor />);
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
    expect(screen.getByText(/0 \/ 10 files added/i)).toBeInTheDocument();
  });

  it('handles file drops correctly', async () => {
    const onProcessingComplete = jest.fn();
    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
    ];

    render(<BatchProcessor onProcessingComplete={onProcessingComplete} />);

    const dropzone = screen.getByText(/drag & drop/i).closest('div');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files
      }
    });

    await waitFor(() => {
      expect(screen.getByText(/2 \/ 10 files added/i)).toBeInTheDocument();
      expect(screen.getByText('test1.jpg')).toBeInTheDocument();
      expect(screen.getByText('test2.jpg')).toBeInTheDocument();
    });
  });

  it('enforces file limit', async () => {
    const maxFiles = 2;
    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      new File(['test3'], 'test3.jpg', { type: 'image/jpeg' })
    ];

    render(<BatchProcessor maxFiles={maxFiles} />);

    const dropzone = screen.getByText(/drag & drop/i).closest('div');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files
      }
    });

    await waitFor(() => {
      expect(mockAddError).toHaveBeenCalledWith(`Maximum ${maxFiles} files allowed`);
    });
  });

  it('processes files correctly', async () => {
    const onProcessingComplete = jest.fn();
    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })
    ];

    mockProcessImage.mockResolvedValueOnce({ success: true, data: 'test1' });
    mockProcessImage.mockResolvedValueOnce({ success: true, data: 'test2' });

    render(<BatchProcessor onProcessingComplete={onProcessingComplete} />);

    const dropzone = screen.getByText(/drag & drop/i).closest('div');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files
      }
    });

    await waitFor(() => {
      const processButton = screen.getByText(/process.*files/i);
      expect(processButton).toBeInTheDocument();
      userEvent.click(processButton);
    });

    await waitFor(() => {
      expect(mockProcessImage).toHaveBeenCalledTimes(2);
      expect(onProcessingComplete).toHaveBeenCalled();
    });
  });

  it('handles processing errors correctly', async () => {
    const onError = jest.fn();
    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' })
    ];

    mockProcessImage.mockRejectedValueOnce(new Error('Processing failed'));

    render(<BatchProcessor onError={onError} />);

    const dropzone = screen.getByText(/drag & drop/i).closest('div');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files
      }
    });

    await waitFor(() => {
      const processButton = screen.getByText(/process.*files/i);
      userEvent.click(processButton);
    });

    await waitFor(() => {
      expect(mockHandleAsyncError).toHaveBeenCalled();
      expect(screen.getByText(/retry/i)).toBeInTheDocument();
    });
  });

  it('allows removing files', async () => {
    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' })
    ];

    render(<BatchProcessor />);

    const dropzone = screen.getByText(/drag & drop/i).closest('div');
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files
      }
    });

    await waitFor(() => {
      expect(screen.getByText('test1.jpg')).toBeInTheDocument();
      const removeButton = screen.getByLabelText(/remove test1.jpg/i);
      userEvent.click(removeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('test1.jpg')).not.toBeInTheDocument();
      expect(screen.getByText(/0 \/ 10 files added/i)).toBeInTheDocument();
    });
  });
}); 