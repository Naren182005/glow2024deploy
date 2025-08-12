import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 React Error Boundary caught an error:', error);
    console.error('🚨 Error Info:', errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-red-500 mb-4">🚨 Application Error</h1>
              <p className="text-xl text-white/80 mb-6">
                Something went wrong with the Glow24 Organics app.
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-red-400 mb-3">Error Details:</h3>
              <pre className="text-sm text-white/70 overflow-auto">
                {this.state.error?.toString()}
              </pre>
              {this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="text-red-400 cursor-pointer">Stack Trace</summary>
                  <pre className="text-xs text-white/60 mt-2 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#F2A83B] hover:bg-[#F2A83B]/80 text-black px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🔄 Reload Page
              </button>
              
              <div className="text-sm text-white/60">
                <p>If this error persists, please contact support:</p>
                <p className="text-[#F2A83B]">glow24@gmail.com</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-lg">
              <h4 className="text-lg font-semibold text-[#F2A83B] mb-2">🛠️ Troubleshooting Tips:</h4>
              <ul className="text-sm text-white/70 space-y-1 text-left">
                <li>• Clear your browser cache and cookies</li>
                <li>• Try using an incognito/private browsing window</li>
                <li>• Disable browser extensions temporarily</li>
                <li>• Check your internet connection</li>
                <li>• Try a different browser</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
