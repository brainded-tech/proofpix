// src/components/TimeShot.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import TimeShot from './TimeShot';

describe('TimeShot Component', () => {
  test('renders upload area', () => {
    render(<TimeShot />);
    const uploadText = screen.getByText(/Drag & drop an image here/i);
    expect(uploadText).toBeInTheDocument();
  });
  
  test('renders app title', () => {
    render(<TimeShot />);
    const titleElement = screen.getByText(/TimeShot/i);
    expect(titleElement).toBeInTheDocument();
  });
  
  test('renders privacy notice', () => {
    render(<TimeShot />);
    const privacyText = screen.getByText(/All image processing happens in your browser/i);
    expect(privacyText).toBeInTheDocument();
  });
});