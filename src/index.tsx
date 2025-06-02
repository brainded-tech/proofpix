import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import './styles/global.css';
import "./ProofPix.css";

// Clear localStorage error logs on startup to prevent quota issues
try {
  const errorLogs = localStorage.getItem('proofpix_error_log');
  if (errorLogs) {
    const logs = JSON.parse(errorLogs);
    if (logs.length > 50) { // If too many logs, clear them
      localStorage.removeItem('proofpix_error_log');
      console.info('🧹 Cleared accumulated error logs to prevent storage quota issues');
    }
  }
} catch (error) {
  // If there's any issue with the logs, just clear them
  localStorage.removeItem('proofpix_error_log');
  console.info('🧹 Cleared corrupted error logs');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Error boundary for the entire app
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          backgroundColor: '#0f1729', 
          color: '#f8fafc', 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1>🚨 Something went wrong</h1>
          <p>Please refresh the page to continue.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

root.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
); 