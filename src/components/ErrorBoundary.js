// components/ErrorBoundary.js
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { createError, ERROR_TYPES, logError } from '../utils/errorUtils';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    const proofPixError = createError(
      ERROR_TYPES.EXIF_EXTRACTION_FAILED,
      error,
      { errorInfo, component: 'ErrorBoundary' }
    );

    logError(proofPixError, this.props.analytics);

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">
              <LucideIcons.AlertCircle size={48} />
            </div>
            
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message}</p>
            
            <div className="error-boundary-actions">
              <button 
                onClick={this.handleRetry}
                className="error-boundary-retry"
              >
                <LucideIcons.RefreshCw size={16} />
                Try Again
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="error-boundary-reload"
              >
                <LucideIcons.RotateCcw size={16} />
                Refresh Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-boundary-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error?.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
