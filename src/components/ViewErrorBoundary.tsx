import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ViewErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ViewErrorBoundaryState {
  hasError: boolean;
}

export class ViewErrorBoundary extends Component<ViewErrorBoundaryProps, ViewErrorBoundaryState> {
  state: ViewErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ViewErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('View navigation error:', error, info);
  }

  private handleReturn = () => {
    this.setState({ hasError: false });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
          <div className="panel w-full max-w-md rounded-xl p-6 text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
              Telemetry Interrupted
            </p>
            <h2 className="mt-2 font-display text-xl font-bold text-ink">
              Something went wrong — Return to Solar System
            </h2>
            <p className="mt-2 font-sans text-sm text-muted">
              A display error occurred while switching views. Resetting to the Solar System map will restore your mission view.
            </p>
            <button
              type="button"
              onClick={this.handleReturn}
              className="mt-5 rounded-lg border border-line-strong bg-[#0E1320] px-4 py-2 font-sans text-sm font-bold text-ink transition-colors hover:border-sun-light"
            >
              Return to Solar System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
