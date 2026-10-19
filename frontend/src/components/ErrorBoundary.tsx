import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-background)]">
          <div className="text-center max-w-md">
            <span className="text-5xl">⚠️</span>
            <h1 className="text-2xl font-extrabold text-stone-900 mt-4 mb-2 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-xs text-stone-500 mb-6">
              {this.state.error?.message || 'An unexpected error occurred. Please refresh the page.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[var(--color-primary)] text-white text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-xl transition hover:bg-[var(--color-primary-hover)]"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
