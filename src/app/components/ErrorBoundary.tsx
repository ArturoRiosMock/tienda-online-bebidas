import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error capturado:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 bg-gray-50">
          <div className="text-center max-w-sm">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-lg font-semibold text-[#212121] mb-2">
              Algo salió mal
            </h2>
            <p className="text-[#717182] text-sm mb-6">
              No pudimos cargar esta página. Por favor intenta de nuevo.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-[#0c3c1f] text-white px-6 py-3 rounded-lg hover:bg-[#0a3019] transition-colors font-medium text-sm mr-3"
            >
              Reintentar
            </button>
            <a
              href="/"
              className="inline-block border border-[#0c3c1f] text-[#0c3c1f] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              Ir al inicio
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
