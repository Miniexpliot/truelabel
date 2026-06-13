import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-800 p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">UI Crashed</h1>
          <p className="text-sm bg-red-100 p-4 rounded-xl w-full max-w-2xl font-mono whitespace-pre-wrap overflow-auto">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
