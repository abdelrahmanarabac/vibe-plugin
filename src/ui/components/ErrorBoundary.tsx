import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: any;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });

        // Optional: Send error to logging service
        // logErrorToService(error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleCopyError = () => {
        const errorText = `
Error: ${this.state.error?.message}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
        `.trim();
        navigator.clipboard.writeText(errorText);
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-200 p-8">
                    <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-lg p-6 shadow-2xl shadow-red-500/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-red-400">System Error</h2>
                                <p className="text-xs text-slate-500">Something went wrong</p>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded p-3 mb-4 border border-white/5">
                            <p className="text-sm font-mono text-red-300">{this.state.error?.message}</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReload}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded font-bold text-sm transition-colors"
                            >
                                Reload Plugin
                            </button>
                            <button
                                onClick={this.handleCopyError}
                                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-sm transition-colors border border-white/10"
                            >
                                Copy Error
                            </button>
                        </div>

                        <details className="mt-4 text-xs">
                            <summary className="cursor-pointer text-slate-500 hover:text-slate-400">Technical Details</summary>
                            <pre className="mt-2 bg-black/60 p-2 rounded border border-white/5 text-[10px] text-red-400 overflow-auto max-h-40">
                                {this.state.error?.stack}
                            </pre>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
