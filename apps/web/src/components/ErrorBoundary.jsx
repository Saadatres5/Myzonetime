import React from 'react';

/**
 * ErrorBoundary — catches render errors in its subtree.
 *
 * IMPORTANT: This component is rendered with key={location.pathname} in App.jsx
 * so React fully unmounts/remounts it on every route change, resetting hasError.
 * Without that key the error state would persist across all subsequent navigations.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for debugging — add your error tracking service here
    console.error('[ErrorBoundary] Caught error:', error?.message || error);
    console.error('[ErrorBoundary] Component stack:', info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center"
          id="main-content"
        >
          <div className="space-y-6 max-w-md">
            <div className="text-6xl" aria-hidden="true">⏰</div>
            <h1 className="text-3xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please refresh the page or go back to the home page.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="px-6 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
              >
                Go Home
              </a>
            </div>
            {/* Dev-mode error detail */}
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="text-left text-xs text-destructive bg-destructive/10 rounded-xl p-4 overflow-auto max-h-48 mt-4">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
